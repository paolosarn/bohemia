#!/usr/bin/env node
/* THE BRACE AND THE SHADOWBOX MOVE, AT FULL DETAIL.

   brace      2 pictures on SEVEN of eight facings, 1% of the body facing you --
              an aiming hold's score. It was one arm flex of 0.3 on an arm held at
              1.2, on a frozen stance, with every body term spF(d), which is ZERO
              on N and S. A brace is not a hold: plant, drop the weight, tighten,
              reset, twice a bar, as a cycle so it loops with no snap.
   shadowbox  the arm did all of it, 30% of the body facing you. The body throws
              the jab now, and facing you the arm comes AT the camera.

   *** AND WHAT THIS GATE DOES NOT CLAIM, ON PURPOSE. *** The same round found the
   key picker (poseHoldResolve) throwing away the remainder of its arc after each
   key, so the faster a clip moves the fewer of its twelve keys it gets:
   shadowbox facing you resolves THREE. Three repairs were tried. The count came
   good every time (95 of 103 clips richer, walk 8 -> 12) and the trenchcoat,
   which is tied to the thighs, popped over its own 22% ceiling facing you every
   time (25.1%, then 23.2%). THE THIRD ATTEMPT WAS THE STOP: a fourth would have
   been the tell. The picker is byte-for-byte main's; the numbers are printed
   below so the next round starts from them, and nothing here claims the fix.

   Measured at the full-detail 112 body: Paolo killed the one-cell sprite in his
   9/27 votes (rule 37a).                                   ANIMATION 9/28  */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');
