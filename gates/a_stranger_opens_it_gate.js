/* ============================================================================
   A STRANGER OPENS IT (9/5/26, RUN lane) -- BB HANDS-NOW.

   Paolo 9/5: "I do want to get a demo into people's hands immediately though
   but there's so much to do." The lane rule that came with it: THE DEMO IS
   NEVER HELD FOR MORE CONTENT. What exists today is the demo, and every round
   ends with a link that works on a phone.

   WHAT THIS GATE IS FOR, AND WHY IT IS NOT THE WHOLE DEMO GATE.
   THE WHOLE DEMO (23/0) walks the demo end to end -- the origin, the vista, one
   good day -- and it walks it as somebody who knows the way. It presses the
   right thing because it was told which thing is right. That is the correct
   test for "does the day work" and it is the wrong test for "can a person who
   has never seen this get in", because the first thirty seconds of a stranger's
   session are spent on questions the walkthrough already knows the answers to:
   what is this, where do I press, did anything happen when I pressed it.

   SO THIS GATE OPENS THE DEMO COLD. A phone-sized screen, touch events rather
   than clicks, no saved game, no dev knowledge, and it only ever presses what
   the screen itself is offering.

   IT REPORTS EVERY NUMBER IT MEASURES rather than only asserting them. A
   stranger's patience is a real budget and the only way to know it is being
   spent is to see it every run.

   MEASURED 9/5 on the first cold walk, before this gate existed:
     the demo loads in                    572 ms
     tap-to-enter puts a walked world up  1,669 ms
     page errors on the way in            0
     what the front door says             "TAP TO ENTER", and nothing else
     reachable ground on foot from spawn  200,914+ cells (the flood hit its cap)
     the demo on disk vs a fresh cut      byte-identical, so a friend opening
                                          the link gets today's game

   THREE THINGS THIS GATE DELIBERATELY DOES NOT CLAIM.
   1. It does not claim a stranger reaches a fight. THE DEMO IS SCOPED (Paolo
      8/4) to the origin, the vista and one good day; there is no fight in it,
      by his ruling, and a gate that failed on its absence would be enforcing a
      scope he did not set.
   2. It does not claim a card is a bug. Cards are how this game talks, and one
      can arrive at any moment -- measured, the same unmutated build read 17/0
      and then 15/2 on the next run because a card came up during the seconds
      the flood fill takes and sat over the pad. Asserting "no card ever covers
      the controls" is flaky AND wrong. The real claim, and the one the
      historical bug broke, is that a card is DISMISSIBLE and the pad works once
      it is gone.
   3. It does not claim the clock is broken. A first walk read zero minutes over
      160 presses, which looks like a stopped clock and is not one: a human step
      costs 0.084 minutes because it is one small cell, distance-honest, on
      purpose. Checked before it was written down, and that is the only reason
      it is not in here as a bug.

   MUTATION PROOF, run 9/5, re-run after the move to a served build:
     * a transparent scrim over the walk pad -- the exact bug this lane shipped
       and caught once already, when a card's own backdrop sat on the controls
       -> 2 red, and it NAMES THE CULPRIT BY ID ("covered by MUTSCRIM") rather
       than only saying the game stopped working. Still bites after the card
       handling was made non-flaky, which was the thing to check: a claim made
       tolerant of cards must still catch a scrim that is not one.
     * deleting the words "TAP TO ENTER" from the front door -> 1 red, and it
       prints what the screen said instead, which is the whole question a
       stranger's first screen has to answer
     * dropping only the demo's drawer-hide -> 1 red on the drawer claim,
       printing "read: true".

   AND THE HARNESS MISTAKE THAT IS BAKED INTO THE DESIGN HERE: the first cold
   walk pressed all eight directions in turn, measured a net displacement of
   three cells over two hundred taps, and very nearly got written up as "the
   player cannot move". It was walking a circle. The second read the wrong
   position variable entirely -- city.x, which human mode does not use. Both
   were caught by checking the ruler before reporting the reading, which is the
   fifth time in two weeks on this lane. So this gate presses ONE direction.
   ========================================================================== */
'use strict';
const path = require('path');
const fs = require('fs');
const http = require('http');
const ROOT = path.join(__dirname, '..');
const SLICES = path.join(ROOT, 'slices');
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');

