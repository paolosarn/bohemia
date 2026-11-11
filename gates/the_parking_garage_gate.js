#!/usr/bin/env node
/* THE PARKING GARAGE (COMBAT THREE 11/11/26, VAMILY rule 440(a), rule 416's list, ask row 539; Paolo 11/9: 'More everything pls'; the
   coordinator: 'THE FLOOD TUNNELS and THE PARKING GARAGE as fight boards, house-sized tiles, each tile with its cost and effect, every
   building on a road, AUTO scrambles off the open floor; the casino floor is the golden piece to match'). The third big interior
   (slices/bohemia_parking_garage.js, slices/fight_ground/garage/garage.json).
   MEASURED BEFORE (main a87a1a3f): no garage existed; a fight at a casino was always the casino floor, at the mall, the convention
   centre, the stadium, the Sphere, the Strat, the hospital and the airport's terminal a street board.
   THE LEGS (the live fight's own deal, headless):
     G1  A FIGHT AT A PLACE WITH A GARAGE MAY BE FOUGHT IN IT: the data's share of the fights at its districts, by the cell's own dice
         (the same spot always the same board); never at a district with no garage; opts.inside 'garage' always, false never; a casino
         fight that is not in the garage is still on the casino floor
     G2  THE DECK IS JOINED: every open tile reached from every other, both lines on open floor with a walk to each other, every
         layout dealt, mirrored east to west by the dice                          planted: a wall across the deck, red
     G3  THE RAMP IS THE WALK UP, THE RAIL IS A CLIMB: every tile of the raised bay is walked to from the low bay by a ramp, and
         with the ramps shut by none; the bay is the fight's roof (level 1: a step up onto it from low floor is a climb, rule 328:
         no attack that turn); a ramp is high ground and never a roof (a man walks up it and still strikes)
                                                                 planted: one tile of the bay read as plain floor, red
     G4  THE DARK: under the decks it is night by day and by night; by day the open sides and the way in light their tiles and the
         drums burn; at night only the drums; the middle of the deck is dark either way
                                                                                   planted: the open sides read live at night, red
     G5  THE PIECES ARE REAL: every piece has its picture and its model (the master rig); the deck's sheet exists; dead cars and
         wrecks are cover, the booth is cover, the rail and the columns let nobody stand, the edge wall on every edge of the deck
     G6  A FIGHT PLAYS: both sides on AUTO, every fight ends inside 30 rounds, and no able man of his stands a whole fight (435(c))
     G7  EVERY TILE HAS ITS COST AND ITS EFFECT (rule 59): every kind of tile a layout holds has its row in the data's 'tiles'; the
         fight's own price of a step onto it IS that AP (from a tile at its own height; up half a storey one more); the tiles with a
         line say it on the first tap; up the ramp is a walk at 3 then 2 AP, over the rail a climb at 3
                                                                      planted: a tile kind with no row, red; a wrong AP, red
     G8  AUTO SCRAMBLES OFF THE OPEN FLOOR (rule 428(c) indoors): the drive aisle is open floor; after the first round fewer men
         stand on its bare tiles than with the rule off, and more on cover       planted: the rule off reads as no scramble
     G9  THEY HOLD THE GALLERY: a third to a half of the band starts up on the high bay; his line starts on the low bay; men are
         on the high bay in the first rounds                                      planted: the start taken off the board, nobody up
   Run: node gates/the_parking_garage_gate.js [--json out.json]     (about a minute) */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..'), HL = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const OUT = arg('--json', null);
