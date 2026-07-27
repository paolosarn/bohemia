/* WORLD RESOLVE GATE (Paolo 7/27/26) — the machine gate for
   engine/bohemia_world_resolve.js, the world's half of the approved resolver.

   His order: "the world's systems (encounter director when it lands, faction beats,
   day advance) subscribe to the declared time-spend moments — a meal moves the world a
   little, a night moves it more, because each system declares it, never hardcoded. All
   tables stay empty until I rule numbers."

   Three claims in that sentence, and all three are checkable:

     1. NEVER HARDCODED. No moment name and no rate lives in the module. Proved two
        ways: BY SOURCE (the file is read and searched for the moment names Paolo has
        used as examples, and for a numeric default on any rate), and BY BEHAVIOUR (a
        resolver whose moments are named things the module has never heard of works
        exactly the same, because the module genuinely does not know them).

     2. ALL TABLES EMPTY. Wire every world system with nothing in it, spend every
        moment, and NOTHING may change — no day, no ledger, no faction. Each system
        must say NO_RULING by name rather than silently doing nothing, because an
        unruled world that looks identical to a working one is how content gets
        invented by accident later.

     3. A MEAL MOVES IT A LITTLE, A NIGHT MOVES IT MORE. With caller-supplied numbers,
        the ratio between two moments comes out EXACTLY as the caller declared them,
        and it tracks when those numbers change — which is the proof that the ratio
        lives in the ruling and not in this code.

   Plus the pacing ruling it must not break: FACTION BEATS ARE DEFAULT OFF (Paolo 7/24,
   "never on a tick, a heartbeat, or any kind of background clock"), and the encounter
   director's socket stays empty until the director lands.

   Run: node gates/world_resolve_gate.js   Registered as WORLD RESOLVE. */
'use strict';
const fs = require('fs');
const R = require('../engine/bohemia_resolve.js');
const W = require('../engine/bohemia_world_resolve.js');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const SRC = fs.readFileSync('engine/bohemia_world_resolve.js', 'utf8');

/* TEST MOMENTS ARE THE GATE'S, NOT CANON. Deliberately nonsense names: if the module
   had any knowledge of what a moment is called, these would not work. */
const M = [{ name: 'SMALL', spends: 0.1 }, { name: 'BIG', spends: 1.0 }];
const mk = () => R.makeResolver({ moments: M.map(m => ({ name: m.name, spends: m.spends })) });

// ---- 1. NEVER HARDCODED -----------------------------------------------------
{
  /* The examples Paolo himself has used for moments. None may appear in the module:
     the day he rules the real table, this file must not already have an opinion. */
  const code = SRC.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  const NAMES = ['sleep', 'night', 'meal', 'hangout', 'eat', 'dawn', 'morning', 'rest'];
  const found = NAMES.filter(n => new RegExp('[\'"]' + n + '[\'"]', 'i').test(code));
  ok('no moment name is written into the module (' + found.join(' ') + ')', found.length === 0);

  // no numeric default on any rate: perUnit is only ever read, never assigned a number
  const defaulted = /perUnit\s*(?:=|\|\|)\s*[-\d.]/.test(code);
  ok('no rate carries a numeric default', !defaulted);
  // and no default length of a day
  ok('no default day length is written in', !/dayLength|DAY_LENGTH|hoursPerDay/i.test(code));

  // BY BEHAVIOUR: names the module has never seen work identically
  const r1 = R.makeResolver({ moments: [{ name: 'QWERTYUIOP', spends: 1 }] });
  W.attach(r1, { day: { perUnit: 1 } });
  const c1 = { day: 0 };
  r1.resolve(c1, { moment: 'QWERTYUIOP' });
  ok('a moment name the module has never heard of works exactly the same', c1.day === 1);
}

// ---- 2. ALL TABLES EMPTY ----------------------------------------------------
{
  const res = mk();
  const w = W.attach(res, { day: {}, economy: {}, faction: {}, encounters: {} });
  ok('an unwired encounter director is not registered at all',
     w.registered.indexOf('encounters') < 0 &&
     w.skipped.some(s => s.id === 'encounters'));

  let changed = false;
  M.forEach(m => {
    const ctx = { day: 0 };
    const before = JSON.stringify(ctx);
    const out = res.resolve(ctx, { moment: m.name });
    if (JSON.stringify(ctx) !== before) changed = true;
    const s = W.summarize(out);
    ok(m.name + ': every wired system reports NO_RULING (' + s.unruled.join(' ') + ')',
       s.applied.length === 0 && s.unruled.length === w.registered.length);
    ok(m.name + ': and the moment still completed cleanly', s.ok === true);
  });
  ok('an unruled world changes NOTHING at all', !changed);

  // an unruled system is LOUD, not silent: it names itself and its reason
  const ctx2 = { day: 0 };
  const rep = res.resolve(ctx2, { moment: 'BIG' }).reports;
  ok('each unruled report names its own system and reason',
     ['day', 'economy', 'faction'].every(id =>
       rep[id] && rep[id].reason === W.NO_RULING && rep[id].system === id));
}

