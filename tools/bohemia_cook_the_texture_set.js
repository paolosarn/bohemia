#!/usr/bin/env node
/* THE TEXTURE SET (10/17/26, CHARACTER, [the texture set], rule 110's big swing).
 *
 * WHY: the MODE line, 10/16: "the runway clothes as the texture set the rig can wear, with the
 * attach points from [the body in meters]." DIRECTION's master rig (564e1b1, records/
 * BOHEMIA_THE_MASTER_RIG_10_16_26.md) now renders a model in eight facings at 57 px a metre;
 * it has no clothes. Every garment this lane owns is a CALL INTO THE FORMULA (a gen() that
 * stamps pixels onto the formula's part grid), which a model cannot call. So this tool cuts
 * every canon garment OFF the formula, one piece per body part per facing, and writes each
 * piece with where it attaches in real metres, so the rig can put the same clothes on its man.
 *
 * READ LIVE, NEVER RE-DERIVED: the alpha is opened through the established driver and the
 * engine's own buildFrame(d,'idle',0) draws the bare body and the body wearing ONE garment;
 * the garment is exactly the pixels that changed, and each changed pixel is looked up in the
 * part grid buildFrame already returns (which bone is under this pixel), the way the hem gate
 * does it (gates/hem_follows_the_leg_gate.js). A changed pixel OUTSIDE the silhouette (a coat
 * skirt across the leg gap, a brim over the head) has no bone under it; it is given to the
 * nearest bone and COUNTED as overhang, never silently.
 *
 * THE JOINTS ARE [the body in meters]' JOINTS: the posed skeleton of the same idle frame
 * (neck, shL/shR, elL/elR, handL/handR, waA/waB/waC, knA/knB, footA/footB, headTop), read off
 * posedSkel, never typed in. Which joint owns which part is MEASURED per facing (the nearest
 * joint of that part's kind to the part's own pixels), because the formula swaps screen
 * sides per facing (ARMSIDE, A/B legs) and a name would be wrong half the time.
 *
 * THE RULER: 57 px a metre (records/BOHEMIA_THE_BODY_IN_METERS_10_13_26.md; the rig's own
 * rig.json carries the same ppm). The ground is the bare body's lowest opaque row in that
 * facing, the centre line is waC. Up is positive metres.
 *
 * THE MEDIAN BODY: every piece is cut with G.bodyVar = {} (no dials), because the rig's man is
 * the median man; an outfit's dials are the look's, not the cloth's.
 *
 * THE SHIP TEST, MEASURED NOT CLAIMED: for all 25 outfits the game ships (13 FACTION_LOOKS +
 * 12 CITY_CAST_LOOKS), in all 8 facings, the pieces are put BACK on the bare body in the
 * formula's own layer order and compared pixel for pixel with the formula drawing the whole
 * outfit at once. The count of pixels that disagree is written down per outfit per facing,
 * and the worst is named. A set that cannot rebuild the body it was cut from is not a set.
 *
 * WHAT THIS DOES NOT DO: nothing to slices/, engine/ or the demo (rule 100); the formula is
 * read, never edited (rule 101c). It writes to records/character/texture_set/ only (not records/target: the site publishes that folder whole and it is already over size); the VOTE sheet alone goes to records/target/character/.
 *
 * Run: node tools/bohemia_cook_the_texture_set.js
 *
 * REFERENCE CHECK (the 9/4 standing duty): the compare law, the approved asset index (the
 * packs hold no people: COOK [the two holes], 0 of 8,674 tiles; the twin of a person is the
 * rig's own man, records/target/master_rig/man), the card of numbers, skills/bohemia-pixel-art
 * (the 112 box, 57 ppm, eight drawn facings), GARM-01 (cloth is value bands at sprite scale),
 * RNWY-13 (the two poles the thirteen are cut to), AH-01 and AH-03. A cut, not a drawing. No
 * reference game.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const ROOT = path.resolve(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const OUT = path.join(ROOT, 'records/character/texture_set');   // NOT records/target: the site publishes records/target whole and PAGES PUBLISH is red on size (PLUMBER [excavate]); only the VOTE sheet goes there
const PX_PER_M = 57;      // the lane's standing ruler, cited above, never re-measured here
const BOX = 112;
const FACINGS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];   // the rig's own order (rig.json)
/* the formula's own layer order when it dresses a body (buildFrame, "WHAT HE IS WEARING") */
const ORD = ['base', 'legs', 'feet', 'outer', 'waist', 'gear', 'back', 'neck', 'hands', 'hair', 'head', 'face'];
/* part ids as the formula uses them (SLOT_COVER and the skinner's comments), with the KIND of
   joint each one hangs from; which of the pair is measured per facing, never assumed */
