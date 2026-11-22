/* EACH SLOT ITS OWN PICTURE  (UI FIVE, 11/22/26; VAMILY rule 474, rules 452, 441)

   PAOLO 11/22: 'when I buy something from any shop, especially when it's weapons and armor, if I buy that one item then the UI of the
   slots gets fucked up. The icon will be the icon for something else, like the list doesn't get fixed... if I buy the most expensive
   item and there's something else I wanna buy that's the second most expensive item, it will still have the icon of that first item'.

   THE CAUSE (slices/bohemia_ui_materials.js, the shop grids' painter): slot i was drawn as the i-th piece of the shop's raw list, but
   the shelf stands dearest first (rule 452) and keeps a bought piece's place empty for the visit, and the bag stands dearest first by
   what it fetches; so pictures sat on the wrong pieces, and after a buy every one after the gap slid a place.
   THE FIX (__EACH_SLOT_ITS_OWN_PICTURE__): every slot is drawn from its own piece (the tile carries it), never by its place.

   On the DEMO and the ALPHA, through the one driver, a phone upright (390 x 844) and on its side (844 x 390), the way he gets there:
   the map's own door into CARAVANS, then its ARMOURER (armour wears drawn icons) and its SMITH (weapons wear the pack's or their own):
     S1 AS HE WALKS IN, every slot of THEIR SHELF and YOUR BAG wears its own piece's picture (the shop's own icon for that piece:
        its pack tile or its own model, else the drawn icon carrying its id), its own name and its own price; an empty place none
     S2 HE BUYS THE DEAREST, THEN EACH NEXT (a double tap, as he buys): after every buy, every slot is S1 again, and the bought
        piece's picture is on no shelf slot
     S3 HE SELLS ONE BACK (a double tap on a bag piece): every slot is S1 again
     S4 nothing threw
   PLANTED (the demo upright): the painter by place put back: S2 reads a wrong picture.
   node gates/each_slot_its_own_picture_gate.js [demo|alpha] [phone_portrait|phone_landscape] */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined && x !== '' ? '  [' + String(x).slice(0, 500) + ']' : '')); return g; };
const ARGS = process.argv.slice(2);
const PAGES = ['demo', 'alpha'].filter(p => !ARGS.some(a => a === 'demo' || a === 'alpha') || ARGS.includes(p));
const PROFS = ['phone_portrait', 'phone_landscape'].filter(p => !ARGS.some(a => /^phone_/.test(a)) || ARGS.includes(p));

/* in the town's frame: every slot of the two grids against its own piece */
const READ = () => {
  const out = { slots: 0, full: 0, bad: [], shelf: [] };
  ['shelfgrid', 'baggrid'].forEach(g => { const grid = document.getElementById(g); if (!grid) return;
    [].forEach.call(grid.children, (b, i) => { out.slots++;
      const it = b.__it || null, img = b.querySelector('img.pk'), bm = b.querySelector('.bm-icon'), where = g + '[' + i + ']';
      if (g === 'shelfgrid') out.shelf.push(it ? it.id : null);
      if (!it) { if (img || bm) out.bad.push(where + ' an empty place wears ' + (img ? img.getAttribute('src') : 'the drawn ' + bm.dataset.id)); return; }
      out.full++;
      /* the shop's own picture names the piece it was made for (iconTile: the pack tile or its own model; else the drawn icon) */
      if (img) { if (img.dataset.of !== it.id) out.bad.push(where + ' ' + it.id + ' wears the picture made for ' + (img.dataset.of || '?') + ' (' + img.getAttribute('src') + ')'); if (bm) out.bad.push(where + ' ' + it.id + ' also wears the drawn ' + bm.dataset.id); }
      else if (!bm || bm.dataset.id !== it.id) out.bad.push(where + ' ' + it.id + ' wears ' + (bm ? 'the drawn ' + bm.dataset.id : 'nothing'));
      const nm = b.querySelector('span.nm2'); if (nm && nm.textContent !== it.name.replace(/^(a|an) /, '')) out.bad.push(where + ' ' + it.id + ' is named "' + nm.textContent + '"');
    }); });
  return out;
};

