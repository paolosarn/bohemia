/* ============================================================================
   THE COLD HAND (9/5/26, RUN lane) -- VAMILY [cold hand] / BB-COLD-HAND.

   THE TEST IN ONE SENTENCE, and it is the row's own:
       A COLD HAND PRESSES THE LOUDEST THING ON SCREEN AND NEVER READS.
       If doing that repeatedly does not advance the game, the screen is broken
       however good the systems behind it are.

   IT WAS RUN ONCE, BY HAND, ON 8/25, AND IT FOUND A TOTAL DEAD END IN THE FIRST
   MINUTE OF THE GAME. Written into the walked surface that day: "from a cold
   boot it went WATCH, GET UP, then DROP IN / CITY / DROP IN / CITY ten times and
   stopped. PHONE OPENED 0. JOB TAKEN 0. CLOCK 06:00 AT THE FIRST TAP AND 06:00
   AT THE TWELFTH." A simulated stranger pressed the biggest button twelve times
   and the game's clock never moved.

   The cause was found and fixed properly -- the phone had rung as a dark chip
   with a 14px dot, and a dot is a sign on a door. THE FIX IS NOT THE FINDING,
   THE TEST IS. It was never a gate, it was never repeatable, and nothing has run
   it since: not on the cold open, the first morning, the job offer, or the
   reckoning. NOBODY HAS ASKED WHAT A SECOND RUN WOULD FIND. This is the second
   run, and every run after it.

   ---- WHAT "LOUDEST" MEANS, MECHANICALLY --------------------------------------
   A test that needs a human to point at the loud thing is the one-off we already
   had. So loudness is computed, and it is deliberately crude because a stranger's
   eye is crude: AREA FIRST, then how far the control's own fill sits from the
   page behind it. Big and bright beats small and quiet, which is what a thumb
   goes for on a phone before any word is read.

   *** AND IT NEVER READS. *** No text is matched, anywhere in here. The moment a
   harness picks a button because it says GO, it has stopped simulating somebody
   who does not know the game and started simulating somebody who does -- which
   is precisely the difference between this and THE WHOLE DEMO gate.

   ---- IT IS SERVED, NOT OPENED ------------------------------------------------
   Off disk the demo's own same-origin injections silently no-op, so a gate that
   drives it from file:// measures a build no player gets (proved 9/5, see
   gates/demo_is_current_gate.js). And the readiness check waits for something
   defined at the END of the city's script, because DAY.day >= 1 is true part way
   through it and four probes were fooled by that in one round.

   ---- MUTATION PROOF, run 9/5 -------------------------------------------------
     * freeze the clock (advance() returns early) -> both advance claims red
     * make the walk pad unpressable (pointer-events:none) -> both red AND THE
       TRAIL REPRODUCES THE 8/25 SHAPE EXACTLY: a two-control cycle, blstack /
       dcgo / blstack / dcgo, thirty-eight times, clock frozen at 06:00. That is
       the historical bug, caught by name, with the press trail printed.

   ---- AND THREE TIMES MY OWN HAND WAS THE BROKEN THING ------------------------
   Written down because the first three runs of this gate all reported the 8/25
   dead end and ALL THREE WERE WRONG:
     1. every button scored on its own, so eight 44x44 walk arrows came out
        quieter than one 104x31 information chip. Nobody sees eight buttons where
        a d-pad is.
     2. grouped by the parent's bounding BOX, so a column of four buttons spread
        down the left edge (73,284) beat the d-pad (32,400) on the empty space
        between them. Empty space is not loud; the fix is to sum the ink.
     3. pressed with a synthetic el.click(). THE WALK PAD DOES NOT LISTEN FOR
        CLICK -- it listens for pointer/touch -- so the hand mashed the d-pad
        thirty-eight times and the clock never moved.
   The third is the dangerous one: IT PRODUCED A FALSE POSITIVE THAT AGREED WITH
   A KNOWN HISTORICAL BUG, which is the single easiest thing in this repo to
   believe without checking. A harness that presses in a way no thumb presses is
   not a thumb.
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
  console.log('THE COLD HAND: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
};

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

/* HOW MANY TIMES THE HAND PRESSES. The 8/25 run stopped at twelve and that was
   enough to find the dead end; this presses more so a slow advance still counts
   as an advance, and it reports where the clock was at each stretch. */
const PRESSES = 40;

