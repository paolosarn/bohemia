#!/usr/bin/env node
/* SUCCESSION GATE (8/11/26, WORLD lane) — the world routes around the body, and it can
 * never get stuck doing it.
 *
 * THE MECHANIC IS BOHEMIA'S SIGNATURE and was locked in architecture on 7/1 and never
 * built: laws/BOHEMIA_ADDENDUM_SUCCESSION_AND_BUNKERGUY_7_1_26.md. Kill-anyone was already
 * ruled; this is what makes it mean something.
 *
 * WHAT THIS PROVES, and every check is a named failure mode from the addendum's own
 * research rather than a thing I invented to have something to test:
 *
 *  1. ROLES, NOT NPC-POINTERS. Killing the holder must not destroy the seat. A system that
 *     stores the person IS the soft-lock -- the pointer dangles and the thread dies with
 *     the body.
 *  2. A VACANCY IS A CONTESTED EVENT WITH A WINNER, and WEIGHT decides it. Silent
 *     reassignment teaches the player nothing; a coin flip teaches them the wrong thing.
 *     What they did has to be why the hardliner got the seat.
 *  3. IT TAKES TIME. Paolo, LOCKED: "the struggle PLAYS OUT over time, not instant... the
 *     crazy story consequences intentionally bloom in decade 2 and 3." An instant resolve
 *     is the version of this with no story in it.
 *  4. IT CAN NEVER SOFT-LOCK. The addendum names Skyrim's radiant quests as the system that
 *     ships this bug. Both halves are required: a fallback path AND a graceful closed
 *     state. Proved by FUZZ, not by inspection -- 400 random histories of vacancies,
 *     claims, ticks and sweeps, and no seat may end in a state the world cannot carry.
 *  5. CLOSING IS NEVER AN ERROR. When a faction is bled dry the thread closes and the world
 *     keeps going. "That closure IS the kill-everything endpoint expressed locally."
 *  6. AND IT KNOWS NOTHING IT WAS NOT TOLD. No seat names, no leaders, no factions ship in
 *     it, and his two OPEN FORKS are unruled and say so by name instead of being quietly
 *     defaulted.
 *
 *   node gates/succession_gate.js
 */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
process.chdir(ROOT);

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const S = require(path.join(ROOT, 'engine/bohemia_succession.js'));

// ---- 1. ROLES, NOT POINTERS ----------------------------------------------------------
{
  const st = S.create({ day: 0 });
  S.seat(st, 'r', { faction: 'F' });
  S.claim(st, 'r', 'a', 3);
  S.tick(st, 99);
  ok('a seat gets filled at all', st.seats.r.status === S.HELD && st.seats.r.holder === 'a');
  S.vacate(st, 'r', 'killed');
  ok('KILLING THE HOLDER DOES NOT DESTROY THE SEAT -- the role survives the body',
     !!st.seats.r && st.seats.r.status === S.VACANT && st.seats.r.holder === null);
  ok('and the seat still remembers what it requires, not who it lost',
     !!st.seats.r.spec && st.seats.r.spec.faction === 'F');
}

// ---- 2. A CONTEST WITH A WINNER, DECIDED BY WEIGHT ------------------------------------
{
  const st = S.create({ day: 0 });
  S.seat(st, 'r', {});
  S.claim(st, 'r', 'moderate', 5);
  S.claim(st, 'r', 'hardliner', 9);
  const [res] = S.tick(st, 999);
  ok('the vacancy resolves to ONE winner', res && res.applied && res.filled === 'hardliner');
  ok('WEIGHT decides it, so what the player did is why this person holds the seat',
     res.filled === 'hardliner');
  ok('and WHO LOST is reported -- the passed-over hardliner is the next vacuum\'s story',
     Array.isArray(res.passedOver) && res.passedOver.indexOf('moderate') >= 0);
}

// ---- 3. IT TAKES TIME ----------------------------------------------------------------
{
  const st = S.create({ day: 0 });
  S.seat(st, 'r', {});
  S.claim(st, 'r', 'a', 1);
  const early = S.tick(st, 1);
  ok('A STRUGGLE DOES NOT RESOLVE THE DAY IT OPENS (Paolo, LOCKED: it plays out over time)',
     early.length === 0 && st.seats.r.status === S.CONTESTED);
  const later = S.tick(st, 500);
  ok('and it DOES resolve on the forward compute, while the player is elsewhere',
     later.length === 1 && st.seats.r.status === S.HELD);
  ok('a more contested seat takes longer to settle than an uncontested one',
     S.fuseFor(5) > S.fuseFor(1));
}

