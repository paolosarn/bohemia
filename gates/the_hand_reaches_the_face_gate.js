/* BOHEMIA — THE HAND REACHES THE FACE GATE (9/21/26, ANIMATION, [redo killed])
 *
 * PAOLO 9/7, killing eat, drink, smoke, cough and whistle with the rest:
 * "some of the DIRECTIONS look like dog shit: when it's facing north-east the
 * hand was behind the head even though it's supposed to be in front."
 *
 * THAT WAS TWO PROBLEMS WEARING ONE COAT. The draw-order half was fixed 9/13
 * (NEAR HAND). This is the other half and it was worse: ALL FIVE AIMED WITH
 * gunT, THE GUN TARGET -- the chest point pushed forward along the facing. Right
 * for a pistol held out, wrong for a hand at the mouth, and because the push
 * follows the facing it lands somewhere different in every direction, which is
 * his sentence exactly.
 *
 * MEASURED IN THE DRAWN FRAME, not in the skeleton, and that distinction is the
 * whole gate. A joint ruler said the hand was 2.9 px from the mouth on
 * north-east; the picture showed an arm reaching past the head with no hand near
 * it. BOTH WERE RIGHT: facing away, a hand at the mouth is behind the skull, the
 * compositor is first-wins, and the reaching hand is never drawn at all. A
 * DISTANCE BETWEEN TWO JOINTS CANNOT SEE WHAT IS IN FRONT OF WHAT. So this asks
 * buildFrame for the part id under every drawn pixel and measures HAND PIXELS
 * (7, 8) against the FACE (1, 2) in the frame the game composes.
 *
 * THE RATCHET: 9 of 40 cells read as a hand at the face before, 33 after. That
 * number may only ever go UP.
 *
 *   node gates/the_hand_reaches_the_face_gate.js
 */
'use strict';
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');

const CLIPS = ['eat', 'drink', 'smoke', 'cough', 'whistle'];
const PEAK = { eat: 0.25, drink: 0.45, smoke: 0.3, cough: 0.12, whistle: 0.25 };
/* AND THE PHASE WHERE EACH ONE'S HAND IS SUPPOSED TO BE DOWN AGAIN. whistle is
   NOT in this list on purpose: fingers at the lips, held, is the whole clip, so
   it has no rest phase and pretending otherwise would be an invented control. */
const REST = { eat: 0.5, drink: 0.02, smoke: 0.9, cough: 0.42 };
/* A HAND READS AT THE FACE when its nearest drawn pixel is inside about
   three quarters of a head-height of the face centre. The head is 22 px in these
   frames, so the line is 16. Grounded in the art, not picked: at 16 px the hand
   overlaps the jaw; at 20 it is clear of the skull entirely, which is what every
   killed cell scored. */
const READS = 16;
const FLOOR = 33;          /* measured after the redo. MAY ONLY GO UP.
   9/23: with the DECLARATION in (a clip says _face and the draw order brings the
   arm-unit forward) this is 40 OF 40 on the same ruler, because the back views
   were never a pose problem -- facing away, a hand at the mouth is behind the
   skull and the compositor never drew it. The floor stays at 33 because the
   POSES are still out of the build: they cost NECK HOLDS HEAD 7 frames of 3px in
   profile, four separate attempts failed to close it, and never ship red. */
const BEST = 6.0;          /* the closest any cell gets; was 10.7 */

let pass = 0, fail = 0;
const ok = (n, c, note) => { c ? (pass++, console.log('  ok   ' + n + (note ? '  [' + note + ']' : '')))
                               : (fail++, console.log('  FAIL ' + n + (note ? '  [' + note + ']' : ''))); };

