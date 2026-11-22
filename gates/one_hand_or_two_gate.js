/* ONE HAND OR TWO, AND THE CARD SAYS LESS  (UI FIVE, 11/22/26; VAMILY rule 477, rules 471(b), 441, 466(c))

   PAOLO 11/22: 'It's still not clear to me when I'm buying a weapon from the shop if it's two-handed or one-handed or not, I don't
   know why you made that so difficult bro... when I'm buying a weapon there is so much useless information, for real'.

   MEASURED BEFORE (the demo upright, Caravans' smith, a two-hander tapped): the weapon card's title was the weapon's family ('BLADE'),
   no word of its hands anywhere on it, about 70 words (bars for armour and through-armour, action pips, breath, weight, to-hit, the
   head, four moves with their lines); the strip under the shelf said TWO HANDS on a two-hander and nothing on a one-hander, with seven
   numbers; the crew screen said 'TWO HANDS' last, after every number; the loot said nothing.

   On the DEMO and the ALPHA, through the one driver, a phone upright (390 x 844) and on its side (844 x 390), the way he gets there
   (the map's own door into CARAVANS, its SMITH; the phone's CREW; a road fight won, the loot):
     H1 THE SHOP, EVERY WEAPON ON THE SHELF, one tap each: the card's FIRST line is ONE-HANDED or TWO-HANDED, the crew screen's own
        rule (the row's hands column; a bow, crossbow or firearm with none takes both); then its name and price, how hard it hits, how
        far it reaches, whether STAFF may carry it (two-handed: CANNOT, rule 471(b)); 24 words at most; the card whole on the glass
     H2 THE STRIP under the shelf: ONE-HANDED or TWO-HANDED before the name (left of it, or above it where the strip is narrow), the
        name whole in its box, and only two numbers, how hard it hits and how far it reaches; its two buttons' words and the line on
        what goes to the stash whole (on its side they read 'B | 113' and 'to the...' before 11/22zx)
     H3 EVERYTHING ELSE ONE TAP DEEPER: the card's MORE shows the long card (the hand still first, every blow); the piece is not
        bought (the purse, the bag and the shelf the same) and stays lit
     H4 THE CREW SCREEN (the phone's CREW, his main hand tapped): the line under him says his weapon's hands right after its name,
        the card the same short card, its MORE the long card, and he still holds it
     H5 THE LOOT (a road fight won): a weapon on the ground tapped says ONE-HANDED or TWO-HANDED before its name
     H6 nothing threw
   PLANTED (the demo upright, the service worker off so the route reaches the town's frame): the old card put back (the long card on
   the first tap, no hand band): H1 goes red, and it is the 'before' of the word count.
   node gates/one_hand_or_two_gate.js [demo|alpha] [phone_portrait|phone_landscape] [--no-plant] */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.dirname(__dirname);
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined && x !== '' ? '  [' + String(x).slice(0, 600) + ']' : '')); return g; };
const ARGS = process.argv.slice(2);
const PAGES = ['demo', 'alpha'].filter(p => !ARGS.some(a => a === 'demo' || a === 'alpha') || ARGS.includes(p));
const PROFS = ['phone_portrait', 'phone_landscape'].filter(p => !ARGS.some(a => /^phone_/.test(a)) || ARGS.includes(p));
const W = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/weapons.json'), 'utf8')).rows, BY = {}; W.forEach(r => { BY[r.id] = r; });
const handsOfRow = r => r.hands ? r.hands | 0 : (/^(bow|crossbow|firearm)$/.test(r['class']) ? 2 : 1);   /* engine/bohemia_roster.js handsOfRow */
const WORD = id => BY[id] ? (handsOfRow(BY[id]) === 2 ? 'TWO-HANDED' : 'ONE-HANDED') : null;
const MAXWORDS = 24;

