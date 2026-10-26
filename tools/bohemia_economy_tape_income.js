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
   node tools/bohemia_economy_tape_income.js [--json] [--runs 200] [--per-kill 1,2] [--kill-share 0.8] */
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
  return {
    income: J('records/target/bb/tape_income.json'), stall: J('records/target/bb/stall_prices.json'),
    cap: J('records/target/bb/stash_rates.json').toolRepair.carryCap.veteranAndExpert,
    shapes: [
      { id: 'newcrew', name: 'A NEW CREW (three)', bench: 'crew:2-3', med: g('crew:2-3').tape_median, p90: g('crew:2-3').tape_p90, mean: g('crew:2-3').tape_mean, won: g('crew:2-3').won / g('crew:2-3').fights, foes: [3, 5], dogs: 0, start: tape('newcrew') },
      { id: 'watch', name: 'THE BLOCK WATCH (twelve)', bench: 'crew:12', med: g('crew:12').tape_median, p90: g('crew:12').tape_p90, mean: g('crew:12').tape_mean, won: g('crew:12').won / g('crew:12').fights, foes: [6, 10], dogs: 0, start: tape('watch') },
      { id: 'wolf', name: 'THE LONE WOLF (one)', bench: 'crew:1', med: g('crew:1').tape_median, p90: g('crew:1').tape_p90, mean: g('crew:1').tape_mean, won: g('crew:1').won / g('crew:1').fights, foes: [2, 4], dogs: 0.5, start: tape('wolf') }
    ]
  };
}

function oneRun(D, sh, home, seed, over) {
  const R = rng(seed), I = D.income, pace = I.the_bar.pace.value, per = D.stall.tape_shelf.restock_days.value;
  const pk = (over && over.perKill) || I.loot_tape.per_kill.value, ks = (over && over.killShare) || KILL_SHARE;
  const sigma = Math.log(sh.p90 / Math.max(0.1, sh.med)) / 1.2816, mu = Math.log(Math.max(0.1, sh.med));
  /* the bench's median and worst tenth set the shape; its mean sets the scale (the bench's tail is longer than a lognormal's) */
  const scale = sh.mean / (sh.med * Math.exp(sigma * sigma / 2));
  let stock = sh.start, need = 0, had = sh.start, bought = 0, looted = 0, short = 0, shortRolls = 0, fights = 0;
  const shelf = SP.tapeShelf(D.stall, { tier: home });
  for (let day = 0; day < 30; day++) {
    if (day % per === 0) { const b = Math.max(0, Math.min(shelf, D.cap - stock)); stock += b; bought += b; had += b; }
    for (let f = 0; f < pace; f++) {
      fights++;
      const broke = Math.round(Math.exp(mu + sigma * normal(R)) * scale * 10) / 10;
      need += broke;
      if (R() < sh.won) {
        const foes = sh.foes[0] + Math.floor(R() * (sh.foes[1] - sh.foes[0] + 1));
        for (let i = 0; i < foes; i++) {
          if (R() < sh.dogs) continue;                 /* a dog carries no tape */
          if (R() >= ks) continue;                     /* he fled with his kit */
          const t = pk[0] + Math.floor(R() * (pk[1] - pk[0] + 1));
          looted += t; had += t; stock = Math.min(D.cap, stock + t);
        }
      }
      if (stock + 1e-9 < broke) { short++; shortRolls += broke - stock; stock = 0; } else stock -= broke;
    }
  }
  return { need, had, bought, looted, ratio: had / Math.max(1e-9, need), short, shortRolls, fights, end: stock };
}

