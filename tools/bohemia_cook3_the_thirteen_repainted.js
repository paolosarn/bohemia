#!/usr/bin/env node
/* COOK THREE [the thirteen repainted] (rule 87, Paolo 9/21 + 9/23 + 10/10).
   REFERENCE CHECK (the 9/4 standing duty; added by DIRECTION 10/10 at the seam): the rulers are the runway
   twin (reference/art_bank/character, the runway looks OWED from him or Grok), the wardrobe and face laws, AH-01
   and AH-03; the ground twin sheet's bar (an outline with a lit edge, wear per piece) holds for cloth too.
   THE PAINT LAYER, NOT THE RIG. CHARACTER keeps FACTION_LOOKS, the slots and the
   silhouettes; this tool never edits the alpha. It renders each of the thirteen on
   the real 112 rig (buildFrame), then repaints ONLY the cloth pixels:
     - pixels inside +-28 deg of the faction's own territory hue = THE ONE ACCENT.
       Hue kept (COLOUR IS TERRITORY), saturation pulled down (9/23 vibrance).
     - every other cloth pixel goes to the runway neutrals by its own luminance:
       black -> concrete -> bone, with oxblood as the warm shadow. Shading survives
       because the map is monotone in luminance; materials keep their highlights.
     - the outline is one pixel of near-black (the 1px law) on cloth edges.
   Colorful is FIVE ON PURPOSE: vibrance only, no neutral pass.
   The palette is engine/bohemia_cook3_runway_paint.json, which is the layer the
   draw reads once DIRECTION passes it. Out: records/cook3/thirteen_repainted.png */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
const PAINT = JSON.parse(fs.readFileSync(path.join(ROOT, 'engine/bohemia_cook3_runway_paint.json'), 'utf8'));
const OUT = process.env.OUT || path.join(ROOT, 'records/cook3/thirteen_repainted.png');
const ONLY = process.env.ONLY || '';

