import fs from 'fs'
import path from 'path'
import type { Article } from '../articles'
import { applyCodeHighlighting } from '../highlightCode'

const content = applyCodeHighlighting(
  fs.readFileSync(path.join(process.cwd(), 'src/lib/articles/content/asymptotic-notation.html'), 'utf-8')
)

export const asymptoticNotationArticle: Article = {
  slug: 'asymptotic-notation',
  title: 'Asymptotic Notation: Big O, Omega, and Theta',
  chapter: 'Start here',
  chapterSlug: 'start-here',
  tagline: 'Big O, Omega, and Theta are just three lazy nicknames for "how fast does my code get slow." Here\'s the no-drama explanation.',
  readTime: '10 min',
  headings: [
    { id: 'what-is-asymptotic-notation', text: 'What Is Asymptotic Notation?' },
    { id: 'the-3-types', text: 'The 3 Types: Big O, Omega, and Theta' },
    { id: 'the-growth-rate-ladder', text: 'The Growth Rate Ladder' },
    { id: 'n-vs-fn', text: 'n vs f(n): The Key Distinction' },
    { id: 'big-o', text: 'Big O — The Upper Bound' },
    { id: 'omega', text: 'Omega — The Lower Bound' },
    { id: 'theta', text: 'Theta — The Tight Bound' },
    { id: 'quick-reference', text: 'Quick Reference' },
    { id: 'common-mistake', text: 'Common Mistake: "Big O Means Worst Case"' },
    { id: 'quick-quiz', text: 'Quick Quiz' },
    { id: 'summary', text: 'Summary' },
  ],
  content,
  prevSlug: 'time-complexity',
  prevTitle: 'What is Time Complexity?',
  nextSlug: 'frequency-count',
  nextTitle: 'Frequency Count Method',
}
