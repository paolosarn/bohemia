#!/usr/bin/env node
// TUNING [the one table seeded] 10/17 -- RESEARCH INSTRUMENT, NOT A GATE (rule 38g, rule 88: a page, no sheet).
// THE BIG SWING (rule 110, TUNING's MODE line): the one numbers table seeded with EVERY felt number read from the
// fight file, each with its source. Rule 21 (fight-gets-deep law s4): every number a player feels in ONE table.
//
// It reads the rebuilt fight (slices/BOHEMIA_FIGHT.html, rule 63) and the data folder (records/target/bb/) and writes
//   banks/BOHEMIA_TUNING_THE_ONE_TABLE_SEED_10_17_26.json   draft:true, NOTHING IN THE GAME READS IT
//   records/BOHEMIA_TUNING_THE_ONE_TABLE_10_17_26.md         the same table as a page the building lanes cite
// Four kinds of row:
//   rule     a number the fight-rules script reads through R('key') (resolved against rules/ours/ai.json; the value,
//            the source and whether a verbatim quote sits beside it are the table's, the FEEL line is this lane's)
//   column   a field of a data file the fight reads off every row (a weapon's damage_min, an enemy's hp): the table
//            holds the column once, with the file, the row count and the file's own source line
//   typed    a felt number typed into a script instead of read from the table (the escapes; owner named)
//   ruled    a number that has a ruling or a wiki source in the data but NOTHING reads it yet (the table holds it so
//            nobody re-invents it; the gap is named)
// Writes nothing unless --write. Prints the counts either way.
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), BB = path.join(ROOT, 'records/target/bb');
const FIGHT = path.join(ROOT, 'slices/BOHEMIA_FIGHT.html');
const html = fs.readFileSync(FIGHT, 'utf8');
const J = f => JSON.parse(fs.readFileSync(path.join(BB, f), 'utf8'));
const DB = { rules: J('rules.json'), ours: J('ours.json'), ai: J('ai.json') };
const DATA = {};
for (const f of ['weapons', 'armor', 'enemies', 'perks', 'injuries', 'backgrounds', 'perk_translation']) DATA[f] = J(f + '.json');

function lookup(p) {
  const parts = p.split('.');
  let node = parts[0] === 'ours' ? DB.ours : parts[0] === 'ai' ? DB.ai : DB.rules;
  const walk = (parts[0] === 'ours' || parts[0] === 'ai') ? parts.slice(1) : parts;
  for (const k of walk) node = node ? node[k] : undefined;
  return (node && 'value' in node && node.value !== null) ? node : null;
}
const kind = s => !s ? 'NO SOURCE' : /bb_all|Combat_Mechanics|CORE_WIKITEXT|wiki/i.test(s) ? 'wiki' : /GROK_/.test(s) ? 'grok' : /laws\/|VAMILY/.test(s) ? 'ruling' : /records\/|slices\//.test(s) ? 'record' : 'other';

