import fs from 'fs'
import path from 'path'
import type { Article } from '../articles'
import { applyCodeHighlighting } from '../highlightCode'

const content = applyCodeHighlighting(
  fs.readFileSync(path.join(process.cwd(), 'src/lib/articles/content/linked-lists.html'), 'utf-8')
)

export const linkedListsArticle: Article = {
  slug: 'linked-lists',
  title: 'Linked Lists',
  chapter: 'Data structures',
  chapterSlug: 'data-structures',
  tagline: 'Arrays need a fixed size upfront. Linked lists grow as you go — here is how they work.',
  readTime: '8 min',
  headings: [
    { id: 'what-is-a-linked-list', text: 'What is a linked list?' },
    { id: 'how-to-create-a-node', text: 'How to create a node' },
    { id: 'adding-a-node', text: 'Adding a node' },
    { id: 'head-and-tail', text: 'Head and tail' },
    { id: 'traversing-a-linked-list', text: 'Traversing a linked list' },
    { id: 'inserting-a-node', text: 'Inserting a node' },
    { id: 'at-the-beginning', text: 'At the beginning' },
    { id: 'at-a-specific-position', text: 'At a specific position' },
    { id: 'removing-a-node', text: 'Removing a node' },
    { id: 'from-the-beginning', text: 'From the beginning' },
    { id: 'from-the-end', text: 'From the end' },
    { id: 'from-a-specific-position', text: 'From a specific position' },
    { id: 'complete-linked-list-code', text: 'Complete linked list code' },
  ],
  content,
  prevSlug: 'arrays',
  prevTitle: 'Arrays — your first data structure',
  nextSlug: 'linear-search',
  nextTitle: 'Linear Search — check everything one by one',
}
