/* ============================================================================
   BOHEMIA -- THE ROSTER (RUN TWO, row [the roster screen], 10/9/26)

   One place that turns a crew entry into a whole man: his background (Battle Brothers'
   backgrounds.json, the wiki's attribute ranges), his rolled stats and their STARS, his gear
   as items the bag and the shops already speak, his look from the fight's own people sheets
   (slices/fight_people/, rule 69: every character from the bank), his one pain line. The roster
   screen draws it; the settlement's hall shows the same card before you pay (Grok's 'see the
   hire', in VOTE). The fight reads the formation the roster hands it (COMBAT [your formation]:
   {front:[crew index|null x9], back:[...]}).

   Numbers are the wiki's where the repo has them (records/target/bb/). THE STAR RULE is not in
   the repo's wiki text, so it is ours and marked: up to three stats get one to three stars,
   one star likeliest. Pain lines are draft:true attempts (WORDS owns the voice).
   ========================================================================== */
(function (root) {
  'use strict';
  var D = { ours: null, backgrounds: null, armor: null, weapons: null, people: null };
  var STATS = ['hp', 'fatigue', 'resolve', 'initiative', 'melee_skill', 'ranged_skill', 'melee_defense', 'ranged_defense'];
  var STAT_NAME = { hp: 'HITPOINTS', fatigue: 'FATIGUE', resolve: 'RESOLVE', initiative: 'INITIATIVE', melee_skill: 'MELEE SKILL',
    ranged_skill: 'RANGED SKILL', melee_defense: 'MELEE DEF', ranged_defense: 'RANGED DEF' };
  /* the job names COMBAT gave the weapon classes (ours.json weapon_jobs), and plain ones for the rest */
  var CLASSNAME = { dagger: 'pistol', mace: 'pipe', hammer: 'sledge', crossbow: 'rifle', firearm: 'shotgun', throwing: 'bottles',
    throwable_item: 'bottles', sword: 'machete', axe: 'fire axe', spear: 'rebar spear', cleaver: 'cleaver', flail: 'chain',
    polearm: 'pole hook', bow: 'compound bow' };
  var PAIN = { /* draft:true, one line each, said like a person, never a stat */
    sellsword: 'Fought for whoever paid in batteries. Nobody paid twice.',
    militia: 'Held a street for a block that does not exist any more.',
    brawler: 'Knuckles that set wrong and a grin that never did.',
    retired_soldier: 'Came home after the dollar died and there was no home.',
    thief: 'Took a man\'s last cell once. Still hears him asking for it.',
    farmhand: 'Grew squash in a dry wash until the well went salt.',
    beggar: 'Sat on the same corner for six years. Somebody else has it now.',
    _: 'Does not talk about before. You do not ask.' };
  function seed(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(s) { var x = s >>> 0 || 1; return function () { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return ((x >>> 0) % 100000) / 100000; }; }
  function priceOf(v) { return Math.max(1, Math.round((v || 0) / 10)); }

  function load(base) {
    base = base || '../records/target/bb/';
    function j(u) { return fetch(u).then(function (r) { return r.json(); }); }
    return Promise.all([j(base + 'ours.json'), j(base + 'backgrounds.json'), j(base + 'armor.json'), j(base + 'weapons.json'),
      j('fight_people/fight_people.json').catch(function () { return null; })])
      .then(function (a) { D.ours = a[0]; D.backgrounds = a[1]; D.armor = a[2]; D.weapons = a[3]; D.people = a[4]; return D; });
  }
  function bgRow(id) { var rs = (D.backgrounds && D.backgrounds.rows) || []; for (var i = 0; i < rs.length; i++) if (rs[i].id === id) return rs[i]; return null; }
  function armourName(kind, dur) {
    if (kind === 'head') return dur < 40 ? 'a rag hood' : dur < 100 ? 'a hard hat' : dur < 180 ? 'a riot helmet' : 'a full riot helm';
    if (kind === 'shields') return dur < 40 ? 'a car door' : 'a riot shield';
    return dur < 40 ? 'a work jacket' : dur < 100 ? 'a padded vest' : dur < 180 ? 'a plate carrier' : 'full riot armour';
  }
  /* an item the bag, the shops and the roster all speak: {id, kind, name, was, price, nums} */
  function itemOf(kind, id) {
    if (!id) return null;
    if (kind === 'weapon') {
      var rows = (D.weapons && D.weapons.rows) || [], r = null;
      for (var i = 0; i < rows.length; i++) if (rows[i].id === id) r = rows[i];
      if (!r) return null;
      var c = CLASSNAME[r['class']] || r['class'];
      return { id: r.id, kind: 'weapon', name: c, was: r.name, price: priceOf(r.value),
        nums: 'dmg ' + r.damage_min + '-' + r.damage_max + (r.range_max ? '  reach ' + r.range_max : '') };
    }
    var list = kind === 'head' ? D.armor.head : kind === 'shield' ? D.armor.shields : D.armor.body, a = null;
    for (var k = 0; k < list.length; k++) if (list[k].id === id) a = list[k];
    if (!a) return null;
    return { id: a.id, kind: kind, name: armourName(kind === 'shield' ? 'shields' : kind, a.durability), was: a.name, price: priceOf(a.value),
      nums: 'holds ' + a.durability + (a.fatigue != null ? '  weight ' + Math.abs(a.fatigue) : '') };
  }
  /* a man from a crew entry: stats rolled in his background's wiki range, stars on up to three */
  function manOf(def, i) {
    var bg = bgRow(def.background) || { id: def.background, name: def.background, stats: D.backgrounds.base_stats.stats, daily_wage: 10 };
    var R = rng(seed((def.name || 'man') + ':' + i)), st = {}, stars = {};
    STATS.forEach(function (k) { var rg = (bg.stats && bg.stats[k]) || [0, 0]; st[k] = Math.round(rg[0] + R() * (rg[1] - rg[0])); });
    var pool = STATS.slice(), n = 1 + Math.floor(R() * 3);
    for (var s = 0; s < n; s++) { var k2 = pool.splice(Math.floor(R() * pool.length), 1)[0]; var q = R(); stars[k2] = q < .6 ? 1 : q < .9 ? 2 : 3; }
    var rowsW = D.ours.weapon_rows && D.ours.weapon_rows.value || {};
    var jobs = def.jobs || [], main = null, off = null;
    jobs.forEach(function (jb) { var it = itemOf(jb === 'car_door' ? 'shield' : 'weapon', rowsW[jb]); if (!it) return; if (it.kind === 'shield') off = it; else if (!main) main = it; });
    if (off) off.name = jobs.indexOf('car_door') >= 0 ? 'a car door' : off.name;
    var looks = D.people ? Object.keys(D.people.looks).filter(function (l) { return /^cast_/.test(l); }) : [];
    return { id: 'm' + i, idx: i, name: def.name, main: !!def.main, background: bg.name || bg.id, bgId: bg.id,
      level: 1, xp: 0, stats: st, stars: stars, perks: [], wage: Math.max(1, Math.round((bg.daily_wage || 10) / 10)),
      gear: { main: main, off: off, body: itemOf('body', def.body), head: itemOf('head', def.head) },
      look: def.main ? 'you' : (looks.length ? looks[i % looks.length] : 'you'),
      pain: PAIN[bg.id] || PAIN._, draft: true };
  }
  function startingCrew() { return ((D.ours && D.ours.crew && D.ours.crew.value) || []).map(manOf); }
  /* which slot an item goes in */
  function slotFor(it) { return !it ? null : it.kind === 'weapon' ? 'main' : it.kind === 'shield' ? 'off' : it.kind === 'head' ? 'head' : 'body'; }
  /* the look: a crop of the fight's own sheet (14 frames of 112 and the 64 face, rule 69) */
  function sheetSrc(look) { var l = D.people && D.people.looks[look]; return 'fight_people/' + (l ? l.file : 'you.webp'); }
  var API = { load: load, data: D, STATS: STATS, STAT_NAME: STAT_NAME, manOf: manOf, startingCrew: startingCrew, itemOf: itemOf,
    slotFor: slotFor, sheetSrc: sheetSrc, FRAME: 112, FACE: { x: 1568, y: 0, s: 64 }, SLOTS_PER_ROW: 9 };
  root.BohemiaRoster = API;
})(typeof window !== 'undefined' ? window : this);
