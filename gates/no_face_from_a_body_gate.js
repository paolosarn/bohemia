/* NO FACE FROM A BODY (RUN TWO [the fresh portraits wired in], 10/18/26).
   Rule 115(h) AMENDED, his note on the starred-faces card: 'I liked it when it was the portrait, not when you zoom in on
   the creepy model's face... it has to be made fresh portrait.' A FRESH PORTRAIT, NEVER A ZOOM ON THE MODEL: the face
   is the head modelled on the body's own model and rendered for the portrait with its own camera, framing and light;
   a crop or zoom of a body sprite or render is never a portrait, not even as a stopgap.
   Eleven of the thirteen crew faces were exactly that (slices/rig_faces/, a rig body's head cut out and scaled x4)
   from 66923cf until this row. This gate is the machine that keeps it from coming back:
     STATIC  the crop bank and its tool are gone; no code in slices/ or engine/ names the crop bank or a body render
             (records/target/character/rig/) as a source; the face module reads only PORTRAIT's hand-off, whose
             thirteen looks all have their rest and four mouths at 64 and 128.
     LIVE    on his phone's profile (390 x 844 at 3x) with real taps, every face on the crew screen (the line, who is
             wearing what, the card) and on the settlement (YOU at the lot, the hall's keeper and its hires, a client
             at the board) is classified by where its pixels came from: a face of the thirteen looks must be PORTRAIT's
             own file pixel for pixel (its rest or one of its four mouths); any other face is the sheet's painted 64
             portrait at the right edge, a handed portrait or the dim head; nothing else passes. A planted body crop
             is fed to the same comparator and must be caught (a counter that never bites proves nothing).
     TALK    the mouth says the line: YOU at the lot, a client at the board and the card's man move through at least
             two of PORTRAIT's mouths on the beat and come back to rest when the line ends.
   Run: node gates/no_face_from_a_body_gate.js */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.dirname(__dirname), PORT = 8874;
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp' };
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };

/* ---------- STATIC ---------- */
ok('the crop bank is gone (slices/rig_faces/) and so is the tool that cut it', !fs.existsSync(path.join(ROOT, 'slices/rig_faces')) && !fs.existsSync(path.join(ROOT, 'tools/bohemia_run2_rig_faces.py')));
const code = [];
['slices', 'engine'].forEach(d => fs.readdirSync(path.join(ROOT, d)).filter(f => /\.(html|js)$/.test(f)).forEach(f => code.push(path.join(d, f))));
const BAD = /['"`][^'"`\n]*(rig_faces\/|character\/rig\/)[^'"`\n]*['"`]/;
const hits = code.filter(f => BAD.test(fs.readFileSync(path.join(ROOT, f), 'utf8')));
ok('no screen or engine file names the crop bank or a body render as a source (' + code.length + ' files read)', hits.length === 0, hits.slice(0, 3).join(' '));
const mod = fs.readFileSync(path.join(ROOT, 'engine/bohemia_crew_faces.js'), 'utf8');
const man = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/portrait/crew/BOHEMIA_CREW_FACES.json'), 'utf8'));
const looks = Object.keys(man.faces);
const modLooks = (mod.match(/var LOOKS = \[([^\]]+)\]/) || [, ''])[1].match(/'[^']+'/g) || [];
ok('the face module reads only PORTRAIT\'s hand-off folder, and knows the same thirteen looks', /BASE = '\.\.\/records\/target\/portrait\/crew\/'/.test(mod) && modLooks.length === 13 && looks.length === 13 && modLooks.every(l => looks.indexOf(l.slice(1, -1)) >= 0), modLooks.length + ' in the module, ' + looks.length + ' in the manifest');
const miss = [];
looks.forEach(l => ['rest', 'A', 'E', 'O', 'M'].forEach(k => [64, 128].forEach(n => { const f = 'records/target/portrait/crew/' + l + '/' + k + '_' + n + '.png'; if (!fs.existsSync(path.join(ROOT, f))) miss.push(f); })));
ok('  every look has its rest face and four mouths at 64 and 128 (' + looks.length * 10 + ' files)', miss.length === 0, miss.slice(0, 2).join(' '));
['slices/BOHEMIA_ROSTER_SCREEN.html', 'slices/BOHEMIA_SETTLEMENT_SCREEN.html'].forEach(f =>
  ok('  ' + path.basename(f) + ' loads the fresh portraits', /<script src="\.\.\/engine\/bohemia_crew_faces\.js"><\/script>/.test(fs.readFileSync(path.join(ROOT, f), 'utf8'))));

