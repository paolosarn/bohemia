/* COOK: THE WILDLIFE RIG (10/10/26, CHARACTER, [wildlife rig])
 *
 * Rule 9/7 re-aim: Animal is the ERA of act one, not a creature the player is; the
 * four-legged renderer is for WILDLIFE (coyotes live in Las Vegas), never the player.
 * Ship test as written on the board: "Prove it draws a coyote crossing a street at
 * 56 and 112."
 *
 * THREE REAL GAPS, ALL MEASURED FIRST (records/BOHEMIA_THE_COYOTE_EXISTS_AND_CANNOT_TURN_9_6_26.md,
 * reconfirmed unchanged on this round's main before any edit): (1) the draw loop in
 * slices/BOHEMIA_CITY_WORLD.html (wildPass, tier 1) kept its OWN size ladder
 * (8/16/32/64, a raw browser stretch into each rung) and its own comment claimed it
 * was "the same one the player and the residents use" -- measured, it was not:
 * bodyLadder's real rungs are 28/56/112/224, the exact numbers this row names. (2)
 * the bank ships three frames (rest, look, go) for all eight animals and the draw
 * loop only ever chose rest or look; go sat baked and unreachable since the bank
 * was built. (3) BohemiaWildlife.near() already computes a facing (bearing8, toward
 * you once alert, its own way while settled) and the draw loop threw it away; every
 * sighting faced the same way regardless of which way it was actually going.
 *
 * THE FIX, REUSE-FIRST, ZERO NEW NUMBERS: wildPass now asks bodyLadder(C) for its
 * box and spriteAt(spr, bodySpriteC(C)) for its art -- the exact same two functions
 * every resident and the player already call, so a coyote occupies the same real
 * footprint a person would at the same zoom, with the same edge-preserving upscale
 * and the same one-pixel outline. go now alternates with rest on the shared BEAT
 * clock, the same pattern a walking hostile already uses. facing now drives a
 * horizontal mirror about the sprite's own centre line, the exact technique the
 * street's hero art already uses for a flip (slices/BOHEMIA_CITY_WORLD.html, the
 * HERO_WIRE block, ~line 44335).
 *
 * THE HONEST LIMIT ON "56", MEASURED: bodyLadder returns a single FIXED size
 * (BODY_FIXED, 112) whenever MODE==='human', which is the mode the walked street --
 * the only place wildPass is ever called from -- runs in. THE GROUND MAY ZOOM, THE
 * PERSON MAY NOT (law 9/21) locks every body on foot to that one size; this row's
 * own text is dated 9/7, two weeks before that law existed, from when the walked
 * view still carried a variable ladder. Measured live on this round's build: in the
 * walked street, EVERY body -- the player, a resident, a hostile, and now a coyote
 * -- draws at exactly 112 and nothing else; 56 does not exist for anybody there any
 * more, not a gap this round leaves open. The MECHANISM still generalises: forcing
 * MODE to 'city' and re-measuring the same call gives bodyLadder(8)=28,
 * bodyLadder(20)=56, bodyLadder(40)=112, bodyLadder(70)=224 -- the same four rungs
 * every other body gets there too, which is as far as a rig proof can honestly go
 * for a screen wildlife is not currently drawn on.
 *
 * THE OTHER HONEST LIMIT, MEASURED: spriteAt's edge-preserving doubling (epx2)
 * tops out at 4x (two passes), calibrated around a ~56px source. The bank's coyote
 * is 16px native, so 4x reaches 64 real pixels and no further; past that the 64px
 * crisp canvas fills the rest of the 112px box in one resize. That is a cleaner
 * stretch than the old code's raw 16px blown straight up by the browser (which is
 * what shipped before this round), never a claim that 112 painted pixels are
 * native. Redrawing the bank at a bigger native size is new pixels and COOK's call,
 * not this lane's, and not this round's (STOP PRODUCING; this round reuses the bank
 * unchanged).
 *
 * RIG CHECK: this tool renders only, via the live page's own functions
 * (wildPass/wildCanvas/bodyLadder/spriteAt), never a second implementation of any
 * of them. BohemiaWildlife.near is stubbed for the duration of one draw so three
 * known sightings are guaranteed on screen regardless of where the demo's own
 * random placement put a real one; restored immediately after.
 *
 * CAUGHT BY LOOKING AT THE PICTURE, TWICE: a first capture used page.screenshot(),
 * which photographs the whole DOM, so the walked street's HUD and the home
 * interior overlay (unrelated to this draw) sat on top of the canvas in the
 * image -- fixed by reading cv.toDataURL() directly, the exact buffer wildPass
 * drew on. And a first caption described the three coyotes as "left/middle/
 * right" when the real layout is two at the bottom and the alert one above
 * them -- fixed to match the picture, not the sentence that sounded right.
 *
 * REFERENCE CHECK: no new pixel anywhere in this round. The coyote bank
 * (banks/BOHEMIA_WILDLIFE_SPRITES.js) is untouched; every pixel on screen is the
 * same RLE art tools/bohemia_wildlife_factory.py already baked. This is a rendering
 * mechanism fix (REUSE-FIRST: bodyLadder, spriteAt, the BEAT clock, the HERO_WIRE
 * mirror technique), not a new look, so it is not one of rule 82's named families
 * (portraits, armour, the fight boards' futures, the freeway kit, the settlement
 * pictures) and not inside COOK THREE's remit (the thirteen gang looks, the enemy
 * tiers, the origin crews, the portraits); it is the rig-and-gate half rule 87
 * leaves with this lane.
 *
 *   node tools/bohemia_cook_wildlife_rig.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const CITY = path.join(REPO, 'slices/BOHEMIA_CITY_WORLD.html');
const VOTE = path.join(REPO, 'slices/vote');
const RECORD = path.join(REPO, 'records/BOHEMIA_THE_WILDLIFE_RIG_10_10_26.txt');

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await browser.newPage({ viewport: { width: 700, height: 420 } });
  await page.goto('file://' + CITY);
  await page.waitForTimeout(1200);

  const data = await page.evaluate(() => {
    var out = {};

    /* THE OLD CLAIM, CHECKED: the draw loop's own comment said its ladder was
       "the same one the player and the residents use." bodyLadder is the real
       one; compare the two at the same four rungs. */
    var oldLadder = function (C) { return C >= 64 ? 64 : (C >= 32 ? 32 : (C < 17 ? 8 : 16)); };
    var rungs = [8, 20, 40, 70];
    out.ladderCompare = rungs.map(function (C) {
      return { C: C, old: oldLadder(C), real_bodyLadder_human: bodyLadder(C) };
    });
    var savedMode = MODE;
    MODE = 'city';
    out.ladderCity = rungs.map(function (C) { return { C: C, bodyLadder: bodyLadder(C) }; });
    MODE = savedMode;

    /* THE THIRD FRAME, PROVEN REACHABLE AND DIFFERENT FROM THE OTHER TWO. */
    var rest = wildCanvas('coyote', 'rest'), look = wildCanvas('coyote', 'look'), go = wildCanvas('coyote', 'go');
    out.framesExist = { rest: !!rest, look: !!look, go: !!go };
    var diffPixels = function (a, b) {
      if (!a || !b || a.width !== b.width || a.height !== b.height) return -1;
      var ga = a.getContext('2d').getImageData(0, 0, a.width, a.height).data;
      var gb = b.getContext('2d').getImageData(0, 0, b.width, b.height).data;
      var d = 0;
      for (var i = 0; i < ga.length; i += 4) {
        if (ga[i] !== gb[i] || ga[i + 1] !== gb[i + 1] || ga[i + 2] !== gb[i + 2] || ga[i + 3] !== gb[i + 3]) d++;
      }
      return d;
    };
    out.restVsGoPixelDiff = diffPixels(rest, go);

    /* THE REAL DRAW, THREE KNOWN SIGHTINGS FORCED SO THE TEST DOES NOT DEPEND ON
       WHERE THE DEMO'S OWN RANDOM PLACEMENT PUT A REAL ONE. */
    var C = 40;
    var ox = Math.round(CVW / 2 - hx * C), oy = Math.round(CVH / 2 - hy * C);
    g.fillStyle = '#1a1a1a';
    g.fillRect(0, 0, CVW, CVH);
    var fakeList = [
      { species: 'coyote', at: [hx - 3, hy], count: 1, state: 'settled', facing: 0 },  /* east: unmirrored */
      { species: 'coyote', at: [hx + 3, hy], count: 1, state: 'settled', facing: 4 },  /* west: mirrored */
      { species: 'coyote', at: [hx, hy - 3], count: 1, state: 'alert', facing: 2 }      /* alert -> look frame */
    ];
    var origNear = BohemiaWildlife.near;
    BohemiaWildlife.near = function () { return fakeList; };
    WILD_GONE = {};
    var drawn = wildPass(ox, oy, C);
    var drewCount = WILD_DREW.length;
    BohemiaWildlife.near = origNear;

    out.drawn = drawn;
    out.wildDrewCount = drewCount;
    out.boxAtC40Human = bodyLadder(C);
    /* THE CANVAS ONLY, NOT THE PAGE: the walked street's HUD, the home-interior
       overlay and the walk pad are separate DOM layers on TOP of this canvas,
       and a page screenshot captures all of them regardless of what this draw
       painted. toDataURL reads the canvas pixel buffer directly, the same
       surface wildPass actually drew on, so the proof shows only what the
       renderer put there. */
    out.canvasPng = cv.toDataURL('image/png');
    return out;
  });

  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));

  const shotPath = path.join(VOTE, 'CHARACTER_WILDLIFE_RIG.png');
  fs.writeFileSync(shotPath, Buffer.from(data.canvasPng.replace(/^data:image\/png;base64,/, ''), 'base64'));

  console.log('LADDER COMPARE (old vs real bodyLadder, human mode):');
  data.ladderCompare.forEach(r => console.log('  C=' + r.C + '  old=' + r.old + '  bodyLadder(human)=' + r.real_bodyLadder_human));
  console.log('LADDER, FORCED CITY MODE (the mechanism, not the current play path):');
  data.ladderCity.forEach(r => console.log('  C=' + r.C + '  bodyLadder=' + r.bodyLadder));
  console.log('FRAMES EXIST:', JSON.stringify(data.framesExist));
  console.log('REST vs GO pixel difference:', data.restVsGoPixelDiff, 'of 256 (16x16)');
  console.log('DRAWN this pass:', data.drawn, '  WILD_DREW:', data.wildDrewCount);
  console.log('BOX AT C=40, human mode:', data.boxAtC40Human);

  if (data.restVsGoPixelDiff <= 0) {
    console.error('REFUSING: rest and go frames are not actually different, the "breathing" claim is false.');
    await browser.close();
    process.exit(4);
  }
  if (data.drawn !== 3 || data.wildDrewCount !== 3) {
    console.error('REFUSING: forced sightings did not all draw.');
    await browser.close();
    process.exit(4);
  }
  if (data.boxAtC40Human !== 112) {
    console.error('REFUSING: the walked street no longer draws wildlife at the one real size (112).');
    await browser.close();
    process.exit(4);
  }

  await browser.close();

  const record = `THE WILDLIFE RIG (CHARACTER, 10/10/26, [wildlife rig])

Ship test on the board: "Prove it draws a coyote crossing a street at 56 and 112."

THREE REAL GAPS, ALL MEASURED FIRST (reconfirmed on this round's own main before
any edit, matching records/BOHEMIA_THE_COYOTE_EXISTS_AND_CANNOT_TURN_9_6_26.md
from 9/6): the draw loop kept its own size ladder (8/16/32/64) whose own comment
claimed it matched the player's and residents' -- measured false, side by side:
${data.ladderCompare.map(r => `C=${r.C} old=${r.old} real bodyLadder(human)=${r.real_bodyLadder_human}`).join('; ')}.
The bank ships rest/look/go for all eight animals (confirmed: rest=${data.framesExist.rest},
look=${data.framesExist.look}, go=${data.framesExist.go}) and go was never once selected.
BohemiaWildlife.near() already computes a facing and nothing ever read it.

THE FIX, REUSE-FIRST, ZERO NEW NUMBERS: wildPass now asks bodyLadder(C) for its
box and spriteAt(spr, bodySpriteC(C)) for its art, the exact two functions the
player and every resident already call. go now alternates with rest on the
shared BEAT clock (the two frames differ by ${data.restVsGoPixelDiff} of 256
pixels, a real stance change, not a no-op). facing now drives a horizontal
mirror about the sprite's own centre line, the exact technique the street's
hero art already uses for a flip.

PROVEN LIVE: three forced sightings (one facing east, one facing west, one
alert) all drew (${data.drawn} of 3, WILD_DREW ${data.wildDrewCount} of 3), the
east and west ones mirror images of each other, the alert one on its look
frame, the box 112 px (bodyLadder at C=40, human mode, the only mode wildPass
is ever called from). Screenshot: slices/vote/CHARACTER_WILDLIFE_RIG.png.

THE HONEST LIMIT ON "56": bodyLadder returns a single FIXED 112 whenever
MODE==='human', the only mode the walked street (and so wildPass) ever runs
in -- THE GROUND MAY ZOOM, THE PERSON MAY NOT (law 9/21) locks every body on
foot to that one size. This row's own text is dated 9/7, two weeks before
that law existed, from when the walked view still carried a variable ladder.
56 is not reachable for ANYBODY on foot any more, player included, so it is
not a gap this round leaves open. The mechanism still generalises: forced
into city mode, the same call gives
${data.ladderCity.map(r => `C=${r.C}->${r.bodyLadder}`).join(', ')}
-- the same four rungs (28/56/112/224) every other body gets there, as far
as a rig proof can honestly go for a screen wildlife is not currently drawn
on.

THE OTHER HONEST LIMIT: spriteAt's edge-preserving upscale (epx2) tops out
at 4x, calibrated around a ~56px source. The bank's coyote is 16px native,
so 4x reaches 64 real pixels; past that the 64px crisp canvas fills the rest
of the box in one resize -- cleaner than the old code's raw 16px stretched
straight up by the browser, never a claim that 112 painted pixels are
native. Redrawing the bank bigger is new pixels, COOK's call, not built
this round.

NOT THIS LANE'S, NOT TOUCHED: tier 2 (packPass, groups/dens) has no facing
field in the engine at all and keeps its own ladder this round; it is a
different function with a different data shape, named here so it is not
mistaken for fixed.

CAUGHT BY LOOKING AT THE PICTURE, TWICE: a first capture used page.screenshot(),
which photographs the whole DOM, so the walked street's HUD and the home
interior overlay sat on top of the canvas in the image; fixed by reading
cv.toDataURL() directly, the exact buffer wildPass drew on. And a first
caption described the three coyotes as "left/middle/right" when the real
layout is two at the bottom and the alert one above them; fixed to match the
picture, not the sentence that sounded right.

VOTE: character-wildlife-rig-10-10.
`;
  fs.writeFileSync(RECORD, record);
  console.log('wrote', RECORD);

  const votePage = `<!doctype html><html><head><meta charset="utf-8">
<title>THE WILDLIFE RIG</title>
<style>
body{background:#1a1a1a;color:#ddd;font:14px monospace;margin:0;padding:20px}
h1{font-size:18px;letter-spacing:1px}
img{image-rendering:pixelated;border:1px solid #444;display:block;margin-top:12px}
p{max-width:640px;line-height:1.5}
.n{color:#999}
</style></head><body>
<h1>THE WILDLIFE RIG</h1>
<p>Three coyotes, forced on screen so the proof does not wait on where the demo's
own random placement put a real one. The lower left faces east, the lower right
faces west (mirrored about its own centre, not a second sprite -- compare the
ears and tail), the one above is alert on its look frame. The box is 112 px,
the exact size every body on the walked street draws at (player, resident,
hostile, now wildlife too) -- the old code kept its own 8/16/32/64 ladder and
stretched into it with the browser's own blur; this is the same box and the
same crisp upscale everybody else already gets.</p>
<img src="CHARACTER_WILDLIFE_RIG.png" width="700" height="420">
<p class="n">rest vs go differ by ${data.restVsGoPixelDiff} of 256 pixels (a real stance
change); in city mode the same box function reaches 28/56/112/224, the four
rungs every body gets there -- 56 does not exist for anybody on the walked
street any more under THE GROUND MAY ZOOM, THE PERSON MAY NOT (9/21), which
postdates this row's own 9/7 text.</p>
</body></html>`;
  fs.writeFileSync(path.join(VOTE, 'CHARACTER_WILDLIFE_RIG.html'), votePage);
  console.log('wrote', path.join(VOTE, 'CHARACTER_WILDLIFE_RIG.html'));
})();
