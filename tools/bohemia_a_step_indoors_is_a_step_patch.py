#!/usr/bin/env python3
"""
A STEP INDOORS IS STILL A STEP (8/20/26, RUN lane).

Yesterday's fix made the day loop hear the player walking: the walk now calls
DAY.step per cell and the clock accumulates sub-minute ticks instead of
truncating them away. That fix went into ONE mover.

THERE ARE TWO. The outdoor walk is stepOnce(); walking around inside a building
goes through the interior mover, which does its own bookkeeping:

    INSIDE.ix=nx; INSIDE.iy=ny; HFACE=dirOf(d[0],d[1]); advance(0.084); return true;

Same 0.084 per cell -- so indoors DOES spend the day correctly -- and no
DAY.step, so not one of those cells is counted. Walk the length of a house and
the reckoning still says you took zero steps in it.

MEASURED: a gate block that walked AFTER he was already inside reported "walking
counts as steps: 0" and I nearly read it as the outdoor fix having failed. It had
not. It was the second mover, which nothing had ever asked about.

THIS IS THE SAME SHAPE, ONE ROOM OVER. Yesterday's note said DAY.step had no
caller anywhere; it now has exactly one, and the other place a body moves still
does not call it. A seam with one caller looks finished from the outside.

The interior mover already ticks the same 0.084 the outdoor one does, so this
changes NO time and NO dial -- it makes the step counter agree with the clock
that was already running. step() ticks zero minutes, so it cannot double-charge.

REUSE CHECK: cooks no graphic pixels of any kind and opens no art bank, because
nothing here is drawn. It adds one call, copied in form from the outdoor mover
this lane wrote yesterday, so both movers now read identically.

Gate: gates/first_night_gate.js walks him into his own house and then across a
room, asserting the counter moves indoors too.

Idempotent: re-running finds the marker and reports NOOP.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__A_STEP_INDOORS_IS_A_STEP__'

OLD = """  if(!inPassable(nx,ny))return false;
  INSIDE.ix=nx; INSIDE.iy=ny; HFACE=dirOf(d[0],d[1]); advance(0.084); return true;"""

NEW = """  if(!inPassable(nx,ny))return false;
  INSIDE.ix=nx; INSIDE.iy=ny; HFACE=dirOf(d[0],d[1]);
  /* """ + MARK + """ -- THE OTHER MOVER. Yesterday's fix taught the day loop to
     hear the player walking, and it went into stepOnce() -- the OUTDOOR walk.
     This is the indoor one, and it was still silent: same 0.084 per cell, so the
     clock was right, but no DAY.step, so walking the length of a house counted
     zero steps. A gate block that ran after he was already inside reported
     "walking counts as steps: 0" and I nearly read it as the outdoor fix having
     failed. A seam with exactly one caller looks finished from the outside.
     step() ticks zero minutes, so the advance below is still the only thing
     spending the day and this cannot double-charge him. */
  try{ DAY.step(dayWhere()); }catch(_e){}
  advance(0.084); return true;"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf-8').read()
    if MARK in s:
        print('NOOP: ' + MARK + ' already present')
        return
    if OLD not in s:
        sys.exit('FAIL: the interior mover anchor is not where this expects it')
    s = s.replace(OLD, NEW, 1)
    open(CITY, 'w', encoding='utf-8').write(s)
    print('PATCHED ' + CITY + ' (' + str(len(s)) + ' bytes)')


if __name__ == '__main__':
    main()
