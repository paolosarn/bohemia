#!/usr/bin/env node
/* ============================================================================
   THE MISSING REAL PLACES GATE (WORLD TEN 11/6, VAMILY rules 409(c) and 411, ask line 458; Paolo 11/5: 'research every building
   type in Pocket City 2... and see if you're missing any of those buildings').

   The places are records/target/bb/real_places.json: nine new valley kinds the generator seats (engine/bohemia_overmap.js
   __THE_MISSING_REAL_PLACES__), two region places (tools/bohemia_world_region.py), the map's use of them
   (slices/bohemia_real_places.js).

   IN NODE (the data and the generator):
     R1 THE DATA: every place has an id, a kind, a name, a real story with its spot, a use, its own finds (each one of the six
        goods), and a draft feed post or none; no two share an id or a name (beyond the two home centres, one kind twice)
     R2 ONE COPY: the generator carries the file's valley seats word for word (the sync tool's literal)
     R3 ON EVERY SEED AT ITS REAL SPOT: 24 seeds and the four turned valleys of rule 344: every valley place stands on its own
        block with its own kind, within 10 blocks of its real spot, inside the valley's land
     R4 REACHABLE: every one fronts a street (a road block beside it) on every seed
     R5 NONE COVERS ANOTHER: no two on the same block or touching
     R6 NOTHING ELSE MOVED: the same valley built with the list emptied differs ONLY on the places' own blocks
     R7 EVERY TABLE KNOWS EVERY KIND: its category, its kit plot, its ground, its board kind (never the catch-all), its scavenge,
        its own finds, its paint family on the map, and the shell's nfKind in the alpha and in the demo
     R8 THE REGION'S TWO: the lab and the Apex gas plant are places on the land, within 2.5 blocks of their real coordinates on
        the region's own formula, on standable ground, reachable on foot (hours from the city)
     R9 MUTATION: a kind no table knows is caught by R7's own check; a seat that cannot be met is caught by R3's
   ON THE DEMO, through the one driver (node gates/the_missing_real_places_gate.js [profile], default computer):
     R10 the map read the file and its valley holds every valley place, each block its own kind
     R11 THE SCREEN: arriving at each opens it (the town lookup the arrival asks answers its name); the bank opened for real
         carries its own kind as the screen's district (so its SCAVENGE searches the bank's ground)
     R12 THE POST: the first time, one feed post with the place's own voice, draft; a second visit posts nothing
     R13 THE NAME AND THE TAP: up close the place is named on the glass and a tap on its plate is the place
     R14 MUTATION: the list emptied, nothing answers and nothing is named
     R15 nothing threw
   ============================================================================ */
'use strict';
const path = require('path');
const fs = require('fs');
const vm = require('vm');
const ROOT = path.dirname(__dirname);
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const DATA = JSON.parse(read('records/target/bb/real_places.json'));
const PLACES = DATA.places || [];
const VALLEY = PLACES.filter(p => p.where === 'valley'), REGION = PLACES.filter(p => p.where === 'region');
const GOODS = ['food', 'medicine', 'battery', 'tape', 'ammo', 'water'];
const ROAD = { freeway: 1, arterial: 1, strip: 1, beltway: 1 };

function engineWith(list) {   /* the generator, with its DATA block swapped (R6 and R9): a fresh module, never the cached one */
  const src = read('engine/bohemia_overmap.js');
  const a = src.indexOf('/* __THE_MISSING_REAL_PLACES__ DATA BEGIN */'), b = src.indexOf('/* __THE_MISSING_REAL_PLACES__ DATA END */');
  const body = src.slice(0, a) + '/* planted */\nconst REAL_PLACES=' + JSON.stringify(list) + ';\n' + src.slice(b);
  const m = { exports: {} }, ctx = { module: m, exports: m.exports, require, globalThis: {}, console };
  ctx.globalThis = ctx; vm.createContext(ctx); vm.runInContext(body, ctx);
  m.exports.__ctx = ctx;
  return m.exports;
}

function ctxTurn(E, T) { try { E.__ctx.VALLEY_TURN = T; } catch (e) {} }

