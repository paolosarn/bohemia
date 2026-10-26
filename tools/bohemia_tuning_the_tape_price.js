#!/usr/bin/env node
// TUNING [the tape price against the pay] 10/26 -- RESEARCH INSTRUMENT, NOT A GATE (rule 284(e), rule 38g; research only).
// ECONOMY 5a739556 (records/BOHEMIA_ECONOMY_DAY_85_THE_TAPE_BILL_ONE_ROLL_A_FIGHT_AND_THE_REST_IS_BOUGHT_10_26_26.md): at one roll a
// won fight, twelve men buying the rest of their tape spend 70 to 97 percent of their pay on ordinary jobs. The coordinator: the loot
// stays at one (never above three without his word); the lever is the stall's tape price or a fight's pay; set it in the one table so
// a run keeps its armour up with real money left over, the way Battle Brothers' tools are a cost but not the whole purse.
//
// PART ONE, THE LIVE FIGHT (slices/BOHEMIA_FIGHT.html through tools/bohemia_tuning_auto_brain.js, AUTO both sides, the watch's crew
// shapes and seeds): at the bell, for every fight, the TAPE it broke (the living men's helmet and body points lost over
// condition.json durability_per_tape, the camp clock's own count), the men of theirs beaten (dead and fled, renown's fight_won_per_enemy),
// and what the LOOT sells for: the fight's bodies (spoilsOf, rebuilt here from the same rows) through engine/bohemia_spoils.js found()
// (Battle Brothers' drop conditions, loot.json) and its sellBack (the shop's seventh of a piece's worth left, a calm town, no standing),
// the shop's price max(1, round(value / 10)) (slices/BOHEMIA_SETTLEMENT_SCREEN.html priceOf); plus the batteries the dead carried.
// PART TWO, THE PURSE: 30 map days at the map's pace (tape_income.json the_bar.pace, 5), the home stall's shelf and back room through
// engine/bohemia_stall_prices.js (ECONOMY's own model, tools/bohemia_economy_tape_income.js), food per man a night (nightly_bill.json);
// each fight drawn from that company's own live fights (bootstrap, so a fight's tape, win, kills and loot stay together); a won fight
// pays the job (BOHEMIA_BOARD_SHELF.json pay_per_skull x skulls) x the clout multiplier (renown.json pay_mult, the live
// engine/bohemia_renown.js arithmetic: +100 a job done, +5 a man beaten, -75 a job failed). Switches: --pay flat|size, --clout off|live,
// --loot none|sold, and the levers --back <mult>, --points <per roll>, --pay-skull <n>.
//   node tools/bohemia_tuning_the_tape_price.js [--n 100] [--jobs 4] [--runs 300] [--save]
// The resume cache lives in the scratchpad (TUNING_CACHE), never in the repo. Every number it prints is DRAFT.
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const B = require('./bohemia_tuning_auto_brain.js'), WATCH = require('./bohemia_tuning_stupid_move_watch.js');
const SP = require(path.join(ROOT, 'engine/bohemia_stall_prices.js')), SPOILS = require(path.join(ROOT, 'engine/bohemia_spoils.js'));
const J = p => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const CACHE = process.env.TUNING_CACHE || '/tmp';
const BANK = path.join(ROOT, 'banks/BOHEMIA_TUNING_THE_TAPE_PRICE_10_26_26.json');

/* a true one-skull job for the twelve (party_math.json job_bb: base_men 4 x the roster's multiplier, 12 at level 1 = 1.1: four or five
   men), beside the watch's own six to ten (a two- or three-skull job for them); a side shape of this bench only */
WATCH.SHAPES.watch1 = { why: 'the twelve against a one-skull job of theirs (four or five)', side: true, origin: 'watch', cap: 12, faction: k => ['brigands', 'beasts', 'kids', 'machines', 'heavies'][k % 5], count: k => 4 + (k % 2), days: k => 1 + (k % 5) * 12 };
const SHAPES = ['newcrew', 'watch', 'watch1', 'wolf', 'his'];
const CREW = { newcrew: 3, watch: 12, watch1: 12, wolf: 1, his: 3 };

