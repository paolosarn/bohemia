#!/usr/bin/env node
/* ============================================================================
   FIGHT SCREEN TWO: THE MAN'S CARD ON THE PHONE, AND THE THREE CARDS AS ONE FAMILY, ON THE PAGE HE PLAYS
   (rule 450(a), rule 441(a); ask row 621). Opens the real page (the demo or the alpha) the way a stranger opens it, on a phone
   upright (390 x 844) or on its side (844 x 390), meets a led crew through the map's own card (the opening card, a still),
   ENGAGES with a finger, and reads the phone's man card off the glass three times, each with a still:
     T  a man of THEIRS on the card (the bell): the edge, the pinned face, the name, three bars, his plate as marks
     L  the same man under a LONG name ('WATCH CAPTAIN OF THE HOUSE'): two lines, nothing cut, nothing off the card
     H  a man of HIS on the card (FIGHT pressed): the gold edge, the bars, his AP as pips
   and then a finger on the face: HIS SHEET (a still; a man of theirs' plate is read there in words).
   For each: the card's box (the phone never grows), every piece inside it, the smallest type showing, digits showing, whether
   the name is cut, the marks and what each is called.
   node tools/bohemia_fight_screen_the_phone_card.js <alpha|demo> <upright|sideways> <outdir>       BEFORE=1: the card as it was
   ========================================================================== */
