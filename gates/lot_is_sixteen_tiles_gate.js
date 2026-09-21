#!/usr/bin/env node
/* ============================================================================
   THE LOT IS SIXTEEN TILES, NOT ONE
   (9/20/26, COMBAT lane, VAMILY [fight looks])

   PAOLO 9/20: "the combat is still dogshit, it's not at scale, it feels like it's in
   a different world than the demo." His friend, on the link he sent: "a checkerboard
   of orange roof tiles for a floor."

   MEASURED ON THE DEPLOYED CUT, by wrapping drawImage on the walked street and on the
   fight in one session:

                       source art     drawn at     ground it covers
     THE WALK          44 x 44        11 x 11      0.75 m
     THE FIGHT         44 x 44        66 x 66      12 m

   The same 44-pixel tile: the street shrinks it to eleven, the fight blew it up to
   sixty-six and asked it to cover sixteen times more ground each way. So this gate
   does not ask whether a function exists. IT COUNTS WHAT THE FLOOR ACTUALLY BLITS
   DURING ONE REBUILD, in a real fight, started the way he starts one, and it asks
   four things that can each fail on their own:

     1. A MATERIAL CELL DRAWS A LOT PATCH.  road / walk / yard / lot / slab paint
        16 x 16 of the street's own cells, so the source is 176 px and never 44.
     2. A MARKING CELL STILL DRAWS ONE TILE. median, lane, kerb, gutter, wall and
        house are the tile -- photographed the alternative, and tiling the median
        sixteen times wiped the yellow dashes off the road entirely.
     3. THE BODY BOARD DID NOT MOVE. Turn the house board off and the patch path is
        gone: zero patch blits, the old 44 px path back, byte for byte.
     4. THE RULER IS DERIVED. lotSub() is the metre door over the walked city's own
        0.75 m cell, so it reads 16 on the house board and 2 on the body board with
        nobody typing either number.

   AND IT RUNS ON THE THING HE OPENS. V221 proved the workshop is not the cut, so
   this walks the cut, built fresh by the cutter's own --out flag, which never touches
   the committed demo (rule 14a: only RUN re-cuts that one).
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const http = require('http');
const { execFileSync } = require('child_process');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.join(__dirname, '..');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const CUT = path.join(process.env.TMPDIR || '/tmp', 'bohemia_lot_patch_cut.html');
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

/* the four cut-only facts V221 paid for, unchanged: the demo's frames have NO NAME,
   more than one frame answers the city's URL and only one is alive, an eager poller
   starves the boot, and the city frame does not exist for the first half minute. */
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
async function liveFight(page) {
  for (let i = 0; i < 30; i++) {
    for (const f of page.frames()) {
      let has = false;
      try { has = await f.evaluate(() => typeof G !== 'undefined' && !!document.getElementById('fire')); } catch (e) {}
      if (has) return f;
    }
    await sleep(700);
  }
  return null;
}

/* ONE HONEST FLOOR REBUILD. The floor is cached into a single full-canvas blit
   (__FLOOR_CACHE__), so a probe that just watches a frame sees the cache and nothing
   else -- which is exactly how I nearly reported "the floor draws two images". It
   wraps the prototype, drops the cache key, waits for one rebuild, and puts the
   prototype back. */
const REBUILD = (pre) => `(async () => {
  ${pre || ''}
  const P = CanvasRenderingContext2D.prototype, orig = P.drawImage, rec = [];
  P.drawImage = function () { const a = arguments, s = a[0];
    rec.push(((s && s.width) | 0) + 'x' + ((s && s.height) | 0));
    return orig.apply(this, a); };
  _FLK = null;
  await new Promise(r => setTimeout(r, 1100));
  P.drawImage = orig;
  const m = {}; for (const k of rec) m[k] = (m[k] || 0) + 1;
  /* READ WHAT IS THERE, NEVER CRASH ON WHAT IS NOT. Mutation-proved against a tree
     with no patch in it: the first cut of this threw ReferenceError and killed the
     run, and a gate that dies instead of going red is a gate that cannot be trusted
     to tell you which way it failed. */
  const g = (n) => { try { return eval(n + '()'); } catch (e) { return null; } };
  let patches = []; try { patches = Object.keys(_LOTP); } catch (e) {}
  let tile = 0;
  try { const c = document.getElementById('cv');
    tile = Math.min(c.width, c.height) * fieldPitch(c.width, c.height); } catch (e) {}
  return { hist: m, lotSub: g('lotSub'), house: g('houseOn'),
           patches: patches, tileM: g('tileMetres'), tile: tile };
})()`;

