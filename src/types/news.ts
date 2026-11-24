export type ArticleId = 'inspection' | 'english-decade' | 'incident';

export type PageRoute = 'home' | ArticleId;

export interface KeyFact {
  label: string;
  value: string;
}

export interface MarginNote {
  title: string;
  text: string;
}

export interface NewsArticle {
  id: ArticleId;
  slug: string;
  shortNavLabel: string;
  issueIndex: string;
  category: string;
  title: string;
  subtitle: string;
  date: string;
  readTime: string;
  author: string;
  authorRole: string;
  imageUrl: string;
  imageAlt: string;
  imageCaption: string;
  paragraphs: string[];
  pullQuote: {
    text: string;
    attribution: string;
  };
  keyFacts: KeyFact[];
  marginNotes: MarginNote[];
}

export interface LyceumSettings {
  lyceumName: string;
  city: string;
  issueNumber: string;
}
