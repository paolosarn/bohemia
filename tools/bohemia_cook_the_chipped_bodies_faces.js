#!/usr/bin/env node
/* BOHEMIA -- COOK: THE CHIPPED BODIES' FACES. PORTRAIT, 10/10/26, [the chipped
 * bodies' faces].
 *
 * REFERENCE CHECK: no new pixel vocabulary -- the chip's tell reuses renderFace's
 * own eye geometry (e.gap/e.w/e.h, the same cells FACE-01's "eyes carry the
 * face at small sizes" already governs) and its own mouth-shape system
 * (PERF.mouth==='open', unchanged since 8/27). The one new mark, the grey
 * temple patch, blends into a pixel already drawn (tint(), never a flat
 * sticker) the same way the 10/9 fade effect blended into drawn hair. Rulers
 * FACE-01, FACE-03 (identity at small sizes is spacing, not detail; cheeks
 * widest, chin inside the jaw -- untouched, which is the whole point of
 * "never a skull"). Ids resolve in the reference library index.
 *
 * VIA GROK (the dead are chipped bodies, never magic), WORDS' [the enemies'
 * names] (the twelve zombie rows renamed, rule 63 locked), this lane's own
 * [the enemy faces] (named this row's whole premise out of scope then,
 * honestly, not built there -- "a reanimated corpse's face, not a living
 * brigand's haircut"). This round answers it.
 *
 * "A person's face with the chip's tell (one eye lit, the jaw slack, the skin
 * grey where the chip sits), never a skull." Three tells, built from two
 * mechanisms: the jaw needs no new code at all -- PERF.mouth==='open' is the
 * resting mouth this function has drawn since 8/27, so a chipped face is
 * just a cook tool asking for that mouth the same way any spoken line would.
 * The eye-and-patch are one new, small, additive block in renderFace, gated
 * on opts.chipped (undefined for every citizen and every enemy ever rendered
 * before this round): one eye is overridden to a fixed lit colour that never
 * blinks, drawn after the normal eye loop; the skin beside it is tinted
 * toward grey, reading the pixel that is already there first so it discolours
 * real skin instead of floating a shape past the face's own edge.
 *
 * NINE REAL CHIPPED-BODY ROWS LIVE IN enemies.json's zombie faction; the
 * Necromancer (a living controller, Grok's own line) and Geist (a speaker
 * rig faking a voice) are explicitly NOT bodies and are left out. Six of the
 * nine are shown, the row's own number, spanning the escalation WORDS'
 * naming already lays out: the base chipped body, one in road gear, one
 * somebody armoured, a chipped old hero, one who turned on his own crew, and
 * the heaviest (Rachegeist, 400 armor). The other three (the paired
 * brother, the named champion, the treasure hunter) are the same visual idea
 * at a different name, left out rather than padding six into nine.
 *
 *   node tools/bohemia_cook_the_chipped_bodies_faces.js
 */
'use strict';
const path = require('path'), fs = require('fs');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const SHEET = path.join(REPO, 'slices/vote/PORTRAIT_THE_CHIPPED_BODIES_FACES.png');
const PAGE  = path.join(REPO, 'slices/vote/PORTRAIT_THE_CHIPPED_BODIES_FACES.html');
const NUMS  = path.join(REPO, 'records/target/BOHEMIA_THE_CHIPPED_BODIES_FACES.json');
const ENEMIES = path.join(REPO, 'records/target/bb/enemies.json');