/* ---------- the FEEL line per key: what the player feels, plain words (this lane's words, rule 21) ---------- */
const FEEL = {
  'morale.states': 'the seven moods a man can be in, from Unbreakable down to Fleeing',
  'parsed.hit_roll_die': 'every swing rolls one die of this many faces against the hit chance',
  'board.height_levels': 'how many steps of height a board can have (a roof is one up)',
  'ap.move_cost.murky_water_swamp': 'a step through water costs this much of your turn',
  'ap.move_cost.rough': 'a step over rubble or rough ground costs this much of your turn',
  'ap.move_cost.flat': 'a plain step costs this much of your turn',
  'ap.move_cost.height_change_extra': 'climbing or dropping a level adds this to the step',
  'board.vision_default': 'how many tiles a man sees by default',
  'hit_chance.night.nighttime_status': 'what the dark takes off you: sight, aim, and how hard you are to shoot',
  'board.vision_floor': 'nobody sees less than this many tiles',
  'ours.gun_classes': 'which weapon rows count as a gun in his hands (a gun holds no ring, rule 103)',
  'ap.strike_cost.one_handed': 'a swing with a one-handed weapon costs this much of your turn',
  'ap.strike_cost.two_handed': 'a swing with a two-handed weapon costs this much of your turn',
  'morale.default_state': 'the mood a man starts the fight in',
  'ours.weapon_rows': 'which Battle Brothers weapon row stands under each of our weapons (pistol = dagger)',
  'parsed.brother_xp': 'how much a man is worth to morale checks when he dies or runs: base plus per level',
  'ours.perk_builds': 'the perk build each job picks from as it levels',
  'ours.people_looks': 'which body art each man wears on the board',
  'ap.per_turn': 'how many action points a man gets each turn',
  'ours.enemy_tiers': 'how the enemy crews get better by the day of the campaign (early, middle, late)',
  'ours.first_band': 'the first crew you meet on the road',
  'ours.board_mix': 'which block families a board is cut from (mostly city)',
  'ours.night_lights': 'a lit tile at night plays as day',
  'ours.start_cols': 'the columns the two lines start on',
  'ours.board_tiles': 'the full board, in house tiles (wide, deep)',
  'ours.night': 'whether a fight is at night by default',
  'ours.crew': 'your starting crew, name by name, with their jobs',
  'ours.field_size': 'how many of your men stand on the field in a normal fight',
  'ours.board_fit': 'the board is cut to the parties: this much margin, and this many parties makes it big',
  'deployment.min_gap_between_lines_hexes': 'the tiles of empty ground between the two lines at the start',
  'ours.formation': 'how many men fit in one row of the formation',
  'ours.formation_depth_lines': 'how many rows deep the formation stands',
  'fatigue.recovery_per_turn': 'how much breath a man gets back each turn',
  'initiative_and_turn_order.wait_penalty_next_round': 'waiting this turn makes you slower next turn, by this fraction',
  'initiative_and_turn_order.adrenaline': 'adrenaline puts you first in the next turn',
  'initiative_and_turn_order.fleeing_turn_order': 'a fleeing man acts last',
  'parsed.morale_stop_fleeing': 'each round a man runs, he gets this much likelier to stop running',
  'zone_of_control.height_gap_breaks_zoc_levels': 'a man this many levels above or below you holds no ring over you',
  'zone_of_control.radius_hexes': 'THE RING: a melee man holds the tiles this far around him (rule 103: melee only, one tile)',
  'morale.state_multipliers': 'what each mood does to skill and defence (confident is better, wavering is worse)',
  'hit_chance.defense_soft_cap': 'defence over this number counts half',
  'ours.cover_tile_blocks_line': 'whether a cover tile blocks a shot through it',
  'hit_chance.height.melee_max_height_gap': 'how many levels up or down a melee weapon can still reach',
  'hit_chance.height.ranged_range_per_level': 'each level above the target adds this many tiles of reach to a gun',
  'ours.gun_min_range': 'a gun never fires at a man closer than this (rule 83: guns two tiles)',
  'hit_chance.terrain_swamp': 'standing in water cuts your skill and defence by these fractions',
  'hit_chance.surround.backstabber': 'with Backstabber, each extra man around the target adds this much to hit',
  'hit_chance.surround.per_extra_adjacent': 'each extra man around the target adds this much to hit',
  'hit_chance.night.multiplier': 'a shot into or out of the dark is this much as likely to land',
  'hit_chance.ranged.distance.crossbow_shoot_bolt': 'a crossbow (our rifle) loses this much to hit per tile, from this base',
  'parsed.handgonne': 'a handgonne (our shotgun) loses this much per tile, from this base, and ignores the line of fire',
  'parsed.throw_axe': 'a thrown weapon loses this much per tile, from this base, after this many free tiles',
  'hit_chance.ranged.distance.bow_quick_shot': 'a bow loses this much to hit per tile',
  'hit_chance.ranged.cover_bullseye': 'with Bullseye, a man behind cover is only this much harder to shoot',
  'hit_chance.ranged.cover_line_of_fire_blocked': 'a man behind another man or cover is this much harder to shoot',
  'hit_chance.height.higher_attacker_bonus': 'shooting or swinging from above adds this much to hit',
  'hit_chance.height.lower_attacker_penalty': 'swinging from below takes this much off',
  'hit_chance.cap': 'no swing is ever surer than the max or hopeless past the min',
  'ours.cover_defence': 'each piece of cover beside the target adds this much defence, up to this many pieces',
  'head_and_critical.base_head_chance_pct': 'how often a hit lands on the head',
  'damage.remaining_armor_reduction': 'every point of armour left takes this much off the damage that gets through',
  'head_and_critical.head_damage_multiplier': 'a head hit does this much more damage',
  'fatigue.on_dodge_or_block': 'dodging or blocking a swing costs this much breath',
  'fatigue.on_struck_by_mace': 'a mace hit takes this much breath (one-handed, two-handed)',
  'fatigue.on_struck': 'any hit takes this much breath',
  'parsed.morale_struck': 'a hit of this many points or more makes a man check his nerve, worse the more blood he has lost',
  'injuries_and_death.temp_injury_min_damage': 'a hit under this many points can never injure',
  'injuries_and_death.temp_injury_multipliers': 'what makes an injury easier to give or take (Crippling Strikes, Iron Jaw, a head hit)',
  'ours.main_character_dies': 'THE MAIN CHARACTER NEVER DIES: struck down, he is only down',
  'ours.struck_down_death_chance': 'THE DEATH ROLL: a man struck down dies this often, else a long injury',
  'ours.struck_down_laid_up_days': 'THE LONG INJURY: a man struck down who lives is out this many game days',
  'ours.struck_down_injury': 'which list the long injury is drawn from (the wiki permanent marks), and that it lasts the laid-up days',
  'experience.kill_split': 'how a kill\'s experience is split between the killer and the rest of the party',
  'experience.global_modifier': 'all experience is cut by this fraction',
  'experience.level_table_total_xp': 'how much experience each level costs',
  'morale.distance_tables': 'how fast a death nearby stops mattering with distance',
  'parsed.morale_ally_dies': 'how hard an ally\'s death hits a man\'s nerve, less for a green ally, less with distance',
  'parsed.morale_ally_flees': 'how hard an ally running hits a man\'s nerve',
  'parsed.morale_enemy_dies': 'how much an enemy\'s death lifts a man, more for the killer',
  'ours.captain_aura': 'the captain lifts the nerve of every man within this many tiles by this much',
  'morale.check_modifiers.allies_adjacent': 'each friend beside you steadies you by this much',
  'morale.check_modifiers.enemies_adjacent': 'each enemy beside you shakes you by this much',
  'morale.check.cap': 'a nerve check never passes surer than the max or fails surer than the min',
  'morale.check.step': 'a failed check drops the mood this many steps',
  'morale.rally.rally_the_troops': 'Rally the Troops: its cost, its reach, and how much it lifts',
  'morale.check_triggers.brother_at_map_edge': 'a man at the edge of the board breaks',
  'ai.tactics.avoid_surround': 'the enemy brains avoid being surrounded',
  'ours.beat_bpm': 'the beat every animation and every turn lands on',
};
/* Battle Brothers' own difficulty moves these (records/BOHEMIA_TUNING_THE_DIFFICULTY_STEPS_EXACTLY_10_9_26.md) */
const BB_DIFFICULTY_MOVES = { 'experience.global_modifier': 'Beginner +10% XP', 'hit_chance.cap': 'the hit roll is +-5 by combat difficulty (the roll, not the cap)' };

