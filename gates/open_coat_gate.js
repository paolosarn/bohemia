// BOHEMIA OPEN-COAT LAW GATE (Paolo 7/18/26, LOCKED).
// THE LAW: "if it's a jacket or a trenchcoat there HAS to be a middle part where
// you can see the clothes underneath it." A closed coat that covers everything is
// dogshit overalls, not outerwear. Every 'outer'-layer garment must be OPEN down
// the front so the under-layer (shirt over pants) shows through the slit.
//
// This gate does NOT trust a comment. It extracts the REAL genCoat + its pure
// helpers straight from the alpha, runs it on a synthetic body, and asserts the
// coat renders as two flaps with an OPEN, unpainted center column. Remove the
// slit and this gate goes red.
const fs = require('fs'), path = require('path');
const ALPHA = path.join(__dirname, '../slices/BOHEMIA_ALPHA_0_9.html');
let p = 0, f = 0; const ok = (n, c) => { c ? p++ : (f++, console.log('  > FAIL ' + n)); };

ok('the ONE alpha exists', fs.existsSync(ALPHA));
if (!fs.existsSync(ALPHA)) { console.log(`\n=== OPEN-COAT GATE: ${p} passed, ${f} failed ===`); process.exit(1); }
const src = fs.readFileSync(ALPHA, 'utf8');

// pull a function's source by balanced braces
function grab(name) {
  const i = src.indexOf('function ' + name + '(');
  if (i < 0) return null;
  const s = src.indexOf('{', i); let d = 0;
  for (let k = s; k < src.length; k++) { if (src[k] === '{') d++; else if (src[k] === '}') { d--; if (!d) return src.slice(i, k + 1); } }
  return null;
}
const NAMES = ['mix', 'bshade', 'ext', 'pExt', 'genCoat'];
const bodies = NAMES.map(grab);
ok('genCoat + pure helpers found in the alpha', bodies.every(Boolean));

let genCoat = null;
if (bodies.every(Boolean)) {
  try { genCoat = new Function('CW', 'CH', bodies.join('\n') + '\nreturn genCoat;')(56, 56); }
  catch (e) { console.log('  eval error: ' + e.message); }
}
ok('genCoat evaluates as a pure function', typeof genCoat === 'function');

// LAW ENFORCEMENT: every layer:'outer' garment must call genCoat (the open-coat gen)
const gi = src.indexOf('var GARMENTS=');
const gblock = gi >= 0 ? src.slice(gi, src.indexOf('];', gi)) : '';
const outerLines = gblock.split('\n').filter(l => /layer:'outer'/.test(l));
ok('at least one outer garment exists', outerLines.length > 0);
// PONCHO EXEMPTION (7/19, structure-not-color batch): the law's own text is
// "if it's a JACKET or a TRENCHCOAT" -- a poncho is one closed sheet of fabric
// by nature, so genPoncho outers are legal without a slit.
ok('every outer garment routes through genCoat or genPoncho', outerLines.length > 0 && outerLines.every(l => /genCoat\(|genPoncho\(/.test(l)));
// the preview must compose an under-outfit for outer (so the slit reveals real clothes)
ok('outer garments compose an under-outfit (previewGen)', /layer==='outer'[\s\S]{0,220}underOutfit\(/.test(src));

if (typeof genCoat === 'function') {
  // synthetic 56x56 part-id body: neck/torso/arms/legs/feet
  const CW = 56, g = new Array(CW * CW).fill(0);
  const fill = (x0, x1, y0, y1, id) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) g[y * CW + x] = id; };
  fill(26, 29, 15, 16, 3);  fill(23, 32, 16, 32, 4);
  fill(20, 23, 18, 33, 5);  fill(32, 35, 18, 33, 6);
  fill(24, 27, 33, 48, 9);  fill(28, 31, 33, 48, 10);
  fill(24, 27, 49, 52, 11); fill(28, 31, 49, 52, 12);
  const RAMP = { dk: [40, 30, 20], mid: [90, 70, 50], lt: [140, 110, 80] };
  const center = (coat) => { let sx = 0, sc = 0; for (let i = 0; i < g.length; i++) if (g[i] === 4) { sx += i % CW; sc++; } return Math.round(sx / sc); };
  const band = (coat, cx) => { let left = 0, right = 0, ctr = 0;
    for (let y = 20; y <= 46; y++) for (let x = 0; x < CW; x++) { const has = coat[y * CW + x] !== undefined;
      if (x < cx - 1 && has) left++; if (x > cx + 1 && has) right++; if (Math.abs(x - cx) <= 1 && has) ctr++; }
    return { left, right, ctr }; };
  // FRONT (S): must be open — two flaps + an unpainted center slit
  let front = null; try { front = genCoat(g, { ramp: RAMP, len: 0.86, open: 1, dir: 'S' }); } catch (e) { console.log('  run error(S): ' + e.message); }
  ok('genCoat renders front-facing', front && typeof front === 'object');
  if (front) { const cx = center(front), b = band(front, cx);
    ok('front coat has a left flap', b.left > 10);
    ok('front coat has a right flap', b.right > 10);
    ok('front coat is OPEN (center slit unpainted -> clothes show)', b.ctr < 8);
  }
  // PROFILE (E): must be SOLID — no slit down the side/legs (Paolo 7/18)
  let side = null; try { side = genCoat(g, { ramp: RAMP, len: 0.86, open: 1, dir: 'E' }); } catch (e) { console.log('  run error(E): ' + e.message); }
  ok('genCoat renders profile', side && typeof side === 'object');
  if (side) { const cx = center(side), b = band(side, cx);
    ok('profile coat is SOLID (no open center slit in the side view)', b.ctr > 12);
  }
}
console.log(`\n=== OPEN-COAT GATE: ${p} passed, ${f} failed ===`);
process.exit(f ? 1 : 0);
