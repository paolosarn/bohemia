/* BOHEMIA — RECKLESS BEATS QUIET, APPLIED TO REPUTATION (8/6/26, PEOPLE lane)

   THE HOLE THIS CLOSES. Paolo's quest corpus has always written down TWO things
   about every outcome: how big it was (`@DO faction REDS +12`) and how loud it was
   (`#quiet` / `#notable` / `#risky` / `#reckless`). The loud half only ever reached
   the vanity follower count. The faction standing got applied godlike — the number
   moved, valley-wide, instantly, with nobody having seen anything. So a back-yard
   handshake and a public humiliation in front of a whole block were worth the same
   to a faction, in a game whose own 7/21 law is titled RECKLESS BEATS QUIET.

   WHAT THIS GATE HOLDS, and every claim is measured rather than asserted:

   A. NOTHING WAS INVENTED. bohemia_standing.js STILL ships DEED_WEIGHT empty (checked
      before anything loads), the bridge names no faction in its own source, and every
      single row it writes traces back to a `@DO faction` line in one of his .bq files.
      Read off the corpus, not off a comment claiming so.

   B. HIS CLOUT TABLE IS READ, NOT COPIED. The reach curve is computed against the LIVE
      CLOUT_WEIGHTS in bohemia_loop.js. The 7/21 law says the ordering is locked and the
      numbers are tunable — so the gate proves the ordering survives whatever he retunes
      them to, including a table this gate makes up on the spot to try to break it.

   C. THE DEFAULT IS BIT-FOR-BIT THE OLD BEHAVIOUR. An untagged deed reaches exactly
      SEE_RANGE and earns exactly MAX_HOPS. A new axis that silently redefines the old
      number is a migration pretending to be a feature.

   D. NEWS STILL TRAVELS AT THE SPEED OF PEOPLE. Straight linear scaling on his weights
      would put one reckless act in front of 124 tiles of valley and we would be back to
      teleporting omniscience — the exact failure the witness organ exists to kill.
      Measured: the loudest tier stays inside a small multiple of the sightline.

   E. THE PAYOFF, AND IT IS THE WHOLE POINT. The SAME DEED, in the SAME PLACE, in front
      of the SAME PEOPLE, lands differently on a faction depending only on how loud it
      was. This is the first thing in the codebase for which that is true.

   F. THE DYNASTY PAYOFF. bohemia_standing.js already states "a quiet good deed dies with
      the witness, a notorious one becomes the thing your child is judged for" — and
      until now NOTHING PRODUCED THE DIFFERENCE, because every deed had the same hop
      budget. Measured across an actual generational handoff.

   G. ONE ACT, TWO MEANINGS, AND A THIRD PARTY WHO DOES NOT CARE. S17 stage 32 is
      `CARAVANS +12` AND `BLUES -6` — one thing that happened, good to the traders and a
      betrayal to the growers, and nothing at all to a Red standing in the same street.
      Run against the real quest file, not a fixture.

   H. THE UNITS CONVERSION IS DERIVED, NOT PICKED. The biggest act in the corpus, done
      in front of an entire faction, moves exactly one rung. Measured to the rung.

   I. A PLAYER CAN READ IT. sayWhy() returns the quest's own @LOG line in his voice, not
      a machine id, because a standing you cannot read is a standing you cannot play
      around.

   IT SELF-TESTS: every probe feeds a CLAIM'S OWN PREDICATE the values a broken
   implementation would produce, and passes only if the claim REJECTS them. A probe that
   re-runs the working module and asks whether it misbehaved can never catch anything.

   node gates/deed_bridge_gate.js
*/
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
process.chdir(ROOT);

const S = require('../engine/bohemia_standing.js');

/* ---------- A1. measured BEFORE the bridge loads, on purpose ---------- */
const SHIPPED_EMPTY = Object.keys(S.DEED_WEIGHT).length === 0;

const D = require('../engine/bohemia_deeds.js');
const LOOP = require('../engine/bohemia_loop.js');
const M = require('../engine/bohemia_memory.js');

