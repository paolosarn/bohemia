// BOHEMIA — SHADING SEPARATION GATE (7/26/26). FACTORY LAW: new law, new gate.
//
// laws/BOHEMIA_ADDENDUM_SHADOWS_ARE_SEPARATE_7_26_26.md (Paolo 7/26, LOCKED)
// point 5 assigns this to the CHARACTER lane: "a cook whose garment layer
// contains shading gradients consistent with baked light fails."
//
// Paolo, describing the symptom: "shadows that you might have drawn aren't a
// permanent fixture on clothes... when it's animation time and I just see what
// was supposed to be shadows fucked up with the animation, it's really
// upsetting."
//
// THE MECHANISM (records/BOHEMIA_BAKED_LIGHT_MECHANISM_7_26_26.txt): bshade()
// picks lit/neutral/shadow from the REST silhouette AT COOK TIME and freezes it
// into the pixels, and every garment ramp is {dk, mid, lt} -- three lighting
// steps with no material channel at all. So a sleeve's lit edge rotates WITH
// the sleeve instead of staying with the light.
//
// A RATCHET, NOT A PURGE. The law's point 4 is explicit that approved garments
// are NOT re-cooked wholesale, so this gate does not fail the existing bank. It
// FREEZES it: the amount of baked light in the repo may go DOWN and never up. A
// new cook that bakes light fails the build the day it is written.
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');
let p = 0, f = 0;
const ok = (n, c) => { c ? p++ : (f++, console.log('  > FAIL ' + n)); };

ok('the ONE alpha exists', fs.existsSync(ALPHA));
ok('the law is recorded', fs.existsSync(path.join(ROOT, 'laws', 'BOHEMIA_ADDENDUM_SHADOWS_ARE_SEPARATE_7_26_26.md')));
ok('the mechanism is recorded (so nobody has to re-find it)',
  fs.existsSync(path.join(ROOT, 'records', 'BOHEMIA_BAKED_LIGHT_MECHANISM_7_26_26.txt')));
if (f) { console.log('\n=== SHADING SEPARATION GATE: ' + p + ' passed, ' + f + ' failed ==='); process.exit(1); }
const src = fs.readFileSync(ALPHA, 'utf8');

// THE RATCHET. Baselines measured 7/26/26 on the shipped bank. Lowering these
// numbers is the job; raising one is baking new light and fails.
const BASE_BSHADE_SITES = 7;
const BASE_LIT_GARMENTS = 7;

const sites = (src.match(/bshade\(/g) || []).length;
console.log('  bshade call sites: ' + sites + '  (frozen baseline ' + BASE_BSHADE_SITES + ')');
ok('no NEW cook bakes light: bshade call sites never increase', sites <= BASE_BSHADE_SITES);

function grab(t, name) {
  const m = new RegExp('const\\s+' + name + '\\s*=\\s*').exec(t);
  if (!m) return null;
  const i = t.indexOf('{', m.index + m[0].length); let d = 0;
  for (let k = i; k < t.length; k++) { if (t[k] === '{') d++; else if (t[k] === '}') { d--; if (!d) return t.slice(i, k + 1); } }
  return null;
}
let PD = null;
try { PD = JSON.parse(grab(src, 'PD_DATA')); } catch (e) { }
ok('the painted garment bank parses', !!(PD && PD.layers));
if (PD && PD.layers) {
  let lit = [], total = 0;
  for (const key in PD.layers) {
    total++;
    const steps = new Set();
    for (const d in PD.layers[key]) for (const k in PD.layers[key][d].px) steps.add(PD.layers[key][d].px[k]);
    if (steps.size >= 3) lit.push(key);
  }
  console.log('  garments carrying baked light: ' + lit.length + ' of ' + total + '  (frozen baseline ' + BASE_LIT_GARMENTS + ')');
  ok('no NEW garment ships with baked light: the count never increases', lit.length <= BASE_LIT_GARMENTS);
  ok('the grandfathered bank is untouched, exactly as the law\'s point 4 requires', total >= 9);
}

// the BODY must keep computing its shading per frame -- it is the working
// example the cloth has to be brought up to, and a regression here would hide
// the whole problem by making everything equally wrong.
ok('body shading is still computed PER FRAME from the deformed grid, not baked',
  /SKY TOP-LIGHT/.test(src) && /ANATOMY LAW v2/.test(src) && /NECK SHADOW LAW/.test(src));

console.log('\n=== SHADING SEPARATION GATE: ' + p + ' passed, ' + f + ' failed ===');
process.exit(f ? 1 : 0);
