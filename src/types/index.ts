export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  toc: TOCItem[];
  content: string;
  publishedAt: string;
  updatedAt?: string;
}

export interface VisualizerItem {
  id: string;
  label: string;
  value: number;
  highlighted?: boolean;
  active?: boolean;
}
