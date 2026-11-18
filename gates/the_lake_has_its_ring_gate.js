#!/usr/bin/env node
/* ============================================================================
   THE LAKE HAS ITS RING (WORLD THIRTEEN 11/18, VAMILY rule 453: 'every zone itself', the lake shore; records/BOHEMIA_WORLD_THIRTEEN_
   THE_LAKE_HAS_ITS_RING_11_18_26.md).

   MEASURED BEFORE (the demo on a phone, the near and street stops): the lake was flat water to a straight block edge and the desert's
   pebbles at once, no shore at all. The real Lake Mead after the drought is known by its bathtub ring (the pale mineral band the water
   left on the rock), the cracked mud flats where the water went back, and the boats left on them.

     L1 THE TABLE AND THE PALETTE: VB_SHORE on, carried into the painters (the worker's source), the bed, crack, waterline, ring and
        hull colours in the painter's palette and apart by value: the ring lighter than the open ground, the bed lighter than the
        water, the cracks and the waterline darker than the bed
     L2 ON THE PAGE (the demo upright; the alpha on its side): the whole painting counts the shore (its own count, VBC.stand.shore):
        lake blocks meeting open ground, the bed on them, cracks in the bed (3 to 40 in 100 of it), the waterline, the ring on the land
        beside it; a lake block's middle stays water (at most 20 in 100 of the middles a bed); a close tile on a shore block (60
        texels a block) the same
     L3 PLANTED: VB_SHORE switched off: the close tile has no bed and no ring (L2's tile leg red)
     L4 nothing threw

   Run: node gates/the_lake_has_its_ring_gate.js     (about 4 minutes)
   ============================================================================ */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (name, cond, info) => { if (cond) pass++; else fail++; console.log((cond ? '  ok   ' : '  FAIL ') + name + (info ? '  [' + info + ']' : '')); return cond; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const shoreOk = (sh) => !!sh && sh.shoreBlocks >= 1 && sh.bed > 0 && sh.crack / Math.max(1, sh.bed + sh.crack) >= 0.03 && sh.crack / Math.max(1, sh.bed + sh.crack) <= 0.40 && sh.wet > 0 && sh.ring > 0 && sh.middleBed / Math.max(1, sh.middle) <= 0.20;
const say = (sh) => sh ? sh.lake + ' lake blocks, ' + sh.shoreBlocks + ' on the shore; bed ' + sh.bed + ', cracks ' + sh.crack + ' (' + Math.round(100 * sh.crack / Math.max(1, sh.bed + sh.crack)) + '%), waterline ' + sh.wet + ', ring ' + sh.ring + ', hulls ' + sh.hull + ' texels; middles a bed ' + sh.middleBed + ' of ' + sh.middle : 'no count';

(async () => {
  for (const [prof, alpha] of [['phone_portrait', false], ['phone_landscape', true]]) {
    let d; const errs = [];
    try { d = await open(Object.assign({ keepCards: true, profile: prof }, alpha ? { alpha: true } : {})); } catch (e) { ok('the page boots, ' + prof + ' [' + String(e.message).slice(0, 120) + ']', false); continue; }
    d.page.on('pageerror', (e) => errs.push(String(e).slice(0, 160)));
    const fr = d.fr, where = (alpha ? 'the alpha on its side' : 'the demo upright');
    try {
      for (let i = 0; i < 160; i++) { if (await fr.evaluate(() => !!(window.om && om.n && window.VB_SHORE && typeof vbCityCore === 'function'))) break; await sleep(400); }
      for (let i = 0; i < 20; i++) { const t = await fr.evaluate(() => !!(window.LOOP && LOOP.frame && LOOP.frame.style.display === 'block')).catch(() => false); if (!t && i > 6) break; if (t) await fr.evaluate(() => loopClose()).catch(() => {}); await sleep(400); }
      await fr.evaluate(() => { if (typeof MODE !== 'undefined' && MODE !== 'city') { try { swapMode(); } catch (e) {} } try { travelStop(); } catch (e) {} setZoomAt(1); try { camHold(); } catch (e) {} render(); });
      for (let i = 0; i < 150; i++) { if (await fr.evaluate(() => { render(); return !!(VBC.day && VBC.seed === om.seed && !VBC.busy && VBC.stand); })) break; await sleep(400); }
      if (!alpha) {
        const P = await fr.evaluate(() => { const C = VB_CCOL, lum = (h) => { const c = vbHex(h); return 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]; };
          let src = ''; try { src = String(vbWorker); } catch (e) {}
          return { on: !!(VB_SHORE && VB_SHORE.on), worker: /VB_SHORE/.test(src), have: ['mud', 'crack', 'wet', 'ring', 'hull'].every((k) => !!C[k]),
            ring: lum(C.ring), floor: lum(C.floor), pebble: lum(C.pebble), mud: lum(C.mud), water: lum(C.water), crack: lum(C.crack), wet: lum(C.wet) }; });
        ok('L1 THE TABLE AND THE PALETTE: the shore on and carried into the painters, its five colours apart by value (ring ' + P.ring.toFixed(0) + ' over the ground ' + P.floor.toFixed(0) + ' and pebble ' + P.pebble.toFixed(0) + '; bed ' + P.mud.toFixed(0) + ' over water ' + P.water.toFixed(0) + '; cracks ' + P.crack.toFixed(0) + ' and waterline ' + P.wet.toFixed(0) + ' under the bed)',
          P.on && P.worker && P.have && P.ring > P.floor + 20 && P.ring > P.pebble + 15 && P.mud > P.water + 20 && P.crack < P.mud - 20 && P.wet < P.mud - 20);
      }
      const W = await fr.evaluate(() => VBC.stand && VBC.stand.shore ? JSON.parse(JSON.stringify(VBC.stand.shore)) : null);
      ok('L2 ' + where + ': THE WHOLE PAINTING HAS THE SHORE (its own count): ' + say(W), shoreOk(W));
      const tile = async (off) => fr.evaluate((off) => { const N = om.n; let at = null;
        for (let y = 2; y < N - 2 && !at; y++) for (let x = 2; x < N - 2 && !at; x++) { const t = om.at(x, y); if (!t || !/^(water|reservoir|intake)$/.test(t.district)) continue;
          for (const [a, b] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) { const u = om.at(x + a, y + b); if (u && /desert|mountain|wash|basin/.test(u.district)) { at = [x, y]; break; } } }
        if (!at) return null; const was = VB_SHORE.on; if (off) VB_SHORE.on = false;
        let c = null; try { c = vbCityCore(vbTileInput(Math.floor(at[0] / VB_TILE), Math.floor(at[1] / VB_TILE), 60)); } finally { VB_SHORE.on = was; }
        return { at, sh: c && c.stand ? c.stand.shore : null }; }, off);
      const T1 = await tile(false);
      ok('L2b ' + where + ': A CLOSE TILE ON THE SHORE (' + (T1 ? T1.at.join(',') : '?') + ', 60 texels a block): ' + say(T1 && T1.sh), !!T1 && shoreOk(T1.sh));
      if (!alpha) { const T0 = await tile(true);
        ok('L3 PLANTED FAIL: the shore switched off, the same tile: no bed, no ring (' + say(T0 && T0.sh) + ')', !!T0 && T0.sh && T0.sh.bed === 0 && T0.sh.ring === 0 && !shoreOk(T0.sh)); }
    } catch (e) { ok('the page legs ran, ' + prof + ' [' + String(e && e.message).slice(0, 160) + ']', false); }
    ok('L4 ' + where + ': nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
    try { await d.close(); } catch (_e) {}
  }
  console.log('\nTHE LAKE HAS ITS RING: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
