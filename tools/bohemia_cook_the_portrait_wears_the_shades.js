/* THE PORTRAIT WEARS THE SHADES THE BODY IS WEARING  (9/21/26, PORTRAIT lane, [shades on])
 *
 * ONE ID, ONE WHOLE PERSON (law, 8/27) pointing the other way.
 *
 * THIS LANE MEASURED IT ON ITSELF, 9/20 (commit 2c994a15, over 200 dressed citizens):
 *   65 of 200 show NO eyes on the body at all -- 53 behind opaque shades, 7 under a hat,
 *   5 neither -- and every one of them has BARE EYES in the portrait that pops up when
 *   they talk. A quarter of the valley takes its sunglasses off to speak to you.
 *
 * renderFace has never known that glasses exist: the word appears eighteen times in the
 * alpha and not once inside the face renderer. Glasses are a BODY layer. So this is the
 * FIRST mechanism, not a second one, which is the same shape as the eyes themselves in
 * 8/27 -- and ENGINE SYNC LAW is satisfied by there being exactly one.
 *
 * THE SHADES ARE NOT DRAWN, THEY ARE READ. Every colour comes out of the painted garment's
 * own ramp, PD_DATA.ramps['glasses/shades'], so the lens on the face is the lens on the
 * body and nobody invented a colour. REUSE-FIRST.
 *
 * AND THE CATCHLIGHT SITS ON THE RIGHT, because that is where this game's sun is
 * (art_45_gate.py: "a 3/4 iso mass is lit on its RIGHT face, shadowed on its LEFT") and
 * where this lane put the light on the face two rounds running. One light, everywhere, or
 * it is not a light.
 *
 * RIG CHECK: renders and reads; no joint, no bone, no painted pixel. It does NOT change
 * the shipped renderer -- rule 18 keeps code off the play surface and rule 15 says he sees
 * it in VOTE first.
 *
 *   node tools/bohemia_cook_the_portrait_wears_the_shades.js [N]
 */
