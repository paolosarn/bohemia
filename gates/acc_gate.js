// BOHEMIA ACCESSORIES GATE (7/19/26). FACTORY LAW: a new factory ships with its
// own regression gate, same turn. genAcc is the accessories factory; this locks:
//   1. ZONE LOCK: each type touches only its own region -- scarf: neck + upper
//      collar rows; mask: lower face; shades: the eye rows; gloves: hands only;
//      belt: the waist rows only.
//   2. THE EYES ARE SACRED: a mask never paints AT or ABOVE the eye rows (the
//      widest rows of the face); shades paint ONLY those rows.
//   3. DIRECTIONAL: shades invisible from behind; the scarf's back tail is
//      longer than its front drape.
// Extracts the REAL genAcc from the alpha; trusts no comments.
const fs = require('fs'), path = require('path');
const ALPHA = path.join(__dirname, '../slices/BOHEMIA_ALPHA_0_9.html');
let p = 0, f = 0; const ok = (n, c) => { c ? p++ : (f++, console.log('  > FAIL ' + n)); };

ok('the ONE alpha exists', fs.existsSync(ALPHA));
if (!fs.existsSync(ALPHA)) { console.log(`\n=== ACCESSORIES GATE: ${p} passed, ${f} failed ===`); process.exit(1); }
const src = fs.readFileSync(ALPHA, 'utf8');
function grab(name) {
  const i = src.indexOf('function ' + name + '(');
  if (i < 0) return null;
  const s = src.indexOf('{', i); let d = 0;
  for (let k = s; k < src.length; k++) { if (src[k] === '{') d++; else if (src[k] === '}') { d--; if (!d) return src.slice(i, k + 1); } }
  return null;
}
const body = grab('genAcc');
ok('genAcc found in the alpha', !!body);
function makeGen(dir) {
  try { return new Function('CW', 'CH', 'curDir', body + '\nreturn genAcc;')(56, 56, dir); }
  catch (e) { console.log('  eval error: ' + e.message); return null; }
}
const genS = makeGen('S'), genN = makeGen('N'), genE = makeGen('E');
ok('genAcc evaluates as a pure function', [genS, genN, genE].every(g => typeof g === 'function'));

if (genS && genN && genE) {
  const CW = 56, g = new Array(CW * CW).fill(0);
  const fill = (x0, x1, y0, y1, id) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) g[y * CW + x] = id; };
  fill(27, 28, 6, 6, 1); fill(25, 30, 7, 7, 1); fill(24, 31, 8, 14, 1);   // head, crown narrowing
  fill(25, 30, 8, 8, 2);                                                   // face: brow (6 wide)
  fill(24, 31, 9, 10, 2);                                                  // face: EYE rows (8 wide -- the widest)
  fill(25, 30, 11, 13, 2);                                                 // face: nose/mouth/chin (6 wide)
  fill(26, 29, 15, 15, 3);   // neck
  fill(23, 32, 16, 32, 4);   // torso
  fill(20, 23, 18, 33, 5); fill(32, 35, 18, 33, 6);   // arms
  fill(20, 23, 34, 36, 7); fill(32, 35, 34, 36, 8);   // hands
  const RAMP = { dk: [50, 40, 35], mid: [95, 75, 60], lt: [140, 115, 90] };
  const KINDS = ['scarf', 'mask', 'shades', 'gloves', 'belt'];
  const outs = {}; let renderOK = true;
  for (const k of KINDS) { try { outs[k + 'S'] = genS(g, { ramp: RAMP, kind: k }); outs[k + 'N'] = genN(g, { ramp: RAMP, kind: k }); outs[k + 'E'] = genE(g, { ramp: RAMP, kind: k }); }
    catch (e) { renderOK = false; console.log('  ' + k + ' error: ' + e.message); } }
  ok('all 5 kinds render S/N/E', renderOK && KINDS.every(k => outs[k + 'S'] && outs[k + 'N'] && outs[k + 'E']));

  if (renderOK) {
    const rows = (o) => Object.keys(o).map(i => (+i / CW) | 0);
    const parts = (o) => Object.keys(o).map(i => g[+i]);
    const EYE_A = 9, EYE_B = 10, TB = 32;
    // THE EYES ARE SACRED
    ok('mask never paints at or above the eye rows', ['S', 'E'].every(d => rows(outs['mask' + d]).every(y => y > EYE_B)));
    ok('mask actually covers the lower face (front)', rows(outs.maskS).some(y => y >= 11) && parts(outs.maskS).some(pt => pt === 2));
    ok('shades paint ONLY the eye rows', ['S', 'E'].every(d => rows(outs['shades' + d]).every(y => y >= EYE_A && y <= EYE_B)) && Object.keys(outs.shadesS).length > 0);
    ok('shades invisible from behind', Object.keys(outs.shadesN).length === 0);
    // ZONE LOCK
    ok('scarf touches only neck + upper collar', ['S', 'N', 'E'].every(d => Object.keys(outs['scarf' + d]).every(i => {
      const pt = g[+i], y = (+i / CW) | 0; return pt === 3 || (pt === 4 && y <= 16 + 4); })));
    ok('gloves touch only hands', ['S', 'N', 'E'].every(d => parts(outs['gloves' + d]).every(pt => pt === 7 || pt === 8)) && Object.keys(outs.glovesS).length > 0);
    ok('belt touches only the waist rows', ['S', 'N', 'E'].every(d => Object.keys(outs['belt' + d]).every(i => {
      const pt = g[+i], y = (+i / CW) | 0; return pt === 4 && y >= TB - 1 && y <= TB; })) && Object.keys(outs.beltS).length > 0);
    // DIRECTIONAL
    ok('scarf back tail longer than front drape', Object.keys(outs.scarfN).length > Object.keys(outs.scarfS).length);
    ok('every kind non-trivial (except shades from behind)', KINDS.every(k => Object.keys(outs[k + 'S']).length >= 4 || k === 'shades') && Object.keys(outs.shadesS).length >= 4);
  }
}
console.log(`\n=== ACCESSORIES GATE: ${p} passed, ${f} failed ===`);
process.exit(f ? 1 : 0);
