import Link from 'next/link'
import { sections } from '@/lib/topics'
import { getAllArticleSlugs } from '@/lib/articles'

interface TOCSidebarProps {
  activeSlug: string
  chapterSlug: string
}

export function TOCSidebar({ activeSlug }: TOCSidebarProps) {
  const validSlugs = new Set(getAllArticleSlugs())

  return (
    <nav className="tocSidebar">
      <p className="tocSidebarLabel">Learn</p>
      {sections.map((section, index) => (
        <div key={section.id} className="tocSection">
          {index > 0 && <div className="tocDivider" aria-hidden="true" />}
          <p className="tocSectionTitle">{section.title}</p>
          <ul className="tocList">
            {section.topics.map(topic => {
              const isActive = topic.slug === activeSlug
              const available = validSlugs.has(topic.slug)
              return (
                <li key={topic.slug}>
                  {available ? (
                    <Link
                      href={`/learn/${topic.slug}`}
                      className={`tocItem${isActive ? ' tocItemActive' : ''}`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {topic.title}
                    </Link>
                  ) : (
                    <span className="tocItemDisabled">{topic.title}</span>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}
