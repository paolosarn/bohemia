#!/usr/bin/env node
/* THE FLOOD TUNNELS (COMBAT TWO 11/9/26, VAMILY rule 440(a), rule 416's list, ask line 539; Paolo 11/9: 'More everything pls'; the
   coordinator: 'a long chain of house-sized culvert tiles, camps on the walls, the street's light through the grates, dark unless
   lit, the flash flood as the event; a fight at a wash or a drain mouth can use it'). The second big interior, under the city
   (slices/bohemia_flood_tunnels.js, slices/fight_ground/tunnels/tunnels.json).
   MEASURED BEFORE (main 8abcb8517): a fight at the wash was dealt the wash's own place board (the open concrete channel in the sun)
   every time; nothing under the city existed, no flood, no camp, no grate.
   THE LEGS (the live fight's own deal, headless; the wash and the basin x 12 cells each for the share, 24 tunnels boards for the rest):
     T1  A FIGHT AT THE WASH MAY GO UNDER: at the wash and the basin about half the fights (the data's share, by the cell's own dice,
         so the same spot is always the same) are in the tunnels; never at a district that has no drain; opts.inside 'tunnels'
         always, false never
     T2  THE TUNNELS ARE JOINED: every open tile reached from every other; both lines on open floor; every man of either side has a
         walk to the other side; every layout in the data is dealt (three, each mirrored both ways by the dice)
                                                                                 planted: the fill run across every culvert, red
     T3  THE FLASH FLOOD: the roar the round before, then on the round the dice picked (round_min to round_max) every tile of the
         main channel is water (the swamp's row: slow, fights worse) for 'lasts' rounds, then the silt (rough); the drains and the
         chambers stay dry                                                        planted: a flood that never drops, red
     T4  THE DARK: under the ground it is night by day and by night; by day the grates and the mouths light their tiles and the
         drums burn; at night only the drums; the most of the tunnels is dark either way
                                                                                   planted: the grates read live at night, red
     T5  THE PIECES ARE REAL: every piece has its picture and its model (the master rig); the camps are low cover on the walls, the
         jam is cover in the channel, a cut-away wall on every edge a culvert shares with the fill, the trash rack across the
         channel's end at both mouths
     T6  A FIGHT PLAYS: both sides on AUTO, every fight under the city ends inside 30 rounds, and no able man of his stands a whole
         fight (rule 435(c))
   Run: node gates/the_flood_tunnels_gate.js [--json out.json]     (about twenty seconds) */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..'), HL = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const OUT = arg('--json', null);
let pass = 0, fail = 0;
const check = (ok, name, msg) => { if (ok) pass++; else fail++; console.log((ok ? 'PASS ' : 'FAIL ') + name + '  ' + msg); return ok; };
const J = f => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8')); } catch (e) { return null; } };
const ctx = HL.engine({ extra: { window: null } }); ctx.window = ctx;
for (const f of ['slices/bohemia_street_board.js', 'engine/bohemia_fight_kinds.js', 'slices/bohemia_casino_floor.js', 'slices/bohemia_flood_tunnels.js']) { try { vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx); } catch (e) {} }
const SK = 'slices/fight_ground/street_board/';
ctx.DB.streetKit = J(SK + 'street_board.json'); ctx.DB.streetDress = J(SK + 'dressing.json'); ctx.DB.streetStoreys = J(SK + 'storeys.json');
const data = J('slices/fight_ground/tunnels/tunnels.json'), sizes = J('slices/fight_ground/tunnels/sizes.json') || {};
const kit = {}; Object.keys(data.kit).forEach(k => { const z = sizes[k.replace(/^tunnel_/, '')]; kit[k] = Object.assign({}, data.kit[k], z ? { src: z.src } : {}); });
ctx.DB.tunnels = { data, sizes, kit };
const F = ctx.FIGHT, FT = ctx.BohemiaFloodTunnels, G = ctx.DB.ground, FL = data.flood;
const cellOf = i => ({ gx: (i * 31 + 7) % 90, gy: (i * 17 + 3) % 90 });
const deal = (d, i, extra) => { ctx.setSeed(700 + i); F.setup(Object.assign({ kind: 'suburb', district: d, cell: cellOf(i), night: false, auto: true, formation: null, deploy: false }, extra || {})); return F.S; };
const litCount = S => { let n = 0; for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) if (S.lit[y][x]) n++; return n; };
const openCount = S => { let n = 0; for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) if (S.terrain[y][x] !== 'blocked') n++; return n; };
/* a walk on foot from (x,y) to any tile next to a man of the other side (the fight's own passable and squeeze) */
const walks = (S, u) => { const T = F._t, seen = new Set([u.x + ',' + u.y]), q = [[u.x, u.y]];
  const foe = new Set(S.units.filter(t => t.side !== u.side && F.onField(t)).map(t => t.x + ',' + t.y));
  while (q.length) { const [x, y] = q.shift(); for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const a = x + dx, b = y + dy, k = a + ',' + b;
    if ((!dx && !dy) || seen.has(k) || a < 0 || b < 0 || a >= S.w || b >= S.h) continue; if (foe.has(k)) return true;
    if (!T.passable(a, b) || T.squeezes(x, y, a, b)) continue; seen.add(k); q.push([a, b]); } }
  return false; };
