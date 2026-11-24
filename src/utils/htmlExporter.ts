import { LyceumSettings, NewsArticle } from '../types/news';

function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function buildStandaloneArticleHtml(
  article: NewsArticle,
  settings: LyceumSettings,
  allArticles: NewsArticle[]
): string {
  const otherLinks = allArticles
    .filter((item) => item.id !== article.id)
    .map(
      (item) =>
        `<a href="${escapeHtml(item.slug)}.html" class="nav-link">${escapeHtml(item.shortNavLabel)}</a>`
    )
    .join('\n          ');

  const paragraphsHtml = article.paragraphs
    .map((paragraph, idx) => {
      const cls = idx === 0 ? 'lead-paragraph' : '';
      return `<p class="${cls}">${escapeHtml(paragraph)}</p>`;
    })
    .join('\n          ');

  const factsHtml = article.keyFacts
    .map(
      (fact) => `
          <div class="fact-row">
            <dt>${escapeHtml(fact.label)}</dt>
            <dd>${escapeHtml(fact.value)}</dd>
          </div>`
    )
    .join('');

  const notesHtml = article.marginNotes
    .map(
      (note) => `
          <div class="note-item">
            <h4>${escapeHtml(note.title)}</h4>
            <p>${escapeHtml(note.text)}</p>
          </div>`
    )
    .join('');

  return `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(article.title)} — ${escapeHtml(settings.lyceumName)}</title>
    <meta name="description" content="${escapeHtml(article.subtitle)}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&display=swap" rel="stylesheet" />
    <style>
      :root {
        --bg: #ffffff;
        --surface: #f4f4f5;
        --border: #e4e4e7;
        --ink: #09090b;
        --muted: #52525b;
        --accent: #1e3a8a;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: "Manrope", system-ui, sans-serif;
        color: var(--ink);
        background: var(--bg);
        line-height: 1.7;
      }
      header {
        border-bottom: 1px solid var(--border);
        padding: 18px 24px;
      }
      .header-inner {
        max-width: 1120px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
        flex-wrap: wrap;
      }
      .brand {
        font-family: "Playfair Display", Georgia, serif;
        font-size: 20px;
        font-weight: 700;
        color: var(--ink);
        text-decoration: none;
      }
      nav {
        display: flex;
        gap: 24px;
        flex-wrap: wrap;
      }
      .nav-link {
        color: var(--muted);
        text-decoration: none;
        font-size: 14px;
        font-weight: 500;
      }
      .nav-link:hover { color: var(--ink); text-decoration: underline; }
      main {
        max-width: 1120px;
        margin: 0 auto;
        padding: 48px 24px 80px;
      }
      .meta {
        font-size: 13px;
        color: var(--muted);
        margin-bottom: 16px;
      }
      h1 {
        font-family: "Playfair Display", Georgia, serif;
        font-size: clamp(2rem, 4vw, 3.25rem);
        line-height: 1.15;
        margin: 0 0 18px;
        max-width: 820px;
      }
      .subtitle {
        font-size: 18px;
        color: var(--muted);
        max-width: 740px;
        margin: 0 0 32px;
      }
      figure { margin: 0 0 40px; }
      figure img {
        width: 100%;
        aspect-ratio: 16 / 9;
        object-fit: cover;
        display: block;
        border: 1px solid var(--border);
      }
      figcaption {
        font-family: "Playfair Display", Georgia, serif;
        font-style: italic;
        font-size: 13px;
        color: var(--muted);
        margin-top: 10px;
      }
      .grid {
        display: grid;
        grid-template-columns: minmax(0, 2fr) minmax(260px, 1fr);
        gap: 48px;
        align-items: start;
      }
      .prose p {
        margin: 0 0 22px;
        font-size: 16px;
      }
      .lead-paragraph::first-letter {
        font-family: "Playfair Display", Georgia, serif;
        font-size: 3.2rem;
        font-weight: 700;
        float: left;
        line-height: 0.9;
        margin: 4px 12px 0 0;
      }
      blockquote {
        margin: 36px 0;
        padding: 24px 0;
        border-top: 1px solid var(--border);
        border-bottom: 1px solid var(--border);
        font-family: "Playfair Display", Georgia, serif;
        font-style: italic;
        font-size: 24px;
        line-height: 1.4;
      }
      blockquote footer {
        font-family: "Manrope", sans-serif;
        font-style: normal;
        font-size: 13px;
        color: var(--muted);
        margin-top: 12px;
      }
      aside {
        background: var(--surface);
        border: 1px solid var(--border);
        padding: 24px;
      }
      aside h3 {
        margin: 0 0 16px;
        font-size: 14px;
        font-weight: 600;
        color: var(--accent);
      }
      dl { margin: 0 0 24px; }
      .fact-row {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        padding: 10px 0;
        border-bottom: 1px solid var(--border);
        font-size: 13px;
      }
      .fact-row dt { color: var(--muted); }
      .fact-row dd { margin: 0; font-weight: 600; text-align: right; }
      .note-item { margin-top: 18px; }
      .note-item h4 { margin: 0 0 4px; font-size: 13px; font-weight: 600; }
      .note-item p { margin: 0; font-size: 13px; color: var(--muted); }
      .site-footer {
        border-top: 1px solid var(--border);
        padding: 24px;
        font-size: 13px;
        color: var(--muted);
        text-align: center;
      }
      @media (max-width: 860px) {
        .grid { grid-template-columns: 1fr; }
      }
    </style>
  </head>
  <body>
    <header>
      <div class="header-inner">
        <a href="index.html" class="brand">${escapeHtml(settings.lyceumName)}</a>
        <nav>
          <a href="index.html" class="nav-link">Главная</a>
          ${otherLinks}
        </nav>
      </div>
    </header>
    <main>
      <div class="meta">
        <span>${escapeHtml(article.category)}</span>
        <span> · </span>
        <span>${escapeHtml(article.date)}</span>
        <span> · </span>
        <span>${escapeHtml(article.author)}</span>
        <span> · </span>
        <span>${escapeHtml(article.readTime)}</span>
      </div>
      <h1>${escapeHtml(article.title)}</h1>
      <p class="subtitle">${escapeHtml(article.subtitle)}</p>
      <figure>
        <img src="${escapeHtml(article.imageUrl)}" alt="${escapeHtml(article.imageAlt)}" />
        <figcaption>${escapeHtml(article.imageCaption)}</figcaption>
      </figure>
      <div class="grid">
        <article class="prose">
          ${paragraphsHtml}
          <blockquote>
            «${escapeHtml(article.pullQuote.text)}»
            <footer>— ${escapeHtml(article.pullQuote.attribution)}</footer>
          </blockquote>
        </article>
        <aside>
          <h3>Ключевые факты</h3>
          <dl>
            ${factsHtml}
          </dl>
          ${notesHtml}
        </aside>
      </div>
    </main>
    <footer class="site-footer">
      ${escapeHtml(settings.lyceumName)} · ${escapeHtml(settings.city)} · ${escapeHtml(settings.issueNumber)}
    </footer>
  </body>
</html>`;
}

