/* BOHEMIA THE FAMILY MOVES (Paolo 8/11/26)
 *
 * "The family is looking good. I fuck with it heavy if I could see them do
 *  animations that would be awesome."
 *
 * Four ways this can be quietly wrong, and all four are asserted on the real
 * surface rather than in the source:
 *
 *   1. THEY DO NOT ACTUALLY MOVE. A cast card that repaints the same frame forever
 *      looks exactly like a cast card that animates, in a diff. Counted as DISTINCT
 *      RENDERED FRAMES over real wall-clock time, per member.
 *   2. THE PICKER IS A STUB. It nearly shipped with ONE option: `CLIPS` is a
 *      top-level const, so `window.CLIPS` is undefined and the fallback ['idle']
 *      won silently. Measured 1 option, fixed to 100+. The list must be the FULL
 *      canon one -- which animations are worth seeing the family in is a content
 *      call and it is his (MECHANISM-MINE / CONTENTS-PAOLO'S).
 *   3. THE PICKER DOES NOT REACH THE BODIES. Changing the clip must change what
 *      they draw, not just what the select says.
 *   4. A SECOND CLOCK. 120 BPM LAW: everything quantizes to the beat. The cast is
 *      driven from the render loop that already owns the phase; a private
 *      setInterval/rAF for the family would drift against the rest of the screen.
 *      Checked in the source, because "is there a second timer" is a structural
 *      question a screenshot cannot answer.
 *
 *   node gates/family_anim_gate.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

(async () => {
  const src = fs.readFileSync(ALPHA, 'utf8');

  /* ---- 4. one clock, checked structurally ---- */
  ok('the family is ticked from the render loop that already owns the beat (BEAT_MS ' +
     'x ANIMBEATS), not from a private timer — two clocks drift',
     /window\.famTick\(\(\(now-\(G\.charT0\|\|G\.t0\)\)\/\(BEAT_MS\*_fb\)\)%1\)/.test(src));
  ok('no private timer was added for the cast',
     !/setInterval\([^)]*fam/i.test(src) && !/requestAnimationFrame\([^)]*fam/i.test(src));
  /* the strips exist BECAUSE famPaintBody rebuilds the rig; if someone ever calls it
     per-frame again this is the note that says why not */
  ok('the cast animates off BAKED STRIPS (famPaintBody calls rebuildFromRig — four ' +
     'rig rebuilds per frame is not a thing that can run)', /function famStrip\(/.test(src));

  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await page.goto('file://' + ALPHA, { waitUntil: 'load', timeout: 180000 });
  await page.waitForTimeout(2500);
  await page.click('#front').catch(() => {});
  await page.waitForTimeout(1500);
  await page.click('.tab[data-p="char"]');
  await page.waitForTimeout(7000);

  const shot = () => page.evaluate(() =>
    [...document.querySelectorAll('#familyCast .famBody')].map(c => c.toDataURL()));
  const roles = await page.evaluate(() =>
    [...document.querySelectorAll('#familyCast .famBody')].map(c => c.getAttribute('data-famrole')));

  ok('all four cast bodies are on the character screen (' + roles.join(',') + ')', roles.length === 4);

  const frames = [];
  for (let i = 0; i < 8; i++) { frames.push(await shot()); await page.waitForTimeout(320); }

  /* ---- 1. they actually move ---- */
  const idleCounts = roles.map((r, i) => new Set(frames.map(f => f[i])).size);
  roles.forEach((r, i) => {
    ok(r + ' ANIMATES (' + idleCounts[i] + ' distinct rendered frames over ~2.5s) — a card ' +
       'that repaints one frame forever is indistinguishable from an animated one in a diff',
       idleCounts[i] >= 2);
  });

  /* ---- 2. the picker carries his whole canon list ---- */
  const opts = await page.evaluate(() => {
    const s = document.querySelector('.famClip');
    return s ? { n: s.options.length, hasWalk: [...s.options].some(o => o.value === 'walk') } : null;
  });
  ok('the clip picker is there', !!opts);
  ok('it carries the FULL canon CLIPS list (' + (opts ? opts.n : 0) + ' clips) — it shipped ' +
     'with ONE because `CLIPS` is a const and window.CLIPS is undefined', !!opts && opts.n > 50);
  ok('the canon clips really are in it (walk present)', !!opts && opts.hasWalk);

  /* ---- 3. the picker reaches the bodies ---- */
  await page.evaluate(() => { const s = document.querySelector('.famClip'); s.value = 'walk'; s.onchange(); });
  await page.waitForTimeout(3000);
  const walked = [];
  for (let i = 0; i < 4; i++) { walked.push(await shot()); await page.waitForTimeout(320); }
  const changed = roles.filter((r, i) => walked[0][i] !== frames[0][i]).length;
  ok('changing the clip changes WHAT THEY DRAW (' + changed + '/4 members differ from idle) — ' +
     'not just what the select says', changed >= 3);
  const walkCounts = roles.map((r, i) => new Set(walked.map(f => f[i])).size);
  ok('and they still animate in the new clip (' + walkCounts.join(',') + ' distinct frames)',
     walkCounts.every(n => n >= 2));

  console.log('FAMILY ANIM GATE: ' + pass + ' passed, ' + fail + ' failed');
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
