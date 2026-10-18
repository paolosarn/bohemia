#!/usr/bin/env node
// TUNING [the whole grid] 10/18 -- RESEARCH INSTRUMENT, NOT A GATE (rule 38g; rule 117(e)).
// Paolo 10/18: 'how are you even testing these fights... against animals, against different group sizes, one person, three,
// six, up to 14... a 12 man Lone wolf squad, you can go up to 36 or 40 Enemies... we don't even have all the equipment in the
// game... what are you even testing?' Rule 117(e): A TUNING NUMBER IS A GRID, NEVER ONE AVERAGE.
//
// This plays the LIVE fight (slices/BOHEMIA_FIGHT.html's fight-data and fight-rules scripts, and EXACTLY the data files its
// own loadAll() fetches, read off its DATA_FILES list so the bench cannot drift from the fight again) headless in node, both
// sides on the fight's own brain (AUTO), over a grid:
//   the company   1 (the Lone Wolf's hedge knight), 3 (A New Crew), 6, 12 (the twelve), 14 (the twelve and two more)
//   the enemy     3, 6, 12, 20, 38, and THE MAP'S PICK (party_math's job count for that company at that stage)
//   who           human bands (brigands, dressed by the fight's own tiers) and every beast in enemies.json whose fight is a
//                 body and one strike (see BEASTS: the bite is read off its wiki skill page; the fight has no beast path today)
//   the gear      EARLY (each man's kit, day 1, his origin's level), MIDDLE (the town shelf, day 30, level 5),
//                 LATE (the city shelf, day 80, level 9): the rows are named below with why
//   the setting   TODAY (the game as it plays), BB (Battle Brothers' Veteran, the hard end), START (rule 117's levers)
// Every number it prints is DRAFT: THE GEAR IS NOT IN (rule 117(e)).
//
// Hooks: the same three as tools/bohemia_tuning_easier_measured.js (the hit number, the breath back a turn, the moment a
// swing lands), spliced into an in-memory copy of the rules text, each anchor matched exactly once or it stops.
//
//   node tools/bohemia_tuning_the_whole_grid.js                    the humans grid and the dire wolves grid, all three settings
//   node tools/bohemia_tuning_the_whole_grid.js --write            also writes banks/BOHEMIA_TUNING_THE_WHOLE_GRID_10_18_26.json
//   --n 100 fights per cell; --jobs 4 worker processes; --only humans|beasts|roster
//   --cell '<cell json>' <n>   one cell (used by the workers and by tools/bohemia_tuning_slightly_harder.js)
//   --control                  the hooks at neutral against the unhooked rules, six seeded fights: event for event
// Seeded: fight k of a cell plays seed 7000 + k, so every setting meets the SAME fights.
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'banks/BOHEMIA_TUNING_THE_WHOLE_GRID_10_18_26.json');
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const PM = J('records/target/bb/party_math.json');
const WIKI = 'reference/library/grok/wiki/PAGES_ALL.tar.gz';

/* ---------- the settings, read from the measured bank so the levers are the ones the 78-in-100 page measured ---------- */
const MEASURED = J('banks/BOHEMIA_TUNING_EASIER_MEASURED_10_18_26.json');
const LEV = id => MEASURED.settings.filter(s => s.id === id)[0].levers;
const SETTINGS = [
  { id: 'today', name: 'TODAY: the game as it plays (the door defaults to Veteran; a level never raises a stat in the fight)', L: LEV('today') },
  { id: 'bb', name: 'BATTLE BROTHERS VETERAN, THE HARD END: today plus a level raising three stats', L: LEV('bb') },
  { id: 'start', name: 'THE START (rule 117): your roll +5 theirs -5, a bad streak ends, their nerve 0.9, your breath 18, later crews, the party at 0.85, xp -0.05', L: LEV('start') }
];

