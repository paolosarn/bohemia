// DRESS GATE (7/19/26, LIFE session) — agents wear ONLY the canon wardrobe,
// and the machine bank never goes stale against the clothing factory's truth.
// FACTORY LAW gate for bohemia_dress. Proves:
//   1. the bank exists and parses (NAME|layer|hex rows)
//   2. FRESHNESS: bank canon count === the alpha's live st:'canon' count
//      (the clothing session grows the wardrobe; a stale bank goes RED here,
//      fix = rerun tools/bohemia_wardrobe_extract.py)
//   3. every dressed agent has base + legs + feet (nobody walks the Mojave
//      barefoot), every worn item is a canon name
//   4. FACTION_DRESS ships EMPTY (contents-Paolo's) and outfits carry no
//      faction logic until he rules
//   5. dressing is deterministic per agent seed
//   6. the wardrobe actually SPREADS (a block does not dress in uniform)
const fs = require('fs');
const D = require('../engine/bohemia_dress.js');
const A = require('../engine/bohemia_agents.js');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const BANK = 'banks/BOHEMIA_WARDROBE_CANON_7_19_26.txt';
const ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html';

let text = '';
try { text = fs.readFileSync(BANK, 'utf8'); } catch (e) { /* fails below */ }
const wardrobe = D.parse(text);
ok('bank exists + parses (' + wardrobe.length + ' items)', wardrobe.length > 0);

// freshness against the clothing factory's live truth
const alpha = fs.readFileSync(ALPHA, 'utf8');
const live = (alpha.match(/st:'canon'/g) || []).length;
ok('bank is FRESH: ' + wardrobe.length + ' banked === ' + live + ' canon in the alpha', wardrobe.length === live);

