'use client'

import { useMemo, useRef, useState } from 'react'
import {
  BSTNode,
  BSTSteps,
  bstDeleteMutate,
  bstInsertMutate,
  TREE_EMPTY_STEP,
  TreeNodeState,
  TreeStep,
  VisNode,
} from '@/lib/binary-tree'

// ── Layout constants ──────────────────────────────────────────────────────────

const NODE_R = 22
const LEVEL_H = 72
const MIN_SEP = 56
const SPEED_MS = 600

// ── State → colour mapping ────────────────────────────────────────────────────

type StateStyle = { fill: string; stroke: string; text: string }

const STATE_STYLES: Record<TreeNodeState, StateStyle> = {
  idle:       { fill: 'var(--color-bg)',           stroke: 'var(--color-purple-border)', text: 'var(--color-text-primary)' },
  comparing:  { fill: 'var(--color-yellow-light)',  stroke: 'var(--color-yellow-border)', text: 'var(--color-yellow-text)' },
  inserting:  { fill: 'var(--color-green-light)',   stroke: 'var(--color-green-border)',  text: '#1A5030' },
  deleting:   { fill: '#FFE0E0',                   stroke: '#F4A7A7',                    text: '#803030' },
  found:      { fill: 'var(--color-green-light)',   stroke: 'var(--color-green-border)',  text: '#1A5030' },
  notFound:   { fill: 'var(--color-bg)',            stroke: 'var(--color-purple-border)', text: 'var(--color-text-muted)' },
  traversing: { fill: 'var(--color-blue-light)',    stroke: 'var(--color-blue-border)',   text: '#1A4070' },
  swapping:   { fill: 'var(--color-purple-bar)',    stroke: 'var(--color-purple-text)',   text: '#2D2D2D' },
  successor:  { fill: 'var(--color-blue-section)',  stroke: 'var(--color-blue-border)',   text: '#1A4070' },
  unbalanced: { fill: '#FFE0E0',                   stroke: '#F4A7A7',                    text: '#803030' },
  rotating:   { fill: 'var(--color-purple-bar)',    stroke: 'var(--color-purple-text)',   text: '#2D2D2D' },
}

// ── Legend entries ────────────────────────────────────────────────────────────

const LEGEND: { label: string; fill: string; stroke: string }[] = [
  { label: 'Comparing',  fill: 'var(--color-yellow-light)', stroke: 'var(--color-yellow-border)' },
  { label: 'Inserting',  fill: 'var(--color-green-light)',  stroke: 'var(--color-green-border)'  },
  { label: 'Deleting',   fill: '#FFE0E0',                  stroke: '#F4A7A7'                    },
  { label: 'Found',      fill: 'var(--color-green-light)',  stroke: 'var(--color-green-border)'  },
  { label: 'Traversing', fill: 'var(--color-blue-light)',   stroke: 'var(--color-blue-border)'   },
  { label: 'Swapping',   fill: 'var(--color-purple-bar)',   stroke: 'var(--color-purple-text)'   },
]

// ── Tree layout ───────────────────────────────────────────────────────────────

interface LayoutNode { id: string; x: number; y: number }

function computeLayout(nodes: VisNode[], rootId: string | null): Record<string, LayoutNode> {
  if (!rootId || nodes.length === 0) return {}
  const byId = Object.fromEntries(nodes.map(n => [n.id, n]))
  const offsets: Record<string, number> = {}
  let counter = 0

  function assignX(id: string | null): void {
    if (!id || !byId[id]) return
    assignX(byId[id].left)
    offsets[id] = counter++
    assignX(byId[id].right)
  }
  assignX(rootId)

  const pos: Record<string, LayoutNode> = {}
  function assignY(id: string | null, depth: number): void {
    if (!id || !byId[id]) return
    pos[id] = { id, x: offsets[id] * MIN_SEP, y: depth * LEVEL_H + NODE_R + 10 }
    assignY(byId[id].left, depth + 1)
    assignY(byId[id].right, depth + 1)
  }
  assignY(rootId, 0)

  const xs = Object.values(pos).map(p => p.x)
  const minX = Math.min(...xs)
  Object.values(pos).forEach(p => { p.x -= minX - NODE_R })
  return pos
}

