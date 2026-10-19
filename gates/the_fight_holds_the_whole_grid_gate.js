#!/usr/bin/env node
/* THE FIGHT HOLDS THE WHOLE GRID (COMBAT [the fight holds the grid], rule 117(e), Paolo 10/18: 'how are you even testing these
   fights... against animals, against different group sizes, one person, three, six, up to 14... a 12-man Lone Wolf squad can
   go up to 36 or 40 enemies... we don't even have all the equipment in the game... what are you even testing?'). The
   coordinator's line to COMBAT: 'if the fight cannot yet hold 40 enemies or a beast, that is yours to fix first.'
   Measured before this gate: every beast fight crashed on its first line (a beast carries no gear), and the 30 enemies the
   wiki makes immune to fatigue (the undead, the golems) walked whole fights without a swing.

   This gate does not judge how hard a cell is (that is TUNING's grid, rule 38g, every number DRAFT until the gear is in). It
   proves the fight HOLDS every cell TUNING has to test: the live fight's rules, headless through tools/bohemia_fight_headless.js
   (the page's own data list), over
     your company   1 (the lone wolf), 3, 6, 12, 14
     the enemy      3 (a few), 9 (a band), 20, 40
     who            human bands (brigands) and the beasts (FACTIONS' lab-made pack: dire wolves, hyenas, frenzied, a schrat late)
     gear           early (day 1, the place's starting kit), middle (day 30, MAIL armour), late (day 65, PLATE armour);
                    your armour from CHARACTER's tiers (records/target/bb/armor_tiers.json), theirs from the fight's own day tiers
   two seeds a cell, 240 fights. Each must: build without a throw; put every man of both sides on an open tile of the board,
   none on another; end with a result inside the step cap; and in a beast cell, the beasts bite. Then every gearless enemy in
   the data plays once (each armed one strikes, or a named reason; each refused one is refused BY NAME, never a crash), and
   the fatigue-immune strike. Then the glass: 14 against 40 dire wolves on his phone's profile (390x844 at 3x): the page
   loads, every one of the 54 is drawn (the beasts from ANIMATION's sheet), both teams framed at the open, no page error.
   With --write it writes records/target/BOHEMIA_COMBAT_THE_WHOLE_GRID_HOLDS.json (one row a cell) for TUNING's bench.
   Run: node gates/the_fight_holds_the_whole_grid_gate.js   (--no-glass skips the browser leg; --write rewrites the table) */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const { engine } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };

const COMPANY = [1, 3, 6, 12, 14], ENEMY = [3, 9, 20, 40], WHO = ['brigands', 'beasts'];
const TIERS = J('records/target/bb/armor_tiers.json');
const mid = ids => ids[Math.floor(ids.length / 2)];
const GEAR = [
  { id: 'early', days: 1, body: null, head: null },
  { id: 'middle', days: 30, body: mid(TIERS.body_tiers.MAIL.ids), head: mid(TIERS.head_tiers.MAIL.ids) },
  { id: 'late', days: 65, body: mid(TIERS.body_tiers.PLATE.ids), head: mid(TIERS.head_tiers.PLATE.ids) }
];
const SEEDS = [1, 2], STEP_CAP = 200000;

const ctx = engine(), F = ctx.FIGHT, DB = ctx.DB;
const crew = DB.ours.crew.value, rows = DB.ours.weapon_rows.value;
function company(n, g) {
  return Array.from({ length: n }, (_, i) => {
    const c = crew[i % crew.length], job = c.jobs.filter(j => j !== 'car_door')[0];
    const m = { background: c.background, level: g.id === 'early' ? 1 : g.id === 'middle' ? 3 : 6 };
    if (g.body) m.gear = { main: rows[job], off: c.jobs.indexOf('car_door') >= 0 ? rows.car_door : null, body: g.body, head: g.head };
    return m;
  });
}
/* the TUNING bench's own beat count: a turn that does something is two beats, one that does nothing half a beat (120 BPM) */
function minutes(S) {
  let beats = 0, open = false, acted = false;
  S.log.forEach(e => { if (e.t === 'turn') { if (open) beats += acted ? 2 : 0.5; open = true; acted = false; }
    else if (e.t === 'step' || e.t === 'attack' || e.t === 'reload' || e.t === 'skill') acted = true; });
  if (open) beats += acted ? 2 : 0.5;
  return beats / 120;
}

