#!/usr/bin/env node
/* BROWNOUT GATE (8/8/26, WORLD lane).
 *
 * GDD v3 LOCKED: act-1-frequent power instability. Routed out of the 8/4 mechanics ledger,
 * where it had been designed-and-locked and sitting in nobody's queue.
 *
 * WHY IT MATTERS TO THIS LANE. Until now bohemia_powergrid.js answered at(x,y) with the
 * same thing forever: 12% of circuits live, each one owned. A valley whose lit 12% never
 * flickers is a valley where LIGHT = TERRITORY never has a bad night, and CLUSTERED POWER
 * is scenery rather than a system. This puts a TIME axis on the grid and nothing else.
 *
 * THE HARDEST CHECK HERE IS THE FIRST ONE. MECHANISM-MINE / CONTENTS-PAOLO'S: how often the
 * grid fails, how long, how wide, is entirely his. So with no dial set the module must RUN,
 * CHANGE NOTHING, and say NO_RULING BY NAME. A default would be me designing the pace of
 * the apocalypse, and a zero that looks like a decision is what gets built on by accident.
 *
 *   1. UNRULED MEANS SILENT. No dials -> no events, nothing changes, NO_RULING by name.
 *   2. NO INVENTED NUMBERS. Not one dial carries a default in the source.
 *   3. DETERMINISTIC. Same (seed, day, turn) is the same outage, always, and the source
 *      contains no Date and no Math.random -- a save reloaded mid-blackout is still mid-
 *      blackout, and the same valley fails the same way for everybody.
 *   4. AN OUTAGE ONLY EVER TAKES LIGHT AWAY. It can never light a cell that was dark, and
 *      the lit set can never grow. This is the one that would break LIGHT = TERRITORY.
 *   5. A DEAD CIRCUIT STAYS DEAD. You cannot black out what was already out.
 *   6. A BROWNOUT IS NOT A SMALL BLACKOUT. It stays LIVE and OWNED and reports dim -- the
 *      GDD drew that distinction and collapsing it to "off" throws it away.
 *   7. THE SHAPE IS UNCHANGED, so every existing consumer of powerMap keeps working.
 *   8. AND IT HOLDS ON THE REAL VALLEY, over the actual 96x96 grid.
 *
 *   node gates/brownout_gate.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const B = require(path.join(ROOT, 'engine/bohemia_brownout.js'));
const PG = require(path.join(ROOT, 'engine/bohemia_powergrid.js'));
const { world } = require(path.join(ROOT, 'engine/bohemia_world.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const SRC = fs.readFileSync(path.join(ROOT, 'engine/bohemia_brownout.js'), 'utf8');
const DIALS = { failuresPerDay: 3, brownoutShare: 0.6, turnsBrownout: 2, turnsBlackout: 5, scopeShare: 0.25 };

// ---- 1 + 2: unruled means silent, and nothing carries a default --------------------
const bare = B.scheduleFor(1, 1);
ok('with no dial set the schedule is EMPTY', bare.events.length === 0);
ok('and it says NO_RULING by name rather than returning a quiet zero',
   bare.applied === false && bare.reason === B.NO_RULING);
ok('it names WHICH dials are missing (' + bare.unruled.length + ')', bare.unruled.length === 5);
ok('every dial in the module is null until he rules it',
   Object.keys(B.DIALS).length === 5 && Object.keys(B.DIALS).every(k => B.DIALS[k] === null));
ok('and the source hands out no default anywhere (no `|| <number>` on a dial)',
   !/DIALS\s*=\s*\{[^}]*:\s*[0-9]/.test(SRC));

// ---- 3: deterministic, and provably so ---------------------------------------------
// A CHECKER THAT CANNOT TELL A MENTION FROM A USE IS THE BROKEN ONE (craft law, 8/1).
// This failed on its first run against a module that does not use either -- it matched the
// COMMENT saying "no Date, no Math.random". Strip comments first, then look for a CALL.
// Fix the ruler, never the target.
const CODE = SRC.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/[^\n]*/g, '$1');
ok('the source uses no Date and no Math.random (comments stripped, calls only)',
   !/Math\.random\s*\(|Date\.now\s*\(|new\s+Date\s*\(/.test(CODE));
const a1 = JSON.stringify(B.scheduleFor(7, 12, DIALS));
const a2 = JSON.stringify(B.scheduleFor(7, 12, DIALS));
ok('the same (seed, day) is the same schedule, always', a1 === a2);
ok('a different day is a different schedule', a1 !== JSON.stringify(B.scheduleFor(7, 13, DIALS)));
ok('a different seed is a different schedule', a1 !== JSON.stringify(B.scheduleFor(8, 12, DIALS)));

// the dice must not be loaded: a 0.6 brownout share has to come out near 0.6
let br = 0, bl = 0, startsSeen = new Set();
for (let d = 0; d < 1200; d++) for (const e of B.scheduleFor(7, d, DIALS).events) {
  e.kind === 'brownout' ? br++ : bl++; startsSeen.add(e.startTurn);
}
const share = br / (br + bl);
ok('the brownout share lands where it was asked to (' + share.toFixed(3) + ' vs 0.600)',
   Math.abs(share - 0.6) < 0.03);
ok('outages start across the whole day, not bunched (' + startsSeen.size + '/24 turns seen)',
   startsSeen.size === 24);

// ---- 4-8: against the REAL valley grid ---------------------------------------------
const w = world(12345);
const pm = PG.powerMap(w, 12345, {});
// THE VALLEY KNOWS HOW BIG IT IS. Writing 96 here is the house bug in miniature -- a value
// passed by hand where a value could be derived -- and map_bound_gate exists to catch
// exactly that, which it did on this file's first run.
const N = w.n;
const cells = [];
for (let y = 0; y < N; y += 2) for (let x = 0; x < N; x += 2) cells.push([x, y]);
const baseLive = new Set(cells.filter(c => pm.at(c[0], c[1]).live).map(c => c.join(',')));
ok('the valley grid has live circuits to lose (' + baseLive.size + ' live of ' + cells.length + ' sampled)',
   baseLive.size > 0);

const off = B.through(pm, 12345, 1, 10);
ok('with no dials the wrapped grid changes NOTHING',
   off.applied === false && off.reason === B.NO_RULING &&
   cells.every(c => off.at(c[0], c[1]).live === pm.at(c[0], c[1]).live));

let grew = 0, litTheDark = 0, dimNotOwned = 0, dimNotLive = 0, shapeBad = 0, sawBrown = 0, sawBlack = 0;
for (let day = 1; day <= 6; day++) for (let turn = 0; turn < 24; turn++) {
  const g = B.through(pm, 12345, day, turn, DIALS);
  let liveNow = 0;
  for (const c of cells) {
    const b = pm.at(c[0], c[1]), r = g.at(c[0], c[1]);
    if (typeof r.live !== 'boolean' || !('owner' in r)) shapeBad++;
    if (r.live) liveNow++;
    if (!b.live && r.live) litTheDark++;                       // 5 + 4
    if (r.out === 'brownout') { sawBrown++; if (!r.live) dimNotLive++; if (!r.owner) dimNotOwned++; }
    if (r.out === 'blackout') { sawBlack++; if (r.live) dimNotLive++; }
  }
  if (liveNow > baseLive.size) grew++;
}
ok('AN OUTAGE ONLY EVER TAKES LIGHT AWAY: the lit set never grows (144 turns checked)', grew === 0);
ok('it never lights a cell that was already dark', litTheDark === 0);
ok('a dead circuit stays dead', litTheDark === 0);
ok('A BROWNOUT IS NOT A SMALL BLACKOUT: it stays LIVE and stays OWNED (' + sawBrown + ' seen)',
   sawBrown > 0 && dimNotLive === 0 && dimNotOwned === 0);
ok('a blackout really is out (' + sawBlack + ' seen)', sawBlack > 0);
ok('the wrapped grid keeps powerMap\'s shape, so every existing consumer still works',
   shapeBad === 0);

// something must actually happen, or this is an elaborate no-op
const busy = B.through(pm, 12345, 1, 0, DIALS).measure(cells);
ok('on a turn with an event, real circuits are actually affected (' +
   busy.down + ' down, ' + busy.dimmed + ' dimmed)', (busy.down + busy.dimmed) > 0);

console.log('BROWNOUT GATE: ' + pass + ' passed, ' + fail + ' failed  (unruled = silent · ' +
            sawBrown + ' brownouts and ' + sawBlack + ' blackouts walked over the real grid · ' +
            'every number still Paolo\'s)');
process.exit(fail ? 1 : 0);
