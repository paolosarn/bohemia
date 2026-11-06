#!/usr/bin/env node
/* ============================================================================
   SEVEN MAGIC MOUNTAINS GATE (the coordinator 11/5, VAMILY rule 410, ask line 459; Paolo 11/5: 'Las Vegas actually has an art
   exhibit like the seven magic mountains... definitely implement this in the game').

   The first LANDMARK (records/target/bb/landmarks.json, drawn and run by slices/bohemia_region.js __SEVEN_MAGIC_MOUNTAINS__):
     M1 THE DATA IS THE REAL PIECE: seven stacks, 33 boulders, three to six a stack; at its real coordinates (within the region
        gate's 2.5 blocks of 35.839 N, 115.271 W on the region's own formula); on open standable ground outside the valley box
     M2 NOT A SETTLEMENT: it is not one of the region's places and opens no screen
     M3 A NEW GAME HAS SEEN NOTHING: after the fog's new game, it is under the fog and not seen
     M4 SEEN FROM FAR: within 16 blocks it is seen and its block clears; a block 20 past it stays dark (nothing climbed yet)
     M5 CLIMB IT AND LOOK: standing on it lifts the fog 30 blocks round it (25 out is clear, 40 out is still dark)
     M6 ONE POST ON THE FEED, the first time only (a second visit posts nothing), draft
     M7 DRAWN ON THE MAP when he is there, at every zoom, with its name at one at least (M7b)
     M8 MUTATION: the landmark list emptied, nothing is drawn (M7 goes red)
     M9 nothing threw
   On the demo, through the one driver (node gates/seven_magic_mountains_gate.js [profile], default computer).
   ============================================================================ */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };

const LMJ = JSON.parse(fs.readFileSync(path.join(ROOT, 'records', 'target', 'bb', 'landmarks.json'), 'utf8'));
const LAND = JSON.parse(fs.readFileSync(path.join(ROOT, 'engine', 'BOHEMIA_REGION_LAND.json'), 'utf8'));
const SMM = (LMJ.landmarks || []).find(m => m.id === 'seven_magic_mountains');

function dataChecks() {
  global.window = global;
  const M = require(path.join(ROOT, 'engine', 'bohemia_region_land.js'));
  const B = (typeof BohemiaRegionLand !== 'undefined') ? BohemiaRegionLand : M;
  const L = B.load(LAND), C1 = { n: 'y0', s: 'y1', e: 'x1', w: 'x0' }, N = LAND.N;
  const st = SMM ? SMM.stacks : [];
  const kmLon = 111.0 * Math.cos(LAND.origin.lat * Math.PI / 180), kmLat = 111.0;
  const fx = SMM ? (N - 1) / 2 + (SMM.lon - LAND.origin.lon) * kmLon * 1000 / LAND.metresPerCell : 0;
  const fy = SMM ? (N - 1) / 2 - (SMM.lat - LAND.origin.lat) * kmLat * 1000 / LAND.metresPerCell : 0;
  const off = SMM ? Math.max(Math.abs(fx - (SMM.x + 0.5)), Math.abs(fy - (SMM.y + 0.5))) : 99;
  const a = SMM ? L.at(SMM.x, SMM.y, C1) : null;
  ok('M1 the real piece: ' + st.length + ' stacks, ' + st.reduce((s, v) => s + v, 0) + ' boulders, ' + Math.min(...st) + ' to ' + Math.max(...st) +
     ' a stack; ' + off.toFixed(2) + ' blocks from its real coordinates; on ' + (a && a.kind),
     !!SMM && st.length === 7 && st.reduce((s, v) => s + v, 0) === 33 && Math.min(...st) >= 3 && Math.max(...st) <= 6 && off <= 2.5 &&
     a && !a.water && !a.peak && !a.valley && a.pass < 3 && SMM.draft !== false && SMM.feed && SMM.feed.draft === true);
  ok('M2a not one of the region\'s places (no screen, no parties)', !LAND.places.some(p => /MAGIC/.test(p.name)));
}

