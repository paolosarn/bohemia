#!/usr/bin/env node
/* ============================================================================
   THE PERSON IS 112 -- RULE 21'S FIGHT LEG
   (9/21/26, COMBAT lane, VAMILY [fight looks])

   RULE 21 (coordinator 9/21, from four lanes' measurements): "A person is drawn at
   ONE pixel size on every surface he walks or fights on (112 box, about 100 px
   painted) and the camera moves the ground, never his size... Gate on the street
   body_scale 14/0; THE FIGHT LEG OWED TO COMBAT [fight looks]."

   This is that leg. It opens a real fight, started the way he starts one, on the
   workshop and on the cut he opens, and asks five things that can each fail alone:

     1. THE FIGHTER IS 112.            Not 37, which is what FIELD_ZOOM 3 made of him.
     2. AND THE LOT CAME WITH HIM.     TILE_WIDE is declared "a house tile in SPRITE
                                       WIDTHS -- his number", 1.75, so a 112 sprite
                                       means a 196 px lot. One division was shrinking
                                       the person AND the house; both come back or
                                       neither does.
     3. WHICH IS HALF A LOT TALL.      Rule 16's own default, arrived at rather than
                                       typed: 112/196 = 0.57.
     4. THE BODY BOARD DID NOT MOVE.   houseOn() off and the old value runs, so the
                                       body-scale board is byte-identical.
     5. THE GROUND IS THE ART HE APPROVED. COOK db792724's bank is the one that
                                       loaded: the kinds whose pictures it RAISED
                                       (kerbL and kerbR 1 -> 8, gutterL and gutterR
                                       1 -> 4) are the proof, because the old bank
                                       cannot produce those counts, and the 2x set
                                       a marking comes up from is there.

   AND THE CHROME: the street draws no grid and the fight drew two. Neither is on his
   screen now, and the one he could see is behind a dial rather than deleted.
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const http = require('http');
const { execFileSync } = require('child_process');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.join(__dirname, '..');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const CUT = path.join(process.env.TMPDIR || '/tmp', 'bohemia_person_112_cut.html');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json',
  '.css': 'text/css', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };

function serve() {
  return new Promise(res => {
    const srv = http.createServer((rq, rp) => {
      const u = decodeURIComponent((rq.url || '/').split('?')[0]);
      let f = /BOHEMIA_DEMO\.html$/.test(u) ? CUT : path.join(REPO, u);
      if (!f.startsWith(REPO) && f !== CUT) { rp.writeHead(404); return rp.end('no'); }
      if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { rp.writeHead(404); return rp.end('no'); }
      rp.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
      fs.createReadStream(f).pipe(rp);
    });
    srv.listen(0, '127.0.0.1', () => res(srv));
  });
}
let pass = 0, fail = 0;
const ok = (n, c) => { c ? (pass++, console.log('  PASS ' + n)) : (fail++, console.log('  FAIL ' + n)); };

/* the cut-only facts V221 paid for: the demo's frames have NO NAME, more than one
   frame answers the city's URL and only one is alive, an eager poller starves the
   boot, and the city frame does not exist for the first half minute. */
async function liveCity(page) {
  for (let i = 0; i < 60; i++) {
    for (const f of page.frames()) {
      let u = ''; try { u = f.url(); } catch (e) {}
      if (!/BOHEMIA_CITY_WORLD\.html/.test(u)) continue;
      let a = null;
      try { a = await f.evaluate(() => ({ tap: typeof streetTapFoe, host: typeof BohemiaHostiles,
        dang: typeof hostDanger, hook: !!(window.__CITY && window.__CITY.human) })); } catch (e) {}
      if (a && a.tap === 'function' && a.host === 'object' && a.dang === 'function' && a.hook) return f;
    }
    await sleep(2000);
  }
  return null;
}
/* *** V221 FACT 2, AND IT BIT THIS GATE ON ITS OWN MUTATION RUN. *** Asking only for
   G and #fire finds a frame whose BOARD CANVAS IS 0x0 and never sized, and every CSS
   number then comes back k=0, NaN, Infinity -- which reds the gate for a reason that
   has nothing to do with what it is testing. A mutation proof that goes red on a dead
   canvas proves nothing at all. THE LIVE FIGHT IS THE ONE WITH A BOARD THAT HAS A BOX. */
