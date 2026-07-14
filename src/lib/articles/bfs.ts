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
    { id: 'watching-bfs-work', text: 'Watching BFS Work' },
    { id: 'the-queue', text: 'How the Queue Works' },
    { id: 'full-dry-run', text: 'Full Dry Run' },
    { id: 'building-bfs-in-code', text: 'Building BFS in Code' },
    { id: 'real-life-examples', text: 'Where You\'ll See BFS' },
    { id: 'quick-reference', text: 'Quick Reference Table' },
    { id: 'quick-quiz', text: 'Quick Quiz' },
  ],

  content,

  prevSlug: 'what-is-a-graph',
  prevTitle: 'What is a Graph?',

  nextSlug: '',
  nextTitle: '',
}
