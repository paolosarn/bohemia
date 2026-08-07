/* BOHEMIA CANVAS SCALE GATE (7/27/26) — the render contract enforced on the
 * LAST blit, the one the phone does.
 *
 * A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED. render_pixel_gate.js measures
 * what the game does while it draws; it cannot see what the browser does after.
 * And what the browser was doing was undoing all of it: #cv in the city frame
 * had no image-rendering, so the finished 378-wide backing store was BILINEAR
 * upscaled x3 onto the phone's glass, every frame, forever. Measured, not read
 * — see tools/bohemia_canvas_scale_audit.js.
 *
 * This gate boots the real alpha at iPhone-portrait DPR 3, walks to every tab,
 * and holds the CITY lane's canvas to the contract:
 *
 *   the CSS box equals the backing store exactly (any other ratio is a resample
 *   of every row before the device scale even starts)
 *   the WALKED world composites nearest-neighbour (it is pixel art)
 *   the BUILDER OVERVIEW keeps `auto` (13:1 minifications of district heroes;
 *   nearest there samples 1 pixel in 13 and aliases into noise, and Paolo likes
 *   that surface as it is — this direction is locked too, so a later "fix all
 *   the canvases" sweep cannot wreck it)
 *
 * Canvases belonging to OTHER lanes are measured and printed but never failed
 * on: ONE SYSTEM, ONE SESSION. Their numbers are in BOHEMIA_BACKLOG.md under
 * the lane that owns them.
 *
 *   node gates/canvas_scale_gate.js
 */
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const AUDIT = path.join(REPO, 'tools/bohemia_canvas_scale_audit.js');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

if (!fs.existsSync(AUDIT)) { console.log('  FAIL: the canvas scale audit tool is missing'); process.exit(1); }

const out = path.join(os.tmpdir(), 'bohemia_canvas_scale.json');
try {
  execFileSync('node', [AUDIT, ALPHA, '--json', out], { cwd: REPO, stdio: 'pipe', timeout: 480000 });
} catch (e) {
  console.log('  FAIL: the canvas scale audit could not run the alpha — ' + String(e.message).slice(0, 160));
  process.exit(1);
}
const rows = JSON.parse(fs.readFileSync(out, 'utf8'));
const isInt = v => Math.abs(v - Math.round(v)) <= 0.005;
const find = (tab, mode, id) => rows.find(r => r.tab === tab && r.mode === mode && r.id === id);

ok('the audit reached the real surfaces (' + rows.length + ' visible canvases measured)', rows.length >= 10);

const overview = find('city', 'default', 'cv');
const walked = find('city', 'walked', 'cv');

ok('the CITY OVERVIEW canvas was measured', !!overview);
ok('the WALKED WORLD canvas was measured (the audit dropped in)', !!walked);

if (overview) {
  ok('OVERVIEW: the CSS box equals the backing store (' + overview.bw + 'x' + overview.bh + ' -> ' +
    overview.cw + 'x' + overview.ch + ') — anything else resamples every row before the device scale starts',
    isInt(overview.sx) && isInt(overview.sy) && Math.round(overview.sx) === 1 && Math.round(overview.sy) === 1);
  ok('OVERVIEW: still composites SMOOTH (' + overview.filter + ') — the district heroes land as ~13:1 ' +
    'minifications there and nearest would alias them into noise; this surface is approved as it is',
    !/pixelated|crisp/.test(overview.filter));
}
if (walked) {
  ok('WALKED WORLD: the CSS box equals the backing store (' + walked.bw + 'x' + walked.bh + ' -> ' +
    walked.cw + 'x' + walked.ch + ')', isInt(walked.sx) && isInt(walked.sy) &&
    Math.round(walked.sx) === 1 && Math.round(walked.sy) === 1);
  ok('WALKED WORLD: composites NEAREST-NEIGHBOUR (' + walked.filter + ') — it is pixel art drawn at 22px ' +
    'per cell; `auto` bilinear-upscaled the entire world x3 to the glass and softened every tile ever painted',
    /pixelated|crisp/.test(walked.filter));
  ok('WALKED WORLD: lands on the GLASS at a whole-number scale (x' + walked.dx.toFixed(4) + ' at DPR ' +
    walked.dpr + ') — nearest-neighbour at a fractional device scale makes some art pixels wider than ' +
    'others, which reads as a badly drawn sprite',
    isInt(walked.dx) && isInt(walked.dy));
}