async function liveFight(page) {
  /* THIRD CUT, AND THE TWO BEFORE IT BOTH FAILED THE MUTATION RUN IN DIFFERENT
     DIRECTIONS -- which is the whole reason this helper is written out rather than
     guessed. Too loose (G and #fire alone) and it takes a DEAD frame whose board is
     0x0, and every CSS number comes back k=0, NaN, Infinity: red for a reason that has
     nothing to do with the test. Too strict (a board with pixels AND a box) and it
     finds NO fight at all on main, where the board can be slower to size: red again,
     and this time it hides the very numbers the mutation exists to show.
     SO IT PREFERS A BOARD WITH PIXELS AND FALLS BACK TO WHATEVER ANSWERS, because a
     gate that cannot find the thing reports nothing, and reporting nothing is the one
     outcome that teaches nobody anything. */
  let loose = null;
  for (let i = 0; i < 40; i++) {
    for (const f of page.frames()) {
      let has = false;
      /* AND THE FIRST CUT OF THIS WAS TOO STRICT, which the mutation run caught the
         other way: requiring a CLIENT BOX as well as a backing size found NO fight at
         all on main, where the canvas can have pixels while its box is momentarily 0.
         The frame finder asks only what separates the live frame from the dead one --
         A BOARD WITH PIXELS -- and the box is waited for separately, below. */
      try { has = await f.evaluate(() => { const c = document.getElementById('cv');
        return typeof G !== 'undefined' && !!document.getElementById('fire')
          && !!c && c.width > 0; }); } catch (e) {}
      if (has) return f;
      if (!loose) { try { if (await f.evaluate(() => typeof G !== 'undefined'
        && !!document.getElementById('fire'))) loose = f; } catch (e) {} }
    }
    await sleep(700);
  }
  return loose;
}

/* READ WHAT IS THERE, NEVER CRASH ON WHAT IS NOT: mutation-proved against a tree with
   none of this in it, where a bare call throws ReferenceError and kills the run. A
   gate that dies cannot tell you which way it failed. */
const READ = `(() => {
  const g = (n) => { try { return eval(n + '()'); } catch (e) { return null; } };
  const out = { house: g('houseOn'), bodyScale: g('bodyScale') };
  out.bodyPx = (out.bodyScale == null) ? null : Math.round(112 * out.bodyScale);
  try { const c = document.getElementById('cv');
    out.tilePx = Math.min(c.width, c.height) * fieldPitch(c.width, c.height);
    out.cvW = c.width; out.cssW = Math.round(c.getBoundingClientRect().width); } catch (e) {}
  try { out.tileWide = (G.tileWide || TILE_WIDE); } catch (e) {}
  try { out.counts = {}; for (const k in STREET_IMG) out.counts[k] = STREET_IMG[k].length; } catch (e) {}
  try { out.twoX = Object.keys(STREET_IMG2X).length; } catch (e) { out.twoX = null; }
  try { out.ready = STREET_READY; } catch (e) {}
  try { out.grid = !!G.cellGrid; } catch (e) {}
  /* THE GLASS, WHICH IS WHERE THE LAST SIZE LIE WAS. The walked world sizes its canvas
     1:1 with CSS; the fight doubled it on a phone, so the same 112 box was 112 CSS on
     the street and 56 here. k is the canvas's backing pixels per CSS pixel. */
  try { const c = document.getElementById('cv');
    const r = c.getBoundingClientRect();
    out.k = +(c.width / Math.max(1, r.width)).toFixed(3);
    out.bodyCSS = +(out.bodyPx / out.k).toFixed(1);
    out.tileCSS = +(out.tilePx / out.k).toFixed(1); } catch (e) {}
  return out;
})()`;

/* *** THE LIVE FIGHT IS THE ONE THAT IS DRAWING, AND THAT IS THE FIFTH DISCRIMINATOR
   THIS ROUND AND THE FIRST HONEST ONE. *** V221 wrote down that more than one frame
   answers and only one is alive; the fight frame is the same. Everything tried before
   this asked about STATE and every one of them could be true of a frame that renders
   nothing: G and #fire alone takes a frame whose board is 0x0; a board with pixels
   takes a PRE-CREATED fight that is sized, carries every constant, computes a correct
   197 px tile -- and paints nothing, which is exactly how this gate came to report
   zero patches and zero marking kinds while a real fight had 24 patches and 52 tiles
   cached on the same tree.
   So it asks the only question that cannot be faked: DOES THIS FRAME PUT PIXELS ON ITS
   BOARD. It watches drawImage for a moment and takes the frame that used it. */
