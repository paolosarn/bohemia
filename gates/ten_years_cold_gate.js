/* ============================================================================
   TEN YEARS COLD GATE (7/31/26, LAB lane)

   Paolo 7/31, correcting me: "THE WHOLE POINT OF THE GAME IS THAT IT STARTS TEN
   YEARS AFTER THE ECONOMIC CRASH... I DONT WANT IN THE GAME U GOTTA BE DEALING
   WITH SOME WEIRD ECONOMIC GAMEPLAY THE WHOLE WORLD IS BASED ON THE UTILITY
   DYING EVERYWHERE"

   Law: laws/BOHEMIA_ADDENDUM_TEN_YEARS_COLD_7_31_26.md

   THIS GATE EXISTS BECAUSE OF WHAT THE LAB GATE COULD NOT DO. LAB-08 shipped with
   491 green checks and eight caught mutations, and every one of them verified that
   the page did what its record said. NONE of them could ask whether the page
   should exist. It was killed hours later for being a documentary about ten years
   before the game starts. Green gates are never an argument, and this is the gate
   that closes the specific hole: the banned thing here is not a bug, it is a
   CATEGORY of mechanic, and a category can only be kept out by something that
   sweeps for it everywhere, every time.

   Three things:
     1. The law is still the law (three clauses, still saying what they said).
     2. The killed page is still dead and cannot come back.
     3. NO SHIPPED SURFACE HAS GROWN AN ECONOMY. This is the sweep, and it is the
        whole point.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const LAW = 'laws/BOHEMIA_ADDENDUM_TEN_YEARS_COLD_7_31_26.md';
const DEAD_PAGE = 'slices/lab/BOHEMIA_LAB_THE_CRASH_7_31_26.html';
const POSTMORTEM = 'records/BOHEMIA_THE_CRASH_KILL_7_31_26.md';
const LIVE_PAGE = 'slices/lab/BOHEMIA_LAB_TEN_YEARS_COLD_7_31_26.html';
const THREE_CUR = 'laws/BOHEMIA_ADDENDUM_THREE_CURRENCIES_CENTURY_7_26_26.md';

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

console.log('='.repeat(74));
console.log('TEN YEARS COLD GATE — the crash is backstory, no economic gameplay,');
console.log('                      the utility is already dead everywhere');
console.log('='.repeat(74));

/* ==========================================================================
   PART A — THE LAW IS STILL THE LAW
   ========================================================================== */
const lawPath = path.join(ROOT, LAW);
ok('A1 the law exists', fs.existsSync(lawPath));
if (!fs.existsSync(lawPath)) { console.log('  cannot continue'); process.exit(1); }
const law = fs.readFileSync(lawPath, 'utf8');

ok('A2 it quotes his correction verbatim',
   /TEN YEARS AFTER THE ECONOMIC CRASH/.test(law) &&
   /WEIRD ECONOMIC GAMEPLAY/.test(law) &&
   /THE UTILITY DYING EVERYWHERE/.test(law));
ok('A3 dated and LOCKED', /7\/31\/26, LOCKED/.test(law));

/* the three clauses, matched by CLAIM and not by number, so renumbering cannot
   silently drop one */
[['1 the crash is BACKSTORY', /CLAUSE 1[^\n]*BACKSTORY/i],
 ['2 NO ECONOMIC GAMEPLAY', /CLAUSE 2[^\n]*NO ECONOMIC GAMEPLAY/i],
 ['3 the utility is DEAD EVERYWHERE', /CLAUSE 3[^\n]*DEAD EVERYWHERE/i]
].forEach(([what, re]) => ok('A4 clause ' + what + ' is still in the law', re.test(law)));

ok('A5 clause 2 names the specific things it bans, so it cannot be read narrowly',
   /exchange rates/i.test(law) && /inflation/i.test(law) && /withdrawal limits/i.test(law));