const t0 = Date.now(), cells = [], bad = { build: [], placed: [], stacked: [], ended: [], bite: [] };
for (const who of WHO) for (const g of GEAR) for (const m of COMPANY) for (const e of ENEMY) {
  const cell = { who: who, gear: g.id, men: m, enemies: e, fights: 0, won: 0, rounds: 0, minutes: 0, worst_minutes: 0, kinds: {} };
  for (const sd of SEEDS) {
    const name = who + ' ' + g.id + ' ' + m + 'v' + e + ' seed ' + sd;
    try {
      ctx.setSeed(1000 * sd + 100 * m + e);
      F.setup({ auto: true, formation: null, company: company(m, g), cap: Math.max(m, DB.ours.field_size.value),
        party: { faction: who, count: e, days: g.days } });
      const S = F.S, you = S.units.filter(u => u.side === 'you'), them = S.units.filter(u => u.side === 'them');
      if (you.length !== m || them.length !== e) bad.placed.push(name + ' (' + you.length + ' v ' + them.length + ')');
      const blocked = S.units.filter(u => !(u.x >= 0 && u.y >= 0 && u.x < S.w && u.y < S.h) || F.rowAt(u.x, u.y) === 'obstacles' || S.solid[u.y][u.x]);
      if (blocked.length) bad.placed.push(name + ' (' + blocked.length + ' off the board or on a wall)');
      const seen = {}; let stack = 0; S.units.forEach(u => { const k = u.x + ',' + u.y; if (seen[k]) stack++; seen[k] = 1; });
      if (stack) bad.stacked.push(name + ' (' + stack + ')');
      them.forEach(u => { cell.kinds[u.kind] = (cell.kinds[u.kind] || 0) + 1; });
      let k = 0; while (!S.over && k < STEP_CAP) { const u = F.current(); if (!u) break; F.aiStep(u); k++; }
      if (!S.over || !S.result) bad.ended.push(name + ' (' + k + ' steps, round ' + S.round + ')');
      if (who === 'beasts' && !S.log.some(ev => ev.t === 'attack' && them.some(u => u.id === ev.id && u.weapon.class === 'natural'))) bad.bite.push(name);
      const mn = minutes(S);
      cell.fights++; if (S.result === 'won') cell.won++; cell.rounds += S.round; cell.minutes += mn; cell.worst_minutes = Math.max(cell.worst_minutes, mn);
    } catch (err) { bad.build.push(name + ': ' + String(err && err.message || err).slice(0, 90)); }
  }
  cell.rounds = Math.round(10 * cell.rounds / Math.max(1, cell.fights)) / 10;
  cell.minutes = Math.round(10 * cell.minutes / Math.max(1, cell.fights)) / 10;
  cell.worst_minutes = Math.round(10 * cell.worst_minutes) / 10;
  cells.push(cell);
}
const n = cells.length * SEEDS.length;
console.log('THE WHOLE GRID: ' + cells.length + ' cells, ' + n + ' fights, ' + ((Date.now() - t0) / 1000).toFixed(1) + ' s');
leg(bad.build.length === 0, '*** EVERY CELL BUILDS: 1 to 14 men against 3 to 40, men and beasts, three gear stages ***', bad.build.length + ' threw: ' + bad.build.slice(0, 3).join(' | '));
leg(bad.placed.length === 0, 'every man of both sides stands on an open tile of the board, the counts asked for', bad.placed.slice(0, 3).join(' | '));
leg(bad.stacked.length === 0, 'nobody stands on anybody (the first votes)', bad.stacked.slice(0, 3).join(' | '));
leg(bad.ended.length === 0, 'every fight ends with a result inside the step cap', bad.ended.slice(0, 3).join(' | '));
leg(bad.bite.length === 0, '*** IN EVERY BEAST CELL THE BEASTS BITE (their racial skill, records/target/bb/beast_attacks.json) ***', bad.bite.slice(0, 3).join(' | '));
const forty = cells.filter(c => c.enemies === 40 && c.fights === SEEDS.length);
leg(forty.length === WHO.length * GEAR.length * COMPANY.length, 'the forty: every company size against 40, men and beasts, all three gear stages', forty.length + ' cells');
const kinds = {}; cells.filter(c => c.who === 'beasts').forEach(c => Object.keys(c.kinds).forEach(k => { kinds[k] = (kinds[k] || 0) + c.kinds[k]; }));
const packed = Object.keys(DB.ours.enemy_tiers.value.mix.beasts).reduce((a, ph) => a.concat(Object.keys(DB.ours.enemy_tiers.value.mix.beasts[ph])), []);
leg(packed.every(k => kinds[k] > 0), 'every beast the pack mix can deal was dealt and fought', JSON.stringify(kinds));

