/* BOHEMIA -- EYES AND EARS: CAN YOU FIND THE ENEMY (lane 17, E10, 9/5/26)
 *
 * THE JOB (VAMILY E10): a standing machine that opens a real frame from the shipped
 * game, finds every hostile in it, and answers one question honestly -- COULD A COLD
 * PLAYER FIND THIS BODY IN ONE GLANCE? Measure the value gap to its neighbours,
 * whether it is moving toward the player, and whether it survives greyscale.
 *
 * HOW IT FINDS THE BODIES, and why it is not a second answer to where they are.
 * The city draws hostiles in hostilePass(). This does NOT re-derive their positions
 * -- a second placement is how two things that should agree drift apart, and this repo
 * has paid for that four times. Instead the canvas itself is asked: drawImage is
 * wrapped for the duration of ONE hostilePass, so every rectangle it records is a
 * body the game actually blitted, at the pixel it actually blitted it to.
 *
 * WHAT IT MEASURES, per body, on the finished picture:
 *   VALUE GAP     the body's median luminance against the ring of ground around it.
 *                 This is the squint test as a number: at a glance, a player finds a
 *                 body by VALUE long before colour.
 *   GREYSCALE     the same gap with colour thrown away. A body that only separates in
 *                 hue disappears for a colour-blind player and in a dark room.
 *   COMING AT YOU the crew's own state from the module (watching, closing) -- the
 *                 approach is the tell, so a body that is coming is easier to find
 *                 than the same body standing still.
 *
 * IT NEVER JUDGES TASTE. It says whether a body can be FOUND, not whether it looks good.
 *
 * USAGE:  node tools/bohemia_eyes_find_the_enemy.js [--port 8099] [--json OUT.json]
 */
'use strict';
const fs = require('fs');
const path = require('path');
const args = process.argv.slice(2);
const arg = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const PORT = arg('--port', '8099');
const OUT = arg('--json', null);

