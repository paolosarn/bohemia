#!/usr/bin/env node
/* ============================================================================
   NEVER WORSE -- THE RATCHET AS A MACHINE
   (9/20/26, PLUMBER lane, VAMILY row [never worse], Paolo's rule 18c)

   PAOLO 9/20:
     "I just want to restart all of this, keep our assets and start all over. I
      really need your help to not do that because I can't be showing this to
      people... WE WERE CLOSER TO BEING ABLE TO PLAY BEFORE, RIGHT NOW WE'RE
      FARTHER THAN WE'VE EVER BEEN."

   THE GAME GOT WORSE UNDER A RULE THAT SAID NEVER WORSE, BECAUSE THE RULE WAS A
   SENTENCE. Rule 14(a) has said since 9/14 that a cut must never be worse than the
   last one. Nothing measured it. Six rounds later he wants to start over.

   So this turns the stranger's walk into NUMBERS, stores the numbers of the last
   ACCEPTED cut, and REFUSES a push that scores worse on any of them.

   ## WHAT IT COUNTS, AND WHY EACH ONE IS DECIDABLE

   Every number this lane published in the last two weeks that it had to take back
   came from an instrument that could not tell two situations apart. A screen diff
   cannot tell a working button from a card closing (rule 14h), and it cannot tell
   a slow game from a still one. So nothing here is a screen diff.

     tappableMs      the driver stamps the moment a finger has something to press.
                     Rule 18a asks for "nothing tappable until loaded"; this says
                     whether that is true and stops it getting slower. IT IS THE
                     SECOND LOAD (9/21, row [cold read]): the first load in a fresh
                     container reads 1240 ms where the next four read 589-625, and
                     scoring it refused a CLEAN TREE on WORLD's first run. The cold
                     number is printed and recorded beside it, because that one is
                     what a stranger actually gets; it is simply not a number two
                     runs can be compared on.
     frozenMs        time spent inside animation-frame gaps longer than one beat
                     (500 ms, the 120 BPM law). A clock, not a picture.
     deadPresses     he pressed and did not move, AND NO OTHER DIRECTION FROM THAT
                     SAME CELL MOVED HIM EITHER. The pad is not listening.
     wallPresses     he pressed and did not move, but another direction from the
                     same cell did. He is against something. THAT IS NOT A BUG AND
                     IT IS COUNTED SEPARATELY, because last round this lane spent a
                     round proving that a player pressed against a wall had been
                     published as an 8.8 fps frame rate.
     aimedTrue       he moved, and the movement agreed in sign with the direction
                     pressed. THE DIRECTIONS ARE MEASURED, NOT ASSUMED: pad 0 is up
                     (0,-50 per press), 2 right (+35,0), 4 down (0,+6), 6 left
                     (-50,0), probed one button at a time before this was written.
     aimedWrong      he moved the other way. This is the one that should always be
                     zero and is the worst thing on the list if it is not.
     fightReached    the fight was driven through the city's own encounter door and
                     drew a canvas. Photographed.

   THE GROUND TRUTH IS hx,hy -- THE PLAYER'S OWN CELL, which the city exposes. A
   press either changes it or it does not. There is nothing to interpret.

   ## WHAT IT SCORES

   The CUT, not the working tree: the real cutter runs into a throwaway folder and
   the candidate demo is served from there while every chunk still comes from the
   real slices/ (the driver's `serve` map). That is the shape vote_tab_gate uses,
   and it exists because rule 14(a) says only RUN re-cuts the demo.

   ## HOW IT REFUSES

   records/BOHEMIA_NEVER_WORSE_ACCEPTED.json holds the last accepted cut's numbers.
   A push scoring worse on ANY of them is refused. "Worse" is per-number and the
   direction is declared, never inferred.

   A FLOOR, BECAUSE THIS LANE HAS SHIPPED THREE GATES THAT WERE GREEN WHILE
   MEASURING NOTHING: a walk that pressed nothing, or never reached the city, or
   saw no frames, is a BROKEN run and is refused as such rather than scored. A
   ratchet that passes when the instrument fails is worse than no ratchet, because
   it is the sentence again with a number painted on it.

     node tools/bohemia_never_worse.js              score the cut, compare, verdict
     node tools/bohemia_never_worse.js --accept     score it and store it as the new
                                                    accepted cut (a deliberate act)
     node tools/bohemia_never_worse.js --tree       score the WORKING tree's demo
                                                    instead of a fresh cut (faster)
   ========================================================================== */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.dirname(__dirname);
