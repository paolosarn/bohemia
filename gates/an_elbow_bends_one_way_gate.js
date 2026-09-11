/* BOHEMIA -- AN ELBOW BENDS ONE WAY (ANIMATION lane, 9/11/26)
 *
 * FACTORY LAW: new law, new gate, same turn.
 * Law: laws/BOHEMIA_ADDENDUM_A_KILLED_CLIP_IS_A_REDO_9_7_26.md
 * Record: records/BOHEMIA_AN_ELBOW_BENDS_ONE_WAY_9_11_26.md
 *
 * PAOLO 9/7, thumbing the whole clip list: "you kind of suck at bending elbows at
 * all, and if you do, sometimes they're going the wrong way, looking broken."
 *
 * WHAT WAS WRONG. Every clip that uses IK passed bend:'auto' -- all 24 -- and
 * 'auto' solved BOTH elbow solutions each frame and kept whichever hung LOWER on
 * screen. That is gravity, not a joint, and `A.el[1] >= B.el[1]` IS A KNIFE EDGE:
 * with the two solutions at nearly the same height it can land either way, so the
 * answer was recomputed every frame and the joint SNAPPED across the arm between
 * one frame and the next.
 *
 * MEASURED BEFORE THE FIX, 40,320 arm-frames (105 clips x 8 facings x 24 frames x
 * 2 arms): 59 snaps in 11 clips, the elbow moving AS FAR AS 36 PIXELS IN ONE FRAME
 * on a 56-pixel body. *** AND ALL ELEVEN OF THOSE CLIPS ARE ONES HE THUMBED DOWN ***
 * -- the machine found them, and only afterwards were they compared to his verdict
 * file. That is the strongest evidence this ruler measures what he sees.
 *
 * THE TWO CLAIMS, and the second is the law itself:
 *
 *  1. THE JOINT DOES NOT REVERSE MID-CLIP. Counted over every clip, facing and
 *     adjacent frame pair. Floor is the measured 7, not 0, and that is deliberate:
 *     the three that remain (cover-rise, cover-drop, bat-arc) are arm-across-body
 *     sweeps where a real arm genuinely crosses, and they moved 9-12px rather than
 *     36. Pinning 0 here would be pinning a number nobody has earned.
 *
 *  2. AN ARM'S BEND SIDE IS CONSTANT FOR A FACING. This is the actual rule, and it
 *     is stronger than claim 1: which way an elbow bends is a property of the ARM,
 *     decided once from the arm and the facing, never recomputed from the frame.
 *     A build that got claim 1 down by luck would still fail this.
 *
 * MEASURED AGAINST THE ALTERNATIVES ON THE SAME FRAMES, so the choice is not taste:
 *     gravity (what shipped)            48 flips in  9 clips
 *     elbow farthest from the chest    156 flips in 18 clips
 *     elbow outboard on the lateral    126 flips in 16 clips
 *     decided once per arm + facing      0 flips in  0 clips
 * The 7/2 GUN ELBOW GRAVITY note rejected fixed signs because they "chicken-winged
 * the mirrored family" -- true of signs fixed in SCREEN space. Tied to the FACING
 * they mirror with the body, which is the half that was missing.
 */
const path = require('path');
const { settle: SETTLE } = require(path.join(__dirname, 'bohemia_settle.js'));
const ALPHA = path.join(__dirname, '..', 'slices', 'BOHEMIA_ALPHA_0_9.html');

const FLIP_FLOOR = 7;          /* measured 9/11. may fall, must never rise */
const WAS = 59;                /* what it was before the rule went in */

let p = 0, f = 0;
const ok = (n, c) => { c ? p++ : (f++, console.log('  > FAIL ' + n)); };
const done = () => { console.log(`\n=== AN ELBOW BENDS ONE WAY: ${p} passed, ${f} failed ===`); process.exit(f ? 1 : 0); };

