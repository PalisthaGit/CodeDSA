'use client'

import { useRef, useState } from 'react'
import { QueueSteps, type QueueNode, type QueueStep, QUEUE_EMPTY_STEP } from './QueueVisualizer.logic'

type QueueType = 'linear' | 'circular' | 'deque'
type QueueOp = 'enqueueRear' | 'enqueueFront' | 'dequeueFront' | 'dequeueRear' | 'peekFront' | 'peekRear'

function sleep(ms: number) { return new Promise<void>(r => setTimeout(r, ms)) }

function nodeClass(state: QueueNode['state']): string {
  switch (state) {
    case 'front':     return 'qvNode qvNodeFront'
    case 'rear':      return 'qvNode qvNodeRear'
    case 'enqueuing': return 'qvNode qvNodeEnqueuing'
    case 'dequeuing': return 'qvNode qvNodeDequeuing'
    case 'peeking':   return 'qvNode qvNodePeeking'
    default:          return 'qvNode'
  }
}

export function QueueVisualizer() {
  const [queueType, setQueueType] = useState<QueueType>('linear')
  const queueRef = useRef<number[]>([])
  const [step, setStep] = useState<QueueStep>(QUEUE_EMPTY_STEP)
  const [inputVal, setInputVal] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)

  function reset() {
    queueRef.current = []
    setStep(QUEUE_EMPTY_STEP)
    setInputVal('')
  }

  function handleTypeChange(type: QueueType) {
    setQueueType(type)
    queueRef.current = []
    setStep(QUEUE_EMPTY_STEP)
    setInputVal('')
  }

  async function runSteps(steps: QueueStep[]) {
    setIsAnimating(true)
    for (const s of steps) {
      setStep(s)
      await sleep(750)
    }
    setIsAnimating(false)
  }

  function parseVal(): number {
    const n = Number(inputVal.trim())
    return isNaN(n) ? 0 : n
  }

  async function handleOp(op: QueueOp) {
    if (isAnimating) return
    const value = parseVal()
    const current = [...queueRef.current]

    let steps: QueueStep[]
    let after: number[]

    switch (op) {
      case 'enqueueRear':
        steps = QueueSteps.enqueueRear(current, value)
        after = [...current, value]
        break
      case 'enqueueFront':
        steps = QueueSteps.enqueueFront(current, value)
        after = [value, ...current]
        break
      case 'dequeueFront':
        steps = QueueSteps.dequeueFront(current)
        after = current.length > 0 ? current.slice(1) : current
        break
      case 'dequeueRear':
        steps = QueueSteps.dequeueRear(current)
        after = current.length > 0 ? current.slice(0, -1) : current
        break
      case 'peekFront':
        steps = QueueSteps.peekFront(current)
        after = current
        break
      case 'peekRear':
        steps = QueueSteps.peekRear(current)
        after = current
        break
    }

    queueRef.current = after
    await runSteps(steps)
  }

  const { nodes, message, subMessage } = step
  const isDeque = queueType === 'deque'
  const d = isAnimating
  const nodeCount = nodes.length

  return (
    <div className="arrayVisOuter arrayVisOuterEmbedded">
      <div className="arrayVis" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
        <div className="arrayVisHeader">
          <h3 className="arrayVisTitle">
            {queueType === 'circular' ? 'circular queue' : queueType === 'deque' ? 'deque — double-ended queue' : 'queue — first in, first out'}
          </h3>
        </div>

        {/* Type selector */}
        <div className="qvTypeRow">
          <label className="qvTypeLabel">Type:</label>
          <select
            className="gvSelect"
            value={queueType}
            disabled={d}
            onChange={e => handleTypeChange(e.target.value as QueueType)}
          >
            <option value="linear">Queue (Linear)</option>
            <option value="circular">Circular Queue</option>
            <option value="deque">Deque</option>
          </select>
        </div>

        {/* Visual canvas */}
        <div className="qvCanvas">
          {nodeCount === 0 ? (
            <span className="qvEmpty">empty queue</span>
          ) : (
            <div className="qvNodesScroll">
              {/* Circular arc drawn above the nodes */}
              {queueType === 'circular' && nodeCount > 1 && (
                <div className="qvCircularArcWrap">
                  <svg
                    className="qvCircularArc"
                    style={{ width: nodeCount * 70 + (nodeCount - 1) * 10 }}
                    height="28"
                    overflow="visible"
                  >
                    <defs>
                      <marker id="qvArrowHead" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
                        <polygon points="0 0, 7 3, 0 6" fill="#8896A8" />
                      </marker>
                    </defs>
                    <path
                      d={`M ${(nodeCount - 1) * 80 + 55} 24 C ${(nodeCount - 1) * 80 + 70} -8, -10 -8, 15 24`}
                      stroke="#8896A8"
                      strokeWidth="1.5"
                      fill="none"
                      strokeDasharray="4 3"
                      markerEnd="url(#qvArrowHead)"
                    />
                  </svg>
                </div>
              )}

              <div className="qvNodes">
                {nodes.map((node, i) => (
                  <div key={node.id} className="qvNodeCol">
                    <span className="qvFrontLabel" style={{ visibility: i === 0 ? 'visible' : 'hidden' }}>
                      FRONT
                    </span>
                    <div className={nodeClass(node.state)}>{node.value}</div>
                    <span className="qvRearLabel" style={{ visibility: i === nodeCount - 1 ? 'visible' : 'hidden' }}>
                      REAR
                    </span>
                    {i < nodeCount - 1 && <span className="qvArrow">→</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="qvLegend">
          <div className="qvLegendItem"><span className="qvLegendDot qvLegendFront" />front</div>
          <div className="qvLegendItem"><span className="qvLegendDot qvLegendRear" />rear</div>
          <div className="qvLegendItem"><span className="qvLegendDot qvLegendEnqueuing" />enqueuing</div>
          <div className="qvLegendItem"><span className="qvLegendDot qvLegendDequeuing" />dequeuing</div>
          <div className="qvLegendItem"><span className="qvLegendDot qvLegendPeeking" />peeking</div>
        </div>

        <div className="arrayVisMeta">
          <span className="arrayVisSizeBadge">size: <strong>{nodeCount}</strong></span>
        </div>

        {/* Controls */}
        <div className="arrayVisControls">
          <input
            className="arrayVisInput arrayVisInputSmall"
            type="number"
            placeholder="value"
            value={inputVal}
            disabled={d}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleOp('enqueueRear')}
          />
          {isDeque ? (
            <>
              <button className="arrayVisActionBtn arrayVisActionBtnAdd" onClick={() => handleOp('enqueueFront')} disabled={d}>Add Front</button>
              <button className="arrayVisActionBtn arrayVisActionBtnAdd" onClick={() => handleOp('enqueueRear')} disabled={d}>Add Rear</button>
              <button className="arrayVisActionBtn arrayVisActionBtnRemove" onClick={() => handleOp('dequeueFront')} disabled={d}>Remove Front</button>
              <button className="arrayVisActionBtn arrayVisActionBtnRemove" onClick={() => handleOp('dequeueRear')} disabled={d}>Remove Rear</button>
              <button className="arrayVisActionBtn arrayVisActionBtnAccess" onClick={() => handleOp('peekFront')} disabled={d}>Peek Front</button>
              <button className="arrayVisActionBtn arrayVisActionBtnAccess" onClick={() => handleOp('peekRear')} disabled={d}>Peek Rear</button>
            </>
          ) : (
            <>
              <button className="arrayVisActionBtn arrayVisActionBtnAdd" onClick={() => handleOp('enqueueRear')} disabled={d}>Enqueue</button>
              <button className="arrayVisActionBtn arrayVisActionBtnRemove" onClick={() => handleOp('dequeueFront')} disabled={d}>Dequeue</button>
              <button className="arrayVisActionBtn arrayVisActionBtnAccess" onClick={() => handleOp('peekFront')} disabled={d}>Peek</button>
            </>
          )}
          <button
            className="arrayVisActionBtn"
            style={{ background: 'var(--color-code-bg)', borderColor: 'var(--color-code-border)', color: 'var(--color-text-secondary)' }}
            onClick={reset}
            disabled={d}
          >
            Reset
          </button>
        </div>

        <div className="arrayVisNarration">
          {message ? (
            <span className="arrayVisNarrationText">
              {message}{subMessage ? ` — ${subMessage}` : ''}
            </span>
          ) : (
            <span className="arrayVisNarrationPlaceholder">select an operation to begin</span>
          )}
        </div>
      </div>
    </div>
  )
}
