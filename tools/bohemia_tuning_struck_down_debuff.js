#!/usr/bin/env node
// TUNING [struck down, he still fights] 10/26 -- RESEARCH INSTRUMENT, NOT A GATE (rule 234(b), rule 241, rule 117, rule 38g).
// Paolo 10/26: 'their health will just like be at one and then when you heal them they'll still go back up. They're still active...
// they should just have that debuff' (records/BOHEMIA_PAOLO_STRUCK_DOWN_HE_STILL_FIGHTS_AND_HIS_FACE_SHOWS_IT_10_26_26.md).
// What the struck-down debuff COSTS, on the LIVE fight (slices/BOHEMIA_FIGHT.html, AUTO both sides, the stupid-move watch's crews):
//   --marks  ONE man of a small crew carries each of the wiki's eleven permanent marks (records/target/bb/injuries.json) four ways:
//            the mark only (his life after the days), the mark and the whole fresh wound (the day he wakes), the mark and half the
//            fresh wound (the clinic, rule 241, or half his days gone), and nothing (the control); the same fights, paired by seed.
//            The fresh wound per mark is CAMP's default (records/target/bb/condition.json struck_down_fresh, on CAMP's branch
//            camp-struck-down until it lands; the same eleven are copied below and checked against the file when it is there).
//   --b2b    THE FIRST DAY (his 'I'm gonna have to restart a run and I didn't even make it past the first day'): fight A on the road,
//            then the next fight with the men A struck down and left alive, six ways: the old bench (they stay home), the mark
//            only, whole hitpoints with the whole fresh wound (camped back up), ONE hitpoint with the whole fresh wound (sent at
//            once), the clinic's half, and never struck down (the control). Everybody else whole, so only the struck-down men move.
//   --heal   hours from ONE hitpoint to whole for every man the fifteen origins roll (engine/bohemia_origin_start.js) at CAMP's
//            rates (condition.json: 1 an hour on the march, 2 camped, +1 the cook), and the seconds on the camp's clock.
// The fight does not read hitpoints_pct from an injury today (Weakened Heart's -30% and the fresh wounds' hitpoint cuts); the
// bench applies it to his whole and says so, the way Battle Brothers does. Vision, fatigue recovery and action points from an
// injury are not read by the fight either (they cost nothing here; named in the record as COMBAT's gap).
//   node tools/bohemia_tuning_struck_down_debuff.js --marks [--n 60] | --b2b [--n 120] | --heal  [--shard i/m] [--out file]
// Every number it prints is DRAFT. The bank (draft:true, nothing in the game reads it): banks/BOHEMIA_TUNING_STRUCK_DOWN_DEBUFF_10_26_26.json
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const B = require('./bohemia_tuning_auto_brain.js'), WATCH = require('./bohemia_tuning_stupid_move_watch.js');
const RD = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const INJ = RD('records/target/bb/injuries.json').rows, COND = RD('records/target/bb/condition.json');
const MARKS = INJ.filter(r => r.kind === 'permanent');
const byId = id => INJ.filter(r => r.id === id)[0] || null;
/* CAMP's default (condition.json struck_down_fresh on camp-struck-down 63b74fe5): the temporary injury of the same part each mark is
   the never-healed form of; Traumatized has no flesh wound. Read from the file when it carries it, else this copy. */
const FRESH_COPY = { brain_damage: 'severe_concussion', broken_elbow_joint: 'fractured_elbow', broken_knee: 'injured_knee_cap',
  partly_collapsed_lung: 'pierced_lung', maimed_foot: 'cut_achilles_tendon', missing_ear: 'ripped_ear', missing_eye: 'grazed_eye_socket',
  missing_finger: 'crushed_finger', missing_nose: 'split_nose', traumatized: null, weakened_heart: 'pierced_chest' };
const FRESH = (() => {
  if (!COND.struck_down_fresh) return FRESH_COPY;
  const o = {}, m = COND.struck_down_fresh.value; Object.keys(m).forEach(k => { o[k] = m[k].wound || null; });
  Object.keys(FRESH_COPY).forEach(k => { if (o[k] !== FRESH_COPY[k]) throw new Error('condition.json struck_down_fresh moved for ' + k + ': ' + o[k]); });
  return o;
})();
const RATE = { march: COND.hp_per_hour_march.value, camp: COND.hp_per_hour_camp.value, cook: COND.cook_hp_per_hour.value, left: COND.struck_down_hp_left.value };
const CAMP_SECONDS_AN_HOUR = 0.5, BB_SECONDS_AN_HOUR = 105 / 24;

