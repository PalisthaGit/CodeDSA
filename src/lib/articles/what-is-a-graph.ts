import fs from 'fs'
import path from 'path'
import type { Article } from '../articles'
import { applyCodeHighlighting } from '../highlightCode'

const content = applyCodeHighlighting(
  fs.readFileSync(
    path.join(process.cwd(), 'src/lib/articles/content/what-is-a-graph.html'),
    'utf-8'
  )
)

export const whatIsAGraphArticle: Article = {
  slug: 'what-is-a-graph',
  title: 'What is a Graph?',
  chapter: 'Searching and graphs',
  chapterSlug: 'searching-and-graphs',
  tagline: 'Graphs are just dots and lines. Once you see that, everything else is just details.',
  readTime: '10 min',

  headings: [
    { id: 'directed-vs-undirected', text: 'Directed vs Undirected' },
    { id: 'self-loop', text: 'Self Loop' },
    { id: 'parallel-edges', text: 'Parallel Edges' },
    { id: 'degree-indegree-outdegree', text: 'Degree, Indegree, and Outdegree' },
    { id: 'path', text: 'Path' },
    { id: 'connected-vs-non-connected', text: 'Connected vs Non-Connected' },
    { id: 'strongly-connected', text: 'Strongly Connected' },
    { id: 'directed-acyclic-graph', text: 'Directed Acyclic Graph (DAG)' },
    { id: 'topological-ordering', text: 'Topological Ordering' },
    { id: 'real-life-examples', text: 'Real Life Examples' },
    { id: 'quick-reference', text: 'Quick Reference Table' },
    { id: 'quick-quiz', text: 'Quick Quiz' },
  ],

  content,

  prevSlug: 'binary-search',
  prevTitle: 'Binary Search',

  nextSlug: 'bfs',
  nextTitle: 'Breadth First Search (BFS)',
}
