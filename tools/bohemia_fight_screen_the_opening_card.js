#!/usr/bin/env node
/* ============================================================================
   FIGHT SCREEN TWO: THE CARD THAT OPENS A FIGHT, ON THE PAGE HE PLAYS (rule 450(a), rule 441(a); ask row 621)
   Opens the real page (the demo or the alpha) the way a stranger opens it, on a phone upright (390 x 844) or on its side
   (844 x 390), and meets three bands through the map's own card (his walk meets a crew: meetWalk, the map's own hand-over):
     a led crew (a leader among them), a crew of thugs (nobody leads; the one look whose model carries a pipe is in their
     pool), a pack of beasts (one of HIS men says why). For each: a still, and read off the glass: does the card fit, is any
     type under 11 points, is any piece off the glass, the two rows of faces (theirs, his), whose face says the sentence and
     whether it was drawn, the sentence, the two buttons (a thumb each, nothing lying on them).
   The first two are answered FALL BACK with a finger; the last is ENGAGED with a finger, and at the bell the fight's own
   account is read (UI.whySaid.card): did the man wearing the card's face say the card's sentence.
   node tools/bohemia_fight_screen_the_opening_card.js <alpha|demo> <upright|sideways> <outdir> [engage: led|thugs|beasts]
   Writes <outdir>/opening_card.json and <outdir>/shots/*.png.
   ========================================================================== */
'use strict';
const { chromium } = (function () { try { return require('/opt/node22/lib/node_modules/playwright'); } catch (e) { return require('playwright'); } })();
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const WHICH = process.argv[2] || 'demo', WAY = process.argv[3] || 'upright', OUT = process.argv[4] || '/tmp/opening_card', ENGAGE = process.argv[5] || 'led';
const BASE = 'https://paolosarn.github.io/bohemia/', FILE = WHICH === 'alpha' ? 'slices/BOHEMIA_ALPHA_0_9.html' : 'slices/BOHEMIA_DEMO.html';
const PUBLISHED = ['slices/', 'engine/', 'records/target/'];
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.txt': 'text/plain' };
for (const d of ['', 'shots']) fs.mkdirSync(path.join(OUT, d), { recursive: true });
const { offTheTown } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), a.join(' '));
const BANDS = {
  led: { label: 'the toll crew', why: 'road:toll_crew', faction: 'brigands', arch: 'human', band: ['brigand_thug', 'brigand_thug', 'brigand_leader', 'brigand_raider', 'brigand_marksman', 'brigand_thug'] },
  thugs: { label: 'the pipe boys', why: 'party:pipe_boys:caught', faction: 'brigands', arch: 'human', band: ['brigand_thug', 'brigand_thug', 'brigand_thug', 'brigand_thug'] },
  beasts: { label: 'dogs in the wrecks', why: 'road:dogs', faction: 'beasts', arch: 'beast', band: ['direwolf', 'direwolf', 'hyena'] } };
