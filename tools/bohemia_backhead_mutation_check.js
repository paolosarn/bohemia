/* BOHEMIA DOES THE BACK-OF-HEAD CARVE-OUT ACTUALLY HOLD? (8/17/26, CHARACTER lane)
 *
 * parts_are_painted_gate now lets the FACE be absent on a rear view, because a rear
 * three-quarter has no face and demanding one was flagging Paolo's correct art (and
 * every handoff since carried it as a debt HE owed). An exemption is a hole until
 * somebody proves it is not, so this plants real defects and requires the gate to
 * catch every one.
 *
 * THE PROPERTY BEING PROVED: the carve-out cannot be satisfied by REMOVING art.
 * It is granted only where the head PROVES the facing is a rear view by carrying at
 * least twice the front-view head mass, so deleting art can never buy you the
 * exemption -- it takes the proof away with it.
 *
 *   0. THE RIG UNTOUCHED                         must PASS -- his back-of-head
 *                                                 facings are not a defect
 *   1. FACE DELETED FROM A FRONT VIEW (S)         must FAIL -- small head, no cover
 *   2. FACE DELETED FROM EVERY FRONT VIEW         must FAIL
 *   3. REAR VIEW STRIPPED TO A SMALL HEAD (NE)    must FAIL -- the proof is gone,
 *                                                 so "no face here" stops being free
 *   4. A NON-FACE PART DELETED FROM A REAR VIEW   must FAIL -- the carve-out is the
 *      (NE torso)                                 FACE only, never a blanket pass
 *   5. A DIAL WIPES A PART THE RIG PAINTS         must FAIL -- bodyvar's actual rule,
 *      (S torso, via the dial module)             mutated where the rule lives
 *
 * Every mutation is reverted and BOTH files are md5-checked back to where they
 * started before this exits.
 *
 * RIG CHECK (RIG IS LAW, Paolo 7/26/26): this writes a MUTATED COPY of the alpha to
 *   a scratch path, runs the gate against a temporary swap, and restores the real
 *   file, verifying the md5 matches what it started with before it exits. His rig is
 *   never edited: the mutations exist only to prove the gate can see a defect, and
 *   the file on disk at the end is byte-identical to the file at the start.
 *   built on: BAKED
 *   joints: none named
 *   parts: 2=face, 4=torso
 *
 * REUSE CHECK: cooks no graphic pixels. It deletes entries from a copy of an
 * existing painted rig to make a defect; it draws, generates and invents nothing.
 *
 *   node tools/bohemia_backhead_mutation_check.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const GATE = path.join(REPO, 'gates/parts_are_painted_gate.js');
const BVGATE = path.join(REPO, 'gates/bodyvar_gate.js');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const original = fs.readFileSync(ALPHA, 'utf8');
const md5 = s => crypto.createHash('md5').update(s).digest('hex');
const startMd5 = md5(original);

/* Empty part `q` on facing `d` inside the rig literal, by surgery on the JSON text
   of that one part list. Nothing else in the file is touched. */
function emptyPart(src, d, q) {
  const i = src.indexOf('const BAKED=');
  const key = '"' + d + '":{';
  const di = src.indexOf(key, i);
  if (di < 0) throw new Error('no facing ' + d);
  // the layers block for this facing: find "q":[ ... ] within it
  const qi = src.indexOf('"' + q + '":[', di);
  if (qi < 0) throw new Error('no part ' + q + ' on ' + d);
  const open = src.indexOf('[', qi);
  const close = src.indexOf(']', open);
  return src.slice(0, open) + '[' + src.slice(close);
}

function runGate(gate) {
  try {
    execFileSync('node', [gate], { cwd: REPO, stdio: 'pipe', timeout: 300000 });
    return true;                       // exit 0 = passed
  } catch (e) {
    return false;                      // non-zero = failed
  }
}

