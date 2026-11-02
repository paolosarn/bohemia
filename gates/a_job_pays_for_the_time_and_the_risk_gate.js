/* A JOB PAYS FOR THE TIME AND THE RISK (ECONOMY 2, 11/2/26, rule 323, ask line 320).
   Paolo 11/2: 'I just don't think it's giving me enough money for the amount of time that I'm doing for it... for most of the
   quests I want you to feel properly compensated with how difficult it was... it's a bit tedious to chase 11 dogs... how
   friendly you are with the settlement.' Rule 303: fair, never stingy.
     THE PAYS     every board job's pay (the shelf and the job kinds' board people) is records/target/bb/job_pay.json's 'pays',
                  and that table is what the formula (engine/bohemia_job_pay.js) writes from the data, byte for byte
     THE BAR      no job pays less a map hour than the crew burns an hour times one plus the margin; no killing job pays less than it did
     THE VIOLENCE a job with no killing pays clearly less than its hours with a fight in them; a map hour of killing pays at least
                  twice a map hour of walking; the offer says which (rule 323 amended, ask line 321)
     THE HUNT     the dog hunt pays per head: eleven dogs, eleven heads, clearly more than the 30 it paid
     THE STANDING neutral pays as it is; up the wiki's nine bands the pay only rises, never past the friend's market's 15%; every
                  bent band says so in words with no em dash; a town at 75 (FRIENDLY) bends 116 to 125
     THE WIRES    the map's loopJobPay reads the town's standing, the take hands the board's number on, the town's board shows the
                  bent pay and says the word under the trip, the phone passes the place; both pages load the engine
     THE PURSE    the probe's purse at day 30 and its pay a map hour rise, and by less than double (the curve does not explode)
   Run: node gates/a_job_pays_for_the_time_and_the_risk_gate.js */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.dirname(__dirname);
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const T = require('../tools/bohemia_economy_job_pay.js'), P = require('../engine/bohemia_job_pay.js');

/* THE PAYS */
ok('the pay table is what the formula writes from the data, byte for byte', T.bake(false));
const PAY = J('records/target/bb/job_pay.json'), pays = PAY.pays || {}, shelf = J('records/target/BOHEMIA_BOARD_SHELF.json').offers || [];
const people = (J('records/target/BOHEMIA_JOB_KINDS.json').board_people || {}).rows || [];
const off = shelf.concat(people).filter(r => !pays[r.id] || pays[r.id].pay !== r.pay);
ok('every board job pays its row of the table (' + (shelf.length + people.length) + ' jobs)', shelf.length >= 30 && people.length >= 10 && off.length === 0, off.slice(0, 3).map(r => r.id + ' ' + r.pay).join(' | '));
const numbers = ['crew_cost_per_map_hour', 'margin', 'minutes_per_block', 'per_fight', 'skull_mult', 'floor_per_skull', 'pack_size', 'standing', 'place_blocks'];
const bare = numbers.filter(k => !PAY[k] || PAY[k].value == null || String(PAY[k].why || '').length < 60);
ok('every number in the pay file has its value and its reason', bare.length === 0, bare.join(', '));

/* THE BAR */
const rows = T.jobs().rows, bar = PAY.crew_cost_per_map_hour.value * (1 + PAY.margin.value);
const under = rows.filter(r => r.pay / Math.max(0.5, r.hours) < bar - 1e-9), less = rows.filter(r => r.pay < r.before);
ok('no job pays under ' + bar.toFixed(2) + ' a map hour (the crew\'s ' + PAY.crew_cost_per_map_hour.value + ' and the margin ' + PAY.margin.value + ')', under.length === 0, under.map(r => r.id).join(', '));
const kill = rows.filter(r => r.violent), quiet = rows.filter(r => !r.violent), lessK = kill.filter(r => r.pay < r.before);
ok('no killing job pays less than it did (' + kill.length + ' jobs)', kill.length >= 30 && lessK.length === 0, lessK.map(r => r.id + ' ' + r.before + '->' + r.pay).join(', '));
/* THE VIOLENCE PREMIUM (rule 323 amended, ask line 321): a job with no killing pays clearly less than the same hours and skulls with one
   fight in them, and most quiet jobs pay less than they did; a long walk's own hours may still clear its old pay */
const asKill = r => Math.max(r.skulls * PAY.floor_per_skull.value, Math.ceil(r.hours * bar + (1 + r.risk) * PAY.per_fight.value * PAY.skull_mult.value[r.skulls]));
const notLess = quiet.filter(r => r.pay > 0.75 * asKill(r)), fewer = quiet.filter(r => r.pay < r.before);
ok('every job with no killing pays clearly less (at most three quarters) than its hours and skulls with one fight in them (' + quiet.length + ' jobs)', quiet.length >= 6 && notLess.length === 0, notLess.map(r => r.id + ' ' + r.pay + ' vs ' + asKill(r)).join(', '));
ok('most quiet jobs pay less than they did (a walk, a delivery, a search)', fewer.length * 4 >= quiet.length * 3, fewer.length + ' of ' + quiet.length);
const ph = xs => xs.reduce((s, r) => s + r.pay, 0) / xs.reduce((s, r) => s + r.hours, 0);
ok('a map hour of killing work pays at least twice a map hour of walking', ph(kill) >= 2 * ph(quiet), ph(kill).toFixed(1) + ' vs ' + ph(quiet).toFixed(1));
const VW = (PAY.violence.value || {}).words || {};
P.set(PAY); const wq = P.violenceWord('jk-scout-wells'), wk = P.violenceWord('qd-aa01');
ok('the offer says which: the dog hunt "' + wk + '", the wells "' + wq + '"', !!VW.violent && !!VW.quiet && wk === VW.violent && wq === VW.quiet && (wk + wq).indexOf('\u2014') < 0);
ok('the margin is a real margin (the hours pay at least what they cost)', PAY.margin.value >= 0.25, PAY.margin.value);

