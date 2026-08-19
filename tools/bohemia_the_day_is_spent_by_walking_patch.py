#!/usr/bin/env python3
"""
THE DAY NEVER MOVED WHILE HE WALKED (8/19/26, RUN lane).

FOUND BY FINISHING THE REACHABILITY HALF of the first-night audit -- the half
that stops asking "does the beat work" and starts asking "can he DO it". The demo
gate teleports (`city.x = h.x`) and calls offerAccept() instead of tapping, so
nothing had ever measured what happens when a player just holds a direction.

MEASURED, WITH DAY.tick AND DAY.step HOOKED, ON THE REAL ALPHA:

    held EAST for 5 seconds
    body moved 6205 -> 6211          (6 fine cells)
    DAY.tick called 6 times, 0.084 each   -> 0.504 minutes of walking
    DAY.min BEFORE 360 ... DAY.min AFTER 360      <-- NOTHING
    DAY.step called 0 times, summary.steps 0      <-- NOTHING

TWO SEPARATE BUGS, AND THE FIRST ONE IS ONE CHARACTER WIDE.

(1) engine/bohemia_dayloop.js:109

        mins = Math.max(0, mins | 0);

    `0.084 | 0` is 0. `| 0` is an integer truncation, so EVERY sub-minute tick is
    discarded. The city is doing exactly the right thing -- its walk calls
    `advance(0.084)` under the comment "time per CELL, distance-honest" -- and the
    engine throws it on the floor. It is not a rounding error that averages out:
    each call truncates independently, so the remainder can never accumulate and
    WALKING CAN NEVER ADVANCE THE CLOCK, at any distance, forever. Interior
    movement (advance(0.5), advance(0.084)) is eaten the same way. Only the
    whole-minute callers -- the overmap marker at advance(10), sleep at
    advance(60) -- ever moved the day.

    THIS IS WHY THE RECKONING ALWAYS SAID THE SAME THING. "06:00 - 0h lived -
    16h given back" reads like a report of a quiet day. It is a report of a day
    that CANNOT be spent by playing: you can walk the whole valley and hand all
    sixteen hours back unspent.

(2) DAY.step is never called by anything. The engine has had `L.step` since the
    day loop shipped -- it increments ledger.steps and is what the reckoning's
    "N steps" line reads -- and a repo-wide grep finds NO caller. The walk does
    `moved++`, a local counter nothing reads. So "0 steps" was not a measurement
    either. NINTH time this lane has found the same shape: a finished thing with
    a published seam and nobody calling it.

THE FIX KEEPS THE REMAINDER INSTEAD OF DISCARDING IT. L.min stays a whole number,
because everything downstream reads it (hhmm, the HUD, serialize, T.min) and
making it fractional would push a display change into a dozen readers. A private
accumulator carries the sub-minute part, and whole minutes fall out of it: twelve
walked cells now cost one minute, which is what "distance-honest" meant.

SANITISATION IS KEPT, DELIBERATELY. `| 0` was also doing the job of turning NaN,
undefined and strings into 0, so removing it outright would let a bad caller push
NaN into the clock and freeze the day forever. It is replaced by an explicit
finite check, which is what that half of the line actually meant.

The accumulator RIDES THE SAVE. Dropping it on reload would be sub-minute and
harmless, but a day that quietly loses a fraction on every restore is the same
class of slow lie this file already fixed once, and it costs one field.

WHAT THIS DOES NOT DO: it does not change what a day COSTS. 0.084 min/cell is the
city's existing number and EVERYTHING COSTS ONE (8/15) says the dials are Paolo's
after he plays it end to end. This makes the existing number reach the clock; it
does not tune it.

REUSE CHECK: cooks no graphic pixels of any kind and opens no art bank, because
nothing here is drawn. It changes one arithmetic line in the day loop and adds
one call on the walk path.

Gate: gates/first_night_gate.js walks with a real pointer hold and asserts the
clock moved and the steps counted.

Idempotent: re-running finds the marker and reports NOOP.
"""
import os
import sys

ENGINE = 'engine/bohemia_dayloop.js'
CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__THE_DAY_IS_SPENT_BY_WALKING__'

ENG_OLD = """    L.tick = function (mins, where) {
      if (L.phase !== 'awake') return L.phase;
      mins = Math.max(0, mins | 0);"""

