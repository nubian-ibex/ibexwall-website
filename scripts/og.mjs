#!/usr/bin/env node
// SPDX-FileCopyrightText: 2026 Nubian Ibex and IbexWall contributors
// SPDX-License-Identifier: GPL-3.0-or-later
//
// Draws the 1200x630 image shown when a page is shared (public/og.png) from the
// logo and the product line. Uses the browser tooling of the app repository
// (ui/node_modules), found next to this one or at IBEXWALL_APP.
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const site = join(here, '..');
const app = process.env.IBEXWALL_APP ?? join(site, '..', 'ibexwall');
const { chromium } = createRequire(join(app, 'ui/package.json'))('@playwright/test');
const logo = readFileSync(join(site, 'public/logo.png')).toString('base64');
const shot = readFileSync(join(site, 'public/shots/en/overview.png')).toString('base64');

const html = `<!doctype html><meta charset="utf-8"><style>
  body{margin:0;width:1200px;height:630px;background:#0e1412;color:#e6ede9;font:600 28px 'IBM Plex Sans',system-ui,sans-serif;display:flex;overflow:hidden}
  .l{padding:64px 0 64px 72px;width:560px;display:flex;flex-direction:column;justify-content:space-between}
  .brand{display:flex;align-items:center;gap:18px;font-size:34px;font-weight:700}
  .brand img{width:64px;height:64px}
  h1{font-size:54px;line-height:1.12;margin:0;font-weight:700;letter-spacing:-.01em}
  p{margin:18px 0 0;font-size:26px;font-weight:400;color:#9aa8a1}
  .r{position:relative;flex:1}
  .r img{position:absolute;left:30px;top:90px;width:820px;border-radius:18px;border:1px solid #34413b;box-shadow:0 30px 80px #000a}
  .tag{color:#6bcb9f;font-size:24px;font-weight:600}
</style>
<div class="l"><div class="brand"><img src="data:image/png;base64,${logo}">IbexWall</div>
<div><h1>See how secure your Linux is. Fix it with changes you can undo.</h1><p>Free, open source, no telemetry.</p></div>
<div class="tag">ibexwall.com</div></div>
<div class="r"><img src="data:image/png;base64,${shot}"></div>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.waitForTimeout(300);
await page.screenshot({ path: join(site, 'public/og.png') });
await browser.close();
console.log('wrote public/og.png');
