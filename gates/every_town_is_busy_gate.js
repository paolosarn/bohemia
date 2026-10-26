/* ==========================================================================
   EVERY TOWN IS BUSY  (RUN TWO, 10/26/26, VAMILY [eyes: the quiet town], rule 131)

   PAOLO 10/23: "I would like to see characters you can't even interact with walking around the settlement, doing something,
   doing important things." EYES 10/25 (BUILD 10/25o): Remnants busy, Blues ONE person standing still through three pictures,
   and the lower quarter of the phone under Blues' picture an empty dark band (rule 218(c)'s row, not this gate).
   MEASURED 10/26 on the demo, all 14 places by the map's door: 6 were sick (the cards roll often) and a sick or raided place cut
   its street to ONE man and ONE walker (Blues, Anarchists, Cartel, Colorful, Reds, Trades); and the phone showed the picture at
   half the glass's height (358 of 716 points), the dusk above and below it, its people 45 points tall.
   NOW (__EVERY_TOWN_IS_BUSY__): a card thins the street by its own share (raided half, sickness a quarter: the wiki's recruit
   numbers), never to one; every place has at least three at work on its paths by day, two at night.

   LEGS, on the demo through the map's own door:
     B1 *** EVERY ONE OF THE 14 PLACES, THE PHONE ***: over six seconds, at least three people nobody taps on its paths, at least
        two seen walking and one seen at work at a stop; nobody alone in a sick or raided place
     (the dark band under the picture belongs to rule 218(c), [the town fits the screen]: the whole town fitted, never zoomed in)
     B3 the computer: three places, the same
     B4 nothing threw
   node gates/every_town_is_busy_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };

async function places(profile, only) {
  const d = await drive.open({ profile, keepCards: true, beforeTap: async (pg) => { await throughTheTitle(pg); } });
  const P = d.page, fr = d.fr, rows = [];
  try {
    await P.waitForTimeout(3000);
    let list = await fr.evaluate(() => Object.keys(ctBases()));
    if (only) list = list.filter((n, i) => i % Math.ceil(list.length / only) === 0).slice(0, only);
    for (const name of list) {
      await fr.evaluate((n) => { const bs = ctBases(), t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); }, name);
      let sf = null; for (let k = 0; k < 40 && !sf; k++) { await P.waitForTimeout(300);
        for (const x of P.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url()))) if (await x.evaluate((n) => { try { return BohemiaSettlement.ready() && BohemiaSettlement.state.place && BohemiaSettlement.state.place.name === n; } catch (e) { return false; } }, name).catch(() => false)) { sf = x; break; } }
      if (!sf) { rows.push({ name, none: true }); continue; }
      await P.waitForTimeout(1200);
      const seen = { walking: {}, working: {}, n: 0, traits: [], tier: null, cover: null, person: 0 };
      for (let t = 0; t < 12; t++) {
        const r = await sf.evaluate(() => { const S = BohemiaSettlement.state, v = BohemiaSettlement._view(), bz = BohemiaSettlement.busy(), sc = document.getElementById('scene').getBoundingClientRect();
          return { tier: S.place.tier, traits: BohemiaSettlement.traitsNow(), busy: bz.map(w => ({ look: w.look, walking: w.walking, working: !w.walking })), crowd: BohemiaSettlement.folk().filter(q => !q.keeper && !q.post).length,
            cover: { top: v.oy, bottom: v.oy + v.ph * v.s, left: v.ox, right: v.ox + v.pw * v.s, H: sc.height, W: sc.width }, person: BohemiaSettlement.scale().person * v.s }; });
        seen.n = Math.max(seen.n, r.busy.length); seen.traits = r.traits; seen.tier = r.tier; seen.cover = r.cover; seen.person = r.person; seen.crowd = r.crowd;
        r.busy.forEach(w => { if (w.walking) seen.walking[w.look] = 1; else seen.working[w.look] = 1; });
        await P.waitForTimeout(500);
      }
      rows.push({ name, tier: seen.tier, traits: seen.traits, n: seen.n, walked: Object.keys(seen.walking).length, worked: Object.keys(seen.working).length, crowd: seen.crowd, cover: seen.cover, person: Math.round(seen.person) });
      await fr.evaluate(() => { try { loopClose(); } catch (e) {} }).catch(() => {});
      await P.waitForTimeout(300);
    }
  } catch (e) { rows.push({ err: String(e.message).slice(0, 200) }); }
  return { d, rows };
}
const busyOK = r => !r.none && !r.err && r.n >= 3 && r.walked >= 2 && r.worked >= 1 && r.crowd >= 1;

(async () => {
  let { d, rows } = await places('phone_portrait');
  rows.forEach(r => console.log('    ' + String(r.name).padEnd(14) + JSON.stringify({ tier: r.tier, traits: r.traits, walkers: r.n, walked: r.walked, worked: r.worked, crowd: r.crowd, person: r.person })));
  const sick = rows.filter(r => (r.traits || []).some(t => t === 'sickness' || t === 'raided'));
  ok('*** B1 EVERY ONE OF THE ' + rows.length + ' PLACES ON THE PHONE IS BUSY *** (' + rows.filter(busyOK).length + ' of ' + rows.length + '; ' + sick.length + ' sick or raided, their fewest walkers ' + (sick.length ? Math.min(...sick.map(r => r.n)) : '-') + ')',
     rows.length >= 10 && rows.every(busyOK), rows.filter(r => !busyOK(r)).map(r => r.name + JSON.stringify(r).slice(0, 120)).join(' | '));
  ok('B4a nothing threw on the phone', d.errs.length === 0, d.errs.slice(0, 2).join(' | ')); await d.close();
  ({ d, rows } = await places('computer', 3));
  rows.forEach(r => console.log('    ' + String(r.name).padEnd(14) + JSON.stringify({ tier: r.tier, traits: r.traits, walkers: r.n, walked: r.walked, worked: r.worked, crowd: r.crowd, person: r.person })));
  ok('B3 the computer: ' + rows.length + ' places busy', rows.length === 3 && rows.every(busyOK), rows.filter(r => !busyOK(r)).map(r => r.name).join(', '));
  ok('B4b nothing threw on the computer', d.errs.length === 0, d.errs.slice(0, 2).join(' | ')); await d.close();
  console.log('EVERY TOWN IS BUSY: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0);
})();
