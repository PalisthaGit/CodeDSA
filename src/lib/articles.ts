import { whatIsDsaArticle } from './articles/what-is-dsa'
import { arraysArticle } from './articles/arrays'

export type ArticleSection = {
  id: string
  type: 'h2' | 'p' | 'code' | 'infobox' | 'visualizer'
  content?: string
  variant?: 'yellow' | 'pink' | 'blue'
  language?: string
}

export type Article = {
  slug: string
  title: string
  chapter: string
  chapterSlug: string
  tagline: string
  readTime: string
  hasVisualizer: boolean
  sections: ArticleSection[]
  prevSlug?: string
  nextSlug?: string
  prevTitle?: string
  nextTitle?: string
}

export type ArticleData = Article

const articleRegistry: Record<string, Article> = {
  'what-is-dsa': whatIsDsaArticle,
  arrays: arraysArticle,
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
