// BOHEMIA HOODIE LAW GATE (7/18/26). Born from the six-round hoodie saga
// (laws/BOHEMIA_ADDENDUM_VERIFY_ON_THE_REAL_SURFACE_7_18_26.md). Machine-locks
// the concrete defects so they can never re-ship:
//   1. HOOD COLLAR COVERS THE NECK: every neck (id 3) pixel painted, all facings.
//   2. HOOD FILLS THE CREW CARVE: zero unpainted torso (id 4) pixels -- the
//      crew-neck hole genTop carves for shirts must NOT leak into hoods.
//   3. SHIRTS KEEP THEIR NECK HOLE: crew tops still show skin at the throat
//      (the carve is intentional there -- the gate proves the split holds).
//   4. BACK-VIEW HOOD IS REAL: from N it covers the lower skull (head pixels at
//      the skull bottom) and adds geometry OUTSIDE the body silhouette.
// Extracts the REAL genTop + pure helpers from the alpha -- no trusted comments.
const fs = require('fs'), path = require('path');
const ALPHA = path.join(__dirname, '../slices/BOHEMIA_ALPHA_0_9.html');
let p = 0, f = 0; const ok = (n, c) => { c ? p++ : (f++, console.log('  > FAIL ' + n)); };

ok('the ONE alpha exists', fs.existsSync(ALPHA));
if (!fs.existsSync(ALPHA)) { console.log(`\n=== HOODIE GATE: ${p} passed, ${f} failed ===`); process.exit(1); }
const src = fs.readFileSync(ALPHA, 'utf8');

function grab(name) {
  const i = src.indexOf('function ' + name + '(');
  if (i < 0) return null;
  const s = src.indexOf('{', i); let d = 0;
  for (let k = s; k < src.length; k++) { if (src[k] === '{') d++; else if (src[k] === '}') { d--; if (!d) return src.slice(i, k + 1); } }
  return null;
}
const NAMES = ['mix', 'bshade', 'ext', 'pExt', 'genTop'];
const bodies = NAMES.map(grab);
ok('genTop + pure helpers found in the alpha', bodies.every(Boolean));

function makeGen(dir) {
  try { return new Function('CW', 'CH', 'curDir', bodies.join('\n') + '\nreturn genTop;')(56, 56, dir); }
  catch (e) { console.log('  eval error: ' + e.message); return null; }
}
const genS = makeGen('S'), genN = makeGen('N');
ok('genTop evaluates as a pure function', typeof genS === 'function' && typeof genN === 'function');

if (genS && genN) {
  // synthetic 56x56 part-id body WITH a head (the hood needs a skull)
  const CW = 56, g = new Array(CW * CW).fill(0);
  const fill = (x0, x1, y0, y1, id) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) g[y * CW + x] = id; };
  fill(24, 31, 6, 14, 1);   // head
  fill(25, 30, 9, 13, 2);   // face (front of the head)
  fill(26, 29, 15, 15, 3);  // neck
  fill(23, 32, 16, 32, 4);  // torso
  fill(20, 23, 18, 33, 5);  fill(32, 35, 18, 33, 6);   // arms
  fill(24, 27, 33, 48, 9);  fill(28, 31, 33, 48, 10);  // legs
  const RAMP = { dk: [40, 40, 44], mid: [80, 80, 88], lt: [120, 120, 130] };
  const idPix = (id) => { const out = []; for (let i = 0; i < g.length; i++) if (g[i] === id) out.push(i); return out; };
  const neckPix = idPix(3), torsoPix = idPix(4);

  let hoodS = null, hoodN = null, crewS = null;
  try { hoodS = genS(g, { ramp: RAMP, sleeves: 'long', neck: 'hood' }); } catch (e) { console.log('  hoodS error: ' + e.message); }
  try { hoodN = genN(g, { ramp: RAMP, sleeves: 'long', neck: 'hood' }); } catch (e) { console.log('  hoodN error: ' + e.message); }
  try { crewS = genS(g, { ramp: RAMP, sleeves: 'long', neck: 'crew' }); } catch (e) { console.log('  crewS error: ' + e.message); }
  ok('hood + crew render on a body', !!hoodS && !!hoodN && !!crewS);

  if (hoodS && hoodN && crewS) {
    const covered = (o, pix) => pix.every(i => o[i] !== undefined);
    // 1. the hood collar covers the whole neck, front AND back
    ok('HOOD covers every neck pixel (front)', covered(hoodS, neckPix));
    ok('HOOD covers every neck pixel (back)', covered(hoodN, neckPix));
    // 2. the hood fills the crew carve: no unpainted torso anywhere
    ok('HOOD leaves zero unpainted torso pixels (front)', covered(hoodS, torsoPix));
    ok('HOOD leaves zero unpainted torso pixels (back)', covered(hoodN, torsoPix));
    // 3. crew shirts KEEP the intentional neck hole (skin at the throat)
    const crewNeckOpen = neckPix.some(i => crewS[i] === undefined);
    const crewCarveOpen = torsoPix.some(i => crewS[i] === undefined);
    ok('CREW still shows the neck hole (the carve stays for shirts)', crewNeckOpen && crewCarveOpen);
    // 4. back-view hood is real: covers the lower skull + adds outside-the-body geometry
    let hb = -1; for (let i = 0; i < g.length; i++) if (g[i] === 1 || g[i] === 2) { const y = (i / CW) | 0; if (y > hb) hb = y; }
    const skullBottomCovered = idPix(1).some(i => ((i / CW) | 0) >= hb - 1 && hoodN[i] !== undefined);
    ok('back-view hood covers the lower skull', skullBottomCovered);
    const outside = Object.keys(hoodN).some(k => g[+k] === 0);
    ok('back-view hood adds pixels OUTSIDE the body silhouette', outside);
  }
}
console.log(`\n=== HOODIE GATE: ${p} passed, ${f} failed ===`);
process.exit(f ? 1 : 0);
