/* ARMORY 2 PROOF (Paolo 11/2, rule 320, ask lines 316 and 317). The pool pole spear and the four whips met where a player meets them, at
   phone size (390 by 844 at 3x) through the one driver (tools/bohemia_drive_the_demo.js), on the shipped pages:
     LASH    for each whip, his man two tiles from a brigand on his own turn: the reach taped on the ground and the man picked (LASH's
             second tile lit, the hurt tag over him), then the lash itself, the fight's own strike and its own drawing, the cord HELD on
             its crack key for the still (records/target/armory/whip_<id>_lash.png, whip_<id>_preview.png); DISARM armed on the
             extension cord (whip_disarm_preview.png)
     POLE    the pool pole spear in his hand, the man beside him (pool_pole_spear.png)
     SHOP    twelve camps: the pool pole spear and the extension cord on every smith's shelf (the camp's junk); a camp smith shot
     ICONS   the five icons at real pixels
   node tools/bohemia_armory_whip_proof.js    (writes records/target/armory/whip_proof.json) */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.dirname(__dirname), OUT = path.join(ROOT, 'records/target/armory');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
fs.mkdirSync(OUT, { recursive: true });
const WHIPS = ['extension_cord', 'live_wire', 'barbed_wire', 'rodeo_bullwhip'];
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function until(p, fn, arg, ms) { const t0 = Date.now(); while (Date.now() - t0 < ms) { try { if (await p.evaluate(fn, arg)) return true; } catch (e) {} await sleep(250); } return false; }
const proof = { at: new Date().toISOString() };

