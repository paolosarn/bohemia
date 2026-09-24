/* ============================================================================
   THE ROAD WORDS ARE SAYABLE GATE (9/24/26, WORDS lane) -- row [bb event
   writing], HOW-A-BB-EVENT-IS-WRITTEN, rule 33 school.

   PAOLO 9/20, rule 19: text comes from a MOUTH, never a card.
   PAOLO 9/24, rule 33(c): events on the road stay, "a face, two or three real
   choices"; and 33(g): "Battle Brothers is just a bunch of pictures... we can
   put more life into it" -- an event is a person who moves and speaks, never an
   illustrated card.

   *** WHAT THIS GATE IS FOR, STATED BEFORE ANY NUMBER, BECAUSE A GREEN HERE
   DOES NOT MEAN THE ROAD MOMENTS SHIP. ***
   ROAD_WORDS holds twelve road moments. `roadCard` is DEFINED AND HAS ZERO
   CALLERS: another lane killed the card under rule 19e and deliberately kept the
   table, writing "they are content waiting for bodies to say them". So these
   twelve reach nobody today. This gate does not claim they do. It is a READINESS
   CHECK on parked content: it holds the twelve to the shape a MOUTH can actually
   say, so that the round somebody gives them a body, they are sayable instead of
   being rewritten a second time.

   MEASURED THIS ROUND, BEFORE THE GATE WAS WRITTEN:
     road moments                       12
     average length                    134 characters
     longest                           179
     OVER THE 98-CHARACTER HOLD      12 of 12
     open with somebody speaking      0 of 12
     narrate the player as SUBJECT    3 of 12 (a cruder first count said 9;
                                        two of those have him as the OBJECT of
                                        somebody else's verb, which is sayable)
   And measured against the reference itself: one real Battle Brothers event
   situation is 266 characters, 3 sentences, second person present tense, spoken
   by a narrator. Ours are the same shape at half the length. We wrote Battle
   Brothers events without meaning to, and rule 19 bans them.

   WHY 98 IS THE NUMBER AND NOT A TASTE. barkHold() in the walked city is
   (length / 14) * 1000 ms clamped at 7000, so a bubble past 98 characters is
   held exactly as long as a 98-character one. Every letter after that is time
   the reader does not get. That clamp is the surface these lines are waiting
   for, which is why it is the ruler here.

   *** AND THE RULER WAS WRONG IN THE FIRST DRAFT OF THIS FILE, WHICH IS WHY THE
   PARAGRAPH ABOVE EXISTS. *** The first version held these lines to the bubble
   clamp as a LIVE violation. They do not go to a bubble today; they go to a card
   that nothing opens. A card the player dismisses has no clock at all -- this
   lane's own law, THE RULER COMES FROM WHO CONTROLS THE DWELL. The check is the
   same; the claim it makes is not. It is readiness, not a breach.

   THE RATCHET. Both counts are pinned at TODAY'S measured debt, so this can only
   ever go down and a thirteenth road moment written long is refused on arrival.
   Lower the numbers when the debt drops; raising one needs a newer ruling.

   NOT A DUPLICATE OF ask_has_a_mouth_gate.js (QUESTS, 9/21). That one holds the
   ASK GENERATOR to rule 19. Nothing held the road moments, which is how twelve
   narrator lines sat in the file with a law against them.
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');

let pass = 0, fail = 0;
const ok = (name, cond, note) => {
  if (cond) { pass++; console.log('  ok   ' + name + (note ? '   ' + note : '')); }
  else { fail++; console.log('  FAIL ' + name + (note ? '   ' + note : '')); }
};
const head = t => console.log('\n' + t);

/* ---- THE NUMBERS THIS IS PINNED TO ------------------------------------- */
const HOLD_CEILING = 98;   // barkHold's clamp, in characters at 14 cps
const DEBT_TOO_LONG = 12;  // of 12, measured 9/24 before a word was changed
const DEBT_NARRATES = 3;   // of 12, measured 9/24 with the ruler below,
                           // NOT the 9 a cruder first count reported
const MOMENTS_EXPECTED = 12;

const src = fs.readFileSync(CITY, 'utf8');

/* read the table the way the file writes it: key: "..." + "..." */
function readRoadWords(text) {
  const at = text.indexOf('var ROAD_WORDS = {');
  if (at < 0) return [];
  const body = text.slice(at, text.indexOf('\n};', at) + 3);
  const re = /(\w+):\s*((?:\s*"(?:\\.|[^"\\])*"\s*\+?)+)/g;
  const rows = [];
  let m;
  while ((m = re.exec(body))) {
    const lits = m[2].match(/"(?:\\.|[^"\\])*"/g) || [];
    let joined = '';
    for (const l of lits) { try { joined += JSON.parse(l); } catch (_e) { return []; } }
    if (joined.length > 20) rows.push({ key: m[1], text: joined });
  }
  return rows;
}

