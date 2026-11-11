#!/usr/bin/env node
/* ============================================================================
   EVERY MAP KIND HAS ITS FIGHT ANSWER (WORLD THIRTEEN 11/7, VAMILY rule 429(b), ask line 505)

   Paolo 11/7: 'maybe the combat map is just the whole map itself... for every building that we have on the regular map we need
   to answer for that in the combat map'. ONE MAP: the fight is cut from the map where it starts, so every kind the map draws
   needs a row in records/target/bb/map_fight_kinds.json (storeys, in or on its roof, cover, what blocks), and this gate fails
   on any kind without one.

   NODE (no browser):
     F1  every district kind the generator makes (engine/bohemia_overmap.js DISTRICT) has a row
     F2  every town lot (VB_TOWN_K), landmark (VB_TOWN_MARKS) and the wall and its towers have a row
     F3  every piece of your own lot (records/target/bb/home_lots.json) has a row
     F4  every house model the map stands on a lot (slices/bohemia_map_houses.js) has a row
     F5  every row is well formed: a storeys mix over 1, 2, 3 summing to 1 for anything built, a known man / cover / blocks
     F6  423(c)(d): every house, trailer and slab is a tile a man can be on (in it or on its roof); no ladder anywhere
     F7  428(b): three storeys are rare on houses (at most 15 in 100 of a kind), most houses one or two storeys
     F8  426(a): every houses-family kind fronts a street; the trailer park is the one exception
     F9  every row's class is the painter's own (vbClassOf in slices/BOHEMIA_CITY_WORLD.html), so the table and the map agree
     F10 the engine's rows are the file's, word for word (tools/bohemia_world_thirteen_fight_kinds_sync.js)
     F11 the painter reads it: a house's wall comes from the table's storeys (vbMixStorey), the old one-in-seven roll is gone
     F14 429(g): every map kind carries its land-use zone
     F13 429(f): over 22 generated valleys every district that lands has its row
     F15 (11/11, 429(a)(b)(c), 430) every row names the piece of the fight's kit that answers it: every map kind what the fight
         deals for a cell of it (the board kind, the block families, the lead, the place board with its landmark and field blocks)
         and every row what the board cut from the map lays (tile kinds, kit pieces); stand-ins marked, with what is wanted
     F16 every name is the kit's own: each family has a block in fight_ground.json, each landmark and field block is one, each place
         board is one, each deal kind is a board, a family or an alias the fight knows, each cut piece is in street_board.json,
         fight_ground.json's cover or kit_cover
     F17 the pieces are the fight's own: re-derived from BOHEMIA_BOARD_KINDS.json, ours.json's board_grounds and place_boards and
         bohemia_street_board.js (tools/bohemia_world_thirteen_pieces.py --check), and the engine carries them (F10)
     F12 PLANTED FAIL: the same checks over the file with suburb's row taken out, a ladder put in, and a new map kind with no row
         must go red on each, or this gate cannot fail and proves nothing; from 11/11 also suburb's piece taken out, a family the kit
         does not have, a cut piece the kit does not have
   PAGE (the demo, phone profile):
     P1  the map page carries the table (window.BohemiaFightKinds) and every district on the live valley has a row
     P2  the houses the map paints: the storeys vbHouseStorey reads for every standing house on the valley, a real mix
         (one storey most, two common, three rare), not one in seven
     P3  the painter stands them that tall: the tallest house on the painting is a three-storey wall
   PAGE (the fight, BOHEMIA_FIGHT.html on a phone, upright and on its side):
     P4  the fight page carries the pieces (BohemiaFightKinds.piece) and, dealt a board for every map kind the way a fight on the
         map asks for one (its district and the table's kind), lays only the blocks the table names for it: the place's landmark
         and field where a built place stands there, else the kind's families; the boards that are not dealt from blocks (the
         freeway's, the casino floor) said by name

     node gates/the_map_kinds_have_fight_answers_gate.js [--node]
   ============================================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const FILE = path.join(ROOT, 'records/target/bb/map_fight_kinds.json');
const MAP = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const SYNC = require(path.join(ROOT, 'tools/bohemia_world_thirteen_fight_kinds_sync.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n); } };
const done = () => { console.log('EVERY MAP KIND HAS ITS FIGHT ANSWER: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

const MAN = ['in_or_roof', 'in', 'roof', 'open', 'none'], COVER = ['full', 'half', 'none'];
const BLOCKS = ['walls', 'fence', 'water', 'cliff', 'rows', 'barrier', 'rail'];
const HOUSELIKE = ['house', 'trailer', 'slab'];

function districtsOfGenerator() {
  const s = fs.readFileSync(path.join(ROOT, 'engine/bohemia_overmap.js'), 'utf8');
  const m = s.match(/const DISTRICT=\{[\s\S]*?\};/);
  const D = (0, eval)('(' + m[0].slice('const DISTRICT='.length, -1) + ')');
  return Object.values(D);
}
function mapSrc() { return fs.readFileSync(MAP, 'utf8'); }
function townKinds(src) {
  const k = src.match(/var VB_TOWN_K = (\{[^}]*\});/), m = src.match(/var VB_TOWN_MARKS = (\[[\s\S]*?\]);/);
  const K = (0, eval)('(' + k[1] + ')');
  return { lots: Object.keys(K).filter((n) => n !== 'mark'), marks: (0, eval)(m[1]) };
}
function modelKinds() {
  const s = fs.readFileSync(path.join(ROOT, 'slices/bohemia_map_houses.js'), 'utf8');
  const m = s.match(/houses: (\[[^\]]*\]), trailer: '([a-z_]+)'/);
  return (0, eval)(m[1]).concat([m[2]]);
}
function homeKinds() { return JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/home_lots.json'), 'utf8')).pieces.map((p) => p.id); }
function classOf(src) {
  const a = src.indexOf('var VB_CLASS = {'), b = src.indexOf('/* __THE_MAP_STANDS_UP__ (10/23): the painting wears');
  const f = new Function('window', src.slice(a, b) + '\nreturn { vbClassOf: vbClassOf, VB_CLASS: VB_CLASS };')({});
  const names = {}; Object.keys(f.VB_CLASS).forEach((k) => { names[f.VB_CLASS[k]] = k; });
  return (d) => names[f.vbClassOf(d)];
}

/* the checks, as a function of a table and the kinds, so F12 can run them on a planted copy */
function check(J, want) {
  const out = [], rowsOf = (o) => Object.keys(o || {}).map((k) => [k, o[k]]);
  const all = [].concat(rowsOf(J.districts).map((r) => ['district', r[0], r[1]]), rowsOf(J.town && J.town.lots).map((r) => ['townlot', r[0], r[1]]),
    rowsOf(J.town && J.town.marks).map((r) => ['townmark', r[0], r[1]]), rowsOf(J.town && J.town.works).map((r) => ['townworks', r[0], r[1]]),
    rowsOf(J.home && J.home.pieces).map((r) => ['home', r[0], r[1]]), rowsOf(J.models && J.models.houses).map((r) => ['model', r[0], r[1]]));
  const miss = (list, o) => list.filter((k) => !(o && Object.prototype.hasOwnProperty.call(o, k)));
  out.push(['F1', miss(want.districts, J.districts)]);
  out.push(['F2', [].concat(miss(want.lots, J.town && J.town.lots), miss(want.marks, J.town && J.town.marks), miss(['wall', 'corner_tower', 'gate_tower'], J.town && J.town.works))]);
  out.push(['F3', miss(want.home, J.home && J.home.pieces)]);
  out.push(['F4', miss(want.models, J.models && J.models.houses)]);
  const bad5 = [], bad6 = [], bad7 = [], bad8 = [], bad9 = [];
  all.forEach(([ns, k, r]) => {
    const tag = ns + ':' + k, s = r.storeys || {}, ks = Object.keys(s), sum = ks.reduce((a, b) => a + (+s[b] || 0), 0);
    const built = r.building !== 'none' && r.man !== 'open' && r.man !== 'none';
    if (MAN.indexOf(r.man) < 0 || COVER.indexOf(r.cover) < 0 || COVER.indexOf(r.open_cover) < 0 || !Array.isArray(r.blocks)
      || r.blocks.some((b) => BLOCKS.indexOf(b) < 0) || ks.some((x) => !/^[123]$/.test(x)) || (built && Math.abs(sum - 1) > 1e-6) || typeof r.is !== 'string') bad5.push(tag);
    if (HOUSELIKE.indexOf(r.building) >= 0 && r.man !== 'in_or_roof') bad6.push(tag + ' (' + r.man + ')');
    if (/ladder/i.test(JSON.stringify(r))) bad6.push(tag + ' (a ladder)');
    if (r.building === 'house' && ((+s['3'] || 0) > 0.15 || (+s['1'] || 0) + (+s['2'] || 0) < 0.85)) bad7.push(tag);
    if (ns === 'district' && r.class === 'houses' && (k === 'trailer' ? r.street_front !== false : r.street_front !== true)) bad8.push(tag);
    if (ns === 'district' && want.classOf && want.classOf(k) !== r.class) bad9.push(tag + ' (table ' + r.class + ', painter ' + want.classOf(k) + ')');
  });
  out.push(['F5', bad5]); out.push(['F6', bad6]); out.push(['F7', bad7]); out.push(['F8', bad8]); out.push(['F9', bad9]);
  return out;
}

