#!/usr/bin/env node
// TUNING [the first kit is guns] 10/19 -- RESEARCH INSTRUMENT, NOT A GATE (rule 38g; rule 120(a); rule 117).
// Paolo 10/18: 'I wanna start off with the guns too... the guns were supposed to be the main way this is gonna be solved'
// and 'so fucking hard' (rule 117: easier than Battle Brothers). The row asks: the starting guns' numbers (hit chance at one,
// two and three tiles, damage against no armour, light and heavy, ammo per fight), easier than Battle Brothers' first
// crossbows and bows, across the grid's small cells (1 to 6 men against a few), beside Battle Brothers' own. DRAFT.
//
// Two parts, both on the LIVE fight (slices/BOHEMIA_FIGHT.html played headless by tools/bohemia_tuning_the_whole_grid.js's
// engine, which reads exactly the files the fight's own loadAll() fetches):
//   THE CARD   each gun's hit chance at 1 to 6 tiles and its damage against no armour, light and heavy, computed by the fight's
//              own hitChance() and resolveAttack() on a flat lit board (forced rolls, every damage value and both hit spots
//              walked, so it is exact, not sampled)
//   THE BENCH  fights over the small cells: the company at 1, 3 and 6 (the origins' own men), the enemy at 2, 3 and 6, brigands
//              and dire wolves, early stage, two settings (Battle Brothers' Veteran, and THE START: rule 117's levers), five kits
// The DRAFT GUN ROWS below live in memory only. Nothing in the game reads them. Their distance numbers ride on the row
// (per_tile, base_bonus), which the live fight cannot read today: the fight takes a ranged weapon's distance numbers from its
// CLASS (crossbow, firearm, throwing, else the bow's Quick Shot) and ignores the row's own skill. The bench splices one line in
// its memory copy so a row that carries them uses them; that splice is part of the proposal handed to COMBAT.
//
//   node tools/bohemia_tuning_the_first_kit_is_guns.js --card            the card only (seconds)
//   node tools/bohemia_tuning_the_first_kit_is_guns.js [--n 200] [--jobs 4] [--write]
//        --write also writes banks/BOHEMIA_TUNING_THE_FIRST_KIT_IS_GUNS_10_19_26.json
// Seeded: fight k of a cell plays seed 9000 + k, so every kit and every setting meets the SAME fights.
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const GRID = require('./bohemia_tuning_the_whole_grid.js');
const OUT = path.join(ROOT, 'banks/BOHEMIA_TUNING_THE_FIRST_KIT_IS_GUNS_10_19_26.json');
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));

/* ---------- THE DRAFT GUN ROWS (ours, DRAFT, nothing reads them) ----------
   The SHAPE is the real one (section 2 of the page): a pistol is short and falls off fast, a rifle is flat and long, a
   shotgun is murder at two houses and nothing past three, and buckshot does little to plate. The NUMBERS start from
   Battle Brothers' first bows and crossbows and are moved one way only, easier (rule 117a). A shot is one press: the
   reload lives inside the shot's AP, so there is no reload button (rule 117b, fewer buttons), and every gun fires twice a
   turn (4 AP of 9) as a pipe swings twice: the search (--search) measured the rate as the lever that wins, not the
   distance at the start. At one tile a gun is a club (butt: the Wooden Stick's row), Battle Brothers' bag-and-swap made
   one press. The class is 'firearm' for all three: a gun, no ring (rule 103), piercing. Ranges keep rule 83 (every gun
   fires from two tiles). */
const DRAFT = {
  pistol: { id: 'draft_pistol', name: 'DRAFT Pistol', class: 'firearm', hands: 1, damage_min: 30, damage_max: 50, armor_damage_pct: 50,
    armor_ignore_pct: 45, fatigue: null, durability: 60, value: 300, range: 3, range_min: 2, range_max: 3,
    per_tile: -8, base_bonus: 20, free_tiles: 1, ignores_line_of_fire: false,
    skills: [{ name: 'Shoot Pistol', ap: 4, fatigue: 8, hit_bonus: 20, range: null }], ammo: null,
    butt: 'wooden_stick', beside: 'short_bow', why: 'two shots a turn like the Short Bow\'s Quick Shot (4 AP), the Short Bow\'s own damage (30-50) with a step more of it past the armour (45 against 35), a steeper fall per tile than any bow (a handgun is short), a bigger base so it still starts easier at two and three tiles' },
  rifle: { id: 'draft_rifle', name: 'DRAFT Rifle', class: 'firearm', hands: 2, damage_min: 35, damage_max: 55, armor_damage_pct: 70,
    armor_ignore_pct: 50, fatigue: null, durability: 60, value: 600, range: 6, range_min: 2, range_max: 6,
    per_tile: -2, base_bonus: 20, free_tiles: 1, ignores_line_of_fire: false,
    skills: [{ name: 'Shoot Rifle', ap: 4, fatigue: 10, hit_bonus: 20, range: null }], ammo: null,
    butt: 'wooden_stick', beside: 'light_crossbow', why: 'the Light Crossbow\'s reach (6) and direct share, a step more damage, the Aimed Shot\'s flat fall (-2 a tile), +20 where the bolt is +15; two shots a turn where the crossbow fires one (4 AP, not 3 then a 4 AP reload: a rifle has no crank)' },
  shotgun: { id: 'draft_shotgun', name: 'DRAFT Shotgun', class: 'firearm', hands: 2, damage_min: 40, damage_max: 75, armor_damage_pct: 90,
    armor_ignore_pct: 30, fatigue: null, durability: 60, value: 500, range: 3, range_min: 2, range_max: 3,
    per_tile: -15, base_bonus: 25, free_tiles: 1, ignores_line_of_fire: true,
    skills: [{ name: 'Shoot Shotgun', ap: 4, fatigue: 10, hit_bonus: 25, range: null }], ammo: null,
    butt: 'wooden_stick', beside: 'handgonne', why: 'the Handgonne\'s shape (a big base, a steep fall, the spread ignores the line of fire) with a second tile and two shots a turn (4 AP, not 3 then a 9 AP reload), the low end a step up (40-75 against 35-75), a step more past the armour (30 against 25), still the weakest of the three on plate (the rifle passes 50)' }
};

