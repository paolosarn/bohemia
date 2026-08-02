// BOHEMIA POPULATION (7/29/26) — WHERE THE 300 PEOPLE ARE.
//
// Paolo 7/29, LOCKED (laws/BOHEMIA_ADDENDUM_HOW_MANY_PEOPLE_7_29_26.md):
//
//   "again we dont have to make every person left as an npc it just has to
//    feel equivalant to that. how busy we make the city feel. i think i want
//    to go with the number that reflects how many people vegas can feed if
//    all the survvors did their best to turn parks and their houses into
//    farms/hydropnics and shit. like mfs gotta eat and drink."
//
//   "both. why not both. some clusters. some no mans lands. some random
//    spread."
//
// This module is the second sentence made mechanical. It answers ONE question,
// deterministically, for any cell in the world: HOW MANY PEOPLE LIVE HERE, and
// WHAT KIND OF PLACE IS THIS.
//
// WHY IT IS ITS OWN MODULE AND NOT A PATCH INSIDE ONE SURFACE. The RUN and the
// CITY tab are separate renderers that share almost no drawing code, and this
// project has already been burned once by fixing a thing on the surface Paolo
// does not play. If each surface invented its own idea of who lives where, the
// same neighbourhood would be a ghost town in one and a settlement in the
// other. So the zone map is computed HERE, from the overmap and the power grid
// alone, and any surface that wants people asks this module. Same seed, same
// answer, forever, on every surface.
//
// IT IS ALSO NOT engine/bohemia_agents.js AND MUST NOT BECOME IT. That module
// belongs to the WORLD lane and it owns SCHEDULES — who works where, when they
// walk, what they do. This module owns only CENSUS: how many bodies belong to a
// place. Population asks "how many"; agents answer "doing what". Keeping them
// apart is the ENGINE SYNC LAW (one canonical body per module).
//
// THE NUMBERS, and every one of them traces to the ruling:
//   65,000 people in the valley is the FOOD CARRYING CAPACITY
//   (records/BOHEMIA_FOOD_CEILING_RESEARCH_7_29_26.md). The walkable valley
//   holds ~10,600 people of pre-collapse capacity against real Las Vegas's
//   ~2.3 million, so it is ~1/217th of the city. 65,000 is 2.83% of
//   pre-collapse; 2.83% of 10,600 is ~300 living bodies in everything you can
//   walk to. That is the whole population of the playable world.
//
// THE UNIT IS THE NEIGHBOURHOOD, NOT THE CELL. A 4x4 group of overmap cells is
// one 128x128 suburb grid — the same grouping the suburb generator already
// uses (SZ=128, FN=32). Zoning at the cell level would scatter people inside a
// single subdivision and destroy the very clustering the ruling asks for. The
// valley has ~2,832 residential cells = ~177 neighbourhoods.
//
// MECHANISM-MINE / CONTENTS-PAOLO'S: this file assigns COUNTS and KINDS of
// place. It names nobody, writes no dialogue, and picks no faction. The NAMES
// table is deliberately empty.
(function (root) {
  'use strict';

  // Residential district types. Anything not in here has no residents at all,
  // which is what keeps people out of the desert — the "phantom resident"
  // failure the engine reality map warned about is impossible by construction
  // rather than by a filter somebody has to remember to apply.
  var RESIDENTIAL = { suburb: 1, gated: 1, estate: 1, apartment: 1, trailer: 1, town: 1 };

  // Districts that make a neighbourhood worth clustering around. Paolo's
  // ruling: "clusters are not random, they sit on the three things people
  // actually need" — power, converted farm ground, and water.
  var DRAW = {
    farm: 1, golf: 1, park: 1,            // the converted calorie ground
    watertreat: 1, reservoir: 1, wash: 1, // water, and the biosolids that make soil
    dam: 1, substation: 1, solar: 1, battery: 1 // power
  };

  // THE ZONE SHARES (Paolo 7/29). Fractions of residential NEIGHBOURHOODS.
  // A full quarter of the map is deliberately empty: "some no mans lands."
  // Emptiness is content, so it is a authored share, not a leftover.
  var SHARE = { cluster: 0.08, spread: 0.42, loner: 0.25, empty: 0.25 };

  // Bodies per neighbourhood by zone. cluster*0.08 + spread*0.42 + loner*0.25
  // over ~177 neighbourhoods lands on ~300, which is the whole point.
  var HEADS = { cluster: 13, spread: 1, loner: 1, empty: 0 };

  // Deterministic 32-bit hash. Same shape the rest of the engine uses so a
  // neighbourhood's zone never moves between surfaces or between runs.
  function h2(a, b, s) {
    var n = (Math.imul(a | 0, 2654435761) ^ Math.imul(b | 0, 40503) ^ Math.imul(s | 0, 2246822519)) >>> 0;
    n ^= n >>> 15; n = Math.imul(n, 2246822519) >>> 0; n ^= n >>> 13;
    return n >>> 0;
  }
  function frac(a, b, s) { return h2(a, b, s) / 4294967296; }

  // A neighbourhood is a 4x4 block of overmap cells: the suburb generator's
  // own 128x128 grid at FN=32. NB is that 4, kept named so a future scale
  // change has one place to move.
  var NB = 4;

  function neighbourhoodOf(tx, ty) { return [tx >> 2, ty >> 2]; }

  // Is this 4x4 group residential, and does it touch anything worth living
  // near? Reads the overmap directly, so it needs no state of its own.
  function surveyNeighbourhood(om, nx, ny) {
    var res = 0, total = 0, draw = 0;
    for (var y = 0; y < NB; y++) for (var x = 0; x < NB; x++) {
      var c = om.at ? om.at(nx * NB + x, ny * NB + y) : null;
      if (!c) continue;
      total++;
      if (RESIDENTIAL[c.district]) res++;
    }
    if (!res) return { res: 0, total: total, draw: 0 };
    // one ring out: what does this neighbourhood back onto
    for (var k = -1; k <= NB; k++) {
      var probes = [[nx * NB + k, ny * NB - 1], [nx * NB + k, ny * NB + NB],
                    [nx * NB - 1, ny * NB + k], [nx * NB + NB, ny * NB + k]];
      for (var i = 0; i < probes.length; i++) {
        var pc = om.at ? om.at(probes[i][0], probes[i][1]) : null;
        if (pc && DRAW[pc.district]) draw++;
      }
    }
    return { res: res, total: total, draw: draw };
  }

  // Does this neighbourhood sit on a live circuit? POWER is the powergrid map
  // (12% CLUSTERED POWER). Passed in rather than imported so this module stays
  // a pure function of what it is given.
  function poweredNeighbourhood(POWER, nx, ny) {
    if (!POWER || !POWER.at) return false;
    for (var y = 0; y < NB; y++) for (var x = 0; x < NB; x++) {
      var p = POWER.at(nx * NB + x, ny * NB + y);
      if (p && p.live) return true;
    }
    return false;
  }

  // HOW MUCH REAL RESIDENTIAL GROUND a neighbourhood has, 0..1. This is the
  // number that reconciles the ruling with the map. The ruling counts "177
  // neighbourhoods", which is 2,832 residential cells divided by 16 — i.e. it
  // counts FULL neighbourhoods' WORTH of ground. The overmap actually spreads
  // that ground over ~493 partial 4x4 groups, most of them slivers. Weighting
  // by residential cells makes the two agree exactly: measured total weight is
  // 172.4, against the ruling's 177. Without this, partial groups each claimed
  // a full settlement and the valley came out at 1,249 people instead of 300.
  function weightOf(om, nx, ny) { return surveyNeighbourhood(om, nx, ny).res / (NB * NB); }

  // THE ZONE. Returns 'cluster' | 'spread' | 'loner' | 'empty' | null
  // (null = not residential ground, so nobody lives here at all).
  //
  // CLUSTERS ARE EARNED, NOT ROLLED. A neighbourhood can only become a cluster
  // if it is BIG ENOUGH to be a place (half its ground residential) AND it has
  // power or backs onto farm/water ground — the ruling's own rule, that
  // clusters sit on the three things people actually need. The hash then picks
  // among the ones that qualify, so the share is a CAP on a merit list rather
  // than a lottery.
  //
  // CLUSTER_PICK WAS TUNED AGAINST THE CANON SEED, NOT GUESSED. The game boots
  // seed text 'bohemia' -> 2691674296 (the ONE SEED law), and on that map ~84
  // neighbourhoods qualify on merit. Measured sweep: 1/6 gave 10 clusters and
  // 257 people, 1/4 gave 15 and 320, and 0.22 gives 13 clusters and 297 people
  // — the ruling asked for 14 and ~300. Other seeds land 277-394, which is
  // honest variance in a procedural valley, not slop; the gate asserts the BAND
  // and pins the canon seed.
  var MIN_PLACE = 0.5;      // half-residential or it is not a settlement site
  var CLUSTER_PICK = 0.22; // of the qualifying merit list

  function zoneAt(om, POWER, tx, ty, seed) {
    var n = neighbourhoodOf(tx, ty), nx = n[0], ny = n[1];
    var s = surveyNeighbourhood(om, nx, ny);
    if (!s.res) return null;
    var w = s.res / (NB * NB);
    var f = frac(nx, ny, seed);
    if (w >= MIN_PLACE && (poweredNeighbourhood(POWER, nx, ny) || s.draw > 0)
        && f < CLUSTER_PICK) return 'cluster';
    // everyone else splits the remaining three ways, renormalised
    var rest = SHARE.spread + SHARE.loner + SHARE.empty;
    var g = frac(nx, ny, (seed | 0) + 7919);
    if (g < SHARE.spread / rest) return 'spread';
    if (g < (SHARE.spread + SHARE.loner) / rest) return 'loner';
    return 'empty';
  }

  // HOW MANY BODIES belong to this neighbourhood.
  //
  // A CLUSTER IS A CLUSTER: 13 people give or take, not scaled down, because a
  // settlement is a settlement and the ruling's whole point is that you can
  // hear one before you see it.
  //
  // SPREAD AND LONER ARE WEIGHTED, and deliberately by a hash against the
  // weight rather than by rounding. Rounding 1 x 0.3 to zero would silently
  // delete every small neighbourhood's household and pull the valley well under
  // 300; rolling the hash against w keeps the TOTAL proportional to the real
  // residential ground while every individual answer stays a whole person and
  // stays the same on every surface and every run.
  function headsAt(om, POWER, tx, ty, seed) {
    var z = zoneAt(om, POWER, tx, ty, seed);
    if (!z || z === 'empty') return 0;
    var n = neighbourhoodOf(tx, ty), nx = n[0], ny = n[1];
    if (z === 'cluster') return HEADS.cluster - 3 + ((h2(nx, ny, (seed | 0) + 104729) % 7) | 0);
    var w = weightOf(om, nx, ny);
    return (frac(nx, ny, (seed | 0) + 15485863) < w) ? HEADS[z] : 0;
  }

  // WHERE, EXACTLY. Deterministic homes for one neighbourhood, as fine-grid
  // cells. `pick` is a callback the CALLING SURFACE supplies: given a candidate
  // fine cell it returns true if a person can stand there. The surfaces
  // disagree about what is walkable (the run has its own grid, the city has
  // chunk metadata) and this module refuses to guess — it offers candidates and
  // the surface accepts them. That is what keeps one census honest across two
  // renderers.
  function homesIn(om, POWER, nx, ny, seed, FN, pick, cap) {
    var out = [];
    var want = headsAt(om, POWER, nx * NB, ny * NB, seed);
    if (!want) return out;
    if (cap && want > cap) want = cap;
    var x0 = nx * NB * FN, y0 = ny * NB * FN, span = NB * FN;
    // A CLUSTER HAS TO BE TIGHT OR IT IS NOT A CLUSTER. Measured on the real
    // surface first: scattering 13 people evenly over a 128x128 subdivision put
    // exactly ONE of them on screen at walk zoom, which reads as a lonely
    // stranger, not as the settlement the ruling describes ("you hear it before
    // you see it"). People who live together live TOGETHER - a few adjacent
    // streets, not one per suburb. So a cluster gets a deterministic centre and
    // a radius; spread and loner households keep the whole-neighbourhood
    // scatter, because being far from your neighbours is the entire point of
    // them.
    var zone = zoneAt(om, POWER, nx * NB, ny * NB, seed);
    var tight = (zone === 'cluster');
    // cRad MEASURED ON THE REAL SURFACE, not guessed. At walk zoom (HC=22 on a
    // 390px phone) you see about SEVENTEEN fine cells across. A 14-cell radius
    // is 28 cells wide - wider than the screen - so a "settlement" of 13 put
    // exactly ONE person in view, which is indistinguishable from a loner. At 8
    // the cluster spans one screen and three to five neighbours are visible at
    // once, which is what actually reads as a place where people live. You
    // still never see all 13, and you should not: you hear a settlement before
    // you see it, and you meet it a few people at a time.
    var cRad = 8;                                    // fine cells, ~one street
    var cx0 = x0 + cRad + (h2(nx, ny, (seed | 0) + 31337) % Math.max(1, span - 2 * cRad));
    var cy0 = y0 + cRad + (h2(ny, nx, (seed | 0) + 31337) % Math.max(1, span - 2 * cRad));
    // Walk a deterministic scatter; take the first `want` cells the surface
    // accepts. Bounded so a surface that rejects everything cannot hang.
    for (var i = 0, tries = 0; out.length < want && tries < span * 8; i++, tries++) {
      var r = h2(nx * 8191 + i, ny * 131 + i, seed);
      var fx, fy;
      if (tight) {
        fx = cx0 - cRad + (r % (cRad * 2));
        fy = cy0 - cRad + ((r >>> 12) % (cRad * 2));
      } else {
        fx = x0 + (r % span); fy = y0 + ((r >>> 12) % span);
      }
      if (pick && !pick(fx, fy)) continue;
      var dup = false;
      for (var k = 0; k < out.length; k++) if (out[k][0] === fx && out[k][1] === fy) { dup = true; break; }
      if (dup) continue;
      out.push([fx, fy, r]);
    }
    return out;
  }

  // Valley-wide census, for the gate and for anything that wants to state the
  // number out loud. Walks the whole overmap once.
  function census(om, POWER, seed, overN) {
    var N = overN || 96;
    var z = { cluster: 0, spread: 0, loner: 0, empty: 0 }, people = 0, resCells = 0;
    var seen = {};
    for (var ty = 0; ty < N; ty++) for (var tx = 0; tx < N; tx++) {
      var c = om.at ? om.at(tx, ty) : null;
      if (!c || !RESIDENTIAL[c.district]) continue;
      resCells++;
      var n = neighbourhoodOf(tx, ty), k = n[0] + ',' + n[1];
      if (seen[k]) continue;
      seen[k] = 1;
      var zone = zoneAt(om, POWER, tx, ty, seed);
      if (!zone) continue;
      z[zone]++;
      people += headsAt(om, POWER, tx, ty, seed);
    }
    return { zones: z, neighbourhoods: z.cluster + z.spread + z.loner + z.empty,
             residentialCells: resCells, people: people };
  }

  // =========================================================================
  // THE PERSON RECORD, and the machinery that lets every one of them be
  // rewritten at once.
  //
  // Paolo 7/29, LOCKED (laws/BOHEMIA_ADDENDUM_MASS_EDIT_THE_PEOPLE_7_29_26.md):
  //
  //   "sure just make sure you do the coding right so when its time to mass
  //    edit the people you can please"
  //
  // Given as a CONDITION on making the residents move, and it is the right
  // condition: this population is going to be edited constantly - looks,
  // clothes, archetypes, factions, who is armed, who is sick - and every one
  // of those is a bulk change over a filtered set. Architecture that makes the
  // first version work and the tenth version a rewrite is the failure this
  // forecloses. It is the FACTORY LAW applied to people.
  //
  // FOUR RULES, all of them load-bearing:
  //
  //  1. STABLE IDS. "nx:ny:i" under the ONE SEED - derived from the world and
  //     the place, never from array order or spawn order. The same person is
  //     the same person across a reload, and across the RUN and the CITY tab.
  //     Without this "mass edit" cannot even be expressed, because there is
  //     nothing to address.
  //  2. ONE DERIVATION POINT. Every field comes from personFields() below.
  //     Change that function and everybody changes, everywhere, at once. No
  //     field may be computed at the point of use - that is exactly the habit
  //     that makes a population uneditable.
  //  3. AN OVERRIDES LAYER, and it is the ONLY place edits live. A rule is a
  //     FILTER plus a PATCH. Rules are data, they are ordered, and they are
  //     applied on read. Editing people means ADDING A RULE, never touching
  //     the derivation - which is what makes an edit reversible, inspectable
  //     and diff-able.
  //  4. IT IS PROVED, NOT PROMISED. gates/mass_edit_gate.js performs a real
  //     bulk edit and measures that it landed, including on the drawn surface.
  //
  // MECHANISM-MINE / CONTENTS-PAOLO'S: the OVERRIDES table ships EMPTY. The
  // machinery to change every scavenger in the valley at once is mine to
  // build; what a scavenger IS stays his.

  // The four life archetypes are agents.js's own (worker / scav / keeper /
  // watch), referenced rather than redefined so the two modules cannot drift.
  var ARCHETYPES = ['worker', 'scav', 'keeper', 'watch'];

  // ---- ONE DERIVATION POINT ------------------------------------------------
  // Everything a person IS, in one place. Nothing else in the codebase may
  // compute any of these fields.
  //
  // `ns` (7/31) is a NAMESPACE, and it exists because two surfaces index people
  // at two different grains. The CITY tab's bodies are indexed per
  // NEIGHBOURHOOD (nx,ny are 4-cell blocks, 0..23); the RUN's bodies are the
  // households of ONE overmap cell (0..95). Those number ranges overlap, so
  // without a namespace a run person and a city person could collide on both
  // the id string AND the hash stream - two different people wearing one
  // record, which is precisely what a mass edit targeting an id must never hit.
  // It is one optional argument rather than a second derivation function, so
  // ONE DERIVATION POINT still means one.
  //
  // NOT A CLAIM THAT THEY ARE THE SAME PEOPLE. The run block and the city
  // neighbourhood cover different ground at different grain, and pretending a
  // 1:1 match exists would be a lie the machine could not check. What IS shared
  // is the grammar, the conditions and the overrides layer - so an edit to
  // "every scavenger" lands on both surfaces, which is the thing Paolo ruled.
  function personFields(nx, ny, i, seed, zone, home, ns) {
    var salt = 0;
    if (ns) for (var c = 0; c < ns.length; c++) salt = (Math.imul(salt, 131) + ns.charCodeAt(c)) | 0;
    var r = h2(nx * 8191 + i, ny * 131 + i, ((seed | 0) + 5701 + salt) | 0);
    return {
      id: (ns ? ns + ':' : '') + nx + ':' + ny + ':' + i,
      ns: ns || '',
      nx: nx, ny: ny, i: i,
      zone: zone,                       // cluster | spread | loner
      home: [home[0], home[1]],         // fine-grid cell
      look: (r >>> 3) & 7,              // which tint of the rig this body wears
      face: r & 7,                      // which of the 8 facings they idle in
      archetype: ARCHETYPES[(r >>> 6) % ARCHETYPES.length],
      // SCHEDULE IS A REFERENCE, NOT A COPY. bohemia_agents.js owns what a day
      // looks like; this only says which seed to ask it with, so the two
      // modules can never disagree about a person's routine (ENGINE SYNC LAW).
      scheduleSeed: r,

      // ==== THE ADDRESS BOOK (7/31) ========================================
      // Paolo, 7/31: "how other greate games make everyone have their own
      // INDIVIDUAL SCHEDULE". The research
      // (records/BOHEMIA_RESEARCH_INDIVIDUAL_SCHEDULES_7_31_26.md) found the
      // one pattern every reference shares: NOBODY AUTHORS 300 DAYS. They
      // author a GRAMMAR and 300 ADDRESS BOOKS. The SHAPE of a day is shared;
      // the FACTS of the person make it individual.
      //
      // Ultima VII is the origin and the exact shape: every shopkeeper runs the
      // SAME base schedule and differs by "a few unique identifiers - home,
      // work" plus a personal idle and weekend. Our four archetypes are that
      // shared base and they are FINE. What was missing was everything below.
      //
      // THIS IS NOT A SECOND SCHEDULE SYSTEM. bohemia_agents.js still owns WHEN
      // and WHAT KIND (home / work / street). This owns WHICH PLACE, WHICH
      // CONDITIONS, and WHICH EDGES. That split is the whole trick and it keeps
      // the ENGINE SYNC LAW intact.

      // WHERE THEY WORK. A bearing and a distance, not a district name - naming
      // the workplace is the surface's job because only the surface knows what
      // is actually there. Two people with identical schedules walk different
      // ways to work, which is the cheapest individuality on the list.
      workDir: ['N', 'E', 'S', 'W', 'NE', 'SE', 'SW', 'NW'][(r >>> 9) & 7],
      workDist: 1 + ((r >>> 13) % 3),

      // THE ONE PLACE THEY GO THAT IS NOT WORK. Shadows of Doubt gives every
      // citizen a favourite bar; this is that, as a bearing off home.
      favDir: ['N', 'E', 'S', 'W', 'NE', 'SE', 'SW', 'NW'][(r >>> 16) & 7],

      // ==== CONDITIONS (Stardew's trick) ====================================
      // PAOLO, 7/31, AND HE WAS RIGHT: "WHOOPTY FUCKING DOO ITS NOT GONNA RAIN
      // SO SO MUCH SO AWESOME."
      //
      // The first cut of this hung individuality on RAIN. Las Vegas gets rain
      // about once a month (his own 7/28 weather ruling: sunny > cloudy > rain,
      // NOT diverse), so a wet-weather habit changes behaviour on roughly 3% of
      // days. That is not a difference between two people, it is a rounding
      // error, and he spotted it immediately.
      //
      // THE CONDITION THAT FIRES EVERY SINGLE DAY IN THE MOJAVE IS HEAT.
      // Our own food-ceiling research already says it - "SEASONS INVERT: winter
      // is the growing season, summer is survival under shade cloth" - and
      // bohemia_agents.js's scav schedule ALREADY shelters at midday and calls
      // it, in its own comment, the "Mojave midday shelter". The canon said heat
      // was the daily driver and I built the rare one instead.
      //
      // HEAT TOLERANCE, 0-3, and it fires EVERY day between 11:00 and 16:00.
      // 0 = works straight through the worst of it. 3 = will not be outdoors at
      // noon for anything. This is the one that actually separates people,
      // because every single day asks the question.
      heatTol: (r >>> 20) & 3,
      // NIGHT OWL: the other daily one. Some people move after dark and some
      // will not - and LIGHT=TERRITORY means that choice is about whether their
      // block has a live circuit. Also every day.
      nightOut: ((r >>> 22) % 3) === 0,
      // whether a DEAD circuit keeps them in after dark. Daily.
      darkStay: ((r >>> 24) % 4) < 3,
      // RAIN KEPT, AND DEMOTED TO WHAT IT IS: a rare event that makes a rare day
      // feel different. It is flavour on ~3% of days, not the mechanism.
      wetStay: ((r >>> 27) % 5) < 2,

      // ==== THE EDGES (Ultima VII's idle + weekend variants) ================
      // The research's third finding: the distinctive part of a day is the
      // BEGINNING, the END and the exceptions - never the eight hours in the
      // middle. These shift only the edges of whatever the archetype says.
      earlyBy: ((r >>> 26) % 5) * 15 - 30,   // -30..+30 min on the morning edge
      duskSit: ((r >>> 29) & 1) === 1        // sits out at dusk before turning in
    };
  }

  // WHICH PLACE, given what the schedule said. agents.js answers 'home' |
  // 'work' | 'street'; this answers WHOSE home, WHICH work, WHICH street - and
  // applies the person's own conditions on top.
  //
  // `ctx` is what the SURFACE knows and this module does not: {wet, dark,
  // powered}. Passed in rather than imported, so this stays a pure function of
  // a person plus the weather.
  //
  // Returns 'home' | 'work' | 'street', already conditioned. The surface then
  // resolves that to a cell using workDir/workDist/favDir.
  // HEAT_HOURS is when the Mojave is actually punishing. Named rather than
  // inlined because it is the same window bohemia_agents.js's scav schedule
  // already shelters through, and if that ever moves this must move with it.
  var HEAT_FROM = 11 * 60, HEAT_TO = 16 * 60;

  function placeFor(p, where, ctx) {
    ctx = ctx || {};
    if (where === 'home') return 'home';
    // THE CONDITIONS, and they only ever send somebody HOME - never out. A rule
    // that pushes people onto the street in bad weather would be inventing
    // behaviour; a rule that keeps them in is the one real life supports.
    //
    // HEAT FIRST, because it is the one that fires every day. A person with
    // heatTol 3 is indoors through the worst of it, 2 through the peak hour, 1
    // only at the very peak, 0 never stops. Cloud cover takes the edge off, so
    // a grey day puts some of them back outside - which is what makes a cloudy
    // day visibly different from a clear one WITHOUT needing rain.
    var m = ctx.min | 0;
    if (m >= HEAT_FROM && m < HEAT_TO) {
      var bite = p.heatTol - (ctx.cloudy ? 1 : 0);
      if (bite >= 3) return 'home';
      if (bite === 2 && m >= 12 * 60 && m < 15 * 60) return 'home';
      if (bite === 1 && m >= 13 * 60 && m < 14 * 60) return 'home';
    }
    if (ctx.dark && !p.nightOut) {
      if (p.darkStay && !ctx.powered) return 'home';
    }
    if (ctx.wet && p.wetStay) return 'home';
    return where;
  }

  // Is this person out at their FAVOURITE spot rather than plain street? Only
  // at the dusk edge, only for the ones who do it. This is Ultima VII's idle
  // variant: the same day, with a personal ending.
  function atFavourite(p, minOfDay) {
    return !!(p.duskSit && minOfDay >= 17 * 60 && minOfDay < 20 * 60);
  }

  // ---- CONDITIONING A REAL SCHEDULE (7/31) ---------------------------------
  // THE SPLIT THIS LANE WROTE DOWN, MADE EXECUTABLE. bohemia_agents.js owns
  // WHEN and WHAT KIND. This module owns WHICH PLACE, WHICH CONDITIONS, WHICH
  // EDGES. placeFor answers that for a surface that asks per frame (the CITY
  // tab). conditionSchedule answers it for a surface that runs a real pathing
  // sim off a BAKED day (the RUN) - the same conditions, the same person, the
  // same single derivation point, applied to a schedule agents.js built.
  //
  // WHY THIS EXISTS AT ALL: after the heat condition landed, the CITY tab
  // emptied at midday and the RUN did not. Both surfaces agreed on the
  // head-count and disagreed on the day, which is the exact split two days of
  // this lane went into closing. The backlog said the fix was five lines in
  // WORLD's module (an opts.personFor hook on makeAgent) and that this lane
  // could not write them. THAT WAS THE WRONG FRAME. makeAgent derives kind and
  // shift, which is WHEN and WHAT KIND - agents.js's, correctly, and nothing
  // here wants them. What the run was missing is WHICH PLACE under a condition,
  // which is THIS module's half, and a caller may apply it to its own agents
  // without WORLD's file changing by one character.
  //
  // IT IS NOT A DRAW-TIME LIE. The run's sim re-reads `agent.sched` through the
  // agent module's own lookup on every tick (bohemia_agents.js step()), so a
  // conditioned block
  // makes the body actually WALK HOME and stand in its own front room. Hiding
  // people in the draw while the sim still walks them down the street was named
  // as a wrong answer in the backlog and it stays named.
  //
  // NOTHING ABOUT THE SHAPE IS INVENTED HERE: every block boundary that is not
  // a condition edge is agents.js's, every act is agents.js's, and the day still
  // tiles [0, DAY) exactly once. The one act this adds is 'shade', for the
  // hours a person is home BECAUSE OF a condition rather than because their
  // archetype said so - and homeSpotFor puts an unknown act in the common room,
  // which is where somebody waiting out 43 degrees actually sits.
  //
  // ctx: {cloudy, wet, powered, night:[from,to]}. night defaults to 20:00-05:00
  // and is evaluated PER SEGMENT, because a baked day cannot take "is it dark"
  // as one boolean the way a per-frame surface can.
  var NIGHT_FROM = 20 * 60, NIGHT_TO = 5 * 60;
  var DAY_MIN = 1440;

  // NO "WHERE IS THIS PERSON AT MINUTE M" LOOKUP LIVES IN THIS FILE, AND THAT
  // IS DELIBERATE. One was written here and zone_map_gate caught it inside the
  // same turn: bohemia_agents.js already owns that answer, and a
  // second three-line scan of a block list sitting next to it is exactly the
  // fork the ENGINE SYNC LAW forbids - small enough to feel harmless, which is
  // how every fork starts. Anything that needs to READ a schedule goes through
  // agents.js; a gate that needs to VERIFY one computes it independently, which
  // is a gate's job anyway. The diff below compares the blocks themselves.

  // THE MORNING EDGE, and only the morning edge - kept SEPARATE from the
  // conditions on purpose. Ultima VII's lesson and the research's: the middle
  // of a day is never what makes a person distinctive, so earlyBy slides the
  // first wake and nothing else, moving a person's whole morning relative to
  // their neighbour's without touching the archetype's shape.
  //
  // WHY IT IS ITS OWN FUNCTION: an EDGE legitimately puts somebody on the
  // street half an hour before their archetype would have. A CONDITION never
  // may. Folding the two together made the law "conditions only ever send
  // somebody home" unprovable, because the shift looked exactly like a
  // violation. Split, each one is checkable on its own, and the gate checks
  // both.
  function shiftEdges(sched, p) {
    if (!sched || sched.length < 2 || !p || !p.earlyBy) return sched;
    var out = [], i;
    for (i = 0; i < sched.length; i++) out.push({ t0: sched[i].t0, t1: sched[i].t1, act: sched[i].act, where: sched[i].where });
    if (out[0].act !== 'sleep') return out;
    var t = Math.max(1, Math.min(out[0].t1 + p.earlyBy, out[1].t1 - 1));
    out[0].t1 = t; out[1].t0 = t;
    return out;
  }

  function conditionSchedule(sched, p, ctx) {
    if (!sched || !sched.length || !p) return sched;
    ctx = ctx || {};
    var nf = (ctx.night && ctx.night.length === 2) ? ctx.night[0] : NIGHT_FROM;
    var nt = (ctx.night && ctx.night.length === 2) ? ctx.night[1] : NIGHT_TO;
    var isDark = function (m) { return (nf > nt) ? (m >= nf || m < nt) : (m >= nf && m < nt); };

    var blocks = [], i;
    for (i = 0; i < sched.length; i++) blocks.push({ t0: sched[i].t0, t1: sched[i].t1, act: sched[i].act, where: sched[i].where });

    // CUT at every edge a condition can turn on or off, then ask placeFor once
    // per resulting segment. Cutting rather than sampling is what keeps this
    // exact: a segment either is conditioned for its whole length or is not.
    var cuts = {};
    cuts[0] = 1; cuts[DAY_MIN] = 1;
    for (i = 0; i < blocks.length; i++) { cuts[blocks[i].t0] = 1; cuts[blocks[i].t1] = 1; }
    var edges = [HEAT_FROM, 12 * 60, 13 * 60, 14 * 60, 15 * 60, HEAT_TO, nf, nt];
    for (i = 0; i < edges.length; i++) if (edges[i] > 0 && edges[i] < DAY_MIN) cuts[edges[i]] = 1;
    var ts = Object.keys(cuts).map(Number).sort(function (a, b) { return a - b; });

    var out = [], bi = 0;
    for (i = 0; i + 1 < ts.length; i++) {
      var t0 = ts[i], t1 = ts[i + 1];
      if (t1 <= t0) continue;
      while (bi < blocks.length - 1 && blocks[bi].t1 <= t0) bi++;
      var src = blocks[bi];
      if (!src || src.t1 <= t0 || src.t0 > t0) {           // find it honestly rather than assume
        src = null;
        for (var k = 0; k < blocks.length; k++) if (blocks[k].t0 <= t0 && blocks[k].t1 > t0) { src = blocks[k]; break; }
        if (!src) src = blocks[blocks.length - 1];
      }
      var mid = (t0 + t1) >> 1;
      var got = placeFor(p, src.where, {
        min: mid, cloudy: !!ctx.cloudy, wet: !!ctx.wet,
        powered: !!ctx.powered, dark: isDark(mid)
      });
      var act = (got === src.where) ? src.act : 'shade';
      var last = out.length ? out[out.length - 1] : null;
      if (last && last.act === act && last.where === got) last.t1 = t1;
      else out.push({ t0: t0, t1: t1, act: act, where: got });
    }
    return out;
  }

  // Apply the conditions to a whole block of agents that agents.js already
  // built. The caller owns its agents; this only rewrites the half that is
  // this module's to own. Returns how many days it changed, so a gate can tell
  // "ran" from "did something".
  function conditionAgents(agents, people, ctx) {
    if (!agents || !agents.length) return 0;
    var n = 0;
    for (var i = 0; i < agents.length; i++) {
      var a = agents[i], p = people && people[i];
      if (!a || !a.sched || !p) continue;
      // ALWAYS CONDITION THE ORIGINAL, NEVER THE LAST RESULT. Re-applying to an
      // already-conditioned day compounds: conditionSchedule is idempotent on
      // `where`, but shiftEdges is NOT - it would slide the morning edge again
      // on every bulk edit, so a person's wake time would drift 30 minutes
      // earlier every time Paolo edited anybody. Caught by the gate's own
      // edit-then-unedit round trip, which is why that round trip is in it.
      if (!a.schedRaw) a.schedRaw = a.sched;
      var was = a.sched, s = conditionSchedule(shiftEdges(a.schedRaw, p), p, ctx);
      a.person = p;                       // the facts travel WITH the body
      a.sched = s;
      // "changed" is a straight comparison of the two block lists, held rather
      // than overwritten first. Comparing the blocks needs no schedule reader
      // at all, which is the point: see the note above conditionSchedule.
      var diff = (was.length !== s.length);
      for (var k = 0; !diff && k < s.length; k++)
        diff = (s[k].t0 !== was[k].t0 || s[k].t1 !== was[k].t1 || s[k].where !== was[k].where);
      if (diff) n++;
    }
    return n;
  }

  // One person record per agent on a RUN block, derived and then run through
  // the overrides layer - derivation THEN overrides, in that order, exactly as
  // peopleIn does it for the CITY tab, so neither surface can ever see an
  // unedited body. `tx,ty` is the overmap cell the block sits on.
  function peopleForAgents(agents, tx, ty, seed, zone) {
    var out = [];
    for (var i = 0; i < (agents ? agents.length : 0); i++) {
      var a = agents[i];
      /* A VISITOR IS CONDITIONED BY WHERE THEY LIVE, NOT WHERE THEY STAND.
         Workers who commute in from a neighbouring block are on this cell's
         roster (they are standing here) but their character comes from (cell,
         index) - so deriving them from THIS cell would give the same person one
         personality at the clinic and a different one in their own yard, which
         is the same class of bug as keying their identity to the wrong cell.
         Their home cell and their index in their home roster travel with them.
         AND THIS IS WHAT PUTS THEM INSIDE MASS EDITS (Paolo 7/29): a visitor with
         no person record is a body no rule can reach, and "editing people means
         adding a rule" has to mean every body on the surface. */
      if (a && a.visiting && a.fromCell && a.homeIndex != null) {
        out.push(applyRules(personFields(a.fromCell[0], a.fromCell[1], a.homeIndex,
                                         seed, zone || 'spread', a.fromCell, 'run')));
      } else {
        out.push(applyRules(personFields(tx, ty, i, seed, zone || 'spread', [tx, ty], 'run')));
      }
    }
    return out;
  }

  // ---- THE OVERRIDES LAYER -------------------------------------------------
  // A rule is { name, where(person) -> bool, set: {field: value | fn(person)} }.
  // Applied in order, on read. EMPTY BY LAW until Paolo rules contents.
  var OVERRIDES = [];

  // RULES VERSION, and it is not bookkeeping - it is what makes a mass edit
  // actually reach the screen. Surfaces CACHE their people (deriving 300
  // records every frame would be absurd), so a cache that does not know the
  // rules changed will happily keep serving pre-edit bodies forever. Every
  // consumer keys its cache on this number. Bumped by any mutation.
  var RULES_V = 0;
  function rulesVersion() { return RULES_V; }

  function addRule(rule) {
    if (!rule || typeof rule.where !== 'function' || !rule.set) return null;
    OVERRIDES.push(rule); RULES_V++;
    return rule;
  }
  function removeRule(name) {
    var n = OVERRIDES.length;
    for (var i = OVERRIDES.length - 1; i >= 0; i--) if (OVERRIDES[i].name === name) OVERRIDES.splice(i, 1);
    if (OVERRIDES.length !== n) RULES_V++;
    return n - OVERRIDES.length;
  }
  function clearRules() { if (OVERRIDES.length) { OVERRIDES.length = 0; RULES_V++; } }
  function rules() { return OVERRIDES.slice(); }

  function applyRules(p) {
    for (var k = 0; k < OVERRIDES.length; k++) {
      var r = OVERRIDES[k];
      var hit = false;
      try { hit = !!r.where(p); } catch (e) { hit = false; }
      if (!hit) continue;
      for (var f in r.set) {
        var v = r.set[f];
        p[f] = (typeof v === 'function') ? v(p) : v;
      }
    }
    return p;
  }

  // ---- READING PEOPLE ------------------------------------------------------
  // The ONLY way anything gets a person. Derivation then overrides, always in
  // that order, so a surface can never see an unedited body.
  function peopleIn(om, POWER, nx, ny, seed, FN, pick, cap) {
    var homes = homesIn(om, POWER, nx, ny, seed, FN, pick, cap);
    if (!homes.length) return [];
    var zone = zoneAt(om, POWER, nx * NB, ny * NB, seed);
    var out = [];
    for (var i = 0; i < homes.length; i++) {
      out.push(applyRules(personFields(nx, ny, i, seed, zone, homes[i])));
    }
    return out;
  }

  // Valley-wide, for bulk operations and for the gate. Walks every residential
  // neighbourhood once.
  function allPeople(om, POWER, seed, FN, overN, pick) {
    var N = overN || 96, seen = {}, out = [];
    for (var ty = 0; ty < N; ty++) for (var tx = 0; tx < N; tx++) {
      var c = om.at ? om.at(tx, ty) : null;
      if (!c || !RESIDENTIAL[c.district]) continue;
      var n = neighbourhoodOf(tx, ty), k = n[0] + ',' + n[1];
      if (seen[k]) continue; seen[k] = 1;
      var ppl = peopleIn(om, POWER, n[0], n[1], seed, FN, pick, 24);
      for (var j = 0; j < ppl.length; j++) out.push(ppl[j]);
    }
    return out;
  }

  // A named filter helper so callers write intent, not index arithmetic.
  function where(list, pred) {
    var out = [];
    for (var i = 0; i < list.length; i++) if (pred(list[i])) out.push(list[i]);
    return out;
  }

  // THE ADAPTER, AND IT IS THE POINT OF THIS WHOLE MODULE.
  //
  // engine/bohemia_agents.js (the WORLD lane's) ALREADY holds a two-plane
  // census and sim, and censusForPlot/censusForBlock already accept a per-call
  // `occupiedRate`. What it did NOT have was any idea that one neighbourhood
  // should be a settlement and the next one should be empty — it applied ONE
  // flat OCCUPIED_RATE=0.30 to the entire valley, whose own source comment
  // calls it "a PLACEHOLDER... [PENDING Paolo]". Paolo's 7/29 ruling answered
  // that pending item and replaced the flat rate with a MAP.
  //
  // So this module does not reimplement anything. It computes the rate the
  // existing machinery already knows how to take, per neighbourhood, and hands
  // it over. No edit to the agent module, no second census, no fork — the
  // ENGINE SYNC LAW holds and the ruling reaches the simulation that is
  // already running.
  //
  // HOUSEHOLD_MEAN is agents.js's own distribution (1p 30% / 2p 35% / 3p 20% /
  // 4p 15%), read off its header rather than assumed, because if that
  // distribution ever changes this rate must move with it.
  var HOUSEHOLD_MEAN = 2.2;

  // ==========================================================================
  // THE POPULATION DIAL (Paolo 8/1: "why don't you do some coding plumbing right
  // now till I make a population slider ... I think this is gonna be extremely
  // important anyway as we go throughout the three acts ... it should be
  // something that's extremely easy to control ... the slider can go all the way
  // from zero to a maximum")
  //
  // ONE NUMBER. Everything that asks how many people live somewhere multiplies
  // by it, so how full the valley is becomes a single thing he can drag instead
  // of an argument between three files. This is the plumbing for the slider HE
  // is going to make; the slider is his, the wiring is mine.
  //
  // WHY IT EXISTS AT ALL, measured 8/1 and written up in
  // records/BOHEMIA_HOW_MANY_PEOPLE_CONTRADICTION_8_1_26.md: the flat placeholder
  // in bohemia_agents.js said 8,282 people in the valley, the zone map said 60,
  // and GDD v5 says ~69,000 survive. Three answers, three orders of magnitude,
  // no way to move any of them without editing code. Now there is one.
  //
  // THE SCALE, and it is deliberately not a percentage:
  //   0    A GHOST VALLEY. Not "fewer people" - NOBODY. Act 3 wipeout, a dead
  //        cell, a difficulty setting. It has to be reachable or the bottom of
  //        the slider is a lie.
  //   1    exactly what the zone map computes today. The default, so nothing
  //        anywhere changes until somebody moves it.
  //   MAX  the fullest the valley is allowed to get. Every cell that could hold
  //        anybody holds as many as its homes physically fit.
  // Between 0 and 1 it thins the same valley; above 1 it fills it. The zone
  // map's SHAPE is preserved either way - clusters stay clusters and no man's
  // lands stay empty, per his 7/29 ruling. This dial says HOW MANY, never WHERE.
  //
  // THE ACT TABLE SHIPS EMPTY. Three acts probably want three settings, he said
  // so in the same breath, and WHICH numbers is his call. dialForAct() returns
  // null until he fills it in, and the gate fails if a row lands unruled.
  // MAX RAISED 8/1 from 4 to 32: the scale-model arithmetic says the valley holds
  // ~1,113 people, and the zone-map path yields 60 at dial 1, so the truthful
  // setting is around 19. A slider that cannot reach the right answer is a broken
  // slider. 32 leaves headroom above it without being meaningless (the map's
  // physical ceiling is 26,972 people - every drawn home full).
  var DIAL_MIN = 0, DIAL_MAX = 32;
  var DIAL = 1;                    // "leave the world exactly as it was"
  var ACT_DIAL = {};               // act -> dial. HIS. EMPTY.
  // ==========================================================================
  // PER-DISTRICT DIALS — the plumbing for REPAIRING A DISTRICT
  // (Paolo 8/1: "when you fully repair a district, kind of like Stardew Valley -
  // get rid of all the junk cars and make sure the electricity is on, solar
  // panels everywhere - then more people will want to move in and live in the
  // recovered ruins ... maybe towards the middle end of act one")
  //
  // The global dial says how full the WHOLE valley is. His idea needs one cell to
  // move on its own: you fix this district, THIS district fills up, and the one
  // next door does not. So a cell can carry its own multiplier on top of the
  // global one, and repopulation becomes a thing the player CAUSES rather than a
  // number somebody types.
  //
  // GROUNDED, and it says he is right: studies of 63 post-disaster infrastructure
  // recoveries find that returning population is contingent on critical services
  // - electricity, potable water, sanitation - and that those systems are
  // mutually interdependent. People come back when the lights and the taps work.
  // That is exactly the loop he described.
  //
  // WHAT SHIPS EMPTY AND STAYS EMPTY: what COUNTS as repaired, and how much
  // population each repair is worth. REPAIR_WORTH is his table. This module only
  // knows how to APPLY a number, never how to earn one - no session may decide
  // that hauling ten junk cars is worth thirty people.
  var CELL_DIAL = {};              // "x,y" -> multiplier. Set by whatever repairs.
  var REPAIR_WORTH = {};           // repair -> dial gain. HIS. EMPTY.
  function cellKey(cx, cy) { return (cx | 0) + ',' + (cy | 0); }
  function cellDial(cx, cy) {
    var v = CELL_DIAL[cellKey(cx, cy)];
    return v == null ? 1 : v;
  }
  function setCellDial(cx, cy, v) {
    v = Number(v);
    if (!isFinite(v)) return cellDial(cx, cy);
    v = v < DIAL_MIN ? DIAL_MIN : (v > DIAL_MAX ? DIAL_MAX : v);
    CELL_DIAL[cellKey(cx, cy)] = v;
    return v;
  }
  function clearCellDials() { CELL_DIAL = {}; }
  function repairWorth(repair) {
    return Object.prototype.hasOwnProperty.call(REPAIR_WORTH, repair)
      ? REPAIR_WORTH[repair] : null;
  }
  /* the whole answer for one cell: the valley's dial times this cell's own. */
  function dialAt(cx, cy) { return DIAL * cellDial(cx, cy); }

  function dial() { return DIAL; }
  function setDial(v) {
    v = Number(v);
    if (!isFinite(v)) return DIAL;
    DIAL = v < DIAL_MIN ? DIAL_MIN : (v > DIAL_MAX ? DIAL_MAX : v);
    return DIAL;
  }
  function dialForAct(act) {
    return Object.prototype.hasOwnProperty.call(ACT_DIAL, act) ? ACT_DIAL[act] : null;
  }
  /* the one place the dial is applied, so no caller can forget it */
  function applyDial(rate, cx, cy) {
    if (!(rate > 0)) return 0;
    var r = rate * (cx == null ? DIAL : dialAt(cx, cy));
    return r < 0 ? 0 : (r > 1 ? 1 : r);
  }

  function occupiedRateFor(om, POWER, tx, ty, seed, homesInPlot) {
    var n = neighbourhoodOf(tx, ty), nx = n[0], ny = n[1];
    var s = surveyNeighbourhood(om, nx, ny);
    if (!s.res) return 0;
    var heads = headsAt(om, POWER, tx, ty, seed);
    if (!heads) return 0;
    var homes = homesInPlot || 6;              // plots the surface has not measured
    // the neighbourhood's people spread over its own residential cells
    var perCell = heads / s.res;
    var rate = perCell / (homes * HOUSEHOLD_MEAN);
    /* THE DIAL IS THE LAST WORD, and a REPAIRED cell carries its own on top of
       the valley's. At 0 this returns 0 everywhere; at 1 it is exactly the zone
       map; a cell somebody has fixed up returns more than its neighbours. */
    return applyDial(rate, tx, ty);
  }

  // CONTENTS ARE PAOLO'S. No names, no factions, no dialogue. The mechanism
  // ships empty and stays empty until he rules.
  var NAMES = [];

  var API = { RESIDENTIAL: RESIDENTIAL, DRAW: DRAW, SHARE: SHARE, HEADS: HEADS, NB: NB,
              zoneAt: zoneAt, headsAt: headsAt, homesIn: homesIn, census: census,
              occupiedRateFor: occupiedRateFor, HOUSEHOLD_MEAN: HOUSEHOLD_MEAN, weightOf: weightOf,
              dial: dial, setDial: setDial, applyDial: applyDial,
              cellDial: cellDial, setCellDial: setCellDial, clearCellDials: clearCellDials,
              dialAt: dialAt, REPAIR_WORTH: REPAIR_WORTH, repairWorth: repairWorth,
              DIAL_MIN: DIAL_MIN, DIAL_MAX: DIAL_MAX,
              ACT_DIAL: ACT_DIAL, dialForAct: dialForAct,
              ARCHETYPES: ARCHETYPES, personFields: personFields, peopleIn: peopleIn,
              placeFor: placeFor, atFavourite: atFavourite, HEAT_FROM: HEAT_FROM, HEAT_TO: HEAT_TO,
              allPeople: allPeople, where: where,
              conditionSchedule: conditionSchedule, conditionAgents: conditionAgents, shiftEdges: shiftEdges,
              peopleForAgents: peopleForAgents,
              NIGHT_FROM: NIGHT_FROM, NIGHT_TO: NIGHT_TO,
              addRule: addRule, removeRule: removeRule, clearRules: clearRules, rules: rules,
              applyRules: applyRules, rulesVersion: rulesVersion,
              neighbourhoodOf: neighbourhoodOf, hash: h2, NAMES: NAMES };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  root.BohemiaPopulation = API;
})(typeof window !== 'undefined' ? window : globalThis);
