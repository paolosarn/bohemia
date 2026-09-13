#!/usr/bin/env node
/* A JOINT DOES NOT SNAP -- the machine half of Paolo's 9/7 re-analysis order:
     "A lot of the ones I thumbed down were because some of the DIRECTIONS look
      like dog shit ... We gotta re-analyze a lot of these. IF I KILLED IT I
      DON'T WANT IT GONE. I just think it could be done better. Make a new one."

   MOVING A LOT IS NOT A DEFECT. jumping-jacks is SUPPOSED to throw the elbow
   across the screen, and a ruler that measures distance calls it the worst clip
   in the set (218 frames over 6px) while calling a genuinely broken one clean.
   The signature of a broken joint is the ELBOW travelling far in one frame while
   THE HAND IT BELONGS TO hardly travels at all: the limb did not go anywhere,
   the joint jumped to the other solution. So the ruler is a RATIO, not a
   distance -- elbow travel over its own limb's travel, ignoring moves under 4px
   where pixel rounding dominates.

   MEASURED over the 47 clips he thumbed down, all 8 facings, 24 buckets:
     before the three rig fixes   11 clips snapped, worst ratio 60
                                  (elbow 30px while the hand moved 0px)
     after them                   10 clips, worst ratio 14, and every one of the
                                  pure 30-to-60x flips is gone
   The 47 also went from 144 far-arm-over-head frames EACH to zero, which is why
   this lane is re-analysing them instead of remaking all 47 blind.  ANIMATION 9/13 */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');
