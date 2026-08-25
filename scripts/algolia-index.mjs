/**
 * Crawl the published Docusaurus site and upload DocSearch v3 records.
 *
 * Required:
 *   ALGOLIA_ADMIN_API_KEY  (Admin or Write key; never commit)
 *
 * Optional:
 *   ALGOLIA_APP_ID         default 1VU781LYTV
 *   ALGOLIA_INDEX_NAME     default rdk_x_doc
 *   ALGOLIA_SITE_URL       default https://developer.d-robotics.cc/rdk_x_doc/
 *   ALGOLIA_NO_PROXY=1     unset HTTP(S)_PROXY for the Algolia API calls
 *
 * Usage:
 *   npm run algolia:index
 *   node scripts/algolia-index.mjs --dry-run
 */
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';

import {
  lookupDocScopeConfig,
  normalizeDocIdFromPath,
} from '../src/context/doc-scope-id-utils.mjs';

const require = createRequire(import.meta.url);
const {DOCSEARCH_INDEX_SETTINGS} = require('./lib/algolia-docsearch-settings.js');
const {
  getGeneratedSidebarConfigPath,
  buildAndWriteSidebarScopeConfig,
} = require('./lib/sidebar-scope-config-generator.js');
const {matchVersion, scopeProductsMatchCurrent} = require('./lib/doc-scope-match.cjs');
const {
  VERSION_PRODUCT_MATRIX,
} = require('../src/context/doc-scope-matrix.json');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_DIR = path.join(__dirname, '..');

dotenv.config({path: path.join(SITE_DIR, '.env')});
dotenv.config({path: path.join(SITE_DIR, '.env.local')});

const DEFAULT_APP_ID = '1VU781LYTV';
const DEFAULT_INDEX_NAME = 'rdk_x_doc';
const DEFAULT_SITE_URL = 'https://developer.d-robotics.cc/rdk_x_doc/';
const DEFAULT_LOCALE = 'zh-Hans';
const LOCALES = ['zh-Hans', 'en'];
const BATCH_SIZE = 500;
const FETCH_CONCURRENCY = 6;
const SKIP_PATH_RE =
  /\/(search|tags|blog|markdown-page)(\/|$)|\/category\/|\.(png|jpe?g|gif|svg|webp|pdf|zip|exe)$/i;

const LEVEL_WEIGHT = {
  lvl0: 100,
  lvl1: 90,
  lvl2: 80,
  lvl3: 70,
  lvl4: 60,
  lvl5: 50,
  lvl6: 40,
  content: 0,
};

function parseArgs(argv) {
  return {
    dryRun: argv.includes('--dry-run'),
    skipClear: argv.includes('--skip-clear'),
  };
}

function die(message) {
  console.error(message);
  process.exit(1);
}

function ensureTrailingSlash(url) {
  return url.endsWith('/') ? url : `${url}/`;
}

function stripTrailingSlash(url) {
  return url.replace(/\/+$/, '');
}

function disableProxyIfRequested() {
  if (process.env.ALGOLIA_NO_PROXY !== '1') {
    return;
  }
  for (const key of [
    'HTTP_PROXY',
    'HTTPS_PROXY',
    'http_proxy',
    'https_proxy',
    'ALL_PROXY',
    'all_proxy',
  ]) {
    delete process.env[key];
  }
  console.log('ALGOLIA_NO_PROXY=1: HTTP(S) proxy env vars cleared for this process.');
}

function productVersionPairs() {
  const pairs = [];
  for (const [version, products] of Object.entries(VERSION_PRODUCT_MATRIX || {})) {
    for (const product of products || []) {
      pairs.push({product, version});
    }
  }
  return pairs;
}

function docScopeKey(product, version) {
  return `${product}::${version}`;
}

function unique(list) {
  return [...new Set(list.filter(Boolean))];
}

