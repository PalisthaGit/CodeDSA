import type { GraphAlgorithmDefinition, GraphData, GraphStep } from '../graph.types'

class UnionFind {
  private parent: Record<string, string> = {}
  private rank: Record<string, number> = {}

  constructor(ids: string[]) {
    for (const id of ids) { this.parent[id] = id; this.rank[id] = 0 }
  }

  find(x: string): string {
    if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x])
    return this.parent[x]
  }

  union(x: string, y: string) {
    const rx = this.find(x), ry = this.find(y)
    if (rx === ry) return
    if (this.rank[rx] < this.rank[ry]) { this.parent[rx] = ry }
    else if (this.rank[rx] > this.rank[ry]) { this.parent[ry] = rx }
    else { this.parent[ry] = rx; this.rank[rx]++ }
  }
}

function buildStep(
  stepType: GraphStep['stepType'],
  message: string,
  subMessage: string,
  mstEdgeIds: Set<string>,
  rejectedEdgeIds: Set<string>,
  currentEdgeId: string | null,
  mstNodeIds: Set<string>,
  currentNodeIds: string[],
  isMajorStep = false,
): GraphStep {
  const nodeStates: GraphStep['nodeStates'] = {}
  const edgeStates: GraphStep['edgeStates'] = {}

  for (const id of mstNodeIds) nodeStates[id] = 'visited'
  for (const id of currentNodeIds) nodeStates[id] = 'current'
  for (const id of mstEdgeIds) edgeStates[id] = 'tree'
  for (const id of rejectedEdgeIds) edgeStates[id] = 'candidate'
  if (currentEdgeId) edgeStates[currentEdgeId] = 'exploring'

  return {
    stepType,
    message,
    subMessage,
    isMajorStep,
    nodeStates,
    edgeStates,
    metadata: { distances: {}, previous: {}, path: [], frontier: [] },
  }
}

function kruskal(graphData: GraphData): GraphStep[] {
  const steps: GraphStep[] = []
  const sorted = [...graphData.edges].sort((a, b) => a.weight - b.weight)
  const mstEdgeIds = new Set<string>()
  const rejectedEdgeIds = new Set<string>()
  const mstNodeIds = new Set<string>()
  const uf = new UnionFind(graphData.nodes.map(n => n.id))
  let totalWeight = 0

  steps.push(buildStep(
    'initial',
    'Edges sorted by weight — lightest to heaviest',
    'Greedily pick the smallest edge that does not create a cycle',
    mstEdgeIds,
    rejectedEdgeIds,
    null,
    mstNodeIds,
    [],
    true,
  ))

  for (const edge of sorted) {
    steps.push(buildStep(
      'explore',
      `Checking edge ${edge.from}–${edge.to} (weight ${edge.weight})`,
      'Will adding this edge create a cycle?',
      mstEdgeIds,
      rejectedEdgeIds,
      edge.id,
      mstNodeIds,
      [edge.from, edge.to],
    ))

    const willCycle = uf.find(edge.from) === uf.find(edge.to)

    if (!willCycle) {
      uf.union(edge.from, edge.to)
      mstEdgeIds.add(edge.id)
      mstNodeIds.add(edge.from)
      mstNodeIds.add(edge.to)
      totalWeight += edge.weight

      steps.push(buildStep(
        'visit',
        `Added ${edge.from}–${edge.to} — no cycle created`,
        `MST weight so far: ${totalWeight} · ${mstEdgeIds.size} edge${mstEdgeIds.size !== 1 ? 's' : ''} accepted`,
        mstEdgeIds,
        rejectedEdgeIds,
        null,
        mstNodeIds,
        [edge.from, edge.to],
        true,
      ))
    } else {
      rejectedEdgeIds.add(edge.id)

      steps.push(buildStep(
        'visit',
        `Rejected ${edge.from}–${edge.to} — would create a cycle`,
        `${rejectedEdgeIds.size} edge${rejectedEdgeIds.size !== 1 ? 's' : ''} rejected so far`,
        mstEdgeIds,
        rejectedEdgeIds,
        null,
        mstNodeIds,
        [],
        true,
      ))
    }
  }

  steps.push(buildStep(
    'complete',
    `MST complete — ${mstEdgeIds.size} edges, total weight ${totalWeight}`,
    `${rejectedEdgeIds.size} edge${rejectedEdgeIds.size !== 1 ? 's' : ''} rejected · all ${graphData.nodes.length} nodes connected`,
    mstEdgeIds,
    rejectedEdgeIds,
    null,
    mstNodeIds,
    [],
    true,
  ))

  return steps
}

export const definition: GraphAlgorithmDefinition = {
  key: 'kruskals',
  name: "Kruskal's Algorithm",
  category: 'spanning-tree',
  func: kruskal,
}
