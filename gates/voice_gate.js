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
/* THE DEMO'S ENTIRE SCRIPT (8/27). engine/bohemia_demoquests.js schedules five
   quests across days 1-5 and they are every word a stranger reads. One of them
   having a voice pass while the other four contract 0% of the time would mean
   the demo changes voice on day 2, which is worse than not passing any. The
   floors below are held for ALL FIVE, by scene, named. */
const DEMO = [
  { day: 1, title: 'The Meter Reader' },
  { day: 2, title: 'The Back Door' },
  { day: 3, title: 'The Same Crate Twice' },
  { day: 4, title: 'The Cold Room' },
  { day: 5, title: 'The Pressure Goes Backward' },
];
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
/* EIGHT since 8/27: seven found by reading our own text, plus the refusal tell
   the research pass added, which is the only one with hard science under it. */
ok('the diagnosis names all eight tells it found',
  (diag.match(/^## TELL \d/gm) || []).length === 8);
ok('and the eighth cites the research it came from, not a preference',
  diag.indexOf('269 ms') >= 0 && diag.indexOf('561 ms') >= 0
    && fs.existsSync('records/BOHEMIA_RESEARCH_HOW_A_SENTENCE_SOUNDS_8_27_26.md'));
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

/* ---- 4a. ALL FIVE DEMO SCENES, THE THREE MEASURES ------------------------ */
const EXPANDED_RE = new RegExp(
  '\\b(do not|does not|did not|is not|are not|was not|were not|will not|would not'
  + '|could not|should not|cannot|can not|have not|has not|had not|it is|that is'
  + '|there is|they are|you are|we are|i am|i will|you will|we will|they will'
  + '|i have|you have|it will|he is|she is|who is|what is|let us|i would'
  + '|going to)\\b', 'gi');
const CONTRACTED_RE = /[A-Za-z][’'](s|t|re|ll|ve|d|m)\b/g;
DEMO.forEach(d => {
  const sc = book.books.find(b => b.title === d.title);
  /* NOT `if (!ok(...))` -- ok() returns whatever the ++ or the console.log
     evaluated to, so branching on it silently skips checks. Test the thing. */
  ok('DEMO DAY ' + d.day + ': "' + d.title + '" is in the words book', !!sc);
  if (!sc) return;
  const spoken2 = sc.lines.filter(l => l.kind === 'say').map(l => l.text);
  const all = sc.lines.map(l => l.text).join(' ');
  const e = (all.match(EXPANDED_RE) || []).length;
  const c = (all.match(CONTRACTED_RE) || []).length;
  const rate = 100 * c / Math.max(1, c + e);
  /* 60% is well under every measured scene (81.8 to 100) and well over what any
     of them read before the pass (0.0 to 7.1). It is a floor against regression,
     not a target: a scene is not better for contracting more. */
  ok('DEMO DAY ' + d.day + ' talks like people (' + rate.toFixed(1) + '% contracted, floor 60)',
    rate >= 60);
  const r2 = rhythm(spoken2);
  ok('DEMO DAY ' + d.day + ' varies its rhythm (' + (r2 ? r2.cv.toFixed(2) : 'n/a') + ' >= 0.65)',
    !!r2 && r2.cv >= 0.65);
  const bans = [];
  sc.lines.forEach(l => banned(l.text).forEach(b2 => bans.push(b2 + ' <- "' + l.text.slice(0, 40) + '"')));
  ok('DEMO DAY ' + d.day + ' carries no banned phrase'
    + (bans.length ? ': ' + bans.join('; ') : ''), bans.length === 0);
});
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

/* ---- 4b. THE DEMO CARD SAYS WHAT THE QUEST SAYS -------------------------- */
/* The demo table hand-typed each day's brief out of the .bq, so the day-1 voice
   pass left the quest saying one thing and the card the player reads saying
   another. Two copies of one sentence is a drift waiting to happen; the log wins
   now and the table is only a fallback. Both halves are checked. */
const dq = fs.readFileSync('engine/bohemia_demoquests.js', 'utf8');
ok('the demo brief is DERIVED from the quest, not a second copy of it',
  /D\.brief = function/.test(dq) && dq.indexOf('brief: D.brief()') >= 0);
const drift = [];
DEMO.forEach(d => {
  const sc = book.books.find(b => b.title === d.title);
  if (!sc) return;
  const first = sc.lines.filter(l => l.kind === 'journal')[0];
  if (!first) return;
  /* the fallback in the table must still match the quest it copies */
  if (dq.indexOf(first.text.replace(/'/g, "\\'")) < 0) drift.push('day ' + d.day);
});
ok('and the fallback brief in the table still matches its quest'
  + (drift.length ? ' (stale: ' + drift.join(', ') + ')' : ''), drift.length === 0);

/* ---- 4c. THE WORDS REACHED THE DEMO, WHICH IS THE ONLY SURFACE THAT COUNTS - */
/* THE PUSH WORKING IS NOT THE SITE WORKING, and rewriting a .bq is not the demo
   saying it. The quest text is inlined THREE times downstream: the current
   slice, the city world (which is where the day loop actually plays it), and
   the DIRECT tab's own table -- each by a different tool. The first pass of this
   work rewrote five quests, re-cut the demo, and the demo still spoke every old
   line, because the cut copies the alpha and nothing had re-inlined the alpha.
   So the claim is checked where the player meets it: in the built demo file. */
const demoFile = 'slices/BOHEMIA_DEMO.html';
ok('the demo build exists', fs.existsSync(demoFile));
const demoHtml = fs.existsSync(demoFile) ? fs.readFileSync(demoFile, 'utf8') : '';
const NEW_IN_DEMO = [
  [1, 'Nine at night, every night'],
  [2, 'Careful is all'],
  [3, "Who's going to tell them"],
  [4, "It's on, it's wet"],
  [5, "What's that face"],
];
const OLD_IN_DEMO = [
  [1, 'The block loses half its light at the same hour'],
  [2, 'That is the whole answer'],
  [3, 'quiet money spends'],
  [3, 'I pay better, and I pay now'],
  [4, 'It is on, it is wet'],
];
NEW_IN_DEMO.forEach(([d, t]) =>
  ok('DEMO DAY ' + d + ": the rewritten words reached the built demo (\"" + t + '")',
    demoHtml.indexOf(t) >= 0));
OLD_IN_DEMO.forEach(([d, t]) =>
  ok('DEMO DAY ' + d + ': the OLD line is gone from the built demo ("' + t.slice(0, 34) + '")',
    demoHtml.indexOf(t) < 0));

/* ---- 4d. THE WORDS BEFORE ANYBODY SPEAKS --------------------------------- */
/* ALWAYS MAKE AN ATTEMPT (8/11) names the whole list of player-facing text and
   it is not only dialogue: "UI copy, tooltips, notifications, failure messages".
   The words book harvested 36 sources and every one was a quest, a scene or a
   bark, so the wake card, the objectives and the save panel -- the FIRST words
   a stranger reads, and the only words some of them read -- were never audited
   and HE COULD NOT EDIT THEM, which is the half of that law that makes the rest
   of it real. Harvested by DRIVING the built demo, never by grepping source:
   the city world holds 368 quoted strings and a stranger sees almost none of
   them, so the test for player-facing is "the game painted it". */
const UI_PATH = 'records/BOHEMIA_INTERFACE_WORDS.json';
ok('the interface words are harvested from the built demo', fs.existsSync(UI_PATH));
const ui = fs.existsSync(UI_PATH) ? JSON.parse(fs.readFileSync(UI_PATH, 'utf8')) : { lines: [] };
ok('and there are actually some (' + ui.lines.length + ' across ' +
  (ui._meta ? ui._meta.screens.length : 0) + ' screens)', ui.lines.length >= 25);
ok('they are DRIVEN off the real surface, not grepped out of source',
  !!(ui._meta && /painted|Driven|driven/.test(ui._meta.how || '')));
ok('every one is tagged draft so he can find it in the WORDS tab',
  ui.lines.every(l => l.draft === true));
/* read the tab file here rather than reusing `page`, which section 7 declares
   below this point -- a const is not hoisted and the gate died on it. */
ok('and the WORDS tab actually carries them',
  fs.existsSync(WORDS_PAGE)
    && fs.readFileSync(WORDS_PAGE, 'utf8').indexOf('WHAT THE SCREEN SAYS') >= 0);

/* THE TWO THINGS THAT MUST NEVER BE ON A PLAYER'S SCREEN. Both were, until
   8/27: the save panel printed "backend:" (a developer's word for a storage
   API) and the walking hint read "the neighborhood you dropped into" -- drop-in
   vocabulary from a genre this game is not. THERE ARE NO RUNS: one character,
   about a hundred hours, and he LIVES on that block. */
const DEV_WORDS = [
  ['backend', /\bbackend\b/i],
  ['localStorage / IndexedDB / API', /\b(localstorage|indexeddb|\bapi\b)\b/i],
  ['null / undefined / NaN', /\b(null|undefined|NaN)\b/],
  ['a state flag as prose ("not taken")', /\bnot taken\b/i],
  /* THERE ARE NO RUNS is the FIRST LINE of CLAUDE.md and the word was on a
     BUTTON: the end-of-first-day card said KEEP THIS RUN. One character, about
     a hundred hours. There is nothing to keep but the valley. */
  ['run vocabulary ("this run", "dropped into", "restart")',
    /\b(dropped into|this run|next run|keep this run|restart the run|per run|each run)\b/i],
  /* THE GAME MAY NOT ADDRESS ITS DEVELOPER. The rung card told a stranger that
     "which faction claims which district is YOURS TO SET" and quoted Paolo back
     at them. An unset dial is allowed to say it is unset; it is not allowed to
     ask the player to go and set it. */
  ['the game talking to Paolo instead of the player',
    /\b(yours to set|you said "|you have not (set|named|ruled)|pending paolo|\[pending)/i],
  ['a state flag as prose ("never taken", "not set")',
    /\b(never taken|not set|unset|undefined state)\b/i],
  ['a stack trace or a file path', /\.(js|json|py)\b|\bfunction\s*\(/],
];
const devLeaks = [];
ui.lines.forEach(l => DEV_WORDS.forEach(([name, re]) => {
  if (re.test(l.text)) devLeaks.push(name + ' <- "' + l.text.slice(0, 46) + '" (' + l.screen + ')');
}));
ok('NO DEVELOPER LANGUAGE reaches a player'
  + (devLeaks.length ? ':\n         ' + devLeaks.join('\n         ') : ''),
  devLeaks.length === 0);
/* MUTATION: the sweep has to actually bite, or it is decoration. */
ok('MUTATION: the dev-language sweep fires on a planted leak',
  DEV_WORDS.some(([, re]) => re.test('saved to backend: null')));

/* ---- 4e. CONTRACTION-PASSED IS NOT VOICE-PASSED -------------------------- */
/* The 22 scenes the demo does not play took a MECHANICAL pass on 8/27
   (tools/bohemia_contraction_pass.py): 819 contractions, no craft. That fixes
   the loudest tell and NOT the other seven, and the two words are held apart
   here on purpose, because "we passed 27 scenes" would be the most flattering
   sentence in this repo and it would be false.
   THE PROOF IS IN THE NUMBERS: quest contractions went 2.2% -> 89.3% while
   maxim endings went 34.0% -> 32.1%. A pass that cut sermons would have moved
   the second number. This one could not and did not. */
const met2 = fs.existsSync('records/BOHEMIA_VOICE_METRICS.json')
  ? JSON.parse(fs.readFileSync('records/BOHEMIA_VOICE_METRICS.json', 'utf8')) : {};
ok('CORPUS: the quest scenes talk like people now (' +
  (met2.contractions ? met2.contractions.quest_rate : 0) + '%, floor 70)',
  !!met2.contractions && met2.contractions.quest_rate >= 70);
ok('and the AS-FOUND rate is still on record as 2.2%',
  !!met2.baseline && Math.abs(met2.baseline.contractions.quest_rate - 2.2) < 0.05);
/* the honest half: the sermons did NOT go away, and the gate says so out loud */
const maxNow = met2.maxims ? met2.maxims.pct : 0;
const maxWas = met2.baseline && met2.baseline.maxims ? met2.baseline.maxims.pct : 0;
ok('THE SERMONS ARE STILL THERE and nothing here pretends otherwise (' +
  maxNow + '% of speeches end on one, was ' + maxWas + '%)', maxNow > 10);
console.log('    (a mechanical pass cannot cut a maxim. 22 scenes are CONTRACTION-passed;');
console.log('     only the 5 the demo plays are VOICE-passed, by hand, line by line.)');
/* and the tool must keep its hands off the hand-written five */
const cpTool = fs.existsSync('tools/bohemia_contraction_pass.py')
  ? fs.readFileSync('tools/bohemia_contraction_pass.py', 'utf8') : '';
ok('the mechanical pass refuses to touch the five hand-written scenes',
  DEMO.every(d => {
    const stem = { 1: 'S01_THE_METER_READER', 2: 'S09_THE_BACK_DOOR',
                   3: 'S02_THE_SAME_CRATE_TWICE', 4: 'S22_THE_COLD_ROOM',
                   5: 'S25_THE_PRESSURE_GOES_BACKWARD' }[d.day];
    return cpTool.indexOf(stem) >= 0;
  }));
ok('and it knows a contracted auxiliary may not end a clause ("I can\'t promise I will")',
  /STRANDED/.test(cpTool) && cpTool.indexOf('stranded') >= 0);

/* ---- 5. CORPUS-WIDE, RATCHETING ------------------------------------------ */
/* 5 of 27 scenes have had a voice pass -- the five the demo actually plays.
   The other 22 have not, and this gate does not pretend they have. What the gate holds is that nobody makes it WORSE while they wait:
   the counts below are today's, written down, and a new one fails. */
let corpusBans = 0, corpusEmDash = 0;
book.books.forEach(b => b.lines.forEach(l => {
  corpusBans += banned(l.text).length;
  if (l.text.indexOf('—') >= 0) corpusEmDash++;
}));
/* RATCHET. 44 on 8/26; 39 on 8/27 after the four demo scenes took their pass.
   Only ever goes DOWN, and a lane that lowers it writes the new number here. */
const BAN_CEILING = 39;
ok('CORPUS: banned-phrase hits are not growing (' + corpusBans + ', ceiling ' +
  BAN_CEILING + ')', corpusBans <= BAN_CEILING);
ok('CORPUS: zero em dashes in any authored line', corpusEmDash === 0);
console.log('    (' + corpusBans + ' banned-phrase hits still standing in the 22 scenes ' +
  'that have NOT had a voice pass. The demo\'s five are clean. Named, not hidden.)');

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