const PART = {
  1: { name: 'skull', joints: ['headTop'] }, 2: { name: 'face', joints: ['headTop'] },
  3: { name: 'neck', joints: ['neck'] }, 4: { name: 'torso', joints: ['neck'] },
  5: { name: 'arm', joints: ['shL', 'shR'] }, 6: { name: 'arm', joints: ['shL', 'shR'] },
  7: { name: 'hand', joints: ['handL', 'handR'] }, 8: { name: 'hand', joints: ['handL', 'handR'] },
  9: { name: 'leg', joints: ['waA', 'waB'] }, 10: { name: 'leg', joints: ['waA', 'waB'] },
  11: { name: 'foot', joints: ['footA', 'footB'] }, 12: { name: 'foot', joints: ['footA', 'footB'] },
};

/* ---------- PNG out (RGBA and 8-bit grey), no library ---------- */
function crc32(buf) { let c = ~0; for (let i = 0; i < buf.length; i++) { c ^= buf[i]; for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xEDB88320 & -(c & 1)); } return ~c >>> 0; }
function chunk(type, data) { const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0); const body = Buffer.concat([Buffer.from(type), data]); const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body), 0); return Buffer.concat([len, body, crc]); }
function png(file, w, h, rows, colourType) { // rows: Buffer of h*(1+w*bpp)
  const sig = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = colourType; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  fs.writeFileSync(file, Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(rows, { level: 9 })), chunk('IEND', Buffer.alloc(0))]));
}
function rgbaCanvas(w, h) { return { w, h, buf: Buffer.alloc(h * (1 + w * 4)) }; }
function greyCanvas(w, h) { return { w, h, buf: Buffer.alloc(h * (1 + w)) }; }
function putRGBA(c, x, y, r, g, b) { const o = y * (1 + c.w * 4) + 1 + x * 4; c.buf[o] = r; c.buf[o + 1] = g; c.buf[o + 2] = b; c.buf[o + 3] = 255; }
function putGrey(c, x, y, v) { c.buf[y * (1 + c.w) + 1 + x] = v; }

