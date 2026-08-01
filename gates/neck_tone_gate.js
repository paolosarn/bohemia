// BOHEMIA — NECK TONE + CURTAIN BOB GATE (7/27/26). FACTORY LAW: new law, new gate.
//
// Paolo 7/27, two asks in one message:
//   "i wanted the neck color to be just a slightly very slightly barely notieable
//    different skin tone than the face."
//   "heres the code for the updated curtain bob hair please apply"
//
// THE ONE WAY THE NECK TONE SILENTLY GOES WRONG: the pass runs AFTER garments
// composite. A neck cell can be wearing a collar -- the body grid still says
// "neck" while the pixel is cloth -- so an unguarded multiply darkens his hoodie.
// It did: 25.1 -> 23.1 dressed, before the skin-only guard went in. That is the
// kind of change nobody sees and nobody reverts, so it is pinned here.
//
// AND THE HAIR: a repaint must never become a retint. His export carries the ramp
// alongside the pixels; if a future export's ramp drifts, the applier must refuse
// rather than quietly recolour his hair as a side effect of a shape update.
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');
const NECKTOOL = path.join(ROOT, 'tools', 'bohemia_neck_tone_patch.py');
const HAIRTOOL = path.join(ROOT, 'tools', 'bohemia_apply_curtain_bob_7_27.py');
const EXPORT = path.join(ROOT, 'records', 'rig', 'CURTAIN_BOB_7_27_26.json');
let p = 0, f = 0;
const ok = (n, c) => { c ? p++ : (f++, console.log('  > FAIL ' + n)); };
const done = () => { console.log(`\n=== NECK TONE + CURTAIN BOB GATE: ${p} passed, ${f} failed ===`); process.exit(f ? 1 : 0); };

ok('the alpha exists', fs.existsSync(ALPHA));
ok('the neck tone tool is kept', fs.existsSync(NECKTOOL));
ok('the curtain bob applier is kept', fs.existsSync(HAIRTOOL));
ok('his rig export is kept verbatim in records/', fs.existsSync(EXPORT));
if (f) done();
const src = fs.readFileSync(ALPHA, 'utf8');
const nt = fs.readFileSync(NECKTOOL, 'utf8');
const ht = fs.readFileSync(HAIRTOOL, 'utf8');

