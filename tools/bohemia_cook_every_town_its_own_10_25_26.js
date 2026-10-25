#!/usr/bin/env node
/* COOK [every town looks its own] (10/25/26) and line 8 of his list (the towns part of the map, never stickers): THE LOOK AND
   THE LIKENESS of __EVERY_TOWN_ITS_OWN__. Rule 186(b) (Paolo 10/25: 'every settlement has to look unique and different a little
   bit... a settlement deep in the heart of the city should give more city vibes'); rule 179: done means he can see it, so this
   shoots the DEMO's map (the one driver, tools/bohemia_drive_the_demo.js, the fog lifted so every town shows) on his phone or a
   computer: the camera put on each town in turn (camLetGo, as a drag by hand), at four stops (the opening, mid, the step, the
   near end), the tiles let land, the glass round the town cut out; one sheet a stop with every town on it, side by side.
   THE LIKENESS (the measure the gate holds): each town drawn alone by the game's own painter (vbCityCore on the town's blocks,
   its streets and anything not the town cut away, at 48 texels a block), then compared pair by pair on what the eye reads first:
   its colours (a joint histogram of value and the two colour axes off the picture, the pairs' overlap), what stands there (the
   share of its ground under each kind of thing, its landmark and its variant a kind of their own, from the plan the painter drew), how tall (the
   share under each height) and how full (the share of its ground the picture shows built); likeness = 0.35 colour + 0.35 what
   stands + 0.15 heights + 0.15 fullness, 1 the same town. (Measured and dropped: the pictures' local texture, local binary
   patterns at one and three texels, scored 0.9 to 0.98 for every pair, towns and suburbs alike: it cannot tell them apart.) Same-tier pairs are the
   ones his words fear ('they can borrow from each other, especially if they're in the same tier, but still they look the same').
     node tools/bohemia_cook_every_town_its_own_10_25_26.js <label> [phone_portrait|computer] [look|like|both] [Town;Town...]
   -> records/target/cook_towns/<label>/{<stop>_<profile>.jpg, <town>_<stop>_<profile>.png, likeness.json}
   REFERENCE CHECK (the 9/4 standing duty): beside Battle Brothers' world map, where every town is its own drawing (a walled
   town's keep, a fishing village's huts on the shore, a mining camp's spoil) from where it stands and what it does; and real
   Las Vegas from above (downtown's blocks wall to wall, the north valley's ranches in their yards, a truck stop's canopy and
   rows of trailers on the 15). */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const LABEL = process.argv[2] || 'look';
const PROFILE = process.argv[3] || 'phone_portrait';
const MODE = process.argv[4] || 'both';
const PICK = process.argv[5] ? process.argv[5].split(';') : null;
const OUT = path.join(ROOT, 'records/target/cook_towns', LABEL);