const D = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
const SPEED = require(path.join(ROOT, 'gates', 'bohemia_box_speed.js'));
const PERF = require(path.join(ROOT, 'gates', 'bohemia_phone_perf.js'));
const ACCEPTED = path.join(ROOT, 'records/BOHEMIA_NEVER_WORSE_ACCEPTED.json');
const BEAT = 500;                 /* 120 BPM, the law */
const PRESS_MS = 700;             /* longer than a beat, shorter than a stride pair */
const ROUNDS = 3;                 /* times round the eight directions */

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/* THE DIRECTIONS, MEASURED ONE BUTTON AT A TIME BEFORE THIS FILE WAS WRITTEN, never
   read off the markup. Index into the eight .pb buttons; [dx, dy] is the sign the
   cell should move in. Diagonals move far less per press than cardinals (2 to 6
   cells against 35 to 50) which is why aim is judged on SIGN and never on size. */
const DIRS = [
  { i: 0, name: 'up',         dx:  0, dy: -1, opp: 4 },
  { i: 1, name: 'up-right',   dx:  1, dy: -1, opp: 5 },
  { i: 2, name: 'right',      dx:  1, dy:  0, opp: 6 },
  { i: 3, name: 'down-right', dx:  1, dy:  1, opp: 7 },
  { i: 4, name: 'down',       dx:  0, dy:  1, opp: 0 },
  { i: 5, name: 'down-left',  dx: -1, dy:  1, opp: 1 },
  { i: 6, name: 'left',       dx: -1, dy:  0, opp: 2 },
  { i: 7, name: 'up-left',    dx: -1, dy: -1, opp: 3 },
];

/* frames, and the only thing asked of them is how long the page stopped painting */
const WATCH = `(function(){
  window.__nw = { frames: 0, frozenMs: 0, stalls: 0, worst: 0, last: 0 };
  function tick(t){ const f = window.__nw;
    if (f.last) { const dt = t - f.last; f.frames++;
      if (dt > ${BEAT}) { f.stalls++; f.frozenMs += dt; if (dt > f.worst) f.worst = dt; } }
    f.last = t; requestAnimationFrame(tick); }
  requestAnimationFrame(tick);
})()`;

/* ---- THE CUT, IN A THROWAWAY TREE --------------------------------------- *
   Rule 14(a): only RUN re-cuts the demo. So the real cutter runs on a copy and
   slices/ is never written. Reading the cutter's source and reasoning about what
   it would produce is not a measurement.                                      */
function cutToTemp() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'neverworse-'));
  fs.mkdirSync(path.join(tmp, 'slices'));
  fs.mkdirSync(path.join(tmp, 'tools'));
  fs.copyFileSync(path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html'),
                  path.join(tmp, 'slices/BOHEMIA_ALPHA_0_9.html'));
  fs.copyFileSync(path.join(ROOT, 'tools/bohemia_cut_the_demo.js'),
                  path.join(tmp, 'tools/bohemia_cut_the_demo.js'));
  execFileSync(process.execPath, [path.join(tmp, 'tools/bohemia_cut_the_demo.js')],
               { stdio: 'pipe' });
  const out = path.join(tmp, 'slices/BOHEMIA_DEMO.html');
  if (!fs.existsSync(out)) throw new Error('the cutter produced no demo');
  return { tmp, demo: out };
}

/* ---- THE PLANTED REGRESSION, WHICH IS THIS ROW'S SHIP TEST --------------- *
   The row says: "Ship with a planted regression that it refuses." A ratchet nobody has
   ever seen say no is a ratchet nobody should trust, and this lane has shipped three
   gates that were green while measuring nothing. So --plant <ms> hides the front door
   for <ms> before showing it, in the THROWAWAY COPY ONLY. slices/ is never touched and
   the working tree is never touched; the plant lives and dies inside the temp folder.
   It makes exactly one scored number worse -- the time before a finger has anything to
   press -- so a refusal proves the whole path: cut, walk, compare, refuse.            */
