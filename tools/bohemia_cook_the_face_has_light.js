/* THE FACE HAS LIGHT ON IT  (9/21/26, PORTRAIT lane, row [faces first] / [horror face])
 *
 * Paolo 9/14: "a lot of the faces that you've been making [are] dogshit, VERY BLANK."
 * Rule 22 (9/21): a making lane COOKS EVERY ROUND. This is the cook.
 *
 * MEASURED LAST ROUND, by looking at the four faces the game actually speaks with, at 5x:
 * three defects, the same on all four.
 *    1. the eye is a white box with a block of colour in it -- the sclera is [230,231,228],
 *       brighter than any skin tone in the palette, so the eye GLOWS and reads as a bead.
 *    2. the mouth is a flat rectangle -- no seam between the lips, no corners.
 *    3. THERE IS NO LIGHT. Nothing on the face mass is shaded. A face with no light has no
 *       form, and "blank" is exactly what that looks like.
 *
 * *** AND THE FACE AND THE WORLD DISAGREE ABOUT WHERE THE SUN IS. ***
 * art_45_gate.py holds the world's convention in one line: "a 3/4 iso mass is lit on its
 * RIGHT face, shadowed on its LEFT". renderFace fills cx+7..cx+cw with ShSoft -- it shades
 * the RIGHT. Every building in the valley is lit from the right and every face is lit from
 * the left. This tool measures that split on rendered pixels before it changes anything.
 *
 * WHAT THE COOK DOES, and every choice is a law rather than a preference:
 *   THE LIGHT HAS A FIXTURE (the bible, rule 4: "every lumen has a source you can point
 *     at ... no mood gradient, ever"). The fixture is THE VALLEY SKY, the same sun
 *     art_45_gate already holds every building to, so the face turns the same way a wall
 *     does. Light from the RIGHT.
 *   NO NEW COLOURS. Every shaded pixel is quantised onto the FOUR ENTRIES THIS FACE
 *     ALREADY OWNS (its own skin ramp). A terminator in four steps is pixel art; a smooth
 *     falloff is the mood gradient rule 4 forbids.
 *   IT IS BAKED, NOT SHADED AT RUNTIME (rule 10). This runs once, into the buffer, the
 *     same place renderFace already draws.
 *   THE FACE STILL HOLDS (rule 6, THE STILL FACE). Nothing here animates, nothing
 *     performs; it is form, not expression.
 *
 * RIG CHECK (RIG IS LAW): renders and reads. No joint, no bone, no painted pixel touched,
 * and IT DOES NOT CHANGE THE SHIPPED RENDERER -- rule 18 keeps code off the play surface
 * and rule 15 says he sees it in the VOTE tab first. The player's approved face is not
 * touched by this file at all.
 * REUSE CHECK: cooks no new art. Every face is the alpha's own renderFace; this re-lights
 * the pixels it already drew, using that face's own bones and its own ramp.
 *
 *   node tools/bohemia_cook_the_face_has_light.js
 */
