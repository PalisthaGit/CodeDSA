export type Visualizer = {
  id: string
  title: string
  category: string
  articleSlug: string
}

export type VisualizerCategory = {
  title: string
  items: Visualizer[]
}

export const visualizerCategories: VisualizerCategory[] = [
  {
    title: 'Sorting',
    items: [
      { id: 'bubble-sort', title: 'Bubble sort', category: 'Sorting', articleSlug: 'bubble-sort' },
      { id: 'merge-sort', title: 'Merge sort', category: 'Sorting', articleSlug: 'merge-sort' },
      { id: 'quick-sort', title: 'Quick sort', category: 'Sorting', articleSlug: 'quick-sort' },
      { id: 'insertion-sort', title: 'Insertion sort', category: 'Sorting', articleSlug: 'insertion-sort' },
      { id: 'selection-sort', title: 'Selection sort', category: 'Sorting', articleSlug: 'selection-sort' },
    ],
  },
  {
    title: 'Graph algorithms',
    items: [
      { id: 'bfs', title: 'BFS', category: 'Graph algorithms', articleSlug: 'bfs' },
      { id: 'dfs', title: 'DFS', category: 'Graph algorithms', articleSlug: 'dfs' },
      { id: 'dijkstras', title: "Dijkstra's", category: 'Graph algorithms', articleSlug: 'dijkstras' },
      { id: 'astar', title: 'A*', category: 'Graph algorithms', articleSlug: 'astar' },
      { id: 'kruskals', title: "Kruskal's", category: 'Graph algorithms', articleSlug: 'kruskals' },
      { id: 'prims', title: "Prim's", category: 'Graph algorithms', articleSlug: 'prims' },
      { id: 'tarjans', title: "Tarjan's", category: 'Graph algorithms', articleSlug: 'tarjans' },
      { id: 'kosarajus', title: "Kosaraju's", category: 'Graph algorithms', articleSlug: 'kosarajus' },
    ],
  },
  {
    title: 'String matching',
    items: [
      { id: 'kmp', title: 'KMP', category: 'String matching', articleSlug: 'kmp' },
      { id: 'rabin-karp', title: 'Rabin-Karp', category: 'String matching', articleSlug: 'rabin-karp' },
    ],
  },
]

export const DEFAULT_VISUALIZER_ID = 'bubble-sort'

export function findVisualizer(id: string): Visualizer | undefined {
  for (const cat of visualizerCategories) {
    const item = cat.items.find(v => v.id === id)
    if (item) return item
  }
  return undefined
}
