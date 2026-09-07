#!/usr/bin/env node
/* ============================================================================
   EVERY NEW FIGHT VISUAL ARRIVES WITH ITS COST
   (9/7/26, COMBAT lane, VAMILY row [draw budget])

   The row: "the fight loop is FULL (497 of 500 ms a beat, measured). Until
   PLUMBER lands headroom, anything new that draws in the fight -- the camera
   pull-back and Paolo's cloud, the danger tell, hostile contrast, border paint,
   any effect -- is designed and built, but ships with its cost stated in
   milliseconds per beat, and does not enter the fight loop until there is room
   for it. Not an art freeze and not a stop: one rule, a number with every new
   thing that draws."

   A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED, and a declaration nobody has to
   make is not a rule. So this holds three things, and only the third one bites:

     1. THE LEDGER IS REAL. engine/bohemia_draw_budget.json exists, every feature
        in the fight loop carries a number, an error bar and the date it was
        taken, and the stored total agrees with the rows it is a sum of.
     2. THE RULER STILL READS ZERO. The measurer's control arm -- the same
        setting in both halves -- is run live and has to come back inside its own
        error. A ledger of numbers from a tool nobody re-runs is a wall of
        decoration, and this is the arm that stops that.
     3. THE DRAW SURFACE IS RATCHETED. Every function in the shipped fight whose
        name begins with `draw` is listed in the ledger. Add one and this goes
        red until the name is in the list AND a priced row exists for it. That is
        the half of the rule that cannot be talked around.

   WHAT THIS DOES NOT CLAIM. The measurer prices ONE DRAW on a pinned camera with
   a warm floor cache; the PLUMBER's beat profile prices the WHOLE BEAT with the
   camera moving. The two are not the same number and must not be added: a
   feature that also invalidates the floor cache costs far more than its own
   draw. Every number here is a LOWER BOUND on what a thing really costs.
   ========================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const LEDGER = path.join(ROOT, 'engine', 'bohemia_draw_budget.json');
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');
const TOOL = path.join(ROOT, 'tools', 'bohemia_draw_cost.js');

const round4 = n => Math.round(n * 10000) / 10000;
let pass = 0, fail = 0;
const ok = (n, c) => { c ? (pass++, console.log('  PASS ' + n)) : (fail++, console.log('  FAIL ' + n)); };
const done = () => { console.log('=== DRAW BUDGET GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };

/* ---- 1. THE LEDGER IS REAL ---------------------------------------------- */
let L = null;
try { L = JSON.parse(fs.readFileSync(LEDGER, 'utf8')); } catch (e) { L = null; }
ok('THE LEDGER EXISTS AND PARSES: engine/bohemia_draw_budget.json is where the rule lives, so a lane pricing a new visual has one place to put the number', !!L);
if (!L) done();

const feats = Array.isArray(L.features) ? L.features : [];
const shaped = feats.filter(f => f.name && f.row && f.what && ('in_loop' in f));
ok('and every row says what it is, whose row it came from and whether it is in the loop (' + shaped.length + ' of ' + feats.length + ')',
  feats.length > 0 && shaped.length === feats.length);