function shouldShowDoc(docId, version, product, sidebarConfig) {
  const docScope = lookupDocScopeConfig(docId, sidebarConfig);
  if (docScope) {
    return (
      matchVersion(version, docScope.versions) &&
      scopeProductsMatchCurrent(docScope.products, product)
    );
  }
  const normalizedId = normalizeDocIdFromPath(docId);
  for (const [configPath, scope] of Object.entries(sidebarConfig || {})) {
    if (!scope?.isCategory) {
      continue;
    }
    if (
      normalizedId === configPath ||
      normalizedId.startsWith(`${configPath}/`)
    ) {
      return (
        matchVersion(version, scope.versions) &&
        scopeProductsMatchCurrent(scope.products, product)
      );
    }
  }
  return true;
}

function pairsForPage(docId, sidebarConfig) {
  return productVersionPairs().filter(({product, version}) =>
    shouldShowDoc(docId, version, product, sidebarConfig),
  );
}

function intersectPairs(pagePairs, blockSpec) {
  if (!blockSpec) {
    return pagePairs;
  }
  const versions = blockSpec.versions || [];
  const products = blockSpec.products || [];
  return pagePairs.filter(
    ({product, version}) =>
      (versions.length === 0 || matchVersion(version, versions)) &&
      scopeProductsMatchCurrent(products, product),
  );
}

function parseDocScopeAttr(raw) {
  if (!raw) {
    return null;
  }
  try {
    const spec = JSON.parse(raw);
    if (!spec || typeof spec !== 'object') {
      return null;
    }
    return {
      versions: spec.versions || [],
      products: spec.products || [],
    };
  } catch {
    return null;
  }
}

async function loadSidebarConfig() {
  const configFilePath = getGeneratedSidebarConfigPath(SITE_DIR);
  return buildAndWriteSidebarScopeConfig({
    configFilePath,
    docsDir: path.join(SITE_DIR, 'docs'),
    i18nEnDocsCurrentDir: path.join(
      SITE_DIR,
      'i18n/en/docusaurus-plugin-content-docs/current',
    ),
    siteDir: SITE_DIR,
    verbose: false,
  });
}

function algoliaHeaders(appId, apiKey) {
  return {
    'X-Algolia-Application-Id': appId,
    'X-Algolia-API-Key': apiKey,
    'Content-Type': 'application/json',
  };
}

function algoliaUrl(appId, pathname) {
  return `https://${appId}.algolia.net${pathname}`;
}

async function algoliaRequest(appId, apiKey, method, pathname, body) {
  const res = await fetch(algoliaUrl(appId, pathname), {
    method,
    headers: algoliaHeaders(appId, apiKey),
    body: body == null ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = {raw: text};
  }
  if (!res.ok) {
    const msg = json?.message || json?.message || text || res.statusText;
    throw new Error(`Algolia ${method} ${pathname} -> ${res.status}: ${msg}`);
  }
  return json;
}

function normalizeText(value) {
  return String(value || '')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function emptyHierarchy() {
  return {
    lvl0: null,
    lvl1: null,
    lvl2: null,
    lvl3: null,
    lvl4: null,
    lvl5: null,
    lvl6: null,
  };
}

function cloneHierarchy(hierarchy) {
  return {...hierarchy};
}

function headingType(tagName) {
  const n = Number(String(tagName || '').slice(1));
  return Number.isFinite(n) && n >= 1 && n <= 6 ? `lvl${n}` : null;
}

function objectIdFor(record) {
  return createHash('sha1')
    .update(
      [
        record.url_without_anchor,
        record.anchor || '',
        record.type,
        record.content || '',
        record.hierarchy?.lvl1 || '',
        record.hierarchy?.lvl2 || '',
        String(record.weight?.position || 0),
      ].join('|'),
    )
    .digest('hex');
}

function makeRecord({
  hierarchy,
  content,
  type,
  urlWithoutAnchor,
  anchor,
  language,
  docusaurusTag,
  version,
  pairs,
  position,
}) {
  const url = anchor ? `${urlWithoutAnchor}#${anchor}` : urlWithoutAnchor;
  const record = {
    hierarchy: cloneHierarchy(hierarchy),
    content: content || '',
    type,
    url,
    url_without_anchor: urlWithoutAnchor,
    anchor: anchor || null,
    language,
    lang: language,
    version,
    docusaurus_tag: docusaurusTag,
    product: unique(pairs.map((p) => p.product)),
    doc_version: unique(pairs.map((p) => p.version)),
    doc_scope: unique(pairs.map((p) => docScopeKey(p.product, p.version))),
    weight: {
      pageRank: 0,
      level: LEVEL_WEIGHT[type] ?? 0,
      position,
    },
  };
  record.objectID = objectIdFor(record);
  return record;
}

function pageDocIdFromUrl(pageUrl, siteUrl) {
  const site = new URL(ensureTrailingSlash(siteUrl));
  const page = new URL(pageUrl);
  let pathname = page.pathname;
  const base = site.pathname;
  if (pathname.startsWith(base)) {
    pathname = pathname.slice(base.length);
  }
  pathname = pathname.replace(/\/+$/, '');
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] === 'en') {
    parts.shift();
  }
  if (parts.length === 0) {
    return '';
  }
  return parts.join('/');
}

