// SPDX-FileCopyrightText: 2026 Nubian Ibex and IbexWall contributors
// SPDX-License-Identifier: GPL-3.0-or-later

import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
import catalogFile from '../../data/hardening.json';
import groupsFile from '../../data/module-groups.json';
import { DEFAULT_LOCALE, LOCALES, type Locale } from '../i18n/locales';

// The hardening catalog, as the app has it.

export type Risk = 'low' | 'medium' | 'high';
export interface Source {
  name: string;
  url: string;
  section: string;
}
export interface Item {
  id: string;
  area: string;
  risk: Risk;
  recommended: boolean;
  title: Record<string, string>;
  summary: Record<string, string>;
  breaks: Record<string, string> | null;
  sources: Source[];
  probe:
    | { kind: 'sysctl'; keys: { key: string; want: string; at_least: boolean }[] }
    | { kind: 'modules'; group: string }
    | { kind: 'mount_option'; path: string; option: string };
  apply: { plugin: string; patch: Record<string, unknown> };
  doc: string;
}
export const CATALOG = catalogFile as unknown as { version: number; reviewed: string; items: Item[] };
export const MODULE_GROUPS = groupsFile as Record<string, { modules: string[]; command: string }>;

/** What the pages add to the catalog, per language. */
export interface Explain {
  why: string;
  how: string;
  who: string;
  notice: string;
  related: string[];
  keywords: string[];
}
const explainFiles = import.meta.glob('../../content/hardening/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, Record<string, Explain>>;

export function explanation(locale: Locale, id: string): Explain | undefined {
  return (
    explainFiles[`../../content/hardening/${locale}.json`]?.[id] ??
    explainFiles[`../../content/hardening/${DEFAULT_LOCALE}.json`]?.[id]
  );
}

export function said(text: Record<string, string>, locale: Locale): string {
  return text[locale] ?? text.en ?? '';
}

export const AREAS = ['kernel', 'network', 'filesystem', 'memory'] as const;

// Markdown pages and articles.

interface Page {
  frontmatter: Record<string, unknown>;
  Content: AstroComponentFactory;
}
const pageFiles = import.meta.glob('../../content/pages/*/*.md', { eager: true }) as Record<string, Page>;
const articleFiles = import.meta.glob('../../content/articles/*/*.md', { eager: true }) as Record<string, Page>;

export interface Article {
  slug: string;
  locale: Locale;
  title: string;
  description: string;
  date: string;
  updated: string;
  tags: string[];
  related: string[];
  faq: { q: string; a: string }[];
  Content: AstroComponentFactory;
}

function toArticle(path: string, page: Page): Article {
  const f = page.frontmatter as Record<string, any>;
  const locale = path.split('/').at(-2) as Locale;
  return {
    slug: String(f.slug),
    locale,
    title: String(f.title),
    description: String(f.description),
    date: String(f.date).slice(0, 10),
    updated: String(f.updated ?? f.date).slice(0, 10),
    tags: (f.tags ?? []) as string[],
    related: (f.related_hardening ?? []) as string[],
    faq: (f.faq ?? []) as { q: string; a: string }[],
    Content: page.Content,
  };
}

const allArticles = Object.entries(articleFiles).map(([p, page]) => toArticle(p, page));

/** The articles of a language; any article missing there is the English one. */
export function articles(locale: Locale): (Article & { translated: boolean })[] {
  const english = allArticles.filter((a) => a.locale === DEFAULT_LOCALE);
  return english
    .map((en) => {
      const own = allArticles.find((a) => a.locale === locale && a.slug === en.slug);
      return { ...(own ?? en), translated: Boolean(own) };
    })
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

export const PAGE_SLUGS = ['download', 'security', 'privacy', 'about'] as const;
export interface SitePage {
  slug: string;
  title: string;
  description: string;
  updated: string;
  Content: AstroComponentFactory;
  translated: boolean;
}
export function sitePage(locale: Locale, slug: string): SitePage | undefined {
  const find = (l: Locale) => Object.entries(pageFiles).find(([p]) => p.endsWith(`/pages/${l}/${slug}.md`))?.[1];
  const own = find(locale);
  const page = own ?? find(DEFAULT_LOCALE);
  if (!page) return undefined;
  const f = page.frontmatter as Record<string, any>;
  return {
    slug,
    title: String(f.title),
    description: String(f.description),
    updated: String(f.updated ?? '').slice(0, 10),
    Content: page.Content,
    translated: Boolean(own),
  };
}

export const ALL_LOCALES = LOCALES;
