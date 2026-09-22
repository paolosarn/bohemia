/* ============================================================================
   ONE SCREEN HOLDS ALL THE LOADING (9/21/26, RUN lane, VAMILY [loading screen]
   part two + [horror loading]; rule 18a LOADING, rule 20h)

   PAOLO 9/8, LOCKED: "we seriously need a loading screen. It's bullshit when I go in
   the demo, all the loading shit that you might need to do, handle it, it's so
   awkward looking."

   MEASURED ON A PHONE-SHAPED CPU (4x) BEFORE ANYTHING WAS WRITTEN, one tap, the
   game's own state read off the live page:

       2.8 s   the door offers
       4.5 s   the door opens on ONE tap      <- part one, holding
      68.3 s   the world has a clock
     113.6 s   the city has drawn a frame
     118.2 s   a person is on the glass
       DOOR TO PLAYABLE 113.7 s, AND THE SCREEN WAS GONE FOR ALL OF IT.

   He tapped a door and got a black rectangle for nearly two minutes. Part one only
   fixed the four tenths of a second in FRONT of that.

   WHAT THIS GATE HOLDS:
     1. THE LOAD DOES NOT WAIT FOR A TAP. Nothing in it needs a gesture.
     2. THE SCREEN STAYS UP while it runs, and SAYS WHAT IT IS DOING -- the game's
        own milestones, read live. NO PERCENTAGE AND NO BAR: the [loading look] row
        rules out a progress bar that lies, by name.
     3. NOTHING IS TAPPABLE UNTIL IT IS LOADED (rule 18a, in those words). A tap
        before BEGIN must not open anything.
     4. IT ENDS ON BEGIN, and one tap reveals a world that is ALREADY drawn with
        people already on it. That tap is the browser's gesture and the one SOUNDS
        built the first hum for.
     5. NOTHING IS SWALLOWED. The first cut of this started the load before the page
        had parsed, buildUI threw, my own catch ate it, and the screen sat on ONE
        MOMENT forever while reporting success. That failure now has a name on the
        window and this gate reads it.

   node gates/the_screen_holds_the_loading_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const ROOT = path.join(__dirname, '..');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const say = (s) => console.log('  ' + s);
const done = () => {
  console.log('THE SCREEN HOLDS THE LOADING: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
};

const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
               '.png': 'image/png', '.json': 'application/json',
               '.webmanifest': 'application/manifest+json',
               '.txt': 'text/plain', '.bq': 'text/plain' };
function serve() {
  return new Promise(res => {
    const s = http.createServer((rq, rs) => {
      const rel = decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, '');
      const f = path.join(ROOT, rel);
      if (f.indexOf(ROOT) !== 0 || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
        rs.statusCode = 404; return rs.end('no');
      }
      rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream');
      fs.createReadStream(f).pipe(rs);
    });
    s.listen(0, '127.0.0.1', () => res(s));
  });
}

(async () => {
  /* ---- THE SOURCE, BOTH SURFACES, because the demo is cut from the alpha and this
     lane has edited the generated file first before now. */
  for (const f of ['slices/BOHEMIA_ALPHA_0_9.html', 'slices/BOHEMIA_DEMO.html']) {
    const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    const n = f.split('/').pop();
    ok(n + ' starts the load without waiting for a tap', /__loadKick|__loadStart/.test(t));
    ok(n + ' refuses a tap before the load is ready',
       /if\(!window\.__LOAD_READY\)\s*return;/.test(t));
    ok(n + ' records a load that throws instead of swallowing it', /__LOAD_THREW/.test(t));
    /* *** AMENDED 9/22 BY HIS OWN VOTE. *** This used to forbid a bar outright. He
       was then shown four loading screens at real phone size and picked B, whose
       sheet says "and the bar is real" in its own words, with his note: "B is best
       not analog horror enough the but keep going". THE BAN WAS NEVER ON A BAR, it
       was on A BAR THAT LIES -- [loading look]'s words are "no progress bar that
       lies". So the check is now the honest one: the bar's fill and its number come
       from STAGES THE PAGE CAN PROVE, and there is no hand-typed percentage
       anywhere near it. A gate that refused his own pick would be enforcing my
       taste over his ruling. */
    ok(n + ' shows a real bar, counted in stages, with no invented percentage',
       /loadfill/.test(t) && /LOAD_LINES\.length/.test(t)
       && !/loadpct[\s\S]{0,200}=\s*['"]\d+\s*%/.test(t));
    ok(n + ' carries his option B: the institution, the log, and the one wrong thing',
       /CLARK COUNTY POWER AUTHORITY/.test(t) && /LOAD_WRONG/.test(t)
       && /NO OPERATOR ON DUTY/.test(t));
  }

  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); return done(); }

  const srv = await serve();
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  try {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3, hasTouch: true, isMobile: true });
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    /* A PHONE, NOT THIS BOX. */
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    const t0 = Date.now();
    await page.goto('http://127.0.0.1:' + srv.address().port + '/slices/BOHEMIA_DEMO.html',
      { waitUntil: 'commit', timeout: 300000 });

    const look = () => page.evaluate(() => ({
      up: (function () { const f = document.getElementById('front');
        return !!f && getComputedStyle(f).display !== 'none'; })(),
      words: ((document.getElementById('fronttap') || {}).textContent || '').trim(),
      started: !!window.__LOAD_STARTED, ready: !!window.__LOAD_READY,
      threw: window.__LOAD_THREW || null,
      frame: !!document.getElementById('cityFrame')
    })).catch(() => ({}));

    /* 1. THE LOAD STARTS WITHOUT A TAP. Nothing is tapped anywhere in this gate
       until BEGIN, so a city frame appearing at all proves it. */
    let seen = {}, saidWhileLoading = [];
    const deadline = Date.now() + 420000;
    let tappedEarly = false;
    while (Date.now() < deadline) {
      const s = await look();
      seen = s;
      if (s.words && saidWhileLoading[saidWhileLoading.length - 1] !== s.words)
        saidWhileLoading.push(s.words);
      if (s.threw) break;
      /* 3. AND A TAP BEFORE BEGIN MUST NOT OPEN ANYTHING. Tried once, for real,
         at the moment the screen is mid-load and looks most like a door. */
      if (!tappedEarly && s.started && !s.ready && s.frame) {
        tappedEarly = true;
        await page.tap('#front').catch(async () => { await page.click('#front').catch(() => { }); });
        await page.waitForTimeout(1500);
        const after = await look();
        ok('*** A TAP BEFORE IT IS READY DOES NOT OPEN THE GAME *** (screen still '
           + (after.up ? 'up' : 'GONE') + ')', after.up === true);
      }
      if (s.ready) break;
      await page.waitForTimeout(500);
    }

    say('the screen said, in order: ' + saidWhileLoading.join('  ->  '));
    ok('the load never threw (' + (seen.threw || 'clean') + ')', !seen.threw);
    ok('the load started on its own, with nothing tapped', seen.started === true);
    ok('*** THE WORLD WAS BUILT BEHIND THE SCREEN, WITHOUT A TAP ***', seen.frame === true);
    ok('*** THE SCREEN STAYED UP WHILE IT LOADED ***', seen.up === true);
    /* 2. IT SAID WHAT IT WAS DOING, and it said more than one thing, or it is a
       static word pretending to be a report. */
    ok('and it said what it was doing, more than once (' + saidWhileLoading.length
       + ' line(s))', saidWhileLoading.length >= 2);
    /* THE BUTTON SAYS WAIT UNTIL IT MEANS BEGIN, which is his option B's own
       sentence: "BEGIN stays dark and says WAIT until the game is genuinely in". */
    ok('and the button said WAIT while it was loading ('
       + JSON.stringify(saidWhileLoading) + ')',
       saidWhileLoading.some(w => /^WAIT$/i.test(w)));

    /* 4. IT ENDS ON BEGIN. */
    ok('*** IT ENDS ON BEGIN *** (it says "' + (seen.words || '-') + '")',
       /^(BEGIN|CONTINUE)/i.test(seen.words || ''));

    /* *** AND IT LOOKS LIKE THE ONE HE PICKED, MEASURED ON THE GLASS. ***
       Photographed before this leg existed and it caught two real defects the
       source could not: the build stamp printed straight THROUGH the WAIT button,
       and the button's top edge sat on the bar. Boxes, not opinions. */
    const frame = await page.evaluate(() => {
      const box = (id) => { const e = document.getElementById(id); if (!e) return null;
        const b = e.getBoundingClientRect();
        return { t: Math.round(b.top), b: Math.round(b.bottom), w: Math.round(b.width) }; };
      const gl = document.getElementById('loadgl');
      return { tap: box('fronttap'), row: box('loadrow'), stamp: box('buildstamp'),
               lines: gl ? Array.from(gl.children).map(d => d.textContent) : [],
               wrong: gl ? Array.from(gl.querySelectorAll('.w')).map(d => d.textContent) : [],
               tube: gl ? getComputedStyle(gl).backgroundImage.indexOf('radial-gradient') >= 0 : false };
    }).catch(() => ({}));
    const clear = (a, b2) => a && b2 && (a.b <= b2.t || b2.b <= a.t);
    ok('the button does not sit on the bar ('
       + JSON.stringify(frame.row) + ' vs ' + JSON.stringify(frame.tap) + ')',
       clear(frame.row, frame.tap));
    ok('and the build stamp does not print through the button ('
       + JSON.stringify(frame.stamp) + ')', clear(frame.tap, frame.stamp));
    ok('the log read from the bottom, in his words ('
       + JSON.stringify((frame.lines || []).slice(0, 3)) + ')',
       (frame.lines || []).length >= 3);
    /* BIBLE R1: ONE wrong thing. Not zero, which is a screenshot; not two, which is
       a haunted house. */
    ok('*** EXACTLY ONE WRONG THING ON THE SCREEN *** ('
       + JSON.stringify(frame.wrong) + ')', (frame.wrong || []).length === 1);
    ok('the tube is curved, so the corners fall away (bible R8)', frame.tube === true);
    const readyAt = ((Date.now() - t0) / 1000).toFixed(1);
    say('ready at ' + readyAt + ' s on a 4x CPU');

    if (!seen.ready) { await browser.close(); srv.close(); return done(); }

    /* AND THE WORLD BEHIND IT IS ALREADY THERE, which is the whole point: the tap
       is a reveal, not the start of two minutes of work. */
    const before = await page.evaluate(() => {
      const f = document.getElementById('cityFrame');
      const w = f && f.contentWindow;
      let drew = 0, painted = false;
      try { drew = (w.BARK_DREW || []).length; } catch (e) { }
      try { const c = w.document.querySelector('canvas'); painted = !!c && c.width > 300; } catch (e) { }
      return { drew, painted };
    }).catch(() => ({ drew: 0, painted: false }));
    ok('*** THE CITY IS ALREADY DRAWN BEFORE HE TAPS ***', before.painted === true);
    ok('*** AND PEOPLE ARE ALREADY ON IT *** (' + before.drew + ')', before.drew > 0);

    /* 5. ONE TAP ON BEGIN, AND HE IS IN. */
    /* *** A RAW TOUCH, NOT page.tap, AND THE DIFFERENCE IS THE MEASUREMENT. ***
       page.tap does actionability work -- hit-testing, scroll-into-view, waiting for
       stability -- and on a 4x-throttled page that work is charged to the number
       this leg reports. Every other gate this lane owns dispatches the touch through
       CDP for exactly that reason. This one did not, and it read 22-25 s for a
       reveal; before blaming the game for that, blame the ruler. */
    const box = await page.evaluate(() => {
      const f = document.getElementById('fronttap') || document.getElementById('front');
      const r = f.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
    const tapAt = Date.now();
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart',
      touchPoints: [{ x: box.x, y: box.y, id: 1 }] });
    await page.waitForTimeout(80);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    let opened = false;
    for (let i = 0; i < 40; i++) {
      opened = await page.evaluate(() => { const f = document.getElementById('front');
        return !f || getComputedStyle(f).display === 'none'; }).catch(() => false);
      if (opened) break;
      await page.waitForTimeout(250);
    }
    const toPlay = ((Date.now() - tapAt) / 1000).toFixed(1);
    ok('*** ONE TAP ON BEGIN OPENS IT ***', opened);
    say('BEGIN TO PLAYING: ' + toPlay + ' s (it was 113.7 s of blank screen)');
    ok('and it is quick, because the work already happened (' + toPlay + ' s)', +toPlay < 30);

    await browser.close(); srv.close();
    done();
  } catch (e) {
    ok('the gate ran to the end [' + String(e.message).slice(0, 180) + ']', false);
    try { await browser.close(); } catch (e2) { }
    try { srv.close(); } catch (e2) { }
    done();
  }
})();
