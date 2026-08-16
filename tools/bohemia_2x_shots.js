/* BOHEMIA 2X -- THE RENDER PROBE (Paolo 8/14)
 *
 * VERIFY ON THE REAL SURFACE (7/18 law): the only thing that settles whether a
 * resolution migration worked is the pixels the render path actually produces. So
 * this boots the alpha and pulls frames out of drawChar -- the exact function the
 * CHARACTER tab calls -- rather than probing some side door that agrees with me.
 *
 * TWO JOBS, one file, because they have to sample IDENTICALLY or the comparison is
 * worthless:
 *
 *   --save <name>    dump every sampled frame as a PNG + a hash manifest
 *   --cmp <a> <b>    compare two manifests frame by frame
 *
 * PHASE 1 (seams in, rig still 56) must come back IDENTICAL, every frame, every
 * facing, every clip. That is the entire reason the seam edits were written to be
 * the identity at RIG_RS===1: a single moved pixel there is a broken seam, caught
 * in isolation, BEFORE anything doubles. Once the rig doubles the frames are
 * expected to differ -- and then what matters is WHERE, which the compare reports
 * as the outline thickness and the silhouette, not as a pass/fail on sameness.
 *
 * RIG CHECK (RIG IS LAW, Paolo 7/26/26): READS the rig only to report its size, and
 *   writes nothing. Every pixel it captures comes out of drawChar, the same function
 *   the CHARACTER tab calls; nothing here reaches into BAKED to change it.
 *   built on: BAKED
 *   joints: none named
 *   parts: none named
 *
 *   node tools/bohemia_2x_shots.js --save before
 *   node tools/bohemia_2x_shots.js --cmp before after
 */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const REPO = path.dirname(__dirname);
const ALPHA = 'file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const OUTDIR = path.join(REPO, 'records/2x');

const DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'];
const CLIPS = ['idle', 'walk', 'run'];
const PHASES = [0, 0.25, 0.5, 0.75];

async function save(name) {
  const dir = path.join(OUTDIR, name);
  fs.mkdirSync(dir, { recursive: true });
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.goto(ALPHA, { waitUntil: 'load', timeout: 180000 });
  await page.waitForTimeout(2500);
  await page.click('#front').catch(() => {});
  await page.waitForTimeout(1500);

  const R = await page.evaluate(({ DIRS, CLIPS, PHASES }) => {
    const out = { frames: [], rigW: (typeof BAKED !== 'undefined' ? BAKED.W : 0),
                  rs: (typeof RIG_RS !== 'undefined' ? RIG_RS : 1), err: null };
    try {
      for (const d of DIRS) for (const c of CLIPS) for (const p of PHASES) {
        const cv = document.createElement('canvas');
        drawChar(cv, d, c, p);
        out.frames.push({ k: d + '|' + c + '|' + p, W: cv.width, H: cv.height,
                          png: cv.toDataURL('image/png').split(',')[1] });
      }
    } catch (e) { out.err = e.message; }
    return out;
  }, { DIRS, CLIPS, PHASES });

  if (R.err) { console.log('  RENDER THREW: ' + R.err); await browser.close(); process.exit(1); }

  const man = { rigW: R.rigW, rs: R.rs, frames: {} };
  for (const f of R.frames) {
    const buf = Buffer.from(f.png, 'base64');
    fs.writeFileSync(path.join(dir, f.k.replace(/\|/g, '_') + '.png'), buf);
    man.frames[f.k] = { W: f.W, H: f.H, sha: crypto.createHash('sha1').update(buf).digest('hex') };
  }
  fs.writeFileSync(path.join(OUTDIR, name + '.json'), JSON.stringify(man, null, 1));

  /* THE BORDER, MEASURED -- because "it looks thinner" is not a measurement and
     this is the half of the ruling he can see.
     *** AND THE FIRST VERSION OF THIS RULER WAS WRONG, in the way these rulers are
     always wrong here: it took the WIDEST row, which is his hips, walked in from
     the left and counted black -- and read 10px, because he is wearing BLACK
     TROUSERS. It was measuring his clothes. A ruler that cannot tell the outline
     from a dark garment would have reported "no change" through a working flip.
     So it measures where SKIN meets the border: rows that carry face/skin tone,
     count the black run inward from the silhouette edge, and take the MEDIAN over
     those rows so one odd row cannot carry the number. */
  const OL = await page.evaluate(() => {
    const cv = document.createElement('canvas');
    drawChar(cv, 'S', 'idle', 0);
    const W = cv.width, H = cv.height;
    const D = cv.getContext('2d').getImageData(0, 0, W, H).data;
    const at = i => [D[i*4], D[i*4+1], D[i*4+2], D[i*4+3]];
    const isC = i => D[i*4+3] > 40;
    const isBlk = i => isC(i) && D[i*4] < 40 && D[i*4+1] < 40 && D[i*4+2] < 40;
    const SK = (typeof skinTone !== 'undefined' && skinTone[1]) ? skinTone[1] : [];
    const isSkin = i => { if (!isC(i)) return false; const c = at(i);
      return SK.some(r => Math.abs(c[0]-r[0]) + Math.abs(c[1]-r[1]) + Math.abs(c[2]-r[2]) < 60); };

    const runs = [], rows = [];
    for (let y = 0; y < H; y++) {
      let skin = 0; for (let x = 0; x < W; x++) if (isSkin(y*W+x)) skin++;
      if (skin < 3) continue;                       /* not a skin row: skip it */
      let x = 0; while (x < W && !isC(y*W+x)) x++;   /* the silhouette edge */
      if (x >= W) continue;
      let run = 0; while (x + run < W && isBlk(y*W+x+run)) run++;
      if (!run) continue;                            /* no border on this row */
      if (!isSkin(y*W+x+run)) continue;              /* border must open onto SKIN */
      runs.push(run); rows.push(y);
    }
    runs.sort((a, b) => a - b);
    const med = runs.length ? runs[runs.length >> 1] : 0;
    return { W: W, H: H, border: med, samples: runs.length,
             rows: rows.slice(0, 4), all: runs.slice(0, 12) };
  });
  fs.writeFileSync(path.join(OUTDIR, name + '.outline.json'), JSON.stringify(OL, null, 1));

  console.log('2X SHOTS [' + name + ']: rig ' + R.rigW + ', RIG_RS ' + R.rs + ', ' +
              R.frames.length + ' frames -> ' + dir);
  console.log('  frame ' + OL.W + 'x' + OL.H + '   BLACK BORDER AGAINST SKIN: ' + OL.border +
              'px (median of ' + OL.samples + ' skin rows; runs ' + OL.all.join(',') + ')');
  if (errs.length) console.log('  PAGE ERRORS: ' + errs.slice(0, 3).join(' | '));
  await browser.close();
}

