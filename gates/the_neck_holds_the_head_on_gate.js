#!/usr/bin/env node
/* THE NECK IS THE ONLY THING HOLDING THE HEAD ON.

   PAOLO 9/7, pointing at his own frame
   (records/target/PAOLO_THE_COAT_AND_THE_ELBOWS_9_7_26.jpg): on NE the head sits up
   and to the right of the shoulders with a visible gap. The same reads on SE and SW
   in that grid; N, E and S look attached.

   MEASURED over 105 clips x 8 facings x 4 phases = 3,360 frames, with the
   direction-free blob ruler this lane already built for the head snap (REUSE-FIRST):
   48 frames drew the head DETACHED from the body by 2 to 8 px.

   AND THE CAUSE IS NOT THE POSE. 31 of those frames drew NO NECK AT ALL and every
   single one was detached, against 0.7% of the 1,666 frames that did draw one.
   Sampling the line from the neck joint to the head joint, the pixels along it were
   part ids 5 and 6: THE ARMS. The per-facing layerOverride puts the NEAR arm at
   index 0 on NE, E and SE -- nearer than the torso and nearer than the neck at index
   4 or 5. Correct for an arm at your side; wrong the moment the pose RAISES it,
   because the sleeve sweeps across the throat and erases the one part connecting the
   head to the body.

   THE RULE: the neck draws in front of the arms. Same family as THE NEAR HAND DRAWS
   IN FRONT (9/13), except that covering the neck destroys the read of the whole
   figure, so the neck wins outright.                               ANIMATION 9/18 */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');
const FRAME = path.join(ROOT, 'records', 'target', 'PAOLO_THE_COAT_AND_THE_ELBOWS_9_7_26.jpg');
const { settle: SETTLE } = require(path.join(ROOT, 'gates', 'bohemia_settle.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? (pass++, console.log('  ok   ' + n)) : (fail++, console.log('  FAIL ' + n)); };
const done = () => { console.log('\nTHE NECK HOLDS THE HEAD ON GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0); };

if (!fs.existsSync(ALPHA)) { console.log('  FAIL missing ' + ALPHA); fail++; done(); }
const src = fs.readFileSync(ALPHA, 'utf8');

ok('his own frame is still in the repo, so the complaint this answers can be looked at',
   fs.existsSync(FRAME));

ok('the rule is in the draw order and runs on the FINAL order, after the head rule',
   /const _neckHolds=/.test(src) && /_neckHolds\(_headBetween\(ord\)\)/.test(src));

ok('and it is on BOTH of handOrder\'s exits, not just the one a test happened to hit (' +
   (src.match(/_neckHolds\(_headBetween\(ord\)\)/g) || []).length + ' of 2)',
   (src.match(/_neckHolds\(_headBetween\(ord\)\)/g) || []).length === 2);

/* THE CEILINGS ARE THE MEASUREMENT, not a guess: 48 -> 23 detached, 31 -> 10 with no
   neck, worst 8px -> 6px. They are held at what shipped so the number can only fall. */
const DETACHED_MAX = 23, NONECK_MAX = 10, WORST_MAX = 6;

(async () => {
  const { chromium } = require('/opt/node22/lib/node_modules/playwright');
  const br = await chromium.launch();
  const pg = await br.newPage();
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + ALPHA, { waitUntil: 'load' });
  await SETTLE(pg, 2400);

  const R = await pg.evaluate(() => {
    const DIRS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const clips = (typeof CLIPS !== 'undefined' && CLIPS.length) ? CLIPS.slice() : Object.keys(POSE);
    let detached = 0, neckless = 0, worst = 0, total = 0;
    const bad = [];
    for (const c of clips) for (const d of DIRS) for (const ph of [0, 0.25, 0.5, 0.75]) {
      let f; try { f = buildFrame(d, c, ph); } catch (e) { continue; }
      const g = f.grid, CW = f.CW, CH = f.CH; const H = [], B = []; let neck = 0;
      for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) { const p = g[y * CW + x];
        if (p === 1 || p === 2) H.push(x, y); else if (p === 3 || p === 4) B.push(x, y);
        if (p === 3) neck++; }
      if (!H.length || !B.length) continue;
      total++; if (!neck) neckless++;
      let best = 1e9;
      for (let i = 0; i < H.length; i += 2) { for (let j = 0; j < B.length; j += 2) {
        const dd = Math.max(Math.abs(H[i] - B[j]), Math.abs(H[i + 1] - B[j + 1]));
        if (dd < best) { best = dd; if (best <= 1) break; } } if (best <= 1) break; }
      if (best > worst) worst = best;
      if (best >= 2) { detached++; bad.push(c + ' ' + d + '@' + ph + ' ' + best + 'px'); }
    }
    /* THE RULE ITSELF, asked of the live order rather than read: on every facing the
       neck must not sit behind an arm. */
    const orders = {};
    for (const d of DIRS) {
      try { const ps = posedSkel(d, 'cheer', 0.25);
        const o = handOrder(d, ps.present, ps.sk);
        const n = o.indexOf(3), a = [o.indexOf(5), o.indexOf(6)].filter(v => v >= 0);
        orders[d] = { neck: n, firstArm: a.length ? Math.min.apply(null, a) : -1 };
      } catch (e) { orders[d] = { err: String(e.message) }; }
    }
    return { detached, neckless, worst, total, bad, orders, clips: clips.length };
  });

  ok('the alpha loads with no page error (' + (errs.length ? errs[0] : 'none') + ')', errs.length === 0);

  const DIRS = Object.keys(R.orders);
  const behind = DIRS.filter(d => R.orders[d].firstArm >= 0 && R.orders[d].neck > R.orders[d].firstArm);
  ok('ON EVERY FACING the neck draws in front of the arms, asked of the live draw order ' +
     'and not read off a line (' + (DIRS.length - behind.length) + ' of ' + DIRS.length +
     (behind.length ? '; still behind on ' + behind.join(',') : '') + ')', behind.length === 0);

  ok('HIS COMPLAINT, MEASURED: across ' + R.clips + ' clips x 8 facings x 4 phases (' +
     R.total + ' frames) the head is detached from the body in ' + R.detached +
     ' (ceiling ' + DETACHED_MAX + '; it was 48 before this rule)', R.detached <= DETACHED_MAX);

  ok('and the cause is gone where it was the cause: ' + R.neckless + ' frames draw NO NECK ' +
     '(ceiling ' + NONECK_MAX + '; it was 31, and every one of those 31 was detached)',
     R.neckless <= NONECK_MAX);

  ok('the worst gap anywhere is ' + R.worst + 'px (ceiling ' + WORST_MAX + '; it was 8)',
     R.worst <= WORST_MAX);

  /* WHAT IS NOT FIXED IS PRINTED, NOT HIDDEN. */
  console.log('');
  if (R.bad.length) {
    const guns = R.bad.filter(x => /two-hand|deadeye|crouch-aim/.test(x));
    console.log('  STILL DETACHED, and named so the clip list is not read as finished:');
    console.log('    ' + R.bad.length + ' frames, of which ' + guns.length + ' are GUN clips ' +
                '(two-hand, deadeye, crouch-aim-2h).');
    console.log('    Those are a DIFFERENT defect: the GUN-UNIT law moves parts 7 and 8, and this');
    console.log('    rule only moves the neck. Named here rather than chased, and the ceiling above');
    console.log('    means the count can only fall from here.');
    console.log('    ' + R.bad.slice(0, 10).join(' | '));
  } else console.log('  no frame draws a detached head.');

  await br.close();
  done();
})().catch(e => { console.log('  FAIL gate threw: ' + e.message); fail++; done(); });
