# THE LAST THIRTY SECONDS MAKE NO SOUND (8/27/26, SOUND lane)

PEOPLE shipped the demo's ending today. It is the best-argued thing on the demo
path, built on Kahneman and Fredrickson's **PEAK-END RULE**: what a person keeps
of an episode is predicted almost entirely by two moments, the most intense one
and **the last one**. Not the average. Not the total.

Its centrepiece is the corpus's single most repeated craft device — a reply the
player wants to send, sitting there greyed and dead.

I drove it on the real surface the day it landed.

    branch untaken   drew 4 lines   heardOnShow []   heardOnTapDeadVerb []
    branch failed    drew 5 lines   heardOnShow []   heardOnTapDeadVerb []

**The demo's last moment made no sound at all, and the thing you are not
allowed to press answered a tap with nothing.**

## THE SECOND SILENCE IS NOT A MISSING NICETY. IT INVERTS THE DESIGN.

The demo gap list already named this exact cue as the sharp one, five weeks ago:

> `ui_deny` is the sharp one — **a refusal with no sound is indistinguishable
> from a broken button.** It does not merely lose information, it teaches the
> wrong thing: the game looks broken rather than strict.

So the last thing a stranger did in this game was press something that refused
them **on purpose**, hear nothing, and file it as a bug. The most carefully
designed beat in the demo was landing as a defect, at the one moment the
research says is half of everything they keep.

## AND IT WAS 64 MOMENTS, NOT 5

The withheld verb is not an ending feature. `@NOVERB` appears **59 times across
the quest corpus** and renders as `<div class="noverb">` in every conversation
card, plus the ending's 5.

    S17 THE SEED THAT DOES NOT COME BACK      3
    S21 THE ONE WHO CAME BACK                 3
    S13 THE PAPER THAT SAYS SO                3
    S20 THE NAME ON THE COUNTERFEIT           3
    ... 59 total

Every single one silent. The game's most repeated craft finding has never made
a sound anywhere in it.

## THE CAUSE IS THE SAME TOO-NARROW MATCHER, A FIFTH TIME, IN THE FUNCTION WHOSE OWN COMMENT WARNS ABOUT THE FOURTH

`__THE_CITY_ANSWERS_A_TAP__` (8/22, this lane) says, verbatim:

> The first version of this matched only `button` and missed `#phonebtn`
> entirely — measured silent on the walk, which is the **fourth time this week**
> a too-narrow matcher has told me something was missing when it was my selector
> that was.

It was widened for the city's chrome divs and stopped there. A withheld verb is
a div carrying no class the matcher knows, so `if(!btn) return;` and the tap
dies in silence.

**Writing the warning down did not make the next selector wide enough.** The
comment was right, was mine, was three lines above the bug, and did not prevent
it. Only driving the surface found it. That is the fifth instance this month and
it is the same lesson every time: a matcher is a claim about the world, and a
claim you do not test is a guess with good handwriting.

## WHAT SHIPPED — THREE WIRES AND A CORRECTION, NOTHING COOKED

**1. A withheld verb answers a tap with `ui_deny`.** `.noverb` and `.endnoverb`
join the matcher and are refusals **by construction**, never by reading a label:
they carry no `disabled` and no `.off` because they are not disabled controls —
they are sentences the game will not let you finish, which is the same fact
stated in the author's grammar instead of the DOM's. 64 moments.

**2. The ending's message lands audibly** — `phone_buzz`. Not something new: it
is approved, it is already the morning call's sound in the same file, and this
is literally the same event, a message from a person arriving on your phone.
REUSE-FIRST answered by the moment already having a twin.

**3. The music lets go when the day does.** Measured: kill two people, end the
day, and the ladder was **still at level 3** when the ending landed. A friend's
text message after dark, scored like the firefight you were in an hour ago, at
the moment peak-end says is half of everything. `__ENDING` is published by the
ending's own code the instant it draws, so the shell sees the day end **without
the city being edited** — the same shape as the other two triggers.

**4. A stale comment in my own ladder, corrected.** `KILLMUS` still told every
reader that `talking` and `crowd` were UNWIRED and that "this lane does not edit
that surface". Both were wired one turn ago, from the shell, without editing
that surface. A doc describing a built system as unbuilt is the rot the truth
hierarchy exists to kill — the 8/1 fade line read `[UNBUILT]` for nineteen days
after it was built. This one was one day old and it was mine.

### WHAT DELIBERATELY DID NOT SHIP

- **No sting at the ending.** The reckoning one screen earlier already announces
  the day's verdict. Re-announcing it over a friend's text message would score a
  phone call like a boss kill.
- **No pixels.** The greyed verb stays exactly as PEOPLE drew it. Whether a
  refusal should also *flinch* is RUN's SILENT-2 row and another lane's call.
- **No new behaviour.** The verb still does nothing. It now *sounds* like it
  does nothing on purpose.

## THE GATE — `ending_sound_gate.py`, 24 CLAIMS, ALL DRIVEN

    the ending draws, two real branches, two different endings
    IT MAKES A SOUND WHEN IT LANDS                        phone_buzz
    THE WITHHELD VERB ANSWERS WITH THE REFUSAL SOUND      ui_deny
    exactly one sound per tap
    a CONVERSATION card's withheld verb answers too       the other 59
    an ordinary button still ticks                        ui_tap
    a way out still sounds like a way out                 ui_back
    AND THE MUSIC LETS GO WHEN THE DAY DOES               level 3 -> 1
    both sounds live in the rack, neither in the graveyard

**Both halves of the 59-verb claim, or it is decoration.** A live probe that
appends its own `.noverb` proves the *delegate* and nothing about whether the
game ever emits that class. So the class contract is asserted in the source
(`class="noverb"` really is what the conversation card renders) and the delegate
is driven live. One without the other is a claim that cannot fail honestly.

### MUTATIONS

    A  the ending goes silent again                RED, both branches
    B  the matcher narrows back to buttons         RED, 3 legs
    C  the verb sounds, but ui_tap not ui_deny     RED, 3 legs, naming the sound
    D  the ladder stops letting go at the ending   RED, naming level 3 / kills 2
       restored                                    24 passed, 0 FAILED

C is the one that matters most: it is the failure where a sound *exists* and is
the *wrong* one. A gate that only distinguishes noise from silence would have
passed it.

## AND THE GATE'S FIRST VERSION WAS MEASURING ITS OWN SCRIPT

Claim D went red on a correct build. The watcher acts on the **transition** into
the ending, once — the same shape as talking and crowd — and the gate was
testing the ladder *after* two branch probes had already shown the ending, so
the latch had long since fired. The build was right and the sequence was
invented. **A gate that drives the beats in the wrong order is measuring its own
script, not the game.** The day-over test now runs first, before anything else
in the file shows an ending, which is also the only order a player can take.

## WHAT IT DOES NOT CLOSE

`STING:missed` and `save_chime` are the other two of the demo gap list's item E.
`STING:missed` already fires at the reckoning. `save_chime` is untouched by this
turn and still has no visual twin — that half is RUN's SILENT-2 row.

Tab: RUN — play a day to the end. The sound is the last thing you hear, and the
reply you cannot send now says so out loud.