'use strict';
const { chromium } = (function () { try { return require('/opt/node22/lib/node_modules/playwright'); } catch (e) { return require('playwright'); } })();
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const WHICH = process.argv[2] || 'demo', WAY = process.argv[3] || 'upright', OUT = process.argv[4] || '/tmp/phone_card', BEFORE = !!process.env.BEFORE;
const BASE = 'https://paolosarn.github.io/bohemia/', FILE = WHICH === 'alpha' ? 'slices/BOHEMIA_ALPHA_0_9.html' : 'slices/BOHEMIA_DEMO.html';
const PUBLISHED = ['slices/', 'engine/', 'records/target/'];
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.txt': 'text/plain' };
for (const d of ['', 'shots']) fs.mkdirSync(path.join(OUT, d), { recursive: true });
const { offTheTown } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { execSync } = require('child_process');
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), a.join(' '));
/* BEFORE: the two files this ship changed, as main had them before it (git show), so the same tool takes the before stills */
const OLD = {}; if (BEFORE) for (const f of ['slices/bohemia_phone.js', 'slices/BOHEMIA_FIGHT.html']) OLD[f] = execSync('git show ' + (process.env.BEFORE_REF || 'HEAD') + ':' + f, { cwd: ROOT, maxBuffer: 1 << 28 });
(async () => {
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const VP = WAY === 'sideways' ? { width: 844, height: 390 } : { width: 390, height: 844 };
  const ctx = await browser.newContext({ viewport: VP, deviceScaleFactor: 2, hasTouch: true, isMobile: true, serviceWorkers: 'block' });
  await ctx.route('**/*', async (route) => { const u = route.request().url(); if (!u.startsWith(BASE)) return route.abort();
    const rel = decodeURIComponent(u.slice(BASE.length).split('?')[0].split('#')[0]), f = path.join(ROOT, rel);
    if (OLD[rel]) return route.fulfill({ status: 200, body: OLD[rel], headers: { 'Content-Type': MIME[path.extname(rel)] } });
    if (process.env.LASTHIT_PLANT && rel === 'slices/bohemia_phone.js') { const src = fs.readFileSync(f, 'utf8'), cut = src.replace("lo.style.display = lw > 0.4 ? '' : 'none';", "lo.style.display = 'none';"); if (cut === src) throw new Error('the last-hit plant did not take'); return route.fulfill({ status: 200, body: cut, headers: { 'Content-Type': 'text/javascript' } }); }
    if (process.env.DRONE_PLANT && rel === 'slices/bohemia_phone.js') { const src = fs.readFileSync(f, 'utf8'), cut = src.replace("A.list.filter(function (a) { return a.kind === 'drone'; }).slice(0, 1).concat(", "[].concat(");
      if (cut === src) { log('DRONE_PLANT DID NOT TAKE'); process.exit(1); } return route.fulfill({ status: 200, contentType: 'application/javascript', body: cut }); }   /* __THE_DRONE_ON_THE_BIG_ROW__'s plant */
    if (process.env.HIT_PLANT && rel === 'slices/bohemia_phone.js') { const src = fs.readFileSync(f, 'utf8'), cut = src.replace("if (seen && seen.name === M.name", "if (false && seen && seen.name === M.name");
      if (cut === src) { log('HIT_PLANT DID NOT TAKE'); process.exit(1); } return route.fulfill({ status: 200, contentType: 'application/javascript', body: cut }); }   /* __THE_HIT_LANDS_ON_THE_CARD__'s plant */
    if (process.env.THEIRS_PLANT && rel === 'slices/bohemia_phone.js') { const src = fs.readFileSync(f, 'utf8'), cut = src.replace("var theirs = A.whose === 'them';", "var theirs = false;");
      if (cut === src) { log('THEIRS_PLANT DID NOT TAKE'); process.exit(1); } return route.fulfill({ status: 200, contentType: 'application/javascript', body: cut }); }   /* __NOTHING_TO_PRESS_ON_THEIR_TURN__'s plant */
    if (process.env.NOCHOP_PLANT && rel === 'slices/bohemia_phone.js') { const src = fs.readFileSync(f, 'utf8'), cut = src.replace("var P = H.manSub = force || !H.manSub ? {} : H.manSub,", "var P = H.manSub = {},");
      if (cut === src) { log('NOCHOP_PLANT DID NOT TAKE'); process.exit(1); } return route.fulfill({ status: 200, contentType: 'application/javascript', body: cut }); }   /* __NEVER_CHOPPY__'s plant: every part painted on every change */
    if (process.env.ROUNDS_PLANT && rel === 'slices/bohemia_phone.js') { const src = fs.readFileSync(f, 'utf8'), cut = src.replace("rd.style.display = R0 ? '' : 'none';", "rd.style.display = 'none';");
      if (cut === src) { log('ROUNDS_PLANT DID NOT TAKE'); process.exit(1); } return route.fulfill({ status: 200, contentType: 'application/javascript', body: cut }); }   /* __THE_ROUNDS_ON_THE_CARD__'s plant */
    if (process.env.PLANT && rel === 'slices/bohemia_phone.js') { const src = fs.readFileSync(f, 'utf8'), cut = src.replace("nb.classList.add('long'); if (nb.scrollHeight > 15)", "if (nb.scrollHeight > 15)"); if (cut === src) throw new Error('the plant did not take'); return route.fulfill({ status: 200, body: cut, headers: { 'Content-Type': 'text/javascript' } }); }
    if (!PUBLISHED.some(p => rel.startsWith(p)) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) return route.fulfill({ status: 404, body: '' });
    return route.fulfill({ status: 200, body: fs.readFileSync(f), headers: { 'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'max-age=600' } }); });
  const page = await ctx.newPage(), errs = []; page.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  const wait = (ms) => page.waitForTimeout(ms), until = async (fn, ms, step) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { try { if (await fn()) return true; } catch (e) {} await wait(step || 200); } return false; };
  const frame = (re) => page.frames().find(f => re.test(f.url())) || null, city = () => frame(/BOHEMIA_CITY_WORLD/), fightF = () => frame(/BOHEMIA_FIGHT\.html/);
  const box = async (f) => { if (f === page.mainFrame()) return { x: 0, y: 0 }; const h = await f.frameElement(); return h ? h.boundingBox() : null; };
  const tapSel = async (f, sel) => { const b = await f.evaluate((sel) => { const e = [...document.querySelectorAll(sel)].find(x => { const r = x.getBoundingClientRect(); return r.width > 3 && r.height > 3 && getComputedStyle(x).visibility !== 'hidden'; }); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, sel); if (!b) return false; const fb = await box(f); await page.touchscreen.tap(fb.x + b.x, fb.y + b.y); return true; };
  const tapText = async (sel, re) => { for (const f of page.frames()) { try { const b = await f.evaluate(([sel, re]) => { const e = [...document.querySelectorAll(sel)].filter(x => new RegExp(re, 'i').test((x.textContent || '').trim())).filter(x => { const r = x.getBoundingClientRect(), st = getComputedStyle(x); return r.width > 3 && r.height > 3 && st.visibility !== 'hidden' && st.display !== 'none'; }).pop(); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, [sel, re]); if (!b) continue; const fb = await box(f); await page.touchscreen.tap(fb.x + b.x, fb.y + b.y); return true; } catch (e) {} } return false; };
  const shot = async (n) => { try { await page.screenshot({ path: path.join(OUT, 'shots', n + '.png') }); } catch (e) {} };
  const T = { which: WHICH, way: WAY, viewport: VP, before: BEFORE, cards: {} };
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
  await city().evaluate(() => { const w = (function () { try { return roadWhere(); } catch (e) { return [city.x, city.y]; } })(), band = ['brigand_thug', 'brigand_thug', 'brigand_leader', 'brigand_raider', 'brigand_marksman', 'brigand_thug'];
    const msg = { type: 'BOHEMIA_CITY_ENCOUNTER', label: 'the toll crew', faction: null, draft: true, packageId: 1, roster: band.map(() => ({ arch: 'human' })), party: { count: band.length, days: 40, difficulty: 1, faction: 'brigands', band: band, rolled: true }, street: true, why: 'road:toll_crew', at: { gx: w[0] | 0, gy: w[1] | 0 } };
    try { MEET.on = true; return meetWalk(function () { return cityHandOver(msg); }); } catch (e) { return String(e); } }).catch(() => null);
  const hasCard = await until(async () => city().evaluate(() => !!document.querySelector('#meetcard button[data-meet="go"]')), 8000);
  if (hasCard) { await until(async () => city().evaluate(() => { const L = window.BohemiaFightOpener && BohemiaFightOpener.last; return !!(L && L.read && (L.typed || L.read.none)); }), 8000, 60); await wait(1300); await shot('1_opening_card'); T.openingStrip = await city().evaluate(() => { const mc = document.querySelector('#meetcard .mc'); return mc ? getComputedStyle(mc, '::before').backgroundColor : null; }); await tapSel(city(), '#meetcard button[data-meet="go"]'); }
  T.openingCard = hasCard;
  await until(async () => { const f = fightF(); return f && await f.evaluate(() => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.units.length > 0 && !!UI.board && !!UI.t0); }, 60000);
  const f = fightF(); if (!f) { log('NO FIGHT'); process.exit(1); }
  /* the phone's card, read off the top page */
  const READ = () => page.evaluate(() => { const ph = document.getElementById('bohphone'), fi = ph && ph.querySelector('.fight'), hd = fi && fi.querySelector('.fh'); if (!hd) return { none: true };
    const vis = e => { const r = e.getBoundingClientRect(), st = getComputedStyle(e); return r.width > 0.5 && r.height > 0.5 && st.display !== 'none' && st.visibility !== 'hidden'; };
    const R = e => { const r = e.getBoundingClientRect(); return [Math.round(r.left * 10) / 10, Math.round(r.top * 10) / 10, Math.round(r.width * 10) / 10, Math.round(r.height * 10) / 10]; };
    const hb = hd.getBoundingClientRect(), all = [...hd.querySelectorAll('*')].filter(vis), txt = all.filter(e => [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()));
    const scale = hb.width / hd.offsetWidth, b = hd.querySelector('b'), cv = hd.querySelector('canvas'), st = getComputedStyle(hd);
    const inked = c => { try { const g = c.getContext('2d'), d = g.getImageData(0, 0, c.width, c.height).data, seen = new Set(); for (let i = 0; i < d.length; i += 16 * 4) seen.add((d[i] >> 4) + ',' + (d[i + 1] >> 4) + ',' + (d[i + 2] >> 4)); return seen.size; } catch (e) { return -1; } };
    return { phone: R(ph), page: R(fi), card: R(hd), scale: Math.round(scale * 1000) / 1000, them: hd.classList.contains('them'), edge: st.borderLeftColor, edgeW: st.borderLeftWidth, ground: st.backgroundColor,
      name: b.textContent, nameBox: R(b), nameCut: b.scrollWidth > b.clientWidth + 1 || b.scrollHeight > b.clientHeight + 1, long: b.classList.contains('long'),
      type: txt.map(e => [e.className || e.tagName, Math.round(parseFloat(getComputedStyle(e).fontSize) * scale * 10) / 10, e.textContent.trim().slice(0, 30)]),
      digits: txt.map(e => e.textContent).join(' ').replace(/[^0-9]/g, '').length, cutText: txt.filter(e => (e.scrollWidth > e.clientWidth + 1) && getComputedStyle(e).overflow !== 'visible').map(e => e.textContent.slice(0, 30)),
      off: all.filter(e => { const r = e.getBoundingClientRect(); return r.left < hb.left - 0.6 || r.right > hb.right + 0.6 || r.top < hb.top - 0.6 || r.bottom > hb.bottom + 0.6; }).map(e => (e.className || e.tagName) + ' ' + JSON.stringify(R(e))),
      bars: [...hd.querySelectorAll('.fb')].map(r => { const s = r.querySelector('s'), i = r.querySelector('i'); return { track: R(s), fill: Math.round(i.getBoundingClientRect().width / Math.max(1, s.getBoundingClientRect().width) * 100), colour: getComputedStyle(i).backgroundColor, num: vis(r.querySelector('em')) }; }),
      pips: [...hd.querySelectorAll('.fap .pp i')].filter(vis).length, pipsOn: [...hd.querySelectorAll('.fap .pp i.on')].filter(vis).length, pip: (function () { const p = [...hd.querySelectorAll('.fap .pp i')].filter(vis)[0]; return p ? R(p) : null; })(),
      marks: [...hd.querySelectorAll('.fap .pl .mk')].filter(vis).map(m => ({ kind: m.className.replace('mk ', ''), says: m.getAttribute('aria-label'), box: R(m), drawn: getComputedStyle(m).backgroundImage.slice(0, 22) })), lv: (hd.querySelector('.fap .pl .lv') || {}).textContent || null,
      strip: getComputedStyle(hd, '::before').backgroundColor, stripW: getComputedStyle(hd, '::before').width, frame: cv ? getComputedStyle(cv).boxShadow.replace(/\s+/g, ' ').slice(0, 60) : '', kept: { hp: (hd.querySelector('.fb.hp em') || {}).textContent || '', ap: (hd.querySelector('.fap em') || {}).textContent || '' },
      face: cv ? R(cv) : null, faceInk: cv ? inked(cv) : 0, says: window.__PHONE_CARD_SAYS || null, fightBtn: (function () { const g = fi.querySelector('.fgo'); return g ? R(g) : null; })(), skills: (function () { const a = fi.querySelector('.ab'); return a ? { box: R(a), cut: a.scrollHeight > a.clientHeight + 1 } : null; })() }; });
  await until(async () => f.evaluate(() => !!UI.whySaid), 15000, 80); await wait(1800);
  /* FIGHT SCREEN THREE 11/20 (__HIS_MAN_IN_THE_LINEUP__): in the lineup the card is HIS man now (it wore their first man as if his); a man
     of theirs is put on the card the way a finger on him does (UI.pend.target, the same door the plates below use) */
  await f.evaluate(() => { const v = FIGHT.S.units.find(u => u.side === 'them' && FIGHT.onField(u)); if (v) { UI.pend = { target: v }; hud(); } });
  await until(async () => { const c = await READ(); return c && !c.none && !!c.name && c.them; }, 8000);
  T.cards.theirs = await READ(); await shot('2_phone_theirs');
  log('THEIRS', JSON.stringify(T.cards.theirs));
  /* every man of theirs put on the card in turn: the phone's marks against the fight's own read of him */
  T.plates = [];
  const ids = await f.evaluate(() => FIGHT.S.units.filter(u => u.side === 'them' && FIGHT.onField(u)).map(u => u.id));
  for (const id of ids) { const want = await f.evaluate((id) => { const v = FIGHT.byId(id), c = classOf(v); UI.pend = { target: v }; hud(); return { name: v.name, lv: lvOf(v), plate: [c.lv, c.outclass ? 1 : 0, c.dodge ? 1 : 0, c.armour ? 1 : 0], says: [CLASS_SAYS.outclass, CLASS_SAYS.dodge, CLASS_SAYS.armour] }; }, id);
    await until(async () => { const c = await READ(); return c && c.says && c.says.plate && c.says.plate.join() === want.plate.join() && c.them; }, 2500, 80);
    const c = await READ(); T.plates.push({ id: id, want: want, lv: c.lv, marks: c.marks.map(m => m.kind), named: c.marks.map(m => m.says), drawn: c.marks.every(m => /^url\(/.test(m.drawn)), digits: c.digits, cut: c.nameCut || c.cutText.length > 0, off: c.off.length, card: c.card }); }
  await f.evaluate(() => { UI.pend = null; hud(); }); await wait(500);
  log('PLATES', JSON.stringify(T.plates.map(p => [p.want.name, p.want.plate.join(''), p.lv, p.marks.join('+')])));
  /* a long name on the same man */
  const longOk = await f.evaluate(() => { try { const nm = document.getElementById('cnm').textContent.replace(/\s*\*$/, ''), v = FIGHT.S.units.find(u => u.name === nm); if (!v) return false; v.__was = v.name; v.name = 'WATCH CAPTAIN OF THE HOUSE'; hud(); return true; } catch (e) { return String(e); } });
  await wait(900); T.cards.long = await READ(); T.cards.long.set = longOk; await shot('3_phone_long_name');
  log('LONG', JSON.stringify({ name: T.cards.long.name, long: T.cards.long.long, cut: T.cards.long.nameCut, nameBox: T.cards.long.nameBox, card: T.cards.long.card, off: T.cards.long.off, bars: T.cards.long.bars.map(b => b.track[3]) }));
  await f.evaluate(() => { try { const v = FIGHT.S.units.find(u => u.__was); if (v) { v.name = v.__was; delete v.__was; hud(); } } catch (e) {} }); await wait(500);
  /* the sheet of a man of theirs: a finger on the face (a man of theirs put on the card first: in the lineup the card is his) */
  await f.evaluate(() => { const v = FIGHT.S.units.find(u => u.side === 'them' && FIGHT.onField(u)); if (v) { UI.pend = { target: v }; hud(); } }); await wait(500);
  await tapSel(page.mainFrame(), '#bohphone .fh .fme'); await wait(1200); await shot('4_sheet_theirs');
  T.sheetTheirs = await f.evaluate(() => { const d = document.getElementById('drawer'); if (!d || getComputedStyle(d).display === 'none') return { shown: false }; const p = d.querySelector('.sh-plate'), r = d.getBoundingClientRect();
    return { shown: true, strip: getComputedStyle(d, '::before').backgroundColor, plateDrawn: p ? [...p.querySelectorAll('.pmk')].every(m => /^url\(/.test(getComputedStyle(m).backgroundImage)) : null, name: (d.querySelector('.sh-name') || {}).textContent, sub: (d.querySelector('.sh-sub') || {}).textContent, plate: p ? [...p.querySelectorAll('em')].map(e => e.textContent) : null, plateMarks: p ? p.querySelectorAll('.pmk').length : 0, edge: getComputedStyle(d).borderLeftColor, fit: UI.sheetFit && UI.sheetFit.fits, box: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)] }; });
  /* a finger on a mark: its word on the reading line, the sheet still up */
  const mk = await f.evaluate(() => { const m = document.querySelector('#drawer .sh-plate .pmk'), rd = document.querySelector('#drawer .sh-read'); if (!m || !rd) return null; const r = m.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, word: m.nextSibling ? m.nextSibling.textContent : '' }; });
  if (mk) { const fb = await box(f); await page.touchscreen.tap(fb.x + mk.x, fb.y + mk.y); await wait(450); T.sheetTheirs.markRead = await f.evaluate(() => ({ up: getComputedStyle(document.getElementById('drawer')).display !== 'none', text: (document.querySelector('#drawer .sh-read') || {}).textContent || '' })); T.sheetTheirs.markRead.word = mk.word; await shot('4b_sheet_mark_read'); }
  log('SHEET', JSON.stringify(T.sheetTheirs));
  await tapSel(page.mainFrame(), '#bohphone .fh .fme'); await wait(600); await f.evaluate(() => { UI.pend = null; hud(); });
  /* FIGHT: the line is set, one of his is up */
  await tapSel(page.mainFrame(), '#bohphone .fgo'); 
  await until(async () => { const c = await READ(); return c && !c.none && !c.them && c.pips > 0; }, 60000, 250); await wait(700);
  /* a turn of theirs that outlasts the wait (two browsers at once, measured 11/22: a MARKSMAN's turn still up at 60 s): his man is put on the
     card the way a finger on him does (UI.pend.target, the same door the plates use), so the card read is HIS card, as the legs need */
  if (await READ().then(c => !c || c.none || c.them || !(c.pips > 0))) { T.hisPut = await f.evaluate(() => { const v = FIGHT.S.units.filter(u => u.side === 'you' && FIGHT.onField(u)).sort((a, b) => (b.main ? 1 : 0) - (a.main ? 1 : 0))[0]; if (!v) return null; UI.pend = { target: v }; hud(); return v.name; });
    await until(async () => { const c = await READ(); return c && !c.none && !c.them && c.pips > 0; }, 5000, 120); await wait(500); }
  /* where the fight stood when the card was read (a wait that ran out says why) */
  T.hisAt = await f.evaluate(() => { const u = FIGHT.current(); return { deploy: !!FIGHT.S.deploy, round: FIGHT.S.round, cur: u ? u.name + ' (' + u.side + ')' : null, pend: UI.pend && UI.pend.target ? UI.pend.target.name : null, over: !!FIGHT.S.over, anim: UI.anim.length, card: document.getElementById('cnm').textContent, apData: document.getElementById('ap').dataset.rounds }; }).catch(e => String(e));
  log('HIS AT', JSON.stringify(T.hisAt));
  T.cards.his = await READ(); await shot('5_phone_his');
  log('HIS', JSON.stringify(T.cards.his));
  /* __THE_LAST_HIT_ON_THE_CARD__ (FIGHT SCREEN THREE 11/20): a quarter of his health and a third of his armour taken since the bell (his mark);
     the card's bars carry what is left and, in the board's punch colour, what was taken; then put back. LASTHIT_PLANT=1 takes the drawing out */
  const hit = await f.evaluate(() => { let u = FIGHT.current(); if (!u || u.side !== 'you') { u = FIGHT.S.units.find(v => v.side === 'you' && FIGHT.onField(v)); if (!u) return null; }
    UI.pend = { target: u };   /* the man hit is the man on the card, his turn or not (a man the walk put there earlier, hisPut, is not left over him) */
    const w = { id: u.id, hp: u.hp, armB: u.armB };
    const dh = Math.max(0, Math.min(Math.round(u.hpMax * 0.25), u.hp - 1)), da = Math.min(u.armB, Math.round((u.armBMax + u.armHMax) / 3)); u.hp -= dh; u.armB -= da; hud();
    /* what the fight itself says was taken since his mark (a real blow before this one counts too) */
    return { w: w, wantHp: 100 * (Math.min(u._hpEnd, u.hpMax) - u.hp) / u.hpMax, wantArm: 100 * Math.max(0, u._armEnd - (u.armB + u.armH)) / Math.max(1, u.armBMax + u.armHMax), mark: u._hpEnd != null, before: 100 * (Math.min(u._hpEnd, u.hpMax) - w.hp) / u.hpMax }; });
  if (hit) { await wait(700); await shot('6_phone_his_hit');
    T.lastHit = await page.evaluate(() => { const r = (sel) => { const s = document.querySelector('#bohphone .fh .fb.' + sel + ' s'), u = s && s.querySelector('u.lost'), i = s && s.querySelector('i'); if (!s) return null;
        const sb = s.getBoundingClientRect(), ub = u && getComputedStyle(u).display !== 'none' ? u.getBoundingClientRect() : null, ib = i.getBoundingClientRect();
        return { lost: ub ? Math.round(1000 * ub.width / sb.width) / 10 : 0, at: ub ? Math.round(1000 * (ub.left - sb.left) / sb.width) / 10 : null, left: Math.round(1000 * ib.width / sb.width) / 10, colour: u ? getComputedStyle(u).backgroundColor : null }; };
      return { hp: r('hp'), arm: r('arm'), fat: r('fat') }; });
    T.lastHit.want = { hp: Math.round(hit.wantHp * 10) / 10, arm: Math.round(hit.wantArm * 10) / 10, mark: hit.mark };
    await f.evaluate((w) => { const u = FIGHT.byId(w.id); u.hp = w.hp; u.armB = w.armB; hud(); }, hit.w); await wait(500);
    T.lastHit.wantAfter = await f.evaluate(() => { const e = document.getElementById('bhp'); return Math.round((parseFloat(e && e.dataset.lost) || 0) * 10) / 10; });   /* FIGHT SCREEN 4 11/28: read while the hit man is still pinned to the card (UI.pend), the fight's share first and the phone painted from it at once: released first, a turn of theirs moved the card to another man between the two reads (P8 read 0 against a marksman's 88.3) */
    await page.evaluate(() => { try { window.BohemiaPhone.fightPaint(true); } catch (e) {} });
    T.lastHit.after = await page.evaluate(() => { const u = document.querySelector('#bohphone .fh .fb.hp s u.lost'), s = u && u.parentNode; return u && getComputedStyle(u).display !== 'none' ? Math.round(1000 * u.getBoundingClientRect().width / s.getBoundingClientRect().width) / 10 : 0; });
    await f.evaluate(() => { if (UI.pend && UI.pend.target && UI.pend.target.side === 'you') { UI.pend = null; hud(); } }).catch(() => null);
    log('LAST HIT', JSON.stringify(T.lastHit)); }
  /* __THE_ROUNDS_ON_THE_CARD__ (FIGHT SCREEN THREE 11/22, rule 478(a)): a gunman of his on the card: the phone's cartridges against the fight's own
     count (FIGHT.rounds), one round spent, then none (dry), then put back; a man with no gun shows none; a gunman of theirs shows his. ROUNDS_PLANT=1
     takes the drawing out */
  const RDREAD = () => page.evaluate(() => { const rd = document.querySelector('#bohphone .fh .fap .rd'), hd = document.querySelector('#bohphone .fh');
    if (!rd || getComputedStyle(rd).display === 'none') return { shown: false };
    const cs = [...rd.querySelectorAll('i')], r = rd.getBoundingClientRect(), hb = hd.getBoundingClientRect(), col = e => getComputedStyle(e).backgroundImage !== 'none' ? getComputedStyle(e).backgroundImage.slice(0, 40) : getComputedStyle(e).backgroundColor;
    const pp = hd.querySelector('.fap .pp'), pr = pp ? pp.getBoundingClientRect() : null, pips = pp ? [...pp.querySelectorAll('i')] : [], ln = rd.querySelector('u.cl');
    return { shown: true, cases: cs.length, lit: cs.filter(e => e.classList.contains('on')).length, last: cs.filter(e => e.classList.contains('last')).length, dry: rd.classList.contains('dry'), reload: rd.classList.contains('reload'), says: rd.getAttribute('aria-label'), n: rd.dataset.n, c: rd.dataset.c || '',
      line: ln ? Math.round(1000 * parseFloat(getComputedStyle(ln).width) / Math.max(1, rd.clientWidth - 2)) / 10 : null,
      apClipped: pr ? pips.filter(i => i.getBoundingClientRect().right > pr.right + 0.3).length : null, apPips: pips.length,
      box: [Math.round(r.left * 10) / 10, Math.round(r.top * 10) / 10, Math.round(r.width * 10) / 10, Math.round(r.height * 10) / 10], inCard: r.left >= hb.left - 0.6 && r.right <= hb.right + 0.6 && r.top >= hb.top - 0.6 && r.bottom <= hb.bottom + 0.6,
      colours: [...new Set(cs.map(col))] }; });
  const gun = await f.evaluate(() => { const g = FIGHT.S.units.filter(v => v.side === 'you' && FIGHT.onField(v) && FIGHT.rounds(v) && FIGHT.rounds(v).of > 0)[0];
    if (!g) return null; UI.pend = { target: g }; hud(); const r = FIGHT.rounds(g), c = FIGHT.carried ? FIGHT.carried(g) : null; return { id: g.id, name: g.name, weapon: g.weapon && g.weapon.name, mag: !!g.weapon.mag, ammo: g.ammo, loaded: g.loaded, rounds: g.rounds, left: r.left, of: r.of, carry: c }; });
  if (gun) {
    T.rounds = { gun: gun };
    await until(async () => { const c = await RDREAD(); return c.shown && c.n === gun.left + '/' + gun.of; }, 4000, 80);
    T.rounds.full = await RDREAD(); await shot('7_phone_rounds');
    /* one round spent */
    const one = await f.evaluate((g) => { const u = FIGHT.byId(g.id); if (u.weapon.mag || (u.weapon.ammo && u.ammo !== null)) u.ammo = Math.max(1, u.ammo - 1); if (u.rounds != null) u.rounds = Math.max(1, u.rounds - 1); hud(); const r = FIGHT.rounds(u), c = FIGHT.carried ? FIGHT.carried(u) : null; return { left: r.left, of: r.of, carry: c }; }, gun);
    await until(async () => { const c = await RDREAD(); return c.shown && c.n === one.left + '/' + one.of; }, 3000, 80);
    T.rounds.spent = await RDREAD(); T.rounds.spentWant = one;
    /* the magazine at none, rounds still carried: a RELOAD, not out (11/26, after COMBAT FOUR's rule 478 build) */
    await f.evaluate((g) => { const u = FIGHT.byId(g.id); if (u.weapon.mag || (u.weapon.ammo && u.ammo !== null)) u.ammo = 0; else u.loaded = false; if (u.rounds != null) u.rounds = Math.max(2, u.rounds); hud(); }, gun);
    await until(async () => { const c = await RDREAD(); return c.shown && c.reload; }, 3000, 80);
    await wait(260); T.rounds.reload = await RDREAD(); await shot('7a_phone_rounds_reload');
    /* none left anywhere: OUT, the gun slung and his fists up, as COMBAT FOUR's toFists leaves him */
    await f.evaluate((g) => { const u = FIGHT.byId(g.id); u.__gun = { w: u.weapon, ammo: u.ammo, ammoMax: u.ammoMax, loaded: u.loaded, rounds: u.rounds, roundsMax: u.roundsMax, slung: u.slung, slungState: u.slungState };
      u.slung = u.weapon; u.slungState = { ammo: 0, ammoMax: u.ammoMax, loaded: false, rounds: 0, roundsMax: u.roundsMax }; const G = R('ours.gun_rounds'), fr = G && DB.beastAttacks && (DB.beastAttacks.rows || []).filter(r => r.id === G.fists)[0]; u.weapon = Object.assign({}, fr || {}, { id: 'fists', name: 'Fists', fists: true, value: 0 });   /* the fight's own fists row (fistsRow) */ u.ammo = null; u.ammoMax = null; u.rounds = null; u.roundsMax = null; hud(); }, gun);
    await until(async () => { const c = await RDREAD(); return c.shown && c.dry; }, 3000, 80);
    await wait(260); T.rounds.dry = await RDREAD(); await shot('7b_phone_rounds_dry');
    /* the beat: the dry cases pulse (read twice across a beat) */
    T.rounds.dryBeat = []; for (let k = 0; k < 8; k++) { T.rounds.dryBeat.push(await page.evaluate(() => { const i = document.querySelector('#bohphone .fh .fap .rd.dry i'); return i ? getComputedStyle(i).backgroundColor : null; })); await wait(70); }
    await f.evaluate((g) => { const u = FIGHT.byId(g.id), k = u.__gun; if (k) { u.weapon = k.w; u.ammoMax = k.ammoMax; u.roundsMax = k.roundsMax; u.slung = k.slung; u.slungState = k.slungState; delete u.__gun; } u.ammo = g.ammo; u.loaded = g.loaded; u.rounds = g.rounds; hud(); }, gun);
  } else T.rounds = { gun: null };
  /* a man with no gun in his hands: no cartridges */
  T.rounds.noGun = await f.evaluate(() => { const m = FIGHT.S.units.filter(v => FIGHT.onField(v) && !FIGHT.rounds(v))[0]; if (!m) return null; UI.pend = { target: m }; hud(); return { name: m.name, weapon: m.weapon && m.weapon.name }; });
  if (T.rounds.noGun) { await wait(400); T.rounds.noGun.card = await RDREAD(); }
  /* a gunman of theirs: his rounds after his plate */
  T.rounds.theirs = await f.evaluate(() => { const m = FIGHT.S.units.filter(v => v.side === 'them' && FIGHT.onField(v) && FIGHT.rounds(v) && FIGHT.rounds(v).of > 0)[0]; if (!m) return null; UI.pend = { target: m }; hud(); const r = FIGHT.rounds(m); return { name: m.name, left: r.left, of: r.of }; });
  if (T.rounds.theirs) { await until(async () => { const c = await RDREAD(); return c.shown && c.n === T.rounds.theirs.left + '/' + T.rounds.theirs.of; }, 3000, 80); T.rounds.theirs.card = await RDREAD(); await shot('7c_phone_rounds_theirs'); }
  await f.evaluate(() => { UI.pend = null; hud(); }).catch(() => null);
  log('ROUNDS', JSON.stringify(T.rounds));
  /* __NEVER_CHOPPY__ (FIGHT SCREEN THREE 11/26, rule 480(c)): no work done twice. His man on the card; the card's pieces marked; then a bar moves
     (only the bar is painted again: the face is not drawn again, the AP pips, the plate and the rounds are the same nodes); then his AP moves (the
     pips again, the face not); then the man changes (all of it again). In the fight's page: the card refreshed twice with nothing changed lays
     its AP pips once and moves no style. NOCHOP_PLANT=1 paints everything on every change (the old way): the legs see it */
  const PH = () => page.evaluate(() => { const hd = document.querySelector('#bohphone .fh'); if (!hd) return null; const cv = hd.querySelector('canvas'), pp = [...hd.querySelectorAll('.fap .pp i')], rd = [...hd.querySelectorAll('.fap .rd i')];
    return { name: (hd.querySelector('b') || {}).textContent, draws: cv ? cv.__draws | 0 : -1, ppMarked: pp.length ? pp.every(i => i.__k === 1) : null, rdMarked: rd.length ? rd.every(i => i.__k === 1) : null, pips: pp.length,
      bar: (function () { const i = hd.querySelector('.fb.hp i'); return i ? i.style.width : ''; })() }; });
  const markPH = () => page.evaluate(() => { document.querySelectorAll('#bohphone .fh .fap .pp i, #bohphone .fh .fap .rd i').forEach(i => { i.__k = 1; }); });
  const nc = await f.evaluate(() => { const g = FIGHT.S.units.filter(v => v.side === 'you' && FIGHT.onField(v)).sort((a, b) => (FIGHT.rounds(b) ? 1 : 0) - (FIGHT.rounds(a) ? 1 : 0))[0], o = FIGHT.S.units.filter(v => v.side === 'you' && FIGHT.onField(v) && v !== g)[0];
    if (!g) return null; UI.pend = { target: g }; hud(); return { id: g.id, other: o ? o.id : null, hp: g.hp, ap: g.ap }; });
  if (nc) {
    T.noChop = { man: nc };
    await wait(700); await markPH(); const s0 = await PH(); T.noChop.start = s0;
    await f.evaluate((g) => { const u = FIGHT.byId(g.id); u.hp = Math.max(1, u.hp - 3); hud(); }, nc);
    await until(async () => { const c = await PH(); return c && c.bar !== s0.bar; }, 3000, 60); await wait(300); T.noChop.bar = await PH();
    await f.evaluate((g) => { const u = FIGHT.byId(g.id); u.ap = Math.max(0, u.ap - 1); hud(); }, nc);
    await until(async () => { const c = await PH(); return c && c.ppMarked === false; }, 3000, 60); await wait(300); T.noChop.ap = await PH();
    if (nc.other) { await f.evaluate((g) => { UI.pend = { target: FIGHT.byId(g.other) }; hud(); }, nc); await until(async () => { const c = await PH(); return c && c.draws > T.noChop.ap.draws; }, 3000, 60); await wait(300); T.noChop.man2 = await PH(); }
    /* in the fight's page: the card refreshed twice, nothing changed */
    T.noChop.fight = await f.evaluate((g) => { UI.pend = { target: FIGHT.byId(g.id) }; hud(); const ap = document.getElementById('ap'), say = document.getElementById('say'); [...ap.children].forEach(i => { i.__k = 1; });
      const st0 = say.getAttribute('style'); let writes = 0; const mo = new MutationObserver(ms => { writes += ms.length; }); mo.observe(document.getElementById('bot'), { attributes: true, childList: true, subtree: true }); mo.observe(say, { attributes: true });
      hud(); hud(); const rec = mo.takeRecords(); mo.disconnect(); writes += rec.length;
      return { kept: ap.children.length > 0 && [...ap.children].every(i => i.__k === 1), sayStyle: say.getAttribute('style') === st0, writes: writes, writesWhat: rec.slice(0, 20).map(r => r.type + ':' + (r.target.id || r.target.className || r.target.tagName) + (r.attributeName ? '.' + r.attributeName : '')) }; }, nc);
    await f.evaluate((g) => { const u = FIGHT.byId(g.id); u.hp = g.hp; u.ap = g.ap; UI.pend = null; hud(); }, nc);
    log('NO CHOP', JSON.stringify(T.noChop));
  }
  /* __THE_HIT_LANDS_ON_THE_CARD__ (FIGHT SCREEN THREE 11/27): his man on the card, five of his blood taken: the photo slips (the card's 'hit', the
     canvas's fhHit animation) once, then is still; his armour alone taken: no slip. HIT_PLANT=1 takes the slip out */
  { const hm = await f.evaluate(() => { const g = FIGHT.S.units.filter(v => v.side === 'you' && FIGHT.onField(v))[0]; if (!g) return null; UI.pend = { target: g }; hud(); return { id: g.id, hp: g.hp, armB: g.armB }; }).catch(() => null);
    if (hm) { await wait(600);
      const rd = () => page.evaluate(() => { const hd = document.querySelector('#bohphone .fh'), cv = hd && hd.querySelector('canvas'); return { n: window.__PHONE_CARD_HITS | 0, hit: !!hd && hd.classList.contains('hit'), anim: cv ? getComputedStyle(cv).animationName : '' }; });
      const n0 = (await rd()).n;
      await f.evaluate((g) => { const u = FIGHT.byId(g.id); u.hp = Math.max(1, u.hp - 5); hud(); }, hm);
      let on = null; for (let k = 0; k < 12 && !on; k++) { await wait(40); const r = await rd(); if (r.hit) on = r; }
      if (process.env.HIT_SHOTS) { const fhb = await page.evaluate(() => { const r = document.querySelector('#bohphone .fh').getBoundingClientRect(); return { x: r.x - 4, y: r.y - 4, width: r.width + 8, height: r.height + 8 }; });
        for (let k = 0; k < 4; k++) { await page.screenshot({ path: path.join(OUT, 'shots', 'hit_' + k + '.png'), clip: fhb }).catch(() => {}); } }
      let off = null; for (let k = 0; k < 30; k++) { await wait(50); off = await rd(); if (!off.hit) break; }   /* still again within 1.5 s */
      await f.evaluate((g) => { const u = FIGHT.byId(g.id); u.armB = Math.max(0, u.armB - 5); hud(); }, hm); await wait(500); const arm = await rd();
      await f.evaluate((g) => { const u = FIGHT.byId(g.id); u.hp = g.hp; u.armB = g.armB; UI.pend = null; hud(); }, hm);
      T.hit = { n0: n0, on: on, off: off, arm: arm }; log('HIT', JSON.stringify(T.hit)); } }
  /* __THE_DRONE_ON_THE_BIG_ROW__ (FIGHT SCREEN THREE 11/27): a drone of theirs in the air over his gunman (its operator one of theirs on the field),
     his turn by hand, read in one task (the phone's fightPaint hook): the big row's first square is the drone (DRONE, its chance), red-rimmed and
     marked 'cross' while its cross is on him; the drone gone, the square goes. DRONE_PLANT=1 keeps it among the small squares */
  for (let tries = 0; tries < 20 && !T.drone; tries++) {
    T.drone = await f.evaluate(() => { const S = FIGHT.S, TB = window.top.BohemiaPhone, D = window.top.document; if (S.over || !TB || !TB.fightPaint || !FIGHT.canShootDrone || UI.anim.length) return null;
      const g = S.units.filter(v => v.side === 'you' && FIGHT.onField(v) && FIGHT.rounds(v) && FIGHT.rounds(v).left > 0)[0], op = S.units.filter(v => v.side === 'them' && FIGHT.onField(v))[0]; if (!g || !op) return null;
      const cur = FIGHT.current, keep = S.drones, read = () => { const big = D.querySelector('#bohphone .fight .abig'), bs = big ? [...big.querySelectorAll('.bg')] : [], d = bs.find(b => b.classList.contains('drone'));
        return { first: bs[0] ? bs[0].getAttribute('aria-label') : null, drone: !!d, word: d ? (d.querySelector('b') || {}).textContent : null, chance: d ? (d.querySelector('i') || {}).textContent : null, cross: !!d && d.classList.contains('cross'),
          small: [...D.querySelectorAll('#bohphone .fight .ab .sk')].some(b => /drone/i.test(b.getAttribute('aria-label') || '') || /DRONE/.test(b.title || '')) }; };
      const k = S.order.indexOf(g.id), idx0 = S.idx; if (k < 0) return null;
      let out = null; S.idx = k;   /* one task: his gunman up (the engine's own turn), the drone in the air, the phone read, all put back; no frame runs between */
      try { S.drones = [{ id: 'droneT', by: op.id, side: 'them', x: g.x, y: g.y, to: g.id, round: S.round, from: { x: op.x, y: op.y } }];
        const can = FIGHT.canShootDrone(g, S.drones[0]); UI.pend = null; hud(); TB.fightPaint(true); out = { can: can, on: read(), man: g.name };
        S.drones = []; hud(); TB.fightPaint(true); out.gone = read(); }
      finally { S.drones = keep || []; S.idx = idx0; hud(); TB.fightPaint(true); }
      return out; }).catch(e => ({ err: String(e).slice(0, 120) }));
    if (!T.drone || T.drone.err) { T.drone = T.drone && T.drone.err ? T.drone : null; if (!T.drone) await wait(300); }
  }
  log('DRONE', JSON.stringify(T.drone));
  if (process.env.DRONE_SHOTS) {   /* the picture: the same state held on his turn (by hand: no AI moves), two stills across a beat, then put back */
    const hold = await f.evaluate(() => { const S = FIGHT.S, g = S.units.filter(v => v.side === 'you' && FIGHT.onField(v) && FIGHT.rounds(v) && FIGHT.rounds(v).left > 0)[0], op = S.units.filter(v => v.side === 'them' && FIGHT.onField(v))[0];
      if (!g || !op) return null; const r = { idx: S.idx }; S.idx = S.order.indexOf(g.id); S.drones = [{ id: 'droneT', by: op.id, side: 'them', x: g.x, y: g.y, to: g.id, round: S.round, from: { x: op.x, y: op.y } }]; UI.pend = null; hud(); return r; }).catch(() => null);
    if (hold) { await wait(500); const pb = await page.evaluate(() => { const r = document.getElementById('bohphone').getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; });
      for (let k = 0; k < 4; k++) { await page.screenshot({ path: path.join(OUT, 'shots', 'drone_' + k + '.png'), clip: pb }).catch(() => {}); await wait(130); }
      await page.screenshot({ path: path.join(OUT, 'shots', 'drone_board.png') }).catch(() => {});
      await f.evaluate((h) => { FIGHT.S.drones = []; FIGHT.S.idx = h.idx; hud(); }, hold).catch(() => null); } }
  /* __NOTHING_TO_PRESS_ON_THEIR_TURN__ and __HIS_TURN_IS_SPENT_ON_THE_CARD__ (FIGHT SCREEN THREE 11/26, rule 482): the fight plays on by itself; on a
     real turn of theirs the phone's wells are read (no big STRIKE, no 'No skills' note, every well empty); on his next turn his AP is
     spent to none the way a turn ends, and the card's AP row is read (spent, red on the beat), the fight's own badge hidden under the phone */
  const WELLS = () => page.evaluate(() => { const fi = document.querySelector('#bohphone .fight'); if (!fi) return null; const big = fi.querySelector('.abig');
    return { theirs: fi.classList.contains('theirs'), big: big ? [...big.querySelectorAll('.bg')].filter(b => b.getAttribute('aria-label') !== 'empty').length : -1, bigEmpty: big ? big.querySelectorAll('.bg[aria-label=empty]').length : 0,
      bigShown: !!big && !big.classList.contains('none') && getComputedStyle(big).display !== 'none',
      note: !!fi.querySelector('.ab .none'), live: [...fi.querySelectorAll('.ab .sk')].filter(b => b.getAttribute('aria-label') !== 'empty').length, wells: fi.querySelectorAll('.ab .sk').length, head: (document.querySelector('#bohphone .fh b') || {}).textContent }; });
  T.turns = { theirs: null, spent: null };
  /* first, while the fight surely runs (a walk can end before a turn of theirs comes): the turn is set to a man of theirs the
     way the order hands it (FIGHT.S.idx on his place in the order), the phone read, the turn put back */
  { const w = await f.evaluate(() => { const them = FIGHT.S.units.find(v => v.side === 'them' && FIGHT.onField(v)), TB = window.top.BohemiaPhone; if (!them || FIGHT.S.over || !TB || !TB.fightPaint) return null;
      const cur = FIGHT.current, D = window.top.document; let out = null;
      FIGHT.current = function () { return them; };   /* one task: the card refreshed for a turn of theirs, the phone painted, read, put back; no frame runs between */
      try { hud(); TB.fightPaint(true); const fi = D.querySelector('#bohphone .fight'), big = fi && fi.querySelector('.abig');
        out = fi ? { theirs: fi.classList.contains('theirs'), big: big ? [...big.querySelectorAll('.bg')].filter(b => b.getAttribute('aria-label') !== 'empty').length : -1, bigEmpty: big ? big.querySelectorAll('.bg[aria-label=empty]').length : 0,
          bigShown: !!big && !big.classList.contains('none') && getComputedStyle(big).display !== 'none', note: !!fi.querySelector('.ab .none'), live: [...fi.querySelectorAll('.ab .sk')].filter(b => b.getAttribute('aria-label') !== 'empty').length,
          wells: fi.querySelectorAll('.ab .sk').length, head: them.name, forced: true } : null; }
      finally { FIGHT.current = cur; hud(); TB.fightPaint(true); }
      return out; }).catch(() => null);
    if (w) T.turns.theirs = w; }
  for (let i = 0; i < 300 && (!T.turns.theirs || T.turns.theirs.forced || !T.turns.spent); i++) {
    const st = await f.evaluate(() => { const u = FIGHT.current(); return { over: !!FIGHT.S.over, dep: !!FIGHT.S.deploy, side: u ? u.side : null, mine: u ? crewControlled(u) && !UI.anim.length : false, id: u ? u.id : null }; }).catch(() => ({ over: true }));
    if (st.over) break;
    if ((!T.turns.theirs || T.turns.theirs.forced) && st.side === 'them' && !st.dep) { await wait(400); const w = await WELLS(); const still = await f.evaluate(() => { const u = FIGHT.current(); return !!u && u.side === 'them'; }).catch(() => false); if (still && w) { T.turns.theirs = w; await shot('8_phone_their_turn'); } }
    if (!T.turns.spent && st.mine) {
      await f.evaluate(() => { const u = FIGHT.current(); u.ap = 0; hud(); });
      let got = null; for (let k = 0; k < 20 && !got; k++) { await wait(100); got = await page.evaluate(() => { const fa = document.querySelector('#bohphone .fh .fap'); return fa && fa.classList.contains('spent') ? { spent: true, pips: fa.querySelectorAll('.pp i').length } : null; }); }
      if (got) { const reds = []; for (let k = 0; k < 8; k++) { reds.push(await page.evaluate(() => { const i = document.querySelector('#bohphone .fh .fap.spent .pp i:not(.on)'); return i ? getComputedStyle(i).backgroundColor : null; })); await wait(70); }
        got.beat = [...new Set(reds)]; got.badge = await f.evaluate(() => { const o = document.getElementById('outap'); return o ? getComputedStyle(o).display : 'none'; }); await shot('9_phone_his_turn_spent'); }
      T.turns.spent = got || { spent: false };
    }
    await wait(200);
  }
  log('TURNS', JSON.stringify(T.turns));
  T.errs = errs; fs.writeFileSync(path.join(OUT, 'phone_card.json'), JSON.stringify(T, null, 1));
  log('DONE', WHICH, WAY, BEFORE ? 'BEFORE' : '', 'page errors', errs.length, errs.slice(0, 2).join(' | '));
  await page.close(); await ctx.close(); await browser.close(); process.exit(0);
})().catch(e => { console.log('FATAL', String(e && e.stack || e).slice(0, 600)); process.exit(1); });
