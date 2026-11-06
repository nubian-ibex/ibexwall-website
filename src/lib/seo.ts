// SPDX-FileCopyrightText: 2026 Nubian Ibex and IbexWall contributors
// SPDX-License-Identifier: GPL-3.0-or-later

import { DOCS, href, LOCALES, PREFIX, REPO, SITE, type Locale } from '../i18n/locales';

/** The absolute address of a page in a language. */
export function url(locale: Locale, path = ''): string {
  return `${SITE}${href(locale, path)}`;
}

/** hreflang alternates for the languages a page exists in. */
export function alternates(path: string, available: readonly Locale[] = LOCALES) {
  const links = available.map((l) => ({ hreflang: l === 'pt-BR' ? 'pt-BR' : l, href: url(l, path) }));
  return [...links, { hreflang: 'x-default', href: url('en', path) }];
}

export const organization = {
  '@type': 'Organization',
  name: 'IbexWall',
  url: SITE,
  logo: `${SITE}/logo.png`,
  sameAs: [REPO, DOCS],
};

export function jsonLd(...graph: object[]): string {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
}

export { PREFIX };
