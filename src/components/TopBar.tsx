import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NewsArticle, PageRoute } from '../types/news';

interface TopBarProps {
  brandName: string;
  currentRoute: PageRoute;
  articles: NewsArticle[];
  onNavigate: (route: PageRoute) => void;
  onOpenPublish: () => void;
}

export function TopBar({
  brandName,
  currentRoute,
  articles,
  onNavigate,
  onOpenPublish,
}: TopBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSelectRoute = (route: PageRoute) => {
    onNavigate(route);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element Brand Wordmark */}
        <a
          href="#/"
          onClick={(e) => {
            e.preventDefault();
            handleSelectRoute('home');
          }}
          className="font-serif text-xl font-bold tracking-tight text-zinc-950 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-900"
        >
          {brandName}
        </a>

        {/* Zone 2: 4 concise single-line navigation links */}
        <nav
          aria-label="Основная навигация"
          className="hidden lg:flex items-center gap-7 text-sm font-medium"
        >
          <button
            type="button"
            onClick={() => handleSelectRoute('home')}
            className={`py-1 whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer border-b-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-900 ${
              currentRoute === 'home'
                ? 'border-blue-900 text-zinc-950'
                : 'border-transparent text-zinc-600 hover:text-zinc-950 hover:border-zinc-300'
            }`}
          >
            Главная
          </button>
          {articles.map((article) => {
            const isActive = currentRoute === article.id;
            return (
              <button
                key={article.id}
                type="button"
                onClick={() => handleSelectRoute(article.id)}
                className={`py-1 whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer border-b-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-900 ${
                  isActive
                    ? 'border-blue-900 text-zinc-950'
                    : 'border-transparent text-zinc-600 hover:text-zinc-950 hover:border-zinc-300'
                }`}
              >
                {article.shortNavLabel}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenPublish}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-900"
          >
            Публикация и HTML
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={mobileMenuOpen}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 rounded-md transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-zinc-200 bg-white px-4 py-4 space-y-2">
          <button
            type="button"
            onClick={() => handleSelectRoute('home')}
            className={`w-full text-left px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
              currentRoute === 'home'
                ? 'bg-zinc-100 text-zinc-950'
                : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950'
            }`}
          >
            Главная
          </button>
          {articles.map((article) => (
            <button
              key={article.id}
              type="button"
              onClick={() => handleSelectRoute(article.id)}
              className={`w-full text-left px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                currentRoute === article.id
                  ? 'bg-zinc-100 text-zinc-950'
                  : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950'
              }`}
            >
              {article.shortNavLabel}
            </button>
          ))}
          <div className="pt-2 border-t border-zinc-200">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPublish();
              }}
              className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-md transition-colors"
            >
              Публикация и HTML
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
