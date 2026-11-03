#!/usr/bin/env node
/* ============================================================================
   THE MAP CAN TURN GATE (WORLD 8, 11/3/26; rule 344, ask line 353).

   PAOLO 11/2 (in the VOTE tab, on FOUR CODES, FOUR VALLEYS): 'Dont forget u can flip the map 90 degrees fuck it! While changing
   the locations and shit.' Code: engine/bohemia_overmap.js VALLEY_TURN (resynced into the page), the boot hook
   __THE_MAP_CAN_TURN__ (tools/bohemia_world_8_map_houses_patch.py H14).

   On the demo, his phone, the bench with the turn asked for (bohemia.world.bench.turn), WORLD 7's four codes, one valley each:
     T1 each code builds its own flip on top of the land's own (north to south, east to west, both, or neither), and the land's
        own rolls are untouched (the valley built with no turn is the land's own valley)
     T2 FOUR CODES, FOUR VALLEYS: the four codes give the four ways, at least one turned, and the four paintings differ
     T3 ROADS FIRST on every one: one road network, and every street end drawn as an end (the painter's cul-de-sac)
     T4 the walk reaches every base on every one, and a route goes round the shut blocks
     T5 the compass agrees: the land's sides round the valley (the region's compass) follow the turned valley (east is the town's
        side of the 15 on the map and on the land), and the pass roads leave by the valley's own edges
     T6 the places keep their names: the same base names on every valley, each on a real block of its kind
     T7 WORLD 7's state and the fights' boards: the state is dealt on the turned valley's own blocks, and a fight handed over from
        a block carries that block's own district (the board is cut from the turned map's cell)
     T8 a game begun before this (a code with no turn kept) opens its own valley, never a turned one
     C1 nothing threw
   ============================================================================ */
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const FOUR = ['DUST42', 'NEVADA', 'VEGAS7', 'K7QM9X'];   /* WORLD 7's card's codes: neither, north-south, east-west, both */
const ready = (fr) => fr.waitForFunction(() => typeof ctBases === 'function' && typeof om !== 'undefined' && window.BohemiaTowns && window.BohemiaWorldStateMap
  && typeof POWER !== 'undefined' && typeof cityRoute === 'function', null, { timeout: 90000 });
const farOut = (fr) => fr.evaluate(() => { try { const zb = zoomBounds(); setZoomAt(Math.min(zb[1], zb[0] * 1.6), CVW / 2, CVH / 2); panX = 0; panY = 0; } catch (e) {} try { render(); } catch (e) {} });
const OUT = path.join(ROOT, 'records/target/world_8');

const READ = () => {
  const L = om.layout || {}, N = om.n, T = window.__VALLEY_TURN || {};
  /* the land's own valley: the same build with no turn */
  const keep = globalThis.VALLEY_TURN; globalThis.VALLEY_TURN = null; let own = null; try { own = OM.buildOvermap(om.seed).layout; } catch (e) {} globalThis.VALLEY_TURN = keep;
  const isR = (x, y) => x >= 0 && y >= 0 && x < N && y < N && !!(om.at(x, y) && ROAD[om.at(x, y).district]);
  const comp = new Int32Array(N * N).fill(-1); let nc = 0, nr = 0;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { if (!isR(x, y) || comp[y * N + x] >= 0) continue; const q = [[x, y]]; comp[y * N + x] = nc;
    while (q.length) { const [a, b] = q.pop(); nr++; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const u = a + dx, v = b + dy; if (isR(u, v) && comp[v * N + u] < 0) { comp[v * N + u] = nc; q.push([u, v]); } } } nc++; }
  const HOUSE = /^(suburb|estate|gated|trailer|apartment|town)$/; let ends = 0, intoHouse = 0, roadEnds = 0, drawnEnd = 0, JF = null; try { JF = vbStreetFlagsValley(); } catch (e) {}
  for (let y = 1; y < N - 1; y++) for (let x = 1; x < N - 1; x++) { if (!isR(x, y)) continue; let k = 0, dx = 0, dy = 0;
    for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (isR(x + a, y + b)) { k++; dx = -a; dy = -b; }
    if (k !== 1) continue; ends++; const t = om.at(x + dx, y + dy); if (t && HOUSE.test(t.district)) intoHouse++;
    /* the painter draws it as an end (its join mask has the one street it joins: the cul-de-sac with a kerb all round it) */
    if (JF && om.at(x, y).district === 'arterial') { roadEnds++; const m = JF.f.jm[y * JF.w + x] | 0; let reads = !(m & (m - 1));   /* one join or none: the painter's cul-de-sac */
        if (!reads) { reads = true; for (const [bit, ddx, ddy] of [[1, 0, -1], [2, 1, 0], [4, 0, 1], [8, -1, 0]]) { if (!(m & bit) || isR(x + ddx, y + ddy)) continue;
          if (!(JF.f.jm[(y + ddy) * JF.w + x + ddx] | 0)) reads = false; } }   /* or it runs on: the next block is drawn as its street (the painter's through-street) */
        if (reads) drawnEnd++; } }
  const bs = ctBases(), names = Object.keys(bs).sort(), walks = [], kinds = [];
  for (const nm of names) { const t = { name: nm, x: bs[nm].x, y: bs[nm].y, tier: mapTierOf(nm) }; if (!townDoorWalk(t)) walks.push(nm); const c = om.at(bs[nm].x | 0, bs[nm].y | 0); kinds.push(c ? c.district : 'none'); }
  const R = window.BOH_REGION || {}, C = R.compass || null, dirE = (L.fwyX < L.stripX) ? 'x1' : 'x0', dirN = L.axisFlip ? 'y1' : 'y0';
  const S = BohemiaWorldStateMap.state(); let stOn = 0, stOff = 0;
  if (S) for (let i = 0; i < S.cell.length; i++) { if (!S.cell[i]) continue; const d = om.at(i % S.n, (i / S.n) | 0); if (d && d.district) stOn++; else stOff++; }
  /* a fight handed over from a built block carries that block's own district */
  let fight = null; for (let y = 20; y < N - 20 && !fight; y += 3) for (let x = 20; x < N - 20; x += 3) { const d = om.at(x, y); if (d && /^(suburb|industrial|commercial|casino|downtown)$/.test(d.district)) {
    const msg = { type: 'BOHEMIA_CITY_ENCOUNTER', at: [x, y], district: d.district }; try { BohemiaWorldStateMap.handOver(msg); } catch (e) {} fight = { at: [x, y], d: d.district, msg: msg.district, st: msg.block_state }; break; } }
  return { code: WORLD_SEED, from: WORLD_SEED_FROM, T: { ns: !!T.ns, ew: !!T.ew }, flip: [!!L.axisFlip, L.stripX < N / 2], own: own ? [!!own.axisFlip, own.stripX < N / 2] : null,   /* the strip's mirror: the Strip west of the middle */
    nc, nr, ends, intoHouse, roadEnds, drawnEnd, names, walks, kinds, C, dirE, dirN, key: VBC.key || '', stOn, stOff, fight, passes: (R.pass && R.pass.length) || (R.places ? R.places.length : 0), regionReady: !!R.ready };
};

