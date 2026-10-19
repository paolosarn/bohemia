#!/usr/bin/env node
/* GUNS FROM THE FIRST FIGHT (COMBAT [guns from the first fight], rule 120(a), Paolo 10/18: 'I wanna start off with the guns
   too... the guns were supposed to be the main way this is gonna be solved'; 'the combat is still so fucking ass').

   Two things, both from the REAL fight (slices/BOHEMIA_FIGHT.html):

   1. THE BENCH, headless on the fight's own rules (tools/bohemia_fight_headless.js): every origin's company as the door
      builds it, against its first week's band (day 1, brigands, the door's default SEEN IT), at 2, 3 and 4 men (a one, two
      and three skull job for a fresh crew), SEEDS fights a cell, AUTO both sides; the old kit (two pipes and a sledge in
      front, the pistol a one-tile knife) beside the new one. A win, who fired, and what killed them. Written to
      records/target/BOHEMIA_COMBAT_GUNS_FIRST_MEASURED.json for TUNING (every number DRAFT: the gear is not in).
   2. slices/vote/COMBAT_GUNS_FROM_THE_FIRST_FIGHT_10_19.jpg, the VOTE sheet, from the game's own camera on his phone's
      profile (390 x 844 at 3x): the old kit at the open beside the new; his pistol man's turn with the gun's reach taped on
      the ground and a thug marked; the pistol kicking in his hand; the rifle kicking into the shoulder; the pistol's card.

   Run: node tools/bohemia_combat_guns_from_the_first_fight_10_19_26.js            (bench + sheet)
        node tools/bohemia_combat_guns_from_the_first_fight_10_19_26.js --bench    (the file only) */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const { engine } = require('./bohemia_fight_headless.js');
const OUT_JSON = path.join(ROOT, 'records/target/BOHEMIA_COMBAT_GUNS_FIRST_MEASURED.json');
const OUT_JPG = path.join(ROOT, 'slices/vote/COMBAT_GUNS_FROM_THE_FIRST_FIGHT_10_19.jpg');
const SCRATCH = process.env.BOHEMIA_SCRATCH || path.join(require('os').tmpdir(), 'bohemia_guns_first');
const SEEDS = Number(process.env.SEEDS || 60), COUNTS = [2, 3, 4];
const BENCH_ONLY = process.argv.includes('--bench');
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const ORIGINS = J('records/target/bb/origins.json').origins;
/* the kit before this row, as gear the roster could have handed (the crew rows' old jobs through ours.weapon_rows) */
const OLD_GEAR = [{ main: 'bludgeon', off: 'wooden_shield' }, { main: 'bludgeon', off: 'wooden_shield' }, { main: 'two_handed_mallet', off: null },
  { main: 'bludgeon', off: 'wooden_shield' }, { main: 'dagger', off: null }, { main: 'two_handed_mallet', off: null }, { main: 'light_crossbow', off: null },
  { main: 'bludgeon', off: 'wooden_shield' }, { main: 'light_crossbow', off: null }, { main: 'bludgeon', off: 'wooden_shield' },
  { main: 'bundle_of_throwing_axes', off: null }, { main: 'handgonne', off: null }];

function companyOf(o, old, crew) {
  return o.men.map((m, i) => {
    const c = { background: m.background, level: m.level };
    if (old) { const t = crew[i % crew.length]; c.gear = Object.assign({ body: t.body, head: t.head }, OLD_GEAR[i % OLD_GEAR.length]); }
    return c;
  });
}
/* THE FIGHT BEFORE THIS ROW, whole: its rules script and its ours.json at BASE (main when the row was claimed), so 'old' is the
   fight he played, not the new one dressed in old gear (a dagger in any hand shoots now) */
