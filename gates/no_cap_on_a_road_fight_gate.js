#!/usr/bin/env node
/* ============================================================================
   NO CAP ON A ROAD FIGHT GATE (WORLD 8, 11/3/26; rule 378, ask line 407). Code: __NO_CAP_ON_A_ROAD_FIGHT__ in
   slices/BOHEMIA_CITY_WORLD.html (hooks H18-H20, tools/bohemia_world_8_map_houses_patch.py).
   PAOLO 11/3: 'make sure there's no coded cap of how many enemies can be on the screen.' MEASURED BEFORE: the road event's roster
   and the street crew's two rosters were Math.min(8, ...): a road fight was never more than eight whatever the party's size.

   On the demo, his phone, through the one driver; the map's one door (cityHandOver) read, not sent (the fight board's own room is
   COMBAT 7's):
     N1 a road event's party of 14 is a roster of 14
     N2 a road ambush whose party the math makes 14 hands the fight 14
     N3 the hunters, 14 of them, catch him: the fight is 14
     N4 a roaming party of 14 he chases: the fight is 14
     N5 no hand-over on the map holds an enemy count to eight (the road event, the street crew's bump and tap)
     N6 the first game day still holds the company plus one (the ruled line stays)
     C1 nothing threw
   ============================================================================ */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const PROF = process.argv[2] || 'phone_portrait';

(async () => {
  let d;
  try {
    d = await open({ profile: PROF, fog: true, beforeTap: async (p) => {
      for (let i = 0; i < 120; i++) { if (await p.evaluate(() => !!(window.BOH_TITLE && BOH_TITLE.up && BOH_TITLE.up())).catch(() => false)) break; await p.waitForTimeout(500); }
      await require(path.join(ROOT, 'tools', 'bohemia_through_the_title.js')).throughTheTitle(p, 60000); } });
    const fr = d.fr, page = d.page, errs = [];
    page.on('pageerror', e => errs.push(String(e).slice(0, 140)));
    for (let i = 0; i < 60; i++) { await page.waitForTimeout(500); if (await fr.evaluate(() => !!(window.__FRESH_START && window.__FRESH_START.at) && typeof roadFightRoster === 'function').catch(() => false)) break; }
    await page.waitForTimeout(2500);
    console.log('\n-- ' + PROF + ' --');
    const r = await fr.evaluate(() => {
      const out = {}, CAP = [], door0 = window.cityHandOver, day0 = DAY.day, PM = PARTY_MATH.roaming.value, pm0 = { min: PM.min, max: PM.max };
      try { loopClose(); } catch (e) {} try { travelStop(); } catch (e) {}
      /* him on a road away from every town (no town's ground holds a fight off) */
      let st = null; for (let y = 4; y < om.n - 4 && !st; y++) for (let x = 4; x < om.n - 4 && !st; x++) if (cityWalkable(x, y) && cityWalkable(x + 1, y) && !loopTownAt(x, y, 5) && !(typeof townGround === 'function' && townGround(x, y))) st = [x, y];
      city.x = st[0]; city.y = st[1]; CITY_GLIDE.tx = null; HUNT = null; PARTY_CHASE = null;
      window.cityHandOver = function (msg) { CAP.push({ why: msg && msg.why, n: (msg && msg.roster) ? msg.roster.length : null, party: msg && msg.party ? msg.party.count : null }); return true; };
      const last = () => CAP[CAP.length - 1] || {};
      try {
        DAY.day = Math.max(2, day0 | 0);   /* past the first day */
        out.N1 = roadFightRoster({ n: 14, arch: 'human' }, { seq: 1 }).length;
        PM.min = 14; PM.max = 99; CITY_CONTACT_POSTED = false;
        roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: 1 }); out.N2 = last(); CITY_CONTACT_POSTED = false;
        PM.min = pm0.min; PM.max = pm0.max;
        HUNT = { id: 'hunt:cap', ev: { id: 'toll_crew', name: 'the toll crew', seq: 1 }, name: 'THE TOLL CREW', arch: 'human', count: 14, at: [st[0] + 1, st[1]], steps: 0, made: performance.now() };
        mapContact(); out.N3 = last(); HUNT = null; CITY_CONTACT_POSTED = false;
        const ps = (typeof partiesAll === 'function' && partiesAll()) || [], p = ps.filter(q => q && q.at)[0];
        if (p) { const at0 = { x: p.at.x, y: p.at.y }; PARTY_SIZE[p.id] = { n: 14, day: loopDay() }; p.at.x = st[0] + 1; p.at.y = st[1]; PARTY_CHASE = p.id; try { delete PARTY_FOUGHT[p.id]; } catch (e) {}
          mapContact(); out.N4 = last(); p.at.x = at0.x; p.at.y = at0.y; delete PARTY_SIZE[p.id]; PARTY_CHASE = null; try { delete PARTY_FOUGHT[p.id]; } catch (e) {} CITY_CONTACT_POSTED = false; } else out.N4 = { none: true };
        const src = [roadFightRoster, streetTapFight, typeof streetFightOnStep === 'function' ? streetFightOnStep : function () {}].map(f => String(f));
        out.N5 = { eights: src.filter(t => /Math\.min\(\s*8\s*,/.test(t)).length, read: src.length, page: (document.documentElement.outerHTML.match(/Math\.min\(8,(roadPartySize|crew\.count)/g) || []).length };
        DAY.day = 1; PM.min = 14; PM.max = 99;
        const m1 = partyMath('roaming', { x: st[0], y: st[1] }); out.N6 = { count: m1.count, crew: crewCount(), dayOneCap: m1.dayOneCap };
      } finally { PM.min = pm0.min; PM.max = pm0.max; DAY.day = day0; window.cityHandOver = door0; HUNT = null; PARTY_CHASE = null; CITY_CONTACT_POSTED = false; }
      out.stood = st; out.tableTop = pm0.max; return out; });
    ok('N1 ' + PROF + ': a road event\'s party of 14 is a roster of 14', r.N1 === 14, 'roster ' + r.N1);
    ok('N2 ' + PROF + ': a road ambush the math makes 14 hands the fight 14', r.N2 && r.N2.n === 14 && r.N2.party === 14, JSON.stringify(r.N2));
    ok('N3 ' + PROF + ': the hunters, 14 of them, catch him: the fight is 14', r.N3 && r.N3.n === 14, JSON.stringify(r.N3));
    ok('N4 ' + PROF + ': a roaming party of 14 he chases: the fight is 14', r.N4 && r.N4.n === 14 && r.N4.party === 14, JSON.stringify(r.N4));
    ok('N5 ' + PROF + ': no hand-over on the map holds an enemy count to eight', r.N5 && r.N5.eights === 0 && r.N5.page === 0, JSON.stringify(r.N5));
    ok('N6 ' + PROF + ': the first game day still holds the company plus one', r.N6 && r.N6.dayOneCap && r.N6.count === r.N6.crew + 1, JSON.stringify(r.N6) + '; the table\'s own top for a roaming party ' + r.tableTop + ' (TUNING\'s number)');
    ok('C1 ' + PROF + ': nothing threw', errs.length === 0 && d.errs.length === 0, errs.concat(d.errs).slice(0, 2).join(' | '));
  } catch (e) { ok('the gate ran on ' + PROF, false, String(e.stack || e.message).slice(0, 300)); }
  try { if (d) await d.close(); } catch (e) {}
  console.log('\nNO CAP ON A ROAD FIGHT: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
