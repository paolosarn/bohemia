/* ARMORY 3 PROOF (Paolo 11/27, VAMILY rules 489(b) and 490, ask rows 758, 762, 763). The new guns and the drone met where a player
   meets them: the shipped fight page at phone size (390 by 844) through the one driver (tools/bohemia_drive_the_demo.js), the fight's
   own strike, its own drawing, nothing staged but who stands where:
     BURST    his man with the Guard Carbine, a brigand three houses off: one press, three rounds, three rolls (armory3_burst.jpg)
     BELT     his man with the Belt-Fed SAW, three brigands across the line: the traverse lit before he fires, then the belt (armory3_belt_*.png)
     ROCKET   his man with the Rocket Launcher, three brigands round one house: the blast lit, then the blast (armory3_rocket_*.png)
     DRONE    THEIR operator sends a charge drone at his men: the cross lit, the drone hanging over it, his shotgun man's SHOOT THE
              DRONE square on his bar; then a man who stays on the cross when it lands (armory3_drone_*.png)
     MINE     his own operator sends one at a knot of theirs (armory3_drone_mine.jpg)
     SPOT     his scout drone up: SPOTTED (armory3_spot.jpg)
   node tools/bohemia_armory_three_proof.js    (writes records/target/armory/armory3_proof.json) */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.dirname(__dirname), OUT = path.join(ROOT, 'records/target/armory');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
fs.mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function until(p, fn, arg, ms) { const t0 = Date.now(); while (Date.now() - t0 < ms) { try { if (await p.evaluate(fn, arg)) return true; } catch (e) {} await sleep(250); } return false; }
const proof = { at: new Date().toISOString() };
const man = (id, i, body) => ({ name: ['YOU', 'DESI', 'RAMON'][i], main: i === 0, background: 'sellsword', level: 4, perks: [], marks: [], gear: { main: id, off: null, body: body || 'riot_gear_jacket', head: 'football_helmet', bag: [null, null] } });

async function fight(company, count) {
  const arm = 'window.FIGHT_OPTS = ' + JSON.stringify({ seed: 11, speed: 1, auto: false, deploy: false, teach: false, company, party: { faction: 'brigands', count: count || 4, days: 1 } }) + ';';
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm }), p = d.page;
  await until(p, () => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.units && FIGHT.S.units.length > 1 && !FIGHT.S.deploy, null, 60000);
  await sleep(2500);
  /* to his first turn; their men stood where each scene says, on open ground at his level */
  await p.evaluate(() => { for (let g = 0; g < 400 && FIGHT.current() && FIGHT.current().side !== 'you' && !FIGHT.S.over; g++) FIGHT.aiStep(FIGHT.current()); try { take(); } catch (e) {} });
  await until(p, () => !(UI.anim && UI.anim.length), null, 20000);
  return d;
}
/* stand them: offsets from his man (a), their men's tiles; the rest of theirs far off. Returns false when the ground will not take it */
async function stand(p, offs, mine) {
  return p.evaluate(([offs, mine]) => {
    const S = FIGHT.S, a = FIGHT.current(), them = S.units.filter(u => u.side === 'them' && FIGHT.onField(u)), ours = S.units.filter(u => u.side === 'you' && FIGHT.onField(u) && u !== a);
    const lv = FIGHT.level(a.x, a.y), taken = new Set();
    const free = (x, y) => x >= 0 && y >= 0 && x < S.w && y < S.h && FIGHT._t.passable(x, y) && FIGHT.level(x, y) === lv && !taken.has(x + ',' + y) && !S.units.some(u => FIGHT.onField(u) && u.x === x && u.y === y && u !== a);
    /* the room: a tile of his from which every offset is free */
    const tryAt = (ax, ay) => offs.concat(mine || []).every(o => { const x = ax + o[0], y = ay + o[1]; return x >= 0 && y >= 0 && x < S.w && y < S.h && FIGHT._t.passable(x, y) && FIGHT.level(x, y) === FIGHT.level(ax, ay) && !(o[0] === 0 && o[1] === 0); });
    let spot = null;
    for (let r = 0; r < 12 && !spot; r++) for (let dy = -r; dy <= r && !spot; dy++) for (let dx = -r; dx <= r && !spot; dx++) { const x = a.x + dx, y = a.y + dy; if (x >= 0 && y >= 0 && x < S.w && y < S.h && FIGHT._t.passable(x, y) && tryAt(x, y)) spot = { x, y }; }
    if (!spot) return { ok: false };
    const park = [];
    for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) if (Math.max(Math.abs(x - spot.x), Math.abs(y - spot.y)) >= 8 && FIGHT._t.passable(x, y)) park.push({ x, y });
    S.units.filter(u => FIGHT.onField(u) && u !== a).forEach((u, i) => { const q = park[(i * 7) % park.length]; u.x = q.x; u.y = q.y; });
    a.x = spot.x; a.y = spot.y; taken.add(a.x + ',' + a.y);
    them.slice(0, offs.length).forEach((t, i) => { t.x = a.x + offs[i][0]; t.y = a.y + offs[i][1]; t.hp = Math.max(t.hp, 60); taken.add(t.x + ',' + t.y); try { FIGHT.S.seen && (FIGHT.S.seen[t.id] = true); } catch (e) {} });
    (mine || []).forEach((o, i) => { const u = ours[i]; if (u) { u.x = a.x + o[0]; u.y = a.y + o[1]; } });
    a.ap = a.apTurn; a.fat = 0;
    UI.zoom = Math.max(UI.zoom, UI.far * 1.5); const q = aimAt(a.x + 2, a.y); UI.cx = q[0]; UI.cy = q[1];
    try { hud(); } catch (e) {}
    return { ok: true, a: [a.x, a.y], them: them.slice(0, offs.length).map(t => [t.x, t.y]) };
  }, [offs, mine || null]);
}
async function hold(p, frac) {
  await p.evaluate(frac => { clearInterval(window.__hold); window.__hold = setInterval(() => { const n = performance.now(), B = beatMs();
    (UI.anim || []).forEach(an => { if (an.k === 'attack' && an.at !== undefined) an.at = n - an.dur * frac; });
    (UI.booms || []).forEach(b => { b.at = n - B * 0.4; }); }, 4); }, frac);
  await sleep(450);
}
async function free(p) { await p.evaluate(() => clearInterval(window.__hold)); }