/* ============================================================================
   THE CHARACTER SURFACES ARE GATED NOW, FOREVER (Paolo 7/29/26: "make those
   fixes then make those fixes forever please").
   ----------------------------------------------------------------------------
   These were measured by the CITY lane on 7/27 and sat in the backlog as printed
   numbers nobody had to act on. Printed numbers do not hold: 16 of 19 canvases
   were landing on the glass at a fractional zoom, including the 8-facing gallery
   he JUDGES animations from, which was shrinking 112px into 85.8 and throwing
   away roughly a quarter of every row and column. Nearest-neighbour at a
   fractional scale makes some art pixels wider than others, and that reads as a
   badly drawn sprite no matter how good the art is.
   A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED, so these are assertions now.
   ----------------------------------------------------------------------------
   CORRECTION 8/6/26: THIS GATE WAS GREEN AND WRONG FOR EIGHT DAYS.

   It asserted on `sx`, and until today `sx` was getBoundingClientRect().width
   divided by the backing store. That rect is the BORDER box. The alpha sets
   `*{box-sizing:border-box}` globally and every canvas below carries a 1-2px
   border, so a declared 336 puts the bitmap in 334 -- x2.9821, not x3. Measured
   on 8/6, on the content box, EVERY ONE of the 7/29 fixes was still fractional:

       charCv 334 x2.9821 · portraitCv 124 x1.9375 · cloBig 166 x2.9643
       cloCv 52 x0.9286 · g8_* 110 x0.9821

   Near-integer is worse than obviously wrong: it yields one anomalous pixel
   column every N instead of a visibly broken image, so it survives being looked
   at. The audit now reports the CONTENT box in sx/sy and each declared width
   carries its own border. The `want` numbers below did not change and never
   needed to -- the sizes were right, the box was wrong.

   TWO HAIR SURFACES ADOPTED THE SAME DAY, and they were the worst in the game:
   the picker tiles at glass x1.7143 (one device pixel here, two beside it, on
   the tiles used to CHOOSE a hairstyle) and the 8-facing spin bar at x4.5000, a
   dead half pixel, on the bar built specifically to JUDGE hair. Both were
   anonymous canvases reporting as `(anon)`; they carry .hairTile and
   .hairSpinShot now, because a gate cannot hold a surface it cannot address.
   ========================================================================= */
/* keyed on tab+id: `mode` and `frame` are separate fields on a row and keying on
   the wrong one silently finds nothing, which is a gate that passes by accident */
const CHAR_SURFACES = [
  ['char',    'charCv',     3, 'the character preview'],
  ['char',    'portraitCv', 2, 'the portrait he taps to edit the face'],
  ['clothes', 'cloBig',     3, 'the big clothing preview'],
  ['clothes', 'cloCv',      1, 'the clothing strip tiles'],
  ['anim',    'g8_0',       1, 'the 8-facing gallery — the surface animations are JUDGED on'],
  ['anim',    'g8_4',       1, 'the 8-facing gallery (S)'],
  ['rig',     'cv',         1, 'the RIG preview — the body that is LAW'],
  ['char',    'hairTile',   1, 'the hair PICKER tiles — the surface a hairstyle is CHOSEN on'],
  ['char',    'hairSpinShot', 2, 'the hair SPIN bar — the surface hair is JUDGED in 8 facings on'],
];
for (const [tab, id, want, what] of CHAR_SURFACES) {
  const r = rows.find(q => q.tab === tab && q.id === id);
  ok('CHARACTER: ' + what + ' is drawn at a WHOLE-number scale' +
     (r ? ' (x' + r.sx.toFixed(4) + ', want x' + want + ')' : ' — SURFACE NOT FOUND'),
     !!r && isInt(r.sx) && isInt(r.sy) && Math.round(r.sx) === want);
  ok('CHARACTER: ' + what + ' lands on the GLASS whole (x' +
     (r ? r.dx.toFixed(4) : '?') + ') — a fractional device scale makes some art ' +
     'pixels wider than others', !!r && isInt(r.dx) && isInt(r.dy));
  ok('CHARACTER: ' + what + ' composites NEAREST-NEIGHBOUR, never bilinear',
     !!r && /pixelated|crisp/.test(r.filter));
  /* An integer ratio below 1 is still an integer. Scaling a sprite DOWN deletes
     source rows outright, and no amount of redrawing the art survives that. */
  ok('CHARACTER: ' + what + ' is not MINIFIED on the glass (x' + (r ? r.dx.toFixed(4) : '?') + ')',
     !!r && r.dx >= 0.999 && r.dy >= 0.999);
  /* THE MEASUREMENT ITSELF. If the audit ever goes back to dividing by the
     border box, every assertion above silently starts checking the wrong number
     again -- which is exactly how 7/29 stayed green while being wrong. */
  ok('CHARACTER: ' + what + ' was measured on the CONTENT box, not the border box',
     !!r && typeof r.kw === 'number' && Math.abs(r.kw - (r.cw - (r.inx || 0))) < 0.01);
}

// Other lanes: measured, printed, never failed on.
const mine = new Set(['city|default|cv', 'city|walked|cv']);
const gatedTabs = new Set(['char', 'clothes', 'anim', 'rig']);
const others = rows.filter(r => !mine.has(r.tab + '|' + r.mode + '|' + r.id) && !gatedTabs.has(r.tab) && (r.fractional || r.smoothed));
if (others.length) {
  console.log('  (not gated — other lanes own these; numbers filed in BOHEMIA_BACKLOG.md)');
  for (const r of others)
    console.log('     ' + (r.fractional ? 'FRAC ' : '     ') + (r.smoothed ? 'SMOOTH ' : '       ') +
      (r.tab + '/' + r.id).padEnd(24) + r.bw + 'x' + r.bh + ' -> ' + r.cw + 'x' + r.ch +
      '  x' + r.sx.toFixed(4) + '  ' + r.filter);
}

console.log('CANVAS SCALE GATE: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
