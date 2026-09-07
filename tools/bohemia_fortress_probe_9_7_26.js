/* WHAT IS A FORTRESS ACTUALLY MADE OF?  (COOK, [fortress buildings], 9/7/26)
 *
 * The row: "the buildings a faction fortress needs that nobody has drawn, in tier order
 * (FACTION-TOWNS)". The law it comes from names what a fortress is, in his words:
 *
 *   "FORTRESS. The big, prominent factions. WALLS, many supporting buildings, the most
 *    goods, the best quests, the most people."
 *   "a fortress has the deep dry stores, the kitchens and the plant; a camp has a stall."
 *   "WHAT A TOWN'S BUILDINGS ARE comes from the tier and the faction's align, using the
 *    district kit's existing modules. NO NEW ART TO START."
 *
 * So this row is only allowed to draw what the kit CANNOT already draw. Reading the
 * source three times on the last row gave three confident wrong answers, so ask the
 * shipped valley instead: for every one of the 14 seats, what tier is it, and what is
 * actually ON its ground out to its REACH.
 *
 *   node tools/bohemia_fortress_probe_9_7_26.js
 */
'use strict';
const path = require('path');
const PERF = require(path.dirname(__dirname) + '/gates/bohemia_phone_perf.js');
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const LOOK = `(() => {
  const TW = window.BohemiaTowns, GR = window.BOHEMIA_FACTION_GRAPH;
  if (!TW) return { err: 'no BohemiaTowns on this surface' };
  if (!GR) return { err: 'no faction graph' };
  /* the map the walked surface actually uses, and the category function that decides
     what a cell IS -- both read the way the towns module itself reads them */
  /* THE CITY'S OWN NAMES, read off the call the city itself makes:
       BohemiaTowns.turf(om, window.BohemiaCityEdit.cat, seats)
     Guessing at cityCat / catOf / ctCat found nothing and printed four tiers of zeroes
     that looked exactly like a finding. */
  let m = null;
  try { m = (typeof om !== 'undefined' && om) ? om : (window.om || window.OM || (typeof OM !== 'undefined' ? OM : null)); } catch (e) {}
  /* NOT named cat. A const cat here shadows the page's own cat for the whole scope,
     so the very expression looking for it throws "cannot access before
     initialization" -- the probe broke itself by choosing the same word. And the
     comment that said so used backticks, which ended this template literal and broke
     the file a second time. No backticks inside LOOK. */
  let catFn = null;
  try { catFn = window.BohemiaCityEdit && window.BohemiaCityEdit.cat; } catch (e) {}
  if (typeof catFn !== 'function') catFn = null;
  const towns = TW.derive(GR, (m && typeof TW.districtsOf === 'function' && catFn)
    ? TW.districtsOf(m, catFn) : [], 1);

  const rows = [];
  const kindTally = {};
  for (const t of towns) {
    const reach = TW.REACH[t.tier] || 1;
    let cells = [];
    try { cells = TW.townCells(t, m, catFn) || []; } catch (e) {}
    const kinds = {};
    for (const c of cells) {
      let k = null;
      try { const q = m.at(c.x, c.y); k = q && q.district; } catch (e) {}
      if (!k) continue;
      kinds[k] = (kinds[k] || 0) + 1;
      kindTally[k] = (kindTally[k] || 0) + 1;
    }
    rows.push({ faction: t.faction, tier: t.tier, x: t.x, y: t.y, seatKind: t.kind,
                reach, cells: cells.length, kinds });
  }
  const saw = ['om','OM','BohemiaCityEdit','BohemiaTowns','BOHEMIA_FACTION_GRAPH']
    .filter(n => { try { return typeof window[n] !== 'undefined'; } catch (e) { return false; } })
    .join(' ') || 'none of the names it knows';
  return { rows, kindTally, catFound: !!catFn, mapFound: !!m, saw,
           tiers: TW.TIERS, REACH: TW.REACH, DEPTH: TW.DEPTH,
           seatsRuled: Object.keys(TW.SEATS || {}).length };
})()`;

(async () => {
  const { chromium } = PERF.requirePlaywright();
  const { srv, port } = await PERF.startServer();
  const browser = await chromium.launch();
  let r = null;
  try {
    const ctx = await browser.newContext(PERF.PHONE);
    await ctx.addInitScript(PERF.WITNESS);
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    page.__cdp = cdp;   /* bootToPlay taps through page.__cdp, not the local name */
    await cdp.send('Performance.enable');
    await PERF.bootToPlay(page, 'http://127.0.0.1:' + port, PERF.PAGES.alpha, () => {}, {});
    await PERF.awaitQuiet(cdp, 25000);
    /* the towns module lives on the CITY surface, which the alpha reaches in a frame */
    let target = page;
    for (const f of page.frames()) {
      const has = await f.evaluate(() => !!window.BohemiaTowns).catch(() => false);
      if (has) { target = f; break; }
    }
    r = await target.evaluate(LOOK).catch(e => ({ err: String(e) }));
  } finally { await browser.close(); try { srv.close(); } catch (e) {} }

  if (!r || r.err) { console.log('PROBE FAILED: ' + (r && r.err)); process.exit(1); }
  console.log('\nWHAT IS A FORTRESS ACTUALLY MADE OF?');
  console.log('  tiers ' + r.tiers.join(' / ') + ',  reach ' + JSON.stringify(r.REACH) +
              ',  seats he has ruled by hand: ' + r.seatsRuled);
  /* AN INSTRUMENT THAT FOUND NOTHING MUST SAY WHETHER IT COULD SEE. The first run
     printed "0 factions" in every tier, which reads like a finding and was not one. */
  console.log('  the map: ' + (r.mapFound ? 'found' : 'NOT FOUND') +
              ',  the category function: ' + (r.catFound ? 'found' : 'NOT FOUND') +
              ',  globals it looked at: ' + (r.saw || '?'));
  if (!r.mapFound || !r.catFound) {
    console.log('\n  *** THIS PROBE COULD NOT SEE THE VALLEY, SO EVERY ZERO BELOW IS THE');
    console.log('      INSTRUMENT AND NOT THE GAME. Do not read a finding out of it. ***');
  }
  const byTier = { fortress: [], town: [], camp: [] };
  for (const row of r.rows) (byTier[row.tier] = byTier[row.tier] || []).push(row);
  for (const tier of r.tiers) {
    const rs = byTier[tier] || [];
    console.log('\n  ' + tier.toUpperCase() + '  (' + rs.length + ' factions)');
    for (const row of rs) {
      const ks = Object.keys(row.kinds).sort((a, b) => row.kinds[b] - row.kinds[a]);
      console.log('    ' + row.faction.padEnd(12) + ' seat ' + (row.seatKind || '?').padEnd(12) +
        String(row.cells).padStart(3) + ' cells   ' +
        (ks.length ? ks.slice(0, 6).map(k => k + ' x' + row.kinds[k]).join(', ') : 'NOTHING ON ITS GROUND'));
    }
  }
  console.log('\n  EVERY KIND THAT APPEARS ON ANY TOWN\'S GROUND:');
  const all = Object.keys(r.kindTally).sort((a, b) => r.kindTally[b] - r.kindTally[a]);
  console.log('    ' + (all.length ? all.map(k => k + ' x' + r.kindTally[k]).join(', ') : 'NONE'));
})();
