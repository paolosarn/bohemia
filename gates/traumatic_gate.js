/* ============================================================================
   TRAUMATIC GATE (7/31/26, LAB lane)

   Paolo 7/31, on Crisis Response: "it doesnt have to be gory but I do want it to be
   traumatic fr"

   Law: laws/BOHEMIA_ADDENDUM_TRAUMATIC_NOT_GORY_7_31_26.md
   Research: records/BOHEMIA_RESEARCH_CRISIS_RESPONSE_VIOLENCE_7_31_26.md

   THE HARD PART OF GATING THIS: "traumatic" is not machine-checkable and never will
   be. Only he can say whether a moment lands. So this gate does NOT try to measure
   trauma. It checks the two things a machine actually can:

     1. THE LAW IS INTACT and its pendings are still pending.
     2. GORE IS NOT THE MECHANISM. Clause 1 is a claim about what the machine
        REWARDS, not about how anything looks -- so the sweep looks for damage scaled
        by a gore setting, and for score or reward keyed to kills or brutality. Those
        are structures. The pixels are Paolo's and this gate never touches them.

   Every prose check runs against whitespace-COLLAPSED text, because that mistake has
   now been shipped seven times in this repo and once is enough.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const LAW = 'laws/BOHEMIA_ADDENDUM_TRAUMATIC_NOT_GORY_7_31_26.md';
const RESEARCH = 'records/BOHEMIA_RESEARCH_CRISIS_RESPONSE_VIOLENCE_7_31_26.md';
const LEANS_ON = [
  'laws/BOHEMIA_ADDENDUM_THE_MOBILE_CAMP_7_27_26.md',
  'laws/BOHEMIA_ADDENDUM_WHAT_COMBAT_IS_FOR_7_27_26.md',
  'records/BOHEMIA_BLEED_TRIGGER_ANSWER_7_31_26.md'
];

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

console.log('='.repeat(74));
console.log('TRAUMATIC GATE — traumatic and gory are two different dials,');
console.log('                 and gore is never the mechanism');
console.log('='.repeat(74));

ok('A1 the law exists', fs.existsSync(path.join(ROOT, LAW)));
if (!fs.existsSync(path.join(ROOT, LAW))) process.exit(1);
const raw = fs.readFileSync(path.join(ROOT, LAW), 'utf8');
/* PROSE IS NORMALISED, NOT JUST COLLAPSED. A2 failed on its first run because his
   quote is a multi-line MARKDOWN BLOCKQUOTE, so collapsing whitespace left the "> "
   continuation markers embedded mid-sentence: "but I do > want it to be traumatic".
   Collapsing alone is not enough for markdown -- blockquote markers and emphasis are
   not whitespace. Eighth time this repo has shipped a prose check that assumed the
   text is flat, so this is the shape to copy: STRIP THE MARKUP, THEN COLLAPSE. */
