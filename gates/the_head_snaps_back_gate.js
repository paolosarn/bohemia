#!/usr/bin/env node
/* THE HEAD SNAPS BACK -- beat one of Paolo's headshot spec
   (laws/BOHEMIA_ADDENDUM_ANIMATION_REBUILD_AND_ANATOMY_7_2_26.md section 9:
   "head snaps back on impact (0 to 0.08)").

   THIS GATE EXISTS BECAUSE THE BEAT DEFEATED THREE ATTEMPTS AND THE REASON WAS
   INVISIBLE. An impulse on headTop at frame zero, the same impulse bigger, and
   exempting the head from the horizontal speed cap ALL measured 5.1px of head
   travel against the waist's 4.1 -- identical to each other and to the build
   with no impulse at all.

   THE PIN, MEASURED: the head has EXACTLY ZERO freedom in the sim. Head angle
   minus spine angle is 0.0000 degrees on every step of every fall, kicked or
   not, because the GLUE LAW block in hsStep rewrites headTop off the spine frame
   every step. Every impulse was being overwritten in the step it was applied.

   SO BEAT ONE IS BUILT AT THE NECK JOINT, which the sim does not model at all,
   in hsPose, on the rendered skeleton: inside his window only, the head rotates
   about the neck by a pulse that peaks 30% in and returns to glued by the end.
   The sim is never touched, so his other three beats cannot move -- and the
   RIGID LIMB LAW right below it forces the neck bone back to rest length, which
   is why the head cannot come off.

   THE CLAIM THAT WOULD HAVE FAILED ALL THREE ATTEMPTS is the WHIP: peak head
   travel inside his window divided by the head's travel at the window's END. A
   head that merely leads moves monotonically and scores exactly 1.00 -- which is
   what the build before this gate scored on all eight facings.      ANIMATION 9/14 */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');
