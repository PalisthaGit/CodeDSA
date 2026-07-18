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
  skipId: string | null = null,
): GraphStep {
  const nodeStates: GraphStep['nodeStates'] = {}
  const edgeStates: GraphStep['edgeStates'] = {}

  for (const id of visited) nodeStates[id] = 'visited'
  for (const id of queue) nodeStates[id] ??= 'candidate'
  if (currentId) nodeStates[currentId] = 'current'
  if (skipId) nodeStates[skipId] = 'skip'
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

  const visited = new Set<string>([startId])
  const previous: Record<string, string | null> = { [startId]: null }
  const queue: string[] = []
  const visitedOrder: string[] = [startId]

  const adj: Record<string, { to: string; edgeId: string }[]> = {}
  for (const n of nodes) adj[n.id] = []
  for (const e of edges) {
    adj[e.from].push({ to: e.to, edgeId: e.id })
    adj[e.to].push({ to: e.from, edgeId: e.id })
  }

  // Visit start node directly — no queue
  steps.push(buildStep(
    'initial',
    `Visit node ${startId} — visited!`,
    `Visited: [${visitedOrder.join(', ')}] | Queue: [empty]`,
    startId, visited, queue, previous, visitedOrder, [], new Set(), graphData, true,
  ))

  let currentId: string | null = startId
  let fromQueue = false

  while (currentId !== null) {
    if (fromQueue) {
      steps.push(buildStep(
        'visit',
        `From queue → now exploring node ${currentId} — visiting its adjacent nodes`,
        `Queue: [${queue.join(', ') || 'empty'}]`,
        currentId, visited, queue, previous, visitedOrder, [], new Set(), graphData, true,
      ))
    }

    let addedAny = false
    for (const { to } of adj[currentId]) {
      if (visited.has(to)) {
        steps.push(buildStep(
          'explore',
          `Node ${to} is already visited — skip!`,
          `Visited: [${visitedOrder.join(', ')}] | Queue: [${queue.join(', ') || 'empty'}]`,
          currentId, visited, queue, previous, visitedOrder, [], new Set(), graphData, false, to,
        ))
        continue
      }

      visited.add(to)
      visitedOrder.push(to)
      previous[to] = currentId
      queue.push(to)
      addedAny = true

      steps.push(buildStep(
        'explore',
        `Visit ${to} — visited! Keep it in queue`,
        `Visited: [${visitedOrder.join(', ')}] | Queue: [${queue.join(', ')}]`,
        currentId, visited, queue, previous, visitedOrder, [], new Set(), graphData, false, null,
      ))
    }

    if (addedAny || queue.length > 0) {
      steps.push(buildStep(
        'visit',
        `All adjacent of ${currentId} checked — now let's visit from the queue`,
        `Queue: [${queue.join(', ') || 'empty'}]`,
        null, visited, queue, previous, visitedOrder, [], new Set(), graphData, true,
      ))
    }

    currentId = queue.length > 0 ? queue.shift()! : null
    fromQueue = true
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
