#!/usr/bin/env node
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
/* THE STREET CONTRACT GATE (8/26/26, WORLD lane) — STREETS SNAP LIKE LEGO OR THEY DO NOT SHIP.
 *
 * Paolo 8/25, PLAYTEST DISPATCH item 4, LOCKED:
 *   "IM SICK OF PLAYING THIS RUN AND NONE OF THE STREETS CONNECT EVER! YOU NEED A FUCKING
 *    STANDARD AWESOME WAY TO MAKE SURE IF ITS A STREET. IT WILL CONNECT ART WISE AND
 *    PATHWISE TO OTHER STREETS ... LIKE CONSISTENT PUZZLE PIECES AND LEGO BLOCKS"
 * laws/BOHEMIA_ADDENDUM_THE_PLAYTEST_DISPATCH_8_25_26.md turns that into the standard:
 * every street piece declares its connectors on all four edges, a piece may only sit where
 * every touching edge AGREES, and art and walkable path are the SAME contract. It ends
 * "it gets a gate that sweeps every placed street in the valley and fails on a single
 * mismatched edge." This is that gate.
 *
 * ── THE ONE DESIGN DECISION IN HERE, AND IT IS THE WHOLE THING ───────────────────────
 * A DECLARATION THAT IS NOT MEASURED OFF THE ART IS A SECOND SYSTEM, AND TWO SYSTEMS
 * DRIFT. The obvious way to build this is a table: arterial declares lanes:6, offset:0,
 * walk:6. That table would have been GREEN all day on 8/25 while the valley was in the
 * state Paolo played. So the connector is DERIVED FROM THE BUILT GRID, every run: the
 * gate reads the actual row of tiles along the actual edge of the actual generated cell
 * and works out where the road is from the tiles themselves. Art and path cannot drift
 * from the contract because the art IS the contract. That is also why the mutation test
 * below moves PIXELS rather than a number.
 *
 * ── WHAT A CONNECTOR IS ─────────────────────────────────────────────────────────────
 * Along one edge of one cell (FN tiles), classified through the cell's own legend:
 *   CORRIDOR  lo..hi   the outermost drivable tiles — drive, marking, gate — which is the
 *                      kit's own definition (driveMask + driveConductors), not a new one.
 *                      Everything between them is inside the street: medians, gutters,
 *                      dead cars, wrecks. An island in the middle of a road does not
 *                      change where the road IS, and neither does a burnt-out semi.
 *   WALK      present  a body can leave this edge on foot.
 * Two touching edges AGREE when their corridors are the same tiles. Off by one is red.
 *
 * ── WHAT IT FOUND, AND WHAT IT COST TO FIND ─────────────────────────────────────────
 * MEASURED on the valley before any of this turn's fixes: 4,497 road-to-road seams,
 * 1,405 of them broken (31.2%). Three causes, all of them structural, none of them
 * visible from reading any single file:
 *
 *  1. EVERY ARTERIAL IN THE VALLEY WAS BUILT NORTH-SOUTH. The registration forced
 *     `o.links = ['N','S']`, axis included. 921 cells (26% of every road cell) ran across
 *     the way the world connects them; the worst seam had an arterial's SIDEWALK MARGIN
 *     butted against the next arterial's CARRIAGEWAY for 93 of 128 rows.
 *  2. AN ARTERIAL CROSSING AN ARTERIAL WAS NOT A CROSSING. kitRoadLegs threw away any
 *     road neighbour with the same district name — "my own other half is not a cross
 *     street" — which is true of a road that runs the same way I do and false of one that
 *     runs across me. Both are called `arterial`. So the crossing arms were never built:
 *     564 seams where the north-south street ran to the edge of the east-west street's
 *     cell and stopped in bare dirt 15 m short of the roadway.
 *  3. THE CURB RAMP ATE THE CROSSING STREET. The ramp is drawn out from the corner across
 *     the full parkway and walk — twenty tiles — and it was allowed to overwrite asphalt,
 *     so at the far end of that run it landed on the PERPENDICULAR street's carriageway
 *     right at the cell boundary and took two tiles off each side of it. 1,138 seams: the
 *     largest single class, and the last one left standing after the other two were fixed.
 *
 * All three are fixed and this gate holds all three shut. THE LESSON WORTH KEEPING is
 * about the instrument, again: the first metric counted any change in solidity across a
 * seam (which flags every legitimate wall), the second demanded a road continue across
 * its own FLANK (which is nonsense), the third filtered on a "declared connector" flag
 * that turned out to mean "a road neighbour exists" and therefore filtered nothing — it
 * returned exactly the unfiltered count, which is the signature of a filter that is not
 * filtering. A NEGATIVE RESULT IS A CLAIM ABOUT YOUR INSTRUMENT UNTIL YOU HAVE SHOWN THE
 * INSTRUMENT COULD HAVE SEEN A POSITIVE ONE. Hence the mutation test.
 *
 * ── WHAT IT DELIBERATELY DOES NOT ASSERT ────────────────────────────────────────────
 * That a FREEWAY matches an ARTERIAL. It does not and it should not: a freeway is not an
 * arterial and the place they meet is an interchange, which is its own district type. The
 * seams between different road classes are counted, named and ratcheted (CROSS_CLASS_DEBT
 * below) so nothing hides in them, and they are the next piece of work, not a pass.
 *
 *   node gates/street_contract_gate.js
 */
