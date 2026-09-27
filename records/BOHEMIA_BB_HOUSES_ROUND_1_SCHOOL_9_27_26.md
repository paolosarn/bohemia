# [bb houses] ROUND ONE — SCHOOL
FACTIONS lane · rule 33(f) · NOBLE HOUSES AND STANDING · 9/27/26

## THE ONE LINE
**Battle Brothers' map tells you who holds every town at a glance. Ours tells you nothing,
and it is not painted badly — it never asks.**

Nothing went to the demo or the alpha's play tabs. Rule 18(b) holds.

## WHY THIS ROW MATTERS NOW
Rule 33 (Paolo 9/24, an executive decision) makes the city view **the map**, and the map the
way the valley is crossed. That promotes the zoomed-out screen from a thing he pinches to on
occasion into the most important surface in the game. This lane owns territory, so what that
map says about who holds what is this lane's question.

## HOW BATTLE BROTHERS DOES IT
**One glance, and you know who owns the valley.**

- **Three noble houses**, each holding a set of settlements in the south of the map.
- **Every settlement carries its holder's colours.** You never open a menu to learn who owns
  a town; the map is the answer. That is the whole trick and it is a rendering decision, not
  a systems one.
- **Standing is per house, not one number.** You can be welcome in one house's lands and
  hunted in another's, and the contracts you are offered and what they pay follow from it.
- **Contracts come from holdings**, so who holds what decides what work exists and where.
- **The late-game noble war sweeps the map**: houses fight, settlements change hands, and
  the map visibly redraws. The story is told by colours moving.

The lesson under all of it: **territory is only a story if you can watch it change.**

## WHAT WE ALREADY HAVE, AND IT IS MORE THAN I EXPECTED
Measured, not recalled:

| | |
|---|---|
| crews holding ground | **14** |
| blocks in the valley with an owner | **9,216 of 9,216** |
| seats, each on ground its own canon names | **14** |
| crews with a published colour, measured off his own wardrobe | **14** |
| standing per crew | **exists** (the belonging ladder, a count of what you did for them) |
| a crew refusing to deal with you | **exists** (the against organ's own refuse sign) |
| ground changing hands and being remembered | **exists as of last round** (the territory ledger) |

**Almost every part of the Battle Brothers houses idea is already built here.** What is
missing is not the systems. It is that none of it reaches the screen.

## WHAT OUR MAP SAYS, COUNTED ON THE RUNNING GAME
Photographed and counted on the real map — **two squeezes, camera moved**, because EYES
[bb reads] measured that the first squeeze flips the mode flag and leaves the picture as the
street for ten seconds.

| on the map | Battle Brothers | ours |
|---|---|---|
| a party marker | yes | **no** |
| towns marked as places | yes | **no** |
| who holds each place | yes | **no** |
| your standing with each crew | yes | **no** |
| roads that read as roads | yes | **no** |
| ground changing hands over time | yes | **not shown** |
| **times the map asks who owns a block** | every draw | **0** |

> **THE MAP DOES NOT PAINT TERRITORY BADLY. IT NEVER ASKS.**

52% of that screen is one colour, and it is sand.

## RULE 33(g): WHAT MOVES THAT THEIR PICTURE DOES NOT
His words: *"Battle Brothers is just a bunch of pictures... we can do more and put more life
into it."*

**Their banner is a still.** A settlement's heraldry in Battle Brothers never moves; it is
swapped when the town changes hands and that is the whole animation budget.

**Ours should not be a flag at all. It should be the lights.**

This lane has already measured that only **358 blocks of 9,216 have power**, and that a crew
which cannot pay has its blocks **cut one at a time**. So a crew's holding on our map has a
living state the game already computes: it glows, and it goes out.

- A crew losing does not get a new flag. **Their valley goes dark block by block.**
- A crew being paid comes back on.
- You would watch a crew die from across the valley **with no words on screen at all**,
  which is the analog horror register exactly: an ordinary utility reading, changing.

And the crisis that sweeps their map has an answer here too, and it is his own rule 31:
**3,415 of 9,216 blocks change hands between act 1 and act 3** (this lane measured it). Their
noble war happens once. Ours is a century, and he can flip between the ages and watch it.

## WHAT THIS ROUND DOES NOT DO
It does not put anything on the map. Drawing the map is not this lane's system and rule 18(b)
holds on the play surface either way. This is the school page rule 33(f) asks for, plus the
measurement the drawing lane needs, handed over with numbers rather than an opinion.

## THE COOK
`slices/vote/FACTIONS_FOURTEEN_CREWS_NONE_ON_THE_MAP_9_27.html`, registered
`factions-fourteen-crews-none-on-the-map-9-27`. A real frame off the map (rule 32f), all
fourteen crews with the colours he picked himself, and the count beside it.

## A NUMBER OF MINE THAT WAS RIGHT BY LUCK, AND IS NOW RIGHT ON PURPOSE
Last round this lane reported **"the city view asks zero times"**, measured at `mode: city,
czoom: 1`. EYES then measured that **one squeeze sets the mode flag and leaves the picture as
the street**, which means that number was taken on the frame that lies.

Re-measured this round at the real map (`czoom 0.208`, tile width 3.7): **still zero.**

Nothing he was told changes, so there is no correction owed to him. But it is the second
time in three rounds that a claim of this lane's was right for the wrong reason, and the
first one was caught the same way: by somebody else measuring the thing properly.

> **A NUMBER TAKEN ON THE WRONG FRAME IS NOT A MEASUREMENT EVEN WHEN IT IS THE RIGHT NUMBER.**

## AND AN INSTRUMENT THAT REPORTED A FINDING WHEN IT HAD NOTHING
The first cut of the colour sweep read the faction ink file at its top level and got `_`,
`measured` and `factions` — no hex anywhere — and printed **"crew inks on the map: 0 of 0"**.
That reads exactly like the finding I was hoping for. The inks are nested under `.factions`.

Fixed, and the sweep now refuses to report at all unless it parsed names. And the result it
then gave is **still not evidence**: most crew inks are drab browns, the desert is brown, and
Cartel and Mob quantise into the same bucket, so near-matches on a brown map say nothing
about territory. **The call count is the decisive number and the colour count is noise.**

## RULE 18 AND RULE 22, OBSERVED
No demo cut, no build stamp, no game file touched.

## [PENDING Paolo] — NOTHING NEW

## THE THING TO CARRY FORWARD
**We had almost the whole feature and none of the screen.** Fourteen crews, fourteen seats,
fourteen colours he chose, standing per crew, refusal, and now a memory of ground changing
hands — every system Battle Brothers uses to make its map a story is already in this repo,
and the map asks for none of it. **Check what reaches the glass before building another
system behind it.**
