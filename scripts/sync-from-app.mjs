#!/usr/bin/env node
// SPDX-FileCopyrightText: 2026 Nubian Ibex and IbexWall contributors
// SPDX-License-Identifier: GPL-3.0-or-later
//
// Copies from the app repository what the site is generated from, so a page
// and the setting it describes cannot drift apart: the hardening catalog and
// the kernel module groups the Modules plugin blocks. The app repository is
// found next to this one, or at IBEXWALL_APP.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const site = join(here, '..');
const app = process.env.IBEXWALL_APP ?? join(site, '..', 'ibexwall');
const catalogPath = join(app, 'catalog/hardening.json');

if (!existsSync(catalogPath)) {
  if (existsSync(join(site, 'data/hardening.json'))) {
    console.log('app repository not found; keeping the committed data/');
    process.exit(0);
  }
  console.error(`cannot find ${catalogPath}; set IBEXWALL_APP to the app repository`);
  process.exit(1);
}

mkdirSync(join(site, 'data'), { recursive: true });
const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));
writeFileSync(join(site, 'data/hardening.json'), JSON.stringify(catalog, null, 2) + '\n');

// The groups of kernel modules, read from the plugin's source.
const source = readFileSync(join(app, 'plugins/system.modules/src/main.rs'), 'utf8');
const groups = {};
for (const match of source.matchAll(/Group\s*\{\s*id:\s*"([^"]+)",\s*modules:\s*&\[([^\]]*)\],\s*command:\s*"([^"]+)"/g)) {
  const modules = [...match[2].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  groups[match[1]] = { modules, command: match[3] };
}
if (Object.keys(groups).length < 5) {
  console.error('could not read the module groups from the Modules plugin');
  process.exit(1);
}
writeFileSync(join(site, 'data/module-groups.json'), JSON.stringify(groups, null, 2) + '\n');
console.log(`synced: ${catalog.items.length} settings, ${Object.keys(groups).length} module groups`);
