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
    const n = await fr.evaluate(() => { const bs = ctBases(), n = Object.keys(bs)[0], t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); return n; });
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
    for (let i = 0; i < 6; i++) { if (await sf.evaluate(() => BohemiaSettlement.state.open === 'smith')) break;
      const w = await sf.evaluate(() => BohemiaSettlement.where('smith')); if (w) await p.mouse.click(box.x + w.x, box.y + w.y + 30); await p.waitForTimeout(500); }
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
