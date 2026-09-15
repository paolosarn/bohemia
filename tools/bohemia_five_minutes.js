#!/usr/bin/env node
/* ============================================================================
   THE FIVE MINUTES, COUNTED (9/14/26, PLUMBER lane, VAMILY row [demo errors])

   PAOLO 9/13: "it's like this glitchy, buggy AI experience where nothing's
   complete." Rule 14 makes the demo's first five minutes on a phone the only
   measure of the game. This turns his sentence into four numbers, every round:

       PAGE ERRORS          anything the page threw while he played
       STALLS               gaps longer than ONE BEAT (500 ms at 120 BPM)
       DEAD TAPS            taps that changed not one pixel
       SLOW FRAMES          frames that took longer than 1/60 s

   RULE 14 (g): THERE IS ONE DRIVER. This REQUIRES tools/bohemia_drive_the_demo.js
   (LIFE + CITY) rather than opening its own browser, because that lane paid four
   rounds for the four traps between a script and the glass -- the iframe offset,
   the card that eats every tap, a text selector not being a finger, and assignment
   not being input. None of that is re-learned here.

   ## A DEAD TAP IS MEASURED ON THE GLASS, NOT FROM A SELECTOR

   Rule 14 (g) again: "A screenshot is the honest instrument; a selector is a
   guess." So a tap counts as DEAD only when the canvas is byte-identical before
   and after it. Not "no handler fired", not "no variable moved" -- the player
   cannot see either of those. He sees a screen that did not change.

   That is deliberately strict in the player's favour and loose in ours: a tap that
   changes one pixel is not counted dead, even if what it changed is useless. This
   number is a floor on the problem, never the whole of it.

   ## WHY THE BOX SPEED IS PRINTED BESIDE THE FRAME NUMBERS

   This lane spent a round concluding three different wrong things from wall clocks
   taken hours apart, because this machine runs up to 1.8x slower some hours with
   nothing in the game changed. SLOW FRAMES is a wall clock. It is reported with
   the ratio the run was taken at, or it is a number about an afternoon.

   ## FLOORS

   A walk that drove no taps, or saw no frames, agrees that the demo is perfect.
   Three of the counts only mean something if the walk actually happened, so the
   walk's own size is asserted first and printed whether it passes or not.

     node tools/bohemia_five_minutes.js            five minutes, the real thing
     node tools/bohemia_five_minutes.js --quick    ~60 s, for checking the wiring
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const D = require(path.join(__dirname, 'bohemia_drive_the_demo.js'));
const SPEED = require(path.join(__dirname, '..', 'gates', 'bohemia_box_speed.js'));

const ROOT = path.join(__dirname, '..');
const NO_TAPS = process.argv.includes('--no-taps');
const BEAT = 500;            /* 120 BPM, the law */
const FRAME = 1000 / 60;     /* the only frame budget in the building */
const RECORD = 'records/BOHEMIA_FIVE_MINUTES.json';

/* THROTTLE. PAOLO 9/15, his second play: "it's kinda not running as smoothly as I would
   like, maybe it's cause things are loading in real time." Coordinator ruling 5 sends
   that to this lane by name and asks for fps "on a THROTTLED phone profile".
   THIS CONTAINER IS NOT A HANDSET. Every fps number this fleet has ever posted was
   taken on a machine several times faster than the thing in his hand, which is exactly
   how "57.8 fps" and "not running smoothly" can both be true statements about the same
   build. `--throttle N` slows the CPU by N, the same knob DevTools uses.
   NO SINGLE NUMBER IS HONEST HERE, because nobody in this repo has ever measured a real
   iPhone, so picking one multiplier would be a guess wearing a decimal point. The tool
   takes a rate and prints it, and the round runs a LADDER (1x, 4x, 6x) so the shape of
   the fall is visible instead of one invented figure. */
const TH = (() => { const i = process.argv.indexOf('--throttle');
  return i > 0 && process.argv[i + 1] ? +process.argv[i + 1] : 1; })();

/* Installed in the page: every animation frame, and how long since the last one.
   rAF is what the game paints on, so this is the same clock the player's eye is on. */
