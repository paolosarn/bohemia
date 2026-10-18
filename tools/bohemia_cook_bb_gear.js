/* COOK: BB GEAR -- WHAT WORN GEAR SAYS (10/9/26, CHARACTER, [bb gear])
 *
 * RULE 33 / law s5: "CHARACTER [bb gear] what worn gear says" is this lane's standing research
 * line. SCHOOL FIRST, from reference/library/battle_brothers/04_ARMOUR_SHIELDS.md: Battle
 * Brothers reads a man's kit at a glance by TIER AND SILHOUETTE, not colour -- rags and padded
 * cloth read soft and thin, mail and lamellar read bulkier, a great helm covers the whole head
 * and costs vision, a shield widens the arm. The hex board is small and the camera often far;
 * the game is readable because the SHAPE survives the zoom-out, every time. That is the real
 * design lesson, not a flavour note: BB never relies on a player being close enough to read a
 * colour.
 *
 * THE SHAPE FOR US: the runway thirteen (FACTION_LOOKS, already canon, already judged) is our
 * version of that kit-reading -- each faction's silhouette is how a stranger on the street or a
 * party on the map knows who they are before they are close enough to see a face. THE QUESTION
 * THIS ROW ACTUALLY ANSWERS, MEASURED NOT ASSUMED: do the thirteen still read as thirteen
 * DIFFERENT people once the camera is far enough that a figure is small -- the way a party on
 * the map or a figure at the end of a street actually is?
 *
 * THE METHOD: shoot every faction at the rig's real 112 render (this lane's one surface), then
 * DOWNSAMPLE that same render with the engine's own nearest-neighbour rule (image-rendering:
 * pixelated everywhere in this game) to 28 px -- the one small on-screen size this project has
 * already put a number on for a tiny figure (rule 34's own 'about 28 px tall'; the one-cell
 * sprite it was for is retired, but 28 px is still this repo's own precedent for small, not a
 * guess invented here). This is not a claim about the live map camera's exact zoom factor --
 * that is RUN's file, out of this lane's hands -- it is an honest proxy for "how small before
 * the shape itself has to carry it."
 *
 * TWO RULERS, BECAUSE THEY MEASURE DIFFERENT THINGS AT THIS SIZE: the same 16-sample silhouette
 * profile this lane always uses (outline), and a mean-colour distance (RGB centroid of the
 * drawn pixels) -- at 28 px a fine outline difference can vanish before a colour difference
 * does, and COLOUR IS TERRITORY already makes colour a real identity signal, not a decoration.
 *
 * RIG CHECK: renders only, the same shoot()/profile()/toPNG() harness this lane's last three
 * rows use. G_WORN/G.equipped/G.bodyVar/G.age restored after.
 *
 * REFERENCE CHECK: no new pixel; all thirteen looks are already canon and already judged. The
 * measurement (do they still read apart, small) is the new thing, numbers and a picture.
 *
 *   node tools/bohemia_cook_bb_gear.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const VOTE = path.join(REPO, 'slices/vote');
const PAGE = path.join(VOTE, 'CHARACTER_BB_GEAR_WHAT_WORN_GEAR_SAYS.html');
const OUT = path.join(REPO, 'records/BOHEMIA_BB_GEAR_WHAT_WORN_GEAR_SAYS_10_9_26.txt');
const GROUND = { road: '#33333c', walk: '#8a8478', kerb: '#3f3f47' };
const SMALL = 28;

(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1100, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  await p.goto('file://' + ALPHA, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.FACTION_LOOKS
    && typeof rebuildFromRig === 'function', { timeout: 90000 });

  const R = await p.evaluate(({ SMALL }) => {
    const o = { rows: [], err: null };
    const keepW = window.G_WORN, keepE = G.equipped;
    const keepD = JSON.stringify(G.bodyVar || {}), keepA = G.age;
    const clear = () => { try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {} };
    const SLOTS = ['hat', 'glasses', 'hair', 'shirt', 'jacket', 'pants', 'shoes'];
    const bare = () => { const eq = {}; for (const k in keepE) eq[k] = keepE[k];
                         for (const s of SLOTS) eq[s] = ''; return eq; };

    const profile = (CW, CH, px) => {
      const rows = new Array(CH).fill(0); let top = 1e9, bot = -1;
      for (let i = 0; i < px.length; i++) { if (!px[i]) continue;
        const y = (i / CW) | 0; rows[y]++; if (y < top) top = y; if (y > bot) bot = y; }
      const span = Math.max(1, bot - top), wide = Math.max.apply(null, rows) || 1;
      const prof = []; for (let k = 0; k < 16; k++) prof.push(rows[Math.min(CH - 1, top + Math.round(span * k / 15))] / wide);
      return prof;
    };
    const meanColour = (px) => {
      let r = 0, g = 0, bl = 0, n = 0;
      for (let i = 0; i < px.length; i++) { const q = px[i]; if (!q) continue;
        r += q[0]; g += q[1]; bl += q[2]; n++; }
      return n ? [r / n, g / n, bl / n] : [0, 0, 0];
    };
    const dist = (a, c) => { let s = 0; for (let i = 0; i < a.length; i++) s += Math.abs(a[i] - c[i]); return s / a.length; };
    const colourDist = (a, c) => Math.sqrt((a[0]-c[0])**2 + (a[1]-c[1])**2 + (a[2]-c[2])**2);

    const toCanvas = (fr) => {
      const cv = document.createElement('canvas'); cv.width = fr.CW; cv.height = fr.CH;
      const g2 = cv.getContext('2d'); g2.imageSmoothingEnabled = false;
      const im = g2.createImageData(fr.CW, fr.CH), d = im.data;
      for (let i = 0; i < fr.px.length; i++) { const q = fr.px[i]; if (!q) continue;
        d[i*4] = q[0]; d[i*4+1] = q[1]; d[i*4+2] = q[2]; d[i*4+3] = 255; }
      g2.putImageData(im, 0, 0); return cv;
    };
    const downsample = (cv, size) => {
      const small = document.createElement('canvas'); small.width = size; small.height = size;
      const g2 = small.getContext('2d'); g2.imageSmoothingEnabled = false;
      g2.drawImage(cv, 0, 0, size, size);
      const im = g2.getImageData(0, 0, size, size).data;
      const px = new Array(size * size);
      for (let i = 0; i < size * size; i++) {
        const a = im[i*4+3];
        px[i] = a > 40 ? [im[i*4], im[i*4+1], im[i*4+2]] : null;
      }
      return { canvas: small, px };
    };

    const shoot = (dials, worn, age, dir) => {
      G.equipped = bare(); window.G_WORN = worn;
      G.bodyVar = JSON.parse(JSON.stringify(dials || {})); G.age = age || 'adult';
      rebuildFromRig(); clear();
      return buildFrame(dir, 'idle', 0);
    };

    try {
      for (const f of window.FACTION_LOOKS) {
        const fr = shoot(f.dials, f.worn, f.age, 'S');
        const cv = toCanvas(fr);
        const small = downsample(cv, SMALL);
        o.rows.push({
          faction: f.faction,
          profBig: profile(fr.CW, fr.CH, fr.px),
          profSmall: profile(SMALL, SMALL, small.px),
          colSmall: meanColour(small.px),
          pngBig: cv.toDataURL('image/png'),
          pngSmall: small.canvas.toDataURL('image/png')
        });
      }
      if (o.rows.length === window.FACTION_LOOKS.length) {
        let worstBig = Infinity, worstSmall = Infinity, worstColour = Infinity;
        let pairBig = null, pairSmall = null, pairColour = null;
        for (let i = 0; i < o.rows.length; i++) for (let j = i + 1; j < o.rows.length; j++) {
          const dBig = dist(o.rows[i].profBig, o.rows[j].profBig);
          const dSmall = dist(o.rows[i].profSmall, o.rows[j].profSmall);
          const dCol = colourDist(o.rows[i].colSmall, o.rows[j].colSmall);
          if (dBig < worstBig) { worstBig = dBig; pairBig = [o.rows[i].faction, o.rows[j].faction]; }
          if (dSmall < worstSmall) { worstSmall = dSmall; pairSmall = [o.rows[i].faction, o.rows[j].faction]; }
          if (dCol < worstColour) { worstColour = dCol; pairColour = [o.rows[i].faction, o.rows[j].faction]; }
        }
        o.worstBig = worstBig; o.pairBig = pairBig;
        o.worstSmall = worstSmall; o.pairSmall = pairSmall;
        o.worstColour = worstColour; o.pairColour = pairColour;
      }
    } catch (e) { o.err = String(e && e.message || e); }
    window.G_WORN = keepW; G.equipped = keepE;
    G.bodyVar = JSON.parse(keepD); G.age = keepA; rebuildFromRig(); clear();
    return o;
  }, { SMALL });
  await b.close();

  if (R.err) { console.error('THREW: ' + R.err); process.exit(3); }
  if (errs.length) { console.error('PAGE ERRORS: ' + errs.join(' | ')); process.exit(5); }

  fs.mkdirSync(VOTE, { recursive: true });
  const L = [];
  L.push('BB GEAR: WHAT WORN GEAR SAYS -- CHARACTER, 10/9/26, [bb gear], rule 33 / law s5');
  L.push('');
  L.push('SCHOOL (reference/library/battle_brothers/04_ARMOUR_SHIELDS.md): Battle Brothers reads a');
  L.push('man\'s kit at a glance by TIER AND SILHOUETTE, not colour. Rags and padded cloth read');
  L.push('soft and thin, mail and lamellar read bulkier, a great helm covers the whole head, a');
  L.push('shield widens the arm. The hex board is small and the camera is often far; the game');
  L.push('stays readable because the SHAPE survives being small, every time. BB never counts on a');
  L.push('player being close enough to read a colour.');
  L.push('');
  L.push('THE SHAPE FOR US, MEASURED: the runway thirteen is our version of that kit-reading, a');
  L.push('faction\'s look is how a stranger knows who they are before they are close. Shot all');
  L.push('thirteen at this lane\'s real 112 render, then downsampled with the engine\'s own');
  L.push('nearest-neighbour rule to ' + SMALL + ' px, this repo\'s own precedent for a small figure (rule 34).');
  L.push('Not a claim about the live map camera\'s exact zoom; an honest proxy for how small before');
  L.push('the shape has to carry the identity alone.');
  L.push('');
  L.push('AT FULL SIZE (112, the baseline): closest pair ' + (R.pairBig ? R.pairBig.join(' / ') : 'n/a')
    + ', ' + (R.worstBig !== undefined ? R.worstBig.toFixed(4) : 'n/a') + ' apart. Already established, re-confirmed.');
  L.push('AT MARKER SIZE (' + SMALL + ' px), OUTLINE: closest pair ' + (R.pairSmall ? R.pairSmall.join(' / ') : 'n/a')
    + ', ' + (R.worstSmall !== undefined ? R.worstSmall.toFixed(4) : 'n/a') + ' apart.');
  L.push('AT MARKER SIZE (' + SMALL + ' px), COLOUR: closest pair ' + (R.pairColour ? R.pairColour.join(' / ') : 'n/a')
    + ', ' + (R.worstColour !== undefined ? R.worstColour.toFixed(1) : 'n/a') + ' apart (0-441 scale, RGB euclidean).');
  L.push('');
  const smallFloor = 0.015, colourFloor = 12;
  const outlineOk = R.worstSmall === undefined || R.worstSmall >= smallFloor;
  const colourOk = R.worstColour === undefined || R.worstColour >= colourFloor;
  if (outlineOk && colourOk) {
    L.push('FINDING: all thirteen still read apart at marker size, by outline or by colour or both.');
    L.push('No pair collapses into the same small shape. The runway thirteen carries its own');
    L.push('identity down to a small render, the same discipline BB\'s own kit-reading leans on.');
  } else {
    L.push('FINDING, SAID PLAINLY: not every pair survives being small. The closest outline pair (' +
      (R.pairSmall ? R.pairSmall.join(' and ') : 'n/a') + ') and the closest colour pair (' +
      (R.pairColour ? R.pairColour.join(' and ') : 'n/a') + ') are worth DIRECTION and COOK\'s eyes --');
    L.push('this lane measures and reports, it does not redesign thirteen already-judged faction');
    L.push('looks on its own say-so.');
  }
  L.push('');
  L.push('NOT HERE, ON PURPOSE: the live map camera\'s real on-screen pixel size for a party marker');
  L.push('is RUN\'s file; this lane\'s job is the shape and colour identity of the runway thirteen');
  L.push('itself, measured honestly at a small, sourced proxy size, not guessed at full size.');
  fs.writeFileSync(OUT, L.join('\n') + '\n');
  console.log(L.join('\n'));

  const cells = R.rows.map(r => `
    <figure>
      <canvas class="big" id="b_${r.faction}" width="112" height="112"></canvas>
      <canvas class="small" id="s_${r.faction}" width="${SMALL}" height="${SMALL}"></canvas>
      <figcaption>${r.faction}</figcaption>
    </figure>`).join('');
  const html = `<!doctype html><meta charset="utf-8">
<title>BB GEAR: WHAT WORN GEAR SAYS</title>
<style>
  :root{ --road:${GROUND.road}; --walk:${GROUND.walk}; --kerb:${GROUND.kerb}; }
  html,body{ margin:0; background:#1b1b20; color:#d8d2c4;
    font:13px ui-monospace,SFMono-Regular,Menlo,monospace; }
  .wrap{ padding:16px; max-width:960px; }
  h1{ font-size:19px; margin:0 0 8px; letter-spacing:.5px; }
  p.sub{ margin:0 0 16px; line-height:1.5; }
  .street{ background:var(--walk); padding:10px 0; }
  .road{ background:var(--road); display:flex; gap:16px; padding:14px; flex-wrap:wrap; }
  figure{ margin:0; text-align:center; }
  canvas{ image-rendering:pixelated; display:block; background:var(--road); margin:0 auto; }
  canvas.big{ width:84px; height:84px; }
  canvas.small{ width:84px; height:84px; margin-top:4px; border-top:1px dashed #555; padding-top:4px; }
  figcaption{ font-size:11px; padding:6px 0 0; }
  .beat{ margin:16px 0 0; font-size:11px; opacity:.8; line-height:1.6; }
</style>
<div class="wrap">
  <h1>BB GEAR: WHAT WORN GEAR SAYS</h1>
  <p class="sub">The runway thirteen, full size (top) over the same figure downsampled to ${SMALL} px
  (bottom, the engine's own nearest-neighbour scale) -- does a faction still read as itself once it
  is small, the way Battle Brothers' own kit reads at a glance on a small board?</p>
  <div class="street"><div class="road">${cells}</div></div>
  <p class="beat">Full size closest pair: ${R.pairBig ? R.pairBig.join(' / ') : 'n/a'} (${R.worstBig !== undefined ? R.worstBig.toFixed(4) : 'n/a'}).
  Marker size outline closest pair: ${R.pairSmall ? R.pairSmall.join(' / ') : 'n/a'} (${R.worstSmall !== undefined ? R.worstSmall.toFixed(4) : 'n/a'}).
  Marker size colour closest pair: ${R.pairColour ? R.pairColour.join(' / ') : 'n/a'} (${R.worstColour !== undefined ? R.worstColour.toFixed(1) : 'n/a'}).</p>
</div>
<script>
const ROWS = ${JSON.stringify(R.rows.map(r => ({ faction: r.faction, pngBig: r.pngBig, pngSmall: r.pngSmall })))};
for (const r of ROWS) {
  const b = document.getElementById('b_' + r.faction), s = document.getElementById('s_' + r.faction);
  const ib = new Image(); ib.onload = () => b.getContext('2d').drawImage(ib, 0, 0, 112, 112); ib.src = r.pngBig;
  const is = new Image(); is.onload = () => s.getContext('2d').drawImage(is, 0, 0, ${SMALL}, ${SMALL}); is.src = r.pngSmall;
}
</script>`;
  fs.writeFileSync(PAGE, html);
  console.log('wrote ' + PAGE);
})();
