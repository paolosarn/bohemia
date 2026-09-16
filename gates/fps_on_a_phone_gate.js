#!/usr/bin/env node
/* __BOHEMIA_SOLO__ -- THIS GATE MEASURES TIME, SO IT RUNS WITH THE BOX TO ITSELF.
   The suite runs four gates at once, which is what makes it finish and also what
   makes a stopwatch lie: it already had to re-run FIGHT MUSIC and FIRST NIGHT
   alone to find out they were green. A gate whose whole subject is time cannot
   be scheduled beside anything. The marker above is what gates/bohemia_gates.py
   reads to pull this out of the pool and run it on its own; any gate that
   measures time may opt in the same way. */
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
ok('the budget records the machine speed it was set on, so a slower or busier box ' +
   'can be corrected for instead of going red at the hardware', R.budget &&
   typeof R.budget.takenAtCpuYardstickMs === 'number');

/* THE JOB NAMED FOUR NUMBERS. All four are in the record or the row is not done,
   and "we did not get to it" is a fact the record has to carry rather than a
   silence the gate lets through. */
for (const k of ['timeToFirstPlayMs', 'walkFpsSettled', 'walkFpsFirstMinute',
                 'fightFps', 'mainThreadBusyWalkingPercent', 'bytesToFirstPlay',
                 'beatMissedPercentDuringBoot', 'beatMissedPercentSettled'])
  ok('the record measured ' + k + ' -- the row asked for it by name', R.measured[k] != null,
     /* NAME THE CAUSE, DO NOT JUST SAY THE KEY IS MISSING. (9/16, PLUMBER.) A null here
        almost never means a malformed record; it means the instrument could not take
        that measurement on the surface as it stands, and the next reader should be sent
        at the surface rather than at the JSON. The first-play lines are null right now
        because #daycard is inset:0 and sits over all eight direction buttons on boot, so
        the driven thumb has nothing to press. THE HONEST MOVE IS TO LET THIS GO RED
        rather than carry the last number that happened to get through: a measurement you
        cannot take is not a measurement of the old value, and that substitution is the
        exact "stale reassurance" this file keeps arguing against. */
     /[Ff]irst[Pp]lay/.test(k)
       ? 'the instrument could not reach a first step at all. Measured cause: #daycard is '
         + 'inset:0 and sits over all eight direction buttons on boot, so a driven thumb '
         + 'has nothing to press. That is a surface bug and it belongs to RUN; this gate '
         + 'reports it rather than carrying the last number that got through.'
       : 'the record has no value for this. Re-run ' + (R.refreshCommand || 'the refresh')
         + '; if it stays null, the instrument could not take the measurement and the '
         + 'reason is on the surface, not in this file.');
ok('and it says out loud what is still owed on a real handset, rather than ' +
   'letting an emulated number pass for a phone', Array.isArray(R.owed) && R.owed.length > 0);

/* ONE MISSING MEASUREMENT MUST NOT BLIND EVERY OTHER CHECK. (9/16, PLUMBER.)
   This used to be a flat `if (fail) done()`, so the moment ANY line above went red the
   gate stopped and the other thirty-odd checks never ran. Measured today: a card sat
   over the movement pad, first play could not be taken, and a gate with 34 working
   checks reported 18 passed / 1 failed and told nobody anything else. A surface bug in
   one lane blinded the whole speed report.
   THE VERDICT DOES NOT CHANGE -- a red is still a red and the exit code is still 1.
   What changes is that the rest of the run still happens, so one blocked measurement
   costs one line instead of the whole page. The gate only gives up when the record is
   STRUCTURALLY unusable, because then there is genuinely nothing to read. */
const usable = R.measured && R.budget && R.goal
  && typeof R.budget.takenAtCpuYardstickMs === 'number';
if (!usable) {
  console.log('\n  the record is structurally unusable, so there is nothing further to '
    + 'check. Refresh it with: ' + (R.refreshCommand || '(no command on file)'));
  done();
}
if (fail) console.log('\n  ' + fail + ' line(s) above are red. CARRYING ON ANYWAY: the '
  + 'record is readable, so the rest of this gate still has something to say, and a '
  + 'missing measurement should cost one line and not the whole page.');

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

