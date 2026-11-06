/* COOK [the golden pistol] PROOF (rule 408(b) and (d), DIRECTION part 3 row 11: a weapon is judged IN THE HAND, on the man, in the
   fight, all eight ways, beside the thug; the body never hides a shield; two things in two hands draw right). The shipped fight at
   phone size (390 by 844 at 3x) through the one driver (tools/bohemia_drive_the_demo.js), the six guns' proof's setup
   (tools/bohemia_cook_the_six_guns_proof_11_3_26.js):
     YOU and RAUL (another body: the shift) with the pistol (row dagger) and, in KIT 'door', their car door (YOU's own crew row:
     jobs pistol and car_door), in KIT 'bare' the pistol alone (the one-hand held clips); a brigand dressed as THE THUG (the bar
     piece, tier_thug, with his own pipe: his model carries it) one tile from YOU;
     TURN   YOU turned through the eight facings the fight draws (v._face 0..7), one frame each, at the fight's own zoom
     GROUP  the three men in one frame (YOU, RAUL, the thug) at the fight's zoom and at its open zoom
     SHOT   YOU's shot at the thug held at six points of its beat
   twice: BEFORE with the golden pistol's row switched off in the page only (the class pistol it was drawn as), AFTER as shipped.
   Counts what the fight drew (UI.clipSeen 'gun:dagger', and the shield's laid draws), so the picture is proved to be the new model.
   REFERENCE CHECK (the 9/4 standing law): WPN-01 the real Government Model; the twin of every AFTER frame is the same frame BEFORE;
   the thug in the frame is the bar piece (body_thug_S).
   node tools/bohemia_cook_the_golden_pistol_proof_11_6_26.js [door|bare ...] -> records/target/cook_golden_pistol/proof/, proof.json */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.dirname(__dirname), OUT = path.join(ROOT, 'records/target/cook_golden_pistol/proof');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
fs.mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function until(p, fn, arg, ms) { const t0 = Date.now(); while (Date.now() - t0 < ms) { try { if (await p.evaluate(fn, arg)) return true; } catch (e) {} await sleep(250); } return false; }

