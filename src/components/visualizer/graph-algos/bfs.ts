import type {
  GraphAlgorithmDefinition,
  GraphAlgorithmOptions,
  GraphData,
  GraphStep,
  PathfindingStepMetadata,
} from '../graph.types'

function buildStep(
  stepType: GraphStep['stepType'],
  message: string,
  subMessage: string,
  currentId: string | null,
  visited: Set<string>,
  queue: string[],
  previous: Record<string, string | null>,
  visitedOrder: string[],
  path: string[],
  pathEdgeIds: Set<string>,
  graph: GraphData,
  isMajorStep = false,
): GraphStep {
  const nodeStates: GraphStep['nodeStates'] = {}
  const edgeStates: GraphStep['edgeStates'] = {}

  for (const id of visited) nodeStates[id] = 'visited'
  for (const id of queue) nodeStates[id] ??= 'candidate'
  if (currentId) nodeStates[currentId] = 'current'
  for (const id of path) {
    if (nodeStates[id] !== 'current') nodeStates[id] = 'visited'
  }
  for (const edge of graph.edges) {
    if (pathEdgeIds.has(edge.id)) edgeStates[edge.id] = 'tree'
  }

  const metadata: PathfindingStepMetadata = {
    distances: {},
    previous: { ...previous },
    path: [...path],
    frontier: [...queue],
    visitedOrder: [...visitedOrder],
  }

  return { stepType, message, subMessage, isMajorStep, nodeStates, edgeStates, metadata }
}

function bfs(graphData: GraphData, options?: GraphAlgorithmOptions): GraphStep[] {
  const steps: GraphStep[] = []
  const { nodes, edges } = graphData
  if (nodes.length === 0) return steps

  const startId = options?.startNodeId ?? nodes[0].id

  const visited = new Set<string>()
  const previous: Record<string, string | null> = {}
  const queue: string[] = [startId]
  const visitedOrder: string[] = []
  visited.add(startId)
  previous[startId] = null

  const adj: Record<string, { to: string; edgeId: string }[]> = {}
  for (const n of nodes) adj[n.id] = []
  for (const e of edges) {
    adj[e.from].push({ to: e.to, edgeId: e.id })
    adj[e.to].push({ to: e.from, edgeId: e.id })
  }

  steps.push(buildStep(
    'initial',
    `BFS: traversing from ${startId}`,
    'Explores all neighbours at the current depth before moving deeper.',
    null, visited, queue, previous, visitedOrder, [], new Set(), graphData, true,
  ))

  while (queue.length > 0) {
    const currentId = queue.shift()!
    visitedOrder.push(currentId)

    steps.push(buildStep(
      'visit',
      `Dequeued node ${currentId}`,
      `Queue: [${queue.join(', ')}]`,
      currentId, visited, queue, previous, visitedOrder, [], new Set(), graphData, true,
    ))

    for (const { to } of adj[currentId]) {
      if (visited.has(to)) continue

      visited.add(to)
      previous[to] = currentId
      queue.push(to)

      steps.push(buildStep(
        'explore',
        `Discovered ${to} from ${currentId} — added to queue`,
        `Queue: [${queue.join(', ')}]`,
        currentId, visited, queue, previous, visitedOrder, [], new Set(), graphData,
      ))
    }
  }

  steps.push(buildStep(
    'complete',
    `BFS complete — visited: ${visitedOrder.join(' → ')}`,
    '',
    null, visited, [], previous, visitedOrder, [], new Set(), graphData, true,
  ))

  return steps
}

const bfsGraph = {
  nodes: [
    { id: '1', x: 280, y: 55  },
    { id: '2', x: 105, y: 165 },
    { id: '3', x: 280, y: 165 },
    { id: '4', x: 455, y: 165 },
    { id: '5', x: 50,  y: 270 },
    { id: '6', x: 210, y: 270 },
    { id: '7', x: 455, y: 270 },
  ],
  edges: [
    { id: '1-2', from: '1', to: '2', weight: 1 },
    { id: '1-3', from: '1', to: '3', weight: 1 },
    { id: '1-4', from: '1', to: '4', weight: 1 },
    { id: '2-5', from: '2', to: '5', weight: 1 },
    { id: '2-6', from: '2', to: '6', weight: 1 },
    { id: '3-6', from: '3', to: '6', weight: 1 },
    { id: '4-7', from: '4', to: '7', weight: 1 },
  ],
}

export const definition: GraphAlgorithmDefinition = {
  key: 'bfs',
  name: 'Breadth-First Search',
  category: 'traversal',
  func: bfs,
  graph: bfsGraph,
}
