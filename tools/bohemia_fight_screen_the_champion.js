#!/usr/bin/env node
/* ============================================================================
   FIGHT SCREEN 4: A CHAMPION READS ON THE FIGHT SCREEN (VAMILY rules 493(c), 482, 495; the coordinator's order of 11/27 to FIGHT
   SCREEN 4: 'his name, his face, why he is dangerous, the prize on him, without a pop-up').
   Opens the real page (the demo or the alpha) the way a stranger opens it, on a phone upright (390 x 844) or on its side (844 x 390),
   meets a road crew led by a CHAMPION (brigand_leader_champion) through the map's own card, and reads, each with a still:
     B  THE BELL: the fight's one sentence, from his face when he leads them (the why tape): his name, his title, why he is dangerous
     C  THE CARD: the champion on the phone's man card: his name, his face, his mark, the prize's picture
     S  HIS SHEET: a finger on his face: his title, why he is dangerous, the prize on him, nothing off the glass
     X  THE PRIZE RIDES HOME: the fight's own spoils report for him (a champion, his weapon, his pockets' batteries) is the prize the card names
   node tools/bohemia_fight_screen_the_champion.js <alpha|demo> <upright|sideways> <outdir>
   BEFORE=1: the page as main had it (git show HEAD of the files this build changed), for the before stills
   ========================================================================== */
'use strict';
const { chromium } = (function () { try { return require('/opt/node22/lib/node_modules/playwright'); } catch (e) { return require('playwright'); } })();
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const WHICH = process.argv[2] || 'demo', WAY = process.argv[3] || 'upright', OUT = process.argv[4] || '/tmp/champion_read', BEFORE = !!process.env.BEFORE;
const BASE = 'https://paolosarn.github.io/bohemia/', FILE = WHICH === 'alpha' ? 'slices/BOHEMIA_ALPHA_0_9.html' : 'slices/BOHEMIA_DEMO.html';
const PUBLISHED = ['slices/', 'engine/', 'records/target/'];
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav', '.woff2': 'font/woff2', '.ttf': 'font/ttf' };
for (const d of ['', 'shots']) fs.mkdirSync(path.join(OUT, d), { recursive: true });
const { offTheTown } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { execSync } = require('child_process');
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), a.join(' '));
/* BEFORE: the files this build changed, as main had them (a file main does not have yet is not served: it did not exist) */
const CHANGED = ['slices/bohemia_phone.js', 'slices/BOHEMIA_FIGHT.html', 'records/target/bb/bohemia_enemies.json'], OLD = {}, GONE = {};
if (BEFORE) { for (const f of CHANGED) OLD[f] = execSync('git show ' + (process.env.BEFORE_REF || 'HEAD') + ':' + f, { cwd: ROOT, maxBuffer: 1 << 28 });
  for (const f of ['engine/bohemia_champion.js']) { try { execSync('git cat-file -e ' + (process.env.BEFORE_REF || 'HEAD') + ':' + f, { cwd: ROOT, stdio: 'ignore' }); } catch (e) { GONE[f] = true; } } }
