'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { definition } from './graph-algos/bfs'
import type { GraphStep, NodeState } from './graph.types'

const NODE_R = 20
const graph = definition.graph!
const ALL = definition.func(graph, { startNodeId: '1' })

const DR1_PRE: GraphStep = {
  stepType: 'initial',
  message: 'Start at vertex 1',
  subMessage: '',
  isMajorStep: true,
  nodeStates: { '1': 'current' },
  edgeStates: {},
  metadata: { distances: {}, previous: {}, path: [], frontier: [], visitedOrder: [] },
}

export const BFS_STEPS = {
  step1: ALL.slice(0, 4),
  step2: ALL.slice(5, 9),
  step3: ALL.slice(10, 13),
  step4: ALL.slice(14, 17),
  step5: [18, 19, 21, 22, 23, 25, 26, 27].map(i => ALL[i]),
  dr1:   [DR1_PRE, ALL[0]],
  dr2:   ALL.slice(0, 4),
  dr3:   [ALL[4],  ...ALL.slice(5, 9)],
  dr4:   [ALL[9],  ...ALL.slice(10, 13)],
  dr5:   [ALL[13], ...ALL.slice(14, 17)],
  dr6:   [ALL[17], ...[18, 19, 21, 22, 23, 25, 26, 27].map(i => ALL[i])],
}

function nodeColors(state?: NodeState) {
  switch (state) {
    case 'current':   return { fill: '#FFF9C4', stroke: '#F0D060', text: '#5A5020' }
    case 'visited':
    case 'skip':      return { fill: '#D6EEFF', stroke: '#2E86C8', text: '#0D4E7A' }
    case 'candidate': return { fill: '#FFF2D9', stroke: '#CC8800', text: '#7A4E00' }
    default:          return { fill: '#F8F6FF', stroke: '#EDE8F8', text: '#2D2D2D' }
  }
}

interface Props {
  vizKey: keyof typeof BFS_STEPS
}

const DR_KEYS = new Set(['dr1', 'dr2', 'dr3', 'dr4', 'dr5', 'dr6'])