// hex sanity + no purple (PURPLE RESERVATION: purple is the Amalgamation's)
let hexOk = true, noPurple = true;
for (const g of wardrobe) {
  if (!/^#[0-9a-f]{6}$/.test(g.hex)) hexOk = false;
  const r = parseInt(g.hex.slice(1, 3), 16), gg = parseInt(g.hex.slice(3, 5), 16), b = parseInt(g.hex.slice(5, 7), 16);
  if (r > gg + 25 && b > gg + 25) noPurple = false;
}
ok('every hex is a real color', hexOk);
ok('no banked mid-tone is purple (PURPLE RESERVATION)', noPurple);

ok('FACTION_DRESS table EMPTY (contents-Paolo\'s)', Object.keys(D.FACTION_DRESS).length === 0);

// dress a synthetic population off real agent seeds
const feet = Array.from({ length: 22 }, (_, i) => ({ x: 0, y: 0, w: 10, h: 10 }));
const agents = A.agentsForBlock(7, feet, [{ district: 'commercial', dir: 'E', dist: 1 }], null);
D.dressAll(agents, wardrobe);

const names = new Set(wardrobe.map(g => g.n));
let full = true, canonOnly = true;
for (const a of agents) {
  for (const layer of D.REQUIRED) if (!a.outfit[layer]) full = false;
  for (const layer in a.outfit) if (!names.has(a.outfit[layer].n)) canonOnly = false;
}
ok('every agent fully dressed (base+legs+feet), ' + agents.length + ' agents', full);
ok('every worn item is canon (no invented garments)', canonOnly);

// determinism
const again = agents.map(a => ({ ...a, outfit: null }));
D.dressAll(again, wardrobe);
ok('dressing is deterministic per seed',
  JSON.stringify(agents.map(a => a.outfit)) === JSON.stringify(again.map(a => a.outfit)));

// spread: the block must not be in uniform
const tops = new Set(agents.map(a => a.outfit.base && a.outfit.base.n));
ok('the wardrobe spreads (' + tops.size + ' distinct tops on the block)', tops.size >= 5);

// ===== DRESS CODE BY RANK (Paolo 7/21/26): rookie color threshold, veteran
// tailored kit. FACTION_VETERAN_KIT still ships EMPTY (no veteran kit ruled
// yet); FACTION_LOOK now carries his SIX real faction rulings from the
// second pass -- everything else here proves the MECHANISM without
// guessing the 7 he hasn't ruled. =====
ok('FACTION_COLOR (legacy shorthand table) EMPTY (contents-Paolo\'s)', Object.keys(D.FACTION_COLOR).length === 0);
ok('FACTION_VETERAN_KIT table EMPTY (contents-Paolo\'s, no kit ruled yet)', Object.keys(D.FACTION_VETERAN_KIT).length === 0);
ok('body-surface weights sum to 1.0 (one honest meaning for "half the body")',
  Math.abs((D.BODY_W.torso + D.BODY_W.legs + D.BODY_W.feet + D.BODY_W.head) - 1) < 1e-9);
ok('torso is the heaviest region (a coat/shirt covers the most skin)',
  D.BODY_W.torso > D.BODY_W.legs && D.BODY_W.legs > D.BODY_W.head && D.BODY_W.head > D.BODY_W.feet);

// no ruling yet -> rank functions are INERT (byte-identical to the unranked draw)
{
  const seeds = [1, 2, 3, 4, 5];
  let inert = true;
  for (const s of seeds) {
    const plain = JSON.stringify(D.outfitFor(s, wardrobe, 3));
    if (JSON.stringify(D.rookieOutfit(s, wardrobe, 3)) !== plain) inert = false;
    if (JSON.stringify(D.veteranOutfit(s, wardrobe, 3)) !== plain) inert = false;
  }
  ok('rookie/veteran draw IDENTICAL to the plain draw until Paolo rules (no ruling, no behavior change)', inert);
}

// ROOKIE MECHANISM: once a color is ruled, coverage reaches >=50% of body
// surface using ONLY canon items -- proven with a throwaway test faction so
// no real canon color is invented here.
{
  const before = JSON.stringify(D.FACTION_COLOR);
  D.FACTION_COLOR['__GATE_TEST__'] = '#7a2c24';   // an oxblood-family red the canon bank actually carries
  let allCovered = true, canonOnly = true, oneShort = 0;
  for (let s = 0; s < 40; s++) {
    const o = D.rookieOutfit(s, wardrobe, '__GATE_TEST__');
    const cov = D.coverageFor(o, D.FACTION_COLOR['__GATE_TEST__']);
    if (cov < 0.5) oneShort++;
    for (const layer in o) if (!names.has(o[layer].n)) canonOnly = false;
  }
  allCovered = oneShort === 0;
  delete D.FACTION_COLOR['__GATE_TEST__'];
  ok('FACTION_COLOR table restored empty after the test', JSON.stringify(D.FACTION_COLOR) === before);
  ok('rookie mechanism reaches >=50% body-surface coverage (40 seeds, 0 short: ' + oneShort + ')', allCovered);
  ok('rookie mechanism never invents a garment (canon only, even while forcing color)', canonOnly);
}

// no false floor: an impossible color (never banked, huge tolerance miss)
// cannot be forced past what the wardrobe actually has -- proves the
// mechanism SKIPS rather than fabricates.
{
  D.FACTION_COLOR['__GATE_IMPOSSIBLE__'] = '#001a00';   // near-black true green, not a banked mid-tone
  const o = D.rookieOutfit(7, wardrobe, '__GATE_IMPOSSIBLE__');
  let canonOnly2 = true;
  for (const layer in o) if (!names.has(o[layer].n)) canonOnly2 = false;
  delete D.FACTION_COLOR['__GATE_IMPOSSIBLE__'];
  ok('an unmatchable color still yields a fully legal (if uncovered) outfit', canonOnly2 && D.REQUIRED.every(l => o[l]));
}

// VETERAN MECHANISM: every kit-specified layer is FORCED to his named
// garment; layers he didn't specify stay free.
{
  const beforeKit = JSON.stringify(D.FACTION_VETERAN_KIT);
  const baseName = wardrobe.find(g => g.layer === 'base').n;
  const legsName = wardrobe.find(g => g.layer === 'legs').n;
  const feetName = wardrobe.find(g => g.layer === 'feet').n;
  D.FACTION_VETERAN_KIT['__GATE_TEST__'] = { base: [baseName], legs: [legsName], feet: [feetName] };
  let allForced = true;
  for (let s = 0; s < 15; s++) {
    const o = D.veteranOutfit(s, wardrobe, '__GATE_TEST__');
    if (o.base.n !== baseName || o.legs.n !== legsName || o.feet.n !== feetName) allForced = false;
  }
  delete D.FACTION_VETERAN_KIT['__GATE_TEST__'];
  ok('FACTION_VETERAN_KIT table restored empty after the test', JSON.stringify(D.FACTION_VETERAN_KIT) === beforeKit);
  ok('veteran mechanism wears EVERY kit-specified layer, every seed (15/15)', allForced);
}

// unspecified layers for a veteran still draw free (kit is not a full costume lock)
{
  D.FACTION_VETERAN_KIT['__GATE_TEST2__'] = { base: [wardrobe.find(g => g.layer === 'base').n] };
  const outs = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(s => D.veteranOutfit(s, wardrobe, '__GATE_TEST2__'));
  const legsVariety = new Set(outs.map(o => o.legs && o.legs.n));
  const anyOuter = outs.some(o => o.outer);
  delete D.FACTION_VETERAN_KIT['__GATE_TEST2__'];
  ok('a layer the kit does not specify still draws freely (not a costume snap)', legsVariety.size >= 2);
  ok('NO STRAY COVER-UP: a free-drawn outer never hides a kit-governed base', !anyOuter);
}

// an explicit outer in the kit is honored like any other governed layer
{
  const outerName = wardrobe.find(g => g.layer === 'outer').n;
  D.FACTION_VETERAN_KIT['__GATE_TEST3__'] = { base: [wardrobe.find(g => g.layer === 'base').n], outer: [outerName] };
  const outs3 = [0, 1, 2, 3, 4].map(s => D.veteranOutfit(s, wardrobe, '__GATE_TEST3__'));
  delete D.FACTION_VETERAN_KIT['__GATE_TEST3__'];
  ok('an explicit outer in the kit IS worn (his call to lock it)', outs3.every(o => o.outer && o.outer.n === outerName));
}

// ===== STRIPE MODE + RAINBOW MODE (Paolo 7/21, second pass): "gold stripes
// rather than all gold" for MOB, "rainbow literally, not even a single
// color" for COLORFUL. Proven with throwaway keys first (the mechanism),
// then the real six-faction ruling below (the content he actually gave). =====
{
  const stripeName = wardrobe.find(g => g.pattern === 'stripe' && g.layer === 'base').n;
  const stripeHex = wardrobe.find(g => g.n === stripeName).hex;
  D.FACTION_LOOK['__GATE_STRIPE__'] = { mode: 'stripe', color: stripeHex };
  let stripedHits = 0, covered = 0;
  for (let s = 0; s < 40; s++) {
    const o = D.rookieOutfit(s, wardrobe, '__GATE_STRIPE__');
    const torsoItem = o.outer || o.base;
    if (torsoItem && torsoItem.pattern === 'stripe') stripedHits++;
    if (D.coverageFor(o, stripeHex) >= 0.5) covered++;
  }
  delete D.FACTION_LOOK['__GATE_STRIPE__'];
  ok('stripe mode actually lands a striped torso most of the time (' + stripedHits + '/40)', stripedHits >= 20);
  ok('stripe mode still clears >=50% coverage every seed (40/40)', covered === 40);
}
{
  D.FACTION_LOOK['__GATE_RAINBOW__'] = { mode: 'rainbow' };
  let below3 = 0;
  for (let s = 0; s < 40; s++) {
    const o = D.rookieOutfit(s, wardrobe, '__GATE_RAINBOW__');
    const rc = D.regionColor(o);
    const vivid = ['torso', 'legs', 'head', 'feet'].filter(r => rc[r] && D.isVivid(rc[r]));
    const buckets = new Set(vivid.map(r => D.hueBucket(rc[r])));
    if (buckets.size < 3) below3++;
  }
  delete D.FACTION_LOOK['__GATE_RAINBOW__'];
  ok('rainbow mode reaches 3+ distinct vivid hues, every seed (0/40 short)', below3 === 0);
}
// bucket 4 (blue-purple) is deliberately absent: PURPLE RESERVATION caught
// the first two picks that would have landed there (violet, then magenta --
// both trip the same r+b-over-g "purple family" test even off pure-hue), so
// the rainbow draws from 5 buckets instead of 6. Still comfortably enough
// for the 3-distinct-hue requirement below.
ok('the wardrobe carries real spectrum color in 4 buckets Amalgamation doesn\'t own',
  [1, 2, 3, 5].every(b => wardrobe.some(g => D.isVivid(g.hex) && D.hueBucket(g.hex) === b)));
ok('bucket 4 (blue-purple) stays EMPTY -- PURPLE RESERVATION holds even for a "rainbow"',
  ![1, 2, 3, 5].includes(4) && !wardrobe.some(g => D.isVivid(g.hex) && D.hueBucket(g.hex) === 4));

// ===== THE SIX REAL RULINGS (Paolo 7/21, exact asks) =====
{
  const L = D.FACTION_LOOK;
  ok('FACTION_LOOK carries exactly his six ruled factions (nothing guessed beyond them)',
    Object.keys(L).sort().join(',') === ['CARAVANS', 'CARTEL', 'CHURCH', 'COLORFUL', 'MOB', 'REDS'].sort().join(','));
  ok('REDS is family mode', L.REDS.mode === 'family');
  ok('CARTEL is family mode', L.CARTEL.mode === 'family');
  ok('CHURCH is family mode', L.CHURCH.mode === 'family');
  ok('MOB is STRIPE mode -- "gold stripes rather than all gold"', L.MOB.mode === 'stripe');
  ok('CARAVANS is family mode, unchanged (his call: blend with the desert)', L.CARAVANS.mode === 'family');
  ok('COLORFUL is RAINBOW mode -- no fixed color at all', L.COLORFUL.mode === 'rainbow' && L.COLORFUL.color === undefined);

  ok('REDS vs CARTEL: brightest vs darkest actually read apart (>=95 apart)',
    D.colorDist(L.REDS.color, L.CARTEL.color) >= 95);
  ok('CHURCH vs MOB: his exact ask, the two golds read apart (>=95 apart)',
    D.colorDist(L.CHURCH.color, L.MOB.color) >= 95);

  ['REDS', 'CARTEL', 'CHURCH', 'MOB', 'CARAVANS'].forEach(f => {
    let short = 0;
    for (let s = 0; s < 60; s++) if (D.coverageFor(D.rookieOutfit(s, wardrobe, f), L[f].color) < 0.5) short++;
    ok(f + ': rookies clear >=50% coverage, 60/60 seeds', short === 0);
  });
  let colorfulShort = 0;
  for (let s = 0; s < 60; s++) {
    const rc = D.regionColor(D.rookieOutfit(s, wardrobe, 'COLORFUL'));
    const vivid = ['torso', 'legs', 'head', 'feet'].filter(r => rc[r] && D.isVivid(rc[r]));
    if (new Set(vivid.map(r => D.hueBucket(rc[r]))).size < 3) colorfulShort++;
  }
  ok('COLORFUL: 3+ distinct rainbow hues, 60/60 seeds', colorfulShort === 0);
}

console.log('DRESS GATE: ' + pass + ' passed, ' + fail + ' failed  (' + wardrobe.length + ' canon items)');
process.exit(fail ? 1 : 0);
