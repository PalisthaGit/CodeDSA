import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { sections } from '@/lib/topics'
import { getArticleData } from '@/lib/articles'
import type { ArticleSection } from '@/lib/articles'
import { ArticleLayout } from '@/components/article/ArticleLayout'
import { InfoBox } from '@/components/article/InfoBox'
import styles from './page.module.css'

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
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/learn" className={styles.breadcrumbLink}>Learn</Link>
        <span className={styles.breadcrumbSep}>·</span>
        <span className={styles.breadcrumbChapter}>{article.chapter}</span>
        <span className={styles.breadcrumbSep}>·</span>
        <span className={styles.breadcrumbCurrent}>{article.title}</span>
      </nav>

      <p className={styles.readTime}>{article.readTime} read</p>
      <h1 className={styles.title}>{article.title}</h1>
      <p className={styles.tagline}>{article.tagline}</p>

      <div className={styles.articleBody}>
        {article.sections.map((section, i) =>
          renderSection(section, i, article.sections)
        )}
      </div>
    </ArticleLayout>
  )
}

function renderSection(section: ArticleSection, index: number, allSections: ArticleSection[]) {
  const isFirstH2 =
    section.type === 'h2' &&
    !allSections.slice(0, index).some(s => s.type === 'h2')

  switch (section.type) {
    case 'h2':
      return (
        <h2
          key={section.id}
          id={section.id}
          className={`${styles.h2} ${isFirstH2 ? styles.h2First : ''}`}
        >
          {section.content}
        </h2>
      )

    case 'p':
      return (
        <p key={section.id} className={styles.p}>
          {section.content}
        </p>
      )

    case 'code':
      return (
        <pre key={section.id} className={styles.codeBlock}>
          <code>{section.content}</code>
        </pre>
      )

    case 'infobox':
      return (
        <InfoBox key={section.id} variant={section.variant ?? 'yellow'}>
          {section.content}
        </InfoBox>
      )

    case 'visualizer':
      return <VisualizerPlaceholder key={section.id} />

    default:
      return null
  }
}

function VisualizerPlaceholder() {
  return (
    <div className={styles.vizBox}>
      <span className={styles.vizLabel}>see it move</span>
      <div className={styles.vizBars} aria-hidden="true">
        <div className={`${styles.vizBar} ${styles.vizBarPink} ${styles.vizH60}`} />
        <div className={`${styles.vizBar} ${styles.vizBarBlue} ${styles.vizH90}`} />
        <div className={`${styles.vizBar} ${styles.vizBarPurple} ${styles.vizH45}`} />
        <div className={`${styles.vizBar} ${styles.vizBarGreen} ${styles.vizH75}`} />
        <div className={`${styles.vizBar} ${styles.vizBarYellow} ${styles.vizH55}`} />
        <div className={`${styles.vizBar} ${styles.vizBarPink} ${styles.vizH80}`} />
      </div>
      <div className={styles.vizActions}>
        <button type="button" className={styles.vizBtnPlay}>▶ Play</button>
        <button type="button" className={styles.vizBtnStep}>Next step</button>
        <button type="button" className={styles.vizBtnReset}>Reset</button>
      </div>
    </div>
  )
}
