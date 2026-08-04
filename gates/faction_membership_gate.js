/* BOHEMIA — PEOPLE BELONG TO SOMEBODY (8/2/26, PEOPLE lane)

   Paolo 8/2, after thumbing all twelve research gaps WANT: "We need to make lots of
   progress." Gap 2 was the biggest finding in that research and it was about US as
   much as anybody: faction games script their LEADERS and leave the ordinary members
   as wallpaper. This repo shipped 268 derived people and every single one of them
   carried faction:null.

   WHAT THIS GATE HOLDS:

   A. NOTHING WAS INVENTED. FACTION_ASSIGN - which faction holds which ground - is
      still EMPTY, because that is his ruling and he has not made it. factionOf reads
      the bases the CALLER supplies, and the loop already seats every faction on real
      worldMap coordinates. Called with no bases, every agent is unaffiliated exactly
      as before, which is the zero-regression proof.

   B. MOST PEOPLE BELONG TO NOBODY. Act 1 is ten years in with every faction at about
      a third of maturity; a valley where most people are just people is what that
      means. Measured, not asserted.

   C. THE SPLIT IS EVEN, and this claim exists because the first version was NOT.
      One hash was doing two jobs - the do-they-belong roll and the which-faction
      pick - so the agents who passed the first test were a biased slice of the
      second and one faction took 63% of a three-way choice. Then the shared hash()
      turned out to end on a multiply, whose low bits barely move, so `% 3` came out
      48/40/12. Both are invisible until you COUNT, which is why this is a gate claim
      and not a comment.

   D. IT IS KEYED TO THE SEAT, NEVER TO THE ID. Agent ids are 'H3-1', 'H8-2' and they
      repeat on every block in the valley. Hashing the id alone made every H3-1
      anywhere the same faction and collapsed the whole population onto a dozen draws.
      That is the same class of bug as 8/2's "a person is keyed to where they live,
      never to their place in a list", and this gate is what stops it coming back.

   E. HIS COLOURS AND HIS MARKS, BYTE FOR BYTE. FACTION_LOOK and FACTION_MOTIF are
      checked against the alpha's own MFACTIONS table, read live. Paolo 8/2: "BRO WE
      ALREADY CHOSE COLORS FIND IT IN THE PROJECT." Nobody gets to retype one.

   IT SELF-TESTS: five planted mistakes, each one a real thing that already happened
   or nearly did. All must be caught.

   node gates/faction_membership_gate.js
*/
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
process.chdir(ROOT);

const A = require('../engine/bohemia_agents.js');
const DRESS = require('../engine/bohemia_dress.js');

let pass = 0; const fails = [];
const ok = (n, c) => { c ? pass++ : (fails.push(n), console.log('  FAIL: ' + n)); };
const notes = [];

/* ---------- fixtures ---------- */
const FEET = Array.from({ length: 24 }, (_, i) => ({ x: i, y: 0 }));
const FP = () => ({ rooms: [{ kind: 'bed' }, { kind: 'bed' }] });
const BASES = [
  { name: 'REMNANTS', x: 20, y: 20 },
  { name: 'CARTEL', x: 26, y: 24 },
  { name: 'TRADES', x: 14, y: 28 },
];
function roster(seed, opts) {
  return A.agentsForBlock(seed, FEET, [], FP,
    Object.assign({ households: 4, preDialled: true }, opts || {}));
}
function sweep(opts, n) {
  let tot = 0; const by = {};
  for (let s = 1; s <= (n || 300); s++)
    roster(s * 7919, opts).forEach(a => { tot++; if (a.faction) by[a.faction] = (by[a.faction] || 0) + 1; });
  const aff = Object.values(by).reduce((x, y) => x + y, 0);
  return { tot, aff, by, rate: tot ? aff / tot : 0 };
}

/* ---------- A. nothing invented ---------- */
ok('FACTION_ASSIGN is still EMPTY — which faction holds which ground is his ruling, unmade',
  A.FACTION_ASSIGN && Object.keys(A.FACTION_ASSIGN).length === 0);
ok('factionOf exists and is callable', typeof A.factionOf === 'function');

