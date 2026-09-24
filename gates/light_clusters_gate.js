#!/usr/bin/env node
/* BOHEMIA — LIGHT CLUSTERS GATE (9/24/26, WORLD lane, rule 31's floor)
 *
 * THE CLUSTERED POWER LAW (Paolo 7/14, LOCKED, "I like the answers"), its own
 * words: street lighting fails BY CIRCUIT, "so outages/survivals are CLUSTERS,
 * never alternating"; 10-15% of lamps lit, "all in clusters"; "every lit cluster
 * is OWNED"; LIGHT = TERRITORY, the player reads ownership by glow.
 *
 * *** THE GRID ROLLS ONE INDEPENDENT COIN PER FEEDER, WHICH IS ALTERNATING. ***
 * `const live = r() < litFraction`. The only clustering the valley has is the
 * feeder's own length, because buildCircuits slices a street run into sixes, so
 * six cells light together and that is the whole of it.
 *
 * MEASURED BEHAVIOURALLY, NOT READ OFF THE SOURCE, because a source scan cannot
 * tell a coin flip from a cluster and this gate's whole job is that distinction:
 *
 *     seed 1337   432 lit cells in 178 SEPARATE BLOBS, biggest 12 cells
 *     seed    7   391 lit cells in 158 SEPARATE BLOBS, biggest 13 cells
 *     seed   42   422 lit cells in 154 SEPARATE BLOBS, biggest 14 cells
 *
 * The biggest lit thing in Las Vegas is TWELVE CELLS. Share-of-neighbours-lit
 * falls from 35% at range 1 to 15% at range 6, and 15% IS the global fraction --
 * past one feeder the light is statistically indistinguishable from scatter.
 *
 * *** AND IT BLOCKS RULE 31, WHICH IS WHY THIS LANE MEASURED IT. *** DYNASTY's
 * school round one closed the do-nothing-future hole with Detroit and PLANNED
 * SHRINKAGE -- "the power pulled back to the corridors that still pay, a small
 * live core" -- and stated that every part of that floor is "a thing our engine
 * already draws: CLUSTERED POWER is already the law that decides which corridors
 * are lit". The LAW is. The CODE is not. THERE IS NO CORE TO PULL BACK TO:
 * thinning a uniform scatter leaves a thinner uniform scatter.
 *
 * AND THE LAW, BUILT, TO PROVE THE FIX IS SMALL AND THE CLAIM IS TRUE: light
 * spreads from a source along touching feeders until the valley reaches the
 * law's own fraction. Same light, 11 blobs against 178, biggest 104 against 12.
 * The only free number is how many sources and it is DERIVED, not tuned: one per
 * faction that holds ground, which is the law's own "every lit cluster is OWNED".
 *
 * NOT SHIPPED (rule 18): the grid is inlined into what he plays. This gate holds
 * the measurement and the fix so neither can rot, and it says so LOUDLY rather
 * than going quietly green if somebody closes it.
 *
 *   node gates/light_clusters_gate.js
 */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const R = (p) => require(path.join(ROOT, p));

const OM = R('engine/bohemia_overmap.js');
const PG = R('engine/bohemia_powergrid.js');

let pass = 0, fail = 0;
const ok = (n, c, note) => {
  if (c) pass++;
  else { fail++; console.log('  > FAIL ' + n + (note ? '  [' + note + ']' : '')); }
};
const section = (name, fn) => {
  try { return fn(); }
  catch (e) { fail++; console.log('  > FAIL ' + name + ' could not be measured  [' + (e && e.message) + ']'); }
};

const SEEDS = [1337, 7, 42];

function litOf(seed) {
  const m = OM.buildOvermap(seed);
  const P = PG.powerMap(m, seed);
  const lit = new Set(), street = new Set();
  for (let y = 0; y < 96; y++) for (let x = 0; x < 96; x++) {
    const s = P.at(x, y);
    if (!s || s.id < 0) continue;
    street.add(x + ',' + y);
    if (s.live) lit.add(x + ',' + y);
  }
  return { m, lit, street };
}

