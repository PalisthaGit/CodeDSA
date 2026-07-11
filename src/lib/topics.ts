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
      { title: 'What is Time Complexity?', slug: 'time-complexity', readTime: '8 min', hasVisualizer: false, comingSoon: false },
      { title: 'Asymptotic Notation: Big O, Omega, and Theta', slug: 'asymptotic-notation', readTime: '10 min', hasVisualizer: false, comingSoon: false },
      { title: 'Frequency Count Method', slug: 'frequency-count', readTime: '7 min', hasVisualizer: false, comingSoon: false },
      { title: 'How to think like a programmer', slug: 'think-like-programmer', readTime: '6 min', hasVisualizer: false, comingSoon: true },
    ],
  },
  {
    id: 'data-structures',
    title: 'Data structures',
    color: 'blue',
    topics: [
      { title: 'Array', slug: 'arrays', readTime: '10 min', hasVisualizer: true, comingSoon: false },
      { title: 'Linked Lists', slug: 'linked-lists', readTime: '8 min', hasVisualizer: true, comingSoon: false },
      { title: 'Stacks', slug: 'stack', readTime: '7 min', hasVisualizer: true, comingSoon: false },
      { title: 'Queues', slug: 'queue', readTime: '7 min', hasVisualizer: true, comingSoon: false },
      { title: 'Hash Maps', slug: 'hash-maps', readTime: '9 min', hasVisualizer: true, comingSoon: true },
      { title: 'Trees', slug: 'trees', readTime: '10 min', hasVisualizer: false, comingSoon: true },
      { title: 'Binary Search Trees', slug: 'binary-search-trees', readTime: '10 min', hasVisualizer: false, comingSoon: true },
      { title: 'Heaps', slug: 'heaps', readTime: '9 min', hasVisualizer: false, comingSoon: true },
    ],
  },
  {
    id: 'sorting',
    title: 'Sorting',
    color: 'pink',
    topics: [
      { title: 'Bubble Sort', slug: 'bubble-sort', readTime: '6 min', hasVisualizer: true, comingSoon: true },
      { title: 'Selection Sort', slug: 'selection-sort', readTime: '6 min', hasVisualizer: true, comingSoon: true },
      { title: 'Insertion Sort', slug: 'insertion-sort', readTime: '6 min', hasVisualizer: false, comingSoon: true },
      { title: 'Merge Sort', slug: 'merge-sort', readTime: '8 min', hasVisualizer: true, comingSoon: true },
      { title: 'Quick Sort', slug: 'quick-sort', readTime: '9 min', hasVisualizer: true, comingSoon: true },
      { title: 'Heap Sort', slug: 'heap-sort', readTime: '8 min', hasVisualizer: false, comingSoon: true },
    ],
  },
  {
    id: 'searching-and-graphs',
    title: 'Searching and graphs',
    color: 'blue',
    topics: [
      { title: 'Linear Search', slug: 'linear-search', readTime: '5 min', hasVisualizer: true, comingSoon: false },
      { title: 'Binary Search', slug: 'binary-search', readTime: '6 min', hasVisualizer: true, comingSoon: false },
      { title: 'What is a graph?', slug: 'what-is-a-graph', readTime: '6 min', hasVisualizer: false, comingSoon: true },
      { title: 'BFS', slug: 'bfs', readTime: '10 min', hasVisualizer: true, comingSoon: true },
      { title: 'DFS', slug: 'dfs', readTime: '10 min', hasVisualizer: true, comingSoon: true },
      { title: "Dijkstra's", slug: 'dijkstras', readTime: '12 min', hasVisualizer: true, comingSoon: true },
      { title: 'Bellman-Ford', slug: 'bellman-ford', readTime: '10 min', hasVisualizer: false, comingSoon: true },
      { title: 'Topological Sort', slug: 'topological-sort', readTime: '8 min', hasVisualizer: false, comingSoon: true },
    ],
  },
  {
    id: 'advanced',
    title: 'Advanced',
    color: 'pink',
    topics: [
      { title: "Kruskal's", slug: 'kruskals', readTime: '10 min', hasVisualizer: true, comingSoon: true },
      { title: "Prim's", slug: 'prims', readTime: '10 min', hasVisualizer: true, comingSoon: true },
      { title: "Tarjan's", slug: 'tarjans', readTime: '14 min', hasVisualizer: true, comingSoon: true },
      { title: "Kosaraju's", slug: 'kosarajus', readTime: '12 min', hasVisualizer: true, comingSoon: true },
      { title: 'KMP', slug: 'kmp', readTime: '12 min', hasVisualizer: true, comingSoon: true },
      { title: 'Rabin-Karp', slug: 'rabin-karp', readTime: '10 min', hasVisualizer: true, comingSoon: true },
      { title: 'Dynamic programming', slug: 'dynamic-programming', readTime: 'coming soon', hasVisualizer: false, comingSoon: true },
    ],
  },
]
