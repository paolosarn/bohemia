# WHAT A DEAF PLAYER SEES (8/29/26, SOUND lane)

Item E on the demo gap list is this lane's last open row on the demo path:
**three messages are sound-only.** It was routed on 8/25 in two halves —
SILENT-1 (classify which sounds are messages) to SOUND, SILENT-2 (draw the
visual twins) to RUN — plus a gate:

> `silent_play_gate`: drive the demo with audio disabled and assert every
> INFORMATION cue produced a visible change in the same beat. **And the claim
> must be about PIXELS, not about a function having been called** — this repo
> has spent a month finding finished code with no caller, and a gate that checks
> the call instead of the pixel is that bug wearing a badge.

SILENT-1 shipped that day. **The gate was never built.** RUN has not shipped
since 8/12.

## FIRST, A RED I CAUSED YESTERDAY

Baking his 599-of-600 sweep put nine approved sibling pools into the bank, and
every one landed in the SILENT-1 ledger **unclassified** — the file only knew
the moments that existed when it was written. `sound_message_gate` went red.

Hand-adding nine names would have cleared it and guaranteed the next batch
reopens it. **A sibling is not a new moment:** `door_more` *is* `door_drag`,
same event, one more take of it, so the answer to "does he miss a state change
he has to act on" is by construction the parent's answer. Siblings now inherit
from the SIBLINGS map, so a pool can never again be approved into the game
carrying a classification nobody made.

`parts_pass` was the one genuine new moment, and I had to read its call site to
classify it honestly: it fires inside `payForToday` with the comment *"one
payday is ONE sound."* It is **payday**, which in a game whose spine is
ownership is the state change the whole day was for. INFORMATION, with a twin
that is real but **late** — the day-end reckoning reports what the day paid, so
a muted player finds out at nightfall rather than at the moment. That is a
weaker failure than `save_chime`'s and it is written down as what it is rather
than rounded to NONE to make the list look worse.

**65 moments and 6 stings classified. 13 INFORMATION, 58 ATMOSPHERE. 12/0.**

## THEN THE GATE, AND THE NUMBER THAT MADE IT WORTH BUILDING

The ledger's own header says what a `twin` value is:

> twin values are what the SOUND lane **believes**, never what it proved.
> SILENT-2 confirms on pixels.

**Ten of the thirteen claim a twin and not one had ever been measured.** Three
claim NONE. Both kinds are beliefs, and a belief that the screen says something
is the most comfortable kind of wrong: invisible unless somebody mutes the game
and looks.

So the gate measures pixels **in both directions**:

- a cue whose row claims a TWIN must actually change the screen
- a cue whose row claims NONE must actually change nothing

The second direction matters as much as the first. A `NONE` that turns out to
have a twin is this lane telling RUN to build something that already exists.

**MEASURED, on a muted run, on the real surface:**

    save_chime   fires, screen unchanged   -> twin NONE is TRUE, now proved
    ui_deny      fires, screen unchanged   -> twin NONE is TRUE, now proved

Two of this lane's three no-twin claims have stopped being beliefs.

## THREE INSTRUMENT BUGS, ALL MINE, AND THE THIRD IS THE ONE WORTH KEEPING

**1. I looked in the wrong room.** The first cut drove `autoSave` in the city
frame and reported the cue as never firing. `autoSave` lives in the **run
slice** — a third document, separate from the shell and the city. The wire was
fine; my probe was in the wrong building. The fingerprint reads all three
surfaces now.

**2. I measured my own setup.** The `ui_deny` drive drew the ending card *inside*
the measured block, so the "before" fingerprint had no card and the "after" had
a whole one. The screen had changed enormously — because I had just drawn it —
and the gate reported `ui_deny` as **having** a visual twin. The card is not the
refusal. Draw it, let it settle, fingerprint, *then* press the thing you are not
allowed to press.

**3. A CONTROL TAKEN UNDER DIFFERENT CONDITIONS VALIDATES NOTHING.** With the
setup separated, `ui_deny` *still* reported a change — and the city's own text
had not changed by a single line. The cause: loading the run slice puts a third
live document into the fingerprint, and my null control had been taken **before**
that load. It certified a baseline that no later measurement was taken against.

There are two nulls now, and the second runs with the run slice loaded. Both are
asserted, both are quiet, and the gate says out loud why the second exists.

## MUTATIONS

    A  give save_chime a visible SAVED toast  -> RED, the NONE claim is wrong now
    B  unwire save_chime entirely             -> RED, "the cue actually fired"
       restored                                  12 passed, 0 FAILED

## WHAT IT DELIBERATELY DOES NOT DO

**It does not draw a twin.** SILENT-2 is RUN's row and drawing pixels on the
walked surface is RUN's system. What this gives them is the thing that was
missing: an exact, measured list instead of a believed one.

**It drives 2 of 13 cues and prints that every run.** The other eleven need a
fight, a quest completion or a nightfall to fire honestly, and poking their
internals would measure the poke. The coverage is never mistaken for the whole
list, and the ten still-unproven twins are named on every run:

    STING:done  STING:loss  STING:paid  STING:taken  STING:win
    block  buzz_more  dry_fire  parts_pass  phone_buzz

Tab: none — this is a measurement of the game, not a page. What he would notice
is the absence: mute the phone, save the run, and nothing on screen tells you it
happened.