function localeFromUrl(pageUrl, siteUrl) {
  const site = new URL(ensureTrailingSlash(siteUrl));
  const page = new URL(pageUrl);
  let pathname = page.pathname;
  if (pathname.startsWith(site.pathname)) {
    pathname = pathname.slice(site.pathname.length);
  }
  const first = pathname.split('/').filter(Boolean)[0];
  return first === 'en' ? 'en' : DEFAULT_LOCALE;
}

function shouldSkipUrl(url, siteUrl) {
  try {
    const page = new URL(url);
    const site = new URL(ensureTrailingSlash(siteUrl));
    if (page.origin !== site.origin) {
      return true;
    }
    if (!page.pathname.startsWith(site.pathname) && page.pathname !== stripTrailingSlash(site.pathname)) {
      return true;
    }
    return SKIP_PATH_RE.test(page.pathname);
  } catch {
    return true;
  }
}

function collectSameSiteLinks($, pageUrl, siteUrl) {
  const out = [];
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('javascript:')) {
      return;
    }
    try {
      const abs = new URL(href, pageUrl);
      abs.hash = '';
      abs.search = '';
      const normalized = abs.toString();
      if (!shouldSkipUrl(normalized, siteUrl)) {
        out.push(normalized);
      }
    } catch {
      // ignore invalid href
    }
  });
  return out;
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'rdk-x-doc-algolia-indexer/1.0',
      Accept: 'text/html,application/xml,application/json;q=0.9,*/*;q=0.8',
    },
    redirect: 'follow',
  });
  if (!res.ok) {
    throw new Error(`GET ${url} -> ${res.status}`);
  }
  return res.text();
}

function parseSitemapUrls(xml, siteUrl) {
  const locRe = /<loc>\s*([^<]+)\s*<\/loc>/gi;
  const urls = [];
  let match;
  while ((match = locRe.exec(xml))) {
    const raw = match[1].trim();
    if (!raw) {
      continue;
    }
    try {
      const abs = new URL(raw, siteUrl);
      abs.hash = '';
      abs.search = '';
      urls.push(abs.toString());
    } catch {
      // skip
    }
  }
  return urls;
}