function kindKnown(kind, T) {
  const miss = [];
  if (!T.K.category(kind)) miss.push('category');
  if (!new RegExp('\\n\\s*' + kind + ':\\s*\\{\\s*mod:').test(T.world)) miss.push('kit plot');
  if (!Object.keys(T.BT.FROM).some(g => T.BT.FROM[g].indexOf(kind) >= 0)) miss.push('ground');
  if (T.BK.kindOf(kind).catchAll) miss.push('board kind');
  if (T.SC.SEARCHABLE.indexOf(kind) < 0) miss.push('scavenge');
  if (!T.SC.findsOf(kind)) miss.push('finds');
  if (!new RegExp('[|(]' + kind + '[|)]').test(T.painter)) miss.push('paint');
  [['alpha', T.alpha], ['demo', T.demo]].forEach(([n, s]) => { const m = s.match(/function nfKind\(district\)\{[\s\S]*?\n\}/);
    if (!m || !new RegExp('[|(]' + kind + '[|)]').test(m[0])) miss.push('nfKind in the ' + n); });
  return miss;
}

function nodeChecks() {
  console.log('-- the data and the generator --');
  /* R1 */
  const bad = [], ids = new Set(), names = {};
  PLACES.forEach(p => {
    const why = [];
    if (!p.id || ids.has(p.id)) why.push('id'); ids.add(p.id);
    if (!p.kind || !p.name || !p.real || !p.use || !(p.where === 'valley' || p.where === 'region')) why.push('fields');
    if (!(p.finds || []).length || p.finds.some(f => GOODS.indexOf(f.good) < 0 || !f.says)) why.push('finds');
    if (p.feed && p.feed.draft !== true) why.push('feed not draft');
    if (p.where === 'valley' && !(p.seat && p.seat.x && p.seat.y && p.like && p.ground && p.category)) why.push('seat/like/ground/category');
    if (p.where === 'region' && !(isFinite(p.lat) && isFinite(p.lon) && p.tier && p.role)) why.push('lat/lon/tier/role');
    names[p.name] = (names[p.name] || []).concat(p.kind);
    if (why.length) bad.push(p.id + ': ' + why.join(','));
  });
  const twice = Object.keys(names).filter(n => names[n].length > 1 && new Set(names[n]).size > 1);
  ok('R1 the data: ' + PLACES.length + ' places (' + VALLEY.length + ' on the valley, ' + REGION.length + ' on the region), each whole, draft',
     PLACES.length >= 11 && bad.length === 0 && twice.length === 0 && DATA.draft === true, bad.concat(twice).join('; ') || 'ok');
  /* R2 */
  const OM = require(path.join(ROOT, 'engine', 'bohemia_overmap.js'));
  const r2 = require('child_process').spawnSync(process.execPath, [path.join(ROOT, 'tools', 'bohemia_world_ten_real_places_sync.js'), '--check'], { encoding: 'utf8' });
  ok('R2 one copy: the generator carries the file\'s ' + VALLEY.length + ' seats word for word', r2.status === 0 &&
     OM.REAL_PLACES.length === VALLEY.length && OM.REAL_PLACES.every((s, i) => s.id === VALLEY[i].id && s.kind === VALLEY[i].kind), (r2.stdout || '').trim());
  /* R3, R4, R5 */
  const SEEDS = [1337, 42, 99, 7, 8, 77, 555, 2024, 31337, 123456, 1, 2, 3, 4, 5, 6, 9, 10, 11, 12, 13, 14, 15, 16];
  const TURNS = [null, { ns: true }, { ew: true }, { ns: true, ew: true }];
  const TW_ = require(path.join(ROOT, 'engine', 'bohemia_towns.js')), FG = require(path.join(ROOT, 'engine', 'BOHEMIA_faction_graph.json')), CE = require(path.join(ROOT, 'engine', 'bohemia_cityedit.js'));
  const E0s = engineWith([]);
  const lost = [], far = [], noroad = [], touch = [], under = [], seatMoved = []; let worst = 0, valleys = 0, restamped = 0;
  for (const T of TURNS) for (const seed of SEEDS) {
    globalThis.VALLEY_TURN = T; const m = OM.buildOvermap(seed); valleys++;
    /* the towns first (from what each block was), then every place off their ground: the page's own order */
    const seats = TW_.derive(FG, TW_.districtsOf(m, CE.cat), 1);
    const foot = t => { const k = t.tier === 'fortress' ? 4 : t.tier === 'town' ? 3 : 2; return { x0: t.x - (k >> 1), y0: t.y - (k >> 1), n: k }; };
    const keepOut = (x, y) => seats.some(t => { const f = foot(t); return x >= f.x0 - 1 && x <= f.x0 + f.n && y >= f.y0 - 1 && y <= f.y0 + f.n; });
    restamped += OM.restampRealPlaces(m, keepOut).length;
    if (seed % 4 === 0) { ctxTurn(E0s, T); const s0 = TW_.derive(FG, TW_.districtsOf(E0s.buildOvermap(seed), CE.cat), 1);
      if (JSON.stringify(s0.map(t => [t.faction, t.x, t.y])) !== JSON.stringify(seats.map(t => [t.faction, t.x, t.y]))) seatMoved.push(seed + (T ? JSON.stringify(T) : '')); }
    const got = {}; (m.layout.realPlaces || []).forEach(R => { if (R.x != null) got[R.id] = R; });
    Object.values(got).forEach(R => { if (seats.some(t => { const f = foot(t); return R.x >= f.x0 && R.x < f.x0 + f.n && R.y >= f.y0 && R.y < f.y0 + f.n; })) under.push(seed + ':' + R.id); });
    VALLEY.forEach(p => {
      const R = got[p.id]; if (!R) { lost.push(seed + ':' + p.id + ' unseated'); return; }
      const t = m.at(R.x, R.y); if (!t || t.district !== p.kind) lost.push(seed + ':' + p.id + ' is ' + (t && t.district));
      const dd = Math.max(Math.abs(R.x - R.want[0]), Math.abs(R.y - R.want[1])); worst = Math.max(worst, dd); if (dd > 14) far.push(seed + ':' + p.id + ' ' + dd);
      if (![[1, 0], [-1, 0], [0, 1], [0, -1]].some(d => { const n = m.at(R.x + d[0], R.y + d[1]); return n && ROAD[n.district]; })) noroad.push(seed + ':' + p.id);
    });
    const rs = Object.values(got);
    for (let i = 0; i < rs.length; i++) for (let j = i + 1; j < rs.length; j++)
      if (Math.max(Math.abs(rs[i].x - rs[j].x), Math.abs(rs[i].y - rs[j].y)) <= 1) touch.push(seed + ':' + rs[i].id + '/' + rs[j].id);
  }
  globalThis.VALLEY_TURN = null;
  ok('R3 on every seed at its real spot: ' + VALLEY.length + ' places x ' + valleys + ' valleys (24 seeds, four turns), each its own kind, the worst ' + worst + ' blocks off its spot (' + restamped + ' moved off a town\'s ground)',
     lost.length === 0 && far.length === 0, lost.concat(far).slice(0, 6).join('; ') || 'none lost, none past 14');
  ok('R3b A TOWN WAS BUILT FIRST: no faction seat moves for the places (with and without them, ' + Math.ceil(valleys / 4) + ' valleys), and no place stands on a town\'s ground',
     seatMoved.length === 0 && under.length === 0, seatMoved.concat(under).slice(0, 6).join('; ') || 'seats the same, none under a town');
  ok('R4 reachable: every one fronts a street on every valley', noroad.length === 0, noroad.slice(0, 6).join('; ') || 'every one');
  ok('R5 none covers another: no two on one block or touching', touch.length === 0, touch.slice(0, 6).join('; ') || 'none');
  /* R6 */
  const E0 = engineWith([]); const moved = [], stubs = [];
  for (const seed of [1337, 42, 99, 2024]) {
    const a = OM.buildOvermap(seed), b = E0.buildOvermap(seed), mine = new Set((a.layout.realPlaces || []).map(R => R.x + ',' + R.y));
    for (let i = 0; i < a.tiles.length; i++) { const ta = a.tiles[i], tb = b.tiles[i];
      if (ta.district === tb.district || mine.has(ta.x + ',' + ta.y)) continue;
      /* the one ripple allowed, and counted: a street stub the access spur carved toward the block the place now stands on, pruned or
         re-carved two blocks round it (a road block that is desert now, or the other way); anything else is a moved valley */
      const near = [...mine].some(k => { const [px, py] = k.split(',').map(Number); return Math.max(Math.abs(px - ta.x), Math.abs(py - ta.y)) <= 2; });
      const stub = ROAD[ta.district] && tb.district === 'desert' || ROAD[tb.district] && ta.district === 'desert';
      if (near && stub) stubs.push(seed + ':' + ta.x + ',' + ta.y); else moved.push(seed + ':' + ta.x + ',' + ta.y + ' ' + tb.district + '->' + ta.district); }
  }
  ok('R6 nothing else moved: built with the list emptied, four valleys differ only on the places\' own blocks (and ' + stubs.length + ' street stubs re-routed beside them)', moved.length === 0 && stubs.length === 0, moved.slice(0, 6).join('; ') || (stubs.join(', ') || 'only their blocks'));
  /* R7 */
  let BK = require(path.join(ROOT, 'engine', 'bohemia_boardkinds.js')); BK = BK.BOH_BOARDKINDS || BK;
  let BT = require(path.join(ROOT, 'engine', 'bohemia_boardterrain.js')); BT = BT.BOH_BOARDTERRAIN || BT;
  const T = { K: require(path.join(ROOT, 'engine', 'bohemia_district_kit.js')), BT, BK, SC: require(path.join(ROOT, 'engine', 'bohemia_scavenge.js')),
    /* WORLD 14 11/11: PAINT is an explicit class in vbClassOf, any class (the bus yard's terminal wears roofs, the greenhouses' farm
       the green fields the map always painted farms with); only the fall-through (VB_CLASS.lot, no name) is no paint. It read only
       the roof and casino lines, which was every new kind WORLD TEN added, all buildings */
    world: read('engine/bohemia_world.js'), painter: ((read('slices/BOHEMIA_CITY_WORLD.html').match(/function vbClassOf\(d\)\{[\s\S]*?\n\}/) || [''])[0]
      .split('\n').filter(l => /\.test\(d\)\) return VB_CLASS\.\w+;|d === '\w+'\) return VB_CLASS\.\w+;/.test(l)).map(l => l.replace(/d === '(\w+)'/, '($1)')).join('\n')),
    alpha: read('slices/BOHEMIA_ALPHA_0_9.html'), demo: read('slices/BOHEMIA_DEMO.html') };
  const kinds = [...new Set(VALLEY.map(p => p.kind))], gaps = [];
  kinds.forEach(k => { const miss = kindKnown(k, T); if (miss.length) gaps.push(k + ': ' + miss.join(',')); });
  ok('R7 every table knows every kind (' + kinds.length + ' kinds x category, kit plot, ground, board kind, scavenge, finds, paint, nfKind alpha and demo)', gaps.length === 0, gaps.join('; ') || 'all ' + kinds.length);
  /* R8 */
  const LAND = JSON.parse(read('engine/BOHEMIA_REGION_LAND.json'));
  const RLM = require(path.join(ROOT, 'engine', 'bohemia_region_land.js')), RLB = (typeof BohemiaRegionLand !== 'undefined') ? BohemiaRegionLand : RLM;
  const L = RLB.load(LAND), C1 = { n: 'y0', s: 'y1', e: 'x1', w: 'x0' };
  const kmLon = 111.0 * Math.cos(LAND.origin.lat * Math.PI / 180), N = LAND.N, rbad = [];
  REGION.forEach(p => {
    const q = LAND.places.find(x => x.name === p.name); if (!q) { rbad.push(p.name + ' not on the land'); return; }
    const fx = (N - 1) / 2 + (p.lon - LAND.origin.lon) * kmLon * 1000 / LAND.metresPerCell, fy = (N - 1) / 2 - (p.lat - LAND.origin.lat) * 111.0 * 1000 / LAND.metresPerCell;
    const off = Math.max(Math.abs(fx - (q.x + 0.5)), Math.abs(fy - (q.y + 0.5))), a = L ? L.at(q.x, q.y, C1) : null;
    if (off > 2.5) rbad.push(p.name + ' ' + off.toFixed(1) + ' blocks off');
    if (!a || a.pass >= 3 || a.valley) rbad.push(p.name + ' not standable');
    if (q.hours == null) rbad.push(p.name + ' unreachable');
    if (q.tier !== p.tier || q.role !== p.role) rbad.push(p.name + ' tier/role');
  });
  ok('R8 the region\'s ' + REGION.length + ': ' + REGION.map(p => p.name).join(', ') + ' on the land at their real coordinates, standable, reachable', REGION.length >= 2 && rbad.length === 0,
     rbad.join('; ') || REGION.map(p => { const q = LAND.places.find(x => x.name === p.name); return p.name + ' ' + q.x + ',' + q.y + ' ' + q.hours + ' h'; }).join('; '));
  /* R9 */
  const planted = kindKnown('vault_of_nothing', T);
  const Ebad = engineWith([{ id: 'nowhere', kind: 'bank', seat: { x: { from: 'strip', east: 400 }, y: { of: 3 } } }]);
  const mb = Ebad.buildOvermap(1337), unseated = !(mb.layout.realPlaces || []).some(R => R.id === 'nowhere' && R.x != null);
  ok('R9 MUTATION: a kind no table knows is refused by every table (' + planted.length + ' of 9), a seat off the map is unseated (R3 red)', planted.length === 9 && unseated, planted.length + ' / unseated ' + unseated);
}