/* ---------- the rules script, with the enclosing function of each key's first read ---------- */
const sm = html.match(/<script id="fight-rules">([\s\S]*?)<\/script>/);
if (!sm) { console.log('NO fight-rules SCRIPT'); process.exit(1); }
const rules = sm[1], lines = rules.split('\n');
const fnAt = []; let cur = '(top)';
lines.forEach((l, i) => { const m = l.match(/^\s{0,4}function\s+([A-Za-z0-9_]+)\s*\(/) || l.match(/^\s{0,4}(?:const|let|var)\s+([A-Za-z0-9_]+)\s*=\s*function/); if (m) cur = m[1]; fnAt[i] = cur; });
const firstUse = {}, uses = {};
lines.forEach((l, i) => { for (const m of l.matchAll(/\bR\(\s*'([A-Za-z0-9_.]+)'\s*\)/g)) { const k = m[1]; uses[k] = (uses[k] || 0) + 1; if (!firstUse[k]) firstUse[k] = { line: i + 1, fn: fnAt[i] }; } });
const allKeys = [...new Set([...html.matchAll(/\bR\(\s*'([A-Za-z0-9_.]+)'\s*\)/g)].map(m => m[1]))].filter(k => k !== 'a.b.c');

const rows = [];
for (const k of allKeys) {
  const n = lookup(k);
  rows.push({
    kind: 'rule', id: k, value: n ? n.value : null, unit: unitOf(k, n ? n.value : null),
    feel: FEEL[k] || 'FEEL LINE MISSING',
    source: n ? n.source : 'MISSING', source_kind: n ? kind(n.source) : 'MISSING', quote: !!(n && n.quote),
    read_at: firstUse[k] ? 'fight-rules ' + firstUse[k].fn + '() line ' + firstUse[k].line : 'outside fight-rules',
    reads: uses[k] || 0,
    owner: n && /ours\./.test(k) ? 'paolo (the ruling) / tuning holds the row' : 'tuning (a Battle Brothers number; changing it is our twist and is said)',
    bb_difficulty_moves: BB_DIFFICULTY_MOVES[k] || null,
    status: 'live',
  });
}
function unitOf(k, v) {
  if (Array.isArray(v) || (v && typeof v === 'object')) return 'table';
  if (/_pct|chance_pct/.test(k)) return 'percent';
  if (/ap\.|strike_cost|move_cost|per_turn/.test(k)) return 'action points';
  if (/fatigue\./.test(k)) return 'fatigue';
  if (/days/.test(k)) return 'game days';
  if (/chance|multiplier|modifier|split|cover_|per_hex|falloff/.test(k)) return typeof v === 'number' && Math.abs(v) <= 1 ? 'fraction' : 'percent points';
  if (/tiles|hexes|radius|range|vision|gap|levels|cols|depth|size|slots/.test(k)) return 'tiles';
  if (/xp|experience/.test(k)) return 'experience';
  if (/bpm/.test(k)) return 'beats a minute';
  if (/morale|resolve/.test(k)) return 'nerve points';
  if (typeof v === 'boolean') return 'on/off';
  if (Array.isArray(v) || (v && typeof v === 'object')) return 'table';
  return 'count';
}

/* ---------- the columns the fight reads off data rows ---------- */
const tok = new Set([...rules.matchAll(/\.([a-z_][a-z0-9_]*)\b/g)].map(m => m[1]));
const COLS = {
  weapons: { rows: DATA.weapons.rows, about: DATA.weapons._about, fields: ['damage_min', 'damage_max', 'armor_damage_pct', 'armor_ignore_pct', 'durability', 'fatigue', 'hands', 'head_hit_chance', 'range', 'range_min', 'range_max', 'class', 'ammo', 'skills'] },
  armor: { rows: [].concat(DATA.armor.body || [], DATA.armor.head || [], DATA.armor.shields || []), about: DATA.armor._about, fields: ['durability', 'fatigue', 'value', 'melee_defense', 'ranged_defense'] },
  enemies: { rows: DATA.enemies.rows, about: DATA.enemies._about, fields: ['hp', 'fatigue', 'resolve', 'initiative', 'melee_skill', 'ranged_skill', 'melee_defense', 'ranged_defense', 'ap', 'armor_head', 'armor_body', 'xp', 'perks', 'gear', 'skills'] },
  perks: { rows: DATA.perks.rows, about: DATA.perks._about, fields: ['numbers', 'tier'] },
  injuries: { rows: DATA.injuries.rows, about: DATA.injuries._about, fields: ['threshold_pct_of_max_hp', 'effects', 'kind', 'damage_type', 'body_part'] },
  backgrounds: { rows: DATA.backgrounds.rows, about: DATA.backgrounds._about, fields: ['stats', 'starting_level'] },
};
const COLFEEL = {
  'weapons.damage_min': 'the least a weapon does on a hit', 'weapons.damage_max': 'the most a weapon does on a hit',
  'weapons.armor_damage_pct': 'how much of the hit goes into the armour', 'weapons.armor_ignore_pct': 'how much of the hit goes straight through the armour',
  'weapons.durability': 'how many hits a weapon takes before it breaks', 'weapons.fatigue': 'how much breath a weapon costs to carry',
  'weapons.hands': 'one hand or two (sets the swing cost)', 'weapons.head_hit_chance': 'how much likelier this weapon hits the head',
  'weapons.range': 'how far it reaches', 'weapons.range_min': 'the closest it can hit', 'weapons.range_max': 'the farthest it can hit',
  'weapons.class': 'which kind of weapon it is (dagger, mace, bow...): the kind sets the ring, the reach rule and the injury type',
  'weapons.ammo': 'how many shots it carries', 'weapons.skills': 'the strikes it offers, each with its cost and breath',
  'armor.durability': 'how many points of armour a piece has', 'armor.fatigue': 'how much breath the piece costs to wear',
  'armor.value': 'what the piece is worth', 'armor.melee_defense': 'a shield\'s melee defence', 'armor.ranged_defense': 'a shield\'s ranged defence',
  'enemies.hp': 'an enemy\'s hit points', 'enemies.fatigue': 'an enemy\'s breath', 'enemies.resolve': 'an enemy\'s nerve', 'enemies.initiative': 'how early an enemy acts',
  'enemies.melee_skill': 'how well an enemy swings', 'enemies.ranged_skill': 'how well an enemy shoots', 'enemies.melee_defense': 'how hard an enemy is to hit up close',
  'enemies.ranged_defense': 'how hard an enemy is to shoot', 'enemies.ap': 'an enemy\'s action points a turn', 'enemies.armor_head': 'an enemy\'s helmet', 'enemies.armor_body': 'an enemy\'s body armour',
  'enemies.xp': 'what an enemy is worth in experience and to morale', 'enemies.perks': 'an enemy\'s perks', 'enemies.gear': 'what an enemy carries', 'enemies.skills': 'the strikes an enemy has',
  'perks.numbers': 'every perk\'s own numbers (Colossus +hp, Steel Brow, Nine Lives, Fearsome...)', 'perks.tier': 'which row of the tree a perk sits in',
  'injuries.threshold_pct_of_max_hp': 'how big a hit, as a share of max hp, gives this injury', 'injuries.effects': 'what the injury does to each stat (the pain line)',
  'injuries.kind': 'temporary or permanent', 'injuries.damage_type': 'which weapon kinds give it', 'injuries.body_part': 'head or body',
  'backgrounds.stats': 'the stat ranges a man of this background rolls', 'backgrounds.starting_level': 'the level a man of this background starts at',
};
for (const [file, c] of Object.entries(COLS)) {
  for (const f of c.fields) {
    const read = tok.has(f);
    const filled = c.rows.filter(r => r && r[f] !== null && r[f] !== undefined && !(Array.isArray(r[f]) && !r[f].length)).length;
    rows.push({ kind: 'column', id: file + '.' + f, value: '(one per row)', unit: unitOf(f, null), feel: COLFEEL[file + '.' + f] || 'FEEL LINE MISSING',
      source: 'records/target/bb/' + file + '.json (every row names its wiki page)', source_kind: 'wiki', quote: true,
      read_at: read ? 'fight-rules, by field name' : 'NOT READ BY NAME in fight-rules', reads: read ? 1 : 0,
      rows_in_file: c.rows.length, rows_filled: filled, owner: 'tuning (the wiki\'s per-row numbers; MODS\' file)', bb_difficulty_moves: null, status: read ? 'live' : 'in the file, unread' });
  }
}

/* ---------- the typed escapes: felt numbers typed into a script, not read from the table ---------- */
const draw = (html.match(/<script id="fight-draw">([\s\S]*?)<\/script>/) || [, ''])[1];
function constIn(src, name) { const m = src.match(new RegExp('\\b' + name + '\\s*=\\s*([0-9.]+)')); return m ? +m[1] : null; }
const roster = fs.existsSync(path.join(ROOT, 'slices/BOHEMIA_ROSTER_SCREEN.html')) ? fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_ROSTER_SCREEN.html'), 'utf8') : '';
const clinic = roster.match(/function clinicPrice\(m\)\{[^}]*\}/);
const TYPED = [
  { id: 'input.hold_ms', value: constIn(html, 'HOLD_MS'), unit: 'milliseconds', feel: 'how long you hold a finger on a man before his weapon card opens', where: 'slices/BOHEMIA_FIGHT.html fight-draw const HOLD_MS', owner: 'combat (input; UI\'s thumb law)' },
  { id: 'look.man_of_tile', value: constIn(html, 'MAN_OF_TILE'), unit: 'fraction of a tile', feel: 'how tall a man stands against a house tile', where: 'slices/BOHEMIA_FIGHT.html fight-draw const MAN_OF_TILE', owner: 'combat (presentation; the ground-may-zoom law)' },
  { id: 'look.man_idle_px', value: constIn(html, 'MAN_IDLE'), unit: 'pixels', feel: 'how tall a man is on the glass at the idle stop', where: 'slices/BOHEMIA_FIGHT.html fight-draw const MAN_IDLE', owner: 'combat (presentation; rule 21 one pixel size)' },
  { id: 'clinic.base_price', value: 20, unit: 'crowns per day', feel: 'what the clinic charges per laid-up day to halve the days', where: 'slices/BOHEMIA_ROSTER_SCREEN.html clinicPrice()' + (clinic ? ' (typed: ' + clinic[0].replace(/\s+/g, ' ').slice(0, 110) + ')' : ' (not found)'), owner: 'economy / run two (the roster and the clinic)', bb: 'injuries.json rules.temporary_healing.base_wound_treatment_price = 20, bb_all/1936_Temporary Injuries.txt' },
  { id: 'clinic.per_level_price_factor', value: 0.2, unit: 'fraction per level', feel: 'the clinic charges this much more for each level a man has', where: 'slices/BOHEMIA_ROSTER_SCREEN.html clinicPrice()', owner: 'economy / run two', bb: 'injuries.json rules.temporary_healing.per_level_price_factor = 0.2' },
  { id: 'clinic.halves_days', value: 0.5, unit: 'fraction', feel: 'THE CLINIC\'S HALVING: treatment cuts the laid-up days in half', where: 'slices/BOHEMIA_ROSTER_SCREEN.html (the word "halves" in the roster\'s line; no reader of the 0.5 row)', owner: 'economy / run two', bb: 'injuries.json rules.temporary_healing.treatment_heal_time_multiplier = 0.5, bb_all/1936_Temporary Injuries.txt' },
  { id: 'money.crowns_per_battery', value: 10, unit: 'crowns', feel: 'ten of the wiki\'s crowns make one battery', where: 'slices/BOHEMIA_ROSTER_SCREEN.html clinicPrice() "/ 10" (and the settlement screen, GROK_33)', owner: 'economy', bb: 'origins.json carries both; records/BOHEMIA_MODS_THE_DATA_SCHEMA_10_9_26.md' },
];
for (const t of TYPED) rows.push({ kind: 'typed', id: t.id, value: t.value, unit: t.unit, feel: t.feel, source: t.bb ? 'the wiki number exists in the data: ' + t.bb : 'no source but the code', source_kind: t.bb ? 'wiki (unread)' : 'NO SOURCE', quote: false, read_at: t.where, reads: 0, owner: t.owner, bb_difficulty_moves: null, status: 'typed, not read from the table' });

