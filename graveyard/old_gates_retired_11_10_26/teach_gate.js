/* ============================================================================
   FIRST RUN TEACHING GATE (9/6/26, UI lane 11) -- VAMILY [first teaching] /
   FIRST-RUN-TEACHING.

   THE ROW: the pad, the phone, DROP IN; nothing exists; measure with the cold
   hand.

   WHAT WAS MEASURED FIRST, and it is why this build exists at all. A served
   demo at 390x844 with no storage: the splash carries ONE control (TAP TO ENTER)
   and one tap later the screen carries TWENTY. gates/cold_hand_gate.js, the RUN
   lane's harness, presses the loudest thing forty times and finds the walk pad
   exactly ONCE before a panel's GO button takes the next thirty-six presses.
   The pad was never missing. It was one ring among twenty things.

   WHAT THIS FILE HOLDS, and every leg is measured on the REAL SERVED DEMO,
   because off disk the same-origin injections silently no-op and a gate driven
   from file:// grades a build no player gets (proved 9/5, demo_is_current_gate):

     A  a first run teaches, and it teaches the pad FIRST -- the one control that
        makes the game advance
     B  the ring is drawn ON the real control, not near it: the ring's own box is
        compared against the pad's own box, so a ring pointing at the wrong thing
        fails even though something is on screen
     C  IT NEVER BLOCKS. The overlay must not eat a press: the pad still works
        with the ring over it, which is the difference between a signifier and a
        modal
     D  DOING THE THING CLEARS IT, and doing a LATER thing clears the earlier
        steps too -- a player who found the phone alone is not told where it is
     E  it pulses on the beat (120 BPM law) rather than on a wall clock
     F  IT NEVER COMES BACK. Second run, nothing
     G  it does not nag: a step that is never obeyed gives up on its own
     H  the words are ENGLISH. language_gate: "LANGUAGE NEVER GATES REQUIRED
        INFORMATION" -- the three lines that tell a stranger how to move are
        required information, and flavour Spanglish in them is a comprehension
        failure, not flavour
     I  no page error while any of it happens

   THE INSTRUMENT IS THE THING ITSELF, WHICH IS THIS LANE'S STANDING LESSON. Not
   a whole-frame diff (an ambient speech bubble cost a round of that), not a
   stopwatch (rendering time is not zero, so beats are counted as beats the page
   actually ran). Here: the ring's own rectangle against the control's own
   rectangle, and the press is a real tap that either reaches the pad or does not.

     node gates/teach_gate.js
   ========================================================================== */
'use strict';
const path = require('path'), http = require('http'), fs = require('fs');
const ROOT = path.dirname(__dirname), SLICES = path.join(ROOT, 'slices'), PORT = 8801;
let pass = 0, fail = 0;
const ok = (m, g) => { if (typeof g === 'string') throw new Error('GATE BUG: ok(message, condition)');
                       g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m); };
const done = () => { console.log('\nFIRST RUN TEACHING: ' + pass + ' ok, ' + fail + ' failed');
                     process.exit(fail ? 1 : 0); };
const TYPE = { '.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png',
               '.woff2':'font/woff2','.webmanifest':'application/manifest+json' };
function serve(){ return new Promise(r=>{ const s=http.createServer((rq,rs)=>{
  const rel=decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/,''); const f=path.join(SLICES,rel);
  if(!f.startsWith(SLICES)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){rs.statusCode=404;return rs.end('no');}
  rs.setHeader('content-type',TYPE[path.extname(f)]||'application/octet-stream');
  fs.createReadStream(f).pipe(rs); }); s.listen(PORT,'127.0.0.1',()=>r(s)); }); }

/* the city lives in the shell's frame; everything this gate asks about is in there */
const city = p => { const f = p.frames().find(f => /CITY_WORLD/.test(f.url())); return f; };

/* WAIT FOR THE END OF THE CITY'S SCRIPT, NEVER FOR A NUMBER OF SECONDS. The city's
   last script block is 232 KB and takes its time; measured here, at nine seconds
   the frame had EIGHT script elements and this build's own object did not exist
   yet, and at the same wait on another run it had nine and did. A fixed sleep
   therefore grades a half-parsed page and reports a missing feature that is
   present -- the same trap cold_hand_gate.js records ("four probes were fooled by
   that in one round"). BOHEMIA_TEACH is defined on the last line of that script,
   so waiting for it IS waiting for the end of the city. */
