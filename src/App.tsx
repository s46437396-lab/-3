import { useEffect, useState } from 'react';
import { ArticlePage } from './components/ArticlePage';
import { HomePage } from './components/HomePage';
import { PublishDrawer } from './components/PublishDrawer';
import { TopBar } from './components/TopBar';
import { DEFAULT_LYCEUM_SETTINGS, INITIAL_ARTICLES } from './data/articles';
import { ArticleId, LyceumSettings, NewsArticle, PageRoute } from './types/news';
import {
  buildStandaloneArticleHtml,
  buildStandaloneIndexHtml,
  triggerFileDownload,
} from './utils/htmlExporter';

const STORAGE_ARTICLES_KEY = 'lyceum_news_articles_v1';
const STORAGE_SETTINGS_KEY = 'lyceum_news_settings_v1';

function parseHashRoute(hash: string): PageRoute {
  if (hash === '#/news/inspection') return 'inspection';
  if (hash === '#/news/english-decade') return 'english-decade';
  if (hash === '#/news/incident') return 'incident';
  return 'home';
}

export default function App() {
  const [route, setRoute] = useState<PageRoute>(() =>
    parseHashRoute(window.location.hash)
  );

  const [articles, setArticles] = useState<NewsArticle[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ARTICLES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as NewsArticle[];
        if (Array.isArray(parsed) && parsed.length === 3) {
          return parsed;
        }
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_ARTICLES;
  });

  const [settings, setSettings] = useState<LyceumSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SETTINGS_KEY);
      if (saved) {
        return JSON.parse(saved) as LyceumSettings;
      }
    } catch {
      // ignore storage errors
    }
    return DEFAULT_LYCEUM_SETTINGS;
  });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<'publish' | 'editor'>('publish');
  const [drawerArticleId, setDrawerArticleId] = useState<ArticleId>('inspection');

  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseHashRoute(window.location.hash));
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ARTICLES_KEY, JSON.stringify(articles));
    } catch {
      // ignore storage errors
    }
  }, [articles]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // ignore storage errors
    }
  }, [settings]);

  const handleNavigate = (nextRoute: PageRoute) => {
    setRoute(nextRoute);
    const nextHash = nextRoute === 'home' ? '#/' : `#/news/${nextRoute}`;
    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleDownloadArticleHtml = (article: NewsArticle) => {
    const html = buildStandaloneArticleHtml(article, settings, articles);
    triggerFileDownload(`${article.slug}.html`, html);
  };

  const handleDownloadAllHtml = () => {
    const indexHtml = buildStandaloneIndexHtml(articles, settings);
    triggerFileDownload('index.html', indexHtml);
    articles.forEach((article, idx) => {
      setTimeout(() => {
        const html = buildStandaloneArticleHtml(article, settings, articles);
        triggerFileDownload(`${article.slug}.html`, html);
      }, (idx + 1) * 180);
    });
  };

  const handleUpdateArticle = (updated: NewsArticle) => {
    setArticles((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  };

  const handleResetAll = () => {
    setArticles(INITIAL_ARTICLES);
    setSettings(DEFAULT_LYCEUM_SETTINGS);
  };

  const openPublishDrawer = () => {
    setDrawerTab('publish');
    setDrawerOpen(true);
  };

  const openEditorForArticle = (articleId: ArticleId) => {
    setDrawerArticleId(articleId);
    setDrawerTab('editor');
    setDrawerOpen(true);
  };

  const activeArticle =
    route !== 'home' ? articles.find((a) => a.id === route) : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-white text-zinc-950">
      <TopBar
        brandName={settings.lyceumName}
        currentRoute={route}
        articles={articles}
        onNavigate={handleNavigate}
        onOpenPublish={openPublishDrawer}
      />

      <div className="flex-1">
        {activeArticle ? (
          <ArticlePage
            article={activeArticle}
            allArticles={articles}
            onNavigate={handleNavigate}
            onDownloadHtml={handleDownloadArticleHtml}
            onEditArticle={openEditorForArticle}
          />
        ) : (
          <HomePage
            settings={settings}
            articles={articles}
            onNavigate={handleNavigate}
            onDownloadHtml={handleDownloadArticleHtml}
            onOpenPublish={openPublishDrawer}
          />
        )}
      </div>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-zinc-200 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            <span className="font-semibold text-zinc-800">{settings.lyceumName}</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>{settings.city}</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span className="tabular-nums">{settings.issueNumber}</span>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={() => handleNavigate('home')}
              className="hover:text-zinc-950 transition-colors cursor-pointer"
            >
              Главная
            </button>
            {articles.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.id)}
                className="hover:text-zinc-950 transition-colors cursor-pointer"
              >
                {item.shortNavLabel}
              </button>
            ))}
          </div>
        </div>
      </footer>

      <PublishDrawer
        key={`${drawerOpen}-${drawerTab}-${drawerArticleId}`}
        isOpen={drawerOpen}
        initialTab={drawerTab}
        initialArticleId={drawerArticleId}
        settings={settings}
        articles={articles}
        onClose={() => setDrawerOpen(false)}
        onUpdateSettings={setSettings}
        onUpdateArticle={handleUpdateArticle}
        onResetAll={handleResetAll}
        onDownloadArticleHtml={handleDownloadArticleHtml}
        onDownloadAllHtml={handleDownloadAllHtml}
      />
    </div>
  );
}
