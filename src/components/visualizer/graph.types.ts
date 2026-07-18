export type GraphNode = { id: string; x: number; y: number }
export type GraphEdge = { id: string; from: string; to: string; weight: number }
export type GraphData = { nodes: GraphNode[]; edges: GraphEdge[] }

export type NodeState = 'visited' | 'current' | 'candidate' | 'path' | 'skip'
export type EdgeState = 'tree' | 'exploring' | 'candidate'
export type StepType = 'initial' | 'visit' | 'explore' | 'path' | 'complete'

export type PathfindingStepMetadata = {
  distances: Record<string, number>
  previous: Record<string, string | null>
  path: string[]
  frontier: string[]
  visitedOrder: string[]
}

export type GraphStep = {
  stepType: StepType
  message: string
  subMessage: string
  isMajorStep: boolean
  nodeStates: Record<string, NodeState>
  edgeStates: Record<string, EdgeState>
  metadata: PathfindingStepMetadata
}

export type GraphAlgorithmOptions = {
  startNodeId?: string
  endNodeId?: string
}

export type GraphAlgorithmDefinition = {
  key: string
  name: string
  category: 'pathfinding' | 'spanning-tree' | 'traversal'
  func: (graphData: GraphData, options?: GraphAlgorithmOptions) => GraphStep[]
  graph?: GraphData
}