/* ---------- THE KITS: who holds what. A slot is a place in the line (ours.crew); the main man keeps the pipe and the car door,
   the only ring in a gun company (rule 103: a gun holds no zone of control) ---------- */
const SLOTS = {
  1: ['rifle'],
  3: ['line', 'rifle', 'pistol'],
  6: ['line', 'line', 'rifle', 'rifle', 'pistol', 'shotgun']
};
const ALL_GUNS = { 1: ['rifle'], 3: ['rifle', 'pistol', 'shotgun'], 6: ['rifle', 'rifle', 'pistol', 'pistol', 'shotgun', 'shotgun'] };
const KITS = {
  today: { name: 'TODAY: each man keeps the kit of his place in the line (14 of 15 origins: no gun that fires)', rows: null },
  jobs: { name: 'THE JOBS ON TODAY\'S ROWS: the same slots, each gun on the Battle Brothers row it rides today (rifle the Light Crossbow, pistol the Dagger, shotgun the Handgonne)',
    rows: { rifle: 'light_crossbow', pistol: 'dagger', shotgun: 'handgonne' } },
  bb: { name: 'BATTLE BROTHERS\' FIRST BOWS AND CROSSBOWS: the same slots holding its own first rows (Light Crossbow, Short Bow, Handgonne)',
    rows: { rifle: 'light_crossbow', pistol: 'short_bow', shotgun: 'handgonne' } },
  draft: { name: 'THE DRAFT GUNS (the proposal): the same slots holding the three draft rows, two shots a turn, the butt at one tile',
    rows: { rifle: 'draft_rifle', pistol: 'draft_pistol', shotgun: 'draft_shotgun' }, butt: true },
  once: { name: 'THE DRAFT GUNS AT THE CROSSBOW\'S PACE: the proposal with the rifle and the shotgun at one shot a turn (5 AP), the butt on (what the rate is worth)',
    rows: { rifle: 'draft_rifle', pistol: 'draft_pistol', shotgun: 'draft_shotgun' }, butt: true, ap: 5 },
  eye: { name: 'THE DRAFT GUNS BY THE EYE: the proposal, the main man on the line, the rest handed their guns by their background\'s ranged skill (the best eye the first rifle), the worst eyes on the line',
    rows: { rifle: 'draft_rifle', pistol: 'draft_pistol', shotgun: 'draft_shotgun' }, butt: true, byEye: true },
  nobutt: { name: 'THE DRAFT GUNS WITHOUT THE BUTT: the proposal, but a gun at one tile does nothing (rule 83 as the fight plays it: what the butt is worth)',
    rows: { rifle: 'draft_rifle', pistol: 'draft_pistol', shotgun: 'draft_shotgun' }, butt: false },
  far: { name: 'THE OPENING: the proposal with the first band across the street (the fronts 8 tiles apart, columns 6 and 14, not 5): a search side test',
    rows: { rifle: 'draft_rifle', pistol: 'draft_pistol', shotgun: 'draft_shotgun' }, butt: true, cols: [6, 14] },
  allguns: { name: 'ALL GUNS, NOBODY ON THE LINE: every man a draft gun, the butt on (a side test: the ring)', rows: { rifle: 'draft_rifle', pistol: 'draft_pistol', shotgun: 'draft_shotgun' }, all: true, butt: true }
};
const KIT_ORDER = ['today', 'jobs', 'bb', 'draft', 'once', 'nobutt'];
const EYE_COMPANIES = [3, 6];
const SETS = ['bb', 'start'];
const LOADS = [6, 8, 10, 12, 15, 20];
const COMPANIES = [1, 3, 6], COUNTS = [2, 3, 6], KINDS = ['humans', 'direwolf'];