/* in a frame: the weapon card as he sees it (the words he can read, the first line, its lines) */
const CARD = () => {
  const c = document.getElementById('bwcard'); if (!c || c.style.display === 'none') return null;
  const vis = e => { const r = e.getBoundingClientRect(); if (r.width <= 1 || r.height <= 1) return false; for (let x = e; x && x.nodeType === 1; x = x.parentElement) { const s = getComputedStyle(x); if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) return false; } return true; };
  const words = []; const tw = document.createTreeWalker(c, NodeFilter.SHOW_TEXT); let n; while ((n = tw.nextNode())) { const t = n.nodeValue.trim(); if (t && vis(n.parentElement)) words.push(t); }
  const r = c.getBoundingClientRect(), k = s => { const e = c.querySelector(s); return e ? e.textContent.trim() : null; };
  return { id: c.dataset.weapon, view: c.dataset.view, first: c.firstElementChild ? c.firstElementChild.textContent.trim() : '', firstCls: c.firstElementChild ? c.firstElementChild.className : '',
    title: k('.bwc-t'), staff: k('.bwc-staff span'), hits: (c.querySelector('.bwc-k b') || {}).textContent || null, more: !!c.querySelector('.bwc-more'), blows: c.querySelectorAll('.bwc-r').length,
    n: words.join(' ').split(/\s+/).filter(Boolean).length, text: words.join(' / '), whole: r.left >= -0.5 && r.top >= -0.5 && r.right <= innerWidth + 0.5 && r.bottom <= innerHeight + 0.5 };
};
/* the strip under the shelf */
const STRIP = () => {
  const st = document.getElementById('shopstrip'); if (!st) return null;
  const th = st.querySelector('.ss-title .twoh'), nm = st.querySelector('.ss-title > b'), fx = st.querySelector('.ss-facts');
  const R = e => { if (!e) return null; const r = e.getBoundingClientRect(); return { l: r.left, t: r.top, r: r.right, b: r.bottom, w: r.width, h: r.height }; };
  const a = R(th), b = R(nm), f = R(fx);
  return { hand: th ? th.textContent.trim() : null, name: nm ? nm.textContent.trim() : null, cells: [...st.querySelectorAll('.inums .bic, .inums .ch')].filter((e, i, L) => L.indexOf(e) === i).map(e => e.dataset.cell || e.dataset.stat || 'chip'),
    cut: (() => { const out = [];   /* the buttons' words and the both-hands line whole (UI FIVE 11/22: on its side they read 'B | 113', 'to the...') */
      if (st.getBoundingClientRect().width <= 300) st.querySelectorAll('.ss-acts > .act > span').forEach(e => {   /* the narrow strip (a phone on its side); upright 'Buy it and ...' is older and still open */ if (e.offsetWidth && (e.scrollWidth > e.clientWidth + 1 || e.scrollHeight > e.clientHeight + 1)) out.push('button "' + e.textContent + '"'); });
      const om = st.querySelector('.onman.ss-man'), sp = st.querySelector('.onman.ss-man .lns .stop');
      if (om && sp && sp.offsetHeight) { const o = om.getBoundingClientRect(), q = sp.getBoundingClientRect(), L = sp.parentElement.getBoundingClientRect(); if (q.bottom > Math.min(o.bottom, L.bottom) + 0.5) out.push('the line "' + sp.textContent.slice(0, 30) + '" cut'); }
      return out; })(),
    before: !!(a && b) && (a.r <= b.l + 0.5 || a.b <= b.t + 0.5), nameWhole: !!(b && f) && b.w > 8 && b.l >= f.l - 0.5 && b.r <= f.r + 0.5 && b.t >= f.t - 0.5 && b.b <= f.b + 0.5 && nm.scrollWidth <= nm.clientWidth + 1 };
};
const still = async (P, h) => { let q = await h.boundingBox(), same = 0; for (let i = 0; i < 40 && same < 5; i++) { await P.waitForTimeout(60); const r = await h.boundingBox(); same = r && q && Math.abs(r.x - q.x) < 0.5 && Math.abs(r.y - q.y) < 0.5 ? same + 1 : 0; q = r; } return q; };
const tapEl = async (P, h) => { if (!h) return false; const q = await still(P, h); if (!q) return false; await P.touchscreen.tap(q.x + q.width / 2, q.y + q.height / 2); return true; };