/* ---- 3b. AND WHAT THE SAME BUILD DOES ON A PHONE-SHAPED CPU -------------- *
   ADDED 9/15 (PLUMBER, row [sixty fps], after Paolo's second play: "it's kinda not
   running as smoothly as I would like").

   EVERY NUMBER ABOVE IS TAKEN ON A MACHINE SEVERAL TIMES FASTER THAN HIS PHONE, and
   until this round nobody reading this gate was told so. The instrument has measured a
   4x throttle since 9/5 and the documented refresh threw it away (`--cpu 1 --record`),
   so "the fight runs at 60" went on the board while the same build ran the fight at 20
   on a phone-shaped CPU. Both sentences were true and only one of them was printed.

   The VALUES are reported and never asserted, exactly like the goal block: the ratchet
   that protects this build is the 1x one, and a line that is red on arrival gets
   switched off by the next session that hits it. What IS asserted is that the block
   EXISTS -- a record with no phone-shaped pass is a record that has quietly gone back
   to describing the wrong machine, and that is the failure this whole round was about. */
const P = R.onAPhoneShapedCpu;
console.log('\n  AND THE SAME BUILD ON A PHONE-SHAPED CPU (reported, never asserted):');
if (!P) {
  console.log('    THE RECORD CARRIES NO PHONE-SHAPED PASS. Refresh with ' + R.refreshCommand
    + ' and do NOT pin it to --cpu 1.');
} else {
  const row = (label, a, b, unit) => console.log('    ' + label.padEnd(30)
    + String(a == null ? '?' : a).padStart(9) + unit + ' at 1x  ->  '
    + String(b == null ? '?' : b).padStart(9) + unit + ' at ' + P.cpuThrottle + 'x');
  row('the fight', M.fightFps, P.fightFps, ' fps');
  row('boot blocked the main thread', M.mainThreadBlockedMsDuringBoot, P.mainThreadBlockedMsDuringBoot, ' ms');
  row('...in this many long tasks', M.longTaskCount, P.longTaskCount, '');
  row('the worst single block', M.longestSingleBlockMs, P.longestSingleBlockMs, ' ms');
  row('beats late once settled', M.beatLatePercentSettled, P.beatLatePercentSettled, ' %');
  row('THE WALKED CITY ALONE', P.controlWalkFpsAt1x, P.controlWalkFpsAt4x, ' fps');
  console.log('    the throttle is real: the yardstick reads ' + P.yardstickMsAt1x
    + ' ms at 1x and ' + P.yardstickMsAt4x + ' ms at ' + P.cpuThrottle + 'x');
  console.log('    ' + P.walkNote);
  if (P.controlWalkFpsAt4x != null && P.controlWalkFpsAt1x != null
      && P.controlWalkFpsAt4x > P.controlWalkFpsAt1x * 0.9) {
    console.log('    *** READ THAT LAST ROW: the walked city on its own BARELY MOVES under'
      + ' the throttle. The renderer is not what collapses on a phone. The SHELL BOOT is. ***');
  }
}
ok('the record carries a phone-shaped pass, so nobody can quote a frame rate off this '
   + 'gate without seeing what the same build does on a slow CPU', !!P,
   'refresh with ' + R.refreshCommand + ', and never pin that command to --cpu 1');

/* ---- 3c. AND NO BUDGET LINE MAY BE SO LOOSE IT STOPS BEING ONE ----------- *
   ADDED 9/16 (PLUMBER, row [sixty fps]). This gate held the fight at >= 10 fps while
   the build delivered 57. A 5.7x regression would have passed green, and nothing here
   said a word about it, because a budget is only ever compared to the RUN, never to
   the measurement it came from.

   The cause is fixed where it belongs, in the writer: buildRecord now clamps each line
   to that metric's own measured spread plus a stated margin. THIS IS THE SECOND LOCK.
   If the clamp is ever removed, bypassed, or quietly widened, the number shows up here
   instead of sitting in a JSON file nobody opens.

   THE FACTOR IS 2, and it is deliberately far looser than the clamp (about 1.25x) so
   it only fires on something genuinely broken rather than on an ordinary refresh. A
   guard that argues with normal operation gets switched off, which is the failure this
   whole pair of files keeps circling.

   LINES THE RECORD SAYS WERE NOT CLAMPED ARE SKIPPED, not silently passed: a metric
   whose band carried fewer than three samples has no spread to reason about, and this
   prints which ones and why rather than letting the reader assume they were checked. */
