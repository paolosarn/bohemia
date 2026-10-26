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
  /* EYES [eyes: you the companion] (rule 150, 10/24: 'YOU and DESI carry the same line'): a man with no line of his own draws one
     from this pool by his name, and the crew screen never shows two men the same line (draft:true); YOU have your own, in
     the second person, because the card is about you */
  var PAIN_POOL = ['Does not talk about before. You do not ask.', 'Keeps a dead phone in his pocket and charges it anyway.',
    'Walked in off the salt flats in somebody else\'s boots.', 'Counts every battery twice and trusts nobody who counts once.',
    'Lost a brother in the water lines. Drinks slow because of it.', 'Sleeps sitting up, facing the door.',
    'Fixed slot machines on the Strip once. Fixes guns now.', 'Laughs at the wrong moment and never says why.'];
  var PAIN_YOU = 'You came in off the road with what you carry. Nobody here knows your name yet.';
  /* OUR NAMES FOR THEIR BACKGROUNDS (EYES [eyes: the BB names], rule 150; his 9/28: 'our own way, never a rip-off'): the
     wiki's 77 backgrounds keep their numbers and their ids (the data and the fight read those); what a player reads is ours,
     the valley's own trades in 2050, each the same lesson in our skin (draft:true, WORDS may rename any). A plain English
     trade the wiki happens to share (a butcher, a miner, a thief) keeps its plain word. */
  var BG_NAME = { adventurous_noble: 'casino heir', anatomist: 'body broker', apprentice: 'shop kid', assassin: 'contract man',
    southern_assassin: 'border knife', barbarian: 'desert wild', bastard: 'casino bastard', beast_slayer: 'lab hunter', beggar: 'corner sitter',
    belly_dancer: 'lounge dancer', bowyer: 'bow maker', caravan_hand: 'convoy hand', companion_2hand: 'old friend', companion_1hand: 'old friend',
    companion_ranged: 'old friend', converted_crusader: 'lapsed preacher', cripple: 'busted up', crusader: 'church gun', cultist: 'static listener',
    daytaler: 'day hire', disowned_noble: 'cut-off heir', regent_in_absentia: 'lost mayor', eunuch: 'cut man', executioner: 'hangman',
    farmhand: 'dry-farm hand', fisherman: 'lake fisher', flagellant: 'penitent', monk_turned_flagellant: 'burned-out penitent', gladiator: 'pit fighter',
    graverobber: 'grave picker', hedge_knight: 'road knight', historian: 'archivist', houndmaster: 'dog man', indebted: 'debtor',
    barbarian_indebted: 'wild debtor', southern_indebted: 'border debtor', juggler: 'street act', killer_on_the_run: 'man on the run',
    king_s_guard: 'casino guard', lindwurm_slayer: 'big-game hunter', lumberjack: 'salvage cutter', manhunter: 'bounty hunter', mason: 'block layer',
    messenger: 'runner', militia: 'block watch', miller: 'grain man', minstrel: 'lounge singer', monk: 'chapel keeper', pacified_flagellant: 'quiet penitent',
    melee_nomad: 'dune rider', ranged_nomad: 'dune shooter', oathtaker: 'oath keeper', orc_slayer: 'machine breaker', pimp: 'strip hustler',
    retired_soldier: 'old guard', sellsword: 'gun for hire', servant: 'house help', shepherd: 'goat herder', squire: 'gun bearer',
    swordmaster: 'blade master', vagabond: 'drifter' };
  /* A TWO-HANDER WEARS ITS OWN NAME (RUN TWO [a two-hander wears its own name], rule 194, Paolo 10/25: 'I can't make a spear shield
     wall anymore... I tried to put the spear in the shield and it kept saying this shield was like both hands'). MEASURED (the
     coordinator): nobody made the shield two-handed; the NAME did it. Every spear row was a 'rebar spear', and the class holds the
     two-handed Warfork and Spetum, so a 'solid rebar spear' was either a one-hander or a two-hander; nine classes mixed hands under
     one word. Battle Brothers names a two-hander for what it is (Two-Handed Hammer, Two-Handed Mace, Warfork) and its tooltip says
     Two-Handed before you equip it. NOW, in a class that holds both, a two-handed row is a 'two-hand' one (draft:true, WORDS may
     better it), and its quality word ranks it among its own kind, so no name is ever shared across hands; a class that is all one
     kind (the rifle, the shotgun, the bow, the pole hook) keeps its word. One place: the shop, the crew screen, the loot and the
     hall all name a weapon here. */
  var MIXED = null;
  function mixedClasses() {
    if (MIXED) return MIXED; var seen = {}; MIXED = {};
    ((D.weapons && D.weapons.rows) || []).forEach(function (r) { var c = r['class']; seen[c] = seen[c] || {}; seen[c][handsOfRow(r)] = 1; });
    Object.keys(seen).forEach(function (c) { if (seen[c][1] && seen[c][2]) MIXED[c] = true; });
    return MIXED;
  }
  function classWord(cls, hands) { return (hands === 2 && mixedClasses()[cls] ? 'two-hand ' : '') + (CLASSNAME[cls] || cls); }
  /* the shop's full name: the quality word by the row's rank by value among the rows of its class that take the same hands */
  function weaponName(r) {
    var h = handsOfRow(r), same = ((D.weapons && D.weapons.rows) || []).filter(function (x) { return x['class'] === r['class'] && handsOfRow(x) === h; }).sort(function (a, b) { return a.value - b.value; });
    var q = same.indexOf(r) / Math.max(1, same.length - 1);
    return (q < .34 ? 'beat-up' : q < .67 ? 'solid' : 'good') + ' ' + classWord(r['class'], h);
  }
  function bgName(id, fallback) { return BG_NAME[id] || String(fallback || id || '').replace(/\s*\(((1|2)\s*hand|ranged)\)/i, '').replace(/_/g, ' '); }
  function seed(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(s) { var x = s >>> 0 || 1; return function () { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return ((x >>> 0) % 100000) / 100000; }; }
  function priceOf(v) { return Math.max(1, Math.round((v || 0) / 10)); }

  function load(base, opts) {
    base = base || '../records/target/bb/';
    function j(u) { return fetch(u).then(function (r) { return r.json(); }); }
    /* opts.people === false: a screen that draws every person as a 3D model (the settlement, rule 121(e)) never asks for the old
       flat sheets' index; a look is then known by its own name (lookFor) */
    return Promise.all([j(base + 'ours.json'), j(base + 'backgrounds.json'), j(base + 'armor.json'), j(base + 'weapons.json'),
      opts && opts.people === false ? Promise.resolve(null) : j('fight_people/fight_people.json').catch(function () { return null; }),
      j(base + 'rules.json'), j(base + 'perk_translation.json'),
      j(base + 'perks.json').catch(function () { return null; }), j(base + 'armour_names.json').catch(function () { return null; }),   /* __THE_SHOP_SAYS_WHAT_IT_DOES__ */
      j(base + 'recruit_ceiling.json').catch(function () { return null; })])   /* __THE_BEST_RECRUIT_AT_THE_TOP__ */
      .then(function (a) { D.ours = a[0]; D.backgrounds = a[1]; D.armor = a[2]; D.weapons = a[3]; D.people = a[4];
        D.xp = a[5].experience; D.perkRows = a[6].rows; D.rules = a[5]; D.perks = a[7]; D.names = a[8]; D.ceiling = a[9]; return D; });
  }
  function bgRow(id) { var rs = (D.backgrounds && D.backgrounds.rows) || []; for (var i = 0; i < rs.length; i++) if (rs[i].id === id) return rs[i]; return null; }
  function armourName(kind, dur) {
    if (kind === 'head') return dur < 40 ? 'a rag hood' : dur < 100 ? 'a hard hat' : dur < 180 ? 'a riot helmet' : 'a full riot helm';
    if (kind === 'shields') return dur < 40 ? 'a car door' : 'a riot shield';
    return dur < 40 ? 'a work jacket' : dur < 100 ? 'a padded vest' : dur < 180 ? 'a plate carrier' : 'full riot armour';
  }
  /* __THE_SHOP_SAYS_WHAT_IT_DOES__ (RUN TWO, rule 202(d)): every shield, armour and helmet row its own name
     (records/target/bb/armour_names.json, draft:true), the object it is drawn as still in it; the bucket when the file is not read */
  function ownName(kind, row) {
    var k = kind === 'shield' ? 'shields' : kind, N = D.names && D.names[k];
    return (N && row && N[row.id]) || armourName(k, row ? row.durability : 0);
  }
  /* an item the bag, the shops and the roster all speak: {id, kind, name, was, price, nums} */
  function itemOf(kind, id) {
    if (!id) return null;
    if (kind === 'weapon') {
      var rows = (D.weapons && D.weapons.rows) || [], r = null;
      for (var i = 0; i < rows.length; i++) if (rows[i].id === id) r = rows[i];
      if (!r) return null;
      var c = classWord(r['class'], handsOfRow(r));   /* __A_TWO_HANDER_WEARS_ITS_OWN_NAME__ */
      return { id: r.id, kind: 'weapon', cls: r['class'], name: c, was: r.name, price: priceOf(r.value), hands: handsOfRow(r),
        nums: 'dmg ' + r.damage_min + '-' + r.damage_max + (r.range_max ? '  reach ' + r.range_max : '') };
    }
    var list = kind === 'head' ? D.armor.head : kind === 'shield' ? D.armor.shields : D.armor.body, a = null;
    for (var k = 0; k < list.length; k++) if (list[k].id === id) a = list[k];
    if (!a) return null;
    return { id: a.id, kind: kind, name: ownName(kind, a), was: a.name, price: priceOf(a.value),
      nums: 'holds ' + a.durability + (a.fatigue != null ? '  weight ' + Math.abs(a.fatigue) : '') };
  }
  /* a man from a crew entry: stats rolled in his background's wiki range, stars on up to three */
  /* ONE MAN, ONE LOOK (RUN TWO [eyes: one man, one look], 10/19, rule 120(d); EYES measured 10 of 11 crew men wearing
     another man's face: this file walked fight_people.json's cast order, the fight walks ours.json people_looks.crew, and
     the two orders differ). A man keeps the look he came with (a saved company, the hall's man); else man i wears the
     fight's own list at i, the same list the fight reads, so the crew screen, the scavenge sheet, the hall and the fight
     dress him alike. The company carries the look (company() below) so a death or a new order never moves him. */
  /* YOUR MAIN GUY (RUN THREE [make your main guy], rule 263(b)): the man he made in the barber's chair before the game began,
     written once (localStorage bohemia.main.v1, engine/bohemia_main_man.js); with none, the origin's own ('you', his crew name) */
  function mainMan() { try { var m = JSON.parse(root.localStorage.getItem('bohemia.main.v1') || 'null'); return m && m.look ? m : null; } catch (e) { return null; } }
  function lookFor(def, i) {
    if (def.main) { var mm = mainMan(); return (mm && mm.look) || 'you'; }
    /* a rolled person is known too (THE FACE IS HIS OWN FACE, RUN TWO 10/24: your eleven and every hire are the valley's rolled
       people, person_<gang>_<n>, whose body and face are their own renders, not a sheet in fight_people) */
    var known = function (l) { return !!(l && (!D.people || D.people.looks[l] || /^person_[a-z]+_\d+$/.test(l))); };
    if (known(def.look)) return def.look;
    var pl = D.ours && D.ours.people_looks, crew = ((pl && (pl.value || pl).crew) || []).filter(function (l) { return l !== 'you'; });
    var fight = ((pl && (pl.value || pl).crew) || [])[i];
    if (known(fight) && fight !== 'you') return fight;
    if (crew.length) return crew[(i - 1 + crew.length * 8) % crew.length];   /* past the list: its own men again, never YOU's body */
    var looks = D.people ? Object.keys(D.people.looks).filter(function (l) { return /^cast_/.test(l); }) : [];
    return looks.length ? looks[i % looks.length] : 'you';
  }
  /* __NO_MAN_WEARS_A_WOMANS_NAME__ (RUN TWO [eyes: the Block Watch's names], rule 203: 'never a man's sprite with a woman's name';
     EYES 10/26: the Block Watch's twelve are men's bodies and four wore women's names, TINA, MARISOL, LUPE and NENA, the armourer's
     card said 'ON MARISOL, it suits him best'). The crew list's names (ours.json crew) stay as written; a man whose body is a man's
     (every body on the master rig until CHARACTER builds a woman's, sex 'f') is called by a man's name of the same sound
     (draft:true, WORDS may better them), and keeps the old one as 'was' so a save made before still finds his climb */
  var MEN_FOR = { TINA: 'TITO', MARISOL: 'MARCOS', LUPE: 'LALO', NENA: 'NENO' };
  function bodyIsAMans(look) { var M = root.BOHEMIA_PEOPLE_MIX; if (!M || !M.people || !look) return true; for (var i = 0; i < M.people.length; i++) if (M.people[i].look === look) return M.people[i].sex !== 'f'; return true; }
  function nameFor(name, look) { if (!name) return name; var m = String(name).match(/^(.*?)( II)?$/), base = m[1]; return MEN_FOR[base] && bodyIsAMans(look) ? MEN_FOR[base] + (m[2] || '') : name; }
  function manOf(def, i) {
    var bg = bgRow(def.background) || { id: def.background, name: def.background, stats: D.backgrounds.base_stats.stats, daily_wage: 10 };
    var R = rng(seed((def.name || 'man') + ':' + i)), st = {}, stars = {};
    STATS.forEach(function (k) { var rg = (bg.stats && bg.stats[k]) || [0, 0]; st[k] = Math.round(rg[0] + R() * (rg[1] - rg[0])); });
    /* EXACTLY THREE TALENTS, Battle Brothers' own (TUNING 10/25 [level-up numbers], rule 184(b): 'manOf still gives the founding
       crew one to three starred stats, uniform; Battle Brothers gives exactly three, as your hall already does'): three of the
       eight at rules.json talent_star_odds, 60/30/10 */
    var O = (D.xp && D.xp.talent_star_odds && D.xp.talent_star_odds.value) || { '1': .6, '2': .3, '3': .1 }, pool = STATS.slice(), n = 3;
    for (var s = 0; s < n; s++) { var k2 = pool.splice(Math.floor(R() * pool.length), 1)[0]; var q = R(); stars[k2] = q < O['1'] ? 1 : q < O['1'] + O['2'] ? 2 : 3; }
    var rowsW = D.ours.weapon_rows && D.ours.weapon_rows.value || {};
    var jobs = def.jobs || [], main = null, off = null;
    jobs.forEach(function (jb) { var it = itemOf(jb === 'car_door' ? 'shield' : 'weapon', rowsW[jb]); if (!it) return; if (it.kind === 'shield') off = it; else if (!main) main = it; });
    /* RUN TWO rule 202(d): the door he starts with wears its row's own name (the shop's, the stash's), never the bucket word */
    if (main && off && twoHanded(main)) off = null;   /* TWO HANDS: a long gun leaves no hand for the door */
    var look = lookFor(def, i), mm = def.main ? mainMan() : null, nm = mm && mm.name ? String(mm.name) : nameFor(def.name, look);
    return { id: 'm' + i, idx: i, name: nm, was: nm !== def.name ? def.name : undefined, main: !!def.main, background: bg.name || bg.id, bgId: bg.id,
      level: 1, xp: 0, points: 0, stats: st, stars: stars, perks: [], wage: Math.max(1, Math.round((bg.daily_wage || 10) / 10)),
      gear: { main: main, off: off, body: itemOf('body', def.body), head: itemOf('head', def.head) },
      look: look,
      pain: def.main ? PAIN_YOU : PAIN[bg.id] || PAIN_POOL[seed(String(def.name || i)) % PAIN_POOL.length], draft: true };
  }
  function startingCrew() { return ((D.ours && D.ours.crew && D.ours.crew.value) || []).map(manOf); }
  /* TWO HANDS (RUN TWO [two hands], rule 149, Paolo 10/24: 'if I have a rifle in my hand it should take up both the main hand
     and the off hand slot... a pistol in one hand and a car door as a shield in the other'). Battle Brothers' own column: the
     wiki's hands (1 or 2) per weapon row; a bow, a crossbow (our rifle) and a firearm (our shotgun) carry none on the wiki and
     are two-handed in the game, so they are 2. An item kept before this knew its hands is read off its row by id. */
  function handsOfRow(r) { if (!r) return 1; if (r.hands) return r.hands | 0; return /^(bow|crossbow|firearm)$/.test(r['class']) ? 2 : 1; }
  function handsOf(it) {
    if (!it || it.kind !== 'weapon') return 0;
    var rows = (D.weapons && D.weapons.rows) || [];
    for (var i = 0; i < rows.length; i++) if (rows[i].id === it.id) return handsOfRow(rows[i]);
    return it.hands ? it.hands | 0 : 1;
  }
  function twoHanded(it) { return handsOf(it) === 2; }
  /* which slot an item goes in */
  function slotFor(it) { return !it ? null : it.kind === 'weapon' ? 'main' : it.kind === 'shield' ? 'off' : it.kind === 'head' ? 'head' : 'body'; }
  /* the look: a crop of the fight's own sheet (14 frames of 112 and the 64 face, rule 69) */
  function sheetSrc(look) { var l = D.people && D.people.looks[look]; return 'fight_people/' + (l ? l.file : 'you.webp'); }
  /* ---------------- CLIMBING (RUN TWO [climbing], 10/10) ----------------
     Every number is Battle Brothers' own, from rules.json's experience block (the wiki's Level and
     Experience page and its Talents page): the level table, a perk point a level to 11 and none after,
     three stats raised a level by the star column, veterans +1 on three. The fight counts the XP
     (killer 20, party 80, less 15); this file takes what the fight hands and levels the man. */
  var STAT_KEY = { hp: 'HP', fatigue: 'Fatigue', resolve: 'Resolve', initiative: 'Initiative', melee_skill: 'Melee Skill',
    ranged_skill: 'Ranged Skill', melee_defense: 'Melee Defense', ranged_defense: 'Ranged Defense' };
  function xpFor(level) {
    if (level <= 1) return 0;
    var tb = D.xp.level_table_total_xp.value, top = 11;
    if (level <= top) return tb[String(level)];
    var t = tb[String(top)];
    for (var l = top; l < level; l++) t += 4000 + 1000 * (l - top);   /* veteran_level_xp, the wiki's formula */
    return t;
  }
  function levelOf(xp) { var max = D.xp.veteran_level_rules.value.max_level, l = 1; while (l < max && xp >= xpFor(l + 1)) l++; return l; }
  function range(txt, R) { var m = String(txt).split('-').map(Number); var a = m[0], b = m.length > 1 ? m[1] : m[0]; return a + Math.floor(R() * (b - a + 1)); }
  /* one level up, BATTLE BROTHERS' WAY, HIS CHOICE (VAMILY rule 162(a), Paolo 10/24: 'in Battle Brothers you had to really
     prioritise when you levelled, min-max a killer group'; RUN TWO [the end of the fight, the loot, the stash] round 2): every
     one of the eight stats is ROLLED on his star column (the Talents page: more stars, a wider and higher roll), he sees all
     eight and CHOOSES which per_level.attributes_raised of them to take (raise() below); past 11 each roll is the veteran +1
     and no perk point (veteran_level_rules). The rolls wait on him (m.rolls, oldest first) and nothing rises until he picks. */
  function levelUp(m, R) {
    var nxt = m.level + 1, vet = nxt > 11, rolls = {};
    STATS.forEach(function (k) { rolls[k] = vet ? D.xp.veteran_level_rules.value.max_per_stat : range(D.xp.stat_gains_by_stars.value[STAT_KEY[k]][m.stars[k] || 0], R); });
    m.level = nxt; if (!vet) m.points = (m.points || 0) + D.xp.per_level.value.perk_points;
    m.rolls = (m.rolls || []).concat([{ level: nxt, gains: rolls, pick: D.xp.per_level.value.attributes_raised }]);
    return {};
  }
  /* raise(man, [stat keys]): he takes the oldest waiting level's rolls on exactly the stats he chose; returns what rose */
  function raise(m, keys) {
    var r = (m.rolls || [])[0]; if (!r) return null;
    var ks = (keys || []).filter(function (k, i, a) { return STATS.indexOf(k) >= 0 && a.indexOf(k) === i; });
    if (ks.length !== r.pick) return null;
    var got = {}; ks.forEach(function (k) { m.stats[k] += r.gains[k]; got[k] = r.gains[k]; });
    m.rolls.shift(); return got;
  }
  /* grant(man, xp): the fight's XP lands, he climbs as many levels as it buys; returns what moved */
  function grant(m, xp, seedText) {
    var R = rng(seed((seedText || m.name) + ':' + m.xp + ':' + xp)), before = m.level, ups = [];
    m.xp = (m.xp || 0) + Math.max(0, Math.round(xp || 0));
    var to = levelOf(m.xp);
    while (m.level < to) ups.push(levelUp(m, R));
    return { from: before, to: m.level, gains: ups };
  }
  /* ==== __THE_BEST_RECRUIT_AT_THE_TOP__ (RUN THREE [the best recruit at the top], rule 216, Paolo 10/26: 'just put the best at the
     absolute top... when we level them up as much as we can, their stars and default good stats lead the way... you might have to
     make a calculator'). THE CEILING: what a man is expected to be at level 11 through THIS file's level-up, never a second rule:
     levelUp rolls every stat on his star column (range() over stat_gains_by_stars) and raise() takes per_level.attributes_raised
     of them; the calculator takes the first that many off his kind's plan, each at its column's mean (an 'a-b' roll is (a+b)/2).
     ONE NUMBER A KIND: the plan's raised stats at the top, each weighed by what a point of it saves in the live fight, over the sum
     of the weights (TUNING's measured weights, records/BOHEMIA_TUNING_THE_RECRUITS_CEILING_10_26_26.md); his kind is the better.
     With the posts' own roll handed in (ref, sorted), his rank among them (the share he beats), which is what the card shows.
     Inputs: records/target/bb/recruit_ceiling.json (TUNING's section O, a modder's); the same numbers built in below. ==== */
  var CEIL_DEF = { level: 11,
    plans: { melee: ['melee_skill', 'melee_defense', 'ranged_defense', 'hp', 'fatigue'], gun: ['ranged_skill', 'melee_defense', 'hp', 'fatigue', 'ranged_defense'] },
    weights: { melee: { melee_skill: 1, melee_defense: 0.41, ranged_defense: 0.38, hp: 0.35, fatigue: 0.32 },
               gun: { ranged_skill: 1, melee_defense: 0.76, hp: 0.24, fatigue: 0.24, ranged_defense: 0.12 } } };
  function ceilDef(k) { var c = D.ceiling && D.ceiling[k]; return c && c.value != null && typeof c.value === typeof CEIL_DEF[k] ? c.value : CEIL_DEF[k]; }
  function rollMean(txt) { var m = String(txt).split('-').map(Number); return (m[0] + (m.length > 1 ? m[1] : m[0])) / 2; }
  function gainMean(k, stars) { return rollMean(D.xp.stat_gains_by_stars.value[STAT_KEY[k]][stars || 0]); }
  function planFor(kind) { return ((ceilDef('plans') || {})[kind] || []).slice(0, D.xp.per_level.value.attributes_raised); }
  function ceilWeight(k, kind) { var w = (ceilDef('weights') || {})[kind] || {}; return planFor(kind).indexOf(k) >= 0 && w[k] > 0 ? +w[k] : 0; }
  /* the one number for stats as they stand, for a kind (the gate scores a man levelled by grant() and raise() with it) */
  function worthOf(stats, kind) {
    var v = 0, sw = 0; planFor(kind).forEach(function (k) { var w = ceilWeight(k, kind); v += w * (stats[k] || 0); sw += w; });
    return sw > 0 ? Math.round(v / sw * 1e6) / 1e6 : 0;   /* six places: two men with the same numbers tie exactly */
  }
  function ceilingOf(man, kind) {
    var top = ceilDef('level'), plan = planFor(kind), n = Math.max(0, top - Math.max(1, man.level || 1)), at = {}, stars = man.stars || {};
    STATS.forEach(function (k) { at[k] = (man.stats[k] || 0) + (plan.indexOf(k) >= 0 ? n * gainMean(k, stars[k]) : 0); });
    return { kind: kind, value: worthOf(at, kind), at: at, plan: plan, level: top, levels: n };
  }
  /* the share of the sorted roll strictly under v (0 to 1) */
  function rankIn(v, sorted) { var lo = 0, hi = sorted ? sorted.length : 0; while (lo < hi) { var m = (lo + hi) >> 1; if (sorted[m] < v) lo = m + 1; else hi = m; } return sorted && sorted.length ? lo / sorted.length : null; }
  /* ceiling({stats, stars, level}[, kind][, ref]): his kind's ceiling (the better of the two when no kind is asked), {value, kind,
     at, plan, melee, gun, rank}; rank his share of ref (the posts' roll, sorted) when it is handed in */
  function ceiling(man, kind, ref) {
    if (kind) return ceilingOf(man, kind);
    var a = ceilingOf(man, 'melee'), b = ceilingOf(man, 'gun'), best = b.value > a.value ? b : a;
    best.melee = a.value; best.gun = b.value; best.rank = ref ? rankIn(best.value, ref) : null; return best;
  }
  /* ==== end __THE_BEST_RECRUIT_AT_THE_TOP__ ==== */
  /* the perks he may take now: Battle Brothers' tiers, tier n opens after n-1 points are spent */
  function perkChoices(m) {
    var spent = (m.perks || []).length;
    return (D.perkRows || []).filter(function (r) { return r.tier <= spent + 1 && (m.perks || []).indexOf(r.id) < 0; });
  }
  function takePerk(m, id) {
    if (!(m.points > 0)) return false;
    var ok = perkChoices(m).some(function (r) { return r.id === id; }); if (!ok) return false;
    m.perks.push(id); m.points--; return true;
  }
  function perkName(id) { var r = (D.perkRows || []).filter(function (x) { return x.id === id; })[0]; return r ? r.name : id; }
  /* what the fight reads: opts.company = [{background, level, perks, marks}] in crew order (marks: the permanent injuries he carries; each adds to his death roll) */
  function company(crew) { return crew.map(function (m) { var g = m.gear || {}, id = function (it) { return it ? it.id : null; };
    return { name: m.name, background: m.bgId, level: m.level, look: m.look, perks: (m.perks || []).slice(), marks: m.marks || (m.mark ? [m.mark] : []),
             stats: m.stats ? Object.assign({}, m.stats) : undefined, traits: Array.isArray(m.traits) ? m.traits.slice() : undefined,   /* every man fights as his card says: the stats he chose at each level go to the fight (rule 162(e)); a hire his card's and his trait (RUN TWO 10/24) */
             gear: { main: id(g.main), off: id(g.off), body: id(g.body), head: id(g.head),
                     bag: [id(g.bag1), id(g.bag2)] } }; }); }   /* __TWO_BAG_SLOTS__ (RUN TWO 10/25, rule 164 item 15): what he carries in his two bag slots, for COMBAT's switch */
  /* WHAT HIS ARM DOES IN A FIGHT (RUN TWO [the guns on the crew screen], 10/22; rule 120(a): the company starts with guns; rule
     83: 'melee weapons work on one tile away, all guns 2+ minimum... the pistol is a two-tile gun, or a club at one'): read the
     way the fight reads a weapon (slices/BOHEMIA_FIGHT.html pistolShot, rangeMin, rounds; ours.gun_classes, ours.pistol_shot,
     ours.gun_min_range), never a second table. {lo, hi} in tiles, club: always false (rule 195: no gun is a club),
     rounds: what the gun holds going in (the fight loads every gun full; a one-shot gun's one), null for an arm with none */
  function armOf(it) {
    if (!it || it.kind !== 'weapon' || !D.weapons || !D.ours) return null;
    var rows = D.weapons.rows || [], row = function (id) { for (var i = 0; i < rows.length; i++) if (rows[i].id === id) return rows[i]; return null; };
    var w = row(it.id); if (!w) return null;
    var O = function (k) { return D.ours[k] && D.ours[k].value; };
    var num = function (v) { var m = String(v == null ? '' : v).match(/\d+/g); return m ? Math.max.apply(null, m.map(Number)) : 1; };
    var lowOf = function (r) { return r.range_min != null && r.range_max != null && num(r.range_min) < num(r.range_max) ? num(r.range_min) : 1; };
    var P = O('pistol_shot'), shot = P && w['class'] === P['class'] && P.by_row[w.id] ? row(P.by_row[w.id]) : null;
    var ranged = ['bow', 'crossbow', 'firearm', 'throwing'];
    var r = shot || w, isRanged = ranged.indexOf(r['class']) >= 0, gun = !!shot || (O('gun_classes') || []).indexOf(w['class']) >= 0;
    if (!isRanged) return { lo: 1, hi: num(w.range_max || 1), club: false, rounds: null, gun: false };
    /* THE PISTOL IS NEVER A CLUB (RUN TWO [the pistol is never a club, the words], rule 195, Paolo 10/25: 'the game still says the
       pistol is a club at one tile I never asked for that shit'): the reach is the fight's own rangeLo (a gun from ours.gun_min_range,
       1 since rule 185: its shot's javelin row starts at 2 and a gun no longer takes that floor), and no gun is ever called a club */
    var gmin = O('gun_min_range'), lo = gun ? (gmin != null ? gmin : 1) : Math.max(lowOf(r), 1), hi = num(r.range_max);
    var mag = r.ammo ? num(r.ammo) : null, reload = (r.skills || []).some(function (k) { return /^Reload/.test(k.name); });
    return { lo: lo, hi: Math.max(lo, hi), club: false, rounds: shot ? mag : reload ? 1 : mag, gun: gun };
  }
  /* the words for it, one place for every screen (the crew screen's row and card, the hall's man: RUN TWO [the hire shows the
     whole man], 10/24): short '1-4 TILES' over '5 RDS'; long 'REACH 1 TO 4 TILES' and '5 ROUNDS, THEN RELOAD' (rule 195) */
  function armLine(it, long) {
    var a = armOf(it); if (!a) return null;
    var reach = a.lo === a.hi ? a.hi + (a.hi === 1 ? ' TILE' : ' TILES') : a.lo + (long ? ' TO ' : '-') + a.hi + ' TILES';
    var shots = a.rounds ? a.rounds + (a.gun ? (a.rounds === 1 ? (long ? ' ROUND' : ' RD') : (long ? ' ROUNDS' : ' RDS')) : (long ? ' THROWS' : ' LEFT')) : null;   /* a bundle of bottles is thrown, not loaded */
    if (!long) return { reach: reach, rounds: shots };
    return { reach: 'REACH ' + reach, rounds: shots ? shots + (a.gun ? ', THEN RELOAD' : '') : null };
  }
  /* ==== __THE_SHOP_SAYS_WHAT_IT_DOES__ (RUN TWO [the shop says what it does to your man], rule 202, Paolo 10/25: 'in the shop you
     cannot just say how many batteries it costs without saying the stat it does... when you wear the shield it reflects in your
     stats'). ONE SOURCE for the shop's card, the crew screen and the fight: what a man's numbers are with what he wears, read the
     way the fight reads them (slices/BOHEMIA_FIGHT.html makeUnit, shieldDef, gearFat, bagFat, fatMax, curIni at rest), from the
     same rows (armor.json, weapons.json, a pistol's shot from ours.pistol_shot, perks.json's numbers, rules.json's bag half).
     A shield on a man whose weapon takes both hands is carried on his back, so it adds nothing (the fight's own rule). ==== */
  function rowOf(kind, id) {
    if (!id) return null; id = id.id || id;
    var list = kind === 'weapon' ? ((D.weapons && D.weapons.rows) || []) : kind === 'shield' ? ((D.armor && D.armor.shields) || []) : ((D.armor && D.armor[kind]) || []);
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }
  /* the weapon the fight swings or shoots: a pistol fires the row ours.pistol_shot rides (its damage), with its own weight */
  function fightWeapon(id) {
    var w = rowOf('weapon', id); if (!w) return null;
    var P = D.ours && D.ours.pistol_shot && (D.ours.pistol_shot.value || D.ours.pistol_shot);
    var r = P && w['class'] === P['class'] && P.by_row && P.by_row[w.id] ? rowOf('weapon', P.by_row[w.id]) : null;
    return r ? Object.assign({}, r, { id: w.id, name: w.name, value: w.value, fatigue: w.fatigue, durability: w.durability, of: w, rides: r.id }) : w;
  }
  function perkNums(perks, id) {
    if (!perks || perks.indexOf(id) < 0) return null;
    var rows = (D.perks && D.perks.rows) || [];
    for (var i = 0; i < rows.length; i++) if (rows[i].id === id) return rows[i].numbers || {};
    return null;
  }
  function gearIds(g) {
    g = g || {}; var id = function (x) { return x ? (x.id || x) : null; };
    var bag = Array.isArray(g.bag) ? g.bag.map(id) : [id(g.bag1), id(g.bag2)];
    return { main: id(g.main), off: id(g.off), body: id(g.body), head: id(g.head), bag: bag };
  }
  /* his numbers with what he wears: {melee_defense, ranged_defense, fatigue, initiative, armour_body, armour_head, from:{...}} */
  function worn(man) {
    var st = (man && man.stats) || {}, perks = (man && man.perks) || [], g = gearIds(man && man.gear);
    var w = fightWeapon(g.main), sh = rowOf('shield', g.off), body = rowOf('body', g.body), head = rowOf('head', g.head);
    if (sh && w && handsOfRow(w.of || w) === 2) sh = null;   /* the fight: a two-hander puts the shield on his back */
    var se = perkNums(perks, 'shield_expert'), sx = se ? 1 + se.shield_defense_bonus_increase_pct / 100 : 1;
    var f = 0, worn0 = 0;
    [w, sh].forEach(function (x) { if (x && typeof x.fatigue === 'number') f += x.fatigue; });
    [body, head].forEach(function (x) { if (x && typeof x.fatigue === 'number') worn0 += x.fatigue; });
    var br = perkNums(perks, 'brawny'), gearFat = f + (br ? worn0 * (1 - br.armor_fatigue_initiative_penalty_reduction_pct / 100) : worn0);
    var half = D.rules && D.rules.fatigue && D.rules.fatigue.bag_items_penalty_multiplier, hv = half && half.value != null ? half.value : 0.5;
    var bb = perkNums(perks, 'bags_and_belts'), bagFat = 0;
    g.bag.forEach(function (id) { var x = fightWeapon(id) || rowOf('shield', id); if (!x || typeof x.fatigue !== 'number') return;
      bagFat += x.fatigue * (bb && handsOfRow(x.of || x) !== 2 ? 0 : hv); });   /* half its weight; Bags and Belts: only a two-hander weighs */
    var md = (st.melee_defense || 0) + (sh ? sh.melee_defense * sx : 0), rd = (st.ranged_defense || 0) + (sh ? sh.ranged_defense * sx : 0);
    return { melee_defense: Math.round(md), ranged_defense: Math.round(rd), fatigue: Math.max(0, Math.round((st.fatigue || 0) + gearFat + bagFat)),
      initiative: Math.round((st.initiative || 0) + gearFat), armour_body: body ? body.durability : 0, armour_head: head ? head.durability : 0,
      from: { shield: sh ? { melee_defense: Math.round(sh.melee_defense * sx), ranged_defense: Math.round(sh.ranged_defense * sx) } : null, gearFat: Math.round(gearFat), bagFat: Math.round(bagFat) } };
  }
  /* the item in its slot on him: what his numbers become, and the one thing that stops it (a two-hander and a shield) */
  function wearing(man, it) {
    var g = gearIds(man && man.gear), slot = slotFor(it), out = { slot: slot, was: g[slot] || null, before: worn(man), stops: null };
    var g2 = Object.assign({}, g, { bag: g.bag.slice() }); g2[slot] = it.id;
    var mw = rowOf('weapon', g.main);
    if (slot === 'off' && mw && handsOfRow(mw) === 2) out.stops = { why: 'both', weapon: itemOf('weapon', mw.id) };
    if (slot === 'main' && handsOfRow(rowOf('weapon', it.id) || {}) === 2 && g.off) { g2.off = null; out.drops = itemOf('shield', g.off); }   /* the shield goes to the stash */
    out.after = out.stops ? out.before : worn(Object.assign({}, man, { gear: g2 }));
    return out;
  }
  /* ==== end __THE_SHOP_SAYS_WHAT_IT_DOES__ ==== */
  var API = { load: load, ceiling: ceiling, worthOf: worthOf, planFor: planFor, ceilWeight: ceilWeight, rankIn: rankIn, levelUp: levelUp, armOf: armOf, nameFor: nameFor, MEN_FOR: MEN_FOR, worn: worn, wearing: wearing, fightWeapon: fightWeapon, rowOf: rowOf, ownName: ownName, armLine: armLine, xpFor: xpFor, levelOf: levelOf, grant: grant, raise: raise, STAT_KEY: STAT_KEY, perkChoices: perkChoices, takePerk: takePerk, perkName: perkName, company: company, data: D, STATS: STATS, STAT_NAME: STAT_NAME, manOf: manOf, startingCrew: startingCrew, itemOf: itemOf,
    PAIN_POOL: PAIN_POOL, bgName: bgName, classWord: classWord, weaponName: weaponName, slotFor: slotFor, sheetSrc: sheetSrc, handsOf: handsOf, twoHanded: twoHanded, FRAME: 112, FACE: { x: 1568, y: 0, s: 64 }, SLOTS_PER_ROW: 9 };
  root.BohemiaRoster = API;
})(typeof window !== 'undefined' ? window : this);
