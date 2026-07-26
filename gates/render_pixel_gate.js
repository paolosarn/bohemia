/* BOHEMIA RENDER PIXEL GATE (7/26/26) — the render contract, measured on the
 * real surface instead of read in the source.
 *
 * A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED. The MOBILE RENDER CONTRACT
 * (laws/BOHEMIA_MOBILE_RENDER_CONTRACT_7_26_26.md) bans non-integer scaling —
 * "a 3x phone blitting a 1.07x buffer destroys pixel art" — and nothing checked
 * whether the game obeyed it. It did not. Measured on the walked CITY tab:
 *
 *     41.0% of all draws upscaled by a fractional factor (x1.375, the whole
 *           ground plane, at every zoom level)
 *     44.3% of all draws landed on a half pixel (odd canvas height -> the
 *           camera origin carried a .5 into every blit)
 *
 * Both are invisible in code review. Both make every approved tile in the game
 * softer than it was painted. Neither would have been found by reading the
 * source, because the source looks fine — the defect is in the arithmetic
 * between a bake size, a zoom ladder and a canvas dimension.
 *
 * So this gate does not read code. It boots the real alpha in a real browser at
 * iPhone-portrait 3x, walks the character, records EVERY drawImage the game
 * actually makes, and holds the result to a ratchet. The ceilings below are the
 * measured post-fix numbers plus a little air; they may only ever go DOWN.
 *
 *   node gates/render_pixel_gate.js
 */
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const AUDIT = path.join(REPO, 'tools/bohemia_render_audit.js');

// RATCHET. Measured 7/26 after the pixel fix, as a share of all draws:
//   fractional 3.4%  (the iso overview's own projection — that surface is
//                     approved and is not being reshaped for this)
//   non-integer 0.1%  (a couple of stragglers baked at the old size)
//   smoothed    3.5%  (large minifications on the city overview, where
//                      smoothing is the correct choice; see NOTE below)
// These are CEILINGS. Lower them when the number drops; never raise them.
const MAX = { fractional: 6.0, upsmoothed: 1.0, squashed: 0.5 };

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

if (!fs.existsSync(AUDIT)) { console.log('  FAIL: the render audit tool is missing'); process.exit(1); }

const out = path.join(os.tmpdir(), 'bohemia_render_gate.json');
try {
  execFileSync('node', [AUDIT, ALPHA, '--frame', 'city', '--walk', '--json', out],
    { cwd: REPO, stdio: 'pipe', timeout: 480000 });
} catch (e) {
  console.log('  FAIL: the render audit could not run the alpha — ' + String(e.message).slice(0, 160));
  process.exit(1);
}
const r = JSON.parse(fs.readFileSync(out, 'utf8'));
const pct = n => 100 * n / Math.max(1, r.calls);

ok('the audit actually drove the real surface (' + r.calls + ' draws recorded)', r.calls > 5000);
ok('NON-INTEGER SCALE is within the ratchet (' + pct(r.upsmoothed).toFixed(1) + '% <= ' + MAX.upsmoothed + '%) — ' +
  'the contract bans fractional upscaling; this is the check that caught the ground plane at 41%',
  pct(r.upsmoothed) <= MAX.upsmoothed);
ok('HALF-PIXEL DRAWS are within the ratchet (' + pct(r.fractional).toFixed(1) + '% <= ' + MAX.fractional + '%) — ' +
  'a fractional destination resamples across two pixel rows and softens every edge',
  pct(r.fractional) <= MAX.fractional);
ok('NOTHING IS DRAWN OFF ITS OWN ASPECT (' + pct(r.squashed).toFixed(1) + '% <= ' + MAX.squashed + '%) — ' +
  'art stretched to a shape it was not painted at',
  pct(r.squashed) <= MAX.squashed);

// NOTE, stated instead of hidden: `smoothed` is NOT gated. Every remaining case
// is a large MINIFICATION on the city-builder overview (a ~266px district hero
// drawn into a ~20px slot), where smoothing is the right call — nearest at 13:1
// would sample 1 pixel in 13 and alias into noise. The real improvement there is
// to pre-scale each hero once and cache it, which is identical output for a
// fraction of the work; it is filed as a CITY backlog item, not forced here.
console.log('  (not gated: ' + r.smoothed + ' smoothed draws, all large minifications on the ' +
  'city-builder overview — see the note in this gate)');

console.log('RENDER PIXEL GATE: ' + pass + ' passed, ' + fail + ' failed  (' + r.calls + ' real draws measured)');
process.exit(fail ? 1 : 0);