/* the lines spliced into the memory copy, each before an anchor found exactly once:
   (1) THE ROW'S OWN DISTANCE: a ranged row that carries per_tile and base_bonus uses them (the live fight reads them off the class)
   (2) THE BUTT, reach: with HOOK.butt on, a gun whose row names a butt reaches a man beside him (a melee reach, the height rule kept)
   (3) THE BUTT, the blow: the blow is struck with the butt's row and skill (the melee path: his melee skill, the club's damage)
   With HOOK.butt off, (2) and (3) do nothing and the fight is the live one. */
const SPLICES = [
  ['      ch = sk - df + base + per * Math.max(0, dist(a, t) - free);',
   '      if (typeof w.per_tile === \'number\') { per = w.per_tile; base = w.base_bonus; free = w.free_tiles || 1; ignores = !!w.ignores_line_of_fire; }\n'],
  ["    const up = Math.max(0, level(a.x, a.y) - level(t.x, t.y)) * R('hit_chance.height.ranged_range_per_level');",
   "    if (HOOK && HOOK.butt && w.butt && isGun(w) && d === 1) return Math.abs(level(a.x, a.y) - level(t.x, t.y)) <= R('hit_chance.height.melee_max_height_gap');\n"],
  ['    const r = resolveAttack(a, t, s, forced);',
   '    const btRow = HOOK && HOOK.butt && a.weapon.butt && dist(a, t) === 1 ? weaponRow(a.weapon.butt) : null, gunRow = a.weapon;\n'
   + '    if (btRow) { a.weapon = btRow; const rb = resolveAttack(a, t, strikeSkill(btRow), forced); apply(a, t, rb); a.weapon = gunRow; afterAction(a); return rb; }\n']
];
const ROW_SPLICE = SPLICES[0][1];
async function engine(strikes) {
  const html = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_FIGHT.html'), 'utf8');
  SPLICES.forEach(sp => { if (html.split(sp[0]).length !== 2) throw new Error('THE FIGHT MOVED: anchor not found exactly once: ' + sp[0].slice(0, 60)); });
  /* the grid's engine reads the fight file itself; hand it a copy with the splices by swapping the reader for one call */
  const real = fs.readFileSync;
  fs.readFileSync = function (p, enc) {
    const out = real.apply(fs, arguments);
    if (!String(p).endsWith('BOHEMIA_FIGHT.html')) return out;
    let h = String(out);
    SPLICES.forEach(sp => { h = h.replace(sp[0], sp[1] + sp[0]); });
    return h;
  };
  let ctx;
  try { ctx = await GRID.engine(false, strikes); } finally { fs.readFileSync = real; }
  Object.keys(DRAFT).forEach(k => { const r = Object.assign({}, DRAFT[k]); delete r.beside; delete r.why; ctx.DB.weapons.rows.push(r); });
  ctx.HOOK = { hit: (a, t, c) => c, after: () => {}, breath: (u, b) => b, butt: false };
  return ctx;
}

