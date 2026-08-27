// BOHEMIA ARTERIAL (7/26/26, WORLD lane) — THE MILE-GRID STREET CELL, BUILT FOR REAL.
//
// Paolo 7/26: "we need to actually build a fucking world." The census said where the
// hole was: of 9,216 valley cells, 3,386 (37%) are ROAD cells — arterial and freeway —
// and not one of them had a generator. They rendered as a flat grey slab. More of the
// valley was untextured road than was built district. This module builds the arterial
// half: 2,434 cells, the mile-grid streets every district in the game fronts onto.
//
// A road cell is not a district, it is a NETWORK TILE: it takes the set of directions
// whose neighbours are also road (N/S/E/W) and builds the corridor that serves them —
// a through street, a corner, a T, a 4-way intersection, a stub. All 16 masks build.
//
// REAL REFERENCE (Clark County / City of Las Vegas arterial standards, the actual
// cross-section you stand in out there, curb to curb and wall to wall):
//   100 ft right-of-way, 6 travel lanes (3 each way) at 12 ft
//   raised landscaped median separating the directions, opening to a left-turn pocket
//     at each intersection
//   8 ft outside shoulder / bike lane, curb and gutter
//   DETACHED sidewalk set behind an amenity strip (the Sun Belt norm, not a
//     curb-attached walk), streetlights in the amenity zone
//   overhead distribution poles down the parkway, signal mast arms at the corners
// AND NO BLOCK WALL AND NO SETBACK (Paolo 8/11, "THE STREETS DONT HAVE WALLS" and "the
// streets should FILL THE WHOLE FUCKING BOX"). The deep landscape setback belongs to the
// PARCEL NEXT DOOR, not to the street, so the corridor fills the whole 128-tile (96 m)
// cell edge to edge: median, six lanes each way to the curb, then a 9 m planted parkway
// carrying the trees and the poles, then a 4.5 m detached walk out to the boundary.
//
// LAWS HELD: SIDEWALK SANCTITY (a continuous walk wraps every corner; nothing but
// street furniture stands on it). LINE COLOR (Paolo 7/13): YELLOW separates opposing
// DIRECTION and appears only at the turn pocket where the median opens; WHITE divides
// lanes going the same way. WALKABLE-LAND: declared `vehicular:true` — a street IS its
// vehicle surface — and still dressed, never a void. 45 DEGREE ART is a paint-time law
// and does not apply to a tile grid. Act-1 DEAD: signals dark, lights dead, faded
// paint, dead palms, a car left at the curb.
//
// LEGEND:
//  0 dirt shoulder  1 asphalt roadway  2 white lane line  3 crosswalk  4 raised median
//  5 curb+gutter    6 sidewalk         7 parkway          [8 RETIRED]  9 streetlight
// 10 power pole    11 dead palm/shrub 12 signal mast     13 bus stop  14 dead car
// 15 stop bar      16 storm drain     17 yellow turn-pocket line
(function (root) {
  var K = (typeof module !== 'undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit !== 'undefined' ? BohemiaDistrictKit : root.BohemiaDistrictKit);

  var C = 64;          // cell centre (128x128)
  /* THE JUNCTION IS AS WIDE AS THE ROAD THAT MAKES IT, AND FOR FIFTEEN DAYS IT WAS NOT.
     This read `var BOX = 46;` with the comment "(tracks CURB)" sitting right on it. It did
     not track anything -- it was a literal, typed once on 8/11 to match a CURB of 46, and
     the moment the cross-section moved it was just a number that used to be right. That is
     the third time in this one file that A CONSTANT MOVED AND ITS DEPENDENT STAYED BEHIND
     (the poles at SET-2, the bus stop guard, this), and it is why a comment claiming a
     relationship is worth nothing next to code that expresses it.
     IT COST THE WHOLE FIX ITS PICTURE. The cross-section was rebuilt to real Clark County
     numbers, every gate went green, and the photograph of a junction came back PIXEL
     IDENTICAL -- because the junction box was still 92 tiles across, swallowing the median,
     the lane lines, the kerb and the walk for 69 m in every direction. A FIX THAT CHANGES
     NO PIXELS IS NOT A FIX; the picture is what caught it, not the gates.
     Declared below the cross-section now, derived, where it cannot drift again. */
  // WALL TO WALL, EDGE TO EDGE (fixed 7/26 after looking at the real map render). The
  // corridor first stopped at a 42-tile half-width and left 20 tiles of bare dirt out to
  // the cell edge, so on the map every street floated in a black moat between the
  // districts it was supposed to join. In the real valley the tract's BLOCK WALL is the
  // property line: the corridor runs right up to it and the next parcel starts on the
  // other side. So the right-of-way now fills the cell and the wall lands on the cell
  // boundary, which is exactly where the neighbouring district's own edge begins.
  // 64, NOT 63. With the centreline at C=64 a half-width of 63 covers offsets 0..63, which
  // is rows 1..127 -- it MISSES ROW ZERO AND COLUMN ZERO, so two road cells side by side had
  // a one-tile seam of bare dirt between their pavements. Found by truncation_gate.js on its
  // first real run, after Paolo made me render an actual top-down grid. An off-by-one at a
  // cell boundary is invisible in any single cell and shows up only where cells meet.
  var ROW = 64;        // half-width of the whole corridor: the wall sits on the cell edge

  // cross-section, as distance OUT from the road's centreline (in tiles, 0.75 m each)
  // THE STREET FILLS THE BOX (Paolo 8/11, LOCKED): "the streets should FILL THE WHOLE
  // FUCKING BOX ABSOLUTELY... THE STREETS DONT HAVE WALLS."
  //
  // WHAT WAS ACTUALLY WRONG, seen for the first time as a real top-down grid: the corridor
  // already ran wall to wall (ROW 63), but only 21 of those 63 tiles each side were PAVED.
  // The other 33 were LANDSCAPE SETBACK -- twenty-five metres of dead lawn per side, wider
  // than the road itself -- and then a BLOCK WALL sat on the cell boundary. So a street
  // cell was a thin ribbon of asphalt in a field, fenced. That is what he has been looking
  // at and shouting about, and no drawing or reframing was ever going to fix it, because
  // the defect was in the GENERATED GRID, not in the picture of it.
  //
  // A REASONABLE FUN INTERPRETATION OF THE ACTUALLY WALKABLE GRID (his words). Grounded:
  // a real Vegas arterial right-of-way is roughly 100-120 ft of pavement, curb and walk,
  // and the deep setback belongs to the PARCEL NEXT DOOR -- it is that district's ground,
  // not the street's. This cell is the street, so the street gets the cell: travel lanes,
  // turn lanes and parking out to the curb, then amenity and walk, then a narrow margin.
  /* *** AND THEN IT WENT TOO FAR THE OTHER WAY, AND HE SAW IT (Paolo 8/26). ***
     "I really need you to fix the streets, make them line up together ... especially in
      the run, and it's looking like dog shit. You wanna have these big ass sidewalks."
     MEASURED THE DAY HE SAID IT, on the real page, standing on an arterial: the ENTIRE
     PHONE SCREEN was one featureless grey field with a single traffic signal in it. Not a
     road. A car park with a lamp post.
     THE NUMBERS SAY THE SAME THING. The 8/11 pass killed 33 tiles of dead lawn per side by
     making everything roadway, and the result was:
         curb to curb   69.0 m   (226 ft)
     A Clark County arterial right-of-way is 100 to 120 FEET TOTAL, of which about 25 m is
     curb to curb. *** OURS WAS 2.7x THE REAL THING. *** At the zoom he plays at, one phone
     screen is about 20 m, so every screen he walked was interior asphalt: no kerb, no
     median, no lane line, no walk. There was nothing in frame that could tell him which way
     the street ran, which is EXACTLY his other sentence -- "if it's going north to south,
     the street goes north to south ... right now it's not doing that".
     THE 8/11 RULING IS NOT REVERSED. "THE STREETS SHOULD FILL THE WHOLE FUCKING BOX" and
     "THE STREETS DONT HAVE WALLS" both still hold: the cell is full, boundary to boundary,
     and no wall is coming back. What changes is WHAT FILLS IT. A 96 m cell cannot be 96 m
     of asphalt, because a 96 m road does not exist. It is a real 43 m right-of-way with
     REAL FRONTAGE either side -- the parcel apron that lines every mile-grid arterial in
     the valley -- which is dressed ground you can walk on, not lawn and not more asphalt. */
  var MEDIAN = 3;      // 0..3   raised median island, 3.0 m
  var PAVE = 17;       // 4..17  10.5 m per side: 3 travel lanes at 3.5 m
  var CURB = 19;       // 18..19 curb + gutter, 1.5 m
  // THE SURPLUS WIDTH BELONGS TO THE PARKWAY, NOT TO THE SIDEWALK (8/20).
  // The 8/11 rewrite deleted the deep setback and ran the walk to the cell boundary,
  // which was right about the boundary and wrong about what fills it: AMEN 52 / WALK 63
  // gave the amenity strip 6 tiles (4.5 m) and the SIDEWALK TWELVE (9 m). Nine metres
  // of blank concrete per side, wider than two travel lanes, 2,944 tiles -- 18% of the
  // whole cell -- and it is the biggest single thing you look at on the most-walked
  // cell type in the game. A detached walk in Clark County is FIVE FEET (1.5 m) and the
  // standard is explicit that nothing above ground stands on it; the width goes to the
  // parkway, which is where the trees, the poles and the lights are required to be.
  // It is also what Paolo asked for in the first place -- "SIDE A LITTLE, THEN STREET"
  // (8/11): a 9 m sidewalk is not "a little", it is the widest single band outside the
  // roadway. Major Vegas arterials carry 10-20 ft of landscaped parkway and a narrow
  // meandering walk behind it, so the surplus goes where the real one puts it.
  var AMEN = 25;       // 20..25 PARKWAY, 6 tiles / 4.5 m: trees, poles, lights, stops
  var WALK = 28;       // 26..28 DETACHED sidewalk, 3 tiles / 2.25 m
  /* RIGHT-OF-WAY ENDS AT 28: 28 x 2 x 0.75 = 42 m = 138 ft, a real six-lane arterial with
     a median, a planted parkway and a detached walk. Everything outside it is FRONTAGE. */
  var FRONT = 64;      // 29..64 THE PARCEL THAT FRONTS THE STREET, 36 tiles / 27 m
  var SET = 64;        // no margin: the street owns the cell
  var BOX = CURB;      // DERIVED. The junction is curb to curb, so it is the kerb offset.
  // AND NO BLOCK WALL. A street is public ground all the way to the boundary, so the
  // neighbouring district's own edge starts exactly where this cell stops.

  var LANE_A = 8, LANE_B = 13;   // white lane lines between same-direction lanes
  var EDGE = 21;                 // solid white edge line
  /* THE LEFT-TURN POCKET, AND THE SIXTH GUARD THAT COULD NOT BE TRUE (8/20).
     pocket() skips any row outside `oa >= BOX + 1 && oa <= POCKET`. BOX is 46 and POCKET
     was 30, so that condition reads "at least 47 and at most 30" -- EMPTY, at every seed,
     on every cell, since the day BOX grew with the pavement on 8/11. The yellow
     turn-pocket line is the only YELLOW on the whole street (LINE COLOR LAW, Paolo 7/13:
     yellow separates opposing DIRECTION and lives nowhere else here) and it has not been
     drawn once in nine days.
     A real left-turn bay is 150 ft of storage plus a 120 ft taper, call it 270 ft; 60
     tiles is 45 m, a conservative read of that, and it now starts where the intersection
     box ends instead of 16 tiles inside it. */
  /* THE CODES THAT STOP A BODY. Derived from the legend below rather than typed, so a new
     solid tile cannot quietly start standing on the pavement. (bus stop 13 is NOT here: it
     declares solid:false and is a pad you wait on.) */
  var BLOCKS = { 9: 1, 10: 1, 11: 1, 12: 1, 14: 1 };  // light, pole, dead palm, mast, car
  var POCKET = BOX + 60;         // DERIVED, same lesson as BOX: this was the literal 106,
                                 // which was BOX+60 on the day it was typed and nothing
                                 // afterwards. The bay runs 45 m back from the junction.

  function bandCode(b) {
    if (b <= MEDIAN) return 4;
    if (b <= PAVE) return 1;
    if (b <= CURB) return 5;
    if (b <= AMEN) return 7;
    if (b <= WALK) return 6;
    /* THE FRONTAGE (8/26). Everything past the back of the walk is the parcel that fronts
       the street: decomposed granite, which is what the valley is actually surfaced with
       between a sidewalk and whatever is behind it. It is DRESSED further down (the apron
       and its stalls, the dead oleander), never left as a bare field -- that was the
       8/11 complaint and it is not being repeated in a new colour. */
    if (b <= FRONT) return 19;
    /* AND THE LAST TILE IS WALK, NOT WALL (8/19). This read `if (b <= ROW) return 8`, and
       with WALK = SET = 63 and ROW = 64 that is EXACTLY ONE COLUMN -- b === 64, which is
       ox === -64, THE WEST EDGE OF EVERY ARTERIAL CELL. A one-tile block wall, 128 tiles
       tall, down the west side of all 2,434 of them.
       It contradicted this module's own comment forty lines up -- "AND NO BLOCK WALL. A
       street is public ground all the way to the boundary" -- which is Paolo 8/11: "THE
       STREETS DONT HAVE WALLS." The 8/11 pass widened ROW from 63 to 64 to kill a one-tile
       DIRT seam between neighbouring road cells and left this row behind, so the seam
       became a WALL instead of a gap.
       IT WAS INVISIBLE UNTIL 8/18, when the walked surface stopped drawing streets from its
       own four-number table and started drawing them from this module. Measured after that:
       flooding the valley from the player's spawn reached THREE CELLS OF 9,216, because you
       cannot cross a street westward anywhere in the game. Paolo 8/1, LOCKED: "the streets
       have to touch the streets bro... make sure I cant be locked in any certain district
       ever again."
       The sidewalk runs to the boundary. That is all this line ever needed to say. */
    if (b <= ROW) return 6;
    return 0;
  }

  /* THE NETWORK TILE. links = the directions whose neighbour cell is also road. The
     corridor is painted from the band coordinate: for any tile, the distance to the
     nearest centreline that actually serves it. min() over the served axes is what
     makes a corner work — a tile is pavement if EITHER road's pavement reaches it,
     and the curb / walk / wall bands wrap the corner for free. */
  function generate(seed, opts) {
    opts = opts || {};
    var links = opts.links || opts.streets || ['N', 'S'];
    var set = {}; links.forEach(function (d) { set[String(d).toUpperCase()[0]] = 1; });
    if (!set.N && !set.S && !set.E && !set.W) { set.N = set.S = 1; }
    var hasN = !!set.N, hasS = !!set.S, hasE = !!set.E, hasW = !!set.W;
    var vert = hasN || hasS, horiz = hasE || hasW;

    var G = K.grid(seed >>> 0), g = G.g, r = G.rnd, x, y, i;

    // does the N-S roadway reach this row / the E-W roadway reach this column?
    function coverV(oy) { return vert && (oy <= 0 ? (hasN || oy >= -BOX) : (hasS || oy <= BOX)); }
    function coverH(ox) { return horiz && (ox <= 0 ? (hasW || ox >= -BOX) : (hasE || ox <= BOX)); }

    function bandAt(ox, oy) {
      var b = 1e9;
      if (coverV(oy)) b = Math.min(b, Math.abs(ox));
      if (coverH(ox)) b = Math.min(b, Math.abs(oy));
      return b;
    }

    // ---- 1. the corridor itself ------------------------------------------------
    var inPave = function (ox, oy) { return Math.abs(ox) <= BOX && Math.abs(oy) <= BOX; };
    for (y = 0; y < 128; y++) {
      var oy = y - C;
      for (x = 0; x < 128; x++) {
        var ox = x - C;
        var b = bandAt(ox, oy);
        if (b > ROW) continue;                       // dirt shoulder, left as 0
        var code = bandCode(b);
        // inside the intersection box the median must not block the crossing road
        if (code === 4 && vert && horiz && inPave(ox, oy)) code = 1;
        g[y][x] = code;
      }
    }

    // ---- 2. markings -----------------------------------------------------------
    // WHITE divides lanes travelling the same way; dashed, 6 on 6 off, so the eye
    // reads movement even on a dead street.
    function laneLine(alongAxis) {
      for (var t = 0; t < 128; t++) {
        var oa = t - C;
        // NEVER STRIPE THROUGH THE JUNCTION -- BUT ONLY IF THERE IS ONE. A cell with legs
        // in one axis only is a RUN: no junction, nothing to keep clear, and the dashes
        // must carry the whole length or the road reads as two stubs with a blank middle.
        // (Which is exactly what it did the moment BOX widened with the pavement: a 46-tile
        // box swallowed 72 of the 128 rows and the middle of every street went unstriped.)
        if (vert && horiz && Math.abs(oa) <= BOX) continue;
        if (alongAxis === 'v' && !coverV(oa)) continue;
        if (alongAxis === 'h' && !coverH(oa)) continue;
        var dash = (Math.floor((t % 12) / 6) === 0);
        [LANE_A, LANE_B].forEach(function (o) {
          [-o, o].forEach(function (s) {
            if (!dash) return;
            var px = alongAxis === 'v' ? C + s : t, py = alongAxis === 'v' ? t : C + s;
            if (g[py][px] === 1) g[py][px] = 2;
          });
        });
        [-EDGE, EDGE].forEach(function (s) {                 // solid edge line
          var px = alongAxis === 'v' ? C + s : t, py = alongAxis === 'v' ? t : C + s;
          if (g[py][px] === 1) g[py][px] = 2;
        });
      }
    }
    if (vert) laneLine('v');
    if (horiz) laneLine('h');

    // THE TURN POCKET. The median stops short of the intersection and the opening
    // becomes a left-turn bay: two YELLOW lines, the only yellow on the street,
    // because that is the one place opposing directions meet with no island between
    // them (LINE COLOR LAW: yellow = direction, and it lives nowhere else here).
    function pocket(alongAxis, dirSign) {
      for (var t = 0; t < 128; t++) {
        var oa = t - C;
        if (dirSign > 0 ? (oa < BOX + 1 || oa > POCKET) : (oa > -BOX - 1 || oa < -POCKET)) continue;
        for (var o = -MEDIAN; o <= MEDIAN; o++) {
          var px = alongAxis === 'v' ? C + o : t, py = alongAxis === 'v' ? t : C + o;
          g[py][px] = (Math.abs(o) === MEDIAN) ? 17 : 1;     // yellow border, bay inside
        }
      }
    }
    if (vert && horiz) {
      if (hasN) pocket('v', -1);
      if (hasS) pocket('v', 1);
      if (hasE) pocket('h', 1);
      if (hasW) pocket('h', -1);
    }

    // CROSSWALKS + STOP BARS at every approach that exists, only at a real crossing.
    function approach(dir) {
      var vertical = (dir === 'N' || dir === 'S'), sign = (dir === 'S' || dir === 'E') ? 1 : -1;
      for (var o = -EDGE; o <= EDGE; o++) {
        for (var d = BOX - 3; d <= BOX; d++) {                 // the ladder bars
          var a = C + sign * d;
          var px = vertical ? C + o : a, py = vertical ? a : C + o;
          if (g[py][px] === 1 || g[py][px] === 2) g[py][px] = ((o + 64) % 4 < 2) ? 3 : g[py][px];
        }
        var sa = C + sign * (BOX + 2);                          // the stop bar behind it
        var sx = vertical ? C + o : sa, sy = vertical ? sa : C + o;
        if (g[sy][sx] === 1) g[sy][sx] = 15;
      }
      /* CURB RAMPS. Without these the crosswalk dies at the gutter and a body on the
         sidewalk can never legally reach the other side of the street: the gate caught
         exactly that. The ramp carries the crossing up over the curb and the amenity
         strip to the walk, which is what the corner actually looks like out there. */
      for (var e = 0; e < 2; e++) {
        var side = e ? 1 : -1;
        for (var band = CURB - 1; band <= WALK; band++) {
          for (var d2 = BOX - 3; d2 <= BOX; d2++) {
            var a2 = C + sign * d2, o2 = side * band;
            var rx = vertical ? C + o2 : a2, ry = vertical ? a2 : C + o2;
            if (rx < 0 || ry < 0 || rx > 127 || ry > 127) continue;
            var cc = g[ry][rx];
            /* AND IT NEVER PAINTS OVER THE ROADWAY (8/26, STREET CONTRACT). `cc === 1 ||
               cc === 2` was in this list, so the ramp could convert asphalt and lane
               lines. At a crossing the ramp runs the full parkway-and-walk width out from
               the corner -- twenty tiles -- and at the far end of that run it arrives on
               the PERPENDICULAR street's carriageway, right at the cell boundary. It ate
               two tiles off each side of the crossing street exactly where that street
               hands over to the next cell, so the corridor read 22..106 on the crossing
               and 20..108 on the straight run beside it and the two did not agree about
               where the road was. That is 1,138 of the valley's 4,497 road seams, the
               biggest single class of them.
               A curb ramp crosses the gutter, the parkway and the walk. It does not cross
               the travel lane -- the ladder crosswalk above already carries the crossing
               over the roadway, so nothing is lost by saying so. */
            if (cc === 5 || cc === 7 || cc === 6) g[ry][rx] = 18;
          }
        }
      }
    }
    if (vert && horiz) {
      ['N', 'S', 'E', 'W'].forEach(function (d) { if (set[d]) approach(d); });
    }

    /* ---- 3. street furniture (act-1 DEAD) -------------------------------------
       AND FOR NINE DAYS THERE WAS NONE OF IT (8/20). This block ran every bake and
       placed almost nothing: a 96 x 96 m arterial cell -- the most-walked cell type
       in the game, 2,434 of the valley's 9,216 -- carried TWO OBJECTS. Eleven of
       this module's eighteen legend codes were never emitted once. The dossier
       promised a street and the generator made an empty slab.

       THREE SEPARATE CAUSES, all the same shape, and it is the shape that keeps
       biting this file: A CONSTANT MOVED AND ITS DEPENDENTS STAYED BEHIND.

       (a) THE POLES AND THE TREES WERE THROWN AT THE SIDEWALK. put() only writes
           over code 7, the amenity strip, which the 8/11 "streets fill the box"
           rewrite narrowed to offsets 47..52. The poles were placed at SET-2 = 61
           and the palms at AMEN+4.. = 56..61, which were deep landscape SETBACK
           before that rewrite and are SIDEWALK after it. bandCode(61) is 6. So
           every pole and every tree was computed, handed to put(), and silently
           dropped -- 100% of them, every bake since 8/11.
       (b) THE LIGHTS WERE CLIPPED BY A JUNCTION THAT IS NOT THERE. `if
           (Math.abs(t - C) <= BOX) continue` skips the intersection box, but BOX is
           46, so it skips t = 18..110 -- 93 of 128 rows -- leaving exactly t = 6 and
           t = 126. Two lights. On a RUN cell there is no junction to keep clear.
           This is the IDENTICAL bug the lane-striping loop forty lines up was
           already fixed for, with the comment "NEVER STRIPE THROUGH THE JUNCTION --
           BUT ONLY IF THERE IS ONE." The fix did not travel down the file.
       (c) NOBODY EVER PLACED THE REST. bus stop, dead car and storm drain inlet
           have legend entries and act-1 flavour text written for them and no code
           anywhere that emits them on a run.

       THE SPACINGS ARE REAL, not eyeballed. Sources: Clark County Fire hydrant
       guideline (arterials of 4+ lanes over 30,000 vpd) and standard roadway
       lighting practice, cross-checked 8/20:
         streetlights   350-500 ft between successive heads, STAGGERED on alternate
                        sides, "approximately every other utility pole"
         power poles    consequently ~175-250 ft, so every other pole carries a head
         street trees   20-30 ft on centre in the amenity zone (Clark County requires
                        the zone planted; in act 1 most of them are dead or gone)
         bus stops      RTC arterial stops run about a quarter mile, so roughly one
                        cell in four has one -- seeded, not on every cell
       And nothing above ground stands on the walk itself: Clark County is explicit
       that the 5 ft sidewalk stays clear and the furniture lives in the amenity
       zone. That is now also the only band put() can reach, which is the correct
       accident.
       TILE = 0.75 m, so 1 ft = 0.4 tiles and the cell is 128 tiles = 96 m.        */
    /* *** NOTHING BLOCKING EVER STANDS ON A SIDEWALK. *** (Paolo 8/26, LOCKED: "all the
       sidewalks should be connected altogether unless there's a crazy explosion or
       something's wrong. Most of the time the streets and the sidewalk should be in harmony
       all the way.") That is SIDEWALK SANCTITY read strictly, and it was being broken in a
       way no single-cell check could see. MEASURED by walking 5,376 tiles -- 4 km -- down
       the sidewalk of one arterial on the real page: it broke FOURTEEN times.
       WHERE IT BREAKS IS A CORNER. Furniture is placed in the PARKWAY and the parkway is
       code 7, so the placement predicate looked correct. But at a crossing the band is the
       MINIMUM over both axes, so a tile 20-25 tiles off the north-south road's centreline
       is parkway -- code 7 -- while ALSO sitting on the east-west road's SIDEWALK. Place a
       dead palm there and you have sealed the east-west walk with something the east-west
       road never put down. Same for the dead car the crossing street leaves parked across
       your pavement.
       So the guard is asked in TILE space, once, for every blocking thing this module
       places: is this tile inside EITHER road's walk band? If it is, it stays clear. */
    function onSomeonesWalk(px, py) {
      var ox = Math.abs(px - C), oy = Math.abs(py - C);
      if (horiz && oy > AMEN && oy <= WALK) return true;   // the east-west road's walk
      if (vert && ox > AMEN && ox <= WALK) return true;    // the north-south road's walk
      return false;
    }
    function put(px, py, code, over) {
      if (px < 0 || py < 0 || px > 127 || py > 127) return;
      var c = g[py][px];
      /* the walk-band guard applies to things that BLOCK. Markings, ramps and the walk's
         own furniture-free surface are not blocked by it -- they are not solid. */
      if (BLOCKS[code] && onSomeonesWalk(px, py)) return;
      if (over ? over(c) : (c === 7)) g[py][px] = code;
    }
    var onWalkable = function (c) { return c === 7; };
    // the amenity strip, in offsets: the one band that legally holds furniture
    var AM0 = CURB + 1, AM1 = AMEN;
    function amenityOffset(k) {                 // deterministic spot inside the strip
      return AM0 + (k % (AM1 - AM0 + 1));
    }
    // A JUNCTION ONLY BLOCKS THINGS IF THERE IS ONE (see (b) above).
    function inJunction(oa) { return vert && horiz && Math.abs(oa) <= BOX; }

    function furnishArm(alongAxis, coverFn) {
      function place(t, side, code, k) {
        var s = side * amenityOffset(k);
        put(alongAxis === 'v' ? C + s : t, alongAxis === 'v' ? t : C + s, code, onWalkable);
      }
      // POWER POLES: ~175 ft = 71 tiles per side, both sides, offset from each other
      // so the two runs of overhead do not line up across the road.
      var pi = 0;
      for (var u = 10; u < 128; u += 71, pi++) {
        if (!coverFn(u - C) || inJunction(u - C)) continue;
        place(u, -1, 10, 1);
        var u2 = u + 35;                                    // the opposite side, half a span on
        if (u2 < 128 && coverFn(u2 - C) && !inJunction(u2 - C)) place(u2, 1, 10, 1);
      }
      // STREETLIGHTS on every other pole (~350 ft), STAGGERED. The phase is taken from
      // the cell seed so consecutive cells continue the alternation instead of every
      // cell in the valley starting its stagger on the same side.
      var phase = (seed >>> 3) & 1;
      var li = 0;
      for (var t2 = 10 + (phase ? 35 : 0); t2 < 128; t2 += 142, li++) {
        if (!coverFn(t2 - C) || inJunction(t2 - C)) continue;
        place(t2, (li + phase) % 2 ? 1 : -1, 9, 5);
      }
      // and the mid-cell head, so a 96 m cell is not lit by one lamp at its corner
      var tm = 10 + (phase ? 35 : 0) + 71;
      if (tm < 128 && coverFn(tm - C) && !inJunction(tm - C)) place(tm, (phase ? -1 : 1), 9, 5);
      // STREET TREES: 20-30 ft on centre = 11 tiles, which is what Clark County requires
      // the parkway planted at. A palm base with its skirt, or an oleander clump, is
      // 1.5-2 m across -- so each one is a CLUMP of tiles, not a pixel. Act 1 keeps about
      // half of them; the rest are stumps and gaps, which is what a street nobody waters
      // looks like after ten years.
      for (var v = 4; v < 128; v += 11) {
        if (!coverFn(v - C) || inJunction(v - C)) continue;
        [-1, 1].forEach(function (side) {
          if (r() > 0.55) return;
          var t0 = v + (side > 0 ? 5 : 0);
          var k0 = 2 + ((v / 11) | 0) % 6;                  // its spot across the parkway
          for (var a = 0; a < 2; a++) for (var b2 = 0; b2 < 2; b2++) {
            place(t0 + a, side, 11, k0 + b2);
          }
        });
      }
    }
    if (vert) furnishArm('v', coverV);
    if (horiz) furnishArm('h', coverH);

    /* ---- 3b. THE FRONTAGE (8/26) -----------------------------------------------------
       Paolo 8/26: "it's looking like dog shit ... you can't just be doing one little niche
       thing at a time." The right-of-way now stops at 42 m like a real arterial, which
       leaves 27 m of parcel either side, and a bare 27 m is the SAME defect the 8/11 lawn
       was -- just a different colour. So the frontage is dressed with the thing that
       actually lines a mile-grid arterial out there: a pad-site apron with its stalls, its
       drive approach across the walk, and dead oleander on the granite between them.
       IT IS REACHABLE, WHICH IS THE POINT. The apron is drive surface, so it gets a real
       DRIVE APPROACH cut across the walk, the parkway and the kerb to the travel lane --
       one entrance, on the arm it fronts, which is the STREET-AWARE ACCESS LAW's own rule.
       An apron with no approach is 27 m of road a car can never touch, which is exactly
       what drive_network_gate exists to catch. */
    function frontage(alongAxis, coverFn) {
      var F0 = WALK + 3, F1 = FRONT - 4;          // granite margin stays at both edges
      var padLen = 34, halfPad = padLen >> 1;
      [-1, 1].forEach(function (side) {
        // ONE pad per side, at a deterministic spot along the cell, off the junction
        var at = 22 + Math.floor(r() * 84);
        if (!coverFn(at - C) || inJunction(at - C)) return;
        var t0 = Math.max(2, at - halfPad), t1 = Math.min(125, at + halfPad);
        var isGranite = function (c) { return c === 19 || c === 11; };
        for (var t = t0; t <= t1; t++) {
          for (var b = F0; b <= F1; b++) {
            var o = side * b;
            var px = alongAxis === 'v' ? C + o : t, py = alongAxis === 'v' ? t : C + o;
            put(px, py, 20, isGranite);
          }
          /* STALL STRIPES every 3 tiles = 2.25 m, which is a real 9 ft stall, and they run
             ACROSS the bay so the apron reads as parking and not as more road. */
          if ((t - t0) % 3 === 0) {
            for (var b2 = F0; b2 <= F0 + 7 && b2 <= F1; b2++) {
              var o2 = side * b2;
              var sx = alongAxis === 'v' ? C + o2 : t, sy = alongAxis === 'v' ? t : C + o2;
              put(sx, sy, 21, function (c) { return c === 20; });
            }
          }
        }
        /* THE DRIVE APPROACH: 8 tiles / 6 m wide, from the apron to the travel lane. It
           overwrites walk, parkway and kerb -- that is what a driveway does -- and stops
           at the asphalt, which is already drive surface. */
        var dc = Math.min(t1 - 4, Math.max(t0 + 4, at));
        for (var d = -4; d <= 3; d++) {
          /* FROM THE ASPHALT, NOT FROM THE KERB. This started at CURB, and the kerb band
             is TWO tiles -- so the tile between the approach and the travel lane stayed
             kerb and the whole apron read as unreachable: 61.3% drive reach, 2,100 tiles
             of parking a car could never enter. A driveway crosses the gutter. */
          for (var b3 = PAVE + 1; b3 <= F0; b3++) {
            var o3 = side * b3;
            var dx = alongAxis === 'v' ? C + o3 : dc + d, dy = alongAxis === 'v' ? dc + d : C + o3;
            /* THE WALK BAND KEEPS ITS OWN TILE, as a driveway apron: a body walks straight
               through it, a car drives across it. Everything else on the way -- gutter,
               parkway, granite -- is plain apron. */
            var isWalkBand = (b3 > AMEN && b3 <= WALK);
            put(dx, dy, isWalkBand ? 22 : 20,
                function (c) { return c === 5 || c === 6 || c === 7 || c === 19; });
          }
        }
      });
      /* AND DEAD OLEANDER ON THE GRANITE. Act-1 dead, sparse, deterministic: the parcel
         landscaping nobody has watered in thirty years. Clumps, not pixels -- the same
         rule the parkway trees follow, because a one-tile shrub reads as noise. */
      for (var v2 = 6; v2 < 126; v2 += 9) {
        if (!coverFn(v2 - C) || inJunction(v2 - C)) continue;
        [-1, 1].forEach(function (side) {
          if (r() > 0.4) return;
          var b4 = F0 + 2 + Math.floor(r() * Math.max(1, (F1 - F0 - 4)));
          for (var a = 0; a < 2; a++) for (var b5 = 0; b5 < 2; b5++) {
            var o4 = side * (b4 + b5);
            var gxp = alongAxis === 'v' ? C + o4 : v2 + a, gyp = alongAxis === 'v' ? v2 + a : C + o4;
            put(gxp, gyp, 11, function (c) { return c === 19; });
          }
        });
      }
    }
    if (vert) frontage('v', coverV);
    if (horiz) frontage('h', coverH);

    // signal mast arms on the four corners of a real intersection (heads dark)
    if (vert && horiz) {
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (q) {
        var px = C + q[0] * (CURB + 2), py = C + q[1] * (CURB + 2);
        put(px, py, 12, function (c) { return c === 7 || c === 6; });
      });
      // storm drain inlets in the gutter at each corner (where the valley actually floods)
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (q) {
        var px = C + q[0] * CURB, py = C + q[1] * (CURB - 6);
        if (g[py][px] === 5) g[py][px] = 16;
      });
    }

    /* THE BUS STOP AND THE DEAD CAR: GUARDS THAT COULD NEVER BE TRUE (8/20).
       Both of these were written, both ran every bake, and neither ever placed a
       single tile -- for a sharper version of the same fault as the streetlights.

         bus stop   bt = 26 + rnd*60  ->  26..85,  guarded by |bt - 64| > BOX(46),
                    which needs bt < 18 or bt > 110. The range and the guard DO NOT
                    INTERSECT. Not "rare": impossible, at every seed, forever.
         dead car   ct = 20 + rnd*80  ->  20..99,  guarded by |ct - 64| > BOX + 4,
                    which needs ct < 14 or ct > 114. Same.

       When BOX was small the two ranges overlapped and these worked. BOX grew with
       the pavement on 8/11 (to 46, so the guard now swallows 93 of 128 rows) and the
       ranges were never revisited. A dead branch that USED to be live is worse than
       one that never was, because the code reads as working and the legend keeps
       promising what it makes.

       And a run has NO JUNCTION TO AVOID, so the guard is inJunction() now, like
       everything else in this block. On a run they may sit anywhere.               */
    // BUS STOP: RTC runs arterial stops at about a quarter mile, so roughly one cell
    // in four carries one -- seeded off the cell, not placed on every block.
    if ((vert || horiz) && ((seed >>> 5) & 3) === 0) {
      var bAxis = vert ? 'v' : 'h', bt = 20 + Math.floor(r() * 88);
      var bs = (r() < 0.5 ? 1 : -1) * WALK;
      if (!inJunction(bt - C) && (bAxis === 'v' ? coverV(bt - C) : coverH(bt - C))) {
        for (i = -3; i <= 3; i++) {
          for (var bb = 0; bb < 2; bb++) {                    // a pad two tiles deep
            var boff = bs > 0 ? bs - bb : bs + bb;
            var px2 = bAxis === 'v' ? C + boff : bt + i, py2 = bAxis === 'v' ? bt + i : C + boff;
            put(px2, py2, 13, function (c) { return c === 6 || c === 7; });
          }
        }
      }
    }

    // A CAR LEFT DEAD AT THE CURB, in the parking lane, on most cells but not all.
    if (r() < 0.6) {
      var cAxis = vert ? 'v' : 'h', ct = 14 + Math.floor(r() * 100);
      var cs = (r() < 0.5 ? 1 : -1) * (PAVE - 2);
      if (!inJunction(ct - C) && (cAxis === 'v' ? coverV(ct - C) : coverH(ct - C))) {
        // 4.5 m x 1.8 m: six tiles by two, the canon car size laid on the asphalt
        for (i = 0; i < 6; i++) for (var j = 0; j < 2; j++) {
          var coff = cs > 0 ? cs - j : cs + j;
          var px3 = cAxis === 'v' ? C + coff : ct + i, py3 = cAxis === 'v' ? ct + i : C + coff;
          /* THROUGH THE SAME GUARD AS EVERYTHING ELSE. This line wrote the grid directly
             instead of going through put(), which is how the crossing street's dead car
             ended up parked across the other street's sidewalk -- a wreck is six tiles long
             and at a junction six tiles reaches out of the asphalt and onto the pavement. */
          if (px3 >= 0 && py3 >= 0 && px3 < 128 && py3 < 128 && g[py3][px3] === 1
              && !onSomeonesWalk(px3, py3)) g[py3][px3] = 14;
        }
      }
    }

    /* STORM DRAIN INLETS DOWN THE RUN, not only at the corners. Curb inlets sit at the
       low points and ahead of every crossing, and this valley floods hard enough that
       the flood-control district is the reason half the basins in the game exist -- an
       arterial with no inlet on it is a street that has never seen a monsoon. Roughly
       one per side per cell, in the gutter band where the water actually goes. */
    function inletsAlong(alongAxis, coverFn) {
      for (var q = 30; q < 128; q += 62) {
        if (!coverFn(q - C) || inJunction(q - C)) continue;
        [-1, 1].forEach(function (side) {
          for (var d = 0; d < 3; d++) {                        // a 2.25 m grate at the curb
            var off = side * CURB;
            var px4 = alongAxis === 'v' ? C + off : q + d, py4 = alongAxis === 'v' ? q + d : C + off;
            if (px4 < 0 || py4 < 0 || px4 > 127 || py4 > 127) continue;
            if (g[py4][px4] === 5) g[py4][px4] = 16;
          }
        });
      }
    }
    if (vert) inletsAlong('v', coverV);
    if (horiz) inletsAlong('h', coverH);

    /* ---- ACCESS. The wall was sealing the city out of its own street. A tract wall
       is not continuous in real life and it cannot be here: every edge that faces a
       district gets a break in the wall and an apron paved from that break across the
       setback to the sidewalk, so a body can leave its block, reach the walk, and
       cross. The districts centre their own gate on the shared edge (the kit's
       pedGate/denseFill always centre at n/2), so this centres too and the two meet.
       The route gate proves the whole chain: district -> apron -> walk -> crossing. */
    var access = opts.access || [];
    access.forEach(function (d) {
      d = String(d).toUpperCase()[0];
      var half = 7;                                  // a curb-cut wide enough to be a way in
      for (var o = -half; o <= half; o++) {
        for (var b = ROW; b >= WALK; b--) {          // from the wall inward to the walk
          var px, py;
          if (d === 'N') { px = C + o; py = C - b; }
          else if (d === 'S') { px = C + o; py = C + b; }
          else if (d === 'W') { px = C - b; py = C + o; }
          else { px = C + b; py = C + o; }
          if (px < 0 || py < 0 || px > 127 || py > 127) continue;
          var cur = g[py][px];
          if (cur === 8 || cur === 7 || cur === 11 || cur === 10 || cur === 9) g[py][px] = 6;
        }
      }
    });

    return { g: g, W: 128, H: 128, streets: links, links: links, access: access,
             gates: [], footprints: [] };
  }

  /* a vehicle can cross the cell on every direction the network says connects */
  function throughDrivable(res, links) {
    var g = res.g, drive = { 1: 1, 2: 1, 3: 1, 14: 1, 15: 1, 17: 1 };
    return links.every(function (d) {
      d = String(d).toUpperCase()[0];
      var i, hit = false;
      for (i = 0; i < 128; i++) {
        if (d === 'N' && drive[g[0][i]]) hit = true;
        if (d === 'S' && drive[g[127][i]]) hit = true;
        if (d === 'W' && drive[g[i][0]]) hit = true;
        if (d === 'E' && drive[g[i][127]]) hit = true;
      }
      return hit;
    });
  }

  var PALETTE = {
    /* CODE 0 IS A REAL TILE, NOT A VOID (8/4). Its legend names it and the plot draws
       it, but it had no colour here -- so every judging surface painted it MAGENTA,
       which is both a lie about the game and a PURPLE RESERVATION breach. */
    0: '#5a5140',
    1: '#33333c', 2: '#b3ab97', 3: '#b3ab97', 4: '#6f6a5e', 5: '#6b6b74', 6: '#8a8a92',
    7: '#6a5f47', 9: '#8f8676', 10: '#6a5f4a',
    /* THE DEAD PALM WAS GREEN, AND ACT ONE HAS NOTHING GREEN IN IT (8/26). #3a4520 is
       an olive, and on the real frame it reads as a healthy shrub -- little green blocks
       down a street where the irrigation died thirty years ago. bohemia_strip.js already
       had the right answer for the SAME CODE, 11, in its own palette (#4d4a38, a grey
       brown): two modules that deliberately share one code vocabulary were painting it
       two different colours, and only one of them was Act 1. Taking the strip's. */
    11: '#4d4a38', 12: '#6a6a72',
    13: '#5c5648', 14: '#55555f', 15: '#b3ab97', 16: '#4a4842', 17: '#b09a3a',
    /* THE RAMP IS THE SIDEWALK, CARRIED OVER THE CURB, so it takes the sidewalk's own
       concrete (6) rather than a new colour. REUSE-FIRST: nothing new is cooked for it.
       It used to be drawn in the crosswalk's white (#b3ab97), which is why every corner
       had fifteen metres of ladder paint across the planted parkway. */
    18: '#8a8a92',
    /* THE FRONTAGE. Granite takes the valley's own desert ground tone rather than a new
       colour; the apron is asphalt gone grey (lighter and flatter than the roadway, which
       is how you tell a parking lot from a street from across it); the stall stripe is the
       same worn white every other marking on this street already uses. REUSE-FIRST. */
    19: '#5a5140', 20: '#4a4a50', 21: '#b3ab97', 22: '#8f8f96'
  };

  var LEGEND = {
    0:  { name: 'dirt shoulder',      kind: 'ground',   act1: 'the bare graded dirt between the block wall and the neighbouring lot' },
    1:  { name: 'asphalt roadway',    kind: 'drive',    act1: 'six lanes of cracked asphalt, patched and sun-bleached' },
    2:  { name: 'white lane line',    kind: 'marking',  act1: 'faded white lane line, dashed between lanes going the same way' },
    3:  { name: 'crosswalk',          kind: 'marking',  act1: 'ladder crosswalk across the approach, half worn off' },
    4:  { name: 'raised median',      kind: 'ground',   act1: 'raised concrete median island, dead landscaping and gravel', solid: false },
    5:  { name: 'curb + gutter',      kind: 'ground',   act1: 'concrete curb and gutter, silt and dead leaves packed in it' },
    6:  { name: 'sidewalk',           kind: 'walk',     act1: 'detached concrete sidewalk, cracked and lifted at the joints' },
    7:  { name: 'landscape strip',    kind: 'ground',   act1: 'decomposed granite amenity and setback strip, irrigation long dead' },
    /* CODE 8, THE BLOCK WALL, IS RETIRED (8/20) AND ITS NUMBER IS LEFT EMPTY ON PURPOSE.
       Paolo 8/11: "THE STREETS DONT HAVE WALLS." The band that drew it went on 8/11 and
       the one column that survived that pass sealed the player into a single cell until
       8/19 -- flooding the valley from spawn reached THREE of 9,216 tiles. Leaving a
       legend entry called 'block wall' on a STREET type is an open invitation to put it
       back, and the dossier is supposed to describe the world that exists. Gone. */
    9:  { name: 'streetlight',        kind: 'prop',     act1: 'cobra-head streetlight on the amenity strip, head dark' },
    10: { name: 'power pole',         kind: 'prop',     act1: 'overhead distribution pole down the setback, lines sagging' },
    11: { name: 'dead palm / shrub',  kind: 'tree-dead',act1: 'dead palm stump and dry oleander left in the setback' },
    12: { name: 'signal mast',        kind: 'prop',     act1: 'traffic signal mast arm on the corner, every head dark' },
    /* solid:false ADDED 8/26, AND IT WAS ALWAYS WRONG WITHOUT IT. A transit stop is a PAD
       you stand on waiting for a bus that is not coming; the bent frame over it is not a
       wall. roadcell_gate has counted this tile as part of the unbroken sidewalk since the
       day it was written -- and the kit defaults a `structure` to SOLID, so the walk it was
       certifying ran straight through a body-blocking tile twice per cell. Nothing caught
       it until the walk check was made to prove that every code it counts is standable by
       the kit's own model. The kit models solidity PER TILE for exactly this (hazard_gate,
       8/18: a solid:false in a legend is the author declaring a body may stand there). */
    13: { name: 'bus stop',           kind: 'structure',act1: 'transit stop pad with a bent shelter frame, the ad panel long gone', solid: false },
    14: { name: 'dead car',           kind: 'vehicle',  act1: 'a car left at the curb, tyres flat, glass gone' },
    15: { name: 'stop bar',           kind: 'marking',  act1: 'wide white stop bar behind the crosswalk' },
    16: { name: 'storm drain inlet',  kind: 'ground',   act1: 'curb inlet to the flood system, grate half choked with silt' },
    17: { name: 'yellow turn-pocket line', kind: 'marking', act1: 'yellow line bordering the left-turn bay where the median opens' },
    /* A CURB RAMP IS PAVEMENT YOU WALK ON, NOT PAINT ON A ROAD (8/26, STREET CONTRACT).
       The ramp used to be drawn with code 3, the ladder crosswalk, which is kind
       `marking` -- and a marking is DRIVABLE everywhere in this codebase (the kit counts
       it as a conductor, the drive network drives over it, the street contract measures
       the corridor by it). The ramp runs from the curb line right out to the cell
       boundary across the whole parkway, so every corner of every arterial crossing was
       declaring FIFTEEN METRES of planted parkway to be roadway. MEASURED: 1,138 of
       4,497 road-to-road seams in the valley read a corridor two tiles wider on the
       crossing side than on the straight run beside it -- the single biggest reason two
       arterials did not agree about where the street was.
       It is a ramp. You walk up it. `walk` is what it always was. */
    18: { name: 'curb ramp',          kind: 'walk',     act1: 'concrete curb ramp cut through the gutter and carried across the parkway to the walk' },
    /* THE FRONTAGE (8/26). The right-of-way stops at 42 m; the parcel that fronts the
       street is what fills the rest of the cell, and out there that is decomposed granite
       with a pad-site apron cut into it. Named so it reads as GROUND you cross, not as a
       setback nobody may enter -- there is no wall and there never will be (Paolo 8/11). */
    19: { name: 'frontage granite',   kind: 'ground',   act1: 'decomposed granite across the parcel frontage, raked into drifts by thirty years of wind' },
    20: { name: 'pad-site apron',     kind: 'drive',    act1: 'the parking apron of the pad site fronting the street, asphalt gone grey and split at the joints' },
    21: { name: 'stall stripe',       kind: 'marking',  act1: 'a parking stall stripe on the apron, worn down to a ghost of itself' },
    /* A DRIVEWAY DOES NOT CUT THE SIDEWALK IN HALF (8/26). The first cut of the frontage
       laid the drive approach straight over the walk as plain apron, and roadcell_gate went
       red on exactly the right claim: the longest unbroken walk on each side fell from 720
       tiles to 282, because a car park entrance had eaten a hole in the pavement twice per
       cell. OUT THERE THE WALK IS CARRIED THROUGH THE APPROACH AT GRADE -- Clark County
       requires it -- and a body walks over it while a car drives across it.
       `gate` is the kit's own word for exactly that: "A GATE IS THE HOLE YOU DRIVE THROUGH",
       already a drive conductor and already standable ground. One tile, both jobs, no new
       concept invented. */
    22: { name: 'driveway apron',     kind: 'gate',     act1: 'the concrete drive approach where the parking lot crosses the walk, cracked in a fan from thirty years of turning wheels', solid: false }
  };

  var NOTES = {
    summary: 'The mile-grid arterial street cell: a real six-lane divided Las Vegas arterial with a raised median, detached sidewalks behind an amenity strip, block walls, and a full signalised intersection when two arterials cross. 2,434 cells of the valley are this.',
    reference: [
      'Clark County / City of Las Vegas arterial standard: 100 ft right-of-way, 6 travel lanes at 12 ft, raised landscaped median, 8 ft outside shoulder / bike lane, curb and gutter.',
      'Sun Belt norm: DETACHED sidewalk set behind an amenity strip (not curb-attached), streetlights in the amenity zone, landscape setback, then the 6 ft CMU block wall that backs every residential tract in the valley.',
      'The median opens to a left-turn bay at each intersection; that bay is the only place opposing directions meet without an island between them, which is exactly where the yellow lives.'
    ],
    layout: [
      'The corridor is 85 tiles (64 m) wall to wall inside the 96 m cell: median, three lanes each way, shoulder, curb and gutter, amenity strip, detached sidewalk, landscape setback, block wall.',
      'It is a NETWORK TILE, not a district: it takes the directions whose neighbours are also road and builds what serves them. All sixteen masks build, so a through street, a corner, a T, a 4-way and a stub all come out of one generator.',
      'At a real crossing the median stops short, the opening becomes a yellow-bordered left-turn bay, ladder crosswalks and stop bars land on all four approaches, and signal mast arms stand on the four corners.',
      'Street furniture is act-1 dead: cobra-head lights out, signal heads dark, dead palms in the setback, a car left at the curb, silt in the storm inlets.'
    ],
    circulation: 'Traffic runs through on every connected direction (proven cell-edge to cell-edge by the gate). Pedestrians get a continuous DETACHED sidewalk that wraps every corner and crosses at the marked crosswalks; the walk is unbroken across the cell, so a body can walk from any district on one side to any district on the other.',
    layering: 'GROUND (flat, walk or drive): the roadway (1), every marking (2, 3, 15, 17), the curb and gutter (5), the storm inlet (16), the landscape strips (7), and the raised median (4) which is a low island you can step onto, not a blocker. WALK: the detached sidewalk (6). STRUCTURE (blocks, ¾ face): the bus stop shelter (13), the only mass on the cell -- the block wall was retired 8/20 under the 8/11 ruling that streets do not have walls. PROPS (solid): streetlight (9), power pole (10), signal mast (12), dead car (14), dead palm (11). PORTALS: none, a street cell has no interior. There is no hard edge: the corridor is public ground out to the cell boundary, which is exactly where the next parcel begins, so a body can always cross.',
    decisions: [
      'CONFORMS TO THE VISUAL CONSTITUTION (7/26). Built during the freeze and shipped\n       flagged provisional; the moment Paolo ruled the target screen CBB this palette was\n       measured against records/target/BOHEMIA_VISUAL_CONSTITUTION.json and brought inside\n       its layer value bands. Road paint and the lake ring were the only things out, and\n       they were wrong on their own terms too: act-1 paint is filthy, not clean white.\n       Locked by the CONSTITUTION CONFORMANCE section of this module\'s gate.',
      'ACT TRIPTYCH: only the act-1 dead material is specified. The act-2 recovering and\n       act-3 rebuilt variants are [PENDING Paolo] content, not mine to invent.',
      'Paolo 7/26: "we need to actually build a fucking world." The census found 37% of the valley was road cells with no generator at all. This is the arterial half of that hole.',
      'A road cell is NOT an auto-district: it never becomes faction territory, an economy district or a quest address. It registers as a SURFACE, so the world renders it and bodies walk it, while everything that counts districts still counts only real districts.',
      'vehicular:true under the WALKABLE-LAND LAW: a street is the one thing whose vehicle surface IS the venue. It is still dressed (walls, walks, furniture, plantings), never a void.',
      'LINE COLOR LAW held exactly: white divides lanes going the same way, yellow appears only at the left-turn bay where the median opens and opposing directions actually meet.',
      'Act-1 DEAD throughout: nothing lit, nothing living, nothing maintained.'
    ]
  };

  /* A STRAIGHT RUN AND A CROSSING ARE TWO DIFFERENT THINGS (Paolo 8/11, LOCKED):
     "FIX THAT ARTERIAL AND ARTERIAL INTERSECTION ARE DIFFERENT! 2 DIFFERENT ITEMS AND
      ICONS!!  ...  Depending on the direction of the road the sidewalks should be on the
      end and the street fills the rest."

     THE GENERATOR ALREADY KNEW. `generate` has always branched on `links`: give it N/S and
     it lays a straight six-lane run with a continuous raised median; give it all four and
     the median stops short for a left-turn bay, ladder crosswalks and stop bars land on
     every approach, and signal mast arms stand on the four corners. That code is untouched.

     WHAT WAS WRONG IS THAT BOTH SHAPES SHARED ONE REGISTERED TYPE, so the ICON LAW gave the
     pair a single icon and the map drew a crossing where a straight road was, and a
     straight road where a crossing was. He is looking at a city builder that SMART-SNAPS
     the two and he is right that ours could not, because ours did not have two things to
     snap between.

     So the crossing is its own registered type with its own legend and its own icon. It is
     the SAME generator and the SAME palette -- one canonical body, per ENGINE SYNC LAW --
     asked the other question. `arterial` is now unambiguously THE RUN: sidewalks down the
     two long edges, roadway filling everything between them, no crosswalks, no signals. */
  K.register('arterial', {
    generate: function (seed, opts) {
      opts = opts || {};
      // THE RUN, AND IT ALWAYS RUNS THROUGH. Callers pass {streets:['S']} to mean "this
      // district fronts onto a street on its south side" -- correct for a LOT, nonsense for
      // a street CELL, and it is why the top third of every arterial grid was bare dirt with
      // a hard edge across it: one leg meant the roadway stopped half a cell short. A street
      // that dead-ends inside a block is not a street. Both legs, always.
      //
      // *** BUT BOTH LEGS OF **WHICH AXIS**. (Paolo 8/25 PLAYTEST DISPATCH, LOCKED: "IM SICK
      // OF PLAYING THIS RUN AND NONE OF THE STREETS CONNECT EVER".) This line read
      // `o.links = ['N','S']` -- it forced both legs AND it forced the AXIS, so EVERY
      // ARTERIAL IN THE VALLEY WAS A NORTH-SOUTH ROAD however it actually ran. Measured on
      // the built valley before touching it: 921 road cells (26.1% of every road cell in the
      // game, 907 of them arterials) are built along an axis the world does not connect them
      // on, and 23.7% of road-to-road seams lose drive surface at the join -- the worst of
      // them 93 rows of 128, which is an arterial's SIDEWALK MARGIN butted against the next
      // arterial's CARRIAGEWAY. That is his sentence, in tiles.
      // The world already knew: roadAxis() reads the run and kitRoadLegs() hands over
      // links:['E','W'] for an east-west arterial. It was correct all along and this line
      // threw it away. Now the AXIS comes from the caller and only the BOTH-LEGS rule is
      // forced, which is what the paragraph above was actually about.
      var o = {}; for (var k in opts) o[k] = opts[k];
      var give = opts.links || opts.streets || [];
      var s = {};
      for (var gi = 0; gi < give.length; gi++) s[String(give[gi]).toUpperCase().charAt(0)] = 1;
      var wantV = !!(s.N || s.S), wantH = !!(s.E || s.W);
      if (!wantV && !wantH) wantV = true;          // told nothing: the old default, unchanged
      /* AND A RUN HAS ONE AXIS. That is what the word means, and it is what this type is
         FOR: sidewalks down the two long edges, roadway filling everything between them,
         no crosswalks and no signals. Handed both axes it would lay a crossing shape with
         none of a crossing's markings -- an 85%-pavement cell with a bare junction box and
         nothing to read in it, which is exactly what district_fill_gate caught the first
         time this took the axis from the caller (arterial's worst config fell 29.1% ->
         14.3% content). The world never asks for this: kitRoadLegs hands over ONE axis,
         off roadAxis(), and a cell with a real crossing resolves to `arterial_x` instead.
         So this is the nonsense case, and the answer to it is to pick one and stay a run. */
      if (wantV && wantH) { wantH = !((s.N ? 1 : 0) + (s.S ? 1 : 0) >= (s.E ? 1 : 0) + (s.W ? 1 : 0)); wantV = !wantH; }
      o.links = [];
      if (wantV) o.links.push('N', 'S');           // BOTH legs of the ONE axis it runs on
      if (wantH) o.links.push('E', 'W');
      o.streets = o.links;
      return generate(seed, o);
    },
    body: function (c) { return c === 13; },   // wall retired 8/20; the shelter is the only mass
    category: K.category('arterial') || 'infrastructure',
    palette: PALETTE, legend: LEGEND, notes: NOTES, vehicular: true, surface: true
  });

  K.register('arterial_x', {
    generate: function (seed, opts) {
      opts = opts || {};
      // THE CROSSING: BOTH LEGS OF MY OWN AXIS, PLUS AN ARM FOR EVERY STREET THAT
      // ACTUALLY ARRIVES. This read `o.links = ['N','S','E','W']` -- all four legs,
      // always -- with the reasoning "that is what makes it an intersection". It makes a
      // FOUR-WAY an intersection. A T is also an intersection, and forcing the fourth arm
      // builds half a cell of roadway running out to an edge with nothing on the other
      // side: a street that dead-ends into somebody's back yard. The generator has always
      // handled a three-leg set correctly (coverV stops the roadway at the junction box on
      // the side with no leg), so the shape only ever needed to be told the truth.
      // `cross` is the list of streets that reach this cell's edges (see kitRoadLegs), and
      // both legs of my own axis stay forced for the reason the RUN forces them: a street
      // cell that stops half way is not a street.
      var o = {}; for (var k in opts) o[k] = opts[k];
      var give = opts.links || opts.streets || [];
      var myV = false, myH = false, gi, ch;
      for (gi = 0; gi < give.length; gi++) {
        ch = String(give[gi]).toUpperCase().charAt(0);
        if (ch === 'N' || ch === 'S') myV = true;
        if (ch === 'E' || ch === 'W') myH = true;
      }
      if (!myV && !myH) { myV = myH = true; }          // told nothing: the old four-way
      var s = {};
      if (myV) { s.N = s.S = 1; }                      // BOTH legs of the axis I run on
      if (myH) { s.E = s.W = 1; }
      var cross = opts.cross || [];                    // plus an arm per arriving street
      for (gi = 0; gi < cross.length; gi++) s[String(cross[gi]).toUpperCase().charAt(0)] = 1;
      o.links = [];
      ['N', 'S', 'E', 'W'].forEach(function (dir) { if (s[dir]) o.links.push(dir); });
      o.streets = o.links;
      return generate(seed, o);
    },
    body: function (c) { return c === 13; },   // wall retired 8/20; the shelter is the only mass
    category: K.category('arterial_x') || 'infrastructure',
    palette: PALETTE, legend: LEGEND, notes: NOTES, vehicular: true, surface: true
  });

  var API = { generate: generate, throughDrivable: throughDrivable,
              footprints: function (r) { return r.footprints; },
              /* THE CORRIDOR HALF-WIDTH, EXPORTED (8/27). An overpass carries THIS road,
                 so the bridge deck's width is not the bridge's business to invent -- it is
                 a fact about the street underneath it. bohemia_freeway.js had `var half =
                 11` with the comment "~17 m of deck, a real overpass width", which was true
                 of the arterial as it stood the day it was typed and stopped being true the
                 moment the cross-section moved. MEASURED: the deck came out 23 tiles wide
                 across a roadway 35 tiles wide -- a bridge two thirds the width of its own
                 road, on 116 freeway cells. That is the FOURTH time this month a constant
                 moved and its dependent stayed behind (BOX, POCKET, the pole offsets, this),
                 so it is exported rather than copied and the freeway reads it. */
              PAVE_HALF: PAVE, CURB_HALF: CURB, WALK_HALF: WALK,
              palette: PALETTE, legend: LEGEND, notes: NOTES };
  if (typeof module !== 'undefined') module.exports = API;
  root.BohemiaArterial = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
