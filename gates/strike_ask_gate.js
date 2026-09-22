/* ============================================================================
   STRIKE ASK GATE (9/22/26, QUESTS lane) -- row [strike ask],
   SOMEBODY-ON-THE-BLOCK-ASKS-YOU-TO-HOLD-THE-DOOR.

   THE ROW: "harvested from ECONOMY Q35: a strike is won by controlling who can
   take your place. When WORLD [block strikes] lands, the ask it generates is the
   picket: stand at the empty door tonight so nobody moves in. Visible change:
   the flat stays empty or it does not."

   RULE 12 SAYS A DEPENDENCY IS A PREMISE, SO IT WAS MEASURED: WORLD shipped
   engine/bohemia_strike.js on 9/21 (THE BLOCK HOLDS THE DOOR). The blocker is
   real and it has landed.

   *** AND THE CHANGE WAS NOT INVENTED. *** This lane's table of visible changes
   is HIS SIX, and refuse() rejects anything "not on his list". Two of the six
   carried proof:null, one of them `person_moves_house` with the honest note that
   NOTHING IN THE REPO MOVED A PERSON BETWEEN HOMES. WORLD's strike is exactly
   that missing system -- Glasgow 1915 was won on THE VACANCY, not on money,
   because a landlord's cut only works if he can replace you. So a change he
   already named is now real, and his list is still six long.

   WHAT THIS GATE HOLDS:
   1. HIS LIST IS STILL HIS. Six changes, no seventh, and the newly wired one is
      the one that was already there.
   2. THE PROOF IS A REAL SYMBOL IN A REAL FILE, opened and found -- never a
      confident pointer at a system that does not exist, which is the cheap way
      to fake this law.
   3. A DOOR THAT IS NOT AT STAKE PRODUCES NOTHING. An ask that changes nothing
      visible is not an ask, and a picket over an imaginary eviction is exactly
      that.
   4. IT HAS WORDS, IN A MOUTH, naming the place and closing on the generator's
      own promise.
   5. AND WHAT IS STILL MISSING IS NAMED HERE RATHER THAN FAKED: the strike
      module is in engine/ and is NOT inlined in the walked city, so no door can
      be reported on the glass yet. That is WORLD's to land; this gate states it
      as a measured fact so nobody reads this row as playable.
   ========================================================================== */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.join(__dirname, '..');
const A = require(path.join(ROOT, 'engine/bohemia_asks.js'));
const S = require(path.join(ROOT, 'engine/bohemia_ask_spoken.js'));

let pass = 0, fail = 0;
const ok = (n, c, note) => { if (c) pass++; else { fail++; console.log('  > FAIL ' + n + (note ? '  [' + note + ']' : '')); } };

/* ---- 1. HIS LIST IS STILL HIS ------------------------------------------ */
{
  const all = A.changes();
  ok('his list is still six changes long, no seventh invented (' + all.length + ')', all.length === 6);
  ok('and the picket uses one he already named', all.some(c => c.id === 'person_moves_house'));
  ok('five of the six are wired now (' + A.wired().length + ')', A.wired().length === 5);
  ok('and the one still unwired says so honestly rather than pointing at nothing',
     A.unwired().length === 1 && A.unwired()[0].proof === null && !!A.unwired()[0].unwired);
}

/* ---- 2. THE PROOF IS REAL ---------------------------------------------- */
{
  const c = A.CHANGES['person_moves_house'];
  ok('the wired change names a file and a symbol', !!c.proof && !!c.proof.file && !!c.proof.symbol);
  const p = path.join(ROOT, c.proof.file);
  ok('that file exists (' + c.proof.file + ')', fs.existsSync(p));
  const src = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
  ok('*** and the symbol is really in it, opened and found ("' + c.proof.symbol + '") ***',
     src.indexOf('function ' + c.proof.symbol) >= 0);
  ok('and that system is the strike, not something borrowed',
     /THE BLOCK HOLDS THE DOOR/.test(src));
}

/* ---- 3. A DOOR THAT IS NOT AT STAKE PRODUCES NOTHING -------------------- */
{
  const live = { doors: [{ who: 'P:1', where: '47,51', flat: '4B', cut: true, empty: true }] };
  const got = A.offer(live);
  ok('a flat whose light is cut and whose door is open raises the picket',
     !!got && got.changes === 'person_moves_house');
  ok('and it carries the place and the flat, not just a mood',
     !!got.where && !!got.about);

  const notCut = { doors: [{ who: 'P:1', where: '47,51', flat: '2A', cut: false, empty: true }] };
  ok('*** a flat nobody has cut raises NOTHING ***', A.offer(notCut) === null);
  const notEmpty = { doors: [{ who: 'P:1', where: '47,51', flat: '3C', cut: true, empty: false }] };
  ok('*** and neither does a door nobody is coming for ***', A.offer(notEmpty) === null);
  ok('an empty world still raises nothing', A.offer({}) === null && A.offer({ doors: [] }) === null);
}

/* ---- 4. IT HAS WORDS, IN A MOUTH --------------------------------------- */
{
  const got = A.offer({ doors: [{ who: 'P:1', where: '47,51', flat: '4B', cut: true, empty: true }] });
  const sp = S.spokenFor(got, { where: 'the corner flat, two doors down' });
  ok('the picket can be said out loud', !!sp && sp.says.length >= 2);
  ok('it names where to stand', sp.says.join(' ').indexOf('two doors down') >= 0);
  ok('*** and it closes on the GENERATOR\'S promise, byte for byte ***',
     sp.visible === got.visible);
  ok('refusing it is a real answer with a real line',
     sp.back.some(b => b.takes === false && b.reply && b.reply.trim()));
  ok('nobody says the word strike and nobody explains the history',
     !/strike|Glasgow|union|rent/i.test(sp.says.join(' ') + sp.back.map(b => b.reply).join(' ')));
}

/* ---- 5. WHAT IS STILL MISSING, MEASURED AND NAMED ---------------------- */
{
  const city = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
  const inlined = city.indexOf('BohemiaStrike') >= 0;
  ok('*** STATED, NOT FAKED: the strike module is NOT in the walked city, so no'
     + ' door can be reported on the glass yet (WORLD\'s to land) ***', inlined === false);
  /* WHEN THEY LAND IT THIS FLIPS, AND THAT IS THE POINT: this check is written
     to fail the day the module arrives, so whoever lands it is told, in a gate,
     that this lane's seam is now waiting on a `doors` snapshot rather than on
     them. A gate that goes red on GOOD news is the cheapest possible handoff. */
  ok('and the city has no doors in its ask snapshot either, for the same reason',
     /var snap=\{shelves:\[\],circuits:\[\],borders:\[\],talk:\[\]\}/.test(city));
}

console.log('STRIKE ASK GATE: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
