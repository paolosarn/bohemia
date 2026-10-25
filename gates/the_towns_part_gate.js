/* THE TOWN'S PART GATE (RUN TWO [the PC playtest: the town's part], VAMILY rule 164 items 15 and 18, 10/25/26).
   PAOLO 10/24, playing on his PC: 'every time selling shit was so painful, one of the things I hated most about Battle
   Brothers'; 'you can't switch weapon... Battle Brothers has two slots to bring shit into combat'.
   WHY THIS WALKS THE DEMO: the shop's one-piece sale worked and every gate on it was green while selling a bag of junk took
   two taps a piece. Rule 150(d): on the surface he plays.
     J1 a town through the map's own door, a bag of what the dead left (looted) and one piece he bought, and one looted
        piece he marked KEEP; the smith's sheet says SELL THE JUNK with how many pieces and what they bring, before he taps
     J2 *** ONE TAP SELLS THE JUNK *** a real finger on it: every looted piece not kept is gone, the purse rose by exactly
        what the button said, which is what selling them one by one pays; the bought piece and the KEEP piece are still there
     J3 the kept pieces wear KEEP on their tiles, and with no junk left the button says so and cannot be pressed
     J4 KEEP is his to change: tap a kept piece, LET IT GO, and the button counts it again
     B1 *** TWO BAG SLOTS A MAN *** the crew screen (the town's CREW, a real tap) shows his two bag slots under his hands
     B2 a real tap on a bag slot opens the bag cut to weapons and shields (no armour), a tap puts the second weapon there
     B3 the game's own door hands the next fight that man with it in his bag (gear.bag), for COMBAT's switch
     EYES' ROWS ON RUN TWO'S BOARD (rule 150, records/BOHEMIA_EYES_THE_PLAYTEST_10_24_26.md items 7, 12, 13, 15, 16, 17):
     E7  [the BB names] a card at the smith never names the wiki's item ('(was ...)'), and no man's trade on the crew screen
         or the hall is the wiki's background word where ours exists
     E13 [lines under x] the keeper's first line clears the sheet's close on the 390 px phone
     E16 [two cards disagree] a gun's reach on the smith's card is the crew screen's own line; a man's night is the hall's
     E17 [you the companion] YOU read THE LEADER with no wage and no '(2HAND)', and no two men share a line
     E15 [one company number] the crew screen, the bar and the door say the same room for the company, the fight's named
     E12 [the job's real pay] the board's pay is what the contract pays (the start's bonus in it), and dealt across the
         valley's places one contract stands in one place (a repeat only where the shelf ran dry); the phone shows a job once
     EYES' ROUND 2 (10/25): E30 [the town will not slide] a finger's swipe across the town moves it with the finger;
     E36 [the sheet opens halfway] a sheet opens at its top after another was read down; E33 [three pistols] every tile
     on a shelf says its card's name; E37 [the phone line] the board says a held job is on the map, never the phone;
     E38 [the last town's line] a town opens with no line carried from the last
     E8  [crowd taps] every person on the town's glass answers a fair finger: the nearest body wins (was whoever stood in
         front, three of Church's crowd answered on about 14 x 14 px), no one under a 44-point square on the first tap (the crowd a little looser on a phone, a finger just over a head or at the feet in the open is him), and a
         finger on a man behind another opens a sheet with him under ALSO HERE, one tap on his face (real taps)
     B4 nothing threw
   node gates/the_towns_part_gate.js */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