async function run(profile) {
  console.log('\n-- ' + profile + ' --');
  const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
  const d = await open({ profile });
  const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 140)));
  for (let i = 0; i < 160; i++) {
    if (await fr.evaluate(() => !!(window.BOH_REAL_PLACES && BOH_REAL_PLACES.loaded && typeof om !== 'undefined' && om.n && typeof MODE !== 'undefined' && MODE === 'city'))) break;
    await page.waitForTimeout(500);
  }
  await page.waitForTimeout(1200);
  try { await d.toMap(); } catch (e) {}
  const want = VALLEY.map(p => ({ id: p.id, kind: p.kind, name: p.name, who: p.feed && p.feed.who }));
  const r = await fr.evaluate((want) => {
    const RP = window.BOH_REAL_PLACES, out = { loaded: RP && RP.loaded, n: RP ? RP.list.length : 0 };
    const cells = RP.cellsNow(); out.cells = cells.length;
    out.kinds = cells.every(c => { const t = om.at(c.x, c.y); return t && t.district === c.kind; });
    out.missing = want.filter(w => !cells.some(c => c.id === w.id)).map(w => w.id);
    out.answer = want.map(w => { const c = cells.find(q => q.id === w.id); if (!c) return w.id + ':none';
      const t = loopTownAt(c.x, c.y, 1), t0 = loopTownAt(c.x, c.y, 0); return (t && t.name === w.name && t0 && t0.name === w.name) ? '' : w.id + ':' + (t && t.name); }).filter(Boolean);
    /* the bank, for real: the crew on its block, the arrival the map makes, the screen it opens */
    const bank = cells.find(c => c.kind === 'bank');
    const feedAll = () => (window.BOHEMIA_FEED && BOHEMIA_FEED.posts) ? BOHEMIA_FEED.posts() : [];
    const who = (want.find(w => w.kind === 'bank') || {}).who;
    try { RP.st.seen = {}; } catch (e) {}
    if (bank) {
      try { if (typeof loopClose === 'function') loopClose(); } catch (e) {}
      city.x = bank.x; city.y = bank.y;
      const f0 = feedAll().filter(f => f && f.who === who).length;
      try { loopOpenTown(loopTownAt(bank.x, bank.y, 1)); } catch (e) { out.openErr = String(e.message); }
      out.open = LOOP.open ? { name: LOOP.open.name, real: LOOP.open.real, district: (om.at(LOOP.open.x, LOOP.open.y) || {}).district } : null;
      out.posts1 = feedAll().filter(f => f && f.who === who).length - f0;
      out.draft = (feedAll().filter(f => f && f.who === who).slice(-1)[0] || {}).draft;
      try { loopClose(); } catch (e) {}
      try { loopOpenTown(loopTownAt(bank.x, bank.y, 1)); loopClose(); } catch (e) {}
      out.posts2 = feedAll().filter(f => f && f.who === who).length - f0;
      city.x = bank.x + 1; city.y = bank.y + 1;
      try { if (typeof fogReveal === 'function') fogReveal(bank.x, bank.y, 4); } catch (e) {}
    }
    return out;
  }, want);
  ok('R10 the map read the file; its valley holds every valley place, each its own kind', r.loaded && r.n === PLACES.length && r.cells === VALLEY.length && r.kinds && !r.missing.length,
     r.cells + ' of ' + VALLEY.length + (r.missing.length ? ' missing ' + r.missing.join(',') : ''));
  ok('R11 THE SCREEN: arriving at each answers its own name; the bank opened carries its kind to the screen', !r.answer.length && r.open && r.open.real === 'the_bank' && r.open.district === 'bank',
     (r.answer.join(', ') || 'all ' + VALLEY.length) + '; opened ' + JSON.stringify(r.open) + (r.openErr ? ' ' + r.openErr : ''));
  ok('R12 THE POST: one draft post the first time, none the second', r.posts1 === 1 && r.draft === true && r.posts2 === 1, 'first ' + r.posts1 + ', after a second visit ' + r.posts2);
  /* R13: up close, beside the bank: named, and a tap on the plate is the bank */
  let z = null;
  for (let i = 0; i < 4 && !(z && z.named); i++) {
    z = await fr.evaluate(() => { const RP = BOH_REAL_PLACES, bank = RP.cellsNow().find(c => c.kind === 'bank'); city.x = bank.x + 3; city.y = bank.y + 2; panX = 0; panY = 0;
      try { if (typeof fogReveal === 'function') fogReveal(bank.x, bank.y, 6); } catch (e) {}
      try { render(); } catch (e) { return { err: String(e.message) }; }
      /* every place named on the glass answers a tap on its own plate with its own name (the bank first when it is named) */
      const hits = MAP_TOWN_HIT.filter(t => t.real && t.plate), taps = hits.map(h => { const w = mapTapWhich(h.plate.x + h.plate.w / 2, h.plate.y + h.plate.h / 2); return [h.name, w ? w.name : null]; });
      return { tw: +TW.toFixed(1), named: RP.named, drawn: RP.drawn, bank: hits.some(h => h.real === 'the_bank'), taps, wrong: taps.filter(t => t[0] !== t[1]), err: RP.err || null }; });
    if (!(z && z.named)) { await d.pinchIn(); await page.waitForTimeout(1500); }
  }
  ok('R13 THE NAME AND THE TAP: up close the places on the glass are named (the bank among them) and a tap on each plate is that place', z && z.named >= 1 && z.bank && z.taps.length === z.named && !z.wrong.length, JSON.stringify(z));
  const m = await fr.evaluate(() => { const RP = BOH_REAL_PLACES, keep = RP.list, bank = RP.cellsNow().find(c => c.kind === 'bank');
    RP.use([]); const t = loopTownAt(bank.x, bank.y, 0); try { render(); } catch (e) {}
    const named = RP.named; RP.use(keep); try { render(); } catch (e) {} return { t: t ? t.name : null, named }; });
  ok('R14 MUTATION: the list emptied, nothing answers and nothing is named', !m.t && m.named === 0, JSON.stringify(m));
  ok('R15 nothing threw', errs.length === 0 && !(z && z.err), errs.slice(0, 2).join(' | ') + ((z && z.err) || ''));
  await d.close();
}

(async () => {
  try { nodeChecks(); } catch (e) { ok('the node checks ran', false, String(e.stack || e.message).slice(0, 300)); }
  const want = process.argv[2];
  if (want !== 'node') for (const p of want ? [want] : ['computer']) { try { await run(p); } catch (e) { ok('the gate ran on ' + p, false, String(e.message).slice(0, 200)); } }
  console.log('\nTHE MISSING REAL PLACES: ' + (fail ? 'RED' : 'GREEN') + '  ' + pass + '/' + fail);
  process.exit(fail ? 1 : 0);
})();
