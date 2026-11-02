#!/usr/bin/env node
// ECONOMY 2 [a job pays for the time and the risk], 11/2/26, rule 323, ask line 320. THE BAKE, THE TABLE AND THE PURSE.
//   node tools/bohemia_economy_job_pay.js            bake: every board job's pay into records/target/bb/job_pay.json 'pays', the
//                                                    job kinds' board people (records/target/BOHEMIA_JOB_KINDS.json), and the
//                                                    shelf (runs tools/bohemia_run2_board_shelf.py, which reads 'pays')
//   node tools/bohemia_economy_job_pay.js --table    the before and after, every job and every kind: batteries a map hour, a fight
//   node tools/bohemia_economy_job_pay.js --purse    the purse over days 1 to 50, before and after, the same jobs in the same order
//   node tools/bohemia_economy_job_pay.js --check    exit 1 if the files are not what a bake would write (the gate calls it)
// The formula is engine/bohemia_job_pay.js; every number is records/target/bb/job_pay.json's. Nothing here types a pay.
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const F_PAY = path.join(ROOT, 'records/target/bb/job_pay.json'), F_KINDS = path.join(ROOT, 'records/target/BOHEMIA_JOB_KINDS.json');
const F_SHELF = path.join(ROOT, 'records/target/BOHEMIA_BOARD_SHELF.json');
const P = require('../engine/bohemia_job_pay.js');
const J = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const a = process.argv.slice(2);

function jobs() {
  const PAY = J(F_PAY), K = J(F_KINDS), S = J(F_SHELF), was = PAY.pays || {};
  /* before: what the job paid on the board before this round (the shelf's 30 a skull; a board person's own hand-set pay) */
  const rows = S.offers.map(o => ({ id: o.id, title: o.title, skulls: o.skulls, before: was[o.id] ? was[o.id].before : o.skulls * 30, src: 'shelf' }))
    .concat(((K.board_people || {}).rows || []).map(o => ({ id: o.id, title: o.title, skulls: o.skulls, before: was[o.id] ? was[o.id].before : o.pay, src: 'board_people' })));
  P.set(PAY);
  return { PAY, K, rows: rows.map(r => Object.assign(P.base(r, K), { title: r.title, src: r.src })) };
}

function bake(write) {
  const { PAY, K, rows } = jobs(), pays = {};
  rows.slice().sort((x, y) => x.id < y.id ? -1 : 1).forEach(r => {
    pays[r.id] = { pay: r.pay, before: r.before, violent: r.violent, kind: r.kind, skulls: r.skulls, hours: r.hours, fights: r.fights, heads: r.heads || undefined, why: r.why };
  });
  const payTxt = JSON.stringify(Object.assign({}, PAY, { pays }), null, 2) + '\n';
  /* the board people's pay, in place: the row's own "pay" after its id, nothing else in the file touched */
  let kt = fs.readFileSync(F_KINDS, 'utf8');
  const bp = kt.indexOf('"board_people"');
  rows.filter(r => r.src === 'board_people').forEach(r => {
    const i = kt.indexOf('"id": "' + r.id + '"', bp); if (i < 0) throw new Error('no board person ' + r.id);
    const m = /"pay": \d+/.exec(kt.slice(i)); if (!m) throw new Error('no pay after ' + r.id);
    const at = i + m.index; kt = kt.slice(0, at) + '"pay": ' + r.pay + kt.slice(at + m[0].length);
  });
  const same = fs.readFileSync(F_PAY, 'utf8') === payTxt && fs.readFileSync(F_KINDS, 'utf8') === kt;
  if (!write) return same;
  fs.writeFileSync(F_PAY, payTxt); fs.writeFileSync(F_KINDS, kt);
  const b = cp.spawnSync('python3', [path.join(ROOT, 'tools/bohemia_run2_board_shelf.py')], { cwd: ROOT, encoding: 'utf8' });
  if (b.status !== 0) throw new Error('the shelf baker failed: ' + (b.stderr || b.stdout));
  console.log('baked', rows.length, 'jobs;', (b.stdout || '').trim());
  return true;
}

