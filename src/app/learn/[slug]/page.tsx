import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { sections } from '@/lib/topics'
import { getArticleData } from '@/lib/articles'
import { ArticleLayout } from '@/components/article/ArticleLayout'
import { MobileTOCToggle } from '@/components/article/MobileTOCToggle'
import { ArrayVisualizer } from '@/components/visualizer/ArrayVisualizer'
import { LinkedListVisualizer } from '@/components/visualizer/LinkedListVisualizer'
import { LinearSearchVisualizer } from '@/components/visualizer/LinearSearchVisualizer'
import { BinarySearchVisualizer } from '@/components/visualizer/BinarySearchVisualizer'
import { DSRunner } from '@/components/visualizer/DSRunner'
import { GraphVisualizer } from '@/components/visualizer/GraphVisualizer'
import { graphRegistry } from '@/components/visualizer/graph.registry'

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
          : vizId === 'stack' || vizId === 'stack-create' || vizId === 'stack-size'
            ? <DSRunner key={match.index} op="all" />
          : vizId === 'stack-push'
            ? <DSRunner key={match.index} op="push" />
          : vizId === 'stack-pop'
            ? <DSRunner key={match.index} op="pop" />
          : vizId === 'stack-peek'
            ? <DSRunner key={match.index} op="peek" />
          : vizId === 'stack-empty'
            ? <DSRunner key={match.index} op="pop" startEmpty={true} />
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
                        : vizId in graphRegistry
                          ? <GraphVisualizer key={match.index} algorithm={vizId} />
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
    alternates: { canonical: `/learn/${slug}` },
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

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: article.title,
      description: article.tagline,
      url: `https://dsanotes.com/learn/${slug}`,
      author: { '@type': 'Organization', name: 'DSANotes', url: 'https://dsanotes.com' },
      publisher: { '@type': 'Organization', name: 'DSANotes', url: 'https://dsanotes.com' },
      mainEntityOfPage: `https://dsanotes.com/learn/${slug}`,
      educationalLevel: 'beginner',
      learningResourceType: 'Article',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://dsanotes.com' },
        { '@type': 'ListItem', position: 2, name: 'Learn', item: 'https://dsanotes.com/learn' },
        { '@type': 'ListItem', position: 3, name: article.title, item: `https://dsanotes.com/learn/${slug}` },
      ],
    },
  ]

  return (
    <ArticleLayout articleData={article}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <div className="articleCenter">
        <div className="articleHeader">
          <div className="breadcrumbRow">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link href="/learn" className="breadcrumbLink">Learn</Link>
              {article.chapter !== 'Start here' && (
                <>
                  <span className="breadcrumbSep">·</span>
                  <span className="breadcrumbSection">{article.chapter}</span>
                </>
              )}
              <span className="breadcrumbSep">·</span>
              <span className="breadcrumbCurrent">{article.title}</span>
            </nav>
            <MobileTOCToggle headings={article.headings} />
          </div>
          {article.chapter !== 'Start here' && <p className="articleTag">{article.chapter}</p>}
          <h1 className="articleTitle">{article.title}</h1>
        </div>

        <div className="articleBody">
          <ArticleContent content={article.content} />
        </div>
      </div>
    </ArticleLayout>
  )
}