function plantADelay(demoPath, ms) {
  let html = fs.readFileSync(demoPath, 'utf8');
  /* A PLANT THAT CHANGES GAME STATE IS THE WRONG PLANT, and the first one did. It hid
     the door element and showed it again later; the door then never armed at all and
     the run was refused by the floor for a reason that had nothing to do with the delay.
     A refusal for the wrong reason proves nothing.
     THIS ONE ONLY COSTS TIME. A synchronous busy-wait at the top of the body holds the
     main thread for <ms> before anything else parses, which is exactly what a slower
     boot is, and touches no element, no handler and no state. The only thing it can
     change is how long a finger waits. */
  const inject = '<script>(function(){var t=Date.now();while(Date.now()-t<' + ms + '){}})();<\/script>';
  const at = html.indexOf('<body');
  const close = at >= 0 ? html.indexOf('>', at) : -1;
  html = close > 0 ? html.slice(0, close + 1) + inject + html.slice(close + 1) : inject + html;
  fs.writeFileSync(demoPath, html);
}

async function score(opts) {
  const box = SPEED.measure();
  const out = { takenOn: new Date().toISOString(), boxRatio: box.ratio,
                scored: opts.serve ? 'a fresh cut' : 'the working tree' };

  /* warmup: the ratchet scores the SECOND load. See the driver's header -- the first
     load in any fresh container is twice the rest, and scoring it refused a clean tree
     on WORLD's first run. The cold number is kept beside it and never thrown away. */
  const d = await D.open({ serve: opts.serve, boot: 40000, settle: 60000, warmup: true });
  out.tappableMs = d.tappableMs();
  out.tappableColdMs = d.tappableColdMs();
  await d.fr.evaluate(WATCH);
  await d.clearCards();
  await sleep(900);

  const off = await d.page.evaluate(() => {
    const f = document.getElementById('cityFrame'); if (!f) return { x: 0, y: 0 };
    const r = f.getBoundingClientRect(); return { x: r.x, y: r.y };
  });
  const pads = await d.fr.evaluate(() => [...document.querySelectorAll('.pb')].map(e => {
    const r = e.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  }));
  out.padButtons = pads.length;
  const cell = () => d.fr.evaluate(() => (typeof hx !== 'undefined' && typeof hy !== 'undefined')
    ? [hx, hy] : null);
  const cdp = await d.ctx.newCDPSession(d.page);
  d.page.__cdp = cdp;
  /* IS THE BUTTON EVEN REACHABLE? (rule 14h, and this lane learned it the hard way in
     round 26: a walk reported 162 dead taps of 230 and every one of the named buttons
     was proved alive on the glass. What it had measured was a panel sitting over the
     next button.) A press that lands on something else is BLOCKED, not dead. Calling a
     covered button broken is how an instrument reports its own confusion as the game's,
     and it would send another lane chasing a pad that works. */
  /* THE TEST HAS TO RUN IN THE DOCUMENT THE FINGER LANDS IN, AND THE FIRST CUT OF IT
     RAN IN THE WRONG ONE. Asking the CITY FRAME whether its own pad button is on top
     can only ever see things inside that frame. The thing that covers the pad is in the
     PARENT page -- #daycard is inset:0 over the whole phone -- so the frame happily
     answered "nothing is in the way" while a full-screen card sat over the lot.
     Measured before this was fixed: every one of the eight directions moved him on lap
     one and was dead on laps two and three, blocked:0 throughout. That is not a pad
     that breaks after eight presses; that is an instrument looking through the card.
     THIS IS ROUND 26'S LESSON IN A NEW COAT: photograph the phone, not the canvas; ask
     the page, not the frame. */
  const reachable = (i) => {
    const p = pads[i]; if (!p) return Promise.resolve(false);
    return d.page.evaluate((pt) => {
      const top = document.elementFromPoint(pt.x, pt.y);
      if (!top) return { ok: false, what: 'nothing at all' };
      /* the finger is over the city frame if the topmost thing in the PARENT is that
         frame; anything else in the parent is something sitting on top of the game */
      const isFrame = top.id === 'cityFrame' || top.tagName === 'IFRAME';
      return { ok: isFrame, what: (top.id || top.className || top.tagName || '?').toString().slice(0, 40) };
    }, { x: off.x + p.x, y: off.y + p.y }).then(r => { if (!r.ok) lastBlocker = r.what; return r.ok; })
      .catch(() => false);
  };
  const press = async (i, ms) => {
    const p = pads[i]; if (!p) return;
    const pt = { x: off.x + p.x, y: off.y + p.y };
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: pt.x, y: pt.y, id: 1 }] });
    await sleep(ms);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await sleep(160);
  };

  /* *** WAIT FOR THE BOOT TO LET GO OF THE THREAD, OR THE BOOT IS WHAT GETS SCORED. ***
     THE FIRST CUT OF THIS FILE WAS FLAKY AND IT WOULD HAVE BEEN THE WORST THING THIS
     LANE EVER SHIPPED. Three runs of ONE UNCHANGED TREE read 0, 13 and 1 dead presses.
     A ratchet built on that refuses honest pushes and waves bad ones through, which is
     Paolo's sentence again with a number painted on it.
     THE CAUSE IS MEASURED AND THIS LANE ALREADY OWNED IT: the demo streams 75.9 MB for
     227 s after the door ([demo errors], 9/15) and the boot blocks the main thread for
     19.5 s in long tasks up to 7 s ([sixty fps], 9/15). A press that lands inside a
     seven-second block does nothing. THAT IS NOT A DEAD PAD, IT IS THE BOOT, and which
     presses land in it is luck.
     So the walk does not start until the thread goes quiet, using the waiter the perf
     instrument has had since 9/5 rather than a new one. HOW LONG IT WAITED AND WHETHER
     IT EVER WENT QUIET ARE BOTH RECORDED: a walk scored on a page that never settled is
     a broken run, not a slow one, and it is refused by the floor below. */
  const quiet = await PERF.awaitQuiet(cdp, 45000).catch(() => ({ quiet: false, waitedMs: 0 }));
  out.quiet = quiet.quiet;
  out.quietWaitedMs = quiet.waitedMs;
  await d.clearCards().catch(() => {});
  await sleep(400);

  out.startCell = await cell();
  let aimedTrue = 0, aimedWrong = 0, wall = 0, dead = 0, presses = 0, blocked = 0, lastBlocker = '';
  const modes = [];
  const perDir = {};
  for (let r = 0; r < ROUNDS; r++) {
    for (const dir of DIRS) {
      if (pads.length <= dir.i) continue;
      const a = await cell();
      if (!a) continue;
      const canReach = await reachable(dir.i);
      const mode = await d.fr.evaluate(() => {
        const o = {};
        for (const k of ['MODE', 'RIDING', 'riding', 'inCar', 'VEH']) {
          try { if (typeof window[k] !== 'undefined') o[k] = String(window[k]).slice(0, 14); } catch (e) {}
        }
        const el = [...document.querySelectorAll('div,span')].find(e =>
          /ON FOOT|RIDING/.test(e.textContent || '') && (e.textContent || '').length < 40);
        o.says = el ? el.textContent.trim().slice(0, 28) : '';
        return o;
      }).catch(() => ({}));
      modes.push(dir.name + '=' + (mode.says || JSON.stringify(mode)));
      const k = perDir[dir.name] || (perDir[dir.name] = { moved: 0, wall: 0, dead: 0, wrong: 0, blocked: 0 });
      if (!canReach) { blocked++; k.blocked++; continue; }
      await press(dir.i, PRESS_MS);
      const b = await cell();
      presses++;
      const mx = b[0] - a[0], my = b[1] - a[1];
      if (mx !== 0 || my !== 0) {
        /* AIM IS JUDGED ON SIGN, NEVER ON SIZE: a diagonal moves two cells where a
           cardinal moves fifty, and calling the small one a miss would score the
           game on the instrument's expectations instead of on the game. */
        const okX = dir.dx === 0 ? true : Math.sign(mx) === dir.dx || mx === 0;
        const okY = dir.dy === 0 ? true : Math.sign(my) === dir.dy || my === 0;
        if (okX && okY && (mx !== 0 || my !== 0)) { aimedTrue++; k.moved++; }
        else { aimedWrong++; k.wrong++; }
        continue;
      }
      /* HE DID NOT MOVE. WALL OR DEAD? Decided, not guessed: try the opposite
         direction from the same cell. If that moves him the pad is listening and he
         was against something; if nothing moves him the pad is not listening. */
      await press(dir.opp, PRESS_MS);
      const c = await cell();
      if (c[0] !== b[0] || c[1] !== b[1]) { wall++; k.wall++; }
      else { dead++; k.dead++; }
    }
  }
  out.presses = presses;
  out.aimedTrue = aimedTrue;
  out.aimedWrong = aimedWrong;
  out.wallPresses = wall;
  out.deadPresses = dead;
  out.blockedPresses = blocked;
  out.whatBlockedIt = lastBlocker;
  out.modeTrail = modes;
  out.perDirection = perDir;
  out.endCell = await cell();
  out.cellsCovered = out.startCell && out.endCell
    ? Math.abs(out.endCell[0] - out.startCell[0]) + Math.abs(out.endCell[1] - out.startCell[1]) : 0;

  /* ---- THE FIGHT. Rule 17(b): the walk ends IN THE FIGHT and photographs it, and
     the ratchet includes that frame. Driven through the city's own encounter door,
     which is the bus the dial speaks, and SAID OUT LOUD to be forced rather than
     met, because a forced fight and a met fight are not the same claim. */
  let fight = { reached: false, why: '', forced: true };
  try {
    const started = await d.fr.evaluate(() => {
      try {
        if (typeof cityEncounterIn !== 'function') return 'no cityEncounterIn';
        cityEncounterIn({ packageId: 1, label: 'the ratchet' });
        return 'called';
      } catch (e) { return 'threw: ' + String(e).slice(0, 80); }
    });
    if (started !== 'called') fight.why = started;
    else {
      for (let i = 0; i < 90 && !fight.reached; i++) {
        await sleep(200);
        const h = await d.page.$('#combatFrame');
        if (!h) continue;
        const cf = await h.contentFrame();
        if (cf && (await cf.evaluate(() => document.querySelectorAll('canvas').length).catch(() => 0)) > 0) {
          fight.reached = true;
        }
      }
      if (!fight.reached) fight.why = 'the combat frame never showed a canvas';
    }
  } catch (e) { fight.why = String(e).slice(0, 90); }
  if (fight.reached) {
    const shot = path.join(ROOT, 'records/never_worse_fight.png');
    await d.page.screenshot({ path: shot }).catch(() => {});
    fight.photo = path.relative(ROOT, shot);
  }
  out.fight = fight;

  const fm = await d.fr.evaluate(() => window.__nw).catch(() => null);
  out.frames = fm ? fm.frames : 0;
  out.frozenMs = fm ? Math.round(fm.frozenMs) : 0;
  out.freezes = fm ? fm.stalls : 0;
  out.worstFreezeMs = fm ? Math.round(fm.worst) : 0;
  out.pageErrors = d.errs.length;
  await d.close();
  out.boxRatioEnd = SPEED.measure().ratio;

  /* ---- THE FLOOR. A BROKEN RUN IS NOT A GOOD SCORE. ---------------------- */
  const broken = [];
  if (!out.startCell) broken.push('the city never exposed a player cell, so every press '
    + 'below was scored against nothing');
  if (out.padButtons !== 8) broken.push('found ' + out.padButtons + ' pad buttons, not 8: '
    + 'the walk pressed a pad this instrument does not understand');
  if (presses < 8) broken.push('only ' + presses + ' press(es) landed: a walk that pressed '
    + 'nothing agrees the game is perfect');
  if (out.frames < 100) broken.push('only ' + out.frames + ' frames seen: the frame watcher '
    + 'was not running, so the freeze numbers mean nothing');
  if (out.tappableMs == null) broken.push('the door never became tappable, so there is no '
    + 'loading number and the rest is about a game nobody could start');
  if (!out.quiet) broken.push('the main thread never went quiet in ' + out.quietWaitedMs
    + ' ms, so this walk scored the boot jam and not the game. Every dead press below is '
    + 'a press that landed inside a long task, which is luck, not a measurement.');
  out.broken = broken;
  return out;
}

