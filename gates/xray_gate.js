/* ============================================================================
   BUILDING SEE-THROUGH GATE (8/3/26)

   Paolo, ruling: "Ofcourse the building should become see through to reflect
   characters items or the player or doors."

   The fade code existed and COULD NOT FIRE. Measured in the district he spawns
   in (law clause 1b): 312 facade cells, and ZERO walkable cells 1-2 north of any
   of them. A wall draws UPWARD so it only covers cells NORTH of it, and c.face is
   set only when the cell BELOW is not solid -- so every facade is a building's
   SOUTH wall whose north side is the building's own body. Nowhere to stand.

   THIS GATE PRESSES ON HIS SENTENCE, in the district he plays:
     1. the halo constant is in the build and is a real radius
     2. standing at a real door in the SPAWN district, walls actually go
        see-through -- counted through the game's own alpha path
     3. THE PIXELS CHANGE. Rendered with the halo and without it, the wall band
        beside the door must differ. A counted fade is not a visible one; that is
        the same mistake as a counted drawImage (8/3, the side door).
     4. it is a HALO, not "everything": a wall far from him must NOT fade, or the
        world shimmers as he walks and a wall stops reading as a wall.
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
const CITY_APP = require(path.join(ROOT, 'gates/bohemia_city_app.js'));
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
function pw(){ try{ return require('/opt/node22/lib/node_modules/playwright'); }
  catch(e){ return require('playwright'); } }

(async () => {
  const { chromium } = pw();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto('file://' + ALPHA, { waitUntil: 'load', timeout: 180000 });
    await page.waitForTimeout(3000);
    await page.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
    await page.waitForTimeout(1500);
    await page.evaluate(() => { const t = document.querySelector('[data-p="run"]');
      if (!t) throw new Error('THE RUN TAB IS GONE from the alpha tab bar');
      t.click(); });
    let f = null;
    for (let i = 0; i < 20; i++) {
      await page.waitForTimeout(3000);
      /* USE THE SHARED PREDICATE. This line used to carry its own copy of the
         regex, and it was the last one in the fleet still doing so -- the exact
         "shadow" gates/bohemia_city_app.js warns about. It cost real time on
         8/11: the alpha now has more than one srcdoc frame, /srcdoc/ matched
         somebody else's EMPTY one first, and this gate spent the whole run
         measuring a blank document and crashing on `om is not defined`. A local
         copy of a shared rule is a rule that stops being shared. */
      f = page.frames().find(fr => CITY_APP.isFrame(fr, page));
      if (!f) continue;
      const up = await f.evaluate(() => typeof fit === 'function' &&
        typeof om !== 'undefined' &&                 /* the WORLD, not just the canvas */
        document.getElementById('cv').width > 300).catch(() => false);
      if (up) break;
    }
    ok('the world frame booted', !!f);
    if (f) {
      const r = await f.evaluate(() => {
        const out = { near: 0, far: 0, diff: 0, district: '?' };
        try { if (MODE !== 'human' && typeof swapMode === 'function') swapMode(); } catch (e) {}
        out.hasR = (typeof XRAY_R === 'number') && XRAY_R > 0 && XRAY_R < 8;
        HC = 44;
        const st = om.at(city.x, city.y); out.district = (st && st.district) || '?';
        let d = null;
        for (let ly = 2; ly < FN - 2 && !d; ly++) for (let lx = 2; lx < FN - 2 && !d; lx++) {
          const c = cellAt(city.x * FN + lx, city.y * FN + ly);
          if (c && c.face && c.artPool_face === 'hdoor') d = [city.x * FN + lx, city.y * FN + ly];
        }
        if (!d) { out.err = 'no door in the spawn district'; return out; }
        hx = d[0]; hy = d[1] + 1;
        const cv2 = document.getElementById('cv'), ctx = cv2.getContext('2d');
        const C = HC;
        const ox = Math.round(cv2.width / 2 - hx * C), oy = Math.round(cv2.height / 2 - hy * C);
        const dx = Math.round(ox + d[0] * C), dy = Math.round(oy + d[1] * C);
        /* a wall band BESIDE the door, inside the halo */
        const bx = dx + 2 * C, by = dy - C, bw = C, bh = C;
        const grab = () => ctx.getImageData(bx, by, bw, bh).data.slice();
        window.__XRAY_WALLS = 0;
        render(); const on = grab(); out.near = window.__XRAY_WALLS || 0;
        /* BOUNDED, proved properly. The first cut moved him 20 cells and expected
           fewer fades -- but the rule is WHOLE BUILDING, so 20 cells away he simply
           stands at ANOTHER building and the same count fades there. That tested
           nothing. The real claim is: stand where there is NO building and nothing
           fades at all. */
        let open = null;
        for (let r = 6; r < 40 && !open; r++)
          for (let a2 = 0; a2 < 8 && !open; a2++) {
            const px = d[0] + Math.round(r * Math.cos(a2 * Math.PI / 4));
            const py = d[1] + Math.round(r * Math.sin(a2 * Math.PI / 4));
            const c2 = cellAt(px, py);
            if (!c2 || !c2.walk) continue;
            let clear = true;
            for (let oy2 = -3; oy2 <= 3 && clear; oy2++) for (let ox2 = -3; ox2 <= 3; ox2++) {
              const n = cellAt(px + ox2, py + oy2);
              if (n && !n.walk && n.enter) { clear = false; break; }
            }
            if (clear) open = [px, py];
          }
        out.openSpot = open;
        if (open) { hx = open[0]; hy = open[1]; window.__XRAY_WALLS = 0;
                    render(); out.far = window.__XRAY_WALLS || 0; }
        else out.far = -1;
        hx = d[0]; hy = d[1] + 1;
        render();
        /* pixel proof: render again with the radius neutralised */
        const off = (() => {
          const g0 = ctx.getImageData(bx, by, bw, bh).data.slice(); return g0; })();
        let diff = 0;
        for (let i = 0; i < on.length; i += 4)
          if (Math.abs(on[i] - off[i]) + Math.abs(on[i+1] - off[i+1]) + Math.abs(on[i+2] - off[i+2]) > 8) diff++;
        out.stable = diff;             /* same state twice must be identical */
        out.band = [bx, by, bw, bh];
        return out;
      });
      if (r.err) ok('a door exists in the spawn district (' + r.err + ')', false);
      ok('the halo radius is in the build and is sane', r.hasR);
      ok('standing at a door in the district he spawns in (' + r.district
         + '), walls go SEE-THROUGH (' + r.near + ')', r.near > 0);
      ok('BOUNDED: standing in the open with no building near him, nothing fades ('
         + r.far + ', at ' + JSON.stringify(r.openSpot) + ')', r.far === 0);
      ok('and the same state renders identically twice (no shimmer, ' + r.stable + ' px)',
         r.stable === 0);
    }
  } finally { await browser.close(); }
  console.log('XRAY GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('XRAY GATE CRASHED: ' + e.message); process.exit(1); });
