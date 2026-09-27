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
   A HYPOTHESIS THAT MEASURES THE SAME IS NOT A FIX.       ANIMATION 9/27  */
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

(async () => {
  const { chromium } = require('/opt/node22/lib/node_modules/playwright');
  const br = await chromium.launch();
  const pg = await br.newPage();
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + ALPHA, { waitUntil: 'load' });
  await SETTLE(pg, 2400);

  const R = await pg.evaluate((N) => {
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
    return { walk: dupes('walk', N), run: dupes('run', N),
      walk112: dupes('walk', 112), facings: facingDupes(N), shape: shape(N) };
  }, CELL);

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
  await br.close();
  done();
})().catch(e => { console.log('  FAIL ' + e.message); fail++; done(); });
