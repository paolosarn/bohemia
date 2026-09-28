#!/usr/bin/env node
/* BOHEMIA — CREATURES SCHOOL GATE (9/28/26, WORLD lane)
 *
 * ROW [creatures], RULE 37(n): "maybe the animals came out of a lab" is A
 * DIRECTION, NOT A LAW, and he said "maybe". So this gate's first job is the
 * unusual one: IT HOLDS THE ROUND TO BEING A SCHOOL. Nothing this round
 * produced may become canon, may enter the game, or may quietly edit the roster
 * that PEOPLE owns.
 *
 *  A  NOTHING HERE IS CANON, AND THE BANK SAYS SO IN ITS OWN FIELDS.
 *
 *  B  *** THE FOUNDING LAW OF THE ROSTER SURVIVES THE ROUND. ***
 *     engine/bohemia_wildlife.js ships with "Nothing on this page is a creature
 *     somebody made up", and its research file's finding is "A pack of
 *     somebody's golden retrievers is worse than a mutant, because it is true."
 *     A creature school is exactly the round that would erode that sentence, so
 *     the gate reads it back off disk and counts the roster.
 *
 *  C  REUSE-FIRST, PROVED ON THE PIXELS. Every animal in the cook is decoded out
 *     of the bank PEOPLE cooked on 8/28. No second coyote exists.
 *
 *  D  *** ACT ONE HAS NOTHING GREEN IN IT (8/26). *** The rule is what makes
 *     shape C bite, so the gate holds it: every green pixel in the picture is
 *     inside the one panel that is about the thing that got out.
 *
 *  E  THE TOOL'S REFUSALS ARE LIVE STATEMENTS, NOT COMMENTS. This lane shipped a
 *     gate on 9/28 that was GREEN FOR THE WRONG REASON -- it regex-matched a
 *     refusal's name in a COMMENT describing a constant that had been deleted.
 *     So every refusal checked here is anchored to a process.exit, never to
 *     prose that happens to contain the words.
 *
 *  F  THE REFERENCE TRAP. The obvious reference for lab creatures is Fallout,
 *     and FALLOUT 1 IS THE INTERFACE DEPARTMENT ONLY (9/6). The record names the
 *     trap; the gate refuses the tool or the record citing it as a creature
 *     source.
 *
 *   node gates/creatures_school_gate.js
 */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const P = (...a) => path.join(ROOT, ...a);
const read = (p) => fs.readFileSync(P(p), 'utf8');

let pass = 0, fail = 0;
const ok = (n, c, note) => {
  if (c) pass++;
  else { fail++; console.log('  > FAIL ' + n + (note ? '  [' + note + ']' : '')); }
};
const section = (name, fn) => {
  try { return fn(); }
  catch (e) { fail++; console.log('  > FAIL ' + name + ' could not be measured  [' + (e && e.message) + ']'); }
};

const TOOL = 'tools/bohemia_three_shapes_cook_9_28_26.js';
const BANKF = 'banks/BOHEMIA_THREE_SHAPES_9_28_26.txt';
const REC = 'records/BOHEMIA_WORLD_THE_CREATURES_SCHOOL_9_28_26.md';
const SPRITES = 'banks/BOHEMIA_WILDLIFE_SPRITES.js';

const toolSrc = read(TOOL);
const recSrc = read(REC);
const doc = JSON.parse(read(BANKF));

/* strip comments, so every check below is about code that RUNS */
const live = toolSrc.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1 ');

/* ---- A. NOTHING HERE IS CANON ------------------------------------------- */
section('A the round stays a school', () => {
  ok('the bank says it is a draft', doc.draft === true);
  ok('*** AND THAT IT IS NOT CANON ***', doc.canon === false);
  ok('and it names WHY it is not canon, rather than just flagging it',
     /direction/i.test(doc.none_canon || '') && /maybe/i.test(doc.none_canon || ''));
  ok('nothing from this round is loaded by any engine module',
     (() => {
       const hits = fs.readdirSync(P('engine'))
         .filter(f => f.endsWith('.js'))
         .filter(f => /THREE_SHAPES|three_shapes/.test(read('engine/' + f)));
       return hits.length === 0;
     })(), 'an engine module reads the school bank');
  ok('and it is not in a slice either (rule 18)',
     !/THREE_SHAPES/.test(read('slices/BOHEMIA_CITY_WORLD.html')));
});

