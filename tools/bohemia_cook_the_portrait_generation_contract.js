#!/usr/bin/env node
/* BOHEMIA -- COOK: THE PORTRAIT GENERATION CONTRACT. PORTRAIT, 10/11/26.
 *
 * REFERENCE CHECK (the 9/4 standing duty): the ruler is rule 108 itself (a: no chat
 * draws a pixel or a curve in code; a generated portrait is referenced against the real
 * worn garments, not invented) and FACE-01/02/03. No new pixels anywhere in this tool --
 * every image it produces is the real, unmodified drawChar() rendering a real citizen's
 * real, already-approved worn garments. Nothing here is a candidate face; it is the data
 * sheet a future generator call needs before it can make one honestly.
 *
 * RULE 108, LANDED THIS ROUND, READ FIRST (HOW THE PACK DID IT): "a cook's tile, prop,
 * house, portrait or icon is GENERATED against his pack tiles as the style reference...
 * a tile drawn rectangle by rectangle in a Python or JavaScript tool is no longer a
 * candidate" (108a). This retires the exact shape of candidate this lane built last round
 * ([the real clothes reach the portrait]'s hand-coded hat/glasses/shoulder overlay,
 * drawn with poly()/P()/line() copied from renderFace) as a FIX METHOD, even though the
 * BUG it found and proved (headwear/eyewear/top reading a thin, wrong system 41% to 32%
 * of the time) stands and is not reversed by this. COOK's own [generate against the
 * pack] row is building the real replacement (a model call referenced against his packs);
 * that row needs portrait generation calls to be well formed when it reaches portraits,
 * and nobody has written down what "well formed" means for a face yet.
 *
 * THIS ROUND, NOT A FIX, A CONTRACT: for each of three real citizens, this tool renders
 * their real walked body from four real facings (S, E, N, W -- drawChar(), completely
 * unmodified, zero new code touches a pixel) and writes down, in plain text, exactly
 * which real GARMENTS piece they wear in every slot that should inform a generated
 * portrait of them (hat, face accessory, top, hair) -- the same shape of input Retro
 * Diffusion's own docs ask for (reference images plus a locked description), so whenever
 * COOK's row reaches portraits, the reference set and the "what must match" list already
 * exist instead of being invented in that round under time pressure.
 *
 * PORTRAIT's mode this round: COOK ONLY UNTIL HIS FINAL, AND NOTHING IS FINAL BEFORE THE
 * MOODBOARD (rule 100 + rule 108 ROUND THIRTEEN). Nothing in this tool touches slices/,
 * engine/ or the demo, and nothing here claims to be a finished face -- it is reference
 * material for a call this lane does not own (COOK's).
 *
 *   node tools/bohemia_cook_the_portrait_generation_contract.js
 */
'use strict';
const path = require('path'), fs = require('fs');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const SHEET = path.join(REPO, 'slices/vote/PORTRAIT_THE_PORTRAIT_GENERATION_CONTRACT.png');
const PAGE  = path.join(REPO, 'slices/vote/PORTRAIT_THE_PORTRAIT_GENERATION_CONTRACT.html');
const NUMS  = path.join(REPO, 'records/target/BOHEMIA_THE_PORTRAIT_GENERATION_CONTRACT.json');

