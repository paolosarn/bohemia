#!/usr/bin/env node
/* ============================================================================
   THE FREEWAY IS FINISHED (COOK FIVE 11/10/26; VAMILY rule 443(g), ask row 557; rule 441(a): no stand-in art where
   finished art is owed; rule 408(b): one golden piece, then its recipe; rule 430: reuse first)

   The four freeway boards (THE DECK, THE OVERPASS, THE UNDERPASS, THE INTERCHANGE; slices/bohemia_freeway_boards.js) wore
   stand-in pictures from 11/7 to 11/10. They are remade through the master rig by
   tools/bohemia_cook5_the_freeway_finished_11_10_26.py. This gate holds what that ship promised, so a stand-in can never
   come back under a finished name, on every board the dealer can deal:

     F1  THE KIT IS FINISHED: freeway.json says so, no piece is marked stand_in, the tool that made it is in the repo,
         every picture the kit names is on disk and no picture lies in the folder that the kit does not name
     F2  EVERY BOARD'S PICTURES ARE THERE: every template, every layout, every mirror, six seeds: every ground picture
         (a sheet's tile by its column and row), every sprite and every cover piece is a file
     F3  THE RIGHT GROUND UNDER THE RIGHT DECK: under every south edge of a deck there is a face; the overpass stands on
         the street (its faces, its broken ends and the city round it are the street's, never the far city); the deck and
         the interchange stand over the far city (never the street's faces)
     F4  THE BENTS ARE 36 M APART: along a deck's south face a bent stands on every third tile, never two together
     F5  ONCE IS ONCE: the burnt patch and the skid marks into the wall (rule 20) are on a board at most once each and
         never in the ring round it
     F6  NO WALL BEFORE A BREAK: a lane beside a broken end wears no wall toward the break
     F7  LIGHT: every tile picture is 515 x 364 (a city sheet five whole tiles a side, 1290 x 910 at most), the folder under its budget and no
         board's freeway pictures over its own
     M   PLANTED: a piece marked stand_in, a picture's name gone from disk, the overpass's skin taken off, a once-mark put
         in the common list: each turns its leg red

   node gates/the_freeway_is_finished_gate.js [--json out.json]
   ============================================================================ */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const OUT = arg('--json', null);
const FB = require(path.join(ROOT, 'slices/bohemia_freeway_boards.js'));
const FGR = path.join(ROOT, 'slices/fight_ground');
const read = f => JSON.parse(fs.readFileSync(path.join(FGR, f)));
const KIT = read('freeway/freeway.json'), BOARDS = read('freeway/freeway_boards.json'), G = read('fight_ground.json'), DRESS = read('street_board/dressing.json');
const W = 20, H = 15, R = 10;
const FOLDER_BUDGET = 2300000, BOARD_BUDGET = 896000;   /* bytes: the folder on disk (1,987,900 on 11/10); one board's own freeway pictures, which the fight waits on: never more than the stand-in's heaviest board was (the overpass, 895,832 on main 81e1187f; the finished overpass is 792,466) */
let pass = 0, fail = 0; const lines = [];
function check(ok, name, msg) { if (ok) pass++; else fail++; const l = (ok ? 'PASS ' : 'FAIL ') + name + '  ' + msg; lines.push(l); console.log(l); return ok; }
const clone = o => JSON.parse(JSON.stringify(o));
const base = s => String(s).split('#')[0];
const onDisk = (s, gone) => !(gone && gone[base(s)]) && fs.existsSync(path.join(FGR, base(s)));

