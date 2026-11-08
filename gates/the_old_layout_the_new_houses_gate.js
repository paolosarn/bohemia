#!/usr/bin/env node
/* THE OLD LAYOUT, THE NEW HOUSES (COMBAT TWO 11/7/26, VAMILY rule 423, ask lines 484 to 488; Paolo 11/7: 'the combat map is still
   dogshit like each house should be connected by road or mini road... every house should be a tile that I can be on... if it's one
   story I can still be on top of it, that's a defense boost, but not a range offense boost... converted to two or three story
   houses... there's no ladder system... no one wants to be right in the middle of the street, that's how you get shot at the
   most... use the layout of before and just swap the house assets').
   ONE GATE FOR (b) (c) (d) (e), each leg with a planted fail that must turn it red (a gate that cannot fail is not a gate).
   THE BOARDS: the live fight's own rules in node (tools/bohemia_fight_headless.js, slices/bohemia_street_board.js and the street
   kit loaded the way the page loads them), a fight from the map at 44 spots (11 districts whose boards carry houses: the suburb
   place's seven and the suburb blocks' others, four cells each), dealt the way the map's door deals them.
     A1  (a) the layout is the template's: the same blocks a tile for tile as the template the same spot deals with no houses
         swapped (opts.houses false), the terrain the same on every tile that is no house; every new house on a template house tile
     A2  428(a) every one of the fifteen 11/3 place boards is dealt at its own places, 20 seeds each           planted: one unbuilt
     B1  (b) every house touches a way: a tile beside it (4 ways) a man walks on that is no house                     planted: a lump
     B2  (b) every floor tile is reachable: every tile a man can stand on joins his start column                     planted: a walled tile
     C1  (c) every house tile is a tile a man can be on (passable, never a wall), at its storeys' level              planted: a house walled
     D1  (d) storeys 1 to 3 only; rule 428(b): most one or two (each at least a quarter), three rare but real      planted: all one, all three
         (present, at most a fifth)
     D2  (d) a one-storey house adds no reach, two one tile, three two (rangeUp); its level is its storeys (the defence)  planted: range_from 1
     D3  (d) no ladders: entering a house is no climb (climbsUp false), and the page draws none (UI.ladders empty)     planted: drawLadders
     E1  (e) AUTO counts the open street worst: streetCost on an open street tile > 0 > on a house                    planted: the cost off
     E2  (e) AUTO, both sides, 4 rounds at 6 spots: of the turns a man moved, the share ending on the open street is under
         half the open street's share of the walkable board                                               planted: the cost off
     E4  428(d) THE ENEMY DIGS IN: the same boards, theirs made weak, after two rounds on good ground (>85%), some of them farther
         from us, the gap closing under 2.5 tiles; theirs made strong, the gap closing over 2                         planted: odds read off
     E3  428(c) THE SCRAMBLE: 24 seeds, every man of both sides put on the open street nearest his start; after their first moves
         on AUTO more than 60% of EACH side stands on a house, a roof or cover                                                 planted: the cost off
   Run: node gates/the_old_layout_the_new_houses_gate.js [--json out.json] [--nopage]       (about a minute) */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), http = require('http');