async function lash(id, d0) {
  const company = [{ name: 'YOU', main: true, background: 'sellsword', level: 3, perks: [], marks: [], gear: { main: id, off: null, body: 'riot_gear_jacket', head: 'football_helmet', bag: [null, null] } }];
  const arm = 'window.FIGHT_OPTS = ' + JSON.stringify({ seed: 7, speed: 1, auto: false, deploy: false, teach: false, company, party: { faction: 'brigands', count: 3, days: 1 } }) + ';';
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm }), p = d.page;
  await until(p, () => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.units && FIGHT.S.units.length > 1 && !FIGHT.S.deploy, null, 60000);
  await sleep(2500);
  /* his turn, a brigand stood two tiles off on open ground beside him (the rest sent back), the camera on the two */
  const set = await p.evaluate(dist => {
    for (let g = 0; g < 400 && FIGHT.current() && FIGHT.current().side !== 'you' && !FIGHT.S.over; g++) FIGHT.aiStep(FIGHT.current());
    try { take(); } catch (e) {}
    const S = FIGHT.S, a = S.units.find(u => u.side === 'you'), them = S.units.filter(u => u.side === 'them' && FIGHT.onField(u));
    const t = them[0]; if (!a || !t) return { ok: false, why: 'no men' };
    const free = (x, y) => x >= 0 && y >= 0 && x < S.w && y < S.h && FIGHT._t.passable(x, y) && !S.units.some(u => FIGHT.onField(u) && u !== t && u.x === x && u.y === y);
    let spot = null;
    for (const [dx, dy] of [[dist, 0], [-dist, 0], [0, dist], [0, -dist], [dist, 1], [-dist, 1]]) if (free(a.x + dx, a.y + dy) && FIGHT.level(a.x + dx, a.y + dy) === FIGHT.level(a.x, a.y)) { spot = { x: a.x + dx, y: a.y + dy }; break; }
    if (!spot) return { ok: false, why: 'no open tile ' + dist + ' off' };
    t.x = spot.x; t.y = spot.y;
    them.slice(1).forEach((o, i) => { for (let r = 4; r < 12; r++) { const q = [[a.x - r, a.y], [a.x, a.y - r], [a.x + r, a.y + r], [a.x - r, a.y - r]].find(c => free(c[0], c[1])); if (q) { o.x = q[0]; o.y = q[1]; break; } } });
    a.ap = a.apTurn; a.fat = 0; t.hp = Math.max(t.hp, 60);
    try { FIGHT.sideSees && FIGHT.S.seen && (FIGHT.S.seen[t.id] = true); } catch (e) {}
    UI.zoom = Math.max(UI.zoom, UI.far * 1.6); const q = aimAt((a.x + t.x) / 2, (a.y + t.y) / 2); UI.cx = q[0]; UI.cy = q[1];
    return { ok: true, can: FIGHT.canStrike(a, t), d: Math.max(Math.abs(a.x - t.x), Math.abs(a.y - t.y)), whip: FIGHT.isWhip(a.weapon), reach: FIGHT.reachOf(a.weapon), skill: FIGHT.strikeSkill(a.weapon).name };
  }, d0 || 2);
  const out = { set };
  if (!set.ok) { await d.close(); return out; }
  await until(p, () => !(UI.anim && UI.anim.length), null, 20000); await sleep(600);   /* their moves played out: his turn on the glass */
  /* the preview: his man picked, the second tile lit */
  out.preview = await p.evaluate(() => { const S = FIGHT.S, a = S.units.find(u => u.side === 'you'), t = S.units.find(u => u.side === 'them' && FIGHT.onField(u));
    UI.pend = { target: t }; try { hud(); } catch (e) {} return true; });
  await sleep(700);
  out.lit = await p.evaluate(() => JSON.parse(JSON.stringify({ shapeLit: UI.shapeLit, hurts: UI.hurtShown })));
  await p.screenshot({ path: path.join(OUT, 'whip_' + id + '_preview.png') });
  /* DISARM armed (the extension cord's) */
  if (id === 'extension_cord') {
    out.disarm = await p.evaluate(() => { UI.pend = null; UI.sweep = 'Disarm'; try { hud(); } catch (e) {} return true; });
    await sleep(700);
    out.disarmLit = await p.evaluate(() => JSON.parse(JSON.stringify({ shapeLit: UI.shapeLit, hurts: UI.hurtShown, button: !!document.querySelector('button[data-sweep="Disarm"]') })));
    await p.screenshot({ path: path.join(OUT, 'whip_disarm_preview.png') });
    await p.evaluate(() => { UI.sweep = null; });
  }
  /* the lash: the fight's own strike, its own drawing, the cord held on its crack key for the still */
  out.strike = await p.evaluate(() => { const S = FIGHT.S, a = S.units.find(u => u.side === 'you'), t = S.units.find(u => u.side === 'them' && FIGHT.onField(u));
    UI.pend = null; const n0 = S.log.length; const q = FIGHT.strike(a, t, { roll: 1, head: false }); try { take(); } catch (e) {}
    return { hit: q && q.hit, hp: q && q.hp, events: S.log.slice(n0).map(e => e.t + (e.skill ? ':' + e.skill : '')) }; });
  await until(p, () => UI.lash && UI.lash.length, null, 6000);
  await p.evaluate(() => { window.__hold = setInterval(() => { (UI.lash || []).forEach(l => { l.at = performance.now() - l.B * 0.42; }); (UI.anim || []).forEach(an => { if (an.k === 'attack' && an.at) an.at = performance.now() - an.dur * 0.42; }); }, 4); });
  await sleep(500);
  out.held = await p.evaluate(() => (UI.lash || []).map(l => ({ arm: l.arm, key: Math.floor((performance.now() - l.at) / (l.B / LASH_KEYS.length)) })));
  await p.screenshot({ path: path.join(OUT, 'whip_' + id + '_lash.png') });
  await p.evaluate(() => clearInterval(window.__hold));
  /* the six drawn keys, each held for its frame (the swing clip held at the same point of its beat), clipped round the two men: the
     VOTE tab plays them as the lash, on the beat */
  if (WHIPS.indexOf(id) >= 0) {
    const box = await p.evaluate(() => { const S = FIGHT.S, a = S.units.find(u => u.side === 'you'), t = S.units.find(u => u.side === 'them' && FIGHT.onField(u));
      const A = manBox(a.x, a.y), B = manBox(t.x, t.y), h = manH(), x0 = Math.max(0, Math.min(A.x, B.x) - h * .9), x1 = Math.min(innerWidth, Math.max(A.x, B.x) + h * .9), y0 = Math.max(0, Math.min(A.head, B.head) - h * .6), y1 = Math.min(innerHeight, Math.max(A.feet, B.feet) + h * .35);
      return { x: Math.round(x0), y: Math.round(y0), width: Math.round(x1 - x0), height: Math.round(y1 - y0) }; });
    out.box = box; out.frames = [];
    for (let k = 0; k < 6; k++) {
      await p.evaluate(k => { window.__k = k; clearInterval(window.__hold); window.__hold = setInterval(() => { (UI.lash || []).forEach(l => { l.at = performance.now() - l.B * (window.__k + .5) / 6; });
        (UI.anim || []).forEach(an => { if (an.k === 'attack' && an.at) an.at = performance.now() - an.dur * (window.__k + .5) / 6; }); }, 4); }, k);
      await sleep(160);
      const f = path.join(OUT, 'whip_' + id + '_key' + k + '.png'); await p.screenshot({ path: f, clip: box }); out.frames.push(path.basename(f));
    }
    out.keysSeen = await p.evaluate(() => (UI.lash || []).length);
    await p.evaluate(() => clearInterval(window.__hold));
  }
  out.errs = d.errs || [];
  await d.close();
  return out;
}

