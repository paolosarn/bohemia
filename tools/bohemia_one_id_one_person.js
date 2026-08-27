/* ONE ID, ONE WHOLE PERSON (8/27/26, CHARACTER lane).
 *
 * Paolo, 8/26: "Eye colors matching the portrait again."
 *
 * He was right, and the honest answer was worse than eyes. MEASURED over 200 citizens,
 * comparing the portrait that pops up when somebody talks against the body standing in
 * front of you:
 *     SKIN agreed   8.0% of the time
 *     HAIR agreed   0.0% -- not one person in two hundred
 *     EYES          the portrait had 6 colours; the body had ONE, the PLAYER'S, for
 *                   everybody, because the body's facial ramp read `pface`
 *
 * TWO DIFFERENT CAUSES, AND ONLY ONE OF THEM WAS A MISSING FEATURE:
 *   skin + hair  TWO MECHANISMS EXISTED. NPCFactory has owned them since 7/2 and is
 *                what the RUN dresses the crowd from; faceFor rolled its own on 8/27.
 *                ENGINE SYNC LAW -- the younger one is deleted, not reconciled.
 *   eyes         NO mechanism existed. The body hardcoded the player's iris. So this
 *                is the FIRST one, not a second.
 *
 * AND THE CITY'S OWN HAIR WAS A CLOWN PARADE, which only showed up once the portrait
 * started reading from it: NPCFactory picked UNIFORMLY over seven colours, so bright
 * red was 16.2% of the valley, pink was 12.8%, and BLACK WAS THE RAREST AT 12.7%.
 * That is the trenchcoat bug for a third time, in the oldest of the three places, and
 * it governed every BODY in the RUN.
 *
 * RIG CHECK (RIG IS LAW, 7/26): renders and photographs, writes nothing back. Never
 * touches BAKED, a joint, a bone or a painted pixel. It sets G.faceAs / G.bodyVar the
 * way every other surface does and puts them back.
 *   built on: buildFrame + renderFace (read-only)   joints: none   parts: none
 *
 * REUSE CHECK: cooks ZERO graphic pixels. Every body is the alpha's own render and
 * every face is renderFace, the approved portrait renderer.
 *
 *   node tools/bohemia_one_id_one_person.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const OUT = path.join(REPO, 'slices/look/one-id-one-person.png');

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1500, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load' });
  await p.waitForFunction(() => typeof faceFor === 'function' && typeof buildFrame === 'function',
    { timeout: 30000 });

  const png = await p.evaluate(() => {
    const IDS = ['street:2', 'street:5', 'street:9', 'street:11', 'street:14', 'street:20'];
    const FZ = 3, PAD = 16;
    const fw = 64 * FZ;
    /* THE BODY IS CROPPED TO ITS HEAD, AND THE CROP IS MEASURED, NOT GUESSED.
       The first cut of this picture drew the WHOLE body next to a 3x portrait, and
       at that size the head is a dozen pixels: the caption said "the same hair, the
       same eyes" over two images where neither was legible. A PICTURE THAT CANNOT
       SHOW ITS OWN CLAIM IS NOT EVIDENCE.
       buildFrame hands back a `grid` of part ids -- 1 is head, 2 is face -- so the
       head box comes off the render itself and is right for every body, whatever
       its height dial says. */
    const HZ = 5;
    const bw = 26 * HZ, bh = 26 * HZ;
    const colW = fw + 10 + bw;

    const cv = document.createElement('canvas');
    cv.width = PAD + IDS.length * (colW + PAD);
    cv.height = 176 + Math.max(bh, fw) + 140;
    const cx = cv.getContext('2d'); cx.imageSmoothingEnabled = false;
    cx.fillStyle = '#14120f'; cx.fillRect(0, 0, cv.width, cv.height);

    cx.fillStyle = '#f0e6d4'; cx.font = 'bold 30px monospace';
    cx.fillText('THE FACE AND THE BODY ARE THE SAME PERSON NOW', PAD, 46);
    cx.font = '17px monospace'; cx.fillStyle = '#b8ab95';
    cx.fillText('you said the eye colors should match the portrait. they did not, and it was worse', PAD, 84);
    cx.fillText('than eyes: their SKIN matched 8 times in 100 and their HAIR matched ZERO times in', PAD, 108);
    cx.fillText('200. the portrait was a different human being from the body standing in front of', PAD, 132);
    cx.fillText('you. same person on both sides now, every time, from one name.', PAD, 156);

    const keepW = window.G_WORN, keepE = G.equipped, keepV = G.bodyVar, keepF = G.faceAs;
    const keepSkin = skinTone, keepHair = hairColor;

    const y = 176;
    IDS.forEach((id, i) => {
      const x = PAD + i * (colW + PAD);
      const sp = faceFor(id);
      const np = NPC_FACTORY.npcFrom(id);

      /* the PORTRAIT */
      const buf = renderFace(sp, { ramp: faceRampFor(sp) });
      const t = document.createElement('canvas'); t.width = t.height = 64;
      const im = t.getContext('2d').createImageData(64, 64); im.data.set(buf);
      t.getContext('2d').putImageData(im, 0, 0);
      cx.drawImage(t, 0, 0, 64, 64, x, y, fw, fw);

      /* the BODY, dressed and faced from the SAME id, exactly as the crowd does it */
      const lk = BOH_PERSONLOOK.lookFor(id, (window.GARMENTS || []).filter(g => g.st === 'canon'));
      G.equipped = np.equipped;
      G.bodyVar = lk.body; window.G_WORN = lk.worn;
      const tn = SKIN_TONES.find(function (z) { return z[0] === np.skinToneName; });
      if (tn) skinTone = tn;
      hairColor = np.hairColor;
      G.faceAs = sp;
      try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
      const fr = buildFrame('S', 'idle', 0);
      const N = fr.CW, bt = document.createElement('canvas'); bt.width = bt.height = N;
      const bim = bt.getContext('2d').createImageData(N, N), D = bim.data;
      for (let k = 0; k < N * N; k++) { const c = fr.px[k], o = k * 4;
        if (c) { D[o] = c[0]; D[o+1] = c[1]; D[o+2] = c[2]; D[o+3] = 255; } }
      bt.getContext('2d').putImageData(bim, 0, 0);
      /* head bbox off the part-id grid: 1 = head, 2 = face */
      let hx0 = 1e9, hy0 = 1e9, hx1 = -1, hy1 = -1;
      for (let k = 0; k < N * N; k++) { const g = fr.grid[k];
        if (g !== 1 && g !== 2) continue;
        const gx = k % N, gy = (k / N) | 0;
        if (gx < hx0) hx0 = gx; if (gx > hx1) hx1 = gx;
        if (gy < hy0) hy0 = gy; if (gy > hy1) hy1 = gy; }
      /* pad it out so the hair above the skull is in shot, then square it up so
         every head is compared at the same scale */
      hx0 -= 5; hx1 += 5; hy0 -= 6; hy1 += 3;
      const side = Math.max(hx1 - hx0 + 1, hy1 - hy0 + 1, 20);
      const ccx = (hx0 + hx1) / 2, ccy = (hy0 + hy1) / 2;
      cx.drawImage(bt, Math.round(ccx - side / 2), Math.round(ccy - side / 2), side, side,
                       x + fw + 10, y, bw, bh);

      cx.fillStyle = '#8fc07a'; cx.font = 'bold 13px monospace';
      cx.fillText('PORTRAIT', x, y + Math.max(bh, fw) + 20);
      cx.fillText('THEIR HEAD', x + fw + 10, y + Math.max(bh, fw) + 20);
      cx.fillStyle = '#8a7d68'; cx.font = '12px monospace';
      cx.fillText(np.skinToneName + ' skin, both sides', x, y + Math.max(bh, fw) + 38);
    });

    G.bodyVar = keepV; window.G_WORN = keepW; G.equipped = keepE; G.faceAs = keepF;
    skinTone = keepSkin; hairColor = keepHair;
    try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}

    cx.fillStyle = '#6f6455'; cx.font = '14px monospace';
    cx.fillText('and the city stopped being a clown parade on the way: one person in six had', PAD, cv.height - 58);
    cx.fillText('bright orange hair and one in eight had pink, because the crowd picked evenly', PAD, cv.height - 38);
    cx.fillText('from a list where pink sits next to black. black was the rarest. it is 34% now.', PAD, cv.height - 18);
    return cv.toDataURL('image/png').split(',')[1];
  });

  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, Buffer.from(png, 'base64'));
  console.log('WROTE ' + path.relative(REPO, OUT) + '  (' + (fs.statSync(OUT).size / 1024).toFixed(1) + ' KB)');
})();