ok('A6 clause 3 records that it is the EXISTING power laws read as one thing',
   /CLUSTERED POWER/.test(law) && /LIGHT ?= ?TERRITORY/.test(law));
ok('A7 the law owns that the question I asked him was already answered in canon',
   /already answered/i.test(law));
ok('A8 THE THREE CURRENCIES law is cited and still exists',
   law.indexOf(path.basename(THREE_CUR)) > 0 && fs.existsSync(path.join(ROOT, THREE_CUR)));
ok('A9 the law says NO V2 of the killed mechanics', /no v2/i.test(law));

/* ==========================================================================
   PART B — THE KILLED PAGE STAYS DEAD
   ========================================================================== */
ok('B1 the killed crash page is GONE from disk', !fs.existsSync(path.join(ROOT, DEAD_PAGE)));
const grave = fs.readFileSync(path.join(ROOT, 'gates/bohemia_graveyard.txt'), 'utf8');
ok('B2 and it is in the graveyard registry', grave.indexOf(path.basename(DEAD_PAGE)) > 0);
ok('B3 with a post-mortem that exists', fs.existsSync(path.join(ROOT, POSTMORTEM)));
const pm = fs.existsSync(path.join(ROOT, POSTMORTEM)) ? fs.readFileSync(path.join(ROOT, POSTMORTEM), 'utf8') : '';
ok('B4 the post-mortem names a root cause, not just the symptom',
   /ROOT CAUSE/i.test(pm) && /prequel|wrong decade/i.test(pm));
ok('B5 and it records that GREEN GATES SAID NOTHING — the honest part',
   /green gates/i.test(pm));

/* its records survive, marked dead — the Zomboid precedent */
['records/lab/BOHEMIA_LAB_THE_CRASH_TEARDOWN_7_31_26.txt',
 'records/lab/BOHEMIA_LAB_THE_CRASH_PATTERN_NOTE_7_31_26.md'].forEach((f, i) => {
  const p = path.join(ROOT, f);
  ok('B6.' + (i + 1) + ' its record survives and is marked DEAD at the top: ' + path.basename(f),
     fs.existsSync(p) && /DEAD 7\/31\/26/.test(fs.readFileSync(p, 'utf8').slice(0, 900)));
});

/* nothing may link the dead page */
function walk(dir, ext, out) {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return out;
  for (const f of fs.readdirSync(full, { withFileTypes: true })) {
    if (f.isDirectory()) continue;
    if (ext.test(f.name)) out.push(path.join(dir, f.name));
  }
  return out;
}
const surfaces = walk('slices', /\.(html|js)$/, walk('engine', /\.js$/, []));
const linkers = surfaces.filter(f => fs.readFileSync(path.join(ROOT, f), 'utf8')
  .indexOf(path.basename(DEAD_PAGE)) >= 0);
ok('B7 no surface links the dead page' + (linkers.length ? ' (' + linkers.join(', ') + ')' : ''),
   linkers.length === 0);

/* ==========================================================================
   PART C — THE SWEEP. NO SHIPPED SURFACE HAS GROWN AN ECONOMY.
   This is the part that earns the gate's keep, and it is why the law is a law
   rather than a paragraph. Matched as STRUCTURES, never mentions: the laws and
   the records are REQUIRED to name these things in order to ban them, and a
   check that trips on its own prohibition is the mistake this repo has now
   shipped four separate times (lab_gate A10, A12, A24, Y18).
   ========================================================================== */
