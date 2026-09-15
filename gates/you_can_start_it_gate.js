#!/usr/bin/env node
/* ============================================================================
   YOU CAN START IT
   (9/15/26, COMBAT lane, VAMILY [start a fight])

   *** PAOLO 9/15: "I don't even know how to engage in combat and when that shit
   starts." ***

   THE ROW: (1) ON PURPOSE -- a hostile body is on the glass and tapping it starts
   the fight. (2) IT SAYS SO -- when a fight starts the screen says so and says what
   to press.

   SO THIS GATE TAPS. It opens the alpha, walks into the walked city, and then
   dispatches a REAL POINTER on the real canvas at the rectangle the frame actually
   blitted for a hostile body. Nothing is hand-fired: the encounter has to come out
   of the shipped pointerup handler, through the shipped door, and the words have to
   come out of the shipped readout.

   *** AND IT PUTS HIM NEXT TO A CREW, WHICH IS ITSELF THE MEASUREMENT. *** At the
   door there is no hostile body on the glass and there cannot be: hostilePass asks
   for crews inside seeR = ceil(max(canvas)/C/2)+6, which at the house-scale zoom is
   SIXTEEN fine cells, and the nearest crew to the spawn is at TWENTY-FOUR. So the
   gate uses the city's own __CITY.human hook to stand him five cells from a crew
   the module itself picked -- five, so they are WATCHING and the bump path cannot
   fire, which keeps the tap the only thing under test. Where a crew is and where he
   wakes are RUN's ([enemies exist], [wake near]); both are routed, neither is
   staged away, and the distance is printed every run.
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
  console.log('=== YOU CAN START IT GATE: ' + pass + ' passed, ' + fail + ' failed ===');
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

  /* THE WORLD HAS TO BE ALIVE. Measured three rounds ago: the walked city needs
     eight to eleven seconds after the tap before one step works at all, and a
     harness that starts before that measures a half-loaded world. */
  let city = null;
  for (let i = 0; i < 900; i++) {
    city = page.frames().find(f => { try { return f.name() === 'cityFrame'; } catch (e) { return false; } });
    if (city) { let a = false;
      try { a = await city.evaluate(() => typeof ctSawCell === 'function' && typeof stepOnce === 'function'); } catch (e) {}
      if (a) break; }
    await sleep(150);
  }
  if (!city) { ok('the walked city came up', false); return done(browser); }
  ok('the walked city came up', true);

  /* ---------- THE CARD COMES OFF THE GLASS BEFORE ANYTHING IS MEASURED ----------
     Lifted from the one driver's clearCards (tools/bohemia_drive_the_demo.js, rule
     14(g)), including its hard-won rule: the question is not "did I press
     something", it is "is the canvas reachable". MEASURED HERE TOO, and it is the
     same trap: at the door #daycard is up at 418x853, z 40, pointer-events auto,
     reading "DAY 1 06:00 ... THE METER READER", and elementFromPoint at the middle
     of the glass returns DIV#daycard. Every tap in this gate's first two runs went
     into that card. */
  const cityBox = await (await (page.frames().find(f => f.name() === 'cityFrame')).frameElement()).boundingBox();
  const tapIn = (x, y) => page.mouse.click(cityBox.x + x, cityBox.y + y);
  const clearCards = async () => {
    for (let i = 0; i < 8; i++) {
      let hit = false;
      for (const sel of ['.dcgo[data-act="go"]', '[data-act="close"]', '.dcgo']) {
        const h = await city.$(sel).catch(() => null);
        if (h && await h.isVisible().catch(() => false)) {
          const b = await h.boundingBox();
          if (b) { await tapIn(b.x + b.width / 2, b.y + b.height / 2); hit = true; break; }
        }
      }
      await sleep(hit ? 1200 : 700);
      const clear = await city.evaluate(() => {
        const c = document.querySelector('canvas'); if (!c) return false;
        const b = c.getBoundingClientRect();
        const el = document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2);
        return !!el && el.tagName === 'CANVAS';
      }).catch(() => true);
      if (clear) return true;
    }
    return false;
  };
  const cleared = await clearCards();
  ok('the glass is reachable at all: the day card comes off with its own way out', cleared);

  /* AND THE SHELL HAS A BANNER OVER THE CITY TOO, which the frame cannot see.
     MEASURED: elementFromPoint INSIDE the city said CANVAS#cv while
     elementFromPoint in the SHELL, at the same screen point, said DIV#openInvite --
     "DAY 1 BEGINS BEFORE THE DAY ... WATCH / NOT NOW", z 39, pinned to the top of
     the city panel. A pointer that lands on it never reaches the city at all, so
     three runs of this gate read a working tap as a dead one. NOT NOW is the
     player's own answer and the shell remembers it. */
  const banner = await page.evaluate(() => {
    const n = document.getElementById('openNot');
    const inv = document.getElementById('openInvite');
    const up = !!(inv && getComputedStyle(inv).display !== 'none');
    if (up && n) n.click();
    const inv2 = document.getElementById('openInvite');
    return { was: up, now: !!(inv2 && getComputedStyle(inv2).display !== 'none') };
  });
  console.log("  THE SHELL BANNER: was up " + banner.was + ', up now ' + banner.now);
  ok('the shell banner is off the city (NOT NOW, the way he would)', !banner.now);

  await page.evaluate(() => { window.__M = [];
    window.addEventListener('message', e => { const d = e && e.data;
      if (d && d.type === 'BOHEMIA_CITY_ENCOUNTER')
        window.__M.push({ label: d.label, why: d.why, street: !!d.street, room: !!d.room,
          roster: (d.roster || []).length }); }); });

  /* ---------- WHAT IS TRUE AT THE DOOR, PRINTED EVERY RUN ---------- */
  const door = await city.evaluate(() => {
    const out = { at: [hx, hy] };
    try { out.danger = (hostDanger() || []).map(d => d.id); } catch (e) { out.danger = []; }
    try {
      const C = HC, seeR = Math.ceil(Math.max(cv.width, cv.height) / C / 2) + 6;
      out.C = C; out.seeR = seeR;
      const list = BohemiaHostiles.near({ seed: (typeof seed !== 'undefined' ? seed : 0), at: [hx, hy],
        radius: 60, probe: hostileProbe, danger: hostDanger(), density: HOST_DENSITY, day: (T.day | 0) });
      out.crews = list.map(c => ({ at: c.at, count: c.count,
        dist: Math.max(Math.abs(c.at[0] - hx), Math.abs(c.at[1] - hy)) })).sort((a, b) => a.dist - b.dist);
    } catch (e) { out.crews = []; }
    try { out.onGlass = (typeof HOST_HIT !== 'undefined' && HOST_HIT) ? HOST_HIT.length : null; } catch (e) {}
    return out;
  });
  console.log('  AT THE DOOR: cell ' + JSON.stringify(door.at) + '  C ' + door.C + '  see radius ' + door.seeR
    + ' cells  ·  nearest crews ' + JSON.stringify((door.crews || []).slice(0, 3).map(c => c.dist))
    + '  ·  hostile bodies on the glass ' + door.onGlass);
  ok('RUN put hostile crews in the valley (routed: none is inside the see radius at the door)',
    Array.isArray(door.crews) && door.crews.length > 0);

  /* ---------- STAND HIM FIVE CELLS OFF A CREW THE MODULE PICKED ---------- */
  const placed = await city.evaluate(() => {
    const list = BohemiaHostiles.near({ seed: (typeof seed !== 'undefined' ? seed : 0), at: [hx, hy],
      radius: 60, probe: hostileProbe, danger: hostDanger(), density: HOST_DENSITY, day: (T.day | 0) });
    const c = list.map(x => ({ at: x.at, count: x.count,
      d: Math.max(Math.abs(x.at[0] - hx), Math.abs(x.at[1] - hy)) })).sort((a, b) => a.d - b.d)[0];
    if (!c) return null;
    /* five cells SOUTH of them: the glass holds about nine cells across and twenty
       down at this zoom, so the vertical offset is the one that keeps them in
       frame, and five is inside SEE_YOU (8) and outside CLOSE_AT (3) */
    window.__CITY.human(c.at[0], c.at[1] + 5);
    return { crew: c.at, count: c.count, me: [hx, hy] };
  });
  if (!placed) { ok('a crew was found to walk up to', false); return done(browser); }
  console.log('  STOOD HIM AT ' + JSON.stringify(placed.me) + ', five cells off the crew at '
    + JSON.stringify(placed.crew) + ' (' + placed.count + ' of them)');
  await sleep(1200);

  const glass = await city.evaluate(() => {
    let hit = [], states = [];
    try { hit = (HOST_HIT || []).map(r => ({ x: r.x, y: r.y, w: r.w, h: r.h, at: r.crew && r.crew.at })); } catch (e) {}
    try { states = (HOST_DREW || []).map(c => c.state); } catch (e) {}
    const r = cv.getBoundingClientRect();
    return { hit: hit, states: states, cvw: cv.width, cvh: cv.height,
      box: { left: r.left, top: r.top, w: r.width, h: r.height } };
  });
  console.log('  ON THE GLASS: ' + glass.hit.length + ' hostile bodies, states ' + JSON.stringify(glass.states));
  ok('a hostile body is on the glass and the frame recorded what it blitted', glass.hit.length > 0);
  ok('they are WATCHING, so the bump path cannot be what starts this',
    glass.states.length > 0 && glass.states.indexOf('close') < 0);
  if (!glass.hit.length) return done(browser);

  /* ---------- THE LINE ON THE STREET, OUT OF THE SHIPPED STEP ---------- */
  const said = await city.evaluate(() => {
    let before = '';
    try { before = (document.getElementById('packline') || {}).textContent || ''; } catch (e) {}
    for (let i = 0; i < 8; i++) { try { stepOnce(4); } catch (e) {} }   /* 4 = south, away from them */
    let after = '', shown = 'none';
    try { const l = document.getElementById('packline');
      after = (l && l.textContent) || ''; shown = l ? getComputedStyle(l).display : 'none'; } catch (e) {}
    return { before: before, after: after, shown: shown };
  });
  console.log('  THE STREET SAID: "' + said.after + '"  (display ' + said.shown + ')');
  /* AND IT HAS TO BE ON THE SCREEN. textContent survives display:none, so the first
     cut of this arm passed on a line nobody could read -- the same class of lie as a
     card that closes on a tap it did not recognise (rule 14(h)). */
  ok('the street tells him they are there AND that a tap starts it',
    /TAP ONE AND IT STARTS|TAP HIM AND IT STARTS/i.test(said.after) && said.shown !== 'none');

  /* ---------- AND THE CARD COMES OFF THE GLASS FIRST ----------
     MEASURED, and it is worth writing down: the first cut of this gate tapped a
     body and nothing happened, because document.elementFromPoint at the body said
     P inside #daycardIn inside #daycard.on -- THE ROAD CARD WAS OVER THE STREET,
     put there by my own V213 on one of the eight steps above. A tap on a card is
     not a tap on a body and must not be, so the gate takes the card off the way
     the game does: roadBail, the same call the walk dial makes on every press. */
  const carded = await city.evaluate(() => {
    const on = () => { const c = document.getElementById('daycard');
      return !!(c && getComputedStyle(c).display !== 'none' && c.classList.contains('roadcard')); };
    const was = on();
    for (let i = 0; i < 3; i++) { try { roadBail(); } catch (e) {} }
    return { was: was, now: on() };
  });
  console.log('  THE CARD: was up ' + carded.was + ', up now ' + carded.now);
  ok('the street is clear to tap (the card comes off the way the walk dial takes it off)', !carded.now);

  /* ---------- THE TAP, WITH A REAL POINTER ON THE REAL CANVAS ----------
     *** A POINT THE FINGER CAN ACTUALLY REACH, AND THAT IS TWO QUESTIONS, NOT ONE. ***
     The frame's own elementFromPoint said CANVAS#cv at a body while the SHELL's
     elementFromPoint at the same screen point said DIV#openInvite -- and the finger
     lands in the shell. Three runs of this gate called a working tap dead because it
     only asked the frame. So the aim is chosen by asking BOTH: the city must say the
     point is on the canvas AND over a hostile body, and the shell must say the point
     is over the city's own iframe. Every candidate body is offered, not just the
     nearest, and each is sampled at several heights, because a sprite is a tall
     rectangle and its top half can be under a banner while its middle is not.

     *** AND THE AIM IS READ IMMEDIATELY BEFORE THE FINGER LANDS. *** A body that is
     WATCHING walks toward you at a third of a cell per beat, so a rectangle read
     three seconds ago is a rectangle the body has left. The tap is tested against
     the CURRENT frame, so the harness aims at the current frame. */
  const frameEl = await (page.frames().find(f => f.name() === 'cityFrame')).frameElement();
  const fbox = await frameEl.boundingBox();
  const candidates = async () => await city.evaluate(() => {
    const r = cv.getBoundingClientRect(), out = [];
    for (const h of (HOST_HIT || [])) {
      for (const f of [0.5, 0.62, 0.74, 0.38]) {
        const cx = h.x + h.w / 2, cy = h.y + h.h * f;
        if (!streetTapFoe(cx, cy)) continue;
        const el = document.elementFromPoint(r.left + cx * r.width / cv.width,
                                             r.top + cy * r.height / cv.height);
        if (!el || el.tagName !== 'CANVAS') continue;
        out.push({ clientX: r.left + cx * r.width / cv.width,
                   clientY: r.top + cy * r.height / cv.height, crew: h.crew && h.crew.at });
      }
    }
    /* somewhere on the glass with NO body on it, for the control tap */
    let empty = null;
    for (const p of [[0.5, 0.86], [0.18, 0.72], [0.82, 0.72], [0.5, 0.62]]) {
      const cx = cv.width * p[0], cy = cv.height * p[1];
      if (streetTapFoe(cx, cy)) continue;
      const el = document.elementFromPoint(r.left + cx * r.width / cv.width,
                                           r.top + cy * r.height / cv.height);
      if (!el || el.tagName !== 'CANVAS') continue;
      empty = { clientX: r.left + cx * r.width / cv.width, clientY: r.top + cy * r.height / cv.height };
      break;
    }
    return { bodies: out, empty: empty };
  });
  const reachable = async (pts) => await page.evaluate((arg) => arg.pts.filter(p => {
    const e = document.elementFromPoint(arg.fx + p.clientX, arg.fy + p.clientY);
    return !!e && e.tagName === 'IFRAME' && e.id === 'cityFrame';
  }), { pts: pts, fx: fbox.x, fy: fbox.y });

  const c0 = await candidates();
  const emptyOK = c0.empty ? (await reachable([c0.empty]))[0] : null;
  ok('a patch of empty street the finger can reach', !!emptyOK);
  if (emptyOK) {
    /* THE CONTROL TAP, so a pass on the real tap cannot be "any tap starts a fight".
       Three seconds, because the door takes TWO BEATS before it hands over (V205) --
       measured: a 600 ms wait reads a working tap as a dead one. */
    await page.mouse.click(fbox.x + emptyOK.clientX, fbox.y + emptyOK.clientY);
    await sleep(3000);
    ok('a tap on empty street starts nothing', (await page.evaluate(() => window.__M.length)) === 0);
  } else { ok('a tap on empty street starts nothing', false); }

  const c1 = await candidates();
  const good = await reachable(c1.bodies);
  console.log('  BODY POINTS: ' + c1.bodies.length + ' on the canvas, ' + good.length + ' the finger can reach');
  if (!good.length) {
    const why = await page.evaluate((arg) => { const e = document.elementFromPoint(arg.x, arg.y);
      return e ? (e.tagName + '#' + (e.id || '') + '.' + (e.className || '')) : null; },
      c1.bodies.length ? { x: fbox.x + c1.bodies[0].clientX, y: fbox.y + c1.bodies[0].clientY } : { x: 0, y: 0 });
    console.log('  NOTHING REACHABLE. The shell says the first body point is under: ' + why);
    ok('a hostile body the finger can reach', false); return done(browser);
  }
  ok('a hostile body the finger can reach', true);
  const aim = good[0];
  console.log('  AIMING AT crew ' + JSON.stringify(aim.crew) + ' at ' + Math.round(aim.clientX) + ',' + Math.round(aim.clientY));
  await page.mouse.click(fbox.x + aim.clientX, fbox.y + aim.clientY);
  await sleep(3200);
  const msgs = await page.evaluate(() => window.__M);
  console.log('  THE TAP POSTED: ' + JSON.stringify(msgs));
  const tapped = msgs.filter(m => m.why === 'tapped');
  ok('tapping a hostile body starts the fight', tapped.length === 1);
  ok('it is a street board, not a room', tapped.length === 1 && tapped[0].street && !tapped[0].room);
  ok("the crew's own count is who is with him", tapped.length === 1
    && tapped[0].roster === Math.max(1, Math.min(8, placed.count | 0)));

  /* ONE CREW IS ONE FIGHT: tap the same body again */
  await page.mouse.click(fbox.x + aim.clientX, fbox.y + aim.clientY);
  await sleep(3000);
  const again = await page.evaluate(() => window.__M.length);
  ok('one crew is one fight, a second tap posts nothing', again === msgs.length);

  /* ---------- GRACE IS UNTOUCHED FOR THE BUMP PATH ---------- */
  const grace = await city.evaluate(() => {
    /* drive the SHIPPED streetFightOnStep with the step counter back inside the
       grace window; it must refuse, because being jumped on your own doorstep is
       what SF_GRACE is for and the tap is not that */
    let out = {};
    try { SF_STEPS = 0; SF_LAST = -9999; CITY_CONTACT_POSTED = false;
      out.grace = SF_GRACE; out.fired = !!streetFightOnStep(); out.steps = SF_STEPS; } catch (e) { out.threw = String(e); }
    return out;
  });
  console.log('  GRACE: ' + JSON.stringify(grace));
  ok('the bump path still refuses inside its grace window', grace.fired === false && grace.grace > 0);

  /* ---------- THE BELL SAYS A FIGHT HAS STARTED ---------- */
  await sleep(5000);
  let bell = null;
  for (const f of page.frames()) {
    let g = null;
    try { g = await f.evaluate(() => { if (typeof G === 'undefined' || typeof G.lastRead === 'undefined') return null;
      return { t: G.lastRead && G.lastRead.t, s: G.lastRead && G.lastRead.s, teach: !!G.teachBeat,
        enemies: (G.e || []).length }; }); } catch (e) {}
    if (g && g.enemies !== undefined && g.t) bell = g;
  }
  console.log('  AT THE BELL: ' + JSON.stringify(bell));
  ok('the fight itself says a fight has started', !!bell && bell.t === 'A FIGHT HAS STARTED');
  ok('and it names what to press', !!bell && /FIRE/.test(String(bell.s || '')));

  console.log('  page errors: ' + JSON.stringify(errors.slice(0, 4)));
  ok('no page errors', errors.length === 0);
  await done(browser);
})();
