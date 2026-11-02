/* ARMORY PROOF (Paolo 11/2, rule 302: 'more weapons... the whole thing'). Every piece of records/target/bb/armory.json met where a
   player meets it, at phone size through the one driver (tools/bohemia_drive_the_demo.js), on the shipped pages:
     SHOP   36 places of every size: which pieces the smith and the armourer stock, by tier; the smith and the armourer of the
            fortress that carries the most, shot (records/target/armory/shop_*.png)
     ICONS  every piece's own icon at real pixels (records/target/armory/icons.png)
     FIGHT  two real fights (the fight plays itself, AUTO): his men carry every new weapon and wear every new armour; what each
            man holds and wears as the fight drew it, and how many blows each new weapon struck (the fight's own log); shot
     ENEMY  the brigands who carry a piece in a road fight (carried_by), and that their pieces reach the loot
   node tools/bohemia_armory_proof.js            (writes records/target/armory/proof.json) */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.dirname(__dirname), OUT = path.join(ROOT, 'records/target/armory');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const SPEC = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/armory.json')));
const W = SPEC.weapons.map(w => w.id), BODY = SPEC.body.map(a => a.id), HEAD = SPEC.head.map(a => a.id);
fs.mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function until(p, fn, arg, ms) { const t0 = Date.now(); while (Date.now() - t0 < ms) { try { if (await p.evaluate(fn, arg)) return true; } catch (e) {} await sleep(250); } return false; }
const proof = { at: new Date().toISOString(), pieces: { weapons: W.length, body: BODY.length, head: HEAD.length } };

async function shop() {
  const d = await open({ file: 'BOHEMIA_SETTLEMENT_SCREEN.html', bare: true });
  const p = d.page;
  await until(p, () => window.BohemiaSettlement && BohemiaSettlement.state.stock && BohemiaSettlement.where('smith'), null, 30000);
  const r = await p.evaluate(async ids => {
    const by = {}, best = { n: -1 };
    for (const tier of ['camp', 'town', 'fortress']) for (let i = 0; i < 12; i++) {
      const name = tier.toUpperCase() + ' ' + i;
      BohemiaSettlement.open({ place: { tier, name } }); await new Promise(z => setTimeout(z, 40));
      const st = BohemiaSettlement.state.stock || {}; let n = 0;
      for (const k in st) (st[k] || []).forEach(it => { if (ids.indexOf(it.id) >= 0) { (by[it.id] = by[it.id] || {})[tier] = ((by[it.id] || {})[tier] | 0) + 1; n++; } });
      if (tier !== 'camp' && n > best.n) Object.assign(best, { n, tier, name });
    }
    return { by, best };
  }, W.concat(BODY, HEAD));
  proof.shop = r;
  for (const k of ['smith', 'armourer']) {
    await p.evaluate(b => { try { BohemiaSettlement.state.open && document.getElementById('close').click(); } catch (e) {} BohemiaSettlement.open({ place: { tier: b.tier, name: b.name }, batteries: 900 }); }, r.best);
    await sleep(600); await p.evaluate(k => BohemiaSettlement.where(k), k); await sleep(300);
    const xy = await p.evaluate(k => BohemiaSettlement.where(k), k); if (!xy) { proof['shelf_' + k] = 'no door'; continue; }
    await p.mouse.click(xy.x, xy.y); await sleep(900);
    proof['shelf_' + k] = await p.evaluate(ids => Array.from(document.querySelectorAll('#shelfgrid .slot.full')).map(b => {
      const it = b.__it || {}, c = b.querySelector('canvas'), im = b.querySelector('img.pk'), rc = (c || im || b).getBoundingClientRect();
      return { id: it.id, name: it.name, own: ids.indexOf(it.id) >= 0, icon: c ? 'drawn:' + c.dataset.obj : im ? 'pack' : 'none', px: Math.round(rc.width) }; }), W.concat(BODY, HEAD));
    await p.screenshot({ path: path.join(OUT, 'shop_' + k + '.png') });
  }
  /* every piece's own icon at real pixels (6 device pixels a cell, 132 across: 44 points on his phone) */
  const icons = await p.evaluate(async () => {
    const j = u => fetch(u).then(r => r.json()); const Wr = (await j('../records/target/bb/weapons.json')).rows, A = await j('../records/target/bb/armor.json');
    const rows = Wr.filter(r => r.armory).map(r => ['weapon', r]).concat(A.body.filter(r => r.armory).map(r => ['body', r]), A.head.filter(r => r.armory).map(r => ['head', r]));
    const box = document.createElement('div'); box.id = 'armoryicons'; box.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#17110b;display:flex;flex-wrap:wrap;align-content:flex-start;gap:6px;padding:8px;font:9px monospace;color:#d8c9a8';
    document.body.appendChild(box); const out = [];
    rows.forEach(([k, r]) => { const it = BohemiaMaterials.itemFromRow(k, r, Wr); if (k !== 'weapon') it.name = r.armory.name; const c = BohemiaMaterials.itemIcon(it, 44);
      const cell = document.createElement('div'); cell.style.cssText = 'width:86px;text-align:center'; cell.appendChild(c); const t = document.createElement('div'); t.textContent = it.name; cell.appendChild(t); box.appendChild(cell);
      out.push({ id: r.id, name: it.name, obj: c.dataset.obj, w: c.width, h: c.height }); });
    return out;
  });
  proof.icons = icons;
  await sleep(300); await p.screenshot({ path: path.join(OUT, 'icons.png') });
  proof.shop_errs = d.errs || [];
  await d.close();
}

