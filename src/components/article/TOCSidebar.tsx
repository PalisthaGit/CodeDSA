import Link from 'next/link'
import { sections } from '@/lib/topics'
import styles from './TOCSidebar.module.css'

interface TOCSidebarProps {
  activeSlug: string
}

export function TOCSidebar({ activeSlug }: TOCSidebarProps) {
  return (
    <nav className={styles.sidebar}>
      <p className={styles.allTopicsLabel}>All topics</p>
      {sections.map(section => (
        <div key={section.id} className={styles.chapter}>
          <p className={styles.chapterTitle}>{section.title}</p>
          <ul className={styles.topicList}>
            {section.topics.map(topic => {
              const isActive = topic.slug === activeSlug
              return (
                <li
                  key={topic.slug}
                  className={`${styles.topicItem} ${isActive ? styles.topicItemActive : ''}`}
                >
                  <span
                    className={`${styles.indicator} ${isActive ? styles.indicatorActive : styles.indicatorEmpty}`}
                    aria-hidden="true"
                  />
                  <Link
                    href={`/learn/${topic.slug}`}
                    className={`${styles.topicName} ${isActive ? styles.topicNameActive : ''}`}
                  >
                    {topic.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}
