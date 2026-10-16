# FIVE HUNDRED WRITTEN LINES, PARSED, AND MUTE
# (8/26/26, PEOPLE lane. His playtest dispatch, item 2, the half that was left.)

## WHAT I FOUND, COUNTED BEFORE ANYTHING WAS BUILT

```
quests/bq        27 files
@TALK nodes     236
@SAY lines      504
@OPT choices    558
@NOVERB          59
```

`bohemia_bq.js` parses every one of them. `bohemia_quest_runtime.js` **PLAYS**
every one of them: `available()` / `begin()` / `view()` / `choose()` have been
finished, correct, and UI-agnostic since the day they were written.

**AND NOTHING HAD EVER RENDERED ONE.**

The demo day loop binds stages to WORLD EVENTS -- where you walked, whether the
block had power -- so a quest spoke to the player through the phone and the
journal and **never through a mouth.**

Paolo, 8/11: *"I HAVE A WHOLE 170 QUEST FILE WITH DIALOGUE."* Five hundred lines
of it were in the repo, parsed, and silent.

## WHY IT WAS POSSIBLE TODAY AND NOT YESTERDAY

A `@TALK` node's `speaker` is a **@ROLE NAME**, and until this morning a role was
a WORD. Casting resolves it to somebody standing on the block, so the chain
closes for the first time:

```
speaker  ->  role  ->  cast  ->  key  ->  the person whose card is open
```

That is the whole reason these two pieces shipped on the same day. Neither is
worth much alone.

## ON THE GLASS, MEASURED THROUGH THE REAL SURFACE

Walk up to the person the quest cast. The card says:

```
Find why the block browns out                <- the button, and it is the
                                                quest's own objective, verbatim
```

Press it:

```
WORKER
Every night, same hour, this block loses half its light.
The line tests clean. A clean line that browns out is not a broken line. It is a shared one.
Somebody upstream is drinking before we do. Walk it back for me. Quiet, if you can manage quiet.

[ I will walk it back. ]  [ Why not walk it yourself? ]  [ Not my block. ]  [ (say nothing, just go) ]

  "Tell me who runs the network"             <- struck through, and dead to the touch
```

Answer, and **the quest moves: stage 10 -> stage 20.**

## FOUR DECISIONS, AND WHERE EACH ONE CAME FROM

### 1. THE CARD IS THE CONVERSATION
Not a new panel. It renders into the same `#ctcard`, so it inherits the scrim,
the real X, the bottom anchor, Escape, and the walk-away close. **Walking off
mid-sentence works for free**, and that is the kind of thing a new panel gets
wrong for a month.

### 2. THE NOVERBS ARE ON SCREEN, GREY, AND UNPRESSABLE
This is the single most repeated finding in
`questbook/BOHEMIA_CONVERSATIONS_MASTER`. Seven of its marquee nodes -- the
Baron, Hildern, the Whodunit survivors, Jefferson Peralez, the Strange Man,
Brisby, Shadowheart -- are every one of them remembered for **the thing the game
would not let you say.** Fifty-nine of them are authored in our own quests and
the game had never shown one. **A WITHHELD VERB NOBODY CAN SEE IS NOT WITHHELD,
IT IS MISSING.**

### 3. A TRAP IS NEVER MARKED
`view()` hands over `trap:true` and the surface ignores it on purpose. The
master's own words: *"Available, functional, wrong."* Marking a trap deletes the
trap. The gate checks that nothing on the glass names one.

### 4. A CONVERSATION PLAYED IS A CONVERSATION CLOSED
And this one **would have shipped as a silent bug.**

**ZERO `@LOCK` exists in the entire corpus** (counted: 0 across 27 files), and
`available()` filters on nothing but `state.locked`. So every entry node
re-opened forever. Swept it live:

| | |
|---|---|
| option paths swept | 218 |
| paths where playing the scene TWICE changes the numbers | real, and non-zero |
| what it looks like | `CARTEL 10 -> 20`, `TRADES -8 -> -16`, `BLUES 12 -> 24` |

Standing you can farm by pressing one button twice. The entry node is locked
when the graph ends, using the runtime's own field, which `serialize()` already
carries into the save. **No new state exists.**

**AND WALKING AWAY DOES NOT LOCK IT.** `begin()` is called exactly once and
`rt.view()` still holds the node, so coming back picks the scene up where you
left it. A reload starts that conversation over, and **that costs nothing** --
measured: only 2 of the 62 entry nodes carry a node-level `@DO` at all, and both
are objective bookkeeping.

## THE NARRATION SEAM, WHICH IS THE PART NOBODY WOULD HAVE SEEN GO WRONG