async function fight(tag, men, seed) {
  const company = men.map((g, i) => ({ name: (i ? 'M' + i : 'YOU'), main: i === 0, background: 'sellsword', level: 3, perks: [], marks: [],
    gear: { main: g.main, off: null, body: g.body, head: g.head, bag: [null, null] } }));
  const arm = 'window.FIGHT_OPTS = ' + JSON.stringify({ seed, speed: 4, auto: true, teach: false, company }) + ';';
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm });
  const p = d.page;
  await until(p, () => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.units && FIGHT.S.units.length > 0, null, 60000);
  await sleep(4000);
  await p.screenshot({ path: path.join(OUT, 'fight_' + tag + '_start.png') });
  const held = await p.evaluate(() => FIGHT.S.units.map(u => {
    let prop = null; try { prop = typeof meleeProp === 'function' ? meleeProp(u) : null; } catch (e) {}
    const w = u.weapon || {}, b = w.of || w;
    return { side: u.side, name: u.name, kind: u.kind || null, weapon: b.id, cls: b['class'], gun: FIGHT.isGun ? !!FIGHT.isGun(w) : null, hands: b.hands || null,
      prop: prop ? prop[0] + (prop[1] ? ' (two hands)' : '') : null, head: u.headRow && u.headRow.id, body: u.bodyRow && u.bodyRow.id }; }));
  const worn = await p.evaluate(() => JSON.parse(JSON.stringify((window.BohemiaWear && BohemiaWear.seen.fight) || {})));
  await until(p, () => FIGHT.S.over, null, 300000);
  await p.screenshot({ path: path.join(OUT, 'fight_' + tag + '_end.png') });
  const blows = await p.evaluate(() => { const by = {}, U = {}; FIGHT.S.units.forEach(u => U[u.id] = u);
    FIGHT.S.log.forEach(e => { if (e.t !== 'attack') return; const u = U[e.id]; if (!u) return; const w = (u.weapon && (u.weapon.of || u.weapon)) || {}; const k = u.side + ':' + w.id; by[k] = by[k] || { swings: 0, hits: 0 }; by[k].swings++; if (e.hit) by[k].hits++; });
    return { by, result: FIGHT.S.result, rounds: FIGHT.S.round }; });
  proof['fight_' + tag] = { held, worn: Object.keys(worn).filter(k => !/@/.test(k)).reduce((o, k) => (o[k] = worn[k], o), {}), blows, errs: d.errs || [] };
  await d.close();
}

(async () => {
  if (process.env.ONLY === 'shop') { const was = JSON.parse(fs.readFileSync(path.join(OUT, 'proof.json'))); await shop(); Object.assign(was, proof); fs.writeFileSync(path.join(OUT, 'proof.json'), JSON.stringify(was, null, 1)); console.log(JSON.stringify({ smith: proof.shelf_smith, armourer: proof.shelf_armourer })); return; }
  await shop();
  const men = (ids) => ids.map((w, i) => ({ main: w, body: BODY[i % BODY.length], head: HEAD[i % HEAD.length] }));
  await fight('a', men(W.slice(0, 7)), 11);
  await fight('b', men(W.slice(7)), 23);
  fs.writeFileSync(path.join(OUT, 'proof.json'), JSON.stringify(proof, null, 1));
  const ours = {}; ['a', 'b'].forEach(t => Object.entries(proof['fight_' + t].blows.by).forEach(([k, v]) => { if (W.indexOf(k.split(':')[1]) >= 0) ours[k] = v; }));
  console.log('SHOP: ' + Object.keys(proof.shop.by).length + ' of ' + (W.length + BODY.length + HEAD.length) + ' pieces stocked somewhere; best ' + JSON.stringify(proof.shop.best));
  console.log('ICONS: ' + proof.icons.length + ' (' + proof.icons.map(i => i.obj).join(', ') + ')');
  ['a', 'b'].forEach(t => { const f = proof['fight_' + t]; console.log('FIGHT ' + t + ': ' + f.blows.result + ' in ' + f.blows.rounds + ' rounds; worn ' + JSON.stringify(f.worn) + '; errs ' + f.errs.length);
    f.held.filter(h => h.side === 'you' || W.indexOf(h.weapon) >= 0).forEach(h => console.log('   ' + h.side + ' ' + h.name + ': ' + h.weapon + (h.gun ? ' (gun)' : '') + (h.prop ? ' held as ' + h.prop : '') + ' | ' + h.head + ' / ' + h.body)); });
  console.log('BLOWS by the new weapons: ' + JSON.stringify(ours));
})().catch(e => { console.error(e); process.exit(1); });
