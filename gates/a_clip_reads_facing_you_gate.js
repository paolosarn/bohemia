#!/usr/bin/env node
/* A CLIP THAT BENDS FORWARD DIES FACING THE CAMERA.

   FOUND 9/24 while cooking the two clips Paolo never judged (row [judge two]).
   Before putting them in front of him I LOOKED at them, which is the one thing
   the hand-at-face graveyard says this lane failed to do, and facing the camera
   neither clip did anything at all.

   THE CAUSE IS ONE LINE OF THE RIG: `spF` is the spine-forward sign and it is
   defined as ZERO on N and S. So every term written spF(d)*x vanishes on the two
   facings the player looks at most, and a clip whose whole idea is a forward bend
   is left with whatever else it happened to say.

   MEASURED ON THE DRAWN PICTURE, worst key of the bar against the clip's own rest
   frame -- pixels changed as a share of the body, and how far the drawn body's
   centre of mass travels:
                     side (E)              facing you (S)
     pickup          126% / 10.37 px       36% / 0.87 px
     laugh            28% /  1.28 px       10% / 1.00 px
   A man picking something up, facing you, moved less than one pixel.

   THE FIX PATTERN WAS ALREADY IN THE FILE. nod, drunk and the gaits all branch on
   headOn(d) and say the motion a different way. So this is that pattern applied,
   not invented: facing you a squat is spent where it shows (the body drops, the
   legs fold, the arms and head go with them) and a laugh becomes a bounce and a
   shoulder shake.

   THE OTHER FORTY-ODD CLIPS WITH THIS HOLE ARE PRINTED, NOT CHASED. Two clips
   were on the board; quietly rewriting forty is how a lane ships forty untested
   changes.                                                    ANIMATION 9/24  */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');