function rng(seed) { let x = seed >>> 0 || 1; return () => { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return ((x >>> 0) % 1000000) / 1000000; }; }

async function oneFight(shape, k) {
  const ctx = await B.engineFor('today'), F = ctx.FIGHT, S = F.S, DB = ctx.DB;
  const meta = await WATCH.setupShape(ctx, shape, k, DB.boardKinds.districts);
  let guard = 0;
  while (!S.over && S.round <= 60 && guard++ < 200000) { const v = F.current(); if (!v) break; F.aiStep(v); }
  const per = J('records/target/bb/condition.json').durability_per_tape.value;
  const live = S.units.filter(u => u.side === 'you' && !u.dead);
  const armLost = live.reduce((a, u) => a + Math.max(0, (u.armHMax || 0) - (u.armH || 0)) + Math.max(0, (u.armBMax || 0) - (u.armB || 0)), 0);
  /* the fight's spoilsOf, rebuilt from the same rows (slices/BOHEMIA_FIGHT.html spoilsOf) */
  const wear = (t, part, now, max) => {
    const r = (DB.enemies.rows.filter(e => e.id === t.kind)[0] || {}).gear || [];
    const rows = DB.armor[part].filter(a => r.indexOf(a.name) >= 0);
    if (!rows.length || !(max > 0)) return null;
    const a = rows.slice().sort((x, y) => Math.abs(x.durability - max) - Math.abs(y.durability - max))[0];
    return { id: a.id, now: Math.max(0, Math.round(now || 0)), max: Math.round(max) };
  };
  const wrow = w => w ? DB.weapons.rows.filter(r => r.id === w.id)[0] || null : null;
  const them = S.units.filter(v => v.side === 'them');
  const spoils = { faction: null, bodies: them.map(t => ({ name: t.name, kind: t.kind, dead: !!t.dead, fled: !!t.fled, beast: !!t.beast, ghost: !!t.ghost, machine: !!t.machine,
    weapon: wrow(t.weapon) ? { id: t.weapon.id, cls: wrow(t.weapon).class, durability: wrow(t.weapon).durability, gun: !!t.weapon.gun || (F.isGun ? F.isGun(t.weapon) : false), ammo: t.ammo, ammoMax: t.ammoMax } : null,
    shield: t.shield ? { id: t.shield.id, durability: t.shield.durability } : null,
    body: wear(t, 'body', t.armB, t.armBMax), head: wear(t, 'head', t.armH, t.armHMax) })) };
  const won = S.over && S.result === 'won';
  let sale = 0, items = 0, cash = 0;
  if (won) {
    const L = J('records/target/bb/loot.json'); L.tape_income = J('records/target/bb/tape_income.json');
    const got = SPOILS.found(spoils, L, rng(meta.seed * 31 + 7));
    const value = it => { const r = it.kind === 'weapon' ? wrow({ id: it.id }) : it.kind === 'shield' ? DB.armor.shields.filter(s => s.id === it.id)[0] : DB.armor[it.kind].filter(a => a.id === it.id)[0]; return (r && r.value) || 0; };
    got.items.forEach(it => { items++; sale += SPOILS.sellBack({ base: Math.max(1, Math.round(value(it) / 10)), cond: it.cond, condMax: it.max }); });
    cash = got.counts.batteries | 0;
  }
  return { shape, k, seed: meta.seed, enemies: them.length, won, beaten: them.filter(t => t.dead || t.fled).length, tape: armLost / per, sale, items, cash,
    dead: S.units.filter(u => u.side === 'you' && u.dead).length };
}

