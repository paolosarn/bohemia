#!/usr/bin/env node
/* THE GROUND FIGHTS (COMBAT [the ground fights], rule 59, Paolo 10/1: 'every floor tile from Battle Brothers needs a
   proper translation for our game... how it impacts your accuracy or your defence or the positioning, how many action
   points it costs to move through').

   The fight now takes what every tile does from ONE table, WORLD's records/target/BOHEMIA_GROUND_EFFECTS.json, through
   ours.ground_rows. This tool plays the REAL fight (slices/BOHEMIA_FIGHT.html, his phone's profile, through the one
   driver) and writes two things:

   1. records/target/BOHEMIA_FIGHT_GROUND_MEASURED.json -- for WORLD (the HEIGHT row it left UNREAD, and the two rows
      it measured as unable to fire): every one of the 78 districts in WORLD's records/target/BOHEMIA_BOARD_KINDS.json is
      dealt the way the fight deals it (its board kind, its district), SEEDS times, and every tile is counted by the
      Battle Brothers row it answers to. Grouped by WORLD's thirteen grounds, every district weighted the same.
   2. slices/vote/COMBAT_THE_GROUND_FIGHTS_10_18.jpg -- the VOTE sheet, all from the game's own camera: the four moments a
      tile changes something (a finger on rough ground, on rubble, in water, and the step onto a roof), then one board per
      ground at the open, each with what standing there does.

   Run: node tools/bohemia_combat_the_ground_fights_10_18_26.js            (measure + sheet)
        node tools/bohemia_combat_the_ground_fights_10_18_26.js --measure  (the file only) */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { open } = require('./bohemia_drive_the_demo.js');
const ROOT = path.resolve(__dirname, '..');
const OUT_JSON = path.join(ROOT, 'records/target/BOHEMIA_FIGHT_GROUND_MEASURED.json');
const OUT_JPG = path.join(ROOT, 'slices/vote/COMBAT_THE_GROUND_FIGHTS_10_18.jpg');
const SCRATCH = process.env.BOHEMIA_SCRATCH || path.join(require('os').tmpdir(), 'bohemia_ground_fights');
const SEEDS = 6;
const MEASURE_ONLY = process.argv.includes('--measure');

const until = async (p, fn, ms, arg) => { const t = Date.now(); while (Date.now() - t < ms) { if (await p.evaluate(fn, arg)) return true; await p.waitForTimeout(80); } return false; };

/* every district, dealt the fight's way, counted by row */
async function measure(p) {
  return p.evaluate((SEEDS) => {
    const ds = DB.boardKinds.districts, rows = DB.groundEffects.battleBrothersRows.map(r => r.row);
    const byG = {};
    ds.forEach(d => {
      for (let s = 1; s <= SEEDS; s++) {
        SEED = (s * 7919 + d.district.length) >>> 0;
        FIGHT.setup({ kind: d.boardKind, district: d.district, formation: null });
        const S = FIGHT.S, n = { tiles: 0, solid: 0, cover: 0 };
        rows.forEach(r => { n[r] = 0; });
        for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) {
          const row = FIGHT.rowAt(x, y); n.tiles++; n[row]++;
          if (row !== 'obstacles' && S.solid[y][x]) n.solid++;
          if (S.cover[y][x]) n.cover++;
        }
        const g = byG[d.ground] = byG[d.ground] || { districts: {}, kinds: {}, sum: {}, deals: 0, named: 0 };
        g.deals++; if (S.ground.ground === d.ground && S.ground.from === 'district') g.named++;
        g.kinds[d.boardKind] = (g.kinds[d.boardKind] || 0) + 1 / SEEDS;
        const dd = g.districts[d.district] = g.districts[d.district] || {};
        Object.keys(n).forEach(k => { if (k === 'tiles') return; const v = n[k] / n.tiles;
          dd[k] = (dd[k] || 0) + v / SEEDS; });
      }
    });
    const grounds = DB.groundEffects.grounds.map(G => {
      const g = byG[G.ground]; if (!g) return { ground: G.ground, districts: 0 };
      const names = Object.keys(g.districts), share = {};
      Object.keys(g.districts[names[0]]).forEach(k => { share[k] = +(names.reduce((t, n) => t + g.districts[n][k], 0) / names.length).toFixed(4); });
      return { ground: G.ground, districts: names.length, boardKinds: Object.keys(g.kinds).sort(), named: g.named + ' of ' + g.deals,
        share: share, world: { cover: G.cover, room: G.room, door: G.door, height: G.height && G.height.known ? G.height : 'UNREAD' } };
    });
    const canFire = {}; DB.groundEffects.battleBrothersRows.forEach(r => { canFire[r.row] = r.canFire; });
    return { grounds: grounds, worldCanFire: canFire, tileKinds: DB.ours.ground_rows.value };
  }, SEEDS);
}

