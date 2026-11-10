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
     F12 PLANTED FAIL: the same checks over the file with suburb's row taken out, a ladder put in, and a new map kind with no row
         must go red on each, or this gate cannot fail and proves nothing
   PAGE (the demo, phone profile):
     P1  the map page carries the table (window.BohemiaFightKinds) and every district on the live valley has a row
     P2  the houses the map paints: the storeys vbHouseStorey reads for every standing house on the valley, a real mix
         (one storey most, two common, three rare), not one in seven
     P3  the painter stands them that tall: the tallest house on the painting is a three-storey wall

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
  /* F12: plant the faults; each check must catch its own */
  const P1 = JSON.parse(JSON.stringify(J)); delete P1.districts.suburb;
  const P2 = JSON.parse(JSON.stringify(J)); P2.districts.estate.man = 'ladder';
  const P3 = JSON.parse(JSON.stringify(J)); P3.districts.gated.storeys = { '1': 0.2, '3': 0.8 };
  const W4 = Object.assign({}, want, { districts: want.districts.concat(['a_new_map_kind']) });
  const P5 = JSON.parse(JSON.stringify(J)); P5.districts.suburb.street_front = false;
  const red = (r, leg) => r.find((x) => x[0] === leg)[1].length > 0;
  const planted = [red(check(P1, want), 'F1'), red(check(P2, want), 'F6'), red(check(P3, want), 'F7'), red(check(J, W4), 'F1'), red(check(P5, want), 'F8')];
  ok('F12 PLANTED FAIL: suburb taken out, a ladder, three storeys common, a new map kind with no row, a house with no street: each goes red (' + planted.filter(Boolean).length + '/5)', planted.every(Boolean));

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
  done();
})();
