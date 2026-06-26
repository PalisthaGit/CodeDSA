import type { Article } from '@/lib/articles'
import { TOCSidebar } from './TOCSidebar'
import { StickySidebar } from './StickySidebar'
import { NavButtons } from './NavButtons'
import { MobileArticleSidebar } from './MobileArticleSidebar'

interface ArticleLayoutProps {
  articleData: Article
  children: React.ReactNode
}

export function ArticleLayout({ articleData, children }: ArticleLayoutProps) {
  return (
    <div className="articleLayout">
      <div className="articleGrid">
        <div className="articleSidebar">
          <TOCSidebar activeSlug={articleData.slug} />
        </div>

        <main className="articleMain">
          <MobileArticleSidebar>
            <TOCSidebar activeSlug={articleData.slug} />
          </MobileArticleSidebar>
          {children}
          <NavButtons
            prevSlug={articleData.prevSlug}
            prevTitle={articleData.prevTitle}
            nextSlug={articleData.nextSlug}
            nextTitle={articleData.nextTitle}
          />
        </main>

        <div className="articleRight">
          <StickySidebar headings={articleData.headings} />
        </div>
      </div>
    </div>
  )
}
