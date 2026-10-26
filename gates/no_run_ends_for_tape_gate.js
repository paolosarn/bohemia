#!/usr/bin/env node
/* NO RUN ENDS FOR TAPE (ECONOMY [tape income against armour wear], rule 271; RE-AIMED by [the tape bar re-aimed], rule 284,
   Paolo 10/26: 'you're about to crash my economy... now I'm winning way too much duct tape after each fight... one duct tape
   as a baseline'). records/BOHEMIA_ECONOMY_DAY_85_THE_TAPE_BILL_ONE_ROLL_A_FIGHT_AND_THE_REST_IS_BOUGHT_10_26_26.md.
   284(g): the bar is the one roll plus the stall plus the smith, against what a fight pays. RUN FOUR's [one roll a fight] holds
   the loot screen; this gate holds the numbers. Legs:
   L  the loot (tape_income.json): ONE roll a won fight, nothing a kill, nothing a wrecked piece; never above three (284(e)).
   F  every row read has a value and a source; every quote word for word on its page (the tarball).
   S  the stall's shelf: at least a stack everywhere, refilled every map day, never sold out (the back room).
   C  the craftsman's price (277(b)): the tape the damage takes plus his hands, at least a battery a piece.
   N  rolled months at the map's pace (tools/bohemia_economy_tape_income.js, TUNING's bench for what a fight breaks): A NEW CREW
      keeps its armour up on what its fights pay from every home (in the black nine months in ten) and spends under a third of
      it on tape; any company that cannot is named on TUNING's board (284(e): the price or the pay moves, never the loot).
   M  the gate bites: tape at three batteries a roll, the loot at four, a shelf of five rolls, each turns it red. */
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const FILE = path.join(ROOT, 'records/target/bb/tape_income.json'), STALL = path.join(ROOT, 'records/target/bb/stall_prices.json');
const SP = require(path.join(ROOT, 'engine/bohemia_stall_prices.js'));
const CALC = require(path.join(ROOT, 'tools/bohemia_economy_tape_income.js'));
let pass = 0, fail = 0;
function ok(what, c, why) { if (c) pass++; else { fail++; console.log('  FAIL ' + what + (why ? ' (' + why + ')' : '')); } }
const TAR = path.join(ROOT, 'reference/library/grok/wiki/PAGES_ALL.tar.gz'), cache = {};
function page(src) {
  const r = String(src || '').match(/^((records|laws)\/[^ ,;]+\.md)/);
  if (r) { try { return fs.readFileSync(path.join(ROOT, r[1]), 'utf8'); } catch (e) { return null; } }
  const m = String(src || '').match(/(bb_all\/[^,;]+?\.txt)/); if (!m) return null;
  if (!(m[1] in cache)) { try { cache[m[1]] = cp.execSync('tar -xzOf "' + TAR + '" "' + m[1] + '"', { encoding: 'utf8' }); } catch (e) { cache[m[1]] = null; } } return cache[m[1]];
}
const flat = s => String(s).replace(/<br\s*\/?>/g, ' ').replace(/\s+/g, ' ').trim();
const raw = JSON.parse(fs.readFileSync(FILE, 'utf8')), stall = JSON.parse(fs.readFileSync(STALL, 'utf8'));
const V = (o, k) => o && o[k] && o[k].value;

/* L */
function legsL(file, say) {
  const lt = file.loot_tape || {}, won = V(lt, 'per_won_fight'), pk = V(lt, 'per_kill') || [0, 0], scrap = V(file.salvage, 'tape_per_scrap');
  say('L1 a won fight gives ONE roll of tape (284(a)): per_won_fight ' + won, won === 1);
  say('L2 nothing a kill, nothing a wrecked piece (284(b)): per_kill ' + JSON.stringify(pk) + ', a scrap ' + scrap, Math.max.apply(null, pk) === 0 && scrap === 0);
  say('L3 never above three a fight without his word (284(e))', won >= 0 && won <= 3);
}
legsL(raw, ok);

/* F */
const rows = [['loot_tape', 'per_won_fight'], ['loot_tape', 'only_the_dead'], ['loot_tape', 'nothing_from'], ['scavenger', 'tape_of_destroyed_armour'], ['scavenger', 'cap'], ['scavenger', 'rounds_back'], ['the_bar', 'pace'], ['the_bar', 'tape_share_max']];
const bad = rows.filter(([a, b]) => !raw[a] || !raw[a][b] || raw[a][b].value === undefined || !raw[a][b].source).map(r => r.join('.'));
ok('F1 every row the loot, the Scavenger and the bar read has a value and a source', bad.length === 0, bad.join(', '));
const quotes = []; (function walk(o, at) { if (!o || typeof o !== 'object') return; if (typeof o.quote === 'string') quotes.push({ at, q: o.quote, src: o.source }); for (const k in o) walk(o[k], at + '.' + k); })(raw, '');
const miss = quotes.filter(x => { const p = page(x.src); return !p || flat(p).indexOf(flat(x.q)) < 0; }).map(x => x.at);
ok('F2 every quote is its page\'s own words (' + quotes.length + ')', quotes.length >= 4 && miss.length === 0, miss.join(', '));
ok('F3 the Scavenger is Battle Brothers\' own: 0.5 to 1 percent of a destroyed piece\'s top, 60 at most (284(d))', String(V(raw.scavenger, 'tape_of_destroyed_armour')) === '0.005,0.01' && V(raw.scavenger, 'cap') === 60);

