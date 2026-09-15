/* ============================================================================
   BOHEMIA THE PEOPLE ARE NOT LATE (9/15/26, PEOPLE lane).
   Bounced back to this lane by EYES AND EARS E26 round 6, on the row
   HE-DID-NOT-SEE-A-SINGLE-HUMAN-BEING:
     "-> PEOPLE [a human being]: the work is EARLIER and UNFROZEN, not MORE."

   PAOLO 9/15, his second play:
     "I didn't see a single human being. Very strange."

   *** AND THE ANSWER IS THAT THE PEOPLE PASS IS NOT THE THING THAT IS LATE. ***
   Measured on the demo, phone profile, armed before any page script runs:

     the city draws its first anything     ~4.9 s
     the first human body                 ~12.7 s
     the gap                               ~7.7 s
     OF THAT GAP, THE MAIN THREAD WAS HELD   100%

   Every millisecond of the wait is the thread being held. Per second, over the
   gap, the canvas drew 3,128 then 3,869 times with zero people, and then SIX
   WHOLE SECONDS WITH NO DRAW OF ANY KIND. That is not a slow crowd, it is a
   stopped game.

   SO THE HALF THAT IS LATE IS NOT THIS LANE'S, and EYES routed that half itself
   (-> PLUMBER [sixty fps], 28.9 s frozen out of the first 300 across 42 freezes).
   THE HALF THAT IS THIS LANE'S IS THE PROMISE THAT IT STAYS THAT WAY: when the
   freeze is fixed, people must already be the first thing painted and not a
   second problem discovered afterwards. That is what this gate holds, and it
   holds it as a RATIO rather than a wall-clock number, so it means the same
   thing on a fast box and on his phone.

   AND MY OWN FIRST TWO INSTRUMENTS WERE WRONG IN THE SAME WAY EYES' WERE, twice
   documented on their own page and now a third time here: a wrap that landed at
   12.9 s reported "the pass has run 0 times" about a pass that had already drawn
   three bodies, and a poller reading PLAYER_CV read it in the SHELL's window
   while the pass lives in the city frame. Both numbers were facts about my tool.
   Everything below is timestamped BY THE PAGE, from an init script, or it is not
   counted.

   WHAT THIS HOLDS:
   A. the instrument can produce a positive and refuses a negative
   B. the wait before the first person is the thread being held, not this lane
   C. it never runs and paints nobody for a reason it invented
   D. the one branch that can draw nobody is the honest one, and it is named

   node gates/the_people_are_not_late_gate.js
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const http = require('http');
const ROOT = path.dirname(__dirname);
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const REC = path.join(ROOT, 'records/BOHEMIA_THE_PEOPLE_ARE_NOT_LATE_9_15_26.txt');

let pass = 0; const fail = []; const notes = [];
function ok(claim, cond, note) {
  if (cond) { pass++; console.log('  ok   ' + claim + (note ? '   ' + note : '')); }
  else { fail.push(claim); console.log('  FAIL ' + claim + (note ? '   ' + note : '')); }
}
function probe(claim, cond) {
  if (cond) { pass++; console.log('  ok   [self-test] ' + claim); }
  else { fail.push('[self-test] ' + claim); console.log('  FAIL [self-test] ' + claim); }
}
function head(t) { console.log('\n' + t); }
function note(t, v) { notes.push('  NOTE  ' + t + (v == null ? '' : '   ' + v)); }
function stripComments(s) {
  return s.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ');
}
function flat(s) { return String(s).replace(/\s+/g, ' '); }
function pw() {
  for (const t of ['playwright', '/opt/node22/lib/node_modules/playwright',
                   '/usr/lib/node_modules/playwright', '/usr/local/lib/node_modules/playwright']) {
    try { return require(t); } catch (e) {}
  }
  throw new Error('playwright not found');
}
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav', '.css': 'text/css', '.svg': 'image/svg+xml' };

(async () => {

  /* ======================================================================== */
  head('A. THE ONE BRANCH THAT CAN DRAW NOBODY, AND IT IS NAMED IN THE FILE');
  /* ======================================================================== */
  const city = fs.readFileSync(CITY, 'utf8');
  const ccode = stripComments(city);
  function bodyOf(src, name) {
    const i = src.indexOf('function ' + name);
    if (i < 0) return '';
    let j = src.indexOf('{', i), d = 0;
    for (let k = j; k < src.length; k++) {
      if (src[k] === '{') d++;
      else if (src[k] === '}') { d--; if (!d) return src.slice(j, k + 1); }
    }
    return '';
  }
  const ppBody = bodyOf(ccode, 'peoplePass');
  probe('the body reader found peoplePass', ppBody.length > 500);
  /* THE ONLY EARLY RETURN IS "THE PLAYER HAS NO BODY YET", and it is the honest
     one: drawing a crowd around a player who is not drawn is worse than waiting.
     A SECOND early return would be a second reason people can be missing, and
     the whole point of this round is that there is only one. */
  const bails = (ppBody.match(/\breturn\s+0\s*;/g) || []).length;
  ok('the people pass has exactly ONE way to draw nobody, so there is only ever '
     + 'one thing to explain when the street is empty', bails === 1,
     bails + ' early return(s)');
  ok('and that one is the player having no body yet, never a cap or a timer',
     /if\s*\(\s*!PLAYER_CV\s*\)\s*return\s+0\s*;/.test(ppBody));
  ok('nothing in the pass waits on a clock of its own', !/setTimeout|Date\.now\(\)\s*[<>]/.test(ppBody));

  /* ======================================================================== */
  head('B. ON THE DEMO: WHEN THE THREAD IS FREE, THE PEOPLE ARE THERE');
  /* ======================================================================== */
  const server = http.createServer((req, res) => {
    const u = decodeURIComponent(req.url.split('?')[0]);
    const f = path.join(ROOT, u.replace(/^\//, ''));
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;
  const { chromium } = pw();
  const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await (await br.newContext({ viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2, isMobile: true, hasTouch: true })).newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 140)));

  /* ARMED IN AN INIT SCRIPT, IN EVERY FRAME, BEFORE ANY PAGE SCRIPT RUNS. There
     is one main thread and the city build holds it, so anything asked from
     outside during the first twenty seconds answers with the moment I asked. */
  await page.addInitScript(() => {
    const W = window, RUNGS = [28, 56, 112, 224];
    W.__firstAny = null; W.__firstBody = null; W.__firstPlayer = null; W.__bodies = 0;
    W.__blocks = []; W.__plantBody = 0; W.__plantOther = 0; W.__plantSelf = 0;
    W.__hookRan = 0;
    const proto = (W.CanvasRenderingContext2D || {}).prototype;
    if (proto && !proto.__pnl) {
      const real = proto.drawImage;
      proto.drawImage = function (img, a, b, c, d) {
        const t = performance.now();
        W.__hookRan++;
        if (W.__firstAny == null) W.__firstAny = +t.toFixed(0);
        /* A BODY IS KNOWN BY THE LADDER'S OWN RUNGS, the same way [a human being]
           found the bubble on somebody's face: square, and one of the four sizes
           a body is ever drawn at. Matching by "big square" saw 4,281 of them.

           *** AND A BODY IS NOT A HUMAN BEING UNTIL YOU KNOW WHOSE IT IS. ***
           Three versions of this instrument counted the PLAYER as the answer to
           "when does he see a person", which is the exact sentence he complained
           about: he saw himself and nobody else. Read off the stack in one run,
           with nothing injected:
             12,639 ms   renderHuman draws directly          THE PLAYER
             16,733 ms   peoplePass draws                    SOMEBODY ELSE
           Four seconds apart. So the pass that drew it is what decides which
           number this is, and the stack is the only thing on this surface that
           can say. */
        if (arguments.length === 5 && c === d && RUNGS.indexOf(c) >= 0) {
          const st = (new Error()).stack || '';
          const mine = st.indexOf('peoplePass') >= 0;
          if (mine) {
            if (W.__firstBody == null) W.__firstBody = +t.toFixed(0);
            W.__bodies++;
          } else if (W.__firstPlayer == null) W.__firstPlayer = +t.toFixed(0);
          if (W.__planting) { if (mine) W.__plantBody++; else W.__plantSelf++; }
        } else if (W.__planting) W.__plantOther++;
        return real.apply(this, arguments);
      };
      proto.__pnl = true;
    }
    /* EYES' HEARTBEAT, REUSED RATHER THAN REWRITTEN (reuse-first): a gap between
       its own ticks IS the main thread being held. */
    W.__last = performance.now();
    W.__beat = setInterval(() => {
      const now = performance.now(), gap = now - W.__last;
      if (gap > 120) W.__blocks.push([+W.__last.toFixed(0), +gap.toFixed(0)]);
      W.__last = now;
    }, 25);
  });

  await page.goto('http://127.0.0.1:' + port + '/slices/BOHEMIA_ALPHA_0_9.html',
                  { waitUntil: 'load' });
  await page.waitForTimeout(600);
  const vp = page.viewportSize();
  await page.mouse.click(vp.width / 2, vp.height / 2);      /* the door */
  await page.waitForTimeout(30000);

  let seen = null;
  for (const f of page.frames()) {
    try {
      const o = await f.evaluate(() => ({ url: location.href, firstAny: window.__firstAny,
        firstBody: window.__firstBody, firstPlayer: window.__firstPlayer,
        bodies: window.__bodies, blocks: window.__blocks, hookRan: window.__hookRan }));
      if (o.firstBody != null) seen = o;
    } catch (e) {}
  }
  ok('the demo booted and the walked city painted', !!seen,
     seen ? seen.url.split('/').pop() : 'no frame ever painted a body');

  if (seen) {
    /* ---- THE INSTRUMENT PROVES ITSELF BEFORE ANY NUMBER IS BELIEVED ------- */
    probe('the draw hook fired at all, so a zero below would be a real zero',
          seen.hookRan > 100);
    const planted = await (async () => {
      for (const f of page.frames()) {
        try {
          const r = await f.evaluate(() => {
            if (typeof window.__plantBody !== 'number') return null;
            const c = document.querySelector('canvas'); if (!c) return null;
            const g = c.getContext('2d'); const im = document.createElement('canvas');
            im.width = im.height = 8;
            window.__planting = true;
            /* planted from a function CALLED peoplePass, so the stack carries the
               name: this is what proves the classifier can produce a positive */
            const peoplePass = function () { g.drawImage(im, 0, 0, 112, 112); };
            peoplePass();
            g.drawImage(im, 0, 0, 112, 112);    /* body-shaped, but not from the pass */
            g.drawImage(im, 0, 0, 704, 704);    /* a ground chunk, not a body */
            g.drawImage(im, 0, 0, 112, 90);     /* not square, not a body */
            window.__planting = false;
            return { body: window.__plantBody, self: window.__plantSelf,
                     other: window.__plantOther };
          });
          if (r) return r;
        } catch (e) {}
      }
      return null;
    })();
    probe('a planted body drawn FROM the people pass is counted as somebody else',
          !!planted && planted.body === 1);
    probe('and the same body drawn from anywhere else is counted as the player, '
          + 'never as somebody else', !!planted && planted.self === 1);
    probe('and a ground chunk and a non-square draw are neither',
          !!planted && planted.other === 2);

    const gap = seen.firstBody - seen.firstAny;
    note('the city drew its first anything at', seen.firstAny + ' ms');
    note('*** the PLAYER appeared at', seen.firstPlayer + ' ms');
    note('*** SOMEBODY ELSE appeared at', seen.firstBody + ' ms');
    note('he was on the glass alone for', (seen.firstPlayer == null ? '?'
         : (seen.firstBody - seen.firstPlayer)) + ' ms');
    note('the wait from the first paint to the first other person', gap + ' ms');

    /* ---- WHAT FILLS THE GAP: THE THREAD, NOT THE PASS --------------------- */
    /* every block that OVERLAPS the window, not just the ones starting in it --
       the first cut of this filtered by start time and under-counted the hold */
    let held = 0;
    for (const [s, g] of seen.blocks) {
      const a = Math.max(s, seen.firstAny), b2 = Math.min(s + g, seen.firstBody);
      if (b2 > a) held += (b2 - a);
    }
    note('of that gap, the main thread was HELD for', held + ' ms ('
         + (gap ? (100 * held / gap).toFixed(0) : '0') + '%)');
    note('blocks over the whole walk', seen.blocks.length + ', totalling '
         + seen.blocks.reduce((a, [, g]) => a + g, 0) + ' ms');

    /* ---- THE CLAIM, AND IT IS A RATIO AND NOT A WALL CLOCK ---------------- */
    /* A wall-clock ceiling would only ever measure this container, which PLUMBER
       proved is several times faster than the thing in his hand. A RATIO means the
       same thing on any box: of the wait before the first person, how much of it
       was the main thread being held rather than this lane being slow.

       *** AND THE FIRST VERSION OF THIS CLAIM WAS ILL-DEFINED AND PASSED TWICE BY
       LUCK. *** It asked "how long after the thread came free did a body land",
       which has no answer when the body lands INSIDE a block -- and it does, because
       drawing is exactly the work that starves the heartbeat. So it silently
       measured back to the end of the PREVIOUS block and read 38 ms, 42 ms, and then
       9,492 ms on a run where nothing about the game had changed. A control aimed at
       something else caught it. A claim that can pass by luck is worse than no
       claim, and this lane has now written that sentence three rounds running. */
    ok('*** THE WAIT BEFORE THE FIRST PERSON IS THE MAIN THREAD BEING HELD, NOT THIS '
       + 'LANE BEING SLOW. *** That is the half of "I did not see a human being" this '
       + 'lane has to keep true: when the freeze is fixed, people must already be the '
       + 'first thing painted and not a second problem found afterwards',
       gap > 0 && held >= gap * 0.9,
       held + ' ms of a ' + gap + ' ms wait was the thread held ('
       + (gap ? (100 * held / gap).toFixed(0) : '0') + '%, floor 90%)');

    /* *** THE TRIPWIRE, AND IT IS A DIFFERENT QUESTION FROM THE RATIO ABOVE. ***
       The ratio DESCRIBES the wait; it cannot catch this lane getting slower,
       because a delay added inside a window that is already mostly blocked keeps
       the ratio high (measured: a three-second delay left it at 100%, a
       ten-second one at 93%). What catches it is the time he is on the glass
       ALONE WHILE THE THREAD IS FREE -- time the game could have spent drawing
       somebody and did not. That is this lane's and nobody else's, and it is the
       literal form of his sentence: he was looking at himself. */
    let aloneHeld = 0;
    if (seen.firstPlayer != null) {
      for (const [s2, g2] of seen.blocks) {
        const a = Math.max(s2, seen.firstPlayer), b2 = Math.min(s2 + g2, seen.firstBody);
        if (b2 > a) aloneHeld += (b2 - a);
      }
    }
    const alone = (seen.firstPlayer == null) ? 0 : (seen.firstBody - seen.firstPlayer);
    const aloneFree = Math.max(0, alone - aloneHeld);
    note('and of that, the thread was FREE and he was still alone for', aloneFree + ' ms');
    ok('*** HE IS NEVER LEFT LOOKING AT HIMSELF ON A GAME THAT IS RUNNING. *** Of '
       + 'the time between his own body appearing and the first other person, the '
       + 'time the thread was FREE and nobody was drawn stays under one beat',
       aloneFree <= 500, aloneFree + ' ms free and alone, against a beat of 500 ms');

    ok('once it is running, the pass keeps painting people rather than painting '
       + 'once and stopping', seen.bodies >= 20, seen.bodies + ' bodies in 30 s');

    ok('and nothing threw while any of it happened', errs.length === 0,
       'page errors ' + errs.length + (errs.length ? ': ' + errs[0] : ''));
  }
  await br.close(); server.close();

  /* ======================================================================== */
  head('C. THE RECORD SAYS WHAT WAS MEASURED');
  /* ======================================================================== */
  if (fs.existsSync(REC)) {
    const r = flat(fs.readFileSync(REC, 'utf8'));
    ok('the record carries his own sentence',
       /I didn't see a single human being/.test(r));
    ok('and names the half that is not this lane\'s, with a number',
       /PLUMBER/.test(r) && /thread/i.test(r));
    /* ASK FOR THE SUBSTANCE, NOT FOR A PHRASE I HOPED I HAD WRITTEN. The first
       cut of this went red on a record that spends a whole section on exactly
       what it asked for, because it was matching wording instead of meaning. */
    ok('and names its own instrument mistakes rather than hiding them',
       /instruments were wrong|CUT ONE|CUT TWO/i.test(r)
       && /not a fact about the game|two windows, one name/i.test(r));
  } else {
    ok('the record exists', false, REC);
  }

  notes.forEach(n => console.log(n));
  console.log('\n=== THE PEOPLE ARE NOT LATE: ' + pass + ' pass / ' + fail.length + ' fail ===');
  if (fail.length) { fail.forEach(f => console.log('   - ' + f)); process.exit(1); }
})();
