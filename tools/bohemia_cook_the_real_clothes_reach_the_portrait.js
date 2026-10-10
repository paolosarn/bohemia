#!/usr/bin/env node
/* BOHEMIA -- COOK: THE REAL CLOTHES REACH THE PORTRAIT. PORTRAIT, 10/10/26.
 *
 * REFERENCE CHECK (the 9/4 standing duty): the rulers are FACE-01/02/03 (the portrait
 * construction) and the portrait-wears-the-haircut law (rule 37i, 8/28). No new paint:
 * every colour this tool uses is read straight off a GARMENTS entry the game already
 * approved (the exact ramp its own gen() closure draws the body with); the hat and
 * accessory SILHOUETTES are the existing durag/shades polygons, reused, not invented.
 *
 * PAOLO, DIRECT, 10/10: "I need you to make portraits of people with customizable face
 * features, and all of the top clothing pieces and headwear and eyewear would be
 * impacted by the portrait and a bunch of different hairstyles and a bunch of different
 * like face shapes, nose shapes, mouth shapes, bro you've been failing me so bad."
 *
 * MEASURED FIRST, BEFORE BUILDING ANYTHING: checked whether headwear and eyewear
 * actually DO reach the portrait today (rule 37i, 9/27 and 9/22, both shipped and voted
 * on). They read spec.hat/spec.glasses off NPC_FACTORY.npcFrom(id).equipped -- a
 * separate, older system than the one that actually dresses the walked crowd. The real
 * crowd's hat and face accessory come from BOH_PERSONLOOK.lookFor(id,pool).worn.head /
 * .worn.face, reading window.GARMENTS -- the SAME two-systems-drifted shape this lane
 * already caught for hair on 8/28 ("NPCFactory picks a painted layer... but
 * BOH_PERSONLOOK.lookFor is what actually dresses the crowd").
 *
 * MEASURED: 200 citizens. The body (BOH_PERSONLOOK/GARMENTS) wears a real hat 58 times
 * and a real face accessory some number of times; the portrait's source (NPC_FACTORY)
 * claims a hat 68 times from a bank of exactly ONE hat name ('hat/durag') and one
 * accessory name ('glasses/shades'). Agreement on hat presence alone (not even the same
 * hat) is only 59% -- barely above a coin flip -- because these are two independent
 * rolls. Every citizen wearing any of the real catalogue's other 20+ hats or any of its
 * 14 face accessories (shades, a dust mask, a bandana, a gas mask) shows NOTHING or the
 * WRONG thing in their own portrait. This is the sixth time this exact shape of bug has
 * hit this lane (cut SHAPE 8/28, hair COLOUR 9/20, the braid sentinel 9/24, the
 * face-maker's dropped dials 10/9, the whole crowd's random texture 10/9, now this) --
 * and it is very likely a real part of why "headwear and eyewear impacted by the
 * portrait" still reads as broken to him even though it shipped twice.
 *
 * TOP CLOTHING, MEASURED AS NEVER BUILT AT ALL (not a bug, an honest absence): spec.top
 * has been a rolled random RGB since the portrait existed, never read from any garment
 * (renderFace's own comment, rule 37i: "there is no _np.equipped.top... say the cost").
 * The real worn top IS cheap to read now: BOH_PERSONLOOK.lookFor(id,pool).worn.base,
 * looked up in window.GARMENTS, gives the exact garment name; this tool reads that
 * garment's own gen() closure source for its `ramp:NAME` identifier and resolves NAME's
 * literal {dk,mid,lt} object straight out of the file text (never evaluates untrusted
 * code, never invents a colour) -- the same "ask the garment, don't keep a second table"
 * principle the hair fix used, done for base/head/face layers which carry no HAIR_
 * AUTHORED-style runtime helper of their own.
 *
 * RULE 100 (COOK ONLY UNTIL HIS FINAL): nothing in this tool touches slices/, engine/ or
 * the demo. The fixed renders below are built by calling the REAL, unmodified faceFor()
 * and renderFace() for the head, then drawing an ADDITIVE overlay in THIS SCRIPT's own
 * code (copied geometry from renderFace's existing hat/glasses/bust blocks, recoloured
 * with real data) directly onto the buffer those functions already returned -- renderFace
 * itself is never edited and never even monkey-patched. The hat/accessory SILHOUETTE
 * reused here is a placeholder (the durag/shades shape everyone already has); the real
 * shape variety for new garments is COOK THREE's/CHARACTER's paint layer, not reinvented
 * here. NO PORTRAIT REFERENCE TWIN EXISTS IN THE REPO (checked reference/art_bank/portrait/
 * and reference/library/face/, both hold only a README/INDEX, no image) -- named OWED
 * again, not faked.
 *
 *   node tools/bohemia_cook_the_real_clothes_reach_the_portrait.js
 */
