// BOHEMIA PLACE — a place is a BLOCK, and its buildings are its services.
// (9/27/26, WORLD lane. RULE 33h, the REVAMP LIST's rebuild line:
//  "PLACES (WORLD, LIFE+CITY): a place is a block with its buildings as
//   services; the shop, the shed, the pump, the fortress are the first four.")
//
// WHY THIS EXISTS, MEASURED LAST ROUND AND NOT GUESSED. [bb places] counted what
// a place in this valley offers when you arrive: FOURTEEN PLACES, THREE SHELVES.
// goodsFor(tier, goods) returns all.slice(0, n), so a shelf is a function of TIER
// ALONE -- every camp sells the same four things, every town the same eight,
// every fortress the same eleven. A place differs from the tier above it and is
// IDENTICAL to its own tier. Battle Brothers solves exactly that with ATTACHED
// LOCATIONS: a settlement's goods, services and recruits come from what is
// actually around it.
//
// *** SO A SERVICE IS PRESENT BECAUSE A BUILDING IS STANDING THERE, AND ABSENT
// WHEN IT IS NOT. *** That is the whole file. It is what makes one block worth
// crossing the map for and the next one not.
//
// AND IT IS NEVER A PRICE. EVERYTHING COSTS ONE (Paolo 8/15), and this lane
// already learned what happens when that is forgotten: the 9/15 stranger
// surcharge made the first bag of rice cost two days' work, RICE CLOCK went red
// and was right, and his ruling came back -- "the surcharge is DEAD, never a
// number above one, THE SPREAD LIVES IN ACCESS." BB makes the hinterland change
// what things COST. Here it changes WHAT IS THERE AT ALL, which is the same
// lesson in the only currency he allows.
//
// ---------------------------------------------------------------------------
// WHAT IS MINE AND WHAT IS HIS.
//
// MINE: that a place is a block, that a service needs a building, and that the
// answer is derived from the map every time rather than stored.
//
// HIS: what a service DOES when you use it. STOCKS, WAGES and the rest ship
// EMPTY below and say so. A default there would be canon nobody wrote.
//
// AND THE DISTRICT NAMES ARE NOT NEW CANON EITHER. Every name in FROM below is
// already a district the overmap generates and the city already draws; this file
// reads them, the way [beltway placed] read a ring the map was already drawing.
// Nothing here invents a building type.
// ---------------------------------------------------------------------------
//
// REUSE CHECK: builds no blocks (bohemia_towns.blocksOf flood-fills them off the
// street edges), places no seats (towns.derive), finds no generating sites
// (towns.minesOf) and owns no map. It asks those four and answers one question
// none of them does: WHAT CAN I DO HERE.
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');
  function TOWNS() {
    if (HASREQ) { try { return require('./bohemia_towns.js'); } catch (e) { return null; } }
    return root.BohemiaTowns || null;
  }

  /* THE FIRST FOUR, AND THEY ARE THE REVAMP LIST'S OWN FOUR, IN ITS OWN ORDER:
     "the shop, the shed, the pump, the fortress are the first four." */
  var SERVICES = ['shop', 'shed', 'pump', 'fortress'];

  /* WHICH GROUND GIVES WHICH SERVICE. Every one of these is a district the
     overmap already generates -- this file reads the map, it does not add to it.
     A name that is not here gives no service, which is the point: most of the
     valley is houses and road. */
  var FROM = {
    shop:     ['commercial', 'strip', 'downtown', 'mall', 'swapmeet', 'truckstop'],
    /* `garage` was in this list on the first cut and THE GATE CAUGHT IT: the
       overmap does not generate a garage district, so I had invented a building
       type in the one file whose whole claim is that it invents none. Removed. */
    shed:     ['industrial', 'warehouse', 'storage', 'railyard', 'quarry'],
    pump:     ['pumpstation', 'watertreat', 'intake', 'reservoir', 'dam', 'springs'],
    fortress: ['airbase', 'datafort', 'prison', 'jail', 'arsenal', 'policestation']
  };

  /* WHAT A SERVICE DOES IS HIS. Each of these would be {gives, costs, needs} and
     the moment he rules one, offerOf() starts answering instead of refusing. */
  var STOCKS = {};

  var NO_RULING = 'NO_RULING';
  var NOT_A_PLACE = 'NOT_A_PLACE';

  function serviceFor(district) {
    if (!district) return null;
    for (var i = 0; i < SERVICES.length; i++) {
      var s = SERVICES[i];
      if (FROM[s].indexOf(district) >= 0) return s;
    }
    return null;
  }

  /* ---------------------------------------------------------------------------
     THE PLACE YOU ARE STANDING IN.
     --------------------------------------------------------------------------- */

  /* the block that contains a cell, off the towns module's own flood fill. Blocks
     are found once and asked many times, so the caller passes the result in. */
  function blockAt(blocks, x, y) {
    if (!blocks || !blocks.blocks) return null;
    for (var i = 0; i < blocks.blocks.length; i++) {
      var b = blocks.blocks[i], c = b.cells;
      for (var j = 0; j < c.length; j += 2)
        if (c[j] === (x | 0) && c[j + 1] === (y | 0)) return b;
    }
    return null;
  }

  /* *** WHAT CAN I DO HERE. *** The answer is the buildings standing on this
     block and nothing else -- not its tier, not its faction's rank, not a table.
     A block of houses offers nothing, and that is a fact about the place rather
     than a gap in the data. */
  function servicesOn(m, block) {
    var out = { services: [], at: {}, cells: 0 };
    if (!m || !block || !block.cells) return out;
    var c = block.cells, seen = {};
    for (var j = 0; j < c.length; j += 2) {
      var x = c[j], y = c[j + 1], cell = null;
      try { cell = m.at(x, y); } catch (e) { continue; }
      if (!cell) continue;
      out.cells++;
      var s = serviceFor(cell.district);
      if (!s || seen[s]) continue;
      seen[s] = true;
      out.services.push(s);
      out.at[s] = { x: x, y: y, district: cell.district };
    }
    out.services.sort(function (a, b) { return SERVICES.indexOf(a) - SERVICES.indexOf(b); });
    return out;
  }

  /* THE WHOLE ANSWER for a cell: where you are, whose it is, and what is here. */
  function at(o) {
    o = o || {};
    var m = o.map, blocks = o.blocks;
    if (!m || !blocks) return { known: false, why: 'NO_MAP_OR_BLOCKS' };
    var b = blockAt(blocks, o.x, o.y);
    if (!b) return { known: false, why: NOT_A_PLACE, x: o.x | 0, y: o.y | 0 };
    var svc = servicesOn(m, b);

    /* WHOSE GROUND, asked of the caller's own holder answer so this file never
       becomes a second opinion about territory. */
    var holder = null;
    if (typeof o.holderAt === 'function') {
      try { var h = o.holderAt(o.x, o.y); holder = (h && h.faction) || null; } catch (e) { holder = null; }
    }

    /* AND WHAT THE GROUND AROUND IT MAKES -- the hinterland, which is the thing
       [bb places] measured the shelf has never asked. Handed in, because finding
       the sites is towns.minesOf's job and doing it again here would be a second
       answer to the same question. */
    var makes = null;
    if (o.mines && o.mines.byFaction && holder && o.mines.byFaction[holder]) {
      var f = o.mines.byFaction[holder];
      makes = { sites: f.sites, cells: f.cells, kinds: f.kinds };
    }

    return {
      known: true,
      block: b.i, cells: svc.cells, at: { x: b.cx, y: b.cy },
      holder: holder,
      services: svc.services,
      where: svc.at,
      makes: makes,
      /* SAID OUT LOUD: a block with nothing on it is a real answer. */
      empty: svc.services.length === 0
    };
  }

  /* WHAT A SERVICE GIVES YOU, and this is the valve that is his. */
  function offerOf(service) {
    if (SERVICES.indexOf(service) < 0)
      return { known: false, why: 'NOT_A_SERVICE', service: service, are: SERVICES.slice() };
    if (!Object.prototype.hasOwnProperty.call(STOCKS, service))
      return { known: false, why: NO_RULING, table: 'STOCKS', service: service,
               about: 'what a shop, a shed, a pump and a fortress GIVE is Paolo\'s ruling' };
    return { known: true, service: service, offer: STOCKS[service] };
  }

  /* ---------------------------------------------------------------------------
     THE VALLEY'S OWN ANSWER, for anything that wants to know where to send him.
     --------------------------------------------------------------------------- */
  function census(m, blocks) {
    var out = { blocks: 0, withAny: 0, byService: {}, byCount: {} };
    if (!m || !blocks || !blocks.blocks) return out;
    for (var i = 0; i < SERVICES.length; i++) out.byService[SERVICES[i]] = 0;
    for (var b = 0; b < blocks.blocks.length; b++) {
      var svc = servicesOn(m, blocks.blocks[b]);
      out.blocks++;
      var n = svc.services.length;
      out.byCount[n] = (out.byCount[n] || 0) + 1;
      if (n) out.withAny++;
      for (var j = 0; j < n; j++) out.byService[svc.services[j]]++;
    }
    return out;
  }

  var API = { SERVICES: SERVICES, FROM: FROM, STOCKS: STOCKS,
              NO_RULING: NO_RULING, NOT_A_PLACE: NOT_A_PLACE,
              serviceFor: serviceFor, blockAt: blockAt, servicesOn: servicesOn,
              at: at, offerOf: offerOf, census: census };
  if (HASREQ) module.exports = API;
  root.BohemiaPlace = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