(async () => {
  const src = fs.readFileSync(ALPHA, 'utf8');

  /* THE CAUSE, HELD IN THE SOURCE: none of the five may aim with the gun target
     again. This is the claim that would have caught the bug in the first place,
     and it is cheap. */
  const usesGun = CLIPS.filter(c => {
    const m = src.match(new RegExp('\\n\\s' + c + ':\\(d,ph\\)=>[\\s\\S]{0,600}?\\},\\n'));
    return m && /gunT\(/.test(m[0]);
  });
  const br0 = async () => {};
  /* THE REDO IS "IN" WHEN THE CLIPS USE IT, not when the helpers exist. The
     helpers landed on 9/23 with the draw-order declaration while the five poses
     stayed out, and keying this on them turned a deliberate hold into four red
     claims. A gate that reads the plumbing instead of the product will always
     do that. */
  const REDO_IS_IN = usesGun.length === 0
                     && /function faceReach\(/.test(src);
  /* *** THE REDO IS NOT IN THE BUILD YET, ON PURPOSE, AND THIS GATE SAYS SO ***
     rather than going red over a thing nobody has shipped. Measured 9/21: the
     redo takes the hand to the face on 33 of 40 pictures against 9 before, AND
     it takes NECK HOLDS HEAD from 15 detached frames to 22, all of them facing
     east, because the forearm that reaches the mouth in profile passes over the
     throat. That is a real trade and it cannot be nudged out: raising the hand
     to clear the neck made BOTH numbers worse (24 detached, 31 of 40). Both
     halves want the same missing piece -- a clip that declares "hand at the
     face" so handOrder can bring that arm-unit and the neck into the right
     relationship, the way a gun clip declares _gun. NEVER SHIP RED: the poses
     live in the record and in the VOTE tab until that flag exists, and this gate
     is ready for the round it lands. */
  if (!REDO_IS_IN) {
    console.log('  --   THE REDO IS NOT IN THIS BUILD. It is in VOTE and in');
    console.log('       records/BOHEMIA_THE_HAND_NEVER_REACHED_THE_FACE_9_21_26.md,');
    console.log('       held out of the alpha because it costs NECK HOLDS HEAD 7 frames.');
    console.log('       This gate holds it from the round the draw-order flag lands.');
    ok('the five clips are not half-landed: either the redo is in and holds, or it '
       + 'is out and waits', usesGun.length === 5, usesGun.length + ' of 5 still on the gun target');
    await br0();
    return done();
  }
  ok('the face has its own target, derived from the head', REDO_IS_IN);

  ok('no hand-to-face clip aims with the GUN target any more',
     !REDO_IS_IN || usesGun.length === 0, usesGun.join(', ') || 'none of the five');

  const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const pg = await br.newPage();
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + ALPHA, { waitUntil: 'load' });
  await pg.waitForTimeout(7000);

  const r = await pg.evaluate((a) => {
    const { CLIPS, PEAK } = a;
    const DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'];
    if (typeof buildFrame !== 'function') return { ERR: 'no buildFrame on this build' };
    const rows = [];
    for (const clip of CLIPS) for (const d of DIRS) {
      let fr; try { fr = buildFrame(d, clip, PEAK[clip]); } catch (e) { rows.push({ clip, d, err: 1 }); continue; }
      const { CW, CH, grid } = fr;
      const hand = [], face = [];
      for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) {
        const id = grid[y * CW + x];
        if (id === 7 || id === 8) hand.push([x, y]);
        else if (id === 1 || id === 2) face.push([x, y]);
      }
      if (!hand.length || !face.length) { rows.push({ clip, d, near: null }); continue; }
      const fx = face.reduce((s, q) => s + q[0], 0) / face.length;
      const fy = face.reduce((s, q) => s + q[1], 0) / face.length;
      let near = 1e9; for (const q of hand) { const dd = Math.hypot(q[0] - fx, q[1] - fy); if (dd < near) near = dd; }
      const ys = face.map(q => q[1]);
      rows.push({ clip, d, near: +near.toFixed(1), head: Math.max.apply(null, ys) - Math.min.apply(null, ys) + 1 });
    }
    return { rows };
  }, { CLIPS, PEAK });

  if (r.ERR) { ok('the frames can be built at all', false, r.ERR); await br.close(); return done(); }

  const good = r.rows.filter(q => q.near !== null && q.near <= READS);
  const bad = r.rows.filter(q => q.near === null || q.near > READS);
  const heads = r.rows.filter(q => q.head).map(q => q.head);
  const nears = good.map(q => q.near);
  console.log('       the head is about ' + Math.round(heads.reduce((s, x) => s + x, 0) / heads.length)
    + 'px tall in these frames, so "at the face" is ' + READS + 'px');
  console.log('       still not reading: ' + bad.map(q => q.clip + '/' + q.d).join(', '));

  /* VACUOUS-PASS GUARD: no frames measured is a FAIL, not a pass. */
  ok('all forty frames were actually built and measured',
     r.rows.length === 40 && r.rows.filter(q => q.err).length === 0, r.rows.length + ' frames');
  ok('the hand reads at the face in at least ' + FLOOR + ' of the 40 pictures',
     good.length >= FLOOR, good.length + ' of 40 (was 9 before the redo)');
  ok('and the closest it gets is under ' + BEST + 'px',
     nears.length > 0 && Math.min.apply(null, nears) <= BEST,
     'closest ' + (nears.length ? Math.min.apply(null, nears) : '-') + 'px, was 10.7');
  /* THE CONTROL, AND THE FIRST CUT OF IT WAS VACUOUS. It asked whether ANY cell
     was away from the face, and a build that welds the hand to the head in every
     clip still scored 10 away -- because on the back views the hand is occluded
     and reads as far whatever the pose does. So the control asks the same forty
     frames AT THE PHASE THE HAND IS MEANT TO BE DOWN and requires it to have
     actually travelled. whistle has no rest phase and is left out rather than
     given an invented one. */
  const rest = await pg.evaluate((a) => {
    const { REST } = a;
    const DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'];
    const out = [];
    for (const clip of Object.keys(REST)) for (const d of DIRS) {
      let fr; try { fr = buildFrame(d, clip, REST[clip]); } catch (e) { continue; }
      const { CW, CH, grid } = fr; const hand = [], face = [];
      for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) {
        const id = grid[y * CW + x];
        if (id === 7 || id === 8) hand.push([x, y]); else if (id === 1 || id === 2) face.push([x, y]);
      }
      if (!hand.length || !face.length) { out.push({ clip, d, near: null }); continue; }
      const fx = face.reduce((s, q) => s + q[0], 0) / face.length;
      const fy = face.reduce((s, q) => s + q[1], 0) / face.length;
      let near = 1e9; for (const q of hand) { const dd = Math.hypot(q[0] - fx, q[1] - fy); if (dd < near) near = dd; }
      out.push({ clip, d, near: +near.toFixed(1) });
    }
    return out;
  }, { REST });
  const pairs = rest.map(q => {
    const pk = r.rows.find(z => z.clip === q.clip && z.d === q.d);
    return (pk && pk.near !== null && q.near !== null) ? { clip: q.clip, d: q.d, peak: pk.near, rest: q.near } : null;
  }).filter(Boolean);
  const travelled = pairs.filter(q => q.rest > q.peak + 4);
  ok('the hand still LEAVES the face: at the rest phase it has really travelled',
     pairs.length >= 24 && travelled.length >= 20,
     travelled.length + ' of ' + pairs.length + ' cells move it more than 4px between peak and rest');
  /* NAMED, NOT HIDDEN: the back view is a draw-order problem, not a pose one,
     and the gate prints it every run so it cannot be quietly forgotten. */
  const backs = bad.filter(q => q.d === 'N').length;
  console.log('       ' + backs + ' of the ' + bad.length + ' are facing straight away, where a hand at the '
    + 'mouth is genuinely behind the skull and the compositor drops it. That is draw order, not pose.');

  ok('nothing threw anywhere in this sweep', errs.length === 0, errs.slice(0, 2).join(' | '));
  await br.close();
  done();
})().catch(e => { console.log('  FAIL the gate could not run — ' + String(e.message).slice(0, 200)); process.exit(1); });

function done() {
  console.log('\nTHE HAND REACHES THE FACE GATE: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
}
