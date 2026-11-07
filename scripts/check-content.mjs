#!/usr/bin/env node
// SPDX-FileCopyrightText: 2026 Nubian Ibex and IbexWall contributors
// SPDX-License-Identifier: GPL-3.0-or-later
//
// Checks the website's content against the English source: the interface
// strings, the hardening explanations, the pages and the articles. A language
// may be partly translated (the site then shows the English page and says so),
// but what exists must be complete and well formed.
//
//   node scripts/check-content.mjs [locale ...]   (default: every language)
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const site = dirname(fileURLToPath(import.meta.url)).replace('/scripts', '');
const locales = process.argv.length > 2 ? process.argv.slice(2) : readdirSync(join(site, 'content/articles'));
const problems = [];
const say = (message) => problems.push(message);

const keys = (object, label) => {
  if (!existsSync(label)) return null;
  try {
    return JSON.parse(readFileSync(label, 'utf8'));
  } catch (error) {
    say(`${label}: not valid JSON: ${error.message}`);
    return null;
  }
};

const englishUi = keys(null, join(site, 'src/i18n/ui/en.json'));
const englishHardening = keys(null, join(site, 'content/hardening/en.json'));
const catalog = JSON.parse(readFileSync(join(site, 'data/hardening.json'), 'utf8'));
const ids = new Set(catalog.items.map((i) => i.id));
const englishArticles = readdirSync(join(site, 'content/articles/en')).map((f) => f.replace(/\.md$/, ''));
const pages = readdirSync(join(site, 'content/pages/en')).map((f) => f.replace(/\.md$/, ''));

/** Reads frontmatter of a markdown file as key to single-line value. */
function frontmatter(file) {
  const text = readFileSync(file, 'utf8');
  const end = text.indexOf('\n---\n', 4);
  const head = text.slice(4, end < 0 ? undefined : end);
  const out = {};
  for (const line of head.split('\n')) {
    const m = /^([a-z_]+):\s*"?(.+?)"?$/.exec(line);
    if (m) out[m[1]] = m[2];
  }
  return { head: out, body: text.slice(end + 5) };
}

for (const locale of locales) {
  if (locale === 'en') continue;
  // The interface strings: all or nothing (the page template needs them all).
  const ui = keys(null, join(site, `src/i18n/ui/${locale}.json`));
  if (ui === null) say(`src/i18n/ui/${locale}.json is missing`);
  else {
    const missing = Object.keys(englishUi).filter((k) => !(k in ui));
    const extra = Object.keys(ui).filter((k) => !(k in englishUi));
    if (missing.length) say(`ui/${locale}: missing ${missing.slice(0, 6).join(', ')}`);
    if (extra.length) say(`ui/${locale}: not in English: ${extra.slice(0, 6).join(', ')}`);
  }
  // The hardening explanations: what exists must cover every item.
  const hardening = keys(null, join(site, `content/hardening/${locale}.json`));
  if (hardening) {
    const missing = [...ids].filter((id) => !(id in hardening));
    if (missing.length) say(`hardening/${locale}.json: missing ${missing.length} of ${ids.size} items (the site falls back to English for those)`);
    for (const [id, item] of Object.entries(hardening)) {
      for (const field of ['why', 'how', 'who', 'notice']) {
        if (!item[field] || item[field].length < 40) say(`hardening/${locale}: ${id}: ${field} is too short`);
      }
      if (!Array.isArray(item.related) || item.related.some((r) => !ids.has(r))) say(`hardening/${locale}: ${id}: related ids must exist`);
      if (!Array.isArray(item.keywords) || item.keywords.length < 3) say(`hardening/${locale}: ${id}: keywords`);
    }
  }
  // Pages and articles: what exists must be whole (frontmatter, links, no dashes).
  for (const dir of ['pages', 'articles']) {
    const folder = join(site, `content/${dir}`, locale);
    if (!existsSync(folder)) continue;
    const wanted = dir === 'pages' ? pages : englishArticles;
    for (const file of readdirSync(folder)) {
      const slug = file.replace(/\.md$/, '');
      if (!wanted.includes(slug)) say(`${dir}/${locale}: ${file} has no English source`);
      const path = join(folder, file);
      const { head, body } = frontmatter(path);
      if (!head.title || !head.description) say(`${path}: frontmatter needs title and description`);
      const prefix = { 'pt-BR': '/pt-br', es: '/es', fr: '/fr', de: '/de' }[locale];
      for (const match of body.matchAll(/\]\((\/[^)#\s]*)/g)) {
        const link = match[1];
        if (link.startsWith('/pt-br/') || link.startsWith('/es/') || link.startsWith('/fr/') || link.startsWith('/de/')) {
          if (!link.startsWith(prefix)) say(`${path}: link ${link} points at another language`);
        }
      }
      if (dir === 'articles' && head.slug && head.slug !== slug) say(`${path}: slug must stay ${slug}`);
    }
  }
}

// Both sites: no em or en dashes anywhere the person reads.
for (const dir of ['src/i18n/ui', 'content/pages', 'content/articles', 'content/hardening']) {
  for (const file of readdirSync(join(site, dir), { withFileTypes: true, recursive: true })) {
    if (!file.isFile() || !/\.(json|md)$/.test(file.name)) continue;
    const text = readFileSync(join(file.parentPath, file.name), 'utf8');
    const line = text.split('\n').findIndex((l) => l.includes('\u2014') || l.includes('\u2013'));
    if (line >= 0) say(`${join(file.parentPath, file.name)}:${line + 1}: an em or en dash`);
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  console.error(`\n${problems.length} problem(s)`);
  process.exit(1);
}
console.log(`ok: ${locales.join(', ')}`);
