#!/usr/bin/env node
/* ECONOMY [tape income against armour wear] (rule 271(b)), the calculator behind
   records/BOHEMIA_ECONOMY_DAY_84_NO_RUN_ENDS_FOR_TAPE_10_26_26.md. A research instrument; gates/no_run_ends_for_tape_gate.js
   calls run().

   ROLLED RUNS: 30 map days at the map's pace (records/target/bb/tape_income.json the_bar.pace, rule 264), for three companies
   TUNING's bench measured (banks/BOHEMIA_TUNING_THE_CAMP_CLOCK_10_26_26.json groups: the tape a fight breaks, its median and its
   worst tenth, and how often it is won): A NEW CREW (crew:2-3), THE BLOCK WATCH (crew:12), THE LONE WOLF (crew:1). Their enemies
   per fight are the bench's own (tools/bohemia_tuning_stupid_move_watch.js SHAPES: newcrew 3 to 5, watch 6 to 10, wolf 2 to 4,
   half of the wolf's fights dogs). Every fight: the tape it breaks, rolled lognormal through the bench's median and worst tenth;
   if it is won, the loot (tape_income.json loot_tape: a roll or two from every man killed, never a dog), then the mending;
   a lost fight breaks the same and loots nothing. The home stall: its shelf (stall_prices.json tape_shelf) bought at the fair
   price every restock, up to the carry cap (stash_rates.json toolRepair.carryCap, Battle Brothers' 150). He starts with his
   origin's THIN tape (origins.json). Short = a fight's mending he could not pay from what he had at the fair price.
   node tools/bohemia_economy_tape_income.js [--json] [--runs 200] [--per-won-fight 1] [--per-kill 0,0] [--kill-share 0.8] */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const J = p => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const SP = require(path.join(ROOT, 'engine/bohemia_stall_prices.js'));
