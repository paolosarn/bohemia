#!/usr/bin/env node
/* ============================================================================
   FPS ON A PHONE — THE SPEED BUDGET, AND THE FIRST GATE THAT HOLDS ONE
   (9/5/26, PLUMBER lane, VAMILY row [sixty fps] FPS-ON-A-PHONE)

   Paolo 9/5: "we can have a permanent pipe fixer always working ... helping make
   the game as slimmest it can be, fastest it can be, 60 fps."

   THE BOARD SAID THESE NUMBERS HAD NEVER BEEN TAKEN, and it was right: "Frame
   rate, load time and size on a real phone have NEVER been measured (dispatch
   item 7, unowned since 8/25)." Of ~485 gates, one measured anything about speed
   (frame_budget_gate: redraws per touch move) and none measured how many frames
   a second anybody actually gets. This is that gate, and the instrument that
   feeds it is gates/bohemia_phone_perf.js.

   WHAT IT HOLDS, in the order a player meets them:
     1. TIME TO FIRST PLAY  -- link tapped to the person MOVING, not to "loaded"
     2. FRAMES WALKING      -- delivered per second, on the demo, on a phone shape
     3. FRAMES FIGHTING     -- the same, in a fight, on the beat
     4. THE MAIN THREAD     -- how busy it is, which is what a battery pays for

   TWO NUMBERS PER LINE, AND THE DIFFERENCE BETWEEN THEM IS THE POINT.

     THE GOAL is Paolo's, off the board: 60 walking, 60 in the fight, first play
     under five seconds. It is REPORTED every run and never asserted, because the
     build misses all three today by a wide margin and a gate that is red on
     arrival gets switched off by the next session that hits it. The distance to
     the goal is printed on every run so nobody gets to forget it is missed.

     THE BUDGET is a RATCHET pinned at what this build measured on 9/5, with
     headroom for the spread that was measured alongside it. It only ever comes
     down. It does not ask the game to be fast; it makes the day somebody makes
     it SLOWER a red line instead of a slow drift nobody notices. That is the
     same shape frame_budget_gate chose on 8/15 and for the same reason.

   WHY A RATCHET NEEDS A CORRECTNESS FLOOR. Any frame-rate budget can be won by
   drawing less than the game needs -- the cheapest way to hit 60 fps is to paint
   nothing. So the speed lines are never asserted alone:
       - the walk must MOVE THE PERSON (cells > 0) on the same gesture, and
       - the paint probe must have seen real render calls, and
       - the empty-page yardstick in the same browser in the same run must be
         near 60, or this host cannot judge a frame rate at all and the gate says
         so rather than passing on a number it cannot trust.

   WHAT WAS ACTUALLY MUTATION-CHECKED, 9/5, AND WHAT WAS NOT. This repo's own
   lesson, from frame_budget_gate's header: "Inferring a checker's blind spot is
   the same error as inferring its coverage." So this list says which lines were
   made to bite by experiment and which were not.

     CONFIRMED -- CARD IN THE WAY. #daycard left up over the pad: the walk moved
       nobody (0 cells) and the paint probe saw 0 renders, so `valid` goes false
       and this gate refuses the sample instead of reporting a healthy-looking
       0 fps. Not hypothetical -- it is how the control run first reported 0 fps
       before anybody knew the card was there.
     CONFIRMED -- A SLOWER MACHINE, which is a stand-in for a heavier game. The
       same demo at CPU x4: first play 67,171 ms (budget 26,500), main thread
       94.8% (budget 52), a fight at 3.3 fps (budget 12). Three lines bite and
       name their numbers.
     CONFIRMED NOT TO BITE AT x4 -- FRAMES WALKING, and this is worth knowing
       rather than hiding: the settled walk held 35 fps under a 4x throttle,
       inside its 24 fps floor. A single render costs 1.7 ms, so four times that
       is still comfortably inside a 16.7 ms frame. That line guards against a
       regression in the WALK'S OWN cost; it is not a general slowness alarm, and
       the main-thread and first-play lines are what catch that.
     NOT CHECKED -- PAINTING NOTHING (make render() return early). It would be
       caught by the same `valid` floor the card mutation confirmed, since the
       probe counts real render calls, but proving it means editing slices/, and
       this lane may not touch slices/ content. Reasoned, not measured, and
       labelled as such.

   IT MEASURES THE DEMO, NOT THE ALPHA, because the demo is the thing that goes
   into somebody's hands (RUN's lane rule, 9/5: "the demo is never held for more
   content"). The alpha's numbers live in the record beside it.

   AND IT DOES NOT CLAIM A REAL PHONE. Chromium at a phone viewport with a CPU
   throttle is a stand-in, not a handset. Every line here says which it is, and
   the record names what is still owed on real hardware -- battery in ten
   minutes, above all, which no container can honestly report.

     node gates/fps_on_a_phone_gate.js
     node gates/fps_on_a_phone_gate.js --record-only   (skip the live run)
   ========================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
process.chdir(ROOT);

const PERF = require(path.join(__dirname, 'bohemia_phone_perf.js'));
const RECORD = path.join(ROOT, 'records/BOHEMIA_PHONE_PERF_9_5_26.json');
const WRITEUP = path.join(ROOT, 'records/BOHEMIA_PHONE_PERF_9_5_26.md');

let pass = 0, fail = 0;
const ok = (n, c, why) => {
  if (c) pass++;
  else { fail++; console.log('  FAIL: ' + n + (why ? '   [' + why + ']' : '')); }
};
const done = () => {
  console.log('\n=== FPS ON A PHONE GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
};

/* ---- 1. THE MEASUREMENT IS ON DISK AND IT IS WHOLE --------------------- */
ok('the phone-speed measurement is on disk -- a budget with no measurement under ' +
   'it is a wish', fs.existsSync(RECORD));