const { settle: SETTLE } = require(path.join(ROOT, 'gates', 'bohemia_settle.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? (pass++, console.log('  ok   ' + n)) : (fail++, console.log('  FAIL ' + n)); };
const done = () => { console.log('\nA JOINT DOES NOT SNAP GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0); };

/* RATCHETS. They may fall and never rise. */
/* THE FLOOR MOVED FROM 4px TO 8px AND THAT IS A CORRECTION, NOT A LOOSENING.
   At 4px this ruler could not tell a REPAIRED frame from a broken one. Where the
   hand is parked on the shoulder the denominator sits at its 0.5 guard, so a
   perfectly smooth 4-pixel elbow move scores 8x -- and when the one-pixel-vector
   fix took crouch-aim-1h's worst frame from 31.4px down to 3.2px, the ruler
   reported MORE snapping clips, not fewer. A ruler that gets worse when the thing
   it measures gets better is measuring the wrong thing.
   At 8px -- half the upper arm's own length on this rig -- the three builds
   separate cleanly and monotonically:
       before any rig fix        11 clips   60x   36.0px
       after the elbow rule       7 clips   14x   31.4px
       after the one-pixel fix    4 clips  4.1x   12.6px
   PINNED AT THE MEASUREMENT, because the first cut left slack (12 clips, 18x) and
   a mutation that inverted the elbow side walked straight through it. */
const SNAP_FLOOR = 8;          /* px an elbow must travel before the ratio is even asked */
const SNAP_CLIPS_MAX = 4;      /* measured 4 of 105; 11 before the rig fixes */
const WORST_RATIO_MAX = 5;     /* measured 4.1; 60 before */
const WORST_TRAVEL_MAX = 15;   /* measured 12.6px; 36px before */
const FAST_CLIPS = ['jumping-jacks', 'bat-arc', 'throw', 'shadowbox'];

if (!fs.existsSync(ALPHA)) { console.log('  FAIL the alpha is missing'); fail++; done(); }

(async () => {
  const { chromium } = require('/opt/node22/lib/node_modules/playwright');
  const br = await chromium.launch();
  const pg = await br.newPage();
  await pg.goto('file://' + ALPHA, { waitUntil: 'load' });
  await SETTLE(pg, 2400);

  const R = await pg.evaluate(({ SNAP_FLOOR }) => {
    const D = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'];
    const out = { clips: 0, snapClips: {}, worst: 0, worstAt: '', travel: 0, travelAt: '', fastTravel: {}, threw: 0, frames: 0 };
    out.clips = CLIPS.length;
    for (const c of CLIPS) {
      let snaps = 0, fastest = 0;
      for (const d of D) {
        const fr = [];
        for (let k = 0; k < 24; k++) { try { fr.push(posedSkel(d, c, k / 24).sk); } catch (e) { out.threw++; fr.push(null); } }
        for (let k = 0; k < fr.length; k++) {
          const a = fr[k], b = fr[(k + 1) % fr.length]; if (!a || !b) continue;
          out.frames++;
          for (const [el, hd, sh] of [['elL', 'handL', 'shL'], ['elR', 'handR', 'shR']]) {
            if (!a[el] || !b[el] || !a[hd] || !b[hd] || !a[sh] || !b[sh]) continue;
            const de = Math.hypot(b[el][0] - a[el][0], b[el][1] - a[el][1]);
            const dh = Math.hypot(b[hd][0] - a[hd][0], b[hd][1] - a[hd][1]);
            const ds = Math.hypot(b[sh][0] - a[sh][0], b[sh][1] - a[sh][1]);
            if (de > fastest) fastest = de;
            if (de < SNAP_FLOOR) continue;
            const r = de / Math.max(Math.max(dh, ds), 0.5);
            if (r > 2.0) { snaps++;
              if (r > out.worst) { out.worst = r; out.worstAt = c + ' ' + d + ' bucket ' + k + ' ' + el +
                ' elbow ' + de.toFixed(1) + 'px, hand ' + dh.toFixed(1) + 'px'; }
              if (de > out.travel) { out.travel = de; out.travelAt = c + ' ' + d + ' bucket ' + k + ' ' + el +
                ' elbow ' + de.toFixed(1) + 'px, hand ' + dh.toFixed(1) + 'px'; } }
          }
        }
      }
      if (snaps) out.snapClips[c] = snaps;
      out.fastTravel[c] = +fastest.toFixed(1);
    }
    return out;
  }, { SNAP_FLOOR });

  const names = Object.keys(R.snapClips);
  ok('every clip poses in every facing (' + R.clips + ' clips, ' + R.frames + ' frame pairs)',
     R.clips >= 100 && R.threw === 0 && R.frames >= 15000);

  ok('A JOINT DOES NOT SNAP: ' + names.length + ' clips have an elbow that travels more than twice its own ' +
     'limb in one frame (ceiling ' + SNAP_CLIPS_MAX + '; 11 of the 47 he killed did before the three rig fixes)',
     names.length <= SNAP_CLIPS_MAX);

  ok('and the worst one is ' + R.worst.toFixed(1) + 'x (ceiling ' + WORST_RATIO_MAX +
     '; it was 60x before -- an elbow crossing 30 pixels while the hand moved 0)', R.worst <= WORST_RATIO_MAX);
  if (R.worstAt) console.log('     worst ratio:  ' + R.worstAt);

  ok('AND NO JOINT CROSSES THE BODY IN ONE FRAME: the furthest any elbow travels while its limb ' +
     'stands still is ' + R.travel.toFixed(1) + 'px (ceiling ' + WORST_TRAVEL_MAX + '; it was 36px, ' +
     'more than half the body, before the rig fixes)', R.travel <= WORST_TRAVEL_MAX);
  if (R.travelAt) console.log('     worst travel: ' + R.travelAt);

  /* THE CONTROL, and it is the reason this ruler is a ratio.
     A clip that genuinely throws its arms must NOT be flagged. If these ever
     appear in the snap list the ruler has gone back to measuring speed, which is
     the mistake that made a distance ruler call jumping-jacks the worst clip in
     the set while a real 30px joint flip sat two rows below it. */
  const wrongly = FAST_CLIPS.filter(c => R.snapClips[c]);
  const reallyFast = FAST_CLIPS.filter(c => (R.fastTravel[c] || 0) >= 10);
  ok('CONTROL: the fast clips really do throw the elbow (' +
     FAST_CLIPS.map(c => c + ' ' + (R.fastTravel[c] || 0) + 'px').join(', ') + ')', reallyFast.length >= 3);
  ok('CONTROL: and not one of them is called a snap -- the ruler measures a joint leaving its limb behind, ' +
     'never speed' + (wrongly.length ? ' (flagged: ' + wrongly.join(',') + ')' : ''), wrongly.length === 0);

  console.log('');
  console.log('  clips that still snap: ' + (names.length
    ? names.sort((a, b) => R.snapClips[b] - R.snapClips[a]).map(c => c + ':' + R.snapClips[c]).join(', ')
    : 'none'));

  await br.close();
  done();
})().catch(e => { console.log('  FAIL gate threw: ' + e.message); fail++; done(); });