async function burst() {
  const d = await fight([man('guard_carbine', 0)]), p = d.page, out = {};
  out.stand = await stand(p, [[3, 0]]);
  out.press = await p.evaluate(() => { const S = FIGHT.S, a = FIGHT.current(), t = S.units.find(u => u.side === 'them' && FIGHT.onField(u) && Math.abs(u.x - a.x) === 3 && u.y === a.y);
    const n0 = S.log.length, am = a.ammo, q = FIGHT.strike(a, t); try { take(); } catch (e) {}
    return { skill: FIGHT.strikeSkill(a.weapon).name, burst: FIGHT.burstOf(a.weapon), rounds: am + ' -> ' + a.ammo, rolls: S.log.slice(n0).filter(e => e.t === 'attack').map(e => (e.hit ? 'hit ' + e.hp : 'miss') + ' ' + e.chance + '%' + (e.burst ? ' (round ' + (e.burst + 1) + ')' : '')) }; });
  await hold(p, 0.6); await p.screenshot({ path: path.join(OUT, 'armory3_burst.jpg'), type: 'jpeg', quality: 82 }); await free(p);
  out.errs = d.errs || []; await d.close(); return out;
}
async function belt() {
  const d = await fight([man('belt_fed', 0)]), p = d.page, out = {};
  out.stand = await stand(p, [[3, -1], [3, 0], [3, 1]]);
  out.lit = await p.evaluate(() => { const S = FIGHT.S, a = FIGHT.current(), t = S.units.find(u => u.side === 'them' && FIGHT.onField(u) && u.x === a.x + 3 && u.y === a.y);
    UI.pend = { target: t }; try { hud(); } catch (e) {} return true; });
  await sleep(700);
  out.litTiles = await p.evaluate(() => JSON.parse(JSON.stringify(UI.shapeLit || null)));
  await p.screenshot({ path: path.join(OUT, 'armory3_belt_lit.jpg'), type: 'jpeg', quality: 82 });
  out.press = await p.evaluate(() => { const S = FIGHT.S, a = FIGHT.current(), t = S.units.find(u => u.side === 'them' && FIGHT.onField(u) && u.x === a.x + 3 && u.y === a.y);
    UI.pend = null; const n0 = S.log.length, am = a.ammo, q = FIGHT.strike(a, t); try { take(); } catch (e) {}
    return { skill: FIGHT.strikeSkill(a.weapon).name, rounds: am + ' -> ' + a.ammo, rolls: S.log.slice(n0).filter(e => e.t === 'attack').map(e => e.to + ' ' + (e.hit ? 'hit ' + e.hp : 'miss')) }; });
  await hold(p, 0.55); await p.screenshot({ path: path.join(OUT, 'armory3_belt.jpg'), type: 'jpeg', quality: 82 }); await free(p);
  out.errs = d.errs || []; await d.close(); return out;
}
async function rocket() {
  const d = await fight([man('rocket_launcher', 0)]), p = d.page, out = {};
  out.stand = await stand(p, [[4, 0], [4, 1], [5, -1]]);
  await p.evaluate(() => { const S = FIGHT.S, a = FIGHT.current(), t = S.units.find(u => u.side === 'them' && FIGHT.onField(u) && u.x === a.x + 4 && u.y === a.y); UI.pend = { target: t }; try { hud(); } catch (e) {} });
  await sleep(700); out.litTiles = await p.evaluate(() => JSON.parse(JSON.stringify(UI.shapeLit || null)));
  await p.screenshot({ path: path.join(OUT, 'armory3_rocket_lit.jpg'), type: 'jpeg', quality: 82 });
  out.press = await p.evaluate(() => { const S = FIGHT.S, a = FIGHT.current(), t = S.units.find(u => u.side === 'them' && FIGHT.onField(u) && u.x === a.x + 4 && u.y === a.y);
    UI.pend = null; const n0 = S.log.length, q = FIGHT.strike(a, t); try { take(); } catch (e) {}
    return { skill: FIGHT.strikeSkill(a.weapon).name, rolls: S.log.slice(n0).filter(e => e.t === 'attack').map(e => e.to + ' ' + (e.hit ? 'hit ' + e.hp : 'miss')) }; });
  await sleep(200); await hold(p, 0.62); await p.screenshot({ path: path.join(OUT, 'armory3_rocket.jpg'), type: 'jpeg', quality: 82 }); await free(p);
  out.errs = d.errs || []; await d.close(); return out;
}
/* THEIR operator: one of theirs handed the charge drone kit (BESTIARY 2 gives the role its men); his shotgun man and DESI on the cross */
async function drone() {
  const d = await fight([man('kalash', 0, 'football_pads'), man('auto_shotgun', 1)]), p = d.page, out = {};
  out.stand = await stand(p, [[5, 0]], [[0, 1]]);
  out.launch = await p.evaluate(() => {
    const S = FIGHT.S, a = FIGHT.current(), op = S.units.find(u => u.side === 'them' && FIGHT.onField(u) && u.x === a.x + 5 && u.y === a.y);
    const w = FIGHT._t.weaponRow ? FIGHT._t.weaponRow('charge_drone') : DB.weapons.rows.find(r => r.id === 'charge_drone');
    op.weapon = w; op.ammo = 2; op.loaded = true; op.ap = op.apTurn; op.fat = 0; op.morale = 'Steady';
    /* his turn waits while theirs takes one: the operator's turn put in front of his in the order (his own later turn stays) */
    S.order.splice(S.idx, 0, op.id); op.begun = true;
    const n0 = S.log.length; FIGHT.aiStep(op); try { take(); } catch (e) {}
    const ev = S.log.slice(n0).filter(e => e.t === 'skill').map(e => e.skill), dr = (S.drones || [])[0];
    try { FIGHT.endTurn(op); } catch (e) {}
    a.ap = a.apTurn; a.fat = 0; try { take(); hud(); } catch (e) {}
    return { ev, drone: dr ? { x: dr.x, y: dr.y, on: S.units.filter(u => FIGHT.onField(u) && FIGHT.onCross(u, dr)).map(u => u.name) } : null };
  });
  await until(p, () => !(UI.anim && UI.anim.length), null, 8000); await sleep(1200);
  out.square = await p.evaluate(() => { let err = null; try { hud(); } catch (e) { err = String(e); } const b = document.querySelector('button[data-skill="shoot_drone"]'), u = FIGHT.current(), d = (FIGHT.S.drones || [])[0];
    return b ? { text: b.textContent, title: b.title } : { none: true, err, cur: u && u.name, can: !!(u && d && FIGHT.canShootDrone(u, d)), drones: (FIGHT.S.drones || []).length, ap: u && u.ap, ammo: u && u.ammo, rounds: u && u.rounds }; });
  out.drawn = await p.evaluate(() => { const r = {}; try { drawDroneGround(performance.now()); r.ground = 'ok'; } catch (e) { r.ground = String(e); } try { drawDrones(performance.now()); r.air = 'ok'; } catch (e) { r.air = String(e); }
    r.fly = JSON.stringify(UI.droneFly || null); r.drones = JSON.stringify(FIGHT.S.drones); return r; });
  await sleep(300); await p.screenshot({ path: path.join(OUT, 'armory3_drone_lit.jpg'), type: 'jpeg', quality: 82 });
  /* he stays; DESI stays: the operator's next turn opens and it lands */
  out.lands = await p.evaluate(() => {
    const S = FIGHT.S, dr = (S.drones || [])[0]; if (!dr) return null; const op = FIGHT.byId(dr.by);
    const on = S.units.filter(u => FIGHT.onField(u) && FIGHT.onCross(u, dr)).map(u => ({ name: u.name, hp: u.hp, armour: u.armB }));
    S.order.splice(S.idx, 0, op.id); op.begun = true; const n0 = S.log.length; FIGHT.beginTurn ? FIGHT.beginTurn(op) : FIGHT._t.beginTurn(op); try { take(); } catch (e) {}
    return { before: on, after: on.map(o => { const u = S.units.find(v => v.name === o.name); return { name: o.name, hp: u.hp, dead: !!u.dead, down: !!u.down }; }), ev: S.log.slice(n0).filter(e => e.t === 'skill' || e.t === 'attack').map(e => e.t + ':' + (e.skill || '')) };
  });
  await sleep(150); await hold(p, 0.5); await p.screenshot({ path: path.join(OUT, 'armory3_drone_lands.jpg'), type: 'jpeg', quality: 82 }); await free(p);
  out.errs = d.errs || []; await d.close(); return out;
}
async function mine() {
  const d = await fight([man('charge_drone', 0)]), p = d.page, out = {};
  out.stand = await stand(p, [[5, 0], [5, 1], [6, 0]]);
  out.launch = await p.evaluate(() => { const S = FIGHT.S, a = FIGHT.current(), t = S.units.find(u => u.side === 'them' && FIGHT.onField(u) && u.x === a.x + 5 && u.y === a.y);
    const n0 = S.log.length, q = FIGHT.strike(a, t); try { take(); } catch (e) {}
    return { q, ev: S.log.slice(n0).map(e => e.t + ':' + (e.skill || '')), on: (S.drones || []).map(dr => S.units.filter(u => FIGHT.onField(u) && FIGHT.onCross(u, dr)).length) }; });
  await sleep(2200); await p.screenshot({ path: path.join(OUT, 'armory3_drone_mine.jpg'), type: 'jpeg', quality: 82 });
  out.errs = d.errs || []; await d.close(); return out;
}
async function spot() {
  const d = await fight([man('scout_drone', 0), man('ranch_ar', 1)]), p = d.page, out = {};
  out.stand = await stand(p, [[6, 0]]);
  out.spot = await p.evaluate(() => { const S = FIGHT.S, a = FIGHT.current(), t = S.units.find(u => u.side === 'them' && FIGHT.onField(u) && u.x === a.x + 6);
    const n0 = S.log.length; FIGHT.strike(a, t); try { take(); } catch (e) {}
    return { ev: S.log.slice(n0).map(e => e.t + ':' + (e.skill || '')), spotted: FIGHT.spotted('you'), seesAll: S.units.filter(u => u.side === 'them' && FIGHT.onField(u)).every(u => FIGHT.sideSees('you', u)) }; });
  await sleep(700); await p.screenshot({ path: path.join(OUT, 'armory3_spot.jpg'), type: 'jpeg', quality: 82 });
  out.errs = d.errs || []; await d.close(); return out;
}

