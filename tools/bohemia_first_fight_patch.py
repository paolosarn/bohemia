#!/usr/bin/env python3
"""
V213 -- THE WALKED STREET CAN START A FIGHT  (COMBAT lane, [first fight])

*** PAOLO 9/13, THE BREAK, IN HIS OWN WORDS: "I have not experienced any combat
    yet... it says a car is gonna pull up on me and then nothing happens." ***
FIRST LINE OF THIS LANE UNDER RULE 14 (THE FIVE MINUTES). The row: within five
minutes of walking from the door, a card says a fight is coming AND THE FIGHT COMES.

*** MEASURED WITH THE STOPWATCH THE ROW ASKS FOR, FROM THE DOOR, BEFORE A LINE WAS
    WRITTEN. Three walks of five minutes each (600 steps, one per beat at 120 BPM),
    driving the shipped stepOnce, the one place a walked cell fires both directors. ***

      where he wakes        suburb
      ROAD_TABLE[suburb]    NO ROW -- the road director has nothing here
      WALK_TABLE[suburb]    A ROW, four moments by day and five by night
      cards                 0
      FIGHTS                *** 0, in every single walk ***
      and what DID fire     ghost_robotaxi  (ambient)      TWICE, identically
                            scavenger_shakedown (interactive)

*** THE CAR THAT PULLS UP IS ghost_robotaxi AND I CAN QUOTE IT: "An empty cab pulls
    to the curb ahead and opens its door for nobody. Waits its ninety seconds. Pulls
    off." AND THE ONE AFTER IT IS scavenger_shakedown: "somebody steps out. they want
    something." He is describing the game accurately. ***

THE CAUSE, AND IT IS THIS LANE'S OWN SHAPE FOR THE SEVENTH TIME: THERE ARE TWO
DIRECTORS AND ONLY ONE OF THEM CAN START A FIGHT.
    roadDirector   tableFor reads ROAD_TABLE ONLY. Its roadInterrupt is the one that
                   calls V203's roadContactFight and roadCard, so it is the only path
                   to a fight -- and it has NO TABLE where he wakes.
    walkDirector   tableFor falls back to WALK_TABLE, so it fires correctly on the
                   walked street. And walkInterrupt's whole response is walkSay(),
                   which writes ONE LINE into #packline and stops. For every kind,
                   including interactive and forced.
So the walked street's twelve authored moments have never been able to become
anything. The material was written, the fight machinery was built by V203 one row
over, and nothing joined them. THE CAR PULLS UP, SOMEBODY STEPS OUT AND WANTS
SOMETHING, AND NOTHING HAPPENS -- exactly, and for a reason you can point at.

WHAT THIS BUILDS, REUSING V203 AND INVENTING NOTHING:
    FORCED       the fight starts where you stand, through roadContactFight -- V203's
                 own path and his own ruling that a forced party does not ask.
    INTERACTIVE  the card opens, through roadCard -- the same card the road shows,
                 which V203 already gave a real fight arm.
    AMBIENT      UNTOUCHED. It stays one line, because walkInterrupt's own comment is
                 right: "a modal card for 'a coyote is following you' turns set
                 dressing into homework." ghost_robotaxi is ambient and STAYS ambient;
                 its own words say the cab waits and pulls off, and that is honest
                 atmosphere rather than a promise. What was broken was never the cab,
                 it was that nothing ELSE could ever become a fight.
    THE LINE     still said first, every time, for every kind. Nothing he reads today
                 stops being read.

WHAT THIS DELIBERATELY DOES NOT MOVE, because the row is about a fight and not about
the day: the walked street charges NO minutes and takes NO salvage for these. The
road's ROAD_COST (10 interactive, 20 forced) and roadLeave are the ROAD's rulings for
the road, and the walked branch already spends its own 0.084 minutes a cell. Pacing
and the salvage economy are not this row's to move on the way past.

NO GLOBAL SPAWNS EVER still holds, and the gate checks it: a district with no walk row
still produces nothing. Nothing here adds a table, a district or a moment.

NO DAMAGE BEFORE THE DIAL: no damage value, hit chance or roll is authored. This
connects two things that were already built.
"""
import re
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__THE_WALK_IS_A_FIGHT__'


def sub(src, old, new, n=1, what=''):
    c = src.count(old)
    if c != n:
        sys.exit('ANCHOR %s: expected %d, found %d\n  %s' % (what, n, c, old[:160]))
    return src.replace(old, new, n)


NEW_TAIL = r"""    try { walkSay(got); } catch (_e) {}
    /* ===== V213 __THE_WALK_IS_A_FIGHT__ -- AND THE WALKED STREET CAN FINALLY
       START ONE. *** PAOLO 9/13: "I have not experienced any combat yet... it says a
       car is gonna pull up on me and then nothing happens." *** MEASURED with the
       stopwatch from the door, three walks of five minutes: 0 fights, 0 cards, and
       the only two things that fired were ghost_robotaxi and scavenger_shakedown --
       the car that pulls up and the man who steps out, both of which said their line
       and stopped, because walkSay was this function's ENTIRE response.
       THERE ARE TWO DIRECTORS AND ONLY ONE COULD START A FIGHT: roadInterrupt calls
       V203's roadContactFight and roadCard, and its director reads ROAD_TABLE only,
       which has no row for the suburb he wakes in. This one reads WALK_TABLE, fires
       correctly, and had nowhere to send what it fired.
       So the walked street routes into the SAME two paths the road already uses.
       Nothing new is authored: no table, no district, no moment, no number. */
    try {
      /* AND NOT WHILE HE IS INDOORS, WHICH IS RULE 14(d) AND WAS MEASURED THE HARD
         WAY. roadContactFight refuses indoors on purpose ("indoors is the door's
         fight"), so a card opened in a garage would show a DROP HIM arm that does
         NOTHING when pressed -- a card that promises and does not deliver, which he
         called the worst bug in the game. Indoors these stay a line, exactly as they
         are today. Found because a walk wandered into a garage and the fight I
         measured turned out to be the door's, not the card's. */
      var _in = (typeof INSIDE !== 'undefined' && INSIDE);
      if (_in) { /* the line already went out above; nothing is promised */ }
      else if (got.kind === 'forced') {
        /* his own ruling, V203: a forced party does not ask. The fight starts where
           you stand and there is no card to press. */
        if (typeof roadContactFight === 'function') roadContactFight(got);
      } else if (got.kind === 'interactive') {
        /* the road's own card, which V203 gave a real fight arm. ZERO minutes and
           ZERO salvage: ROAD_COST and roadLeave are the ROAD's rulings for the road,
           and the walked branch already spends its own 0.084 minutes a cell. This row
           is about a fight arriving, not about the day getting shorter. */
        if (typeof roadCard === 'function') roadCard(got, 0, 0);
      }
      /* AMBIENT IS UNTOUCHED AND THAT IS DELIBERATE: this function's own comment is
         right that a modal card for "a coyote is following you" turns set dressing
         into homework. ghost_robotaxi is ambient and stays ambient -- its words say
         the cab waits and pulls off, which is honest, not a promise. */
    } catch (_e) {}
    /* ===== /V213 __THE_WALK_IS_A_FIGHT__ ===== */"""


def main():
    s = open(CITY, encoding='utf-8').read()
    if MARK in s:
        print('  the walked street already fights')
        return
    s = sub(s, "    try { walkSay(got); } catch (_e) {}", NEW_TAIL, 1, 'city/walkInterrupt')
    open(CITY, 'w', encoding='utf-8').write(s)
    print('V213 applied to', CITY)


if __name__ == '__main__':
    main()
