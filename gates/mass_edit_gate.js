const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
/* BOHEMIA MASS EDIT GATE (7/29/26) — Paolo's condition, measured.
 *
 *   "sure just make sure you do the coding right so when its time to mass edit
 *    the people you can please"
 *
 * laws/BOHEMIA_ADDENDUM_MASS_EDIT_THE_PEOPLE_7_29_26.md turns that into an
 * architecture law, and rule 4 of it is why this file exists: mass-editability
 * is a claim about BEHAVIOUR, so the gate does not check that an overrides
 * table exists. IT PERFORMS A REAL BULK EDIT and measures that it landed —
 * including on the surface he actually looks at.
 *
 * WHAT IT PROVES
 *  A. Every person has a STABLE ID, unique across the valley, and the same
 *     person comes back identical on a rebuild. Without this you cannot address
 *     anybody and "mass edit" is meaningless.
 *  B. ONE DERIVATION POINT: every field a person has comes from personFields.
 *     Asserted in source, because a field computed at the point of use is
 *     exactly the habit that makes a population uneditable.
 *  C. A REAL MASS EDIT WORKS: filter a real subset, patch it, and confirm every
 *     matching person changed and NO non-matching person did. The blast radius
 *     is measured, not assumed.
 *  D. RULES COMPOSE AND REVERSE. Two rules stack in order; removing one puts
 *     the world back exactly.
 *  E. THE EDIT REACHES THE SCREEN. Surfaces cache their people, so a cache that
 *     does not notice the rules changed would serve pre-edit bodies forever.
 *     Measured in a real browser on the real CITY tab.
 *  F. SCHEDULES ARE ASKED, NOT REIMPLEMENTED — the frame carries agents.js
 *     verbatim and people are visibly home at night and out by day.
 *  G. CONTENTS STAY PAOLO'S: the overrides table ships EMPTY.
 *
 *   node gates/mass_edit_gate.js
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const OM = require('../engine/bohemia_overmap.js');
const PG = require('../engine/bohemia_powergrid.js');
const P = require('../engine/bohemia_population.js');

let pass = 0; const fails = [];
const ok = (n, c) => { c ? pass++ : fails.push(n); };

function hashSeed(s) {
  s = String(s); let h = 1779033703 ^ s.length;
  for (let i = 0; i < s.length; i++) { h = Math.imul(h ^ s.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
  h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^ (h >>> 16)) >>> 0;
}
const SEED = hashSeed('bohemia');
const om = OM.buildOvermap(SEED), POWER = PG.powerMap(om, SEED);
const all = () => P.allPeople(om, POWER, SEED, OM.TILE_FINE, OM.OVER_N, () => true);

/* ---- G) the table ships empty ------------------------------------------- */
ok('the overrides table ships EMPTY (mechanism-mine / contents-Paolo\'s)', P.rules().length === 0);

/* ---- A) stable, unique ids ---------------------------------------------- */
const base = all();
ok(`the valley derives its people (${base.length})`, base.length >= 200);
ok('every person has an id', base.every(p => typeof p.id === 'string' && p.id.length));
ok('ids are unique across the whole valley', new Set(base.map(p => p.id)).size === base.length);
{
  const om2 = OM.buildOvermap(SEED), pw2 = PG.powerMap(om2, SEED);
  const again = P.allPeople(om2, pw2, SEED, OM.TILE_FINE, OM.OVER_N, () => true);
  const key = p => [p.id, p.look, p.face, p.archetype, p.zone, p.home[0], p.home[1]].join('|');
  ok('a rebuilt world returns the identical people (same id, same everything)',
     JSON.stringify(base.map(key)) === JSON.stringify(again.map(key)));
}
ok('every person carries the fields an edit would target',
   base.every(p => 'look' in p && 'face' in p && 'archetype' in p && 'zone' in p && 'scheduleSeed' in p));
ok('every archetype is one of the four agents.js defines',
   base.every(p => P.ARCHETYPES.indexOf(p.archetype) >= 0));

