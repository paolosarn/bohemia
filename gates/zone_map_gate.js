/* BOHEMIA ZONE MAP GATE (7/29/26) — Paolo's 7/29 population ruling, locked.
 *
 * NOT gates/population_gate.js. That one already exists (LIFE session, 7/19)
 * and guards a different law: the two-plane sim, where the numbers plane and
 * the bodies plane must agree. This one guards the ZONE MAP —
 * laws/BOHEMIA_ADDENDUM_HOW_MANY_PEOPLE_7_29_26.md — which is new ground:
 *
 *   "both. why not both. some clusters. some no mans lands. some random
 *    spread."
 *
 * and the number those zones have to add up to, which is the valley's FOOD
 * CARRYING CAPACITY (~65,000 people, ~300 bodies in the walkable world).
 * The two gates are checked separately on purpose; they are separate laws.
 *
 * WHAT IT PROVES
 *  1. THE NUMBER, on the CANON SEED — the ONE SEED law's text 'bohemia' ->
 *     2691674296, the map Paolo actually boots. Tight band there, wide band on
 *     other seeds, because a procedural valley varying by a third is honest and
 *     clamping it would be a lie.
 *  2. ALL THREE DISTRIBUTIONS AT ONCE, on every seed. Not "mostly clusters with
 *     strays", not a flat rate.
 *  3. EMPTINESS IS AUTHORED. A real share of residential ground has NOBODY on
 *     it. Written as a floor because it is the assertion most likely to be
 *     quietly deleted by a future "the world feels dead, add people" change.
 *  4. NOBODY LIVES IN THE DESERT — the engine reality map's named risk when
 *     wiring people in, proved impossible by construction rather than by a
 *     filter somebody has to remember.
 *  5. CLUSTERS ARE EARNED: every one sits on power or backs onto farm/water
 *     ground, and is at least half residential. Paolo's own rule.
 *  6. DETERMINISM, because the whole reason this is a shared module is that the
 *     RUN and the CITY tab must describe ONE city.
 *  7. IT FEEDS THE EXISTING SIM RATHER THAN FORKING IT. bohemia_agents.js owns
 *     the census and already takes an occupiedRate; this module supplies that
 *     rate per neighbourhood and adds no second census. Asserted in source so
 *     the ENGINE SYNC LAW cannot be broken quietly.
 *  8. CONTENTS STAY PAOLO'S — the NAMES table ships EMPTY.
 *
 *   node gates/zone_map_gate.js
 */
const fs = require('fs');
const OM = require('../engine/bohemia_overmap.js');
const PG = require('../engine/bohemia_powergrid.js');
const P = require('../engine/bohemia_population.js');

let pass = 0; const fails = [];
const ok = (n, c) => { c ? pass++ : fails.push(n); };

function hashSeed(str) {
  str = String(str); let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
  h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^ (h >>> 16)) >>> 0;
}
const CANON = hashSeed('bohemia');
ok('canon seed is the ONE SEED (2691674296)', CANON === 2691674296);

const worlds = [CANON, 2026, 7, 12345, 999].map(s => {
  const om = OM.buildOvermap(s);
  const POWER = PG.powerMap(om, s);
  return { seed: s, om, POWER, census: P.census(om, POWER, s, OM.OVER_N) };
});
const W0 = worlds[0], canon = W0.census;

/* ---- 1) THE NUMBER ------------------------------------------------------ */
ok(`canon seed population is ~300 (got ${canon.people})`, canon.people >= 270 && canon.people <= 330);
ok(`canon seed cluster count is ~14 (got ${canon.zones.cluster})`, canon.zones.cluster >= 11 && canon.zones.cluster <= 17);
worlds.forEach(w => ok(`seed ${w.seed} population inside the honest band 200-450 (got ${w.census.people})`,
                       w.census.people >= 200 && w.census.people <= 450));
/* the walkable valley's own weight must still agree with the ruling's 177 */
ok(`residential ground still totals ~177 neighbourhoods' worth (${(canon.residentialCells / 16).toFixed(1)})`,
   canon.residentialCells / 16 > 150 && canon.residentialCells / 16 < 200);

/* ---- 2) ALL THREE AT ONCE, and 3) EMPTINESS IS AUTHORED ------------------ */
worlds.forEach(w => {
  const z = w.census.zones, n = w.census.neighbourhoods;
  ok(`seed ${w.seed} has real CLUSTERS (${z.cluster})`, z.cluster >= 5);
  ok(`seed ${w.seed} has real SPREAD (${z.spread})`, z.spread >= 40);
  ok(`seed ${w.seed} has real LONERS (${z.loner})`, z.loner >= 25);
  ok(`seed ${w.seed} keeps a real NO MAN'S LAND (${z.empty} of ${n})`, z.empty >= 0.15 * n);
  ok(`seed ${w.seed}: no single zone eats the map`,
     Math.max(z.cluster, z.spread, z.loner, z.empty) <= 0.60 * n);
});
/* if spread and loners carried the population, "you hear a settlement before
   you see it" would be false */
