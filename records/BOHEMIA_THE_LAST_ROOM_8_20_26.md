# THE LAST ROOM (8/20/26, PEOPLE lane, backlog 0sc)

## WHERE TO SEE IT: the **CUTSCENE** tab, the fourth chip, THE LAST ROOM. In the
## game it plays the moment the raid ends, before the next morning. Lines editable
## in the **WORDS** tab, beats in the **DIRECT** tab.
## (This line said "chip 2" and was wrong -- the picker builds itself from the
## scene files in filename order, so the position moves whenever a scene is added.
## Measured on the real alpha: it is the fourth.)

---

## HIS SENTENCE HAS THREE CLAUSES AND THE GAME PLAYED ONE

Beat 1 of the crystallized opening, in his own words (7/19):

> "defending the home room to room, **a sibling is killed**, **it ends saving the
> mother**."

The implementation ended when the last hostile dropped.

- You never reached her.
- The person who was taken was simply *absent from the next scene*.

The raid started running yesterday, so for the first time that gap was
reachable — and what it reached was nothing. You win the fight, the screen
changes, and the next thing you see is a dinner table the following evening with
one fewer chair, having been told nothing.

## THIS IS NOT A FOURTH BEAT

His law crystallizes the opening as **three** beats and this lane does not get to
make it four. THE LAST ROOM is the back half of the first one: it is the raid's
`then:` target, and it hands on to THE GRIEF DINNER itself, so his order is
untouched.

    cold open --combat--> THE RAID --then--> the last room --> grief dinner --> the ridge

## WHAT IS IN IT: TWO LINES AND A SILENCE

**You reach her first, and nobody speaks for two and a half seconds.** The relief
has to land on its own before the other thing does.

    mother          Where's NINA.
    (three seconds of nobody answering)
    sibling_older   Don't go back in there.

**No question mark on the mother's line.** She is not asking. The sentence is
coming out anyway.

**The answer is the silence.** The longest hold in the scene sits between the
question and the thing that is not an answer, and the gate asserts it is the
longest — a line there would be the game explaining what the room already said.

**"Don't go back in there" does three jobs in five words:** it confirms it
without the word, it tells you the older sibling *saw* it, and it is an act of
protection from somebody who has just decided they are the one who handles things
now. That is the co-founder of the city being born.

**Nobody says died, dead, killed or gone.** Asserted.

## WHAT IT DELIBERATELY DOES NOT DO

**The death is not staged, and staging it would be overwriting a ruling with a
picture.** His 7/19 law puts it "during the raid, away from [the table], in
motion, in the house" — so it has already happened when this scene starts. The
lost sibling is not an actor in this room and the gate asserts she is not.

**Whether the father is standing there is not decided.** No scene has ever
resolved his status; it is his ruling, and the DIRECT tab is one actor beat away
from making it.

**No casualty is authored.** The loss is his, ruled 7/19, and pacifism never
saves her either way — that was already canon before this scene existed.

## THE ART WAS NEVER MISSING. THE POSE WAS. (amended 8/20, same day)

This section originally read "the art is not there and the frame says so", with
`needsArt: "the house after the raid, lights out, a door standing open"` and the
honest empty frame the ridge burial gets. **That was wrong, and it was wrong in
an expensive direction: it declared a picture missing that had existed since
8/9.** This scene happens in the family's own house four minutes after the raid,
and the cold open has been drawing that exact post-collapse interior all along.

What was actually missing was not a picture. It was **the ability to put a body
in a room standing up.** Every actor beat has always carried a `pose`, and the
surface posed every single one of them `sit-chair`, because the only scene that
had ever existed was a dinner table. Reusing the house would have sat three
people down to dinner in the room they had just fought through, so the scene
invented a place called `house_after` and called its art outstanding instead.

`bohemia_stage.js` has carried `Seating.stand()` since it was written, with
**zero callers**. Eleventh built-and-gated-and-unreachable capability this lane
has found. Standing is wired now, the scene is set in `family_table`, and
`needsArt` is gone: it plays in the house, lantern lit, three people on their
feet. **A CAPABILITY NOBODY CALLS LOOKS EXACTLY LIKE A MISSING FEATURE, and the
cheaper mistake is always to go build the feature again.**

## THE MACHINE

| file | what |
|---|---|
| `records/BOHEMIA_SCENE_ACT1_THE_LAST_ROOM.json` | new, 11 beats, 2 lines, cited per line |
| `records/BOHEMIA_SCENE_ACT1_COLD_OPEN.json` | the raid returns into it |
| `gates/scene_gate.js` | 86 -> 102 |

Mutation-tested, three ways:
- stage the death in the room -> **2 red**
- say the word out loud -> **1 red**
- skip it, raid returns straight to the next day -> **2 red**

One of my own earlier assertions had to be generalised rather than satisfied: 3f
pinned the raid's return target to the grief dinner *by filename*, so a correct
change looked like a regression. It now asserts the target RESOLVES, and a new
3h asserts the whole order end to end. **An assertion that pins today's answer
instead of today's rule fails the day the answer legitimately changes.**

## WHAT COMES AFTER

Unchanged, and none of it is this lane's:

1. **Walking is silent** — the city sends one sfx message and has zero footstep
   code, while 97 approved sounds sit unplayed. SOUNDS.
2. **No fight on the walked surface** — the `startEncounter` hits in the city are
   comments. RUN + COMBAT.
3. **`COLD_OPEN.cast` / `place`** — and this is sharper than "they are empty":
   `placeHoldLine(spec)` reads **only** `spec.holdLine`. The combat frame has no
   concept of people or a place behind you at all, so filling those fields would
   put data into something nothing reads. It is not a content fill, it is a
   feature COMBAT would build.
4. **The ridge exterior, and the house-after** — two missing pictures, both ART's.