/* ---------- PART TWO: the purse ---------- */
function econ() {
  const shelf = J('records/target/BOHEMIA_BOARD_SHELF.json'), pm = J('records/target/bb/party_math.json').job_bb.value, ren = J('records/target/bb/renown.json');
  return { stall: J('records/target/bb/stall_prices.json'), income: J('records/target/bb/tape_income.json'), perManNight: J('records/target/bb/nightly_bill.json').per_man_per_night.value,
    perSkull: shelf.pay_per_skull, pm, gains: ren.gains.value, payMult: ren.pay_mult.value, cap: J('records/target/bb/stash_rates.json').toolRepair.carryCap.veteranAndExpert,
    origins: J('records/target/bb/origins.json').origins };
}
/* the skulls of the job a company meets this many men on: party_math.json job_bb (count = base_men[skulls] x the roster's multiplier),
   the skull whose count is nearest; level-1 men (10 a man, 10 each under three men) */
function skullsFor(E, crew, enemies) {
  const s = crew < 3 ? 10 * crew : 10 * Math.min(12, crew), m = Math.min(E.pm.mult_max, Math.max(E.pm.mult_min, E.pm.k * Math.pow(0.01 * s, E.pm.exp)));
  let best = 1, d = Infinity; [1, 2, 3].forEach(n => { const c = E.pm.base_men[n] * m, dd = Math.abs(c - enemies); if (dd < d - 1e-9) { d = dd; best = n; } });
  return best;
}
function purse(E, fights, crew, home, seed, o) {
  const R = rng(seed), pace = E.income.the_bar.pace.value, restock = E.stall.tape_shelf.restock_days.value;
  const stall = o.back ? JSON.parse(JSON.stringify(E.stall)) : E.stall; if (o.back) stall.tape_shelf.back_room_mult.value = o.back;
  const shelfN = SP.tapeShelf(stall, { tier: home }), perWon = E.income.loot_tape.per_won_fight.value, points = o.points || 15;
  const origin = E.origins.find(x => x.id === (crew === 12 ? 'watch' : crew === 1 ? 'wolf' : 'newcrew')) || {};
  let stock = ((origin.supplies || {}).tape || {}).thin || 0, sold = 0, renown = 0, pay = 0, bill = 0, food = 0, loot = 0, need = 0, back = 0, days = o.days || 30;
  const weeks = [];
  for (let day = 0; day < days; day++) {
    if (day % restock === 0) sold = 0;
    food += crew * E.perManNight;
    let wk = weeks[Math.floor(day / 7)] = weeks[Math.floor(day / 7)] || { pay: 0, bill: 0, food: 0, loot: 0 }; wk.food += crew * E.perManNight;
    for (let f = 0; f < pace; f++) {
      const x = fights[Math.floor(R() * fights.length)], broke = x.tape * 15 / points;
      need += broke;
      if (x.won) {
        const sk = o.pay === 'size' ? skullsFor(E, crew, x.enemies) : 1, cm = o.clout === 'off' ? 1 : E.payMult.from + (E.payMult.to - E.payMult.from) * Math.min(1, renown / E.payMult.at);
        const p = Math.max(1, Math.round((o.paySkull || E.perSkull) * sk * cm)); pay += p; wk.pay += p;
        renown += (E.gains.civilian_contract_done + E.gains.fight_won_per_enemy * x.beaten) * (o.renownScale || 1);
        stock = Math.min(E.cap, stock + perWon);
        if (o.loot === 'sold') { loot += x.sale + x.cash; wk.loot += x.sale + x.cash; }
      } else renown = Math.max(0, renown + E.gains.fail_civilian_contract * (o.renownScale || 1));
      let want = Math.max(0, Math.ceil(broke - stock - 1e-9));
      while (want > 0) { const pr = SP.tapePrice(stall, { tier: home, soldThisRestock: sold }); if (sold >= shelfN) back++; sold++; bill += pr; wk.bill += pr; stock += 1; want--; }
      stock -= broke;
    }
  }
  const income = pay + loot;
  return { pay, loot, bill, food, need, back, renown, net: income - bill - food, share: bill / Math.max(1e-9, income), shareOfPay: bill / Math.max(1e-9, pay),
    week1: weeks[0] ? { net: weeks[0].pay + weeks[0].loot - weeks[0].bill - weeks[0].food, share: weeks[0].bill / Math.max(1e-9, weeks[0].pay + weeks[0].loot) } : null };
}
function table(E, all, o, runs) {
  const out = {};
  SHAPES.forEach(sh => {
    const fights = all.filter(x => x.shape === sh); if (!fights.length) return;
    out[sh] = {};
    ['camp', 'town', 'fortress'].forEach(home => {
      const rs = []; for (let s = 1; s <= runs; s++) rs.push(purse(E, fights, CREW[sh], home, s * 7919 + home.length, o));
      const med = f => { const a = rs.map(f).sort((x, y) => x - y); return a[Math.floor(a.length / 2)]; }, d = o.days || 30;
      out[sh][home] = { pay_a_day: +(med(r => r.pay) / d).toFixed(1), loot_a_day: +(med(r => r.loot) / d).toFixed(1), tape_a_day: +(med(r => r.bill) / d).toFixed(1),
        food_a_day: +(med(r => r.food) / d).toFixed(1), left_a_day: +(med(r => r.net) / d).toFixed(1), share: +med(r => r.share).toFixed(2), share_of_pay: +med(r => r.shareOfPay).toFixed(2),
        in_black: +(rs.filter(r => r.net > 0).length / rs.length).toFixed(2), week1_left_a_day: +(med(r => r.week1.net) / 7).toFixed(1), week1_share: +med(r => r.week1.share).toFixed(2),
        renown_end: Math.round(med(r => r.renown)), back_room_a_day: +(med(r => r.back) / d).toFixed(1) };
    });
  });
  return out;
}

