#!/usr/bin/env node
/* THE BIG INSIDES, LAID FROM DATA (COMBAT THREE 11/17/26; VAMILY rules 416, 453, 59, 428, 451(a); ask row 468's list from the fourth on:
   THE CONVENTION HALL first). PAOLO 11/6: 'what are some large ass interiors that we could fight... I still want this to be a block
   and turf war'. The coordinator's round: 'the next big interior from the researched list as a fight place, house-sized tiles, each
   tile its cost and effect, its ceiling at 10%... AUTO played to the end on each new board, both sides using roofs and cover the way
   rule 428 says'.
   Every inside listed in slices/fight_ground/insides.json (its folder's <id>.json, laid by slices/bohemia_big_inside.js) is held to
   the same legs, the live fight's own rules, headless:
     I1  A FIGHT THERE MAY GO INSIDE: at its districts its share of the fights by the cell's own dice (the same cell the same answer),
         never where it has no district, asked in and asked out by name, never on a cell a place's own board stands on
     I2  THE FLOOR IS JOINED: every open tile reached, both lines on open floor, every man with a walk to the other side; every
         layout dealt, and mirrored
     I3  THE STAIRS ARE THE WALK UP, THE RAIL IS A CLIMB: every tile of its high ground walked to by a ramp and none with the ramps
         shut; the high ground the fight's roof at level 1, a ramp never a roof (an inside with no high ground passes on none)
     I4  THE DARK: inside it is night on every board; by day its doors and drums light their tiles, at night only the drums
     I5  THE PIECES ARE REAL: every piece laid has its picture on disk and its size; no piece of the kit never dealt; the floor's
         pictures on disk; how many are stand-ins (drawn as another kit's finished piece until its own art is in) is said
     I6  A FIGHT PLAYS: every fight on AUTO ends inside 30 rounds and no able man of his stands a whole fight
     I7  EVERY TILE HAS ITS COST AND ITS EFFECT: every kind in the layouts has its row; the fight charges the table's AP; a cover
         kind gives cover and a blocking kind lets nobody stand; a tile with a line says it; open floor is the fight's open street
     I8  BOTH SIDES USE ROOFS AND COVER (rule 428(c)(d)): after the first round fewer men stand on the bare open floor than with the
         rule off, more on cover; if it has high ground, part of the band starts up on it and men are on it after the first round
     I9  ITS CEILING: the board carries its data's ceiling, about 10% and never past the fight's most
     planted: a wall across the floor (I2), one high tile read as floor (I3), a tile kind with no row and a wrong AP (I7), the open
     floor not open (I8)
   Run: node gates/the_big_insides_gate.js      (about two minutes an inside) */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..'), HL = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
let pass = 0, fail = 0;
const check = (ok, name, msg) => { if (ok) pass++; else fail++; console.log((ok ? 'PASS ' : 'FAIL ') + name + '  ' + msg); return ok; };
const J = f => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8')); } catch (e) { return null; } };
const ctx = HL.engine({ extra: { window: null } }); ctx.window = ctx;
for (const f of ['slices/bohemia_street_board.js', 'engine/bohemia_fight_kinds.js', 'slices/bohemia_casino_floor.js', 'slices/bohemia_flood_tunnels.js', 'slices/bohemia_parking_garage.js', 'slices/bohemia_big_inside.js']) { try { vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx); } catch (e) {} }
const FG = 'slices/fight_ground/', SK = FG + 'street_board/';
ctx.DB.streetKit = J(SK + 'street_board.json'); ctx.DB.streetDress = J(SK + 'dressing.json'); ctx.DB.streetStoreys = J(SK + 'storeys.json');
const kitOf = (data, sizes, pre) => { const kit = {}; Object.keys(data.kit).forEach(k => { const z = sizes[k.replace(pre, '')]; kit[k] = Object.assign({}, data.kit[k], z ? { src: z.src } : {}); }); return kit; };
{ const gd = J(FG + 'garage/garage.json'), ga = J(FG + 'garage/garage_art.json'), kit = {};
  Object.keys(ga.kit).forEach(k => { kit[k] = Object.assign({}, ga.kit[k], (gd.rules || {})[k] || {}); }); Object.keys(gd.kit).forEach(k => { const q = (gd.sizes || {})[gd.kit[k].like || k.replace(/^garage_/, '')]; kit[k] = Object.assign({}, q ? { src: q.src } : {}, gd.kit[k]); });
  ctx.DB.garage = { data: gd, art: ga, sizes: gd.sizes || {}, kit };
  const cd = J(FG + 'casino/casino_floor.json'), cz = J(FG + 'casino/sizes.json') || {}; ctx.DB.casino = { data: cd, sizes: cz, kit: kitOf(cd, cz, /^casino_/) };
  const td = J(FG + 'tunnels/tunnels.json'), tz = J(FG + 'tunnels/sizes.json') || {}; ctx.DB.tunnels = { data: td, sizes: tz, kit: kitOf(td, tz, /^tunnel_/) }; }