/* ---- B. *** THE ROSTER'S FOUNDING LAW SURVIVES *** ---------------------- */
section('B the roster still invents nothing', () => {
  const w = read('engine/bohemia_wildlife.js');
  ok('*** engine/bohemia_wildlife.js STILL SAYS NOTHING ON IT WAS MADE UP ***',
     /Nothing on this page is a creature somebody made up/.test(w));
  const research = read('records/BOHEMIA_RESEARCH_WHAT_LIVES_IN_A_CITY_OF_CORPSES_8_25_26.md');
  ok('and the finding that argues against lab creatures is still on the shelf',
     /golden retrievers is worse\s+than a\s+mutant/.test(research));
  ok('*** AND TIER 3 IS STILL RESERVED TO HIM, NOT FILLED IN BY THIS ROUND ***',
     /Reserved: the\s*\n?\s*Amalgamation and the factions are HIS/.test(research)
     || /the factions are HIS, and I am not filling that in/.test(research));
  const B = require(P(SPRITES));
  console.log('    [measured] the roster is ' + B.animals.length + ' animals at '
    + B.w + 'x' + B.h + ': ' + B.animals.map(a => a.id).join(', '));
  ok('the roster did not grow this round', B.animals.length === 8, B.animals.length + ' animals');
  ok('every animal still carries its real-world source',
     B.animals.every(a => typeof a.source === 'string' && a.source.length > 20));
  ok('the record says out loud that the roster argues back',
     /argues back/i.test(recSrc));
});

/* ---- C. REUSE-FIRST ----------------------------------------------------- */
section('C no second coyote was drawn', () => {
  ok('the cook decodes the roster bank rather than carrying its own animals',
     /require\([^)]*BOHEMIA_WILDLIFE_SPRITES/.test(live));
  ok('*** AND IT REFUSES BY NAME IF AN ANIMAL IS NOT IN THAT BANK ***',
     /REUSE-FIRST: this tool draws no animal of its own/.test(toolSrc)
     && /this tool draws no animal of its own[\s\S]{0,80}process\.exit\(1\)/.test(live));
  ok('the edited coat is derived from the bank ramp, not hand-picked',
     /COAT_BASE\.forEach/.test(live) && /mix\(PAL\[i\]/.test(live));
  ok('and the tool caps what it may add, with a live refusal',
     /newTones !== 5[\s\S]{0,200}process\.exit\(1\)/.test(live));
  ok('measured: exactly five new tones', doc.measured.newTonesAdded === 5,
     String(doc.measured.newTonesAdded));
});

/* ---- D. *** ACT ONE HAS NOTHING GREEN IN IT *** ------------------------- */
section('D the one green thing in Las Vegas', () => {
  ok('*** THE 8/26 RULE IS STILL IN THE WALKED CITY, IN ITS OWN WORDS ***',
     /ACT ONE HAS NOTHING GREEN IN IT/.test(read('engine/bohemia_arterial.js')));
  console.log('    [measured] green pixels ' + doc.measured.greenPixels
    + ', outside the escaped plant ' + doc.measured.greenOutsideThePlant);
  ok('the plant really drew', doc.measured.greenPixels > 100);
  ok('*** AND NOT ONE GREEN PIXEL IS ANYWHERE ELSE IN THE FRAME ***',
     doc.measured.greenOutsideThePlant === 0, String(doc.measured.greenOutsideThePlant));
  ok('the tool refuses green outside the plant, as a live statement',
     /ACT ONE HAS NOTHING GREEN IN IT \(8\/26\)[\s\S]{0,180}process\.exit\(1\)/.test(live));
  ok('and the record cites the real escape literature rather than asserting it',
     /rapeseed/i.test(recSrc) && /bentgrass/i.test(recSrc) && /North Dakota/i.test(recSrc));
});

/* ---- E. THE SHAPE CLAIMS ARE MEASURED ----------------------------------- */
section('E the twenty edits are size and colour and nothing else', () => {
  const m = doc.measured;
  console.log('    [measured] outline match ' + m.silhouetteMatch + '% (size taken out), coat lift '
    + m.coatLightnessLift + ', size ' + m.sizeStep + 'x, tag ' + m.tagPixels + ' px, wrong thing '
    + m.brightSharePct + '% of the frame');
  ok('*** THE OUTLINE DID NOT MOVE: it is the same animal ***', m.silhouetteMatch === 100);
  ok('the coat really is paler, measured', m.coatLightnessLift > 0.02);
  ok('*** AND NOT SO PALE IT READS AS A DIFFERENT ANIMAL ***', m.coatLightnessLift < 0.14,
     String(m.coatLightnessLift));
  ok('the body is exactly a quarter bigger', m.sizeStep === 1.25);
  ok('the tag is a handful of pixels, not a costume', m.tagPixels > 0 && m.tagPixels < 400);
  ok('*** AH-01: the wrong thing is a small minority of the frame ***', m.brightSharePct < 6);
  /* THE REFUSALS ARE LIVE, NOT PROSE -- this lane shipped a gate on 9/28 that
     matched a refusal's name inside a comment about a constant it had deleted. */
  ok('the outline refusal is a live statement, not a comment',
     /silhouetteMatch < 1\)[\s\S]{0,320}process\.exit\(1\)/.test(live));
  ok('the frame-share refusal is a live statement, not a comment',
     /brightShare > 6\)[\s\S]{0,300}process\.exit\(1\)/.test(live));
  ok('and the record keeps the checks that were wrong before he saw them',
     /could never fail/i.test(recSrc) && /counting eyes/i.test(recSrc));
});

