import Link from 'next/link'
import type { VisualizerCategory } from '@/lib/visualizers'

interface VisualizerSidebarProps {
  categories: VisualizerCategory[]
  activeId: string
}

export function VisualizerSidebar({ categories, activeId }: VisualizerSidebarProps) {
  return (
    <nav className="visSidebar">
      <p className="visualizerSidebarLabel">Visualizers</p>
      {categories.map((cat, index) => (
        <div key={cat.title} className="visCategory">
          {index > 0 && <div className="visDivider" aria-hidden="true" />}
          <p className="visCategoryTitle">{cat.title}</p>
          <ul className="visItemList">
            {cat.items.map(item => {
              const isActive = item.id === activeId
              return (
                <li key={item.id}>
                  <Link
                    href={`/visualizer/${item.id}`}
                    className={`visItem${isActive ? ' visItemActive' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.title}
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
