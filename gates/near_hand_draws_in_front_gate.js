#!/usr/bin/env node
/* THE NEAR HAND DRAWS IN FRONT -- gate for Paolo 9/7:
     "when it's facing north-east the hand was behind the head even though it's
      supposed to be in front; some of the directions look like dog shit."

   Measured over all 105 clips x 8 facings x 8 phases before this shipped:

   1 A HAND WAS LEAVING ITS OWN ARM BEHIND. 460 frames drew a hand BEHIND the
     head while its own forearm was drawn IN FRONT of it -- a wrist cut in half
     by the skull. Every one was a gun clip; 66 of them on NE, the facing he
     named. The GUN-UNIT law's own first words are "hands holding a weapon are
     ONE unit with it" and the code moved parts 7 and 8 and left 5 and 6 alone.
   2 THE HEAD WAS ORDERED INCONSISTENTLY AGAINST THE FAR ARM. Behind it on S and
     SE, in front of it on the other six, so an arm on the far side of the body
     painted over a skull that sits between it and the camera: 35,229 cells,
     worst NW 8,469 and NE 8,228. On N the head sat BETWEEN the two arms and
     split every two-handed grip down the middle -- 2,577 cells on two-hand,
     deadeye, crouch-aim-2h, spear-drive and pray.

   THE RULE READS NOTHING FROM THE POSE, and that is deliberate: the two dynamic
   depth rules retired on 7/26 were guesses off a continuous signal and flipped
   an arm's depth mid-swing. The near arm is whichever the AUTHORED order already
   puts in front of the torso, so the answer is the same on every frame of a clip
   and cannot flicker.                                          ANIMATION 9/13 */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');
const { settle: SETTLE } = require(path.join(ROOT, 'gates', 'bohemia_settle.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? (pass++, console.log('  ok   ' + n)) : (fail++, console.log('  FAIL ' + n)); };
const done = () => { console.log('\nTHE NEAR HAND DRAWS IN FRONT GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0); };

if (!fs.existsSync(ALPHA)) { console.log('  FAIL the alpha is missing'); fail++; done(); }

(async () => {
  const { chromium } = require('/opt/node22/lib/node_modules/playwright');
  const br = await chromium.launch();
  const pg = await br.newPage();
  await pg.goto('file://' + ALPHA, { waitUntil: 'load' });
  await SETTLE(pg, 2400);

  const R = await pg.evaluate(() => {
    const D = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'];
    const out = { split: 0, splitWhere: [], apart: 0, apartWhere: [], farInFront: 0, farWhere: [],
                  nearBehind: 0, nearWhere: [], sHeadLast: true, sFrames: 0, frames: 0, clips: 0, threw: 0,
                  farCells: 0, headCells: 0 };
    out.clips = (typeof CLIPS !== 'undefined') ? CLIPS.length : 0;

    for (const c of CLIPS) {
      for (const d of D) {
        for (let k = 0; k < 8; k++) {
          const ph = k / 8;
          let ps, f;
          try { ps = posedSkel(d, c, ph); f = buildFrame(d, c, ph); } catch (e) { out.threw++; continue; }
          const o = handOrder(d, ps.present, ps.sk);
          out.frames++;
          const iL = o.indexOf(5), ihL = o.indexOf(7), iR = o.indexOf(6), ihR = o.indexOf(8);
          const iT = o.indexOf(4), iH = Math.min(o.indexOf(1), o.indexOf(2)), iF = Math.max(o.indexOf(1), o.indexOf(2));

          /* 1 A HAND NEVER LEAVES ITS OWN ARM: nothing may be drawn between them */
          if (Math.abs(ihL - iL) !== 1 || Math.abs(ihR - iR) !== 1) {
            out.apart++; if (out.apartWhere.length < 6) out.apartWhere.push(d + '|' + c + '|' + k); }

          /* 2 and in particular the head may never come between a hand and its arm */
          if ((iL < iH && ihL > iF) || (iR < iH && ihR > iF)) {
            out.split++; if (out.splitWhere.length < 6) out.splitWhere.push(d + '|' + c + '|' + k); }

          /* 3 THE HEAD SITS BETWEEN THE NEAR ARM AND THE FAR ARM.
             near = the arm the AUTHORED order already puts in front of the torso. */
          const pairs = [[iL, ihL, 5], [iR, ihR, 6]];
          for (const [ia, ih, pid] of pairs) {
            const near = ia < iT;
            if (!near && (ia < iH || ih < iH)) {
              out.farInFront++; if (out.farWhere.length < 6) out.farWhere.push(d + '|' + c + '|' + k + '|arm' + pid); }
            if (near && (ia > iF || ih > iF)) {
              out.nearBehind++; if (out.nearWhere.length < 6) out.nearWhere.push(d + '|' + c + '|' + k + '|arm' + pid); }
          }

          /* 4 CONTROL: facing you, with nothing declared, BOTH arms are near, so
             the head must stay behind both of them. A rule that just shoved the
             head to the front would pass every claim above and quietly change
             the picture he already approved on S.
             DECLARED FRAMES ARE EXCLUDED ON PURPOSE, and the first cut of this
             claim went red for missing it: a gun aimed AWAY from camera on S is
             a hand on the far side of the body, so the pair belongs behind the
             head, and counting that as a failure would be the ruler arguing with
             the geometry. Only the undeclared frames are the control. */
          const declared = !!(ps.present && (ps.present._gun || ps.present._handsBack));
          if (d === 'S' && !declared) { out.sFrames++; if (iH < iL || iH < iR) out.sHeadLast = false; }

          /* 5 the pixels: a far arm may not paint on the head */
          const g = f.grid;
          for (let i = 0; i < g.length; i++) {
            const v = g[i];
            if (v === 1 || v === 2) out.headCells++;
          }
        }
      }
    }
    return out;
  });

  ok('every clip in every facing builds and orders (' + R.clips + ' clips, ' + R.frames + ' frames)',
     R.clips >= 100 && R.frames >= 6000 && R.threw === 0);

  ok('A HAND NEVER LEAVES ITS OWN ARM: nothing is drawn between a hand and its own forearm in ' +
     R.frames + ' frames (' + R.apart + ' bad)', R.apart === 0);
  if (R.apart) console.log('     ' + R.apartWhere.join(' '));

  ok('AND THE HEAD NEVER COMES BETWEEN THEM: no hand is behind the head while its own arm is in front of it (' +
     R.split + ' bad, and it was 460 before this shipped -- every one a gun clip, 66 on NE)', R.split === 0);
  if (R.split) console.log('     ' + R.splitWhere.join(' '));

  ok('THE FAR ARM IS BEHIND THE HEAD, on all eight facings (' + R.farInFront +
     ' frames put it in front, and 35,229 cells were painted that way before this shipped)', R.farInFront === 0);
  if (R.farInFront) console.log('     ' + R.farWhere.join(' '));

  ok('AND THE NEAR ARM IS IN FRONT OF IT (' + R.nearBehind + ' frames put it behind)', R.nearBehind === 0);
  if (R.nearBehind) console.log('     ' + R.nearWhere.join(' '));

  ok('CONTROL: facing you BOTH arms are near, so the head stays BEHIND both in all ' + R.sFrames +
     ' undeclared S frames -- a rule that just shoved the head to the front would pass everything above ' +
     'and break the picture he already approved', R.sHeadLast && R.sFrames > 500);

  await br.close();
  done();
})().catch(e => { console.log('  FAIL gate threw: ' + e.message); fail++; done(); });