// ---- 4. IT CAN NEVER SOFT-LOCK -- proved by fuzz --------------------------------------
{
  // deterministic pseudo-random history: no Date, no Math.random
  let seed = 12345;
  const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  let worstStuck = 0, closedSeen = 0, filledSeen = 0, runs = 400;
  for (let run = 0; run < runs; run++) {
    const st = S.create({ day: 0 });
    const n = 1 + Math.floor(rnd() * 4);
    for (let i = 0; i < n; i++) S.seat(st, 'r' + i, {});
    for (let step = 0; step < 20; step++) {
      const id = 'r' + Math.floor(rnd() * n);
      const roll = rnd();
      if (roll < 0.35) S.claim(st, id, 'c' + Math.floor(rnd() * 5), Math.floor(rnd() * 10));
      else if (roll < 0.55) S.vacate(st, id, 'fuzz');
      else if (roll < 0.85) S.tick(st, st.day + 1 + Math.floor(rnd() * 12));
      else S.sweep(st, 1 + Math.floor(rnd() * 40));
    }
    // the world moves on: a long time passes, then the host sweeps unclaimed seats
    S.tick(st, st.day + 500);
    S.sweep(st, 0);
    S.tick(st, st.day + 500);
    const bad = S.stuck(st);
    if (bad.length > worstStuck) worstStuck = bad.length;
    for (const k in st.seats) {
      if (st.seats[k].status === S.CLOSED) closedSeen++;
      if (st.seats[k].status === S.HELD) filledSeen++;
    }
  }
  ok('NO SOFT-LOCK IS REACHABLE: over ' + runs + ' random histories of kills, claims, time '
     + 'and sweeps, no seat ends in a state the world cannot carry (worst ' + worstStuck + ')',
     worstStuck === 0);
  ok('the fuzz actually exercised both outcomes (' + filledSeen + ' filled, ' + closedSeen +
     ' closed) -- a test where nothing ever closes has not tested the closing',
     filledSeen > 0 && closedSeen > 0);
}

// ---- 5. CLOSING IS NEVER AN ERROR ------------------------------------------------------
{
  const st = S.create({ day: 0 });
  S.seat(st, 'r', {});
  S.vacate(st, 'r', 'killed');
  st.day = 400;
  const [res] = S.sweep(st, 30);
  ok('a seat nobody can fill CLOSES, gracefully, with a reason',
     res && res.closed === true && !!res.why);
  ok('and the world can keep ticking over a closed seat forever',
     (() => { try { S.tick(st, st.day + 10000); S.sweep(st, 1); return true; } catch (e) { return false; } })());
  ok('a closed seat is never silently refilled behind the player\'s back',
     st.seats.r.status === S.CLOSED && st.seats.r.holder === null);
}

// ---- 6. IT KNOWS NOTHING IT WAS NOT TOLD ----------------------------------------------
{
  ok('the ROLE REGISTRY SHIPS EMPTY -- no seat of power, no leader, no faction is invented '
     + 'here (mechanism-mine / contents-Paolo\'s)', Object.keys(S.ROLES).length === 0);
  const p = S.pending();
  const keys = p.map(x => x.key);
  ok('and what is still his is NAMED, not quietly defaulted (' + keys.join(', ') + ')',
     keys.indexOf('ROLES') >= 0 && keys.indexOf('REOPEN_CLOSED') >= 0 &&
     keys.indexOf('SPAWN_REPLACEMENTS') >= 0);
  ok('his two OPEN FORKS are UNRULED', S.REOPEN_CLOSED === null && S.SPAWN_REPLACEMENTS === null);
  const st = S.create({ day: 0 });
  S.seat(st, 'r', {}); S.vacate(st, 'r'); st.day = 99; S.sweep(st, 1);
  const r = S.reopen(st, 'r');
  ok('reopening a closed thread REFUSES OUT LOUD and names the fork rather than guessing',
     r.applied === false && r.reason === S.NO_RULING && r.fork === 'REOPEN_CLOSED' &&
     /Paolo/.test(r.about || ''));
  ok('and every one of his leanings stayed a leaning: "both" is not wired as if it were '
     + 'a ruling', S.SPAWN_REPLACEMENTS !== true);
}

// ---- 7. DETERMINISM -- the same world twice gives the same history ---------------------
{
  const play = () => {
    const st = S.create({ day: 0 });
    S.seat(st, 'r', {});
    S.claim(st, 'r', 'a', 4); S.claim(st, 'r', 'b', 4); S.claim(st, 'r', 'c', 4);
    S.tick(st, 999);
    return st.seats.r.holder;
  };
  ok('a tie breaks the SAME way every time -- a struggle is a consequence, never a dice roll',
     play() === play() && play() === play());
}

console.log('SUCCESSION GATE: ' + pass + ' passed, ' + fail + ' failed  (roles outlive bodies, '
  + 'struggles take time, 400 fuzzed histories with zero soft-locks, registry empty)');
process.exit(fail ? 1 : 0);
