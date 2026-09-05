/* ============================================================================
   BOHEMIA HOSTILES (9/5/26, RUN lane) -- PEOPLE ON THE STREET WHO MEAN IT.

   PAOLO PLAYED IT AND ASKED: "Awesome I just played the run. Where the enemies
   at bro." Ruling: records/BOHEMIA_RULING_WHERE_THE_ENEMIES_AT_9_5_26.md.

   MEASURED BEFORE WRITING A LINE OF THIS: the game already knows who your
   enemies are and has never once put one in front of you. Every "hostile" and
   "enemy" string in the alpha, the city and the demo is PROSE. Hostility lives
   in engine/bohemia_between.js as a SIGN ON A RELATIONSHIP -- they charge you
   more, they watch you -- which is a ledger, not a body.

   THIS MODULE IS THE BODY. It answers one question: standing here, who is
   around who means you harm, where are they, and what are they doing about it.

   WHAT IT DELIBERATELY IS NOT:
   - It is not the fight. Nothing here deals damage, and nothing here returns
     'attacks'. NO DAMAGE BEFORE THE DIAL, and COMBAT owns what happens on
     contact ([street fight], routed the same round).
   - It is not the crowd. PEOPLE owns residents wearing the hostile sign.
   - It is not the map tell. UI owns seeing a block is dangerous before you
     enter it ([danger visible]).

   ---- IT IS SHAPED LIKE THE PACKS MODULE ON PURPOSE -------------------------
   engine/bohemia_packs.js already solved "a group that stands somewhere, has
   seen you, closes on you, and an alley is a real out" and Paolo approved it on
   8/30. A second, differently-shaped answer to the same question is how two
   things that should agree drift apart, which this repo has now paid for four
   times. So: the same coarse-lattice placement, the same corridor rule, the
   same local hash, the same no-dependencies discipline, the same probe.
   WHAT IS DIFFERENT IS WHAT DECIDES: a pack is decided by biology, a crew is
   decided by WHOSE GROUND IT IS and WHO THEY ARE AT ODDS WITH.

   ---- THE RULE FOR WHO IS DANGEROUS, AND IT IS MY CALL -----------------------
   MEASURED: the canon graph holds 9 edges and 4 of them are hostile -- Cartel
   and Caravans, Cartel and Remnants -- and NOT ONE of them touches Custom, the
   player's own outfit. `watchers('Custom')` returns an empty array on day 1.
   So a feature driven purely off "who is hostile to ME" ships INVISIBLE on the
   exact surface he just played and asked about, which is the same shape as the
   den bug this lane fixed last week: a thing that only happens when a search
   for something else accidentally lands on it is not a feature.

   Inventing "everybody hates you" is a canon decision and canon is his. So the
   rule is derived from what is already ruled:

       AN OUTFIT PUTS CREWS ON ITS OWN GROUND WHEN IT IS ALREADY AT ODDS WITH
       SOMEBODY -- and to an unaligned stranger walking through, those crews
       are the danger.

   You are a nobody with your own outfit, standing on other people's ground.
   The outfits with enemies are the jumpy ones. That needs no new canon, it puts
   Cartel, Caravans and Remnants crews on the street on day one, it grows by
   itself the moment the ledger says somebody is hostile to YOU, and a valley
   where nobody is at odds with anybody correctly has no crews in it at all.
   Correct-after: if he wants everyone hostile, or nobody, it is one predicate.

   ---- AND THE DISTANCES ARE BOUNDED BY THE CAMERA ---------------------------
   Straight from the packs module's own hard-won note: A STATE THE CAMERA CANNOT
   CONTAIN IS NOT A STATE, IT IS A COMMENT. On the real surface the player sees
   about eight cells up and four across. So the whole ladder fits inside that
   window -- they are on screen while they are still only watching, which is the
   half of his row that says "they are visible before they reach you".
   ========================================================================== */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.BohemiaHostiles = factory();
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var VERSION = 'bohhost-1.0.0';

  /* ---- THE LADDER, IN CELLS ------------------------------------------------
     seeYou    they have clocked you and they are watching. On screen.
     closeAt   they are coming. Still no damage, ever, in this module.
     A crew that noticed you at twenty has already noticed you before it comes
     on screen, so its calm state does not exist to anybody playing. */
  var SEE_YOU = 8;
  var CLOSE_AT = 3;

  /* how many cells apart two crews of the same outfit must be. Wide, because a
     street with a gang on every corner is a shooting gallery, not a place. */
  var SPACING = 90;

  /* how many stand together. Small: this is a crew, not an army, and a group
     you cannot count at a glance on a phone is a crowd. */
  var CREW = [2, 4];

  /* THE CORRIDOR RULE, the same number as the packs module and for the same
     reason: they will not follow you into a narrow place, because only one of
     them could reach you there and that throws away the only advantage they
     have. Backing into an alley is a real out, and it is the one tactic in
     here. Same 0..24 openness scale the wildlife probe reports, so one number
     governs all three modules and they cannot drift. */
  var CORRIDOR = 10;

  /* the hash, same shape as packs and the valley, kept local so this module has
     no dependencies and cannot be broken by somebody else's refactor */
  function h(a, b, c, d) {
    var x = (a | 0) * 374761393 + (b | 0) * 668265263 + (c | 0) * 2246822519 + (d | 0) * 3266489917;
    x = (x ^ (x >>> 13)) >>> 0;
    x = (Math.imul(x, 1274126177)) >>> 0;
    return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
  }

  /* ---- WHO IS DANGEROUS ----------------------------------------------------
     `between` is the caller's -- the module never requires it, so it stays
     dependency-free and a Node test can hand it a fake graph. Returns the list
     of outfit ids that put crews on their ground, and WHY, because a crew that
     cannot say why it is hostile is a spawner.
       'you'    the ledger says they are hostile to your outfit. Earned.
       'odds'   they are at odds with somebody else, and you are a stranger. */
  function dangerous(opts) {
    opts = opts || {};
    var ids = opts.ids || [];
    var mine = opts.mine || null;
    var between = opts.between || function () { return null; };
    var out = [], seen = {};
    for (var i = 0; i < ids.length; i++) {
      var a = ids[i];
      if (!a || seen[a]) continue;
      if (mine && a === mine) continue;          /* your own outfit is not the danger */
      var why = null;
      if (mine) {
        var r = between(a, mine);
        if (r && r.sign === 'hostile') why = 'you';
      }
      if (!why) {
        for (var j = 0; j < ids.length && !why; j++) {
          if (ids[j] === a) continue;
          var e = between(a, ids[j]);
          if (e && e.sign === 'hostile') why = 'odds';
        }
      }
      if (!why) continue;
      seen[a] = 1;
      out.push({ id: a, why: why });
    }
    return out;
  }

  /* ---- IS THERE A CREW NEAR HERE ------------------------------------------
     Same geometry as a pack: a coarse lattice whose spacing IS the rarity, so
     the exclusion falls out of the grid instead of a rejection loop. Not keyed
     on the hour -- a crew that blinks in and out is a spawner, and this is
     meant to be somebody who is there.

     THE GROUND DECIDES WHOSE CREW IT IS, and the caller supplies that answer
     through the probe (`probe(x,y).faction`), because the run already has ONE
     ownership rule and a second one invented here would put the Cartel in two
     places depending on which surface you were standing on. That exact bug has
     been fixed in this repo four times.

     opts: seed, at [x,y], radius, probe(x,y)->{walk,open,edge,faction},
           danger [{id,why}], density, day */
  function near(opts) {
    opts = opts || {};
    var at = opts.at || [0, 0], seed = (opts.seed | 0);
    var R = opts.radius == null ? 40 : opts.radius;
    var probe = opts.probe || function () { return null; };
    var density = opts.density == null ? 1 : opts.density;
    var day = opts.day == null ? 0 : (opts.day | 0);
    var danger = opts.danger || [];
    if (!danger.length) return [];               /* nobody at odds: no crews. Correct. */
    var whyOf = {};
    for (var d = 0; d < danger.length; d++) whyOf[danger[d].id] = danger[d].why;

    var out = [];
    var S = SPACING;
    var gx0 = Math.floor((at[0] - R) / S), gx1 = Math.floor((at[0] + R) / S);
    var gy0 = Math.floor((at[1] - R) / S), gy1 = Math.floor((at[1] + R) / S);
    for (var gy = gy0; gy <= gy1; gy++) for (var gx = gx0; gx <= gx1; gx++) {
      if (h(seed ^ 0x51ae, gx, gy, 3) > density * 0.5) continue;
      var spot = null;
      for (var t = 0; t < 12 && !spot; t++) {
        var cx = gx * S + Math.floor(h(seed ^ 0x1c77, gx * 37 + t, gy, 5) * S);
        var cy = gy * S + Math.floor(h(seed ^ 0x63b9, gx, gy * 37 + t, 5) * S);
        var g = probe(cx, cy);
        if (!g || !g.walk) continue;
        /* A CREW DOES NOT STAND IN A CORRIDOR EITHER. Same number both ways:
           they will not follow you into one and they are not found in one. */
        if (g.open < CORRIDOR) continue;
        /* AND IT HAS TO BE SOMEBODY'S GROUND, and that somebody has to be one
           of the outfits that is at odds. Unowned ground has no crew, which is
           why most of the valley stays quiet. */
        if (!g.faction || !whyOf[g.faction]) continue;
        spot = [cx, cy, g];
      }
      if (!spot) continue;
      if (Math.max(Math.abs(spot[0] - at[0]), Math.abs(spot[1] - at[1])) > R) continue;
      var n = CREW[0] + Math.floor(h(seed ^ 0x9d31, gx, gy, 7) * (CREW[1] - CREW[0] + 1));
      if (n > CREW[1]) n = CREW[1];
      out.push({
        at: [spot[0], spot[1]], count: n,
        faction: spot[2].faction, why: whyOf[spot[2].faction],
        seeAt: SEE_YOU, closeAt: CLOSE_AT,
        /* fixed for this crew for this day, so the crew that lets you past is
           always the one that lets you past. A number re-rolled on every press
           is a slot machine; rolled once per crew it is a character. */
        nerve: h(seed ^ 0x2ea7, gx, gy, 101 + day)
      });
    }
    return out;
  }

  /* ---- WHAT THEY ARE DOING ABOUT YOU --------------------------------------
       idle     they have not clocked you
       watch    they have, and they are standing there looking at you
       close    they are coming
     There is no fourth state. The fourth thing is damage and there is no dial. */
  function stateOf(crew, at) {
    if (!crew) return 'idle';
    var d = Math.max(Math.abs(crew.at[0] - at[0]), Math.abs(crew.at[1] - at[1]));
    if (d <= crew.closeAt) return 'close';
    if (d <= crew.seeAt) return 'watch';
    return 'idle';
  }

  /* ---- WHERE THEY STAND WHEN THEY COME ------------------------------------
     The open cells around you, never a corridor cell, at most one per body.
     Identical rule to the pack ring, deliberately: the alley has to mean the
     same thing whoever is chasing you, or the player learns a tactic that works
     on dogs and gets him killed by people. */
  function ring(crew, at, probe) {
    var out = [];
    if (!crew) return out;
    probe = probe || function () { return null; };
    var here = probe(at[0], at[1]);
    var youNarrow = here && here.open < CORRIDOR;
    for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue;
      if (youNarrow) continue;                  /* they wait at the mouth of it */
      var cx = at[0] + dx, cy = at[1] + dy;
      var g = probe(cx, cy);
      if (!g || !g.walk) continue;
      if (g.open < CORRIDOR) continue;
      out.push([cx, cy]);
    }
    /* nearest to the crew first, so they come from THEIR side rather than
       teleporting around you */
    out.sort(function (p, q) {
      var dp = Math.abs(p[0] - crew.at[0]) + Math.abs(p[1] - crew.at[1]);
      var dq = Math.abs(q[0] - crew.at[0]) + Math.abs(q[1] - crew.at[1]);
      return dp - dq;
    });
    return out.slice(0, crew.count);
  }

  /* ---- WHAT IT SAYS ON THE BUTTON -----------------------------------------
     draft:true, every one. ALWAYS MAKE AN ATTEMPT (8/11): the words ship as a
     real attempt, the ruling waits. Spanglish per the 8/25 law.
     Nothing here promises a fight, because this module cannot start one. */
  var WORDS = {
    you:  ['they know your face', 'esos te conocen', 'that one has your name'],
    odds: ['they are watching everybody', 'nadie pasa por aqui', 'this is their corner']
  };
  function words(crew) {
    if (!crew) return null;
    var list = WORDS[crew.why] || WORDS.odds;
    var i = Math.floor(h(crew.at[0], crew.at[1], 0, 0x77) * list.length);
    return { text: list[Math.min(i, list.length - 1)], draft: true };
  }

  return {
    VERSION: VERSION, SEE_YOU: SEE_YOU, CLOSE_AT: CLOSE_AT,
    SPACING: SPACING, CREW: CREW, CORRIDOR: CORRIDOR, WORDS: WORDS,
    dangerous: dangerous, near: near, stateOf: stateOf, ring: ring,
    words: words, hash: h
  };
}));