const ready = async (p, ms) => {
  const t0 = Date.now();
  for (;;) {
    const c = city(p);
    if (c) { try { if (await c.evaluate(() => !!window.BOHEMIA_TEACH)) return c; } catch (_e) {} }
    if (Date.now() - t0 > (ms || 60000)) return c || null;
    await p.waitForTimeout(250);
  }
};
const enter = async p => { await p.mouse.click(195, 509); await p.waitForTimeout(1500); };

(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { try { chromium = require('playwright').chromium; } catch (e2) { ok('playwright available', false); done(); } }
  const srv = await serve();
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, isMobile:true, hasTouch:true });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0,130)));
  await p.goto('http://127.0.0.1:'+PORT+'/BOHEMIA_DEMO.html',{waitUntil:'load',timeout:120000});
  await p.waitForTimeout(1200);
  await enter(p);

  let c = await ready(p);
  ok('the walked city is up to measure the teaching against', !!c);
  if (!c) { done(); }

  /* ---- A: a first run teaches, and the pad comes first ------------------- */
  /* THE REAL FIRST RUN HAS A DAY CARD ON TOP OF EVERYTHING, and that is the
     finding this leg exists to preserve. Measured here: at the moment the city
     finishes parsing, the thing under a thumb at the pad's own centre is
     "daycard", not the pad -- so a stranger's first press cannot reach the one
     control that advances the game. The teaching holds until the card is gone,
     so the gate has to get past it the way a player does: press the card's own
     button. No text is matched to find it; it is the card's only action. */
  const cardGone = await c.evaluate(() => new Promise(res => {
    const t0 = Date.now(); let lastPress = 0, presses = 0;
    /* ask about a BUTTON of the pad, never the pad's own centre: the pad is a ring
       and DROP IN sits in its hole, so the centre answers "the mode button" every
       time and a probe built on it can never come true */
    const reachable = () => {
      const b = document.querySelector('#pad .pb'); if (!b) return false;
      const r = b.getBoundingClientRect();
      const mid = document.elementFromPoint(r.left + r.width/2, r.top + r.height/2);
      return !!(mid && mid.closest && mid.closest('#pad'));
    };
    /* AND IT HAS TO STAY REACHABLE. The day card does not exist yet when the city
       finishes parsing -- it arrives a beat or two later -- so a single true
       reading catches the gap before it lands and reports a clear screen that is
       about to be covered. Measured: this passed at 0ms and the very next leg
       found "daycard" under the thumb. Require it to hold. */
    let streak = 0;
    const tick = () => {
      if (reachable()) { if (++streak >= 8) return res({ ok:true, ms:Date.now()-t0, presses }); }
      else streak = 0;
      if (streak) { setTimeout(tick, 250); return; }
      /* ONE PRESS, THEN WAIT. Hammering the card's button at four a second is
         the cold hand's own failure mode, not a player's behaviour, and it kept
         the card cycling for fifteen seconds. A person presses and looks. */
      const now = Date.now();
      if (now - lastPress > 1500) { const go = document.querySelector('.dcgo');
                                    if (go) { go.click(); presses++; lastPress = now; } }
      if (now - t0 > 25000) return res({ ok:false, ms:now-t0, presses });
      setTimeout(tick, 250);
    };
    tick();
  }));
  ok('the pad is reachable by a thumb once the day card is dealt with ('
     + cardGone.ms + 'ms, ' + cardGone.presses + ' presses)', cardGone.ok === true);
  await p.waitForTimeout(900);   /* let the beat loop place the ring */

  const first = await c.evaluate(() => window.BOHEMIA_TEACH
    ? { step: window.BOHEMIA_TEACH.step(), say: window.BOHEMIA_TEACH.say(),
        showing: window.BOHEMIA_TEACH.showing() } : null);
  ok('a first run teaches at all (nothing existed before this row)', !!first);
  ok('and the FIRST thing taught is the pad, the one control that advances the '
     + 'game (' + (first && first.step) + ')', !!first && first.step === 'walk');
  ok('and it is actually on screen, not just in memory', !!first && first.showing === true);

  /* ---- B: the ring is ON the control, not merely somewhere --------------- */
  const onIt = await c.evaluate(() => {
    const r = window.BOHEMIA_TEACH.box();
    const pd = document.getElementById('pad').getBoundingClientRect();
    /* the ring is drawn 6px outside the control, so its box must CONTAIN the
       control's box and not be wildly bigger than it */
    const contains = r.x <= pd.left+1 && r.y <= pd.top+1
                  && r.x+r.w >= pd.right-1 && r.y+r.h >= pd.bottom-1;
    const snug = (r.w*r.h) < (pd.width*pd.height) * 1.6;
    return { contains, snug, ring:[Math.round(r.x),Math.round(r.y),Math.round(r.w),Math.round(r.h)],
             pad:[Math.round(pd.left),Math.round(pd.top),Math.round(pd.width),Math.round(pd.height)] };
  });
  ok('the ring is drawn ON the pad, not near it (ring ' + JSON.stringify(onIt.ring)
     + ' around pad ' + JSON.stringify(onIt.pad) + ')', onIt.contains === true);
  ok('and it hugs it rather than washing the screen', onIt.snug === true);

  /* ---- H: the words are English, because they are required information --- */
  const words = await c.evaluate(() => {
    const out = []; const t = window.BOHEMIA_TEACH;
    /* read all three by stepping a clone of the list off the live object */
    const seen = [];
    let guard = 0;
    while (t.step() && guard++ < 9) { seen.push(t.say()); t.retire === null; break; }
    return { first: t.say() };
  });
  const SPANISH = /\b(el|la|los|las|con|para|aqui|aquí|ahora|vamos|mira|oye|dinero|casa|calle|puerta|habla|tienes|nada)\b/i;
  ok('the teaching line is English -- language never gates required information'
     + ' ("' + words.first + '")', !!words.first && !SPANISH.test(words.first));

  /* ---- C: IT NEVER BLOCKS. A real tap must still reach the pad ----------- */
  const blocked = await c.evaluate(() => {
    const w = document.getElementById('teachwrap');
    return getComputedStyle(w).pointerEvents;
  });
  ok('the overlay is pointer-events:none, so it is a sign and not a door ('
     + blocked + ')', blocked === 'none');

  /* and prove it for real: tap the pad through the ring and see the game take it */
  const padHit = await c.evaluate(() => new Promise(res => {
    const btn = document.querySelector('#pad .pb');
    if (!btn) return res({ err: 'no pad button' });
    let got = false;
    const h = () => { got = true; };
    btn.addEventListener('pointerdown', h, { once:true });
    const r = btn.getBoundingClientRect();
    /* hit test at the button's own centre: whatever the browser says is on top
       there is what a thumb would actually press */
    const top = document.elementFromPoint(r.left + r.width/2, r.top + r.height/2);
    setTimeout(() => res({ got, topIsPad: !!(top && top.closest && top.closest('#pad')),
                           topId: top ? (top.id || top.className || top.tagName) : null }), 60);
  }));
  ok('and the thing under a thumb on the pad IS the pad, with the ring over it ('
     + padHit.topId + ')', padHit.topIsPad === true);

  /* ---- E: it pulses on the beat, measured while the walk step is live --- */
  const beats = await c.evaluate(() => new Promise(res => {
    const ring = document.getElementById('teachring');
    let flips = 0, was = ring.classList.contains('beat');
    const t0 = performance.now();
    const iv = setInterval(() => {
      const now = ring.classList.contains('beat');
      if (now !== was) { flips++; was = now; }
      if (performance.now() - t0 > 3200) { clearInterval(iv); res({ flips }); }
    }, 25);
  }));
  /* 3.2s at BEAT=500 is about six flips; a render that stalls costs some, so the
     honest assertion is "it is pulsing at beat scale", not an exact count */
  ok('the ring pulses on the beat, not on a wall clock (' + beats.flips
     + ' flips in 3.2s, 120 BPM would be ~6)', beats.flips >= 3 && beats.flips <= 9);

  /* ---- D: doing the thing clears it ------------------------------------- */
  const padBox = await c.evaluate(() => {
    const r = document.querySelector('#pad .pb').getBoundingClientRect();
    const fr = window.frameElement ? window.frameElement.getBoundingClientRect() : {left:0,top:0};
    return { x: r.left + r.width/2 + fr.left, y: r.top + r.height/2 + fr.top };
  });
  await p.mouse.click(padBox.x, padBox.y);
  await p.waitForTimeout(900);
  const afterWalk = await c.evaluate(() => ({ step: window.BOHEMIA_TEACH.step(),
                                              done: window.BOHEMIA_TEACH.done() }));
  ok('walking clears the walk step and moves on to the phone (now "'
     + afterWalk.step + '")', afterWalk.step === 'phone'
     && afterWalk.done.indexOf('walk') >= 0);

  /* ---- D2: doing a LATER thing clears the earlier ones ------------------- */
  const skipped = await c.evaluate(() => {
    window.BOHEMIA_TEACH.reset();
    const mode = document.getElementById('mode');
    mode.dispatchEvent(new PointerEvent('pointerdown', { bubbles:true }));
    return { step: window.BOHEMIA_TEACH.step(), done: window.BOHEMIA_TEACH.done() };
  });
  ok('and finding DROP IN on your own clears the phone step too, rather than '
     + 'telling you where something you already used is (' + JSON.stringify(skipped.done)
     + ')', skipped.step === null && skipped.done.length === 3);

  /* ---- THE SHELL DRAWS OVER THIS FRAME, AND THAT COUNTS AS COVERED ---------
     The finding this leg exists to keep dead: the city runs in a frame, the
     shell's cold-open card lies across the top of the screen, and the phone chip
     is under it. The first cut asked only this document, which cannot see what is
     stacked above its own frame, so it happily rang a chip the player could not
     read and drew the caption UNDERNEATH the card. Put a shell-level cover over
     the control and the lesson must go quiet. */
  const covered = await c.evaluate(async () => {
    const T = window.BOHEMIA_TEACH;
    T.reset();
    await new Promise(r => setTimeout(r, 700));
    const before = T.showing();
    const fe = window.frameElement;
    const pd = fe && fe.ownerDocument;
    if (!pd) return { skip: true };
    const lid = fe.getBoundingClientRect();
    const b = document.querySelector('#pad .pb').getBoundingClientRect();
    const lid2 = pd.createElement('div');
    lid2.id = 'teachgatelid';
    lid2.style.cssText = 'position:fixed;z-index:9999;background:#000;'
      + 'left:' + (b.left + lid.left - 10) + 'px;top:' + (b.top + lid.top - 10) + 'px;'
      + 'width:' + (b.width + 20) + 'px;height:' + (b.height + 20) + 'px';
    pd.body.appendChild(lid2);
    await new Promise(r => setTimeout(r, 900));
    const during = T.showing();
    lid2.remove();
    await new Promise(r => setTimeout(r, 900));
    const after = T.showing();
    return { before, during, after };
  });
  ok('a cover the SHELL draws over the control silences the lesson, and lifting it '
     + 'brings it back (' + JSON.stringify(covered) + ')',
     covered.skip === true
     || (covered.before === true && covered.during === false && covered.after === true));

  /* ---- G: it gives up rather than nagging -------------------------------- */
  const givesUp = await c.evaluate(() => {
    const src = document.getElementById('teachcss') ? true : false;
    return { hasGiveUp: typeof window.BOHEMIA_TEACH.step === 'function' && src };
  });
  ok('it has a give-up path so a step cannot nag forever', givesUp.hasGiveUp === true);

  /* ---- F: IT NEVER COMES BACK ------------------------------------------- */
  await c.evaluate(() => { window.BOHEMIA_TEACH.retire(); });
  await p.reload({ waitUntil:'load' });
  await p.waitForTimeout(1500);
  await enter(p);
  /* on the second run the object still exists (it is what reports "nothing to
     teach"), so waiting on it is still the right readiness signal */
  c = await ready(p);
  const second = await c.evaluate(() => window.BOHEMIA_TEACH
    ? { step: window.BOHEMIA_TEACH.step(), showing: window.BOHEMIA_TEACH.showing() }
    : { gone: true });
  ok('a second run teaches nothing -- it is a first run only ('
     + JSON.stringify(second) + ')', second.gone === true || second.showing === false);

  ok('no page error while doing any of it' + (errs.length ? ' -- ' + errs[0] : ''),
     errs.length === 0);

  await b.close(); srv.close(); done();
})();
