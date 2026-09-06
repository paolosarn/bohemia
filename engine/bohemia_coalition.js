// BOHEMIA COALITION — the world does not get stronger, it gets organised. (9/6/26, WORLD.)
//
// BB-COALITION, day 11, on the best escalation mechanic in the game he named:
//   in its late-game crises, factions that normally fight each other STOP. Orcs and goblins
//   combine and start appearing in mixed units; the ancient dead, necromancers and
//   wiedergangers, normally independent, combine. NOBODY'S STAT BLOCK CHANGED. THE
//   RELATIONSHIP GRAPH DID. The enemies who were spending their strength on each other
//   point all of it at you.
//
// ============================================================================
// SO ESCALATION IS A GRAPH EDIT, AND THIS FILE HAS NO NUMBERS IN IT AT ALL.
//
// THE CONDITION IS PURE GRAPH AND NEEDS NO RULING:
//   A and B are HOSTILE TO EACH OTHER in his own authored graph
//   AND both of them are hostile to YOU
//   -> they stop spending it on each other.
// That is the reference mechanic stated exactly, and every term in it already exists.
// engine/bohemia_between.js carries his 14-faction graph with directional labels and signs
// (permanent-war, prey-tax, preyed-taxed, hands-off, professional-respect...), and the
// player's standing is the cross-quest ledger `DQ.shared.faction`, which real quests really
// write -- measured 9/6: `faction REMNANTS -6`, `faction MOB -5`, `faction BLUES -6`,
// `faction REDS -6` are live lines in shipped quests, so a player really can make enemies.
//
// *** THERE IS NO THRESHOLD, ON PURPOSE. *** The obvious version is "when N factions hate
// you", and N is a number nobody ruled. The pairwise version needs none: two outfits who
// hate each other and both hate you have a reason to stop, and that reason is a fact about
// the graph rather than a dial. NO DAMAGE BEFORE THE DIAL is not a blocker here, it is the
// specification -- nothing in this file changes anybody's strength, only who is pointing it
// at whom.
//
// DERIVED, NEVER STORED, for the same reason the mandate rung is: ask again after you make
// peace with one of them and the coalition is simply not there. A stored coalition would
// need a dissolution rule and would sit formed forever the first time somebody forgot to
// write one.
//
// ============================================================================
// MECHANISM MINE, CONTENTS HIS. "WHO allies with whom, and when, is HIS" (the row).
//   COALITIONS ships EMPTY. An entry in it is a pact he authored, and it stands whatever
//   the standings say -- his graph is the world, the derivation is only what this run did
//   to itself. Same order between() already uses: authored canon wins and it is not a
//   tie-break, it is the order.
//   NOTHING HERE INVENTS A FACTION, A LABEL OR A NUMBER. It reads his pairs and returns
//   which of them have gone quiet.
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');

  /* LATE-BOUND, AND IT HAS TO BE. The first cut grabbed root.BohemiaBetween AT LOAD TIME
     and MEASURED ZERO PAIRS on the walked surface while node saw five: the city inlines
     modules in an order this file does not control, so at the moment it was evaluated
     BohemiaBetween did not exist yet and BETWEEN stayed null forever. Nothing threw and the
     module reported "no coalitions", which is indistinguishable from a peaceful valley.
     Same class as the temporal-dead-zone trap the towns seats hit one round ago: ASK FOR A
     NEIGHBOUR WHEN YOU NEED IT, NEVER WHEN YOU LOAD. */
  function BTW() {
    if (HASREQ) { try { return require('./bohemia_between.js'); } catch (e) { return null; } }
    return root.BohemiaBetween || (typeof BohemiaBetween !== 'undefined' ? BohemiaBetween : null);
  }

  /* HIS OWN PACTS. EMPTY, and it stays empty until he authors one:
       COALITIONS.push({ a:'Cartel', b:'Remnants', because:'he said so' });
     An authored pact holds whether or not the player has made enemies of both. */
  var COALITIONS = [];

  function norm(s) { return String(s == null ? '' : s).trim().toLowerCase(); }

  /* HOSTILE TO YOU is the cross-quest ledger reading below zero. A faction nobody has ever
     dealt with is not an enemy, it is a stranger -- which is correct on day one and is the
     same reading rungStandings uses for the other sign. */
  function hostileToYou(standings, name) {
    if (!standings || !name) return false;
    var want = String(name).toUpperCase(), k;
    for (k in standings) if (Object.prototype.hasOwnProperty.call(standings, k)
                             && String(k).toUpperCase() === want) return (+standings[k] || 0) < 0;
    return false;
  }

  /* HOSTILE TO EACH OTHER is HIS graph's own reading of the pair, never a second opinion.
     between() already decorates every edge with a sign derived from the label's init. */
  function feudBetween(a, b, save) {
    var BETWEEN = BTW();
    if (!BETWEEN) return null;
    var e = null;
    try { e = BETWEEN.between(a, b, save) || BETWEEN.between(b, a, save); } catch (_e) { e = null; }
    if (!e || e.sign !== 'hostile') return null;
    return e;
  }

  /* EVERY PAIR THE GRAPH CARRIES, once each, so a two-way feud is not counted twice.
     BOTH SOURCES, AND THE SECOND ONE IS WHY THIS IS NOT A TWO-PAIR FEATURE. His authored
     PAIRS table is five pairs and MEASURED 9/6 only TWO of them are hostile -- Caravans
     versus Cartel, and Cartel versus Remnants -- so a coalition read off canon alone could
     only ever be one of two, both involving the Cartel. But between() has always also served
     feuds the player EARNED in play, and allEarned() enumerates them. A first cut that read
     PAIRS only would have shipped a mechanic capped at his starting graph, which is exactly
     backwards: the world getting organised is supposed to be a thing that happens BECAUSE
     of what you did. Earned feuds count, and the coalition grows with the run. */
  function pairs(save) {
    var BETWEEN = BTW();
    var out = [], seen = {}, P = (BETWEEN && BETWEEN.PAIRS) || [], i;
    function add(a, b) {
      if (!a || !b) return;
      var k = [norm(a), norm(b)].sort().join('|');
      if (seen[k]) return;
      seen[k] = 1;
      out.push([a, b]);
    }
    for (i = 0; i < P.length; i++) add(P[i].from, P[i].to);
    var E = [];
    try { E = (BETWEEN && BETWEEN.allEarned(save)) || []; } catch (_e) { E = []; }
    for (i = 0; i < E.length; i++) add(E[i].from, E[i].to);
    return out;
  }

  /* WHO HAS STOPPED FIGHTING WHOM, AND WHY. */
  function formed(standings, save) {
    var out = [], i;
    /* his authored pacts first, and they do not ask the standings anything */
    for (i = 0; i < COALITIONS.length; i++) {
      var c = COALITIONS[i];
      out.push({ a: c.a, b: c.b, ruled: true, was: c.was || null,
                 because: c.because || 'he authored it', draft: false });
    }
    var ps = pairs(save);
    for (i = 0; i < ps.length; i++) {
      var a = ps[i][0], b = ps[i][1];
      if (!hostileToYou(standings, a) || !hostileToYou(standings, b)) continue;
      var e = feudBetween(a, b, save);
      if (!e) continue;
      var dup = false;
      for (var j = 0; j < out.length; j++)
        if ((norm(out[j].a) === norm(a) && norm(out[j].b) === norm(b))
         || (norm(out[j].a) === norm(b) && norm(out[j].b) === norm(a))) dup = true;
      if (dup) continue;
      out.push({ a: a, b: b, ruled: false, was: e.label,
                 because: 'they both have a bigger problem than each other',
                 draft: true });
    }
    return out;
  }

  /* IS THIS FEUD SUSPENDED RIGHT NOW. What anything reading the graph should ask before it
     acts on a hostility his pairs table declares. */
  function suspended(a, b, standings, save) {
    var f = formed(standings, save);
    for (var i = 0; i < f.length; i++)
      if ((norm(f[i].a) === norm(a) && norm(f[i].b) === norm(b))
       || (norm(f[i].a) === norm(b) && norm(f[i].b) === norm(a))) return f[i];
    return null;
  }

  /* EVERY OUTFIT IN A COALITION, flat, for anything that wants to know who is now pointed
     at you as one thing rather than as several. */
  function against(standings, save) {
    var f = formed(standings, save), seen = {}, out = [];
    for (var i = 0; i < f.length; i++) {
      [f[i].a, f[i].b].forEach(function (n) {
        if (!n || seen[norm(n)]) return; seen[norm(n)] = 1; out.push(n);
      });
    }
    return out;
  }

  var API = { COALITIONS: COALITIONS, pairs: pairs, formed: formed,
              suspended: suspended, against: against,
              hostileToYou: hostileToYou, feudBetween: feudBetween };
  if (HASREQ) module.exports = API; else root.BohemiaCoalition = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
