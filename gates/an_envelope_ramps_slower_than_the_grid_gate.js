#!/usr/bin/env node
/* AN ENVELOPE MAY NOT RAMP FASTER THAN THE GAME DRAWS.

   PAOLO 9/21, on the five hand clips (eat, drink, smoke, cough, whistle):
   "it looks like all of them Northeast and south tweaking."

   The round before this one proved it is NOT where the hand is. On south and
   north-east the redone sheets bake BYTE-IDENTICAL to the old ones, so his
   complaint on those two facings was never about placement. It is the MOTION.

   THE DEFECT, NAMED: the body is posed on a grid of POSEHOLD.keys keys a bar --
   twelve. That is the whole budget; nothing between two keys is ever drawn. An
   envelope written as a continuous curve can still move a joint further between
   two of those keys than the eye reads as travel, and when it does, the joint
   does not appear to move, it appears to JUMP, and to jump BACK. That is what
   tweaking is.

   MEASURED over the five clips on his two facings plus east, stepping the 12
   drawn keys and counting a step that goes back the way the last one came
   (direction flipped by more than 120 degrees):
     eat    |sin| = TWO bites a bar, the hand crossing 13 px between two drawn
            keys and reversing at every hump: 3 reversals of 12 on south alone.
     cough  max(0,sin(t*3pi)) sampled at i/12 is 0,1,0,0,0,0 -- THE WHOLE SPASM
            IS ONE KEY WIDE. The head moved 10.44 px on north-east and came back
            inside a single drawing, twice a bar.
   43 reversals over the three facings, 26 of them on the two he named, worst
   single jump 10.44 px, and the cough occupying 2 of the 12 keys.

   SAME FAMILY as the tweeze bug this repo already carries ("sin(2*pi*6*t)
   sampled at t=i/12 is ZERO at every keyframe"). This gate is the machine that
   stops it coming back: A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED.

   *** AND THE LIMIT OF THIS RULER, MEASURED, SO NOBODY GENERALISES IT. ***
   A reversal count CANNOT tell an honest fast shake from an aliased one, and
   that is not a guess. I swept all 105 clips with it, called any (facing,joint)
   pair with 4+ reversals a bar "aliased", and it named 20 clips. Then I slowed
   shiver from FIVE shakes a bar to THREE -- which is strictly better, because
   twelve keys cannot hold five -- and the count went UP, 29 pairs to 53. It has
   to: a clean 3-cycle shake reverses SIX times a bar honestly, while a 5-cycle
   one aliases DOWN to fewer apparent turns. The sweep was thrown away and the
   two clips put back untouched.
   SO THIS GATE IS SCOPED TO THE FIVE HAND CLIPS ON PURPOSE. There the reversals
   came from a double-humped envelope and a one-key impulse, both confirmed IN
   THE DRAWN PICTURE before a line was changed. Widening the scope without a
   picture behind each clip would be the same mistake with a bigger number.
                                                              ANIMATION 9/24  */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');