async function one(kit, mode) {
  const off = kit === 'door' || kit === 'night' ? 'wooden_shield' : null;   /* 'night': his own kit in the dark (the bible: every light has a source) */
  const man = (name, bg, main) => ({ name, main: !!main, background: bg, level: 3, perks: [], marks: [], gear: { main: 'dagger', off, body: null, head: null, bag: [null, null] } });
  const company = [man('YOU', 'sellsword', true), man('RAUL', 'brawler')];
  const arm = 'window.FIGHT_OPTS = ' + JSON.stringify({ seed: 7, speed: 1, auto: false, deploy: false, teach: false, company, party: { faction: 'brigands', count: 3, days: 1 } }) + ';';
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm }), p = d.page;
  await until(p, () => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.units && FIGHT.S.units.length > 2 && !FIGHT.S.deploy, null, 60000);
  await until(p, () => typeof OWNG !== 'undefined' && (ownGunMeta(), OWNG.state === 2), null, 20000);
  await sleep(2000);
  if (kit === 'night') await p.evaluate(() => { window.__night = true; });
  const set = await p.evaluate(mode => {
    if (window.__night) { FIGHT.S.night = true; }
    if (mode === 'before' && OWNG.meta) delete OWNG.meta.by_row.dagger;   /* the class pistol, as it was drawn until now; the six guns stay */
    UI.clipSeen = {};
    for (let g = 0; g < 400 && FIGHT.current() && FIGHT.current().side !== 'you' && !FIGHT.S.over; g++) FIGHT.aiStep(FIGHT.current());
    try { take(); } catch (e) {}
    const S = FIGHT.S, mine = S.units.filter(u => u.side === 'you' && FIGHT.onField(u)), a = mine.find(u => u.main) || mine[0], b = mine.find(u => u !== a);
    const them = S.units.filter(u => u.side === 'them' && FIGHT.onField(u)), t = them[0];
    if (!a || !b || !t) return { ok: false, why: 'no men' };
    const pipe = DB.weapons.rows.find(r => r.id === 'bludgeon'); if (pipe) t.weapon = pipe;   /* the thug's model carries his pipe */
    t.look = 'tier_thug'; try { rigLater('fight_rig/' + lookOf(t).file); } catch (e) {}   /* his sheet, asked for the way a late sheet is */
    const free = (x, y, but) => x >= 0 && y >= 0 && x < S.w && y < S.h && FIGHT._t.passable(x, y) && !S.units.some(u => FIGHT.onField(u) && but.indexOf(u) < 0 && u.x === x && u.y === y);
    let spot = null;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      if (!free(a.x + dx, a.y + dy, [t]) || FIGHT.level(a.x + dx, a.y + dy) !== FIGHT.level(a.x, a.y)) continue;
      const ox = t.x, oy = t.y; t.x = a.x + dx; t.y = a.y + dy; if (FIGHT.canStrike(a, t)) { spot = [dx, dy]; break; } t.x = ox; t.y = oy; }
    if (!spot) return { ok: false, why: 'no tile in reach' };
    /* RAUL beside YOU on the other side, the thug's other neighbours away */
    for (const [dx, dy] of [[-spot[0], -spot[1]], [spot[1], spot[0]], [-spot[1], -spot[0]]]) { if (free(a.x + dx, a.y + dy, [b])) { b.x = a.x + dx; b.y = a.y + dy; break; } }
    them.slice(1).forEach(o => { for (let r = 4; r < 12; r++) { const q = [[a.x - r, a.y], [a.x, a.y - r], [a.x + r, a.y + r], [a.x - r, a.y - r]].find(c => free(c[0], c[1], [o])); if (q) { o.x = q[0]; o.y = q[1]; break; } } });
    S.units.filter(u => u.side === 'you' && u !== a && u !== b && FIGHT.onField(u)).forEach(o => { for (let r = 5; r < 12; r++) { const q = [[a.x + r, a.y], [a.x, a.y + r]].find(c => free(c[0], c[1], [o])); if (q) { o.x = q[0]; o.y = q[1]; break; } } });
    a.ap = a.apTurn; a.fat = 0; t.hp = Math.max(t.hp, 400); t.hpMax = Math.max(t.hpMax || 0, 400);
    const open_ = UI.zoom; UI.zoom = Math.max(UI.zoom, UI.far * 4); const q = aimAt((a.x + t.x + b.x) / 3, (a.y + t.y + b.y) / 3); UI.cx = q[0]; UI.cy = q[1];
    window.__open = open_;
    return { ok: true, at: { you: [a.x, a.y], raul: [b.x, b.y], thug: [t.x, t.y] }, can: FIGHT.canStrike(a, t), row: (a.weapon.of || a.weapon).id, off: a.offhand ? (a.offhand.id || a.offhand.name) : (a.shield ? 'shield' : null), raul: lookOf(b) === lookOf(a) ? 'same look' : 'another look', thug: t.look, zoom: UI.zoom, open: open_ };
  }, mode);
  const out = { set, frames: [] };
  if (!set.ok) { out.errs = d.errs || []; await d.close(); return out; }
  await until(p, () => !(UI.anim && UI.anim.length), null, 20000);
  await until(p, () => !!UI.imgs['fight_rig/' + DB.rig.looks.tier_thug.file], null, 20000); await sleep(1500);
  const boxOf = (who) => p.evaluate(who => { const S = FIGHT.S, mine = S.units.filter(u => u.side === 'you' && FIGHT.onField(u)), a = mine.find(u => u.main) || mine[0];
    const t = S.units.find(u => u.side === 'them' && u.look === 'tier_thug'), b = mine.find(u => u !== a && Math.max(Math.abs(u.x - a.x), Math.abs(u.y - a.y)) <= 1);
    const ms = who === 'me' ? [a] : [a, t, b].filter(Boolean), Bx = ms.map(u => manBox(u.x, u.y)), h = manH();
    const x0 = Math.max(0, Math.min(...Bx.map(B => B.x)) - h * .75), x1 = Math.min(innerWidth, Math.max(...Bx.map(B => B.x)) + h * .75);
    const y0 = Math.max(0, Math.min(...Bx.map(B => B.head)) - h * .45), y1 = Math.min(innerHeight, Math.max(...Bx.map(B => B.head)) + h * 1.45);
    return { x: Math.round(x0), y: Math.round(y0), width: Math.round(x1 - x0), height: Math.round(y1 - y0), manH: Math.round(h) }; }, who);
  const me = await boxOf('me'), box = await boxOf('group'); out.box = box; out.me = me;
  for (let f = 0; f < 8; f++) {
    await p.evaluate(f => { const S = FIGHT.S, a = S.units.find(u => u.side === 'you' && u.main) || S.units.find(u => u.side === 'you'); clearInterval(window.__face); window.__face = setInterval(() => { a._face = f; }, 4); }, f);
    await sleep(300);
    const fn = kit + '_' + mode + '_turn' + f + '.png'; await p.screenshot({ path: path.join(OUT, fn), clip: me }); out.frames.push(fn);
  }
  await p.evaluate(() => clearInterval(window.__face));
  await sleep(300);
  { const fn = kit + '_' + mode + '_group.png'; await p.screenshot({ path: path.join(OUT, fn), clip: box }); out.frames.push(fn); }
  /* the whole phone at the fight's zoom (the surface he meets it on, upright, nothing cropped) */
  { const fn = kit + '_' + mode + '_phone.png'; await p.screenshot({ path: path.join(OUT, fn) }); out.frames.push(fn); }
  /* and at the fight's OPEN zoom, the smallest he ever sees his man, the whole phone and the group cut from it */
  out.openBox = await p.evaluate(() => { UI.zoom = window.__open; const S = FIGHT.S, a = S.units.find(u => u.side === 'you' && u.main);
    const q = aimAt(a.x, a.y); UI.cx = q[0]; UI.cy = q[1]; return { zoom: UI.zoom, manH: Math.round(manH()) }; });
  await sleep(700);
  { const fn = kit + '_' + mode + '_phone_open.png'; await p.screenshot({ path: path.join(OUT, fn) }); out.frames.push(fn); }
  { const ob = await boxOf('group'); out.openGroup = ob; const fn = kit + '_' + mode + '_group_open.png'; await p.screenshot({ path: path.join(OUT, fn), clip: ob }); out.frames.push(fn); }
  await p.evaluate(() => { UI.zoom = Math.max(window.__open, UI.far * 4); const S = FIGHT.S, a = S.units.find(u => u.side === 'you' && u.main), t = S.units.find(u => u.side === 'them' && u.look === 'tier_thug');
    const q = aimAt((a.x + t.x) / 2, (a.y + t.y) / 2); UI.cx = q[0]; UI.cy = q[1]; });
  await sleep(700);
  out.strike = await p.evaluate(() => { const S = FIGHT.S, a = S.units.find(u => u.side === 'you' && u.main), t = S.units.find(u => u.side === 'them' && u.look === 'tier_thug');
    UI.pend = null; const q = FIGHT.strike(a, t, { roll: 1, head: false }); try { take(); } catch (e) {}
    return { hit: q && q.hit }; });
  await sleep(60);
  for (let k = 0; k < 6; k++) {
    await p.evaluate(k => { window.__k = k; clearInterval(window.__hold); window.__hold = setInterval(() => {
      (UI.anim || []).forEach(an => { if (an.k === 'attack' && an.at) an.at = performance.now() - an.dur * (window.__k + .5) / 6; }); }, 4); }, k);
    await sleep(170);
    const fn = kit + '_' + mode + '_shot' + k + '.png'; await p.screenshot({ path: path.join(OUT, fn), clip: box }); out.frames.push(fn);
  }
  await p.evaluate(() => clearInterval(window.__hold));
  out.seen = await p.evaluate(() => { const o = {}; Object.keys(UI.clipSeen || {}).forEach(k => { if (/^(gun|hold|idle|melee|laid|shield)/.test(k) || /^(carry|carrywalk|aim)$/.test(k)) o[k] = UI.clipSeen[k]; }); return o; });
  out.errs = d.errs || [];
  await d.close();
  return out;
}

(async () => {
  const kits = process.argv.slice(2).length ? process.argv.slice(2) : ['door', 'bare'], pf = path.join(ROOT, 'records/target/cook_golden_pistol/proof.json');
  const proof = (() => { try { return JSON.parse(fs.readFileSync(pf)); } catch (e) { return {}; } })();
  for (const kit of kits) {
    proof[kit] = { at: new Date().toISOString() };
    for (const mode of ['before', 'after']) {
      const r = await one(kit, mode); proof[kit][mode] = r;
      console.log(kit, mode, JSON.stringify({ set: r.set, strike: r.strike, seen: r.seen, errs: (r.errs || []).length }));
    }
  }
  fs.writeFileSync(pf, JSON.stringify(proof, null, 1));
})().catch(e => { console.error(e); process.exit(1); });