/* S */
ok('S1 every place has at least a stack of tape every visit, a raid included', ['camp', 'town', 'fortress'].every(t => SP.tapeShelf(stall, { tier: t }) >= 20 && SP.tapeShelf(stall, { tier: t, stockMult: 0.5 }) >= 20));
ok('S2 the tape shelf refills every map day (the pace: one of ours holds four to six of Battle Brothers\')', stall.tape_shelf.restock_days.value === 1);
ok('S3 never sold out: past the shelf the back room sells dearer, never nothing', ['camp', 'town', 'fortress'].every(t => SP.tapePrice(stall, { tier: t, soldThisRestock: 1e6 }) > SP.tapePrice(stall, { tier: t })));

/* C */
const mp = (miss2, c) => SP.mendPrice(stall, miss2, c);
ok('C1 a smith charges the tape the damage takes plus his hands: 150 points in a town is ' + mp(150, { tier: 'town' }) + ' (10 rolls of tape, twice)', mp(150, { tier: 'town' }) === Math.round(150 / 15 * 1.02 * 2) && mp(0, { tier: 'town' }) === 0);
ok('C2 at least a battery a piece; dearer in a bigger place; dearer where the town\'s prices are up (market day x1.25)', mp(3, { tier: 'camp' }) === 1 && mp(300, { tier: 'camp' }) < mp(300, { tier: 'fortress' }) && mp(300, { tier: 'town', buyMult: 1.25 }) > mp(300, { tier: 'town' }));
ok('C3 the smith costs more than doing it yourself with the stall\'s tape (quick and dear against slow and cheap)', [45, 150, 300].every(x => mp(x, { tier: 'town' }) > Math.ceil(x / 15) * SP.tapePrice(stall, { tier: 'town' })));

/* N */
function legsN(over, say) {
  const r = CALC.run(Object.assign({ runs: 80 }, over || {}));
  const nc = r.shapes.newcrew.homes;
  ['camp', 'town', 'fortress'].forEach(h => say('N1 A NEW CREW from a ' + h + ': tape ' + nc[h].bill_a_day + ' a day, ' + Math.round(100 * nc[h].share) + '% of the ' + nc[h].pay_a_day + ' its fights pay, ' + nc[h].net_a_day + ' left after food (' + Math.round(100 * nc[h].keeps_up) + '% of months in the black)', nc[h].net_a_day > 0 && nc[h].keeps_up >= 0.9 && nc[h].share < V(raw.the_bar, 'tape_share_max')));
  return r;
}
const R = legsN(null, ok);
const VAM = fs.readFileSync(path.join(ROOT, 'VAMILY.md'), 'utf8'), tun = VAM.split(/\n## /).find(s => /^TUNING  \(21\./.test(s)) || '';
ok('N2 every company that cannot keep its armour up on routine pay is named on TUNING\'s board (' + (R.tuning.join(', ') || 'none') + ')', R.tuning.length === 0 || /NOTE 10\/26 FROM ECONOMY  \[the tape bill\]/.test(tun));
['watch', 'wolf'].forEach(k => { const s = R.shapes[k]; console.log('  ' + s.name + ': ' + ['camp', 'town', 'fortress'].map(h => h + ' ' + s.homes[h].bill_a_day + ' of ' + s.homes[h].pay_a_day + ' (' + Math.round(100 * s.homes[h].share) + '%), left ' + s.homes[h].net_a_day).join('; ')); });

/* M */
function bitesN(name, mut, over) {
  const d = JSON.parse(JSON.stringify(stall)); if (mut) mut(d);
  let red = 0; legsN(Object.assign({ stall: d }, over || {}), (w, c) => { if (!c) red++; });
  ok('M ' + name + ' turns it red', red > 0);
}
bitesN('tape at three batteries a roll', d => { d.goods.tape.buy.value = 3; });
bitesN('a shelf of five rolls and a back room at five', d => { d.tape_shelf.value = { camp: 5, town: 5, fortress: 5 }; d.tape_shelf.min.value = 5; d.tape_shelf.back_room_mult.value = 5; });
const four = JSON.parse(JSON.stringify(raw)); four.loot_tape.per_won_fight.value = 4;
let red4 = 0; legsL(four, (w, c) => { if (!c) red4++; }); ok('M the loot at four a fight turns it red', red4 > 0);

console.log('=== NO RUN ENDS FOR TAPE GATE: ' + pass + ' passed, ' + fail + ' failed ===');
process.exit(fail ? 1 : 0);
