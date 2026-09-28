#!/usr/bin/env node
/* BOHEMIA BATTLE BROTHERS LIBRARY FETCHER
   ================================================================================
   PLUMBER, row [bb library], rule 33j. Paolo 9/27: "go through the Battle Brothers
   wiki and download everything or remember everything, all the stats."

   Walks the Battle Brothers wiki's MediaWiki API and the developers' blog, and
   writes each page to one text file with its source URL at the top, so every volume
   in reference/library/battle_brothers/ can cite a FETCHED page instead of (recall).

     node tools/bohemia_bb_library.js              fetch both, resume where it stopped
     node tools/bohemia_bb_library.js --only wiki  just the wiki
     node tools/bohemia_bb_library.js --max 50     stop after writing 50 (resumable)

   WHAT IT WILL NOT DO, BECAUSE EACH ONE IS A WAY TO LIE:
     - It never passes when it could not look. If a host refuses, it prints THAT HOST
       and the refusal in the network's own words, writes nothing for that source, and
       ends CANNOT REACH. Measured 9/28 from the fleet's containers: the proxy answers
       CONNECT battlebrothers.fandom.com:443 with 403 Forbidden, which curl reports as
       HTTP 000. Exit 0, as the row asks, because that is a policy, not a bug here.
     - It never guesses a format. If the blog host answers but is not a WordPress REST
       API, it says so and fetches nothing from it rather than scraping whatever HTML
       it gets and calling that the blog.
     - It never stamps a licence that is not true. THE ROW ASKED FOR "the CC BY-SA line
       at the top" OF EVERY FILE AND THAT IS WRONG FOR HALF OF THEM. The wiki's text is
       CC BY-SA 3.0, so wiki files carry that line. The developers' blog is Overhype
       Studios' own writing and is NOT under a free licence, so blog files say whose it
       is and that it is kept for private study and citation. Putting CC BY-SA on it
       would be a false licence claim in a file that exists to be cited.
     - It never downloads images. Wikitext keeps its [[File:...]] references as text.

   HOW IT IS POLITE, since this is somebody else's server:
     one request at a time; a delay between requests (default 1000 ms); MediaWiki's
     maxlag=5; retry on 429/503 honouring Retry-After, three tries; content fetched in
     batches of 50 by page id through the query API rather than one parse call per page
     (the row said "parse/wikitext per page" -- batching is the same text for a fiftieth
     of the requests, which is what the API's own etiquette asks for); redirects are
     skipped so nothing is fetched twice; a User-Agent that names this project.

   IDEMPOTENT AND RESUMABLE: the page list is cheap and is always re-read; a page is
   fetched only when its file is missing or its stored revision differs from the wiki's
   lastrevid (a blog post: its stored "modified" differs). So a second run with nothing
   changed writes nothing, and a run killed half way picks up where it stopped.
   ================================================================================ */
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const { execFileSync } = require('child_process');

const ROOT = path.dirname(__dirname);
const arg = (k, d) => { const i = process.argv.indexOf('--' + k);
  return i < 0 ? d : (process.argv[i + 1] === undefined ? true : process.argv[i + 1]); };

/* the two sources. The URL overrides exist so the gate can run this against a local
   fixture; they are not a way round a blocked host. */
const WIKI_API = arg('wiki', 'https://battlebrothers.fandom.com/api.php');
const BLOG     = String(arg('blog', 'https://battlebrothersgame.com')).replace(/\/+$/, '');
const OUT      = path.resolve(ROOT, arg('out', 'reference/library/battle_brothers'));
const DELAY    = +arg('delay', 1000);
const MAX      = arg('max', null) === null ? Infinity : +arg('max');
const PAGESIZE = +arg('page-size', 500);
const ONLY     = arg('only', null);
const UA = 'BohemiaStudyLibrary/1.0 (+https://github.com/paolosarn/bohemia; reference library fetcher)';

