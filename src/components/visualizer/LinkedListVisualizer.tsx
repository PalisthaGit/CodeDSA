'use client'

import { useRef, useState } from 'react'

type Op = 'traverse' | 'createNode' | 'addNode' | 'insertBegin' | 'insertPos' | 'removeBegin' | 'removeEnd' | 'removePos'
type HL = 'none' | 'current' | 'new' | 'remove' | 'done'

interface VisNode { id: number; value: number; hl: HL }

const OP_LABELS: Record<Op, string> = {
  traverse: 'Traverse',
  createNode: 'Create a node',
  addNode: 'Add a node',
  insertBegin: 'Insert — begin',
  insertPos: 'Insert — position',
  removeBegin: 'Remove — begin',
  removeEnd: 'Remove — end',
  removePos: 'Remove — position',
}

const ALL_OPS: Op[] = ['traverse', 'insertBegin', 'insertPos', 'removeBegin', 'removeEnd', 'removePos']

const INITIAL_FULL: VisNode[] = [
  { id: 1, value: 10, hl: 'none' },
  { id: 2, value: 20, hl: 'none' },
  { id: 3, value: 30, hl: 'none' },
  { id: 4, value: 40, hl: 'none' },
]

const INITIAL_ADD: VisNode[] = [
  { id: 1, value: 10, hl: 'none' },
]

function getInitialNodes(op?: Op): VisNode[] {
  if (op === 'createNode') return []
  if (op === 'addNode') return INITIAL_ADD.map(n => ({ ...n }))
  return INITIAL_FULL.map(n => ({ ...n }))
}

function sleep(ms: number) { return new Promise<void>(r => setTimeout(r, ms)) }

