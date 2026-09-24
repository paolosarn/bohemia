# SHE HAS TO WAIT, AND SHE CANNOT: FOUR VERSIONS, ALL MEASURED, ALL DEAD
# 9/24/26 · QUESTS lane, off his own verdict · rule 32(a)
#
# PAOLO, voting this lane's ask UP on 9/23: "Cool dont force interactions on the
# player." The rule his verdict became (32a): "the first minutes are his; a person
# who wants something stands there AND CAN BE WALKED PAST; nothing speaks in the
# first 60 s or outside its reach."
#
# THIS IS A "I STOPPED, HERE IS THE ONE THING BLOCKING EVERYTHING" ROUND. The fix
# is not shipped. What is shipped is the instrument that proves the game does not
# obey him yet, and the blocker, named, for the lane that owns it.

================================================================================
## 1. WHAT HE IS RIGHT ABOUT, MEASURED
================================================================================
The ask speaks at **6,483 ms, after 8 pad presses**, on the alpha, through the one
driver. Earlier runs this week read 585 ms and 1,991 ms. The first thing the game
ever does is talk at him. That is exactly the thing he named, and it is now a
named leg in this lane's own checker rather than an opinion.

================================================================================
## 2. FOUR VERSIONS OF THE FIX, EVERY ONE MEASURED, EVERY ONE DEAD
================================================================================
Written up rather than quietly dropped, because the fourth attempt is this repo's
own tell that the approach was wrong (STOP PRODUCING, 7/26).

**V1 -- the quiet minute plus "he has to come to her", built on barkPick.**
Nobody ever spoke over a 400-press walk. barkPick's earshot is 7 cells.