const WIKI_LICENCE = 'Text from the Battle Brothers Wiki (Fandom), licensed CC BY-SA 3.0 '
  + '(https://creativecommons.org/licenses/by-sa/3.0/). Quoted for study and cited; not republished as ours.';
const BLOG_LICENCE = 'Copyright Overhype Studios. NOT under a free licence. Kept for private study and '
  + 'citation only; quote facts and cite this URL, never republish the text.';

const sleep = (ms) => { if (ms > 0) Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms); };
const hostOf = (u) => { try { return new URL(u).host; } catch (e) { return u; } };

/* ---- ONE REQUEST, THROUGH CURL, BECAUSE CURL IS WHAT HONOURS THIS FLEET'S PROXY --
   Every network tool in this repo that works from a container goes through curl for
   that reason. Returns { ok, status, body, headers } or { ok:false, refused } with the
   network's own words. */
function get(url) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const hdr = path.join(require('os').tmpdir(), 'bbl-hdr-' + process.pid + '.txt');
    let out;
    try {
      out = execFileSync('curl', ['-sS', '--max-time', '40', '-A', UA,
        '--noproxy', '127.0.0.1,localhost',
        '-H', 'Accept: application/json', '-D', hdr, '-w', '\n__HTTP__%{http_code}', url],
        { encoding: 'utf8', maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'pipe'] });
    } catch (e) {
      const why = String(e.stderr || e.message || '').trim().split('\n').pop();
      return { ok: false, refused: why || ('curl exit ' + e.status) };
    }
    let headers = '';
    try { headers = fs.readFileSync(hdr, 'utf8'); fs.unlinkSync(hdr); } catch (e) { /* none */ }
    const cut = out.lastIndexOf('\n__HTTP__');
    const status = +out.slice(cut + 9), body = out.slice(0, cut);
    if (status === 429 || status === 503) {
      const ra = /^retry-after:\s*(\d+)/im.exec(headers);
      sleep(Math.min(60, ra ? +ra[1] : 5 * attempt) * 1000);
      continue;
    }
    return { ok: true, status, body, headers };
  }
  return { ok: false, refused: 'still 429/503 after three polite retries' };
}

function getJSON(url) {
  const r = get(url);
  if (!r.ok) return r;
  try { return Object.assign(r, { json: JSON.parse(r.body) }); }
  catch (e) { return Object.assign(r, { json: null }); }
}

/* ---- FILENAMES: deterministic from the WHOLE title list, so the same wiki always
   produces the same files regardless of fetch order. A title's unsafe characters
   become _, and two titles that land on the same name ("A/B" and "A:B") both get a
   short hash of their real title so neither overwrites the other. */
