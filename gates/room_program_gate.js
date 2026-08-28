/* ============================================================================
   ROOM PROGRAM GATE (8/28/26, CITY lane)

   FIFTY-THREE PERCENT OF EVERY ROOM IN THE VALLEY WAS A BATHROOM.

   Interiors are real: you walk in, no loading screen, and the floorplan splits
   the plate into rooms and names each one by RANK -- distance from the street
   door, public first, private last. One line did the naming:

       const role = Z.roles[Math.min(rank, Z.roles.length - 1)];

   `Math.min` CLAMPS. Every room past the end of the list takes the LAST role, and
   in seven of the nine zones the last role is `bath`, because the list runs
   public-to-private and a toilet is the most private thing on it. So every
   building with more rooms than its zone had names filled up with toilets.

   MEASURED ACROSS 277 BUILDINGS FROM THE REAL GENERATORS, BEFORE THE FIX:
   1213 of 2287 rooms were bathrooms -- 53.0%.

       the convention centre   50 bathrooms of 54 rooms
       the library             50 of 54
       the chapel              49 of 53   (a chapel that is 92% toilet)
       city hall               48 of 52
       the courthouse          48 of 52
       the school              43 of 47

   You walked into the library and found fifty lavatories. AFTER: 93 of 2287,
   4.1%, and every one of those big buildings has exactly one.

   THE FIX WAS NOT A CAP ON BATHROOMS. It was naming the room a bigger building
   actually gets more of -- `bulk` -- which is a different question, and the one
   the clamp was silently answering wrong. A bigger house has more BEDROOMS, a
   bigger shop is more SALES FLOOR, a bigger hospital is more WARDS, a bigger
   warehouse is more OPEN FLOOR.

   AND THE 4.1% IS NOT A NUMBER I LIKED THE LOOK OF. Restrooms are CORE space, in
   the same bracket as stairs, risers and plant; net-to-gross in real buildings
   runs 60-80%, so the core is 20-40% of the plan and restrooms are a slice of
   THAT, never half of it. Occupant load is 100-150 sq ft per person in an office
   and 500 in a warehouse -- a warehouse holds a fifth of the people and needs a
   fifth of the fixtures, while the clamp was giving a 60x31 pump station EIGHT.

   WHAT THIS GATE HOLDS. Not the exact percentage -- that moves whenever a lane
   adds a district, and a gate that reds on somebody else's honest work is a gate
   that gets ignored. It holds the SHAPE: no zone may fill a big building with its
   private-most room, every zone declares what it scales with, and the bulk role
   is one the zone already assigns (a new name would need a floor mapping in
   another lane's file, and adding one silently is how the floors broke on 8/27).
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const FP = require(path.join(ROOT, 'engine', 'bohemia_floorplan.js'));
const K = require(path.join(ROOT, 'engine', 'bohemia_district_kit.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

console.log('='.repeat(74));
console.log('ROOM PROGRAM GATE — a bigger building is more of what it is FOR,');
console.log('                    not more toilets. 53% of the valley was bathrooms.');
console.log('='.repeat(74));

const ZONES = FP.ZONES;
ok('A1 the zone table is readable (' + Object.keys(ZONES).length + ' zones)', Object.keys(ZONES).length >= 5);

/* EVERY ZONE SAYS WHAT IT SCALES WITH. Without this the code falls back to the last role,
   which is exactly the clamp that caused the flood. */
const noBulk = Object.keys(ZONES).filter(z => !ZONES[z].bulk);
ok('A2 every zone declares what a BIGGER building of that kind has more of'
   + (noBulk.length ? ' -> ' + noBulk.join(', ') + ' would fall back to their last role, '
      + 'which is the clamp that made 53% of the valley bathrooms' : ''),
   noBulk.length === 0);

/* AND IT IS NEVER THE PRIVATE-MOST ROOM. This is the defect stated directly. */
const privy = /^(bath|restroom|wc|toilet)$/;
const badBulk = Object.keys(ZONES).filter(z => privy.test(ZONES[z].bulk || ''));
ok('A3 and NO ZONE SCALES WITH ITS BATHROOM'
   + (badBulk.length ? ' -> ' + badBulk.join(', ') : ''), badBulk.length === 0);

