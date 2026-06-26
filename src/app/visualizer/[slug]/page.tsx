import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { findVisualizer, visualizerCategories } from '@/lib/visualizers'
import { VisualizerLayout } from '@/components/visualizer/VisualizerLayout'
import { getAllArticleSlugs } from '@/lib/articles'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return visualizerCategories.flatMap(cat =>
    cat.items.map(item => ({ slug: item.id }))
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const vis = findVisualizer(slug)
  if (!vis) return {}
  return {
    title: `${vis.title} Visualizer — DSANotes`,
    description: `Interactive step-by-step visualization of ${vis.title}. Watch the algorithm run and understand how it works.`,
  }
}

export default async function VisualizerSlugPage({ params }: Props) {
  const { slug } = await params
  const active = findVisualizer(slug)
  if (!active) notFound()

  const articleSlugs = getAllArticleSlugs()
  return (
    <div className="vizPage">
      <VisualizerLayout active={active} articleSlugs={articleSlugs} />
    </div>
  )
}