const VOTE = path.join(ROOT, 'slices', 'vote', 'ANIMATION_FACING_YOU_HE_DID_NOTHING.html');
const { settle: SETTLE } = require(path.join(ROOT, 'gates', 'bohemia_settle.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? (pass++, console.log('  ok   ' + n)) : (fail++, console.log('  FAIL ' + n)); };
const done = () => { console.log('\nA CLIP READS FACING YOU GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0); };

if (!fs.existsSync(ALPHA)) { console.log('  FAIL missing ' + ALPHA); fail++; done(); }

ok('the item he is asked about PLAYS, on the beat, and carries no control of its own',
   fs.existsSync(VOTE) && (() => { const v = fs.readFileSync(VOTE, 'utf8');
     return /requestAnimationFrame/.test(v) && /performance\.now\(\)/.test(v)
         && /backgroundPosition/.test(v)
         && !/<button|<input|<select|<form|onclick=/i.test(v); })());

/* THE FLOORS ARE THE MEASUREMENT. pickup went 0.87 -> 5.52 px and laugh
   1.00 -> 4.22, so they are held just under what shipped and can only rise. */
const PICKUP_CM_MIN = 5.0, LAUGH_CM_MIN = 4.0;
/* THE PIXEL FLOORS ARE PER CLIP, and mutation is why: a single floor of 35 sat
   BELOW what the broken pickup already scored (36.4%), so removing the fix left
   that claim green. A floor under the bug is not a floor. */
const PICKUP_PCT_MIN = 55, LAUGH_PCT_MIN = 32;

(async () => {
  const { chromium } = require('/opt/node22/lib/node_modules/playwright');
  const br = await chromium.launch();
  const pg = await br.newPage();
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + ALPHA, { waitUntil: 'load' });
  await SETTLE(pg, 2400);

  const R = await pg.evaluate(() => {
    const K = (typeof POSEHOLD === 'object' && POSEHOLD && POSEHOLD.keys) ? POSEHOLD.keys : 12;
    const clips = (typeof CLIPS !== 'undefined' && CLIPS.length) ? CLIPS.slice() : Object.keys(POSE);
    /* ASKED OF THE DRAWN FRAME, never of a joint: this lane has been lied to twice
       by a joint ruler and the picture caught it both times. */
    function read(c, d) {
      const gs = [];
      for (let i = 0; i < K; i++) { try { gs.push(buildFrame(d, c, i / K)); } catch (e) {} }
      if (gs.length < 2) return null;
      const CW = gs[0].CW, CH = gs[0].CH, base = gs[0].grid;
      let body = 0; for (let k = 0; k < base.length; k++) if (base[k]) body++;
      if (!body) return null;
      const cm = gs.map(g => { let n = 0, sx = 0, sy = 0;
        for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) if (g.grid[y * CW + x]) { n++; sx += x; sy += y; }
        return n ? [sx / n, sy / n] : null; });
      let pct = 0, cmMax = 0;
      for (let i = 1; i < gs.length; i++) {
        let diff = 0; const g = gs[i].grid;
        for (let k = 0; k < base.length; k++) if (base[k] !== g[k]) diff++;
        if (diff / body > pct) pct = diff / body;
        if (cm[0] && cm[i]) { const dd = Math.hypot(cm[i][0] - cm[0][0], cm[i][1] - cm[0][1]);
          if (dd > cmMax) cmMax = dd; }
      }
      return { pct: +(pct * 100).toFixed(1), cm: +cmMax.toFixed(2) };
    }
    const two = {};
    for (const c of ['pickup', 'laugh']) two[c] = { S: read(c, 'S'), N: read(c, 'N'), E: read(c, 'E') };

    /* THE REST OF THE HOLE, counted rather than claimed: clips that move properly
       from the side and barely at all facing you. */
    const still = [];
    for (const c of clips) {
      const S = read(c, 'S'), E = read(c, 'E');
      if (!S || !E) continue;
      /* CENTRE OF MASS ALONE OVER-REPORTS A GAIT: a man walking on the spot moves
         his legs and not his middle, so the pixel share has to agree before a clip
         is named. */
      if (E.cm >= 3 && S.cm < 1.5 && S.pct < 45)
        still.push(c + ' ' + E.cm + '/' + S.cm + 'px ' + S.pct + '%');
    }
    /* THE CONTROL: the pattern this fix copies is already in the file, so a build
       where headOn branches do nothing would take nod down with it. */
    const nod = read('nod', 'S');
    return { K, two, still, nod, clips: clips.length };
  });

  ok('the alpha loads with no page error (' + (errs.length ? errs[0] : 'none') + ')', errs.length === 0);

  const p = R.two.pickup, l = R.two.laugh;
  ok('PICKING SOMETHING UP, FACING YOU: the drawn body moves ' + p.S.cm + 'px ' +
     '(floor ' + PICKUP_CM_MIN + '; it was 0.87, and 10.37 from the side)', p.S.cm >= PICKUP_CM_MIN);
  ok('  and it changes ' + p.S.pct + '% of his pixels (floor ' + PICKUP_PCT_MIN + '; it was 36.4)',
     p.S.pct >= PICKUP_PCT_MIN);
  ok('LAUGHING, FACING YOU: the drawn body moves ' + l.S.cm + 'px ' +
     '(floor ' + LAUGH_CM_MIN + '; it was 1.00)', l.S.cm >= LAUGH_CM_MIN);
  ok('  and it changes ' + l.S.pct + '% of his pixels (floor ' + LAUGH_PCT_MIN + '; it was 10.3)',
     l.S.pct >= LAUGH_PCT_MIN);

  /* BOTH HEAD-ON FACINGS, because a fix wired to one of N and S is the bug this
     lane shipped on the turn (one of seven places) written again. */
  ok('BOTH facings the player looks at are fixed, not just the one I measured: ' +
     'N moves ' + p.N.cm + 'px and ' + l.N.cm + 'px',
     p.N.cm >= PICKUP_CM_MIN - 0.8 && l.N.cm >= LAUGH_CM_MIN - 0.8);

  /* THE SIDE VIEWS ARE UNTOUCHED. A "fix" that traded one facing for another
     would pass every claim above. */
  ok('and the side views are NOT traded away: pickup ' + p.E.cm + 'px, laugh ' + l.E.cm + 'px',
     p.E.cm >= 9 && l.E.cm >= 1.1);

  ok('CONTROL: the headOn pattern this copies is alive elsewhere in the file ' +
     '(nod still reads ' + R.nod.cm + 'px facing you)', R.nod.cm >= 1.5);

  console.log('\n  THE SAME HOLE, STILL OPEN, named so this is not read as finished:');
  console.log('    ' + R.still.length + ' of ' + R.clips + ' clips move well from the side and barely at all');
  console.log('    facing you, printed as side/front travel and the share of pixels the front view changes.');
  console.log('    ' + R.still.slice(0, 12).join(' | '));
  console.log('    Two were on the board. Rewriting the rest quietly is forty untested changes.');
  await br.close();
  done();
})().catch(e => { console.log('  FAIL ' + e.message); fail++; done(); });
