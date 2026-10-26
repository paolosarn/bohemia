/* ==========================================================================
   WHAT YOU BUY GOES ON THE MAN  (RUN TWO, 10/26/26, VAMILY [what you buy goes on the man], rule 210)

   PAOLO 10/26: "I love the idea of shopping for something and seeing where it's best ranked for your company, but then if I
   buy it, depending on whichever person I select it looks best on, it auto-equips to them."
   MEASURED BEFORE: BUY put every piece in the stash, and he had to open the crew screen and drag it onto the man the card had
   just shown it on; a new game has no crew-screen files at all until the crew screen is opened once.
   NOW (__WHAT_YOU_BUY_GOES_ON_THE_MAN__, engine/bohemia_shop_wear.js): BUY puts it on the man the card shows (the one it suits
   best, or the face he tapped), his old piece to the stash, one plain line; a small 'to the stash' keeps it unworn; the shop's
   next card, the fight's door and the crew screen all see it at once.

   LEGS, on the demo through Church's own door, a new game (the crew screen never opened), real taps:
     B1 a shield's card shows it on a man and BUY names him ('Buy it, Desi wears it'), 'to the stash' under it, both 44 points
     B2 *** BUY AND HE WEARS IT ***: one tap: the purse down by the price, the piece NOT in the stash, his old shield (if any)
        IN it, kept; the line names him, the piece, and the old piece in the stash
     B3 the next card shows it on him (the shop reads what he wears now)
     B4 *** ANOTHER FACE FIRST ***: a body armour's card, another man's face tapped, BUY: that man wears it, not the best fit
     B5 'to the stash' keeps it unworn: in the stash, on nobody
     F1 *** THE NEXT FIGHT DRAWS IT *** before the crew screen was ever opened: the fight's door hands both men in their pieces,
        and the fight page stands them with those pieces in their hands and on their backs
     C1 *** THE CREW SCREEN *** (the town's CREW, a real tap): both men wear the pieces, the old pieces in the stash, the shop's
        file emptied into the crew screen's own (its hand-over holds them)
     C2 a buy after the crew screen was open (the hand-over and the climb hold him): the crew screen's own files carry it at once
     K1 the computer: a click on BUY, the man wears it, the line said
     Z  nothing threw
   node gates/what_you_buy_goes_on_the_man_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.dirname(__dirname);
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
const { openCrew } = require(path.join(ROOT, 'tools/bohemia_open_the_crew.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const done = () => { console.log('WHAT YOU BUY GOES ON THE MAN: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

async function town(d) {
  const P = d.page, fr = d.fr;
  await P.waitForTimeout(3000);
  await fr.evaluate(() => { loopSettleBats(Math.max(loopBats(), 5000), 'the gate'); const bs = ctBases(), names = Object.keys(bs), t0 = names.find(k => /church/i.test(k)) || names[0], t = { name: t0, x: bs[t0].x, y: bs[t0].y, tier: mapTierOf(t0) }; city.x = t.x; city.y = t.y; loopOpenTown(t); });
  let sf = null; for (let k = 0; k < 60 && !sf; k++) { await P.waitForTimeout(400);
    for (const x of P.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url()))) if (await x.evaluate(() => { try { return BohemiaSettlement.ready() && !!BohemiaSettlement.state.place && !BohemiaSettlement.camp().camp && BohemiaSettlement.weaponsReady(); } catch (e) { return false; } }).catch(() => false)) { sf = x; break; } }
  if (sf) await sf.waitForFunction(() => !document.getElementById('arrive'), null, { timeout: 8000 }).catch(() => {});
  return sf;
}
function taps(d, sf, mouse) {
  const P = d.page;
  const tapAt = async (x, y) => { if (mouse) await P.mouse.click(x, y); else await P.touchscreen.tap(x, y); };
  const box = async () => (await sf.frameElement()).boundingBox();
  const rect = (sel) => sf.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return null; e.scrollIntoView({ block: 'center' }); const q = e.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2, w: q.width, h: q.height, text: e.textContent.replace(/\s+/g, ' ').trim(), off: !!e.disabled }; }, sel);
  const tapSel = async (sel) => { const r = await rect(sel); if (!r) return false; const b = await box(); await tapAt(b.x + r.x, b.y + r.y); await P.waitForTimeout(700); return true; };
  const openShop = async (k) => { await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); }); await P.waitForTimeout(300);
    for (let i = 0; i < 8; i++) { if (await sf.evaluate(k => BohemiaSettlement.state.open === k && !!document.querySelector('#shelfgrid'), k)) return true; const w = await sf.evaluate(k => BohemiaSettlement.where(k), k); const b = await box(); if (w) await tapAt(b.x + w.x, b.y + w.y); await P.waitForTimeout(900); } return false; };
  /* RE-AIMED 10/26 (RUN TWO [one tap selects, two taps buy]): a piece bought this visit leaves its place empty, so a tile is found by its own id */
  const tapItem = async (k, id) => tapSel('#shelfgrid .slot[data-id="' + id + '"]');
  const card = () => sf.evaluate(() => { const om = document.querySelector('#sbody .onman'), q = s => [...document.querySelectorAll(s)];
    return { man: om ? om.dataset.man : null, faces: q('#shopfaces button').map(b => b.dataset.man), said: (document.querySelector('#sbody .say') || document.getElementById('sbody')).textContent.replace(/\s+/g, ' ').trim().slice(0, 240) }; });
  return { tapAt, tapSel, rect, openShop, tapItem, card, box };
}
const crewNow = (sf) => sf.evaluate(() => BohemiaSettlement.shopCrew().map(m => ({ name: m.name, main: !!m.main, gear: m.gear })));
const idOf = x => x ? (x.id || x) : null;

