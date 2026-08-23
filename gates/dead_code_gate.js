// DEAD LEGEND CODE GATE (8/23, WORLD lane). A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED.
//
// A legend code that no generator ever places is CONTENT THAT DOES NOT EXIST. It passes
// tilespec_gate (the dossier row is there), it passes district_kit_gate (the entry is
// well-formed), it appears in the tiling brief, and it is never once in the game. That is the
// same silence that hid the streetlights, the cars and the rubble this week -- authored,
// documented, gated, and absent.
//
// ------------------------------------------------------------------------------------
// THIS GATE EXISTS BECAUSE MY FIRST ATTEMPT AT THE MEASUREMENT WAS WRONG, AND CONFIDENTLY SO
// ------------------------------------------------------------------------------------
// A quick sweep said 76 of 1,136 legend codes are never placed, and named the airport as
// having NO HANGAR, NO JET BRIDGE AND NO DEAD AIRLINER. I nearly published that. Measured on
// the running valley instead, reading EVERY cell of a whole field rather than a sample:
//
//     airbase   hangars 45,864 · dead fighters 3,059 · revetments 2,688 · stand markings 3,213
//     airport   terminal 32,088 · airliners  6,572 · jet bridges     70 · stand markings 1,176
//
// Both place their content in full. TWO THINGS MADE THE FIRST ANSWER GARBAGE, and this gate
// is built around both of them:
//
//   1. A MULTI-CELL DISTRICT CANNOT BE MEASURED ONE CELL AT A TIME. An airfield is a field
//      that spans several overmap cells and a single cell is a WINDOW onto it. Called with no
//      bounds it builds a 128-tile field, and the apron loop -- `for (st = A0+90; st < A1-120;
//      st += 150)` -- cannot execute even once. Nothing on the apron places, which looks
//      exactly like content that was never written.
//   2. ONE LEGEND CAN SERVE TWO KINDS. The airfield module shares a legend between `airport`
//      and `airbase`, so an airport legitimately never places a revetment and an airbase
//      legitimately never places a jet bridge. Half of "never placed" was "never placed BY
//      THIS KIND", which is not a defect, it is a shared vocabulary.
//
// So the sweep below generates each district across six street configurations AND at a larger
// footprint where the module accepts one, and every code that is legitimately conditional is
// NAMED in the debt below with the reason. The number may only ever shrink.

const path = require('path');
const REPO = path.dirname(__dirname);
const K = require(path.join(REPO, 'engine/bohemia_district_kit.js'));
require(path.join(REPO, 'engine/bohemia_world.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

// THE NAMED DEBT. Every entry is a code that is genuinely conditional, with the condition.
// A code that is merely UNFINISHED does not belong here -- that is what the gate is for.
const CONDITIONAL = {
  // one legend, two kinds: each kind places its own half (measured on the running valley)
  'airport:9': 'hangar — an airbase thing; the airport builds a terminal instead',
  'airport:12': 'dead fighter — airbase only',
  'airport:17': 'revetment — airbase only',
  'airbase:8': 'terminal — airport only; a base builds separate hangars',
  'airbase:10': 'jet bridge — airport only',
  'airbase:11': 'dead airliner — airport only',
  // state a district only reaches when the world asks for it
  'suburb:5': 'gate — GATED IS RICH (Paolo): only a gated/estate community, never a walled suburb',
  'suburb:15': 'fire barrel — only ~1 neighbourhood in 5 has anybody left in it',
  // a junction-only tile on a district that also builds plain runs
  'arterial:3': 'crosswalk — intersections only, which is the arterial_x variant',
  'arterial:12': 'signal mast — intersections only',
  'arterial:15': 'stop bar — intersections only',
  'arterial:17': 'yellow turn-pocket line — intersections only',
  'arterial_x:13': 'bus stop — placed on the plain arterial run, not in the junction box',
  'arterial_x:14': 'dead car — placed on the plain arterial run',
};

const CONFIGS = [['S'], ['N'], ['E'], ['W'], ['S', 'E'], ['N', 'W']];
const dead = [];
let codes = 0, districts = 0;

for (const t of K.types().slice().sort()) {
  const spec = K.get(t);
  if (!spec || typeof spec.generate !== 'function' || !spec.legend) continue;
  districts++;
  const seen = new Set();
  const tries = [];
  for (const cfg of CONFIGS) tries.push({ streets: cfg });
  // A BIGGER FOOTPRINT WHERE THE MODULE TAKES ONE. This is the half that made the airport
  // look empty: some districts are FIELDS, and a field measured one cell wide has no room to
  // put anything in.
  for (const cfg of [['S'], ['S', 'E']]) {
    tries.push({ streets: cfg, cw: 2, ch: 2 });
    tries.push({ streets: cfg, bounds: { x0: 0, x1: 2, y0: 0, y1: 2, cells: 9 },
                 cellX: 0, cellY: 0 });
  }
  for (const opts of tries) {
    // SEEDS ENOUGH THAT THE LIST IS TRUSTWORTHY. Two seeds reported `park:9 dead pond` dead
    // when a 25-seed sweep had already seen it place -- a gate whose list carries false deaths
    // teaches people to ignore the list, which is worse than not having one.
    for (const seed of [1, 7, 23, 41, 77, 101]) {
      let r;
      try { r = spec.generate(seed, opts); } catch (e) { continue; }
      const g = (r && r.g) || r;
      if (!Array.isArray(g)) continue;
      for (const row of g) for (const v of row) seen.add(v);
    }
  }
  for (const c of Object.keys(spec.legend)) {
    codes++;
    if (seen.has(Number(c))) continue;
    const key = t + ':' + c;
    if (CONDITIONAL[key]) continue;
    dead.push(key + '  ' + String((spec.legend[c] || {}).name || ''));
  }
}

// THE RATCHET. Whatever is dead today is written down; it may only ever come down. A district
// author adding a legend row they never place will push this over and be told immediately,
// which is the whole point -- the cost of finding this class late is a week of it being
// invisible.
const DEBT = 59;
ok(`swept every registered district (${districts}, ${codes} legend codes)`, districts >= 60 && codes >= 900);
ok(`the named-conditional list carries a REASON for every entry (a bare allowlist explains nothing)`,
   Object.values(CONDITIONAL).every(v => typeof v === 'string' && v.length > 20));
ok(`DEAD LEGEND CODES only ever SHRINK (${dead.length}, was ${DEBT})`, dead.length <= DEBT);

if (dead.length) {
  console.log('  authored in a legend and never placed in any of ' +
              (CONFIGS.length + 4) + ' configurations x 6 seeds:');
  for (const d of dead.slice(0, 40)) console.log('    ' + d);
  if (dead.length > 40) console.log('    ... and ' + (dead.length - 40) + ' more');
}

console.log('DEAD CODE GATE: ' + pass + ' passed, ' + fail + ' failed  (' +
            dead.length + ' dead / ' + codes + ' codes, ' +
            Object.keys(CONDITIONAL).length + ' named conditional)');
process.exit(fail ? 1 : 0);