/* ROUND TWO: his man at fight size holding each piece, cut round him, one sheet (armory3_hands.jpg); his own drone picked by hand,
   its cross lit before the tap (armory3_cross_lit.jpg) */
async function hands() {
  const d = await fight([man('ranch_ar', 0)]), p = d.page, out = { cells: [] };
  out.stand = await stand(p, [[6, 0]]);
  const ids = await p.evaluate(() => DB.weapons.rows.filter(r => r.armory && (r.armory.fire || r.armory.worn_of || r.id === 'pipe_shotgun')).map(r => r.id));
  const shots = [];
  for (const id of ids) {
    const box = await p.evaluate(id => { const a = FIGHT.current(), w = DB.weapons.rows.find(r => r.id === id); const ps = FIGHT._t.pistolShot(w); a.weapon = ps || w; a.job = FIGHT.jobOfWeapon(a.weapon); a._face = 2;
      UI.zoom = Math.max(UI.zoom, UI.far * 2.2); const q = aimAt(a.x, a.y); UI.cx = q[0]; UI.cy = q[1]; try { hud(); } catch (e) {}
      const B = manBox(a.x, a.y), h = manH(); return { x: Math.max(0, Math.round(B.x - h * 0.75)), y: Math.max(0, Math.round(B.head - h * 0.15)), width: Math.round(h * 1.5), height: Math.round(h * 1.25) }; }, id);
    await sleep(450);
    const f = path.join(OUT, 'hand_' + id + '.png'); await p.screenshot({ path: f, clip: box }); shots.push({ id, f });
    out.cells.push({ id, drawn: await p.evaluate(id => Object.keys(UI.clipSeen || {}).filter(k => /^gun:/.test(k)), id) });
  }
  out.ids = ids; out.errs = d.errs || []; await d.close();
  fs.writeFileSync(path.join(OUT, 'hands_list.json'), JSON.stringify(shots.map(s => s.id)));
  return out;
}
async function cross() {
  const d = await fight([man('charge_drone', 0)]), p = d.page, out = {};
  out.stand = await stand(p, [[5, 0], [5, 1]]);
  await p.evaluate(() => { const S = FIGHT.S, a = FIGHT.current(), t = S.units.find(u => u.side === 'them' && FIGHT.onField(u) && u.x === a.x + 5 && u.y === a.y); UI.pend = { target: t }; try { hud(); } catch (e) {} });
  await sleep(800); out.lit = await p.evaluate(() => JSON.parse(JSON.stringify(UI.shapeLit || null)));
  await p.screenshot({ path: path.join(OUT, 'armory3_cross_lit.jpg'), type: 'jpeg', quality: 82 });
  out.errs = d.errs || []; await d.close(); return out;
}