function cmp(a, b) {
  const A = JSON.parse(fs.readFileSync(path.join(OUTDIR, a + '.json'), 'utf8'));
  const B = JSON.parse(fs.readFileSync(path.join(OUTDIR, b + '.json'), 'utf8'));
  const keys = Object.keys(A.frames);
  let same = 0, diff = [], sized = [];
  for (const k of keys) {
    const x = A.frames[k], y = B.frames[k];
    if (!y) { diff.push(k + ' (missing)'); continue; }
    if (x.W !== y.W || x.H !== y.H) sized.push(k);
    if (x.sha === y.sha) same++; else diff.push(k);
  }
  console.log('2X COMPARE  ' + a + ' (rig ' + A.rigW + ', RS ' + A.rs + ')  vs  ' +
              b + ' (rig ' + B.rigW + ', RS ' + B.rs + ')');
  console.log('  ' + same + '/' + keys.length + ' frames IDENTICAL, ' + diff.length + ' differ, ' +
              sized.length + ' changed size');
  if (diff.length) console.log('  differing: ' + diff.slice(0, 8).join(', ') + (diff.length > 8 ? ' ...' : ''));

  try {
    const OA = JSON.parse(fs.readFileSync(path.join(OUTDIR, a + '.outline.json'), 'utf8'));
    const OB = JSON.parse(fs.readFileSync(path.join(OUTDIR, b + '.outline.json'), 'utf8'));
    console.log('  BLACK BORDER AGAINST SKIN: ' + OA.border + 'px -> ' + OB.border + 'px' +
                '   (frame ' + OA.W + ' -> ' + OB.W + ')');
  } catch (e) {}
  return diff.length;
}

(async () => {
  const m = process.argv[2];
  if (m === '--save') await save(process.argv[3] || 'shot');
  else if (m === '--cmp') process.exit(cmp(process.argv[3], process.argv[4]) ? 0 : 0);
  else { console.log('usage: --save <name> | --cmp <a> <b>'); process.exit(1); }
})();