const WATCH = `(function(){
  window.__fm = { frames: 0, slow: 0, dropped: 0, stalls: 0, worst: 0, last: 0,
                  t0: Date.now(), sec: [] };
  /* FRAMES PER SECOND, SECOND BY SECOND (added 9/15 for Paolo's ruling 5).
     He said two things in one breath: "it's kinda not running as smoothly as I would
     like" and "MAYBE IT'S CAUSE THINGS ARE LOADING IN REAL TIME." Those are a symptom
     and a theory, and one whole-walk average cannot test the theory -- it smears the
     bad seconds into the good ones. A bucket per second can be laid against the moment
     each file landed, and then his theory is either true here or it is not. */
  function tick(t){
    const f = window.__fm;
    if (f.last) { const dt = t - f.last;
      f.frames++;
      var s = Math.floor((Date.now() - f.t0) / 1000);
      f.sec[s] = (f.sec[s] || 0) + 1;
      if (dt > ${FRAME}) f.slow++;
      if (dt > ${FRAME} * 2) f.dropped++;
      if (dt > ${BEAT}) f.stalls++;
      if (dt > f.worst) f.worst = dt; }
    f.last = t;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})()`;

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

(async function main() {
  process.chdir(ROOT);
  const quick = process.argv.includes('--quick');
  const SECONDS = quick ? 60 : 300;

  const before = SPEED.measure();
  console.log('\nTHE FIVE MINUTES, COUNTED -- ' + SECONDS + ' s on a phone\n');
  console.log('  ' + SPEED.line(before));

  /* A THROTTLED BOOT IS A SLOWER BOOT, so the door and city-frame ceilings scale with
     the rate. Leaving them at their 1x values would make the driver throw "no city
     frame" on a game that boots perfectly, which is the exact failure the driver's
     own header warns about (trap 5). */
  const d = await D.open({ throttle: TH,
    boot: 15000 * Math.max(1, TH), settle: 22000 * Math.max(1, TH) });
  await d.fr.evaluate(WATCH);
  if (TH > 1) console.log('  CPU THROTTLED ' + TH + 'x -- this container is not a handset, '
    + 'and every fps number this fleet has posted was taken on a faster machine than his.');
  console.log('  door reached at ' + (d.firstPaintMs() / 1000).toFixed(1) + ' s, after '
    + d.loads.length + ' file(s)');

  /* THE WHOLE PHONE, NOT JUST THE CANVAS. (fixed 9/14, second wrong number.)
     The first two walks clipped the picture to the canvas, and MUSIC, SAVE, PHONE1
     and OUTFIT still came back dead eight times each -- after those same buttons had
     been proved on the glass to change the screen. The reason is that what they open
     is drawn in the PAGE around the canvas, not on it, so the instrument was
     photographing the one part of the phone that did not move.
     A player does not look at the canvas. He looks at the phone. */
  const shot = async () => {
    const b = await d.page.screenshot().catch(() => null);
    return b ? b.toString('base64') : null;
  };

  const controls = await d.controls();
  console.log('  ' + controls.length + ' control(s) on screen at the door');

  const taps = [];
  const t0 = Date.now();
  let i = 0;
  /* Walk him around and press what he can see, turn and turn about, until the
     five minutes are up. The order is fixed so two runs are comparable. */
  while ((Date.now() - t0) / 1000 < SECONDS) {
    const live = await d.controls();
    if (!live.length) break;
    const c = live[i % live.length];
    i++;
    const pre = await shot();
    /* tapEl takes a SELECTOR, not the words on the button. The first cut passed
       the text straight in and 45 taps in a row landed nowhere -- caught by the
       floor below, which is the whole reason it is there. Prefer the id, because
       an id is a handle and matching words can hit a hidden copy (the driver's own
       trap 3). Fall back to the words only when there is no id. */
    let ok = false;
    const sel = c.id ? '#' + c.id : 'text="' + c.text.replace(/"/g, '') + '"';
    /* DID THE TAP EVEN REACH THE CONTROL? (fixed 9/14, after the first real walk.)
       The first five-minute walk reported 162 DEAD TAPS of 230 -- 70% -- and the
       number was WRONG. Verified on the glass one at a time from a clean state, all
       eight named buttons (MUSIC, SAVE, PHONE1, OUTFIT, MARKET, SCAVENGE, BUILD HERE,
       STANDING) CHANGE THE SCREEN. What the walk had actually measured was itself:
       cycling through controls opens a panel, the panel then sits over the next
       button, the tap lands on the panel, and nothing changes -- which is correct
       behaviour being counted as a bug.
       So a tap only counts at all if the topmost thing at those coordinates IS the
       control. Anything else is a tap the player would never have made, and counting
       it is how an instrument reports its own confusion as the game's. */
    let reached = false;
    try {
      /* THE CONTROL WALK (--no-taps). The whole walk, one difference: NOBODY PRESSES
         ANYTHING. Everything else is identical -- same order, same waits, same two
         pictures, same arithmetic. If a walk that presses nothing reports the same
         dead taps as a walk that presses everything, then the number is not about the
         game and never was. This is the planted-bug test QUESTS used on its own gate
         (e909bc5f) and it is the only honest way to ask an instrument whether it
         measures anything. A counter with no control walk is an opinion. */
      ok = NO_TAPS ? true : await d.tapEl(sel);
      if (ok) reached = await d.fr.evaluate((q) => {
        const el = document.querySelector(q); if (!el) return false;
        const r = el.getBoundingClientRect();
        const top = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
        return !!(top && (top === el || el.contains(top) || top.contains(el)));
      }, sel);
    } catch (e) { ok = false; }
    await sleep(900);                       /* nearly two beats to answer */
    const post = await shot();
    const changed = pre && post ? pre !== post : null;
    /* RULE 14 (h) (coordinator 9/14, out of QUESTS e909bc5f): "IN THIS GAME A DEAD
       BUTTON IS INDISTINGUISHABLE FROM A CLOSE BUTTON, because a card closes on any
       tap it does not recognise and a screen diff reads the vanished card as life."
       That is a direct hit on this instrument. A picture before and against a picture
       after cannot tell "it worked" from "the card gave up and shut", so this does not
       pretend it can. It asks one more question instead: is the thing he pressed STILL
       ON SCREEN? Pixels moved and the control is gone means the only proved fact is
       that something closed, which is exactly 14(h)'s case. Those are kept in their own
       pile, so the dead number is a FLOOR, the floor plus that pile is the CEILING, and
       neither one gets dressed up as the other. */
    let survived = null;
    if (reached) {
      survived = await d.fr.evaluate((q) => {
        const el = document.querySelector(q); if (!el) return false;
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) return false;
        const st = getComputedStyle(el);
        return st.visibility !== 'hidden' && st.display !== 'none' && +st.opacity !== 0;
      }, sel).catch(() => null);
    }
    taps.push({ text: c.text, id: c.id, tapped: !!ok, reached: !!reached, changed, survived });
    if (taps.length % 25 === 0) {
      const el = ((Date.now() - t0) / 1000).toFixed(0);
      /* count the SAME way the report does, or the running line teaches a number the
         bottom of the run then contradicts: only taps that reached their control. */
      console.log('    ' + el + ' s   ' + taps.length + ' taps   '
        + taps.filter(t => t.reached && t.changed === false).length + ' dead so far');
    }
  }

  const fm = await d.fr.evaluate(() => window.__fm);
  /* WHAT LOADED WHILE HE WAS PLAYING. His own theory, in his own words, and until now
     nobody in this repo had a list to answer it with. Taken before close() so the
     page is still the page. */
  const late = d.lateLoads();
  const doorMs = d.firstPaintMs();
  const errs = d.errs.slice();
  await d.close();
  const after = SPEED.measure();

  const driven = taps.filter(t => t.tapped && t.reached);
  const blocked = taps.filter(t => t.tapped && !t.reached);
  const dead = driven.filter(t => t.changed === false);
  /* 14(h): the screen moved but the thing he pressed is gone. Could be a button doing
     its job and closing its panel; could be a dead row and the card giving up. */
  const shut = driven.filter(t => t.changed === true && t.survived === false);
  const secs = ((Date.now() - t0) / 1000).toFixed(0);

  console.log('\n  ==================  THE FOUR NUMBERS  =================='
    + (NO_TAPS ? '\n    *** CONTROL WALK: NOTHING WAS PRESSED. Any dead tap below is the'
      + ' instrument talking to itself. ***' : ''));
  console.log('    PAGE ERRORS   ' + String(errs.length).padStart(6));
  console.log('    STALLS        ' + String(fm.stalls).padStart(6)
    + '   gaps over one beat (' + BEAT + ' ms); worst ' + fm.worst.toFixed(0) + ' ms');
  console.log('    DEAD TAPS     ' + String(dead.length).padStart(6)
    + '   of ' + driven.length + ' taps that REACHED their control, on the glass'
    + (blocked.length ? '   (' + blocked.length + ' more were covered by something and do not count)' : ''));
  if (shut.length) {
    console.log('                  ' + String(shut.length).padStart(6)
      + '   more moved the screen AND VANISHED. Rule 14(h): that is what a close looks'
      + ' like too, so the honest count is between ' + dead.length + ' and '
      + (dead.length + shut.length) + '.');
  }
  /* THE RAW COUNT OVER 16.7 ms IS ALMOST ALWAYS MOST OF THEM AND NOBODY CAN ACT ON
     IT. A 60 s wiring run read 2,106 of 3,346 -- 63% -- because the average frame
     was 18.2 ms, so nearly every frame clears the line by a hair. The number he can
     act on is the RATE he actually got, and the count of frames so late that a whole
     frame went missing. Both are printed; the raw count stays because rule 14 asked
     for it by name, and hiding a number because it is inconvenient is how a measure
     stops being one. */
  const fps = fm.frames / (+secs || 1);
  console.log('    FRAME RATE    ' + fps.toFixed(1).padStart(6) + '   fps over the walk'
    + (fps >= 58 ? '' : '   <- under 60'));
  console.log('    DROPPED       ' + String(fm.dropped).padStart(6)
    + '   frames over ' + (FRAME * 2).toFixed(1) + ' ms: a whole frame missing, which is'
    + ' what an eye sees');
  console.log('    (frames over ' + FRAME.toFixed(1) + ' ms: ' + fm.slow + ' of ' + fm.frames
    + ', ' + (100 * fm.slow / (fm.frames || 1)).toFixed(0) + '% -- true but nearly always true)');
  console.log('  ========================================================');
  console.log('    walked ' + secs + ' s, box ' + before.ratio + 'x at the start, '
    + after.ratio + 'x at the end' + (TH > 1 ? ', CPU throttled ' + TH + 'x' : ''));

  /* *** THE LOADING THAT HAPPENS DURING PLAY, NAMED. (PAOLO 9/15, ruling 5.) *** */
  console.log('\n  WHAT LOADS WHILE HE IS PLAYING ("maybe it\'s cause things are loading'
    + ' in real time" -- Paolo 9/15)');
  console.log('    the door opened at ' + (doorMs / 1000).toFixed(1) + ' s, after '
    + (d.loads.length - late.length) + ' file(s). AFTER THAT, ' + late.length
    + ' more file(s) arrived while he was playing.');
  if (late.length) {
    const mb = late.reduce((a, l) => a + (l.bytes || 0), 0) / 1048576;
    console.log('    ' + mb.toFixed(1) + ' MB of it, and the last one landed '
      + ((late[late.length - 1].at - doorMs) / 1000).toFixed(1) + ' s after the door.');
    console.log('    in the order he met them:');
    for (const l of late.slice(0, 25)) {
      console.log('      +' + ((l.at - doorMs) / 1000).toFixed(1).padStart(6) + ' s  '
        + ((l.bytes || 0) / 1024).toFixed(0).padStart(6) + ' KB  ' + l.url.slice(-58));
    }
    if (late.length > 25) console.log('      ... and ' + (late.length - 25) + ' more');
  } else {
    console.log('    NOTHING. Everything the demo fetches is in before the door opens,'
      + ' so his theory does not hold on this surface and the cause is elsewhere.');
  }

  /* *** THE FIRST SECONDS OF PLAY, ONE BAR EACH. ***
     PAOLO 9/15: "it's kinda not running as smoothly as I would like."

     I tried to answer that by splitting the walk into seconds where a file landed
     and seconds where none did. I BUILT THAT TEST AND THEN THREW IT AWAY, because
     two different ways of lining up the load clock with the frame clock gave two
     different answers off the SAME run -- 45.3 against 55.3 fps one way, 51.7
     against 55.4 the other. A test that changes its verdict with its arithmetic is
     not evidence, and this lane has already published three numbers this week that
     it had to take back.

     What is in this block instead needs no clock alignment at all: the frames
     painted in each of the first seconds of play, straight off the counter. It is
     the weaker claim and it is the one that survives. It is also, as it turns out,
     the louder one. */
  if (fm.sec && fm.sec.length > 30) {
    const at = (k) => (fm.sec[k] === undefined ? 0 : fm.sec[k]);
    const head = [], HEAD_S = 15;
    for (let k = 0; k < HEAD_S; k++) head.push(at(k));
    const rest = [];
    for (let k = HEAD_S; k < fm.sec.length - 1; k++) if (fm.sec[k] !== undefined) rest.push(fm.sec[k]);
    const avg = (v) => v.length ? v.reduce((a, b) => a + b, 0) / v.length : 0;
    console.log('\n  HOW SMOOTH IS IT, SECOND BY SECOND ("it\'s kinda not running as smoothly'
      + ' as I would like" -- Paolo 9/15)');
    for (let k = 0; k < Math.min(22, fm.sec.length); k++) {
      console.log('    +' + String(k).padStart(3) + ' s  ' + String(at(k)).padStart(3)
        + '  ' + '#'.repeat(Math.round(at(k) / 2)));
    }
    console.log('    the first ' + HEAD_S + ' seconds of play averaged ' + avg(head).toFixed(1)
      + ' frames a second');
    console.log('    the other ' + rest.length + ' seconds averaged ' + avg(rest).toFixed(1));
    if (avg(head) < avg(rest) - 10) {
      console.log('    *** THE WHOLE-WALK AVERAGE HIDES THIS. He meets the worst part of the'
        + ' game first, and then it clears. ***');
    }
  }

  /* THE FLOORS, AFTER THE NUMBERS SO THEY ARE ALWAYS VISIBLE, AND BEFORE ANY VERDICT.
     (RESTORED 9/15 -- a block replacement in this file deleted them, and the very next
     run crashed on the missing variable instead of quietly reporting a walk with no
     floor under it. The crash was luck; the lesson is that the guard is the part of
     this tool that matters and it must never be collateral in an edit.)
     A walk that drove no taps, or saw no frames, agrees that the demo is perfect. */
  const floors = [];
  if (driven.length < 10) floors.push('only ' + driven.length + ' taps landed: a walk that '
    + 'pressed nothing agrees the demo is perfect');
  if (fm.frames < 100) floors.push('only ' + fm.frames + ' frames seen: the frame watcher '
    + 'was not running, so the frame counts mean nothing');
  if (doorMs === null || !(doorMs > 0)) floors.push('the door was never reached, so there '
    + 'is no "during play" and every load number above is about nothing');
  if (d.loads.length - late.length < 1) floors.push('no file arrived BEFORE the door: the '
    + 'load log is not listening, and a small "during play" number would be an instrument '
    + 'failure reported as good news');
  if (floors.length) {
    console.log('\n  *** THIS WALK DOES NOT COUNT ***');
    for (const f of floors) console.log('      ' + f);
  }

  if (dead.length) {
    const byName = {};
    for (const t of dead) byName[t.text] = (byName[t.text] || 0) + 1;
    console.log('\n  THE DEAD ONES, BY WHAT THEY SAY (he reads the words, not the id):');
    for (const [k, v] of Object.entries(byName).sort((a, b) => b[1] - a[1]).slice(0, 12)) {
      console.log('      ' + String(v).padStart(3) + '  ' + k);
    }
  }
  if (errs.length) {
    console.log('\n  THE ERRORS:');
    for (const e of [...new Set(errs)].slice(0, 8)) console.log('      ' + e);
  }

  if (NO_TAPS) { console.log('\n  control walk: not written to the record.'); process.exit(0); }
  fs.writeFileSync(RECORD, JSON.stringify({
    what: 'The demo\'s first ' + SECONDS + ' s on a phone, as four numbers. '
        + 'Written by tools/bohemia_five_minutes.js for VAMILY row [demo errors].',
    why: 'PAOLO 9/13: "it\'s like this glitchy, buggy AI experience where nothing\'s '
       + 'complete." Rule 14 makes these five minutes the only measure of the game.',
    taken: new Date().toISOString(),
    secondsWalked: +secs,
    boxSpeed: { start: before.ratio, end: after.ratio, baselineMs: before.baselineMs },
    cpuThrottle: TH,
    framesPerSecondBuckets: fm.sec,
    loadingDuringPlay: {
      why: 'PAOLO 9/15: "maybe it\'s cause things are loading in real time." Ruling 5.',
      doorMs: doorMs, beforeTheDoor: d.loads.length - late.length,
      afterTheDoor: late.length,
      afterTheDoorMB: +(late.reduce((a, l) => a + (l.bytes || 0), 0) / 1048576).toFixed(2),
      list: late.map(l => ({ sinceDoorMs: l.at - doorMs, kb: Math.round((l.bytes || 0) / 1024),
                             url: l.url, status: l.status })),
    },
    numbers: { pageErrors: errs.length, stalls: fm.stalls,
               deadTaps: dead.length, deadTapsCeiling: dead.length + shut.length,
               slowFrames: fm.slow,
               droppedFrames: fm.dropped, fps: +(fm.frames / (+secs || 1)).toFixed(1) },
    of: { tapsReached: driven.length, tapsBlocked: blocked.length,
          tapsThatMovedTheScreenAndVanished: shut.length,
          tapsTried: taps.length, frames: fm.frames,
          worstGapMs: +fm.worst.toFixed(0) },
    floorsFailed: floors,
    deadByName: dead.reduce((a, t) => (a[t.text] = (a[t.text] || 0) + 1, a), {}),
    errors: [...new Set(errs)],
  }, null, 1));
  console.log('\n  ' + RECORD);
  process.exit(0);
})().catch(e => { console.error('FIVE MINUTES CRASHED: ' + (e && e.stack || e)); process.exit(1); });