// ---- 3. A MEAL MOVES IT A LITTLE, A NIGHT MOVES IT MORE ---------------------
{
  /* The ratio must come out of the CALLER'S numbers. Run the same system under two
     different rulings and the answer must track the ruling, not the code. */
  function daysAfter(smallSpends, bigSpends, perUnit, nSmall, nBig) {
    const res = R.makeResolver({ moments: [{ name: 'SMALL', spends: smallSpends },
                                           { name: 'BIG', spends: bigSpends }] });
    W.attach(res, { day: { perUnit: perUnit } });
    const ctx = { day: 0 };
    for (let i = 0; i < nSmall; i++) res.resolve(ctx, { moment: 'SMALL' });
    for (let i = 0; i < nBig; i++) res.resolve(ctx, { moment: 'BIG' });
    return ctx.day;
  }
  ok('one BIG moves the world more than one SMALL',
     daysAfter(0.1, 1.0, 1, 0, 1) > daysAfter(0.1, 1.0, 1, 1, 0));
  ok('and exactly as much as the caller said: 10 SMALL == 1 BIG',
     daysAfter(0.1, 1.0, 1, 10, 0) === daysAfter(0.1, 1.0, 1, 0, 1));
  ok('change the ruling and the answer changes with it: 4 SMALL == 1 BIG at 0.25',
     daysAfter(0.25, 1.0, 1, 4, 0) === daysAfter(0.25, 1.0, 1, 0, 1));
  ok('the same ruling with half the sensitivity moves half as far',
     daysAfter(0.1, 1.0, 1, 0, 8) === 8 && daysAfter(0.1, 1.0, 0.5, 0, 8) === 4);

  /* THE FLOAT BUG THIS CAUGHT. Ten spends of 0.1 sum to 0.9999999999999999, so a
     strict >= 1 ate one moment in every ten: the player eats ten meals and the day
     never turns. Long runs must not drift. */
  ok('a long run of small moments does not drift (40 x 0.1 == 4 days)',
     daysAfter(0.1, 1.0, 1, 40, 0) === 4);
  ok('and a very long one still does not (300 x 0.1 == 30 days)',
     daysAfter(0.1, 1.0, 1, 300, 0) === 30);
}

// ---- 4. SUBSCRIPTION: A SYSTEM ONLY RUNS AT THE MOMENTS IT DECLARED ---------
{
  const res = mk();
  W.attach(res, { day: { perUnit: 1, moments: ['BIG'] } });
  const ctx = { day: 0 };
  res.resolve(ctx, { moment: 'SMALL' });
  ok('a system does not run at a moment it did not subscribe to', ctx.day === 0);
  res.resolve(ctx, { moment: 'BIG' });
  ok('and does run at one it did', ctx.day === 1);
  ok('the resolver refuses a subscription to a moment nobody declared', (() => {
    try { W.attach(mk(), { day: { perUnit: 1, moments: ['NOPE'] } }); return false; }
    catch (e) { return /undeclared moment/.test(String(e.message)); }
  })());
  ok('and refuses an unknown world system outright', (() => {
    try { W.attach(mk(), { weather: {} }); return false; }
    catch (e) { return /unknown world system/.test(String(e.message)); }
  })());
}

// ---- 5. THE FACTION PACING RULING (Paolo 7/24) IS NOT BROKEN ---------------
{
  const res = mk();
  W.attach(res, { faction: { advance: () => [{ faction: 'x', claimed: 1 }] } });
  const ctx = { day: 0 };
  let fired = 0;
  M.forEach(m => {
    const rep = res.resolve(ctx, { moment: m.name }).reports.faction;
    if (rep && rep.applied) fired++;
  });
  ok('a faction turn NEVER fires without an explicit beat, at any moment', fired === 0);
  ok('and it says so as a pacing decision, not as an accident',
     res.resolve(ctx, { moment: 'BIG' }).reports.faction.pacing === 'DEFAULT_OFF');

  const res2 = mk();
  let turns = 0;
  W.attach(res2, { faction: { beat: (c, m) => m.name === 'BIG', advance: () => { turns++; return [1]; } } });
  res2.resolve({ day: 0 }, { moment: 'SMALL' });
  ok('with a beat supplied it still stays quiet when the beat says no', turns === 0);
  res2.resolve({ day: 0 }, { moment: 'BIG' });
  ok('and fires exactly when the beat says so', turns === 1);
}