async function discoverUrls(siteUrl) {
  const root = stripTrailingSlash(siteUrl);
  const startUrls = [
    `${root}/`,
    `${root}/RDK`,
    `${root}/en`,
    `${root}/en/RDK`,
  ];
  const sitemapCandidates = [
    `${root}/sitemap.xml`,
    `${root}/en/sitemap.xml`,
  ];
  const localSitemaps = [
    path.join(SITE_DIR, 'build', 'sitemap.xml'),
    path.join(SITE_DIR, 'build', 'en', 'sitemap.xml'),
  ];

  for (const sitemapUrl of unique(sitemapCandidates)) {
    try {
      const xml = await fetchText(sitemapUrl);
      const urls = parseSitemapUrls(xml, siteUrl).filter(
        (u) => !shouldSkipUrl(u, siteUrl),
      );
      if (urls.length > 0) {
        console.log(`Discovered ${urls.length} URLs from ${sitemapUrl}`);
        return unique([...startUrls, ...urls]);
      }
    } catch (err) {
      console.log(`Sitemap not used (${sitemapUrl}): ${err.message}`);
    }
  }

  const localUrls = [];
  for (const file of localSitemaps) {
    if (!fs.existsSync(file)) {
      continue;
    }
    try {
      const xml = fs.readFileSync(file, 'utf8');
      localUrls.push(...parseSitemapUrls(xml, siteUrl));
    } catch (err) {
      console.log(`Local sitemap not used (${file}): ${err.message}`);
    }
  }
  const localFiltered = unique(localUrls).filter((u) => !shouldSkipUrl(u, siteUrl));
  if (localFiltered.length > 0) {
    console.log(
      `Discovered ${localFiltered.length} URLs from local build sitemaps (content still fetched from ${siteUrl})`,
    );
    return unique([...startUrls, ...localFiltered]);
  }

  console.log('Falling back to link discovery crawl…');
  const seen = new Set();
  const queue = [...startUrls];
  while (queue.length > 0) {
    const url = queue.shift();
    if (seen.has(url) || shouldSkipUrl(url, siteUrl)) {
      continue;
    }
    seen.add(url);
    try {
      const html = await fetchText(url);
      for (const link of collectSameSiteLinks(cheerio.load(html), url, siteUrl)) {
        if (!seen.has(link)) {
          queue.push(link);
        }
      }
    } catch (err) {
      console.warn(`Skip ${url}: ${err.message}`);
    }
  }
  console.log(`Discovered ${seen.size} URLs by crawling links`);
  return [...seen];
}

function pickArticle($) {
  const selectors = [
    'article .theme-doc-markdown',
    'article.markdown',
    '.theme-doc-markdown',
    'article',
  ];
  for (const selector of selectors) {
    const node = $(selector).first();
    if (node.length) {
      return node;
    }
  }
  return null;
}

function extractMeta($, name) {
  return (
    $(`meta[name="${name}"]`).attr('content') ||
    $(`meta[property="${name}"]`).attr('content') ||
    ''
  ).trim();
}

function closestDocScope($, el) {
  const wrapped = $(el).closest('.doc-scope[data-doc-scope]');
  if (!wrapped.length) {
    return null;
  }
  return parseDocScopeAttr(wrapped.attr('data-doc-scope'));
}

function recordsFromArticle($, article, pageCtx) {
  article
    .find(
      'script, style, noscript, .hash-link, .header-anchor, button, .clean-btn, .theme-code-block-copy-button, .copy-page-button, nav',
    )
    .remove();

  const hierarchy = emptyHierarchy();
  const breadcrumb = $('.breadcrumbs__link')
    .toArray()
    .map((item) => normalizeText($(item).text()))
    .filter(Boolean);
  hierarchy.lvl0 = breadcrumb.join(' / ') || 'Documentation';

  const records = [];
  let position = 0;

  let currentAnchor = '';
  const walk = (nodes) => {
    $(nodes).each((_, node) => {
      if (node.type === 'text') {
        return;
      }
      if (node.type !== 'tag') {
        return;
      }
      const tag = String(node.tagName || '').toLowerCase();
      const $el = $(node);

      if ($el.is('.doc-scope') && $el.attr('data-doc-scope')) {
        const spec = parseDocScopeAttr($el.attr('data-doc-scope'));
        const scopedPairs = intersectPairs(pageCtx.pairs, spec);
        if (scopedPairs.length === 0) {
          return;
        }
        const prevPairs = pageCtx.pairs;
        const prevAnchor = currentAnchor;
        pageCtx.pairs = scopedPairs;
        walk($el.contents());
        pageCtx.pairs = prevPairs;
        currentAnchor = prevAnchor;
        return;
      }

      const type = headingType(tag);
      if (type) {
        const text = normalizeText(
          $el.clone().children('.hash-link, .header-anchor').remove().end().text(),
        );
        if (!text || pageCtx.pairs.length === 0) {
          return;
        }
        const level = Number(type.slice(3));
        for (let i = level; i <= 6; i += 1) {
          hierarchy[`lvl${i}`] = i === level ? text : null;
        }
        position += 1;
        currentAnchor = $el.attr('id') || currentAnchor;
        records.push(
          makeRecord({
            hierarchy,
            content: '',
            type,
            urlWithoutAnchor: pageCtx.urlWithoutAnchor,
            anchor: $el.attr('id') || '',
            language: pageCtx.language,
            docusaurusTag: pageCtx.docusaurusTag,
            version: pageCtx.version,
            pairs: pageCtx.pairs,
            position,
          }),
        );
        return;
      }

      if (tag === 'p' || tag === 'li' || tag === 'td') {
        const text = normalizeText($el.text());
        const spec = closestDocScope($, node);
        const pairs = intersectPairs(pageCtx.pairs, spec);
        if (text && pairs.length > 0) {
          position += 1;
          records.push(
            makeRecord({
              hierarchy,
              content: text,
              type: 'content',
              urlWithoutAnchor: pageCtx.urlWithoutAnchor,
              anchor: currentAnchor,
              language: pageCtx.language,
              docusaurusTag: pageCtx.docusaurusTag,
              version: pageCtx.version,
              pairs,
              position,
            }),
          );
        }
        return;
      }

      walk($el.contents());
    });
  };

  walk(article.contents());
  return records;
}

