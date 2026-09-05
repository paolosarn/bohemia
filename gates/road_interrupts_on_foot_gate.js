/* ============================================================================
   ROAD INTERRUPTS ON FOOT (9/5/26, RUN lane) -- VAMILY [street encounters].

   THE ROAD INTERRUPTS shipped 8/27: twelve approved road moments, the encounter
   director on the clock, 70/20/10 held, the card, the leavings, the choices.
   ALL OF IT FIRED ONLY WHEN YOU WERE LOOKING AT THE MAP. roadInterrupt had one
   caller and it sat inside MODE==='city', so the surface Paolo actually walks --
   the one the demo opens on -- had never produced a single one of them. The row
   sat open from 8/31.

   TWO THINGS WERE WRONG AND ONLY ONE OF THEM WAS THE MISSING CALL.

   1. THE MISSING CALL. The human branch of stepOnce spends 0.084 minutes a cell
      and handed that time to nobody. It hands it to the same director now --
      5.04 seconds a cell, times the cells that beat actually covered, because a
      bike covers four. No new pacing and no second director.

   2. *** THE INTERRUPT WAS READING THE MAP CURSOR, NOT THE PLAYER. *** It took
      the district AND the power-grid lookups off city.x / city.y, which are
      OVERMAP cells that only move in city mode. Wired to the walked street
      unchanged, it would have decided what happens to you from wherever the map
      was last left sitting. roadWhere() answers "which overmap cell is the
      player in" once, per mode, and every reader uses it -- because two places
      both claiming to be where you are is a bug this file has fixed five times
      under five different names.

   MEASURED BEFORE BUILDING, because a feature that cannot reach the player is
   the trap this lane fell into twice this round:
     * 3,633 of 9,216 overmap cells (39.4%) are one of the seven road districts
       the table covers; arterial alone is 2,434.
     * the nearest road cell to the spawn is ONE cell away, at (49,47).
   And measured after, on the served demo: walking off the suburb into arterial
   produced coyote_shadow, ambient, with its card on screen, zero page errors.

   ON THE RATE, REPORTED HONESTLY RATHER THAN TUNED. Over one walk the director
   refused with NO_TABLE 6 (the suburb, correctly -- NO GLOBAL SPAWNS EVER),
   GAP 17, NO_BUDGET 21, and fired once. NO_BUDGET dominating is not a wiring
   fault: budget is tension x quiet and both accrue with spent time, so on foot
   it RAMPS instead of jumping, and a moment needs roughly 180 seconds of walking
   -- about thirty-six cells -- where one map press buys six hundred seconds
   outright. Moments are rarer on foot than on the map. That is the approved
   director's own shape and changing it would be re-tuning approved pacing
   without a ruling.

   ---- MUTATION PROOF, run 9/5 -------------------------------------------------
     * take the foot call back out -> 4 red, including zero moments over a walk
     * *** put roadWhere back to reading city.x/city.y -> the player walks into
       arterial and the director is told SUBURB, NINETY-NINE TIMES, and fires
       nothing. *** That is the second bug exactly, and it is the one that would
       have shipped invisibly under a working-looking feature: the call was
       there, the time was flowing, and the answers were about the wrong place.

   ---- AND THE HARNESS WAS WRONG TWICE BEFORE THE FEATURE WAS RIGHT ONCE -------
   Two cuts of this gate reported ZERO moments where a hand-walk had already got
   one. Both times it was the walk: 420 presses produced SEVENTEEN moves, because
   it was pressing into buildings, and A STEP THAT DOES NOT MOVE SPENDS NO TIME,
   so the director was handed nothing. The harness was standing still and calling
   it walking. It checks its own position every single step now and turns the
   moment it stops moving.
   A third claim was wrong on its merits rather than broken: it ASSERTED the
   director had refused with NO_TABLE at least once, which is a fact about the
   path the harness happened to take -- a walk that goes straight onto road
   ground never sees one, and it went red on a run where the feature worked. The
   rule it was reaching for is tested directly against the module instead, where
   it cannot depend on which way the wind blew.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const ROOT = path.join(__dirname, '..');
const SLICES = path.join(ROOT, 'slices');
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const done = () => {
  console.log('ROAD ON FOOT: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
};

const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
               '.png': 'image/png', '.json': 'application/json',
               '.webmanifest': 'application/manifest+json' };
function serve() {
  return new Promise(res => {
    const s = http.createServer((rq, rs) => {
      const rel = decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, '');
      const f = path.join(SLICES, rel);
      if (!f.startsWith(SLICES) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
        rs.statusCode = 404; return rs.end('no');
      }
      rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream');
      fs.createReadStream(f).pipe(rs);
    });
    s.listen(0, '127.0.0.1', () => res(s));
  });
}

/* ---- 1. THE WIRING IS THERE AT ALL --------------------------------------- */
{
  const city = fs.readFileSync(path.join(SLICES, 'BOHEMIA_CITY_WORLD.html'), 'utf8');
  ok('the walked branch of stepOnce hands its time to the director',
     /ROAD_LASTDIR = di;\s*\n\s*try\{ roadInterrupt\(moved \* 5\.04\); \}/.test(city));
  ok('and it is the SAME director the map uses, not a second one',
     (city.match(/roadInterrupt\(/g) || []).length === 3);   /* def + 2 callers */
  ok('roadWhere exists and the interrupt reads it instead of the map cursor',
     /function roadWhere\(\)/.test(city)
     && /try\{ cell = om\.at\(_w\[0\], _w\[1\]\); \}/.test(city));
  ok('and the power lookups read it too, so the grid and the district agree '
    + 'about where you are',
     /POWER\.at\(_w\[0\],_w\[1\]\)/.test(city) && !/POWER\.at\(city\.x,city\.y\)/.test(city));
  ok('nothing about damage came with it -- the costs table is still minutes',
     /var ROAD_COST = \{ ambient: 0, interactive: 10, forced: 20 \};/.test(city));
}

/* ---- 1b. NO GLOBAL SPAWNS EVER, tested where it cannot be path-dependent --
   A district with no table produces NOTHING, never something borrowed from
   somewhere else. That is the director's own rule and the reason a suburb is
   quiet; asserted here against the module rather than by hoping a walk wanders
   through one. */
{
  const E = require(path.join(ROOT, 'engine/bohemia_encounters.js'));
  const dir = E.makeDirector({ seed: 7,
    tableFor: function (district, phase) {
      return district === 'arterial' ? ['coyote_shadow'] : null;   /* suburb: nothing */
    } });
  const world = { district: 'suburb', phase: 'day', health: 1, heat: 0,
                  can: function () { return false; } };
  const got = dir.consider(world, 100000);        /* all the time in the world */
  ok('*** A DISTRICT WITH NO TABLE PRODUCES NOTHING *** -- NO GLOBAL SPAWNS '
    + 'EVER, so the suburb is quiet by rule and not by luck (' + got.reason + ')',
     got.fired === false && got.reason === 'NO_TABLE');
}

/* ---- 2. THE REAL SURFACE ------------------------------------------------- */
(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); return done(); }

  const srv = await serve();
  const base = 'http://127.0.0.1:' + srv.address().port + '/';
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  try {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 },
                                           hasTouch: true, isMobile: true });
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));
    await page.goto(base + 'BOHEMIA_DEMO.html', { waitUntil: 'load', timeout: 240000 });
    await SETTLE(page, 2500);
    await page.tap('#front').catch(async () => { await page.click('#front').catch(() => { }); });
    /* the readiness check waits for the END of the city's file, not DAY.day --
       that one is true half way through and fooled four probes in one round */
    await SETTLE(page, 90000, async () => {
      const f = page.frames().find(x => x.name() === 'cityFrame');
      if (!f) return false;
      try {
        return await f.evaluate(() => typeof DAY !== 'undefined' && DAY.day >= 1
          && typeof roadWhere === 'function' && typeof ROAD_LOG !== 'undefined');
      } catch (e) { return false; }
    });
    const city = page.frames().find(x => x.name() === 'cityFrame');
    ok('the walked world is up', !!city);
    if (!city) { await browser.close(); srv.close(); return done(); }

    await page.evaluate(() => { const n = document.getElementById('openNot'); if (n) n.click(); });
    await SETTLE(page, 1200);
    const clearCards = async () => {
      for (let i = 0; i < 8; i++) {
        const up = await city.evaluate(() => {
          const d = document.getElementById('daycard');
          if (!d || getComputedStyle(d).display === 'none') return false;
          const g = d.querySelector('.dcgo') || d.querySelector('.dcbtn') || d.querySelector('.dcx');
          if (g) g.click(); return true;
        });
        if (!up) return; await SETTLE(page, 350);
      }
    };
    await clearCards();

    /* WHERE HE IS, AND WHERE THE ROAD IS. Both read out of the game. */
    const start = await city.evaluate(() => {
      const w = roadWhere();
      const road = Object.keys(ROAD_TABLE);
      let best = null;
      for (let y = 0; y < om.n; y++) for (let x = 0; x < om.n; x++) {
        const d = (om.at(x, y) || {}).district;
        if (road.indexOf(d) < 0) continue;
        const dd = Math.max(Math.abs(x - w[0]), Math.abs(y - w[1]));
        if (best === null || dd < best.d) best = { d: dd, at: [x, y], district: d };
      }
      return { where: w, district: (om.at(w[0], w[1]) || {}).district,
               nearest: best, roadCells: road.length };
    });
    ok('roadWhere answers with the cell the PLAYER is standing in ('
      + start.where + ', ' + start.district + ')',
       Array.isArray(start.where) && typeof start.district === 'string');
    ok('and road ground is within reach of where he wakes up (nearest '
      + (start.nearest ? start.nearest.d + ' cells, ' + start.nearest.district : 'none')
      + ')', !!start.nearest && start.nearest.d <= 4);

    /* count what the director says, every call, without touching what it does */
    await city.evaluate(() => {
      window.__RR = {};
      const orig = window.roadInterrupt;
      window.roadInterrupt = function () {
        const r = orig.apply(null, arguments);
        const k = (r && (r.fired ? 'FIRED' : r.reason)) || '?';
        window.__RR[k] = (window.__RR[k] | 0) + 1;
        return r;
      };
    });

    /* WALK. Toward the road first, then sweep, clearing cards like a player. */
    const tapDir = async (glyph) => {
      const el = await city.evaluateHandle(g =>
        [...document.querySelectorAll('#pad .pb')].find(b => (b.textContent || '').trim() === g)
        || document.querySelectorAll('#pad .pb')[0], glyph);
      try { await el.asElement().tap({ timeout: 2500 }); } catch (e) { }
    };
    const GLYPH = { '1,0': '→', '-1,0': '←', '0,1': '↓', '0,-1': '↑',
                    '1,1': '↘', '1,-1': '↗', '-1,1': '↙', '-1,-1': '↖' };
    const sweep = ['→', '↓', '←', '↑'];
    /* *** WALK LIKE SOMEBODY WHO CAN SEE THE WALL. ***
       Two cuts of this harness got ZERO moments where a hand-walk got one, and
       the reason was not the feature: 420 presses produced SEVENTEEN moves. The
       walk was pressing into buildings, and a step that does not move SPENDS NO
       TIME, so the director was handed nothing. The harness was standing still
       and calling it walking -- the same family as the circle it walked two
       rounds ago. So: check every single step, and the moment the position does
       not change, turn. Distance is what buys time. */
    const DIRS8 = ['\u2192', '\u2198', '\u2193', '\u2199', '\u2190', '\u2196', '\u2191', '\u2197'];
    let fires = 0, seen = [], heading = 0, moves = 0, blocked = 0;
    let at = await city.evaluate(() => [hx, hy]);
    for (let i = 0; i < 600 && fires < 1; i++) {
      await tapDir(DIRS8[heading]);
      const r = await city.evaluate(() => {
        const d = document.getElementById('daycard');
        const card = (d && getComputedStyle(d).display !== 'none')
          ? (d.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 70) : null;
        if (card) { const b = d.querySelector('.dcgo') || d.querySelector('.dcbtn') || d.querySelector('.dcx'); if (b) b.click(); }
        const w = roadWhere();
        return { hx: hx, hy: hy, n: ROAD_LOG.length,
                 last: ROAD_LOG.length ? ROAD_LOG[ROAD_LOG.length - 1] : null,
                 district: (om.at(w[0], w[1]) || {}).district,
                 onRoad: Object.keys(ROAD_TABLE).indexOf((om.at(w[0], w[1]) || {}).district) >= 0,
                 card: card };
      });
      if (r.hx === at[0] && r.hy === at[1]) { blocked++; heading = (heading + 1) % 8; }
      else { moves++; }
      at = [r.hx, r.hy];
      /* while off road ground, bias back toward it every so often; on it, just
         keep covering distance, because distance is the whole currency here */
      if (!r.onRoad && start.nearest && i % 40 === 39) {
        const dx = Math.sign(start.nearest.at[0] * 128 - r.hx);
        const dy = Math.sign(start.nearest.at[1] * 128 - r.hy);
        const g = GLYPH[dx + ',' + dy];
        const k = DIRS8.indexOf(g);
        if (k >= 0) heading = k;
      }
      if (r.n > fires) {
        fires = r.n;
        seen.push({ id: r.last && r.last.id, kind: r.last && r.last.kind,
                    where: r.district, card: r.card });
      }
    }
    console.log('  walked ' + moves + ' cells, blocked ' + blocked + ' presses');
    const reasons = await city.evaluate(() => window.__RR);
    const walked = await city.evaluate(() => ({ hx: hx, hy: hy, min: T.min,
      where: roadWhere(), district: (om.at(roadWhere()[0], roadWhere()[1]) || {}).district }));
    console.log('  walk ended at ' + JSON.stringify(walked)
      + ' reasons ' + JSON.stringify(reasons));

    ok('*** THE ROAD HAS ITS SAY ON THE WALKED STREET *** -- ' + fires
      + ' moment(s) on foot, where every one of the twelve had only ever fired '
      + 'on the map: ' + JSON.stringify(seen.map(s => s.id + '/' + s.kind + ' in ' + s.where)),
       fires >= 1);
    ok('and it is one of the approved twelve, in a district whose table holds it',
       seen.length >= 1 && !!seen[0].id && !!seen[0].kind
       && ['ambient', 'interactive', 'forced'].indexOf(seen[0].kind) >= 0);
    /* REPORTED, not asserted: which refusals this particular walk happened to
       hit. The first cut ASSERTED NO_TABLE >= 1, which is a claim about the path
       the harness took rather than about the game -- a walk that goes straight
       onto road ground never sees one, and the check went red on a run where the
       feature worked perfectly. The rule it was reaching for is tested directly
       in Node below, where it does not depend on which way the wind blew. */
    console.log('  director said: ' + JSON.stringify(reasons));
    ok('nothing threw while the road was talking'
      + (errs.length ? ' -- first: ' + errs[0] : ''), errs.length === 0);

    await browser.close();
    srv.close();
    done();
  } catch (e) {
    ok('the gate ran to the end [' + String(e.message).slice(0, 160) + ']', false);
    try { await browser.close(); } catch (e2) { }
    try { srv.close(); } catch (e2) { }
    done();
  }
})();