/* *** SERVED, NOT OPENED (fixed 9/5, and it was MY OWN BROKEN RULER). ***
   This gate first shipped driving file://, and on file:// IT WAS NOT TESTING
   THE DEMO. The demo does not edit the city file -- ONE SYSTEM, ONE SESSION --
   so the two things that make it safe for a stranger are injected into the city
   frame from the demo side, and both are same-origin. A file:// parent cannot
   reach a file:// frame, the injection lands in a catch, and it silently does
   nothing. Measured on the built demo at 390x844:

       off disk (what this gate used to see)   served (what a player gets)
       walk pad 42x42                          walk pad 44x44
       the builder drawer VISIBLE              the builder drawer hidden

   The drawer opens REROLL, which regenerates the world under a stranger's own
   session. So the gate whose whole job is "what does a stranger meet" was
   reporting green about a screen with a destroy-my-game button on it that no
   player will ever see. Seventh broken ruler on this lane in two weeks, and the
   worst kind: it was measuring the harness while claiming to measure the game. */
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
               '.png': 'image/png', '.json': 'application/json', '.woff2': 'font/woff2' };
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

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const done = () => {
  console.log('A STRANGER OPENS IT: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
};

/* Ceilings, not targets. Measured cold at 572ms and 1,669ms on this machine;
   these sit well above that because a gate box under load is not a phone, and a
   ceiling that trips on noise gets ignored, which is worse than no ceiling. */
const LOAD_CEIL_MS = 20000;
const WORLD_CEIL_MS = 60000;
/* NOW THAT THIS GATE IS SERVED, the demo's own thumb injection applies and the
   walk pad is the platform minimum. The floor is the real number, not the disk
   one -- holding 42 here would have quietly accepted the un-injected build
   forever, which is the bug this gate just had. */
const PAD_FLOOR_PX = 44;
const APPLE_MIN_PX = 44;
/* a stranger who can only reach a courtyard has not been handed a game. The
   real number is 200,914+; this floor is two orders under it. */
const GROUND_FLOOR = 2000;

(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); return done(); }

  ok('the demo build exists on disk', fs.existsSync(path.join(ROOT, 'slices/BOHEMIA_DEMO.html')));

  const srv = await serve();
  const DEMO = 'http://127.0.0.1:' + srv.address().port + '/BOHEMIA_DEMO.html';
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  /* A REAL PHONE, not a small window: touch events, mobile UA, no mouse. */
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true,
    deviceScaleFactor: 3
  });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));

  try {
    /* ---- 1. THE DOOR ---------------------------------------------------- */
    const t0 = Date.now();
    await page.goto(DEMO, { waitUntil: 'load', timeout: 240000 });
    const loadMs = Date.now() - t0;
    await SETTLE(page, 3000);
    ok('the demo opens on a phone in ' + loadMs + 'ms (ceiling ' + LOAD_CEIL_MS + ')',
       loadMs < LOAD_CEIL_MS);

    const front = await page.evaluate(() => {
      const vis = el => {
        if (!el) return false;
        const r = el.getBoundingClientRect(), s = getComputedStyle(el);
        return s.display !== 'none' && s.visibility !== 'hidden' && +s.opacity > 0.05
          && r.width > 4 && r.height > 4 && r.bottom > 0 && r.top < innerHeight;
      };
      const f = document.getElementById('front');
      const out = { hasFront: vis(f), title: document.title };
      out.frontArea = f ? Math.round(f.getBoundingClientRect().width
                                   * f.getBoundingClientRect().height) : 0;
      /* what does the screen actually SAY before he touches it? */
      const said = [];
      document.querySelectorAll('h1,h2,h3,p,div,span,button').forEach(el => {
        if (!vis(el) || el.children.length) return;
        const t = (el.textContent || '').trim();
        if (t.length < 2 || t.length > 120) return;
        if ((parseFloat(getComputedStyle(el).fontSize) || 0) < 10) return;
        said.push(t.replace(/\s+/g, ' '));
      });
      out.says = said;
      return out;
    });

    ok('the front door is on screen and fills the phone', front.hasFront === true
       && front.frontArea > 390 * 844 * 0.8);
    /* ONE INSTRUCTION, NOT A MENU. A stranger's first screen has to answer one
       question -- where do I press -- and a screen that says six things answers
       none of them. */
    ok('and it tells him what to do in words (' + JSON.stringify(front.says) + ')',
       front.says.length >= 1 && front.says.some(s => /tap|press|start|enter|play/i.test(s)));
    ok('the tab is named, so a shared link is not "untitled" ('
      + front.title + ')', typeof front.title === 'string' && front.title.trim().length > 0);
    ok('nothing threw on the way to the front door'
      + (errs.length ? ' -- first: ' + errs[0] : ''), errs.length === 0);

    /* ---- 2. THE TAP ----------------------------------------------------- */
    const t1 = Date.now();
    await page.tap('#front').catch(async () => { await page.click('#front').catch(() => { }); });
    await SETTLE(page, WORLD_CEIL_MS, async () => {
      const f = page.frames().find(x => x.name() === 'cityFrame');
      if (!f) return false;
      try { return await f.evaluate(() => typeof DAY !== 'undefined' && DAY.day >= 1); }
      catch (e) { return false; }
    });
    const worldMs = Date.now() - t1;
    const city = page.frames().find(x => x.name() === 'cityFrame');
    ok('one tap puts a walked world up, in ' + worldMs + 'ms (ceiling '
      + WORLD_CEIL_MS + ')', !!city && worldMs < WORLD_CEIL_MS);
    if (!city) { await browser.close(); return done(); }

    /* the shell offers the cold open. A stranger in a hurry declines it, and
       declining has to work -- an invite you cannot dismiss is a wall. */
    const declined = await page.evaluate(() => {
      const n = document.getElementById('openNot');
      if (!n) return 'no-invite';
      n.click(); return 'declined';
    });
    await SETTLE(page, 1500);
    ok('the opening cutscene can be declined and the game continues ('
      + declined + ')', declined === 'declined' || declined === 'no-invite');

    /* ---- 3. THE GROUND -------------------------------------------------- */
    /* CLEAR THE MORNING CARD THE WAY A PLAYER DOES, AND KEEP CLEARING IT.
       A single dismissal was enough off disk and is NOT enough served: the
       served boot is slower, so the card can arrive after the one attempt and
       then sit over the controls. That is a harness timing difference, not a
       game bug, and reading it as a game bug is how a gate manufactures a false
       accusation. So this waits for the card to actually be gone. */
    /* A CARD CAN COME BACK, AND THAT IS THE GAME, NOT A BUG. Measured: on the
       served build the same unmutated demo read 17/0 and then 15/2 on the next
       run, because a card arrived during the seconds the flood fill takes and
       sat over the pad. Asserting "no card ever covers the controls" is both
       flaky and wrong -- cards are how this game talks. THE REAL CLAIM, and the
       one the historical bug broke, is that a card is DISMISSIBLE and the pad
       works once it is gone. So this clears them wherever it needs a clear
       screen, and reports how many it met. */
    let cardsMet = 0;
    const seenCards = [];
    const clearCards = async () => {
      for (let i = 0; i < 12; i++) {
        const up = await city.evaluate(() => {
          const c = document.getElementById('daycard');
          if (!c || getComputedStyle(c).display === 'none') return null;
          const txt = (c.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 44);
          const g = c.querySelector('.dcgo') || c.querySelector('.dcbtn') || c.querySelector('.dcx');
          if (g) g.click();
          return txt || '(blank)';
        });
        if (up === null) return i;
        cardsMet++; if (seenCards.length < 4) seenCards.push(up);
        await SETTLE(page, 700);
      }
      return -1;   /* would not go away */
    };
    const firstClear = await clearCards();
    await SETTLE(page, 1200);
    ok('every card he meets can be dismissed -- one is never a wall'
      + (seenCards.length ? ' (' + seenCards.join(' | ') + ')' : ' (none up)'),
      firstClear >= 0);

    const ground = await city.evaluate((CAP) => {
      const sx = hx, sy = hy;
      const walk = (x, y) => { try { const c = cellAt(x, y); return !!(c && c.walk); }
                               catch (e) { return false; } };
      const seen = new Set([sx + ',' + sy]); const q = [[sx, sy]];
      const D = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
      let budget = CAP;
      while (q.length && budget-- > 0) {
        const [x, y] = q.shift();
        for (const [dx, dy] of D) {
          const nx = x + dx, ny = y + dy, k = nx + ',' + ny;
          if (seen.has(k) || !walk(nx, ny)) continue;
          seen.add(k); q.push([nx, ny]);
        }
      }
      return { spawnWalkable: walk(sx, sy), reachable: seen.size, hitCap: budget <= 0 };
    }, GROUND_FLOOR * 4);

    ok('he is standing on ground he can walk off', ground.spawnWalkable === true);
    ok('and the valley opens up rather than boxing him in ('
      + ground.reachable + (ground.hitCap ? '+' : '') + ' cells, floor '
      + GROUND_FLOOR + ')', ground.reachable >= GROUND_FLOOR);

    /* ---- 4. THE THUMB --------------------------------------------------- */
    /* clear whatever arrived while the flood fill ran, then look at the pad */
    const beforeThumb = await clearCards();
    await SETTLE(page, 600);
    ok('and they stay dismissible later in the session too', beforeThumb >= 0);

    const thumb = await city.evaluate(() => {
      const vis = el => {
        if (!el) return false;
        const r = el.getBoundingClientRect(), s = getComputedStyle(el);
        return s.display !== 'none' && s.visibility !== 'hidden' && +s.opacity > 0.05
          && r.width > 4 && r.height > 4;
      };
      const pads = [...document.querySelectorAll('#pad .pb')].filter(vis)
        .map(el => { const r = el.getBoundingClientRect();
                     return { w: Math.round(r.width), h: Math.round(r.height) }; });
      const out = { pads: pads.length, minW: 0, minH: 0 };
      if (pads.length) {
        out.minW = Math.min(...pads.map(p => p.w));
        out.minH = Math.min(...pads.map(p => p.h));
      }
      /* is the pad reachable, or is something sitting on top of it? A card that
         covers the controls is the exact bug this lane shipped and caught once
         already, and it is invisible from the code. */
      const covered = [];
      [...document.querySelectorAll('#pad .pb')].filter(vis).forEach(el => {
        const r = el.getBoundingClientRect();
        const top = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
        if (top !== el && !el.contains(top)) covered.push(top ? (top.id || top.className || top.tagName) : 'null');
      });
      out.covered = covered.slice(0, 4); out.coveredCount = covered.length;
      return out;
    });

    ok('all eight directions are on screen (' + thumb.pads + ')', thumb.pads === 8);
    ok('and NOTHING is sitting on top of them -- every one takes the tap'
      + (thumb.coveredCount ? ' (covered by ' + thumb.covered.join(', ') + ')' : ''),
      thumb.coveredCount === 0);
    ok('the walk buttons are ' + thumb.minW + 'x' + thumb.minH + 'px, the platform '
      + 'minimum (floor ' + PAD_FLOOR_PX + '). Off disk they read 42, because the '
      + 'demo\'s thumb injection is same-origin and cannot apply -- which is why '
      + 'this gate is served',
      thumb.minW >= PAD_FLOOR_PX && thumb.minH >= PAD_FLOOR_PX);

    /* THE ONE THAT IS NOT COSMETIC. The city's toolbar carries a builder drawer
       whose REROLL regenerates the world under the player's own session. The
       demo hides it from its own side; off disk that hide does not apply and it
       sits there in plain view. A stranger meeting a destroy-my-game button is
       exactly what this gate exists to notice. */
    const drawer = await city.evaluate(() => {
      const d = document.getElementById('devbtn');
      return d ? getComputedStyle(d).display !== 'none' : null;
    });
    ok('*** AND THE BUILDER DRAWER IS NOT THERE *** -- REROLL would regenerate '
      + 'the world under his own session (read: ' + drawer + ')', drawer === false);

    /* ---- 5. PRESSING IT MOVES HIM --------------------------------------- */
    /* THE ONE THING A STRANGER TESTS FIRST. Not "does the pad exist" -- does
       anything happen when I press it. Press ONE direction, because pressing
       all eight walks a circle and a circle measures the harness, not the game.
       (That mistake was made on the first walk and caught before it was
       written down.) */
    await clearCards();          /* and once more before the press test */
    const before = await city.evaluate(() => ({ hx, hy }));
    const east = await city.evaluateHandle(() =>
      [...document.querySelectorAll('#pad .pb')].find(b => (b.textContent || '').trim() === '→')
      || document.querySelectorAll('#pad .pb')[2]);
    for (let i = 0; i < 12; i++) {
      try { await east.asElement().tap({ timeout: 3000 }); }
      catch (e) { try { await east.asElement().click({ timeout: 3000 }); } catch (e2) { } }
    }
    await SETTLE(page, 800);
    const after = await city.evaluate(() => ({ hx, hy }));
    const movedBy = Math.abs(after.hx - before.hx) + Math.abs(after.hy - before.hy);
    ok('pressing a direction moves him -- twelve taps east moved him ' + movedBy
      + ' cells, which is the first thing a stranger checks', movedBy >= 1);

    ok('and after all of that the demo has still thrown NOTHING'
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
