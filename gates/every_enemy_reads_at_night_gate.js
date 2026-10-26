#!/usr/bin/env node
/* EVERY ENEMY READS AT NIGHT (COOK [every enemy reads at night], line 3 of records/BOHEMIA_EVERYTHING_HE_ASKED_10_24_26.md; EYES
   10/25 q43: 'the one Kid stood on a dark tile at night and was never drawn'; rule 73: playable in the dark). The fight page
   itself (the one driver), three boards by day and by night on one seed; every look an enemy can wear (the Kids and Runners, the
   Mechanic, the Heavy, the 13 gangs, the rolled people, the beasts), standing, through the page's own night for a man and the
   lift the page picks for him on that tile, against every unlit tile a man can stand on
   (tools/bohemia_cook_every_enemy_reads_at_night_10_25_26.js, measure()). On each board's worst tenth of its dark tiles:
     1. *** EVERY ENEMY READS AT NIGHT ***: every look stands 1.4 to 1 or more off its ground (WCAG's contrast).
     2. AS WELL AS BY DAY: every look's night stand-off at least nine tenths of its day's on the same board, or 2 to 1 and over
        (a pale board, 3.5 to 1 by day, darkens at night and still stands 2.7 to 1).
     3. THE MEASURE BITES: the pick before (the tile's light alone: the moon's lift on a dark tile, which can only darken) leaves
        looks under 1.4 to 1 on the same tiles.
     4. No page error.
   Measured before (strip, seed 31): the Church, Remnants and Reds gangs, a Kid, the Heavy at 1.00 to 1.04 to 1 on the darkest
   tenth; after: every look 1.5 to 1 or more.
   Run: node gates/every_enemy_reads_at_night_gate.js */
'use strict';
const path = require('path');
const { measure } = require(path.join(__dirname, '..', 'tools/bohemia_cook_every_enemy_reads_at_night_10_25_26.js'));
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
(async () => {
  const R = await measure(['strip', 'suburb', 'freeway'], 31, 'phone_portrait');
  const all = [];
  for (const [kind, k] of Object.entries(R.kinds)) for (const [look, r] of Object.entries(k.looks)) all.push(Object.assign({ board: kind, look }, r));
  const byNight = all.slice().sort((a, b) => a.night - b.night), byKept = all.slice().sort((a, b) => a.kept - b.kept), byOld = all.slice().sort((a, b) => a.oldNight - b.oldNight);
  const kids = all.filter(r => r.type === 'runner');
  leg(all.length >= 150 && byNight[0].night >= 1.4, '*** EVERY ENEMY READS AT NIGHT *** (every look 1.4 to 1 or more off its ground on the worst tenth of every board\'s dark tiles; the Kids too)',
    all.length + ' looks x boards; weakest ' + byNight.slice(0, 3).map(r => r.board + ' ' + r.look + ' ' + r.night).join(', ') + '; the Kids at least ' + Math.min(...kids.map(r => r.night)).toFixed(2));
  const short = all.filter(r => r.kept < 0.9 && r.night < 2);   /* a pale board by day (3.5 to 1) darkens at night and still stands 2.7 to 1 */
  leg(!short.length, 'as well as by day: every look keeps nine tenths of its day\'s stand-off at night, or stands 2 to 1 and over', short.length ? short.slice(0, 4).map(r => r.board + ' ' + r.look + ' ' + r.night + '/' + r.day).join(', ') : 'weakest kept ' + byKept.slice(0, 2).map(r => r.board + ' ' + r.look + ' ' + r.night + '/' + r.day).join(', '));
  const oldBad = all.filter(r => r.oldNight < 1.4);
  leg(oldBad.length >= 10, 'the measure bites: the pick before (the tile\'s light alone) leaves looks under 1.4 to 1', oldBad.length + ' under, weakest ' + byOld.slice(0, 3).map(r => r.board + ' ' + r.look + ' ' + r.oldNight).join(', '));
  const errs = Object.values(R.kinds).map(k => k.err).filter(Boolean);
  leg(!errs.length, 'no page error', errs[0] || 'none');
  console.log('EVERY ENEMY READS AT NIGHT: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
