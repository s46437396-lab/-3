import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Download, Link2, Pencil } from 'lucide-react';
import { NewsArticle, PageRoute } from '../types/news';
import { EditorialImage } from './EditorialImage';

interface ArticlePageProps {
  article: NewsArticle;
  allArticles: NewsArticle[];
  onNavigate: (route: PageRoute) => void;
  onDownloadHtml: (article: NewsArticle) => void;
  onEditArticle: (articleId: NewsArticle['id']) => void;
}

export function ArticlePage({
  article,
  allArticles,
  onNavigate,
  onDownloadHtml,
  onEditArticle,
}: ArticlePageProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    setScrollProgress(0);
  }, [article.id]);

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        setScrollProgress(1);
        return;
      }
      const progress = Math.min(1, Math.max(0, window.scrollY / docHeight));
      setScrollProgress(progress);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [article.id]);

  const handleCopyUrl = async () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#/news/${article.id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      setCopiedLink(false);
    }
  };

  const otherArticles = allArticles.filter((item) => item.id !== article.id);

  return (
    <>
      {/* Reading progress indicator (compositor-only scaleX) */}
      <div
        aria-hidden="true"
        className="fixed top-16 left-0 right-0 h-0.5 bg-zinc-200 z-30 pointer-events-none"
      >
        <div
          className="h-full bg-blue-900 origin-left transition-transform duration-100"
          style={{ transform: `scaleX(${scrollProgress})` }}
        />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-14">
        {/* Back navigation & Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-zinc-200">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-950 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ко всем новостям лицея</span>
          </button>

          <div className="text-xs text-zinc-500 tabular-nums">
            <span>Страница {article.issueIndex} из 03</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>{article.slug}.html</span>
          </div>
        </div>

        {/* Article Header */}
        <header className="max-w-4xl mb-10">
          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 mb-4 tabular-nums">
            <span className="font-semibold text-blue-900">{article.category}</span>
            <span aria-hidden="true">·</span>
            <span>{article.date}</span>
            <span aria-hidden="true">·</span>
            <span>{article.author}</span>
            <span aria-hidden="true">·</span>
            <span>{article.readTime}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-semibold tracking-tight text-zinc-950 leading-tight mb-5">
            {article.title}
          </h1>

          <p className="text-lg sm:text-xl text-zinc-600 leading-relaxed max-w-3xl">
            {article.subtitle}
          </p>
        </header>

        {/* Documentary Photo */}
        <figure className="mb-12">
          <div className="aspect-video w-full overflow-hidden border border-zinc-200 bg-zinc-100">
            <EditorialImage
              src={article.imageUrl}
              alt={article.imageAlt}
              className="w-full h-full object-cover"
            />
          </div>
          <figcaption className="font-serif italic text-xs sm:text-sm text-zinc-500 mt-3">
            {article.imageCaption}
          </figcaption>
        </figure>

        {/* Asymmetric 2-Column Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Main Reading Column */}
          <article className="lg:col-span-8">
            <div className="max-w-prose space-y-6 text-base sm:text-[17px] leading-[1.8] text-zinc-800">
              {article.paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className={
                    index === 0
                      ? 'first-letter:font-serif first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3.5 first-letter:mt-1 first-letter:leading-none first-letter:text-zinc-950'
                      : undefined
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Pull Quote separated by subtle top/bottom hairline dividers */}
            <blockquote className="max-w-prose my-10 py-7 border-y border-zinc-200">
              <p className="font-serif italic text-2xl sm:text-[26px] leading-snug text-zinc-950">
                «{article.pullQuote.text}»
              </p>
              <footer className="mt-3 text-xs sm:text-sm font-medium text-zinc-500">
                — {article.pullQuote.attribution}
              </footer>
            </blockquote>

            {/* Page Action Bar */}
            <div className="max-w-prose pt-6 border-t border-zinc-200 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleCopyUrl}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
                <span>{copiedLink ? 'Ссылка скопирована' : 'Копировать ссылку'}</span>
              </button>

              <button
                type="button"
                onClick={() => onDownloadHtml(article)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-zinc-800 bg-zinc-100 hover:bg-zinc-200/80 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Скачать HTML-страницу</span>
              </button>

              <button
                type="button"
                onClick={() => onEditArticle(article.id)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-zinc-700 hover:text-zinc-950 border border-zinc-200 hover:border-zinc-300 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Pencil className="w-4 h-4" />
                <span>Редактировать текст</span>
              </button>
            </div>
          </article>

          {/* Margin Sidebar Rail */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-8">
            <div className="bg-zinc-50 border border-zinc-200 p-6">
              <h2 className="font-sans text-sm font-semibold text-blue-900 mb-4">
                Ключевые факты
              </h2>
              <dl className="divide-y divide-zinc-200">
                {article.keyFacts.map((fact) => (
                  <div
                    key={fact.label}
                    className="py-2.5 flex items-baseline justify-between gap-4 text-sm"
                  >
                    <dt className="text-zinc-500">{fact.label}</dt>
                    <dd className="font-semibold text-zinc-950 text-right tabular-nums">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 pt-5 border-t border-zinc-200 space-y-4">
                {article.marginNotes.map((note) => (
                  <div key={note.title}>
                    <h3 className="font-sans text-xs font-semibold text-zinc-900 mb-1">
                      {note.title}
                    </h3>
                    <p className="text-xs text-zinc-600 leading-relaxed">{note.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-zinc-200 p-6">
              <h2 className="font-sans text-sm font-semibold text-zinc-950 mb-4">
                Другие страницы выпуска
              </h2>
              <div className="divide-y divide-zinc-200">
                {otherArticles.map((other) => (
                  <div key={other.id} className="py-3.5 first:pt-0 last:pb-0">
                    <div className="text-xs text-zinc-500 mb-1 tabular-nums">
                      {other.issueIndex}. {other.category}
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigate(other.id)}
                      className="text-left text-sm font-semibold text-zinc-900 hover:text-blue-900 transition-colors inline-flex items-start gap-2 cursor-pointer group"
                    >
                      <span>{other.title}</span>
                      <ArrowRight className="w-4 h-4 shrink-0 mt-0.5 text-zinc-400 group-hover:text-blue-900" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
