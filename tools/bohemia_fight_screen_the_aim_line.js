#!/usr/bin/env node
/* ============================================================================
   FIGHT SCREEN 4: THE NEW GUNS ON THE AIM LINE (VAMILY rule 482: 'the new guns and drones on the fight screen reading clear and punchy';
   ARMORY 3's guns, rule 489). The shipped fight page at phone size through the one driver (tools/bohemia_drive_the_demo.js), his man
   handed each new piece, theirs stood where its shot reaches, a finger on the man aimed at (UI.pend, the door a tap uses), and the aim
   line (#say) read off the glass, with a still each:
     BURST   the Guard Carbine (3 a press) at a man 3 houses off; the Box SMG (4) at 2
     BELT    the Belt-Fed (the traverse) at three men across the line
     ROCKET  the Rocket Launcher at three men round one house
     CONE    the double shotgun at a man with two behind him
     PLAIN   a semi-auto (the Ranch AR) at one man: the control
   For each: the lines, every line whole on the glass (nothing cut, nothing off), the type size.
   node tools/bohemia_fight_screen_the_aim_line.js <upright|sideways> <outdir>      BEFORE=1: the fight page as HEAD had it; AIM_PLANT=1: the
   shapes file's aim words taken out
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const ROOT = path.dirname(__dirname), WAY = process.argv[2] || 'upright', OUT = process.argv[3] || '/tmp/aim_line';
fs.mkdirSync(path.join(OUT, 'shots'), { recursive: true });
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function until(p, fn, arg, ms) { const t0 = Date.now(); while (Date.now() - t0 < ms) { try { if (await p.evaluate(fn, arg)) return true; } catch (e) {} await sleep(250); } return false; }
let serve = undefined;
/* AIM_PLANT=1: the aim words taken out of the shapes file (no 'aim', no row's 'aim'): the line falls back to the old words */
if (process.env.AIM_PLANT) { const tmp = path.join(OUT, 'plant'); fs.mkdirSync(tmp, { recursive: true }); const D = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/weapon_shapes.json'), 'utf8'));
  delete D.aim; D.rows.forEach(r => { delete r.aim; }); const f = path.join(tmp, 'weapon_shapes.json'); fs.writeFileSync(f, JSON.stringify(D)); serve = { '/records/target/bb/weapon_shapes.json': f }; }
if (process.env.BEFORE) { const tmp = path.join(OUT, 'before'); fs.mkdirSync(tmp, { recursive: true });
  const f = path.join(tmp, 'BOHEMIA_FIGHT.html'); fs.writeFileSync(f, execSync('git show HEAD:slices/BOHEMIA_FIGHT.html', { cwd: ROOT, maxBuffer: 1 << 28 }));
  serve = { '/slices/BOHEMIA_FIGHT.html': f }; }