async function shoot(p, file, clip) { await p.screenshot({ path: file, type: 'png', clip: clip || undefined }); }

/* a fight that has started, with one of his men to move */
async function startOn(p, opts) {
  await p.evaluate(o => { window.FIGHT_OPTS = o; document.getElementById('over').style.display = 'none'; return start(); }, opts);
  await until(p, () => !!FIGHT_UI.board && !!FIGHT.S.deploy, 20000);
  return true;
}
async function fightOn(p) {
  const fb = await p.evaluate(() => { const r = document.getElementById('bend').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  await p.touchscreen.tap(fb.x, fb.y);
  await until(p, () => !FIGHT.S.deploy, 3000);
  /* their turns run on: he taps to skip, the way a finger does */
  for (let i = 0; i < 60; i++) {
    const mine = await p.evaluate(() => { const u = FIGHT.current(); return !!u && u.side === 'you' && !FIGHT_UI.anim.length && !FIGHT_UI.glide && !FIGHT.S.over; });
    if (mine) return true;
    await p.touchscreen.tap(200, 400); await p.waitForTimeout(250);
  }
  return false;
}
/* the nearest tile of a kind inside his reach this turn, the camera on it, and a finger on it */
async function tapKind(p, kind) {
  const t = await p.evaluate(k => {
    const u = FIGHT.current(), f = FIGHT.reach(u, null, true), S = FIGHT.S;
    const ts = Object.keys(f.best).map(Number).map(n => ({ x: n % S.w, y: Math.floor(n / S.w), ap: f.best[n] }))
      .filter(q => S.terrain[q.y][q.x] === k && !S.units.some(v => FIGHT.onField(v) && v.x === q.x && v.y === q.y) && !FIGHT.zocOn(u, q.x, q.y).length)
      .sort((a, b) => Math.hypot(a.x - u.x, a.y - u.y) - Math.hypot(b.x - u.x, b.y - u.y));
    return ts[0] ? { x: ts[0].x, y: ts[0].y, ux: u.x, uy: u.y } : null;
  }, kind);
  if (!t) return null;
  await p.evaluate(q => { FIGHT_UI.glide = null; FIGHT_UI.cx = ((q.x + q.ux) / 2 + .5) * FIGHT_UI.tw; FIGHT_UI.cy = ((q.y + q.uy) / 2 + .5) * FIGHT_UI.th; }, t);
  await p.waitForTimeout(150);
  const s = await p.evaluate(q => ({ x: sx((q.x + .5) * FIGHT_UI.tw), y: sy((q.y + .5) * FIGHT_UI.th) }), t);
  await p.touchscreen.tap(s.x, s.y); await p.waitForTimeout(300);
  t.say = await p.evaluate(() => document.getElementById('say').textContent);
  return t;
}

(async () => {
  fs.mkdirSync(SCRATCH, { recursive: true });
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS={seed:3,speed:6,kind:"suburb"}' });
  const p = d.page; const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  try {
    if (!await until(p, () => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board, 30000)) throw new Error('the fight did not load');
    const M = await measure(p);
    const out = {
      _readme: 'COMBAT [the ground fights] 10/18 (rule 59): what every floor tile does on the boards the FIGHT really deals, for WORLD. Written by tools/bohemia_combat_the_ground_fights_10_18_26.js, which plays slices/BOHEMIA_FIGHT.html -- do not hand edit. Every one of the 78 districts of records/target/BOHEMIA_BOARD_KINDS.json is dealt by the fight (its board kind and its district) ' + SEEDS + ' times; every tile is counted by the Battle Brothers row it answers to through ours.ground_rows (records/target/bb/ours.json) in WORLD\'s records/target/BOHEMIA_GROUND_EFFECTS.json; a ground is the mean of its districts, each weighted the same. share.solid is cover that fills a tile (a dead car, a wall piece) on a tile that is not itself an obstacle; share.cover is every tile with a cover piece. THE HEIGHT ROW WORLD LEFT UNREAD IS share.height: a roof is one level up (board.height_levels). NOTE FOR WORLD: the fight\'s boards are COMBAT TWO\'s 35 blocks dealt by board kind, not cut from the district kits, so the numbers here are what a fight on that ground plays on today; the cell\'s own board is COMBAT [the map hands the board].',
      version: 'BOHEMIA_FIGHT_GROUND_MEASURED_v1', built: '2026-10-18', seeds: SEEDS,
      tileKinds: M.tileKinds, worldCanFire: M.worldCanFire, grounds: M.grounds,
      firesOnTheFight: (() => { const f = {}; M.grounds.forEach(g => { if (!g.share) return; Object.keys(g.share).forEach(k => { if (g.share[k] > 0) f[k] = (f[k] || 0) + 1; }); }); return f; })(),
      door: { fightTiles: 0, why: 'no fight block draws a door: a fight house is one blocked tile whole (A COMBAT TILE IS A HOUSE), so the DOOR row WORLD measured on nine grounds has no tile to fire on in the fight' }
    };
    fs.writeFileSync(OUT_JSON, JSON.stringify(out, null, 1) + '\n');
    console.log('  wrote ' + path.relative(ROOT, OUT_JSON));
    M.grounds.forEach(g => console.log('   ' + g.ground.padEnd(16) + ' ' + JSON.stringify(g.share) + ' kinds ' + g.boardKinds.join(',')));
    if (MEASURE_ONLY) return;

    /* THE FOUR MOMENTS, from the game's camera: a finger on a tile that changes something, the line he reads */
    const moments = [];
    const want = [{ kind: 'rough', on: { kind: 'wash' }, name: 'ROUGH GROUND' }, { kind: 'debris', on: { kind: 'ruin' }, name: 'RUBBLE' },
      { kind: 'water', on: { kind: 'shore' }, name: 'WATER' }, { kind: 'height', on: { kind: 'suburb' }, name: 'A ROOF', walk: true }];
    for (const w of want) {
      let got = null;
      for (let seed = 1; seed <= 40 && !got; seed++) {
        await startOn(p, Object.assign({ seed: seed, speed: 3, formation: null }, w.on));
        if (!await fightOn(p)) continue;
        const t = await tapKind(p, w.kind);
        if (!t) continue;
        const f = path.join(SCRATCH, 'moment_' + w.kind + '.png');
        await shoot(p, f);
        got = { file: f, name: w.name, say: t.say, seed: seed };
        if (w.walk) {
          /* the second tap walks him up: the gold ring at his feet the moment he arrives */
          const s = await p.evaluate(q => ({ x: sx((q.x + .5) * FIGHT_UI.tw), y: sy((q.y + .5) * FIGHT_UI.th) }), t);
          await p.touchscreen.tap(s.x, s.y);
          const rang = await until(p, () => FIGHT_UI.pops.some(q => q.col === '#f0d296'), 6000);
          await p.waitForTimeout(120);
          const f2 = path.join(SCRATCH, 'moment_height_walk.png');
          await shoot(p, f2);
          got.walk = { file: f2, rang: rang, feed: await p.evaluate(() => (FIGHT_UI.feedLines || []).map(l => l.text).filter(t => /high ground/.test(t)).slice(-1)[0] || '') };
        }
      }
      moments.push(got || { name: w.name, missing: true });
      console.log('   moment ' + w.name + ': ' + (got ? got.say + (got.walk ? ' | ' + got.walk.feed : '') : 'NOT FOUND'));
    }

    /* ONE BOARD PER GROUND at the open, from the game's camera */
    const panels = [];
    for (const g of out.grounds) {
      const dname = await p.evaluate(G => DB.boardKinds.districts.filter(d => d.ground === G).map(d => d.district).sort()[0], g.ground);
      const kind = await p.evaluate(n => DB.boardKinds.districts.filter(d => d.district === n)[0].boardKind, dname);
      await startOn(p, { seed: 4, kind: kind, district: dname, formation: null });
      await p.waitForTimeout(400);
      const f = path.join(SCRATCH, 'ground_' + g.ground + '.png');
      await shoot(p, f);
      panels.push({ ground: g.ground, district: dname, kind: kind, file: f, share: g.share });
    }
    const spec = path.join(SCRATCH, 'sheet.json');
    fs.writeFileSync(spec, JSON.stringify({ moments: moments, panels: panels, out: OUT_JPG }));
    execFileSync('python3', [path.join(__dirname, 'bohemia_combat_the_ground_fights_sheet_10_18_26.py'), spec], { stdio: 'inherit' });
    console.log('  wrote ' + path.relative(ROOT, OUT_JPG));
  } finally {
    if (errs.length) console.log('  PAGE ERRORS: ' + errs.slice(0, 3).join(' | '));
    await d.close();
  }
})().catch(e => { console.error(e); process.exit(1); });