(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  await p.goto('file://' + ALPHA, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.FACTION_LOOKS
    && typeof rebuildFromRig === 'function' && typeof facWornColours === 'function', { timeout: 90000 });
  const res = await p.evaluate(({ PAINT, ONLY, LOOP }) => {
    const hueOf = (r, g, b) => { const mx = Math.max(r, g, b), mn = Math.min(r, g, b); if (mx === mn) return 0;
      let h = mx === r ? 60 * (((g - b) / (mx - mn)) % 6) : mx === g ? 60 * ((b - r) / (mx - mn) + 2) : 60 * ((r - g) / (mx - mn) + 4);
      return (h + 360) % 360; };
    const gap = (a, c) => { const d = Math.abs(((a - c) % 360 + 360) % 360); return d > 180 ? 360 - d : d; };
    const lum = q => (q[0] * 0.3 + q[1] * 0.59 + q[2] * 0.11) / 255;
    const lerp = (a, c, t) => [a[0] + (c[0] - a[0]) * t, a[1] + (c[1] - a[1]) * t, a[2] + (c[2] - a[2]) * t];
    const N = PAINT.neutrals; /* stops by luminance */
    const neutral = (l, warm) => {
      const st = warm ? N.warm : N.cool; const k = Math.min(st.length - 1.0001, Math.max(0, l * PAINT.lumStretch * (st.length - 1)));
      const i = Math.floor(k); return lerp(st[i], st[i + 1], k - i); };
    const worn = facWornColours();
    const keepW = window.G_WORN, keepD = G.bodyVar, keepA = G.age, keepE = {};
    for (const s in G.equipped) { keepE[s] = G.equipped[s]; G.equipped[s] = ''; }
    const out = [];
    try {
      for (const f of FACTION_LOOKS.filter(x => !ONLY || x.faction === ONLY)) {
        window.G_WORN = f.worn; G.bodyVar = f.dials; G.age = f.age || 'adult';
        rebuildFromRig(); try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
        const fr = buildFrame('S', 'idle', 0.25, true);
        /* THE CARRIER MASK (round 2): the accent rides ONE GARMENT, found by drawing the
           body again without it and keeping the pixels that changed. Outer coat first,
           then the back piece, then the shirt. Read-only: the alpha is never edited. */
        const rule0 = PAINT.factions[f.faction] || {};
        const acc0 = rule0.accentHue != null ? rule0.accentHue : (worn[f.faction] && worn[f.faction].coloured >= 0.35 ? worn[f.faction].hue : null);
        /* A GARMENT'S MASK: draw it ALONE on the bare body; its pixels are where that frame
           differs from the naked one, and it shows in the full frame where the full frame agrees.
           (Round 2 first tried 'take it off and diff' and it went blind wherever a coat sits
           over a shirt of the same colour: Blues, Church, Remnants.) */
        const frameWith = w => { window.G_WORN = w; rebuildFromRig(); try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
          return buildFrame('S', 'idle', 0.25, true); };
        const same = (a, c) => a && c && a[0] === c[0] && a[1] === c[1] && a[2] === c[2];
        const naked = frameWith({});
        const maskOf = k => { const solo = frameWith({ [k]: f.worn[k] });
          return fr.px.map((q, i) => !!q && !!solo.px[i] && !same(solo.px[i], naked.px[i]) && same(solo.px[i], q)); };
        /* the carrier is the over-garment that WEARS the territory hue most, not the first one listed */
        let carrier = fr.px.map(() => false), best = -1; const cands = [];
        for (const k of ['outer', 'back', 'base']) { if (!f.worn[k] || acc0 == null) continue;
          const m = maskOf(k); let n = 0;
          for (let i = 0; i < m.length; i++) if (m[i]) { const q = fr.px[i], mx = Math.max(q[0], q[1], q[2]), mn = Math.min(q[0], q[1], q[2]);
            if (mx && (mx - mn) / mx >= 0.2 && gap(hueOf(q[0], q[1], q[2]), acc0) <= PAINT.accentWindow) n++; }
          cands.push({ m, n }); if (n > best) best = n; }
        /* every garment holding at least half the best garment's territory pixels joins the carrier */
        for (const c of cands) if (best > 0 && c.n >= best * 0.5) carrier = carrier.map((v, i) => v || c.m[i]);
        window.G_WORN = f.worn; rebuildFromRig(); try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
        const W = fr.CW, H = fr.CH, rule = PAINT.factions[f.faction] || {};
        const acc = rule.accentHue != null ? rule.accentHue : (worn[f.faction] && worn[f.faction].coloured >= 0.35 ? worn[f.faction].hue : null);
        const after = fr.px.map(q => q && q.slice());
        let cloth = 0, kept = 0, satB = 0, satA = 0;
        let top = 1e9, bot = -1; for (let i = 0; i < fr.px.length; i++) if (fr.px[i]) { const y = (i / W) | 0; if (y < top) top = y; if (y > bot) bot = y; }
        const waist = top + Math.round((bot - top) * PAINT.accentAbove);
        const capWaist = rule.capWaist;
        let headBot = -1; for (let i = 0; i < fr.grid.length; i++) if (fr.grid[i] === 1 || fr.grid[i] === 2) headBot = Math.max(headBot, (i / W) | 0);
        for (let i = 0; i < fr.px.length; i++) {
          const q = fr.px[i]; if (!q) continue; const g = fr.grid[i];
          if (g === 1 || g === 2) continue;                        /* skin and face */
          if (!g && ((i / W) | 0) <= headBot) continue;            /* hair: PORTRAIT/CHARACTER's bank */
          cloth++;
          const mx = Math.max(q[0], q[1], q[2]), mn = Math.min(q[0], q[1], q[2]), s = mx ? (mx - mn) / mx : 0;
          satB += s; const l = lum(q); let c;
          if (rule.five && (!capWaist || ((i / W) | 0) <= waist)) { c = lerp(q, [l * 255, l * 255, l * 255], (rule.vibranceDown != null ? rule.vibranceDown : PAINT.vibranceDown)); kept++; }
          else if (acc != null && carrier[i] && (!capWaist || ((i / W) | 0) <= waist) && s >= 0.2 && gap(hueOf(q[0], q[1], q[2]), acc) <= PAINT.accentWindow) {
            let src = q;
            /* HIS COLOUR (DIRECTION round three, note 1): four factions read as one brown, so the
               accent is re-dyed to HIS territory colour (MFACTIONS acc) at the pixel's own light */
            if (rule.accentHex) { const h = rule.accentHex, hc = [parseInt(h.substr(1, 2), 16), parseInt(h.substr(3, 2), 16), parseInt(h.substr(5, 2), 16)];
              const k = Math.min(2.2, l / (lum(hc) || 0.01)); src = [hc[0] * k, hc[1] * k, hc[2] * k]; }
            c = lerp(src, [l * 255, l * 255, l * 255], (rule.vibranceDown != null ? rule.vibranceDown : PAINT.vibranceDown)); kept++; }
          else if (rule.innerBlack && ((i / W) | 0) <= waist) c = lerp(PAINT.neutrals.cool[0], PAINT.neutrals.cool[1], Math.min(1, l * 2));
          else c = neutral(l, rule.warm !== false);
          c = lerp(c, PAINT.ambient, PAINT.ambientPull);
          after[i] = [c[0] | 0, c[1] | 0, c[2] | 0, q[3] == null ? 255 : q[3]];
          const m2 = Math.max(...after[i].slice(0, 3)), n2 = Math.min(...after[i].slice(0, 3)); satA += m2 ? (m2 - n2) / m2 : 0;
        }
        /* FOLDS, NOT SPECKLE (DIRECTION round one, note 2): the source garments carry a dot noise
           over every coat, the recipe his second votes killed. Each cloth pixel is re-lit from the
           MEDIAN luminance of its 5x5 cloth neighbours (the speckle goes, the garment's own shading
           stays), then three creases are cut down the body: dark in the crease, lit on its left
           side, the light from one side like the pack's sacks and tarps. */
        const isCloth = i => { const q = after[i]; if (!q || q[3] === 0) return false; const g = fr.grid[i];
          return !(g === 1 || g === 2 || (!g && ((i / W) | 0) <= headBot)); };
        const lumA = after.map(q => q ? lum(q) : 0), folded = after.map(q => q && q.slice());
        let fx0 = 1e9, fx1 = -1; for (let i = 0; i < after.length; i++) if (isCloth(i)) { const xx = i % W; fx0 = Math.min(fx0, xx); fx1 = Math.max(fx1, xx); }
        for (let i = 0; i < after.length; i++) { if (!isCloth(i)) continue;
          const xx = i % W, yy = (i / W) | 0, ls = [];
          const RAD = PAINT.medianRadius || 2; for (let dy = -RAD; dy <= RAD; dy++) for (let dx = -RAD; dx <= RAD; dx++) { const j = (yy + dy) * W + xx + dx;
            if (xx + dx >= 0 && xx + dx < W && yy + dy >= 0 && yy + dy < H && isCloth(j) && (!PAINT.samePart || fr.grid[j] === fr.grid[i])) ls.push(lumA[j]); }
          ls.sort((a, c) => a - c); const med = ls[ls.length >> 1], q = after[i];
          let k = lumA[i] > 0.01 ? med / lumA[i] : 1; k = Math.max(PAINT.medianClamp ? PAINT.medianClamp[0] : 0.6, Math.min(PAINT.medianClamp ? PAINT.medianClamp[1] : 1.6, k));
          let c = [q[0] * k, q[1] * k, q[2] * k];
          const u = (xx - fx0) / Math.max(1, fx1 - fx0), vv = (yy - top) / Math.max(1, bot - top);
          /* FOLDS AT THE HIP AND THE KNEE ONLY (DIRECTION round three, note 2): round four's long
             creases read as rain on a lens. A fold is a short lit edge over a dark side. */
          for (const f0 of PAINT.folds) for (const band of PAINT.foldBands) {
            if (vv < band[0] || vv > band[1]) continue;
            const t = (vv - band[0]) / (band[1] - band[0]), fxp = f0 + (PAINT.foldSlant || 0.05) * (t - 0.5) * (f0 < 0.5 ? -1 : 1);
            const d = (u - fxp) * (fx1 - fx0);
            if (d >= -(PAINT.foldWidth || 0.5) && d < (PAINT.foldWidth || 0.5)) c = lerp(c, [0, 0, 0], 0.30);
            else if (d >= -(PAINT.foldWidth || 0.5) - 1 && d < -(PAINT.foldWidth || 0.5)) c = lerp(c, [255, 250, 240], 0.14); }
          /* ONE LIGHT (loop look 1): lit from the upper left, the far side and the hem fall off */
          if (PAINT.light) { const L = PAINT.light; const f2 = 1 + L.side * (0.5 - u) + L.top * (0.5 - vv);
            /* look 7: light is lit TOWARD bone (the light's colour), shade is multiplied down: a lit red goes dusty, never pink */
            c = f2 > 1 ? lerp(c, PAINT.neutrals.warm[3], (f2 - 1) * (L.toward || 0.8)) : [c[0] * f2, c[1] * f2, c[2] * f2]; }
          /* AUTHORED WEAR (DIRECTION note 3, AH-01 R10): mud on the boots of the ones who walk */
          if (rule.mud && vv > 0.9) { const ragged = ((xx * 7 + 3) % 5) / 20; if (vv > 0.9 + ragged * 0.5) c = lerp(c, PAINT.mud, 0.45); }
          /* CRISP BANDS (loop look 4): the light snapped to a few steps, like a pixel artist's ramp */
          if (PAINT.steps) { const L0 = lum(c), Lq = Math.round(L0 * PAINT.steps) / PAINT.steps, kk = L0 > 0.01 ? Lq / L0 : 1; c = [c[0] * kk, c[1] * kk, c[2] * kk]; }
          /* NO HOT HIGHLIGHT (loop look 5): a lit pixel loses colour as it rises, it never turns pink */
          if (PAINT.hiDesat) { const L1 = lum(c); if (L1 > PAINT.hiDesat) { const g = L1 * 255; c = lerp(c, [g, g, g], Math.min(1, (L1 - PAINT.hiDesat) * 3)); } }
          folded[i] = [Math.min(255, c[0]) | 0, Math.min(255, c[1]) | 0, Math.min(255, c[2]) | 0, q[3]]; }
        for (let i = 0; i < after.length; i++) after[i] = folded[i];
        /* ONE ACCENT: the carrier garment holds the territory, everything else goes to the runway neutrals */
        /* the one-pixel outline: an opaque cloth pixel touching empty goes near-black */
        const ol = after.map(q => q);
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = y * W + x, q = after[i]; if (!q) continue;
          const g = fr.grid[i]; if (g === 1 || g === 2 || (!g && y <= headBot)) continue;
          if (!after[i - 1] || !after[i + 1] || !after[i - W] || !after[i + W] || x === 0 || x === W - 1)
            ol[i] = PAINT.outlineSoft ? [q[0] * PAINT.outlineSoft | 0, q[1] * PAINT.outlineSoft | 0, q[2] * PAINT.outlineSoft | 0, 255] : PAINT.outline.concat([255]); }
        out.push({ f: f.faction, W, H, before: fr.px.map(q => q ? [q[0], q[1], q[2]] : 0), after: ol.map(q => q ? [q[0], q[1], q[2]] : 0),
          accent: acc, cloth, keptPct: cloth ? +(100 * kept / cloth).toFixed(1) : 0,
          satBefore: cloth ? +(satB / cloth).toFixed(3) : 0, satAfter: cloth ? +(satA / cloth).toFixed(3) : 0 });
      }
    } finally {
      window.G_WORN = keepW; G.bodyVar = keepD; G.age = keepA; for (const s in keepE) G.equipped[s] = keepE[s];
      try { rebuildFromRig(); HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
    }
    if (LOOP && out.length === 1) { const o = out[0];
      let t = 1e9, b2 = -1, l2 = 1e9, r2 = -1; o.after.forEach((q, i) => { if (q) { const y = (i / o.W) | 0, xx = i % o.W; t = Math.min(t, y); b2 = Math.max(b2, y); l2 = Math.min(l2, xx); r2 = Math.max(r2, xx); } });
      const bw = r2 - l2 + 1, bh = b2 - t + 1, Z = 6;
      const cv = document.createElement('canvas'); cv.width = bw * 2 + bw * Z + 120; cv.height = bh * Z + 20;
      const x = cv.getContext('2d'); x.fillStyle = '#3a362f'; x.fillRect(0, 0, cv.width, cv.height);
      const dot = (px, ox, oy, z) => { for (let y = t; y <= b2; y++) for (let xx = l2; xx <= r2; xx++) { const q = px[y * o.W + xx]; if (!q) continue; x.fillStyle = 'rgb(' + q[0] + ',' + q[1] + ',' + q[2] + ')'; x.fillRect(ox + (xx - l2) * z, oy + (y - t) * z, z, z); } };
      dot(o.before, 4, 4, 1); dot(o.after, bw + 8, 4, 1); dot(o.after, 2 * bw + 16, 4, Z);
      /* 16 px tall thumbnail, box average, drawn at 4x */
      const h16 = 16, sc = bh / h16, w16 = Math.max(1, Math.round(bw / sc));
      for (let y = 0; y < h16; y++) for (let xx = 0; xx < w16; xx++) { let R = 0, G = 0, B = 0, c = 0, a = 0;
        for (let yy = Math.floor(t + y * sc); yy < Math.floor(t + (y + 1) * sc); yy++) for (let x2 = Math.floor(l2 + xx * sc); x2 < Math.floor(l2 + (xx + 1) * sc); x2++) { a++; const q = o.after[yy * o.W + x2]; if (q) { R += q[0]; G += q[1]; B += q[2]; c++; } }
        if (c > a / 2) { x.fillStyle = 'rgb(' + (R / c | 0) + ',' + (G / c | 0) + ',' + (B / c | 0) + ')'; x.fillRect(4 + xx * 4, bh + 12 + y * 4, 4, 4); } }
      /* the candidate itself, 1x, transparent, for the rulebook's look.py */
      const cc = document.createElement('canvas'); cc.width = bw; cc.height = bh; const cx = cc.getContext('2d');
      const im = cx.createImageData(bw, bh); for (let y = t; y <= b2; y++) for (let xx = l2; xx <= r2; xx++) { const q = o.after[y * o.W + xx]; if (q) im.data.set([q[0], q[1], q[2], 255], 4 * ((y - t) * bw + xx - l2)); }
      cx.putImageData(im, 0, 0);
      return { png: cv.toDataURL('image/png'), cand: cc.toDataURL('image/png'), rows: [] }; }
    /* THE SHEET: two rows of thirteen (before, after), 2x, plus the runway palette card */
    const S = 2, pad = 10, cw = Math.max(...out.map(o => o.W)) * S, ch = Math.max(...out.map(o => o.H)) * S;
    const cv = document.createElement('canvas'); cv.width = out.length * (cw + pad) + pad; cv.height = 2 * (ch + 34) + 120;
    const x = cv.getContext('2d'); x.fillStyle = '#2b2824'; x.fillRect(0, 0, cv.width, cv.height);
    x.font = 'bold 13px monospace'; x.fillStyle = '#d8d0c0';
    x.fillText('BEFORE (what the street wears now)', pad, 16); x.fillText('AFTER (COOK THREE runway paint: black / concrete / bone / oxblood + one accent)', pad, ch + 50);
    out.forEach((o, k) => {
      for (const [row, px] of [[0, o.before], [1, o.after]]) {
        const ox = pad + k * (cw + pad), oy = 22 + row * (ch + 34);
        const img = x.createImageData(o.W * S, o.H * S);
        for (let yy = 0; yy < o.H * S; yy++) for (let xx = 0; xx < o.W * S; xx++) {
          const q = px[((yy / S) | 0) * o.W + ((xx / S) | 0)]; const j = 4 * (yy * o.W * S + xx);
          if (q) { img.data[j] = q[0]; img.data[j + 1] = q[1]; img.data[j + 2] = q[2]; img.data[j + 3] = 255; } }
        const t = document.createElement('canvas'); t.width = o.W * S; t.height = o.H * S; t.getContext('2d').putImageData(img, 0, 0);
        x.drawImage(t, ox, oy);
        x.font = '11px monospace'; x.fillStyle = '#d8d0c0'; x.fillText(o.f, ox, oy + ch + 12);
      }
    });
    const cy = 2 * (ch + 34) + 20; x.fillText('THE RUNWAY CARD (the twin until DIRECTION files the photographs)', pad, cy);
    PAINT.card.forEach((c, k) => { x.fillStyle = c.hex; x.fillRect(pad + k * 120, cy + 10, 110, 50);
      x.fillStyle = '#d8d0c0'; x.font = '10px monospace'; x.fillText(c.name, pad + k * 120, cy + 74); });
    return { png: cv.toDataURL('image/png'), rows: out.map(o => ({ f: o.f, accent: o.accent, cloth: o.cloth, keptPct: o.keptPct, satBefore: o.satBefore, satAfter: o.satAfter })) };
  }, { PAINT, ONLY, LOOP: !!process.env.LOOP });
  fs.writeFileSync(OUT, Buffer.from(res.png.split(',')[1], 'base64'));
  if (res.cand && process.env.CAND) fs.writeFileSync(process.env.CAND, Buffer.from(res.cand.split(',')[1], 'base64'));
  console.log(JSON.stringify(res.rows, null, 0).replace(/\},/g, '},\n'));
  await b.close();
})();
