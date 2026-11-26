#!/usr/bin/env node
/* THE PLACES SIT IN THE GROUND (WORLD 15, 11/26; VAMILY rule 480(b) on the map's places as built: 'every place reads and sits in
   the ground, no billboards (464)'; rule 479's lesson, Paolo 11/22: 'they look like they're floating on top of the map rather than
   actually being integrated properly into the map'; rule 480(c): never choppy).
   slices/bohemia_place_pieces.js draws a valley place IN DEPTH with the painted city (what stands in front of its block is drawn over
   it), its lot ITS BLOCK at every zoom (place_pieces.json wide 1.0, min_css_valley 0), each cut KEPT and drawn with one drawImage a
   frame; slices/bohemia_real_places.js takes the tap on the picture as drawn; place_pieces.json's numbers are where each picture's
   own ground plate is (two were off); the valley's legends carry no billboard; WORLD TWO's next boss sign is never put where he
   cannot walk.
     STATIC
     D1 every place picture's numbers are where its own ground plate is (tools/bohemia_world15_the_places_sit_in_the_ground_11_26_26.py
        --check), and a planted wrong number (THE GREENHOUSES' old ones) is caught
     D2 a valley place's lot is its block (wide 1.0, min_css_valley 0), and the map draws it through the depth cut
     D3 no billboard: THE DEAD BILLBOARD is out of the legend pool (the data file and the page's inline copy), the billboards' file and
        the footprints' file are not on the page (rules 464, 476(a))
     D4 the sign's pick is only a block he can walk to (__THE_SIGN_ON_HIS_SIDE_OF_THE_WALL__)
     ON THE PAGE (demo and alpha, upright and sideways; the bench, fog off), every valley place, a block 72 px:
     G1 drawn once: each place on the glass is drawn one time in the frame
     G2 on its block: its lot is its block across (within 2 points) and its plate's front corner is its block's front corner
     G3 IN THE GROUND: where the painted city stands in front of the place, the glass is the city (the place is behind it), and with the
        cut off (the old way) the same points were the place pasted over it: the test bites
     G4 IT READS: a tap on the top of its picture is the place (the tap's box is the picture as drawn)
     G5 NEVER CHOPPY: with its cut kept, the places cost at most 1 ms a frame; a pinch makes no cut (the kept one scaled); once the
        zoom holds, the cut is made again
     G6 THE SIGN TURNS UP: for 120 blocks he can stand on and three boss rows, the next sign is placed, on a block he can walk to
     G7 nothing threw
   Run: node gates/the_places_sit_in_the_ground_gate.js [static|demo|alpha|demo-up|demo-side|alpha-up|alpha-side] */
'use strict';
const path = require('path'), fs = require('fs'), cp = require('child_process'), os = require('os');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + String(w).slice(0, 500) + ']' : '')); };