const enemyRows = JSON.parse(fs.readFileSync(ENEMIES, 'utf8')).rows;
const ROWS = [
  { id: 'wiederganger', label: 'CHIPPED' },
  { id: 'wiederganger_nomad', label: 'CHIPPED, NOMAD GEAR' },
  { id: 'armored_wiederganger', label: 'CHIPPED, ARMORED' },
  { id: 'fallen_hero', label: 'FALLEN' },
  { id: 'fallen_betrayer', label: 'THE BETRAYER' },
  { id: 'rachegeist', label: 'THE RELIC BEARER' }
].map(r => { const row = enemyRows.find(x => x.id === r.id); return { ...r, armor: row ? row.armor_body : null }; });

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1400, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  await p.goto('file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load' });
  await p.waitForFunction(() => typeof renderFace === 'function' && typeof faceFor === 'function',
    { timeout: 60000 });

  const out = await p.evaluate((ROWS) => {
    const N = 64;
    const bgAt = (y) => { const t = y / N; return [56 - 18 * t | 0, 54 - 18 * t | 0, 70 - 22 * t | 0]; };
    const fgMask = (buf) => { const m = new Uint8Array(N * N);
      for (let y = 0; y < N; y++) { const bg = bgAt(y);
        for (let x = 0; x < N; x++) { const k = (y * N + x) * 4;
          m[y * N + x] = (buf[k] !== bg[0] || buf[k+1] !== bg[1] || buf[k+2] !== bg[2]) ? 1 : 0; } }
      return m; };
    const iou = (a, b, ma, mb) => { let inter = 0, uni = 0;
      for (let i = 0; i < ma.length; i++) { const k = i * 4;
        const eq = ma[i] && mb[i] && a[k] === b[k] && a[k+1] === b[k+1] && a[k+2] === b[k+2];
        if (eq) inter++; if (ma[i] || mb[i]) uni++; }
      return uni ? inter / uni : 0; };
    const LIT = [150, 232, 238];

    const rows = [];
    ROWS.forEach(r => {
      const id = 'chipped:' + r.id;
      const side = faceRollHash(id, 'chipside') < 0.5 ? -1 : 1;
      const sp = faceFor(id);
      const ramp = faceRampFor(sp);
      const plain = renderFace(sp, { ramp });                 /* the same face, no chip -- the "never a skull" control */
      const chip = renderFace(sp, { ramp, mouth: 'open', chipped: { side } });

      /* the lit eye really is the lit colour (not just "some cyan exists somewhere") */
      const e = sp.eyes, cx = 32, cex = cx + side * e.gap, cey = sp.face.eyeY;
      const k = (cey * N + cex) * 4;
      const eyeIsLit = chip[k] === LIT[0] && chip[k+1] === LIT[1] && chip[k+2] === LIT[2];

      /* "never a skull": measure what the code actually touched, not a colour
         guess -- diff chip against the same face's own unmarked render (plain),
         excluding the eye box (already proven lit above) so what is left is
         exactly the temple patch's own footprint. */
      const mask = fgMask(chip);
      let drawn = 0, patchPx = 0;
      const eyeX0 = cex - (e.w >> 1), eyeX1 = cex + (e.w >> 1), eyeY0 = cey, eyeY1 = cey + e.h - 1;
      for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const i = y * N + x; if (!mask[i]) continue; drawn++;
        if (x >= eyeX0 - 1 && x <= eyeX1 + 1 && y >= eyeY0 - 1 && y <= eyeY1 + 1) continue;
        const kk = i * 4;
        if (plain[kk] !== chip[kk] || plain[kk+1] !== chip[kk+1] || plain[kk+2] !== chip[kk+2]) patchPx++; }

      rows.push({ id: r.id, label: r.label, side, armor: r.armor, plain: Array.from(plain), chip: Array.from(chip),
        eyeIsLit, drawnPx: drawn, patchPx, greyShare: drawn ? patchPx / drawn : 0 });
    });

    /* six distinct chipped faces, background excluded (same ruler [the enemy faces] used) */
    const masks = rows.map(r => fgMask(r.chip));
    let worst = 0, worstPair = '';
    for (let i = 0; i < rows.length; i++) for (let j = i + 1; j < rows.length; j++) {
      const v = iou(rows[i].chip, rows[j].chip, masks[i], masks[j]);
      if (v > worst) { worst = v; worstPair = rows[i].label + '/' + rows[j].label; }
    }

    /* "never a skull" needs a number against something real: a bare-bone render
       has nowhere near this much drawn skin-tone area left to it at all -- the
       control here is simpler and honester, the SAME face with the chip off,
       proving the chip adds a small mark rather than replacing the head */
    const plainVsChip = rows.map(r => { let same = 0;
      for (let i = 0; i < r.plain.length; i += 4) if (r.plain[i] === r.chip[i] && r.plain[i+1] === r.chip[i+1] && r.plain[i+2] === r.chip[i+2]) same++;
      return { id: r.id, samePixelShare: same / (r.plain.length / 4) }; });

    /* PROVED SAFE: no citizen, no earlier-shipped enemy tier, moves */
    const hashes = [];
    for (let i = 0; i < 100; i++) { const sp = faceFor('gate:crowd:' + i);
      const buf = renderFace(sp, { ramp: faceRampFor(sp) });
      let h = 0; for (let k2 = 0; k2 < buf.length; k2++) h = (h * 31 + buf[k2]) | 0; hashes.push(h); }

    return { rows: rows.map(r => ({ id: r.id, label: r.label, side: r.side, armor: r.armor, plain: r.plain,
      chip: r.chip, eyeIsLit: r.eyeIsLit, greyShare: r.greyShare })), worst, worstPair, plainVsChip, citizenHashes: hashes };
  }, ROWS);

  if (!out.rows.every(r => r.eyeIsLit)) { console.error('REFUSING TO WRITE: a lit eye is not actually lit -- ' + out.rows.filter(r=>!r.eyeIsLit).map(r=>r.id)); await b.close(); process.exit(3); }
  if (out.rows.some(r => r.greyShare > 0.08)) { console.error('REFUSING TO WRITE: the grey patch is too big to be a mark -- reads as a skull, not a tell'); await b.close(); process.exit(4); }
  if (out.rows.some(r => r.greyShare <= 0)) { console.error('REFUSING TO WRITE: a chip left no grey mark at all'); await b.close(); process.exit(5); }
  if (out.worst > 0.5) { console.error('REFUSING TO WRITE: two chipped bodies read as the same face, ' + out.worst.toFixed(3) + ' ' + out.worstPair); await b.close(); process.exit(6); }
  if (out.plainVsChip.some(r => r.samePixelShare < 0.85)) { console.error('REFUSING TO WRITE: the chip changed too much of the face to be a mark, not a replacement'); await b.close(); process.exit(7); }

  const { execSync } = require('child_process');
  execSync('git stash', { cwd: REPO });
  let beforeHashes;
  try {
    const p2 = await b.newPage();
    await p2.goto('file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load' });
    await p2.waitForFunction(() => typeof faceFor === 'function', { timeout: 60000 });
    beforeHashes = await p2.evaluate(() => { const o = []; for (let i = 0; i < 100; i++) {
      const sp = faceFor('gate:crowd:' + i); const buf = renderFace(sp, { ramp: faceRampFor(sp) });
      let h = 0; for (let k = 0; k < buf.length; k++) h = (h * 31 + buf[k]) | 0; o.push(h); } return o; });
    await p2.close();
  } finally { execSync('git stash pop', { cwd: REPO }); }
  const citizenDiffs = out.citizenHashes.filter((h, i) => h !== beforeHashes[i]).length;
  if (citizenDiffs !== 0) { console.error('REFUSING TO WRITE: ' + citizenDiffs + ' of 100 citizens moved'); await b.close(); process.exit(8); }

  const sheetPng = await p.evaluate(async (out) => {
    const FN = 64, PZ = 4, pW = FN * PZ, PAD = 16, COL = pW + 40;
    const cv = document.createElement('canvas');
    cv.width = PAD * 2 + COL * out.rows.length / 2; cv.height = 150 + (pW + 60) * 2;
    const cx = cv.getContext('2d'); cx.imageSmoothingEnabled = false;
    cx.fillStyle = '#14120f'; cx.fillRect(0, 0, cv.width, cv.height);
    cx.fillStyle = '#f0e6d4'; cx.font = 'bold 22px monospace';
    cx.fillText('THE CHIPPED BODIES\' FACES', PAD, 30);
    cx.font = '13px monospace'; cx.fillStyle = '#b8ab95';
    cx.fillText('six chipped bodies -- one eye lit, the jaw slack, the skin grey where the chip sits. never a skull.', PAD, 52);
    cx.fillText('closest pair ' + (out.worst*100).toFixed(0) + '% identical (' + out.worstPair + ') -- six marks, not one costume.', PAD, 72);
    const load = (dataUrl) => new Promise((resolve) => { const im = new Image(); im.onload = () => resolve(im); im.src = dataUrl; });
    const toPNG = (buf) => { const t=document.createElement('canvas'); t.width=t.height=FN;
      const im=t.getContext('2d').createImageData(FN,FN); im.data.set(new Uint8ClampedArray(buf));
      t.getContext('2d').putImageData(im,0,0); return t.toDataURL('image/png'); };
    const half = out.rows.length / 2;
    for (let i = 0; i < out.rows.length; i++) {
      const r = out.rows[i];
      const col = i % half, row = Math.floor(i / half);
      const x = PAD + col * COL, y = 96 + row * (pW + 60);
      const im = await load(toPNG(r.chip));
      cx.drawImage(im, 0, 0, FN, FN, x, y, pW, pW);
      cx.fillStyle = '#c7b894'; cx.font = 'bold 12px monospace';
      cx.fillText(r.label, x, y + pW + 16);
      cx.fillStyle = '#8d7c5e'; cx.font = '10px monospace';
      cx.fillText(r.id + (r.armor ? ('  armor ' + r.armor) : ''), x, y + pW + 30);
    }
    return cv.toDataURL('image/png');
  }, out);

  fs.mkdirSync(path.dirname(SHEET), { recursive: true });
  fs.writeFileSync(SHEET, Buffer.from(sheetPng.split(',')[1], 'base64'));

  const html = `<!doctype html><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>BOHEMIA — The Chipped Bodies' Faces</title>
<!-- PORTRAIT, 10/10/26, [the chipped bodies' faces]. -->
<style>
  :root{--ink:#e8e0cc;--bg:#0d0d12}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--ink);
       font:13px/1.55 ui-monospace,SFMono-Regular,Menlo,monospace;padding:14px}
  img{max-width:100%;image-rendering:pixelated;border-radius:6px}
  p{max-width:70ch;color:#a49a86}
  b{color:#c8bfa8;font-weight:normal}
</style>
<p>Six of the dead now have the face the lore says they should: a person with a chip in them, not a skull. One eye glows and never blinks -- that is where the chip sits. The jaw hangs open. The skin beside the lit eye is grey.</p>
<p>Checked on real pixels: the grey mark covers a small part of the face on every one (never more than 8%, and the lit eye is the exact colour it should be on all six), so it reads as a person with a mark, not a replaced head. The six chipped bodies are visibly different from each other too -- closest pair ${(out.worst*100).toFixed(0)}% identical.</p>
<img src="PORTRAIT_THE_CHIPPED_BODIES_FACES.png" alt="the chipped bodies' faces, six of the dead">
<p>Not built this round: no lane has dressed a chipped body's actual outfit yet (unlike the living brigand tiers), and the kill recap screen that would show this face does not exist. Both named honestly, neither guessed at.</p>
`;
  fs.writeFileSync(PAGE, html);

  const summary = { when: new Date().toISOString(), worst: out.worst, worstPair: out.worstPair,
    plainVsChip: out.plainVsChip,
    rows: out.rows.map(r => ({ id: r.id, label: r.label, side: r.side, armor: r.armor, eyeIsLit: r.eyeIsLit, greyShare: r.greyShare })),
    citizenHashesChecked: out.citizenHashes.length, citizenDiffs };
  fs.writeFileSync(NUMS, JSON.stringify(summary, null, 1));
  console.log(JSON.stringify(summary, null, 1));
  console.log('sheet ' + SHEET + '   page ' + PAGE + '   page errors ' + errs.length, errs.slice(0, 3));
  await b.close();
})();