const RECORD = path.join(ROOT, 'records', 'BOHEMIA_WHAT_TWEAKING_WAS_9_24_26.md');
const GRAVE = path.join(ROOT, 'records', 'BOHEMIA_GRAVEYARD_THE_HAND_AT_THE_FACE_9_24_26.md');
const VOTEDIR = path.join(ROOT, 'slices', 'vote');
const { settle: SETTLE } = require(path.join(ROOT, 'gates', 'bohemia_settle.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? (pass++, console.log('  ok   ' + n)) : (fail++, console.log('  FAIL ' + n)); };
const done = () => { console.log('\nAN ENVELOPE RAMPS SLOWER THAN THE GRID GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0); };

if (!fs.existsSync(ALPHA)) { console.log('  FAIL missing ' + ALPHA); fail++; done(); }
const src = fs.readFileSync(ALPHA, 'utf8');

ok('his words are still in the repo, so the complaint this answers can be read',
   fs.existsSync(RECORD) && /Northeast and south tweaking/i.test(fs.readFileSync(RECORD, 'utf8')));

/* RULE 25: an animation item PLAYS. The page is checked for a real clock and a
   real sheet, not for the word "animation". */
/* *** THIS CLAIM USED TO POINT AT A VOTE PAGE I BUILT AND THEN HAD TO PULL. ***
   I had an item on these same five clips measured and registered when his second
   votes landed and killed the hand at the face a THIRD time. The ruling
   (laws/BOHEMIA_ADDENDUM_THE_SECOND_VOTES_9_24_26.md s7) sends them to the
   graveyard and stops this lane on them for the session, so the item was pulled
   and its files deleted rather than shown to him a fourth time.
   The code fix stays -- it removes a jitter from clips already in his game -- and
   what this gate holds in the item's place is THE RULING ITSELF: the post-mortem
   exists, and no page in the vote folder puts those five clips in front of him
   again. A ruling with no machine behind it is a note. */
ok('the post-mortem the ruling ordered exists and names all three of his verdicts',
   fs.existsSync(GRAVE) && (() => { const g = fs.readFileSync(GRAVE, 'utf8');
     return /Northeast and south tweaking/i.test(g)
         && /glitchy and clipping/i.test(g)
         && /SCRATCHING THE BACK OF HIS HEAD/i.test(g); })());

ok('and no vote page puts the killed hand-at-face clips in front of him again',
   (() => { if (!fs.existsSync(VOTEDIR)) return true;
     const dead = fs.readdirSync(VOTEDIR).filter(f => /^ANIMATION_.*\.html$/.test(f))
       .filter(f => { const v = fs.readFileSync(path.join(VOTEDIR, f), 'utf8');
         /* a page that PLAYS one of the five, rather than one that merely says the
            word: it has to drive a sheet AND name the clip */
         return /requestAnimationFrame/.test(v) && /KILLED/.test(v) === false
             && /(EATING|DRINKING|SMOKING|COUGHING|WHISTLING)/i.test(v); });
     if (dead.length) console.log('       still showing: ' + dead.join(', '));
     return dead.length === 0; })());

/* THE CEILINGS ARE THE MEASUREMENT, not a guess, and they are held at what
   shipped so the number can only fall. HIS TWO FACINGS ARE HELD AT ZERO. */
const REV_NAMED_MAX = 0;    /* south and north-east: was 26 */
const REV_ALL_MAX   = 5;    /* plus east: was 43. Four of the five left are the
                               cough's own duck and return, which is a cough and
                               not a jitter, and the fifth (whistle's far hand
                               breathing) reads the same before and after, so it
                               was never mine to claim. */
const JUMP_MAX      = 7.5;  /* worst travel between two DRAWN keys: was 10.44 px
                               (cough's head on north-east) on a body ~98 rows */
const SPASM_KEYS_MIN = 3;   /* a convulsion has to occupy keys the grid can draw */

(async () => {
  const { chromium } = require('/opt/node22/lib/node_modules/playwright');
  const br = await chromium.launch();
  const pg = await br.newPage();
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + ALPHA, { waitUntil: 'load' });
  await SETTLE(pg, 2400);

  const R = await pg.evaluate(() => {
    const FIVE = ['eat', 'drink', 'smoke', 'cough', 'whistle'];
    const NAMED = ['S', 'NE'], ALL = ['S', 'NE', 'E'];
    const JOINTS = ['handR', 'handL', 'headTop', 'neck', 'waC'];
    /* THE GRID IS READ, NEVER TYPED. If the game ever draws a different number
       of keys a bar this ruler follows it, which is the only way a ceiling
       measured on twelve keys stays honest. */
    const K = (typeof POSEHOLD === 'object' && POSEHOLD && POSEHOLD.keys) ? POSEHOLD.keys : 0;

    /* ONE RULER, used for the real clips and for the control, so a control that
       passes proves the ruler bites rather than proving a second ruler. */
    function walk(sample) {
      let rev = 0, worst = 0, moved = 0, prev = null;
      for (let i = 0; i < K; i++) {
        const a = sample(i), c = sample((i + 1) % K);
        if (!a || !c) { prev = null; continue; }
        const dx = c[0] - a[0], dy = c[1] - a[1], mag = Math.hypot(dx, dy);
        if (mag < 0.15) { prev = null; continue; }
        moved++; if (mag > worst) worst = mag;
        const dir = [dx / mag, dy / mag];
        if (prev && (prev[0] * dir[0] + prev[1] * dir[1]) < -0.5) rev++;
        prev = dir;
      }
      return { rev, worst, moved };
    }
    function score(dirs) {
      let rev = 0, worst = 0; const bad = [];
      for (const c of FIVE) for (const d of dirs) {
        const cache = [];
        for (let i = 0; i < K; i++) { try { cache.push(posedSkel(d, c, i / K).sk); } catch (e) { cache.push(null); } }
        for (const j of JOINTS) {
          if (!cache[0] || !cache[0][j]) continue;
          const r = walk(i => cache[i] && cache[i][j] ? cache[i][j] : null);
          rev += r.rev; if (r.worst > worst) worst = r.worst;
          if (r.rev) bad.push(c + ' ' + d + ' ' + j + ' ' + r.rev + '/' + r.moved + ' w' + r.worst.toFixed(2));
        }
      }
      return { rev, worst: +worst.toFixed(2), bad };
    }

    /* HOW WIDE THE SPASM IS, asked of the drawn keys and not of the source: how
       many of the K keys actually put the cough's head somewhere different from
       its rest. One key wide was the whole bug. */
    let spasmKeys = 0;
    try {
      const rest = posedSkel('NE', 'cough', 0).sk.headTop;
      for (let i = 0; i < K; i++) {
        const h = posedSkel('NE', 'cough', i / K).sk.headTop;
        if (Math.hypot(h[0] - rest[0], h[1] - rest[1]) > 1.5) spasmKeys++;
      }
    } catch (e) { spasmKeys = -1; }

    /* THE CONTROL. A ruler that cannot see a jitter would report zero on
       everything and this gate would be decoration. A joint driven by the exact
       shape the bug had -- a one-key impulse -- is pushed through the SAME
       walk(), and it must come back with reversals. */
    const ctl = walk(i => { const t = i / K; const b = Math.max(0, Math.sin(t * Math.PI * 3)) * (t < 0.6 ? 1 : 0);
      return [0, -10 * b]; });

    return { K, named: score(NAMED), all: score(ALL), spasmKeys, ctl };
  });

  ok('the alpha loads with no page error (' + (errs.length ? errs[0] : 'none') + ')', errs.length === 0);
  ok('the pose grid is ' + R.K + ' keys a bar, read off the game and not typed into this gate', R.K >= 4);

  ok('THE RULER BITES: the exact shape the cough bug had, pushed through the same ' +
     'walk, still scores ' + R.ctl.rev + ' reversals', R.ctl.rev >= 1);

  /* ZERO IS NOT "THE HAND NEVER TURNS AROUND" AND SAYING SO WOULD BE A LIE.
     The walk resets its direction memory whenever a joint moves less than a
     sixth of a pixel, which is what the top of a reach does, so a single clean
     out-and-back with a hold at the top scores 0. That is the point: the ones
     this counted were turns with NO hold, between two keys, three times a bar. */
  ok('HIS TWO FACINGS, MEASURED: over the five hand clips on south and north-east, ' +
     'a joint steps back the way it came ' + R.named.rev + ' times per bar ' +
     '(ceiling ' + REV_NAMED_MAX + '; it was 26)', R.named.rev <= REV_NAMED_MAX);

  ok('and adding east it is ' + R.all.rev + ' (ceiling ' + REV_ALL_MAX + '; it was 43)',
     R.all.rev <= REV_ALL_MAX);

  ok('nothing crosses more than ' + R.all.worst + 'px between two DRAWN keys on those ' +
     'clips (ceiling ' + JUMP_MAX + '; it was 10.44)', R.all.worst <= JUMP_MAX);

  ok('the cough occupies ' + R.spasmKeys + ' of the ' + R.K + ' drawn keys ' +
     '(floor ' + SPASM_KEYS_MIN + '; it was 2, which is why it read as a twitch)',
     R.spasmKeys >= SPASM_KEYS_MIN);

  if (R.all.bad.length) {
    console.log('\n  STILL REVERSING, named so the list is not read as finished:');
    console.log('    ' + R.all.bad.join(' | '));
    console.log('    The cough ducks and comes back, which is what a cough does. A');
    console.log('    reversal is the SHAPE of a jitter, not proof of one, so these are');
    console.log('    printed and the ceiling above is what decides.');
  }
  await br.close();
  done();
})().catch(e => { console.log('  FAIL ' + e.message); fail++; done(); });
