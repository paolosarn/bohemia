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

console.log('DRESS GATE: ' + pass + ' passed, ' + fail + ' failed  (' + wardrobe.length + ' canon items)');
process.exit(fail ? 1 : 0);
