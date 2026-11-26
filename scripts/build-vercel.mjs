import { writeFileSync } from 'node:fs';

const configuredOrigin = process.env.LEPETSE_API_ORIGIN?.trim();
if (!configuredOrigin) throw new Error('Set LEPETSE_API_ORIGIN to the Render HTTPS origin.');
const url = new URL(configuredOrigin);
if (url.protocol !== 'https:' || url.username || url.password ||
    url.pathname !== '/' || url.search || url.hash) {
  throw new Error('LEPETSE_API_ORIGIN must be an HTTPS origin with no path or credentials.');
}

const config = { dataSource: 'api', apiBase: url.origin, rfqSubmission: true };
writeFileSync(new URL('../dist/runtime-config.js', import.meta.url),
    'window.LEPETSE_CONFIG=' + JSON.stringify(config) + ';\n');