const BASE = 'a1013fe2';
function oldEngine() {
  const html = execFileSync('git', ['show', BASE + ':slices/BOHEMIA_FIGHT.html'], { cwd: ROOT, maxBuffer: 1 << 26 }).toString();
  const rules = html.match(/<script id="fight-rules">([\s\S]*?)<\/script>/)[1];
  const ctx = engine({ patch: () => rules });
  ctx.DB.ours = JSON.parse(execFileSync('git', ['show', BASE + ':records/target/bb/ours.json'], { cwd: ROOT, maxBuffer: 1 << 26 }).toString());
  return ctx;
}
function bench() {
  const NEW = engine(), OLD = oldEngine(), rows = [];
  ORIGINS.forEach(o => {
    COUNTS.forEach(n => {
      ['old', 'guns'].forEach(kit => {
        const ctx = kit === 'old' ? OLD : NEW, F = ctx.FIGHT;
        const r = { origin: o.id, name: o.name, men: o.men.length, thugs: n, kit: kit, won: 0, fights: SEEDS, shots: 0, swings: 0, kills: 0, gunKills: 0, rounds: 0 };
        for (let s = 1; s <= SEEDS; s++) {
          ctx.setSeed(s * 7919);
          F.setup({ auto: true, formation: null, company: companyOf(o, false), cap: o.field_cap, kind: 'suburb',
            party: { count: n, days: 1, difficulty: 1, faction: 'brigands' } });
          let g = 0; while (!F.S.over && g < 200000) { const u = F.current(); if (!u) break; F.aiStep(u); g++; }
          if (F.S.result === 'won') r.won++;
          r.rounds += F.S.round;
          const last = {};
          F.S.log.forEach(e => {
            const a = F.S.units.filter(u => u.id === e.id)[0];
            if (e.t === 'attack' && a.side === 'you') { last[e.to] = e.shot; if (e.shot) r.shots++; else r.swings++; }
            if (e.t === 'dead' && a && a.side === 'them') { r.kills++; if (last[e.id]) r.gunKills++; }
          });
        }
        r.winPct = Math.round(100 * r.won / SEEDS); r.gunKillPct = Math.round(100 * r.gunKills / Math.max(1, r.kills));
        r.shotsPerFight = +(r.shots / SEEDS).toFixed(1); r.rounds = +(r.rounds / SEEDS).toFixed(1);
        rows.push(r);
      });
    });
  });
  return rows;
}

