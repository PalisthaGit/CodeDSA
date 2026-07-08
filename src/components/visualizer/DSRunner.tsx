'use client'

import { useRef, useState } from 'react'

const MAX_SLOTS = 6
const STEP_MS = 950
const FLY_MS = 580
const NODE_HEIGHT = 44
const NODE_GAP = 4
const BORDER_BOTTOM = 6
const PADDING_BOTTOM = 6

type OpKey = 'push' | 'pop' | 'peek'
export type DSRunnerOp = 'all' | OpKey

type AnimKind = 'idle' | 'top' | 'drop' | 'fly' | 'pulse'

interface Slot {
  value: number | string
  anim: AnimKind
}

type SlotArr = (Slot | null)[]

const SNIPPETS: Record<OpKey, Array<{ code: string; expl: string }>> = {
  push: [
    { code: 'void push(int x) {',       expl: 'push() adds a new element to the top of the stack.' },
    { code: '  top++;',                  expl: 'Increment top to point to the next available slot.' },
    { code: '  arr[top] = x;',          expl: 'Store x at the new top position.' },
    { code: '}',                         expl: '' },
  ],
  pop: [
    { code: 'void pop() {',             expl: 'pop() removes the topmost element from the stack.' },
    { code: '  if (top == -1) return;', expl: 'Guard: if the stack is empty, return immediately.' },
    { code: '  top--;',                 expl: 'Decrement top — the element is logically removed.' },
    { code: '}',                        expl: '' },
  ],
  peek: [
    { code: 'int peek() {',             expl: 'peek() returns the top element without removing it.' },
    { code: '  if (top == -1) return -1;', expl: 'Guard: return -1 if the stack is empty.' },
    { code: '  return arr[top];',       expl: 'Return the top value — the stack is not modified.' },
    { code: '}',                        expl: '' },
  ],
}

const CODE_LABEL: Record<OpKey, string> = { push: 'push(x)', pop: 'pop()', peek: 'peek()' }

function sleep(ms: number) { return new Promise<void>(r => setTimeout(r, ms)) }

function makeSlots(stack: (number | string)[], overrides: Partial<Record<number, AnimKind>> = {}): SlotArr {
  return Array.from({ length: MAX_SLOTS }, (_, i): Slot | null => {
    if (i >= stack.length) return null
    const isTop = i === stack.length - 1
    return { value: stack[i], anim: overrides[i] ?? (isTop ? 'top' : 'idle') }
  })
}

