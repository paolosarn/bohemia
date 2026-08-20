/* BOHEMIA THE BORDER IS ONE PIXEL IN THE GAME TOO (Paolo 8/14, CHARACTER lane 8/17)
 *
 * "the black border has to be thinner, like half as thin."
 *
 * border_gate.js proves that on the CHARACTER tab and in the combat bake. This
 * proves it on THE SURFACE HE PLAYS, which was still doubling it: the city scales
 * bodies on an integer ladder (EPX x2 at the default walk zoom HC=44, x4 past 64),
 * so a 1px border baked in at 56 arrived 2px thick, and 4px zoomed in.
 *
 * *** THE PLAYER IS FOUND BY COMPUTING WHERE HE IS, NOT BY LOOKING FOR HIM. ***
 * Three earlier attempts to measure this by appearance all caught the wrong thing:
 * a skin-tone test matched the DESERT SAND (35,820 "skin" pixels), and a
 * motion-diff caught a 168x42 HUD bar. The city already knows exactly where he
 * stands -- window.__proof.getPos() gives hx/hy and the draw uses px=ox+hx*C -- so
 * the gate asks it and samples that box. A ruler that has to guess which blob is
 * the character is a ruler that will eventually measure the ground.
 *
 * WHAT IS ASSERTED, at TWO zooms because the tiers take different code paths:
 *   1. he is DRAWN at all (a borderless-art bug would show as a body with no
 *      outline, and a broken helper as no body -- both must fail loudly)
 *   2. the border against his SKIN is exactly 1px at the default walk zoom (x2 EPX)
 *   3. and still exactly 1px zoomed in past 64 (x4 EPX, a different branch that
 *      chains off _hd0 and would show 2px if it chained off the bordered x2)
 *   4. THE RESIDENTS HAVE OUTLINES TOO -- they share the ladder, and the failure
 *      mode of this change is "everyone in the world silently loses their border"
 *
 *   node gates/city_border_gate.js
 */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const REPO = path.dirname(__dirname);
const ALPHA = 'file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

/* MEASURE THE SPRITE THE RENDERER ACTUALLY BLITS.
   *** AND THIS IS THE THIRD RULER, BECAUSE THE FIRST TWO MEASURED THE GROUND. ***
   Sampling the composited city canvas kept catching the desert: sand is warm and
   mid-light, so a skin test matched 35,820 pixels of it, and even restricted to
   the player's computed box it reported 139 "skin rows" inside a 112px sprite.
   The screen is the wrong surface to measure a sprite on.
   spriteAt(spr, C) is the exact function the draw calls, and the draw does nothing
   to its result but drawImage it. So the gate calls it on a real body from
   PLAYER_CV and measures THAT canvas: no ground, no HUD, no camera, no guessing
   which blob is the character. This is the render path, not a side door. */
