#!/usr/bin/env node
/* ============================================================================
   COMBAT THREE: A BOARD PROVEN ON THE PAGE HE PLAYS (rule 441(a), rule 435(d)'s way; ask rows 539 and 555)

   Opens the real page (the alpha or the demo) the way a stranger opens it (the title, NEW GAME, BEGIN, GO), on a phone upright
   (390 x 844) or on its side (844 x 390), and starts each fight by the map's own handover (window.nfOpen, the encounter the map
   sends) at a cell of the map. In every fight:
     - the board the fight was dealt is read off the page (its name, its inside, its layout);
     - with AUTO off and a man of his on his turn, a finger taps one tile of every kind in his reach and the line on the glass
       (#say) is read against the fight's own word for that tile, and the walk's AP against the tile table's;
     - AUTO and the speed button are pressed with a finger on the phone's own buttons (1x, 2x, 4x in turn);
     - every turn is logged from the page's own calls (FIGHT.aiStep: who was asked, what he did; the notes drawn: startAnim);
       where his men stand after the first round is read (the scramble off the open floor);
     - page errors are counted, a still is taken at the start, at the round a board's own event comes (the flood), at the end.
   node tools/bohemia_combat_three_on_the_page.js <alpha|demo> <upright|sideways> <outdir> <tunnels|garage|boss|district:NAME> [fights=4]
   Writes <outdir>/page.json, <outdir>/shots/*.png, <outdir>/video/*.webm. Served from disk at the real address, service worker off.
   ========================================================================== */
'use strict';
const { chromium } = (function () { try { return require('/opt/node22/lib/node_modules/playwright'); } catch (e) { return require('playwright'); } })();
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const WHICH = process.argv[2] || 'demo', WAY = process.argv[3] || 'upright', OUT = process.argv[4] || '/tmp/combat3_page', WANT = process.argv[5] || 'tunnels', FIGHTS = +(process.argv[6] || 4);
const BASE = 'https://paolosarn.github.io/bohemia/';
const FILE = WHICH === 'alpha' ? 'slices/BOHEMIA_ALPHA_0_9.html' : 'slices/BOHEMIA_DEMO.html';
const PUBLISHED = ['slices/', 'engine/', 'records/target/'];
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav', '.m4a': 'audio/mp4', '.webm': 'audio/webm', '.opus': 'audio/ogg', '.glb': 'model/gltf-binary', '.bin': 'application/octet-stream', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf' };
for (const d of ['', 'video', 'shots']) fs.mkdirSync(path.join(OUT, d), { recursive: true });
const log = (...a) => { const s = new Date().toISOString().slice(11, 19) + ' ' + a.join(' '); fs.appendFileSync(path.join(OUT, 'run.log'), s + '\n'); console.log(s); };
/* what the page itself does, wrapped in the fight's own document before its script; nothing is changed */
const HOOKS = `(function(){
  if (!/BOHEMIA_FIGHT\\.html/.test(location.pathname)) return;
  var L = window.__C3 = { calls: [], notes: [], idles: [], t0: Date.now() };
  function hook(){
    if (typeof FIGHT === 'undefined' || !FIGHT || !FIGHT.aiStep || FIGHT.__c3) return false;
    if (typeof window.startAnim !== 'function') return false;
    FIGHT.__c3 = true;
    var ai = FIGHT.aiStep;
    FIGHT.aiStep = function (u) { var S = FIGHT.S, n0 = S.log.length, x0 = u && u.x, y0 = u && u.y, r0 = S.round, res;
      try { res = ai.apply(this, arguments); } finally { var mine = S.log.slice(n0).filter(function (e) { return u && e.id === u.id; }).map(function (e) { return e.t; });
        L.calls.push({ id: u && u.id, name: u && u.name, side: u && u.side, r: r0, moved: !!u && (u.x !== x0 || u.y !== y0), acts: mine, auto: !!UI.auto, hand: UI.hand, byHand: !!S.byHand, why: (u && u.btWhy) || null }); }
      return res; };
    var sa = window.startAnim;
    window.startAnim = function (e) { try { if (e && e.t === 'idle') L.idles.push({ id: e.id, r: FIGHT.S.round, why: e.why || e.k || null }); if (e && /^flood/.test(e.t)) L.notes.push({ t: e.t, r: FIGHT.S.round, say: e.say }); } catch (x) {} return sa.apply(this, arguments); };
    return true; }
  var iv = setInterval(function () { try { if (hook()) clearInterval(iv); } catch (e) {} }, 20);
})();`;