async function town(d, P) {
  await d.fr.evaluate(() => { const bs = ctBases(), n = Object.keys(bs).find(k => /caravan/i.test(k)), t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); });
  let sf = null; for (let k = 0; k < 60 && !sf; k++) { await P.waitForTimeout(400);
    for (const x of P.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url()))) if (await x.evaluate(() => { try { return BohemiaSettlement.ready() && !!BohemiaSettlement.state.place && /caravan/i.test(BohemiaSettlement.state.place.name) && !BohemiaSettlement.camp().camp; } catch (e) { return false; } }).catch(() => false)) sf = x; }
  if (sf) { await sf.waitForFunction(() => !document.getElementById('arrive'), null, { timeout: 8000 }).catch(() => {}); await P.waitForTimeout(1200); }
  return sf;
}
async function openShop(sf, P, k) {
  await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); }); await P.waitForTimeout(500);
  for (let t = 0; t < 3; t++) { const w = await sf.evaluate(k => BohemiaSettlement.where(k), k); if (!w) return null;
    const fb = await (await sf.frameElement()).boundingBox(); await P.touchscreen.tap(fb.x + w.x, fb.y + w.y); await P.waitForTimeout(1500);
    if (await sf.evaluate(k => BohemiaSettlement.state.open === k, k)) break; }
  await P.waitForTimeout(900);
  return sf.evaluate(() => BohemiaSettlement.state.open);
}

/* H1, H2, H3 at the smith; returns the word counts */
async function shop(tag, sf, P, plant) {
  const open = await openShop(sf, P, 'smith'); if (open !== 'smith') { ok(tag + ' the smith opens', false, open); return null; }
  await sf.waitForFunction(() => !!window.BohemiaWeaponCard && BohemiaWeaponCard.rows().length > 100, null, { timeout: 15000 }).catch(() => {});
  const list = await sf.evaluate(() => [...document.querySelectorAll('#shelfgrid > .slot')].map((b, i) => b.__it && b.__it.kind === 'weapon' ? { i, id: b.__it.id, name: b.__it.name, hands: b.__it.hands } : null).filter(Boolean));
  const seen = [], bad1 = [], bad2 = [];
  for (const w of list) {
    await sf.evaluate(() => { const c = document.getElementById('bwcard'); if (c) c.style.display = 'none'; });
    await tapEl(P, await sf.$('#shelfgrid > :nth-child(' + (w.i + 1) + ')')); await P.waitForTimeout(650);
    const c = await sf.evaluate(CARD), s = await sf.evaluate(STRIP), want = WORD(w.id);
    seen.push({ id: w.id, c, s, want });
    if (!c || c.id !== w.id) { bad1.push(w.id + ' no card'); continue; }
    if (c.first !== want) bad1.push(w.id + ' first line "' + c.first.slice(0, 40) + '" want ' + want);
    if (want && (w.hands === 2) !== (want === 'TWO-HANDED')) bad1.push(w.id + ' the shop holds ' + w.hands + ' hands, the crew screen ' + want);
    if (c.view !== 'short') bad1.push(w.id + ' the long card on the first tap');
    if (!c.title || c.title.toUpperCase().indexOf(w.name.replace(/^(a|an) /, '').toUpperCase()) !== 0) bad1.push(w.id + ' titled "' + c.title + '" not its name');
    if (!c.staff || (want === 'TWO-HANDED') !== /CANNOT/.test(c.staff)) bad1.push(w.id + ' staff says "' + c.staff + '"');
    if (!/HITS/.test(c.text) || !/REACHES/.test(c.text)) bad1.push(w.id + ' no hits or reach');
    if (c.n > MAXWORDS) bad1.push(w.id + ' ' + c.n + ' words');
    if (!c.whole) bad1.push(w.id + ' the card runs off the glass');
    if (!plant) {
      if (!s || s.hand !== want) bad2.push(w.id + ' strip says ' + (s && s.hand) + ' want ' + want);
      else if (!s.before) bad2.push(w.id + ' the hand word after the name');
      if (s && !s.nameWhole) bad2.push(w.id + ' the strip\'s name cut');
      if (s && s.cells.join(',') !== 'damage,reach') bad2.push(w.id + ' strip numbers ' + s.cells.join(','));
      if (s && s.cut.length) bad2.push(w.id + ' ' + s.cut.join(', '));
    }
  }
  const ns = seen.filter(x => x.c).map(x => x.c.n), two = seen.filter(x => x.want === 'TWO-HANDED').length;
  const say = list.length + ' weapons (' + two + ' two-handed), ' + (ns.length ? Math.min(...ns) + ' to ' + Math.max(...ns) + ' words' : 'no card') + ', e.g. "' + ((seen.find(x => x.c) || {}).c || {}).text + '"';
  if (plant) { ok(tag + ' PLANTED (the old card put back): H1 goes red (' + say + ')', bad1.length > 0, bad1.slice(0, 3).join('; ')); return { ns, plant: true }; }
  ok('H1 ' + tag + ' THE SHOP, every weapon on the smith\'s shelf, one tap: ONE-HANDED or TWO-HANDED first, then its name and price, hits, reach, staff, ' + MAXWORDS + ' words at most, whole on the glass (' + say + ')', list.length >= 3 && two >= 1 && two < list.length && !bad1.length, bad1.slice(0, 4).join('; '));
  ok('H2 ' + tag + ' THE STRIP: the hand word before the name, the name whole, two numbers (hits, reach), the buttons\' words and the both-hands line whole', list.length >= 3 && !bad2.length, bad2.slice(0, 4).join('; ') || (seen[0] && JSON.stringify(seen[0].s)));
  /* H3 the dearest weapon's MORE */
  const w0 = list[0];
  await sf.evaluate(() => { const c = document.getElementById('bwcard'); if (c) c.style.display = 'none'; });
  await tapEl(P, await sf.$('#shelfgrid > :nth-child(' + (w0.i + 1) + ')')); await P.waitForTimeout(700);
  const st0 = await sf.evaluate(() => { const S = BohemiaSettlement.state; return { purse: JSON.stringify(S.purse && S.purse.items || S.purse), bag: S.stash.length, shelf: (S.stock.smith || []).length, sel: document.querySelectorAll('#shelfgrid .slot.sel').length }; });
  const mo = await sf.$('#bwcard .bwc-more'), tapped = await tapEl(P, mo); await P.waitForTimeout(900);
  const full = await sf.evaluate(CARD), st1 = await sf.evaluate(() => { const S = BohemiaSettlement.state; return { purse: JSON.stringify(S.purse && S.purse.items || S.purse), bag: S.stash.length, shelf: (S.stock.smith || []).length, sel: document.querySelectorAll('#shelfgrid .slot.sel').length }; });
  ok('H3 ' + tag + ' ITS MORE (' + w0.id + '): the long card, the hand still first, every blow (' + (full && full.n) + ' words, ' + (full && full.blows) + ' blows); nothing bought, the piece still lit',
    tapped && !!full && full.id === w0.id && full.view === 'full' && full.first === WORD(w0.id) && full.blows >= 1 && full.n > MAXWORDS && st0.purse === st1.purse && st0.bag === st1.bag && st0.shelf === st1.shelf && st1.sel === 1,
    JSON.stringify({ before: st0, after: st1, first: full && full.first }));
  await sf.evaluate(() => { const c = document.getElementById('bwcard'); if (c) c.style.display = 'none'; const x = document.getElementById('close'); if (BohemiaSettlement.state.open && x) x.click(); });
  await P.waitForTimeout(700);
  return { ns, long: full && full.n };
}

