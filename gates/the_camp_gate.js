/* THE CAMP GATE (RUN TWO [the camp and the retinue], VAMILY rule 151(d), 10/25/26).
   PAOLO 10/24: 'if you want time to speed along, there should be a camp button: wherever you're posted up you make a camp and
   upgrade your camp; depending on what tile you're on it shows up on that street tile, kind of like the settlement menu, with the
   cabin and all your members; and you can hire people to join you, Battle Brothers calls it a retinue'.
   WHY THIS WALKS THE DEMO: rule 150(d), on the surface he plays; every press below is a real finger.
     C1 the CAMP plate stands on the map beside the pad, a thumb wide, nothing over it
     C2 *** A TAP MAKES CAMP *** the screen opens with the clock on its bar and BREAK CAMP: every man of the company round the fire (the
        marker's own list), your lead at it, the tent, the retinue and the cart, and nothing of a town (no keeper, crowd, walker)
     C3 the clock runs an hour a beat while the camp stands, and the night is billed on it (the batteries go down by the bill)
     C4 THE RETINUE: with no clout nobody follows (no place open, every hire shut); with the clout of a first place, a real tap
        takes the scout on: his price is paid, and the map's road time is the scout's (15 percent less a block)
     C5 THE CART: a real tap buys the first step, the stash holds 48, the crew screen's bag says so
     C6 a hunting crew two blocks off breaks the camp and the map shows them
     C7 BREAK CAMP (a real tap) closes it and the clock stops; the plate is back
     C8 nothing threw
   node gates/the_camp_gate.js */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