/* ---- F. THE REFERENCE TRAP --------------------------------------------- */
section('F a reference belongs to one department', () => {
  ok('*** THE COOK NEVER CITES A GAME OUTSIDE ITS DEPARTMENT ***',
     !/fallout|ff12|final fantasy|rogue fable|ocarina|pocket city/i.test(toolSrc),
     'the cook cites a reference it does not own');
  ok('the record names the trap instead of walking into it',
     /INTERFACE department only/i.test(recSrc) || /INTERFACE department/i.test(recSrc));
  ok('and the only game it studies is the one this lane owns',
     /\[bb creatures\]/.test(recSrc) && /Battle Brothers/.test(recSrc));
  ok('rule 33f: the school line is there and it is about BB',
     /refuses to explain its monsters/i.test(recSrc));
  ok('the record carries its sources as real links',
     (recSrc.match(/^- \[.+\]\(https?:\/\//gm) || []).length >= 10,
     (recSrc.match(/^- \[.+\]\(https?:\/\//gm) || []).length + ' sources');
});

/* ---- G. THE FORK IS HIS ------------------------------------------------- */
section('G the fork is stated and not taken', () => {
  ok('the record offers him a fork in plain words', /THE FORK/.test(recSrc));
  ok('and it says which one I would build, per EVERYTHING IS A THUMB',
     /The default I would build is/.test(recSrc));
  ok('the picture exists where he can reach it',
     fs.existsSync(P('slices/vote/WORLD_THREE_SHAPES.png')));
  ok('and the round routed the parts that are not mine', /## 7\. ROUTED/.test(recSrc));
});

console.log('CREATURES SCHOOL GATE: ' + pass + ' passed, ' + fail + ' failed'
  + '  (rule 37n is a direction, not a law: the roster still invents nothing,'
  + ' tier 3 is still his, and the only green in Las Vegas is the thing that got out)');
process.exit(fail ? 1 : 0);
