import type { VisualizerCategory } from '@/lib/visualizers'
import styles from './VisualizerSidebar.module.css'

interface VisualizerSidebarProps {
  categories: VisualizerCategory[]
  activeId: string
  onSelect: (id: string) => void
}

export function VisualizerSidebar({ categories, activeId, onSelect }: VisualizerSidebarProps) {
  return (
    <nav className={styles.sidebar}>
      <p className={styles.sidebarLabel}>Visualizers</p>
      {categories.map((cat, index) => (
        <div key={cat.title} className={styles.category}>
          {index > 0 && <div className={styles.divider} aria-hidden="true" />}
          <p className={styles.categoryTitle}>{cat.title}</p>
          <ul className={styles.itemList}>
            {cat.items.map(item => {
              const isActive = item.id === activeId
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
                    onClick={() => onSelect(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.title}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}