/* ---------- THE CARD: the fight's own functions on two men, a flat lit board, forced rolls walked exactly ---------- */
const SHOOTERS = [
  { id: 'average', name: 'the average starting man (ranged skill 42: the middle of the fifteen origins\' first men, their backgrounds\' rolls)', rskill: null },
  { id: 'born', name: 'a born shooter (the Hunter background\'s middle, 55.5)', rskill: 55.5 }
];
const TARGETS = [
  { id: 'thug', name: 'a brigand thug (ranged defence 0, 55 hitpoints)', rdef: 0, hp: 55 },
  { id: 'raider', name: 'a raider (ranged defence 5, 75 hitpoints)', rdef: 5, hp: 75 },
  { id: 'direwolf', name: 'a dire wolf (ranged defence 10, 130 hitpoints, its own hide 30 and 30)', rdef: 10, hp: 130 }
];
const ARMOURS = [
  { id: 'none', name: 'no armour', body: 0, head: 0 },
  { id: 'light', name: 'light: a Gambeson and a Hood (65 and 30), a thug\'s kind', body: 65, head: 30 },
  { id: 'heavy', name: 'heavy: a Worn Mail Shirt and a Nasal Helmet (110 and 105), a raider\'s kind', body: 110, head: 105 }
];
function averageStartingRanged(DB) {
  /* the middle of each origin's men's ranged skill roll, every man of the fifteen origins counted once */
  const bg = new Map(DB.backgrounds.rows.map(r => [r.id, r])), O = J('records/target/bb/origins.json').origins;
  const v = [];
  O.forEach(o => o.men.forEach(m => { const s = bg.get(m.background).stats.ranged_skill; v.push((s[0] + s[s.length - 1]) / 2); }));
  return Math.round(10 * v.reduce((a, b) => a + b, 0) / v.length) / 10;
}
function cardRows(ctx) {
  const F = ctx.FIGHT, DB = ctx.DB;
  const avg = averageStartingRanged(DB);
  SHOOTERS[0].rskill = avg; SHOOTERS[0].name = SHOOTERS[0].name.replace('42', String(avg));
  ctx.HOOK = { hit: (a, t, c) => c, after: () => {}, breath: (u, b) => b, butt: false };   /* neutral: the card is Battle Brothers' Veteran, no lever */
  ctx.setSeed(1);
  F.setup({ auto: true, formation: null, flat: true, night: false, cap: 1, company: [{ background: 'hunter', level: 1 }], party: ['brigand_thug'], days: 1 });
  const a = F.S.units.filter(u => u.side === 'you')[0], t = F.S.units.filter(u => u.side === 'them')[0];
  [a, t].forEach(u => { u.perks = []; u.injuries = []; u.morale = 'Steady'; u.fat = 0; });
  F.S.units.length = 0; F.S.units.push(a, t);
  /* clear the board of anything that would change a shot: cover, height, the dark */
  for (let y = 0; y < F.S.h; y++) for (let x = 0; x < F.S.w; x++) { if (F.S.cover && F.S.cover[y]) F.S.cover[y][x] = false; if (F.S.coverCount && F.S.coverCount[y]) F.S.coverCount[y][x] = 0; }
  F.S.night = false;
  const yRow = Math.floor(F.S.h / 2);
  const W = id => DB.weapons.rows.filter(r => r.id === id)[0];
  const ids = ['draft_pistol', 'draft_rifle', 'draft_shotgun', 'short_bow', 'light_crossbow', 'handgonne', 'bundle_of_throwing_axes', 'dagger', 'bludgeon'];
  const rows = [];
  ids.forEach(id => {
    const w = W(id), sk = F.strikeSkill(w);
    a.weapon = w; a.loaded = true; a.ammo = null; a.shield = null;
    const reachMin = F.isRanged(w) ? Math.max(2, (w.range_min < w.range_max ? w.range_min : 1)) : 1;
    const reachMax = F.isRanged(w) ? (typeof w.range === 'number' ? w.range : w.range_max) : 1;
    const row = { id: id, name: w.name, draft: /^draft_/.test(id), ap: sk.ap, reload_ap: F.reloadSkill(w) ? F.reloadSkill(w).ap : 0,
      shots_a_turn: Math.floor(9 / (sk.ap + (F.reloadSkill(w) ? F.reloadSkill(w).ap : 0))) || 0, reach: reachMin + '..' + reachMax,
      damage: w.damage_min + '-' + w.damage_max, armour_damage_pct: w.armor_damage_pct, direct_pct: w.armor_ignore_pct, hit: {}, dmg: {}, to_drop: {} };
    if (F.reloadSkill(w) && sk.ap + F.reloadSkill(w).ap > 9) row.shots_a_turn = 0.5;
    /* hit chance at 1..6 tiles, each shooter against each target's defence */
    SHOOTERS.forEach(s => TARGETS.forEach(tg => {
      a.rskill = s.rskill; a.mskill = 55; t.rdef = tg.rdef; t.mdef = 0;
      const line = [];
      for (let d = 1; d <= 6; d++) {
        a.x = 0; a.y = yRow; t.x = d; t.y = yRow;
        const ok = F.isRanged(w) ? (d >= reachMin && d <= reachMax) : d === 1;
        line.push(ok ? F.hitChance(a, t, sk).chance : null);
      }
      row.hit[s.id + '|' + tg.id] = line;
    }));
    /* damage of one hit on fresh armour: every base value, body and head, at their real odds (head 25 in 100) */
    ARMOURS.forEach(ar => {
      let hp = 0, arm = 0, n = 0;
      const head = (w.head_hit_chance || 0) + 25;
      for (let b = w.damage_min; b <= w.damage_max; b++) [true, false].forEach(h => {
        t.armB = ar.body; t.armH = ar.head; t.hp = 999;
        const r = F.resolveAttack(a, t, sk, { roll: 1, head: h, base: b });
        const p = (h ? head : 100 - head) / 100;
        hp += p * r.hp; arm += p * r.armour; n += p;
      });
      row.dmg[ar.id] = { hp: Math.round(10 * hp / n) / 10, armour: Math.round(10 * arm / n) / 10 };
    });
    /* hits to drop a thug in each armour, sampled with the armour wearing down hit by hit (2,000 thugs, the fight's own sums) */
    ARMOURS.forEach(ar => {
      let tot = 0; const N = 2000; ctx.setSeed(77);
      for (let k = 0; k < N; k++) {
        t.armB = ar.body; t.armH = ar.head; t.hp = 55; let hits = 0;
        while (t.hp > 0 && hits < 50) {
          const r = F.resolveAttack(a, t, sk, { roll: 1 });
          if (r.head) t.armH = Math.max(0, t.armH - r.armour); else t.armB = Math.max(0, t.armB - r.armour);
          t.hp -= r.hp; hits++;
        }
        tot += hits;
      }
      row.to_drop[ar.id] = Math.round(10 * tot / N) / 10;
    });
    rows.push(row);
  });
  return { average_ranged_skill: avg, rows: rows };
}

