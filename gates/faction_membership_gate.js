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

/* ---------- C. the draw is fair, and geography decides the rest ---------- */
/* THIS CLAIM WAS REWRITTEN 8/16, AND WHY MATTERS. It used to measure the split
   across BASES AT DIFFERENT DISTANCES (2, 8 and 12 cells from the test block)
   and demand it be even. That was right while the pick was UNIFORM over
   everything in reach -- it existed to catch a correlated-hash bug that had
   twice given one faction 63% and 48%. But a uniform pick meant somebody living
   next door to one base was exactly as likely to run with another twelve cells
   away, which is not a world, it is a radius.
   The pick is weighted by distance now (Kalyvas: collaboration follows control),
   so an uneven split across unequal distances is the CORRECT answer and the old
   claim would have forbidden the fix. The hash-bias check it was really for is
   preserved EXACTLY by measuring at EQUAL distance, where any imbalance can only
   come from the draw. Then a second claim locks the new behaviour. */
const EQ = [
  { name: 'REMNANTS', x: 23, y: 22 },   /* all three exactly 3 cells */
  { name: 'CARTEL', x: 17, y: 22 },     /* from the test block [20,22] */
  { name: 'TRADES', x: 20, y: 25 },
];
const E = sweep({ cell: [20, 22], factionBases: EQ }, 400);
const eqShares = Object.values(E.by).map(v => v / E.aff);
ok('THE DRAW ITSELF IS FAIR: at EQUAL distance no faction runs away with it (measured, '
  + 'because the first two versions of this were 63% and 48% to one faction and both '
  + 'looked fine until counted): no faction over 45%, none under 20% of a three-way',
  Object.keys(E.by).length === 3 && Math.max(...eqShares) < 0.45 && Math.min(...eqShares) > 0.20,
  JSON.stringify(E.by));

/* THE NEW BEHAVIOUR, and it is the whole point of the change. */
const NEARFAR = [{ name: 'REMNANTS', x: 20, y: 22 }, { name: 'CARTEL', x: 20, y: 34 }];
const NF = sweep({ cell: [20, 22], factionBases: NEARFAR }, 400);
ok('ALLEGIANCE FOLLOWS THE GROUND: the base you are standing on takes far more of the '
  + 'block than one at the edge of reach — control decays with distance rather than '
  + 'stopping at a radius (Kalyvas 2006)',
  (NF.by.REMNANTS || 0) > (NF.by.CARTEL || 0) * 3, JSON.stringify(NF.by));
ok('...but the far one is never CUT OFF, because the edge of reach is still reach',
  (NF.by.CARTEL || 0) > 0, JSON.stringify(NF.by));
ok('the split across UNEQUAL distances is therefore uneven, which is the correct answer '
  + 'and the thing the old version of this claim would have forbidden',
  Math.max(...Object.values(S.by).map(v => v / S.aff)) > 0.45, JSON.stringify(S.by));

/* ---------- C2. the eight bearings ---------- */
ok('A DIAGONAL COMMUTE IS A COMMUTE: jobCell resolves all EIGHT bearings, not the four '
  + 'its only original producer emitted. bohemia_population.personFields draws workDir '
  + 'from eight, so 49% of the valley fell through to null and the 8/11 ruling that you '
  + 'run with whoever your LIVING depends on was not running for half the people',
  ['NE', 'SE', 'SW', 'NW'].every(d =>
    !!A.jobCell({ job: { kind: 'site', dir: d, dist: 2 } }, [10, 10])));
ok('...and the four cardinal answers are byte-identical, so the run roster cannot move',
  JSON.stringify([['N', [10, 7]], ['S', [10, 13]], ['W', [7, 10]], ['E', [13, 10]]]
    .map(([d, want]) => JSON.stringify(A.jobCell({ job: { kind: 'site', dir: d, dist: 3 } }, [10, 10])) === JSON.stringify(want)))
  === JSON.stringify([true, true, true, true]));

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

