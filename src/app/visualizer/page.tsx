import type { Metadata } from 'next'
import { VisualizerLayout } from '@/components/visualizer/VisualizerLayout'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'DSA Visualizer — Watch algorithms run step by step | DSANotes',
  description:
    "Interactive visualizations for sorting algorithms, graph algorithms, and string matching. Watch bubble sort, merge sort, BFS, DFS, Dijkstra's and more run step by step. Free forever.",
  keywords: [
    'DSA visualizer',
    'algorithm visualizer',
    'sorting visualizer',
    'graph visualizer',
    'bubble sort animation',
    'free DSA',
  ],
}

export default function VisualizerPage() {
  return (
    <div className={styles.page}>
      <VisualizerLayout />
    </div>
  )
}
