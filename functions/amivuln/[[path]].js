// SPDX-FileCopyrightText: 2026 Nubian Ibex and IbexWall contributors
// SPDX-License-Identifier: GPL-3.0-or-later
//
// Serves the amivuln documentation at ibexwall.com/amivuln. The documentation
// is built and published by the amivuln repository to GitHub Pages under the
// same /amivuln/ path, so each request is passed through unchanged: the
// visitor stays on this site and the repository stays the one place to edit.
// Cloudflare Pages runs this file for every path under /amivuln/.

const ORIGIN = 'https://nubian-ibex.github.io';

/** Points an address on the GitHub Pages origin at this site instead. */
export function rewrite(location, requestUrl) {
  const target = new URL(location, ORIGIN);
  if (target.origin !== ORIGIN) return location;
  return new URL(target.pathname + target.search + target.hash, requestUrl).toString();
}

// Headers that describe GitHub's servers and mean nothing here.
const DROPPED = ['set-cookie', 'server', 'via', 'x-github-request-id', 'x-served-by', 'x-cache', 'x-cache-hits', 'x-timer'];

export async function onRequest({ request }) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method Not Allowed', { status: 405, headers: { allow: 'GET, HEAD' } });
  }
  const url = new URL(request.url);
  const upstream = new URL(url.pathname + url.search, ORIGIN);
  const response = await fetch(upstream, {
    method: request.method,
    redirect: 'manual',
    headers: { accept: request.headers.get('accept') ?? '*/*' },
    cf: { cacheEverything: true, cacheTtl: 300 },
  });
  const headers = new Headers(response.headers);
  for (const name of DROPPED) headers.delete(name);
  const location = headers.get('location');
  if (location) headers.set('location', rewrite(location, url));
  headers.set('x-content-type-options', 'nosniff');
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
