/* ===========================================================================
   BOHEMIA — EVERY PERSON IS A DIFFERENT PERSON  (BOH_PERSONLOOK, 7/31/26)
   ---------------------------------------------------------------------------
   Paolo 7/31: "WE HAVE 11 months of forward motion work we need to complete.
   Do what you have to do next and know what comes after."

   THE GAP. This header first said "nothing in the repo varies a person's
   appearance -- no seed, no per-agent body, no per-agent outfit." THAT WAS WRONG,
   and the crowd board is what exposed it. NPCFactory has been in
   engine/bohemia_engine.js since 7/2/26: seeded, deterministic, wired into the
   RUN and the SLICE and the RANDOM CITIZEN button, and it varies SKIN TONE
   (Paolo's 9 locked ramps) and HAIR COLOUR. Measured on 8 ids: 6 distinct skin
   tones, 5 distinct hair colours. It has been working the whole time.

   THE REAL GAP was narrower and it was two halves of one person:
     NPCFactory      skin + hair. Cannot vary body (it predates the dials) and
                     cannot vary clothes -- it reads only PD.layers, his painted
                     wardrobe, which holds exactly ONE option per slot.
     this module      body + clothes, from the six dials and the 221 approved
                     garments. Does not touch skin or hair, and must not: that
                     would be a second mechanism for a field another module
                     already owns (ENGINE SYNC LAW).
   Neither knew the other existed, so nothing handed them the same id and no
   caller ever assembled a whole person. That is what the crowd board does.

   WHAT THIS IS: a pure function. id -> a look. Same id, same person, forever, on
   every device, with no stored state and no random calls. That matters more than
   it sounds: an NPC has to look the same when you walk away and come back, and
   across a save, and the cheapest way to guarantee that is to never roll dice.

   WHAT IT DELIBERATELY DOES NOT TOUCH, and each has a reason:
     SKIN TONE      his palette, his ruling. Varying complexion across a
                    population is a canon decision, not a mechanism decision.
     THE RIG        ONE RIG (7/25, LOCKED). Every body here is his painted body
                    plus dial values. No new anatomy, ever -- that is the
                    woman-rig v1-v4 mistake and it is not repeated.
     SEX-AWARE FAT  "nah when i put fat its like your fat fuck that woman belly
                    shit. these characters are going to be more unisex vibes"
                    (7/29). Belly is belly. There is no sex term in here.
     NEW ART        REUSE-FIRST. It only ever names garments Paolo already
                    approved; it cannot invent one.

   MECHANISM-MINE / CONTENTS-PAOLO'S: the shuffle is mine, the wardrobe is his.
   This file holds NO garment names -- it selects from whatever is canon at
   runtime, so anything he kills disappears from the streets automatically and
   anything he approves shows up without a code change.

   DIAL RANGES are deliberately narrower than the editor's. The sliders exist so
   HE can push a body to an extreme; a crowd should read as a range of ordinary
   people, not a carnival. Extremes stay available to him and stay off the street.
   =========================================================================== */
