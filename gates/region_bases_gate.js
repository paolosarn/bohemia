/* THE REGION BASES GATE (FACTIONS lane, the 10/16 big swing [bases on the region], rules 109d and 110)
   records/target/bb/region_bases.json says who holds each of RUN's twelve region places, where the region's wild locations
   are, and how many parties the region sends. This gate holds it to the three things it claims:
     1. THE SCHOOL IS REAL: every quote is read back out of the wiki tarball (or the library volume) it names.
     2. THE TWO FILES CANNOT DRIFT: the twelve places repeat RUN's TOWNS table (slices/bohemia_region.js) name for name,
        bearing for bearing, tier for tier, and every RUN place has a holder here.
     3. THE NUMBERS ARE RECOMPUTED, NEVER TRUSTED: REACH is read off engine/bohemia_towns.js, the valley's 28 are counted
        live off the real valley, the region's rows are handed to the real parties module and counted, settlements beat
        the wiki's 17 (parsed off the page, not typed).
   Plus the shape rules: a holder is a selectable canon faction; a wild location's faction and every unit id are Battle
   Brothers' (enemies.json) and the units belong to that faction; a wild row is inside the region, outside the city, and
   marked wild; a marker field is never a sentence (rule 37e); every number that is ours says so.
   node gates/region_bases_gate.js        REGION_BASES_FILE=<path> swaps the file (the mutation runs). */
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const FILE = process.env.REGION_BASES_FILE || path.join(ROOT, 'records/target/bb/region_bases.json');
const D = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const EN = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/enemies.json'), 'utf8')).rows;
const FJ = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/factions.json'), 'utf8'));
const G = require(path.join(ROOT, 'engine/BOHEMIA_faction_graph.json'));
const T = require(path.join(ROOT, 'engine/bohemia_towns.js')), P = require(path.join(ROOT, 'engine/bohemia_parties.js')),
      CE = require(path.join(ROOT, 'engine/bohemia_cityedit.js')), OM = require(path.join(ROOT, 'engine/bohemia_overmap.js'));
