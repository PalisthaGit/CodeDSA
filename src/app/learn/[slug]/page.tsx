import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { sections } from '@/lib/topics'
import { getArticleData } from '@/lib/articles'
import { ArticleLayout } from '@/components/article/ArticleLayout'
import { ArrayVisualizer } from '@/components/visualizer/ArrayVisualizer'
import { LinkedListVisualizer } from '@/components/visualizer/LinkedListVisualizer'
import { LinearSearchVisualizer } from '@/components/visualizer/LinearSearchVisualizer'
import { BinarySearchVisualizer } from '@/components/visualizer/BinarySearchVisualizer'

type VisualizerOperation = 'all' | 'access' | 'update' | 'add' | 'remove' | 'traverse'

const MARKER_RE = /<div data-visualizer="([^"]+)"><\/div>/g

function ArticleContent({ content }: { content: string }) {
  const parts: React.ReactNode[] = []
  let last = 0
  let match: RegExpExecArray | null

  MARKER_RE.lastIndex = 0
  while ((match = MARKER_RE.exec(content)) !== null) {
    if (match.index > last) {
      parts.push(
        <div key={last} dangerouslySetInnerHTML={{ __html: content.slice(last, match.index) }} />
      )
    }
    const vizId = match[1]
    parts.push(
      vizId === 'linear-search'
        ? <LinearSearchVisualizer key={match.index} />
        : vizId === 'binary-search'
          ? <BinarySearchVisualizer key={match.index} />
          : vizId === 'linked-list'
            ? <LinkedListVisualizer key={match.index} />
            : vizId === 'linked-list-create'
              ? <LinkedListVisualizer key={match.index} op="createNode" />
              : vizId === 'linked-list-add'
                ? <LinkedListVisualizer key={match.index} op="addNode" />
                : vizId === 'linked-list-traverse'
                  ? <LinkedListVisualizer key={match.index} op="traverse" />
              : vizId === 'linked-list-insert-begin'
                ? <LinkedListVisualizer key={match.index} op="insertBegin" />
                : vizId === 'linked-list-insert-pos'
                  ? <LinkedListVisualizer key={match.index} op="insertPos" />
                  : vizId === 'linked-list-remove-begin'
                    ? <LinkedListVisualizer key={match.index} op="removeBegin" />
                    : vizId === 'linked-list-remove-end'
                      ? <LinkedListVisualizer key={match.index} op="removeEnd" />
                      : vizId === 'linked-list-remove-pos'
                        ? <LinkedListVisualizer key={match.index} op="removePos" />
                        : <ArrayVisualizer key={match.index} operation={vizId as VisualizerOperation} />
    )
    last = match.index + match[0].length
  }

  if (last < content.length) {
    parts.push(
      <div key={last} dangerouslySetInnerHTML={{ __html: content.slice(last) }} />
    )
  }

  return <div className="articleProse">{parts}</div>
}

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return sections.flatMap(s => s.topics.map(t => ({ slug: t.slug })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleData(slug)
  if (!article) return {}

  return {
    title: `${article.title} — DSANotes`,
    description: article.tagline,
    openGraph: {
      title: `${article.title} — DSANotes`,
      description: article.tagline,
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = getArticleData(slug)

  if (!article) notFound()

  return (
    <ArticleLayout articleData={article}>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/learn" className="breadcrumbLink">Learn</Link>
        <span className="breadcrumbSep">·</span>
        <span className="breadcrumbSection">{article.chapter}</span>
        <span className="breadcrumbSep">·</span>
        <span className="breadcrumbCurrent">{article.title}</span>
      </nav>

      <p className="readTime">{article.readTime} read</p>
      <h1 className="articleTitle">{article.title}</h1>
      <p className="articleTagline">{article.tagline}</p>

      <div className="articleBody">
        <ArticleContent content={article.content} />
      </div>
    </ArticleLayout>
  )
}
