import { useState } from 'react';
import { Check, Copy, Download, RotateCcw, X } from 'lucide-react';
import { ArticleId, LyceumSettings, NewsArticle } from '../types/news';

interface PublishDrawerProps {
  isOpen: boolean;
  initialTab: 'publish' | 'editor';
  initialArticleId: ArticleId;
  settings: LyceumSettings;
  articles: NewsArticle[];
  onClose: () => void;
  onUpdateSettings: (next: LyceumSettings) => void;
  onUpdateArticle: (updated: NewsArticle) => void;
  onResetAll: () => void;
  onDownloadArticleHtml: (article: NewsArticle) => void;
  onDownloadAllHtml: () => void;
}

export function PublishDrawer({
  isOpen,
  initialTab,
  initialArticleId,
  settings,
  articles,
  onClose,
  onUpdateSettings,
  onUpdateArticle,
  onResetAll,
  onDownloadArticleHtml,
  onDownloadAllHtml,
}: PublishDrawerProps) {
  const [activeTab, setActiveTab] = useState<'publish' | 'editor'>(initialTab);
  const [selectedArticleId, setSelectedArticleId] = useState<ArticleId>(initialArticleId);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const activeArticle =
    articles.find((item) => item.id === selectedArticleId) ?? articles[0];

  const handleCopyLink = async (id: string, hashPath: string) => {
    const fullUrl = `${window.location.origin}${window.location.pathname}${hashPath}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      setCopiedId(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-zinc-950/40 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-label="Публикация и редактирование новостей"
    >
      <div className="w-full max-w-2xl bg-white h-full overflow-y-auto border-l border-zinc-200 flex flex-col">
        {/* Drawer Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl font-semibold text-zinc-950">
              Публикация на онлайн-сайт
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Экспорт 3 готовых HTML-страниц и настройка текстов лицея
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть панель"
            className="w-10 h-10 inline-flex items-center justify-center text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Segmented Tab Control */}
        <div className="px-6 pt-5">
          <div className="inline-flex items-center gap-1 p-1 bg-zinc-100 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab('publish')}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'publish'
                  ? 'bg-white text-zinc-950 shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              Онлайн-ссылки и HTML
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'editor'
                  ? 'bg-white text-zinc-950 shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              Редактор текстов
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="p-6 flex-1 space-y-8">
          {activeTab === 'publish' ? (
            <>
              <section className="bg-zinc-50 border border-zinc-200 p-5">
                <h3 className="text-sm font-semibold text-zinc-950 mb-1">
                  Сайт уже работает онлайн
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mb-4">
                  Вы можете сразу делиться прямыми ссылками на этот портал или скачать готовые автономные HTML-файлы для размещения на школьном хостинге, GitHub Pages или Netlify Drop.
                </p>
                <button
                  type="button"
                  onClick={onDownloadAllHtml}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-md transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Скачать весь сайт (index.html + 3 страницы)</span>
                </button>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-zinc-950 mb-3">
                  Готовые новостные веб-страницы
                </h3>
                <div className="border-t border-zinc-200 divide-y divide-zinc-200">
                  <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium text-zinc-950">
                        Главная страница портала
                      </div>
                      <div className="text-xs text-zinc-500 mt-0.5 tabular-nums">
                        index.html · #/
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopyLink('home', '#/')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200/80 rounded-md transition-colors cursor-pointer"
                      >
                        {copiedId === 'home' ? (
                          <Check className="w-3.5 h-3.5 text-blue-900" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedId === 'home' ? 'Скопировано' : 'Ссылка'}</span>
                      </button>
                    </div>
                  </div>

                  {articles.map((article) => (
                    <div
                      key={article.id}
                      className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-zinc-950 truncate">
                          {article.issueIndex}. {article.title}
                        </div>
                        <div className="text-xs text-zinc-500 mt-0.5 tabular-nums">
                          {article.slug}.html · #/news/{article.id}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            handleCopyLink(article.id, `#/news/${article.id}`)
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200/80 rounded-md transition-colors cursor-pointer"
                        >
                          {copiedId === article.id ? (
                            <Check className="w-3.5 h-3.5 text-blue-900" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span>
                            {copiedId === article.id ? 'Скопировано' : 'Ссылка'}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onDownloadArticleHtml(article)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-800 border border-zinc-200 hover:border-zinc-300 rounded-md transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>HTML</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="border-t border-zinc-200 pt-5">
                <h3 className="text-sm font-semibold text-zinc-950 mb-2">
                  Как выложить скачанные файлы на сторонний сайт
                </h3>
                <ol className="text-xs sm:text-sm text-zinc-600 space-y-2 list-decimal list-inside leading-relaxed">
                  <li>
                    Отредактируйте название лицея и детали новостей во вкладке «Редактор текстов».
                  </li>
                  <li>
                    Нажмите «Скачать весь сайт», чтобы получить <code className="text-zinc-900">index.html</code> и три HTML-страницы новостей.
                  </li>
                  <li>
                    Загрузите папку с файлами на сайт лицея, в репозиторий GitHub Pages или перетащите в сервис Netlify Drop — ссылки между всеми страницами уже настроены.
                  </li>
                </ol>
              </section>
            </>
          ) : (
            <div className="space-y-6">
              {/* Portal Settings */}
              <section className="space-y-4 pb-6 border-b border-zinc-200">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-sm font-semibold text-zinc-950">
                    Шапка и данные лицея
                  </h3>
                  <button
                    type="button"
                    onClick={onResetAll}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-950 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Сбросить по умолчанию</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-xs font-medium text-zinc-600">
                      Название издания
                    </span>
                    <input
                      type="text"
                      value={settings.lyceumName}
                      onChange={(e) =>
                        onUpdateSettings({ ...settings, lyceumName: e.target.value })
                      }
                      className="mt-1 w-full px-3 py-2 text-sm border border-zinc-300 rounded-md focus:outline-2 focus:outline-blue-900"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-medium text-zinc-600">
                      Учебное заведение / Подпись
                    </span>
                    <input
                      type="text"
                      value={settings.city}
                      onChange={(e) =>
                        onUpdateSettings({ ...settings, city: e.target.value })
                      }
                      className="mt-1 w-full px-3 py-2 text-sm border border-zinc-300 rounded-md focus:outline-2 focus:outline-blue-900"
                    />
                  </label>
                </div>
              </section>

              {/* Select which of the 3 articles to edit */}
              <section className="space-y-4">
                <div>
                  <span className="text-xs font-medium text-zinc-600 block mb-2">
                    Выберите новостную страницу для правки
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {articles.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedArticleId(item.id)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                          selectedArticleId === item.id
                            ? 'bg-blue-900 text-white'
                            : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                        }`}
                      >
                        {item.issueIndex}. {item.shortNavLabel}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="block">
                  <span className="text-xs font-medium text-zinc-600">Заголовок новости</span>
                  <input
                    type="text"
                    value={activeArticle.title}
                    onChange={(e) =>
                      onUpdateArticle({ ...activeArticle, title: e.target.value })
                    }
                    className="mt-1 w-full px-3 py-2 text-sm border border-zinc-300 rounded-md focus:outline-2 focus:outline-blue-900"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-medium text-zinc-600">Лид-аннотация</span>
                  <textarea
                    rows={2}
                    value={activeArticle.subtitle}
                    onChange={(e) =>
                      onUpdateArticle({ ...activeArticle, subtitle: e.target.value })
                    }
                    className="mt-1 w-full px-3 py-2 text-sm border border-zinc-300 rounded-md focus:outline-2 focus:outline-blue-900"
                  />
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-xs font-medium text-zinc-600">Дата публикации</span>
                    <input
                      type="text"
                      value={activeArticle.date}
                      onChange={(e) =>
                        onUpdateArticle({ ...activeArticle, date: e.target.value })
                      }
                      className="mt-1 w-full px-3 py-2 text-sm border border-zinc-300 rounded-md focus:outline-2 focus:outline-blue-900"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-medium text-zinc-600">Автор / Отдел</span>
                    <input
                      type="text"
                      value={activeArticle.author}
                      onChange={(e) =>
                        onUpdateArticle({ ...activeArticle, author: e.target.value })
                      }
                      className="mt-1 w-full px-3 py-2 text-sm border border-zinc-300 rounded-md focus:outline-2 focus:outline-blue-900"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="text-xs font-medium text-zinc-600">
                    Текст статьи (абзацы разделяются пустой строкой)
                  </span>
                  <textarea
                    rows={8}
                    value={activeArticle.paragraphs.join('\n\n')}
                    onChange={(e) =>
                      onUpdateArticle({
                        ...activeArticle,
                        paragraphs: e.target.value
                          .split(/\n\s*\n/)
                          .map((p) => p.trim())
                          .filter(Boolean),
                      })
                    }
                    className="mt-1 w-full px-3 py-2 text-sm border border-zinc-300 rounded-md leading-relaxed focus:outline-2 focus:outline-blue-900"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-medium text-zinc-600">Цитата номера</span>
                  <textarea
                    rows={2}
                    value={activeArticle.pullQuote.text}
                    onChange={(e) =>
                      onUpdateArticle({
                        ...activeArticle,
                        pullQuote: { ...activeArticle.pullQuote, text: e.target.value },
                      })
                    }
                    className="mt-1 w-full px-3 py-2 text-sm border border-zinc-300 rounded-md focus:outline-2 focus:outline-blue-900"
                  />
                </label>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