ok(`clusters carry the majority of the people (${canon.zones.cluster * P.HEADS.cluster} of ${canon.people})`,
   canon.zones.cluster * P.HEADS.cluster > canon.people * 0.45);

/* ---- 4) NOBODY LIVES IN THE DESERT -------------------------------------- */
{
  let checked = 0, ghosts = 0;
  for (let ty = 0; ty < OM.OVER_N; ty++) for (let tx = 0; tx < OM.OVER_N; tx++) {
    const c = W0.om.at(tx, ty);
    if (!c || P.RESIDENTIAL[c.district]) continue;
    /* only cells whose WHOLE 4x4 group has no housing - a shop inside a
       residential neighbourhood legitimately inherits that neighbourhood */
    const n = P.neighbourhoodOf(tx, ty);
    let anyRes = false;
    for (let y = 0; y < P.NB && !anyRes; y++) for (let x = 0; x < P.NB; x++) {
      const cc = W0.om.at(n[0] * P.NB + x, n[1] * P.NB + y);
      if (cc && P.RESIDENTIAL[cc.district]) { anyRes = true; break; }
    }
    if (anyRes) continue;
    checked++;
    if (P.zoneAt(W0.om, W0.POWER, tx, ty, W0.seed) !== null) ghosts++;
    if (P.headsAt(W0.om, W0.POWER, tx, ty, W0.seed) !== 0) ghosts++;
    if (P.occupiedRateFor(W0.om, W0.POWER, tx, ty, W0.seed, 6) !== 0) ghosts++;
  }
  ok(`no phantom residents on non-residential ground (${checked} sampled, ${ghosts} ghosts)`,
     checked > 200 && ghosts === 0);
}

/* ---- 5) CLUSTERS ARE EARNED --------------------------------------------- */
{
  const seen = {}; let clusters = 0, unearned = 0, tooSmall = 0;
  for (let ty = 0; ty < OM.OVER_N; ty++) for (let tx = 0; tx < OM.OVER_N; tx++) {
    const c = W0.om.at(tx, ty);
    if (!c || !P.RESIDENTIAL[c.district]) continue;
    const n = P.neighbourhoodOf(tx, ty), k = n[0] + ',' + n[1];
    if (seen[k]) continue; seen[k] = 1;
    if (P.zoneAt(W0.om, W0.POWER, tx, ty, W0.seed) !== 'cluster') continue;
    clusters++;
    if (P.weightOf(W0.om, n[0], n[1]) < 0.5) tooSmall++;
    let powered = false;
    for (let y = 0; y < P.NB && !powered; y++) for (let x = 0; x < P.NB; x++) {
      const p = W0.POWER.at(n[0] * P.NB + x, n[1] * P.NB + y);
      if (p && p.live) { powered = true; break; }
    }
    let draw = 0;
    for (let kk = -1; kk <= P.NB; kk++) {
      const probes = [[n[0] * P.NB + kk, n[1] * P.NB - 1], [n[0] * P.NB + kk, n[1] * P.NB + P.NB],
                      [n[0] * P.NB - 1, n[1] * P.NB + kk], [n[0] * P.NB + P.NB, n[1] * P.NB + kk]];
      for (const pr of probes) { const pc = W0.om.at(pr[0], pr[1]); if (pc && P.DRAW[pc.district]) draw++; }
    }
    if (!powered && !draw) unearned++;
  }
  ok(`every cluster sits on power or farm/water ground (${clusters} clusters, ${unearned} unearned)`,
     clusters > 0 && unearned === 0);
  ok(`every cluster is at least half residential (${tooSmall} too small)`, tooSmall === 0);
}