const path = require('path');
const ROOT = path.dirname(__dirname);
const PAGE = 'slices/BOHEMIA_CITY_WORLD.html';
let pass = 0, fail = 0;
function ok(what, cond) {
  if (cond) { pass++; console.log('  ok   ' + what); }
  else { fail++; console.log('  FAIL ' + what); }
}
function requirePlaywright() {
  const globals = ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules'];
  for (const g of globals) { try { return require(path.join(g, 'playwright')); } catch (_e) {} }
  return require('playwright');
}

/* THE CROSS-CLASS ALLOWANCE. Two different road classes meeting genuinely do not share a
   cross-section, and the honest answer for most of these is a piece that does not exist
   yet (a frontage road where an arterial dies on a freeway flank; a level crossing where
   a street meets rail). They are counted so the number can only ever go DOWN. Measured
   8/26 after the three fixes above: 270.
   RATCHETED 8/27: 270 -> 166 when the bridge deck started counting as corridor, then
   166 -> 129 when the LEVEL CROSSING stopped inventing its own road width. The rail
   module carried `var PAVE = 21, CURB = 23` under a comment that said, verbatim, "the
   grade crossing borrows the arterial's own cross-section" -- it borrowed nothing, those
   were the arterial's numbers on the day somebody typed them, and the arterial moved to
   17/19 on 8/26. A street 35 tiles wide ran up to the railway, crossed on a 43-tile
   crossing and came off 35 wide again. It reads ART.PAVE_HALF now. 37 seams, and the
   FIFTH time this month a constant moved and its dependent stayed behind.
   RATCHETED AGAIN 8/28: 129 -> 34 when the FREEWAY stopped being built north-south
   however it actually ran. See the freeway note below; one line in its registration was
   throwing away the world's answer before the module ever saw it. */
const CROSS_CLASS_DEBT = 34;

/* AND THE TWO SAME-CLASS CAUSES STILL STANDING, EACH NAMED AND EACH COUNTED. Paolo's
   wording is "fails on a single mismatched edge", and that is exactly what ARTERIAL --
   3,300 of the valley's 4,234 same-class seams, and the road he actually walks -- is
   held to: zero, no allowance, any family not listed here must be zero. The two below
   are real and structural, they are written down instead of hidden, and the ceiling can
   only ever come down:
     interchange 3 -- a stack is a BLOB drawn in valley coordinates across a cluster of
       cells, and three of its internal seams land one tile out. An off-by-one in a blob's
       coordinate mapping, not in the street contract.
     strip       1 -- was 4. THREE OF THE FOUR WERE ONE THING (8/27): a cross street that
       ran up to a two-cell-wide boulevard, crossed the near carriageway, and STOPPED IN THE
       MIDDLE OF LAS VEGAS BOULEVARD. `spanThrough` was wired on 8/18 to carry the pedestrian
       BRIDGE across the sibling half and it carried only that -- the roadway underneath it
       still ended at the cell boundary. Identical shape to the freeway deck fixed earlier
       today: the fix travelled to the thing on top and not to the thing underneath. A
       through-half now paves the cross arm edge to edge with its lane lines and its
       pavements, and still gets NO junction anatomy -- no crosswalks, no stop bars, no
       signals, no second pair of bridge towers, and no median palms or parking pockets down
       a cross arm, because those belong to a boulevard and this is a street passing through.
       ONE RESIDUAL, NOT YET DIAGNOSED. It is written down as one rather than guessed at. */
/* *** THE ROAD HAS TO MEET THE CITY, AND FOR TWO DAYS THIS GATE NEVER ASKED (8/28). ***
   Every edge in the valley where a street reaches, road-to-road AND road-to-city AND
   city-to-city, minus the ones that honestly die against desert or mountain.
   MEASURED the day Paolo said "streets are stillls uper fucked" with this page green:
   2,668 of 7,358. THE CAUSE WAS ONE-SIDED AND THE CITY WAS THE SIDE DOING ITS JOB --
   every district out there obeys the STREET-AWARE ACCESS LAW and puts its car entrance at
   the kerb, and the arterial had 27 m of parcel frontage in the way and never cut its
   kerb to meet one. The world now measures where each neighbour's driveway arrives and
   the road runs a real approach out to it. 2,668 -> 1,609 in one pass.
   Two of the three fixes that got there were bugs in rules written the same hour: a
   "widen a narrow mouth" rule that pushed 61..67 to 60..67 and turned 141 dead ends into
   141 off-by-ones, and C-63 landing on tile 1 instead of tile 0 on the north and west
   edges -- which is the exact off-by-one this module's own header warns about.
   1609 -> 1616 for the last fix and it is a DELIBERATE seven: a reclamation yard whose
   whole 90 m edge is drive surface used to make the road pave 90 m of its own frontage,
   which broke five arterial-to-arterial seams. A ninety-metre yard has ONE GATE, so a run
   wider than a real drive approach now gets a proper 12 m entrance at its centre instead,
   and seven of those stop matching the yard tile for tile. That is the truthful state of
   the valley, not a rounding: arterial is back to 0 of 2594 with no allowance.
   *** 1616 -> 700 THE NEXT TURN, three things (8/28). *** The metric stopped calling a
   driveway feeding onto a road a break (231). LAS VEGAS BOULEVARD got the same treatment
   the arterial had, so a resort's porte-cochere reaches the kerb (57). And OPEN GROUND
   turned out to own a door after all: `desert <-> arterial` was the single biggest shape
   left in the valley at 576, all of them two-tracks two and three tiles wide running out
   of an empty lot at a mile-grid arterial and stopping in its frontage. Out there the
   county grades an apron at every one, so the road lays one -- graded DIRT, not the poured
   concrete a shopping plaza gets, because giving a two-track an apron would be the same
   lie as giving a dead lawn a green. 2,668 -> 700 over two turns, 36.3% -> 9.5%. */