/* ---- WHAT "WORSE" MEANS, DECLARED PER NUMBER AND NEVER INFERRED ---------- */
const WORSE = [
  ['tappableMs',   'hi', 'ms before a finger has anything to press'],
  ['frozenMs',     'hi', 'ms the page spent frozen for longer than a beat'],
  ['aimedWrong',   'hi', 'presses that moved him the WRONG way'],
  ['cellsCovered', 'lo', 'how far he actually got'],
  ['pageErrors',   'hi', 'things that threw'],
];
/* *** deadPresses IS MEASURED, PRINTED, AND DELIBERATELY NOT SCORED. ***
   Seven runs of ONE UNCHANGED TREE: 0, 1, 1, 1, 13, 14, 0. It is bimodal, not noisy --
   the good runs agree to the press and the bad ones cluster at thirteen. Cells covered
   was 53 or 54 in every one of them, so in a bad run he reaches the same place in fewer,
   longer moves, which smells like a mode this instrument does not yet understand.
   I DID NOT FIND IT, AND A RATCHET BUILT ON A NUMBER LIKE THAT IS THE WORST THING THIS
   ROW COULD SHIP: it would refuse honest pushes and wave bad ones through, which is
   Paolo's sentence again with a number painted on it. So it is on the report where the
   next round can see it, and it decides nothing until it is stable. The numbers that DO
   decide were the same in all seven runs. */