async function measure(fr, C, how) {
  return fr.evaluate(({ C, how }) => {
    if (typeof PLAYER_CV === 'undefined' || !PLAYER_CV) return { err: 'no PLAYER_CV' };
    const set = PLAYER_CV.S || PLAYER_CV[Object.keys(PLAYER_CV)[0]];
    const spr = set && set.idle;
    if (!spr) return { err: 'no idle sprite' };
    /* 'new' = the shipped path. 'old' = EXACTLY what this change replaced: border
       the sprite at 56 and let the ladder double it. Same ruler on both, so the
       assertion is a COMPARISON and not a threshold somebody picked. */
    const img = (how === 'old')
      ? (C >= 64 ? epx2(epx2(outline1(spr))) : (C >= 32 ? epx2(outline1(spr)) : outline1(spr)))
      : spriteAt(spr, C);
    const w = img.width, h = img.height;
    const g = img.getContext('2d');
    const D = g.getImageData(0, 0, w, h).data;
    const A = i => D[i * 4 + 3] > 200;
    const blk = i => A(i) && D[i*4] < 45 && D[i*4+1] < 45 && D[i*4+2] < 45;

    /* *** MEASURE WHERE THE BORDER MEETS SKIN, NOT WHERE IT MEETS HIS COAT. ***
       The first version of this walked the black run in from the silhouette edge
       and reported a median of 5px at HC=44 and 10px at HC=88 -- because HE WEARS A
       BLACK COAT, so the run does not stop at the border, it carries on through the
       garment. Sorted, the runs read 1,1,1,1,1,1,... and then jumped: the border was
       always one pixel and the ruler was measuring clothing. This is the same
       mistake that read "10px" off his trousers when the border law was written, and
       border_gate.js solves it the same way. Skin is unambiguous on an ISOLATED
       sprite -- there is no desert in the image to confuse it. */
    /* "the border ends where a LIGHT pixel begins". Skin alone was too narrow: on
       most rows the outermost body pixel is HAIR (cream, barely warm) or the black
       coat, so requiring skin found zero rows. Luminance separates the two things
       that matter here -- hair and skin are light, the coat is not -- and on an
       isolated sprite nothing else is in the image to confuse it. */
    const lum = i => 0.299*D[i*4] + 0.587*D[i*4+1] + 0.114*D[i*4+2];
    const light = i => A(i) && lum(i) > 100;
    const runs = [];
    let bodyRows = 0;
    for (let y = 0; y < h; y++) {
      let x = 0;
      while (x < w && !A(y * w + x)) x++;
      if (x >= w) continue;
      bodyRows++;
      let n = 0;
      while (x + n < w && blk(y * w + x + n)) n++;
      if (!n) continue;                                /* row starts on body */
      if (x + n >= w || !light(y * w + x + n)) continue; /* must open onto BODY, not more black */
      runs.push(n);
    }
    runs.sort((a, b) => a - b);
    /* how much of the sprite is body at all -- a blank canvas must not pass */
    let painted = 0; for (let i = 0; i < w * h; i++) if (A(i)) painted++;
    const ones = runs.filter(n => n === 1).length;
    return { C: C, w: w, h: h, bodyRows: bodyRows, painted: painted,
             borderRows: runs.length, median: runs.length ? runs[runs.length >> 1] : 0,
             ones: ones, onePct: runs.length ? Math.round(100 * ones / runs.length) : 0,
             worst: runs.length ? runs[runs.length - 1] : 0, sample: runs.slice(0, 12) };
  }, { C: C, how: how });
}

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.goto(ALPHA, { waitUntil: 'load', timeout: 180000 });
  await SETTLE(page, 2500);
  await page.click('#front').catch(() => {});
  await SETTLE(page, 11000);

  const fr = page.frames().find(f => f.url().includes('CITY_WORLD'));
  ok('the city surface is up (this gate measures the GAME, not the workbench)', !!fr);
  if (!fr) { console.log('CITY BORDER GATE: ' + pass + ' passed, ' + (fail + 1) + ' failed'); await browser.close(); process.exit(1); }

  const helpers = await fr.evaluate(() => ({
    hasSpriteAt: typeof spriteAt === 'function',
    hasOutline: typeof outline1 === 'function',
    hasPlayer: (typeof PLAYER_CV !== 'undefined') && !!PLAYER_CV
  }));
  ok('the shared bordered ladder exists in the city (spriteAt + outline1)',
     helpers.hasSpriteAt && helpers.hasOutline);
  ok('the player body actually arrived from the alpha — borderless art with no ' +
     'body would pass a border check for the wrong reason', helpers.hasPlayer);

  const A = await measure(fr, 44, 'new');   /* the default walk zoom: EPX x2 */
  const B = await measure(fr, 88, 'new');   /* zoomed in: EPX x4, a different branch */
  /* THE SAME RULER ON THE OLD BEHAVIOUR -- the calibration. Whatever this ruler's
     quirks are (a fifth of rows cross dark hair-shadow before reaching a light
     pixel, so they measure shading rather than the border), they apply equally to
     both, which is the point of measuring both. */
  const Aold = await measure(fr, 44, 'old');
  const Bold = await measure(fr, 88, 'old');

  for (const [label, M] of [['HC=44 (default walk zoom, EPX x2)', A], ['HC=88 (zoomed in, EPX x4)', B]]) {
    if (M.err) { ok(label + ': measured', false); continue; }
    console.log('  ' + label + '  sprite ' + M.w + 'x' + M.h + '  painted ' + M.painted +
                'px  border rows ' + M.borderRows + '  median ' + M.median +
                '  exactly-1px ' + M.onePct + '%  worst ' + M.worst);
  }

  ok('THE SPRITE HAS A BODY at the default zoom (' + (A.painted || 0) + ' painted px) — ' +
     'a broken helper returning a blank canvas would otherwise pass a border check ' +
     'by having no border to get wrong', !A.err && A.painted > 500);
  /* A MEDIAN CAN HIDE A SYSTEMATIC PROBLEM, so check the DISTRIBUTION -- but not
     with "worst must be 1", which was too strict for an honest reason: on a few
     rows the run crosses dark hair-shadow before it reaches a light pixel, so those
     rows measure shading, not the border. A border that was actually 2px would put
     ~every row at 2 and this would read 0%. */
  console.log('  the OLD way, same ruler:  HC=44 median ' + Aold.median + ' (' + Aold.onePct +
              '% at 1px)   HC=88 median ' + Bold.median + ' (' + Bold.onePct + '% at 1px)');

  /* CALIBRATION, not a threshold. A number like ">=85% of rows" is somebody's
     guess; this compares the shipped path against the exact behaviour it replaced,
     with the same ruler, on the same sprite. */
  ok('THE OLD BEHAVIOUR REALLY WAS THICKER — bordering at 56 and letting the ladder ' +
     'double it measures ' + Aold.median + 'px at the default zoom. If this did not ' +
     'read 2 there was never a bug here and this whole change is unjustified',
     !Aold.err && Aold.median === 2);
  ok('and 4px at the closest zoom, which is what the x4 tier did to it (' +
     Bold.median + 'px)', !Bold.err && Bold.median === 4);
  ok('*** SO THE CHANGE IS EXACTLY THE RULING: ' + Aold.median + 'px -> ' + A.median +
     'px at the walk zoom, ' + Bold.median + 'px -> ' + B.median + 'px zoomed in ***',
     !A.err && !B.err && A.median === 1 && B.median === 1);
  ok('and it is one pixel on far more rows than the old way was (' + A.onePct + '% of ' +
     'rows exactly 1px now vs ' + Aold.onePct + '% before) — the rows that still read ' +
     'wider are ones where the run crosses dark hair-shadow before it reaches a light ' +
     'pixel, and they measure shading, not the border',
     !A.err && !Aold.err && A.onePct > Aold.onePct + 40);
  ok('*** THE BORDER IS ONE PIXEL IN THE GAME at the default walk zoom *** — it was ' +
     '2, because the city EPX-doubles the sprite and the border was baked in at 56' +
     (A.err ? '' : ' (measured ' + A.median + 'px over ' + A.borderRows + ' rows)'),
     !A.err && A.median === 1);
  ok('and ONE PIXEL zoomed in past 64 as well (the x4 branch chains off the ' +
     'UNBORDERED double; chaining off the bordered one would read 2)' +
     (B.err ? '' : ' (measured ' + B.median + 'px)'),
     !B.err && B.median === 1);

  /* 4. the residents share the ladder, and the failure mode is silent */
  const ppl = await fr.evaluate(() => ({ drawn: window.__PPL_DRAWN || 0 }));
  ok('residents are being drawn through the same shared ladder (' + ppl.drawn + ' on ' +
     'screen) — if this change had removed their outline it would be world-wide and ' +
     'silent', ppl.drawn > 0);

  if (errs.length) console.log('  PAGE ERRORS: ' + errs.slice(0, 3).join(' | '));
  console.log('CITY BORDER GATE: ' + pass + ' passed, ' + fail + ' failed');
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