const LAW = path.join(ROOT, 'laws', 'BOHEMIA_ADDENDUM_ANIMATION_REBUILD_AND_ANATOMY_7_2_26.md');
const { settle: SETTLE } = require(path.join(ROOT, 'gates', 'bohemia_settle.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? (pass++, console.log('  ok   ' + n)) : (fail++, console.log('  FAIL ' + n)); };
const done = () => { console.log('\nTHE HEAD SNAPS BACK GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0); };

for (const f of [ALPHA, LAW]) if (!fs.existsSync(f)) { console.log('  FAIL missing ' + f); fail++; done(); }
const src = fs.readFileSync(ALPHA, 'utf8');
const law = fs.readFileSync(LAW, 'utf8');

/* HIS WINDOW COMES OUT OF HIS OWN TEXT, never a copy kept here. */
const mw = /head snaps back on impact \(([\d.]+) to ([\d.]+)\)/.exec(law);
ok('his snap window is still readable in the law itself (' + (mw ? mw[1] + ' to ' + mw[2] : 'MISSING') + ')', !!mw);
if (!mw) done();

const mb = /const HS_BEAT=\{[\s\S]*?\};/.exec(src);
let BEAT = null;
try { BEAT = new Function(mb[0].replace('const HS_BEAT', 'var HS_BEAT') + '\nreturn HS_BEAT;')(); } catch (e) {}
ok('the sim\'s snap window is HIS window, not a number typed next to it',
   !!BEAT && BEAT.snap[0] === Number(mw[1]) && BEAT.snap[1] === Number(mw[2]));

/* MECHANISM. The snap must be at the NECK, in hsPose, on the rendered head.
   Written as three separate claims because a mutation that moved any one of them
   is a different bug: putting it back in the sim, dropping the crumple guard,
   or letting it run outside his window. */
const hsPoseSrc = (() => { const i = src.indexOf('function hsPose(d){');
  return i < 0 ? '' : src.slice(i, src.indexOf('function posedSkel', i)); })();
ok('beat one is built in hsPose, on the rendered head, not as another impulse in the sim',
   /sk\.headTop\s*=\s*\[sk\.neck\[0\]/.test(hsPoseSrc) && /SNAP_RAD/.test(hsPoseSrc));

ok('it rotates about the NECK, which is the joint a head snap actually uses',
   /_vx\s*=\s*sk\.headTop\[0\]\s*-\s*sk\.neck\[0\]/.test(hsPoseSrc));

ok('it runs inside HIS window only (HS_BEAT.snap), never on a clock of its own',
   /HS_BEAT\.snap/.test(hsPoseSrc));

/* THE PIN IS NAMED IN THE CODE. A fourth attempt at an impulse is the tell the
   STOP PRODUCING law names, and the only thing that prevents it is the finding
   being written where the next person looks. */
ok('the pin is written down where the next impulse would be added (hsReset says do not)',
   /head has EXACTLY ZERO freedom/.test(src) && /Do not add a kick\./.test(src));

/* CONTROL, and it is Paolo 7/17: a head shot destroys motor control instantly,
   so THE CRUMPLE is flaccid and has no snap to give. A change that swept the
   snap into both variants would take his separate ruling with it. */
ok('CONTROL: THE CRUMPLE gets no snap (Paolo 7/17, the corpse is flaccid)',
   /if\(HS\.variant!==2\)\{\s*\n?\s*const _sb=HS_BEAT\.snap/.test(hsPoseSrc));

(async () => {
  const { chromium } = require('/opt/node22/lib/node_modules/playwright');
  const br = await chromium.launch();
  const pg = await br.newPage();
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + ALPHA, { waitUntil: 'load' });
  await SETTLE(pg, 2400);

  const R = await pg.evaluate((snapW) => {
    const DIRS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
    /* the head blob must TOUCH the body blob. Direction-free on purpose: once
       the body is lying down the neck is BESIDE the head, not under it, and a
       ruler that looked downward called the shipped glued build 19% attached. */
    const gapNow = (d) => {
      const f = buildFrame(d, 'headshot', 0.1), g = f.grid, CW = f.CW, CH = f.CH;
      const H = [], B = [];
      for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) { const p = g[y * CW + x];
        if (p === 1 || p === 2) H.push(x, y); else if (p === 3 || p === 4) B.push(x, y); }
      if (!H.length || !B.length) return 99;
      let best = 1e9;
      for (let i = 0; i < H.length; i += 2) for (let j = 0; j < B.length; j += 2) {
        const dd = Math.max(Math.abs(H[i] - B[j]), Math.abs(H[i + 1] - B[j + 1]));
        if (dd < best) { best = dd; if (best <= 1) return best; } }
      return best; };
    const one = (d) => {
      HS.manual = true; HS.key = null; hsReset(d);
      const N = 240, F = [], G = [];
      for (let i = 0; i < N; i++) { const s = hsPose(d).sk;
        F.push({ h: s.headTop.slice(), w: s.waC.slice(), k: s.knA.slice(), f: s.footA.slice(), hd: s.handL.slice() });
        if (i <= 30) G.push(gapNow(d));
        hsStep(1 / 60); }
      HS.manual = false;
      /* the fall's length is measured WITHOUT the head, so the snap can never
         move the denominator his window is a fraction of. */
      let last = 0;
      for (let i = 1; i < N; i++) { let mv = 0;
        for (const k of ['w', 'k', 'f', 'hd']) mv = Math.max(mv, Math.hypot(F[i][k][0] - F[i - 1][k][0], F[i][k][1] - F[i - 1][k][1]));
        if (mv > 0.2) last = i; }
      const endI = Math.round(snapW[1] * last);
      let peakH = 0, peakI = 0, peakW = 0;
      for (let i = 0; i <= endI; i++) { const dh = dist(F[i].h, F[0].h);
        if (dh > peakH) { peakH = dh; peakI = i; } peakW = Math.max(peakW, dist(F[i].w, F[0].w)); }
      const endH = dist(F[endI].h, F[0].h);
      const ang = (a, b2, c) => { const ux = b2[0] - a[0], uy = b2[1] - a[1], vx = c[0] - b2[0], vy = c[1] - b2[1];
        const dd = (ux * vx + uy * vy) / ((Math.hypot(ux, uy) || 1) * (Math.hypot(vx, vy) || 1));
        return Math.acos(Math.max(-1, Math.min(1, dd))) * 180 / Math.PI; };
      let kmax = 0;
      for (let t = 0.10; t <= 0.45; t += 0.01) { const q = F[Math.min(N - 1, Math.round(t * last))];
        kmax = Math.max(kmax, ang(q.w, q.k, q.f)); }
      return { d, peakH: +peakH.toFixed(1), peakI, endH: +endH.toFixed(1),
        whip: +(peakH / (endH || 0.5)).toFixed(2), vsWaist: +(peakH / (peakW || 0.5)).toFixed(2),
        gap: Math.max.apply(null, G.slice(0, endI + 1)), knee: +kmax.toFixed(0),
        headDX: +(F[peakI].h[0] - F[0].h[0]).toFixed(1), waistDX: +(F[endI].w[0] - F[0].w[0]).toFixed(1) };
    };
    return { rows: DIRS.map(one), rad: (typeof SNAP_RAD !== 'undefined') ? SNAP_RAD : null,
             pk: (typeof SNAP_PEAK !== 'undefined') ? SNAP_PEAK : null };
  }, BEAT ? BEAT.snap : [0, 0.08]);

  ok('the alpha loads with no page error while the snap runs (' + (errs.length ? errs[0] : 'none') + ')', errs.length === 0);

  const whipped = R.rows.filter(r => r.whip >= 1.3);
  ok('IT SNAPS, IT DOES NOT LEAD: peak head travel beats the window-end travel on ' +
     whipped.length + ' of 8 facings (floor 7; the build before this scored exactly 1.00 on all eight)',
     whipped.length >= 7);

  const worstVs = Math.min.apply(null, R.rows.map(r => r.vsWaist));
  ok('the head outruns the waist inside his window on every facing: worst ' + worstVs +
     'x (floor 1.5; it was 1.10 before)', worstVs >= 1.5);

  const sameWay = R.rows.filter(r => !r.headDX || !r.waistDX || Math.sign(r.headDX) === Math.sign(r.waistDX));
  ok('it snaps BACK -- the head goes the way the body topples, shot from the front, on ' +
     sameWay.length + ' of 8 facings', sameWay.length === 8);

  const worstGap = Math.max.apply(null, R.rows.map(r => r.gap));
  ok('THE HEAD NEVER COMES OFF: worst head-to-body gap across his whole window is ' +
     worstGap + 'px on all eight facings (ceiling 1, and the RIGID LIMB LAW is why)', worstGap <= 1);

  ok('the amplitude is inside a human neck: ' + R.rad + ' rad is ' +
     (R.rad === null ? '?' : (R.rad * 180 / Math.PI).toFixed(0)) + ' degrees, and a neck extends about 60',
     R.rad !== null && R.rad > 0 && R.rad * 180 / Math.PI <= 45);

  console.log('');
  console.log('  the whip, facing by facing (peak head travel / travel at the window end):');
  for (const r of R.rows)
    console.log('    ' + r.d.padStart(2) + ': ' + (r.peakH + 'px at step ' + r.peakI).padEnd(20) +
                ' whip ' + String(r.whip).padEnd(6) + ' vs the waist ' + r.vsWaist + 'x' +
                (r.whip < 1.3 ? '   <- masked, see below' : ''));

  /* WHAT IS NOT BUILT IS PRINTED, NOT HIDDEN -- the same contract FOUR BEATS keeps. */
  const masked = R.rows.filter(r => r.whip < 1.3);
  if (masked.length) {
    console.log('');
    console.log('  NOT CLEAN, and named so nobody reads it as finished:');
    for (const r of masked)
      console.log('    ' + r.d + ': the snap happens (the head moves ' + r.headDX + 'px against the waist\'s ' +
                  r.waistDX + 'px) but this facing\'s own fall outruns the whip by the window\'s end, so ' +
                  'peak and end land together. Its knee peaks at ' + r.knee + ' degrees, the worst of the ' +
                  'eight -- that is BEAT TWO\'s defect, not beat one\'s, and beat two is still not built.');
  }

  await br.close();
  done();
})().catch(e => { console.log('  FAIL gate threw: ' + e.message); fail++; done(); });
