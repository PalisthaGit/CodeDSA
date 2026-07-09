import type { GraphAlgorithmDefinition } from './graph.types'
import { definition as astar } from './graph-algos/astar'
import { definition as bfs } from './graph-algos/bfs'
import { definition as dfs } from './graph-algos/dfs'
import { definition as prims } from './graph-algos/prim'

export const graphRegistry: Record<string, GraphAlgorithmDefinition> = {
  [astar.key]: astar,
  [bfs.key]: bfs,
  [dfs.key]: dfs,
  [prims.key]: prims,
}
