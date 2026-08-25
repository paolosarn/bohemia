# SILENT-1 ANSWERED: WHICH SOUNDS ARE MESSAGES (8/25/26, SOUND lane)

Answering **SWEEP 19** (coordinator): *"a sound may be the best copy of a
message; it may never be the only copy."* SOUND classifies, RUN draws.

**Machine-readable, for RUN to consume directly:**
`records/BOHEMIA_SOUND_IS_A_MESSAGE_8_25_26.json`
**Gate:** `gates/sound_message_gate.py` (12 checks, mutation-proved)

## THE TEST

> **If he cannot hear it, does he miss a state change he has to act on?**

Not "is it useful". Not "is it nice". **ACT ON.** Everything else is ATMOSPHERE
and is exempt by the sweep's own decision: losing it costs beauty and nothing
else, and that is most of the 500 candidates this lane has cooked.

## THE NUMBERS

    61 sounds classified   (55 approved moments + 6 stings)
    11 INFORMATION
    50 ATMOSPHERE
     3 with NO TWIN THIS LANE COULD FIND  <- the actual work for SILENT-2

## THE THREE WITH NO TWIN AT ALL

| cue | the message | why it is the whole notification |
|---|---|---|
| `save_chime` | THE RUN WAS WRITTEN | Nothing anywhere says a save happened. The chime IS the notification, and this is exactly what a person checks before putting the phone down. |
| `ui_deny` | YOU CANNOT DO THAT | A refusal with no sound is indistinguishable from **a broken button**. This one does not just lose information, it teaches the wrong thing: the game looks broken rather than strict. |
| `STING:missed` | THE JOB WENT UNFINISHED | The quietest failure in the game. Nothing announces the day ended with the work undone — he just wakes up on day two. |

## EIGHT MORE ARE INFORMATION BUT LIKELY ALREADY COVERED

`phone_buzz` (the unread badge — thin, a STRENGTHEN job not a draw-from-nothing
job), `dry_fire`, `block`, and the stings `taken` / `paid` / `done` / `win` /
`loss`. **Check before drawing.** Handing RUN a padded list would cost them work
on cues that are already twinned, and saying so is the point of doing this in the
lane that knows the sounds.

## THREE CORRECTIONS TO THE ROUTED INPUT

A routed task is not exempt from being checked.

1. **`done_ring` IS A CORPSE.** It was named as one of the three information
   cues. It went **0 UP / 5 DOWN** and holds no approved sound. The moment IT IS
   DONE is real; its sound effect died 10-for-10 across two ids and the moment is
   carried by a **sting** now. Drawing a twin for `done_ring` would have been work
   spent on something the player will never hear. The gate refuses to let a dead
   sound be listed as a message.

2. **WHICH IS WHY THE STINGS HAD TO BE IN SCOPE.** The sweep says *"a one-column
   pass over the rack"* — and the rack is the SFX engine. **The most
   information-dense sounds in this game are not in it.** `taken` / `paid` /
   `done` / `missed` are the transaction family and they are pure state change. A
   pass that walked only the SFX table would have missed every message the music
   carries, including one of the three genuinely untwinned cues.

3. **THE LIST GOT SMALLER, NOT BIGGER.** Two of the coordinator's three already
   have twins or are dead. The real shortlist is three, one of which they could
   not have seen.

## WHAT THIS LANE DOES NOT CLAIM

**It does not assert whether a visual twin exists.** That is a claim about
PIXELS, the sweep says so in capitals, and this repo has spent a month finding
finished code with no caller — a lane that greps for `ammo`, finds 79 hits and
calls it a readout is that same bug wearing a badge. Where a twin is suspected it
is marked SUSPECTED and left for SILENT-2 to confirm on the real surface.

The one thing this lane is authoritative about is **which sounds carry
messages**, and that is the only column it filled.