async function town(d, P) {
  await d.fr.evaluate(() => { const bs = ctBases(), n = Object.keys(bs).find(k => /caravan/i.test(k)), t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); });
  let sf = null; for (let k = 0; k < 60 && !sf; k++) { await P.waitForTimeout(400);
    for (const x of P.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url()))) if (await x.evaluate(() => { try { return BohemiaSettlement.ready() && !!BohemiaSettlement.state.place && /caravan/i.test(BohemiaSettlement.state.place.name) && !BohemiaSettlement.camp().camp; } catch (e) { return false; } }).catch(() => false)) sf = x; }
  if (sf) { await sf.waitForFunction(() => !document.getElementById('arrive'), null, { timeout: 8000 }).catch(() => {}); await P.waitForTimeout(1200); }
  return sf;
}
async function openShop(sf, P, k) {
  await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); }); await P.waitForTimeout(500);
  for (let t = 0; t < 3; t++) { const w = await sf.evaluate(k => BohemiaSettlement.where(k), k); if (!w) return null;
    const fb = await (await sf.frameElement()).boundingBox(); await P.touchscreen.tap(fb.x + w.x, fb.y + w.y); await P.waitForTimeout(1500);
    if (await sf.evaluate(k => BohemiaSettlement.state.open === k, k)) break; }
  await P.waitForTimeout(900);
  return sf.evaluate(() => BohemiaSettlement.state.open);
}
/* a double tap on a slot, as he buys or sells (shopPick: two taps inside 450 ms) */
/* the slot's own box on the glass, from the browser (on the alpha the town is a frame inside the city's frame inside the workshop's
   page, and adding the frames' boxes by hand put the finger 44 px above the slot, on the keeper's line) */
async function twice(sf, P, sel) {
  const h = await sf.$(sel); if (!h) return false;
  await sf.evaluate(s => { const e = document.querySelector(s); if (e) e.scrollIntoView({ block: 'center' }); }, sel); await P.waitForTimeout(150);
  /* the slot holding still first (the sheet grows out of its building and the strip settles after a buy; a finger on a moving slot
     can land beside it, the first buy's flake on a slow box, 11/22) */
  let q = await h.boundingBox(), same = 0;
  for (let i = 0; i < 40 && same < 5; i++) { await P.waitForTimeout(60); const r = await h.boundingBox(); same = r && q && Math.abs(r.x - q.x) < 0.5 && Math.abs(r.y - q.y) < 0.5 && Math.abs(r.width - q.width) < 0.5 ? same + 1 : 0; q = r; }
  if (!q) return false;
  const x = q.x + q.width / 2, y = q.y + q.height / 2;
  await P.touchscreen.tap(x, y); await P.waitForTimeout(120); await P.touchscreen.tap(x, y); await P.waitForTimeout(1300);
  return true;
}

