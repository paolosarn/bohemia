#!/usr/bin/env node
/* THE FREEWAY FIGHT (FREEWAY 11/7/26, VAMILY rule 432, ask lines 513 and 514; Paolo 11/7: 'when combat starts on [the freeway]
   it just puts me on a suburb house... why can't it be an underpass or a large overpass towering over the rest of the city, you
   can't quite hop off it').
   The rule's own gate (rule 429(f): every rule over many seeds, never one map; a seed that breaks a rule is a red gate).

   A. THE BOARDS, PURE (node, slices/bohemia_freeway_boards.js deal + check): every template, every layout in the data, every
      mirror, six seeds each (4 templates, 11 layouts, 264 boards):
     A1  THE EDGE HOLDS: no two neighbouring tiles a man can stand on are two levels apart (you cannot hop off a deck)
     A2  A DROP IS NEVER STOOD ON (the city below, the broken end)
     A3  EVERY TILE A MAN CAN STAND ON IS REACHABLE FROM HIS LINE, and his line reaches theirs
     A4  THE ROADS ARE ONE NETWORK (rule 429(h)): every lane, ramp, street and sidewalk joined
     A5  THE PARAPET: every deck tile beside the drop is in cover (the wall at the edge)
     A6  HEIGHT AS 423/428: the overpass's deck two levels up, the interchange's crest three, the deck's drop on both sides,
         every ramp one level a tile
     A7  THE KIT: every picture a board names is on disk, every piece it stands has a definition
   H. THE HEADLESS FIGHT STILL LOADS: a freeway-district fight plays out in tools/bohemia_fight_headless.js (no window, the page's
      own data lines), so this lane's seam never breaks the twenty gates that stand on it
   M. PLANTED FAILS (each must turn its leg red, or the gate is blind): M1 a drop made standable (A2); M2 a ramp's middle step
      taken out (A1); M3 the deck cut across (A3); M4 a hole in the parapet (A5); M5 a modder's layout with a deck beside the
      street two levels down (A1); M6 the old deal at a freeway spot (B1).
   B. THE MAP (the demo's own map frame, tools/bohemia_drive_the_demo.js): 24 valleys (the boot valley and 23 more built the way
      a save rebuilds them, OM.buildOvermap), up to four freeway cells each (an interchange, a crossing, two plain), the spot read
      with the map's own districts:
     B0  BEFORE (measured, never failed): the old deal at the same spot (the street board laid from the map's block, opts.freeway
         false): how many freeway fights stood on houses
     B1  A FREEWAY FIGHT NEVER GETS A SUBURB BOARD: every spot's board is a freeway board, no house on it   (every spot, every valley)
     B2  WHAT THE MAP IS: crossings and interchanges found and dealt their own templates; all four templates dealt somewhere
     B3  THE FIGHT PLAYS: AUTO three rounds on each template's board, no page error
     W1  THE DEMO'S OWN DOOR: the shell opens a fight at a freeway cell of the boot valley and the fight, asking the map itself,
         lays a freeway board
     node gates/the_freeway_fight_gate.js [--json out.json] [--quick]            (about three minutes; --quick: A and M only)
*/
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.join(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const OUT = arg('--json', null), QUICK = process.argv.indexOf('--quick') > 0;
const FB = require(path.join(ROOT, 'slices/bohemia_freeway_boards.js'));
const FGR = path.join(ROOT, 'slices/fight_ground');
const D = { boards: JSON.parse(fs.readFileSync(path.join(FGR, 'freeway/freeway_boards.json'))), kit: JSON.parse(fs.readFileSync(path.join(FGR, 'freeway/freeway.json'))) };
const G = JSON.parse(fs.readFileSync(path.join(FGR, 'fight_ground.json')));
const DRESS = JSON.parse(fs.readFileSync(path.join(FGR, 'street_board/dressing.json')));
const def = p => G.cover[p] || G.cover_extra[p] || (DRESS.kit && DRESS.kit[p]) || D.kit.kit[p] || null;
const W = 20, H = 15;
let pass = 0, fail = 0; const lines = [], report = {};
function check(ok, name, msg) { if (ok) pass++; else fail++; const l = (ok ? 'PASS ' : 'FAIL ') + name + '  ' + msg; lines.push(l); console.log(l); return ok; }

/* ---------------- A: the boards, pure ---------------- */
function readBoard(B) {
  const c = FB.check(B, def), L = B.laid, fw = B.freeway;
  const deckLv = []; for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const k = L.tiles[y][x]; if (/^deck/.test(k)) deckLv.push(+k.slice(4)); }
  /* A5: a deck tile beside the drop (north or south) carries cover */
  const coverAt = {}; (B.cover || []).forEach(q => { const d = def(q.piece) || {}; if (d.kind === 'COVER' || d.kind === 'LOW_COVER') coverAt[q.ty * W + q.tx] = 1; });
  const hole = (x, y) => y >= 0 && y < H && (L.tiles[y][x] === 'drop' || L.tiles[y][x] === 'broken');
  const bare = []; for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (/^deck/.test(L.tiles[y][x]) && (hole(x, y - 1) || hole(x, y + 1)) && !coverAt[y * W + x] && !B.roofs[y][x]) bare.push([x, y]);
  /* A6: every ramp one level a tile (A1 holds it); the template's own heights */
  const max = deckLv.length ? Math.max.apply(null, deckLv) : -1;
  let dropsN = 0, dropsS = 0; for (let x = 0; x < W; x++) { if (L.tiles[0][x] === 'drop') dropsN++; if (L.tiles[H - 1][x] === 'drop') dropsS++; }
  /* A7: the kit */
  const pics = new Set(L.ground.filter(Boolean)); L.sprites.forEach(q => pics.add(q.src)); B.lights.forEach(l => pics.add(l.src));
  const missing = [...pics].filter(s => !fs.existsSync(path.join(FGR, s.split('#')[0])));
  const nodef = [...new Set(B.cover.map(q => q.piece))].filter(p => !def(p));
  const nopic = [...new Set(B.cover.map(q => q.piece))].filter(p => { const d = def(p); return d && d.src && !fs.existsSync(path.join(FGR, d.src)); });
  return { c, kind: fw.kind, layout: fw.layout, flip: fw.flip, bare, max, dropsN, dropsS, missing, nodef, nopic };
}
function legA() {
  const all = [], T = D.boards.templates;
  for (const kind of Object.keys(T)) for (const layout of Object.keys(T[kind].layouts)) for (const flip of [[0, 0], [1, 0], [0, 1], [1, 1]]) for (let s = 0; s < 6; s++) {
    const seed = 1000 + s * 7919 + layout.length * 31, sp = { v: 1, district: kind === 'interchange' ? 'interchange' : s % 3 === 2 ? 'beltway' : 'freeway', cell: [10 + s, 20 + s], kind: kind === 'deck' || kind === 'interchange' ? kind : 'crossing' };
    const B = FB.deal(sp, seed, D, G, W, H, { kind, layout, flip });
    if (!B) { all.push({ kind, layout, flip, nodeal: true }); continue; }
    all.push(Object.assign({ B }, readBoard(B)));
  }
  const n = all.length, bad = f => all.filter(f);
  const nd = bad(r => r.nodeal); check(!nd.length, 'A0', n + ' boards dealt (4 templates, every layout, every mirror, 6 seeds)' + (nd.length ? '; NOT DEALT ' + nd.map(r => r.kind + '/' + r.layout).join(' ') : ''));
  const ok = all.filter(r => !r.nodeal);
  let b = ok.filter(r => r.c.hops.length); check(!b.length, 'A1', 'THE EDGE HOLDS: ' + (ok.length - b.length) + '/' + ok.length + ' boards with no hop of two levels' + (b.length ? '; e.g. ' + b[0].kind + '/' + b[0].layout + ' ' + JSON.stringify(b[0].c.hops[0]) : ''));
  b = ok.filter(r => r.c.dropsStood.length); check(!b.length, 'A2', 'A DROP IS NEVER STOOD ON: ' + (ok.length - b.length) + '/' + ok.length + (b.length ? '; e.g. ' + b[0].kind + '/' + b[0].layout + ' ' + JSON.stringify(b[0].c.dropsStood[0]) : ''));
  b = ok.filter(r => r.c.lost.length || !r.c.theirs); check(!b.length, 'A3', 'EVERY TILE REACHABLE, his line reaches theirs: ' + (ok.length - b.length) + '/' + ok.length + (b.length ? '; e.g. ' + b[0].kind + '/' + b[0].layout + ' lost ' + JSON.stringify(b[0].c.lost.slice(0, 3)) + ' theirs ' + b[0].c.theirs : ''));
  b = ok.filter(r => r.c.roadParts !== 1); check(!b.length, 'A4', 'THE ROADS ARE ONE NETWORK: ' + (ok.length - b.length) + '/' + ok.length + (b.length ? '; e.g. ' + b[0].kind + '/' + b[0].layout + ' ' + b[0].c.roadParts + ' parts' : ''));
  b = ok.filter(r => r.bare.length); check(!b.length, 'A5', 'THE PARAPET: every deck tile beside the drop in cover, ' + (ok.length - b.length) + '/' + ok.length + (b.length ? '; e.g. ' + b[0].kind + '/' + b[0].layout + ' ' + JSON.stringify(b[0].bare.slice(0, 3)) : ''));
  const want = { deck: r => r.max === 0 && r.dropsN + r.dropsS >= W, overpass: r => r.max === 2 && r.c.levels[1] > 0 && r.c.levels[0] > 0, underpass: r => r.max === -1 && r.c.levels[0] > 0, interchange: r => r.max === 3 && r.c.levels[1] > 0 && r.c.levels[2] > 0 };
  b = ok.filter(r => !want[r.kind](r)); check(!b.length, 'A6', 'HEIGHT AS 423/428: the deck over the drop on both sides, the overpass two levels over the street, the interchange\'s crest three: ' + (ok.length - b.length) + '/' + ok.length + (b.length ? '; e.g. ' + b[0].kind + '/' + b[0].layout + ' max ' + b[0].max + ' levels ' + b[0].c.levels : ''));
  b = ok.filter(r => r.missing.length || r.nodef.length || r.nopic.length); check(!b.length, 'A7', 'THE KIT: every picture on disk, every piece defined' + (b.length ? '; ' + JSON.stringify([b[0].missing.slice(0, 3), b[0].nodef, b[0].nopic]) : ''));
  const lv = [0, 0, 0, 0]; ok.forEach(r => r.c.levels.forEach((v, i) => { lv[i] += v; }));
  report.A = { boards: n, levels: lv, perKind: Object.fromEntries(Object.keys(D.boards.templates).map(k => [k, ok.filter(r => r.kind === k).length])) };
  return ok;
}
/* ---------------- M: planted fails ---------------- */
function clone(B) { return JSON.parse(JSON.stringify(B)); }
function legM(ok) {
  const pick = (k, l) => ok.filter(r => r.kind === k && (!l || r.layout === l))[0].B;
  /* M1: a drop tile with its drop piece taken off (a man could stand on the city below) */
  let B = clone(pick('deck', 'two_ways')); const i1 = B.cover.findIndex(q => q.piece === 'fw_drop'); B.cover.splice(i1, 1);
  check(readBoard(B).c.dropsStood.length > 0, 'M1', 'planted: a drop made standable turns A2 red');
  /* M2: the overpass's ramp, its level-one step made level two: the foot is two levels under it */
  B = clone(pick('overpass', 'standing'));
  let done = false; for (let y = 0; y < H && !done; y++) for (let x = 0; x < W && !done; x++) if (B.terrain[y][x] === 'height') {
    const nb = [[1, 0], [-1, 0]].some(d => B.terrain[y][x + d[0]] === 'flat' && /^deck/.test(B.laid.tiles[y][x + d[0]] || '')); if (nb) { B.terrain[y][x] = 'height2'; done = true; } }
  check(done && readBoard(B).c.hops.length > 0, 'M2', 'planted: a ramp\'s middle step taken out turns A1 red');
  /* M3: the deck cut across by a drop from wall to wall */
  B = clone(pick('deck', 'two_ways'));
  for (let y = 0; y < H; y++) if (/^deck/.test(B.laid.tiles[y][10])) { B.laid.tiles[y][10] = 'drop'; B.cover = B.cover.filter(q => !(q.tx === 10 && q.ty === y)); B.cover.push({ piece: 'fw_drop', tx: 10, ty: y, x_m: 126, y_m: y * 12 + 6 }); }
  const r3 = readBoard(B); check(!r3.c.theirs || r3.c.lost.length > 0, 'M3', 'planted: the deck cut across turns A3 red (his line reaches theirs: ' + r3.c.theirs + ')');
  /* M4: a hole in the parapet */
  B = clone(pick('deck', 'two_ways')); const i4 = B.cover.findIndex(q => q.piece === 'fw_parapet'); B.cover.splice(i4, 1);
  check(readBoard(B).bare.length > 0, 'M4', 'planted: a parapet taken off turns A5 red');
  /* M5: a modder's layout: the overpass's deck straight beside the street, no drop between */
  const T5 = JSON.parse(JSON.stringify(D.boards)); const L5 = T5.templates.overpass.layouts.standing.slice(); L5[5] = '~2~~~~~~gggg~~~~~~2~'; T5.templates.overpass.layouts = { bad: L5 };
  const B5 = FB.deal({ district: 'freeway', cell: [1, 1], kind: 'crossing' }, 7, { boards: T5, kit: D.kit }, G, W, H, { kind: 'overpass', layout: 'bad', flip: [0, 0] });
  check(!!B5 && FB.check(B5, def).hops.length > 0, 'M5', 'planted: a layout with the deck beside the street two levels down turns A1 red (' + (B5 ? FB.check(B5, def).hops.length : '?') + ' hops)');
}