const F = ctx.FIGHT, BI = ctx.BohemiaBigInside, IDS = ((J(FG + 'insides.json') || {}).insides || []), ONLY = process.argv[2] || null;
ctx.DB.insides = {};
IDS.forEach(id => { const d = J(FG + id + '/' + id + '.json'), art = J(FG + id + '/' + id + '_art.json'); if (d) ctx.DB.insides[id] = { data: d, art: art, kit: BI.kit(d, art, { garage: ctx.DB.garage, tunnels: ctx.DB.tunnels, casino: ctx.DB.casino, dress: ctx.DB.streetDress.kit }) }; });
const cellOf = i => ({ gx: (i * 31 + 7) % 90, gy: (i * 17 + 3) % 90 });
const litCount = S => { let n = 0; for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) if (S.lit[y][x]) n++; return n; };
const walks = (S, u) => { const T = F._t, seen = new Set([u.x + ',' + u.y]), q = [[u.x, u.y]];
  const foe = new Set(S.units.filter(t => t.side !== u.side && F.onField(t)).map(t => t.x + ',' + t.y));
  while (q.length) { const [x, y] = q.shift(); for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const a = x + dx, b = y + dy, k = a + ',' + b;
    if ((!dx && !dy) || seen.has(k) || a < 0 || b < 0 || a >= S.w || b >= S.h) continue; if (foe.has(k)) return true;
    if (!T.passable(a, b) || T.squeezes(x, y, a, b)) continue; seen.add(k); q.push([a, b]); } }
  return false; };