/* in the page: every town drawn alone by the painter, and its descriptor (the same code the gate runs) */
const LIKENESS = function () {
  const list = (VB_TOWNS.list || []).slice();
  try { const R = window.BOH_REGION; if (R && R.ready && R.places) R.places.forEach(function (p) { const G = vbRegionPatchGeom(p); list.push(Object.assign(vbRegionTown(p, G), { region: 1, place: p })); }); } catch (_e) {}
  /* THE CONTROL: a twin of three towns, built by the same rules on the same blocks with the same faction, trade, ground,
     palette and landmark, only its lots rolled again: what two towns made the same way score, so the gate's line sits under it */
  ['Blues', 'Reds', 'Homeless'].forEach(function (nm) { const o = list.find(function (t) { return t.name === nm; }); if (!o || !o.plan) return;
    const mk0 = (o.plan.b.find(function (q) { return q.mk; }) || {}).v | 0;
    const plan = vbTownPlan({ name: nm + ' TWIN', n: o.n, tier: o.tier, u: o.u, trade: o.trade, road: vbTownRoads(o.x0, o.y0, o.n), seed: vbTownHash(nm + ' TWIN'), region: false, v: mk0 });
    list.push(Object.assign({}, o, { name: nm + ' TWIN', plan: plan, pal: o.pal, twin: nm })); });   /* its palette and its landmark's variant kept: only its lots rolled again */
  const S = 48, out = [];
  list.forEach(function (tw) {
    const n = tw.n, cls = new Uint8Array(n * n), live = new Uint8Array(n * n), sub = new Uint8Array(n * n), thm = new Uint8Array(n * n);
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
      let c = VB_CLASS.land, sb = 0, th = 255;
      if (tw.region) { c = tw.plan && tw.plan.g ? (tw.tier === 1 ? VB_CLASS.roof : tw.tier === 2 ? VB_CLASS.houses : VB_CLASS.land) : VB_CLASS.land; }
      else { const t = om.at(tw.x0 + i, tw.y0 + j); c = vbClassOf(t && t.district); sb = vbSubOf(t && t.district); th = vbCookThemeOf(t && t.district); }
      cls[j * n + i] = c; sub[j * n + i] = sb; thm[j * n + i] = th; }
    const one = Object.assign({}, tw, { x0: tw.x0, y0: tw.y0 });
    const inp = tw.place ? vbRegionPatchInput(tw.place, S)   /* a region place: the game's own patch, its roads, its land cut away */
      : { kind: 'tile', N: n, NF: om.n, S: S, PAD: 0, hashPad: VB_CPAD, org: [tw.x0, tw.y0], seed: om.seed, cls: cls, live: live, sub: sub,
      thm: VB_COOK.themes ? thm : null, cook: VB_COOK.themes, key: 'like:' + tw.name, tx: 0, ty: 0, cutout: true, towns: [one], townPal: VB_TOWNS.pal };
    const r = vbCityCore(inp), P = r.P, d = r.day;
    /* the descriptor: colour (value 6 x a* 5 x b* 5, opaque texels only) and shape (edge direction 8 x strength 3) */
    const col = new Float32Array(150), Y = new Float32Array(P * P), chr = []; let nc = 0;
    for (let k = 0; k < P * P; k++) { const o = k * 4; if (d[o + 3] < 128) { Y[k] = -1; continue; }
      const R0 = d[o], G0 = d[o + 1], B0 = d[o + 2], y = 0.299 * R0 + 0.587 * G0 + 0.114 * B0, a = (R0 - G0) * 0.5, b = (R0 + G0) * 0.25 - B0 * 0.5;
      Y[k] = y; chr.push(Math.hypot(a, b)); const vi = Math.min(5, Math.floor(y / 256 * 6)), ai = Math.max(0, Math.min(4, Math.floor((a + 25) / 10))), bi = Math.max(0, Math.min(4, Math.floor((b + 25) / 10)));
      col[vi * 25 + ai * 5 + bi]++; nc++; }
    /* what stands there and how tall: the share of the town's ground under each kind of thing its plan built (its landmark a
       kind of its own), and the share under each height (0-1, 1-2, 2-3, 3-5, 5-8, 8 and up, in T) */
    const KN = {}; Object.keys(VB_TOWN_K).forEach(function (z) { KN[VB_TOWN_K[z]] = z; });
    const make = {}, hts = [0, 0, 0, 0, 0, 0]; let area = 0;
    (tw.plan && tw.plan.b || []).forEach(function (q) { const ar = (q.x1 - q.x0) * (q.y1 - q.y0), k = q.mk ? 'mark:' + q.mk + ':' + (q.v | 0) : KN[q.k] || String(q.k); make[k] = (make[k] || 0) + ar; area += ar;
      const hh = q.mk ? 6 : q.h || (q.k === VB_TOWN_K.shacks || q.k === VB_TOWN_K.trailers || q.k === VB_TOWN_K.cont ? 1.6 : q.k === VB_TOWN_K.tents ? 1 : 0.3);
      hts[hh < 1 ? 0 : hh < 2 ? 1 : hh < 3 ? 2 : hh < 5 ? 3 : hh < 8 ? 4 : 5] += ar; });
    Object.keys(make).forEach(function (k) { make[k] /= area || 1; }); for (let t = 0; t < 6; t++) hts[t] /= area || 1;
    /* how much of the ground a lot can stand on carries one (inside the wall, off the streets): a town, never a lot */
    let free = 0, used = 0; const PLN = tw.plan, IN = PLN && PLN.IN != null ? PLN.IN : (tw.tier === 1 ? 5 : tw.tier === 2 ? 4 : 1);
    if (PLN) for (let y = IN; y < PLN.L - IN; y++) for (let x = IN; x < PLN.L - IN; x++) { const bi = Math.floor(x / 12), bj = Math.floor(y / 12), rx = x - bi * 12, ry = y - bj * 12;
      if ((PLN.road && PLN.road[bj * n + bi]) || rx < 1 || rx > 10 || ry < 1 || ry > 10) continue; free++; if (PLN.g[y * PLN.L + x] >= 0) used++; }   /* the plan's own streets */
    chr.sort(function (p, q) { return p - q; });
    const meanH = (function () { let s0 = 0, a0 = 0; (tw.plan && tw.plan.b || []).forEach(function (q) { if (q.mk) return; const ar = (q.x1 - q.x0) * (q.y1 - q.y0), hh = q.mk ? 6 : q.h || (q.k === VB_TOWN_K.shacks || q.k === VB_TOWN_K.trailers || q.k === VB_TOWN_K.cont || q.k === VB_TOWN_K.watch ? 1.6 : q.k === VB_TOWN_K.tents ? 1 : 0.3); s0 += ar * hh; a0 += ar; }); return a0 ? s0 / a0 : 0; })();

    /* how tall it stands (the painter's own count: built texels that are wall) and what its plan holds */
    const kinds = {}; (tw.plan && tw.plan.b || []).forEach(function (q) { const k = q.mk || Object.keys(VB_TOWN_K).find(function (z) { return VB_TOWN_K[z] === q.k; }) || q.k; kinds[k] = (kinds[k] || 0) + 1; });
    const hs = (tw.plan && tw.plan.b || []).filter(function (q) { return q.h; }).map(function (q) { return q.h; });
    out.push({ name: tw.name, twin: tw.twin || null, region: !!tw.region, tier: tw.tier, n: n, u: tw.u, trade: tw.trade, opaque: nc,
      col: Array.from(col).map(function (v) { return nc ? v / nc : 0; }), make: make, hts: hts, dens: nc / (n * S) / (n * S),
      kinds: kinds, meanH: +meanH.toFixed(2), lots: (tw.plan && tw.plan.b || []).length, filled: free ? +(used / free).toFixed(3) : 0, chroma: chr.length ? +chr[chr.length >> 1].toFixed(2) : 0,
      mark: (tw.plan && tw.plan.b || []).filter(function (q) { return q.mk; }).map(function (q) { return q.mk + ':' + (q.v | 0); })[0] || null,
      pal: tw.pal ? [tw.pal[1], tw.pal[2], tw.pal[3], tw.pal[15]] : null });
  });
  const ov = function (p, q) { let s = 0; for (let i = 0; i < p.length; i++) s += Math.min(p[i], q[i]); return s; };
  const pairs = [], twins = [];
  for (let i = 0; i < out.length; i++) for (let j = i + 1; j < out.length; j++) {
    const A = out[i], B = out[j];
    if ((A.twin || B.twin) && !(A.twin === B.name || B.twin === A.name)) continue;
    const c = ov(A.col, B.col), dn = 1 - Math.abs(A.dens - B.dens) / Math.max(A.dens, B.dens, 1e-6), ht = ov(A.hts, B.hts);
    let mk = 0; Object.keys(A.make).forEach(function (k) { mk += Math.min(A.make[k], B.make[k] || 0); });
    (A.twin || B.twin ? twins : pairs).push({ a: A.name, b: B.name, sameTier: A.tier === B.tier, region: A.region || B.region, colour: +c.toFixed(3), make: +mk.toFixed(3), heights: +ht.toFixed(3), density: +dn.toFixed(3),
                 like: +(0.35 * c + 0.35 * mk + 0.15 * ht + 0.15 * dn).toFixed(3) }); }
  pairs.sort(function (p, q) { return q.like - p.like; });
  return { towns: out.filter(function (o) { return !o.twin; }).map(function (o) { const z = Object.assign({}, o); delete z.col; return z; }), pairs: pairs, twins: twins, err: VB_TOWNS.err || null };
};

