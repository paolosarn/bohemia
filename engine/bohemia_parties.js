// BOHEMIA PARTIES — THE WORLD'S OWN BUSINESS (9/11/26, WORLD lane)
// Board row [parties move] / GROUPS-WITH-THEIR-OWN-BUSINESS.
//
// ============================================================================
// THE ROW, IN HIS OWN SHAPE
// ============================================================================
//   "the map is populated by the world's own business, not by a spawner aimed at
//    the player. Places BUY and SEND parties out of what they have, each with an
//    agenda (a caravan carrying, a patrol holding a border, a crew going to take
//    something), and they travel whether or not the player is looking. A party's
//    strength is real and readable, because pursuit depends on how strong you
//    look next to it. This is what makes a chance encounter a chance and not a
//    script."
//
// FOUR THINGS, AND EACH ONE IS A CONSTRAINT THIS FILE IS BUILT AROUND:
//   1. A PLACE SENDS IT, not the player's position. Nothing below takes the
//      player's coordinates as an input to deciding what exists. near() takes
//      them, and near() only LOOKS.
//   2. IT HAS AN AGENDA, and the three are his, named in the row.
//   3. IT TRAVELS WHETHER OR NOT HE LOOKS. advance() is called by the day, the
//      same hook that ages the valley's shelves, so a party a player never sees
//      still arrives.
//   4. ITS STRENGTH IS REAL AND READABLE, so a pursuit can compare.
//
// ============================================================================
// WHAT IS MEASURED BEFORE THIS EXISTED
// ============================================================================
// The only thing that ever put anybody in front of the player was
// bohemia_encounters.js, and its own header says what it is: a director that is
// PULLED by a block of time the player actually spent, with NO CLOCK, by
// deliberate ruling ("a world that keeps rolling at an idle player is the thing
// the ruling forbids"). That is correct for ambient encounters on a walk and it
// is exactly the thing this row is contrasted against: nothing in the valley
// had business of its own.
// bohemia_patrol.js is a BLOCK's sidewalk loop, not a valley-scale party.
//
// ============================================================================
// NOT ONE NUMBER IS TYPED IN THIS FILE, AND EVERY PIECE IS SOMEBODY ELSE'S
// ============================================================================
//   WHO can send        BohemiaTowns.derive() -- his 14 seats
//   HOW MANY it sends   BohemiaTowns.REACH -- fortress 3, town 2, camp 1, the
//                       table that already sized a town's reach. A fortress has
//                       more business abroad than a camp; that was already true.
//   HOW STRONG it is    his own act power column: Remnants 14 .. Colorful 1.
//                       NOT a damage number and not a dial -- NO DAMAGE BEFORE
//                       THE DIAL stands. It is the number the game already ranks
//                       factions by, handed out so a comparison is possible.
//   WHO it is sent at   BohemiaBetween.between() -- his authored relations plus
//                       whatever this run earned
//   WHOSE GROUND is whose  BohemiaTowns.holderOf() -- BB-TURF's catchment
//   HOW FAR IT GETS IN A DAY   the CALLER's, because how fast a body crosses a
//                       cell is the walked surface's ROADS-ARE-FAST rule and a
//                       second copy of it here is how a caravan and a player end
//                       up moving at different speeds in one valley.
//
// node: require('./bohemia_parties.js')   Gate: gates/parties_move_gate.js
// ============================================================================
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports);

  /* ASK FOR A NEIGHBOUR WHEN YOU NEED IT, NEVER WHEN YOU LOAD -- the trap that
     made BB-COALITION report an empty world on the walked surface while node saw
     five pairs. The city inlines its modules in an order no module controls. */
  function TOWNS() {
    if (HASREQ) { try { return require('./bohemia_towns.js'); } catch (_e) {} }
    return (typeof root !== 'undefined' && root.BohemiaTowns) || null;
  }
  function BTW() {
    if (HASREQ) { try { return require('./bohemia_between.js'); } catch (_e) {} }
    return (typeof root !== 'undefined' && root.BohemiaBetween) || null;
  }

  /* ------------------------------------------------------------------------
     THE THREE AGENDAS. HIS, WORD FOR WORD OUT OF THE ROW.
     They are a frozen list for the same reason the four upkeep verbs are: an
     undeclared fourth agenda is a design change, and design changes are Paolo's.
     `about` is the sentence a player is told, draft:true.
     ------------------------------------------------------------------------ */
  var AGENDAS = {
    caravan: { about: 'carrying', draft: true },
    patrol:  { about: 'holding a border', draft: true },
    crew:    { about: 'going to take something', draft: true }
  };

  /* HOW STRONG A PARTY IS, AND IT IS HIS NUMBER UNCHANGED.
     *** THIS IS NOT A COMBAT NUMBER AND NOTHING HERE DEALS DAMAGE. *** NO DAMAGE
     BEFORE THE DIAL (locked) governs what a hit takes off; this governs what a
     party LOOKS like from across a street, which is what the row asks for --
     "pursuit depends on how strong you look next to it". The act power column is
     already how this game ranks factions, so handing it over unchanged is the
     only answer that cannot drift from the rest of the world. */
  function strengthOf(party) {
    if (!party || !party.from) return null;
    var p = party.from.power;
    return (typeof p === 'number') ? p : null;
  }

  /* AND WHAT THAT LOOKS LIKE NEXT TO YOU. The caller supplies what the player's
     own strength is, because whose number that is belongs to COMBAT and this
     file will not invent a second one. Returns the comparison, never a verdict:
     whether you run is not this module's ruling either. */
  function against(party, mine) {
    var s = strengthOf(party);
    if (s == null || typeof mine !== 'number') return null;
    return { theirs: s, mine: mine, harder: s > mine, easier: s < mine, even: s === mine };
  }

  /* ------------------------------------------------------------------------
     WHO A PLACE HAS BUSINESS WITH. Sorted, never rolled: the same valley gives
     the same business on every device and every reload.
     ------------------------------------------------------------------------ */
  function hostilesOf(town, towns, save) {
    var B = BTW(); if (!B || typeof B.between !== 'function') return [];
    var out = [];
    for (var i = 0; i < (towns || []).length; i++) {
      var o = towns[i];
      if (!o || o.faction === town.faction) continue;
      var e = null;
      try { e = B.between(town.faction, o.faction, save); } catch (_e) { e = null; }
      if (e && typeof e.init === 'number' && e.init < 0) out.push({ town: o, init: e.init });
    }
    /* worst blood first, then nearest, then by name so nothing is ever a draw */
    out.sort(function (a, b) {
      if (a.init !== b.init) return a.init - b.init;
      var da = dist(town, a.town), db = dist(town, b.town);
      if (da !== db) return da - db;
      return a.town.faction < b.town.faction ? -1 : 1;
    });
    return out;
  }
  function friendliesOf(town, towns, save) {
    var B = BTW(); var out = [];
    for (var i = 0; i < (towns || []).length; i++) {
      var o = towns[i];
      if (!o || o.faction === town.faction) continue;
      var e = null;
      if (B && typeof B.between === 'function') {
        try { e = B.between(town.faction, o.faction, save); } catch (_e) { e = null; }
      }
      if (e && typeof e.init === 'number' && e.init < 0) continue;   /* not through a feud */
      out.push(o);
    }
    out.sort(function (a, b) {
      var da = dist(town, a), db = dist(town, b);
      if (da !== db) return da - db;
      return a.faction < b.faction ? -1 : 1;
    });
    return out;
  }
  function dist(a, b) { return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y)); }

  /* WHERE A FACTION'S OWN GROUND STOPS. A border cell is one this town holds
     whose neighbour somebody else holds -- read straight off BB-TURF's catchment,
     which already covers every cell in the valley with none left over. Walking
     out from the seat means the first border found is the near one, which is the
     one a patrol from that seat would actually walk to. */
  function borderOf(town, towns, n) {
    var T = TOWNS(); if (!T || typeof T.holderOf !== 'function') return null;
    var N = n | 0;
    for (var r = 1; r < N; r++) {
      for (var dy = -r; dy <= r; dy++) {
        for (var dx = -r; dx <= r; dx++) {
          if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
          var x = town.x + dx, y = town.y + dy;
          if (x < 0 || y < 0 || x >= N || y >= N) continue;
          var h = T.holderOf(towns, x, y);
          if (!h || h.faction !== town.faction) continue;
          /* it is a border if any of the four neighbours is held by somebody else */
          var sides = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
          for (var s = 0; s < sides.length; s++) {
            var sx = sides[s][0], sy = sides[s][1];
            if (sx < 0 || sy < 0 || sx >= N || sy >= N) continue;
            var o = T.holderOf(towns, sx, sy);
            if (o && o.faction !== town.faction) return { x: x, y: y, facing: o.faction };
          }
        }
      }
    }
    return null;
  }

  /* ------------------------------------------------------------------------
     WHAT A PLACE SENDS OUT, OUT OF WHAT IT HAS.
     HOW MANY is REACH[tier] -- his own table, the one that already decided a
     fortress reaches further than a camp. A camp sends one party; a fortress
     sends three. Nothing here picked those numbers and nothing here may.
     THE ORDER IS A RULE, NOT A TABLE, so it cannot rot:
       a place with a feud sends a CREW at the worst of them first,
       then a PATROL to its own nearest border,
       then a CARAVAN to the nearest place it has no feud with.
     A place with nobody to fight and nowhere to trade sends nothing, and that is
     the honest empty state rather than a party invented to fill a slot.
     ------------------------------------------------------------------------ */
  function sendFrom(town, towns, opts) {
    opts = opts || {};
    var T = TOWNS(); if (!T || !T.REACH) return [];
    var n = opts.n | 0;
    var howMany = Object.prototype.hasOwnProperty.call(T.REACH, town.tier)
      ? T.REACH[town.tier] : T.REACH.camp;
    var hostiles = hostilesOf(town, towns, opts.save);
    var friends = friendliesOf(town, towns, opts.save);
    var border = borderOf(town, towns, n);
    var out = [], hi = 0, fi = 0;
    for (var k = 0; k < howMany; k++) {
      var p = null;
      if (hi < hostiles.length) {
        var h = hostiles[hi++];
        p = mk(town, 'crew', h.town.x, h.town.y, h.town.faction);
      } else if (border && !out.some(function (q) { return q.agenda === 'patrol'; })) {
        p = mk(town, 'patrol', border.x, border.y, border.facing);
      } else if (fi < friends.length) {
        var f = friends[fi++];
        p = mk(town, 'caravan', f.x, f.y, f.faction);
      }
      if (!p) break;
      out.push(p);
    }
    return out;
  }

  /* A PARTY. Its id is its origin, its agenda and its seat in that place's own
     list, so the SAME valley produces the SAME parties every load and a save
     does not need to store any of them. */
  function mk(town, agenda, tx, ty, toward) {
    return {
      id: town.faction + ':' + agenda + ':' + tx + ',' + ty,
      from: { faction: town.faction, tier: town.tier, power: town.power,
              x: town.x, y: town.y },
      agenda: agenda, about: AGENDAS[agenda].about, draft: AGENDAS[agenda].draft,
      toward: toward || null,
      to: { x: tx, y: ty },
      at: { x: town.x, y: town.y },
      arrived: false, left: false
    };
  }

  /* EVERY PARTY THE VALLEY HAS OUT RIGHT NOW. The player is nowhere in this
     function's arguments, which is the whole point of the row. */
  function all(towns, opts) {
    var out = [];
    for (var i = 0; i < (towns || []).length; i++)
      out = out.concat(sendFrom(towns[i], towns, opts));
    return out;
  }

  /* ------------------------------------------------------------------------
     AND THEY TRAVEL WHETHER OR NOT HE IS LOOKING.
     cellsPerDay is the CALLER's: how far a body gets in a day is the walked
     surface's own ROADS-ARE-FAST rule, and a second copy of that number here is
     how a caravan and a player end up moving at different speeds in one valley.
     A party walks toward its destination a cell at a time, diagonally where that
     is the way (the valley is a grid and holderOf measures it in Chebyshev), and
     when it arrives it turns round and goes home. A patrol that reaches its
     border is HOLDING it, so it stays -- that is what the agenda means.
     ------------------------------------------------------------------------ */
  function advance(parties, cellsPerDay, days) {
    var steps = Math.max(0, Math.floor((cellsPerDay || 0) * (days == null ? 1 : days)));
    for (var i = 0; i < (parties || []).length; i++) {
      var p = parties[i];
      if (!p) continue;
      for (var s = 0; s < steps; s++) {
        /* *** A PATROL WALKS ITS BEAT. IT DOES NOT PARK. ***
           The first cut had a patrol stop dead on its border cell for ever, on the
           reading that "holding a border" means standing on it. MEASURED: that
           froze FOURTEEN of twenty-eight parties after day one, so half the
           valley's business was statues and the row's own words -- "they travel
           whether or not the player is looking" -- were only half true.
           A patrol holds a border by WALKING it, which is what this game's own
           block-scale bohemia_patrol.js has modelled since 7/16: a route walked up
           and back, because "a patrol that never closes its loop is a guard
           teleporting home every lap, and the eye catches that immediately". So a
           patrol runs seat to border and back, for ever, like everybody else. */
        var tx = p.arrived ? p.from.x : p.to.x, ty = p.arrived ? p.from.y : p.to.y;
        p.at.x += sign(tx - p.at.x);
        p.at.y += sign(ty - p.at.y);
        /* *** THE FLAG IS SET IN THE STEP THAT ARRIVES, NOT THE ONE AFTER. ***
           The first cut checked at==to at the TOP of the step, so a party standing
           on its destination reported arrived:false for a whole day and anything
           reading it -- a card, a pursuit, a gate -- was told it was still walking.
           A state that lies about itself for one tick is a bug that only shows up
           when somebody finally reads it. */
        if (p.at.x === tx && p.at.y === ty) {
          if (!p.arrived) { p.arrived = true; }
          else { p.arrived = false; p.left = true; }   /* home again, and out once more */
        }
      }
    }
    return parties;
  }
  function sign(v) { return v > 0 ? 1 : (v < 0 ? -1 : 0); }

  /* WHAT HE CAN SEE FROM WHERE HE IS STANDING. This is the ONLY function that
     takes the player's position, and it only LOOKS: nothing about which parties
     exist, where they go or how strong they are depends on it. */
  function near(parties, x, y, radius) {
    var r = (radius == null) ? 1 : (radius | 0), out = [];
    for (var i = 0; i < (parties || []).length; i++) {
      var p = parties[i];
      if (!p || !p.at) continue;
      var d = Math.max(Math.abs(p.at.x - (x | 0)), Math.abs(p.at.y - (y | 0)));
      if (d <= r) out.push({ party: p, cells: d });
    }
    out.sort(function (a, b) { return a.cells - b.cells
      || (a.party.id < b.party.id ? -1 : 1); });
    return out;
  }

  /* WHICH WAY IT IS FACING, SO A READER CANNOT GET THE SENTENCE WRONG.
     `arrived` means "has reached what it was sent to", which on a caravan also
     means it is now walking home -- true and confusing, and a card that says
     "arrived" about something halfway back down the road is a lie a player can
     see. This is the word a reader should use. */
  function legOf(party) {
    if (!party) return null;
    /* a patrol on the homeward leg of its beat is still holding that border -- it
       walks the line, it does not go off duty halfway back. */
    if (party.agenda === 'patrol') return party.arrived ? 'holding' : 'out';
    return party.arrived ? 'back' : 'out';
  }

  /* THE SENTENCE A PLAYER IS TOLD. draft:true -- words get an attempt, decisions
     wait (ALWAYS MAKE AN ATTEMPT, 8/11). */
  /* NO ARTICLE IN FRONT OF THE FACTION NAME, AND THAT IS A FIX NOT A STYLE.
     The first cut wrote 'a ' + name and the real graph produced "a Anarchists
     patrol" on the walked surface. His faction names are plural nouns, so no
     single article is ever right across all fourteen: "an Anarchists" is as wrong
     as "a Anarchists". Dropping it reads like what this is -- a report of who
     went past -- and cannot be wrong for a name he adds later. */
  function say(party) {
    if (!party) return '';
    var who = party.from.faction;
    if (legOf(party) === 'back')
      return who + ' ' + party.agenda + ', heading home';
    if (party.agenda === 'caravan')
      return who + ' caravan, carrying' + (party.toward ? ' to ' + party.toward : '');
    if (party.agenda === 'patrol')
      return who + ' patrol, holding the border'
           + (party.toward ? ' against ' + party.toward : '');
    return who + ' crew, out to take something'
         + (party.toward ? ' from ' + party.toward : '');
  }

  var API = { AGENDAS: AGENDAS, strengthOf: strengthOf, against: against,
              hostilesOf: hostilesOf, friendliesOf: friendliesOf, borderOf: borderOf,
              sendFrom: sendFrom, all: all, advance: advance, near: near,
              legOf: legOf, say: say };
  if (HASREQ) module.exports = API;
  root.BohemiaParties = API;
})(typeof window !== 'undefined' ? window
   : (typeof globalThis !== 'undefined' ? globalThis : this));
