# THE MARK ON THE WALL
FACTIONS lane · [horror signs] round four · rule 22 (cook every round) · 9/22/26

## THE ONE LINE
The ground already knows who came past, which way they went and how long ago. **The line
the game says out loud throws away the useful half of it.** This round made the fourth
sign: a crew's mark painted straight onto somebody else's wall. No words on it, no post
holding it up.

Nothing went to the demo or the alpha's play tabs. Rule 18(b) holds.

## MEASURED FIRST, AND THE FIRST MEASUREMENT WAS A TRAP
I swept all 9,216 cells with `BohemiaTowns.tracksAt()`. **Fourteen carried prints. Every
one age 0. Every one leg `out`. Not one caravan, though ten exist.**

That reads exactly like a dead feature and I nearly filed it as one.

**It is not.** `trackOf()` builds a trail from where a party *started* to where it is
*standing*, so at 06:00 on day one a trail is one cell long by definition, and the two
parties sharing each seat's start cell collapse into a single reading. Advancing the
valley's own clock and re-sweeping:

| when | cells with prints | longest trail | going out | coming back |
|---|---|---|---|---|
| the door, 06:00 | **14** of 9,216 | 1 | 14 | 0 |
| one hour later | 78 | 6 | 54 | 24 |
| four hours in | 94 | 14 | 49 | 45 |
| ten hours in | 111 | 14 | 36 | **75** |

So the ground fills through the day, and **by mid-day two in three sets of prints are on
the way back.**

That is the fact worth having. **A crew heading out is a problem forming. A crew heading
back has already done whatever it did.** `leg` is real and well populated, and `trackSay()`
discards it. WORDS Q23 found the same thing from the words end on 9/13 and it is still
true.

## AND THE MEASUREMENT IS WHY IT IS PAINT AND NOT PRINTS
A mark that reads only the live trail shows **nothing in the first hour**, which is the
only hour that counts under rule 14.

Paint does not fade in a day. The marks from before he woke up are already on the walls,
and the live tracks feed new ones as the day runs. **The wall is the valley's memory** —
the prints are gone by morning and the mark is still there.

That is not a workaround for the measurement. It is the measurement telling me what the
thing actually is.

## THE GRAMMAR
Three things and no more:

- **the bar** — the crew, in their published colour
- **the point** — which way they went
- **the strokes** — how many came through

Four states: fresh, sun-bleached, **crossed out by a rival**, and the other direction.
Crossing out rather than removing is how it is really done: you strike a rival's mark and
put yours beside it, and the fact that both stay legible is the point.

**MECHANISM MINE, CONTENTS HIS.** What each crew's own emblem looks like is identity and
it is reserved, so there are no invented logos here — only the shared part that works for
all fourteen.

And it is the first sign in the set with **no words at all**, which means it is also the
first one that does not have to answer rule 19's "who says this": a mark is a thing, not a
sentence.

## THE TWO FAULTS, BOTH FOUND BY LOOKING
**1. The arrowheads were inside out.** The chevron rows run from the outside of the head
toward the bar's centre line, so the width has to **grow** going in: widest where it meets
the bar, one pixel at the tip. The first cut had it shrinking inward, which builds a
**notch** instead of a head, so every mark on the wall read as fletching pointing the
opposite way. On a sign whose entire job is *which way they went*, that is the worst thing
it could possibly do — and it is completely invisible in the source.

**2. The strike was a hardcoded red**, which quietly implies one particular crew did it
every time. Who struck it is a fact the game would know, so it is a parameter now. COLOUR
IS TERRITORY applies to the second mark exactly as much as to the first.

## THE PUBLISHED SITE IS NOW 6 MB OVER ITS CAP, AND 67 MB OF IT IS DEAD WEIGHT
`PAGES PUBLISH` was 261 MB last round. It is **266 MB** this round, against a **260 MB**
cap. It grew 5 MB in one round and nobody has picked it up.

**It is not rule 22's cooking.** Measured: all 65 vote-tab items that point at a file come
to **4.5 MB together** — every cook by every lane since the rule landed. The single
biggest thing added since my last round is **one screenshot at 3.48 MB**, which is seven
times every cook combined.

**Where the dead weight is, measured by asking which files a slice actually loads:**

| | files | size |
|---|---|---|
| `records/target`, referenced by a slice | 95 | 63.2 MB |
| `records/target`, **published for nothing** | **234** | **46.7 MB** |
| retired judge pages in `slices/` (rule 15 killed them 9/14) | 20 | **~20 MB** |

The ten biggest nobody loads are play screenshots and graveyard art: PAOLO_THE_TAP_PICKS
_THE_WRONG_TILE 3.95 MB, PAOLO_CITY_MODE 3.48 MB, PAOLO_WHY_DOES_THE_CITY_LOOK_LIKE_THIS
2.30 MB, FIGHT_VERDICT_ROUND_3_SHEET 1.96 MB.

**`records/target` is published wholesale because slices load 95 files out of it.** The
other 234 ride along.

This is not this lane's system to change, and rule 18 says only the four things ship. But
the 8/6 history is explicit: Pages failed **three commits in a row**, thirty minutes then
timeout, because the build copied more than the product. **67 MB of dead weight on a
surface 6 MB over its cap is that coming back**, and at 5 MB a round it gets worse every
time anybody ships.

## WHERE HE SEES IT
The **VOTE tab**, in the alpha, behind the gear. Registered as
`factions-the-mark-on-the-wall-9-22`.

## RULE 18 AND RULE 22, OBSERVED
No demo cut, no build stamp, no game file touched. One real thing made and registered where
he votes. The cook gate reads *"FACTIONS has cooked at least as recently as it has coded"*.

## [PENDING Paolo] — NOTHING NEW

## THE THING TO CARRY FORWARD
**A measurement that looks like a bug is sometimes the design brief.** Fourteen cells out
of nine thousand read as a dead feature; it was six in the morning. Chasing that one step
further — advancing the clock and sweeping again — turned a false bug report into the
reason this sign is paint instead of footprints. The wrong instinct was to file it. The
right one was to ask what the instrument could actually see.