const MEASURED_NOT_SCORED = ['deadPresses', 'wallPresses', 'aimedTrue', 'blockedPresses'];
/* TOLERANCE, AND IT IS NOT A LOOPHOLE. Two numbers here are wall clocks on a shared
   box and this lane has already proved that box runs up to 1.8x slower hour to hour
   (gates/bohemia_box_speed.js). A ratchet with no tolerance on a wall clock goes red
   on a busy afternoon and gets switched off, which is how rule 14(a) became a
   sentence in the first place. THE COUNTS HAVE NO TOLERANCE AT ALL: one more dead
   press is one more dead press on any box. */
const TOLERANCE = { tappableMs: 1.35, frozenMs: 1.35, cellsCovered: 0.5 };
/* *** AND AN ABSOLUTE SLACK, BECAUSE A PERCENTAGE OF ZERO IS ZERO. ***
   Caught by running the ratchet against the tree it had just accepted: frozenMs was
   stored as 0, the next honest run froze once for 533 ms, and 0 x 1.35 is still 0, so
   an UNCHANGED TREE WAS REFUSED. That is the exact death this fleet keeps writing about
   -- a bar pinned at the luckiest sample fails the next ordinary run and gets switched
   off -- and it would have hit whoever pushed next, not me.
   THE SLACK IS ONE FREEZE, and it is grounded rather than chosen: every freeze measured
   across seven runs was a SINGLE animation-frame gap of 517 to 567 ms, so 750 ms lets
   one through and stops two. A number that only ever appears as none-or-one needs a
   floor in its own units, not a multiplier. */
