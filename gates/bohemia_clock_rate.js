#!/usr/bin/env node
/*
 * HOW MANY IN-GAME MINUTES PASS PER REAL MINUTE OF PLAY.
 * (9/7/26, PLUMBER lane, VAMILY row [clock math] HOW-MANY-GAME-MINUTES-PER-REAL-MINUTE)
 *
 * THE ROW: "a day is 1,440 in-game minutes, a step is 0.084 of them, standing
 * still costs nothing, and NOBODY has measured how many in-game minutes pass per
 * real minute of play. Without that number nobody can say how many days a hundred
 * hours holds or whether three generations fit."
 * (records/BOHEMIA_COORDINATOR_RESEARCH_HOW_LONG_IS_A_DAY_9_7_26.md)
 *
 * WHY IT CANNOT BE DIVIDED OUT ON PAPER. 0.084 minutes per cell is a RATE PER
 * CELL, not per second. What turns it into minutes-per-minute is how fast a held
 * thumb actually moves you, and that is a frame rate, a step animation and a
 * repeat delay -- three things nobody has measured together. So this walks the
 * real city with a real held touch and reads the game's own clock either side.
 *
 * WHAT IT MEASURES, on the walked surface, through the demo:
 *   IDLE     the clock over N seconds with nobody touching anything
 *   WALKING  the clock over N seconds of a continuously held walk pad
 * and from the walking rate it derives the two numbers the row actually wants:
 * how long a WAKING DAY (06:00 to nightfall at 22:00, so 960 in-game minutes)
 * takes in real minutes, and how many days a hundred hours of play holds.
 *
 * THE CLOCK IS READ FROM THE GAME'S OWN STATE, NOT FROM THE SCREEN. T.min is the
 * whole-minute clock every reader uses, and DAY._frac is the sub-minute remainder
 * the day loop keeps (walking ticks 0.084 at a time, so without the remainder a
 * short walk reads as zero and the rate comes out too low). Both are read, so the
 * number is the true elapsed time and not the rounded one.
 *
 * It is a library: gates/clock_rate_gate.js holds the budget, this takes it.
 */
const path = require('path');
const PERF = require(path.join(__dirname, 'bohemia_phone_perf.js'));
const sleep = ms => new Promise(r => setTimeout(r, ms));

const WAKING_MIN = 22 * 60 - 6 * 60;   /* 06:00 to nightfall 22:00 = 960 */

/* the clock, in exact in-game minutes: whole minutes plus the day loop's own
   sub-minute remainder, which is where a walk's 0.084 lives until it adds up */
const READ_CLOCK = `(() => {
  try {
    if (typeof DAY === 'undefined' || !DAY) return null;
    const frac = (typeof DAY._frac === 'number' && isFinite(DAY._frac)) ? DAY._frac : 0;
    return { day: DAY.day, min: DAY.min, frac: frac,
             exact: DAY.day * 1440 + DAY.min + frac,
             phase: DAY.phase, steps: DAY.ledger ? DAY.ledger.steps : null };
  } catch (e) { return null; }
})()`;