// ── Component ─────────────────────────────────────────────────────────────────

type BSTOp = 'insert' | 'delete' | 'search' | 'inorder' | 'preorder' | 'postorder' | 'levelOrder' | 'dfs'

function sleep(ms: number) { return new Promise<void>(r => setTimeout(r, ms)) }

export function BinaryTreeVisualizer() {
  const bstRootRef = useRef<BSTNode | null>(null)
  const [displayStep, setDisplayStep] = useState<TreeStep>(TREE_EMPTY_STEP)
  const [inputVal, setInputVal] = useState('42')
  const [isRunning, setIsRunning] = useState(false)

  const layout = useMemo(
    () => computeLayout(displayStep.nodes, displayStep.rootId),
    [displayStep.nodes, displayStep.rootId],
  )

  const svgWidth = useMemo(() => {
    const xs = Object.values(layout).map(p => p.x)
    return xs.length > 0 ? Math.max(...xs) + NODE_R + 10 : 200
  }, [layout])

  const svgHeight = useMemo(() => {
    const ys = Object.values(layout).map(p => p.y)
    return ys.length > 0 ? Math.max(...ys) + NODE_R + 20 : 100
  }, [layout])

  async function runSteps(steps: TreeStep[]) {
    setIsRunning(true)
    for (const s of steps) {
      setDisplayStep(s)
      await sleep(SPEED_MS)
    }
    setIsRunning(false)
  }

  async function runOp(op: BSTOp) {
    if (isRunning) return
    const val = parseInt(inputVal, 10)
    const needsVal = op === 'insert' || op === 'delete' || op === 'search'
    if (needsVal && isNaN(val)) {
      setDisplayStep(prev => ({ ...prev, message: 'Enter a number first', subMessage: '' }))
      return
    }

    let steps: TreeStep[]
    switch (op) {
      case 'insert':    steps = BSTSteps.insert(bstRootRef.current, val); break
      case 'delete':    steps = BSTSteps.delete(bstRootRef.current, val); break
      case 'search':    steps = BSTSteps.search(bstRootRef.current, val); break
      case 'inorder':   steps = BSTSteps.inorder(bstRootRef.current); break
      case 'preorder':  steps = BSTSteps.preorder(bstRootRef.current); break
      case 'postorder': steps = BSTSteps.postorder(bstRootRef.current); break
      case 'levelOrder': steps = BSTSteps.levelOrder(bstRootRef.current); break
      case 'dfs':       steps = BSTSteps.dfs(bstRootRef.current); break
    }

    await runSteps(steps)

    if (op === 'insert') bstRootRef.current = bstInsertMutate(bstRootRef.current, val)
    else if (op === 'delete') bstRootRef.current = bstDeleteMutate(bstRootRef.current, val)
  }

  function reset() {
    if (isRunning) return
    bstRootRef.current = null
    setDisplayStep(TREE_EMPTY_STEP)
    setInputVal('42')
  }

  const d = isRunning

  return (
    <div className="arrayVisOuter">
      <div className="arrayVis btVis">

        <div className="arrayVisHeader">
          <h3 className="arrayVisTitle">binary search tree</h3>
        </div>

        {/* Tree canvas */}
        <div className="btSvgWrap">
          {displayStep.nodes.length === 0 ? (
            <div className="btEmpty">empty — insert nodes to visualize</div>
          ) : (
            <svg
              width={Math.max(svgWidth, 200)}
              height={Math.max(svgHeight, 100)}
              style={{ overflow: 'visible', display: 'block' }}
            >
              {/* Edges */}
              {displayStep.nodes.map(node => {
                const p = layout[node.id]
                if (!p) return null
                return [node.left, node.right].filter(Boolean).map(childId => {
                  const c = layout[childId!]
                  if (!c) return null
                  return (
                    <line
                      key={`${node.id}-${childId}`}
                      x1={p.x} y1={p.y}
                      x2={c.x} y2={c.y}
                      stroke="var(--color-purple-border)"
                      strokeWidth={1.5}
                      style={{ transition: 'all 0.35s ease' }}
                    />
                  )
                })
              })}

              {/* Nodes */}
              {displayStep.nodes.map(node => {
                const p = layout[node.id]
                if (!p) return null
                const s = STATE_STYLES[node.state]
                const isAnimated = node.state === 'inserting' || node.state === 'deleting'
                return (
                  <g
                    key={node.id}
                    style={{
                      transform: `translate(${p.x}px, ${p.y}px)`,
                      transition: 'transform 0.35s ease',
                    }}
                  >
                    <circle
                      r={NODE_R}
                      fill={s.fill}
                      stroke={s.stroke}
                      strokeWidth={node.state !== 'idle' ? 2.5 : 1.5}
                      style={{
                        transition: 'all 0.3s',
                        transform: isAnimated ? 'scale(1.15)' : 'scale(1)',
                        transformOrigin: 'center',
                      }}
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={node.value > 99 ? 10 : 13}
                      fontFamily="monospace"
                      fontWeight="600"
                      fill={s.text}
                      style={{ userSelect: 'none' }}
                    >
                      {node.value}
                    </text>
                    {node.id === displayStep.rootId && (
                      <text
                        y={-NODE_R - 6}
                        textAnchor="middle"
                        fontSize={9}
                        fontFamily="monospace"
                        fontWeight="700"
                        fill="var(--color-purple-text)"
                        letterSpacing="0.05em"
                        style={{ userSelect: 'none' }}
                      >
                        ROOT
                      </text>
                    )}
                  </g>
                )
              })}
            </svg>
          )}
        </div>

        {/* Status */}
        <div className="arrayVisNarration">
          <span className="arrayVisNarrationText">
            {displayStep.message}
            {displayStep.subMessage ? ` — ${displayStep.subMessage}` : ''}
          </span>
        </div>

        {/* Primary controls */}
        <div className="arrayVisControls">
          <input
            className="arrayVisInput arrayVisInputSmall"
            type="number"
            placeholder="value"
            value={inputVal}
            disabled={d}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && runOp('insert')}
          />
          <button className="arrayVisActionBtn arrayVisActionBtnAdd" onClick={() => runOp('insert')} disabled={d}>Insert</button>
          <button className="arrayVisActionBtn arrayVisActionBtnRemove" onClick={() => runOp('delete')} disabled={d}>Delete</button>
          <button className="arrayVisActionBtn arrayVisActionBtnAccess" onClick={() => runOp('search')} disabled={d}>Search</button>
          <button
            className="arrayVisActionBtn"
            style={{ background: 'var(--color-code-bg)', borderColor: 'var(--color-code-border)', color: 'var(--color-text-secondary)' }}
            onClick={reset}
            disabled={d}
          >
            Reset
          </button>
        </div>

        {/* Traversal controls */}
        <div className="arrayVisControls">
          <button className="arrayVisActionBtn arrayVisActionBtnTraverse" onClick={() => runOp('inorder')} disabled={d}>Inorder</button>
          <button className="arrayVisActionBtn arrayVisActionBtnTraverse" onClick={() => runOp('preorder')} disabled={d}>Preorder</button>
          <button className="arrayVisActionBtn arrayVisActionBtnTraverse" onClick={() => runOp('postorder')} disabled={d}>Postorder</button>
          <button className="arrayVisActionBtn arrayVisActionBtnTraverse" onClick={() => runOp('levelOrder')} disabled={d}>Level-order</button>
          <button className="arrayVisActionBtn arrayVisActionBtnTraverse" onClick={() => runOp('dfs')} disabled={d}>DFS</button>
        </div>

        {/* Legend */}
        <div className="btLegend">
          {LEGEND.map(({ label, fill, stroke }) => (
            <div key={label} className="btLegendItem">
              <span className="btLegendDot" style={{ background: fill, borderColor: stroke }} />
              <span className="btLegendLabel">{label}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
