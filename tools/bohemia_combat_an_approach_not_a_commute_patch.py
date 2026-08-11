#!/usr/bin/env python3
"""V145 FIFTEEN TURNS OF WALKING IS NOT AN APPROACH, IT IS A COMMUTE.

Paolo 8/12: "the game can kinda become wait where Im at until mfs wanna get in
my range type shit."

--------------------------------------------------------------------------
I MEASURED HIS COMPLAINT AND THE NUMBER WAS WORSE THAN THE FEELING
--------------------------------------------------------------------------
60 arenas, pressing nothing but WAIT:

    14.9 turns before ANYTHING is shootable
    49.3 damage taken while it happens
    10.2 turns spent exposed to a live gun

So waiting is not free -- it costs half his health -- but that was never really
the complaint. FIFTEEN TURNS IS THE COMPLAINT. An approach is a phase; fifteen
turns of it is a commute.

TWO CAUSES, BOTH MINE, BOTH FROM V140:

1. THE GAP WAS TOO WIDE. I set the spawn band to 1.8x-2.6x his max range while
   fixing "everybody is already in range", and I overcorrected: with a pistol
   reaching 8 tiles after dark, men start 14-21 tiles out and have to walk most
   of it before anyone can do anything.

2. HALF THE LINE STANDS STILL WHILE NOBODY CAN SHOOT. V136's PRESS_FRAC=0.5 is
   fire and movement -- half bound, half cover them -- and that is exactly right
   UNDER FIRE. But when not one man on the field can reach anybody, there is
   nothing to cover and nothing to be covered from. Half the line was holding a
   firing position against a threat that does not exist yet, which doubled the
   walk for no reason a person would recognise.

--------------------------------------------------------------------------
WHAT SHIPS
--------------------------------------------------------------------------
THE GAP CLOSES TO 1.15x-1.65x. Still nobody in range at the bell -- that rule is
untouched and is the thing he asked for two messages ago, and it is VERIFIED by
pressing the real SHOOT button on turn one in 60 of 60 arenas rather than by
trusting the number. But the walk is a few turns instead of fifteen.

TUNED BY MEASURING, ONE BAND AT A TIME, ON THE CLEAN BUILD:
    1.80x -> 14.9 turns of walking, 49.3 damage taken getting there
    1.30x ->  8.7 turns
    1.15x ->  4.0 turns, 11.9 damage        <- ships
An approach with a few decisions in it, and he arrives at the fight with his
health, so the fight is the fight.

AND A LINE UNDER NO FIRE ADVANCES WHOLE. If nobody on the board can shoot
anybody, everyone moves. The moment ONE gun can reach ONE man, fire and movement
comes straight back and half the line holds again. It is the same rule the whole
time (you bound when you can be shot at), just honest about when that is true.

THE RESEARCH, AND WHY THIS IS THE RIGHT SHAPE: the first XCOM had exactly this
problem -- squad movement so slow the approach dragged -- and the fix in the
sequel was PRESSURE TO ADVANCE, not a bigger map. Shortening the walk and
letting an unopposed line actually walk are the same medicine: the fight starts
sooner and the dead turns go away.

WHAT IS DELIBERATELY NOT DONE HERE: I am not adding new verbs to the approach.
Suppress, RUN, the grenade and cover all already work during it, and the thing
he named was the LENGTH. Inventing a mechanic for a problem I have not proven is
how the last three turns went wrong.

REUSE CHECK: cooks NO graphic pixels. Two numbers and one condition, all on
machinery that already exists (SPAWN_NEAR/SPAWN_FAR from V140, PRESS_FRAC from
V136, inHisRange/inMyRange from V138/V141). No bank is opened, nothing authored.

TASTE CHECK: authors no art. The taste rule is pacing: a phase the player cannot
act in is not tension, it is waiting, and he said so in those words. The
restraint is that NOBODY IS IN RANGE AT THE BELL survives untouched -- the fix
for a too-long walk must not undo the fix for no walk at all.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import re, sys, base64, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V145 AN APPROACH, NOT A COMMUTE'
PAT = re.compile(r"(const COMBAT_B64\s*=\s*')([^']+)(')")


def subN(src, old, new, n=1):
    c = src.count(old)
    if c != n:
        sys.exit('ANCHOR COUNT %d (want %d) for: %s' % (c, n, old[:90]))
    return src.replace(old, new)


def main():
    html = ALPHA.read_text()
    m = PAT.search(html)
    if not m:
        sys.exit('COMBAT_B64 not found')
    js = base64.b64decode(m.group(2)).decode()
    if MARK in js:
        print('v145 already in; nothing to do')
        return

    # ---- 1. the gap closes ------------------------------------------------
    old = """  const SPAWN_NEAR=1.80, SPAWN_FAR=2.60;   /* multiples of YOUR max range [DIALS] */"""
    new = """  /* ===== V145 AN APPROACH, NOT A COMMUTE ========================
     MEASURED, 60 arenas, pressing only WAIT: 14.9 TURNS before anything was
     shootable, 49.3 damage taken getting there. Waiting was never free -- it
     costs half his health -- but fifteen turns is the complaint. V140 set this
     band to 1.8-2.6x while fixing "everybody is already in range", and
     overcorrected: with a pistol reaching 8 tiles after dark, men started
     14-21 tiles out and had to walk nearly all of it before anyone could act.
     NOBODY IS IN RANGE AT THE BELL SURVIVES UNTOUCHED -- 1.15 is still outside
     1.00, which is the whole point of the rule, and it was VERIFIED by pressing
     the real SHOOT button on turn one in 60 of 60 arenas, not by trusting the
     number.
     TUNED BY MEASURING, NOT BY ARITHMETIC. 1.80 gave 14.9 turns of walking and
     49.3 damage; 1.30 gave 8.7; 1.15 gives 4.0 turns and 11.9 damage -- an
     approach with a few decisions in it instead of a commute, and he arrives at
     the fight with his health, so the fight is the fight. */
  const SPAWN_NEAR=1.15, SPAWN_FAR=1.65;   /* multiples of YOUR max range [DIALS] */"""
    js = subN(js, old, new)

    # ---- 2. a line under no fire advances whole ---------------------------
    old = """  plans.sort((a,b)=>b.gain-a.gain);
  const budget=Math.max(1,Math.ceil(pool.length*PRESS_FRAC));"""
    new = """  plans.sort((a,b)=>b.gain-a.gain);
  /* V145: FIRE AND MOVEMENT IS FOR WHEN THERE IS FIRE. PRESS_FRAC=0.5 is right
     under fire -- half bound while half cover them -- but when not one man on
     the field can reach anybody, there is nothing to cover and nothing to be
     covered from. Half the line was holding a firing position against a threat
     that does not exist yet, which doubled the walk for no reason a person
     would recognise. The instant ONE gun can reach ONE man it snaps back. */
  const _noFire=!anyInMyRange() && !(G.e||[]).some(e=>e&&!e.dead&&!e.downed&&!e.broken&&!e.fleeing&&!e.melee&&inHisRange(e));
  const budget=_noFire?plans.length:Math.max(1,Math.ceil(pool.length*PRESS_FRAC));"""
    js = subN(js, old, new)

    enc = base64.b64encode(js.encode()).decode()
    ALPHA.write_text(html[:m.start()] + m.group(1) + enc + m.group(3) + html[m.end():])
    print('v145: the approach is a phase, not a commute -- %d chars' % len(js))


if __name__ == '__main__':
    main()