/* ---------- ruled or sourced, read by nothing in the fight ---------- */
const RULED = [
  { id: 'ours.veteran_death_chance', feel: 'A VETERAN DIES LESS: a man of about twenty fights struck down dies this often instead of the death roll', gap: 'the fight-rules script reads ours.struck_down_death_chance only; the veteran row is read by engine/bohemia_long_injury.js (PEOPLE) and never by the fight, so in the demo\'s fight a veteran still dies at the full roll' },
  { id: 'injuries_and_death.struck_down_survival_chance', feel: 'BATTLE BROTHERS\' OWN DEATH ROLL beside ours: a man at 0 hp lives 33 in 100 (ours: 80 in 100)', gap: 'beside the ruling as the thing we changed: the wiki kills 67 of 100 struck-down men, his rule kills 20' },
  { id: 'injuries_and_death.struck_down_survivor_trait', feel: 'with the Survivor trait a Battle Brothers man lives 90 in 100', gap: 'no trait of ours moves the death roll yet; his fifth vote (rule 56) wants it to move by marks carried: base 0.20 + 0.05 per mark' },
  { id: 'injuries_and_death.struck_down_impossible_if', feel: 'when a struck-down man cannot live at all (a fatality, retreating, self-inflicted)', gap: 'the fight has no fatality, retreat or bleed death yet, so the list has nothing to bite on' },
  { id: 'injuries_and_death.temp_injury_threshold_range', feel: 'every injury\'s threshold sits between a quarter and six tenths of max hp', gap: 'the per-row thresholds are read; the range is the wiki\'s statement of their bounds' },
  { id: 'zone_of_control.who_exerts', feel: 'BATTLE BROTHERS\' OWN RING beside ours: there, everyone who fights with a melee weapon, bare fists or as a beast holds a ring', gap: 'ours (rule 103) is narrower: a gun in the hands holds none, whatever row sits under it (the pistol is a dagger underneath and still holds none)' },
  { id: 'zone_of_control.no_zoc', feel: 'who holds no ring in Battle Brothers: a ranged user, a fleeing man, a stunned one, an entangled one...', gap: 'the fight checks Fleeing, stunned, ranged and gun; entangled, horrified and sleeping do not exist in our fight yet' },
  { id: 'zone_of_control.free_attacks_on_leave', feel: 'walking out of a ring gives every man holding it a free swing, at no breath', gap: 'LIVE in the fight (moveTo: each ring-holder swings once as you step out; a hit holds you) but the row itself is not read: the free swing costs 0 fatigue by the code\'s own shape, not by the row' },
  { id: 'zone_of_control.leave_resolution', feel: 'if every free swing misses you leave; if any lands you stay and must try again', gap: 'LIVE in the fight (held = true on a hit) as code, not as a row read' },
  { id: 'zone_of_control.bypass', feel: 'Footwork and Rotation let a man leave a ring without the free swings', gap: 'Footwork is live (skillTargets footwork); the row naming the two is not read' },
  { id: 'morale.check.skipped_over_500', feel: 'a nerve check with a modifier past this number is skipped (never rolled)', gap: 'not read; the fight caps the check at 0 to 95 instead' },
];
for (const r of RULED) {
  const n = lookup(r.id);
  rows.push({ kind: 'ruled', id: r.id, value: n ? n.value : null, unit: unitOf(r.id, n ? n.value : null), feel: r.feel, source: n ? n.source : 'MISSING', source_kind: n ? kind(n.source) : 'MISSING', quote: !!(n && n.quote), read_at: 'NOT READ by fight-rules', reads: 0, owner: /ours\./.test(r.id) ? 'paolo (the ruling) / tuning holds the row' : 'tuning (Battle Brothers\' own, kept beside ours)', bb_difficulty_moves: null, status: 'in the table, unread by the fight', gap: r.gap });
}
/* the eleven permanent marks: the pain line's effect on each stat, one row each (the injury table row) */
for (const j of DATA.injuries.rows.filter(x => x.kind === 'permanent')) {
  rows.push({ kind: 'column', id: 'injuries.permanent.' + j.id, value: j.effects, unit: 'percent per stat', feel: 'THE PAIN LINE of ' + j.name + ': ' + (j.effects_text || []).join('; '), source: j.source, source_kind: 'wiki', quote: true, read_at: 'fight-rules fall() draws one of these eleven, each as likely; the roster shows the line', reads: 1, owner: 'tuning (the wiki\'s mark; PEOPLE owns the man)', bb_difficulty_moves: null, status: 'live' });
}

