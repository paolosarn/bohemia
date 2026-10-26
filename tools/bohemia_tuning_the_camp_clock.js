#!/usr/bin/env node
// TUNING [the camp note] 10/26 -- RESEARCH INSTRUMENT, NOT A GATE (rule 226(b), rule 117, rule 38g). Paolo 10/26: 'in Battle Brothers
// you can't just do fights back to back, your people need to heal... the damage you sustained in battle'.
// What a fight COSTS the company afterwards, at Battle Brothers' rates (records/target/bb/condition.json, CAMP's file, each row a
// quoted wiki line): it plays the LIVE fight on AUTO both sides (the watch's six crew shapes, tools/bohemia_tuning_stupid_move_watch.js)
// and reads every man of ours at the bell: the hitpoints he lost (a man struck down and alive wakes at struck_down_hp_left), what his
// helmet and body armour lost, his injuries and their days, the dead. Then the clock: hours to whole on the march and camped (every
// man heals at once; every worn piece is mended at once, CAMP's reading: the wiki does not say whether pieces mend in turn), the TAPE
// it takes (one for 15 points), the MEDS (one a day for every injury, bb_all/1253 Medical Supplies), the HEAL bar the moment the fight
// ends (the living company's hitpoints and armour over whole, rule 226(c)), and the real seconds it all takes on our clock (camp: an
// hour a beat, 500 ms, slices/BOHEMIA_CITY_WORLD.html campHour) beside Battle Brothers' (a day is 1 minute 45 seconds, bb_all/0828).
//   node tools/bohemia_tuning_the_camp_clock.js [--n 100] [--shapes his,wolf,newcrew,spear,watch,bench] [--save]
// Every number it prints is DRAFT. The bank (draft:true, nothing in the game reads it): banks/BOHEMIA_TUNING_THE_CAMP_CLOCK_10_26_26.json
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const B = require('./bohemia_tuning_auto_brain.js'), WATCH = require('./bohemia_tuning_stupid_move_watch.js');
const RATE = (() => { const j = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/condition.json'), 'utf8')), o = {}; Object.keys(j).forEach(k => { if (j[k] && typeof j[k].value === 'number') o[k] = j[k].value; }); return o; })();
const BANK = path.join(ROOT, 'banks/BOHEMIA_TUNING_THE_CAMP_CLOCK_10_26_26.json');
const BB_SECONDS_AN_HOUR = 105 / 24, CAMP_SECONDS_AN_HOUR = 0.5;

async function oneFight(shape, k) {
  const ctx = await B.engineFor('today'), F = ctx.FIGHT, S = F.S;
  const meta = await WATCH.setupShape(ctx, shape, k, ctx.DB.boardKinds.districts);
  let guard = 0;
  while (!S.over && S.round <= 60 && guard++ < 200000) { const v = F.current(); if (!v) break; F.aiStep(v); }
  const men = S.units.filter(u => u.side === 'you').map(u => ({
    dead: !!u.dead, down: !!u.down, hpMax: u.hpMax, hp: u.dead ? 0 : u.down ? RATE.struck_down_hp_left : Math.max(0, u.hp),
    armH: u.armH, armHMax: u.armHMax, armB: u.armB, armBMax: u.armBMax,
    inj: (u.injuries || []).filter(j => j.kind === 'temporary' && j.heal_days).map(j => ({ id: j.id, days: (j.heal_days[0] + j.heal_days[1]) / 2 }))
  }));
  return Object.assign(meta, { shape, result: S.over ? S.result : 'stalled', rounds: S.round, men });
}

/* BACK TO BACK (rule 226's point: 'you can't just do fights back to back'): fight A, then the next fight on the road (the same crew
   shape's fight k+1000) with the men who are still standing (the dead and the laid up stay home), four ways: WHOLE (the same men,
   healed), CARRIED (every wound and dent from A, the fight's own condApply), MARCH 12 (twelve hours on the road between), CAMP 12
   (twelve hours camped: 24 hitpoints back, 72 points a piece mended). The fight reads a man's .cond (engine/bohemia_condition.js's
   handOver shape: lostHp, lostH, lostB, head, body). Shapes that come from the door or his three (not the bench). */
async function setupWith(ctx, shape, k, company0, cap0) {
  const F = ctx.FIGHT, Sh = WATCH.SHAPES[shape], W = B.fightOf(k, ctx.DB.boardKinds.districts);
  ctx.setSeed(W.seed);
  F.setup({ auto: true, formation: null, company: company0, cap: cap0, party: { faction: Sh.faction(k), count: Sh.count(k), days: Sh.days(k) }, days: Sh.days(k), district: W.district, cell: W.cell, act: 1 });
  F.S.deploy = false;
}
function play(ctx) { const F = ctx.FIGHT, S = F.S; let g = 0; while (!S.over && S.round <= 60 && g++ < 200000) { const v = F.current(); if (!v) break; F.aiStep(v); } return S; }
async function backToBack(shape, k) {
  const ctxA = await B.engineFor('today');
  await WATCH.setupShape(ctxA, shape, k, ctxA.DB.boardKinds.districts);
  const SA = play(ctxA), ours = SA.units.filter(u => u.side === 'you');
  if (SA.result !== 'won') return { shape, k, a: SA.result };
  const src = await companyOf(shape, k);
  const keep = [];
  /* the fight names its men c0, c1... in the company's order (crewUnit), so a man's place in the roll is his id */
  ours.forEach(u => { const i = Number(String(u.id).slice(1)); if (u.dead || u.down || !src[i]) return;
    keep.push({ m: src[i], cond: { lostHp: u.hpMax - u.hp, lostH: u.armHMax - u.armH, lostB: u.armBMax - u.armB, head: u.headRow ? u.headRow.id : null, body: u.bodyRow ? u.bodyRow.id : null } }); });
  if (!keep.length) return { shape, k, a: 'won', none: true };
  const ways = { whole: c => null, carried: c => c, march12: c => heal(c, 12, false), camp12: c => heal(c, 12, true) }, out = { shape, k, a: 'won', men: keep.length, of: ours.length };
  for (const w of Object.keys(ways)) {
    const ctx = await B.engineFor('today');
    const comp = keep.map(x => { const c = ways[w](x.cond); return c ? Object.assign({}, x.m, { cond: c }) : Object.assign({}, x.m); });
    await setupWith(ctx, shape, k + 1000, comp, comp.length);
    const hurtIn = ctx.FIGHT.S.units.filter(u => u.side === 'you').reduce((m, u) => m + (u.cameHurt ? u.cameHurt.hp + u.cameHurt.armH + u.cameHurt.armB : 0), 0);   /* the proof the wounds went in */
    const S = play(ctx), mine = S.units.filter(u => u.side === 'you');
    out[w] = { result: S.result, down: mine.filter(u => u.down || u.dead).length, dead: mine.filter(u => u.dead).length, clean: S.result === 'won' && !mine.some(u => u.down || u.dead), hurtIn };
  }
  return out;
}
function heal(c, h, camped) {
  const hp = h * (camped ? RATE.hp_per_hour_camp : RATE.hp_per_hour_march), arm = h * RATE.armour_per_hour * (camped ? RATE.camp_repair_mult : 1);
  return Object.assign({}, c, { lostHp: Math.max(0, c.lostHp - hp), lostH: Math.max(0, c.lostH - arm), lostB: Math.max(0, c.lostB - arm) });
}
/* the company setupShape hands the fight for this shape and k (the same roll, so the same men in the same order) */
async function companyOf(shape, k) {
  const Sh = WATCH.SHAPES[shape];
  if (!Sh.origin) return WATCH.HIS || [];
  const D = await WATCH.door(); let company = D.roll(Sh.origin, 4242 + k * 977) || [];
  if (Sh.spear) company = company.map(m => m.background === 'companion_2hand' ? Object.assign({}, m, { gear: Object.assign({}, m.gear, { main: Sh.spear, off: null }) }) : m);
  return company;
}

/* what the fight costs, at a set of rates (Battle Brothers' by default; the retinue's followers as flags) */
function cost(f, o) {
  o = o || {};
  const hpRate = (o.camped ? RATE.hp_per_hour_camp : RATE.hp_per_hour_march) + (o.cook ? RATE.cook_hp_per_hour : 0);
  const armRate = RATE.armour_per_hour * (o.camped ? RATE.camp_repair_mult : 1) * (o.blacksmith ? RATE.blacksmith_repair_mult : 1);
  const live = f.men.filter(m => !m.dead), up = live.filter(m => !m.down);
  /* a man struck down and alive is LAID UP for his days (the fight-gets-deep law: 30 to 40), so his hitpoints are not the wait */
  const lostHp = up.map(m => m.hpMax - m.hp), lostPieces = [];
  live.forEach(m => { if (m.armHMax) lostPieces.push(m.armHMax - m.armH); if (m.armBMax) lostPieces.push(m.armBMax - m.armB); });
  const sumArm = lostPieces.reduce((a, b) => a + b, 0);
  const inj = [].concat.apply([], live.map(m => m.inj)), whole = live.reduce((a, m) => a + m.hpMax + m.armHMax + m.armBMax, 0), now = live.reduce((a, m) => a + m.hp + m.armH + m.armB, 0);
  return {
    hpHours: Math.max(0, ...lostHp) / hpRate,                    /* every man heals at once: the slowest man is the wait */
    armHours: Math.max(0, ...lostPieces) / armRate,              /* every worn piece is mended at once (CAMP's reading) */
    armHoursInTurn: sumArm / armRate,                            /* the other reading: one piece at a time */
    tape: sumArm / RATE.durability_per_tape * (o.blacksmith ? RATE.blacksmith_tape_mult : 1),
    meds: inj.reduce((a, j) => a + Math.max(0, j.days - (o.surgeon ? RATE.surgeon_injury_days : 0)), 0),
    injDays: inj.length ? Math.max(...inj.map(j => j.days)) - (o.surgeon ? RATE.surgeon_injury_days : 0) : 0,
    injuries: inj.length, laidUp: live.length - up.length, bar: whole ? now / whole : 1, hpLost: lostHp.reduce((a, b) => a + b, 0), armLost: sumArm, men: live.length, dead: f.men.length - live.length
  };
}
const q = (a, p) => { const s = a.slice().sort((x, y) => x - y); return s.length ? s[Math.min(s.length - 1, Math.floor(p * s.length))] : 0; };
function summary(fs_, o) {
  const won = fs_.filter(f => f.result === 'won'), C = won.map(f => cost(f, o));
  const pick = k => C.map(c => c[k]);
  const wait = C.map(c => Math.max(c.hpHours, c.armHours));
  return { fights: fs_.length, won: won.length,
    bar_median: +q(pick('bar'), 0.5).toFixed(3), bar_p10: +q(pick('bar'), 0.1).toFixed(3),
    hp_hours_median: +q(pick('hpHours'), 0.5).toFixed(1), hp_hours_p90: +q(pick('hpHours'), 0.9).toFixed(1),
    arm_hours_median: +q(pick('armHours'), 0.5).toFixed(1), arm_hours_p90: +q(pick('armHours'), 0.9).toFixed(1),
    arm_hours_in_turn_median: +q(pick('armHoursInTurn'), 0.5).toFixed(1),
    whole_hours_median: +q(wait, 0.5).toFixed(1), whole_hours_p90: +q(wait, 0.9).toFixed(1),
    tape_median: +q(pick('tape'), 0.5).toFixed(1), tape_p90: +q(pick('tape'), 0.9).toFixed(1), tape_mean: +(pick('tape').reduce((a, b) => a + b, 0) / Math.max(1, C.length)).toFixed(1),
    laid_up_a_fight: +(pick('laidUp').reduce((a, b) => a + b, 0) / Math.max(1, C.length)).toFixed(2),
    injuries_a_fight: +(pick('injuries').reduce((a, b) => a + b, 0) / Math.max(1, C.length)).toFixed(2),
    meds_a_fight: +(pick('meds').reduce((a, b) => a + b, 0) / Math.max(1, C.length)).toFixed(1),
    injury_days_p90: +q(pick('injDays'), 0.9).toFixed(1) };
}

async function main() {
  const argv = process.argv, arg = (k, d) => { const i = argv.indexOf(k); return i > 0 ? argv[i + 1] : d; };
  if (argv[2] === '--fight') { process.stdout.write(JSON.stringify(await oneFight(argv[3], Number(argv[4])))); return; }
  if (argv[2] === '--b2b-one') { process.stdout.write(JSON.stringify(await backToBack(argv[3], Number(argv[4])))); return; }
  if (argv.includes('--b2b')) {
    const N = Number(arg('--n', 100)), JOBS = Number(arg('--jobs', 4)), shapes = String(arg('--shapes', 'his,newcrew,spear,watch,wolf')).split(',');
    const work = []; shapes.forEach(s => { for (let k = 0; k < N; k++) work.push([s, k]); });
    const res = []; let next = 0, running = 0;
    await new Promise(done => { const pump = () => { while (running < JOBS && next < work.length) { const [s, k] = work[next++]; running++;
      cp.execFile(process.execPath, [__filename, '--b2b-one', s, String(k)], { maxBuffer: 1 << 26 }, (err, so) => { running--; if (!err) res.push(JSON.parse(so)); else console.error('failed', s, k, err.message.slice(0, 300));
        if (next >= work.length && running === 0) done(); else pump(); }); } }; pump(); });
    const two = res.filter(r => r.whole), T = {};
    ['all'].concat(shapes).forEach(s => { const rs = two.filter(r => s === 'all' || r.shape === s); T[s] = { pairs: rs.length };
      ['whole', 'carried', 'march12', 'camp12'].forEach(w => { T[s][w] = { won: rs.filter(r => r[w].result === 'won').length, clean: rs.filter(r => r[w].clean).length, down: rs.reduce((a, r) => a + r[w].down, 0), dead: rs.reduce((a, r) => a + r[w].dead, 0) }; });
      console.log(s.padEnd(8) + ' pairs ' + rs.length + '  ' + ['whole', 'carried', 'march12', 'camp12'].map(w => w + ' won ' + T[s][w].won + ' clean ' + T[s][w].clean + ' down ' + T[s][w].down + ' dead ' + T[s][w].dead).join(' | ')); });
    if (argv.includes('--save') && fs.existsSync(BANK)) { const b = JSON.parse(fs.readFileSync(BANK, 'utf8')); b.back_to_back = { _readme: 'fight A won, then the next fight (k+1000) with the men still standing: WHOLE, CARRIED (every wound and dent), MARCH 12 and CAMP 12 hours between', n: N, shapes, totals: T }; fs.writeFileSync(BANK, JSON.stringify(b) + '\n'); console.log('wrote back_to_back into ' + path.relative(ROOT, BANK)); }
    return;
  }
  const N = Number(arg('--n', 100)), JOBS = Number(arg('--jobs', 4)), shapes = String(arg('--shapes', 'his,wolf,newcrew,spear,watch,bench')).split(',');
  const work = []; shapes.forEach(s => { for (let k = 0; k < N; k++) work.push([s, k]); });
  const res = [];
  let next = 0, running = 0;
  await new Promise(done => { const pump = () => { while (running < JOBS && next < work.length) { const [s, k] = work[next++]; running++;
    cp.execFile(process.execPath, [__filename, '--fight', s, String(k)], { maxBuffer: 1 << 26 }, (err, so) => { running--; if (!err) res.push(JSON.parse(so)); else console.error('failed', s, k, err.message.slice(0, 200));
      if (next >= work.length && running === 0) done(); else pump(); }); } }; pump(); });
  const sha = cp.execSync('git log -1 --format=%h --abbrev=8 -- slices/BOHEMIA_FIGHT.html records/target/bb', { cwd: ROOT }).toString().trim();
  const out = { draft: true, _readme: 'TUNING [the camp note] (rule 226(b); research only). draft:true. NOTHING IN THE GAME READS THIS FILE. What a WON fight costs the company afterwards at Battle Brothers\' rates (records/target/bb/condition.json), the live fight on AUTO both sides, by tools/bohemia_tuning_the_camp_clock.js. Hours are game hours; real seconds: camp 0.5 a game hour (an hour a beat), Battle Brothers 4.4 (a day is 1:45).',
    sha, rules_print: B.rulesPrint(), at: new Date().toISOString(), rates: RATE, groups: {} };
  const crew = f => f.company <= 1 ? '1' : f.company <= 3 ? '2-3' : f.company <= 6 ? '6' : '12';
  const groups = { all: res };
  res.forEach(f => { (groups['shape:' + f.shape] = groups['shape:' + f.shape] || []).push(f); (groups['crew:' + crew(f)] = groups['crew:' + crew(f)] || []).push(f); });
  Object.keys(groups).forEach(g => { out.groups[g] = { march: summary(groups[g], {}), camped: summary(groups[g], { camped: true }), camped_full_retinue: summary(groups[g], { camped: true, cook: true, blacksmith: true, surgeon: true }) }; });
  Object.keys(out.groups).sort().forEach(g => { const G = out.groups[g];
    console.log(g.padEnd(14) + ' won ' + G.march.won + '/' + G.march.fights + '  bar ' + G.march.bar_median + ' (p10 ' + G.march.bar_p10 + ')  whole: march ' + G.march.whole_hours_median + 'h (p90 ' + G.march.whole_hours_p90 + '), camped ' + G.camped.whole_hours_median + 'h (p90 ' + G.camped.whole_hours_p90 + '), full retinue ' + G.camped_full_retinue.whole_hours_median + 'h'
      + '  hp ' + G.march.hp_hours_median + 'h arm ' + G.march.arm_hours_median + 'h (in turn ' + G.march.arm_hours_in_turn_median + 'h)  tape ' + G.march.tape_median + ' (mean ' + G.march.tape_mean + ', p90 ' + G.march.tape_p90 + ')  laid up ' + G.march.laid_up_a_fight + '  injuries ' + G.march.injuries_a_fight + ' meds ' + G.march.meds_a_fight); });
  if (argv.includes('--save')) { fs.writeFileSync(BANK, JSON.stringify(out) + '\n'); console.log('wrote ' + path.relative(ROOT, BANK)); }
}
if (require.main === module) main().catch(e => { console.error(e); process.exit(1); });
module.exports = { cost, summary, RATE };
