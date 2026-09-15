#!/usr/bin/env node
/* ============================================================================
   THE RULERS READ THE BOARD
   (9/15/26, COMBAT lane, [house board] follow-up, standing duty 8)

   I shipped the house board and proved it in numbers. Then I PHOTOGRAPHED a real
   fight on it, and the picture said two things the numbers did not:

       "LONG RANGE ~2m"   for a man standing ONE HOUSE away
       "WAY OUT 10T"      for a win condition placed OUTSIDE THE BUILT WORLD

   So this gate reads WHAT THE PLAYER IS TOLD, out of the shipped readouts, in a real
   fight started the way he starts one -- and it pins the BODY board at the same time,
   because a fix that quietly moves the old board would be a worse bug than the one it
   fixes.
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const http = require('http');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.join(__dirname, '..');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json',
  '.css': 'text/css', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
function serve() {
  return new Promise(res => {
    const srv = http.createServer((rq, rp) => {
      const u = decodeURIComponent((rq.url || '/').split('?')[0]);
      const f = path.join(REPO, u);
      if (!f.startsWith(REPO) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
        rp.writeHead(404); return rp.end('no'); }
      rp.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
      fs.createReadStream(f).pipe(rp);
    });
    srv.listen(0, '127.0.0.1', () => res(srv));
  });
}
let pass = 0, fail = 0;
const ok = (n, c) => { c ? (pass++, console.log('  PASS ' + n)) : (fail++, console.log('  FAIL ' + n)); };
const done = async (b) => { if (b) await b.close();
  console.log('=== HOUSE RULERS GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0); };

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 430, height: 932 } });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e).slice(0, 160)));
  const SRV = await serve();
  const BASE = 'http://127.0.0.1:' + SRV.address().port;
  await page.goto(BASE + '/slices/BOHEMIA_ALPHA_0_9.html', { waitUntil: 'load', timeout: 120000 });
  await sleep(9000);
  await page.mouse.click(215, 450); await sleep(2500); await page.mouse.click(215, 450);

  let city = null;
  for (let i = 0; i < 900; i++) {
    city = page.frames().find(f => { try { return f.name() === 'cityFrame'; } catch (e) { return false; } });
    if (city) { let a = false;
      try { a = await city.evaluate(() => typeof streetTapFoe === 'function'); } catch (e) {}
      if (a) break; }
    await sleep(150);
  }
  if (!city) { ok('the walked city came up', false); return done(browser); }

  /* the card and the shell banner come off the way a player takes them off */
  const cityBox = await (await (page.frames().find(f => f.name() === 'cityFrame')).frameElement()).boundingBox();
  for (let i = 0; i < 8; i++) {
    let hit = false;
    for (const sel of ['.dcgo[data-act="go"]', '[data-act="close"]', '.dcgo']) {
      const h = await city.$(sel).catch(() => null);
      if (h && await h.isVisible().catch(() => false)) {
        const b = await h.boundingBox();
        if (b) { await page.mouse.click(cityBox.x + b.x + b.width / 2, cityBox.y + b.y + b.height / 2); hit = true; break; }
      }
    }
    await sleep(hit ? 1100 : 600);
    const clear = await city.evaluate(() => { const c = document.querySelector('canvas');
      const b = c.getBoundingClientRect();
      const el = document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2);
      return !!el && el.tagName === 'CANVAS'; }).catch(() => true);
    if (clear) break;
  }
  await page.evaluate(() => { const n = document.getElementById('openNot'), inv = document.getElementById('openInvite');
    if (inv && getComputedStyle(inv).display !== 'none' && n) n.click(); });

  /* ---------- A REAL FIGHT, STARTED THE WAY HE STARTS ONE ---------- */
  const placed = await city.evaluate(() => {
    const list = BohemiaHostiles.near({ seed: (typeof seed !== 'undefined' ? seed : 0), at: [hx, hy],
      radius: 60, probe: hostileProbe, danger: hostDanger(), density: HOST_DENSITY, day: (T.day | 0) });
    const c = list.map(x => ({ at: x.at, count: x.count,
      d: Math.max(Math.abs(x.at[0] - hx), Math.abs(x.at[1] - hy)) })).sort((a, b) => a.d - b.d)[0];
    if (!c) return null;
    window.__CITY.human(c.at[0], c.at[1] + 5);
    return { crew: c.at };
  });
  if (!placed) { ok('a crew to walk up to', false); return done(browser); }
  await sleep(1500);
  const fbox = await (await (page.frames().find(f => f.name() === 'cityFrame')).frameElement()).boundingBox();
  const aim = await city.evaluate(() => {
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
  if (!aim) { ok('a hostile body to tap', false); return done(browser); }
  await page.mouse.click(fbox.x + aim.x, fbox.y + aim.y);
  await sleep(6500);
  const cf = page.frames().find(f => { try { return f.name() === 'combatFrame'; } catch (e) { return false; } });
  if (!cf) { ok('the fight came up', false); return done(browser); }
  ok('a real fight at house scale, started the way he starts one', true);

  /* ---------- ONE: WHAT HE IS TOLD THE DISTANCE IS ---------- */
  const met = await cf.evaluate(() => {
    const out = { houseOn: !!houseOn() };
    out.tileMetres = tileMetres();
    out.oneTileReadsAs = distM(1);
    out.threeTilesReadAs = distM(3);
    /* and the same door at the OTHER scale, so the old board is pinned */
    G.houseTile = false;
    out.bodyTileMetres = tileMetres();
    out.bodyOneTileReadsAs = distM(1);
    delete G.houseTile;
    out.backOn = !!houseOn();
    return out;
  });
  console.log('  THE METRES: ' + JSON.stringify(met));
  ok('*** A HOUSE IS NOT A METRE AND A HALF. *** One tile on the house board reads as '
    + met.oneTileReadsAs + ' m, which is a real suburban lot, instead of the 2 m the '
    + 'photograph showed for a man standing one house away',
    met.houseOn === true && met.oneTileReadsAs >= 10 && met.oneTileReadsAs <= 15);
  ok('and it is DERIVED, not typed: three tiles read as exactly three times one',
    met.threeTilesReadAs === met.oneTileReadsAs * 3);
  ok('THE BODY BOARD IS PINNED: one body tile still reads as the same 1.5 m step it '
    + 'always did, so nothing old moved', met.bodyTileMetres === 1.5 && met.bodyOneTileReadsAs === 2);
  ok('and the board came back on after the check', met.backOn === true);

  /* ---------- AND THE READOUT HE LOOKS AT SAYS IT ---------- */
  const shown = await cf.evaluate(() => {
    const out = {};
    try { G.phase = 'cover'; G.over = false; doPop(); } catch (e) { out.threw = String(e).slice(0, 120); }
    out.phase = G.phase;
    const pl = document.getElementById('patlbl2');
    out.aimLine = pl ? (pl.textContent || '').replace(/\s+/g, ' ').trim() : null;
    const m = out.aimLine && out.aimLine.match(/~(\d+)m/);
    out.metresShown = m ? +m[1] : null;
    out.nearest = Math.min.apply(null, (G.e || []).filter(e => !e.dead).map(e => e.edist || 99).concat([99]));
    return out;
  });
  console.log('  THE AIM LINE: ' + JSON.stringify(shown));
  ok('the line he actually reads carries the house-scale distance, not a number I only '
    + 'computed in a probe',
    !shown.threw && shown.metresShown !== null
      && Math.abs(shown.metresShown - Math.round(shown.nearest * met.tileMetres)) <= 1);

  /* ---------- TWO: THE WIN IS ON THE MAP ---------- */
  const way = await cf.evaluate(() => {
    const out = {};
    out.sight = sightTiles();
    out.contentR = +contentR().toFixed(2);
    out.exitMin = +exitMin().toFixed(2);
    out.exitMax = +exitMax().toFixed(2);
    try { G.phase = 'cover'; G.over = false; placeWayOut(); } catch (e) { out.threw = String(e).slice(0, 120); }
    out.exitAt = G.exit ? +G.exit.edist.toFixed(2) : null;
    out.exitR = G.exit ? G.exit.r : null;
    /* the label he reads */
    const el = document.getElementById('objchip') || document.getElementById('waychip');
    out.hud = null;
    for (const n of Array.from(document.querySelectorAll('div,span'))) {
      const t = (n.textContent || '').trim();
      if (/^WAY OUT \d+T$/.test(t)) { out.hud = t; break; }
    }
    /* and the SAME clamp on the body board, which must not have moved one hundredth */
    G.houseTile = false;
    out.bodyExitMin = +exitMin().toFixed(4);
    out.bodyExitMax = +exitMax().toFixed(4);
    delete G.houseTile;
    return out;
  });
  console.log('  THE WAY OUT: ' + JSON.stringify(way));
  ok('*** THE WIN CONDITION IS INSIDE THE WORLD THAT WAS BUILT. *** The way out stands at '
    + way.exitAt + ' houses against a contentR of ' + way.contentR
    + ', where the photograph showed it at 10 on a board built to 7.6',
    !way.threw && way.exitAt !== null && way.exitAt < way.contentR);
  ok('and he can SEE where he is going: it is inside sight (' + way.sight + ')',
    way.exitAt !== null && way.exitAt <= way.sight);
  ok('and it is still a real walk, not a step: further than one turn of walking',
    way.exitAt !== null && way.exitAt > 2);
  ok('THE BODY BOARD IS PINNED: the clamp still reproduces 10.0 and 18.0 exactly, by '
    + 'construction, because the fractions are taken against its own sight',
    way.bodyExitMin === 10 && way.bodyExitMax === 18);

  /* ---------- THREE: ADJACENT MEANS ADJACENT ON ALL EIGHT SIDES ----------
     MEASURED ON A MERGED TREE, in a real teaching fight: the one man on the board
     stood at edist 1.41 -- a DIAGONAL neighbour -- against a pistol reaching 1, so he
     could not be shot and there was nowhere closer to stand. V218 put the house floor
     at 1 and that only covers four sides of you. doMove steps in eight directions
     while edist is a Euclidean radius, so the nearest a body can ever be is 1
     orthogonally or root two diagonally. */
  const diag = await cf.evaluate(() => {
    const out = {};
    const probe = (k) => +maxRange(wpnRange('pistol'), k).toFixed(4);
    out.atNoon = probe(1);
    out.atHalfLight = probe(0.5);
    out.atAQuarter = probe(0.25);
    out.diagonal = +Math.SQRT2.toFixed(4);
    G.houseTile = false;
    out.bodyFloorAtAQuarter = +maxRange(wpnRange('pistol'), 0.01).toFixed(4);
    delete G.houseTile;
    return out;
  });
  console.log('  THE CORNER: ' + JSON.stringify(diag));
  ok('*** A MAN STANDING ON THE DIAGONAL CAN BE SHOT. *** The nearest a body can be on '
    + 'this board is root two, not one, because a step may be diagonal -- so the floor '
    + 'is root two, day or night',
    diag.atNoon >= diag.diagonal && diag.atHalfLight >= diag.diagonal
      && diag.atAQuarter >= diag.diagonal);
  ok('and the body board keeps its own floor, untouched (point blank plus two)',
    Math.abs(diag.bodyFloorAtAQuarter - 6) < 0.001);

  console.log('  page errors: ' + JSON.stringify(errors.slice(0, 4)));
  ok('no page errors through the whole round trip', errors.length === 0);
  await done(browser);
})();