/* THE KIT (11/11): every name a piece may use */
function kitNames() {
  const fg = JSON.parse(fs.readFileSync(path.join(ROOT, 'slices/fight_ground/fight_ground.json'), 'utf8'));
  const sb = JSON.parse(fs.readFileSync(path.join(ROOT, 'slices/fight_ground/street_board/street_board.json'), 'utf8'));
  const ours = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/ours.json'), 'utf8'));
  const blocks = new Set(Object.keys(fg.blocks)), fams = new Set();
  Object.values(fg.boards).forEach((b) => b.blocks.forEach((r) => r.forEach((n) => blocks.add(n.split('|')[0]))));
  blocks.forEach((n) => fams.add(n.split('.')[0]));
  const mix = ours.board_mix.value || ours.board_mix, kinds = new Set(Object.keys(fg.boards).concat([...fams], Object.keys(mix.aliases || {})));
  const cover = new Set(Object.keys(fg.cover).concat(Object.keys(fg.cover_extra), fs.readdirSync(path.join(ROOT, 'slices/fight_ground/kit_cover')).filter((f) => /^cover_.*\.webp$/.test(f)).map((f) => f.slice(6, -5))));
  return { blocks, fams, boards: new Set(Object.keys(fg.boards)), kinds, cover, houses: new Set(Object.keys(sb.houses)), buildings: new Set(Object.keys(sb.buildings)), ground: new Set(Object.keys(sb.ground)), streets: new Set(Object.keys(sb.streets.pieces)) };
}
function pieceCheck(J, K) {
  const f15 = [], f16 = [];
  const cutOK = (c, who) => { if (!c || !Array.isArray(c.tiles) || !c.tiles.length || !Array.isArray(c.pieces) || !c.pieces.length) { f15.push(who + ' (no cut)'); return; }
    if (c.stand_in && !c.wants) f15.push(who + ' (a stand-in that does not say what is wanted)');
    c.pieces.forEach((pc) => { const i = pc.indexOf(':'), ns = pc.slice(0, i), n = pc.slice(i + 1);
      const good = ns === 'house' ? K.houses.has(n) : ns === 'building' ? K.buildings.has(n) : ns === 'ground' ? K.ground.has(n) : ns === 'streets' ? (n === '*' || K.streets.has(n)) : ns === 'cover' ? K.cover.has(n) : false;
      if (!good) f16.push(who + ' cut ' + pc); }); };
  Object.keys(J.districts).forEach((d) => { const p = J.districts[d].piece, dl = p && p.deal;
    if (!dl || !dl.kind || !Array.isArray(dl.families) || !dl.families.length || dl.lead !== dl.families[0]) { f15.push(d + ' (no deal)'); }
    else {
      if (!K.kinds.has(dl.kind)) f16.push(d + ' kind ' + dl.kind);
      dl.families.forEach((f) => { if (!K.fams.has(f)) f16.push(d + ' family ' + f); });
      if (dl.place) { if (!K.boards.has(dl.place)) f16.push(d + ' place ' + dl.place); if (!K.blocks.has(dl.landmark)) f16.push(d + ' landmark ' + dl.landmark); (dl.field || []).forEach((b) => { if (!K.blocks.has(b)) f16.push(d + ' field ' + b); }); if (!(dl.field || []).length) f15.push(d + ' (a place with no field)'); }
      if (dl.stand_in && !dl.wants) f15.push(d + ' (a stand-in board that does not say what is wanted)');
    }
    cutOK(p && p.cut, d); });
  const other = [['townlot', J.town.lots], ['townmark', J.town.marks], ['townworks', J.town.works], ['home', J.home.pieces], ['model', J.models.houses]];
  other.forEach(([ns, T]) => Object.keys(T).forEach((k) => { const p = T[k].piece; if (!p) { f15.push(ns + ':' + k + ' (no piece)'); return; }
    if (ns !== 'model' && !(p.deal === 'town' && J.districts.town)) f15.push(ns + ':' + k + ' (deals no board)'); cutOK(p.cut, ns + ':' + k); }));
  const rows = (J.places && J.places.rows) || {};
  Object.keys(rows).forEach((k) => { const p = rows[k].piece; if (!p || !J.districts[p.deal]) f15.push('place:' + k + ' (no piece)'); else cutOK(p.cut, 'place:' + k); });
  return [['F15', f15], ['F16', f16]];
}