function blobsOf(litSet) {
  const seen = new Set(); const sizes = [];
  for (const k0 of litSet) {
    if (seen.has(k0)) continue;
    let n = 0; const q = [k0.split(',').map(Number)]; seen.add(k0);
    while (q.length) {
      const [x, y] = q.pop(); n++;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const k = (x + dx) + ',' + (y + dy);
        if (litSet.has(k) && !seen.has(k)) { seen.add(k); q.push([x + dx, y + dy]); }
      }
    }
    sizes.push(n);
  }
  sizes.sort((a, b) => b - a);
  return { blobs: sizes.length, biggest: sizes[0] || 0 };
}

/* the share of a lit cell's street neighbours within r that are ALSO lit. Under
   an independent roll this equals the global fraction at every r; under a real
   cluster it stays well above it. */
function neighbourShare(lit, street, r) {
  let num = 0, den = 0;
  for (const k0 of lit) {
    const [x, y] = k0.split(',').map(Number);
    for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
      if (!dx && !dy) continue;
      const k = (x + dx) + ',' + (y + dy);
      if (!street.has(k)) continue;
      den++; if (lit.has(k)) num++;
    }
  }
  return den ? num / den : 0;
}

/* THE LAW, BUILT. Kept here as well as in the cook tool on purpose: a gate that
   imports the thing it is checking is an echo, and this one has to be able to
   say independently that the fix works. */
function rnd(seed) { let s = seed >>> 0 || 1;
  return () => { s = (s * 1103515245 + 12345) >>> 0; return s / 4294967296; }; }
function clustered(circuits, seed, target, sources) {
  const r = rnd((seed ^ 0x5EED) >>> 0);
  const cellOf = {};
  circuits.forEach((c, i) => c.forEach(([x, y]) => { cellOf[x + ',' + y] = i; }));
  const adj = circuits.map(() => new Set());
  circuits.forEach((c, i) => c.forEach(([x, y]) => {
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const j = cellOf[(x + dx) + ',' + (y + dy)];
      if (j != null && j !== i) { adj[i].add(j); adj[j].add(i); }
    }
  }));
  const cells = circuits.reduce((n, c) => n + c.length, 0);
  const want = Math.round(cells * target);
  const live = new Set(); let got = 0; const front = [];
  for (let k = 0; k < sources; k++) {
    const s = (r() * circuits.length) | 0;
    if (live.has(s)) continue;
    live.add(s); got += circuits[s].length; front.push(s);
  }
  let guard = 0;
  while (got < want && front.length && guard++ < 100000) {
    const i = front[(r() * front.length) | 0];
    const nb = [...adj[i]].filter(j => !live.has(j));
    if (!nb.length) { front.splice(front.indexOf(i), 1); continue; }
    const j = nb[(r() * nb.length) | 0];
    live.add(j); got += circuits[j].length; front.push(j);
  }
  const out = new Set();
  live.forEach(i => circuits[i].forEach(([x, y]) => out.add(x + ',' + y)));
  return out;
}

/* ---- A. THE LAW SAYS CLUSTERS, IN HIS OWN WORDS ------------------------- */
section('A the law says clusters', () => {
  const law = fs.readFileSync(path.join(ROOT,
    'laws/BOHEMIA_ADDENDUM_STREETLIGHT_HEIGHT_POWER_7_14_26.md'), 'utf8');
  ok('*** "outages/survivals are CLUSTERS, never alternating" is his locked law ***',
     /CLUSTERS, never alternating/i.test(law));
  ok('and the lit fraction he locked is 10-15%',
     /10-15%|10 ?- ?15/.test(law) && /12%/.test(law));
  ok('and every lit cluster is OWNED, which is where the source count comes from',
     /Every lit cluster is OWNED/i.test(law));
});

