#!/usr/bin/env node
/* EVERY FLOOR TILE IS A TRANSLATION (COMBAT [the ground fights], rule 59, Paolo 10/1: 'every floor tile from Battle
   Brothers needs a proper translation for our game... how it impacts your accuracy or your defence or the positioning,
   how many action points it costs to move through'). REPLACES gates/one_terrain_effect_gate.js (archive/), which held
   his 9/24 'ONE terrain effect... nothing else on a tile changes a number' on the frozen fight: rule 59 amends that
   ruling by name, and the old gate drove a fight nobody plays.

   The rebuilt fight (slices/BOHEMIA_FIGHT.html) takes what every tile does from ONE table, WORLD's
   records/target/BOHEMIA_GROUND_EFFECTS.json, through ours.ground_rows; the numbers stay in records/target/bb. Legs:
   1. every tile kind on every one of COMBAT TWO's blocks answers to a row, and every row is one of WORLD's (static);
   2. the fight loads WORLD's table and its district list (the data list names both);
   3. each row does what Battle Brothers says, driven through the shipped functions on dealt boards: rough costs its 3 AP
      a step, water cuts the man in it, a roof is +10 to hit down and +1 reach for a gun, an obstacle stops a path and a
      shot; and THE OLD GATE'S QUESTION, KEPT: a tile whose row is flat changes nothing (two men the same distance apart
      get the same chance on every pair of flat tiles);
   4. the board stands on one of WORLD's thirteen grounds: every one of the 78 districts names its own ground;
   5. the measured file for WORLD exists, carries the thirteen grounds and the height row, and its tile kinds are today's;
   6. with REAL TAPS on his phone: a finger on rough ground says so before the AP, a finger on flat ground says no ground
      words (rule 117b), and his step up onto a roof rings gold with the line in the feed (rule 117c);
   7. a suburb fight is dealt on a suburb (the alias family; 53 of 200 were on the valley's edge before 10/18);
   8. a second fight from AGAIN draws the map round the board, not flat dirt (35.7% of the glass before 10/18).
   Run: node gates/every_floor_tile_is_a_translation_gate.js */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));

/* ---- 1. static: every drawn kind has a row, every row is WORLD's ---- */
const OURS = J('records/target/bb/ours.json'), GE = J('records/target/BOHEMIA_GROUND_EFFECTS.json'), FG = J('slices/fight_ground/fight_ground.json');
const GR = (OURS.ground_rows || {}).value || {}, WROWS = (GE.battleBrothersRows || []).map(r => r.row);
const drawn = new Set();
Object.values(FG.boards).forEach(B => B.terrain.forEach(r => r.forEach(k => drawn.add(k))));
const orphan = [...drawn].filter(k => !GR[k]), foreign = Object.keys(GR).filter(k => WROWS.indexOf(GR[k].row) < 0);
leg(drawn.size > 0 && orphan.length === 0 && foreign.length === 0,
  '*** EVERY TILE KIND THE FIGHT DRAWS IS A BATTLE BROTHERS ROW OF WORLD\'S ONE TABLE *** (rule 59; never a second list)',
  [...drawn].map(k => k + '->' + (GR[k] ? GR[k].row : 'NONE')).join(', ') + (foreign.length ? ' | not WORLD\'s: ' + foreign.join(',') : ''));
leg(!!OURS.ground_rows && !!OURS.ground_rows.source && fs.existsSync(path.join(ROOT, OURS.ground_rows.source)) && OURS.ground_rows.draft === true,
  'the crosswalk row cites his words and its lines are attempts (draft:true)', OURS.ground_rows && OURS.ground_rows.source);

/* ---- 2. the fight reads the table ---- */
const html = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_FIGHT.html'), 'utf8');
const list = (html.match(/const DATA_FILES\s*=\s*\[([\s\S]*?)\];/) || [])[1] || '';
leg(/records\/target\/BOHEMIA_GROUND_EFFECTS\.json/.test(list) && /records\/target\/BOHEMIA_BOARD_KINDS\.json/.test(list),
  'the fight loads WORLD\'s ground table and its district list');
