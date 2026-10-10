#!/usr/bin/env node
/* BOHEMIA -- COOK: THE HIRES' FACES. PORTRAIT, 10/10/26, [the hires' faces].
 *
 * REFERENCE CHECK: no new pixel vocabulary -- a hire's face is the same
 * faceFor()/renderFace() pipeline every shipped portrait already runs, with
 * the over.hairName override [the enemy faces] built (FACE-01, FACE-03:
 * identity at small sizes is spacing, cheeks widest, jaw inside them --
 * untouched). Ids resolve in the reference library index.
 *
 * RULE 82/87 (coordinator, 10/10, THE SEVENTH VOTES): "all the art we made
 * looks nothing like the assets we downloaded" -- his NO on the enemy
 * faces, the whole crowd, and the hairstyles sheet ('dogshit', 'needs so
 * much work I can't even judge it', 'didn't load the display'). COOK THREE
 * now repaints the portrait paint layer; PORTRAIT keeps the dials, the hair
 * bank and the gates; NO PORTRAIT SHEET TO VOTE UNTIL DIRECTION PASSES
 * COOK THREE'S -- cook, do not show, the same instruction CHARACTER's own
 * [the twin on the thirteen] row is already working under. This tool cooks
 * the proof; nothing here registers a new VOTE item.
 *
 * (Separately, investigated the "didn't load the display" bug this round:
 * reproduced the real VOTE-tab -> LOOK AT IT -> nested-iframe chain over a
 * real HTTP server with the item put back to its unjudged state -- it loads
 * clean, zero errors, image at full natural width. Not reproducible in
 * current code; the most likely cause is the documented two-deploys-race
 * (records/BOHEMIA_TWO_DEPLOYS_RACE_9_22_26.md), a timing issue on the day
 * he looked, not a defect in this file today. Written up on its own.)
 *
 * PEOPLE's [good bros] (engine/bohemia_goodbros.js) rolls six recruits at a
 * post, one per real background (farmhand, messenger, butcher, brawler,
 * thief, militia); the settlement screen's own recruitsHere() already dresses
 * each with a real body look, one of the twelve CITY_CAST_LOOKS, each with a
 * real worn.hair -- the same shape FACTION_LOOKS gave the enemy tiers.
 * hireCard() currently draws a recruit's "face" as a crop of his body
 * SPRITE SHEET (fight_people/<look>.webp); no portrait has ever existed for
 * a hire. over.hairName (already built) does the whole match; the one new
 * idea is hireFaceId, which folds the settlement+week key recruitsHere()
 * already rolls everything else from into the face id, so the same slot
 * number at a different post or a different week is never the same face --
 * "no two hires match."
 *
 *   node tools/bohemia_cook_the_hires_faces.js
 */
'use strict';
const path = require('path'), fs = require('fs');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const SHEET = path.join(REPO, 'slices/vote/PORTRAIT_THE_HIRES_FACES.png');
const NUMS  = path.join(REPO, 'records/target/BOHEMIA_THE_HIRES_FACES.json');

/* the real list recruitsHere() rolls from, byte for byte out of
   BOHEMIA_SETTLEMENT_SCREEN.html so this tool never drifts from the live
   formula it is proving: HIRE_NAMES is draft:true and not needed here,
   LOOKS is the real array the modulo reads. */
const LOOKS = ['longcoat','barearms','pack','skirt','widebrim','cape','apron','poncho','bedroll','shorts','satchel','shortcoat'];
const BACKGROUNDS = ['farmhand','messenger','butcher','brawler','thief','militia']; /* CANDIDATES' own order */
const POSTS = ['THE WASH, NORTH LAS VEGAS:0', 'RED ROCK, SUMMERLIN:0']; /* two example posts, same convention as [the keepers' faces] */