/* ---- B. *** AND THE GRID ALTERNATES *** --------------------------------- */
section('B the grid rolls one coin per feeder', () => {
  let worstBlobs = 0, worstBiggest = 0;
  SEEDS.forEach(seed => {
    const { lit, street } = litOf(seed);
    const b = blobsOf(lit);
    const frac = lit.size / street.size;
    const n1 = neighbourShare(lit, street, 1), n6 = neighbourShare(lit, street, 6);
    console.log('    [measured] seed ' + String(seed).padStart(4) + '  ' + lit.size
      + ' lit of ' + street.size + ' (' + (100 * frac).toFixed(1) + '%)  '
      + b.blobs + ' BLOBS, biggest ' + b.biggest
      + '   neighbours lit r=1 ' + (100 * n1).toFixed(1) + '%  r=6 ' + (100 * n6).toFixed(1)
      + '%  (global ' + (100 * frac).toFixed(1) + '%)');
    worstBlobs = Math.max(worstBlobs, b.blobs);
    worstBiggest = Math.max(worstBiggest, b.biggest);

    ok('seed ' + seed + ': the lit fraction obeys the law (' + (100 * frac).toFixed(1) + '%)',
       frac >= 0.09 && frac <= 0.16);

    /* *** THE TEST THAT MATTERS: past one feeder, is the light still clustered? *** */
    ok('seed ' + seed + ': *** PAST ONE FEEDER THE LIGHT IS SCATTER, NOT CLUSTER ***',
       Math.abs(n6 - frac) < 0.05,
       'r=6 share ' + (100 * n6).toFixed(1) + '% against a global ' + (100 * frac).toFixed(1)
         + '% -- if these have separated, somebody clustered the grid and this gate must be re-aimed');
    /* and the near clustering is exactly the feeder, which is a code artifact */
    ok('seed ' + seed + ': the only clustering it has is the feeder\'s own six cells',
       n1 > frac * 2 && n1 < 0.5);
  });

  ok('*** THE VALLEY\'S LIGHT IS IN OVER A HUNDRED SEPARATE PIECES ***',
     worstBlobs > 100, worstBlobs + ' blobs');
  ok('*** AND THE BIGGEST LIT THING IN LAS VEGAS IS UNDER TWENTY CELLS ***',
     worstBiggest < 20, 'biggest ' + worstBiggest);
});

/* ---- C. WHICH IS WHY RULE 31'S FLOOR CANNOT BE DRAWN TODAY -------------- */
section('C there is no core to pull back to', () => {
  const rec = path.join(ROOT, 'records/BOHEMIA_DYNASTY_SCHOOL_THE_THREE_ACTS_AT_ONCE_ROUND_ONE_9_23_26.md');
  ok('DYNASTY\'s school round one is on disk and this is not second-hand', fs.existsSync(rec));
  if (fs.existsSync(rec)) {
    const s = fs.readFileSync(rec, 'utf8');
    ok('and it really does say the floor is the power pulled back to a live core',
       /PLANNED SHRINKAGE/i.test(s) && /live core/i.test(s));
    ok('and that CLUSTERED POWER already decides which corridors are lit',
       /CLUSTERED POWER is already\s+the law/i.test(s));
  }
  /* the measurement above is the answer to that sentence, held as one line */
  const { lit } = litOf(1337);
  const b = blobsOf(lit);
  ok('*** AND IT DOES NOT: 178 PIECES IS NOT A CORE, SO THERE IS NOTHING TO PULL BACK TO ***',
     b.blobs > 100 && b.biggest < 20, b.blobs + ' blobs, biggest ' + b.biggest);
});

