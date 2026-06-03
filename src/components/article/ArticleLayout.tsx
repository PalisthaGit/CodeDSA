import type { Article } from "@/types";
import { TOCSidebar } from "./TOCSidebar";
import { StickySidebar } from "./StickySidebar";
import { NavButtons } from "./NavButtons";

interface ArticleLayoutProps {
  article: Article;
  children: React.ReactNode;
  prevSlug?: string;
  prevTitle?: string;
  nextSlug?: string;
  nextTitle?: string;
}

export function ArticleLayout({
  article,
  children,
  prevSlug,
  prevTitle,
  nextSlug,
  nextTitle,
}: ArticleLayoutProps) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex gap-8 py-8">
        {/* TOC sidebar — hidden on mobile, visible on lg+ */}
        <aside className="hidden lg:block w-56 shrink-0">
          <TOCSidebar items={article.toc} />
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1">
          <h1 className="mb-4 text-3xl text-text-primary">{article.title}</h1>
          <p className="mb-8 text-text-secondary">{article.description}</p>
          <div className="prose max-w-none">{children}</div>
          <NavButtons
            prevSlug={prevSlug}
            prevTitle={prevTitle}
            nextSlug={nextSlug}
            nextTitle={nextTitle}
          />
        </main>

        {/* Sticky sidebar — hidden on mobile and tablet */}
        <aside className="hidden xl:block w-48 shrink-0">
          <StickySidebar />
        </aside>
      </div>
    </div>
  );
}