/* ROUND THREE (rule 493(c)): a boss holding his named prize on the real page, cut round him (armory3_boss_<name>.jpg) */
async function bossHolds(B, file) {
  const arm = 'window.FIGHT_OPTS = ' + JSON.stringify({ seed: 5, speed: 1, auto: false, deploy: false, teach: false, company: [man('kalash', 0)], boss: B, party: { faction: 'brigands', band: [B.kind, 'brigand_thug', 'brigand_thug'], days: 20 } }) + ';';
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm }), p = d.page, out = {};
  await until(p, () => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.units && FIGHT.S.units.length > 1 && !FIGHT.S.deploy, null, 60000);
  await sleep(2500);
  await p.evaluate(() => { for (let g = 0; g < 400 && FIGHT.current() && FIGHT.current().side !== 'you' && !FIGHT.S.over; g++) FIGHT.aiStep(FIGHT.current()); try { take(); } catch (e) {} });
  await until(p, () => !(UI.anim && UI.anim.length), null, 20000); await sleep(6000);   /* his entrance played (BOSSES' THE BOSS ARRIVES) */
  const box = await p.evaluate(() => { const S = FIGHT.S, b = S.units.find(u => u.boss); if (!b) return null; b._face = 2;
    UI.zoom = Math.max(UI.zoom, UI.far * 1.8); const q = aimAt(b.x, b.y); UI.cx = q[0]; UI.cy = q[1]; try { hud(); } catch (e) {}
    const M = manBox(b.x, b.y), h = manH(); return { box: { x: Math.max(0, Math.round(M.x - h * 0.9)), y: Math.max(0, Math.round(M.head - h * 0.35)), width: Math.round(h * 1.8), height: Math.round(h * 1.5) }, name: b.name, weapon: b.weapon && b.weapon.name, named: !!(b.weapon && (b.weapon.of || b.weapon).named) }; });
  out.boss = box && { name: box.name, weapon: box.weapon, named: box.named };
  await sleep(700);
  if (box) await p.screenshot({ path: path.join(OUT, file), clip: box.box, type: 'jpeg', quality: 85 });
  out.errs = d.errs || []; await d.close(); return out;
}
async function bosses() {
  return { smith: await bossHolds({ kind: 'knight', name: 'THE SMITH', weapon: 'The Last Hammer', hp_x: 2 }, 'armory3_boss_smith.jpg'),
           lens: await bossHolds({ kind: 'arbalester', name: 'THE LENS', weapon: 'The Ground-Glass Rifle', hp_x: 2 }, 'armory3_boss_lens.jpg') };
}

(async () => {
  const only = process.env.ONLY ? process.env.ONLY.split(',') : null, want = k => !only || only.indexOf(k) >= 0;
  for (const [k, f] of [['burst', burst], ['belt', belt], ['rocket', rocket], ['drone', drone], ['mine', mine], ['spot', spot], ['hands', hands], ['cross', cross], ['bosses', bosses]]) {
    if (!want(k)) continue;
    try { proof[k] = await f(); } catch (e) { proof[k] = { crashed: String(e && e.stack || e).slice(0, 400) }; }
    console.log(k + ': ' + JSON.stringify(proof[k]).slice(0, 900));
  }
  fs.writeFileSync(path.join(OUT, 'armory3_proof.json'), JSON.stringify(proof, null, 1));
})().catch(e => { console.error(e); process.exit(1); });
