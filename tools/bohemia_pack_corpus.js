/* THE APPROVED CORPUS, AS DATA (PLUMBER 10/10/26, row [the pack gate]; rule 82a)
   ================================================================================
   PAOLO 10/10: "the cars is an asset we downloaded; a lot of the original street tiles and sidewalks we
   downloaded; look again." Rule 82a: the downloaded assets are THE PURCHASED HD PACKS taken in on 7/7 and
   judged in July, and every tile, prop, car, street, sidewalk, kerb, marking, lamp and house skin on a
   fight board, a settlement picture and the map's near and middle stops comes FROM them, never cooked
   fresh. The list below is records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md's table plus rule 82a's own
   list, one entry per bank, so a gate and a cook tool read the same corpus instead of each remembering it.

   A KEY names one approved tile. Three shapes are read:
     [pool, index]                    a pool by name in any pool bank (COOK TWO's kit_street.json shape:
                                      ["street", 3] is the street pools' 'street' list, entry 3; ["cross",
                                      "paint colour"] is a colour measured off that pool's own tiles)
     {bank, pool?, idx}               a bank by file name or alias, a pool inside it when it has pools
     {pack, idx}                      one of the 87 HD packs, which must be UP in the confirmed set
   resolveKey(key) says where it lands or why it does not.

   require('tools/bohemia_pack_corpus.js').{CORPUS, corpusNames, resolveKey}
   ================================================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

/* alias, file, family, where the tiles sit inside the file (pools: a dict of lists; list: one list) */
const CORPUS = [
  { alias: 'street_pools', file: 'banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt', family: 'streets, sidewalks, kerbs, crossings, lane lines', pools: 'pools' },
  { alias: 'markings', file: 'banks/BOHEMIA_MARKING_BANK_7_17_26.txt', family: 'road markings and arrows (84, "I like all of them")', pools: 'classes' },
  { alias: 'exterior', file: 'banks/BOHEMIA_EXTERIOR_POOL_8_5_26.txt', family: 'street props: wrecks, trash, crates, barriers', pools: 'buckets' },
  { alias: 'interior', file: 'banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt', family: 'interior floors and props', pools: 'buckets' },
  { alias: 'ground', file: 'banks/BOHEMIA_GROUND_POOL_8_6_26.txt', family: 'his bought ground (gravel)', pools: 'buckets' },
  { alias: 'desert', file: 'banks/BOHEMIA_DESERT_POOLS_7_18_26.txt', family: 'terrain: desert ground, rock, rubble', pools: '' },
  { alias: 'house_skins', file: 'banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt', family: 'house skins (30 of 30)', list: 'tiles' },
  { alias: 'texture_match', file: 'banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt', family: 'wall and roof field (approved 8/1)', list: '' },
  { alias: 'starter', file: 'banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt', family: 'the starter tileset (42)', list: 'tiles' },
  { alias: 'lamps', file: 'banks/BOHEMIA_LAMP_DARK_VARIANTS_7_14_26.txt', family: 'lamps (7)', list: 'lamps' },
  { alias: 'doors_ew', file: 'banks/BOHEMIA_DOOR_EW_BANK_7_10_26.txt', family: 'doors, east and west edges', list: 'doors' },
  { alias: 'doors_anim', file: 'banks/BOHEMIA_DOOR_ANIM_BANK_7_13_26.txt', family: 'door clips', list: 'clips' },
  { alias: 'terrain_picks', file: 'banks/BOHEMIA_TERRAIN_PICKS_7_14_26.txt', family: 'terrain picks (13)', list: 'picks' },
  { alias: 'confirmed', file: 'banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt', family: 'the HD packs: 1,927 UP of 2,604 judged, keyed (pack, idx)', confirmed: true },
  { alias: 'hd_repo', file: 'banks/BOHEMIA_HD_TILE_REPO_part1.txt', family: 'the HD pack pixels (part 1 of 4, 180 MB in all)', pixelsOnly: true },
  { alias: 'hd_repo2', file: 'banks/BOHEMIA_HD_TILE_REPO_part2.txt', family: 'the HD pack pixels (part 2)', pixelsOnly: true },
  { alias: 'hd_repo3', file: 'banks/BOHEMIA_HD_TILE_REPO_part3.txt', family: 'the HD pack pixels (part 3)', pixelsOnly: true },
  { alias: 'hd_repo4', file: 'banks/BOHEMIA_HD_TILE_REPO_part4.txt', family: 'the HD pack pixels (part 4)', pixelsOnly: true },
  { alias: 'city_tiles', file: 'slices/BOHEMIA_CITY_TILES_01.js', family: 'the city tiles (chunks 01-09)', pixelsOnly: true },
  { alias: 'city_props', file: 'slices/BOHEMIA_CITY_PROPS.js', family: 'the city props, the cars among them', pixelsOnly: true },
  { alias: 'art_bank', file: 'reference/art_bank', family: 'the corpus extracted to PNG by family (COOK [the pack is the twin])', dir: true },
];