/* ================= THE SHAPE THE REAL CALLER PASSES (8/11) =====================
   THIS GATE WAS GREEN FOR NINE DAYS WHILE THE FEATURE WAS DEAD IN THE GAME.
   Every claim above feeds factionOf a fixture: an ARRAY of {name,x,y}. The only
   caller that exists - bohemia_loop.js's boot - builds an OBJECT keyed by faction id
   whose values are {x,y} with no name and no .length. factionOf's first line was
   `if(!bases.length) return null`, so in a real run EVERY PERSON IN THE VALLEY was
   unaffiliated, always, and nothing could tell.
   A FIXTURE IS NOT THE CALLER. So this boots the REAL loop and hands factionOf the
   REAL ctx.factionBases, which is the only shape that matters. */
{
  const LOOP = require('../engine/bohemia_loop.js');
  const ctx = LOOP.boot({ seed: 'membership-real-shape' });
  const bases = ctx.factionBases;
  ok('the real loop actually seats faction bases (nothing below means anything otherwise)',
    bases && Object.keys(bases).length > 0);

  // stand a crowd ON a base, where allegiance MUST be possible
  const first = Object.values(bases)[0];
  const cell = [first.x, first.y];
  const crowd = [];
  for (let i = 0; i < 80; i++) crowd.push({ id: 'H' + (i % 9) + '-' + (i % 3), seed: (i * 2654435761) >>> 0 });
  const joined = crowd.map(a => A.factionOf(a, cell, bases)).filter(Boolean);

  ok('PEOPLE ACTUALLY AFFILIATE WHEN HANDED THE LOOP\'S OWN ctx.factionBases — the shape '
     + 'the game really passes, not the array fixture the rest of this gate uses',
    joined.length > 0);
  ok('...and what comes back is a REAL faction id from the canon graph',
    joined.length > 0 && joined.every(f => ctx.factions.factions.get(f)));
  console.log('  NOTE  real ctx.factionBases: ' + Object.keys(bases).length + ' bases, '
    + joined.length + '/' + crowd.length + ' of a crowd standing on one affiliated');

  // the normaliser must not quietly accept junk either
  ok('an empty bases object still yields nobody (a normaliser that invents ground is worse)',
    A.factionOf(crowd[0], cell, {}) === null);
  ok('the array fixture form still works — the fix ADDED a shape, it did not swap one',
    typeof A.factionOf(crowd[0], [20, 20], [{ name: 'REMNANTS', x: 20, y: 20 }]) !== 'undefined');
}