module.exports = { LIKENESS };
if (require.main === module) (async () => {
  process.chdir(ROOT);
  fs.mkdirSync(OUT, { recursive: true });
  const d = await D.open({ fog: false, profile: PROFILE });
  for (let i = 0; i < 160; i++) {
    const ok = await d.fr.evaluate(() => { try { if (typeof vbReady === 'function') vbReady(); return !!(VB && VB.day && VBC && VBC.day && VB_TOWNS.list); } catch (e) { return false; } });
    if (ok) break; await d.page.waitForTimeout(500);
  }
  if (MODE !== 'look') {
    const L = await d.fr.evaluate(LIKENESS);
    fs.writeFileSync(path.join(OUT, 'likeness_' + PROFILE + '.json'), JSON.stringify(L, null, 1));
    /* every town's look, for RUN TWO's settlement screens to follow (rule 186(b): 'no two read the same on the map or in their
       settlement screen'): where it stands, its trade and landmark, its palette (roof, tin, its colour, its tarps), what stands */
    const hex = c => c ? '#' + c.map(v => ('0' + Math.round(v).toString(16)).slice(-2)).join('') : null;
    const looks = { why: 'COOK [every town looks its own], rule 186(b); slices/BOHEMIA_CITY_WORLD.html __EVERY_TOWN_ITS_OWN__ draws these on the map', made: new Date().toISOString().slice(0, 10),
      towns: L.towns.map(t => ({ name: t.name, region: t.region, tier: ['', 'fortress', 'town', 'camp'][t.tier], u: t.u, stands: t.u >= 0.6 ? 'the heart of the city' : t.u >= 0.3 ? 'between' : 'the edge',
        trade: t.trade, landmark: t.mark, palette: t.pal ? { roof: hex(t.pal[0]), tin: hex(t.pal[1]), house_colour: hex(t.pal[2]), tarp: hex(t.pal[3]) } : null,
        what_stands: t.kinds, mean_height_T: t.meanH, filled: t.filled })) };
    fs.mkdirSync(path.join(ROOT, 'records/target/cook_towns'), { recursive: true });
    fs.writeFileSync(path.join(ROOT, 'records/target/cook_towns/BOHEMIA_EVERY_TOWN_ITS_OWN.json'), JSON.stringify(looks, null, 1));
    const top = L.pairs.slice(0, 8).map(p => p.a + ' ~ ' + p.b + ' ' + p.like).join('; ');
    console.log('LIKENESS', L.towns.length, 'towns,', L.pairs.length, 'pairs; most alike:', top, L.err ? 'ERR ' + L.err : '');
    console.log('TWINS (the control)', L.twins.map(p => p.a + ' ~ ' + p.b + ' ' + p.like).join('; '));
  }
  if (MODE !== 'like') {
    const names = PICK || await d.fr.evaluate(() => Object.keys(ctBases()).sort());
    const zb = await d.fr.evaluate(() => zoomBounds());
    const stops = [['opening', 1], ['mid', 1.8], ['step', 2.6], ['near', zb[1]]];
    const frameBox = await (await d.page.$('iframe')).boundingBox().catch(() => null);
    const shots = {};
    for (const [stop, z] of stops) {
      shots[stop] = [];
      for (const name of names) {
        const info = await d.fr.evaluate(async (a) => {
          const B = ctBases(), b = B && B[a.name]; if (!b) return { err: 'no base' };
          CZOOM = a.z; TW = TW0 * CZOOM; TH = TH0 * CZOOM;
          try { camLetGo(); } catch (_e) {}
          const put = () => { panX = ((city.x - city.y) - (b.x - b.y)) * TW / 2; panY = ((city.x + city.y) - (b.x + b.y + 1)) * TH / 2; };
          put(); MAP_GROUND.key = ''; render();
          for (let i = 0; i < 40; i++) { await new Promise(r => setTimeout(r, 250)); put(); MAP_GROUND.key = ''; render(); if (!VBT.busy && !VBT.want) break; }
          put(); MAP_GROUND.key = ''; render();
          const r = cv.getBoundingClientRect();
          return { x: r.left, y: r.top, w: r.width, h: r.height, TW, painted: !!vbTownPainted(a.name), flags: MAP_DREW ? (MAP_DREW.flags | 0) : -1 };
        }, { name, z });
        if (info.err) continue;
        const ox = (frameBox ? frameBox.x : 0) + info.x, oy = (frameBox ? frameBox.y : 0) + info.y;
        const cw = Math.min(360, info.w - 10), ch = Math.min(300, info.h - 40);
        const fn = path.join(OUT, name + '_' + stop + '_' + PROFILE + '.png');
        await d.page.screenshot({ path: fn, clip: { x: ox + info.w / 2 - cw / 2, y: oy + info.h / 2 - ch / 2 + 20, width: cw, height: ch } });
        shots[stop].push({ name, fn });
        console.log(stop, name, 'TW', Math.round(info.TW * 10) / 10, 'painted', info.painted);
      }
      /* one sheet a stop: every town side by side */
      const imgs = shots[stop].map(s => ({ name: s.name, src: 'data:image/png;base64,' + fs.readFileSync(s.fn).toString('base64') }));
      const b64 = await d.page.evaluate(async (a) => {
        const ims = await Promise.all(a.imgs.map(o => new Promise(r => { const i = new Image(); i.onload = () => r({ i, name: o.name }); i.src = o.src; })));
        const w = ims[0].i.width, h = ims[0].i.height, cols = 5, rows = Math.ceil(ims.length / cols), c = document.createElement('canvas');
        c.width = cols * (w + 4); c.height = rows * (h + 30) + 40;
        const x = c.getContext('2d'); x.fillStyle = '#111'; x.fillRect(0, 0, c.width, c.height);
        x.fillStyle = '#ddd'; x.font = 'bold 26px monospace'; x.fillText(a.title, 10, 30);
        ims.forEach((o, k) => { const X = (k % cols) * (w + 4), Y = 40 + Math.floor(k / cols) * (h + 30); x.drawImage(o.i, X, Y + 26); x.fillStyle = '#ddd'; x.font = 'bold 20px monospace'; x.fillText(o.name, X + 6, Y + 20); });
        return c.toDataURL('image/jpeg', 0.82).split(',')[1];
      }, { imgs, title: 'every town at the ' + stop + ' stop (' + LABEL + ', ' + PROFILE + ')' });
      fs.writeFileSync(path.join(OUT, 'sheet_' + stop + '_' + PROFILE + '.jpg'), Buffer.from(b64, 'base64'));
    }
  }
  if (d.errs && d.errs.length) console.log('PAGE ERRORS', d.errs.slice(0, 5));
  await d.close();
})().catch(e => { console.error(e); process.exit(1); });