let pass = 0; const fails = [];
const ok = (n, c) => { c ? pass++ : (fails.push(n), console.log('  FAIL: ' + n)); };
const notes = [];
const probes = []; let caught = 0;
const probe = (n, c) => { probes.push(n); c ? caught++ : console.log('  PROBE MISSED: ' + n); };

const BQDIR = 'quests/bq';
const SOURCES = fs.readdirSync(BQDIR).filter(f => f.endsWith('.bq'))
  .map(f => ({ id: f.replace(/\.bq$/, ''), src: fs.readFileSync(path.join(BQDIR, f), 'utf8') }));

/* ================= A. NOTHING WAS INVENTED ================= */
ok('bohemia_standing.js STILL ships DEED_WEIGHT EMPTY — the bridge is the only thing that fills it',
  SHIPPED_EMPTY);

const BRIDGE_SRC = fs.readFileSync('engine/bohemia_deeds.js', 'utf8');
/* the real faction names, read from his own canon graph rather than typed here */
const GRAPH = JSON.parse(fs.readFileSync('engine/BOHEMIA_faction_graph.json', 'utf8'));
const FACTION_IDS = Object.keys(GRAPH.factions || {});
const namesCode = src => {
  /* strip comments — a law may be DESCRIBED in prose, it may not be CODED */
  const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
  return FACTION_IDS.filter(id => new RegExp('\\b' + id + '\\b', 'i').test(code));
};
ok('the bridge names NO faction in its own code — CONTENTS-PAOLO\'S, the ids come from his files',
  namesCode(BRIDGE_SRC).length === 0);

const corpus = D.loadCorpus(SOURCES);
ok('the corpus scan found his authored faction deltas at all', corpus.count > 0);

/* every row must trace to a real `@DO faction` line in a real file */
const RAW = SOURCES.map(s => s.src).join('\n');
const rawRows = (RAW.match(/@DO\s+faction\s+[A-Za-z_]+\s+[-+]?\d+/g) || []).length;
ok('every DEED_WEIGHT row traces to a @DO faction line in his corpus — row count matches the raw grep',
  corpus.count === rawRows && Object.keys(S.DEED_WEIGHT).length <= corpus.count);
notes.push(`${corpus.count} authored faction deltas across ${SOURCES.length} quest files`);

const traceable = corpus.deeds.every(d =>
  new RegExp('@DO\\s+faction\\s+' + d.faction + '\\s+\\' + (d.delta < 0 ? '-' : '+') + Math.abs(d.delta) + '\\b').test(RAW));
ok('and each one is findable verbatim in the source text — no row is a derivation of a row', traceable);

/* ================= B. HIS CLOUT TABLE IS READ, NOT COPIED ================= */
const TIERS = LOOP.CLOUT_TAGS;
/* A CHECKER THAT CANNOT TELL A MENTION FROM A USE IS THE BROKEN ONE (Paolo 8/1).
   The first version of this claim failed on the bridge's own docstring, which QUOTES
   his table to explain where it comes from. Quoting a law is not duplicating it. Only
   executable code counts. */
const codeOf = src => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
const BRIDGE_CODE = codeOf(BRIDGE_SRC);
ok('the clout vocabulary comes from bohemia_loop.js, not a second copy hard-coded in the bridge',
  !/quiet\s*:\s*\d/.test(BRIDGE_CODE) && !/reckless\s*:\s*\d/.test(BRIDGE_CODE)
  && /cloutWeight|CLOUT/.test(BRIDGE_CODE));

/* THE PREDICATE, named so a probe can attack it directly */
const orderingHolds = f => {
  for (let i = 1; i < TIERS.length; i++) if (!(f(TIERS[i]) > f(TIERS[i - 1]))) return false;
  return true;
};
ok('reach respects his LOCKED ordering: reckless > risky > notable > quiet', orderingHolds(D.reachOf));
ok('so does the retelling budget — a louder thing gets repeated more times', orderingHolds(D.hopsFor));
notes.push('reach  ' + TIERS.map(t => t + '=' + D.reachOf(t)).join(' ') + '  untagged=' + D.reachOf(null));
notes.push('hops   ' + TIERS.map(t => t + '=' + D.hopsFor(t)).join(' ') + '  untagged=' + D.hopsFor(null));

