#!/usr/bin/env node
/* NO BOARD BREAKS ITS OWN PICTURE (COMBAT MAPS 3, VAMILY rule 346(b)(c), ask line 355; Paolo 11/2 in the VOTE tab, on every ground:
   'watch out for straight lines at grid borders and colors that end abruptly and roads that dont connect and things that dont
   visually and logically make sense'). The legs beside the plan gate (gates/every_place_its_own_board_gate.js):
     SEAM     along every border between two cells of open GROUND (nothing standing on either: a wall on its house tile is the
              honest grid, not a seam), a straight line the eye sees where the two meet;
     CUT-OFF  a colour that stops dead at a border;
     ROADS    every road that reaches a block seam goes on across it (or the board's edge);
     EDGE     no thing reaches past its block's side, where the picture stops and would cut it (rule 356(c): 'these art assets cut
              off at the edge of any grid tile'): every box, model and rock of the place's blocks as the tool places them
              (tools/bohemia_combat_maps_every_place_its_own_board_11_3_26.py --clips, no render needed);
     LOGIC    nothing stands where it could not (a car in a wall, a dock on a road, a tree through a roof): a by-eye list per place in
              records/target/combat_maps_11_3/logic_list.json, each entry tied to the sha1 of the place's own block pictures, so a
              changed picture is a list nobody has checked yet.
   It bakes each place's board in the LIVE fight (slices/BOHEMIA_FIGHT.html's own bakeBoard, its UI.board: the picture every tile is
   drawn from), K seeds a place, and reads it with tools/bohemia_combat_maps_seams_read_11_3_26.py.
     node gates/every_place_no_seams_gate.js [--before] [--json out.json] [--only place,place]
   --before measures and reports, never fails (the record's before). A place on OWED_SEAMS has not been fixed yet (the list only
   shrinks); every other place must meet the floors. */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http'), cp = require('child_process'), crypto = require('crypto');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const BEFORE = process.argv.includes('--before'), OUT = arg('--json', null), ONLY = arg('--only', null);
const K = 3;
const FLOOR = { block_seen: 0.12, cell_seen: 0.04, cut: 0.04, road_bad: 0 };   /* shares of the borders read (roads: none) */
const OWED_SEAMS = [];
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.css': 'text/css', '.wasm': 'application/wasm', '.glb': 'model/gltf-binary' };

function blocksSha(place, P, G) {
  const ids = [P.landmark_block].concat(P.field || [], [].concat(...Object.values(P.cols || {})), [].concat(...Object.values(P.rows || {}))).map(b => b.split('|')[0]);
  const h = crypto.createHash('sha1');
  Array.from(new Set(ids)).sort().forEach(b => h.update(b + ':' + fs.readFileSync(path.join(ROOT, 'slices/fight_ground', G.blocks[b].src))));
  return h.digest('hex').slice(0, 12);
}