/* a WebP's size without decoding it */
function webpSize(f) {
  const b = fs.readFileSync(f); if (b.toString('ascii', 0, 4) !== 'RIFF' || b.toString('ascii', 8, 12) !== 'WEBP') return null;
  const k = b.toString('ascii', 12, 16);
  if (k === 'VP8X') return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
  if (k === 'VP8 ') return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
  if (k === 'VP8L') { const v = b.readUInt32LE(21); return [1 + (v & 0x3fff), 1 + ((v >> 14) & 0x3fff)]; }
  return null;
}
function everyBoard(D, fn) {
  let n = 0;
  Object.keys(D.boards.templates).forEach(kind => { const T = D.boards.templates[kind];
    Object.keys(T.layouts).forEach(layout => { [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(flip => { for (let s = 0; s < 6; s++) {
      const sp = { v: 1, district: kind === 'interchange' ? 'interchange' : 'freeway', cell: [40 + s, 50], kind: kind === 'deck' ? 'deck' : kind === 'interchange' ? 'interchange' : 'crossing', crossing: 'ns', axis: 'ew', read: true };
      const B = FB.deal(sp, 1000 + s * 7919, D, G, W, H, { kind: kind, layout: layout, flip: flip }); n++; fn(B, kind, layout, flip, s); } }); }); });
  return n;
}
const def = (D, p) => G.cover[p] || G.cover_extra[p] || (DRESS.kit && DRESS.kit[p]) || D.kit.kit[p] || null;
const listOf = (K, re) => { const out = {}; Object.keys(K.tiles).forEach(k => { if (re.test(k)) K.tiles[k].forEach(s => { out[base(s)] = k; }); }); return out; };

function legs(D, gone) {
  const K = D.kit, r = {};
  /* F1 */
  const standIn = Object.keys(K.kit).filter(p => K.kit[p].stage !== 'finished');
  const named = {}; Object.keys(K.tiles).forEach(k => K.tiles[k].forEach(s => { named[base(s)] = 1; }));
  Object.keys(K.kit).forEach(p => { if (K.kit[p].src) named[K.kit[p].src] = 1; });
  ['subs', 'cross'].forEach(f => ((K.city || {})[f] || []).forEach(s => { named[s] = 1; })); if (K.city && K.city.fire) named[K.city.fire.src] = 1;
  if (K.city && K.city.near) ['subs', 'cross'].forEach(f => (K.city.near[f] || []).forEach(s => { named[s] = 1; }));
  Object.keys(K.once || {}).forEach(k => K.once[k].forEach(s => { named[s] = 1; })); if (K.lamp && K.lamp.src) named[K.lamp.src] = 1;
  const missing = Object.keys(named).filter(s => !onDisk(s, gone));
  const folder = fs.readdirSync(path.join(FGR, 'freeway')).filter(f => /\.webp$/.test(f)), orphans = folder.filter(f => !named['freeway/' + f]);
  r.F1 = { ok: K.stage === 'finished' && !standIn.length && fs.existsSync(path.join(ROOT, K.made_by || 'x')) && !missing.length && !orphans.length,
    msg: 'THE KIT IS FINISHED: stage ' + K.stage + ', ' + Object.keys(K.kit).length + ' pieces, ' + standIn.length + ' still a stand-in' + (standIn.length ? ' (' + standIn.join(', ') + ')' : '') + '; ' + Object.keys(named).length + ' pictures named, ' + missing.length + ' not on disk' + (missing.length ? ' (' + missing.slice(0, 3).join(', ') + ')' : '') + ', ' + orphans.length + ' in the folder the kit never names' + (orphans.length ? ' (' + orphans.slice(0, 3).join(', ') + ')' : '') + '; made by ' + K.made_by };
  /* the boards */
  const faces = listOf(K, /^face/), stFaces = listOf(K, /^face_st/), farSheets = {}; ['subs', 'cross'].forEach(f => ((K.city || {})[f] || []).forEach(s => { farSheets[s] = 1; }));
  const bents = listOf(K, /^face(_st)?_bent$/), onceOf = {}; Object.keys(K.once || {}).forEach(k => K.once[k].forEach(s => { onceOf[s] = k; }));
  const wallE = listOf(K, /^lane_[ns]*e[s]?w?$/), wallW = listOf(K, /^lane_n?e?s?w$/);
  let lost = [], badFace = [], badSkin = [], badBent = [], badOnce = [], badWall = [], heavy = [], bad5 = [], worst = 0;
  const size = {}; const bytes = s => size[s] != null ? size[s] : (size[s] = fs.existsSync(path.join(FGR, s)) ? fs.statSync(path.join(FGR, s)).size : 0);
  const n = everyBoard(D, (B, kind, layout, flip, seed) => {
    const L = B.laid, id = kind + '/' + layout + '/' + flip.join('') + '/' + seed, t = L.tiles, gr = (x, y) => L.ground[(y + R) * L.AW + x + R];
    const pics = {}; L.ground.forEach(s => { if (!s) return; pics[base(s)] = 1; const m = /#(\d+),(\d+)/.exec(s); if (m && (+m[1] > 4 || +m[2] > 4)) bad5.push(id + ' ' + s); if (!onDisk(s, gone)) lost.push(id + ' ' + base(s)); });
    L.sprites.forEach(q => { pics[q.src] = 1; if (!onDisk(q.src, gone)) lost.push(id + ' ' + q.src); });
    (B.lights || []).forEach(q => { pics[q.src] = 1; if (!onDisk(q.src, gone)) lost.push(id + ' ' + q.src); });
    B.cover.forEach(q => { const d = def(D, q.piece); if (d && d.src && !onDisk(d.src, gone)) lost.push(id + ' ' + d.src); });
    const mine = Object.keys(pics).filter(s => /^freeway\//.test(s)).reduce((a, s) => a + bytes(s), 0); worst = Math.max(worst, mine); if (mine > BOARD_BUDGET) heavy.push(id + ' ' + mine);
    const street = kind === 'overpass';
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const k = t[y][x], s = base(gr(x, y)), up = y > 0 ? t[y - 1][x] : null;
      if (k === 'drop' && up && (/^deck/.test(up) || up === 'broken')) {
        if (!faces[s]) badFace.push(id + ' [' + x + ',' + y + '] ' + s);
        else if (!!stFaces[s] !== street) badSkin.push(id + ' [' + x + ',' + y + '] ' + s);
        if (bents[s] && x + 1 < W && bents[base(gr(x + 1, y))]) badBent.push(id + ' [' + x + ',' + y + ']');
      } else if (k === 'drop' && street && farSheets[s]) badSkin.push(id + ' far city on the street [' + x + ',' + y + ']');
      if (/^deck/.test(k)) { if (x + 1 < W && t[y][x + 1] === 'broken' && wallE[s]) badWall.push(id + ' [' + x + ',' + y + '] ' + s); if (x > 0 && t[y][x - 1] === 'broken' && wallW[s]) badWall.push(id + ' [' + x + ',' + y + '] ' + s); }
    }
    /* a run of faces: a bent every third tile */
    for (let y = 0; y < H; y++) { let run = [];
      for (let x = 0; x <= W; x++) { const isF = x < W && t[y][x] === 'drop' && y > 0 && /^deck/.test(t[y - 1][x]) && !(y + 1 < H && t[y + 1][x] === 'street' && /_v/.test(faces[base(gr(x, y))] || ''));
        if (isF && !/_(low|v|brk)/.test(faces[base(gr(x, y))] || '')) run.push(!!bents[base(gr(x, y))]);
        else { if (run.length >= 6) { const idx = run.map((b, i) => b ? i : -1).filter(i => i >= 0); if (!idx.length || idx.some((v, i) => i && v - idx[i - 1] !== 3)) badBent.push(id + ' row ' + y + ' ' + run.map(b => b ? 'B' : '.').join('')); } run = []; } } }
    /* once */
    const cnt = {}; L.ground.forEach((s, i) => { if (!s || !onceOf[s]) return; const ax = i % L.AW, ay = Math.floor(i / L.AW); cnt[s] = (cnt[s] || 0) + 1; if (ax < R || ay < R || ax >= R + W || ay >= R + H) badOnce.push(id + ' ' + s + ' in the ring'); });
    Object.keys(cnt).forEach(s => { if (cnt[s] > 1) badOnce.push(id + ' ' + s + ' x' + cnt[s]); });
  });
  r.F2 = { ok: !lost.length && !bad5.length, msg: 'EVERY BOARD\'S PICTURES ARE THERE: ' + n + ' boards (4 templates, every layout, 4 mirrors, 6 seeds), ' + lost.length + ' pictures not on disk' + (lost.length ? '; e.g. ' + lost[0] : '') + (bad5.length ? '; a sheet tile off its sheet: ' + bad5[0] : '') };
  r.F3 = { ok: !badFace.length && !badSkin.length, msg: 'THE RIGHT GROUND UNDER THE RIGHT DECK: ' + badFace.length + ' south edges with no face under them, ' + badSkin.length + ' pictures of the wrong ground (the overpass on the street, the deck and the interchange over the far city)' + (badFace.length ? '; e.g. ' + badFace[0] : '') + (badSkin.length ? '; e.g. ' + badSkin[0] : '') };
  r.F4 = { ok: !badBent.length, msg: 'THE BENTS ARE 36 M APART: ' + badBent.length + ' runs of face with two bents together or a gap that is not three tiles' + (badBent.length ? '; e.g. ' + badBent[0] : '') };
  r.F5 = { ok: !badOnce.length && Object.keys(onceOf).length > 0, msg: 'ONCE IS ONCE: ' + Object.keys(onceOf).length + ' once-marks (the burnt patch, the skid marks into the wall), ' + badOnce.length + ' boards wear one twice or in the ring' + (badOnce.length ? '; e.g. ' + badOnce[0] : '') };
  r.F6 = { ok: !badWall.length, msg: 'NO WALL BEFORE A BREAK: ' + badWall.length + ' lanes walled toward a broken end' + (badWall.length ? '; e.g. ' + badWall[0] : '') };
  /* F7 */
  const odd = [], total = folder.reduce((a, f) => a + fs.statSync(path.join(FGR, 'freeway', f)).size, 0);
  Object.keys(named).filter(s => /^freeway\//.test(s) && onDisk(s)).forEach(s => { const z = webpSize(path.join(FGR, s)); if (!z) { odd.push(s + ' unreadable'); return; }
    const sheet = farSheets[s] || (K.city && K.city.near && ['subs', 'cross'].some(f => (K.city.near[f] || []).indexOf(s) >= 0)), piece = Object.keys(K.kit).some(p => K.kit[p].src === s) || (K.city && K.city.fire && K.city.fire.src === s) || (K.lamp && K.lamp.src === s);
    if (sheet ? (z[0] > 1290 || z[1] > 910 || z[0] % 5 || z[1] % 5) : !piece && (z[0] !== G.tile_px[0] || z[1] !== G.tile_px[1])) odd.push(s + ' ' + z.join('x')); });
  r.F7 = { ok: !odd.length && total <= FOLDER_BUDGET && !heavy.length, msg: 'LIGHT: the folder ' + folder.length + ' pictures, ' + total + ' bytes (budget ' + FOLDER_BUDGET + '); the heaviest board\'s own freeway pictures ' + worst + ' bytes (budget ' + BOARD_BUDGET + '); ' + odd.length + ' pictures of the wrong size' + (odd.length ? ' (' + odd.slice(0, 2).join(', ') + ')' : '') };
  return r;
}

const D0 = { boards: BOARDS, kit: KIT };
const real = legs(D0, null);
Object.keys(real).forEach(k => check(real[k].ok, k, real[k].msg));
/* M: the planted fails */
(function () {
  const a = clone(D0); a.kit.kit.fw_bent.stage = 'stand_in';
  check(!legs(a, null).F1.ok, 'M1', 'planted: a piece marked stand_in turns F1 red');
  const first = base(KIT.tiles.lane_s[0]), gone = {}; gone[first] = 1;
  check(!legs(D0, gone).F2.ok, 'M2', 'planted: ' + first + ' gone from disk turns F2 red');
  const b = clone(D0); delete b.boards.templates.overpass.skin;
  check(!legs(b, null).F3.ok, 'M3', 'planted: the overpass\'s skin taken off turns F3 red');
  const c = clone(D0), ok0 = Object.keys(c.kit.once || {})[0];
  if (ok0) { c.kit.tiles[ok0] = c.kit.once[ok0].concat(c.kit.once[ok0]); }
  check(!!ok0 && !legs(c, null).F5.ok, 'M4', 'planted: a once-mark as the only common picture of its kind turns F5 red');
})();
console.log('\nTHE FREEWAY IS FINISHED: ' + pass + ' passed, ' + fail + ' failed');
if (OUT) fs.writeFileSync(OUT, JSON.stringify({ pass, fail, lines }, null, 1));
process.exit(fail ? 1 : 0);