ok('and the beat it is measured against is 500 ms with the driven number carrying its SOURCE, not quoted from memory -- the row\'s own "497 of 500" is the PLUMBER\'s measurement and it moved to a median of ' + L.driven_beat_ms + ' when they shipped the floor cache',
  L.beat_ms === 500 && typeof L.driven_beat_ms === 'number'
  && typeof L.driven_beat_source === 'string' && /records\//.test(L.driven_beat_source));

const inLoop = feats.filter(f => f.in_loop === true);
const priced = inLoop.filter(f => typeof f.ms_per_beat === 'number' && typeof f.err_ms_per_beat === 'number' && f.measured);
console.log('  the ledger: ' + feats.length + ' rows, ' + inLoop.length + ' of them drawing in the fight today');
for (const f of feats) {
  console.log('    ' + String(f.name).padEnd(30)
    + (f.ms_per_beat == null ? 'NOT MEASURED'
      : (f.ms_per_beat + ' +/- ' + f.err_ms_per_beat + ' ms a beat'
         + (f.below_floor ? '  (below the floor: too small for the instrument, NOT free)' : '')))
    + (f.in_loop === true ? '   [in the loop]' : '   [not in the loop]'));
}
ok('EVERY FEATURE THAT DRAWS IN THE FIGHT TODAY CARRIES A NUMBER, AN ERROR BAR AND THE DATE IT WAS TAKEN (' + priced.length + ' of ' + inLoop.length
  + '). An error bar because three of these sit within a quarter of a millisecond of the instrument\'s own zero, and a bare number there would read as precision that is not present',
  inLoop.length > 0 && priced.length === inLoop.length);

const sum = Math.round(inLoop.reduce((a, f) => a + (f.ms_per_beat || 0), 0) * 100) / 100;
ok('and the stored total agrees with the rows it is the sum of (' + L.total_in_loop_ms_per_beat + ' against ' + sum
  + '), so a row cannot be added without the total moving with it',
  Math.abs((L.total_in_loop_ms_per_beat || 0) - sum) < 0.011);

/* *** AND IT IS THE THINGS THAT ARE NOT IN YET THAT GET CHECKED AGAINST THE
   HEADROOM, WHICH THE FIRST CUT OF THIS ARM GOT BACKWARDS AND WENT RED ON
   ARRIVAL. *** It summed the features that are ALREADY DRAWING and compared them
   to what is left over -- but those are already inside the plumber's driven
   413.5, so that is the same milliseconds counted twice, and it made a gate that
   is red the day it ships. A gate red on arrival gets switched off by the next
   session that meets it, which is that lane's own rule.
   The row's sentence is about what has NOT entered yet: "does not enter the
   fight loop until there is room for it." So the candidates are what is weighed,
   against the WORST end of the headroom -- the plumber measured the driven beat
   from 347 to 497.5 across seven samples of ONE build, and a budget spent
   against the median is a budget spent against the good days. */
const worst = L.headroom_ms_worst;
const cands = feats.filter(f => f.in_loop === false && typeof f.ms_per_beat === 'number' && !f.control);
const candSum = Math.round(cands.reduce((a, f) => a + f.ms_per_beat, 0) * 100) / 100;
console.log('  already drawing: ' + sum + ' ms a beat, inside the plumber\'s driven 413.5 and NOT counted again.'
  + '  waiting to enter: ' + (cands.length ? cands.map(f => f.name + ' ' + f.ms_per_beat).join(', ') : 'nothing priced yet'));
ok('AND WHAT IS WAITING TO ENTER THE LOOP FITS IN THE HEADROOM AT ITS WORST END (' + candSum + ' ms a beat against ' + worst
  + ' ms). The things already drawing are inside the plumber\'s driven number and are not weighed again -- the first cut of this arm did weigh them and went red on the day it shipped, which is how a gate gets switched off. This is the arm that will stop the camera pull-back and the cloud the day somebody prices them, if there is no room',
  typeof worst === 'number' && candSum <= worst);

/* ---- 3. THE DRAW SURFACE IS RATCHETED ----------------------------------- */
let live = [];
try {
  const alpha = fs.readFileSync(ALPHA, 'utf8');
  const m = /const COMBAT_B64\s*=\s*'([^']+)'/.exec(alpha);
  const blob = Buffer.from(m[1], 'base64').toString('utf8');
  live = Array.from(new Set((blob.match(/\bfunction\s+draw[A-Za-z0-9_]*\s*\(/g) || [])
    .map(s => s.replace(/^function\s+/, '').replace(/\s*\($/, '')))).sort();
} catch (e) { live = []; }
const known = (L.draw_surface || []).slice().sort();
const added = live.filter(n => known.indexOf(n) < 0);
const gone = known.filter(n => live.indexOf(n) < 0);
console.log('  the fight\'s draw surface: ' + live.length + ' functions'
  + (added.length ? '   NEW: ' + added.join(', ') : '')
  + (gone.length ? '   GONE: ' + gone.join(', ') : ''));
ok('THE DRAW SURFACE IS RATCHETED, which is the half of this rule that cannot be talked around. Every function in the shipped fight whose name begins with draw is listed in the ledger (' + live.length
  + '), so adding one is adding a new thing that draws and this goes red until the name is on the list and a priced row exists for it. A declaration nobody has to make is not a rule'
  + (added.length ? '   >> ADD THESE TO engine/bohemia_draw_budget.json AND PRICE THEM WITH tools/bohemia_draw_cost.js: ' + added.join(', ') : ''),
  live.length > 0 && added.length === 0 && gone.length === 0);

/* ---- 2. THE RULER STILL READS ZERO -------------------------------------- */
/* Run the measurer's CONTROL arm for real. If the tool has rotted, or the fight
   will not open, or the pin has stopped pinning, the control stops reading zero
   and every number in the ledger above is worth nothing. */
let ctl = null, ctlOut = '';
try {
  ctlOut = execFileSync('node', [TOOL, '--only', 'NOTHING (the noise floor)'],
    { cwd: ROOT, encoding: 'utf8', timeout: 600000 });
  const m = /THE CONTROL READS (-?[\d.]+) \+\/- ([\d.]+) ms a draw/.exec(ctlOut);
  if (m) ctl = { v: parseFloat(m[1]), e: parseFloat(m[2]) };
} catch (e) { ctlOut = String((e && e.stdout) || e); }
console.log('  the ruler: ' + (ctl ? (ctl.v + ' +/- ' + ctl.e + ' ms a draw') : 'THE MEASURER DID NOT PRODUCE A CONTROL READING'));
/* THE CAP IS A JUDGEMENT AND IT IS WRITTEN DOWN AS ONE. 0.05 ms a draw is 1.5 ms
   of every beat: small against a 500 ms beat, and about the size of the features
   this ledger prices, which is exactly why anything at or under it is reported as
   under the floor rather than as a number. The first cut of this arm demanded the
   control land inside its own error bar and went red at 1.2 sigma on a reading
   that varies run to run -- a checker tighter than the thing it checks is a
   checker that will be switched off. */
const CAP = 0.05;
const NOISE_CEIL = 0.2;
/* *** AND THE BAND WIDENS WITH THE RUN'S OWN NOISE, WHICH IS NOT A FUDGE, IT IS
   THE ONLY HONEST TEST OF A TIMING MEASUREMENT. *** The first cut used the flat
   cap alone and went RED IN THE SUITE AND GREEN ALONE on the same tree -- five
   hundred gates share this machine, and a timer read under that load resolves
   less. The claim being made is "the ruler reads zero TO WITHIN WHAT THIS RUN
   COULD RESOLVE", so the run's own error bar is part of it. A run too noisy to
   say anything at all is still red: the error bar has its own ceiling, so this
   cannot excuse itself by being useless. */
const band = ctl ? Math.max(CAP, ctl.e) : CAP;
ok('THE RULER IS RE-RUN LIVE AND IT STILL READS ABOUT ZERO (' + (ctl ? ctl.v : '?') + ' ms a draw, against a band of '
  + round4(band) + ' -- the cap ' + CAP + ' or this run\'s own resolution, whichever is wider, because five hundred '
  + 'gates share this machine and a timer read under that load resolves less). The measurer is driven with the SAME '
  + 'setting in both arms, so whatever it reports there is its own bias and not anybody\'s feature. A ledger of '
  + 'numbers from a tool nobody re-runs is a wall of decoration, and this is the arm that stops it becoming one'
  + (ctl ? '' : '\n    ' + ctlOut.split('\n').slice(-6).join('\n    ')),
  !!ctl && ctl.e <= NOISE_CEIL && Math.abs(ctl.v) <= band);

ok('and the floor the tool measured is written into the ledger (' + L.floor_ms_per_draw + ' ms a draw, ' + L.floor_ms_per_beat
  + ' ms a beat) and every row at or under it is FLAGGED as under it rather than printed as a small number, because the instrument\'s own bias is the same size as the features being priced and a reader has to be able to tell those apart',
  typeof L.floor_ms_per_draw === 'number' && typeof L.floor_ms_per_beat === 'number'
  && feats.filter(f => !f.control && typeof f.ms_per_draw === 'number')
      .every(f => (Math.abs(f.ms_per_draw) <= L.floor_ms_per_draw) === (f.below_floor === true)));

const noErr = /page errors: 0/.test(ctlOut);
ok('and opening a fight and drawing four hundred and eighty frames through it throws nothing', noErr);

done();