ok('and the readable write-up is beside it, because a JSON file is not something ' +
   'anybody reads', fs.existsSync(WRITEUP));
if (fail) done();

let R;
try { R = JSON.parse(fs.readFileSync(RECORD, 'utf8')); }
catch (e) { ok('the measurement parses', false, e.message); done(); }

for (const k of ['measured', 'budget', 'goal', 'owed', 'takenOn', 'refreshCommand', 'host'])
  ok('the record carries ' + k, R[k] != null);

/* THE JOB NAMED FOUR NUMBERS. All four are in the record or the row is not done,
   and "we did not get to it" is a fact the record has to carry rather than a
   silence the gate lets through. */
for (const k of ['timeToFirstPlayMs', 'walkFpsSettled', 'walkFpsFirstMinute',
                 'fightFps', 'mainThreadBusyWalkingPercent', 'bytesToFirstPlay'])
  ok('the record measured ' + k + ' -- the row asked for it by name', R.measured[k] != null);
ok('and it says out loud what is still owed on a real handset, rather than ' +
   'letting an emulated number pass for a phone', Array.isArray(R.owed) && R.owed.length > 0);
if (fail) done();

/* ---- 2. IT HAS NOT ROTTED ----------------------------------------------- *
   A speed measurement is worse than useless once it is old: it reads as
   reassurance about a build that no longer exists. Same argument, same shape as
   repo_budget_gate's staleness check.                                        */
const ageDays = (Date.now() - Date.parse(R.takenOn)) / 86400000;
ok('the measurement is not stale (taken ' + ageDays.toFixed(1) + ' days ago, limit ' +
   R.staleAfterDays + '). Refresh it with: ' + R.refreshCommand,
   isFinite(ageDays) && ageDays <= R.staleAfterDays);

/* ---- 3. THE GOAL IS PRINTED WHETHER IT IS MET OR NOT --------------------- */
const M = R.measured, G = R.goal, B = R.budget;
console.log('\n  THE GOAL (Paolo\'s, off the board) vs WHAT THIS BUILD DOES:');
const gap = (label, got, want, unit, lowerIsBetter) => {
  const met = lowerIsBetter ? got <= want : got >= want;
  console.log('    ' + label.padEnd(30) + String(got).padStart(8) + unit +
              '  goal ' + want + unit + '   ' + (met ? 'MET' : 'MISSED by ' +
              (lowerIsBetter ? (got / want).toFixed(1) + 'x' : (want - got).toFixed(0) + unit)));
};
gap('time to first play', M.timeToFirstPlayMs, G.timeToFirstPlayMs, ' ms', true);
gap('frames walking, settled', M.walkFpsSettled, G.walkFps, ' fps', false);
gap('frames walking, first minute', M.walkFpsFirstMinute, G.walkFps, ' fps', false);
gap('frames in a fight', M.fightFps, G.fightFps, ' fps', false);
console.log('    (the goal is never asserted here -- see the header. The budget below is.)');

/* ---- 4. THE LIVE RUN ---------------------------------------------------- */
if (process.argv.includes('--record-only')) {
  console.log('\n  --record-only: the live run was skipped, so the ratchet below held NOTHING ' +
              'this time. That is not a pass, it is a partial check.');
  done();
}

