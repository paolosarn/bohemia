/* ============================================================================
   DEMO IS CURRENT (9/5/26, RUN lane) -- VAMILY [demo current] DEMO-IS-CURRENT.

   THE ROW: "prove the demo cut carries the same city file as the workshop on
   every ship, by hash, in a gate; today it is re-cut by hand."

   THE SHELL HALF WAS ALREADY HELD, and I checked rather than believed the
   comment that says so: tools/bohemia_cut_the_demo.js claims demo_build_gate
   re-runs it with --check and fails if the committed demo is not byte-identical
   to what it produces, and gates/demo_build_gate.js really does call it that
   way (line 160). That is the anti-fork guarantee for the SHELL and it works.

   THE CITY HALF WAS NOT HELD BY ANYTHING. The walked world is not cut into the
   demo, it is LOADED: both surfaces declare `const CITY_SRC=
   'BOHEMIA_CITY_WORLD.html'`, so today they share the world by construction.
   Nothing anywhere asserted that. The repo has a folder of twenty-odd old
   slices sitting next to it -- BOHEMIA_RUN_CURRENT.html is 22 MB and was
   touched today -- and a demo re-pointed at one of those would hand a friend a
   stale valley while the workshop looked fine. That is a silent failure with no
   symptom until somebody plays it.

   *** AND THE BIGGER THING THIS ROW UNCOVERED, WHICH IS WHY THIS GATE SERVES
   THE FILES OVER HTTP INSTEAD OF OPENING THEM OFF DISK. ***

   The demo does not edit the city file -- ONE SYSTEM, ONE SESSION -- so the two
   things that make the demo safe for a stranger are INJECTED into the city
   frame from the demo side at runtime, and both are same-origin operations.
   A file:// parent cannot reach into a file:// frame, the injection lands in a
   catch, and it silently does nothing. Measured on the built demo, 390x844:

       what a gate on file:// sees        what a player over http gets
       ---------------------------        ----------------------------
       walk pad 42x42                     walk pad 44x44
       the builder drawer VISIBLE         the builder drawer hidden

   The drawer is the one that matters. It opens REROLL, which regenerates the
   world underneath a stranger's own session -- a destroyed playthrough, not a
   cosmetic leak. On the surface our gates measure, it is sitting right there.

   SO A GATE THAT DRIVES THE DEMO OFF DISK IS NOT TESTING THE DEMO. It is
   testing a build with the safety layer switched off, and it will report green
   about a screen no player will ever see. The cut tool's own comment predicted
   exactly this ("if a browser ever refuses ... the catch leaves the page
   exactly as it is today"), which makes it the fourth thing this month that was
   written down correctly and enforced by nobody.

   HOW THE HASH CLAIM IS MADE HONESTLY. Hashing the frame's DOM would be wrong
   on its face: the demo injects a stylesheet, so the two DOMs are SUPPOSED to
   differ. What must be identical is the CITY'S OWN CODE. So this reads several
   of the city's functions back as source from inside each running frame --
   what the browser actually parsed and is actually executing -- and hashes
   that. Injected CSS cannot move it. A stale or forked city file cannot help
   but move it.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');

const ROOT = path.join(__dirname, '..');
const SLICES = path.join(ROOT, 'slices');
const CITY = 'BOHEMIA_CITY_WORLD.html';

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const done = () => {
  console.log('DEMO IS CURRENT: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
};
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex').slice(0, 16);

const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
               '.png': 'image/png', '.json': 'application/json', '.woff2': 'font/woff2' };
/* SERVED, NOT OPENED -- see the header. Same shape as thumb_gate's server, on
   purpose: two gates that disagree about how to host the demo would eventually
   disagree about what the demo is. */
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

/* The city's own code, read back from the running frame. Chosen because they
   are load-bearing and they belong to the city file rather than to any shell:
   the walk, the save, the people, and the save version. */
const CODE_PROBE = () => {
  const parts = [];
  const names = ['stepOnce', 'citySnapshot', 'ctPeopleSave', 'cityWalkable', 'applyRestore'];
  for (const n of names) {
    try { parts.push(n + ':' + String(eval(n))); } catch (e) { parts.push(n + ':MISSING'); }
  }
  let v = null; try { v = CITY_SAVE_V; } catch (e) { }
  return { src: parts.join('\n'), saveV: v, url: location.href, names };
};

async function worldOf(page, url) {
  await page.goto(url, { waitUntil: 'load', timeout: 240000 });
  await SETTLE(page, 2500);
  await page.tap('#front').catch(async () => { await page.click('#front').catch(() => { }); });
  await SETTLE(page, 90000, async () => {
    const f = page.frames().find(x => x.name() === 'cityFrame');
    if (!f) return false;
    try { return await f.evaluate(() => typeof DAY !== 'undefined' && DAY.day >= 1); }
    catch (e) { return false; }
  });
  const fr = page.frames().find(x => x.name() === 'cityFrame');
  if (!fr) return null;
  const probe = await fr.evaluate(CODE_PROBE);
  /* what a stranger's session actually exposes, measured on the SERVED build */
  const safety = await fr.evaluate(() => {
    const g = document.getElementById('devbtn');
    const pads = [...document.querySelectorAll('#pad .pb')].map(e => {
      const r = e.getBoundingClientRect();
      return Math.round(Math.min(r.width, r.height));
    });
    return { drawerShown: g ? getComputedStyle(g).display !== 'none' : null,
             padMin: pads.length ? Math.min(...pads) : 0, pads: pads.length };
  });
  return { probe, safety, hash: sha(probe.src) };
}