const REGION_SRC = fs.readFileSync(path.join(ROOT, 'slices/bohemia_region.js'), 'utf8');
let pass = 0, fail = 0;
const ok = (n, c, note) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n + (note ? '  [' + note + ']' : ''))); };
const flat = s => String(s).replace(/<[^>]*>/g, ' ').replace(/'''|''/g, '').replace(/\[https?:\/\/\S+ ([^\]]*)\]/g, '$1')
  .replace(/\[\[(?:[^|\]]*\|)?([^\]]*)\]\]/g, '$1').replace(/\s+/g, ' ');
const pageCache = {};
const pageText = src => {
  if (pageCache[src] != null) return pageCache[src];
  let t = '';
  try {
    if (src.indexOf('bb_all/') >= 0) {
      const n = src.split('bb_all/')[1];
      t = cp.execSync('tar -xzOf ' + path.join(ROOT, 'reference/library/grok/wiki/PAGES_ALL.tar.gz') + ' "bb_all/' + n + '"', { encoding: 'utf8', maxBuffer: 1 << 24 });
    } else t = fs.readFileSync(path.join(ROOT, src.split(' ')[0]), 'utf8');
  } catch (_e) { t = ''; }
  return (pageCache[src] = flat(t));
};

/* ---- 1. the school is real ---- */
const school = D.school || {};
const skeys = Object.keys(school);
ok('the school has at least twelve quoted lines', skeys.length >= 12, skeys.length);
for (const k of skeys) {
  const row = school[k];
  ok('school.' + k + ': the quote is really on its page', row && row.source && row.quote && row.quote.length > 20 && pageText(row.source).includes(flat(row.quote)), row && row.source);
}
const bbSettlements = (() => { const m = pageText('reference/library/grok/wiki/PAGES_ALL.tar.gz bb_all/0853_Global Map.txt').match(/a total of (\d+) settlements/); return m ? +m[1] : null; })();
ok('Battle Brothers\' settlement count is parsed off the wiki page, not typed', bbSettlements != null && bbSettlements === D.the_numbers.settlements.bb, bbSettlements);

/* ---- 2. the two files cannot drift ---- */
const towns = [];
const tm = REGION_SRC.match(/var TOWNS = \[([\s\S]*?)\];/);
if (tm) { const re = /\['([^']+)',\s*(-?\d+),\s*(-?\d+),\s*'(\w+)'\]/g; let x; while ((x = re.exec(tm[1]))) towns.push({ name: x[1], east: +x[2], north: +x[3], tier: x[4] }); }
ok('RUN\'s TOWNS table is read off slices/bohemia_region.js (twelve rows)', towns.length === 12, towns.length);
const places = D.region_places || [];
ok('every RUN place has a holder here', towns.every(t => places.some(p => p.name === t.name)), towns.filter(t => !places.some(p => p.name === t.name)).map(t => t.name).join());
ok('no place here that RUN does not draw', places.every(p => towns.some(t => t.name === p.name)), places.filter(p => !towns.some(t => t.name === p.name)).map(p => p.name).join());
for (const p of places) {
  const t = towns.find(t => t.name === p.name); if (!t) continue;
  ok(p.id + ': the bearing and the tier are RUN\'s', t.east === p.east && t.north === p.north && t.tier === p.tier, [t.east, t.north, t.tier, '|', p.east, p.north, p.tier].join(' '));
}

/* ---- the holders and the shape ---- */
const selectable = new Set(Object.keys(G.factions).filter(k => G.factions[k].type === 'selectable' && k !== 'Custom'));
const ids = new Set(), names = new Set();
const AG = new Set(Object.keys(P.AGENDAS || {}));
ok('the parties module\'s three agendas are read, not typed', AG.size === 3 && AG.has('crew') && AG.has('patrol') && AG.has('caravan'));
const prose = v => typeof v === 'string' && (/\.\s/.test(v) || v.trim().split(/\s+/).length > 5);
const markerOk = row => (D.marker_fields || []).every(f => !(f in row) || !prose(row[f]));
ok('marker_fields are named', Array.isArray(D.marker_fields) && D.marker_fields.length >= 6);
for (const p of places) {
  ok(p.id + ': unique id and name', !ids.has(p.id) && !names.has(p.name)); ids.add(p.id); names.add(p.name);
  ok(p.id + ': the holder is a selectable canon faction (never the player)', selectable.has(p.holder), p.holder);
  ok(p.id + ': the tier is one of the towns module\'s', T.TIERS.indexOf(p.tier) >= 0, p.tier);
  ok(p.id + ': its agendas are the frozen three', Array.isArray(p.agendas) && p.agendas.length && p.agendas.every(a => AG.has(a)));
  ok(p.id + ': a real place and a why', typeof p.real === 'string' && p.real.length > 20 && typeof p.why === 'string' && p.why.length > 20);
  ok(p.id + ': its kind is a word', typeof p.kind === 'string' && /^[a-z_]+$/.test(p.kind), p.kind);
  ok(p.id + ': no sentence in a marker field', markerOk(p));
}
const heldBy = {}; places.forEach(p => { heldBy[p.holder] = (heldBy[p.holder] || 0) + 1; });
ok('no faction holds more than Battle Brothers\' lopsided share (10 of 17, read off the wiki)', Object.values(heldBy).every(n => n / places.length <= 10 / 17), JSON.stringify(heldBy));
ok('at least eight factions hold region ground', Object.keys(heldBy).length >= 8, Object.keys(heldBy).length);

const enIds = new Map(EN.map(e => [e.id, e.faction])), enFac = new Set(EN.map(e => e.faction));
const fjById = {}; (FJ.factions || []).forEach(f => { fjById[f.id] = f; });
const inRegion = r => Math.max(Math.abs(r.east), Math.abs(r.north)) <= D.frame.region_half - D.frame.placer_margin;
const outsideCity = r => Math.max(Math.abs(r.east), Math.abs(r.north)) > D.frame.city_half;
const wild = D.hostile_locations || [];
ok('the region has wild locations (Battle Brothers\' camps in the wild)', wild.length >= 6, wild.length);
const mixIds = m => Object.keys(m.early || {}).concat(Object.keys(m.late || {}));
for (const w of wild) {
  ok(w.id + ': unique id and name', !ids.has(w.id) && !names.has(w.name)); ids.add(w.id); names.add(w.name);
  ok(w.id + ': marked wild', w.wild === true);
  ok(w.id + ': inside the region and outside the city', inRegion(w) && outsideCity(w), [w.east, w.north].join());
  ok(w.id + ': the faction is Battle Brothers\' (enemies.json)', enFac.has(w.faction), w.faction);
  ok(w.id + ': the tier is one of the towns module\'s', T.TIERS.indexOf(w.tier) >= 0, w.tier);
  ok(w.id + ': the agenda is one of the frozen three', AG.has(w.agenda), w.agenda);
  if (typeof w.mix === 'string') {
    const fid = w.mix.split(' ').pop(), f = fjById[fid];
    ok(w.id + ': its mix points at a factions.json faction with early and late make-ups', !!(f && f.mix && f.mix.early && f.mix.late && f.enemy_faction === w.faction), w.mix);
  } else {
    ok(w.id + ': its own mix is marked ours and draft', w.mix && w.mix.ours === true && w.mix.draft === true);
    ok(w.id + ': every unit id is Battle Brothers\' and belongs to its faction', w.mix && mixIds(w.mix).length > 0 && mixIds(w.mix).every(i => enIds.get(i) === w.faction), w.mix && mixIds(w.mix).filter(i => enIds.get(i) !== w.faction).join());
  }
  ok(w.id + ': banner_of is a factions.json id or null', w.banner_of === null || !!fjById[w.banner_of], w.banner_of);
  ok(w.id + ': a real place, a why and a ground list', typeof w.real === 'string' && w.real.length > 20 && typeof w.why === 'string' && w.why.length > 20 && Array.isArray(w.ground) && w.ground.length);
  ok(w.id + ': no sentence in a marker field', markerOk(w));
  ok(w.id + ': the dead and the beasts hold, the crews raid', (w.faction === 'ancient_dead' || w.faction === 'beasts') ? w.agenda === 'patrol' : w.agenda === 'crew', w.faction + ' ' + w.agenda);
}
const settled = D.settled_locations || [];
for (const w of settled) {
  ok(w.id + ': unique id and name', !ids.has(w.id) && !names.has(w.name)); ids.add(w.id); names.add(w.name);
  ok(w.id + ': a settled location is never wild', w.wild === false);
  ok(w.id + ': inside the region and outside the city', inRegion(w) && outsideCity(w), [w.east, w.north].join());
  ok(w.id + ': the faction is Battle Brothers\' (enemies.json) and not his canon (his canon holds the twelve places)', enFac.has(w.faction) && !G.factions[w.faction], w.faction);
  ok(w.id + ': the tier is one of the towns module\'s', T.TIERS.indexOf(w.tier) >= 0, w.tier);
  ok(w.id + ': its agendas are the frozen three', Array.isArray(w.agendas) && w.agendas.length && w.agendas.every(a => AG.has(a)));
  const fid = typeof w.mix === 'string' ? w.mix.split(' ').pop() : null, f = fjById[fid];
  ok(w.id + ': its mix points at a factions.json faction with early and late make-ups', !!(f && f.mix && f.mix.early && f.mix.late && f.enemy_faction === w.faction), w.mix);
  ok(w.id + ': banner_of is a factions.json id', !!fjById[w.banner_of], w.banner_of);
  ok(w.id + ': a real place, a why and a ground list', typeof w.real === 'string' && w.real.length > 20 && typeof w.why === 'string' && w.why.length > 20 && Array.isArray(w.ground) && w.ground.length);
  ok(w.id + ': no sentence in a marker field', markerOk(w));
}
for (const r of D.roaming_without_a_base || []) {
  ok(r.id + ': a company without a base is ours, draft, with its wiki line', r.ours === true && r.draft === true && !!school[(r.wiki || '').split('.').pop()] && enFac.has(r.faction));
}

/* ---- 3. the numbers are recomputed ---- */
const N = D.the_numbers;
ok('settlements: 14 valley seats + the twelve places = ours, and ours meets or beats Battle Brothers', N.settlements.valley_seats + N.settlements.region_places === N.settlements.ours && N.settlements.region_places === places.length && N.settlements.ours >= bbSettlements && N.settlements.met === (N.settlements.ours >= bbSettlements));
ok('hostile locations: the count is the list', N.hostile_locations.ours === wild.length && N.hostile_locations.bb === null && /does not say/.test(N.hostile_locations.bb_note || ''));
ok('settled locations: the count is the list', !settled.length || (N.settled_locations && N.settled_locations.ours === settled.length), settled.length);
const reach = t => Object.prototype.hasOwnProperty.call(T.REACH, t) ? T.REACH[t] : T.REACH.camp;
const fromPlaces = places.reduce((s, p) => s + reach(p.tier), 0), fromWild = wild.concat(settled).reduce((s, w) => s + reach(w.tier), 0) + (D.roaming_without_a_base || []).length;
ok('parties from the places = the sum of REACH over their tiers (read off the towns module)', N.parties_at_once.region_from_places === fromPlaces, fromPlaces);
ok('parties from the locations = REACH over the wild and the settled locations plus the companies without a base', N.parties_at_once.region_from_locations === fromWild, fromWild);
const m = OM.buildOvermap(12345), seats = T.derive(G, T.districtsOf(m, CE.cat), 1), mid = (m.n - 1) / 2;
const valley = P.all(seats, { n: m.n });
ok('the valley\'s parties are counted live and match the file', valley.length === N.parties_at_once.valley_measured, valley.length);
ok('the valley\'s crews are counted live and match the file', valley.filter(p => p.agenda === 'crew').length === N.crews_out_of_town.valley_crews, valley.filter(p => p.agenda === 'crew').length);
ok('the region\'s crews are the wild rows that raid', wild.filter(w => w.agenda === 'crew').length === N.crews_out_of_town.region_crews, wild.filter(w => w.agenda === 'crew').length);
ok('parties at once = valley + places + wild', N.parties_at_once.ours === N.parties_at_once.valley_measured + fromPlaces + fromWild, N.parties_at_once.ours);
ok('Battle Brothers\' party count is left honest: null with the emergent line', N.parties_at_once.bb === null && /no published/.test(N.parties_at_once.bb_note || ''));
/* the rows handed to the real parties module, the way RUN will hand them */
const power = f => (G.factions[f] && typeof G.factions[f].act1_power === 'number') ? G.factions[f].act1_power : null;
const rows = places.map(p => ({ faction: p.holder, tier: p.tier, kind: p.kind, x: Math.round(mid + p.east), y: Math.round(mid - p.north), power: power(p.holder) }))
  .concat(wild.map(w => ({ faction: w.faction, tier: w.tier, kind: w.kind, x: Math.round(mid + w.east), y: Math.round(mid - w.north), power: T.TIERS.length - T.TIERS.indexOf(w.tier), wild: true, ground: w.ground })))
  .concat(settled.map(w => ({ faction: w.faction, tier: w.tier, kind: w.kind, x: Math.round(mid + w.east), y: Math.round(mid - w.north), power: T.TIERS.length - T.TIERS.indexOf(w.tier), ground: w.ground })));
const both = P.all(seats.concat(rows), { n: m.n });
const regionParties = both.length - valley.length;
ok('handed to the real parties module beside the valley\'s seats, the region sends exactly what the file says (places + wild and settled locations)', regionParties === fromPlaces + (fromWild - (D.roaming_without_a_base || []).length), regionParties);
ok('every region row sent at least one party (nothing silent)', rows.every(r => both.some(p => p.from.x === r.x && p.from.y === r.y)));
ok('the valley\'s own parties did not change under the region\'s rows', both.filter(p => seats.some(s => s.x === p.from.x && s.y === p.from.y)).length === valley.length);
const wildAgendas = {}; both.filter(p => rows.some(r => r.wild && r.x === p.from.x && r.y === p.from.y)).forEach(p => { wildAgendas[p.agenda] = (wildAgendas[p.agenda] || 0) + 1; });
console.log('  measured: today\'s parties module gives the wild locations these agendas: ' + JSON.stringify(wildAgendas) + ' (the between() gap, routed; the rows carry wild:true for the fix)');
ok('the gap is written in the file, not hidden', /CARAVANS/.test(N.crews_out_of_town.reading || '') && N.crews_out_of_town.reading_ours === true);
/* far from civilization */
const civil = places.map(p => ({ east: p.east, north: p.north })).concat(seats.map(s => ({ east: s.x - mid, north: mid - s.y })));
const nearest = w => Math.min.apply(null, civil.map(c => Math.max(Math.abs(c.east - w.east), Math.abs(c.north - w.north))));
const FAR = D.rules.far_from_civilization_fields_the_late_mix;
ok('the far threshold is ours, draft, named for TUNING, with its wiki line', FAR && FAR.ours === true && FAR.draft === true && /TUNING/.test(FAR.for || '') && !!school[(FAR.wiki || '').split('.').pop()] && typeof FAR.far_blocks === 'number');
const bands = wild.map(w => ({ id: w.id, d: nearest(w), band: nearest(w) > FAR.far_blocks ? 'late' : 'early' }));
console.log('  bands: ' + bands.map(b => b.id + ' ' + b.d + ' ' + b.band).join(', '));
ok('some wild locations are near the towns and some are far (both bands exist on the real map)', bands.some(b => b.band === 'early') && bands.some(b => b.band === 'late'));
ok('the dump at Apex is far and the quarry crew at Sloan is near (measured, not guessed: Nelson sits 46 blocks from two towns)', (bands.find(b => b.id === 'apex_dead') || {}).band === 'late' && (bands.find(b => b.id === 'sloan_quarry_crew') || {}).band === 'early');
/* every number that is ours says so */
for (const k of Object.keys(D.rules)) {
  const r = D.rules[k];
  ok('rules.' + k + ': says whether it is ours and names a wiki line or a module', typeof r.ours === 'boolean' && (!!school[(r.wiki || '').split('.').pop()] || !!r.source));
  if (r.ours && Object.keys(r).some(f => typeof r[f] === 'number')) ok('rules.' + k + ': an ours number is draft and for TUNING', r.draft === true && /TUNING/.test(r.for || ''));
}
ok('the gaps are named (greenskins, city states, the three with no region ground)', Array.isArray(D.gaps) && D.gaps.length >= 4 && D.gaps.some(g => /greenskins/.test(g)) && D.gaps.some(g => /Colorful/.test(g)));
ok('the routing names RUN, WORLD, TUNING and EYES', D.routed && D.routed.RUN && D.routed['WORLD [the region]'] && D.routed.TUNING && D.routed['EYES [the map\'s four numbers]']);

/* ---- 4. THE FOUR SEATED (FACTIONS [four seated] 10/18, rule 42a, rule 37e): the human floor's keepers, eye in the sky,
   block watch and runners had rosters, grounds and wants and NO SEAT, so their wants moved nobody. Each now has a real
   place on WORLD's real land (engine/BOHEMIA_REGION_LAND.json, read through engine/bohemia_region_land.js), or, the
   watch, none on purpose (Battle Brothers' militia are the settlement's own people). One function holds every rule, so
   the planted mistakes below run the very same checks. ---- */
const RL = require(path.join(ROOT, 'engine/bohemia_region_land.js')).load(JSON.parse(fs.readFileSync(path.join(ROOT, 'engine/BOHEMIA_REGION_LAND.json'), 'utf8')));
const REAL = { e: 'x1' }, WPL = RL.places(REAL), REGION_KINDS = new Set(Object.values(RL.json.legend || {}));
const W = require(path.join(ROOT, 'engine/bohemia_wants.js')), BT = require(path.join(ROOT, 'engine/bohemia_boardterrain.js'));
const WJ = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/wants.json'), 'utf8'));
const FOUR = ['barbarians', 'city_states', 'militia', 'goblins'];
/* measured first: three more of the twelve had no seat and no reason either (the house, the head takers, the flock),
   so the same job seats or reasons them: WILD camps send crews, SETTLED seats are cities and forts, the rest say why */
const WILD_SEATS = ['barbarians', 'goblins'], SETTLED_SEATS = ['city_states', 'noble_houses'];
function fourSeated(d) {
  const bad = [], rowsOf = f => (d.hostile_locations || []).concat(d.settled_locations || []).filter(w => w.faction === f);
  const seatAt = w => ({ x: Math.round(mid + w.east), y: Math.round(mid - w.north) });
  const civ = (d.region_places || []).map(p => seatAt(p)).concat(seats.map(s => ({ x: s.x, y: s.y })));
  for (const f of WILD_SEATS.concat(SETTLED_SEATS)) {
    const r = rowsOf(f);
    if (r.length !== 1) { bad.push('SEAT_COUNT ' + f + ' ' + r.length); continue; }
    const w = r[0], at = seatAt(w), wp = WPL.find(p => p.name === w.world_place), a = RL.at(at.x, at.y, REAL);
    const own = (fjById[f] || {}).ground || [];
    if (!wp) { bad.push('NOT_A_WORLD_PLACE ' + w.id + ' ' + w.world_place); continue; }
    if (Math.max(Math.abs(wp.x - at.x), Math.abs(wp.y - at.y)) > 1) bad.push('OFF_THE_PLACE ' + w.id);
    if (!a || a.pass === 3) bad.push('CANNOT_STAND ' + w.id);
    else if (w.ground.indexOf(a.kind) < 0) bad.push('GROUND_IS_NOT_THE_ROWS ' + w.id + ' ' + a.kind);
    else if (own.indexOf(a.kind) < 0 && !(own.every(k => !REGION_KINDS.has(k)) && wp.x === at.x && wp.y === at.y)) bad.push('NOT_ITS_OWN_GROUND ' + w.id + ' ' + a.kind);
    if (!fjById[f] || !fjById[f].base || fjById[f].base.seat !== w.id) bad.push('BASE_DOES_NOT_NAME_IT ' + f);
    if (SETTLED_SEATS.indexOf(f) >= 0 && (w.wild !== false || (d.hostile_locations || []).indexOf(w) >= 0)) bad.push('A_CITY_OR_A_HOUSE_IS_A_SETTLEMENT ' + w.id);
    if (WILD_SEATS.indexOf(f) >= 0 && (w.wild !== true || w.tier !== 'camp' || w.agenda !== 'crew')) bad.push('A_CAMP_IN_THE_WILD_SENDS_CREWS ' + w.id);
    if (f === 'barbarians' && !(w.north > d.frame.city_half)) bad.push('THE_WILDMEN_ARE_NORTH ' + w.id);
    if (f === 'goblins' && Math.min.apply(null, civ.map(c => Math.max(Math.abs(c.x - at.x), Math.abs(c.y - at.y)))) < 11) bad.push('GOBLIN_LAND_IS_11_FROM_A_SETTLEMENT ' + w.id);
  }
  if (rowsOf('militia').length) bad.push('THE_WATCH_HAS_NO_SEAT');
  const noSeat = d.no_seat || [];
  for (const n of noSeat) {
    if (rowsOf(n.faction).length) bad.push('NO_SEAT_MEANS_NO_ROW ' + n.faction);
    if (!school[(n.wiki || '').split('.').pop()] || typeof n.why !== 'string' || n.why.length < 40) bad.push('A_NO_SEAT_SAYS_WHY_WITH_ITS_WIKI_LINE ' + n.faction);
    if (n.rule && !d.rules[n.rule]) bad.push('A_NO_SEAT_RULE_EXISTS ' + n.faction);
  }
  if (!noSeat.some(n => n.faction === 'militia' && n.rule === 'the_watch_turns_out_where_a_crew_goes')) bad.push('THE_WATCH_RULE_IS_WRITTEN');
  const kb = (WJ.wants['keep-the-block'] || {}).turns_out;
  if (!kb || (kb.tiers || []).indexOf('fortress') >= 0) bad.push('THE_WATCH_TURNS_OUT_AT_TOWNS_AND_CAMPS');
  if (!d.rules.the_watch_turns_out_where_a_crew_goes || !school[(d.rules.the_watch_turns_out_where_a_crew_goes.wiki || '').split('.').pop()]) bad.push('THE_WATCH_RULE_IS_WRITTEN');
  const held = new Set((d.hostile_locations || []).concat(d.settled_locations || []).map(w => w.faction).filter(f => !!fjById[f]));
  const roams = new Set((d.roaming_without_a_base || []).map(r => r.faction));
  const reasoned = new Set(noSeat.map(n => n.faction));
  const why = (FJ.factions || []).filter(f => held.has(f.id) || roams.has(f.id) || reasoned.has(f.id));
  for (const f of FJ.factions || []) {
    const seat = f.base && f.base.seat;
    if (held.has(f.id) && WILD_SEATS.concat(SETTLED_SEATS).indexOf(f.id) >= 0) continue;
    if ((roams.has(f.id) || reasoned.has(f.id)) && seat !== null) bad.push('A_FACTION_WITHOUT_A_SEAT_SAYS_SEAT_NULL ' + f.id);
  }
  const fr = (d.the_numbers || {}).factions_on_the_region || {};
  if (fr.ours !== held.size) bad.push('FACTIONS_ON_THE_REGION_IS_THE_COUNT ' + held.size + ' vs ' + fr.ours);
  if (fr.with_a_reason !== why.length || why.length !== (FJ.factions || []).length) bad.push('EVERY_FACTION_HAS_A_SEAT_OR_A_REASON ' + why.length);
  return bad;
}
{
  const real = fourSeated(D);
  ok('THE FOUR SEATED hold on the real file and WORLD\'s real land', real.length === 0, real.join('; '));
  for (const w of wild.concat(settled)) {
    const x = Math.round(mid + w.east), y = Math.round(mid - w.north), a = RL.at(x, y, REAL), wp = WPL.find(p => p.name === w.world_place);
    console.log('  on WORLD\'s land: ' + w.id + ' (' + x + ',' + y + ') ' + (a ? a.kind : '?') + (wp ? ', ' + Math.max(Math.abs(wp.x - x), Math.abs(wp.y - y)) + ' from ' + wp.name : ', no world_place yet (gaps: [the wild on real land])'));
  }
  ok('the eight older wild rows are named as off WORLD\'s land in the gaps, not hidden', D.gaps.some(g => /NOT ON WORLD'S REAL LAND/.test(g) && /the wild on real land/.test(g)));
  /* the planted mistakes: each must turn the check red by its own name */
  const plant = (name, fn) => { const c = JSON.parse(JSON.stringify(D)); fn(c); const b = fourSeated(c); ok('planted ' + name + ' turns it red by name', b.some(x => x.indexOf(name) === 0), b.join('; ') || 'nothing'); };
  const row = (c, id) => (c.hostile_locations || []).concat(c.settled_locations || []).find(w => w.id === id);
  plant('NOT_ITS_OWN_GROUND', c => { const w = row(c, 'corn_creek_keepers'); w.east = -45; w.north = 89; w.ground = ['golf_and_park']; });
  plant('GROUND_IS_NOT_THE_ROWS', c => { row(c, 'corn_creek_keepers').ground = ['hills']; });
  plant('OFF_THE_PLACE', c => { row(c, 'valley_of_fire_runners').east = 140; });
  plant('NOT_A_WORLD_PLACE', c => { row(c, 'lake_las_vegas_eye').world_place = 'THE MADE-UP RESORT'; });
  plant('A_CITY_OR_A_HOUSE_IS_A_SETTLEMENT', c => { const w = c.settled_locations.shift(); w.wild = true; w.agenda = 'crew'; c.hostile_locations.push(w); });
  plant('NO_SEAT_MEANS_NO_ROW', c => { c.hostile_locations.push(Object.assign(JSON.parse(JSON.stringify(row(c, 'corn_creek_keepers'))), { id: 'a_trailer_chapel', faction: 'cultists' })); });
  plant('A_NO_SEAT_SAYS_WHY_WITH_ITS_WIKI_LINE', c => { c.no_seat.find(n => n.faction === 'cultists').wiki = 'school.a_line_nobody_wrote'; });
  plant('EVERY_FACTION_HAS_A_SEAT_OR_A_REASON', c => { c.no_seat = c.no_seat.filter(n => n.faction !== 'cultists'); });
  plant('OFF_THE_PLACE', c => { row(c, 'apex_depot_house').north = 80; });
  plant('A_CAMP_IN_THE_WILD_SENDS_CREWS', c => { row(c, 'valley_of_fire_runners').agenda = 'patrol'; });
  plant('THE_WILDMEN_ARE_NORTH', c => { row(c, 'corn_creek_keepers').north = -90; });
  plant('THE_WATCH_HAS_NO_SEAT', c => { c.hostile_locations.push(Object.assign(JSON.parse(JSON.stringify(row(c, 'corn_creek_keepers'))), { id: 'a_watch_house', faction: 'militia' })); });
  plant('SEAT_COUNT', c => { c.hostile_locations = c.hostile_locations.filter(w => w.faction !== 'goblins'); });
  plant('FACTIONS_ON_THE_REGION_IS_THE_COUNT', c => { c.the_numbers.factions_on_the_region.ours -= 1; });
  plant('THE_WATCH_RULE_IS_WRITTEN', c => { c.no_seat.find(n => n.faction === 'militia').rule = null; });
  plant('A_NO_SEAT_RULE_EXISTS', c => { delete c.rules.the_watch_turns_out_where_a_crew_goes; });
  { const fz = FJ.factions.find(f => f.id === 'cultists').base, was = fz.seat; fz.seat = 'somewhere'; const b = fourSeated(D); fz.seat = was;
    ok('planted A_FACTION_WITHOUT_A_SEAT_SAYS_SEAT_NULL turns it red by name', b.some(x => x.indexOf('A_FACTION_WITHOUT_A_SEAT_SAYS_SEAT_NULL') === 0), b.join('; ')); }
  { const c = JSON.parse(JSON.stringify(D)), keep = (FJ.factions.find(f => f.id === 'goblins') || {}).base, was = keep && keep.seat;
    if (keep) keep.seat = 'somewhere_else'; const b = fourSeated(c); if (keep) keep.seat = was;
    ok('planted BASE_DOES_NOT_NAME_IT turns it red by name', b.some(x => x.indexOf('BASE_DOES_NOT_NAME_IT') === 0), b.join('; ')); }
  { const c = JSON.parse(JSON.stringify(D)); const w = row(c, 'valley_of_fire_runners'); w.east = 60; w.north = -20;
    w.world_place = 'LAKE LAS VEGAS'; const lv = WPL.find(p => p.name === 'LAKE LAS VEGAS'); w.east = lv.x - 48; w.north = 48 - lv.y; w.ground = ['golf_and_park'];
    const b = fourSeated(c); ok('planted: the runners moved beside the city break Goblin Land (11 blocks from a settlement) or their ground', b.some(x => /GOBLIN_LAND|NOT_ITS_OWN_GROUND/.test(x)), b.join('; ')); }

  /* through BohemiaWants.all: the parties at once moved with the seats */
  const DATA = { factions: FJ, wants: WJ }, cells = W.cellsOf(m, BT);
  const MOVERS = FOUR.concat(['noble_houses']);
  const noFour = JSON.parse(JSON.stringify(D)); noFour.hostile_locations = noFour.hostile_locations.filter(w => MOVERS.indexOf(w.faction) < 0); noFour.settled_locations = [];
  const rowsFrom = d => d.region_places.map(p => ({ faction: p.holder, tier: p.tier, kind: p.kind, x: Math.round(mid + p.east), y: Math.round(mid - p.north), power: power(p.holder) }))
    .concat(d.hostile_locations.map(w => ({ faction: w.faction, tier: w.tier, kind: w.kind, x: Math.round(mid + w.east), y: Math.round(mid - w.north), power: T.TIERS.length - T.TIERS.indexOf(w.tier), wild: true, ground: w.ground })))
    .concat((d.settled_locations || []).map(w => ({ faction: w.faction, tier: w.tier, kind: w.kind, x: Math.round(mid + w.east), y: Math.round(mid - w.north), power: T.TIERS.length - T.TIERS.indexOf(w.tier), ground: w.ground })));
  const was = W.all(seats.concat(rowsFrom(noFour)), { n: m.n, data: DATA, cells }), now = W.all(seats.concat(rowsFrom(D)), { n: m.n, data: DATA, cells });
  const moved = ps => MOVERS.filter(f => ps.some(p => p.from.faction === f));
  console.log('  through BohemiaWants.all: BEFORE ' + was.length + ' parties (' + was.filter(p => p.turned_out).length + ' watch), the five moving: ' + (moved(was).join(', ') || 'none')
    + '; AFTER ' + now.length + ' parties (' + now.filter(p => p.turned_out).length + ' watch), the five moving: ' + moved(now).join(', '));
  ok('BEFORE (measured): none of the four or the house moved but the watch, which turns out where crews go', moved(was).every(f => f === 'militia'), moved(was).join());
  ok('AFTER: all five move (the keepers, the eye, the watch, the runners, the house)', moved(now).length === 5, moved(now).join());
  ok('AFTER: the region\'s seats added exactly REACH over the three new rows, plus the watch where crews now go',
    now.filter(p => !p.turned_out).length - was.filter(p => !p.turned_out).length === wild.concat(settled).filter(w => MOVERS.indexOf(w.faction) >= 0).reduce((s, w) => s + reach(w.tier), 0));
  ok('the factions holding region rows are recounted: ' + (D.the_numbers.factions_on_the_region || {}).before + ' before, ' + (D.the_numbers.factions_on_the_region || {}).ours + ' now',
    new Set(noFour.hostile_locations.map(w => w.faction).filter(f => !!fjById[f])).size === (D.the_numbers.factions_on_the_region || {}).before);
}

console.log('\n=== REGION BASES GATE: ' + pass + ' passed, ' + fail + ' failed ===');
process.exit(fail ? 1 : 0);
