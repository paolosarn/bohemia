/* ============================================================================
   EYES: AUTO ON THE PAGE HE PLAYS (rule 435(d), ask line 541; Paolo 11/9, the third time: 'the auto combat is not fixed...
   all my team must be doing shit... one of the guys, it skips him or something')

   Both fixes before this were proven HEADLESS. This plays the real page, phone upright, the way he starts a fight: a new game,
   the crew it gives, a job off the board walked to on the map and met on the road (ENGAGE), then hires, then meetings on the
   road on many boards; AUTO pressed with a finger, the speed button pressed to 1x, 2x or 4x; and EVERY TURN IS LOGGED FROM THE
   PAGE'S OWN CALLS, hooked in the fight's document before its script runs:
     - FIGHT.aiStep (who the page asked to act, from which loop: the frame's tick, the think-ahead timer, or the board-tap skip),
       what his act left in the fight's log, whether he moved, whose turn it was after;
     - FIGHT.endTurn when the PAGE ends a turn (the brain's own ends are inside the rules and are read from the log);
     - startAnim (what was drawn: a walk, a blow, a shot, for whom), skipTurn (a tap on the board resolves the round undrawn),
       turnBroke (a turn that threw), the kill cam (UI.cut) and the order of every round.
   A screen recording of the whole session (Playwright's video), and a still of the glass whenever a man of his has a turn the
   page passes without a drawn act.

   node tools/bohemia_eyes_auto_on_the_page.js <demo|alpha> <outdir> [fights=12]
   Writes <outdir>/turns.json (every fight, every call), <outdir>/summary.txt, <outdir>/video/*.webm, <outdir>/shots/*.png.
   Served from disk at the real address (github.io is refused from this box), service worker off, like the EYES live session.
   ========================================================================== */
'use strict';
const { chromium } = (function () { try { return require('/opt/node22/lib/node_modules/playwright'); } catch (e) { return require('playwright'); } })();
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const WHICH = process.argv[2] || 'demo';
const OUT = process.argv[3] || path.join('/tmp', 'eyes_auto_' + WHICH);
const FIGHTS = +(process.argv[4] || 12);
const BASE = 'https://paolosarn.github.io/bohemia/';
const FILE = WHICH === 'alpha' ? 'slices/BOHEMIA_ALPHA_0_9.html' : 'slices/BOHEMIA_DEMO.html';
const PUBLISHED = ['slices/', 'engine/', 'records/target/'];
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav', '.m4a': 'audio/mp4', '.webm': 'audio/webm', '.opus': 'audio/ogg',
  '.glb': 'model/gltf-binary', '.gltf': 'model/gltf+json', '.bin': 'application/octet-stream', '.txt': 'text/plain',
  '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf' };
for (const d of ['', 'video', 'shots']) fs.mkdirSync(path.join(OUT, d), { recursive: true });
const LOG = path.join(OUT, 'run.log');
const log = (...a) => { const s = new Date().toISOString().slice(11, 19) + ' ' + a.join(' '); fs.appendFileSync(LOG, s + '\n'); console.log(s); };

