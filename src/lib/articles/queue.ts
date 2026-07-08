import fs from 'fs'
import path from 'path'
import type { Article } from '../articles'
import { applyCodeHighlighting } from '../highlightCode'

const content = applyCodeHighlighting(
  fs.readFileSync(
    path.join(process.cwd(), 'src/lib/articles/content/queue.html'),
    'utf-8'
  )
)

export const queueArticle: Article = {
  slug: 'queue',
  title: 'Queue',
  chapter: 'Data structures',
  chapterSlug: 'data-structures',
  tagline: 'Learn queues from scratch with simple explanations, visuals, and examples.',
  readTime: '10 min',

  headings: [
    { id: 'what-is-a-queue', text: 'What is a Queue?' },
    { id: 'why-only-front-and-back', text: 'Why can we only add at the back and remove from the front?' },
    { id: 'queue-operations', text: 'Queue Operations' },
    { id: 'creating-a-queue', text: 'How to Create a Queue' },
    { id: 'enqueue', text: 'Enqueue' },
    { id: 'dequeue', text: 'Dequeue' },
    { id: 'front', text: 'Front' },
    { id: 'is-empty', text: 'Is Empty' },
    { id: 'size', text: 'Size' },
    { id: 'full-queue-code', text: 'Full Queue Code' },
    { id: 'where-queues-are-used', text: 'Where Are Queues Used?' },
  ],

  content,

  prevSlug: 'stack',
  prevTitle: 'Stack',

  nextSlug: '',
  nextTitle: '',
}