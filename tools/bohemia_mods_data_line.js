#!/usr/bin/env node
/* ============================================================================
   BOHEMIA -- MODS: THE DATA LINE, EVERY CONTENT KIND ON ONE PAGE (MODS lane, 10/17/26)
   The big swing of rule 110 for lane 22 (research only, rule 38g): every kind of
   content a modder could reasonably want to change, with WHERE IT LIVES TODAY,
   what a modder edits there, who reads it live, whether an example mod exists,
   and how you see your change. Measured from the repo, never typed, so the page
   cannot disagree with the files: re-run the tool and it rewrites itself.

   Usage: node tools/bohemia_mods_data_line.js            prints the page
          node tools/bohemia_mods_data_line.js --write    writes the record page
          node tools/bohemia_mods_data_line.js --json     the machine form
   Reads only. Nothing in the game is touched (rule 38g).
   ============================================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'records', 'BOHEMIA_MODS_THE_DATA_LINE_EVERY_CONTENT_KIND_10_17_26.md');
const EXAMPLES = path.join(ROOT, 'tools', 'mods_reference', 'example_mods');

/* the surfaces a player can reach; a json file is READ LIVE when one of these names it in a quoted string */
const SURFACES = [
  ['the demo', 'slices/BOHEMIA_DEMO.html'],
  ['the fight', 'slices/BOHEMIA_FIGHT.html'],
  ['the map', 'slices/BOHEMIA_CITY_WORLD.html'],
  ['the settlement screen', 'slices/BOHEMIA_SETTLEMENT_SCREEN.html'],
  ['the roster screen', 'slices/BOHEMIA_ROSTER_SCREEN.html'],
  ['the alpha', 'slices/BOHEMIA_ALPHA_0_9.html'],
];

/* ------------------------------------------------------------------------
   THE KINDS. Each: the plain name, what you would change, the lane that owns
   the content, and PROBES: {json: path} a data file; {code: path, table: NAME}
   a named table inside a code file (table optional: then every big table in
   the file); {baked: path, by: tool} a generated file whose source is a tool.
   ------------------------------------------------------------------------ */
