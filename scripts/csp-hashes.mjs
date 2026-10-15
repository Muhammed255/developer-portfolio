// Post-build step: adds a per-page Content-Security-Policy <meta> tag that
// allows exactly the inline scripts present in each prerendered HTML file
// (theme bootstrap, Angular event replay) by SHA-256 hash.
//
// Angular's built-in `security.autoCsp` can't be combined with prerendering,
// hence this script. The CloudFront response-headers policy sends the rest
// of the CSP (frame-ancestors etc.); browsers enforce both policies.
//
// Usage: node scripts/csp-hashes.mjs [distDir]
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const distDir = process.argv[2] ?? 'dist/developer-portfolio/browser';

const sha256 = (text) => `'sha256-${createHash('sha256').update(text, 'utf8').digest('base64')}'`;

function* htmlFiles(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) yield* htmlFiles(path);
    else if (entry.endsWith('.html')) yield path;
  }
}

let count = 0;
for (const file of htmlFiles(distDir)) {
  let html = readFileSync(file, 'utf8');
  html = html.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>\n?/, '');

  const scriptHashes = new Set();
  // Executable inline scripts only: skip src= and JSON data blocks.
  for (const [, attrs, body] of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (/\bsrc=/.test(attrs) || /type="application\/json"/.test(attrs) || !body.trim()) continue;
    scriptHashes.add(sha256(body));
  }

  // Inline event handlers (e.g. the critical-CSS loader's onload) need
  // 'unsafe-hashes' plus the hash of the handler source.
  const handlerHashes = new Set();
  for (const [, handler] of html.matchAll(/\son[a-z]+="([^"]*)"/g)) {
    handlerHashes.add(sha256(handler.replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"')));
  }

  const scriptSrc = ["'self'", ...scriptHashes];
  if (handlerHashes.size) scriptSrc.push("'unsafe-hashes'", ...handlerHashes);

  const policy = [
    `script-src ${scriptSrc.join(' ')}`,
    "object-src 'none'",
    "base-uri 'self'",
  ].join('; ');

  html = html.replace(/<head>/, `<head>\n  <meta http-equiv="Content-Security-Policy" content="${policy}">`);
  writeFileSync(file, html);
  count++;
}
console.log(`csp-hashes: added script-src hashes to ${count} HTML files`);