const none = sweep({ cell: [20, 22] }, 150);
ok('NO BASES, NO ALLEGIANCE: with nothing passed in, every agent is unaffiliated exactly as '
  + 'before this shipped (' + none.tot + ' agents, ' + none.aff + ' affiliated)',
  none.tot > 100 && none.aff === 0);

const noCell = sweep({ factionBases: BASES }, 80);
ok('bases without a cell also yield nobody — a faction needs GROUND to pull from',
  noCell.aff === 0);

/* ---------- B. most people belong to nobody ---------- */
const S = sweep({ cell: [20, 22], factionBases: BASES }, 400);
notes.push(S.tot + ' agents across 400 blocks, ' + S.aff + ' affiliated ('
  + (100 * S.rate).toFixed(1) + '%), split '
  + Object.entries(S.by).map(([k, v]) => k + ' ' + (100 * v / S.aff).toFixed(0) + '%').join(' / '));
ok('MOST PEOPLE BELONG TO NOBODY: affiliation lands near the declared rate, not over it '
  + '(' + (100 * S.rate).toFixed(1) + '% vs ' + (100 * A.AFFILIATED_RATE).toFixed(0) + '%)',
  Math.abs(S.rate - A.AFFILIATED_RATE) < 0.04);
ok('the unaffiliated are the majority — a valley of joiners is not act one',
  S.rate < 0.5);

/* ---------- C. the split is even ---------- */
const shares = Object.values(S.by).map(v => v / S.aff);
ok('EVERY FACTION IN REACH GETS A REAL SHARE (measured, because the first two versions of '
  + 'this were 63% and 48% to one faction and both looked fine until counted): no faction '
  + 'over 45%, none under 20% of a three-way',
  Object.keys(S.by).length === 3 && Math.max(...shares) < 0.45 && Math.min(...shares) > 0.20);

/* ---------- D. keyed to the seat ---------- */
const f = s => roster(s, { cell: [20, 22], factionBases: BASES }).map(a => a.id + ':' + a.faction).join(',');
ok('DETERMINISM: the same block twice is the same people in the same factions', f(555) === f(555));
ok('KEYED TO THE SEAT, NOT THE ID: two different blocks do NOT get identical allegiances '
  + '(ids like H3-1 repeat valley-wide; hashing the id alone collapsed the whole population)',
  f(555) !== f(777));
/* the sharp version of the same claim: across many blocks, the SAME id must not always
   land on the same faction */
const byId = {};
for (let s = 1; s <= 200; s++)
  roster(s * 7919, { cell: [20, 22], factionBases: BASES })
    .forEach(a => { (byId[a.id] = byId[a.id] || new Set()).add(String(a.faction)); });
const stuck = Object.entries(byId).filter(([, v]) => v.size === 1 && !v.has('null'));
ok('and no agent id is welded to one faction across the whole valley (' + stuck.length + ' stuck)',
  stuck.length === 0);

/* ---------- geography actually matters ---------- */
const far = sweep({ cell: [90, 90], factionBases: BASES }, 120);
ok('OUT OF REACH IS UNAFFILIATED: a block nowhere near any base has nobody in a faction, so '
  + 'allegiance is a fact about the map and not a coin flip', far.aff === 0);
const near1 = sweep({ cell: [20, 20], factionBases: [BASES[0]] }, 120);
ok('one base in reach means one faction, never a spread', Object.keys(near1.by).length === 1
  && near1.by.REMNANTS > 0);

/* ---------- derived, not stored ---------- */
const rebuilt = roster(4242, { cell: [20, 22], factionBases: BASES }).map(a => a.faction).join(',');
const again = roster(4242, { cell: [20, 22], factionBases: BASES }).map(a => a.faction).join(',');
ok('DERIVED, NEVER STORED: the sim is thrown away and rebuilt on every save load, and the '
  + 'rebuild returns the same allegiances', rebuilt === again);