const KINDS = [
  { kind: 'weapons', change: 'how hard a weapon hits, its reach, its cost, its skills', lane: 'COMBAT',
    probes: [{ json: 'records/target/bb/weapons.json' }] },
  { kind: 'what each weapon says it does', change: 'the one plain line under a weapon', lane: 'COMBAT / WORDS',
    probes: [{ json: 'records/target/bb/weapon_lines.json' }] },
  { kind: 'armour, helmets, shields', change: 'durability, weight (fatigue), price; which tier a piece falls in', lane: 'COMBAT / CHARACTER',
    probes: [{ json: 'records/target/bb/armor.json' }, { json: 'records/target/bb/armor_tiers.json' }] },
  { kind: 'enemies', change: 'an enemy\'s hit points, skills, perks, gear', lane: 'COMBAT',
    probes: [{ json: 'records/target/bb/enemies.json' }] },
  { kind: 'how enemies fight (AI)', change: 'which behaviour each enemy kind uses, the tactics switches', lane: 'COMBAT',
    probes: [{ json: 'records/target/bb/ai.json' }] },
  { kind: 'perks', change: 'a perk\'s numbers and tier, and its Bohemia translation', lane: 'COMBAT',
    probes: [{ json: 'records/target/bb/perks.json' }, { json: 'records/target/bb/perk_translation.json' }] },
  { kind: 'injuries', change: 'how long an injury lasts and what it costs', lane: 'COMBAT',
    probes: [{ json: 'records/target/bb/injuries.json' }] },
  { kind: 'the fight\'s rules', change: 'action points, fatigue, hit chance, damage, zone of control', lane: 'TUNING / COMBAT',
    probes: [{ json: 'records/target/bb/rules.json' }] },
  { kind: 'Bohemia\'s own fight numbers', change: 'the beat, the field size, death chance when struck down, laid-up days', lane: 'TUNING',
    probes: [{ json: 'records/target/bb/ours.json' }] },
  { kind: 'backgrounds (what a hire used to do)', change: 'a background\'s stats, wage and hire price', lane: 'PEOPLE',
    probes: [{ json: 'records/target/bb/backgrounds.json' }, { code: 'engine/bohemia_people.js', table: 'WAS_WORDS' }] },
  { kind: 'origins (how a game starts)', change: 'starting batteries, men, gear, the origin\'s rule', lane: 'RUN',
    probes: [{ json: 'records/target/bb/origins.json' }, { code: 'slices/BOHEMIA_DEMO.html', table: 'ORIGINS' }, { code: 'engine/bohemia_origins.js' }] },
  { kind: 'how each origin\'s crew dresses', change: 'which armour state each starting background wears', lane: 'CHARACTER',
    probes: [{ json: 'records/target/bb/origin_crews_dress.json' }] },
  { kind: 'party size math', change: 'how big a roaming party is, the day cap, difficulty by pick', lane: 'RUN',
    probes: [{ json: 'records/target/bb/party_math.json' }] },
  { kind: 'the factions', change: 'the four demo houses, their tones and banners; the eighteen-faction graph; measured colours', lane: 'FACTIONS',
    probes: [{ json: 'records/target/bb/factions.json' }, { json: 'engine/BOHEMIA_faction_graph.json' }, { json: 'engine/BOHEMIA_faction_colours.json' }, { code: 'slices/BOHEMIA_DEMO.html', table: 'FACTION_LOOKS' }] },
  { kind: 'relations (the 0 to 100 bar)', change: 'the bands, the start, the drift, what crime costs', lane: 'FACTIONS',
    probes: [{ json: 'records/target/bb/relations.json' }] },
  { kind: 'war between the houses', change: 'what a war takes and which side a job puts you on', lane: 'FACTIONS',
    probes: [{ json: 'records/target/bb/war.json' }] },
  { kind: 'when a settlement hunts you', change: 'the thresholds that send a patrol after you', lane: 'FACTIONS',
    probes: [{ json: 'records/target/bb/hunted.json' }] },
  { kind: 'what an arriving party does to a place', change: 'the traits a raid leaves and how long they last', lane: 'WORLD',
    probes: [{ json: 'records/target/bb/arrival_traits.json' }] },
  { kind: 'contracts (the job\'s pay)', change: 'pay by skulls and distance, haggling, what failing costs', lane: 'ECONOMY',
    probes: [{ json: 'records/target/bb/contract_terms.json' }, { code: 'engine/bohemia_keeper_lines.js', table: 'BOARD_PAY_BY_SKULLS' }] },
  { kind: 'prices', change: 'the crown to battery rate, buy and sell cuts, wages, daily rates', lane: 'ECONOMY',
    probes: [{ json: 'records/target/bb/price_table.json' }, { code: 'engine/bohemia_economy.js', table: 'GOODS' }] },
  { kind: 'what the stash costs per day', change: 'food by terrain, spoil days, repair, medicine, ammo', lane: 'ECONOMY',
    probes: [{ json: 'records/target/bb/stash_rates.json' }] },
  { kind: 'settlement traits and rumours', change: 'what a town can be known for and what people whisper', lane: 'WORLD / PEOPLE',
    probes: [{ json: 'records/target/settlement_traits.json' }, { json: 'records/target/settlement_rumours.json' }] },
  { kind: 'followers (the camp hires)', change: 'the cook, the price, what each one changes', lane: 'RUN',
    probes: [{ code: 'engine/bohemia_followers.js', table: 'FOLLOWERS' }] },
  { kind: 'the sixty bosses', change: 'a boss\'s name, what it holds, the verb it hands you', lane: 'WORLD / COMBAT',
    probes: [{ code: 'engine/bohemia_ladder_data.js', table: 'BOSSES' }] },
  { kind: 'road encounters', change: 'what can meet you on the road and how it ends', lane: 'WORLD',
    probes: [{ code: 'engine/bohemia_encounters.js', table: 'ROSTER' }] },
  { kind: 'what people say', change: 'a faction\'s lines, reactions, the keepers\' lines', lane: 'WORDS / PEOPLE',
    probes: [{ code: 'engine/bohemia_people.js', table: 'LINES' }, { code: 'engine/bohemia_people.js', table: 'REACTIONS' }, { code: 'engine/bohemia_keeper_lines.js' }] },
  /* MODS [the screen's word] 10/19: the walk found every person's name on the glass (the hire post, the keepers) rolled by
     engine/bohemia_names.js (PEOPLE 10/18), which this kind did not list; the people.js pools stay the stranger's line */
  { kind: 'names', change: 'the first names and surnames by background (the county\'s mix) a hire, a keeper and a stranger are given; which name lands on which keeper is a dice roll keyed by the place, so no line names one keeper', lane: 'PEOPLE',
    probes: [{ code: 'engine/bohemia_names.js', table: 'MIX', see: 'edit the engine file; the settlement screen loads it live (the hire post, the keepers: reload it); the map carries a copy, re-cut to see it there' }, { code: 'engine/bohemia_people.js', table: 'SURNAME' }, { code: 'engine/bohemia_people.js', table: 'NAME_READS' }] },
  { kind: 'the asks (what people ask of you)', change: 'who asks, about what, in which words', lane: 'QUESTS / WORDS',
    probes: [{ code: 'engine/bohemia_asking.js', table: 'ASKING' }, { code: 'engine/bohemia_asks.js' }] },
  { kind: 'trade talk', change: 'the exchanges at a counter', lane: 'WORDS',
    probes: [{ code: 'engine/bohemia_exchanges.js', table: 'EXCHANGES' }] },
  { kind: 'the demo\'s quests', change: 'the day-by-day briefs', lane: 'QUESTS (research only)',
    probes: [{ code: 'engine/bohemia_demoquests.js', table: 'DAYS' }] },
  { kind: 'sounds', change: 'a sound\'s recipe (material, pitch, decay), what fires it, the voices', lane: 'SOUNDS',
    probes: [{ code: 'engine/bohemia_sfx.js', table: 'RECIPE' }, { code: 'engine/bohemia_sfx.js', table: 'EVENTS' }, { code: 'engine/bohemia_sfx.js', table: 'INST_VOICE' }, { code: 'engine/bohemia_horror_sounds.js', table: 'STRIKE' }] },
  { kind: 'music', change: 'the songs, the loops, the city\'s music', lane: 'SOUNDS',
    probes: [{ code: 'slices/BOHEMIA_DEMO.html', table: 'MUS' }, { code: 'slices/BOHEMIA_DEMO.html', table: 'MLOOPS' }, { code: 'slices/BOHEMIA_DEMO.html', table: 'CITYMUS' }] },
  { kind: 'ambience and rooms', change: 'what a place sounds like', lane: 'SOUNDS',
    probes: [{ code: 'slices/BOHEMIA_DEMO.html', table: 'AMB' }, { code: 'slices/BOHEMIA_DEMO.html', table: 'ROOM' }] },
  { kind: 'the fight\'s ground (tiles and kits)', change: 'what a floor tile costs and does, the kits per district, the blockers', lane: 'COMBAT TWO / COOK TWO',
    probes: [{ json: 'slices/fight_ground/fight_ground.json' }, { json: 'records/target/bb/BOHEMIA_GROUND_EDGES.json' }, { json: 'records/target/BOHEMIA_BOARD_KINDS.json' }, { json: 'records/target/BOHEMIA_BOARD_TERRAINS.json' }, { json: 'records/target/BOHEMIA_GROUND_EFFECTS.json' }] },
  { kind: 'the settlement\'s ground and pictures', change: 'the tiers and tiles a settlement screen is drawn from', lane: 'COOK FOUR / RUN TWO',
    probes: [{ json: 'slices/settlement_ground/settlement_ground.json' }, { json: 'slices/settlement_ground_packs/settlement_ground.json' }] },
  { kind: 'the map\'s houses', change: 'the hero house pictures on the map', lane: 'COOK FOUR',
    probes: [{ json: 'slices/cook4_map_houses/map_houses.json' }] },
  { kind: 'the fighters\' sprite sheets', change: 'the frames and clips the fight and the settlement draw a person or a beast with', lane: 'ANIMATION',
    probes: [{ json: 'slices/fight_people/fight_people.json' }, { json: 'slices/fight_beasts/fight_beasts.json' }, { json: 'slices/settlement_people/settlement_people.json' }] },
  { kind: 'the demo\'s cast and crowd (bodies)', change: 'the baked looks of everyone on the map', lane: 'CHARACTER / RUN',
    probes: [{ baked: 'slices/BOHEMIA_DEMO_CAST.json', by: 'tools/bohemia_bake_the_demo_cast.js' }, { baked: 'slices/BOHEMIA_DEMO_CROWD.json', by: 'tools/bohemia_bake_the_demo_cast.js' }] },
  { kind: 'clothes and hair', change: 'the wardrobe, the haircuts, the paint over the thirteen looks and the six tiers', lane: 'CHARACTER / COOK THREE',
    probes: [{ code: 'engine/bohemia_dress.js' }, { code: 'engine/bohemia_barber.js' }, { json: 'engine/bohemia_cook3_runway_paint.json' }, { json: 'engine/bohemia_cook3_tier_paint.json' }, { json: 'records/target/BOHEMIA_HAIRSTYLES_MATCH.json' }] },
  { kind: 'poses (how a body moves)', change: 'the keys of each clip', lane: 'ANIMATION',
    probes: [{ code: 'slices/BOHEMIA_DEMO.html', table: 'POSE' }] },
  { kind: 'cutscenes and the cold open', change: 'the scenes, their lines, their timing', lane: 'DYNASTY / WORDS',
    probes: [{ code: 'slices/BOHEMIA_DEMO.html', table: 'BOHEMIA_CUTSCENES' }, { code: 'slices/BOHEMIA_DEMO.html', table: 'BOHEMIA_COLD_OPEN' }, { code: 'engine/bohemia_story_surface.js' }] },
  { kind: 'the three acts and the heirs', change: 'what an act is, how the heir is made', lane: 'DYNASTY',
    probes: [{ code: 'engine/bohemia_acts.js' }, { code: 'engine/bohemia_heirs.js' }] },
  { kind: 'the city\'s districts', change: 'what each of the forty district kinds is made of and how it is laid', lane: 'LIFE+CITY / WORLD',
    probes: [{ code: 'engine/bohemia_district_kit.js' }, { code: 'engine/bohemia_suburb.js' }, { code: 'engine/bohemia_downtown.js' }, { code: 'engine/bohemia_freeway.js' }, { code: 'engine/bohemia_world.js', table: 'DISTGEN' }] },
  { kind: 'the valley map', change: 'the region map the city is cut from', lane: 'WORLD',
    probes: [{ json: 'engine/BOHEMIA_region_map.json' }] },
  { kind: 'the cold open\'s set tiles', change: 'the pictures the first room is built from', lane: 'COOK',
    probes: [{ code: 'engine/bohemia_coldopen_set.js', table: 'TILES' }] },
  { kind: 'the phone\'s feed', change: 'the posts that scroll in the city view', lane: 'UI / WORLD',
    probes: [{ code: 'engine/bohemia_feedstream.js' }] },
  /* MODS [the screen's word] 10/18: the two kinds the three strangers of [a modder's first hour] looked for here and did not find */
  { kind: 'building names and who stands in them', change: 'a building\'s name and short line in a town (THE BAR, a round, a rumour), the keeper\'s name and title (MANNY, BEHIND THE BAR)', lane: 'RUN TWO',
    probes: [{ code: 'slices/BOHEMIA_SETTLEMENT_SCREEN.html', table: 'B' }, { code: 'slices/BOHEMIA_SETTLEMENT_SCREEN.html', table: 'KEEPERS' }] },
  { kind: 'a crew member\'s haircut (two words)', change: 'the body\'s cut, one of the named cuts (LAYERED FALL), and the face\'s cut, one of four classes (long, taper, coil, shag); change both or the man wears two haircuts', lane: 'CHARACTER / PORTRAIT',
    probes: [{ code: 'slices/BOHEMIA_ALPHA_0_9.html', table: 'CITY_CAST_LOOKS', see: 'edit the alpha, then bake the sheets: node tools/bohemia_fight_people_bake.js (about 4 minutes) and tools/bohemia_settlement_people_bake.js; the demo carries a copy of the table, re-cut to see it on the map' }, { code: 'tools/bohemia_portrait_the_head_from_the_model.py', table: 'CREW', see: 'edit the table inside the tool, then render in Blender (not on a stranger\'s machine: the head model is not committed)' }] },
  { kind: 'the roads', change: 'the road kinds and their speed', lane: 'WORLD / RUN',
    probes: [{ code: 'engine/bohemia_roads.js' }, { json: 'records/target/BOHEMIA_THE_ROADS.json' }] },
];

