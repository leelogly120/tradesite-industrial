import { build, preview } from 'astro';
import { mkdir, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const testsDir = dirname(fileURLToPath(import.meta.url));
const root = resolve(testsDir, '..');
const configFile = 'tests/astro.playwright.config.mjs';
const astroTemp = join(root, '.astro');
await mkdir(astroTemp, { recursive: true });
const outDir = join(astroTemp, 'playwright-dist');
await rm(outDir, { recursive: true, force: true });

process.env.PUBLIC_FORM_ENDPOINT = 'https://inquiry.test/inquiry';

let server;
let stopping = false;

const stop = async () => {
  if (stopping) return;
  stopping = true;
  if (server) await server.stop();
  await rm(outDir, { recursive: true, force: true });
};

process.once('SIGINT', () => void stop());
process.once('SIGTERM', () => void stop());

try {
  await build({
    root,
    configFile,
    outDir,
    logLevel: 'warn',
  });
  server = await preview({
    root,
    configFile,
    outDir,
    server: {
      host: '127.0.0.1',
      port: 4322,
    },
    logLevel: 'warn',
  });
  await server.closed();
} finally {
  await stop();
}
