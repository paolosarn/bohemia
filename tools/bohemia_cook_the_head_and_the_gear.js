#!/usr/bin/env node
/* BOHEMIA -- COOK: THE HEAD AND THE GEAR.  PORTRAIT [head and gear] row, 9/28.
 *
 * FIRST LINE (rule 37i, THE THIRD VOTES, Paolo 9/27, LOCKED): the portrait is head
 * only for now (shoulders only if the clothing assets make it cheap; say the cost);
 * head gear MUST show in the portrait; backgrounds may change; eyes rest slightly
 * off-centre. NOTES ARE RULINGS -- this is a locked verdict, not a fresh candidate,
 * so all three are already built into the shipped renderer. This card shows what
 * changed, it does not ask permission for it.
 *
 * ONE, THE HAT SHOWS. Measured on 200 dressed citizens: 68 wear a hat or durag on
 * the body. Before this round, 0 of 68 carried it in the portrait -- faceFor never
 * asked the body what it was wearing. It does now, read off _np.equipped.hat the
 * same way the shades fix reads glasses. ONE ID, ONE WHOLE PERSON, closed a fourth
 * time this session.
 *
 * TWO, HEAD ONLY. The old shoulder colour was never a clothing asset -- spec.top
 * is `[20+(R('top1')*26|0), ...]`, a rolled RGB with nothing behind it; there is no
 * _np.equipped.top for it to read. Drawing it was inventing a garment, not showing
 * one cheaply, so the rule's own condition ("if the clothing assets make it cheap")
 * was never met. THE COST OF DROPPING IT: nothing real, because nothing real was
 * being shown. The bust mode (the anatomically-fitted shoulder line, [bb faces]
 * school) stays OFF by default exactly as it always was -- it is the future home
 * for real shoulders once a real garment is cheap to read here.
 *
 * THREE, EYES REST SLIGHTLY OFF-CENTRE. Done at the two places a portrait actually
 * gets drawn to the screen (paintPortrait, and the speaking-portrait loop), not in
 * renderFace: a small camera nudge, not a change to anybody's anatomy. Kept off the
 * renderer on purpose so no gate that measures a face straight off the buffer at
 * cx=32 has to know the display ever moves it -- checked, and none of them do.
 *
 * REFERENCE CHECK / [bb ...] SCHOOL LINE: read reference/library/battle_brothers/
 * README.md and all ten volumes before writing the barber row into the record.
 * None of the ten cover portraits, hairstyles or head shapes -- worldmap, combat,
 * weapons, armour, perks, backgrounds (recruit STATS, not looks), economy,
 * contracts/events, enemies, UI. That is not a hole in the library, it is the
 * truth about BB: a recruit's portrait is a fixed painted bust picked from a
 * background archetype, with no barber and no hair slider at all. There is no BB
 * hairstyle count to match. Written up plainly in the record rather than invented.
 *
 * RIG CHECK: renders and reads; no joint, no bone, no painted pixel changed.
 *
 *   node tools/bohemia_cook_the_head_and_the_gear.js [N]
 */
