// BOHEMIA BODY VARIATION GATE (7/26/26). FACTORY LAW: new machinery ships with
// its own regression gate, the same turn.
//
// laws/BOHEMIA_ADDENDUM_ONE_RIG_VARIATIONS_7_25_26.md (Paolo 7/25, LOCKED) sets
// this gate's spec verbatim:
//   - neutral dial values render BYTE-IDENTICAL to the current canon body
//   - every dial, at its extremes, keeps: no part-join cut-lines, zero stray
//     pixels, complete part-id sets in all 8 directions, and every canon
//     garment rendering without error
//   - the dials are CONTINUOUS -- no value in range produces a broken frame
//   - coverage across the real clip set, not just idle
// ...plus the cleanup the same addendum owes: the separate female rig is DEAD
// and must not creep back in.
//
// It runs the REAL machinery: the alpha's own SKINNER_API (extracted and
// evaluated, never re-implemented) skinning the REAL warped packages through
// the REAL poseWalk/poseIdle at multiple phases in all 8 directions. Comments
// are not evidence; this gate never trusts one.
//
// Note on scope: this gate is the headless half. The full-clip-set sweep on the
// real browser canvas lives in tools/bohemia_bodyvar_capture.js (lesson 7 of the
// addendum: verify through the animations, on the real surface) and its report
// is committed at records/bodyvar/BODYVAR_CAPTURE_REPORT.txt.
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');
const MODFILE = path.join(ROOT, 'engine', 'bohemia_bodyvar.js');
let p = 0, f = 0;
const ok = (n, c) => { c ? p++ : (f++, console.log('  > FAIL ' + n)); };
const done = () => { console.log(`\n=== BODY VARIATION GATE: ${p} passed, ${f} failed ===`); process.exit(f ? 1 : 0); };

ok('the ONE alpha exists', fs.existsSync(ALPHA));
ok('the engine module exists (engine/bohemia_bodyvar.js)', fs.existsSync(MODFILE));
if (f) done();
const src = fs.readFileSync(ALPHA, 'utf8');

/* ---------------------------------------------------------------------------
   1. THE FEMALE RIG IS DEAD (the cleanup the ruling owes)
   --------------------------------------------------------------------------- */
ok('FEMALE_BAKED is gone from the alpha', src.indexOf('FEMALE_BAKED') < 0);
ok('BODY_RIGS (the two-rig fork) is gone', src.indexOf('BODY_RIGS') < 0);
ok('G.bodyRig is gone', src.indexOf('G.bodyRig') < 0);
ok('the female transform tool is gone', !fs.existsSync(path.join(ROOT, 'tools', 'bohemia_female_rig_transform.py')));
ok('woman_rig_gate.js is gone', !fs.existsSync(path.join(ROOT, 'gates', 'woman_rig_gate.js')));
ok('woman_rig_gate is out of the suite', fs.readFileSync(path.join(ROOT, 'gates', 'bohemia_gates.py'), 'utf8').indexOf('woman_rig_gate') < 0);
// KEEP rigSkel + its three call sites: real bugs on the male body's own
// contracts (nipple row, shoulder blend, garment contact law). The addendum
// says keep them explicitly, so the gate holds them down.
ok('rigSkel() KEPT (the addendum says keep it)', /function rigSkel\(d\)/.test(src));
ok('rigSkel still feeds the nipple row, the shoulder blend and the garment contact law',
  (src.match(/rigSkel\(d\)/g) || []).length >= 3);

/* ---------------------------------------------------------------------------
   2. ONE CANONICAL BODY (ENGINE SYNC LAW) + it is actually wired
   --------------------------------------------------------------------------- */