**V2 -- give the ask a reach of ONE STEP instead of a remark's earshot.**
The reasoning was sound and is still true:

    ONE PRESS MOVES HIM ........ 25 cells   (rule 16, one step is one house)
    barkPick's earshot ......... 7 cells
    bodies are spaced apart .... 10 cells   (PEOPLE's no-clumping, 9/22)

A step is three and a half times the earshot, so he cannot stop next to anybody:
every press jumps him past them. Still nobody spoke.

**V3 -- record the first sighting during the quiet minute, not after it.**
A real bug in V2 and a real fix: the "half the distance" bar was being measured
from halfway, so it was unreachable by construction. Still nobody spoke.

**V4 -- kill the halving, reach = one body's width (the derived 10).**
Nobody spoke.

**AND THEN THE MINIMAL ONE, WHICH IS THE MEASUREMENT THAT MATTERS: the quiet
minute ALONE, with barkPick and everything else untouched. NOBODY SPOKE EITHER.**

So this is not my design being too clever. It is one line -- wait sixty seconds --
and the feature dies.

================================================================================
## 3. THE BLOCKER, AND IT IS THE ONE I MEASURED ON 9/22
================================================================================
The ask has only ever spoken **in the first two seconds, at spawn**, because at
spawn somebody happens to be standing inside barkPick's 7 cells. Once you wait,
nobody is inside 7 again.

Read off a hook written at the decision itself (because a checker that has to
infer which condition refused it will infer wrong, and this round burned three
runs proving that), over 260-press walks that steered STRAIGHT at the nearest
person, the range to the nearest drawn body reads:

    2, 5, 8, 12, 15, 25, 27  -- and it sits at 8 to 12 for a hundred presses

This is the same collision this lane measured and named on 9/22
(records/BOHEMIA_QUESTS_THE_BLOCK_STOPPED_SEEING_YOU_9_22_26.md), now showing its
second face:

    PEOPLE's no-clumping spaces bodies ..... 10 cells apart
    the city's memory records a witness .... inside 8
    barkPick's earshot ..................... 7
    one press moves the player ............. 25

**THREE REACHES, ALL SMALLER THAN THE SPACING, AND A STEP THAT IS BIGGER THAN ALL
FOUR.** On 9/22 that killed the minds. This round it turns out to have killed every
bark too, and the ask only looked alive because it fired before the crowd had
spread out.

AND THE OTHER HALF OF HIS RULE WAS ALREADY TRUE AND I WAS REBUILDING IT: earshot
7 against a 25-cell step means he already has to land next to her for her to be a
candidate at all. "He came to her" shipped a week ago. Only the timing did not.

================================================================================
## 4. WHY THE FIX IS NOT SHIPPED
================================================================================
Shipping the wait takes the person at his door out of the first five minutes, and
"nobody with a name or a face at his door" is a break on HIS OWN LIST that came
off it because of this feature. Trading a forced interaction for no interaction is
not honouring his ruling, it is making the cut worse, and rule 18's ratchet says
never worse. So the city keeps its behaviour this round.

================================================================================
## 5. WHAT IS SHIPPED
================================================================================
**(a) THE INSTRUMENT, AND NOTHING ELSE, IN THE GAME.** One stamp: the moment the
world came up with him in it. Nothing reads it but the checker. No behaviour
changes.

**(b) THE CHECKER, RE-POINTED TO HIS RULING, AND IT IS RED ON PURPOSE.**
`gates/wire_the_door_gate.js` carried a leg that read
`*** BEFORE SIXTY SECONDS ***`. It asserted the exact behaviour he has now banned,
because it was written to rule 19(d) (9/20) and 32(a) (9/23) reverses it. A gate
testing a surface a ruling deleted is obsolete, not failing -- the second time
this lane has had to say that about one of its own checkers. The leg is now
`*** AND NOTHING SPOKE IN HIS FIRST SIXTY SECONDS ***` and it reads
**spoke INSIDE the quiet minute**.

The drive had to change too, not just the assertion: the old loop pressed `i % 8`
and wandered, which proves nothing about "he has to come to her". It now LEARNS
THE PAD (press each button, watch where the body goes) and STEERS at the nearest
drawn person. Self-calibrating, because a hard-coded button-to-direction map is a
guess and this fleet has written down what guessed selectors cost.

**14 passed, 1 failed.** The one red is a true statement about the game.

================================================================================
## 6. A CONTRADICTION BETWEEN TWO OF HIS LAWS, FLAGGED NOT DECIDED
================================================================================
- **19(d)** (9/20): the playable cut gains "THE FIRST PERSON at his door, with a
  portrait, speaking the first ask, **inside the first minute**".
- **32(a)** (9/23): "**nothing speaks in the first 60 s**."

Newest date wins, so 32 governs. The reconciliation that keeps both, and this
lane's recommendation: **THE PERSON IS STILL THERE FROM THE FIRST SECOND** --
standing at the door, named, with a face, walkable-past -- and what changes is
that SHE WAITS. That needs somebody to be standable-next-to, which is section 3.
Flagged for the coordinator rather than settled here; a lane does not retire one
of his laws on its own.

================================================================================
## 7. ROUTED
================================================================================
- **PEOPLE**, the owner of the spacing: three reaches (8, 7, and the ask's) are all
  smaller than the 10-cell spacing no-clumping enforces, and the player's step is
  25. Something has to give or nobody in this valley can ever be spoken to or
  remembered. This lane is not touching the spacing -- his "nobody stands on
  anybody" is right and the fix is not to undo it.
- **COORDINATOR**: the 19(d) / 32(a) contradiction above.
- **QUESTS, next round**: the wait ships the moment somebody can be stood next to.
  The change is one line and it is already written down here.

================================================================================
## 8. WHAT THIS ROUND DID NOT DO
================================================================================
- **It did not cook** (rule 22), and that is said plainly rather than dressed up.
  The round went into his correction and the measurement under it.
- **It did not isolate which condition refuses the ask after the minute.** The
  hook says the range and the clock; it does not prove whether the refusal is the
  reach, the pick, or something further down the chain. Chasing it would have been
  a fifth version, which is the thing STOP PRODUCING names.