let pass = 0, fail = 0;
const ok = (n, c, x) => { c ? pass++ : fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (x !== undefined ? '  [' + x + ']' : '')); };
const done = () => { console.log('=== THE CAMP GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };

(async () => {
  let d;
  try { d = await drive.open({ keepCards: true, beforeTap: async (p) => { await throughTheTitle(p); } }); }
  catch (e) { ok('the demo boots [' + String(e.message).slice(0, 160) + ']', false); return done(); }
  const p = d.page, fr = d.fr, errs = [];
  p.on('pageerror', e => errs.push(e.message));
  try {
    await p.waitForTimeout(3000);
    await fr.evaluate(() => { try { localStorage.removeItem('bohemia.renown.v1'); localStorage.removeItem('bohemia.camp.v1'); } catch (e) {} });
    const tapEl = async (frame, sel) => { const h = await frame.$(sel); if (!h) return false; await h.scrollIntoViewIfNeeded().catch(() => {}); await p.waitForTimeout(150);
      const r = await h.boundingBox(); if (!r) return false; await p.touchscreen.tap(r.x + r.width / 2, r.y + r.height / 2); return true; };
    /* ---- C1 ---- */
    await fr.waitForFunction(() => { const b = document.getElementById('campbtn'); return b && getComputedStyle(b).display !== 'none'; }, null, { timeout: 8000 }).catch(() => {});
    const c1 = await fr.evaluate(() => { const b = document.getElementById('campbtn'), pad = document.getElementById('speedpad'); if (!b) return null; const r = b.getBoundingClientRect(), q = pad && pad.getBoundingClientRect();
      const e = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return { shown: getComputedStyle(b).display !== 'none', w: Math.round(r.width), h: Math.round(r.height), word: b.textContent, besidePad: !!q && r.right <= q.left + 1 && Math.abs((r.top + r.bottom) / 2 - (q.top + q.bottom) / 2) < 8, top: e === b }; });
    ok('C1 the CAMP plate stands on the map beside the pad, a thumb wide, nothing over it', !!c1 && c1.shown && c1.w >= 44 && c1.h >= 44 && c1.besidePad && c1.top, JSON.stringify(c1));
    /* ---- C2 ---- */
    const before = await fr.evaluate(() => ({ min: T.day * 1440 + T.min, bats: loopBats(), men: mapCrewLooks().length }));
    await tapEl(fr, '#campbtn');
    let sf = null;
    for (let k = 0; k < 40 && !sf; k++) { await p.waitForTimeout(300);
      for (const x of p.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url()))) if (await x.evaluate(() => { try { return BohemiaSettlement.camp().camp && BohemiaSettlement.ready(); } catch (e) { return false; } }).catch(() => false)) { sf = x; break; } }
    if (!sf) { ok('C2 a tap makes camp', false, 'no camp screen'); return done(); }
    await sf.waitForFunction(() => { const l = BohemiaSettlement.lead(); return !!l.drawn; }, null, { timeout: 10000 }).catch(() => {});
    const c2 = await sf.evaluate(() => { const S = BohemiaSettlement, F = S.folk(), l = S.lead(), fire = { x: 945, y: 786 };
      return { name: document.getElementById('pname').textContent, leave: document.getElementById('leave').textContent, order: S.order(), men: F.length, all: F.every(p => p.campMan),
        round: F.every(p => Math.hypot((p.x - fire.x) / 2.1, p.y - fire.y) < 130), lead: l.look, leadAt: Math.round(Math.hypot((l.x - fire.x) / 2.1, l.y - fire.y)), busy: S.busy().length, drawn: l.drawn }; });
    ok('C2 a tap makes camp: the clock on the bar and BREAK CAMP, every man of the company round the fire, your lead at it, the tent, the retinue and the cart, nothing of a town',
      /^DAY \d+  \d\d:\d\d$/.test(c2.name) && c2.leave === 'BREAK CAMP' && c2.order.join() === 'tent,retinue,cart' && c2.men === before.men && c2.all && c2.round && c2.lead === 'you' && c2.leadAt < 130 && c2.busy === 0 && !!c2.drawn,
      JSON.stringify(c2) + ' (the marker holds ' + before.men + ')');
    if (process.env.BOHEMIA_SHOT_DIR) await p.screenshot({ path: path.join(process.env.BOHEMIA_SHOT_DIR, 'camp.png') });
    /* ---- C3 ---- */
    const n0 = await fr.evaluate(() => (window.__BILL_NIGHTS | 0));
    await p.waitForTimeout(6000);
    const c3 = await fr.evaluate((b) => ({ hours: Math.round((T.day * 1440 + T.min - b.min) / 60), nights: (window.__BILL_NIGHTS | 0), bats: loopBats(), last: window.__BILL && window.__BILL.last }), before);
    let c3b = c3; for (let k = 0; k < 30 && c3b.nights === n0; k++) { await p.waitForTimeout(500); c3b = await fr.evaluate((b) => ({ hours: Math.round((T.day * 1440 + T.min - b.min) / 60), nights: (window.__BILL_NIGHTS | 0), bats: loopBats(), last: window.__BILL && window.__BILL.last }), before); }
    ok('C3 the clock runs an hour a beat while the camp stands, and the night is billed on it',
      c3.hours >= 10 && c3b.nights > n0 && !!c3b.last && c3b.bats <= before.bats - (c3b.last.paid | 0) + 1,
      c3.hours + ' hours in 6 s; ' + (c3b.nights - n0) + ' night billed, ' + (c3b.last && c3b.last.paid) + ' paid, ' + before.bats + ' -> ' + c3b.bats + ' batteries');
    /* ---- C4 the retinue ---- */
    const openIn = async (k) => { await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); }); await p.waitForTimeout(300);
      const box = await (await sf.frameElement()).boundingBox(), w = await sf.evaluate((k) => BohemiaSettlement.where(k), k); if (w) await p.touchscreen.tap(box.x + w.x, box.y + w.y); await p.waitForTimeout(600); };
    await openIn('retinue');
    const c4a = await sf.evaluate(() => ({ open: BohemiaSettlement.state.open, line: (document.querySelector('#sbody .gridh') || {}).textContent, hires: [].map.call(document.querySelectorAll('#sbody .campf'), r => ({ id: r.dataset.id, shut: !!(r.querySelector('button.act') || {}).disabled })) }));
    await fr.evaluate(() => { BohemiaRenown.add(300, 'the gate: the clout of a first place', 'gate:camp'); loopSettleBats(loopBats() + 400, 'the gate'); });
    await sf.evaluate(() => { const c = document.getElementById('close'); if (c) c.click(); }); await p.waitForTimeout(700);   /* the next beat syncs the purse */
    await openIn('retinue');
    const batsBefore = await fr.evaluate(() => loopBats());
    const tapped = await tapEl(sf, '#sbody .campf[data-id="scout"] button.act');
    await p.waitForTimeout(800);
    const c4 = await fr.evaluate((b0) => ({ followers: Object.keys(CT_FOLLOWERS), mult: BohemiaFollowers.travelMultiplier(CT_FOLLOWERS), paid: b0 - loopBats(), state: BohemiaMapCamp.state() }), batsBefore);
    ok('C4 THE RETINUE: no clout, no place and every hire shut; with a first place a real tap takes the scout on, his price paid, the map\'s road time is his',
      c4a.open === 'retinue' && /0 OF 0/.test(c4a.line || '') && c4a.hires.length >= 3 && c4a.hires.every(h => h.shut) && tapped && c4.followers.indexOf('scout') >= 0 && c4.mult === 0.85 && c4.paid >= 240 && c4.paid <= 260 + 12,
      'first: ' + c4a.line + ' / ' + c4a.hires.map(h => h.id + (h.shut ? ' shut' : ' open')).join(', ') + '; then: ' + c4.followers.join(',') + ' x' + c4.mult + ', paid ' + c4.paid);
    /* ---- C5 the cart ---- */
    await openIn('cart');
    const t5 = await tapEl(sf, '#sbody .acts button.act');
    await p.waitForTimeout(600);
    const c5 = await sf.evaluate(() => ({ slots: BohemiaSettlement.camp().bagSlots, store: BohemiaCamp.stashSlots(), line: (document.querySelector('#sbody .gridh') || {}).textContent }));
    let rosterBag = null;   /* CAMP 10/26 (the camp moved under CAMP, rule 226): the crew screen's bag reads 'STASH n/48' now (it read 'YOUR BAG'), both are read */
    /* the bar's CREW is folded away on this screen now (0 x 0; the phone carries CREW, rule 212): the camp's own way in is THE TENT's
       'Your company' (CAMP 10/26) */
    const crewShown = await sf.evaluate(() => { const b = document.getElementById('crew'), r = b && b.getBoundingClientRect(); return !!r && r.width > 4 && r.height > 4; });
    const toCrew = crewShown ? await tapEl(sf, '#crew') : (await openIn('tent'), await tapEl(sf, '#sbody .acts button.act'));
    if (toCrew) { await p.waitForTimeout(1500);
      const rf = p.frames().find(x => /ROSTER_SCREEN/.test(x.url()));
      if (rf) { rosterBag = await rf.evaluate(() => (document.body.innerText.match(/(?:YOUR BAG|STASH)\s+\d+\s*\/\s*(\d+)/) || [])[1] || null).catch(() => null);
        const dn = await rf.$('#done') || await rf.$('button'); if (dn) await rf.evaluate(() => { const b = document.getElementById('done'); if (b) b.click(); }); await p.waitForTimeout(500); } }
    ok('C5 THE CART: a real tap buys the first step, the stash holds 48, and the crew screen\'s bag says so', t5 && c5.slots === 48 && c5.store === 48 && rosterBag === '48', JSON.stringify(c5) + ' crew screen bag of ' + rosterBag);
    /* ---- C6 a hunting crew breaks camp ---- */
    await fr.evaluate(() => { HUNT = { id: 'hunt:gate', ev: { id: 'gate' }, name: 'THE GATE\'S CREW', arch: 'human', count: 3, at: [city.x + 2, city.y], steps: 0, made: performance.now() }; });
    await p.waitForTimeout(1500);
    const c6 = await fr.evaluate(() => ({ camp: BohemiaMapCamp.state(), shown: !!(LOOP.frame && LOOP.frame.style.display === 'block'), hunt: !!HUNT, seen: HUNT ? mapSees(HUNT.at[0], HUNT.at[1]) : null }));
    ok('C6 a hunting crew two blocks off breaks the camp, and the map shows them', !c6.camp.on && c6.camp.why === 'warned' && !c6.shown && c6.hunt, JSON.stringify(c6));
    await fr.evaluate(() => { HUNT = null; });
    /* ---- C7 BREAK CAMP ---- */
    await p.waitForTimeout(800);
    const c7top = await fr.evaluate(() => { const b = document.getElementById('campbtn'), r = b.getBoundingClientRect(); return document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2) === b; });
    await tapEl(fr, '#campbtn'); await p.waitForTimeout(1500);
    const sf2 = p.frames().find(x => /SETTLEMENT_SCREEN/.test(x.url()));
    const brk = sf2 ? await tapEl(sf2, '#leave') : false;
    await p.waitForTimeout(800);
    const m0 = await fr.evaluate(() => T.day * 1440 + T.min); await p.waitForTimeout(2000);
    const c7 = await fr.evaluate((m0) => ({ on: BohemiaMapCamp.on(), moved: T.day * 1440 + T.min - m0, plate: getComputedStyle(document.getElementById('campbtn')).display, why: window.__CAMP && window.__CAMP.why }), m0);
    ok('C7 with the line about them on the map the plate is still on top; BREAK CAMP (a real tap) closes a camp and the clock stops; the plate is back', c7top && brk && !c7.on && c7.moved === 0 && c7.plate !== 'none' && c7.why === 'left', JSON.stringify(c7));
  } catch (e) { ok('the camp ran [' + String(e.message).slice(0, 200) + ']', false); }
  ok('C8 nothing threw', errs.length === 0, errs.slice(0, 3).join(' | '));
  try { await d.close(); } catch (e) {}
  done();
})();
