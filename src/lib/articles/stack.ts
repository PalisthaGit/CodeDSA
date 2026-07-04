import fs from 'fs'
import path from 'path'
import type { Article } from '../articles'
import { applyCodeHighlighting } from '../highlightCode'

const content = applyCodeHighlighting(
  fs.readFileSync(
    path.join(process.cwd(), 'src/lib/articles/content/stack.html'),
    'utf-8'
  )
)

export const stackArticle: Article = {
  slug: 'stack',
  title: 'Stack',
  chapter: 'Data structures',
  chapterSlug: 'data-structures',
  tagline: 'Learn stacks from scratch with simple explanations, visuals, and examples.',
  readTime: '10 min',

  headings: [
    { id: 'what-is-a-stack', text: 'What is a Stack?' },
    { id: 'why-can-we-only-use-the-top', text: 'Why can we only use the top?' },
    { id: 'how-to-create-a-stack', text: 'How to create a Stack' },
    { id: 'push', text: 'Push' },
    { id: 'pop', text: 'Pop' },
    { id: 'peek', text: 'Peek' },
    { id: 'is-empty', text: 'Is Empty' },
    { id: 'size', text: 'Size' },
    { id: 'where-are-stacks-used', text: 'Where are Stacks used?' },
    { id: 'complete-stack-code', text: 'Complete Stack Code' },
  ],

  content,

  prevSlug: 'linked-lists',
  prevTitle: 'Linked Lists',

  nextSlug: '',
  nextTitle: '',
}