/* A NEW ROLE NAME IS ANOTHER LANE'S PROBLEM. The floor pool maps role -> material; an
   unmapped role falls to a declared default, and inventing names here quietly changes what
   the ART lane has to carry. Every bulk role must already be one this zone assigns. */
const invented = Object.keys(ZONES)
  .filter(z => ZONES[z].bulk && ZONES[z].roles.indexOf(ZONES[z].bulk) < 0)
  .map(z => z + ':' + ZONES[z].bulk);
ok('A4 and every bulk role is one the zone ALREADY assigns, so no new role name reaches the '
   + 'floor map in another lane\'s file'
   + (invented.length ? ' -> ' + invented.join(', ') : ''), invented.length === 0);

/* AND EVERY ROLE A ZONE ASSIGNS IS ONE THE FLOOR POOL CAN DRESS (8/28).
   A4 above stops a BULK role being a new name; this is the wider version, and it is the rule
   that made the `institutional` split possible at all. The ART lane's floor pool maps role ->
   material. Measured today: it carries 36 names while the floorplan was assigning only 25 --
   `garage`, `study`, `exam`, `plant`, `corridor`, `dining` and five more were already there,
   unused. That headroom is why a school could be given classrooms and a fire station
   apparatus bays without reaching into another lane's file at all (REUSE-FIRST: check the
   approved bank before cooking anything new).
   A role with no mapping does not crash -- it falls to the default floor -- which is exactly
   why it needs a gate: the failure is a room quietly wearing lino because nobody noticed. If
   this goes red, the answer is either to use a name the pool already has, or to ASK the lane
   that owns the pool; it is not to add one and hope. */
const FLOORS = path.join(ROOT, 'slices', 'BOHEMIA_CITY_FLOORS.js');
if (fs.existsSync(FLOORS)) {
  const m = fs.readFileSync(FLOORS, 'utf8').match(/ROOM_FLOOR_MAP\s*=\s*(\{[\s\S]*?\});/);
  let mapped = null;
  try { mapped = m ? Object.keys(eval('(' + m[1] + ')')) : null; } catch (e) {}
  if (mapped && mapped.length) {
    const assigned = new Set();
    Object.keys(ZONES).forEach(z => {
      ZONES[z].roles.forEach(r => assigned.add(r));
      if (ZONES[z].bulk) assigned.add(ZONES[z].bulk);
    });
    const undressed = [...assigned].filter(r => mapped.indexOf(r) < 0);
    ok('A5 every role any zone assigns is one the floor pool can dress (' + assigned.size
       + ' assigned, ' + mapped.length + ' mapped, ' + (mapped.length - assigned.size)
       + ' spare)' + (undressed.length ? ' -> ' + undressed.join(', ')
         + ' would quietly fall back to the default floor' : ''),
       undressed.length === 0);
  }
}

/* ---- AND THEN THE ACTUAL BUILDINGS, because a table can be right and the code wrong. ---- */
fs.readdirSync(path.join(ROOT, 'engine'))
  .filter(f => /^bohemia_.*\.js$/.test(f))
  .forEach(f => { try {
    if (fs.readFileSync(path.join(ROOT, 'engine', f), 'utf8').includes('K.register('))
      require(path.join(ROOT, 'engine', f));
  } catch (e) {} });