/* ---- 6) DETERMINISM ------------------------------------------------------ */
{
  let drift = 0;
  for (let i = 0; i < 400; i++) {
    const tx = (i * 7) % OM.OVER_N, ty = (i * 13) % OM.OVER_N;
    if (P.zoneAt(W0.om, W0.POWER, tx, ty, W0.seed) !== P.zoneAt(W0.om, W0.POWER, tx, ty, W0.seed)) drift++;
    if (P.headsAt(W0.om, W0.POWER, tx, ty, W0.seed) !== P.headsAt(W0.om, W0.POWER, tx, ty, W0.seed)) drift++;
  }
  ok('same inputs give the same answer every call (the two surfaces must agree)', drift === 0);
  const om2 = OM.buildOvermap(W0.seed), p2 = PG.powerMap(om2, W0.seed);
  const c2 = P.census(om2, p2, W0.seed, OM.OVER_N);
  ok('a rebuilt world from the same seed gives the identical census',
     c2.people === canon.people && c2.zones.cluster === canon.zones.cluster && c2.zones.empty === canon.zones.empty);
  ok('a different seed gives a different city', worlds[1].census.people !== canon.people);
}

/* ---- homesIn: the SURFACE decides what is walkable, not this module ------ */
{
  const seen = {}; let found = null;
  outer:
  for (let ty = 0; ty < OM.OVER_N; ty++) for (let tx = 0; tx < OM.OVER_N; tx++) {
    const c = W0.om.at(tx, ty); if (!c || !P.RESIDENTIAL[c.district]) continue;
    const n = P.neighbourhoodOf(tx, ty), k = n[0] + ',' + n[1];
    if (seen[k]) continue; seen[k] = 1;
    if (P.zoneAt(W0.om, W0.POWER, tx, ty, W0.seed) === 'cluster') { found = n; break outer; }
  }
  ok('found a cluster to place homes in', !!found);
  if (found) {
    const all = P.homesIn(W0.om, W0.POWER, found[0], found[1], W0.seed, OM.TILE_FINE, () => true, 99);
    ok(`a cluster places its people (${all.length})`, all.length >= 8);
    ok('no two people share a cell (OCCUPANCY LAW)',
       new Set(all.map(h => h[0] + ',' + h[1])).size === all.length);
    const span = P.NB * OM.TILE_FINE;
    ok('every home lands inside its own neighbourhood',
       all.every(h => h[0] >= found[0] * span && h[0] < (found[0] + 1) * span
                   && h[1] >= found[1] * span && h[1] < (found[1] + 1) * span));
    ok('a surface that accepts no cell gets zero homes and does not hang',
       P.homesIn(W0.om, W0.POWER, found[0], found[1], W0.seed, OM.TILE_FINE, () => false, 99).length === 0);
    ok('home placement is deterministic',
       JSON.stringify(P.homesIn(W0.om, W0.POWER, found[0], found[1], W0.seed, OM.TILE_FINE, () => true, 99)
         .map(h => [h[0], h[1]])) === JSON.stringify(all.map(h => [h[0], h[1]])));
  }
}

/* ---- 7) IT FEEDS THE EXISTING SIM, IT DOES NOT FORK IT ------------------- */
{
  const rates = {};
  for (let ty = 0; ty < OM.OVER_N; ty++) for (let tx = 0; tx < OM.OVER_N; tx++) {
    const c = W0.om.at(tx, ty); if (!c || !P.RESIDENTIAL[c.district]) continue;
    const z = P.zoneAt(W0.om, W0.POWER, tx, ty, W0.seed);
    (rates[z] = rates[z] || []).push(P.occupiedRateFor(W0.om, W0.POWER, tx, ty, W0.seed, 6));
  }
  const mean = k => rates[k] ? rates[k].reduce((a, b) => a + b, 0) / rates[k].length : -1;
  ok(`empty ground yields occupiedRate 0 (${mean('empty').toFixed(4)})`, mean('empty') === 0);
  ok(`a cluster's rate is far above a spread neighbourhood's (${mean('cluster').toFixed(3)} vs ${mean('spread').toFixed(4)})`,
     mean('cluster') > mean('spread') * 5);
  ok(`every rate is a legal fraction`,
     Object.keys(rates).every(k => rates[k].every(r => r >= 0 && r <= 1)));
  /* the whole point: the old flat placeholder is beaten on both ends */
  ok(`the ruling actually moved the dial off the flat 0.30 placeholder`,
     mean('cluster') < 0.30 && mean('spread') < 0.05);

  const src = fs.readFileSync('engine/bohemia_population.js', 'utf8');
  ok('zone map owns no clock (no Date.now / setInterval / rAF)',
     !/Date\.now|setInterval|requestAnimationFrame/.test(src));
  ok("zone map does not reimplement the agent sim (that is WORLD's module)",
     !/\bmakeSim\b|\boutAgents\b|\bwhereAt\b/.test(src));
  ok('zone map cites the ruling it implements',
     src.includes('BOHEMIA_ADDENDUM_HOW_MANY_PEOPLE_7_29_26'));
  ok('zone map hands the existing census its own occupiedRate option',
     /occupiedRateFor/.test(src) && src.includes('occupiedRate'));
  /* 8) CONTENTS STAY PAOLO'S */
  ok("the NAMES table ships EMPTY (mechanism-mine / contents-Paolo's)",
     Array.isArray(P.NAMES) && P.NAMES.length === 0);
}