/* a row's numbers times a share, each a whole number of its own unit, away from nothing at a half (CAMP's scaled() reads the same);
   flags stay flags */
function scaled(effects, share) {
  const o = {};
  Object.keys(effects).forEach(k => { const v = effects[k]; if (typeof v !== 'number') { o[k] = v; return; }
    const s = v * share; o[k] = s < 0 ? -Math.round(-s) : Math.round(s); });
  return o;
}
/* what one state puts on a man: the mark (for life), the fresh wound at a share (1 the day he wakes, 0.5 the clinic or half his days) */
function loadOf(markId, freshShare) {
  const out = [], mk = byId(markId); if (mk) out.push(mk);
  const fw = FRESH[markId] && byId(FRESH[markId]);
  if (fw && freshShare > 0) out.push({ id: fw.id + '_fresh', name: fw.name, kind: 'temporary', effects: scaled(fw.effects, freshShare) });
  return out;
}
/* put it on him; the hitpoint cut the fight does not read is applied to his whole here, Battle Brothers' way */
function wear(u, rows, hpLeft) {
  rows.forEach(r => { u.injuries.push(r);
    if (typeof r.effects.hitpoints_pct === 'number') { u.hpMax = Math.max(1, Math.round(u.hpMax * (1 + r.effects.hitpoints_pct / 100))); u.hp = Math.min(u.hp, u.hpMax); } });
  if (hpLeft !== undefined) u.hp = Math.max(1, Math.min(u.hpMax, hpLeft));
}
function play(ctx) { const F = ctx.FIGHT, S = F.S; let g = 0; while (!S.over && S.round <= 60 && g++ < 200000) { const v = F.current(); if (!v) break; F.aiStep(v); } return S; }
function blowsOf(S, id) {
  let landed = 0, dmg = 0, swung = 0;
  S.log.forEach(e => { if (e.t === 'attack' && e.id === id && !e.free) { swung++; if (e.hit) { landed++; dmg += (e.hp || 0) + (e.armour || 0); } } });
  return { swung, landed, dmg };
}

/* ---------- --marks ---------- */
const STATES = ['none'].concat(...MARKS.map(m => ['mark:' + m.id, 'fresh:' + m.id, 'half:' + m.id]));
async function marksOne(shape, subj, k) {
  const out = {};
  for (const st of STATES) {
    const ctx = await B.engineFor('today');
    await WATCH.setupShape(ctx, shape, k, ctx.DB.boardKinds.districts);
    const S = ctx.FIGHT.S, u = S.units.filter(v => v.side === 'you' && v.id === subj)[0];
    if (!u) return null;
    if (st !== 'none') { const [kind, id] = st.split(':'); wear(u, loadOf(id, kind === 'fresh' ? 1 : kind === 'half' ? 0.5 : 0)); }
    play(ctx);
    const mine = S.units.filter(v => v.side === 'you'), b = blowsOf(S, subj);
    out[st] = { won: S.result === 'won' ? 1 : 0, fell: u.down || u.dead ? 1 : 0, dead: u.dead ? 1 : 0, dmg: b.dmg, landed: b.landed, swung: b.swung,
      ourDown: mine.filter(v => v.down || v.dead).length, kind: u.kind, gun: !!ctx.FIGHT.isRanged(u.weapon) };
  }
  return out;
}