/* PLANT=1: the read is cut out of the phone (the card's champion mark), so the gate can see itself fail */
(async () => {
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const VP = WAY === 'sideways' ? { width: 844, height: 390 } : { width: 390, height: 844 };
  const ctx = await browser.newContext({ viewport: VP, deviceScaleFactor: 2, hasTouch: true, isMobile: true, serviceWorkers: 'block' });
  await ctx.route('**/*', async (route) => { const u = route.request().url(); if (!u.startsWith(BASE)) return route.abort();
    const rel = decodeURIComponent(u.slice(BASE.length).split('?')[0].split('#')[0]), f = path.join(ROOT, rel);
    if (GONE[rel]) return route.fulfill({ status: 404, body: '' });
    if (OLD[rel]) return route.fulfill({ status: 200, body: OLD[rel], headers: { 'Content-Type': MIME[path.extname(rel)] } });
    if (process.env.PLANT && rel === 'slices/bohemia_phone.js') { const src = fs.readFileSync(f, 'utf8'), cut = src.replace("pl.classList.toggle('champ', !!CH);", "pl.classList.toggle('champ', false); CH = null;");
      if (cut === src) { log('PLANT DID NOT TAKE'); process.exit(1); } return route.fulfill({ status: 200, contentType: 'application/javascript', body: cut }); }
    if (!PUBLISHED.some(p => rel.startsWith(p)) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) return route.fulfill({ status: 404, body: '' });
    return route.fulfill({ status: 200, body: fs.readFileSync(f), headers: { 'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'max-age=600' } }); });
  const page = await ctx.newPage(), errs = []; page.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  const wait = (ms) => page.waitForTimeout(ms), until = async (fn, ms, step) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { try { if (await fn()) return true; } catch (e) {} await wait(step || 200); } return false; };
  const frame = (re) => page.frames().find(f => re.test(f.url())) || null, city = () => frame(/BOHEMIA_CITY_WORLD/), fightF = () => frame(/BOHEMIA_FIGHT\.html/);
  const box = async (f) => { if (f === page.mainFrame()) return { x: 0, y: 0 }; const h = await f.frameElement(); return h ? h.boundingBox() : null; };
  const tapSel = async (f, sel) => { const b = await f.evaluate((sel) => { const e = [...document.querySelectorAll(sel)].find(x => { const r = x.getBoundingClientRect(); return r.width > 3 && r.height > 3 && getComputedStyle(x).visibility !== 'hidden'; }); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, sel);
    if (!b) return false; const o = await box(f); await page.touchscreen.tap(o.x + b.x, o.y + b.y); return true; };
  const tapText = async (sel, re) => { for (const f of page.frames()) { try { const b = await f.evaluate(([sel, re]) => { const e = [...document.querySelectorAll(sel)].filter(x => new RegExp(re, 'i').test((x.textContent || '').trim())).filter(x => { const r = x.getBoundingClientRect(); return r.width > 3 && r.height > 3; })[0]; if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, [sel, re]);
      if (b) { const o = await box(f); await page.touchscreen.tap(o.x + b.x, o.y + b.y); return true; } } catch (e) {} } return false; };
  const shot = async (n) => { try { await page.screenshot({ path: path.join(OUT, 'shots', n + '.png') }); } catch (e) {} };
  const T = { which: WHICH, way: WAY, viewport: VP, before: BEFORE };
  await page.goto(BASE + FILE, { waitUntil: 'load', timeout: 300000 });
  /* the title drops a tap while it is still coming up (a slow box, a run right after another): tap NEW GAME until the next card is there */
  const titleUp = async () => { for (const f of page.frames()) { try { if (await f.evaluate(() => [...document.querySelectorAll('div,button,span')].some(x => /^NEW GAME$/i.test((x.textContent || '').trim()) && x.getBoundingClientRect().height > 3 && getComputedStyle(x).visibility !== 'hidden'))) return true; } catch (e) {} } return false; };
  await until(titleUp, 90000);
  for (let t0 = Date.now(); Date.now() - t0 < 120000;) { await tapText('div,button,span', '^NEW GAME$'); await wait(1500); if (!(await titleUp())) break; }
  await wait(1000);
  await until(() => tapText('#fronttap', 'BEGIN'), 90000); await wait(3500);
  await until(() => tapText('button,div', '^GO$'), 30000);
  for (let i = 0; i < 4; i++) { const up = await page.evaluate(() => { const m = document.getElementById('mainmaker'); return !!m && getComputedStyle(m).display !== 'none' && m.getBoundingClientRect().height > 50; }); if (!up) break; await wait(1500); await tapText('button,div', '^GO$'); }
  if (WHICH === 'alpha') { await wait(2000); await page.evaluate(() => { const t = document.querySelector('.tab[data-p="run"]'); if (t) t.click(); }); }
  await until(async () => { const c = city(); return c && await c.evaluate(() => typeof LOOP !== 'undefined' && MODE === 'city' && !!LOOP.open); }, 90000); await wait(5000);
  try { await tapText('button.lv', 'LEAVE'); await until(async () => city().evaluate(() => !LOOP.open), 8000); await wait(1500); } catch (e) {}
  await city().evaluate(() => { if (MODE !== 'city') { try { swapMode(); } catch (e) {} } }).catch(() => null);
  await until(async () => city().evaluate(() => MODE === 'city'), 8000); await wait(1500);
  await city().evaluate(offTheTown).catch(() => null);
  await until(async () => city().evaluate(() => !!(window.BohemiaJobDanger && BohemiaJobDanger.ready())), 30000);
  /* a road crew led by a champion: the road crew's champion in the leader's place */
  await city().evaluate(() => { const w = (function () { try { return roadWhere(); } catch (e) { return [city.x, city.y]; } })(), band = ['brigand_thug', 'brigand_thug', 'brigand_leader_champion', 'brigand_raider', 'brigand_marksman', 'brigand_thug'];
    const msg = { type: 'BOHEMIA_CITY_ENCOUNTER', label: 'the toll crew', faction: null, draft: true, packageId: 1, roster: band.map(() => ({ arch: 'human' })), party: { count: band.length, days: 40, difficulty: 1, faction: 'brigands', band: band, rolled: true }, at: w, why: 'road:7:caught' };
    try { MEET.on = true; return meetWalk(function () { return cityHandOver(msg); }); } catch (e) { return String(e); } }).catch(() => null);
  const hasCard = await until(async () => city().evaluate(() => !!document.querySelector('#meetcard button[data-meet="go"]')), 8000);
  if (hasCard) { await until(async () => city().evaluate(() => { const L = window.BohemiaFightOpener && BohemiaFightOpener.last; return !!(L && L.read && (L.typed || L.read.none)); }), 8000, 60); await wait(1300); await shot('0_opening_card');
    T.opening = await city().evaluate(() => { const c = document.getElementById('meetcard'); return c ? c.innerText.replace(/\s+/g, ' ').slice(0, 400) : null; }).catch(() => null);
    await tapSel(city(), '#meetcard button[data-meet="go"]'); }
  await until(async () => { const f = fightF(); return f && await f.evaluate(() => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.units.length > 0 && !!UI.board && !!UI.t0); }, 60000);
  const f = fightF(); if (!f) { log('NO FIGHT'); process.exit(1); }
  T.champ = await f.evaluate(() => { const v = FIGHT.S.units.find(u => u.champion); return v ? { id: v.id, name: v.name, title: v.champTitle, kind: v.kind, hp: v.hpMax, weapon: v.weapon && v.weapon.name, read: v.champRead || null } : null; });
  log('CHAMPION', JSON.stringify(T.champ));
  if (!T.champ) { log('NO CHAMPION DEALT'); fs.writeFileSync(path.join(OUT, 'champion.json'), JSON.stringify(T, null, 1)); await browser.close(); process.exit(1); }
  /* B: the bell, when the sentence has typed */
  await until(async () => f.evaluate(() => !!UI.whySaid), 20000, 80);
  await until(async () => f.evaluate(() => !UI.why || (document.getElementById('whyline').textContent.length >= UI.why.line.length)), 12000, 80); await wait(300);
  T.bell = await f.evaluate(() => { const el = document.getElementById('why'), vis = e => !!e && getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().height > 1;
    const R = e => { const r = e.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)]; };
    const c = el && el.querySelector('.why-champ');
    return { said: UI.whySaid, up: vis(el), box: el ? R(el) : null, name: (document.getElementById('whyname') || {}).textContent || '', line: (document.getElementById('whyline') || {}).textContent || '',
      champ: c && vis(c) ? { text: c.innerText.replace(/\s+/g, ' ').trim(), box: R(c), off: (function () { const r = c.getBoundingClientRect(); return r.left < -0.5 || r.right > innerWidth + 0.5 || r.top < -0.5 || r.bottom > innerHeight + 0.5; })() } : null,
      text: el ? el.innerText.replace(/\s+/g, ' ').trim() : '' }; });
  await shot('1_bell'); log('BELL', JSON.stringify(T.bell));
  /* C: the champion on the phone's card, the way a finger on him puts him there */
  const READ = () => page.evaluate(() => { const ph = document.getElementById('bohphone'), hd = ph && ph.querySelector('.fight .fh'); if (!hd) return { none: true };
    const vis = e => { const r = e.getBoundingClientRect(), st = getComputedStyle(e); return r.width > 0.5 && r.height > 0.5 && st.display !== 'none' && st.visibility !== 'hidden'; };
    const R = e => { const r = e.getBoundingClientRect(); return [Math.round(r.left * 10) / 10, Math.round(r.top * 10) / 10, Math.round(r.width * 10) / 10, Math.round(r.height * 10) / 10]; };
    const hb = hd.getBoundingClientRect(), all = [...hd.querySelectorAll('*')].filter(vis), b = hd.querySelector('b'), pl = hd.querySelector('.fap .pl');
    const ch = pl && pl.querySelector('.ch'), pz = hd.querySelector('.fme .pz');
    return { name: b ? b.textContent : '', them: hd.classList.contains('them'), champ: !!(pl && pl.classList.contains('champ')), card: R(hd),
      mark: ch && vis(ch) ? { box: R(ch), says: ch.getAttribute('aria-label'), drawn: getComputedStyle(ch).backgroundImage.slice(0, 22) } : null,
      prize: pz && vis(pz) ? { box: R(pz), says: pz.getAttribute('aria-label'), drawn: getComputedStyle(pz).backgroundImage.slice(0, 22) } : null,
      lv: (hd.querySelector('.fap .pl .lv') || {}).textContent || null, marks: [...hd.querySelectorAll('.fap .pl .mk')].filter(vis).map(m => m.className.replace('mk ', '')),
      edge: getComputedStyle(hd).borderLeftColor, nameColour: b ? getComputedStyle(b).color : '',
      off: all.filter(e => { const r = e.getBoundingClientRect(); return r.left < hb.left - 0.6 || r.right > hb.right + 0.6 || r.top < hb.top - 0.6 || r.bottom > hb.bottom + 0.6; }).map(e => (e.className || e.tagName) + ' ' + JSON.stringify(R(e))),
      says: window.__PHONE_CARD_SAYS || null }; });
  await f.evaluate((id) => { const v = FIGHT.byId(id); if (v) { UI.pend = { target: v }; hud(); } }, T.champ.id);
  await until(async () => { const c = await READ(); return c && !c.none && c.them && c.name.indexOf(T.champ.name.split(' ')[0]) >= 0; }, 8000, 80); await wait(500);
  T.card = await READ(); await shot('2_card'); log('CARD', JSON.stringify(T.card));
  /* W: THE WORST ROW: every mark he could wear (outclasses, dodges, armour), the skull, the prize, and a gun in his hands with six cases showing,
     laid in the card's own row the way the painter lays them; nothing may leave the card. Then the card is painted again from the fight */
  const WORST = () => page.evaluate(() => { const hd = document.querySelector('#bohphone .fight .fh'), fa = hd && hd.querySelector('.fap'), pl = fa && fa.querySelector('.pl'); if (!pl) return null;
    ['oc', 'dodge', 'armour'].forEach(k => { if (!pl.querySelector('.mk.' + k)) { const i = document.createElement('i'); i.className = 'mk ' + k; pl.insertBefore(i, pl.querySelector('.pz')); } });
    const rd = fa.querySelector('.rd'); if (rd) { rd.style.display = ''; rd.innerHTML = '<i class="on"></i>'.repeat(fa.classList.contains('cls') ? 4 : 6);   /* the most the painter lays for a man of theirs (4) */ }
    const hb = hd.getBoundingClientRect(), R = e => { const r = e.getBoundingClientRect(); return [Math.round(r.left * 10) / 10, Math.round(r.width * 10) / 10]; };
    const all = [...fa.querySelectorAll('.pl > i, .rd')].filter(e => getComputedStyle(e).display !== 'none');
    return { pieces: all.map(e => (e.className || e.tagName) + ' ' + JSON.stringify(R(e))), cardRight: Math.round((hb.right) * 10) / 10,
      off: all.filter(e => { const r = e.getBoundingClientRect(); return r.right > hb.right + 0.6 || r.left < hb.left - 0.6; }).map(e => e.className),
      /* two pieces of the row on top of each other (the cases over a mark) */
      over: all.flatMap((a, i) => all.slice(i + 1).filter(b => { const p = a.getBoundingClientRect(), q = b.getBoundingClientRect(); return Math.min(p.right, q.right) - Math.max(p.left, q.left) > 0.6; }).map(b => a.className + ' x ' + b.className)) }; });
  const REPAINT = () => page.evaluate(() => { try { const pl = document.querySelector('#bohphone .fight .fh .fap .pl'); if (pl) pl.textContent = ''; window.BohemiaPhone.fightPaint(true); } catch (e) {} });
  T.worst = await WORST(); await shot('2w_card_worst'); log('WORST', JSON.stringify(T.worst));
  await REPAINT(); await wait(300);
  /* the same worst row on a plain man of theirs (the row is the card's, not the champion's) */
  T.worstPlain = await f.evaluate(() => { const v = FIGHT.S.units.find(u => u.side === 'them' && !u.champion && FIGHT.onField(u)); if (!v) return null; UI.pend = { target: v }; hud(); return v.name; });
  if (T.worstPlain) { await wait(500); T.worstPlainRow = await WORST(); log('WORST PLAIN', JSON.stringify(T.worstPlainRow)); await REPAINT(); }
  await f.evaluate((id) => { const v = FIGHT.byId(id); if (v) { UI.pend = { target: v }; hud(); } }, T.champ.id); await wait(400);
  /* the card's paint costs nothing more for the champion: what one repaint costs here (window.__PHONE_MAN_T, the card's own clock) */
  T.cardCost = await page.evaluate(() => window.__PHONE_MAN_T ? { n: window.__PHONE_MAN_T.n, avg: Math.round(window.__PHONE_MAN_T.ms / Math.max(1, window.__PHONE_MAN_T.n) * 100) / 100, max: Math.round(window.__PHONE_MAN_T.max * 100) / 100 } : null);
  /* a plain man of theirs on the card: no champion mark, no prize */
  T.plain = await f.evaluate(() => { const v = FIGHT.S.units.find(u => u.side === 'them' && !u.champion && FIGHT.onField(u)); if (!v) return null; UI.pend = { target: v }; hud(); return v.name; });
  if (T.plain) { await until(async () => { const c = await READ(); return c && c.name.indexOf(T.plain.split(' ')[0]) >= 0; }, 4000, 80); await wait(300); const c = await READ(); T.plainCard = { name: c.name, champ: c.champ, mark: !!c.mark, prize: !!c.prize }; }
  /* S: a finger on his face: his sheet */
  await f.evaluate((id) => { const v = FIGHT.byId(id); if (v) { UI.pend = { target: v }; hud(); } }, T.champ.id); await wait(600);
  await tapSel(page.mainFrame(), '#bohphone .fh .fme'); await wait(1300); await shot('3_sheet');
  T.sheet = await f.evaluate(() => { const d = document.getElementById('drawer'); if (!d || getComputedStyle(d).display === 'none') return { shown: false };
    const R = e => { const r = e.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)]; }, q = s => d.querySelector(s);
    const ch = q('.sh-champ'), b = d.getBoundingClientRect();
    return { shown: true, name: (q('.sh-name') || {}).textContent || '', sub: (q('.sh-sub') || {}).textContent || '', tell: (q('.sh-tell') || {}).textContent || '',
      champ: ch ? { text: ch.innerText.replace(/\s+/g, ' ').trim(), box: R(ch), prize: !!ch.querySelector('.sh-prize'), pic: (function () { const p = ch.querySelector('.sh-prize canvas, .sh-prize i'); return p ? R(p) : null; })() } : null,
      spill: (function () { const w = q('.sh-w'); if (!w) return []; const b = w.getBoundingClientRect(); return [...w.querySelectorAll('*')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.right > b.right + 0.6 || r.left < b.left - 0.6); }).map(e => e.className || e.tagName); })(),
      box: R(d), fits: UI.sheetFit || null, onGlass: b.top >= -1 && b.bottom <= innerHeight + 1 && b.left >= -1 && b.right <= innerWidth + 1 }; });
  log('SHEET', JSON.stringify(T.sheet));
  await tapSel(page.mainFrame(), '#bohphone .fh .fme'); await wait(500); await f.evaluate(() => { UI.pend = null; hud(); });
  /* X: the prize is true: the fight's own spoils report (what rides home) carries the prize the card names, and the drop rule finds it */
  T.prizeTrue = await f.evaluate((id) => { try { const v = FIGHT.byId(id), sp = spoilsOf(), b = sp.bodies.find(x => x.name === v.name);
      return { body: b ? { champion: !!b.champion, prize: b.prize || null, weapon: b.weapon && b.weapon.id } : null, read: v.champRead ? v.champRead.prize : null }; } catch (e) { return { err: String(e) }; } }, T.champ.id);
  log('PRIZE', JSON.stringify(T.prizeTrue));
  T.errors = errs;
  fs.writeFileSync(path.join(OUT, 'champion.json'), JSON.stringify(T, null, 1));
  log('ERRORS', errs.length, JSON.stringify(errs.slice(0, 5)));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