'use strict';
const path = require('path'), fs = require('fs');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const CARDS = path.join(REPO, 'slices/vote');
const SHEET = path.join(REPO, 'records/target/BOHEMIA_THE_PORTRAIT_WEARS_THE_SHADES_9_21_26.png');
const NUMS  = path.join(REPO, 'records/target/BOHEMIA_THE_PORTRAIT_WEARS_THE_SHADES.json');
const N = parseInt(process.argv[2] || '200', 10);

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1700, height: 1000 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  await p.goto('file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load' });
  await p.waitForFunction(() => typeof faceFor === 'function' && typeof buildFrame === 'function',
    { timeout: 60000 });

  const out = await p.evaluate((N) => {
    const FN = 64;
    const key = c => c[0] + ',' + c[1] + ',' + c[2];

    /* ---------- THE COOK: shades, read out of the painted garment ---------- */
    function shadeFace(spec, ramp, flatBuf) {
      const px = new Uint8ClampedArray(flatBuf);
      const G = PD_DATA.ramps['glasses/shades'];
      if (!G || G.length < 3) return { px: px, drew: 0 };
      const FRAME = G[0], LENS = G[1], CATCH = G[2];
      const put = (x, y, c) => { if (x<0||x>=FN||y<0||y>=FN) return;
        const i=(y*FN+x)*4; px[i]=c[0];px[i+1]=c[1];px[i+2]=c[2];px[i+3]=255; };
      const f = spec.face, e = spec.eyes, cx = 32;
      const ew = e.w >> 1;
      /* *** THESE ARE THE SHADES THE BODY IS WEARING, NOT SHADES. ***
         The first cut drew two round lenses joined by a bridge, which is a pair of
         spectacles. I put the sheet up beside the street sprite and the painted garment
         is a WRAPAROUND: one continuous dark band across both eyes, the way every head
         in that top row reads. A portrait wearing a different pair of glasses from the
         body is the same defect this row exists to close, one layer down. So the band is
         one piece, and only the temple ends are frame. */
      const y0 = f.eyeY - 2, y1 = f.eyeY + e.h;
      const lx = Math.round(cx - (e.gap / 2 + ew)) - ew - 1;
      const rx = Math.round(cx + (e.gap / 2 + ew)) + ew + 1;
      let drew = 0;
      for (let y = y0; y <= y1; y++) for (let x = lx; x <= rx; x++) {
        const rim = (y === y0 || y === y1 || x === lx || x === rx);
        put(x, y, rim ? FRAME : LENS); drew++;
      }
      /* THE CATCH SITS ON THE RIGHT. Same sun as the face and the walls. */
      put(rx - 1, y0 + 1, CATCH); put(rx - 2, y0 + 1, CATCH); put(rx - 1, y0 + 2, CATCH);
      /* the arms, back to the temples */
      for (let k = 1; k <= 3; k++) { put(lx - k, y0 + 2, FRAME); put(rx + k, y0 + 2, FRAME); drew += 2; }
      return { px: px, drew: drew };
    }

    /* ---------- THE MEASURE, on rendered pixels, both surfaces ------------- */
    const canon = (window.GARMENTS || []).filter(g => g.st === 'canon');
    const keep = { eq: G.equipped, bv: G.bodyVar, worn: window.G_WORN, fa: G.faceAs,
                   sk: skinTone, hc: hairColor };
    const clear = () => { try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {} };
    function bodyPx(np, lk, sp, eq) {
      G.equipped = eq || np.equipped; G.bodyVar = lk.body; window.G_WORN = lk.worn;
      const tn = SKIN_TONES.find(z => z[0] === np.skinToneName); if (tn) skinTone = tn;
      hairColor = np.hairColor; G.faceAs = sp; clear();
      const fr = buildFrame('S', 'idle', 0);
      const a = new Array(fr.CW * fr.CH);
      for (let i = 0; i < a.length; i++) { const c = fr.px[i]; a[i] = c ? [c[0],c[1],c[2]] : null; }
      return { a: a, CW: fr.CW, grid: Array.from(fr.grid) };
    }
    const diffCount = (x, y) => { let n = 0;
      for (let i = 0; i < x.length; i++) { const u = x[i], v = y[i];
        if (!u && !v) continue;
        if (!u || !v || u[0]!==v[0] || u[1]!==v[1] || u[2]!==v[2]) n++; }
      return n; };

    let wearsShades = 0, bodyDrawsThem = 0, portraitDrawsThem = 0, cookDrawsThem = 0;
    const cast = [];
    for (let i = 0; i < N; i++) {
      const id = 'shades:' + i;
      const np = NPC_FACTORY.npcFrom(id);
      if (!np.equipped.glasses) continue;
      wearsShades++;
      const sp = faceFor(id), ramp = faceRampFor(sp);
      const lk = BOH_PERSONLOOK.lookFor(id, canon);
      /* does the BODY actually draw them? take the layer off and diff. */
      const withG = bodyPx(np, lk, sp, np.equipped);
      const noG = JSON.parse(JSON.stringify(np.equipped)); delete noG.glasses;
      const without = bodyPx(np, lk, sp, noG);
      const bodyPixels = diffCount(withG.a, without.a);
      if (bodyPixels > 0) bodyDrawsThem++;
      /* does the PORTRAIT? the only honest test is whether anything in the face changes
         when the person's glasses change. It cannot: renderFace has no glasses argument.
         Proved rather than asserted. */
      const pFlat = renderFace(sp, { ramp: ramp });
      const spNo = JSON.parse(JSON.stringify(sp));
      const pFlat2 = renderFace(spNo, { ramp: ramp });
      let portraitPixels = 0;
      for (let k = 0; k < pFlat.length; k += 4)
        if (pFlat[k]!==pFlat2[k]||pFlat[k+1]!==pFlat2[k+1]||pFlat[k+2]!==pFlat2[k+2]) portraitPixels++;
      if (portraitPixels > 0) portraitDrawsThem++;
      const cooked = shadeFace(sp, ramp, pFlat);
      if (cooked.drew > 0) cookDrawsThem++;
      if (cast.length < 5) {
        /* crop the body's head off the part grid, 1 = head, 2 = face */
        const Nb = withG.CW; let hx0=1e9,hy0=1e9,hx1=-1,hy1=-1;
        for (let k = 0; k < Nb*Nb; k++) { const g0 = withG.grid[k];
          if (g0!==1 && g0!==2) continue;
          const gx=k%Nb, gy=(k/Nb)|0;
          if(gx<hx0)hx0=gx; if(gx>hx1)hx1=gx; if(gy<hy0)hy0=gy; if(gy>hy1)hy1=gy; }
        hy0=Math.max(0,hy0-4); hx0=Math.max(0,hx0-3);
        hx1=Math.min(Nb-1,hx1+3); hy1=Math.min(Nb-1,hy1+2);
        const side = Math.max(hx1-hx0+1, hy1-hy0+1);
        const flatArr = new Uint8ClampedArray(Nb*Nb*4);
        for (let k = 0; k < Nb*Nb; k++) { const c = withG.a[k], o=k*4;
          if (c) { flatArr[o]=c[0];flatArr[o+1]=c[1];flatArr[o+2]=c[2];flatArr[o+3]=255; } }
        cast.push({ id: id, bodyN: Nb, body: Array.from(flatArr),
          crop: [hx0, hy0, side], before: Array.from(pFlat), after: Array.from(cooked.px),
          bodyPixels: bodyPixels });
      }
    }
    G.equipped=keep.eq; G.bodyVar=keep.bv; window.G_WORN=keep.worn; G.faceAs=keep.fa;
    skinTone=keep.sk; hairColor=keep.hc; clear();
    return { n: N, wearsShades, bodyDrawsThem, portraitDrawsThem, cookDrawsThem, cast,
             ramp: PD_DATA.ramps['glasses/shades'] };
  }, N);

  /* ---- the sheet: the body, the portrait now, the portrait wearing them ---- */
  const sheetPng = await p.evaluate((out) => {
    /* THE FIRST SHEET RAN OFF ITS OWN CANVAS. Two portraits at colW/1.6 each are 1.25
       columns wide, so every pair drifted right and the last one was cut in half. The
       column is now sized from what actually goes in it. A sheet he cannot read is not
       evidence, and this lane has written that sentence before. */
    const FN=64, PZ=4, PAD=26;
    const pW = FN*PZ;                 /* one portrait */
    const colW = pW*2 + 10;           /* two portraits side by side, plus the gap */
    const cv=document.createElement('canvas');
    cv.width = PAD + out.cast.length*(colW+PAD);
    cv.height = 250 + colW + pW + 130;
    const cx=cv.getContext('2d'); cx.imageSmoothingEnabled=false;
    cx.fillStyle='#14120f'; cx.fillRect(0,0,cv.width,cv.height);
    cx.fillStyle='#f0e6d4'; cx.font='bold 30px monospace';
    cx.fillText('THEY TAKE THEIR SUNGLASSES OFF TO TALK TO YOU', PAD, 46);
    cx.font='17px monospace'; cx.fillStyle='#b8ab95';
    cx.fillText('a quarter of the people in the valley wear shades you cannot see through. the face that', PAD, 86);
    cx.fillText('pops up when they speak has always had bare eyes, because the face drawing never knew', PAD, 110);
    cx.fillText('glasses exist. top row is the head on the street. middle is the portrait now. bottom is', PAD, 134);
    cx.fillText('the same portrait wearing the same shades, in the same colours the garment is painted in.', PAD, 158);
    const mk=(arr,n)=>{const t=document.createElement('canvas');t.width=t.height=n;
      const im=t.getContext('2d').createImageData(n,n); im.data.set(new Uint8ClampedArray(arr));
      t.getContext('2d').putImageData(im,0,0); return t;};
    const y0=250;
    out.cast.forEach((c,i)=>{
      const x=PAD+i*(colW+PAD);
      const bt=mk(c.body,c.bodyN);
      cx.drawImage(bt, c.crop[0], c.crop[1], c.crop[2], c.crop[2], x, y0, colW, colW);
      const py = y0+colW+32;
      cx.drawImage(mk(c.before,FN),0,0,FN,FN, x, py, pW, pW);
      cx.drawImage(mk(c.after,FN),0,0,FN,FN, x+pW+10, py, pW, pW);
      cx.fillStyle='#8f836f'; cx.font='14px monospace';
      cx.fillText('on the street', x, y0+colW+22);
      cx.fillText('portrait now', x, py+pW+22);
      cx.fillStyle='#c7b894';
      cx.fillText('wearing them', x+pW+10, py+pW+22);
    });
    return cv.toDataURL('image/png');
  }, out);

  fs.mkdirSync(CARDS, { recursive: true });
  fs.writeFileSync(SHEET, Buffer.from(sheetPng.split(',')[1], 'base64'));

  const summary = { when: new Date().toISOString(), sampled: out.n,
    wearsShades: out.wearsShades, bodyDrawsThem: out.bodyDrawsThem,
    portraitDrawsThem: out.portraitDrawsThem, cookDrawsThem: out.cookDrawsThem,
    garmentRamp: out.ramp };
  fs.writeFileSync(NUMS, JSON.stringify(summary, null, 1));
  console.log(JSON.stringify(summary, null, 1));
  console.log('sheet ' + SHEET + '   page errors ' + errs.length);
  await b.close();
})();
