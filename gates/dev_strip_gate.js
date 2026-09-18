#!/usr/bin/env node
/* ============================================================================
   THE WORKSHOP IS BEHIND THE GEAR -- ON THE ALPHA AND ON THE CUT
   (9/16/26, COMBAT lane, VAMILY [dev strip] / [eyes: dev strip])

   EYES E26 round 7 walked the DEPLOY CUT, reproduced it on two walks and
   photographed it: a real fight arrives with WAIT, SUPPRESS, HAND-PEEK: OFF and NEW
   ENCOUNTER across the top of it, above the health bar.

   PAOLO 9/13: "this glitchy buggy AI experience where nothing's complete."

   *** AMENDED 9/18, AND THE AMENDMENT IS THE WHOLE POINT OF THE ROW. *** The first
   version of this gate ran on the ALPHA and the row asks for something else in its
   own words: "the gate opens a real fight ON THE CUT and finds none of the five."
   Proving something on the workshop is not proving it on the thing he opens -- that
   is the gap EYES keeps catching the whole fleet in. So this now walks BOTH, with the
   cut built fresh from the current workshop by the cutter's own --out flag, which
   never touches the committed demo.

   On each surface it asks TWO questions that must both be true, because either alone
   is a way to cheat:

     1. is the workshop off HIS screen                 (the row's complaint)
     2. does every one of those controls STILL WORK    (or I made three dead buttons
                                                        out of three live ones)

   A gate that only asked the first would pass if I deleted them, and deleting a
   control without his word is the thing this shop does not do.
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const http = require('http');
const { execFileSync } = require('child_process');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.join(__dirname, '..');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const CUT = path.join(process.env.TMPDIR || '/tmp', 'bohemia_dev_strip_cut.html');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json',
  '.css': 'text/css', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
function serve() {
  return new Promise(res => {
    const srv = http.createServer((rq, rp) => {
      const u = decodeURIComponent((rq.url || '/').split('?')[0]);
      /* the DEMO path serves the cut this gate just built, so the committed file is
         never read and never written -- only RUN re-cuts that one (rule 14a) */
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
const done = async (b) => { if (b) await b.close();
  console.log('=== DEV STRIP GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0); };

/* the tools this was built with */
const WORKSHOP = ['peekbtn', 'newenc', 'arenabtn'];
/* and the game, which stays */
const VERBS = ['waitbtn', 'suppressbtn'];

/* *** FOUR THINGS ABOUT THE CUT THAT THE ALPHA NEVER TAUGHT ME, all measured this
   round and all of them silently turn a check into nothing:
     1. THE DEMO'S IFRAMES HAVE NO NAME. Any gate that finds a frame by name works on
        the alpha and finds nothing on the cut.
     2. MORE THAN ONE FRAME ANSWERS TO THE CITY'S URL AND ONLY ONE IS ALIVE. find()
        took a dead one and reported an empty world for eighty seconds.
     3. AN EAGER POLLER STARVES THE BOOT. Asking twelve frames every 400 ms on a
        single-threaded page kept the world from ever coming up -- the same shape as
        EYES' own finding that their sampling loop cost 8% of the freeze.
     4. THE CITY FRAME DOES NOT EXIST FOR THE FIRST HALF MINUTE. At 6 s the frame list
        has no city in it at all; by 29 s it does.
   So the live city is whichever frame ANSWERS, asked gently, after a wait. *** */
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

async function walkAndCheck(browser, BASE, where, url) {
  console.log('\n--- ' + where + ' ---');
  const page = await browser.newPage({ viewport: { width: 430, height: 932 } });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e).slice(0, 160)));
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

  /* a real fight, started the way he starts one: walk up to a crew and tap one */
  const placed = await city.evaluate(() => {
    const list = BohemiaHostiles.near({ seed: (typeof seed !== 'undefined' ? seed : 0), at: [hx, hy],
      radius: 60, probe: hostileProbe, danger: hostDanger(), density: HOST_DENSITY, day: (T.day | 0) });
    const c = list.map(x => ({ at: x.at, d: Math.max(Math.abs(x.at[0] - hx), Math.abs(x.at[1] - hy)) }))
      .sort((a, b) => a.d - b.d)[0];
    if (!c) return null;
    window.__CITY.human(c.at[0], c.at[1] + 5);
    return { crew: c.at };
  });
  if (!placed) { ok(where + ': a crew to walk up to', false); await page.close(); return; }
  await sleep(2500);
  const fb = await (await city.frameElement()).boundingBox();
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
  if (!aim) { ok(where + ': a hostile body on the glass to tap', false); await page.close(); return; }
  await page.mouse.click(fb.x + aim.x, fb.y + aim.y);
  await sleep(9000);
  const cf = await liveFight(page);
  if (!cf) { ok(where + ': the fight came up', false); await page.close(); return; }
  ok(where + ': a real fight, started the way he starts one', true);

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
  console.log('  strip ' + screen.chudPx + ' px of ' + screen.viewportPx);
  console.log('  HE CAN READ: ' + JSON.stringify(screen.readable.slice(0, 10)));

  ok(where + ': *** THE TOOLS THIS WAS BUILT WITH ARE NOT ON HIS SCREEN *** '
    + '(HAND-PEEK, NEW ENCOUNTER and ARENA, the three EYES photographed)',
    !screen.settingsOpen && WORKSHOP.every(id => screen.workshop[id] === 'not on screen'));
  ok(where + ': and none of them was deleted to get there: every one still exists',
    WORKSHOP.every(id => screen.workshop[id] !== 'absent'));
  ok(where + ': the game is still on the strip, where his thumb expects it',
    VERBS.every(id => screen.verbs[id] === 'ON HIS SCREEN'));
  ok(where + ': the strip is smaller than the 181 px it was (' + screen.chudPx + ' px)',
    screen.chudPx !== null && screen.chudPx < 150);
  ok(where + ': *** AND NO DEVELOPER STRING IS LEFT IN ANYTHING HE CAN READ *** -- the '
    + 'last one was SHOVE hostile_0, a variable name on a button a stranger presses',
    screen.devStrings.length === 0);

  /* ---------- 2. AND THEY STILL WORK WHERE THEY LANDED ---------- */
  const fbox = await (await cf.frameElement()).boundingBox();
  await cf.evaluate(() => { const s = document.getElementById('settings'); if (s) s.classList.remove('hidden'); });
  await sleep(700);
  const home = await cf.evaluate((w) => {
    const o = { moved: window.__WORKSHOP_MOVED, inRow: {} };
    const row = document.getElementById('workshoprow');
    for (const id of w) { const e = document.getElementById(id);
      o.inRow[id] = !!(e && row && row.contains(e) && e.offsetParent !== null); }
    return o;
  }, WORKSHOP);
  ok(where + ': all three are in the workshop group, reachable once he opens the gear',
    home.moved === 3 && WORKSHOP.every(id => home.inRow[id]));

  const pressed = {};
  for (const id of WORKSHOP) {
    const before = await cf.evaluate((i) => { const e = document.getElementById(i);
      const b = e.getBoundingClientRect();
      return { x: b.x + b.width / 2, y: b.y + b.height / 2, label: (e.textContent || '').trim(),
        read: (G.lastRead && G.lastRead.t) || '' }; }, id);
    await page.mouse.click(fbox.x + before.x, fbox.y + before.y);
    await sleep(1300);
    const after = await cf.evaluate((i) => { const e = document.getElementById(i);
      return { open: !document.getElementById('settings').classList.contains('hidden'),
        label: e ? (e.textContent || '').trim() : 'gone', read: (G.lastRead && G.lastRead.t) || '' }; }, id);
    pressed[id] = { moved: before.label !== after.label || before.read !== after.read, panelOpen: after.open };
  }
  console.log('  PRESSED: ' + JSON.stringify(pressed));
  ok(where + ': *** AND THEY STILL DO WHAT THEY DID, so this moved them and did not '
    + 'kill them *** -- the panel stayed open and the fight moved under every press',
    WORKSHOP.every(id => pressed[id].moved && pressed[id].panelOpen));

  ok(where + ': no page errors through the whole round trip', errors.length === 0);
  if (errors.length) console.log('  page errors: ' + JSON.stringify(errors.slice(0, 4)));
  await page.close();
}

(async () => {
  /* BUILD THE CUT THE DEPLOY WOULD BUILD, from the current workshop, into a temp file.
     --out never opens the committed demo, so rule 14(a) is untouched and nothing this
     gate does can change what the deploy publishes. */
  try {
    execFileSync('node', [path.join(REPO, 'tools/bohemia_cut_the_demo.js'), '--out', CUT],
      { cwd: REPO, stdio: 'pipe' });
  } catch (e) {
    console.log('  could not build the cut: ' + String(e).slice(0, 160));
  }
  ok('the deploy cut was built from the current workshop, without touching the committed demo',
    fs.existsSync(CUT) && fs.statSync(CUT).size > 1000000);

  const browser = await chromium.launch();
  const SRV = await serve();
  const BASE = 'http://127.0.0.1:' + SRV.address().port;
  await walkAndCheck(browser, BASE, 'THE WORKSHOP', '/slices/BOHEMIA_ALPHA_0_9.html');
  await walkAndCheck(browser, BASE, 'THE CUT HE OPENS', '/slices/BOHEMIA_DEMO.html');
  await done(browser);
})();
