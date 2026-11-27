#!/usr/bin/env node
/* THE NEW GUNS PRICED (ECONOMY FOUR 11/27, VAMILY rule 489(b): ARMORY 3's guns, drones and rounds 'in the one price table'; rule 478:
   rounds stay scarce; ECONOMY THREE's handoff, job 3). records/BOHEMIA_ECONOMY_FOUR_THE_NEW_GUNS_PRICED_11_27_26.md.
   The game's price is the weapons table's (records/target/bb/weapons.json value, crowns at ten to one, the one table's catalog rule);
   the real one is records/target/bb/gun_street.json (US dollars in median working days at four AA a day, the implants' way).
     G1 every fire-carrying or beat-up piece ARMORY 3 added has a real price and a band, and a game price over nothing
     G2 every piece sits inside its band (civilian 1 to 4 times its real price, rare 1 to 8, the burned drone 1 to 2), or is HELD by
        name with its reason; the HELD list is no longer than it was at registration (3)
     G3 the charge drone is cheap (his word, rule 489(b)): its kit of two inside the consumable band, and under the AR and the AK
        every garage has
     G4 a beat-up gun is a little over half its clean one (the worn share, one AA either way)
     G5 a rocket refills from the rounds at its per_shot, and that costs about what a rocket did (inside the rare band)
     G6 THE ROUNDS STAY SCARCE: six rounds at the stall cost at least ten times what they did; a belt-fed's full belt costs more than a
        night of food for three, and a town's day of rounds cannot fill it
     G7 every number has a value and a source
   node gates/the_new_guns_priced_gate.js */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const J = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const G = J('records/target/bb/gun_street.json'), A = J('records/target/bb/armory.json'), W = J('records/target/bb/weapons.json'), S = J('records/target/bb/stall_prices.json'), B = J('records/target/bb/nightly_bill.json');
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const day = G.day_usd.value, aa = G.aa_a_day.value, realAA = (usd) => usd / day * aa;
const rows = {}; W.rows.forEach(r => { rows[r.id] = r; });
const game = (id) => rows[id] ? Math.max(1, Math.round(rows[id].value / 10)) : null;
const spec = {}; A.weapons.forEach(w => { spec[w.id] = w; });
const mine = A.weapons.filter(w => w.fire || w.worn_of).map(w => w.id), P = G.pieces.value, bands = G.bands.value, held = G.held.value;

const noReal = mine.filter(id => !P[id] && !spec[id].worn_of), noGame = mine.filter(id => !(game(id) >= 1));
ok('G1 ' + mine.length + ' pieces ARMORY 3 added: each a real price and a band (the beat-up ones by their clean gun), each a game price', noReal.length === 0 && noGame.length === 0, noReal.concat(noGame).join(', '));
const ladder = [], out = [];
Object.keys(P).forEach(id => { const g = game(id), r = realAA(P[id].usd), x = g / r, bd = bands[P[id].band] || [1, 1];
  ladder.push(id + ' ' + g + '/' + r.toFixed(1) + ' x' + x.toFixed(1)); if (x < bd[0] - 1e-9 || x > bd[1] + 1e-9) out.push(id); });
const unexplained = out.filter(id => !held[id]), stale = Object.keys(held).filter(id => out.indexOf(id) < 0);
ok('G2 inside its band or HELD by name (' + ladder.join(', ') + '); out of band: ' + (out.join(', ') || 'none') + '; held ' + Object.keys(held).length + ' of at most 3',
  unexplained.length === 0 && Object.keys(held).length <= 3 && stale.length === 0, unexplained.length ? 'unexplained ' + unexplained.join(', ') : (stale.length ? 'held but in band (take it off the list) ' + stale.join(', ') : undefined));
const civRifles = ['ranch_ar', 'kalash'].map(game), dr = game('charge_drone'), drx = dr / realAA(P.charge_drone.usd);
ok('G3 the charge drone is cheap: ' + dr + ' for the kit of two (x' + drx.toFixed(1) + ' its real price), under the AR and the AK every garage has (' + civRifles.join(', ') + ')',
  drx >= bands.consumable[0] && drx <= bands.consumable[1] && civRifles.every(c => dr < c));
const worn = A.weapons.filter(w => w.worn_of), wbad = worn.filter(w => Math.abs(game(w.id) - game(w.worn_of) * G.worn_share.value) > 1.01);
ok('G4 beat-up at a little over half (' + worn.map(w => w.id.replace('worn_', '') + ' ' + game(w.id) + '/' + game(w.worn_of)).join(', ') + ')', worn.length > 0 && wbad.length === 0, wbad.map(w => w.id).join(', '));
const per6 = S.goods.rounds.buy.value, perRound = per6 / (S.goods.rounds.per_unit || 6), rk = spec.rocket_launcher.fire.per_shot, rocketAA = rk * perRound, rx = rocketAA / realAA(G.rocket_usd.value);
ok('G5 a rocket refills at ' + rk + ' rounds, ' + rocketAA.toFixed(1) + ' AA, x' + rx.toFixed(1) + ' a real one (' + realAA(G.rocket_usd.value).toFixed(1) + ' AA)', rx >= bands.rare[0] && rx <= bands.rare[1]);
const sixReal = realAA(6 * G.rounds_usd.value), scarce = per6 / sixReal, belt = spec.belt_fed.fire.rounds, beltAA = belt * perRound, food3 = 3 * B.per_man_per_night.value;
const townDay = S.the_day.stock.value.rounds.town * (S.goods.rounds.per_unit || 6);
ok('G6 THE ROUNDS STAY SCARCE: six rounds ' + per6 + ' AA, x' + scarce.toFixed(0) + ' what they were; a full belt of ' + belt + ' is ' + beltAA.toFixed(1) + ' AA against a night of food for three (' + food3 + '); a town\'s day of rounds is ' + townDay,
  scarce >= 10 && beltAA > food3 && townDay < belt);
const keys = ['day_usd', 'aa_a_day', 'bands', 'pieces', 'worn_share', 'rocket_usd', 'rounds_usd', 'held'], miss = keys.filter(k => !G[k] || G[k].value === undefined || !G[k].source);
ok('G7 every number has a value and a source', miss.length === 0, miss.join(', '));
console.log('=== THE NEW GUNS PRICED: ' + pass + ' ok, ' + fail + ' failed ===');
process.exit(fail ? 1 : 0);