async function drawingFight(page, sleep) {
  for (let i = 0; i < 30; i++) {
    for (const f of page.frames()) {
      let n = 0;
      try {
        n = await f.evaluate(async () => {
          /* *** AND THIS HELPER'S FIRST CUT PICKED THE ALPHA SHELL. *** Measured, not
             guessed: it reported frames "top", a canvas of 183x54 and STREET_READY
             absent -- the SPLASH LOGO, the same canvas that fooled combat_scale_gate
             earlier in this round. The shell defines a G, owns a #cv and animates, so
             "is it drawing" is true of it. A fight is a CHILD FRAME and it has a FIRE
             BUTTON; the shell has neither. */
          if (window.parent === window) return 0;
          if (!document.getElementById('fire')) return 0;
          const c = document.getElementById('cv');
          if (typeof G === 'undefined' || !c || !c.width) return 0;
          const x = c.getContext('2d'); if (!x) return 0;
          const orig = x.drawImage.bind(x); let hits = 0;
          x.drawImage = function () { hits++; return orig.apply(null, arguments); };
          await new Promise(r => setTimeout(r, 320));
          x.drawImage = orig; return hits;
        });
      } catch (e) {}
      if (n > 0) return f;
    }
    await sleep(600);
  }
  return null;
}

async function walkAndCheck(browser, BASE, where, url) {
  console.log('\n--- ' + where + ' ---');
  /* THE PHONE PROFILE body_scale_gate MEASURES THE STREET ON (390x844, ratio 3,
     mobile), because the coordinator's 9/23 note asks for the fighter in CSS px "same
     as body_scale_gate measures the street" and a claim about two surfaces has to be
     taken in one unit on one screen. */
  const page = await browser.newPage({ viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  page.on('pageerror', () => {});
  await page.goto(BASE + url, { waitUntil: 'load', timeout: 120000 });
  await sleep(6000);
  await page.mouse.click(215, 450); await sleep(3000); await page.mouse.click(215, 450);
  await sleep(20000);

  const city = await liveCity(page);
  if (!city) { ok(where + ': the walked city came up', false); await page.close(); return; }

  const cbox = await (await city.frameElement()).boundingBox();
  for (let i = 0; i < 8; i++) {
    let hit = false;
    for (const sel of ['.dcgo[data-act="go"]', '[data-act="close"]', '.dcgo']) {
      const h = await city.$(sel).catch(() => null);
      if (h && await h.isVisible().catch(() => false)) {
        const b = await h.boundingBox();
        if (b) { await page.mouse.click(cbox.x + b.x + b.width / 2, cbox.y + b.y + b.height / 2); hit = true; break; }
      }
    }
    await sleep(hit ? 1200 : 700);
    const clear = await city.evaluate(() => { const c = document.querySelector('canvas'); if (!c) return false;
      const b = c.getBoundingClientRect();
      const el = document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2);
      return !!el && el.tagName === 'CANVAS'; }).catch(() => true);
    if (clear) break;
  }
  await page.evaluate(() => { const n = document.getElementById('openNot'), inv = document.getElementById('openInvite');
    if (inv && getComputedStyle(inv).display !== 'none' && n) n.click(); });

  /* THE STREET'S OWN NUMBER, READ IN THE SAME SESSION, because rule 21 is a claim
     about TWO surfaces and half a comparison proves nothing. */
  const walk = await city.evaluate(() => {
    const h = (HOST_HIT || [])[0], r = cv.getBoundingClientRect();
    const k = cv.width / Math.max(1, r.width);
    return h ? { box: h.w, k: +k.toFixed(3), css: +(h.w / k).toFixed(1) } : null; });
  const walkBody = walk && walk.box;
  ok(where + ': the walked street draws its person at the 112 box (' + walkBody + ')',
     walkBody === 112);
  ok(where + ': and the walked canvas is 1:1 with CSS, so that box is ' +
     (walk && walk.css) + ' CSS px', !!walk && walk.k === 1 && walk.css === 112);

  /* a real fight, started the way he starts one: walk up to a crew and tap one */
  await sleep(1500);
  const fb = await (await city.frameElement()).boundingBox();
  let aim = null;
  for (let i = 0; i < 20 && !aim; i++) {
    aim = await city.evaluate(() => {
      const r = cv.getBoundingClientRect();
      for (const h of (HOST_HIT || [])) for (const f of [0.5, 0.62, 0.74]) {
        const cx = h.x + h.w / 2, cy = h.y + h.h * f;
        if (!streetTapFoe(cx, cy)) continue;
        const el = document.elementFromPoint(r.left + cx * r.width / cv.width, r.top + cy * r.height / cv.height);
        if (!el || el.tagName !== 'CANVAS') continue;
        return { x: r.left + cx * r.width / cv.width, y: r.top + cy * r.height / cv.height };
      }
      return null;
    });
    if (!aim) {
      await city.evaluate(() => { try {
        const list = BohemiaHostiles.near({ x: hx, y: hy, radius: 90, probe: hostileProbe,
          danger: hostDanger(), density: HOST_DENSITY, day: (T.day | 0) });
        const c = list.map(x => ({ at: x.at, d: Math.max(Math.abs(x.at[0] - hx), Math.abs(x.at[1] - hy)) }))
          .sort((a, b) => a.d - b.d)[0];
        if (c) window.__CITY.human(c.at[0], c.at[1] + 5); } catch (e) {} });
      await sleep(1500);
    }
  }
  if (!aim) { ok(where + ': a hostile body on the glass to tap', false); await page.close(); return; }
  await page.mouse.click(fb.x + aim.x, fb.y + aim.y);
  await sleep(9000);
  const cf = (await drawingFight(page, sleep)) || (await liveFight(page));
  if (!cf) { ok(where + ': the fight came up', false); await page.close(); return; }
  ok(where + ': a real fight, started the way he starts one', true);
  await sleep(2500);
  /* the board can carry pixels before it carries a box, and every CSS number divides
     by that box -- so wait for it rather than dividing by zero and reporting Infinity. */
  for (let i = 0; i < 40; i++) {
    const boxed = await cf.evaluate(() => { const c = document.getElementById('cv');
      return !!c && c.getBoundingClientRect().width > 0; }).catch(() => false);
    if (boxed) break;
    await sleep(500);
  }

  const A = await cf.evaluate(READ);
  ok(where + ': the board a fight starts on IS the house board', A.house === true);
  ok(where + ': *** THE FIGHTER IS THE 112 BOX, NOT A THIRD OF HIMSELF *** (' +
     A.bodyPx + ' px)', A.bodyPx === 112);
  /* AND THE LOT CAME WITH HIM. TILE_WIDE is "a house tile in SPRITE WIDTHS -- his
     number", so the lot is derived from the body and cannot be set on its own. */
  const want = Math.round((A.tileWide || 0) * 112);
  ok(where + ': and the lot is ' + (A.tileWide) + ' sprite widths, which is his dial (' +
     Math.round(A.tilePx) + ' px, wanted ' + want + ')',
     want > 0 && Math.abs(A.tilePx - want) <= 1);
  /* SAID PLAINLY: THIS ARM IS A RELATIONSHIP, NOT A SIZE. It is 0.57 on the old tree
     too, because the body and the lot were BOTH divided by three -- which is exactly
     why the two arms above it exist. It guards the thing those two cannot: that
     nobody ever moves one without the other. */
  const lots = A.tilePx ? A.bodyPx / A.tilePx : 0;
  ok(where + ': and the body and the lot still move together, about half a lot tall (' +
     lots.toFixed(2) + ')', lots > 0.45 && lots < 0.70);

  /* THE GROUND IS THE ART HE APPROVED. The raised counts are the proof: the old bank
     had ONE picture for each of these and tiled it identically down the whole frame,
     so it cannot produce eight. */
  const c = A.counts || {};
  ok(where + ': the ground is COOK\'s cooked bank, not the pre-recook one (kerbL ' +
     c.kerbL + ', kerbR ' + c.kerbR + ', gutterL ' + c.gutterL + ', gutterR ' + c.gutterR + ')',
     c.kerbL === 8 && c.kerbR === 8 && c.gutterL === 4 && c.gutterR === 4);
  ok(where + ': and the 2x art a marking comes up from is loaded (' + A.twoX + ' kinds)',
     A.twoX === 13);
  ok(where + ': the ground finished decoding', A.ready === true);
  /* *** AND THE GRID ARM I FIRST WROTE WAS A LIE, CAUGHT BY THE MUTATION RUN. *** It
     read G.cellGrid and called false a pass -- but G.cellGrid is undefined on the OLD
     tree too, where the grid is drawn unconditionally, so it passed on a tree that
     draws the thing it claims is gone. A check that cannot go red is not a check.
     THIS ONE COUNTS THE STROKES the floor actually makes during one rebuild. */
  /* AND THE FIRST VERSION OF *THIS* OVER-COUNTED, which is the same lesson twice in
     one gate: it wrapped every context and read 392 strokes with the grid already
     gone, because a second of frames also draws the reach diamonds, the rings and
     the aim line. THE FLOOR PAINTS INTO ITS OWN CACHE CANVAS (__FLOOR_CACHE__), so
     the count is taken THERE and nowhere else. */
  const strokes = await cf.evaluate(`(async () => {
    const P = CanvasRenderingContext2D.prototype, orig = P.stroke; let n = 0;
    P.stroke = function () { try { if (this.canvas === _FLC) n++; } catch (e) {}
      return orig.apply(this, arguments); };
    _FLK = null; await new Promise(r => setTimeout(r, 1100));
    P.stroke = orig; return n; })()`);
  ok(where + ': the street draws no grid and the fight strokes none into its floor (' +
     strokes + ')', strokes === 0);
  ok(where + ': and it is behind a dial, not deleted', A.grid === false);

  /* *** THE COORDINATOR'S 9/23 GATE: THE FIGHTER IN CSS PIXELS, ON THE PHONE. ***
     "the last size lie is the glass: 112 CSS px on the street against 56 in the fight
     at the same body constant, device pixel ratio... [fight feel] does not start until
     it reads 112." The 112-box arm above CANNOT see this: the box was 112 before and
     after, and the lie was in the canvas. */
  ok(where + ': *** THE FIGHTER IS 112 CSS PIXELS ON THE PHONE, THE SAME AS THE STREET *** (' +
     A.bodyCSS + ' CSS, was 56)', A.bodyCSS === 112);
  ok(where + ': because the fight sizes its canvas the way the street does, 1:1 with CSS (k=' +
     A.k + ')', A.k === 1);
  ok(where + ': and the lot came with it, so he still stands about half a lot (' +
     A.tileCSS + ' CSS lot)', Math.abs(A.tileCSS - 196) <= 1);

  /* THE BODY BOARD DID NOT MOVE. */
  const B = await cf.evaluate(`(() => { G.houseTile = false; const r = ${READ}; G.houseTile = undefined; return r; })()`);
  ok(where + ': with the house board off, the old body size is back, byte for byte (' +
     B.bodyPx + ' px)', B.bodyPx === 37 && B.house === false);

  await page.close();
}

(async () => {
  console.log('building a fresh cut from the current workshop (never touches the committed demo)');
  execFileSync('node', [path.join(REPO, 'tools', 'bohemia_cut_the_demo.js'), '--out', CUT],
    { stdio: 'pipe' });
  const srv = await serve();
  const BASE = 'http://127.0.0.1:' + srv.address().port;
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  try {
    await walkAndCheck(browser, BASE, 'THE WORKSHOP', '/slices/BOHEMIA_ALPHA_0_9.html');
    await walkAndCheck(browser, BASE, 'THE CUT HE OPENS', '/slices/BOHEMIA_DEMO.html');
  } finally {
    await browser.close(); srv.close();
    try { fs.unlinkSync(CUT); } catch (e) {}
  }
  console.log('\n=== THE PERSON IS 112 GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})().catch(e => {
  console.log('  FAIL the gate could not finish: ' + String(e).slice(0, 200));
  try { fs.unlinkSync(CUT); } catch (_e) {}
  console.log('\n=== THE PERSON IS 112 GATE: ' + pass + ' passed, ' + (fail + 1) + ' failed ===');
  process.exit(1);
});
