#!/usr/bin/env node
// SPDX-FileCopyrightText: 2026 Nubian Ibex and IbexWall contributors
// SPDX-License-Identifier: GPL-3.0-or-later
//
// Checks the /amivuln/ pass-through without the network: the request that
// reaches GitHub Pages, the headers that are kept or dropped, redirects that
// stay on this site, and the methods that are refused.
import { onRequest, rewrite } from '../functions/amivuln/[[path]].js';

const problems = [];
const expect = (ok, message) => ok || problems.push(message);

let seen;
globalThis.fetch = async (url, init) => {
  seen = { url: String(url), init };
  return new Response('<html>docs</html>', {
    status: 200,
    headers: { 'content-type': 'text/html', 'set-cookie': 'a=b', server: 'GitHub.com', 'x-github-request-id': '1', 'cache-control': 'max-age=600' },
  });
};

const get = (path, method = 'GET') => onRequest({ request: new Request(`https://ibexwall.com${path}`, { method }) });

let res = await get('/amivuln/pt/using.html?x=1');
expect(seen.url === 'https://nubian-ibex.github.io/amivuln/pt/using.html?x=1', `upstream address: ${seen.url}`);
expect(seen.init.redirect === 'manual', 'redirects must not be followed');
expect(res.status === 200 && (await res.text()) === '<html>docs</html>', 'the body passes through');
expect(res.headers.get('content-type') === 'text/html', 'content-type is kept');
expect(res.headers.get('cache-control') === 'max-age=600', 'cache-control is kept');
for (const h of ['set-cookie', 'server', 'x-github-request-id']) expect(!res.headers.has(h), `${h} must be dropped`);
expect(res.headers.get('x-content-type-options') === 'nosniff', 'nosniff is added');

res = await get('/amivuln/', 'HEAD');
expect(res.status === 200, 'HEAD is allowed');

for (const method of ['POST', 'PUT', 'DELETE']) {
  res = await onRequest({ request: new Request('https://ibexwall.com/amivuln/', { method, body: 'x' }) });
  expect(res.status === 405 && res.headers.get('allow') === 'GET, HEAD', `${method} must be refused`);
}

globalThis.fetch = async () => new Response(null, { status: 301, headers: { location: 'https://nubian-ibex.github.io/amivuln/pt/' } });
res = await get('/amivuln/pt');
expect(res.status === 301 && res.headers.get('location') === 'https://ibexwall.com/amivuln/pt/', `redirect stays on this site: ${res.headers.get('location')}`);

expect(rewrite('https://example.org/x', new URL('https://ibexwall.com/amivuln/')) === 'https://example.org/x', 'other origins are left alone');
expect(rewrite('/amivuln/a/', new URL('https://ibexwall.com/amivuln/')) === 'https://ibexwall.com/amivuln/a/', 'relative locations resolve here');

if (problems.length) {
  console.error(problems.map((p) => `FAIL: ${p}`).join('\n'));
  process.exit(1);
}
console.log('proxy ok');