const norm = (t) => t
  .replace(/^[ \t]*>[ \t]?/gm, '')   /* blockquote continuations */
  .replace(/\*\*|__|`/g, '')         /* emphasis and code ticks */
  .replace(/\s+/g, ' ');
const law = norm(raw);

ok('A2 it quotes his ruling verbatim', /doesnt have to be gory but I do want it to be traumatic fr/.test(law));
ok('A3 dated and LOCKED', /7\/31\/26, LOCKED/.test(law));

[['1 two different dials', /CLAUSE 1[^|]*?TWO DIFFERENT DIALS/i],
 ['2 a hurt body is a CLOCK', /CLAUSE 2[^|]*?CLOCK, NOT A CORPSE/i],
 ['3 it costs the PLAYER', /CLAUSE 3[^|]*?COSTS THE PLAYER/i],
 ['4 the body is a LEGIBLE system', /CLAUSE 4[^|]*?LEGIBLE SYSTEM/i],
 ['5 the strongest tools are not visual', /CLAUSE 5[^|]*?NOT VISUAL/i]
].forEach(([what, re]) => ok('A4 clause ' + what + ' is still in the law', re.test(law)));

ok('A5 it names the reference and its research record',
   /Crisis Response/.test(law) && law.indexOf(path.basename(RESEARCH)) > 0);
ok('A6 the research record exists', fs.existsSync(path.join(ROOT, RESEARCH)));
ok('A7 it keeps NO DAMAGE BEFORE THE DIAL', /NO DAMAGE BEFORE THE DIAL/.test(law));
ok('A8 it says COMBAT owns the implementation, not this lane', /COMBAT owns/i.test(law));
ok('A9 gore is PERMITTED, not banned — the law is about mechanism, not censorship',
   /Gore is permitted/i.test(law));

/* every law it leans on must still exist — a citation to a deleted law is rot */
LEANS_ON.forEach((f, i) => ok('A10.' + (i + 1) + ' cited file exists: ' + path.basename(f),
  fs.existsSync(path.join(ROOT, f))));

/* the research must be honest about what it could not reach — it was built on
   search summaries, and a document that hides that is worse than no document */
const res = fs.existsSync(path.join(ROOT, RESEARCH))
  ? norm(fs.readFileSync(path.join(ROOT, RESEARCH), 'utf8')) : '';
ok('B1 the research names the pages it could NOT read', /403/.test(res));
ok('B2 and says plainly that it has not played it', /have not played it/i.test(res));
ok('B3 and defers to HIM as the primary source on what he saw',
   /his description is the primary source/i.test(res));
ok('B4 and records the name collision it could not resolve',
   /could not confirm these are the same/i.test(res));
/* HIS OWN SCREENSHOTS ARE PRIMARY SOURCE and the notes off them must survive. The
   one that matters most is the ANTI-reference: the game is a side-scroller and
   Bohemia is 45-degree three-quarter by law, so a lane that reads those frames as an
   ART target instead of a FEEL target will ship a flat side-on death and break a
   locked law. That warning is load-bearing, so it is gated. */
ok('B5 the notes off his frames record that the CAMERA is an anti-reference',
   /side-scroller/i.test(res) && /45 DEGREE ART LAW/.test(res) &&
   /register ports/i.test(res));
ok('B6 and that the launch-vs-settle tension is FLAGGED for the lane that owns it, ' +
   'not decided here and not bounced to Paolo',
   /FLAGGED FOR ANIMATION\/CHARACTER/.test(res) && /not mine/i.test(res));
ok('B7 and that nothing was built from them, as he asked',
   /Did not build, model, or cook anything/i.test(res));

/* THE PENDINGS STAY PENDING */
[['the approved gore overlays', /GORE OVERLAYS/],
 ['non-combatants in a fight', /NON-COMBATANTS/i],
 ['how a body\'s state is shown', /How a body's state is shown/i]
].forEach(([what, re]) => {
  /* THE WINDOW STOPS AT THE NEXT BULLET, not at a character count. A flat 340-char
     window passed a filled-in pending because the NEXT bullet's [PENDING Paolo] fell
     inside it -- so the check was really asking "is there a pending somewhere nearby",
     which is not the question. Same bug shape as earned_not_afforded's D1, found the
     same way: mutate the thing and watch the gate stay green. Two gates in one turn
     with the same window bug is a pattern, so it is written down here as the shape to
     copy: scope a per-item check TO THE ITEM. */
  const m = re.exec(law);
  let near = '';
  if (m) {
    near = law.slice(m.index, m.index + 400);
    const nextBullet = near.indexOf(' - ', 1);
    if (nextBullet > 0) near = near.slice(0, nextBullet);
  }
  ok('C1 STILL PENDING, not quietly filled in: ' + what,
     !!m && /\[PENDING Paolo\]/.test(near));
});

/* THE SWEEP — gore is not the mechanism. Structures, never mentions: the laws are
   required to name gore in order to rule on it. */
function walk(dir, ext, out) {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return out;
  for (const f of fs.readdirSync(full, { withFileTypes: true })) {
    if (f.isDirectory()) continue;
    if (ext.test(f.name)) out.push(path.join(dir, f.name));
  }
  return out;
}
const surfaces = walk('slices', /\.(html|js)$/, walk('engine', /\.js$/, []))
  .filter(f => f.indexOf('slices/lab/') !== 0);
const BANNED = [
  [/\bgore\w*\s*\*\s*(dmg|damage)|\b(dmg|damage)\s*\*\s*gore/i, 'damage scaled by gore'],
  [/\bgoreMult\w*\s*[:=]/i, 'a gore multiplier on an outcome'],
  [/\b(score|points|reward|xp)\s*[+]?=\s*[^;\n]{0,24}\b(kills?|brutal\w*|gore)\b/i,
   'score or reward keyed to kills or brutality'],
  [/\bkillStreak\w*\s*[:=]|\bbrutalityScore\b/i, 'a kill-streak or brutality score']
];
let hits = [];
surfaces.forEach(f => {
  const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
  BANNED.forEach(([re, what]) => { if (re.test(src)) hits.push(f + ': ' + what); });
});
ok('D1 GORE IS NOT THE MECHANISM on any shipped surface (' + surfaces.length + ' swept)' +
   (hits.length ? ' -> ' + hits.slice(0, 3).join('; ') : ''), hits.length === 0);

console.log('='.repeat(74));
console.log('  TRAUMATIC GATE: ' + pass + ' pass / ' + fail + ' fail');
console.log('='.repeat(74));
process.exit(fail ? 1 : 0);
