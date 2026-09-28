#!/usr/bin/env node
/* THE WALK HAS FOUR PICTURES, AND IT SURVIVES THE CUT TO ONE CELL.

   RULE 34, PAOLO 9/27, LOCKED (TWO SCALES, ONE GAME): the walked person is ONE
   CELL, about 28 px, one cell per step; THE STEP IS A HOUSE is dead; the 112 art
   is the SOURCE, not the product. This lane's first line is the clips at that
   size.

   THE QUESTION THAT HAD TO BE ANSWERED BEFORE ANY OF IT: cut 112 down to 28, is
   there still an animation in there? Measured at 112, 56 (what ships to the
   street today) and 28, with the game's own nearest-neighbour cut:
     eight facings stay eight different pictures   0 identical pairs of 28
     the body                                      98 -> 49 -> 24 rows,
                                                   2732 -> 680 -> 168 lit pixels
     lonely pixels (lit, 0 or 1 lit neighbours)    ZERO at 28
   THE CUT SURVIVES. Nothing new had to be drawn.

   *** AND IT FOUND A DEFECT THAT WAS THERE AT EVERY SIZE. ***
   The lateral walk is driven entirely by s = sin(ph*2pi), and sin is ZERO at
   ph 0 AND at ph 0.5, so those two keys came out BYTE-IDENTICAL on all six side
   facings: 6 of 48 pairs, the same 6 at 112, at 56 and at 28, so it was never
   the cut. THE SIDE WALK HAD THREE PICTURES, NOT FOUR, and run had it too.

   A real walk's two crossings are not the same: on one the left leg is passing
   forward, on the other the right is. What tells them apart is the DIRECTION of
   travel, cos, which is +1 at ph 0 and -1 at ph 0.5, and the passing foot CLEARS
   THE GROUND. That lift is the fourth picture, and it is anatomy.

   AND ONE THING I MEASURED AND DID NOT BUILD: the cut looked speckled to me, so
   I wrote an area-average cut with a palette snap to fix it. The ruler said
   ZERO lonely pixels in BOTH. There was no speckle; the light marks are his
   hands and the coat's highlights, and they are connected. The second cut moved
   105 pixels, added a colour and fixed nothing, so it was deleted.
   A HYPOTHESIS THAT MEASURES THE SAME IS NOT A FIX.       ANIMATION 9/27

   *** ROUND TWO, 9/27: THE SAME DEFECT WAS IN SIX MORE GAITS, AND FOUR OF THEM
   WERE DEAD ON ALL EIGHT FACINGS. *** Every gait in the file is built from the
   same sine, so the question round one answered for walk and run was asked of the
   other nine. Measured on the drawn pixels, the two crossings byte-identical:
     tired-walk 8/8 facings   swagger 8/8   gun-walk 8/8   sneak 7/8
     wander     5/8           push    4/8
     (drunk, flee-sprint and flee-scramble were already clean: each carries a
      second clock at a different frequency, which is what saved them)
   Forty of forty-eight. The same passing-foot fix, with a clearance PER GAIT
   because they are different walks: a crouch and a shove keep the foot low (0.3
   of the swing), an ordinary stroll lifts it (0.5), a swagger is meant to be seen
   (0.65), a careful advance behind a pistol is between (0.4).
   AND THE HEAD-ON BRANCH HAD IT TOO, at the source: nsGait is a pure function of
   s, so every gait that goes through it drew one picture at both crossings. Head-
   on a passing leg reads as the knee coming at the camera, which is what
   legCompress already draws.
   THE HEAD-ON AMPLITUDE IS THE COAT'S CEILING, NOT A TASTE: 0.13 took the coat
   gate from 12.1% to 25.7% of its own area in one frame against a 22% ceiling --
   red, and mine. Swept 0.13/0.09/0.06/0.04 -> 25.7/18.6/18.6/18.6, so 0.09 is the
   largest value the coat does not notice at all. A squared bell was tried first on
   the theory that the kink was the pop; it made the pop WORSE (30.3), because
   narrowing a bell steepens its flanks. Measured, and thrown away.
   AND THE CUT TOOK NOTHING: for all eleven gaits the picture count at 28 is
   EXACTLY the count at 112, which is round one's conclusion again with eleven
   clips instead of two.                                    ANIMATION 9/27  */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');