/* ---------- the walk inside the page, one facing at a time ---------- */
const IN_PAGE = `(function(d, ORD, PART){
  const keepW = window.G_WORN, keepE = G.equipped, keepD = JSON.stringify(G.bodyVar || {});
  const clear = () => { try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {} };
  const SLOTS = ['hat','glasses','hair','shirt','jacket','pants','shoes'];
  const bare = () => { const eq = {}; for (const k in keepE) eq[k] = keepE[k]; for (const s of SLOTS) eq[s] = ''; return eq; };
  const b64 = (u8) => { let s = ''; for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000)); return btoa(s); };
  const out = { d, err: [] };
  try {
    G.bodyVar = {}; rebuildFromRig(); clear();            // THE MEDIAN BODY
    G.equipped = bare(); window.G_WORN = {}; clear();
    const base = buildFrame(d, 'idle', 0);
    const W = base.CW, H = base.CH; out.W = W; out.H = H;
    if (W !== 112 || H !== 112) { out.err.push('frame is ' + W + 'x' + H + ', not the 112 box'); }
    /* the joints of THIS frame, posed, read not typed */
    const sk = posedSkel(d, 'idle', 0).sk; const J = {}; for (const k in sk) J[k] = [sk[k][0], sk[k][1]];
    out.joints = J;
    /* ground and centre */
    let groundRow = -1, pxOpaque = 0; for (let i = 0; i < base.px.length; i++) if (base.px[i]) { pxOpaque++; const y = (i / W) | 0; if (y > groundRow) groundRow = y; }
    out.groundRow = groundRow; out.centreX = J.waC[0]; out.bareOpaque = pxOpaque;
    /* which joint owns which part: the nearest of its kind to the part's own pixels, measured */
    const cen = {}; for (let i = 0; i < base.grid.length; i++) { const g = base.grid[i]; if (!g) continue; const c = cen[g] || (cen[g] = { n: 0, x: 0, y: 0 }); c.n++; c.x += i % W; c.y += (i / W) | 0; }
    out.partJoint = {}; out.partPx = {};
    for (const pid in PART) { const c = cen[pid]; out.partPx[pid] = c ? c.n : 0; if (!c) continue; const cx = c.x / c.n, cy = c.y / c.n;
      let best = null, bd = 1e9; for (const jn of PART[pid].joints) { const j = J[jn]; if (!j) continue; const dd = (j[0] - cx) * (j[0] - cx) + (j[1] - cy) * (j[1] - cy); if (dd < bd) { bd = dd; best = jn; } }
      out.partJoint[pid] = best; }
    /* nearest bone for a pixel off the body: a ring search over the bare grid, radius capped */
    const nearestPart = (i) => { const x = i % W, y = (i / W) | 0; for (let r = 1; r <= 16; r++) { let hit = 0, hits = {};
        for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue; const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue; const g = base.grid[ny * W + nx]; if (g) { hits[g] = (hits[g] || 0) + 1; hit++; } }
        if (hit) { let bp = 0, bn = -1; for (const k in hits) if (hits[k] > bn) { bn = hits[k]; bp = +k; } return bp; } }
      return 0; };
    const same = (a, c) => (!a && !c) || (a && c && a[0] === c[0] && a[1] === c[1] && a[2] === c[2]);
    /* ONE GARMENT AT A TIME */
    const canon = GARMENTS.filter(g => g && g.st === 'canon' && g.layer && typeof g.gen === 'function');
    out.garments = []; out.pieces = {};
    for (const gm of canon) {
      G.equipped = bare(); window.G_WORN = {}; window.G_WORN[gm.layer] = gm.n; clear();
      let fr; try { fr = buildFrame(d, 'idle', 0); } catch (e) { out.err.push('gen threw: ' + gm.n); continue; }
      const recs = []; const pieces = {};
      for (let i = 0; i < fr.px.length; i++) { const a = fr.px[i], c = base.px[i]; if (same(a, c)) continue;
        let part = fr.grid[i] || base.grid[i] || 0, over = 0; if (!part) { part = nearestPart(i); over = 1; }
        const x = i % W, y = (i / W) | 0;
        if (a) recs.push(i >> 8, i & 255, a[0], a[1], a[2], part, over); else recs.push(i >> 8, i & 255, 0, 0, 0, part | 128, over); /* 128: the garment REMOVED a body pixel here (a hat hides hair); the rebuild must clear it */
        const p = pieces[part] || (pieces[part] = { part, n: 0, over: 0, minX: 1e9, minY: 1e9, maxX: -1, maxY: -1 });
        p.n++; p.over += over; if (x < p.minX) p.minX = x; if (y < p.minY) p.minY = y; if (x > p.maxX) p.maxX = x; if (y > p.maxY) p.maxY = y; }
      out.garments.push({ n: gm.n, layer: gm.layer, hem: gm.hem || null, hemDrop: gm.hemDrop == null ? null : gm.hemDrop, changed: recs.length / 7, data: b64(new Uint8Array(recs)), pieces: Object.values(pieces) });
    }
    /* SKIN SHADING IS NOT CLOTH, AND A GARMENT MAY READ WHAT IS UNDER IT. A gen() receives the part grid and
       the formula shades the SKIN under a mantle, a cape or a boot top one way and a SLEEVE under the same piece
       another way (measured on Church: the mantle paints the bare arm a lit gold and leaves a worn sleeve alone,
       496 px). A decal on a rigged model cannot know what is under it, so every pixel of every piece is cut TWICE:
       over the bare body and over a body already wearing a plain base shirt and trousers (the first canon base and
       legs on the rail). A pixel the garment paints on bare skin only is flagged 64: skin shading, applied only
       where skin still shows. A pixel painted both times in two colours is counted as READS UNDER. */
    const refBase = canon.find(g => g.layer === 'base'), refLegs = canon.find(g => g.layer === 'legs');
    out.readsUnderRef = { base: refBase && refBase.n, legs: refLegs && refLegs.n };
    /* MEASURED ON CHURCH, SECOND LOOK: a pair of TROUSERS drawn on a bare body repaints the bare ARMS (1,487 px
       changed, half of them sleeves), so the reference body is dressed in the two plain pieces MINUS the
       garment's own layer, for every garment including base and legs. */
    const refWorn = (lay) => { const w = {}; if (refBase && lay !== 'base') w.base = refBase.n; if (refLegs && lay !== 'legs') w.legs = refLegs.n; return w; };
    const underOf = {};
    for (const g of out.garments) {
      if (!underOf[g.layer]) { G.equipped = bare(); window.G_WORN = refWorn(g.layer); clear(); underOf[g.layer] = buildFrame(d, 'idle', 0); }
      const under = underOf[g.layer];
      G.equipped = bare(); window.G_WORN = refWorn(g.layer); window.G_WORN[g.layer] = g.n; clear();
      let fr2; try { fr2 = buildFrame(d, 'idle', 0); } catch (e) { g.readsUnder = null; continue; }
      const raw = atob(g.data); const u8 = new Uint8Array(raw.length); for (let k = 0; k < raw.length; k++) u8[k] = raw.charCodeAt(k);
      let both = 0, differ = 0, bareOnly = 0, cloth = 0;
      for (let k = 0; k < u8.length; k += 7) { const i = (u8[k] << 8) | u8[k + 1]; const part = u8[k + 5]; if (part & 128) continue;
        const a = fr2.px[i], un = under.px[i];
        if (same(a, un)) { /* not painted over the dressed body: skin shading */ u8[k + 5] = part | 64; bareOnly++; continue; }
        both++; cloth++; if (!a || a[0] !== u8[k + 2] || a[1] !== u8[k + 3] || a[2] !== u8[k + 4]) differ++; }
      g.data = b64(u8);
      g.readsUnder = { painted_both: both, differ, bare_only: bareOnly, share_differ: both ? +(differ / both).toFixed(3) : 0, share_bare_only: (both + bareOnly) ? +(bareOnly / (both + bareOnly)).toFixed(3) : 0 };
    }
    /* THE ROUND TRIP on every outfit the game ships, this facing */
    const looks = [].concat((window.FACTION_LOOKS || []).map(l => ({ id: 'faction:' + l.faction, worn: l.worn })), (window.CITY_CAST_LOOKS || []).map(l => ({ id: 'cast:' + (l.id || l.name || l.n), worn: l.worn })));
    const byName = {}; for (const g of out.garments) byName[g.n] = g;
    out.roundTrip = [];
    for (const lk of looks) {
      if (!lk.worn) continue;
      G.equipped = bare(); window.G_WORN = Object.assign({}, lk.worn); clear();
      let dressed; try { dressed = buildFrame(d, 'idle', 0); } catch (e) { out.err.push('outfit threw: ' + lk.id); continue; }
      /* rebuild: the bare body, then every worn garment's pieces in the formula's order */
      const comp = new Array(W * H); for (let i = 0; i < W * H; i++) comp[i] = base.px[i] ? base.px[i].slice() : null;
      const missing = [];
      for (const lay of ORD) { const nm = lk.worn[lay]; if (!nm) continue; const g = byName[nm]; if (!g) { missing.push(nm); continue; }
        const raw = atob(g.data); for (let k = 0; k < raw.length; k += 7) { const i = (raw.charCodeAt(k) << 8) | raw.charCodeAt(k + 1); const part = raw.charCodeAt(k + 5);
          if (part & 128) { comp[i] = null; continue; }
          if ((part & 64) && !same(comp[i], base.px[i])) continue;   /* skin shading only where skin still shows */
          comp[i] = [raw.charCodeAt(k + 2), raw.charCodeAt(k + 3), raw.charCodeAt(k + 4)]; } }
      let diff = 0, dressedOpaque = 0, onlyDressed = 0, onlyComp = 0, colour = 0;
      for (let i = 0; i < W * H; i++) { const a = dressed.px[i], c = comp[i]; if (a) dressedOpaque++; if (same(a, c)) continue; diff++; if (a && !c) onlyDressed++; else if (!a && c) onlyComp++; else colour++; }
      /* both frames, for the sheet: RGB or 0 */
      const flat = (px) => { const u = new Uint8Array(W * H * 4); for (let i = 0; i < W * H; i++) { const p = px[i]; if (!p) continue; u[i * 4] = p[0]; u[i * 4 + 1] = p[1]; u[i * 4 + 2] = p[2]; u[i * 4 + 3] = 255; } return b64(u); };
      out.roundTrip.push({ id: lk.id, diff, dressedOpaque, onlyDressed, onlyComp, colour, missing, dressed: flat(dressed.px), rebuilt: flat(comp) });
    }
    /* the bare body too, for the sheet */
    const u = new Uint8Array(W * H * 4); for (let i = 0; i < W * H; i++) { const p = base.px[i]; if (!p) continue; u[i * 4] = p[0]; u[i * 4 + 1] = p[1]; u[i * 4 + 2] = p[2]; u[i * 4 + 3] = 255; }
    out.bare = b64(u);
  } catch (e) { out.err.push('walk: ' + String(e).slice(0, 200)); }
  finally { window.G_WORN = keepW; G.equipped = keepE; try { G.bodyVar = JSON.parse(keepD); rebuildFromRig(); } catch (e) {} clear(); }
  return out;
})`;