/* H4 the crew screen through the phone's CREW */
async function crew(tag, d, P) {
  let door = 'the phone\'s CREW';
  let hit = false; for (const fx of P.frames()) { const h = await fx.evaluate(() => { const c = [...document.querySelectorAll('#bohphone .app[data-app=crew]')].find(e => e.getBoundingClientRect().width > 0); if (!c) return null; const r = c.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }).catch(() => null);
    if (h) { const fe = await fx.frameElement().catch(() => null); let ox = 0, oy = 0; if (fe) { const el = await fx.$('#bohphone .app[data-app=crew]'); const bb = el && await el.boundingBox(); if (bb) { await P.touchscreen.tap(bb.x + bb.width / 2, bb.y + bb.height / 2); hit = true; break; } } else { await P.touchscreen.tap(h[0] + ox, h[1] + oy); hit = true; break; } } }
  if (!hit) { door = 'the crew door called (no CREW on the phone found)'; for (const fx of P.frames()) if (await fx.evaluate(() => { if (window.BohemiaCrewDoor) { BohemiaCrewDoor.open(); return true; } return false; }).catch(() => false)) break; }
  let R = null; for (let i = 0; i < 80 && !R; i++) { R = P.frames().find(x => /ROSTER_SCREEN/.test(x.url())); if (R && !(await R.evaluate(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready && !!window.BohemiaWeaponCard && BohemiaWeaponCard.rows().length > 100).catch(() => false))) R = null; if (!R) await P.waitForTimeout(250); }
  if (!R) { ok('H4 ' + tag + ' the crew screen opens (' + door + ')', false); return; }
  await P.waitForTimeout(1500);
  const main = await R.evaluate(() => { const S = BohemiaRosterScreen.state, m = S.crew[S.sel || 0]; return m && m.gear && m.gear.main ? { man: m.name, id: m.gear.main.id, name: m.gear.main.name } : null; });
  await tapEl(P, await R.$('#card [data-slot="main"]')); await P.waitForTimeout(800);
  const c = await R.evaluate(CARD), said = await R.evaluate(() => { const s = document.getElementById('said'); return s ? s.textContent.replace(/\s+/g, ' ').trim() : ''; });
  const want = main && WORD(main.id), m = main && said.match(/^(.*?)\s+(ONE-HANDED|TWO-HANDED)\b/);
  await tapEl(P, await R.$('#bwcard .bwc-more')); await P.waitForTimeout(800);
  const full = await R.evaluate(CARD), still = await R.evaluate(() => { const S = BohemiaRosterScreen.state, m = S.crew[S.sel || 0]; return m && m.gear && m.gear.main ? m.gear.main.id : null; });
  ok('H4 ' + tag + ' THE CREW SCREEN (' + door + '), ' + (main && main.man) + '\'s main hand (' + (main && main.id) + '): the line says "' + said.slice(0, 70) + '", the card ' + (c && c.view) + ' "' + (c && c.first) + '" (' + (c && c.n) + ' words), its MORE ' + (full && full.view) + ' (' + (full && full.blows) + ' blows), he still holds ' + still,
    !!main && !!want && !!m && m[2] === want && m[1].length > 0 && m[1].length <= 40 && !!c && c.id === main.id && c.view === 'short' && c.first === want && c.n <= MAXWORDS && !!full && full.view === 'full' && full.first === want && still === main.id);
  await R.evaluate(() => { const c = document.getElementById('bwcard'); if (c) c.style.display = 'none'; const dn = document.getElementById('done'); if (dn) dn.click(); }).catch(() => {});
  await P.waitForTimeout(1200);
}

