import fs from 'fs'
import path from 'path'
import type { Article } from '../articles'
import { applyCodeHighlighting } from '../highlightCode'

const content = applyCodeHighlighting(
  fs.readFileSync(path.join(process.cwd(), 'src/lib/articles/content/arrays.html'), 'utf-8')
)

export const arraysArticle: Article = {
  slug: 'arrays',
  title: 'Array',
  chapter: 'Data structures',
  chapterSlug: 'data-structures',
  tagline: 'From zero to fully understanding arrays — step by step, no experience needed.',
  readTime: '12 min',
  headings: [
    { id: 'before-anything', text: 'Before anything, let me ask you something' },
    { id: 'what-is-an-array', text: 'What is an array?' },
    { id: 'how-to-create-an-array', text: 'How to create an array in C++?' },
    { id: 'how-are-arrays-stored', text: 'How are arrays stored in the computer?' },
    { id: 'access-a-specific-element', text: 'Access a specific element in an array' },
    { id: 'update-an-element', text: 'Update an element' },
    { id: 'traversal', text: 'Traversal — going through every element' },
    { id: 'remove-last-element', text: 'Remove last element' },
    { id: 'remove-from-any-index', text: 'Remove from any index' },
    { id: 'adding-at-the-end', text: 'Adding an element at the end' },
    { id: 'adding-at-specific-index', text: 'Adding an element at a specific index' },
  ],
  content,
  prevSlug: 'why-learn-dsa',
  prevTitle: 'Why do you even need DSA?',
  nextSlug: 'linked-lists',
  nextTitle: "Linked Lists — when arrays aren't enough",
}
