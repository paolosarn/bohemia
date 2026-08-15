// BOHEMIA TIES — WHO KNOWS WHO (8/12/26, FACTIONS lane)
//
// THE HOLE THIS FILLS. Yesterday's organ (bohemia_introductions.js) wired the
// sixteen ways a faction lets you learn a name. Five of the eight earning
// conditions could answer; three could not, and all three failed for the same
// reason: THE VALLEY'S PEOPLE HAVE NO RELATIONSHIPS WITH EACH OTHER. Every
// person in Bohemia was an island. So:
//
//   MOB       "YOU ARE INTRODUCED, YOU DO NOT ASK... a third person supplies the
//              name, and that person is vouching."      -> unreachable, no third person exists
//   REMNANTS  "it usually arrives from somebody ELSE - you hear another soldier
//              use it before they ever offer it."       -> unreachable, same reason
//   COLORFUL  "answer it well and you are introduced onward to three people."
//                                                        -> unreachable, same reason
//
// Four of his sixteen dossiers reference a third party. The mechanic they all
// need is one thing: an acquaintance graph.
//
// GROUNDED, NOT INVENTED. Feld 1981, THE FOCUSED ORGANIZATION OF SOCIAL TIES
// (Am. J. Sociology 86:1015-1035): ties do not form at random and they do not
// form purely from liking. They form around FOCI — shared settings people are
// jointly organised around. Homophily is largely an OUTPUT of that structure
// rather than an innate preference: shared settings put similar people in the
// same room, and the room does the rest. The restrictive the focus, the more
// segregated the network it produces.
//
// The remarkable part is that this engine already carries exactly three foci on
// every single agent and has never once used any of them socially:
//
//   HOME     seatOf(agent).house — who shares your roof
//   WORK     agent.job's site (district + dir + dist) — who walks to the same place
//   FACTION  factionOf(agent) — who runs with the same outfit
//
// No new data is generated here, no dice are rolled that were not already rolled,
// and nobody is assigned to anybody. This module only READS three facts the world
// already decided and answers one question: does A know B, and how.
//
// DUNBAR IS THE CEILING, AND IT IS A REAL ONE. Dunbar's layers (support clique 5,
// sympathy group 15, affinity group 50, active network 150; scaling ratio ~3) are
// the measured limits on how many people one person can actually hold. A focus
// SMALLER than its layer makes everyone in it an acquaintance — five people in a
// house all know each other, obviously. A focus BIGGER than its layer does NOT,
// and pretending otherwise is how you get a valley where 300 people all know all
// 300. So above the layer the graph THINS, to a symmetric deterministic subset
// whose expected degree is exactly the layer. The valley holds ~300 people
// (bohemia_population), so the 150 active-network ceiling is half of everyone,
// which is what a settlement that size really looks like.
//
// MECHANISM-MINE / CONTENTS-PAOLO'S: the graph and the layers are mechanism. WHO
// is in which house, which job and which faction is the world's, already decided
// elsewhere. Nothing here names anybody, says anything, or ranks a relationship
// as good or bad — a tie is only "these two know each other, via this".
(function (root) {
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');

  /* Dunbar's layers, used as CEILINGS on how many people one focus can hand you.
     Which layer belongs to which focus is not a dial, it is the literature's own
     ordering: the people under your roof are the support clique, the people you
     work beside are the sympathy/affinity band, an organisation is the outer
     active network. */
  var LAYERS = { home: 5, work: 15, faction: 50 };
  var ACTIVE = 150;          // nobody holds more ties than this, whatever the foci say

  /* how much a tie carries. Used ONLY to order candidates when several people
     could introduce you — you hear it from the closest one first. It is not a
     score of affection and nothing in the game reads it as one. */
  var STRENGTH = { home: 3, work: 2, faction: 1 };
  var ORDER = ['home', 'work', 'faction'];

  function hash(a, b) {
    var h = ((a >>> 0) * 73856093) ^ ((b >>> 0) * 19349663);
    h = (h ^ (h >>> 13)) >>> 0; return (h * 2654435761) >>> 0;
  }
  function strHash(s) {
    var h = 0; s = String(s || '');
    for (var i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) >>> 0;
    return h >>> 0;
  }

  /* THE THREE FOCI A PERSON BELONGS TO, read off the agent the world already made.
     A focus is a STRING that two people share or do not; that is the whole idea.
     A person with no job site or no faction simply has fewer foci, which is the
     honest answer and not a gap — most of the valley runs with nobody. */
  function fociOf(agent, cell) {
    if (!agent) return {};
    var f = {};
    /* WHO SHARES YOUR ROOF. Prefer the seat the world DECLARES (home.building)
       and only fall back to parsing the id when there isn't one.
       WHY THE PREFERENCE, added 8/15: parsing the id was never wrong, it was
       INCOMPLETE. bohemia_agents builds id 'H<houseI+1>-<n+1>' beside
       home:{building:houseI}, so on the run's roster the two agree exactly and
       this changes nothing. On the CITY's roster they do not: its adapter mints
       a unique id per person, so every resident parsed out as the sole occupant
       of their own house and the home focus was empty on the surface he
       actually walks. The declared seat is the fact; the id is a spelling of
       it. Read the fact. */
    var id = String(agent.id || '');
    var house = (agent.home && agent.home.building != null)
      ? 'B' + agent.home.building
      : (id.indexOf('-') > 0 ? id.slice(0, id.indexOf('-')) : null);
    if (house) f.home = 'H:' + (cell ? cell[0] + ',' + cell[1] + ':' : '') + house;
    var j = agent.job;
    /* WHERE THEY WORK. Prefer a DECLARED site, same reason as the roof above:
       district+dir+dist is a SPELLING of a workplace relative to the worker, and
       two people who walk to the same building from opposite sides spell it
       differently. On the run's roster the spelling is fine — those agents share
       a block, so the same jobSite gives the same three fields and they match.
       On the city's it is not: every person's bearing is relative to their own
       neighbourhood, so 27 affiliated people produced 26 different workplaces
       and almost nobody could know anybody. A surface that can resolve the
       bearing into an actual place says so with j.site, and then the place is
       the key. Measured before and after; nothing here is generated. */
    if (j && j.kind === 'site' && j.site) f.work = 'W:' + j.site;
    else if (j && j.kind === 'site' && j.dir && j.dist) f.work = 'W:' + j.district + ':' + j.dir + j.dist;
    /* a scavenger works alone by definition (bohemia_agents: kind 'scav' has no
       site), so scavenging is NOT a focus. Two people who both scavenge have not
       met; they are both out there on their own. */
    if (agent.faction) f.faction = 'F:' + String(agent.faction).toUpperCase();
    return f;
  }

  /* everybody in the roster, bucketed by the foci they share. */
  function groupsOf(roster, cell, keyOf) {
    keyOf = keyOf || function (a) { return String(a && a.id); };
    var g = {};
    (roster || []).forEach(function (a) {
      var f = fociOf(a, cell);
      ORDER.forEach(function (kind) {
        if (!f[kind]) return;
        var id = f[kind];
        (g[id] = g[id] || { kind: kind, members: [] }).members.push(keyOf(a));
      });
    });
    Object.keys(g).forEach(function (id) { g[id].members.sort(); });
    return g;
  }

  /* DOES THIS FOCUS ACTUALLY MAKE THESE TWO ACQUAINTANCES?
     Below the layer: yes, everyone in a small shared setting knows everyone.
     Above it: the graph thins. The pair is decided by a hash of the SORTED pair,
     so the answer is identical whichever way round you ask it — a one-way
     friendship is a bug, not a feature, and hashing an ordered pair is how you
     get one. Expected degree lands on the layer by construction. */
  function pairTies(aKey, bKey, focusId, size, kind) {
    if (aKey === bKey) return false;
    var layer = LAYERS[kind] || ACTIVE;
    if (size - 1 <= layer) return true;
    var lo = aKey < bKey ? aKey : bKey, hi = aKey < bKey ? bKey : aKey;
    var h = hash(strHash(lo + '|' + hi), strHash(focusId));
    return (h % 100000) / 100000 < (layer / (size - 1));
  }

  /* EVERYONE THIS PERSON KNOWS, and how. Two people can share more than one focus
     (a neighbour who also runs with your outfit); the STRONGEST one is reported,
     because "how do you know them" has one best answer. */
  function tiesOf(key, roster, cell, keyOf) {
    var g = groupsOf(roster, cell, keyOf);
    var best = {};
    Object.keys(g).forEach(function (focusId) {
      var grp = g[focusId];
      if (grp.members.indexOf(key) < 0) return;
      grp.members.forEach(function (other) {
        if (!pairTies(key, other, focusId, grp.members.length, grp.kind)) return;
        var s = STRENGTH[grp.kind] || 0;
        if (!best[other] || s > best[other].strength)
          best[other] = { key: other, via: grp.kind, strength: s, focus: focusId };
      });
    });
    var out = Object.keys(best).map(function (k) { return best[k]; });
    out.sort(function (a, b) { return b.strength - a.strength || (a.key < b.key ? -1 : 1); });
    /* the active-network ceiling. It almost never binds on one block and it binds
       hard on a valley, which is exactly when it should. */
    return out.slice(0, ACTIVE);
  }

  function knows(aKey, bKey, roster, cell, keyOf) {
    var t = tiesOf(aKey, roster, cell, keyOf);
    for (var i = 0; i < t.length; i++) if (t[i].key === bKey) return t[i];
    return null;
  }

  /* ---- THE VOUCH ---------------------------------------------------------
     Paolo's Mob dossier: "YOU ARE INTRODUCED, YOU DO NOT ASK. Nobody in the Mob
     gives their own name and nobody refuses it either - a third person supplies
     it, and that person is vouching."

     THE VOUCHER HAS TO BE INSIDE. That is not an embellishment, it is what the
     word means and it is what the real thing does: in the thieves-in-law a
     candidate is nominated by existing members who act as GUARANTORS of his
     reputation, and joining the yakuza runs through an introduction by an
     existing member who can vouch for you. A stranger's word is not a vouch. So
     the person who can introduce you to a Mob member must (a) be somebody whose
     NAME YOU KNOW — they have to be a person to you, or nothing is being staked
     — and (b) be in the same outfit as the person they are introducing.

     Returns the introducer, or null. Ordered by tie strength, so you are
     introduced by the closest person who can do it. */
  function vouchFor(strangerKey, roster, cell, opts) {
    opts = opts || {};
    var keyOf = opts.keyOf, known = opts.known || {};
    var stranger = findBy(roster, strangerKey, keyOf);
    if (!stranger || !stranger.faction) return null;      // no outfit, no vouch
    var ties = tiesOf(strangerKey, roster, cell, keyOf);
    for (var i = 0; i < ties.length; i++) {
      var t = ties[i];
      if (!known[t.key]) continue;                        // you do not know them
      var who = findBy(roster, t.key, keyOf);
      if (!who || String(who.faction || '').toUpperCase()
                 !== String(stranger.faction).toUpperCase()) continue;
      return { by: t.key, via: t.via, faction: stranger.faction };
    }
    return null;
  }

  /* ---- OVERHEARD ---------------------------------------------------------
     Paolo's Remnants dossier: "The first name is the thing you earn, and it
     usually arrives from somebody ELSE - you hear another soldier use it before
     they ever offer it."

     WEAKER THAN A VOUCH ON PURPOSE, and the difference is the whole distinction
     between the two factions' mechanics. Nobody is introducing you and nobody is
     staking anything: you only have to have MET the other soldier, not to know
     what to call them. Overhearing costs the person speaking nothing. */
  function overheardFrom(strangerKey, roster, cell, opts) {
    opts = opts || {};
    var keyOf = opts.keyOf, met = opts.met || {};
    var stranger = findBy(roster, strangerKey, keyOf);
    if (!stranger || !stranger.faction) return null;
    var ties = tiesOf(strangerKey, roster, cell, keyOf);
    for (var i = 0; i < ties.length; i++) {
      var t = ties[i];
      if (!met[t.key]) continue;
      var who = findBy(roster, t.key, keyOf);
      if (!who || String(who.faction || '').toUpperCase()
                 !== String(stranger.faction).toUpperCase()) continue;
      return { by: t.key, via: t.via, faction: stranger.faction };
    }
    return null;
  }

  /* ---- INTRODUCED ONWARD -------------------------------------------------
     Paolo's Colorful dossier: "Answer it well and you are introduced onward to
     three people; answer it badly and you are still treated kindly and never
     introduced to anybody." The three are not picked by me — they are the three
     strongest ties the person actually has. */
  function onwardFrom(key, roster, cell, opts) {
    opts = opts || {};
    var n = opts.n || 3, met = opts.met || {};
    return tiesOf(key, roster, cell, opts.keyOf)
      .filter(function (t) { return !met[t.key]; })
      .slice(0, n);
  }

  function findBy(roster, key, keyOf) {
    keyOf = keyOf || function (a) { return String(a && a.id); };
    for (var i = 0; i < (roster || []).length; i++)
      if (keyOf(roster[i]) === key) return roster[i];
    return null;
  }

  /* the one-line answer for a surface: how you know them, in words the player
     already understands. Mechanical narration, never a character speaking —
     this module has no dialogue and must never grow one. */
  var VIA_WORDS = { home: 'SHARE A ROOF', work: 'WORK THE SAME PLACE',
                    faction: 'RUN WITH THE SAME OUTFIT' };
  function viaWords(via) { return VIA_WORDS[via] || ''; }

  /* how many people each person knows, for a gate or a page that wants to check
     the shape of the graph rather than one edge of it. */
  function degrees(roster, cell, keyOf) {
    keyOf = keyOf || function (a) { return String(a && a.id); };
    var out = {};
    (roster || []).forEach(function (a) {
      out[keyOf(a)] = tiesOf(keyOf(a), roster, cell, keyOf).length;
    });
    return out;
  }

  var API = {
    LAYERS: LAYERS, ACTIVE: ACTIVE, STRENGTH: STRENGTH, FOCI: ORDER,
    VIA_WORDS: VIA_WORDS,
    fociOf: fociOf, groupsOf: groupsOf, pairTies: pairTies, tiesOf: tiesOf,
    knows: knows, vouchFor: vouchFor, overheardFrom: overheardFrom,
    onwardFrom: onwardFrom, viaWords: viaWords, degrees: degrees
  };
  if (HASREQ) module.exports = API; else root.BohemiaTies = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
