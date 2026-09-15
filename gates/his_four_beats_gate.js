#!/usr/bin/env node
/* HIS FOUR BEATS -- laws/BOHEMIA_ADDENDUM_ANIMATION_REBUILD_AND_ANATOMY_7_2_26.md
   section 9, Paolo's headshot spec verbatim:

     "4 beats: head snaps back on impact (0 to 0.08), torso/body gives FIRST and
      knees fold (0.10 to 0.45), arms hold UP on inertia while the body drops
      (0.15 to 0.35), torso falls BACK with a hard resistance clamp so it NEVER
      folds into the waist (spine clamped at -0.55), arms come in slightly LAST
      (0.72 to 1)."

   THOSE ARE FRACTIONS OF THE FALL AND THE SIM READ THEM AS SECONDS. The fourth
   beat ends at 1, and nothing about a ragdoll ends one second after it starts.
   Measured: the fall settles at frame 193 of a 60-per-second step, 3.22 s, while
   the windows in hsStep were 0.08, 0.18, 0.22 and 0.24 SECONDS -- every beat
   applied over about a fifth of its length, all of them finished inside the first
   7% of the fall. The number 0.08 appears in both, once as a fraction and once as
   a count of seconds, which is how it went unseen. Same shape as the four cameras
   still typed for a 56-row canvas: a unit, not a value.

   ONLY THE ARMS-UP WINDOW IS CONVERTED, because converting the leg window too
   trades his fourth beat away to buy his third -- the table is in the alpha beside
   the code and in the record. This gate holds what shipped AND names what did
   not, so nobody reads the clip as finished.                     ANIMATION 9/13 */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');
