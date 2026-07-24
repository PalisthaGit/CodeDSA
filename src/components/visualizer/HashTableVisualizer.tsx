'use client'

import { useRef, useState } from 'react'
import {
  type HashStep,
  type HashTableType,
  type SlotState,
  OpenSteps,
  ChainingSteps,
} from './HashTableVisualizer.logic'

const INITIAL_SIZE = 7
const ANIMATION_DELAY = 700

function sleep(ms: number) { return new Promise<void>(r => setTimeout(r, ms)) }

type Operation = 'insert' | 'search' | 'delete' | 'rehash'

const TYPE_LABELS: Record<HashTableType, string> = {
  linear: 'Linear Probing',
  quadratic: 'Quadratic Probing',
  double: 'Double Hashing',
  chaining: 'Separate Chaining',
}

const LEGEND_ITEMS: [SlotState, string][] = [
  ['occupied', 'occupied'],
  ['probing', 'probing'],
  ['found', 'found'],
  ['notFound', 'not found'],
  ['inserted', 'inserted'],
  ['deleted', 'deleted / tombstone'],
  ['rehashing', 'rehashing'],
]

function slotClass(state: SlotState): string {
  switch (state) {
    case 'occupied':  return 'htCell htCellOccupied'
    case 'deleted':   return 'htCell htCellDeleted'
    case 'probing':   return 'htCell htCellProbing'
    case 'found':     return 'htCell htCellFound'
    case 'notFound':  return 'htCell htCellNotFound'
    case 'inserted':  return 'htCell htCellInserted'
    case 'rehashing': return 'htCell htCellRehashing'
    case 'hashed':    return 'htCell htCellHashed'
    default:          return 'htCell'
  }
}