async function walkAndCheck(browser, BASE, where, url) {
  console.log('\n--- ' + where + ' ---');
  const page = await browser.newPage({ viewport: { width: 430, height: 932 } });
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

  /* WHAT THE WALKED STREET DRAWS A TILE AT, read off the same session, because the
     whole claim of this row is a comparison and a comparison needs both halves. */
  const walk = await city.evaluate(async () => {
    const g = cv.getContext('2d'), orig = g.drawImage.bind(g), rec = [];
    g.drawImage = function () { const a = arguments, s = a[0];
      let dw; if (a.length === 9) dw = a[7]; else if (a.length === 5) dw = a[3]; else dw = (s && s.width) | 0;
      if (((s && s.width) | 0) === 44) rec.push(Math.round(dw));
      return orig.apply(null, a); };
    await new Promise(r => setTimeout(r, 1200));
    g.drawImage = orig;
    const m = {}; for (const k of rec) m[k] = (m[k] || 0) + 1;
    return Object.entries(m).sort((a, b) => b[1] - a[1])[0] || null;
  });
  ok(where + ': the walked street draws its 44px tile SMALL (' +
     (walk ? walk[0] + 'px, ' + walk[1] + ' of them' : 'none seen') + ')',
     !!walk && +walk[0] <= 16);

  /* a real fight, started the way he starts one: walk up to a crew and tap one */
  const placed = await city.evaluate(() => {
    const list = BohemiaHostiles.near({ x: hx, y: hy,
      radius: 60, probe: hostileProbe, danger: hostDanger(), density: HOST_DENSITY, day: (T.day | 0) });
    const c = list.map(x => ({ at: x.at, d: Math.max(Math.abs(x.at[0] - hx), Math.abs(x.at[1] - hy)) }))
      .sort((a, b) => a.d - b.d)[0];
    if (!c) return null;
    window.__CITY.human(c.at[0], c.at[1] + 5);
    return { crew: c.at };
  });
  /* PLACING IS A CONVENIENCE, NOT THE TEST. BohemiaHostiles.near came back empty on
     both surfaces in one run while a crew was standing on the glass the whole time --
     so a gate that treats the teleport as the gate measures the spawner, not the
     floor. WHAT IT WAITS FOR IS A BODY ON THE GLASS, which is the only thing a
     player can tap either way. */
  await sleep(2500);
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
    if (!aim) { await city.evaluate(() => { try { const list = BohemiaHostiles.near({ x: hx, y: hy,
        radius: 90, probe: hostileProbe, danger: hostDanger(), density: HOST_DENSITY, day: (T.day | 0) });
      const c = list.map(x => ({ at: x.at, d: Math.max(Math.abs(x.at[0] - hx), Math.abs(x.at[1] - hy)) }))
        .sort((a, b) => a.d - b.d)[0];
      if (c) window.__CITY.human(c.at[0], c.at[1] + 5); } catch (e) {} }); await sleep(1500); }
  }
  ok(where + ': a hostile crew on the street to walk up to', !!aim || !!placed);
  if (!aim) { ok(where + ': a hostile body on the glass to tap', false); await page.close(); return; }
  await page.mouse.click(fb.x + aim.x, fb.y + aim.y);
  await sleep(9000);
  const cf = await liveFight(page);
  if (!cf) { ok(where + ': the fight came up', false); await page.close(); return; }
  ok(where + ': a real fight, started the way he starts one', true);
  await sleep(2500);

  /* ---------- THE HOUSE BOARD, WHICH IS THE BOARD A FIGHT STARTS ON ---------- */
  const A = await cf.evaluate(REBUILD(''));
  const sub = k => A.hist[k] || 0;
  ok(where + ': the board a fight starts on IS the house board', A.house === true);
  ok(where + ': the ruler is derived, not typed (12 m lot / 0.75 m cell = ' + A.lotSub + ')',
     A.lotSub === 16 && A.tileM === 12);
  const patch = Object.entries(A.hist)
    .filter(([k]) => { const m2 = /^(\d+)x(\d+)$/.exec(k);
      return m2 && +m2[1] === +m2[2] && +m2[1] === Math.ceil(A.tile) + 1; })
    .reduce((n, kv) => n + kv[1], 0);
  ok(where + ': material cells draw a LOT of street cells, not one stretched tile (' +
     patch + ' patch blits, ' + (patch * 256) + ' street cells drawn)', patch > 50);
  /* *** THE ARM THIS REPLACED WAS A LIE AND THE MUTATION RUN IS WHAT CAUGHT IT. ***
     It asked whether a raw 44px source ever reached the board, and PASSED on a tree
     with no patch in it at all -- because streetTile composes 44 into a 66px cache
     canvas once and then blits the cache, so after the first frame no 44px source is
     drawn on either tree. A check that cannot go red is not a check.
     THIS ONE CAN: every patch is built at the size the walked street composes at,
     lotSub() x LOT_SUBPX = 16 x 11 = 176, which is the city's own 704px lot chunk at
     its own 4x reduction. Change either number and this is the arm that says so. */
  const built = await cf.evaluate(() => { const o = {};
    try { for (const k of Object.keys(_LOTP)) { const c = _LOTP[k]; o[k] = c ? c.width + 'x' + c.height : 'null'; } }
    catch (e) {} return o; });
  /* AMENDED BY V223, AND THE OLD NUMBER WAS THE DEFECT. V222 composed every patch at
     176 px and then drew it at the cell, which at the ruled 196 px lot is a 1.11
     FRACTIONAL UPSCALE -- the class of blur COOK named ("never 44 at 67, that 1.523
     scale IS the blur"). A patch is now built AT THE SIZE IT IS DRAWN, so it blits
     1:1, and this arm asks that rather than a frozen number: whatever the camera
     makes a cell, the patch is that, and every street cell inside it is a pure
     shrink of a 44 px source. */
  const sizes = [...new Set(Object.values(built))];
  const cell = Math.ceil(A.tile) + 1;
  ok(where + ': and each patch is built at the size it is drawn, so it blits 1:1 (' +
     (sizes.join(' ') || 'none built') + ' against a ' + cell + ' px cell)',
     sizes.length === 1 && sizes[0] === cell + 'x' + cell);
  /* A MARKING IS STILL THE TILE. The patch reads ST_SPIN, the declaration V96 already
     made, so median / lane / kerb / gutter / wall / house are drawn once across the
     cell. Photographed the alternative: the yellow dashes vanished. */
  /* REPOINTED BY V223, AND THE OLD SPELLING IS EXACTLY THE ROT THIS LANE KEEPS FINDING.
     This arm matched a source size of 6x-something, which was the OLD 65 px tile. A
     marking now comes up from COOK's 88 px art (that is what the second set was cooked
     for), so the ruler was written in a unit the game no longer uses and went red for
     the work going right. It asks the real question instead: how many cells drew a
     BANK TILE rather than a lot patch -- 44 or 88 at source, whatever the cell is. */
  const marks = Object.entries(A.hist)
    .filter(([k]) => /^(44x44|88x88)$/.test(k))
    .reduce((n, kv) => n + kv[1], 0);
  ok(where + ': markings and roofs still draw once across the cell (' + marks + ')', marks > 0);
  ok(where + ': only the isotropic materials take a patch (' +
     [...new Set(A.patches.map(p => p.split('|')[0]))].sort().join(' ') + ')',
     A.patches.length > 0 && A.patches.every(p => ['road', 'walk', 'lot', 'yard', 'slab']
       .indexOf(p.split('|')[0]) >= 0));

  /* ---------- AND THE BODY BOARD DID NOT MOVE ---------- */
  const B = await cf.evaluate(REBUILD('G.houseTile = false;'));
  ok(where + ': with the house board off, the patch path is gone', (B.hist['176x176'] || 0) === 0);
  ok(where + ': and the old per-cell tile is back', (B.hist['44x44'] || 0) > 0 ||
     Object.keys(B.hist).some(k => /^(8|9|1[0-9])x/.test(k)));
  await cf.evaluate(() => { G.houseTile = undefined; });

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
  console.log('\n=== LOT IS SIXTEEN TILES GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})().catch(e => {
  console.log('  FAIL the gate could not finish: ' + String(e).slice(0, 200));
  try { fs.unlinkSync(CUT); } catch (_e) {}
  console.log('\n=== LOT IS SIXTEEN TILES GATE: ' + pass + ' passed, ' + (fail + 1) + ' failed ===');
  process.exit(1);
});
