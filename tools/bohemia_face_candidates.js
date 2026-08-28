/* THE FACE AND HAIR CANDIDATES, BAKED FOR HIS THUMB (8/28/26, CHARACTER lane).
 *
 * Paolo, 8/28: "from now on all the character face shit is always gonna have to come with
 * a ... thumbs up or a thumbs down bro like you can't be doing shit without ... my thumb
 * thumbs up thumbs down if it's a visual. and a lot of them I'm gonna be thumbing down so
 * you gotta do better."
 *
 * THE VOTE TAB HAS EXISTED SINCE 8/7 AND HAS NEVER HELD A SINGLE FACE. It reads one bank
 * -- the district heroes -- so every haircut, every portrait and the whole face maker has
 * shipped with no way for him to say yes or no to any of it. He asked for the thumb back
 * on this lane and the thumb was never there to begin with.
 *
 * WHAT IT BAKES, and the shape is his (8/11): "when you show it to me only show me the
 * square grid that it will be in that is it". No cards, no frames, no name chips.
 *   HAIRCUT   one cell per canon style, drawn FOUR WAYS in one strip -- S, SE, E, N.
 *             A haircut is not one picture: A HAIRCUT READS FROM EVERY ANGLE OR IT IS NOT
 *             A HAIRCUT (8/28), so a cell that showed only the front would be asking him
 *             to thumb a third of the thing.
 *   FACE      one cell per rolled face, the portrait at the size it pops up in the RUN.
 *
 * RIG CHECK (RIG IS LAW, 7/26): renders and photographs, writes nothing back. Never touches
 * BAKED, a joint, a bone or a painted pixel.
 *   built on: buildFrame + renderFace + faceFor (read-only)   joints: none   parts: none
 *
 * REUSE CHECK: cooks ZERO graphic pixels. Every head is the alpha's own renderer, which is
 * the point -- a thumb here is a thumb on exactly what the game draws. Looked at
 * tools/bohemia_hair_reference_sheet.js (the 8/28 reference sheet, whose facing set and
 * head crop are reused in shape) and tools/bohemia_vote_tab.py (the bank format it reads).
 *
 *   node tools/bohemia_face_candidates.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const OUT = path.join(REPO, 'banks/BOHEMIA_FACE_CANDIDATES_8_28_26.txt');

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 900, height: 700 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && typeof faceFor === 'function',
    { timeout: 40000 });

  const out = await p.evaluate(() => {
    const items = [];
    const keepW = window.G_WORN, keepE = G.equipped;
    const shot = (dir, hairName) => {
      const eq = {}; for (const k in keepE) eq[k] = keepE[k];
      for (const s of ['hat','glasses','hair','shirt','jacket','pants','shoes']) eq[s] = '';
      G.equipped = eq;
      window.G_WORN = { base:'WHITE TEE', legs:'DUST TROUSERS', feet:'BROWN BOOTS', hair: hairName };
      try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
      return buildFrame(dir, 'idle', 0);
    };

    /* ---- THE HEAD CROP, measured off a bald head once and used for every cell ----
       so the styles are comparable to each other and to the skull underneath. */
    const ref = shot('S', ''); const N = ref.CW;
    let hy0 = 1e9, hx0 = 1e9, hx1 = -1;
    for (let i = 0; i < N * N; i++) { const g = ref.grid[i];
      if (g === 1 || g === 2) { const x = i % N, y = (i / N) | 0;
        if (y < hy0) hy0 = y; if (x < hx0) hx0 = x; if (x > hx1) hx1 = x; } }
    const CX = (hx0 + hx1) / 2;
    const SW = 40, SH = 42, sx0 = Math.round(CX - SW / 2), sy0 = hy0 - 5;

    const blit = (cx, fr, dx, dy, z) => {
      const im = cx.createImageData(N, N), D = im.data;
      for (let i = 0; i < N * N; i++) { const c = fr.px[i], o = i * 4;
        if (c) { D[o] = c[0]; D[o+1] = c[1]; D[o+2] = c[2]; D[o+3] = 255; } }
      const t = document.createElement('canvas'); t.width = t.height = N;
      t.getContext('2d').putImageData(im, 0, 0);
      cx.drawImage(t, sx0, sy0, SW, SH, dx, dy, SW * z, SH * z);
    };

    /* ---- HAIRCUTS: four ways in one strip ---------------------------------- */
    const DIRS = ['S', 'SE', 'E', 'N'];
    const Z = 3;
    const HAIR = (window.GARMENTS || []).filter(g => g.layer === 'hair' && g.st === 'canon');
    for (const h of HAIR) {
      const cv = document.createElement('canvas');
      cv.width = SW * Z * DIRS.length; cv.height = SH * Z;
      const cx = cv.getContext('2d'); cx.imageSmoothingEnabled = false;
      cx.fillStyle = '#17150f'; cx.fillRect(0, 0, cv.width, cv.height);
      DIRS.forEach((d, i) => blit(cx, shot(d, h.n), i * SW * Z, 0, Z));
      items.push({ id: 'hair_' + h.n.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
                   label: h.n.toLowerCase(), kind: 'haircut',
                   w: DIRS.length * SW, h: SH,
                   b64: cv.toDataURL('image/png').split(',')[1] });
    }

    /* ---- FACES: the portrait at the size it pops up when somebody talks ----- */
    const FZ = 4;
    for (let i = 0; i < 16; i++) {
      const id = 'street:' + (i * 7 + 3);
      const sp = faceFor(id);
      let buf; try { buf = renderFace(sp, { ramp: faceRampFor(sp) }); } catch (e) { continue; }
      const cv = document.createElement('canvas');
      cv.width = 64 * FZ; cv.height = 64 * FZ;
      const cx = cv.getContext('2d'); cx.imageSmoothingEnabled = false;
      const t = document.createElement('canvas'); t.width = t.height = 64;
      const im = t.getContext('2d').createImageData(64, 64); im.data.set(buf);
      t.getContext('2d').putImageData(im, 0, 0);
      cx.drawImage(t, 0, 0, 64, 64, 0, 0, 64 * FZ, 64 * FZ);
      items.push({ id: 'face_' + (i + 1), label: 'a face off the street',
                   kind: 'face', w: 64, h: 64,
                   b64: cv.toDataURL('image/png').split(',')[1] });
    }

    window.G_WORN = keepW; G.equipped = keepE;
    try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
    return items;
  });

  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify({
    built: '8/28/26',
    why: 'Paolo 8/28: every character/face visual ships with a thumbs up or thumbs down.',
    faces: out
  }));
  const kinds = {};
  for (const it of out) kinds[it.kind] = (kinds[it.kind] || 0) + 1;
  console.log('WROTE ' + path.relative(REPO, OUT) + '  (' +
    (fs.statSync(OUT).size / 1024 / 1024).toFixed(2) + ' MB)  ' +
    Object.entries(kinds).map(([k, v]) => v + ' ' + k).join(', '));
})();
