// SPDX-FileCopyrightText: 2026 Nubian Ibex and IbexWall contributors
// SPDX-License-Identifier: GPL-3.0-or-later

/** The languages of the site, the same five as the app. English is the source. */
export const LOCALES = ['en', 'pt-BR', 'es', 'fr', 'de'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

/** Each language in itself, for the switcher. */
export const NAMES: Record<Locale, string> = {
  en: 'English',
  'pt-BR': 'Português (Brasil)',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
};

/** The folder of each language in the address; English is at the root. */
export const PREFIX: Record<Locale, string> = {
  en: '',
  'pt-BR': 'pt-br',
  es: 'es',
  fr: 'fr',
  de: 'de',
};

export const SITE = 'https://ibexwall.com';
export const DOCS = 'https://docs.ibexwall.com';
/** The documentation of amivuln, served from this site by `functions/amivuln`. */
export const AMIVULN = '/amivuln/';
export const REPO = 'https://github.com/nubian-ibex/ibexwall';

/** `/pt-br/hardening/` for ('pt-BR', 'hardening'); `/` for ('en', ''). */
export function href(locale: Locale, path = ''): string {
  const parts = [PREFIX[locale], path.replace(/^\/+|\/+$/g, '')].filter(Boolean);
  return `/${parts.join('/')}${parts.length ? '/' : ''}`;
}