const SLACK = { frozenMs: 750, tappableMs: 120 };
/* cellsCovered IS NET DISPLACEMENT AND IT WANDERS: measured 41, 51, 53, 54 and 66 across
   runs of one unchanged tree, a 1.6x spread, because where eight directions leave him
   depends on what he bumped into. Scored with no tolerance it would refuse honest pushes
   for wandering, which is the failure that turns a ratchet off. It is kept because the
   thing it catches is not subtle -- a cut where he cannot get anywhere at all -- and a
   floor at HALF the accepted cut catches that while never arguing with an ordinary walk.
   A tolerance on a number that genuinely swings is not a loophole; a tolerance on a
   number that does not swing is, which is why the counts below have none. */

function compare(now, was) {
  const rows = [];
  for (const [k, dir, what] of WORSE) {
    const a = was ? was[k] : null, b = now[k];
    if (a == null || b == null) { rows.push({ k, what, was: a, now: b, verdict: 'new' }); continue; }
    const tol = TOLERANCE[k] || 1;
    const allow = dir === 'hi' ? Math.max(a * tol, a + (SLACK[k] || 0))
                               : a * (TOLERANCE[k] || 1);
    const worse = dir === 'hi' ? b > allow : b < allow;
    /* FOUR WORDS, NOT THREE. The first cut printed "better" for 0 -> 533 ms of freezing
       because it was inside the slack, and a report that calls a slower run better is a
       report nobody should read twice. WITHIN means it moved the wrong way and the
       tolerance absorbed it, which is a different fact from an improvement. */
    const better = dir === 'hi' ? b < a : b > a;
    rows.push({ k, what, was: a, now: b,
                verdict: worse ? 'WORSE' : (b === a ? 'same' : (better ? 'better' : 'within')),
                allowed: +allow.toFixed(0) });
  }
  return rows;
}

