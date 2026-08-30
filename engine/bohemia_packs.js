/* ============================================================================
   BOHEMIA -- TIER 2: THE PACK DOES NOT WANT TO FIGHT YOU (8/30/26, PEOPLE lane)
   Backlog row ALIVE-2. Follows engine/bohemia_wildlife.js (tier 1, 8/28).
   Dispatch item 8: ENEMIES, LOOT, and Valheim-style DANGER BY PLACE.

   *** THE ONE SENTENCE: THE PACK DOES NOT WANT TO FIGHT YOU. IT WANTS THE
   THING. *** Every measured number below says that from a different direction,
   and all of them are the opposite of the convention where an animal sees you
   and closes until one of you is dead.

   THE BACKLOG ROW WAS WRONG ABOUT DOGS AND THE RESEARCH SAYS SO. The row reads
   "pack AI that flanks and breaks off", which is a wolf. A city dog is not a
   wolf: free-ranging dogs "forage solitarily most of the time", form "random
   uncorrelated groups", show "less cooperation in activities such as hunting",
   hold territories that "overlap substantially" between packs, and their
   frequent intergroup conflict "rarely results in lethal aggression". So what a
   city dog pack does is HOLD A SPOT WITH FOOD ON IT AND THREATEN WHAT COMES FOR
   IT, and almost never follow through. That is a better encounter than a hunt,
   because it has a door in it: you can leave, and so can they.
   THE DOGS ARE NOT AT THE ALLEY. THEY ARE AT WHAT IS IN THE ALLEY.

   AND THE COYOTES ARE THE OPPOSITE ANIMAL ON PURPOSE. Coyote territories have
   "very little overlap" and are defended; groups run five to six adults. Dogs:
   overlapping, tolerant, common. Coyotes: exclusive, spaced, rare. The player
   should feel that without being told, so the spacing is real code and not a
   note: you meet dogs often and coyotes seldom.

   *** AND HERE IS THE MEASURED NUMBER THAT INVERTS THE CONVENTION. *** Edmonton,
   120 volunteers, 71 neighbourhoods, 1,598 patrols. Coyotes seen at all in 175
   of them, about 11% of walks. They "retreated before volunteers were within 40
   m during 124 (71%) of the observations and retreated immediately from 22
   (96%) of the hazing events".
   ONE IN TWENTY-THREE DID NOT BACK DOWN. That is the encounter. Not a chance to
   attack -- a chance that the thing you are trying to scare off DOES NOT SCARE,
   and you find out which one you have by trying. Tier 1 was notice, then leave.
   Tier 2 is notice, then DECIDE, and the pack decides too.

   THE ALLEY IS THE MECHANIC AND A ROGUELIKE ALREADY PROVED IT. Brogue's grouped
   monsters avoid attacking in corridors when they are in a group, so a pack does
   not throw away its numbers chasing you somewhere only one of them can reach
   you. Here that is one openness test, and it buys the whole tactical layer:
   THE PACK HOLDS THE MOUTH OF THE ALLEY, so a narrow place is a real out, and
   the player learns it by using it once. It is also honest about the animal: a
   scavenger risking nothing does not follow something bigger into a hole.
   Bohemia is on the beat and I-MOVE-YOU-MOVE, so "surround" is literal -- the
   ring takes one open cell per beat and the arithmetic on the floor is what
   moves you. THE FIGHT HAS TO MOVE YOU.

   AND THE DEN IS THE EXCEPTION, FROM BIOLOGY, WITH NO DIAL. Urban canids den in
   dry culverts, storm drains, under sheds and porches; about half of studied
   dens are in human-built structures, and Las Vegas has the storm drains.
   Coyotes use dens only for pupping. A den is the one place a pack CANNOT do
   the thing above, because it cannot leave: the four percent that does not back
   down is a hundred percent at a den. That is danger by place, and it comes out
   of the animal rather than out of a difficulty number.

   NO DAMAGE BEFORE THE DIAL. There is not one health, damage or armour number
   on this page and the gate greps for that. What is here is distances, nerve,
   and who decides what. WHAT A DEN HOLDS IS HIS: who died and what they were
   carrying is canon, not mechanism, so the contents table ships empty.

     node gates/pack_gate.js
   Research: records/BOHEMIA_WHAT_A_PACK_ACTUALLY_DOES_8_30_26.md
   ============================================================================ */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.BohemiaPacks = factory();
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var VERSION = 'bohpack-1.0.0';

  /* ---- THE TWO ANIMALS ----------------------------------------------------
     `size`      adults in a group. Dogs 2-15 observed, and the common street
                 case is the low end; coyotes five to six adults plus pups.
     `spacing`   how many cells apart two groups of this kind must be. THIS IS
                 THE SOCIALITY, IN CODE: dog ranges overlap substantially, so
                 dogs are allowed to be near each other; coyote ranges barely
                 overlap at all, so they are pushed far apart and become rare
                 without any rarity dial being written down.
     `notice`    it has seen you and stands up.
     `warn`      it postures: heads up, stiff, and it is telling you to go.
     `backDown`  odds it retreats when you assert yourself. 22 of 23 = 0.956.
     `holdsFood` it is on something, which is why it is here at all. */
  /* *** AND THE DISTANCES ARE BOUNDED BY THE SCREEN, WHICH IS NOT A COMPROMISE,
     IT IS THE MEASUREMENT. *** The first cut gave the dogs notice 14 and warn 7,
     reasoned from the animal alone. Measured on the real surface: the canvas is
     378x785 at 44 pixel tiles, so the player can see about EIGHT cells up and
     four across. A dog that notices you at fourteen has ALREADY NOTICED YOU
     before it comes on screen, so its settled state does not exist as far as
     anybody playing is concerned, and half the feature is invisible.
     A STATE THE CAMERA CANNOT CONTAIN IS NOT A STATE, IT IS A COMMENT.
     So the dog's ladder fits inside the window: settled at eight, heads up at
     six, posturing at three. It is also the truer number for THIS animal --
     free-ranging dogs beg from people and live on our waste, so they are the
     canid with the SHORT flight distance, not the long one.
     The coyote keeps the measured forty, because for a coyote the point is that
     it clocked you long before you saw it. */
  var KINDS = [
    { id: 'dogs', name: 'dogs', size: [2, 6], spacing: 26,
      notice: 6, warn: 3, backDown: 0.956, holdsFood: true,
      denAnywhere: true,
      /* "primarily scavengers dependent on human-generated waste" */
      note: 'they are standing on something and they saw you coming' },
    { id: 'coyotes', name: 'coyotes', size: [2, 6], spacing: 140,
      notice: 40, warn: 6, backDown: 0.956, holdsFood: false,
      denAnywhere: false,
      note: 'spaced out, and it would rather be somewhere you are not' }
  ];

  function kindFor(id) {
    for (var i = 0; i < KINDS.length; i++) if (KINDS[i].id === id) return KINDS[i];
    return null;
  }

  /* ---- WHAT THE ANIMALS LOOK LIKE -----------------------------------------
     THE COYOTE SPRITE ALREADY EXISTS. Tier 1 cooked one on 8/28 and this tier
     uses that exact sprite rather than a second one, because a second drawing
     of the same animal is how two things that should be one drift apart. Only
     the dogs are new.

     AND A LIST IS NOT A DISTRIBUTION. This repo has now been bitten three
     separate times by picking uniformly over a list whose contents are not
     uniform in life -- pink hair at 12.8% of the valley, three pink heads in
     sixteen, and a trenchcoat on one person in five. So the coats are WEIGHTED,
     and the street dog that is actually common is common here.
     They also differ in SIZE, not only in colour: a recolour is never progress
     (7/19), so the three dogs are three geometries. */
  var COATS = {
    dogs: [ { id: 'dogsandy', w: 0.55 }, { id: 'dogblack', w: 0.28 },
            { id: 'dogpale',  w: 0.17 } ],
    coyotes: [ { id: 'coyote', w: 1 } ]
  };

  /* which coat the i-th animal of a group wears. Deterministic off the group's
     own cell, so the dog you saw yesterday is the dog you see today. */
  function coatFor(pack, i) {
    var list = COATS[pack && pack.kind] || COATS.dogs;
    var r = h(pack.at[0], pack.at[1], i, 0x3ab1), acc = 0;
    for (var j = 0; j < list.length; j++) {
      acc += list[j].w;
      if (r < acc) return list[j].id;
    }
    return list[list.length - 1].id;
  }

  /* THE CORRIDOR RULE. A cell whose 5x5 has fewer than this many walkable cells
     is a place a pack will not follow you into, because only one of them could
     reach you there and that throws away the only advantage it has. The probe
     reports `open` on the same 0..24 scale tier 1 uses, so one number governs
     both modules and they cannot drift. */
  var CORRIDOR = 10;

  /* the hash, same shape as tier 1 and the valley, kept local so this module has
     no dependencies and cannot be broken by somebody else's refactor */
  function h(a, b, c, d) {
    var x = (a | 0) * 374761393 + (b | 0) * 668265263 + (c | 0) * 2246822519 + (d | 0) * 3266489917;
    x = (x ^ (x >>> 13)) >>> 0;
    x = (Math.imul(x, 1274126177)) >>> 0;
    return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
  }

  /* ---- IS THERE A PACK NEAR HERE ------------------------------------------
     A pack sits on a COARSE lattice whose spacing IS the animal's sociality, so
     the exclusion is geometric rather than a rejection loop: two coyote groups
     cannot be near each other because there is no lattice point near enough to
     hold the second one. Deterministic off the seed and the lattice cell, and
     NOT off the hour -- a pack that blinks in and out every hour is a spawner,
     and this is supposed to be something that lives there.
     opts: seed, at [x,y], radius, probe(x,y)->{walk,open,edge,food}, density */
  function near(opts) {
    opts = opts || {};
    var at = opts.at || [0, 0], seed = (opts.seed | 0);
    var R = opts.radius == null ? 40 : opts.radius;
    var probe = opts.probe || function () { return null; };
    var density = opts.density == null ? 1 : opts.density;
    var day = opts.day == null ? 0 : (opts.day | 0);
    var out = [];
    for (var k = 0; k < KINDS.length; k++) {
      var kd = KINDS[k], S = kd.spacing;
      var gx0 = Math.floor((at[0] - R) / S), gx1 = Math.floor((at[0] + R) / S);
      var gy0 = Math.floor((at[1] - R) / S), gy1 = Math.floor((at[1] + R) / S);
      for (var gy = gy0; gy <= gy1; gy++) for (var gx = gx0; gx <= gx1; gx++) {
        var r0 = h(seed ^ (k * 0x1f83), gx, gy, 11);
        if (r0 > density * 0.5) continue;
        /* DOES THIS GROUP WANT A DEN? Asked BEFORE the ground is searched, and
           that ordering is the whole of it. The first cut asked afterwards --
           find any legal spot, then test whether it happened to be den ground --
           and dens came out at ZERO over sixty seeds, because ordinary open
           ground always won the search and den ground never got looked for.
           A FEATURE THAT ONLY HAPPENS WHEN A SEARCH FOR SOMETHING ELSE
           ACCIDENTALLY LANDS ON IT IS NOT A FEATURE, it is a leftover. Same
           shape as a dial that cannot move the pixels. */
        var wantsDen = h(seed ^ 0x6d2b, gx, gy, k * 7 + 5) < 0.22;
        var spot = null, isD = false;
        for (var pass = 0; pass < 2 && !spot; pass++) {
          /* pass 0 looks for what this group actually wants; pass 1 settles for
             ordinary ground, so a group that cannot find a den is still a group
             rather than nothing at all. */
          var seek = wantsDen && pass === 0;
          for (var t = 0; t < 10 && !spot; t++) {
            var cx = gx * S + Math.floor(h(seed ^ 0x7ed5, gx * 37 + t, gy, k + pass * 5) * S);
            var cy = gy * S + Math.floor(h(seed ^ 0x2f1b, gx, gy * 37 + t, k + pass * 5) * S);
            var g = probe(cx, cy);
            if (!g || !g.walk) continue;
            /* A PACK DOES NOT LIVE IN A CORRIDOR EITHER. Same number, both ways:
               it will not follow you into one and it will not be found in one. */
            if (g.open < CORRIDOR) continue;
            if (seek) { if (!denGround(g, kd)) continue; }
            else if (kd.holdsFood && !g.food && !g.edge) continue;
            spot = [cx, cy, g];
            isD = seek;
          }
        }
        if (!spot) continue;
        if (Math.max(Math.abs(spot[0] - at[0]), Math.abs(spot[1] - at[1])) > R) continue;
        var n = kd.size[0] + Math.floor(h(seed ^ 0xb5d1, gx, gy, k + 3)
                  * (kd.size[1] - kd.size[0] + 1));
        if (n > kd.size[1]) n = kd.size[1];
        /* NERVE IS THE PACK'S, NOT THE ROLL'S. It is fixed for this group for
           this day, so a pack you backed off yesterday is the same pack that
           backs off today, and the one that does not is ALWAYS the one that
           does not. A percentage re-rolled every time you press is a slot
           machine; a percentage rolled once per group is a character. */
        var nerve = h(seed ^ 0x4c1d, gx, gy, k * 101 + day);
        var den = isD;
        out.push({
          kind: kd.id, name: kd.name, at: [spot[0], spot[1]], count: n,
          onFood: !!spot[2].food, den: den,
          noticeAt: kd.notice, warnAt: kd.warn,
          /* AT A DEN NOTHING BACKS DOWN, and that is the whole of danger by
             place: the pack is not angrier, it is CORNERED BY ITS OWN PUPS. */
          backDown: den ? 0 : kd.backDown, nerve: nerve,
          note: kd.note
        });
      }
    }
    return out;
  }

  /* WHAT DEN GROUND IS. Cover and an edge to be under, which is all that "dry
     culverts, under sheds, under porches" can mean when the only things the
     surface can tell us are openness and whether something solid is beside it.
     Dogs are not put off by people and coyotes are, so the split falls out of
     the one flag rather than a second table. */
  function denGround(g, kd) {
    if (!g || !g.edge) return false;
    if (g.open > DEN_OPEN) return false;         /* a den is under something */
    if (!kd.denAnywhere && g.food) return false; /* coyotes avoid our mess */
    return true;
  }
  var DEN_OPEN = 16;

  /* ---- WHAT IT THINKS OF YOU ----------------------------------------------
     Three states and they are not the same state with a bigger number:
       settled  it has not decided anything about you
       notice   it has seen you and stood up
       warn     it is telling you to leave, and it has not moved at you
     The fourth thing is not a state, it is what happens when you ASSERT. */
  function stateOf(pack, at) {
    if (!pack) return 'settled';
    var d = Math.max(Math.abs(pack.at[0] - at[0]), Math.abs(pack.at[1] - at[1]));
    if (d <= pack.warnAt) return 'warn';
    if (d <= pack.noticeAt) return 'notice';
    return 'settled';
  }

  /* ---- YOU PUSH, AND IT DECIDES -------------------------------------------
     This is the Edmonton finding as a function. Ninety-six times in a hundred
     the thing you shouted at leaves. AT A DEN, NEVER.
     Returns 'backs-off' or 'holds'. It never returns 'attacks', because that is
     damage and there is no dial yet. */
  function assert(pack) {
    if (!pack) return 'backs-off';
    return pack.nerve < pack.backDown ? 'backs-off' : 'holds';
  }

  /* ---- THE RING -----------------------------------------------------------
     Where the pack wants to stand, one cell per beat. It takes the open cells
     around you and NEVER a corridor cell, so backing into a narrow place is a
     real out. Returns the cells it would move to, nearest first, at most one
     per animal. */
  function ring(pack, at, probe) {
    var out = [];
    if (!pack) return out;
    probe = probe || function () { return null; };
    var here = probe(at[0], at[1]);
    /* IF YOU ARE IN THE CORRIDOR, THE RING IS THE MOUTH OF IT. They stop at the
       edge of the narrow place and wait, which is Brogue's rule and the reason
       the alley means anything. */
    var youNarrow = here && here.open < CORRIDOR;
    for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue;
      var cx = at[0] + dx, cy = at[1] + dy;
      var g = probe(cx, cy);
      if (!g || !g.walk) continue;
      if (g.open < CORRIDOR) continue;      /* it will not stand in the alley */
      if (youNarrow) continue;              /* and it will not come in for you */
      out.push([cx, cy]);
    }
    return out.slice(0, pack.count);
  }

  /* WHAT THE PLAYER IS TOLD. draft:true, per the 8/11 rule: a real attempt,
     written as if it ships, and he edits it in the WORDS tab. Nobody in Bohemia
     is wise, so none of these is a lesson about dogs. */
  function lineFor(pack, state) {
    if (!pack) return null;
    if (pack.den && state === 'warn')
      return 'that one is not moving. there is something behind it.';   /* draft:true */
    if (state === 'warn' && pack.kind === 'dogs')
      return 'four of them, and they got here first.';                  /* draft:true */
    if (state === 'warn' && pack.kind === 'coyotes')
      return 'it stopped. it is deciding.';                             /* draft:true */
    if (state === 'notice') return 'heads up, all at once.';             /* draft:true */
    return null;
  }

  /* WHAT A DEN HOLDS. EMPTY ON PURPOSE -- who died and what was in their
     pockets is canon and canon is his. The mechanism is here so the moment he
     rules, it is one edit and not a build. MECHANISM MINE, CONTENTS HIS. */
  var DEN_HOLDS = [];

  var CANNOT = [
    'nothing here does damage and nothing here has health: no dial yet',
    'a den is empty until he says what is in one',
    'nothing in the world is marked as FOOD yet, so a pack settles for an edge',
    'and it does not know what a roof or a storm drain is, only openness'
  ];

  return {
    VERSION: VERSION, KINDS: KINDS, CORRIDOR: CORRIDOR, DEN_HOLDS: DEN_HOLDS,
    CANNOT: CANNOT, kindFor: kindFor, near: near, denGround: denGround, DEN_OPEN: DEN_OPEN,
    stateOf: stateOf, assert: assert, ring: ring, lineFor: lineFor, hash: h,
    COATS: COATS, coatFor: coatFor
  };
}));
