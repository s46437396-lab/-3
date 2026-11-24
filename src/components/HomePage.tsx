import { ArrowRight, Download, ExternalLink } from 'lucide-react';
import { LyceumSettings, NewsArticle, PageRoute } from '../types/news';
import { EditorialImage } from './EditorialImage';

interface HomePageProps {
  settings: LyceumSettings;
  articles: NewsArticle[];
  onNavigate: (route: PageRoute) => void;
  onDownloadHtml: (article: NewsArticle) => void;
  onOpenPublish: () => void;
}

export function HomePage({
  settings,
  articles,
  onNavigate,
  onDownloadHtml,
  onOpenPublish,
}: HomePageProps) {
  const [leadArticle, ...secondaryArticles] = articles;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      {/* Masthead Editorial Strip */}
      <section className="pb-10 border-b border-zinc-200">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-xs font-medium text-zinc-500 tracking-wide mb-3">
              <span>{settings.city}</span>
              <span className="mx-2" aria-hidden="true">·</span>
              <span className="tabular-nums">{settings.issueNumber}</span>
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-zinc-950 max-w-3xl">
              Новости нашего лицея
            </h1>
          </div>
          <p className="text-sm sm:text-base text-zinc-600 max-w-md leading-relaxed">
            Три официальных новостных материала номера: профилактическая проверка, итоги декады английского языка и разбор дисциплинарного инцидента.
          </p>
        </div>
      </section>

      {/* Tier 1: Lead Story (2-column balanced split) */}
      {leadArticle && (
        <section className="py-10 lg:py-14 border-b border-zinc-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 mb-4 tabular-nums">
                  <span className="font-semibold text-blue-900">
                    {leadArticle.issueIndex}. {leadArticle.category}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{leadArticle.date}</span>
                  <span aria-hidden="true">·</span>
                  <span>{leadArticle.readTime}</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950 leading-tight mb-5">
                  <button
                    type="button"
                    onClick={() => onNavigate(leadArticle.id)}
                    className="text-left hover:text-blue-900 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-900"
                  >
                    {leadArticle.title}
                  </button>
                </h2>

                <p className="text-base text-zinc-600 leading-relaxed mb-6">
                  {leadArticle.subtitle}
                </p>

                <p className="text-sm text-zinc-700 leading-relaxed line-clamp-3 mb-8">
                  {leadArticle.paragraphs[0]}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => onNavigate(leadArticle.id)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-md transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>Открыть страницу новости</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDownloadHtml(leadArticle)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200/70 rounded-md transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Скачать HTML</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <button
                type="button"
                onClick={() => onNavigate(leadArticle.id)}
                className="block w-full h-full text-left group cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-900"
              >
                <div className="overflow-hidden border border-zinc-200 bg-zinc-100 h-full min-h-[260px] lg:min-h-[380px]">
                  <EditorialImage
                    src={leadArticle.imageUrl}
                    alt={leadArticle.imageAlt}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Tier 2: Secondary Feature Articles */}
      <section className="py-10 lg:py-14 border-b border-zinc-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {secondaryArticles.map((article) => (
            <article key={article.id} className="flex flex-col justify-between">
              <div>
                <button
                  type="button"
                  onClick={() => onNavigate(article.id)}
                  className="block w-full text-left group cursor-pointer mb-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-900"
                >
                  <div className="aspect-video overflow-hidden border border-zinc-200 bg-zinc-100">
                    <EditorialImage
                      src={article.imageUrl}
                      alt={article.imageAlt}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </div>
                </button>

                <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 mb-3 tabular-nums">
                  <span className="font-semibold text-blue-900">
                    {article.issueIndex}. {article.category}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{article.date}</span>
                  <span aria-hidden="true">·</span>
                  <span>{article.readTime}</span>
                </div>

                <h3 className="font-serif text-2xl font-semibold tracking-tight text-zinc-950 leading-snug mb-3">
                  <button
                    type="button"
                    onClick={() => onNavigate(article.id)}
                    className="text-left hover:text-blue-900 transition-colors cursor-pointer"
                  >
                    {article.title}
                  </button>
                </h3>

                <p className="text-sm sm:text-base text-zinc-600 leading-relaxed mb-6">
                  {article.subtitle}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => onNavigate(article.id)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-900 hover:text-blue-700 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>Читать страницу полностью</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDownloadHtml(article)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-950 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>HTML-файл</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Tier 3: Directory of the 3 Published Web Pages */}
      <section className="pt-10 lg:pt-14">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-zinc-950">
              Реестр веб-страниц выпуска
            </h2>
            <p className="text-sm text-zinc-600 mt-1">
              Каждая новость оформлена как отдельная страница и готова к публикации на онлайн-сайте.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenPublish}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-900 bg-zinc-100 hover:bg-zinc-200/70 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Редактировать и выгрузить сайт</span>
          </button>
        </div>

        <div className="border-t border-zinc-200 divide-y divide-zinc-200">
          {articles.map((article) => (
            <div
              key={article.id}
              className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-baseline gap-4 min-w-0">
                <span className="text-sm font-semibold text-zinc-400 tabular-nums shrink-0">
                  {article.issueIndex}
                </span>
                <div className="min-w-0">
                  <button
                    type="button"
                    onClick={() => onNavigate(article.id)}
                    className="text-left font-medium text-base text-zinc-950 hover:text-blue-900 transition-colors cursor-pointer block"
                  >
                    {article.title}
                  </button>
                  <div className="text-xs text-zinc-500 mt-1 tabular-nums">
                    <span>{article.category}</span>
                    <span className="mx-2" aria-hidden="true">·</span>
                    <span>{article.date}</span>
                    <span className="mx-2" aria-hidden="true">·</span>
                    <span>{article.slug}.html</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 pl-8 md:pl-0">
                <button
                  type="button"
                  onClick={() => onNavigate(article.id)}
                  className="px-3.5 py-2 text-xs font-semibold text-zinc-900 bg-zinc-100 hover:bg-zinc-200/80 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  Открыть страницу
                </button>
                <button
                  type="button"
                  onClick={() => onDownloadHtml(article)}
                  className="px-3.5 py-2 text-xs font-medium text-zinc-600 hover:text-zinc-950 border border-zinc-200 hover:border-zinc-300 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  Скачать HTML
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
