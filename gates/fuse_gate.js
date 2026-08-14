#!/usr/bin/env node
/* FUSED CONSEQUENCE GATE (8/11/26, WORLD lane) — not everything waits for you, and nothing
 * ever quietly disappears.
 *
 * LOCKED 7/1: laws/BOHEMIA_ADDENDUM_CAMERA_TIMESTEP_FUSED_7_1_26.md sec 4.
 *
 *   "a fused consequence is NOT a silent gut-punch and NOT a locked cutscene. As the fuse
 *    burns down the game WARNS you: 'hey, you're gonna wanna pull up soon.' You get a window
 *    of turns to zoom in and reach it. Make it in time, you can act on it. Too slow... it
 *    resolves without you and you live with it. Skill = attention + position + speed."
 *
 * WHAT THIS PROVES, and each one is a way the design fails rather than a thing I invented:
 *
 *  1. IT FIRES ON ITS FUSE, wherever the player is. That is the whole premise -- an event
 *     that waits for you is just I-move-you-move with extra steps.
 *  2. IT WARNS FIRST, ALWAYS, AND THE WARNING IS IN THE FUTURE. A warning the player cannot
 *     act on IS the silent gut-punch he ruled out. Proved on the nasty case: a caller asking
 *     for more lead than the fuse has.
 *  3. BEING THERE IS THE ONLY THING THAT CHANGES THE ENDING. Reach it in time and it is
 *     INTERVENED; miss it and it RESOLVED_WITHOUT. Same fuse, same turn, different ending,
 *     decided by attention and position.
 *  4. TOO LATE IS TOO LATE. Arriving after it fired cannot rewrite it -- otherwise the
 *     window means nothing and the lesson ("you missed it because you chose to move in big
 *     steps") is a lie.
 *  5. NOTHING EVER VANISHES. Every planted fuse ends in exactly one terminal state.
 *     A fuse that is past its fire turn and still un-ended is an event the world forgot,
 *     which is the disappearing-consequence bug. Proved by FUZZ over 400 random histories.
 *  6. IT DRIVES SUCCESSION, which is why both exist: a contested seat's own resolve day
 *     becomes the fuse, so the warning and the reveal ride the clock succession already
 *     computed instead of a second one that can drift.
 *  7. AND IT INVENTS NOTHING. No event list, no outcomes, no text, and both of his OPEN
 *     FORKS refuse out loud by name instead of being quietly defaulted.
 *
 *   node gates/fuse_gate.js
 */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
process.chdir(ROOT);

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const F = require(path.join(ROOT, 'engine/bohemia_fuse.js'));
const S = require(path.join(ROOT, 'engine/bohemia_succession.js'));

// ---- 1 + 2: it fires on its fuse, and it warns first ---------------------------------
{
  const st = F.create({ turn: 0 });
  F.plant(st, { id: 'a', fireTurn: 10, lead: 3 });
  ok('nothing happens before the warning line', F.tick(st, 6).length === 0);
  const w = F.tick(st, 7);
  ok('THE GAME WARNS YOU: "you\'re gonna wanna pull up soon"',
     w.length === 1 && w[0].kind === 'warning');
  ok('and the warning says how many turns you have to get there',
     w[0].signal.turnsLeft === 3);
  const f = F.tick(st, 10);
  ok('IT FIRES ON ITS FUSE whether or not you were anywhere near',
     f.length === 1 && f[0].kind === 'fired' && f[0].outcome === F.RESOLVED_WITHOUT);
}
{
  // THE NASTY CASE: more lead asked for than the fuse actually has.
  const st = F.create({ turn: 0 });
  const r = F.plant(st, { id: 'short', fireTurn: 2, lead: 9 });
  ok('a warning is never scheduled in the PAST, even when the fuse is shorter than the ' +
     'lead asked for (warns on turn ' + r.warnsOn + ', planted on 0)', r.warnsOn >= 0);
  const w = F.tick(st, 1);
  ok('so the player still gets a real turn to react to a short fuse',
     w.length === 1 && w[0].kind === 'warning' && w[0].signal.turnsLeft >= 1);
}