(async () => {
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const VP = WAY === 'sideways' ? { width: 844, height: 390 } : { width: 390, height: 844 };
  const ctx = await browser.newContext({ viewport: VP, deviceScaleFactor: 2, hasTouch: true, isMobile: true, serviceWorkers: 'block', recordVideo: { dir: path.join(OUT, 'video'), size: VP } });
  await ctx.route('**/*', async (route) => {
    const u = route.request().url(); if (!u.startsWith(BASE)) return route.abort();
    const rel = decodeURIComponent(u.slice(BASE.length).split('?')[0].split('#')[0]), f = path.join(ROOT, rel);
    if (!PUBLISHED.some(p => rel.startsWith(p)) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) return route.fulfill({ status: 404, body: '' });
    return route.fulfill({ status: 200, body: fs.readFileSync(f), headers: { 'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'max-age=600' } });
  });
  await ctx.addInitScript({ content: HOOKS });
  const page = await ctx.newPage(), errs = [];
  page.on('pageerror', e => { errs.push(String(e).slice(0, 200)); if (errs.length <= 3) log('PAGEERROR', String(e).slice(0, 120), '|', String(e && e.stack || '').split('\n').slice(1, 6).map(x => x.trim().replace(/https:\/\/paolosarn\.github\.io\/bohemia\/slices\//, '')).join(' <- ')); });
  const wait = (ms) => page.waitForTimeout(ms);
  const until = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { try { if (await fn()) return true; } catch (e) {} await wait(200); } return false; };
  const frame = (re) => page.frames().find(f => re.test(f.url())) || null;
  const city = () => frame(/BOHEMIA_CITY_WORLD/), fightF = () => frame(/BOHEMIA_FIGHT\.html/);
  const tap = (x, y) => page.touchscreen.tap(x, y);
  const box = async (f) => { if (f === page.mainFrame()) return { x: 0, y: 0 }; const h = await f.frameElement(); return h ? h.boundingBox() : null; };
  const tapText = async (f, sel, re) => {
    const b = await f.evaluate(([sel, re]) => { const e = [...document.querySelectorAll(sel)].filter(x => new RegExp(re, 'i').test((x.textContent || '').trim()) || new RegExp(re, 'i').test(x.title || '')).filter(x => { const r = x.getBoundingClientRect(); const st = getComputedStyle(x); return r.width > 2 && r.height > 2 && st.visibility !== 'hidden' && st.display !== 'none'; })[0];
      if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, [sel, re]);
    if (!b) return null; const fb = await box(f); if (!fb) return null; await tap(fb.x + b.x, fb.y + b.y); return true; };
  const anyFrameTap = async (sel, re) => { for (const f of page.frames()) { try { if (await tapText(f, sel, re)) return true; } catch (e) {} } return false; };
  const shot = async (name) => { const p = path.join(OUT, 'shots', name + '.png'); try { await page.screenshot({ path: p }); } catch (e) {} return p; };
  const phoneB = async (c) => { for (const fr of page.frames()) { try { const b = await fr.evaluate((c) => { const e = [...document.querySelectorAll('button[data-c="' + c + '"]')].find(x => { const r = x.getBoundingClientRect(); return r.width > 3 && r.height > 3 && getComputedStyle(x).visibility !== 'hidden'; }); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, c);
      if (b) { const fb = await box(fr); if (fb) return { x: fb.x + b.x, y: fb.y + b.y }; } } catch (e) {} } return null; };
  const press = async (c) => { const b = await phoneB(c); if (!b) return false; await tap(b.x, b.y); await wait(500); return true; };

  /* ---- THE DOOR ---- */
  await page.goto(BASE + FILE, { waitUntil: 'load', timeout: 300000 });
  await until(async () => await anyFrameTap('div,button,span', '^NEW GAME$'), 90000); await wait(2000);
  await until(async () => await anyFrameTap('#fronttap', 'BEGIN'), 90000); await wait(3500);
  await until(async () => await anyFrameTap('button,div', '^GO$'), 30000);
  if (WHICH === 'alpha') { await wait(2000); await page.evaluate(() => { const t = document.querySelector('.tab[data-p="run"]'); if (t) t.click(); }); }
  await until(async () => { const c = city(); return c && await c.evaluate(() => typeof LOOP !== 'undefined' && typeof city !== 'undefined' && MODE === 'city' && !!LOOP.open); }, 90000);
  await wait(5000);
  log(WHICH, WAY, 'in the first town', await city().evaluate(() => LOOP.open && LOOP.open.name));
  try { await anyFrameTap('button.lv', 'LEAVE'); await until(async () => city().evaluate(() => !LOOP.open), 8000); await wait(1500); } catch (e) {}

  /* ---- where on the map the fights start ---- */
  const DIST = WANT === 'tunnels' ? ['wash', 'basin'] : WANT === 'garage' ? ['garage', 'casino', 'downtown', 'resort', 'airport', 'apron'] : /^district:/.test(WANT) ? [WANT.slice(9)] : ['suburb'];
  const cells = await city().evaluate((want) => { const out = []; const N = om.n; for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const t = om.at(x, y), d = t && t.district; if (d && want.indexOf(d) >= 0) out.push({ d: d, at: [x, y] }); } return out; }, DIST);
  log('cells of', DIST.join('/'), cells.length);
  const pick = []; { const step = Math.max(1, Math.floor(cells.length / 40)); for (let i = 0; i < cells.length && pick.length < 40; i += step) pick.push(cells[i]); }
  const results = [], speeds = [1, 2, 4]; let tried = 0;
  for (const c of pick) {
    if (results.filter(r => r.wanted).length >= FIGHTS || tried >= FIGHTS * 5) break; tried++;
    await page.evaluate((c) => { window.nfOpen({ type: 'BOHEMIA_CITY_ENCOUNTER', district: c.d, at: { gx: c.at[0], gy: c.at[1] }, label: 'combat3-page', draft: true }); }, c);
    if (!(await until(async () => { const f = fightF(); return f && await f.evaluate(() => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.units.length > 0 && !!FIGHT.__c3); }, 40000))) { log('no fight came at', c.d, c.at); continue; }
    const f = fightF(); await wait(2500);
    const o = await f.evaluate(() => { const S = FIGHT.S, B = S.boardDef || {}; return { board: B.name, inside: B.interior || null, layout: (B.tunnels && B.tunnels.layout) || (B.garage && B.garage.layout) || null, flood: S.flood ? S.flood.round : null, night: !!S.night, w: S.w, h: S.h,
      mine: S.units.filter(u => u.side === 'you').length, theirs: S.units.filter(u => u.side !== 'you').length, hasKey: !!B.tileKey }; });
    const wanted = WANT === 'tunnels' ? o.inside === 'tunnels' : WANT === 'garage' ? o.inside === 'garage' : true;
    const n = results.length + 1, tag = 'f' + String(n).padStart(2, '0');
    log('fight', n, c.d, JSON.stringify(c.at), o.board, o.inside || '-', o.layout || '', 'men', o.mine, 'v', o.theirs, wanted ? '' : '(not the board asked for)');
    const R = { n, cell: c, o, wanted, taps: [], speed: speeds[n % 3] };
    await shot(tag + '_start');
    /* his finger on a tile of every kind in his reach, AUTO off: the line on the glass against the fight's own word */
    if (wanted && o.hasKey) {
      await press('auto'); await wait(900); await press('auto');   /* the deploy over (AUTO), then his hand again */
      if (await f.evaluate(() => UI.auto)) await press('auto');
      const mine = await until(async () => f.evaluate(() => { const u = FIGHT.current(); return !FIGHT.S.over && !!u && u.side === 'you' && !UI.anim.length && !UI.cut && !UI.auto; }), 30000);
      if (mine) {
        const tiles = await f.evaluate(() => { const S = FIGHT.S, u = FIGHT.current(), F = FIGHT.reach(u), B = S.boardDef, LT = B.laid.tiles, seen = {}, out = [];
          for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) { const k = LT[y][x], c = F.best[F.key(x, y)]; if (c == null || c <= 0 || seen[k]) continue;
            if (S.units.some(v => FIGHT.onField(v) && v.x === x && v.y === y)) continue;
            const X = sx((x + .5 + stagger(y)) * UI.tw), Y = sy((y + .6) * UI.th); if (X < 20 || Y < 60 || X > innerWidth - 20 || Y > innerHeight - 20) continue;
            const el = document.elementFromPoint(X, Y); if (!el || el.id !== 'cv') continue;
            seen[k] = 1; out.push({ k: k, x: x, y: y, X: X, Y: Y, cost: c, word: FIGHT.groundSay(x, y), key: (B.tileKey[k] || {}).ap }); }
          return out; });
        const fb = await box(f);
        for (const t of tiles) { await tap(fb.x + t.X, fb.y + t.Y); await wait(450);
          const got = await f.evaluate(() => ({ say: document.getElementById('say').textContent || '', pend: UI.pend ? { x: UI.pend.tile && UI.pend.tile.x, y: UI.pend.tile && UI.pend.tile.y, cost: UI.pend.cost, far: !!UI.pend.far } : null }));
          const ok = !!got.pend && got.pend.x === t.x && got.pend.y === t.y && (t.word ? got.say.indexOf(t.word) >= 0 : true);
          R.taps.push({ k: t.k, at: [t.x, t.y], word: t.word, said: got.say, walkAP: got.pend && got.pend.cost, ok }); }
        if (R.taps.length) await shot(tag + '_tile_tap');
        log('   taps', R.taps.map(t => t.k + (t.ok ? ' ok' : ' NO') + (t.word ? ' "' + t.said.slice(0, 40) + '"' : '')).join(' | '));
      } else log('   never his turn by hand');
    }
    /* AUTO and the speed, with a finger */
    for (let i = 0; i < 4; i++) { const h = await f.evaluate(() => UI.hand); if (h === R.speed) break; if (!(await press('speed'))) break; }
    if (!(await f.evaluate(() => UI.auto))) await press('auto');
    if (!(await f.evaluate(() => UI.auto))) await press('auto');
    const st = await f.evaluate(() => ({ auto: UI.auto, hand: UI.hand })); R.auto = st.auto; R.hand = st.hand;
    let over = false, r1 = null, floodShot = false; const tEnd = Date.now() + 300000;
    while (Date.now() < tEnd) { await wait(300); let s = null;
      try { s = await f.evaluate(() => { const S = FIGHT.S, B = S.boardDef, K = B.tileKey, LT = B.laid && B.laid.tiles;
        const men = S.units.filter(u => FIGHT.onField(u)).map(u => ({ id: u.id, side: u.side, open: !!(K && LT && K[LT[u.y][u.x]] && K[LT[u.y][u.x]].open) && !S.coverCount[u.y][u.x], cover: S.coverCount[u.y][u.x] > 0 }));
        return { over: S.over, round: S.round, water: S.flood ? !!S.flood.on : false, men: men }; }); } catch (e) { break; }
      if (!r1 && s.round >= 2) r1 = { n: s.men.length, open: s.men.filter(m => m.open).length, cover: s.men.filter(m => m.cover).length };
      if (s.water && !floodShot) { floodShot = true; await wait(700); await shot(tag + '_flood'); }
      if (s.over) { over = true; break; } }
    await wait(1500); await shot(tag + '_end');
    const E = await f.evaluate(() => { const S = FIGHT.S, L = window.__C3; return { round: S.round, result: S.result || null, calls: L.calls, idles: L.idles, notes: L.notes, log: S.log.filter(e => e.t === 'idle' || /^flood/.test(e.t)).map(e => ({ t: e.t, id: e.id, why: e.why || null })),
      units: S.units.map(u => ({ id: u.id, name: u.name, side: u.side, dead: !!u.dead, down: !!u.down, fled: !!u.fled })), misses: UI.cellMisses || 0 }; });
    const per = {}; E.units.filter(u => u.side === 'you').forEach(u => { per[u.id] = { name: u.name, turns: 0, acted: 0, quiet: 0, quietSaid: 0 }; });
    const byTurn = {}; E.calls.filter(c => c.side === 'you').forEach(c => { const k = c.id + '@' + c.r; (byTurn[k] = byTurn[k] || []).push(c); });
    Object.keys(byTurn).forEach(k => { const cs = byTurn[k], id = cs[0].id, p = per[id]; if (!p) return; p.turns++;
      const did = cs.some(c => c.moved || c.acts.some(t => /^(attack|step|move|skill|shot|throw|sweep|hook|net)$/.test(t))); if (did) { p.acted++; return; }
      p.quiet++; if (cs.some(c => c.acts.indexOf('idle') >= 0) || E.idles.some(i => i.id === id && (i.r === cs[0].r || i.r === cs[0].r + 1))) p.quietSaid++; });
    R.over = over; R.rounds = E.round; R.afterRoundOne = r1; R.notes = E.log.filter(e => /^flood/.test(e.t)).map(e => e.t); E.notes = R.notes.map(t => ({ t: t })); R.per = per; R.misses = E.misses;
    R.turns = Object.values(per).reduce((a, p) => a + p.turns, 0); R.acted = Object.values(per).reduce((a, p) => a + p.acted, 0); R.quiet = Object.values(per).reduce((a, p) => a + p.quiet, 0); R.quietSaid = Object.values(per).reduce((a, p) => a + p.quietSaid, 0);
    R.stood = Object.values(per).filter(p => p.turns >= 2 && p.acted === 0).map(p => p.name);
    results.push(R);
    log('   over', over, 'rounds', E.round, 'x' + st.hand, 'turns', R.turns, 'acted', R.acted, 'quiet', R.quiet, 'said', R.quietSaid, 'after round one on the open floor', r1 ? r1.open + '/' + r1.n : '-', 'notes', E.notes.map(x => x.t).join(','), 'errors so far', errs.length);
    fs.writeFileSync(path.join(OUT, 'page.json'), JSON.stringify({ which: WHICH, way: WAY, want: WANT, viewport: VP, errs, results }, null, 1));
    /* out: the spoils' LEAVE, the map again */
    await until(async () => !!frame(/SPOILS_SCREEN/) || !fightF(), 20000); await wait(1500);   /* the end screen comes late after a wipe-out: never open the next fight under it */
    for (let i = 0; i < 14; i++) { const sp = frame(/SPOILS_SCREEN/); if (!sp) break; await tapText(sp, 'button', '^LEAVE$'); await wait(3000); }
    await until(async () => !fightF() && !frame(/SPOILS_SCREEN/) && await city().evaluate(() => !LOOP.fighting), 40000);
    try { if (await city().evaluate(() => !!LOOP.open)) { await anyFrameTap('button.lv', 'LEAVE'); await wait(1500); } } catch (e) {}
    await wait(1200);
  }
  fs.writeFileSync(path.join(OUT, 'page.json'), JSON.stringify({ which: WHICH, way: WAY, want: WANT, viewport: VP, errs, results }, null, 1));
  const W = results.filter(r => r.wanted);
  log('DONE', WHICH, WAY, WANT + ':', W.length, 'of', results.length, 'fights on the board asked for; over', W.filter(r => r.over).length, '; tile taps ok', W.reduce((a, r) => a + r.taps.filter(t => t.ok).length, 0), 'of', W.reduce((a, r) => a + r.taps.length, 0), '; turns', W.reduce((a, r) => a + r.turns, 0), 'acted', W.reduce((a, r) => a + r.acted, 0), '; page errors', errs.length);
  await page.close(); await ctx.close(); await browser.close(); process.exit(0);
})().catch(e => { log('FATAL', String(e && e.stack || e).slice(0, 600)); process.exit(1); });
