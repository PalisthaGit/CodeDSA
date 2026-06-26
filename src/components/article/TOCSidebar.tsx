import Link from 'next/link'
import { sections } from '@/lib/topics'
import { getAllArticleSlugs } from '@/lib/articles'

interface TOCSidebarProps {
  activeSlug: string
}

export function TOCSidebar({ activeSlug }: TOCSidebarProps) {
  const validSlugs = new Set(getAllArticleSlugs())

  return (
    <nav className="tocSidebar">
      <p className="tocLabel">All topics</p>
      {sections.map(section => {
        const availableTopics = section.topics.filter(topic => validSlugs.has(topic.slug))
        if (availableTopics.length === 0) return null
        return (
          <div key={section.id} className="tocChapter">
            <p className="tocChapterTitle">{section.title}</p>
            <ul className="tocList">
              {availableTopics.map(topic => {
                const isActive = topic.slug === activeSlug
                return (
                  <li
                    key={topic.slug}
                    className={`tocItem${isActive ? ' tocItemActive' : ''}`}
                  >
                    <span
                      className={`tocCircle${isActive ? ' tocItemDone' : ''}`}
                      aria-hidden="true"
                    />
                    <Link
                      href={`/learn/${topic.slug}`}
                      className={`tocItemName${isActive ? ' tocItemNameActive' : ''}`}
                    >
                      {topic.title}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </nav>
  )
}
