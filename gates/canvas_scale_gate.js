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

// Other lanes: measured, printed, never failed on.
const mine = new Set(['city|default|cv', 'city|walked|cv']);
const others = rows.filter(r => !mine.has(r.tab + '|' + r.mode + '|' + r.id) && (r.fractional || r.smoothed));
if (others.length) {
  console.log('  (not gated — other lanes own these; numbers filed in BOHEMIA_BACKLOG.md)');
  for (const r of others)
    console.log('     ' + (r.fractional ? 'FRAC ' : '     ') + (r.smoothed ? 'SMOOTH ' : '       ') +
      (r.tab + '/' + r.id).padEnd(24) + r.bw + 'x' + r.bh + ' -> ' + r.cw + 'x' + r.ch +
      '  x' + r.sx.toFixed(4) + '  ' + r.filter);
}

console.log('CANVAS SCALE GATE: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