/* WHAT IS BANNED IS A PRICE THAT MOVES BY ITSELF, NOT A PRICE THAT EXISTS.
   The first version of this list matched /prices?\s*[:=]\s*[[{]/ and FAILED
   engine/bohemia_purse.js -- the WORLD lane's brand-new module, whose `PRICES = {}`
   ships EMPTY and marked [PENDING Paolo] with the comment "an empty price table
   means the shop is real and the tag on the shelf is his". That is
   MECHANISM-MINE/CONTENTS-PAOLO'S done exactly right, and my gate would have
   accused a sibling lane of breaking a law it was obeying. A game where you can buy
   something needs a price; clause 2 bans the ECONOMY SIMULATION -- a price that
   changes on a clock, a rate, a curve -- not the existence of a number on a tag.
   The law now says that boundary out loud so nobody has to infer it.
   And /devaluat/i matched the word in a COMMENT explaining what died. Fifth time
   this repo has shipped a check that hunted a word instead of a thing (lab_gate
   A10, A12, A24, Y18). Every entry below is now a MOVING-price structure. */
const BANNED = [
  [/\bexchangeRate\b|\bexchange_rate\b|\bEXCHANGE_RATE\b/, 'an exchange rate'],
  [/\binflation(Rate|Pct|PerDay|PerMonth)?\s*[:=]\s*[0-9.]/i, 'an inflation term'],
  [/\bprice(Decay|Drift|PerDay|OnDay|AtDay|Curve)\s*[:=(]/i, 'a price that moves on a clock'],
  [/\bwithdrawalCap\b|\bwithdrawLimit\b/i, 'a withdrawal cap'],
  [/\bmoneyWorth\s*\(|\bdailyDecay\s*\(|\brateOnDay\s*\(/, "the dead page's money maths"],
  [/\bdevaluation(Rate|Curve|PerDay)?\s*[:=(]/i, 'a devaluation mechanic']
];
/* engine + slices, but NOT the lab pages that are allowed to reference other
   games, and NOT this gate (which must name what it bans). */
const sweep = surfaces.filter(f => f.indexOf('slices/lab/') !== 0);
let econHits = [];
sweep.forEach(f => {
  const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
  BANNED.forEach(([re, what]) => { if (re.test(src)) econHits.push(f + ': ' + what); });
});
ok('C1 NO SHIPPED SURFACE HAS AN ECONOMIC MECHANIC (' + sweep.length + ' swept)' +
   (econHits.length ? ' -> ' + econHits.slice(0, 3).join('; ') : ''), econHits.length === 0);

/* and no fourth currency anywhere */
const FOURTH = /\b(CURRENCIES|currencies)\s*[:=]\s*([4-9]|[1-9][0-9])\b/;
const fourth = sweep.filter(f => FOURTH.test(fs.readFileSync(path.join(ROOT, f), 'utf8')));
ok('C2 no surface declares more than three currencies' +
   (fourth.length ? ' (' + fourth.join(', ') + ')' : ''), fourth.length === 0);

/* ==========================================================================
   PART D — THE ANSWER SHIPPED, AND IT IS CLEAN
   ========================================================================== */
ok('D1 the replacement page exists', fs.existsSync(path.join(ROOT, LIVE_PAGE)));
if (fs.existsSync(path.join(ROOT, LIVE_PAGE))) {
  const live = fs.readFileSync(path.join(ROOT, LIVE_PAGE), 'utf8');
  ok('D2 it says on its own face that there is no economy, by law',
     /NO ECONOMY/i.test(live) && live.indexOf(path.basename(LAW)) > 0);
  ok('D3 it is a REFERENCE and not the game', /REFERENCE MODEL/.test(live) && /NOT BOHEMIA/.test(live));
  let hits = [];
  BANNED.forEach(([re, what]) => { if (re.test(live)) hits.push(what); });
  ok('D4 and IT is clean of the banned category too' + (hits.length ? ' (' + hits.join(', ') + ')' : ''),
     hits.length === 0);
  ok('D5 it carries the ten-years-cold framing as the FIRST fact about the world',
     /YEARS_AFTER_CRASH/.test(live) && /years cold/i.test(live));
}

console.log('='.repeat(74));
console.log('  TEN YEARS COLD GATE: ' + pass + ' pass / ' + fail + ' fail');
console.log('='.repeat(74));
process.exit(fail ? 1 : 0);