(function (root) {
  'use strict';

  /* FNV-1a + a MURMUR3 FINALIZER. Deterministic, no Math.random -- see the note
     above about walking away and coming back. Two different fields of the same
     id get different streams by salting, so height and belly are not correlated.

     THE FINALIZER IS NOT DECORATION, it is the whole thing working. Plain FNV-1a
     ends on `h = (h ^ lastByte) * prime`, and the LOW bits of a product depend
     only on the LOW bits of its inputs -- so ids that differ only in their last
     character land in a small neighbourhood down there. Then `% 100000` reads
     almost entirely low bits and hands that correlation straight to the dials.
     Real ids are sequential (npc-0, npc-1, npc-2 ...), which is precisely the
     worst case. MEASURED before this line existed: 64 sequential ids produced
     only 24 distinct arm values and 17 distinct hip values, and two of twelve
     citizens on the crowd board came out with byte-identical bodies. The old
     "200 ids -> 188 distinct bodies" check passed the whole time, because
     distinct-as-a-tuple hides a dial that barely moves. Three xor-shifts and two
     multiplies push every input bit into every output bit; the same 64 ids now
     give 64 distinct values on every dial. */
  function h32(str) {
    var h = 2166136261 >>> 0;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    h ^= h >>> 16; h = Math.imul(h, 2246822507) >>> 0;
    h ^= h >>> 13; h = Math.imul(h, 3266489909) >>> 0;
    h ^= h >>> 16;
    return h >>> 0;
  }
  function unit(id, salt) { return (h32(salt + '|' + id) % 100000) / 100000; }

  /* a soft bell instead of a flat roll: most people are near the middle, a few
     are not. A uniform crowd reads as noise; this reads as a population. */
  function bell(id, salt) { return (unit(id, salt + 'a') + unit(id, salt + 'b')) / 2; }

  /* THE CROWD RANGE, not the editor range. Each is a half-width around 0. */
  var RANGE = {
    height:    0.55,
    belly:     0.45,
    arms:      0.40,
    shoulders: 0.50,
    armLength: 0.35,
    hips:      0.45
  };

  /* how often a category is worn at all. A street where everyone has a coat and
     a bag is as wrong as one where nobody does. */
  var WEAR_ODDS = {
    base: 1.00, legs: 1.00, feet: 0.97,
    hair: 0.93,                      /* 8/1: the category went from 1 shape to 26.
                                        Not 1.00 -- some people shave their head, and
                                        a hat hides it anyway. */
    outer: 0.45, head: 0.30, neck: 0.22,
    face: 0.10, hands: 0.14, waist: 0.18, back: 0.16, gear: 0.12
  };

  function bodyFor(id) {
    var b = {};
    for (var k in RANGE) b[k] = +((bell(id, k) * 2 - 1) * RANGE[k]).toFixed(3);
    return b;
  }

  /* garments: whatever is CANON right now. The pool is his and it is read live. */
  function outfitFor(id, garments) {
    var out = {};
    if (!garments || !garments.length) return out;
    var byCat = {};
    for (var i = 0; i < garments.length; i++) {
      var g = garments[i];
      if (!g || g.st !== 'canon' || !g.layer) continue;
      (byCat[g.layer] = byCat[g.layer] || []).push(g);
    }
    /* CANONICAL KEY ORDER. Without this the returned object's key order followed
       the input array's order, so the same person "changed" whenever GARMENTS was
       reordered -- invisible to the eye, fatal to any equality check or save
       comparison. The gate caught it by shuffling the pool. */
    var cats = Object.keys(byCat).sort();
    for (var ci = 0; ci < cats.length; ci++) {
      var cat = cats[ci];
      var odds = WEAR_ODDS[cat];
      if (odds === undefined) continue;                 /* unknown category: leave it alone */
      if (unit(id, 'wear:' + cat) > odds) continue;     /* not wearing one today */
      /* SORTED so the pick cannot depend on array order -- a garment added
         anywhere in GARMENTS must not reshuffle everyone already on the street. */
      var pool = byCat[cat].slice().sort(function (x, y) { return x.n < y.n ? -1 : x.n > y.n ? 1 : 0; });
      /* A HAIRCUT IS A LUXURY (Paolo 8/1, LOCKED). His law says unmaintained hair is
         the DEFAULT across a population and a machine taper is a wealth signal --
         "a luxury reserved for Rich people". The pick was uniform, so a sharp fade
         was exactly as common on the street as unkempt long hair, and the law had
         no machine behind it. It does now.
         The UNLOCK is still [PENDING, HIS CALL] and is NOT invented here. This is
         only the DISTRIBUTION half, which that addendum assigns to me. It reads a
         `lux` FLAG on the garment -- data, not a name -- so this module still holds
         no garment names and he can retag anything without touching code. */
      var _luxOdds = 0.22;
      var _plain = pool.filter(function (x) { return !x.lux; });
      var _use = (_plain.length && unit(id, 'lux:' + cat) > _luxOdds) ? _plain : pool;
      out[cat] = _use[Math.floor(unit(id, 'pick:' + cat) * _use.length) % _use.length].n;
    }
    return out;
  }

  function lookFor(id, garments) {
    id = String(id);
    return { id: id, body: bodyFor(id), worn: outfitFor(id, garments) };
  }

  var API = {
    lookFor: lookFor,
    bodyFor: bodyFor,
    outfitFor: outfitFor,
    RANGE: RANGE,
    WEAR_ODDS: WEAR_ODDS,
    _h32: h32
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  root.BOH_PERSONLOOK = API;
})(typeof window !== 'undefined' ? window : globalThis);