/* every gearless enemy in the data: armed ones strike, refused ones are refused by name */
/* the file itself when the fight does not list it (a fight that cannot read a bite cannot arm a beast; the legs below say so) */
const BA = DB.beastAttacks || J('records/target/bb/beast_attacks.json'), refusedBad = [], silent = [];
/* the six live long enough to reach a man: the legs ask whether they CAN swing, never how long they last (10/19: the guns shot
   six screaming skulls of 25 health dead before one reached anyone to explode) */
const hardy = () => F.S.units.filter(u => u.side === 'them').forEach(u => { u.hp = u.hpMax = 9999; });
Object.keys(BA.by_enemy).forEach(id => {
  try { ctx.setSeed(7); F.setup({ auto: true, formation: null, party: Array(6).fill(id) }); let k = 0;
    hardy();
    while (!F.S.over && k < STEP_CAP) { F.aiStep(F.current()); k++; }
    if (!F.S.log.some(ev => ev.t === 'attack' && ev.id[0] === 'e')) silent.push(id);
  } catch (err) { refusedBad.push(id + ': ' + err.message); }
});
Object.keys(BA.refused).forEach(id => {
  try { F.setup({ auto: true, formation: null, party: [id] }); refusedBad.push(id + ' was NOT refused'); }
  catch (err) { if (!/cannot arm/.test(err.message) || err.message.indexOf(id) < 0) refusedBad.push(id + ': ' + err.message); }
});
leg(refusedBad.length === 0, 'every gearless enemy in the data is armed with its bite, or refused by name (' + Object.keys(BA.by_enemy).length + ' armed, ' + Object.keys(BA.refused).length + ' refused)', refusedBad.slice(0, 3).join(' | '));
/* THE FATIGUE-IMMUNE STRIKE: the 31 rows the wiki makes immune to fatigue (the undead, the golems), armed or bitten, each in a
   fight of six; read as a pool of none they could never afford a swing (measured 10/18: 20 of 31 silent, the plain wiederganger
   among them). A party that never strikes is allowed only where the data says why: the goblin's wolf runs (40 resolve, a
   wolfrider's spawn), the mortar has no hitpoints in the data, the envoy and the firstborn are not fighters. */
const MAY_NOT_STRIKE = ['goblin_wolf', 'mortar', 'envoy', 'firstborn'];
const immune = DB.enemies.rows.filter(r => (r.immune || []).indexOf('Fatigue') >= 0 && !BA.refused[r.id]).map(r => r.id), mute = [];
immune.forEach(id => {
  try { ctx.setSeed(7); F.setup({ auto: true, formation: null, party: Array(6).fill(id) }); let k = 0;
    hardy();
    while (!F.S.over && k < STEP_CAP) { F.aiStep(F.current()); k++; }
    if (!F.S.log.some(ev => ev.t === 'attack' && ev.id[0] === 'e')) mute.push(id);
  } catch (err) { mute.push(id + ' (' + err.message.slice(0, 40) + ')'); }
});
const silentBad = silent.concat(mute).filter(id => MAY_NOT_STRIKE.indexOf(id.split(' ')[0]) < 0);
leg(silentBad.length === 0, '*** THE FATIGUE-IMMUNE STRIKE: every armed kind and all ' + immune.length + ' fatigue-immune kinds swing in a fight of six (was 20 of 31 silent) ***',
  'silent: ' + silentBad.join(', '));