const REACH_DEBT = 642;

/* HOW MUCH OF THE VALLEY'S ROAD A CAR CAN ACTUALLY REACH, and how many freeway cells are
   stranded off it. These are FLOORS AND CEILINGS ON THE WHOLE MAP rather than on one seam,
   and they exist because four attempts were spent fixing seams that were not what was
   cutting the interstate in half. Measured 8/28 after the freeway stopped being built
   north-south: 95.8% of road cells on one network, up from 91.6%, and 2 stranded freeway
   cells, down from 249. */
const NET_FLOOR = 0.955;
const FWY_ORPHAN_DEBT = 4;

const SAME_CLASS_DEBT = {
  interchange: 3,
  strip: 1,
  /* FREEWAY, 40, AND IT IS A MAP FACT RATHER THAN A PIECE FACT (8/27). These are NOT new
     breaks -- they are newly VISIBLE ones. Until today this contract did not count a
     bridge deck as corridor, so an arterial crossing a freeway on an overpass read as a
     street that simply ended, and 196 seams were mis-filed as arterial-to-freeway breaks.
     Counting the deck closed all 196 and revealed what was underneath: 40 seams where one
     freeway carriageway carries a deck 35 tiles wide and the carriageway beside it carries
     none.
     THE CAUSE IS UPSTREAM OF ANY GENERATOR. Sampled: freeway(13,13) has streets N/S with
     cross E+W, and freeway(14,13) beside it has streets E/W with cross S -- two freeway
     cells running PERPENDICULAR TO EACH OTHER and meeting. That is a freeway-on-freeway
     crossing, and this valley has a district for exactly that: `interchange`. Where the
     overmap laid two interstates across each other without marking the junction, no piece
     can make the seam agree, because the two cells are honestly building two different
     roads. MAP LAW (Paolo): Claude never designs map layouts, plumbing only. So it is
     counted, named, and left for a ruling rather than papered over with a special case.
     Two things were fixed on the way here and both stay fixed: the deck was 23 tiles wide
     carrying a 35-tile road (a literal that stopped tracking when the arterial moved), and
     the deck axis was taken from the freeway's FAMILY neighbours instead of the axis it
     runs on, so corner and tied cells chose no axis and built no bridge at all. */
  /* FREEWAY 40 -> 14 (8/28). The 40 were never a map fact and never the beltway's corners
     -- both of those were guesses, and the second was built, run and reverted for changing
     the count by zero. They were ONE LINE in the freeway's kit registration:
         o.same = o.links = o.streets = ['N', 'S'];
     which forces both legs AND THE AXIS, so every freeway in the valley was built
     north-south however it actually ran. This gate's own header calls that identical line,
     in the arterial, that module's defect number one. It was fixed there on 8/26 and
     nobody swept the class. `freeway(15,13)` runs east-west and measured N 18..110,
     S 18..110, E -1..-1, W -1..-1: the carriageway drawn ninety degrees to the road. */
  freeway: 14
};