(async function main() {
  process.chdir(ROOT);
  const accept = process.argv.includes('--accept');
  const useTree = process.argv.includes('--tree');
  console.log('\nNEVER WORSE -- the ratchet, as a machine (Paolo 9/20, rule 18c)\n');

  const plantArg = process.argv.indexOf('--plant');
  const plantMs = plantArg > 0 && process.argv[plantArg + 1] ? +process.argv[plantArg + 1] : 0;
  let cut = null, serve = null;
  if (!useTree) {
    try {
      cut = cutToTemp();
      if (plantMs) {
        plantADelay(cut.demo, plantMs);
        console.log('  *** PLANTED: the main thread is held for ' + plantMs + ' ms in the'
          + ' throwaway copy. If this run is not REFUSED, the ratchet does not work. ***');
      }
      serve = { '/slices/BOHEMIA_DEMO.html': cut.demo };
      console.log('  cut a fresh demo into a throwaway tree; slices/ untouched');
    } catch (e) {
      console.log('  THE CUTTER FAILED: ' + String(e.message).slice(0, 120));
      console.log('  REFUSED. A cut that does not build cannot be scored, and scoring the\n'
        + '  working tree instead would report on something nobody is about to push.');
      process.exit(1);
    }
  } else {
    console.log('  --tree: scoring the demo already on disk, NOT a fresh cut');
  }

  let now;
  try { now = await score({ serve }); }
  finally { if (cut) { try { fs.rmSync(cut.tmp, { recursive: true, force: true }); } catch (e) {} } }

  console.log('  box ' + now.boxRatio + 'x at the start, ' + now.boxRatioEnd + 'x at the end\n');
  console.log('  ================  THE WALK, AS NUMBERS  ================');
  console.log('    TAPPABLE AT    ' + String(now.tappableMs).padStart(7) + ' ms   (SCORED: the'
    + ' second load, because the first is cold)');
  console.log('    cold first load' + String(now.tappableColdMs).padStart(7) + ' ms   what a'
    + ' stranger actually gets, reported and not scored');
  console.log('    waited for quiet ' + String(now.quietWaitedMs).padStart(5) + ' ms'
    + (now.quiet ? ', the thread let go' : ', AND IT NEVER LET GO'));
  console.log('    FROZEN         ' + String(now.frozenMs).padStart(7) + ' ms over '
    + now.freezes + ' freeze(s), worst ' + now.worstFreezeMs + ' ms');
  console.log('    PRESSES        ' + String(now.presses).padStart(7));
  console.log('      aimed true   ' + String(now.aimedTrue).padStart(7) + '   he moved where he aimed');
  console.log('      AIMED WRONG  ' + String(now.aimedWrong).padStart(7) + '   he moved the other way');
  console.log('      against a wall ' + String(now.wallPresses).padStart(5) + '   not a bug, counted apart');
  console.log('      DEAD         ' + String(now.deadPresses).padStart(7) + '   the pad was not listening');
  console.log('      blocked      ' + String(now.blockedPresses).padStart(7)
    + '   something sat over the button, so it was never pressed'
    + (now.whatBlockedIt ? ' (' + now.whatBlockedIt + ')' : ''));
  console.log('    BY DIRECTION (moved / wall / dead / blocked / wrong):');
  for (const [n, k] of Object.entries(now.perDirection)) {
    console.log('      ' + n.padEnd(12) + String(k.moved).padStart(3) + ' / '
      + String(k.wall).padStart(3) + ' / ' + String(k.dead).padStart(3) + ' / '
      + String(k.blocked || 0).padStart(3) + ' / ' + String(k.wrong).padStart(3));
  }
  console.log('    CELLS COVERED  ' + String(now.cellsCovered).padStart(7));
  console.log('    THE FIGHT      ' + (now.fight.reached
    ? '  REACHED and photographed (' + now.fight.photo + '), forced through the encounter door'
    : '  NOT REACHED: ' + now.fight.why));
  console.log('    PAGE ERRORS    ' + String(now.pageErrors).padStart(7));
  console.log('  ========================================================');

  if (now.broken.length) {
    console.log('\n  *** THIS RUN DOES NOT COUNT, AND THAT IS A REFUSAL, NOT A PASS ***');
    for (const b of now.broken) console.log('      ' + b);
    console.log('\n  REFUSED.');
    process.exit(1);
  }

  let was = null;
  try { was = JSON.parse(fs.readFileSync(ACCEPTED, 'utf8')); } catch (e) {}
  const rows = compare(now, was && was.numbers);
  console.log('\n  MEASURED BUT NOT SCORED, because it is not stable enough to decide a push:');
  console.log('    deadPresses ' + now.deadPresses + ' -- seven runs of one unchanged tree read'
    + ' 0, 1, 1, 1, 13, 14, 0. Bimodal, cause not found. It is here so the next round can'
    + ' see it, and it refuses nothing until it holds still.');
  console.log('    (wallPresses ' + now.wallPresses + ', aimedTrue ' + now.aimedTrue
    + ', blocked ' + now.blockedPresses + ' travel with it.)');

  console.log('\n  AGAINST THE LAST ACCEPTED CUT'
    + (was ? ' (' + was.acceptedOn + ', ' + (was.sha || 'no sha') + ')' : ': THERE IS NONE YET'));
  for (const r of rows) {
    console.log('    ' + r.k.padEnd(14) + String(r.was == null ? '-' : r.was).padStart(9)
      + ' -> ' + String(r.now).padStart(9) + '   ' + r.verdict.padEnd(7) + '  ' + r.what);
  }
  const bad = rows.filter(r => r.verdict === 'WORSE');

  if (accept) {
    if (plantMs) {
      console.log('\n  REFUSING TO ACCEPT A PLANTED RUN. --plant exists to prove the ratchet'
        + ' says no; storing its numbers as the bar would be the opposite of the point.');
      process.exit(1);
    }
    if (bad.length) {
      console.log('\n  REFUSING TO ACCEPT A CUT THAT SCORES WORSE. ' + bad.length + ' number(s) went'
        + ' the wrong way. Accepting this would be the sentence again with a number on it.');
      process.exit(1);
    }
    /* *** ACCEPTING PINS THE WORST OF SEVERAL RUNS, NEVER ONE. ***
       (9/21, row [cold read], and it is the same lesson twice in two rounds.)
       The first bar was set from a SINGLE run. It stored frozenMs = 0, and 0 is the
       luckiest value a rare-event count can have: the next honest runs froze once
       (533-567 ms) and then twice (1133), and the ratchet refused a clean tree. Adding
       slack for one freeze only moved the cliff to two.
       A NUMBER THAT APPEARS AS NONE-OR-SOMETIMES CANNOT BE PINNED FROM ONE SAMPLE. So
       accepting now walks the cut several times and keeps the WORST of each number,
       which is the shape gates/bohemia_phone_perf.js settled on for the same reason on
       9/5. Scoring a push is still ONE run -- accepting is the deliberate, rare act and
       it is the one that can afford the time. */
    const runs = [now];
    const rArg = process.argv.indexOf('--runs');
    const want = rArg > 0 && process.argv[rArg + 1] ? +process.argv[rArg + 1] : 3;
    for (let i = 1; i < want; i++) {
      console.log('\n  accepting: walk ' + (i + 1) + ' of ' + want + ' (the bar is the WORST'
        + ' of them, never the luckiest)');
      let again = null;
      if (!useTree) {
        let c2 = null;
        try {
          c2 = cutToTemp();
          again = await score({ serve: { '/slices/BOHEMIA_DEMO.html': c2.demo } });
        } finally { if (c2) { try { fs.rmSync(c2.tmp, { recursive: true, force: true }); } catch (e) {} } }
      } else {
        again = await score({});
      }
      if (again.broken.length) {
        console.log('  walk ' + (i + 1) + ' was BROKEN, so it cannot set a bar: '
          + again.broken[0]);
        process.exit(1);
      }
      runs.push(again);
    }
    let sha = '';
    try { sha = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim(); } catch (e) {}
    const numbers = {}, spread = {};
    for (const [k, dir] of WORSE) {
      const vals = runs.map(r => r[k]).filter(v => typeof v === 'number' && isFinite(v));
      if (!vals.length) { numbers[k] = now[k]; continue; }
      numbers[k] = dir === 'hi' ? Math.max(...vals) : Math.min(...vals);
      spread[k] = vals;
    }
    console.log('\n  what ' + runs.length + ' walk(s) saw, and the bar taken from them:');
    for (const [k] of WORSE) {
      console.log('    ' + k.padEnd(14) + (spread[k] ? spread[k].join(', ') : '?').padEnd(28)
        + ' -> ' + numbers[k]);
    }
    fs.writeFileSync(ACCEPTED, JSON.stringify({
      what: 'The numbers of the last ACCEPTED cut. tools/bohemia_never_worse.js refuses a '
          + 'push that scores worse than these. Paolo 9/20, rule 18c.',
      why: 'PAOLO 9/20: "we were closer to being able to play before, right now we\'re '
         + 'farther than we\'ve ever been." The game got worse under a rule that said never '
         + 'worse, because the rule was a sentence.',
      acceptedOn: new Date().toISOString(), sha, boxRatio: now.boxRatio,
      walks: runs.length, sawAcrossWalks: spread,
      numbers, detail: now,
    }, null, 1));
    console.log('\n  ACCEPTED. ' + path.relative(ROOT, ACCEPTED) + ' now holds the bar.');
    process.exit(0);
  }

  if (bad.length) {
    console.log('\n  *** REFUSED. ' + bad.length + ' number(s) are worse than the last accepted cut. ***');
    for (const r of bad) console.log('      ' + r.k + ': was ' + r.was + ', now ' + r.now
      + (r.allowed !== r.was ? ' (allowed up to ' + r.allowed + ')' : ''));
    process.exit(1);
  }
  console.log('\n  the cut is not worse than the last accepted one.');
  process.exit(0);
})();