A chosen `@OPT` can carry `@DO set_stage 20`. That verb goes **straight through
the canonical `Runtime.setStage`**, so by the time the UI asks what happened, the
stage has already been entered and all of its `@DO` verbs have already run.

Narrating it by calling the day loop's `_toStage()` would run the stage **a
second time**: every bond paid twice, every faction move doubled, with nothing on
screen to show for it. `D.spoke()` exists for that one reason. It reports what
already happened and makes nothing happen.

**AND THE FIRST VERSION OF THE CLAIM THAT GUARDS IT WAS AIMED ONE STEP TOO LATE.**
It snapshotted the numbers *after* the first narration and then called `spoke()`
twice more -- but the watermark already refuses the second call, so the mutation
that re-runs the stage slipped straight past it, green. The claim now counts how
many times the stage appears in the runtime's own log, from before the first
narration. `stage 20 ran 2 time(s), was 1` is what the mutation prints.

## AND A SECOND DEFECT, FOUND BY TRACING RATHER THAN BY LOOKING

Day one's spec says `choiceAt: 20`. The first answer in the lineman's
conversation -- "I will walk it back." -- reaches node `walk`, which carries
`@DO set_stage 20`. **So the day's RESOLUTION card would have thrown itself up
over a person who was still mid-sentence**: two decisions on the glass at once,
the second one answering a question the first had not finished asking.

Nothing on screen was broken, no gate was red, and I did not see it. I found it
by reading the day-one spec next to the .bq and noticing the two numbers were the
same number. **`DQ.pending` already holds that card** -- it is how the phone hands
over the day's first choice -- so nothing new stores it: the card is simply not
passed through while the scene is running, and it opens the moment the scene
ends. One decision surface at a time.

## THE OPENER BUTTON SAYS THE QUEST'S WORDS, NOT MINE

Measured: **52 of the 62 entry nodes have an `@OBJ` whose `target` IS that node's
speaker role.** So the button is the objective's own text, verbatim -- literally
the sentence the HUD is already showing the player, and checkable byte for byte
by the gate. The other ten get an attempt tagged `draft:true`.

## MUTATIONS

| break | result |
|---|---|
| **M18** the noverbs are not rendered | **2 red** |
| **M19** the lock deleted (a conversation you can have again) | **2 red** |
| **M20** narrate by re-running the stage | **1 red**, `stage 20 ran 2 time(s), was 1` |
| **M21** the cast ignored (anybody can be the lineman) | **2 red** |
| **M22** the spoken lines not rendered | **2 red** |
| **M23** the resolution card let through mid-sentence | **1 red**, `day card up: true` |

## AND TWO CLAIMS THAT PASSED ON AN EMPTY SCREEN

`AND IT IS NOT PRESSABLE` and `A TRAP IS NEVER MARKED` were both written as
`[].some(...)`, which is **false on an empty list** -- so both passed on a card
with nothing rendered at all. Both are guarded on something having been drawn
now. That is this lane's own recurring bug and it is the third time this week:
**A CLAIM HAS TO BE BUILT SO THE RULE IT NAMES IS THE ONLY THING THAT CAN MAKE
IT PASS.**

## AND A TOOL REFUSED TO WRITE, CORRECTLY

The city inlines its engine modules, and `bohemia_city_module_resync.py` finds
where a module ENDS by scanning for the next `/* ==== engine/` banner. Parking
the new module above ordinary code gave it no end: the cut came out **50,917
bytes against a 5,002 byte module** and the tool refused. That guard was added on
8/20 after this file lost 1,159 lines to a bad cut, and it just earned its keep.
The module is parked immediately above another module's banner now, so the cut is
the module and nothing else.

## WHAT THIS STILL DOES NOT CLAIM

**THE PLACE HALF.** `castTarget()` has picked a real district cell per quest since
7/26 and the demo day loop still binds to world events, so the conversation
happens wherever the cast person is standing. That wiring is the day loop's.

**AND THE WORLD EVENTS STILL WORK.** This is a second door into the same quest,
not a replacement: walking into a dark building still advances the meter reader.
A player can now get there by talking OR by walking, which is more game, not less.

## THE MACHINE

| file | what |
|---|---|
| `engine/bohemia_conversation.js` | `nodeFor`, `openerFor`, `close`, `closed` |
| `engine/bohemia_demoquests.js` | `D.spoke()` and the `lastNarrated` watermark |
| `tools/bohemia_city_conversation_patch.py` | the card, the says, the options, the refusals |
| `gates/conversation_gate.js` | 34 claims, registered as CONVERSATION |
