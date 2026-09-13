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
