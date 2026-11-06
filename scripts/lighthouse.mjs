#!/usr/bin/env node
// SPDX-FileCopyrightText: 2026 Nubian Ibex and IbexWall contributors -->
// SPDX-License-Identifier: GPL-3.0-or-later
//
// Lighthouse on the built site, for the pages that carry the most weight.
//   pnpm build && node scripts/lighthouse.mjs
import { spawn } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as lh from 'lighthouse';

const site = dirname(fileURLToPath(import.meta.url)).replace('/scripts', '');
const port = 4322;
const pages = process.argv.slice(2).length ? process.argv.slice(2) : ['/', '/hardening/', '/hardening/kernel.kptr-restrict/', '/articles/', '/articles/how-secure-is-my-linux-computer/', '/download/'];

const server = spawn('pnpm', ['exec', 'astro', 'preview', '--host', '127.0.0.1', `--port`, String(port), '--strictPort'], {
  cwd: site,
  stdio: 'ignore',
});
process.on('exit', () => server.kill());
async function waitUp() {
  for (let i = 0; i < 60; i += 1) {
    try {
      if ((await fetch(`http://127.0.0.1:${port}/`)).ok) return;
    } catch {
      /* not yet */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error('the preview server did not start');
}
await waitUp();
const { launch } = await import('chrome-launcher');
const chrome = await launch({
  chromePath: process.env.CHROME_PATH, chromeFlags: ['--headless', '--no-sandbox'] });
let worst = { score: 1 };
for (const page of pages) {
  const result = await lh.default(`http://127.0.0.1:${port}${page}`, { port: chrome.port, output: 'json', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] });
  const row = Object.entries(result.lhr.categories).map(([name, c]) => `${name} ${Math.round(c.score * 100)}`);
  const scores = Object.values(result.lhr.categories).map((c) => c.score);
  const min = Math.min(...scores);
  console.log(`${page}: ${row.join(', ')}`);
  if (min < worst.score) worst = { score: min, page };
}
await chrome.kill();
server.kill();
console.log(`worst: ${Math.round(worst.score * 100)} on ${worst.page}`);
process.exit(worst.score < 0.9 ? 1 : 0);
