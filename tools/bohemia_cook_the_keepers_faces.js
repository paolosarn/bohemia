#!/usr/bin/env node
/* BOHEMIA -- COOK: THE KEEPERS' FACES. PORTRAIT, 10/9/26, [the keepers' faces].
 *
 * Rule 71a (one painted place), RUN TWO's own note: "the keepers' face request
 * unanswered in the demo." slices/BOHEMIA_SETTLEMENT_SCREEN.html (RUN TWO's
 * file, untouched here) already has the door built: its face(k) posts
 * {type:'needFace', who} the first time it draws a keeper with no face, and
 * reads one back as {type:'BOHEMIA_SETTLEMENT_FACE', who, src(dataURL)}.
 * Grepped this file and slices/BOHEMIA_CITY_WORLD.html (the immediate parent
 * that message reaches first): ZERO code anywhere answers it. Every keeper in
 * the demo today is the dim placeholder head face() draws while it waits.
 *
 * THE FIX: two small additive functions in the alpha, keeperFaceId(place,kind)
 * and keeperFaceSrc(place,kind,opts), built from parts that already exist and
 * are already approved -- faceFor(id) already rolls a deterministic face off
 * any string id; facePerform(id,tMs,line) already drives the same mouth/blink/
 * brow a live talking portrait (speakingPortrait, just above) uses. The one
 * real gap: a keeper's `who` ('settle-smith') is the SAME string in every
 * town, so faceFor(who) alone gives every smith in the valley one face --
 * backwards from the row's own ask. keeperFaceId folds the place's own name
 * into the id, the same string the settlement screen itself already seeds
 * everything per-place with (rollTraits, restock, nextRumour all key off
 * S.place.name) -- one convention, not a second "what makes a place different."
 *
 * WHO PLACES IT: the row says "RUN TWO places them" and this does not
 * second-guess that -- which file answers needFace, and how often it is
 * re-posted while a line plays, is wiring this round does not do. What ships
 * here is the mechanism, proved correct in isolation, exactly the way [the
 * enemy faces] shipped faceFor's over.hairName and left COMBAT's recap screen
 * for whoever builds it.
 *
 *   node tools/bohemia_cook_the_keepers_faces.js
 */
'use strict';
const path = require('path'), fs = require('fs');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const KL = require(path.join(REPO, 'engine/bohemia_keeper_lines.js'));
const SHEET = path.join(REPO, 'slices/vote/PORTRAIT_THE_KEEPERS_FACES.png');
const PAGE  = path.join(REPO, 'slices/vote/PORTRAIT_THE_KEEPERS_FACES.html');
const NUMS  = path.join(REPO, 'records/target/BOHEMIA_THE_KEEPERS_FACES.json');

const KINDS = KL.KEEPER_KINDS; /* ['smith','armourer','barber','clinic','board'], PEOPLE's own real list */
const TOWNS = ['THE WASH, NORTH LAS VEGAS', 'RED ROCK, SUMMERLIN'];
/* real price lines, PEOPLE's own module, never invented here -- the smith/armourer
   need a visit's real shelf range; a representative one stands in since this is a
   portrait proof, not a live shop (the mechanism itself takes whatever ctx a real
   visit hands it, unchanged). */