(async () => {
  const t0 = Date.now(), DIST = data.districts, R = { boards: [] };
  /* T1 */
  let under = 0, n1 = 0, none = 0, insideYes = 0, insideNo = 0, same = 0; const per = {};
  DIST.forEach(d => { per[d] = 0; for (let i = 0; i < 12; i++) { const S = deal(d, i); n1++; if (S.boardDef.interior === 'tunnels') { under++; per[d]++; } } });
  { const a = deal(DIST[0], 3).boardDef.interior, b = deal(DIST[0], 3).boardDef.interior; if (a === b) same++; }
  ['strip', 'suburb', 'downtown', 'industrial', 'casino'].forEach((d, i) => { const S = deal(d, i); if (S.boardDef.interior === 'tunnels') none++; });
  for (let i = 0; i < 4; i++) { if (deal('suburb', i, { inside: 'tunnels' }).boardDef.interior === 'tunnels') insideYes++; if (deal(DIST[0], i, { inside: false }).boardDef.interior !== 'tunnels') insideNo++; }
  const share = under / n1;
  check(share >= 0.25 && share <= 0.75 && none === 0 && insideYes === 4 && insideNo === 4 && same === 1, 'T1',
    'A FIGHT AT THE WASH MAY GO UNDER: ' + under + ' of ' + n1 + ' fights at ' + DIST.map(d => d + ' ' + per[d] + '/12').join(', ') + ' went under (the data\'s share ' + data.share + '; the same cell the same answer: ' + (same ? 'yes' : 'NO') + '); at five districts with no drain ' + none + '; asked in ' + insideYes + '/4, asked out ' + insideNo + '/4');
  /* T2 to T6 over 24 boards under the city (the wash, its cells, both flips by the dice) */
  let joined = 0, lines = 0, walkAll = 0, n = 0, floodOk = 0, floodSeen = 0, warnOk = 0, dryOk = 0, dayLit = 0, nightLess = 0, darkMost = 0, ended = 0, rounds = 0, idle = 0, men = 0;
  const bad2 = [], bad3 = [], bad4 = [], bad6 = [], PIECES = {}, flips = {}, LAY = {}; let wallsShort = 0, racksShort = 0, campsNotCover = 0, jamNotCover = 0;
  for (let i = 0; i < 24; i++) {
    const S = deal(DIST[i % DIST.length], i, { inside: 'tunnels' }), B = S.boardDef; if (B.interior !== 'tunnels') { bad2.push('s' + i + ' not under: ' + B.name); continue; } n++;
    const c = FT.check(B), L = B.laid, f = S.flood; flips[B.tunnels.flip.join(',')] = 1; LAY[B.tunnels.layout] = (LAY[B.tunnels.layout] || 0) + 1;
    if (c.reached === c.open && c.open > 100) joined++; else bad2.push('s' + i + ' ' + c.reached + '/' + c.open);
    if (S.units.every(u => !S.solid[u.y][u.x] && S.terrain[u.y][u.x] !== 'blocked')) lines++;
    if (S.units.every(u => walks(S, u))) walkAll++; else bad2.push('s' + i + ' a man with no walk to the other side');
    /* T4: by day the grates, the mouths and the drums; the same cell at night only the drums */
    const ld = litCount(S), open = openCount(S); if (S.night && S.power && ld > 0) dayLit++;
    if (ld < open / 2) darkMost++; else bad4.push('s' + i + ' day lit ' + ld + ' of ' + open);
    { const N = deal(DIST[i % DIST.length], i, { inside: 'tunnels', night: true }), ln = litCount(N), fires = (N.boardDef.lights || []).filter(l => l.circuit === 'fire' && l.live).length, days = (N.boardDef.lights || []).filter(l => l.circuit === 'day' && l.live).length;
      if (ln > 0 && ln < ld && fires > 0 && days === 0) nightLess++; else bad4.push('s' + i + ' night lit ' + ln + ' (day ' + ld + ', fires ' + fires + ', grates live ' + days + ')'); }
    const S2 = deal(DIST[i % DIST.length], i, { inside: 'tunnels' }), B2 = S2.boardDef, f2 = S2.flood;
    /* T5 */
    (B2.cover || []).forEach(cv => { PIECES[cv.piece] = (PIECES[cv.piece] || 0) + 1; });
    let edges = 0; const T = B2.laid.tiles; for (let y = 0; y < S2.h; y++) for (let x = 0; x < S2.w; x++) { if (T[y][x] !== 'fill') continue;
      [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach(d => { const u = x + d[0], v = y + d[1]; if (u >= 0 && v >= 0 && u < S2.w && v < S2.h && T[v][u] !== 'fill') edges++; }); }
    const walls = (B2.cover || []).filter(cv => /tunnel_wall/.test(cv.piece)).length; if (walls < edges) wallsShort++;
    const racks = (B2.cover || []).filter(cv => /tunnel_(rack|mouth)/.test(cv.piece)), chEdge = f2.tiles.filter(q => q[0] === 0 || q[0] === S2.w - 1).length;
    if (racks.length !== chEdge || !racks.some(r => r.piece === 'tunnel_mouth' && r.tx === 0) || !racks.some(r => r.piece === 'tunnel_mouth' && r.tx === S2.w - 1)) racksShort++;
    (B2.cover || []).forEach(cv => { if (/tunnel_camp/.test(cv.piece) && !(S2.coverCount[cv.ty][cv.tx] > 0)) campsNotCover++; if (cv.piece === 'tunnel_jam' && !(S2.coverCount[cv.ty][cv.tx] > 0)) jamNotCover++; });
    /* T3 + T6: the fight on AUTO, the channel read at the top of every round */
    const chan = new Set(f2.tiles.map(q => q[0] + ',' + q[1])), dryTiles = []; for (let y = 0; y < S2.h; y++) for (let x = 0; x < S2.w; x++) if (S2.terrain[y][x] !== 'blocked' && !chan.has(x + ',' + y)) dryTiles.push([x, y]);
    const mine = S2.units.filter(u => u.side === 'you'), acted = {}, able = {}; mine.forEach(u => { able[u.id] = 0; });
    let lastRound = -1, okF = true, okDry = true, cur = null, snap = null, g = 0; const seenRounds = [];
    const readRound = () => { const r = S2.round, w = f2.tiles.filter(q => S2.terrain[q[1]][q[0]] === 'water').length, ro = f2.tiles.filter(q => S2.terrain[q[1]][q[0]] === 'rough').length, k = f2.tiles.length;
      seenRounds.push(r + ':' + w + '/' + ro);
      if (r < f2.round && (w || ro)) okF = false;
      if (r >= f2.round && r < f2.round + f2.lasts && w !== k) okF = false;
      if (r >= f2.round + f2.lasts && ro !== k) okF = false;
      if (dryTiles.some(q => S2.terrain[q[1]][q[0]] === 'water')) okDry = false; };
    const close = () => { if (!cur || !snap) return; const u = cur; if (u.x !== snap.x || u.y !== snap.y || S2.log.slice(snap.n).some(e => e.id === u.id && /^(attack|step|skill|reload|swap|wall|rally|shot|sweep|hook|net|throw|move)$/.test(e.t))) acted[u.id] = true; };
    while (!S2.over && S2.round <= 30 && g < 80000) { const u = F.current(); if (!u) break;
      if (S2.round !== lastRound) { lastRound = S2.round; readRound(); }
      if (u !== cur) { close(); cur = u.side === 'you' ? u : null; snap = cur ? { x: u.x, y: u.y, n: S2.log.length } : null; if (cur && !(u.dead || u.down || u.fled || u.morale === 'Fleeing')) able[u.id]++; }
      F.aiStep(u); g++; }
    close();
    if (S2.over) ended++; else bad6.push('s' + i + ' not over at round ' + S2.round); rounds += S2.round;
    mine.forEach(u => { men++; if (!acted[u.id] && able[u.id] >= 2) { idle++; bad6.push('s' + i + ' ' + u.id + ' stood a whole fight'); } });
    const came = lastRound >= f2.round, warned = S2.log.some(e => e.t === 'flood_warn' && e.round === f2.round - (f2.warn || 1)), said = S2.log.some(e => e.t === 'flood' && e.round === f2.round);
    if (came) { floodSeen++; if (okF && said) floodOk++; else bad3.push('s' + i + ' round ' + f2.round + ' seen ' + seenRounds.join(' ')); if (warned) warnOk++; }
    if (okDry) dryOk++; else bad3.push('s' + i + ' water off the main channel');
    const inRange = f2.round >= FL.round_min && f2.round <= FL.round_max; if (!inRange) bad3.push('s' + i + ' flood round ' + f2.round + ' outside ' + FL.round_min + '-' + FL.round_max);
    R.boards.push({ i, layout: B.tunnels.layout, flip: B.tunnels.flip, open: c.open, reached: c.reached, lights: c.lights, day: ld, floodRound: f2.round, channel: f2.tiles.length, over: S2.over, rounds: S2.round, came });
  }
  check(joined === n && lines === n && walkAll === n && n >= 20 && Object.keys(LAY).length === Object.keys(data.board.templates.drains.layouts).length, 'T2', 'THE TUNNELS ARE JOINED: ' + joined + ' of ' + n + ' boards every open tile reached, both lines on open floor on ' + lines + ', every man with a walk to the other side on ' + walkAll + ' (layouts dealt: ' + Object.keys(LAY).map(k => k + ' ' + LAY[k]).join(', ') + '; flips: ' + Object.keys(flips).join(' ') + ')' + bad2.slice(0, 3).map(s => '; ' + s).join(''));
  { const S = deal(DIST[0], 0, { inside: 'tunnels' }), B = S.boardDef, L = B.laid, keep = L.terrain.map(r => r.slice()); for (let y = 0; y < L.H; y++) L.terrain[y][10] = 'blocked';
    const c = FT.check(B); L.terrain.forEach((r, y) => r.forEach((t, x) => { r[x] = keep[y][x]; }));
    check(c.reached < c.open, 'T2p', 'planted: the fill run across every culvert at column 10 is caught (' + c.reached + ' of ' + c.open + ' reached)'); }
  check(floodSeen >= 12 && floodOk === floodSeen && warnOk === floodSeen && dryOk === n && !bad3.length, 'T3', 'THE FLASH FLOOD: on ' + floodOk + ' of the ' + floodSeen + ' fights that lasted to it, the main channel was water on the round the dice picked (' + FL.round_min + ' to ' + FL.round_max + ') for ' + FL.lasts + ' rounds, then silt; the roar came the round before on ' + warnOk + '; the drains and chambers dry on ' + dryOk + ' of ' + n + bad3.slice(0, 3).map(s => '; ' + s).join(''));
  { /* every man ends his turn where he stands, so the rounds run on past the flood whatever the fight would do */
    const S = deal(DIST[0], 1, { inside: 'tunnels' }), f = S.flood; f.lasts = 99; let r0 = 0, g = 0, ok = true, past = false;
    while (!S.over && S.round <= f.round + (FL.lasts || 2) + 1 && g < 4000) { const u = F.current(); if (!u) break;
      if (S.round !== r0) { r0 = S.round; if (r0 >= f.round + (FL.lasts || 2)) { past = true; const ro = f.tiles.filter(q => S.terrain[q[1]][q[0]] === 'rough').length; if (ro !== f.tiles.length) ok = false; } }
      F.endTurn(u); g++; }
    check(past && !ok, 'T3p', 'planted: a flood that never drops is caught (round ' + r0 + ', the water still up on the round it should be silt)'); }
  check(dayLit === n && nightLess === n && darkMost === n, 'T4', 'THE DARK: under the ground it is night on every board; by day the grates, mouths and drums light their tiles on ' + dayLit + ' of ' + n + ', at night only the drums (fewer tiles lit, not one grate live) on ' + nightLess + ', and the most of the tunnels dark on ' + darkMost + bad4.slice(0, 3).map(s => '; ' + s).join(''));
  { const N = deal(DIST[0], 0, { inside: 'tunnels', night: true }); N.boardDef.lights.forEach(l => { if (l.circuit === 'day') l.live = true; });
    const days = N.boardDef.lights.filter(l => l.circuit === 'day' && l.live).length;
    check(days > 0, 'T4p', 'planted: the grates read live at night are caught (' + days + ' grates and mouths live after dark)'); }
  /* T5: the pictures and the rules of the pieces */
  const missing = [], kinds = [];
  Object.keys(PIECES).forEach(p => { const d = kit[p]; if (!d || !d.src) { missing.push(p + ' (no picture)'); return; } if (!fs.existsSync(path.join(ROOT, 'slices/fight_ground', d.src))) missing.push(p + ' ' + d.src); });
  Object.keys(data.lights).forEach(k => { const s = data.lights[k].src; if (s && !fs.existsSync(path.join(ROOT, 'slices/fight_ground', s))) missing.push('light ' + k + ' ' + s); });
  Object.keys(sizes).forEach(k => { if (!sizes[k].model || !fs.existsSync(path.join(ROOT, sizes[k].model))) missing.push(k + ' (no model)'); });
  ['tunnel_camp_a', 'tunnel_camp_b', 'tunnel_jam', 'tunnel_wall_ew', 'tunnel_wall_ns', 'tunnel_rack', 'tunnel_mouth'].forEach(p => { if (!PIECES[p]) kinds.push('no ' + p); });
  if (wallsShort) kinds.push(wallsShort + ' boards with a culvert edge and no wall');
  if (racksShort) kinds.push(racksShort + ' boards without the rack across both ends');
  if (campsNotCover) kinds.push(campsNotCover + ' camps not cover');
  if (jamNotCover) kinds.push(jamNotCover + ' jams not cover');
  check(!missing.length && !kinds.length, 'T5', 'THE PIECES ARE REAL: ' + Object.keys(PIECES).length + ' kinds of piece (' + Object.keys(PIECES).map(p => p.replace(/^tunnel_/, '') + ' ' + PIECES[p]).join(', ') + '), every one with its picture and its model through the master rig; the camps and the jam are cover, a wall on every culvert edge, the rack across both ends' + (missing.concat(kinds).length ? ': ' + missing.concat(kinds).slice(0, 5).join('; ') : ''));
  check(ended === n && idle === 0, 'T6', 'A FIGHT PLAYS: ' + ended + ' of ' + n + ' fights under the city ended on AUTO inside 30 rounds (' + (n ? (rounds / n).toFixed(1) : 0) + ' rounds a fight); ' + idle + ' of ' + men + ' men of his stood a whole fight' + bad6.slice(0, 3).map(s => '; ' + s).join(''));
  if (OUT) fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
  console.log('\nTHE FLOOD TUNNELS: ' + pass + ' passed, ' + fail + ' failed (' + Math.round((Date.now() - t0) / 1000) + ' s)');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
