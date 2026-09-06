#!/usr/bin/env node
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
  show('IN A FIGHT', L.fight);

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
                L.fight.msOfWorkPerBeat + ' of 500 ms), and ' +
                (L.fight.topSystems[0] || {}).percent + '% of everything it does is ' +
                (L.fight.topSystems[0] || {}).name + '.');
    console.log('    NOT ASSERTED, ON PURPOSE: any ceiling here is above 100% and can never ' +
                'fail, or below today and is red on arrival. Printed instead, every run,');
    console.log('    until the fight has headroom and a real line can be set. Recorded: ' +
                (R.measured.fight.msOfWorkPerBeat || '?') + ' ms.');
    ok('THE FIGHT WAS REACHED AND PROFILED. A beat gate that quietly skips the surface the ' +
       '120 BPM law governs is a gate with no opinion about the law',
       L.fight.samples > 5000, L.fight.samples + ' samples');
  } else {
    ok('THE FIGHT WAS REACHED AND PROFILED', false, (L.fight && L.fight.why) || 'no sample');
  }
  done();
})().catch(e => { ok('the gate ran to the end', false, e.message); done(); });
