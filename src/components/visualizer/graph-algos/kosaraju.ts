import type {
  GraphAlgorithmDefinition,
  GraphData,
  GraphStep,
  PathfindingStepMetadata,
} from '../graph.types'

function buildStep(
  stepType: GraphStep['stepType'],
  message: string,
  subMessage: string,
  activeNodeId: string | null,
  finishStack: string[],
  disc: Record<string, number>,
  finishT: Record<string, number>,
  sccNodes: string[],
  graph: GraphData,
  isMajorStep = false,
): GraphStep {
  const nodeStates: GraphStep['nodeStates'] = {}
  const edgeStates: GraphStep['edgeStates'] = {}

  // Confirmed SCC members — green
  for (const id of sccNodes) nodeStates[id] = 'path'
  // Nodes in finish stack waiting for pass 2 — purple
  for (const id of finishStack) nodeStates[id] ??= 'candidate'
  // All other discovered nodes — blue
  for (const id of Object.keys(disc)) nodeStates[id] ??= 'visited'
  // Currently active node — yellow
  if (activeNodeId) nodeStates[activeNodeId] = 'current'

  for (const edge of graph.edges) {
    const f = nodeStates[edge.from]
    const t = nodeStates[edge.to]
    if (f === 'path' && t === 'path') edgeStates[edge.id] = 'tree'
    else if (f !== undefined && t !== undefined) edgeStates[edge.id] = 'exploring'
  }

  const metadata: PathfindingStepMetadata = {
    distances: { ...disc },
    previous: Object.fromEntries(
      Object.keys(finishT).map(k => [k, String(finishT[k])]),
    ) as Record<string, string | null>,
    path: [...sccNodes],
    frontier: [...finishStack],
  }

  return { stepType, message, subMessage, isMajorStep, nodeStates, edgeStates, metadata }
}

function kosaraju(graphData: GraphData): GraphStep[] {
  const steps: GraphStep[] = []
  const { nodes, edges } = graphData
  if (nodes.length === 0) return steps

  const nodeIds = nodes.map(n => n.id)

  // Directed adjacency: edges run one way only (from → to)
  const adj: Record<string, string[]> = {}
  const radj: Record<string, string[]> = {}
  for (const id of nodeIds) { adj[id] = []; radj[id] = [] }
  for (const e of edges) {
    adj[e.from].push(e.to)
    radj[e.to].push(e.from)
  }

  steps.push(
    buildStep(
      'initial',
      "Kosaraju's Algorithm — finding Strongly Connected Components (SCCs)",
      'Two-pass DFS. Pass 1: DFS on the original graph, push nodes onto a stack in finish order. Pass 2: DFS in reverse finish order on the transposed graph — each DFS tree is exactly one SCC.',
      null, [], {}, {}, [], graphData, true,
    ),
  )

  // ── Pass 1: DFS on original graph, record finish order ───────────────────
  const visited1 = new Set<string>()
  const finishOrder: string[] = []
  const disc: Record<string, number> = {}
  const finishT: Record<string, number> = {}
  let timer = 0

  steps.push(
    buildStep(
      'visit',
      'Pass 1: DFS on original graph to compute finish order',
      'Nodes are pushed onto the finish stack once all their descendants are processed — this encodes a reverse-topological order.',
      null, [], disc, finishT, [], graphData, true,
    ),
  )

  const dfs1 = (nodeId: string) => {
    visited1.add(nodeId)
    disc[nodeId] = timer++

    steps.push(
      buildStep(
        'visit',
        `Visiting ${nodeId} (discovery time: ${disc[nodeId]})`,
        `Active nodes: ${Object.keys(disc).length - Object.keys(finishT).length}. Finish stack so far: [${finishOrder.join(' → ')}]`,
        nodeId, [...finishOrder], disc, finishT, [], graphData,
      ),
    )

    for (const nb of adj[nodeId]) {
      if (!visited1.has(nb)) {
        steps.push(
          buildStep(
            'explore',
            `${nodeId} → ${nb}: following directed edge (${nb} unvisited)`,
            `Will return to finish ${nodeId} after ${nb}'s subtree is fully explored.`,
            nodeId, [...finishOrder], disc, finishT, [], graphData,
          ),
        )
        dfs1(nb)
      }
    }

    finishT[nodeId] = timer++
    finishOrder.push(nodeId)

    steps.push(
      buildStep(
        'explore',
        `Finished ${nodeId} (finish time: ${finishT[nodeId]}) — pushed to stack`,
        `All descendants of ${nodeId} are done. Finish stack: [${finishOrder.join(' → ')}]`,
        nodeId, [...finishOrder], disc, finishT, [], graphData,
      ),
    )
  }

  for (const id of nodeIds) {
    if (!visited1.has(id)) dfs1(id)
  }

  steps.push(
    buildStep(
      'explore',
      `Pass 1 complete — finish stack: [${finishOrder.join(' → ')}]`,
      'The rightmost node finished last (highest finish time). Pass 2 processes them in reverse — the node most likely to be an SCC root comes first.',
      null, [...finishOrder], disc, finishT, [], graphData, true,
    ),
  )

  // ── Pass 2: DFS on transposed graph in reverse finish order ──────────────
  const visited2 = new Set<string>()
  const allSCCNodes: string[] = []
  const components: string[][] = []

  for (const startId of [...finishOrder].reverse()) {
    if (visited2.has(startId)) continue

    const component: string[] = []
    const sccNum = components.length + 1

    steps.push(
      buildStep(
        'path',
        `Pass 2: DFS from ${startId} on transposed graph — building SCC ${sccNum}`,
        "On the transposed graph, a DFS from this node reaches exactly the nodes that could also reach it in the original — that's an SCC.",
        startId, [...finishOrder], disc, finishT, [...allSCCNodes], graphData, true,
      ),
    )

    const dfs2 = (nodeId: string) => {
      visited2.add(nodeId)
      component.push(nodeId)

      steps.push(
        buildStep(
          'path',
          `Added ${nodeId} to SCC ${sccNum}`,
          `SCC ${sccNum} so far: {${component.join(', ')}} — following reversed edges.`,
          nodeId, [...finishOrder], disc, finishT,
          [...allSCCNodes, ...component], graphData,
        ),
      )

      for (const nb of radj[nodeId]) {
        if (!visited2.has(nb)) dfs2(nb)
      }
    }

    dfs2(startId)
    allSCCNodes.push(...component)
    components.push([...component])

    steps.push(
      buildStep(
        'path',
        `SCC ${sccNum} complete: {${component.join(', ')}}`,
        `${sccNum} SCC${sccNum !== 1 ? 's' : ''} found so far. Each is a maximal group of mutually reachable nodes.`,
        null, [...finishOrder], disc, finishT, [...allSCCNodes], graphData, true,
      ),
    )
  }

  const summary = components.map((c, i) => `SCC ${i + 1}: {${c.join(', ')}}`).join(' | ')

  steps.push(
    buildStep(
      'complete',
      `Kosaraju's complete — ${components.length} strongly connected component${components.length !== 1 ? 's' : ''} found`,
      `Two DFS passes, O(V+E). ${summary}. Compare with Tarjan's single-pass approach — same result, different strategy.`,
      null, [], disc, finishT, [...allSCCNodes], graphData, true,
    ),
  )

  return steps
}

export const definition: GraphAlgorithmDefinition = {
  key: 'kosarajus',
  name: "Kosaraju's Algorithm",
  category: 'traversal',
  func: kosaraju,
}
