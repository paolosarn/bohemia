/* BOHEMIA VOICE GATE (8/26/26) — the three machine tells, and an honest sign on
 * the other four.
 *
 * WHY (Paolo 8/26, opening the WORDS lane):
 *   "I think we might have to open up a chat for how to speak like a human, how
 *    to write stories like a human, how to write dialogue for humans like humans
 *    would across games and shit... it's time we have a new chat, like, write and
 *    sound like a human for Bohemia."
 *
 * THE PREMISE THE LANE ADMITS OUT LOUD: the writer is a machine and machines have
 * tells. The brief names five. It also names, in the same breath, exactly how far
 * a gate can go:
 *
 *   "Your gate can measure sentence rhythm, repeated openers and banned phrases.
 *    IT CANNOT TELL YOU IF A LINE IS GOOD. Do not pretend it can."
 *
 * So this file measures THREE THINGS and claims nothing else. Everything it
 * counts is a SHAPE. A scene can be green here and dead on the page, and the only
 * test for that is still reading it out loud.
 *
 * AND THE FOURTH CHECK IS THE LANE BOUNDARY. QUESTS owns WHAT HAPPENS; WORDS owns
 * HOW IT SOUNDS. A voice pass that quietly moved a branch would be this lane
 * reaching into somebody else's system, so the pass is proved WORDS-ONLY against
 * the pre-pass commit: every structural byte identical, only text changed. That
 * is the one claim here a reader could not verify by eye.
 *
 * Card:      laws/BOHEMIA_VOICE_CARD_8_26_26.md
 * Diagnosis: records/BOHEMIA_VOICE_DIAGNOSIS_8_26_26.md
 * Tools:     tools/bohemia_voice_diagnosis.py, tools/bohemia_voice_rewrite.py
 *
 *   node gates/voice_gate.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const ROOT = path.dirname(__dirname);
process.chdir(ROOT);

let pass = 0, fail = 0;
/* ok(message, condition). The reversed-call guard every gate in this lane
   carries: a reversed call is truthy both ways and ships green over broken code. */
const ok = (n, c) => {
  if (typeof c === 'string') throw new Error('GATE BUG: ok() got a STRING as its condition.');
  if (typeof n !== 'string') throw new Error('GATE BUG: ok() got a ' + typeof n + ' as its message.');
  c ? pass++ : (fail++, console.log('  FAIL: ' + n));
};

console.log('='.repeat(74));
console.log('VOICE GATE — rhythm, repeated openers, banned phrases.');
console.log('             It cannot tell you if a line is good. It does not claim to.');
console.log('='.repeat(74));

const CARD = 'laws/BOHEMIA_VOICE_CARD_8_26_26.md';
const DIAG = 'records/BOHEMIA_VOICE_DIAGNOSIS_8_26_26.md';
const REWRITE = 'records/BOHEMIA_VOICE_REWRITE_8_26_26.json';
const BOOK = 'records/BOHEMIA_WORDS_BOOK.json';
const QUEST = 'quests/bq/S01_THE_METER_READER.bq';
const WORDS_PAGE = 'slices/BOHEMIA_WORDS_CURRENT.html';

/* ---- 1. THE CARD EXISTS, IS SHORT, AND ADMITS ITS OWN LIMIT -------------- */
ok('the voice card is on disk', fs.existsSync(CARD));
const card = fs.existsSync(CARD) ? fs.readFileSync(CARD, 'utf8') : '';
const RULES = [
  'THEY TALK LIKE THEY ARE IN A HURRY',
  'CUT THE LAST SENTENCE',
  'SOMEBODY HAS TO ASK, SOMEBODY HAS TO FUMBLE',
  'NINE WORDS, THEN TWO',
  'NAME THE ONE THING ONLY THIS PERSON WOULD NAME',
  'THE LINE IS NOT THE POINT',
];
RULES.forEach((r, i) => ok('card carries rule ' + (i + 1) + ': ' + r, card.indexOf(r) >= 0));
/* "one page, short enough to hold in your head" was the ask. A card that grows
   into a manual is a card nobody holds in their head, so the length is gated. */
ok('the card is still ONE PAGE (<=110 lines) — his ask, and a manual is not a card',
  card.split('\n').length <= 110);
ok('the card says out loud that a gate cannot tell you if a line is good',
  /CANNOT TELL YOU IF A LINE IS GOOD/i.test(card));
ok('the card states the frame: nobody in Bohemia is wise',
  /NOBODY IN BOHEMIA IS WISE/i.test(card));
ok('CLAUDE.md carries the WORDS lane so a session actually reads it',
  fs.readFileSync('CLAUDE.md', 'utf8').indexOf('THE WORDS LANE EXISTS') >= 0);