(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); return done(); }

  /* ---- 1. ON DISK: one world, and both surfaces name it ----------------- */
  const cityPath = path.join(SLICES, CITY);
  ok('the walked world exists on disk', fs.existsSync(cityPath));
  const diskHash = fs.existsSync(cityPath) ? sha(fs.readFileSync(cityPath)) : null;

  const alphaSrc = fs.readFileSync(path.join(SLICES, 'BOHEMIA_ALPHA_0_9.html'), 'utf8');
  const demoSrc = fs.readFileSync(path.join(SLICES, 'BOHEMIA_DEMO.html'), 'utf8');
  const decl = s => (s.match(/const\s+CITY_SRC\s*=\s*'([^']+)'/g) || []);
  const aDecl = decl(alphaSrc), dDecl = decl(demoSrc);
  ok('the workshop names its world exactly once (' + aDecl.join(' | ') + ')',
     aDecl.length === 1);
  ok('the demo names its world exactly once (' + dDecl.join(' | ') + ')',
     dDecl.length === 1);
  ok('AND IT IS THE SAME NAME -- the demo cannot be pointed at one of the '
    + 'twenty-odd old slices sitting beside it', aDecl.length === 1 && dDecl.length === 1
    && aDecl[0] === dDecl[0]);
  ok('and that name is the file that exists (' + CITY + ', sha ' + diskHash + ')',
     aDecl.length === 1 && aDecl[0].indexOf(CITY) >= 0);

  /* ---- 2. THE CUT IS CURRENT -------------------------------------------- */
  /* demo_build_gate owns this claim; it is repeated here because THIS is the
     row named for it, and a second runner of an idempotent check is free. */
  let cutCurrent = false, cutSaid = '';
  try {
    execFileSync('node', [path.join(ROOT, 'tools/bohemia_cut_the_demo.js'), '--check'],
                 { cwd: ROOT, stdio: 'pipe' });
    cutCurrent = true;
  } catch (e) { cutSaid = String((e.stdout || '') + (e.stderr || '')).slice(0, 120); }
  ok('the committed demo is byte-identical to a fresh cut, so the link is '
    + 'today\'s build' + (cutCurrent ? '' : ' -- ' + cutSaid), cutCurrent);

  /* ---- 3. PUBLISHED, or it 404s in production while working on disk ----- */
  /* The 8/6 lesson, in CLAUDE.md in capitals: what Pages publishes is not the
     whole repo. A world that is not in the published set is a demo that works
     here and is a white screen for a friend. */
  const cfg = fs.readFileSync(path.join(ROOT, '_config.yml'), 'utf8');
  ok('the published set carries slices/, which is where the world lives',
     /slices/.test(cfg));

  /* ---- 4. THE REAL SURFACES, SERVED ------------------------------------- */
  const srv = await serve();
  const port = srv.address().port;
  const base = 'http://127.0.0.1:' + port + '/';
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  try {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 },
                                           hasTouch: true, isMobile: true });
    const shopPage = await ctx.newPage();
    const shop = await worldOf(shopPage, base + 'BOHEMIA_ALPHA_0_9.html');
    ok('the workshop puts a walked world up when served', !!shop);

    const demoPage = await ctx.newPage();
    const demo = await worldOf(demoPage, base + 'BOHEMIA_DEMO.html');
    ok('the demo puts a walked world up when served', !!demo);

    if (shop && demo) {
      ok('both frames really loaded ' + CITY + ' (workshop: '
        + shop.probe.url.split('/').pop() + ', demo: '
        + demo.probe.url.split('/').pop() + ')',
         shop.probe.url.endsWith(CITY) && demo.probe.url.endsWith(CITY));
      ok('neither frame is missing the city\'s own code (' + shop.probe.names.length
        + ' functions read back)', shop.probe.src.indexOf('MISSING') < 0
        && demo.probe.src.indexOf('MISSING') < 0);
      /* THE CLAIM THE ROW ASKED FOR, made on running code rather than on
         source text or on a DOM the demo is supposed to change. */
      ok('*** THE FRIEND AND THE WORKSHOP ARE RUNNING THE SAME WORLD *** -- the '
        + 'city\'s own code, hashed live out of both frames: ' + shop.hash + ' vs '
        + demo.hash, shop.hash === demo.hash);
      ok('and the save format agrees across the two (v' + shop.probe.saveV + ' vs v'
        + demo.probe.saveV + ')', shop.probe.saveV === demo.probe.saveV);

      /* ---- 5. AND THE DEMO'S SAFETY LAYER IS ACTUALLY ON --------------- */
      /* The whole reason this gate is served. On file:// both of these read the
         wrong way round and nothing notices. */
      ok('*** THE BUILDER DRAWER IS HIDDEN FROM THE STRANGER *** -- REROLL '
        + 'regenerates the world under their own session, and on a file:// load '
        + 'it is sitting right there', demo.safety.drawerShown === false);
      ok('the workshop KEEPS its drawer, so the demo hid it rather than the city '
        + 'losing it', shop.safety.drawerShown === true);
      ok('and the demo\'s walk pad is the served size, not the disk one ('
        + demo.safety.padMin + 'px across ' + demo.safety.pads + ' buttons; a '
        + 'file:// load reads ' + shop.safety.padMin + ')',
         demo.safety.padMin >= 44);
    }
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
