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
ok('every outer garment routes through genCoat', outerLines.length > 0 && outerLines.every(l => /genCoat\(/.test(l)));
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
  let coat = null;
  try { coat = genCoat(g, { ramp: { dk: [40, 30, 20], mid: [90, 70, 50], lt: [140, 110, 80] }, len: 0.86, open: 1 }); }
  catch (e) { console.log('  run error: ' + e.message); }
  ok('genCoat renders on a body', coat && typeof coat === 'object');
  if (coat) {
    let sx = 0, sc = 0; for (let i = 0; i < g.length; i++) if (g[i] === 4) { sx += i % CW; sc++; }
    const cx = Math.round(sx / sc);
    let leftFlap = 0, rightFlap = 0, centerCoat = 0;
    for (let y = 20; y <= 46; y++) for (let x = 0; x < CW; x++) {
      const has = coat[y * CW + x] !== undefined;
      if (x < cx - 1 && has) leftFlap++;
      if (x > cx + 1 && has) rightFlap++;
      if (Math.abs(x - cx) <= 1 && has) centerCoat++;
    }
    ok('coat has a left front flap', leftFlap > 10);
    ok('coat has a right front flap', rightFlap > 10);
    ok('coat FRONT IS OPEN (center slit unpainted -> clothes underneath show)', centerCoat < 8);
  }
}
console.log(`\n=== OPEN-COAT GATE: ${p} passed, ${f} failed ===`);
process.exit(f ? 1 : 0);
