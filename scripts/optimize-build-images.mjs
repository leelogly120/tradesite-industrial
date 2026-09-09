import { readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { optimizeImageMarkup } from './lib/build-image-markup.mjs';

const distDirectory = resolve('dist');
const publicDirectory = resolve('public');
let pagesUpdated = 0;

async function visit(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) await visit(path);
    else if (entry.isFile() && entry.name.endsWith('.html')) {
      const original = await readFile(path, 'utf8');
      const optimized = await optimizeImageMarkup(original, { publicDirectory });
      if (optimized !== original) {
        await writeFile(path, optimized, 'utf8');
        pagesUpdated += 1;
      }
    }
  }
}

await visit(distDirectory);
console.log(`Image markup: measured local media and updated ${pagesUpdated} generated pages.`);
