#!/usr/bin/env node
/* COOK THREE [the enemy tiers repainted] (rule 87; CHARACTER [the enemy tiers dressed] and
   REFERENCE CHECK (the 9/4 standing duty; added by DIRECTION 10/10 at the seam): the runway twin (reference/art_bank/
   character, photographs OWED), the revamp pass's people notes (one accent above the waist, folds not speckle:
   records/BOHEMIA_THE_REVAMP_PASS_ROUND_ONE_10_10_26.md), the wardrobe laws, AH-01 and AH-03.
   [armour you can see], his NO 'good idea, terrible implementation').
   PAINT ONLY. The six tiers are CHARACTER's table (same band pool, same added pieces, read
   from tools/bohemia_cook_the_enemy_tiers_dressed.js's rule, not reinvented). Each tier's
   ARMOUR is found by drawing its armour pieces (or, with none, its over-garments) ALONE on
   the bare body, and those pixels are repainted as a MATERIAL by luminance:
     padded (thug) quilt lines | leather (poacher, marksman) | mail (raider) a 1px weave |
     plate (leader, marauder) steel with lames and a lit top edge; the leader's trim gold.
   The light tiers read as cloth, the heavy as metal, the leader as the one you remember.
   Rule 89: before and after of the SAME six, one art pixel to one pixel, plus the 28 px row.
   Palette: engine/bohemia_cook3_tier_paint.json. Out: records/cook3/enemy_tiers_repainted.png */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
const PAINT = JSON.parse(fs.readFileSync(path.join(ROOT, 'engine/bohemia_cook3_tier_paint.json'), 'utf8'));
const band = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/ours.json'), 'utf8')).people_looks.value.band;
const TIERS = [
  { id: 'brigand_thug', label: 'THUG', add: {} },
  { id: 'brigand_poacher', label: 'POACHER', add: {} },
  { id: 'brigand_marksman', label: 'MARKSMAN', add: {} },
  { id: 'brigand_raider', label: 'RAIDER', add: { outer: 'STORM VEST' } },
  { id: 'brigand_leader', label: 'LEADER', add: {} },
  { id: 'brigand_marauder', label: 'MARAUDER', add: { back: 'CHARCOAL ROAD CAPE', gear: 'STEEL SPIKED PAULDRON' } }
].map(t => Object.assign(t, { faction: band[t.id][0].replace('faction_', '') }));
const OUT = path.join(ROOT, 'records/cook3/enemy_tiers_repainted.png');

