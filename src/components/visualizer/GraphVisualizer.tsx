'use client'

import { useGraphVisualizer } from './GraphVisualizer.logic'
import type { NodeState, EdgeState } from './graph.types'

const NODE_R = 20

function nodeColors(state?: NodeState) {
  switch (state) {
    case 'current':   return { fill: '#FFF9C4', stroke: '#F0D060', text: '#5A5020' }
    case 'visited':   return { fill: '#D6EEFF', stroke: '#2E86C8', text: '#0D4E7A' }
    case 'skip':      return { fill: '#D6EEFF', stroke: '#2E86C8', text: '#0D4E7A' }
    case 'candidate': return { fill: '#FFF2D9', stroke: '#CC8800', text: '#7A4E00' }
    case 'path':      return { fill: '#C8F0D8', stroke: '#80D0A0', text: '#27500A' }
    default:          return { fill: '#F8F6FF', stroke: '#EDE8F8', text: '#2D2D2D' }
  }
}

function edgeStroke(state?: EdgeState): string {
  if (state === 'tree') return '#80D0A0'
  if (state === 'exploring') return '#F0D060'
  if (state === 'candidate') return '#B8A0E8'
  return '#D0C8F0'
}

function statusVariant(stepType?: string): string {
  if (stepType === 'path' || stepType === 'complete') return 'found'
  if (stepType === 'visit') return 'info'
  if (stepType === 'explore') return 'checking'
  return ''
}

interface Props {
  algorithm: string
}