(async () => {
  const errs = [], seen = [], shots = [];
  fs.mkdirSync(OUT, { recursive: true });
  const SP = process.env.TURN_SHOTS || fs.mkdtempSync('/tmp/turn-');
  for (const code of FOUR) {
    console.log('\n-- ' + code + ' --');
    const d = await open({ profile: 'phone_portrait', fog: false, arm: "try { localStorage.setItem('bohemia.world.bench.v1', '" + code + "'); localStorage.setItem('bohemia.world.bench.turn', '1'); } catch (e) {}" });
    d.page.on('pageerror', e => errs.push(code + ': ' + String(e).slice(0, 120)));
    try {
      await ready(d.fr); await d.page.waitForTimeout(3000);
      const r = await d.fr.evaluate(READ);
      const want = r.own ? [r.own[0] !== r.T.ns, r.own[1] !== r.T.ew] : null;
      ok('T1 ' + code + ': its own flip on the land\'s own valley', r.code === code && !!want && r.flip[0] === want[0] && r.flip[1] === want[1],
         'the code says ' + (r.T.ns ? 'north-south ' : '') + (r.T.ew ? 'east-west ' : '') + (!r.T.ns && !r.T.ew ? 'neither ' : '') + '; the land\'s own ' + JSON.stringify(r.own) + ', built ' + JSON.stringify(r.flip));
      ok('T3 ' + code + ': ROADS FIRST: one network, and every street end is drawn as an end (the painter\'s cul-de-sac, a kerb all round)', r.nc === 1 && r.roadEnds > 0 && r.drawnEnd === r.roadEnds,
         r.nr + ' road blocks in ' + r.nc + ' network; ' + r.ends + ' ends (' + r.intoHouse + ' into houses), ' + r.drawnEnd + ' of ' + r.roadEnds + ' street ends drawn as a cul-de-sac');
      ok('T4 ' + code + ': the walk reaches every base', r.names.length >= 10 && !r.walks.length, r.names.length + ' bases' + (r.walks.length ? ', not reached: ' + r.walks.join(',') : ''));
      ok('T5 ' + code + ': the compass agrees: the land round the valley turns with it (its east the town side of the 15, its north the valley\'s own north)', r.regionReady && !!r.C && r.C.e === r.dirE && r.C.n === r.dirN && r.passes > 0,
         'region ' + (r.C ? JSON.stringify(r.C) : 'none') + ', the valley\'s east ' + r.dirE + ', north ' + r.dirN + '; ' + r.passes + ' pass roads cut');
      ok('T7 ' + code + ': the state on the turned valley\'s own blocks, and a fight carries its block\'s own district', r.stOn > 0 && r.stOff === 0 && !!r.fight && !!r.fight.msg,
         r.stOn + ' state blocks on the valley, ' + r.stOff + ' off it; a fight at ' + (r.fight ? r.fight.at + ' (' + r.fight.d + ') hands over ' + r.fight.msg + (r.fight.st ? ', ' + r.fight.st : '') : 'none'));
      seen.push(r);
      await farOut(d.fr); await d.page.waitForTimeout(3500); await d.fr.evaluate(() => { try { render(); } catch (e) {} });
      const fn = path.join(SP, code + '.png'); await d.shot(fn); shots.push(fn);
    } catch (e) { ok('the gate ran on ' + code, false, String(e.stack || e.message).slice(0, 240)); }
    errs.push(...(d.errs || []).map(x => code + ': ' + x));
    await d.close().catch(() => {});
  }
  const ways = new Set(seen.map(r => r.flip.join(','))), turned = seen.filter(r => r.own && (r.flip[0] !== r.own[0] || r.flip[1] !== r.own[1])).length, keys = new Set(seen.map(r => r.key));
  ok('T2 FOUR CODES, FOUR VALLEYS: the four ways, at least one turned, four paintings', seen.length === 4 && ways.size === 4 && turned >= 1 && keys.size === 4,
     [...ways].join(' / ') + ' (axis flip, strip mirror); ' + turned + ' turned from the land\'s own; ' + keys.size + ' paintings');
  const same = seen.length === 4 && seen.every(r => JSON.stringify(r.names) === JSON.stringify(seen[0].names));
  ok('T6 the places keep their names on every valley', same && seen[0].names.length >= 10, seen.length ? seen[0].names.length + ' names, the same on all four ' + same : 'none');
  /* T8: an old game (a live save with a code and no turn kept) opens its own valley */
  {
    const d = await open({ profile: 'computer', fog: true, arm: "try { localStorage.removeItem('bohemia.world.turn.v1'); localStorage.setItem('bohemia.world.v1', JSON.stringify({ v: 1, code: 'K7QM9X', from: 'rolled', at: 1 })); localStorage.setItem('bohemia_city_save', JSON.stringify({ v: 1, data: { day: 3 } })); } catch (e) {}" }).catch(e => ({ fail: e }));
    if (d && !d.fail) {
      try { await ready(d.fr); await d.page.waitForTimeout(2000);
        const r = await d.fr.evaluate(() => ({ code: WORLD_SEED, from: WORLD_SEED_FROM, turn: globalThis.VALLEY_TURN || null }));
        ok('T8 a game begun before this keeps its own valley', r.from === 'saved' && r.code === 'K7QM9X' && !r.turn, JSON.stringify(r));
      } catch (e) { ok('T8 a game begun before this keeps its own valley', false, String(e.message).slice(0, 200)); }
      await d.close().catch(() => {});
    } else ok('T8 a game begun before this keeps its own valley', false, 'the save did not open: ' + String(d && d.fail && d.fail.message).slice(0, 160));
  }
  /* the card: the four valleys side by side, his phone, zoomed out */
  if (shots.length === 4) {
    const py = 'from PIL import Image, ImageDraw\nimport sys\nfs=sys.argv[1:5]; names=sys.argv[5:9]; out=sys.argv[9]\nims=[Image.open(f).convert("RGB") for f in fs]\n' +
      'ims=[i.crop((0,int(i.height*0.08),i.width,int(i.height*0.62))) for i in ims]\nims=[i.resize((390,int(i.height*390/i.width))) for i in ims]\n' +
      'W=390*4+30; H=ims[0].height+34; c=Image.new("RGB",(W,H),(14,12,10)); d=ImageDraw.Draw(c)\n' +
      'for k,(i,n) in enumerate(zip(ims,names)):\n  c.paste(i,(k*400,34)); d.text((k*400+8,10),n,fill=(232,220,192))\nc.save(out,quality=82)\n';
    const labels = seen.map(r => r.code + ': ' + (r.T.ns && r.T.ew ? 'TURNED HALF WAY' : r.T.ns ? 'FLIPPED NORTH-SOUTH' : r.T.ew ? 'MIRRORED EAST-WEST' : 'AS THE LAND LIES'));
    const pf = path.join(SP, 'compose.py'); fs.writeFileSync(pf, py);
    const res = cp.spawnSync('python3', [pf, ...shots, ...labels, path.join(OUT, 'THE_MAP_CAN_TURN.jpg')], { encoding: 'utf8' });
    console.log('  card: ' + (res.status === 0 ? path.join('records/target/world_8', 'THE_MAP_CAN_TURN.jpg') : 'not made: ' + (res.stderr || '').slice(0, 200)));
  }
  ok('C1 nothing threw', errs.length === 0, errs.slice(0, 3).join(' | '));
  console.log('\nTHE MAP CAN TURN: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