// ---- 6. THE ENCOUNTER DIRECTOR'S SOCKET ------------------------------------
{
  const res = mk();
  let seen = null;
  const w = W.attach(res, { encounters: { perUnit: 2, director: (c, m, budget) => { seen = budget; return ['a']; } } });
  ok('a real director does register', w.registered.indexOf('encounters') >= 0);
  res.resolve({ day: 0 }, { moment: 'BIG' });
  ok('and is handed a budget scaled by the moment (1.0 x 2 = 2)', seen === 2);
  res.resolve({ day: 0 }, { moment: 'SMALL' });
  ok('a smaller moment hands it a smaller budget', Math.abs(seen - 0.2) < 1e-9);

  const res2 = mk();
  W.attach(res2, { encounters: { director: () => ['a'] } });   // director but NO rate
  ok('a director with no ruled rate reports NO_RULING and does not run',
     res2.resolve({ day: 0 }, { moment: 'BIG' }).reports.encounters.reason === W.NO_RULING);
}

// ---- 7. THE ECONOMY READS THE DAY, IT IS NEVER TOLD --------------------------
{
  /* bohemia_resolve.js forbids a step from reading another step's report. So the
     economy must notice the day off the shared ctx. Proved with the REAL economy
     module, not a stub: an unruled clock must not advance the ledger. */
  const ECON = require('../engine/bohemia_economy.js');
  const ledger = ECON.makeLedger(7, 8, 4);
  let advanced = 0;
  const res = mk();
  W.attach(res, { day: { perUnit: 1 },
                  economy: { ledger: ledger, advanceDay: (l, a) => { advanced++; return ECON.advanceDay(l, a); } } });
  const ctx = { day: 0 };
  res.resolve(ctx, { moment: 'SMALL' });
  ok('a moment too small to roll a day does not advance the ledger', advanced === 0);
  for (let i = 0; i < 9; i++) res.resolve(ctx, { moment: 'SMALL' });
  ok('the tenth small moment rolls the day AND the ledger follows it',
     ctx.day === 1 && advanced === 1);
  res.resolve(ctx, { moment: 'BIG' });
  ok('a big moment rolls both again', ctx.day === 2 && advanced === 2);
  /* Scoped to attach()'s body — the STEP functions. summarize() reads result.reports
     on purpose, but that is the caller's summary of a finished moment, not a step
     peeking at a sibling mid-resolve, which is what the resolver forbids. */
  const attachBody = SRC.slice(SRC.indexOf('function attach('), SRC.indexOf('function systems('));
  ok('no step function reads a report (the ban the resolver enforces)',
     !/reports/.test(attachBody));
}

// ---- 8. ONE BAD SYSTEM MUST NOT EAT THE TIME THE PLAYER SPENT ---------------
{
  const res = mk();
  W.attach(res, { day: { perUnit: 1 },
                  faction: { beat: () => true, advance: () => { throw new Error('boom'); } } });
  const ctx = { day: 0 };
  const out = res.resolve(ctx, { moment: 'BIG' });
  ok('a throwing system is reported by name', out.failures.some(f => f.step === 'faction'));
  ok('and the day still moved', ctx.day === 1);
  ok('and the summary is honest about it', W.summarize(out).failures.indexOf('faction') >= 0);
}

// ---- 9. DETERMINISM + the phases are the resolver's ------------------------
{
  function run() {
    const res = mk();
    W.attach(res, { day: { perUnit: 0.3 } });
    const ctx = { day: 0 };
    ['BIG', 'SMALL', 'SMALL', 'BIG'].forEach(m => res.resolve(ctx, { moment: m }));
    return JSON.stringify(ctx);
  }
  ok('the same moments in the same order give the identical world', run() === run());
  const phases = W.systems().map(s => s.phase);
  ok('every world system sits in a phase the resolver actually knows',
     phases.every(p => R.makeResolver().PHASES.indexOf(p) >= 0));
  ok('the world declares its systems so nobody has to guess',
     W.SYSTEM_IDS.length === 4 && W.SYSTEM_IDS.indexOf('faction') >= 0);
}

console.log('WORLD RESOLVE GATE: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