/* ---------- the grid's axes ---------- */
const COMPANIES = [1, 3, 6, 12, 14];
const COUNTS = [3, 6, 12, 20, 38, 'map'];
/* a stage is a point in a campaign: the day the enemy is dressed for, the level your men stand at, the skulls of the job the
   map sizes ('map' column), and the gear rows. Day and level are DRAFT anchors (Battle Brothers' company is level 4 to 6
   around day 30 and 8 to 11 past day 80 on the wiki's experience table; the three days sit inside the fight's own tier
   phases: early from day 1, middle from 20, late from 60, ours.enemy_tiers) */
const STAGES = {
  early: { day: 1, level: null, skulls: 1, why: 'each man\'s kit (his place in the line, ours.crew and ours.weapon_rows), day 1, his origin\'s level' },
  middle: { day: 30, level: 5, skulls: 2, why: 'the town shelf (RUN TWO\'s market sells the 15th to 75th percentile of rows by value): mail, a better weapon of the same kind, day 30, level 5' },
  late: { day: 80, level: 9, skulls: 3, why: 'the city shelf (30th to 100th percentile): 210 body, 210 head (the heaviest a man can carry and still swing: see ENDGAME), the best common weapon of the kind, day 80, level 9' },
  /* a SIDE stage, never in the picture: the city shelf's top, 300 body and 300 head. Measured 10/18: in it a man of ours keeps
     8 to 15 of his breath (fatigue 87 to 102 less 82 of gear) and is spent after one swing, because a level never raises his
     fatigue in the fight (TODAY) and Battle Brothers' late company carries it on its level-ups and Brawny */
  endgame: { day: 80, level: 9, skulls: 3, why: 'the city shelf\'s top: 300 body, 300 head, the late weapons, day 80, level 9 (a side test: the weight)' }
};
/* the gear by job: the same KIND of weapon he holds today (the fight dresses a man by his job), one step and two steps up
   Battle Brothers' own ladder for that kind; every id is a weapons.json / armor.json row the market can put on a shelf */
const GEAR = {
  middle: { pipe: 'morning_star', sledge: 'two_handed_skull_hammer', pistol: 'rondel_dagger', rifle: 'crossbow', shotgun: 'handgonne',
    bottles: 'bundle_of_heavy_javelins', car_door: 'kite_shield', body: 'mail_hauberk', head: 'padded_flat_top_helmet' },
  late: { pipe: 'winged_mace', sledge: 'two_handed_hammer', pistol: 'qatal_dagger', rifle: 'heavy_crossbow', shotgun: 'handgonne',
    bottles: 'bundle_of_heavy_throwing_axes', car_door: 'heater_shield', body: 'reinforced_mail_hauberk', head: 'bascinet_with_mail' },
  endgame: { pipe: 'winged_mace', sledge: 'two_handed_hammer', pistol: 'qatal_dagger', rifle: 'heavy_crossbow', shotgun: 'handgonne',
    bottles: 'bundle_of_heavy_throwing_axes', car_door: 'heater_shield', body: 'coat_of_scales', head: 'full_helm' }
};
/* the companies: who stands in them (the origins the game ships, records/target/bb/origins.json) */
function companyOf(n, stage) {
  const O = J('records/target/bb/ours.json'), crew = O.crew.value, origins = J('records/target/bb/origins.json').origins;
  const st = STAGES[stage];
  let men;
  if (n === 1) men = origins.filter(o => o.id === 'wolf')[0].men.map(m => ({ background: m.background, level: m.level }));
  else if (n === 3) men = origins.filter(o => o.id === 'newcrew')[0].men.map(m => ({ background: m.background, level: m.level }));
  else men = Array.from({ length: n }, (_, i) => ({ background: crew[i % crew.length].background, level: null }));
  return men.map((m, i) => {
    const out = { background: m.background, level: st.level || m.level || undefined };
    if (stage !== 'early') {
      const g = GEAR[stage], jobs = crew[i % crew.length].jobs, main = jobs.filter(j => j !== 'car_door')[0];
      out.gear = { main: g[main], off: jobs.indexOf('car_door') >= 0 ? g.car_door : null, body: g.body, head: g.head };
    }
    return out;
  });
}
function roster(n, level) { return n * (PM.roster_strength.value.per_man + PM.roster_strength.value.per_level * (level - 1)); }
/* the map's pick: party_math's job count, the way tools/bohemia_tuning_easier_measured.js sizes it */
function mapCount(n, level, skulls, pick, mult) {
  const P = PM.job.value, str = roster(Math.min(n, PM.roster_strength.value.strongest_wide), level);
  const c = str / P.strength_per_enemy * P.skull_mult[String(skulls)] * (mult === undefined ? PM.difficulty_count_mult.value[pick] : mult);
  return Math.max(P.min, Math.min(P.max, Math.floor(c + 0.5)));
}

