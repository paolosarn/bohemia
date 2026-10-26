#!/usr/bin/env node
/* ============================================================================
   THE MOST POSSIBLE, ONE NUMBER A STAT (UI THREE, rows [stats are bars and arrows] and [the stat order], 10/26/26;
   VAMILY rules 223(c) and 247(d): 'how far it is from the maximum that's even possible').

   Writes records/target/bb/stat_max.json from the game's own three files, through engine/bohemia_stats.js compute()
   (one rule, never a second), TUNING's ruling (the one table's section Q, records/BOHEMIA_TUNING_THE_BARS_MAXIMA_10_26_26.md):
   the top of the best background's range (backgrounds.json) + the best flat trait a man can roll at the post
   (traits.json at_the_post) + ten level-ups at the 3-star column's best roll (rules.json experience.stat_gains_by_stars);
   and each column's middle roll for a man's own ceiling, the tick. Every bar on every screen is filled to a man's number
   over this. When TUNING rules again, the rule changes in compute() and this file is written again, never by hand.

     node tools/bohemia_ui_three_stat_max.js           # write the file
     node tools/bohemia_ui_three_stat_max.js --check   # exit 1 if the file is not what the formula gives
   ============================================================================ */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.dirname(__dirname);
const BB = path.join(ROOT, 'records/target/bb');
const S = require(path.join(ROOT, 'engine/bohemia_stats.js')).BohemiaStats;
const bgs = JSON.parse(fs.readFileSync(path.join(BB, 'backgrounds.json'), 'utf8'));
const rules = JSON.parse(fs.readFileSync(path.join(BB, 'rules.json'), 'utf8'));
const traits = JSON.parse(fs.readFileSync(path.join(BB, 'traits.json'), 'utf8'));
const c = S.compute(bgs, rules, traits);
const OUT = path.join(BB, 'stat_max.json');
const file = {
  _about: "UI THREE 10/26/26 (VAMILY rules 223(c), 247(d); Paolo 10/26: 'I wanna see, behind the numbers, like a progress bar, how far it is from the maximum that's even possible'). THE MOST POSSIBLE, one number a stat, the same on every screen, TUNING's ruling (the one table's section Q): the top of the best background's range at the door (backgrounds.json) + the best flat trait a man can roll at the post (traits.json at_the_post) + ten level-ups (levels 2 to 11) at the best roll with three stars (rules.json experience.stat_gains_by_stars, the top of the 3-star column). Every stat bar is filled to a man's number over this; past it the bar is full. mid_roll is each column's middle roll (no star, one, two, three): a man's own ceiling, the faint tick, is his number plus every level left to 11 at his stars' middle roll (TUNING's bar.tick.own_ceiling). Written by tools/bohemia_ui_three_stat_max.js; a new ruling changes the rule in engine/bohemia_stats.js compute() and this file is written again, never by hand.",
  source: 'records/target/bb/backgrounds.json rows[].stats (top of range); records/target/bb/traits.json traits[] at_the_post flat effects; records/target/bb/rules.json experience.stat_gains_by_stars (bb_all/1926_Talents.txt); records/BOHEMIA_TUNING_THE_BARS_MAXIMA_10_26_26.md',
  order: S.ORDER,
  top_level: c.top_level,
  max: c.max,
  base_top: c.base_top,
  from_background: c.from,
  trait_top: c.trait_top,
  from_trait: c.trait_from,
  best_roll: c.best_roll,
  mid_roll: c.mid_roll
};
const text = JSON.stringify(file, null, 1) + '\n';
if (process.argv.includes('--check')) {
  const have = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if (have !== text) { console.log('stat_max.json is not what the formula gives; run node tools/bohemia_ui_three_stat_max.js'); process.exit(1); }
  console.log('stat_max.json matches the formula: ' + JSON.stringify(c.max)); process.exit(0);
}
fs.writeFileSync(OUT, text);
console.log('wrote ' + path.relative(ROOT, OUT) + ': ' + JSON.stringify(c.max));
const off = S.ORDER.filter(k => S.DATA.max[k] !== c.max[k]);
if (off.length) console.log('NOTE: engine/bohemia_stats.js DATA.max differs on ' + off.join(', ') + ': copy the numbers in');