'use strict';
const path = require('path'), fs = require('fs');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const SHEET = path.join(REPO, 'slices/vote/PORTRAIT_THE_HEAD_AND_THE_GEAR.png');
const PAGE  = path.join(REPO, 'slices/vote/PORTRAIT_THE_HEAD_AND_THE_GEAR.html');
const NUMS  = path.join(REPO, 'records/target/BOHEMIA_THE_HEAD_AND_THE_GEAR.json');
const N = parseInt(process.argv[2] || '200', 10);

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1400, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  await p.goto('file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load' });
  await p.waitForFunction(() => typeof faceFor === 'function' && typeof renderFace === 'function',
    { timeout: 60000 });

  const out = await p.evaluate((N) => {
    const FN = 64;

    /* ---- ONE: the hat. same measure as the shades fix -- toggle the field, diff the buffer. */
    let wearsHat = 0, portraitDrawsHat = 0;
    const hatCast = [];
    for (let i = 0; i < N; i++) {
      const id = 'gate:crowd:' + i;
      const np = NPC_FACTORY.npcFrom(id);
      if (!np.equipped.hat) continue;
      wearsHat++;
      const sp = faceFor(id), ramp = faceRampFor(sp);
      const withHat = renderFace(sp, { ramp });
      const spNo = JSON.parse(JSON.stringify(sp)); spNo.hat = null;
      const withoutHat = renderFace(spNo, { ramp });
      let px = 0;
      for (let k = 0; k < withHat.length; k += 4)
        if (withHat[k]!==withoutHat[k]||withHat[k+1]!==withoutHat[k+1]||withHat[k+2]!==withoutHat[k+2]) px++;
      if (px > 0) portraitDrawsHat++;
      if (hatCast.length < 3) hatCast.push({ id, before: Array.from(withoutHat), after: Array.from(withHat) });
    }

    /* ---- TWO: head only. reconstruct the retired shoulder poly for one face, purely
       to show what it used to look like -- this drawing no longer exists in renderFace. */
    const sid = hatCast[0] ? hatCast[0].id : 'gate:crowd:0';
    const sp2 = faceFor(sid), ramp2 = faceRampFor(sp2);
    const nowBuf = renderFace(sp2, { ramp: ramp2 });
    const oldBuf = Uint8ClampedArray.from(nowBuf);
    (function reconstructOldShoulders(buf, spec) {
      const g = spec.top, cx = 32;
      const put = (x, y, c) => { if (x<0||x>=FN||y<0||y>=FN) return;
        const o=(y*FN+x)*4; buf[o]=c[0];buf[o+1]=c[1];buf[o+2]=c[2];buf[o+3]=255; };
      const poly = (pts) => { let ys=pts.map(pp=>pp[1]); let y0=Math.floor(Math.min(...ys)),y1=Math.ceil(Math.max(...ys));
        for (let y=y0;y<=y1;y++){let xs=[];for(let i=0;i<pts.length;i++){let a=pts[i],bb=pts[(i+1)%pts.length];
          let ay=a[1],by=bb[1]; if((ay<=y&&by>y)||(by<=y&&ay>y)) xs.push(a[0]+(y-ay)/(by-ay)*(bb[0]-a[0]));}
          xs.sort((a2,b2)=>a2-b2); for(let k=0;k+1<xs.length;k+=2) for(let x=Math.round(xs[k]);x<=Math.round(xs[k+1]);x++) put(x,y,g);}};
      poly([[8,64],[12,52],[cx-8,50],[cx,53],[cx+8,50],[52,52],[56,64]]);
    })(oldBuf, sp2);
    const hasRealTopAsset = !!(NPC_FACTORY.npcFrom(sid).equipped && NPC_FACTORY.npcFrom(sid).equipped.top);
    const emptyFrac = (() => { let empty = 0;
      for (let k = 0; k < nowBuf.length; k += 4) { const a = nowBuf[k+3];
        /* opaque background rows only count as "empty" below the neck line, same spirit
           as THE BUST's own 32%/54% measure -- rough, honest, not exact reproduction */
        if (a === 255) { /* opaque everywhere in this buffer; count bottom-18-rows sameness instead */ }
      }
      let sameAsBG = 0, rows = 18;
      for (let y = FN-rows; y < FN; y++) for (let x = 0; x < FN; x++) { const o=(y*FN+x)*4;
        const t=y/FN, bgr=56-18*t|0, bgg=54-18*t|0, bgb=70-22*t|0;
        if (Math.abs(nowBuf[o]-bgr)<3 && Math.abs(nowBuf[o+1]-bgg)<3 && Math.abs(nowBuf[o+2]-bgb)<3) sameAsBG++; }
      return sameAsBG / (FN*rows);
    })();

    /* ---- THREE: eyes rest slightly off-centre. composite exactly like paintPortrait. */
    const CARD = 176;
    function compositeAt(buf, dx) {
      const cv = document.createElement('canvas'); cv.width = cv.height = CARD;
      const cx2 = cv.getContext('2d'); cx2.imageSmoothingEnabled = false;
      const src = document.createElement('canvas'); src.width = src.height = FN;
      const sctx = src.getContext('2d'); const idd = sctx.createImageData(FN, FN); idd.data.set(buf);
      sctx.putImageData(idd, 0, 0);
      cx2.fillStyle = '#141109'; cx2.beginPath(); cx2.arc(CARD/2, CARD/2, CARD/2, 0, 7); cx2.clip(); cx2.fill();
      cx2.drawImage(src, 0, 0, FN, FN, dx, 0, CARD, CARD);
      return cv.toDataURL('image/png');
    }
    const centered = compositeAt(nowBuf, 0);
    const offset = compositeAt(nowBuf, -CARD*(2/FN));

    return { wearsHat, portraitDrawsHat, hatCast, sid,
             nowBuf: Array.from(nowBuf), oldBuf: Array.from(oldBuf),
             hasRealTopAsset, emptyFrac, centered, offset };
  }, N);

  /* ---- the sheet: three labeled sections, one PNG, canvas-composed like THE SHADES. */
  const sheetPng = await p.evaluate(async (out) => {
    const FN = 64, PZ = 4, PAD = 26, pW = FN*PZ, CARD = 176;
    const rowW = Math.max(3*(pW+30)+PAD, 2*(CARD+30)+PAD, out.hatCast.length*(pW*2+30)+PAD);
    const cv = document.createElement('canvas');
    cv.width = rowW; cv.height = 130 + (pW+70) + (pW+70) + (CARD+70) + 40;
    const cx = cv.getContext('2d'); cx.imageSmoothingEnabled = false;
    cx.fillStyle = '#14120f'; cx.fillRect(0, 0, cv.width, cv.height);
    cx.fillStyle = '#f0e6d4'; cx.font = 'bold 26px monospace';
    cx.fillText('THE HEAD AND THE GEAR', PAD, 40);
    cx.font = '15px monospace'; cx.fillStyle = '#b8ab95';
    cx.fillText('rule 37i, locked 9/27. three changes, already built, not a proposal.', PAD, 66);
    const mk = (arr, n) => { const t = document.createElement('canvas'); t.width = t.height = n;
      const im = t.getContext('2d').createImageData(n, n); im.data.set(new Uint8ClampedArray(arr));
      t.getContext('2d').putImageData(im, 0, 0); return t; };
    const mkImg = (dataUrl) => new Promise(res => { const im = new Image(); im.onload = () => res(im); im.src = dataUrl; });

    let y = 100;
    cx.fillStyle = '#c7b894'; cx.font = 'bold 16px monospace';
    cx.fillText('1. HEAD GEAR MUST SHOW', PAD, y);
    cx.fillStyle = '#8f836f'; cx.font = '13px monospace';
    cx.fillText(out.wearsHat + ' of 200 crowd citizens wear a hat/durag on the body. ' +
                out.portraitDrawsHat + ' of ' + out.wearsHat + ' now show it in the portrait too.', PAD, y+20);
    y += 36;
    out.hatCast.forEach((c, i) => {
      const x = PAD + i*(pW*2+30);
      cx.drawImage(mk(c.before, FN), 0, 0, FN, FN, x, y, pW, pW);
      cx.drawImage(mk(c.after, FN), 0, 0, FN, FN, x+pW+10, y, pW, pW);
      cx.fillStyle = '#8f836f'; cx.font = '12px monospace';
      cx.fillText('before', x, y+pW+16); cx.fillText('after', x+pW+10, y+pW+16);
    });
    y += pW + 46;

    cx.fillStyle = '#c7b894'; cx.font = 'bold 16px monospace';
    cx.fillText('2. HEAD ONLY (shoulders were never a real clothing asset)', PAD, y);
    cx.fillStyle = '#8f836f'; cx.font = '13px monospace';
    cx.fillText('real garment behind the old shoulder colour: ' + (out.hasRealTopAsset ? 'yes' : 'no') +
                '.  bottom rows now background instead of an invented colour: ' +
                (out.emptyFrac*100).toFixed(0) + '%.', PAD, y+20);
    y += 36;
    cx.drawImage(mk(out.oldBuf, FN), 0, 0, FN, FN, PAD, y, pW, pW);
    cx.drawImage(mk(out.nowBuf, FN), 0, 0, FN, FN, PAD+pW+10, y, pW, pW);
    cx.fillStyle = '#8f836f'; cx.font = '12px monospace';
    cx.fillText('old (retired code)', PAD, y+pW+16); cx.fillText('now', PAD+pW+10, y+pW+16);
    y += pW + 46;

    cx.fillStyle = '#c7b894'; cx.font = 'bold 16px monospace';
    cx.fillText('3. EYES REST SLIGHTLY OFF-CENTRE', PAD, y);
    cx.fillStyle = '#8f836f'; cx.font = '13px monospace';
    cx.fillText('the two circles below are the exact avatar frame, dead-center vs the shipped nudge.', PAD, y+20);
    y += 36;
    const [im1, im2] = await Promise.all([mkImg(out.centered), mkImg(out.offset)]);
    cx.drawImage(im1, PAD, y, CARD, CARD);
    cx.drawImage(im2, PAD+CARD+30, y, CARD, CARD);
    cx.fillStyle = '#8f836f'; cx.font = '12px monospace';
    cx.fillText('dead-center (old)', PAD, y+CARD+18); cx.fillText('slightly off-centre (now)', PAD+CARD+30, y+CARD+18);

    return cv.toDataURL('image/png');
  }, out);

  fs.mkdirSync(path.dirname(SHEET), { recursive: true });
  fs.writeFileSync(SHEET, Buffer.from(sheetPng.split(',')[1], 'base64'));

  const html = `<!doctype html><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>BOHEMIA — The Head And The Gear</title>
<!-- PORTRAIT [head and gear], rule 37i, LOCKED 9/27. Already built into the shipped
     renderer -- NOTES ARE RULINGS, this is not a candidate awaiting a thumb. -->
<style>
  :root{--ink:#e8e0cc;--bg:#0d0d12}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--ink);
       font:13px/1.55 ui-monospace,SFMono-Regular,Menlo,monospace;padding:14px}
  img{max-width:100%;image-rendering:pixelated;border-radius:6px}
  p{max-width:70ch;color:#a49a86}
</style>
<p>Rule 37i, THE THIRD VOTES, locked 9/27. Three portrait changes, all already shipped: the
hat and durag show now, the flat invented shoulder colour is gone (head only), and the whole
face sits a couple pixels off the dead centre of its frame instead of dead-on, the same way a
candid shot never lands your face exactly in the middle. Nothing here is waiting on a thumb;
this card is the proof it happened.</p>
<img src="PORTRAIT_THE_HEAD_AND_THE_GEAR.png" alt="the head and the gear">
`;
  fs.writeFileSync(PAGE, html);

  const summary = { when: new Date().toISOString(), sampled: out.wearsHat && N,
    wearsHat: out.wearsHat, portraitDrawsHat: out.portraitDrawsHat,
    hasRealTopAsset: out.hasRealTopAsset, emptyFrac: out.emptyFrac };
  fs.writeFileSync(NUMS, JSON.stringify(summary, null, 1));
  console.log(JSON.stringify(summary, null, 1));
  console.log('sheet ' + SHEET + '   page ' + PAGE + '   page errors ' + errs.length, errs.slice(0,2));
  await b.close();
})();
