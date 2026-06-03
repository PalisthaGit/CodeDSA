import type { Article } from '@/lib/articles'
import { TOCSidebar } from './TOCSidebar'
import { StickySidebar } from './StickySidebar'
import { NavButtons } from './NavButtons'
import styles from './ArticleLayout.module.css'

interface ArticleLayoutProps {
  articleData: Article
  children: React.ReactNode
}

export function ArticleLayout({ articleData, children }: ArticleLayoutProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        <div className={styles.leftCol}>
          <TOCSidebar activeSlug={articleData.slug} />
        </div>

        <main className={styles.content}>
          {children}
          <NavButtons
            prevSlug={articleData.prevSlug}
            prevTitle={articleData.prevTitle}
            nextSlug={articleData.nextSlug}
            nextTitle={articleData.nextTitle}
          />
        </main>

        <div className={styles.rightCol}>
          <StickySidebar sections={articleData.sections} />
        </div>
      </div>
    </div>
  )
}