// ---- 3 + 4: being there is what changes the ending ------------------------------------
{
  const st = F.create({ turn: 0 });
  F.plant(st, { id: 'b', fireTurn: 8, lead: 3 });
  F.tick(st, 5);
  ok('you can reach it inside the window', F.reach(st, 'b').applied === true);
  const f = F.tick(st, 8);
  ok('REACHING IT IN TIME CHANGES THE ENDING', f[0].outcome === F.INTERVENED);
  ok('and how much of it you get to play is left to him, not decided here',
     f[0].playable === F.NO_RULING && f[0].fork === 'REACHED_IS_PLAYABLE');
}
{
  const st = F.create({ turn: 0 });
  F.plant(st, { id: 'c', fireTurn: 4, lead: 2 });
  F.tick(st, 4);
  const late = F.reach(st, 'c');
  ok('TOO LATE IS TOO LATE -- arriving after it fired cannot rewrite it',
     late.applied === false && late.reason === 'TOO_LATE');
  ok('and it stays resolved-without-you', st.fuses.c.outcome === F.RESOLVED_WITHOUT);
}

// ---- 5: nothing ever vanishes -- fuzz -------------------------------------------------
{
  let seed = 987654321;
  const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  let worst = 0, intervened = 0, without = 0, cancelled = 0, runs = 400;
  for (let run = 0; run < runs; run++) {
    const st = F.create({ turn: 0 });
    const n = 1 + Math.floor(rnd() * 4);
    for (let i = 0; i < n; i++) {
      F.plant(st, { id: 'f' + i, fireTurn: 1 + Math.floor(rnd() * 20), lead: 1 + Math.floor(rnd() * 6) });
    }
    for (let step = 0; step < 15; step++) {
      const id = 'f' + Math.floor(rnd() * n);
      const roll = rnd();
      if (roll < 0.3) F.reach(st, id);
      else if (roll < 0.4) F.cancel(st, id, 'fuzz');
      else F.tick(st, st.turn + 1 + Math.floor(rnd() * 6));
    }
    F.tick(st, st.turn + 100);
    const bad = F.orphans(st);
    if (bad.length > worst) worst = bad.length;
    for (const k in st.fuses) {
      const o = st.fuses[k].outcome;
      if (o === F.INTERVENED) intervened++;
      else if (o === F.RESOLVED_WITHOUT) without++;
      else if (o === F.CANCELLED) cancelled++;
    }
  }
  ok('NOTHING EVER VANISHES: over ' + runs + ' random histories every planted fuse ends in ' +
     'exactly one terminal state (worst orphaned ' + worst + ')', worst === 0);
  ok('and the fuzz reached all three endings (' + intervened + ' intervened, ' + without +
     ' without you, ' + cancelled + ' cancelled) -- a run that never intervenes has not ' +
     'tested intervening', intervened > 0 && without > 0 && cancelled > 0);
}

// ---- 6: it drives succession, on succession's own clock -------------------------------
{
  const su = S.create({ day: 0 });
  S.seat(su, 'water', {});
  S.claim(su, 'water', 'a', 3);
  const st = F.create({ turn: 0 });
  const r = F.plantForSeat(st, su, 'water');
  ok('a contested seat plants a fuse', r.applied === true);
  ok('AND IT RIDES SUCCESSION\'S OWN RESOLVE DAY, so the warning and the struggle can never ' +
     'drift apart', r.fire === su.seats.water.fuse);
  ok('an uncontested seat plants nothing', (() => {
    const su2 = S.create({ day: 0 }); S.seat(su2, 'x', {});
    return F.plantForSeat(F.create({ turn: 0 }), su2, 'x').applied === false;
  })());
}

// ---- 7: it invents nothing -------------------------------------------------------------
{
  ok('his TONE FORK is unruled: the warning says something is coming and WHERE, and refuses ' +
     'to invent what it is', F.WARNING_SPECIFICITY === null &&
     (() => { const st = F.create({ turn: 0 }); F.plant(st, { id: 'z', fireTurn: 3, lead: 2, about: 'secret' });
              const w = F.tick(st, 1); return w[0].signal.detail === F.NO_RULING &&
                w[0].signal.about === undefined && /Paolo/.test(w[0].signal.aboutFork || ''); })());
  ok('his PLAYABLE FORK is unruled, and his recorded leaning is left as a leaning',
     F.REACHED_IS_PLAYABLE === null);
  const keys = F.pending().map(p => p.key);
  ok('and both are NAMED as pending rather than silently defaulted (' + keys.join(', ') + ')',
     keys.indexOf('WARNING_SPECIFICITY') >= 0 && keys.indexOf('REACHED_IS_PLAYABLE') >= 0);
}

console.log('FUSE GATE: ' + pass + ' passed, ' + fail + ' failed  (it fires without you, it ' +
            'always warns first, 400 fuzzed histories with nothing forgotten)');
process.exit(fail ? 1 : 0);