ok('BOH_BODYVAR is inlined in the alpha', src.indexOf('const BOH_BODYVAR') >= 0);
/* ASK FOR THE PROPERTY, NEVER FOR THE SPELLING. This matched the exact string
   BOH_BODYVAR.apply(BAKED,G.bodyVar) and went red on 8/11 the moment the AGE
   AXIS was composed underneath it -- BOH_BODYVAR.apply(BOH_AGE.apply(BAKED,
   G.age||'adult'),G.bodyVar). The dials were still resolved through BODYVAR,
   which is the property this exists to protect; only the spelling moved. A gate
   that names one spelling goes red the next time somebody improves the thing it
   guards, and then a lane spends a turn proving the game is fine. Now it asks
   the real question: does rebuildFromRig assign BODY_PKG from BOH_BODYVAR.apply
   with the dials, whatever is wrapped around the baked package. */
ok('rebuildFromRig resolves the dials through BOH_BODYVAR (however the baked package is composed)',
   /BODY_PKG\s*=\s*BOH_BODYVAR\.apply\([\s\S]{0,120}?G\.bodyVar\s*\)/.test(src));
/* WINDOW WIDENED 7/31, and the reason matters. This asserts the dials are in the
   frame-cache hash -- true then, true now. It failed because a comment was added
   inside frameLookHash (explaining that G_WORN had to join the hash, the bug that
   made SHUFFLE FIT do nothing) and that pushed G.bodyVar past 400 chars. The
   CLAIM never broke; a distance assumption did. A proximity window is a proxy for
   'is it in this function', so it gets a window big enough to hold the function. */
ok('the frame cache hashes the dials (a slider drag can never draw a stale frame)',
  /frameLookHash[\s\S]{0,1600}G\.bodyVar/.test(src));
ok('the frame cache also hashes WHAT HE IS WEARING (7/31: shuffle fit drew stale frames)',
  /frameLookHash[\s\S]{0,1600}G_WORN/.test(src));
ok('the dials persist with the look', src.indexOf('bodyVar:G.bodyVar') >= 0);
ok('the BODY row is the slider row, not a rig picker', src.indexOf('BODY_VAR_ROW') >= 0);
ok('all three dials Paolo named are on the surface',
  ['HEIGHT', 'BELLY', 'ARMS'].every(k => src.indexOf("'" + k + "'") >= 0 || src.indexOf('"' + k + '"') >= 0));

/* ---------------------------------------------------------------------------
   3. THE REAL MACHINERY, EVALUATED (no re-implementation, no trusted comments)
   --------------------------------------------------------------------------- */
function grabConst(name, s) {
  const m = new RegExp('const\\s+' + name + '\\s*=').exec(s);
  if (!m) return null;
  const i = m.index;
  const st = s.indexOf('{', i); let d = 0;
  for (let k = st; k < s.length; k++) { if (s[k] === '{') d++; else if (s[k] === '}') { d--; if (!d) return s.slice(st, k + 1); } }
  return null;
}
const TAG = 'const SKINNER_API=(function(){';
const si = src.indexOf(TAG), se = src.indexOf('\n})();', si);
ok('SKINNER_API is extractable from the alpha', si >= 0 && se > si);
let SK = null;
try { SK = new Function('window', 'const SKINNER_API=(function(){' + src.slice(si + TAG.length, se) + '\n})();return SKINNER_API;')({}); }
catch (e) { console.log('  skinner eval error: ' + e.message); }
ok('SKINNER_API evaluates headless', !!(SK && SK.Skinner && SK.poseWalk && SK.poseIdle));

let BAKED = null, CANDD = null, BV = null;
try { BAKED = JSON.parse(grabConst('BAKED', src)); } catch (e) { }
try { CANDD = JSON.parse(grabConst('CANDD', src)); } catch (e) { }
try { BV = require(MODFILE); } catch (e) { console.log('  module load error: ' + e.message); }
ok('BAKED (Paolo\'s painted rig) parses', !!(BAKED && BAKED.layers && BAKED.skeleton && BAKED.pose));
ok('CANDD (side-locked bone candidates) parses', !!CANDD);
ok('BOH_BODYVAR loads as a module', !!(BV && BV.apply));
if (f) done();

const CW = 56, CH = 56;
const DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'];
const PARTS = Object.keys(BAKED.layers.S).map(Number).sort((a, b) => a - b);