function run(over) {
  const D = load(); if (over && over.stall) D.stall = over.stall;
  const runs = +((over && over.runs) || 200), out = { pace: D.income.the_bar.pace.value, spare: D.income.the_bar.spare.value, killShare: (over && over.killShare) || KILL_SHARE, perKill: (over && over.perKill) || D.income.loot_tape.per_kill.value, shapes: {} };
  D.shapes.forEach(sh => {
    out.shapes[sh.id] = { name: sh.name, needMean: sh.mean, won: +sh.won.toFixed(2), foes: sh.foes, dogs: sh.dogs, start: sh.start, homes: {} };
    ['camp', 'town', 'fortress'].forEach(home => {
      const rs = []; for (let s = 1; s <= runs; s++) rs.push(oneRun(D, sh, home, s * 7919 + home.length, over));
      const by = k => rs.map(r => r[k]).sort((a, b) => a - b), q = (a, p) => a[Math.min(a.length - 1, Math.floor(p * a.length))];
      const ratio = by('ratio'), lootShare = rs.map(r => r.looted / r.need).sort((a, b) => a - b);
      out.shapes[sh.id].homes[home] = {
        ratio_median: +q(ratio, 0.5).toFixed(2), ratio_p10: +q(ratio, 0.1).toFixed(2),
        loot_covers_median: +q(lootShare, 0.5).toFixed(2),
        never_short: +(rs.filter(r => r.short === 0).length / rs.length).toFixed(2),
        short_fights_median: q(by('short'), 0.5), short_rolls_median: +q(by('shortRolls'), 0.5).toFixed(1),
        need_month: Math.round(q(by('need'), 0.5)), bought_month: Math.round(q(by('bought'), 0.5)), looted_month: Math.round(q(by('looted'), 0.5)),
        back_room_a_day: +(q(by('shortRolls'), 0.5) / 30 * SP.tapePrice(D.stall, { tier: home, soldThisRestock: 1e9 })).toFixed(1)
      };
    });
  });
  const bar = 1 + out.spare;
  out.tests = {
    R1_a_new_crew_has_more_than_it_needs: ['camp', 'town', 'fortress'].every(h => out.shapes.newcrew.homes[h].ratio_median >= bar),
    R2_the_twelve_has_more_than_it_needs: ['camp', 'town', 'fortress'].every(h => out.shapes.watch.homes[h].ratio_median >= bar),
    R3_a_typical_run_is_never_short_at_a_town: out.shapes.newcrew.homes.town.never_short >= 0.5 && out.shapes.watch.homes.town.never_short >= 0.5
  };
  return out;
}

if (require.main === module) {
  const over = {};
  if (arg('--runs')) over.runs = +arg('--runs');
  if (arg('--per-kill')) over.perKill = arg('--per-kill').split(',').map(Number);
  if (arg('--kill-share')) over.killShare = +arg('--kill-share');
  const r = run(over);
  if (process.argv.includes('--json')) { console.log(JSON.stringify(r, null, 1)); process.exit(0); }
  console.log('TAPE INCOME AGAINST ARMOUR WEAR: ' + r.pace + ' fights a day, 30 days, loot ' + r.perKill.join(' to ') + ' a man killed, ' + r.killShare + ' of a won fight killed; the bar: had at least ' + (1 + r.spare) + ' x needed');
  Object.keys(r.shapes).forEach(k => { const s = r.shapes[k];
    console.log(s.name + ': breaks ' + s.needMean + ' a fight (bench mean), wins ' + s.won + ', ' + s.foes.join(' to ') + ' foes' + (s.dogs ? ' (half dogs)' : '') + ', starts with ' + s.start);
    Object.keys(s.homes).forEach(h => { const x = s.homes[h]; console.log('  home a ' + h.padEnd(8) + ' had/needed ' + x.ratio_median + ' (worst tenth ' + x.ratio_p10 + '), the loot alone ' + x.loot_covers_median + ', never short ' + Math.round(100 * x.never_short) + '% of runs, a month: needs ' + x.need_month + ', buys ' + x.bought_month + ', loots ' + x.looted_month + '; short ' + x.short_rolls_median + ' rolls (the back room ' + x.back_room_a_day + ' batteries a day)'); });
  });
  console.log('TESTS ' + JSON.stringify(r.tests));
}
module.exports = { run, load };