/* ---- 2. THE DIAGNOSIS IS MEASURED, NOT ASSERTED -------------------------- */
ok('the diagnosis record exists', fs.existsSync(DIAG));
const diag = fs.existsSync(DIAG) ? fs.readFileSync(DIAG, 'utf8') : '';
ok('the diagnosis quotes our OWN lines, not an example from somewhere else',
  diag.indexOf('verbatim') >= 0 && diag.indexOf('WHAT THIS CANNOT DO') >= 0);
ok('the diagnosis names all seven tells it found',
  (diag.match(/^## TELL \d/gm) || []).length === 7);
/* THE DIAGNOSIS MUST STILL BE A DIAGNOSIS. It re-measures on every run, so
   without a pinned baseline it would quietly republish today's numbers under
   the word AS FOUND and the reason anybody opened this lane would evaporate one
   writing pass at a time. The baseline is measured out of git, not typed, and
   the gate checks it was actually reachable when the report was written. */
const met = fs.existsSync('records/BOHEMIA_VOICE_METRICS.json')
  ? JSON.parse(fs.readFileSync('records/BOHEMIA_VOICE_METRICS.json', 'utf8')) : {};
ok('the diagnosis carries an AS-FOUND baseline read out of git, not typed in',
  !!(met._meta && met._meta.baseline_read) && !!met.baseline);
ok('and the report prints both columns, so a later pass cannot erase the finding',
  diag.indexOf('AS FOUND') >= 0 && diag.indexOf('| tell | AS FOUND') >= 0);
ok('the AS-FOUND contraction rate is still the one that was found (2.2%)',
  !!met.baseline && Math.abs(met.baseline.contractions.quest_rate - 2.2) < 0.05);

/* ---- THE MEASURING, shared by the checks below --------------------------- */
const WORD = /[A-Za-z0-9’']+/g;
const words = t => (t.match(WORD) || []);
const sentences = t => t.trim().split(/(?<=[.!?])\s+/).filter(Boolean);

/* RHYTHM as a RATIO, never a raw spread. A scene of short sentences cannot post
   a big absolute standard deviation no matter how hard it varies, so gating the
   raw number would punish exactly the terse writing the card asks for. What the
   tell actually is: every sentence the same size AS THE OTHERS IN ITS OWN SCENE.
   That is spread divided by mean. (The first cut of this gate used raw sd and
   read the rewritten scene as barely improved — 3.36 to 4.12 — while the ratio
   showed what a reader hears: 0.57 to 0.74. FIX THE RULER, NEVER THE TARGET.) */
function rhythm(lines) {
  const w = [];
  lines.forEach(l => sentences(l).forEach(s => { const n = words(s).length; if (n) w.push(n); }));
  if (w.length < 6) return null;
  const mean = w.reduce((a, b) => a + b, 0) / w.length;
  const sd = Math.sqrt(w.reduce((a, b) => a + (b - mean) * (b - mean), 0) / w.length);
  return { n: w.length, mean: mean, sd: sd, cv: sd / mean,
           shortPct: 100 * w.filter(x => x <= 3).length / w.length };
}

const BANNED = [
  ['"that is the whole ___"', /\b(that is|that's) the whole\b/i],
  ['"that is the part that ___"', /\b(that is|that's) the part that\b/i],
  ['the flip: "not a X. It is a Y"', /\b(is not|isn't) an? [^.?!]{1,30}[.,]\s*(it is|it's|just)\b/i],
  ['ledger: "worth more/less than"', /\bworth (more|less)\b/i],
  ['ledger: "the price of"', /\bthe price of\b/i],
  ['ledger: "it costs you"', /\bcosts? you\b/i],
  ['"out here." as the closer', /\bout here[.!?]\s*$/i],
  ['"nobody ever ___"', /\bnobody ever\b/i],
  ['"most people never ___"', /\bmost people never\b/i],
  ['an em dash, anywhere, ever', /—/],
];
function banned(text) {
  return BANNED.filter(b => b[1].test(text)).map(b => b[0]);
}

/* ---- 3. MUTATION TEST: PROVE THE RULERS ACTUALLY BITE -------------------- */
/* A gate that has never been shown failing is a gate nobody has tested. Both
   measures are run over deliberately broken input before they are trusted. */
const flatFake = ['One two three four five six.', 'Seven eight nine ten eleven twelve.',
  'Thirteen fourteen fifteen sixteen seventeen ay.', 'One two three four five bee.',
  'Six seven eight nine ten cee.', 'Eleven twelve thirteen fourteen fifteen dee.',
  'One two three four five six.', 'Seven eight nine ten eleven ee.'];
const variedFake = ['Nine at night.', 'Every night.', 'Huh.',
  'I tested it myself and the line comes back clean every single time that I do it.',
  'Please.', 'Warm cable.', 'Nobody comes asking after you if you do not come back here.',
  'That is it.'];
ok('MUTATION: a scene of identical-length sentences reads as FLAT (cv < 0.25)',
  rhythm(flatFake).cv < 0.25);
ok('MUTATION: a scene that varies hard reads as VARIED (cv > 0.65)',
  rhythm(variedFake).cv > 0.65);
ok('MUTATION: the banned list fires on a planted phrase',
  banned('That is not a line. It is a lesson.').length > 0);
ok('MUTATION: the banned list does NOT fire on a clean line',
  banned("Nine at night. Every night, nine, and half this block goes brown.").length === 0);

/* ---- 4. THE SCENE THAT TOOK THE PASS ------------------------------------- */
ok('the words book is baked', fs.existsSync(BOOK));
const book = JSON.parse(fs.readFileSync(BOOK, 'utf8'));
const scene = book.books.find(b => b.title === 'The Meter Reader');
ok('the passed scene is in the words book', !!scene);
const spoken = scene ? scene.lines.filter(l => l.kind === 'say').map(l => l.text) : [];
const r = rhythm(spoken);
/* THE FLOOR IS THE MEASURED PASS, NOT A ROUND NUMBER. 0.74 is what the rewrite
   posts; 0.65 leaves room for later edits of his without a red gate over one
   retyped line. Raising this floor is a WRITING job, never a number job. */
ok('RHYTHM: the passed scene varies (cv >= 0.65, measured ' +
  (r ? r.cv.toFixed(2) : 'n/a') + ')', !!r && r.cv >= 0.65);
console.log('    (' + (r ? r.n + ' sentences, mean ' + r.mean.toFixed(1) + ' words, spread ' +
  r.sd.toFixed(2) + ', ratio ' + r.cv.toFixed(2) + ', ' + r.shortPct.toFixed(0) +
  '% under four words)' : 'no sentences'));

const sceneBans = [];
(scene ? scene.lines : []).forEach(l => banned(l.text).forEach(b =>
  sceneBans.push(b + '  <- "' + l.text.slice(0, 46) + '"')));
ok('BANNED PHRASES: the passed scene is clean' +
  (sceneBans.length ? '\n         ' + sceneBans.join('\n         ') : ''), sceneBans.length === 0);

/* REPEATED OPENERS, inside one scene. Two people in a row starting the same way
   is the tell; one word being common across a whole build is just English. */
const openers = {};
(scene ? scene.lines.filter(l => l.kind === 'say') : []).forEach(l => {
  const w = words(l.text);
  if (w.length) openers[w[0].toLowerCase()] = (openers[w[0].toLowerCase()] || 0) + 1;
});
const topOpener = Object.keys(openers).sort((a, b) => openers[b] - openers[a])[0];
const topN = topOpener ? openers[topOpener] : 0;
const sayN = scene ? scene.lines.filter(l => l.kind === 'say').length : 1;
ok('REPEATED OPENERS: no single word starts more than a quarter of the speeches ' +
  '(worst: "' + topOpener + '" ' + topN + '/' + sayN + ')', topN <= Math.ceil(sayN / 4));

/* ---- 5. CORPUS-WIDE, RATCHETING ------------------------------------------ */
/* The other 26 scenes have not had a voice pass and this turn does not pretend
   they have. What the gate holds is that nobody makes it WORSE while they wait:
   the counts below are today's, written down, and a new one fails. */
let corpusBans = 0, corpusEmDash = 0;
book.books.forEach(b => b.lines.forEach(l => {
  corpusBans += banned(l.text).length;
  if (l.text.indexOf('—') >= 0) corpusEmDash++;
}));
const BAN_CEILING = 44;   /* measured 8/26 across 2,442 lines. Only ever goes DOWN. */
ok('CORPUS: banned-phrase hits are not growing (' + corpusBans + ', ceiling ' +
  BAN_CEILING + ')', corpusBans <= BAN_CEILING);
ok('CORPUS: zero em dashes in any authored line', corpusEmDash === 0);
console.log('    (' + corpusBans + ' banned-phrase hits still standing in the 26 scenes ' +
  'that have NOT had a voice pass. Named, not hidden.)');

/* ---- 6. THE PASS WAS WORDS ONLY. THE LANE BOUNDARY, MACHINE-CHECKED ------ */
ok('the side-by-side record exists', fs.existsSync(REWRITE));
const rw = fs.existsSync(REWRITE) ? JSON.parse(fs.readFileSync(REWRITE, 'utf8')) : { pairs: [], _meta: {} };
ok('it holds both columns for every line in the scene', rw.pairs.length >= 40);
ok('and it actually rewrote most of them (' + rw._meta.changed + ' of ' + rw._meta.lines + ')',
  rw._meta.changed >= 25);
ok('every rewritten line names which card rule it is an instance of',
  rw.pairs.filter(p => p.changed).every(p => p.rules && p.rules.length));

/* THE CLAIM WORTH CHECKING: strip every player-facing line out of the quest, on
   both sides of the pass, and what is LEFT must be byte-identical. Stages,
   branches, gates, effects, roles, objectives, flags: untouched. WORDS owns how
   it sounds; QUESTS owns what happens. */
function skeleton(src) {
  return src.split('\n')
    .filter(l => !/^\s*@(SAY|LOG)\s/.test(l))
    /* an @OPT carries BOTH: the words in quotes are mine, the target and the
       effects after them are the quest's. Blank the words, keep the wiring. */
    .map(l => /^\s*@OPT\s/.test(l)
      ? l.replace(/"[^"]*"/, '"..."').replace(/@OPT\s+\([^)]*\)/, '@OPT (...)')
      : l)
    .filter(l => !/^\s*#/.test(l))     /* comments carry the new citations */
    .map(l => l.replace(/\s+/g, ' ').trim())
    .filter(Boolean).join('\n');
}
let before = null;
try {
  before = execFileSync('git', ['show', rw._meta.before_ref + ':' + QUEST],
    { cwd: ROOT, maxBuffer: 4e6 }).toString('utf8');
} catch (e) { before = null; }
ok('the pre-pass version of the quest is reachable in git', !!before);
if (before) {
  const now = fs.readFileSync(QUEST, 'utf8');
  const same = skeleton(before) === skeleton(now);
  ok('WORDS ONLY: every structural line of the quest is byte-identical to the ' +
    'pre-pass commit (same stages, branches, gates, effects, roles, objectives)', same);
  if (!same) {
    const a = skeleton(before).split('\n'), b = skeleton(now).split('\n');
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      if (a[i] !== b[i]) { console.log('         first drift: ' + a[i] + '  ->  ' + b[i]); break; }
    }
  }
  /* and the other direction: it is not a no-op dressed as a pass */
  ok('and the WORDS did change (the pass is not a no-op)',
    before !== fs.readFileSync(QUEST, 'utf8'));
}

/* the new citations are real. quest_study_gate proves the ids and titles
   verbatim; here we only prove the voice pass did not ship uncited. */
const q = fs.readFileSync(QUEST, 'utf8');
['Q142.W6', 'Q152.W5', 'Q100.N2', 'Q004.N1'].forEach(id =>
  ok('the voice pass cites ' + id + ' from the catalogue', q.indexOf('@STUDY ' + id) >= 0));

/* ---- 7. HE CAN SEE IT, IN A TAB ------------------------------------------ */
/* A comparison living in records/ is a comparison he never opens. NAME THE TAB:
   this one is WORDS, and the payload has to be IN the baked page, because
   _config.yml publishes slices/ and a fetch of records/ 404s in production. */
ok('the WORDS page is baked', fs.existsSync(WORDS_PAGE));
const page = fs.existsSync(WORDS_PAGE) ? fs.readFileSync(WORDS_PAGE, 'utf8') : '';
ok('the side-by-side is INLINED in the WORDS page, not fetched from records/',
  page.indexOf('THE VOICE PASS') >= 0 && page.indexOf('var VOICE =') >= 0);
ok('and the real before-text is in the payload, so both columns are on the page',
  page.indexOf('The line tests clean. A clean line that browns out') >= 0);
ok('the payload is not an empty shell', page.indexOf('"changed": true') >= 0
  || page.indexOf('"changed":true') >= 0);
const alpha = fs.readFileSync('slices/BOHEMIA_ALPHA_0_9.html', 'utf8');
ok('the WORDS tab in the alpha still loads that page',
  alpha.indexOf('BOHEMIA_WORDS_CURRENT.html') >= 0 && alpha.indexOf('data-p="words"') >= 0);

console.log('');
console.log('VOICE GATE: ' + pass + ' passed, ' + fail + ' failed');
console.log('  WHAT IT PROVED: the passed scene varies its rhythm, repeats no opener,');
console.log('  carries no banned phrase, cites the catalogue, changed WORDS ONLY, and');
console.log('  is visible in the WORDS tab beside what it replaced.');
console.log('  WHAT IT DID NOT PROVE: that any line in it is good. Read it out loud.');
process.exit(fail ? 1 : 0);