(async () => {
  const ours = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/ours.json'), 'utf8'));
  const G = JSON.parse(fs.readFileSync(path.join(ROOT, 'slices/fight_ground/fight_ground.json'), 'utf8'));
  const places = ours.place_boards.value.places;
  const ids = Object.keys(places).filter(p => places[p].built && (!ONLY || ONLY.split(',').includes(p)));
  const dir = fs.mkdtempSync('/tmp/seams-');
  const srv = http.createServer((q, r) => {
    const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
    r.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r);
  }).listen(0);
  const br = await chromium.launch();
  const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  await p.addInitScript(() => { window.FIGHT_OPTS = { seed: 5, speed: 1, board: 'desert', night: false }; try { localStorage.clear(); } catch (e) {} });
  await p.goto('http://localhost:' + srv.address().port + '/slices/BOHEMIA_FIGHT.html', { waitUntil: 'load' });
  await p.waitForFunction(() => { try { return !!eval('UI').board; } catch (e) { return false; } }, null, { timeout: 90000 });
  const meta = [];
  for (const id of ids) {
    for (let k = 0; k < K; k++) {
      /* inside: false (COMBAT TWO 11/9, rule 440(a)): the place's OWN board; half the wash's fights go under the city into the flood
         tunnels, whose culvert edges against the fill are meant to show (gates/the_flood_tunnels_gate.js reads them) */
      const o = { seed: 11 + k * 7, speed: 1, kind: 'ruin', district: places[id].gate_district, cell: { x: 20 + k * 9, y: 30 + k * 5 }, night: false, teach: false, formation: null, inside: false };
      await p.evaluate(o => { eval('UI').auto = false; window.FIGHT_OPTS = o; start(); }, o);
      await p.waitForFunction(() => { try { return !!eval('UI').board; } catch (e) { return false; } }, null, { timeout: 90000 });
      const got = await p.evaluate(() => { const U = eval('UI'), F = eval('FIGHT'), S = F.S;
        /* a cell of open ground: something you walk on that nothing stands on (a wall on its house tile is the honest grid, not a seam) */
        const open = []; for (let y = 0; y < S.h; y++) { open.push([]); for (let x = 0; x < S.w; x++) open[y].push(F.rowAt(x, y) !== 'obstacles' && !S.solid[y][x] && !(F.level(x, y) > 0) && !S.cover[y][x]); }
        return { url: U.board.toDataURL('image/png'), tw: U.tw, th: U.th, w: S.w, h: S.h, blocks: S.boardDef.blocks, open: open }; });
      const file = 'board_' + id + '_' + k + '.png';
      fs.writeFileSync(path.join(dir, file), Buffer.from(got.url.split(',')[1], 'base64'));
      meta.push({ place: id, file, tw: got.tw, th: got.th, w: got.w, h: got.h, blocks: got.blocks, open: got.open });
    }
  }
  await br.close(); srv.close();
  fs.writeFileSync(path.join(dir, 'boards.json'), JSON.stringify(meta));
  const res = JSON.parse(cp.execFileSync('python3', [path.join(ROOT, 'tools/bohemia_combat_maps_seams_read_11_3_26.py'), dir], { encoding: 'utf8', maxBuffer: 1 << 26 }));
  const own = id => Array.from(new Set([places[id].landmark_block].concat(places[id].field || [], [].concat(...Object.values(places[id].cols || {})),
    [].concat(...Object.values(places[id].rows || {}))).map(b => b.split('|')[0])));
  const allB = Array.from(new Set([].concat(...ids.filter(id => !OWED_SEAMS.includes(id)).map(own))));   /* the fixed places' blocks */
  const clipOut = cp.execFileSync('python3', [path.join(ROOT, 'tools/bohemia_combat_maps_every_place_its_own_board_11_3_26.py'), '--clips'].concat(allB), { encoding: 'utf8', maxBuffer: 1 << 26 });
  const CLIPS = JSON.parse(clipOut.trim().split('\n').pop());
  const LL = path.join(ROOT, 'records/target/combat_maps_11_3/logic_list.json');
  const logic = fs.existsSync(LL) ? JSON.parse(fs.readFileSync(LL, 'utf8')) : {};
  const fails = [], rows = [];
  console.log('place      block seams seen   cell borders seen   cut-offs   roads not met   cut at an edge   logic');
  ids.forEach(id => {
    const r = res[id], sha = blocksSha(id, places[id], G), lg = logic[id];
    const bs = r.block_seen / Math.max(1, r.block_n), cs = r.cell_seen / Math.max(1, r.cell_n), cu = r.cut / Math.max(1, r.block_n + r.cell_n);
    const lok = !!lg && lg.sha === sha && (lg.checks || []).length >= 3 && lg.checks.every(c => c.ok);
    const clipped = [].concat(...own(id).map(b => (CLIPS[b] || []).map(t => b + ': ' + t)));
    rows.push({ place: id, block_seen: +bs.toFixed(3), cell_seen: +cs.toFixed(3), cut: +cu.toFixed(3), road_bad: r.road_bad, road_n: r.road_n, clipped: clipped.length, logic: lok, sha, road_examples: r.road_examples, clip_examples: clipped.slice(0, 4), where: r.where });
    console.log([id.padEnd(10), (r.block_seen + '/' + r.block_n + ' ' + (bs * 100).toFixed(0) + '%').padEnd(18), (r.cell_seen + '/' + r.cell_n + ' ' + (cs * 100).toFixed(1) + '%').padEnd(19),
      (r.cut + ' ' + (cu * 100).toFixed(1) + '%').padEnd(10), (r.road_bad + '/' + r.road_n).padEnd(15), String(clipped.length).padEnd(16), lok ? 'checked' : (lg ? 'STALE OR NOT OK' : 'none')].join(' '));
    if (OWED_SEAMS.includes(id)) return;
    if (bs > FLOOR.block_seen) fails.push(id + ': ' + (bs * 100).toFixed(0) + '% of its block seams are a line you see (floor ' + FLOOR.block_seen * 100 + '%)');
    if (cs > FLOOR.cell_seen) fails.push(id + ': ' + (cs * 100).toFixed(1) + '% of its cell borders are a line you see (floor ' + FLOOR.cell_seen * 100 + '%)');
    if (cu > FLOOR.cut) fails.push(id + ': ' + (cu * 100).toFixed(1) + '% of its borders cut a colour off dead (floor ' + FLOOR.cut * 100 + '%)');
    if (r.road_bad > FLOOR.road_bad) fails.push(id + ': ' + r.road_bad + ' roads meet nothing across a seam (' + r.road_examples.slice(0, 2).join('; ') + ')');
    if (clipped.length) fails.push(id + ': ' + clipped.length + ' things cut at a picture\'s edge (' + clipped.slice(0, 2).join('; ') + ')');
    if (!lok) fails.push(id + ': its logic list is ' + (lg ? 'stale (its pictures changed since it was checked) or not ok' : 'missing'));
  });
  Object.keys(places).forEach(id => { if (!OWED_SEAMS.includes(id) && !places[id].built) fails.push(id + ': not built'); });
  if (OUT) fs.writeFileSync(OUT, JSON.stringify({ k: K, floor: FLOOR, owed: OWED_SEAMS, rows }, null, 1));
  console.log('owed (fixed later, may only shrink): ' + OWED_SEAMS.join(', '));
  if (BEFORE) { console.log('NO BOARD BREAKS ITS OWN PICTURE: BEFORE (measured, not judged)'); process.exit(0); }
  if (fails.length) { console.log('NO BOARD BREAKS ITS OWN PICTURE: FAIL'); fails.forEach(f => console.log('  ' + f)); process.exit(1); }
  console.log('NO BOARD BREAKS ITS OWN PICTURE: PASS (' + (ids.length - ids.filter(i => OWED_SEAMS.includes(i)).length) + ' places fixed and holding, ' + OWED_SEAMS.length + ' owed)');
})().catch(e => { console.error(e); process.exit(1); });
