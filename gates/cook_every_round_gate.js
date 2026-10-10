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

/* A LANE THE BOARD HAS STOPPED IS NOT OWED A COOK (PLUMBER 10/10, with [the picture leg]). Rule 88 (Paolo 10/10,
   'prioritize how it looks') put SOUNDS, WORDS, PEOPLE, FACTIONS, WORLD, LIFE+CITY, ANIMATION and others on HOLD:
   "no round, no VOTE sheet". QUESTS, TUNING and MODS "write pages and register no sheets". A gate that still read
   them as owing a sheet would be demanding the thing the board forbids. So the board's own MODE line decides: a
   lane whose MODE says HOLD, PAUSED or PARKED, or pages without sheets, or RESEARCH ONLY, is reported and not held. */
function stoppedLanes() {
  const out = {}; let txt = '';
  try { txt = fs.readFileSync(path.join(ROOT, 'VAMILY.md'), 'utf8'); } catch (e) { return out; }
  const L = txt.split('\n');
  for (let i = 0; i < L.length; i++) {
    if (!L[i].startsWith('## ')) continue;
    const key = L[i].slice(3).split('  (')[0].replace(/[^A-Z]/gi, '').toUpperCase();
    const mode = (L[i + 1] || '').startsWith('MODE:') ? L[i + 1] : '';
    if (/^MODE:\s*(HOLD|PAUSED|PARKED)\b/i.test(mode) || /RESEARCH ONLY|PAGES WITHOUT SHEETS/i.test(mode)) out[key] = mode.slice(0, 60);
  }
  return out;
}
const STOPPED = stoppedLanes();

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
    if (STOPPED[name.replace(/[^A-Z]/gi, '').toUpperCase()]) {
      console.log('  ' + name.padEnd(12) + 'not held: the board stops it (' + STOPPED[name.replace(/[^A-Z]/gi, '').toUpperCase()].replace(/\s+/g, ' ') + '...)');
      continue; }
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
  for (const [name] of MAKING) if (!behind.find(b => b.name === name) && !STOPPED[name.replace(/[^A-Z]/gi, '').toUpperCase()]) {
    pass++; console.log('  ok   ' + name + ' has cooked at least as recently as it has coded');
  }

  /* ---- WHAT HE CANNOT SEE DID NOT SHIP (PLUMBER 10/10, row [the picture leg]; rule 89) ----------------
     PAOLO 10/10, on the fight's ground drawn at its own pixels, measured sharper and voted NO: "Can't tell
     difference. Looks like dogshit." Rule 89: a look item is shown as a before and an after of the SAME
     thing, side by side in one picture, at one art pixel to one phone pixel; a number is the proof line,
     never the show; "PLUMBER's cook gate grows a leg: a look item without a before-and-after picture is
     refused." The row says it, so it is the words a lane reads: "no before-and-after picture".
     A LOOK ITEM: a tile, face, haircut, outfit or animation, or a UI screen, from a lane on the look
     program (rule 88: COOK and its numbered twins, COMBAT TWO, UI, CHARACTER, PORTRAIT), and a tile, face,
     haircut, outfit or animation from COMBAT, RUN or EYES. A verdict, a line and a sound are not looks; the
     kind alone cannot say it (TUNING files its number tables as "tile"), so the lane and the kind together.
     THE PROOF IT CARRIES: show.how is ONE picture (image, or a clip for motion) that is on disk, and
       before_after: { before: "<what one half shows>", after: "<what the other shows>", scale: "1:1" }.
     Held from the rule's day (made 10/10 on). Grandfather nothing that counts: his three NOs of this round
     are replayed from the registry as the first three tests, and each must be refused. */
  const LOOK_LANE = /^(cook( ?(2|3|4|two|three|four))?|combat ?(2|two)|ui|character|portrait)$/i;
  const ALSO_ART = /^(combat|run|eyes)$/i;
  const ART = ['tile', 'face', 'haircut', 'outfit', 'animation'];
  const isLook = it => { if (!it) return false; const l = String(it.lane || '').trim(), k = it.kind;
    if (k === 'verdict' || k === 'line' || k === 'sound') return false;
    return (LOOK_LANE.test(l) && (ART.includes(k) || k === 'ui')) || (ALSO_ART.test(l) && ART.includes(k)); };
  const pictureWhy = it => {
    const sh = it.show || {}, ba = it.before_after;
    if (!/^(image|clip)$/.test(sh.how || '')) return 'no before-and-after picture (it shows ' + (sh.how ? 'a ' + sh.how : 'nothing') + ', not one picture)';
    if (!ba || typeof ba !== 'object' || !String(ba.before || '').trim() || !String(ba.after || '').trim()) return 'no before-and-after picture';
    if (String(ba.scale || '').replace(/\s/g, '') !== '1:1') return 'no before-and-after picture at one to one (scale ' + (ba.scale || 'unsaid') + ')';
    if (!fs.existsSync(path.join(ROOT, 'slices', sh.src || '')) && !fs.existsSync(path.join(ROOT, sh.src || ''))) return 'no before-and-after picture (' + sh.src + ' is not on disk)';
    return null; };
  const madeOn = it => { const m = /^(\d+)\/(\d+)/.exec(String(it.made || '')); return m ? (+m[1]) * 100 + (+m[2]) : 0; };
  { /* the three NOs of this round, from the registry as they were voted, and the row's pair */
    const NOS = ['ui-the-phone-turns-10-10', 'character-the-three-bodies-10-10', 'combat-the-art-at-its-own-pixels-10-10'];
    const found = NOS.map(id => items.find(i => i.id === id)).filter(Boolean);
    const refused = found.filter(it => isLook(it) && pictureWhy(it));
    ok('his three NOs of this round (' + NOS.join(', ') + ') are each refused as "no before-and-after picture"',
       found.length === 3 && refused.length === 3, found.length + ' found in the registry, ' + refused.length + ' refused');
    const any = fs.readdirSync(path.join(ROOT, 'slices/vote')).find(f => /\.(png|jpe?g|webp)$/i.test(f));
    const numberOnly = { id: 't1', lane: 'combat 2', kind: 'tile', made: '10/10', show: { how: 'text', src: 'edge density 0.038 against 0.002' } };
    const sideBySide = Object.assign({}, numberOnly, { show: { how: 'image', src: 'vote/' + any },
      before_after: { before: 'the freeway tile as shipped, one art pixel to one phone pixel', after: 'the same tile sharpened, the same crop', scale: '1:1' } });
    const halfSaid = Object.assign({}, sideBySide, { before_after: { after: 'only the after' } });
    const notALook = { id: 't4', lane: 'tuning', kind: 'tile', made: '10/10', show: { how: 'page', src: 'x.html' } };
    ok('the pair the row asks for: a sharpened tile shown by its number alone is refused, the same tile with its two crops side by side passes; only the after is refused; a TUNING table is not a look',
       !!pictureWhy(numberOnly) && pictureWhy(sideBySide) === null && !!pictureWhy(halfSaid) && !isLook(notALook) && isLook(numberOnly),
       JSON.stringify([pictureWhy(numberOnly), pictureWhy(sideBySide), pictureWhy(halfSaid), isLook(notALook)])); }
  { const judged = new Set(verdicts.map(v => v && v.id));
    const now = [], older = [];
    for (const it of items) { if (!it || !it.id || judged.has(it.id) || !isLook(it)) continue;
      const w = pictureWhy(it); if (!w) continue;
      (madeOn(it) >= 1010 ? now : older).push(it.id + ' (' + w + ')'); }
    ok('every look item waiting in VOTE since rule 89 carries its before-and-after picture (' + now.length + ' without)', !now.length,
       now.slice(0, 8).join('\n         ') + '\n         rule 89: one picture, the same thing before and after at 1:1, and before_after: { before, after, scale: "1:1" } on the row; a number is the proof line, never the show.');
    if (older.length) console.log('  note: ' + older.length + ' look items from before rule 89 are still waiting without one; DIRECTION\'s pass decides which come back (rules 82, 88, 89)'); }

  console.log('\n=== COOK EVERY ROUND GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  if (fail) console.log('    ' + fail + ' making lane(s) are coding without cooking. That is the '
    + 'exact thing rule 22 exists to stop, and it is a row-level red, not a push blocker.');
  process.exit(fail ? 1 : 0);
})();