function recordsFromHtml(html, pageUrl, siteUrl, sidebarConfig) {
  const $ = cheerio.load(html);
  const article = pickArticle($);
  if (!article) {
    return [];
  }

  const language =
    extractMeta($, 'docsearch:language') ||
    $('html').attr('lang') ||
    localeFromUrl(pageUrl, siteUrl);
  const docusaurusTag =
    extractMeta($, 'docsearch:docusaurus_tag') || 'docs-default-current';
  const version = extractMeta($, 'docsearch:version') || 'current';

  const urlObj = new URL(pageUrl);
  urlObj.hash = '';
  urlObj.search = '';
  const urlWithoutAnchor = urlObj.toString();

  const docId = pageDocIdFromUrl(pageUrl, siteUrl);
  const pairs = pairsForPage(docId, sidebarConfig);
  if (pairs.length === 0) {
    return [];
  }

  return recordsFromArticle($, article, {
    urlWithoutAnchor,
    language,
    docusaurusTag,
    version,
    pairs,
  });
}

async function mapPool(items, concurrency, worker) {
  const results = [];
  let index = 0;
  async function run() {
    while (index < items.length) {
      const current = index;
      index += 1;
      results[current] = await worker(items[current], current);
    }
  }
  await Promise.all(
    Array.from({length: Math.min(concurrency, items.length)}, () => run()),
  );
  return results;
}

async function clearIndex(appId, apiKey, indexName) {
  await algoliaRequest(
    appId,
    apiKey,
    'POST',
    `/1/indexes/${encodeURIComponent(indexName)}/clear`,
    {},
  );
}

async function setIndexSettings(appId, apiKey, indexName) {
  await algoliaRequest(
    appId,
    apiKey,
    'PUT',
    `/1/indexes/${encodeURIComponent(indexName)}/settings`,
    DOCSEARCH_INDEX_SETTINGS,
  );
}

async function uploadRecords(appId, apiKey, indexName, records) {
  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const chunk = records.slice(i, i + BATCH_SIZE);
    await algoliaRequest(
      appId,
      apiKey,
      'POST',
      `/1/indexes/${encodeURIComponent(indexName)}/batch`,
      {
        requests: chunk.map((body) => ({action: 'addObject', body})),
      },
    );
    console.log(
      `Uploaded ${Math.min(i + chunk.length, records.length)} / ${records.length}`,
    );
  }
}

