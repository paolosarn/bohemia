/* ============================================================================
   BOHEMIA -- TIER 1: THE THINGS THAT LIVE HERE (8/28/26, PEOPLE lane)
   Backlog row ALIVE-1, the half a number could never fix.

   WHY THIS EXISTS AND NOT MORE PEOPLE. Measured 8/28 on the real demo: at the
   TOP of the population slider, about 96,885 people, twenty-three walks in
   thirty-two still meet nobody. The valley is ~151 square kilometres and a step
   is about a metre. AMBIENCE DOES NOT NEED A CENSUS -- a resident has to live
   somewhere in the whole valley and be found, a raven is placed NEXT TO THE
   PLAYER -- so the scale that defeats the slider does not apply here at all.
   records/BOHEMIA_THE_SLIDER_WAS_NEVER_THE_ANSWER_8_28_26.md

   And his own 8/25 bestiary research said so first, in its own words: "the
   reason the city feels dead is not that we lack enemies. It is that we lack
   ANIMALS ... Tier 1 is mostly not an enemy system at all. It is set dressing
   that moves, and it is the cheapest fix on this list for the loudest complaint
   on his list."

   THE ROSTER IS SOURCED, NOT INVENTED. Every species here is in
   records/BOHEMIA_RESEARCH_WHAT_LIVES_IN_A_CITY_OF_CORPSES_8_25_26.md section 2,
   which is Nevada and Clark County material: coyotes thriving in the metro and
   using the washes as corridors, the common raven first to a body, rats as the
   urban constant, grackles and pigeons documented sifting trash in Las Vegas.
   Nothing on this page is a creature somebody made up.

   *** AND THE REACTION IS THE FEATURE, WHICH IS THE WHOLE CRAFT FINDING. ***
   Researched 8/28. Ghost of Tsushima's lead systems designer on why animals are
   not set dressing: "in just their ambient presence" they make a world feel
   alive. But every write-up returns to the same detail, and it is not the
   animal, it is what it does about YOU: small animals "scuttling away whenever
   they hear anything bigger than them", cranes taking flight as you approach.
   A BIRD THAT SITS THERE IS SCENERY. A BIRD THAT LEAVES WHEN YOU GET CLOSE IS
   ALIVE, and it costs one distance check.

   TWO DISTANCES, NOT ONE, and this is the ethology rather than a design idea.
   The literature on urban corvids measures ALERT DISTANCE and FLIGHT INITIATION
   DISTANCE separately: the bird notices you at one range and leaves at a
   shorter one. So every species here looks up before it goes, and the looking
   up is the half that reads as alive.
   AND A FEEDING ANIMAL LETS YOU GET CLOSER -- measured in hooded crows, which
   "alerted later and escaped at shorter distance if they were feeding during
   approach". So an animal on food has both distances cut, which hands us
   per-situation variation for nothing.

   AND ONE OF THEM DOES NOT CARE, ON PURPOSE. The research wrote that animal
   down already: "a coyote crossing the wash three blocks away and not caring
   about you". Its indifference only reads as indifference because the ravens
   flush. A ROSTER WHERE EVERYTHING REACTS THE SAME WAY HAS NO CHARACTER IN IT.

   WHAT IS RESERVED AND SHIPS EMPTY, per section 5 of the research: which
   animals are actually canon, anything supernatural, names, and every number
   that is a difficulty rather than a fact. The distances below are MINE, taken
   from the shape the literature gives, and they are one table so he can move
   them in one edit.

   NO COMBAT, NO HEALTH, NO LOOT. Tier 1 is what is alive around you. A carcass
   as a resource, a dog pack with a den, a hive as a hazard are TIER 2 AND 3 and
   are not this.

     node gates/wildlife_gate.js
   ============================================================================ */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.BohemiaWildlife = factory();
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var VERSION = 'bohwild-1.0.0';

  /* ---- THE CLOCK, IN MINUTES ---------------------------------------------
     Dawn and dusk are when the desert moves, which is why the coyote owns them
     and why the birds do not own the middle of the afternoon. Same heat window
     the population module already uses, so the valley's animals and its people
     are hiding from the same sun. */
  var DAWN = [4 * 60, 8 * 60];
  var DUSK = [17 * 60, 20 * 60];
  var NIGHT = [20 * 60, 5 * 60];        /* wraps midnight */
  var HEAT = [11 * 60, 16 * 60];

  function inWin(min, w) {
    return w[0] <= w[1] ? (min >= w[0] && min < w[1]) : (min >= w[0] || min < w[1]);
  }

  /* ---- WHAT LIVES HERE ----------------------------------------------------
     `wants` is read off the ground the surface reports, never off a district
     name, so a species lands anywhere the valley happens to look right.
       open   how many of the 24 cells around it can be walked on
       edge   there is something solid within one cell (a wall, a bin, a car)
     `alert` and `flush` are in cells. `feedCut` is what being on food does to
     both, which is the measured crow finding and not a preference. */
  var SPECIES = [
    { id: 'raven', name: 'raven', flock: [1, 3],
      when: function (m) { return !inWin(m, NIGHT); },
      wants: { edge: true, openMin: 4, openMax: 20 },
      alert: 9, flush: 5, feedCut: 0.45, reacts: true,
      /* first to a body, and a documented beneficiary of human landscapes.
         Perches on the EDGE of things because that is where height is. */
      note: 'on a roofline or a wall, and it sees you coming' },
    { id: 'grackle', name: 'grackles', flock: [2, 6],
      when: function (m) { return !inWin(m, NIGHT) && !inWin(m, HEAT); },
      wants: { edge: false, openMin: 16, openMax: 24 },
      alert: 6, flush: 3, feedCut: 0.4, reacts: true,
      note: 'sifting the open ground, and up all at once when you get close' },
    { id: 'pigeon', name: 'pigeons', flock: [2, 5],
      when: function (m) { return !inWin(m, NIGHT); },
      wants: { edge: true, openMin: 12, openMax: 24 },
      alert: 5, flush: 3, feedCut: 0.4, reacts: true,
      note: 'the ledge and the pavement under it' },
    { id: 'rat', name: 'rat', flock: [1, 2],
      when: function (m) { return inWin(m, NIGHT); },
      wants: { edge: true, openMin: 2, openMax: 12 },
      alert: 4, flush: 2, feedCut: 0.5, reacts: true,
      note: 'against the wall, and gone into it' },
    /* *** AND THIS ONE DOES NOT CARE. *** The research wrote the sentence:
       "a coyote crossing the wash three blocks away and not caring about you".
       It is the only row with reacts:false and that is the entire point of it
       being here. Dawn and dusk, on a long open run, moving through. */
    { id: 'coyote', name: 'coyote', flock: [1, 1],
      when: function (m) { return inWin(m, DAWN) || inWin(m, DUSK); },
      wants: { edge: false, openMin: 20, openMax: 24 },
      alert: 0, flush: 0, feedCut: 1, reacts: false,
      note: 'crossing, and it has already decided you are not worth it' }
  ];

  function speciesFor(id) {
    for (var i = 0; i < SPECIES.length; i++) if (SPECIES[i].id === id) return SPECIES[i];
    return null;
  }

  /* ---- THE ROLL, WHICH IS NOT A ROLL --------------------------------------
     Deterministic off the world seed, the cell and the hour. The same roofline
     has the same two ravens for the same hour of the same day, so a place has an
     identity and nothing shimmers when you turn around. The valley's own hash
     shape, kept here rather than imported so this module has no dependencies. */
  function h(a, b, c, d) {
    var x = (a | 0) * 374761393 + (b | 0) * 668265263 + (c | 0) * 2246822519 + (d | 0) * 3266489917;
    x = (x ^ (x >>> 13)) >>> 0;
    x = (Math.imul(x, 1274126177)) >>> 0;
    return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
  }

  /* ONE PATCH OF GROUND IS ONE SIGHTING AT MOST. The world is quantised into
     patches so that walking two cells does not re-roll the whole street, which
     is what would make ambience read as a slot machine instead of a place. */
  var PATCH = 12;

  /* ---- WHAT IS ALIVE AROUND HERE RIGHT NOW --------------------------------
     opts:
       seed     the world seed
       at       [x, y], the player's fine cell
       minute   minute of the day
       radius   how far out to look, in cells
       probe    function(x, y) -> { walk, open, edge, food }  from the surface
       density  0..1, how full the roster is allowed to make a screen. HIS.
     returns a list of sightings, each already told what it thinks of you. */
  function near(opts) {
    opts = opts || {};
    var at = opts.at || [0, 0], min = (opts.minute | 0), seed = (opts.seed | 0);
    var R = opts.radius == null ? 24 : opts.radius;
    var probe = opts.probe || function () { return null; };
    var density = opts.density == null ? 1 : opts.density;
    var out = [];
    var px0 = Math.floor((at[0] - R) / PATCH), px1 = Math.floor((at[0] + R) / PATCH);
    var py0 = Math.floor((at[1] - R) / PATCH), py1 = Math.floor((at[1] + R) / PATCH);
    var hour = Math.floor(min / 60);
    for (var py = py0; py <= py1; py++) for (var px = px0; px <= px1; px++) {
      /* ONE ROLL DECIDES WHETHER THIS PATCH HAS ANYTHING AT ALL, so an empty
         street stays empty and a busy corner stays busy. */
      var r0 = h(seed, px, py, hour);
      if (r0 > density * 0.55) continue;
      /* WHICH SPECIES, out of the ones the clock allows here. */
      var live = [];
      for (var s = 0; s < SPECIES.length; s++) if (SPECIES[s].when(min)) live.push(SPECIES[s]);
      if (!live.length) continue;
      var sp = live[Math.floor(h(seed ^ 0x51ed, px, py, hour) * live.length) % live.length];
      /* WHERE IN THE PATCH, and the ground has to agree with what it wants. */
      var bx = px * PATCH, by = py * PATCH, spot = null;
      for (var t = 0; t < 8 && !spot; t++) {
        var ox = Math.floor(h(seed ^ 0x9e37, px * 31 + t, py, hour) * PATCH);
        var oy = Math.floor(h(seed ^ 0x85eb, px, py * 31 + t, hour) * PATCH);
        var cx = bx + ox, cy = by + oy;
        var g = probe(cx, cy);
        if (!g || !g.walk) continue;
        if (g.open < sp.wants.openMin || g.open > sp.wants.openMax) continue;
        if (sp.wants.edge && !g.edge) continue;
        if (!sp.wants.edge && g.edge) continue;
        spot = [cx, cy, g];
      }
      if (!spot) continue;
      var n = sp.flock[0] + Math.floor(h(seed ^ 0xc2b2, px, py, hour + 7)
                * (sp.flock[1] - sp.flock[0] + 1));
      if (n > sp.flock[1]) n = sp.flock[1];
      /* A FEEDING ANIMAL LETS YOU GET CLOSER. Measured in hooded crows, not
         chosen: they alert later and flush at a shorter distance while eating. */
      var fed = !!spot[2].food;
      /* rounded to whole cells: the world is a grid, and a flush distance of
         2.4000000000000004 is a number nobody can act on or read. */
      var alert = Math.round(sp.alert * (fed ? sp.feedCut : 1) * 10) / 10;
      var flush = Math.round(sp.flush * (fed ? sp.feedCut : 1) * 10) / 10;
      var d = Math.max(Math.abs(spot[0] - at[0]), Math.abs(spot[1] - at[1]));
      var state = 'settled';
      if (sp.reacts) {
        if (d <= flush) state = 'gone';
        else if (d <= alert) state = 'alert';
      }
      out.push({ species: sp.id, name: sp.name, at: [spot[0], spot[1]], count: n,
                 feeding: fed, dist: d, alertAt: alert, flushAt: flush,
                 reacts: sp.reacts, state: state, note: sp.note,
                 /* which way it is facing: at you if it has noticed you, else
                    its own way, so a settled bird is not a compass needle. */
                 facing: state === 'settled'
                   ? Math.floor(h(seed ^ 0x27d4, spot[0], spot[1], hour) * 8)
                   : bearing8(spot[0], spot[1], at[0], at[1]) });
    }
    return out;
  }

  /* which of the eight ways one cell is from another */
  function bearing8(fx, fy, tx, ty) {
    var dx = tx - fx, dy = ty - fy;
    var a = Math.atan2(dy, dx) / Math.PI * 4;   /* -4..4 */
    var i = Math.round(a) & 7;
    return i;
  }

  /* WHAT THE PLAYER IS TOLD, if anything. Tier 1 says nothing out loud most of
     the time -- it is set dressing -- but the one that does not react is worth a
     line, because a coyote ignoring you IS the sentence. draft:true. */
  function lineFor(sighting) {
    if (!sighting) return null;
    if (sighting.species === 'coyote') return 'a coyote crossing, three blocks off';  /* draft:true */
    if (sighting.state === 'gone' && sighting.species === 'raven')
      return 'the ravens go up';                                                     /* draft:true */
    return null;
  }

  /* WHAT THIS TIER CANNOT DO, printed rather than implied. */
  var CANNOT = [
    'it is not danger: nothing here can hurt you and nothing here can be hurt',
    'it is not loot: a carcass as a resource is tier 2 and does not exist yet',
    'and it does not know what a roof is, only what the ground reports'
  ];

  return {
    VERSION: VERSION, SPECIES: SPECIES, PATCH: PATCH, CANNOT: CANNOT,
    DAWN: DAWN, DUSK: DUSK, NIGHT: NIGHT, HEAT: HEAT,
    inWin: inWin, speciesFor: speciesFor, near: near, bearing8: bearing8,
    lineFor: lineFor, hash: h
  };
}));