const ROOT = path.join(__dirname, '..'), H = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const OUT = arg('--json', null), NOPAGE = process.argv.indexOf('--nopage') > 0;
let pass = 0, fail = 0; const lines = [];
const check = (ok, name, msg) => { if (ok) pass++; else fail++; const l = (ok ? 'PASS ' : 'FAIL ') + name + '  ' + msg; lines.push(l); console.log(l); return ok; };
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, 'slices/fight_ground/street_board', f), 'utf8'));
function eng() {
  const ctx = H.engine({ extra: { window: null } });
  ctx.window = ctx; vm.runInContext(fs.readFileSync(path.join(ROOT, 'slices/bohemia_street_board.js'), 'utf8'), ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'engine/bohemia_fight_kinds.js'), 'utf8'), ctx);   /* WORLD THIRTEEN's table, as the page loads it */
  ctx.DB.streetKit = J('street_board.json'); ctx.DB.streetDress = J('dressing.json'); try { ctx.DB.streetStoreys = J('storeys.json'); } catch (e) { ctx.DB.streetStoreys = null; }
  return ctx;
}
const DISTRICTS = ['suburb', 'town', 'estate', 'gated', 'school', 'chapel', 'library', 'arterial', 'jobsoffice', 'tvstation', 'natmuseum'];   /* every district whose board carries houses (the suburb place's seven, the suburb blocks' own: measured, the civic ones deal main, ruin and strip) */
const CELLS = [[58, 24], [12, 88], [40, 40], [77, 61]];
const D4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/* the board's facts, read from the live fight after a deal */
function facts(ctx) {
  const F = ctx.FIGHT, S = F.S, T = F._t, out = { houses: [], noway: [], walled: [], unreach: 0, floor: 0, storeys: [0, 0, 0, 0], badLevel: 0 };
  for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) {
    const n = F.storeysAt(x, y); if (!n) continue;
    out.houses.push([x, y]); out.storeys[Math.min(3, n)]++;
    if (!T.passable(x, y)) out.walled.push([x, y]);
    if (F.level(x, y) !== n) out.badLevel++;
    if (!D4.some(d => { const a = x + d[0], b = y + d[1]; return a >= 0 && b >= 0 && a < S.w && b < S.h && T.passable(a, b) && !F.storeysAt(a, b); })) out.noway.push([x, y]);
  }
  /* reach: from every tile of his start column, over every tile a man can stand on (4 ways and the diagonals the fight allows) */
  const seen = new Uint8Array(S.w * S.h), q = [], c0 = S.cols[0];
  for (let y = 0; y < S.h; y++) if (T.passable(c0, y)) { seen[y * S.w + c0] = 1; q.push([c0, y]); }
  while (q.length) { const [x, y] = q.shift();
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { if (!dx && !dy) continue; const a = x + dx, b = y + dy;
      if (a < 0 || b < 0 || a >= S.w || b >= S.h || seen[b * S.w + a] || !T.passable(a, b) || T.squeezes(x, y, a, b)) continue; seen[b * S.w + a] = 1; q.push([a, b]); } }
  for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) if (T.passable(x, y)) { out.floor++; if (!seen[y * S.w + x]) out.unreach++; }
  return out;
}
/* the planted fail of (e) and 428(c): AUTO's whole street cost off (the hurt and the walk) */
const OFF = v => Object.assign({}, v, { street: 0, house: 0, walk_street: 0, walk_good: 0, strike: 0 });
function deal(ctx, d, c, seed, extra) {
  ctx.setSeed(seed); ctx.FIGHT.setup(Object.assign({ kind: 'suburb', district: d, cell: { gx: c[0], gy: c[1] }, night: false, auto: true, formation: null }, extra || {}));
  return ctx.FIGHT.S;
}

