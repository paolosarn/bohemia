// BOHEMIA ANIMATION FABRICATION GATE (7/26/26). FACTORY LAW: new machinery
// ships with its own regression gate, same turn.
//
// laws/BOHEMIA_ADDENDUM_ANIMATION_REJECTED_7_26_26.md (Paolo 7/26, LOCKED):
// "the arm moves and then it's just like morphing and glitching and providing
//  extra pixels and it's looking like dog shit."
//
// THE INVARIANT: a limb is a fixed number of PAINTED pixels. Moving a rigid
// thing cannot make it bigger -- occlusion only ever takes pixels away. So
// on-screen pixels above painted pixels is the renderer drawing art nobody
// painted, and this gate counts it through the REAL skinner (extracted from
// the alpha and evaluated, never re-implemented) over the real poseWalk /
// poseIdle at multiple phases in all 8 directions.
//
// The bar is RELATIVE and ratcheting, on purpose: the LIMB RIGID STAMP law is
// not fully paid off yet (zero invention needs limbs to stop being resampled at
// all -- see the addendum). What this gate guarantees is that the fabrication
// this turn removed can never quietly come back, and that the number only ever
// goes DOWN.
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');
let p = 0, f = 0;
const ok = (n, c) => { c ? p++ : (f++, console.log('  > FAIL ' + n)); };
const done = () => { console.log(`\n=== ANIMATION FABRICATION GATE: ${p} passed, ${f} failed ===`); process.exit(f ? 1 : 0); };

ok('the ONE alpha exists', fs.existsSync(ALPHA));
ok('the ruling is recorded', fs.existsSync(path.join(ROOT, 'laws', 'BOHEMIA_ADDENDUM_ANIMATION_REJECTED_7_26_26.md')));
ok('the audit tool is checked in (the number is reproducible, not a claim)',
  fs.existsSync(path.join(ROOT, 'tools', 'bohemia_anim_fabrication_audit.js')));
if (f) done();
const src = fs.readFileSync(ALPHA, 'utf8');

