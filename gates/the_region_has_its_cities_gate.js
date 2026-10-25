/* ==========================================================================
   THE REGION HAS ITS CITIES  (WORLD, the coordinator's NOTE [grok: the 10/25 answers] for [the three sizes of place], 10/25/26)

   Grok's 10/25 answer (reference/library/grok/GROK_ASK_118_MAP_SIZE_NUMBERS_2026_10_25.md, PASSED FILTER, 'cite as source: Grok,
   unverified, plus your own check'): a typical Battle Brothers map holds 17 settlements, 2 city halls, 3 town halls, 6 village
   halls, 2 strongholds, 2 castles, 2 fortified manors: by size 4 large, 5 middle, 8 small. MEASURED before: the region's 21
   bases (where you trade) were 0 large, 4 middle, 17 small; every big place past the valley was held ground to fight. Now the
   region's two biggest real towns are its two cities (records/BOHEMIA_WORLD_THE_PLACE_IN_THE_DARK_THE_ROSTER_SAID_AND_THE_SIZES_
   10_25_26.md section 3).

     C1  Battle Brothers' 17 by kind is read off the Grok page (not typed), and sums to 17
     C2  the region's land: PAHRUMP and BOULDER CITY are bases of the large size (fortress); the two biggest real towns
     C3  the whole map counted by size beside Battle Brothers' (printed); the region now has large bases, as Battle Brothers'
         map has its cities out on the map
     C4  IN THE GAME (the demo, his computer, the land the game loads): BOULDER CITY is on the map as a fortress, drawn and named
     C5  a click on it walks there and its settlement screen opens as a fortress (its board's count printed)
   node gates/the_region_has_its_cities_gate.js            CITIES_LAND=<path> serves another land file to the game (a test)
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const LAND_FILE = process.env.CITIES_LAND || path.join(ROOT, 'engine/BOHEMIA_REGION_LAND.json');
const SHOTS = process.env.CITIES_SHOTS || null;
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const done = () => { console.log('\nTHE REGION HAS ITS CITIES: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

(async () => {
  /* C1: Battle Brothers' typical map, read off the page */
  const page = fs.readFileSync(path.join(ROOT, 'reference/library/grok/GROK_ASK_118_MAP_SIZE_NUMBERS_2026_10_25.md'), 'utf8');
  const W = { two: 2, three: 3, six: 6 }, num = s => W[s.toLowerCase()] || parseInt(s, 10);
  const m = /typical setup of (\d+) settlements: (\d+|\w+) City Halls, (\d+|\w+) Town Halls, (\d+|\w+) Village Halls, (\d+|\w+) Strongholds, (\d+|\w+) Castles, and (\d+|\w+) Fortified Manors/.exec(page);
  const BB = m ? { all: +m[1], large: num(m[2]) + num(m[5]), middle: num(m[3]) + num(m[6]), small: num(m[4]) + num(m[7]), cities: num(m[2]) } : null;
  ok('C1 Battle Brothers\' typical map off the Grok page', !!BB && BB.large + BB.middle + BB.small === BB.all && BB.all === 17,
    BB ? BB.all + ': large ' + BB.large + ' (2 cities, 2 strongholds), middle ' + BB.middle + ', small ' + BB.small + ' (source: Grok, unverified)' : 'the sentence was not found');

  /* C2, C3: the land and the valley */
  const L = JSON.parse(fs.readFileSync(LAND_FILE, 'utf8'));
  const by = (n) => L.places.filter(p => p.name === n)[0] || null;
  const P = by('PAHRUMP'), B = by('BOULDER CITY');
  ok('C2 PAHRUMP and BOULDER CITY are the region\'s cities: bases of the large size', !!P && !!B && P.tier === 'fortress' && B.tier === 'fortress' && P.role === 'base' && B.role === 'base',
    [P, B].map(p => p ? p.name + ' ' + p.tier + ' ' + p.role : 'missing').join(', '));
  const T = require(path.join(ROOT, 'engine/bohemia_towns.js')), G = require(path.join(ROOT, 'engine/BOHEMIA_faction_graph.json'));
  const vt = T.tiers(G, 1), size = { fortress: 'large', town: 'middle', camp: 'small' }, count = () => ({ large: 0, middle: 0, small: 0 });
  const valley = count(), bases = count(), fights = count();
  Object.keys(vt).forEach(k => valley[size[vt[k].tier]]++);
  L.places.forEach(p => (p.role === 'base' ? bases : fights)[size[p.tier]]++);
  const all = { large: valley.large + bases.large, middle: valley.middle + bases.middle, small: valley.small + bases.small };
  const row = (n, c) => n + ' ' + c.large + '/' + c.middle + '/' + c.small;
  ok('C3 the map by size (large/middle/small) beside Battle Brothers\': the region\'s bases have their cities', bases.large >= (BB ? BB.cities : 2),
    row('Battle Brothers', BB || count()) + ' | the valley ' + row('', valley).trim() + ' | the region\'s bases ' + row('', bases).trim() + ' | its fight places ' + row('', fights).trim() + ' | the settlements ' + row('', all).trim());

  /* C4, C5: in the game */
  let d = null;
  try {
    const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
    const serve = process.env.CITIES_LAND ? { '/engine/BOHEMIA_REGION_LAND.json': LAND_FILE } : undefined;
    d = await drive.open(Object.assign({ profile: 'computer', engage: true }, serve ? { serve } : {}));
    const fr = d.fr, pg = d.page;
    const waitFor = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn().catch(() => false)) return true; await pg.waitForTimeout(300); } return false; };
    await waitFor(() => fr.evaluate(() => !!(window.BOH_REGION && BOH_REGION.ready && BOH_REGION.places && BOH_REGION.places.length > 20)), 40000);
    /* the map's camera on BOULDER CITY, at a stop where a place is a building (a hand pans and zooms there) */
    const look = () => fr.evaluate(() => {
      const p = BOH_REGION.places.filter(q => q.name === 'BOULDER CITY')[0]; if (!p) return null;
      const b = zoomBounds(); setZoomAt(Math.min(b[1], Math.max(b[0], 1.2)), CVW / 2, CVH / 2);
      try { CAMF.on = false; } catch (e) {}
      const m = (om.n - 1) / 2; panX = -((p.x - p.y) * TW / 2) + ((city.x - city.y) * TW / 2); panY = -((p.x + p.y - 2 * m) * TH / 2) + ((city.x + city.y - 2 * m) * TH / 2);
      MAP_DREW = {}; MAP_TOWN_HIT = []; render();
      const h = MAP_TOWN_HIT.filter(t => t.name === 'BOULDER CITY')[0];
      const r = document.getElementById('cv').getBoundingClientRect();
      return { tier: p.tier, glass: mapOnGlass(p.x, p.y), hit: h ? { bld: h.bld, plate: h.plate } : null, named: (BOH_REGION.nameBoxes || []).some(b => b[3] === 'BOULDER CITY'), cv: [r.x, r.y] };
    });
    const seen = await look();
    if (SHOTS) await pg.screenshot({ path: path.join(SHOTS, 'c4_boulder_city.png') });
    ok('C4 in the game BOULDER CITY is on the map as a fortress, drawn and named', !!seen && seen.tier === 'fortress' && seen.glass && !!seen.hit && seen.named,
      seen ? 'tier ' + seen.tier + ', building ' + (seen.hit ? Math.round(seen.hit.bld.w) + ' x ' + Math.round(seen.hit.bld.h) : 'NOT DRAWN') + (seen.named ? ', named' : ', NOT NAMED') : 'not in the region');
    /* C5: a click on its name, the walk, the screen */
    let opened = null;
    if (seen && seen.hit) {
      /* the camera may have gone back to the crew while the picture was taken: looked at again, and the click straight after */
      const fh = await pg.$('#cityFrame'), fb = await fh.boundingBox();
      const again = await look(), h2 = (again && again.hit) || seen.hit, box = h2.plate || h2.bld, cv = again ? again.cv : seen.cv;
      await pg.mouse.click(fb.x + cv[0] + box.x + box.w / 2, fb.y + cv[1] + box.y + box.h / 2);
      await pg.waitForTimeout(500);
      /* the click is the town's (the map's own record of what the finger was on) and the walk to its door begins (or a party on the
         road met him the moment he set out, which only a walk can do) */
      const walking = await fr.evaluate(() => { const p = BOH_REGION.places.filter(q => q.name === 'BOULDER CITY')[0], dr = townDoor(p.x, p.y), t = window.__MAP_TAP || {};
        const going = !!(TRAVEL && TRAVEL.to && dr && Math.max(Math.abs(TRAVEL.to[0] - dr[0]), Math.abs(TRAVEL.to[1] - dr[1])) <= 1);
        return t.what === 'town' && t.name === 'BOULDER CITY' && (going || !!LOOP.fighting || !!(window.MEET && MEET.up)); });
      /* the walk is long (half a day out of the valley) and a roaming party can stop it: that fight is ended by the checker as a
         cleared fight (said), and the walk goes on by the town's own tap; the screen is what is measured */
      const isOpen = () => fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block' && LOOP.ready && LOOP.open && LOOP.open.name === 'BOULDER CITY'));
      let roads = 0;
      for (let leg = 0; leg < 8 && !(await isOpen()); leg++) {
        if (leg) await fr.evaluate(() => { const p = BOH_REGION.places.filter(q => q.name === 'BOULDER CITY')[0]; try { travelStop(); } catch (e) {} townTap({ name: p.name, x: p.x, y: p.y }); });
        await fr.evaluate(() => { try { if (TRAVEL_SPEED === 0) travelSpeedSet(TRAVEL_SPEED_LAST || 1); } catch (e) {} });
        await waitFor(async () => (await isOpen()) || await pg.evaluate(() => !!CITYFIGHT), 240000);
        if (await pg.evaluate(() => !!CITYFIGHT)) { roads++;
          for (let i = 0; i < 120; i++) { const h = await pg.$('#fightFrame'); const f = h ? await h.contentFrame() : null;
            if (f && await f.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S.board).catch(() => false)) {
              await f.evaluate(() => { FIGHT.S.units.forEach(u => { if (u.side === 'them') u.dead = true; }); FIGHT.S.over = true; FIGHT.S.result = 'won'; showOver('won'); }); break; }
            await pg.waitForTimeout(250); }
          await waitFor(() => pg.evaluate(() => !!(window.SPOILS && SPOILS.frame) || !CITYFIGHT), 15000);
          await pg.evaluate(() => { try { spoilsLeave(); } catch (e) {} });
          await waitFor(() => pg.evaluate(() => !CITYFIGHT), 20000); await pg.waitForTimeout(1500); }
      }
      if (roads) console.log('  (' + roads + ' roaming part' + (roads > 1 ? 'ies' : 'y') + ' met on the road, ended by the checker)');
      const sfh = await fr.$('#settleFrame'), sf = sfh ? await sfh.contentFrame() : null;
      if (sf) { await sf.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.state && BohemiaSettlement.state.place, null, { timeout: 15000 }).catch(() => {});
        opened = await sf.evaluate(() => { const S = BohemiaSettlement.state; let n = null; try { n = boardHere().length; } catch (e) {} return { name: S.place.name, tier: S.place.tier, offers: n }; }).catch(() => null);
        opened = Object.assign({ walking }, opened || {}); }
      if (SHOTS) await pg.screenshot({ path: path.join(SHOTS, 'c5_boulder_city_open.png') });
    }
    ok('C5 a click on it is the town\'s and walks there, and its screen opens as a fortress', !!opened && opened.walking && opened.name === 'BOULDER CITY' && opened.tier === 'fortress',
      opened ? 'walked: ' + opened.walking + ', opened ' + opened.name + ' as ' + opened.tier + (opened.offers != null ? ', ' + opened.offers + ' on its board' : '') : 'did not open');
  } catch (e) { ok('the game ran', false, String(e.message).slice(0, 160)); }
  if (d) await d.close();
  done();
})().catch(e => { ok('the gate ran', false, e.message); done(); });