function arg(n, d) { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : d; }
function rng(seed) { let x = seed >>> 0 || 1; return () => { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return ((x >>> 0) % 1000000) / 1000000; }; }
function normal(R) { let u = 0, v = 0; while (u === 0) u = R(); v = R(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }

/* the share of a won fight's enemies that die (the fled keep their kit, loot.json only_the_dead): ECONOMY's reading, the
   bench does not count kills; the gate re-runs the bar at 0.6 to show it does not hang on it */
const KILL_SHARE = 0.8;

function load() {
  const bank = J('banks/BOHEMIA_TUNING_THE_CAMP_CLOCK_10_26_26.json').groups, origins = J('records/target/bb/origins.json').origins;
  const tape = id => ((origins.find(o => o.id === id) || {}).supplies || {}).tape.thin;
  const g = k => bank[k].march;
  const shelfPays = JSON.stringify(J('records/target/BOHEMIA_BOARD_SHELF.json')).match(/"pay":\s*(\d+)/g).map(x => +x.split(':')[1]);
  const crew = id => ((origins.find(o => o.id === id) || {}).men || []).length;
  return {
    jobPay: Math.min.apply(null, shelfPays), perManNight: J('records/target/bb/nightly_bill.json').per_man_per_night.value,
    income: J('records/target/bb/tape_income.json'), stall: J('records/target/bb/stall_prices.json'),
    cap: J('records/target/bb/stash_rates.json').toolRepair.carryCap.veteranAndExpert,
    shapes: [
      { id: 'newcrew', crew: crew('newcrew'), name: 'A NEW CREW (three)', bench: 'crew:2-3', med: g('crew:2-3').tape_median, p90: g('crew:2-3').tape_p90, mean: g('crew:2-3').tape_mean, won: g('crew:2-3').won / g('crew:2-3').fights, foes: [3, 5], dogs: 0, start: tape('newcrew') },
      { id: 'watch', crew: crew('watch'), name: 'THE BLOCK WATCH (twelve)', bench: 'crew:12', med: g('crew:12').tape_median, p90: g('crew:12').tape_p90, mean: g('crew:12').tape_mean, won: g('crew:12').won / g('crew:12').fights, foes: [6, 10], dogs: 0, start: tape('watch') },
      { id: 'wolf', crew: crew('wolf'), name: 'THE LONE WOLF (one)', bench: 'crew:1', med: g('crew:1').tape_median, p90: g('crew:1').tape_p90, mean: g('crew:1').tape_mean, won: g('crew:1').won / g('crew:1').fights, foes: [2, 4], dogs: 0.5, start: tape('wolf') }
    ]
  };
}

/* RULE 284 (Paolo 10/26: 'you're about to crash my economy... one duct tape as a baseline'): the loot is ONE roll a won fight
   (tape_income.json loot_tape.per_won_fight), whatever the kills; per_kill and the scrap go to 0. The rest is BOUGHT: the home
   stall's shelf at its price (refilled daily), past it the back room's (the smith's mend for the same damage costs the same,
   stall_prices.json mend: twice the tape). 284(g): the bar is the one roll plus the stall plus the smith, against WHAT A FIGHT
   PAYS: a won fight is a job at the board's routine pay (records/target/BOHEMIA_BOARD_SHELF.json, the least), a lost one pays
   nothing; the crew eats its nights (nightly_bill.json). Loot sold and the gear's own worth are left out (a ceiling on the bill,
   not on the income). */
function lootOf(I, over) {
  const lt = I.loot_tape || {};
  return {
    perWon: (over && over.perWonFight != null) ? over.perWonFight : (lt.per_won_fight ? lt.per_won_fight.value : 0),
    perKill: (over && over.perKill) || (lt.per_kill ? lt.per_kill.value : [0, 0])
  };
}
function oneRun(D, sh, home, seed, over) {
  const R = rng(seed), I = D.income, pace = I.the_bar.pace.value, per = D.stall.tape_shelf.restock_days.value;
  const L = lootOf(I, over), ks = (over && over.killShare) || KILL_SHARE;
  const sigma = Math.log(sh.p90 / Math.max(0.1, sh.med)) / 1.2816, mu = Math.log(Math.max(0.1, sh.med));
  /* the bench's median and worst tenth set the shape; its mean sets the scale (the bench's tail is longer than a lognormal's) */
  const scale = sh.mean / (sh.med * Math.exp(sigma * sigma / 2));
  const shelf = SP.tapeShelf(D.stall, { tier: home });
  let stock = sh.start, need = 0, looted = 0, shelfRolls = 0, backRolls = 0, bill = 0, pay = 0, food = 0, sold = 0;
  for (let day = 0; day < 30; day++) {
    if (day % per === 0) sold = 0;
    food += sh.crew * D.perManNight;
    for (let f = 0; f < pace; f++) {
      const broke = Math.round(Math.exp(mu + sigma * normal(R)) * scale * 10) / 10;
      need += broke;
      if (R() < sh.won) {
        pay += D.jobPay;
        let t = L.perWon;
        if (L.perKill[1] > 0) {
          const foes = sh.foes[0] + Math.floor(R() * (sh.foes[1] - sh.foes[0] + 1));
          for (let i = 0; i < foes; i++) { if (R() < sh.dogs || R() >= ks) continue; t += L.perKill[0] + Math.floor(R() * (L.perKill[1] - L.perKill[0] + 1)); }
        }
        looted += t; stock = Math.min(D.cap, stock + t);
      }
      /* mend what this fight broke: what he carries first, then the stall's shelf, then the back room (or the smith, the same) */
      let want = Math.max(0, Math.ceil(broke - stock - 1e-9));
      while (want > 0) {
        const price = SP.tapePrice(D.stall, { tier: home, soldThisRestock: sold });
        if (sold < shelf) shelfRolls++; else backRolls++;
        sold++; bill += price; stock += 1; want--;
      }
      stock -= broke;
    }
  }
  return { need, looted, shelfRolls, backRolls, bill, pay, food, net: pay - bill - food, share: bill / Math.max(1e-9, pay) };
}

function run(over) {
  const D = load(); if (over && over.stall) D.stall = over.stall;
  const runs = +((over && over.runs) || 200), L = lootOf(D.income, over);
  const out = { pace: D.income.the_bar.pace.value, killShare: (over && over.killShare) || KILL_SHARE, perWonFight: L.perWon, perKill: L.perKill, jobPay: D.jobPay, shapes: {} };
  D.shapes.forEach(sh => {
    out.shapes[sh.id] = { name: sh.name, crew: sh.crew, needMean: sh.mean, won: +sh.won.toFixed(2), foes: sh.foes, dogs: sh.dogs, start: sh.start, homes: {} };
    ['camp', 'town', 'fortress'].forEach(home => {
      const rs = []; for (let s = 1; s <= runs; s++) rs.push(oneRun(D, sh, home, s * 7919 + home.length, over));
      const med = k => { const a = rs.map(r => r[k]).sort((x, y) => x - y); return a[Math.floor(a.length / 2)]; };
      const day = k => +(med(k) / 30).toFixed(1);
      out.shapes[sh.id].homes[home] = {
        need_a_day: day('need'), loot_a_day: day('looted'), shelf_a_day: day('shelfRolls'), back_room_a_day: day('backRolls'),
        bill_a_day: day('bill'), pay_a_day: day('pay'), food_a_day: day('food'), net_a_day: day('net'),
        share: +med('share').toFixed(2), keeps_up: rs.filter(r => r.net > 0).length / rs.length
      };
    });
  });
  const nc = out.shapes.newcrew.homes;
  out.tests = {
    N1_a_new_crew_keeps_its_armour_up_on_its_pay: ['camp', 'town', 'fortress'].every(h => nc[h].net_a_day > 0 && nc[h].keeps_up >= 0.9),
    N2_a_new_crew_spends_under_a_third_of_its_pay_on_tape: ['camp', 'town', 'fortress'].every(h => nc[h].share < D.income.the_bar.tape_share_max.value)
  };
  out.tuning = Object.keys(out.shapes).filter(k => ['camp', 'town', 'fortress'].some(h => out.shapes[k].homes[h].net_a_day <= 0));
  return out;
}

if (require.main === module) {
  const over = {};
  if (arg('--runs')) over.runs = +arg('--runs');
  if (arg('--per-kill')) over.perKill = arg('--per-kill').split(',').map(Number);
  if (arg('--per-won-fight')) over.perWonFight = +arg('--per-won-fight');
  if (arg('--kill-share')) over.killShare = +arg('--kill-share');
  const r = run(over);
  if (process.argv.includes('--json')) { console.log(JSON.stringify(r, null, 1)); process.exit(0); }
  console.log('THE TAPE BILL: ' + r.pace + ' fights a day, 30 days; the loot ' + r.perWonFight + ' a won fight' + (r.perKill[1] ? ' + ' + r.perKill.join(' to ') + ' a man killed' : '') + '; a won fight pays ' + r.jobPay);
  Object.keys(r.shapes).forEach(k => { const s = r.shapes[k];
    console.log(s.name + ': ' + s.crew + (s.crew === 1 ? ' man' : ' men') + ', breaks ' + s.needMean + ' rolls a fight (bench mean), wins ' + s.won);
    Object.keys(s.homes).forEach(h => { const x = s.homes[h]; console.log('  from a ' + h.padEnd(8) + ' a day: breaks ' + x.need_a_day + ', loots ' + x.loot_a_day + ', buys ' + x.shelf_a_day + ' off the shelf + ' + x.back_room_a_day + ' from the back = ' + x.bill_a_day + ' batteries, ' + Math.round(100 * x.share) + '% of the ' + x.pay_a_day + ' the fights pay; food ' + x.food_a_day + '; left ' + x.net_a_day + ' (' + Math.round(100 * x.keeps_up) + '% of months in the black)'); });
  });
  console.log('TESTS ' + JSON.stringify(r.tests) + (r.tuning.length ? '  FOR TUNING: ' + r.tuning.join(', ') + ' cannot keep its armour up on routine pay somewhere' : ''));
}
module.exports = { run, load };