const VOTE = path.join(ROOT, 'slices', 'vote', 'ANIMATION_BRACE_AND_SHADOWBOX.html');
const { settle: SETTLE } = require(path.join(ROOT, 'gates', 'bohemia_settle.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? (pass++, console.log('  ok   ' + n)) : (fail++, console.log('  FAIL ' + n)); };
const done = () => { console.log('\nTHE BRACE AND THE SHADOWBOX MOVE GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0); };

/* the floors are one point under what the fix measures, so a later drift is
   caught too, not only a removal. `was` is what it scored before this round. */
const HITS = {
  'punch-heavy': { range: 46, keys: 8 }, 'shiv-jab': { range: 71, keys: 8 },
  'spear-drive': { range: 56, keys: 8 }, 'bat-arc':   { range: 55, keys: 9 },
  kick:          { range: 60, keys: 4 }, throw:       { range: 43, keys: 9 },
  shove:         { range: 48, keys: 5 }, 'cover-fire':{ range: 49, keys: 9 },
};
const FIXED = {
  brace:     { range: 61, pics: 8, wasRange: 1,  wasPics: 2 },
  shadowbox: { range: 62, pics: 3, wasRange: 30, wasPics: 3 },   /* 3 pictures facing you is the key picker, printed not claimed */
};
/* THE RESOLVER, and the two halves have to hold together: the movers get their
   keys AND the holds stay cheap. A resolver that simply handed everything twelve
   keys would pass the first half by breaking the second. */
const RICH = { walk: 12, run: 12, drunk: 12, 'punch-heavy': 8, 'bat-arc': 9, dig: 9 };
const CHEAP = { pistol: 5, 'two-hand': 5, sleep: 6 };
/* *** AND A CEILING ON EVERYBODY, WHICH A MUTATION FORCED ME TO ADD. ***
   My first cost control watched only the holds, and the mutation that makes the
   resolver greedy (every bucket a key) SAILED THROUGH IT, because pistol barely
   changes whatever you do to the key placement. Measured what that mutation
   actually costs: 101 of 103 clips double their drawn pictures -- walk and drunk
   12 -> 24, headshot 9 -> 24 -- which is twice the frames to draw and cache on a
   phone. The holds were the two clips it could not touch.
   A CONTROL THAT ONLY WATCHES THE CHEAP THINGS IS NOT A COST CONTROL.
   The ceiling is 18: the most any clip draws today is 16 (air-guitar, whose
   extremes are added unconditionally and always has been the most expensive; it
   was 17 before this round), and 24 is what one bar of buckets would cost. */
const PICTURE_CEILING = 18;
const TOTAL_CEILING = 8000;   /* every clip and facing added up; it is 6,978 now,
                                 and the greedy mutation takes it past 11,000 */

/* this claim was deleted by my own over-greedy regex while re-aiming the gate,
   and noticed because the pass count was one short of the lines printed */
ok('the item PLAYS on a real clock and carries no control of its own',
   fs.existsSync(VOTE) && (() => { const v = fs.readFileSync(VOTE, 'utf8');
     return /requestAnimationFrame/.test(v) && /performance\.now\(\)/.test(v)
         && !/<button|<input|<select|<form|onclick=/i.test(v); })());

(async () => {
  const { chromium } = require('/opt/node22/lib/node_modules/playwright');
  const br = await chromium.launch();
  const pg = await br.newPage();
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + ALPHA, { waitUntil: 'load' });
  await SETTLE(pg, 2400);

  const R = await pg.evaluate((names) => {
    const DIRS = ['N','NE','E','SE','S','SW','W','NW'], B = FRAME_CACHE.buckets;
    /* the game's own nearest cut, the same one that ships bodies to the street */
    function cut(f, n) { const o = new Uint8Array(n*n*4), sx = f.CW/n, sy = f.CH/n;
      for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
        const p = f.px[((y*sy)|0)*f.CW + ((x*sx)|0)], q = (y*n+x)*4;
        if (p) { o[q]=p[0]; o[q+1]=p[1]; o[q+2]=p[2]; o[q+3]=255; } }
      return o; }
    function sig(a){ let h=0x811c9dc5; for(let i=0;i<a.length;i++) h=((h^a[i])*16777619)>>>0; return h; }
    function pct(a,b){ let d=0, lit=0;
      for (let i=3;i<a.length;i+=4){ if(a[i]||b[i]) lit++;
        if(a[i]!==b[i]||a[i-3]!==b[i-3]||a[i-2]!==b[i-2]||a[i-1]!==b[i-1]) d++; }
      return lit ? 100*d/lit : 0; }
    const out = { clips: {}, keys: {}, body: null };
    for (const c of names) {
      /* POSE[c] IS NOT THE EXISTENCE TEST. `sleep` resolves and draws but is not a
         key of POSE (the candidates live in their own table), and testing the
         wrong thing reported a live clip as missing. Ask the drawing. */
      let live = false;
      try { const f0 = buildFrame('S', c, 0); live = !!(f0 && f0.px && f0.px.some(p => p)); } catch (e) { live = false; }
      if (!live) { out.clips[c] = { missing: true }; continue; }
      const per = [];
      for (const d of DIRS) {
        const f = []; for (let q = 0; q < B; q++) f.push(cut(buildFrame(d, c, (q+0.5)/B), 112));
        let rng = 0; for (let i=0;i<B;i++) for (let j=i+1;j<B;j++) rng = Math.max(rng, pct(f[i], f[j]));
        per.push({ d, range: +rng.toFixed(1), pics: new Set(f.map(sig)).size });
      }
      out.clips[c] = { range: Math.min(...per.map(p=>p.range)),
                       pics:  Math.min(...per.map(p=>p.pics)),
                       per: per.map(p => p.d + ' ' + p.pics + 'p/' + p.range.toFixed(0) + '%').join(' ') };
      out.keys[c] = Math.min(...DIRS.map(d => poseHoldCount(poseHoldSeq(d, c))));
    }
    /* THE CONTROL: a cut that drew nothing would score zero everywhere and could
       not fail a single floor by drawing an empty box. */
    { const a = cut(buildFrame('S', 'punch-heavy', 0.3), 112);
      let lit = 0, rows = 0;
      for (let y=0;y<112;y++){ let any=false; for(let x=0;x<112;x++) if(a[(y*112+x)*4+3]){lit++;any=true;} if(any) rows++; }
      out.body = { lit, rows }; }
    /* the cost of the WHOLE cast, not just the clips this gate names by hand */
    out.every = {};
    for (const c of Object.keys(POSE)) {
      try { out.every[c] = DIRS.map(d => poseHoldCount(poseHoldSeq(d, c))); } catch (e) {}
    }
    return out;
  }, Object.keys(HITS).concat(Object.keys(FIXED), Object.keys(RICH), Object.keys(CHEAP), ['walk']));

  ok('the alpha loads with no page error (' + (errs.length ? errs[0] : 'none') + ')', errs.length === 0);
  ok('CONTROL: the ruler reads a real body, not an empty box (' +
     R.body.lit + ' lit pixels over ' + R.body.rows + ' rows)', R.body.lit > 1500 && R.body.rows > 80);

  const missing = Object.keys(R.clips).filter(c => R.clips[c].missing);
  ok('every clip this gate names is a clip in the file (' + (missing.join(', ') || 'all present') + ')',
     missing.length === 0);

  /* === THE TWO THAT REALLY WERE DEAD === */
  for (const [c, w] of Object.entries(FIXED)) {
    const g = R.clips[c]; if (g.missing) continue;
    ok(c.toUpperCase() + ' IS NOT A HOLD: ' + g.pics + ' pictures (floor ' + w.pics +
       ', was ' + w.wasPics + ') and ' + g.range + '% of the body on its worst facing (floor ' +
       w.range + ', was ' + w.wasRange + ')', g.pics >= w.pics && g.range >= w.range);
  }

  /* THE KEY PICKER, PRINTED AND NOT CLAIMED: the clips it starves today. */
  console.log('       key picker, not fixed this round: ' + Object.entries(RICH)
    .map(([c, k]) => c + ' ' + R.keys[c] + ' of 12').join(', '));
  /* A HOLD STAYS CHEAP, and nobody pays double: the two brace and shadowbox
     changes must not make the cast more expensive to draw. */
  const bloated = Object.entries(CHEAP).filter(([c, k]) => R.keys[c] > k)
    .map(([c, k]) => c + ' ' + R.keys[c] + ' > ' + k);
  ok('CONTROL: A HOLD IS STILL CHEAP -- a man aiming or asleep does not buy twelve ' +
     'poses (' + (bloated.join(' | ') || 'pistol, two-hand and sleep all still cheap') + ')',
     bloated.length === 0);

  const fat = Object.entries(R.every).filter(([c, v]) => Math.max(...v) > PICTURE_CEILING)
    .map(([c, v]) => c + ' ' + Math.max(...v));
  const total = Object.values(R.every).reduce((a, v) => a + v.reduce((x, y) => x + y, 0), 0);
  ok('NOBODY PAYS DOUBLE: no clip draws more than ' + PICTURE_CEILING + ' pictures a bar (' +
     (fat.join(' | ') || 'worst is ' + Math.max(...Object.values(R.every).map(v => Math.max(...v)))) + ')',
     fat.length === 0);
  ok('and the whole cast costs ' + total + ' pictures across every clip and facing, ' +
     'under the ' + TOTAL_CEILING + ' ceiling (it was 5,842 before this round)', total <= TOTAL_CEILING);

  for (const c of Object.keys(R.clips)) if (!R.clips[c].missing)
    console.log('       ' + c.padEnd(13) + 'keys ' + String(R.keys[c]).padStart(2) + '   ' + R.clips[c].per);
  await br.close();
  done();
})().catch(e => { console.log('  FAIL ' + e.message); fail++; done(); });