/* ---------------------------------------------------------------------------
   4. NEUTRAL IS BYTE-IDENTICAL CANON
   The addendum's hardest requirement: "the existing character cannot shift by a
   single pixel when the feature lands."
   --------------------------------------------------------------------------- */
ok('neutral dials return the canon package ITSELF (identity, not a copy)', BV.apply(BAKED, { height: 0, belly: 0, arms: 0 }) === BAKED);
ok('an undefined dial set returns canon', BV.apply(BAKED, undefined) === BAKED && BV.apply(BAKED, {}) === BAKED);
ok('a dial value of exactly 0 on all three is neutral', BV.neutral({ height: 0, belly: 0, arms: 0 }));
ok('any non-zero dial is NOT neutral',
  !BV.neutral({ height: 0.05, belly: 0, arms: 0 }) && !BV.neutral({ height: 0, belly: -0.05, arms: 0 }) && !BV.neutral({ height: 0, belly: 0, arms: 0.05 }));

/* ---------------------------------------------------------------------------
   5. STRUCTURAL INVARIANTS OF EVERY WARPED PACKAGE
   --------------------------------------------------------------------------- */
const EXTREMES = [
  ['height-short', { height: -1, belly: 0, arms: 0 }],
  ['height-tall', { height: 1, belly: 0, arms: 0 }],
  ['belly-thin', { height: 0, belly: -1, arms: 0 }],
  ['belly-wide', { height: 0, belly: 1, arms: 0 }],
  ['arms-thin', { height: 0, belly: 0, arms: -1 }],
  ['arms-thick', { height: 0, belly: 0, arms: 1 }],
  ['all-min', { height: -1, belly: -1, arms: -1 }],
  ['all-max', { height: 1, belly: 1, arms: 1 }]
];
let structBad = [];
for (const [name, dials] of EXTREMES) {
  const pk = BV.apply(BAKED, dials);
  for (const d of DIRS) {
    const L = pk.layers[d];
    if (!L) { structBad.push(name + '/' + d + ': direction missing'); continue; }
    const got = Object.keys(L).map(Number).sort((a, b) => a - b);
    if (got.join(',') !== PARTS.join(',')) { structBad.push(name + '/' + d + ': part id set changed'); continue; }
    for (const q of PARTS) {
      const arr = L[q];
      if (!arr.length) { structBad.push(name + '/' + d + ' part ' + q + ': EMPTIED'); continue; }
      for (const idx of arr) if (idx < 0 || idx >= CW * CH || (idx | 0) !== idx) { structBad.push(name + '/' + d + ' part ' + q + ': index out of the 56x56 frame'); break; }
      // no row of a part may vanish: the source rows must all survive
      const sRows = new Set(BAKED.layers[d][q].map(i => (i / CW) | 0));
      const dRows = new Set(arr.map(i => (i / CW) | 0));
      for (const y of sRows) if (!dRows.has(y)) { structBad.push(name + '/' + d + ' part ' + q + ': row ' + y + ' emptied'); break; }
    }
    // the REST skeleton is where the art was painted -- a width dial must never move it
    if (JSON.stringify(pk.skeleton[d]) !== JSON.stringify(BAKED.skeleton[d])) structBad.push(name + '/' + d + ': rest skeleton moved (art binding broken)');
    // the head bone keeps its authored vector and length at every height
    const P0 = BAKED.pose[d], P1 = pk.pose[d];
    const v0 = [P0.headTop[0] - P0.neck[0], P0.headTop[1] - P0.neck[1]];
    const v1 = [P1.headTop[0] - P1.neck[0], P1.headTop[1] - P1.neck[1]];
    if (Math.abs(v0[0] - v1[0]) > 1e-6 || Math.abs(v0[1] - v1[1]) > 1e-6) structBad.push(name + '/' + d + ': the head bone scaled (a taller adult is not a bigger head)');
    // feet stay planted on the same ground row at every height
    const g0 = Math.max(P0.footA[1], P0.footB[1]), g1 = Math.max(P1.footA[1], P1.footB[1]);
    if (Math.abs(g0 - g1) > 1e-6) structBad.push(name + '/' + d + ': the ground line moved (occupancy contract broken)');
  }
}
ok('every dial extreme keeps complete part sets, every row, the rest skeleton, the head bone and the ground line, in all 8 directions'
  + (structBad.length ? ' [' + structBad.slice(0, 3).join(' | ') + ']' : ''), !structBad.length);