/* ---------- the beasts: every enemies.json row of the beasts and animals factions, sorted three ways ----------
   PLAYED: a body and one strike; the strike's numbers read off its wiki skill page (AP, fatigue, damage, armour damage,
   direct damage) and handed to the beast as an in-memory weapon row, so the fight's own hit, armour and morale rules play it.
   What each one loses is named (a bleed, a web, a knockback, a split). NOT PLAYED: the special IS the fight. */
const BEASTS = {
  direwolf: '0630_Direwolf Bite (6 fatigue).txt', frenzied_direwolf: '0630_Direwolf Bite (6 fatigue).txt',
  hyena: '1055_Hyena Bite (6 fatigue).txt', frenzied_hyena: '1055_Hyena Bite (6 fatigue).txt',
  nachzehrer_small: '1819_Small Ghoul Claws (6 fatigue).txt', nachzehrer_medium: '1254_Medium Ghoul Claws (6 fatigue).txt',
  nachzehrer_large: '1139_Large Ghoul Claws (6 fatigue).txt', webknecht: '2196_Webknecht Bite (10 fatigue).txt',
  unhold: '1906_Sweep (20 fatigue).txt', bog_unhold: '1906_Sweep (20 fatigue).txt', frost_unhold: '1906_Sweep (20 fatigue).txt',
  armored_frost_unhold: '1906_Sweep (20 fatigue).txt', serpent: '1758_Serpent Bite (5 fatigue).txt',
  ifrit_small: '1798_Size 1 Headbutt (15 fatigue).txt', ifrit_medium: '1799_Size 2 Headbutt (15 fatigue).txt',
  ifrit_large: '1801_Size 3 Headbutt (15 fatigue).txt', schrat: '2156_Uproot (25 fatigue).txt', sapling: '2189_Weak Uproot (25 fatigue).txt',
  wolf: '2231_Wolf Bite (10 fatigue).txt'
};
const LOSES = {
  hyena: 'the bleed (5 a turn)', frenzied_hyena: 'the bleed (10 a turn)', nachzehrer_small: 'the feast (heals and grows)',
  nachzehrer_medium: 'the feast (heals and grows)', nachzehrer_large: 'the feast and Swallow Whole', webknecht: 'the web and the poison',
  unhold: 'the knockback, three targets a sweep, Fling Back, the regeneration', bog_unhold: 'the knockback, three targets a sweep, Fling Back, the regeneration',
  frost_unhold: 'the knockback, three targets a sweep, Fling Back', armored_frost_unhold: 'the knockback, three targets a sweep, Fling Back',
  serpent: 'the drag', ifrit_small: 'the merge', ifrit_medium: 'the split into two and the thrown sand', ifrit_large: 'the split into two and the thrown sand',
  schrat: 'the three tiles a swing and the shield it grows', sapling: '', direwolf: '', frenzied_direwolf: '', wolf: ''
};
const NOT_PLAYED = {
  alp: 'puts men to sleep and hurts only the sleeping: the sleep is the fight', hexe: 'charms your men and shares her wounds: the charm is the fight',
  kraken: 'a mouth that eats a man next to it and eight tentacles that drag: two bodies and a pull', kraken_tentacle: 'part of the kraken',
  kraken_tentacle_enraged: 'part of the kraken', lindwurm: 'a head and a tail that act apart, acid blood: two bodies',
  lindwurm_tail: 'part of the lindwurm', the_ijirok: 'a boss: a gore from six tiles, a spirit walk, regeneration',
  rachegeist_ghost: 'no strike on its row', webknecht_eggs: 'eggs: they hatch, they do not fight', geist: 'the scream (resolve checks in three tiles) is the fight',
  lower_goblin_ambusher: 'a goblin filed under beasts in the data (a person with a bow; played with the humans when the goblins come)',
  lower_goblin_skirmisher: 'a goblin filed under beasts in the data', lower_mercenary: 'a man filed under beasts in the data',
  lower_necrosavant: 'a vampire filed under beasts; Darkflight is a jump', lower_orc_warrior: 'an orc filed under beasts in the data',
  lower_orc_young: 'an orc filed under beasts in the data', goblin_wolf: 'a goblin\'s mount (Wolf Bite once a turn, ridden)',
  armored_unhold: 'a barbarian\'s war beast (played as the unhold in its armour when the barbarians come)'
};
function wikiStrikes(ids) {
  const files = Array.from(new Set(ids.map(id => BEASTS[id])));
  const out = {};
  files.forEach(f => {
    const t = cp.execFileSync('tar', ['-xzOf', path.join(ROOT, WIKI), 'bb_all/' + f]).toString();
    const cells = t.split('\n').filter(l => /^\| align="center" \|\d+$/.test(l.trim())).map(l => Number(l.trim().split('|').pop()));
    const m = t.match(/does (\d+)-(\d+) \[\[File:Damage_dealt[^\]]*\]\] with (\d+)% \[\[File:Armor_damage[^\]]*\]\],? (?:and )?(\d+)% \[\[File:Direct_damage/);
    if (!m || cells.length < 2) throw new Error('THE WIKI PAGE DID NOT READ: ' + f);
    const name = (t.match(/style="color:green">([^<]+)</) || [])[1];
    out[f] = { name: name, ap: cells[0], fatigue: cells[1], damage_min: Number(m[1]), damage_max: Number(m[2]), armor_damage_pct: Number(m[3]),
      armor_ignore_pct: Number(m[4]), page: WIKI + ':bb_all/' + f };
  });
  return out;
}