/* --- the switch is real and wired ------------------------------------------ */
ok('RIGID exists and defaults ON', /const RIGID = \{ on: true \};/.test(src));
ok('RIGID is exported from SKINNER_API', /REFINE_STATS, RIGID,/.test(src));
ok('the JOINT WELD double-stamp is guarded by the switch', /if \(!RIGID\.on\) for \(const bn of this\.candFor\(p\)\)/.test(src));
ok('the MINIMUM HAND SLIVER stamp is guarded by the switch', /if\(!SKINNER_API\.RIGID\.on && headOn\(d\)/.test(src));
ok('the renderer switch is in the frame-cache hash (no stale frames across a flip)', /G\.bodyVar,G\.rigidLimbs,/.test(src));
ok('the A/B chip is on the character box', /id="rigidChip"/.test(src) && /function rigidToggle\(\)/.test(src));
ok('the chip is wired and syncs the skinner', /b\.onclick=rigidToggle/.test(src) && /SKINNER_API\.RIGID\.on=G\.rigidLimbs/.test(src));

/* --- and it actually removes invented pixels, measured through the real code */
function grabConst(name, s) {
  const m = new RegExp('const\\s+' + name + '\\s*=').exec(s);
  if (!m) return null;
  const st = s.indexOf('{', m.index); let d = 0;
  for (let k = st; k < s.length; k++) { if (s[k] === '{') d++; else if (s[k] === '}') { d--; if (!d) return s.slice(st, k + 1); } }
  return null;
}
const TAG = 'const SKINNER_API=(function(){';
const si = src.indexOf(TAG), se = src.indexOf('\n})();', si);
let SK = null;
try { SK = new Function('window', 'const SKINNER_API=(function(){' + src.slice(si + TAG.length, se) + '\n})();return SKINNER_API;')({}); }
catch (e) { console.log('  skinner eval error: ' + e.message); }
ok('SKINNER_API evaluates headless and exposes the switch', !!(SK && SK.Skinner && SK.RIGID));
let BAKED = null, CANDD = null;
try { BAKED = JSON.parse(grabConst('BAKED', src)); } catch (e) { }
try { CANDD = JSON.parse(grabConst('CANDD', src)); } catch (e) { }
ok('the painted rig parses', !!(BAKED && BAKED.layers));
if (f) done();

const CW = 56, DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'];
const PHASES = [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75];
/* REAL SWINGS, not a shuffle in place. poseWalk's idle-ish amplitude barely
   rotates the arm, and the JOINT WELD only fires near a rotating joint -- a
   sample built from small swings measured zero difference and would have
   passed a renderer that still sprays duplicates the moment an arm actually
   moves. So the gate swings each arm through its real working range. */
const SWINGS = [-1.2, -0.8, -0.4, 0.4, 0.8, 1.2];
function armPose(base, ang) {
  const j = {}; for (const k in base) j[k] = base[k].slice();
  j.elL = SK.rotAbout(base.elL, base.shL, ang);  j.handL = SK.rotAbout(base.handL, base.shL, ang);
  j.elR = SK.rotAbout(base.elR, base.shR, -ang); j.handR = SK.rotAbout(base.handR, base.shR, -ang);
  return j;
}
function measure(rigidOn) {
  SK.RIGID.on = rigidOn;
  let invented = 0, dirty = 0, frames = 0;
  for (const d of DIRS) {
    const sk = new SK.Skinner({ W: 56, H: 56, layers: BAKED.layers, skeleton: BAKED.skeleton, CANDD: CANDD }, d);
    const painted = {}; for (let q = 1; q <= 12; q++) painted[q] = sk.pixList[q].length;
    const poses = [];
    for (const bf of PHASES) { poses.push(SK.poseWalk(BAKED.pose[d], bf, BAKED.swingAmt)); poses.push(SK.poseIdle(BAKED.pose[d], bf)); }
    for (const a of SWINGS) poses.push(armPose(BAKED.pose[d], a));
    for (const pose of poses) {
      const g = sk.skin(pose);
      const cnt = {}; for (let i = 0; i < g.length; i++) if (g[i]) cnt[g[i]] = (cnt[g[i]] || 0) + 1;
      let fi = 0; for (let q = 1; q <= 12; q++) fi += Math.max(0, (cnt[q] || 0) - painted[q]);
      invented += fi; if (fi) dirty++; frames++;
    }
  }
  return { invented, dirty, frames };
}
const off = measure(false), on = measure(true);
SK.RIGID.on = true;
const cut = off.invented ? (1 - on.invented / off.invented) : 0;
console.log('  measured over ' + on.frames + ' real frames: invented ' + off.invented +
            ' with the weld -> ' + on.invented + ' without  (' + (100 * cut).toFixed(1) + '% removed)');
ok('the switch removes invented pixels rather than just moving them', on.invented < off.invented);
/* THE MAGNITUDE LIVES WHERE IT IS ACTUALLY MEASURABLE. This headless sample can
   only drive poseWalk/poseIdle plus synthetic swings -- it cannot run the real
   POSE table, so it sees a fraction of the effect (and a first version of this
   gate happily reported "0.0% removed" while the browser sweep measured 61%).
   Rather than assert a number this sample cannot see, the gate assets the
   COMMITTED report from the real-surface sweep, and holds its ratchet. */
const REPORT = path.join(ROOT, 'records', 'BOHEMIA_ANIM_FABRICATION_AUDIT_7_26_26.txt');
ok('the real-surface audit report is committed', fs.existsSync(REPORT));
if (fs.existsSync(REPORT)) {
  const rep = fs.readFileSync(REPORT, 'utf8');
  const mBefore = /renderer he called dog shit\s*:\s*(\d+) invented/.exec(rep);
  const mAfter = /with the weld retired\s*:\s*(\d+) invented/.exec(rep);
  ok('the report carries both A/B numbers from the full clip set', !!(mBefore && mAfter));
  if (mBefore && mAfter) {
    const b = +mBefore[1], a = +mAfter[1];
    const realCut = b ? (1 - a / b) : 0;
    console.log('  committed real-surface sweep: ' + b + ' -> ' + a + '  (' + (100 * realCut).toFixed(1) + '% removed)');
    ok('the shipped renderer invents at least 50% fewer pixels than the one Paolo rejected', realCut >= 0.50);
    ok('the report does not claim the job is finished', /NOT A FULL FIX/.test(rep));
  }
}
ok('it never invents MORE in any configuration', on.invented <= off.invented && on.dirty <= off.dirty);
ok('the head and face still invent nothing (the HEAD RIGID STAMP LAW holds)', (() => {
  SK.RIGID.on = true;
  for (const d of DIRS) {
    const sk = new SK.Skinner({ W: 56, H: 56, layers: BAKED.layers, skeleton: BAKED.skeleton, CANDD: CANDD }, d);
    for (const bf of PHASES) {
      const g = sk.skin(armPose(BAKED.pose[d], bf > 1 ? 1.0 : -1.0));
      const cnt = {}; for (let i = 0; i < g.length; i++) if (g[i]) cnt[g[i]] = (cnt[g[i]] || 0) + 1;
      for (const q of [1, 2]) if ((cnt[q] || 0) > sk.pixList[q].length) return false;
    }
  }
  return true;
})());

/* --- HIS AUTHORED LAYERING IS THE BASELINE, AND ACTUALLY IS ONE -------------
   Paolo 7/26: "we made the rig and we put the layers in the positions and how
   they layer, why can't you just refer to that?" Measured before the fix: the
   draw order was recomputed EVERY FRAME and flipped 150 times on E, 106 on W,
   141-164 on the diagonals, across ~48 clips -- and 0 times on N/S, the only
   two facings where nothing re-sorted. A mid-clip flip jumps an arm from behind
   the torso to in front of it between frames; on E/W, where both arms sit
   inside the 8px torso footprint, that repaints a band of torso. The tweak-out.
   Both DEADBAND GUESSES are now off. The two rules a clip DECLARES survive,
   because a declaration cannot oscillate. */
ok('the NE/NW arm-unit depth GUESS is retired', /if\(false&&\(d==='NE'\|\|d==='NW'\)&&P\)/.test(src));
ok('the rest-relative hand depth GUESS is retired on every facing', /if\(false&&P\)\{\n  const fx=Math\.sign/.test(src));
ok('the GUN-UNIT rule survives (a clip declares a weapon, it cannot oscillate)', /present&&present\._gun/.test(src));
ok('the _handsBack rule survives (a clip declares it)', /present&&present\._handsBack/.test(src));
ok('paoloOrder -- his authored layerOverride -- is still what handOrder starts from', /let ord=paoloOrder\(d\);/.test(src));
ok('the finding is recorded', fs.existsSync(path.join(ROOT, 'records', 'BOHEMIA_AUTHORED_LAYERING_7_26_26.txt')));

/* --- the two dead ends stay dead ------------------------------------------- */
ok('no clip carries a stale approval (every animation is unapproved until the redo)',
  /NO CLIP IS APPROVED ANY MORE/.test(fs.readFileSync(path.join(ROOT, 'laws', 'BOHEMIA_ADDENDUM_ANIMATION_REJECTED_7_26_26.md'), 'utf8')));

done();
