/* ============================================================================
   THE PLACEHOLDER NUMBER GATE (8/15/26)

   laws/BOHEMIA_ADDENDUM_EVERYTHING_COSTS_ONE_8_15_26.md, Paolo, LOCKED:

       "Anything that could cost a resource, we can't be tied up in this. Just
        make everything cost one. Just start off with one and then I'll move
        from there... you would have to play until the end of the game to be
        like OK this is how much I should have, this is how much this shit
        costs, to be very frank."

   Its section 5 asks for this gate BY NAME, and says who writes it:

       (b) a gate enumerates every economic value in the build and asserts that
           each is EITHER tagged placeholder OR carries a recorded ruling from
           him -- so a hand-typed 7 with no ruling behind it goes RED.
       WITHOUT (b) THIS LAW ROTS INTO THE EXACT DISEASE IT WAS MEANT TO PREVENT:
       an untagged number nobody re-opens.
       [section 7] Whoever ships first writes the placeholder gate.

   WHY THE LAW IS RIGHT ABOUT THE DANGER, in his own reasoning: a
   plausible-looking number LOOKS TUNED. It slips past every future reader, gets
   built on, and becomes canon by inertia, because nobody re-opens a value that
   looks deliberate. A 1 announces itself as a placeholder from across the room.
   The failure this gate exists to catch is therefore NOT a wrong number -- it is
   a number wearing no label.

   IT CONSTRAINS THE PROPERTY, NOT THE SHAPE, AND THAT IS DELIBERATE. WORLD owns
   these three tables (section 7) and has not filled them yet. A gate that
   demanded one exact literal form would be this lane designing another lane's
   data on the way past. So an entry passes if it is tagged in ANY of the ways a
   reasonable hand would tag it, and fails only when a number is present with no
   label and no recorded ruling -- which is precisely the case the law names.

   THE TABLES ARE STILL EMPTY TODAY and this gate therefore has little to chew
   on. That is the point of writing it FIRST: it is standing before the numbers
   arrive, so the first hand to fill them cannot land an untagged one.
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const PURSE = require(path.join(ROOT, 'engine/bohemia_purse.js'));
const LAW = path.join(ROOT, 'laws/BOHEMIA_ADDENDUM_EVERYTHING_COSTS_ONE_8_15_26.md');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };

/* the three tables the law names, by the names the law uses */
const TABLES = ['PAYOUT', 'PRICES', 'PRODUCTION'];

/* A value is TAGGED if anything about it says "placeholder" out loud. Any of
   these count, because the law asked for a label and did not specify a spelling:
     {v:1, placeholder:true}      {amount:1, placeholder:true}
     {resources:1, placeholder:true}
   A bare number, or an object with no marker anywhere in it, is UNTAGGED. */
function tagged(v) {
  if (v == null) return false;
  if (typeof v !== 'object') return false;               // a bare 1 wears no label
  if (v.placeholder === true || v.isPlaceholder === true) return true;
  if (typeof v.ruling === 'string' && v.ruling.trim() !== '') return true;   // a recorded ruling
  if (typeof v.tuned === 'boolean') return true;
  return false;
}
function numbersIn(v) {
  if (typeof v === 'number') return [v];
  if (!v || typeof v !== 'object') return [];
  let out = [];
  for (const k in v) if (typeof v[k] === 'number') out.push(v[k]);
  return out;
}

/* ---- 1. the law is in the repo and says what this gate thinks it says ---- */
ok('the EVERYTHING COSTS ONE law is in the repo', fs.existsSync(LAW));
if (fs.existsSync(LAW)) {
  const t = fs.readFileSync(LAW, 'utf8');
  ok('and it is the one that asks for this gate (section 5b)',
     /tagged placeholder OR carries a recorded ruling/i.test(t));
  ok('and it does NOT touch damage, which is its own standing law',
     /NO DAMAGE BEFORE THE DIAL/i.test(t));
}

