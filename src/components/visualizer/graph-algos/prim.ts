import type {
  GraphAlgorithmDefinition,
  GraphAlgorithmOptions,
  GraphData,
  GraphEdge,
  GraphStep,
  PathfindingStepMetadata,
} from '../graph.types'

function buildStep(
  stepType: GraphStep['stepType'],
  message: string,
  subMessage: string,
  inMST: Set<string>,
  mstEdgeIds: Set<string>,
  frontierEdges: GraphEdge[],
  highlightEdge: GraphEdge | null,
  highlightNodeId: string | null,
  isMajorStep = false,
): GraphStep {
  const nodeStates: GraphStep['nodeStates'] = {}
  const edgeStates: GraphStep['edgeStates'] = {}

  for (const id of inMST) nodeStates[id] = 'visited'
  for (const id of mstEdgeIds) edgeStates[id] = 'tree'

  for (const e of frontierEdges) {
    const nonMSTNode = inMST.has(e.from) ? e.to : e.from
    if (!highlightEdge || e.id !== highlightEdge.id) edgeStates[e.id] ??= 'candidate'
    nodeStates[nonMSTNode] ??= 'candidate'
  }

  if (highlightEdge) edgeStates[highlightEdge.id] = 'exploring'
  if (highlightNodeId) nodeStates[highlightNodeId] = 'current'

  const metadata: PathfindingStepMetadata = { distances: {}, previous: {}, path: [], frontier: [], visitedOrder: [] }
  return { stepType, message, subMessage, isMajorStep, nodeStates, edgeStates, metadata }
}

function prim(graphData: GraphData, options?: GraphAlgorithmOptions): GraphStep[] {
  const steps: GraphStep[] = []
  if (graphData.nodes.length === 0) return steps

  const startId = options?.startNodeId ?? graphData.nodes[0].id
  const inMST = new Set<string>([startId])
  const mstEdgeIds = new Set<string>()
  let totalWeight = 0

  steps.push(buildStep(
    'initial',
    `Node ${startId} is the seed — MST starts here`,
    'We grow the tree by always picking the cheapest edge that reaches a new node',
    new Set([startId]),
    new Set(),
    [],
    null,
    startId,
    true,
  ))

  while (inMST.size < graphData.nodes.length) {
    const frontier = graphData.edges.filter(e => {
      const fromIn = inMST.has(e.from)
      const toIn = inMST.has(e.to)
      return (fromIn && !toIn) || (!fromIn && toIn)
    })

    if (frontier.length === 0) {
      steps.push(buildStep(
        'complete',
        'Graph is disconnected — no spanning tree exists',
        'Some nodes cannot be reached from the start node',
        inMST,
        mstEdgeIds,
        [],
        null,
        null,
        true,
      ))
      return steps
    }

    const minEdge = frontier.reduce((min, e) => e.weight < min.weight ? e : min)
    const newNode = inMST.has(minEdge.from) ? minEdge.to : minEdge.from

    steps.push(buildStep(
      'explore',
      `${frontier.length} edge${frontier.length !== 1 ? 's' : ''} cross the cut — cheapest is ${minEdge.from}→${minEdge.to} (weight ${minEdge.weight})`,
      'Purple = frontier edges · yellow = the minimum-weight edge about to be added',
      inMST,
      mstEdgeIds,
      frontier,
      minEdge,
      newNode,
    ))

    inMST.add(newNode)
    mstEdgeIds.add(minEdge.id)
    totalWeight += minEdge.weight

    steps.push(buildStep(
      'visit',
      `Node ${newNode} joins the MST via ${minEdge.from}→${minEdge.to} (weight ${minEdge.weight})`,
      `MST nodes: {${[...inMST].join(', ')}} · total weight so far: ${totalWeight}`,
      inMST,
      mstEdgeIds,
      [],
      null,
      newNode,
      true,
    ))
  }

  steps.push(buildStep(
    'complete',
    `MST complete! ${mstEdgeIds.size} edges, total weight ${totalWeight}`,
    `All ${graphData.nodes.length} nodes connected with minimum total cost`,
    inMST,
    mstEdgeIds,
    [],
    null,
    null,
    true,
  ))

  return steps
}

export const definition: GraphAlgorithmDefinition = {
  key: 'prims',
  name: "Prim's Algorithm",
  category: 'spanning-tree',
  func: prim,
}
