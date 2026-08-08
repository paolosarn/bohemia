// BOHEMIA THE DEAD (8/8/26) — WHERE THE BODIES ARE, AND WHY THEY ARE THAT SHAPE.
//
// THE RULING (Paolo, 8/8/26 — recorded the turn it was given, because no earlier record of
// it exists in this repo):
//
//     "skeletons in the open, husks in sealed places, realistic mix, story-via-placement"
//
// AND THE RULING IS REAL FORENSICS, which is why it can be built as physics rather than as
// a table of my preferences. Sources are cited in NOTES.reference and every one was read
// for this, not remembered:
//   OPEN GROUND -> SKELETON. A body left outside in the Mojave is worked by a scavenger
//     guild -- coyote, fox, vulture, raccoon, crow -- that disarticulates and SCATTERS it,
//     on top of sun and wind. Surface remains in arid country take 49+ days to skeletonise
//     and come apart while they do. So: incomplete, spread, never tidy.
//   SEALED -> HUSK. Indoors and shut, there is no scavenger access, and extreme dry heat
//     mummifies instead of rotting -- it begins around the sixth day and then ARRESTS the
//     process; the literature is explicit that mummification prevents animals completing
//     skeletonisation. So: intact, desiccated, exactly where they lay down.
//   UNDER A ROOF BUT OPEN TO THE AIR is the honest middle: no sun, but the scavengers still
//     walk in. Skeleton, less scattered. It is not a third invented category, it is what the
//     two real mechanisms do when only one of them applies.
//
// TRAUMATIC, NOT GORY (law, 7/31, and it governs this file completely). These are the
// FACTS OF A PLACE, not gore props. This module carries no wound, no blood, no injury, no
// cause of death and no damage of any kind -- there is not a field for it, and its gate
// asserts there never is. What is upsetting here is meant to be that somebody shut a door
// and stayed behind it, not that you can see what happened to them.
//
// STORY-VIA-PLACEMENT is the whole point and it is the ARRANGEMENT that carries it. A body
// alone says nothing. Two together inside a sealed room, one just inside a door that was
// shut from this side, one on the threshold who did not get in -- those are sentences, and
// the game never has to write them down.
//
// MECHANISM-MINE: the ARRANGEMENTS and the physics are the ruling, so they are built. HOW
// MANY is taste, so density is a DIAL with a researched default, overridable, and the
// module reports which value it used so a number is never mistaken for a decision.
//
// DETERMINISM: a pure function of (seed, cell, position). No Date, no Math.random. The same
// house holds the same dead for everybody, forever.
(function(root){
  var HAS = (typeof module !== 'undefined');

  /* THE STREAMS HAVE TO BE INDEPENDENT, and the first version's were not.
   * Every draw here is unit(seed, x, y, STREAM) -- stream 1 decides IF a body is placed,
   * stream 2 decides WHAT ARRANGEMENT. With only one multiply and one xorshift after `d`
   * was mixed in, the two streams stayed CORRELATED: measured on the real valley, every
   * cell that survived the density check on stream 1 landed between 0.382 and 0.634 on
   * stream 2, never once above 0.909 -- so `queue` had an 8.7% weight and was selected
   * ZERO TIMES IN THE WHOLE VALLEY. Placement that looks random and is not is worse than
   * placement that is obviously regular, because nothing about it looks wrong.
   * A full avalanche finaliser (the murmur3 tail) decorrelates them. */
  function hash(a, b, c, d){
    var h = (a >>> 0) ^ 0x9E3779B1;
    h = Math.imul(h ^ ((b >>> 0) + 0x85EBCA6B), 0x27D4EB2D) >>> 0;
    h = Math.imul(h ^ ((c >>> 0) + 0xC2B2AE35), 0x165667B1) >>> 0;
    h = Math.imul(h ^ ((d >>> 0) + 0x27D4EB2F), 0x9E3779B1) >>> 0;
    h ^= h >>> 16; h = Math.imul(h, 0x85EBCA6B) >>> 0;
    h ^= h >>> 13; h = Math.imul(h, 0xC2B2AE35) >>> 0;
    h ^= h >>> 16;
    return h >>> 0;
  }
  function unit(a, b, c, d){ return hash(a, b, c, d) / 4294967296; }

  // ---- THE TWO KINDS. There are exactly two, because there are exactly two mechanisms.
  var SKELETON = 'skeleton';   // open air: scavenged, disarticulated, incomplete
  var HUSK     = 'husk';       // sealed: mummified by dry heat, intact, undisturbed

  /* EXPOSURE, read off the tile the world model already publishes. Nothing here is guessed:
   * tileInfo gives solid / inside / roof per tile because the DISTRICT DOSSIER LAW made
   * every district declare its layering. */
  function exposure(t){
    if (!t || t.solid) return null;          // no body stands in a wall
    if (t.inside) return 'sealed';           // within a building's footprint
    if (t.roof) return 'sheltered';          // under an overhead, open to the air
    return 'open';
  }
  function kindFor(exp){
    if (exp === 'sealed') return HUSK;
    if (exp === 'open' || exp === 'sheltered') return SKELETON;
    return null;
  }

  /* THE ARRANGEMENTS. Each one is a sentence the placement tells without writing it down.
   * `where` is the exposure it can occur in; `n` is how many bodies it puts down. */
  var ARRANGEMENTS = [
    { id: 'lone',       where: ['open'],                n: 1, weight: 60,
      says: 'one person, out in the open, alone. The commonest and the quietest.' },
    { id: 'threshold',  where: ['open', 'sheltered'],   n: 1, nearDoor: true, weight: 30,
      says: 'on the doorstep, outside. They did not get in, and the door is shut.' },
    { id: 'queue',      where: ['open'],                n: 3, line: true, weight: 6,
      says: 'three along the road in a line. They died moving, and in the same direction.' },
    { id: 'inside_door',where: ['sealed'],              n: 1, nearDoor: true, weight: 45,
      says: 'just inside a door, on this side of it. They shut it and stayed.' },
    { id: 'pair',       where: ['sealed'],              n: 2, adjacent: true, weight: 35,
      says: 'two together in a sealed room. Whatever happened, they were not alone for it.' },
    { id: 'huddle',     where: ['sealed'],              n: 4, cluster: true, weight: 12,
      says: 'four in the back of a room, away from the door. They went as far in as it goes.' }
  ];

  /* DENSITY. Taste, therefore a dial -- but it ships with a default rather than NO_RULING,
   * because the ruling says the valley IS to have its dead and silence would be me
   * overriding him with process. The default is stated as what it is: bodies per hundred
   * legal tiles, low, because a valley carpeted in remains reads as a prop store and the
   * ruling asks for a realistic mix. Override it and the module reports the value used. */
  var DEFAULT_DENSITY = { open: 0.10, sheltered: 0.25, sealed: 0.60 };
  // sealed is highest and that is the research, not a preference: people die indoors, and
  // indoors is the only place the evidence survives intact to be found.

  /* THE MIX IS THE RULING TOO. "Realistic mix" is not "one of each, evenly" -- most people
   * who die alone die alone, and a LINE OF THREE IN THE ROAD is a sentence that only works
   * if it is rare. Measured before this existed: the flat pick made `queue` 72% of every
   * body in the open and put `inside_door` -- somebody who shut a door and stayed behind it,
   * the most affecting thing in the whole set -- on TWO tiles in the entire sampled valley.
   * A striking arrangement everywhere stops being striking, so the commonest is the quietest
   * and the loud ones are rationed. */
  function pick(pool, u){
    var total = 0, i;
    for (i = 0; i < pool.length; i++) total += (pool[i].weight || 1);
    var roll = u * total, acc = 0;
    for (i = 0; i < pool.length; i++) { acc += (pool[i].weight || 1); if (roll < acc) return pool[i]; }
    return pool[pool.length - 1];
  }
  function densities(over){
    var d = {}, k;
    for (k in DEFAULT_DENSITY) d[k] = (over && over[k] != null) ? over[k] : DEFAULT_DENSITY[k];
    return d;
  }

  /* PLACE THE DEAD ON ONE PLOT. Exterior only -- interiors are their own plates and are
   * placed by placeInterior below, so a building's inside is never guessed from outside. */
  function placePlot(plot, seed, opts){
    opts = opts || {};
    var D = densities(opts.density);
    // NOT EVERY PLOT PUBLISHES tileInfo. The reserved and unbuilt cell types (robofactory
    // was the one that found this) hand back a plot with no tile layer API at all, and
    // assuming it is there threw on the first valley-wide run. A cell whose layering the
    // world model does not publish is a cell whose exposure I cannot know -- so it gets NO
    // dead, and says why, rather than getting bodies placed on a guess.
    if (!plot || typeof plot.tileInfo !== 'function') {
      return { remains: [], density: D, seed: seed >>> 0, skipped: 'no tile layering published' };
    }
    var W = opts.W || 128, H = opts.H || 128;
    var step = Math.max(1, opts.step || 4);       // sample lattice; bodies are sparse
    var out = [], x, y, i;
    var doorNear = function(px, py){
      for (var dy = -2; dy <= 2; dy++) for (var dx = -2; dx <= 2; dx++) {
        var t = plot.tileInfo(px + dx, py + dy);
        if (t && (t.layer === 'portal' || t.enter)) return true;
      }
      return false;
    };
    /* THE DOOR PASS COMES FIRST, and it is the correction that made this module mean
     * anything. Measured with an ambient lattice alone: `threshold` -- somebody who did not
     * get in, lying on a doorstep with the door shut -- came out at 1.7% of the dead, and
     * `inside_door` at 0.4%. Those are the two arrangements that carry the most story in
     * the whole set, and sampling every fourth tile and asking "is there a door near here"
     * finds them almost never. STORY-VIA-PLACEMENT MEANS PLACING THE STORY. So: walk the
     * doors, and decide AT EACH DOOR whether somebody is lying on its step. */
    /* A DOOR IS A PORTAL TILE, AND A RUN OF THEM IS ONE DOOR. First version asked for
     * `layer==='portal' || enter`, and `enter` is set on EVERY TILE of an enterable
     * building rather than on its doorway -- so "the doors" came out as thousands of tiles
     * per plot and thresholds went from 1.7% of the dead to 93.3%. Overcorrecting is still
     * getting it wrong; the fix is the right DEFINITION, not a smaller number.
     * Portal tiles only, and contiguous ones collapse to a single door. */
    var portal = {}, doors = [];
    for (y = 0; y < H; y++) for (x = 0; x < W; x++) {
      var dt = plot.tileInfo(x, y);
      if (dt && dt.layer === 'portal') portal[x + ',' + y] = 1;
    }
    var seenP = {};
    for (var pk in portal) {
      if (seenP[pk]) continue;
      var st = [pk.split(',').map(Number)], cells = [];
      seenP[pk] = 1;
      while (st.length) {
        var pc = st.pop(); cells.push(pc);
        var d4 = [[1,0],[-1,0],[0,1],[0,-1]];
        for (var q = 0; q < 4; q++) {
          var nk = (pc[0]+d4[q][0]) + ',' + (pc[1]+d4[q][1]);
          if (portal[nk] && !seenP[nk]) { seenP[nk] = 1; st.push(nk.split(',').map(Number)); }
        }
      }
      // the door is the middle of its run
      var sx2 = 0, sy2 = 0;
      for (q = 0; q < cells.length; q++) { sx2 += cells[q][0]; sy2 += cells[q][1]; }
      doors.push([Math.round(sx2 / cells.length), Math.round(sy2 / cells.length)]);
    }
    var THRESHOLD_CHANCE = 0.16;   // roughly one doorstep in six. Rationed on purpose.
    for (i = 0; i < doors.length; i++) {
      if (unit(seed, doors[i][0], doors[i][1], 900) >= THRESHOLD_CHANCE) continue;
      // just OUTSIDE it: step off the door into the first open tile we find
      var placed = null;
      for (var r2 = 1; r2 <= 3 && !placed; r2++) {
        for (var dy2 = -r2; dy2 <= r2 && !placed; dy2++) for (var dx2 = -r2; dx2 <= r2; dx2++) {
          if (Math.abs(dx2) !== r2 && Math.abs(dy2) !== r2) continue;
          var ot = plot.tileInfo(doors[i][0] + dx2, doors[i][1] + dy2);
          var oe = exposure(ot);
          if (oe === 'open' || oe === 'sheltered') {
            placed = { x: doors[i][0] + dx2, y: doors[i][1] + dy2, exposure: oe };
            break;
          }
        }
      }
      if (!placed) continue;
      var TH = ARRANGEMENTS.filter(function(a){ return a.id === 'threshold'; })[0];
      out.push({ x: placed.x, y: placed.y, kind: kindFor(placed.exposure), exposure: placed.exposure,
                 arrangement: TH.id, says: TH.says, scattered: true, atDoor: true });
    }

    for (y = 0; y < H; y += step) for (x = 0; x < W; x += step) {
      var t = plot.tileInfo(x, y);
      var exp = exposure(t);
      if (!exp || exp === 'sealed') continue;     // sealed is the interior's business
      if (unit(seed, x, y, 1) >= D[exp] / 100 * step * step) continue;
      // the door pass owns the doorstep; the ambient pass fills the rest of the ground
      var pool = ARRANGEMENTS.filter(function(a){
        return a.where.indexOf(exp) >= 0 && !a.nearDoor;
      });
      if (!pool.length) continue;
      var A = pick(pool, unit(seed, x, y, 2));
      for (i = 0; i < A.n; i++) {
        // a line walks along the road; everything else scatters a little, because scavengers
        var ox = A.line ? i * 2 : Math.round((unit(seed, x, y, 10 + i) - 0.5) * 4);
        var oy = A.line ? 0     : Math.round((unit(seed, x, y, 20 + i) - 0.5) * 4);
        var cx = x + ox, cy = y + oy;
        var ct = plot.tileInfo(cx, cy);
        var ce = exposure(ct);
        if (!ce || ce === 'sealed') continue;      // never shove a body through a wall
        out.push({ x: cx, y: cy, kind: kindFor(ce), exposure: ce,
                   arrangement: A.id, says: A.says, scattered: ce !== 'sealed' });
      }
    }
    return { remains: out, density: D, seed: seed >>> 0 };
  }

  /* PLACE THE DEAD INSIDE. Every level of an interior is sealed by definition -- that is
   * what an interior IS -- so everything here is a husk, intact, where they lay down.
   * Takes the interior-levels reader so a floorplan, a garage deck and a crypt are all
   * handled by the same code rather than three guesses about three shapes. */
  function placeInterior(levelsReader, seed, opts){
    opts = opts || {};
    var D = densities(opts.density);
    var out = [], i, x, y;
    var A = levelsReader;
    if (!A) return { remains: [], density: D, seed: seed >>> 0 };
    for (var L = 0; L < A.count; L++) {
      var links = A.links(L), ents = A.entrances(L);
      var doorish = links.concat(ents);
      var near = function(px, py){
        for (i = 0; i < doorish.length; i++) {
          if (Math.abs(doorish[i].x - px) <= 2 && Math.abs(doorish[i].y - py) <= 2) return true;
        }
        return false;
      };
      // THE DOOR PASS, inside. Somebody who shut a door and stayed on this side of it is
      // the single most affecting thing in the set, and the ambient lattice found it 0.4%
      // of the time. Walk the doors instead.
      var ID = ARRANGEMENTS.filter(function(a){ return a.id === 'inside_door'; })[0];
      for (i = 0; i < doorish.length; i++) {
        var dd = doorish[i];
        if (unit(seed, dd.x, dd.y, 800 + L) >= 0.22) continue;
        var spot = null;
        for (var rr = 1; rr <= 2 && !spot; rr++) {
          for (var ddy = -rr; ddy <= rr && !spot; ddy++) for (var ddx = -rr; ddx <= rr; ddx++) {
            if (Math.abs(ddx) !== rr && Math.abs(ddy) !== rr) continue;
            if (A.passable(L, dd.x + ddx, dd.y + ddy)) { spot = { x: dd.x + ddx, y: dd.y + ddy }; break; }
          }
        }
        if (!spot) continue;
        out.push({ level: L, x: spot.x, y: spot.y, kind: HUSK, exposure: 'sealed',
                   arrangement: ID.id, says: ID.says, scattered: false, atDoor: true });
      }

      for (y = 0; y < A.H; y += 2) for (x = 0; x < A.W; x += 2) {
        if (!A.passable(L, x, y)) continue;
        if (unit(seed, x, y, 100 + L) >= D.sealed / 100 * 4) continue;
        var pool = ARRANGEMENTS.filter(function(a){
          return a.where.indexOf('sealed') >= 0 && !a.nearDoor;
        });
        if (!pool.length) continue;
        var AR = pick(pool, unit(seed, x, y, 200 + L));
        for (i = 0; i < AR.n; i++) {
          // sealed remains do NOT scatter -- nothing came in to move them
          var ox = AR.adjacent ? i : (AR.cluster ? (i % 2) : 0);
          var oy = AR.cluster ? Math.floor(i / 2) : 0;
          var cx = x + ox, cy = y + oy;
          if (!A.passable(L, cx, cy)) continue;
          out.push({ level: L, x: cx, y: cy, kind: HUSK, exposure: 'sealed',
                     arrangement: AR.id, says: AR.says, scattered: false });
        }
      }
    }
    return { remains: out, density: D, seed: seed >>> 0 };
  }

  var NOTES = {
    ruling: 'Paolo 8/8/26: "skeletons in the open, husks in sealed places, realistic mix, ' +
            'story-via-placement."',
    reference: [
      'Arid-environment taphonomy: semi-arid deposition yields total skeletonisation, ' +
      'skeletonisation with dry putrid matter, saponification OR mummification depending on ' +
      'the depositional context -- the CONTEXT decides which, which is the whole ruling.',
      'Mummification begins around the sixth day post mortem, with extreme atmospheric ' +
      'temperature aiding it and slowing decomposition; it then PREVENTS animals from ' +
      'completing skeletonisation. Sealed + hot + dry = an intact husk.',
      'Carcasses on the soil surface can take more than 49 days to skeletonise in arid ' +
      'regions, and are worked the whole time by a vertebrate scavenger guild -- coyote, ' +
      'fox, vulture, raccoon, opossum, skunk, crow -- that disarticulates and SCATTERS ' +
      'remains. Open ground = incomplete and spread, never a tidy body.',
      'Scavenger access is the variable that separates the two outcomes, and a shut door ' +
      'is what removes it.'
    ],
    law: 'TRAUMATIC NOT GORY (7/31): these are facts of a place, not gore props. This module ' +
         'carries no wound, blood, injury, cause of death or damage field of any kind.'
  };

  var API = { SKELETON: SKELETON, HUSK: HUSK, ARRANGEMENTS: ARRANGEMENTS,
              DEFAULT_DENSITY: DEFAULT_DENSITY, densities: densities,
              exposure: exposure, kindFor: kindFor,
              placePlot: placePlot, placeInterior: placeInterior, NOTES: NOTES };
  if (HAS) module.exports = API;
  root.BohemiaDead = API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
