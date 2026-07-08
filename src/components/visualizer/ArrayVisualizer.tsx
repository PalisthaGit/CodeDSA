'use client'

import { useState } from 'react'

type Operation = 'access' | 'update' | 'add' | 'remove' | 'traverse'
type ArrayVisualizerProps = { operation?: Operation | 'all' }
type Slot = { value: string | null }
type HighlightColor = 'blue' | 'green' | 'red' | 'purple'

type CardAnim = {
  xOffset: number
  noTransition: boolean
  highlight: HighlightColor | null
  elevated: boolean
}

const ARRAY_SIZE = 7
const CARD_STEP = 68 // 62px card + 6px gap

const INITIAL_SLOTS: Slot[] = [
  { value: 'Blinding Lights' },
  { value: 'Levitating' },
  { value: 'Stay' },
  { value: 'Heat Waves' },
  { value: 'Peaches' },
  { value: null },
  { value: null },
]

const OP_LABELS: Record<Operation, string> = {
  access: 'Access',
  update: 'Update',
  add: 'Add',
  remove: 'Remove',
  traverse: 'Traverse',
}

const ALL_OPS: Operation[] = ['access', 'update', 'add', 'remove', 'traverse']

type PseudoLine = { text: string; indent: 0 | 1 | 2 }

const PSEUDOCODE: Record<Operation, PseudoLine[]> = {
  access: [
    { text: 'int access(int arr[], int i) {', indent: 0 },
    { text: '  return arr[i];', indent: 0 },
  ],
  update: [
    { text: 'void update(int arr[], int i, int v) {', indent: 0 },
    { text: '  arr[i] = v;', indent: 0 },
  ],
  add: [
    { text: 'void insert(int arr[], int& n, int i, int v) {', indent: 0 },
    { text: '  for (int j = n-1; j >= i; j--)', indent: 0 },
    { text: '    arr[j+1] = arr[j];', indent: 0 },
    { text: '  arr[i] = v;', indent: 0 },
    { text: '  n++;', indent: 0 },
  ],
  remove: [
    { text: 'void remove(int arr[], int& n, int i) {', indent: 0 },
    { text: '  for (int j = i; j < n-1; j++)', indent: 0 },
    { text: '    arr[j] = arr[j+1];', indent: 0 },
    { text: '  arr[n-1] = 0;', indent: 0 },
    { text: '  n--;', indent: 0 },
  ],
  traverse: [
    { text: 'void traverse(int arr[], int n) {', indent: 0 },
    { text: '  for (int i = 0; i < n; i++)', indent: 0 },
    { text: '    visit(arr[i]);', indent: 0 },
  ],
}

function makeAnims(): CardAnim[] {
  return Array.from({ length: ARRAY_SIZE }, () => ({
    xOffset: 0,
    noTransition: false,
    highlight: null,
    elevated: false,
  }))
}

function sleep(ms: number) {
  return new Promise<void>(r => setTimeout(r, ms))
}