const until = async (p, fn, ms, arg) => { const t = Date.now(); while (Date.now() - t < ms) { if (await p.evaluate(fn, arg)) return true; await p.waitForTimeout(60); } return false; };
async function startOn(p, opts) {
  await p.evaluate(o => { window.FIGHT_OPTS = o; document.getElementById('over').style.display = 'none'; return start(); }, opts);
  await until(p, () => !!FIGHT_UI.board && performance.now() > FIGHT_UI.openUntil, 30000);
  await p.waitForTimeout(300);
}
/* his turn, with the man he wants: theirs run on under a tap, his others end their turns */
async function turnOf(p, test) {
  for (let i = 0; i < 160; i++) {
    const st = await p.evaluate(src => {
      const u = FIGHT.current(); if (FIGHT.S.over) return 'over';
      if (!u || FIGHT_UI.anim.length || FIGHT_UI.glide) return 'busy';
      if (u.side !== 'you') return 'theirs';
      return (new Function('u', 'return ' + src))(u) ? 'mine' : 'other';
    }, test);
    if (st === 'mine') return true;
    if (st === 'over') return false;
    if (st === 'theirs') await p.touchscreen.tap(200, 420);
    if (st === 'other') await p.evaluate(() => { const u = FIGHT.current(); FIGHT_UI.pend = null; FIGHT.endTurn(u); take(); });
    await p.waitForTimeout(140);
  }
  return false;
}
const shot = async (p, f) => { await p.screenshot({ path: f, type: 'png' }); return f; };
async function aimAndFire(p, file1, file2) {
  const t = await p.evaluate(() => {
    const u = FIGHT.current(), them = FIGHT.alive('them').filter(v => FIGHT.canStrike(u, v) && FIGHT._t.armIn(u, v) === u.weapon && FIGHT.sideSees('you', v));
    const v = them.sort((a, b) => FIGHT.hitChance(u, b).chance - FIGHT.hitChance(u, a).chance)[0]; if (!v) return null;
    FIGHT_UI.glide = null; FIGHT_UI.cx = ((u.x + v.x) / 2 + .5) * FIGHT_UI.tw; FIGHT_UI.cy = ((u.y + v.y) / 2 + .5) * FIGHT_UI.th;
    return { id: v.id, name: v.name, chance: FIGHT.hitChance(u, v).chance, who: u.name, d: Math.max(Math.abs(u.x - v.x), Math.abs(u.y - v.y)) };
  });
  if (!t) return null;
  await p.waitForTimeout(250);
  const at = () => p.evaluate(id => { const v = FIGHT.byId(id); return { x: sx((v.x + .5) * FIGHT_UI.tw), y: sy((v.y + .5) * FIGHT_UI.th) }; }, t.id);
  let s = await at(); await p.touchscreen.tap(s.x, s.y); await p.waitForTimeout(350);
  t.aim = await shot(p, file1);
  t.say = await p.evaluate(() => document.getElementById('say').textContent);
  s = await at(); await p.touchscreen.tap(s.x, s.y);
  /* the kick: the rig's fire clip a third of the way through the beat */
  await until(p, () => FIGHT_UI.anim.length && FIGHT_UI.anim[0].k === 'attack' && FIGHT_UI.anim[0].at, 4000);
  await p.waitForTimeout(Number(process.env.KICK_MS || 140));
  t.fire = await shot(p, file2);
  t.frame = await p.evaluate(() => { const a = FIGHT_UI.anim[0]; return a ? a.e : null; });
  await until(p, () => !FIGHT_UI.anim.length, 8000);
  t.feed = await p.evaluate(() => (FIGHT_UI.feedLines || []).map(l => l.text).slice(-1)[0] || '');
  return t;
}

