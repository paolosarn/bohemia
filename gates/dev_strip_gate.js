#!/usr/bin/env node
/* ============================================================================
   THE WORKSHOP IS BEHIND THE GEAR
   (9/16/26, COMBAT lane, VAMILY [eyes: dev strip])

   EYES E26 round 7 walked the DEPLOY CUT, reproduced it on two walks and
   photographed it: a real fight arrives with WAIT, SUPPRESS, HAND-PEEK: OFF and NEW
   ENCOUNTER across the top of it, above the health bar.

   PAOLO 9/13: "this glitchy buggy AI experience where nothing's complete."

   So this gate starts a real fight the way he starts one -- walking up to a crew and
   tapping one -- and then asks TWO questions that have to both be true, because
   either one alone is a way to cheat:

     1. is the workshop off HIS screen                 (the row's complaint)
     2. does every one of those controls STILL WORK    (or I made three dead buttons
                                                        out of three live ones)

   A gate that only asked the first would pass if I deleted them, and deleting a
   control without his word is the thing this shop does not do.
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
  console.log('=== DEV STRIP GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0); };

/* the tools this was built with */
const WORKSHOP = ['peekbtn', 'newenc', 'arenabtn'];
/* and the game, which stays */
const VERBS = ['waitbtn', 'suppressbtn'];

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
    const c = list.map(x => ({ at: x.at, d: Math.max(Math.abs(x.at[0] - hx), Math.abs(x.at[1] - hy)) }))
      .sort((a, b) => a.d - b.d)[0];
    if (!c) return null;
    window.__CITY.human(c.at[0], c.at[1] + 5);
    return { crew: c.at };
  });
  if (!placed) { ok('a crew to walk up to', false); return done(browser); }
  await sleep(1500);
  const fb = await (await (page.frames().find(f => f.name() === 'cityFrame')).frameElement()).boundingBox();
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
  await page.mouse.click(fb.x + aim.x, fb.y + aim.y);
  await sleep(7000);
  const cf = page.frames().find(f => { try { return f.name() === 'combatFrame'; } catch (e) { return false; } });
  if (!cf) { ok('the fight came up', false); return done(browser); }
  ok('a real fight, started the way he starts one', true);

  /* ---------- 1. WHAT IS ON HIS SCREEN ---------- */
  const screen = await cf.evaluate((arg) => {
    /* REACHABLE, not "display is not none". A node inside a hidden panel keeps its
       own computed display, which is how a gate talks itself into a pass -- so this
       asks whether the thing has a box on the page at all. */
    const reach = (id) => { const e = document.getElementById(id);
      if (!e) return 'absent';
      return (e.offsetParent !== null && e.getClientRects().length > 0) ? 'ON HIS SCREEN' : 'not on screen'; };
    const out = { settingsOpen: !document.getElementById('settings').classList.contains('hidden'),
      workshop: {}, verbs: {} };
    for (const id of arg.w) out.workshop[id] = reach(id);
    for (const id of arg.v) out.verbs[id] = reach(id);
    const h = document.getElementById('chud');
    out.chudPx = h ? Math.round(h.getBoundingClientRect().height) : null;
    out.viewportPx = innerHeight;
    /* AND NOT ONE DEVELOPER STRING IN WHAT HE CAN READ */
    const words = [];
    for (const el of Array.from(document.querySelectorAll('button,div,span,select'))) {
      if (el.children.length) continue;
      if (el.offsetParent === null) continue;
      const t = (el.textContent || '').trim();
      if (t) words.push(t);
    }
    out.readable = words;
    out.devStrings = words.filter(t => /hostile_\d|_\d\b|undefined|NaN/.test(t));
    return out;
  }, { w: WORKSHOP, v: VERBS });
  console.log('  THE STRIP: ' + screen.chudPx + ' px of ' + screen.viewportPx
    + '   settings open: ' + screen.settingsOpen);
  console.log('  WORKSHOP: ' + JSON.stringify(screen.workshop));
  console.log('  VERBS:    ' + JSON.stringify(screen.verbs));
  console.log('  HE CAN READ: ' + JSON.stringify(screen.readable.slice(0, 14)));

  ok('*** THE TOOLS THIS WAS BUILT WITH ARE NOT ON HIS SCREEN *** '
    + '(HAND-PEEK, NEW ENCOUNTER and ARENA, the three EYES photographed)',
    !screen.settingsOpen && WORKSHOP.every(id => screen.workshop[id] === 'not on screen'));
  ok('and none of them was deleted to get there: every one still exists',
    WORKSHOP.every(id => screen.workshop[id] !== 'absent'));
  ok('the game is still on the strip: WAIT and SUPPRESS are where his thumb expects them',
    VERBS.every(id => screen.verbs[id] === 'ON HIS SCREEN'));
  ok('the strip is smaller than the 181 px it was (' + screen.chudPx + ' px)',
    screen.chudPx !== null && screen.chudPx < 150);
  ok('*** AND NO DEVELOPER STRING IS LEFT IN ANYTHING HE CAN READ *** -- the last one '
    + 'was SHOVE hostile_0, a variable name on a button a stranger presses',
    screen.devStrings.length === 0);

  /* ---------- 2. AND THEY STILL WORK WHERE THEY LANDED ---------- */
  const fbox = await (await cf.frameElement()).boundingBox();
  await cf.evaluate(() => { const s = document.getElementById('settings'); if (s) s.classList.remove('hidden'); });
  await sleep(600);
  const home = await cf.evaluate((w) => {
    const o = { moved: window.__WORKSHOP_MOVED, inRow: {} };
    const row = document.getElementById('workshoprow');
    for (const id of w) { const e = document.getElementById(id);
      o.inRow[id] = !!(e && row && row.contains(e) && e.offsetParent !== null); }
    return o;
  }, WORKSHOP);
  console.log('  BEHIND THE GEAR: ' + JSON.stringify(home));
  ok('all three moved into the workshop group, and are reachable once he opens the gear',
    home.moved === 3 && WORKSHOP.every(id => home.inRow[id]));

  /* press the three that act, the rule 14(h) way: the panel stays open and something
     the fight owns has to move */
  const pressed = {};
  for (const id of ['peekbtn', 'newenc', 'arenabtn']) {
    const before = await cf.evaluate((i) => { const e = document.getElementById(i);
      const b = e.getBoundingClientRect();
      return { x: b.x + b.width / 2, y: b.y + b.height / 2, label: (e.textContent || '').trim(),
        read: (G.lastRead && G.lastRead.t) || '' }; }, id);
    await page.mouse.click(fbox.x + before.x, fbox.y + before.y);
    await sleep(1300);
    const after = await cf.evaluate((i) => { const e = document.getElementById(i);
      return { open: !document.getElementById('settings').classList.contains('hidden'),
        label: e ? (e.textContent || '').trim() : 'gone', read: (G.lastRead && G.lastRead.t) || '' }; }, id);
    pressed[id] = { moved: before.label !== after.label || before.read !== after.read, panelOpen: after.open,
      was: before.label, now: after.label, read: after.read };
  }
  console.log('  PRESSED: ' + JSON.stringify(pressed));
  ok('*** AND THEY STILL DO WHAT THEY DID, so this moved them and did not kill them. *** '
    + 'The panel stayed open and the fight moved under every press',
    ['peekbtn', 'newenc', 'arenabtn'].every(id => pressed[id].moved && pressed[id].panelOpen));

  console.log('  page errors: ' + JSON.stringify(errors.slice(0, 4)));
  ok('no page errors through the whole round trip', errors.length === 0);
  await done(browser);
})();