/* THE HOOKS, in the fight's own document before its script: they wrap, never change, what the page does */
const HOOKS = `(function(){
  if (!/BOHEMIA_FIGHT\\.html/.test(location.pathname)) return;
  var L = window.__EYES = { calls: [], anims: [], ends: [], skips: [], broke: [], rounds: [], cutMs: 0, t0: Date.now() };
  function where(st){ return /thinkAhead/.test(st) ? 'ahead' : /skipTurn/.test(st) ? 'skip' : /\\btick\\b/.test(st) ? 'tick' : 'other:' + ((st.split('\\n')[3] || '').trim().slice(0, 50)); }
  function hook(){
    if (typeof FIGHT === 'undefined' || !FIGHT || !FIGHT.aiStep || FIGHT.__eyes) return false;
    /* the page's own functions come in a later script than the rules: hook only when all of them stand (a race made 5 of 12 fights read 'nothing drawn') */
    if (typeof window.startAnim !== 'function' || typeof window.skipTurn !== 'function' || typeof window.turnBroke !== 'function' || typeof window.framed !== 'function') return false;
    FIGHT.__eyes = true;
    var ai = FIGHT.aiStep;
    FIGHT.aiStep = function (u) {
      var S = FIGHT.S, n0 = S.log.length, x0 = u && u.x, y0 = u && u.y, from = where(new Error().stack || ''), r0 = S.round, i0 = S.idx, cut = !!UI.cut, an0 = UI.anim.length;
      var fr0 = null; try { fr0 = u ? framed(u.x, u.y) : null; } catch (e) {}
      var res; try { res = ai.apply(this, arguments); } finally {
        var mine = S.log.slice(n0).filter(function (e) { return u && e.id === u.id; }).map(function (e) { return e.t; });
        L.calls.push({ ms: Date.now(), id: u && u.id, name: u && u.name, side: u && u.side, r: r0, idx: i0, from: from, moved: !!u && (u.x !== x0 || u.y !== y0),
          acts: mine, after: (FIGHT.current() || {}).id || null, cut: cut, auto: !!UI.auto, hand: UI.hand, w: u && u.weapon && u.weapon.name, hp: u && u.hp,
          why: (u && u.btWhy) || null, drawnNew: UI.anim.length - an0, fr0: fr0, fr1: (function () { try { return u ? framed(u.x, u.y) : null; } catch (e) { return null; } })(),
          glide: !!(UI.glide && UI.glide.hold), pinched: !!UI.pinched,
          box: (function () { try { var b = manBox(u.x, u.y); return { x: Math.round(b.x), head: Math.round(b.head), feet: Math.round(b.feet), open: { l: Math.round(OPEN.l), t: Math.round(OPEN.t), r: Math.round(OPEN.r), b: Math.round(OPEN.b) }, vw: innerWidth, vh: innerHeight }; } catch (e) { return null; } })() });
      }
      return res; };
    var et = FIGHT.endTurn;
    FIGHT.endTurn = function (u) { var st = new Error().stack || ''; L.ends.push({ ms: Date.now(), id: u && u.id, r: FIGHT.S.round, by: /turnBroke/.test(st) ? 'broke' : where(st) }); return et.apply(this, arguments); };
    var sa = window.startAnim;
    if (typeof sa === 'function') window.startAnim = function (a) { try { L.anims.push({ ms: Date.now(), k: a.k, id: a.e && a.e.id, t: a.e && a.e.t, ahead: !!a.ahead, r: FIGHT.S.round }); } catch (e) {} return sa.apply(this, arguments); };
    var sk = window.skipTurn;
    if (typeof sk === 'function') window.skipTurn = function () { try { L.skips.push({ ms: Date.now(), r: FIGHT.S.round, cur: (FIGHT.current() || {}).id }); } catch (e) {} return sk.apply(this, arguments); };
    var tb = window.turnBroke;
    if (typeof tb === 'function') window.turnBroke = function (u, e) { try { L.broke.push({ ms: Date.now(), id: u && u.id, e: String(e && e.message || e).slice(0, 160) }); } catch (_e) {} return tb.apply(this, arguments); };
    var lastR = -1, lastT = 0;
    setInterval(function () { try { var S = FIGHT.S, now = Date.now(); if (S.round !== lastR) { lastR = S.round; L.rounds.push({ r: S.round, order: S.order.slice(), ms: now,
        on: S.units.filter(function (u) { return !u.dead && !u.fled && !u.down; }).map(function (u) { return u.id; }) }); }
      if (UI.cut && lastT) L.cutMs += now - lastT; lastT = now; } catch (e) {} }, 25);
    return true; }
  var iv = setInterval(function () { try { if (hook()) clearInterval(iv); } catch (e) {} }, 20);
})();`;

