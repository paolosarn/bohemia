#!/usr/bin/env node
/* ============================================================================
   THE PLACES ARE TEMPLATES (WORLD THIRTEEN 11/11, VAMILY rules 429(a)(c)(f), 430; ask lines 504, 506, 507)

   The 15 place boards (slices/fight_ground/fight_ground.json boards place_*) are templates the map's generator places wherever that
   kind of place lands (placeTemplates in engine/bohemia_overmap.js, the numbers records/target/bb/place_templates.json's), so the
   hand-made layouts stand on every generated valley and nothing of them is thrown away (rule 430).

   NODE (22 generated valleys):
     T1 the file and the fight agree: a template for every place board, its board a 20 x 15 board of the fight, its kinds the
        fight's own place_boards districts word for word
     T2 the generator carries the file word for word (tools/bohemia_world_thirteen_place_templates_sync.js), the map page the whole
        generator (tools/bohemia_world_thirteen_inline_generator.py)
     T3 every one of the 15 places stands on every valley, never more than its per_valley, each on at least its min_cells blocks
     T4 every cell is a block of its kinds, no block is two places' cell, every cell's tiles start on the board, the spacing kept
     T5 rule 430: every block of every place board falls under a cell somewhere over the 22 valleys (nothing of a board unused)
     T6 the same valley stands the same places, and no roll of the valley moved (the districts are those of a build without them)
     T7 PLANTED FAIL: a template whose kinds are not the fight's (T1), a valley with a place taken off (T3), a cell on a block of
        another kind (T4), a board block never under a cell (T5): each red
   PAGE (the demo, a phone upright and on its side):
     P1 the map page stands the 15 places on the live valley, none under a home base's square, and answers the cell at a block
        (vbTemplateAt) with its board and its tiles
     P2 nothing threw
     P3 THE CUT (11/11): a fight the map hands over itself (cityHandOver) on a cell of the suburbs' place is dealt that place's own
        board block for block as it stands on the map (opts.template; the fight's dealOwn), the new houses in it

     node gates/the_places_are_templates_gate.js [--node]
   ============================================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const O = require(path.join(ROOT, 'engine/bohemia_overmap.js'));
const SYNC = require(path.join(ROOT, 'tools/bohemia_world_thirteen_place_templates_sync.js'));
const FG = JSON.parse(fs.readFileSync(path.join(ROOT, 'slices/fight_ground/fight_ground.json'), 'utf8'));
const PB = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/ours.json'), 'utf8')).place_boards.value.places;
const TJ = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/place_templates.json'), 'utf8'));
const SEEDS = [1337, 7, 42, 2026, 99, 31337, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 2691674296];

let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const done = () => { console.log('THE PLACES ARE TEMPLATES: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

function agree(T) {
  const bad = [];
  Object.keys(PB).forEach((k) => { const t = T.templates[k]; if (!t) { bad.push(k + ' has no template'); return; }
    const b = FG.boards[t.board]; if (!b || b.blocks.length * FG.block_tiles !== 15 || b.blocks[0].length * FG.block_tiles !== 20) bad.push(k + ' board ' + t.board);
    if (JSON.stringify(t.kinds) !== JSON.stringify(PB[k].districts)) bad.push(k + ' kinds ' + t.kinds.join('/') + ' not the fight\'s ' + PB[k].districts.join('/')); });
  if (T.order.length !== Object.keys(PB).length) bad.push('order ' + T.order.length);
  return bad;
}
function stands(list, valleyKinds, T) {
  const bad = []; const c = {};
  list.forEach((I) => { c[I.id] = (c[I.id] || 0) + 1; if (I.cells.length < T.templates[I.id].min_cells) bad.push(I.id + ' on ' + I.cells.length + ' blocks'); });
  T.order.forEach((k) => { const n = c[k] || 0; if (n < 1 || n > T.templates[k].per_valley) bad.push(k + ' x' + n); });
  return bad;
}
function cellsOK(m, list, T) {
  const bad = [], seen = {}, N = m.n;
  list.forEach((I) => { const K = new Set(T.templates[I.id].kinds);
    I.cells.forEach(([x, y, tx, ty]) => { const k = y * N + x, t = m.at(x, y);
      if (!t || !K.has(t.district)) bad.push(I.id + ' cell on ' + (t && t.district));
      if (seen[k]) bad.push(I.id + ' and ' + seen[k] + ' on one block'); seen[k] = I.id;
      if (tx < 0 || ty < 0 || tx >= 20 || ty >= 15) bad.push(I.id + ' tiles ' + tx + ',' + ty); }); });
  T.order.forEach((k) => { const L = list.filter((I) => I.id === k), s = Math.max(T.templates[k].spacing, 7);
    for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) if (Math.max(Math.abs(L[i].x0 - L[j].x0), Math.abs(L[i].y0 - L[j].y0)) < s) bad.push(k + ' too close'); });
  return bad;
}
/* the board blocks (block row, block column) a cell's three by three tiles touch */
function usedBlocks(all) {
  const used = {};
  all.forEach((I) => { const B = FG.boards[I.board]; I.cells.forEach(([, , tx, ty]) => {
    for (let v = ty; v < ty + 3 && v < 15; v++) for (let u = tx; u < tx + 3 && u < 20; u++) { const uu = I.flip ? 19 - u : u, br = Math.floor(v / 5), bc = Math.floor(uu / 5); used[I.board + ':' + br + ',' + bc] = 1; } }); });
  return used;
}

