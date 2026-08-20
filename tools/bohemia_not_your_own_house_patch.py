#!/usr/bin/env python3
"""
NOT YOUR OWN HOUSE (8/19/26, RUN lane).

FOUND ONE MINUTE AFTER FIXING THE DOORS, by walking through the door and LOOKING
at the screen instead of trusting the readout.

The readout said, correctly:

    inside the garage interior: 1-2 car bays, junk shelves, a door into the house

The SCREEN said: WAIT / SUPPRESS / HAND-PEEK / RIFLE / GREN 2 / ENGAGE, a firing
line drawn across STREET #60025. Walking through his own front door on the first
morning of the game started a gunfight.

THE MECHANIC IS DELIBERATE AND IT IS NOT MINE. __CITY_FIGHT__ ("V161 THE DOOR IS
THE FIGHT") hooks inEnter because that is the one place a body crosses a
threshold, and cityFightRoll gives a 0.35 chance that somebody in there does not
want you in there. Both are tagged [DIAL, draft:true], which is exactly right --
they are an attempt under ALWAYS MAKE AN ATTEMPT, movable in one word, and this
patch does not move them.

WHAT IS WRONG IS NOT THE ODDS, IT IS *WHICH BUILDING*. The roll is DETERMINISTIC
off the footprint hash -- on purpose, so a building behaves the same way every
time and cannot be farmed by walking in and out. The consequence nobody had seen:
HIS HOUSE IS ONE OF THE 35%, AND BECAUSE IT IS DETERMINISTIC IT IS ONE OF THEM
FOREVER. Same seed, same valley, same house, every run: the door of the home this
lane spent yesterday putting back in his own cell is a permanent ambush.

AND THIS TURN MADE IT BITE. Before today, two doors in the whole neighbourhood
could be walked through, so the roll almost never ran. The door fix shipped
alongside this took that to twenty, including his own front door 29 cells from
where he wakes up. Making a thing reachable makes its bugs reachable too, and the
honest move is to ship the consequence with the cause.

THE RULE: THE HOUSE THE RUN CALLS HIS IS NEVER AN AMBUSH. Everything else keeps
the 0.35 exactly as the combat lane set it. This is a first-night sequencing
rule, not a combat change -- nothing about the encounter, the roster, the dials or
the odds is touched, and every other building in the valley behaves identically.
NO DAMAGE BEFORE THE DIAL is untouched and unrelated.

It is derived from HOME, so it follows the house: reroll to a new valley, wake in
a different cell, and whatever the run then calls his house is the exempt one. No
coordinate is written down here.

REUSE CHECK: cooks no graphic pixels of any kind and opens no art bank, because
nothing here is drawn. It adds one early return to a predicate and reuses
homeFind()/inFootprint(), both already in this file.

Gate: gates/first_night_gate.js walks him through his own front door and asserts
he ends up in a room rather than a firefight.

Idempotent: re-running finds the marker and reports NOOP.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__NOT_YOUR_OWN_HOUSE__'

OLD = """function cityFightRoll(){
  if(!INSIDE||!INSIDE.foot)return false;
  var f=INSIDE.foot;"""

NEW = """function cityFightRoll(){
  if(!INSIDE||!INSIDE.foot)return false;
  var f=INSIDE.foot;
  /* """ + MARK + """ -- THE HOUSE THE RUN CALLS HIS IS NEVER AN AMBUSH.
     MEASURED 8/19: walked through his own front door on the first morning and
     the screen came up WAIT / SUPPRESS / RIFLE / ENGAGE with a firing line
     across a street, while the readout underneath still read "inside the garage
     interior". The roll is DETERMINISTIC off the footprint hash -- deliberately,
     so a building cannot be farmed by walking in and out -- so his house is not
     unlucky once, IT IS A FIREFIGHT FOREVER. Same seed, same house, every run.
     AND TODAY MADE IT BITE: before the door fix that ships with this, two doors
     in the whole neighbourhood could be walked through and this roll almost
     never ran. Now twenty can, his own among them, 29 cells from where he wakes.
     THE ODDS ARE NOT TOUCHED. FIGHT_ODDS stays exactly where the combat lane set
     it and every other building in the valley behaves identically; this is a
     first-night sequencing rule, not a combat change.
     DERIVED FROM HOME, so it follows the house rather than naming a cell: reroll
     the valley and whatever the run then calls his house is the exempt one. */
  try{
    var _h=homeFind();
    if(_h){
      var _hf=inFootprint(_h.x,_h.y);
      if(_hf&&_hf.x===f.x&&_hf.y===f.y&&_hf.w===f.w&&_hf.h===f.h){
        window.__FIGHT_SKIPPED_HOME=(window.__FIGHT_SKIPPED_HOME||0)+1;
        return false;
      }
    }
  }catch(_e){}"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf-8').read()
    if MARK in s:
        print('NOOP: ' + MARK + ' already present')
        return
    if OLD not in s:
        sys.exit('FAIL: the cityFightRoll anchor is not where this expects it')
    s = s.replace(OLD, NEW, 1)
    open(CITY, 'w', encoding='utf-8').write(s)
    print('PATCHED ' + CITY + ' (' + str(len(s)) + ' bytes)')


if __name__ == '__main__':
    main()