/* ---------- LIVE ---------- */
/* in the page: where did this canvas's pixels come from? */
const CLASSIFY = () => {
  const load = u => new Promise(r => { const im = new Image(); im.onload = () => r(im); im.onerror = () => r(null); im.src = u; });
  const px = (src, sx, sy, sw, sh, n) => { const o = document.createElement('canvas'); o.width = o.height = n; const x = o.getContext('2d');
    x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high'; x.drawImage(src, sx, sy, sw, sh, 0, 0, n, n); return x.getImageData(0, 0, n, n).data; };
  const same = (a, b) => { if (a.length !== b.length) return false; let bad = 0; for (let i = 0; i < a.length; i += 4) {
    if (Math.abs(a[i] - b[i]) > 2 || Math.abs(a[i + 1] - b[i + 1]) > 2 || Math.abs(a[i + 2] - b[i + 2]) > 2 || Math.abs(a[i + 3] - b[i + 3]) > 2) bad++; }
    return bad <= a.length / 4 * 0.01; };
  window.__whence = async c => {
    const F = window.BohemiaCrewFaces, look = c.dataset.look, k = c.dataset.face, n = c.width;
    const d = c.getContext('2d').getImageData(0, 0, n, n).data;
    let lit = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 0) lit++;
    if (lit < n * n * 0.3) return { k, look, from: 'blank', lit };
    if (k === 'fresh') { for (const key of ['rest', 'A', 'E', 'O', 'M']) { const im = await load(F.src(look, key, n)); if (im && same(d, px(im, 0, 0, im.naturalWidth, im.naturalHeight, n))) return { k, look, from: 'portrait:' + key }; }
      return { k, look, from: 'unknown' }; }
    if (k === 'sheet') { const im = await load(window.__sheetSrc(look)); if (im) for (const y of [0]) if (same(d, px(im, im.naturalWidth - 64, y, 64, 64, n))) return { k, look, from: 'sheet-edge' };
      return { k, look, from: 'unknown' }; }
    if (k === 'portrait' || k === 'none') return { k, look, from: k };
    return { k, look, from: 'unknown' };
  };
  window.__crop = async () => {   /* a CONTROL: the old way, a body's head cut out of the fight sheet and zoomed, labelled fresh */
    const im = await load(window.__sheetSrc('you')); const c = document.createElement('canvas'); c.width = c.height = 128;
    c.getContext('2d').drawImage(im, 41, 6, 32, 32, 0, 0, 128, 128); c.dataset.face = 'fresh'; c.dataset.look = 'you'; return window.__whence(c);
  };
};
const srv = http.createServer((rq, rs) => {
  const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
});
const THIRTEEN = new Set(looks);
const judge = (label, rows) => {
  const ours = rows.filter(r => THIRTEEN.has(r.look)), rest = rows.filter(r => !THIRTEEN.has(r.look));
  const good = ours.filter(r => r.k === 'fresh' && /^portrait:/.test(r.from));
  ok(label + ': every face of the thirteen looks is PORTRAIT\'s fresh portrait, pixel for pixel', ours.length > 0 && good.length === ours.length,
     good.length + ' of ' + ours.length + (good.length < ours.length ? ', first bad ' + JSON.stringify(ours.find(r => !(r.k === 'fresh' && /^portrait:/.test(r.from)))) : ''));
  const other = rest.filter(r => !/^(sheet-edge|portrait|none)$/.test(r.from));
  ok('  and no other face there comes from a body (' + rest.length + ' others: the painted 64, a handed portrait or the dim head)', other.length === 0, other.slice(0, 2).map(r => JSON.stringify(r)).join(' '));
};
const watch = async (p, sel, ms) => p.evaluate(({ sel, ms }) => new Promise(res => {
  const c = document.querySelector(sel); if (!c) return res({ seen: [], said: false, face: null });
  const seen = []; const t0 = performance.now();
  const iv = setInterval(() => { const m = c.dataset.mouth; if (m && seen[seen.length - 1] !== m) seen.push(m);
    if (c.dataset.said === '1' || performance.now() - t0 > ms) { clearInterval(iv); res({ seen, said: c.dataset.said === '1', face: c.dataset.face, look: c.dataset.look }); } }, 40);
}), { sel, ms });
const talked = (label, w) => {
  const mouths = new Set(w.seen.filter(m => m !== 'rest'));
  ok(label, w.face === 'fresh' && mouths.size >= 2 && w.said && w.seen[w.seen.length - 1] === 'rest', (w.look || '') + ' ' + w.seen.slice(0, 14).join('') + (w.seen.length > 14 ? '...' : '') + (w.said ? ', rests' : ', never rests'));
};

