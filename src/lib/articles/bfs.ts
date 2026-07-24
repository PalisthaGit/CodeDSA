import fs from 'fs'
import path from 'path'
import type { Article } from '../articles'
import { applyCodeHighlighting } from '../highlightCode'

const content = applyCodeHighlighting(
  fs.readFileSync(
    path.join(process.cwd(), 'src/lib/articles/content/bfs.html'),
    'utf-8'
  )
)

export const bfsArticle: Article = {
  slug: 'bfs',
  title: 'Breadth First Search (BFS)',
  chapter: 'Searching and graphs',
  chapterSlug: 'searching-and-graphs',
  tagline: 'Visit your neighbors before you go wandering off.',
  readTime: '10 min',

  headings: [
    { id: 'visualizer', text: 'Interactive Visualizer' },
    { id: 'the-one-rule', text: 'The One Rule of BFS' },
    { id: 'lets-trace-it', text: "Let's Trace It" },
    { id: 'the-queue', text: 'How the Queue Works' },
    { id: 'full-dry-run', text: 'Full Dry Run' },
    { id: 'building-bfs-in-code', text: 'Building BFS in Code' },
    { id: 'the-big-picture', text: 'The Big Picture' },
    { id: 'time-complexity', text: 'Time Complexity' },
  ],

  content,

  prevSlug: 'what-is-a-graph',
  prevTitle: 'What is a Graph?',

  nextSlug: '',
  nextTitle: '',
}
