import type { GraphAlgorithmDefinition } from './graph.types'
import { definition as astar } from './graph-algos/astar'
import { definition as bfs } from './graph-algos/bfs'
import { definition as prims } from './graph-algos/prim'

export const graphRegistry: Record<string, GraphAlgorithmDefinition> = {
  [astar.key]: astar,
  [bfs.key]: bfs,
  [prims.key]: prims,
}