(async () => {
  const b1 = agree(TJ);
  ok('T1 a template for every one of the ' + Object.keys(PB).length + ' place boards, each a 20 x 15 board of the fight, its kinds the fight\'s own', b1.length === 0, b1.slice(0, 4).join('; ') || 'agree');
  const eng = fs.readFileSync(SYNC.ENGINE, 'utf8'), page = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
  let inl = false; try { inl = /in step/.test(require('child_process').execFileSync('python3', [path.join(ROOT, 'tools/bohemia_world_thirteen_inline_generator.py'), '--check'], { encoding: 'utf8' })); } catch (e) { inl = false; }
  ok('T2 the generator carries the file word for word, and the map page the whole generator', SYNC.written(eng) === eng && inl && page.indexOf('function placeTemplates(m){') > 0);
  let b3 = [], b4 = [], all = [], det = true, rolls = true, n = 0;
  for (const sd of SEEDS) {
    const m = O.buildOvermap(sd), L = m.templates; n += L.length; all = all.concat(L);
    stands(L, null, TJ).forEach((b) => b3.push(sd + ': ' + b)); cellsOK(m, L, TJ).forEach((b) => b4.push(sd + ': ' + b));
    if (sd === SEEDS[0] || sd === SEEDS[5]) { const m2 = O.buildOvermap(sd); det = det && JSON.stringify(m2.templates) === JSON.stringify(L);
      const T2 = O.placeTemplates({ n: m.n, at: m.at, seed: sd }); det = det && JSON.stringify(T2.list) === JSON.stringify(L);
      rolls = rolls && m.tiles.every((t) => m2.at(t.x, t.y).district === t.district); }
  }
  ok('T3 every one of the 15 places stands on every one of the ' + SEEDS.length + ' valleys (' + n + ' in all), within its per_valley, on at least its min_cells blocks', b3.length === 0, b3.slice(0, 4).join('; ') || 'all');
  ok('T4 every cell a block of its kinds, no block two places\' cell, every cell\'s tiles on the board, the spacing kept', b4.length === 0, b4.slice(0, 4).join('; ') || 'clean');
  const used = usedBlocks(all), want = []; Object.keys(PB).forEach((k) => { const B = FG.boards['place_' + k]; B.blocks.forEach((r, br) => r.forEach((nm, bc) => want.push('place_' + k + ':' + br + ',' + bc))); });
  const unused = want.filter((w) => !used[w]);
  ok('T5 rule 430: every block of every place board (' + want.length + ') falls under a cell somewhere on the 22 valleys', unused.length === 0, unused.slice(0, 6).join(', ') || 'every one');
  ok('T6 the same valley stands the same places, and no roll of the valley moved', det && rolls);
  /* T7 planted */
  const P1 = JSON.parse(JSON.stringify(TJ)); P1.templates.golf.kinds = ['golf', 'casino'];
  const m0 = O.buildOvermap(SEEDS[0]), L0 = m0.templates;
  const P3 = L0.filter((I) => I.id !== 'marina');
  const P4 = JSON.parse(JSON.stringify(L0)); const sub = P4.find((I) => I.id === 'suburb'); let off = null;
  for (let y = 0; y < m0.n && !off; y++) for (let x = 0; x < m0.n && !off; x++) if (m0.at(x, y).district === 'desert') off = [x, y];
  sub.cells.push([off[0], off[1], 0, 0]);
  const P5 = usedBlocks(all.filter((I) => I.id !== 'lab')), un5 = want.filter((w) => !P5[w]);
  const planted = [agree(P1).length > 0, stands(P3, null, TJ).length > 0, cellsOK(m0, P4, TJ).length > 0, un5.length > 0];
  ok('T7 PLANTED FAIL: kinds not the fight\'s, a place taken off a valley, a cell on another kind, a board\'s blocks never under a cell: each red (' + planted.filter(Boolean).length + '/4)', planted.every(Boolean));
  if (process.argv.includes('--node')) return done();

  const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  for (const prof of ['phone_portrait', 'phone_landscape']) {
    let d; const errs = [];
    try { d = await open({ keepCards: true, profile: prof }); } catch (e) { ok('the demo boots on the phone, ' + prof + ' [' + String(e.message).slice(0, 120) + ']', false); continue; }
    d.page.on('pageerror', (e) => errs.push(String(e).slice(0, 160)));
    try {
      const fr = d.fr;
      for (let i = 0; i < 160; i++) { if (await fr.evaluate(() => !!(window.om && om.n && typeof vbTemplatesValley === 'function'))) break; await d.page.waitForTimeout(400); }
      for (let i = 0; i < 120; i++) { if (await fr.evaluate(() => { try { vbCityInput(); } catch (e) {} return !!(window.VB_TOWNS && VB_TOWNS.list && VB_TOWNS.list.length); }).catch(() => false)) break; await d.page.waitForTimeout(250); }
      const R = await fr.evaluate(() => {
        const tp = vbTemplatesValley(); if (!tp) return { none: true, err: VB_TEMPLATES.err };
        const ids = {}, N = om.n; let under = 0, asked = 0, answered = 0;
        const sq = new Uint8Array(N * N); (VB_TOWNS.list || []).forEach((tw) => { for (let y = tw.y0; y < tw.y0 + tw.n; y++) for (let x = tw.x0; x < tw.x0 + tw.n; x++) if (x >= 0 && y >= 0 && x < N && y < N) sq[y * N + x] = 1; });
        tp.list.forEach((I) => { ids[I.id] = (ids[I.id] || 0) + 1; I.cells.forEach(([x, y, tx, ty]) => { if (sq[y * N + x]) under++; asked++; const a = vbTemplateAt(x, y); if (a && a.board === I.board && a.tx === tx && a.ty === ty) answered++; }); });
        return { places: Object.keys(ids).length, n: tp.list.length, under, asked, answered, ms: VB_TEMPLATES.ms, towns: (VB_TOWNS.list || []).length };
      });
      ok('P1 ' + prof + ': the map page stands ' + (R.places || 0) + ' of the 15 places on the live valley (' + (R.n || 0) + ' in all, ' + R.ms + ' ms), ' + (R.under | 0) + ' cells under the ' + (R.towns | 0) + ' home bases\' squares, and answers ' + (R.answered | 0) + ' of ' + (R.asked | 0) + ' cells with their board and tiles',
        !R.none && R.places === 15 && R.under === 0 && R.asked > 100 && R.answered === R.asked);
    } catch (e) { ok('the page legs ran, ' + prof + ' [' + String(e && e.message).slice(0, 160) + ']', false); }
      /* P3 THE CUT: a fight handed over by the map itself (cityHandOver) on a cell of the suburbs' place is dealt that place's board,
         block for block as it stands on the map, the new houses in it */
      const cell = await d.fr.evaluate(() => { const tp = vbTemplatesValley(), I = tp && tp.list.find((q) => q.id === 'suburb'); return I ? I.cells[Math.floor(I.cells.length / 2)].slice(0, 2) : null; });
      await d.fr.evaluate((c) => { cityHandOver({ type: 'BOHEMIA_CITY_ENCOUNTER', label: 'gate: the cut', draft: true, why: 'gate:cut', at: { gx: c[0], gy: c[1] } }); }, cell);
      let F = null;
      for (let i = 0; i < 180 && !F; i++) { await d.page.waitForTimeout(500);
        F = await d.page.evaluate(() => { try { const f = document.getElementById('fightFrame'), w = f && f.contentWindow, FI = w && w.eval('FIGHT'), B = FI && FI.S && FI.S.boardDef;
          if (!B || !FI.S.board || !B.blocks) return null; const want = w.eval('DB').ground.boards['place_suburb'].blocks;
          return { own: B.own, cut: B.cut, same: JSON.stringify(B.blocks.map((r) => r.map((n) => String(n).split('|')[0]))) === JSON.stringify(want.map((r) => r.map((n) => String(n).split('|')[0]))), houses: (B.laid && B.laid.houses) || (FI.S.boardDef.houses ? FI.S.boardDef.houses.length : 0), opt: w.FIGHT_OPTS && w.FIGHT_OPTS.template }; } catch (e) { return null; } }); }
      ok('P3 ' + prof + ': THE CUT: a fight the map hands over on the suburbs\' place (block ' + JSON.stringify(cell) + ') is dealt that place\'s own board block for block (' + (F ? 'own ' + F.own + ', the same layout ' + F.same + ', the cell ' + JSON.stringify(F.cut && F.cut.cell) + ', new houses ' + F.houses : 'no fight') + ')',
        !!F && F.own === 'suburb' && F.same && F.cut && F.cut.cell && F.cut.cell[0] === cell[0] && F.cut.cell[1] === cell[1]);
    ok('P2 ' + prof + ': nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
    try { await d.close(); } catch (_e) {}
  }
  done();
})();
