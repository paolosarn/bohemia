#!/usr/bin/env node
/* __BOHEMIA_SOLO__
 * THE CLOCK RATE GATE -- HOW MANY IN-GAME MINUTES A REAL MINUTE BUYS.
 * (9/7/26, PLUMBER lane, VAMILY row [clock math] HOW-MANY-GAME-MINUTES-PER-REAL-MINUTE)
 *
 * WHAT THE ROW ASKED: "a day is 1,440 in-game minutes, a step is 0.084 of them,
 * standing still costs nothing, and NOBODY has measured how many in-game minutes
 * pass per real minute of play. Without that number nobody can say how many days
 * a hundred hours holds or whether three generations fit. Measure it on the real
 * surface, walking and idle, publish it, hold it in a gate."
 *
 * WHY IT COULD NOT BE DIVIDED OUT ON PAPER. 0.084 minutes per cell is a rate PER
 * CELL. What turns it into minutes-per-minute is how fast a held thumb actually
 * moves you, which is a frame rate, a step animation and a repeat delay together.
 * So it is walked, on the real surface, and the game's own clock is read either
 * side of the walk.
 *
 * WHAT IT HOLDS, AND WHAT IT DELIBERATELY DOES NOT:
 *   HELD    standing still earns NOTHING. That is a design fact the row states
 *           and the day loop implements; the day this stops being true, this
 *           line says so before anybody discovers it in a playtest.
 *   HELD    the measured minutes-per-cell agrees with the constant the day loop
 *           declares (0.084). One fact from two directions: if the walk stops
 *           spending time, or the constant is edited without the walk changing,
 *           they disagree and this goes red.
 *   HELD    a WIDE sanity band on the rate, far either side of today. It is not a
 *           target, it is a tripwire: my own first cut of this instrument read
 *           3.5x too slow because it walked into a wall, and a band that wide
 *           still catches that.
 *   PRINTED, NEVER ASSERTED: the real minutes a waking day takes, and the days a
 *           hundred hours holds. THE DAY LENGTH IS A DIAL AND IT IS NOT THIS
 *           LANE'S. The coordinator routed it to RUN as "[a day is], the craft's
 *           15 minutes as the default". A gate that pins a number nobody has
 *           ruled is this lane deciding content, which it may not do.
 *
 * AND IT CHECKS THE INSTRUMENT BEFORE IT CHECKS THE GAME. The first version held
 * ONE direction, so it walked north into a wall and then stood there with the
 * thumb down: two runs both stopped at exactly 28 cells, which is not a walking
 * speed, it is the distance to the nearest obstacle, and it made the day look
 * three and a half times longer than it is. So the walker turns when it stalls,
 * and this gate goes red if it never turned, if most of the window was spent
 * blocked, or if barely any ground was covered.
 */
const path = require('path');
const CLOCK = require(path.join(__dirname, 'bohemia_clock_rate.js'));

/* the day loop's own constant, so the measured rate can be checked against the
   number the code declares rather than against itself */
const DECLARED_MIN_PER_CELL = 0.084;

let pass = 0, fail = 0;
const ok = (c, m, got) => { if (c) { pass++; console.log('  ok   ' + m + (got ? '   [' + got + ']' : '')); }
  else { fail++; console.log('  FAIL ' + m + (got ? '   [' + got + ']' : '')); } };

