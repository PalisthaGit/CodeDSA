'use client'

import { useRef, useState } from 'react'
import { Stack, type StackNode, type StackStep, STACK_EMPTY_STEP } from './StackVisualizer.logic'

const INITIAL_ITEMS: (number | string)[] = [10, 20, 30]

// These must match the CSS constants
const NODE_HEIGHT = 44
const NODE_GAP = 4
const BORDER_BOTTOM = 6
const PADDING_BOTTOM = 6

function sleep(ms: number) { return new Promise<void>(r => setTimeout(r, ms)) }

function makeInitialStep(items: (number | string)[]): StackStep {
  if (!items.length) return STACK_EMPTY_STEP
  return {
    nodes: items.map((v, i) => ({
      id: `node-${i}`,
      value: v,
      state: i === items.length - 1 ? 'top' : 'idle',
    })),
    message: 'Select an operation to begin',
    subMessage: `Stack size: ${items.length}`,
    metadata: { operation: 'init', size: items.length, topValue: items[items.length - 1] },
  }
}

function nodeClass(state: StackNode['state']): string {
  switch (state) {
    case 'top':     return 'stackNode stackNodeTop'
    case 'pushing': return 'stackNode stackNodePushing'
    case 'popping': return 'stackNode stackNodePopping'
    case 'peeking': return 'stackNode stackNodePeeking'
    case 'active':  return 'stackNode stackNodeActive'
    default:        return 'stackNode'
  }
}

type StackOp = 'all' | 'push' | 'pop' | 'peek'

export function StackVisualizer({ op = 'all', startEmpty = false }: { op?: StackOp; startEmpty?: boolean }) {
  const initial = startEmpty ? [] : INITIAL_ITEMS
  const stackRef = useRef<(number | string)[]>([...initial])
  const [step, setStep] = useState<StackStep>(() => makeInitialStep(initial))
  const [inputVal, setInputVal] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)

  function reset() {
    if (isAnimating) return
    stackRef.current = [...initial]
    setStep(makeInitialStep(initial))
    setInputVal('')
  }

  async function runSteps(steps: StackStep[]) {
    setIsAnimating(true)
    for (const s of steps) {
      setStep(s)
      await sleep(750)
    }
    setIsAnimating(false)
  }

  async function handlePush() {
    if (isAnimating) return
    const val = parseFloat(inputVal)
    if (isNaN(val)) {
      setStep(prev => ({ ...prev, message: 'Enter a value to push', subMessage: '' }))
      return
    }
    if (stackRef.current.length >= 6) {
      setStep(prev => ({ ...prev, message: 'Stack is full (max 6 items in this demo)', subMessage: '' }))
      return
    }
    const steps = Stack.generatePushSteps(stackRef.current, val)
    stackRef.current = [...stackRef.current, val]
    setInputVal('')
    await runSteps(steps)
  }

  async function handlePop() {
    if (isAnimating) return
    const steps = Stack.generatePopSteps(stackRef.current)
    if (stackRef.current.length > 0) stackRef.current = stackRef.current.slice(0, -1)
    await runSteps(steps)
  }

  async function handlePeek() {
    if (isAnimating) return
    const steps = Stack.generatePeekSteps(stackRef.current)
    await runSteps(steps)
  }

  const { nodes, message, subMessage, metadata } = step
  const size = metadata?.size ?? nodes.length
  const d = isAnimating

  const topNodeMid =
    nodes.length > 0
      ? BORDER_BOTTOM + PADDING_BOTTOM + (nodes.length - 1) * (NODE_HEIGHT + NODE_GAP) + NODE_HEIGHT / 2
      : 0

  return (
    <div className="arrayVisOuter arrayVisOuterEmbedded">
      <div className="arrayVis" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
        <div className="arrayVisHeader">
          <h3 className="arrayVisTitle">stack — last in, first out</h3>
        </div>

        {/* U-shaped container with label */}
        <div className="stackLayout">
          <div className={`stackContainer${nodes.length === 0 ? ' stackContainerEmpty' : ''}`}>
            {nodes.length === 0 ? (
              <span className="stackEmptyText">empty</span>
            ) : (
              nodes.map((node) => (
                <div key={node.id} className={nodeClass(node.state)}>
                  <span className="stackNodeValue">{node.value}</span>
                </div>
              ))
            )}
          </div>

          <div className="stackLabelArea">
            {nodes.length > 0 && (
              <span
                className="stackTopLabel"
                style={{ bottom: `${topNodeMid}px`, transform: 'translateY(50%)' }}
              >
                ← top
              </span>
            )}
          </div>
        </div>

        <div className="arrayVisMeta">
          <span className="arrayVisSizeBadge">size: <strong>{size}</strong></span>
        </div>

        <div className="arrayVisControls">
          {(op === 'all' || op === 'push') && (
            <input
              className="arrayVisInput arrayVisInputSmall"
              type="number"
              placeholder="value"
              value={inputVal}
              disabled={d}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handlePush()}
            />
          )}
          {(op === 'all' || op === 'push') && (
            <button className="arrayVisActionBtn arrayVisActionBtnAdd" onClick={handlePush} disabled={d}>Push</button>
          )}
          {(op === 'all' || op === 'pop') && (
            <button className="arrayVisActionBtn arrayVisActionBtnRemove" onClick={handlePop} disabled={d}>Pop</button>
          )}
          {(op === 'all' || op === 'peek') && (
            <button className="arrayVisActionBtn arrayVisActionBtnAccess" onClick={handlePeek} disabled={d}>Peek</button>
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