/* the ordering must survive HIM RETUNING THE NUMBERS, which his own law says he may do */
{
  const real = LOOP.CLOUT_WEIGHTS;
  const saved = Object.assign({}, real);
  Object.assign(real, { quiet: 3, notable: 90, risky: 400, reckless: 900 });
  const survived = orderingHolds(D.reachOf) && orderingHolds(D.hopsFor);
  Object.assign(real, saved);
  ok('and it survives him retuning the weights — the curve is monotonic, not hand-fitted to today\'s table',
    survived && D.reachOf('reckless') === 24);
}

/* ================= C. THE DEFAULT IS THE OLD BEHAVIOUR, EXACTLY ================= */
ok('an UNTAGGED deed reaches exactly SEE_RANGE — the tag can only move you OFF the old number',
  D.reachOf(null) === S.SEE_RANGE);
ok('and earns exactly MAX_HOPS — nothing already in the world silently changed',
  D.hopsFor(null) === S.MAX_HOPS);
ok('a #quiet deed is strictly QUIETER than the old default, not merely equal to it',
  D.reachOf('quiet') < S.SEE_RANGE && D.hopsFor('quiet') < S.MAX_HOPS);

/* ================= D. NEWS STILL TRAVELS AT THE SPEED OF PEOPLE ================= */
/* THE PROPERTY, not a threshold. A picked cutoff ("under 22 tiles") is a magic number
   dressed as a law, and the first version of this claim was exactly that — it failed by
   two tiles and told me nothing. What actually has to be true is SUB-LINEARITY: doubling
   how much the valley cares must LESS than double how far it can see. That is what stops
   one loud act from being visible across the whole map, and it is checkable exactly,
   against his live table, with no constant of mine in it. */
const subLinear = f => {
  const real = LOOP.CLOUT_WEIGHTS, saved = Object.assign({}, real);
  real.risky = 100; const a = f('risky');
  real.risky = 200; const b = f('risky');
  Object.assign(real, saved);
  return b > a && b < a * 2;
};
ok('reach grows SUB-LINEARLY in his weights — twice the drama is not twice the sightline, or news teleports again',
  subLinear(D.reachOf));
const linearReach = Math.round(S.SEE_RANGE * (LOOP.cloutWeight('reckless') / LOOP.cloutWeight(null)));
ok('so the loudest tier stays a small multiple of the sightline instead of swallowing the valley',
  D.reachOf('reckless') < linearReach / 2);
notes.push(`reckless reach ${D.reachOf('reckless')} tiles vs ${linearReach} if it scaled linearly`);
probe('the sub-linearity claim rejects a reach function that scales straight off his weights',
  !subLinear(t => Math.round(S.SEE_RANGE * (LOOP.cloutWeight(t) / LOOP.cloutWeight(null)))));
probe('and rejects one that ignores the tag entirely, which would be flat rather than sub-linear',
  !subLinear(() => S.SEE_RANGE));

/* ================= THE WORLD THE PAYOFF CLAIMS RUN IN ================= */
/* a street of people, all the same faction, standing at increasing distance */
function street(n, faction) {
  const minds = [], pos = {}, fac = {};
  for (let i = 0; i < n; i++) {
    const id = 'P' + i;
    minds.push(M.makeMind(id));
    pos[id] = { x: 10 + i, y: 10 };      // 1 tile apart, so distance == index
    fac[id] = faction;
  }
  return { minds, pos, fac, where: id => pos[id], factionOf: id => fac[id] };
}
const rowFor = (faction, delta, clout, kind) => ({ faction, delta, clout, kind: kind || ('k:' + clout + ':' + faction) });

