/* COOK: THE ONE CELL SPRITE (9/27/26, CHARACTER, [small body])
 *
 * FIRST LINE UNDER RULE 34 (TWO SCALES, ONE GAME, Paolo 9/27, LOCKED). His words: "your
 * character stays tiny even as you zoom out and you move one grid at a time, that we had
 * originally... one house doesn't equal one tile, it's all fucked up." laws/
 * BOHEMIA_LAW_TWO_SCALES_ONE_GAME_9_27_26.md section 4: the walked person is ONE CELL, about
 * 28 px tall on a 32 px cell, cut from the 112 assets or redrawn small under the bible; the
 * 112 bodies stay as the HD source, never the walked sprite again.
 *
 * THE METHOD, STATED PLAINLY SO IT CAN BE JUDGED. This does not redraw a single pixel by
 * hand -- that is COOK's craft (MECHANISM-MINE / CONTENTS-PAOLO'S) and no hand art exists yet
 * at cell size. What this does is the MECHANICAL half the law also allows ("cut down... or
 * redrawn small"): take the game's own buildFrame output at the shipped 112 box and derive a
 * 32x32 cell sprite from it, honestly, with the method disclosed rather than hidden behind a
 * blur filter.
 *
 * THE DOWNSCALE. A naive nearest-neighbour sample at a 3.5x reduction throws away 15 of every
 * 16 source pixels at random -- a thin dark seam (a coat's edge, a hemline) can vanish or
 * survive by chance alone, which is exactly how a downscale LIES about what a person would
 * actually build small. Instead each destination cell samples its full source block (3 or 4
 * source px per axis, the block boundaries computed in float so nothing is dropped) and takes
 * the MOST COMMON opaque colour in that block -- the same principle behind every real pixel
 * art batch-downsizer (Aseprite's own "downsample" step). The block majority is taken twice,
 * once over colour and once over the rig's own part id, so skin can still be told from cloth
 * at cell size the same way the colour gate already does at 112.
 *
 * THE OUTLINE IS NOT PRESERVED, AND THAT IS NOT AN OVERSIGHT. The anatomy line law paints the
 * border as a darker shade of the LOCAL tone, one pixel, never black -- so at a block majority
 * it is a minority colour in almost every block and it disappears, the same way it would if a
 * person actually painted this body at 32x32 by hand. What replaces it, mechanically and
 * disclosed: every opaque destination pixel touching a transparent neighbour is darkened by a
 * flat 0.62, a rim shade, so the silhouette still separates from whatever it stands on. This
 * is a placeholder for COOK's hand, not a claim to be COOK's hand.
 *
 * WHAT THIS MEASURES, NOT ASSERTS. Two things could make a downscale a lie: two different
 * bodies could collapse into the same blob (STRUCTURE-NOT-COLOR dies at cell size) or a
 * faction's colour could wash out into nothing anybody could read (COLOUR IS TERRITORY dies at
 * cell size). Both are measured on the same rulers the 112 body already answers to -- the
 * front-width silhouette profile from the runway fit search, and the 30-degree hue bucket from
 * faction_colour_gate -- run again on the SMALL render, and the tool REFUSES TO WRITE if
 * either one collapses. A third guard: eight facings and a mid-stride walk frame are rendered
 * for one body and none may fall below a floor set from the SET'S OWN MEDIAN opaque pixel
 * count, so a facing that quietly renders almost nothing cannot pass by looking like a small
 * silhouette by accident.
 *
 * RIG CHECK (RIG IS LAW): renders only. G_WORN, G.equipped, G.bodyVar, G.age and both caches
 * restored. REUSE CHECK: nothing new is drawn; every garment and every skeleton already ships.
 * NOT WIRED (rule 18 / rule 34.6): the walked street still draws the shipped 112 sprites.
 * This produces the ASSET and measures it; wiring the honest grid to draw it is WORLD's
 * [honest grid] and RUN's [two scales], both still open.
 *
 * REFERENCE CHECK (COMPARE EVERY PIECE OF ART TO THE WORLD, 9/4):
 *   WALK-01  Pedro Medeiros, "readability survives a resize only if the silhouette carries
 *          the read, not the surface detail" -- the whole argument for measuring silhouette
 *          and colour rather than asserting the picture looks fine.
 *   RNWY-13  the two-pole study and its own failure line, "a figure that mixes both reads as
 *          neither" -- reused here as the silhouette-collapse guard at cell size.
 *   AH-01  our own analog horror bible. Nothing here is made strange on purpose; a small body
 *          on an honest grid is the most ordinary thing this game can draw once WORLD ships
 *          one.
 *
 *   node tools/bohemia_cook_the_one_cell_sprite.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const VOTE = path.join(REPO, 'slices/vote');
const PAGE = path.join(VOTE, 'CHARACTER_THE_ONE_CELL_SPRITE.html');
const OUT = path.join(REPO, 'records/BOHEMIA_THE_ONE_CELL_SPRITE_9_27_26.txt');

const CELL = 32;               /* the law's own default, section 5 */
const FRAMES = 8;              /* one walk cycle, in place, the game's own clip */
const DIRS8 = ['S','SE','E','NE','N','NW','W','SW'];