/* ---------- the engine: the live fight's scripts and exactly the files its loadAll() reads ---------- */
async function engine(plain, strikes) {
  const html = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_FIGHT.html'), 'utf8');
  const grab = id => { const m = html.match(new RegExp('<script id="' + id + '">([\\s\\S]*?)<\\/script>')); if (!m) throw new Error('no script ' + id); return m[1]; };
  let rules = grab('fight-rules');
  const splice = (anchor, add, before) => {
    const n = rules.split(anchor).length - 1;
    if (n !== 1) throw new Error('THE FIGHT MOVED: anchor found ' + n + ' times: ' + anchor.slice(0, 60));
    rules = rules.replace(anchor, before ? add + anchor : anchor + add);
  };
  if (!plain) {
    splice("    const cap = R('hit_chance.cap');\n    return { chance: Math.round(Math.max(cap.min, Math.min(cap.max, ch))), parts: parts };", '    ch = HOOK.hit(a, t, ch);\n', true);
    splice('  function apply(a, t, r, opt) {\n    opt = opt || {};', '\n    HOOK.after(a, t, r);', false);
    splice("u.fat = Math.max(0, u.fat - R('fatigue.recovery_per_turn'));", '', false);
    rules = rules.replace("u.fat = Math.max(0, u.fat - R('fatigue.recovery_per_turn'));", "u.fat = Math.max(0, u.fat - HOOK.breath(u, R('fatigue.recovery_per_turn')));");
  }
  const ctx = { console, Math, JSON, Date, Object, Array, String, Number, Error, Promise, HOOK: null,
    localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    fetch: u => Promise.resolve({ json: () => Promise.resolve(JSON.parse(fs.readFileSync(path.join(ROOT, 'slices', u), 'utf8'))) }) };
  vm.createContext(ctx);
  vm.runInContext(grab('fight-data') + ';this.DB=DB;this.loadAll=loadAll;this.setSeed=function(s){SEED=s>>>0;};', ctx);
  await ctx.loadAll();
  /* the beasts' strikes, in this memory copy only: a weapon row named for the skill, the beast's row told to carry it */
  if (strikes) Object.keys(BEASTS).forEach(id => {
    const s = strikes[BEASTS[id]], row = ctx.DB.enemies.rows.filter(r => r.id === id)[0];
    if (!s || !row) return;
    const wname = 'BENCH ' + s.name;
    if (!ctx.DB.weapons.rows.some(r => r.name === wname)) ctx.DB.weapons.rows.push({ id: 'bench_' + s.name.toLowerCase().replace(/\W+/g, '_'), name: wname,
      class: 'beast', hands: 2, damage_min: s.damage_min, damage_max: s.damage_max, armor_damage_pct: s.armor_damage_pct, armor_ignore_pct: s.armor_ignore_pct,
      fatigue: 0, range: 1, range_min: 1, range_max: 1, skills: [{ name: s.name, ap: s.ap, fatigue: s.fatigue, hit_bonus: null, range: null }] });
    row.gear = [wname];
  });
  vm.runInContext(rules + ';this.FIGHT=FIGHT;', ctx);
  return ctx;
}