/* ------------------------------------------------------------------------ measuring */
const text = {};
function read(rel) { if (!(rel in text)) { const p = path.join(ROOT, rel); text[rel] = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null; } return text[rel]; }
function matchClose(t, open, py) {
  let d = 0;
  for (let i = open; i < t.length; i++) {
    const c = t[i];
    if (py && c === '#') { i = t.indexOf('\n', i); if (i < 0) return -1; continue; }
    if (c === '/' && t[i + 1] === '*') { i = t.indexOf('*/', i + 2) + 1; if (i < 1) return -1; continue; }
    if (c === '/' && t[i + 1] === '/') { i = t.indexOf('\n', i); if (i < 0) return -1; continue; }
    if (c === '"' || c === "'" || c === '`') { for (i++; i < t.length && t[i] !== c; i++) if (t[i] === '\\') i++; continue; }
    if (c === '{' || c === '[') d++;
    else if (c === '}' || c === ']') { d--; if (d === 0) return i; }
  }
  return -1;
}
function tables(t, name, minChars, py) {
  const out = [];
  const re = name ? new RegExp('(?:^|\\n)\\s{0,4}' + (py ? '' : '(?:const|let|var)\\s+') + '(' + name + ')\\s*=\\s*([\\[{])', 'g')
                  : /(?:^|\n)\s{0,4}(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*([\[{])/g;
  let m;
  while ((m = re.exec(t))) {
    const open = m.index + m[0].length - 1;
    const close = matchClose(t, open, py);
    if (close < 0) continue;
    const body = t.slice(open, close + 1);
    const lines = body.split('\n').length;
    if (name || (lines >= 8 && body.length >= (minChars || 2000))) out.push({ name: m[1], chars: body.length, lines, line: t.slice(0, m.index + (m[0][0] === '\n' ? 1 : 0)).split('\n').length, head: body.slice(0, 160).replace(/\s+/g, ' ') });
    re.lastIndex = close;
  }
  return out;
}
function countRows(j) {
  /* rows = every id-keyed row across the file's tables; values = top-level settings */
  let rows = 0, tabs = [], values = 0;
  for (const [k, v] of Object.entries(j)) {
    if (k.startsWith('_')) continue;
    if (Array.isArray(v) && v.length && v.every(r => r && typeof r === 'object' && 'id' in r)) { rows += v.length; tabs.push(k + ' ' + v.length); }
    else if (v && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length > 8 && Object.values(v).every(r => r && typeof r === 'object' && !Array.isArray(r))) { rows += Object.keys(v).length; tabs.push(k + ' ' + Object.keys(v).length); }
    else values++;
  }
  return { rows, tabs, values };
}
function readers(rel) {
  const base = path.basename(rel);
  const out = [];
  for (const [name, s] of SURFACES) {
    const t = read(s); if (!t) continue;
    const re = new RegExp('[\'"][^\'"\\n]*' + base.replace(/[.]/g, '\\.') + '[\'"]');
    if (re.test(t)) out.push(name);
  }
  const eng = fs.readdirSync(path.join(ROOT, 'engine')).filter(f => f.endsWith('.js'));
  const viaEngine = [];
  for (const f of eng) { const t = read('engine/' + f); if (t && new RegExp('[\'"][^\'"\\n]*' + base.replace(/[.]/g, '\\.') + '[\'"]').test(t)) viaEngine.push(f); }
  return { surfaces: out, engine: viaEngine };
}
function exampleFor(rel) {
  const base = path.basename(rel);
  if (!fs.existsSync(EXAMPLES)) return [];
  return fs.readdirSync(EXAMPLES).filter(d => d !== 'broken' && fs.existsSync(path.join(EXAMPLES, d, base)));
}
function copies(tbl, srcRel) {
  /* the same table (name and size within 1%) in another live surface: the demo inlines engine files */
  const out = [];
  for (const [name, s] of SURFACES) {
    if (s === srcRel) continue;
    const t = read(s); if (!t) continue;
    for (const x of tables(t, tbl.name)) if (Math.abs(x.chars - tbl.chars) <= Math.max(20, tbl.chars * 0.01)) { out.push(name); break; }
  }
  return out;
}

function measure() {
  const kinds = [];
  for (const K of KINDS) {
    const places = [];
    for (const p of K.probes) {
      if (p.json) {
        const t = read(p.json);
        if (t === null) { places.push({ kind: 'json', file: p.json, missing: true }); continue; }
        let j = null; try { j = JSON.parse(t); } catch (e) { places.push({ kind: 'json', file: p.json, bytes: t.length, badJson: true }); continue; }
        const c = countRows(j);
        const r = readers(p.json);
        places.push({ kind: 'json', file: p.json, bytes: t.length, rows: c.rows, tables: c.tabs, values: c.values, readLiveBy: r.surfaces, readByEngine: r.engine, examples: exampleFor(p.json) });
      } else if (p.code) {
        const t = read(p.code);
        if (t === null) { places.push({ kind: 'code', file: p.code, table: p.table, missing: true }); continue; }
        const py = /\.py$/.test(p.code);   /* a Python tool's table: NAME = { ... } at the top of the file */
        let tb = p.table ? tables(t, p.table, 0, py) : tables(t, null, 2000, py);
        if (p.table && tb.length > 1) tb = [tb.sort((a, b) => b.chars - a.chars)[0]]; /* one name, several declarations: the real table is the big one */
        if (!tb.length) { places.push({ kind: 'code', file: p.code, table: p.table, noTable: true, bytes: t.length, lines: t.split('\n').length }); continue; }
        for (const x of tb.slice(0, 6)) places.push({ kind: 'code', file: p.code, table: x.name, chars: x.chars, lines: x.lines, line: x.line, copies: p.code.startsWith('engine/') ? copies(x, p.code) : [], head: x.head, see: p.see });
      } else if (p.baked) {
        const pth = path.join(ROOT, p.baked);
        places.push({ kind: 'baked', file: p.baked, by: p.by, missing: !fs.existsSync(pth), bytes: fs.existsSync(pth) ? fs.statSync(pth).size : 0, bySource: fs.existsSync(path.join(ROOT, p.by)) });
      }
    }
    const live = places.filter(x => x.kind === 'json' && !x.missing && x.readLiveBy && x.readLiveBy.length);
    const jsonAny = places.filter(x => x.kind === 'json' && !x.missing);
    const codeAny = places.filter(x => x.kind === 'code' && !x.missing && !x.noTable);
    const codeOnly = places.filter(x => x.kind === 'code' && x.noTable);
    const baked = places.filter(x => x.kind === 'baked' && !x.missing);
    let status;
    if (live.length && !codeAny.length) status = 'DATA';
    else if (live.length && codeAny.length) status = 'DATA, WITH A COPY IN CODE';
    else if (jsonAny.length && !codeAny.length) status = 'A FILE, NOT READ LIVE';
    else if (jsonAny.length && codeAny.length) status = 'A FILE AND CODE';
    else if (baked.length) status = 'BAKED BY A TOOL';
    else if (codeAny.length) status = 'IN CODE';
    else if (codeOnly.length) status = 'BUILT BY CODE, NO TABLE';
    else status = 'NOT FOUND';
    kinds.push({ kind: K.kind, change: K.change, lane: K.lane, status, places });
  }
  return kinds;
}

/* ------------------------------------------------------------------------ the page */
function how(place) {
  if (place.kind === 'json') {
    if (place.readLiveBy && place.readLiveBy.length) return 'edit the file, reload ' + place.readLiveBy.join(' / ');
    if (place.readByEngine && place.readByEngine.length) return 'edit the file; read by ' + place.readByEngine.slice(0, 2).join(', ') + ' (an engine file, inlined into the surfaces by a cut)';
    return 'edit the file; a build input, a lane\'s tool reads it';
  }
  if (place.kind === 'code') {
    if (place.see) return place.see;   /* a measured path (the first-hour page), where the general rule below would be wrong */
    if (place.noTable) return 'no table to edit: the content is built by functions in that file; a lane has to pull it into a table first';
    if (place.file.startsWith('slices/')) return 'edit the table inside the surface itself (it is code, not a file)';
    if (place.file.startsWith('tools/')) return 'edit the table inside the tool, then run the tool (it renders pictures the game shows)';
    return 'edit the engine file' + (place.copies && place.copies.length ? '; ' + place.copies.join(' and ') + ' carr' + (place.copies.length > 1 ? 'y' : 'ies') + ' a copy, re-cut to see it' : '; the surfaces carry it after a cut');
  }
  return 'do not edit the file: it is baked by ' + place.by + '; change the source and bake again';
}
function fileCell(p) {
  if (p.missing) return '`' + p.file + (p.table ? ' ' + p.table : '') + '` MISSING';
  if (p.noTable) return '`' + p.file + '` (' + p.lines + ' lines of code, no top-level table' + (p.table ? ' named ' + p.table : '') + ')';
  if (p.kind === 'json') return '`' + p.file + '` (' + (p.rows ? p.rows + ' rows' + (p.tables.length > 1 ? ' in ' + p.tables.length + ' tables' : '') : p.values + ' settings') + ')';
  if (p.kind === 'code') return '`' + p.file + '` table ' + p.table + ' (line ' + p.line + ', ' + p.lines + ' lines)';
  return '`' + p.file + '` (' + Math.round(p.bytes / 1024) + ' KB, baked)';
}
function page(kinds) {
  const date = '10/17/26, re-measured 10/19/26';
  const counts = {};
  for (const k of kinds) counts[k.status] = (counts[k.status] || 0) + 1;
  const order = ['DATA', 'DATA, WITH A COPY IN CODE', 'A FILE, NOT READ LIVE', 'A FILE AND CODE', 'IN CODE', 'BUILT BY CODE, NO TABLE', 'BAKED BY A TOOL', 'NOT FOUND'];
  const bb = fs.readdirSync(path.join(ROOT, 'records', 'target', 'bb')).filter(f => f.endsWith('.json'));
  const noExample = bb.filter(f => !exampleFor('records/target/bb/' + f).length);
  const withExample = bb.filter(f => exampleFor('records/target/bb/' + f).length);
  const L = [];
  L.push('# THE DATA LINE: EVERY CONTENT KIND, WHERE IT LIVES, WHAT YOU EDIT (generated ' + date + ' by tools/bohemia_mods_data_line.js)');
  L.push('');
  L.push('Lane 22 MODS, research only (rule 38g); the big swing of rule 110 (Paolo 10/16: take big swings, run to the end). Paolo 9/27: "I want this to be mod friendly for the community." Paolo 9/30: "the point of the mods chat is to make it easy for people to make mods." This page is measured from the repo by the tool named in the title, so it cannot disagree with the files; re-run the tool and it rewrites itself. Nothing in the game changed.');
  L.push('');
  L.push('## THE ANSWER IN ONE LINE');
  L.push('');
  const n = (k) => counts[k] || 0;
  L.push('**' + kinds.length + ' kinds of content. ' + n('DATA') + ' live in a data file a modder edits and a screen reads straight back; ' + n('DATA, WITH A COPY IN CODE') + ' are in a file but a code copy can drift; ' + (n('A FILE, NOT READ LIVE') + n('A FILE AND CODE')) + ' are in a file no screen reads live (a build input); ' + n('IN CODE') + ' are still tables inside code; ' + n('BUILT BY CODE, NO TABLE') + ' are built by functions with no table at all; ' + n('BAKED BY A TOOL') + ' baked by a tool; ' + n('NOT FOUND') + ' not found by name.**');
  L.push('');
  L.push('A modder today can change **' + (counts['DATA'] || 0) + ' kinds by editing one JSON file and reloading the screen** (the fight, the settlement screen, the map, the demo). The rest of the page says, for every other kind, exactly which file and which table, so nobody has to grep.');
  L.push('');
  /* MODS [the screen's word] 10/19: this page sorts by file type; a stranger starts from the word on the screen */
  L.push('**Start from the word on the screen, not from this table.** Three strangers ([a modder\'s first hour], 10/18) found the bar (code) faster than the pistol (data) every time, because THE BAR on the screen is THE BAR in the file and PISTOL is in no row of the weapons file. For every name a player reads in the demo\'s first ten minutes, the line that sets it and the hops when the search misses: records/BOHEMIA_MODS_EVERY_WORD_YOU_SEE_FINDS_ITS_LINE_10_19_26.md. The two kinds the strangers looked for here and did not find (building names; a crew member\'s haircut, two words) are rows below from 10/19.');
  L.push('');
  L.push('## HOW TO READ THE TABLE');
  L.push('');
  L.push('- **DATA**: a JSON file; a screen a player reaches fetches it by name. Edit, reload, done. The first-hour page proved it on the knife.');
  L.push('- **DATA, WITH A COPY IN CODE**: the file exists and is read, but a surface also carries its own table of the same kind. Edit the file; the copy may not follow (the start screen\'s fixed list of fifteen origins is the known case).');
  L.push('- **A FILE, NOT READ LIVE**: a JSON file a lane\'s tool reads at build time. Edit it, then that lane\'s tool has to run.');
  L.push('- **IN CODE**: a named table inside a `.js` or `.html` file. You can still edit it (it is plain JSON-shaped text), but it is code, and the demo carries a COPY of each engine file, so an edit to the engine file shows only after a re-cut.');
  L.push('- **BAKED BY A TOOL**: a generated file. Never edit it; change what the tool reads and run the tool.');
  L.push('- **BUILT BY CODE, NO TABLE**: the file exists but holds no table at its top level; the content comes out of functions. Nothing a modder can edit as data until a lane pulls it into a table.');
  L.push('');
  for (const st of order) {
    const rows = kinds.filter(k => k.status === st);
    if (!rows.length) continue;
    L.push('## ' + st + ' (' + rows.length + ')');
    L.push('');
    L.push('| content kind | what you would change | the file today | owner | example mod | how you see the change |');
    L.push('|---|---|---|---|---|---|');
    for (const k of rows) {
      const files = k.places.map(fileCell).join('<br>');
      const ex = [...new Set(k.places.flatMap(p => p.examples || []))];
      const hows = [...new Set(k.places.filter(p => !p.missing).map(how))].join('<br>');
      L.push('| **' + k.kind + '** | ' + k.change + ' | ' + files + ' | ' + k.lane + ' | ' + (ex.length ? ex.join(', ') : 'none yet') + ' | ' + hows + ' |');
    }
    L.push('');
  }
  L.push('## WHICH DATA FILES HAVE AN EXAMPLE MOD, AND WHICH DO NOT');
  L.push('');
  L.push('The ' + bb.length + ' files in `records/target/bb/`: **' + withExample.length + ' have a worked example** in `tools/mods_reference/example_mods/` and **' + noExample.length + ' do not**.');
  L.push('');
  L.push('With an example: ' + withExample.map(f => '`' + f + '` (' + exampleFor('records/target/bb/' + f).join(', ') + ')').join(', ') + '.');
  L.push('');
  L.push('Without: ' + noExample.map(f => '`' + f + '`').join(', ') + '.');
  L.push('');
  L.push('## WHAT THE MEASUREMENT CAN AND CANNOT SAY');
  L.push('');
  L.push('- A file counts as READ LIVE when one of the six player surfaces (' + SURFACES.map(s => s[0]).join(', ') + ') names it inside a quoted string. A file fetched through a variable would be missed; none of the ' + bb.length + ' bb files is, because the fight lists them by name.');
  L.push('- A code table counts when a `const`, `let` or `var` of that name opens a `[` or `{` at the top level of the file. A table built by a function is missed.');
  L.push('- A copy in a surface is the same table name at the same size (within one percent). The demo inlines five engine files verbatim and carries the rest through its build; where the size differs the copy is not counted and the page says only "after a cut".');
  L.push('- Owners are by the table\'s role, from the board, not verified line by line.');
  L.push('- The kinds list is written by hand (' + kinds.length + ' kinds); everything under each kind is measured. A kind nobody listed is not on the page. Add it to KINDS and re-run.');
  L.push('');
  L.push('## THE FINDING THAT PROVES US WRONG');
  L.push('');
  L.push('The schema page (10/9) and the first-hour page (10/10) say the modder\'s world is `records/target/bb/`. Measured: that folder is ' + bb.length + ' files, and the fight, the settlement screen, the map and the demo read ' + kinds.filter(k => k.status === 'DATA').length + ' kinds from it and from four more data folders under `slices/`. But the sound a modder hears, the song, the words a keeper says, the sixty bosses, the road encounters and the cutscenes are ' + n('IN CODE') + ' kinds still in code (' + n('BUILT BY CODE, NO TABLE') + ' more have no table at all), and every one of them sits inside the demo as a copy, so editing the engine file changes nothing on the phone until a cut. The data line is half built: the fight\'s half. The world\'s half is the next door.');
  L.push('');
  L.push('## ROUTED (pages only, rule 38g; the building lanes move their own tables)');
  L.push('');
  for (const k of kinds.filter(k => k.status === 'IN CODE' || k.status === 'DATA, WITH A COPY IN CODE')) {
    const big = k.places.filter(p => p.kind === 'code' && !p.missing).sort((a, b) => b.chars - a.chars)[0];
    if (big) L.push('- **' + k.lane + '**: ' + k.kind + ': `' + big.file + '` table ' + big.table + ' (' + big.lines + ' lines) is the table a modder would want as a file' + (k.status === 'DATA, WITH A COPY IN CODE' ? ', beside the file that already exists' : '') + '.');
  }
  L.push('');
  L.push('Proof line: `node tools/bohemia_mods_data_line.js` (reads only; about two seconds). Companion pages: the schema page records/BOHEMIA_MODS_THE_DATA_SCHEMA_10_9_26.md, the audit records/BOHEMIA_MODS_WHAT_IS_DATA_AND_WHAT_IS_NOT_10_9_26.md, the one-page how-to MODDING.md.');
  return L.join('\n') + '\n';
}

const kinds = measure();
if (process.argv.includes('--json')) { console.log(JSON.stringify(kinds, null, 1)); process.exit(0); }
const md = page(kinds);
if (process.argv.includes('--write')) { fs.writeFileSync(OUT, md); console.log('wrote ' + path.relative(ROOT, OUT) + ' (' + md.length + ' bytes, ' + kinds.length + ' kinds)'); }
else process.stdout.write(md);