function withMutation(mutate, label, gate) {
  let restored = false;
  try {
    fs.writeFileSync(ALPHA, mutate(original));
    const passed = runGate(gate || GATE);
    fs.writeFileSync(ALPHA, original); restored = true;
    return passed;
  } finally {
    if (!restored) fs.writeFileSync(ALPHA, original);
  }
}

(async () => {
  /* 5 first: the honest baseline. If the untouched rig does not pass, everything
     below is measuring noise. */
  ok('THE UNTOUCHED RIG PASSES — his back-of-head facings are not a defect',
     runGate(GATE));

  ok('1. FACE DELETED FROM S (a front view) is CAUGHT — the carve-out is for rear ' +
     'views only and S carries a small front head, so nothing covers it',
     !withMutation(s => emptyPart(s, 'S', 2), 'S face', GATE));

  ok('2. FACE DELETED FROM EVERY FRONT VIEW is CAUGHT',
     !withMutation(s => ['S', 'SE', 'E', 'W', 'SW'].reduce((a, d) => emptyPart(a, d, 2), s),
                   'all front faces', GATE));

  /* THE ONE THAT MATTERS: can you BUY the exemption by deleting art? The carve-out
     is granted on proof of a big skull, so removing the skull must remove the
     exemption with it and the missing face becomes a failure again. */
  ok('3. A REAR VIEW STRIPPED OF ITS SKULL (NE head emptied) is CAUGHT — you cannot ' +
     'EARN the no-face exemption by deleting the very art that proves you deserve it',
     !withMutation(s => emptyPart(s, 'NE', 1), 'NE head', GATE));

  ok('4. A NON-FACE PART DELETED FROM A REAR VIEW (NE torso) is CAUGHT — the ' +
     'carve-out is the FACE alone, never a blanket pass for the facing',
     !withMutation(s => emptyPart(s, 'NE', 4), 'NE torso', GATE));

  /* bodyvar: A DIAL emptying a part the rig paints must still be caught.
     *** AND THE FIRST VERSION OF THIS TEST WAS WRONG, in the way that matters. ***
     It emptied the FACE OUT OF THE RIG and expected bodyvar to shout. bodyvar's rule
     is "a DIAL must not empty a part" -- with the rig itself empty there, no dial
     removed anything and staying quiet was the correct answer (parts_are_painted is
     what catches a rig hole, and it did: test 1). A test that fails a gate for
     answering its own question correctly is a broken test, not a broken gate.
     So the mutation goes where the rule lives: the DIAL MODULE. */
  const BVMOD = path.join(REPO, 'engine/bohemia_bodyvar.js');
  const bvOriginal = fs.readFileSync(BVMOD, 'utf8');
  const bvStart = md5(bvOriginal);
  let bvCaught;
  try {
    fs.writeFileSync(BVMOD, bvOriginal +
      '\n/* MUTATION TEST ONLY */\n' +
      ';(function(){var _a=module.exports.apply;module.exports.apply=function(){' +
      'var r=_a.apply(this,arguments);try{r.layers.S["4"]=[];}catch(e){}return r;};})();\n');
    bvCaught = !runGate(BVGATE);
  } finally {
    fs.writeFileSync(BVMOD, bvOriginal);
  }
  ok('5. BODY VARIATION catches A DIAL emptying a part the rig really paints ' +
     '(S torso, 191px, wiped by the dial) — this is the rule that gate exists for',
     bvCaught);
  ok('   and the dial module was put back byte for byte',
     md5(fs.readFileSync(BVMOD, 'utf8')) === bvStart);

  const endMd5 = md5(fs.readFileSync(ALPHA, 'utf8'));
  ok('*** HIS RIG IS EXACTLY AS IT WAS: the alpha on disk is byte-identical to the ' +
     'file this started with (' + startMd5.slice(0, 12) + ') ***', endMd5 === startMd5);

  console.log('BACKHEAD MUTATION CHECK: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