(async () => {
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const VP = { width: 390, height: 844 };
  const ctx = await browser.newContext({ viewport: VP, deviceScaleFactor: 3, hasTouch: true, isMobile: true, serviceWorkers: 'block',
    recordVideo: { dir: path.join(OUT, 'video'), size: VP } });
  await ctx.route('**/*', async (route) => {
    const u = route.request().url();
    if (!u.startsWith(BASE)) return route.abort();
    const rel = decodeURIComponent(u.slice(BASE.length).split('?')[0].split('#')[0]);
    const f = path.join(ROOT, rel);
    if (!PUBLISHED.some(p => rel.startsWith(p)) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) return route.fulfill({ status: 404, body: '' });
    return route.fulfill({ status: 200, body: fs.readFileSync(f), headers: { 'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'max-age=600' } });
  });
  await ctx.addInitScript({ content: HOOKS });
  const page = await ctx.newPage();
  /* THE FRAMES AT THE MOMENT (EYES 11/9): the video's clock is the file's, a second off at worst; the browser's own screencast stamps
     every frame with the wall clock the fight's log uses, so the frames around a turn of his with no walk and no blow are exact.
     A ring of the last 5 s, dumped around each such turn (at most BURSTS of them) */
  const BURSTS = +(process.env.EYES_BURSTS || 6); let bursts = 0; const ring = [];
  try { const cdp = await ctx.newCDPSession(page);
    cdp.on('Page.screencastFrame', (f) => { ring.push({ t: Math.round(f.metadata.timestamp * 1000), d: f.data }); while (ring.length && ring[ring.length - 1].t - ring[0].t > 5000) ring.shift(); cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {}); });
    await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 70, maxWidth: 390, maxHeight: 844, everyNthFrame: 1 }); } catch (e) { console.log('no screencast', String(e).slice(0, 80)); }
  const burst = (tag, from, to) => { const got = ring.filter(x => x.t >= from && x.t <= to); got.forEach((x, i) => fs.writeFileSync(path.join(OUT, 'shots', 'burst_' + tag + '_' + String(i).padStart(2, '0') + '_' + (x.t - from) + 'ms.jpg'), Buffer.from(x.d, 'base64'))); return got.length; };
  const errs = [];
  page.on('pageerror', e => { errs.push({ ms: Date.now(), e: String(e).slice(0, 200) }); log('PAGEERROR', String(e).slice(0, 160)); });
  const wait = (ms) => page.waitForTimeout(ms);
  const until = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { try { if (await fn()) return true; } catch (e) {} await wait(200); } return false; };
  const frame = (re) => page.frames().find(f => re.test(f.url())) || null;
  const city = () => frame(/BOHEMIA_CITY_WORLD/);
  const fightF = () => frame(/BOHEMIA_FIGHT\.html/);
  const tap = (x, y) => page.touchscreen.tap(x, y);
  const box = async (f) => { if (f === page.mainFrame()) return { x: 0, y: 0 }; const h = await f.frameElement(); return h ? h.boundingBox() : null; };
  /* a finger on the first shown element of a frame whose text matches: Playwright's frame box is already on the glass */
  const tapText = async (f, sel, re) => {
    const b = await f.evaluate(([sel, re]) => { const e = [...document.querySelectorAll(sel)].filter(x => new RegExp(re, 'i').test((x.textContent || '').trim()) || new RegExp(re, 'i').test(x.title || '')).filter(x => { const r = x.getBoundingClientRect(); const st = getComputedStyle(x); return r.width > 2 && r.height > 2 && st.visibility !== 'hidden' && st.display !== 'none'; })[0];
      if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, [sel, re]);
    if (!b) return null; const fb = await box(f); if (!fb) return null; await tap(fb.x + b.x, fb.y + b.y); return { x: fb.x + b.x, y: fb.y + b.y };
  };
  const anyFrameTap = async (sel, re) => { for (const f of page.frames()) { try { const r = await tapText(f, sel, re); if (r) return r; } catch (e) {} } return null; };
  const shot = async (name) => { const p = path.join(OUT, 'shots', name + '.png'); try { await page.screenshot({ path: p, scale: 'css' }); } catch (e) {} return p; };

  /* ---- THE DOOR: a new game, the crew it gives ---- */
  await page.goto(BASE + FILE, { waitUntil: 'load', timeout: 300000 });
  log('opened', FILE);
  await until(async () => !!(await anyFrameTap('div,button,span', '^NEW GAME$')), 90000);
  await wait(2000);
  await until(async () => { const f = page.frames().find(x => true); const r = await anyFrameTap('#fronttap', 'BEGIN'); return !!r; }, 90000);
  await wait(3500);
  await until(async () => !!(await anyFrameTap('button,div', '^GO$')), 30000);
  /* the alpha lands on VOTE after the door: his RUN tab holds the game */
  if (WHICH === 'alpha') { await wait(2000); await page.evaluate(() => { const t = document.querySelector('.tab[data-p="run"]'); if (t) t.click(); }); }
  await until(async () => { const c = city(); return c && await c.evaluate(() => typeof LOOP !== 'undefined' && typeof city !== 'undefined' && MODE === 'city' && !!LOOP.open); }, 90000);
  await wait(6000);
  log('in the first town', await city().evaluate(() => LOOP.open && LOOP.open.name));
  await shot('00_first_town');

  const sf = async () => { const c = city(); if (!c) return null; const h = await c.$('#settleFrame'); return h ? h.contentFrame() : null; };
  /* a building on the town's own picture, where the town screen says it is (BohemiaSettlement.where, the floating signs are off, 438(a)) */
  const tapBuilding = async (key) => { for (let i = 0; i < 5; i++) { const s = await sf(); if (!s) return false;
      const q = await s.evaluate((k) => { try { const B = window.BohemiaSettlement; if (!B || !B.ready()) return null; const w = B.where(k); return w ? { x: w.x, y: w.y } : null; } catch (e) { return null; } }, key);
      if (!q) { await wait(800); continue; } const fb = await box(s); await tap(fb.x + q.x, fb.y + q.y); await wait(1300);
      const up = await s.evaluate(() => { const sh = document.getElementById('sheet'); return !!(sh && sh.classList.contains('on')); }); if (up) return true; }
    return false; };
  const closeSheet = async () => { const s = await sf(); if (s) { await tapText(s, '#close', ''); await wait(800); } };
  const leaveTown = async () => { await closeSheet(); await anyFrameTap('button.lv', 'LEAVE'); await until(async () => city().evaluate(() => !LOOP.open), 8000); await wait(1500); };
  const meetUp = async () => city().evaluate(() => !!(window.MEET && MEET.up));

  /* ---- ONE FIGHT ON AUTO, every turn logged ---- */
  const results = [];
  const playFight = async (n, how, want) => {
    const t0 = Date.now();
    if (!(await until(async () => { const f = fightF(); return f && await f.evaluate(() => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.units.length > 0 && !!FIGHT.__eyes); }, 40000))) { log('fight', n, 'never came'); return null; }
    const f = fightF();
    await wait(2500);
    const o = await f.evaluate(() => ({ kind: FIGHT_OPTS.kind, district: FIGHT_OPTS.district, board: FIGHT.S.boardDef && FIGHT.S.boardDef.name, deploy: FIGHT.S.deploy,
      men: FIGHT.S.units.map(u => ({ id: u.id, name: u.name, side: u.side, w: u.weapon && u.weapon.name, hp: u.hp, hpMax: u.hpMax || u.hp_max || null, main: !!u.main || u.id === 'c0' })) }));
    /* his finger: AUTO, then the speed button until it reads what this fight wants */
    /* the phone's own fight row (slices/bohemia_phone.js): button[data-c="auto"] and button[data-c="speed"], wherever the phone is drawn */
    const phoneB = async (c) => { for (const fr of page.frames()) { try { const b = await fr.evaluate((c) => { const e = [...document.querySelectorAll('button[data-c="' + c + '"]')].find(x => { const r = x.getBoundingClientRect(); return r.width > 3 && r.height > 3 && getComputedStyle(x).visibility !== 'hidden'; }); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: Math.round(r.width), h: Math.round(r.height) }; }, c);
        if (b) { const fb = await box(fr); if (fb) return { x: fb.x + b.x, y: fb.y + b.y, w: b.w, h: b.h }; } } catch (e) {} } return null; };
    const autoB = () => phoneB('auto'), speedB = () => phoneB('speed');
    for (let i = 0; i < 4; i++) { const h = await f.evaluate(() => UI.hand); if (h === want) break; const b = await speedB(); if (!b) break; await tap(b.x, b.y); await wait(500); }
    const a = await autoB(); if (a) { await tap(a.x, a.y); await wait(600); }
    let st = await f.evaluate(() => ({ auto: UI.auto, hand: UI.hand }));
    if (!st.auto) { const a2 = await autoB(); if (a2) { await tap(a2.x, a2.y); await wait(600); } st = await f.evaluate(() => ({ auto: UI.auto, hand: UI.hand })); }
    log('fight', n, how, o.kind + '/' + o.district, o.board, 'men', o.men.filter(m => m.side === 'you').length, 'v', o.men.filter(m => m.side !== 'you').length, 'auto', st.auto, 'x' + st.hand);
    /* watch: a still whenever a man of his is passed with nothing drawn */
    let seen = 0, stills = 0, over = false, tseen = 0; const pend = [];
    const tEnd = Date.now() + 240000;
    while (Date.now() < tEnd) {
      await wait(250);
      let L = null; try { L = await f.evaluate(() => ({ calls: window.__EYES.calls.slice(), over: FIGHT.S.over })); } catch (e) { break; }
      for (; seen < L.calls.length; seen++) { const c = L.calls[seen];
        /* a still when a man of his ACTS where the open glass does not show him (off it, or under the phone): the moment he would look skipped */
        if (c.side === 'you' && (c.moved || (c.acts || []).some(t => t !== 'end' && t !== 'wait')) && c.fr0 === false && c.fr1 === false && stills < 8) { stills++; await wait(250); await shot('f' + String(n).padStart(2, '0') + '_r' + c.r + '_' + c.id + '_unseen_' + (c.box ? c.box.x + 'x' + c.box.feet : '')); } }
      /* a turn of his that ended with no walk and no blow: the frames from just before it to a second after */
      for (; tseen < L.calls.length; tseen++) { const c = L.calls[tseen]; if (c.side !== 'you' || (c.acts || []).indexOf('end') < 0) continue;
        const cs = L.calls.filter(x => x.id === c.id && x.r === c.r); if (cs.some(x => x.moved || (x.acts || []).some(t => t === 'step' || t === 'attack'))) continue;
        const kind = cs.some(x => (x.acts || []).indexOf('reload') >= 0) ? (cs.some(x => (x.acts || []).indexOf('swap') >= 0) ? 'swapreload' : 'reload') : (cs.some(x => x.why === 'rest') ? 'rest' : 'nothing');
        if (bursts < BURSTS) { bursts++; pend.push({ tag: 'f' + String(n).padStart(2, '0') + '_r' + c.r + '_' + c.id + '_' + kind + '_x' + c.hand, from: cs[0].ms - 1200, to: c.ms + 1500, at: Date.now() + 1700 }); } }
      for (let i = pend.length - 1; i >= 0; i--) if (Date.now() >= pend[i].at) { const b = pend.splice(i, 1)[0]; log('frames at', b.tag, burst(b.tag, b.from, b.to)); }
      if (L.over) { over = true; break; }
    }
    await wait(1200);
    const E = await f.evaluate(() => { const S = FIGHT.S; return Object.assign({}, window.__EYES, { over: S.over, round: S.round, log: S.log.map(e => ({ t: e.t, id: e.id })),
      units: S.units.map(u => ({ id: u.id, name: u.name, side: u.side, w: u.weapon && u.weapon.name, hp: u.hp, dead: !!u.dead, fled: !!u.fled, down: !!u.down, morale: u.morale })) }); });
    await shot('f' + String(n).padStart(2, '0') + '_end');
    const R = { n, how, want, auto: st.auto, hand: st.hand, kind: o.kind, district: o.district, board: o.board, men: o.men, secs: Math.round((Date.now() - t0) / 1000), over, E };
    results.push(R);
    fs.writeFileSync(path.join(OUT, 'turns.json'), JSON.stringify({ file: FILE, errs, results }, null, 0));
    /* out: the spoils' LEAVE, back on the map */
    await wait(1500);
    for (let i = 0; i < 10; i++) { const sp = frame(/SPOILS_SCREEN/); if (!sp) break; await tapText(sp, 'button', '^LEAVE$'); await wait(3000); }
    /* a wipe-out drags him to a town: wait for the map (or the town) to be his again before the next meeting */
    await until(async () => !fightF() && !frame(/SPOILS_SCREEN/) && await city().evaluate(() => !LOOP.fighting), 40000);
    try { if (await city().evaluate(() => !!LOOP.open)) await leaveTown(); } catch (e) {}
    await wait(1500);
    return R;
  };

  /* ---- FIGHT 1: a job off the board, walked to on the map, met on the road (the crew a new game gives) ---- */
  let n = 0; const speeds = [1, 2, 4];
  try {
    const s = await sf();
    log('board open', await tapBuilding('board')); await wait(800);
    log('the board says', (await s.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').slice(0, 300))));
    const took = await (async () => { const rows = await s.evaluate(() => [...document.querySelectorAll('#sheet span, #sheet div, #sheet button')].filter(e => e.children.length < 3 && /^(COME BACK|PAID THERE|ON THE WAY|BACK)/.test(e.textContent.trim()) && e.textContent.trim().length > 12 && e.textContent.trim().length < 90).map(e => e.textContent.trim().slice(0, 60)));
      log('job rows', JSON.stringify(rows));
      /* a town whose board holds one job opens its offer at once: take it */
      if (!rows.length) { const ok = await tapText(s, 'button,div', '^Take it$'); await wait(1200); if (ok) return 'the offer on the board'; }
      for (const r of rows) { await tapText(s, 'span', '^' + r.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$'); await wait(1200); const ok = await tapText(s, 'button,div', '^Take it$'); await wait(1200); if (ok) return r; } return null; })();
    log('took', took);
    await leaveTown();
    const tgt = await city().evaluate(() => { const c = LOOP.held[0]; if (!c) return null; const t = c.target || c.at || c.place || null; return t && t.x != null ? [t.x, t.y] : Array.isArray(t) ? t : (c.party && c.party.x != null ? [c.party.x, c.party.y] : null); });
    log('the job is at', JSON.stringify(tgt));
    if (tgt) {
      await city().evaluate((c) => travelTo(0, 0, c), tgt);
      await until(async () => (await meetUp()) || !!fightF(), 90000);
      if (await meetUp()) { await wait(1200); await shot('01_meet'); await tapText(city(), 'button,div', '^ENGAGE$'); }
      if (await until(async () => !!fightF(), 15000)) await playFight(++n, 'a job, met on the road', speeds[(n) % 3] || 1);
    }
  } catch (e) { log('job fight failed', String(e).slice(0, 160)); }

  /* ---- HIRES: two men at the hall of the nearest town ---- */
  try {
    const near = await city().evaluate(() => { const bs = ctBases(); let best = null, bd = 1e9; for (const k in bs) { const d = Math.abs(bs[k].x - city.x) + Math.abs(bs[k].y - city.y); if (d < bd) { bd = d; best = [bs[k].x | 0, bs[k].y | 0, k]; } } return best; });
    await city().evaluate((c) => travelTo(0, 0, [c[0], c[1]]), near);
    await until(async () => city().evaluate(() => !!LOOP.open), 60000); await wait(5000);
    const s = await sf();
    log('hall open', await tapBuilding('hall')); await wait(800);
    for (let i = 0; i < 2; i++) { await tapText(s, 'button', '^Hire'); await wait(1500); }
    log('hired at', near[2], await city().evaluate(() => document.body.innerText.slice(0, 16).replace(/\s+/g, ' ')));
    await shot('02_hired');
    await leaveTown();
  } catch (e) { log('hire failed', String(e).slice(0, 160)); }

  /* ---- THE ROAD: meetings on many boards (the encounter the map sends), 1x, 2x, 4x in turn ---- */
  const cells = await city().evaluate(() => { const want = ['suburb', 'arterial', 'strip', 'freeway', 'downtown', 'desert', 'casino', 'industrial', 'resort', 'apartment', 'trailer', 'wash', 'commercial', 'landfill'];
    const got = {}; const N = om.n; for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const t = om.at(x, y); const d = t && t.district; if (d && want.indexOf(d) >= 0 && !got[d]) got[d] = [x, y]; }
    return want.filter(d => got[d]).map(d => ({ d, at: got[d] })); });
  log('boards to deal', cells.map(c => c.d).join(' '));
  for (let i = 0; n < FIGHTS && i < cells.length * 2; i++) {
    const c = cells[i % cells.length];
    try {
      await page.evaluate((c) => { window.nfOpen({ type: 'BOHEMIA_CITY_ENCOUNTER', district: c.d, at: { gx: c.at[0], gy: c.at[1] }, label: 'eyes-auto', draft: true }); }, c);
      if (await until(async () => !!fightF(), 20000)) await playFight(++n, 'a meeting on the road: ' + c.d, speeds[n % 3]);
      else log('no fight came for', c.d);
      /* a man down a lot: camp between, the way he heals */
      const blood = await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find(x => /^HEAL/.test(x.title || '')); const m = b && b.title.match(/BLOOD (\d+) \/ (\d+)/); return m ? +m[1] / +m[2] : 1; });
      if (blood < 0.6) { await anyFrameTap('button', '^HEAL$'); await wait(9000); }
    } catch (e) { log('road fight failed', c.d, String(e).slice(0, 160)); }
  }

  /* ---- THE COUNT: per fight, per man of his, per round ---- */
  const lines = [];
  for (const R of results) {
    const E = R.E, mine = E.units.filter(u => u.side === 'you');
    /* who fell in which round, from the fight's own log ('round' marks each new round) */
    const fellIn = {}; { let r = 1; E.log.forEach(e => { if (e.t === 'round') r++; if (/^(dead|down|fled|flee|escaped)$/.test(e.t) && fellIn[e.id] == null) fellIn[e.id] = r; }); }
    const per = {};
    mine.forEach(u => { per[u.id] = { name: u.name, w: u.w, turns: 0, acted: 0, held: 0, heldWhy: [], unframed: 0, passedNoCall: 0, skipTap: 0, drawn: 0, ahead: 0, tick: 0, end: (u.dead ? 'dead' : u.fled ? 'fled' : u.down ? 'down' : 'up') }; });
    E.rounds.forEach(rr => {
      rr.order.forEach(id => { if (!per[id]) return; if (rr.on.indexOf(id) < 0) return;
        const calls = E.calls.filter(c => c.r === rr.r && c.id === id);
        if (!calls.length) { const last = rr.r === E.round && R.over; const fell = fellIn[id] != null && fellIn[id] <= rr.r; if (!last && !fell) per[id].passedNoCall++; return; }
        per[id].turns++;
        if (calls.some(c => c.from === 'skip')) per[id].skipTap++;
        if (calls.some(c => c.from === 'ahead')) per[id].ahead++;
        if (calls.some(c => c.from === 'tick')) per[id].tick++;
        const did = calls.some(c => c.moved || (c.acts || []).some(t => t !== 'end' && t !== 'wait'));
        if (did) per[id].acted++; else { per[id].held++; per[id].heldWhy.push('r' + rr.r + ':' + (calls.map(c => c.why || c.acts.join('/')).join(','))); }
        if (did && calls.every(c => c.fr0 === false && c.fr1 === false)) per[id].unframed++;
        if (E.anims.some(a => a.r === rr.r && a.id === id && (a.k === 'step' || a.k === 'attack'))) per[id].drawn++;
      });
    });
    const ends = E.ends.filter(e => /^(tick|ahead|skip|other)/.test(e.by) || e.by === 'broke');
    lines.push('FIGHT ' + R.n + ' (' + R.how + ', ' + R.kind + '/' + R.district + ', ' + R.board + ', AUTO ' + R.auto + ' x' + R.hand + ', ' + R.secs + ' s, rounds ' + E.round + (R.over ? '' : ', NOT OVER') + ')'
      + ' skips by tap ' + E.skips.length + ', turns that threw ' + E.broke.length + ', page-forced ends ' + ends.length + ', kill cam ' + Math.round(E.cutMs) + ' ms');
    Object.keys(per).forEach(id => { const p = per[id];
      lines.push('   ' + id + ' ' + p.name + ' (' + p.w + ', ' + p.end + '): turns ' + p.turns + ', acted ' + p.acted + ', held ' + p.held + (p.held ? ' [' + p.heldWhy.join(' ').slice(0, 160) + ']' : '') + ', drawn ' + p.drawn + ', acted out of the open glass ' + p.unframed + ', passed with no call ' + p.passedNoCall + ', resolved by a tap ' + p.skipTap
        + (p.turns > 0 && p.acted === 0 ? '   <<< STOOD THE WHOLE FIGHT' : '') + (p.passedNoCall > 0 ? '   <<< HIS TURN PASSED WITHOUT THE PAGE ASKING HIM' : '') + (p.acted > p.drawn + p.skipTap ? '   <<< ACTED BUT NOT DRAWN ' + (p.acted - p.drawn) : '')); });
  }
  lines.push('page errors: ' + errs.length + (errs.length ? ' (' + errs.map(e => e.e).slice(0, 3).join(' | ') + ')' : ''));
  fs.writeFileSync(path.join(OUT, 'summary.txt'), lines.join('\n') + '\n');
  log('summary written:', results.length, 'fights');
  await page.close(); await ctx.close(); await browser.close();
  process.exit(0);
})().catch(e => { log('FATAL', String(e && e.stack || e).slice(0, 600)); process.exit(1); });