export function LinkedListVisualizer({ op }: { op?: Op } = {}) {
  const embedded = op !== undefined
  const [nodes, setNodes] = useState<VisNode[]>(() => getInitialNodes(op))
  const [activeOp, setActiveOp] = useState<Op>(op ?? 'traverse')
  const [isAnimating, setIsAnimating] = useState(false)
  const [narration, setNarration] = useState('')
  const [complexity, setComplexity] = useState<string | null>(null)
  const [inputVal, setInputVal] = useState('')
  const [inputPos, setInputPos] = useState('')
  const nextId = useRef(5)

  function resetState() {
    nextId.current = 5
    setNodes(getInitialNodes(op ?? activeOp === 'createNode' ? 'createNode' : activeOp === 'addNode' ? 'addNode' : undefined))
    setNarration('')
    setComplexity(null)
    setInputVal('')
    setInputPos('')
  }

  function switchOp(newOp: Op) {
    if (isAnimating) return
    setActiveOp(newOp)
    nextId.current = 5
    setNodes(getInitialNodes(newOp))
    setNarration('')
    setComplexity(null)
    setInputVal('')
    setInputPos('')
  }

  function snap(ns: VisNode[]) { setNodes([...ns]) }

  // === CREATE A NODE ===
  async function handleCreateNode() {
    if (isAnimating) return
    const val = parseInt(inputVal, 10)
    if (isNaN(val)) { setNarration('Enter a number value for the node'); return }
    setIsAnimating(true)

    const newNode: VisNode = { id: nextId.current++, value: val, hl: 'new' }
    snap([newNode])
    setNarration(`Node* p = new Node  —  node created in memory`)
    await sleep(750)

    setNarration(`p->data = ${val}  —  value stored in the data part`)
    await sleep(750)

    setNarration(`p->next = nullptr  —  pointer set to null, no next node yet`)
    await sleep(750)

    snap([{ ...newNode, hl: 'none' }])
    setNarration(`Done — node has data (${val}) and next (nullptr)`)
    setIsAnimating(false)
    setInputVal('')
  }

  // === ADD A NODE (connect two nodes) ===
  async function handleAddNode() {
    if (isAnimating) return
    const val = parseInt(inputVal, 10)
    if (isNaN(val)) { setNarration('Enter a value for the second node'); return }
    if (nodes.length >= 2) { setNarration('Reset to start over'); return }
    setIsAnimating(true)

    const newNode: VisNode = { id: nextId.current++, value: val, hl: 'new' }
    snap([...nodes.map(n => ({ ...n, hl: 'none' as HL })), newNode])
    setNarration(`Node* node2 = new Node  —  second node created`)
    await sleep(750)

    setNarration(`node2->data = ${val},  node2->next = nullptr`)
    await sleep(750)

    snap([{ ...nodes[0], hl: 'current' }, { ...newNode, hl: 'new' }])
    setNarration(`node1->next = node2  —  node1 now points to node2`)
    await sleep(800)

    snap([{ ...nodes[0], hl: 'none' }, { ...newNode, hl: 'none' }])
    setNarration(`Done — the two nodes are connected. node1 → node2 → null`)
    setIsAnimating(false)
    setInputVal('')
  }

  // === TRAVERSE ===
  async function handleTraverse() {
    if (isAnimating) return
    setIsAnimating(true)
    setComplexity('O(n)')
    let curr = nodes.map(n => ({ ...n, hl: 'none' as HL }))
    for (let i = 0; i < curr.length; i++) {
      curr = curr.map((n, j) => ({ ...n, hl: (j === i ? 'current' : j < i ? 'done' : 'none') as HL }))
      snap(curr)
      setNarration(`current → node ${i + 1}  (value: ${curr[i].value})`)
      await sleep(650)
    }
    snap(curr.map(n => ({ ...n, hl: 'done' })))
    setNarration(`Traversal complete — visited all ${curr.length} nodes`)
    setIsAnimating(false)
  }

  // === INSERT AT BEGINNING ===
  async function handleInsertBegin() {
    if (isAnimating) return
    const val = parseInt(inputVal, 10)
    if (isNaN(val)) { setNarration('Enter a number value for the new node'); return }
    setIsAnimating(true)
    setComplexity('O(1)')

    const newNode: VisNode = { id: nextId.current++, value: val, hl: 'new' }
    setNodes(prev => [newNode, ...prev.map(n => ({ ...n, hl: 'none' as HL }))])
    setNarration(`new node created — value: ${val}`)
    await sleep(750)

    setNodes(prev => prev.map((n, i) => ({ ...n, hl: (i === 0 ? 'new' : i === 1 ? 'current' : 'none') as HL })))
    setNarration(`newNode.next = head  —  new node points to old head`)
    await sleep(750)

    setNodes(prev => prev.map(n => ({ ...n, hl: 'none' })))
    setNarration(`head = newNode  —  ${val} is now the head. One step — O(1).`)
    setIsAnimating(false)
    setInputVal('')
  }

  // === INSERT AT POSITION ===
  async function handleInsertPos() {
    if (isAnimating) return
    const val = parseInt(inputVal, 10)
    const pos = parseInt(inputPos, 10)
    if (isNaN(val)) { setNarration('Enter a value for the new node'); return }
    if (isNaN(pos) || pos < 1 || pos > nodes.length) {
      setNarration(`Position must be between 1 and ${nodes.length} (insert after that node)`); return
    }
    setIsAnimating(true)
    setComplexity('O(n)')

    setNarration(`Creating new node with value ${val}`)
    await sleep(500)

    let curr = nodes.map(n => ({ ...n, hl: 'none' as HL }))
    for (let i = 0; i < pos - 1; i++) {
      curr = curr.map((n, j) => ({ ...n, hl: (j === i ? 'current' : j < i ? 'done' : 'none') as HL }))
      snap(curr)
      setNarration(`Walking to node ${i + 1}${i === pos - 2 ? ' — insert after this one' : '...'}`)
      await sleep(650)
    }

    setNarration(`At node ${pos} — connecting new node`)
    await sleep(500)

    const newNode: VisNode = { id: nextId.current++, value: val, hl: 'new' }
    curr = [...curr.slice(0, pos), newNode, ...curr.slice(pos)]
    snap(curr)
    setNarration(`newNode.next = current.next, then current.next = newNode`)
    await sleep(800)

    snap(curr.map(n => ({ ...n, hl: 'none' })))
    setNarration(`Done — ${val} inserted after node ${pos}`)
    setIsAnimating(false)
    setInputVal('')
    setInputPos('')
  }

  // === REMOVE FROM BEGINNING ===
  async function handleRemoveBegin() {
    if (isAnimating) return
    if (nodes.length === 0) { setNarration('List is empty — nothing to remove'); return }
    setIsAnimating(true)
    setComplexity('O(1)')

    const removedVal = nodes[0].value
    const nextHeadVal = nodes[1]?.value
    setNodes(prev => prev.map((n, i) => ({ ...n, hl: (i === 0 ? 'remove' : 'none') as HL })))
    setNarration(`head = head.next  —  disconnecting first node (value: ${removedVal})`)
    await sleep(750)

    setNodes(prev => prev.slice(1).map(n => ({ ...n, hl: 'none' })))
    setNarration(`Done — node ${removedVal} removed. Head now points to ${nextHeadVal ?? 'null'}. O(1).`)
    setIsAnimating(false)
  }

  // === REMOVE FROM END ===
  async function handleRemoveEnd() {
    if (isAnimating) return
    if (nodes.length === 0) { setNarration('List is empty — nothing to remove'); return }
    setIsAnimating(true)
    setComplexity('O(n)')

    if (nodes.length === 1) {
      setNodes(prev => prev.map(n => ({ ...n, hl: 'remove' })))
      setNarration(`Removing only node (value: ${nodes[0].value})`)
      await sleep(700)
      setNodes([])
      setNarration('List is now empty')
      setIsAnimating(false)
      return
    }

    let curr = nodes.map(n => ({ ...n, hl: 'none' as HL }))
    for (let i = 0; i < curr.length - 2; i++) {
      curr = curr.map((n, j) => ({ ...n, hl: (j === i ? 'current' : j < i ? 'done' : 'none') as HL }))
      snap(curr)
      setNarration(`Walking until current.next.next is null...`)
      await sleep(650)
    }

    const removedVal = curr[curr.length - 1].value
    curr = curr.map((n, j) => ({
      ...n,
      hl: (j === curr.length - 2 ? 'current' : j === curr.length - 1 ? 'remove' : 'done') as HL,
    }))
    snap(curr)
    setNarration(`current is second-last — setting current.next = null, removing node ${removedVal}`)
    await sleep(800)

    snap(curr.slice(0, -1).map(n => ({ ...n, hl: 'none' })))
    setNarration(`Done — node ${removedVal} removed from end`)
    setIsAnimating(false)
  }

  // === REMOVE FROM POSITION ===
  async function handleRemovePos() {
    if (isAnimating) return
    const pos = parseInt(inputPos, 10)
    if (nodes.length === 0) { setNarration('List is empty — nothing to remove'); return }
    if (isNaN(pos) || pos < 1 || pos > nodes.length) {
      setNarration(`Position must be between 1 and ${nodes.length}`); return
    }
    setIsAnimating(true)
    setComplexity('O(n)')

    let curr = nodes.map(n => ({ ...n, hl: 'none' as HL }))
    for (let i = 0; i < pos - 2; i++) {
      curr = curr.map((n, j) => ({ ...n, hl: (j === i ? 'current' : j < i ? 'done' : 'none') as HL }))
      snap(curr)
      setNarration(`Walking to node ${i + 1}...`)
      await sleep(650)
    }

    if (pos === 1) {
      curr = curr.map((n, j) => ({ ...n, hl: (j === 0 ? 'remove' : 'none') as HL }))
    } else {
      curr = curr.map((n, j) => ({
        ...n,
        hl: (j === pos - 2 ? 'current' : j === pos - 1 ? 'remove' : j < pos - 2 ? 'done' : 'none') as HL,
      }))
    }
    snap(curr)

    const removedVal = curr[pos - 1].value
    setNarration(`current.next = current.next.next  —  skipping over node ${removedVal}`)
    await sleep(800)

    snap([...curr.slice(0, pos - 1), ...curr.slice(pos)].map(n => ({ ...n, hl: 'none' })))
    setNarration(`Done — node ${removedVal} removed from position ${pos}`)
    setIsAnimating(false)
    setInputPos('')
  }

  function nodeClass(hl: HL): string {
    if (hl === 'current') return 'llNode llNodeCurrent'
    if (hl === 'new') return 'llNode llNodeNew'
    if (hl === 'remove') return 'llNode llNodeRemove'
    if (hl === 'done') return 'llNode llNodeDone'
    return 'llNode'
  }

  function renderControls() {
    const d = isAnimating
    const resetBtn = (
      <button
        className="arrayVisActionBtn"
        style={{ background: 'var(--color-code-bg)', borderColor: 'var(--color-code-border)', color: 'var(--color-text-secondary)' }}
        onClick={resetState}
        disabled={d}
      >
        Reset
      </button>
    )

    switch (activeOp) {
      case 'createNode':
        return (
          <div className="arrayVisControls">
            <input className="arrayVisInput arrayVisInputSmall" type="number" placeholder="value" value={inputVal} disabled={d} onChange={e => setInputVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCreateNode()} />
            <button className="arrayVisActionBtn arrayVisActionBtnAdd" onClick={handleCreateNode} disabled={d}>Create node</button>
            {resetBtn}
          </div>
        )
      case 'addNode':
        return (
          <div className="arrayVisControls">
            <input className="arrayVisInput arrayVisInputSmall" type="number" placeholder="value for node2" value={inputVal} disabled={d} onChange={e => setInputVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddNode()} />
            <button className="arrayVisActionBtn arrayVisActionBtnAdd" onClick={handleAddNode} disabled={d}>Add node</button>
            {resetBtn}
          </div>
        )
      case 'traverse':
        return (
          <div className="arrayVisControls">
            <button className="arrayVisActionBtn arrayVisActionBtnTraverse" onClick={handleTraverse} disabled={d}>Traverse</button>
            {resetBtn}
          </div>
        )
      case 'insertBegin':
        return (
          <div className="arrayVisControls">
            <input className="arrayVisInput arrayVisInputSmall" type="number" placeholder="value" value={inputVal} disabled={d} onChange={e => setInputVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleInsertBegin()} />
            <button className="arrayVisActionBtn arrayVisActionBtnAdd" onClick={handleInsertBegin} disabled={d}>Insert</button>
            {resetBtn}
          </div>
        )
      case 'insertPos':
        return (
          <div className="arrayVisControls">
            <input className="arrayVisInput arrayVisInputSmall" type="number" placeholder="value" value={inputVal} disabled={d} onChange={e => setInputVal(e.target.value)} />
            <input className="arrayVisInput arrayVisInputSmall" type="number" placeholder="after node #" value={inputPos} disabled={d} onChange={e => setInputPos(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleInsertPos()} />
            <button className="arrayVisActionBtn arrayVisActionBtnAdd" onClick={handleInsertPos} disabled={d}>Insert</button>
            {resetBtn}
          </div>
        )
      case 'removeBegin':
        return (
          <div className="arrayVisControls">
            <button className="arrayVisActionBtn arrayVisActionBtnRemove" onClick={handleRemoveBegin} disabled={d}>Remove</button>
            {resetBtn}
          </div>
        )
      case 'removeEnd':
        return (
          <div className="arrayVisControls">
            <button className="arrayVisActionBtn arrayVisActionBtnRemove" onClick={handleRemoveEnd} disabled={d}>Remove</button>
            {resetBtn}
          </div>
        )
      case 'removePos':
        return (
          <div className="arrayVisControls">
            <input className="arrayVisInput arrayVisInputSmall" type="number" placeholder="node # (1–4)" value={inputPos} disabled={d} onChange={e => setInputPos(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleRemovePos()} />
            <button className="arrayVisActionBtn arrayVisActionBtnRemove" onClick={handleRemovePos} disabled={d}>Remove</button>
            {resetBtn}
          </div>
        )
    }
  }

  const isEmptyState = nodes.length === 0

  return (
    <div className="arrayVisOuter arrayVisOuterEmbedded">
      <div className="arrayVis" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
        {!embedded && (
          <div className="arrayVisHeader">
            <h3 className="arrayVisTitle">linked list — grows as you go</h3>
          </div>
        )}

        {embedded && (
          <p className="arrayVisEmbedLabel">{OP_LABELS[activeOp]}</p>
        )}

        {!embedded && (
          <div className="arrayVisOps">
            {ALL_OPS.map(o => (
              <button
                key={o}
                className={`arrayVisOpBtn${activeOp === o ? ' llOpBtnActive' : ''}`}
                onClick={() => switchOp(o)}
                disabled={isAnimating}
              >
                {OP_LABELS[o]}
              </button>
            ))}
          </div>
        )}

        <div className="llScrollArea">
          <div className="llNodes">
            {isEmptyState ? (
              <div className="llNullBox llNullBoxEmpty">empty — create a node</div>
            ) : (
              <>
                {nodes.map((node, i) => (
                  <div key={node.id} className="llNodeWrapper">
                    <div className="llNodeLabelRow">
                      {i === 0 && !isEmptyState && <span className="llLabelHead">head</span>}
                      {node.hl === 'current' && <span className="llLabelCurrent">current</span>}
                      {node.hl === 'new' && <span className="llLabelNew">new</span>}
                    </div>
                    <div className="llNodeBody">
                      <div className={nodeClass(node.hl)}>
                        <div className="llNodeData">{node.value}</div>
                        <div className="llNodePtr">{i === nodes.length - 1 ? '∅' : '→'}</div>
                      </div>
                      {i < nodes.length - 1 && <div className="llEdge">→</div>}
                    </div>
                  </div>
                ))}
                <div className="llEdge">→</div>
                <div className="llNullBox">null</div>
              </>
            )}
          </div>
        </div>

        <div className="arrayVisMeta">
          <span className="arrayVisSizeBadge">nodes: <strong>{nodes.length}</strong></span>
        </div>

        {renderControls()}

        <div className="arrayVisNarration">
          {narration ? (
            <>
              <span className="arrayVisNarrationText">{narration}</span>
              {complexity && <span className="arrayVisComplexity">{complexity}</span>}
            </>
          ) : (
            <span className="arrayVisNarrationPlaceholder">
              {activeOp === 'createNode' ? 'enter a value and click Create node' : 'select an operation above to run it'}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
