#!/usr/bin/env node
/* HIS HEAD IS IN THE FRAME -- for the two headshot clips in Paolo's 9/7 kill list,
   and for his own TRACKING CAMERA law (7/2/26): "the whole body stays in frame for
   the entire fall, every knock direction, at STABLE SCALE."

   FOUR camera blocks in the alpha -- the tracking pan, the crumple pan, the
   fixed-frame corpse and the ragdoll centroid -- had the numbers 28, 27, 34, 50,
   53, 54, 52, 2 and 3 typed out by hand. Every one is a 56-row canvas. BAKED is
   112x112 and RIG_RS is 2, and a body just STANDING spans 88 rows (head 14, feet
   102). 88 is bigger than every "too big" threshold there, so those cameras
   centred a 112-space body on the middle of a 56-space frame on every frame of
   every fall.

   MEASURED from a deterministic reset before the fix: the headshot's body sat at
   -16 to 72 for the whole fall -- sixteen rows of head above the top edge -- and
   the drawn sprite's top was pinned at row 0 the entire time. He was watching a
   headless body. MOTION VISIBLE had been red on main on exactly this for both
   clips.

   One derivation, four callers, and at RIG_RS 1 it reproduces every number that
   was typed before, so the original 56 rig is provably untouched.  ANIMATION 9/13 */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');
