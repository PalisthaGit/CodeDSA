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
  stack: string[],
  disc: Record<string, number>,
  low: Record<string, number>,
  currentSCC: string[],
  graph: GraphData,
  isMajorStep = false,
): GraphStep {
  const nodeStates: GraphStep['nodeStates'] = {}
  const edgeStates: GraphStep['edgeStates'] = {}

  for (const id of Object.keys(disc)) nodeStates[id] = 'visited'
  for (const id of stack) nodeStates[id] = 'candidate'
  if (activeNodeId) nodeStates[activeNodeId] = 'current'

  for (const edge of graph.edges) {
    if (disc[edge.from] !== undefined && disc[edge.to] !== undefined) {
      const bothOnStack = stack.includes(edge.from) && stack.includes(edge.to)
      edgeStates[edge.id] = bothOnStack ? 'candidate' : 'tree'
    }
  }

  const metadata: PathfindingStepMetadata = {
    distances: { ...low },
    previous: Object.fromEntries(
      Object.keys(disc).map(k => [k, String(disc[k])]),
    ) as Record<string, string | null>,
    path: [...currentSCC],
    frontier: [...stack], visitedOrder: [],
  }

  return { stepType, message, subMessage, isMajorStep, nodeStates, edgeStates, metadata }
}

function tarjan(graphData: GraphData): GraphStep[] {
  const steps: GraphStep[] = []
  const { nodes, edges } = graphData
  if (nodes.length === 0) return steps

  // Bidirectional adjacency so the undirected default graph has real cycles to find
  const adj: Record<string, string[]> = {}
  for (const n of nodes) adj[n.id] = []
  for (const e of edges) {
    adj[e.from].push(e.to)
    adj[e.to].push(e.from)
  }

  const disc: Record<string, number> = {}
  const low: Record<string, number> = {}
  const onStack: Record<string, boolean> = {}
  const stack: string[] = []
  const allSCCNodes: string[] = []
  let timer = 0

  steps.push(
    buildStep(
      'initial',
      "Tarjan's Algorithm — finding Strongly Connected Components (SCCs)",
      'An SCC is a group of nodes where every node can reach every other node. We stamp each node with a visit order and a "low-link" — the earliest stamp reachable from here.',
      null,
      [],
      disc,
      low,
      [],
      graphData,
      true,
    ),
  )

  const dfs = (nodeId: string) => {
    disc[nodeId] = low[nodeId] = timer++
    stack.push(nodeId)
    onStack[nodeId] = true

    steps.push(
      buildStep(
        'visit',
        `Visiting ${nodeId} — stamp #${disc[nodeId]}, low-link = ${low[nodeId]}`,
        `Stamp = visit order. Low-link = earliest stamp reachable from this node's subtree. Stack: [${stack.join(' → ')}]`,
        nodeId,
        [...stack],
        disc,
        low,
        [],
        graphData,
        true,
      ),
    )

    for (const neighbour of adj[nodeId]) {
      if (disc[neighbour] === undefined) {
        steps.push(
          buildStep(
            'explore',
            `${nodeId} → ${neighbour}: diving deeper (${neighbour} not yet visited)`,
            `We'll come back and update low[${nodeId}] once we know how far back ${neighbour}'s subtree can reach.`,
            nodeId,
            [...stack],
            disc,
            low,
            [],
            graphData,
          ),
        )

        dfs(neighbour)

        const prevLow = low[nodeId]
        low[nodeId] = Math.min(low[nodeId], low[neighbour])

        steps.push(
          buildStep(
            'explore',
            `Back from ${neighbour} — low[${nodeId}] = min(${prevLow}, low[${neighbour}]=${low[neighbour]}) = ${low[nodeId]}`,
            `A smaller low-link means we can reach further back. If low[${nodeId}] drops below our stamp, we're in a cycle with an ancestor.`,
            nodeId,
            [...stack],
            disc,
            low,
            [],
            graphData,
          ),
        )
      } else if (onStack[neighbour]) {
        const prevLow = low[nodeId]
        low[nodeId] = Math.min(low[nodeId], disc[neighbour])

        steps.push(
          buildStep(
            'explore',
            `Back edge! ${nodeId} → ${neighbour} (stamp #${disc[neighbour]}) — cycle detected`,
            `${neighbour} is still on the stack above us. low[${nodeId}] = min(${prevLow}, stamp[${neighbour}]=${disc[neighbour]}) = ${low[nodeId]}. We can reach an ancestor!`,
            nodeId,
            [...stack],
            disc,
            low,
            [],
            graphData,
          ),
        )
      }
    }

    // SCC root: low[v] === disc[v] means no back edge escapes this subtree upward
    if (low[nodeId] === disc[nodeId]) {
      steps.push(
        buildStep(
          'explore',
          `${nodeId} is an SCC root! low[${nodeId}] = stamp[${nodeId}] = ${disc[nodeId]}`,
          `No back edge from here reaches any earlier node. Everything on the stack back to ${nodeId} forms one complete SCC — pop them all!`,
          nodeId,
          [...stack],
          disc,
          low,
          [],
          graphData,
          true,
        ),
      )

      const component: string[] = []
      while (true) {
        const top = stack.pop()!
        onStack[top] = false
        component.push(top)
        if (top === nodeId) break
      }

      allSCCNodes.push(...component)

      steps.push(
        buildStep(
          'path',
          `SCC found: {${component.join(', ')}}`,
          `${component.length} node${component.length !== 1 ? 's' : ''} that can all reach each other. They're now highlighted in green.`,
          null,
          [...stack],
          disc,
          low,
          [...component],
          graphData,
          true,
        ),
      )
    }
  }

  for (const id of nodes.map(n => n.id)) {
    if (disc[id] === undefined) dfs(id)
  }

  steps.push(
    buildStep(
      'complete',
      "Tarjan's complete — all Strongly Connected Components found!",
      'Every green node is part of one SCC. Purple nodes were on the stack (potential SCC members). One DFS pass — that\'s the beauty of Tarjan\'s.',
      null,
      [],
      disc,
      low,
      [...allSCCNodes],
      graphData,
      true,
    ),
  )

  return steps
}

export const definition: GraphAlgorithmDefinition = {
  key: 'tarjans',
  name: "Tarjan's Algorithm",
  category: 'traversal',
  func: tarjan,
}