async function main() {
  const argv = process.argv, arg = (k, d) => { const i = argv.indexOf(k); return i > 0 ? argv[i + 1] : d; };
  if (argv[2] === '--fight') { process.stdout.write(JSON.stringify(await oneFight(argv[3], Number(argv[4])))); return; }
  const N = Number(arg('--n', 100)), JOBS = Number(arg('--jobs', 4)), RUNS = Number(arg('--runs', 300));
  const sha = cp.execSync('git log -1 --format=%h --abbrev=8 -- slices/BOHEMIA_FIGHT.html records/target/bb slices/fight_ground', { cwd: ROOT }).toString().trim(), fp = B.rulesPrint();
  const me = require('crypto').createHash('sha1').update(fs.readFileSync(__filename)).digest('hex').slice(0, 8);
  const CF = path.join(CACHE, 'tuning_tape_price.' + fp + '.' + me + '.ndjson'), res = {};
  if (fs.existsSync(CF)) fs.readFileSync(CF, 'utf8').split('\n').filter(Boolean).forEach(l => { try { const x = JSON.parse(l); res[x.shape + '|' + x.k] = x; } catch (e) { /* a cut line */ } });
  const work = []; SHAPES.forEach(s => { for (let k = 0; k < N; k++) if (!res[s + '|' + k]) work.push([s, k]); });
  process.stderr.write('rules ' + fp + ' (main ' + sha + '); resume ' + (SHAPES.length * N - work.length) + ' of ' + SHAPES.length * N + '\n');
  let next = 0, running = 0;
  await new Promise(done => {
    const pump = () => { while (running < JOBS && next < work.length) { const [s, k] = work[next++]; running++;
      cp.execFile(process.execPath, [__filename, '--fight', s, String(k)], { maxBuffer: 1 << 26 }, (err, so) => {
        running--;
        if (err) console.error('fight failed', s, k, err.message.slice(0, 300)); else { const x = JSON.parse(so); res[s + '|' + k] = x; fs.appendFileSync(CF, JSON.stringify(x) + '\n'); }
        if (next % 50 === 0) process.stderr.write(next + '/' + work.length + '\n');
        if (next >= work.length && running === 0) done(); else pump(); }); } };
    if (!work.length) done(); else pump();
  });
  const all = Object.values(res).filter(x => x.k < N), E = econ();
  const fightsOut = {};
  SHAPES.forEach(sh => { const f = all.filter(x => x.shape === sh), w = f.filter(x => x.won), m = a => a.length ? +(a.reduce((p, q) => p + q, 0) / a.length).toFixed(1) : 0;
    fightsOut[sh] = { crew: CREW[sh], fights: f.length, won: w.length, enemies: m(f.map(x => x.enemies)), tape_a_fight: m(f.map(x => x.tape)), tape_a_won_fight: m(w.map(x => x.tape)),
      sale_a_won_fight: m(w.map(x => x.sale)), cash_a_won_fight: m(w.map(x => x.cash)), items_a_won_fight: m(w.map(x => x.items)), beaten_a_won_fight: m(w.map(x => x.beaten)),
      skulls_by_size: m(w.map(x => skullsFor(E, CREW[sh], x.enemies))) };
    console.log(sh.padEnd(8) + JSON.stringify(fightsOut[sh])); });
  const V = {
    economy_day85: { pay: 'flat', clout: 'off', loot: 'none' },
    pay_by_size: { pay: 'size', clout: 'off', loot: 'none' },
    plus_loot_sold: { pay: 'size', clout: 'off', loot: 'sold' },
    live_today: { pay: 'size', clout: 'live', loot: 'sold' },
    flat_live: { pay: 'flat', clout: 'live', loot: 'sold' },
    flat_loot: { pay: 'flat', clout: 'off', loot: 'sold' }
  };
  /* the levers, on the hard reading (ECONOMY's: flat one-skull pay, no clout, nothing sold): the back room's mark-up and the pay a skull */
  [1, 1.5].forEach(b => { V['back_' + b] = { pay: 'flat', clout: 'off', loot: 'none', back: b }; });
  [35, 40, 45].forEach(p => { V['skull_' + p] = { pay: 'flat', clout: 'off', loot: 'none', paySkull: p }; });
  V.renown_fifth = { pay: 'size', clout: 'live', loot: 'sold', renownScale: 0.2 };
  V.renown_fifth_60 = { pay: 'size', clout: 'live', loot: 'sold', renownScale: 0.2, days: 60 };
  V.live_60 = { pay: 'size', clout: 'live', loot: 'sold', days: 60 };
  const T = {};
  Object.keys(V).forEach(k => { T[k] = table(E, all, V[k], RUNS);
    console.log('\n== ' + k + ' ' + JSON.stringify(V[k]));
    Object.keys(T[k]).forEach(sh => ['camp', 'town', 'fortress'].forEach(h => { const x = T[k][sh][h];
      console.log('  ' + sh.padEnd(8) + h.padEnd(9) + 'pay ' + String(x.pay_a_day).padStart(6) + ' loot ' + String(x.loot_a_day).padStart(6) + ' tape ' + String(x.tape_a_day).padStart(6) + ' (' + x.back_room_a_day + ' back) food ' + String(x.food_a_day).padStart(5)
        + ' left ' + String(x.left_a_day).padStart(7) + '  share ' + x.share + ' of income, ' + x.share_of_pay + ' of pay; in black ' + x.in_black + '; week one left ' + x.week1_left_a_day + ' (share ' + x.week1_share + '); clout ' + x.renown_end); })); });
  if (argv.includes('--save')) {
    fs.writeFileSync(BANK, JSON.stringify({ draft: true, _readme: 'TUNING [the tape price against the pay] (rule 284(e); research only). draft:true. NOTHING IN THE GAME READS THIS FILE. fights: the live fight on AUTO, per company shape; variants: 30 rolled map days at five fights a day, the median run, per home. tools/bohemia_tuning_the_tape_price.js',
      sha, rules_print: fp, n: N, runs: RUNS, at: new Date().toISOString(), fights: fightsOut, variants: V, tables: T,
      rows: all.map(x => ({ shape: x.shape, k: x.k, enemies: x.enemies, won: x.won, beaten: x.beaten, tape: +x.tape.toFixed(2), sale: x.sale, cash: x.cash, dead: x.dead })) }) + '\n');
    console.log('\nwrote ' + path.relative(ROOT, BANK));
  }
}
if (require.main === module) main().catch(e => { console.error(e); process.exit(1); });
module.exports = { oneFight, purse, skullsFor, econ };