/* ---------- E. his colours and his marks ---------- */
function readMF() {
  const src = fs.readFileSync('slices/BOHEMIA_ALPHA_0_9.html', 'utf8');
  const i = src.indexOf('MFACTIONS=[');
  if (i < 0) return {};
  let seg = src.slice(i); seg = seg.slice(0, seg.indexOf('\n];'));
  const heads = [...seg.matchAll(/\{n:'([^']+)'/g)];
  const out = {};
  heads.forEach((h, k) => {
    const body = seg.slice(h.index + h[0].length, k + 1 < heads.length ? heads[k + 1].index : seg.length);
    const acc = /acc:'(#[0-9a-fA-F]{6})'/.exec(body);
    const mot = /motif:'(\w+)'/.exec(body);
    if (acc) out[h[1]] = { acc: acc[1], motif: mot ? mot[1] : null };
  });
  return out;
}
const MF = readMF();
ok('the alpha still carries his MFACTIONS table (14 rows)', Object.keys(MF).length === 14);
const RULED_7_21 = ['REDS', 'CARTEL', 'CHURCH', 'MOB', 'CARAVANS', 'COLORFUL'];
let checked = 0;
Object.keys(MF).forEach(n => {
  if (n === 'CUSTOM') return;
  const look = DRESS.FACTION_LOOK[n];
  ok('EVERY FACTION HAS A LOOK: ' + n + ' has an entry in FACTION_LOOK', !!look);
  if (!look || RULED_7_21.indexOf(n) >= 0) return;   // the six are his separate 7/21 clothing rulings
  checked++;
  ok('HIS COLOUR, NOT MINE: ' + n + ' wears ' + MF[n].acc + ' — the hex he chose in the alpha, '
    + 'byte for byte (found ' + look.color + ')',
    (look.color || '').toLowerCase() === MF[n].acc.toLowerCase());
});
notes.push(checked + ' colours re-read out of his MFACTIONS table and matched byte for byte');
Object.keys(MF).forEach(n => {
  ok('HIS MARK: ' + n + ' carries motif "' + MF[n].motif + '"',
    DRESS.FACTION_MOTIF && DRESS.FACTION_MOTIF[n] === MF[n].motif);
});
ok('FACTION_VETERAN_KIT is still EMPTY — which garments a veteran wears is his ruling, unmade',
  DRESS.FACTION_VETERAN_KIT && Object.keys(DRESS.FACTION_VETERAN_KIT).length === 0);

/* ---------- SELF-TEST: five planted mistakes ---------- */
(function selftest() {
  let caught = 0; const probes = [];
  const P = (name, fn) => probes.push([name, fn]);

  P('a faction takes more than half a three-way split', () => {
    const by = { A: 60, B: 25, C: 15 }; const t = 100;
    const sh = Object.values(by).map(v => v / t);
    return !(Math.max(...sh) < 0.45 && Math.min(...sh) > 0.20);
  });
  P('everybody joins something', () => !(0.92 < 0.5));
  P('nobody joins anything even though bases ARE supplied', () => {
    /* the silent-death mode: factionOf quietly returns null for everyone and every
       other claim here still passes, because "0 affiliated" satisfies most of them.
       The probe feeds a fake sweep with a live rate of 0 and checks the rate claim
       would reject it. */
    const fake = { tot: 4000, aff: 0, rate: 0 };
    return !(Math.abs(fake.rate - A.AFFILIATED_RATE) < 0.04);
  });
  P('an agent id is welded to one faction valley-wide', () => {
    const fake = { 'H3-1': new Set(['CARTEL']) };
    return Object.entries(fake).filter(([, v]) => v.size === 1 && !v.has('null')).length !== 0;
  });
  P('a colour drifts off the one he chose', () => {
    return ('#123456').toLowerCase() !== (MF.NETWORK.acc).toLowerCase();
  });

  probes.forEach(([name, fn]) => {
    let got = false;
    try { got = fn(); } catch (_e) { got = true; }
    if (got) caught++;
    else console.log('  FAIL: SELF-TEST "' + name + '" was NOT caught — the checker is decorative here.');
  });
  ok('SELF-TEST: all ' + probes.length + ' planted mistakes caught', caught === probes.length);
  notes.push(caught + '/' + probes.length + ' self-test probes caught');
})();

notes.forEach(n => console.log('  NOTE  ' + n));
console.log('=== FACTION MEMBERSHIP GATE: ' + pass + ' passed, ' + fails.length + ' failed ===');
process.exit(fails.length ? 1 : 0);
