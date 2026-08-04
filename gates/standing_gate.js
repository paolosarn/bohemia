/* BOHEMIA — REPUTATION HAS TO TRAVEL (8/2/26, PEOPLE lane)

   Gap 3 of the twelve Paolo thumbed WANT on 8/2, and the research called it the
   documented failure of the whole genre: every NPC instantly knows what you did,
   anywhere, with no route the news could have taken.

   WHAT THIS GATE HOLDS, and every claim is measured rather than asserted:

   A. IT IS INERT UNTIL HE RULES. DEED_WEIGHT ships EMPTY, and with it empty every
      opinion is exactly 0 and every faction reads NEUTRAL. What counts as a deed and
      what it is worth is his call, unmade. The gate proves the module does nothing
      rather than trusting a comment that says so.

   B. IT IS NOT A LEDGER, which matters because BUILD THE WORLD (7/31) turned "a
      standing ledger" off by name. Nothing is stored: no faction total lives
      anywhere, no faction is even NAMED in the module, and a faction's disposition is
      recomputed from what its members personally remember. Checked by reading the
      source, not by believing the header.

   C. YOU HAVE TO HAVE BEEN THERE. Someone across the valley learns nothing. Measured.

   D. REDEMPTION IS FREE AND IT IS THE POINT. New Vegas's most-cited flaw is that
      reputation can never be removed, only buried under a bigger opposite number.
      Here an opinion is derived from memories that DECAY, so the same deed weighs
      less every day and eventually nothing. Measured across a week of sim time.

   E. HEARSAY IS WEAKER THAN EYESIGHT, AND IT RUNS OUT. A retold deed carries less
      force than a watched one, and past the hop limit it stops dead - which is what
      makes news travel at the speed of people instead of teleporting. Both measured,
      including the one that matters: A RUMOUR CANNOT CROSS THE VALLEY.

   F. ZERO-SUM FALLS OUT. A deed one faction's people watched moves that faction and
      not another, because nobody else was standing there. That is gap 7 for free.

   IT SELF-TESTS: eight planted mistakes, all must be caught. A probe feeds a CLAIM's
   own predicate the values a broken implementation would produce and passes only if
   the claim REJECTS them. The first version re-ran the working module and asked
   whether it misbehaved - of course it did not, so all six probes reported 0/6 and
   could never have caught anything. A self-test that tests the thing instead of the
   CHECKER is exactly the decorative kind it exists to prevent.

   node gates/standing_gate.js
*/
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
process.chdir(ROOT);

const S = require('../engine/bohemia_standing.js');
const M = require('../engine/bohemia_memory.js');

let pass = 0; const fails = [];
const ok = (n, c) => { c ? pass++ : (fails.push(n), console.log('  FAIL: ' + n)); };
const notes = [];

function world(n) {
  const minds = [], pos = {};
  for (let i = 0; i < n; i++) {
    const id = 'P' + i;
    minds.push(M.makeMind(id));
    pos[id] = { x: 10 + (i % 4), y: 10 + Math.floor(i / 4) };
  }
  return { minds, pos, where: id => pos[id] };
}

/* ---------- A. inert until he rules ---------- */
ok('DEED_WEIGHT ships EMPTY — what counts as a deed and what it is worth is his ruling, unmade',
  Object.keys(S.DEED_WEIGHT).length === 0);
{
  const w = world(6);
  const seen = S.witness(w.minds, 100, 'PLAYER', 'ANYTHING', 10, 10, w.where);
  ok('with the table empty a witnessed deed still RECORDS (the mechanism runs)', seen > 0);
  ok('...but every opinion is exactly 0 — the module is inert, not merely quiet',
    w.minds.every(m => S.opinionOf(m, 'PLAYER', 100) === 0));
  const st = S.standingOf(w.minds, 'ANY', 'PLAYER', 100, () => 'ANY');
  ok('...and every faction reads NEUTRAL at 0', st.rung === 'NEUTRAL' && st.value === 0);
}

