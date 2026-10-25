/* ============================================================================
   BOHEMIA -- EVERY ORIGIN STARTS LIKE ITSELF (RUN TWO, row [every origin starts like itself], 10/25/26)

   PAOLO 10/25 (rule 184, LOCKED): 'in Battle Brothers Lone Wolf you get a gilded god with three stars in the stats
   that actually matter... I don't even see that on this wolf guy, it's just one regular guy, definitely not a lone
   wolf.' MEASURED (TUNING 10/25, records/BOHEMIA_TUNING_EVERY_ORIGIN_STARTS_LIKE_ITSELF_10_25_26.md s1a): the door
   handed the fight {background: hedge_knight, level: 4} and nothing else, so the Lone Wolf was a level-4 label on a
   level-1 body in YOU's rags (90 armour, a pistol and a car door), rolled from his name: THE SAME MAN EVERY GAME.

   NOW an origin may carry a `door` block in records/target/bb/origins.json (the file is the list, MODS rule 22): for
   each of its men, what he walks in with. This file rolls it ONCE A GAME (a fresh seed at the first ask of a new
   game, kept in bohemia.origin.roll.v1 until NEW GAME forgets it) and hands the whole man to the door's picks, so the
   crew screen, the fight and every later screen read the same man:
     body      rolled in his background's own range (backgrounds.json), plus the page's modifier (the Lone Wolf's
               melee defence -2)
     stars     the door's own (the Lone Wolf: three stars each on ranged defence, melee skill, melee defence), or
               Battle Brothers' three talents at 60/30/10 (rules.json talent_star_odds) when it names none
     levels    his levels TAKEN at the door: each level 2..N rolls all eight stats on his stars (rules.json
               stat_gains_by_stars) and his plan's per_level.attributes_raised stats rise, as a level-up does
     kit       each slot one piece rolled from the door's list (the hedge knight's own kit in our things); the bag
     perks     the door's order, as many as his levels' points buy, each tier open (perks.json tiers)
   Numbers are TUNING's (god3, measured 98 in 100 of his first fifty days won against 52 today; and 10/25 the other fourteen,
   banks/BOHEMIA_TUNING_ORIGIN_STARTS_PROPOSED_10_25_26.json lifted: every stated level real, three talents rolled, each origin's
   own kit); the mechanism is ours. An origin with no door block (a modder's) is untouched: its men come as they did.
   ========================================================================== */