let pass = 0, fail = 0;
const ok = (n, c, x) => { c ? pass++ : fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (x !== undefined ? '  [' + x + ']' : '')); };
const done = () => { console.log('=== THE TOWN\'S PART GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };

(async () => {
  let d;
  try { d = await drive.open({ keepCards: true, beforeTap: async (p) => { await throughTheTitle(p); } }); }
  catch (e) { ok('the demo boots [' + String(e.message).slice(0, 160) + ']', false); return done(); }
  const p = d.page, fr = d.fr, errs = [];
  p.on('pageerror', e => errs.push(e.message));
  const town = async () => {
    const n = await fr.evaluate(() => { const bs = ctBases(), n = Object.keys(bs).find(k => /church/i.test(k)) || Object.keys(bs)[0], t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); return n; });
    for (let k = 0; k < 60; k++) { await p.waitForTimeout(400);
      for (const x of p.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url()))) {
        const r = await x.evaluate(() => { try { return BohemiaSettlement.ready() && !!BohemiaSettlement.state.place; } catch (e) { return false; } }).catch(() => false);
        if (r) return { sf: x, name: n }; } }
    return { sf: null, name: n };
  };
  const tapIn = async (sf, sel) => { const box = await (await sf.frameElement()).boundingBox(); const h = await sf.$(sel); if (!h) return false;
    await h.scrollIntoViewIfNeeded(); await p.waitForTimeout(120); const r = await h.boundingBox(); if (!r) return false;
    await p.touchscreen.tap(r.x + r.width / 2, r.y + r.height / 2); return true; };
  try {
    await p.waitForTimeout(2500);
    /* the bag he comes in with: four pieces off the dead, one he bought, one off the dead he marked KEEP */
    await p.evaluate(() => {
      const R = window.BohemiaRoster;
      const fallback = (id, kind, name, price) => ({ id, kind, name, price, base: price, nums: '' });
      const mk = (kind, id, name, price, extra) => Object.assign((R && R.itemOf && R.itemOf(kind, id)) || fallback(id, kind, name, price), extra || {});
      localStorage.setItem('bohemia.bag.v1', JSON.stringify([
        mk('weapon', 'wooden_stick', 'a pipe', 6, { looted: true, cond: 20, condMax: 32 }), mk('shield', 'buckler', 'a buckler', 20, { looted: true, cond: 12, condMax: 16 }),
        mk('weapon', 'pickaxe', 'a pickaxe', 20, { looted: true }), mk('body', 'leather_tunic', 'a tunic', 20, { looted: true, cond: 10, condMax: 30 }),
        mk('weapon', 'hand_axe', 'a hand axe', 40), mk('weapon', 'reinforced_wooden_flail', 'a flail', 40, { looted: true, keep: true }) ]));
    });
    const t = await town();
    ok('J1 a town through the map\'s own door', !!t.sf, t.name);
    if (!t.sf) return done();
    const sf = t.sf, box = await (await sf.frameElement()).boundingBox();
    const smith = async () => {
      if (await sf.evaluate(() => { const o = BohemiaSettlement.state.open; return !!o && o !== 'smith'; })) { const c = await sf.$('#close'); if (c) { await c.tap(); await p.waitForTimeout(500); } }
      for (let i = 0; i < 6; i++) { if (await sf.evaluate(() => BohemiaSettlement.state.open === 'smith')) break;
      const w = await sf.evaluate(() => BohemiaSettlement.where('smith')); if (w) await p.mouse.click(box.x + w.x, box.y + w.y + 30); await p.waitForTimeout(500); } };
    /* ---- E8 fair taps on the crowd ---- */
    await sf.waitForFunction(() => !document.getElementById('arrive'), null, { timeout: 6000 }).catch(() => {});
    await p.waitForTimeout(400);
    const e8 = await sf.evaluate(() => { const W = innerWidth, H = innerHeight, F = BohemiaSettlement.folk(), v = BohemiaSettlement._view(), first = new Map(), two = new Map(), spot = new Map();
      for (let y = 0; y < H; y += 3) for (let x = 0; x < W; x += 3) { const L = BohemiaSettlement.peopleUnder(x, y); if (!L.length) continue;   /* who a finger there gets: over a door only a body under it */ first.set(L[0], (first.get(L[0]) || 0) + 1);
        L.slice(0, 2).forEach(q => two.set(q, (two.get(q) || 0) + 1)); if (L[1] && !spot.has(L[1]) && BohemiaSettlement.onBody(L[1], x, y)) spot.set(L[1], { x, y }); }
      const on = F.filter(q => { const sx = q.x * v.s + v.ox, sy = q.y * v.s + v.oy; return sx > 0 && sx < W && sy > 0 && sy < H; });
      const rows = on.map(q => ({ q, first: Math.sqrt((first.get(q) || 0) * 9), two: Math.sqrt((two.get(q) || 0) * 9) }));
      const worst = rows.slice().sort((a, b) => a.first - b.first)[0], at = worst && spot.get(worst.q);
      window.__E8 = worst && worst.q;
      return { n: on.length, min1: Math.round(Math.min.apply(null, rows.map(r => r.first))), min2: Math.round(Math.min.apply(null, rows.map(r => r.two))), at, worstSlot: worst && (worst.q.slot != null ? 'crowd ' + worst.q.slot : worst.q.k) }; });
    let e8b = null;
    const cvr = await sf.evaluate(() => { const r = document.getElementById('cv').getBoundingClientRect(); return { x: r.left, y: r.top }; });   /* the lookup is in the picture's own coordinates, under the town's bar */
    if (e8.at) { await p.touchscreen.tap(box.x + cvr.x + e8.at.x, box.y + cvr.y + e8.at.y); await p.waitForTimeout(500);
      /* the sheet now covers the street: the man behind stands in it under ALSO HERE, one tap */
      const wk = await sf.evaluate(() => { const w = window.__E8; return w ? (w.keeper ? w.k : 'crowd' + w.slot) : null; });
      if (process.env.BOHEMIA_SHOT_DIR) await p.screenshot({ path: path.join(process.env.BOHEMIA_SHOT_DIR, 'also_here.png') });
      const fb = await sf.$('#also .alsoface[data-who="' + wk + '"]'); if (fb) { await fb.tap(); await p.waitForTimeout(400); }
      e8b = await sf.evaluate(() => { const S = BohemiaSettlement.state, w = window.__E8; return { open: S.open, him: !!(S.person && w && S.person === w) || (w && w.keeper && S.open === w.k) }; });
      const c = await sf.$('#close'); if (c && await sf.evaluate(() => !!BohemiaSettlement.state.open)) { await c.tap(); await p.waitForTimeout(400); } }
    ok('E8 [crowd taps] every person on the glass answers a fair finger, 44 points at least: the smallest first-tap target ' + e8.min1 + ' px square (was 13), ' + e8.min2 + ' px counting his face under ALSO HERE; ' + e8.n + ' people',
      e8.n > 3 && e8.min1 >= 44 && e8.min2 >= 44, 'the hardest: ' + e8.worstSlot);
    ok('    a finger on a man standing behind another: the sheet that opens shows him under ALSO HERE, and a tap on his face opens him (or nobody stands behind anybody any more)', e8.min1 >= 44 || (!!e8.at && !!(e8b && e8b.him)), e8.min1 >= 44 ? 'every man is first under the finger on his own 44 points, so nobody needs ALSO HERE' + (e8.at ? ' (a finger where one stands behind another: ' + JSON.stringify(e8b) + ')' : '') : JSON.stringify(e8b));
    /* ---- E30 a swipe moves the town with the finger (a real touch, start, moves, end) ---- */
    await sf.waitForFunction(() => !document.getElementById('arrive'), null, { timeout: 6000 }).catch(() => {});
    { const cdp = await p.context().newCDPSession(p), cvb = await (await sf.$('#cv')).boundingBox(), y = box.y + Math.min(cvb.height * 0.4, 220), x0 = box.x + 320, x1 = box.x + 40;
      const ox0 = await sf.evaluate(() => BohemiaSettlement._view().ox);
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x0, y }] });
      for (let k = 1; k <= 14; k++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x0 + (x1 - x0) * k / 14, y }] }); await p.waitForTimeout(16); }
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await p.waitForTimeout(300);
      const ox1 = await sf.evaluate(() => BohemiaSettlement._view().ox);
      const room = await sf.evaluate(() => { const v = BohemiaSettlement._view(); return Math.max(0, v.pw * v.s - v.W); });
      ok('E30 [the town will not slide] a finger\'s swipe of ' + Math.round(x0 - x1) + ' px moves the town with it', Math.abs(ox1 - ox0) >= 0.9 * Math.min(Math.abs(x0 - x1), Math.max(0, ox0 + room)),   /* with the finger, up to the picture's own edge */
        'the picture moved ' + Math.round(ox1 - ox0) + ' px, ' + Math.round(Math.max(0, ox0 + room)) + ' of room that way (EYES measured 17)'); }
    /* ---- E12 the board's pay is the contract's, one contract in one place ---- */
    /* the board is a building, a finger on its own pixels once the town's arrival card has gone (the loop gate's way) */
    await sf.waitForFunction(() => !document.getElementById('arrive'), null, { timeout: 6000 }).catch(() => {});
    for (let i = 0; i < 6; i++) { if (await sf.evaluate(() => BohemiaSettlement.state.open === 'board')) break;
      const w = await sf.evaluate(() => BohemiaSettlement.where('board')); if (w) await p.touchscreen.tap(box.x + w.x, box.y + w.y + (i % 2 ? 30 : 0)); await p.waitForTimeout(600); }
    const e12 = await sf.evaluate(() => { const S = BohemiaSettlement.state, b = document.querySelector('#sbody .act.client'), id = b && b.dataset.id;
      const o = (window.BohemiaBoardShelf && BohemiaBoardShelf.pick(S.place, (typeof S.mapDay === 'number' ? S.mapDay : S.day | 0), { held: S.held, places: S.places }) || []).find(x => x.id === id);
      const em = b && b.querySelector('em'), n = em ? /(\d+)/.exec(em.textContent) : null;
      return { dbg: ((document.getElementById('sbody') || {}).textContent || '').slice(0, 160), open: S.open, rule: S.payRule, places: (S.places || []).length, base: o && o.pay, shown: n ? +n[1] : null, id: id, em: em && em.textContent }; });
    const want = await fr.evaluate((base) => loopJobPay(base), e12.base | 0);
    ok('E12 [the job\'s real pay] the board shows what the contract pays: the base, the start\'s bonus and its multiplier, the map\'s own loopJobPay',
      e12.places > 5 && e12.shown === want && e12.base > 0, 'open ' + e12.open + ', ' + (e12.dbg || '') + ' base ' + e12.base + ', board ' + e12.shown + ', the map pays ' + want + ' (' + JSON.stringify(e12.rule) + ', ' + e12.places + ' places)');
    const deal = await fr.evaluate(() => { const day = T.day | 0, P = BohemiaBoardShelf.mapPlaces(day), held = LOOP.held.map(c => c.id), where = {};
      let posts = 0, repeats = 0, empty = 0; P.forEach(pl => { const g = BohemiaBoardShelf.pick({ name: pl.name, tier: pl.tier }, day, { held, places: P }) || []; if (!g.length) empty++;
        g.forEach(o => { posts++; if (where[o.id]) repeats++; (where[o.id] = where[o.id] || []).push(pl.name); }); });
      const ph = (window.BohemiaPhoneBoard && BohemiaPhoneBoard.asks) ? BohemiaPhoneBoard.asks() : null;
      return { places: P.length, posts, distinct: Object.keys(where).length, repeats, empty, phone: ph ? ph.map(a => a.id) : null }; });
    ok('    dealt across the valley\'s places, one contract stands in one place (a repeat only where the shelf ran dry), no board is empty',
      deal.places > 5 && deal.empty === 0 && deal.repeats <= Math.max(0, deal.places - deal.distinct + 2) && deal.repeats * 5 <= deal.posts, deal.places + ' places, ' + deal.posts + ' posts, ' + deal.distinct + ' different, ' + deal.repeats + ' repeats');
    if (deal.phone) ok('    the phone shows a job once', new Set(deal.phone).size === deal.phone.length, deal.phone.join(', '));
    const e37 = await sf.evaluate(() => (document.querySelector('#sbody .slots') || {}).textContent || '');
    ok('E37 [the phone line] the board says a held job is on the map, never the phone', /on your map/i.test(e37) && !/phone/i.test(e37), e37);
    /* E36: read the board's sheet down, then open another building's: it opens at its top */
    await sf.evaluate(() => { document.getElementById('sheet').scrollTop = 400; });
    await smith();
    const e36 = await sf.evaluate(() => ({ top: document.getElementById('sheet').scrollTop, close: document.getElementById('close').getBoundingClientRect().top }));
    ok('E36 [the sheet opens halfway] the smith\'s sheet opens at its top after the board\'s was read 400 px down, its close on the glass', e36.top === 0 && e36.close >= 0, JSON.stringify(e36));
    const e33 = await sf.evaluate(() => [...document.querySelectorAll('#shelfgrid .slot.full')].map(t => ({ say: (t.querySelector('span') || {}).textContent || '', card: (t.getAttribute('aria-label') || '').replace(/^(a|an) /, '') })));
    ok('E33 [three pistols] every tile on the shelf says the name its card uses, so two different things never read the same', e33.length > 0 && e33.every(t => t.say === t.card) && new Set(e33.map(t => t.say)).size === new Set(e33.map(t => t.card)).size, e33.map(t => t.say).join(', '));
    /* ---- E7 E13 E16 the smith's card ---- */
    const gun = await sf.evaluate(() => { const S = BohemiaSettlement.state, sh = S.stock.smith || []; const it = sh.find(i => i.kind === 'weapon' && BohemiaRoster.armLine && BohemiaRoster.armLine(BohemiaRoster.itemOf('weapon', i.id), true) && /TO|,/.test(BohemiaRoster.armLine(BohemiaRoster.itemOf('weapon', i.id), true).reach)) || sh.find(i => i.kind === 'weapon'); return it ? { name: it.name, id: it.id, was: it.was } : null; });
    if (gun) { const g = await sf.$('#shelfgrid .slot.full[aria-label="' + gun.name + '"]'); if (g) { await g.tap(); await p.waitForTimeout(400); } }
    const e7 = gun ? await sf.evaluate((g) => { const t = (document.getElementById('sbody') || {}).textContent || '', c = document.getElementById('close').getBoundingClientRect(), sy = document.querySelector('#sbody .say');
      return { dbg: BohemiaSettlement.state.open + ': ' + t.slice(0, 140), names: g.was && t.indexOf(g.was) >= 0, was: /\(was /.test(t), slots: (document.querySelector('#sbody .slots') || {}).textContent || '', clear: sy ? sy.getBoundingClientRect().right <= c.left + 1 : false,
        line: BohemiaRoster.armLine ? BohemiaRoster.armLine(BohemiaRoster.itemOf('weapon', g.id), true) : null }; }, gun) : null;
    ok('E7 [the BB names] the smith\'s card never names the wiki\'s item', !!e7 && !e7.was && !e7.names, gun && (gun.name + ' (the data keeps ' + gun.was + ')'));
    ok('E13 [lines under x] the keeper\'s first line clears the sheet\'s close on the 390 px phone', !!e7 && e7.clear);
    ok('E16 [two cards disagree] the gun\'s reach on the smith\'s card is the crew screen\'s own line', !!e7 && !!e7.line && e7.slots.indexOf(e7.line.reach) >= 0 && !/reach \d/.test(e7.slots), e7 && (e7.slots + ' | ' + JSON.stringify(gun) + ' | ' + JSON.stringify(e7.line) + ' | ' + e7.dbg));
    { const back = await sf.$$('#sbody .act'); for (const a of back) { if (/Not this one/.test(await a.textContent())) { await a.tap(); await p.waitForTimeout(400); break; } } }   /* back to the shelf, his finger on Not this one */
    await smith();
    const j1 = await sf.evaluate(() => { const S = BohemiaSettlement.state, J = BohemiaSettlement.junk(), b = document.getElementById('selljunk');
      return { open: S.open, bag: S.stash.map(i => i.id), junk: J.items.map(i => i.id), got: J.got, btn: b ? b.textContent : null, off: b ? b.disabled : null,
        bats: BohemiaPurse.balance(S.purse, 'electricity'), one: J.items.map(i => { const m = /\+(\d+)/.exec((document.querySelector('#baggrid .slot.full[aria-label="' + i.name + '"] em') || {}).textContent || ''); return m ? +m[1] : null; }) }; });
    const sumOne = j1.one.reduce((a, b) => a + (b | 0), 0);
    ok('    the smith\'s sheet says SELL THE JUNK with its count and its price before he taps, the bought piece and the KEEP piece not in it',
      j1.open === 'smith' && j1.junk.length === 4 && j1.junk.indexOf('hand_axe') < 0 && j1.junk.indexOf('reinforced_wooden_flail') < 0 && /4 PIECES/.test(j1.btn || '') && new RegExp('\\+' + j1.got + ' batter').test(j1.btn || '') && !j1.off,
      (j1.btn || 'no button') + '; junk ' + j1.junk.join(', '));
    ok('    what the button says is what selling them one by one pays (the price on each tile, added up)', j1.got === sumOne && j1.one.every(x => x > 0), j1.one.join(' + ') + ' = ' + sumOne + ' vs ' + j1.got);
    /* J2 one real tap */
    await tapIn(sf, '#selljunk'); await p.waitForTimeout(500);
    const j2 = await sf.evaluate(() => { const S = BohemiaSettlement.state; return { bag: S.stash.map(i => i.id), bats: BohemiaPurse.balance(S.purse, 'electricity'),
      kept: JSON.parse(localStorage.getItem('bohemia.bag.v1') || '[]').map(i => i.id), note: (document.querySelector('#sbody .sold') || {}).textContent || '' }; });
    ok('J2 *** ONE TAP SELLS THE JUNK *** a real finger: the four pieces gone, the purse up by exactly what the button said, the bought and the KEEP piece still in the bag',
      j2.bag.length === 2 && j2.bag.indexOf('hand_axe') >= 0 && j2.bag.indexOf('reinforced_wooden_flail') >= 0 && j2.bats - j1.bats === j1.got && j2.kept.length === 2 && /Sold 4 pieces/.test(j2.note),
      'batteries ' + j1.bats + ' -> ' + j2.bats + '; ' + j2.note);
    /* J3 */
    const j3 = await sf.evaluate(() => { const b = document.getElementById('selljunk'); return { keep: document.querySelectorAll('#baggrid .slot.kept .kp').length, btn: b && b.textContent, off: b && b.disabled }; });
    ok('J3 the kept pieces wear KEEP, and with no junk left the button says so and cannot be pressed', j3.keep === 2 && j3.off === true && /NO JUNK/.test(j3.btn || ''), JSON.stringify(j3));
    /* J4 let one go */
    await tapIn(sf, '#baggrid .slot.full[aria-label="a hand axe"]'); await p.waitForTimeout(300);
    const let1 = await sf.evaluate(() => [...document.querySelectorAll('#sbody .act')].map(a => a.textContent));
    const li = let1.findIndex(x => /Let it go/.test(x));
    if (li >= 0) { await tapIn(sf, '#sbody .act:nth-of-type(' + (li + 1) + ')'); await p.waitForTimeout(300); }
    const j4 = await sf.evaluate(() => { BohemiaSettlement.open && 0; const J = BohemiaSettlement.junk(); return { junk: J.items.map(i => i.id) }; });
    ok('J4 KEEP is his to change: LET IT GO on the bought axe, and SELL THE JUNK counts it', li >= 0 && j4.junk.length === 1 && j4.junk[0] === 'hand_axe', (let1[li] || 'no let-go') + '; junk now ' + j4.junk.join(', '));
    /* B1 the crew screen from the town's CREW */
    await tapIn(sf, '#crew'); await p.waitForTimeout(800);
    let RF = null; for (let i = 0; i < 80 && !RF; i++) { RF = p.frames().find(x => /ROSTER_SCREEN/.test(x.url())); if (RF && !(await RF.evaluate(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready).catch(() => false))) RF = null; if (!RF) await p.waitForTimeout(250); }
    ok('B1 the crew screen through the town\'s CREW (a real tap)', !!RF);
    if (!RF) return done();
    await p.waitForTimeout(600);
    /* ---- E17 E7 E16 the men's cards; E15 one company number ---- */
    const men = await RF.evaluate(() => document.querySelectorAll('#lines .cell.full').length), cards = [];
    for (let i = 0; i < men; i++) { const cs = await RF.$$('#lines .cell.full'); await cs[i].tap(); await p.waitForTimeout(250);
      cards.push(await RF.evaluate(() => { const c = document.getElementById('card'), S = BohemiaRosterScreen.state, m = S.crew[S.sel]; return { name: m && m.name, main: !!(m && m.main), bg: m && m.bgId, sub: (c.querySelector('.sub') || {}).textContent || '', pain: (c.querySelector('.pain') || {}).textContent || '' }; })); }
    const you = cards.find(c => c.main), bill = await fr.evaluate(() => (window.__BILL && __BILL.perMan) || 2);
    ok('E17 [you the companion] YOU read THE LEADER with no wage and no raw hands word; no two men share a line', !!you && /^THE LEADER\s+LEVEL \d+$/.test(you.sub.trim()) && cards.every(c => !/\(\dHAND\)/i.test(c.sub)) && new Set(cards.map(c => c.pain)).size === cards.length,
      cards.length + ' men; YOU: ' + (you && you.sub.trim()) + '; ' + new Set(cards.map(c => c.pain)).size + ' lines');
    ok('E16 [two cards disagree] every other man costs what the hall and the map say, ' + bill + ' a night', cards.filter(c => !c.main).every(c => new RegExp(bill + ' BATTER(Y|IES) A NIGHT').test(c.sub)), cards.filter(c => !c.main).map(c => c.sub.replace(/\s+/g, ' ')).slice(0, 2).join(' | '));
    ok('E7 [the BB names] no man\'s trade is the wiki\'s background word where ours exists (DAYTALER, SELLSWORD, CARAVAN HAND...)', cards.every(c => !/DAYTALER|SELLSWORD|CARAVAN HAND|HEDGE KNIGHT|RETIRED SOLDIER|ADVENTUROUS NOBLE|COMPANION/.test(c.sub)), cards.map(c => c.sub.split(/\s{2,}/)[0]).join(', '));
    const e15 = await RF.evaluate(() => document.getElementById('title').textContent);
    const bar = await fr.evaluate(() => { try { const f = BohemiaMaterials.topBarFacts ? BohemiaMaterials.topBarFacts() : null; return f ? f.cap : null; } catch (e) { return null; } });
    const door = await p.evaluate(() => { try { const pk = BOH_START.picks(); return { roster: pk.roster, field: pk.cap }; } catch (e) { return null; } });
    const doorText = await p.evaluate(() => (document.getElementById('front') || document.body).innerHTML);
    ok('E15 [one company number] the crew screen says the company\'s room and names the fight\'s; the bar says the same room',
      !!door && new RegExp('/ ' + door.roster + '\\s+' + door.field + ' IN A FIGHT').test(e15) && (bar == null || bar === door.roster), e15 + ' | bar ' + bar + ' | the door\'s origin: ' + JSON.stringify(door));
    const b1 = await RF.evaluate(() => ({ slots: [...document.querySelectorAll('#bags .gslot')].map(g => g.dataset.slot), man: BohemiaRosterScreen.state.crew[BohemiaRosterScreen.state.sel].name }));
    ok('    *** TWO BAG SLOTS A MAN *** under his hands', b1.slots.join() === 'bag1,bag2', b1.man + ': ' + b1.slots.join(', '));
    const tapR = async (sel) => { const h = await RF.$(sel); if (!h) return false; await h.scrollIntoViewIfNeeded(); await p.waitForTimeout(120); const r = await h.boundingBox(); if (!r) return false; await p.touchscreen.tap(r.x + r.width / 2, r.y + r.height / 2); return true; };
    await tapR('#bags .gslot[data-slot="bag1"]'); await p.waitForTimeout(300);
    const pk = await RF.evaluate(() => [...document.querySelectorAll('#picker [data-pick]')].filter(x => x.dataset.pick !== 'off').map(x => { const it = BohemiaRosterScreen.state.bag[+x.dataset.pick]; return it && it.kind; }));
    ok('B2 a real tap on a bag slot opens the bag cut to weapons and shields', pk.length > 0 && pk.every(k => k === 'weapon' || k === 'shield'), pk.join(', '));
    const wi = await RF.evaluate(() => { const S = BohemiaRosterScreen.state; return S.bag.findIndex(i => i.kind === 'weapon'); });
    const wid = await RF.evaluate((i) => BohemiaRosterScreen.state.bag[i] && BohemiaRosterScreen.state.bag[i].id, wi);
    await tapR('#picker [data-pick="' + wi + '"]'); await p.waitForTimeout(400);
    const b2 = await RF.evaluate(() => { const S = BohemiaRosterScreen.state, m = S.crew[S.sel]; return { name: m.name, bag1: m.gear.bag1 && m.gear.bag1.id }; });
    ok('    a tap puts the second weapon in his first bag slot', b2.bag1 === wid, b2.name + ' carries ' + b2.bag1);
    await tapR('#done'); await p.waitForTimeout(500);
    /* ---- E38 the next town opens with nothing carried from this one ---- */
    { const before = await sf.evaluate(() => { const l = document.querySelector('#leave'); if (l) l.click(); return (document.getElementById('heard') || {}).textContent || ''; });
      await p.waitForTimeout(800);
      const other = await fr.evaluate(() => { const bs = ctBases(), ks = Object.keys(bs), n = ks[1] || ks[0], t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); return n; });
      let line = null; for (let k = 0; k < 30; k++) { await p.waitForTimeout(400); line = await sf.evaluate((n) => { try { return BohemiaSettlement.state.place && BohemiaSettlement.state.place.name === n ? (document.getElementById('heard') || {}).textContent || '' : null; } catch (e) { return null; } }, other).catch(() => null); if (line !== null) break; }
      ok('E38 [the last town\'s line] ' + other + ' opens with nothing carried from the last town', line !== null && line.indexOf('head back out') < 0, 'left with "' + before + '", ' + other + ' opens with "' + line + '"'); }
    /* B3 the next fight */
    const o = await p.evaluate(() => JSON.parse(JSON.stringify(nfOpts({ district: 'downtown', world: { night: false, day: 2 } }))));
    const row = (o.company || []).find(m => m.name === b2.name || (b2.name === 'YOU' && m.main)) || (o.company || [])[0];
    ok('B3 the game\'s own door hands the next fight that man with it in his bag, for COMBAT\'s switch', !!row && row.gear && Array.isArray(row.gear.bag) && row.gear.bag[0] === wid,
      row && (row.name + ' -> bag ' + JSON.stringify(row.gear && row.gear.bag)));
    ok('B4 nothing threw', errs.length === 0, errs.slice(0, 3).join(' | '));
  } catch (e) { ok('the walk ran to the end [' + String(e && e.message).slice(0, 200) + ']', false); }
  try { await d.close(); } catch (_e) {}
  done();
})();