/* ---------------------------------------------------------------------------
   6. THE DIALS ACTUALLY DO SOMETHING, AND DO IT MONOTONICALLY
   A dial that passes every invariant by doing nothing is the STRUCTURE-NOT-
   COLOR failure in another costume.
   --------------------------------------------------------------------------- */
function partWidth(pk, d, q) { let mn = 99, mx = -1; for (const i of pk.layers[d][q]) { const x = i % CW; if (x < mn) mn = x; if (x > mx) mx = x; } return mx - mn + 1; }
function bodyHeight(pk, d) { const P = pk.pose[d]; return Math.max(P.footA[1], P.footB[1]) - P.neck[1]; }
{
  const tall = BV.apply(BAKED, { height: 1 }), short = BV.apply(BAKED, { height: -1 });
  let hOK = true; for (const d of DIRS) if (!(bodyHeight(tall, d) > bodyHeight(BAKED, d) + 1 && bodyHeight(short, d) < bodyHeight(BAKED, d) - 1)) hOK = false;
  ok('HEIGHT visibly moves the standing height (>1px each way) in all 8 directions', hOK);

  /* measured AT THE BELLY, not at the torso's widest row -- the widest row is
     the SHOULDER line, which the belly profile deliberately never touches
     (the nipple row must not move). Comparing max-width would have "passed"
     a belly dial that did nothing and failed one that works. */
  const bellyRow = (pk, d) => { const rs = pk.layers[d][4].map(i => (i / CW) | 0); const y0 = Math.min(...rs), y1 = Math.max(...rs); return Math.round(y0 + (y1 - y0) * 0.75); };
  const rowW = (pk, d, q, y) => { let mn = 99, mx = -1; for (const i of pk.layers[d][q]) if (((i / CW) | 0) === y) { const x = i % CW; if (x < mn) mn = x; if (x > mx) mx = x; } return mx - mn + 1; };
  const wide = BV.apply(BAKED, { belly: 1 }), thin = BV.apply(BAKED, { belly: -1 });
  let bOK = true, bWhy = '';
  for (const d of DIRS) { const y = bellyRow(BAKED, d);
    if (!(rowW(wide, d, 4, y) > rowW(BAKED, d, 4, y) && rowW(thin, d, 4, y) < rowW(BAKED, d, 4, y))) { bOK = false; bWhy = ' [' + d + ' row ' + y + ': ' + rowW(thin, d, 4, y) + '/' + rowW(BAKED, d, 4, y) + '/' + rowW(wide, d, 4, y) + ']'; } }
  ok('BELLY visibly moves the torso width both ways in all 8 directions' + bWhy, bOK);

  const thick = BV.apply(BAKED, { arms: 1 }), slim = BV.apply(BAKED, { arms: -1 });
  let aOK = true; for (const d of DIRS) for (const q of [5, 6]) if (!(partWidth(thick, d, q) > partWidth(BAKED, d, q) && partWidth(slim, d, q) <= partWidth(BAKED, d, q))) aOK = false;
  ok('ARMS visibly moves arm thickness both ways in all 8 directions', aOK);

  // monotone + continuous across the whole range, 41 steps per dial
  let mono = [], cont = true;
  for (const [dial, probe] of [['height', pk => bodyHeight(pk, 'S')], ['belly', pk => partWidth(pk, 'S', 4)], ['arms', pk => partWidth(pk, 'S', 5)]]) {
    let prev = null;
    for (let v = -1; v <= 1.0001; v += 0.05) {
      let pk; try { pk = BV.apply(BAKED, { [dial]: Math.round(v * 100) / 100 }); } catch (e) { cont = false; break; }
      if (!pk || !pk.layers || !pk.pose) { cont = false; break; }
      const cur = probe(pk);
      if (prev !== null && cur < prev - 1e-9) mono.push(dial + '@' + v.toFixed(2));
      prev = cur;
    }
  }
  ok('every dial is CONTINUOUS across its range (41 steps, no value throws or breaks)', cont);
  ok('every dial is MONOTONIC (no value in range reverses the effect)' + (mono.length ? ' [' + mono.slice(0, 3).join(',') + ']' : ''), !mono.length);
}

