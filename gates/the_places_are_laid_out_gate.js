#!/usr/bin/env node
/* ============================================================================
   THE PLACES ARE LAID OUT ON THE MAP (WORLD THIRTEEN 11/20, VAMILY rules 429(c), 461; ask line 504: 'the 15 place boards' layouts are
   written INTO the world map at their places, so the map gets their good layouts and the fight gets them back by being the map';
   records/BOHEMIA_WORLD_THIRTEEN_THE_PLACES_ARE_LAID_OUT_11_20_26.md).

     Y1 THE FILE: every one of the 15 templates carries its board's terrain (15 rows of 20, the fight's own board word for word:
        tools/bohemia_world_thirteen_place_layouts.py --check) and how the map lays it (built, natural, or own with its why); the
        generator carries both (the templates sync --check) and the map page the whole generator
     Y2 ON THE PAGE (the demo upright; the alpha on its side): the valley's cells of every place laid 'built' or 'natural' carry their
        board's tiles (VB_LAY), the 'own' places none; the whole painting lays them (its own count, VBC.stand.lay): every board tile
        that blocks or stands high is an object at its middle unless a street runs there (missed 0)
     Y3 THE MAP AND THE FIGHT AGREE: at every laid cell the fight's hand-over (vbTemplateAt) names the same board and the same three by
        three tiles the map laid
     Y4 A CLOSE TILE at the airport's middle cell (60 texels a block): its board's objects stand there; PLANTED (the laying off,
        VB_LAY_ON false): none (red)
     Y5 nothing threw

   Run: node gates/the_places_are_laid_out_gate.js     (about 4 minutes)
   ============================================================================ */