(async () => {
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const VP = WAY === 'sideways' ? { width: 844, height: 390 } : { width: 390, height: 844 };
  const ctx = await browser.newContext({ viewport: VP, deviceScaleFactor: 2, hasTouch: true, isMobile: true, serviceWorkers: 'block' });
  await ctx.route('**/*', async (route) => { const u = route.request().url(); if (!u.startsWith(BASE)) return route.abort();
    const rel = decodeURIComponent(u.slice(BASE.length).split('?')[0].split('#')[0]), f = path.join(ROOT, rel);
    if (process.env.BEFORE && /bohemia_fight_opener\.js$/.test(rel)) return route.fulfill({ status: 200, body: '/* the card as it was: this lane\'s file left out, for the BEFORE still */', headers: { 'Content-Type': 'text/javascript' } });
    if (!PUBLISHED.some(p => rel.startsWith(p)) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) return route.fulfill({ status: 404, body: '' });
    return route.fulfill({ status: 200, body: fs.readFileSync(f), headers: { 'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'max-age=600' } }); });
  const page = await ctx.newPage(), errs = []; page.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  const wait = (ms) => page.waitForTimeout(ms), until = async (fn, ms, step) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { try { if (await fn()) return true; } catch (e) {} await wait(step || 200); } return false; };
  const frame = (re) => page.frames().find(f => re.test(f.url())) || null, city = () => frame(/BOHEMIA_CITY_WORLD/), fightF = () => frame(/BOHEMIA_FIGHT\.html/);
  const box = async (f) => { if (f === page.mainFrame()) return { x: 0, y: 0 }; const h = await f.frameElement(); return h ? h.boundingBox() : null; };
  const tapSel = async (f, sel) => { const b = await f.evaluate((sel) => { const e = [...document.querySelectorAll(sel)].find(x => { const r = x.getBoundingClientRect(); return r.width > 3 && r.height > 3 && getComputedStyle(x).visibility !== 'hidden'; }); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, sel); if (!b) return false; const fb = await box(f); await page.touchscreen.tap(fb.x + b.x, fb.y + b.y); return true; };
  const tapText = async (sel, re) => { for (const f of page.frames()) { try { const b = await f.evaluate(([sel, re]) => { const e = [...document.querySelectorAll(sel)].filter(x => new RegExp(re, 'i').test((x.textContent || '').trim())).filter(x => { const r = x.getBoundingClientRect(), st = getComputedStyle(x); return r.width > 3 && r.height > 3 && st.visibility !== 'hidden' && st.display !== 'none'; }).pop(); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, [sel, re]); if (!b) continue; const fb = await box(f); await page.touchscreen.tap(fb.x + b.x, fb.y + b.y); return true; } catch (e) {} } return false; };
  const shot = async (n) => { try { await page.screenshot({ path: path.join(OUT, 'shots', n + '.png') }); } catch (e) {} };
  const T = { which: WHICH, way: WAY, viewport: VP, engage: ENGAGE, cards: {}, bell: null };
  await page.goto(BASE + FILE, { waitUntil: 'load', timeout: 300000 });
  await until(() => tapText('div,button,span', '^NEW GAME$'), 90000); await wait(2000);
  await until(() => tapText('#fronttap', 'BEGIN'), 90000); await wait(3500);
  await until(() => tapText('button,div', '^GO$'), 30000);
  /* the maker must be gone before the map is read (a GO pressed too early is pressed again) */
  for (let i = 0; i < 4; i++) { const up = await page.evaluate(() => { const m = document.getElementById('mainmaker'); return !!m && getComputedStyle(m).display !== 'none' && m.getBoundingClientRect().height > 50; }); if (!up) break; await wait(1500); await tapText('button,div', '^GO$'); await wait(1500); }
  if (WHICH === 'alpha') { await wait(2000); await page.evaluate(() => { const t = document.querySelector('.tab[data-p="run"]'); if (t) t.click(); }); }
  await until(async () => { const c = city(); return c && await c.evaluate(() => typeof LOOP !== 'undefined' && MODE === 'city' && !!LOOP.open); }, 90000); await wait(5000);
  try { await tapText('button.lv', 'LEAVE'); await until(async () => city().evaluate(() => !LOOP.open), 8000); await wait(1500); } catch (e) {}
  /* the alpha's RUN tab leaves a town onto the old street; the card lives on the map, so the map is opened with the game's own swap */
  T.swapped = await city().evaluate(() => { if (MODE !== 'city') { try { swapMode(); return true; } catch (e) { return String(e).slice(0, 80); } } return false; }).catch(e => String(e));
  await until(async () => city().evaluate(() => MODE === 'city'), 8000); await wait(1500);
  await city().evaluate(offTheTown).catch(() => null);
  await until(async () => city().evaluate(() => !!(window.BohemiaJobDanger && BohemiaJobDanger.ready())), 30000);
  const order = Object.keys(BANDS).filter(k => k !== ENGAGE).concat([ENGAGE]);
  T.before = await city().evaluate(() => ({ mode: MODE, open: !!LOOP.open, meet: MEET.on, hold: (function () { try { return townDoorHolds({ type: 'BOHEMIA_CITY_ENCOUNTER', at: { gx: city.x, gy: city.y } }); } catch (e) { return String(e).slice(0, 80); } })(), at: [city.x, city.y] })).catch(e => String(e)); log('before', JSON.stringify(T.before));
  for (const k of order) {
    const B = BANDS[k];
    const met = await city().evaluate((B) => { const w = (function () { try { return roadWhere(); } catch (e) { return [city.x, city.y]; } })();
      const msg = { type: 'BOHEMIA_CITY_ENCOUNTER', label: B.label, faction: B.faction === 'beasts' ? 'beasts' : null, draft: true, packageId: 1, roster: B.band.map(() => ({ arch: B.arch })), party: { count: B.band.length, days: 40, difficulty: 1, faction: B.faction, band: B.band, rolled: true }, street: true, why: B.why, at: { gx: w[0] | 0, gy: w[1] | 0 } };
      try { MEET.on = true; if (typeof MEET_BACK !== 'undefined') { try { MEET_BACK.until = 0; MEET_BACK.key = null; } catch (e) {} } return { ok: meetWalk(function () { return cityHandOver(msg); }) }; } catch (e) { return { err: String(e) }; } }, B).catch(e => ({ err: String(e) }));
    const hasCard = await until(async () => city().evaluate(() => !!document.querySelector('#meetcard button[data-meet="go"]')), 8000);
    if (!hasCard) { const why = await city().evaluate(() => ({ mode: typeof MODE !== 'undefined' ? MODE : null, meetOn: MEET.on, up: !!MEET.up, open: !!(LOOP && LOOP.open), back: typeof MEET_BACK !== 'undefined' ? JSON.stringify(MEET_BACK).slice(0, 200) : null, going: !!document.getElementById('meetcard-going') })).catch(e => String(e));
      T.cards[k] = { shown: false, met: met, why: why, fight: !!fightF() }; log(k, 'NO CARD', JSON.stringify(met), JSON.stringify(why), 'fight frame', !!fightF()); await shot('nocard_' + k); continue; }
    if (process.env.BEFORE) { await wait(6000); await shot('before_' + k); T.cards[k] = { before: true, box: await city().evaluate(() => { const b = document.querySelector('#meetcard .mc').getBoundingClientRect(); return [Math.round(b.left), Math.round(b.top), Math.round(b.width), Math.round(b.height)]; }) }; log(k, 'BEFORE', JSON.stringify(T.cards[k].box));
      await tapSel(city(), '#meetcard button[data-meet="back"]'); await until(async () => city().evaluate(() => !document.getElementById('meetcard')), 6000); await wait(2500); await city().evaluate(() => { try { MEET_BACK.list.length = 0; MEET_BACK.until = 0; MEET_BACK.key = null; MEET_BACK.left = 0; } catch (e) {} }); await city().evaluate(offTheTown).catch(() => null); await wait(600); continue; }
    await until(async () => city().evaluate(() => { const L = window.BohemiaFightOpener && BohemiaFightOpener.last; return !!(L && L.read && (L.typed || L.read.none)); }), 8000, 60);
    await wait(1300); await shot('card_' + k);
    const cb = await box(city());
    const C = await city().evaluate(() => { const el = document.getElementById('meetcard'), mc = el.querySelector('.mc'), L = BohemiaFightOpener.last, R = L.read || {};
      const vis = e => { const r = e.getBoundingClientRect(), st = getComputedStyle(e); return r.width > 1 && r.height > 1 && st.display !== 'none' && st.visibility !== 'hidden'; }, all = [...mc.querySelectorAll('*')].filter(vis), b = mc.getBoundingClientRect();
      const inked = c => { try { const g = c.getContext('2d'), d = g.getImageData(0, 0, c.width, c.height).data, seen = new Set(); for (let i = 0; i < d.length; i += 16 * 4) seen.add((d[i] >> 4) + ',' + (d[i + 1] >> 4) + ',' + (d[i + 2] >> 4)); return seen.size; } catch (e) { return -1; } };
      const btn = s => { const e = mc.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(), top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return { box: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], clear: top === e || e.contains(top) }; };
      const rowT = mc.querySelector('.mco-row[data-side="them"]'), rowY = mc.querySelector('.mco-row[data-side="you"]'), big = mc.querySelector('.mco-photo canvas');
      return { dressed: el.classList.contains('mco'), wide: el.classList.contains('wide'), fit: L.fit, box: [Math.round(b.left), Math.round(b.top), Math.round(b.width), Math.round(b.height)], screen: [innerWidth, innerHeight],
        inside: b.top >= -1 && b.left >= -1 && b.right <= innerWidth + 1 && b.bottom <= innerHeight + 1,
        off: all.filter(e => { const r = e.getBoundingClientRect(); return r.top < b.top - 1 || r.bottom > b.bottom + 1 || r.left < b.left - 1 || r.right > b.right + 1; }).length,
        small: all.filter(e => [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())).map(e => [e.className || e.tagName, parseFloat(getComputedStyle(e).fontSize)]).filter(x => x[1] < 11),
        cut: all.filter(e => [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) && (e.scrollWidth > e.clientWidth + 1) && getComputedStyle(e).overflow !== 'visible').length,
        name: (mc.querySelector('.mch') || {}).textContent, sub: (mc.querySelector('.mcs [data-n]') || {}).textContent, n: +(mc.querySelector('.mcs [data-n]') || { dataset: {} }).dataset.n,
        themFaces: rowT ? rowT.children.length : 0, themSure: rowT ? [...rowT.children].filter(c => c.dataset.sure === '1').length : 0, themInk: rowT ? [...rowT.children].map(inked) : [], youFaces: rowY ? rowY.children.length : 0, youData: +(mc.querySelector('.mcyou') || { dataset: {} }).dataset.you,
        faceSize: rowT && rowT.firstChild ? Math.round(rowT.firstChild.getBoundingClientRect().width) : null, faceSizeYou: rowY && rowY.firstChild ? Math.round(rowY.firstChild.getBoundingClientRect().width) : null,
        speaker: R.speaker || null, side: R.side || null, line: R.line || null, shown: (mc.querySelector('.mco-say span') || {}).textContent, sayName: (mc.querySelector('.mco-say b') || {}).textContent, rule: R.rule || null, how: R.how || null, who: R.who || null, ms: R.ms, none: R.none || null,
        face: L.face, bigInk: big ? inked(big) : 0, bigDark: !!mc.querySelector('.mco-photo.dark'), bigBox: big ? Math.round(big.getBoundingClientRect().width) : 0,
        go: btn('[data-meet="go"]'), back: btn('[data-meet="back"]'), stars: (mc.querySelector('.mcstars') || { children: [] }).children.length || ((mc.querySelector('.mcstars') || {}).textContent || '').length, ground: (mc.querySelector('.mcg') || {}).textContent }; });
    /* is anything of the shell's lying on the buttons (the phone, a lesson)? asked of the top page */
    for (const b of ['go', 'back']) if (C[b]) { const x = cb.x + C[b].box[0] + C[b].box[2] / 2, y = cb.y + C[b].box[1] + C[b].box[3] / 2; C[b].shellClear = await page.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return !!e && e.tagName === 'IFRAME'; }, [x, y]); }
    T.cards[k] = C;
    log(k, 'card', JSON.stringify({ box: C.box, fits: C.fit && C.fit.fits, step: C.fit && C.fit.step, inside: C.inside, off: C.off, small: C.small.length, cut: C.cut, them: C.themFaces + '/' + C.n + ' sure ' + C.themSure, you: C.youFaces + '/' + C.youData, face: C.face, by: C.speaker && C.speaker.name, look: C.speaker && C.speaker.look, sure: C.speaker && C.speaker.sure, go: C.go, back: C.back, ms: C.ms }), '|', C.shown);
    if (k !== ENGAGE) { await tapSel(city(), '#meetcard button[data-meet="back"]'); await until(async () => city().evaluate(() => !document.getElementById('meetcard')), 6000); await wait(2500);
      /* FALL BACK steps him two blocks away, sometimes onto a town's ground, where a crew waits at the door: off the town again, the get-away cleared */
      await city().evaluate(() => { try { if (typeof MEET_BACK !== 'undefined') { MEET_BACK.list.length = 0; MEET_BACK.until = 0; MEET_BACK.key = null; MEET_BACK.left = 0; } } catch (e) {} }); await city().evaluate(offTheTown).catch(() => null); await wait(600); continue; }
    /* the bell */
    await tapSel(city(), '#meetcard button[data-meet="go"]');
    await until(async () => { const f = fightF(); return f && await f.evaluate(() => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.units.length > 0 && !!UI.board && !!UI.t0); }, 60000);
    const f = fightF();
    if (!f) { T.bell = { none: 'no fight' }; log('NO FIGHT'); break; }
    await until(async () => f.evaluate(() => !!UI.whySaid), 15000, 80);
    await until(async () => f.evaluate(() => UI.why && document.getElementById('whyline').textContent.length === UI.why.line.length), 9000, 80); await shot('bell_' + k);
    T.bell = await f.evaluate(() => { const W = UI.whySaid || {}, el = document.getElementById('why'), r = el.getBoundingClientRect();
      return { said: W, small: el.classList.contains('said'), box: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], shown: getComputedStyle(el).display !== 'none', line: document.getElementById('whyline').textContent,
        them: FIGHT.S.units.filter(u => u.side === 'them').map(u => u.kind + ':' + u.look), mine: FIGHT.S.units.filter(u => u.side === 'you' && FIGHT.onField(u)).map(u => u.name + ':' + u.look) }; });
    const C2 = T.cards[k]; T.bell.sameLine = !!(C2.line && T.bell.said.line === C2.line); T.bell.sameFace = !!(C2.speaker && T.bell.said.byLook === C2.speaker.look);
    T.bell.cardFacesOnBoard = C2.speaker ? null : null;
    log('bell', JSON.stringify({ by: T.bell.said.by, look: T.bell.said.byLook, card: T.bell.said.card, small: T.bell.small, sameLine: T.bell.sameLine, sameFace: T.bell.sameFace }), '|', T.bell.said.line);
  }
  T.errs = errs; fs.writeFileSync(path.join(OUT, 'opening_card.json'), JSON.stringify(T, null, 1));
  log('DONE', WHICH, WAY, 'page errors', errs.length, errs.slice(0, 2).join(' | '));
  await page.close(); await ctx.close(); await browser.close(); process.exit(0);
})().catch(e => { console.log('FATAL', String(e && e.stack || e).slice(0, 600)); process.exit(1); });
