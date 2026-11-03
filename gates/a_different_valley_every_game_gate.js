#!/usr/bin/env node
/* ============================================================================
   A DIFFERENT VALLEY EVERY GAME GATE (WORLD 7, 11/3/26, rule 339, ask line 347).

   PAOLO, AGAIN: "the map is not giving procedurally generated vibes."
   MEASURED BEFORE: WORLD 6's code moved the fourteen bases; the same 160 circuits lit every night, no burned, looted or
   rebuilt block, no camp, lair, ruin or legendary place on the valley, every road open, the same sky.

   THE LAND STAYS REAL; ITS STATE AND WHAT STANDS ON IT COME FROM THE SAME CODE (engine/bohemia_world_state.js,
   records/target/bb/world_state.json, slices/bohemia_world_state_map.js). LEGS:
     V1 the page carries the data file and the module as they are on disk, the eleven hooks and the map's script
     V2 THE OLD VALLEY: the bench with no code has no state, no dark put out, no mark, no shut road, and its painting's key
        carries no state
     V3 TEN CODES on the real valley (its districts, its live circuits, each code's own seeded bases, the map's walk):
        ten different states; every pair differs in hundreds of blocks; the same code twice is the same state; every
        mark on a block of its kind; no scar on a base; every shut road leaves the valley in one piece
     V4 FOUR SEEDS ON THE PHONE (upright 390 x 844, the bench walking each code): the state is built, every dark
        circuit is put out in the grid itself, the painting re-baked with the state, the landmarks drawn, the walk
        refuses every shut block, the map still walks to every base; a burned block hands the fight the burned board;
        the four pictures, zoomed all the way out, differ from each other (pixels measured); one sideways
     V5 A STRANGER'S NEW GAME WITH A TYPED CODE: stamped st:1 with its code; opened again it keeps the same state; with the
        stamp taken off (a game saved before this file) it keeps the old valley
     V6 THE FIGHT: the burned board is the ruin board, not the block's own
     V7 nothing threw
   BOHEMIA_SHOT_DIR=dir writes the four seeds side by side (upright), the sideways one, and a night one.
   node gates/a_different_valley_every_game_gate.js
   ============================================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
const WS = require(path.join(ROOT, 'engine', 'bohemia_world_state.js'));
const SEED = require(path.join(ROOT, 'engine', 'bohemia_world_seed.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const done = () => { console.log('A DIFFERENT VALLEY EVERY GAME: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const SHOTS = process.env.BOHEMIA_SHOT_DIR || null;
const TEN = ['K7QM9X', 'VEGAS7', 'DUST42', 'NEVADA', 'BATT3R', 'MEADXX', 'CRASH5', 'REDRK9', 'SAHARA', 'HENDRS'];   /* every letter in the code's alphabet (no O, I, L, 0, 1: the page drops them) */
const FOUR = ['K7QM9X', 'VEGAS7', 'DUST42', 'NEVADA'];
const ready = (fr) => fr.waitForFunction(() => typeof ctBases === 'function' && typeof om !== 'undefined' && window.BohemiaTowns && window.BohemiaWorldStateMap
  && typeof POWER !== 'undefined' && typeof cityRoute === 'function', null, { timeout: 90000 });
const farOut = (fr) => fr.evaluate(() => { try { const zb = zoomBounds(); setZoomAt(Math.min(zb[1], zb[0] * 4), CVW / 2, CVH / 2); } catch (e) {} try { render(); } catch (e) {} });

