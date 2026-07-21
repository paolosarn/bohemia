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
// tailored kit. Both tables ship EMPTY (contents-Paolo's); this proves the
// MECHANISM without guessing his faction colors or kits. =====
ok('FACTION_COLOR table EMPTY (contents-Paolo\'s)', Object.keys(D.FACTION_COLOR).length === 0);
ok('FACTION_VETERAN_KIT table EMPTY (contents-Paolo\'s)', Object.keys(D.FACTION_VETERAN_KIT).length === 0);
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

console.log('DRESS GATE: ' + pass + ' passed, ' + fail + ' failed  (' + wardrobe.length + ' canon items)');
process.exit(fail ? 1 : 0);