/* ---------------- B: the map, and the fight ---------------- */
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.css': 'text/css', '.woff2': 'font/woff2' };
const SEEDS_MORE = [7, 42, 99, 123, 404, 777, 1001, 1234, 2024, 2718, 3141, 4242, 5150, 6006, 7331, 8080, 9001, 10101, 11235, 13579, 20202, 31337, 65535];
async function readTheMap() {
  const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const d = await drive.open({ keepCards: true, world: 1 });
  const fr = d.fr;
  for (let i = 0; i < 240; i++) { if (await fr.evaluate(() => !!(window.BohemiaStreetBoard && BohemiaStreetBoard.ready()))) break; await d.page.waitForTimeout(250); }
  await fr.addScriptTag({ path: path.join(ROOT, 'slices/bohemia_freeway_boards.js') });
  const boot = await fr.evaluate(() => om.seed);
  const out = [];
  for (const seed of [boot].concat(SEEDS_MORE)) {
    const r = await fr.evaluate(({ seed, boot, W, H }) => {
      if (seed !== boot) { om = CBinstall(OM.buildOvermap(seed)); try { POWER = buildPower(om, seed); } catch (e) {} }
      const N = om.n, at = (x, y) => { const t = om.at(x, y); return t ? t.district || null : null }, F = BohemiaFreewayBoards;
      const cells = { interchange: [], crossing: [], plain: [] };
      for (let y = 4; y < N - 4; y++) for (let x = 4; x < N - 4; x++) { const d = at(x, y); if (!F.isFreeway(d)) continue;
        const s = F.spot(at, [x, y], d); (s.kind === 'interchange' ? cells.interchange : s.kind === 'crossing' ? cells.crossing : cells.plain).push(s); }
      const take = (a, n) => { const o = []; for (let i = 0; i < n && a.length; i++) o.push(a[Math.floor((i + 0.5) * a.length / n)]); return o; };
      const spots = take(cells.interchange, 1).concat(take(cells.crossing, 1), take(cells.plain, 2));
      const res = spots.map(s => { const p = BohemiaStreetBoard.plan({ gx: s.cell[0], gy: s.cell[1] }, W, H, 10); return { spot: s, plan: p && !p.err ? p : null }; });
      return { seed: om.seed, counts: { interchange: cells.interchange.length, crossing: cells.crossing.length, plain: cells.plain.length }, res };
    }, { seed, boot, W, H });
    out.push(r);
  }
  /* W1: the demo's own door at a freeway cell of the boot valley */
  let door = null;
  try {
    await fr.evaluate((boot) => { if (om.seed !== boot) { om = CBinstall(OM.buildOvermap(boot)); try { POWER = buildPower(om, boot); } catch (e) {} } }, boot);
    const s0 = out[0].res.filter(x => x.spot.kind !== 'interchange')[0] || out[0].res[0];
    const cell = s0.spot.cell, dist = s0.spot.district;
    await d.page.evaluate(([c, dd]) => { window.nfOpen({ type: 'BOHEMIA_CITY_ENCOUNTER', district: dd, at: { gx: c[0], gy: c[1] }, label: 'gate', draft: true }); }, [cell, dist]);
    for (let i = 0; i < 160 && !door; i++) {
      await d.page.waitForTimeout(500);
      door = await d.page.evaluate(() => { try { const f = document.getElementById('fightFrame'), w = f && f.contentWindow, F = w && w.eval('FIGHT'); const B = F && F.S && F.S.boardDef;
        return B && F.S.board ? { family: B.family, name: B.name, kinds: B.kinds, fw: B.freeway ? { kind: B.freeway.kind, read: B.freeway.spot.read, crossing: B.freeway.spot.crossing } : null, houses: B.laid ? B.laid.houses : null } : null; } catch (e) { return null; } });
    }
    door = Object.assign({ asked: cell, district: dist }, door || {});
  } catch (e) { door = { err: String(e && e.message || e) }; }
  await d.close();
  return { boot, valleys: out, door };
}
async function openFight() {
  const { chromium } = require('playwright');
  const srv = http.createServer((q, r) => {
    const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
    r.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r);
  }).listen(0);
  const br = await chromium.launch();
  const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e && e.message || e)));
  await p.addInitScript(() => { window.FIGHT_OPTS = { seed: 5, speed: 1, board: 'desert', night: false }; try { localStorage.clear(); } catch (e) {} });
  await p.goto('http://localhost:' + srv.address().port + '/slices/BOHEMIA_FIGHT.html', { waitUntil: 'load' });
  await p.waitForFunction(() => { try { return !!(eval('FIGHT').S.board) && !!eval('DB').freeway; } catch (e) { return false; } }, null, { timeout: 120000 });
  return { p, errs, close: async () => { await br.close(); srv.close(); } };
}
function dealIn(page, o) {
  return page.evaluate(o => { const F = eval('FIGHT'); eval('SEED = ' + (o.seed >>> 0)); F.setup(o); const B = F.S.boardDef, L = B.laid;
    const houses = L ? L.sprites.filter(q => q.kind === 'house').length : 0;
    let inWin = 0; if (L && L.tiles) for (let y = 0; y < L.tiles.length; y++) for (let x = 0; x < L.tiles[y].length; x++) if (L.tiles[y][x] === 'house' || L.tiles[y][x] === 'trailer') inWin++;
    let fwy = 0; if (L && L.tiles) for (let y = 0; y < L.tiles.length; y++) for (let x = 0; x < L.tiles[y].length; x++) if (/^(freeway|deck)/.test(L.tiles[y][x])) fwy++;
    return { family: B.family, name: B.name, kinds: B.kinds, fw: B.freeway ? { kind: B.freeway.kind, layout: B.freeway.layout } : null, houses, houseTiles: inWin, freewayTiles: fwy, laid: !!L,
      check: B.freeway ? (function () { const db = eval('DB'), def = q => db.ground.cover[q] || db.ground.cover_extra[q] || (db.streetDress && db.streetDress.kit[q]) || db.freeway.kit.kit[q] || null; const c = window.BohemiaFreewayBoards.check(B, def); return { hops: c.hops.length, drops: c.dropsStood.length, lost: c.lost.length, theirs: c.theirs }; })() : null }; }, o);
}
async function legB() {
  const map = await readTheMap();
  const F = await openFight();
  const spots = []; map.valleys.forEach(v => v.res.forEach(r => spots.push(Object.assign({ seed: v.seed }, r))));
  report.B = { valleys: map.valleys.length, counts: map.valleys.map(v => Object.assign({ seed: v.seed }, v.counts)), spots: spots.length };
  check(map.valleys.length >= 20 && spots.length >= 40, 'B', map.valleys.length + ' valleys read, ' + spots.length + ' freeway spots (interchanges ' + spots.filter(s => s.spot.kind === 'interchange').length + ', crossings ' + spots.filter(s => s.spot.kind === 'crossing').length + ', plain ' + spots.filter(s => s.spot.kind === 'deck').length + ')');
  const before = [], now = [];
  for (const s of spots) {
    const base = { district: s.spot.district, cell: s.spot.cell, kind: 'freeway', seed: (s.seed ^ (s.spot.cell[0] * 131 + s.spot.cell[1])) >>> 0 };
    if (s.plan) before.push(Object.assign({ at: s.spot }, await dealIn(F.p, Object.assign({}, base, { freeway: false, street: s.plan }))));
    now.push(Object.assign({ at: s.spot }, await dealIn(F.p, Object.assign({}, base, { freeway: s.spot }))));
  }
  const onHouses = before.filter(b => b.houseTiles > 0 || b.houses > 0);
  const share = before.length ? before.reduce((t, b) => t + b.freewayTiles, 0) / (before.length * W * H) : 0;
  check(true, 'B0', 'BEFORE (the old deal at the same spots): ' + onHouses.length + ' of ' + before.length + ' freeway fights stood among houses (' + Math.round(before.reduce((t, b) => t + b.houseTiles, 0) / Math.max(1, before.length)) + ' house tiles a board on average); the freeway was ' + Math.round(share * 100) + '% of the board');
  const notFw = now.filter(b => b.family !== 'freeway' || b.kinds.indexOf('freeway') < 0 || b.houses > 0 || b.houseTiles > 0);
  check(!notFw.length, 'B1', 'A FREEWAY FIGHT NEVER GETS A SUBURB BOARD: ' + (now.length - notFw.length) + '/' + now.length + ' spots dealt a freeway board, no house on it' + (notFw.length ? '; e.g. ' + JSON.stringify(notFw[0]).slice(0, 200) : ''));
  const badC = now.filter(b => b.check && (b.check.hops || b.check.drops || b.check.lost || !b.check.theirs));
  check(!badC.length, 'B1b', 'the boards the fight dealt hold A1 to A3 in the fight itself: ' + (now.length - badC.length) + '/' + now.length);
  const kinds = {}; now.forEach(b => { if (b.fw) kinds[b.fw.kind] = (kinds[b.fw.kind] || 0) + 1; });
  const cr = now.filter(b => b.at.kind === 'crossing'), ic = now.filter(b => b.at.kind === 'interchange');
  check(cr.length > 0 && cr.every(b => b.fw && (b.fw.kind === 'overpass' || b.fw.kind === 'underpass')) && ic.length > 0 && ic.every(b => b.fw && b.fw.kind === 'interchange') && Object.keys(kinds).length === 4,
    'B2', 'WHAT THE MAP IS: ' + cr.length + ' crossings dealt the overpass or the underpass, ' + ic.length + ' interchanges dealt the stack; dealt ' + JSON.stringify(kinds));
  /* M6: the old deal at a freeway spot is red on B1's own test */
  const m6 = before.filter(b => b.family === 'freeway').length;
  check(before.length > 0 && m6 === 0, 'M6', 'planted: the old deal at the freeway spots turns B1 red (' + (before.length - m6) + ' of ' + before.length + ' not a freeway board)');
  /* B3: AUTO plays three rounds on each template */
  const played = {};
  for (const k of ['deck', 'overpass', 'underpass', 'interchange']) {
    const s = now.filter(b => b.fw && b.fw.kind === k)[0]; if (!s) { played[k] = 'none dealt'; continue; }
    const e0 = F.errs.length;
    const r = await F.p.evaluate(async o => { window.FIGHT_OPTS = Object.assign({}, o, { speed: 4, auto: true }); start(); const F = eval('FIGHT');
      const t0 = performance.now(); while (performance.now() - t0 < 60000 && F.S.round < 4 && !F.S.over) await new Promise(r => setTimeout(r, 250));
      return { round: F.S.round, over: F.S.over, name: F.S.boardDef.name, family: F.S.boardDef.family }; }, { district: s.at.district, cell: s.at.cell, kind: 'freeway', freeway: s.at, seed: 77, freewayAsk: { kind: k } });
    played[k] = { round: r.round, over: r.over, family: r.family, errors: F.errs.length - e0 };
  }
  check(Object.values(played).every(v => v && v.family === 'freeway' && (v.round >= 3 || v.over) && !v.errors), 'B3', 'THE FIGHT PLAYS: AUTO on each board ' + JSON.stringify(played));
  check(!!map.door && map.door.family === 'freeway', 'W1', 'THE DEMO\'S OWN DOOR: a fight at ' + JSON.stringify(map.door && map.door.asked) + ' (' + (map.door && map.door.district) + ') laid ' + JSON.stringify(map.door).slice(0, 220));
  report.B.before = { n: before.length, onHouses: onHouses.length, freewayShare: Math.round(share * 1000) / 1000 }; report.B.now = { n: now.length, kinds }; report.B.played = played; report.B.door = map.door;
  await F.close();
}
/* H: THE HEADLESS FIGHT STILL LOADS (tools/bohemia_fight_headless.js reads the page's 'DB.x = a[i]' lines and runs it with no
   window; about twenty gates stand on it, and this lane's loader broke it once on the way in, 11/7): a freeway-district fight
   plays out headless, its rules read, no throw */
function legH() {
  let r = null, err = null;
  try { const { engine, playOut } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js')); const ctx = engine({});
    const o = playOut(ctx, { seed: 9, district: 'freeway', cell: [40, 50], kind: 'freeway' }, 60000); r = { round: o.S.round, board: o.S.boardDef && o.S.boardDef.name, rules: !!ctx.DB.rules && !!ctx.DB.rules.ap }; }
  catch (e) { err = String(e && e.message || e); }
  check(!err && r && r.rules && r.round > 0, 'H', 'THE HEADLESS FIGHT STILL LOADS: a freeway-district fight played headless ' + (err ? 'THREW ' + err : JSON.stringify(r)));
}
(async () => {
  const ok = legA(); legM(ok); legH();
  if (!QUICK) { try { await legB(); } catch (e) { check(false, 'B', 'the browser legs broke: ' + String(e && e.stack || e).slice(0, 400)); } }
  console.log('\nTHE FREEWAY FIGHT: ' + pass + ' passed, ' + fail + ' failed');
  if (OUT) fs.writeFileSync(OUT, JSON.stringify({ pass, fail, lines, report }, null, 1));
  process.exit(fail ? 1 : 0);
})();
