import fs from 'fs'
import path from 'path'
import type { Article } from '../articles'
import { applyCodeHighlighting } from '../highlightCode'

const content = applyCodeHighlighting(
  fs.readFileSync(path.join(process.cwd(), 'src/lib/articles/content/linear-search.html'), 'utf-8')
)

export const linearSearchArticle: Article = {
  slug: 'linear-search',
  title: 'Linear Search',
  chapter: 'Searching and graphs',
  chapterSlug: 'searching-and-graphs',
  tagline: 'I will explain it so simply that you will understand it right away. Trust me, it is that easy.',
  readTime: '5 min',
  headings: [
    { id: 'what-is-linear-search', text: 'What is linear search?' },
    { id: 'how-it-works-in-code', text: 'How it works in code' },
    { id: 'best-and-worst-case', text: 'Best case and worst case' },
    { id: 'when-to-use', text: 'When to use linear search' },
  ],
  content,
  prevSlug: 'linked-lists',
  prevTitle: "Linked Lists — when arrays aren't enough",
  nextSlug: 'binary-search',
  nextTitle: 'Binary search — cut it in half',
}