export function ArrayVisualizer({ operation = 'all' }: ArrayVisualizerProps) {
  const embedded = operation !== 'all'

  const [slots, setSlots] = useState<Slot[]>(() => INITIAL_SLOTS.map(s => ({ ...s })))
  const [anims, setAnims] = useState<CardAnim[]>(makeAnims)
  const [isAnimating, setIsAnimating] = useState(false)
  const [activeOp, setActiveOp] = useState<Operation>('access')
  const [narration, setNarration] = useState('')
  const [complexity, setComplexity] = useState<string | null>(null)
  const [inputIndex, setInputIndex] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [traverseIdx, setTraverseIdx] = useState<number | null>(null)
  const [traverseDone, setTraverseDone] = useState(false)
  const [activeLine, setActiveLine] = useState<number | null>(null)
  const [activeLinePulse, setActiveLinePulse] = useState(0)

  function setLine(n: number | null) {
    setActiveLine(n)
    setActiveLinePulse(p => p + 1)
  }

  const currentOp: Operation = embedded ? (operation as Operation) : activeOp
  const length = slots.filter(s => s.value !== null).length

  function clearAnims() {
    setAnims(makeAnims())
  }

  function reset() {
    setAnims(makeAnims())
    setTraverseIdx(null)
    setTraverseDone(false)
    setNarration('')
    setComplexity(null)
    setActiveLine(null)
  }

  function switchOp(op: Operation) {
    if (isAnimating) return
    setActiveOp(op)
    reset()
    setInputIndex('')
    setInputValue('')
  }

  function singleHighlight(idx: number, color: HighlightColor) {
    setAnims(() => {
      const next = makeAnims()
      next[idx] = { xOffset: 0, noTransition: false, highlight: color, elevated: false }
      return next
    })
  }

  // === ACCESS ===
  function handleAccess() {
    if (isAnimating) return
    const idx = parseInt(inputIndex, 10)
    setLine(0)
    if (isNaN(idx) || idx < 0 || idx >= ARRAY_SIZE) {
      clearAnims()
      setNarration(`Index "${inputIndex}" is out of bounds — valid range: 0 to ${ARRAY_SIZE - 1}`)
      setComplexity(null)
      return
    }
    const val = slots[idx].value
    if (val === null) {
      singleHighlight(idx, 'red')
      setNarration(`Index ${idx} is empty — no element here`)
      setComplexity('O(1)')
      setLine(1)
      return
    }
    singleHighlight(idx, 'blue')
    setNarration(`Element at index ${idx} is "${val}"`)
    setComplexity('O(1)')
    setLine(1)
  }

  // === UPDATE ===
  function handleUpdate() {
    if (isAnimating) return
    const idx = parseInt(inputIndex, 10)
    setLine(0)
    if (isNaN(idx) || idx < 0 || idx >= ARRAY_SIZE) {
      clearAnims()
      setNarration(`Index "${inputIndex}" is out of bounds — valid range: 0 to ${ARRAY_SIZE - 1}`)
      setComplexity(null)
      return
    }
    if (slots[idx].value === null) {
      singleHighlight(idx, 'red')
      setNarration(`Index ${idx} is empty — nothing to update`)
      setComplexity('O(1)')
      return
    }
    if (!inputValue.trim()) {
      setNarration('Enter a new song name')
      return
    }
    const newVal = inputValue.trim()
    setSlots(prev => {
      const s = [...prev]
      s[idx] = { value: newVal }
      return s
    })
    singleHighlight(idx, 'green')
    setNarration(`Updated index ${idx} to "${newVal}"`)
    setComplexity('O(1)')
    setInputValue('')
    setLine(1)
  }

  // === ADD (insert with rightward shift) ===
  async function handleAdd() {
    if (isAnimating) return

    const idx = parseInt(inputIndex, 10)

    if (length >= ARRAY_SIZE) {
      clearAnims()
      setNarration(`Array is full — cannot insert (size: ${ARRAY_SIZE})`)
      setComplexity('O(n)')
      return
    }

    if (isNaN(idx) || idx < 0 || idx > length) {
      clearAnims()
      setNarration(
        length === 0
          ? 'Array is empty — insert at index 0'
          : `Insert index must be 0 to ${length} (one past the last element)`
      )
      setComplexity(null)
      return
    }

    if (!inputValue.trim()) {
      setNarration('Enter a song name to insert')
      return
    }

    const newVal = inputValue.trim()
    setInputValue('')
    setIsAnimating(true)
    setLine(0)

    const localSlots = slots.map(s => ({ ...s }))
    const shiftCount = length - idx

    if (shiftCount > 0) {
      setLine(1)
      await sleep(250)
    }

    // Shift elements right, starting from the rightmost (to make room)
    for (let i = length - 1; i >= idx; i--) {
      setLine(2)
      setAnims(prev => {
        const next = prev.map(a => ({ ...a }))
        next[i] = { xOffset: CARD_STEP, noTransition: false, highlight: null, elevated: true }
        return next
      })

      await sleep(360)

      localSlots[i + 1] = { value: localSlots[i].value }
      localSlots[i] = { value: null }
      setSlots([...localSlots])

      // Snap both cards with no transition so the commit is invisible
      setAnims(prev => {
        const next = prev.map(a => ({ ...a }))
        next[i] = { xOffset: 0, noTransition: true, highlight: null, elevated: false }
        next[i + 1] = { xOffset: 0, noTransition: true, highlight: null, elevated: false }
        return next
      })

      await sleep(40)
      setAnims(prev => {
        const next = prev.map(a => ({ ...a }))
        next[i] = { xOffset: 0, noTransition: false, highlight: null, elevated: false }
        next[i + 1] = { xOffset: 0, noTransition: false, highlight: null, elevated: false }
        return next
      })
    }

    setLine(3)
    localSlots[idx] = { value: newVal }
    setSlots([...localSlots])
    setAnims(prev => {
      const next = prev.map(a => ({ ...a }))
      next[idx] = { xOffset: 0, noTransition: false, highlight: 'green', elevated: false }
      return next
    })
    await sleep(300)

    setLine(4)
    setNarration(
      shiftCount > 0
        ? `Shifted ${shiftCount} element${shiftCount !== 1 ? 's' : ''} right — inserted "${newVal}" at index ${idx}`
        : `Inserted "${newVal}" at index ${idx}`
    )
    setComplexity('O(n)')
    setIsAnimating(false)
  }

  // === REMOVE (delete with leftward shift) ===
  async function handleRemove() {
    if (isAnimating) return

    const idx = parseInt(inputIndex, 10)

    if (length === 0) {
      clearAnims()
      setNarration('Array is empty — nothing to remove')
      setComplexity(null)
      return
    }

    if (isNaN(idx) || idx < 0 || idx >= length) {
      clearAnims()
      setNarration(`Remove index must be 0 to ${length - 1} (filled slots only)`)
      setComplexity(null)
      return
    }

    setIsAnimating(true)
    setLine(0)
    const localSlots = slots.map(s => ({ ...s }))
    const removedVal = localSlots[idx].value
    const shiftCount = length - 1 - idx

    // Flash the element being removed red
    setAnims(prev => {
      const next = prev.map(a => ({ ...a }))
      next[idx] = { xOffset: 0, noTransition: false, highlight: 'red', elevated: false }
      return next
    })
    await sleep(420)

    localSlots[idx] = { value: null }
    setSlots([...localSlots])
    clearAnims()
    await sleep(80)

    if (shiftCount > 0) {
      setLine(1)
      await sleep(250)
    }

    // Shift elements left to fill the gap
    for (let i = idx + 1; i < length; i++) {
      setLine(2)
      setAnims(prev => {
        const next = prev.map(a => ({ ...a }))
        next[i] = { xOffset: -CARD_STEP, noTransition: false, highlight: null, elevated: true }
        return next
      })

      await sleep(360)

      localSlots[i - 1] = { value: localSlots[i].value }
      localSlots[i] = { value: null }
      setSlots([...localSlots])

      setAnims(prev => {
        const next = prev.map(a => ({ ...a }))
        next[i] = { xOffset: 0, noTransition: true, highlight: null, elevated: false }
        next[i - 1] = { xOffset: 0, noTransition: true, highlight: null, elevated: false }
        return next
      })

      await sleep(40)
      setAnims(prev => {
        const next = prev.map(a => ({ ...a }))
        next[i] = { xOffset: 0, noTransition: false, highlight: null, elevated: false }
        next[i - 1] = { xOffset: 0, noTransition: false, highlight: null, elevated: false }
        return next
      })
    }

    setLine(3)
    await sleep(250)
    setLine(4)

    setNarration(
      shiftCount > 0
        ? `Removed "${removedVal}" at index ${idx} — shifted ${shiftCount} element${shiftCount !== 1 ? 's' : ''} left`
        : `Removed "${removedVal}" at index ${idx}`
    )
    setComplexity('O(n)')
    setIsAnimating(false)
    setInputIndex('')
  }

  // === TRAVERSE ===
  async function handleTraverse() {
    if (isAnimating) return
    if (traverseDone) {
      reset()
      return
    }
    if (length === 0) {
      setNarration('Array is empty — nothing to traverse')
      return
    }
    setIsAnimating(true)
    setComplexity('O(n)')
    setLine(0)
    await sleep(300)
    setLine(1)
    await sleep(300)
    for (let i = 0; i < length; i++) {
      setLine(2)
      setTraverseIdx(i)
      singleHighlight(i, 'purple')
      setNarration(`Index ${i} — "${slots[i].value}"`)
      await sleep(700)
    }
    clearAnims()
    setTraverseDone(true)
    setNarration(`Traversal complete — visited all ${length} element${length !== 1 ? 's' : ''}`)
    setIsAnimating(false)
  }

  function getCardClass(i: number): string {
    const { highlight } = anims[i]
    if (highlight === 'blue') return 'arrayVisCard arrayVisCardBlue'
    if (highlight === 'green') return 'arrayVisCard arrayVisCardGreen'
    if (highlight === 'red') return 'arrayVisCard arrayVisCardRed'
    if (highlight === 'purple') return 'arrayVisCard arrayVisCardPurple'
    if (slots[i].value === null) return 'arrayVisCard arrayVisCardEmpty'
    return 'arrayVisCard'
  }

  function getColStyle(i: number): React.CSSProperties {
    const { elevated } = anims[i]
    return {
      zIndex: elevated ? 10 : undefined,
      position: 'relative',
    }
  }

  function getCardStyle(i: number): React.CSSProperties {
    const { xOffset, noTransition } = anims[i]
    return {
      transform: xOffset !== 0 ? `translateX(${xOffset}px)` : undefined,
      transition: noTransition ? 'none' : xOffset !== 0 ? 'transform 0.32s ease' : undefined,
    }
  }

  const opCapitalized = (op: Operation) => op.charAt(0).toUpperCase() + op.slice(1)

  function renderControls() {
    const disabled = isAnimating
    switch (currentOp) {
      case 'access':
        return (
          <div className="arrayVisControls">
            <input
              className="arrayVisInput arrayVisInputSmall"
              type="number"
              min={0}
              max={ARRAY_SIZE - 1}
              placeholder={`index (0–${ARRAY_SIZE - 1})`}
              value={inputIndex}
              disabled={disabled}
              onChange={e => setInputIndex(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAccess()}
            />
            <button className="arrayVisActionBtn arrayVisActionBtnAccess" onClick={handleAccess} disabled={disabled}>
              Access
            </button>
          </div>
        )
      case 'update':
        return (
          <div className="arrayVisControls">
            <input
              className="arrayVisInput arrayVisInputSmall"
              type="number"
              min={0}
              max={ARRAY_SIZE - 1}
              placeholder="index"
              value={inputIndex}
              disabled={disabled}
              onChange={e => setInputIndex(e.target.value)}
            />
            <input
              className="arrayVisInput"
              type="text"
              placeholder="new song name"
              value={inputValue}
              disabled={disabled}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleUpdate()}
            />
            <button className="arrayVisActionBtn arrayVisActionBtnUpdate" onClick={handleUpdate} disabled={disabled}>
              Update
            </button>
          </div>
        )
      case 'add':
        return (
          <div className="arrayVisControls">
            <input
              className="arrayVisInput arrayVisInputSmall"
              type="number"
              min={0}
              max={length}
              placeholder={`index (0–${length})`}
              value={inputIndex}
              disabled={disabled}
              onChange={e => setInputIndex(e.target.value)}
            />
            <input
              className="arrayVisInput"
              type="text"
              placeholder="song name"
              value={inputValue}
              disabled={disabled}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
            />
            <button className="arrayVisActionBtn arrayVisActionBtnAdd" onClick={handleAdd} disabled={disabled}>
              Add
            </button>
          </div>
        )
      case 'remove':
        return (
          <div className="arrayVisControls">
            <input
              className="arrayVisInput arrayVisInputSmall"
              type="number"
              min={0}
              max={Math.max(0, length - 1)}
              placeholder={`index (0–${Math.max(0, length - 1)})`}
              value={inputIndex}
              disabled={disabled}
              onChange={e => setInputIndex(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleRemove()}
            />
            <button className="arrayVisActionBtn arrayVisActionBtnRemove" onClick={handleRemove} disabled={disabled}>
              Remove
            </button>
          </div>
        )
      case 'traverse':
        return (
          <div className="arrayVisControls">
            <button className="arrayVisActionBtn arrayVisActionBtnTraverse" onClick={handleTraverse} disabled={disabled}>
              {traverseDone ? 'Reset' : 'Traverse'}
            </button>
          </div>
        )
    }
  }

  const cardRows = (
    <div className="arrayVisCards">
      {slots.map((slot, i) => (
        <div key={i} className="arrayVisCardCol" style={getColStyle(i)}>
          <div className={getCardClass(i)} style={getCardStyle(i)}>
            {slot.value !== null
              ? <span className="arrayVisCardValue">
                  {slot.value.split(' ').map((word, wi, arr) => (
                    <span key={wi}>{word}{wi < arr.length - 1 && <br />}</span>
                  ))}
                </span>
              : <span className="arrayVisCardValueEmpty">—</span>
            }
          </div>
          <div className="arrayVisIndex">[{i}]</div>
        </div>
      ))}
    </div>
  )

  if (embedded) {
    return (
      <div className="arrayVisOuter arrayVisOuterEmbedded">
        <div className="arrayVis arrayVisEmbedded">
          <p className="arrayVisEmbedLabel">{opCapitalized(operation as Operation)}</p>
          {cardRows}
          <div className="arrayVisMeta">
            <span className="arrayVisSizeBadge">length: <strong>{length}</strong></span>
            <span className="arrayVisSizeBadge">size: <strong>{ARRAY_SIZE}</strong></span>
          </div>
          {renderControls()}
          <div className="arrayVisNarration">
            {narration ? (
              <>
                <span className="arrayVisNarrationText">{narration}</span>
                {complexity && <span className="arrayVisComplexity">{complexity}</span>}
              </>
            ) : (
              <span className="arrayVisNarrationPlaceholder">select an operation above</span>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="arrayVis" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
      <div className="arrayVisHeader">
        <h3 className="arrayVisTitle">array — fixed capacity</h3>
      </div>

      <div className="arrayVisTopRow">
        <div className="arrayVisMainSection">
          <div className="arrayVisOps">
            {ALL_OPS.map(op => (
              <button
                key={op}
                className={`arrayVisOpBtn${activeOp === op ? ` arrayVisOpBtnActive${opCapitalized(op)}` : ''}`}
                onClick={() => switchOp(op)}
                disabled={isAnimating}
              >
                {OP_LABELS[op]}
              </button>
            ))}
          </div>
          {cardRows}
          <div className="arrayVisMeta">
            <span className="arrayVisSizeBadge">length: <strong>{length}</strong></span>
            <span className="arrayVisSizeBadge">size: <strong>{ARRAY_SIZE}</strong></span>
          </div>
        </div>

        <div className="arrayVisPseudo">
          <p className="arrayVisPseudoLabel">CHOOSE AN OPERATION ↓</p>
          <div className="arrayVisPseudoBody">
            {PSEUDOCODE[currentOp].map((line, i) => (
              <div
                key={activeLine === i ? `active-${activeLinePulse}` : i}
                className={`arrayVisPseudoLine${activeLine === i ? ' arrayVisPseudoLineActive' : ''}`}
              >
                <span className="arrayVisPseudoLineNum">{i + 1}</span>
                <span className={`arrayVisPseudoLineText${line.indent > 0 ? ` indent${line.indent}` : ''}`}>
                  {line.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {renderControls()}

      <div className="arrayVisNarration">
        {narration ? (
          <>
            <span className="arrayVisNarrationText">{narration}</span>
            {complexity && <span className="arrayVisComplexity">{complexity}</span>}
          </>
        ) : (
          <span className="arrayVisNarrationPlaceholder">select an operation above</span>
        )}
      </div>
    </div>
  )
}