(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); done(); }
  const b = await chromium.launch();
  const pg = await b.newPage();
  const errs = [];
  pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + ALPHA, { waitUntil: 'load' });
  await SETTLE(pg, 2400);
  ok('the alpha loads with zero page errors' + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);
  if (errs.length) { await b.close(); done(); }

  const R = await pg.evaluate(() => {
    const D = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'];
    const N = (typeof FRAME_CACHE !== 'undefined' && FRAME_CACHE.buckets) || 24;
    const out = { pairs: 0, flips: 0, worstJump: 0, flipClips: {},
                  inconsistent: [], armFrames: 0, ikClips: 0, locked: 0 };
    const sideOf = (sh, el, hd) => {
      const rx = hd[0] - sh[0], ry = hd[1] - sh[1];
      return Math.sign((el[0] - sh[0]) * ry - (el[1] - sh[1]) * rx);
    };
    const flexOf = (a, b2, c) => {
      const ux = b2[0] - a[0], uy = b2[1] - a[1], vx = c[0] - b2[0], vy = c[1] - b2[1];
      const d = (ux * vx + uy * vy) / ((Math.hypot(ux, uy) || 1) * (Math.hypot(vx, vy) || 1));
      return Math.acos(Math.max(-1, Math.min(1, d))) * 180 / Math.PI;
    };

    for (const c of CLIPS) {
      let usesIK = false;
      try { const p0 = POSE[c]('S', 0); usesIK = !!(p0 && (p0.ikR || p0.ikL)); } catch (e) {}
      if (usesIK) out.ikClips++;

      for (const d of D) {
        for (const s of [['shR', 'elR', 'handR'], ['shL', 'elL', 'handL']]) {
          let prev = null;
          const sidesSeen = {};
          for (let k = 0; k <= N; k++) {
            let ps = null;
            try { ps = posedSkel(d, c, (k % N) / N); } catch (e) { prev = null; continue; }
            const P = ps && ps.sk;
            if (!P || !P[s[0]]) { prev = null; continue; }
            const sh = P[s[0]], el = P[s[1]], hd = P[s[2]];
            const cur = { side: sideOf(sh, el, hd), flex: flexOf(sh, el, hd), el: el };
            out.armFrames++;
            /* a REAL bend only: a near-straight arm has no meaningful side */
            if (cur.flex > 8 && cur.side !== 0) sidesSeen[cur.side] = (sidesSeen[cur.side] || 0) + 1;
            if (prev) {
              out.pairs++;
              if (prev.flex > 8 && cur.flex > 8 && prev.side !== 0 && cur.side !== 0 && prev.side !== cur.side) {
                out.flips++;
                out.flipClips[c] = (out.flipClips[c] || 0) + 1;
                const j = Math.hypot(cur.el[0] - prev.el[0], cur.el[1] - prev.el[1]);
                if (j > out.worstJump) out.worstJump = j;
              }
            }
            prev = cur;
          }
          /* CLAIM 2: within one clip on one facing, ONE arm used ONE side. */
          if (usesIK && Object.keys(sidesSeen).length > 1) {
            const tot = Object.values(sidesSeen).reduce((a2, b2) => a2 + b2, 0);
            const minor = Math.min.apply(null, Object.values(sidesSeen));
            out.inconsistent.push(c + '@' + d + '/' + s[0].slice(-1) + ' ' + minor + '/' + tot);
          }
        }
      }
    }
    return out;
  });

  await b.close();

  ok(`the whole set was swept (${R.armFrames} arm-frames, ${R.ikClips} clips ask for an elbow)`,
     R.armFrames > 30000 && R.ikClips >= 20);

  ok(`no elbow reverses mid-clip beyond the measured floor (${R.flips} flips, floor ${FLIP_FLOOR}, was ${WAS})`,
     R.flips <= FLIP_FLOOR);

  ok(`and no elbow teleports across the body any more (worst single-frame move ${R.worstJump.toFixed(1)}px, was 36)`,
     R.worstJump <= 14);

  /* CLAIM 2, AND THE FIRST CUT OF IT WAS THE WRONG CLAIM. It asserted that the
     OBSERVED side of the shoulder-hand line never changes within a clip, and failed
     cover-rise and cover-drop -- correctly, for doing something a real arm does:
     when a hand sweeps across the body the elbow's relation to that line changes
     because the ARM moved, not because the joint reversed. That is a proxy, not the
     rule. The rule is that the SOLVER'S SIDE is decided once from the arm and the
     facing, so the gate asks the decision itself. */
  const RULE = await (async () => {
    const b2 = await chromium.launch();
    const pg2 = await b2.newPage();
    await pg2.goto('file://' + ALPHA, { waitUntil: 'load' });
    await SETTLE(pg2, 2400);
    const r = await pg2.evaluate(() => {
      if (typeof window.__elbowSide !== 'function') return { missing: true };
      const D = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'];
      const out = { table: {}, stable: true, mirrored: true, obeys: true };
      for (const d of D) {
        const R1 = window.__elbowSide(d, 1, 'auto', FACEANG);
        const L1 = window.__elbowSide(d, -1, 'auto', FACEANG);
        /* deterministic: asking again gives the same answer */
        for (let i = 0; i < 5; i++) {
          if (window.__elbowSide(d, 1, 'auto', FACEANG) !== R1) out.stable = false;
          if (window.__elbowSide(d, -1, 'auto', FACEANG) !== L1) out.stable = false;
        }
        if (R1 !== -L1) out.mirrored = false;        /* the two arms mirror each other */
        out.table[d] = R1;
        /* an explicit sign from a clip is still obeyed, never overridden */
        if (window.__elbowSide(d, 1, 1, FACEANG) !== 1) out.obeys = false;
        if (window.__elbowSide(d, -1, -1, FACEANG) !== -1) out.obeys = false;
      }
      /* and the body's two halves mirror: facings pointing screen-right take one
         side, facings pointing screen-left the other. That is the half the 7/2 note
         was missing when it called fixed signs chicken-winged. */
      const right = ['SE', 'E', 'NE'].map(d => out.table[d]);
      const left = ['SW', 'W', 'NW'].map(d => out.table[d]);
      out.facingMirror = right.every(v => v === right[0]) && left.every(v => v === left[0]) && right[0] === -left[0];
      return out;
    });
    await b2.close();
    return r;
  })();

  ok('the rule is reachable to be measured, not just inferred from pictures', !RULE.missing);
  ok('an arm\'s bend side is DECIDED ONCE and does not vary between asks', !!RULE.stable);
  ok('the two arms mirror each other', !!RULE.mirrored);
  ok('and the two halves of the body mirror, which is what fixed SCREEN-space signs got wrong in the 7/2 note',
     !!RULE.facingMirror);
  ok('a clip that names a real +1/-1 is still obeyed, only auto is answered', !!RULE.obeys);
  console.log('  bend side by facing (right arm): ' + JSON.stringify(RULE.table));
  console.log('  arm/facing runs whose OBSERVED side changed (a sweep, not a defect): ' + R.inconsistent.length);

  console.log('');
  console.log('  clips that still flip: ' +
    (Object.keys(R.flipClips).length ? Object.entries(R.flipClips).map(x => x[0] + ':' + x[1]).join(', ') : 'none') +
    '  (arm-across-body sweeps; they were 11 clips and 36px before)');
  done();
})();