(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1200, height: 900 } });
  await p.goto('file://' + ALPHA, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.FACTION_LOOKS && typeof rebuildFromRig === 'function', { timeout: 90000 });
  const res = await p.evaluate(({ TIERS, PAINT }) => {
    const lum = q => (q[0] * 0.3 + q[1] * 0.59 + q[2] * 0.11) / 255;
    const lerp = (a, c, t) => [a[0] + (c[0] - a[0]) * t, a[1] + (c[1] - a[1]) * t, a[2] + (c[2] - a[2]) * t];
    const ramp = (st, l) => { const k = Math.min(st.length - 1.0001, Math.max(0, l * 1.3 * (st.length - 1))), i = Math.floor(k); return lerp(st[i], st[i + 1], k - i); };
    const same = (a, c) => a && c && a[0] === c[0] && a[1] === c[1] && a[2] === c[2];
    const keepW = window.G_WORN, keepD = G.bodyVar, keepA = G.age, keepE = {};
    for (const s in G.equipped) { keepE[s] = G.equipped[s]; G.equipped[s] = ''; }
    const frameWith = (w, f) => { window.G_WORN = w; G.bodyVar = f.dials; G.age = f.age || 'adult'; rebuildFromRig();
      try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {} return buildFrame('S', 'idle', 0.25, true); };
    const out = [];
    try {
      for (const t of TIERS) {
        const f = FACTION_LOOKS.find(x => x.faction.toLowerCase() === t.faction.toLowerCase());
        const worn = Object.assign({}, f.worn, t.add);
        const fr = frameWith(worn, f), naked = frameWith({}, f), W = fr.CW, H = fr.CH;
        const slots = Object.keys(t.add).length ? Object.keys(t.add) : ['outer', 'back'].filter(k => worn[k]).concat(worn.outer || worn.back ? [] : ['base']);
        let armour = fr.px.map(() => false);
        for (const k of slots) { const solo = frameWith({ [k]: worn[k] }, f);
          armour = armour.map((v, i) => v || (!!fr.px[i] && !!solo.px[i] && !same(solo.px[i], naked.px[i]) && same(solo.px[i], fr.px[i]))); }
        const R = PAINT.tiers[t.label];
        /* HEAVY TIERS: the armour is the whole chest (rig parts 3,4), cloth only, plus the added pieces;
           round 1 painted only the pieces and they were 188 to 445 pixels, invisible. */
        if (R.chest) armour = armour.map((v, i) => v || (!!fr.px[i] && (fr.grid[i] === 3 || fr.grid[i] === 4)));
        /* RAIDER round 2: the mail is a shirt, so it runs down the arms too: every clothed pixel above the hip */
        if (R.arms) { let t0 = 1e9, b0 = -1; fr.px.forEach((q, i) => { if (q && q[3] !== 0) { const y = (i / W) | 0; t0 = Math.min(t0, y); b0 = Math.max(b0, y); } });
          const hip = t0 + (b0 - t0) * 0.55; armour = armour.map((v, i) => v || (!!fr.px[i] && fr.px[i][3] !== 0 && fr.grid[i] !== 1 && fr.grid[i] !== 2 && fr.grid[i] !== 0 && ((i / W) | 0) < hip)); }
        const after = fr.px.map(q => q && q.slice());
        let top = 1e9; for (let i = 0; i < armour.length; i++) if (armour[i]) top = Math.min(top, (i / W) | 0);
        let n = 0;
        for (let i = 0; i < fr.px.length; i++) { if (!armour[i] || fr.px[i][3] === 0) continue; n++;
          const q = fr.px[i], l = lum(q), x = i % W, y = (i / W) | 0; let c;
          if (R.material === 'padded') { c = ramp(PAINT.padded, l); if ((y - top) % R.quilt === 0) c = lerp(c, [0, 0, 0], 0.3); }
          else if (R.material === 'leather') { c = ramp(PAINT.leather, l); if (R.strap && Math.abs((x - y) % 9) === 0) c = PAINT.leather[0]; }
          else if (R.material === 'mail') { c = ramp(PAINT.steel, l * ((x + y) % 2 ? 1.18 : 0.78)); }
          else { c = ramp(PAINT.steel, l + 0.08);
            if (R.lames && (y - top) % R.lames === 0) c = lerp(c, [0, 0, 0], 0.35);
            if (R.lames && (y - top) % R.lames === 1) c = lerp(c, [230, 230, 228], 0.3); }
          if (R.goldWash) c = lerp(c, ramp(PAINT.gold, l + 0.1), R.goldWash);
          const edge = !armour[i - W] || !armour[i - 1] || !armour[i + 1] || !armour[i + W];
          if (edge && R.trim === 'gold') c = ramp(PAINT.gold, l + 0.2);
          else if (edge && (R.material === 'plate' || R.material === 'mail') && !armour[i - W]) c = lerp(c, [240, 238, 232], 0.45);
          after[i] = [c[0] | 0, c[1] | 0, c[2] | 0];
        }
        out.push({ label: t.label, faction: f.faction, W, H, armourPx: n, before: fr.px.map(q => q && q[3] !== 0 ? [q[0], q[1], q[2]] : 0), after: after.map((q, i) => q && fr.px[i][3] !== 0 ? [q[0], q[1], q[2]] : 0) });
      }
    } finally { window.G_WORN = keepW; G.bodyVar = keepD; G.age = keepA; for (const s in keepE) G.equipped[s] = keepE[s];
      try { rebuildFromRig(); HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {} }
    /* 28 px: box-average down to 28 tall, the size a body reads at far zoom */
    const shrink = (px, W, H) => { const h = 28, s = H / h, w = Math.round(W / s), o = [];
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let r = 0, g = 0, bb = 0, c = 0, a = 0;
        for (let yy = Math.floor(y * s); yy < Math.floor((y + 1) * s); yy++) for (let xx = Math.floor(x * s); xx < Math.floor((x + 1) * s); xx++) {
          a++; const q = px[yy * W + xx]; if (q) { r += q[0]; g += q[1]; bb += q[2]; c++; } }
        o.push(c > a / 2 ? [r / c | 0, g / c | 0, bb / c | 0] : 0); } return { px: o, W: w, H: h }; };
    const cw = Math.max(...out.map(o => o.W)), ch = Math.max(...out.map(o => o.H)), pad = 12;
    const cv = document.createElement('canvas'); cv.width = out.length * (cw + pad) + pad; cv.height = 2 * (ch + 30) + 2 * 60 + 40;
    const x = cv.getContext('2d'); x.fillStyle = '#2b2824'; x.fillRect(0, 0, cv.width, cv.height);
    const bg = out[0].before[0];
    const isBg = q => bg && q && q[0] === bg[0] && q[1] === bg[1] && q[2] === bg[2];
    const put = (px, W, H, ox, oy) => { const im = x.createImageData(W, H); px.forEach((q, i) => { if (q && !isBg(q)) { im.data.set([q[0], q[1], q[2], 255], 4 * i); } }); x.putImageData(im, ox, oy); };
    x.font = 'bold 11px monospace'; x.fillStyle = '#d8d0c0';
    x.fillText('BEFORE, 1:1', pad, 12); x.fillText('AFTER, 1:1 (armour painted as material)', pad, ch + 42);
    out.forEach((o, k) => { const ox = pad + k * (cw + pad);
      put(o.before, o.W, o.H, ox, 16); put(o.after, o.W, o.H, ox, ch + 46);
      x.fillStyle = '#d8d0c0'; x.font = '10px monospace'; x.fillText(o.label, ox, ch + 28); x.fillText(o.label, ox, 2 * ch + 58);
      const sb = shrink(o.before, o.W, o.H), sa = shrink(o.after, o.W, o.H);
      put(sb.px, sb.W, sb.H, ox, 2 * ch + 82); put(sa.px, sa.W, sa.H, ox + 30, 2 * ch + 82); });
    x.fillText('AT 28 PIXELS: before | after', pad, 2 * ch + 76);
    return { png: cv.toDataURL('image/png'), rows: out.map(o => ({ t: o.label, f: o.faction, armourPx: o.armourPx })) };
  }, { TIERS, PAINT });
  fs.writeFileSync(OUT, Buffer.from(res.png.split(',')[1], 'base64'));
  console.log(JSON.stringify(res.rows));
  await b.close();
})();
