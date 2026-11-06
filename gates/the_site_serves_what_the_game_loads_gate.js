#!/usr/bin/env node
/* THE SITE SERVES WHAT THE GAME LOADS (PLUMBER 5, 11/6/26, rule 411's round: the site is too big).
 *
 * The deploy publishes only the list tools/bohemia_publish_list.js computes (what the pages name, the
 * folders the code builds names in, the cards the VOTE tab can draw), not slices/ + engine/ +
 * records/target whole. A list that misses one file the game asks for is a 404 on his phone that no
 * reading of the files would find. So this gate does not read: it PLAYS, on a server that answers
 * ONLY the listed files (anything else is a 404, as the live site will be), and it fails on every
 * request for a file that is in the repo but not on the list.
 *
 *   L1 the list: its size and count (the budget itself is pages_publish_gate.js's)
 *   L2 the alpha opens and every one of its tabs is pressed: nothing it asks for is off the list
 *   L3 the VOTE tab, every card it can draw opened (LOOK AT IT, and MORE): nothing off the list
 *   L4 THE WHOLE LOOP PLAYS (PLUMBER 4's smoke test, run as it is, through the driver, with the
 *      driver's server answering only the list): the loop passes, and nothing it asked for is off
 *      the list (start, map, town, travel, an event, a fight, its end screen, a save, a reload)
 *   L5 every page the site serves (every published .html), opened by itself: nothing off the list
 *   M1 MUTATION: the same alpha boot with one file it really loads taken off the list: L2's reader
 *      names that file (so a green here is a measurement, not a reader that cannot see)
 *
 *   node gates/the_site_serves_what_the_game_loads_gate.js            (everything, about 11 minutes)
 *   node gates/the_site_serves_what_the_game_loads_gate.js --quick    (L1, L2, L3, L5, M1: the pages, no loop; about 6 min)
 *   node gates/the_site_serves_what_the_game_loads_gate.js --loop     (L1 and L4: the loop only; about 5 min)
 * The suite runs it twice, --quick and --loop, because one run is over its ten-minute cap.
 *
 * A request for a file that is NOT in the repo at all is a 404 on disk too: it is listed as
 * information (a page asking for something nobody made), never as this gate's red.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);

/* ---- PRELOAD MODE: node -r this-file gates/the_whole_loop_plays_gate.js, with the list in the env.
   It wraps the driver's open() so its server answers only the list, and writes what was asked. ---- */
if (process.env.BOHEMIA_SERVE_ONLY_LIST) {
  const LIST = new Set(fs.readFileSync(process.env.BOHEMIA_SERVE_ONLY_LIST, 'utf8').split('\n').filter(Boolean));
  const OUT = process.env.BOHEMIA_SERVE_ONLY_OUT;
  const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const asked = new Set(), missed = new Set(), absent = new Set();
  const realOpen = D.open;
  D.open = async function (opts) {
    opts = Object.assign({}, opts || {});
    if (!opts.again) {
      const own = opts.serve || {};
      opts.serve = new Proxy({}, { get(_, u) {
        if (typeof u !== 'string') return undefined;
        if (own[u]) return own[u];
        const rel = u.replace(/^\//, '');
        asked.add(rel);
        if (LIST.has(rel)) return undefined;
        let isFile = false; try { isFile = fs.statSync(path.join(ROOT, rel)).isFile(); } catch (_) {}
        (isFile ? missed : absent).add(rel);
        return path.join(ROOT, '.not-published', rel);   /* a path that is never there: the driver answers 404 */
      } });
    }
    return realOpen(opts);
  };
  process.on('exit', () => { try { fs.writeFileSync(OUT, JSON.stringify({ asked: [...asked], missed: [...missed], absent: [...absent] })); } catch (_) {} });
  return;
}

const http = require('http');
const cp = require('child_process');
const os = require('os');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const L = require(path.join(ROOT, 'tools/bohemia_publish_list.js'));
const quick = process.argv.includes('--quick'), loopOnly = process.argv.includes('--loop');
let pass = 0, fail = 0;
const ok = (n, c, info) => { if (c) { pass++; console.log('  ok   ' + n + (info ? '  [' + info + ']' : '')); } else { fail++; console.log('  FAIL ' + n + (info ? '\n         ' + info : '')); } };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png',
  '.webp': 'image/webp', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.ogg': 'audio/ogg', '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json', '.txt': 'text/plain', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.webm': 'video/webm' };