(async () => {
  const rows = bench();
  const out = {
    _readme: 'COMBAT [guns from the first fight] 10/19 (rule 120(a)): every origin\'s company as the door builds it against its first week\'s band (day 1, brigands, SEEN IT), headless on the fight\'s own rules, AUTO both sides, ' + SEEDS + ' fights a cell. kit old = THE FIGHT BEFORE THIS ROW, whole (its rules and its ours.json at ' + BASE + ': two pipes with car doors and a sledge in front, the pistol a one-tile dagger that never fired, raiders from day 1, Battle Brothers\' Veteran aim); kit guns = the kit as the fight deals it now (ours.crew guns first, ours.guns_first_kit, ours.pistol_shot, ours.gun_club). gunKillPct = of their dead, the share whose last hit from one of yours was a shot. Written by tools/bohemia_combat_guns_from_the_first_fight_10_19_26.js -- do not hand edit. DRAFT: the gear is not coordinated (rule 117(e)); this is not one average of the game\'s difficulty, it is the first week only.',
    version: 'BOHEMIA_COMBAT_GUNS_FIRST_MEASURED_v1', built: '2026-10-19', seeds: SEEDS, rows: rows };
  fs.writeFileSync(OUT_JSON, JSON.stringify(out, null, 1) + '\n');
  console.log('  wrote ' + path.relative(ROOT, OUT_JSON));
  rows.forEach(r => console.log('   ' + r.origin.padEnd(8) + ' ' + String(r.men).padStart(2) + ' men vs ' + r.thugs + '  ' + r.kit.padEnd(4) + '  won ' + String(r.winPct).padStart(3) + '%  guns killed ' + String(r.gunKillPct).padStart(3) + '%  shots/fight ' + r.shotsPerFight));
  if (BENCH_ONLY) return;

  const { open } = require('./bohemia_drive_the_demo.js');
  fs.mkdirSync(SCRATCH, { recursive: true });
  const nc = ORIGINS.filter(o => o.id === 'newcrew')[0], crew = J('records/target/bb/ours.json').crew.value;
  const base = { seed: Number(process.env.SHEET_SEED || 4), speed: 1, kind: 'suburb', deploy: false, formation: null, cap: nc.field_cap,
    party: { count: 3, days: 1, difficulty: 1, faction: 'brigands' } };
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS=' + JSON.stringify(Object.assign({}, base, { company: companyOf(nc, false, crew) })) });
  const p = d.page; const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  const frames = {};
  try {
    if (!await until(p, () => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board, 30000)) throw new Error('the fight did not load');
    await startOn(p, Object.assign({}, base, { company: companyOf(nc, true, crew) }));
    frames.before = { file: await shot(p, path.join(SCRATCH, 'before.png')), kit: await p.evaluate(() => FIGHT.S.units.filter(u => u.side === 'you').map(u => u.name + ' ' + (u.weapon.of ? 'pistol' : u.job))) };
    await startOn(p, Object.assign({}, base, { company: companyOf(nc, false, crew) }));
    frames.after = { file: await shot(p, path.join(SCRATCH, 'after.png')), kit: await p.evaluate(() => FIGHT.S.units.filter(u => u.side === 'you').map(u => u.name + ' ' + (u.weapon.of ? 'pistol' : u.job))) };
    /* his pistol man's turn with a thug inside two to four tiles */
    if (await turnOf(p, '!!u.weapon.of && FIGHT.alive("them").some(function (v) { return FIGHT.canStrike(u, v) && FIGHT._t.armIn(u, v) === u.weapon; })')) {
      frames.pistol = await aimAndFire(p, path.join(SCRATCH, 'pistol_aim.png'), path.join(SCRATCH, 'pistol_fire.png'));
      /* the pistol's card: a finger held on the strike square on his next pistol turn */
      if (await turnOf(p, '!!u.weapon.of')) {
        const b = await p.evaluate(() => { const r = document.getElementById('bstrike').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
        const cdp = await p.context().newCDPSession(p);
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: b.x, y: b.y }] }); await p.waitForTimeout(700);
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await p.waitForTimeout(300);
        frames.card = { file: await shot(p, path.join(SCRATCH, 'pistol_card.png')), text: await p.evaluate(() => document.getElementById('drawer').innerText) };
        await p.touchscreen.tap(200, 300); await p.waitForTimeout(250);
      }
    }
    /* the rifle's turn with a man in its range */
    if (await turnOf(p, 'u.weapon.class === "crossbow" && FIGHT.alive("them").some(function (v) { return FIGHT.canStrike(u, v) && FIGHT._t.armIn(u, v) === u.weapon; })'))
      frames.rifle = await aimAndFire(p, path.join(SCRATCH, 'rifle_aim.png'), path.join(SCRATCH, 'rifle_fire.png'));
  } finally {
    if (errs.length) console.log('  PAGE ERRORS: ' + errs.slice(0, 3).join(' | '));
    await d.close();
  }
  const pick = (k, n) => rows.filter(r => r.origin === 'newcrew' && r.thugs === n && r.kit === k)[0];
  const spec = path.join(SCRATCH, 'sheet.json');
  fs.writeFileSync(spec, JSON.stringify({ frames: frames, bench: { old: COUNTS.map(n => pick('old', n)), guns: COUNTS.map(n => pick('guns', n)) },
    all: rows.filter(r => r.thugs === 3), seeds: SEEDS, out: OUT_JPG, errs: errs }));
  execFileSync('python3', [path.join(__dirname, 'bohemia_combat_guns_from_the_first_fight_sheet_10_19_26.py'), spec], { stdio: 'inherit' });
  console.log('  wrote ' + path.relative(ROOT, OUT_JPG));
  ['before', 'after', 'pistol', 'card', 'rifle'].forEach(k => console.log('   ' + k + ': ' + (frames[k] ? JSON.stringify(Object.assign({}, frames[k], { file: undefined, aim: undefined, fire: undefined })).slice(0, 300) : 'NOT TAKEN')));
})().catch(e => { console.error(e); process.exit(1); });
