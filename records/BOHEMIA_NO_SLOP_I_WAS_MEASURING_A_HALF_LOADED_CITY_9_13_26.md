# NO SLOP, ROUND SEVEN: I PUBLISHED A WRONG DIAGNOSIS, AND THE CAUSE WAS 24 SECONDS
UI lane (11), row [no slop] -- THE-UI-MUST-NOT-LOOK-VIBE-CODED. 9/13/26.
Law: laws/BOHEMIA_LAW_THE_UI_MUST_NOT_LOOK_VIBE_CODED_9_11_26.md
Sheet: slices/BOHEMIA_FIVE_WAYS_A_CHOICE_LOOKS_9_13_26.html
Corrects: records/BOHEMIA_NO_SLOP_THE_WRITING_IS_NOT_TYPED_9_13_26.md (round six)

## *** THE CORRECTION, FIRST, BECAUSE IT WENT INTO FOUR PLACES ***
Round six stated, in the record, the handoff, the commit message and the reply to Paolo:

> those rules live in a JS string this path never injects, so the prose was inheriting the mono
> face from its parent and **every one of those edits was decoration**

**THAT IS FALSE.** The rules inject perfectly well. Measured this round on the same demo, with
the same probe, waiting longer:

    at  5 s   #daycardIn .fbnote  -- not found, #ctcard rules 0, ctOpen undefined
    at 34 s   #daycardIn .fbnote  -- FOUND, #ctcard rules 8, ctOpen is a function

Nothing was broken. **I was reading a city that had not finished loading**, and I wrote down
what I saw as a fact about the code instead of a fact about my timing.

## WHAT WAS ACTUALLY UNDERNEATH IT, AND IT IS WORTH MORE THAN THE ROW
The walked city inside the demo, measured by polling rather than guessed (fast machine, local
server, no network):

    24.2 s   the city first answers at all (BOHEMIA_TEACH exists; ctOpen exists)
    30.8 s   document.readyState finally reaches "complete"

For the first twenty-four seconds the last script -- 453,516 bytes of it -- is still streaming;
at 12 s the browser had parsed 61,327 of those bytes. During that window the conversation
system, the claims system, the terms, the outfits and the vouching **do not exist yet**, with no
page error, because nothing is wrong. It simply is not there.

**THE DEMO IS THE THING THAT GOES TO A FRIEND.** A stranger opening the link waits half a minute
before the game can answer them. That corroborates, with a TIME, what PLUMBER already reported
as a WEIGHT ("45,176,644 bytes to first play against a 34,005,978 budget", fps_on_a_phone_gate
33/2 on clean main). Not this lane's to fix and not fixed here. Named for RUN and PLUMBER with
the numbers and the method, because a number somebody can re-run is worth more than a complaint.

AND IT IS WHY THIS LANE'S OWN GATES ARE HONEST: they wait for `BOHEMIA_TEACH` with a 60 s
budget, which is why they have been measuring a whole city while my hand-written probes were
measuring a third of one. **The gate was right and the human was wrong**, which is the opposite
of the usual failure and worth writing down.

## WHAT THIS DOES AND DOES NOT CHANGE ABOUT ROUND SIX
The FIX was right and stays: a surface carrying its own face is better than a rule reaching
into it, because the children inherit and nothing depends on which stylesheet won. What was
wrong was the REASON, and a right fix with a wrong reason is a trap for the next person, who
will believe the reason.

It also means the rules in that block are **live**, so the tells in them are real work that
reaches the player -- which is this round's build.

## WHAT LANDED
The buttons on the day card and the talking card were a grey hairline round a rounded box with
typewriter text in it: **three separate items off the bot-UI list stacked on one element.** They
now speak the object language every other control in the game already uses -- no border, a lit
rim on top, a dark base, a side under it -- and their labels read the casing register instead of
raw `ui-monospace`. The text box you type into is a **recess** (the shadow falls inward, the way
a hole does) rather than a box laid on top.

    1px borders, the walked city    56 -> 52
    ALL TELLS, the walked city     178 -> 176

**AND MONOSPACE WENT UP, 40 -> 42, WHICH IS THE RULER BEING HONEST AND IS LEFT ALONE.** Pointing
those labels at `--face-casing` is correct -- a label on a control belongs to the casing register
-- and that register is still a fixed-pitch face, so the ruler counts it. It will fall when the
casing face is cut, not before. A number that moves the wrong way for the right reason is not a
reason to touch the ruler.

**THE SAME RESTRAINT ON ROUNDED CORNERS, WHICH DID NOT MOVE (60).** The plates use a 2px bevel
where the old cards used an 8px radius, and the law's tell is "the rounded card as the way to
group" -- a 2px edge on a stamped plate is not that. The ruler cannot tell the two apart and I
am NOT teaching it to, because this row's own standing rule is: never tune the ruler so a number
falls. The count stays conservative and the record says why.

## PROOF
    node tools/bohemia_count_the_tells.js     borders 56 -> 52, all tells 178 -> 176
    node gates/rom_face_gate.js               14 ok, 0 failed
    node gates/thumb_gate.js                  16 ok, 0 failed
    node gates/feed_gate.js                   15 ok, 0 failed
    node gates/half_size_gate.js               7 ok, 0 failed
    node gates/city_rail_gate.js               8 ok, 0 failed
    node gates/alpha_loads_gate.js            20 passed, 0 failed
    node gates/demo_build_gate.js             25 passed, 0 failed
    python3 gates/readable_ruler_gate.py       7 ok, 0 failed

