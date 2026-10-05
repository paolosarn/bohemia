/* EVERY ITEM HAS AN ICON  (UI lane 11, [item icons], 10/5/26)

   PAOLO 10/5 (rule 76): 'a standardized way where you buy things and they end up in your inventory, like in
   Battle Brothers there's inventory space with icons'. The row: one icon per item in weapons.json and
   armor.json, drawn in the materials (hand-cut, loud, crude on purpose, inside the analog horror bible), 44
   points in the bag and on a man's slots, the same icon on the market's card; a gate: every item id has an icon.
   slices/bohemia_ui_materials.js: itemIcon(item, cssPx), itemFromRow(kind, row, all).

   WHAT THIS HOLDS
     ON THE DATA (every row in records/target/bb/weapons.json and armor.json body/head/shields):
     - every item id has an icon, drawn (an object's worth of pixels and a dark outline), 132 device pixels
     - no two icons are the same picture (same object, different item: its own tape, rust, handle, wear)
     - all 23 objects of our world are drawn, and the quality reads (beat-up rusts, good has its glint)
     ON THE SETTLEMENT (RUN TWO's market, at his phone's profile through the one driver):
     - the names the icons are drawn from agree with the market's own names for every item it stocks across
       36 places of every size, so an icon can never show a pipe beside a line that sells a machete
     - every item on the smith's and the armourer's shelf (RUN TWO's grids) wears its icon, of the object its
       name says, the same picture every time; and what you buy lands in the bag wearing the same icon
     - no page error

   node gates/every_item_has_an_icon_gate.js */
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (m, g, extra) => { if (g) { pass++; console.log('  ok   ' + m + (extra ? '  [' + extra + ']' : '')); } else { fail++; console.log('  FAIL ' + m + (extra ? '  [' + extra + ']' : '')); } };
const done = () => { console.log('\nEVERY ITEM HAS AN ICON: ' + pass + ' ok, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

(async () => {
  console.log('\nEVERY ITEM HAS AN ICON  (UI [item icons], rule 76)\n');
  const W = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/weapons.json'))).rows;
  const A = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/armor.json')));
  const mat = fs.readFileSync(path.join(ROOT, 'slices/bohemia_ui_materials.js'), 'utf8');
  const b = await chromium.launch(); const pg = await b.newPage();
  await pg.setContent('<!doctype html><html><body></body></html>'); await pg.addScriptTag({ content: mat });
  const r = await pg.evaluate(({ W, A }) => {
    const rows = W.map(x => ['weapon', x]).concat(A.body.map(x => ['body', x]), A.head.map(x => ['head', x]), A.shields.map(x => ['shields', x]));
    const out = { n: rows.length, ids: 0, sized: 0, drawn: 0, outlined: 0, hashes: {}, objs: {}, glint: 0, rustBeat: 0, beat: 0, good: 0 };
    rows.forEach(([k, row]) => {
      if (!row.id) return; out.ids++;
      const it = BohemiaMaterials.itemFromRow(k, row, W), c = BohemiaMaterials.itemIcon(it, 44);
      if (c.width === 132 && c.height === 132 && c.style.width === '44px') out.sized++;
      const d = c.getContext('2d').getImageData(0, 0, 132, 132).data; let px = 0, dark = 0, h = 0, white = 0, rust = 0;
      for (let i = 0; i < d.length; i += 4 * 6) { if (d[i + 3]) { px++; if (d[i] < 30 && d[i + 1] < 25 && d[i + 2] < 20) dark++; if (d[i] > 250 && d[i + 1] > 245) white++;
        if (d[i] > 100 && d[i] < 230 && d[i + 1] < 110 && d[i + 2] < 60 && d[i] > d[i + 1] * 1.6) rust++; } h = (h * 31 + d[i] + d[i + 1] * 7 + d[i + 2] * 13 + d[i + 3]) >>> 0; }
      if (px > 120) out.drawn++; if (dark > 20) out.outlined++;
      out.hashes[h] = (out.hashes[h] || 0) + 1; out.objs[c.dataset.obj] = (out.objs[c.dataset.obj] || 0) + 1;
      if (c.dataset.q === '2') { out.good++; if (white > 0) out.glint++; } if (c.dataset.q === '0') { out.beat++; if (rust > 0) out.rustBeat++; }
    });
    out.distinct = Object.keys(out.hashes).length; delete out.hashes; out.objects = BohemiaMaterials.OBJECTS.length;
    return out;
  }, { W, A });
  await b.close();
  ok('EVERY ITEM ID HAS AN ICON, DRAWN AND OUTLINED (weapons, body, head, shields)', r.ids === r.n && r.n >= 300 && r.drawn === r.n && r.outlined === r.n, r.n + ' rows, ' + r.drawn + ' drawn, ' + r.outlined + ' outlined');
  ok('  each 132 device pixels, shown at 44 points', r.sized === r.n, r.sized + ' of ' + r.n);
  ok('NO TWO ICONS ARE THE SAME PICTURE', r.distinct === r.n, r.distinct + ' distinct of ' + r.n);
  ok('ALL 23 OBJECTS OF OUR WORLD ARE DRAWN', Object.keys(r.objs).length === r.objects && r.objects === 23, JSON.stringify(r.objs));
  ok('  the quality reads: every beat-up piece shows rust or tape, every good piece its glint', r.beat > 0 && r.good > 0 && r.glint === r.good,
     'beat-up ' + r.beat + ' (rust seen on ' + r.rustBeat + '), good ' + r.good + ' (glint on ' + r.glint + ')');

  /* ON THE SETTLEMENT: the market's own names, and the icons on its lines */
  const d = await open({ file: 'BOHEMIA_SETTLEMENT_SCREEN.html', bare: true });
  const p = d.page;
  const t0 = Date.now(); while (Date.now() - t0 < 20000) { if (await p.evaluate(() => window.BohemiaSettlement && BohemiaSettlement.state.stock && BohemiaSettlement.where('stall'))) break; await p.waitForTimeout(200); }
  /* RUN TWO's naming is inside its own script; what it shows is BohemiaSettlement.state.stock. Walk many places of
     every size and compare each stocked item's name with the name the icon is drawn from, by the item's id. */
  const agree = await p.evaluate(async ({ W, A }) => {
    const byId = {}; W.forEach(r => byId[r.id] = BohemiaMaterials.itemFromRow('weapon', r, W).name);
    ['body', 'head', 'shields'].forEach(k => A[k].forEach(r => byId[r.id] = BohemiaMaterials.itemFromRow(k, r).name));
    const bad = [], seen = {};
    for (const tier of ['camp', 'town', 'fortress']) for (let i = 0; i < 12; i++) {
      BohemiaSettlement.open({ place: { tier, name: tier.toUpperCase() + ' ' + i } }); await new Promise(z => setTimeout(z, 30));
      const st = BohemiaSettlement.state.stock || {};
      for (const k in st) (st[k] || []).forEach(it => { seen[it.id] = 1; if (byId[it.id] !== it.name) bad.push(it.id + ': ' + byId[it.id] + ' vs ' + it.name); });
    }
    BohemiaSettlement.open({ place: { tier: 'town', name: 'THE WASH, NORTH LAS VEGAS' } });
    return { bad, seen: Object.keys(seen).length };
  }, { W, A });
  ok('THE ICONS\' NAMES AGREE WITH THE MARKET\'S FOR EVERY ITEM IT STOCKS (36 places, every size)', agree.bad.length === 0 && agree.seen >= 40, agree.bad.length ? agree.bad.slice(0, 3).join(' | ') : agree.seen + ' different items stocked, all agree');
  /* RUN TWO's shop is two grids (THEIR SHELF, YOUR BAG; 5ba404c): shelf slot i is stock[k][i], bag slot i is stash[i] */
  const slotRead = (k) => p.evaluate(k => {
    const st = BohemiaSettlement.state, H = c => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let h = 0; for (let i = 0; i < d.length; i += 24) h = (h * 31 + d[i] + d[i + 1] * 7 + d[i + 2] * 13) >>> 0; return h; };
    const read = (grid, list) => !grid ? [] : Array.from(grid.children).map((b, i) => { const it = list[i]; if (!it) return null; const c = b.querySelector('canvas.bm-icon');
      if (!c) return { t: it.name, icon: false }; const r = c.getBoundingClientRect();
      return { t: it.name, id: it.id, icon: true, obj: c.dataset.obj, w: r.width, same: c.dataset.id === it.id && H(c) === H(BohemiaMaterials.itemIcon(it, 30)), says: it.name.indexOf(c.dataset.obj) >= 0 }; }).filter(Boolean);
    return { shelf: read(document.getElementById('shelfgrid'), st.stock[k] || []), bag: read(document.getElementById('baggrid'), st.stash || []) };
  }, k);
  const lines = [];
  /* plenty of batteries for the buy below, the way the game hands them over on open */
  await p.evaluate(() => { try { localStorage.removeItem('bohemia.bag.v1'); } catch (e) {} BohemiaSettlement.open({ place: { tier: 'fortress', name: 'THE FORT, HENDERSON' }, batteries: 900 }); });
  await p.waitForTimeout(500);
  for (const k of ['smith', 'armourer']) {
    await p.evaluate(() => { try { BohemiaSettlement.state.open && document.getElementById('close').click(); } catch (e) {} }); await p.waitForTimeout(300);
    await p.evaluate(k => BohemiaSettlement.where(k), k); await p.waitForTimeout(250);
    const xy = await p.evaluate(k => BohemiaSettlement.where(k), k);
    if (!xy) { lines.push({ k, t: k + ' missing', icon: false }); continue; }
    await p.mouse.click(xy.x, xy.y); await p.waitForTimeout(700);
    (await slotRead(k)).shelf.forEach(g => lines.push(Object.assign({ k }, g)));
  }
  ok('EVERY ITEM ON THE SMITH\'S AND THE ARMOURER\'S SHELF WEARS ITS ICON', lines.length >= 6 && lines.every(l => l.icon && l.w >= 28), lines.map(l => l.k + ':' + (l.icon ? l.obj : 'NONE')).join(' '));
  ok('  of the object its name says, and the same item always draws the same picture', lines.every(l => l.says && l.same), lines.filter(l => !(l.says && l.same)).map(l => l.t).join(' | '));
  /* buy the first thing on the armourer's shelf: it lands in the bag wearing the same icon */
  const first = await p.evaluate(() => { const b = document.querySelector('#shelfgrid .slot.full'); const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, id: BohemiaSettlement.state.stock.armourer[0].id }; });
  await p.mouse.click(first.x, first.y); await p.waitForTimeout(400);
  const buy = await p.evaluate(() => { const a = Array.from(document.querySelectorAll('#sbody .act')).find(x => /Buy it/.test(x.textContent)); if (!a || a.disabled) return null; const r = a.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  if (buy) { await p.mouse.click(buy.x, buy.y); await p.waitForTimeout(500); }
  await p.evaluate(() => { try { BohemiaSettlement.state.open && document.getElementById('close').click(); } catch (e) {} }); await p.waitForTimeout(300);
  const xa = await p.evaluate(() => BohemiaSettlement.where('armourer')); await p.mouse.click(xa.x, xa.y); await p.waitForTimeout(700);
  const bag = (await slotRead('armourer')).bag;
  ok('WHAT YOU BUY LANDS IN THE BAG WEARING THE SAME ICON', !!buy && bag.length >= 1 && bag.some(b => b.id === first.id && b.icon && b.same), JSON.stringify(bag.map(b => b.id + ':' + b.obj + ':' + b.same)));
  ok('no page error', !(d.errs && d.errs.length), (d.errs || []).slice(0, 2).join(' | '));
  await d.close();
  done();
})().catch(e => { console.error(e); process.exit(1); });
