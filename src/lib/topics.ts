export type Topic = {
  title: string
  slug: string
  readTime: string
  hasVisualizer: boolean
  comingSoon: boolean
}

export type Section = {
  id: string
  title: string
  color: 'pink' | 'blue'
  topics: Topic[]
}

export const sections: Section[] = [
  {
    id: 'start-here',
    title: 'Start here',
    color: 'pink',
    topics: [
      { title: 'What is DSA and why does it matter?', slug: 'what-is-dsa', readTime: '5 min', hasVisualizer: false, comingSoon: false },
      { title: 'Why do you even need DSA?', slug: 'why-learn-dsa', readTime: '4 min', hasVisualizer: false, comingSoon: false },
      { title: 'How to think like a programmer', slug: 'think-like-programmer', readTime: '6 min', hasVisualizer: false, comingSoon: false },
      { title: 'Big O notation — how we measure speed', slug: 'big-o-notation', readTime: '8 min', hasVisualizer: false, comingSoon: false },
    ],
  },
  {
    id: 'data-structures',
    title: 'Data structures',
    color: 'blue',
    topics: [
      { title: 'Arrays — your first data structure', slug: 'arrays', readTime: '10 min', hasVisualizer: true, comingSoon: false },
      { title: "Linked lists — when arrays aren't enough", slug: 'linked-lists', readTime: '8 min', hasVisualizer: true, comingSoon: false },
      { title: 'Stacks — last in, first out', slug: 'stacks', readTime: '7 min', hasVisualizer: true, comingSoon: false },
      { title: 'Queues — first in, first out', slug: 'queues', readTime: '7 min', hasVisualizer: true, comingSoon: false },
      { title: 'Hash maps — find anything instantly', slug: 'hash-maps', readTime: '9 min', hasVisualizer: true, comingSoon: false },
      { title: 'Trees — data with branches', slug: 'trees', readTime: '10 min', hasVisualizer: false, comingSoon: true },
      { title: 'Binary search trees', slug: 'binary-search-trees', readTime: '10 min', hasVisualizer: false, comingSoon: true },
      { title: 'Heaps — the priority queue', slug: 'heaps', readTime: '9 min', hasVisualizer: false, comingSoon: true },
    ],
  },
  {
    id: 'sorting',
    title: 'Sorting',
    color: 'pink',
    topics: [
      { title: 'Bubble sort — the slowest, but the clearest', slug: 'bubble-sort', readTime: '6 min', hasVisualizer: true, comingSoon: false },
      { title: 'Selection sort — find the smallest, repeat', slug: 'selection-sort', readTime: '6 min', hasVisualizer: true, comingSoon: false },
      { title: 'Insertion sort — build as you go', slug: 'insertion-sort', readTime: '6 min', hasVisualizer: false, comingSoon: true },
      { title: 'Merge sort — divide and conquer', slug: 'merge-sort', readTime: '8 min', hasVisualizer: true, comingSoon: false },
      { title: 'Quick sort — fast but tricky', slug: 'quick-sort', readTime: '9 min', hasVisualizer: true, comingSoon: false },
      { title: 'Heap sort', slug: 'heap-sort', readTime: '8 min', hasVisualizer: false, comingSoon: true },
    ],
  },
  {
    id: 'searching-and-graphs',
    title: 'Searching and graphs',
    color: 'blue',
    topics: [
      { title: 'Linear search — check everything', slug: 'linear-search', readTime: '5 min', hasVisualizer: true, comingSoon: false },
      { title: 'Binary search — cut it in half', slug: 'binary-search', readTime: '6 min', hasVisualizer: true, comingSoon: false },
      { title: 'What is a graph?', slug: 'what-is-a-graph', readTime: '6 min', hasVisualizer: false, comingSoon: true },
      { title: 'BFS — explore layer by layer', slug: 'bfs', readTime: '10 min', hasVisualizer: true, comingSoon: false },
      { title: 'DFS — dive deep then backtrack', slug: 'dfs', readTime: '10 min', hasVisualizer: true, comingSoon: false },
      { title: "Dijkstra's — shortest path", slug: 'dijkstras', readTime: '12 min', hasVisualizer: true, comingSoon: false },
      { title: 'Bellman-Ford — handles negative weights', slug: 'bellman-ford', readTime: '10 min', hasVisualizer: false, comingSoon: true },
      { title: 'Topological sort', slug: 'topological-sort', readTime: '8 min', hasVisualizer: false, comingSoon: true },
    ],
  },
  {
    id: 'advanced',
    title: 'Advanced',
    color: 'pink',
    topics: [
      { title: "Kruskal's — minimum spanning tree", slug: 'kruskals', readTime: '10 min', hasVisualizer: true, comingSoon: false },
      { title: "Prim's — grow the tree", slug: 'prims', readTime: '10 min', hasVisualizer: true, comingSoon: false },
      { title: "Tarjan's — strongly connected components", slug: 'tarjans', readTime: '14 min', hasVisualizer: true, comingSoon: false },
      { title: "Kosaraju's — another way to find SCCs", slug: 'kosarajus', readTime: '12 min', hasVisualizer: true, comingSoon: false },
      { title: 'KMP — fast string matching', slug: 'kmp', readTime: '12 min', hasVisualizer: true, comingSoon: false },
      { title: 'Rabin-Karp — hash based search', slug: 'rabin-karp', readTime: '10 min', hasVisualizer: true, comingSoon: false },
      { title: 'Dynamic programming', slug: 'dynamic-programming', readTime: 'coming soon', hasVisualizer: false, comingSoon: true },
    ],
  },
]