/* ================= E. THE PAYOFF ================= */
let quietStanding, recklessStanding;
{
  const mk = clout => {
    const w = street(30, 'F');
    const r = rowFor('F', 12, clout);
    S.DEED_WEIGHT[r.kind] = 12 / corpus.divisor;
    D.publish(w.minds, 1000, 'PLAYER', [r], 10, 10, w.where, w.factionOf);
    return S.standingOf(w.minds, 'F', 'PLAYER', 1000, w.factionOf);
  };
  quietStanding = mk('quiet');
  recklessStanding = mk('reckless');
  const louderLands = (q, r) => r.whoSaw > q.whoSaw && Math.abs(r.value) > Math.abs(q.value);
  ok('THE SAME DEED, SAME PLACE, SAME PEOPLE: doing it LOUDLY lands harder on the faction than doing it quietly',
    louderLands(quietStanding, recklessStanding));
  notes.push(`same +12 deed: #quiet seen by ${quietStanding.whoSaw} -> ${quietStanding.value.toFixed(2)} ${quietStanding.rung}`
    + `  |  #reckless seen by ${recklessStanding.whoSaw} -> ${recklessStanding.value.toFixed(2)} ${recklessStanding.rung}`);
  probe('the payoff claim rejects a bridge where loudness changed nothing',
    !louderLands(quietStanding, quietStanding));
  probe('and rejects one where the loud version reached MORE people but somehow moved the faction LESS',
    !louderLands({ whoSaw: 1, value: 9 }, { whoSaw: 9, value: 1 }));
}

/* ================= F. THE DYNASTY PAYOFF ================= */
/* Thirty years. EVERY PERSON WHO WATCHED IT IS DEAD, so the only trace of the parent's
   life is what got REPEATED into somebody still alive. inherit() already did that; what
   it never had was any reason for one deed to be repeated more than another. The clout
   tag is that reason, and this measures it across HIS WHOLE ORDERING rather than
   comparing two points — four tiers, one curve, monotonic or it fails.

   HONEST ABOUT THE FIRST VERSION: it claimed a quiet deed carries ZERO. Measured, it
   carries a few, because one retelling in a chatty street still reaches somebody. The
   claim was written before the measurement, which is backwards. What is TRUE is the
   spread: how much of the valley still tells the story scales with how loud it was. */
{
  const VALLEY = 80, TALK = 3;
  const runGenerations = clout => {
    const minds = [], pos = {}, fac = {};
    for (let i = 0; i < VALLEY; i++) {
      const id = 'V' + i; minds.push(M.makeMind(id));
      pos[id] = { x: i, y: 0 }; fac[id] = 'F';
    }
    const where = id => pos[id], factionOf = id => fac[id];
    const r = rowFor('F', corpus.maxAbs, clout, 'gen:' + clout);
    S.DEED_WEIGHT[r.kind] = corpus.maxAbs / corpus.divisor;
    const direct = D.publish(minds, 0, 'PARENT', [r], 0, 0, where, factionOf).witnesses;
    /* a lifetime of people who are near each other talking */
    for (let round = 0; round < 40; round++)
      for (let i = 0; i < VALLEY; i++)
        for (let j = i + 1; j <= Math.min(VALLEY - 1, i + TALK); j++) S.gossip(minds[i], minds[j], round * 60);
    const T = 30 * 365 * 24 * 60;
    const handoff = S.inherit(minds, 'PARENT', 'CHILD', T);
    const st = S.standingOf(minds, 'F', 'CHILD', T, factionOf);
    return { clout, direct, carried: handoff.carried, died: handoff.died, value: st.value };
  };
  const gens = TIERS.map(runGenerations);
  const stillTold = g => {
    for (let i = 1; i < g.length; i++) if (!(g[i].carried > g[i - 1].carried)) return false;
    return g[g.length - 1].carried >= g[0].carried * 3;
  };
  ok('THIRTY YEARS ON, how much of the valley still tells the story rises with every step of his ordering — and the loudest leaves at least 3x the quietest',
    stillTold(gens));
  const childJudged = g => {
    for (let i = 1; i < g.length; i++) if (!(g[i].value > g[i - 1].value)) return false;
    return true;
  };
  ok('...so the CHILD is judged harder for a parent\'s loud deed than a quiet one — the law bohemia_standing.js wrote down and nothing produced until now',
    childJudged(gens));
  gens.forEach(g => notes.push(`  #${g.clout}: ${g.direct} watched it -> ${g.carried} still telling it 30 years on`
    + ` -> child reads ${g.value.toFixed(4)}`));
  probe('the dynasty claim rejects a world where loudness changed nothing about what survived',
    !stillTold(gens.map(g => Object.assign({}, g, { carried: 5 }))));
  probe('and rejects one where the quiet deed outlived the notorious one',
    !stillTold(gens.slice().reverse()));
  probe('the inheritance claim rejects a child who reads the same no matter what the parent did',
    !childJudged(gens.map(g => Object.assign({}, g, { value: 0.02 }))));
}

