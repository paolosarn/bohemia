/* ============================================================================
   NO PAINT GATE (8/3/26, LAB lane)

   Paolo 8/3, on Machine Party: "I really want my game to look more like that very
   good"

   Law:   laws/BOHEMIA_ADDENDUM_NO_PAINT_8_3_26.md
   Study: records/BOHEMIA_RESEARCH_MACHINE_PARTY_8_3_26.md

   THE HARD PART OF GATING THIS: "looks more like Machine Party" is not measurable
   and never will be -- only he can say whether the world looks right, and clause 13
   of the answered index says he thumbs and nothing else decides. So this gate does
   NOT try to score the look. It checks the three things a machine actually can:

     1. THE LAW IS INTACT, and the two things it explicitly refuses to decide -- the
        grime decision and the palette -- are still pending.
     2. THE STUDY IS STILL HONEST. It is DOC_ONLY (no primary page was reachable, and
        I never saw the game move), and a study that quietly loses that disclosure is
        worse than no study. Its 3D-versus-pixel-art warning is load-bearing too: a
        lane that reads it as "make it 3D" breaks the 45 DEGREE ART LAW.
     3. NOBODY TREATED THE ADDENDUM AS PERMISSION. This is the check that matters.
        A named visual reference plus a written brief is the exact document shape that
        reads like a green light for the art lane while the freeze is ON, and
        STOP PRODUCING says finding a legal-looking way to ship anyway IS the
        violation. So the sweep hunts for DERIVATIVE WORK: any file that cites this
        law and then defines a palette off it, or declares the freeze over.

   Both halves of the recurring bug class in this repo are guarded against here:
   prose is NORMALISED (markup stripped) before matching, and every per-item check is
   scoped TO THE ITEM instead of to a flat character window.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const LAW = 'laws/BOHEMIA_ADDENDUM_NO_PAINT_8_3_26.md';
const STUDY = 'records/BOHEMIA_RESEARCH_MACHINE_PARTY_8_3_26.md';
const LEANS_ON = [
  'laws/BOHEMIA_ADDENDUM_NOTES_ARE_RULINGS_7_19_26.md',
  'laws/BOHEMIA_ADDENDUM_STOP_PRODUCING_7_26_26.md',
  'laws/BOHEMIA_ADDENDUM_TRAUMATIC_NOT_GORY_7_31_26.md',
  'records/BOHEMIA_RESEARCH_CRISIS_RESPONSE_VIOLENCE_7_31_26.md'
];

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

console.log('='.repeat(74));
console.log('NO PAINT GATE — Machine Party is a NAMED VISUAL REFERENCE,');
console.log('                and naming one is not permission to cook');
console.log('='.repeat(74));

/* STRIP THE MARKUP, THEN COLLAPSE -- the shape traumatic_gate wrote down after the
   eighth prose check in this repo assumed the text was flat. Underscores are NOT
   stripped here on purpose: every filename in these documents is full of them. */