'use strict';
const path = require('path'), { execFileSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (name, cond, info) => { if (cond) pass++; else fail++; console.log((cond ? '  ok   ' : '  FAIL ') + name + (info ? '  [' + info + ']' : '')); return cond; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const J = require(path.join(ROOT, 'records/target/bb/place_templates.json'));
const FG = require(path.join(ROOT, 'slices/fight_ground/fight_ground.json'));

(async () => {
  /* Y1 */
  const CODE = { flat: '.', rough: ',', debris: ';', water: '~', height: '^', blocked: '#' }, bad = [];
  for (const k of J.order) { const t = J.templates[k], b = FG.boards[t.board];
    const want = b.terrain.map((r) => r.map((x) => CODE[x] || '.').join(''));
    if (!Array.isArray(t.terrain) || t.terrain.length !== 15 || t.terrain.some((r, i) => r !== want[i])) bad.push(k + ' terrain');
    if (!['built', 'natural', 'own'].includes(t.lay)) bad.push(k + ' lay'); if (t.lay === 'own' && !t.lay_why) bad.push(k + ' why'); }
  let step = true, why = ''; const run = (cmd, args) => { try { execFileSync(cmd, args, { cwd: ROOT, stdio: 'pipe' }); } catch (e) { step = false; why += ' ' + args[0]; } };
  run('python3', ['tools/bohemia_world_thirteen_place_layouts.py', '--check']); run('node', ['tools/bohemia_world_thirteen_place_templates_sync.js', '--check']); run('python3', ['tools/bohemia_world_thirteen_inline_generator.py', '--check']);
  const lays = J.order.map((k) => k + ' ' + J.templates[k].lay);
  ok('Y1 THE FILE: the 15 templates carry their boards\' terrain word for word and how the map lays them (' + lays.join(', ') + '); the generator and the page in step', bad.length === 0 && step, (bad.join(', ') || 'none wrong') + (step ? '' : '; OUT OF STEP:' + why));

  for (const [prof, alpha] of [['phone_portrait', false], ['phone_landscape', true]]) {
    let d; const errs = [];
    try { d = await open(Object.assign({ keepCards: true, profile: prof }, alpha ? { alpha: true } : {})); } catch (e) { ok('the page boots, ' + prof + ' [' + String(e.message).slice(0, 120) + ']', false); continue; }
    d.page.on('pageerror', (e) => errs.push(String(e).slice(0, 160)));
    const fr = d.fr, where = alpha ? 'the alpha on its side' : 'the demo upright';
    try {
      for (let i = 0; i < 160; i++) { if (await fr.evaluate(() => !!(window.om && om.n && typeof vbLayValley === 'function' && window.VB_TOWNS && VB_TOWNS.list))) break; await sleep(400); }
      for (let i = 0; i < 20; i++) { const t = await fr.evaluate(() => !!(window.LOOP && LOOP.frame && LOOP.frame.style.display === 'block')).catch(() => false); if (!t && i > 6) break; if (t) await fr.evaluate(() => loopClose()).catch(() => {}); await sleep(400); }
      await fr.evaluate(() => { if (typeof MODE !== 'undefined' && MODE !== 'city') { try { swapMode(); } catch (e) {} } try { travelStop(); } catch (e) {} setZoomAt(1); try { camHold(); } catch (e) {} render(); });
      for (let i = 0; i < 150; i++) { if (await fr.evaluate(() => { render(); return !!(VBC.day && VBC.seed === om.seed && !VBC.busy && VBC.stand && VBC.stand.lay); })) break; await sleep(400); }
      const R = await fr.evaluate(() => { const L = vbLayValley(), N = om.n, tp = vbTemplatesValley(), PT = BohemiaOvermap.PLACE_TEMPLATES.templates, by = {}, own = {};
        let cells = 0, agree = 0, ownLaid = 0;
        for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const c = BohemiaOvermap.templateAt(tp, x, y); if (!c) continue; const k = y * N + x, lay = PT[c.id].lay;
          if (lay === 'own') { own[c.id] = (own[c.id] || 0) + 1; if (L.idx[k]) ownLaid++; continue; }
          by[c.id] = (by[c.id] || 0) + 1; if (!L.idx[k]) continue; cells++;
          const f = vbTemplateAt(x, y), T = L.T[L.idx[k] - 1];
          if (f && f.id === c.id && f.tx === L.lx[k] && f.ty === L.ly[k] && T === PT[c.id].terrain.join('')) agree++; }
        let mid = null; { const cs = []; for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const c = BohemiaOvermap.templateAt(tp, x, y); if (c && c.id === 'airport') cs.push([x, y]); }
          if (cs.length) { const mx = cs.reduce((a, c) => a + c[0], 0) / cs.length, my = cs.reduce((a, c) => a + c[1], 0) / cs.length; cs.sort((a, b) => Math.hypot(a[0] - mx, a[1] - my) - Math.hypot(b[0] - mx, b[1] - my)); mid = cs[0]; } }
        return { by, own, cells, agree, ownLaid, whole: VBC.stand.lay, mid }; });
      const places = Object.keys(R.by).length, total = Object.values(R.by).reduce((a, b) => a + b, 0), W = R.whole;
      ok('Y2 ' + where + ': ' + R.cells + ' of ' + total + ' cells of ' + places + ' places laid with their board (' + Object.entries(R.by).map(([k, v]) => k + ' ' + v).join(', ') + '), the own places none (' + R.ownLaid + ' of ' + Object.values(R.own).reduce((a, b) => a + b, 0) + '); THE WHOLE PAINTING: ' + W.cells + ' cells, ' + W.objects + ' board objects standing at their tile middles, ' + W.missed + ' missed, ' + W.street + ' where a street runs, ' + W.water + ' water, ' + W.rough + ' rough',
        R.cells === total && total > 0 && places >= 6 && R.ownLaid === 0 && W.cells > 0 && W.objects > 0 && W.missed === 0);
      ok('Y3 ' + where + ': THE MAP AND THE FIGHT AGREE at ' + R.agree + ' of ' + R.cells + ' laid cells (the same board, the same three by three tiles)', R.agree === R.cells && R.cells > 0);
      if (!alpha && R.mid) {
        const tile = (off) => fr.evaluate(([m, off]) => { const was = VB_LAY_ON; if (off) { VB_LAY_ON = false; } VB_LAY.key = null;
          let c = null; try { c = vbCityCore(vbTileInput(Math.floor(m[0] / VB_TILE), Math.floor(m[1] / VB_TILE), 60)); } finally { VB_LAY_ON = was; VB_LAY.key = null; }
          return c && c.stand ? c.stand.lay : null; }, [R.mid, off]);
        const A = await tile(false), P = await tile(true);
        ok('Y4 A CLOSE TILE AT THE AIRPORT (' + R.mid.join(',') + ', 60 texels a block): ' + (A ? A.cells + ' cells laid, ' + A.objects + ' board objects, ' + A.missed + ' missed' : 'no count') + '; PLANTED (the laying off): ' + (P ? P.cells + ' cells, ' + P.objects + ' objects' : 'no count') + ' (red)',
          !!A && A.cells > 0 && A.objects > 0 && A.missed === 0 && !!P && P.cells === 0 && P.objects === 0);
      }
    } catch (e) { ok('the page legs ran, ' + prof + ' [' + String(e && e.message).slice(0, 160) + ']', false); }
    ok('Y5 ' + where + ': nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
    try { await d.close(); } catch (_e) {}
  }
  console.log('\nTHE PLACES ARE LAID OUT ON THE MAP: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
