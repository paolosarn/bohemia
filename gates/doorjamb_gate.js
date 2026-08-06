/* ============================================================================
   DOOR JAMB GATE (8/2/26, hardened 8/3/26)

   Paolo 8/2: "if there is a door i need you to have it stick out slightly on the
   next tile that its supposed to be on... assigned to tile 0 it will have a slight
   appearance in tile -1 or 1."
   Paolo 8/3, on v1: "id dint see the side door."

   His own art: banks/BOHEMIA_DOOR_EW_BANK_7_10_26.txt, 184 doors x {W,E} = 368
   frame-edge strips, 0 of which had ever shipped. Measured on all 184, no variation:
   the W tile is opaque in columns 0..6 and the E tile in columns 37..43 -- a 7px
   jamb for the cell NEXT DOOR, exactly what he described.

   WHY THIS GATE GOT HARDER. v1 passed this gate green and he still could not see
   the door. The old gate counted drawImage calls. A counted draw is not a visible
   door: v1's east jamb was blitted and then buried under the neighbouring wall
   (facadePass walks gx ascending, so the cell to the right draws last), and its
   west jamb landed a whole cell over, 37px of blank wall away from its own door.
   So the browser half no longer counts calls. It renders the door WITH the jambs
   and WITHOUT them and diffs the 7px band on either side of the door cell. If
   those bands do not change, the frame is not on his screen, whatever the call
   counter says. A CONTROL band two cells out must NOT change, so a gate that
   passes because the whole frame moved is caught too.
   ========================================================================== */
'use strict';
const CITY_APP = require('./bohemia_city_app.js');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
const BANK = path.join(ROOT, 'banks/BOHEMIA_DOOR_EW_BANK_7_10_26.txt');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
function pw(){ try{ return require('/opt/node22/lib/node_modules/playwright'); }
  catch(e){ return require('playwright'); } }
/* WHERE the city app lives and WHAT SHAPE it is in are not this gate's business
   (8/4). The payload-wall pass moved it out of the alpha on 8/2 and stopped
   base64-ing it, and this gate reported HIS OWN ART missing from the shipped game
   when it had never left. One resolver knows: gates/bohemia_city_app.js. */
function cityBlob(_a){ const x = require('./bohemia_city_app.js').read(); return x ? x.src : ''; }
/* the SECOND cityBlob was deleted 8/6. It was declared after the resolver one
   above it, and in JavaScript the LAST function declaration wins -- so the
   resolver was dead here exactly as it was in thirteen other gates this
   morning. It read the world file directly, which stopped seeing the art
   banks the moment they were split out. One resolver, and only one. */
