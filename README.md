<!-- SPDX-FileCopyrightText: 2026 Nubian Ibex and IbexWall contributors -->
<!-- SPDX-License-Identifier: GPL-3.0-or-later

# ibexwall-website

The IbexWall website, <https://ibexwall.com>: the landing page, one page for
each hardening setting, guides that answer what people search for, and the
download, security, privacy and about pages. In English, Portuguese (Brazil),
Spanish, French and German; a page that is not translated yet shows the English
text and says so.

The site is built with [Astro](https://astro.build) and has no scripts and no
third-party requests: the fonts and images are served from the same address as
the pages, and there are no cookies and no analytics.

## Build

```sh
pnpm install
pnpm build     # syncs data from the app repository, then builds into dist/
pnpm preview   # serve the built site
```

`scripts/sync-from-app.mjs` copies the hardening catalog and the kernel module
groups from the app repository (found next to this one, or at `IBEXWALL_APP`),
so a page and the setting it describes cannot drift apart. Commit the result:
CI regenerates and fails if the committed files differ.

## Structure

- `src/views/` and `src/pages/`: the pages. One route builds every language.
- `src/i18n/ui/*.json`: the fixed interface text, per language.
- `content/articles/<locale>/`: the guides.
- `content/pages/<locale>/`: download, security, privacy, about.
- `content/hardening/<locale>.json`: what each setting page adds to the catalog:
  why it matters, how it works, who should use it, what you may notice.
- `content/_brief/product-facts.md`: the facts everything here is written from.

## Checks

```sh
pnpm test          # content checks: keys, frontmatter, links, no em dashes
pnpm check         # types
pnpm lighthouse    # Lighthouse on the built site (needs a Chrome binary)
```

Screenshots of the app in every language are taken by the app repository's
`ui/scripts/screenshots.mjs` and stored under `public/shots/`.

## Translating

Translate the `content/` files of a language and `src/i18n/ui/<locale>.json`,
keeping the frontmatter keys and the internal link prefixes (`/pt-br/`, `/es/`,
`/fr/`, `/de/`). `node scripts/check-content.mjs <locale>` lists what is
missing or broken. The app's own guide is
[docs/translating.md](https://github.com/nubian-ibex/ibexwall/blob/main/docs/translating.md).
