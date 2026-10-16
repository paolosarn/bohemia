# YOU HAVE SEEN THE OPENING WHEN YOU HAVE SEEN THE OPENING (8/25/26, PEOPLE lane)

## THE OPENING SPENT ITS OWN FLAG SIXTY-FIVE SECONDS IN, AND A PHONE CALL DURING
## THE GRIEF DINNER TOOK THE SISTER'S DEATH, THE MOURNING AND THE BURIAL AWAY
## FOR GOOD.

The previous turn proved the opening plays all four scenes and hands the player a
day. This one chased the number that turn measured and did not stop on:
**`save rows: 0` after 164 seconds of story.** That led straight to a worse one.

`openRaid` called `openMarkSeen()` at the handoff to the fight. Measured on the
real surface:

```
before WATCH          seen=false
a few beats in        seen=false
standing in the raid  seen=TRUE      <- 65s in, 1 of 4 scenes played
in the grief dinner   seen=TRUE      scene=act1_grief_dinner
```

Then the phone rings. Force quit, reopen, tap RUN:

```
offered the opening again : false
playing anything          : false
still marked seen         : true
saves                     : 0
```

**The last room, the grief dinner and the burial: GONE, with no way back to
them.** That is the whole emotional payload of Act 1 -- your sister's death
landing, the family mourning her, the burial that ends the tutorial -- lost to an
interruption, permanently, on a demo player's very first run. And they do not
even get the story back by starting over, because the flag says they have seen it.

## WHY IT WAS WRITTEN THAT WAY, AND WHAT IT SHOULD HAVE BEEN

The mark was not careless. Its comment says "he has seen the opening; it must not
replay" -- during the raid `OPEN_RUNNING` is false, so without something holding
the line the invite could offer the opening again on top of the fight.

That is a real problem. **The seen flag was just the wrong tool for it.** It is a
permanent, cross-session, cross-device statement about the player's whole life
with the game, used to solve a ten-second in-session concern.

```
OPEN_MIDFLIGHT   this session, openStart -> openDone, ACROSS the fight
                 answers "is a sequence in flight" (OPEN_RUNNING cannot: it goes
                 false while combat has the screen)
OPEN_AT_KEY      the bookmark: which scene was playing when they stopped
seen             spent in openDone ALONE, and openDone clears the bookmark
```

## AND IT PICKS UP WHERE THEY LEFT IT

`openStart` reads the bookmark and resumes from that scene instead of the top.
Replaying 26 beats somebody already sat through is its own way of taking their
time, and it is what would have made a returning player skip.

```
stopped during : act1_grief_dinner   bookmark=act1_grief_dinner
resumes at     : act1_grief_dinner
VERDICT        : PICKS UP WHERE THEY LEFT IT
```

A bookmark pointing at a scene that no longer exists is not a bookmark, so
`openUnfinished()` resolves it through `openSceneById` before trusting it.

**Fixed at the generator**, `tools/bohemia_opening_patch.py`, never in the alpha
it writes. That is the lesson this lane paid for earlier the same day.

---

## THE GATE: 53 -> 63, AND ONE CLAIM OF MINE WAS ENCODING THE BUG

The gate had this, sampled at the handoff to the raid:

> WATCHING IT THROUGH COUNTS AS SEEN

It passed **only because the bug was there.** The flag was true at that moment
precisely because openRaid was spending it early. A claim that goes green only
while the defect exists is worse than no claim: it defends the defect.

It now reads **THE SEEN FLAG IS NOT SPENT MID SEQUENCE**, and whoever re-adds
`openMarkSeen` to the raid path turns it red. The original meaning is kept,
correctly sampled, by "having watched the whole thing, it never asks again" at
the end of the sequence.

Nine new claims drive the interruption for real: play in, stop mid sequence,
**reload the page the way a force quit does**, and demand the story is still
offered, still unspent, and resumes at the bookmark.

## THE MUTATION PROOF

**THE GATE HAS TO CREATE THE CASE IT CLAIMS TO TEST.** Both breaks run the real
gate against the real alpha, restored from a byte-for-byte backup afterwards.

| break | result |
|---|---|
| **MI** `openRaid` spends the seen flag again (**the exact code that shipped**) | **5 red**, including the one in plain words: `AN INTERRUPTED OPENING IS STILL THERE WHEN THEY COME BACK` |
| **MJ** the bookmark is never written | **2 red**: `THE GAME REMEMBERS WHERE THEY GOT TO (null)` and `PICKS UP WHERE THEY LEFT IT (act1_cold_open)` -- it replays from the top, which is exactly what the claim forbids |

MI is the one that matters. Restore the shipped code and the gate goes red on five
claims, for the right reason, naming the cost. **This bug cannot come back
unnoticed.**

## THE COST

The gate is now the heaviest in the suite at about six minutes: it plays the
whole opening twice, once through to the day and once interrupted. That buys the
only proof that the demo's first five minutes survives a phone call.

## THE MACHINE

| file | what |
|---|---|
| `tools/bohemia_opening_patch.py` | the bookmark, the in-flight flag, the resume |
| `slices/BOHEMIA_ALPHA_0_9.html` | regenerated from it |
| `gates/opening_gate.js` | 53 -> 63 claims; the interruption block |
