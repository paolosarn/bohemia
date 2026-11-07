#!/usr/bin/env node
/* THE BOARDS WEAR THEIR DRESSING, THE BENCH (COMBAT TWO 11/7/26, rule 419, ask line 479).
   The plans the map hands the fight at the gate's six spots (saved by gates/the_board_is_the_city_at_that_spot_gate.js --plans),
   each dealt three times in the fight alone: the TEMPLATE the same spot dealt before 11/6h (opts.street false), the BARE laid board
   of 11/6h (opts.dress false) and the LAID board now (the plan handed whole, dressed by slices/bohemia_street_board.js dress()); the
   six counts of rule 419 for each; with --shots dir, each board's whole baked picture and the fight's own first frame on the phone
   (390 x 844, the game's camera, six a side so a handed plan never has to grow, rule 378(b)).
     node tools/bohemia_combat_two_the_boards_dressed_bench_11_7_26.js plans.json [--shots dir] [--only suburb,strip] [--night] [--dsf 2] [--tiles 8] [--on gap|line]   */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.join(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const PLANS = process.argv[2], SHOTS = arg('--shots', null), ONLY = arg('--only', null), NIGHT = process.argv.indexOf('--night') > 0, DSF = +arg('--dsf', 1), TILES = +arg('--tiles', 6), ON = arg('--on', 'gap');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.css': 'text/css', '.woff2': 'font/woff2' };
const K = ['props', 'cover', 'blockers', 'roofs', 'effects', 'distinct'];
(async () => {
  const plans = JSON.parse(fs.readFileSync(PLANS, 'utf8')).filter(r => !ONLY || ONLY.split(',').indexOf(r.spot) >= 0);
  const { chromium } = require('playwright');
  const srv = http.createServer((q, r) => {
    const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
    r.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r);
  }).listen(0);
  const br = await chromium.launch();
  const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: DSF, hasTouch: true, isMobile: true });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e && e.message || e)));
  await p.addInitScript(() => { window.FIGHT_OPTS = { seed: 5, speed: 1, board: 'desert', night: false }; try { localStorage.clear(); } catch (e) {} });
  await p.goto('http://localhost:' + srv.address().port + '/slices/BOHEMIA_FIGHT.html', { waitUntil: 'load' });
  await p.waitForFunction(() => { try { return !!(eval('FIGHT').S.board) && !!eval('DB').streetKit && !!eval('DB').streetDress; } catch (e) { return false; } }, null, { timeout: 120000 });
  const rows = [];
  for (const r of plans) {
    const o = { seed: 11, kind: 'suburb', district: r.district, cell: { gx: r.cell[0], gy: r.cell[1] }, street: r.plan, night: NIGHT, auto: true, formation: null };
    const res = {};
    for (const which of ['template', 'bare', 'laid']) {
      const oo = Object.assign({}, o, { street: which === 'template' ? false : r.plan, dress: which === 'bare' ? false : undefined });
      res[which] = await p.evaluate(o => { const F = eval('FIGHT'); eval('SEED = ' + (o.seed >>> 0)); F.setup(o); const S = F.S, B = S.boardDef, L = B.laid, tm = 12;
        const inB = c => { const tx = c.tx != null ? c.tx : Math.floor(c.x_m / tm), ty = c.ty != null ? c.ty : Math.floor(c.y_m / tm); return tx >= 0 && ty >= 0 && tx < S.w && ty < S.h; };
        const pcs = (B.cover || []).filter(inB).map(c => c.piece), fire = {}; (S.fire || []).forEach(f => { fire[f.y * S.w + f.x] = 1; });
        let cover = 0, block = 0, roof = 0, eff = 0;
        for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) { const rw = F.rowAt(x, y);
          if (S.coverCount[y][x] > 0) cover++; if (!F._t.passable(x, y)) block++; if (rw === 'height') roof++; if (rw === 'rough' || rw === 'swamp' || (fire[y * S.w + x] && rw === 'flat')) eff++; }
        return { name: B.name, laid: !!L, props: pcs.length, cover, blockers: block, roofs: roof, effects: eff, distinct: new Set(pcs).size, lights: (B.lights || []).length,
          start: B.start || 'line', dress: S.streetDress, dressed: L && L.dressed || null, pieces: Array.from(new Set(pcs)).sort() }; }, oo);
      if (SHOTS) {
        fs.mkdirSync(SHOTS, { recursive: true });
        await p.evaluate(o => { window.FIGHT_OPTS = Object.assign({}, o, { speed: 1, auto: false, deploy: false, cap: 6 }); start();   /* six a side: a handed plan cannot grow (rule 378(b)), so the picture is the dealt board */ }, oo);
        await p.waitForFunction(() => { const l = document.getElementById('load'); return l && l.style.display === 'none' && !!eval('UI').board; }, null, { timeout: 120000 }).catch(() => {});
        await p.waitForTimeout(2500);
        /* ONE CAMERA FOR BOTH (a camera set by hand is read as his touch): the auto-frame fits the men he sees, and a dressed board
           hides more of them, so the before and the after are framed the same by hand: TILES across the phone, on the gap between
           the two lines, the board's middle row */
        await p.evaluate(o => { const U = FIGHT_UI, S = eval('FIGHT').S, n = o.n; U.glide = null; U.zoom = 390 / (n * U.tw);
          U.cx = ((o.on === 'line' ? S.cols[0] + 3 : (S.cols[0] + S.cols[1]) / 2) + .5) * U.tw; U.cy = (S.h / 2) * U.th; clampCam(); camLeft(); }, { n: TILES, on: ON });
        await p.waitForTimeout(900);
        /* the turn's own camera may have taken the view back meanwhile (his touch holds until his next man's turn): set again, two frames */
        await p.evaluate(o => new Promise(res => { const U = FIGHT_UI, S = eval('FIGHT').S, n = o.n; U.glide = null; U.zoom = 390 / (n * U.tw);
          U.cx = ((o.on === 'line' ? S.cols[0] + 3 : (S.cols[0] + S.cols[1]) / 2) + .5) * U.tw; U.cy = (S.h / 2) * U.th; clampCam(); camLeft();
          requestAnimationFrame(() => requestAnimationFrame(res)); }), { n: TILES, on: ON });
        await p.screenshot({ path: path.join(SHOTS, r.spot + '_' + which + '_play.png') });
        const board = await p.evaluate(() => { const U = eval('UI'); return U.board ? U.board.toDataURL('image/png') : null; });
        if (board) fs.writeFileSync(path.join(SHOTS, r.spot + '_' + which + '_board.png'), Buffer.from(board.split(',')[1], 'base64'));
      }
    }
    rows.push({ spot: r.spot, cell: r.cell, district: r.district, template: res.template, bare: res.bare, laid: res.laid });
    const poorer = K.filter(k => res.laid[k] < res.template[k]);
    console.log(r.spot.padEnd(10), String(r.cell).padEnd(7), (res.template.name + '').padEnd(22), K.map(k => k + ' ' + res.template[k] + '->' + res.laid[k]).join('  '),
      '| level', res.laid.dress, res.laid.dressed ? 'lifted ' + res.laid.dressed.lifted + ' moved ' + res.laid.dressed.moved + ' kit ' + res.laid.dressed.kit + ' roofs+' + res.laid.dressed.roofs : '',
      '| start', res.template.start, '->', res.laid.start, poorer.length ? '| POORER ' + poorer.join(',') : '| OK');
  }
  if (SHOTS) fs.writeFileSync(path.join(SHOTS, 'counts.json'), JSON.stringify(rows, null, 1));
  console.log('page errors', errs.length, errs.slice(0, 3).join(' | '));
  await br.close(); srv.close();
})().catch(e => { console.error(e); process.exit(2); });