function table() {
  const { PAY, rows } = jobs(), cost = PAY.crew_cost_per_map_hour.value, bar = cost * (1 + PAY.margin.value);
  const f1 = x => (Math.round(x * 10) / 10).toFixed(1), pad = (s, n) => String(s).padEnd(n), lp = (s, n) => String(s).padStart(n);
  console.log('crew cost a map hour ' + cost + ' (33 a night, 12 hired), the bar with the margin ' + bar.toFixed(2) + '; the start\'s three cost 0.25');
  console.log(pad('job', 15) + pad('kind', 15) + lp('sk', 3) + lp('hrs', 6) + lp('fts', 6) + lp('was', 5) + lp('now', 5) + lp('was/h', 7) + lp('now/h', 7) + lp('was/ft', 7) + lp('now/ft', 7));
  rows.forEach(r => console.log(pad(r.id, 15) + pad(r.kind, 15) + lp(r.skulls, 3) + lp(f1(r.hours), 6) + lp(r.fights.toFixed(2), 6) + lp(r.before, 5) + lp(r.pay, 5) +
    lp(f1(r.before / Math.max(0.5, r.hours)), 7) + lp(f1(r.pay / Math.max(0.5, r.hours)), 7) + lp(r.fights ? f1(r.before / r.fights) : '-', 7) + lp(r.fights ? f1(r.pay / r.fights) : '-', 7)));
  const by = {};
  rows.forEach(r => { const k = by[r.kind] = by[r.kind] || { n: 0, h: 0, f: 0, b: 0, p: 0 }; k.n++; k.h += r.hours; k.f += r.fights; k.b += r.before; k.p += r.pay; });
  console.log('\n' + pad('kind', 15) + lp('jobs', 5) + lp('hrs', 7) + lp('fts', 6) + lp('was', 6) + lp('now', 6) + lp('was/h', 7) + lp('now/h', 7) + lp('was/ft', 7) + lp('now/ft', 7) + lp('crew/h', 7));
  Object.keys(by).sort().forEach(k => { const x = by[k], h = x.h / x.n, f = x.f / x.n;
    console.log(pad(k, 15) + lp(x.n, 5) + lp(f1(h), 7) + lp(f.toFixed(2), 6) + lp(Math.round(x.b / x.n), 6) + lp(Math.round(x.p / x.n), 6) + lp(f1(x.b / x.h), 7) + lp(f1(x.p / x.h), 7) +
      lp(f ? f1(x.b / x.f) : '-', 7) + lp(f ? f1(x.p / x.f) : '-', 7) + lp(cost.toFixed(2), 7)); });
  const qbar = cost * (1 + ((PAY.violence || {}).value || {}).quiet_margin), low = rows.filter(r => r.pay / Math.max(0.5, r.hours) < (r.violent ? bar : qbar) - 1e-9);
  console.log('\njobs under the bar (killing work ' + bar.toFixed(2) + ', a walk ' + qbar.toFixed(2) + ' a map hour): ' + (low.length ? low.map(r => r.id).join(', ') : 'none'));
  return rows;
}

/* THE PURSE (a probe, the same for before and after): the company takes the board's jobs in one seeded order, back to back,
   each its modelled hours plus the walk to the next board; a night's bill at 2 a man and a hired man's wage of 1; three men,
   three more hired at 20 each at the start of weeks two, three and four (twelve by day 22); clout +100 a job and +5 an enemy
   (records/target/bb/renown.json) multiplies the pay x1 to x4.5 at 4,000. Every job won; neutral standing. */
function purse(quiet) {
  const { PAY, rows } = jobs(), R = J(path.join(ROOT, 'records/target/bb/renown.json'));
  const gain = R.gains.value, pm = R.pay_mult.value, BILL = J(path.join(ROOT, 'records/target/bb/nightly_bill.json')).per_man_per_night.value;
  const start = 290, between = 4, hirePrice = 20, wage = 1, enemiesPerFight = 3;
  let x = 7; const rnd = () => (x = (x * 1103515245 + 12345) % 2147483648) / 2147483648;
  const order = []; for (let k = 0; k < 6; k++) { const s = rows.slice(); for (let i = s.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [s[i], s[j]] = [s[j], s[i]]; } order.push(...s); }
  function run(key) {
    let bats = start, clout = 0, t = 0, i = 0, men = 3, hired = 0; const day = {}, inc = {};
    for (let d = 1; d <= 50; d++) {
      if (d === 8 || d === 15 || d === 22) { bats -= 3 * hirePrice; men += 3; hired += 3; }
      while (t < d * 24) {
        const r = order[i++ % order.length], m = Math.min(4.5, pm.from + (pm.to - pm.from) * Math.min(1, clout / pm.at));
        t += r.hours + between; const got = Math.round(r[key] * m);
        bats += got; inc[d] = (inc[d] || 0) + got;
        clout += gain.civilian_contract_done + gain.fight_won_per_enemy * enemiesPerFight * r.fights;
      }
      bats -= BILL * men + wage * hired; day[d] = { bats: Math.round(bats), clout: Math.round(clout), men, jobs: i };
    }
    return { day, inc };
  }
  const B = run('before'), A = run('pay'), out = [];
  [1, 5, 10, 15, 20, 25, 30, 40, 50].forEach(d => out.push({ day: d, before: B.day[d].bats, after: A.day[d].bats, jobs: A.day[d].jobs, men: A.day[d].men, clout: A.day[d].clout,
    ratio: Math.round(A.day[d].bats / Math.max(1, B.day[d].bats) * 100) / 100 }));
  const perHour = k => rows.reduce((s, r) => s + r[k], 0) / rows.reduce((s, r) => s + r.hours + between, 0);
  if (!quiet) {
    console.log('the purse, days 1 to 50 (start 290, the same jobs in the same order, every job won, neutral standing)');
    console.log('day  before   after  ratio  jobs men clout');
    out.forEach(o => console.log(String(o.day).padStart(3) + String(o.before).padStart(8) + String(o.after).padStart(8) + String(o.ratio).padStart(7) + String(o.jobs).padStart(6) + String(o.men).padStart(4) + String(o.clout).padStart(6)));
    console.log('a map hour of the job loop pays, before clout: was ' + perHour('before').toFixed(2) + ', now ' + perHour('pay').toFixed(2) + ' (x' + (perHour('pay') / perHour('before')).toFixed(2) + ')');
  }
  return { rows: out, perHourBefore: perHour('before'), perHourAfter: perHour('pay') };
}

if (require.main === module) {
  if (a.includes('--check')) { const ok = bake(false); console.log(ok ? 'the pays are what a bake writes' : 'DRIFTED: run node tools/bohemia_economy_job_pay.js'); process.exit(ok ? 0 : 1); }
  else if (a.includes('--table')) table();
  else if (a.includes('--purse')) purse();
  else bake(true);
}
module.exports = { jobs, bake, table, purse };