const LAW = path.join(ROOT, 'laws', 'BOHEMIA_ADDENDUM_ANIMATION_REBUILD_AND_ANATOMY_7_2_26.md');
const { settle: SETTLE } = require(path.join(ROOT, 'gates', 'bohemia_settle.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? (pass++, console.log('  ok   ' + n)) : (fail++, console.log('  FAIL ' + n)); };
const done = () => { console.log('\nHIS FOUR BEATS GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0); };

for (const f of [ALPHA, LAW]) if (!fs.existsSync(f)) { console.log('  FAIL missing ' + f); fail++; done(); }
const src = fs.readFileSync(ALPHA, 'utf8');
const law = fs.readFileSync(LAW, 'utf8');

/* HIS OWN TEXT IS THE SOURCE OF THE WINDOWS, not a copy in the gate. If the law
   is ever re-worded the numbers here have to move with it. */
const nums = (re) => { const m = re.exec(law); return m ? m.slice(1).map(Number) : null; };
const wSnap = nums(/head snaps back on impact \(([\d.]+) to ([\d.]+)\)/);
const wFold = nums(/knees fold \(([\d.]+) to ([\d.]+)\)/);
const wArms = nums(/arms hold UP on inertia while the body drops \(([\d.]+) to ([\d.]+)\)/);
const wLast = nums(/arms come in slightly LAST \(([\d.]+) to ([\d.]+)\)/);
ok('his four windows are still readable in the law itself (' +
   [wSnap, wFold, wArms, wLast].map(w => w ? w.join('-') : 'MISSING').join(', ') + ')',
   !!(wSnap && wFold && wArms && wLast));
if (!(wSnap && wFold && wArms && wLast)) done();

const m = /const HS_BEAT=\{[\s\S]*?\};/.exec(src);
ok('the sim names his beats (HS_BEAT) and asks in fractions (hsIn)',
   !!m && /function hsIn\(name\)/.test(src) && /const HS_FALL=/.test(src));
if (!m) done();
let BEAT = null;
try { BEAT = new Function(m[0].replace('const HS_BEAT', 'var HS_BEAT') + '\nreturn HS_BEAT;')(); } catch (e) {}
const same = (a, b) => a && b && a[0] === b[0] && a[1] === b[1];
ok('and every window matches HIS TEXT exactly, read out of the law and not copied here',
   !!BEAT && same(BEAT.snap, wSnap) && same(BEAT.fold, wFold) && same(BEAT.armsUp, wArms) && same(BEAT.armsIn, wLast));

/* BOTH CALL SITES, and a mutation is why. The first cut of this claim just looked
   for hsIn('armsUp') anywhere, so putting the HAND damping back to 0.22 seconds
   passed it -- the elbow line still matched the regex, and it also still carries
   beat four on its own, so the data claim below could not see it either. The hand
   and the elbow are two separate lines and both have to ask in fractions. */
const armsUpSites = (src.match(/hsIn\('armsUp'\)/g) || []).length;
ok('BOTH the hand and the elbow ask for the arms-up window as a fraction of the fall, ' +
   'not a count of seconds (' + armsUpSites + ' call sites, needs 2)',
   armsUpSites >= 2 && /const handHold=\(HS\.variant===2\)\?\(HS\.t<0\.55\):hsIn\('armsUp'\)/.test(src));

/* THE CONTROL, and it is a different ruling of his. Paolo 7/17: a head shot
   destroys motor control instantly, so THE CRUMPLE (variant 2) is flaccid and
   carries its own timings. A change that swept every window into fractions would
   have taken his crumple with it. Its seconds must still be seconds. */
ok('CONTROL: the CRUMPLE keeps its own timings in seconds (Paolo 7/17, a separate ruling)',
   /HS\.variant===2\?0\.03:/.test(src) && /HS\.variant===2\?HS\.t<0\.55/.test(src));

(async () => {
  const { chromium } = require('/opt/node22/lib/node_modules/playwright');
  const br = await chromium.launch();
  const pg = await br.newPage();
  await pg.goto('file://' + ALPHA, { waitUntil: 'load' });
  await SETTLE(pg, 2400);

  /* *** AND UNTIL NOW THIS GATE LOOKED AT ONE FACING OUT OF EIGHT. ***
     Every number it has ever printed came from hsReset('S'). Measured across all
     eight, the same beat is a different animation per facing: beat three's lag
     runs 17% on S to 200% on NE, and BEAT FOUR -- which this gate declared LANDED
     at 16.8px -- is 16.8 on S and about -0.9 on the other seven. That claim was
     true on one facing and nobody had looked at the rest, which is the same
     measurement gap every ruler bug in this clip has had: the ruler measured
     something smaller than the thing it named. It sweeps all eight now and each
     claim says which facings it holds on. */
  const R = await pg.evaluate(() => {
    const DIRS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const perFacing = {};
    for (const D of DIRS) {
    HS.manual = true; HS.key = null; hsReset(D);
    const N = 240, F = [];
    for (let i = 0; i < N; i++) {
      const s = hsPose(D).sk;   /* D, not 'S' -- hsPose re-resets when the key differs, so a hardcoded facing silently made all eight the same run */
      F.push({ h: s.headTop.slice(), w: s.waC.slice(), k: s.knA.slice(), f: s.footA.slice(),
               hd: s.handL.slice(), sh: s.shL.slice() });
      hsStep(1 / 60);
    }
    let last = 0;
    for (let i = 1; i < N; i++) { let mv = 0;
      for (const k of ['h', 'w', 'k', 'f', 'hd']) mv = Math.max(mv, Math.hypot(F[i][k][0] - F[i - 1][k][0], F[i][k][1] - F[i - 1][k][1]));
      if (mv > 0.2) last = i; }
    const at = t => F[Math.min(N - 1, Math.round(t * last))];
    const ang = (a, b, c) => { const ux = b[0] - a[0], uy = b[1] - a[1], vx = c[0] - b[0], vy = c[1] - b[1];
      const d = (ux * vx + uy * vy) / ((Math.hypot(ux, uy) || 1) * (Math.hypot(vx, vy) || 1));
      return Math.acos(Math.max(-1, Math.min(1, d))) * 180 / Math.PI; };
    const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
    let kmax = 0; for (let t = 0.10; t <= 0.45; t += 0.01) { const q = at(t); kmax = Math.max(kmax, ang(q.w, q.k, q.f)); }
    const bd = at(0.35).w[1] - at(0.15).w[1], hdp = at(0.35).hd[1] - at(0.15).hd[1];
    perFacing[D] = { settle: last, fallSec: +(last / 60).toFixed(2),
             headMove: +dist(at(0.08).h, at(0).h).toFixed(1), waistMove: +dist(at(0.08).w, at(0).w).toFixed(1),
             headPeak: (() => { let pk = 0; for (let i = 0; i <= Math.round(0.08 * last); i++)
               pk = Math.max(pk, dist(F[i].h, F[0].h)); return +pk.toFixed(1); })(),
             kneePeak: +kmax.toFixed(0),
             kneeEnd: +ang(at(0.45).w, at(0.45).k, at(0.45).f).toFixed(0),
             bodyDrop: +bd.toFixed(1), handDrop: +hdp.toFixed(1),
             handLag: +(bd ? ((bd - hdp) / bd * 100) : 0).toFixed(0),
             armIn: +(dist(at(0.72).hd, at(0.72).sh) - dist(at(1).hd, at(1).sh)).toFixed(1) };
    HS.manual = false;
    }
    return { facings: perFacing, S: perFacing.S, DIRS,
             hsFall: (typeof HS_FALL !== 'undefined') ? HS_FALL : null };
  });

  const F = R.facings, D = R.DIRS;
  const all = k => D.map(d => F[d][k]);

  ok('HS_FALL is the measurement, not a guess: the fall settles at frame ' + R.S.settle +
     ' (' + R.S.fallSec + 's) and HS_FALL is ' + R.hsFall + ' (drift ceiling 0.4s)',
     R.hsFall !== null && Math.abs(R.hsFall - R.S.fallSec) <= 0.4);

  /* THE CLAIM THAT CATCHES THE GAP ITSELF. A beat measured on one facing is not
     measured. If this ever drops back to a single reset, this goes red. */
  ok('every beat is measured on ALL EIGHT facings, not just the one this gate used to read (' +
     D.length + ' swept)', D.length === 8 && D.every(d => F[d] && typeof F[d].armIn === 'number'));

  /* AND THE SWEEP IS A REAL SWEEP. The first cut of it reset to each facing and
     then posed a HARDCODED 'S'; hsPose re-resets whenever the key differs, so all
     eight rows came back byte-identical and the gate happily called that eight
     facings. A count of facings is not a sweep. Distinct results are. */
  const distinct = new Set(D.map(d => F[d].kneePeak + '|' + F[d].armIn + '|' + F[d].handLag)).size;
  ok('and the eight are genuinely eight DIFFERENT runs, not one run read eight times (' +
     distinct + ' distinct results, needs more than 1)', distinct > 1);

  /* BEAT FOUR LANDS ON S AND THAT IS ALL IT EVER MEANT. Shipped 9/13 as
     "BEAT FOUR LANDS" off a single hsReset('S'); swept, it is 16.8 on S and about
     -0.9 on the other seven. The claim keeps S as its floor, because that is what
     was actually built and verified, and it now NAMES the other seven instead of
     covering them. */
  const armFacings = D.filter(d => F[d].armIn >= 12);
  ok('BEAT FOUR LANDS ON S: between ' + wLast[0] + ' and ' + wLast[1] + ' of the fall the hand closes ' +
     R.S.armIn + 'px toward the chest (floor 12; it was 5.1 before). It holds on ' +
     armFacings.length + ' of 8 facings: ' + (armFacings.join(' ') || 'none'),
     R.S.armIn >= 12);

  /* BEAT ONE LANDS TOO, and it is measured at the PEAK because the old ruler here
     could not see it. The ruler was at(0.08) minus at(0) -- two ENDPOINTS -- and a
     snap that whips and returns to glued is invisible between them. It reported
     "not built" for every amplitude including the ones that obviously worked. The
     snap is owned by gates/the_head_snaps_back_gate.js; this is the beat's own row
     so the four are scored in one place. */
  const snapFacings = D.filter(d => F[d].headPeak >= F[d].waistMove * 1.5);
  ok('BEAT ONE LANDS ON ALL EIGHT: inside ' + wSnap[0] + ' to ' + wSnap[1] + ' of the fall the head ' +
     'peaks past 1.5x the waist on ' + snapFacings.length + ' of 8 facings (S reads ' + R.S.headPeak +
     'px against ' + R.S.waistMove + 'px; it was 5.1 against 4.1, which leads rather than snaps)',
     snapFacings.length === 8);

  /* WHAT IS NOT BUILT IS PRINTED, NOT HIDDEN. Three of his four beats are still
     not met and the clip must not read as finished because a gate went green. */
  console.log('');
  console.log('  EVERY BEAT, EVERY FACING, because one facing is not a measurement:');
  console.log('    dir | b1 head/waist | b2 knee peak -> end | b3 body/hand (lag%) | b4 arms in');
  for (const d of D) { const f = F[d];
    console.log('    ' + d.padStart(3) + ' | ' + (f.headPeak + '/' + f.waistMove).padStart(13) +
      ' | ' + (f.kneePeak + ' -> ' + f.kneeEnd).padStart(19) +
      ' | ' + (f.bodyDrop + '/' + f.handDrop + ' (' + f.handLag + '%)').padStart(19) +
      ' | ' + String(f.armIn).padStart(10)); }
  const lags = all('handLag'), k2 = all('kneePeak'), a4 = all('armIn');
  console.log('');
  console.log('  NOT BUILT, and named so the clip is not read as finished:');
  console.log('    beat 2 knees fold   : peak ranges ' + Math.min.apply(null, k2) + ' to ' +
              Math.max.apply(null, k2) + ' degrees across the eight, and straightens again on six of them');
  console.log('    beat 3 arms hold up : the hand lags the body by ' + Math.min.apply(null, lags) +
              '% to ' + Math.max.apply(null, lags) + '% depending only on which way he was knocked');
  console.log('    beat 4 arms come in : ' + R.S.armIn + 'px on S and ' +
              a4.filter(v => v < 12).length + ' of 8 facings under the floor');
  console.log('');
  console.log('  TWO CAUSES WERE PROPOSED FOR BEAT THREE THIS ROUND AND BOTH ARE DEAD, MEASURED:');
  console.log('    a bone collapsing under the RIGID LIMB LAW -- no bone goes below 60% of rest,');
  console.log('      0 of 26,880 bone-frames under a quarter, so there is no near-zero vector to blame;');
  console.log('    the knock projection turning a backward lag into screen-down -- the sim backward');
  console.log('      lag is 2.7px at most and its screen term is 0.1px, and the two-term split misses');
  console.log('      the real motion by 31.6px, because the rigid limb law and the camera both run after it.');
  console.log('    The arm\'s inertia IS real in the sim (the hand drops 7.6px where the shoulder drops 19),');
  console.log('    so beat three is a DELIVERY problem, not a missing mechanism, and its cause is still open.');

  await br.close();
  done();
})().catch(e => { console.log('  FAIL gate threw: ' + e.message); fail++; done(); });