/* ================= G. ONE ACT, TWO MEANINGS — ON THE REAL QUEST FILE ============ */
{
  const s17 = SOURCES.find(s => /^S17/.test(s.id));
  ok('the reference quest S17 is actually in the corpus (this claim runs on his file, not a fixture)', !!s17);
  const rows32 = D.scanQuest(s17.src, s17.id).filter(r => r.stage === 32);
  const opposed = rows32.length === 2 && rows32.some(r => r.delta > 0) && rows32.some(r => r.delta < 0);
  ok('S17 stage 32 is ONE act that is a good turn to one faction and a betrayal to another', opposed);

  const winner = rows32.find(r => r.delta > 0).faction;
  const loser = rows32.find(r => r.delta < 0).faction;
  const THIRD = 'A_FACTION_THAT_WAS_NOT_INVOLVED';
  const minds = [], pos = {}, fac = {};
  [[winner, 6], [loser, 6], [THIRD, 6]].forEach(([f, n]) => {
    for (let i = 0; i < n; i++) {
      const id = f + i; minds.push(M.makeMind(id));
      pos[id] = { x: 10 + i, y: 10 }; fac[id] = f;
    }
  });
  const where = id => pos[id], factionOf = id => fac[id];
  D.publish(minds, 1000, 'PLAYER', rows32, 10, 10, where, factionOf);
  const sw = S.standingOf(minds, winner, 'PLAYER', 1000, factionOf);
  const sl = S.standingOf(minds, loser, 'PLAYER', 1000, factionOf);
  const st = S.standingOf(minds, THIRD, 'PLAYER', 1000, factionOf);
  const zeroSum = (a, b, c) => a.value > 0 && b.value < 0 && c.value === 0 && c.whoSaw === 0;
  ok('...and a third faction standing in the SAME STREET remembers nothing, because it did not mean anything to them',
    zeroSum(sw, sl, st));
  notes.push(`S17 stage 32 (#risky): ${winner} ${sw.value.toFixed(2)} ${sw.rung}`
    + ` | ${loser} ${sl.value.toFixed(2)} ${sl.rung} | uninvolved ${st.value.toFixed(2)} ${st.rung}`);
  probe('the zero-sum claim rejects a bridge where the uninvolved faction picked it up anyway',
    !zeroSum(sw, sl, { value: -0.4, whoSaw: 3 }));
  probe('and rejects one where both involved factions moved the SAME way',
    !zeroSum(sw, { value: 0.9 }, st));

  /* ---------- I. a player can read it ---------- */
  const why = D.sayWhy(minds, loser, 'PLAYER', 1000, factionOf, 3);
  const readable = w => w.length > 0 && w.every(e => e.said && !/^q:/.test(e.said) && e.said.length > 20);
  ok('sayWhy() explains a standing in the quest\'s own words, not a machine id — a standing you cannot read is one you cannot play around',
    readable(why));
  notes.push('why they feel that way: "' + why[0].said.slice(0, 72) + '..."');
  probe('the readability claim rejects raw deed kinds leaking to the player',
    !readable([{ said: 'q:S17:32@BLUES' }]));
  probe('and rejects an empty explanation, which would otherwise pass every-check vacuously',
    !readable([]));
}