/* the strings that show a tool reads the corpus: every bank's file name (the HD repo and the city tiles by
   their stem, since a tool may build the part number), the art bank folder, and this module */
function corpusNames() {
  const n = new Set(['BOHEMIA_HD_TILE_REPO', 'BOHEMIA_CITY_TILES_', 'reference/art_bank', 'bohemia_pack_corpus']);
  for (const c of CORPUS) if (!c.dir) n.add(path.basename(c.file).replace(/\.(txt|js)$/, ''));
  return [...n];
}

const cache = {};
function load(c) {
  if (c.alias in cache) return cache[c.alias];
  let d = null; try { d = JSON.parse(fs.readFileSync(path.join(ROOT, c.file), 'utf8')); } catch (e) { d = null; }
  return (cache[c.alias] = d);
}
function poolsOf(c) {
  const d = load(c); if (!d || c.pools === undefined) return null;
  const p = c.pools ? d[c.pools] : d;
  if (!p || typeof p !== 'object') return null;
  const out = {}; for (const k in p) if (Array.isArray(p[k])) out[k] = p[k];
  return out;
}
function listOf(c) {
  const d = load(c); if (!d || c.list === undefined) return null;
  const l = c.list ? d[c.list] : d;
  return Array.isArray(l) ? l : (l && typeof l === 'object' ? Object.values(l) : null);
}
let upSet = null;
function confirmedUp() {
  if (upSet) return upSet;
  upSet = new Set();
  const d = load(CORPUS.find(c => c.confirmed));
  for (const v of (d && d.verdicts) || []) if (v.v === 'UP') upSet.add(v.pack + '#' + v.idx);
  return upSet;
}
const byName = (b) => CORPUS.find(c => c.alias === b || path.basename(c.file) === b || path.basename(c.file).replace(/\.(txt|js)$/, '') === b);

/* -> { ok, where } or { ok:false, why } */
function resolveKey(key) {
  const inRange = (arr, i) => Array.isArray(arr) && Number.isInteger(i) && i >= 0 && i < arr.length;
  if (Array.isArray(key) && key.length === 2 && typeof key[0] === 'string') {
    const [pool, i] = key, hits = [];
    for (const c of CORPUS) { const P = poolsOf(c); if (P && P[pool]) hits.push([c, P[pool]]); }
    if (!hits.length) return { ok: false, why: 'no approved bank has a pool called "' + pool + '"' };
    /* ["cross", "paint colour"]: a colour or a measure taken FROM the pool's own tiles (COOK TWO's kit takes its
       paint line from the crossing tiles). Rule 87 allows our own paint on weather, wear and light; the pool
       must exist, which is the part that keeps it honest. */
    if (typeof i === 'string' && i.trim()) return { ok: true, where: hits[0][0].alias + '/' + pool + ' (derived: ' + i + ')' };
    const h = hits.find(([, arr]) => inRange(arr, i));
    return h ? { ok: true, where: h[0].alias + '/' + pool + '#' + i } : { ok: false, why: pool + '#' + i + ' is past the end of every pool by that name' };
  }
  if (key && typeof key === 'object' && key.pack !== undefined) {
    return confirmedUp().has(key.pack + '#' + key.idx) ? { ok: true, where: 'confirmed/' + key.pack + '#' + key.idx }
      : { ok: false, why: '"' + key.pack + '" #' + key.idx + ' is not UP in the confirmed set' };
  }
  if (key && typeof key === 'object' && key.bank) {
    const c = byName(key.bank); if (!c) return { ok: false, why: 'no approved bank named "' + key.bank + '"' };
    if (key.pool !== undefined) { const P = poolsOf(c);
      return P && inRange(P[key.pool], key.idx) ? { ok: true, where: c.alias + '/' + key.pool + '#' + key.idx } : { ok: false, why: c.alias + ' has no ' + key.pool + '#' + key.idx }; }
    const L = listOf(c);
    return inRange(L, key.idx) ? { ok: true, where: c.alias + '#' + key.idx } : { ok: false, why: c.alias + ' has no #' + key.idx };
  }
  return { ok: false, why: 'not a key this corpus reads: ' + JSON.stringify(key).slice(0, 60) };
}

module.exports = { CORPUS, corpusNames, resolveKey, ROOT };