/* SEVEN FACTIONS, PICKED FOR SPREAD: every dial group at least once, and colours across the
   hue wheel so the colour-reads-at-cell-size test is not six shades of the same answer. */
const CAST = ['Blues', 'Reds', 'Church', 'Colorful', 'Network', 'Caravans', 'Anarchists'];

(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1000, height: 800 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  await p.goto('file://' + ALPHA, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.FACTION_LOOKS
    && typeof rebuildFromRig === 'function', { timeout: 90000 });

  const R = await p.evaluate(({ CELL, FRAMES, DIRS8, CAST }) => {
    const o = { still: [], walk8: null, err: null, missing: [] };
    const keepW = window.G_WORN, keepE = G.equipped;
    const keepD = JSON.stringify(G.bodyVar || {}), keepA = G.age;
    const clear = () => { try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {} };
    const SLOTS = ['hat', 'glasses', 'hair', 'shirt', 'jacket', 'pants', 'shoes'];
    const bare = () => { const eq = {}; for (const k in keepE) eq[k] = keepE[k];
                         for (const s of SLOTS) eq[s] = ''; return eq; };
    const hsv = (r, g, bb) => { const mx = Math.max(r, g, bb), mn = Math.min(r, g, bb), d = mx - mn;
      let h = 0; if (d) { if (mx === r) h = ((g - bb) / d) % 6; else if (mx === g) h = (bb - r) / d + 2;
        else h = (r - g) / d + 4; h *= 60; if (h < 0) h += 360; }
      return { h: h, s: mx ? d / mx : 0, v: mx / 255 }; };

    /* THE DOWNSCALE ITSELF. src is a buildFrame() result (px, grid, CW, CH). Returns a
       CELL x CELL array of {c:[r,g,b]|null, id} plus opaque count. */
    const downscale = (src) => {
      const SW = src.CW, SH = src.CH, sx = SW / CELL, sy = SH / CELL;
      const dst = new Array(CELL * CELL).fill(null);
      let opaque = 0;
      for (let dy = 0; dy < CELL; dy++) {
        const y0 = Math.floor(dy * sy), y1 = Math.max(y0 + 1, Math.floor((dy + 1) * sy));
        for (let dx = 0; dx < CELL; dx++) {
          const x0 = Math.floor(dx * sx), x1 = Math.max(x0 + 1, Math.floor((dx + 1) * sx));
          const colCount = {}, idCount = {}; let n = 0, tot = 0;
          for (let yy = y0; yy < y1 && yy < SH; yy++) for (let xx = x0; xx < x1 && xx < SW; xx++) {
            tot++; const i = yy * SW + xx; const q = src.px[i]; if (!q) continue;
            n++; const key = q[0] + ',' + q[1] + ',' + q[2];
            colCount[key] = (colCount[key] || 0) + 1;
            const idv = src.grid[i] || 0; idCount[idv] = (idCount[idv] || 0) + 1;
          }
          if (n * 2 < tot || n === 0) continue;   /* block majority-transparent -> transparent */
          let bestC = null, bestCN = -1; for (const k in colCount) if (colCount[k] > bestCN) { bestCN = colCount[k]; bestC = k; }
          let bestI = 0, bestIN = -1; for (const k in idCount) if (idCount[k] > bestIN) { bestIN = idCount[k]; bestI = +k; }
          const parts = bestC.split(',').map(Number);
          dst[dy * CELL + dx] = { c: parts, id: bestI }; opaque++;
        }
      }
      /* THE RIM SHADE, MECHANICAL, DISCLOSED: darken any opaque pixel touching a transparent
         neighbour. Fakes the contour the block-majority pass necessarily erased. */
      const out = dst.slice();
      for (let dy = 0; dy < CELL; dy++) for (let dx = 0; dx < CELL; dx++) {
        const i = dy * CELL + dx; if (!dst[i]) continue;
        let edge = false;
        for (const [ox, oy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
          const nx = dx + ox, ny = dy + oy;
          if (nx < 0 || ny < 0 || nx >= CELL || ny >= CELL || !dst[ny * CELL + nx]) { edge = true; break; }
        }
        if (edge) { const c = dst[i].c; out[i] = { c: [c[0]*0.62|0, c[1]*0.62|0, c[2]*0.62|0], id: dst[i].id }; }
      }
      return { px: out, opaque: opaque };
    };

    const shoot = (dials, worn, age, dir, clip, ph) => {
      G.equipped = bare(); window.G_WORN = worn;
      G.bodyVar = JSON.parse(JSON.stringify(dials || {})); G.age = age || 'adult';
      rebuildFromRig(); clear();
      const fr = buildFrame(dir, clip, ph);
      return { fr: fr, small: downscale(fr) };
    };

    /* THE SAME 16-SAMPLE FRONT WIDTH PROFILE the runway fit search and its wiring used,
       computed on the CELL alpha mask instead of the 112 one, so "still distinct at cell
       size" is measured on the identical ruler as "distinct at 112". */
    const profile = (small) => {
      const rows = new Array(CELL).fill(0); let top = 1e9, bot = -1;
      for (let i = 0; i < small.px.length; i++) { if (!small.px[i]) continue;
        const y = (i / CELL) | 0; rows[y]++; if (y < top) top = y; if (y > bot) bot = y; }
      const span = Math.max(1, bot - top), wide = Math.max.apply(null, rows) || 1;
      const prof = [];
      for (let k = 0; k < 16; k++) prof.push(rows[Math.min(CELL - 1, top + Math.round(span * k / 15))] / wide);
      return prof;
    };
    const dist = (a, c) => { let s = 0; for (let i = 0; i < a.length; i++) s += Math.abs(a[i] - c[i]); return s / a.length; };

    /* THE SAME HUE-BUCKET COLOUR STRENGTH TEST faction_colour_gate runs at 112, run again on
       the small render's own majority ids, skin (1,2) and outline shading excluded the same
       way. */
    const hueRead = (small) => {
      const bins = {}; let n = 0;
      for (const q of small.px) { if (!q) continue; if (q.id === 1 || q.id === 2) continue;
        const c = hsv(q.c[0], q.c[1], q.c[2]); if (c.v < 0.12) continue;
        n++; const key = c.s < 0.18 ? 'neutral' : String((Math.round(c.h / 30) * 30) % 360);
        bins[key] = (bins[key] || 0) + 1; }
      const rank = Object.keys(bins).map(k => [k, bins[k]]).sort((a, c) => c[1] - a[1]);
      return { dom: rank[0] ? rank[0][0] : '-', n: n };
    };

    const toPNG = (small) => {
      const cv = document.createElement('canvas'); cv.width = CELL; cv.height = CELL;
      const g2 = cv.getContext('2d'); g2.imageSmoothingEnabled = false;
      const im = g2.createImageData(CELL, CELL), d = im.data;
      for (let i = 0; i < small.px.length; i++) { const q = small.px[i]; if (!q) continue;
        d[i*4] = q.c[0]; d[i*4+1] = q.c[1]; d[i*4+2] = q.c[2]; d[i*4+3] = 255; }
      g2.putImageData(im, 0, 0); return cv.toDataURL('image/png');
    };
    const toPNG112 = (fr) => {
      const cv = document.createElement('canvas'); cv.width = fr.CW; cv.height = fr.CH;
      const g2 = cv.getContext('2d'); g2.imageSmoothingEnabled = false;
      const im = g2.createImageData(fr.CW, fr.CH), d = im.data;
      for (let i = 0; i < fr.px.length; i++) { const q = fr.px[i]; if (!q) continue;
        d[i*4] = q[0]; d[i*4+1] = q[1]; d[i*4+2] = q[2]; d[i*4+3] = 255; }
      g2.putImageData(im, 0, 0); return cv.toDataURL('image/png');
    };

    try {
      for (const name of CAST) {
        const f = FACTION_LOOKS.filter(x => x.faction === name)[0];
        if (!f) { o.missing.push(name); continue; }
        const walk = []; let hue112 = null, hueSmall = null, prof112 = null, profSmall = null;
        for (let i = 0; i < FRAMES; i++) {
          const { fr, small } = shoot(f.dials, f.worn, f.age, 'E', 'walk', i / FRAMES);
          walk.push({ small: toPNG(small), big: i === 0 ? toPNG112(fr) : null, opaque: small.opaque });
          if (i === 0) {
            profSmall = profile(small); hueSmall = hueRead(small);
            /* the 112 read, same rulers, for the honest side-by-side */
            const bins112 = {}; let n112 = 0;
            for (let k = 0; k < fr.px.length; k++) { const q = fr.px[k]; if (!q) continue;
              const gv = fr.grid[k]; if (gv === 1 || gv === 2) continue;
              const c = hsv(q[0], q[1], q[2]); if (c.v < 0.12) continue;
              n112++; const key = c.s < 0.18 ? 'neutral' : String((Math.round(c.h / 30) * 30) % 360);
              bins112[key] = (bins112[key] || 0) + 1; }
            const rank112 = Object.keys(bins112).map(k => [k, bins112[k]]).sort((a, c) => c[1] - a[1]);
            hue112 = rank112[0] ? rank112[0][0] : '-';
            const rows = new Array(fr.CH).fill(0); let top = 1e9, bot = -1;
            for (let k = 0; k < fr.px.length; k++) { if (!fr.px[k]) continue;
              const y = (k / fr.CW) | 0; rows[y]++; if (y < top) top = y; if (y > bot) bot = y; }
            const span = Math.max(1, bot - top), wide = Math.max.apply(null, rows) || 1;
            prof112 = []; for (let k = 0; k < 16; k++) prof112.push(rows[Math.min(fr.CH - 1, top + Math.round(span * k / 15))] / wide);
          }
        }
        o.still.push({ faction: name, dial: null, walk: walk,
                       hue112: hue112, hueSmall: hueSmall.dom, huePx: hueSmall.n,
                       prof112: prof112, profSmall: profSmall,
                       minOpaque: Math.min.apply(null, walk.map(w => w.opaque)),
                       maxOpaque: Math.max.apply(null, walk.map(w => w.opaque)) });
      }

      /* EIGHT FACINGS, ONE BODY (Blues, broad, on Blues' own wired outfit), idle pose, so a
         facing that quietly renders almost nothing cannot hide inside an average. */
      const fb = FACTION_LOOKS.filter(x => x.faction === 'Blues')[0];
      const per = {};
      for (const d of DIRS8) { const { small } = shoot(fb.dials, fb.worn, fb.age, d, 'idle', 0);
        per[d] = { png: toPNG(small), opaque: small.opaque }; }
      o.walk8 = per;
    } catch (e) { o.err = String(e && e.message || e) + (e && e.stack ? ' | ' + e.stack.slice(0, 300) : ''); }
    window.G_WORN = keepW; G.equipped = keepE;
    G.bodyVar = JSON.parse(keepD); G.age = keepA; rebuildFromRig(); clear();
    return o;
  }, { CELL, FRAMES, DIRS8, CAST });
  await b.close();

  if (R.err) { console.error('THREW: ' + R.err); process.exit(3); }
  if (R.missing.length) { console.error('MISSING FACTIONS: ' + R.missing.join(', ')); process.exit(2); }

  /* *** THREE REFUSALS. THIS TOOL DOES NOT SHIP A CLAIM ITS OWN NUMBERS CONTRADICT. *** */
  const dist = (a, c) => { let s = 0; for (let i = 0; i < a.length; i++) s += Math.abs(a[i] - c[i]); return s / a.length; };

  /* 1. SILHOUETTE MUST STAY DISTINCT. Closest pair at cell size must not collapse toward the
     "same body twice" floor. The floor is measured, not invented: two renders of the SAME
     faction (frame 0 vs frame 0, i.e. distance 0 exactly) is the true floor; the requirement
     is that the closest DIFFERENT pair clears a fraction of what it cleared at 112, so a real
     collapse (many different bodies reading as one blob) cannot pass by accident. */
  const closest = (set, key) => { let m = Infinity, who = null;
    for (let i = 0; i < set.length; i++) for (let j = i + 1; j < set.length; j++) {
      const d = dist(set[i][key], set[j][key]); if (d < m) { m = d; who = [set[i].faction, set[j].faction]; } }
    return { d: m, who: who }; };
  const cp112 = closest(R.still, 'prof112'), cpSmall = closest(R.still, 'profSmall');
  const SILHOUETTE_FLOOR = cp112.d * 0.35;   /* cell size is a real simplification; this asks
    it to keep at least a third of the separation the 112 body has, not all of it */
  if (cpSmall.d < SILHOUETTE_FLOOR) {
    console.error('REFUSING TO WRITE: silhouette collapses at cell size. Closest pair at 112 was '
      + cp112.d.toFixed(4) + ' (' + cp112.who.join('/') + '); at cell size it is '
      + cpSmall.d.toFixed(4) + ' (' + cpSmall.who.join('/') + '), under the floor '
      + SILHOUETTE_FLOOR.toFixed(4) + '.');
    process.exit(4);
  }

  /* 2. COLOUR MUST STILL BE THE SAME COLOUR. A faction whose dominant hue bucket changes going
     small has had its identity overwritten by a downscale artifact, not simplified. */
  const hueBroke = R.still.filter(f => f.hue112 !== f.hueSmall);
  if (hueBroke.length) {
    console.error('REFUSING TO WRITE: dominant hue changed going small -- '
      + hueBroke.map(f => f.faction + ' ' + f.hue112 + ' -> ' + f.hueSmall).join(', '));
    process.exit(5);
  }

  /* 3. NO FACING OR STRIDE FRAME MAY QUIETLY EMPTY OUT. Floor set from the walk cycle's own
     median opaque count across all seven bodies, and from the eight-facing set's own median. */
  const allWalkCounts = R.still.flatMap(f => f.walk.map(w => w.opaque)).sort((a, c) => a - c);
  const walkMedian = allWalkCounts[Math.floor(allWalkCounts.length / 2)];
  const thinWalk = R.still.filter(f => f.minOpaque < walkMedian * 0.4);
  const facingCounts = Object.values(R.walk8).map(x => x.opaque).sort((a, c) => a - c);
  const facingMedian = facingCounts[Math.floor(facingCounts.length / 2)];
  const thinFacing = Object.keys(R.walk8).filter(d => R.walk8[d].opaque < facingMedian * 0.4);
  if (thinWalk.length || thinFacing.length) {
    console.error('REFUSING TO WRITE: a frame nearly emptied out -- walk: '
      + thinWalk.map(f => f.faction + ' min ' + f.minOpaque + ' vs median ' + walkMedian).join(', ')
      + '  facings: ' + thinFacing.join(', '));
    process.exit(6);
  }

  fs.mkdirSync(VOTE, { recursive: true });
  const L = [];
  L.push('THE ONE CELL SPRITE  --  CHARACTER, 9/27/26, [small body], FIRST LINE under rule 34');
  L.push('');
  L.push('RULE 34 (TWO SCALES, ONE GAME, Paolo 9/27, LOCKED): the walked person is ONE CELL,');
  L.push('about 28 px on a 32 px cell. The 112 body is the HD source now, never the walked');
  L.push('sprite. This is the mechanical half of the law\'s own two options (cut down, or hand');
  L.push('redrawn by COOK): block-majority downscale of the game\'s own render, plus a mechanical');
  L.push('rim shade replacing the outline the downscale erases. No hand pixel art in this file.');
  L.push('');
  L.push('  ' + 'FACTION'.padEnd(12) + 'HUE 112 -> CELL'.padEnd(22) + 'CELL PROFILE'.padEnd(16) + 'WALK FRAMES OPAQUE (min..max)');
  for (const f of R.still)
    L.push('  ' + f.faction.padEnd(12) + (f.hue112 + ' -> ' + f.hueSmall).padEnd(22)
      + f.profSmall.map(x => x.toFixed(2)).join(' ').slice(0, 12).padEnd(16)
      + f.minOpaque + '..' + f.maxOpaque + ' of ' + CELL * CELL + ' px');
  L.push('');
  L.push('SILHOUETTE STILL READS DISTINCT AT CELL SIZE, measured on the same 16-sample front');
  L.push('width profile the runway fit search used:');
  L.push('  closest pair at 112     ' + cp112.d.toFixed(4) + '   (' + cp112.who.join(' / ') + ')');
  L.push('  closest pair at cell size ' + cpSmall.d.toFixed(4) + '   (' + cpSmall.who.join(' / ') + ')');
  L.push('  floor required (35% of the 112 number)  ' + SILHOUETTE_FLOOR.toFixed(4));
  L.push('  ' + (cpSmall.d >= SILHOUETTE_FLOOR ? 'CLEARS THE FLOOR' : 'BELOW FLOOR -- would not have written'));
  L.push('');
  L.push('COLOUR STILL READS THE SAME FACTION: all ' + R.still.length + ' of ' + R.still.length
    + ' dominant hue buckets unchanged going from 112 to the 32x32 cell.');
  L.push('');
  L.push('EIGHT FACINGS, ONE BODY (Blues), idle, opaque pixel count out of ' + (CELL*CELL) + ':');
  L.push('  ' + DIRS8.map(d => d + ' ' + R.walk8[d].opaque).join('   '));
  L.push('  median ' + facingMedian + ', floor 40% of median ' + Math.round(facingMedian * 0.4)
    + ', ' + (thinFacing.length ? 'THIN: ' + thinFacing.join(',') : 'none below it'));
  L.push('');
  L.push('WHAT THIS DOES NOT DO. It does not wire the honest grid or the walked street to draw');
  L.push('this sprite -- that is WORLD [honest grid] and RUN [two scales], both still open, and');
  L.push('rule 18/34.6 holds the play surface until they land. It does not replace hand pixel');
  L.push('art at cell size; if COOK draws real small art later, that is the shape, not this.');
  L.push('It measures whether the MECHANICAL path is even viable before anyone spends a hand-');
  L.push('drawn pass on thirteen factions at a size nobody has drawn for yet.');
  fs.writeFileSync(OUT, L.join('\n') + '\n');
  console.log(L.join('\n'));

  /* THE PAGE. Self-contained, frames baked in. The walk plays in place (rule 25); the ground
     under each pair is a flat 32 px cell swatch -- the size the law rules, not a placeholder
     tan card, because no cell art ships yet (COOK [cell tiles] is separately open) and this is
     honest about that rather than borrowing a finished floor that does not exist. */
  const cells = R.still.map((f, i) => `
    <section>
      <h2>${f.faction.toUpperCase()}</h2>
      <div class="pair">
        <figure><img src="${f.walk[0].big}" class="big"><figcaption>112, the HD source</figcaption></figure>
        <figure><div class="floor"><canvas id="c${i}" width="${CELL}" height="${CELL}"></canvas></div>
          <figcaption>32 px cell, ${CELL} &times; ${CELL}, blown up ${8}&times; to see it</figcaption></figure>
      </div>
      <p class="num">colour ${f.hue112} &rarr; <b>${f.hueSmall}</b> (unchanged) &nbsp;&nbsp;
        walk frames ${f.minOpaque}&ndash;${f.maxOpaque} px opaque</p>
    </section>`).join('');
  const html = `<!doctype html><meta charset="utf-8">
<title>THE ONE CELL SPRITE</title>
<style>
  :root{ --floor:#5a5648; }
  html,body{ margin:0; background:#1b1b20; color:#d8d2c4;
    font:13px ui-monospace,SFMono-Regular,Menlo,monospace; }
  .wrap{ padding:16px; max-width:760px; }
  h1{ font-size:19px; margin:0 0 8px; letter-spacing:.5px; }
  p.sub{ margin:0 0 6px; line-height:1.5; }
  section{ margin:22px 0 0; border-top:1px solid rgba(216,210,196,.15); padding-top:14px; }
  h2{ font-size:13px; margin:0 0 8px; letter-spacing:1px; }
  .pair{ display:flex; gap:30px; align-items:flex-end; }
  figure{ margin:0; }
  .big{ width:168px; height:168px; image-rendering:pixelated; display:block; }
  .floor{ background:var(--floor); padding:6px; display:inline-block; }
  canvas{ width:${CELL*8}px; height:${CELL*8}px; image-rendering:pixelated; display:block; }
  figcaption{ font-size:10px; padding:4px 0 0; opacity:.8; }
  p.num{ margin:6px 0 0; font-size:11px; opacity:.85; }
  .beat{ margin:20px 0 0; font-size:11px; opacity:.8; line-height:1.55; }
  button{ font:inherit; background:#d8d2c4; color:#1b1b20; border:0; padding:7px 13px;
    cursor:pointer; margin-right:8px; }
</style>
<div class="wrap">
  <h1>THE ONE CELL SPRITE</h1>
  <p class="sub">rule 34: your character stays one size, small, on a 32 px cell, at every zoom.
  the 112 body on the left is the source. the small one on the right is what a step on the
  honest grid will actually draw, at the exact size the law rules.</p>
  <p class="sub">it plays: this is the game's own walk cycle, cut down, looping in place.</p>
  ${cells}
  <div class="beat">
    <button id="norm">GAME SPEED</button><button id="slow">HALF SPEED</button><button id="stop">HOLD STILL</button>
    <span id="rate"></span>
  </div>
  <p class="beat">no hand pixel art here. every small body is the game's own 112 render, put</p>
  <p class="beat">through a block-majority downscale and a mechanical rim shade -- disclosed,</p>
  <p class="beat">not a filter pretending to be a smaller drawing. the record has the method.</p>
  <p class="beat">what is NOT here yet: a floor, a wall, another person. the street still draws</p>
  <p class="beat">the 112 bodies until the honest grid ships. this proves the small body survives</p>
  <p class="beat">the trip down before anyone hand-draws thirteen factions at this size.</p>
</div>
<script>
const CAST = ${JSON.stringify(R.still.map(f => f.walk.map(w => w.small)))};
const mk = (sets, pre) => sets.map((set, i) => ({
  imgs: set.map(u => { const im = new Image(); im.src = u; return im; }),
  ctx: document.getElementById(pre + i).getContext('2d') }));
const rows = mk(CAST, 'c');
rows.forEach(r => r.ctx.imageSmoothingEnabled = false);
let msPerBeat = 500, playing = true; const t0 = performance.now(); const FR = ${FRAMES};
function tick(now){
  if (playing) {
    const f = Math.floor((now - t0) / (msPerBeat / FR)) % FR;
    rows.forEach(r => { const im = r.imgs[f];
      if (im && im.complete) { r.ctx.clearRect(0,0,${CELL},${CELL}); r.ctx.drawImage(im, 0, 0); } });
  }
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
const rate = document.getElementById('rate');
const say = () => rate.textContent = playing ? (Math.round(60000/msPerBeat) + ' bpm') : 'held';
document.getElementById('norm').onclick = () => { msPerBeat = 500; playing = true; say(); };
document.getElementById('slow').onclick = () => { msPerBeat = 1000; playing = true; say(); };
document.getElementById('stop').onclick = () => { playing = !playing; say(); };
say();
</script>`;
  fs.writeFileSync(PAGE, html);
  console.log('\nWROTE ' + path.relative(REPO, PAGE));
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 2).join(' | '));
})();
