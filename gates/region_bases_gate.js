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
for (const r of D.roaming_without_a_base || []) {
  ok(r.id + ': a company without a base is ours, draft, with its wiki line', r.ours === true && r.draft === true && !!school[(r.wiki || '').split('.').pop()] && enFac.has(r.faction));
}

/* ---- 3. the numbers are recomputed ---- */
const N = D.the_numbers;
ok('settlements: 14 valley seats + the twelve places = ours, and ours meets or beats Battle Brothers', N.settlements.valley_seats + N.settlements.region_places === N.settlements.ours && N.settlements.region_places === places.length && N.settlements.ours >= bbSettlements && N.settlements.met === (N.settlements.ours >= bbSettlements));
ok('hostile locations: the count is the list', N.hostile_locations.ours === wild.length && N.hostile_locations.bb === null && /does not say/.test(N.hostile_locations.bb_note || ''));
const reach = t => Object.prototype.hasOwnProperty.call(T.REACH, t) ? T.REACH[t] : T.REACH.camp;
const fromPlaces = places.reduce((s, p) => s + reach(p.tier), 0), fromWild = wild.reduce((s, w) => s + reach(w.tier), 0) + (D.roaming_without_a_base || []).length;
ok('parties from the places = the sum of REACH over their tiers (read off the towns module)', N.parties_at_once.region_from_places === fromPlaces, fromPlaces);
ok('parties from the wild = REACH over the locations plus the companies without a base', N.parties_at_once.region_from_locations === fromWild, fromWild);
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
  .concat(wild.map(w => ({ faction: w.faction, tier: w.tier, kind: w.kind, x: Math.round(mid + w.east), y: Math.round(mid - w.north), power: T.TIERS.length - T.TIERS.indexOf(w.tier), wild: true })));
const both = P.all(seats.concat(rows), { n: m.n });
const regionParties = both.length - valley.length;
ok('handed to the real parties module beside the valley\'s seats, the region sends exactly what the file says (places + wild locations)', regionParties === fromPlaces + (fromWild - (D.roaming_without_a_base || []).length), regionParties);
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

console.log('\n=== REGION BASES GATE: ' + pass + ' passed, ' + fail + ' failed ===');
process.exit(fail ? 1 : 0);
