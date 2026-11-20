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
  await until(async () => { const c = await READ(); return c && !c.none && !c.them && c.pips > 0; }, 25000, 250); await wait(700);
  T.cards.his = await READ(); await shot('5_phone_his');
  log('HIS', JSON.stringify(T.cards.his));
  T.errs = errs; fs.writeFileSync(path.join(OUT, 'phone_card.json'), JSON.stringify(T, null, 1));
  log('DONE', WHICH, WAY, BEFORE ? 'BEFORE' : '', 'page errors', errs.length, errs.slice(0, 2).join(' | '));
  await page.close(); await ctx.close(); await browser.close(); process.exit(0);
})().catch(e => { console.log('FATAL', String(e && e.stack || e).slice(0, 600)); process.exit(1); });
