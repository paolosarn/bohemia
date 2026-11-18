#!/usr/bin/env node
/* ============================================================================
   FIGHT SCREEN TWO: THE WHY LINE IS TRUE AND THE FACE SHOWS UNDER THE HELMET, ON THE PAGE HE PLAYS (ask rows 631, 630; rule 441(a)).
   Opens the real page (the demo or the alpha) the way a stranger opens it, a phone upright (390 x 844) or on its side (844 x 390),
   and plays one of the two starts EYES heard a false sentence on:
     job      a held job to get a thing back (its kind recover-return, in the map's own held jobs), its holders met through the
              map's card: the card's sentence and the bell's must not name a road he was not paid to clear
     ceiling  a road crew met on a casino's cell: the card reads the ground as inside and its sentence names no road and no open sky
              (the bell under a real ceiling is the gate's W12 leg, on the fight's own page)
   For each: the card's sentence, the bell's own account (UI.whySaid: the sentence, what it needed, what was so), a still of each.
   Then FIGHT is pressed and one of his men is on the phone's card: a still of the card and of his sheet (a finger on his face), and
   the fight's account of how it framed his face under his head gear (BohemiaFightFace.said).
   GLASS=<1|2|4> (FIGHT SCREEN TWO 11/18, ask rows 650 and 648): after his sheet, a finger presses AUTO and the speed button until it
   reads that speed, and the fight is played to its end with the tool's own eye on the glass (the white's real opacity and the
   board's own pixels, every drawn frame, never the page's count): how many flashes began, and the most in any one second.
   node tools/bohemia_fight_screen_the_why_is_true.js <alpha|demo> <upright|sideways> <outdir> <job|ceiling>
   ========================================================================== */
