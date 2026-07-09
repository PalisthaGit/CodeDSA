import type { GraphAlgorithmDefinition } from './graph.types'
import { definition as astar } from './graph-algos/astar'
import { definition as bfs } from './graph-algos/bfs'
import { definition as dfs } from './graph-algos/dfs'
import { definition as dijkstras } from './graph-algos/dijkstra'
import { definition as kruskals } from './graph-algos/kruskal'
import { definition as prims } from './graph-algos/prim'

export const graphRegistry: Record<string, GraphAlgorithmDefinition> = {
  [astar.key]: astar,
  [bfs.key]: bfs,
  [dfs.key]: dfs,
  [dijkstras.key]: dijkstras,
  [kruskals.key]: kruskals,
  [prims.key]: prims,
}
