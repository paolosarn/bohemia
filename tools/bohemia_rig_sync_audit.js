/* ===========================================================================
   BOHEMIA — IS THE GAME DRAWING THE RIG? (7/26/26)
   ---------------------------------------------------------------------------
   Paolo 7/26: "Are you tweaking? Are you not referring to the Rig at all?"

   Fair question, and nobody had ever checked. The alpha carries TWO copies of
   the painted body:
     - BAKED               , what the CHARACTER / ANIMATION tabs draw
     - BAKED inside RIG_B64, what the RIG tab (his authoring tool) draws
   They are supposed to be the same body. This diffs them, part by part,
   direction by direction.

     node tools/bohemia_rig_sync_audit.js

   REUSE CHECK: cooks zero pixels. It only compares two existing exports.
   =========================================================================== */
const fs = require('fs'), path = require('path');
const ALPHA = path.join(__dirname, '..', 'slices', 'BOHEMIA_ALPHA_0_9.html');
const src = fs.readFileSync(ALPHA, 'utf8');
function grab(t, name) {
  const m = new RegExp('(?:const|let|var)\\s+' + name + '\\s*=\\s*').exec(t);
  if (!m) return null;
  const i = t.indexOf('{', m.index + m[0].length); let d = 0;
  for (let k = i; k < t.length; k++) { if (t[k] === '{') d++; else if (t[k] === '}') { d--; if (!d) return t.slice(i, k + 1); } }
  return null;
}
const b64 = /const RIG_B64='([^']+)'/.exec(src);
if (!b64) { console.error('RIG_B64 not found'); process.exit(2); }
const rigHtml = Buffer.from(b64[1], 'base64').toString('utf8');
const A = JSON.parse(grab(src, 'BAKED')), R = JSON.parse(grab(rigHtml, 'BAKED'));
const NAME = { 1:'head', 2:'face', 3:'neck', 4:'torso', 5:'arm-L', 6:'arm-R',
               7:'hand-L', 8:'hand-R', 9:'thigh-L', 10:'thigh-R', 11:'foot-L', 12:'foot-R' };
let diffs = 0, pxDelta = 0;
console.log('=== THE GAME BODY vs THE RIG-TOOL BODY ===\n');
console.log('skeleton identical :', JSON.stringify(A.skeleton) === JSON.stringify(R.skeleton));
console.log('pose identical     :', JSON.stringify(A.pose) === JSON.stringify(R.pose));
console.log('layerOverride same :', JSON.stringify(A.layerOverride) === JSON.stringify(R.layerOverride));
console.log('');
for (const d in R.layers) for (const p in R.layers[d]) {
  const r = R.layers[d][p], a = (A.layers[d] || {})[p];
  if (JSON.stringify(r) === JSON.stringify(a)) continue;
  diffs++; pxDelta += Math.abs((a ? a.length : 0) - r.length);
  console.log('  ' + d.padEnd(3) + ' ' + (NAME[p] || p).padEnd(8) +
              ' rig ' + String(r.length).padStart(4) + 'px   game ' + String(a ? a.length : 0).padStart(4) + 'px');
}
console.log('\n' + (diffs ? diffs + ' painted parts differ, ' + pxDelta + ' pixels apart in total'
                          : 'the game draws exactly the body in the rig tool'));
process.exit(0);