export function BfsStepVisualizer({ vizKey }: Props) {
  const isDryRun = DR_KEYS.has(vizKey)
  const steps = BFS_STEPS[vizKey]
  const [stepIdx, setStepIdx] = useState(-1)
  const [playing, setPlaying] = useState(false)
  const [done, setDone] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const playingRef = useRef(false)
  const stepIdxRef = useRef(-1)
  const doneRef = useRef(false)
  const stepsRef = useRef(steps)

  const currentStep: GraphStep | null = steps[Math.max(0, stepIdx)] ?? null
  const nodeMap = Object.fromEntries(graph.nodes.map(n => [n.id, n]))
  const nodeStates = currentStep?.nodeStates ?? {}
  const edgeStates = currentStep?.edgeStates ?? {}

  const stop = useCallback((isDone: boolean) => {
    playingRef.current = false
    setPlaying(false)
    if (timerRef.current) clearTimeout(timerRef.current)
    if (isDone) { doneRef.current = true; setDone(true) }
  }, [])

  const runNext = useCallback(() => {
    const s = stepsRef.current
    const idx = stepIdxRef.current + 1
    if (!playingRef.current || idx >= s.length) { stop(idx >= s.length); return }
    stepIdxRef.current = idx
    setStepIdx(idx)
    if (idx + 1 < s.length) {
      timerRef.current = setTimeout(runNext, s[idx].isMajorStep ? 1200 : 700)
    } else {
      stop(true)
    }
  }, [stop])

  const kickoff = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    // step 0 is already shown as the initial state, so start playback from step 1
    stepIdxRef.current = 0
    doneRef.current = false
    setStepIdx(0)
    setDone(false)
    playingRef.current = true
    setPlaying(true)
    runNext()
  }, [runNext])

  const handleMain = useCallback(() => {
    if (doneRef.current || stepIdxRef.current <= 0) kickoff()
    else if (playingRef.current) stop(false)
    else { playingRef.current = true; setPlaying(true); runNext() }
  }, [kickoff, stop, runNext])

  const doStep = useCallback(() => {
    if (playing || done) return
    const s = stepsRef.current
    // step 0 is already shown as initial state, so first press jumps to 1
    const idx = stepIdxRef.current < 0 ? 1 : stepIdxRef.current + 1
    if (idx >= s.length) return
    stepIdxRef.current = idx
    setStepIdx(idx)
    if (idx >= s.length - 1) { doneRef.current = true; setDone(true) }
  }, [playing, done])

  const reset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    playingRef.current = false
    doneRef.current = false
    stepIdxRef.current = -1
    setStepIdx(-1)
    setPlaying(false)
    setDone(false)
  }, [])

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  const mainLabel = playing ? '⏸ Pause' : done ? '↺ Replay' : '▶ Play'

  return (
    <div className="bfsStep1Wrap">
      <div className="visualizerCard gvCard">
        <div className="gvCanvasWrap">
          <svg className="gvSvg" viewBox="0 0 560 300" preserveAspectRatio="xMidYMid meet">
            {graph.edges.map(edge => {
              const a = nodeMap[edge.from]
              const b = nodeMap[edge.to]
              if (!a || !b) return null
              const state = edgeStates[edge.id]
              if (state === 'exploring') {
                const sourceIsFrom = nodeStates[edge.from] === 'current'
                const sx = sourceIsFrom ? a.x : b.x
                const sy = sourceIsFrom ? a.y : b.y
                const ex = sourceIsFrom ? b.x : a.x
                const ey = sourceIsFrom ? b.y : a.y
                return (
                  <g key={`${edge.id}-${stepIdx}`}>
                    <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#D0C8F0" strokeWidth={1.5} />
                    <path
                      d={`M${sx},${sy} L${ex},${ey}`}
                      pathLength="1"
                      stroke="#7B4DCC"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeDasharray="1"
                      strokeDashoffset="1"
                      fill="none"
                    >
                      <animate attributeName="stroke-dashoffset" from="1" to="0" dur="0.4s" fill="freeze" />
                    </path>
                  </g>
                )
              }
              return (
                <line key={edge.id} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke={state === 'tree' ? '#80D0A0' : '#D0C8F0'}
                  strokeWidth={state ? 2.5 : 1.5}
                />
              )
            })}
            {graph.nodes.map(node => {
              const state = nodeStates[node.id]
              const { fill, stroke, text } = nodeColors(state)
              return (
                <g key={node.id}>
                  <circle
                    cx={node.x} cy={node.y} r={NODE_R}
                    fill={fill} stroke={stroke} strokeWidth={1.5}
                    strokeDasharray={state === 'skip' ? '5 3' : undefined}
                  />
                  <text x={node.x} y={node.y + 5} textAnchor="middle" fontSize={13} fontWeight="600" fill={text} fontFamily="'Patrick Hand', cursive">
                    {node.id}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {isDryRun && (() => {
          const frontier = currentStep?.metadata.frontier ?? []
          const visitedOrder = currentStep?.metadata.visitedOrder ?? []
          return (
            <div className="bfsQueues">
              <div className="bfsPanelSection">
                <div className="bfsPanelLabel">Queue (front → back)</div>
                <div className="bfsPanelNodes">
                  {frontier.length === 0
                    ? <span className="bfsPanelEmpty">empty</span>
                    : frontier.map((id, i) => <span key={i} className="bfsQueueNode">{id}</span>)
                  }
                </div>
              </div>
              <div className="bfsPanelSection">
                <div className="bfsPanelLabel">Visited (in order)</div>
                <div className="bfsPanelNodes">
                  {visitedOrder.length === 0
                    ? <span className="bfsPanelEmpty">none yet</span>
                    : visitedOrder.map((id, i) => <span key={i} className="bfsVisitedNode">{id}</span>)
                  }
                </div>
              </div>
            </div>
          )
        })()}

        <div className="gvLegend">
          <span className="gvLegendItem"><span className="gvDot gvDotCurrent" />current</span>
          <span className="gvLegendItem"><span className="gvDot gvDotVisited" />visited</span>
          <span className="gvLegendItem"><span className="gvDot gvDotQueue" />in queue</span>
          <span className="gvLegendItem"><span className="gvDot gvDotSkip" />already visited</span>
        </div>

        <div className="visLinearControls gvControls bfsStep1Controls">
          <button className="visMainBtn" onClick={handleMain}>{mainLabel}</button>
          <button className={`visSecondaryBtn${playing || done ? ' dim' : ''}`} onClick={doStep}>Step →</button>
          <button className={`visSecondaryBtn${stepIdx < 0 ? ' dim' : ''}`} onClick={reset}>Reset</button>
          {stepIdx >= 0 && <span className="gvProgress">step {stepIdx + 1} / {steps.length}</span>}
        </div>
      </div>
    </div>
  )
}