/* THE HUNT */
const dogs = rows.filter(r => r.id === 'qd-aa01')[0];
ok('the dog hunt pays per head: 11 dogs counted, and clearly more than the 30 it paid', !!dogs && dogs.kind === 'hunt-kind' && dogs.heads === 11 && dogs.pay >= 3 * dogs.before && dogs.pay >= Math.floor(11 * PAY.per_fight.value / PAY.pack_size.value), dogs && (dogs.before + ' -> ' + dogs.pay + ', ' + dogs.why));
const hunts = rows.filter(r => r.kind === 'hunt-kind'), perHead = hunts.every(h => h.heads > 0);
const moreDogs = P.base({ id: 'x', skulls: 1, before: 0 }, { offers: { x: { kind: 'hunt-kind', need: 12 } }, kinds: J('records/target/BOHEMIA_JOB_KINDS.json').kinds }).pay > P.base({ id: 'y', skulls: 1, before: 0 }, { offers: { y: { kind: 'hunt-kind', need: 6 } }, kinds: J('records/target/BOHEMIA_JOB_KINDS.json').kinds }).pay;
ok('every hunt counts its heads, and twelve heads pay more than six', hunts.length >= 4 && perHead && moreDogs);

/* THE STANDING */
const B = J('records/target/bb/relations.json').bands.value.map(b => b.id), S = PAY.standing.value;
const ms = B.map(b => (S[b] || {}).mult), mono = ms.every((m, i) => typeof m === 'number' && (i === 0 || m >= ms[i - 1]));
ok('the nine bands each have a multiplier, rising up the bar, neutral exactly 1, never past 1.15', B.length === 9 && mono && S.neutral.mult === 1 && Math.max.apply(null, ms) <= 1.15 && Math.min.apply(null, ms) >= 0.85, ms.join(' '));
const words = B.filter(b => S[b].mult !== 1).map(b => S[b].word || '');
ok('every bent band says it on the offer, the percent in it, no em dash', words.every(w => /\d+% PAY$/.test(w) && w.indexOf('—') < 0 && w.indexOf('–') < 0), words.filter(w => !/\d+% PAY$/.test(w)).join(' | '));
global.localStorage = { _: { 'bohemia.relations.v1': JSON.stringify({ bars: { 'THE CHURCH': 75, 'COLD CAMP': 33 }, seen: { 'THE CHURCH': 4 } }) }, getItem(k) { return this._[k] || null; } };
const fr = P.at('THE CHURCH', 4), co = P.at('COLD CAMP', 4), ne = P.at('NOBODY KNOWS', 4), dr = P.at('THE CHURCH', 24);
ok('a friendly town (75) bends the dog hunt\'s 116 to 125 and says "' + fr.word + '"; a cold one (33) pays less; a stranger as it is', fr.band === 'friendly' && P.bend(116, fr) === 125 && co.mult < 1 && ne.mult === 1 && ne.word === '', fr.band + ' ' + P.bend(116, fr) + ', ' + co.band + ' ' + co.mult);
ok('the bar drifts back toward 50 by the wiki\'s 0.25 a dawn between visits (75, twenty dawns on: 70)', dr.score === 70, dr.score);

/* THE WIRES */
const CW = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8'), SE = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_SETTLEMENT_SCREEN.html'), 'utf8');
const PH = fs.readFileSync(path.join(ROOT, 'slices/bohemia_phone_board.js'), 'utf8');
const lj = (CW.match(/function loopJobPay\(base, place, st\)\{[\s\S]*?\n  if\(!p\)/) || [''])[0];
ok('the map\'s pay reads the town\'s standing (the board\'s number first, else the town\'s own bar)', /st\.mult/.test(lj) && /BohemiaJobPay\.at\(String\(place\)/.test(lj));
ok('the take hands the town and the board\'s number to the pay', CW.indexOf('pay: loopJobPay(c.pay, town.name, c.standing)') >= 0);
ok('the town\'s board shows the bent pay, says killing work or walking pay and the standing under the trip, and sends the number with the contract', /function payShown\(p\)\{[^\n]*standHere\(\)\.mult/.test(SE) && /ST\.word/.test(SE) && /BohemiaJobPay\.violenceWord\(o\.id\)/.test(SE) && SE.indexOf('standing:{mult:standHere().mult}') >= 0);
ok('the phone passes the place, so it lists the bent pay', PH.indexOf('loopJobPay(o.pay, name)') >= 0);
ok('both pages load the pay engine', CW.indexOf('<script src="../engine/bohemia_job_pay.js"></script>') >= 0 && SE.indexOf('<script src="../engine/bohemia_job_pay.js"></script>') >= 0);
const SH = fs.readFileSync(path.join(ROOT, 'tools/bohemia_run2_board_shelf.py'), 'utf8');
ok('the shelf\'s baker reads the table (a modder edits job_pay.json, not the baker)', /job_pay\.json/.test(SH) && /PAYS\.get\(/.test(SH));

/* THE PURSE */
const pu = T.purse(true), d30 = pu.rows.filter(r => r.day === 30)[0], d50 = pu.rows.filter(r => r.day === 50)[0], hr = pu.perHourAfter / pu.perHourBefore;
ok('the probe\'s purse rises and does not explode: day 30 x' + d30.ratio + ', day 50 x' + d50.ratio + ', a map hour x' + hr.toFixed(2), d30.ratio > 1 && d30.ratio < 2 && d50.ratio < 2 && hr > 1 && hr < 2);

console.log((fail ? 'FAIL' : 'PASS') + ' a job pays for the time and the risk: ' + pass + ' ok, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
