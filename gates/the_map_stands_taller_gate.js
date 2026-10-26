#!/usr/bin/env node
/* ============================================================================
   THE MAP STANDS TALLER GATE (RUN 10/25, rule 196, row [the map stands taller, you walk behind it]).

   PAOLO 10/25: 'on the map I need the buildings to be taller taller taller... the way you move north, east and west, maybe the
   bottom of your legs, depending on how zoomed in zoomed out you are, are behind the buildings... or behind the freeway.'

   MEASURED BEFORE (2165008f, the painter kept beside this gate as the_map_stands_taller_2165008f_painter.txt and run on the same
   valley): a house a 2 T wall under a 1.6 T gable (block median 5.2 T), the freeway on a 3 T berm, and the crew and every party
   drawn over the whole painting: nothing ever stood in front of them.

   On the demo, through the one driver, phone and computer (node gates/the_map_stands_taller_gate.js [phone_portrait|computer]):
     H1 the houses about three times their 2165008f height (suburb and estate block medians, x2.8 to x3.4), on the glass at the
        far, opening and near stops (the px are printed)
     H2 everything else that stands at least twice (apartments, trailers, works, shops, towers, casinos, the freeway, the trees)
     H3 the order kept: a house under a works block under the towers, the Strip's casinos the tallest
     W1 behind a house (the near stop): part of him is covered, and the glass there is the building (the pixels match a frame
        with him not drawn at all)
     W2 behind a tower: most of him is covered, and his faint outline shows through
     W3 behind the freeway his legs are covered (a street with the freeway in front, its knots the tallest), and W3b walked over
        it he stands on its berm and steps down off it, never sunk in it
     W4 in the open he is whole, at the far, opening and near stops
     W5 a roaming party behind a tower is covered too
     W6 with him covered a tap on a town still travels
     W7 MUTATION: the depth off, W2 goes red
     C1 the cost: a frame at the near stop behind a tower within 6 ms of the same frame with the depth off, and the painting's
        depth a byte a pixel (at most 8 MB)
     C2 nothing threw
   ============================================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
const OLD = fs.readFileSync(path.join(__dirname, 'the_map_stands_taller_2165008f_painter.txt'), 'utf8');
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };

async function run(profile) {
  console.log('\n-- ' + profile + ' --');
  const d = await open({ profile, fog: false });
  const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 140)));
  for (let i = 0; i < 160; i++) { if (await fr.evaluate(() => !!(window.VBC && VBC.dep && om && om.n && window.VB_COOK && VB_COOK.themes && typeof MAP_DREW !== 'undefined' && MAP_DREW.you))) break; await page.waitForTimeout(500); }
  await page.waitForTimeout(1500);

  /* ---- H: the heights, the painter as it stands against the painter at 2165008f, on the same valley ---- */
  const H = await fr.evaluate((OLD) => {
    const KIND = { house: /^suburb$/, estate: /^(estate|gated)$/, trailer: /^trailer$/, apartment: /^apartment$/, works: /^(industrial|warehouse|storage)$/, shop: /^(commercial|mall|convention)$/,
      tower: /^(downtown|strat|highroller|medical|cityhall|courthouse)$/, casino: /^(resort|casino|luxor|sphere)$/, freeway: /^freeway$/, trees: /^(park|golf|cemetery)$/ };
    const oldCore = (0, eval)('(' + OLD.replace('return { seed: inp.seed', 'ST.HS = HS; return { seed: inp.seed') + ')');
    const inp = Object.assign({}, vbCityInput(), { wantH: true, towns: null, townPal: null });   /* the city's own blocks (a town's are COOK's) */
    const a = oldCore(inp).stand.HS, b = vbCityCore(inp).stand.HS, N = inp.N, S = inp.S, PAD = inp.PAD, P = (N + 2 * PAD) * S, T = Math.max(1, Math.round(S / 12)) / 2;
    const out = {};
    for (const k in KIND) { const A = [], B = [];
      for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { if (!KIND[k].test(om.at(x, y).district)) continue; let ma = 0, mb = 0;
        for (let v = (y + PAD) * S; v < (y + PAD + 1) * S; v++) for (let u = (x + PAD) * S; u < (x + PAD + 1) * S; u++) { const o = v * P + u; if (a[o] > ma) ma = a[o]; if (b[o] > mb) mb = b[o]; }
        if (ma > 0) { A.push(ma); B.push(mb); } }
      A.sort((p, q) => p - q); B.sort((p, q) => p - q);
      const q = (L, f) => L.length ? L[Math.min(L.length - 1, Math.floor(L.length * f))] / T : null;
      out[k] = { n: A.length, o: q(A, 0.5), w: q(B, 0.5), o9: q(A, 0.9), w9: q(B, 0.9) }; }
    const zb = zoomBounds(); out.__stops = { far: TW0 * zb[0], open: TW0, near: TW0 * zb[1], TH0: TH0, S: S };
    return out;
  }, OLD);
  const st = H.__stops, px = (t, tw) => Math.round(t * (tw * st.TH0 / st.open) / st.S * 10) / 10;
  const r = k => H[k] && H[k].o ? H[k].w / H[k].o : 0, f1 = v => Math.round(v * 100) / 100;
  const glass = k => H[k] ? 'a ' + k + ' ' + px(H[k].w, st.far) + ' / ' + px(H[k].w, st.open) + ' / ' + px(H[k].w, st.near) + ' px at the far / opening / near stops (was ' + px(H[k].o, st.far) + ' / ' + px(H[k].o, st.open) + ' / ' + px(H[k].o, st.near) + ')' : k + ' none';
  ok('H1 the houses about three times their 2165008f height', r('house') >= 2.8 && r('house') <= 3.4 && (!H.estate.n || (r('estate') >= 2.8 && r('estate') <= 3.4)),
     'x' + f1(r('house')) + ' and x' + f1(r('estate')) + '; ' + glass('house'));
  const others = ['apartment', 'trailer', 'works', 'shop', 'tower', 'casino', 'freeway', 'trees'].filter(k => H[k] && H[k].n);
  const low = others.filter(k => r(k) < 1.95);
  ok('H2 everything else that stands at least twice', others.length >= 6 && low.length === 0, others.map(k => k + ' x' + f1(r(k))).join(', ') + '; ' + glass('tower'));
  ok('H3 the order kept: a house under a works block under the towers, the Strip the tallest', H.house.w < H.works.w && H.works.w < H.tower.w && H.casino.w >= H.tower.w && H.casino.w9 >= H.tower.w9,
     'medians ' + ['house', 'works', 'tower', 'casino'].map(k => k + ' ' + Math.round(H[k].w) + ' T').join(' < '));

  /* ---- W: him, placed on the street where each thing stands in front of him, at each stop ---- */
  const place = (c, z) => fr.evaluate(([c, z]) => {
    TRAVEL = null; city.x = c[0]; city.y = c[1]; try { CITY_GLIDE.tx = null; } catch (e) {} try { camHold(); } catch (e) {} panX = 0; panY = 0;   /* a cut, never a glide from where he was */
    const zb = zoomBounds(); setZoomAt(z === 'far' ? zb[0] : z === 'open' ? 1 : z === 'mid' ? 2.4 : zb[1]); panX = 0; panY = 0; render(); render();
    return { share: MAP_DEPTH.you || 0, ghost: !!(MAP_DEPTH.last && MAP_DEPTH.last.ghost), TW };
  }, [c, z]);
  /* the cells to try: a street block with the kind on a block in front of it (nearer the camera), by how much of him it covers */
  const cands = await fr.evaluate(() => {
    const N = om.n, kind = (x, y) => { const t = om.at(x, y); return t ? vbClassOf(t.district) : -1; }, out = { house: [], tower: [], fwy: [], open: [] };
    for (let y = 2; y < N - 3; y++) for (let x = 2; x < N - 3; x++) { if (!cityWalkable(x, y) || kind(x, y) === VB_CLASS.freeway) continue;
      const f = [kind(x + 1, y + 1), kind(x, y + 1), kind(x + 1, y), kind(x + 2, y + 2), kind(x + 1, y + 2), kind(x + 2, y + 1)];
      if (f.slice(0, 3).some(k => k === VB_CLASS.houses) && vbSubOf(om.at(x, y + 1).district) === 0) out.house.push([x, y]);
      if (f.some(k => k === VB_CLASS.tower || k === VB_CLASS.casino)) out.tower.push([x, y]);
      if (f.some(k => k === VB_CLASS.freeway)) out.fwy.push([x, y]);
      const low = [VB_CLASS.road, VB_CLASS.blvd, VB_CLASS.land, VB_CLASS.field, VB_CLASS.water, VB_CLASS.lot];
      if (f.every(k => low.indexOf(k) >= 0) && kind(x + 3, y + 3) !== VB_CLASS.tower && kind(x + 3, y + 3) !== VB_CLASS.casino) out.open.push([x, y]); }
    const pick = (L, n) => { const o = []; const st = Math.max(1, Math.floor(L.length / n)); for (let i = 0; i < L.length && o.length < n; i += st) o.push(L[i]); return o; };
    return { house: pick(out.house, 24), tower: pick(out.tower, 12), fwy: pick(out.fwy, 30), open: pick(out.open, 4) };
  });
  const best = async (L, z) => { let b = null; for (const c of L) { const q = await place(c, z); if (!b || q.share > b.share) b = Object.assign({ c }, q); if (b.share >= 0.9) break; } return b; };
  /* his legs behind a house: the first street where a house covers part of him, not most (his outline is for most) */
  const part = async (L, z) => { let b = null; for (const c of L) { const q = await place(c, z); if (q.share >= 0.12 && q.share < 0.5) return Object.assign({ c }, q); if (!b || q.share > b.share) b = Object.assign({ c }, q); } return b; };
  const bh = await part(cands.house, 'near');
  /* the glass where he is covered is the building: the same frame drawn with nobody, and with the depth off */
  const glassIs = bh ? await fr.evaluate((c) => {
    const grab = () => { render(); const you = MAP_DREW.you, k = CV_DPR || 1, x0 = Math.max(0, Math.floor((you.x - you.w / 2) * k)), y0 = Math.max(0, Math.floor((you.y - you.h) * k)), w = Math.ceil(you.w * k), h = Math.ceil(you.h * k);
      return g.getImageData(x0, y0, w, h).data; };
    /* one moment for all three frames: the idle and the breath step on the beat, so the clock is held while they are taken */
    const now0 = performance.now(), keepNow = performance.now; performance.now = () => now0;
    let A, B, C;
    try { A = grab(); MAP_DEPTH.hide = true; B = grab(); MAP_DEPTH.hide = false; MAP_DEPTH.on = false; C = grab(); }
    finally { MAP_DEPTH.on = true; MAP_DEPTH.hide = false; performance.now = keepNow; } render();
    let his = 0, asB = 0, asC = 0, neither = 0;
    for (let i = 0; i < A.length; i += 4) { const dBC = Math.abs(B[i] - C[i]) + Math.abs(B[i + 1] - C[i + 1]) + Math.abs(B[i + 2] - C[i + 2]); if (dBC < 9) continue; his++;
      const dAB = Math.abs(A[i] - B[i]) + Math.abs(A[i + 1] - B[i + 1]) + Math.abs(A[i + 2] - B[i + 2]), dAC = Math.abs(A[i] - C[i]) + Math.abs(A[i + 1] - C[i + 1]) + Math.abs(A[i + 2] - C[i + 2]);
      if (dAB < 9) asB++; else if (dAC < 9) asC++; else neither++; }
    return { his, building: asB, him: asC, neither };
  }, bh.c) : null;
  ok('W1 behind a house at the near stop part of him is covered, and the glass there is the building', !!bh && bh.share >= 0.12 && !!glassIs && glassIs.building > 0 && glassIs.neither <= glassIs.his * 0.05,
     bh ? Math.round(bh.share * 100) + '% of him covered at ' + bh.c + ' (a block ' + Math.round(bh.TW) + ' px); of his ' + (glassIs ? glassIs.his : '?') + ' device px, ' + (glassIs ? glassIs.building + ' are the building, ' + glassIs.him + ' him, ' + glassIs.neither + ' neither' : '') : 'no house in front of a street');
  const bt = await best(cands.tower, 'near');
  ok('W2 behind a tower most of him is covered, and his faint outline shows', !!bt && bt.share >= 0.5 && bt.ghost, bt ? Math.round(bt.share * 100) + '% covered at ' + bt.c + ', outline ' + bt.ghost : 'no tower');
  const btm = bt ? await place(bt.c, 'mid') : null, bto = bt ? await place(bt.c, 'open') : null;
  if (btm) console.log('  (the same street behind the tower: ' + Math.round(btm.share * 100) + '% at a block ' + Math.round(btm.TW) + ' px, ' + Math.round(bto.share * 100) + '% at the opening zoom: the nearer the zoom, the more of him)');
  /* W3: walked north over the freeway and down its far side, every frame of the glide read: stepping down, the berm is between
     him and the camera and covers his feet; on the berm he stands on it (never sunk in it) */
  const fw = await fr.evaluate(async () => {
    const N = om.n, isF = (x, y) => { const t = om.at(x, y); return !!t && t.district === 'freeway'; };
    let w = null;
    for (let y = 3; y < N - 3 && !w; y++) for (let x = 3; x < N - 3 && !w; x++) { if (!isF(x, y) || isF(x, y - 1) || !cityWalkable(x, y - 1) || !cityWalkable(x, y + 1) || isF(x, y + 1) && isF(x, y + 2)) continue;
      if (isF(x, y + 1)) continue; w = { a: [x, y + 1], f: [x, y], b: [x, y - 1] }; }
    if (!w) return null;
    /* the walk on a held clock (a frame every 1/30 of a step, however slow the box), the glide's own: a to f, then f down to b */
    TRAVEL = null; city.x = w.a[0]; city.y = w.a[1]; CITY_GLIDE.tx = null; camHold(); const zb = zoomBounds(); setZoomAt(zb[1]); panX = 0; panY = 0; render();
    const real = performance.now; let T = real.call(performance) + 1000; performance.now = () => T;
    let mx = 0, onBerm = 0, n = 0;
    try {
      for (const c of [w.f, w.b]) { city.x = c[0]; city.y = c[1]; try { camHold(); } catch (e) {}
        for (let k = 0; k <= 30; k++) { T += BEAT / 30; render(); n++; const sh = MAP_DEPTH.you || 0;
          if (c === w.b && sh > mx) mx = sh;
          if (c === w.f && k === 30 && sh > 0.3) onBerm++; } }
    } finally { performance.now = real; }
    const at = [city.x, city.y]; render();
    return { w, mx, onBerm, n, at };
  });
  /* and the freeway in front of a street where it stands: its knots (the interchanges' flyovers) and its berm, at the near stop */
  const bf = await best(cands.fwy, 'near');
  ok('W3 behind the freeway his legs are covered (a street with the freeway in front of it, the near stop)', !!bf && bf.share >= 0.03,
     bf ? Math.round(bf.share * 100) + '% of him covered at ' + bf.c : 'no freeway in front of a street');
  ok('W3b walked north over the freeway he stands on its berm and steps down off it, never sunk in it', !!fw && fw.onBerm === 0 && fw.at[0] === fw.w.b[0] && fw.at[1] === fw.w.b[1],
     fw ? fw.onBerm + ' frames of ' + fw.n + ' sunk on the berm, ended at ' + fw.at + ' (stepping down, at most ' + Math.round(fw.mx * 100) + '% of him behind its edge)' : 'no freeway with a street either side');
  const opens = [];
  for (const c of cands.open.slice(0, 2)) for (const z of ['far', 'open', 'near']) { const q = await place(c, z); opens.push(z + ' ' + Math.round(q.share * 100) + '%'); if (q.share > 0.02) opens.push('!'); }
  ok('W4 in the open he is whole at the far, opening and near stops', cands.open.length > 0 && opens.indexOf('!') < 0, opens.join(', '));
  /* W5: a roaming party moved behind the same tower */
  const party = bt ? await fr.evaluate((c) => {
    city.x = c[0] - 2; city.y = c[1] - 2; render();
    const ps = partiesAll() || []; const p = ps.find(q => q && q.at); if (!p) return null;
    const keep = { x: p.at.x, y: p.at.y }, m0 = MAP_DEPTH.masked, c0 = MAP_DEPTH.covered;
    p.at.x = c[0]; p.at.y = c[1]; const sees = window.mapSees; window.mapSees = () => true; const fh = window.fogHides; window.fogHides = () => false;
    try { render(); render(); } finally { window.mapSees = sees; window.fogHides = fh; p.at.x = keep.x; p.at.y = keep.y; }
    return { masked: MAP_DEPTH.masked - m0, covered: MAP_DEPTH.covered - c0 };
  }, bt.c) : null;
  ok('W5 a roaming party behind a tower is covered too', !!party && party.covered > 0, party ? party.masked + ' drawn in depth, ' + party.covered + ' px covered' : 'no party');
  /* W6: covered, a tap on a town still travels */
  const tap = bt ? await fr.evaluate((c) => {
    TRAVEL = null; city.x = c[0]; city.y = c[1]; render(); const bs = ctBases(); let best = null, bd = 1e9;
    for (const n in bs) { const b = bs[n], dd = Math.max(Math.abs((b.x | 0) - c[0]), Math.abs((b.y | 0) - c[1])); if (dd > 4 && dd < bd) { bd = dd; best = { name: n, x: b.x | 0, y: b.y | 0 }; } }
    const share = MAP_DEPTH.you || 0; townTap(best); const go = !!(TRAVEL && TRAVEL.path && TRAVEL.path.length > 1); TRAVEL = null; return { share, go, to: best.name };
  }, bt.c) : null;
  ok('W6 with him covered a tap on a town still travels', !!tap && tap.go, tap ? Math.round(tap.share * 100) + '% covered, a tap on ' + tap.to + ': ' + (tap.go ? 'travels' : 'nothing') : '');
  /* W7: the mutation */
  const mut = bt ? await fr.evaluate(() => { MAP_DEPTH.on = false; try { render(); return MAP_DEPTH.you; } finally { MAP_DEPTH.on = true; } }) : null;
  const mutShare = bt ? await (async () => { await fr.evaluate(() => { MAP_DEPTH.on = false; }); const q = await place(bt.c, 'near'); await fr.evaluate(() => { MAP_DEPTH.on = true; }); return q.share; })() : 1;
  ok('W7 MUTATION: the depth off, W2 goes red', bt && mutShare < 0.5, 'with the depth off: ' + Math.round(mutShare * 100) + '% covered' + (mut != null ? '' : ''));
  /* C1: the cost */
  const cost = bt ? await fr.evaluate((c) => {
    TRAVEL = null; city.x = c[0]; city.y = c[1]; const zb = zoomBounds(); setZoomAt(zb[1]); panX = 0; panY = 0; render();
    const time = (on) => { MAP_DEPTH.on = on; const t0 = performance.now(); for (let i = 0; i < 12; i++) render(); return (performance.now() - t0) / 12; };
    time(true); const a = time(true), b = time(false), a2 = time(true); MAP_DEPTH.on = true;
    let tiles = 0; try { VBT.tiles.forEach(T => { if (T.dep) tiles += T.dep.length; }); } catch (e) {}
    return { on: Math.min(a, a2), off: b, dep: VBC.dep ? VBC.dep.length : 0, tiles };
  }, bt.c) : null;
  ok('C1 the cost: a frame behind a tower at the near stop within 6 ms of the depth off, the painting\'s depth at most 8 MB', !!cost && cost.on - cost.off <= 6 && cost.dep <= 8 * 1024 * 1024,
     cost ? cost.on.toFixed(1) + ' ms against ' + cost.off.toFixed(1) + ' ms; the painting\'s depth ' + (cost.dep / 1048576).toFixed(1) + ' MB, the close tiles\' ' + (cost.tiles / 1048576).toFixed(1) + ' MB' : '');
  ok('C2 nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  await d.close();
}

(async () => {
  const want = process.argv[2];
  const profiles = want ? [want] : ['phone_portrait', 'computer'];
  for (const p of profiles) { try { await run(p); } catch (e) { ok('the gate ran on ' + p, false, String(e.message).slice(0, 200)); } }
  console.log('\nTHE MAP STANDS TALLER: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