/* ---- 2. EVERY ECONOMIC VALUE IS LABELLED -------------------------------- */
const untagged = [];
let counted = 0;
for (const name of TABLES) {
  const T = PURSE[name];
  ok('the ' + name + ' table exists to be checked', !!T && typeof T === 'object');
  if (!T) continue;
  for (const key of Object.keys(T)) {
    counted++;
    if (!tagged(T[key])) untagged.push(name + '.' + key + ' = ' + JSON.stringify(T[key]));
  }
}
ok('EVERY ECONOMIC VALUE IN THE BUILD IS EITHER TAGGED A PLACEHOLDER OR CARRIES A '
   + 'RULING -- a hand-typed number with nothing behind it goes red here ('
   + counted + ' values, ' + untagged.length + ' untagged'
   + (untagged.length ? ': ' + untagged.slice(0, 4).join(', ') : '') + ')',
   untagged.length === 0);

/* MUTATION-TESTED IN PLACE, because a gate that has nothing to check is a gate
   that has never been shown to catch anything. Plant an untagged number, prove
   it goes red, put the table back exactly as it was found. */
{
  const T = PURSE.PAYOUT, had = Object.prototype.hasOwnProperty.call(T, '__mut');
  T.__mut = { resources: 7 };                        // a plausible-looking 7, no label
  const caught = !tagged(T.__mut);
  if (!had) delete T.__mut;
  ok('and it really catches one: a bare {resources:7} with no label is rejected', caught);
  ok('(the table is left exactly as it was found)',
     !Object.prototype.hasOwnProperty.call(PURSE.PAYOUT, '__mut'));
  const tag = { resources: 1, placeholder: true };
  ok('while a tagged one is accepted', tagged(tag));
}

/* ---- 3. ONE IS NOT FREE, AND THE REFUSAL PATH SURVIVES (section 4) ------ */
{
  const src = fs.readFileSync(path.join(ROOT, 'engine/bohemia_purse.js'), 'utf8');
  ok('the honest refusal for an uncovered key is still in the ledger -- "the '
     + 'mechanism stays, the tables simply are not empty any more"',
     /reason:\s*NO_RULING/.test(src));
  const p = PURSE.create();
  const r = PURSE.spend ? PURSE.spend(p, '__nothing_ruled_about_this__', 1) : null;
  ok('and an uncovered key really is refused rather than guessed at',
     !r || r.applied === false);
}
{
  /* NO DAMAGE BEFORE THE DIAL is untouched by this law, and stays untouched. */
  /* STAKES lives on a MADE day loop, not on the module -- the first cut of this
     read DL.STAKES, got undefined, and reported "not empty" about a table that
     is empty. An assertion against a symbol that does not exist is not a check,
     it is a coin flip that happened to land on red. */
  const DL = require(path.join(ROOT, 'engine/bohemia_dayloop.js'));
  const L = DL.make();
  ok('NO DAMAGE BEFORE THE DIAL: the day loop STAKES table is still empty',
     Array.isArray(L.STAKES) && L.STAKES.length === 0);
}

/* ---- 4. THE TUNING LIST IS GENERATED, NOT REMEMBERED (section 5c) ------- */
{
  const rows = [];
  for (const name of TABLES) {
    const T = PURSE[name] || {};
    for (const key of Object.keys(T))
      for (const n of numbersIn(T[key]))
        rows.push({ table: name, key: key, value: n, tagged: tagged(T[key]) });
  }
  const out = {
    law: 'laws/BOHEMIA_ADDENDUM_EVERYTHING_COSTS_ONE_8_15_26.md',
    note: 'EVERY NUMBER IN THE GAME\'S ECONOMY, generated by gates/placeholder_number_gate.js. '
        + 'Paolo tunes from this list after a full playthrough; it is never hand-maintained.',
    total: rows.length, rows: rows
  };
  const dest = path.join(ROOT, 'records/BOHEMIA_TUNING_LIST.json');
  fs.writeFileSync(dest, JSON.stringify(out, null, 1) + '\n');
  ok('the tuning list is GENERATED into records/BOHEMIA_TUNING_LIST.json ('
     + rows.length + ' numbers)', fs.existsSync(dest));
  if (rows.length === 0)
    console.log('    the three tables are still EMPTY -- WORLD owns filling them with '
              + 'tagged ones (law section 7). This gate is standing before they arrive, '
              + 'so the first hand to fill them cannot land an untagged number.');
}

console.log('PLACEHOLDER NUMBER GATE: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