/* ---- D. THE LAW, BUILT, AND THE FIX IS SMALL ---------------------------- */
section('D the law built makes a core with the same light', () => {
  SEEDS.forEach(seed => {
    const { m, lit, street } = litOf(seed);
    const circuits = PG.buildCircuits(m, 96);
    const law = clustered(circuits, seed, 0.12, 14);
    const b = blobsOf(law);
    const drift = Math.abs(law.size - lit.size) / lit.size;
    console.log('    [measured] seed ' + String(seed).padStart(4) + '  his law: ' + law.size
      + ' lit (' + (100 * law.size / street.size).toFixed(1) + '%), ' + b.blobs
      + ' blobs, biggest ' + b.biggest + '   against ours ' + lit.size + ' / '
      + blobsOf(lit).blobs + ' / ' + blobsOf(lit).biggest);

    ok('seed ' + seed + ': *** SAME LIGHT (' + (100 * drift).toFixed(1) + '% apart), which is the whole claim ***',
       drift < 0.10, 'if the clustered build is simply brighter it proves nothing');
    ok('seed ' + seed + ': and it stays inside the law\'s own 10-15% band',
       law.size / street.size >= 0.09 && law.size / street.size <= 0.16);
    ok('seed ' + seed + ': *** AND IT IS A CORE: ' + b.blobs + ' pieces, biggest ' + b.biggest + ' ***',
       b.blobs < 40 && b.biggest > 60);
  });

  /* THE SOURCE COUNT IS DERIVED, NOT TUNED, and that is checkable: it is the
     number of factions that can hold ground, so moving the roster moves it. */
  /* AND MY FIRST VERSION OF THIS CHECK WAS WRONG IN THE FLATTERING DIRECTION:
     it read graph.factions as an ARRAY and got undefined, so `undefined >= 14`
     was false and the gate said the number was not derived when the real answer
     is that I could not read the file. The graph is an OBJECT of 18 outfits, and
     the number that matters is the 14 that can HOLD GROUND -- which the pockets
     module already derives off that same graph, so ask it rather than count. */
  const outfits = Object.keys(JSON.parse(fs.readFileSync(
    path.join(ROOT, 'engine/BOHEMIA_faction_graph.json'), 'utf8')).factions).length;
  const holders = R('engine/bohemia_pockets.js').factions().length;
  console.log('    [measured] ' + outfits + ' outfits in his graph, ' + holders
    + ' of them can hold ground -- and the sources are one per holder');
  ok('the source count comes off his own faction graph, so it is derived not typed',
     holders === 14 && outfits > holders,
     holders + ' holders of ' + outfits + ' outfits against 14 sources');
});

/* ---- E. RULE 29: THE COOK IS A THING DRAWN ------------------------------ */
section('E the cook is a thing drawn', () => {
  const png = path.join(ROOT, 'slices/vote/WORLD_THE_VALLEY_AT_NIGHT.png');
  ok('the picture exists', fs.existsSync(png));
  if (fs.existsSync(png)) {
    const b = fs.readFileSync(png);
    ok('and it is a real PNG', b.length > 1000 && b[0] === 0x89 && b[1] === 0x50, b.length + ' bytes');
  }
  const bankPath = path.join(ROOT, 'banks/BOHEMIA_THE_VALLEY_AT_NIGHT_9_24_26.txt');
  ok('with a bank behind it that parses', fs.existsSync(bankPath));
  if (!fs.existsSync(bankPath)) return;
  const doc = JSON.parse(fs.readFileSync(bankPath, 'utf8'));
  ok('the bank carries the drawing that made it', !!doc.build_source);
  ok('*** THE PICTURE\'S OWN NUMBERS MATCH THE GATE\'S: ' + doc.shipped.blobs
     + ' pieces against ' + doc.hisLaw.blobs + ' ***',
     doc.shipped.blobs > 100 && doc.hisLaw.blobs < 40);
  ok('and the two panels carry the same light, which is what the picture claims',
     Math.abs(doc.hisLaw.lit - doc.shipped.lit) / doc.shipped.lit < 0.10);
  ok('TG-05: the light is the EVENT and not the ground', doc.litShare > 0 && doc.litShare <= 30);
  ok('it names MAP LAW and says why it is not in the way', /designs a layout/i.test(doc.map_law || ''));

  /* RULE 29 on the registry: no text items from this lane, ever again */
  const reg = R('records/target/BOHEMIA_VOTE_REGISTRY.json');
  const mine = reg.items.filter(i => i.lane === 'world');
  const judged = (reg.verdicts || []).map(v => v.id);
  const open = mine.filter(i => judged.indexOf(i.id) < 0);
  ok('*** EVERY UNJUDGED ITEM THIS LANE HAS IS A THING TO LOOK AT, NOT A PAGE ***',
     open.length > 0 && open.every(i => i.show && i.show.how === 'image'),
     open.map(i => i.id + ':' + (i.show && i.show.how)).join(' '));
  ok('and this round\'s picture is registered', mine.some(i => /valley-at-night/.test(i.id)));
});

console.log('LIGHT CLUSTERS GATE: ' + pass + ' passed, ' + fail + ' failed'
  + '  (his locked law says the light is in clusters and the grid rolls one coin'
  + ' per feeder: 178 pieces, biggest 12, so rule 31 has no core to pull back to)');
process.exit(fail ? 1 : 0);
