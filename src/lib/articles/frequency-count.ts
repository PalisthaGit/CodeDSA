import fs from 'fs'
import path from 'path'
import type { Article } from '../articles'
import { applyCodeHighlighting } from '../highlightCode'

const content = applyCodeHighlighting(
  fs.readFileSync(path.join(process.cwd(), 'src/lib/articles/content/frequency-count.html'), 'utf-8')
)

export const frequencyCountArticle: Article = {
  slug: 'frequency-count',
  title: 'Frequency Count Method',
  chapter: 'Start here',
  chapterSlug: 'start-here',
  tagline: 'Learn the simplest way to measure how many steps an algorithm takes — by counting how often each statement runs.',
  readTime: '7 min',
  headings: [
    { id: 'our-assumption', text: 'Our Assumption' },
    { id: 'example-1-statements-that-execute-once', text: 'Example 1 — Statements That Execute Once' },
    { id: 'what-if-a-statement-executes-multiple-times', text: 'What If a Statement Executes Multiple Times?' },
    { id: 'example-2-a-single-loop', text: 'Example 2 — A Single Loop' },
    { id: 'what-happens-with-nested-loops', text: 'What Happens With Nested Loops?' },
    { id: 'example-3-nested-loops', text: 'Example 3 — Nested Loops' },
    { id: 'what-happens-when-the-value-doubles', text: 'What Happens When the Value Doubles?' },
    { id: 'example-4-loops-that-double-each-iteration', text: 'Example 4 — Loops That Double Each Iteration' },
    { id: 'key-takeaways', text: 'Key Takeaways' },
  ],
  content,
  prevSlug: 'time-complexity',
  prevTitle: 'What is Time Complexity?',
  nextSlug: 'arrays',
  nextTitle: 'What is an Array in Programming',
}