/* ---- B) one derivation point -------------------------------------------- */
{
  const src = fs.readFileSync('engine/bohemia_population.js', 'utf8');
  ok('personFields is the single derivation point', /function personFields/.test(src));
  ok('reads go through applyRules, so nothing can see an unedited body',
     /function peopleIn[\s\S]*applyRules/.test(src));
  ok('the module cites the ruling it implements',
     src.includes('BOHEMIA_ADDENDUM_MASS_EDIT_THE_PEOPLE_7_29_26'));
  ok('a rules VERSION exists for cache invalidation', /rulesVersion/.test(src));
}

/* ---- C) a real mass edit, with its blast radius measured ---------------- */
{
  const before = new Map(base.map(p => [p.id, p]));
  const targets = base.filter(p => p.archetype === 'scav');
  ok(`there is a real subset to edit (${targets.length} scavengers)`, targets.length > 20);
  const targetIds = new Set(targets.map(p => p.id));

  const v0 = P.rulesVersion();
  P.addRule({ name: 'gate:scav-look', where: p => p.archetype === 'scav', set: { look: 3 } });
  ok('adding a rule bumps the rules version (caches must be able to notice)', P.rulesVersion() > v0);

  const after = all();
  ok('the edit did not change how many people exist', after.length === base.length);

  let hit = 0, missed = 0, collateral = 0;
  for (const p of after) {
    const b = before.get(p.id);
    if (targetIds.has(p.id)) { p.look === 3 ? hit++ : missed++; }
    else if (b && p.look !== b.look) collateral++;
  }
  ok(`EVERY targeted person changed (${hit}/${targets.length}, ${missed} missed)`,
     hit === targets.length && missed === 0);
  ok(`NOBODY ELSE changed (${collateral} collateral)`, collateral === 0);

  /* D) rules compose in order, and reverse exactly */
  P.addRule({ name: 'gate:cluster-face', where: p => p.zone === 'cluster', set: { face: 5 } });
  const two = all();
  ok('a second rule applies on top of the first',
     two.filter(p => p.zone === 'cluster').every(p => p.face === 5)
     && two.filter(p => p.archetype === 'scav').every(p => p.look === 3));
  ok('a person hit by BOTH rules carries both patches',
     two.filter(p => p.zone === 'cluster' && p.archetype === 'scav').every(p => p.look === 3 && p.face === 5));

  P.removeRule('gate:cluster-face');
  P.removeRule('gate:scav-look');
  ok('removing the rules empties the table', P.rules().length === 0);
  const key = p => [p.id, p.look, p.face, p.archetype].join('|');
  ok('the world is EXACTLY as it was before the edit (an edit is reversible)',
     JSON.stringify(all().map(key)) === JSON.stringify(base.map(key)));
}