/* ---------- one cell: N fights ---------- */
async function cell(C, n, strikes) {
  const ctx = await engine(false, strikes), F = ctx.FIGHT, DB = ctx.DB;
  const L = Object.assign({}, MEASURED.settings[0].levers, C.L || SETTINGS.filter(s => s.id === C.setting)[0].L);
  DB.rules.experience.global_modifier.value = L.xp;
  const ph = DB.ours.enemy_tiers.value.phases; ph[1].from_day = L.tiers[0]; ph[2].from_day = L.tiers[1];
  const st = STAGES[C.stage], company = companyOf(C.company, C.stage);
  /* the level the map sizes by: the stage's, or the company's own (an origin's stated level, else its background's middle) */
  const bgs = new Map(DB.backgrounds.rows.map(r => [r.id, r]));
  const lvl = st.level || company.reduce((s, m) => { const sl = bgs.get(m.background).starting_level; return s + (m.level || (sl[0] + sl[sl.length - 1]) / 2); }, 0) / company.length;
  const count = C.enemies === 'map' ? mapCount(C.company, lvl, st.skulls, L.pick, L.countMult) : C.enemies;
  const T = { fights: 0, won: 0, lost: 0, stalled: 0, rounds: 0, beats: 0, yourAtt: 0, yourHit: 0, theirAtt: 0, theirHit: 0, down: 0, dead: 0,
    injured: 0, yourRan: 0, theirRan: 0, rout: 0, wonNoneDown: 0, wipe: 0, theirDown: 0, men: 0, enemies: 0 };
  ctx.HOOK = {
    breath: function (u, base) { return u.side === 'you' || L.breathBoth ? L.breath : base; },
    hit: function (a, t, ch) {
      let c = ch + (a.side === 'you' ? L.hit : -(L.hitThem === undefined ? L.hit : L.hitThem));
      a.__base = c;
      if (L.streak && a.side === 'you' && c >= L.streak.from && a.__ms > 0) c += L.streak.plus * a.__ms;
      return c;
    },
    after: function (a, t, r) {
      if (a.side === 'you') { T.yourAtt++; if (r.hit) T.yourHit++;
        if (L.streak) { if (r.hit) a.__ms = 0; else if (a.__base >= L.streak.from) a.__ms = (a.__ms || 0) + 1; } }
      else { T.theirAtt++; if (r.hit) T.theirHit++; }
    }
  };
  const G = DB.rules.experience.stat_gains.value, mid = k => (G[k][0] + G[k][1]) / 2;
  const P1 = mid('primary (melee skill, melee defense)'), S2 = mid('secondary (ranged skill, ranged defense, HP, fatigue, resolve)');
  for (let k = 0; k < n; k++) {
    ctx.setSeed(7000 + k);
    const party = C.kind === 'humans' ? { faction: 'brigands', count: count, days: st.day, difficulty: L.pick } : Array.from({ length: count }, () => C.kind);
    F.setup({ auto: true, formation: null, company: company, cap: C.company, party: party, days: st.day });
    F.S.units.forEach(u => {
      if (L.gains && u.side === 'you' && u.level > 1) {
        const g = u.level - 1;
        if (F.isRanged(u.weapon)) u.rskill = Math.round(u.rskill + S2 * g); else u.mskill = Math.round(u.mskill + P1 * g);
        u.mdef = Math.round(u.mdef + P1 * g); u.hp = u.hpMax = Math.round(u.hp + S2 * g);
      }
      if (u.resolve === null || u.resolve === undefined) return;
      if (u.side === 'them' && L.nerve !== 1) u.resolve = Math.round(u.resolve * L.nerve);
      if (u.side === 'you' && L.ownNerve !== 1) u.resolve = Math.round(u.resolve * L.ownNerve);
    });
    let g = 0;
    while (!F.S.over && g < 400000) { const u = F.current(); if (!u) break; F.aiStep(u); g++; }
    const S = F.S, yours = S.units.filter(u => u.side === 'you'), ids = new Set(yours.map(u => u.id));
    T.fights++; T.men += yours.length; T.enemies += S.units.length - yours.length;
    if (!S.over) T.stalled++; else if (S.result === 'won') T.won++; else T.lost++;
    T.rounds += S.round;
    let acted = false, open = false, downs = 0;
    const ranY = new Set(), ranT = new Set(), downT = new Set();
    S.log.forEach(e => {
      if (e.t === 'turn') { if (open) T.beats += acted ? 2 : 0.5; open = true; acted = false; }
      else if (e.t === 'step' || e.t === 'attack' || e.t === 'reload' || e.t === 'skill') acted = true;
      if ((e.t === 'down' || e.t === 'dead') && ids.has(e.id)) { downs++; if (e.t === 'dead') T.dead++; }
      if ((e.t === 'down' || e.t === 'dead') && !ids.has(e.id)) downT.add(e.id);
      if (e.t === 'injury' && ids.has(e.id)) T.injured++;
      if (e.t === 'morale' && e.to === 'Fleeing') (ids.has(e.id) ? ranY : ranT).add(e.id);
      if (e.t === 'fled' && !ids.has(e.id)) ranT.add(e.id);
    });
    if (open) T.beats += acted ? 2 : 0.5;
    T.down += downs; T.yourRan += ranY.size; T.theirRan += ranT.size; T.theirDown += downT.size;
    if (S.result === 'won' && ranT.size > 0) T.rout++;
    if (S.result === 'won' && downs === 0) T.wonNoneDown++;
    if (downs >= yours.length) T.wipe++;
  }
  T.count = count;
  return T;
}