/* H5 the loot after a road fight won */
async function loot(tag, d, P) {
  const fr = d.fr;
  await fr.evaluate(() => { try { loopClose(); } catch (e) {} try { if (window.BohemiaCrewDoor && BohemiaCrewDoor.isOpen()) BohemiaCrewDoor.close(); } catch (e) {} }); await P.waitForTimeout(2500);
  const road = await fr.evaluate(() => { const clear = (x, y) => { try { return !townSafeAt(x, y) && !townGround(x, y); } catch (_e) { return true; } };
    if (!clear(city.x, city.y)) { outer: for (let r = 4; r < 80; r += 2) for (let a = 0; a < 8; a++) { const x = Math.round(city.x + r * Math.cos(a * Math.PI / 4)), y = Math.round(city.y + r * Math.sin(a * Math.PI / 4)); if (clear(x, y)) { city.x = x + 0.5; city.y = y + 0.5; break outer; } } }
    try { stepOnce(0); stepOnce(4); } catch (_e) {}
    return { went: roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: 51 }) }; }).catch(e => ({ err: String(e).slice(0, 120) }));
  let f = null;
  for (let i = 0; i < 200 && !f; i++) { const h = await P.$('#fightFrame'); if (h) { const c = await h.contentFrame(); if (c && await c.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board && FIGHT.S.units.length > 0).catch(() => false)) f = c; } if (!f) { const fx = P.frames().find(x => /BOHEMIA_FIGHT/.test(x.url())); if (fx && await fx.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board && FIGHT.S.units.length > 0).catch(() => false)) f = fx; } if (!f) await P.waitForTimeout(150); }
  if (!f) { ok('H5 ' + tag + ' a road fight through the map\'s door', false, JSON.stringify(road)); return; }
  await P.waitForTimeout(1200);
  await f.evaluate(() => { const S = FIGHT.S, now = performance.now(); S.units.filter(u => u.side === 'them').forEach(u => { u.dead = true; u._fallAt = now - 4000; }); S.over = true; S.result = 'won'; showOver('won'); });
  const SF = () => P.frames().find(x => /SPOILS_SCREEN/.test(x.url()));
  for (let i = 0; i < 100 && !(SF() && await SF().evaluate(() => window.BohemiaAftermath && BohemiaAftermath.state().on).catch(() => false)); i++) await P.waitForTimeout(200);
  await P.waitForTimeout(1500);
  const sp = SF(); if (!sp) { ok('H5 ' + tag + ' the loot screen came up', false); return; }
  const ws = await sp.evaluate(ids => [...document.querySelectorAll('#ground .slot.full, #stash .slot.full')].map((b, i) => ({ sel: '#' + b.parentElement.id + ' .slot[data-i="' + b.dataset.i + '"]', id: b.dataset.id })).filter(x => ids.indexOf(x.id) >= 0), Object.keys(BY));
  const got = [], bad = [];
  for (const w of ws.slice(0, 4)) {
    await sp.evaluate(s => { const e = document.querySelector(s); if (e) e.scrollIntoView({ block: 'center' }); }, w.sel); await P.waitForTimeout(200);
    await tapEl(P, await sp.$(w.sel)); await P.waitForTimeout(600);
    const r = await sp.evaluate(() => { const b = document.querySelector('#said .fx > b'), h = b && b.firstElementChild; if (!b) return null; const hr = h && h.getBoundingClientRect(), br = b.getBoundingClientRect();
      return { hand: h && h.classList.contains('hand') ? h.textContent.trim() : null, first: !!h && b.firstChild === h, seen: !!hr && hr.width > 8 && hr.right <= br.right + 0.5, text: b.textContent.trim() }; });
    got.push(w.id + ' "' + (r && r.text) + '"');
    if (!r || r.hand !== WORD(w.id) || !r.first || !r.seen) bad.push(w.id + ' ' + JSON.stringify(r) + ' want ' + WORD(w.id));
  }
  ok('H5 ' + tag + ' THE LOOT (a road fight won): every weapon tapped says ONE-HANDED or TWO-HANDED before its name (' + got.join(', ') + ')', ws.length >= 1 && !bad.length, bad.slice(0, 3).join('; ') || (ws.length ? '' : 'no weapon in the loot'));
}