(function (root) {
  'use strict';
  var KEY = 'bohemia.origin.roll.v1';
  var STATS = ['hp', 'fatigue', 'resolve', 'initiative', 'melee_skill', 'ranged_skill', 'melee_defense', 'ranged_defense'];
  var STAT_KEY = { hp: 'HP', fatigue: 'Fatigue', resolve: 'Resolve', initiative: 'Initiative', melee_skill: 'Melee Skill',
    ranged_skill: 'Ranged Skill', melee_defense: 'Melee Defense', ranged_defense: 'Ranged Defense' };
  var D = { origins: null, bgs: null, xp: null, tiers: null, ready: false, loading: null };

  function rng(seed) { var a = seed >>> 0; return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function rint(R, a, b) { return a + Math.floor(R() * (b - a + 1)); }
  function rollRange(txt, R) { var m = String(txt).split('-').map(Number); return rint(R, m[0], m.length > 1 ? m[1] : m[0]); }
  function pickOf(R, a) { return Array.isArray(a) && a.length ? a[Math.floor(R() * a.length)] : (a || null); }
  function bgRow(id) { var rs = (D.bgs && D.bgs.rows) || []; for (var i = 0; i < rs.length; i++) if (rs[i].id === id) return rs[i]; return null; }
  function originRow(id) { var os = (D.origins && D.origins.origins) || []; for (var i = 0; i < os.length; i++) if (os[i].id === id) return os[i]; return null; }
  function xpFor(level) {
    if (level <= 1 || !D.xp) return 0;
    var tb = D.xp.level_table_total_xp.value; if (level <= 11) return tb[String(level)];
    var t = tb['11']; for (var l = 11; l < level; l++) t += 4000 + 1000 * (l - 11); return t;
  }
  function freshSeed() {
    try { var a = new Uint32Array(1); (root.crypto || {}).getRandomValues(a); if (a[0]) return a[0]; } catch (e) {}
    return (Math.floor(Math.random() * 4294967295) ^ Date.now()) >>> 0;
  }

  function load(base) {
    if (D.loading) return D.loading;
    base = base || '../records/target/bb/';
    var j = function (u) { return fetch(u).then(function (r) { return r.json(); }); };
    D.loading = Promise.all([j(base + 'origins.json'), j(base + 'backgrounds.json'), j(base + 'rules.json'), j(base + 'perks.json').catch(function () { return null; })])
      .then(function (a) { D.origins = a[0]; D.bgs = a[1]; D.xp = a[2].experience; D.tiers = {};
        ((a[3] && a[3].rows) || []).forEach(function (r) { D.tiers[r.id] = r.tier; }); D.ready = true; return D; })
      .catch(function () { D.loading = null; return null; });
    return D.loading;
  }

  /* Battle Brothers' talents: three of the eight, 60/30/10 (rules.json talent_star_odds) */
  function talents(R) {
    var O = (D.xp && D.xp.talent_star_odds && D.xp.talent_star_odds.value) || { '1': 0.6, '2': 0.3, '3': 0.1 }, pool = STATS.slice(), st = {};
    for (var s = 0; s < 3; s++) { var k = pool.splice(Math.floor(R() * pool.length), 1)[0], q = R(); st[k] = q < O['1'] ? 1 : q < O['1'] + O['2'] ? 2 : 3; }
    return st;
  }
  /* one man the door block describes: def is origins.json men[i] ({background, level}), spec is door.men[i] */
  function rollMan(def, spec, R) {
    var bg = bgRow(def.background); if (!bg) return null;
    var lv = Math.max(1, def.level | 0 || 1), st = {}, mod = spec.modifiers || {};
    STATS.forEach(function (k) { var r = bg.stats[k] || [0, 0]; st[k] = rint(R, r[0], r[r.length - 1]) + (mod[k] | 0); });
    var stars = spec.stars ? Object.assign({}, spec.stars) : talents(R);
    var per = (D.xp.per_level && D.xp.per_level.value) || { attributes_raised: 4, perk_points: 1 };
    var plan = (spec.plan || []).slice(0, per.attributes_raised);
    if (spec.levels_taken !== false) for (var l = 2; l <= lv; l++) {
      var gains = {}; STATS.forEach(function (k) { gains[k] = rollRange(D.xp.stat_gains_by_stars.value[STAT_KEY[k]][stars[k] || 0], R); });
      plan.forEach(function (k) { st[k] += gains[k]; });
    }
    var kit = spec.kit || {}, gear = { main: pickOf(R, kit.main), off: pickOf(R, kit.off), body: pickOf(R, kit.body), head: pickOf(R, kit.head),
      bag: (kit.bag || []).slice(0, 2) };
    while (gear.bag.length < 2) gear.bag.push(null);
    var points = (Math.min(lv, 11) - 1) * (per.perk_points || 1), perks = [];
    (spec.perks || []).forEach(function (id) { if (perks.length < points && perks.length >= ((D.tiers && D.tiers[id]) || 1) - 1) perks.push(id); });
    var man = { background: def.background, level: lv, xp: xpFor(lv), stats: st, stars: stars, gear: gear,
      rolled: true, plan: plan };
    if (spec.perks) man.perks = perks;   /* a door that names no perks leaves his points to him (the crew screen), and the fight picks by his arm until he does */
    if (spec.line) man.line = spec.line;   /* his own line on the crew screen (draft:true, WORDS may rewrite it) */
    return man;
  }
  /* the whole company for an origin, from a seed; null when the origin has no door block (its men come as they did) */
  function roll(id, seed) {
    var o = originRow(id); if (!o || !o.door || !Array.isArray(o.door.men) || !D.ready) return null;
    var R = rng((seed >>> 0) * 7919 + 101), out = [];
    for (var i = 0; i < o.men.length; i++) {
      var spec = o.door.men[i];
      out.push(spec ? (rollMan(o.men[i], spec, R) || { background: o.men[i].background, level: o.men[i].level })
                    : { background: o.men[i].background, level: o.men[i].level });
    }
    return out;
  }
  function kept() { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } }
  /* THIS GAME's men for the origin: the kept roll while the game lasts; a new roll at the first ask of a new game */
  function company(id) {
    var k = kept();
    if (k && k.origin === id && Array.isArray(k.men) && k.men.length) return k.men;
    if (!D.ready) { load(); return null; }
    var seed = freshSeed(), men = roll(id, seed);
    if (!men) return null;
    try { localStorage.setItem(KEY, JSON.stringify({ origin: id, seed: seed, men: men, at: Date.now() })); } catch (e) {}
    return men;
  }
  function forget() { try { localStorage.removeItem(KEY); } catch (e) {} }
  root.BohemiaOriginStart = { KEY: KEY, load: load, roll: roll, company: company, forget: forget, kept: kept, talents: talents, data: D, STATS: STATS };
  /* the data is read as the page comes up, after the door: three small files, nothing in the way of NEW GAME */
  try { if (root.fetch) setTimeout(function () { load(); }, 0); } catch (e) {}
})(typeof window !== 'undefined' ? window : this);