function OpenView({ step }: { step: HashStep }) {
  const slots = step.slots ?? []
  return (
    <div className="htTableScroll">
      <div className="htTable">
        {slots.map(slot => (
          <div key={slot.index} className="htRow">
            <span className={`htIndex${slot.index === step.hashIndex ? ' htIndexHighlight' : ''}`}>
              {slot.index}
            </span>
            <span className={`htArrow${slot.index === step.hashIndex ? ' htArrowVisible' : ''}`}>→</span>
            <div className={slotClass(slot.state)}>
              {slot.isDeleted ? (
                <span className="htCellDelMark">DEL</span>
              ) : slot.key === null ? (
                <span className="htCellEmpty">empty</span>
              ) : (
                slot.key
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ChainingView({ step }: { step: HashStep }) {
  const buckets = step.buckets ?? []
  return (
    <div className="htTableScroll">
      <div className="htTable">
        {buckets.map(bucket => (
          <div key={bucket.index} className="htRow htRowChaining">
            <span className={`htIndex${bucket.index === step.hashIndex ? ' htIndexHighlight' : ''}`}>
              {bucket.index}
            </span>
            <span className={`htArrow${bucket.index === step.hashIndex ? ' htArrowVisible' : ''}`}>→</span>
            <div className={`htBucketHead${bucket.chain.length > 0 ? ` ${slotClass(bucket.state)}` : ''}`}>
              {bucket.chain.length > 0 ? '▸' : '∅'}
            </div>
            <div className="htChain">
              {bucket.chain.map((node, j) => (
                <div key={j} className="htChainNodeWrap">
                  {j > 0 && <span className="htChainConnector">→</span>}
                  <div className={`htChainNode${node.state !== 'occupied' ? ` ${slotClass(node.state)}` : ''}`}>
                    {node.key}
                  </div>
                </div>
              ))}
              {bucket.chain.length === 0 && <span className="htChainNull">null</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function HashTableVisualizer() {
  const [tableType, setTableType] = useState<HashTableType>('linear')
  const openRef = useRef(new OpenSteps(INITIAL_SIZE, 'linear'))
  const chainRef = useRef(new ChainingSteps(INITIAL_SIZE))

  function initialStep(type: HashTableType): HashStep {
    return type === 'chaining'
      ? new ChainingSteps(INITIAL_SIZE).getInitialStep()
      : new OpenSteps(INITIAL_SIZE, type).getInitialStep()
  }

  const [step, setStep] = useState<HashStep>(() => initialStep('linear'))
  const [inputVal, setInputVal] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)

  function handleTypeChange(type: HashTableType) {
    if (isAnimating) return
    openRef.current = new OpenSteps(INITIAL_SIZE, type !== 'chaining' ? type : 'linear')
    chainRef.current = new ChainingSteps(INITIAL_SIZE)
    setTableType(type)
    setStep(initialStep(type))
    setInputVal('')
  }

  function handleReset() {
    if (isAnimating) return
    openRef.current = new OpenSteps(INITIAL_SIZE, tableType !== 'chaining' ? tableType : 'linear')
    chainRef.current = new ChainingSteps(INITIAL_SIZE)
    setStep(initialStep(tableType))
    setInputVal('')
  }

  async function runSteps(steps: HashStep[]) {
    setIsAnimating(true)
    for (const s of steps) {
      setStep(s)
      await sleep(ANIMATION_DELAY)
    }
    setIsAnimating(false)
  }

  async function handleOp(op: Operation) {
    if (isAnimating) return

    if (op === 'rehash') {
      const steps = tableType === 'chaining'
        ? chainRef.current.rehash()
        : openRef.current.rehash()
      await runSteps(steps)
      return
    }

    const key = parseInt(inputVal, 10)
    if (isNaN(key)) {
      setStep(prev => ({ ...prev, message: 'Enter a valid integer key' }))
      return
    }

    let steps: HashStep[]
    if (tableType === 'chaining') {
      if (op === 'insert') steps = chainRef.current.insert(key)
      else if (op === 'search') steps = chainRef.current.search(key)
      else steps = chainRef.current.delete(key)
    } else {
      if (op === 'insert') steps = openRef.current.insert(key)
      else if (op === 'search') steps = openRef.current.search(key)
      else steps = openRef.current.delete(key)
    }

    setInputVal('')
    await runSteps(steps)
  }

  const isChaining = tableType === 'chaining'
  const loadFactor = step.count / step.tableSize
  const threshold = isChaining ? 1.0 : 0.7
  const loadPct = Math.min(loadFactor / threshold, 1)
  const d = isAnimating

  let loadColorClass = 'htLoadFillGood'
  let loadValueClass = 'htLoadGood'
  if (loadPct > 0.85) { loadColorClass = 'htLoadFillDanger'; loadValueClass = 'htLoadDanger' }
  else if (loadPct > 0.6) { loadColorClass = 'htLoadFillWarn'; loadValueClass = 'htLoadWarn' }

  return (
    <div className="arrayVisOuter arrayVisOuterEmbedded">
      <div className="arrayVis" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
        <div className="arrayVisHeader">
          <h3 className="arrayVisTitle">hash table — {TYPE_LABELS[tableType].toLowerCase()}</h3>
        </div>

        {/* Type selector */}
        <div className="htTypeRow">
          {(['linear', 'quadratic', 'double', 'chaining'] as HashTableType[]).map(t => (
            <button
              key={t}
              className={`htTypeBtn${tableType === t ? ' htTypeBtnActive' : ''}`}
              disabled={d}
              onClick={() => handleTypeChange(t)}
            >
              {TYPE_LABELS[t]}
            </button>
          ))}
        </div>

        {/* Load factor stats */}
        <div className="htStatsRow">
          <span className="htStat">size: <strong>{step.tableSize}</strong></span>
          <span className="htStat">keys: <strong>{step.count}</strong></span>
          <span className="htStat">λ: <strong className={loadValueClass}>{loadFactor.toFixed(2)}</strong></span>
          <div className="htLoadBarOuter">
            <div className={`htLoadFill ${loadColorClass}`} style={{ width: `${loadPct * 100}%` }} />
          </div>
          <span className="htStatSmall">rehash @ λ={threshold}</span>
        </div>

        {/* Visualization canvas */}
        <div className="htCanvas">
          {isChaining ? <ChainingView step={step} /> : <OpenView step={step} />}
        </div>

        {/* Legend */}
        <div className="htLegend">
          {LEGEND_ITEMS.map(([state, label]) => (
            <div key={state} className="htLegendItem">
              <span className={`htLegendDot htLegendDot${state.charAt(0).toUpperCase() + state.slice(1)}`} />
              <span>{label}</span>
            </div>
          ))}
          <div className="htLegendItem">
            <span className="htArrowSmall">→</span>
            <span>hash target</span>
          </div>
        </div>

        {/* Controls */}
        <div className="arrayVisControls">
          <input
            className="arrayVisInput arrayVisInputSmall"
            type="number"
            placeholder="key"
            value={inputVal}
            disabled={d}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleOp('insert')}
          />
          <button className="arrayVisActionBtn arrayVisActionBtnAdd" onClick={() => handleOp('insert')} disabled={d}>Insert</button>
          <button className="arrayVisActionBtn arrayVisActionBtnAccess" onClick={() => handleOp('search')} disabled={d}>Search</button>
          <button className="arrayVisActionBtn arrayVisActionBtnRemove" onClick={() => handleOp('delete')} disabled={d}>Delete</button>
          <button className="arrayVisActionBtn arrayVisActionBtnUpdate" onClick={() => handleOp('rehash')} disabled={d}>Rehash</button>
          <button
            className="arrayVisActionBtn"
            style={{ background: 'var(--color-code-bg)', borderColor: 'var(--color-code-border)', color: 'var(--color-text-secondary)' }}
            onClick={handleReset}
            disabled={d}
          >
            Reset
          </button>
        </div>

        {/* Narration */}
        <div className="arrayVisNarration">
          {step.message ? (
            <span className="arrayVisNarrationText">{step.message}</span>
          ) : (
            <span className="arrayVisNarrationPlaceholder">select an operation to begin</span>
          )}
        </div>
      </div>
    </div>
  )
}
