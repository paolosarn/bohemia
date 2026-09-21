/* ============================================================================
   THE BOOT, MILESTONE BY MILESTONE (9/21/26, RUN lane, VAMILY [loading screen])

   PAOLO 9/8, LOCKED: "we seriously need a loading screen. It's bullshit when I go in
   the demo, all the loading shit that you might need to do, handle it, it's so
   awkward looking." And 9/15, after playing: "it's kinda not running as smoothly as
   I would like, maybe it's cause things are loading in real time."

   PART ONE of this row fixed the DOOR: it says ONE MOMENT until the entry is really
   wired, so the first tap is not a dead press. THE EIGHTY SECONDS BEHIND IT ARE STILL
   THERE, and this is the instrument that says how many there are and where they go.

   FIVE MILESTONES, THE SAME FIVE THE ROW CITES, on a phone-shaped CPU:
     1. the door OFFERS                (it stops saying ONE MOMENT)
     2. the door OPENS                 (one tap, and the splash goes)
     3. the world has a CLOCK          (the walked world's day exists)
     4. the city has DRAWN             (a real frame on the canvas, not a blank one)
     5. a person can be TALKED TO      (there is a body on the street)

   IT TAPS ONCE AND ONLY ONCE, the way a person does, and it does not clear cards,
   because a stranger has no harness. Nothing here is a guess about what is slow: each
   milestone is the game's own state, read off the live page.

   node tools/bohemia_the_boot_milestones_9_21_26.js [--throttle 4] [--file BOHEMIA_DEMO.html]
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const ROOT = path.join(__dirname, '..');

const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf('--' + n); return i < 0 ? d : argv[i + 1]; };
const THROTTLE = +arg('throttle', 4);
const FILE = arg('file', 'BOHEMIA_DEMO.html');

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
  const chromium = require('/opt/node22/lib/node_modules/playwright').chromium;
  const srv = await serve();
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  /* A PHONE, NOT THIS BOX. Every boot number this fleet posted before 9/15 was taken
     on a machine several times faster than the one he plays on. */
  if (THROTTLE > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: THROTTLE });

  const t0 = Date.now();
  const at = () => ((Date.now() - t0) / 1000).toFixed(1);
  const marks = [];
  const mark = (name) => { marks.push({ name, s: +at() }); console.log('  ' + at().padStart(6) + ' s  ' + name); };

  console.log('THE BOOT, ' + FILE + ', CPU x' + THROTTLE + '\n');
  await page.goto('http://127.0.0.1:' + srv.address().port + '/slices/' + FILE,
    { waitUntil: 'commit', timeout: 300000 });

  const waitFor = async (fn, label, budget) => {
    const end = Date.now() + (budget || 300000);
    while (Date.now() < end) {
      let v = false;
      try { v = await fn(); } catch (e) { v = false; }
      if (v) { mark(label); return true; }
      await page.waitForTimeout(250);
    }
    console.log('  ' + '  never'.padStart(6) + '    ' + label);
    marks.push({ name: label, s: null });
    return false;
  };

  /* 1. THE SCREEN OFFERS.
     *** AND "TAP TO ENTER" IS NO LONGER ONE OF THE WORDS THAT COUNTS. *** The first
     run of this tool against part two matched it and marked the screen ready at
     3.1 s -- but the tap was refused, because the string was the OLD painter fighting
     the loader for the same element. Matching a word the screen must never say while
     loading is how an instrument certifies the bug it is meant to catch. */
  await waitFor(() => page.evaluate(() => {
    const f = document.getElementById('fronttap');
    return !!f && /^\s*(BEGIN|CONTINUE)/i.test(f.textContent || '');
  }), 'the screen OFFERS (it says BEGIN)');

  /* 2. ONE TAP, AND IT OPENS */
  await page.tap('#front').catch(async () => { await page.click('#front').catch(() => { }); });
  await waitFor(() => page.evaluate(() => {
    const f = document.getElementById('front');
    return !f || getComputedStyle(f).display === 'none';
  }), 'the world OPENS (one tap on BEGIN)');

  const city = async () => page.frames().find(x => x.name() === 'cityFrame');

  /* 3. THE WORLD HAS A CLOCK */
  await waitFor(async () => {
    const f = await city(); if (!f) return false;
    return f.evaluate(() => typeof DAY !== 'undefined' && typeof DAY.hhmm === 'function');
  }, 'the world has a CLOCK');

  /* 4. THE CITY HAS DRAWN A REAL FRAME.
     NOT "the canvas exists": a sized canvas that has never painted is exactly the
     awkward black rectangle he is complaining about. This samples the pixels. */
  await waitFor(async () => {
    const f = await city(); if (!f) return false;
    return f.evaluate(() => {
      const c = document.querySelector('canvas');
      if (!c || c.width < 300) return false;
      try {
        const g = c.getContext('2d');
        const d = g.getImageData(0, 0, Math.min(64, c.width), Math.min(64, c.height)).data;
        let lit = 0;
        for (let i = 0; i < d.length; i += 4) if (d[i] + d[i + 1] + d[i + 2] > 24) lit++;
        return lit > 64;                       /* something other than black */
      } catch (e) { return false; }
    });
  }, 'the city has DRAWN');

  /* 5. A PERSON IS ON THE GLASS.
     *** THE FIRST CUT OF THIS PROBE ASKED FOR TWO THINGS THAT DO NOT EXIST ***
     -- ctPeople() and a bare PPL -- so it answered false forever and printed
     "never". I know from the walk round that FIVE people are on the first screen,
     so that was my instrument, not the game, and it is exactly the class of lie
     rule 14(g) is about: a selector is a guess.
     BARK_DREW IS THE RENDER'S OWN LIST of who was actually blitted this frame, and
     the file says so in capitals where it is built. Asking the render what it drew
     cannot disagree with the screen. */
  await waitFor(async () => {
    const f = await city(); if (!f) return false;
    return f.evaluate(() => {
      try { return typeof BARK_DREW !== 'undefined' && BARK_DREW && BARK_DREW.length > 0; }
      catch (e) { return false; }
    });
  }, 'a person is ON THE GLASS', 120000);

  /* WHAT HE LOOKED AT WHILE HE WAITED, which is the whole of his complaint. */
  const held = await page.evaluate(() => {
    const f = document.getElementById('front');
    return { splashUp: !!f && getComputedStyle(f).display !== 'none',
             words: (document.getElementById('fronttap') || {}).textContent || '' };
  });

  const m = Object.create(null);
  for (const x of marks) m[x.name] = x.s;
  const door = m['the world OPENS (one tap on BEGIN)'];
  const play = m['a person is ON THE GLASS'] != null ? m['a person is ON THE GLASS']
             : m['the city has DRAWN'];
  console.log('\n  DOOR TO PLAYABLE: ' + (door != null && play != null
    ? (play - door).toFixed(1) + ' s' : 'unmeasured'));
  console.log('  and while that ran, the loading screen was ' + (held.splashUp ? 'UP' : 'GONE')
    + (held.words ? ' saying "' + held.words.trim() + '"' : ''));

  await browser.close(); srv.close();
})();