const man = (id, i) => ({ name: ['YOU', 'DESI', 'RAMON'][i], main: i === 0, background: 'sellsword', level: 4, perks: [], marks: [], gear: { main: id, off: null, body: 'riot_gear_jacket', head: 'football_helmet' } });
async function fight(gun) {
  const arm = 'window.FIGHT_OPTS = ' + JSON.stringify({ seed: 11, speed: 1, auto: false, deploy: false, teach: false, company: [man(gun, 0)], party: { faction: 'brigands', count: 4, days: 1 } }) + ';';
  const o = { file: 'BOHEMIA_FIGHT.html', bare: true, arm, profile: WAY === 'sideways' ? 'phone_landscape' : 'phone_portrait' }; if (serve) o.serve = serve;
  const d = await open(o), p = d.page;
  await until(p, () => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.units && FIGHT.S.units.length > 1 && !FIGHT.S.deploy, null, 60000);
  await sleep(2500);
  await p.evaluate(() => { for (let g = 0; g < 400 && FIGHT.current() && FIGHT.current().side !== 'you' && !FIGHT.S.over; g++) FIGHT.aiStep(FIGHT.current()); try { take(); } catch (e) {} });
  await until(p, () => !(UI.anim && UI.anim.length), null, 20000);
  return d;
}
/* theirs stood at offsets from his man, the rest parked far off, all at his level on open ground; then a finger on the first */
async function aim(p, offs) {
  return p.evaluate((offs) => {
    const S = FIGHT.S, a = FIGHT.current(), them = S.units.filter(u => u.side === 'them' && FIGHT.onField(u));
    if (!a || a.side !== 'you') return { ok: false, why: 'not his turn' };
    const fits = (ax, ay) => offs.every(o => { const x = ax + o[0], y = ay + o[1]; return x >= 0 && y >= 0 && x < S.w && y < S.h && FIGHT._t.passable(x, y) && FIGHT.level(x, y) === FIGHT.level(ax, ay); });
    let spot = null;
    for (let r = 0; r < 14 && !spot; r++) for (let dy = -r; dy <= r && !spot; dy++) for (let dx = -r; dx <= r && !spot; dx++) { const x = a.x + dx, y = a.y + dy; if (x >= 0 && y >= 0 && x < S.w && y < S.h && FIGHT._t.passable(x, y) && fits(x, y)) spot = { x, y }; }
    if (!spot) return { ok: false, why: 'no ground' };
    const park = []; for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) if (Math.max(Math.abs(x - spot.x), Math.abs(y - spot.y)) >= 8 && FIGHT._t.passable(x, y)) park.push({ x, y });
    S.units.filter(u => FIGHT.onField(u) && u !== a).forEach((u, i) => { const q = park[(i * 7) % park.length]; u.x = q.x; u.y = q.y; });
    a.x = spot.x; a.y = spot.y; a.ap = a.apTurn; a.fat = 0;
    them.slice(0, offs.length).forEach((t, i) => { t.x = a.x + offs[i][0]; t.y = a.y + offs[i][1]; t.hp = Math.max(t.hp, 60); try { S.seen && (S.seen[t.id] = true); } catch (e) {} });
    UI.zoom = Math.max(UI.zoom, UI.far * 1.5); const q = aimAt(a.x + 2, a.y); UI.cx = q[0]; UI.cy = q[1];
    const t = them[0]; UI.pend = { target: t, pv: FIGHT.preview(a, t) }; try { aimSay(a, t); hud(); } catch (e) {}   /* the tap's own door (the fight's pick: UI.pend and aimSay) */
    return { ok: true, gun: a.weapon && a.weapon.name, burst: FIGHT.burstOf(a.weapon), skill: (FIGHT.blowSkill(a, t) || {}).name || null, foes: FIGHT.shapeFoes(a, t, FIGHT.blowSkill(a, t)).length };
  }, offs);
}
const READ = (p) => p.evaluate(() => { const e = document.getElementById('say'); if (!e || getComputedStyle(e).display === 'none') return { shown: false };
  const r = e.getBoundingClientRect(), lines = String(e.innerHTML).split(/<br\s*\/?>/i).map(h => { const d = document.createElement('div'); d.innerHTML = h; return d.textContent.trim(); }).filter(Boolean);
  const fs = [...e.querySelectorAll('*')].concat([e]).map(x => parseFloat(getComputedStyle(x).fontSize)).filter(n => n > 0);
  return { shown: true, lines, box: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], onGlass: r.left >= -1 && r.top >= -1 && r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1,
    cut: e.scrollHeight > e.clientHeight + 2 || e.scrollWidth > e.clientWidth + 2, smallest: Math.min.apply(null, fs) }; });
const SCENES = [
  ['burst', 'guard_carbine', [[3, 0]]],
  ['smg', 'box_smg', [[2, 0]]],
  ['belt', 'belt_fed', [[3, 0], [3, -1], [3, 1]]],
  ['rocket', 'rocket_launcher', [[4, 0], [4, 1], [5, -1]]],
  ['cone', 'double_shotgun', [[1, 0], [2, 0], [2, 1]]],
  ['plain', 'ranch_ar', [[3, 0]]]
];
(async () => {
  const T = { way: WAY, before: !!process.env.BEFORE, plant: !!process.env.AIM_PLANT, scenes: {} };
  for (const [k, gun, offs] of SCENES) {
    let d = null;
    try { d = await fight(gun); const p = d.page; const A = await aim(p, offs); await sleep(800);
      const R = await READ(p); await p.screenshot({ path: path.join(OUT, 'shots', k + '.png') });
      T.scenes[k] = Object.assign({ gun: gun }, A, { say: R, errs: d.errs || [] });
      console.log(k, JSON.stringify(T.scenes[k]).slice(0, 600));
    } catch (e) { T.scenes[k] = { err: String(e).slice(0, 300) }; console.log(k, 'ERR', String(e).slice(0, 200)); }
    try { if (d) await d.close(); } catch (e) {}
  }
  fs.writeFileSync(path.join(OUT, 'aim_line.json'), JSON.stringify(T, null, 1));
})().catch(e => { console.error(e); process.exit(1); });