(async () => {
  /* ---------------- the phone ---------------- */
  let d = await drive.open({ profile: 'phone_portrait', keepCards: true, beforeTap: async (pg) => { await throughTheTitle(pg); } });
  try {
    const sf = await town(d); if (!sf) { ok('a town through the map\'s door', false); return done(); }
    const T = taps(d, sf, false);
    if (!(await T.openShop('armourer'))) { ok('the armourer opens', false); return done(); }
    await sf.waitForFunction(() => window.BohemiaRoster && BohemiaRoster.data && BohemiaRoster.data.armor && BohemiaRoster.worn && BohemiaSettlement.shopCrew().length > 1, null, { timeout: 30000 }).catch(() => {});
    const files0 = await sf.evaluate(() => ({ hk: !!localStorage.getItem('bohemia.company.v1'), climb: !!localStorage.getItem('bohemia.climb.v1') }));
    /* a shield on the shelf the card shows on a man */
    const sh = await sf.evaluate(() => { const C = BohemiaRoster, crew = BohemiaSettlement.shopCrew(); return (BohemiaSettlement.state.stock.armourer || []).filter(i => i.kind === 'shield').map(i => i.id).find(id => crew.some(m => !C.wearing(m, (BohemiaSettlement.state.stock.armourer || []).find(x => x.id === id)).stops)); });
    if (!sh) { ok('the armourer has a shield a man can carry', false); return done(); }
    await T.tapItem('armourer', sh);
    const c1 = await T.card(), bw = await T.rect('#buywear'), bs = await T.rect('#buystash');
    const firstName = c1.man ? (c1.man === 'YOU' ? null : c1.man.charAt(0) + c1.man.slice(1).toLowerCase()) : '?';
    ok('B1 a shield\'s card shows it on ' + c1.man + ' and BUY names him ("' + (bw && bw.text) + '"), "' + (bs && bs.text) + '" beside it, ' + (bw && Math.round(bw.h)) + ' and ' + (bs && Math.round(bs.h)) + ' points',
      !!c1.man && !!bw && !bw.off && (firstName ? bw.text.indexOf('Buy it, ' + firstName + ' wears it') === 0 : /^Buy it and wear it/.test(bw.text)) && !!bs && /to the stash/.test(bs.text) && bw.h >= 44 && bs.h >= 44 && (bs.y > bw.y || bs.x > bw.x) && files0.hk === false);   /* RE-AIMED 10/26: 'to the stash' beside it in the strip */
    /* B2: one tap */
    const before = await sf.evaluate(() => ({ bats: BohemiaSettlement.bats ? BohemiaSettlement.bats() : null, stash: BohemiaSettlement.state.stash.map(i => i.id), price: null }));
    const man1 = c1.man, crewA = await crewNow(sf), oldOff = idOf((crewA.find(m => m.name === man1) || {}).gear && crewA.find(m => m.name === man1).gear.off);
    const price = await sf.evaluate(id => (BohemiaSettlement.state.stock.armourer || []).find(i => i.id === id).price, sh);
    await T.tapSel('#buywear');
    const after = await sf.evaluate(() => ({ bats: BohemiaSettlement.bats ? BohemiaSettlement.bats() : null, stash: BohemiaSettlement.state.stash.map(i => ({ id: i.id, keep: i.keep })), wore: window.__WORE || null, said: document.getElementById('sbody').textContent.replace(/\s+/g, ' ').trim() }));   /* RE-AIMED 10/26: the result is said in the strip, never by the keeper */
    const lines1 = await sf.evaluate(() => BohemiaShopWear.read());
    const oldIn = !oldOff || after.stash.some(x => x.id === oldOff && x.keep === true);
    ok('*** B2 BUY AND HE WEARS IT *** (one tap: ' + JSON.stringify(after.wore && after.wore.said) + '; his old shield ' + (oldOff || 'none') + (oldOff ? (oldIn ? ' in the stash, kept' : ' NOT in the stash') : '') + ')',
      !!after.wore && after.wore.man === man1 && after.wore.item === sh && !after.stash.some(x => x.id === sh) && oldIn && (before.bats == null || after.bats === before.bats - price)
      && lines1.some(l => l.slot === 'off' && l.item.id === sh) && after.said.indexOf(after.wore.said) >= 0 && /(wears|wear) the /.test(after.wore.said) && (!oldOff || /in the stash\.$/.test(after.wore.said)), 'bats ' + before.bats + ' -> ' + after.bats + ', price ' + price);
    /* B3: the next card shows him in it */
    const crewB = await crewNow(sf), hisOff = idOf((crewB.find(m => m.name === man1) || {}).gear && crewB.find(m => m.name === man1).gear.off);
    const sh2 = await sf.evaluate(() => (BohemiaSettlement.state.stock.armourer || []).filter(i => i.kind === 'shield').map(i => i.id)[0]);
    let c3 = null; if (sh2) { await T.tapItem('armourer', sh2); await T.tapSel('#shopfaces button[data-man="' + man1 + '"]'); c3 = await sf.evaluate(() => BohemiaSettlement.state.shopShown); }
    ok('B3 the shop reads what ' + man1 + ' wears now (his off hand ' + hisOff + '; the next shield\'s card on him starts from it)', hisOff === sh && (!c3 || c3.man === man1));
    /* B4: a body armour, another man's face first */
    await T.openShop('armourer');
    const arm = await sf.evaluate(() => (BohemiaSettlement.state.stock.armourer || []).find(i => i.kind === 'body' || i.kind === 'head'));
    let man2 = null, w4 = null;
    if (arm) { await T.tapItem('armourer', arm.id); const c4 = await T.card(); man2 = c4.faces.find(n => n !== c4.man && n !== man1) || c4.faces.find(n => n !== c4.man);
      await T.tapSel('#shopfaces button[data-man="' + man2 + '"]'); const c4b = await T.card(); await T.tapSel('#buywear');
      w4 = await sf.evaluate(() => window.__WORE); w4.best = c4.man; w4.shown = c4b.man; }
    const crewC = await crewNow(sf), on2 = arm && crewC.find(m => m.name === man2), slot2 = arm && arm.kind;
    ok('*** B4 ANOTHER FACE FIRST *** (' + (arm && arm.id) + ': the card chose ' + (w4 && w4.best) + ', ' + man2 + '\'s face tapped; "' + (w4 && w4.said) + '")',
      !!arm && !!w4 && w4.man === man2 && w4.shown === man2 && !!on2 && idOf(on2.gear[slot2]) === arm.id && w4.best !== man2);
    /* B5: to the stash */
    await T.openShop('armourer');
    const any = await sf.evaluate(() => (BohemiaSettlement.state.stock.armourer || [])[0]);
    let b5 = null; if (any) { await T.tapItem('armourer', any.id); await T.tapSel('#buystash');
      b5 = await sf.evaluate(id => ({ inStash: BohemiaSettlement.state.stash.some(i => i.id === id), worn: BohemiaSettlement.shopCrew().filter(m => Object.values(m.gear || {}).some(g => g && (g.id || g) === id)).map(m => m.name), lines: BohemiaShopWear.read().filter(l => l.item.id === id).length }), any.id); }
    ok('B5 "to the stash" keeps ' + (any && any.id) + ' unworn (' + JSON.stringify(b5) + ')', !!b5 && b5.inStash && b5.lines === 0);
    /* F1: the fight's door, before the crew screen was ever opened */
    const opts = await d.page.evaluate(() => JSON.parse(JSON.stringify(nfOpts({ district: 'downtown', world: { night: false, day: 3 }, at: { gx: 4, gy: 4 }, party: { count: 2, days: 1, faction: 'brigands', difficulty: 0 } }))));
    const named = (o, n, i) => (o.company || []).find((m, k) => (n === 'YOU' ? k === 0 : m && m.name === n));
    const h1 = named(opts, man1), h2 = man2 && named(opts, man2);
    const base = d.page.url().replace(/slices\/.*$/, '');
    const f = await d.ctx.newPage(); const ferr = []; f.on('pageerror', e => ferr.push(e.message));
    await f.addInitScript(o => { window.FIGHT_OPTS = Object.assign({ seed: 41, speed: 1, auto: false }, o); }, opts);
    await f.goto(base + 'slices/BOHEMIA_FIGHT.html');
    await f.waitForFunction(() => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.units && FIGHT.S.units.length, null, { timeout: 60000 }).catch(() => {});
    const fu = await f.evaluate(([a, b]) => { if (typeof FIGHT === 'undefined' || !FIGHT.S) return null; const you = FIGHT.S.units.filter(v => v.side === 'you');
      const pick = n => n === 'YOU' ? you.find(u => u.main) : you.find(u => u.name === n);
      const u1 = pick(a), u2 = b ? pick(b) : null; return { a: u1 ? { shield: u1.shield && u1.shield.id } : null, b: u2 ? { body: u2.bodyRow && u2.bodyRow.id, head: u2.headRow && u2.headRow.id } : null }; }, [man1, man2]);
    await f.close();
    ok('*** F1 THE NEXT FIGHT DRAWS IT *** (the crew screen never opened: the door hands ' + man1 + ' off ' + (h1 && h1.gear && h1.gear.off) + ', ' + man2 + ' ' + slot2 + ' ' + (h2 && h2.gear && h2.gear[slot2]) + '; the fight stands them ' + JSON.stringify(fu) + ')',
      !!h1 && h1.gear.off === sh && !!h2 && h2.gear[slot2] === arm.id && !!fu && fu.a && fu.a.shield === sh && fu.b && fu.b[slot2] === arm.id && !ferr.length, ferr.slice(0, 2).join(' | '));
    /* C1: the crew screen, the town's CREW by a real tap */
    await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); }); await d.page.waitForTimeout(300);
    /* the one CREW on screen: the phone's since UI TWO 52741663 (the bar's crew chip a readout), else the bar's, else the town's */
    if (!(await openCrew(d.page, d.fr))) await T.tapSel('#crew');
    let rf = null; for (let k = 0; k < 60 && !rf; k++) { await d.page.waitForTimeout(300); rf = d.page.frames().find(x => /ROSTER_SCREEN/.test(x.url())); }
    let cr = null;
    if (rf) { await rf.waitForFunction(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready && BohemiaRosterScreen.state.crew.length > 0, null, { timeout: 30000 }).catch(() => {}); await d.page.waitForTimeout(800);
      cr = await rf.evaluate(([a, b, s2]) => { const S = BohemiaRosterScreen.state, f = n => n === 'YOU' ? S.crew.find(m => m.main) : S.crew.find(m => m.name === n);
        const co = JSON.parse(localStorage.getItem('bohemia.company.v1') || 'null') || [];
        return { a: f(a) && f(a).gear.off && f(a).gear.off.id, b: b && f(b) && f(b).gear[s2] && f(b).gear[s2].id, bag: S.bag.map(i => i.id), lines: (localStorage.getItem('bohemia.wear.v1') || ''), handA: ((a === 'YOU' ? co[0] : co.find(x => x.name === a)) || {}).gear, handB: ((co.find(x => x.name === b)) || {}).gear }; }, [man1, man2, slot2]); }
    ok('*** C1 THE CREW SCREEN *** (the town\'s CREW by a real tap: ' + man1 + ' carries ' + (cr && cr.a) + ', ' + man2 + ' wears ' + (cr && cr.b) + '; the old shield ' + (oldOff || 'none') + (oldOff && cr ? (cr.bag.indexOf(oldOff) >= 0 ? ' in the stash' : ' MISSING') : '') + '; the shop\'s file emptied, the hand-over holds them)',
      !!cr && cr.a === sh && cr.b === arm.id && (!oldOff || cr.bag.indexOf(oldOff) >= 0) && cr.bag.indexOf(any.id) >= 0 && !cr.lines && cr.handA && cr.handA.off === sh && cr.handB && cr.handB[slot2] === arm.id);
    /* C2: close the crew screen (DONE), buy again: the crew screen's own files carry it at once */
    if (rf) { const r = await rf.evaluate(() => { const e = document.getElementById('done'); const q = e.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; }); const b = await (await rf.frameElement()).boundingBox(); await d.page.touchscreen.tap(b.x + r.x, b.y + r.y); await d.page.waitForTimeout(800); }
    await T.openShop('smith');
    const wp = await sf.evaluate(() => { const C = BohemiaRoster, crew = BohemiaSettlement.shopCrew(); return (BohemiaSettlement.state.stock.smith || []).find(i => crew.some(m => !C.wearing(m, i).stops)); });
    let c2 = null; if (wp) { await T.tapItem('smith', wp.id); const cc = await T.card(); await T.tapSel('#buywear'); const wr = await sf.evaluate(() => window.__WORE);
      c2 = await sf.evaluate(([n, id]) => { const co = JSON.parse(localStorage.getItem('bohemia.company.v1') || '[]'), cl = JSON.parse(localStorage.getItem('bohemia.climb.v1') || '{}');
        const h = n === 'YOU' ? co[0] : co.find(x => x.name === n); return { hand: h && h.gear && h.gear.main, climb: cl[n] && cl[n].gear && cl[n].gear.main && cl[n].gear.main.id }; }, [cc.man, wp.id]); c2.man = cc.man; c2.said = wr && wr.said; }
    ok('C2 a buy once the crew screen has his files (' + (wp && wp.id) + ' on ' + (c2 && c2.man) + ': the hand-over ' + (c2 && c2.hand) + ', the climb ' + (c2 && c2.climb) + '; "' + (c2 && c2.said) + '")', !!c2 && c2.hand === wp.id && c2.climb === wp.id && /carr(y|ies) the |take(s)? the /.test(c2.said || ''));
    if (process.env.BOHEMIA_SHOT_DIR) { await T.openShop('armourer'); const s2 = await sf.evaluate(() => (BohemiaSettlement.state.stock.armourer || [])[0]); if (s2) await T.tapItem('armourer', s2.id); await d.page.screenshot({ path: path.join(process.env.BOHEMIA_SHOT_DIR, 'buy_and_wear_phone.png') }); }
  } catch (e) { ok('the phone legs ran [' + String(e.stack || e.message).slice(0, 300) + ']', false); }
  ok('Z1 nothing threw on the phone', d.errs.length === 0, d.errs.slice(0, 2).join(' | ')); await d.close();
  /* ---------------- the computer ---------------- */
  d = await drive.open({ profile: 'computer', keepCards: true, beforeTap: async (pg) => { await throughTheTitle(pg); } });
  try {
    const sf = await town(d); if (!sf) ok('K1 a town through the map\'s door on the computer', false);
    else {
      const T = taps(d, sf, true);
      await T.openShop('armourer');
      await sf.waitForFunction(() => window.BohemiaRoster && BohemiaRoster.data && BohemiaRoster.data.armor && BohemiaRoster.worn && BohemiaSettlement.shopCrew().length > 0, null, { timeout: 30000 }).catch(() => {});
      const it = await sf.evaluate(() => { const C = BohemiaRoster, crew = BohemiaSettlement.shopCrew(); return (BohemiaSettlement.state.stock.armourer || []).find(i => crew.some(m => !C.wearing(m, i).stops)); });
      await T.tapItem('armourer', it.id); const k = await T.card(); await T.tapSel('#buywear');
      const wr = await sf.evaluate(() => window.__WORE), on = (await crewNow(sf)).find(m => m.name === k.man);
      ok('K1 the computer: a click on BUY, ' + k.man + ' wears ' + it.id + ' ("' + (wr && wr.said) + '")', !!wr && wr.man === k.man && !!on && Object.values(on.gear).some(g => idOf(g) === it.id));
      /* K2: the crew screen on the computer, where its own boot can open on the default twelve before the door's post lands */
      await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); }); await d.page.waitForTimeout(300);
      if (!(await openCrew(d.page, d.fr, { mouse: true }))) await T.tapSel('#crew');
      let rf = null; for (let n = 0; n < 60 && !rf; n++) { await d.page.waitForTimeout(300); rf = d.page.frames().find(x => /ROSTER_SCREEN/.test(x.url())); }
      let k2 = null; if (rf) { await rf.waitForFunction(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready && BohemiaRosterScreen.state.fromOrigin, null, { timeout: 30000 }).catch(() => {}); await d.page.waitForTimeout(800);
        k2 = await rf.evaluate(([n, id]) => { const S = BohemiaRosterScreen.state, m = n === 'YOU' ? S.crew.find(x => x.main) : S.crew.find(x => x.name === n); return { on: !!m && Object.values(m.gear || {}).some(g => g && g.id === id), lines: localStorage.getItem('bohemia.wear.v1') || '' }; }, [k.man, it.id]); }
      ok('K2 the computer\'s crew screen shows ' + k.man + ' in it, the shop\'s file taken (' + JSON.stringify(k2) + ')', !!k2 && k2.on && !k2.lines);
    }
  } catch (e) { ok('the computer legs ran [' + String(e.message).slice(0, 200) + ']', false); }
  ok('Z2 nothing threw on the computer', d.errs.length === 0, d.errs.slice(0, 2).join(' | ')); await d.close();
  done();
})();