/* ---------- what a player feels, per fight ---------- */
function felt(T) {
  const f = T.fights, r1 = x => Math.round(x * 10) / 10, r2 = x => Math.round(x * 100) / 100, pct = x => Math.round(100 * x);
  return {
    fights: f, enemies: T.count, won_in_100: pct(T.won / f), stalled_in_100: pct(T.stalled / f),
    won_with_nobody_down_in_100: pct(T.wonNoneDown / f), whole_company_down_in_100: pct(T.wipe / f),
    minutes_on_auto: r1(T.beats / f / 120), rounds: r1(T.rounds / f),
    your_swings_land_in_100: pct(T.yourHit / Math.max(1, T.yourAtt)), their_swings_land_in_100: pct(T.theirHit / Math.max(1, T.theirAtt)),
    your_men_struck_down_per_fight: r2(T.down / f), share_of_your_men_struck_down_in_100: pct(T.down / Math.max(1, T.men)),
    your_men_dead_per_100_fights: r1(100 * T.dead / f), your_men_hurt_per_fight: r2(T.injured / f),
    their_men_down_per_fight: r2(T.theirDown / f), their_men_who_ran_per_fight: r2(T.theirRan / f), wins_by_a_rout_in_100: pct(T.rout / f)
  };
}

/* ---------- the cells ---------- */
function cells(only) {
  const out = [];
  const add = (kind, comps, counts, stages, sets) => comps.forEach(c => counts.forEach(e => stages.forEach(s => sets.forEach(t =>
    out.push({ kind: kind, company: c, enemies: e, stage: s, setting: t })))));
  const S3 = SETTINGS.map(s => s.id), ST = ['early', 'middle', 'late'];
  if (!only || only === 'humans') add('humans', COMPANIES, COUNTS, ST, S3);
  if (!only || only === 'beasts') add('direwolf', COMPANIES, COUNTS, ST, S3);
  /* THE ROSTER: every played beast against the twelve and against six, at a pack of 3, 6 and 12, at the three stages, at THE
     START (TODAY against START is the two whole grids' question; the roster asks which beast is the hard one) */
  /* THE WEIGHT: the twelve in the endgame armour against 12, 20 and 38, beside the same fights in the late armour */
  if (!only || only === 'side') add('humans', [12], [12, 20, 38], ['endgame'], S3);
  if (!only || only === 'roster') Object.keys(BEASTS).filter(b => b !== 'direwolf').forEach(b => add(b, [6, 12], [3, 6, 12], ST, ['start']));
  return out;
}
const key = c => [c.kind, c.company, c.enemies, c.stage, c.setting].join('|');