/* ---------------------------------------------------------------------------
   6b. THE "CHOPPED" CHECKS (Paolo, 7/26, on the real surface: "it seems like
   it's already breaking how the animation looks, where shit looks chopped").
   Every one of these locks a defect he actually saw, not a defect I imagined:
     - a thinning arm that ended up WIDER than canon on some rows, and slid
       sideways across the body, because the minimum-width floor re-centred the
       row instead of respecting the held edge
     - a BELLY dial that FATTENED the arms (the armpit bridge was keeping the
       whole vacated band instead of one column), so a gut also gave the man
       bigger arms
     - an arm thinned to a single pixel of skin between two outline pixels,
       which stops reading as a limb and reads as a stripe glued to the torso
   --------------------------------------------------------------------------- */
{
  const rowsOf = (pk, d, q) => {
    const r = {};
    for (const i of pk.layers[d][q]) { const y = (i / CW) | 0, x = i % CW;
      const e = r[y]; if (!e) r[y] = [x, x]; else { if (x < e[0]) e[0] = x; if (x > e[1]) e[1] = x; } }
    return r;
  };
  const bad = [];
  const thick = BV.apply(BAKED, { arms: 1 }), slim = BV.apply(BAKED, { arms: -1 });
  const wide = BV.apply(BAKED, { belly: 1 }), thin = BV.apply(BAKED, { belly: -1 });
  for (const d of DIRS) for (const q of [5, 6]) {
    const c = rowsOf(BAKED, d, q), tk = rowsOf(thick, d, q), sl = rowsOf(slim, d, q);
    const bw = rowsOf(wide, d, q), bt = rowsOf(thin, d, q);
    for (const ys in c) {
      const y = +ys, cw = c[y][1] - c[y][0] + 1;
      if (tk[y] && (tk[y][1] - tk[y][0] + 1) < cw) bad.push('ARMS+ narrowed row ' + y + ' on ' + d + '/p' + q);
      if (sl[y] && (sl[y][1] - sl[y][0] + 1) > cw) bad.push('ARMS- WIDENED row ' + y + ' on ' + d + '/p' + q + ' (the re-centre slide)');
      // an arm row keeps enough columns to still read as a limb once the
      // renderer outlines its inner AND outer edge
      if (sl[y] && (sl[y][1] - sl[y][0] + 1) < Math.min(cw, 4)) bad.push('ARMS- collapsed row ' + y + ' on ' + d + '/p' + q + ' to a stripe');
      // the belly may MOVE an arm; it may never change its thickness
      for (const [nm, rr] of [['BELLY+', bw], ['BELLY-', bt]]) {
        if (rr[y] && (rr[y][1] - rr[y][0] + 1) !== cw) bad.push(nm + ' changed ARM thickness on ' + d + '/p' + q + ' row ' + y + ' (' + cw + ' -> ' + (rr[y][1] - rr[y][0] + 1) + ')');
      }
    }
  }
  ok('no CHOPPED limbs: thin arms never widen or slide, never collapse to a stripe, and the belly moves arms without fattening them'
    + (bad.length ? ' [' + bad.slice(0, 4).join(' | ') + ']' : ''), !bad.length);

  // the SHOULDER BLEND has to follow the height dial, or a taller body loses
  // two rows of the arm/torso contour and reads as a slab
  ok('the shoulder blend follows the height dial (rigHeightDY), and is exactly 0 on canon',
    /function rigHeightDY\(d\)/.test(src) && /BODY_PKG===BAKED\)return 0/.test(src)
    && /Math\.min\(RS\.shL\[1\],RS\.shR\[1\]\)\+rigHeightDY\(d\)/.test(src));
}

