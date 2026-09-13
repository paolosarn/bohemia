/* ============================================================================
   BOHEMIA THE LIFT MOVES HIM (9/13/26, PEOPLE lane).

   PAOLO 9/13, walking the demo's first five minutes on a phone:
     "it says a car is gonna pull up on me and then nothing happens."
   THE FIVE MINUTES rule 14(d): a card that promises something and does nothing
   is the worst bug in the game, because it teaches him nothing here is real.
   Deliver it or remove it.

   *** MEASURED ON THE REAL DEMO, ON FOOT, AND IT IS HIS SENTENCE EXACTLY. ***
   The ghost robotaxi card fired on the walked street. It said an empty cab pulls
   to the curb. It offered GET IN -- A LIFT. He pressed it and the card answered
   "The door shuts. It drives the loop it has always driven, and it is not your
   loop." AND HE DID NOT MOVE ONE CELL: hx,hy unchanged, city.x,y unchanged. He
   got in a car, was told it drove off, and stood exactly where he was.

   THE CAUSE: roadChoose's ride only ever moved city.x,y. That is the right
   position in CITY mode and the wrong one on foot -- and the road card has fired
   on foot since __ROAD_INTERRUPTS_ON_FOOT__, which is the whole demo. So the
   lift was a no-op on the surface where it mostly happens, and the card narrated
   a drive that never took place.

   NO NEW NUMBER WAS INVENTED. The table already says how far: two of the map's
   own tiles. On foot a map tile is FN walked cells, FN being the game's own
   constant, so the same ride is the same distance on either surface. The cost is
   the design's and is unchanged: the heading is the CAB'S, so it is two tiles in
   a direction he did not choose, paid back in the walk.

   WHAT THIS HOLDS:
   A. the cab still offers the lift on the walked street
   B. *** PRESSING IT MOVES HIM, ON FOOT, ON THE REAL DEMO ***
   C. the distance is DERIVED from the table and FN, not typed here
   D. it still obeys the map: the cab stops the moment the road does
   E. *** AND WHEN THE ROAD DOES NOT GO FROM HERE IT SAYS SO ***, instead of
      narrating a drive that did not happen -- which is the same bug in words
   F. city mode is untouched and still moves the city cursor

   node gates/the_lift_moves_him_gate.js
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const DRIVE = path.join(ROOT, 'tools/bohemia_drive_the_demo.js');

let pass = 0; const fail = []; const notes = [];
function ok(claim, cond, note) {
  if (cond) { pass++; console.log('  ok   ' + claim + (note ? '   ' + note : '')); }
  else { fail.push(claim); console.log('  FAIL ' + claim + (note ? '   ' + note : '')); }
}
function probe(claim, cond) {
  if (cond) { pass++; console.log('  ok   [self-test] ' + claim); }
  else { fail.push('[self-test] ' + claim); console.log('  FAIL [self-test] ' + claim); }
}
function head(t) { console.log('\n' + t); }
function stripComments(s) {
  return s.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ');
}

(async () => {
  head('A. HIS WORDS, AND THE RULE THEY BECAME');
  const lawPath = path.join(ROOT, 'laws/BOHEMIA_ADDENDUM_THE_FIVE_MINUTES_9_13_26.md');
  ok('the five-minute law exists', fs.existsSync(lawPath));
  const law = fs.existsSync(lawPath) ? fs.readFileSync(lawPath, 'utf8') : '';
  ok('and the car sentence is in it verbatim, so this is his complaint and not a paraphrase',
    /a car is gonna pull up on me and then nothing happens/.test(law.replace(/\n\s*/g, ' ')));

  head('B. THE DISTANCE IS DERIVED, NOT TYPED');
  const cityRaw = fs.readFileSync(CITY, 'utf8');
  const city = stripComments(cityRaw);
  ok('the on-foot ride reads the table\'s own ride value and the game\'s own FN, so nobody picked a new number for it',
    /\(o\.ride\|0\)\s*\*\s*FN/.test(city));
  ok('and FN is the map\'s constant rather than something this feature declared',
    /const FN\s*=\s*OM\.TILE_FINE/.test(cityRaw));
  ok('the cab still has exactly one heading rule, its own, so he does not choose the direction',
    /var cd = \(\(ev\.seq\|0\) \* 2 \+ 1\) % 8;/.test(cityRaw));
  probe('the derived-distance claim rejects a hardcoded walked distance',
    !/\(o\.ride\|0\)\s*\*\s*FN/.test('var want = 256;'));

  head('C. AND IT IS TRUE ON THE DEMO HE PLAYS');
  /* THIS IS THE ONLY PART THAT COUNTS. Everything above reads the file. This
     boots the demo on a phone profile, clears the card at the door the way a
     player does, and drives the real chooser -- through the LIFE+CITY lane's own
     driver, because they already paid for the four traps between a script and
     the glass and a second one of those is how two answers to one question
     start. */
  let R = null, driveErr = null;
  try {
    const D = require(DRIVE);
    const d = await D.open();
    R = await d.fr.evaluate(() => {
      const out = { mode: (typeof MODE !== 'undefined') ? MODE : null, headings: [] };
      /* D1. the card really offers the lift on the walked street */
      try {
        roadCard({ id: 'ghost_robotaxi', name: 'ghost robotaxi', seq: 3,
                   at: { district: 'suburb', phase: 'day' } }, 0, 1);
      } catch (e) { out.cardThrew = String(e).slice(0, 90); }
      out.cardText = (document.getElementById('daycardIn') || { innerText: '' })
        .innerText.replace(/\s+/g, ' ').slice(0, 260);
      out.rows = [...document.querySelectorAll('[data-act^="ch:"]')]
        .map(e => e.getAttribute('data-act'));
      /* D2. press it the way a thumb does, and watch the WALKED position */
      const b = { hx: hx, hy: hy, cx: city.x, cy: city.y };
      const el = [...document.querySelectorAll('[data-act="ch:ride"]')][0];
      out.getInExists = !!el;
      if (el) el.click();
      out.movedOnFoot = (hx !== b.hx || hy !== b.hy);
      out.cellsMoved = Math.abs(hx - b.hx) + Math.abs(hy - b.hy);
      out.cardAfter = (document.getElementById('daycardIn') || { innerText: '' })
        .innerText.replace(/\s+/g, ' ').slice(-170);
      /* D3. EVERY heading, so this is not one lucky direction */
      for (const seq of [0, 1, 2, 3, 4, 5, 6, 7]) {
        const s = { hx: hx, hy: hy };
        let r = null;
        try { r = roadChoose({ id: 'ghost_robotaxi', seq: seq, at: {} }, 'ride'); } catch (e) { }
        out.headings.push({ seq, rode: r ? r.rode : null, cells: r ? r.cells : null,
          moved: (hx !== s.hx || hy !== s.hy), say: r ? String(r.say).slice(0, 40) : null });
      }
      /* D4. A RIDE THAT CANNOT START, stood where the road does not go */
      const save = { hx: hx, hy: hy };
      try {
        hx = 1; hy = 1;
        const r = roadChoose({ id: 'ghost_robotaxi', seq: 3, at: {} }, 'ride');
        out.blocked = { rode: r.rode, cells: r.cells, moved: (hx !== 1 || hy !== 1), say: r.say };
      } catch (e) { out.blockedThrew = String(e).slice(0, 80); }
      hx = save.hx; hy = save.hy;
      /* D5. CITY MODE UNTOUCHED */
      try {
        const cb = { x: city.x, y: city.y }, was = MODE; MODE = 'city';
        const r = roadChoose({ id: 'ghost_robotaxi', seq: 1, at: {} }, 'ride');
        out.cityMode = { rode: r.rode, movedCity: (city.x !== cb.x || city.y !== cb.y) };
        MODE = was;
      } catch (e) { out.cityThrew = String(e).slice(0, 80); }
      return out;
    });
    R.pageErrors = d.errs.length;
    await d.close();
  } catch (e) { driveErr = String(e).slice(0, 150); }

  ok('the demo booted and the walked street answered, so nothing below is passing over a page that never loaded',
    !!R, driveErr || 'ok');
  if (R) {
    ok('the player is ON FOOT, which is the whole of his first five minutes',
      R.mode === 'human', String(R.mode));
    ok('the cab card fires on the walked street and offers the lift',
      R.getInExists && R.rows.indexOf('ch:ride') >= 0, JSON.stringify(R.rows));
    ok('*** PRESSING GET IN MOVES HIM. *** This is the row: he pressed it, the card told him the door shut and the cab drove, and he stood exactly where he was',
      R.movedOnFoot === true, `walked cells moved ${R.cellsMoved}`);
    ok('...and the card tells him what the lift bought, in cells he understands',
      /cells of road for nothing/.test(R.cardAfter), R.cardAfter.slice(-80));
    ok('and nothing threw while he did it', R.pageErrors === 0, 'page errors ' + R.pageErrors);
    const movers = R.headings.filter(h => h.moved).length;
    const still = R.headings.filter(h => !h.moved);
    ok('it is not one lucky direction: the cab moves him on the headings where there is road',
      movers > 0, `${movers} of 8 headings moved him`);
    ok('...and on the headings with no road it moves him NOTHING and reports zero, rather than half a ride',
      still.every(h => h.rode === 0 && h.cells === 0));
    notes.push('headings: ' + R.headings.map(h => `${h.seq}:${h.cells}`).join(' '));

    head('D. AND WHEN THE ROAD DOES NOT GO FROM HERE, THE CARD SAYS SO');
    /* THE SAME BUG IN WORDS. The old body printed "The door shuts. It drives the
       loop it has always driven" whether or not anything moved -- so even after
       the movement was fixed, a cab that cannot start would still have narrated
       a drive at him. */
    ok('the blocked case was measured', !!R.blocked, R.blockedThrew || 'ok');
    if (R.blocked) {
      ok('a cab that cannot start moves him nowhere',
        R.blocked.rode === 0 && R.blocked.moved === false);
      ok('*** AND IT DOES NOT NARRATE A DRIVE THAT DID NOT HAPPEN ***',
        !/It drives the loop/.test(R.blocked.say)
          && /does not go from here/.test(R.blocked.say), R.blocked.say);
      probe('this claim rejects the old line, which told him it drove off regardless',
        /It drives the loop/.test('The door shuts. It drives the loop it has always driven'));
    }

    head('E. CITY MODE IS UNTOUCHED');
    ok('the ride still moves the CITY cursor in city mode, exactly as it always did -- this fixed the surface that was missing, it did not move the one that worked',
      !!R.cityMode && R.cityMode.movedCity === true && R.cityMode.rode > 0,
      JSON.stringify(R.cityMode));
  }

  head('NOTES');
  notes.forEach(n => console.log('  NOTE  ' + n));
  console.log(`\n=== THE LIFT MOVES HIM: ${pass} pass / ${fail.length} fail ===`);
  if (fail.length) { fail.forEach(f => console.log('  FAILED: ' + f)); process.exit(1); }
})().catch(e => { console.log('GATE THREW: ' + e); process.exit(1); });