(async () => {
  let R = null;
  try { R = await CLOCK.run({ idleMs: 20000, walkMs: 30000, log: () => {} }); }
  catch (e) { ok(false, 'the demo booted far enough to read its clock', e.message); }

  if (!R || R.why || !R.walking) {
    ok(false, 'THE CLOCK WAS READ ON THE REAL SURFACE', (R && R.why) || 'no sample');
  } else {
    const W = R.walking, I = R.idle, D = R.derived || {};
    console.log('\nTHE CLOCK, WALKED AND IDLE, ON THE DEMO');
    console.log('    idle     ' + I.realSeconds + ' s real  ->  ' + I.gameMinutes +
                ' in-game minutes  (' + I.gameMinPerRealMin + ' per real minute)');
    console.log('    walking  ' + W.realSeconds + ' s real  ->  ' + W.gameMinutes +
                ' in-game minutes  (' + W.gameMinPerRealMin + ' per real minute)');
    console.log('             ' + W.cellsMoved + ' cells, ' + W.minutesPerCell +
                ' min per cell, ' + W.cellsPerRealSecond + ' cells a second' +
                (W.cellsPerMovingSecond ? ' (' + W.cellsPerMovingSecond + ' while actually moving)' : ''));
    console.log('             turned at a wall ' + W.turnsWhenBlocked + ' times, ' +
                W.secondsMoving + ' s moving against ' + W.secondsBlocked + ' s blocked');

    /* ---- THE INSTRUMENT, BEFORE THE GAME ---- */
    ok(W.cellsMoved > 20, 'THE WALK ACTUALLY WALKED. A window where nobody moved divides a real '
       + 'clock by a real minute and reports a game with no time in it', W.cellsMoved + ' cells');
    ok(W.turnsWhenBlocked >= 1, 'AND IT TURNED WHEN IT HIT SOMETHING. Holding one direction walks '
       + 'into a wall and then stands there with the thumb down -- my first cut did exactly that, '
       + 'stopped at 28 cells twice, and made the day read 3.5x too long',
       W.turnsWhenBlocked + ' turns');
    ok(W.secondsBlocked < W.secondsMoving, 'AND IT SPENT MORE OF THE WINDOW MOVING THAN STUCK. '
       + 'Mostly-stuck is a measurement of the map, not of the clock',
       W.secondsMoving + ' s moving, ' + W.secondsBlocked + ' s blocked');
    ok(I.realSeconds >= 15, 'THE IDLE WINDOW WAS LONG ENOUGH TO SEE A SLOW CLOCK',
       I.realSeconds + ' s');

    /* ---- THE DESIGN FACTS ---- */
    ok(I.gameMinPerRealMin === 0, 'STANDING STILL EARNS NOTHING. The day is spent by WALKING and '
       + 'by the bed; a clock that ticks while nobody plays would spend a life in a pocket',
       I.gameMinutes + ' in-game minutes over ' + I.realSeconds + ' s');
    const drift = Math.abs(W.minutesPerCell - DECLARED_MIN_PER_CELL);
    ok(drift < 0.01, 'THE MEASURED COST OF A CELL AGREES WITH THE CONSTANT THE DAY LOOP DECLARES ('
       + DECLARED_MIN_PER_CELL + '). One fact from two directions: if walking stops spending time, '
       + 'or the constant is edited and the walk is not, these two part company',
       'measured ' + W.minutesPerCell + ', declared ' + DECLARED_MIN_PER_CELL +
       ', apart by ' + drift.toFixed(5));

    /* ---- THE TRIPWIRE, DELIBERATELY WIDE ---- */
    ok(W.gameMinPerRealMin > 4, 'A REAL MINUTE BUYS MORE THAN FOUR IN-GAME MINUTES. A wide floor, '
       + 'not a target: it exists to catch an instrument that stopped walking, which is how this '
       + 'number was first got wrong', W.gameMinPerRealMin + ' per real minute');
    ok(W.gameMinPerRealMin < 120, '...and fewer than a hundred and twenty, so a runaway clock that '
       + 'burns a day in eight minutes is caught too', W.gameMinPerRealMin + ' per real minute');

    /* ---- WHAT THE ROW WANTED, PUBLISHED AND NOT ASSERTED ---- */
    if (D.realMinutesPerWakingDay) {
      console.log('\n  WHAT THAT MAKES A DAY, AND IT IS NOT ASSERTED:');
      console.log('    a waking day is ' + D.wakingDayGameMinutes + ' in-game minutes (06:00 to '
                  + 'nightfall at 22:00), so at this rate it takes '
                  + D.realMinutesPerWakingDay + ' REAL MINUTES.');
      console.log('    a hundred hours of play holds ' + D.daysInAHundredHours + ' DAYS.');
      console.log('    a five-minute session is ' + D.daysPerFiveMinuteSession + ' of a day.');
      console.log('    THE DAY LENGTH IS A DIAL AND IT IS NOT THIS LANE\'S: routed to RUN as');
      console.log('    [a day is], with the craft\'s 15 real minutes as the default. This gate');
      console.log('    measures and publishes; it does not pin a number nobody has ruled.');
    }
    ok(!!D.realMinutesPerWakingDay, 'AND THE DAY LENGTH WAS DERIVED AND PRINTED. The row asked for '
       + 'the number to be published; a gate that measures it and keeps it to itself has not '
       + 'answered the question', D.realMinutesPerWakingDay + ' real minutes a day');
  }

  console.log('\n=== CLOCK RATE GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})().catch(e => {
  console.log('  FAIL the gate itself threw: ' + e.message);
  console.log('\n=== CLOCK RATE GATE: ' + pass + ' passed, ' + (fail + 1) + ' failed ===');
  process.exit(1);
});
