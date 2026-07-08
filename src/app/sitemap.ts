import type { MetadataRoute } from 'next'
import { visualizerCategories } from '@/lib/visualizers'

const ARTICLE_SLUGS = [
  'what-is-dsa',
  'why-learn-dsa',
  'time-complexity',
  'arrays',
  'linked-lists',
  'stack',
  'queue',
  'linear-search',
  'binary-search',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: 'https://dsanotes.com', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://dsanotes.com/learn', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://dsanotes.com/visualizer', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://dsanotes.com/about', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://dsanotes.com/contact', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://dsanotes.com/privacy', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: 'https://dsanotes.com/terms', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]

  const articlePages: MetadataRoute.Sitemap = ARTICLE_SLUGS.map(slug => ({
    url: `https://dsanotes.com/learn/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const visualizerPages: MetadataRoute.Sitemap = visualizerCategories
    .flatMap(cat => cat.items)
    .map(vis => ({
      url: `https://dsanotes.com/visualizer/${vis.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }))

  return [...staticPages, ...articlePages, ...visualizerPages]
}