async function walk(page, profile, plant) {
  const tag = page + ' ' + (profile === 'phone_portrait' ? 'upright' : 'on its side') + (plant ? ' PLANTED (the painter by place put back)' : '');
  console.log('\n' + tag);
  let d; const errs = [];
  try {
    d = await drive.open({ profile, alpha: page === 'alpha', noWorker: !!plant, beforeGoto: plant ? async (cdp, pg) => {   /* the plant's route: the page's service worker would answer the frame first */
      await pg.route(/bohemia_ui_materials\.js/, async route => { const r = await route.fetch(); const b = (await r.text()).replace("var it = b.__it || null, old = b.querySelector('.bm-icon');",
        "var it = (function(){ var S0 = BohemiaSettlement.state, i = [].indexOf.call(grid.children, b); return grid.id === 'shelfgrid' ? (S0.stock[S0.open] || [])[i] : (S0.stash || [])[i]; })() || null, old = b.querySelector('.bm-icon');");
        await route.fulfill({ response: r, body: b }); }); } : undefined });
  } catch (e) { ok(tag + ': the page boots', false, String(e.message).slice(0, 160)); return; }
  const P = d.page; P.on('pageerror', e => errs.push(String(e.message).slice(0, 160)));
  try {
    await P.waitForTimeout(2000);
    const sf = await town(d, P); if (!sf) { ok(tag + ': Caravans through the map\'s door', false); return; }
    await sf.evaluate(() => { const S = BohemiaSettlement.state; window.BohemiaPurse.credit(S.purse, 'electricity', 20000, 'gate:each-slot-its-own-picture', S.place.name, S.day); });   /* enough to buy the dearest and the next ones */
    let plantSeen = 0; const plantSay = [];
    for (const k of ['armourer', 'smith']) {
      const open = await openShop(sf, P, k); if (open !== k) { ok(tag + ' ' + k + ': the shop opens', false, open); continue; }
      const R0 = await sf.evaluate(READ);
      if (plant) { plantSeen += R0.bad.length; plantSay.push(...R0.bad.slice(0, 1)); }
      else ok('S1 ' + tag + ' ' + k.toUpperCase() + ' as he walks in: ' + R0.full + ' pieces, each slot its own picture, name and price', R0.full >= 3 && !R0.bad.length, R0.bad.slice(0, 3).join(' | '));
      const bought = [], after = [];
      for (let n = 0; n < 3; n++) {
        const first = await sf.evaluate(() => { const g = document.getElementById('shelfgrid'), b = g && [].find.call(g.children, x => x.__it && !x.__it.yours); return b ? { i: [].indexOf.call(g.children, b), id: b.__it.id } : null; });
        if (!first) break;
        await twice(sf, P, '#shelfgrid > :nth-child(' + (first.i + 1) + ')');
        const R = await sf.evaluate(READ), took = !R.shelf.includes(first.id) || R.shelf.filter(x => x === first.id).length < R0.shelf.filter(x => x === first.id).length;
        bought.push(first.id + (took ? '' : ' (not taken)')); after.push(R);
      }
      if (plant) { plantSeen += after.reduce((a, R) => a + R.bad.length, 0); after.forEach((R, i) => { if (R.bad[0]) plantSay.push('after buy ' + (i + 1) + ': ' + R.bad[0]); }); continue; }
      const bad2 = after.map((R, i) => R.bad.length ? 'after buy ' + (i + 1) + ': ' + R.bad.slice(0, 2).join(' | ') : '').filter(Boolean);
      ok('S2 ' + tag + ' ' + k.toUpperCase() + ' he buys the dearest, then each next (' + bought.join(', ') + '): after every buy every slot wears its own picture', bought.length >= 2 && !bought.some(b => /not taken/.test(b)) && !bad2.length, bad2.join(' || ') || bought.join(', '));
      /* S3: one sold back */
      const bagFirst = await sf.evaluate(() => { const g = document.getElementById('baggrid'), b = g && [].find.call(g.children, x => x.__it); return b ? [].indexOf.call(g.children, b) : -1; });
      if (bagFirst >= 0) { await twice(sf, P, '#baggrid > :nth-child(' + (bagFirst + 1) + ')'); const R3 = await sf.evaluate(READ);
        ok('S3 ' + tag + ' ' + k.toUpperCase() + ' he sells one back: every slot wears its own picture', !R3.bad.length, R3.bad.slice(0, 3).join(' | ')); }
      else ok('S3 ' + tag + ' ' + k.toUpperCase() + ' a piece in the bag to sell', false);
    }
    if (plant) ok(tag + ': the leg sees the wrong pictures (' + plantSeen + ' slots wear another piece\'s)', plantSeen > 0, plantSay.slice(0, 4).join(' | '));
    else ok('S4 ' + tag + ': nothing threw', !errs.length, errs.slice(0, 2).join(' | '));
  } catch (e) { ok(tag + ': the walk ran', false, String(e && e.stack || e).slice(0, 400)); }
  finally { try { await d.close(); } catch (_e) {} }
}

(async () => {
  console.log('EACH SLOT ITS OWN PICTURE (rule 474; rules 452, 441)');
  if (!ARGS.includes('--plant-only')) for (const pg of PAGES) for (const pr of PROFS) await walk(pg, pr, false);
  if (PAGES.includes('demo') && PROFS.includes('phone_portrait')) await walk('demo', 'phone_portrait', true);
  console.log('\nEACH SLOT ITS OWN PICTURE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