(async () => {
  const errs = [];
  /* V1 */
  const page = fs.readFileSync(path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html'), 'utf8');
  const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'records', 'target', 'bb', 'world_state.json'), 'utf8'));
  const mod = fs.readFileSync(path.join(ROOT, 'engine', 'bohemia_world_state.js'), 'utf8').trimEnd();
  const m = page.match(/var BOHEMIA_WORLD_STATE_DATA = (\{.*?\});\n/);
  ok('V1 the page carries the data file as it is (re-run tools/bohemia_world_state_patch.py)', !!m && JSON.stringify(JSON.parse(m[1])) === JSON.stringify(data));
  ok('V1 the page carries the module as it is', page.indexOf(mod) >= 0);
  const hooks = (page.match(/__A_DIFFERENT_VALLEY_EVERY_GAME__/g) || []).length;
  ok('V1 the hooks and the map\'s script are on the page', hooks >= 13 && page.indexOf('<script src="bohemia_world_state_map.js"></script>') >= 0, hooks + ' marks');
  ok('V1 the map\'s script is on disk', fs.existsSync(path.join(ROOT, 'slices', 'bohemia_world_state_map.js')));
  /* NEVER GREEN (rule 341, Paolo 11/3: 'you gave a bunch of greenery to the suburb, bro this is an economic apocalypse'): no colour the
     state paints is green; a rebuilt yard is raked dirt and panels, there is no water on it */
  const tint = (page.match(/function wsTint\([\s\S]*?\n  \}\n/) || [''])[0], trip = (tint.match(/\[\d+, \d+, \d+\]/g) || []).map(t => JSON.parse(t));
  const greens = trip.filter(c => c[1] > c[0] + 10 && c[1] > c[2] + 10);
  ok('V1 NEVER GREEN: no colour the state paints is green (no water on a burned, looted or rebuilt block)', trip.length >= 10 && !greens.length, trip.length + ' colours, green: ' + JSON.stringify(greens));

  /* V2 + the real valley for V3 */
  let d = await open({ profile: 'computer', fog: false });
  let valley = null;
  try {
    await ready(d.fr); await d.page.waitForTimeout(2000);
    const r = await d.fr.evaluate(() => {
      const n = om.n, rows = []; for (let y = 0; y < n; y++) { const row = []; for (let x = 0; x < n; x++) { const t = om.at(x, y); row.push(t ? t.district : null); } rows.push(row); }
      const acc = {}; POWER.cells().forEach(c => { const a = acc[c.id] || (acc[c.id] = { id: c.id, n: 0, x: 0, y: 0, live: 0 }); a.n++; a.x += c.x; a.y += c.y; if (POWER.at(c.x, c.y).live) a.live++; });
      const circuits = Object.values(acc).filter(a => a.live).map(a => ({ id: a.id, x: a.x / a.n, y: a.y / a.n })).sort((p, q) => p.id - q.id);
      const walk = []; for (let y = 0; y < n; y++) { let s = ''; for (let x = 0; x < n; x++) s += cityWalkable(x, y) ? '1' : '0'; walk.push(s); }
      return { n, rows, circuits, walk, ds: BohemiaTowns.districtsOf(om, BohemiaCityEdit.cat).map(q => ({ x: q.x != null ? q.x : q.pos[0], y: q.y != null ? q.y : q.pos[1], kind: q.kind })),
        on: WORLD_STATE_ON, ws: WORLD_SEED, info: BohemiaWorldStateMap.info(), key: VBC.key || '', cell: !!window.__WS_CELL, classic: CT_BASES_BAKED };
    });
    valley = r;
    ok('V2 the bench with no code keeps the old valley: no state', !r.on && !r.ws && !r.info.built && !r.cell, JSON.stringify(r.info));
    ok('V2 the old valley\'s lights are the land seed\'s own (none put out)', r.circuits.length >= 100, r.circuits.length + ' live circuits');
    ok('V2 its painting carries no state', r.key.indexOf(':ws') < 0);
    errs.push(...(d.errs || []));
  } catch (e) { ok('V2 measured', false, String(e && e.message || e).slice(0, 200)); }
  await d.browser.close().catch(() => {}); try { d.server.close(); } catch (_e) {}

  /* V3: ten codes on the real valley, in node */
  const summaries = {};
  if (valley) {
    const grid = { n: valley.n, at: (x, y) => valley.rows[y][x] }, walk = (x, y) => valley.walk[y][x] === '1';
    const states = {};
    for (const code of TEN) {
      const P = SEED.place(valley.ds, code, { classic: valley.classic, n: valley.n });
      const S = WS.make(grid, code, { bases: P.bases, circuits: valley.circuits, walk });
      const S2 = WS.make(grid, code, { bases: P.bases, circuits: valley.circuits, walk });
      states[code] = { S, bases: P.bases }; summaries[code] = WS.summary(S);
      ok('V3 ' + code + ': the same code twice is the same state', S.key === S2.key && S.cell.join('') === S2.cell.join(''));
    }
    const keys = new Set(TEN.map(c => states[c].S.key));
    ok('V3 ten codes, ten different states', keys.size === TEN.length, keys.size + ' of ' + TEN.length);
    let minDiff = 1e9, minPair = '';
    for (let i = 0; i < TEN.length; i++) for (let j = i + 1; j < TEN.length; j++) {
      const a = states[TEN[i]].S, b = states[TEN[j]].S; let dd = 0;
      for (let k = 0; k < a.cell.length; k++) if (a.cell[k] !== b.cell[k]) dd++;
      const da = new Set(a.dark.ids), db = new Set(b.dark.ids); a.dark.ids.forEach(id => { if (!db.has(id)) dd++; }); b.dark.ids.forEach(id => { if (!da.has(id)) dd++; });
      if (dd < minDiff) { minDiff = dd; minPair = TEN[i] + '/' + TEN[j]; }
    }
    ok('V3 every pair of the ten differs in at least 150 blocks and circuits', minDiff >= 150, 'closest ' + minPair + ': ' + minDiff);
    const badMark = [], badScar = [], badRoad = [], K = data.marks;
    for (const code of TEN) {
      const { S, bases } = states[code], n = S.n;
      S.marks.forEach(mk => { const on = K[mk.kind].on || (K[mk.kind].pool || []).reduce((a, p) => a.concat(p.on), []); const dd = valley.rows[mk.y][mk.x];
        const fits = on.indexOf(dd) >= 0 || (on.indexOf('mountain_foot') >= 0 && /desert|wash/.test(dd)) || (on.some(o => /_side$/.test(o)));
        if (!fits) badMark.push(code + ' ' + mk.kind + '@' + mk.x + ',' + mk.y + ' on ' + dd); });
      for (const f in bases) { const b = bases[f]; for (let dy = -data.keep_clear.round_bases; dy <= data.keep_clear.round_bases; dy++) for (let dx = -data.keep_clear.round_bases; dx <= data.keep_clear.round_bases; dx++) {
        const x = b.x + dx, y = b.y + dy; if (x < 0 || y < 0 || x >= n || y >= n) continue; const st = S.cell[y * n + x]; if (st === 1 || st === 2) badScar.push(code + ' ' + f); if (S.block[y * n + x]) badRoad.push(code + ' ' + f); } }
      /* one piece: the walkable valley without the shut blocks */
      const lab = new Int32Array(n * n).fill(-1); let comps = 0, big = 0, sizes = [];
      for (let s = 0; s < n * n; s++) { if (lab[s] >= 0 || valley.walk[(s / n) | 0][s % n] !== '1') continue; const q = [s]; lab[s] = comps; let h = 0;
        while (h < q.length) { const c = q[h++], x = c % n, y = (c / n) | 0; [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([ax, ay]) => { const X = x + ax, Y = y + ay; if (X < 0 || Y < 0 || X >= n || Y >= n) return; const k2 = Y * n + X;
          if (lab[k2] >= 0 || valley.walk[Y][X] !== '1' || S.block[k2]) return; lab[k2] = comps; q.push(k2); }); }
        sizes.push(q.length); comps++; }
      S.__pieces = sizes.filter(z => z > 20).length;
    }
    ok('V3 every mark stands on a block of its kind', !badMark.length, badMark.slice(0, 4).join('; '));
    ok('V3 no base is burned, looted or shut in (3 blocks round each)', !badScar.length && !badRoad.length, badScar.concat(badRoad).slice(0, 4).join('; '));
    const before = (() => { const n = valley.n, lab = new Int32Array(n * n).fill(-1); let c = 0, sizes = [];
      for (let s = 0; s < n * n; s++) { if (lab[s] >= 0 || valley.walk[(s / n) | 0][s % n] !== '1') continue; const q = [s]; lab[s] = c; let h = 0;
        while (h < q.length) { const cc = q[h++], x = cc % n, y = (cc / n) | 0; [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([ax, ay]) => { const X = x + ax, Y = y + ay; if (X < 0 || Y < 0 || X >= n || Y >= n) return; const k2 = Y * n + X; if (lab[k2] >= 0 || valley.walk[Y][X] !== '1') return; lab[k2] = c; q.push(k2); }); }
        sizes.push(q.length); c++; } return sizes.filter(z => z > 20).length; })();
    const split = TEN.filter(c => states[c].S.__pieces !== before);
    ok('V3 every shut road leaves the valley in as many pieces as it was', !split.length, 'the open valley: ' + before + ' piece(s)' + (split.length ? '; split: ' + split.join(',') : ''));
    console.log('  the ten (burned / looted / rebuilt blocks, scars, circuits put out of ' + valley.circuits.length + ', camps lairs ruins legends, shut roads, sky):');
    for (const c of TEN) { const s = summaries[c]; console.log('    ' + SEED.show(c) + '  ' + [s.burned, s.looted, s.reclaimed].join(' / ') + '  scars ' + s.scars + '  dark ' + s.dark + '  marks ' + [s.marks.camp || 0, s.marks.lair || 0, s.marks.ruin || 0, s.marks.legend || 0].join(' ') + '  roads ' + s.roads + '  ' + s.weather); }
  }

  /* V4: four seeds on the phone, upright; the first again sideways and at night */
  const shots = [];
  const sideways = [];
  for (const [ci, code] of FOUR.concat(['K7QM9X']).entries()) {
    const side = ci === 4;
    d = await open({ profile: side ? 'phone_landscape' : 'phone_portrait', fog: false, arm: "try { localStorage.setItem('bohemia.world.bench.v1', '" + code + "'); } catch (e) {}" });
    try {
      await ready(d.fr); await d.page.waitForTimeout(2500);
      const r = await d.fr.evaluate(() => {
        const I = BohemiaWorldStateMap.info(), S = BohemiaWorldStateMap.state();
        const out = { on: WORLD_STATE_ON, ws: WORLD_SEED, I, key: VBC.key || '' };
        if (!S) return out;
        out.dark = S.dark.ids.length; out.isDark = S.dark.ids.filter(id => POWER.isDark(id)).length;
        let refused = 0, cells = 0; S.roads.forEach(rd => rd.cells.forEach(c => { cells++; if (!cityWalkable(c[0], c[1])) refused++; }));
        out.refused = refused; out.cells = cells;
        /* a route that wanted the shut block goes round it */
        out.thru = 0; S.roads.forEach(rd => { const a = [rd.x - 3, rd.y], b = [rd.x + 3, rd.y]; const p = (cityWalkable(a[0], a[1]) && cityWalkable(b[0], b[1])) ? cityRoute(a[0], a[1], b[0], b[1]) : null;
          if (p && p.some(q => S.block[(q[1] != null ? q[1] : q.y) * S.n + (q[0] != null ? q[0] : q.x)])) out.thru++; });
        const bs = ctBases(), walks = []; for (const nm in bs) { const t = { name: nm, x: bs[nm].x, y: bs[nm].y, tier: mapTierOf(nm) }; if (!townDoorWalk(t)) walks.push(nm); }
        out.walks = walks;
        /* the fight's door at a burned block and at a looted one */
        const B = (window.BOHEMIA_WORLD_STATE_DATA.scars.burned.board.on || []);
        const find = (st, built) => { for (let i = 0; i < S.cell.length; i++) { if (S.cell[i] !== st) continue; const x = i % S.n, y = (i / S.n) | 0, dd = om.at(x, y).district;
          if (built == null || (B.indexOf(dd) >= 0) === built) return [x, y]; } return null; };
        const b1 = find(1, true), b2 = find(2), b3 = find(1, false);
        if (b3) { const msg = { at: b3, district: om.at(b3[0], b3[1]).district }; const was = msg.district; BohemiaWorldStateMap.handOver(msg); out.openMsg = { d: msg.district, kept: msg.district === was, st: msg.block_state }; }
        if (b1) { const msg = { type: 'BOHEMIA_CITY_ENCOUNTER', at: b1, district: om.at(b1[0], b1[1]).district }; BohemiaWorldStateMap.handOver(msg); out.burnMsg = { d: msg.district, was: msg.district_was, st: msg.block_state, powered: msg.powered }; }
        if (b2) { const msg = { at: b2, district: om.at(b2[0], b2[1]).district }; const was = msg.district; BohemiaWorldStateMap.handOver(msg); out.lootMsg = { d: msg.district, kept: msg.district === was, st: msg.block_state }; }
        return out;
      });
      ok('V4 ' + code + (side ? ' sideways' : '') + ': the bench walks the code with its state', r.on && r.ws === code && r.I && r.I.on && r.I.key, r.I && r.I.key);
      if (!side) {
        ok('V4 ' + code + ': every circuit the code puts out is dark in the grid itself', r.dark > 0 && r.isDark === r.dark, r.isDark + ' of ' + r.dark + ' (' + (r.I.circuitsLive || 0) + ' were live)');
        ok('V4 ' + code + ': the walk refuses every shut block, and a route that wanted one goes round', r.cells > 0 && r.refused === r.cells && r.thru === 0, r.refused + ' of ' + r.cells + ' refused; ' + r.thru + ' routes through');
        ok('V4 ' + code + ': the map still walks to every base', r.walks && !r.walks.length, (r.walks || []).join(','));
        ok('V4 ' + code + ': a burned built block hands the fight the burned board; a looted one, and burned open ground, keep their own', !!r.burnMsg && r.burnMsg.d === data.scars.burned.board.district && r.burnMsg.st === 'burned' && r.burnMsg.powered === false && (!r.lootMsg || (r.lootMsg.kept && r.lootMsg.st === 'looted')) && (!r.openMsg || (r.openMsg.kept && r.openMsg.st === 'burned')),
          JSON.stringify(r.burnMsg) + ' ' + JSON.stringify(r.lootMsg) + ' open ground: ' + JSON.stringify(r.openMsg));
      }
      await farOut(d.fr); await d.page.waitForTimeout(2500);
      const r2 = await d.fr.evaluate(() => { try { render(); } catch (e) {} return { I: BohemiaWorldStateMap.info(), key: VBC.key || '' }; });
      ok('V4 ' + code + (side ? ' sideways' : '') + ': the painting re-baked with the state, and the landmarks drawn', r2.key.indexOf(':ws' + r2.I.key) >= 0 && r2.I.drew && (r2.I.drew.camps + r2.I.drew.lairs + r2.I.drew.ruins + r2.I.drew.masts) >= 5,
        JSON.stringify(r2.I.drew));
      if (!side) {
        /* NEVER GREEN, measured on the painting itself: the share of green texels on the rebuilt blocks, against the valley's homes */
        const gr = await d.fr.evaluate(() => { const S = BohemiaWorldStateMap.state(), C = VBC.day; if (!S || !C) return null; const P = C.width, S2 = VBC.S, PAD = VBC.PAD, n = S.n;
          const px = C.getContext('2d').getImageData(0, 0, P, P).data; let rn = 0, rg = 0;
          for (let v = 0; v < P; v++) for (let u = 0; u < P; u++) { const o = (v * P + u) * 4; const bx = Math.floor(u / S2) - PAD, by = Math.floor(v / S2) - PAD; if (bx < 0 || by < 0 || bx >= n || by >= n || S.cell[by * n + bx] !== 3) continue;
            rn++; if (px[o + 1] > px[o] + 10 && px[o + 1] > px[o + 2] + 10) rg++; }
          return { rn, rg }; });
        ok('V4 ' + code + ': NEVER GREEN on the painting: the rebuilt blocks\' texels are not green', !!gr && gr.rn > 0 && gr.rg / gr.rn < 0.02, gr ? (100 * gr.rg / Math.max(1, gr.rn)).toFixed(2) + '% of ' + gr.rn + ' texels' : 'no painting');
      }
      const f = path.join(SHOTS || require('os').tmpdir(), 'valley_' + code + (side ? '_side' : '') + '.png');
      await d.page.screenshot({ path: f }); (side ? sideways : shots).push([code, f]);
      if (ci === 0) {
        await d.fr.evaluate(() => { try { T.min = 23 * 60; render(); } catch (e) {} }); await d.page.waitForTimeout(2500);
        const rn = await d.fr.evaluate(() => { try { render(); } catch (e) {} return BohemiaWorldStateMap.info(); });
        ok('V4 ' + code + ': at night the camps\' fires and the masts\' lights cut the dark', rn.night > 0, rn.night + ' lit');
        const fn = path.join(SHOTS || require('os').tmpdir(), 'valley_' + code + '_night.png'); await d.page.screenshot({ path: fn }); shots.night = fn;
      }
      errs.push(...(d.errs || []));
    } catch (e) { ok('V4 ' + code + ' measured', false, String(e && e.message || e).slice(0, 200)); }
    await d.browser.close().catch(() => {}); try { d.server.close(); } catch (_e) {}
  }
  /* the four pictures differ: pixels measured, pairwise, on the valley's middle */
  if (shots.length === 4) {
    try {
      const out = require('child_process').execFileSync('python3', ['-c', [
        'import sys; from PIL import Image, ImageChops, ImageDraw',
        'fs=sys.argv[1:5]; ims=[Image.open(f).convert("RGB") for f in fs]',
        'w,h=ims[0].size; box=(0,int(h*0.12),w,int(h*0.86)); mins=1.0',
        'for i in range(4):',
        ' for j in range(i+1,4):',
        '  a=ims[i].crop(box); b=ims[j].crop(box); d=ImageChops.difference(a,b).convert("L").point(lambda v:255 if v>24 else 0)',
        '  r=sum(1 for v in d.getdata() if v)/float(d.size[0]*d.size[1]); mins=min(mins,r)',
        'print("%.4f"%mins)'].join('\n'), ...shots.map(s => s[1])]).toString().trim();
      const mn = parseFloat(out);
      ok('V4 the four valleys zoomed out on the phone differ from each other (the least-different pair)', mn >= 0.04, (mn * 100).toFixed(1) + '% of the valley\'s pixels');
    } catch (e) { ok('V4 the four pictures compared', false, String(e.message).slice(0, 160)); }
    if (SHOTS) {
      try { require('child_process').execFileSync('python3', ['-c', [
        'import sys; from PIL import Image, ImageDraw',
        'fs=sys.argv[1:5]; names=sys.argv[5:9]; out=sys.argv[9]; ims=[Image.open(f).convert("RGB") for f in fs]',
        'w,h=ims[0].size; o=Image.new("RGB",(w*4+36,h+30),(8,8,8)); dr=ImageDraw.Draw(o)',
        'for i,im in enumerate(ims):',
        ' o.paste(im,(i*(w+12),30)); dr.text((i*(w+12)+8,8),"SEED "+names[i],fill=(220,230,200))',
        'o.save(out)'].join('\n'), ...shots.map(s => s[1]), ...shots.map(s => SEED.show(s[0])), path.join(SHOTS, 'four_valleys.png')]);
        console.log('  side by side: ' + path.join(SHOTS, 'four_valleys.png')); } catch (e) { console.log('  (side by side not made: ' + String(e.message).slice(0, 120) + ')'); }
    }
  }

  /* V5: a stranger's new game with a typed code; opened again; the stamp taken off */
  d = await open({ profile: 'phone_portrait', fog: true, arm: "try { localStorage.setItem('bohemia.world.next.v1', 'dust42'); } catch (e) {}" });
  try {
    await ready(d.fr);
    for (let i = 0; i < 120; i++) { if (await d.fr.evaluate(() => !!(window.__START_IN_TOWN && window.__START_IN_TOWN.opened)).catch(() => false)) break; await d.page.waitForTimeout(250); }
    const r = await d.fr.evaluate(() => { let st = null; try { st = JSON.parse(localStorage.getItem('bohemia.world.v1') || 'null'); } catch (e) {} return { ws: WORLD_SEED, from: WORLD_SEED_FROM, on: WORLD_STATE_ON, st, I: BohemiaWorldStateMap.info() }; });
    ok('V5 a stranger\'s new game with a typed code carries the state, stamped beside its code', r.ws === 'DUST42' && r.on && r.st && r.st.st === 1 && r.I.on && r.I.key === summaries.DUST42.key, (r.I.key || '-') + ' (node: ' + (summaries.DUST42 && summaries.DUST42.key) + ')');
    const saved = () => d.page.evaluate(() => ['bohemia_city_save.a', 'bohemia_city_save.b', 'bohemia_city_save'].some(k => { const v = localStorage.getItem(k); return !!v && v !== '{"bohemia":"DEAD"}'; })).catch(() => false);
    for (let i = 0; i < 60 && !(await saved()); i++) await d.page.waitForTimeout(500);
    await d.page.close().catch(() => {});   /* one tab at a time: three of the game at once is more than the box holds */
    const e = await open({ again: d, fog: true });
    await ready(e.fr);
    const r2 = await e.fr.evaluate(() => ({ ws: WORLD_SEED, from: WORLD_SEED_FROM, on: WORLD_STATE_ON, I: BohemiaWorldStateMap.info() }));
    ok('V5 opened again it keeps its own state', r2.from === 'saved' && r2.on && r2.I.key === r.I.key, r2.from + ' ' + r2.I.key);
    await e.page.evaluate(() => { try { const s = JSON.parse(localStorage.getItem('bohemia.world.v1')); delete s.st; localStorage.setItem('bohemia.world.v1', JSON.stringify(s)); } catch (x) {} });
    await e.page.close().catch(() => {});
    const f = await open({ again: e, fog: true });
    await ready(f.fr);
    const r3 = await f.fr.evaluate(() => ({ ws: WORLD_SEED, from: WORLD_SEED_FROM, on: WORLD_STATE_ON, I: BohemiaWorldStateMap.info(), key: VBC.key || '' }));
    ok('V5 a game saved before this file (no stamp) keeps the old valley: its code, no state', r3.ws === 'DUST42' && r3.from === 'saved' && !r3.on && !r3.I.built && r3.key.indexOf(':ws') < 0, r3.from + ' on=' + r3.on);
    errs.push(...(d.errs || []), ...(e.errs || []), ...(f.errs || []));
    await f.browser.close().catch(() => {}); try { f.server.close(); } catch (_e) {}
  } catch (e) { ok('V5 measured', false, String(e && e.message || e).slice(0, 200)); await d.browser.close().catch(() => {}); try { d.server.close(); } catch (_e) {} }

  /* V6: the fight deals the burned board */
  try {
    const { engine } = require(path.join(ROOT, 'tools', 'bohemia_fight_headless.js'));
    const ctx = engine(), F = ctx.FIGHT;
    const deal = (o) => { ctx.setSeed(777); F.setup(Object.assign({ deploy: false, formation: null, band: ['brigand_thug'] }, o)); return JSON.stringify(F.S.boardDef.blocks); };
    const own = deal({ kind: 'suburb', district: 'suburb', cell: { x: 41, y: 17 } }), burned = deal({ kind: 'ruin', district: data.scars.burned.board.district, cell: { x: 41, y: 17 } });
    ok('V6 a burned block\'s board is the ruin board, not its own', own !== burned && /ruin\./.test(burned) && !/ruin\./.test(own), burned.slice(0, 90));
  } catch (e) { ok('V6 measured', false, String(e && e.message || e).slice(0, 160)); }

  const real = errs.filter(e => !/favicon|net::ERR|404/.test(String(e)));
  ok('V7 nothing threw', !real.length, real.slice(0, 3).join(' | ').slice(0, 300));
  done();
})().catch(e => { console.error(e); ok('the gate ran', false, String(e && e.message || e).slice(0, 200)); done(); });