(async () => {
  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const errs = [];

  /* the crew screen */
  const p = await ctx.newPage();
  p.on('pageerror', e => errs.push('roster: ' + e.message));
  await p.addInitScript(() => { try { localStorage.setItem('bohemia.formation.v1', 'null'); } catch (e) {} });
  await p.addInitScript(CLASSIFY);
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_ROSTER_SCREEN.html', { waitUntil: 'load' });
  await p.waitForFunction(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready, null, { timeout: 30000 });
  await p.evaluate(() => { window.__sheetSrc = l => BohemiaRoster.sheetSrc(l); });
  const card = await watch(p, '#card canvas.face', 20000);
  talked('the crew screen: the man on the card says his line, the mouth on the beat, then rests', card);
  const rrows = await p.evaluate(async () => { const out = []; for (const c of document.querySelectorAll('canvas.head, canvas.wface, #card canvas.face')) out.push(await window.__whence(c)); return out; });
  ok('the crew screen shows at least the line, who is wearing what and the card (25 faces)', rrows.length >= 25, rrows.length + ' faces');
  judge('the crew screen', rrows);
  const crop = await p.evaluate(() => window.__crop());
  ok('CONTROL: a body\'s head cut from the fight sheet and zoomed x4, labelled fresh, is caught', crop.from === 'unknown', JSON.stringify(crop));

  /* the settlement */
  const s = await ctx.newPage();
  s.on('pageerror', e => errs.push('settlement: ' + e.message));
  await s.addInitScript(CLASSIFY);
  await s.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
  await s.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready(), null, { timeout: 30000 });
  await s.evaluate(() => { window.__sheetSrc = l => 'fight_people/' + l + '.webp'; });
  await s.waitForTimeout(400);
  const tapB = async k => {
    if (await s.evaluate(() => document.getElementById('sheet').classList.contains('on'))) { await s.click('#close'); await s.waitForTimeout(300); }
    const xy = await s.evaluate(k => BohemiaSettlement.where(k), k);
    await s.mouse.click(xy.x, xy.y); await s.waitForTimeout(150);
  };
  const faces = () => s.evaluate(async () => { await new Promise(r => setTimeout(r, 400)); const out = []; for (const c of document.querySelectorAll('#sheet canvas.face')) out.push(await window.__whence(c)); return out; });
  await s.evaluate(() => BohemiaSettlement.open({ place: { tier: 'town', name: 'THE WASH, NORTH LAS VEGAS' }, traits: [], fights: [{ day: 3, fallen: 2 }] }));
  await s.waitForTimeout(300);
  await tapB('lot');
  const lot = await watch(s, '#sbody canvas.face', 20000);
  talked('the lot: YOU say where the two men fell, the mouth on the beat, then rest', lot);
  ok('  and it is YOUR face', lot.look === 'you', lot.look);
  judge('the lot', await faces());
  await tapB('hall');
  judge('the hall (its keeper and the men who want work)', await faces());
  await tapB('board');
  const cl = await s.evaluate(() => { const b = document.querySelector('#sheet .act.client'); return b ? b.dataset.id : null; });
  ok('the board has a client with a face to tap', !!cl, cl);
  if (cl) {
    judge('the board (its keeper and the clients)', await faces());
    await s.click('#sheet .act.client'); await s.waitForTimeout(80);
    const said = await watch(s, '#sbody .who canvas.face', 30000);
    talked('the client speaks the job under his face, the mouth on the beat, then rests', said);
  }
  ok('no page errors on either screen', errs.length === 0, errs.slice(0, 2).join(' | '));
  await b.close(); srv.close();
  console.log('\nNO FACE FROM A BODY: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