export function DSRunner({
  op = 'all',
  startEmpty = false,
}: {
  op?: DSRunnerOp
  startEmpty?: boolean
}) {
  const INITIAL: (number | string)[] = startEmpty ? [] : [10, 20, 30]

  const stackRef = useRef<(number | string)[]>([...INITIAL])
  const [slots, setSlots] = useState<SlotArr>(() => makeSlots(INITIAL))
  const [activeOp, setActiveOp] = useState<OpKey | null>(op !== 'all' ? op : null)
  const [activeLine, setActiveLine] = useState(-1)
  const [explanation, setExplanation] = useState('Select an operation to begin.')
  const [inputVal, setInputVal] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [sizeVer, setSizeVer] = useState(0)

  const size = stackRef.current.length
  const showPush = op === 'all' || op === 'push'
  const showPop  = op === 'all' || op === 'pop'
  const showPeek = op === 'all' || op === 'peek'

  const topNodeMid =
    size > 0
      ? BORDER_BOTTOM + PADDING_BOTTOM + (size - 1) * (NODE_HEIGHT + NODE_GAP) + NODE_HEIGHT / 2
      : -100

  async function runPush(val: number | string) {
    if (stackRef.current.length >= MAX_SLOTS) {
      setExplanation('Stack is full (max 6 elements in this demo).')
      return
    }
    setActiveOp('push')
    setIsRunning(true)
    const sn = SNIPPETS.push

    setActiveLine(0)
    setExplanation(sn[0].expl)
    setSlots(makeSlots(stackRef.current))
    await sleep(STEP_MS)

    const newStack = [...stackRef.current, val]
    stackRef.current = newStack
    setActiveLine(1)
    setExplanation(sn[1].expl)
    setSlots(makeSlots(newStack, { [newStack.length - 1]: 'drop' }))
    await sleep(STEP_MS)

    setActiveLine(2)
    setExplanation(sn[2].expl)
    setSlots(makeSlots(newStack))
    setSizeVer(v => v + 1)
    await sleep(STEP_MS)

    setActiveLine(3)
    setExplanation(`Done — size is now ${newStack.length}.`)
    await sleep(STEP_MS)

    setActiveLine(-1)
    setIsRunning(false)
  }

  async function runPop() {
    const curr = stackRef.current
    setActiveOp('pop')
    setIsRunning(true)
    const sn = SNIPPETS.pop

    setActiveLine(0)
    setExplanation(sn[0].expl)
    setSlots(makeSlots(curr))
    await sleep(STEP_MS)

    setActiveLine(1)
    if (curr.length === 0) {
      setExplanation('Stack is empty — pop() returns immediately without doing anything.')
      setIsRunning(false)
      return
    }
    setExplanation(sn[1].expl)
    await sleep(STEP_MS)

    const topIdx = curr.length - 1
    const topVal = curr[topIdx]
    setActiveLine(2)
    setExplanation(`${topVal} flies off the top of the stack.`)
    setSlots(makeSlots(curr, { [topIdx]: 'fly' }))
    await sleep(FLY_MS)
    const newStack = curr.slice(0, -1)
    stackRef.current = newStack
    setSlots(makeSlots(newStack))
    setSizeVer(v => v + 1)
    await sleep(STEP_MS - FLY_MS)

    setActiveLine(3)
    setExplanation(`Done — size is now ${newStack.length}.`)
    await sleep(STEP_MS)

    setActiveLine(-1)
    setIsRunning(false)
  }

  async function runPeek() {
    const curr = stackRef.current
    setActiveOp('peek')
    setIsRunning(true)
    const sn = SNIPPETS.peek

    setActiveLine(0)
    setExplanation(sn[0].expl)
    setSlots(makeSlots(curr))
    await sleep(STEP_MS)

    setActiveLine(1)
    if (curr.length === 0) {
      setExplanation('Stack is empty — peek() would return -1.')
      setIsRunning(false)
      return
    }
    setExplanation(sn[1].expl)
    await sleep(STEP_MS)

    const topVal = curr[curr.length - 1]
    setActiveLine(2)
    setExplanation(sn[2].expl)
    setSlots(makeSlots(curr, { [curr.length - 1]: 'pulse' }))
    await sleep(STEP_MS)

    setActiveLine(3)
    setExplanation(`peek() returns ${topVal} — the stack is unchanged.`)
    await sleep(STEP_MS)

    setActiveLine(-1)
    setIsRunning(false)
  }

  function reset() {
    if (isRunning) return
    stackRef.current = [...INITIAL]
    setSlots(makeSlots(INITIAL))
    setActiveOp(op !== 'all' ? op : null)
    setActiveLine(-1)
    setExplanation('Select an operation to begin.')
    setInputVal('')
    setSizeVer(0)
  }

  async function handlePush() {
    if (isRunning) return
    const val = parseFloat(inputVal)
    if (isNaN(val)) {
      setExplanation('Enter a number in the input box first.')
      return
    }
    setInputVal('')
    await runPush(val)
  }

  const codeOp: OpKey = activeOp ?? (showPush ? 'push' : showPop ? 'pop' : 'peek')
  const codeLines = SNIPPETS[codeOp]

  return (
    <div className="arrayVisOuter arrayVisOuterEmbedded">
      <div className="arrayVis" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>

        <div className="arrayVisHeader dsrHeader">
          <h3 className="arrayVisTitle">stack — LIFO</h3>
          <span
            className={`arrayVisSizeBadge dsrSizeChip${sizeVer > 0 ? ' dsrSizeBump' : ''}`}
            key={sizeVer}
          >
            size: <strong>{size}</strong>
          </span>
        </div>

        {/* Desktop: stage left | code right */}
        <div className="dsrTopRow">

          {/* ── Stack stage ── */}
          <div className="dsrStageWrap">
            <div className="dsrTubeRow">
              <div className="dsrTube">
                {Array.from({ length: MAX_SLOTS }, (_, i) => MAX_SLOTS - 1 - i).map(slotIdx => {
                  const slot = slots[slotIdx]
                  let cls = 'dsrSlot'
                  if (slot === null) {
                    cls += ' dsrSlotEmpty'
                  } else {
                    cls += ' dsrSlotFilled'
                    if (slot.anim === 'drop')  cls += ' dsrSlotDrop'
                    else if (slot.anim === 'fly')   cls += ' dsrSlotFly'
                    else if (slot.anim === 'pulse') cls += ' dsrSlotPulse'
                    else if (slot.anim === 'top')   cls += ' dsrSlotTop'
                  }
                  return (
                    <div key={slotIdx} className={cls}>
                      {slot !== null && <span className="dsrSlotValue">{slot.value}</span>}
                    </div>
                  )
                })}
              </div>

              {/* ← top label column — hidden on mobile via CSS */}
              <div className="dsrLabelCol">
                {size > 0 && (
                  <span
                    className="stackTopLabel"
                    style={{ bottom: `${topNodeMid}px`, transform: 'translateY(50%)' }}
                  >
                    ← top
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ── Code panel ── */}
          <div className="dsrCodePanel">
            <p className="dsrCodeLabel">
              {activeOp ? CODE_LABEL[activeOp] : 'choose an operation ↓'}
            </p>
            <div className="dsrCodeLines">
              {codeLines.map((line, i) => (
                <div
                  key={i}
                  className={`dsrCodeLine${activeLine === i ? ' dsrCodeLineActive' : ''}`}
                >
                  <span className="dsrCodeLineNum">{i + 1}</span>
                  <code className="dsrCodeLineText">{line.code}</code>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Controls */}
        <div className="arrayVisControls">
          {showPush && (
            <input
              className="arrayVisInput arrayVisInputSmall"
              type="number"
              placeholder="val"
              value={inputVal}
              disabled={isRunning}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handlePush()}
            />
          )}
          {showPush && (
            <button className="arrayVisActionBtn arrayVisActionBtnAdd" onClick={handlePush} disabled={isRunning}>
              Push
            </button>
          )}
          {showPop && (
            <button className="arrayVisActionBtn arrayVisActionBtnRemove" onClick={() => { if (!isRunning) runPop() }} disabled={isRunning}>
              Pop
            </button>
          )}
          {showPeek && (
            <button className="arrayVisActionBtn arrayVisActionBtnAccess" onClick={() => { if (!isRunning) runPeek() }} disabled={isRunning}>
              Peek
            </button>
          )}
          <button
            className="arrayVisActionBtn dsrResetBtn"
            onClick={reset}
            disabled={isRunning}
            title="Reset"
          >
            ↺
          </button>
        </div>

        {/* Explanation strip */}
        <div className="arrayVisNarration">
          <span className="arrayVisNarrationText">{explanation}</span>
        </div>

      </div>
    </div>
  )
}