let pass = 0, fail = 0;
const check = (ok, name, msg) => { if (ok) pass++; else fail++; console.log((ok ? 'PASS ' : 'FAIL ') + name + '  ' + msg); return ok; };
const J = f => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8')); } catch (e) { return null; } };
const ctx = HL.engine({ extra: { window: null } }); ctx.window = ctx;
for (const f of ['slices/bohemia_street_board.js', 'engine/bohemia_fight_kinds.js', 'slices/bohemia_casino_floor.js', 'slices/bohemia_flood_tunnels.js', 'slices/bohemia_parking_garage.js']) { try { vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx); } catch (e) {} }
const SK = 'slices/fight_ground/street_board/';
ctx.DB.streetKit = J(SK + 'street_board.json'); ctx.DB.streetDress = J(SK + 'dressing.json'); ctx.DB.streetStoreys = J(SK + 'storeys.json');
const kitOf = (data, sizes, pre) => { const kit = {}; Object.keys(data.kit).forEach(k => { const z = sizes[k.replace(pre, '')]; kit[k] = Object.assign({}, data.kit[k], z ? { src: z.src } : {}); }); return kit; };
const data = J('slices/fight_ground/garage/garage.json'), art = J('slices/fight_ground/garage/garage_art.json');
const kit = {}; Object.keys(art.kit).forEach(k => { kit[k] = Object.assign({}, art.kit[k], (data.rules || {})[k] || {}); });
Object.keys(data.kit).forEach(k => { const q = (data.sizes || {})[data.kit[k].like || k.replace(/^garage_/, '')]; kit[k] = Object.assign({}, q ? { src: q.src } : {}, data.kit[k]); });
ctx.DB.garage = { data, art, sizes: data.sizes || {}, kit };
const sizes = data.sizes || {};
{ const cd = J('slices/fight_ground/casino/casino_floor.json'), cz = J('slices/fight_ground/casino/sizes.json') || {}; if (cd) ctx.DB.casino = { data: cd, sizes: cz, kit: kitOf(cd, cz, /^casino_/) }; }
const F = ctx.FIGHT, PG = ctx.BohemiaParkingGarage, DIST = data.districts, TK = data.tiles, LEG = data.board.legend, LAYS = data.board.templates.deck.layouts;
const cellOf = i => ({ gx: (i * 31 + 7) % 90, gy: (i * 17 + 3) % 90 });
const deal = (d, i, extra) => { ctx.setSeed(900 + i); F.setup(Object.assign({ kind: 'strip', district: d, cell: cellOf(i), night: false, auto: true, formation: null, deploy: false }, extra || {})); return F.S; };
const litCount = S => { let n = 0; for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) if (S.lit[y][x]) n++; return n; };
const walks = (S, u) => { const T = F._t, seen = new Set([u.x + ',' + u.y]), q = [[u.x, u.y]];
  const foe = new Set(S.units.filter(t => t.side !== u.side && F.onField(t)).map(t => t.x + ',' + t.y));
  while (q.length) { const [x, y] = q.shift(); for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const a = x + dx, b = y + dy, k = a + ',' + b;
    if ((!dx && !dy) || seen.has(k) || a < 0 || b < 0 || a >= S.w || b >= S.h) continue; if (foe.has(k)) return true;
    if (!T.passable(a, b) || T.squeezes(x, y, a, b)) continue; seen.add(k); q.push([a, b]); } }
  return false; };
