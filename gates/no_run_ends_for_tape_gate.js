#!/usr/bin/env node
/* NO RUN ENDS FOR TAPE (ECONOMY [tape income against armour wear], rule 271(b), Paolo 10/26: 'there's not enough duct tape...
   when my armor runs out like it's my runs over... make that more available').
   records/BOHEMIA_ECONOMY_DAY_84_NO_RUN_ENDS_FOR_TAPE_10_26_26.md. The numbers' half of 271(c); RUN FOUR's [tape in the loot] and
   CAMP's salvage hold the screens. Legs:
   F  records/target/bb/tape_income.json: every row a value and a source; every quote word for word on its page (the tarball).
   S  the stall's shelf (stall_prices.json): at least a stack in every place, refilled every map day, never sold out (the back room).
   R  rolled months at the map's pace (tools/bohemia_economy_tape_income.js, TUNING's bench for what a fight breaks): A NEW CREW and
      THE BLOCK WATCH have at least the tape they break plus a tenth from every home (camp, town, fortress), at the fair price and
      the loot; a typical run working out of a town is never short half the time or more.
   M  the gate bites: Battle Brothers' three-day shelf, a roll or two in the loot, a camp with no stack, each turns it red. */
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const FILE = path.join(ROOT, 'records/target/bb/tape_income.json'), STALL = path.join(ROOT, 'records/target/bb/stall_prices.json');
const SP = require(path.join(ROOT, 'engine/bohemia_stall_prices.js'));
const CALC = require(path.join(ROOT, 'tools/bohemia_economy_tape_income.js'));
let pass = 0, fail = 0;
function ok(what, c, why) { if (c) pass++; else { fail++; console.log('  FAIL ' + what + (why ? ' (' + why + ')' : '')); } }
const TAR = path.join(ROOT, 'reference/library/grok/wiki/PAGES_ALL.tar.gz'), cache = {};
function page(src) { const m = String(src || '').match(/(bb_all\/[^,;]+?\.txt)/); if (!m) return null;
  if (!(m[1] in cache)) { try { cache[m[1]] = cp.execSync('tar -xzOf "' + TAR + '" "' + m[1] + '"', { encoding: 'utf8' }); } catch (e) { cache[m[1]] = null; } } return cache[m[1]]; }
const flat = s => String(s).replace(/<br\s*\/?>/g, ' ').replace(/\s+/g, ' ').trim();
const raw = JSON.parse(fs.readFileSync(FILE, 'utf8')), stall = JSON.parse(fs.readFileSync(STALL, 'utf8'));

/* F */
const rows = [['loot_tape', 'per_kill'], ['loot_tape', 'only_the_dead'], ['loot_tape', 'nothing_from'], ['scavenger', 'tape_of_destroyed_armour'], ['scavenger', 'cap'], ['scavenger', 'rounds_back'], ['salvage', 'tape_per_scrap'], ['the_bar', 'spare'], ['the_bar', 'pace']];
const bad = rows.filter(([a, b]) => !raw[a] || !raw[a][b] || raw[a][b].value === undefined || !raw[a][b].source).map(r => r.join('.'));
ok('F1 every row the loot, the camp and the bar read has a value and a source', bad.length === 0, bad.join(', '));
const quotes = []; (function walk(o, at) { if (!o || typeof o !== 'object') return; if (typeof o.quote === 'string') quotes.push({ at, q: o.quote, src: o.source }); for (const k in o) walk(o[k], at + '.' + k); })(raw, '');
const miss = quotes.filter(x => { const p = page(x.src); return !p || flat(p).indexOf(flat(x.q)) < 0; }).map(x => x.at);
ok('F2 every quote is its page\'s own words (' + quotes.length + ')', quotes.length >= 4 && miss.length === 0, miss.join(', '));
ok('F3 a dead man carries tape, a dog never (loot.json\'s own lines)', raw.loot_tape.per_kill.value[0] >= 1 && raw.loot_tape.nothing_from.value.indexOf('beast') >= 0 && raw.loot_tape.only_the_dead.value === true);
ok('F4 the Scavenger is Battle Brothers\' own: 0.5 to 1 percent of a destroyed piece\'s top, 60 at most', raw.scavenger.tape_of_destroyed_armour.value.join() === '0.005,0.01' && raw.scavenger.cap.value === 60);