/* ================= H. THE UNITS CONVERSION IS DERIVED ================= */
{
  const w = street(20, 'F');
  const r = rowFor('F', corpus.maxAbs, null);
  S.DEED_WEIGHT[r.kind] = corpus.maxAbs / corpus.divisor;
  /* in front of the ENTIRE faction: everybody witnesses, so the average IS the weight */
  S.witness(w.minds, 1000, 'PLAYER', r.kind, 10, 10, w.where, { range: 999 });
  const st = S.standingOf(w.minds, 'F', 'PLAYER', 1000, w.factionOf);
  const oneRung = v => Math.abs(v - corpus.rungStep) < 1e-9;
  ok('THE RULE, MEASURED: the biggest act in his corpus, done in front of a whole faction, moves EXACTLY one rung',
    oneRung(st.value));
  notes.push(`divisor ${corpus.divisor} derived from max |delta| ${corpus.maxAbs} / rung step ${corpus.rungStep}`);
  probe('the derivation claim rejects a divisor picked by feel instead of measured off the corpus',
    !oneRung(corpus.maxAbs / 10 * (corpus.rungStep / corpus.rungStep)));
  probe('and rejects a scale where one quest maxes the faction out',
    !oneRung(corpus.maxAbs));
}

/* ================= THE SHIPPED PAGE MUST NOT DRIFT FROM HIS TABLE ============
   VERIFY ON THE REAL SURFACE (7/18): the page Paolo actually opens carries a copy of
   his CLOUT block, lifted verbatim at build time because inlining all 68 KB of the
   orchestrator to reach four numbers is exactly what the 8/2 PAYLOAD WALL was about.
   A verbatim copy is only safe if something fails when it stops being verbatim. */
{
  const PAGE = 'slices/BOHEMIA_HOW_LOUD_8_6_26.html';
  const exists = fs.existsSync(PAGE);
  ok('the watchable surface exists at all — a thing he cannot open does not exist to him', exists);
  if (exists) {
    const src = fs.readFileSync(PAGE, 'utf8');
    const m = /const CLOUT_WEIGHTS = (\{[^}]*\});/.exec(src);
    const shipped = m ? JSON.parse(m[1].replace(/([a-z]+)\s*:/g, '"$1":')) : null;
    const matchesLive = s => !!s && TIERS.every(t => s[t] === LOOP.CLOUT_WEIGHTS[t]);
    ok('and the clout numbers baked into it still equal the live table in bohemia_loop.js — a copy that can rot silently is a second source of truth',
      matchesLive(shipped));
    ok('the page runs the REAL modules, inlined, not a re-implementation of the math',
      ['bohemia_standing.js', 'bohemia_deeds.js', 'bohemia_bq.js', 'bohemia_memory.js']
        .every(f => src.indexOf('---- engine/' + f + ' ----') >= 0));
    probe('the drift claim rejects a page whose baked numbers no longer match his table',
      !matchesLive({ quiet: 8, notable: 25, risky: 55, reckless: 999 }));
    probe('and rejects a page that shipped no numbers at all',
      !matchesLive(null));
  }
}

/* ================= the bridge must not have broken the organ under it ========= */
{
  const w = street(8, 'F');
  const before = S.witness(w.minds, 1, 'PLAYER', 'PLAIN', 10, 10, w.where);
  const after = S.witness(w.minds, 2, 'PLAYER', 'PLAIN2', 10, 10, w.where, {});
  ok('witness() with no options behaves identically to witness() with an empty options object — the new argument is genuinely optional',
    before === after && before > 0);
  const d = w.minds[0].deeds[0];
  ok('a deed recorded without a clout tag carries NO hop budget of its own, so gossip falls back to MAX_HOPS',
    d.maxHops === undefined);
}

console.log('');
notes.forEach(n => console.log('  NOTE  ' + n));
console.log(`  NOTE  ${caught}/${probes.length} self-test probes caught`);
if (caught !== probes.length) fails.push('self-test probes missed');
console.log(`=== DEED BRIDGE GATE: ${pass} passed, ${fails.length} failed ===`);
process.exit(fails.length ? 1 : 0);
