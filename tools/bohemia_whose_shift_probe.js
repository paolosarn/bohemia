/* BOHEMIA: WHOSE SHIFT IS IT (9/24/26, LIFE + CITY, rule 22 cook).

   DIRECTION's bible rule 7: the wrongness is DRAWN FROM WORLD DATA, NEVER FAKED, and
   it must trace to a real world-state row. Paolo killed this lane's 9/21 shop partly
   because I PAINTED its one wrong thing. So the picture gets measured first, again.

   THE ROW THIS ROUND: a shift. Measured with one real finger this round, SCAVENGE
   moves the clock 360 -> 837 minutes and pays one shift. And the purse's own comment
   carries the ruling that makes it cold (9/16, ruling 9): "A DAY'S WORK IS PAID FROM
   A TREASURY, NEVER MINTED... WHO PAYS IS THE GROUND YOU WORKED ON, the same holder
   the rent goes to." So the hours are yours and the name on the money is not.

   This reads, off the live alpha: where he works, what the offer costs him in hours,
   who holds that ground, and whether the wire under it is live.

   Run from repo root:  node tools/bohemia_whose_shift_probe.js
*/
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const OUT = path.join(ROOT, 'records', 'target', 'BOHEMIA_WHOSE_SHIFT_9_24.json');

(async () => {
  const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const d = await D.open({ alpha: true });
  console.log(d.says());
  const m = await d.fr.evaluate(() => {
    const out = {};
    try { const c = workCell(); out.cell = [c[0], c[1]]; } catch (e) { out.cell = null; }
    let o = null; try { o = workOffer(); } catch (e) {}
    out.offer = o ? { kind: o.kind, act: o.act, minutes: o.minutes,
                      district: o.district || null, fits: !!o.fits } : null;
    out.clockNow = (typeof DAY !== 'undefined') ? DAY.min : null;
    if (out.cell) {
      try { out.holder = POWER.holderAt(out.cell[0], out.cell[1]) || null; } catch (e) { out.holder = null; }
      try { out.ground = POWER.groundAt(out.cell[0], out.cell[1]) || null; } catch (e) { out.ground = null; }
      try { const s = POWER.at(out.cell[0], out.cell[1]); out.live = !!(s && s.live); } catch (e) {}
      try { out.payTo = POWER.payTo(out.cell[0], out.cell[1]) || null; } catch (e) {}
      try { const t = om.at(out.cell[0], out.cell[1]); out.district = t ? String(t.district) : null; } catch (e) {}
    }
    /* AND HOW MANY BLOCKS IN THIS VALLEY PAY SOMEBODY WHO IS NOT YOU, which is the
       row the picture is actually about: work is ordinary, the landlord is the wrong
       thing, and he is real. */
    let held = 0, free = 0;
    try {
      for (let y = 0; y < om.n; y++) for (let x = 0; x < om.n; x++) {
        const p = POWER.payTo(x, y);
        if (p) held++; else free++;
      }
    } catch (e) {}
    out.blocksWithALandlord = held;
    out.blocksWithNone = free;
    return out;
  });
  await d.close();
  console.log('');
  console.log('WHOSE SHIFT IS IT');
  console.log('  he works at            : ' + JSON.stringify(m.cell) + '  (' + m.district + ')');
  console.log('  the offer              : ' + JSON.stringify(m.offer));
  console.log('  the wire under it      : ' + (m.live ? 'LIVE' : 'dark'));
  console.log('  who holds that ground  : ' + (m.ground || 'nobody'));
  console.log('  WHO THE MONEY COMES FROM: ' + (m.payTo || 'nobody -- it is free ground'));
  console.log('  blocks with a landlord : ' + m.blocksWithALandlord
    + '   with none: ' + m.blocksWithNone);
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(Object.assign({
    what: 'the shift he is offered, and whose treasury pays for it',
    law: '9/16 ruling 9: a day\'s work is PAID FROM A TREASURY, NEVER MINTED; who pays is the ground you worked on',
    measuredOn: 'BOHEMIA_ALPHA_0_9.html'
  }, m), null, 1) + '\n');
  console.log('  wrote ' + path.relative(ROOT, OUT));
  process.exit(0);
})().catch(e => { console.log('PROBE THREW: ' + e.message); process.exit(1); });
