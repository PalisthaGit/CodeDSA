'use client'

import { useRouter } from 'next/navigation'
import type { VisualizerCategory } from '@/lib/visualizers'

interface Props {
  categories: VisualizerCategory[]
  activeId: string
}

export function VisualizerMobileSelect({ categories, activeId }: Props) {
  const router = useRouter()
  return (
    <div className="vizMobileRow">
      <select
        className="vizMobileSelect"
        value={activeId}
        onChange={(e) => router.push(`/visualizer/${e.target.value}`)}
        aria-label="Select visualizer"
      >
        {categories.map(cat => (
          <optgroup key={cat.title} label={cat.title}>
            {cat.items.map(item => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  )
}
