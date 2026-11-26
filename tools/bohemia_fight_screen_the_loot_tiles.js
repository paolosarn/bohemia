#!/usr/bin/env node
/* FIGHT SCREEN THREE 11/26 (VAMILY rule 482: cleaning up, improving what is there; the end screen, sideways): every piece of loot's tile on
   the end screen, read on the page at five phone shapes, upright and on its side: its picture and its name both inside the tile, the
   name whole in height (a name sliced by the tile's floor is the defect: 'door' half gone, the axe's and the flail's not there at all,
   measured on the demo on its side 11/26), cut in width only by its own ellipsis.
   node tools/bohemia_fight_screen_the_loot_tiles.js <outdir>      writes <outdir>/loot_tiles.json and a still per shape
   BEFORE=1 serves the end screen as HEAD has it. */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const ROOT = path.join(__dirname, '..'), OUT = process.argv[2] || '/tmp/loot_tiles';
fs.mkdirSync(OUT, { recursive: true });
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp', '.woff2': 'font/woff2', '.css': 'text/css' };
const OLD = process.env.BEFORE ? execSync('git show HEAD:slices/BOHEMIA_SPOILS_SCREEN.html', { cwd: ROOT, maxBuffer: 1 << 26 }) : null;
const SHAPES = [['upright', 390, 844], ['sideways', 844, 390], ['small upright', 360, 740], ['small sideways', 667, 375], ['big sideways', 932, 430]];
(async () => {
  const srv = http.createServer((rq, rs) => {
    const rel = decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''), f = path.join(ROOT, rel);
    if (OLD && rel === 'slices/BOHEMIA_SPOILS_SCREEN.html') { rs.setHeader('content-type', 'text/html'); return rs.end(OLD); }
    if (process.env.LOOT_PLANT && rel === 'slices/BOHEMIA_SPOILS_SCREEN.html') {   /* the plant: __THE_LOOT_READS__'s rules taken out */
      const src = fs.readFileSync(f, 'utf8'), cut = src.replace(/\.slot > span:not\(\.cw\)\{[^}]*\}/, '').replace(/\.slot:has\(> \.cw\)\{[^}]*\}/, '').replace(/\.slot img\.pk,\.slot canvas\{[^}]*\}/, '').replace(/\.slot canvas\{width:auto!important[^}]*\}/, '');
      if (cut === src) { console.log('LOOT_PLANT DID NOT TAKE'); process.exit(1); } rs.setHeader('content-type', 'text/html'); return rs.end(cut); }
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
    rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
  });
  await new Promise(r => srv.listen(0, '127.0.0.1', r));
  const base = 'http://127.0.0.1:' + srv.address().port;
  const { chromium } = require('playwright');
  const b = await chromium.launch(), errs = [];
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const sp = await ctx.newPage(); sp.on('pageerror', e => errs.push(e.message));
  await sp.goto(base + '/slices/BOHEMIA_SPOILS_SCREEN.html');
  await sp.waitForFunction(() => window.BohemiaSpoilsScreen && BohemiaSpoilsScreen.state.opened, null, { timeout: 30000 });
  const T = { before: !!OLD, shapes: {} };
  for (const [name, w, h] of SHAPES) {
    await sp.setViewportSize({ width: w, height: h });
    await sp.evaluate(() => { localStorage.setItem('bohemia.bag.v1', '[]'); BohemiaSpoilsScreen.open({ fight: BohemiaSpoilsScreen.SAMPLE, seed: 7 }); });
    await sp.waitForTimeout(2200);
    T.shapes[name] = await sp.evaluate(() => [...document.querySelectorAll('.slot.full')].filter(s => s.getBoundingClientRect().width > 0 && getComputedStyle(s).display !== 'none').map(s => {
      const r = s.getBoundingClientRect(), cs = getComputedStyle(s), pb = parseFloat(cs.paddingBottom) || 0, pt = parseFloat(cs.paddingTop) || 0;
      const n = [...s.children].find(x => x.tagName === 'SPAN' && !x.classList.contains('cw')), p = s.querySelector('img,canvas,i');
      const nr = n ? n.getBoundingClientRect() : null, pr = p ? p.getBoundingClientRect() : null;
      return { where: s.dataset.where, name: n ? n.textContent : '', tile: [Math.round(r.width), Math.round(r.height)],
        nameWhole: !!nr && nr.height > 4 && nr.top >= r.top + pt - 0.6 && nr.bottom <= r.bottom - pb + 0.6,
        nameCutBy: nr ? Math.max(0, Math.round((nr.bottom - (r.bottom - pb)) * 10) / 10, Math.round(((r.top + pt) - nr.top) * 10) / 10) : null,
        picIn: !!pr && pr.top >= r.top - 0.6 && pr.bottom <= r.bottom + 0.6 && pr.height > 6, pic: pr ? [Math.round(pr.width), Math.round(pr.height)] : null,
        barOver: (function () { const cw = s.querySelector('.cw'); if (!cw || !nr) return false; const c = cw.getBoundingClientRect(); return Math.min(c.bottom, nr.bottom) - Math.max(c.top, nr.top) > 0.5 && Math.min(c.right, nr.right) - Math.max(c.left, nr.left) > 0.5; })(),
        picOverName: !!pr && !!nr && pr.bottom > nr.top + 0.6,
        squashed: (function () { if (!pr || !p) return false; const nat = p.tagName === 'IMG' ? (p.naturalWidth && p.naturalHeight ? p.naturalWidth / p.naturalHeight : null) : p.tagName === 'CANVAS' ? p.width / p.height : null;
          return nat != null && Math.abs(pr.width / pr.height - nat) > 0.12; })() };
    }));
    await sp.screenshot({ path: path.join(OUT, 'loot_' + name.replace(/ /g, '_') + '.png') }).catch(() => {});
    const L = T.shapes[name], bad = L.filter(t => !t.nameWhole || !t.picIn || t.barOver || t.picOverName || t.squashed);
    console.log(name.padEnd(15), w + 'x' + h, L.length + ' tiles,', bad.length + ' cut:', bad.slice(0, 6).map(t => t.where + ' "' + t.name + '" tile ' + t.tile.join('x') + ' pic ' + (t.pic || []).join('x') + ' cut ' + t.nameCutBy + (t.barOver ? ' BAR OVER THE NAME' : '') + (t.picOverName ? ' PICTURE OVER THE NAME' : '') + (t.squashed ? ' SQUASHED' : '')).join(' | '));
  }
  T.errs = errs; fs.writeFileSync(path.join(OUT, 'loot_tiles.json'), JSON.stringify(T, null, 1));
  console.log('page errors', errs.length);
  await b.close(); srv.close(); process.exit(0);
})().catch(e => { console.log('FATAL', String(e && e.stack || e).slice(0, 500)); process.exit(1); });
