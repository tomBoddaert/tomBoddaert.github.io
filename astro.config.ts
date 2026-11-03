import { defineConfig, svgoOptimizer } from 'astro/config';
import sitemap, { SitemapItem } from '@astrojs/sitemap';
import { AstroIntegration } from 'astro';

// https://astro.build/config
const config = defineConfig({
  site: 'https://tomBoddaert.com',
  build: { format: 'preserve' },
  experimental: {
    svgOptimizer: svgoOptimizer({
      multipass: true,
      floatPrecision: 3,
      plugins: [
        'removeDoctype',
        'removeXMLProcInst',
        'removeComments',
        'removeMetadata',
        'removeEditorsNSData',
        'cleanupAttrs',
        'mergeStyles',
        'minifyStyles',
        'cleanupNumericValues',
        'convertColors',
        'convertPathData',
        'convertTransform',
        'removeEmptyAttrs',
        'removeEmptyContainers',
        'sortAttrs',
        'sortDefsChildren',
      ],
    }),
  },
  integrations: [lastMod(), sm()],
  image: { responsiveStyles: true },
  vite: {
    build: { target: 'esnext', minify: false },
  },
});
export default config;

const sitemapIgnore: (string | RegExp)[] = [];
const sitemapPriorities: [(string | RegExp), number][] = [
  ['/', 1.0],
  ['/about', 0.8],
  ['/links', 0.8],
  ['/contact', 0.8],
  ['/projects', 0.8],
  ['/flagsCustomiser', 0.4],
  ['/flags', 0.2],

  [/^\/projects\//, 0.6],
];

import * as path from 'node:path';
import * as fs from 'node:fs';
import * as crypto from 'node:crypto';
import * as stream from 'node:stream/promises';
import * as url from 'node:url';

const lastModPath = 'lastMod.json';
type LastModEntry = { hash: string; lastMod: string };
type LastModData = { [name: string]: LastModEntry };
let lastModData: LastModData;

function lastMod(): AstroIntegration {
  return {
    name: 'lastMod',
    hooks: {
      'astro:build:done': async ({ pages, dir, assets, logger }) => {
        const dirPath = url.fileURLToPath(dir);
        const now = Temporal.Now.plainDateTimeISO().toString();

        const previousLastMod: LastModData = JSON.parse(
          await fs.promises.readFile(lastModPath, { encoding: 'utf-8' }),
        );
        Object.setPrototypeOf(previousLastMod, null);
        const newLastMod: LastModData = Object.create(null);

        for (const assetUrl of assets.values().flatMap((x) => x)) {
          const assetPath = url.fileURLToPath(assetUrl);
          const assetName = path.relative(dirPath, assetPath);

          const hash = await hashFile(assetPath);

          const previous = previousLastMod[assetName] as
            | LastModEntry
            | undefined;
          const lastMod = previous && previous.hash == hash
            ? previous.lastMod
            : now;

          newLastMod[assetName] = { hash, lastMod };
        }

        await fs.promises.writeFile(
          lastModPath,
          // Add newline to adhere to our formatting (so `deno fmt` doesn't edit it)
          JSON.stringify(newLastMod, null, 2) + '\n',
          { encoding: 'utf-8' },
        );
        lastModData = newLastMod;
      },
    },
  };
}

function sm(): AstroIntegration {
  return sitemap({
    filter(page: string): boolean {
      const { pathname } = new URL(page);
      return !sitemapIgnore.some(
        (pattern) => pathname.match(pattern),
      );
    },

    serialize(item: SitemapItem): SitemapItem {
      const { pathname } = new URL(item.url);
      const path = urlToPath(item.url);

      item.lastmod = lastModData[path].lastMod;

      const priorityEntry = sitemapPriorities.find(
        ([pattern, _]) =>
          typeof pattern == 'string'
            ? pathname === pattern
            : pathname.match(pattern),
      );
      if (priorityEntry) {
        item.priority = priorityEntry[1];
      }

      return item;
    },
  });
}

// TODO: use the 'astro:routes:resolved' hook to skip this
function urlToPath(url: string): string {
  let { pathname } = new URL(url);

  if (pathname.endsWith('/')) {
    pathname += 'index';
  }

  const lastSeperator = pathname.lastIndexOf('/');
  const filename = pathname.slice(lastSeperator + 1);
  if (!filename.includes('.')) {
    pathname += '.html';
  }

  // pathname = path.normalize(pathname);

  if (pathname[0] === '/') {
    pathname = pathname.slice(1);
  }

  return pathname;
}

async function hashFile(path: string): Promise<string> {
  const hash = crypto.createHash('sha3-224');
  hash.setEncoding('hex');

  await stream.pipeline(
    fs.createReadStream(path),
    hash,
  );

  return hash.read();
}