function pw() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
    '/usr/local/lib/node_modules']) {
    try { return require(require('path').join(g, 'playwright')); } catch (e) { }
  }
  return require('playwright');
}
const { chromium } = pw();
const PHONE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext(PHONE);
  const p = await ctx.newPage();
  await p.goto(`http://127.0.0.1:${PORT}/slices/BOHEMIA_ALPHA_0_9.html`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2500);
  await p.locator('#front').click({ timeout: 30000 });
  await p.waitForTimeout(9000);
  for (const label of ['GET UP', 'NOT NOW']) {
    for (const f of p.frames()) {
      try { const el = await f.getByText(label, { exact: false }).first(); await el.click({ timeout: 1500 }); await p.waitForTimeout(800); } catch (_e) { }
    }
  }
  await p.waitForTimeout(2000);
  const city = p.frames().find(f => /CITY_WORLD/.test(f.url()));
  if (!city) { console.log('the city frame never opened'); await b.close(); return; }

  /* WHO IS OUT THERE AT ALL, and which way is the nearest of them. The module's own
     answer, never a second one of mine. */
  const aim = await city.evaluate(() => {
    const d = (typeof hostDanger === 'function') ? hostDanger() : [];
    let crews = [];
    try {
      crews = BohemiaHostiles.near({ seed: (typeof seed !== 'undefined' ? seed : 0), at: [hx, hy],
        radius: 40, probe: hostileProbe, danger: d, density: HOST_DENSITY, day: (typeof T !== 'undefined' ? (T.day | 0) : 1) })
        .map(c => ({ at: c.at, count: c.count }));
    } catch (_e) { }
    return { danger: d.map(x => x.id || x), me: [hx, hy], crews,
             pads: [...document.querySelectorAll('.pb')].map(e => (e.textContent || '').trim()) };
  });
  console.log('factions at odds with him: ' + (aim.danger.join(', ') || 'NONE'));
  console.log('he stands at ' + JSON.stringify(aim.me) + '; crews within 40 cells: ' + aim.crews.length);
  if (!aim.crews.length) {
    console.log('\nNOBODY IS OUT THERE. That is the answer for this save, and it is a finding, not a failure.');
    await b.close(); return;
  }

  /* INSTRUMENT FIRST, THEN WALK. Wrap the pass so the game keeps calling it -- calling
     it myself with a made-up camera returned 0 while the real loop drew 4. Every rect
     is carried through the canvas transform, because the city draws through a camera. */
  await city.evaluate(() => {
    const cvEl = document.getElementById('cv'); const g = cvEl.getContext('2d');
    window.__REC = false; window.__RECTS = [];
    if (!g.drawImage.__w) {
      const real = g.drawImage;
      const w = function (img, ...a) {
        if (window.__REC) {
          let r = null;
          if (a.length >= 8) r = { x: a[4], y: a[5], w: a[6], h: a[7] };
          else if (a.length >= 4) r = { x: a[0], y: a[1], w: a[2], h: a[3] };
          if (r && r.w > 4 && r.h > 8) {
            let m = null; try { m = this.getTransform(); } catch (_e) { }
            const t = m ? { x: m.a * r.x + m.c * r.y + m.e, y: m.b * r.x + m.d * r.y + m.f, w: r.w * m.a, h: r.h * m.d } : r;
            /* ONLY WHAT LANDED ON THE GLASS. Measured 9/5: in one frame this renderer
               issues 46 blits and only 11 are inside the canvas -- a tiled world draws a
               margin and lets the clip throw it away. A rect outside the canvas is not a
               body a player could have found; it is a body the clip ate. */
            /* FULLY INSIDE, not merely overlapping. A body hanging off the top edge
               gets its crop clamped to the glass, and then the measurement is of the
               top bar and a sliver of shoulder -- the first run of this reported
               "3 of 4 found" off exactly that, with the bodies 55 to 101 px above the
               canvas. A body a player can find is a body a player can SEE. */
            const edge = 4;
            if (t.x >= -edge && t.y >= -edge && t.x + t.w <= cvEl.width + edge && t.y + t.h <= cvEl.height + edge)
              window.__RECTS.push(t);
          }
        }
        return real.apply(this, [img, ...a]);
      };
      w.__w = true; g.drawImage = w;
    }
    if (typeof hostilePass === 'function' && !hostilePass.__w) {
      const realP = hostilePass;
      const w2 = function () { window.__REC = true; window.__RECTS = [];
        try { return realP.apply(this, arguments); } finally { window.__REC = false; } };
      w2.__w = true; window.hostilePass = w2;
    }
  });

  /* WALK TOWARD THE NEAREST CREW UNTIL ONE IS ON THE GLASS. */
  const t = aim.crews[0].at, dx = t[0] - aim.me[0], dy = t[1] - aim.me[1];
  const glyph = (dy < 0 ? (dx > 0 ? '↗' : (dx < 0 ? '↖' : '↑')) : (dy > 0 ? (dx > 0 ? '↘' : (dx < 0 ? '↙' : '↓')) : (dx > 0 ? '→' : '←')));
  let idx = aim.pads.indexOf(glyph); if (idx < 0) idx = 0;
  const pads = await city.$$('.pb');
  console.log('walking ' + glyph + ' toward ' + JSON.stringify(t));
  let onGlass = [], steps = 0;
  for (let i = 0; i < 220 && !onGlass.length; i++) {
    try { await pads[idx].click({ timeout: 800 }); } catch (_e) { }
    await p.waitForTimeout(110); steps++;
    if (i % 10 === 9) {
      onGlass = await city.evaluate(() => window.__RECTS || []);
      if (onGlass.length) break;
    }
  }
  const state = await city.evaluate(() => ({
    drawn: window.__HOST_DRAWN || 0,
    crews: (typeof HOST_DREW !== 'undefined' ? HOST_DREW : []).map(c => ({ at: c.at, count: c.count, state: c.state || null })),
    canvas: (() => { const e = document.getElementById('cv'); const r = e.getBoundingClientRect();
      return { left: r.left, top: r.top, w: e.width, h: e.height }; })()
  }));
  const shotPath = path.join(require('os').tmpdir(), 'eyes-enemy-' + process.pid + '.png');
  await p.screenshot({ path: shotPath });
  const fb = await (await city.frameElement()).boundingBox();
  await b.close();

  console.log('after ' + steps + ' steps: the game says it drew ' + state.drawn + ' bodies; '
    + onGlass.length + ' of them landed ON THE GLASS');
  if (state.crews.length) console.log('   crew states: ' + state.crews.map(c => c.state || '?').join(', '));
  if (!onGlass.length) {
    console.log('\nNO BODY REACHED THE GLASS IN ' + steps + ' STEPS. This tool reports that and stops;');
    console.log('a body the clip ate is not a body a player failed to find, and the difference matters.');
  }
  const out = { danger: aim.danger, me: aim.me, crews: aim.crews, steps,
                drawn: state.drawn, onGlass, canvas: state.canvas, frame: fb, shot: shotPath };
  if (OUT) { fs.writeFileSync(OUT, JSON.stringify(out, null, 1)); console.log('\nwrote ' + OUT); }
  console.log('picture: ' + shotPath);
  if (onGlass.length) console.log('measure it with:  python3 tools/bohemia_eyes_find_the_enemy.py ' + (OUT || '<json>'));
})().catch(e => { console.error(e); process.exit(1); });
