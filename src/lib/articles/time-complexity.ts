import fs from 'fs'
import path from 'path'
import type { Article } from '../articles'
import { applyCodeHighlighting } from '../highlightCode'

const content = applyCodeHighlighting(
  fs.readFileSync(path.join(process.cwd(), 'src/lib/articles/content/time-complexity.html'), 'utf-8')
)

export const timeComplexityArticle: Article = {
  slug: 'time-complexity',
  title: 'What is Time Complexity?',
  chapter: 'Start here',
  chapterSlug: 'start-here',
  tagline: 'There\'s a smarter way to compare algorithms than just timing them. This lesson shows you how developers actually measure efficiency.',
  readTime: '8 min',
  headings: [
    { id: 'o1-constant-time', text: 'O(1) — Constant Time' },
    { id: 'on-linear-time', text: 'O(n) — Linear Time' },
    { id: 'ologn-logarithmic-time', text: 'O(log n) — Logarithmic Time' },
    { id: 'on2-quadratic-time', text: 'O(n²) — Quadratic Time' },
    { id: 'summary', text: 'Summary' },
  ],
  content,
  prevSlug: 'why-learn-dsa',
  prevTitle: 'Why do you even need DSA?',
  nextSlug: 'frequency-count',
  nextTitle: 'Frequency Count Method',
}
