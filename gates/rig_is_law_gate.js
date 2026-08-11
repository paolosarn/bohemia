// BOHEMIA — THE RIG IS LAW GATE (7/26/26). FACTORY LAW: new law, new gate,
// same turn.
//
// Paolo 7/26/26, LOCKED: "The rig is law right this wherever you need to, the
// rig is the body law like for any animations or customization... no wonder
// you're having an issue making the female body, like the rig is law."
//
// WHAT WENT WRONG: the alpha carried TWO painted bodies -- its own BAKED, and
// the BAKED inside RIG_B64 that his RIG tab draws. They differed in 20 painted
// parts, 65 pixels, and the pose. He opened the rig, saw the body he painted,
// opened ANIMATION and watched a different body move, and was told the renderer
// was the problem. Every character-motion verdict he gave was taken against art
// he never made.
//
// WHY NOTHING CAUGHT IT: ENGINE SYNC LAW guarantees one canonical body per BOH_*
// module. BAKED is not a BOH_* module, so it was never covered, and two bodies
// lived in one file unnoticed for weeks. This gate closes that hole for the
// BODY specifically, and refuses to let a third copy appear anywhere.
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');
let p = 0, f = 0;
const ok = (n, c) => { c ? p++ : (f++, console.log('  > FAIL ' + n)); };
const done = () => { console.log(`\n=== RIG IS LAW GATE: ${p} passed, ${f} failed ===`); process.exit(f ? 1 : 0); };

ok('the ONE alpha exists', fs.existsSync(ALPHA));
ok('the law is recorded', fs.existsSync(path.join(ROOT, 'laws', 'BOHEMIA_ADDENDUM_RIG_IS_LAW_7_26_26.md')));
ok('the sync tool is checked in (a claim nobody can re-run is not a claim)',
  fs.existsSync(path.join(ROOT, 'tools', 'bohemia_rig_is_law_patch.py')));
ok('the audit tool is checked in', fs.existsSync(path.join(ROOT, 'tools', 'bohemia_rig_sync_audit.js')));
if (f) done();
const src = fs.readFileSync(ALPHA, 'utf8');

function grab(t, name) {
  const m = new RegExp('(?:const|let|var)\\s+' + name + '\\s*=\\s*').exec(t);
  if (!m) return null;
  const i = t.indexOf('{', m.index + m[0].length); let d = 0;
  for (let k = i; k < t.length; k++) { if (t[k] === '{') d++; else if (t[k] === '}') { d--; if (!d) return t.slice(i, k + 1); } }
  return null;
}
const b64 = /const RIG_B64='([^']+)'/.exec(src);
ok('the rig tool is embedded in the alpha', !!b64);
if (!b64) done();
const rigHtml = Buffer.from(b64[1], 'base64').toString('utf8');
const alphaTxt = grab(src, 'BAKED'), rigTxt = grab(rigHtml, 'BAKED');
ok('both bodies are extractable', !!alphaTxt && !!rigTxt);
if (!alphaTxt || !rigTxt) done();

/* THE LAW, IN ONE LINE. Byte-identical, not "equivalent", not "close enough" --
   65 pixels of difference is exactly how far apart they got while looking fine
   to everybody who never diffed them. */
ok('THE BODY THE GAME DRAWS IS BYTE-IDENTICAL TO THE BODY IN THE RIG TOOL', alphaTxt === rigTxt);
if (alphaTxt !== rigTxt) {
  try {
    const A = JSON.parse(alphaTxt), R = JSON.parse(rigTxt);
    console.log('      skeleton same: ' + (JSON.stringify(A.skeleton) === JSON.stringify(R.skeleton)));
    console.log('      pose same    : ' + (JSON.stringify(A.pose) === JSON.stringify(R.pose)));
    let n = 0;
    for (const d in R.layers) for (const q in R.layers[d])
      if (JSON.stringify(R.layers[d][q]) !== JSON.stringify((A.layers[d] || {})[q])) n++;
    console.log('      painted parts differing: ' + n);
    console.log('      fix: python3 tools/bohemia_rig_is_law_patch.py');
  } catch (e) { }
}

/* NO THIRD BODY. The whole failure was a second copy nobody knew about, so the
   gate counts copies rather than trusting that one exists. */
const topLevel = (src.match(/\bBAKED\s*=\s*\{/g) || []).length;
ok('exactly ONE body lives in the alpha itself', topLevel === 1);
let extra = [];
for (const m of src.matchAll(/const (\w+_B64)='([^']+)'/g)) {
  if (m[1] === 'RIG_B64') continue;
  let t; try { t = Buffer.from(m[2], 'base64').toString('utf8'); } catch (e) { continue; }
  const n = (t.match(/\bBAKED\s*=\s*\{/g) || []).length;
  if (n) extra.push(m[1] + ' carries ' + n);
}
ok('no other embedded surface carries its own body' + (extra.length ? ' [' + extra.join(', ') + ']' : ''), !extra.length);

/* the rig stays the AUTHORING surface: live edits must still flow rig -> alpha */
ok('a rig edit still rebuilds the character (the rig drives the game, not the reverse)',
  /BOHEMIA_RIG_STATE/.test(src) && /BAKED\.layers=st\.layers;BAKED\.skeleton=st\.skeleton;BAKED\.pose=st\.pose;/.test(src));
ok('rebuildFromRig is what redraws everything off the body', /function rebuildFromRig\(\)/.test(src));

/* the body sliders read the rig and never overwrite it */
/* ASK FOR THE PROPERTY, NEVER FOR THE SPELLING (8/11). This wanted the literal
   `BOH_BODYVAR.apply(BAKED,G.bodyVar)` and went red the moment the AGE AXIS
   composed on top of it -- BOH_BODYVAR.apply(BOH_AGE.apply(BAKED,stage), dials)
   still resolves FROM BAKED and still leaves it untouched, which is the thing
   this line is here to protect, but the regex could only recognise one way of
   writing it. Red on main for a day guarding something that never broke.
   The PROPERTY: BAKED is the root of what the dials resolve (it appears inside
   the apply call at any nesting), and nothing ever writes the resolved package
   back onto BAKED. */
/* AND IT HAS TO BE THE REAL ONE. Mutation-tested 8/11: pointing rebuildFromRig at
   a different body still passed this, because the alpha carries OTHER
   BOH_BODYVAR.apply(...BAKED...) text (the embedded rig tool, doc comments) and an
   unanchored search found one of those instead. A check a comment can satisfy is
   not a check. Anchored to rebuildFromRig's own body. */
const _rfr = (src.match(/function rebuildFromRig\(\)\s*\{[\s\S]{0,4000}?\n\}/) || [''])[0];
ok('the variation sliders resolve FROM the rig body, leaving it untouched',
  /BOH_BODYVAR\.apply\([^;\n]{0,200}?\bBAKED\b/.test(_rfr) &&
  !/\bBAKED\s*=\s*(?:BODY_PKG|BOH_BODYVAR|BOH_AGE)\b/.test(src));

done();