/* A MOUTH DOES NOT NARRATE YOU. This is the rule-19 property in a form a
   machine can read, and *** THE RULER CAME OUT OF THE TWELVE LINES RATHER THAN
   OUT OF MY HEAD, WHICH IS THE WHOLE REASON IT IS RIGHT. *** The first draft
   matched any "you" plus a word, and a control caught it on a line somebody
   really says. So the five lines that use second person were printed and read:

     "A coyote picks YOU UP at the corner"        you is the OBJECT
     "He sees YOU and he doesn't slow down"       you is the OBJECT
     "YOU'VE GOT about two seconds to pick..."    you is the SUBJECT
     "gone before YOU FINISH turning"             you is the SUBJECT
     "...and YOU'RE only now HEARING it"          you is the SUBJECT

   THE PROPERTY IS GRAMMATICAL, NOT A WORD LIST: a narrator makes the player the
   SUBJECT of a verb, because only a narrator is inside your body and your head.
   Somebody talking to you can make you the OBJECT all they like -- "a coyote
   picked you up", "he sees you" -- and that is not narration, it is a person
   telling you a thing that happened to you.

   Quoted speech is stripped before the test. A person speaking may address you
   however they want; what rule 19 bans is the NARRATOR doing it. */
const CLAUSE = '(?:^|[.!?,;]\\s+|\\b(?:and|then|before|after|where|when|while|if|that|because|until|so)\\s+)';
const NARRATES_YOU = new RegExp(CLAUSE + "you(?:'ve|'re|'ll|'d)?\\b\\s+\\w+", 'i');
function narratesThePlayer(t) {
  const outside = String(t)
    .replace(/"(?:\\.|[^"\\])*"/g, ' ')
    .replace(/\u201c[^\u201d]*\u201d/g, ' ');
  return NARRATES_YOU.test(outside);
}

head('A. THE TABLE IS STILL THERE (deleting it is not a way to pass)');
const rows = readRoadWords(src);
ok('the twelve road moments are still in the file', rows.length === MOMENTS_EXPECTED,
   rows.length + ' of ' + MOMENTS_EXPECTED);
ok('and every one of them still has words in it',
   rows.length > 0 && rows.every(r => r.text.trim().length > 20));

head('B. THEY FIT THE HOLD A MOUTH WOULD GIVE THEM (' + HOLD_CEILING + ' characters)');
const tooLong = rows.filter(r => r.text.length > HOLD_CEILING);
const lens = rows.map(r => r.text.length);
console.log('       longest ' + (lens.length ? Math.max(...lens) : 0)
  + ', average ' + (lens.length ? Math.round(lens.reduce((a, b) => a + b, 0) / lens.length) : 0));
ok('no more road moments are too long to be said than the debt this was pinned at',
   tooLong.length <= DEBT_TOO_LONG,
   tooLong.length + ' too long, ratchet ' + DEBT_TOO_LONG
     + (tooLong.length < DEBT_TOO_LONG ? '  <-- DEBT DROPPED, re-pin this gate DOWN' : ''));

head('C. A MOUTH DOES NOT NARRATE THE PLAYER (rule 19)');
const narrating = rows.filter(r => narratesThePlayer(r.text));
ok('no more road moments narrate him than the debt this was pinned at',
   narrating.length <= DEBT_NARRATES,
   narrating.length + ' narrate him, ratchet ' + DEBT_NARRATES
     + (narrating.length < DEBT_NARRATES ? '  <-- DEBT DROPPED, re-pin this gate DOWN' : ''));

head('D. THE CONTROLS, so a green above is never an empty pass');
/* the good control is quoted, because that is how a said line really appears
   in this table -- an UNQUOTED "argue if you want" is the narrator addressing
   him, which rule 19 bans too, so flagging it would be correct. */
const GOOD = '"Toll\'s a third. Argue if you want."';
const BAD  = 'You feel the ground shift under you and you realise, far too late, '
           + 'that the whole ramp has been theirs since the spring and you walked '
           + 'straight into it without looking once.';
ok('[self-test] a short line somebody could really say passes both checks',
   GOOD.length <= HOLD_CEILING && !narratesThePlayer(GOOD));
ok('[self-test] a long narrator line fails both checks',
   BAD.length > HOLD_CEILING && narratesThePlayer(BAD));
ok('[self-test] a line that SPEAKS to you about your things is not called narration',
   !narratesThePlayer('"Just what\'s in the bag. You got water in there?"'),
   'a mugger really says this');
ok('[self-test] the reader really read the file, so a zero is not an empty sweep',
   rows.length > 0 && src.length > 1000);

head('E. WHAT THIS DOES NOT CLAIM');
const cardCalls = (src.match(/\broadCard\s*\(/g) || []).length;
ok('the road card still has no caller, so nobody reads a green here as "it ships"',
   cardCalls <= 1, cardCalls + ' mention(s) of roadCard, which is its definition only');

console.log('\n' + (fail ? 'RED' : 'GREEN') + ': ' + pass + ' passed, ' + fail + ' failed');
if (fail) {
  console.log('  WHAT IT PROVED: nothing about whether these lines are GOOD. It holds');
  console.log('  them to a shape a person could say out loud, and no further.');
  process.exit(1);
}