/* ---------- counts and the write ---------- */
const by = {}; rows.forEach(r => by[r.kind] = (by[r.kind] || 0) + 1);
const missingFeel = rows.filter(r => /FEEL LINE MISSING/.test(r.feel)).map(r => r.id);
const unresolved = rows.filter(r => r.kind === 'rule' && r.value === null).map(r => r.id);
const summary = { rows: rows.length, by_kind: by, rule_keys_read: allKeys.length, unresolved, feel_lines_missing: missingFeel,
  typed_escapes: rows.filter(r => r.kind === 'typed').length, unread_rows: rows.filter(r => r.kind === 'ruled').length,
  columns_unread_by_name: rows.filter(r => r.kind === 'column' && r.reads === 0).map(r => r.id) };
console.log('THE ONE TABLE SEED: ' + JSON.stringify(summary));
if (process.argv.includes('--write')) {
  const out = {
    _readme: 'TUNING [the one table seeded] 10/17 (rule 110 big swing; rule 21 one numbers table; rule 38g research only; rule 88 a page, no sheet). draft:true. NOTHING IN THE GAME READS THIS FILE. Every felt number the rebuilt fight (slices/BOHEMIA_FIGHT.html) reads, with its source, plus the columns it reads off the data files, the numbers typed into scripts instead (typed), and the rulings and wiki rows nothing reads yet (ruled). Regenerate: node tools/bohemia_tuning_one_table_seed.js --write. Record: records/BOHEMIA_TUNING_THE_ONE_TABLE_SEEDED_FROM_THE_FIGHT_FILE_10_17_26.md',
    draft: true, schema: 1, generated_from: { fight: 'slices/BOHEMIA_FIGHT.html', data: 'records/target/bb/' },
    fields: { kind: 'rule | column | typed | ruled', id: 'the R() key, or file.field, or the typed name', value: 'as the table holds it', unit: 'what it counts', feel: 'what the player feels, plain words (TUNING)', source: 'the wiki page, the law, or the record', source_kind: 'wiki | ruling | record | grok | NO SOURCE', quote: 'a verbatim quote sits beside the value', read_at: 'where the fight reads it', reads: 'how many reads in fight-rules', owner: 'who may change it', bb_difficulty_moves: 'what Battle Brothers\' own difficulty does to it', status: 'live | typed | unread', gap: 'why a ruled row is not felt yet' },
    summary, rows,
  };
  fs.writeFileSync(path.join(ROOT, 'banks/BOHEMIA_TUNING_THE_ONE_TABLE_SEED_10_17_26.json'), JSON.stringify(out, null, 1) + '\n');
  const md = [];
  md.push('# THE ONE NUMBERS TABLE, SEEDED FROM THE FIGHT FILE (TUNING, 10/17/26; generated by tools/bohemia_tuning_one_table_seed.js --write)');
  md.push('# Rule 21 (fight-gets-deep law s4): every number a player feels in ONE table with its reason and source. Rule 110: the big swing. Rule 38g and 88: research, a page, no sheet.');
  md.push('# Read from slices/BOHEMIA_FIGHT.html and records/target/bb/. The bank holding the same rows: banks/BOHEMIA_TUNING_THE_ONE_TABLE_SEED_10_17_26.json (draft:true, nothing reads it).');
  md.push('# ' + rows.length + ' rows: ' + Object.entries(by).map(e => e[1] + ' ' + e[0]).join(', ') + '. Unresolved keys: ' + unresolved.length + '. Feel lines missing: ' + missingFeel.length + '.');
  md.push('');
  const v = x => { const s = typeof x === 'string' ? x : JSON.stringify(x); return (s || '').replace(/\|/g, '/').replace(/\n/g, ' ').slice(0, 70) + ((s || '').length > 70 ? '...' : ''); };
  for (const k of ['rule', 'column', 'typed', 'ruled']) {
    const title = { rule: 'A. THE RULES THE FIGHT READS THROUGH R() (' + by[k] + ')', column: 'B. THE COLUMNS THE FIGHT READS OFF EVERY DATA ROW, AND THE ELEVEN MARKS (' + by[k] + ')', typed: 'C. FELT NUMBERS TYPED INTO A SCRIPT, NOT READ FROM THE TABLE (' + by[k] + ')', ruled: 'D. IN THE TABLE, READ BY NOTHING IN THE FIGHT: RULINGS AND BATTLE BROTHERS\' OWN RULE BESIDE OURS (' + by[k] + ')' }[k];
    md.push('## ' + title); md.push('');
    md.push('| id | value | unit | what you feel | source | read at | owner | status |'); md.push('|---|---|---|---|---|---|---|---|');
    for (const r of rows.filter(x => x.kind === k)) md.push('| ' + [r.id, v(r.value), r.unit, r.feel + (r.gap ? ' GAP: ' + r.gap : ''), v(r.source) + (r.quote ? ' (quoted)' : ''), r.read_at, r.owner, r.status].map(s => String(s).replace(/\|/g, '/')).join(' | ') + ' |');
    md.push('');
  }
  fs.writeFileSync(path.join(ROOT, 'records/BOHEMIA_TUNING_THE_ONE_TABLE_10_17_26.md'), md.join('\n') + '\n');
  console.log('wrote banks/BOHEMIA_TUNING_THE_ONE_TABLE_SEED_10_17_26.json and records/BOHEMIA_TUNING_THE_ONE_TABLE_10_17_26.md');
}
