// BOHEMIA GOOD BROS -- RECRUITS AT THE POST (10/9/26, PEOPLE lane, VAMILY [good bros])
//
// Rule 75d, Paolo 10/9: "finding good bros throughout the settlements... the
// posts are where you hire." Six real Battle Brothers backgrounds, each with
// its REAL stat range and REAL observed hiring-cost range, copied verbatim
// from records/target/bb/backgrounds.json (itself sourced to the wiki dump;
// hiring_cost is null on every row there -- the wiki gives no per-background
// BASE cost, only the Game Guide's own quoted OBSERVED total range per
// background, which is what is used here, never a formula guess). THE PRICE
// IS ROLLED IN CROWNS (the sourced unit) and converted to this game's own
// battery at the already-established ten-to-one rate (rule 63d); both
// numbers are kept, the crown as the citation, the battery as the derived
// price actually charged. THE DAILY WAGE IS KEPT AS A FACT ABOUT THE
// BACKGROUND BUT NEVER CHARGED: the row's own text says "the bought man pays
// 0 a day," the same bought-once principle rule 56 already put on the
// retinue, applied here too.
//
// THE STAR MECHANIC is Grok's own cited reading of the Talents page
// (reference/library/grok/GROK_128_UNDERBELLY_STARS_2026_10_09.md, PASSED
// FILTER): a 60/30/10 split for one/two/three stars, one star raises a
// stat's minimum roll by 1, two by 2, three also raises the maximum by 1.
// WHICH of the eight stats carries the star is NOT given by the source
// (Grok: "I did not open the nut files... I am not filling that label"), so
// this round picks exactly one stat at random per recruit -- an attempt,
// marked tuned:false, not a sourced number.
//
// NOT YET LIVE: traits. No master Battle Brothers trait list exists
// anywhere in this codebase (checked, not assumed -- backgrounds.json only
// carries each background's EXCLUDED traits, never the full ~50-trait pool
// they are excluded from). Inventing trait names from memory would break
// "all the numbers are theirs, exactly, as data" (rule 63d); this round
// ships real stats, real prices and the real star mechanic, and leaves
// traits named, not faked, pending that master list.
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports);

  function hash32(s) {
    s = String(s);
    var h = 2166136261 >>> 0;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    h ^= h >>> 16; h = Math.imul(h, 2246822507) >>> 0;
    h ^= h >>> 13; h = Math.imul(h, 3266489909) >>> 0;
    h ^= h >>> 16;
    return h >>> 0;
  }
  function unit(s) { return hash32(s) / 4294967296; }

  var STAT_KEYS = ['hp', 'fatigue', 'resolve', 'initiative', 'melee_skill', 'ranged_skill', 'melee_defense', 'ranged_defense'];

  // the six at the post. source for every stat range and every hire range:
  // records/target/bb/backgrounds.json rows farmhand/messenger/butcher/
  // brawler/thief/militia, each cross-checked there against the wiki's own
  // Attribute Ranges table.
  var CANDIDATES = [
    { id: 'farmhand', name: 'Farmhand', wage: 10, hireMin: 115, hireMax: 409,
      stats: { hp: [62, 70], fatigue: [100, 120], resolve: [28, 37], initiative: [100, 110], melee_skill: [47, 57], ranged_skill: [32, 42], melee_defense: [0, 5], ranged_defense: [0, 5] } },
    { id: 'messenger', name: 'Messenger', wage: 6, hireMin: 117, hireMax: 217,
      stats: { hp: [50, 60], fatigue: [105, 110], resolve: [35, 40], initiative: [100, 110], melee_skill: [47, 57], ranged_skill: [32, 42], melee_defense: [0, 7], ranged_defense: [3, 8] } },
    { id: 'butcher', name: 'Butcher', wage: 7, hireMin: 187, hireMax: 287,
      stats: { hp: [50, 64], fatigue: [90, 104], resolve: [37, 45], initiative: [100, 110], melee_skill: [50, 59], ranged_skill: [29, 42], melee_defense: [0, 5], ranged_defense: [0, 5] } },
    { id: 'brawler', name: 'Brawler', wage: 13, hireMin: 120, hireMax: 170,
      stats: { hp: [55, 70], fatigue: [100, 105], resolve: [37, 45], initiative: [105, 110], melee_skill: [52, 57], ranged_skill: [32, 42], melee_defense: [0, 5], ranged_defense: [0, 5] } },
    { id: 'thief', name: 'Thief', wage: 10, hireMin: 195, hireMax: 452,
      stats: { hp: [50, 60], fatigue: [90, 100], resolve: [35, 40], initiative: [112, 120], melee_skill: [47, 57], ranged_skill: [32, 42], melee_defense: [5, 13], ranged_defense: [5, 13] } },
    { id: 'militia', name: 'Militia', wage: 10, hireMin: 254, hireMax: 2248,
      stats: { hp: [50, 60], fatigue: [93, 105], resolve: [33, 45], initiative: [100, 110], melee_skill: [52, 62], ranged_skill: [38, 47], melee_defense: [2, 7], ranged_defense: [2, 7] } }
  ];

  function byId(id) { for (var i = 0; i < CANDIDATES.length; i++) if (CANDIDATES[i].id === id) return CANDIDATES[i]; return null; }

  function starCountFor(key) {
    var u = unit(key);
    if (u < 0.60) return 1;
    if (u < 0.90) return 2;
    return 3;
  }

  function starredStatFor(key) {
    var idx = Math.floor(unit(key) * STAT_KEYS.length);
    if (idx >= STAT_KEYS.length) idx = STAT_KEYS.length - 1;
    return STAT_KEYS[idx];
  }

  function rollInt(min, max, key) { return min + Math.round(unit(key) * (max - min)); }

  // one full recruit, fully deterministic: the same (backgroundId, key)
  // always rolls the same recruit, so the same post reload shows the same
  // six men until the seed changes.
  function generate(backgroundId, key) {
    var bg = byId(backgroundId); if (!bg) return null;
    var starredStat = starredStatFor(key + '|star-which');
    var starCount = starCountFor(key + '|star-count');
    var stats = {};
    for (var i = 0; i < STAT_KEYS.length; i++) {
      var sk = STAT_KEYS[i];
      var range = bg.stats[sk];
      var lo = range[0], hi = range[1];
      if (sk === starredStat) {
        lo += (starCount >= 2) ? 2 : 1;
        if (starCount >= 3) hi += 1;
      }
      stats[sk] = rollInt(lo, hi, key + '|' + sk);
    }
    // THE PRICE IS CROWNS; THIS GAME'S MONEY IS BATTERIES, AT THE ESTABLISHED
    // TEN-TO-ONE RATE (rule 63d, GROK_31_TEN_TO_ONE) -- the crown number is
    // kept too, because it is the actually-sourced wiki figure and the
    // battery number is a derived conversion of it, not a second source.
    var priceCrowns = rollInt(bg.hireMin, bg.hireMax, key + '|price');
    var priceBatteries = Math.round(priceCrowns / 10);
    return { backgroundId: bg.id, backgroundName: bg.name,
      wageCrownsPerDay: bg.wage, wageChargedHere: 0, /* bought once, rule 56, applied here too: a hired man costs nothing further per day */
      priceCrowns: priceCrowns, priceBatteries: priceBatteries,
      stats: stats, starredStat: starredStat, starCount: starCount };
  }

  // the six at the post, one per background, keyed off the post's own seed
  // so a new day or a new settlement rolls new men.
  function sixAtThePost(postSeed) {
    return CANDIDATES.map(function (bg, i) {
      return generate(bg.id, postSeed + ':' + i + ':' + bg.id);
    });
  }

  var API = { CANDIDATES: CANDIDATES, STAT_KEYS: STAT_KEYS, byId: byId,
    starCountFor: starCountFor, starredStatFor: starredStatFor, rollInt: rollInt,
    generate: generate, sixAtThePost: sixAtThePost };
  if (HASREQ) module.exports = API;
  root.BohemiaGoodBros = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
