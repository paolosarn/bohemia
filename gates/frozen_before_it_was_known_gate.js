/* ============================================================================
   FROZEN BEFORE IT WAS KNOWN  (FACTIONS lane, 9/16/26)

   THE BUG THIS IS MADE OF, and it cost the game its whole war:

     The valley's travelling parties are worked out ONCE and kept under a key of
     seed + the day. A crew -- the only party that is going somewhere TO TAKE
     SOMETHING -- is sent only when the seat has somebody at blood, and that answer
     needs the between module. Built one beat before that module could answer,
     every seat at blood fell through to a caravan and the harmless valley was
     frozen in until the next sunrise.

         the list the game was holding   14 patrol, 14 caravan,  0 crew
         the same function, rebuilt      14 patrol, 10 caravan,  4 crew

     Same seats, same day, same module, one frame apart. The graph carried four
     hostile pairs the whole time. THE KEY COULD NOT TELL A REAL "NO" FROM AN
     UNANSWERED QUESTION, so every number about the valley was correct and the
     valley was wrong.

   THE TEST NEEDS NO THEORY AND NO LIST OF DEPENDENCIES. Drop the cache, let the
   GAME'S OWN function fill it again, and see whether the answer changes. If a
   thing the game is holding is not what the game would work out right now, it was
   frozen too early. That is the whole check.

   WHAT IT DOES NOT CLAIM: that caching is wrong, or that every cache must rebuild
   identically forever. These are answers that are meant to be steady inside one
   day -- who holds what, who is seated, who is out there, where home is. A cache
   whose answer is MEANT to move belongs on a different check, and putting one here
   would make this gate lie the first time somebody built it.

   node gates/frozen_before_it_was_known_gate.js
   ========================================================================== */
'use strict';
const D = require('../tools/bohemia_drive_the_demo.js');

let pass = 0, fail = 0;
function ok(what, cond, note) {
  if (cond) { pass++; console.log('  ok   ' + what + (note ? '   ' + note : '')); }
  else { fail++; console.log('  FAIL ' + what + (note ? '   ' + note : '')); }
}

(async () => {
  let d = null;
  try {
    d = await D.open();

    const rows = await d.fr.evaluate(() => {
      /* [what it is called, its key, the game's own filler, a short reading] */
      const CACHES = [
        ['TURF_SEATS', 'TURF_KEY',     'who is seated',
          () => turfSeats(), v => v ? v.length + ' seats' : String(v)],
        ['TURF_MAP',   'TURF_MAP_KEY', 'who holds what',
          () => turfGrid(),  v => v ? ('n=' + v.n + ' own=' + !!v.own) : String(v)],
        ['PARTIES',    'PARTIES_KEY',  'who is out there, and on what business',
          () => partiesAll(),
          v => { if (!v) return String(v); const t = {};
                 for (const p of v) t[p.agenda] = (t[p.agenda] | 0) + 1;
                 return JSON.stringify(t); }],
        ['MINES_MAP',  'MINES_KEY',    'what the ground makes',
          () => (typeof minesGrid === 'function' ? minesGrid() : null),
          v => v ? (Object.keys(v).length + ' keys') : String(v)],
        ['PPL_MAP',    'PPL_MAP_KEY',  'where the people are',
          () => (typeof pplGrid === 'function' ? pplGrid() : null),
          v => v ? (Object.keys(v).length + ' keys') : String(v)]
      ];
      const out = [];
      for (const [cv, kv, what, call, show] of CACHES) {
        const row = { cache: cv, what: what };
        let held = null, again = null;
        try { held = call(); }
        catch (e) { row.err = 'the game could not answer: ' + String(e.message).slice(0, 50);
                    out.push(row); continue; }
        row.held = show(held);
        try { eval(cv + ' = null; ' + kv + ' = null;'); }
        catch (e) { row.err = 'could not drop the cache'; out.push(row); continue; }
        try { again = call(); }
        catch (e) { row.err = 'rebuild threw: ' + String(e.message).slice(0, 50);
                    out.push(row); continue; }
        row.rebuilt = show(again);
        out.push(row);
      }
      return out;
    });

    /* A FLOOR BEFORE ANY COMPARISON. Two empty strings match perfectly, and this
       lane has shipped a claim that passed on an empty set before. */
    const answered = rows.filter(r => !r.err && r.held && r.held !== 'null');
    ok('the game answers at all for the things it keeps (' + answered.length
      + ' of ' + rows.length + ' caches gave a real reading)',
      answered.length >= 4, JSON.stringify(rows.map(r => r.cache + '=' + (r.held || r.err))));

    for (const r of rows) {
      if (r.err) { ok('" ' + r.what + ' " could be read and rebuilt', false, r.err); continue; }
      ok('*** ' + r.what.toUpperCase() + ' IS WHAT THE GAME WOULD WORK OUT RIGHT NOW *** '
        + '-- dropped and rebuilt by the game\'s own function, the answer is the same, '
        + 'so it was not settled before it could be known',
        r.held === r.rebuilt,
        r.held === r.rebuilt ? String(r.held)
          : ('HELD ' + r.held + '   BUT REBUILDS AS ' + r.rebuilt
             + '   <- the game is holding an answer it would not give now'));
    }

    /* AND THE ONE THAT ACTUALLY HAPPENED, NAMED, so a rebuild that quietly stops
       producing crews reads as the bug it is rather than as a quiet world. */
    const parties = rows.filter(r => r.cache === 'PARTIES')[0];
    ok('AND SOMEBODY IS COMING FOR SOMEBODY: the party list the game is holding '
      + 'really contains crews, which is the exact thing that was missing for rounds '
      + 'while every number about the valley was correct',
      !!parties && /"crew":[1-9]/.test(String(parties.held)),
      parties ? String(parties.held) : 'no party row');

    ok('and the page threw nothing while being asked', d.errs.length === 0,
      d.errs.slice(0, 3).join(' | '));
  } catch (e) {
    fail++; console.log('  FAIL the valley could not be driven   ' + String(e.message).slice(0, 160));
  } finally { if (d) { try { await d.close(); } catch (_e) {} } }

  console.log('\n' + (fail ? 'FROZEN BEFORE IT WAS KNOWN: ' + fail + ' FAILED, ' + pass + ' ok'
    : 'FROZEN BEFORE IT WAS KNOWN: ' + pass + ' ok, 0 failed'));
  /* flush before exiting: process.exit() can drop buffered stdout when a caller
     redirects this to a file, which cost this lane four confusing runs. */
  process.stdout.write('', () => process.exit(fail ? 1 : 0));
})();