/* a server like the live site after this change: the listed files, and a 404 for everything else */
function serveOnly(LIST, log) {
  const s = http.createServer((req, res) => {
    let u; try { u = decodeURIComponent(req.url.split('?')[0]); } catch (_) { u = req.url.split('?')[0]; }
    const rel = u.replace(/^\//, '');
    const ref = String(req.headers.referer || '').replace(/^https?:\/\/[^/]+\//, '').split('?')[0];
    if (!LIST.has(rel)) {
      let isFile = false; try { isFile = fs.statSync(path.join(ROOT, rel)).isFile(); } catch (_) {}
      if (isFile) { if (!log.missed.has(rel)) log.missed.set(rel, ref); } else log.absent.set(rel, ref);
      res.writeHead(404); return res.end();
    }
    log.asked.add(rel);
    const f = path.join(ROOT, rel);
    const head = { 'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'max-age=600' };
    try { head['Content-Length'] = fs.statSync(f).size; } catch (_) {}
    res.writeHead(200, head);
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(f).pipe(res);
  });
  return new Promise(r => s.listen(0, '127.0.0.1', () => r(s)));
}
const newLog = () => ({ asked: new Set(), missed: new Map(), absent: new Map() });
const named = m => [...m].slice(0, 8).map(([f, r]) => f + (r ? '  (asked by ' + r + ')' : '')).join('\n         ');

async function bootAlpha(browser, port, tabs) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 } });
  const page = await ctx.newPage();
  page.on('dialog', d => d.dismiss().catch(() => {}));
  await page.goto('http://127.0.0.1:' + port + '/slices/BOHEMIA_ALPHA_0_9.html', { waitUntil: 'load', timeout: 120000 }).catch(() => {});
  await sleep(8000);
  let n = 0;
  if (tabs) {
    const ps = await page.evaluate(() => [...document.querySelectorAll('#tabs .tab')].map(t => t.dataset.p).filter(Boolean)).catch(() => []);
    for (const p of ps) {
      await page.evaluate(q => { const t = document.querySelector('#tabs .tab[data-p="' + q + '"]'); if (t) t.click(); }, p).catch(() => {});
      n++;
      await sleep(3500);
    }
    await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
    await sleep(3000);
  }
  await ctx.close();
  return n;
}