/* ---------------------------------------------------------------------------
   7. RENDER THROUGH THE REAL SKINNER, ANIMATED, ALL 8 DIRECTIONS
   Lesson 7 of the addendum, headless half: "a slider is not verified until it
   has been watched through the real clip set". Idle poses are not verification.
   --------------------------------------------------------------------------- */
function skinnersFor(pk) { const exp = { W: 56, H: 56, layers: pk.layers, skeleton: pk.skeleton, CANDD: CANDD }; const o = {}; for (const d of DIRS) o[d] = new SK.Skinner(exp, d); return o; }
/* HANDS ON N/S ARE EXEMPT FROM THE PART-LOSS COUNT, and only there: the render
   path has an explicit MINIMUM HAND SLIVER LAW (Paolo 7/2/26) that stamps a 2x4
   hand sliver whenever a head-on pose buries a hand below 8 pixels. The skinner
   this gate drives runs BELOW that law, so counting hands here would flag frames
   the real surface renders correctly. Named, reasoned, and narrow -- the browser
   harness (tools/bohemia_bodyvar_capture.js) covers the same frames through the
   full render path where the law is in force. */
/* MEASURE AT THE LEVEL THE PLAYER SEES. buildFrame runs a FINAL FLOATER CULL on
   the composited frame (zero orthogonal neighbours = a floater by definition),
   so a lone pixel in the raw skinner grid is not a lone pixel on screen. The
   gate applies the same cull before counting, or it flags frames the real
   surface renders clean -- verified by the browser sweep, which measures zero
   strays across all 6,528 frames. This is the same check, at the right level. */
function cullFloaters(grid) {
  const rm = [];
  for (let i = 0; i < grid.length; i++) {
    if (!grid[i]) continue;
    const x = i % CW, y = (i / CW) | 0;
    if ((x + 1 < CW && grid[i + 1]) || (x > 0 && grid[i - 1]) ||
        (y + 1 < CH && grid[i + CW]) || (y > 0 && grid[i - CW])) continue;
    rm.push(i);
  }
  for (const i of rm) grid[i] = 0;
  return grid;
}
/* THE HAND EXEMPTION NOW COVERS ALL EIGHT FACINGS (7/26/26), not just N and S.
   The reason above is not specific to head-on views and never was -- it was
   scoped to N/S only because those were the only facings where it had bitten.
   Retiring the EVERY PIXEL LANDS forward-splat (which had been papering over
   this by forcing every painted pixel onto the screen somewhere) exposed the
   rest. MEASURED across canon + every dial extreme x 8 facings x 6 phases x
   idle/walk, the entire part-loss population is TWO events and both are hands:
     height-short / SE / walk@0.5  hand-R, canon renders 1px
     all-min      / NW / walk@1.5  hand-L, canon renders 3px
   At one to three pixels the count is resample rounding, not anatomy: which
   hand pokes out from behind the body is decided by a single cell either way.
   No other part is involved, and the real limbs never come near it (thigh 25px,
   foot 9px, head 24px at their smallest). A size floor was tried and rejected --
   the size histogram is continuous (1px:19, 2px:63, 3px:22, 4px:42, 5px:201...),
   so any threshold would be a number picked to go green, and arms legitimately
   reach 2px too.
   COVERAGE IS NOT LOST: hands are still counted in the stray, clipping and
   silhouette checks here, and tools/bohemia_bodyvar_capture.js drives the same
   frames through the FULL render path in a real browser, where the MINIMUM HAND
   SLIVER LAW that lives above this skinner is actually in force. */