function seedOf(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function lookFor(postKey, i) { return LOOKS[seedOf(postKey + ':look:' + i) % 12]; }

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1400, height: 1000 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  await p.goto('file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load' });
  await p.waitForFunction(() => typeof window.hireFaceSrc === 'function' && typeof faceFor === 'function' && window.CITY_CAST_LOOKS,
    { timeout: 60000 });

  const out = await p.evaluate(({ POSTS, BACKGROUNDS, lookTable }) => {
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

    const rows = [];
    POSTS.forEach(postKey => {
      BACKGROUNDS.forEach((bgId, i) => {
        const lookBare = lookTable[postKey + '|' + i]; /* precomputed in Node, same formula, cited not reinvented */
        const lookId = 'cast_' + lookBare;
        const look = CITY_CAST_LOOKS.filter(l => l.id === lookBare)[0];
        const id = window.hireFaceId(postKey, i);
        const spec = faceFor(id, look && look.worn && look.worn.hair ? { hairName: look.worn.hair } : {});
        const ramp = faceRampFor(spec);
        const px = renderFace(spec, { ramp });
        rows.push({ postKey, background: bgId, slot: i, lookId, wantHair: look ? look.worn.hair : null,
          gotHair: spec.hair.name, buf: Array.from(px) });
      });
    });

    /* SAME SLOT, SAME BACKGROUND, DIFFERENT POST: must NOT be the same face
       -- the row's own "no two hires match" test. */
    const crossPost = [];
    for (let i = 0; i < BACKGROUNDS.length; i++) {
      const a = rows[i], c = rows[i + BACKGROUNDS.length];
      crossPost.push({ background: BACKGROUNDS[i], differ: JSON.stringify(a.buf) !== JSON.stringify(c.buf) });
    }
    /* determinism: same id, called twice, byte-identical */
    const determinism = rows.slice(0, 3).map(r => {
      const id2 = window.hireFaceId(r.postKey, r.slot);
      const look2 = CITY_CAST_LOOKS.filter(l => l.id === r.lookId.replace('cast_',''))[0];
      const sp2 = faceFor(id2, look2 && look2.worn && look2.worn.hair ? { hairName: look2.worn.hair } : {});
      const px2 = renderFace(sp2, { ramp: faceRampFor(sp2) });
      return JSON.stringify(Array.from(px2)) === JSON.stringify(r.buf);
    });
    /* six at one post pairwise distinct (background excluded) */
    const postA = rows.slice(0, BACKGROUNDS.length);
    const masks = postA.map(r => fgMask(r.buf));
    let worst = 0, worstPair = '';
    for (let i = 0; i < postA.length; i++) for (let j = i + 1; j < postA.length; j++) {
      const v = iou(postA[i].buf, postA[j].buf, masks[i], masks[j]);
      if (v > worst) { worst = v; worstPair = postA[i].background + '/' + postA[j].background; }
    }

    const hashes = [];
    for (let k = 0; k < 100; k++) { const sp = faceFor('gate:crowd:' + k); const buf = renderFace(sp, { ramp: faceRampFor(sp) });
      let h = 0; for (let m = 0; m < buf.length; m++) h = (h * 31 + buf[m]) | 0; hashes.push(h); }

    return { rows: rows.map(r => ({ postKey: r.postKey, background: r.background, slot: r.slot, lookId: r.lookId,
      wantHair: r.wantHair, gotHair: r.gotHair, matched: r.wantHair === r.gotHair, buf: r.buf })),
      crossPost, determinism, worst, worstPair, citizenHashes: hashes };
  }, { POSTS, BACKGROUNDS, lookTable: (() => {
    const t = {}; POSTS.forEach(pk => BACKGROUNDS.forEach((_, i) => { t[pk + '|' + i] = lookFor(pk, i); })); return t;
  })() });

  if (!out.rows.every(r => r.matched)) { console.error('REFUSING TO WRITE: a hire\'s hair does not match his own look -- ' + out.rows.filter(r=>!r.matched).map(r=>r.postKey+':'+r.background)); await b.close(); process.exit(3); }
  if (!out.crossPost.every(r => r.differ)) { console.error('REFUSING TO WRITE: a background looks the same across two posts -- ' + JSON.stringify(out.crossPost)); await b.close(); process.exit(4); }
  if (!out.determinism.every(Boolean)) { console.error('REFUSING TO WRITE: a hire face is not deterministic'); await b.close(); process.exit(5); }
  if (out.worst > 0.6) { console.error('REFUSING TO WRITE: two hires at the same post read as the same face, ' + out.worst.toFixed(3) + ' ' + out.worstPair); await b.close(); process.exit(6); }

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
  if (citizenDiffs !== 0) { console.error('REFUSING TO WRITE: ' + citizenDiffs + ' of 100 citizens moved'); await b.close(); process.exit(7); }

  const sheetPng = await p.evaluate((out) => {
    const FN = 64, PZ = 3, pW = FN * PZ, PAD = 16, COL = pW + 34;
    const cv = document.createElement('canvas');
    cv.width = PAD * 2 + COL * 6; cv.height = 150 + (pW + 40) * 2;
    const cx = cv.getContext('2d'); cx.imageSmoothingEnabled = false;
    cx.fillStyle = '#14120f'; cx.fillRect(0, 0, cv.width, cv.height);
    cx.fillStyle = '#f0e6d4'; cx.font = 'bold 22px monospace';
    cx.fillText('THE HIRES\' FACES', PAD, 30);
    cx.font = '13px monospace'; cx.fillStyle = '#b8ab95';
    cx.fillText('six backgrounds, two posts. the hair matches the body look he already stands in.', PAD, 52);
    cx.fillText('closest pair at one post ' + (out.worst*100).toFixed(0) + '% identical (' + out.worstPair + ').', PAD, 72);
    const mk = (arr, n) => { const t = document.createElement('canvas'); t.width = t.height = n;
      const im = t.getContext('2d').createImageData(n, n); im.data.set(new Uint8ClampedArray(arr));
      t.getContext('2d').putImageData(im, 0, 0); return t; };
    out.rows.forEach((r, i) => {
      const postIdx = Math.floor(i / 6), col = i % 6;
      const x = PAD + col * COL, y = 96 + postIdx * (pW + 40);
      cx.drawImage(mk(r.buf, FN), 0, 0, FN, FN, x, y, pW, pW);
      cx.fillStyle = '#c7b894'; cx.font = 'bold 11px monospace';
      cx.fillText(r.background.toUpperCase(), x, y + pW + 14);
      cx.fillStyle = '#8d7c5e'; cx.font = '9px monospace';
      cx.fillText(r.gotHair.toLowerCase(), x, y + pW + 26);
      cx.fillText(r.postKey.split(',')[0], x, y + pW + 37);
    });
    return cv.toDataURL('image/png');
  }, out);

  fs.mkdirSync(path.dirname(SHEET), { recursive: true });
  fs.writeFileSync(SHEET, Buffer.from(sheetPng.split(',')[1], 'base64'));

  const summary = { when: new Date().toISOString(), worst: out.worst, worstPair: out.worstPair,
    crossPost: out.crossPost, determinism: out.determinism,
    rows: out.rows.map(r => ({ postKey: r.postKey, background: r.background, lookId: r.lookId, wantHair: r.wantHair, gotHair: r.gotHair, matched: r.matched })),
    citizenHashesChecked: out.citizenHashes.length, citizenDiffs,
    note: 'rule 82/87: cooked, not registered to VOTE -- no portrait sheet shows until DIRECTION passes COOK THREE\'s' };
  fs.writeFileSync(NUMS, JSON.stringify(summary, null, 1));
  console.log(JSON.stringify(summary, null, 1));
  console.log('sheet ' + SHEET + '   page errors ' + errs.length, errs.slice(0, 3));
  await b.close();
})();