async function run(profile) {
  console.log('\n-- ' + profile + ' --');
  const d = await open({ profile, fog: true });
  const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 140)));
  for (let i = 0; i < 160; i++) {
    if (await fr.evaluate(() => !!(window.VBC && VBC.day && window.om && om.n && window.BOH_REGION && BOH_REGION.ready && BOH_REGION.landmarks &&
      BOH_REGION.landmarks.loaded && typeof fogNewGame === 'function' && typeof MODE !== 'undefined' && MODE === 'city'))) break;
    await page.waitForTimeout(500);
  }
  await page.waitForTimeout(1500);
  await d.toMap();   /* the map up, proven by its zoom, never the town in front of it */
  const r = await fr.evaluate(() => {
    const R = BOH_REGION, LM = R.landmarks, out = {};
    const p = R.landmarkAt('seven_magic_mountains'); out.p = p; if (!p) return out;
    out.inPlaces = R.places.some(q => /MAGIC/.test(q.name));
    const feedAll = () => (window.BOHEMIA_FEED && BOHEMIA_FEED.posts) ? BOHEMIA_FEED.posts() : [];
    const feedN = () => feedAll().filter(f => f && f.who === '@the15south').length;
    const put = (x, y) => { city.x = x; city.y = y; try { if (typeof fogTick === 'function') fogTick(); } catch (e) {} R.landmarkTick(); };
    fogNewGame(false);
    put(p.x, p.y - 26);
    out.fresh = { seen: !!LM.st.seen[p.id], hidden: fogHides(p.x, p.y) };
    put(p.x, p.y - 10);
    out.far = { seen: !!LM.st.seen[p.id], clear: !fogHides(p.x, p.y), beyond: fogHides(p.x + 20, p.y + 8), climbed: !!LM.st.climbed[p.id] };
    const f0 = feedN();
    put(p.x, p.y);
    out.climb = { climbed: !!LM.st.climbed[p.id], at25: !fogHides(p.x + 25, p.y), at40: fogHides(p.x + 40, p.y), posts: feedN() - f0,
      draft: (feedAll().filter(f => f && f.who === '@the15south').slice(-1)[0] || {}).draft };
    put(p.x + 3, p.y); put(p.x, p.y);
    out.again = feedN() - f0;
    put(p.x + 3, p.y + 1);   /* beside it, so the crew's own marker is not where its name goes */
    try { render(); } catch (e) { out.renderErr = String(e.message); }
    out.drawn = LM.drawn; out.named = LM.named; out.err = LM.err || null;
    const keep = LM.list; R.landmarksUse([]);
    try { render(); } catch (e) {}
    out.mutDrawn = LM.drawn; R.landmarksUse(keep); try { render(); } catch (e) {}
    return out;
  });
  if (!r.p) { ok('the landmark loaded on the page', false, 'BOH_REGION.landmarkAt found nothing'); await d.close(); return; }
  ok('M2b not in the page\'s region places', !r.inPlaces);
  ok('M3 a new game has seen nothing: under the fog, not seen', !r.fresh.seen && r.fresh.hidden, JSON.stringify(r.fresh));
  ok('M4 seen from 10 blocks: seen and its block clear; 20 past it still dark; not climbed', r.far.seen && r.far.clear && r.far.beyond && !r.far.climbed, JSON.stringify(r.far));
  ok('M5 standing on it lifts the fog 30 round: 25 out clear, 40 out dark', r.climb.climbed && r.climb.at25 && r.climb.at40, JSON.stringify(r.climb));
  ok('M6 one post on the feed, draft, and none on a second visit', r.climb.posts === 1 && r.climb.draft === true && r.again === 1, 'first ' + r.climb.posts + ', after a second visit ' + r.again);
  ok('M7 drawn on the map when he is there', r.drawn >= 1, 'drawn ' + r.drawn + ', named ' + r.named);
  ok('M8 MUTATION: the list emptied, nothing drawn', r.mutDrawn === 0, 'drawn ' + r.mutDrawn);
  ok('M9 nothing threw', errs.length === 0 && !r.err && !r.renderErr, (errs.slice(0, 2).join(' | ') || '') + (r.err || '') + (r.renderErr || ''));
  /* at three zooms, far then two squeezes closer, beside it: drawn every time, named at least once (a name gives way to
     another name or the crew, the map's own rule), and the pictures for a person when SMM_SHOT names a file */
  const zs = [];
  for (let i = 0; i < 3; i++) {
    const z = await fr.evaluate(() => { try { const p = BOH_REGION.landmarkAt('seven_magic_mountains'); city.x = p.x + 3; city.y = p.y + 1; render(); } catch (e) {}
      const LM = BOH_REGION.landmarks; return { cz: +CZOOM.toFixed(3), tw: +TW.toFixed(1), drawn: LM.drawn, named: LM.named }; });
    zs.push(z);
    if (process.env.SMM_SHOT) await d.shot(process.env.SMM_SHOT + '_' + profile + '_' + i + '.png');
    if (i < 2) { await d.pinchIn(); await page.waitForTimeout(1800); }
  }
  ok('M7b drawn at every zoom and named at one at least', zs.every(z => z.drawn >= 1) && zs.some(z => z.named >= 1), zs.map(z => z.cz + ' (TW ' + z.tw + '): drawn ' + z.drawn + ', named ' + z.named).join('; '));
  await d.close();
}

(async () => {
  dataChecks();
  const want = process.argv[2];
  for (const p of want ? [want] : ['computer']) { try { await run(p); } catch (e) { ok('the gate ran on ' + p, false, String(e.message).slice(0, 200)); } }
  console.log('\nSEVEN MAGIC MOUNTAINS: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