const LOOSE = 2;
const basis = (R.budget && R.budget.__basis) || {};
const unclamped = new Set(basis.notClampedTooFewSamples || []);
/* AND THE LINES THE WRITER EXCLUDED ON PURPOSE. (fixed 9/16, an hour after the guard
   above was written, by running it.) The first cut of this guard skipped only the
   too-few-samples lines, so it went red on the two walk lines and told the reader to
   "refresh the record so the clamp re-derives this line" -- advice that CANNOT WORK,
   because the writer excludes those two deliberately and a refresh will do nothing.
   A guard that hands out a fix which does not fix anything is worse than no guard: it
   spends somebody's afternoon and then it gets switched off.
   THEY ARE STILL PRINTED, WITH THEIR SLACK AND THEIR REASON. The looseness is real and
   worth seeing every run (one of them is 7.8x). What it is not is a red that any amount
   of re-running can clear, and the action it needs has a name: reconcile the record's
   walk sample with this gate's live walk, which is a job, not a refresh. */
const onPurpose = basis.notClampedOnPurpose || {};
const HELD = [
  ['fightFps', M.fightFps, 'lo'],
  ['walkFpsSettled', M.walkFpsSettled, 'lo'],
  ['bytesToFirstPlay', M.bytesToFirstPlay, 'hi'],
  ['mainThreadBusyWalkingPercent', M.mainThreadBusyWalkingPercent, 'hi'],
  ['beatMissedPercentSettled', M.beatMissedPercentSettled, 'hi'],
  ['timeToFirstPlayMs', M.timeToFirstPlayMs, 'hi'],
];
console.log('\n  IS EACH BUDGET STILL A BUDGET? (how far it sits from what the build does)');
for (const [key, got, dir] of HELD) {
  const lim = B[key];
  if (lim == null || got == null || !isFinite(got) || got === 0) {
    console.log('    ' + key.padEnd(30) + ' no measurement on file, nothing to compare');
    continue;
  }
  const slack = dir === 'lo' ? got / lim : lim / got;
  const why = '    ' + key.padEnd(30) + ' build ' + String(got).padStart(10)
    + ', budget ' + String(lim).padStart(10) + '   ' + slack.toFixed(2) + 'x of slack';
  if (unclamped.has(key)) { console.log(why + '   (not clamped: too few samples)'); continue; }
  if (onPurpose[key]) {
    console.log(why + '\n         NOT CLAMPED ON PURPOSE, and not a red a refresh can clear: '
      + onPurpose[key]);
    continue;
  }
  console.log(why);
  ok(key.toUpperCase() + ' IS STILL A BUDGET (' + slack.toFixed(2) + 'x of slack, limit '
    + LOOSE + 'x)', slack <= LOOSE,
    'the build does ' + got + ' and the gate would accept ' + lim + '. A regression of '
    + slack.toFixed(1) + 'x would pass green, which is not a budget, it is a decoration. '
    + 'Refresh the record (' + R.refreshCommand + ') so the clamp re-derives this line.');
}

/* ---- 4. THE LIVE RUN ---------------------------------------------------- */
if (process.argv.includes('--record-only')) {
  console.log('\n  --record-only: the live run was skipped, so the ratchet below held NOTHING ' +
              'this time. That is not a pass, it is a partial check.');
  done();
}