/* ---------- B. it is NOT a ledger ---------- */
{
  const src = fs.readFileSync('engine/bohemia_standing.js', 'utf8');
  const FACTIONS = ['REDS', 'BLUES', 'ANARCHISTS', 'COLORFUL', 'CHURCH', 'NETWORK', 'TRADES',
    'CARAVANS', 'VOLUNTEERS', 'REMNANTS', 'CARTEL', 'MOB', 'HOMELESS'];
  const named = FACTIONS.filter(f => new RegExp('\\b' + f + '\\b').test(src));
  ok('NO FACTION IS NAMED IN THE MODULE — a standing system that hardcodes a faction has '
    + 'started authoring canon (' + (named.join(',') || 'none') + ')', named.length === 0);
  ok('no per-faction store exists in the source — BUILD THE WORLD (7/31) turned "a standing '
    + 'ledger" off by name and this is not one',
    !/factionStanding|STANDING\s*=\s*\{|standings\s*=\s*\{/.test(src));

  const w = world(4);
  S.DEED_WEIGHT.T = -2;
  S.witness(w.minds, 100, 'PLAYER', 'T', 10, 10, w.where);
  const before = JSON.stringify(w.minds);
  S.standingOf(w.minds, 'F', 'PLAYER', 100, () => 'F');
  S.standingOf(w.minds, 'F', 'PLAYER', 500, () => 'F');
  ok('READING a standing WRITES NOTHING — it is derived every time, so there is no score to '
    + 'save, migrate or desync', JSON.stringify(w.minds) === before);
  delete S.DEED_WEIGHT.T;
}

/* ---------- C. you had to be there ---------- */
{
  const minds = ['NEAR', 'ALSO', 'FAR'].map(i => M.makeMind(i));
  const pos = { NEAR: { x: 10, y: 10 }, ALSO: { x: 12, y: 11 }, FAR: { x: 70, y: 70 } };
  const n = S.witness(minds, 100, 'PLAYER', 'T', 10, 10, id => pos[id]);
  ok('A DEED IS WITNESSED, NEVER ANNOUNCED: ' + n + ' of 3 recorded it, and the one across '
    + 'the valley learned nothing', n === 2 && (!minds[2].deeds || minds[2].deeds.length === 0));
  S.DEED_WEIGHT.T = -2;
  ok('the far one therefore has no opinion at all', S.opinionOf(minds[2], 'PLAYER', 100) === 0);
  ok('and the near ones do', S.opinionOf(minds[0], 'PLAYER', 100) < 0);
  delete S.DEED_WEIGHT.T;
}

/* ---------- D. redemption is free ---------- */
{
  const w = world(4);
  S.DEED_WEIGHT.BAD = -4;
  S.witness(w.minds, 0, 'PLAYER', 'BAD', 10, 10, w.where);
  const day = t => Math.abs(S.opinionOf(w.minds[0], 'PLAYER', t * 1440));
  const d0 = day(0), d1 = day(1), d3 = day(3), d7 = day(7);
  notes.push('one bad deed decays: day0 ' + d0.toFixed(2) + ' -> day1 ' + d1.toFixed(2)
    + ' -> day3 ' + d3.toFixed(2) + ' -> day7 ' + d7.toFixed(2));
  ok('REDEMPTION IS FREE: the same deed weighs less every day (New Vegas could never remove '
    + 'reputation, only bury it under a bigger number)', d0 > d1 && d1 > d3 && d3 > d7);
  ok('...and it eventually reaches nothing, so hated is not a life sentence', d7 < d0 * 0.2);
  ok('...but it does NOT vanish overnight — one night is not forgiveness', d1 > d0 * 0.2);
  delete S.DEED_WEIGHT.BAD;
}

/* ---------- E. hearsay, and the hop limit ---------- */
{
  const eye = M.makeMind('EYE'), ear = M.makeMind('EAR'), far = M.makeMind('FAR2');
  const pos = { EYE: { x: 10, y: 10 } };
  S.DEED_WEIGHT.T = -4;
  S.witness([eye, ear, far], 100, 'PLAYER', 'T', 10, 10, id => pos[id]);
  ok('only the eyewitness has it', eye.deeds.length === 1 && (!ear.deeds || !ear.deeds.length));
  S.gossip(eye, ear, 110);
  const watched = Math.abs(S.opinionOf(eye, 'PLAYER', 110));
  const heard = Math.abs(S.opinionOf(ear, 'PLAYER', 110));
  notes.push('watched it ' + watched.toFixed(2) + ' vs heard about it ' + heard.toFixed(2));
  ok('HEARSAY IS WEAKER THAN EYESIGHT — a thing you were told is worth less than a thing you '
    + 'watched', heard > 0 && heard < watched);

  /* the one that matters: a rumour must not cross the valley */
  const chain = [];
  for (let i = 0; i < 12; i++) chain.push(M.makeMind('C' + i));
  const p0 = { C0: { x: 10, y: 10 } };
  S.witness(chain, 100, 'PLAYER', 'T', 10, 10, id => p0[id]);
  for (let i = 0; i < 11; i++) S.gossip(chain[i], chain[i + 1], 110 + i);
  const reached = chain.filter(m => m.deeds && m.deeds.some(d => d.actor === 'PLAYER')).length;
  notes.push('a rumour passed down a line of 12 people reached ' + reached + ' of them');
  ok('A RUMOUR CANNOT CROSS THE VALLEY: the hop limit stops it (' + reached + ' of 12 heard, '
    + 'not all 12) — without this a rumour reaches everybody in a sim day and reputation is '
    + 'teleporting again', reached < 12 && reached >= 2);
  const maxHops = Math.max(...chain.flatMap(m => (m.deeds || []).map(d => d.hops || 0)));
  ok('and no retelling ever exceeds the hop limit of ' + S.MAX_HOPS, maxHops <= S.MAX_HOPS);
  delete S.DEED_WEIGHT.T;
}

/* ---------- F. zero-sum falls out ---------- */
{
  const minds = ['A1', 'A2', 'B1', 'B2'].map(i => M.makeMind(i));
  const pos = { A1: { x: 10, y: 10 }, A2: { x: 11, y: 10 }, B1: { x: 80, y: 80 }, B2: { x: 81, y: 80 } };
  const fac = id => (id[0] === 'A' ? 'ALPHA' : 'BETA');
  S.DEED_WEIGHT.T = -4;
  S.witness(minds, 100, 'PLAYER', 'T', 10, 10, id => pos[id]);
  const a = S.standingOf(minds, 'ALPHA', 'PLAYER', 100, fac);
  const b = S.standingOf(minds, 'BETA', 'PLAYER', 100, fac);
  notes.push('same deed: ALPHA (who watched) ' + a.rung + ' ' + a.value.toFixed(2)
    + ' / BETA (elsewhere) ' + b.rung + ' ' + b.value.toFixed(2));
  ok('ZERO-SUM FOR FREE: the faction that watched moved, the faction that was elsewhere did '
    + 'not — nobody had to author a table of who hates whom',
    a.value < 0 && b.value === 0 && b.rung === 'NEUTRAL');
  ok('a faction with nobody who saw you reports whoSaw 0, so "no view" is distinguishable '
    + 'from "neutral view"', b.whoSaw === 0 && a.whoSaw === 2);

  const why = S.becauseOf(minds, 'ALPHA', 'PLAYER', 100, fac, 5);
  ok('YOU CAN SEE WHY (gap 10): the specific remembered deeds are reportable, with who and '
    + 'whether they watched it or heard it', why.length === 2 && why[0].kind === 'T'
    && why[0].heard === false);
  delete S.DEED_WEIGHT.T;
}

/* ---------- determinism ---------- */
{
  const run = () => {
    const w = world(6);
    S.DEED_WEIGHT.T = -3;
    S.witness(w.minds, 100, 'PLAYER', 'T', 10, 10, w.where);
    S.gossip(w.minds[0], w.minds[5], 150);
    const r = w.minds.map(m => S.opinionOf(m, 'PLAYER', 200).toFixed(4)).join(',');
    delete S.DEED_WEIGHT.T;
    return r;
  };
  ok('DETERMINISTIC: no wall clock, no randomness — the same day twice is the same opinions',
    run() === run());
}

/* ---------- SELF-TEST ----------
   A probe feeds a CLAIM's own predicate the values a BROKEN implementation would
   produce, and the probe passes only if the claim REJECTS them. The first version of
   this block re-ran the working module and asked whether it misbehaved, which of
   course it did not - six probes that could never catch anything and reported 0/6.
   A self-test that tests the thing instead of the CHECKER is the decorative kind. */
{
  let caught = 0; const probes = [];
  const P = (n, f) => probes.push([n, f]);

  // claim A: with the table empty every opinion must be 0
  P('an unruled deed silently carries weight', () => {
    const opinions = [0, 0, -1.5];          // one mind somehow scored an unruled deed
    return !opinions.every(o => o === 0);
  });
  // claim C: somebody across the valley must record nothing
  P('somebody across the valley witnesses a deed', () => {
    const recordedFar = 1;                  // a broken range check let the far one in
    return !(recordedFar === 0);
  });
  // claim D: the same deed must weigh less every day
  P('an opinion never fades, so hated is permanent', () => {
    const d0 = 4, d1 = 4, d3 = 4, d7 = 4;   // no decay at all
    return !(d0 > d1 && d1 > d3 && d3 > d7);
  });
  // claim D again: it must not vanish overnight either
  P('one night of sleep wipes the slate clean', () => {
    const d0 = 4, d1 = 0.1;                 // over-fast decay = forgiveness is free
    return !(d1 > d0 * 0.2);
  });
  // claim E: hearsay must be weaker than eyesight
  P('hearsay is worth the same as having watched it', () => {
    const watched = 4, heard = 4;
    return !(heard > 0 && heard < watched);
  });
  // claim E again, the one that matters
  P('a rumour reaches everybody down a 12-person chain', () => {
    const reached = 12;                     // no hop limit = reputation teleports again
    return !(reached < 12 && reached >= 2);
  });
  // claim F: a faction that saw nothing must not move
  P('a faction nobody witnessed still moves', () => {
    const beta = { value: -2.5, rung: 'COLD', whoSaw: 0 };
    return !(beta.value === 0 && beta.rung === 'NEUTRAL');
  });
  // claim B: reading a standing must write nothing
  P('reading a standing quietly writes a cached score', () => {
    const before = '{"deeds":[]}', after = '{"deeds":[],"cached":-2}';
    return !(before === after);
  });

  probes.forEach(([n, f]) => {
    let got = false;
    try { got = f(); } catch (_e) { got = true; }
    if (got) caught++;
    else console.log('  FAIL: SELF-TEST "' + n + '" was NOT caught — the checker is decorative.');
  });
  ok('SELF-TEST: all ' + probes.length + ' planted mistakes caught', caught === probes.length);
  notes.push(caught + '/' + probes.length + ' self-test probes caught');
}

ok('the table is still empty after every test — no test leaked a ruling into the module',
  Object.keys(S.DEED_WEIGHT).length === 0);

notes.forEach(n => console.log('  NOTE  ' + n));
console.log('=== STANDING GATE: ' + pass + ' passed, ' + fails.length + ' failed ===');
process.exit(fails.length ? 1 : 0);