/* ---- 9) INDIVIDUAL SCHEDULES (7/31) --------------------------------------
   Paolo: "how other greate games make everyone have their own INDIVIDUAL
   SCHEDULE". The research found the pattern every reference shares - nobody
   authors 300 days, they author a GRAMMAR and 300 ADDRESS BOOKS - and this is
   the assertion that the address book is REAL and not four molds in coats.
   Before this landed: 4 archetypes, 4 distinct days, 297 people. */
{
  const all = P.allPeople(W0.om, W0.POWER, W0.seed, OM.TILE_FINE, OM.OVER_N, () => true);
  const sig = p => [p.archetype, p.workDir, p.workDist, p.favDir,
                    p.wetStay, p.darkStay, p.earlyBy, p.duskSit].join('|');
  const distinct = new Set(all.map(sig)).size;
  ok(`the day is INDIVIDUAL, not four molds (${distinct} distinct days across ${all.length} people)`,
     distinct > all.length * 0.8);
  ok(`the shared grammar is still just ${P.ARCHETYPES.length} archetypes - individuality is FACTS, not more molds`,
     new Set(all.map(p => p.archetype)).size === P.ARCHETYPES.length && P.ARCHETYPES.length <= 6);

  /* every person carries a full address book */
  ok('every person has a workplace bearing and distance',
     all.every(p => typeof p.workDir === 'string' && p.workDist >= 1 && p.workDist <= 3));
  ok('every person has a favourite place bearing', all.every(p => typeof p.favDir === 'string'));
  ok('work and favourite are not always the same direction',
     all.filter(p => p.workDir !== p.favDir).length > all.length * 0.5);

  /* CONDITIONS: some people react to weather and some do not. If everybody
     reacted the same way it would not be a difference, it would be a global. */
  const wet = all.filter(p => p.wetStay).length;
  ok(`rain changes SOME people's day, not all and not none (${wet} of ${all.length} stay in)`,
     wet > all.length * 0.15 && wet < all.length * 0.7);
  const dusk = all.filter(p => p.duskSit).length;
  ok(`some people sit out at dusk and some do not (${dusk})`,
     dusk > all.length * 0.2 && dusk < all.length * 0.8);

  /* the conditions must actually MOVE somebody - placeFor is where the
     research's Stardew trick either works or is decoration */
  const rainy = { wet: true, dark: false, powered: false };
  const dry = { wet: false, dark: false, powered: false };
  const movedByRain = all.filter(p => P.placeFor(p, 'street', rainy) !== P.placeFor(p, 'street', dry)).length;
  ok(`rain actually sends people home (${movedByRain} change behaviour)`, movedByRain === wet && wet > 0);
  ok('the conditions only ever send somebody HOME, never out',
     all.every(p => ['home', 'street', 'work'].indexOf(P.placeFor(p, 'street', rainy)) >= 0
                 && P.placeFor(p, 'home', rainy) === 'home'));

  /* and the edges are edges: dusk behaviour fires at dusk and nowhere else */
  const sitter = all.find(p => p.duskSit);
  if (sitter) {
    ok('the dusk habit fires at dusk', P.atFavourite(sitter, 18 * 60) === true);
    ok('the dusk habit does NOT fire at noon or at 3am',
       P.atFavourite(sitter, 12 * 60) === false && P.atFavourite(sitter, 3 * 60) === false);
  }
  const nonsitter = all.find(p => !p.duskSit);
  if (nonsitter) ok('somebody who does not sit out never does', P.atFavourite(nonsitter, 18 * 60) === false);

  /* determinism, because the whole point is both surfaces agree */
  const again = P.allPeople(W0.om, W0.POWER, W0.seed, OM.TILE_FINE, OM.OVER_N, () => true);
  ok('the address book is deterministic',
     JSON.stringify(again.map(sig)) === JSON.stringify(all.map(sig)));
}

console.log(`ZONE MAP GATE: ${pass} passed, ${fails.length} failed`);
console.log(`  canon seed ${CANON}: ${canon.people} people · ` +
            `${canon.zones.cluster} clusters / ${canon.zones.spread} spread / ` +
            `${canon.zones.loner} loners / ${canon.zones.empty} empty`);
fails.forEach(f => console.log('  FAIL  ' + f));
process.exit(fails.length ? 1 : 0);
