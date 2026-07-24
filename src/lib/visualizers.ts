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
    title: 'Data structures',
    items: [
      { id: 'array', title: 'Array', category: 'Data structures', articleSlug: 'arrays' },
      { id: 'stack', title: 'Stack', category: 'Data structures', articleSlug: 'stack' },
      { id: 'queue', title: 'Queue', category: 'Data structures', articleSlug: 'queue' },
      { id: 'circular-queue', title: 'Circular Queue', category: 'Data structures', articleSlug: 'queue' },
      { id: 'deque', title: 'Deque', category: 'Data structures', articleSlug: 'queue' },
      { id: 'binary-tree', title: 'Binary Tree', category: 'Data structures', articleSlug: 'binary-tree' },
      { id: 'hash-table', title: 'Hash Table', category: 'Data structures', articleSlug: 'hash-table' },
    ],
  },
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
    title: 'Searching',
    items: [
      { id: 'linear-search', title: 'Linear search', category: 'Searching', articleSlug: 'linear-search' },
      { id: 'binary-search', title: 'Binary search', category: 'Searching', articleSlug: 'binary-search' },
    ],
  },
  {
    title: 'String matching',
    items: [
      { id: 'kmp', title: 'KMP', category: 'String matching', articleSlug: 'kmp' },
      { id: 'rabin-karp', title: 'Rabin-Karp', category: 'String matching', articleSlug: 'rabin-karp' },
      { id: 'boyer-moore', title: 'Boyer-Moore', category: 'String matching', articleSlug: 'boyer-moore' },
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

export function findVisualizerByArticle(articleSlug: string): Visualizer | undefined {
  for (const cat of visualizerCategories) {
    const item = cat.items.find(v => v.articleSlug === articleSlug)
    if (item) return item
  }
  return undefined
}