async function shop() {
  const d = await open({ file: 'BOHEMIA_SETTLEMENT_SCREEN.html', bare: true }), p = d.page;
  await until(p, () => window.BohemiaSettlement && BohemiaSettlement.state.stock && BohemiaSettlement.where('smith'), null, 30000);
  const r = await p.evaluate(async () => {
    const want = ['pool_pole_spear', 'extension_cord'], camps = []; let all = 0;
    for (let i = 0; i < 12; i++) { BohemiaSettlement.open({ place: { tier: 'camp', name: 'CAMP ' + i } }); await new Promise(z => setTimeout(z, 40));
      const sm = (BohemiaSettlement.state.stock.smith || []).map(it => it.id); const has = want.filter(w => sm.indexOf(w) >= 0); camps.push(has.length); if (has.length === want.length) all++; }
    const towns = {}; for (const tier of ['town', 'fortress']) for (let i = 0; i < 12; i++) { BohemiaSettlement.open({ place: { tier, name: tier.toUpperCase() + ' ' + i } }); await new Promise(z => setTimeout(z, 40));
      const st = BohemiaSettlement.state.stock || {}; for (const k in st) (st[k] || []).forEach(it => { if (['live_wire', 'barbed_wire', 'rodeo_bullwhip', 'extension_cord', 'pool_pole_spear'].indexOf(it.id) >= 0) towns[it.id + ' ' + tier] = (towns[it.id + ' ' + tier] | 0) + 1; }); }
    return { campsWithBoth: all, of: 12, rolled: towns };
  });
  proof.shop = r;
  await p.evaluate(() => { try { document.getElementById('close').click(); } catch (e) {} BohemiaSettlement.open({ place: { tier: 'camp', name: 'CAMP 0' }, batteries: 200 }); });
  await sleep(600);
  const xy = await p.evaluate(() => BohemiaSettlement.where('smith'));
  if (xy) { await p.mouse.click(xy.x, xy.y); await sleep(900); proof.shelf = await p.evaluate(() => Array.from(document.querySelectorAll('#shelfgrid .slot.full')).map(b => { const it = b.__it || {}, c = b.querySelector('canvas'); return { id: it.id, name: it.name, icon: c ? c.dataset.obj : null }; })); await p.screenshot({ path: path.join(OUT, 'camp_smith_starters.png') }); }
  proof.icons = await p.evaluate(async () => {
    const Wr = (await fetch('../records/target/bb/weapons.json').then(r => r.json())).rows, ids = ['pool_pole_spear', 'extension_cord', 'live_wire', 'barbed_wire', 'rodeo_bullwhip'];
    const box = document.createElement('div'); box.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#17110b;display:flex;flex-wrap:wrap;align-content:flex-start;gap:10px;padding:16px;font:11px monospace;color:#d8c9a8';
    document.body.appendChild(box); const out = [];
    ids.forEach(id => { const r = Wr.find(x => x.id === id); const it = BohemiaMaterials.itemFromRow('weapon', r, Wr); const c = BohemiaMaterials.itemIcon(it, 66);
      const cell = document.createElement('div'); cell.style.cssText = 'width:110px;text-align:center'; cell.appendChild(c); const t = document.createElement('div'); t.textContent = it.name; cell.appendChild(t); box.appendChild(cell);
      out.push({ id, name: it.name, obj: c.dataset.obj }); });
    return out;
  });
  await sleep(300); await p.screenshot({ path: path.join(OUT, 'whip_icons.png') });
  proof.shop_errs = d.errs || [];
  await d.close();
}

(async () => {
  for (const id of WHIPS) { proof[id] = await lash(id, 2); console.log(id + ': ' + JSON.stringify({ set: proof[id].set, lit: proof[id].lit && proof[id].lit.shapeLit, strike: proof[id].strike, held: proof[id].held, errs: (proof[id].errs || []).length })); }
  console.log('DISARM: ' + JSON.stringify(proof.extension_cord && proof.extension_cord.disarmLit));
  if (process.env.ONLY === 'lash') { const was = (() => { try { return JSON.parse(fs.readFileSync(path.join(OUT, 'whip_proof.json'))); } catch (e) { return {}; } })(); fs.writeFileSync(path.join(OUT, 'whip_proof.json'), JSON.stringify(Object.assign(was, proof), null, 1)); return; }
  proof.pool_pole_spear = await lash('pool_pole_spear', 1); console.log('pool_pole_spear: ' + JSON.stringify({ set: proof.pool_pole_spear.set, strike: proof.pool_pole_spear.strike }));
  await shop(); console.log('SHOP: ' + JSON.stringify(proof.shop) + ' shelf ' + JSON.stringify((proof.shelf || []).map(s => s.id + ':' + s.icon)));
  console.log('ICONS: ' + JSON.stringify(proof.icons));
  fs.writeFileSync(path.join(OUT, 'whip_proof.json'), JSON.stringify(proof, null, 1));
})().catch(e => { console.error(e); process.exit(1); });