(async () => {
  let r;
  try {
    r = await PERF.measure({
      page: 'demo', cpu: 1, net: 'none', holdMs: 5000, fightMs: 4000,
      fight: true, battery: false, log: s => console.log(s)
    });
  } catch (e) {
    ok('the demo booted far enough to be measured at all', false, e.message);
    done();
  }

  /* --- the yardstick. no yardstick, no verdict. --- */
  ok('this host can hand an EMPTY canvas near 60 fps (' + r.emptyPageCeilingFps +
     ' fps), so a frame-rate verdict from it means something. Under that, the ' +
     'numbers below are about the box and not about the game, and this gate ' +
     'refuses to pretend otherwise',
     r.emptyPageCeilingFps >= B.minimumHostCeilingFps,
     r.emptyPageCeilingFps + ' fps to an empty page');

  /* --- the correctness floor, before any speed claim --- */
  ok('THE WALK SAMPLE IS REAL: the thumb moved the person (' + r.walk.cells +
     ' cells) and the paint probe saw real frames (' + r.walk.renders + '). A ' +
     'frame-rate budget won by drawing nothing, or measured through a card ' +
     'nobody could tap past, is the failure mode this line exists for',
     r.walk.valid && r.walk.cells > 0);
  ok('the wake card was cleared off the pad before the sample -- #daycard is ' +
     'inset:0 and it sits over all eight direction buttons on boot',
     r.walk.wayCleared);

  /* --- the ratchet --- */
  console.log('\n  THE RATCHET (today\'s truth, and it may only ever come down):');
  const hold = (label, got, limit, unit, lowerIsBetter, note) => {
    const good = lowerIsBetter ? got <= limit : got >= limit;
    console.log('    ' + label.padEnd(30) + String(got).padStart(8) + unit +
                '  budget ' + (lowerIsBetter ? '<= ' : '>= ') + limit + unit);
    ok(label.toUpperCase() + ' STAYS WITHIN ITS MEASURED BUDGET (' + got + unit +
       (lowerIsBetter ? ' <= ' : ' >= ') + limit + unit + '). ' + (note || ''), good,
       got + unit);
  };
  hold('time to first play', r.firstPlay.firstStep, B.timeToFirstPlayMs, ' ms', true,
       'THE RATCHET ONLY EVER COMES DOWN: the day somebody makes the door slower, ' +
       'this line is how it is found.');
  hold('frames walking, settled', r.walk.rendersPerSecond, B.walkFpsSettled, ' fps', false,
       'Frames DELIVERED over wall time, not the median gap -- the gap distribution ' +
       'is bimodal and its median reports the best moment of the walk as if it were the walk.');
  hold('main thread walking', r.walk.cpu.busyPercent, B.mainThreadBusyWalkingPercent, ' %', true,
       'This is what a battery pays for, and it is the number a real handset will ' +
       'turn into heat and then into a thermal throttle.');
  hold('bytes to first play', r.transfer.bytesToFirstPlay, B.bytesToFirstPlay, ' bytes', true,
       'Everything a stranger has to download before they can move. On a slow 4G ' +
       'link this is seconds of staring at a logo.');

  if (r.fight && r.fight.reached) {
    hold('frames in a fight', r.fight.rafFramesPerSecond, B.fightFps, ' fps', false,
         'The fight is where the 120 BPM law lives; a beat the frames cannot keep up ' +
         'with is a beat nobody can play to.');
    console.log('    fight painting cost: ' + r.fight.drawCallsPerFrame +
                ' drawImage calls a frame (recorded: ' + M.fightDrawCallsPerFrame + ')');
  } else {
    ok('THE FIGHT WAS REACHED AND MEASURED. A perf gate that quietly skips the ' +
       'fight is a perf gate with no opinion about the surface the 120 BPM law ' +
       'governs', false, (r.fight && r.fight.why) || 'no fight sample');
  }

  /* --- and the shell tax, which is the finding this round turned up --- */
  console.log('\n  THE SHELL TAX: the walked city is the same page inside the demo and on ' +
              'its own.\n    inside the demo   ' + r.walk.rendersPerSecond + ' fps walking, ' +
              r.walk.cpu.busyPercent + '% of the main thread' +
              '\n    recorded alone    ' + M.controlWalkFpsSettled + ' fps walking, ' +
              M.controlMainThreadBusyWalkingPercent + '% of the main thread' +
              '\n    A same-origin iframe shares its parent\'s main thread, so every ' +
              'millisecond the shell\n    spends is a millisecond the city cannot draw in. ' +
              'That gap belongs to RUN, not here.');
  done();
})().catch(e => { ok('the gate ran to the end', false, e.message); done(); });
