// BOHEMIA HEADWEAR GATE (7/18/26). FACTORY LAW: a new factory ships with its own
// regression gate, same turn. genHat is the headwear factory; this locks its laws:
//   1. NEVER THE EYES: no hat paints face pixels below the forehead band
//      (top 30% of the head). The brow line is the hard floor.
//   2. NEVER THE BODY: hats touch only skull/forehead/background -- zero pixels
//      on neck/torso/arms/legs.
//   3. ON TOP OF THE SKULL: every kind adds geometry ABOVE the head top
//      (outside the skeleton) except the wrap, which hugs the skull by design.
//   4. DIRECTIONAL: the cap's brim pokes past the head in front but not from
//      behind -- hats read differently per facing, not stamped.
// Extracts the REAL genHat from the alpha; trusts no comments.
const fs = require('fs'), path = require('path');
const ALPHA = path.join(__dirname, '../slices/BOHEMIA_ALPHA_0_9.html');
let p = 0, f = 0; const ok = (n, c) => { c ? p++ : (f++, console.log('  > FAIL ' + n)); };

ok('the ONE alpha exists', fs.existsSync(ALPHA));
if (!fs.existsSync(ALPHA)) { console.log(`\n=== HEADWEAR GATE: ${p} passed, ${f} failed ===`); process.exit(1); }
const src = fs.readFileSync(ALPHA, 'utf8');

function grab(name) {
  const i = src.indexOf('function ' + name + '(');
  if (i < 0) return null;
  const s = src.indexOf('{', i); let d = 0;
  for (let k = s; k < src.length; k++) { if (src[k] === '{') d++; else if (src[k] === '}') { d--; if (!d) return src.slice(i, k + 1); } }
  return null;
}
const body = grab('genHat');
ok('genHat found in the alpha', !!body);

function makeGen(dir) {
  try { return new Function('CW', 'CH', 'curDir', body + '\nreturn genHat;')(56, 56, dir); }
  catch (e) { console.log('  eval error: ' + e.message); return null; }
}
const genS = makeGen('S'), genN = makeGen('N');
ok('genHat evaluates as a pure function', typeof genS === 'function' && typeof genN === 'function');

if (genS && genN) {
  const CW = 56, g = new Array(CW * CW).fill(0);
  const fill = (x0, x1, y0, y1, id) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) g[y * CW + x] = id; };
  fill(24, 31, 6, 14, 1);   // head
  fill(25, 30, 8, 13, 2);   // face (front of the head, brow to chin)
  fill(26, 29, 15, 15, 3);  // neck
  fill(23, 32, 16, 32, 4);  // torso
  fill(20, 23, 18, 33, 5);  fill(32, 35, 18, 33, 6);   // arms
  const RAMP = { dk: [50, 50, 55], mid: [95, 95, 105], lt: [135, 135, 148] };
  const hTop = 6, hBot = 14, band = hTop + Math.round((hBot - hTop) * 0.3);
  const KINDS = ['beanie', 'cap', 'brim', 'wrap'];
  const outs = {};
  let renderOK = true;
  for (const k of KINDS) {
    try { outs[k + 'S'] = genS(g, { ramp: RAMP, kind: k }); outs[k + 'N'] = genN(g, { ramp: RAMP, kind: k }); }
    catch (e) { renderOK = false; console.log('  ' + k + ' error: ' + e.message); }
  }
  ok('all 4 kinds render front + back', renderOK && KINDS.every(k => outs[k + 'S'] && outs[k + 'N']));

  if (renderOK) {
    const every = (fn) => KINDS.every(k => ['S', 'N'].every(d => fn(outs[k + d])));
    // 1. never the eyes: no painted pixel is a face pixel below the band
    ok('no hat touches the face below the forehead band', every(o =>
      Object.keys(o).every(i => !(g[+i] === 2 && ((+i / CW) | 0) > band))));
    // 2. never the body
    ok('no hat touches the body (neck/torso/arms)', every(o =>
      Object.keys(o).every(i => g[+i] !== 3 && g[+i] !== 4 && g[+i] !== 5 && g[+i] !== 6)));
    // 3. on top of the skull: beanie/cap/brim add pixels above the head top
    ok('beanie/cap/brim add geometry above the skull top', ['beanie', 'cap', 'brim'].every(k =>
      Object.keys(outs[k + 'S']).some(i => ((+i / CW) | 0) < hTop)));
    // 4. directional cap brim: pokes past the head width in front, not from behind
    const beyond = (o) => Object.keys(o).some(i => { const x = +i % CW; return x < 24 || x > 31; });
    ok('cap brim pokes past the head in FRONT', beyond(outs.capS));
    ok('cap brim absent from BEHIND', !beyond(outs.capN));
    // wide brim ring reads from every angle
    ok('wide brim extends past the head in front AND back', beyond(outs.brimS) && beyond(outs.brimN));
    // wrap: the back view carries the knot detail (more pixels than the plain front band)
    ok('wrap has its knot from behind', Object.keys(outs.wrapN).length > Object.keys(outs.wrapS).length);
    ok('every kind paints a non-trivial pixel count', every(o => Object.keys(o).length >= 8));
  }
}
console.log(`\n=== HEADWEAR GATE: ${p} passed, ${f} failed ===`);
process.exit(f ? 1 : 0);