(async () => {
  const t0 = Date.now(), ctx = eng(), F = ctx.FIGHT, R = { spots: [] };
  /* ---- A1, B1, B2, C1, D1 over 64 spots ---- */
  let tableMix = 0, a1 = 0, a1n = 0, b1 = [], b2 = [], c1 = [], lvl = 0, st = [0, 0, 0, 0], boards = 0, houses = 0, firstHouse = null;
  for (const d of DISTRICTS) for (const c of CELLS) {
    const seed = (c[0] * 7919 + c[1] * 104729 + d.length) >>> 0;
    const S = deal(ctx, d, c, seed), B = S.boardDef, L = B.laid;
    if (!L || !L.template) continue;
    boards++;
    const f = facts(ctx); houses += f.houses.length; f.storeys.forEach((v, i) => { st[i] += v; }); lvl += f.badLevel;
    if (f.noway.length) b1.push(d + '@' + c + ' ' + JSON.stringify(f.noway.slice(0, 3)));
    if (f.unreach) b2.push(d + '@' + c + ' ' + f.unreach + '/' + f.floor);
    if (f.walled.length) c1.push(d + '@' + c + ' ' + JSON.stringify(f.walled.slice(0, 3)));
    if (!firstHouse && f.houses.length) firstHouse = { d, c, seed, at: f.houses[0] };
    /* A1: the same deal with no houses swapped */
    const blocks = JSON.stringify(B.blocks), terr = S.terrain.map(r => r.slice()), hs = f.houses.map(h => h.join(','));
    const T = deal(ctx, d, c, seed, { houses: false });
    const sameBlocks = JSON.stringify(T.boardDef.blocks) === blocks;
    /* a tile the road join painted (rule 429(h), EVERY BUILDING ON THE ROAD R4 gates it) is the join's, not the layout's */
    const painted = (x, y) => !!(L.road && L.road[y * T.w + x] === 3);
    let sameT = true; for (let y = 0; y < T.h; y++) for (let x = 0; x < T.w; x++) if (hs.indexOf(x + ',' + y) < 0 && !painted(x, y) && terr[y][x] !== T.terrain[y][x]) sameT = false;
    const onHouse = hs.every(k => { const [x, y] = k.split(',').map(Number), t = T.terrain[y][x]; return t === 'blocked' || /^height/.test(t); });
    a1n++; if (sameBlocks && sameT && onHouse) a1++;
    if (ctx.FIGHT.S.storeyMix === 'table') tableMix++;
    R.spots.push({ d, c, houses: f.houses.length, storeys: f.storeys, noway: f.noway.length, unreach: f.unreach, walled: f.walled.length });
  }
  check(boards === DISTRICTS.length * CELLS.length, 'BOARDS', boards + ' of ' + DISTRICTS.length * CELLS.length + ' spots dealt a template board with the new houses (' + houses + ' house tiles)');
  check(a1 === a1n && a1n > 0, 'A1', '(a) the template\'s layout, the new houses on its own house tiles: ' + a1 + '/' + a1n);
  check(!b1.length, 'B1', '(b) every house touches a way: ' + (b1.length ? b1.slice(0, 4).join('; ') : 'all ' + houses));
  check(!b2.length, 'B2', '(b) every floor tile joins his line: ' + (b2.length ? b2.slice(0, 4).join('; ') : 'every board'));
  check(!c1.length && !lvl, 'C1', '(c) every house tile a man can be on, at its storeys\' level: ' + (c1.length ? c1.slice(0, 4).join('; ') : 'all ' + houses) + (lvl ? ', ' + lvl + ' at another level' : ''));
  /* rule 428(b) amending 423(d): most houses one or two storeys, three rare but real */
  const storeyOk = (s, n) => n > 0 && s[0] === 0 && s[1] / n >= 0.25 && s[2] / n >= 0.25 && s[3] > 0 && s[3] / n <= 0.2;
  check(storeyOk(st, houses) && tableMix > 0, 'D1', '(d) ' + tableMix + ' of the boards at WORLD THIRTEEN\'s table\'s own district mix (rule 429(b)); storeys one ' + st[1] + ', two ' + st[2] + ', three ' + st[3] + ' (' + [1, 2, 3].map(k => Math.round(st[k] * 100 / Math.max(1, houses)) + '%').join(' / ') + '): most one or two, three rare');
  /* the planted fails for B1, B2, C1, D1 on one board */
  if (firstHouse) {
    const S = deal(ctx, firstHouse.d, firstHouse.c, firstHouse.seed), T = F._t;
    /* B1 planted: a 3 x 3 lump of houses (the middle one has no way) */
    const [hx, hy] = [Math.min(S.w - 3, Math.max(1, firstHouse.at[0])), Math.min(S.h - 3, Math.max(1, firstHouse.at[1]))];
    const keepT = S.terrain.map(r => r.slice()), keepH = S.house.map(r => r.slice());
    for (let y = hy - 1; y <= hy + 1; y++) for (let x = hx - 1; x <= hx + 1; x++) { S.terrain[y][x] = 'height2'; S.house[y][x] = 2; }
    check(facts(ctx).noway.length > 0, 'B1p', 'planted: a 3 x 3 lump of houses is caught');
    S.terrain = keepT.map(r => r.slice()); S.house = keepH.map(r => r.slice());
    /* B2 planted: a floor tile walled in on its eight sides */
    let wx = -1, wy = -1; for (let y = 1; y < S.h - 1 && wx < 0; y++) for (let x = S.cols[1]; x < S.w - 1; x++) if (T.passable(x, y) && !F.storeysAt(x, y)) { wx = x; wy = y; break; }
    const saved = S.terrain.map(r => r.slice());
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (dx || dy) { S.terrain[wy + dy][wx + dx] = 'blocked'; if (S.house[wy + dy]) S.house[wy + dy][wx + dx] = 0; }
    S.terrain[wy][wx] = 'flat';
    check(facts(ctx).unreach > 0, 'B2p', 'planted: a floor tile walled in is caught');
    S.terrain = saved; S.house = keepH.map(r => r.slice());
    /* C1 planted: one house tile a wall */
    const [cx, cy] = firstHouse.at; const was = S.terrain[cy][cx]; S.terrain[cy][cx] = 'blocked';
    check(facts(ctx).walled.length > 0, 'C1p', 'planted: a house tile walled is caught');
    S.terrain[cy][cx] = was;
    /* D1 planted: every house one storey, then every house three */
    const as = n => { const k = S.house; S.house = k.map(r => r.map(v => v ? n : 0)); const r = facts(ctx); S.house = k; return r; };
    const f1 = as(1), f3 = as(3);
    check(!storeyOk(f1.storeys, f1.houses.length) && !storeyOk(f3.storeys, f3.houses.length), 'D1p', 'planted: every house one storey, and every house three, are caught');
    /* ---- D2: the reach ---- */
    const per = ctx.FIGHT.R ? 1 : 1;
    const levels = {}; for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) { const n = F.storeysAt(x, y); if (n && !levels[n]) levels[n] = [x, y]; }
    let flat = null; for (let y = 0; y < S.h && !flat; y++) for (let x = 0; x < S.w; x++) if (T.passable(x, y) && !F.level(x, y)) { flat = [x, y]; break; }
    const ru = n => levels[n] ? F.rangeUp({ x: levels[n][0], y: levels[n][1] }, { x: flat[0], y: flat[1] }) : null;
    const want = { 1: 0, 2: 1, 3: 2 }, got = { 1: ru(1), 2: ru(2), 3: ru(3) };
    check([1, 2, 3].every(n => got[n] === null || got[n] === want[n] * per) && got[1] !== null, 'D2', '(d) the reach a storey up: one ' + got[1] + ', two ' + got[2] + ', three ' + got[3] + ' (one storey covers, never reaches)');
    const keepRF = ctx.DB.ours.storeys.value.range_from; ctx.DB.ours.storeys.value.range_from = 1;
    check(ru(1) !== 0, 'D2p', 'planted: range_from 1 (a one-storey house reaching) is caught (one ' + ru(1) + ')');
    ctx.DB.ours.storeys.value.range_from = keepRF;
    /* D3: entering a house is no climb */
    const h1 = levels[2] || levels[3] || levels[1], nb = D4.map(d => [h1[0] + d[0], h1[1] + d[1]]).filter(q => T.passable(q[0], q[1]) && !F.storeysAt(q[0], q[1]))[0];
    check(!!nb && !F.climbsUp(nb[0], nb[1], h1[0], h1[1]), 'D3', '(d) no ladders: walking into a house from ' + nb + ' is no climb (the climb-or-attack lock is the ladder\'s, gone)');
    /* ---- E1 ---- */
    let os = null; for (let y = 0; y < S.h && !os; y++) for (let x = 0; x < S.w; x++) if (F.openStreet(x, y)) { os = [x, y]; break; }
    check(!!os && F.streetCost(os[0], os[1]) > 0 && F.streetCost(h1[0], h1[1]) < 0, 'E1', '(e) AUTO\'s cost of a tile: open street ' + (os ? F.streetCost(os[0], os[1]) : '?') + ', a house ' + F.streetCost(h1[0], h1[1]));
    const keepOS = ctx.DB.ours.open_street.value; ctx.DB.ours.open_street.value = OFF(keepOS);
    check(!(os && F.streetCost(os[0], os[1]) > 0), 'E1p', 'planted: the cost off is caught');
    ctx.DB.ours.open_street.value = keepOS;
  }
  /* ---- E2: AUTO, both sides, the turns a man moved: where they end ---- */
  const SP = [['suburb', 58, 24], ['town', 12, 88], ['arterial', 40, 40], ['estate', 30, 30], ['jobsoffice', 20, 70], ['town', 70, 20]];
  const auto = function (off) {
    const keep = ctx.DB.ours.open_street.value; if (off) ctx.DB.ours.open_street.value = OFF(keep);
    let ends = 0, onSt = 0, onH = 0, open = 0, walk = 0;
    SP.forEach((s, i) => {
      const S = deal(ctx, s[0], [s[1], s[2]], 100 + i); let prev = null, from = null, g = 0;
      for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) if (F._t.passable(x, y)) { walk++; if (F.openStreet(x, y)) open++; }
      while (!S.over && S.round <= 4 && g < 40000) { const u = F.current(); if (!u) break;
        if (prev && prev !== u && from && (from.x !== prev.x || from.y !== prev.y)) { ends++; if (F.openStreet(prev.x, prev.y)) onSt++; if (F.storeysAt(prev.x, prev.y)) onH++; }
        if (prev !== u) from = { x: u.x, y: u.y }; prev = u; F.aiStep(u); g++; }
    });
    ctx.DB.ours.open_street.value = keep;
    return { ends, street: onSt / Math.max(1, ends), house: onH / Math.max(1, ends), board: open / Math.max(1, walk) };
  };
  const on = auto(false), off = auto(true);
  const ok2 = r => r.ends > 50 && r.street < r.board * 0.5;
  check(ok2(on), 'E2', '(e) AUTO, both sides: of ' + on.ends + ' moves, ' + Math.round(on.street * 1000) / 10 + '% end on the open street (it is ' + Math.round(on.board * 1000) / 10 + '% of the walkable board), ' + Math.round(on.house * 1000) / 10 + '% in a house');
  check(!ok2(off), 'E2p', 'planted: with the cost off ' + Math.round(off.street * 1000) / 10 + '% end on the open street, caught');
  R.E2 = { on, off };
  /* ---- A2 (rule 428(a), every place board comes back): each of the fifteen 11/3 place boards (ours.place_boards) is the board a
     fight from the map deals at its own districts, 20 seeds each (cells and dice); planted: one place's board unbuilt ---- */
  const PB = ctx.DB.ours.place_boards.value.places;
  const placeRun = function () {
    const r = { places: 0, ok: 0, fights: 0, own: 0, miss: [] };
    Object.keys(PB).forEach(id => { const p = PB[id]; let own = 0; r.places++;
      for (let i = 0; i < 20; i++) { const d = p.districts[i % p.districts.length], c = [(i * 37 + 11) % 90, (i * 53 + 7) % 90];
        const B = deal(ctx, d, c, 900 + i).boardDef; r.fights++; if (B && B.own === id) { own++; r.own++; } }
      if (own === 20) r.ok++; else r.miss.push(id + ' ' + own + '/20'); });
    return r;
  };
  const pr = placeRun(), okP = r => r.places === 15 && r.ok === 15;
  check(okP(pr), 'A2', '428(a) every place board comes back: ' + pr.ok + ' of ' + pr.places + ' place boards dealt at their own places on every one of 20 seeds (' + pr.own + ' of ' + pr.fights + ' fights)' + (pr.miss.length ? ': ' + pr.miss.join('; ') : ''));
  PB.marina.built = false; const prp = placeRun(); PB.marina.built = true;
  check(!okP(prp), 'A2p', 'planted: the marina\'s board unbuilt is caught (' + prp.miss.join('; ') + ')');
  R.A2 = pr;
  /* ---- E3 (rule 428(c), the scramble): every man of both sides put on the open street nearest his own start, AUTO plays both
     sides' first round; then more than 60% of EACH side stand on a house, a roof or cover (24 seeds, 12 districts x 2 cells) ---- */
  const SC = [];
  DISTRICTS.concat(['suburb']).forEach((d, i) => { SC.push([d, CELLS[i % 4], 300 + i]); SC.push([d, CELLS[(i + 2) % 4], 400 + i]); });
  const scramble = function (off) {
    const keep = ctx.DB.ours.open_street.value; if (off) ctx.DB.ours.open_street.value = OFF(keep);
    const n = { you: 0, them: 0 }, good = { you: 0, them: 0 }; let boards = 0, put = 0, need = 0;
    SC.forEach(s => {
      const S = deal(ctx, s[0], s[1], s[2]), T = F._t; const street = [];
      for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) if (F.openStreet(x, y) && T.passable(x, y)) street.push([x, y]);
      const men = S.units.filter(u => !u.dead && !u.down && !u.fled && (u.side === 'you' || u.side === 'them'));
      if (street.length < men.length) return;
      const taken = {}; men.forEach(u => { need++; const q = street.filter(t => !taken[t]).sort((a, b) => (Math.abs(a[0] - u.x) + Math.abs(a[1] - u.y)) - (Math.abs(b[0] - u.x) + Math.abs(b[1] - u.y)))[0];
        if (!q) return; taken[q] = 1; u.x = q[0]; u.y = q[1]; put++; });
      boards++;
      let g = 0; while (!S.over && S.round <= 1 && g < 40000) { const u = F.current(); if (!u) break; F.aiStep(u); g++; }
      S.units.forEach(u => { if (u.dead || u.down || u.fled || !n.hasOwnProperty(u.side)) return; n[u.side]++; if (F.goodGround(u.x, u.y)) good[u.side]++; });
    });
    ctx.DB.ours.open_street.value = keep;
    return { boards, put, need, you: good.you / Math.max(1, n.you), them: good.them / Math.max(1, n.them), n };
  };
  const pc = v => Math.round(v * 1000) / 10 + '%';
  const s3 = scramble(false), s3off = scramble(true), ok3 = r => r.boards >= 20 && r.put === r.need && r.you > 0.6 && r.them > 0.6;
  check(ok3(s3), 'E3', '428(c) the scramble: ' + s3.boards + ' boards, every man started on the open street (' + s3.put + '); after their first moves on AUTO on a house, a roof or cover: his ' + pc(s3.you) + ', theirs ' + pc(s3.them));
  check(!ok3(s3off), 'E3p', 'planted: with the street cost off his ' + pc(s3off.you) + ', theirs ' + pc(s3off.them) + ', caught');
  R.E3 = { on: s3, off: s3off };
  /* ---- E4 (rule 428(d), THE ENEMY KNOWS WHEN IT IS OUTMATCHED): the same 24 boards, every man on the open street; theirs made
     weak (a third of their hit points and armour: the odds read under ours.outmatched.ratio) they end their first two rounds on
     houses, roofs or cover, some of them farther from us than they started, and close on us far less than with the odds read off;
     theirs made strong (three times) they still come on. Planted: the odds read off ---- */
  const near = (S, u) => S.units.filter(v => v.side !== u.side && (v.side === 'you' || v.side === 'them') && !v.dead && !v.down && !v.fled).reduce((m, v) => Math.min(m, Math.max(Math.abs(v.x - u.x), Math.abs(v.y - u.y))), 99);
  const digRun = function (k, on) {
    const O = ctx.DB.ours.outmatched.value, keep = O.on; O.on = on;
    let n = 0, good = 0, back = 0, dsum = 0, boards = 0, odds = 0;
    SC.forEach(s => {
      const S = deal(ctx, s[0], s[1], s[2]), T = F._t, street = [];
      for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) if (F.openStreet(x, y) && T.passable(x, y)) street.push([x, y]);
      const men = S.units.filter(u => !u.dead && !u.down && !u.fled && (u.side === 'you' || u.side === 'them'));
      if (street.length < men.length) return; boards++;
      const taken = {}; men.forEach(u => { const q = street.filter(t => !taken[t]).sort((a, c) => (Math.abs(a[0] - u.x) + Math.abs(a[1] - u.y)) - (Math.abs(c[0] - u.x) + Math.abs(c[1] - u.y)))[0]; taken[q] = 1; u.x = q[0]; u.y = q[1]; });
      S.units.filter(u => u.side === 'them').forEach(u => { u.hp = Math.max(1, Math.round(u.hp * k)); u.hpMax = Math.max(u.hp, Math.round(u.hpMax * k)); u.armB = Math.round(u.armB * k); u.armH = Math.round(u.armH * k); });
      odds += F.oddsOf('them');
      /* their own ground: the distance from where his men STARTED (rule 435 brings his men on every turn, so a distance to his men
         as they stand now would read his advance as theirs) */
      const ours0 = S.units.filter(v => v.side === 'you' && !v.dead).map(v => ({ x: v.x, y: v.y }));
      const from0 = u => ours0.reduce((m, v) => Math.min(m, Math.max(Math.abs(v.x - u.x), Math.abs(v.y - u.y))), 99);
      const d0 = {}; S.units.forEach(u => { if (u.side === 'them') d0[u.id] = from0(u); });
      let g = 0; while (!S.over && S.round <= 2 && g < 40000) { const u = F.current(); if (!u) break; F.aiStep(u); g++; }
      S.units.forEach(u => { if (u.side !== 'them' || u.dead || u.down || u.fled) return; n++; if (F.goodGround(u.x, u.y)) good++; const d1 = from0(u); if (d1 > d0[u.id]) back++; dsum += d1 - d0[u.id]; });
    });
    O.on = keep;
    return { boards, good: good / Math.max(1, n), back: back / Math.max(1, n), d: dsum / Math.max(1, n), odds: odds / Math.max(1, boards) };
  };
  const wk = digRun(0.35, true), wkOff = digRun(0.35, false), st4 = digRun(3, true);
  const okDig = (w, s) => w.boards >= 20 && w.odds < ctx.DB.ours.outmatched.value.ratio && w.good > 0.85 && w.back > 0.05 && w.d > -2.5 && s.odds > 1 && s.d < -2;
  const f2 = v => Math.round(v * 100) / 100;
  check(okDig(wk, st4), 'E4', '428(d) outmatched (odds ' + f2(wk.odds) + '), from the street, after two rounds: theirs on a house, roof or cover ' + pc(wk.good) + ', farther from us than they began ' + pc(wk.back) + ', the gap closed by ' + f2(-wk.d) + ' tiles; stronger (odds ' + f2(st4.odds) + ') they come on, the gap closed by ' + f2(-st4.d));
  check(!okDig(wkOff, st4), 'E4p', 'planted: the odds read off, outmatched they close by ' + f2(-wkOff.d) + ' tiles, ' + pc(wkOff.back) + ' farther, caught');
  R.E4 = { weak: wk, weakOff: wkOff, strong: st4 };
  /* ---- D3 on the page: no ladder is drawn ---- */
  if (!NOPAGE && firstHouse) {
    const { chromium } = require('playwright');
    const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg' };
    const srv = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
      if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
      r.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); }).listen(0);
    const br = await chromium.launch(), p = await (await br.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage();
    const errs = []; p.on('pageerror', e => errs.push(String(e && e.message || e)));
    await p.addInitScript(o => { window.FIGHT_OPTS = o; try { localStorage.clear(); } catch (e) {} },
      { seed: firstHouse.seed, kind: 'suburb', district: firstHouse.d, cell: { gx: firstHouse.c[0], gy: firstHouse.c[1] }, night: false, auto: false, deploy: false, speed: 1 });
    await p.goto('http://localhost:' + srv.address().port + '/slices/BOHEMIA_FIGHT.html');
    await p.waitForFunction(() => { try { const l = document.getElementById('load'); return l && l.style.display === 'none' && !!eval('UI').board && !!eval('FIGHT').S.boardDef.laid; } catch (e) { return false; } }, null, { timeout: 120000 }).catch(() => {});
    await p.waitForTimeout(1500);
    const pg = await p.evaluate(() => { const U = eval('UI'), B = eval('FIGHT').S.boardDef; return { ladders: (U.ladders || []).length, houses: B.laid ? B.laid.sprites.filter(q => q.kind === 'house').length : 0, template: !!(B.laid && B.laid.template),
      storeyPics: B.laid ? B.laid.sprites.filter(q => q.kind === 'house' && q.drawn > 1).length : 0 }; });
    check(pg.template && pg.houses > 0 && pg.ladders === 0 && !errs.length, 'D3', '(d) on the page: ' + pg.houses + ' new houses drawn (' + pg.storeyPics + ' of two or three storeys), ladders drawn ' + pg.ladders + ', page errors ' + errs.length);
    const lp = await p.evaluate(() => { drawLadders(); return (eval('UI').ladders || []).length; });
    check(lp > 0, 'D3p', 'planted: the old ladders drawn again are caught (' + lp + ')');
    await br.close(); srv.close();
  }
  console.log('\nTHE OLD LAYOUT, THE NEW HOUSES: ' + pass + ' passed, ' + fail + ' failed (' + Math.round((Date.now() - t0) / 1000) + ' s)');
  if (OUT) fs.writeFileSync(OUT, JSON.stringify(Object.assign(R, { pass, fail, lines }), null, 1));
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