(async () => {
  const J = JSON.parse(fs.readFileSync(FILE, 'utf8')), src = mapSrc(), tk = townKinds(src);
  const want = { districts: districtsOfGenerator(), lots: tk.lots, marks: tk.marks, home: homeKinds(), models: modelKinds(), classOf: classOf(src) };
  const res = check(J, want), say = {
    F1: 'every district kind the generator makes (' + want.districts.length + ') has its fight answer',
    F2: 'every town lot (' + want.lots.length + '), landmark (' + want.marks.length + ') and the wall and its two towers have one',
    F3: 'every piece of your own lot (' + want.home.length + ') has one', F4: 'every house model the map stands on a lot (' + want.models.length + ') has one',
    F5: 'every row is well formed (a storeys mix summing to 1 for anything built, a known man, cover and blocks)',
    F6: 'every house, trailer and slab is a tile a man can be on, in it or on its roof (423(c)); no ladder anywhere (423(d))',
    F7: 'three storeys rare on houses (at most 0.15 of a kind), most houses one or two (428(b))',
    F8: 'every houses kind fronts a street, the trailer park the one exception (426(a))',
    F9: 'every row\'s class is the painter\'s own (vbClassOf)' };
  res.forEach(([leg, bad]) => ok(leg + ' ' + say[leg] + (bad.length ? ': MISSING OR WRONG ' + bad.slice(0, 8).join(', ') + (bad.length > 8 ? ' +' + (bad.length - 8) : '') : ''), bad.length === 0));

  const eng = fs.readFileSync(SYNC.ENGINE, 'utf8');
  ok('F10 the engine\'s rows are the file\'s word for word (the sync tool writes nothing new)', SYNC.written(eng) === eng);
  const core = src.slice(src.indexOf('function vbCityCore(inp){'), src.indexOf('var VB_ONE_MAP = true'));
  ok('F11 the painter stands a house from the table (vbMixStorey on its own roll; the worker is sent VB_STOREYS) and the one-in-seven roll is gone',
    /vbMixStorey\(STO\.house\[sb\]/.test(core) && core.indexOf('hl > 0.86 ? 4 : 2') < 0 && /var VB_STOREYS=' \+ JSON\.stringify\(vbStoreysTable\(\)\)/.test(src)
    && /<script src="\.\.\/engine\/bohemia_fight_kinds\.js"><\/script>/.test(src));

  /* F14 (429(g)): every map kind carries its land-use zone, the zone the land-use file puts it in */
  const LUF = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/land_use.json'), 'utf8')), ZOF = {};
  Object.keys(LUF.zones).forEach((z) => LUF.zones[z].districts.forEach((d) => { ZOF[d] = z; }));
  const badZ = Object.keys(J.districts).filter((d) => J.districts[d].zone !== ZOF[d]);
  ok('F14 every map kind carries its land-use zone (the land-use file\'s)' + (badZ.length ? ': WRONG ' + badZ.slice(0, 8).join(', ') : ''), badZ.length === 0);
  /* F13 (429(f)): over many generated valleys, every kind that lands on one has its row */
  const OM = require(path.join(ROOT, 'engine/bohemia_overmap.js')), seen = {}, miss13 = {};
  [1337, 7, 42, 2026, 99, 31337, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 2691674296].forEach((sd) => { OM.buildOvermap(sd).tiles.forEach((t) => { seen[t.district] = 1; if (!J.districts[t.district]) miss13[t.district] = 1; }); });
  ok('F13 over 22 generated valleys every kind that lands (' + Object.keys(seen).length + ') has its fight answer' + (Object.keys(miss13).length ? ': MISSING ' + Object.keys(miss13).join(', ') : ''), Object.keys(miss13).length === 0);
  /* F15 to F17 (11/11): the piece of the fight's kit that answers every kind */
  const KIT = kitNames(), pc = pieceCheck(J, KIT), nD = Object.keys(J.districts).length;
  const si = Object.keys(J.districts).filter((d) => J.districts[d].piece && J.districts[d].piece.deal && J.districts[d].piece.deal.stand_in);
  const pl = Object.keys(J.districts).filter((d) => J.districts[d].piece && J.districts[d].piece.deal && J.districts[d].piece.deal.place);
  ok('F15 every row names the piece that answers it: ' + nD + ' map kinds what the fight deals (' + pl.length + ' on a place board, ' + si.length + ' on a stand-in, each saying what is wanted), every row what the cut lays' + (pc[0][1].length ? ': MISSING ' + pc[0][1].slice(0, 8).join(', ') : ''), pc[0][1].length === 0);
  ok('F16 every name is the kit\'s own (' + KIT.fams.size + ' block families, ' + KIT.blocks.size + ' blocks, ' + KIT.boards.size + ' boards, ' + (KIT.houses.size + KIT.buildings.size + KIT.ground.size + KIT.streets.size) + ' street-kit pieces, ' + KIT.cover.size + ' cover pieces)' + (pc[1][1].length ? ': NOT IN THE KIT ' + pc[1][1].slice(0, 8).join(', ') : ''), pc[1][1].length === 0);
  let inStep = false; try { inStep = /in step/.test(require('child_process').execFileSync('python3', [path.join(ROOT, 'tools/bohemia_world_thirteen_pieces.py'), '--check'], { encoding: 'utf8' })); } catch (e) { inStep = false; }
  ok('F17 the pieces are the fight\'s own (re-derived from its board kinds, its board grounds and place boards and its cut code: in step) and the engine carries them (piece(\'suburb\') ' + (() => { try { const K = require(path.join(ROOT, 'engine/bohemia_fight_kinds.js')); const p = K.piece('suburb'); return p && p.deal ? p.deal.lead + ', ' + p.deal.place : 'none'; } catch (e) { return 'threw'; } })() + ')',
    inStep && (() => { try { const K = require(path.join(ROOT, 'engine/bohemia_fight_kinds.js')); return !!(K.piece('suburb') && K.piece('suburb').deal && K.piece('townmark:tank').deal && K.families('casino').length); } catch (e) { return false; } })());
  /* F12: plant the faults; each check must catch its own */
  const P1 = JSON.parse(JSON.stringify(J)); delete P1.districts.suburb;
  const P2 = JSON.parse(JSON.stringify(J)); P2.districts.estate.man = 'ladder';
  const P3 = JSON.parse(JSON.stringify(J)); P3.districts.gated.storeys = { '1': 0.2, '3': 0.8 };
  const W4 = Object.assign({}, want, { districts: want.districts.concat(['a_new_map_kind']) });
  const P5 = JSON.parse(JSON.stringify(J)); P5.districts.suburb.street_front = false;
  const red = (r, leg) => r.find((x) => x[0] === leg)[1].length > 0;
  const P6 = JSON.parse(JSON.stringify(J)); delete P6.districts.suburb.piece;
  const P7 = JSON.parse(JSON.stringify(J)); P7.districts.industrial.piece.deal.families = ['works', 'spaceport'];
  const P8 = JSON.parse(JSON.stringify(J)); P8.town.marks.chapel.piece.cut.pieces = ['building:cathedral'];
  const planted = [red(check(P1, want), 'F1'), red(check(P2, want), 'F6'), red(check(P3, want), 'F7'), red(check(J, W4), 'F1'), red(check(P5, want), 'F8'),
    red(pieceCheck(P6, KIT), 'F15'), red(pieceCheck(P7, KIT), 'F16'), red(pieceCheck(P8, KIT), 'F16')];
  ok('F12 PLANTED FAIL: suburb taken out, a ladder, three storeys common, a new map kind with no row, a house with no street, suburb\'s piece taken out, a family the kit does not have, a building the kit does not have: each goes red (' + planted.filter(Boolean).length + '/8)', planted.every(Boolean));

  if (process.argv.includes('--node')) return done();

  const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  let d;
  try { d = await drive.open({ keepCards: true }); }
  catch (e) { ok('the demo boots on the phone [' + String(e.message).slice(0, 120) + ']', false); return done(); }
  try {
    for (let i = 0; i < 120; i++) { if (await d.fr.evaluate(() => !!(window.BohemiaFightKinds && typeof vbCityCore === 'function' && window.om && om.n))) break; await d.page.waitForTimeout(500); }
    const P = await d.fr.evaluate(() => {
      const F = window.BohemiaFightKinds, seen = {}, miss = {};
      if (!F) return { none: true };
      for (let y = 0; y < om.n; y++) for (let x = 0; x < om.n; x++) { const t = om.at(x, y); if (!t) continue; seen[t.district] = 1; if (!F.answer(t.district)) miss[t.district] = 1; }
      /* every standing house on the valley, by the map's own lots */
      const inp = vbCityInput(); inp.lots = true;
      const out = vbCityCore(inp), L = out.lots || [], n = { 0: 0, 1: 0, 2: 0, 3: 0 };
      let houses = 0;
      for (let j = 0; j + 9 < L.length; j += 10) { if (L[j] !== 0) continue; houses++; n[vbHouseStorey(L[j + 1], L[j + 2], L[j + 9])]++; }
      return { kinds: Object.keys(seen).length, miss: Object.keys(miss), houses, n, tall: out.stand ? out.stand.houseMax / out.stand.T : null, T: out.stand && out.stand.T };
    });
    ok('P1 the map page carries the table and every district on the live valley (' + P.kinds + ' kinds) has its fight answer' + (P.miss && P.miss.length ? ': MISSING ' + P.miss.join(', ') : ''), !P.none && P.miss.length === 0 && P.kinds > 30);
    const h = P.houses || 1, s1 = P.n[1] / h, s2 = P.n[2] / h, s3 = P.n[3] / h;
    ok('P2 the valley\'s ' + P.houses + ' standing houses read one storey ' + Math.round(s1 * 100) + '%, two ' + Math.round(s2 * 100) + '%, three ' + Math.round(s3 * 100)
      + '% (one most or level with two, two common, three rare but there; it was one in seven two, never three)', P.houses > 200 && s2 >= 0.25 && s3 > 0 && s3 <= 0.12 && P.n[0] === 0);
    ok('P3 the painter stands them that tall: the tallest house on the painting ' + (P.tall == null ? '?' : P.tall.toFixed(1)) + ' T (a three-storey wall, at least 20 T; the old two-storey top was about 17 T)', P.tall != null && P.tall >= 20);
  } catch (e) { ok('the page legs ran [' + String(e && e.message).slice(0, 160) + ']', false); }
  try { await d.close(); } catch (_e) {}

  /* P4 (11/11): the fight page deals every map kind from the pieces the table names, on a phone upright and on its side */
  for (const [W, H, how] of [[390, 844, 'upright'], [844, 390, 'on its side']]) {
    let fx = null;
    try {
      fx = await openFight(W, H);
      const R = await fx.p.evaluate((ks) => {
        const F = eval('FIGHT'), FK = window.BohemiaFightKinds, out = { has: !!(FK && FK.piece), checked: 0, agree: 0, other: {}, bad: [] };
        if (!out.has) return out;
        ks.forEach((d, i) => { const pc = FK.piece(d), dl = pc && pc.deal; if (!dl) { out.bad.push(d + ' no piece'); return; }
          eval('SEED = ' + (9001 + i)); F.setup({ seed: 9001 + i, speed: 1, kind: dl.kind, district: d, cell: { gx: 40, gy: 40 }, night: false, auto: true, houses: false });
          const B = F.S.boardDef || {}, names = [].concat.apply([], (B.blocks || []).map((r) => r.slice ? r.slice() : []));
          if (!names.length) { const k = String(B.family || B.name || 'none'); out.other[k] = (out.other[k] || 0) + 1; return; }
          out.checked++;
          const may = dl.place ? new Set([dl.landmark].concat(dl.field || [])) : null, fam = new Set(dl.families);
          const off = names.map((n) => String(n).split('|')[0]).filter((n) => may ? !may.has(n) : !fam.has(n.split('.')[0]));
          if (off.length) out.bad.push(d + ': ' + off.slice(0, 3).join(' ')); else out.agree++;
          /* PLANTED: the same board read against the next kind's pieces (a table that named the wrong piece) must be off */
          const w = FK.piece(ks[(i + 7) % ks.length]).deal, wm = w.place ? new Set([w.landmark].concat(w.field || [])) : null, wf = new Set(w.families);
          if (names.some((n) => { const b = String(n).split('|')[0]; return wm ? !wm.has(b) : !wf.has(b.split('.')[0]); })) out.caught = (out.caught | 0) + 1; });
        return out;
      }, Object.keys(J.districts));
      const oth = Object.keys(R.other).map((k) => k + ' ' + R.other[k]).join(', ');
      ok('P4 ' + how + ' (' + W + ' x ' + H + '): the fight page carries the pieces and deals ' + R.agree + ' of ' + R.checked + ' map kinds only from the blocks the table names'
        + (oth ? '; boards not dealt from blocks: ' + oth : '') + '; planted, read against the wrong kind\'s pieces: ' + (R.caught | 0) + ' of ' + R.checked + ' off' + (R.bad.length ? ': OFF THE TABLE ' + R.bad.slice(0, 6).join('; ') : ''),
        R.has && R.checked >= 60 && R.agree === R.checked && (R.caught | 0) >= R.checked * 0.6 && fx.errs.length === 0);
    } catch (e) { ok('P4 ' + how + ' ran [' + String(e && e.message).slice(0, 160) + ']', false); }
    try { if (fx) await fx.close(); } catch (_e) {}
  }
  done();
})();

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.css': 'text/css', '.woff2': 'font/woff2' };
async function openFight(W, H) {
  const http = require('http'), { chromium } = require('playwright');
  const srv = http.createServer((q, r) => {
    const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
    r.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r);
  }).listen(0);
  const br = await chromium.launch();
  const ctx = await br.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
  const p = await ctx.newPage(), errs = []; p.on('pageerror', (e) => errs.push(String(e && e.message || e)));
  await p.addInitScript(() => { window.FIGHT_OPTS = { seed: 5, speed: 1, board: 'desert', night: false }; try { localStorage.clear(); } catch (e) {} });
  await p.goto('http://localhost:' + srv.address().port + '/slices/BOHEMIA_FIGHT.html', { waitUntil: 'load' });
  await p.waitForFunction(() => { try { return !!(eval('FIGHT').S.board) && !!window.BohemiaFightKinds; } catch (e) { return false; } }, null, { timeout: 120000 });
  return { p, errs, close: async () => { await br.close(); srv.close(); } };
}