const LAW = path.join(ROOT, 'laws', 'BOHEMIA_LAW_TWO_SCALES_ONE_GAME_9_27_26.md');
const VOTE = path.join(ROOT, 'slices', 'vote', 'ANIMATION_ONE_CELL.html');
const { settle: SETTLE } = require(path.join(ROOT, 'gates', 'bohemia_settle.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? (pass++, console.log('  ok   ' + n)) : (fail++, console.log('  FAIL ' + n)); };
const done = () => { console.log('\nTHE WALK HAS FOUR PICTURES AT ONE CELL GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0); };

ok('his ruling is in the repo, so the size this answers can be read',
   fs.existsSync(LAW) && /ONE CELL/.test(fs.readFileSync(LAW, 'utf8')));
ok('the item PLAYS on a real clock and carries no control of its own',
   fs.existsSync(VOTE) && (() => { const v = fs.readFileSync(VOTE, 'utf8');
     return /requestAnimationFrame/.test(v) && /performance\.now\(\)/.test(v)
         && !/<button|<input|<select|<form|onclick=/i.test(v); })());

const CELL = 28;

/* EVERY GAIT, AND THE NUMBERS ARE THE MEASUREMENT, NOT A TASTE.
   was    : facings of 8 whose two crossings were byte-identical before the fix
   pics   : distinct drawn pictures on the WORST facing, of 24 buckets (floor)
   seen   : share of the body that differs between the two crossings at ONE CELL,
            worst facing (floor). It was 0.0% for every clip in the `was` column,
            so any positive floor bites -- these are set one point under what the
            fix measures so a later drift is caught too, not just a removal. */
const GAITS = {
  walk:          { was: 0, pics: 8, seen: 13 },
  run:           { was: 0, pics: 8, seen: 16 },
  sneak:         { was: 7, pics: 8, seen:  4 },
  'tired-walk':  { was: 8, pics: 8, seen:  6 },
  wander:        { was: 5, pics: 8, seen:  7 },
  swagger:       { was: 8, pics: 8, seen: 12 },
  push:          { was: 4, pics: 8, seen:  4 },
  'gun-walk':    { was: 8, pics: 8, seen: 10 },
  /* THE THREE THAT WERE ALREADY CLEAN ARE IN THE TABLE ON PURPOSE. They are the
     control on the fix: a change that dragged them down would show here. */
  drunk:         { was: 0, pics: 9, seen: 10 },
  'flee-sprint': { was: 0, pics: 8, seen:  4 },
  'flee-scramble': { was: 0, pics: 8, seen: 4 },
};

(async () => {
  const { chromium } = require('/opt/node22/lib/node_modules/playwright');
  const br = await chromium.launch();
  const pg = await br.newPage();
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + ALPHA, { waitUntil: 'load' });
  await SETTLE(pg, 2400);

  const R = await pg.evaluate(([N, GAITS]) => {
    const DIRS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'], PH = [0, 0.25, 0.5, 0.75];
    /* THE GAME'S OWN CUT, not a prettier one: every Nth pixel, which is what
       _rgbaHalf does to reach the street today. */
    function cut(f, n) {
      const out = new Uint8Array(n * n * 4), sx = f.CW / n, sy = f.CH / n;
      for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
        const px = f.px[((y * sy) | 0) * f.CW + ((x * sx) | 0)], o = (y * n + x) * 4;
        if (px) { out[o] = px[0]; out[o + 1] = px[1]; out[o + 2] = px[2]; out[o + 3] = 255; }
      }
      return out;
    }
    const same = (a, b) => { for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false; return true; };
    function dupes(clip, n) {
      const bad = [];
      for (const d of DIRS) {
        const fr = PH.map(ph => cut(buildFrame(d, clip, ph), n));
        for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++)
          if (same(fr[i], fr[j])) bad.push(d + ' ' + PH[i] + '=' + PH[j]);
      }
      return bad;
    }
    function facingDupes(n) {
      const bad = [], fr = DIRS.map(d => cut(buildFrame(d, 'idle', 0), n));
      for (let i = 0; i < 8; i++) for (let j = i + 1; j < 8; j++)
        if (same(fr[i], fr[j])) bad.push(DIRS[i] + '=' + DIRS[j]);
      return bad;
    }
    function shape(n) {
      let lit = 0, lone = 0, rows = 0, cols = new Set();
      const a = cut(buildFrame('S', 'walk', 0), n);
      for (let y = 0; y < n; y++) { let any = false;
        for (let x = 0; x < n; x++) {
          if (!a[(y * n + x) * 4 + 3]) continue;
          any = true; lit++; cols.add((a[(y*n+x)*4] << 16) | (a[(y*n+x)*4+1] << 8) | a[(y*n+x)*4+2]);
          let nb = 0;
          for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
            if (!dx && !dy) continue; const nx = x + dx, ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= n || ny >= n) continue;
            if (a[(ny * n + nx) * 4 + 3]) nb++;
          }
          if (nb <= 1) lone++;
        }
        if (any) rows++;
      }
      return { lit, lone, rows, colours: cols.size };
    }
    /* THE CONTROL. A cut that produced an EMPTY frame would score zero duplicate
       pairs and zero lonely pixels and pass everything by drawing nothing. */
    /* ROUND TWO. Every gait, on the grid the game actually draws: all 24 phase
       buckets, grouped byte for byte, at one cell and at the source. */
    function gaitRead(names, n) {
      const B = FRAME_CACHE.buckets, o = {};
      function sig(a){let h=0x811c9dc5;for(let i=0;i<a.length;i++)h=((h^a[i])*16777619)>>>0;return h;}
      function pctDiff(a,b){let d=0,lit=0;
        for(let i=3;i<a.length;i+=4){ if(a[i]||b[i]) lit++;
          if(a[i]!==b[i]||a[i-3]!==b[i-3]||a[i-2]!==b[i-2]||a[i-1]!==b[i-1]) d++; }
        return lit ? 100*d/lit : 0; }
      for (const c of names) {
        if (!POSE[c]) { o[c] = { missing: true }; continue; }
        const cross = [], pics = [], pics112 = [], seen = [];
        for (const d of DIRS) {
          const a = cut(buildFrame(d, c, 0), 112), b = cut(buildFrame(d, c, 0.5), 112);
          if (same(a, b)) cross.push(d);
          const s1 = new Set(), s2 = new Set();
          for (let q = 0; q < B; q++) { const f = buildFrame(d, c, (q + 0.5) / B);
            s1.add(sig(cut(f, n))); s2.add(sig(cut(f, 112))); }
          pics.push(s1.size); pics112.push(s2.size);
          seen.push(+pctDiff(cut(buildFrame(d, c, 0), n), cut(buildFrame(d, c, 0.5), n)).toFixed(1));
        }
        o[c] = { cross, pics: Math.min(...pics), pics112: Math.min(...pics112),
                 sameCount: pics.join('') === pics112.join(''), seen: Math.min(...seen) };
      }
      return o;
    }
    return { walk: dupes('walk', N), run: dupes('run', N),
      walk112: dupes('walk', 112), facings: facingDupes(N), shape: shape(N),
      gaits: gaitRead(GAITS, N) };
  }, [CELL, Object.keys(GAITS)]);

  ok('the alpha loads with no page error (' + (errs.length ? errs[0] : 'none') + ')', errs.length === 0);
  ok('CONTROL: the cut draws a real body at one cell, not an empty box (' +
     R.shape.lit + ' lit pixels over ' + R.shape.rows + ' rows, ' + R.shape.colours +
     ' colours)', R.shape.lit > 90 && R.shape.rows > 15);

  ok('THE WALK HAS FOUR PICTURES AT ONE CELL on every facing (' +
     (R.walk.length ? R.walk.join(', ') : 'no duplicate keys') + '; it was 6 of 48)',
     R.walk.length === 0);
  /* AND AT THE SOURCE SIZE TOO, because the defect was never the cut and a fix
     that only held at 28 would be a fix in the wrong place. */
  ok('  and at the source size as well (' + (R.walk112.length || 'none') + ' duplicates at 112)',
     R.walk112.length === 0);
  ok('RUN TOO, which had the same collapse (' +
     (R.run.length ? R.run.join(', ') : 'no duplicate keys') + ')', R.run.length === 0);

  ok('the eight facings are still eight different pictures at one cell (' +
     (R.facings.length || 'none') + ' identical)', R.facings.length === 0);
  ok('and nothing turned to mush: ' + R.shape.lone + ' lonely pixels (lit, with one ' +
     'neighbour or none)', R.shape.lone === 0);

  /* ROUND TWO: EVERY GAIT, THREE CLAIMS EACH, ON ONE LINE EACH. */
  const miss = Object.keys(GAITS).filter(c => R.gaits[c] && R.gaits[c].missing);
  ok('every gait in the table is a clip in the file (' + (miss.join(', ') || 'all present') + ')',
     miss.length === 0);

  const stillSame = [], thinBar = [], invisible = [], cutLost = [];
  for (const [c, want] of Object.entries(GAITS)) {
    const g = R.gaits[c]; if (!g || g.missing) continue;
    if (g.cross.length) stillSame.push(c + ' [' + g.cross.join(' ') + '], was ' + want.was + '/8');
    if (g.pics112 < want.pics) thinBar.push(c + ' ' + g.pics112 + ' < ' + want.pics);
    if (g.seen < want.seen) invisible.push(c + ' ' + g.seen + '% < ' + want.seen + '%');
    if (!g.sameCount) cutLost.push(c);
  }
  ok('THE TWO LEG CROSSINGS ARE TWO PICTURES, IN EVERY GAIT, ON ALL EIGHT FACINGS (' +
     (stillSame.join(' | ') || 'none collapsed; it was 40 of 48') + ')', stillSame.length === 0);
  ok('AND YOU CAN SEE IT AT ONE CELL, not just measure it (' +
     (invisible.join(' | ') || 'every gait over its floor; it was 0.0% for all of them') + ')',
     invisible.length === 0);
  ok('no gait lost pictures out of its bar (' + (thinBar.join(' | ') || 'all at or over floor') + ')',
     thinBar.length === 0);
  /* THE CUT IS NOT THE DEFECT, MEASURED ELEVEN MORE TIMES: if one cell showed a
     different count from the source, the cut would be losing pictures. */
  ok('THE CUT TO ONE CELL LOSES NO PICTURE: the count at 28 equals the count at 112, ' +
     'facing for facing, for every gait (' + (cutLost.join(', ') || 'all eleven agree') + ')',
     cutLost.length === 0);
  for (const [c, w] of Object.entries(GAITS)) { const g = R.gaits[c]; if (!g || g.missing) continue;
    console.log('       ' + c.padEnd(15) + 'crossings ' + (g.cross.length ? g.cross.length + '/8 SAME' : 'both drawn') +
      '  was ' + w.was + '/8   pictures ' + g.pics112 + ' (floor ' + w.pics + ')   ' +
      'crossings differ by ' + g.seen + '% of the body at one cell (floor ' + w.seen + '%)'); }
  await br.close();
  done();
})().catch(e => { console.log('  FAIL ' + e.message); fail++; done(); });