/* ---- E) and F) on the real surface -------------------------------------- */
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve('slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load', timeout: 300000 });
  await SETTLE(pg, 12000);
  await pg.mouse.click(195, 420);
  await SETTLE(pg, 6000);
  await pg.evaluate(() => {
    /* THE CITY TAB IS GONE (Paolo 8/2). It found the tab by its TEXT, which is
       why the data-p sweep did not catch it. The world is reached through RUN;
       both buttons opened the same panel since 7/28. */
      const t = [...document.querySelectorAll('.tab,button')].find(e => e.textContent.trim() === 'RUN');
    if (!t) throw new Error('the tab this gate measures is not reachable: a missing tab is a FAILURE, not a skip (ONE WORLD TAB, 8/2)'); t.click();
  });
  await SETTLE(pg, 22000);
  const f = pg.frames().find(fr => fr.name() === 'cityFrame');
  ok('the CITY tab mounts its frame', !!f);

  if (f) {
    const r = await f.evaluate(() => {
      if (typeof BohemiaAgents === 'undefined') return { err: 'agents module not inlined' };
      if (typeof BohemiaPopulation === 'undefined') return { err: 'population module not inlined' };
      let best = null;
      for (let ty = 0; ty < 96 && !best; ty++) for (let tx = 0; tx < 96; tx++) {
        const c = om.at(tx, ty);
        if (!c || !BohemiaPopulation.RESIDENTIAL[c.district]) continue;
        if (BohemiaPopulation.zoneAt(om, POWER, tx, ty, seed) === 'cluster') { best = [tx, ty]; break; }
      }
      if (!best) return { err: 'no cluster' };
      const nx = best[0] >> 2, ny = best[1] >> 2;
      const seed0 = BohemiaPopulation.peopleIn(om, POWER, nx, ny, seed, FN, pplStandable, 24);
      MODE = 'human'; HC = 22; hx = seed0[0].home[0] + 1; hy = seed0[0].home[1] + 1; fit();

      /* F) schedules: home at night, out by day - and the pass reports both */
      const day = [];
      for (const m of [3 * 60, 9 * 60, 13 * 60, 19 * 60]) {
        T.min = m; render();
        day.push({ m, drawn: window.__PPL_DRAWN, out: window.__PPL_OUT });
      }

      /* E) THE EDIT MUST REACH THE SCREEN, through the cache */
      T.min = 3 * 60; render();
      /* *** THE SAME DOOR AS "AFTER", WHICH IT WAS NOT. *** This read the census
         directly with a HARD-CODED cap of 24 while the two readings below come
         through pplPeople, whose cap RIDES THE DIAL (24 at dial 1, 480 at dial
         20). At the old default both happened to cap at 24 and the comparison
         worked by coincidence; the day the population default moved (8/28) the
         claim went red comparing 24 people against 21 and reported it as the
         surface failing to restore. COMPARING TWO READINGS TAKEN THROUGH
         DIFFERENT DOORS IS NOT A COMPARISON. Same door now, both sides. */
      const looksBefore = pplPeople(nx, ny).map(p => p.look);
      BohemiaPopulation.addRule({ name: 'gate:all-look-1', where: () => true, set: { look: 1 } });
      render();
      const looksAfter = pplPeople(nx, ny).map(p => p.look);   /* the CACHED path, on purpose */
      const drawnAfter = window.__PPL_DRAWN;
      BohemiaPopulation.clearRules();
      render();
      const looksBack = pplPeople(nx, ny).map(p => p.look);
      return { day, looksBefore, looksAfter, looksBack, drawnAfter, count: seed0.length };
    });

    ok('the surface has both modules live', !r.err);
    if (!r.err) {
      /* F) */
      const night = r.day.find(d => d.m === 3 * 60), morning = r.day.find(d => d.m === 9 * 60);
      ok(`at 03:00 nobody is out (${night.out} out of ${night.drawn} drawn)`, night.out === 0);
      ok(`by 09:00 people are out (${morning.out} out)`, morning.out > 0);
      ok('the block is not simply static across the day',
         new Set(r.day.map(d => d.out)).size > 1);
      /* E) */
      ok(`the mass edit REACHES THE CACHED SURFACE (${r.looksAfter.length} people, all look 1)`,
         r.looksAfter.length > 0 && r.looksAfter.every(v => v === 1));
      ok('before the edit they were NOT all the same (so the test is not vacuous)',
         new Set(r.looksBefore).size > 1);
      ok('clearing the rules restores the surface exactly',
         JSON.stringify(r.looksBack) === JSON.stringify(r.looksBefore));
      ok(`people are still drawn after a bulk edit (${r.drawnAfter})`, r.drawnAfter > 0);
    }
    ok('no page errors while editing people live', errs.length === 0);
    if (errs.length) errs.slice(0, 3).forEach(e => console.log('    page error: ' + e));
  }

  await b.close();
  console.log(`MASS EDIT GATE: ${pass} passed, ${fails.length} failed`);
  fails.forEach(x => console.log('  FAIL  ' + x));
  process.exit(fails.length ? 1 : 0);
})().catch(e => {
  console.log(`MASS EDIT GATE: ${pass} passed, ${fails.length} failed (harness error: ${e.message})`);
  fails.forEach(x => console.log('  FAIL  ' + x));
  process.exit(1);
});
