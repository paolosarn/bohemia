#!/usr/bin/env node
/* ============================================================================
   COOK EVERY ROUND -- ONE MADE THING PER MAKING LANE, OR THE ROW IS RED
   (9/21/26, PLUMBER lane, VAMILY row [cook gate], Paolo's rule 22e)

   PAOLO 9/21:
     "I need the UI chat to be cooking up more... I'll enter the sound chat and
      it's not even making fucking sounds. IT'S CODING AND CHECKING WHETHER THE
      SOUNDS ARE BROKEN OR NOT. It's so fucking strange. I NEED TO BE SEEING THEM
      COOKING UP MORE, EVERY TIME, NOT NEVER."

   Rule 22(a): a making lane cooks every round -- sounds makes a sound, UI a panel,
   COOK a tile, CHARACTER a body, ANIMATION a clip, PORTRAIT a face, WORDS lines in
   a mouth, PEOPLE a person, LIFE+CITY a building, FACTIONS a sign, QUESTS an ask,
   WORLD a thing on the phone. One real thing minimum, REGISTERED IN THE VOTE TAB,
   or the round did not happen.

   Rule 22(e) makes that a gate and says that until it exists the coordinator reads
   the registry by hand every VAMILY. This is that gate.

   ## WHAT IT COMPARES, AND WHY IT IS A DATE AND NOT A GUESS

   A "round" is not a git concept. It is one VAMILY, and nothing in the repo marks
   where one ends. So this does not try to infer round boundaries, because an
   instrument that guesses at its unit produces numbers that have to be taken back
   -- this lane has spent four rounds proving that.

   It compares two dates that both exist and neither of which is inferred:

       the newest thing a lane REGISTERED   (items[].made in the vote registry)
       the newest commit that lane LANDED   (git log on main, by its own prefix)

   A making lane that has landed work on main SINCE the last thing it cooked has
   had at least one round of coding and checking with nothing made. That is Paolo's
   sentence, turned into a comparison.

   ## WHAT IT DOES NOT CLAIM

   It cannot say WHICH round was empty or how many were. A lane that cooked on
   Monday and landed three rounds of code after it reads the same as a lane that
   landed one. The gate says "this lane has coded since it last cooked", names the
   gap in days, and stops. A bigger claim would need a round marker that does not
   exist, and inventing one is how a checker starts lying.

   ## THE HONEST EXEMPTIONS, WHICH THE RULE ITSELF NAMES

     - a research lane is exempt (ECONOMY, EYES, WORDS-at-school): only the twelve
       lanes rule 22(a) lists by name are held
     - a lane that registered and then the item VANISHED by his vote still counts,
       so verdicts are read alongside items and a voted-away item is still proof
       that the lane cooked
     - PLUMBER, RUN, DIRECTION, COMBAT and the coordinator are not making lanes:
       they are not held here and saying so is not a favour to myself, it is what
       rule 22(a) lists

   ## THE FLOOR

   A registry that will not parse, or a git history this cannot read, is a BROKEN
   run and fails rather than passing. This lane has shipped three gates that were
   green while measuring nothing; a cook gate that passes because it found no
   registry is the loudest version of that mistake.

     node gates/cook_every_round_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.dirname(__dirname);
const REGISTRY = path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json');

/* THE TWELVE, EXACTLY AS RULE 22(a) LISTS THEM, and the commit prefix each uses on
   main. Nobody is added or removed here without the rule changing first. */
const MAKING = [
  ['SOUNDS',    'sounds',    'a sound'],
  ['UI',        'ui',        'a panel'],
  ['COOK',      'cook',      'a tile'],
  ['CHARACTER', 'character', 'a body'],
  ['ANIMATION', 'animation', 'a clip'],
  ['PORTRAIT',  'portrait',  'a face'],
  ['WORDS',     'words',     'lines in a mouth'],
  ['PEOPLE',    'people',    'a person'],
  ['LIFE+CITY', 'life+city', 'a building'],
  ['FACTIONS',  'factions',  'a sign'],
  ['QUESTS',    'quests',    'an ask'],
  ['WORLD',     'world',     'a thing on the phone'],
];

let pass = 0, fail = 0;
const ok = (n, c, why) => { if (c) { pass++; console.log('  ok   ' + n); }
  else { fail++; console.log('  FAIL ' + n + (why ? '\n         ' + why : '')); } };

/* "9/18" -> a day number in 2026, so two dates can be compared without pretending
   to a precision the registry does not carry. */
function madeDay(made) {
  const m = /^(\d{1,2})\/(\d{1,2})/.exec(String(made || ''));
  if (!m) return null;
  return Date.UTC(2026, +m[1] - 1, +m[2]) / 86400000;
}
const dayOf = (iso) => Math.floor(Date.parse(iso) / 86400000);