Per board rule 13: that is the PRE-PUSH PASS, green. THE SUITE LINE is still unposted, so the
honest sentence is **pre-push pass green; full suite unmeasured since fa59649f.**

## THE LESSON, AND IT IS A NEW ONE FOR THIS ROW
Every other time this lane has been fooled, the instrument was wrong: a ruler counting the cure,
an anchor heuristic inventing panels, a gate measuring serif. **This time the instrument was
fine and the CLOCK was wrong.** A probe that reads a page before the page exists returns a
clean, specific, completely false answer, and it looks exactly like every true answer I have
ever gotten. The defence is the one the gates already use and I did not: **wait for the thing
you are measuring to say it is ready, and never for a number of seconds.**

## AND THEN RULE 14 LANDED MID-ROUND, SO THE ROUND CHANGED
`VAMILY.md` grew **rule 14, THE FIVE MINUTES** (Paolo 9/13, LOCKED) while this round was
running: he played the demo and said *"it looks like shit... the streets don't look like
streets... glitchy, buggy, nothing's complete."* Two parts bind this lane immediately:

* **(a) ONLY RUN RE-CUTS THE DEMO.** Every other lane ships to the alpha and the workshop and
  never runs the cutter again. I had already re-cut the demo three times this round, so the
  demo was reverted to `origin/main`'s copy and is untouched in what ships. RUN cuts it.
* **(b) Every building lane's FIRST job is a break he named.** This lane's first line is
  `[no tabs]`, which he has now said **twice**.

## [no tabs] -- THE TWO BUTTONS ARE GONE
*** PAOLO 9/13, SECOND TIME (locked 9/6 and unshipped for a week): "there is a button that says
pretty map and this button that says drop in, when that function should only be utilized by the
zoom in, zoom out." ***

**MEASURED BEFORE DELETING ANYTHING, because a button you remove is only free if the thing it
did still happens.** The pinch path already calls the *same* `swapMode()` the chip called, in
both directions -- the file's own comments say so at the call sites: pinching in past the
closest zoom reads as *"he is asking to walk"*, pinching out past the furthest as *"he is asking
to leave the walked world"*. So the transition never belonged to the buttons. They were a second
door onto one room, and the 7/1 two-scale camera lock had already said so.

WHOLE MAP's element is deleted; the DROP IN / CITY chip is still built and labelled (other code
reads it, and a missing node is a different bug from a hidden one) but never appended.

**`gates/city_rail_gate.js` 10/0**, with two new legs and both mutation-proved: the buttons are
not on screen at all, AND the crossing still happens both ways (`city -> human -> city`). Put
either button back and the first goes red.

### THREE GATES HAD TO CATCH UP WITH THE RULING, AND ONE WAS COUNTING FURNITURE
* `city_rail_gate` and `phone_object_gate` both reached CITY mode **by clicking the button he
  killed**. They now ask for the transition the way the pinch does. A gate that presses a door
  he removed is testing the door, not the room.
* `city_rail_gate` also required `chips.length >= 8`. That is a **census of how many buttons the
  game happens to have**, and it went red the instant somebody obeyed him. **This lane has now
  made that exact mistake twice** -- thumb_gate demanded two buttons the demo deliberately
  hides. The number is there to stop the leg passing on an empty sweep, so it is a floor (>= 4)
  and no longer a count. The assertion that matters was always the one beside it: every chip in
  the rail is laid out BY the rail.
* And I wrote in my own comment that the WHOLE MAP handler was *"defensive already"*. **It was
  not** -- it dereferenced the node immediately and threw on every load. `city_rail_gate` caught
  it on the first run. A claim about code in a comment is worth exactly as much as the check
  that was run against it.

### WHAT THIS COSTS OTHER LANES, MEASURED RATHER THAN GUESSED
Seven gates across several lanes press `#modechip` to reach city mode. The fix is one identical
line in each -- replace the click with `swapMode()`, which is what the pinch calls:

    gates/faction_between_gate.js:1169     gates/faction_towns_gate.js:1172
    gates/looking_at_the_map_is_not_travelling_gate.js:151,168,172
    gates/human_start_gate.js:117          gates/the_action_button_does_actions_gate.js:122
    gates/cold_hand_gate.js:141 (a selector list, not a click)

Not edited here -- they are other lanes' gates. The one I measured, `looking_at_the_map_is_not_
travelling_gate`, is **7 passed 4 failed on clean origin/main and 8 passed 3 failed in this
tree**: already red before this round, and one leg better after it.

### AND ONE GATE NOW CONTRADICTS THE NEW RULE, WHICH IS NOT MINE TO SETTLE
`demo_build_gate` asserts *"it is a CUT OF THE CURRENT WORKSHOP... regenerating it changes
nothing."* Rule 14(a) says building lanes never regenerate it. **Those two cannot both hold**:
from now on the demo lags every building lane's ship until RUN cuts, so that leg is red for
everyone in between. Reported, not worked around -- re-cutting to make it green is precisely
what the newer, locked rule forbids. For RUN and PLUMBER.

    node gates/city_rail_gate.js        10 ok, 0 failed (two new legs, mutation-proved)
    node gates/phone_object_gate.js     18 ok, 0 failed
    node gates/thumb_gate.js            16 ok, 0 failed
    node gates/half_size_gate.js         7 ok, 0 failed
    node gates/rom_face_gate.js         14 ok, 0 failed
    node gates/alpha_loads_gate.js      20 passed, 0 failed
    node gates/feed_gate.js             15 ok, 0 failed
