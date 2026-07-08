import { whatIsDsaArticle } from './articles/what-is-dsa'
import { whyLearnDsaArticle } from './articles/why-learn-dsa'
import { timeComplexityArticle } from './articles/time-complexity'
import { arraysArticle } from './articles/arrays'
import { linkedListsArticle } from './articles/linked-lists'
import { stackArticle } from './articles/stack'
import { queueArticle } from './articles/queue'
import { linearSearchArticle } from './articles/linear-search'
import { binarySearchArticle } from './articles/binary-search'

export type ArticleHeading = {
  id: string
  text: string
}

export type Article = {
  slug: string
  title: string
  chapter: string
  chapterSlug: string
  tagline: string
  readTime: string
  headings: ArticleHeading[]
  content: string
  prevSlug?: string
  nextSlug?: string
  prevTitle?: string
  nextTitle?: string
}

const articleRegistry: Record<string, Article> = {
  'what-is-dsa': whatIsDsaArticle,
  'why-learn-dsa': whyLearnDsaArticle,
  'time-complexity': timeComplexityArticle,
  arrays: arraysArticle,
  'linked-lists': linkedListsArticle,
  stack: stackArticle,
    queue: queueArticle,

  'linear-search': linearSearchArticle,
  'binary-search': binarySearchArticle,
}

export function getArticleData(slug: string): Article | null {
  return articleRegistry[slug] ?? null
}

export function getAllArticleSlugs(): string[] {
  return Object.keys(articleRegistry)
}

export function getPrevNext(slug: string) {
  const article = articleRegistry[slug]
  if (!article) return { prev: null, next: null }
  const prev = article.prevSlug ? { slug: article.prevSlug, title: article.prevTitle ?? '' } : null
  const next = article.nextSlug ? { slug: article.nextSlug, title: article.nextTitle ?? '' } : null
  return { prev, next }
}