/* the fight's own data files: the bite table matches the archive, and every row cites its page */
leg(BA.rows.length > 0 && BA.rows.every(r => /PAGES_ALL\.tar\.gz:bb_all\//.test(r.source) && typeof r.damage_min === 'number' && r.skills[0].ap > 0),
  'every bite row cites its wiki page and carries its damage and AP', BA.rows.length + ' rows');
const chk = require('child_process').spawnSync('python3', [path.join(ROOT, 'tools/bohemia_combat_beast_attacks.py'), '--check'], { encoding: 'utf8' });
leg(chk.status === 0, 'the bite table is exactly what the wiki archive gives (tools/bohemia_combat_beast_attacks.py --check)', (chk.stdout || chk.stderr || '').trim().slice(0, 90));
const dw = BA.rows.find(r => r.id === BA.by_enemy.direwolf.attack);
leg(dw && dw.damage_min === 30 && dw.damage_max === 50 && dw.armor_damage_pct === 70 && dw.armor_ignore_pct === 20 && dw.skills[0].ap === 4 && dw.skills[0].fatigue === 6,
  'the dire wolf bites as the page says: 30-50, 70% armour, 20% direct, 4 AP, 6 fatigue', dw && JSON.stringify([dw.damage_min, dw.damage_max, dw.armor_damage_pct, dw.armor_ignore_pct, dw.skills[0].ap]));

/* the table for TUNING is written only when asked (--write), so a suite run never churns a tracked file (PLUMBER 10/9) */
if (process.argv.indexOf('--write') >= 0) fs.writeFileSync(path.join(ROOT, 'records/target/BOHEMIA_COMBAT_THE_WHOLE_GRID_HOLDS.json'), JSON.stringify({
  _about: 'COMBAT [the fight holds the grid] (rule 117(e)): every cell TUNING has to test, played on the live fight\'s rules, AUTO both sides, ' + SEEDS.length + ' seeds a cell. '
    + 'HOLDS means it builds, places, ends; won / rounds / minutes are what two seeds did, NOT a difficulty: DRAFT, THE GEAR IS NOT IN (rule 117(e)). TUNING owns the grid\'s numbers.',
  _built_by: 'gates/the_fight_holds_the_whole_grid_gate.js', draft: true,
  gear: GEAR.map(g => ({ id: g.id, enemy_day: g.days, your_body: g.body || 'the place\'s starting kit', your_head: g.head || 'the place\'s starting kit', your_level: g.id === 'early' ? 1 : g.id === 'middle' ? 3 : 6 })),
  cells: cells
}, null, 1) + '\n');

/* the glass */
(async () => {
  if (process.argv.indexOf('--no-glass') < 0) {
    const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
    const opts = { seed: 12, kind: 'suburb', deploy: false, night: false, company: company(14, GEAR[0]), cap: 14, party: { faction: 'beasts', count: 40, days: 1 } };
    const arm = 'window.FIGHT_OPTS=' + JSON.stringify(opts) + ';window.__beast=0;window.__err=[];addEventListener("error",function(e){window.__err.push(String(e.message));});'
      + '(function(){const P=CanvasRenderingContext2D.prototype,di=P.drawImage;P.drawImage=function(img){if(this.canvas&&this.canvas.id==="cv"&&img&&img.src&&img.src.indexOf("fight_beasts")>=0)window.__beast++;return di.apply(this,arguments);};})();';
    const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: arm });
    const p = d.page, errs = [];
    p.on('pageerror', e => errs.push(String(e.message)));
    let up = false; const tt = Date.now();
    while (Date.now() - tt < 40000 && !(up = await p.evaluate(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board && document.getElementById('load').style.display === 'none'))) await p.waitForTimeout(150);
    leg(up, 'the glass: 14 against 40 dire wolves loads on his phone\'s profile');
    if (up) {
      await p.waitForTimeout(800);
      const g = await p.evaluate(() => { const before = window.__beast; draw(performance.now()); return { you: FIGHT.alive('you').length, them: FIGHT.alive('them').length,
        drawnOneFrame: window.__beast - before, shown: FIGHT.S.units.filter(u => u.beast && FIGHT.onField(u) && FIGHT.shown(u)).length, framed: allFramed(), strip: document.querySelectorAll('#order canvas').length, name: (FIGHT.S.units.find(u => u.beast) || {}).name }; });
      /* the fight's fog (Battle Brothers': a man you cannot see is not drawn): every beast your men can see is drawn, once a frame */
      leg(g.you === 14 && g.them === 40 && g.shown > 0 && g.drawnOneFrame === g.shown, '*** THE GLASS: all 54 on the board, every beast your men can see drawn from ANIMATION\'s beast sheet in one frame ***', JSON.stringify(g));
      leg(g.framed, 'both teams framed at the open, no swipe (rule 104a), with 54 on the board');
      await p.evaluate(() => { FIGHT_UI.auto = true; FIGHT_UI.speed = 6; });
      await p.waitForTimeout(6000);
      const r = await p.evaluate(() => ({ bites: FIGHT.S.log.filter(e => e.t === 'attack' && FIGHT.byId(e.id).beast).length, round: FIGHT.S.round, err: window.__err }));
      leg(errs.length === 0 && r.err.length === 0, 'no page error while the pack plays on AUTO', errs.concat(r.err).slice(0, 2).join(' | '));
      leg(r.bites > 0, 'on the glass the pack bites', r.bites + ' bites by round ' + r.round);
    }
    await d.close();
  }
  console.log('=== THE FIGHT HOLDS THE WHOLE GRID GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
