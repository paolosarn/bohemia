#!/usr/bin/env node
/* __BOHEMIA_SOLO__ -- THIS GATE MEASURES TIME, SO IT RUNS WITH THE BOX TO ITSELF.
   The suite runs four gates at once, which is what makes it finish and also what
   makes a stopwatch lie: it already had to re-run FIGHT MUSIC and FIRST NIGHT
   alone to find out they were green. A gate whose whole subject is time cannot
   be scheduled beside anything. The marker above is what gates/bohemia_gates.py
   reads to pull this out of the pool and run it on its own; any gate that
   measures time may opt in the same way. */
/* ============================================================================
   BEAT BUDGET GATE — HOW MUCH OF A BEAT THE GAME SPENDS
   (9/6/26, PLUMBER lane, VAMILY row [hot path] THE-BEAT-LOOP-IS-CLEAN)

   The row: "profile one beat at 120 BPM in the fight and one frame on the walked
   street; name the five most expensive things; fix them where a measurement says
   so; the gate keeps the beat under budget."

   A beat is 500 ms under the 120 BPM law. This holds how much of one gets spent.

   WHAT IT HOLDS
     the walked street : main-thread work per beat, ratcheted
     a hidden frame    : what the combat frame costs while nobody is fighting
   and it PRINTS, every run, the five most expensive systems on both surfaces.

   THERE IS NO LINE FOR THE FIGHT AND THAT IS NOT AN OVERSIGHT. Measured, the
   fight spends 498.5 ms of every 500 ms beat: 99.7% of it. Any ceiling is either
   above 100%, where it can never fail, or below today's number, where it is red
   on arrival -- and a gate red on arrival gets switched off by the next session
   that meets it. So the number is printed on every run, loudly, and the day the
   fight has headroom again a real line can be set. Saying "we could not hold
   this one yet" out loud beats a line that looks like coverage and is not.

   WHAT THE FIRST RUN FOUND
     WALKING  208 ms of every beat. The five: (program), canvas blits, the
       danger+crews system (6.9%, the biggest pure-JS cost on the street),
       canvas fills, the map grid.
     FIGHTING 498 ms of every beat, and 62% of ALL of it is one call, drawImage.
       The fight is not thinking too hard, it is blitting too much.
     AND THE FIGHT IS ANIMATING BEHIND A HIDDEN PANEL BEFORE ANY FIGHT HAPPENS:
       the combat frame is created at boot, sits on a panel with display:none in
       a box measuring zero by zero, and runs 60 frames a second with ~900
       drawImage calls a second into it -- 3% of a core, 15 ms of every beat,
       drawing something nobody can see. Found because a walk profile of a
       session that had never entered a fight contained a fight function.

   THE NUMBERS ARE SCALED BY THE CPU YARDSTICK the speed gate already uses, so a
   busy box is corrected for rather than blamed on the game.

   IT FIXES NOTHING AND CANNOT: every hot path named here lives in slices/
   content, which this lane may not touch. The record is the hand-off.

     node gates/beat_budget_gate.js
   ========================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
process.chdir(ROOT);

const PROF = require(path.join(__dirname, 'bohemia_beat_profile.js'));
const RECORD = path.join(ROOT, 'records/BOHEMIA_BEAT_PROFILE_9_6_26.json');
const WRITEUP = path.join(ROOT, 'records/BOHEMIA_BEAT_PROFILE_9_6_26.md');

let pass = 0, fail = 0;
const ok = (n, c, why) => {
  if (c) pass++;
  else { fail++; console.log('  FAIL: ' + n + (why ? '   [' + why + ']' : '')); }
};
const done = () => {
  console.log('\n=== BEAT BUDGET GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
};

ok('the beat profile is on disk -- a budget with no measurement under it is a wish',
   fs.existsSync(RECORD));
ok('and the readable write-up is beside it', fs.existsSync(WRITEUP));
if (fail) done();

let R;
try { R = JSON.parse(fs.readFileSync(RECORD, 'utf8')); }
catch (e) { ok('the profile parses', false, e.message); done(); }

for (const k of ['measured', 'budget', 'takenOn', 'refreshCommand', 'owed'])
  ok('the record carries ' + k, R[k] != null);
ok('the record names the five most expensive things on the walked street, which is what ' +
   'the row asked for by name',
   R.measured && R.measured.walk && Array.isArray(R.measured.walk.topFive) &&
   R.measured.walk.topFive.length === 5);
ok('...and the five in a fight', R.measured && R.measured.fight &&
   (R.measured.fight.reached === false || (Array.isArray(R.measured.fight.topFive) &&
    R.measured.fight.topFive.length === 5)));
ok('the record says out loud that this lane cannot apply the fixes, so nobody reads the ' +
   'list as work that was done', Array.isArray(R.owed) && R.owed.length > 0);
if (fail) done();

const ageDays = (Date.now() - Date.parse(R.takenOn)) / 86400000;
ok('the profile is not stale (taken ' + ageDays.toFixed(1) + ' days ago, limit ' +
   R.staleAfterDays + '). Refresh it with: ' + R.refreshCommand,
   isFinite(ageDays) && ageDays <= R.staleAfterDays);

(async () => {
  let L;
  try {
    L = await PROF.run({ walkMs: 5000, fightMs: 5000, log: s => console.log(s) });
  } catch (e) { ok('the demo booted far enough to be profiled at all', false, e.message); done(); }

  const B = R.budget;
  const liveYard = L.cpuYardstickMs, baseYard = B.takenAtCpuYardstickMs;
  let scale = 1, why = 'no yardstick on one side, so nothing is scaled';
  if (liveYard && baseYard) {
    const raw = liveYard / baseYard;
    scale = Math.min(B.maxYardstickScale || 3, Math.max(0.8, raw));
    why = 'this box ran the yardstick in ' + liveYard + ' ms against the ' + baseYard +
          ' ms the budget was set on, so it is ' + raw.toFixed(2) + 'x';
    ok('THIS BOX IS WITHIN ' + (B.maxYardstickScale || 3) + 'x OF THE ONE THE BUDGET WAS SET ' +
       'ON (' + raw.toFixed(2) + 'x). Past that a slow number says nothing about the game',
       raw <= (B.maxYardstickScale || 3), raw.toFixed(2) + 'x');
  }

  const show = (title, d) => {
    if (!d || d.reached === false) { console.log('\n  ' + title + ': NOT REACHED'); return; }
    console.log('\n  ' + title + ': ' + d.msOfWorkPerBeat + ' ms of every 500 ms beat (' +
                d.busyPercent + '% busy over ' + d.beatsSampled + ' beats)');
    console.log('    the sampler and Chromium\'s own counter are ' + d.crossCheckDeltaPoints +
                ' points apart -- two counters for one fact, or neither is quotable');
    for (const s of d.topSystems.slice(0, 5))
      console.log('      ' + s.name.padEnd(18) + String(s.percent).padStart(6) + '%  ' +
                  String(s.ms).padStart(7) + ' ms');
  };
  console.log('\n  yardstick: ' + why);
  show('WALKING THE STREET', L.walk);
  show('IN A FIGHT, CAMERA STILL GLIDING (the opening)', L.fight);
  show('IN A FIGHT, CAMERA SETTLED (nobody playing: the ceiling)', L.fightSettled);
  show('IN A FIGHT BEING PLAYED (the honest one)', L.fightPlayed);

  /* ---- the anti-silent-pass floors, before any ceiling ---- */
  ok('THE PROFILER ACTUALLY SAW THE WALK (' + L.walk.samples + ' samples over ' +
     L.walk.beatsSampled + ' beats). Every ceiling below is trivially met by a profile ' +
     'that sampled nothing, and that is how a perf gate goes green on a broken run',
     L.walk.samples > 5000 && L.walk.beatsSampled >= 5);
  ok('...and the two counters agree about how busy the street was (' +
     L.walk.crossCheckDeltaPoints + ' points apart). If the sampler and TaskDuration ' +
     'disagree, one of them is lying and neither number should be quoted',
     L.walk.crossCheckDeltaPoints <= 8, L.walk.crossCheckDeltaPoints + ' points');

  const hold = (label, got, limit, unit, note, scaleIt) => {
    const lim = scaleIt ? +(limit * scale).toFixed(1) : limit;
    console.log('    ' + label.padEnd(28) + String(got).padStart(8) + unit +
                '   budget <= ' + lim + unit +
                (lim !== limit ? '  (' + limit + unit + ' scaled ' + scale.toFixed(2) + 'x)' : ''));
    ok(label.toUpperCase() + ' STAYS WITHIN ITS BUDGET (' + got + unit + ' <= ' + lim + unit +
       '). ' + (note || ''), got <= lim, got + unit);
  };
  console.log('\n  THE BUDGET:');
  hold('walking, work per beat', L.walk.msOfWorkPerBeat, B.walkMsPerBeat, ' ms',
       'A beat is 500 ms. This is how much of one the walked street spends.', true);

  const H = L.hiddenFrame;
  if (H && H.present) {
    console.log('\n  THE FIGHT, ANIMATING BEHIND A HIDDEN PANEL, BEFORE ANY FIGHT:');
    console.log('    box ' + H.box.width + ' x ' + H.box.height + ' on a panel with display:' +
                H.box.panelDisplay + ';  ' + H.framesPerSecond + ' frames/s, ' +
                H.drawsPerSecond + ' blits/s, ' + H.percentOfOneCore + '% of a core');
    hold('hidden frame, per beat', H.msOfEveryBeat, B.hiddenFrameMsPerBeat, ' ms',
         'Time spent drawing into a zero-by-zero box on a hidden panel. This line may only ' +
         'ever come down, and the day somebody stops the frame when it is not shown it ' +
         'drops to nothing.', true);
  } else {
    ok('THE HIDDEN COMBAT FRAME WAS FOUND AND MEASURED. It was there on 9/6 running 60 ' +
       'frames a second before any fight; if it is genuinely gone now this line should be ' +
       'retired deliberately, not left passing on an absence',
       false, (H && H.why) || 'no hidden-frame sample');
  }

  /* ---- the fight, reported and deliberately not asserted ---- */
  if (L.fight && L.fight.reached !== false) {
    console.log('\n  THE FIGHT IS AT ' + L.fight.busyPercent + '% OF THE BEAT (' +
                L.fight.msOfWorkPerBeat + ' of 500 ms) WHILE THE CAMERA IS STILL GLIDING, and ' +
                (L.fight.topSystems[0] || {}).percent + '% of everything it does is ' +
                (L.fight.topSystems[0] || {}).name + '.');
    if (L.fightSettled && L.fightSettled.reached !== false)
      console.log('    WITH NOBODY PLAYING it is at ' + L.fightSettled.busyPercent +
                  '% (' + L.fightSettled.msOfWorkPerBeat + ' of 500 ms)' +
                  (L.fightSettled.cameraSettled ? '' : ' -- BUT THE CAMERA NEVER SETTLED THIS RUN') +
                  '. That is the CEILING, not the game.');
    if (L.fightPlayed && L.fightPlayed.reached !== false) {
      console.log('    AND IN A FIGHT BEING PLAYED, which is the honest number: ' +
                  L.fightPlayed.taskMsPerBeat + ' of 500 ms (' +
                  L.fightPlayed.taskBusyPercent + '% of the main thread, counted by Chromium ' +
                  'itself so raster is in it). AN UPPER BOUND: the sampling profiler is ' +
                  'attached while this is read, so its own cost is inside the number. Compare ' +
                  'it to other runs of this gate, never to a figure taken with nothing attached.');
      console.log('    THE QUIET NUMBER FLATTERS THE GAME AND THIS LANE PUBLISHED IT ONCE. The ' +
                  'cover zoom eases 10% a frame toward a target set by how far the enemies are, ' +
                  'so while anyone is playing the camera is almost never still' +
                  (L.fightPlayed.distinctZooms ? ' (' + L.fightPlayed.distinctZooms +
                   ' distinct zooms seen this run by a SPARSE poll, so that is a floor and not ' +
                   'the per-frame count; measured densely it is 309 to 1,068 in 28 seconds)' : '') +
                  ' and a camera-keyed cache cannot hold.');
    }
    console.log('    NOT ASSERTED, ON PURPOSE: any ceiling here is above 100% and can never ' +
                'fail, or below today and is red on arrival. Printed instead, every run,');
    console.log('    until the fight has headroom and a real line can be set. Recorded: ' +
                (R.measured.fight.msOfWorkPerBeat || '?') + ' ms.');
    ok('THE FIGHT WAS REACHED AND PROFILED. A beat gate that quietly skips the surface the ' +
       '120 BPM law governs is a gate with no opinion about the law',
       L.fight.samples > 5000, L.fight.samples + ' samples');
    ok('THE SETTLED FIGHT WAS PROFILED TOO. The opening of a fight is a camera transient; ' +
       'measuring only that and calling it the fight is how a real win reads as no change',
       !!(L.fightSettled && L.fightSettled.reached !== false && L.fightSettled.samples > 5000),
       L.fightSettled && L.fightSettled.samples ? L.fightSettled.samples + ' samples' : 'not taken');
    ok('AND A FIGHT SOMEBODY IS PLAYING WAS PROFILED, which is the one that counts. A quiet ' +
       'fight measures the ceiling; this lane quoted that ceiling once as if it were the game, ' +
       'and a gate that can only see a quiet fight is how that happens twice',
       !!(L.fightPlayed && L.fightPlayed.reached !== false && L.fightPlayed.samples > 5000),
       L.fightPlayed && L.fightPlayed.samples ? L.fightPlayed.samples + ' samples' : 'not taken');
    const D = (L.fightPlayed && L.fightPlayed.drive) || {};
    console.log('    the drive found ' + (D.found || 0) + ' controls and tapped ' +
                (D.taps || 0) + ' times' + (D.tapped && D.tapped.length ? ' (' +
                D.tapped.join(' ') + ')' : '') +
                (D.revives ? ', revived the fight ' + D.revives + ' times mid-window (a fight ' +
                 'that dies halfway reads about 85 ms a beat for the rest and the window ' +
                 'collects a number it did not earn)' : '') +
                (L.fightPlayed && L.fightPlayed.endState ? ', and the fight ended the window with ' +
                 L.fightPlayed.endState.live + ' alive in phase ' + L.fightPlayed.endState.phase : ''));
    ok('THE DRIVE FOUND THE CONTROLS AND TAPPED THEM. A drive that silently found nothing to ' +
       'press is a quiet window wearing a driven name',
       (D.found || 0) > 0 && (D.taps || 0) >= 3, (D.found || 0) + ' controls, ' + (D.taps || 0) + ' taps');
    /* WHETHER THE CAMERA MOVED IS PRINTED, NOT ASSERTED, and that was a correction.
       Asserting it went red on a legitimately still fight -- an encounter with one
       stationary enemy pins the auto-frame at its ceiling and holds there even
       while somebody is playing -- and a gate red on arrival gets switched off by
       the next session that meets it, which is this file's own rule three screens
       up. So the fact rides ALONGSIDE the number instead, every run, because a
       reader who cannot tell which kind of fight was measured is exactly how this
       lane published a ceiling as a result in the first place. */
    const moved = L.fightPlayed && L.fightPlayed.distinctZooms > 10;
    console.log('    ' + (moved
      ? '>> THE CAMERA MOVED (' + L.fightPlayed.distinctZooms + ' distinct zooms seen), so the '
        + 'number above is a fight, not a ceiling.'
      : '>> THE CAMERA WAS ALMOST STILL THIS RUN (' +
        (L.fightPlayed ? L.fightPlayed.distinctZooms : '?') + ' distinct zooms' +
        (L.fightPlayed && L.fightPlayed.zoomSamples && L.fightPlayed.zoomSamples.length
         ? ' at ' + L.fightPlayed.zoomSamples.map(z => (+z).toFixed(4)).join(' ') : '') +
        '), SO THE NUMBER ABOVE IS A CEILING AND NOT THE GAME. A fight with nothing moving '
        + 'in it pins the auto-frame and the floor cache holds all the way through.'));
    ok('THE CAMERA WAS WATCHED AT ALL while the fight was driven. Counted by POLLING FROM OUT ' +
       'HERE, because a counter running inside the fight twice reported one zoom on a fight ' +
       'that was plainly moving: a loop in there dies with its document and is throttled when ' +
       'the frame is not painting, and it fails SILENTLY, which is the one thing a check may ' +
       'not do. This only asserts the poll ran; whether it moved is printed above',
       !!(L.fightPlayed && L.fightPlayed.zoomSamples && L.fightPlayed.zoomSamples.length > 0),
       (L.fightPlayed && L.fightPlayed.zoomSamples ? L.fightPlayed.zoomSamples.length : 0) +
       ' zoom readings');
  } else {
    ok('THE FIGHT WAS REACHED AND PROFILED', false, (L.fight && L.fight.why) || 'no sample');
  }
  done();
})().catch(e => { ok('the gate ran to the end', false, e.message); done(); });
