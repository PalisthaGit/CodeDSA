'use client'

import { useState, useRef, useMemo, useEffect } from 'react'
import { selectionSortDefinition, bubbleSortDefinition, mergeSortDefinition, SortStep, SortElement } from './SortingVisualizer.logic'

const REGISTRY: Record<string, typeof selectionSortDefinition> = {
  selection: selectionSortDefinition,
  bubble: bubbleSortDefinition,
  merge: mergeSortDefinition,
}

const SPEEDS = [700, 350, 150, 60]
const SPEED_LABELS = ['0.5×', '1×', '2×', '4×']

const DEFAULT_VALUES = [64, 25, 12, 22, 11, 45, 38, 19]

function makeElements(values: number[]): SortElement[] {
  return values.map((v, i) => ({ value: v, id: i }))
}

function randomValues(count = 8): number[] {
  return Array.from({ length: count }, () => Math.floor(Math.random() * 85) + 10)
}

function getBarClass(idx: number, step: SortStep | null): string {
  if (!step) return 'svBarDefault'
  const { stepType, comparing = [], swapping = [], sorted = [], merging = [], activeSublistLeft = [], activeSublistRight = [] } = step
  if (stepType === 'complete' || sorted.includes(idx)) return 'svBarSorted'
  if (merging.includes(idx)) return 'svBarSwapping'
  if (swapping.includes(idx)) return 'svBarSwapping'
  if (comparing.includes(idx)) {
    return comparing.length === 1 && step.isMajorStep ? 'svBarMin' : 'svBarComparing'
  }
  if (stepType === 'divide' && (activeSublistLeft.includes(idx) || activeSublistRight.includes(idx))) return 'svBarComparing'
  return 'svBarDefault'
}

export function SortingVisualizer({ algorithmId }: { algorithmId: string }) {
  const key = algorithmId.replace('-sort', '')
  const algo = REGISTRY[key]

  const [values, setValues] = useState(DEFAULT_VALUES)
  const [steps, setSteps] = useState<SortStep[]>(() =>
    algo ? algo.func(makeElements(DEFAULT_VALUES)) : []
  )
  const [stepIdx, setStepIdx] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speedIdx, setSpeedIdx] = useState(1)

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const stepsRef = useRef(steps)
  const speedIdxRef = useRef(speedIdx)
  const stepIdxRef = useRef(stepIdx)

  stepsRef.current = steps
  speedIdxRef.current = speedIdx
  stepIdxRef.current = stepIdx

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  function stopTimer() {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  function tick() {
    const next = stepIdxRef.current + 1
    if (next >= stepsRef.current.length) {
      setIsPlaying(false)
      return
    }
    stepIdxRef.current = next
    setStepIdx(next)
    timerRef.current = setTimeout(tick, SPEEDS[speedIdxRef.current])
  }

  function handlePlay() {
    if (isPlaying) {
      stopTimer()
      setIsPlaying(false)
      return
    }
    if (stepIdxRef.current >= stepsRef.current.length - 1) return
    setIsPlaying(true)
    tick()
  }

  function handleStep() {
    if (isPlaying) {
      stopTimer()
      setIsPlaying(false)
    }
    const next = stepIdx + 1
    if (next < steps.length) setStepIdx(next)
  }

  function handleReset() {
    stopTimer()
    setIsPlaying(false)
    stepIdxRef.current = -1
    setStepIdx(-1)
  }

  function handleShuffle() {
    stopTimer()
    setIsPlaying(false)
    stepIdxRef.current = -1
    const newValues = randomValues()
    const newSteps = algo ? algo.func(makeElements(newValues)) : []
    setValues(newValues)
    setSteps(newSteps)
    setStepIdx(-1)
  }

  const currentStep = stepIdx >= 0 && stepIdx < steps.length ? steps[stepIdx] : null
  const initialElements = useMemo(() => makeElements(values), [values])
  const displayArray = currentStep ? currentStep.array : initialElements
  const maxVal = useMemo(() => Math.max(...displayArray.map((e) => e.value)), [displayArray])
  const isAtEnd = stepIdx >= steps.length - 1

  const statusClass =
    currentStep?.stepType === 'complete'
      ? 'found'
      : currentStep?.stepType === 'swap'
      ? 'notFound'
      : currentStep
      ? 'checking'
      : ''

  if (!algo) {
    return (
      <div className="visualizerCard">
        <p className="visualizerCardLabel">coming soon</p>
      </div>
    )
  }

  return (
    <div className="svOuter">
      {/* Legend */}
      <div className="svLegend">
        {(
          [
            ['svBarDefault', 'unsorted'],
            ['svBarComparing', 'comparing'],
            ['svBarMin', 'minimum'],
            ['svBarSwapping', 'swapping'],
            ['svBarSorted', 'sorted'],
          ] as const
        ).map(([cls, label]) => (
          <span key={label} className="svLegendItem">
            <span className={`svLegendDot ${cls}`} />
            {label}
          </span>
        ))}
      </div>

      {/* Bars */}
      <div className="svBarsContainer">
        {displayArray.map((el, i) => (
          <div
            key={i}
            className={`svBar ${getBarClass(i, currentStep)}`}
            style={{ height: `${(el.value / maxVal) * 100}%` }}
          />
        ))}
      </div>

      {/* Value labels */}
      <div className="svBarLabels">
        {displayArray.map((el, i) => (
          <span key={i} className="svBarLabel">
            {el.value}
          </span>
        ))}
      </div>

      {/* Status */}
      <div className={`visStatusBox${statusClass ? ` ${statusClass}` : ''}`}>
        {currentStep
          ? currentStep.message
          : 'Press ▶ Play or Step → to start the visualization'}
      </div>

      {/* Controls */}
      <div className="visLinearControls svControls">
        <button
          className="visMainBtn"
          onClick={handlePlay}
          disabled={isAtEnd && !isPlaying}
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
        <button
          className="visSecondaryBtn"
          onClick={handleStep}
          disabled={isPlaying || isAtEnd}
        >
          Step →
        </button>
        <button
          className="visSecondaryBtn"
          onClick={handleReset}
          disabled={!isPlaying && stepIdx === -1}
        >
          ↺ Reset
        </button>
        <button className="visSecondaryBtn" onClick={handleShuffle}>
          ⇄ Shuffle
        </button>
        <div className="svSpeedRow">
          {SPEEDS.map((_, i) => (
            <button
              key={i}
              className={`svSpeedBtn${speedIdx === i ? ' svSpeedBtnActive' : ''}`}
              onClick={() => setSpeedIdx(i)}
            >
              {SPEED_LABELS[i]}
            </button>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="svProgress">
        {stepIdx >= 0
          ? `step ${stepIdx + 1} / ${steps.length}`
          : `${steps.length} steps total`}
      </div>
    </div>
  )
}