const rules = (html.match(/<script id="fight-rules">([\s\S]*?)<\/script>/) || [])[1] || '';
const typed = (rules.match(/(terrainAt\([^)]*\)|\bt)\s*===\s*'(water|rough|debris|height|blocked)'/g) || []);
leg(typed.length === 0, 'no rule asks a tile its kind by name; every rule asks its row', typed.slice(0, 3).join(' | '));

/* ---- 5. the measured file ---- */
let M = null; try { M = J('records/target/BOHEMIA_FIGHT_GROUND_MEASURED.json'); } catch (e) {}
leg(!!M && M.grounds.length === GE.grounds.length && M.grounds.every(g => g.share && typeof g.share.height === 'number')
  && JSON.stringify(M.tileKinds) === JSON.stringify(GR),
  'the measured file for WORLD carries every ground with its height row, and its tile kinds are today\'s',
  M ? M.grounds.map(g => g.ground + ' ' + (g.share ? Math.round(100 * g.share.height) + '%' : '-')).join(', ') : 'missing: node tools/bohemia_combat_the_ground_fights_10_18_26.js --measure');

(async () => {
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS={seed:3,speed:6,kind:"suburb",night:false}' });
  const p = d.page; const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  const until = async (fn, ms, a) => { const t = Date.now(); while (Date.now() - t < ms) { if (await p.evaluate(fn, a)) return true; await p.waitForTimeout(80); } return false; };
  try {
    if (!await until(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board, 30000)) { leg(false, 'the fight loads'); return; }

    /* ---- 3. each row does what Battle Brothers says ---- */
    const R3 = await p.evaluate(() => {
      /* ON A CLEAN BOARD (setup's own flat test board: the deal's blocks, every tile open flat, no cover, no lamps), one tile at
         a time takes a row, so the only thing that changes between two readings is that tile's row */
      const T = FIGHT._t, out = { seen: {} };
      SEED = 77; FIGHT.setup({ kind: 'suburb', night: false, formation: null, flat: true });
      const S = FIGHT.S, a = FIGHT.alive('you')[0], t = FIGHT.alive('them')[0], keep = S.units;
      S.units = [a, t];
      [a, t].forEach(u => { u.perks = []; u.injuries = []; u.morale = 'Steady'; u.missStack = 0; u.reachStacks = 0; u.shield = null;
        u.ap = 99; u.fat = 0; u.loaded = true; u.ammo = null; });
      const melee = DB.weapons.rows.filter(w => !FIGHT.isRanged(w) && w.class === 'mace' && (w.hands || 1) === 1)[0];
      const gun = DB.weapons.rows.filter(w => FIGHT.isGun(w) && /rifle|crossbow/i.test(w.class + ' ' + w.name))[0] || DB.weapons.rows.filter(w => FIGHT.isGun(w))[0];
      a.weapon = melee; t.weapon = melee; a.mskill = 60; t.mdef = 10; a.rskill = 60; t.rdef = 10;
      const put = (u, x, y) => { u.x = x; u.y = y; };
      /* a tile takes a row by taking a kind of that row (the tile's kind is the fight's one truth) */
      const kindOf = row => Object.keys(DB.ours.ground_rows.value).filter(k => DB.ours.ground_rows.value[k].row === row)[0];
      const as = (x, y, row, fn) => { const was = S.terrain[y][x]; S.terrain[y][x] = kindOf(row); try { return fn(); } finally { S.terrain[y][x] = was; } };
      const chance = () => FIGHT.hitChance(a, t, FIGHT.strikeSkill(a.weapon)).chance;
      const y = 7;
      put(a, 5, y); put(t, 6, y);
      out.rough = { flat: T.stepCost(a, 5, y, 6, y), rough: as(6, y, 'rough', () => T.stepCost(a, 5, y, 6, y)) };
      out.swamp = { flat: chance(), targetInWater: as(6, y, 'swamp', chance), youInWater: as(5, y, 'swamp', chance) };
      out.height = { flat: chance(), above: as(5, y, 'height', chance), below: as(6, y, 'height', chance), bonus: R('hit_chance.height.higher_attacker_bonus') };
      out.obst = as(6, y, 'obstacles', () => ({ passable: T.passable(6, y), blocksSight: T.sightBlock(6, y) }));
      /* +1 reach a level for a gun: a man one tile past the gun's reach is out of it from the flat and in it from a roof */
      a.weapon = gun; const far = Math.max.apply(null, String(gun.range_max || gun.range || '1').match(/\d+/g).map(Number));
      put(a, 2, y); put(t, 2 + far + 1, y);
      out.reach = { gun: gun.name, reach: far, fromFlat: FIGHT.canStrike(a, t), fromRoof: as(2, y, 'height', () => FIGHT.canStrike(a, t)), perLevel: R('hit_chance.height.ranged_range_per_level') };
      a.weapon = melee;
      /* A FLAT TILE CHANGES NOTHING: the same two men side by side on every pair of flat tiles of the board */
      out.flatPairs = 0; out.flatAnswers = {};
      for (let yy = 0; yy < S.h; yy++) for (let xx = 0; xx < S.w - 1; xx++) { put(a, xx, yy); put(t, xx + 1, yy);
        const c = chance(); out.flatAnswers[c] = (out.flatAnswers[c] || 0) + 1; out.flatPairs++; }
      S.units = keep;
      /* and on the boards the fight really deals, every row he can meet is there */
      for (const kind of ['shore', 'wash', 'suburb', 'landfill', 'ruin', 'strip']) for (let s = 1; s <= 6; s++) {
        SEED = s * 101; FIGHT.setup({ kind: kind, night: false, formation: null });
        const S2 = FIGHT.S; for (let yy = 0; yy < S2.h; yy++) for (let xx = 0; xx < S2.w; xx++) { const k = FIGHT.rowAt(xx, yy); out.seen[k] = (out.seen[k] || 0) + 1; }
      }
      out.costs = { flat: R('ap.move_cost.flat'), rough: R('ap.move_cost.rough'), swampDef: R('hit_chance.terrain_swamp').melee_defense };
      return out;
    });
    leg(['flat', 'rough', 'swamp', 'height', 'obstacles'].every(k => R3.seen[k] > 0), 'every row he can meet is on the boards the fight deals', JSON.stringify(R3.seen));
    leg(R3.rough.rough === R3.costs.rough && R3.rough.flat === R3.costs.flat,
      'ROUGH (Battle Brothers\' forest floor and snow): a step onto it costs ' + R3.costs.rough + ' AP, a flat step ' + R3.costs.flat, JSON.stringify(R3.rough));
    leg(R3.swamp.targetInWater > R3.swamp.flat && R3.swamp.youInWater < R3.swamp.flat,
      'WATER (their swamp): the man standing in it is easier to hit and swings worse (x' + R3.costs.swampDef + ')', JSON.stringify(R3.swamp));
    leg(R3.height.above - R3.height.flat === R3.height.bonus && R3.height.below < R3.height.flat,
      'A ROOF (their hills): from one level up a swing is +' + R3.height.bonus + ' to hit, from below it is less', JSON.stringify(R3.height));
    leg(R3.reach.fromFlat === false && R3.reach.fromRoof === true && R3.reach.perLevel >= 1,
      'and a gun on a roof reaches one tile more: a man one past its reach is out of it from the flat and in it from the roof', JSON.stringify(R3.reach));
    leg(R3.obst.passable === false && R3.obst.blocksSight === true, 'AN OBSTACLE (their trees, rocks and walls): no path through it and no shot past it', JSON.stringify(R3.obst));
    leg(R3.flatPairs >= 100 && Object.keys(R3.flatAnswers).length === 1,
      '*** A FLAT TILE CHANGES NOTHING *** (the old gate\'s question, kept): the same two men side by side get one chance on every pair of flat tiles',
      R3.flatPairs + ' pairs, answers ' + JSON.stringify(R3.flatAnswers));

    /* ---- 4. every district names its own ground ---- */
    const R4 = await p.evaluate(() => { const bad = [], seen = {};
      DB.boardKinds.districts.forEach(d => { const g = FIGHT.groundOf({ district: d.district, kind: d.boardKind }); seen[g.ground] = 1;
        if (g.ground !== d.ground || g.from !== 'district') bad.push(d.district + '->' + g.ground); });
      const byKind = FIGHT.groundOf({ kind: 'strip' }), none = FIGHT.groundOf({});
      return { n: DB.boardKinds.districts.length, bad, grounds: Object.keys(seen).length, all: DB.groundEffects.grounds.length, byKind, none }; });
    leg(R4.bad.length === 0 && R4.grounds === R4.all,
      'THE BOARD STANDS ON ONE OF WORLD\'S GROUNDS: ' + R4.n + ' of ' + R4.n + ' districts name their own, all ' + R4.all + ' grounds reached',
      R4.bad.slice(0, 4).join(', ') + ' | by kind only: strip -> ' + R4.byKind.ground + ' (' + R4.byKind.from + '), none -> ' + R4.none.from);

    /* ---- 7. a suburb fight is dealt on a suburb ---- */
    const R7 = await p.evaluate(() => { const al = DB.ours.board_mix.value.aliases.suburb; let edge = 0, n = 0;
      for (let s = 1; s <= 100; s++) { SEED = s * 31; FIGHT.setup({ kind: 'suburb', formation: null }); n++;
        if (!FIGHT.S.boardDef.blocks.some(r => r.some(b => al.indexOf(b.split('.')[0]) >= 0))) edge++; }
      return { n, edge }; });
    leg(R7.edge === 0, 'a suburb fight is dealt on a suburb: ' + R7.edge + ' of ' + R7.n + ' without a suburb block (53 of 200 before 10/18)');

    /* ---- 6. real taps: the line says what the ground does ---- */
    const startOn = async o => { await p.evaluate(x => { window.FIGHT_OPTS = x; document.getElementById('over').style.display = 'none'; return start(); }, o);
      await until(() => !!FIGHT_UI.board && !!FIGHT.S.deploy, 20000); };
    const fightOn = async () => { const fb = await p.evaluate(() => { const r = document.getElementById('bend').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
      await p.touchscreen.tap(fb.x, fb.y); await until(() => !FIGHT.S.deploy, 3000);
      for (let i = 0; i < 60; i++) { if (await p.evaluate(() => { const u = FIGHT.current(); return !!u && u.side === 'you' && !FIGHT_UI.anim.length && !FIGHT_UI.glide && !FIGHT.S.over; })) return true;
        await p.touchscreen.tap(200, 400); await p.waitForTimeout(250); } return false; };
    const find = row => p.evaluate(r => { const u = FIGHT.current(), f = FIGHT.reach(u, null, true), S = FIGHT.S;
      const ts = Object.keys(f.best).map(Number).map(n => ({ x: n % S.w, y: Math.floor(n / S.w) }))
        .filter(q => FIGHT.rowAt(q.x, q.y) === r && !S.units.some(v => FIGHT.onField(v) && v.x === q.x && v.y === q.y) && !FIGHT.zocOn(u, q.x, q.y).length
          && !(r === 'flat' && FIGHT.groundSay(q.x, q.y)))
        .sort((a, b) => Math.hypot(a.x - u.x, a.y - u.y) - Math.hypot(b.x - u.x, b.y - u.y));
      return ts[0] ? { x: ts[0].x, y: ts[0].y, ux: u.x, uy: u.y, id: u.id } : null; }, row);
    const tap = async t => { await p.evaluate(q => { FIGHT_UI.glide = null; FIGHT_UI.cx = ((q.x + q.ux) / 2 + .5) * FIGHT_UI.tw; FIGHT_UI.cy = ((q.y + q.uy) / 2 + .5) * FIGHT_UI.th; }, t);
      await p.waitForTimeout(150); const s = await p.evaluate(q => ({ x: sx((q.x + .5) * FIGHT_UI.tw), y: sy((q.y + .5) * FIGHT_UI.th) }), t);
      await p.touchscreen.tap(s.x, s.y); await p.waitForTimeout(300);
      /* the line under the board says what the ground does; the walk and its AP are the tag on the tile and the big button (COMBAT [one tap to see, one tap to do]) */
      return p.evaluate(() => { const k = document.getElementById('pick'); return document.getElementById('say').textContent + (k && k.style.display !== 'none' ? ' | ' + k.innerText.replace(/\s+/g, ' ').trim() : ''); }); };
    const says = { rough: OURS.ground_rows.value.rough.say, height: OURS.ground_rows.value.height.say };
    let rough = null, flat = null, up = null;
    for (let seed = 1; seed <= 30 && !(rough && flat); seed++) {
      await startOn({ seed, kind: 'wash', speed: 3, formation: null, night: false }); if (!await fightOn()) continue;
      const t = await find('rough'); if (t && !rough) rough = await tap(t);
      const f = await find('flat'); if (f && !flat) flat = await tap(f);
    }
    leg(!!rough && rough.indexOf(says.rough) === 0 && /\| WALK \d+ AP/.test(rough), 'a finger on rough ground: the line says so, and the tag on the tile says WALK and its AP (rule 59, in play)', rough);
    leg(!!flat && /^ ?\| WALK \d+ AP/.test(flat), 'a finger on flat ground: no ground words, one clear next thing, WALK and its AP on the tile (rule 117b)', flat);
    for (let seed = 1; seed <= 40 && !up; seed++) {
      await startOn({ seed, kind: 'suburb', speed: 3, formation: null, night: false }); if (!await fightOn()) continue;
      const t = await find('height'); if (!t) continue;
      const first = await tap(t);
      if (first.indexOf(says.height) !== 0) { up = { first }; break; }
      const s = await p.evaluate(q => ({ x: sx((q.x + .5) * FIGHT_UI.tw), y: sy((q.y + .5) * FIGHT_UI.th) }), t);
      await p.touchscreen.tap(s.x, s.y);
      const rang = await until(() => FIGHT_UI.pops.some(q => q.col === '#f0d296'), 6000);
      const feed = await p.evaluate(() => (FIGHT_UI.feedLines || []).map(l => l.text).filter(x => /takes the high ground/.test(x)).slice(-1)[0] || '');
      const on = await p.evaluate(id => { const u = FIGHT.byId(id); return FIGHT.rowAt(u.x, u.y); }, t.id);
      up = { first, rang, feed, on };
    }
    leg(!!up && up.first.indexOf(says.height) === 0 && up.rang && /takes the high ground/.test(up.feed) && up.on === 'height',
      'a finger on a roof says high ground, and his step up rings gold at his feet with the line in the feed (rule 117c)', JSON.stringify(up));

    /* ---- 8. AGAIN draws the map, not dirt ---- */
    const under = () => p.evaluate(() => { const c = document.getElementById('cv'), D = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0, m = 0;
      for (let i = 0; i < D.length; i += 40) { m++; if (Math.abs(D[i] - 42) + Math.abs(D[i + 1] - 34) + Math.abs(D[i + 2] - 25) < 12) n++; } return 100 * n / m; });
    await startOn({ seed: 3, kind: 'suburb', formation: null, night: false }); await p.waitForTimeout(400);
    await startOn({ seed: 4, kind: 'strip', formation: null, night: false }); await p.waitForTimeout(600);
    const again = await under();
    leg(again < 2, 'a second fight from AGAIN draws the map round the board: ' + again.toFixed(2) + '% of the glass flat dirt (35.7% before 10/18)');
    leg(errs.length === 0, 'no page errors', errs.slice(0, 2).join(' | '));
  } finally {
    await d.close();
    console.log('=== EVERY FLOOR TILE IS A TRANSLATION GATE: ' + pass + ' passed, ' + fail + ' failed ===');
    process.exit(fail ? 1 : 0);
  }
})().catch(e => { console.error(e); process.exit(1); });