const norm = (t) => t
  .replace(/^[ \t]*>[ \t]?/gm, '')
  .replace(/[*`]/g, '')
  .replace(/\s+/g, ' ');

ok('A1 the law exists', fs.existsSync(path.join(ROOT, LAW)));
if (!fs.existsSync(path.join(ROOT, LAW))) process.exit(1);
const rawLaw = fs.readFileSync(path.join(ROOT, LAW), 'utf8');
const law = norm(rawLaw);

ok('A2 it quotes his direction verbatim',
   /I really want my game to look more like that very good/.test(law));
ok('A3 dated and LOCKED', /8\/3\/26, LOCKED/.test(law));
ok('A4 it records the direction as a RULING, not a proposal, and cites the law that says so',
   /NOTES_ARE_RULINGS/.test(law) && /a direction he states is a ruling/i.test(law));

[['1 NO PAINT', /CLAUSE 1[^|]*?NO PAINT/i],
 ['2 the grime is ONE PASS', /CLAUSE 2[^|]*?ONE PASS OVER EVERYTHING/i],
 ['3 dark is the DEFAULT', /CLAUSE 3[^|]*?DARK IS THE DEFAULT/i],
 ['4 the ramp is narrow, the colours are HIS', /CLAUSE 4[^|]*?THE COLOURS ARE HIS/i],
 ['5 we refuse his readability trade', /CLAUSE 5[^|]*?REFUSE HIS READABILITY TRADE/i],
 ['6 stepped and held, never smoothed', /CLAUSE 6[^|]*?NEVER SMOOTHED/i],
 ['7 the menace is in what the object is FOR', /CLAUSE 7[^|]*?WHAT THE OBJECT IS FOR/i]
].forEach(([what, re]) => ok('A5 clause ' + what + ' is still in the law', re.test(law)));

ok('A6 it names the study', law.indexOf(path.basename(STUDY)) > 0);
ok('A7 the study exists', fs.existsSync(path.join(ROOT, STUDY)));

/* THE THREE REFUSALS. Each of these is a sentence somebody will be tempted to delete
   later, because each one is the sentence stopping them from doing something. */
ok('A8 it says IN TERMS that it does NOT lift the art freeze',
   /DOES NOT LIFT THE ART FREEZE/i.test(law));
ok('A9 and cites STOP PRODUCING as the reason, including the finding-a-legal-way clause',
   /STOP_PRODUCING/.test(law) && /IS the violation/i.test(law));
ok('A10 and says it authorises no pixel, no recolor, no palette, no frame count',
   /does not lift the freeze, cook a pixel, or recolor a bank/i.test(law) &&
   /does not set a palette, a frame count, or a grime strength/i.test(law));

/* IT MUST NOT DRIFT INTO GEOMETRY. The reference is 3D; we are pixel art at 45. */
ok('A11 it states the reference is 3D and Bohemia is not',
   /does not make Bohemia 3D/i.test(law));
ok('A12 and holds the 45 DEGREE ART LAW untouched',
   /45 DEGREE ART LAW stands untouched/i.test(law));
ok('A13 and keeps the camera anti-reference', /side-scroller camera remains the named anti-reference/i.test(law));
ok('A14 it does not override RIG LAW or reach anything Paolo painted',
   /RIG LAW/.test(law) && /sacrosanct/i.test(law));
ok('A15 it keeps NO DAMAGE BEFORE THE DIAL', /NO DAMAGE BEFORE THE DIAL/.test(law));

/* ★ THE PROOF THAT MECHANISM-MINE / CONTENTS-PAOLO'S WAS HONOURED: the law that
   discusses a palette at length contains NOT ONE COLOUR VALUE. The study is allowed
   hexes -- they are the reference's, quoted as evidence -- but a hex in the LAW would
   mean a lane had written colour canon he reserved. */
ok('A16 the LAW contains no hex colour value at all', !/#[0-9a-fA-F]{3,8}\b/.test(rawLaw));

LEANS_ON.forEach((f, i) => ok('A17.' + (i + 1) + ' cited file exists: ' + path.basename(f),
  fs.existsSync(path.join(ROOT, f))));

/* ---- THE STUDY MUST STAY HONEST ------------------------------------------- */
const rawStudy = fs.existsSync(path.join(ROOT, STUDY))
  ? fs.readFileSync(path.join(ROOT, STUDY), 'utf8') : '';
const study = norm(rawStudy);

ok('B1 the study leads with the 3D-versus-pixel-art problem, not with the transfer list',
   study.search(/MACHINE PARTY IS A 3D GAME\. BOHEMIA IS PIXEL ART/i) > 0 &&
   study.search(/MACHINE PARTY IS A 3D GAME/i) < study.search(/WHAT TRANSFERS/i));
ok('B2 it declares itself DOC_ONLY under the lab tiers', /DOC_ONLY/.test(study));
ok('B3 it names the pages it could not reach', /403/.test(study));
ok('B4 it admits it never saw the game move', /I have not seen the game move/i.test(study));
ok('B5 it marks the quotes as close paraphrase, not verbatim citation',
   /close paraphrase, not verbatim/i.test(study));
ok('B6 it names its own weakest load-bearing claim',
   /weakest load-bearing claim/i.test(study));
ok('B7 the palette hexes are marked third-party and NOT values to paste',
   /community-catalogued/i.test(study) && /never those six-digit numbers as values/i.test(study));
ok('B8 four rounds are actually there',
   [1, 2, 3, 4].every(n => new RegExp('ROUND ' + n + ' ').test(study)));
ok('B9 it separates WHAT TRANSFERS from WHAT DOES NOT',
   /WHAT TRANSFERS/i.test(study) && /WHAT DOES NOT TRANSFER/i.test(study));
ok('B10 the readability divergence is recorded in BOTH directions, so nobody ' +
   '"fixes" it either way',
   /refuse his readability trade/i.test(law) &&
   /Both directions are wrong/i.test(law) &&
   /We take his palette discipline and we refuse his readability trade/i.test(study));
ok('B11 it says plainly that nothing was cooked',
   /Nothing was cooked and nothing was recolored/i.test(study));

/* ---- THE PENDINGS STAY PENDING -------------------------------------------- */
/* Scoped TO THE CLAUSE, never to a flat window: the two pendings sit two clauses
   apart, and a window wide enough to reach one is wide enough to be fooled by the
   other. This is the bug traumatic_gate's C1 and earned_not_afforded's D1 both had. */
[['the grime STRENGTH dial (clause 2a)', /CLAUSE 2A[^|]*?PIPELINE STAGE/i, /CLAUSE 3/i],
 ['the palette (clause 4)', /CLAUSE 4[^|]*?THE COLOURS ARE HIS/i, /CLAUSE 5/i]
].forEach(([what, start, end]) => {
  const m = start.exec(law);
  let body = '';
  if (m) {
    body = law.slice(m.index);
    const e = end.exec(body.slice(20));
    if (e) body = body.slice(0, e.index + 20);
  }
  ok('C1 STILL PENDING, not quietly filled in: ' + what,
     !!m && /\[PENDING Paolo\]/.test(body));
});
ok('C2 clause 4 still says the palette was ALWAYS his, not newly reserved',
   /BOHEMIA'S PALETTE IS \[PENDING Paolo\] AND ALWAYS WAS/i.test(law));

/* ---- HE APPROVED THE GRIME PASS ON 8/3, AND THE ANSWER TO HIS QUESTION IS GATED --
   He said "SURE" with a question attached: do we do this before the demo or at the end?
   The answer is NEITHER -- it is a bake-time pipeline stage, so it is never a milestone
   and adding hundreds more assets costs no extra grime work. That answer is the whole
   value of the clause: if a later session reads clause 2 as "hand-paint dirt onto every
   tile," it inherits a pass that must be redone by hand every time an asset lands, which
   is exactly the trap he smelled. So the reasoning is load-bearing and it is held here. */
ok('E1 his approval is recorded verbatim, so nobody re-asks it',
   /APPROVED 8\/3\/26: "SURE"/.test(law) && /The grime pass happens/i.test(law));
ok('E2 his question is quoted, not paraphrased away',
   /DO WE DO THIS BEFORE WE THE DEMO ND THE END/i.test(law));
ok('E3 the answer is a PIPELINE STAGE, explicitly not a milestone',
   /NEITHER\. IT IS A PIPELINE STAGE, NOT A MILESTONE/i.test(law) &&
   /neither "before the demo" nor "at the end"/i.test(law));
ok('E4 and it names the trap that answer avoids -- a manual pass redone per asset',
   /redone from scratch\s*every single time an asset is added/i.test(law));
ok('E5 requirement: it composites at bake and NEVER writes to banks/',
   /never writes to `?banks\/`?/i.test(law) && /sacrosanct/i.test(law));
ok('E6 requirement: ONE dial, judged on the world and not on a tile',
   /IT IS ONE DIAL/i.test(law) && /by looking at the world, not at a tile/i.test(law));
ok('E7 requirement: indifferent to object boundaries -- the finding itself',
   /INDIFFERENT TO OBJECT BOUNDARIES/i.test(law) &&
   /reproduced the exact problem it exists to solve/i.test(law));
ok('E8 the ART lane owns the build, not the lab, and it still waits for the freeze',
   /THE ART LANE, NOT THIS ONE/i.test(law) &&
   /an approved grime pass is not an approved art batch/i.test(law));

/* ---- THE SWEEP: NOBODY TREATED THIS AS PERMISSION ------------------------- */
/* A banned CATEGORY needs a sweep and not a paragraph (the lesson ten_years_cold
   learned the hard way). The category banned here is DERIVATIVE WORK OFF THIS LAW
   while the freeze is on. Scoped to files that actually CITE the law, because the
   words "palette" and "freeze" are ordinary words that other lanes legitimately use
   and a gate that hunts a WORD instead of a THING is the bug this repo keeps
   shipping. */
function walk(dir, ext, out) {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return out;
  for (const f of fs.readdirSync(full, { withFileTypes: true })) {
    const rel = path.join(dir, f.name);
    if (f.isDirectory()) { walk(rel, ext, out); continue; }
    if (ext.test(f.name)) out.push(rel);
  }
  return out;
}
const SELF = [LAW, STUDY, 'gates/no_paint_gate.js'];
const all = ['laws', 'records', 'engine', 'slices', 'tools', 'gates']
  .reduce((a, d) => walk(d, /\.(md|txt|js|py|html)$/, a), [])
  .filter(f => SELF.indexOf(f) < 0);

const CITES = /NO_PAINT_8_3_26|MACHINE_PARTY_8_3_26/;
const DERIVATIVE = [
  [/(art\s+freeze|freeze)\s+(is\s+)?(now\s+)?(lifted|over|off|done)/i,
   'declares the art freeze lifted'],
  [/#[0-9a-fA-F]{6}\b[\s\S]{0,80}#[0-9a-fA-F]{6}\b/,
   'defines a colour list off this law'],
  [/\b(MACHINE_PARTY|NO_PAINT)_?(PALETTE|RAMP|COLORS|COLOURS)\b/i,
   'names a palette constant after the reference']
  /* THE GRIME BAN WAS REMOVED ON 8/3, THE SAME DAY IT WAS WRITTEN, AND THIS COMMENT IS
     THE RECEIPT. The original fourth pattern failed any file that implemented a grime
     pass, on the grounds that he had not approved one. THEN HE APPROVED ONE ("SURE"),
     and the ART lane built the machinery with the dial held at 0.0 -- correctly, exactly
     as clause 2A requires. My check then red-flagged their correct work with the reason
     "the grime pass he has not approved," which was simply no longer true.
     A GATE MUST NEVER OUTRANK A RULING (craft law, 8/1). His word made the check wrong,
     so the check goes -- fix the ruler, never the target. What replaced it is E9 below,
     which checks the thing that IS still true: the dial is his until he rules it. */
];
let derived = [];
all.forEach(f => {
  const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
  if (!CITES.test(src)) return;
  DERIVATIVE.forEach(([re, what]) => { if (re.test(src)) derived.push(f + ': ' + what); });
});
ok('D1 no file has turned this law into work (' + all.length + ' swept)' +
   (derived.length ? ' -> ' + derived.slice(0, 3).join('; ') : ''), derived.length === 0);

/* ---- E9: THE GRIME MACHINE EXISTS, AND ITS DIAL IS STILL HIS ---------------
   Clause 2A says the grime is a bake-time machine with ONE dial whose number is
   [PENDING Paolo]. The ART lane built exactly that on 8/3 and shipped it at strength
   0.0 with its own regression gate. This check does NOT re-implement grime_gate.py's
   job -- two gates asserting the same thing is how they end up disagreeing. It checks
   the CROSS-LANE contract: if an implementation exists at all, then it is gated, and it
   is not shipping a number he never gave. Skipped entirely if no implementation exists,
   because clause 2A does not require anyone to have built it yet. */
const GRIME_IMPL = ['tools/bohemia_grime_cook.py', 'gates/grime_gate.py']
  .filter(f => fs.existsSync(path.join(ROOT, f)));
if (GRIME_IMPL.length) {
  ok('E9.1 an existing grime implementation carries its own regression gate (FACTORY LAW)',
     fs.existsSync(path.join(ROOT, 'gates/grime_gate.py')));

  /* ★ CHECK THE SHIPPED NUMBER, NOT ANYBODY'S PROSE ABOUT IT. The first draft of E9.2
     matched grime_gate.py's DOCSTRING ("THE STRENGTH IS 0.0"), so mutating the actual
     literal to 0.45 left this gate green -- the docstring still said zero. Tenth time in
     this repo a check has read a description instead of the thing described. The dial the
     player actually gets is a literal on the shipped surfaces, so that is what is read.
     A recorded verdict from him legitimately unlocks it, and that escape hatch has to
     exist or the gate outranks a future ruling. */
  const RUNS = ['slices/BOHEMIA_RUN_CURRENT.html', 'slices/BOHEMIA_ALPHA_0_9.html',
                'slices/BOHEMIA_RUN_SLICE_7_26_26.html']
    .filter(f => fs.existsSync(path.join(ROOT, f)))
    .filter(f => /GRIME_STRENGTH/.test(fs.readFileSync(path.join(ROOT, f), 'utf8')));
  const verdict = walk('records', /\.(md|txt)$/, [])
    .some(f => /grime/i.test(f) && /verdict|approved amount|strength ruled/i
      .test(fs.readFileSync(path.join(ROOT, f), 'utf8')));
  const hot = RUNS.filter(f => {
    const m = /GRIME_STRENGTH\s*=\s*([0-9.]+)/.exec(fs.readFileSync(path.join(ROOT, f), 'utf8'));
    return m && parseFloat(m[1]) > 0;
  });
  ok('E9.2 the SHIPPED grime strength is still 0 on every surface that has one (' +
     RUNS.length + ' checked, verdict on file: ' + verdict + ')' +
     (hot.length ? ' -> turned up in ' + hot.join(', ') : ''),
     RUNS.length > 0 && (hot.length === 0 || verdict));
  const gg = fs.existsSync(path.join(ROOT, 'gates/grime_gate.py'))
    ? fs.readFileSync(path.join(ROOT, 'gates/grime_gate.py'), 'utf8') : '';
  ok('E9.3 and their gate asserts the literal too, so two gates read one source of truth',
     /GRIME_STRENGTH\s*=\s*0\.0/.test(gg));
} else {
  ok('E9 no grime implementation yet, which clause 2A permits', true);
}

/* And the law has to be REACHABLE, or it is a document nobody will find: the canon
   index is how any session locates an addendum. */
const idx = path.join(ROOT, 'BOHEMIA_CANON_INDEX.md');
ok('D2 the law is in the canon index (regenerate it the same turn an addendum lands)',
   !fs.existsSync(idx) || fs.readFileSync(idx, 'utf8').indexOf(path.basename(LAW)) > 0);

console.log('='.repeat(74));
console.log('  NO PAINT GATE: ' + pass + ' pass / ' + fail + ' fail');
console.log('='.repeat(74));
process.exit(fail ? 1 : 0);
