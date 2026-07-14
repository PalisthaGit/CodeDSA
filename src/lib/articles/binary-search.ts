import fs from 'fs'
import path from 'path'
import type { Article } from '../articles'
import { applyCodeHighlighting } from '../highlightCode'

const content = applyCodeHighlighting(
  fs.readFileSync(path.join(process.cwd(), 'src/lib/articles/content/binary-search.html'), 'utf-8')
)

export const binarySearchArticle: Article = {
  slug: 'binary-search',
  title: 'Binary Search',
  chapter: 'Searching and graphs',
  chapterSlug: 'searching-and-graphs',
  tagline: 'Once you see it, you will wonder how you never thought of it yourself. It is that natural.',
  readTime: '6 min',
  headings: [
    { id: 'the-guessing-game', text: 'The guessing game' },
    { id: 'how-it-works-in-code', text: 'How it works in code' },
    { id: 'how-fast-is-it', text: 'How fast is it?' },
    { id: 'when-to-use', text: 'When to use binary search' },
  ],
  content,
  prevSlug: 'linear-search',
  prevTitle: 'Linear Search — check everything one by one',

  nextSlug: 'what-is-a-graph',
  nextTitle: 'What is a Graph?',
}