export function buildStandaloneIndexHtml(
  articles: NewsArticle[],
  settings: LyceumSettings
): string {
  const cardsHtml = articles
    .map(
      (article) => `
        <article class="card">
          <div class="meta">
            <span>${escapeHtml(article.issueIndex)}. ${escapeHtml(article.category)}</span>
            <span> · </span>
            <span>${escapeHtml(article.date)}</span>
          </div>
          <h2><a href="${escapeHtml(article.slug)}.html">${escapeHtml(article.title)}</a></h2>
          <p>${escapeHtml(article.subtitle)}</p>
          <a class="read-more" href="${escapeHtml(article.slug)}.html">Читать материал</a>
        </article>`
    )
    .join('\n');

  return `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(settings.lyceumName)} — Главная</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />
    <style>
      body { margin: 0; font-family: "Manrope", sans-serif; color: #09090b; background: #fff; line-height: 1.65; }
      header { border-bottom: 1px solid #e4e4e7; padding: 20px 24px; }
      .wrap { max-width: 1080px; margin: 0 auto; }
      .brand { font-family: "Playfair Display", serif; font-size: 24px; font-weight: 700; }
      main { padding: 48px 24px 80px; }
      .kicker { font-size: 13px; color: #52525b; margin-bottom: 10px; }
      h1 { font-family: "Playfair Display", serif; font-size: clamp(2rem, 4vw, 3.25rem); margin: 0 0 36px; }
      .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
      .card { border: 1px solid #e4e4e7; padding: 24px; background: #fafafa; }
      .meta { font-size: 12px; color: #52525b; margin-bottom: 10px; }
      .card h2 { font-family: "Playfair Display", serif; font-size: 22px; line-height: 1.25; margin: 0 0 12px; }
      .card h2 a { color: inherit; text-decoration: none; }
      .card h2 a:hover { color: #1e3a8a; }
      .card p { font-size: 14px; color: #52525b; margin: 0 0 18px; }
      .read-more { font-size: 13px; font-weight: 600; color: #1e3a8a; text-decoration: none; }
    </style>
  </head>
  <body>
    <header><div class="wrap"><div class="brand">${escapeHtml(settings.lyceumName)}</div></div></header>
    <main class="wrap">
      <div class="kicker">${escapeHtml(settings.city)} · ${escapeHtml(settings.issueNumber)}</div>
      <h1>Новости нашего лицея</h1>
      <div class="grid">${cardsHtml}</div>
    </main>
  </body>
</html>`;
}

export function triggerFileDownload(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