async function searchTest(appId, apiKey, indexName) {
  const probes = [
    {query: 'RDK', filters: 'language:zh-Hans AND docusaurus_tag:docs-default-current'},
    {
      query: 'RDK',
      filters:
        'language:zh-Hans AND docusaurus_tag:docs-default-current AND doc_scope:"RDK X5::3.5.0"',
    },
    {
      query: 'RDK',
      filters:
        'language:zh-Hans AND docusaurus_tag:docs-default-current AND doc_scope:"RDK X3::3.0.0"',
    },
  ];
  for (const probe of probes) {
    try {
      const json = await algoliaRequest(
        appId,
        apiKey,
        'POST',
        `/1/indexes/${encodeURIComponent(indexName)}/query`,
        {
          query: probe.query,
          filters: probe.filters,
          hitsPerPage: 3,
          attributesToRetrieve: ['hierarchy', 'url', 'doc_scope', 'language', 'docusaurus_tag'],
        },
      );
      console.log(
        `Test query "${probe.query}" filters=${probe.filters} -> ${json.nbHits ?? 0} hits`,
      );
      for (const hit of json.hits || []) {
        console.log(
          `  - ${hit.hierarchy?.lvl1 || hit.url}  scope=${(hit.doc_scope || []).join(',')}`,
        );
      }
    } catch (err) {
      console.warn(`Test query failed: ${err.message}`);
    }
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const apiKey = process.env.ALGOLIA_ADMIN_API_KEY?.trim();
  if (!apiKey) {
    die(
      'Missing ALGOLIA_ADMIN_API_KEY. Copy .env.example to .env and set the Admin/Write key (do not commit it).',
    );
  }

  disableProxyIfRequested();

  const appId = (process.env.ALGOLIA_APP_ID || DEFAULT_APP_ID).trim();
  const indexName = (process.env.ALGOLIA_INDEX_NAME || DEFAULT_INDEX_NAME).trim();
  const siteUrl = ensureTrailingSlash(
    (process.env.ALGOLIA_SITE_URL || DEFAULT_SITE_URL).trim(),
  );

  console.log(`App ID: ${appId}`);
  console.log(`Index: ${indexName}`);
  console.log(`Site: ${siteUrl}`);
  console.log(`Locales: ${LOCALES.join(', ')}`);

  const sidebarConfig = await loadSidebarConfig();
  console.log(`Sidebar scope entries: ${Object.keys(sidebarConfig).length}`);

  const urls = await discoverUrls(siteUrl);
  const pageUrls = urls.filter((url) => !shouldSkipUrl(url, siteUrl));
  console.log(`Pages to parse: ${pageUrls.length}`);

  const allRecords = [];
  let parsed = 0;
  let failed = 0;
  await mapPool(pageUrls, FETCH_CONCURRENCY, async (url) => {
    try {
      const html = await fetchText(url);
      const records = recordsFromHtml(html, url, siteUrl, sidebarConfig);
      allRecords.push(...records);
      parsed += 1;
      if (parsed % 20 === 0 || parsed === pageUrls.length) {
        console.log(`Parsed ${parsed}/${pageUrls.length} pages (${allRecords.length} records)`);
      }
    } catch (err) {
      failed += 1;
      console.warn(`Failed ${url}: ${err.message}`);
    }
  });

  const byId = new Map();
  for (const record of allRecords) {
    byId.set(record.objectID, record);
  }
  const records = [...byId.values()];
  console.log(
    `Ready to index ${records.length} unique records from ${parsed} pages (${failed} failed).`,
  );

  if (args.dryRun) {
    const samplePath = path.join(SITE_DIR, 'scripts/_algolia_tmp');
    fs.mkdirSync(samplePath, {recursive: true});
    const sampleFile = path.join(samplePath, 'sample-records.json');
    fs.writeFileSync(sampleFile, JSON.stringify(records.slice(0, 20), null, 2));
    console.log(`Dry run: wrote sample records to ${sampleFile}`);
    return;
  }

  if (records.length === 0) {
    die('No records generated; aborting so the remote index is not cleared.');
  }

  console.log('Applying DocSearch index settings…');
  await setIndexSettings(appId, apiKey, indexName);

  if (!args.skipClear) {
    console.log('Clearing index…');
    await clearIndex(appId, apiKey, indexName);
  }

  console.log('Uploading records…');
  await uploadRecords(appId, apiKey, indexName, records);
  await searchTest(appId, apiKey, indexName);
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  if (String(err.message || '').includes('403')) {
    console.error(
      'Algolia 403 is often caused by a local HTTP proxy. Retry with ALGOLIA_NO_PROXY=1.',
    );
  }
  process.exit(1);
});
