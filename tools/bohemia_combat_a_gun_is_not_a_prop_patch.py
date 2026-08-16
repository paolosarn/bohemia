#!/usr/bin/env python3
"""V158 A GUN IS NOT A PROP: HIS AMMO RULING, AND THE RULER I HAD TO FIX.

Paolo 8/16: "I hate that I ran out of ammo... I thought it was unrealistic like I
only had like eight bullets on that I did not like it."

HE IS RIGHT AND IT IS NOT ARGUABLE. V157 shipped a pistol whose MAGAZINE held 8
and which started with THREE rounds in it. A 9mm magazine is 15 to 17. A rifle is
20 to 30. Three rounds is not a scavenger's loadout, it is a prop, and the moment
he looked at the readout the fiction broke.

The reasoning that produced it was mine and it was backwards: I picked the number
to make a GATE pass and then told myself it was the premise. That is the exact
inversion this repo has a law against -- a gate must never outrank a ruling -- and
I walked straight into it one turn after quoting it.

--------------------------------------------------------------------------
THE NUMBERS ARE REAL NOW
--------------------------------------------------------------------------
  pistol   15 in the magazine   (9mm, the real number)
  smg      30
  rifle    20
  shotgun   6                   (a tube, and it is why the shotgun is a knife)
And he starts with a FULL magazine, because a person who walked into a fight has
a loaded gun. What he does NOT start with is a bandolier: no spares. The spare
rounds in this world come off the men you drop, and a dead man's pockets are
worth a partial magazine rather than three loose rounds.

--------------------------------------------------------------------------
AND THE RULER, WHICH WAS THE ACTUAL BROKEN THING
--------------------------------------------------------------------------
The V157 gate played its fights with a player WHO NEVER MISSES: one round, one
man, every time. Against a player like that, the only way to stop a fight being
winnable from one spot is to hand him fewer bullets than there are enemies --
which is precisely how I arrived at three.

A PLAYER WHO NEVER MISSES IS NOT A PLAYER. This whole game is a timing dial whose
entire purpose is that shots miss. Calibrating the world against an impossible
player is how the fiction got sacrificed to a green check.

So the gate models a real hit rate now, and it does not get to pick a flattering
one: it runs the test across a BAND of hit rates and the ruling must hold across
all of them. That is a stricter test than the one it replaces, not a looser one,
because it can no longer be satisfied by a single convenient assumption.

REUSE CHECK: cooks NO graphic pixels. Changes four numbers and the comment above
them. Every function, marker and readout is V157's, untouched.

TASTE CHECK: authors no art. The taste rule is his sentence, "I thought it was
unrealistic": a number the player can read off the screen is part of the fiction,
and a gun that holds eight is a different object from a gun that holds fifteen.
The restraint is that only the numbers move -- no mechanism was softened to make
him comfortable, and he still runs dry in a long fight.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import re, sys, base64, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V158 A GUN IS NOT A PROP'
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
        print('v158 already in; nothing to do')
        return

    old = """const MAG={pistol:8, smg:16, rifle:4, shotgun:4};   /* [DIAL] what a gun HOLDS when it is full */"""
    new = """/* ===== V158 A GUN IS NOT A PROP ===============================
   Paolo 8/16: "I hate that I ran out of ammo... I thought it was unrealistic
   like I only had like eight bullets on that I did not like it."
   HE IS RIGHT AND IT IS NOT ARGUABLE. V157 gave the pistol a magazine of 8 and
   started him with THREE in it. A 9mm magazine is 15 to 17. Three rounds is not
   a scavenger's loadout, it is a prop, and the fiction broke the moment he read
   the number off the screen.
   AND THE REASONING WAS BACKWARDS: I picked that number so a GATE would pass and
   then told myself it was the premise. A GATE MUST NEVER OUTRANK A RULING is a
   law in this repo and I broke it one turn after quoting it. The gate models a
   real hit rate now instead of a player who never misses -- see
   gates/fight_moves_you_gate.js. */
const MAG={pistol:15, smg:30, rifle:20, shotgun:6};   /* [DIAL] what a gun HOLDS when it is full -- the real numbers */"""
    js = subN(js, old, new)

    old = """const START_LOADED={pistol:3, smg:5, rifle:2, shotgun:2};   /* [DIAL] what is actually IN it at the bell */"""
    new = """/* A FULL MAGAZINE, because a person who walked into a fight has a loaded gun.
   What he does NOT have is a bandolier -- the spare rounds in this world come
   off the men he drops. */
const START_LOADED={pistol:15, smg:30, rifle:20, shotgun:6};   /* [DIAL] what is actually IN it at the bell */"""
    js = subN(js, old, new)

    old = """const DROP_ROUNDS=3;      /* [DIAL] what a dead man's pockets are worth */"""
    new = """const DROP_ROUNDS=8;      /* [DIAL] what a dead man's pockets are worth -- a partial magazine, not three loose rounds */"""
    js = subN(js, old, new)

    # the comment above START_LOADED still argued for the old, dead number
    old = """/* *** THE NUMBER THE WHOLE THING LIVES ON, AND THE LAW SETS IT, NOT TASTE. ***
   MEASURED with a full magazine in each gun: 65% of fights still CLEARED FROM
   ONE SPOT, because 8 in the pistol plus 4 in the rifle covers 8 men and the
   first excursion never has to happen. His law's test is "can the player win
   without leaving the first cover they reach -- if yes, it is not fixed", so
   the starting load is CONSTRAINED, not chosen: it has to be smaller than the
   fight or the mechanism is decoration.
   AND IT IS THE PREMISE ANYWAY. You scavenged this gun. Nobody in a collapse
   walks around with a full magazine and spares -- rounds are currency, you have
   almost none, and the fight is about taking theirs. Starting nearly dry is not
   a difficulty setting, it is the world. */"""
    new = """/* V158 KILLED THE ARGUMENT THAT USED TO SIT HERE. It said the starting load was
   "CONSTRAINED, not chosen" by the law's test -- and that was true only against
   a player who never misses, which is what the old gate simulated. Paolo read
   the result on his own screen and called it what it was: unrealistic. The
   fiction is not downstream of a gate. */"""
    js = subN(js, old, new)

    enc = base64.b64encode(js.encode()).decode()
    ALPHA.write_text(html[:m.start()] + m.group(1) + enc + m.group(3) + html[m.end():])
    print('v158: real magazines -- %d chars' % len(js))


if __name__ == '__main__':
    main()