async function run(opts) {
  opts = opts || {};
  const idleMs = opts.idleMs || 20000;
  const walkMs = opts.walkMs || 30000;
  const log = opts.log || (() => {});
  const { chromium } = PERF.requirePlaywright();
  const { srv, port } = await PERF.startServer();
  const browser = await chromium.launch();
  const out = { takenOn: new Date().toISOString(), idleMs, walkMs };
  try {
    const ctx = await browser.newContext(PERF.PHONE);
    await ctx.addInitScript(PERF.WITNESS);
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    page.__cdp = cdp;
    await cdp.send('Performance.enable');
    const boot = await PERF.bootToPlay(page, 'http://127.0.0.1:' + port, PERF.PAGES.demo, log, {});
    const fr = boot && boot.frame ? boot.frame : null;
    if (!fr) { out.why = 'the walked city never came up'; return out; }
    out.firstPlayMs = (boot.marks && boot.marks.firstStep) || null;

    const clock = async () => fr.evaluate(READ_CLOCK).catch(() => null);
    const c0 = await clock();
    if (!c0) { out.why = 'the page has no DAY clock to read'; return out; }
    out.wakesAt = { day: c0.day, min: c0.min, phase: c0.phase };

    /* ---- IDLE: nobody touches anything ---- */
    const i0 = await clock(), it0 = Date.now();
    await sleep(idleMs);
    const i1 = await clock(), itWall = Date.now() - it0;
    out.idle = {
      realSeconds: +(itWall / 1000).toFixed(1),
      gameMinutes: +((i1.exact - i0.exact)).toFixed(4),
      stepsTaken: (i1.steps != null && i0.steps != null) ? i1.steps - i0.steps : null
    };
    out.idle.gameMinPerRealMin = +(out.idle.gameMinutes / (itWall / 60000)).toFixed(4);

    /* ---- WALKING: a real held thumb, AND IT TURNS WHEN IT IS BLOCKED -------
       THE FIRST CUT OF THIS HELD ONE DIRECTION AND THE NUMBER WAS A LIE. Holding
       'up' walks you north until a wall, and then the thumb is still down and
       nothing is moving: two separate runs both stopped at EXACTLY 28 cells,
       which is not a walking speed, it is the distance to the nearest obstacle.
       Anything divided by the whole window after that is "cells until you hit
       something per second", which is not a property of the game at all.
       So this watches the player's own coordinates and TURNS when they stop
       changing, the way a person does. It also reports how much of the window
       was spent moving against blocked, because a player who walks into a wall
       earns no minutes and that is a real part of the answer. */
    const pad = boot.pad || await PERF.padPoints(page, fr);
    const dirs = ['up', 'right', 'down', 'left'].filter(d => pad && pad[d]);
    if (!dirs.length) { out.why = 'the walk pad was not found'; return out; }
    const where = async () => fr.evaluate(() => { try { return [hx, hy]; } catch (e) { return null; } }).catch(() => null);

    const w0 = await clock(), wt0 = Date.now();
    let di = 0, blockedMs = 0, movingMs = 0, turns = 0, cells = 0;
    let last = await where();
    while (Date.now() - wt0 < walkMs) {
      const d = dirs[di % dirs.length];
      await PERF.touchDown(cdp, pad[d]);
      const legStart = Date.now();
      let legMoved = 0, stalls = 0;
      while (Date.now() - wt0 < walkMs) {
        await sleep(400);
        await PERF.touchMove(cdp, { x: pad[d].x + (Math.random() * 2 - 1), y: pad[d].y + (Math.random() * 2 - 1) });
        const now = await where();
        if (now && last && (now[0] !== last[0] || now[1] !== last[1])) {
          cells += Math.abs(now[0] - last[0]) + Math.abs(now[1] - last[1]);
          legMoved++; stalls = 0; movingMs += 400;
        } else { stalls++; blockedMs += 400; }
        last = now || last;
        if (stalls >= 2) break;          /* wall: turn, the way a person does */
      }
      await PERF.touchUp(cdp);
      void legStart; void legMoved;
      di++; turns++;
    }
    const wtWall = Date.now() - wt0;
    const w1 = await clock();
    const gameMin = w1.exact - w0.exact;
    out.walking = {
      realSeconds: +(wtWall / 1000).toFixed(1),
      gameMinutes: +gameMin.toFixed(4),
      cellsMoved: cells,
      stepsTaken: (w1.steps != null && w0.steps != null) ? w1.steps - w0.steps : null,
      turnsWhenBlocked: turns,
      secondsMoving: +(movingMs / 1000).toFixed(1),
      secondsBlocked: +(blockedMs / 1000).toFixed(1),
      clockBefore: w0.min, clockAfter: w1.min, phase: w1.phase
    };
    out.walking.gameMinPerRealMin = +(gameMin / (wtWall / 60000)).toFixed(3);
    if (cells) {
      out.walking.minutesPerCell = +(gameMin / cells).toFixed(5);
      out.walking.cellsPerRealSecond = +(cells / (wtWall / 1000)).toFixed(2);
      if (movingMs) out.walking.cellsPerMovingSecond = +(cells / (movingMs / 1000)).toFixed(2);
    }

    /* ---- what the row actually asked for ---- */
    const rate = out.walking.gameMinPerRealMin;
    if (rate > 0) {
      out.derived = {
        wakingDayGameMinutes: WAKING_MIN,
        realMinutesPerWakingDay: +(WAKING_MIN / rate).toFixed(1),
        daysInAHundredHours: +((100 * 60) / (WAKING_MIN / rate)).toFixed(1),
      };
      out.derived.daysPerFiveMinuteSession = +(5 / (WAKING_MIN / rate)).toFixed(3);
    }
    return out;
  } finally {
    await browser.close();
    srv.close();
  }
}

module.exports = { run, READ_CLOCK, WAKING_MIN };

if (require.main === module) {
  run({ log: s => console.log(s) }).then(r => console.log(JSON.stringify(r, null, 2)));
}
