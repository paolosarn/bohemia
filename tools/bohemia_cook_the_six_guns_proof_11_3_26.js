/* COOK GUNS [the six guns] PROOF (rule 337, ask line 344). Each gun in YOU's hands where a player meets it, the shipped fight at
   phone size (390 by 844 at 3x) through the one driver (tools/bohemia_drive_the_demo.js), COOK WEAPONS' proof's setup copied
   (tools/bohemia_cook_every_weapon_its_own_proof_11_3_26.js): his man stood in reach of a brigand on his own turn, the brigand
   handed the same gun (another man, another body: the shift), then
     TURN   YOU standing with it, turned through the eight facings the fight draws (v._face 0..7), one frame each
     SHOT   the fight's own strike (FIGHT.strike) held at six points of its beat, both men in the frame
   twice: BEFORE with the own guns switched off in the page only (the class gun it was drawn as), AFTER as shipped.
   Counts what the fight drew (UI.clipSeen 'gun:<row>'), so the picture is proved to be the gun's own model.
   REFERENCE CHECK (the 9/4 standing law): the twin of every NOW frame is the same frame BEFORE, side by side on the card.
   node tools/bohemia_cook_the_six_guns_proof_11_3_26.js <row ...>   -> records/target/cook_six_guns/proof/<row>_<before|after>_*.png,
                                                                         records/target/cook_six_guns/proof.json */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.dirname(__dirname), OUT = path.join(ROOT, 'records/target/cook_six_guns/proof');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
fs.mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function until(p, fn, arg, ms) { const t0 = Date.now(); while (Date.now() - t0 < ms) { try { if (await p.evaluate(fn, arg)) return true; } catch (e) {} await sleep(250); } return false; }
const ALL = ['zip_gun', 'snub_revolver', 'lever_rifle', 'scoped_deer_rifle', 'sawed_off', 'pump_shotgun'];