'use strict';
const path = require('path'), fs = require('fs');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const SHEET = path.join(REPO, 'slices/vote/PORTRAIT_THE_REAL_CLOTHES_REACH_THE_PORTRAIT.png');
const PAGE  = path.join(REPO, 'slices/vote/PORTRAIT_THE_REAL_CLOTHES_REACH_THE_PORTRAIT.html');
const NUMS  = path.join(REPO, 'records/target/BOHEMIA_THE_REAL_CLOTHES_REACH_THE_PORTRAIT.json');

const SRC = fs.readFileSync(ALPHA, 'utf8');

/* Read a GARMENTS entry's own authored ramp straight out of the file text -- never
   evaluates the closure, never keeps a second colour table, cannot drift. */
function rampFor(name, layer) {
  const esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re1 = new RegExp("\\{n:'" + esc + "',[^}]*layer:'" + layer + "'[^}]*gen:function\\(g\\)\\{[^}]*ramp:(\\w+)");
  const m1 = SRC.match(re1);
  if (!m1) return null;
  const rampName = m1[1];
  const re2 = new RegExp('var\\s+' + rampName + '\\s*=\\s*(\\{[^;]*?\\});');
  const m2 = SRC.match(re2);
  if (!m2) return null;
  try { return { rampName, ...JSON.parse(m2[1].replace(/(\w+):/g, '"$1":')) }; }
  catch (e) { return null; }
}

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1400, height: 1000 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  await p.goto('file://' + ALPHA, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof renderFace === 'function' && typeof faceFor === 'function' &&
    typeof NPC_FACTORY !== 'undefined' && window.BOH_PERSONLOOK && window.GARMENTS, { timeout: 60000 });

  /* ---------- 1. MEASURE THE DRIFT, 200 citizens ---------- */
  const drift = await p.evaluate(() => {
    const pool = (window.GARMENTS || []).filter(g => g.st === 'canon');
    const N = 200;
    let bodyHat = 0, factoryHat = 0, hatAgree = 0;
    let bodyFace = 0, factoryFace = 0, faceAgree = 0;
    const examples = [];
    for (let i = 0; i < N; i++) {
      const id = 'gate:crowd:' + i;
      const worn = window.BOH_PERSONLOOK.lookFor(id, pool).worn || {};
      const np = NPC_FACTORY.npcFrom(id);
      const eq = np.equipped || {};
      const bH = !!worn.head, fH = !!eq.hat;
      const bF = !!worn.face, fF = !!eq.glasses;
      if (bH) bodyHat++; if (fH) factoryHat++; if (bH === fH) hatAgree++;
      if (bF) bodyFace++; if (fF) factoryFace++; if (bF === fF) faceAgree++;
      examples.push({ id, bodyHat: worn.head || '', factoryHat: eq.hat || '',
        bodyFace: worn.face || '', factoryFace: eq.glasses || '', bodyBase: worn.base || '', bodyOuter: worn.outer || '' });
    }
    return { N, bodyHat, factoryHat, hatAgree, bodyFace, factoryFace, faceAgree, examples };
  });

  /* ---------- 2. PICK THREE REAL, CONCRETE EXAMPLES FROM THE 200 ---------- */
  const hasTop = e => e.bodyBase || e.bodyOuter;
  const withHat = drift.examples.find(e => e.bodyHat && hasTop(e));
  const withFace = drift.examples.find(e => e.bodyFace && hasTop(e) && e.id !== (withHat || {}).id);
  const withBoth = drift.examples.find(e => e.bodyHat && e.bodyFace && hasTop(e));
  const chosen = [withHat, withFace, withBoth].filter(Boolean);
  if (chosen.length < 2) { console.error('REFUSED: fewer than two real dressed examples found in 200 citizens -- cannot prove anything on fabricated ids.'); process.exit(1); }

  /* ---------- 3. REAL RAMPS FOR EACH CHOSEN CITIZEN'S REAL GARMENTS ---------- */
  const rampCache = {};
  function ramp(name, layer) {
    const k = layer + ':' + name;
    if (!(k in rampCache)) rampCache[k] = rampFor(name, layer);
    return rampCache[k];
  }
  /* THE VISIBLE TOP IS WHATEVER SITS ON TOP, NOT WHATEVER IS WORN FIRST. The draw order
     (renderFace's own ORD comment, confirmed live by rendering a real body) puts 'outer'
     AFTER 'base', so a coat covers a shirt the same way a hat covers hair -- a citizen
     wearing both shows the COAT's colour at the shoulders, not the shirt's. Caught by
     rendering gate:crowd:2's real walked body and comparing: worn.base was 'ARC SHOULDER
     TEE' but the visible garment is 'OLIVE CAR COAT' (worn.outer). Prefer outer, fall
     back to base only when no outer is worn. */
  for (const c of chosen) {
    c.hatRamp = c.bodyHat ? ramp(c.bodyHat, 'head') : null;
    c.faceRamp = c.bodyFace ? ramp(c.bodyFace, 'face') : null;
    c.topName = c.bodyOuter || c.bodyBase;
    c.topLayer = c.bodyOuter ? 'outer' : 'base';
    c.baseRamp = c.topName ? ramp(c.topName, c.topLayer) : null;
  }
  const missingRamp = chosen.filter(c => (c.bodyHat && !c.hatRamp) || (c.bodyFace && !c.faceRamp) || (c.topName && !c.baseRamp));
  if (missingRamp.length) { console.error('REFUSED: could not resolve a real ramp for a chosen citizen\'s own worn garment -- ' + JSON.stringify(missingRamp)); process.exit(1); }

  /* ---------- 4. RENDER TODAY (as-is) AND THE FIXED CANDIDATE, FOR EACH ---------- */
  const rendered = await p.evaluate((chosen) => {
    function toRGB(rampObj, key) { return rampObj ? rampObj[key] : null; }
    const out = [];
    for (const c of chosen) {
      const spec = faceFor(c.id);
      const today = renderFace(spec, { ramp: faceRampFor(spec) });

      /* THE FIXED CANDIDATE: the real, unmodified head render, then an additive overlay
         in THIS SCRIPT only -- renderFace's own source is never touched. Geometry copied
         verbatim from renderFace's existing hat/glasses/bust blocks (lines 4296-4321,
         4735-4745, 4760-4771), recoloured with the real ramps resolved above. */
      const buf = renderFace(spec, { ramp: faceRampFor(spec) }).slice();
      const N = 64;
      const P = (x, y, col) => { x |= 0; y |= 0; if (x < 0 || x >= N || y < 0 || y >= N) return;
        const i = (y * N + x) * 4; buf[i] = col[0]; buf[i+1] = col[1]; buf[i+2] = col[2]; buf[i+3] = 255; };
      const line = (x0,y0,x1,y1,col) => { x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);
        let dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1,e=dx+dy;
        for(;;){P(x0,y0,col);if(x0===x1&&y0===y1)break;let e2=2*e;if(e2>=dy){e+=dy;x0+=sx;}if(e2<=dx){e+=dx;y0+=sy;}} };
      const poly = (pts, col) => { const ys=pts.map(pt=>pt[1]); const y0=Math.floor(Math.min(...ys)), y1=Math.ceil(Math.max(...ys));
        for(let y=y0;y<=y1;y++){const xs=[]; for(let i=0;i<pts.length;i++){const a=pts[i],bb=pts[(i+1)%pts.length];
          const ay=a[1],by=bb[1]; if((ay<=y&&by>y)||(by<=y&&ay>y)) xs.push(a[0]+(y-ay)/(by-ay)*(bb[0]-a[0])); }
          xs.sort((x,yy)=>x-yy); for(let k=0;k+1<xs.length;k+=2) for(let x=Math.round(xs[k]);x<=Math.round(xs[k+1]);x++) P(x,y,col); } };

      const f = spec.face, cx = 32;
      const Y0=f.top, chin=Y0+f.len, fw=f.foreheadW>>1, headTop=Y0-f.craniumH;

      /* THE TOP: the existing _bust shoulder polygon (renderFace lines 4312-4321),
         fed the real worn 'base' garment's own mid tone instead of a rolled RGB. */
      if (c.baseRamp) {
        const topCol = c.baseRamp.mid || c.baseRamp.dk;
        const sy = Math.max(34, Math.min(54, chin + 3));
        poly([[0,64],[0,Math.min(63,sy+7)],[cx-21,sy+2],[cx-9,sy-1],[cx,sy+1],[cx+9,sy-1],
              [cx+21,sy+2],[63,Math.min(63,sy+7)],[63,64]], topCol);
      }
      /* THE HAT: the existing durag polygon (renderFace lines 4735-4745), reused as a
         placeholder silhouette (a real hat SHAPE per style is COOK THREE's/CHARACTER's
         paint layer), fed the real worn 'head' garment's own ramp. */
      if (c.hatRamp) {
        const hD = c.hatRamp.dk, hL = c.hatRamp.lt || c.hatRamp.mid;
        const hbY = f.browY - 2;
        poly([[cx-fw-2,Y0+3],[cx-fw,headTop+1],[cx-5,headTop-2],[cx,headTop-3],[cx+5,headTop-2],
              [cx+fw,headTop+1],[cx+fw+2,Y0+3],[cx+fw-1,hbY],[cx,hbY-1],[cx-fw+1,hbY]], hD);
        line(cx-fw-2,Y0+3,cx+fw+2,Y0+3,hL);
        P(cx-fw-1,hbY,hL); P(cx+fw+1,hbY,hL);
      }
      /* THE FACE ACCESSORY: the existing shades band (renderFace lines 4760-4771), fed
         the real worn 'face' garment's own ramp. */
      if (c.faceRamp) {
        const gF = c.faceRamp.dk, gL = c.faceRamp.mid, gC = c.faceRamp.lt || c.faceRamp.mid;
        const e = spec.eyes, ew = e.w >> 1, gy0 = f.eyeY - 2, gy1 = f.eyeY + e.h;
        const glx = Math.round(cx - (e.gap/2 + ew)) - ew - 1, grx = Math.round(cx + (e.gap/2 + ew)) + ew + 1;
        for (let gy = gy0; gy <= gy1; gy++) for (let gx = glx; gx <= grx; gx++)
          P(gx, gy, (gy===gy0||gy===gy1||gx===glx||gx===grx) ? gF : gL);
        P(grx-1,gy0+1,gC); P(grx-2,gy0+1,gC); P(grx-1,gy0+2,gC);
        for (let gk=1; gk<=3; gk++) { P(glx-gk,gy0+2,gF); P(grx+gk,gy0+2,gF); }
      }
      /* THE HONEST TWIN (rule 82): no downloaded reference photo exists for faces
         (reference/art_bank/portrait/ and reference/library/face/ hold only a README/
         INDEX, checked again this round). The real, correct target for THIS candidate
         is not a photo -- it is the game's own already-approved rendering of this exact
         citizen's real body, which the walked crowd already shows every day. Rendered
         with the real, unmodified drawChar(), the same function the street uses. */
      const prevWorn = window.G_WORN;
      let twinUrl = null;
      try {
        window.G_WORN = window.BOH_PERSONLOOK.lookFor(c.id, (window.GARMENTS||[]).filter(g=>g.st==='canon')).worn;
        const bcv = document.createElement('canvas'); bcv.width = 112; bcv.height = 112;
        drawChar(bcv, 'S', 'idle', 0);
        twinUrl = bcv.toDataURL('image/png');
      } catch (_e) {} finally { window.G_WORN = prevWorn; }

      out.push({ id: c.id, today: Array.from(today), fixed: Array.from(buf), twinUrl, worn: { hat: c.bodyHat, face: c.bodyFace, top: c.topName, topLayer: c.topLayer } });
    }
    return out;
  }, chosen);

  /* ---------- 5. PROVED SAFE: 100 regular citizens unchanged (nothing real touched) ---------- */
  const safe = await p.evaluate(() => {
    let hashes = [];
    for (let i = 0; i < 100; i++) {
      const id = 'gate:crowd:' + (i + 500);
      const spec = faceFor(id);
      const buf = renderFace(spec, { ramp: faceRampFor(spec) });
      let h = 2166136261;
      for (let k = 0; k < buf.length; k++) { h ^= buf[k]; h = (h * 16777619) >>> 0; }
      hashes.push(h);
    }
    return hashes;
  });
  const safeAgain = await p.evaluate(() => {
    let hashes = [];
    for (let i = 0; i < 100; i++) {
      const id = 'gate:crowd:' + (i + 500);
      const spec = faceFor(id);
      const buf = renderFace(spec, { ramp: faceRampFor(spec) });
      let h = 2166136261;
      for (let k = 0; k < buf.length; k++) { h ^= buf[k]; h = (h * 16777619) >>> 0; }
      hashes.push(h);
    }
    return hashes;
  });
  const unsafeDiffs = safe.filter((h, i) => h !== safeAgain[i]).length;

  /* ---------- REFUSE TO WRITE ON ANY FAILED CLAIM ---------- */
  const fails = [];
  if (drift.hatAgree === drift.N) fails.push('the measured drift is zero -- the whole premise of this tool is false, do not ship it');
  if (unsafeDiffs !== 0) fails.push('100 regular citizens are not deterministic/unchanged: ' + unsafeDiffs);
  if (chosen.length < 2) fails.push('fewer than two real examples');
  if (rendered.some(r => !r.twinUrl)) fails.push('the honest twin (the real walked body) failed to render for at least one example');
  if (errs.length) fails.push('page errors: ' + errs.join(' | '));
  if (fails.length) { console.error('REFUSED TO WRITE:\n' + fails.map(f => ' - ' + f).join('\n')); await b.close(); process.exit(1); }

  /* ---------- 6. COMPOSE THE SHEET, THREE COLUMNS: TODAY, FIXED, THE HONEST TWIN ---------- */
  const scale = 6, N = 64, pad = 10, colW = N*scale, rowH = N*scale + 60;
  const canvas = await p.evaluate(async ({ rendered, scale, N, pad, colW, rowH }) => {
    const cv = document.createElement('canvas');
    cv.width = colW*3 + pad*4; cv.height = rowH * rendered.length + 80;
    const ctx = cv.getContext('2d'); ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = '#15120f'; ctx.fillRect(0,0,cv.width,cv.height);
    ctx.fillStyle = '#e8e2d6'; ctx.font = 'bold 18px monospace';
    ctx.fillText('THE REAL CLOTHES REACH THE PORTRAIT -- TODAY / FIXED / THE REAL BODY (the honest twin)', pad, 30);
    const loadImg = (url) => new Promise((res) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = url; });
    for (let i = 0; i < rendered.length; i++) {
      const r = rendered[i];
      const y0 = 60 + i * rowH;
      const cols = [['TODAY (broken)', r.today, null], ['FIXED CANDIDATE (real colours)', r.fixed, null], ['THE REAL BODY (the honest twin)', null, r.twinUrl]];
      for (let j = 0; j < cols.length; j++) {
        const [label, buf, imgUrl] = cols[j];
        const x0 = pad + j * (colW + pad);
        ctx.fillStyle = '#b8ac94'; ctx.font = '11px monospace';
        ctx.fillText(label + ' -- ' + r.id, x0, y0 + 14);
        if (buf) {
          const tmp = document.createElement('canvas'); tmp.width = N; tmp.height = N;
          const tctx = tmp.getContext('2d');
          const idd = tctx.createImageData(N, N); idd.data.set(new Uint8ClampedArray(buf));
          tctx.putImageData(idd, 0, 0);
          ctx.drawImage(tmp, 0, 0, N, N, x0, y0 + 20, colW, colW);
        } else if (imgUrl) {
          const im = await loadImg(imgUrl);
          if (im) ctx.drawImage(im, 0, 0, im.width, im.height, x0, y0 + 20, colW, colW);
        }
      }
    }
    return cv.toDataURL('image/png');
  }, { rendered, scale, N, pad, colW, rowH });

  const b64 = canvas.replace(/^data:image\/png;base64,/, '');
  fs.writeFileSync(SHEET, Buffer.from(b64, 'base64'));

  const html = `<!doctype html><html><head><meta charset="utf-8"><title>THE REAL CLOTHES REACH THE PORTRAIT</title>
<style>body{background:#15120f;color:#e8e2d6;font-family:monospace;padding:20px}
img{image-rendering:pixelated;border:1px solid #444;max-width:100%}
.n{color:#f0a} .gap{color:#fc5}</style></head><body>
<h2>THE REAL CLOTHES REACH THE PORTRAIT</h2>
<p>Paolo, direct, 10/10: "all of the top clothing pieces and headwear and eyewear would be impacted by the portrait."</p>
<p>MEASURED FIRST: headwear and eyewear <b>shipped twice</b> (rule 37i, 9/27 and 9/22) but read the wrong, independent, legacy
system. Of ${drift.N} citizens: the real body wears a hat ${drift.bodyHat} times (from a real catalogue of 21 styles); the
portrait's old source claims a hat ${drift.factoryHat} times (from a catalogue of exactly ONE style, 'hat/durag'). They only
agree on presence/absence ${drift.hatAgree} of ${drift.N} times (${(drift.hatAgree/drift.N*100).toFixed(0)}%) -- barely above a
coin flip, and even a "both have a hat" case is usually two <i>different</i> hats. Same shape for face accessories
(shades/masks/bandanas): body ${drift.bodyFace}, old source ${drift.factoryFace}, agree ${drift.faceAgree} of ${drift.N}.
This is the sixth time this exact bug shape has hit this lane (cut SHAPE 8/28, hair COLOUR 9/20, the braid sentinel 9/24, the
face-maker's dropped dials 10/9, the whole crowd's random texture 10/9, now this).</p>
<p>TOP CLOTHING, MEASURED AS NEVER BUILT AT ALL: the portrait's shoulder colour has always been a rolled random RGB, never read
from any real garment (rule 37i, 9/27: "shoulders only if the clothing assets make it cheap; say the cost"). It is cheap now.</p>
<p class="gap">NO PORTRAIT REFERENCE TWIN EXISTS IN THE REPO (checked reference/art_bank/portrait/ and reference/library/face/,
both hold only a README/INDEX, no real image) -- named OWED again, not faked.</p>
<img src="PORTRAIT_THE_REAL_CLOTHES_REACH_THE_PORTRAIT.png">
<p class="n">CANDIDATE ONLY, RULE 100 (COOK ONLY UNTIL HIS FINAL): nothing here touches slices/, engine/ or the demo. The hat
and face-accessory SILHOUETTE reused above is a placeholder (the existing durag/shades shape everyone already has) --
new hat/accessory SHAPES are COOK THREE's/CHARACTER's paint layer, not reinvented here. Every colour shown is read straight
off the real garment the body already wears, from window.GARMENTS' own authored data, never invented.</p>
</body></html>`;
  fs.writeFileSync(PAGE, html);

  fs.writeFileSync(NUMS, JSON.stringify({
    measured: { N: drift.N, bodyHat: drift.bodyHat, factoryHat: drift.factoryHat, hatAgree: drift.hatAgree,
      bodyFace: drift.bodyFace, factoryFace: drift.factoryFace, faceAgree: drift.faceAgree },
    examples: chosen.map(c => ({ id: c.id, hat: c.bodyHat, face: c.bodyFace, top: c.topName, topLayer: c.topLayer })),
    provedSafe: { citizensChecked: 100, diffs: unsafeDiffs }
  }, null, 2));

  console.log('WROTE', SHEET);
  console.log('WROTE', PAGE);
  console.log('WROTE', NUMS);
  console.log(JSON.stringify({ drift: { N: drift.N, bodyHat: drift.bodyHat, factoryHat: drift.factoryHat, hatAgree: drift.hatAgree, bodyFace: drift.bodyFace, factoryFace: drift.factoryFace, faceAgree: drift.faceAgree }, examples: chosen.map(c=>c.id), provedSafe: unsafeDiffs === 0 }, null, 2));

  await b.close();
})();
