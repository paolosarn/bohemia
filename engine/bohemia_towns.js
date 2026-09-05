// BOHEMIA FACTION TOWNS (9/5/26, WORLD lane) — FACTION-TOWNS.
//
// Paolo 9/4, LOCKED (laws/BOHEMIA_ADDENDUM_FACTION_TOWNS_9_4_26.md):
//   "each part of Vegas is owned by a faction and that's where you can do all your
//    trading or whatever they'll have different buildings supporting them...
//    there's different sizes of cities so maybe the more bigger or more prominent
//    factions kind of feel like strong fortress parts... and then for the smaller
//    ones like the colorful maybe they just have... not a lot of goods not a lot of
//    buildings not a lot of good quests and it's just smaller."
//
// A faction's SEAT is where you trade. Three tiers: FORTRESS / TOWN / CAMP.
//
// ============================================================================
// THE TIER IS DERIVED, NEVER TYPED.
// His own faction graph already carries act1_power and act3_power for every
// faction (BOHEMIA_faction_graph.json, GDD v2 s9). Rank them, cut in thirds. So a
// FORTRESS in act 1 can be a CAMP by act 3 and the reverse, which is the CENTURY
// RULE with no new field and no second table to keep in step.
// THE DERIVATION CHECKS OUT AGAINST HIS OWN WORDS, which is why it is this and not
// a hand-written list: he named "the colorful" as the small one, and Colorful is
// act1_power 1 of 14 -- the bottom of the graph he wrote months earlier. Nothing
// was tuned to make that land.
// Every tier ships `draft:true`. Moving any faction up or down is one edit.
//
// ============================================================================
// *** WHY THIS MODULE OWNS THE SEAT RULE, AND IT IS A BUG FIX, NOT A FEATURE ***
//
// MEASURED 9/5, on one seed, before writing any of this:
//     the loop's district list   3,919 cells
//     the city's district list   4,009 cells
//     the 14 seats they produce  DIFFERENT
// Both are the same 96x96 valley on seed "bohemia". bohemia_loop.js's bootFactions
// strides over cells passing bohemia_world.js's `isAutoDistrict`; the walked
// surface cannot even load that module (it carries bohemia_overmap.js instead) and
// its own notion of a real district is bohemia_cityedit.js's `cat(d)==='sand'`.
// Ninety cells of disagreement, and therefore two different answers to "where does
// the Mob live".
//
// Nothing had noticed because nothing had ever asked the walked surface the
// question: the city's own FACTION_ASSIGN table is `{}` and its comment says so.
// The first thing that asked found the drift.
//
// SO THE RULE LIVES HERE, ONCE, AND CALLERS PASS THE MAP RATHER THAN THE ANSWER.
// districtsOf() reads the overmap through `cat`, which is the definition BOTH
// surfaces can reach, so the loop and the city can agree by construction instead of
// by coincidence. Same reason PRICES is built from the economy's own GOODS instead
// of a list typed by hand, and the same reason the street contract measures its
// connectors off built tiles instead of a declaration: two systems drift the day
// somebody edits one of them.
//
// ============================================================================
// MECHANISM MINE, CONTENTS HIS.
//   WHICH FACTION SITS WHERE IS HIS (MAP LAW: Claude never designs map layouts).
//   SEATS ships EMPTY. What derive() produces is a mechanical spread across
//   whatever the map already generated -- the same shape bootFactions has used
//   since it was written, and its own comment already argues why that is plumbing
//   rather than a layout decision. One line in SEATS moves a faction anywhere and
//   the override wins.
//   WHAT A TOWN SELLS is BB-WANTS' and BB-PRICE-PLACE's row, not this one. What is
//   here is HOW MANY goods a tier carries, which is his sentence "not a lot of
//   goods" turned into a count, taken off the economy's own list in the economy's
//   own order. No good is invented and no good is chosen.
//   WHAT ANYTHING COSTS is already ruled: everything is one battery (8/15 + 9/4).
//   A camp is not more expensive than a fortress, it is THINNER. Depth is the axis
//   his words actually name.
(function (root) {
  'use strict';

  var TIERS = ['fortress', 'town', 'camp'];

  /* HIS OVERRIDES. EMPTY, and it stays empty until he rules one:
       SEATS['Mob'] = { x: 61, y: 44 };
     An override wins over the derived seat and needs nothing else changed. */
  var SEATS = {};

  /* SAME DOOR FOR TIER. EMPTY:  TIER['Colorful'] = 'town'; */
  var TIER = {};

  function isSelectable(f) { return !!f && f.type === 'selectable'; }

  /* THE ROSTER, IN ONE ORDER, ALWAYS. Sorted by id so a seat is the same on every
     device and every load -- the same reason identity in the city is derived from
     three numbers rather than stored. */
  function selectable(graph) {
    var fs = (graph && graph.factions) || {}, out = [], k;
    for (k in fs) if (Object.prototype.hasOwnProperty.call(fs, k) && isSelectable(fs[k])) out.push(k);
    return out.sort();
  }

  /* ---------------------------------------------------------------------------
     THE TIER. Rank by the act's own power column, cut in thirds.
     A faction with no power number for this act keeps its act-1 rank, because a
     missing number is not a demotion -- `Custom` has act3_power null and is the
     player's own outfit, and dropping it to CAMP for a null would be a ruling.
     --------------------------------------------------------------------------- */
  function powerOf(f, act) {
    if (!f) return null;
    var p = (act === 3) ? f.act3_power : f.act1_power;
    if (p == null) p = f.act1_power;
    return (typeof p === 'number') ? p : null;
  }

  function tiers(graph, act) {
    var ids = selectable(graph), fs = (graph && graph.factions) || {};
    var ranked = ids.slice().sort(function (a, b) {
      var pa = powerOf(fs[a], act), pb = powerOf(fs[b], act);
      if (pa === pb) return a < b ? -1 : 1;          /* stable, never random */
      if (pa == null) return 1;
      if (pb == null) return -1;
      return pb - pa;                                 /* strongest first */
    });
    /* THIRDS, and the top third rounds UP so a fourteen-faction valley has five
       fortresses rather than four -- "the more prominent factions" is a group, not
       a podium. */
    var third = Math.ceil(ranked.length / 3);
    var out = {};
    for (var i = 0; i < ranked.length; i++) {
      var t = (i < third) ? 'fortress' : (i >= ranked.length - third ? 'camp' : 'town');
      var id = ranked[i];
      out[id] = {
        faction: id,
        tier: Object.prototype.hasOwnProperty.call(TIER, id) ? TIER[id] : t,
        ruled: Object.prototype.hasOwnProperty.call(TIER, id),
        rank: i + 1,
        power: powerOf(fs[id], act),
        act: act === 3 ? 3 : 1,
        draft: !Object.prototype.hasOwnProperty.call(TIER, id)
      };
    }
    return out;
  }

  /* ---------------------------------------------------------------------------
     THE DISTRICT LIST, READ OFF THE MAP RATHER THAN OFF A SECOND OPINION.
     `cat` is bohemia_cityedit's category function -- the game's own answer to "is
     this a real district you could put a building on". Row-major, which is the
     order bootFactions has always strided in.
     --------------------------------------------------------------------------- */
  /* AND A SEAT HAS TO FRONT A ROAD, because a market you cannot get to is not a
     market. His ruling calls a seat "where you can do all your trading", and the
     STREET-AWARE / DRIVABLE ACCESS LAW already says a plot is only served if the
     network reaches its curb.
     MEASURED, AND THIS IS WHY IT IS HERE RATHER THAN IN A CALLER: without it, seven
     faction seats across the gate's seed set landed on ground payday's own
     reachable() calls FALSE -- ground with no way in. Filtering in the CALLER was the
     obvious fix and it is the wrong one: payday's reachable() needs w.plot(), the
     walked surface has no plot API at all, so the loop would have nudged those seats
     and the city could not have, and the two would disagree again -- which is the
     exact drift this module was written to end. A ROAD NEIGHBOUR IS COMPUTABLE FROM
     `at` ALONE, so both surfaces get the same answer for the same reason. */
  function frontsRoad(m, cat, x, y) {
    var n = m.n | 0, d = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (var i = 0; i < 4; i++) {
      var nx = x + d[i][0], ny = y + d[i][1];
      if (nx < 0 || ny < 0 || nx >= n || ny >= n) continue;
      var c = m.at(nx, ny);
      if (!c || !c.district) continue;
      var k = cat(c.district);
      if (k === 'road' || k === 'freeway') return true;
    }
    return false;
  }

  /* GROUND THAT NEVER CARRIES A BUILDING IS NOT A TOWN. His ruling says in its own
     words that WHAT SUPPORTS A TOWN IS BUILDINGS, and a solar array supports nothing:
     you cannot trade on a photovoltaic field or a runway.
     THIS LIST IS MEASURED, NOT IMAGINED, AND THE MEASUREMENT WAS WIDENED ONCE BECAUSE
     THE FIRST QUESTION WAS THE WRONG ONE.
     The first cut asked which kinds are ALWAYS empty and got four: airbase, airport,
     solar, strip. That still left two seats on ground with nothing on it -- because a
     seat lands on ONE cell, so what matters is not whether a kind is always empty but
     whether it can EVER be. A kind that is usually built and sometimes not will
     eventually put a market on nothing.
     Asked again, exhaustively, over every buildable kind across two seeds: EIGHT kinds
     have at least one plot with zero buildings and FORTY-NINE are built on every plot
     examined. All eight are out, and the unreachable-seat count went 7 -> 2 -> 0,
     re-measured at 84 seats over six seeds.
     It is also the reading that matches his ruling in plain words: a runway, a solar
     field, a fairway and a farm are not parts of a city you trade in.
     faction_towns_gate RE-MEASURES this and goes red naming the kind if any answer
     changes in either direction, so it cannot rot into a list somebody once believed. */
  var NOT_A_TOWN = { airbase: 1, airport: 1, datafort: 1, farm: 1,
                     golf: 1, solar: 1, speedway: 1, strip: 1 };

  function districtsOf(m, cat) {
    var out = [];
    if (!m || typeof m.at !== 'function' || !cat) return out;
    var n = m.n | 0;
    for (var y = 0; y < n; y++) {
      for (var x = 0; x < n; x++) {
        var c = m.at(x, y);
        if (!c || !c.district) continue;
        if (cat(c.district) !== 'sand') continue;
        if (NOT_A_TOWN[c.district]) continue;
        if (!frontsRoad(m, cat, x, y)) continue;
        out.push({ x: x, y: y, kind: c.district });
      }
    }
    return out;
  }

  /* ===========================================================================
     WHERE A FACTION LIVES. HIS OWN NOTES, READ.
     (9/5/26, FACTIONS lane, VAMILY row [faction homes] FACTION-SEATS, landing in
     THIS file because FACTION-TOWNS already moved "which cells count" here and a
     second placer somewhere else is the exact drift this file's header is about.)

     *** WHAT THIS REPLACED, AND IT IS WORSE THAN IT LOOKS. *** The old rule was
     "evenly strided, exactly as bootFactions has done since it was written". The
     district list is 100% ordered by y, so an even stride marches straight down
     the map, and the ids were SORTED. Measured on the real boot before this
     changed:

         correlation(alphabetical rank, seat y) = 0.9966

     Anarchists sat at y=2 and Volunteers at y=83 FOR NO REASON EXCEPT THEIR
     INITIALS. The alphabet was deciding the geography of the valley. And the
     kinds it landed on were nobody's home: the Church on a suburb, the Cartel on
     a solar farm, while the generated map holds a chapel, an arsenal, a police
     station, six dataforts and a hundred and eighteen resorts that nothing ever
     used. "It is the rule that already existed" was true and was not a defence.

     *** HIS NOTES ARE THE PLACEMENT AND THIS IS ONLY READING THEM. *** Every
     faction in BOHEMIA_faction_graph.json carries an authored `note`, and the
     notes name places outright: the Mob "Controls the Strip", the Homeless have a
     "Sewer/tunnel HQ", the Remnants are "Military/law-enforcement survivors incl
     Nellis", the Trades are "Best for vehicle/solar/construction". HOMES is that
     reading and nothing else -- every row quotes the words it rests on, so a
     wrong seat is a MISREADING somebody can check against his file, not a taste
     that has to be argued. MAP LAW is intact: this picks WHICH KIND of generated
     ground an outfit belongs on, it does not design a layout, and one line in
     SEATS still overrides any of it.

     WHERE HIS NOTE NAMES NO PLACE, THIS INVENTS NONE. Three factions say in his
     own words that they do not hold ground -- the Anarchists are "territorially
     inconsistent", the Colorful are "community-based not territorial", the Custom
     faction has "no preset philosophy" because it is the player's. They are
     absent from HOMES on purpose and fall through to spread, and the record lists
     them [PENDING Paolo]: a faction his canon calls non-territorial probably
     should not hold ground the way the Mob does, and that is a ruling.

     STRONGEST PICKS FIRST, USING HIS NUMBER. act1_power is canon, so the order is
     his too: the Remnants (14), Mob (13), Cartel (12) and Network (11) take their
     homes before the Volunteers (3) do, and a weak faction takes what is left.
     =========================================================================== */
  var HOMES = {
    // "Controls the Strip. Ownership/protection/tribute."
    Mob:        ['resort', 'casino', 'convention', 'downtown'],
    // "Military/law-enforcement survivors incl Nellis. The floor of civilization."
    Remnants:   ['arsenal', 'policestation', 'prison', 'firestation'],
    // "Only faction with a manufactured origin" / psyop
    Network:    ['datafort', 'radio', 'substation'],
    /* "Organized human predation. SUPPLY CHAINS MIRROR CARAVAN ROUTES."
       The scavenging ground first, then the SAME KINDS the Caravans want,
       because that second sentence says so in as many words. Measured on the
       shipped seed: not one boneyard, landfill, quarry or railyard in the valley
       fronts a road, so on the first four alone the Cartel -- his third-strongest
       faction, power 12 -- fell through to a random suburb. Loosening the road
       rule to rescue it would have cost the thing the WORLD lane measured
       (unreachable seats 7 -> 2 -> 0); reading his next sentence costs nothing.
       The Cartel outranks the Caravans, so it picks off that shared list first
       and the Caravans take the next one, which is what "mirror" looks like. */
    Cartel:     ['boneyard', 'landfill', 'quarry', 'railyard',
                 'storage', 'warehouse', 'terminal', 'swapmeet'],
    // "Neutral outside-world trade."
    Caravans:   ['truckstop', 'terminal', 'swapmeet', 'warehouse'],
    // "Best crisis organization." / evangelical
    Church:     ['chapel', 'cemetery', 'school'],
    // "Economic engine, compound-interest faction. Not military."
    Reds:       ['downtown', 'cityhall', 'courthouse', 'mall'],
    // "Environmentalist."
    Blues:      ['reservoir', 'watertreat', 'farm', 'park'],
    // "Skilled-worker guild... Best for vehicle/solar/construction."
    Trades:     ['industrial', 'solar', 'battery', 'warehouse'],
    // "Healthcare/education/food/knowledge."
    Volunteers: ['medical', 'campus', 'granary', 'school'],
    // "Sewer/tunnel HQ under the King Hobo."
    Homeless:   ['intake', 'pumpstation', 'reclaim', 'basin', 'wash'],
  };

  var MIN_APART = 6;          /* cells; two capitals on one block is not two capitals */
  /* AND OFF THE BOUNDARY ROWS, WHICH THE MAP GATE CAUGHT. The first cut of this
     put four capitals on the literal edge of the valley (y=0, y=3, y=89) and
     faction_between's own M2 went red: a base marker at the boundary is clipped
     by the map edge and painted 14 pixels against a floor of 20, which is
     "present" rather than "legible" -- the exact distinction that claim was
     written for. A capital on the boundary row is also just odd ground for a
     capital. INSET IS A PREFERENCE, NEVER A VETO: several kinds are unique in the
     whole valley (one arsenal, one truckstop, one granary), so if the only ground
     his note names is at the edge, HIS CANON WINS and the seat goes there. Same
     precedence as the spacing rule. */
  var EDGE_INSET = 5;

  /* TAKES EITHER SHAPE OF DISTRICT LIST. districtsOf() answers {x,y,kind} and the
     loop's own worldMap carries {pos:[x,y],id,kind}; one normaliser here beats two
     callers each remembering which one they hold. */
  function normSeat(d) {
    if (!d) return null;
    var p = d.pos || [d.x, d.y];
    if (p[0] == null || p[1] == null) return null;
    return { x: p[0], y: p[1], kind: d.kind || '?',
             id: (d.id != null) ? d.id : (p[0] + ',' + p[1]) };
  }

  /* THE ONE PLACER. Callers pass the map's districts and get back a seat per
     faction; nobody re-implements the choice. `ids` lets the loop seat every
     faction it loaded rather than only the selectable ones, without this function
     having two opinions about who exists. */
  function placeHomes(graph, districts, act, ids) {
    var out = {}, list = [], i;
    for (i = 0; i < (districts || []).length; i++) {
      var s = normSeat(districts[i]); if (s) list.push(s);
    }
    if (!list.length) return out;
    var fs = (graph && graph.factions) || {};
    var roster = (ids && ids.length) ? ids.slice() : selectable(graph);

    var byKind = {};
    for (i = 0; i < list.length; i++) {
      var k = list[i].kind;
      if (!byKind[k]) byKind[k] = [];
      byKind[k].push(list[i]);
    }

    /* THE VALLEY'S EDGE, ASKED OF THE LIST RATHER THAN TYPED. Callers hold the
       map; this only ever sees cells, so the boundary is the largest coordinate
       any district reached. Wrong only if a whole edge of the map generated no
       districts at all, in which case there is nothing there to sit on anyway. */
    var size = 0;
    for (i = 0; i < list.length; i++) {
      if (list[i].x + 1 > size) size = list[i].x + 1;
      if (list[i].y + 1 > size) size = list[i].y + 1;
    }

    var taken = {}, seats = [];
    function inland(d) {
      return d.x >= EDGE_INSET && d.y >= EDGE_INSET
          && d.x <= size - 1 - EDGE_INSET && d.y <= size - 1 - EDGE_INSET;
    }
    function farEnough(d) {
      for (var j = 0; j < seats.length; j++)
        if (Math.abs(seats[j][0] - d.x) + Math.abs(seats[j][1] - d.y) < MIN_APART) return false;
      return true;
    }
    /* DETERMINISTIC AND NOT ALPHABETICAL: the same faction lands on the same
       ground in the same world every boot, but its initials have nothing to do
       with where. A capital that moves when you reload is not a capital. */
    function pickFrom(cands, fid) {
      if (!cands || !cands.length) return null;
      var h = 2166136261;
      for (var j = 0; j < fid.length; j++) { h ^= fid.charCodeAt(j); h = Math.imul(h, 16777619); }
      var start = (h >>> 0) % cands.length, loose = null, edge = null;
      for (var n = 0; n < cands.length; n++) {
        var d = cands[(start + n) % cands.length];
        if (taken[d.id]) continue;
        if (farEnough(d) && inland(d)) return d;  /* what we want */
        if (!edge && farEnough(d)) edge = d;      /* right kind, on the boundary */
        if (!loose) loose = d;                    /* right kind, too close */
      }
      return edge || loose;                       /* his canon beats both of my rules */
    }

    roster.sort(function (a, b) {
      var pa = powerOf(fs[a], act) || 0, pb = powerOf(fs[b], act) || 0;
      if (pb !== pa) return pb - pa;             /* strongest picks first, his number */
      return a < b ? -1 : 1;                     /* tie-break only */
    });

    for (i = 0; i < roster.length; i++) {
      var fid = roster[i];
      /* HIS OVERRIDE WINS OVER EVERYTHING, including his own notes. */
      if (Object.prototype.hasOwnProperty.call(SEATS, fid)) {
        var sx = SEATS[fid].x | 0, sy = SEATS[fid].y | 0;
        out[fid] = { x: sx, y: sy, kind: null, why: 'ruled', id: sx + ',' + sy, ruled: true };
        seats.push([sx, sy]);
        continue;
      }
      var wants = HOMES[fid] || [], d = null, why = null;
      for (var w = 0; w < wants.length && !d; w++) {
        d = pickFrom(byKind[wants[w]], fid);
        if (d) why = wants[w];
      }
      if (!d) {                                  /* no home in his note, or all taken */
        for (var n2 = 0; n2 < list.length && !d; n2++) {
          var c = list[(n2 * 7919) % list.length];
          if (!taken[c.id] && farEnough(c) && inland(c)) d = c;
        }
        why = d ? 'spread' : null;
      }
      if (!d) continue;
      taken[d.id] = 1; seats.push([d.x, d.y]);
      out[fid] = { x: d.x, y: d.y, kind: d.kind, why: why, id: d.id };
    }
    return out;
  }

  /* THE TOWN ROW: a seat from placeHomes, a tier from his power column. */
  function derive(graph, districts, act) {
    var ids = selectable(graph), ts = tiers(graph, act), out = [];
    var placed = placeHomes(graph, districts, act, ids);
    for (var i = 0; i < ids.length; i++) {
      var id = ids[i], p = placed[id];
      if (!p) continue;
      var ruled = !!p.ruled;
      var t = ts[id] || { tier: 'camp', draft: true };
      out.push({ faction: id, x: p.x, y: p.y, kind: p.kind || null, why: p.why || null,
                 tier: t.tier, rank: t.rank, power: t.power, act: t.act,
                 seatRuled: ruled, draft: !ruled || t.draft });
    }
    return out;
  }

  /* ---------------------------------------------------------------------------
     HOW DEEP A TOWN'S MARKET IS. His sentence, as a count.
     A CAMP IS NOT DEARER THAN A FORTRESS, IT IS THINNER -- everything costs one
     battery wherever you buy it (8/15 + 9/4), so the only honest axis his words
     give is how much a place has. Taken off the economy's own goods list, in the
     economy's own order: no good is invented and none is chosen by me. WHICH goods
     a particular town carries is BB-WANTS' row and belongs to its buildings.
     --------------------------------------------------------------------------- */
  var DEPTH = { fortress: 1, town: 2 / 3, camp: 1 / 3 };

  function goodsFor(tier, goods) {
    var all = goods || [];
    var f = Object.prototype.hasOwnProperty.call(DEPTH, tier) ? DEPTH[tier] : DEPTH.camp;
    var n = Math.max(1, Math.ceil(all.length * f));
    return all.slice(0, n);
  }

  /* the town you are standing in, and the one you could walk to. Chebyshev,
     because the valley is a grid and a body walks it in cells. */
  function nearest(towns, x, y) {
    var best = null, bd = Infinity;
    for (var i = 0; i < (towns || []).length; i++) {
      var t = towns[i];
      var d = Math.max(Math.abs(t.x - x), Math.abs(t.y - y));
      if (d < bd) { bd = d; best = t; }
    }
    return best ? { town: best, cells: bd } : null;
  }

  /* HOW BIG THE TOWN IS ON THE GROUND. A fortress spreads over its neighbours, a
     camp is one cell. This is the "supporting buildings" half of his ruling: the
     district cells inside the reach ARE the smithy and the dry store, and they are
     whatever the map already generated there. Nothing is placed. */
  var REACH = { fortress: 3, town: 2, camp: 1 };

  function townCells(town, m, cat) {
    var out = [];
    if (!town || !m || typeof m.at !== 'function') return out;
    var r = Object.prototype.hasOwnProperty.call(REACH, town.tier) ? REACH[town.tier] : 1;
    var n = m.n | 0;
    for (var y = town.y - r; y <= town.y + r; y++) {
      for (var x = town.x - r; x <= town.x + r; x++) {
        if (x < 0 || y < 0 || x >= n || y >= n) continue;
        var c = m.at(x, y);
        if (!c || !c.district) continue;
        if (cat && cat(c.district) !== 'sand') continue;
        out.push({ x: x, y: y, kind: c.district });
      }
    }
    return out;
  }

  /* ---------------------------------------------------------------------------
     WHO HOLDS THIS GROUND (9/5, BB-TURF).
     LIGHT=TERRITORY has been live code since 7/20 and the grid stamps an OWNER on
     every lit circuit -- but the owner is a CATEGORY, not a name. One circuit in
     five comes back owned by the generic word "faction", so the game already knew
     somebody held that block and could not say who. The seam test on the walked
     surface compares those words, which means today a Mob block and a Cartel block
     are the same block.
     THE NAME IS DERIVED FROM THE SEATS, WHICH ARE GEOGRAPHY THAT ALREADY EXISTS.
     A faction holds the ground around its own town, which is what "different parts
     of Vegas as different faction holdings" means in plain words, and it needs no
     canon: FACTION-TOWNS put the fourteen seats on the map and this reads them.
     A FORTRESS REACHES FURTHER THAN A CAMP, off the REACH table already above --
     his own "the more prominent factions feel like strong fortress parts", as a
     divisor rather than a new number. Ties go to the stronger faction, then to the
     name, so the answer is the same on every device and every load.
     WHO HOLDS WHAT IS STILL HIS: HOLDS ships EMPTY and an entry in it wins. */
  var HOLDS = {};        /* HOLDS['48,57'] = 'Mob';  -- empty, and it stays empty */

  function holderOf(towns, x, y) {
    var k = x + ',' + y;
    if (Object.prototype.hasOwnProperty.call(HOLDS, k))
      return { faction: HOLDS[k], ruled: true, cells: 0, draft: false };
    var best = null, bs = Infinity, bd = 0;
    for (var i = 0; i < (towns || []).length; i++) {
      var t = towns[i];
      var d = Math.max(Math.abs(t.x - x), Math.abs(t.y - y));
      var r = Object.prototype.hasOwnProperty.call(REACH, t.tier) ? REACH[t.tier] : 1;
      var sc = d / r;
      if (sc < bs
          || (sc === bs && best && ((t.power || 0) > (best.power || 0)
              || ((t.power || 0) === (best.power || 0) && t.faction < best.faction)))) {
        bs = sc; best = t; bd = d;
      }
    }
    return best ? { faction: best.faction, tier: best.tier, ruled: false,
                    cells: bd, draft: true } : null;
  }

  var API = {
    TIERS: TIERS, SEATS: SEATS, TIER: TIER, DEPTH: DEPTH, REACH: REACH,
    selectable: selectable, tiers: tiers, powerOf: powerOf,
    districtsOf: districtsOf, derive: derive, NOT_A_TOWN: NOT_A_TOWN,
    HOMES: HOMES, placeHomes: placeHomes, MIN_APART: MIN_APART,
    frontsRoad: frontsRoad,
    goodsFor: goodsFor, nearest: nearest, townCells: townCells,
    HOLDS: HOLDS, holderOf: holderOf
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  root.BohemiaTowns = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