ENG_NEW = """    L.tick = function (mins, where) {
      if (L.phase !== 'awake') return L.phase;
      /* """ + MARK + """ -- THIS LINE WAS `mins = Math.max(0, mins | 0)`
         AND IT ATE EVERY STEP THE PLAYER EVER TOOK.
         `| 0` truncates to an integer, and the walk ticks 0.084 minutes per fine
         cell ("time per CELL, distance-honest", the city's own comment), so
         0.084|0 === 0 and the time was discarded. Not a rounding error that
         averages out: each call truncated independently, so the remainder could
         never accumulate and WALKING COULD NEVER MOVE THE CLOCK, at any
         distance, forever. Interior movement went the same way. Only whole-minute
         callers -- the overmap marker at 10, sleep at 60 -- ever spent a day.
         MEASURED 8/19 with tick hooked: six cells walked, six calls of 0.084,
         0.504 minutes owed, DAY.min 360 before and 360 after. That is why the
         reckoning always read "0h lived - 16h given back": it was not reporting a
         quiet day, it was reporting a day that could not be spent by playing.
         THE REMAINDER IS KEPT NOW. L.min stays whole because everything
         downstream reads it (hhmm, the HUD, serialize, T.min); the fraction
         lives here and whole minutes fall out of it, so twelve walked cells cost
         one minute.
         THE SANITISING HALF OF THE OLD LINE IS KEPT ON PURPOSE: `| 0` also turned
         NaN and undefined into 0, and without that a bad caller could push NaN
         into the clock and freeze the day permanently. That is what the explicit
         finite check is for -- it is the half of the line that was doing real
         work. */
      mins = (typeof mins === 'number' && isFinite(mins)) ? Math.max(0, mins) : 0;
      L._frac = (L._frac || 0) + mins;
      mins = Math.floor(L._frac);
      L._frac -= mins;"""

ENG_SER_OLD = """      return { v: 1, day: L.day, min: L.min, phase: L.phase, ledger: L.ledger, history: L.history };"""
ENG_SER_NEW = """      /* """ + MARK + """ -- the sub-minute remainder rides the save. Losing it
         is harmless once and a slow lie every reload. */
      return { v: 1, day: L.day, min: L.min, phase: L.phase, ledger: L.ledger,
               history: L.history, frac: L._frac || 0 };"""

ENG_RES_OLD = """      L.history = st.history || [];
      return true;"""
ENG_RES_NEW = """      L.history = st.history || [];
      /* """ + MARK + """ -- an older save has no frac; 0 is exactly right for it. */
      L._frac = (typeof st.frac === 'number' && isFinite(st.frac)) ? st.frac : 0;
      return true;"""

# ---- the walk must count as a step -----------------------------------------
CITY_OLD = """      hx=nx; hy=ny; moved++; advance(0.084); /* __CITY_FACTIONS__ */ ctSawCell();        // time per CELL, distance-honest"""

CITY_NEW = """      hx=nx; hy=ny; moved++;
      /* """ + MARK + """ -- A WALKED CELL IS A STEP, AND NOTHING SAID SO.
         The day loop has had L.step since it shipped -- it is what the
         reckoning's "N steps" line reads -- and a repo-wide grep found NO
         caller anywhere. `moved++` above is a local counter nothing reads, so
         the reckoning reported 0 steps no matter how far he walked. Ninth time
         this lane has found a finished thing with a published seam and nobody
         calling it. step() ticks 0 minutes, so the time below is still the only
         thing spending the day and this cannot double-charge him. */
      try{ DAY.step(dayWhere()); }catch(_e){}
      advance(0.084); /* __CITY_FACTIONS__ */ ctSawCell();        // time per CELL, distance-honest"""


def patch(path, pairs):
    if not os.path.exists(path):
        sys.exit('FAIL: ' + path + ' not found')
    s = open(path, encoding='utf-8').read()
    if MARK in s:
        print('NOOP: ' + MARK + ' already in ' + path)
        return
    for name, old, new in pairs:
        if old not in s:
            sys.exit('FAIL: anchor not found in ' + path + ' -- ' + name)
        s = s.replace(old, new, 1)
    open(path, 'w', encoding='utf-8').write(s)
    print('PATCHED ' + path + ' (' + str(len(s)) + ' bytes)')


def main():
    patch(ENGINE, [('the tick truncation', ENG_OLD, ENG_NEW),
                   ('serialize', ENG_SER_OLD, ENG_SER_NEW),
                   ('restore', ENG_RES_OLD, ENG_RES_NEW)])
    patch(CITY, [('the walk step', CITY_OLD, CITY_NEW)])


if __name__ == '__main__':
    main()
