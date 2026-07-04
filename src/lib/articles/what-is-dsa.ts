import fs from 'fs'
import path from 'path'
import type { Article } from '../articles'
import { applyCodeHighlighting } from '../highlightCode'

const content = applyCodeHighlighting(
  fs.readFileSync(path.join(process.cwd(), 'src/lib/articles/content/what-is-dsa.html'), 'utf-8')
)

export const whatIsDsaArticle: Article = {
  slug: 'what-is-dsa',
  title: 'What is DSA and why does it matter?',
  chapter: 'Start here',
  chapterSlug: 'start-here',
  tagline: 'Before you learn a single algorithm, let us talk about why any of this matters. This one will click fast.',
  readTime: '5 min',
  headings: [
    { id: 'what-are-data-structures', text: 'What are data structures?' },
    { id: 'what-are-algorithms', text: 'What are algorithms?' },
    { id: 'bringing-it-all-together', text: 'Bringing it all together' },
    { id: 'whats-next', text: "What's next" },
  ],
  content,
  nextSlug: 'why-learn-dsa',
  nextTitle: 'Why do you even need DSA?',
}