/* ---------- THE BENCH: one cell ---------- */
let C_SLOT1 = null;   /* a search knob (--cell only): what the one man holds */
function kitCompany(n, kit, DB) {
  const base = GRID.companyOf(n, 'early'), crew = DB.ours.crew.value, K = KITS[kit];
  if (!K.rows) return base;
  let slots = (K.all ? ALL_GUNS : SLOTS)[n];
  if (K.byEye && n > 1) {
    /* the main man (the first) keeps the line; the others, best eye first, take the guns in the order rifle, rifle, pistol, shotgun */
    const bg = new Map(DB.backgrounds.rows.map(r => [r.id, r])), eye = m => { const s = bg.get(m.background).stats.ranged_skill; return (s[0] + s[s.length - 1]) / 2; };
    const order = base.map((m, i) => i).slice(1).sort((a, b) => eye(base[b]) - eye(base[a]) || a - b);
    const guns = slots.slice(1).filter(x => x !== 'line').sort((a, b) => ['rifle', 'pistol', 'shotgun'].indexOf(a) - ['rifle', 'pistol', 'shotgun'].indexOf(b));
    const out = ['line'].concat(base.slice(1).map(() => 'line'));
    order.forEach((i, k) => { if (k < guns.length) out[i] = guns[k]; });
    slots = out;
  }
  return base.map((m, i) => {
    const place = crew[i % crew.length], s = slots[i];
    if (s === 'line') return m;
    const sl = (C_SLOT1 && n === 1) ? C_SLOT1 : s;
    return Object.assign({}, m, { gear: { main: K.rows[sl], off: null, body: place.body, head: place.head }, slot: sl });
  });
}
async function cell(C, n, strikes) {
  const ctx = await engine(strikes), F = ctx.FIGHT, DB = ctx.DB;
  const L = Object.assign({}, GRID.SETTINGS[0].L, GRID.SETTINGS.filter(s => s.id === C.setting)[0].L);
  DB.rules.experience.global_modifier.value = L.xp;
  const ph = DB.ours.enemy_tiers.value.phases; ph[1].from_day = L.tiers[0]; ph[2].from_day = L.tiers[1];
  C_SLOT1 = C.slot1 || null;
  const company = kitCompany(C.company, C.kit, DB), K = KITS[C.kit];
  /* a search knob (--cell only): scale the draft rows' damage and add to their base, in this memory copy */
  if (K.ap) DB.weapons.rows.filter(r => r.id === 'draft_rifle' || r.id === 'draft_shotgun').forEach(r => { r.skills[0].ap = K.ap; });
  if (C.mod) DB.weapons.rows.filter(r => /^draft_/.test(r.id)).forEach(r => {
    if (C.mod.dmg) { r.damage_min = Math.round(r.damage_min * C.mod.dmg); r.damage_max = Math.round(r.damage_max * C.mod.dmg); }
    if (C.mod.hit) r.base_bonus += C.mod.hit;
    if (C.mod.ap && r.id !== 'draft_pistol') r.skills[0].ap = C.mod.ap;
  });
  if (K.cols) DB.ours.start_cols.value = K.cols.slice();
  const T = { fights: 0, won: 0, lost: 0, stalled: 0, rounds: 0, beats: 0, yourAtt: 0, yourHit: 0, theirAtt: 0, theirHit: 0, down: 0, dead: 0,
    injured: 0, yourRan: 0, theirRan: 0, rout: 0, wonNoneDown: 0, wipe: 0, theirDown: 0, men: 0, enemies: 0, count: C.enemies,
    gunShots: 0, gunHits: 0, gunDmg: 0, allDmg: 0, gunmanFights: 0, gunTurns: 0, stuckTurns: 0, shotsList: [], byDist: {} };
  let shotsNow = null;
  ctx.HOOK = {
    butt: !!K.butt && !C.nobutt,
    breath: (u, base) => u.side === 'you' || L.breathBoth ? L.breath : base,
    hit: (a, t, ch) => {
      let c = ch + (a.side === 'you' ? L.hit : -(L.hitThem === undefined ? L.hit : L.hitThem));
      a.__base = c;
      if (L.streak && a.side === 'you' && c >= L.streak.from && a.__ms > 0) c += L.streak.plus * a.__ms;
      return c;
    },
    after: (a, t, r) => {
      if (a.side === 'you') {
        T.yourAtt++; if (r.hit) T.yourHit++;
        if (L.streak) { if (r.hit) a.__ms = 0; else if (a.__base >= L.streak.from) a.__ms = (a.__ms || 0) + 1; }
        const dmg = r.hit ? Math.min(r.hp, Math.max(0, t.hp)) : 0;
        T.allDmg += dmg;
        if (F.isRanged(a.weapon)) {
          T.gunShots++; if (r.hit) T.gunHits++; T.gunDmg += dmg;
          if (shotsNow) shotsNow[a.id] = (shotsNow[a.id] || 0) + 1;
          const d = Math.max(Math.abs(a.x - t.x), Math.abs(a.y - t.y)), k = d >= 4 ? '4+' : String(d);
          const b = T.byDist[k] = T.byDist[k] || { shots: 0, hits: 0 }; b.shots++; if (r.hit) b.hits++;
        }
      } else { T.theirAtt++; if (r.hit) T.theirHit++; }
    }
  };
  for (let k = 0; k < n; k++) {
    ctx.setSeed(9000 + k);
    const party = C.kind === 'humans' ? { faction: 'brigands', count: C.enemies, days: 1, difficulty: L.pick } : Array.from({ length: C.enemies }, () => C.kind);
    F.setup({ auto: true, formation: null, company: company, cap: C.company, party: party, days: 1 });
    F.S.units.forEach(u => {
      if (u.resolve === null || u.resolve === undefined) return;
      if (u.side === 'them' && L.nerve !== 1) u.resolve = Math.round(u.resolve * L.nerve);
      if (u.side === 'you' && L.ownNerve !== 1) u.resolve = Math.round(u.resolve * L.ownNerve);
    });
    const gunmen = F.S.units.filter(u => u.side === 'you' && F.isRanged(u.weapon));
    shotsNow = {}; gunmen.forEach(u => { shotsNow[u.id] = 0; });
    let g = 0, last = null, lastRound = -1;
    while (!F.S.over && g < 400000) {
      const u = F.current(); if (!u) break;
      if (u !== last || F.S.round !== lastRound) {
        last = u; lastRound = F.S.round;
        if (u.side === 'you' && F.isRanged(u.weapon) && F.onField(u)) {
          T.gunTurns++;
          const adj = F.S.units.some(f => f.side !== u.side && F.onField(f) && Math.max(Math.abs(f.x - u.x), Math.abs(f.y - u.y)) === 1);
          if (adj) T.stuckTurns++;
        }
      }
      F.aiStep(u); g++;
    }
    gunmen.forEach(u => { T.shotsList.push(shotsNow[u.id] || 0); T.gunmanFights++; });
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
  return T;
}
function feltGuns(T) {
  const f = GRID.felt(T), pct = x => Math.round(100 * x), r1 = x => Math.round(10 * x) / 10;
  const s = T.shotsList.slice().sort((a, b) => a - b), q = p => s.length ? s[Math.min(s.length - 1, Math.floor(p * s.length))] : null;
  return Object.assign(f, {
    gunmen_per_fight: r1(T.gunmanFights / T.fights),
    guns_share_of_the_killing_in_100: T.allDmg ? pct(T.gunDmg / T.allDmg) : null,
    gun_shots_land_in_100: T.gunShots ? pct(T.gunHits / T.gunShots) : null,
    shots_a_gunman_fires_a_fight: s.length ? { mean: r1(s.reduce((a, b) => a + b, 0) / s.length), p50: q(0.5), p90: q(0.9), max: s[s.length - 1] } : null,
    /* had he carried only this many shots, in how many of 100 of his fights would he have wanted one more */
    dry_in_100_at_a_load_of: s.length ? LOADS.reduce((o, n) => { o[n] = pct(s.filter(x => x > n).length / s.length); return o; }, {}) : null,
    gun_turns_with_a_foe_beside_him_in_100: T.gunTurns ? pct(T.stuckTurns / T.gunTurns) : null,
    gun_shots_by_distance: Object.keys(T.byDist).sort().reduce((o, k) => { o[k] = { shots: T.byDist[k].shots, land_in_100: pct(T.byDist[k].hits / T.byDist[k].shots) }; return o; }, {})
  });
}
function cells() {
  const out = [];
  KINDS.forEach(kd => COMPANIES.forEach(c => COUNTS.forEach(e => KIT_ORDER.forEach(k => SETS.forEach(s =>
    out.push({ kind: kd, company: c, enemies: e, kit: k, setting: s }))))));
  KINDS.forEach(kd => [3, 6].forEach(c => COUNTS.forEach(e => SETS.forEach(s => out.push({ kind: kd, company: c, enemies: e, kit: 'allguns', setting: s })))));
  KINDS.forEach(kd => EYE_COMPANIES.forEach(c => COUNTS.forEach(e => SETS.forEach(s => out.push({ kind: kd, company: c, enemies: e, kit: 'eye', setting: s })))));
  return out;
}
const key = c => [c.kind, c.company, c.enemies, c.kit, c.setting].join('|');

/* ---------- THE SEARCH that chose the draft's rate (the proposal before the rate: one shot a turn for the rifle and the
   shotgun, the butt on), three cells, 160 fights each, START: what each lever buys. Kept so the choice can be re-made. ---------- */
const SEARCH = [
  { id: 'pipes', name: 'today\'s pipes', kit: 'today' },
  { id: 'bb', name: 'Battle Brothers\' first bows and crossbows', kit: 'bb' },
  { id: 'once', name: 'the draft at one shot a turn, the butt on', kit: 'once' },
  { id: 'once_nobutt', name: 'the draft at one shot a turn, no butt', kit: 'once', nobutt: true },
  { id: 'once_far', name: 'the draft at one shot a turn, the butt, the band across the street', kit: 'far', mod: { ap: 5 } },
  { id: 'once_dmg125', name: 'the draft at one shot a turn, the butt, damage x1.25', kit: 'once', mod: { dmg: 1.25 } },
  { id: 'once_dmg125_hit10', name: 'the draft at one shot a turn, the butt, damage x1.25, +10 to hit', kit: 'once', mod: { dmg: 1.25, hit: 10 } },
  { id: 'once_dmg150', name: 'the draft at one shot a turn, the butt, damage x1.5', kit: 'once', mod: { dmg: 1.5 } },
  { id: 'two', name: 'THE PICK: the draft at two shots a turn, the butt on', kit: 'draft' }
];
async function search(strikes, argv) {
  const sfile = path.join(require('os').tmpdir(), 'bohemia_guns_search_' + process.pid + '.json');
  fs.writeFileSync(sfile, JSON.stringify(strikes));
  const cellsS = [[3, 3], [6, 6], [1, 2]], out = {}, N = 160, work = [];
  cellsS.forEach(ce => SEARCH.forEach(v => work.push({ v: v, C: { kind: 'humans', company: ce[0], enemies: ce[1], kit: v.kit, setting: 'start', mod: v.mod, nobutt: v.nobutt } })));
  ['rifle', 'pistol', 'shotgun'].forEach(sl => work.push({ v: { id: 'lone_' + sl, name: 'the Lone Wolf holding the draft ' + sl }, C: { kind: 'humans', company: 1, enemies: 2, kit: 'draft', setting: 'start', slot1: sl } }));
  let next = 0, running = 0;
  await new Promise(done => {
    const pump = () => { while (running < 4 && next < work.length) { const w = work[next++]; running++;
      cp.execFile(process.execPath, [__filename, '--cell', JSON.stringify(w.C), String(N), sfile], { maxBuffer: 1 << 26 }, (err, o) => {
        running--; if (err) { console.error(err.message); process.exit(1); }
        const T = JSON.parse(o), f = feltGuns(T);
        out[w.C.company + 'v' + w.C.enemies + '|' + w.v.id] = { name: w.v.name, won_in_100: f.won_in_100, your_men_struck_down_per_fight: f.your_men_struck_down_per_fight, guns_share_of_the_killing_in_100: f.guns_share_of_the_killing_in_100 };
        if (next >= work.length && running === 0) done(); else pump(); }); } };
    pump();
  });
  fs.unlinkSync(sfile);
  Object.keys(out).sort().forEach(k => console.log(k.padEnd(24) + String(out[k].won_in_100).padStart(4) + String(out[k].your_men_struck_down_per_fight).padStart(6) + String(out[k].guns_share_of_the_killing_in_100).padStart(5) + '  ' + out[k].name));
  if (argv.includes('--write')) { const b = JSON.parse(fs.readFileSync(OUT, 'utf8')); b.search = { fights_per_cell: N, setting: 'start', rows: out }; fs.writeFileSync(OUT, JSON.stringify(b, null, 1) + '\n'); console.log('search written into ' + path.relative(ROOT, OUT)); }
}

async function main() {
  const argv = process.argv;
  if (argv[2] === '--cell') {
    const C = JSON.parse(argv[3]), strikes = JSON.parse(fs.readFileSync(argv[5], 'utf8'));
    process.stdout.write(JSON.stringify(await cell(C, Number(argv[4]), strikes)));
    return;
  }
  const strikes = GRID.wikiStrikes(Object.keys(GRID.BEASTS));
  if (argv.includes('--search')) return search(strikes, argv);
  const card = cardRows(await engine(strikes));
  const pad = (s, n) => String(s === null ? '-' : s).padStart(n);
  console.log('THE CARD (the fight\'s own hitChance and resolveAttack; average starting man ranged ' + card.average_ranged_skill + ' against a thug, defence 0)');
  console.log('row'.padEnd(26) + 'reach  shots/turn  hit at 1   2   3   4   6 | no armour  light  heavy (hp a hit) | hits to drop a thug none/light/heavy');
  card.rows.forEach(r => {
    const h = r.hit['average|thug'];
    console.log(r.name.padEnd(26) + pad(r.reach, 5) + pad(r.shots_a_turn, 8) + '      ' + [0, 1, 2, 3, 5].map(i => pad(h[i], 3)).join(' ') + ' |'
      + pad(r.dmg.none.hp, 9) + pad(r.dmg.light.hp, 7) + pad(r.dmg.heavy.hp, 7) + '              | ' + [r.to_drop.none, r.to_drop.light, r.to_drop.heavy].join(' / '));
  });
  if (argv.includes('--card')) return;
  const arg = (k, d) => { const i = argv.indexOf(k); return i > 0 ? argv[i + 1] : d; };
  const N = Number(arg('--n', 200)), JOBS = Number(arg('--jobs', 4));
  const sfile = path.join(require('os').tmpdir(), 'bohemia_guns_strikes_' + process.pid + '.json');
  fs.writeFileSync(sfile, JSON.stringify(strikes));
  const onlyKit = arg('--only-kit', null);
  const work = cells().filter(w => !onlyKit || w.kit === onlyKit), results = {};
  let next = 0, running = 0; const t0 = Date.now();
  await new Promise(done => {
    const pump = () => {
      while (running < JOBS && next < work.length) {
        const w = work[next++]; running++;
        cp.execFile(process.execPath, [__filename, '--cell', JSON.stringify(w), String(N), sfile], { maxBuffer: 1 << 26 }, (err, out) => {
          running--;
          if (err) { console.error('cell failed', JSON.stringify(w), err.message); process.exit(1); }
          results[key(w)] = Object.assign({ kind: w.kind, company: w.company, enemies: w.enemies, kit: w.kit, setting: w.setting }, feltGuns(JSON.parse(out)));
          if ((next % 24) === 0) process.stderr.write(next + '/' + work.length + ' ' + Math.round((Date.now() - t0) / 1000) + 's\n');
          if (next >= work.length && running === 0) done(); else pump();
        });
      }
    };
    pump();
  });
  fs.unlinkSync(sfile);
  KINDS.forEach(kd => SETS.forEach(s => {
    console.log('\n' + kd.toUpperCase() + ' / ' + s + '   won in 100 | men down a fight | guns\' share of the killing');
    console.log('cell'.padEnd(8) + KIT_ORDER.concat('allguns').map(k => k.padStart(16)).join(''));
    COMPANIES.forEach(c => COUNTS.forEach(e => {
      console.log((c + 'v' + e).padEnd(8) + KIT_ORDER.concat('allguns').map(k => {
        const r = results[key({ kind: kd, company: c, enemies: e, kit: k, setting: s })];
        return (r ? r.won_in_100 + '|' + r.your_men_struck_down_per_fight + '|' + (r.guns_share_of_the_killing_in_100 === null ? '-' : r.guns_share_of_the_killing_in_100) : '').padStart(16);
      }).join(''));
    }));
  }));
  console.log('\n' + work.length + ' cells x ' + N + ' fights in ' + Math.round((Date.now() - t0) / 1000) + ' s');
  if (argv.includes('--write') && onlyKit) {
    const b = JSON.parse(fs.readFileSync(OUT, 'utf8'));
    Object.assign(b.cells, results); b.kits = KITS;
    fs.writeFileSync(OUT, JSON.stringify(b, null, 1) + '\n');
    console.log('merged ' + Object.keys(results).length + ' ' + onlyKit + ' cells into ' + path.relative(ROOT, OUT));
  } else if (argv.includes('--write')) {
    fs.writeFileSync(OUT, JSON.stringify({
      _readme: 'TUNING [the first kit is guns] 10/19 (rule 120(a), rule 117, rule 38g research only). draft:true. NOTHING IN THE GAME READS THIS FILE. '
        + 'The card is the live fight\'s own hitChance() and resolveAttack() on a flat lit board; the cells are fights of the live fight (slices/BOHEMIA_FIGHT.html, '
        + 'headless, AUTO on both sides) with one line spliced into the memory copy so a row carrying per_tile/base_bonus uses them, seeded 9000+k so every kit '
        + 'and setting meets the same fights. The draft rows are proposals for COMBAT. Key: kind|company|enemies|kit|setting.',
      draft: true, schema: 1, fights_per_cell: N, splice: ROW_SPLICE.trim(),
      draft_rows: DRAFT, kits: KITS, slots: SLOTS, all_guns: ALL_GUNS, settings: GRID.SETTINGS.filter(s => SETS.indexOf(s.id) >= 0).map(s => ({ id: s.id, name: s.name, levers: s.L })),
      shooters: SHOOTERS, targets: TARGETS, armours: ARMOURS, card: card, cells: results
    }, null, 1) + '\n');
    console.log('wrote ' + path.relative(ROOT, OUT));
  }
}
if (require.main === module) main().catch(e => { console.error(e); process.exit(1); });
module.exports = { DRAFT, KITS, SLOTS, engine, cell, cardRows, kitCompany };