const { settle: SETTLE } = require(path.join(ROOT, 'gates', 'bohemia_settle.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? (pass++, console.log('  ok   ' + n)) : (fail++, console.log('  FAIL ' + n)); };
const done = () => { console.log('\nHIS HEAD IS IN THE FRAME GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0); };

if (!fs.existsSync(ALPHA)) { console.log('  FAIL the alpha is missing'); fail++; done(); }
const src = fs.readFileSync(ALPHA, 'utf8');

ok('the frame is derived from the canvas in one place (rigFrame)', /function rigFrame\(\)\{/.test(src));

/* NO HAND-TYPED 56-SPACE CONSTANT SURVIVES IN A CAMERA. This is a code claim on
   purpose: the pixels below prove the fix works TODAY, and this is what stops the
   next edit quietly typing 28 back in. */
const typed = [
  [/ox\s*=\s*28\s*-/, 'ox=28-'],
  [/oy\s*=\s*(?:27|28|34)\s*-/, 'oy=27/28/34-'],
  [/mxx\s*-\s*mnx\s*>\s*(?:50|52)\b/, 'mxx-mnx>50/52'],
  [/mxy\s*-\s*mny\s*>\s*(?:50|52)\b/, 'mxy-mny>50/52'],
  [/mxx\s*>\s*(?:53|54)\b/, 'mxx>53/54'],
  [/mxy\s*>\s*(?:53|54)\b/, 'mxy>53/54'],
];
const left = typed.filter(t => t[0].test(src)).map(t => t[1]);
ok('and no camera still types a 56-row canvas out by hand' + (left.length ? ' (' + left.join(', ') + ')' : ''),
   left.length === 0);

(async () => {
  const { chromium } = require('/opt/node22/lib/node_modules/playwright');
  const br = await chromium.launch();
  const pg = await br.newPage();
  await pg.goto('file://' + ALPHA, { waitUntil: 'load' });
  await SETTLE(pg, 2400);

  const R = await pg.evaluate(async () => {
    const out = { canvas: null, frame: null, clips: {}, idleHead: null, idleRest: null };
    const f0 = buildFrame('S', 'idle', 0);
    out.canvas = { CW: f0.CW, CH: f0.CH };
    out.frame = (typeof rigFrame === 'function') ? rigFrame() : null;
    /* THE CONTROL, and the first cut of it was VACUOUS. It compared idle's head to
       the rest rig -- but idle never passes through any of these four camera
       blocks, so a mutation that shoved the frame 30 rows down the screen passed
       it and every other claim. A control has to be a body the code actually
       touches. The headshot's FIRST frame is the standing pose, it does go through
       the tracking pan, and it already fits the canvas, so the camera must leave
       it exactly where the rest rig puts it. */
    out.idleRest = RIG.S.headTop[1];
    if (typeof HS !== 'undefined') HS.key = null;
    out.fallStartHead = posedSkel('S', 'headshot', 0.1).sk.headTop[1];

    for (const c of ['headshot', 'headshot-2']) {
      if (typeof HS !== 'undefined') HS.key = null;
      if (typeof RG !== 'undefined') RG.key = null;
      const tops = [], bots = [], above = [], below = [];
      for (let i = 0; i < 8; i++) {
        await new Promise(r => setTimeout(r, 220));
        const s = posedSkel('S', c, 0.1).sk;
        let mn = 1e9, mx = -1e9;
        for (const j in s) { if (!Array.isArray(s[j])) continue; mn = Math.min(mn, s[j][1]); mx = Math.max(mx, s[j][1]); }
        if (mn < 0) above.push(+mn.toFixed(1));
        if (mx > f0.CH - 1) below.push(+mx.toFixed(1));
        const fr = buildFrame('S', c, 0.1);
        let miny = 1e9, maxy = -1;
        for (let k = 0; k < fr.px.length; k++) if (fr.px[k]) { const y = (k / fr.CW) | 0; if (y < miny) miny = y; if (y > maxy) maxy = y; }
        tops.push(miny); bots.push(maxy);
      }
      out.clips[c] = { tops, bots, above, below,
                       drop: Math.max.apply(null, tops) - Math.min.apply(null, tops),
                       clippedTop: tops.filter(t => t === 0).length };
    }
    return out;
  });

  ok('the canvas is ' + R.canvas.CH + ' rows and rigFrame agrees (' + (R.frame && R.frame.H) + ')',
     !!R.frame && R.frame.H === R.canvas.CH && R.frame.W === R.canvas.CW);

  for (const c of ['headshot', 'headshot-2']) {
    const v = R.clips[c];
    ok(c + ': NO JOINT LEAVES THE TOP OF THE FRAME during the fall' +
       (v.above.length ? ' (above the edge: ' + v.above.join(',') + ')' : ''), v.above.length === 0);
    /* AND THE MIRROR, which was missing on the first cut and let a mutation that
       shoved the corpse thirty cells DOWN pass every other claim. His law says the
       WHOLE body stays in frame; a foot out of the bottom is as far out as a head
       out of the top. */
    ok(c + ': NOR THE BOTTOM' + (v.below.length ? ' (below the edge: ' + v.below.join(',') + ')' : ''),
       v.below.length === 0);
    ok(c + ': and the drawn body is never cut off at row 0 (' + v.clippedTop + ' of ' +
       v.tops.length + ' frames clipped; it was every one of them)', v.clippedTop === 0);
    ok(c + ': and it actually falls -- the top of the sprite drops ' + v.drop +
       'px over the sample (floor 2; it was 0)', v.drop >= 2);
  }

  /* THE CONTROL. Every claim above would pass a camera that simply shoved
     everything down the screen. A standing body must still sit exactly where the
     rest pose puts it, untouched by any of these four blocks. */
  ok('CONTROL: THE CAMERA MAY NOT MOVE A BODY THAT ALREADY FITS. The headshot\'s first frame is the ' +
     'standing pose and it does pass through the tracking pan: its head is at row ' + R.fallStartHead +
     ' and the rest rig puts it at ' + R.idleRest + ' (drift ceiling 2)',
     Math.abs(R.fallStartHead - R.idleRest) <= 2);

  console.log('');
  for (const c of ['headshot', 'headshot-2']) console.log('  ' + c.padEnd(12) + ' sprite tops ' + R.clips[c].tops.join(','));

  await br.close();
  done();
})().catch(e => { console.log('  FAIL gate threw: ' + e.message); fail++; done(); });