(function main() {
  process.chdir(ROOT);
  console.log('\nCOOK EVERY ROUND -- who cooked, and who only checked (Paolo 9/21, rule 22e)\n');

  let reg = null;
  try { reg = JSON.parse(fs.readFileSync(REGISTRY, 'utf8')); }
  catch (e) {
    ok('the vote registry parses', false, path.relative(ROOT, REGISTRY) + ': '
      + String(e.message).slice(0, 100) + '. A cook gate that cannot read the registry '
      + 'must fail, not pass: passing would report "everybody cooked" off a missing file.');
    console.log('\n=== COOK EVERY ROUND GATE: ' + pass + ' passed, ' + fail + ' failed ===');
    process.exit(1);
  }
  const items = Array.isArray(reg.items) ? reg.items : [];
  const verdicts = Array.isArray(reg.verdicts) ? reg.verdicts : [];
  ok('the vote registry parses and carries an items list', Array.isArray(reg.items));

  /* A VOTED-AWAY ITEM STILL COUNTS, because rule 22 says so: the lane cooked, he
     voted, the item left the tab. Its verdict still carries the lane and the date. */
  const cooked = items.concat(verdicts.map(v => ({
    lane: v.lane, made: v.made || v.votedOn, title: (v.title || v.id || 'voted away') + ' (voted)',
  })));

  let history = '';
  try {
    history = execFileSync('git', ['log', '--format=%H\t%cI\t%s', '-600', 'origin/main'],
      { cwd: ROOT, encoding: 'utf8' });
  } catch (e) { /* fall through to the floor below */ }
  const commits = history.trim() ? history.trim().split('\n').map(l => {
    const [sha, iso, subj] = l.split('\t');
    return { sha, iso, subj: subj || '' };
  }) : [];
  ok('main\'s history is readable, so "landed since" means something',
    commits.length > 50, 'read ' + commits.length + ' commit(s); a cook gate with no '
    + 'history to compare against would pass every lane for free');
  if (fail) { console.log('\n=== COOK EVERY ROUND GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(1); }

  console.log('  ' + items.length + ' item(s) in the tab, ' + verdicts.length + ' voted away, '
    + commits.length + ' commit(s) of main read\n');
  console.log('  LANE          LAST COOKED                              LAST LANDED   VERDICT');

  const behind = [];
  for (const [name, laneKey, what] of MAKING) {
    const mine = cooked.filter(i => String(i.lane || '').toLowerCase() === laneKey);
    const newest = mine.map(i => ({ i, d: madeDay(i.made) })).filter(x => x.d != null)
      .sort((a, b) => b.d - a.d)[0];
    /* the lane's own commits, by the prefix it writes on main */
    const head = new RegExp('^' + name.replace(/[+]/g, '\\+') + '(?:\\b|[ :[])', 'i');
    const landed = commits.filter(c => head.test(c.subj))[0];
    const cookedDay = newest ? newest.d : null;
    const landedDay = landed ? dayOf(landed.iso) : null;

    let verdict, gap = null;
    if (!landed) verdict = 'no commits';
    else if (cookedDay == null) verdict = 'NEVER COOKED';
    else if (landedDay > cookedDay) { gap = landedDay - cookedDay; verdict = 'CODED SINCE'; }
    else verdict = 'cooked';

    console.log('  ' + name.padEnd(12)
      + (newest ? (newest.i.made + ' ' + String(newest.i.title).slice(0, 34)).padEnd(40)
                : ('-- nothing, ever (owes ' + what + ')').padEnd(40))
      + (landed ? landed.iso.slice(5, 10) : '  --  ').padEnd(13)
      + verdict + (gap ? '  by ' + gap + ' day(s)' : ''));
    if (verdict !== 'cooked' && verdict !== 'no commits') behind.push({ name, verdict, gap, what });
  }

  console.log('');
  for (const b of behind) {
    ok(b.name + ' COOKED SOMETHING SINCE IT LAST LANDED CODE', false,
      b.verdict === 'NEVER COOKED'
        ? 'it has landed work on main and has NEVER registered anything in the vote tab. '
          + 'Rule 22(a): this lane owes ' + b.what + ', every round, or the round did not '
          + 'happen. Paolo 9/21: "I need to be seeing them cooking up more, every time, '
          + 'not never."'
        : 'its newest commit on main is ' + b.gap + ' day(s) newer than the last thing it '
          + 'registered, so it has coded and checked since it last made ' + b.what + '.');
  }
  for (const [name] of MAKING) if (!behind.find(b => b.name === name)) {
    pass++; console.log('  ok   ' + name + ' has cooked at least as recently as it has coded');
  }

  console.log('\n=== COOK EVERY ROUND GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  if (fail) console.log('    ' + fail + ' making lane(s) are coding without cooking. That is the '
    + 'exact thing rule 22 exists to stop, and it is a row-level red, not a push blocker.');
  process.exit(fail ? 1 : 0);
})();