'use strict';
const path = require('path'), fs = require('fs');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const CARDS = path.join(REPO, 'slices/vote');
const OUT = path.join(REPO, 'records/target/BOHEMIA_THE_FACE_HAS_LIGHT_9_21_26.png');
const JSON_OUT = path.join(REPO, 'records/target/BOHEMIA_THE_FACE_HAS_LIGHT.json');

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  await p.goto('file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load' });
  await p.waitForFunction(() => typeof faceFor === 'function' && typeof renderFace === 'function',
    { timeout: 60000 });

  const r = await p.evaluate(() => {
    const N = 64;
    const key = (c) => c[0] + ',' + c[1] + ',' + c[2];
    const lum = (c) => 0.3 * c[0] + 0.59 * c[1] + 0.11 * c[2];

    /* ---- THE COOK ------------------------------------------------------ */
    function litFace(spec, ramp) {
      const flat = renderFace(spec, { ramp: ramp });
      const px = new Uint8ClampedArray(flat);              /* work on a copy */
      const L = ramp[0], Mn = ramp[1], Sh = ramp[2], Ln = ramp[3];
      const ShSoft = [(Mn[0]*2+Sh[0])/3|0, (Mn[1]*2+Sh[1])/3|0, (Mn[2]*2+Sh[2])/3|0];
      /* the four steps this face already owns, lightest to darkest */
      const STEP = [L, Mn, ShSoft, Sh];
      const skin = {}; [L, Mn, ShSoft, Sh].forEach((c, i) => skin[key(c)] = i);
      const at = (x, y) => { const i = (y*N+x)*4; return [px[i], px[i+1], px[i+2], px[i+3]]; };
      const put = (x, y, c) => { const i = (y*N+x)*4; px[i]=c[0]; px[i+1]=c[1]; px[i+2]=c[2]; px[i+3]=255; };
      const isSkin = (x, y) => { const c = at(x, y); return c[3] ? (key(c) in skin) : false; };

      const f = spec.face, cx = 32;
      const top = f.top - f.craniumH, chin = f.top + f.len;

      /* 1. THE LIGHT. Per row, find this face's own span, turn it like a cylinder,
            quantise onto its own four steps. Light from the RIGHT, the valley sky,
            the same side art_45_gate holds every wall to. */
      const rows = [];
      for (let y = 0; y < N; y++) {
        let a = -1, z = -1;
        for (let x = 0; x < N; x++) if (isSkin(x, y)) { if (a < 0) a = x; z = x; }
        rows[y] = (z >= a && a >= 0) ? [a, z] : null;
      }
      for (let y = 0; y < N; y++) {
        const rw = rows[y]; if (!rw) continue;
        const c0 = (rw[0] + rw[1]) / 2, half = Math.max(1, (rw[1] - rw[0]) / 2);
        for (let x = rw[0]; x <= rw[1]; x++) {
          if (!isSkin(x, y)) continue;
          const u = (x - c0) / half;                      /* -1 left .. +1 right */
          /* the mass also turns away below the cheekbone; the brow sits proud */
          const v = (y - f.top) / Math.max(1, f.len);
          let t = 0.52 + 0.46 * u - 0.16 * Math.max(0, v - 0.62);
          if (v < 0.10) t += 0.06;                        /* the brow ridge catches it */
          /* *** THE TERMINATOR PIVOTS, IT DOES NOT DIM. ***
             The first cut of this took the absolute band from the turn and then guarded it
             with Math.max(band, wasBand) so it could never lighten a pixel the artist drew
             dark. The guard was well meant and it turned the whole pass into a DARKENING
             pass: I looked at the four faces and every one had lost brightness instead of
             gaining form. RAY went 149/145 to 117/137 -- his lit side barely moved and his
             shadow side fell 32 points. A face that is uniformly darker is not lit, it is
             dimmed, and the numbers said "spread went up" the whole time.
             So the shading is RELATIVE to what renderFace already drew: the lit side comes
             up one step, the shadow side goes down one or two. The face keeps its own value
             structure and gains a turn, which is what light actually does. */
          const wasBand = skin[key(at(x, y))];
          const delta = t > 0.72 ? -1 : t > 0.46 ? 0 : t > 0.22 ? 1 : 2;
          put(x, y, STEP[Math.max(0, Math.min(3, wasBand + delta))]);
        }
      }

      /* 2. THE BONES CAST. Each one is placed on this face's own numbers. */
      const darken = (x, y) => { if (!isSkin(x, y)) return;
        const bnd = skin[key(at(x, y))]; put(x, y, STEP[Math.min(3, bnd + 1)]); };
      const e = spec.eyes, gap = e.gap, ew = e.w >> 1;
      /* under the brow, across the socket: the deepest shadow on any real face */
      for (const side of [-1, 1]) {
        const ex = cx + side * (gap / 2 + ew);
        for (let x = Math.round(ex - ew - 1); x <= Math.round(ex + ew + 1); x++)
          for (let y = f.eyeY - 1; y < f.eyeY; y++) darken(x, y);
      }
      /* the nose casts to the LEFT, because the light is on the right */
      for (let y = f.eyeY + 2; y <= f.noseY; y++) { darken(cx - (spec.nose.w >> 1) - 1, y); }
      for (let x = cx - (spec.nose.w>>1) - 2; x <= cx - (spec.nose.w>>1) - 1; x++) darken(x, f.noseY);
      /* under the lower lip, and the chin turning away */
      for (let x = cx - (spec.mouth.w >> 1); x <= cx + (spec.mouth.w >> 1); x++)
        darken(x, f.mouthY + (spec.mouth.fullLower || 1) + 1);

      /* 3. THE EYE STOPS GLOWING AND THE LID SITS ON IT.
            [230,231,228] is brighter than every skin tone in SKIN_TONES, which is why it
            reads as a bead. The sclera is tied to THIS FACE's own light step instead, and
            the top row takes the lid's shadow the way a real eyeball does. */
      const SCL_OLD = '230,231,228';
      const scl = [Math.min(255, L[0]*0.96+16|0), Math.min(255, L[1]*0.96+16|0), Math.min(255, L[2]*0.96+16|0)];
      const sclShade = [scl[0]*0.74|0, scl[1]*0.74|0, scl[2]*0.76|0];
      let sclCount = 0;
      for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
        if (key(at(x, y)) !== SCL_OLD) continue;
        sclCount++;
        const above = (y > 0) ? at(x, y - 1) : null;
        const lidAbove = above && above[3] && key(above) !== SCL_OLD;
        put(x, y, lidAbove ? sclShade : scl);
      }

      /* 4. THE MOUTH GETS A SEAM AND CORNERS. A flat rectangle is a sticker. */
      const mc = spec.mouth.color, mk = key(mc);
      const seam = [mc[0]*0.45|0, mc[1]*0.42|0, mc[2]*0.46|0];
      const corner = [mc[0]*0.32|0, mc[1]*0.30|0, mc[2]*0.34|0];
      const lipRows = [];
      for (let y = 0; y < N; y++) { let a = -1, z = -1;
        for (let x = 0; x < N; x++) if (key(at(x, y)) === mk) { if (a < 0) a = x; z = x; }
        if (z >= a && a >= 0) lipRows.push([y, a, z]); }
      if (lipRows.length) {
        const topRow = lipRows[0][0];
        for (const [y, a, z] of lipRows) {
          if (y === topRow) for (let x = a; x <= z; x++) put(x, y, seam);   /* the seam */
          put(a, y, corner); put(z, y, corner);                            /* the corners */
        }
      }
      return { px: px, sclCount: sclCount };
    }

    /* ---- THE MEASURE: which side is lit, before and after ---------------- */
    function lightSplit(buf, spec, ramp) {
      const L = ramp[0], Mn = ramp[1], Sh = ramp[2];
      const ShSoft = [(Mn[0]*2+Sh[0])/3|0, (Mn[1]*2+Sh[1])/3|0, (Mn[2]*2+Sh[2])/3|0];
      const sk = {}; [L, Mn, ShSoft, Sh].forEach(c => sk[key(c)] = 1);
      let lS = 0, lN = 0, rS = 0, rN = 0;
      for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
        const i = (y*N+x)*4; if (!buf[i+3]) continue;
        const c = [buf[i], buf[i+1], buf[i+2]]; if (!(key(c) in sk)) continue;
        if (x < 32) { lS += lum(c); lN++; } else { rS += lum(c); rN++; }
      }
      const l = lN ? lS/lN : 0, rr = rN ? rS/rN : 0;
      return { left: +l.toFixed(1), right: +rr.toFixed(1), litSide: rr > l ? 'RIGHT' : 'LEFT',
               spread: +Math.abs(rr - l).toFixed(1) };
    }

    const roles = [['MOTHER','DENISE'],['FATHER','RAY'],['SIBLING OLDER','MARCO'],['SIBLING LOST','NINA']];
    const made = [];
    for (const [role, name] of roles) {
      let w = null; try { w = window.openFaceFor(role); } catch (e) {}
      if (!w) continue;
      const sp = faceFor(w.id, w.over || undefined);
      const ramp = faceRampFor(sp);
      const before = renderFace(sp, { ramp: ramp });
      const after = litFace(sp, ramp);
      made.push({ role, name, id: w.id,
        beforeSplit: lightSplit(before, sp, ramp),
        afterSplit: lightSplit(after.px, sp, ramp),
        sclera: after.sclCount,
        before: Array.from(before), after: Array.from(after.px) });
    }
    return made;
  });

  /* ---- draw one card per face, and one sheet ---------------------------- */
  const sheet = await p.evaluate((made) => {
    const N = 64, Z = 6, TRUE = 56, PAD = 20;
    const cell = TRUE + 12 + N * Z;
    const cv = document.createElement('canvas');
    cv.width = PAD + made.length * (cell + PAD);
    cv.height = 250 + N * Z + 150;
    const cx = cv.getContext('2d'); cx.imageSmoothingEnabled = false;
    cx.fillStyle = '#14120f'; cx.fillRect(0, 0, cv.width, cv.height);
    cx.fillStyle = '#f0e6d4'; cx.font = 'bold 30px monospace';
    cx.fillText('THE FACE HAS LIGHT ON IT NOW', PAD, 46);
    cx.font = '17px monospace'; cx.fillStyle = '#b8ab95';
    cx.fillText('you said the faces are very blank. nothing on them was shaded at all, so they had no', PAD, 86);
    cx.fillText('shape. the sun in this game comes from the RIGHT, every building obeys it, and the', PAD, 110);
    cx.fillText('faces were lit from the LEFT. now they turn the same way a wall does. the eye stopped', PAD, 134);
    cx.fillText('glowing, the lid sits on it, and the mouth has a seam instead of being a flat block.', PAD, 158);
    cx.fillText('OLD on the left of each pair, NEW on the right. no new colours: same skin, four steps.', PAD, 190);
    const mk = (arr) => { const t = document.createElement('canvas'); t.width = t.height = N;
      const im = t.getContext('2d').createImageData(N, N); im.data.set(new Uint8ClampedArray(arr));
      t.getContext('2d').putImageData(im, 0, 0); return t; };
    const y = 250;
    made.forEach((m, i) => {
      const x = PAD + i * (cell + PAD);
      cx.drawImage(mk(m.before), 0, 0, N, N, x, y, N * Z / 2, N * Z / 2);
      cx.drawImage(mk(m.after), 0, 0, N, N, x + N * Z / 2 + 10, y, N * Z / 2, N * Z / 2);
      cx.fillStyle = '#e8dfc8'; cx.font = 'bold 19px monospace';
      cx.fillText(m.name, x, y + N * Z / 2 + 32);
      cx.fillStyle = '#8f836f'; cx.font = '14px monospace';
      cx.fillText('lit side was ' + m.beforeSplit.litSide + ', now ' + m.afterSplit.litSide, x, y + N * Z / 2 + 54);
      cx.fillText('left/right ' + m.beforeSplit.left + '/' + m.beforeSplit.right
        + '  ->  ' + m.afterSplit.left + '/' + m.afterSplit.right, x, y + N * Z / 2 + 74);
    });
    return cv.toDataURL('image/png');
  }, r.map(m => ({ name: m.name, before: m.before, after: m.after,
                   beforeSplit: m.beforeSplit, afterSplit: m.afterSplit })));

  fs.mkdirSync(CARDS, { recursive: true });
  fs.writeFileSync(OUT, Buffer.from(sheet.split(',')[1], 'base64'));

  /* one card per face, so his comment lands on ONE face */
  for (const m of r) {
    const one = await p.evaluate(({ before, after, name, bs, as }) => {
      const N = 64, Z = 7, PAD = 18;
      const cv = document.createElement('canvas');
      cv.width = PAD * 3 + N * Z * 2; cv.height = PAD * 2 + N * Z + 120;
      const cx = cv.getContext('2d'); cx.imageSmoothingEnabled = false;
      cx.fillStyle = '#14120f'; cx.fillRect(0, 0, cv.width, cv.height);
      const mk = (arr) => { const t = document.createElement('canvas'); t.width = t.height = N;
        const im = t.getContext('2d').createImageData(N, N); im.data.set(new Uint8ClampedArray(arr));
        t.getContext('2d').putImageData(im, 0, 0); return t; };
      cx.fillStyle = '#f0e6d4'; cx.font = 'bold 26px monospace';
      cx.fillText(name + ' -- light on the face', PAD, 34);
      cx.fillStyle = '#8f836f'; cx.font = '15px monospace';
      cx.fillText('OLD', PAD, 58); cx.fillText('NEW', PAD * 2 + N * Z, 58);
      cx.drawImage(mk(before), 0, 0, N, N, PAD, 68, N * Z, N * Z);
      cx.drawImage(mk(after), 0, 0, N, N, PAD * 2 + N * Z, 68, N * Z, N * Z);
      cx.fillStyle = '#8f836f'; cx.font = '14px monospace';
      cx.fillText('lit side was ' + bs + ', now ' + as + '. the sun in this game comes from the right.',
        PAD, 68 + N * Z + 30);
      return cv.toDataURL('image/png');
    }, { before: m.before, after: m.after, name: m.name,
         bs: m.beforeSplit.litSide, as: m.afterSplit.litSide });
    fs.writeFileSync(path.join(CARDS, 'PORTRAIT_LIGHT_' + m.name + '_9_21.png'),
      Buffer.from(one.split(',')[1], 'base64'));
  }

  const summary = r.map(m => ({ role: m.role, name: m.name, id: m.id,
    beforeSplit: m.beforeSplit, afterSplit: m.afterSplit, scleraPixels: m.sclera }));
  fs.writeFileSync(JSON_OUT, JSON.stringify({ when: new Date().toISOString(), faces: summary }, null, 1));
  console.log(JSON.stringify(summary, null, 1));
  console.log('sheet ' + OUT);
  console.log('page errors ' + errs.length);
  await b.close();
})();