/* ---------- --b2b ---------- */
async function companyOf(shape, k) {
  const Sh = WATCH.SHAPES[shape];
  if (!Sh.origin) return WATCH.HIS.slice();
  const D = await WATCH.door(); let company = D.roll(Sh.origin, 4242 + k * 977) || [];
  if (Sh.spear) company = company.map(m => m.background === 'companion_2hand' ? Object.assign({}, m, { gear: Object.assign({}, m.gear, { main: Sh.spear, off: null }) }) : m);
  return company;
}
async function setupWith(ctx, shape, k, company) {
  const F = ctx.FIGHT, Sh = WATCH.SHAPES[shape], W = B.fightOf(k, ctx.DB.boardKinds.districts);
  ctx.setSeed(W.seed);
  F.setup({ auto: true, formation: null, company, cap: company.length, party: { faction: Sh.faction(k), count: Sh.count(k), days: Sh.days(k) }, days: Sh.days(k), district: W.district, cell: W.cell, act: 1 });
  F.S.deploy = false;
}
const WAYS = ['none', 'bench', 'mark', 'fresh', 'onehp', 'half'];
async function b2bOne(shape, k) {
  const ctxA = await B.engineFor('today');
  await WATCH.setupShape(ctxA, shape, k, ctxA.DB.boardKinds.districts);
  const SA = play(ctxA), oursA = SA.units.filter(u => u.side === 'you');
  /* a lost fight counts (his bad first fight): the men down and alive go on; only a company with nobody alive stops here */
  if (oursA.every(u => u.dead)) return { shape, k, a: SA.result, wiped: true };
  const struck = oursA.filter(u => u.down && !u.dead && !u.main && u.longInjury);
  if (!struck.length) return { shape, k, a: SA.result, struck: 0 };
  const src = await companyOf(shape, k), keep = [];
  oursA.forEach(u => { const i = Number(String(u.id).slice(1)); if (u.dead || !src[i]) return; keep.push({ m: src[i], struck: u.down && !u.main && u.longInjury ? u.longInjury.id : null }); });
  const out = { shape, k, a: SA.result, struck: struck.length, men: keep.length, marks: struck.map(u => u.longInjury.id) };
  for (const w of WAYS) {
    const ctx = await B.engineFor('today');
    const list = keep.filter(x => !(w === 'bench' && x.struck));
    if (!list.length) { out[w] = { result: 'nobody', down: 0, dead: 0, clean: false, struckDown: 0, struckDead: 0, men: 0 }; continue; }
    await setupWith(ctx, shape, k + 1000, list.map(x => Object.assign({}, x.m)));
    const S = ctx.FIGHT.S, units = S.units.filter(u => u.side === 'you');
    list.forEach((x, i) => { if (!x.struck || w === 'none' || w === 'bench') return; const u = units.filter(v => v.id === 'c' + i)[0]; if (!u) return;
      wear(u, loadOf(x.struck, w === 'mark' ? 0 : w === 'half' ? 0.5 : 1), w === 'onehp' ? RATE.left : undefined); });
    play(ctx);
    const mine = S.units.filter(u => u.side === 'you'), sm = list.map((x, i) => x.struck ? mine.filter(v => v.id === 'c' + i)[0] : null).filter(Boolean);
    out[w] = { result: S.result, down: mine.filter(u => u.down || u.dead).length, dead: mine.filter(u => u.dead).length, men: mine.length,
      clean: S.result === 'won' && !mine.some(u => u.down || u.dead), struckDown: sm.filter(u => u.down || u.dead).length, struckDead: sm.filter(u => u.dead).length };
  }
  return out;
}

/* ---------- --heal ---------- */
async function heal() {
  const D = await WATCH.door(), ids = RD('records/target/bb/origins.json').origins.map(o => o.id);
  const hp = [];
  for (const id of ids) for (let k = 0; k < 40; k++) {
    const company = D.roll(id, 4242 + k * 977); if (!company || !company.length) continue;
    const ctx = await B.engineFor('today');
    ctx.setSeed(1000 + k);
    ctx.FIGHT.setup({ auto: true, formation: null, company, cap: company.length, party: { faction: 'brigands', count: 3, days: 1 }, days: 1, district: null, act: 1 });
    ctx.FIGHT.S.units.filter(u => u.side === 'you').forEach(u => hp.push({ origin: id, hpMax: u.hpMax, main: !!u.main }));
  }
  return { origins_tried: ids, men: hp.length, hp };
}

/* ---------- the shard runner ---------- */
async function main() {
  const a = process.argv.slice(2), arg = (k, d) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : d; };
  const n = +arg('--n', 60), sh = (arg('--shard', '0/1')).split('/').map(Number), outF = arg('--out', null);
  const mine = k => k % sh[1] === sh[0];
  let res;
  if (a.includes('--marks')) {
    res = { mode: 'marks', rows: [] };
    for (const [shape, subj] of [['newcrew', 'c1'], ['newcrew', 'c2']]) for (let k = 0; k < n; k++) if (mine(k)) {
      const r = await marksOne(shape, subj, k); if (r) res.rows.push({ shape, subj, k, r });
    }
  } else if (a.includes('--b2b')) {
    res = { mode: 'b2b', rows: [] };
    for (const shape of ['his', 'newcrew', 'spear', 'watch']) for (let k = 0; k < n; k++) if (mine(k)) res.rows.push(await b2bOne(shape, k));
  } else if (a.includes('--heal')) res = Object.assign({ mode: 'heal' }, await heal());
  else { console.log('usage: --marks | --b2b | --heal'); return; }
  const s = JSON.stringify(res);
  if (outF) fs.writeFileSync(outF, s); else console.log(s.slice(0, 2000));
}
if (require.main === module) main().catch(e => { console.error(e); process.exit(1); });
module.exports = { FRESH, MARKS, loadOf, scaled, RATE, CAMP_SECONDS_AN_HOUR, BB_SECONDS_AN_HOUR, STATES, WAYS };