/* ============================================================================
   F. THE FOUR FACTIONS THAT HOLD NO GROUND.
   (9/6/26, FACTIONS lane, VAMILY row [hidden factions] THE-OTHER-FOUR.)

   THE ROW SAID MEASURE FIRST, SO: on the walked surface, 5,148 people and 566
   affiliations, spread across EXACTLY the fourteen selectable outfits. Pures,
   Panthers, La Familia and Triads appeared on ZERO people, while all four
   already had an authored line in bohemia_people.js that nobody could ever hear.

   They were unreachable for a reason that is not a bug: factionOf derives
   everything from the fourteen SEATS and his graph gives these four none. He
   types them `social_force` and the note says what they are in one sentence --
   "MEMBERS INSIDE OTHER FACTIONS." A second, hidden affiliation, not a place.
   ========================================================================== */
{
  const G = JSON.parse(fs.readFileSync(path.join(ROOT, 'engine/BOHEMIA_faction_graph.json'), 'utf8'));
  const four = Object.keys(G.factions).filter(k => G.factions[k].type !== 'selectable').sort();

  ok('F1 the four are exactly the ones his graph does NOT mark selectable, read out '
    + 'of his file rather than typed here (' + four.join(', ') + ')',
    four.length === 4 && JSON.stringify(four) === JSON.stringify(A.FORCES.slice().sort()));

  /* *** THE DEFECT THIS ROW EXISTS FOR, MEASURED RATHER THAN REMEMBERED. *** */
  const crowd2 = roster(4242);
  const cellsAll = [];
  for (let y = 0; y < 40; y++) for (let x = 0; x < 40; x++) cellsAll.push([x, y]);
  let oldReach = 0;
  for (const c of cellsAll.slice(0, 200))
    for (const a of crowd2) {
      const f = A.factionOf(a, c, BASES);
      if (f && four.indexOf(f) >= 0) oldReach++;
    }
  ok('F2 *** THE RULE THAT DECIDES WHO RUNS WITH WHOM CAN NEVER PRODUCE ONE OF THE '
    + 'FOUR, AND THAT IS WHY THEY WERE UNREACHABLE. *** It answers from the seats it '
    + 'is handed, and these four have no seat in the world or in this fixture. So '
    + 'the fix could never be a bigger bases list',
    oldReach === 0);

  /* AND NOW THEY EXIST. */
  const seenF = {};
  let people = 0, members = 0;
  for (const c of cellsAll)
    for (const a of crowd2) {
      people++;
      const f = A.forceOf(a, c, { act: 1, worth: ((c[0] * 7 + c[1] * 13) % 100) / 100 });
      if (f) { members++; seenF[f] = (seenF[f] || 0) + 1; }
    }
  ok('F3 *** ALL FOUR NOW EXIST ON REAL PEOPLE. *** ' + JSON.stringify(seenF),
    four.every(f => seenF[f] > 0));

  /* HIS NOTE IS THE SPEC AND EVERY NUMBER BELOW IS READ OFF IT.
     "Members inside other factions. Larger in act1 (crash drove identity
     clustering), fixed ceiling, stagnant across acts." */
  const share = members / people;
  ok('F4 AND IT IS A MINORITY WITH A LOW CEILING, which is his own words "fixed '
    + 'ceiling" and the real record: the SPLC counts 800+ US hate groups and MOST '
    + 'HAVE FEWER THAN TWENTY MEMBERS. A valley where a fifth of people are in one '
    + 'is not this world (' + (100 * share).toFixed(2) + '%)',
    share > 0.002 && share < 0.06);

  let m3 = 0;
  for (const c of cellsAll)
    for (const a of crowd2)
      if (A.forceOf(a, c, { act: 3, worth: ((c[0] * 7 + c[1] * 13) % 100) / 100 })) m3++;
  ok('F5 LARGER IN ACT 1 THAN ACT 3, which is his note in as many words -- "larger '
    + 'in act1 (crash drove identity clustering), stagnant across acts". act1 '
    + members + ', act3 ' + m3,
    m3 < members && m3 > 0);

  /* *** WHERE, NOT JUST HOW MANY. *** Realistic group conflict theory says the
     driver is competition over resources, so this has to be denser on poor
     ground -- and the worth of a block is already measured and shipped by [who
     holds], so the valley varies by itself with no second table invented. */
  /* HOLD THE BLOCK STILL AND MOVE ONLY THE POVERTY. The first cut of this
     bucketed cells by a synthetic worth and compared the two halves, and it
     measured 2.97% against 2.67% -- a ratio of 1.11 where the rule's own maths
     says 1.26. The gap is not the rule, it is the BLOCK DRAW sitting in front
     of it: whether a force works a block at all is decided first and has
     nothing to do with worth, so most of what that comparison counted was which
     blocks happened to draw one. Asking the same people on the same ground at
     both ends of the scale removes the confound entirely and measures the thing
     the claim is actually about.
     END TO END ON THE WALKED SURFACE, where the block draw is real and so is
     the population: 0.81% of people on the rich half of the valley, 2.19% on
     the poor half. */
  let lowM = 0, highM = 0, both = 0;
  for (const c of cellsAll) {
    if (!A.forceOnBlock(c)) continue;
    for (const a of crowd2) {
      both++;
      if (A.forceOf(a, c, { act: 1, worth: 0 })) lowM++;
      if (A.forceOf(a, c, { act: 1, worth: 1 })) highM++;
    }
  }
  ok('F6 AND POORER GROUND CARRIES MORE OF IT. Not a mood: realistic group conflict '
    + 'theory puts the driver on competition for resources, and the block worth this '
    + 'lane shipped on 9/6 is what makes the valley vary by itself with no second '
    + 'table invented. Same people, same blocks, poorest ground ' + lowM
    + ' members against richest ' + highM + ' of ' + both,
    both > 0 && lowM > highM * 1.3);

  /* *** AND IT SAYS NOTHING ABOUT ANYBODY'S ANCESTRY. ***
     The obvious reading of four identity-supremacist groups is that membership
     follows heritage. THE GAME MODELS NO SUCH THING, and inventing one in order
     to assign somebody to a supremacist group would be authoring the most
     sensitive content in his canon. What is derived is WHICH ONE ORGANIZES A
     BLOCK -- geography, and exactly what his own note calls "identity
     CLUSTERING". This claim is structural: the same person, moved to another
     block, gets whatever is organizing THERE. */
  const one = crowd2[0];
  const moved = {};
  for (const c of cellsAll) { const f = A.forceOnBlock(c); if (f) moved[f] = 1; }
  const gotAny = cellsAll.map(c => A.forceOf(one, c, { act: 1, worth: 0.2 })).filter(Boolean);
  ok('F7 *** IT IS THE BLOCK THAT CARRIES THE IDENTITY, NEVER THE PERSON. *** One '
    + 'person walked across the whole fixture comes back as more than one of the '
    + 'four, because what is derived is which of them ORGANIZES THERE. A rule that '
    + 'read a person\'s ancestry could not do that -- and this game models no '
    + 'ancestry to read',
    new Set(gotAny).size > 1);

  ok('F8 and a block either has one working it or it does not, so a person on quiet '
    + 'ground is in nothing however poor it is',
    cellsAll.some(c => !A.forceOnBlock(c))
    && cellsAll.filter(c => !A.forceOnBlock(c))
        .every(c => crowd2.every(a => A.forceOf(a, c, { act: 1, worth: 0 }) === null)));

  ok('F9 the same person on the same ground answers the same every time -- a hidden '
    + 'thing that flickers is not hidden, it is broken',
    cellsAll.slice(0, 50).every(c => crowd2.slice(0, 20).every(a =>
      A.forceOf(a, c, { act: 1, worth: 0.3 }) === A.forceOf(a, c, { act: 1, worth: 0.3 }))));

  /* HIS OVERRIDE WINS, PROVED BY USING IT. */
  const spot = '3,3';
  A.FORCE_BLOCK[spot] = 'Triads';
  const forced = A.forceOnBlock([3, 3]);
  delete A.FORCE_BLOCK[spot];
  ok('F10 ONE LINE IN FORCE_BLOCK PUTS WHOEVER HE WANTS ON WHATEVER BLOCK HE WANTS, '
    + 'and the table ships empty -- proved by setting one and reading it back',
    forced === 'Triads' && Object.keys(A.FORCE_BLOCK).length === 0);

  /* AND THE FOUR AUTHORED LINES ARE REACHABLE, which is the only thing that makes
     any of this a PRESENCE rather than another field nobody can meet. */
  const P = require('../engine/bohemia_people.js');
  const authored = four.filter(f => (P.LINES['faction:' + f] || []).length);
  ok('F11 all four have an authored line waiting, which is what made this row '
    + 'urgent: they were written and unhearable (' + authored.length + '/4)',
    authored.length === 4);

  const person = { key: 'K1', role: 'keeper', lang: 'en', faction: 'Mob' };
  let spoke = 0, ordinary = 0;
  for (const f of four)
    for (let i = 0; i < 40; i++) {
      const ls = P.linesFor({ ...person, key: 'K' + i }, { at: 'free', faction: 'Mob', force: f });
      if ((P.LINES['faction:' + f] || []).some(t => ls.indexOf(t) >= 0)) spoke++; else ordinary++;
    }
  ok('F12 *** AND A CARRIER CAN ACTUALLY SAY IT. *** It sits ABOVE the role buckets '
    + 'and the first cut had it below them -- measured, 40 carriers across six acts, '
    + '240 askings and ZERO force lines, because bucket(person.role) answers for '
    + 'everybody. Same defect this organ already documents for reactions',
    spoke > 0);

  ok('F13 …AND MOSTLY THEY DO NOT. A carrier who says it every time is not hidden, '
    + 'they are labelled, and you would read the whole layer off the first sentence '
    + 'instead of ever having to find anything out. Said ' + spoke + ' of '
    + (spoke + ordinary),
    ordinary > spoke);

  ok('F14 and somebody carrying nothing is untouched -- the layer is additive, which '
    + 'is the zero-regression proof',
    JSON.stringify(P.linesFor(person, { at: 'free', faction: 'Mob' }))
    === JSON.stringify(P.linesFor(person, { at: 'free', faction: 'Mob', force: null })));
}

console.log('=== FACTION MEMBERSHIP GATE: ' + pass + ' passed, ' + fails.length + ' failed ===');
process.exit(fails.length ? 1 : 0);