const IDS = ['gate:crowd:2', 'gate:crowd:0', 'gate:crowd:71'];
const DIRS = ['S', 'E', 'N', 'W'];

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1400, height: 1000 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  await p.goto('file://' + ALPHA, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof drawChar === 'function' && window.BOH_PERSONLOOK && window.GARMENTS, { timeout: 60000 });

  const data = await p.evaluate(({ IDS, DIRS }) => {
    const pool = (window.GARMENTS || []).filter(g => g.st === 'canon');
    const prevWorn = window.G_WORN;
    const out = [];
    for (const id of IDS) {
      const look = window.BOH_PERSONLOOK.lookFor(id, pool);
      const frames = {};
      try {
        window.G_WORN = look.worn;
        for (const d of DIRS) {
          const cv = document.createElement('canvas'); cv.width = 112; cv.height = 112;
          drawChar(cv, d, 'idle', 0);
          frames[d] = cv.toDataURL('image/png');
        }
      } finally { window.G_WORN = prevWorn; }
      out.push({ id, worn: look.worn, frames });
    }
    return out;
  }, { IDS, DIRS });

  /* ---------- REFUSE TO WRITE ON ANY FAILED CLAIM ---------- */
  const fails = [];
  if (data.length !== IDS.length) fails.push('did not render all ' + IDS.length + ' citizens');
  for (const d of data) {
    if (!d.worn || !Object.keys(d.worn).length) fails.push(d.id + ': resolved no worn garments at all');
    if (DIRS.some(dir => !d.frames[dir])) fails.push(d.id + ': missing a facing');
  }
  if (errs.length) fails.push('page errors: ' + errs.join(' | '));
  if (fails.length) { console.error('REFUSED TO WRITE:\n' + fails.map(f => ' - ' + f).join('\n')); await b.close(); process.exit(1); }

  /* ---------- COMPOSE THE SHEET: four facings per citizen, the worn table beside each ---------- */
  const scale = 3, N = 112, pad = 10, colW = N * scale, rowH = colW + 90;
  const canvas = await p.evaluate(async ({ data, DIRS, scale, N, pad, colW, rowH }) => {
    const cv = document.createElement('canvas');
    cv.width = colW * DIRS.length + pad * (DIRS.length + 1);
    cv.height = rowH * data.length + 70;
    const ctx = cv.getContext('2d'); ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = '#15120f'; ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.fillStyle = '#e8e2d6'; ctx.font = 'bold 18px monospace';
    ctx.fillText('THE PORTRAIT GENERATION CONTRACT -- reference images + the worn-garment list, nothing drawn', pad, 26);
    const loadImg = (url) => new Promise((res) => { const im = new Image(); im.onload = () => res(im); im.src = url; });
    for (let i = 0; i < data.length; i++) {
      const d = data[i];
      const y0 = 50 + i * rowH;
      for (let j = 0; j < DIRS.length; j++) {
        const dir = DIRS[j];
        const x0 = pad + j * (colW + pad);
        ctx.fillStyle = '#b8ac94'; ctx.font = '12px monospace';
        ctx.fillText(d.id + ' -- facing ' + dir, x0, y0 + 14);
        const im = await loadImg(d.frames[dir]);
        ctx.drawImage(im, 0, 0, N, N, x0, y0 + 20, colW, colW);
      }
      const wornLine = Object.keys(d.worn).sort().map(k => k + ':' + d.worn[k]).join('  ');
      ctx.fillStyle = '#f0a'; ctx.font = '12px monospace';
      ctx.fillText('WORN (the contract): ' + wornLine, pad, y0 + colW + 55);
    }
    return cv.toDataURL('image/png');
  }, { data, DIRS, scale, N, pad, colW, rowH });

  const b64 = canvas.replace(/^data:image\/png;base64,/, '');
  fs.writeFileSync(SHEET, Buffer.from(b64, 'base64'));

  const rows = data.map(d => {
    const w = d.worn;
    const parts = ['hat: ' + (w.head || 'none'), 'face accessory: ' + (w.face || 'none'),
      'top: ' + (w.outer || w.base || 'none') + (w.outer ? ' (outer, covers ' + (w.base || 'nothing') + ')' : ''),
      'hair: ' + (w.hair || 'none')];
    return `<tr><td>${d.id}</td><td>${parts.join('<br>')}</td></tr>`;
  }).join('\n');

  const html = `<!doctype html><html><head><meta charset="utf-8"><title>THE PORTRAIT GENERATION CONTRACT</title>
<style>body{background:#15120f;color:#e8e2d6;font-family:monospace;padding:20px}
img{image-rendering:pixelated;border:1px solid #444;max-width:100%}
table{border-collapse:collapse;margin-top:10px} td{border:1px solid #444;padding:8px;vertical-align:top}
.n{color:#f0a}</style></head><body>
<h2>THE PORTRAIT GENERATION CONTRACT</h2>
<p>Rule 108a, landed this round: a generated portrait is referenced against the real worn garments, never hand-drawn in code.
Last round's candidate (portrait-the-real-clothes-reach-the-portrait-10-10) proved the bug (headwear agreed with the body only
59% of the time, eyewear 68%, top clothing never read at all) but its FIX METHOD -- hand-coded overlay polygons in a cook tool --
is now retired by this same rule. This page is not a fix. It is the input sheet COOK's own [generate against the pack] row will
need the day it reaches portraits: for each citizen, four real facings (zero new pixels, the real drawChar()) plus the exact
GARMENTS piece worn in every slot that should steer the call.</p>
<img src="PORTRAIT_THE_PORTRAIT_GENERATION_CONTRACT.png">
<table><tr><td><b>citizen</b></td><td><b>the contract</b></td></tr>
${rows}
</table>
<p class="n">Not a candidate face, not in VOTE for a thumb on a look -- a reference sheet for a call this lane does not own.
Nothing here touches slices/, engine/ or the demo.</p>
</body></html>`;
  fs.writeFileSync(PAGE, html);

  fs.writeFileSync(NUMS, JSON.stringify({ citizens: data.map(d => ({ id: d.id, worn: d.worn })) }, null, 2));

  console.log('WROTE', SHEET);
  console.log('WROTE', PAGE);
  console.log('WROTE', NUMS);
  console.log(JSON.stringify({ citizens: data.map(d => d.id) }, null, 2));

  await b.close();
})();
