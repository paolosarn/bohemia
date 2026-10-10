#!/usr/bin/env node
/* COOK THREE [the thirteen repainted] (rule 87, Paolo 9/21 + 9/23 + 10/10).
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
const OUT = path.join(ROOT, 'records/cook3/thirteen_repainted.png');

(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  await p.goto('file://' + ALPHA, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.FACTION_LOOKS
    && typeof rebuildFromRig === 'function' && typeof facWornColours === 'function', { timeout: 90000 });
  const res = await p.evaluate((PAINT) => {
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
      for (const f of FACTION_LOOKS) {
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
        let headBot = -1; for (let i = 0; i < fr.grid.length; i++) if (fr.grid[i] === 1 || fr.grid[i] === 2) headBot = Math.max(headBot, (i / W) | 0);
        for (let i = 0; i < fr.px.length; i++) {
          const q = fr.px[i]; if (!q) continue; const g = fr.grid[i];
          if (g === 1 || g === 2) continue;                        /* skin and face */
          if (!g && ((i / W) | 0) <= headBot) continue;            /* hair: PORTRAIT/CHARACTER's bank */
          cloth++;
          const mx = Math.max(q[0], q[1], q[2]), mn = Math.min(q[0], q[1], q[2]), s = mx ? (mx - mn) / mx : 0;
          satB += s; const l = lum(q); let c;
          if (rule.five) { c = lerp(q, [l * 255, l * 255, l * 255], PAINT.vibranceDown); kept++; }
          else if (acc != null && carrier[i] && s >= 0.2 && gap(hueOf(q[0], q[1], q[2]), acc) <= PAINT.accentWindow) {
            c = lerp(q, [l * 255, l * 255, l * 255], PAINT.vibranceDown); kept++; }
          else c = neutral(l, rule.warm !== false);
          c = lerp(c, PAINT.ambient, PAINT.ambientPull);
          after[i] = [c[0] | 0, c[1] | 0, c[2] | 0, q[3] == null ? 255 : q[3]];
          const m2 = Math.max(...after[i].slice(0, 3)), n2 = Math.min(...after[i].slice(0, 3)); satA += m2 ? (m2 - n2) / m2 : 0;
        }
        /* ONE ACCENT: the carrier garment holds the territory, everything else goes to the runway neutrals */
        /* the one-pixel outline: an opaque cloth pixel touching empty goes near-black */
        const ol = after.map(q => q);
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = y * W + x, q = after[i]; if (!q) continue;
          const g = fr.grid[i]; if (g === 1 || g === 2 || (!g && y <= headBot)) continue;
          if (!after[i - 1] || !after[i + 1] || !after[i - W] || !after[i + W] || x === 0 || x === W - 1)
            ol[i] = PAINT.outline.concat([255]); }
        out.push({ f: f.faction, W, H, before: fr.px.map(q => q ? [q[0], q[1], q[2]] : 0), after: ol.map(q => q ? [q[0], q[1], q[2]] : 0),
          accent: acc, cloth, keptPct: cloth ? +(100 * kept / cloth).toFixed(1) : 0,
          satBefore: cloth ? +(satB / cloth).toFixed(3) : 0, satAfter: cloth ? +(satA / cloth).toFixed(3) : 0 });
      }
    } finally {
      window.G_WORN = keepW; G.bodyVar = keepD; G.age = keepA; for (const s in keepE) G.equipped[s] = keepE[s];
      try { rebuildFromRig(); HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
    }
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
  }, PAINT);
  fs.writeFileSync(OUT, Buffer.from(res.png.split(',')[1], 'base64'));
  console.log(JSON.stringify(res.rows, null, 0).replace(/\},/g, '},\n'));
  await b.close();
})();