const zoneOf = {};
(fs.readFileSync(path.join(ROOT, 'engine', 'bohemia_world.js'), 'utf8')
  .match(/^\s*(\w+):\s*\{[^\n]*zone:'(\w+)'/gm) || []).forEach(line => {
    const m = line.match(/^\s*(\w+):[\s\S]*zone:'(\w+)'/);
    if (m) zoneOf[m[1]] = m[2];
  });

const rolesOf = p => ((p.levels && p.levels[0] && p.levels[0].rooms) || p.rooms || []).map(r => r.role);
let rooms = 0, baths = 0, built = 0;
const flooded = [];
for (const t of K.types()) {
  let res; try { res = K.get(t).generate(4242, { streets: ['S'] }); } catch (e) { continue; }
  for (const f of (res.footprints || []).slice(0, 25)) {
    if (!f || !f.w || !f.h) continue;
    let plan; try { plan = FP.generate(4242, f.w, f.h, { zone: zoneOf[t] || 'default' }); } catch (e) { continue; }
    const rs = rolesOf(plan);
    if (!rs.length) continue;
    built++; rooms += rs.length;
    const nb = rs.filter(r => r === 'bath').length;
    baths += nb;
    /* THE PER-BUILDING CLAIM, and the one that actually bites: a single building may not be
       mostly lavatory. Stated as a share so it holds at any size -- the chapel was 92%. */
    if (rs.length >= 6 && nb / rs.length > 0.34) flooded.push(t + ' ' + f.w + 'x' + f.h + ' (' + nb + ' of ' + rs.length + ')');
  }
}
console.log('  ' + built + ' buildings from the real generators, ' + rooms + ' rooms, '
  + baths + ' bathrooms (' + (100 * baths / rooms).toFixed(1) + '%)   [before the fix: 1213 = 53.0%]');

ok('B1 NO BUILDING IN THE VALLEY IS MOSTLY LAVATORY -- no plan of six rooms or more is over a '
   + 'third bathrooms' + (flooded.length ? ' -> ' + flooded.slice(0, 6).join(', ') : ''),
   flooded.length === 0);

/* THE VALLEY-WIDE SHARE, held loosely on purpose. The exact figure moves whenever any lane
   adds a district; what must never come back is the ORDER OF MAGNITUDE. 20% is far above
   today's 4.1% and far below the 53% this gate exists for. */
ok('B2 and bathrooms are core space across the whole valley, not the programme (measured '
   + (100 * baths / rooms).toFixed(1) + '%, must stay under 20%)', baths / rooms < 0.20);

/* THE DIRECT CHECK ON THE CODE, not the table -- this is what goes red if somebody restores
   the clamp whatever ZONES says. It is stated ORDER-INDEPENDENTLY on purpose: the first
   version of this leg sliced "the rooms past the list" off the front of the rooms array and
   asked whether they were all the last role. They are not in that order. Rooms come back in
   ARRAY order and are NAMED by RANK (distance from the door), so the two do not line up, and
   the warehouse tail read `floor_open, floor_open, bath, office, dock` -- never uniform, so
   the leg could never fire. IT PASSED THE MUTATION THAT PUT THE CLAMP BACK, which makes it
   decoration, and I only found out because I ran the mutation.
   THE CLAIM WITHOUT THE ORDERING ASSUMPTION: on a plate far bigger than its room list, the
   MOST COMMON room must be what the zone scales with. Under the clamp it is the private-most
   room instead, in every zone, whatever order they come back in. */
const clamped = [];
Object.keys(ZONES).forEach(z => {
  const rs = rolesOf(FP.generate(99, 60, 40, { zone: z }));
  if (rs.length <= ZONES[z].roles.length + 2) return;      // too small to have a majority room
  const tally = {};
  rs.forEach(r => { tally[r] = (tally[r] || 0) + 1; });
  const top = Object.keys(tally).sort((a, b) => tally[b] - tally[a])[0];
  if (top !== ZONES[z].bulk)
    clamped.push(z + ' (a 60x40 plate is mostly "' + top + '", not "' + ZONES[z].bulk + '")');
});
ok('B3 and ON AN OVERSIZED PLATE THE COMMONEST ROOM IS WHAT THE ZONE SCALES WITH -- checked in '
   + 'the code rather than the table, so restoring the clamp fails here even if ZONES still '
   + 'reads correctly' + (clamped.length ? ' -> ' + clamped.join(', ') : ''),
   clamped.length === 0);

console.log('='.repeat(74));
console.log('  ROOM PROGRAM GATE: ' + pass + ' pass / ' + fail + ' fail');
console.log('='.repeat(74));
process.exit(fail ? 1 : 0);
