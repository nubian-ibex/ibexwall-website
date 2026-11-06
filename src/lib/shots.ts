// SPDX-FileCopyrightText: 2026 Nubian Ibex and IbexWall contributors
// SPDX-License-Identifier: GPL-3.0-or-later

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { Locale } from '../i18n/locales';

/** A screenshot of the app in the page's language, or the English one. */
export function shot(locale: Locale, name: string): string {
  const own = join(process.cwd(), 'public/shots', locale, `${name}.png`);
  return existsSync(own) ? `/shots/${locale}/${name}.png` : `/shots/en/${name}.png`;
}