(async () => {
  const bank = JSON.parse(fs.readFileSync(BANK, 'utf8'));
  ok('his jamb bank is still there (' + bank.doors.length + ' doors)', bank.doors.length > 100);

  const alpha = fs.readFileSync(ALPHA, 'utf8');
  const city = cityBlob(alpha);
  ok('the alpha carries a readable CITY renderer', city.length > 100000);

  /* BYTES: his strips, in the shipped renderer */
  let hit = 0, tot = 0;
  for (const d of bank.doors.slice(0, 40)) for (const v of d.variants) {
    tot++; if (city.indexOf(v.b64.slice(0, 160)) >= 0) hit++;
  }
  ok('HIS OWN jamb strips are in the renderer, byte for byte (' + hit + '/' + tot + ' sampled)',
     hit === tot && tot > 0);

  const fi = city.indexOf('function jambFlush(');
  const fn = fi < 0 ? '' : city.slice(fi, fi + 900);
  /* his note bans both of these, so the code must do neither */
  ok('the jamb is NEVER mirrored (his note: "never squished/mirrored")', fi >= 0 && !/scale\(-1/.test(fn));
  ok('the jamb blits 1:1 into a cell, never stretched',
     /drawImage\(wi,j\.dx-off,ry,C,C\)/.test(fn) && /drawImage\(ei,j\.dx\+off,ry,C,C\)/.test(fn));
  /* THE v1 BUG, machine-locked: the paint is at the EDGE of its own tile, so the
     offset is the STRIP's width. A whole-cell offset puts it 37px from the door. */
  ok('it is offset by the STRIP width, not a whole cell (the v1 bug)',
     /JAMB_PX\*C\/44/.test(fn) && !/dx-C,ry,C,C/.test(fn));
  ok('the strip width is his locked 7px', /const JAMB_PX=7;/.test(city));
  ok('and on both rows, because the opening is two tiles tall', /for\(let r=0;r<2;r\+\+\)/.test(fn));
  /* THE OTHER v1 BUG: the east jamb was buried by the wall drawn after it. */
  ok('the frame draws AFTER the row\'s walls, so the east side survives',
     /\}\n    \/\* __DOOR_JAMB2__[\s\S]{0,180}\n    jambFlush\(\);\n  \}/.test(city));

  const { chromium } = pw();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto('file://' + ALPHA, { waitUntil: 'load', timeout: 180000 });
    await page.waitForTimeout(3000);
    await page.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
    await page.waitForTimeout(1500);
    /* ONE WORLD TAB LAW: a tab click may NEVER swallow its own failure. A missing
       RUN tab used to mean this gate quietly probed the wrong surface and failed
       thirty seconds later, nowhere near the cause. */
    await page.evaluate(() => { const t = document.querySelector('[data-p="run"]');
      if (!t) throw new Error('THE RUN TAB IS GONE from the alpha tab bar');
      t.click(); });
    let f = null;
    for (let i = 0; i < 20; i++) {
      await page.waitForTimeout(3000);
      /* FIND THE FRAME BY WHAT IT IS, NOT BY HOW IT WAS LOADED (8/4). It was a
         srcdoc frame until the payload-wall pass; it is a sibling src frame now.
         One predicate knows: gates/bohemia_city_app.js. */
      f = page.frames().find(fr => CITY_APP.isFrame(fr, page));
      if (!f) continue;
      const up = await f.evaluate(() => typeof fit === 'function' &&
        document.getElementById('cv').width > 300).catch(() => false);
      if (up) break;
    }
    ok('the world frame booted', !!f);
    if (f) {
      const r = await f.evaluate(() => {
        const out = { loaded: 0, total: 0, jambDraws: 0 };
        if (typeof JAMB_WI === 'undefined') { out.err = 'no jambs in the build'; return out; }
        out.total = JAMB_WI.length;
        for (const im of JAMB_WI) if (im.complete && im.naturalWidth) out.loaded++;
        try { if (MODE !== 'human' && typeof swapMode === 'function') swapMode(); } catch (e) {}
        HC = 44;
        let d = null;
        for (let ly = 2; ly < FN - 2 && !d; ly++) for (let lx = 2; lx < FN - 2 && !d; lx++) {
          const c = cellAt(city.x * FN + lx, city.y * FN + ly);
          if (c && c.face && c.artPool_face === 'hdoor') d = [city.x * FN + lx, city.y * FN + ly];
        }
        if (!d) { out.err = 'no door in the working district'; return out; }
        hx = d[0]; hy = d[1] + 2;
        const cv2 = document.getElementById('cv'), ctx = cv2.getContext('2d');
        const C = HC;
        /* the camera, copied from renderHuman verbatim -- a probe that invents
           its own camera reads the wrong pixels and calls a working door dead */
        const ox = Math.round(cv2.width / 2 - hx * C);
        const oy = Math.round(cv2.height / 2 - hy * C);
        const dx = Math.round(ox + d[0] * C), dy = Math.round(oy + d[1] * C);
        const off = Math.max(1, Math.round(7 * C / 44));
        /* the three bands: outside the door's LEFT edge, outside its RIGHT edge,
           and a control two cells to the right that the frame must never touch */
        const bands = { W: dx - off, E: dx + C, ctrl: dx + 2 * C };
        const y0 = dy - C, h = 2 * C;
        const grab = () => { const s = {}; for (const k in bands)
          s[k] = ctx.getImageData(bands[k], y0, off, h).data.slice(); return s; };
        window.__JAMB_DRAWS = 0;
        render(); const on = grab(); out.jambDraws = window.__JAMB_DRAWS || 0;
        const kw = JAMB_WI.slice(), ke = JAMB_EI.slice();
        JAMB_WI.length = 0; JAMB_EI.length = 0;
        render(); const noJ = grab();
        for (const i of kw) JAMB_WI.push(i); for (const i of ke) JAMB_EI.push(i);
        render();
        for (const k in bands) {
          let diff = 0, px = 0;
          for (let i = 0; i < on[k].length; i += 4) {
            px++;
            if (Math.abs(on[k][i] - noJ[k][i]) + Math.abs(on[k][i + 1] - noJ[k][i + 1]) +
                Math.abs(on[k][i + 2] - noJ[k][i + 2]) + Math.abs(on[k][i + 3] - noJ[k][i + 3]) > 12) diff++;
          }
          out[k] = +(diff / px).toFixed(3);
        }
        out.band = off + 'px x ' + h + 'px';
        return out;
      });
      if (r.err) ok('the door probe found a door to stand at (' + r.err + ')', false);
      ok('his strips are LOADED in the browser (' + r.loaded + '/' + r.total + ')',
         r.total > 0 && r.loaded === r.total);
      ok('jambs are emitted at all (' + r.jambDraws + ' doors framed)', r.jambDraws > 0);
      /* THE REAL TEST, on the surface he looks at: the pixels JUST OUTSIDE the
         door's own tile change when his frame is switched on. */
      ok('THE FRAME IS ON SCREEN, WEST of the door tile (' + Math.round((r.W || 0) * 100)
         + '% of a ' + r.band + ' band changes)', (r.W || 0) > 0.25);
      ok('THE FRAME IS ON SCREEN, EAST of the door tile (' + Math.round((r.E || 0) * 100)
         + '% changes) -- v1 shipped this buried under the next wall', (r.E || 0) > 0.25);
      ok('and it does NOT bleed two cells out (control band ' + Math.round((r.ctrl || 0) * 100)
         + '%, must be ~0)', (r.ctrl || 0) < 0.05);
    }
  } finally { await browser.close(); }
  console.log('DOOR JAMB GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('DOOR JAMB GATE CRASHED: ' + e.message); process.exit(1); });