function nameAll(titles) {
  const safe = (t) => t.replace(/[\\/:*?"<>|\u0000-\u001f]/g, '_').replace(/\s+/g, '_')
    .replace(/_+/g, '_').replace(/^[._]+|[._]+$/g, '').slice(0, 150) || 'untitled';
  const base = new Map(), count = new Map();
  for (const t of titles) { const b = safe(t); base.set(t, b); count.set(b, (count.get(b) || 0) + 1); }
  const out = new Map();
  for (const t of titles) {
    const b = base.get(t);
    out.set(t, count.get(b) > 1
      ? b + '__' + crypto.createHash('sha1').update(t).digest('hex').slice(0, 8) : b);
  }
  return out;
}

const readHeader = (file, key) => {
  try {
    const head = fs.readFileSync(file, 'utf8').slice(0, 2000);
    const m = new RegExp('^' + key + ':\\s*(.+)$', 'm').exec(head);
    return m ? m[1].trim() : null;
  } catch (e) { return null; }
};

let written = 0, skipped = 0, bytes = 0, stoppedAtMax = false;
const report = [];

function writeFile(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = file + '.part';
  fs.writeFileSync(tmp, text);
  fs.renameSync(tmp, file);                 /* never a half-written page on disk */
  written++; bytes += Buffer.byteLength(text);
  if (written >= MAX) stoppedAtMax = true;
}

/* =============================== THE WIKI ================================ */
function wiki() {
  const host = hostOf(WIKI_API);
  const probe = getJSON(WIKI_API + '?action=query&meta=siteinfo&format=json&formatversion=2');
  if (!probe.ok) { report.push('CANNOT REACH ' + host + ' -- ' + probe.refused); return 'unreached'; }
  if (probe.status !== 200 || !probe.json || !probe.json.query) {
    report.push('REACHED ' + host + ' BUT IT DID NOT ANSWER AS A MEDIAWIKI API (HTTP '
      + probe.status + '). Wiki NOT fetched, and this tool will not guess a format.');
    return 'not-an-api';
  }

  /* 1. the list, every run: id, title, lastrevid; no redirects */
  const pages = [];
  let cont = {};
  for (;;) {
    const q = new URLSearchParams(Object.assign({ action: 'query', generator: 'allpages',
      gapnamespace: '0', gapfilterredir: 'nonredirects', gaplimit: String(PAGESIZE),
      prop: 'info', format: 'json', formatversion: '2', maxlag: '5' }, cont));
    const r = getJSON(WIKI_API + '?' + q);
    if (!r.ok) { report.push('LOST ' + host + ' while listing pages -- ' + r.refused); return 'failed'; }
    if (!r.json) { report.push('the page list from ' + host + ' was not JSON (HTTP ' + r.status + ')'); return 'failed'; }
    if (r.json.error && r.json.error.code === 'maxlag') { sleep(5000); continue; }
    for (const p of ((r.json.query && r.json.query.pages) || []))
      pages.push({ id: p.pageid, title: p.title, rev: p.lastrevid });
    if (!r.json.continue) break;
    cont = r.json.continue;
    sleep(DELAY);
  }
  const names = nameAll(pages.map(p => p.title));
  const wikiBase = WIKI_API.replace(/\/api\.php.*$/, '/wiki/');
  const dir = path.join(OUT, 'wiki');

  /* 2. only what is missing or changed */
  const todo = pages.filter(p => {
    const have = readHeader(path.join(dir, names.get(p.title) + '.md'), 'revision');
    if (have && +have === +p.rev) { skipped++; return false; }
    return true;
  });

  /* 3. fifty at a time */
  for (let i = 0; i < todo.length && !stoppedAtMax; i += 50) {
    sleep(DELAY);
    const batch = todo.slice(i, i + 50);
    const q = new URLSearchParams({ action: 'query', prop: 'revisions', rvprop: 'content|ids',
      rvslots: 'main', pageids: batch.map(p => p.id).join('|'), format: 'json',
      formatversion: '2', maxlag: '5' });
    const r = getJSON(WIKI_API + '?' + q);
    if (!r.ok || !r.json) { report.push('LOST ' + host + ' fetching content -- '
      + (r.refused || 'not JSON, HTTP ' + r.status) + '. Everything written so far stays; rerun resumes.');
      return 'failed'; }
    if (r.json.error && r.json.error.code === 'maxlag') { sleep(5000); i -= 50; continue; }
    const byId = new Map(((r.json.query && r.json.query.pages) || []).map(p => [p.pageid, p]));
    for (const p of batch) {
      if (stoppedAtMax) break;
      const got = byId.get(p.id);
      const rev = got && got.revisions && got.revisions[0];
      const text = rev && rev.slots && rev.slots.main && rev.slots.main.content;
      if (typeof text !== 'string') continue;
      writeFile(path.join(dir, names.get(p.title) + '.md'),
        '# ' + p.title + '\n'
        + 'source: ' + wikiBase + encodeURI(p.title.replace(/ /g, '_')) + '\n'
        + 'revision: ' + (rev.revid || p.rev) + '\n'
        + 'fetched: ' + new Date().toISOString() + '\n'
        + 'license: ' + WIKI_LICENCE + '\n'
        + '---\n' + text + (text.endsWith('\n') ? '' : '\n'));
    }
  }
  report.push(host + ': ' + pages.length + ' pages listed');
  return 'ok';
}

/* =============================== THE BLOG ================================ */
const htmlToText = (h) => String(h || '')
  .replace(/<\s*(script|style)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
  .replace(/<\s*br\s*\/?>/gi, '\n').replace(/<\s*\/\s*(p|div|h[1-6]|li|tr)\s*>/gi, '\n\n')
  .replace(/<[^>]+>/g, '')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#8217;|&#039;|&#39;/g, "'").replace(/&#8220;|&#8221;/g, '"')
  .replace(/&#8211;|&#8212;/g, '-').replace(/&#(\d+);/g, (m, n) => String.fromCharCode(+n))
  .replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();

function blog() {
  const host = hostOf(BLOG);
  const dir = path.join(OUT, 'blog');
  let seen = 0;
  for (let page = 1; !stoppedAtMax; page++) {
    const r = getJSON(BLOG + '/wp-json/wp/v2/posts?per_page=100&page=' + page
      + '&_fields=id,slug,link,date,modified,title,content');
    if (!r.ok) { report.push((page === 1 ? 'CANNOT REACH ' : 'LOST ') + host + ' -- ' + r.refused);
      return page === 1 ? 'unreached' : 'failed'; }
    if (page > 1 && r.status === 400) break;                   /* past the last page */
    if (r.status !== 200 || !Array.isArray(r.json)) {
      if (page === 1) { report.push('REACHED ' + host + ' BUT IT IS NOT A WORDPRESS REST API (HTTP '
        + r.status + '). Blog NOT fetched, and this tool will not guess a format.'); return 'not-an-api'; }
      break;
    }
    if (!r.json.length) break;
    for (const post of r.json) {
      if (stoppedAtMax) break;
      seen++;
      const slug = String(post.slug || post.id).replace(/[^a-z0-9._-]/gi, '_').slice(0, 150);
      const file = path.join(dir, slug + '.md');
      if (readHeader(file, 'modified') === String(post.modified)) { skipped++; continue; }
      const title = htmlToText(post.title && post.title.rendered);
      writeFile(file, '# ' + title + '\n'
        + 'source: ' + post.link + '\n'
        + 'published: ' + post.date + '\n'
        + 'modified: ' + post.modified + '\n'
        + 'fetched: ' + new Date().toISOString() + '\n'
        + 'license: ' + BLOG_LICENCE + '\n'
        + '---\n' + htmlToText(post.content && post.content.rendered) + '\n');
    }
    sleep(DELAY);
  }
  report.push(host + ': ' + seen + ' posts listed');
  return 'ok';
}

/* ================================ RUN ==================================== */
console.log('\nBATTLE BROTHERS LIBRARY -> ' + path.relative(ROOT, OUT) + '/');
const res = {};
if (ONLY !== 'blog') res.wiki = wiki();
if (ONLY !== 'wiki' && !stoppedAtMax) res.blog = blog();
for (const line of report) console.log('  ' + line);

const states = Object.values(res);
if (states.length && states.every(s => s === 'unreached')) {
  console.log('\n  CANNOT REACH: nothing fetched, nothing written. Not a pass and not a failure'
    + ' of this tool -- the hosts above are not allowed from here.');
  process.exit(0);
}
if (states.includes('failed')) {
  console.log('\n  STOPPED PART WAY: ' + written + ' written before it stopped. Rerun to resume.');
  process.exit(1);
}
console.log('\n  written ' + written + ', unchanged ' + skipped + ', ' + (bytes / 1024).toFixed(1) + ' KB'
  + (stoppedAtMax ? '   STOPPED AT --max ' + MAX + ' (rerun to resume)' : ''));
if (states.includes('unreached') || states.includes('not-an-api'))
  console.log('  PARTIAL: one source above was not fetched, and says why.');
process.exit(0);