function statics() {
  console.log('\n-- static --');
  const TOOL = path.join(ROOT, 'tools', 'bohemia_world15_the_places_sit_in_the_ground_11_26_26.py');
  const run = (args) => { try { return { code: 0, out: cp.execFileSync('python3', [TOOL, '--check'].concat(args || []), { encoding: 'utf8' }) }; } catch (e) { return { code: e.status, out: String(e.stdout || '') }; } };
  const r = run();
  const MANP = path.join(ROOT, 'slices', 'place_pieces', 'place_pieces.json'), man = JSON.parse(fs.readFileSync(MANP, 'utf8'));
  const planted = JSON.parse(JSON.stringify(man)); planted.pictures.the_greenhouses.bx = 82; planted.pictures.the_greenhouses.by = 123;
  const tmp = path.join(os.tmpdir(), 'place_pieces_planted_' + process.pid + '.json'); fs.writeFileSync(tmp, JSON.stringify(planted));
  const r2 = run(['--man', tmp]); try { fs.unlinkSync(tmp); } catch (e) {}
  ok('D1 every place picture\'s numbers are where its own ground plate is, and the greenhouses\' old numbers are caught', r.code === 0 && r2.code === 1 && /the_greenhouses/.test(r2.out),
     (r.out.trim().split('\n').pop()) + ' | planted: ' + r2.out.trim().split('\n').pop());
  const pp = fs.readFileSync(path.join(ROOT, 'slices', 'bohemia_place_pieces.js'), 'utf8');
  ok('D2 a valley place\'s lot is its block (wide ' + man.wide + ', min_css_valley ' + man.min_css_valley + ') and the map draws it in depth', man.wide === 1 && man.min_css_valley === 0 && /__THE_PLACES_SIT_IN_THE_GROUND__/.test(pp) && /mapDepthCovers/.test(pp) && /min_css_valley/.test(pp));
  const ws = JSON.parse(fs.readFileSync(path.join(ROOT, 'records', 'target', 'bb', 'world_state.json'), 'utf8')), page = fs.readFileSync(path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html'), 'utf8');
  const pool = (((ws.marks || {}).legend || {}).pool || []).map(p => p.name);
  const m = page.match(/var BOHEMIA_WORLD_STATE_DATA = (\{.*?\});\n/), inl = m ? JSON.parse(m[1]) : null, pool2 = inl ? ((((inl.marks || {}).legend || {}).pool) || []).map(p => p.name) : null;
  ok('D3 no billboard: the legends\' pool has none (' + pool.length + ' legends), the page\'s copy neither, the billboards and the footprints are not on the page',
     pool.length >= 5 && !pool.some(n => /BILLBOARD/i.test(n)) && !!pool2 && !pool2.some(n => /BILLBOARD/i.test(n)) && !/bohemia_billboards\.js/.test(page) && !/bohemia_tracks_read\.js/.test(page), pool.join(', '));
  const hm = fs.readFileSync(path.join(ROOT, 'slices', 'bohemia_his_map.js'), 'utf8');
  ok('D4 the next boss\'s sign is put only on a block he can walk to', /__THE_SIGN_ON_HIS_SIDE_OF_THE_WALL__/.test(hm) && /function reach\(/.test(hm) && /if \(reach\(x, y, p\[0\], p\[1\]\)\) return p;/.test(hm));
}

async function page(alpha, profile) {
  const W = (alpha ? 'the alpha' : 'the demo') + ', ' + (profile === 'phone_landscape' ? 'sideways' : 'upright');
  console.log('\n-- ' + W + ' --');
  const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
  const d = await open(Object.assign({ profile, fog: false }, alpha ? { alpha: true } : {}));
  const fr = d.fr, pg = d.page, errs = [];
  pg.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  try {
    for (let i = 0; i < 160; i++) { if (await fr.evaluate(() => !!(typeof om !== 'undefined' && om.n && typeof MODE !== 'undefined' && MODE === 'city' && window.BOH_REAL_PLACES && BOH_REAL_PLACES.loaded && window.BohemiaPlacePieces && BohemiaPlacePieces.pics && window.BohemiaHisMap && BohemiaHisMap.data()))) break; await pg.waitForTimeout(500); }
    try { await d.toMap(); } catch (e) {}
    await pg.waitForTimeout(2000);
    const res = await fr.evaluate(async () => {
      try { loopClose(); } catch (e) {} try { travelStop(); } catch (e) {}
      const P = BohemiaPlacePieces, RP = BOH_REAL_PLACES, bw = window.mapArtBeat; window.mapArtBeat = () => 0;
      const k = g.canvas.width / CVW, rows = [], keep = [city.x, city.y];
      const settle = () => { P.camT = -1e9; for (let i = 0; i < 12; i++) render(); };
      const grab = (x0, y0, w, h) => g.canvas.getContext('2d').getImageData(Math.round(x0 * k), Math.round(y0 * k), Math.max(1, Math.round(w * k)), Math.max(1, Math.round(h * k)));
      const cells = RP.cellsNow().filter(c => P.pics[c.id]);
      for (const c of cells) {
        city.x = c.x + 4; city.y = c.y + 4; setZoomAt(4, CVW / 2, CVH / 2); panX = 0; panY = 0; MAP_GROUND.key = ''; settle();
        /* the camera glides to him on the clock: every shot below is taken once it has stopped (measured: 7 px between two reads) */
        for (let w = 0, last = ''; w < 30; w++) { await new Promise(r => setTimeout(r, 120)); render(); const now = MAP_DEPTH.ox + ',' + MAP_DEPTH.oy; if (now === last) break; last = now; }
        settle();
        const L = P.last[c.id], n = P.n[c.id] | 0, p = iso(c.x, c.y, MAP_DEPTH.ox, MAP_DEPTH.oy), row = { id: c.id, n, TW: Math.round(TW) };
        if (!L) { row.missing = true; rows.push(row); continue; }
        const Pi = P.pics[c.id];
        row.lotW = +(L.box.w).toFixed(1); row.front = +((L.box.y + L.box.h) - (p.sy + TH)).toFixed(1); row.cx = +((L.box.x + L.box.w / 2) - p.sx).toFixed(1);
        /* G3: the three frames of the same glass: the place in depth (A), no place (B), the place pasted the old way (C) */
        const r0 = { x: L.x, y: L.y, w: L.w, h: L.h };
        /* this place alone on the glass for the three frames (THE BANK stands beside THE MOB MUSEUM, and its own cut is its own) */
        const all = P.pics; MAP_DEPTH.hide = true; P.pics = { [c.id]: all[c.id] }; settle();   /* the walkers off for the three frames: a party passing between them is not the place */
        const cam0 = MAP_DEPTH.ox + ',' + MAP_DEPTH.oy, L2 = P.last[c.id]; r0.x = L2.x; r0.y = L2.y; r0.w = L2.w; r0.h = L2.h; const A = grab(r0.x, r0.y, r0.w, r0.h); P.pics = {}; render(); const B = grab(r0.x, r0.y, r0.w, r0.h);
        P.pics = { [c.id]: all[c.id] }; P.depth = false; render(); const C = grab(r0.x, r0.y, r0.w, r0.h); P.depth = true; render(); row.camMoved = (MAP_DEPTH.ox + ',' + MAP_DEPTH.oy) !== cam0;   /* the depth below is read at the shots' own camera */
        const R = mapDepthRef(c.x, c.y), d = (I, i) => Math.abs(I.data[i] - B.data[i]) + Math.abs(I.data[i + 1] - B.data[i + 1]) + Math.abs(I.data[i + 2] - B.data[i + 2]);
        let cov = 0, cityShows = 0, pasted = 0, open = 0, placeShows = 0;
        for (let yy = 1; yy < r0.h - 1; yy += 2) for (let xx = 1; xx < r0.w - 1; xx += 2) {
          const ix = Math.round((xx + 0.5) * k), iy = Math.round((yy + 0.5) * k), wpx = A.width; if (ix >= wpx || iy >= A.height) continue;
          const i = (iy * wpx + ix) * 4; if (d(C, i) <= 24) continue;   /* the place paints nothing here */
          if (mapDepthCovers(r0.x + xx + 0.5, r0.y + yy + 0.5, R)) { cov++; if (d(A, i) <= 24) cityShows++; pasted++; }
          else { open++; if (d(A, i) > 24) placeShows++; } }
        P.pics = all; MAP_DEPTH.hide = false; settle();
        Object.assign(row, { cov, cityShows, pasted, open, placeShows, share: +(L.cut || 0).toFixed(2) });
        /* G4: a tap on the top of its picture */
        const tx = L.box.x + L.box.w / 2, ty = L.box.y + Math.max(2, L.box.h * 0.12), hit = mapTapWhich(tx, ty);
        row.tap = hit && hit.t ? (hit.t.real || hit.t.name) : (hit ? hit.what : null); row.tapAt = [Math.round(tx), Math.round(ty)]; row.blockTop = Math.round(p.sy - TH);
        rows.push(row);
      }
      /* G5: the cost with every cut kept, at a block 72 px and at the map's own stop; a pinch; the hold */
      const c0 = cells[0]; city.x = c0.x + 4; city.y = c0.y + 4; setZoomAt(4, CVW / 2, CVH / 2); panX = 0; panY = 0; settle();
      const msClose = []; for (let i = 0; i < 10; i++) { render(); msClose.push(P.ms); }
      setZoomAt(1, CVW / 2, CVH / 2); panX = 0; panY = 0; settle(); const msFar = []; for (let i = 0; i < 10; i++) { render(); msFar.push(P.ms); }
      const b0 = P.stats.built, s0 = P.stats.scaled; let z = 1;
      for (let i = 0; i < 10; i++) { z *= 1.07; setZoomAt(z, CVW / 2, CVH / 2); P.camT = performance.now(); render(); }
      const pinch = { built: P.stats.built - b0, scaled: P.stats.scaled - s0 };
      P.camT = -1e9; const b1 = P.stats.built; render(); render(); render(); pinch.heldBuilt = P.stats.built - b1; pinch.drew = P.drew;
      /* G6: the next sign, from 120 blocks he can stand on (not in a sealed pocket), three rows */
      const H = BohemiaHisMap, S = H.state(), n = om.n, keepI = S.boss.i, keepSign = S.boss.sign, comp = new Int32Array(n * n).fill(-1); let big = -1, bigN = 0, id = 0;
      for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { if (comp[y * n + x] >= 0 || !cityWalkable(x, y)) continue; const q = [y * n + x]; comp[y * n + x] = id; let sz = 0;
        while (q.length) { const kk = q.pop(); sz++; const X = kk % n, Y = (kk / n) | 0; for (const [u, v] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const xx = X + u, yy = Y + v; if (xx < 0 || yy < 0 || xx >= n || yy >= n) continue; const k2 = yy * n + xx; if (comp[k2] >= 0 || !cityWalkable(xx, yy)) continue; comp[k2] = id; q.push(k2); } }
        if (sz > bigN) { bigN = sz; big = id; } id++; }
      let tried = 0, placed = 0, walkable = 0, pockets = id - 1; const miss = [];
      for (let t = 0; t < 4000 && tried < 120; t++) { const x = 2 + Math.floor(Math.random() * (n - 4)), y = 2 + Math.floor(Math.random() * (n - 4)); if (comp[y * n + x] !== big) continue;
        tried++; city.x = x; city.y = y; try { fogReveal(x, y, fogRadius()); } catch (e) {}
        for (const i of [7, 8, 10]) { S.boss.i = i; S.boss.sign = null; if (H.placeSign()) { placed++; const s = S.boss.sign; if ((s.x === x && s.y === y) || cityRoute(x, y, s.x, s.y)) walkable++; }   /* the map's own walk (it takes the diagonals) */ else miss.push([x, y, i]); } }
      S.boss.i = keepI; S.boss.sign = keepSign; city.x = keep[0]; city.y = keep[1]; window.mapArtBeat = bw; setZoomAt(1, CVW / 2, CVH / 2); render();
      return { rows, msClose: Math.max(...msClose), msFar: Math.max(...msFar), pinch, sign: { tried, placed, walkable, of: tried * 3, pockets, miss: miss.slice(0, 5) }, err: P.err || null };
    });
    const R = res.rows;
    ok(W + ' G1 drawn once: every one of the ' + R.length + ' valley places on the glass is drawn one time', R.length >= 10 && R.every(r => r.n === 1), R.filter(r => r.n !== 1).map(r => r.id + ' ' + r.n).join(', '));
    ok(W + ' G2 on its block: its lot its block across and its front corner on its block\'s', R.every(r => !r.missing && Math.abs(r.lotW - r.TW) <= 2 && Math.abs(r.front) <= 2 && Math.abs(r.cx) <= 2),
       R.map(r => r.id.replace('the_', '') + ' ' + r.lotW + '/' + r.TW + ' front ' + r.front + ' x ' + r.cx).join(', '));
    const cov = R.reduce((a, r) => a + (r.cov | 0), 0), shows = R.reduce((a, r) => a + (r.cityShows | 0), 0), open = R.reduce((a, r) => a + (r.open | 0), 0), pshows = R.reduce((a, r) => a + (r.placeShows | 0), 0), withCov = R.filter(r => r.cov > 0).length;
    ok(W + ' G3 in the ground: where the city stands in front of a place, the city shows (' + shows + ' of ' + cov + ' points, at ' + withCov + ' places); where nothing does, the place (' + pshows + ' of ' + open + '); the old way pasted it over all ' + cov,
       cov >= 200 && withCov >= 5 && shows >= 0.97 * cov && pshows >= 0.97 * open && !R.some(r => r.camMoved), R.map(r => r.id.replace('the_', '') + ' ' + r.cityShows + '/' + r.cov + ' ' + r.placeShows + '/' + r.open).join(', '));
    const tapsOk = R.filter(r => r.tap === r.id).length;
    ok(W + ' G4 it reads: a tap on the top of its picture is the place (' + tapsOk + ' of ' + R.length + ')', tapsOk === R.length, R.filter(r => r.tap !== r.id).map(r => r.id + ' -> ' + r.tap + ' at ' + r.tapAt + ' (block top ' + r.blockTop + ')').join(', '));
    ok(W + ' G5 never choppy: with the cuts kept the places cost ' + res.msClose.toFixed(2) + ' ms a frame up close and ' + res.msFar.toFixed(2) + ' at the map\'s stop; a pinch made ' + res.pinch.built + ' cuts (' + res.pinch.scaled + ' scaled), held ' + res.pinch.heldBuilt + ' made again',
       res.msClose <= 1 && res.msFar <= 1 && res.pinch.built === 0 && res.pinch.scaled > 0 && res.pinch.heldBuilt >= 1, JSON.stringify(res.pinch));
    const S = res.sign;
    ok(W + ' G6 the sign turns up: ' + S.placed + ' of ' + S.of + ' from blocks he can stand on, ' + S.walkable + ' on a block he can walk to (' + S.pockets + ' sealed pockets on this valley)', S.tried >= 100 && S.placed === S.of && S.walkable === S.placed, JSON.stringify(S.miss));
    ok(W + ' G7 nothing threw', !errs.length && !res.err, errs.slice(0, 2).join(' | ') + (res.err ? ' ' + res.err : ''));
  } finally { await d.close(); }
}

(async () => {
  const only = process.argv[2];
  if (!only || only === 'static' || only === 'demo' || only === 'alpha') statics();
  if (only !== 'static') {
    for (const [alpha, prof] of [[false, 'phone_portrait'], [false, 'phone_landscape'], [true, 'phone_portrait'], [true, 'phone_landscape']]) {
      if ((only === 'demo' && alpha) || (only === 'alpha' && !alpha)) continue;
      const tag = (alpha ? 'alpha' : 'demo') + '-' + (prof === 'phone_landscape' ? 'side' : 'up');
      if (only && /-(up|side)$/.test(only) && only !== tag) continue;
      try { await page(alpha, prof); } catch (e) { ok((alpha ? 'the alpha ' : 'the demo ') + prof + ' ran', false, String(e.stack || e.message).slice(0, 300)); }
    }
  }
  console.log('\nTHE PLACES SIT IN THE GROUND: ' + (fail ? 'RED' : 'GREEN') + '  ' + pass + '/' + fail);
  process.exit(fail ? 1 : 0);
})();
