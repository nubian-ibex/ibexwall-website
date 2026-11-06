// SPDX-FileCopyrightText: 2026 Nubian Ibex and IbexWall contributors
// SPDX-License-Identifier: GPL-3.0-or-later

import { LOCALES, type Locale } from './locales';

const files = import.meta.glob('./ui/*.json', { eager: true, import: 'default' }) as Record<
  string,
  Record<string, string>
>;

const tables = {} as Record<Locale, Record<string, string>>;
for (const locale of LOCALES) tables[locale] = files[`./ui/${locale}.json`] ?? {};

/** A string of the interface in a language, or the English one, or the key. */
export function t(locale: Locale, key: string, vars: Record<string, string | number> = {}): string {
  let text = tables[locale][key] ?? tables.en[key] ?? key;
  for (const [name, value] of Object.entries(vars)) text = text.replaceAll(`{${name}}`, String(value));
  return text;
}

export function has(locale: Locale, key: string): boolean {
  return key in tables[locale];
}