(async () => {
  console.log('\nTHE SITE SERVES WHAT THE GAME LOADS' + (quick ? ' (--quick: the pages, no loop)' : loopOnly ? ' (--loop: the loop only)' : '') + '\n');
  const r = L.compute();
  const LIST = new Set(r.files);
  ok('L1 the publish list: ' + r.files.length + ' files, ' + (r.size / 1048576).toFixed(0) + ' MB (of ' + r.total + ' under ' + L.ROOTS.join(' ') + ')',
     r.files.length > 0 && L.ENTRIES.every(e => LIST.has(e)));
  const la = newLog(), lv = newLog(), lp = newLog();
  if (!loopOnly) {
  const browser = await chromium.launch();

  /* L2: the alpha, every tab pressed */
  const sa = await serveOnly(LIST, la);
  const nt = await bootAlpha(browser, sa.address().port, true);
  sa.close();
  ok('L2 the alpha and its ' + nt + ' tabs ask for ' + la.asked.size + ' files: none is off the list', nt > 5 && la.missed.size === 0,
     la.missed.size ? la.missed.size + ' OFF THE LIST, a 404 live:\n         ' + named(la.missed) : la.absent.size + ' asked that nobody made (a 404 on disk too)');

  /* L3: the VOTE tab, every card it can draw opened */
  const sv = await serveOnly(LIST, lv);
  { const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    await page.goto('http://127.0.0.1:' + sv.address().port + '/slices/BOHEMIA_VOTE_TAB.html', { waitUntil: 'load', timeout: 60000 }).catch(() => {});
    await page.waitForFunction(() => window.__voteReady, null, { timeout: 30000 }).catch(() => {});
    const cards = await page.evaluate(async () => {
      const f = document.getElementById('fold'); if (f && !f.hidden) f.click();
      await new Promise(r => setTimeout(r, 500));
      const b = [...document.querySelectorAll('button.look')]; b.forEach(x => x.click()); return b.length;
    }).catch(() => 0);
    await page.evaluate(() => { document.querySelectorAll('img').forEach(i => { i.loading = 'eager'; }); }).catch(() => {});
    for (let y = 0; y < 60; y++) { await page.evaluate(k => window.scrollTo(0, k * 900), y).catch(() => {}); await sleep(150); }
    await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
    await sleep(3000);
    await ctx.close();
    sv.close();
    const shown = L.shownCards(fs.readFileSync(path.join(ROOT, L.REGISTRY), 'utf8')) || [];
    ok('L3 the VOTE tab, ' + cards + ' cards opened (' + shown.length + ' it can draw), asks for ' + lv.asked.size + ' files: none is off the list',
       cards > 0 && lv.missed.size === 0, lv.missed.size ? lv.missed.size + ' OFF THE LIST:\n         ' + named(lv.missed) : lv.absent.size + ' asked that nobody made');
  }

  /* M1: one file the alpha really asked for, taken off the list, is named */
  { const victim = ['slices/BOHEMIA_CITY_WORLD.html', 'slices/BOHEMIA_VOTE_TAB.html'].find(f => la.asked.has(f)) || [...la.asked].find(f => f !== 'slices/BOHEMIA_ALPHA_0_9.html');
    const cut = new Set(LIST); cut.delete(victim);
    const lm = newLog(), sm = await serveOnly(cut, lm);
    await bootAlpha(browser, sm.address().port, false);
    sm.close();
    ok('M1 MUTATION: ' + victim + ' taken off the list, the alpha\'s boot names it', lm.missed.has(victim),
       lm.missed.has(victim) ? '' : 'the reader did not see it: L2 is not a measurement');
  }
  /* L5: every page the site serves, opened by itself (the fight, the town, the camp, the crew, the old tabs, a card's page) */
  const sp = await serveOnly(LIST, lp);
  const pages = r.files.filter(f => /\.html$/i.test(f));
  { const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 } });
    for (const pg of pages) {
      const page = await ctx.newPage();
      page.on('dialog', d => d.dismiss().catch(() => {}));
      await page.goto('http://127.0.0.1:' + sp.address().port + '/' + pg, { waitUntil: 'load', timeout: 45000 }).catch(() => {});
      await page.waitForLoadState('networkidle', { timeout: 6000 }).catch(() => {});
      await page.close().catch(() => {});
    }
    await ctx.close(); }
  sp.close();
  ok('L5 every page the site serves (' + pages.length + '), opened by itself, asks for ' + lp.asked.size + ' files: none is off the list',
     pages.length > 3 && lp.missed.size === 0, lp.missed.size ? lp.missed.size + ' OFF THE LIST:\n         ' + named(lp.missed) : lp.absent.size + ' asked that nobody made');
  await browser.close();

  }
  /* L4: the whole loop, played through the list */
  if (!quick) {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'bohemia-serve-only-'));
    const lf = path.join(tmp, 'list.txt'), of = path.join(tmp, 'asked.json');
    fs.writeFileSync(lf, r.files.join('\n') + '\n');
    const t0 = Date.now();
    const child = cp.spawnSync(process.execPath, ['-r', __filename, path.join(ROOT, 'gates/the_whole_loop_plays_gate.js')],
      { cwd: ROOT, env: Object.assign({}, process.env, { BOHEMIA_SERVE_ONLY_LIST: lf, BOHEMIA_SERVE_ONLY_OUT: of }), encoding: 'utf8', timeout: 20 * 60000, maxBuffer: 1 << 26 });
    const out = String(child.stdout || '') + String(child.stderr || '');
    const tail = out.trim().split('\n').filter(x => /THE WHOLE LOOP PLAYS:|THE LOOP BROKE|FAIL/.test(x)).slice(-3).join(' | ');
    let got = { asked: [], missed: [], absent: [] }; try { got = JSON.parse(fs.readFileSync(of, 'utf8')); } catch (_) {}
    ok('L4 THE WHOLE LOOP PLAYS through the list (' + ((Date.now() - t0) / 1000).toFixed(0) + ' s): ' + (tail || 'no result line'),
       child.status === 0, child.status === 0 ? '' : out.trim().split('\n').slice(-12).join('\n         '));
    ok('L4 the loop asked for ' + got.asked.length + ' files: none is off the list', got.asked.length > 0 && got.missed.length === 0,
       got.missed.length ? got.missed.length + ' OFF THE LIST:\n         ' + got.missed.slice(0, 8).join('\n         ') : got.absent.length + ' asked that nobody made');
  }
  const absent = new Map([...la.absent, ...lv.absent, ...lp.absent]);
  if (absent.size) console.log('\n  for information, asked and made by nobody (a 404 on disk too): ' + absent.size + '\n         ' + named(absent));
  console.log('\nTHE SITE SERVES WHAT THE GAME LOADS: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('THREW: ' + (e && e.stack || e)); process.exit(1); });
