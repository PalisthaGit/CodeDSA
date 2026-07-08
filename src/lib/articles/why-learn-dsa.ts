import fs from 'fs'
import path from 'path'
import type { Article } from '../articles'
import { applyCodeHighlighting } from '../highlightCode'

const content = applyCodeHighlighting(
  fs.readFileSync(path.join(process.cwd(), 'src/lib/articles/content/why-learn-dsa.html'), 'utf-8')
)

export const whyLearnDsaArticle: Article = {
  slug: 'why-learn-dsa',
  title: 'Why do you even need DSA?',
  chapter: 'Start here',
  chapterSlug: 'start-here',
  tagline: 'You already know how to code. So why does DSA matter? One story will make it click.',
  readTime: '4 min',
  headings: [
    { id: 'the-balloon-room', text: 'The balloon room' },
    { id: 'what-it-builds-in-you', text: 'What it actually builds in you' },
    { id: 'the-career-part', text: 'The career part' },
    { id: 'dsa-in-the-era-of-ai', text: 'Is it even worth learning DSA in the era of AI?' },
  ],
  content,
  prevSlug: 'what-is-dsa',
  prevTitle: 'What is DSA and why does it matter?',
  nextSlug: 'time-complexity',
  nextTitle: 'What is Time Complexity?',
}