async function walk(page, profile, plant) {
  const tag = page + ' ' + (profile === 'phone_portrait' ? 'upright' : 'on its side');
  console.log('\n' + tag + (plant ? ' PLANTED' : ''));
  let d; const errs = [];
  try {
    d = await drive.open({ profile, alpha: page === 'alpha', noWorker: !!plant, beforeGoto: plant ? async (cdp, pg) => {
      await pg.route(/bohemia_ui_weapon_card\.js/, async route => { const r = await route.fetch(); const b = (await r.text())
        .replace('c.innerHTML = full ? html(id, name) : shortHtml(id, name, price);', 'c.innerHTML = html(id, name); full = true;')
        .replace("var h = handBand(r) + '<div class=\"bwc-t\">'", "var h = '<div class=\"bwc-t\">'");
        await route.fulfill({ response: r, body: b }); }); } : undefined });
  } catch (e) { ok(tag + ': the page boots', false, String(e.message).slice(0, 160)); return null; }
  const P = d.page; P.on('pageerror', e => errs.push(String(e.message).slice(0, 160)));
  let res = null;
  try {
    await P.waitForTimeout(2000);
    const sf = await town(d, P); if (!sf) { ok(tag + ': Caravans through the map\'s door', false); return null; }
    await sf.evaluate(() => { const S = BohemiaSettlement.state; window.BohemiaPurse.credit(S.purse, 'electricity', 20000, 'gate:one-hand-or-two', S.place.name, S.day); });
    res = await shop(tag, sf, P, plant);
    if (!plant) { await crew(tag, d, P); await loot(tag, d, P); ok('H6 ' + tag + ' nothing threw', !errs.length, errs.slice(0, 2).join(' | ')); }
  } catch (e) { ok(tag + ' ran', false, String(e.stack).slice(0, 300)); }
  finally { await d.close().catch(() => {}); }
  return res;
}

(async () => {
  let now = null, before = null;
  for (const page of PAGES) for (const prof of PROFS) { const r = await walk(page, prof, false); if (!now && r) now = r; }
  if (!ARGS.includes('--no-plant')) before = await walk('demo', 'phone_portrait', true);
  if (now && before && now.ns.length && before.ns.length) {
    const avg = a => Math.round(a.reduce((x, y) => x + y, 0) / a.length);
    console.log('\n  THE WORDS ON A WEAPON CARD, the first tap at the smith: before ' + avg(before.ns) + ' on average (' + Math.min(...before.ns) + ' to ' + Math.max(...before.ns) + '), now ' + avg(now.ns) + ' (' + Math.min(...now.ns) + ' to ' + Math.max(...now.ns) + '); the long card one tap deeper ' + now.long);
  }
  console.log('\nONE HAND OR TWO: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