async function one(id, mode) {
  const company = [{ name: 'YOU', main: true, background: 'sellsword', level: 3, perks: [], marks: [], gear: { main: id, off: null, body: null, head: null, bag: [null, null] } }];
  const arm = 'window.FIGHT_OPTS = ' + JSON.stringify({ seed: 7, speed: 1, auto: false, deploy: false, teach: false, company, party: { faction: 'brigands', count: 3, days: 1 } }) + ';';
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm }), p = d.page;
  await until(p, () => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.units && FIGHT.S.units.length > 1 && !FIGHT.S.deploy, null, 60000);
  await until(p, () => typeof OWNG !== 'undefined' && (ownGunMeta(), OWNG.state === 2), null, 20000);   /* the index in, both modes, so BEFORE can switch it off for good */
  await sleep(2000);
  const set = await p.evaluate(mode => {
    if (mode === 'before') { OWNG.state = 3; OWNG.meta = null; }
    UI.clipSeen = {};   /* count only what is drawn from here */
    for (let g = 0; g < 400 && FIGHT.current() && FIGHT.current().side !== 'you' && !FIGHT.S.over; g++) FIGHT.aiStep(FIGHT.current());
    try { take(); } catch (e) {}
    const S = FIGHT.S, a = S.units.find(u => u.side === 'you'), them = S.units.filter(u => u.side === 'them' && FIGHT.onField(u));
    const t = them[0]; if (!a || !t) return { ok: false, why: 'no men' };
    t.weapon = a.weapon;   /* another man holding the same gun: his own body, YOU's picture moved by his shift */
    const free = (x, y) => x >= 0 && y >= 0 && x < S.w && y < S.h && FIGHT._t.passable(x, y) && !S.units.some(u => FIGHT.onField(u) && u !== t && u.x === x && u.y === y);
    let spot = null;
    for (const dist of [1, 2]) { for (const [dx, dy] of [[dist, 0], [-dist, 0], [0, dist], [0, -dist], [dist, 1], [-dist, 1]]) {
      if (!free(a.x + dx, a.y + dy) || FIGHT.level(a.x + dx, a.y + dy) !== FIGHT.level(a.x, a.y)) continue;
      const ox = t.x, oy = t.y; t.x = a.x + dx; t.y = a.y + dy; if (FIGHT.canStrike(a, t)) { spot = 1; break; } t.x = ox; t.y = oy; } if (spot) break; }
    if (!spot) return { ok: false, why: 'no tile in reach' };
    them.slice(1).forEach(o => { for (let r = 4; r < 12; r++) { const q = [[a.x - r, a.y], [a.x, a.y - r], [a.x + r, a.y + r], [a.x - r, a.y - r]].find(c => free(c[0], c[1])); if (q) { o.x = q[0]; o.y = q[1]; break; } } });
    a.ap = a.apTurn; a.fat = 0; t.hp = Math.max(t.hp, 400); t.hpMax = Math.max(t.hpMax || 0, 400);
    UI.zoom = Math.max(UI.zoom, UI.far * 4); const q = aimAt((a.x + t.x) / 2, (a.y + t.y) / 2); UI.cx = q[0]; UI.cy = q[1];
    return { ok: true, can: FIGHT.canStrike(a, t), d: Math.max(Math.abs(a.x - t.x), Math.abs(a.y - t.y)), row: (a.weapon.of || a.weapon).id, them: lookOf(t) === lookOf(a) ? 'same look' : 'another look' };
  }, mode);
  const out = { set, frames: [] };
  if (!set.ok) { out.errs = d.errs || []; await d.close(); return out; }
  await until(p, () => !(UI.anim && UI.anim.length), null, 20000); await sleep(900);
  const boxOf = (both) => p.evaluate(both => { const S = FIGHT.S, a = S.units.find(u => u.side === 'you'), t = S.units.find(u => u.side === 'them' && FIGHT.onField(u));
    const A = manBox(a.x, a.y), B = both ? manBox(t.x, t.y) : A, h = manH();
    const x0 = Math.max(0, Math.min(A.x, B.x) - h * .75), x1 = Math.min(innerWidth, Math.max(A.x, B.x) + h * .75), y0 = Math.max(0, Math.min(A.head, B.head) - h * .45), y1 = Math.min(innerHeight, Math.max(A.head, B.head) + h * 1.45);
    return { x: Math.round(x0), y: Math.round(y0), width: Math.round(x1 - x0), height: Math.round(y1 - y0) }; }, both);
  const me = await boxOf(false), box = await boxOf(true); out.box = box; out.me = me;
  for (let f = 0; f < 8; f++) {
    await p.evaluate(f => { const a = FIGHT.S.units.find(u => u.side === 'you'); clearInterval(window.__face); window.__face = setInterval(() => { a._face = f; }, 4); }, f);
    await sleep(260);
    const fn = id + '_' + mode + '_turn' + f + '.png'; await p.screenshot({ path: path.join(OUT, fn), clip: me }); out.frames.push(fn);
  }
  await p.evaluate(() => clearInterval(window.__face));
  out.strike = await p.evaluate(() => { const S = FIGHT.S, a = S.units.find(u => u.side === 'you'), t = S.units.find(u => u.side === 'them' && FIGHT.onField(u));
    UI.pend = null; const q = FIGHT.strike(a, t, { roll: 1, head: false }); try { take(); } catch (e) {}
    return { hit: q && q.hit }; });
  await sleep(60);
  for (let k = 0; k < 6; k++) {
    await p.evaluate(k => { window.__k = k; clearInterval(window.__hold); window.__hold = setInterval(() => {
      (UI.anim || []).forEach(an => { if (an.k === 'attack' && an.at) an.at = performance.now() - an.dur * (window.__k + .5) / 6; }); }, 4); }, k);
    await sleep(170);
    const fn = id + '_' + mode + '_shot' + k + '.png'; await p.screenshot({ path: path.join(OUT, fn), clip: box }); out.frames.push(fn);
  }
  await p.evaluate(() => clearInterval(window.__hold));
  out.seen = await p.evaluate(() => { const o = {}; Object.keys(UI.clipSeen || {}).forEach(k => { if (/^(gun|hold|idle):/.test(k) || /^(carry|carrywalk|aim)$/.test(k)) o[k] = UI.clipSeen[k]; }); return o; });
  out.errs = d.errs || [];
  await d.close();
  return out;
}

(async () => {
  const ids = process.argv.slice(2).length ? process.argv.slice(2) : ALL, pf = path.join(ROOT, 'records/target/cook_six_guns/proof.json');
  const proof = (() => { try { return JSON.parse(fs.readFileSync(pf)); } catch (e) { return {}; } })();
  for (const id of ids) {
    proof[id] = { at: new Date().toISOString() };
    for (const mode of ['before', 'after']) {
      const r = await one(id, mode); proof[id][mode] = r;
      console.log(id, mode, JSON.stringify({ set: r.set, strike: r.strike, seen: r.seen, errs: (r.errs || []).length }));
    }
  }
  fs.writeFileSync(pf, JSON.stringify(proof, null, 1));
})().catch(e => { console.error(e); process.exit(1); });