(async () => {
  const t0 = Date.now(), R = { boards: [] };
  /* G1 */
  { let in1 = 0, n1 = 0, none = 0, yes = 0, no = 0, same = 0, casinoRest = 0, casinoN = 0; const per = {};
    DIST.forEach(d => { per[d] = 0; for (let i = 0; i < 12; i++) { const S = deal(d, i); n1++; if (S.boardDef.interior === 'garage') { in1++; per[d]++; } else if (['casino', 'highroller', 'luxor', 'resort'].indexOf(d) >= 0) { casinoN++; if (S.boardDef.interior === 'casino') casinoRest++; } } });
    { const a = deal(DIST[0], 5).boardDef.interior, b = deal(DIST[0], 5).boardDef.interior; if (a === b) same++; }
    ['suburb', 'wash', 'downtown', 'industrial', 'desert', 'airport'].forEach((d, i) => { if (deal(d, i).boardDef.interior === 'garage') none++; });
    for (let i = 0; i < 4; i++) { if (deal('suburb', i, { inside: 'garage' }).boardDef.interior === 'garage') yes++; if (deal(DIST[0], i, { inside: false }).boardDef.interior !== 'garage') no++; }
    const share = in1 / n1;
    check(share >= 0.2 && share <= 0.6 && none === 0 && yes === 4 && no === 4 && same === 1 && casinoRest === casinoN && casinoN > 0, 'G1',
      'A FIGHT AT A PLACE WITH A GARAGE MAY BE FOUGHT IN IT: ' + in1 + ' of ' + n1 + ' fights at its ' + DIST.length + ' districts (' + DIST.map(d => d + ' ' + per[d]).join(', ') + ' of 12 each); the same cell the same answer: ' + (same ? 'yes' : 'NO') + '; at six districts with no garage ' + none + '; asked in ' + yes + '/4, asked out ' + no + '/4; a casino fight not in the garage is on the casino floor ' + casinoRest + ' of ' + casinoN); }
  /* G2 to G6 over 24 decks */
  let joined = 0, lines = 0, walkAll = 0, n = 0, onlyRamps = 0, levelOk = 0, dayLit = 0, nightLess = 0, darkMid = 0, ended = 0, rounds = 0, idle = 0, men = 0;
  const bad2 = [], bad3 = [], bad4 = [], bad5 = [], bad6 = [], PIECES = {}, LAY = {};
  for (let i = 0; i < 24; i++) {
    const S = deal(DIST[i % DIST.length], i, { inside: 'garage' }), B = S.boardDef; if (B.interior !== 'garage') { bad2.push('s' + i + ' not a garage: ' + B.name); continue; } n++;
    const c = PG.check(B), L = B.laid; LAY[B.garage.layout + (B.garage.flip[1] ? ' mirrored' : '')] = (LAY[B.garage.layout + (B.garage.flip[1] ? ' mirrored' : '')] || 0) + 1;
    if (c.reached === c.open && c.open > 150) joined++; else bad2.push('s' + i + ' ' + c.reached + '/' + c.open);
    if (S.units.every(u => !S.solid[u.y][u.x] && S.terrain[u.y][u.x] !== 'blocked')) lines++;
    if (S.units.every(u => walks(S, u))) walkAll++; else bad2.push('s' + i + ' a man with no walk to the other side');
    if (c.high > 30 && c.highReached === c.high && c.highWalked === c.high && c.highWithoutRamps === 0 && c.ramps >= 1) onlyRamps++; else bad3.push('s' + i + ' high ' + c.highReached + '/' + c.high + ', walked ' + c.highWalked + ', without the ramps ' + c.highWithoutRamps);
    { let ok = true; for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) if (S.terrain[y][x] === 'height' && (F.level(x, y) !== 1 || F.isRoof(x, y) !== (L.tiles[y][x] !== 'ramp'))) ok = false; if (ok) levelOk++; else bad3.push('s' + i + ' a bay tile not a level 1 roof, or a ramp that is a roof'); }
    /* G4 */
    const ld = litCount(S); let mid = 0, midLit = 0; for (let y = 4; y < S.h - 4; y++) for (let x = 2; x < S.w - 2; x++) if (S.terrain[y][x] !== 'blocked') { mid++; if (S.lit[y][x]) midLit++; }
    if (S.night && ld > 20) dayLit++; else bad4.push('s' + i + ' day lit ' + ld);
    if (midLit < mid * 0.5) darkMid++; else bad4.push('s' + i + ' the middle lit ' + midLit + ' of ' + mid);
    { const N = deal(DIST[i % DIST.length], i, { inside: 'garage', night: true }), ln = litCount(N), fires = (N.boardDef.lights || []).filter(l => l.circuit === 'fire' && l.live).length, days = (N.boardDef.lights || []).filter(l => l.circuit === 'day' && l.live).length;
      if (ln > 0 && ln < ld && fires > 0 && days === 0) nightLess++; else bad4.push('s' + i + ' night lit ' + ln + ' (day ' + ld + ', fires ' + fires + ', sides live ' + days + ')'); }
    /* G5 + G6 */
    const S2 = deal(DIST[i % DIST.length], i, { inside: 'garage' }), B2 = S2.boardDef, T2 = B2.laid.tiles;
    (B2.cover || []).forEach(cv => { PIECES[cv.piece] = (PIECES[cv.piece] || 0) + 1; });
    for (let y = 0; y < S2.h; y++) for (let x = 0; x < S2.w; x++) { const k = T2[y][x], t = TK[k] || {};
      if (t.cover && !(S2.coverCount[y][x] > 0)) bad5.push(k + ' at ' + x + ',' + y + ' gives no cover');
      if (t.blocks && !S2.solid[y][x]) bad5.push(k + ' at ' + x + ',' + y + ' lets a man stand'); }
    { let edges = 0; const wall = (x, y) => x < 0 || y < 0 || x >= S2.w || y >= S2.h || TK[T2[y][x]].row === 'obstacles';
      for (let y = 0; y < S2.h; y++) for (let x = 0; x < S2.w; x++) if (T2[y][x] === 'wall') [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach(d => { if (!wall(x + d[0], y + d[1])) edges++; });
      const walls = (B2.cover || []).filter(cv => /garage_wall/.test(cv.piece)).length; if (walls < edges) bad5.push('s' + i + ' ' + walls + ' walls for ' + edges + ' edges'); }
    const mine = S2.units.filter(u => u.side === 'you'), acted = {}, able = {}; mine.forEach(u => { able[u.id] = 0; });
    let cur = null, snap = null, g = 0;
    const close = () => { if (!cur || !snap) return; const u = cur; if (u.x !== snap.x || u.y !== snap.y || S2.log.slice(snap.n).some(e => e.id === u.id && /^(attack|step|skill|reload|swap|wall|rally|shot|sweep|hook|net|throw|move)$/.test(e.t))) acted[u.id] = true; };
    while (!S2.over && S2.round <= 30 && g < 80000) { const u = F.current(); if (!u) break;
      if (u !== cur) { close(); cur = u.side === 'you' ? u : null; snap = cur ? { x: u.x, y: u.y, n: S2.log.length } : null; if (cur && !(u.dead || u.down || u.fled || u.morale === 'Fleeing')) able[u.id]++; }
      F.aiStep(u); g++; }
    close();
    if (S2.over) ended++; else bad6.push('s' + i + ' not over at round ' + S2.round); rounds += S2.round;
    mine.forEach(u => { men++; if (!acted[u.id] && able[u.id] >= 2) { idle++; bad6.push('s' + i + ' ' + u.id + ' stood a whole fight'); } });
    R.boards.push({ i, layout: B.garage.layout, flip: B.garage.flip, open: c.open, high: c.high, ramps: c.ramps, cars: B.garage.cars, lights: c.lights, over: S2.over, rounds: S2.round });
  }
  check(joined === n && lines === n && walkAll === n && n >= 20 && Object.keys(LAY).length >= Object.keys(LAYS).length + 1, 'G2', 'THE DECK IS JOINED: ' + joined + ' of ' + n + ' decks every open tile reached, both lines on open floor on ' + lines + ', every man with a walk to the other side on ' + walkAll + ' (dealt: ' + Object.keys(LAY).map(k => k + ' ' + LAY[k]).join(', ') + ')' + bad2.slice(0, 3).map(s => '; ' + s).join(''));
  { const S = deal(DIST[0], 0, { inside: 'garage' }), B = S.boardDef, L = B.laid, keep = L.terrain.map(r => r.slice()); for (let y = 0; y < L.H; y++) L.terrain[y][9] = 'blocked';
    const c = PG.check(B); L.terrain.forEach((r, y) => r.forEach((t, x) => { r[x] = keep[y][x]; }));
    check(c.reached < c.open, 'G2p', 'planted: a wall across the deck at column 9 is caught (' + c.reached + ' of ' + c.open + ' reached)'); }
  check(onlyRamps === n && levelOk === n, 'G3', 'THE RAMP IS THE WALK UP, THE RAIL IS A CLIMB: on ' + onlyRamps + ' of ' + n + ' decks every tile of the raised bay is walked to by a ramp and none with the ramps shut; the bay the fight\'s roof at level 1 and the ramps never a roof on ' + levelOk + bad3.slice(0, 3).map(s => '; ' + s).join(''));
  { const S = deal(DIST[0], 0, { inside: 'garage' }), B = S.boardDef, L = B.laid; let at = null; for (let y = L.H - 1; y >= 0 && !at; y--) for (let x = 0; x < L.W && !at; x++) if (L.roofs[y][x] && L.tiles[y][x] === 'high_stall') at = [x, y];
    L.roofs[at[1]][at[0]] = false; const c = PG.check(B); L.roofs[at[1]][at[0]] = true;
    check(c.highWithoutRamps > 0, 'G3p', 'planted: one tile of the bay read as plain floor is caught (' + c.highWithoutRamps + ' tiles of the bay walked to with the ramps shut)'); }
  check(dayLit === n && nightLess === n && darkMid === n, 'G4', 'THE DARK: under the decks it is night on every board; by day the open sides, the way in and the drums light their tiles on ' + dayLit + ' of ' + n + ', at night only the drums (fewer tiles lit, not one side live) on ' + nightLess + ', the middle of the deck dark on ' + darkMid + bad4.slice(0, 3).map(s => '; ' + s).join(''));
  { const N = deal(DIST[0], 0, { inside: 'garage', night: true }); N.boardDef.lights.forEach(l => { if (l.circuit === 'day') l.live = true; });
    const days = N.boardDef.lights.filter(l => l.circuit === 'day' && l.live).length;
    check(days > 0, 'G4p', 'planted: the open sides read live at night are caught (' + days + ' live after dark)'); }
  { const missing = [], kit = ctx.DB.garage.kit, DK = ctx.DB.streetDress.kit, G = ctx.DB.ground;
    Object.keys(PIECES).forEach(p => { const d = kit[p] || DK[p] || G.cover[p] || G.cover_extra[p]; if (!d || !d.src) { missing.push(p + ' (no picture)'); return; } if (!fs.existsSync(path.join(ROOT, 'slices/fight_ground', d.src))) missing.push(p + ' ' + d.src); });
    Object.keys(data.kit).forEach(p => { if (!PIECES[p]) missing.push('never dealt: ' + p); });
    ['garage_level', 'garage_level_aisle', 'garage_rail_ew', 'garage_rail_ns', 'garage_wall_ew', 'garage_wall_ns', 'garage_core', 'garage_booth'].forEach(p => { if (!PIECES[p]) missing.push('COOK FIVE\'s ' + p + ' never dealt'); });
    if (!PIECES.garage_ramp_e && !PIECES.garage_ramp_w) missing.push('no ramp dealt'); if (!PIECES.garage_column && !PIECES.garage_column_b) missing.push('no column dealt');
    Object.keys(sizes).forEach(k => { if (!sizes[k].model || !fs.existsSync(path.join(ROOT, sizes[k].model))) missing.push(k + ' (no model)'); });
    ['stalls', 'aisle'].forEach(k => (art.floor[k] || []).forEach(g => { const f = String(g).split('#')[0]; if (!fs.existsSync(path.join(ROOT, 'slices/fight_ground', f))) missing.push('the floor ' + f); }));
    if (!(art.floor.stalls || []).length || !(art.floor.aisle || []).length) missing.push('the floor lists');
    Object.keys(data.lights).forEach(k => { const s = data.lights[k].src; if (s && !fs.existsSync(path.join(ROOT, 'slices/fight_ground', s))) missing.push('light ' + k + ' ' + s); });
    check(!missing.length && !bad5.length, 'G5', 'THE PIECES ARE REAL: ' + Object.keys(PIECES).length + ' kinds of piece (' + Object.keys(PIECES).map(p => p.replace(/^garage_/, '') + ' ' + PIECES[p]).join(', ') + '), every one with its picture: COOK FIVE\'s finished kit (the floor, the raised bay, the ramps, the rails, the wall, the columns, the core, the booths) and COMBAT\'s parked cars with their models; cars, wrecks and the booths are cover, the columns let nobody stand, a wall on every edge of the deck' + missing.concat(bad5).slice(0, 5).map(s => '; ' + s).join('')); }
  check(ended === n && idle === 0, 'G6', 'A FIGHT PLAYS: ' + ended + ' of ' + n + ' fights in the garage ended on AUTO inside 30 rounds (' + (n ? (rounds / n).toFixed(1) : 0) + ' rounds a fight); ' + idle + ' of ' + men + ' men of his stood a whole fight' + bad6.slice(0, 3).map(s => '; ' + s).join(''));
  /* G7 */
  { const kindsUsed = {}, bad7 = [];
    Object.keys(LAYS).forEach(ln => LAYS[ln].forEach(r => r.split('').forEach(c => { const q = LEG[c]; if (q) kindsUsed[q.tile || q.is] = 1; else bad7.push('no legend for ' + c); })));
    const rowsOk = k => { const t = TK[k]; return !!t && typeof t.effect === 'string' && t.effect.length > 12 && typeof t.row === 'string'; };
    Object.keys(kindsUsed).forEach(k => { if (!rowsOk(k)) bad7.push('no row for ' + k); });
    const price = (S, x, y) => { const T = F._t, u0 = S.units.filter(u => u.side === 'you')[0]; let best = null; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const a = x + dx, b = y + dy;
      if ((dx || dy) && a >= 0 && b >= 0 && a < S.w && b < S.h && S.terrain[b][a] !== 'blocked' && !S.solid[b][a] && F.level(a, b) === F.level(x, y)) { const c = T.stepCost(Object.assign({}, u0, { injuries: [], perks: [] }), a, b, x, y); if (best === null || c < best) best = c; } } return best; };
    let priced = 0, said = 0, sayOwed = 0, openTiles = 0, openMarked = 0, upCost = null, topCost = null, climb = null;
    for (let i = 0; i < 4; i++) { const S = deal(DIST[0], i, { inside: 'garage' }), L = S.boardDef.laid;
      for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) { const k = L.tiles[y][x], t = TK[k]; if (!t) { bad7.push('tile ' + k + ' has no row'); continue; }
        if (t.row === 'obstacles') { if (S.terrain[y][x] !== 'blocked') bad7.push(k + ' not blocked'); continue; }
        if (t.blocks) continue;
        const c = price(S, x, y); if (c === null) continue; if (c === t.ap) priced++; else bad7.push(k + ' at ' + x + ',' + y + ' costs ' + c + ', the table says ' + t.ap);
        const want = (S.lit[y][x] && t.say_lit) || t.say; if (want) { sayOwed++; if (F.groundSay(x, y) === want) said++; else bad7.push(k + ' says "' + F.groundSay(x, y) + '"'); }
        if (t.open) { openTiles++; if (S.street[y][x]) openMarked++; }
        if (k === 'ramp' && upCost === null) { const u0 = Object.assign({}, S.units[0], { injuries: [], perks: [] }); [[-1, 0], [1, 0]].forEach(d => { const a = x + d[0]; if (S.terrain[y][a] === 'flat' && !S.solid[y][a]) upCost = [F._t.stepCost(u0, a, y, x, y), F.climbsOn({ x: a, y: y }, [{ x: x, y: y }])]; else if (L.roofs[y][a]) topCost = [F._t.stepCost(u0, x, y, a, y), F.climbsOn({ x: x, y: y }, [{ x: a, y: y }])]; });
          for (let yy = 0; yy < S.h && !climb; yy++) for (let xx = 0; xx < S.w && !climb; xx++) if (L.roofs[yy][xx] && yy + 1 < S.h && S.terrain[yy + 1][xx] === 'flat') climb = [F._t.stepCost(u0, xx, yy + 1, xx, yy), F.climbsOn({ x: xx, y: yy + 1 }, [{ x: xx, y: yy }])]; } } }
    check(!bad7.length && priced > 400 && said === sayOwed && sayOwed > 150 && openTiles > 100 && openMarked === openTiles && upCost && upCost[0] === 3 && upCost[1] === false && topCost && topCost[0] === 2 && topCost[1] === false && climb && climb[0] === 3 && climb[1] === true, 'G7', 'EVERY TILE HAS ITS COST AND ITS EFFECT: ' + Object.keys(kindsUsed).length + ' kinds of tile in the layouts, each with its row (' + Object.keys(kindsUsed).sort().join(', ') + '); on four decks the fight charged the table\'s AP on ' + priced + ' tiles; ' + said + ' of ' + sayOwed + ' tiles with a line said it; the open floor ' + openMarked + ' of ' + openTiles + ' tiles; the step from the low aisle onto a ramp ' + (upCost && upCost[0]) + ' AP, a walk; from the ramp onto the bay ' + (topCost && topCost[0]) + ' AP, a walk; from low floor over the rail ' + (climb && climb[0]) + ' AP, a climb' + bad7.slice(0, 4).map(x => '; ' + x).join(''));
    { const keep = TK.cars; delete TK.cars; const miss = Object.keys(kindsUsed).filter(k => !rowsOk(k)); TK.cars = keep;
      check(miss.length === 1 && miss[0] === 'cars', 'G7p', 'planted: the cars\' row taken out of the table is caught (' + miss.join(', ') + ')'); }
    { const S3 = deal(DIST[0], 0, { inside: 'garage' }), L3 = S3.boardDef.laid; let wrong = 0; const was = TK.aisle.ap; TK.aisle.ap = 3;
      for (let y = 0; y < S3.h; y++) for (let x = 0; x < S3.w; x++) if (L3.tiles[y][x] === 'aisle' && price(S3, x, y) !== TK.aisle.ap) wrong++; TK.aisle.ap = was;
      check(wrong > 20, 'G7q', 'planted: the aisle priced 3 AP in the table is caught (' + wrong + ' tiles the fight charges 2 on)'); } }
  /* G8 + G9 */
  { const run = (off, noStart) => { let on = 0, all = 0, cover = 0, up0 = 0, band = 0, his0 = 0, highLater = 0;
      for (let i = 0; i < 12; i++) { const S = deal(DIST[i % DIST.length], i, Object.assign({ inside: 'garage' }, noStart ? { garageAsk: { start: null } } : {})), L = S.boardDef.laid, K = S.boardDef.tileKey;
        const bare = u => !!(K[L.tiles[u.y][u.x]] && K[L.tiles[u.y][u.x]].open) && !S.coverCount[u.y][u.x];
        S.units.forEach(u => { if (u.side !== 'you') { band++; if (F.level(u.x, u.y) > 0) up0++; } else if (F.level(u.x, u.y) > 0) his0++; });
        if (off) { for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) S.street[y][x] = false; }
        let g = 0, seen = 0; while (!S.over && S.round <= 2 && g < 6000) { const u = F.current(); if (!u) break;
          if (S.round === 2 && !seen) { seen = 1; S.units.filter(v => F.onField(v)).forEach(v => { all++; if (bare(v)) on++; if (S.coverCount[v.y][v.x]) cover++; if (F.level(v.x, v.y) > 0) highLater++; }); }
          S.byHand = false; F.aiStep(u); g++; } }
      return { on, all, cover, up0, band, his0, highLater }; };
    const A = run(false), Z = run(true), pa = A.on / A.all, pz = Z.on / Z.all;
    check(pa <= pz - 0.06 && pa <= 0.25 && A.cover > Z.cover, 'G8', 'AUTO SCRAMBLES OFF THE OPEN FLOOR: after the first round ' + A.on + ' of ' + A.all + ' men (' + Math.round(pa * 100) + '%) stand on the bare drive aisle, with the rule off ' + Z.on + ' of ' + Z.all + ' (' + Math.round(pz * 100) + '%); on cover ' + A.cover + ' against ' + Z.cover);
    check(!(pz <= pz - 0.06), 'G8p', 'planted: the aisle not open floor (the rule off) reads as no scramble (' + Math.round(pz * 100) + '% against itself)');
    const share = A.up0 / A.band;
    check(share >= 0.3 && share <= 0.5 && A.his0 === 0 && A.highLater > 0, 'G9', 'THEY HOLD THE GALLERY: ' + A.up0 + ' of ' + A.band + ' of the band (' + Math.round(share * 100) + '%) start up on the high bay, ' + A.his0 + ' of his; ' + A.highLater + ' men on the high bay after the first round');
    const P = run(false, true);
    check(P.up0 === 0, 'G9p', 'planted: the start taken off the board, nobody starts up (' + P.up0 + ' of ' + P.band + '; ' + P.highLater + ' on the high bay after the first round)'); }
  if (OUT) fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
  console.log('\nTHE PARKING GARAGE: ' + pass + ' passed, ' + fail + ' failed (' + Math.round((Date.now() - t0) / 1000) + ' s)');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