(async () => {
  const t0 = Date.now();
  check(IDS.length >= 1 && IDS.every(id => ctx.DB.insides[id]), 'I0', 'THE LIST: ' + IDS.length + ' inside' + (IDS.length === 1 ? '' : 's') + ' laid from data (' + IDS.join(', ') + '), each with its data file');
  for (const id of IDS.filter(i => !ONLY || i === ONLY)) {
    const D = ctx.DB.insides[id], data = D.data, DIST = data.districts, TK = data.tiles, LEG = data.board.legend, LAYS = data.board.templates[Object.keys(data.board.templates)[0]].layouts, N = id.toUpperCase();
    const deal = (d, i, extra) => { ctx.setSeed(1700 + i); F.setup(Object.assign({ district: d, cell: cellOf(i), night: false, auto: true, formation: null, deploy: false }, extra || {})); return F.S; };
    const hasHigh = Object.keys(LEG).some(c => LEG[c].is === 'high');
    /* I1 */
    { let in1 = 0, n1 = 0, none = 0, yes = 0, no = 0, same = 0, onPlace = 0; const per = {};
      DIST.forEach(d => { per[d] = 0; for (let i = 0; i < 40; i++) { const S = deal(d, i, { inside: undefined }); n1++; if (S.boardDef.interior === id) { in1++; per[d]++; } } });
      { const a = deal(DIST[0], 5).boardDef.interior, b = deal(DIST[0], 5).boardDef.interior; if (a === b) same++; }
      ['suburb', 'wash', 'downtown', 'industrial', 'desert', 'airport', 'casino'].filter(d => DIST.indexOf(d) < 0).forEach((d, i) => { if (deal(d, i).boardDef.interior === id) none++; });
      for (let i = 0; i < 4; i++) { if (deal('suburb', i, { inside: id }).boardDef.interior === id) yes++; if (deal(DIST[0], i, { inside: false }).boardDef.interior !== id) no++;
        if (deal(DIST[0], i, { template: { id: 'strip', board: 'place_strip', tx: 6, ty: 6, flip: false, cell: [30, 30] } }).boardDef.interior === id) onPlace++; }
      const share = in1 / n1;
      check(in1 > 0 && share <= (data.share == null ? 1 : data.share) + 0.12 && none === 0 && yes === 4 && no === 4 && same === 1 && onPlace === 0, 'I1 ' + N,
        'A FIGHT THERE MAY GO INSIDE: ' + in1 + ' of ' + n1 + ' fights at its districts (' + DIST.map(d => d + ' ' + per[d] + ' of 40').join(', ') + '; the data\'s share ' + data.share + ' of what the garage leaves); the same cell the same answer: ' + (same ? 'yes' : 'NO') + '; at districts it has none of ' + none + '; asked in ' + yes + '/4, asked out ' + no + '/4; on a place\'s own cell ' + onPlace); }
    /* I2 to I6 over 24 boards */
    let joined = 0, lines = 0, walkAll = 0, n = 0, onlyRamps = 0, levelOk = 0, dayLit = 0, nightLess = 0, ended = 0, rounds = 0, idle = 0, men = 0, standIn = 0, laid = 0;
    const bad2 = [], bad3 = [], bad4 = [], bad5 = [], bad6 = [], PIECES = {}, LAY = {};
    for (let i = 0; i < 24; i++) {
      const S = deal(DIST[i % DIST.length], i, { inside: id }), B = S.boardDef; if (B.interior !== id) { bad2.push('s' + i + ' not inside: ' + B.name); continue; } n++;
      const c = BI.check(B), L = B.laid, key = B.inside.layout + (B.inside.flip[1] ? ' mirrored' : ''); LAY[key] = (LAY[key] || 0) + 1;
      if (c.reached === c.open && c.open > 120) joined++; else bad2.push('s' + i + ' ' + c.reached + '/' + c.open);
      if (S.units.every(u => !S.solid[u.y][u.x] && S.terrain[u.y][u.x] !== 'blocked')) lines++;
      if (S.units.every(u => walks(S, u))) walkAll++; else bad2.push('s' + i + ' a man with no walk to the other side');
      if (!hasHigh || (c.high > 10 && c.highReached === c.high && c.highWalked === c.high && c.highWithoutRamps === 0 && c.ramps >= 1)) onlyRamps++; else bad3.push('s' + i + ' high ' + c.highReached + '/' + c.high + ', walked ' + c.highWalked + ', without the ramps ' + c.highWithoutRamps);
      { let ok = true; for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) if (S.terrain[y][x] === 'height' && (F.level(x, y) !== 1 || F.isRoof(x, y) !== (L.tiles[y][x] !== 'ramp'))) ok = false; if (ok) levelOk++; else bad3.push('s' + i + ' a high tile not a level 1 roof, or a ramp that is a roof'); }
      const ld = litCount(S);
      if (S.night && ld > 10) dayLit++; else bad4.push('s' + i + ' day lit ' + ld);
      { const Nn = deal(DIST[i % DIST.length], i, { inside: id, night: true }), ln = litCount(Nn), fires = (Nn.boardDef.lights || []).filter(l => l.circuit === 'fire' && l.live).length, days = (Nn.boardDef.lights || []).filter(l => l.circuit === 'day' && l.live).length;
        if (ln > 0 && ln < ld && fires > 0 && days === 0) nightLess++; else bad4.push('s' + i + ' night lit ' + ln + ' (day ' + ld + ', fires ' + fires + ', doors live ' + days + ')'); }
      const S2 = deal(DIST[i % DIST.length], i, { inside: id }), B2 = S2.boardDef, T2 = B2.laid.tiles;
      (B2.cover || []).forEach(cv => { PIECES[cv.piece] = (PIECES[cv.piece] || 0) + 1; }); standIn += B2.inside.stand_in; laid += B2.inside.pieces;
      if (B2.inside.missing.length) bad5.push('s' + i + ' no picture for ' + B2.inside.missing.join(', '));
      for (let y = 0; y < S2.h; y++) for (let x = 0; x < S2.w; x++) { const k = T2[y][x], t = TK[k] || {};
        if (t.cover && !(S2.coverCount[y][x] > 0)) bad5.push(k + ' at ' + x + ',' + y + ' gives no cover');
        if (t.blocks && !S2.solid[y][x]) bad5.push(k + ' at ' + x + ',' + y + ' lets a man stand'); }
      const mine = S2.units.filter(u => u.side === 'you'), acted = {}, able = {}; mine.forEach(u => { able[u.id] = 0; });
      let cur = null, snap = null, g = 0;
      const close = () => { if (!cur || !snap) return; const u = cur; if (u.x !== snap.x || u.y !== snap.y || S2.log.slice(snap.n).some(e => e.id === u.id && /^(attack|step|skill|reload|swap|wall|rally|shot|sweep|hook|net|throw|move)$/.test(e.t))) acted[u.id] = true; };
      while (!S2.over && S2.round <= 30 && g < 80000) { const u = F.current(); if (!u) break;
        if (u !== cur) { close(); cur = u.side === 'you' ? u : null; snap = cur ? { x: u.x, y: u.y, n: S2.log.length } : null; if (cur && !(u.dead || u.down || u.fled || u.morale === 'Fleeing')) able[u.id]++; }
        F.aiStep(u); g++; }
      close();
      if (S2.over) ended++; else bad6.push('s' + i + ' not over at round ' + S2.round); rounds += S2.round;
      mine.forEach(u => { men++; if (!acted[u.id] && able[u.id] >= 2) { idle++; bad6.push('s' + i + ' ' + u.id + ' stood a whole fight'); } });
    }
    check(joined === n && lines === n && walkAll === n && n >= 20 && Object.keys(LAY).length >= Object.keys(LAYS).length + 1, 'I2 ' + N, 'THE FLOOR IS JOINED: ' + joined + ' of ' + n + ' boards every open tile reached, both lines on open floor on ' + lines + ', every man with a walk to the other side on ' + walkAll + ' (dealt: ' + Object.keys(LAY).map(k => k + ' ' + LAY[k]).join(', ') + ')' + bad2.slice(0, 3).map(s => '; ' + s).join(''));
    { const S = deal(DIST[0], 0, { inside: id }), B = S.boardDef, L = B.laid, keep = L.terrain.map(r => r.slice()); for (let y = 0; y < L.H; y++) L.terrain[y][7] = 'blocked';
      const c = BI.check(B); L.terrain.forEach((r, y) => r.forEach((t, x) => { r[x] = keep[y][x]; }));
      check(c.reached < c.open, 'I2p ' + N, 'planted: a wall across the floor at column 7 is caught (' + c.reached + ' of ' + c.open + ' reached)'); }
    check(onlyRamps === n && levelOk === n, 'I3 ' + N, hasHigh ? 'THE STAIRS ARE THE WALK UP, THE RAIL IS A CLIMB: on ' + onlyRamps + ' of ' + n + ' boards every tile of the high ground is walked to by a ramp and none with the ramps shut; the high ground the fight\'s roof at level 1 and the ramps never a roof on ' + levelOk + bad3.slice(0, 3).map(s => '; ' + s).join('') : 'no high ground in this inside (none owed)');
    if (hasHigh) { const S = deal(DIST[0], 0, { inside: id }), B = S.boardDef, L = B.laid; let at = null; for (let y = L.H - 1; y >= 0 && !at; y--) for (let x = 0; x < L.W && !at; x++) if (L.roofs[y][x]) at = [x, y];
      L.roofs[at[1]][at[0]] = false; const c = BI.check(B); L.roofs[at[1]][at[0]] = true;
      check(c.highWithoutRamps > 0, 'I3p ' + N, 'planted: one tile of the high ground read as plain floor is caught (' + c.highWithoutRamps + ' tiles walked to with the ramps shut)'); }
    check(dayLit === n && nightLess === n, 'I4 ' + N, 'THE DARK: inside it is night on every board; by day its doors and drums light their tiles on ' + dayLit + ' of ' + n + ', at night only the drums (fewer tiles lit, not one door live) on ' + nightLess + bad4.slice(0, 3).map(s => '; ' + s).join(''));
    { const missing = [], kit = D.kit, FL = (D.art && D.art.floor) || data.floor || {};
      Object.keys(PIECES).forEach(p => { const d = kit[p]; if (!d || !d.src || !d.size) { missing.push(p + ' (no picture)'); return; } if (!fs.existsSync(path.join(ROOT, FG, d.src))) missing.push(p + ' ' + d.src); });
      Object.keys(data.kit).forEach(p => { if (!PIECES[p]) missing.push('never dealt: ' + p); });
      Object.keys(FL).forEach(k => (FL[k] || []).forEach(g => { const f = String(g).split('#')[0]; if (!fs.existsSync(path.join(ROOT, FG, f))) missing.push('the floor ' + f); }));
      if (!(FL.floor || []).length) missing.push('the floor list');
      Object.keys(data.lights).forEach(k => { const s = data.lights[k].src; if (s && !fs.existsSync(path.join(ROOT, FG, s))) missing.push('light ' + k + ' ' + s); });
      check(!missing.length && !bad5.length, 'I5 ' + N, 'THE PIECES ARE REAL: ' + Object.keys(PIECES).length + ' kinds of piece (' + Object.keys(PIECES).map(p => p.replace(new RegExp('^' + id + '_'), '') + ' ' + PIECES[p]).join(', ') + '), every one with its picture on disk and its size; ' + standIn + ' of ' + laid + ' pieces laid are STAND-INS (another kit\'s finished piece until this inside\'s own art is in)' + missing.concat(bad5).slice(0, 4).map(s => '; ' + s).join('')); }
    check(ended === n && idle === 0, 'I6 ' + N, 'A FIGHT PLAYS: ' + ended + ' of ' + n + ' fights inside ended on AUTO inside 30 rounds (' + (n ? (rounds / n).toFixed(1) : 0) + ' rounds a fight); ' + idle + ' of ' + men + ' men of his stood a whole fight' + bad6.slice(0, 3).map(s => '; ' + s).join(''));
    /* I7 */
    { const kindsUsed = {}, bad7 = [];
      Object.keys(LAYS).forEach(ln => LAYS[ln].forEach(r => r.split('').forEach(c => { const q = LEG[c]; if (q) kindsUsed[q.tile || q.is] = 1; else bad7.push('no legend for ' + c); })));
      const rowsOk = k => { const t = TK[k]; return !!t && typeof t.effect === 'string' && t.effect.length > 12 && typeof t.row === 'string'; };
      Object.keys(kindsUsed).forEach(k => { if (!rowsOk(k)) bad7.push('no row for ' + k); });
      const price = (S, x, y) => { const T = F._t, u0 = S.units.filter(u => u.side === 'you')[0]; let best = null; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const a = x + dx, b = y + dy;
        if ((dx || dy) && a >= 0 && b >= 0 && a < S.w && b < S.h && S.terrain[b][a] !== 'blocked' && !S.solid[b][a] && F.level(a, b) === F.level(x, y)) { const c = T.stepCost(Object.assign({}, u0, { injuries: [], perks: [] }), a, b, x, y); if (best === null || c < best) best = c; } } return best; };
      let priced = 0, said = 0, sayOwed = 0, openTiles = 0, openMarked = 0; const open0 = Object.keys(TK).filter(k => TK[k].open)[0];
      for (let i = 0; i < 4; i++) { const S = deal(DIST[0], i, { inside: id }), L = S.boardDef.laid;
        for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) { const k = L.tiles[y][x], t = TK[k]; if (!t) { bad7.push('tile ' + k + ' has no row'); continue; }
          if (t.row === 'obstacles') { if (S.terrain[y][x] !== 'blocked') bad7.push(k + ' not blocked'); continue; }
          if (t.blocks) continue;
          const c = price(S, x, y); if (c === null) continue; if (c === t.ap) priced++; else bad7.push(k + ' at ' + x + ',' + y + ' costs ' + c + ', the table says ' + t.ap);
          const want = (S.lit[y][x] && t.say_lit) || t.say; if (want) { sayOwed++; if (F.groundSay(x, y) === want) said++; else bad7.push(k + ' says "' + F.groundSay(x, y) + '"'); }
          if (t.open) { openTiles++; if (S.street[y][x]) openMarked++; } } }
      check(!bad7.length && priced > 300 && said === sayOwed && sayOwed > 100 && openTiles > 100 && openMarked === openTiles, 'I7 ' + N, 'EVERY TILE HAS ITS COST AND ITS EFFECT: ' + Object.keys(kindsUsed).length + ' kinds of tile in the layouts, each with its row (' + Object.keys(kindsUsed).sort().join(', ') + '); on four boards the fight charged the table\'s AP on ' + priced + ' tiles; ' + said + ' of ' + sayOwed + ' tiles with a line said it; ' + openMarked + ' of ' + openTiles + ' open-floor tiles are the fight\'s open street' + bad7.slice(0, 4).map(s => '; ' + s).join(''));
      { const k0 = Object.keys(kindsUsed).filter(k => TK[k].cover)[0], keep = TK[k0]; delete TK[k0]; const miss = Object.keys(kindsUsed).filter(k => !rowsOk(k)); TK[k0] = keep;
        check(miss.length === 1 && miss[0] === k0, 'I7p ' + N, 'planted: the row of ' + k0 + ' taken out of the table is caught (' + miss.join(', ') + ')'); }
      { const S3 = deal(DIST[0], 0, { inside: id }), L3 = S3.boardDef.laid; let wrong = 0; const was = TK[open0].ap; TK[open0].ap = 3;
        for (let y = 0; y < S3.h; y++) for (let x = 0; x < S3.w; x++) if (L3.tiles[y][x] === open0 && price(S3, x, y) !== TK[open0].ap) wrong++; TK[open0].ap = was;
        check(wrong > 20, 'I7q ' + N, 'planted: the open floor priced 3 AP in the table is caught (' + wrong + ' tiles the fight charges 2 on)'); } }
    /* I8 */
    { const run = (off, noStart) => { let on = 0, all = 0, cover = 0, up0 = 0, band = 0, his0 = 0, highLater = 0, hisCover = 0, hisAll = 0, theirCover = 0, theirAll = 0;
        for (let i = 0; i < 12; i++) { const S = deal(DIST[i % DIST.length], i, Object.assign({ inside: id }, noStart ? { insideAsk: { start: null } } : {})), L = S.boardDef.laid, K = S.boardDef.tileKey;
          const bare = u => !!(K[L.tiles[u.y][u.x]] && K[L.tiles[u.y][u.x]].open) && !S.coverCount[u.y][u.x];
          S.units.forEach(u => { if (u.side !== 'you') { band++; if (F.level(u.x, u.y) > 0) up0++; } else if (F.level(u.x, u.y) > 0) his0++; });
          if (off) { for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) S.street[y][x] = false; }
          let g = 0, seen = 0; while (!S.over && S.round <= 2 && g < 6000) { const u = F.current(); if (!u) break;
            if (S.round === 2 && !seen) { seen = 1; S.units.filter(v => F.onField(v)).forEach(v => { all++; const cv = S.coverCount[v.y][v.x] > 0 || F.level(v.x, v.y) > 0; if (bare(v)) on++; if (S.coverCount[v.y][v.x]) cover++; if (F.level(v.x, v.y) > 0) highLater++;
              if (v.side === 'you') { hisAll++; if (cv) hisCover++; } else { theirAll++; if (cv) theirCover++; } }); }
            S.byHand = false; F.aiStep(u); g++; } }
        return { on, all, cover, up0, band, his0, highLater, hisCover, hisAll, theirCover, theirAll }; };
      const A = run(false), Z = run(true), pa = A.on / A.all, pz = Z.on / Z.all;
      check(pa <= pz - 0.05 && pa <= 0.3 && A.cover > Z.cover && A.hisCover > 0 && A.theirCover > 0 && (!hasHigh || (A.up0 / A.band >= 0.25 && A.up0 / A.band <= 0.5 && A.highLater > 0)), 'I8 ' + N,
        'BOTH SIDES USE ROOFS AND COVER: after the first round ' + A.on + ' of ' + A.all + ' men (' + Math.round(pa * 100) + '%) stand on the bare open floor, with the rule off ' + Z.on + ' of ' + Z.all + ' (' + Math.round(pz * 100) + '%); on cover ' + A.cover + ' against ' + Z.cover + '; on cover or high ground ' + A.hisCover + ' of his ' + A.hisAll + ' and ' + A.theirCover + ' of their ' + A.theirAll + (hasHigh ? '; ' + A.up0 + ' of ' + A.band + ' of the band (' + Math.round(A.up0 / A.band * 100) + '%) start up on the high ground, ' + A.highLater + ' men on it after the first round' : ''));
      check(!(pz <= pz - 0.05), 'I8p ' + N, 'planted: the open floor not open (the rule off) reads as no scramble (' + Math.round(pz * 100) + '% against itself)'); }
    /* I9 */
    { const c = deal(DIST[0], 1, { inside: id }).boardDef.ceiling, want = data.ceiling || {};
      check(!!c && c.kind === want.kind && c.alpha >= 0.05 && c.alpha <= 0.14 && c.name === want.src && (want.have ? fs.existsSync(path.join(ROOT, FG, want.src)) : c.src === null), 'I9 ' + N, 'ITS CEILING: ' + (c ? c.kind + ' at ' + c.alpha + ', the picture ' + want.src + (want.have ? ' (in)' : ' (owed by COOK FIVE: the fight draws the kind itself)') : 'NONE')); }
  }
  console.log('\nTHE BIG INSIDES: ' + pass + ' passed, ' + fail + ' failed (' + Math.round((Date.now() - t0) / 1000) + ' s)');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
