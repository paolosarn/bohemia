# SHE IS IN THE ROOM TONIGHT (8/19/26, PEOPLE lane, backlog 0sc)

## WHERE TO SEE IT: the **CUTSCENE** tab. Press PLAY on THE MATCH-CUT OPEN, then
## on THE GRIEF DINNER. The lines are editable in the **WORDS** tab and the beats
## are editable in the **DIRECT** tab.

---

## THE HOLE, AND IT WAS ONE LINE LONG

The demo's shape is: the cold open, the sibling dies, the vista, one good day.
Backlog 0sc's 8/13 amendment, off the played-attachment research, says the death
needs the player to have KNOWN her, and asks for exactly this: "name and one
quirk surfaced before the fight (draft:true)."

Measured on the scene file before a word was changed:

| | |
|---|---|
| lines `sibling_lost` speaks in the whole cold open | **1** |
| when she speaks it | **as a child, ten years before the night she is taken** |
| times she is staged in the present-day room she dies out of | **0** |
| assertions in scene_gate that noticed | **0 of 40** |

She was at the pre-collapse table and nowhere else. On the night of the raid,
the person the whole game is built on losing was not in the room.

His own 7/19 ruling is what makes that a bug rather than a choice:

> "THE TABLE IS THE THROUGHLINE, AND IT STAYS SACRED. The sibling does NOT die at
> the table; the death happens during the raid, away from it, in motion, in the
> house."

She is alive at that table minutes before. The scene simply never put her there.

## WHAT SHIPPED: FOUR LINES, AND NONE OF THEM IS A NEW IDEA

The quirk was already in the file. His existing child line is
**"I'm not eating the green ones."** That IS the bit. Nothing needed inventing,
which is REUSE-FIRST applied to words.

**1. THE CHILD TABLE, ten years ago, warm** (plant)

> ROSA'S LINE, ALREADY THERE: "I'm not eating the green ones."
> **NEW, mother:** "NINA. Green ones too. We do this every night."

One tired sentence does two jobs: it lands the name, and "we do this every
night" tells you this argument has a ten-year history without a word of
exposition.

**2. TONIGHT, the same table, dingy** (repeat)

> **NEW, she is staged at the table at all**
> **NEW, sibling_lost:** "There's green ones in this."
> **NEW, sibling_older:** "There's nothing in it. Eat it."

The same bit, ten years and one apocalypse later, said by the one person who
will not survive the night. The older sibling's flat correction is the straight
man the craft card asks for: a bit needs a normal reaction to bounce off, or it
is somebody being quirky at nobody.

Ninety seconds later the raid takes her.

**3. THE GRIEF DINNER** (break)

> **NEW, mother:** "I picked the green ones out. Force of habit."

She cooked around a person who is not at the table. It never says died, or her
name, or anything about the raid. It is a woman describing a small kitchen task.
EXPLAIN THE HANDS, NEVER THE GHOSTS.

It also gives the existing next line, "I hate this," something to be a response
TO, which it did not have before.

That is the rule of three, and the third instance is his own 7/19 empty-chair
motif arriving as a domestic detail rather than a speech, which his sacred-table
ruling requires.

## THE FULL ARC, READ OFF THE REAL SURFACE

    mother        Sit down, both of you. It's getting cold.
    sibling_lost  I'm not eating the green ones.
    mother        NINA. Green ones too. We do this every night.
    father        They're saying the water district's hiring again. I'll go down Monday.
    sibling_older Can I take the truck Saturday? I'll put gas in it, I swear.
                  ---- THE CUT. TEN YEARS. ----
    sibling_older Same chair. Ten years and you still take the same chair.
    sibling_lost  There's green ones in this.
    sibling_older There's nothing in it. Eat it.
    father        Up. Now. Don't turn the light on.
    father        Back door. Behind me, and don't run until I say run.
                  ---- THE RAID. SHE IS TAKEN. ----
    mother        Eat. It's the last of the good stuff and it doesn't keep.
    mother        I picked the green ones out. Force of habit.
    sibling_older I hate this.

## *** THE MISTAKE WORTH KEEPING: I BUILT A SECOND PLACE TO STORE HER NAME ***

Her name has to flip. 7/19, LOCKED: the surviving sibling matches the player's
gender, so the one taken is the opposite. A line that says her name out loud
cannot be one string.

So I added a `cast` block to the scene file with a drafted pair, Rosa and Milo,
built token substitution into the scene runtime, wired it through the surface,
gated it, mutation-tested it three ways, and it all went green.

**Then I screenshotted the scene and the mother's speaker label said DENISE.**

`FAMILY_CAST` has held the family's drafted names since the cast shipped: RAY,
DENISE, MARCO, NINA, every one `draft:true` — and it already carries this exact
gender flip in its `survivesIf` field. The family was already named. I had
invented a second source of truth for one string, and my names were not even the
right ones.

Two places holding one name is not redundancy. It is a promise that the day he
renames her in one of them, the other keeps saying the old name, in the one
scene the whole game rests on.

**A GREEN GATE PROVES THE THING IT CHECKS, AND NOTHING ELSE.** Every assertion I
wrote was true. None of them asked the only question that mattered: does
somebody else already own this?

The scene now owns no names. It writes `{sibling_lost}`; the surface fills it
from `FAMILY_CAST`; the gate reads that table and asserts the join, the same way
it already reads COMBAT's file to check the encounter handoff. Verified on the
real page: a male player hears NINA, a female player hears MARCO.

## AND A SECOND ONE, SAME SHAPE, CAUGHT THE SAME WAY

`Story.prototype.apply` printed `b.text` raw. The runtime resolved the token
perfectly and the draw path printed straight past the answer, so the caption on
screen would have read:

    {sibling_lost}. Green ones too. We do this every night.

scene_gate was green through this, because it tested the RUNTIME. VERIFY ON THE
REAL SURFACE, again, and it is the third time this week. Fixed in the module,
not at the two call sites, because a copied line is a fix that only half-ships.

## THE MACHINE

| file | what |
|---|---|
| `records/BOHEMIA_SCENE_ACT1_COLD_OPEN.json` | +1 actor, +3 lines, no names of its own |
| `records/BOHEMIA_SCENE_ACT1_GRIEF_DINNER.json` | +1 line, the payoff |
| `engine/bohemia_scene.js` | `fillNames`, `lineOf`, `opts.names`. Owns no names. |
| `engine/bohemia_story_surface.js` | resolves from FAMILY_CAST via its own `survivesIf` |
| `gates/scene_gate.js` | 40 -> 54 assertions |

Mutation-tested, four ways:
- put her back to absent tonight -> **3 red**
- drop the grief-dinner payoff -> **1 red**
- break name resolution in the runtime -> **1 red**
- print `beat.text` raw on the surface -> **1 red**

## WHAT IS STILL HIS, AND WHAT IS STILL MISSING

No casualty is decided here, nobody new is placed, and every name in play is a
draft in FAMILY_CAST that he overwrites in one file. The gate still asserts no
beat carries a death.

**NOT DONE, and it is the other half of 0sc's amendment:** the sibling teaching
the beat (I-MOVE-YOU-MOVE, your first dance partner) and the protect/assist beat
both live inside COMBAT's family-defense encounter, which that lane owns. This
turn did the half that is words and staging. "Losing them = losing your teacher"
needs the teacher, and the teacher is theirs to build.
