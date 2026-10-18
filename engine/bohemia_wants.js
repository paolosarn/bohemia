// BOHEMIA WANTS -- WHAT A FACTION WANTS DECIDES WHERE ITS PARTIES GO
// (10/18/26, FACTIONS lane, row [wants send parties]; WORLD [parties move] BUY half)
//
// ============================================================================
// THE ROW, AND WHAT WAS MEASURED BEFORE A LINE OF THIS EXISTED
// ============================================================================
//   "factions.json already says what each faction WANTS (the crew the freeway,
//    the house the depot, the dead what is unfinished, the beasts their ground)
//    and what ground each holds; make the want choose the target: a crew goes at
//    what stands on or beside the ground it wants, a house patrols the depot,
//    read by bohemia_parties' target choice."
//
// MEASURED on five seeds (12345, 1, 7, 42, 999): the valley sends 28 parties and
// 4 of them are crews, and EVERY crew is sent at one of three fortresses --
// Cartel twice, Remnants once, Caravans once -- because hostilesOf() ranks by
// the worst canon blood and his graph's only feuds are between those three.
// Handed the region's eight wild locations beside them (records/target/bb/
// region_bases.json) the wild rows send CARAVANS, because between() has never
// heard of a road crew. A camp or a town has never once been somebody's target.
//
// ============================================================================
// WHAT BATTLE BROTHERS DOES, AND THE WHOLE RULE IS THAT
// ============================================================================
// A camp's raiders go at the NEAREST village ("whichever has a closer distance
// to the settlement", Defend Settlement Bandits) and live off the TRADE ROUTES
// ("a spawnpoint of enemies close to trade routes... caravans getting raided",
// the developer). Castles PATROL the roads. The dead raid FOR CORPSES, not for
// money. Beasts ROAM. Every line is quoted in records/target/bb/wants.json.
// So the want names a KIND OF GROUND, and the map's own distance does the rest:
//   a crew that wants the freeway goes at the places with the shortest trip --
//     camp to place, plus place to the nearest freeway -- WHATEVER THEIR SIZE;
//   a house that wants the depot patrols the nearest depot ground first;
//   the dead go at the nearest places, the raided ones first;
//   the beasts hold their own ground and never go at a place.
//
// ============================================================================
// WHAT THIS FILE DOES NOT DO
// ============================================================================
// It does not edit WORLD's parties module. It COMPOSES with it: all() here is
// BohemiaParties.all() with the want deciding a seat's parties where that seat's
// faction has a want, and the parties module deciding everything else, byte for
// byte as before. A seat with no want gets exactly what it got yesterday.
// It types no number: who goes first is the map's distance, how many go is
// BohemiaTowns.REACH, the grounds are BohemiaBoardTerrain's kinds. It never
// takes the player's position. It invents no want: only factions.json's.
// FACTIONS [four seated] (10/18) adds ONE thing on top: a faction whose want
// carries `turns_out` (the block watch) has no seat and is gathered at every
// town or camp a crew is going at, Battle Brothers' militia (turnOut below);
// those parties say turned_out:true, so a reader can always tell them apart.
//
// node: require('./bohemia_wants.js')   Gate: gates/wants_send_parties_gate.js
// ============================================================================
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports);

  function PARTIES() {
    if (HASREQ) { try { return require('./bohemia_parties.js'); } catch (_e) {} }
    return (typeof root !== 'undefined' && root.BohemiaParties) || null;
  }
  function TOWNS() {
    if (HASREQ) { try { return require('./bohemia_towns.js'); } catch (_e) {} }
    return (typeof root !== 'undefined' && root.BohemiaTowns) || null;
  }

  function dist(a, b) { return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y)); }
  function has(o, k) { return !!o && Object.prototype.hasOwnProperty.call(o, k); }

  /* THE FACTION'S WANT, READ. `data` is { factions: factions.json, wants:
     wants.json }. A faction with no want, or a want this file has no rule for,
     answers null and the parties module decides, as it always has. */
  function wantOf(faction, data) {
    if (!data || !data.factions || !data.wants) return null;
    var fs = data.factions.factions || [];
    for (var i = 0; i < fs.length; i++) {
      if (!fs[i] || fs[i].id !== faction) continue;
      var id = fs[i].want && fs[i].want.id;
      if (!id || !has(data.wants.wants, id)) return null;
      var r = data.wants.wants[id];
      return { id: id, rule: r, text: fs[i].want.text || null };
    }
    return null;
  }

  /* THE GROUND, HANDED IN. `cells` is a list of { x, y, kind } -- in the valley
     every cell off BohemiaBoardTerrain.at(), on the region RUN's road cells as
     freeway. Indexed by kind once per call to all(), never per party. */
  function byKind(cells) {
    var out = {};
    for (var i = 0; i < (cells || []).length; i++) {
      var c = cells[i]; if (!c || !c.kind) continue;
      (out[c.kind] || (out[c.kind] = [])).push(c);
    }
    return out;
  }
  function nearestOf(kinds, idx, at) {
    var best = null, bd = Infinity;
    for (var k = 0; k < (kinds || []).length; k++) {
      var list = idx[kinds[k]] || [];
      for (var i = 0; i < list.length; i++) {
        var d = dist(at, list[i]);
        if (d < bd || (d === bd && best && (list[i].y < best.y || (list[i].y === best.y && list[i].x < best.x)))) {
          bd = d; best = list[i];
        }
      }
    }
    return best ? { cell: best, d: bd } : null;
  }

  /* WHO A SEAT MAY GO AT. A wild seat (a camp, a crypt, a den in the wild) is
     hostile to every settlement -- region_bases.json's rows say so with wild:true
     -- and never to another wild seat. A settled seat with a want goes only at
     those its own canon feuds name, read off the parties module, never widened. */
  function marksFor(town, towns, save) {
    if (town.wild) {
      return (towns || []).filter(function (o) {
        return o && o !== town && !o.wild && o.faction && o.faction !== town.faction;
      });
    }
    var P = PARTIES(); if (!P || typeof P.hostilesOf !== 'function') return [];
    return P.hostilesOf(town, towns, save).map(function (h) { return h.town; });
  }

  function keyOf(o) { return o.x + ',' + o.y; }

  /* A PARTY, IN EXACTLY THE PARTIES MODULE'S SHAPE, so advance(), near(), say()
     and every reader downstream take it unchanged. `want` is the one field
     added: which want sent it, so a card can say why. */
  function mk(town, agenda, tx, ty, toward, want) {
    var P = PARTIES(), A = (P && P.AGENDAS && P.AGENDAS[agenda]) || {};
    return {
      id: town.faction + ':' + agenda + ':' + tx + ',' + ty,
      from: { faction: town.faction, tier: town.tier, power: town.power,
              x: town.x, y: town.y },
      agenda: agenda, about: A.about || null, draft: A.draft !== false,
      toward: toward || null,
      to: { x: tx, y: ty },
      at: { x: town.x, y: town.y },
      arrived: false, left: false,
      want: want || null
    };
  }

  /* ------------------------------------------------------------------------
     WHAT ONE SEAT SENDS, WHEN ITS FACTION WANTS SOMETHING.
     Returns null when the faction has no want: the caller hands that seat to
     the parties module untouched.
     ------------------------------------------------------------------------ */
  function sendFor(town, towns, opts) {
    opts = opts || {};
    var w = wantOf(town.faction, opts.data);
    if (!w) return null;
    var T = TOWNS(), P = PARTIES();
    if (!T || !T.REACH || !P) return null;
    var howMany = has(T.REACH, town.tier) ? T.REACH[town.tier] : T.REACH.camp;
    var idx = opts._idx || byKind(opts.cells);
    var r = w.rule, out = [];

    if (r.goes_at === 'places_by_ground' || r.goes_at === 'nearest_places') {
      var raided = opts.raided || {};
      var cands = marksFor(town, towns, opts.save).map(function (o) {
        var g = (r.goes_at === 'places_by_ground') ? nearestOf(r.ground, idx, o) : null;
        return {
          town: o,
          hit: (r.prefer_trait === 'raided' && raided[keyOf(o)]) ? 0 : 1,
          trip: dist(town, o) + (g ? g.d : 0),
          known: (r.goes_at !== 'places_by_ground') || !!g,
          d: dist(town, o)
        };
      }).filter(function (c) { return c.known; });
      cands.sort(function (a, b) {
        return (a.hit - b.hit) || (a.trip - b.trip) || (a.d - b.d)
          || (a.town.faction < b.town.faction ? -1 : a.town.faction > b.town.faction ? 1 : 0)
          || (a.town.y - b.town.y) || (a.town.x - b.town.x);
      });
      for (var i = 0; i < cands.length && out.length < howMany; i++) {
        var o = cands[i].town;
        out.push(mk(town, r.agenda, o.x, o.y, o.faction, w.id));
      }
      return out;
    }

    if (r.goes_at === 'nearest_ground') {
      var mine = town.ground || [];
      var onIt = r.stays_if_on_it && r.ground.some(function (g) { return mine.indexOf(g) >= 0; });
      var spot = onIt ? { cell: { x: town.x, y: town.y } } : nearestOf(r.ground, idx, town);
      if (spot) out.push(mk(town, r.agenda, spot.cell.x, spot.cell.y, null, w.id));
      /* the rest of the seat's business is the parties module's, minus a second
         patrol (its own rule: one patrol a seat), and only with settlements: a
         camp in the wild is nobody's trading partner (Battle Brothers' city states
         send "caravans to trade with other settlements"; the parties module has
         never heard of a wild seat and would send a caravan to a beast's den) */
      if (out.length < howMany && !town.wild) {
        var settled = (towns || []).filter(function (o) { return o === town || (o && !o.wild); });
        var rest = P.sendFrom(town, settled, opts);
        for (var j = 0; j < rest.length && out.length < howMany; j++) {
          if (rest[j].agenda === 'patrol' && out.some(function (q) { return q.agenda === 'patrol'; })) continue;
          out.push(rest[j]);
        }
      }
      return out;
    }
    return null;
  }

  /* ------------------------------------------------------------------------
     THE WATCH TURNS OUT (FACTIONS [four seated], 10/18). Battle Brothers'
     militia have NO SEAT: every non-military settlement gathers them "when a
     hostile party is sighted close to a settlement" and disbands them "after the
     threat disappeared" (Factions and Relations; Civilian). A want carrying
     `turns_out` in wants.json is that kind of faction. 'Close' is no number on
     the wiki, so it is the crew's own mark: every seat of one of turns_out.tiers
     that a crew is going at -- never a wild seat, never the watch's own --
     gathers ONE party of the watch, standing on the place, defending its holder.
     The disband (the crew gone) is the clock's, not this file's.
     ------------------------------------------------------------------------ */
  function watchesOf(data) {
    var out = [], fs = (data && data.factions && data.factions.factions) || [];
    for (var i = 0; i < fs.length; i++) {
      var w = fs[i] && wantOf(fs[i].id, data);
      if (w && w.rule && w.rule.turns_out) out.push({ faction: fs[i].id, want: w });
    }
    return out;
  }
  function turnOut(parties, towns, opts) {
    opts = opts || {};
    var ws = watchesOf(opts.data); if (!ws.length) return [];
    var at = {};
    for (var i = 0; i < (towns || []).length; i++) if (towns[i] && !has(at, keyOf(towns[i]))) at[keyOf(towns[i])] = towns[i];
    var out = [], seen = {};
    for (var p = 0; p < (parties || []).length; p++) {
      var q = parties[p];
      if (!q || q.agenda !== 'crew' || !q.to || !has(at, q.to.x + ',' + q.to.y)) continue;
      var place = at[q.to.x + ',' + q.to.y];
      if (place.wild) continue;
      for (var k = 0; k < ws.length; k++) {
        var w = ws[k], rule = w.want.rule;
        if ((rule.turns_out.tiers || []).indexOf(place.tier) < 0) continue;
        if (place.faction === w.faction || (q.from && q.from.faction === w.faction)) continue;
        var key = w.faction + '@' + keyOf(place);
        if (has(seen, key)) { seen[key].against.push(q.id); continue; }
        var r = mk({ faction: w.faction, tier: place.tier, power: place.power, x: place.x, y: place.y },
                   rule.agenda, place.x, place.y, null, w.want.id);
        r.defends = place.faction; r.against = [q.id]; r.turned_out = true;
        seen[key] = r; out.push(r);
      }
    }
    return out;
  }

  /* ------------------------------------------------------------------------
     EVERY PARTY OUT: the parties module's all(), with the want deciding where a
     wanting seat's parties go, then the watch turned out where the crews go.
     The player is nowhere in the arguments.
     opts: { n, save, data: {factions, wants}, cells: [{x,y,kind}], raided: {'x,y':1} }
     ------------------------------------------------------------------------ */
  function all(towns, opts) {
    opts = opts || {};
    var P = PARTIES(); if (!P) return [];
    var o2 = {}; for (var k in opts) if (has(opts, k)) o2[k] = opts[k];
    o2._idx = byKind(opts.cells);
    var out = [];
    for (var i = 0; i < (towns || []).length; i++) {
      var mine = sendFor(towns[i], towns, o2);
      out = out.concat(mine == null ? P.sendFrom(towns[i], towns, opts) : mine);
    }
    return out.concat(turnOut(out, towns, opts));
  }

  /* THE CELLS OF A VALLEY, as this file wants them, off the one door that names
     a cell's ground. Kept here so RUN and the gate hand in the same thing. */
  function cellsOf(m, BT) {
    var out = [];
    if (!m || !BT || typeof BT.at !== 'function') return out;
    for (var y = 0; y < (m.n | 0); y++)
      for (var x = 0; x < (m.n | 0); x++) {
        var a = BT.at(m, x, y);
        if (a && a.known) out.push({ x: x, y: y, kind: a.kind });
      }
    return out;
  }

  var API = { wantOf: wantOf, sendFor: sendFor, all: all, cellsOf: cellsOf,
              marksFor: marksFor, turnOut: turnOut };
  if (HASREQ) module.exports = API;
  root.BohemiaWants = API;
})(typeof window !== 'undefined' ? window
   : (typeof globalThis !== 'undefined' ? globalThis : this));
