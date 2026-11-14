#!/usr/bin/env node
/* ============================================================================
   FIGHT SCREEN: THE TEARDOWN'S MEASURING PASS (rule 449(b), rule 450(a); ask rows 616, 621)
   'First the teardown: screenshots of the fight on a phone both ways, every piece on the glass named and measured.'
   Opens the real page (the demo or the alpha) the way a stranger opens it, on a phone upright (390 x 844) or on its side
   (844 x 390), and reads three moments off the glass, each with a still:
     A  THE CARD THAT OPENS A FIGHT: the map's own meet card (his walk meets a crew: meetWalk, the map's own hand-over)
     B  THE BELL: ENGAGE pressed with a finger; the fight's first seconds (the why line, the strip, the phone's fight page)
     C  THE MAN'S CARD: a finger on his face on the phone (his sheet)
   For every piece that is on the glass (a button, a picture, a bar, a line of words): what it is, its box in points, its
   type size, its ink and its ground, and the contrast between them (WCAG's own ratio). Nothing is changed.
   node tools/bohemia_fight_screen_teardown.js <alpha|demo> <upright|sideways> <outdir>
   Writes <outdir>/teardown.json and <outdir>/shots/*.png.
   ========================================================================== */
'use strict';
const { chromium } = (function () { try { return require('/opt/node22/lib/node_modules/playwright'); } catch (e) { return require('playwright'); } })();
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const WHICH = process.argv[2] || 'demo', WAY = process.argv[3] || 'upright', OUT = process.argv[4] || '/tmp/fight_screen_teardown';
const BASE = 'https://paolosarn.github.io/bohemia/', FILE = WHICH === 'alpha' ? 'slices/BOHEMIA_ALPHA_0_9.html' : 'slices/BOHEMIA_DEMO.html';
const PUBLISHED = ['slices/', 'engine/', 'records/target/'];
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json' };
for (const d of ['', 'shots']) fs.mkdirSync(path.join(OUT, d), { recursive: true });
const { offTheTown } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), a.join(' '));
/* every piece on the glass under a root: run inside a frame */
const PIECES = (sel) => {
  const root = typeof sel === 'string' ? document.querySelector(sel) : sel; if (!root) return null;
  const lum = (c) => { const m = /rgba?\(([^)]+)\)/.exec(c); if (!m) return null; const p = m[1].split(',').map(Number); if (p.length > 3 && p[3] === 0) return null; const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(p[0]) + 0.7152 * f(p[1]) + 0.0722 * f(p[2]); };
  const ground = (e) => { for (let n = e; n && n !== document.documentElement; n = n.parentElement) { const st = getComputedStyle(n); if (lum(st.backgroundColor) !== null) return st.backgroundColor; if (st.backgroundImage && st.backgroundImage !== 'none') return 'picture'; } return null; };
  const out = [], rr = root.getBoundingClientRect(), vis = (e) => { const r = e.getBoundingClientRect(), st = getComputedStyle(e); return r.width > 2 && r.height > 2 && st.display !== 'none' && st.visibility !== 'hidden' && +st.opacity > 0.05 && r.bottom > 0 && r.right > 0 && r.top < innerHeight && r.left < innerWidth; };
  const all = [root].concat([...root.querySelectorAll('*')]).filter(vis);
  all.forEach((e) => { const own = [...e.childNodes].filter(n => n.nodeType === 3 && n.textContent.trim()).map(n => n.textContent.trim()).join(' '), tag = e.tagName.toLowerCase();
    const piece = e === root || tag === 'button' || tag === 'canvas' || tag === 'img' || e.getAttribute('role') === 'button' || own; if (!piece) return;
    const r = e.getBoundingClientRect(), st = getComputedStyle(e), g = ground(e), a = lum(st.color), b = g && g !== 'picture' ? lum(g) : null;
    out.push({ what: tag + (e.id ? '#' + e.id : '') + (e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : '') + (e.dataset && e.dataset.c ? '[' + e.dataset.c + ']' : ''),
      says: (own || e.getAttribute('aria-label') || e.title || '').slice(0, 60), box: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], type: own ? Math.round(parseFloat(st.fontSize) * 10) / 10 : null, face: own ? st.fontFamily.split(',')[0].replace(/["']/g, '') : null,
      ink: own ? st.color : null, ground: g, contrast: own && a !== null && b !== null ? Math.round((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05) * 10) / 10 : null,
      cut: own ? (e.scrollWidth > e.clientWidth + 1 || e.scrollHeight > e.clientHeight + 2) && st.overflow !== 'visible' : false, off: r.left < -1 || r.top < -1 || r.right > innerWidth + 1 || r.bottom > innerHeight + 1 }); });
  return { root: [Math.round(rr.left), Math.round(rr.top), Math.round(rr.width), Math.round(rr.height)], screen: [innerWidth, innerHeight], pieces: out };
};
(async () => {
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const VP = WAY === 'sideways' ? { width: 844, height: 390 } : { width: 390, height: 844 };
  const ctx = await browser.newContext({ viewport: VP, deviceScaleFactor: 2, hasTouch: true, isMobile: true, serviceWorkers: 'block' });
  await ctx.route('**/*', async (route) => { const u = route.request().url(); if (!u.startsWith(BASE)) return route.abort();
    const rel = decodeURIComponent(u.slice(BASE.length).split('?')[0].split('#')[0]), f = path.join(ROOT, rel);
    if (!PUBLISHED.some(p => rel.startsWith(p)) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) return route.fulfill({ status: 404, body: '' });
    return route.fulfill({ status: 200, body: fs.readFileSync(f), headers: { 'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'max-age=600' } }); });
  const page = await ctx.newPage(), errs = []; page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  const wait = (ms) => page.waitForTimeout(ms), until = async (fn, ms, step) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { try { if (await fn()) return true; } catch (e) {} await wait(step || 200); } return false; };
  const frame = (re) => page.frames().find(f => re.test(f.url())) || null, city = () => frame(/BOHEMIA_CITY_WORLD/), fightF = () => frame(/BOHEMIA_FIGHT\.html/);
  const box = async (f) => { if (f === page.mainFrame()) return { x: 0, y: 0 }; const h = await f.frameElement(); return h ? h.boundingBox() : null; };
  const tapSel = async (f, sel) => { const b = await f.evaluate((sel) => { const e = [...document.querySelectorAll(sel)].find(x => { const r = x.getBoundingClientRect(); return r.width > 3 && r.height > 3 && getComputedStyle(x).visibility !== 'hidden'; }); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, sel); if (!b) return false; const fb = await box(f); if (!fb) return false; await page.touchscreen.tap(fb.x + b.x, fb.y + b.y); return true; };
  const tapText = async (sel, re) => { for (const f of page.frames()) { try { const b = await f.evaluate(([sel, re]) => { const e = [...document.querySelectorAll(sel)].filter(x => new RegExp(re, 'i').test((x.textContent || '').trim())).filter(x => { const r = x.getBoundingClientRect(), st = getComputedStyle(x); return r.width > 2 && r.height > 2 && st.visibility !== 'hidden' && st.display !== 'none'; })[0]; if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, [sel, re]); if (b) { const fb = await box(f); if (fb) { await page.touchscreen.tap(fb.x + b.x, fb.y + b.y); return true; } } } catch (e) {} } return false; };
  const shot = async (n) => { try { await page.screenshot({ path: path.join(OUT, 'shots', n + '.png') }); } catch (e) {} };
  const T = { which: WHICH, way: WAY, viewport: VP, states: {} };
  await page.goto(BASE + FILE, { waitUntil: 'load', timeout: 300000 });
  await until(() => tapText('div,button,span', '^NEW GAME$'), 90000); await wait(2000);
  await until(() => tapText('#fronttap', 'BEGIN'), 90000); await wait(3500);
  await until(() => tapText('button,div', '^GO$'), 30000);
  if (WHICH === 'alpha') { await wait(2000); await page.evaluate(() => { const t = document.querySelector('.tab[data-p="run"]'); if (t) t.click(); }); }
  await until(async () => { const c = city(); return c && await c.evaluate(() => typeof LOOP !== 'undefined' && MODE === 'city' && !!LOOP.open); }, 90000); await wait(5000);
  try { await tapText('button.lv', 'LEAVE'); await until(async () => city().evaluate(() => !LOOP.open), 8000); await wait(1500); } catch (e) {}
  await city().evaluate(offTheTown).catch(() => null);
  /* A: the card that opens a fight */
  const met = await city().evaluate(() => { const w = (function () { try { return roadWhere(); } catch (e) { return [city.x, city.y]; } })(), band = ['brigand_raider', 'brigand_thug', 'brigand_thug', 'brigand_marksman'];
    const msg = { type: 'BOHEMIA_CITY_ENCOUNTER', label: 'the toll crew', faction: null, draft: true, packageId: 1, roster: band.map(() => ({ arch: 'human' })), party: { count: band.length, days: 40, difficulty: 1, faction: 'brigands', band: band, rolled: true }, street: true, why: 'road:toll_crew', at: { gx: w[0] | 0, gy: w[1] | 0 } };
    try { MEET.on = true; return { ok: meetWalk(function () { return cityHandOver(msg); }) }; } catch (e) { return { err: String(e) }; } }).catch(e => ({ err: String(e) }));
  const hasCard = await until(async () => city().evaluate(() => !!document.querySelector('button[data-meet="go"]')), 8000);
  await wait(1200); await shot('A_meet');
  T.states.A_meet = hasCard ? await city().evaluate((src) => { const P = new Function('return (' + src + ')')(); const go = document.querySelector('button[data-meet="go"]'); let root = go; for (let n = go; n && n !== document.body; n = n.parentElement) { const st = getComputedStyle(n); if (st.position === 'fixed' || st.position === 'absolute') { root = n; break; } } return P(root); }, PIECES.toString()) : { none: met };
  log('A the meet card:', hasCard ? (T.states.A_meet.pieces.length + ' pieces, box ' + T.states.A_meet.root.join(',')) : 'NOT SHOWN ' + JSON.stringify(met));
  /* B: the bell */
  /* no card and the hand-over said yes: the fight is already opening (never a second one over it); no card and no fight: the map's own road crew */
  if (hasCard) await tapSel(city(), 'button[data-meet="go"]');
  else if (!(met && met.ok && await until(async () => !!fightF(), 12000))) await city().evaluate(() => { try { MEET.on = false; return roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: 1 }); } catch (e) { return false; } });
  await until(async () => { const f = fightF(); return f && await f.evaluate(() => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.units.length > 0 && !!UI.board && !!UI.t0); }, 60000);
  const f = fightF();
  if (f) { await until(async () => f.evaluate(() => UI.why && document.getElementById('whyline').textContent.length === UI.why.line.length), 9000, 80); await shot('B_bell');
    T.states.B_fight_frame = await f.evaluate((src) => { const P = new Function('return (' + src + ')')(); const out = {}; ['#why', '#say', '#vet', '#call', '#top', '#bot', '#drawer', '#over', '#shotflash'].forEach(s => { const e = document.querySelector(s); out[s] = e && getComputedStyle(e).display !== 'none' ? P(s) : { shown: false }; });
      out.onCanvas = { man_px: typeof manH === 'function' ? Math.round(manH()) : null, tile: UI.tw ? [Math.round(UI.tw), Math.round(UI.th)] : null, his: FIGHT.S.units.filter(u => u.side === 'you').length, theirs: FIGHT.S.units.filter(u => u.side === 'them').length, order: !!document.getElementById('order') && getComputedStyle(document.getElementById('top')).display !== 'none' }; return out; }, PIECES.toString());
    T.states.B_phone = await page.evaluate((src) => { const P = new Function('return (' + src + ')')(); const e = [...document.querySelectorAll('.fight')].find(x => { const r = x.getBoundingClientRect(); return r.width > 20 && r.height > 20; }); if (!e) return { none: true }; let root = e; for (let n = e; n && n !== document.body; n = n.parentElement) { if (getComputedStyle(n).position === 'fixed') { root = n; break; } } const R = P(e); R.phone = (function () { const r = root.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)]; })(); return R; }, PIECES.toString());
    log('B the bell: phone', JSON.stringify(T.states.B_phone.phone), (T.states.B_phone.pieces || []).length + ' pieces; why', JSON.stringify((T.states.B_fight_frame['#why'] || {}).root), 'turn order on the glass:', T.states.B_fight_frame.onCanvas.order);
    /* C: the man's card */
    await wait(6500);
    const opened = await (async () => { for (const fr of page.frames()) { try { if (await tapSel(fr, 'button.fme')) return true; } catch (e) {} } return false; })(); await wait(1200); await shot('C_card');
    T.states.C_card = { tapped: opened, frame: await f.evaluate((src) => { const P = new Function('return (' + src + ')')(); const e = document.getElementById('drawer'); return e && getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().height > 10 ? P('#drawer') : { shown: false }; }, PIECES.toString()),
      shell: await page.evaluate((src) => { const P = new Function('return (' + src + ')')(); const c = [...document.querySelectorAll('.page, .sheet, [data-page]')].filter(x => { const r = x.getBoundingClientRect(), st = getComputedStyle(x); return r.width > 60 && r.height > 60 && st.display !== 'none' && st.visibility !== 'hidden'; })[0]; return c ? P(c) : { shown: false }; }, PIECES.toString()) };
    /* the sheet's own account of its fit (the rebuilt sheet, 11/14), type under 11 points, pieces off the glass; then a finger on a skill */
    T.states.C_card.sheet = await f.evaluate(() => { const d = document.getElementById('drawer'); if (!d || getComputedStyle(d).display === 'none') return null; const vis = e => { const r = e.getBoundingClientRect(), st = getComputedStyle(e); return r.width > 1 && r.height > 1 && st.display !== 'none'; }, all = [...d.querySelectorAll('*')].filter(vis), dr = d.getBoundingClientRect();
      return { fit: typeof UI !== 'undefined' ? UI.sheetFit || null : null, box: [Math.round(dr.left), Math.round(dr.top), Math.round(dr.width), Math.round(dr.height)], screen: [innerWidth, innerHeight], inside: dr.top >= -1 && dr.bottom <= innerHeight + 1 && dr.left >= -1 && dr.right <= innerWidth + 1,
        off: all.filter(e => { const r = e.getBoundingClientRect(); return r.top < -1 || r.bottom > innerHeight + 1 || r.right > innerWidth + 1; }).length, small: all.filter(e => [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())).map(e => parseFloat(getComputedStyle(e).fontSize)).filter(x => x < 11).length,
        face: !!d.querySelector('.sh-face'), words: [...d.querySelectorAll('.sh-slip .bst-ic')].map(e => getComputedStyle(e, '::after').content.replace(/"/g, '')).filter(x => x && x !== 'none').length, name: (d.querySelector('.sh-name') || {}).textContent || null, weapon: (d.querySelector('.sh-w b') || {}).textContent || null, skills: d.querySelectorAll('.sh-perks .p').length, ground: getComputedStyle(d).backgroundColor }; });
    const chip = await f.evaluate(() => { const e = document.querySelector('#drawer .sh-perks .p'); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    if (chip) { const fb = await box(f); await page.touchscreen.tap(fb.x + chip.x, fb.y + chip.y); await wait(350); T.states.C_card.read = await f.evaluate(() => ({ up: getComputedStyle(document.getElementById('drawer')).display !== 'none', text: (document.querySelector('#drawer .sh-read') || {}).textContent || '' })); await shot('C_card_read'); }
    log('C the sheet:', JSON.stringify(T.states.C_card.sheet), 'a finger on a skill:', JSON.stringify(T.states.C_card.read || null));
    log('C the man\'s card: tapped', opened, 'in the fight', JSON.stringify((T.states.C_card.frame || {}).root || 'not shown'), 'in the shell', JSON.stringify((T.states.C_card.shell || {}).root || 'not shown'));
  }
  T.errs = errs; fs.writeFileSync(path.join(OUT, 'teardown.json'), JSON.stringify(T, null, 1));
  log('DONE', WHICH, WAY, 'page errors', errs.length);
  await page.close(); await ctx.close(); await browser.close(); process.exit(0);
})().catch(e => { console.log('FATAL', String(e && e.stack || e).slice(0, 500)); process.exit(1); });