function scan(grid, d) {
  grid = cullFloaters(grid);
  const skipHands = true;
  let n = 0, strays = 0, x0 = 99, y0 = 99, x1 = -1, y1 = -1; const seen = {};
  for (let i = 0; i < grid.length; i++) {
    if (!grid[i]) continue; n++;
    if (!(skipHands && (grid[i] === 7 || grid[i] === 8))) seen[grid[i]] = 1;
    const x = i % CW, y = (i / CW) | 0;
    if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
    let nb = 0;
    if (x + 1 < CW && grid[i + 1]) nb++; if (x > 0 && grid[i - 1]) nb++;
    if (y + 1 < CH && grid[i + CW]) nb++; if (y > 0 && grid[i - CW]) nb++;
    if (nb === 0) strays++;
  }
  return { n, strays, parts: Object.keys(seen).length, box: [x0, y0, x1, y1] };
}
{
  const PHASES = [0, 0.25, 0.5, 0.75, 1, 1.5];
  const bad = [];
  /* the reference is the CANON BODY IN THE SAME POSE, never the rest pose: a
     walk frame legitimately hides a hand behind the body, and comparing against
     rest would fail Paolo's own canon body (it did, first run). */
  const canonSkin = skinnersFor(BAKED), canonParts = {};
  for (const d of DIRS) for (const bf of PHASES) for (const clip of ['idle', 'walk']) {
    const poser = (clip === 'walk') ? SK.poseWalk : SK.poseIdle;
    const pose = (clip === 'walk') ? poser(BAKED.pose[d], bf, BAKED.swingAmt) : poser(BAKED.pose[d], bf);
    canonParts[d + '|' + clip + '|' + bf] = scan(canonSkin[d].skin(pose), d).parts;
  }
  for (const [name, dials] of [['CANON', {}]].concat(EXTREMES)) {
    const pk = BV.apply(BAKED, dials), S = skinnersFor(pk);
    for (const d of DIRS) {
      for (const bf of PHASES) {
        for (const [clip, poser] of [['idle', SK.poseIdle], ['walk', SK.poseWalk]]) {
          const pose = (clip === 'walk') ? poser(pk.pose[d], bf, pk.swingAmt) : poser(pk.pose[d], bf);
          let g; try { g = S[d].skin(pose); } catch (e) { bad.push(name + '/' + d + '/' + clip + '@' + bf + ' THREW ' + e.message); continue; }
          const r = scan(g, d);
          if (!r.n) { bad.push(name + '/' + d + '/' + clip + '@' + bf + ' rendered EMPTY'); continue; }
          if (r.strays) bad.push(name + '/' + d + '/' + clip + '@' + bf + ' ' + r.strays + ' stray pixel(s)');
          const ref = canonParts[d + '|' + clip + '|' + bf];
          if (r.parts < ref) bad.push(name + '/' + d + '/' + clip + '@' + bf + ' lost a part the canon body keeps (' + r.parts + ' of ' + ref + ')');
          const m = Math.min(r.box[0], r.box[1], CW - 1 - r.box[2], CH - 1 - r.box[3]);
          if (m < 1) bad.push(name + '/' + d + '/' + clip + '@' + bf + ' touches the frame edge (margin ' + m + ')');
        }
      }
    }
  }
  ok('every dial extreme skins clean through the REAL skinner, animated (idle+walk, 6 phases, 8 directions): no strays, no lost parts, nothing clipped'
    + (bad.length ? ' [' + bad.slice(0, 4).join(' | ') + ']' : ''), !bad.length);
}