const CTX = { smith: { min: 2, max: 35 }, armourer: { min: 3, max: 60 } };
function lineFor(kind){ return KL.priceLine(kind, CTX[kind] || {}); }

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1400, height: 1000 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  await p.goto('file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load' });
  await p.waitForFunction(() => typeof window.keeperFaceSrc === 'function' && typeof faceFor === 'function',
    { timeout: 60000 });

  const out = await p.evaluate(({ KINDS, TOWNS, LINES }) => {
    const VISEME_MS = 250;
    const rows = [];
    TOWNS.forEach(town => {
      KINDS.forEach(kind => {
        const line = LINES[kind];
        const frames = [0, VISEME_MS, VISEME_MS * 2, VISEME_MS * 3].map(tMs =>
          window.keeperFaceSrc(town, kind, { line, tMs }));
        rows.push({ town, kind, line, rest: window.keeperFaceSrc(town, kind), frames,
          distinctFrames: new Set(frames).size });
      });
    });
    /* SAME KEEPER, SAME TOWN, TWO CALLS: must be byte-identical (deterministic, no dice). */
    const determinism = KINDS.map(k => window.keeperFaceSrc(TOWNS[0], k) === window.keeperFaceSrc(TOWNS[0], k));
    /* SAME KIND, DIFFERENT TOWN: must differ ("two towns' smiths differ", the row's own words). */
    const crossTown = KINDS.map(k => ({ kind: k, differ: window.keeperFaceSrc(TOWNS[0], k) !== window.keeperFaceSrc(TOWNS[1], k) }));
    /* SAME TOWN, DIFFERENT KIND: must differ from each other too (five keepers, not one face five times). */
    const sameTownPairs = [];
    for (let i = 0; i < KINDS.length; i++) for (let j = i + 1; j < KINDS.length; j++)
      sameTownPairs.push({ a: KINDS[i], b: KINDS[j], differ: window.keeperFaceSrc(TOWNS[0], KINDS[i]) !== window.keeperFaceSrc(TOWNS[0], KINDS[j]) });
    /* PROVED SAFE: every regular citizen (no over.hairName-style anything touched; this round
       adds two NEW functions, modifies nothing faceFor/renderFace/facePerform/speakingPortrait
       already does) still renders byte-identical. */
    const hashes = [];
    for (let i = 0; i < 100; i++) {
      const sp = faceFor('gate:crowd:' + i);
      const buf = renderFace(sp, { ramp: faceRampFor(sp) });
      let h = 0; for (let k = 0; k < buf.length; k++) h = (h * 31 + buf[k]) | 0;
      hashes.push(h);
    }
    return { rows, determinism, crossTown, sameTownPairs, citizenHashes: hashes };
  }, { KINDS, TOWNS, LINES: Object.fromEntries(KINDS.map(k => [k, lineFor(k)])) });

  if (!out.determinism.every(Boolean)) { console.error('REFUSING TO WRITE: a keeper face is not deterministic'); await b.close(); process.exit(3); }
  if (!out.crossTown.every(r => r.differ)) { console.error('REFUSING TO WRITE: a kind looks the same in both towns -- ' + JSON.stringify(out.crossTown)); await b.close(); process.exit(4); }
  if (!out.sameTownPairs.every(r => r.differ)) { console.error('REFUSING TO WRITE: two kinds in the same town collided -- ' + JSON.stringify(out.sameTownPairs.filter(r=>!r.differ))); await b.close(); process.exit(5); }
  if (out.rows.some(r => r.distinctFrames < 2)) { console.error('REFUSING TO WRITE: a keeper did not visibly speak across the line'); await b.close(); process.exit(6); }

  /* mutation-check the citizen hashes against a clean pre-change worktree */
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

  const sheetPng = await p.evaluate(async (out) => {
    const FN = 64, PZ = 2.5, pW = Math.round(FN * PZ), PAD = 16, GAP = 10, COL = pW + 90;
    const cv = document.createElement('canvas');
    cv.width = PAD * 2 + COL * out.rows.length / 2; cv.height = 150 + (pW + 36) * 2;
    const cx = cv.getContext('2d'); cx.imageSmoothingEnabled = false;
    cx.fillStyle = '#14120f'; cx.fillRect(0, 0, cv.width, cv.height);
    cx.fillStyle = '#f0e6d4'; cx.font = 'bold 22px monospace';
    cx.fillText('THE KEEPERS\' FACES', PAD, 30);
    cx.font = '13px monospace'; cx.fillStyle = '#b8ab95';
    cx.fillText('five keepers, two towns. same kind, different town, different face -- never the dim placeholder again.', PAD, 52);
    cx.fillText('each one speaks along: the mouth moves across his real price line, not a still photo.', PAD, 72);
    const load = (dataUrl) => new Promise((resolve) => { const im = new Image(); im.onload = () => resolve(im); im.src = dataUrl; });
    const half = out.rows.length / 2;
    for (let i = 0; i < out.rows.length; i++) {
      const r = out.rows[i];
      const townIdx = Math.floor(i / half), kindIdx = i % half;
      const x = PAD + kindIdx * COL, y = 96 + townIdx * (pW + 36);
      const im = await load(r.rest);
      cx.drawImage(im, 0, 0, FN, FN, x, y, pW, pW);
      cx.fillStyle = '#c7b894'; cx.font = 'bold 12px monospace';
      cx.fillText(r.kind.toUpperCase(), x, y + pW + 15);
      cx.fillStyle = '#8d7c5e'; cx.font = '10px monospace';
      cx.fillText(r.town, x, y + pW + 28);
    }
    return cv.toDataURL('image/png');
  }, out);

  fs.mkdirSync(path.dirname(SHEET), { recursive: true });
  fs.writeFileSync(SHEET, Buffer.from(sheetPng.split(',')[1], 'base64'));

  const html = `<!doctype html><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>BOHEMIA — The Keepers' Faces</title>
<!-- PORTRAIT, 10/9/26, [the keepers' faces]. -->
<style>
  :root{--ink:#e8e0cc;--bg:#0d0d12}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--ink);
       font:13px/1.55 ui-monospace,SFMono-Regular,Menlo,monospace;padding:14px}
  img{max-width:100%;image-rendering:pixelated;border-radius:6px}
  p{max-width:70ch;color:#a49a86}
  b{color:#c8bfa8;font-weight:normal}
</style>
<p>The smith, the armourer, the barber, the clinic and the board each get a real face now. Before this, every keeper's spot in the settlement screen stayed a dim placeholder head forever -- nothing ever answered its request for one.</p>
<p>Checked on real pixels: the same keeper in two different towns renders <b>two different faces</b>, every kind checked; the five keepers in one town never collide with each other either. Each face's mouth actually moves across its real price line, not a still photo.</p>
<img src="PORTRAIT_THE_KEEPERS_FACES.png" alt="the keepers' faces, five kinds, two towns">
<p>Not built this round: which file answers the settlement screen's own request and how often -- that is RUN TWO's placing, named by the row itself.</p>
`;
  fs.writeFileSync(PAGE, html);

  const summary = { when: new Date().toISOString(),
    determinism: out.determinism, crossTown: out.crossTown, sameTownPairs: out.sameTownPairs,
    rows: out.rows.map(r => ({ town: r.town, kind: r.kind, line: r.line, distinctFrames: r.distinctFrames })),
    citizenHashesChecked: out.citizenHashes.length, citizenDiffs };
  fs.writeFileSync(NUMS, JSON.stringify(summary, null, 1));
  console.log(JSON.stringify(summary, null, 1));
  console.log('sheet ' + SHEET + '   page ' + PAGE + '   page errors ' + errs.length, errs.slice(0, 3));
  await b.close();
})();