async function main() {
  const argv = process.argv;
  if (argv[2] === '--cell') {
    const C = JSON.parse(argv[3]), strikes = argv[5] ? JSON.parse(fs.readFileSync(argv[5], 'utf8')) : null;
    process.stdout.write(JSON.stringify(await cell(C, Number(argv[4]), strikes)));
    return;
  }
  if (argv[2] === '--control') {
    const A = await engine(true), B = await engine(false);
    B.HOOK = { hit: (a, t, c) => c, after: () => {}, breath: (u, b) => b };
    let same = 0;
    for (let k = 1; k <= 6; k++) {
      const out = [A, B].map(c => { c.setSeed(k); c.FIGHT.setup({ auto: true, formation: null }); let g = 0;
        while (!c.FIGHT.S.over && g < 40000) { c.FIGHT.aiStep(c.FIGHT.current()); g++; }
        return c.FIGHT.S.result + ' in ' + c.FIGHT.S.round + ' rounds, ' + c.FIGHT.S.log.length + ' events'; });
      if (out[0] === out[1]) same++;
      console.log('seed ' + k + ': ' + out[0] + (out[0] === out[1] ? '  SAME' : '  DIFFERENT: ' + out[1]));
    }
    console.log('control: ' + same + ' of 6 the same');
    process.exit(same === 6 ? 0 : 1);
  }
  const arg = (k, d) => { const i = argv.indexOf(k); return i > 0 ? argv[i + 1] : d; };
  const N = Number(arg('--n', 100)), JOBS = Number(arg('--jobs', 4)), only = arg('--only', null);
  const strikes = wikiStrikes(Object.keys(BEASTS));
  const sfile = path.join(require('os').tmpdir(), 'bohemia_grid_strikes_' + process.pid + '.json');
  fs.writeFileSync(sfile, JSON.stringify(strikes));
  const work = cells(only), results = {};
  let next = 0, running = 0;
  const t0 = Date.now();
  await new Promise(done => {
    const pump = () => {
      while (running < JOBS && next < work.length) {
        const w = work[next++]; running++;
        cp.execFile(process.execPath, [__filename, '--cell', JSON.stringify(w), String(N), sfile], { maxBuffer: 1 << 24 }, (err, out) => {
          running--;
          if (err) { console.error('cell failed', JSON.stringify(w), err.message); process.exit(1); }
          results[key(w)] = felt(JSON.parse(out));
          if ((next % 20) === 0) process.stderr.write(next + '/' + work.length + ' ' + Math.round((Date.now() - t0) / 1000) + 's\n');
          if (next >= work.length && running === 0) done(); else pump();
        });
      }
    };
    pump();
  });
  fs.unlinkSync(sfile);
  const secs = Math.round((Date.now() - t0) / 1000);
  /* the table, one block per kind, stage and setting: rows the company, columns the count */
  const kinds = Array.from(new Set(work.map(w => w.kind)));
  kinds.forEach(kd => Object.keys(STAGES).forEach(sg => SETTINGS.forEach(t => {
    const rows = work.filter(w => w.kind === kd && w.stage === sg && w.setting === t.id);
    if (!rows.length) return;
    const comps = Array.from(new Set(rows.map(w => w.company))), cnts = Array.from(new Set(rows.map(w => w.enemies)));
    console.log('\n' + kd.toUpperCase() + ' / ' + sg + ' / ' + t.id + '   won in 100 (the map\'s pick in brackets)');
    console.log('company'.padEnd(9) + cnts.map(c => String(c).padStart(8)).join(''));
    comps.forEach(c => console.log(String(c).padEnd(9) + cnts.map(e => { const r = results[key({ kind: kd, company: c, enemies: e, stage: sg, setting: t.id })];
      return (e === 'map' ? r.won_in_100 + '(' + r.enemies + ')' : String(r.won_in_100)).padStart(8); }).join('')));
  })));
  console.log('\n' + work.length + ' cells x ' + N + ' fights in ' + secs + ' s');
  if (argv.includes('--write')) {
    const prev = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : null;
    const cellsOut = Object.assign({}, prev && prev.cells || {});
    work.forEach(w => { cellsOut[key(w)] = Object.assign({ kind: w.kind, company: w.company, enemies_asked: w.enemies, stage: w.stage, setting: w.setting }, results[key(w)]); });
    fs.writeFileSync(OUT, JSON.stringify({
      _readme: 'TUNING [the whole grid] 10/18 (rule 117(e): a tuning number is a grid, never one average; rule 38g research only). draft:true. '
        + 'DRAFT: THE GEAR IS NOT IN (CHARACTER\'s roll-call and COMBAT\'s equipment). NOTHING IN THE GAME READS THIS FILE. Every cell is fights of the live '
        + 'fight\'s own rules and its own data files (slices/BOHEMIA_FIGHT.html, played headless by tools/bohemia_tuning_the_whole_grid.js), AUTO on both '
        + 'sides, seeded (fight k plays seed 7000+k) so every setting meets the same fights. Beasts: the fight has no beast path; each played beast carries '
        + 'its wiki strike as an in-memory weapon row (strikes below) and loses what LOSES names. Key: kind|company|enemies|stage|setting.',
      draft: true, schema: 1, fights_per_cell: N,
      settings: SETTINGS.map(t => ({ id: t.id, name: t.name, levers: t.L })),
      stages: STAGES, gear: GEAR, companies: COMPANIES, counts: COUNTS,
      strikes: strikes, loses: LOSES, not_played: NOT_PLAYED,
      cells: cellsOut
    }, null, 1) + '\n');
    console.log('wrote ' + path.relative(ROOT, OUT));
  }
}
if (require.main === module) main().catch(e => { console.error(e); process.exit(1); });
module.exports = { engine, cell, felt, companyOf, mapCount, wikiStrikes, BEASTS, LOSES, NOT_PLAYED, STAGES, GEAR, SETTINGS, COMPANIES, COUNTS };