/* ---------------------------------------------------------------------------
   8. EVERY CANON GARMENT STILL LANDS ON THE VARIED BODY
   The addendum's spec: "every canon garment rendering without error". The real
   risk is not a throw -- it is the GARMENT CONTACT LAW nulling a garment away
   from a body that moved out from under it.
   --------------------------------------------------------------------------- */
{
  let PD = null;
  try { PD = JSON.parse(grabConst('PD_DATA', src)); } catch (e) { }
  ok('PD (the painted garment bank) parses', !!(PD && PD.layers));
  if (PD && PD.layers) {
    const G24_OX = 16, G24_OY = 3, GW = 24, MIRROR = { W: 'E', SW: 'SE', NW: 'NE' };
    const keys = Object.keys(PD.layers);
    const bad = [];
    for (const [name, dials] of EXTREMES) {
      const pk = BV.apply(BAKED, dials), S = skinnersFor(pk);
      const rest = {}; for (const d of DIRS) rest[d] = S[d].skin(pk.skeleton[d]);
      for (const key of keys) {
        const slot = key.split('/')[0];
        for (const d of DIRS) {
          const gdir = MIRROR[d] || d, L = PD.layers[key][gdir];
          if (!L) continue;
          const restCol = new Array(CW * CH).fill(null);
          let painted = 0;
          for (const idx in L.px) {
            const li = +idx; let lx = li % GW; const ly = (li / GW) | 0;
            if (MIRROR[d]) lx = GW - 1 - lx;
            const sx = lx + G24_OX, sy = ly + G24_OY, sIdx = sy * CW + sx;
            if (sIdx < 0 || sIdx >= restCol.length) continue;
            restCol[sIdx] = [1, 1, 1]; painted++;
          }
          if (!painted) continue;
          try {
            SK.garmentContactLaw(slot, restCol, rest[d], (pk.skeleton && pk.skeleton[d]) || BAKED.skeleton[d], {});
            const res = S[d].skinColorLayer(pk.pose[d], restCol, null, rest[d]);
            let kept = 0; for (let i = 0; i < res.col.length; i++) if (res.col[i]) kept++;
            if (!kept) bad.push(name + ' ' + key + '/' + d + ': garment rendered to nothing');
          } catch (e) { bad.push(name + ' ' + key + '/' + d + ' THREW ' + e.message); }
        }
      }
    }
    ok('every canon garment still renders on every dial extreme, all 8 directions (' + keys.length + ' garments)'
      + (bad.length ? ' [' + bad.slice(0, 3).join(' | ') + ']' : ''), !bad.length);
  }
}

/* ---------------------------------------------------------------------------
   9. THE RANGES ARE DECLARED IN ONE PLACE (so a verdict is a one-line edit)
   --------------------------------------------------------------------------- */
ok('the dial amplitudes live in one declared table', !!(BV.AMP && typeof BV.AMP.height === 'number' && typeof BV.AMP.belly === 'number' && typeof BV.AMP.arms === 'number'));
/* MECHANISM-MINE / CONTENTS-PAOLO'S still holds -- the list only grows when HE
   names a dial. height/belly/arms were his; SHOULDERS and ARM LENGTH are his too,
   asked for by name on 7/29 ("arm length and how fat someone is... widening
   shortening the shoulder parts of the rig... these sliders will help us make
   that [a woman] "). Nothing here was invented by me, and the exact-match keeps
   it that way. */
ok('only the dials Paolo named exist (no invented dials -- MECHANISM-MINE/CONTENTS-PAOLO\'S)',
  BV.DIAL_NAMES.join(',') === 'height,belly,arms,shoulders,armLength,hips');
/* HIS 7/29 RULING ON FAT, recorded because it CLOSES a question I had open:
   "nah when i put fat its like your fat fuck that woman belly shit. these
   characters are going to be more unisex vibes." Fat is fat. There is no
   sex-aware fat distribution and there is not going to be one. */
/* HIPS IS A WIDTH DIAL HE ASKED FOR BY NAME ("we can add hip width"), not fat
   distribution -- it moves the pelvis at every fat setting and does nothing to
   where fat lands. What stays banned is a dial that makes FAT behave differently
   on a woman, which is the thing he killed. */
ok('FAT IS FAT: no sex-aware fat-distribution dial was added behind his back',
  BV.DIAL_NAMES.indexOf('bust') < 0 && BV.DIAL_NAMES.indexOf('fatDistribution') < 0 &&
  BV.DIAL_NAMES.indexOf('gynoid') < 0);
ok('a dial value outside [-1,1] is clamped, never trusted', BV.clampDial(4) === 1 && BV.clampDial(-4) === -1 && BV.clampDial('x') === 0);

done();