'use strict';
const { chromium } = (function () { try { return require('/opt/node22/lib/node_modules/playwright'); } catch (e) { return require('playwright'); } })();
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const WHICH = process.argv[2] || 'demo', WAY = process.argv[3] || 'upright', OUT = process.argv[4] || '/tmp/why_true', CASE = process.argv[5] || 'job';
const BASE = 'https://paolosarn.github.io/bohemia/', FILE = WHICH === 'alpha' ? 'slices/BOHEMIA_ALPHA_0_9.html' : 'slices/BOHEMIA_DEMO.html';
const PUBLISHED = ['slices/', 'engine/', 'records/target/'];
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.txt': 'text/plain' };
for (const d of ['', 'shots']) fs.mkdirSync(path.join(OUT, d), { recursive: true });
const { offTheTown } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { execSync } = require('child_process');
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), a.join(' '));
const OLD = {}; if (process.env.BEFORE) for (const f of ['slices/BOHEMIA_FIGHT.html', 'slices/bohemia_fight_why.js', 'slices/bohemia_fight_opener.js', 'records/target/bb/fight_reasons.json']) OLD[f] = execSync('git show ' + (process.env.BEFORE_REF || 'HEAD') + ':' + f, { cwd: ROOT, maxBuffer: 1 << 28 });
(async () => {
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const VP = WAY === 'sideways' ? { width: 844, height: 390 } : { width: 390, height: 844 };
  const ctx = await browser.newContext({ viewport: VP, deviceScaleFactor: 2, hasTouch: true, isMobile: true, serviceWorkers: 'block' });
  await ctx.route('**/*', async (route) => { const u = route.request().url(); if (!u.startsWith(BASE)) return route.abort();
    const rel = decodeURIComponent(u.slice(BASE.length).split('?')[0].split('#')[0]), f = path.join(ROOT, rel);
    if (OLD[rel]) return route.fulfill({ status: 200, body: OLD[rel], headers: { 'Content-Type': MIME[path.extname(rel)] } });
    if (process.env.BEFORE && /bohemia_fight_face\.js$/.test(rel)) return route.fulfill({ status: 200, body: '/* before */', headers: { 'Content-Type': 'text/javascript' } });
    if (!PUBLISHED.some(p => rel.startsWith(p)) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) return route.fulfill({ status: 404, body: '' });
    return route.fulfill({ status: 200, body: fs.readFileSync(f), headers: { 'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'max-age=600' } }); });
  const page = await ctx.newPage(), errs = []; page.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  const wait = (ms) => page.waitForTimeout(ms), until = async (fn, ms, step) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { try { if (await fn()) return true; } catch (e) {} await wait(step || 200); } return false; };
  const frame = (re) => page.frames().find(f => re.test(f.url())) || null, city = () => frame(/BOHEMIA_CITY_WORLD/), fightF = () => frame(/BOHEMIA_FIGHT\.html/);
  const box = async (f) => { if (f === page.mainFrame()) return { x: 0, y: 0 }; const h = await f.frameElement(); return h ? h.boundingBox() : null; };
  const tapSel = async (f, sel) => { const b = await f.evaluate((sel) => { const e = [...document.querySelectorAll(sel)].find(x => { const r = x.getBoundingClientRect(); return r.width > 3 && r.height > 3 && getComputedStyle(x).visibility !== 'hidden'; }); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, sel); if (!b) return false; const fb = await box(f); await page.touchscreen.tap(fb.x + b.x, fb.y + b.y); return true; };
  const tapText = async (sel, re) => { for (const f of page.frames()) { try { const b = await f.evaluate(([sel, re]) => { const e = [...document.querySelectorAll(sel)].filter(x => new RegExp(re, 'i').test((x.textContent || '').trim())).filter(x => { const r = x.getBoundingClientRect(), st = getComputedStyle(x); return r.width > 3 && r.height > 3 && st.visibility !== 'hidden' && st.display !== 'none'; }).pop(); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, [sel, re]); if (!b) continue; const fb = await box(f); await page.touchscreen.tap(fb.x + b.x, fb.y + b.y); return true; } catch (e) {} } return false; };
  const shot = async (n) => { try { await page.screenshot({ path: path.join(OUT, 'shots', n + '.png') }); } catch (e) {} };
  const T = { which: WHICH, way: WAY, case: CASE, before: !!process.env.BEFORE };
  await page.goto(BASE + FILE, { waitUntil: 'load', timeout: 300000 });
  await until(() => tapText('div,button,span', '^NEW GAME$'), 90000); await wait(2000);
  await until(() => tapText('#fronttap', 'BEGIN'), 90000); await wait(3500);
  await until(() => tapText('button,div', '^GO$'), 30000);
  for (let i = 0; i < 4; i++) { const up = await page.evaluate(() => { const m = document.getElementById('mainmaker'); return !!m && getComputedStyle(m).display !== 'none' && m.getBoundingClientRect().height > 50; }); if (!up) break; await wait(1500); await tapText('button,div', '^GO$'); await wait(1500); }
  if (WHICH === 'alpha') { await wait(2000); await page.evaluate(() => { const t = document.querySelector('.tab[data-p="run"]'); if (t) t.click(); }); }
  await until(async () => { const c = city(); return c && await c.evaluate(() => typeof LOOP !== 'undefined' && MODE === 'city' && !!LOOP.open); }, 90000); await wait(5000);
  try { await tapText('button.lv', 'LEAVE'); await until(async () => city().evaluate(() => !LOOP.open), 8000); await wait(1500); } catch (e) {}
  await city().evaluate(() => { if (MODE !== 'city') { try { swapMode(); } catch (e) {} } }).catch(() => null);
  await until(async () => city().evaluate(() => MODE === 'city'), 8000); await wait(1500);
  await city().evaluate(offTheTown).catch(() => null);
  await until(async () => city().evaluate(() => !!(window.BohemiaJobDanger && BohemiaJobDanger.ready())), 30000);
  if (process.env.GLASS) await city().evaluate(() => { window.__GLASS_BAND = true; });
  T.met = await city().evaluate((CASE) => { const band = window.__GLASS_BAND ? ['brigand_raider', 'brigand_thug', 'brigand_raider', 'brigand_thug', 'brigand_raider', 'brigand_thug'] : ['brigand_thug', 'brigand_thug', 'brigand_raider'];
    let at = (function () { try { return roadWhere(); } catch (e) { return [city.x, city.y]; } })(), why = 'road:toll_crew', label = 'the toll crew', job = null;
    if (CASE === 'job') { job = { id: 'fs631', plays: 'recover-return', title: 'Get the cold box back', from: 'Mob', item: 'the cold box', stage: 'get', pay: 40, skulls: 1, draft: true }; LOOP.held.push(job); why = 'contract:fs631:holders'; label = 'the ones holding the cold box'; }
    else { let hit = null; for (let y = 0; y < om.n && !hit; y++) for (let x = 0; x < om.n; x++) { const t = om.at(x, y); if (t && /^(casino|resort)$/.test(String(t.district))) { hit = [x, y, t.district]; break; } } if (hit) at = [hit[0], hit[1]]; }   /* the meeting is named on a casino's cell (the card reads that ground as inside); the party itself cannot stand there for a road stop: the town's door holds what comes for him off a town's ground, so the bell's inside leg is proven on the fight's own page (THE WHY LINE gate, W12) */
    const msg = { type: 'BOHEMIA_CITY_ENCOUNTER', label: label, faction: null, draft: true, packageId: 1, roster: band.map(() => ({ arch: 'human' })), party: { count: band.length, days: 40, difficulty: 1, faction: 'brigands', band: band, rolled: true }, street: true, why: why, at: { gx: at[0] | 0, gy: at[1] | 0 } };
    let district = null; try { district = om.at(at[0] | 0, at[1] | 0).district; } catch (e) {}
    try { MEET.on = true; return { ok: meetWalk(function () { return cityHandOver(msg); }), at: at, district: district, held: LOOP.held.map(j => j.id + ':' + (j.plays || '')) }; } catch (e) { return { err: String(e) }; } }, CASE).catch(e => ({ err: String(e) }));
  const hasCard = await until(async () => city().evaluate(() => !!document.querySelector('#meetcard button[data-meet="go"]')), 8000);
  if (hasCard) { await until(async () => city().evaluate(() => { const L = window.BohemiaFightOpener && BohemiaFightOpener.last; return !!(L && L.read && (L.typed || L.read.none)); }), 8000, 60); await wait(1300); await shot('1_card');
    T.card = await city().evaluate(() => { const L = window.BohemiaFightOpener && BohemiaFightOpener.last, R = (L && L.read) || {}, mc = document.querySelector('#meetcard .mc'); return { line: R.line || null, shown: (mc.querySelector('.mco-say span') || {}).textContent || null, by: R.speaker && R.speaker.name, rule: R.rule, how: R.how, who: R.who, ground: (mc.querySelector('.mcg') || {}).textContent, meetGround: window.__MEET_GROUND || null, old: (mc.textContent || '').slice(0, 160) }; });
    await tapSel(city(), '#meetcard button[data-meet="go"]'); }
  log('CARD', hasCard, JSON.stringify(T.met), JSON.stringify(T.card || null).slice(0, 500));
  await until(async () => { const f = fightF(); return f && await f.evaluate(() => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.units.length > 0 && !!UI.board && !!UI.t0); }, 60000);
  const f = fightF(); if (!f) { log('NO FIGHT'); T.errs = errs; fs.writeFileSync(path.join(OUT, 'why_true.json'), JSON.stringify(T, null, 1)); process.exit(1); }
  await until(async () => f.evaluate(() => !!UI.whySaid), 15000, 80);
  await until(async () => f.evaluate(() => !UI.why || document.getElementById('whyline').textContent.length === UI.why.line.length), 9000, 80); await shot('2_bell');
  T.bell = await f.evaluate(() => { const S = FIGHT.S, W = UI.whySaid || {}; return { said: W, board: { casino: !!S.casino, garage: !!S.garage, tunnels: !!S.tunnels, inside: !!S.inside, ceiling: !!(S.boardDef && S.boardDef.ceiling), district: S.ground && S.ground.district } }; });
  log('BELL', JSON.stringify(T.bell).slice(0, 700));
  /* FIGHT: one of his is up; his card on the phone, then his sheet */
  await wait(4500); await tapSel(page.mainFrame(), '#bohphone .fgo');
  await until(async () => page.evaluate(() => { const hd = document.querySelector('#bohphone .fight .fh'); return !!hd && !hd.classList.contains('them') && hd.querySelectorAll('.fap .pp i').length > 0; }), 25000, 250).catch(() => null); await wait(800); await shot('3_his_card');
  await tapSel(page.mainFrame(), '#bohphone .fh .fme'); await wait(1300); await shot('4_his_sheet');
  T.faces = await f.evaluate(() => { const FF = window.BohemiaFightFace || null, mine = FIGHT.S.units.filter(u => u.side === 'you'); return { framed: !!FF, drawn: FF ? FF.n : 0, last: FF ? FF.said : null, crew: mine.map(u => ({ name: u.name, look: u.look, head: (function () { try { const w = BohemiaWear.of(u); return w && w.head; } catch (e) { return null; } })() })) }; });
  log('FACES', JSON.stringify(T.faces).slice(0, 500));
  if (process.env.GLASS) { const want = +process.env.GLASS;
    await f.evaluate(() => { const G = window.__GLASS = { frames: 0, starts: [], white: [], maxGap: 0 }; let chain = null, prev = null, pa = 0, last = 0;
      /* the board's true mean light (halved and halved again), never a few sample points: a hit's camera kick is not a flash */
      const mean = (cv) => { if (!chain || chain.w !== cv.width || chain.h !== cv.height) { chain = { w: cv.width, h: cv.height, L: [] }; let w = cv.width, h = cv.height; while (w > 16 || h > 16) { w = Math.max(1, Math.ceil(w / 2)); h = Math.max(1, Math.ceil(h / 2)); const c = document.createElement('canvas'); c.width = w; c.height = h; chain.L.push(c); } }
        let src = cv; chain.L.forEach((c, k) => { const g = c.getContext('2d', { willReadFrequently: k === chain.L.length - 1 }); g.imageSmoothingEnabled = true; g.clearRect(0, 0, c.width, c.height); g.drawImage(src, 0, 0, c.width, c.height); src = c; });
        const e = chain.L[chain.L.length - 1], d = e.getContext('2d').getImageData(0, 0, e.width, e.height).data, n = e.width * e.height; let s = 0; for (let i = 0; i < n; i++) s += (0.2126 * d[i * 4] + 0.7152 * d[i * 4 + 1] + 0.0722 * d[i * 4 + 2]) / 255; return s / n; };
      const tick = (now) => { requestAnimationFrame(tick); try { const el = document.getElementById('shotflash'), a = el ? +getComputedStyle(el).opacity || 0 : 0, lum = mean(cx.canvas);
          const glass = lum * (1 - a) + a; G.frames++; if (last) G.maxGap = Math.max(G.maxGap, now - last); last = now;
          if (prev !== null && glass - prev >= 0.10) G.starts.push(Math.round(now)); if (a > 0 && pa === 0) G.white.push(Math.round(now)); prev = glass; pa = a; } catch (e) { G.err = String(e); } };
      requestAnimationFrame(tick); });
    await page.touchscreen.tap(VP.width * 0.3, VP.height * 0.9); await wait(700);   /* a finger off the sheet puts it away */
    const phoneB = async (c) => tapSel(page.mainFrame(), '#bohphone button[data-c="' + c + '"]');
    await phoneB('auto'); await wait(700);
    for (let i = 0; i < 4; i++) { const h = await f.evaluate(() => UI.hand); if (h === want) break; await phoneB('speed'); await wait(450); }
    const st = await f.evaluate(() => ({ auto: !!UI.auto, hand: UI.hand })); if (!st.auto) { await phoneB('auto'); await wait(600); }
    const t0 = Date.now(); while (Date.now() - t0 < 80000) { const o = await f.evaluate(() => !!FIGHT.S.over).catch(() => true); if (o) break; await wait(500); }
    await wait(600); await shot('5_after_auto');
    const most = (s) => s.reduce((m, t) => Math.max(m, s.filter(x => x >= t && x < t + 1000).length), 0);
    T.glass = await f.evaluate(() => ({ G: window.__GLASS, seen: UI.shotSeen || {}, cap: UI.glass ? { n: UI.glass.n, held: UI.glass.held } : null, hand: UI.hand, auto: !!UI.auto, over: !!FIGHT.S.over })).catch(e => ({ err: String(e) }));
    if (T.glass.G) { T.glass.most = most(T.glass.G.starts); T.glass.mostWhite = most(T.glass.G.white); }
    log('GLASS', JSON.stringify({ want: want, hand: T.glass.hand, auto: T.glass.auto, over: T.glass.over, shots: T.glass.seen && T.glass.seen.fired, held: T.glass.seen && T.glass.seen.held, begun: T.glass.G && T.glass.G.starts.length, whites: T.glass.G && T.glass.G.white.length, mostInASecond: T.glass.most, mostWhite: T.glass.mostWhite, frames: T.glass.G && T.glass.G.frames, longestFrame: T.glass.G && Math.round(T.glass.G.maxGap), err: T.glass.err || (T.glass.G && T.glass.G.err) })); }
  T.errs = errs; fs.writeFileSync(path.join(OUT, 'why_true.json'), JSON.stringify(T, null, 1));
  log('DONE', WHICH, WAY, CASE, 'page errors', errs.length, errs.slice(0, 2).join(' | '));
  await page.close(); await ctx.close(); await browser.close(); process.exit(0);
})().catch(e => { console.log('FATAL', String(e && e.stack || e).slice(0, 600)); process.exit(1); });
