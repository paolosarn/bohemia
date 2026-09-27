# THE FLIP: THREE FACES ON THE PHONE, AND A THUMB CHANGES WHO YOU ARE
# DYNASTY lane, board row [the flip] / ONE-TAP-ON-THE-PHONE
# Rule 31 (Paolo 9/23), his own vote A on 9/23, rule 32(c), rule 32(d), rule 33.
#
# "Play all three at the same time and flip through them." This is the flip.
# Both school rounds are behind it; this is the lane's first BUILD.

================================================================================
## 1. WHAT HE CAN DO NOW
================================================================================
Zoom out to the map. The cracked phone carries three faces along the bottom of
its glass: **Reyna, NOW. Ezekiel, +35Y. Perla, +70Y.** The one he is is lit.
Touch another face and he is that one. Same screen, same buttons, nothing
teleports (rule 24). Measured on the alpha with a real finger through the one
driver: **tap the third face and the act goes 1 -> 3, and the lit tile moves
with him.**

Four of his rulings decided every part of the placement and not one of them was
re-litigated here:
- **A, on the phone** (his vote, 9/23) rather than a place in the world.
- **The phone is CITY VIEW ONLY** (rule 32c) -- so the flip is a city-view act.
- **The city view IS the map** (rule 33a) -- so the flip is a map act.
- **The names come prepared** (rule 32d, "like Battle Brothers"): every slot
  filled from the first frame, no flip to an unnamed descendant.

================================================================================
## 2. WHAT IS MINE AND WHAT IS BORROWED
================================================================================
`engine/bohemia_acts.js` is WHO THE THREE ARE and WHICH ONE IS CURRENT. That is
the whole job. It does NOT derive a world: school round two named the derive's
field list, its hands-versus-world split and its gate, and building it is WORLD's
and LIFE+CITY's rows. A flip that re-derived the valley from inside this file
would be a second answer to a question another lane owns.

Borrowed rather than rebuilt:
- **The names** come from the city's own bank through `generatedName`, so the
  family reads like the valley reads -- the same pool Paolo corrected toward the
  county on 9/22.
- **What a name reads as** goes through the city's own door, and 'either' stays a
  legal answer rather than being turned into a guess.
- **The faces** come through the face door that already exists.

Every number is his or marked. The ERA NAMES are canon (Animal / Human / Angel
are ERAS, Paolo 9/7). **The gap between acts is NOT ruled**, so 0 / +35 / +70 is
an attempt tagged draft, derived from the hundred years the laws already carry,
and it is one word for him to knock down.

================================================================================
## 3. THE FLIP IS HONEST WITH NOTHING BUILT YET, AND THAT IS HIS DESIGN
================================================================================
Tap a face and the ground does not change. **That is not a gap, it is rule 32(b)
working.** His words on 9/23: the game STARTS in the ruin and the future GETS
BETTER; the base of act 2 and act 3 is act 1's ruin and the derive ADDS what was
reclaimed. A player who has done nothing should see the same ruin in all three.

So the module has a function whose only job is to say so out loud
(`groundDiffers()` returns `differs:false, why:'NO_DERIVE_YET'`) rather than
leaving a caller to assume. When WORLD's derive lands, that is the one line that
stops saying it. Said in the vote item too, in his words, not buried.

================================================================================
## 4. THE ROUND'S REAL WORK: A CONTROL THAT COULD NOT BE TOUCHED
================================================================================
The strip painted correctly on the first try. Then a real finger did nothing, and
that took most of the round.

    the tile was drawn ................................ yes, 36 x 54 px
    the handler was bound ............................. yes
    elementFromPoint INSIDE the frame ................. canvas -> .af -> #actflip
                                                        -> #cityfeedscreen -> #cityfeed
    every one of them pointer-events ................... auto
    calling the flip from the console .................. worked, every time
    a real finger ...................................... NOTHING

**Then I asked the SHELL what is at that same page coordinate, and it answered a
plain DIV, not the city frame.** Something in the shell covers the TOP of the
phone, so a finger never reaches it. Moved the strip to the BOTTOM of the glass
and the shell answers `cityFrame`; the finger works.

THREE THINGS CAME OUT OF THAT AND ALL THREE ARE WRITTEN DOWN RATHER THAN WORKED
AROUND:
1. **The shell covers the top of the phone.** UI's overlay. The phone's own
   signal-and-clock bar is under it too, and nobody noticed because a clock is
   not a button. Named for UI.
2. **The driver's `tapEl` does not land where it says.** It adds the frame's
   offset to a handle box that already carries it, so its finger goes elsewhere.
   Every lane that taps a DOM control inside the city frame with it is testing
   nothing. Named for PLUMBER. This gate uses the frame's own rect plus the
   frame's page box, which is correct and is what the driver's own `tapAt` does.
3. **A touch-derived pointerdown must not be preventDefault-ed** if you also want
   the click. The first cut bound both and prevented the pointer event. Click
   only now, which is the door the phone itself uses.

This file already carried RUN's lesson in its own margin from 9/23: a handler on
something a finger cannot actually work is the same class of bug as a caught
exception -- the code is there, it reads correct, and it silently does nothing.
Knowing that trap is not the same as checking for it. **So the gate drives a real
finger, and it has a leg that asks the shell whether anything is covering the
tile.**

================================================================================
## 5. AND THE NAMES WERE UNREADABLE AT REAL SIZE
================================================================================
Shot at phone size, the full names came back "Ezekie...", "Perla ...". A name he
cannot read is a name that did not ship. The tile shows the GIVEN NAME only; the
full name stays on the tile's label. Caught by looking at the picture, which is
the only reason it was caught.

================================================================================
## 6. THE GATE -- `gates/the_flip_gate.js`, 23 passed / 0 failed
================================================================================
Registered as **THE FLIP**. Twelve legs without a browser (three acts; every slot
named; three different people; the eras are his canon; the unruled gap is marked
draft; reshuffle differs; the same seed twice is the same family; the flip moves;
a tap on the act he is already in is NOT an event; a bad act is refused; the years
read off the table; the ground SAYS it does not differ yet) and eleven on the
glass with a real finger.

**MUTATION PROVED:** put the strip back at the top, under the shell, and it goes
**19 passed / 4 failed**, naming the covering DIV and reporting act 1. That is the
gate catching the exact bug that cost this round most of its time.

================================================================================
## 7. WHAT IS NOT DONE, SAID PLAINLY
================================================================================
- **The three faces are placeholders, not his family.** A FAMILY LOOKS LIKE A
  FAMILY says these three should carry his own face forward by the heredity that
  already runs. That is [three names] with CHARACTER and PORTRAIT. The face door
  currently ROLLS a face out of a hash of the id, which this lane measured and
  wrote up on 9/22; for a descendant with no body yet that is merely unearned
  rather than wrong, and it is said out loud in the vote item.
- **Reshuffle is in the module, not on the glass.** [three names] owns the screen
  where he types his own.
- **The ground does not move on a flip.** Section 3: that is the design until the
  derive lands, and the module says so rather than pretending.

================================================================================
## 8. ROUTED
================================================================================
- **UI**: something in the shell covers the top of the phone (section 4.1). The
  phone's own bar is under it.
- **PLUMBER**: the one driver's `tapEl` double-counts the frame offset (4.2).
  Any lane that has used it to prove a DOM control works has proved nothing.
- **WORLD / LIFE+CITY**: when the derive lands, `groundDiffers()` is the one line
  that stops saying "not yet", and `ctActFlipTo` is where the redraw hangs.
- **CHARACTER / PORTRAIT**: the three descendants' faces by heredity, with
  [three names].