/* THE LOUDEST THING ON SCREEN. Runs inside the page. Reads no text. */
const LOUDEST = function () {
  const vis = el => {
    const r = el.getBoundingClientRect(), s = getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity < 0.15) return false;
    if (r.width < 8 || r.height < 8) return false;
    if (r.bottom <= 0 || r.top >= innerHeight || r.right <= 0 || r.left >= innerWidth) return false;
    if (s.pointerEvents === 'none') return false;
    return true;
  };
  const lum = c => {
    const m = String(c).match(/[\d.]+/g);
    if (!m || m.length < 3) return null;
    if (m.length >= 4 && +m[3] < 0.08) return null;      /* transparent is not a fill */
    return (0.2126 * +m[0] + 0.7152 * +m[1] + 0.0722 * +m[2]) / 255;
  };
  const pageLum = lum(getComputedStyle(document.body).backgroundColor);
  const base = pageLum === null ? 0.1 : pageLum;
  const sel = 'button,[role=button],a,[onclick],.btn,.pb,.dcgo,.dcbtn,.dcx,.tab,'
            + '#front,#openWatch,#openNot,#modechip,#sleepbtn,#bikebtn,#rungbtn,#packbtn';
  /* *** A CLUSTER OF CONTROLS IS ONE CONTROL TO AN EYE. *** The first run of this
     scored every button on its own and the eight walk arrows came out at 44x44
     each, quieter than a 104x31 information chip. That is a fact about my model,
     not about the screen: nobody looking at a phone sees eight buttons where a
     d-pad is, they see a d-pad. So three or more pressable siblings under one
     parent are scored as their parent's bounding area, and the press lands on a
     child -- a different child each time, because a thumb mashes around rather
     than hitting the same arrow forty times.
     THIS WAS FIXED ON ITS OWN MERITS AND BEFORE THE RESULT WAS RE-READ, because
     changing the ruler until the answer comes out right is the exact trap this
     lane has fallen into eight times. */
  const groups = new Map();
  document.querySelectorAll(sel).forEach(el => {
    if (!vis(el)) return;
    const p = el.parentElement; if (!p) return;
    if (!groups.has(p)) groups.set(p, []);
    groups.get(p).push(el);
  });
  let best = null;
  groups.forEach((kids, parent) => {
    if (kids.length < 3) return;
    /* *** THE INK, NOT THE BOX. *** The first grouping used the parent's bounding
       rectangle and picked a column of four buttons spread down the left edge
       (186x394 = 73,284) over the d-pad (180x180 = 32,400) -- because most of
       that rectangle is the empty space BETWEEN the buttons, and empty space is
       not loud. A tight cluster is one control; a tall stack is four separate
       ones with air between them. Summing what is actually painted tells those
       apart without a special case for either. */
    let area = 0;
    for (let i = 0; i < kids.length; i++) {
      const kb = kids[i].getBoundingClientRect();
      area += Math.max(0, Math.min(kb.width, innerWidth)) * Math.max(0, Math.min(kb.height, innerHeight));
    }
    if (area < 64) return;
    /* rotate through the children so the hand does not jam one arrow */
    const n = (window.__COLD_N = ((window.__COLD_N | 0) + 1));
    const kid = kids[n % kids.length];
    const kr = kid.getBoundingClientRect();
    const cx = Math.min(innerWidth - 1, Math.max(0, kr.x + kr.width / 2));
    const cy = Math.min(innerHeight - 1, Math.max(0, kr.y + kr.height / 2));
    const top = document.elementFromPoint(cx, cy);
    if (!top || (top !== kid && !kid.contains(top) && !top.contains(kid))) return;
    const l = lum(getComputedStyle(kid).backgroundColor);
    const contrast = l === null ? 0 : Math.abs(l - base);
    const score = area * (1 + 2 * contrast);
    if (!best || score > best.score) {
      best = { score: score, area: Math.round(area), x: cx, y: cy, el: kid,
               id: parent.id || '', cls: String(parent.className || '').slice(0, 24),
               tag: parent.tagName.toLowerCase(), group: kids.length };
    }
  });
  document.querySelectorAll(sel).forEach(el => {
    if (!vis(el)) return;
    const r = el.getBoundingClientRect();
    /* only what a thumb could actually land on: the topmost thing at its centre
       has to be this element, or something inside it */
    const cx = Math.min(innerWidth - 1, Math.max(0, r.x + r.width / 2));
    const cy = Math.min(innerHeight - 1, Math.max(0, r.y + r.height / 2));
    const top = document.elementFromPoint(cx, cy);
    if (!top || (top !== el && !el.contains(top) && !top.contains(el))) return;
    const area = Math.min(r.width, innerWidth) * Math.min(r.height, innerHeight);
    const l = lum(getComputedStyle(el).backgroundColor);
    /* AREA FIRST, CONTRAST SECOND. A stranger's eye is crude and so is this. */
    const contrast = l === null ? 0 : Math.abs(l - base);
    const score = area * (1 + 2 * contrast);
    if (!best || score > best.score) {
      best = { score: score, area: Math.round(area), x: cx, y: cy, el: el,
               id: el.id || '', cls: String(el.className || '').slice(0, 24),
               tag: el.tagName.toLowerCase() };
    }
  });
  /* *** TAG IT SO A REAL TAP CAN FIND IT. ***
     The first three runs pressed with a synthetic el.click(). The walk pad does
     not listen for click -- it listens for pointer/touch (startHold/endHold) --
     so the hand mashed the d-pad thirty-eight times, the clock never moved, and
     it read exactly like the 8/25 dead end. IT WAS MY HAND THAT WAS BROKEN, NOT
     THE SCREEN. Tenth broken ruler on this lane in two weeks, and the most
     dangerous kind yet: it produced a false positive that AGREED WITH A KNOWN
     HISTORICAL BUG, which is the single easiest thing in this repo to believe
     without checking. A harness that presses in a way no thumb presses is not a
     thumb. */
  document.querySelectorAll('[data-coldhand]').forEach(e => e.removeAttribute('data-coldhand'));
  if (best && best.el) { best.el.setAttribute('data-coldhand', '1'); delete best.el; }
  return best;
};

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

    /* the hand's first press is on the front door, and it finds it the same way
       it finds everything else -- by size, not by reading it */
    const first = await page.evaluate(LOUDEST);
    ok('a cold hand can find something to press on the very first screen ('
      + (first ? (first.id || first.tag) + ', ' + first.area + 'px2' : 'nothing')
      + ')', !!first);

    const clock = async () => {
      const f = page.frames().find(x => x.name() === 'cityFrame');
      if (!f) return null;
      try {
        return await f.evaluate(() => (typeof T === 'undefined') ? null
          : { day: T.day, min: T.min });
      } catch (e) { return null; }
    };

    /* ---- THE HAND ------------------------------------------------------- */
    const seen = [];          /* what it pressed, in order, by id */
    let firstClock = null, lastClock = null, tailStart = null;
    let cityUp = false;

    for (let i = 0; i < PRESSES; i++) {
      /* look at BOTH surfaces -- the shell and the walked world -- and press
         whichever holds the louder thing, because the player sees one screen */
      const shell = await page.evaluate(LOUDEST);
      let frame = null, inCity = null;
      const cf = page.frames().find(x => x.name() === 'cityFrame');
      if (cf) {
        cityUp = true;
        try { inCity = await cf.evaluate(LOUDEST); } catch (e) { inCity = null; }
        frame = cf;
      }
      const useCity = inCity && (!shell || inCity.score > shell.score);
      const pick = useCity ? inCity : shell;
      if (!pick) { seen.push('(nothing)'); break; }
      seen.push((useCity ? 'city:' : 'shell:') + (pick.id || pick.cls || pick.tag));
      const target = useCity ? frame : page;
      /* A REAL TAP, on the element the eye picked. Never a synthetic click. */
      try { await target.tap('[data-coldhand]', { timeout: 3000 }); }
      catch (e) {
        try { await target.click('[data-coldhand]', { timeout: 3000 }); } catch (e2) { }
      }
      await SETTLE(page, useCity ? 320 : 700);
      const c = await clock();
      if (c) { if (!firstClock) firstClock = c; lastClock = c; }
      if (i === PRESSES - 13) tailStart = c;      /* the last twelve, on their own */
    }

    /* ---- WHAT IT FOUND --------------------------------------------------- */
    ok('pressing the loudest thing gets a cold hand into the walked world at all',
       cityUp === true);

    const moved = !!(firstClock && lastClock
      && (lastClock.day !== firstClock.day || lastClock.min !== firstClock.min));
    ok('*** THE GAME ADVANCES UNDER A COLD HAND *** -- clock '
      + (firstClock ? firstClock.day + 'd ' + firstClock.min + 'm' : '?') + ' -> '
      + (lastClock ? lastClock.day + 'd ' + lastClock.min + 'm' : '?')
      + ' over ' + PRESSES + ' presses. This is the exact assertion that was '
      + 'false on 8/25: 06:00 at the first tap and 06:00 at the twelfth', moved);

    /* THE DEAD END THE 8/25 RUN ACTUALLY HIT was DROP IN / CITY / DROP IN / CITY
       forever WITH A FROZEN CLOCK. The first version of this check counted how
       many DIFFERENT controls the last twelve presses touched, and that is the
       wrong proxy: a stranger who has found the walk pad presses ONE control for
       the rest of the session, and that is the game working perfectly. It failed
       the healthy case and would have passed a screen that cycles two buttons
       while the world advances on a timer.
       SO IT ASKS THE THING THE PROXY STOOD FOR: over the LAST twelve presses, on
       their own, is the game still moving. "It advanced once and then died" is
       the failure, and this is what sees it. */
    const tail = seen.slice(-12);
    const tailMoved = !!(tailStart && lastClock
      && (lastClock.day !== tailStart.day || lastClock.min !== tailStart.min));
    ok('*** AND IT IS STILL ADVANCING AT THE END, NOT JUST AT THE START *** -- '
      + 'over the last twelve presses the clock went '
      + (tailStart ? tailStart.day + 'd ' + tailStart.min + 'm' : '?') + ' -> '
      + (lastClock ? lastClock.day + 'd ' + lastClock.min + 'm' : '?')
      + ' (' + new Set(tail).size + ' distinct controls, which is REPORTED not '
      + 'asserted: a stranger who found the walk pad presses one thing forever '
      + 'and that is correct)', tailMoved);

    ok('the hand reached more than one screen over the run ('
      + new Set(seen).size + ' distinct controls)', new Set(seen).size >= 2);
    ok('and nothing threw while it pressed'
      + (errs.length ? ' -- first: ' + errs[0] : ''), errs.length === 0);

    /* REPORTED, NOT ASSERTED: the full press trail, so a future failure can be
       read rather than guessed at. */
    console.log('  cold hand trail: ' + seen.join(' > '));

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