async function walk() {
  const d = await D.open({ alpha: true });
  const per = {};
  try {
    await d.page.waitForFunction(() => typeof buildFrame === 'function' && window.GARMENTS && typeof posedSkel === 'function' && typeof rebuildFromRig === 'function', { timeout: 90000 });
    for (const f of FACINGS) {
      const t0 = Date.now();
      per[f] = await d.page.evaluate(`(${IN_PAGE})(${JSON.stringify(f)}, ${JSON.stringify(ORD)}, ${JSON.stringify(PART)})`);
      const r = per[f];
      console.log(`  ${f}: ${r.garments ? r.garments.length : 0} garments, ${r.roundTrip ? r.roundTrip.length : 0} outfits, ${((Date.now() - t0) / 1000).toFixed(1)} s` + (r.err.length ? '  ERR ' + r.err.slice(0, 3).join(' | ') : ''));
    }
  } finally { await d.close(); }
  return per;
}

function main() {
  return walk().then(per => {
    fs.mkdirSync(path.join(OUT, 'outfits'), { recursive: true });
    const S = per.S; if (!S || !S.garments || !S.garments.length) throw new Error('the walk drew nothing');
    const names = S.garments.map(g => g.n);
    const byLayer = {}; for (const g of S.garments) (byLayer[g.layer] = byLayer[g.layer] || []).push(g.n);
    const manifest = {
      _readme: 'THE TEXTURE SET: every canon garment cut off the formula, one piece per body part per facing, with where it attaches in real metres. Read by the rig (DIRECTION [the master rig]). Written by tools/bohemia_cook_the_texture_set.js, never by hand. Coordinates: px are in the 112 box (x right, y down); at_joint is the piece\'s top-left corner minus its joint, in px and in metres; world_m is the same corner as metres right of the centre line (waC) and metres UP from the ground row. Atlas cells: atlas_<layer>.png, row = the garment\'s row, column = the facing\'s index (FACINGS); parts_<layer>.png is the same layout with the part id in each pixel (0 = not this garment; +64 = the garment paints this pixel on BARE SKIN ONLY, skin shading under the piece, apply only where skin shows; +128 = the garment REMOVES the body pixel there, the rebuild clears it).',
      made: '10/17/26', lane: 'character', row: '[the texture set]',
      ruler: { px_per_m: PX_PER_M, box_px: BOX, source: 'records/BOHEMIA_THE_BODY_IN_METERS_10_13_26.md; records/target/master_rig/man/rig.json ppm' },
      facings: FACINGS, layer_order: ORD, parts: PART,
      per_facing: {}, layers: {}, garments: [], round_trip: { outfits: [], summary: {} },
    };
    for (const f of FACINGS) { const r = per[f]; manifest.per_facing[f] = { ground_row: r.groundRow, centre_x: r.centreX, joints: r.joints, part_joint: r.partJoint, part_px: r.partPx, bare_opaque: r.bareOpaque, errors: r.err }; }
    /* atlases per layer */
    const cellOf = {};
    for (const layer in byLayer) {
      const rows = byLayer[layer].length; const w = BOX * FACINGS.length, h = BOX * rows;
      const A = rgbaCanvas(w, h), P = greyCanvas(w, h);
      byLayer[layer].forEach((n, row) => { cellOf[n] = row; });
      for (let fi = 0; fi < FACINGS.length; fi++) {
        const r = per[FACINGS[fi]]; const idx = {}; r.garments.forEach(g => { idx[g.n] = g; });
        for (const n of byLayer[layer]) { const g = idx[n]; if (!g) continue; const raw = Buffer.from(g.data, 'base64');
          for (let k = 0; k < raw.length; k += 7) { const i = (raw[k] << 8) | raw[k + 1]; const x = i % BOX, y = (i / BOX) | 0; const part = raw[k + 5];
            const ax = fi * BOX + x, ay = cellOf[n] * BOX + y; if (!(part & 128)) putRGBA(A, ax, ay, raw[k + 2], raw[k + 3], raw[k + 4]); putGrey(P, ax, ay, part); } }
      }
      png(path.join(OUT, 'atlas_' + layer + '.png'), w, h, A.buf, 6);
      png(path.join(OUT, 'parts_' + layer + '.png'), w, h, P.buf, 0);
      manifest.layers[layer] = { atlas: 'atlas_' + layer + '.png', parts: 'parts_' + layer + '.png', rows, cell_px: BOX, garments: byLayer[layer] };
    }
    /* the garments with their pieces and attach points */
    let totalPieces = 0, totalOver = 0, totalPx = 0;
    for (const n of names) {
      const s = S.garments.find(g => g.n === n); const ent = { n, layer: s.layer, hem: s.hem, hem_drop: s.hemDrop, row: cellOf[n], facings: {} };
      for (const f of FACINGS) { const r = per[f]; const g = r.garments.find(x => x.n === n); if (!g) { ent.facings[f] = null; continue; }
        const pieces = g.pieces.filter(p => p.part > 0).map(p => { const pid = p.part & 127; const jn = r.partJoint[pid] || PART[pid].joints[0]; const j = r.joints[jn] || [r.centreX, r.groundRow];
          totalPieces++; totalOver += p.over; totalPx += p.n;
          return { part: pid, part_name: PART[pid].name, joint: jn, box_px: [p.minX, p.minY, p.maxX - p.minX + 1, p.maxY - p.minY + 1], px: p.n, overhang_px: p.over,
            at_joint_px: [p.minX - j[0], p.minY - j[1]], at_joint_m: [+((p.minX - j[0]) / PX_PER_M).toFixed(3), +((p.minY - j[1]) / PX_PER_M).toFixed(3)],
            world_m: { x: +((p.minX - r.centreX) / PX_PER_M).toFixed(3), up: +((r.groundRow - p.minY) / PX_PER_M).toFixed(3), w: +(((p.maxX - p.minX + 1)) / PX_PER_M).toFixed(3), h: +(((p.maxY - p.minY + 1)) / PX_PER_M).toFixed(3) } }; });
        const loose = g.pieces.find(p => p.part === 0);
        ent.facings[f] = { changed_px: g.changed, pieces, loose_px: loose ? loose.n : 0 }; }
      ent.reads_under = s.readsUnder === undefined ? null : s.readsUnder;
      manifest.garments.push(ent);
    }
    /* the round trip */
    let worst = null, exact = 0, total = 0, sumDiff = 0;
    for (const f of FACINGS) { const r = per[f]; for (const o of r.roundTrip) { total++; sumDiff += o.diff; if (o.diff === 0) exact++;
        manifest.round_trip.outfits.push({ id: o.id, facing: f, diff_px: o.diff, dressed_opaque_px: o.dressedOpaque, only_formula: o.onlyDressed, only_rebuilt: o.onlyComp, colour: o.colour, missing: o.missing });
        if (!worst || o.diff > worst.diff) worst = { id: o.id, facing: f, diff: o.diff, onlyDressed: o.onlyDressed, onlyComp: o.onlyComp, colour: o.colour }; } }
    manifest.round_trip.summary = { outfits_x_facings: total, pixel_exact: exact, mean_diff_px: total ? +(sumDiff / total).toFixed(2) : null, worst };
    const ru = manifest.garments.filter(g => g.reads_under && g.reads_under.share_differ > 0.05);
    const ss = manifest.garments.filter(g => g.reads_under && g.reads_under.share_bare_only > 0.05);
    manifest.reads_under = { reference: S.readsUnderRef, reads_under: ru.map(g => ({ n: g.n, layer: g.layer, share: g.reads_under.share_differ, painted_both: g.reads_under.painted_both })), shades_skin: ss.map(g => ({ n: g.n, layer: g.layer, share: g.reads_under.share_bare_only, bare_only_px: g.reads_under.bare_only })), rule: 'READS UNDER: more than 5% of the pixels a garment paints both on a bare and on a dressed body come out a different colour (a decal cannot do that; the rig gets the bare-body colours). SHADES SKIN: more than 5% of its pixels are painted on bare skin only (flag 64 in the parts map; apply only where skin shows).' };
    manifest.summary = { reads_under: ru.length, shades_skin: ss.length, canon_garments: names.length, layers: Object.keys(byLayer).length, pieces: totalPieces, garment_px: totalPx, overhang_px: totalOver, overhang_share: totalPx ? +(totalOver / totalPx).toFixed(4) : null };
    fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest));
    /* the outfits for the sheet: per outfit one PNG, row 1 the formula's eight, row 2 the rebuilt eight, row 3 the diff */
    const ids = S.roundTrip.map(o => o.id);
    for (const id of ids) { const w = BOX * FACINGS.length, h = BOX * 3; const C = rgbaCanvas(w, h);
      FACINGS.forEach((f, fi) => { const o = per[f].roundTrip.find(x => x.id === id); if (!o) return; const a = Buffer.from(o.dressed, 'base64'), b = Buffer.from(o.rebuilt, 'base64');
        for (let i = 0; i < BOX * BOX; i++) { const x = fi * BOX + i % BOX, y = (i / BOX) | 0;
          if (a[i * 4 + 3]) putRGBA(C, x, y, a[i * 4], a[i * 4 + 1], a[i * 4 + 2]);
          if (b[i * 4 + 3]) putRGBA(C, x, y + BOX, b[i * 4], b[i * 4 + 1], b[i * 4 + 2]);
          const sameP = a[i * 4 + 3] === b[i * 4 + 3] && a[i * 4] === b[i * 4] && a[i * 4 + 1] === b[i * 4 + 1] && a[i * 4 + 2] === b[i * 4 + 2];
          if (!sameP) putRGBA(C, x, y + 2 * BOX, 255, 40, 40); else if (a[i * 4 + 3]) putRGBA(C, x, y + 2 * BOX, 40, 40, 40); } });
      png(path.join(OUT, 'outfits', id.replace(/[^a-z0-9]+/gi, '_') + '.png'), w, h, C.buf, 6); }
    /* the bare body in eight, and the joints, for the sheet */
    { const w = BOX * FACINGS.length; const C = rgbaCanvas(w, BOX); FACINGS.forEach((f, fi) => { const a = Buffer.from(per[f].bare, 'base64'); for (let i = 0; i < BOX * BOX; i++) if (a[i * 4 + 3]) putRGBA(C, fi * BOX + i % BOX, (i / BOX) | 0, a[i * 4], a[i * 4 + 1], a[i * 4 + 2]); }); png(path.join(OUT, 'bare_eight.png'), w, BOX, C.buf, 6); }
    console.log(JSON.stringify({ summary: manifest.summary, round_trip: manifest.round_trip.summary, errors: FACINGS.map(f => per[f].err.length) }, null, 1));
    console.log('wrote', OUT);
  });
}
if (require.main === module) main().catch(e => { console.error(e); process.exit(1); });
module.exports = { main, FACINGS, PART, ORD, PX_PER_M };