export function GraphVisualizer({ algorithm }: Props) {
  const {
    graph,
    algoName,
    algorithmCategory,
    nodeStates,
    edgeStates,
    message,
    subMessage,
    stepType,
    playing,
    startNodeId,
    endNodeId,
    setStartNodeId,
    setEndNodeId,
    mainBtnLabel,
    stepDim,
    resetDim,
    handleMain,
    doStep,
    fullReset,
    stepIdx,
    totalSteps,
    currentStep,
  } = useGraphVisualizer(algorithm)

  const isBFS = algorithm === 'bfs'

  const isMST = algorithmCategory === 'spanning-tree'

  const nodeMap = Object.fromEntries(graph.nodes.map(n => [n.id, n]))

  return (
    <div className="visLayout">
      <div className="visualizerCard gvCard">
        <h2 className="visCardTitle">{algoName.toLowerCase()}</h2>

        <div className="gvCanvasWrap">
          <svg className="gvSvg" viewBox="0 0 560 300" preserveAspectRatio="xMidYMid meet">
            {graph.edges.map(edge => {
              const a = nodeMap[edge.from]
              const b = nodeMap[edge.to]
              if (!a || !b) return null
              const mx = (a.x + b.x) / 2
              const my = (a.y + b.y) / 2
              const state = edgeStates[edge.id]
              const stroke = edgeStroke(state)
              return (
                <g key={edge.id}>
                  <line
                    x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                    stroke={stroke}
                    strokeWidth={state ? 2.5 : 1.5}
                  />
                  {!isBFS && (
                    <>
                      <rect x={mx - 9} y={my - 9} width={18} height={16} rx={4} fill="#FEFEFE" stroke={stroke} strokeWidth={0.5} />
                      <text x={mx} y={my + 3} textAnchor="middle" fontSize={10} fill="#888" fontFamily="monospace">
                        {edge.weight}
                      </text>
                    </>
                  )}
                </g>
              )
            })}

            {graph.nodes.map(node => {
              const state = nodeStates[node.id]
              const { fill, stroke, text } = nodeColors(state)
              const isStart = node.id === startNodeId
              const isEnd = !isMST && !isBFS && node.id === endNodeId
              const dashed = isEnd && stepType !== 'path' && stepType !== 'complete'
              const dashArray = state === 'skip' ? '5 3' : (dashed ? '4 2' : undefined)
              return (
                <g key={node.id}>
                  <circle
                    cx={node.x} cy={node.y} r={NODE_R}
                    fill={fill} stroke={stroke}
                    strokeWidth={isStart || isEnd ? 2.5 : 1.5}
                    strokeDasharray={dashArray}
                  />
                  <text x={node.x} y={node.y + 5} textAnchor="middle" fontSize={13} fontWeight="600" fill={text} fontFamily="'Patrick Hand', cursive">
                    {node.id}
                  </text>
                  {(isStart || isEnd) && (
                    <text x={node.x} y={node.y - NODE_R - 5} textAnchor="middle" fontSize={9} fill="#B8A0E8" fontFamily="monospace" fontWeight="700">
                      {isStart ? 'start' : 'end'}
                    </text>
                  )}
                </g>
              )
            })}
          </svg>
        </div>

        {isMST ? (
          <div className="gvLegend">
            <span className="gvLegendItem"><span className="gvDot gvDotCurrent" />being added</span>
            <span className="gvLegendItem"><span className="gvDot gvDotCandidate" />frontier</span>
            <span className="gvLegendItem"><span className="gvDot gvDotVisited" />in MST</span>
            <span className="gvLegendItem"><span className="gvEdgeLine" />MST edge</span>
          </div>
        ) : (
          <div className="gvLegend">
            <span className="gvLegendItem"><span className="gvDot gvDotCurrent" />current</span>
            <span className="gvLegendItem"><span className="gvDot gvDotQueue" />{isBFS ? 'in queue' : 'open set'}</span>
            <span className="gvLegendItem"><span className="gvDot gvDotVisited" />visited</span>
            {!isBFS && <span className="gvLegendItem"><span className="gvDot gvDotPath" />path</span>}
          </div>
        )}

        {isBFS && (
          <div className="bfsQueues">
            <div className="bfsPanelSection">
              <div className="bfsPanelLabel">Queue (front → back)</div>
              <div className="bfsPanelNodes">
                {(currentStep?.metadata.frontier ?? []).length === 0
                  ? <span className="bfsPanelEmpty">empty</span>
                  : (currentStep?.metadata.frontier ?? []).map((id, i) => (
                      <span key={i} className="bfsQueueNode">{id}</span>
                    ))
                }
              </div>
            </div>
            <div className="bfsPanelSection">
              <div className="bfsPanelLabel">Visited (in order)</div>
              <div className="bfsPanelNodes">
                {(currentStep?.metadata.visitedOrder ?? []).length === 0
                  ? <span className="bfsPanelEmpty">none yet</span>
                  : (currentStep?.metadata.visitedOrder ?? []).map((id, i) => (
                      <span key={i} className="bfsVisitedNode">{id}</span>
                    ))
                }
              </div>
            </div>
          </div>
        )}

        <div className={`visStatusBox gvStatus ${isBFS && stepType === 'complete' ? 'info' : statusVariant(stepType)}`}>
          <div className="gvStatusMessage">{message}</div>
          {subMessage && <div className="gvStatusSub">{subMessage}</div>}
        </div>

        <div className="visLinearControls gvControls">
          <span className="gvLabel">{isMST || isBFS ? 'start' : 'from'}</span>
          <select
            className="gvSelect"
            value={startNodeId}
            disabled={playing}
            onChange={e => { fullReset(); setStartNodeId(e.target.value) }}
          >
            {graph.nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
          </select>
          {!isMST && !isBFS && (
            <>
              <span className="gvLabel">to</span>
              <select
                className="gvSelect"
                value={endNodeId}
                disabled={playing}
                onChange={e => { fullReset(); setEndNodeId(e.target.value) }}
              >
                {graph.nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
              </select>
            </>
          )}
          <button className="visMainBtn" onClick={handleMain}>
            {playing ? '⏸' : '▶'} {mainBtnLabel}
          </button>
          <button className={`visSecondaryBtn${stepDim ? ' dim' : ''}`} onClick={doStep}>Step →</button>
          <button className={`visSecondaryBtn${resetDim ? ' dim' : ''}`} onClick={fullReset}>Reset</button>
          {totalSteps > 0 && (
            <span className="gvProgress">step {stepIdx + 1} / {totalSteps}</span>
          )}
        </div>
      </div>
    </div>
  )
}