(async () => {
  console.log('THE STREET CONTRACT — every seam in the valley, measured off the tiles\n');
  let browser;
  try {
    const { chromium } = requirePlaywright();
    browser = await chromium.launch();
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 },
                                           hasTouch: true, isMobile: true });
    const p = await ctx.newPage();
    const errs = [];
    p.on('pageerror', e => errs.push(String(e)));
    await p.goto('file://' + path.join(ROOT, PAGE));
    await SETTLE(p, 4000);
    await p.evaluate(() => { try { cardHide(); } catch (e) {} });

    /* THE SWEEP LIVES ON THE PAGE so the mutation test can re-run the identical code
       against a mutated world without a second definition of anything. */
    await p.evaluate(() => {
      window.__CONTRACT = function () {
        const N = om.n;
        function connector(tx, ty, edge) {
          let m; try { m = tileMeta(tx, ty); } catch (e) { return null; }
          const g = m.kit; if (!g) return null;
          const L = deadLegendFor(m); if (!L) return null;
          let lo = -1, hi = -1, walk = false;
          for (let i = 0; i < FN; i++) {
            const lx = edge === 'W' ? 0 : edge === 'E' ? FN - 1 : i;
            const ly = edge === 'N' ? 0 : edge === 'S' ? FN - 1 : i;
            const e = L[g[ly * FN + lx]]; if (!e) continue;
            const k = e.kind;
            /* AND A BRIDGE DECK IS THE STREET CONTINUING (8/27). An arterial crossing a
               freeway does not stop at the freeway -- it rides over on a deck, and a car
               drives along that deck. The deck's tiles are kind `overhead`, which this
               profile did not count, so every one of those crossings read as a street that
               simply ended: 97 seams of ONE_SIDE plus 99 of OFFSET, 196 of the 270 breaks
               left in the valley. The kit already treats an overhead as a drive CONDUCTOR
               for exactly this reason; the contract was the one place that did not. */
            const over = BohemiaDistrictKit.tileLayer(e).layer === 'overhead';
            if (k === 'drive' || k === 'marking' || k === 'gate' || over) { if (lo < 0) lo = i; hi = i; }
            else if (k === 'walk') walk = true;
          }
          return { lo: lo, hi: hi, walk: walk, d: m.d };
        }
        /* WHICH PIECES ARE THE SAME KIND OF BRICK. A run and its own crossing are one
           class -- that is the whole point of them snapping -- and the freeway family
           already has a name in the world model. */
        function fam(d) {
          if (d === 'arterial' || d === 'arterial_x') return 'arterial';
          if (d === 'freeway' || d === 'beltway') return 'freeway';
          return d;
        }
        const out = { seams: 0, sameClass: 0, sameBroken: 0, crossClass: 0, crossBroken: 0,
                      byClass: {}, worst: [], noGrid: 0, famSeams: {}, famBroken: {} };
        for (let ty = 0; ty < N; ty++) for (let tx = 0; tx < N; tx++) {
          const t = om.at(tx, ty); if (!t || !RD[t.district]) continue;
          for (const step of [['S', 0, 1, 'N'], ['E', 1, 0, 'W']]) {
            const edge = step[0], dx = step[1], dy = step[2], opp = step[3];
            const u = om.at(tx + dx, ty + dy); if (!u || !RD[u.district]) continue;
            const A = connector(tx, ty, edge), B = connector(tx + dx, ty + dy, opp);
            if (!A || !B) { out.noGrid++; continue; }
            out.seams++;
            const same = fam(A.d) === fam(B.d);
            let verdict = 'OK';
            if (A.lo < 0 && B.lo < 0) verdict = 'NO_STREET';          // nothing runs here
            else if (A.lo < 0 || B.lo < 0) verdict = 'ONE_SIDE';      // a road stops dead
            else if (A.lo !== B.lo || A.hi !== B.hi) verdict = 'OFFSET';
            const broken = (verdict === 'ONE_SIDE' || verdict === 'OFFSET');
            if (same) {
              out.sameClass++;
              const f = fam(A.d);
              out.famSeams[f] = (out.famSeams[f] || 0) + 1;
              if (broken) { out.sameBroken++; out.famBroken[f] = (out.famBroken[f] || 0) + 1; }
            }
            else { out.crossClass++; if (broken) out.crossBroken++; }
            if (broken) {
              const key = verdict + ' ' + A.d + '|' + edge + '|' + B.d;
              out.byClass[key] = (out.byClass[key] || 0) + 1;
              if (same && out.worst.length < 12)
                out.worst.push(A.d + '(' + tx + ',' + ty + ') -' + edge + '-> ' + B.d +
                               '  ' + A.lo + '..' + A.hi + ' vs ' + B.lo + '..' + B.hi);
            }
          }
        }
        return out;
      };

      /* *** AND THE CONTRACT ABOVE ONLY EVER ASKED THE ROAD ABOUT OTHER ROADS. ***
         Paolo, after playing 8/28k, with every check on this page green and arterial at
         0 of 2594: "streets are stillls uper fucked". He was right, and the two lines that
         made him right are in __CONTRACT itself:
             const t = om.at(tx, ty);           if (!t || !RD[t.district]) continue;
             const u = om.at(tx+dx, ty+dy);     if (!u || !RD[u.district]) continue;
         BOTH SIDES MUST BE A ROAD DISTRICT OR THE SEAM IS NOT LOOKED AT. Every edge where
         a street meets a shop block, a neighbourhood, a farm, a plaza -- every edge a
         person actually walks up to -- was skipped in silence. This gate governed the road
         network talking to itself and said nothing at all about the road network talking
         to the city, while reporting a number that sounded like it covered the valley.
         MEASURED the day he said it: 4,497 road-to-road seams here, against 7,562 edges in
         the valley where a street actually reaches one. 2,668 of those did not connect.
         So the sweep is asked at EVERY edge now: if either side has a corridor reaching it,
         the other side must have one too and it must be the same tiles. A road that runs to
         a boundary and finds bare ground is a road that ends in dirt, whatever the district
         on the far side is called. */
      window.__REACH = function () {
        const N = om.n;
        /* THE VALLEY RIM. A street really does end at these. Counted APART so the headline
           can never be padded with roads that stop at a mountain. */
        /* SAME ROAD OR A DIFFERENT ONE, WHICH IS NOT THE SAME QUESTION AS "BOTH ARE ROADS".
           An arterial running into another arterial is a CONTINUATION and must match tile for
           tile. An arterial arriving at a FREEWAY is a JUNCTION -- it bridges over on a deck
           or it ramps on, and either way `arterial 47..81 vs freeway 18..110` is the smaller
           road landing inside the bigger one's corridor, which is correct and was being
           counted as 99 breaks. Same reasoning as a shop's driveway feeding onto a road, one
           class up. The gate's own header has said this since the day it was written: "a
           freeway is not an arterial and the place they meet is an interchange." */
        const rfam = d => d === 'arterial_x' ? 'arterial' : d === 'beltway' ? 'freeway' : d;
        const WILD = { desert: 1, mountain: 1, water: 1, wash: 1 };
        function conn(tx, ty, edge) {
          let m; try { m = tileMeta(tx, ty); } catch (e) { return null; }
          const g = m.kit; if (!g) return null;
          const L = deadLegendFor(m); if (!L) return null;
          let lo = -1, hi = -1;
          for (let i = 0; i < FN; i++) {
            const lx = edge === 'W' ? 0 : edge === 'E' ? FN - 1 : i;
            const ly = edge === 'N' ? 0 : edge === 'S' ? FN - 1 : i;
            const e = L[g[ly * FN + lx]]; if (!e) continue;
            const k = e.kind;
            const over = BohemiaDistrictKit.tileLayer(e).layer === 'overhead';
            if (k === 'drive' || k === 'marking' || k === 'gate' || over) { if (lo < 0) lo = i; hi = i; }
          }
          return { lo: lo, hi: hi, d: m.d };
        }
        const out = { looked: 0, ok: 0, oneSide: 0, offset: 0, atWild: 0, byPair: {}, worst: [] };
        for (let ty = 0; ty < N; ty++) for (let tx = 0; tx < N; tx++) {
          const t = om.at(tx, ty); if (!t) continue;
          for (const step of [['S', 0, 1, 'N'], ['E', 1, 0, 'W']]) {
            const edge = step[0], dx = step[1], dy = step[2], opp = step[3];
            const u = om.at(tx + dx, ty + dy); if (!u) continue;
            const A = conn(tx, ty, edge), B = conn(tx + dx, ty + dy, opp);
            if (!A || !B) continue;
            const aHas = A.lo >= 0, bHas = B.lo >= 0;
            if (!aHas && !bHas) continue;            // no street here: nothing is owed
            out.looked++;
            /* *** A DRIVEWAY IS NOT REQUIRED TO BE AS WIDE AS THE ROAD IT JOINS (8/28). ***
               The first cut of this demanded the two corridors be the SAME TILES, which is
               exactly right where two arterials meet and plainly wrong where a shop's drive
               approach feeds onto one: `commercial 47..57` against `arterial 47..81` is a
               correct junction and it was being counted as a break. 231 of them were.
               A road-to-road seam is a CONTINUATION and must match tile for tile. A
               road-to-city seam is a JUNCTION and only has to be CONTAINED -- the smaller
               mouth wholly inside the larger, nothing hanging off the side. Partial overlap
               and disjoint are still broken: that is a driveway that half-misses the road,
               which is the thing that actually looks wrong on the ground. */
            const bothRoad = !!RD[t.district] && !!RD[u.district] && rfam(t.district) === rfam(u.district);
            let verdict = 'OK';
            if (!aHas || !bHas) verdict = 'ONE_SIDE';
            else if (bothRoad) { if (A.lo !== B.lo || A.hi !== B.hi) verdict = 'OFFSET'; }
            else {
              const inside = (A.lo >= B.lo && A.hi <= B.hi) || (B.lo >= A.lo && B.hi <= A.hi);
              if (!inside) verdict = 'OFFSET';
            }
            if (verdict === 'OK') { out.ok++; continue; }
            if ((!aHas && WILD[t.district]) || (!bHas && WILD[u.district])) { out.atWild++; continue; }
            if (verdict === 'ONE_SIDE') out.oneSide++; else out.offset++;
            const key = verdict + '  ' + t.district + ' -' + edge + '-> ' + u.district;
            out.byPair[key] = (out.byPair[key] || 0) + 1;
            if (out.worst.length < 10)
              out.worst.push(key.replace(/  +/g, ' ') + '  (' + tx + ',' + ty + ')  ' +
                             A.lo + '..' + A.hi + ' vs ' + B.lo + '..' + B.hi);
          }
        }
        return out;
      };
    });

    const R = await p.evaluate(() => window.__CONTRACT());
    console.log('       ' + R.seams + ' road-to-road seams in the valley: ' +
                R.sameClass + ' between pieces of the same class, ' +
                R.crossClass + ' where two different road classes meet.');
    if (R.worst.length) { console.log('       same-class breaks:'); R.worst.forEach(w => console.log('         ' + w)); }
    const named = Object.keys(R.byClass).sort().map(k => k + ':' + R.byClass[k]).join('  ');
    if (named) console.log('       ' + named);

    ok('the sweep actually reached the valley — thousands of real seams, not a fixture ' +
       '(' + R.seams + ' seams, ' + R.noGrid + ' cells with no grid)',
       R.seams > 3000 && R.noGrid === 0);

    /* THE RULING, IN ONE LINE, PER FAMILY OF BRICK. */
    const fams = Object.keys(R.famSeams).sort();
    console.log('       ' + fams.map(f => f + ' ' + (R.famBroken[f] || 0) + '/' + R.famSeams[f]).join('   '));
    for (const f of fams) {
      const bad = R.famBroken[f] || 0, ceil = SAME_CLASS_DEBT[f] || 0;
      ok((ceil === 0
          ? 'EVERY ' + f.toUpperCase() + ' SEAM AGREES TILE FOR TILE — the corridor starts ' +
            'and ends on the same row on both sides of every ' + f + '-to-' + f + ' join in ' +
            'the valley, and a single mismatched edge fails this'
          : f.toUpperCase() + ' holds at its written-down ceiling and only ever comes down ' +
            '(see SAME_CLASS_DEBT for what the ' + ceil + ' are)') +
         ' (' + bad + ' of ' + R.famSeams[f] + ', ceiling ' + ceil + ')',
         bad <= ceil);
      if (bad < ceil) console.log('       RATCHET: ' + f + ' is down to ' + bad + '; lower SAME_CLASS_DEBT.' + f + '.');
    }
    ok('and no road family appears that nobody has ruled on — a new street type cannot ' +
       'arrive with a silent allowance',
       fams.every(f => SAME_CLASS_DEBT[f] === undefined || SAME_CLASS_DEBT[f] > 0));

    ok('where two DIFFERENT road classes meet the count is written down and only goes ' +
       'down — nothing hides in the gap between a freeway and a street ' +
       '(' + R.crossBroken + ' of ' + R.crossClass + ', ceiling ' + CROSS_CLASS_DEBT + ')',
       R.crossBroken <= CROSS_CLASS_DEBT);

    if (R.crossBroken < CROSS_CLASS_DEBT)
      console.log('       RATCHET: cross-class breaks are down to ' + R.crossBroken +
                  '; lower CROSS_CLASS_DEBT to that number.');

    /* ── WALK A STRAIGHT LINE ACROSS THREE DISTRICTS ────────────────────────────────
       His acceptance criterion in his own words, on the surface he plays. Not the
       connector maths again: the actual tiles under the actual player, from one end of a
       three-cell run of street to the other, through both cell boundaries. */
    const walk = await p.evaluate(() => {
      const N = om.n;
      function ax(tx, ty) { const t = om.at(tx, ty); return t && RD[t.district] ? roadAxis(t.district, tx, ty) : null; }
      // find the longest east-west run of arterial cells, then walk its centreline
      let best = null;
      for (let ty = 0; ty < N; ty++) {
        let run = [];
        for (let tx = 0; tx < N; tx++) {
          const t = om.at(tx, ty);
          if (t && t.district === 'arterial' && ax(tx, ty) === 'ew') run.push(tx);
          else { if (run.length >= 3 && (!best || run.length > best.cells.length)) best = { ty: ty, cells: run.slice() }; run = []; }
        }
        if (run.length >= 3 && (!best || run.length > best.cells.length)) best = { ty: ty, cells: run.slice() };
      }
      if (!best) return { found: false };
      const use = best.cells.slice(0, 3);
      const gy = best.ty * FN + (FN >> 1) - 8;         // one lane off the median, in traffic
      const x0 = use[0] * FN, x1 = (use[2] + 1) * FN - 1;
      let steps = 0, dead = [], nonwalk = 0;
      for (let gx = x0; gx <= x1; gx++) {
        steps++;
        const c = cellAt(gx, gy);
        if (!c || !c.walk) { nonwalk++; if (dead.length < 8) dead.push(gx + ',' + gy); }
      }
      // and the same walk down the sidewalk, out at the edge of the corridor
      const wy = best.ty * FN + 3;
      let wsteps = 0, wdead = [];
      for (let gx = x0; gx <= x1; gx++) {
        wsteps++;
        const c = cellAt(gx, wy);
        if (!c || !c.walk) { if (wdead.length < 8) wdead.push(gx + ',' + wy); }
      }
      return { found: true, ty: best.ty, cells: use, steps: steps, nonwalk: nonwalk,
               dead: dead, wsteps: wsteps, wdead: wdead.length, wsample: wdead };
    });

    /* ── DOES THE ROAD MEET THE CITY, OR ONLY OTHER ROADS ────────────────────────── */
    const RE = await p.evaluate(() => window.__REACH());
    console.log('       ' + RE.looked + ' edges in the valley have a street reaching them ' +
                '(the road-to-road count above is ' + R.seams + '), ' +
                RE.atWild + ' of them end honestly at desert or mountain.');
    {
      const badReach = RE.oneSide + RE.offset;
      const pairs = Object.entries(RE.byPair).sort((a, b) => b[1] - a[1]).slice(0, 8);
      if (pairs.length) { console.log('       what meets what, worst first:');
        pairs.forEach(([k, v]) => console.log('         ' + String(v).padStart(4) + '  ' + k)); }
      if (RE.worst.length) RE.worst.slice(0, 4).forEach(w => console.log('         ' + w));
      ok('THE ROAD MEETS THE CITY, NOT JUST OTHER ROADS — every edge where a street reaches ' +
         'is counted, including the ones where it meets a shop block or a neighbourhood, and ' +
         'the number only ever goes down ' +
         '(' + badReach + ' of ' + (RE.looked - RE.atWild) + ', ceiling ' + REACH_DEBT + ')',
         badReach <= REACH_DEBT);
      if (badReach < REACH_DEBT)
        console.log('       RATCHET: reach breaks are down to ' + badReach + '; lower REACH_DEBT.');
      /* AND THE SWEEP MUST BE BIGGER THAN THE ONE THAT WAS BLIND, or somebody has quietly
         narrowed it back to road-to-road and the ceiling above means nothing. */
      ok('and it really did look outside the road network — this sweep sees more edges than ' +
         'the road-to-road one it was added to correct',
         RE.looked > R.seams * 1.4);
    }

    /* ── AND THE QUESTION UNDERNEATH EVERY SEAM COUNT: CAN A CAR GET ANYWHERE ─────────
       Every check above is LOCAL -- does this one edge line up. None of them asks the thing
       a player asks, which is whether the road outside your door reaches the road you want.
       It cost four failed attempts on the freeway decks to learn the difference: the seam
       count and the connectivity are not the same measurement, and I was chasing the wrong
       one. When the real cause finally turned up, the seam count moved a little and the
       NETWORK moved enormously -- 214 islands to 100, and 703 of 952 freeway cells on the
       valley's main road network to 950.
       Same connector data, turned into a graph: a node per cell that has any corridor, an
       edge where two cells' corridors OVERLAP at the seam they share, then components.
       Cell resolution on purpose: 96x96 cells of 128x128 tiles is 150 million tiles and a
       flood over that in a browser is a hang, not a measurement. Overlap at the seam is
       exactly the condition a car needs to cross a boundary, which is the only thing cell
       resolution has to get right. */
    const NET = await p.evaluate(() => {
      const N = om.n;
      function conn2(tx, ty, edge) {
        let m; try { m = tileMeta(tx, ty); } catch (e) { return null; }
        const g = m.kit; if (!g) return null;
        const L = deadLegendFor(m); if (!L) return null;
        let lo = -1, hi = -1;
        for (let i = 0; i < FN; i++) {
          const lx = edge === 'W' ? 0 : edge === 'E' ? FN - 1 : i;
          const ly = edge === 'N' ? 0 : edge === 'S' ? FN - 1 : i;
          const e = L[g[ly * FN + lx]]; if (!e) continue;
          const k = e.kind;
          const over = BohemiaDistrictKit.tileLayer(e).layer === 'overhead';
          if (k === 'drive' || k === 'marking' || k === 'gate' || over) { if (lo < 0) lo = i; hi = i; }
        }
        return lo >= 0 ? { lo: lo, hi: hi } : null;
      }
      const idx = (x, y) => y * N + x;
      const has = new Map(), prof = new Map();
      for (let ty = 0; ty < N; ty++) for (let tx = 0; tx < N; tx++) {
        const t = om.at(tx, ty); if (!t) continue;
        const e = {}; let any = false;
        for (const ed of ['N', 'S', 'E', 'W']) { const c = conn2(tx, ty, ed); if (c) { e[ed] = c; any = true; } }
        if (any) { has.set(idx(tx, ty), t.district); prof.set(idx(tx, ty), e); }
      }
      const par = new Map();
      const find = a => { while (par.get(a) !== a) { par.set(a, par.get(par.get(a))); a = par.get(a); } return a; };
      for (const k of has.keys()) par.set(k, k);
      for (let ty = 0; ty < N; ty++) for (let tx = 0; tx < N; tx++) {
        const k = idx(tx, ty); if (!has.has(k)) continue;
        for (const [ed, dx, dy, opp] of [['S', 0, 1, 'N'], ['E', 1, 0, 'W']]) {
          const k2 = idx(tx + dx, ty + dy); if (!has.has(k2)) continue;
          const A = prof.get(k)[ed], B = prof.get(k2)[opp];
          if (!A || !B) continue;
          if (A.lo <= B.hi && B.lo <= A.hi) { const a = find(k), b = find(k2); if (a !== b) par.set(a, b); }
        }
      }
      const cnt = new Map();
      for (const k of has.keys()) { const r = find(k); cnt.set(r, (cnt.get(r) || 0) + 1); }
      let root = null, big = -1;
      for (const [r, n] of cnt) if (n > big) { big = n; root = r; }
      let fwy = 0, fwyBig = 0;
      for (const [k, d] of has) {
        if (d !== 'freeway' && d !== 'beltway') continue;
        fwy++; if (find(k) === root) fwyBig++;
      }
      return { cells: has.size, components: cnt.size, biggest: big, fwy: fwy, fwyBig: fwyBig };
    });
    {
      const pct = NET.cells ? NET.biggest / NET.cells : 0;
      console.log('       ' + NET.cells + ' cells carry road, in ' + NET.components +
                  ' separate networks; the biggest is ' + NET.biggest + ' (' +
                  (100 * pct).toFixed(1) + '%), and ' + NET.fwyBig + ' of ' + NET.fwy +
                  ' freeway cells are on it.');
      ok('THE VALLEY IS ONE ROAD NETWORK — the share of road cells a car can reach from the ' +
         'biggest network only ever goes UP, so no fix may quietly cut the map in half ' +
         '(' + (100 * pct).toFixed(1) + '%, floor ' + (100 * NET_FLOOR).toFixed(1) + '%)',
         pct >= NET_FLOOR);
      ok('AND YOU CAN DRIVE THE INTERSTATE — freeway cells stranded off the main network ' +
         '(' + (NET.fwy - NET.fwyBig) + ', ceiling ' + FWY_ORPHAN_DEBT + ')',
         (NET.fwy - NET.fwyBig) <= FWY_ORPHAN_DEBT);
      if (pct > NET_FLOOR + 0.002)
        console.log('       RATCHET: connectivity is up to ' + (100 * pct).toFixed(1) + '%; raise NET_FLOOR.');
    }

    ok('there IS a three-cell straight run of street in the valley to walk',
       walk.found && walk.cells.length === 3);
    if (walk.found) {
      console.log('       walking east along row ' + walk.ty + ', cells ' + walk.cells.join(' -> ') +
                  ' = ' + walk.steps + ' tiles (' + Math.round(walk.steps * 0.75) + ' m), crossing two cell boundaries');
      ok('HE CAN WALK A STRAIGHT LINE ACROSS THREE DISTRICTS WITHOUT THE STREET BREAKING ' +
         '— every one of the ' + walk.steps + ' tiles down the traffic lane is ground he ' +
         'can stand on (' + walk.nonwalk + ' broken' +
         (walk.dead.length ? ' at ' + walk.dead.join(' ') : '') + ')',
         walk.nonwalk === 0);
      ok('and the same walk down the SIDEWALK holds too — art and path are one contract, ' +
         'so the pedestrian side cannot pass while the roadway fails or the other way round ' +
         '(' + walk.wdead + ' of ' + walk.wsteps + ' broken' +
         (walk.wsample.length ? ' at ' + walk.wsample.join(' ') : '') + ')',
         walk.wdead === 0);
    }

    /* ── THE SIDEWALK IS ONE SIDEWALK ───────────────────────────────────────────────
       Paolo 8/26, LOCKED: "all the sidewalks should be connected altogether unless
       there's a crazy explosion or something's wrong. Most of the time the streets and
       the sidewalk should be in harmony all the way."
       That is a claim about a WALK, not about a seam, so it is tested as a walk: pick the
       longest straight run of street in the valley and walk BOTH pavements from one end to
       the other, asking the page itself whether each tile is ground he can stand on.
       WHAT IT CAUGHT ON ITS FIRST RUN, over 5,376 tiles / 4 km: the sidewalk broke
       FOURTEEN times. Two causes, both invisible to a per-cell check:
         - THE BUS STOP. Seven tiles of pavement, twice a cell, that a body could not
           cross -- on a tile whose legend says solid:false. The walked surface's
           `structure` branch set walk=false flat and never read the flag, exactly as its
           `prop` and `ground` branches did until 8/18. Six tiles in the whole game declare
           a standable structure and all six were being discarded.
         - THE CROSSING STREET'S FURNITURE. At a corner the band is the MINIMUM over both
           axes, so a tile 20-25 off the north-south centreline is PARKWAY -- and also sits
           on the east-west road's SIDEWALK. Dead palms and dead cars were being planted
           there, sealing a pavement the other road never put anything on. */
    const sw = await p.evaluate(() => {
      const N = om.n;
      let best = null;
      for (let ty = 0; ty < N; ty++) {
        let run = [];
        for (let tx = 0; tx < N; tx++) {
          const t = om.at(tx, ty);
          if (t && t.district === 'arterial' && roadAxis('arterial', tx, ty) === 'ew') run.push(tx);
          else { if (run.length >= 4 && (!best || run.length > best.cells.length)) best = { ty: ty, cells: run.slice() }; run = []; }
        }
        if (run.length >= 4 && (!best || run.length > best.cells.length)) best = { ty: ty, cells: run.slice() };
      }
      if (!best) return { found: false };
      const cells = best.cells;
      const x0 = cells[0] * FN, x1 = (cells[cells.length - 1] + 1) * FN - 1;
      const out = { found: true, cells: cells.length, sides: {} };
      for (const off of [-27, 27]) {
        const gy = best.ty * FN + (FN >> 1) + off;
        let steps = 0, dead = 0, cur = 0, longest = 0, first = [];
        for (let gx = x0; gx <= x1; gx++) {
          steps++;
          const c = cellAt(gx, gy);
          if (c && c.walk) { cur++; if (cur > longest) longest = cur; }
          else {
            dead++; cur = 0;
            if (first.length < 5) {
              const tx = (gx / FN) | 0, ty = (gy / FN) | 0;
              let nm = '?';
              try { const m = tileMeta(tx, ty), L = deadLegendFor(m);
                    const e = L[m.kit[(gy - ty * FN) * FN + (gx - tx * FN)]];
                    nm = (e && e.name) || '?'; } catch (_e) {}
              first.push(nm);
            }
          }
        }
        out.sides[off < 0 ? 'north' : 'south'] = { steps: steps, dead: dead, longest: longest, first: first };
      }
      return out;
    });
    ok('there is a long straight street in the valley to walk the pavement of', sw.found);
    if (sw.found) {
      const n = sw.sides.north, s = sw.sides.south;
      console.log('       ' + sw.cells + ' cells, ' + n.steps + ' tiles (' +
                  Math.round(n.steps * 0.75) + ' m) of pavement each side');
      ok('THE SIDEWALK IS IN HARMONY ALL THE WAY — both pavements of a ' +
         Math.round(n.steps * 0.75) + ' m street are ONE unbroken piece, end to end, ' +
         'measured on the surface he walks (north ' + n.dead + ' blocked, south ' +
         s.dead + ' blocked' +
         (n.first.length || s.first.length ? '; blockers: ' + n.first.concat(s.first).join(', ') : '') + ')',
         n.dead === 0 && s.dead === 0);
      ok('and the walk really was measured, not skipped — the longest unbroken piece is ' +
         'the whole street (' + n.longest + '/' + n.steps + ')',
         n.longest === n.steps && s.longest === s.steps);
    }

    /* ── THE MUTATION TEST ──────────────────────────────────────────────────────────
       "nudge one piece's lane offset by one pixel -> red". Everything above could be
       true of a checker that cannot see. So: shift the arterial generator's whole output
       one tile sideways, throw both caches away so the valley rebuilds, and re-run the
       IDENTICAL sweep. If the same-class count does not go red, this gate proves nothing
       and should be deleted rather than trusted. */
    const mutated = await p.evaluate(() => {
      const spec = BohemiaDistrictKit.get('arterial');
      if (!spec) return { ran: false };
      const orig = spec.generate;
      spec.generate = function (seed, o) {
        const res = orig.call(this, seed, o);
        if (res && res.g) for (let y = 0; y < res.g.length; y++) { res.g[y].unshift(res.g[y][0]); res.g[y].pop(); }
        return res;                                    // one tile east. one.
      };
      try { metaCache.clear(); __kitCache.clear(); } catch (e) {}
      const after = window.__CONTRACT();
      spec.generate = orig;
      try { metaCache.clear(); __kitCache.clear(); } catch (e) {}
      return { ran: true, sameBroken: after.sameBroken, sameClass: after.sameClass };
    });
    ok('THE MUTATION TEST: nudge one street piece one tile sideways and this gate goes ' +
       'red — it is measuring the tiles, not agreeing with itself ' +
       '(' + (mutated.ran ? mutated.sameBroken + ' of ' + mutated.sameClass + ' broken under mutation' : 'did not run') + ')',
       mutated.ran && mutated.sameBroken > 100);

    /* and the world is put back, so nothing downstream inherits a mutated valley */
    const restored = await p.evaluate(() => window.__CONTRACT().sameBroken);
    ok('and the mutation is undone — the page is left exactly as it was found ' +
       '(' + restored + ' broken after restore)', restored === R.sameBroken);

    ok('the page threw nothing while all of this ran', errs.length === 0);
    if (errs.length) errs.slice(0, 3).forEach(e => console.log('       ' + e.slice(0, 160)));
  } catch (e) {
    fail++; console.log('  FAIL harness: ' + (e && e.message ? e.message : String(e)));
  } finally { if (browser) await browser.close(); }

  console.log('\n' + (fail ? 'FAIL' : 'PASS') + '  ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