/* ---- the neck tone ------------------------------------------------------ */
ok('NECK_TONE is declared exactly once', (src.match(/const NECK_TONE/g) || []).length === 1);
ok('it is on, targets part 3, and the amount is a single tunable flag',
  /const NECK_TONE = \{ on: true, part: 3, mul: [0-9.]+, throatRows: [0-9]+,/.test(src));

const iClose = src.indexOf('return { Skinner, REFINE_STATS,');
const iFlag = src.indexOf('const NECK_TONE');
const iFn = src.indexOf('function buildFrame(d,clip,ph){');
ok('the scope anchors are found', iClose > 0 && iFlag > 0 && iFn > 0);
ok('NECK_TONE is declared OUTSIDE the skinner closure and BEFORE buildFrame',
  iFlag > iClose && iFlag < iFn);

/* Capture the block INCLUDING its header comment -- the law it states about
   itself (tone not shadow, reuse-first, the rejected ramp snap) lives there, and
   a gate that only reads the executable lines cannot see a doc rot. */
const m = src.match(/  \/\* =+\n     THE NECK IS ITS OWN SKIN TONE[\s\S]*?if\(NECK_TONE\.on\)\{[\s\S]*?\n  \}/);
ok('the neck tone pass is present', !!m);
if (!m) done();
const pass = m[0];

/* THE GUARD. This is the whole gate. */
ok('SKIN ONLY: the pass checks each pixel against the live skin ramp before touching it',
  /skinRampFor\(\)/.test(pass) && /if\(!_sk\[/.test(pass));
ok('it only touches the neck part or the throat rows',
  /if\(_q!==npart&&!_isThroat\)continue;/.test(pass));
ok('the collar regression is recorded at the code, with its number',
  /25\.1 -> 23\.1 dressed/.test(pass));
ok('it never writes the occupancy grid', !/grid\[i\]=/.test(pass));

/* IT IS A TONE, NOT A SHADOW -- SHADOWS ARE SEPARATE (7/26) must not be eroded. */
ok('the code states plainly that this is a TONE and not a shadow',
  /A TONE, NOT A SHADOW/.test(pass));
ok('the reason it is not a shadow is on the record: fixed per facing, fixed per frame',
  /not vary per facing/.test(pass) && /identical on every frame of every clip/.test(pass));
ok('REUSE-FIRST: no new hue -- it scales HIS tone rather than inventing one',
  /no new hue is cooked/.test(pass) && /scaled/.test(pass));
ok('the ramp-stop snap is recorded as REJECTED, with the reason',
  /44 units apart/.test(pass) && /hard band/.test(pass));
ok('the stale "runs before garments" claim is gone from the code',
  !/Runs before garments composite/.test(pass));
ok('the tool no longer claims it runs before garments either',
  !/BEFORE garments composite, so a collar/.test(nt));
ok('the tool records the honest headline: the collar hides the neck on this outfit',
  /INVISIBLE on the dressed character/.test(nt));

/* ---- the hair ----------------------------------------------------------- */
ok('the applier refuses to retint his hair as a side effect of a shape update',
  /refusing to retint/.test(ht) && /new\['ramps'\] != old_ramp/.test(ht));
ok('the applier refuses a layer-box change (the rig grid is fixed)',
  /the rig grid is fixed/.test(ht));
ok('the applier refuses unknown directions instead of inventing a pipeline change',
  /directions the build does not author/.test(ht));
ok('REUSE CHECK is documented (it cooks no art)', /REUSE CHECK/.test(ht));
ok('RIG LAW is stated: his pixels are copied verbatim, never reshaped',
  /VERBATIM/.test(ht) && /does not reshape/.test(ht));

const exp = JSON.parse(fs.readFileSync(EXPORT, 'utf8'));
ok('the export is the curtain bob', exp.garment === 'hair/curtain-bob');
const iPD = src.indexOf('const PD_DATA = ');
const pd = JSON.parse(src.slice(iPD + 'const PD_DATA = '.length, src.indexOf('\n', iPD)).trim().replace(/;$/, ''));
const live = pd.layers['hair/curtain-bob'];
ok('the curtain bob is in the build', !!live);
ok('HIS PIXELS ARE WHAT SHIPS: every authored direction matches his export byte for byte',
  !!live && Object.keys(exp.layers).every(d => JSON.stringify(live[d]) === JSON.stringify(exp.layers[d])));
ok('the ramp is still his', JSON.stringify(pd.ramps['hair/curtain-bob']) === JSON.stringify(exp.ramps));
ok('W/NW/SW are still mirrored, not authored',
  !!live && !['W', 'NW', 'SW'].some(d => live[d]));


/* ---- THE THROAT, and the two bugs that made the first builds wrong -------- */
ok('the tone also takes the visible THROAT, because the cowl covers 100% of part 3',
  /_isThroat/.test(pass) && /NECK_TONE\.throatRows/.test(pass));
ok('the throat row is found from the ART each frame, never hardcoded to a row number',
  /if\(y>_throatY\)_throatY=y;/.test(pass));
ok('the zero-visible-neck measurement is on the record at the code',
  /S 0\/8, SE 0\/10, E 0\/9, W 0\/9, N 6\/12/.test(pass));
ok('part 3 KEEPS its tone too -- nothing was taken away',
  /nothing is taken away/.test(pass));

/* THE SHARED DARK ENTRY. skinRampFor()[0] is 28,22,24 and that exact colour is
   also in the jacket/pants/shoes ramps, so a naive "is it skin" test matches every
   dark sleeve pixel. It did: the first build of the arm fix repainted whole sleeves
   as bare skin. Both passes must skip index 0. */
/* ---- A LONG SLEEVE STOPS AT THE HAND (Paolo 7/29/26, LOCKED) --------------
   "if a clothing item is long sleeve it stops at the hand!! whats that blob of
   skin doing its terrible". The rig proves the rule: facing S the same jacket
   runs cloth solid to the hand with ZERO bare-arm rows, while E and W leaked
   2-3px of forearm on rows 32-34. That leak is the blob he circled twice.

   THIS REPLACED the 7/27 "skin above the hand" pass, which restored the BODY's
   skin onto those cells -- it cured a bright garment blob by making a flat skin
   blob, and it was the wrong direction. Those cells were always meant to be
   cloth. The old pass and its snapshot are gone; this gate refuses to let either
   come back. */
const armM = src.match(/A LONG SLEEVE STOPS AT THE HAND[\s\S]*?if\(best\)px\[i\]=\[best\[0\],best\[1\],best\[2\]\];/);
ok('the sleeve-to-the-hand pass is present', !!armM);
ok('the retired skin-restore pass is GONE, not left dormant',
  !/_armBody/.test(src) && !/a garment's HAND tone on an ARM/.test(src));
if (armM) {
  const ap = armM[0];
  ok('LONG SLEEVE IS MEASURED per limb per frame, never assumed',
    /if\(lastCloth < handTop-1\) continue;/.test(ap));
  ok('a SHORT sleeve is left completely alone (a t-shirt still bares a forearm)',
    /SHORT SLEEVE/.test(ap));
  ok('it only touches ARM parts, paired to their own hand',
    /for\(const \[armP,handP\] of \[\[5,7\],\[6,8\]\]\)/.test(ap));
  ok('REUSE-FIRST: the colour is HIS OWN SLEEVE, nearest cloth on that same arm',
    /HIS OWN SLEEVE: nearest cloth pixel on this same arm/.test(ap));
  ok('it never writes the occupancy grid', !/grid\[i\]=/.test(ap));
  ok('the rig measurement that proves the rule is recorded at the code',
    /BARE ARM ROWS = none/.test(ap) && /rows 32,33,34/.test(ap));
  ok('the wrong direction of the 7/27 pass is recorded so it is not re-tried',
    /it was the wrong direction/.test(ap));
}



/* ONE TILE ON E AND W (Paolo 7/28: "Make the neck one tile less facing east and
   west... towards the chin"). In profile there is far less throat between jaw and
   collar than head-on, so two rows reached up into the chin. */
ok('the throat row count is per-facing', /throatRowsByDir/.test(src));
ok('E and W take ONE row; every other facing keeps two',
  /throatRowsByDir: \{ E: 1, W: 1 \}/.test(src) && /throatRows: 2,/.test(src));
ok('the per-facing override is actually read by the pass',
  /NECK_TONE\.throatRowsByDir\[d\]!=null/.test(pass));
ok('a zero row count is honoured rather than underflowing into the whole face',
  /_tRows<=0/.test(pass));
ok('his reason is recorded at the code', /towards the chin/.test(src));


/* ---- PAOLO'S 7/28 RIG EDIT: THE CHIN AND NECK IN PROFILE ------------------
   He pasted a full rig export saying "i updated the neck and chin". Diffed
   against the live BAKED it was FOUR pixels: one column at the chin/neck seam
   on each profile facing (E x=30, W x=25, rows 15-16). A four-pixel edit inside
   a full-package paste is exactly the kind of thing a later rig apply reverts
   without anyone noticing, so the live body is checked against his export. */
/* SUPERSEDED 7/31: this pinned his 7/28 head/face/neck. He then shipped a 7/31
   export -- "i updated the face in the rig... biggest changes are for ne and nw
   where i tried to simulate ears but ur redarded so i just removed it" -- and
   this gate went red holding the body to the OLDER export.
   NEWEST DATE WINS (truth hierarchy), and a gate never outranks a ruling: the
   live pin moves to 7/31. The 7/28 file stays in records/ as history, not as
   the check. The 7/31 body is additionally fingerprinted whole by
   gates/rig_no_drift_gate.py, which is the stronger lock. */
const RIGEDIT = path.join(ROOT, 'records', 'rig', 'RIG_FACE_7_31_26.json');
const RIGTOOL = path.join(ROOT, 'tools', 'bohemia_apply_rig_face_7_31.py');
ok('his LATEST rig export (7/31) is kept verbatim in records/', fs.existsSync(RIGEDIT));
ok('the applier is kept', fs.existsSync(RIGTOOL));
if (fs.existsSync(RIGEDIT)) {
  const want = JSON.parse(fs.readFileSync(RIGEDIT, 'utf8'));
  const m2 = /(?:const|let|var)\s+BAKED\s*=\s*/.exec(src);
  let baked = null;
  if (m2) { const i0 = src.indexOf('{', m2.index + m2[0].length); let dd = 0;
    for (let k = i0; k < src.length; k++) { if (src[k] === '{') dd++;
      else if (src[k] === '}') { dd--; if (!dd) { baked = JSON.parse(src.slice(i0, k + 1)); break; } } } }
  ok('the live BAKED is extractable', !!baked);
  if (baked) {
    /* HIS 7/31 EXPORT, PLUS THE TEN PIXELS HE AUTHORISED DELETING ON 8/1 -- and
       nothing else. Asked whether to remove the leftover "ear" pixels on NE/NW or
       send a fresh export, he said: "Delete them yourself". Four FACE pixels per
       side became HEAD and the one-pixel HOLE at row 10 was filled with HEAD, so
       the skull is continuous and the ear is gone.
       This is NOT loosened to "close enough". The allowance is exactly two columns
       on two facings, enumerated below; any other byte still fails. Record:
       records/rig/EAR_REMNANT_DELETED_8_1_26.txt */
    const EAR = { NE: 32, NW: 23 }, EARROWS = [8, 9, 10, 12, 13];
    const allowed = (d, q, idx) => {
      const col = EAR[d]; if (col === undefined) return false;
      const row = Math.floor(idx / 56); if (idx % 56 !== col) return false;
      if (!EARROWS.includes(row)) return false;
      return q === '1' || q === '2';          /* head gained them, face lost them */
    };
    let bad = 0, earFixed = 0;
    for (const d in want) for (const q of ['1', '2', '3']) {
      const a = baked.layers[d][q] || [], b = want[d][q] || [];
      const A = new Set(a), B = new Set(b);
      for (const v of A) if (!B.has(v)) { allowed(d, q, v) ? earFixed++ : bad++; }
      for (const v of B) if (!A.has(v)) { allowed(d, q, v) ? earFixed++ : bad++; }
    }
    ok('THE HEAD, FACE AND NECK THE GAME DRAWS ARE HIS 7/31 EXPORT, byte for byte '
       + '(plus the ' + earFixed + ' ear pixels he told me to delete on 8/1)', bad === 0);
    /* 18 DIFFS, 10 PIXELS. A pixel that moved from FACE to HEAD shows up twice --
       once leaving part 2, once joining part 1 -- so the four re-classified pixels
       per side are 8 diffs, plus 1 for the filled hole: 9 a side, 18 in total.
       My first assertion here said 10 and was simply wrong about its own arithmetic. */
    ok('the ear remnant really is gone from BOTH back-angled facings '
       + '(' + earFixed + ' diffs = 10 pixels: 8 re-classified + 2 holes filled)',
      earFixed === 18);
    ok('and the skull has no hole left at row 10 on either side',
      baked.layers.NE['1'].includes(10 * 56 + 32) && baked.layers.NW['1'].includes(10 * 56 + 23));
    ok('the chin/neck column he removed on E is gone (face idx 870, neck idx 926)',
      baked.layers.E['2'].indexOf(870) < 0 && baked.layers.E['3'].indexOf(926) < 0);
    ok('the chin/neck column he removed on W is gone (face idx 865, neck idx 921)',
      baked.layers.W['2'].indexOf(865) < 0 && baked.layers.W['3'].indexOf(921) < 0);
  }
}
ok('the applier refuses a skeleton/pose/layer-order change rather than applying it blind',
  /that is not a chin\/neck edit, stop and check/.test(fs.readFileSync(RIGTOOL, 'utf8')));
ok('the applier keeps the rig tool byte-identical (RIG IS LAW)',
  /would not be byte-identical after patching/.test(fs.readFileSync(RIGTOOL, 'utf8')));

done();