/* S */
ok('S1 every place has at least a stack of tape every visit, a raid included', ['camp', 'town', 'fortress'].every(t => SP.tapeShelf(stall, { tier: t }) >= 20 && SP.tapeShelf(stall, { tier: t, stockMult: 0.5 }) >= 20));
ok('S2 the tape shelf refills every map day (the pace: one of ours holds four to six of Battle Brothers\')', stall.tape_shelf.restock_days.value === 1);
ok('S3 never sold out: past the shelf the back room sells dearer, never nothing', ['camp', 'town', 'fortress'].every(t => SP.tapePrice(stall, { tier: t, soldThisRestock: 1e6 }) > SP.tapePrice(stall, { tier: t })));

/* R */
const r = CALC.run({ runs: 120 });
const cell = (s, h) => r.shapes[s].homes[h];
['camp', 'town', 'fortress'].forEach(h => {
  ok('R1 A NEW CREW from a ' + h + ': had ' + cell('newcrew', h).ratio_median + ' of what it breaks (the loot ' + cell('newcrew', h).loot_covers_median + ')', cell('newcrew', h).ratio_median >= 1 + r.spare);
  ok('R2 THE BLOCK WATCH from a ' + h + ': had ' + cell('watch', h).ratio_median + ' of what it breaks (the loot ' + cell('watch', h).loot_covers_median + ')', cell('watch', h).ratio_median >= 1 + r.spare);
});
ok('R3 working out of a town, a typical month is never short (a new crew ' + Math.round(100 * cell('newcrew', 'town').never_short) + '%, twelve ' + Math.round(100 * cell('watch', 'town').never_short) + '%)', r.tests.R3_a_typical_run_is_never_short_at_a_town);
ok('R4 the Lone Wolf is covered from a town or a fortress (' + cell('wolf', 'town').ratio_median + ', ' + cell('wolf', 'fortress').ratio_median + ')', cell('wolf', 'town').ratio_median >= 1 && cell('wolf', 'fortress').ratio_median >= 1);

/* C: the craftsman's price (rule 277(b)) */
const mp = (miss, c) => SP.mendPrice(stall, miss, c);
ok('C1 a smith charges the tape the damage takes plus his hands: 150 points in a town is ' + mp(150, { tier: 'town' }) + ' (10 rolls of tape, twice)', mp(150, { tier: 'town' }) === Math.round(150 / 15 * 1.02 * 2) && mp(0, { tier: 'town' }) === 0);
ok('C2 at least a battery a piece; dearer in a bigger place; dearer where the town\'s prices are up (market day x1.25)', mp(3, { tier: 'camp' }) === 1 && mp(300, { tier: 'camp' }) < mp(300, { tier: 'fortress' }) && mp(300, { tier: 'town', buyMult: 1.25 }) > mp(300, { tier: 'town' }));
ok('C3 the smith costs more than doing it yourself with the stall\'s tape (quick and dear against slow and cheap)', [45, 150, 300].every(x => mp(x, { tier: 'town' }) > Math.ceil(x / 15) * SP.tapePrice(stall, { tier: 'town' })));

/* M */
function bitesShelf(name, mut) {
  const d = JSON.parse(JSON.stringify(stall)); mut(d);
  const x = CALC.run({ runs: 60, stall: d });
  ok('M ' + name + ' turns it red', !(x.tests.R1_a_new_crew_has_more_than_it_needs && x.tests.R2_the_twelve_has_more_than_it_needs));
}
bitesShelf('Battle Brothers\' three-day shelf', d => { d.tape_shelf.restock_days.value = 3; });
bitesShelf('a camp with half a stack', d => { d.tape_shelf.value.camp = 10; d.tape_shelf.min.value = 10; });
const thin = CALC.run({ runs: 60, perKill: [1, 2] });
ok('M a roll or two in the loot turns it red', !thin.tests.R2_the_twelve_has_more_than_it_needs);

console.log('=== NO RUN ENDS FOR TAPE GATE: ' + pass + ' passed, ' + fail + ' failed ===');
process.exit(fail ? 1 : 0);