let hold;
(async () => {
  let r;
  try {
    r = await PERF.measure({
      /* skipFirstMinute: the record measures the first-minute walk and this gate
         never asserted it, so paying six seconds a run to re-measure something
         nothing checks is six seconds taken off a suite that has none to spare. */
      page: 'demo', cpu: 1, net: 'none', holdMs: 4000, fightMs: 3000,
      fight: true, skipFirstMinute: true, skipIdleWindows: true, battery: false,
      log: s => console.log(s)
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
  /* ---- THE YARDSTICK CORRECTION ---------------------------------------- *
     A TIME BUDGET WITHOUT ONE OF THESE GOES RED ON A BUSY AFTERNOON AND GETS
     SWITCHED OFF. Measured on one tree this session: the demo reached its first
     step in 14.1 s on a quiet box and 19.9 s an hour later on the same tree with
     nothing in the game changed. The empty-page rAF ceiling cannot see that --
     it reads 60.x whatever else is running, because vsync is not contended.
     So the instrument times a fixed lump of integer work in the page, the budget
     records the value it was set against, and the time and frame-rate lines are
     judged against a budget scaled by the ratio. Validated by throttling: the
     yardstick reads 28.1 / 62.8 / 123.6 ms at CPU x1 / x2 / x4, spread under
     3 ms, so it tracks machine speed almost exactly.
     THE SCALE IS CLAMPED, because a correction must never become an excuse. Past
     the cap this is no longer a busy afternoon, it is a box that cannot judge a
     frame rate, and the gate says so instead of passing. */
  const liveYard = r.cpuYardstick ? r.cpuYardstick.ms : null;
  const baseYard = B.takenAtCpuYardstickMs || null;
  let scale = 1, scaleWhy = 'no yardstick in the record or the run, so nothing is scaled';
  if (liveYard && baseYard) {
    const raw = liveYard / baseYard;
    scale = Math.min(B.maxYardstickScale || 3, Math.max(0.8, raw));
    scaleWhy = 'this box ran the yardstick in ' + liveYard + ' ms against the ' + baseYard +
               ' ms the budget was set on, so it is ' + raw.toFixed(2) + 'x' +
               (raw === scale ? '' : ' (clamped to ' + scale.toFixed(2) + 'x)');
    ok('THIS BOX IS WITHIN ' + (B.maxYardstickScale || 3) + 'x OF THE ONE THE BUDGET WAS ' +
       'SET ON (' + raw.toFixed(2) + 'x). Past that, a slow number says nothing about the ' +
       'game and this gate will not pretend it does',
       raw <= (B.maxYardstickScale || 3), raw.toFixed(2) + 'x slower');
  }
  console.log('\n  THE RATCHET (today\'s truth, and it may only ever come down):');
  console.log('    yardstick: ' + scaleWhy);
  hold = (label, got, limit, unit, lowerIsBetter, note, scaleAs) => {
    /* time ceilings stretch with a slow box; frame-rate floors drop with one.
       bytes and percentages are properties of the build, not of the afternoon,
       and are never scaled. */
    let lim = limit;
    if (scaleAs === 'time') lim = Math.round(limit * scale);
    else if (scaleAs === 'fps') lim = +(limit / scale).toFixed(1);
    const good = lowerIsBetter ? got <= lim : got >= lim;
    console.log('    ' + label.padEnd(30) + String(got).padStart(8) + unit +
                '  budget ' + (lowerIsBetter ? '<= ' : '>= ') + lim + unit +
                (lim !== limit ? '  (' + limit + unit + ' scaled by ' + scale.toFixed(2) + 'x)' : ''));
    ok(label.toUpperCase() + ' STAYS WITHIN ITS MEASURED BUDGET (' + got + unit +
       (lowerIsBetter ? ' <= ' : ' >= ') + lim + unit +
       (lim !== limit ? ', scaled from ' + limit + unit + ' for a ' + scale.toFixed(2) +
        'x slower box' : '') + '). ' + (note || ''), good, got + unit);
  };
  hold('time to first play', r.firstPlay.firstStep, B.timeToFirstPlayMs, ' ms', true,
       'THE RATCHET ONLY EVER COMES DOWN: the day somebody makes the door slower, ' +
       'this line is how it is found.', 'time');
  hold('frames walking, settled', r.walk.rendersPerSecond, B.walkFpsSettled, ' fps', false,
       'Frames DELIVERED over wall time, not the median gap -- the gap distribution ' +
       'is bimodal and its median reports the best moment of the walk as if it were the walk.',
       'fps');
  hold('main thread walking', r.walk.cpu.busyPercent, B.mainThreadBusyWalkingPercent, ' %', true,
       'This is what a battery pays for, and it is the number a real handset will ' +
       'turn into heat and then into a thermal throttle.');
  hold('bytes to first play', r.transfer.bytesToFirstPlay, B.bytesToFirstPlay, ' bytes', true,
       'Everything a stranger has to download before they can move. On a slow 4G ' +
       'link this is seconds of staring at a logo.');

  /* --- THE BEAT, WHICH IS A LAW AND NOT A PREFERENCE --- */
  if (r.beatSettled && r.beatSettled.watched) {
    console.log('    the beat, settled: ' + r.beatSettled.latePercent + '% late, ' +
                r.beatSettled.missedBeatPercent + '% swallowed whole, median gap ' +
                r.beatSettled.gapMs.med + ' ms against ' + r.beatSettled.beatMs +
                ' (timer picked by ' + r.beatSettled.pickedBy + ')');
    ok('THE 120 BPM BEAT LANDS ON TIME ONCE THE WORLD HAS SETTLED (' +
       r.beatSettled.missedBeatPercent + '% of beats swallowed whole, budget <= ' +
       B.beatMissedPercentSettled + '%). This is the 120 BPM LAW\'s first real check in ' +
       'this repo: every other gate that touches it asserts that the number 500 is in the ' +
       'code or that a step happened, never that the step happened WHEN IT WAS DUE. A ' +
       'metronome is a setInterval, and a setInterval on a blocked main thread does not ' +
       'run late by a little -- it runs when the thread is free, and the game is then ' +
       'playing to a clock the music is not on',
       r.beatSettled.missedBeatPercent <= B.beatMissedPercentSettled,
       r.beatSettled.missedBeatPercent + '%');
    ok('...and the metronome was found by its 500ms period rather than by being the ' +
       'busiest timer around. The first draft of this check picked a 400ms UI ticker and ' +
       'reported a perfect beat off the wrong clock',
       /500ms period/.test(r.beatSettled.pickedBy), r.beatSettled.pickedBy);
  } else {
    ok('THE BEAT WAS WATCHED AT ALL. A speed gate on a game whose whole combat law is ' +
       '120 BPM cannot shrug about the metronome', false,
       (r.beatSettled && r.beatSettled.why) || 'no beat sample');
  }
  if (r.beatDuringBoot && r.beatDuringBoot.watched) {
    console.log('    the beat, through the boot: ' + r.beatDuringBoot.latePercent + '% late, ' +
                r.beatDuringBoot.missedBeatPercent + '% SWALLOWED WHOLE, worst gap ate ' +
                r.beatDuringBoot.worstBeatsSwallowed + ' beats (recorded: ' +
                M.beatMissedPercentDuringBoot + '% swallowed). REPORTED, NOT ASSERTED -- ' +
                'fixing it is [slim build] and [hot path], not this gate\'s to demand.');
  }

  if (r.fight && r.fight.reached) {
    hold('frames in a fight', r.fight.rafFramesPerSecond, B.fightFps, ' fps', false,
         'The fight is where the 120 BPM law lives; a beat the frames cannot keep up ' +
         'with is a beat nobody can play to.', 'fps');
    console.log('    fight painting cost: ' + r.fight.drawCallsPerFrame +
                ' drawImage calls a frame (recorded: ' + M.fightDrawCallsPerFrame + ')');
  } else {
    ok('THE FIGHT WAS REACHED AND MEASURED. A perf gate that quietly skips the ' +
       'fight is a perf gate with no opinion about the surface the 120 BPM law ' +
       'governs', false, (r.fight && r.fight.why) || 'no fight sample');
  }

  /* --- THE ALPHA, BY A BOOT PASS --------------------------------------- *
     The row says "the demo AND the alpha" and until now this gate held only the
     demo, which left the surface he actually taps -- the one link, forever --
     with no budget on it at all. A full second pass was tried first and MEASURED
     122 SECONDS against the 60 this gate had been, in a suite that finishes with
     forty-nine seconds to spare; a gate that makes the suite unrunnable protects
     nothing. So the alpha gets a boot pass for about twenty seconds and the gate
     lands at 75s. The fight is the same COMBAT_B64 frame in both files (within
     1.5 fps: 19.0 alpha, 17.8 demo) and the walked city is the same file, so what
     only the alpha can break is its own shell -- which is what a boot measures. */
  if (B.alphaTimeToFirstPlayMs == null) {
    ok('the record carries an alpha budget -- the row says "the demo AND the alpha"',
       false, 'no alpha lines in the budget; refresh the record');
  } else {
    let a;
    try {
      a = await PERF.measure({
        page: 'alpha', cpu: 1, net: 'none', holdMs: 4000, fightMs: 0,
        fight: false, lean: 'boot', battery: false, log: s => console.log('  [alpha] ' + s)
      });
    } catch (e) {
      ok('the alpha booted far enough to be measured at all', false, e.message);
      a = null;
    }
    if (a) {
      console.log('\n  THE ALPHA (BOOT PASS ONLY: first play, the beat through the boot, and the ' +
                  'bytes.\n  IT DOES NOT WALK OR FIGHT HERE, and that is a stated blind spot, not an ' +
                  'oversight:\n  a full second surface took this gate from 60s to 122s in a suite with ' +
                  '49s of headroom.\n  The walked city inside the alpha is the same file the demo pass ' +
                  'above measured;\n  what only the alpha can break is its own shell, which is what a ' +
                  'boot measures.\n  The alpha\'s walk, fight and settled beat are measured in the ' +
                  'record, not by this gate.):');
      ok('THE ALPHA REACHED ITS FIRST STEP AT ALL -- a boot pass that never got a thumb to ' +
         'move anybody is a broken sample, not a fast one', a.firstPlay.movedAtAll === true);
      hold('alpha, time to first play', a.firstPlay.firstStep, B.alphaTimeToFirstPlayMs, ' ms', true,
           'The alpha is the ONE LINK under the 7/18 law: it is the only URL he ever gets.', 'time');
      if (a.beatDuringBoot && a.beatDuringBoot.watched) {
        console.log('    alpha, the beat through the boot: ' + a.beatDuringBoot.latePercent +
                    '% late, ' + a.beatDuringBoot.missedBeatPercent + '% swallowed whole ' +
                    '(demo this run: ' + (r.beatDuringBoot && r.beatDuringBoot.watched ?
                     r.beatDuringBoot.missedBeatPercent + '%' : 'not watched') +
                    '). REPORTED, NOT ASSERTED, same as the demo boot line.');
        ok('...and the alpha\'s metronome was found by its 500ms period, so the beat is being ' +
           'read off the 120 BPM clock and not off some UI ticker',
           /500ms period/.test(a.beatDuringBoot.pickedBy), a.beatDuringBoot.pickedBy);
      } else {
        ok('THE BEAT WAS WATCHED ON THE ALPHA TOO', false,
           (a.beatDuringBoot && a.beatDuringBoot.why) || 'no beat sample');
      }
      /* AND THE TWO FILES MUST STILL LOOK LIKE EACH OTHER -- ASSERTED ON THE
         NUMBER THAT DOES NOT MOVE. The obvious drift check is "do they reach the
         first step at the same time", and it is the wrong one: first play on this
         box swings by five seconds run to run (alpha read 19.2s and 15.9s on one
         tree), so a threshold loose enough not to flake is too loose to catch
         anything. BYTES BEFORE ANYTHING IS ON SCREEN does not move at all --
         6,306,224 on all three demo runs of one sample, to the byte -- because it
         is a property of the files, not of the afternoon. So that is what is
         asserted, and the timing gap is printed beside it as information. */
      const timeGap = Math.abs(a.firstPlay.firstStep - r.firstPlay.firstStep);
      const byteGap = Math.abs((a.firstPlay.bytesAtWorldReady || 0) -
                               (r.firstPlay.bytesAtWorldReady || 0));
      console.log('    first play : alpha ' + a.firstPlay.firstStep + ' ms vs demo ' +
                  r.firstPlay.firstStep + ' ms, ' + timeGap + ' ms apart (noisy, not asserted)');
      console.log('    bytes to a drawn city: alpha ' + a.firstPlay.bytesAtWorldReady +
                  ' vs demo ' + r.firstPlay.bytesAtWorldReady + ', ' + byteGap + ' apart');
      ok('THE DEMO AND THE ALPHA STILL NEED THE SAME BYTES TO PUT A CITY ON SCREEN (' +
         byteGap + ' bytes apart, budget <= ' + B.twinByteDriftBytes + '). They are ' +
         'near-identical files loading the same walked city, so this number should barely ' +
         'move; when it jumps, one of them got a change the other did not, and that is ' +
         'exactly the drift nobody would ever catch by hand',
         byteGap <= B.twinByteDriftBytes, byteGap + ' bytes apart');
    }
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
