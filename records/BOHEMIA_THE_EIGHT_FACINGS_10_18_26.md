# THE EIGHT FACINGS (PLUMBER 10/18, rule 107)

Row: PLUMBER [the eight facings]. Gate: gates/the_eight_facings_gate.py, in the suite as THE EIGHT FACINGS, 13 passed 1
failed, 4 s, no browser, reads pixels. RED AT REGISTRATION ON PURPOSE, named to ANIMATION (the old dire wolf).

## Why

Paolo 10/10: "one of the chats made a dire wolf; when you create something it has to be made in all eight directions,
you understand that." Rule 107: a person, a beast, a vehicle, anything that turns, is drawn N, NE, E, SE, S, SW, W, NW;
a mirrored half is not a direction; ANIMATION's dire wolf comes back with all eight before it is seen again; "PLUMBER
[the eight facings] counts them on every sheet that moves."

## What it reads (pixels, never a comment)

RIG: every folder the master rig rendered into (any records/target/**/rig.json; 83 today: CHARACTER's thirteen gangs,
body and barber cuts, COOK THREE's five, PORTRAIT's fifteen, ANIMATION's six beasts, DIRECTION's man, robot, fox, truck
and style-guide pairs, COOK's twenty props). Each must have the eight stills on disk (rig_<F>.png, else raw_<F>.png),
all eight in every clip (<kind>_<clip>_<F>_kNN.png), and no west-side facing equal to its east twin flipped (W and E,
NW and NE, SW and SE; the stills and each clip's first key).

THE MIRROR TEST: each picture is cut to its own box (so a flip pasted onto a bigger canvas or moved over is still
caught), the east one flipped, and the share of the two silhouettes' union where they agree (alpha on or off, colour
within 12 levels) is read. Measured on all 83 folders: real renders 0.47 at most (most 0.0 to 0.35); a flip 1.00. The
line is 0.90.

PLAYS: every sheet the game draws, found by its data so a new one is caught without anyone adding it to a list: a JSON
under slices/ (not slices/vote/) whose rows or dirs are compass facings (the fight's people, the settlement's people,
the fight beasts, the rig cast the map uses), whose looks or walks carry a dirs table (the demo's cast and crowd), plus
the two the game makes in code: the alpha's MIRROR table (and the demo's copy) and the wildlife bank (one view, flipped
in the city). A facing row that is its twin flipped in nine of ten cells counts once.

## What it found

| Sheet | Lane | Distinct facings | Why |
|---|---|---|---|
| every rig folder (83) | the rig lanes | 8 | rendered, never mirrored |
| slices/BOHEMIA_RIG_CAST (the map's gangs) | RUN | 8 | from CHARACTER's rig renders |
| slices/BOHEMIA_DEMO_CAST, _CROWD | RUN | 8 keys | drawn by the alpha's rig, so its painted layers carry the alpha MIRROR debt |
| slices/fight_people (26 fighters) | COMBAT | 2 (SE, SW) | SW is its own render (0 of 34 cells a flip) |
| slices/settlement_people (25 townsfolk) | ANIMATION | 3 (S, SE, SW) | |
| the alpha's MIRROR (the 112 rig's painted clothes, hair, face) | CHARACTER | 5 | W, SW, NW are E, SE, NE flipped |
| the demo's MIRROR (its copy) | CHARACTER | 5 | the same |
| the wildlife bank (eight street animals) | CHARACTER | 1 | one view, flipped for SW, W, NW |
| **slices/fight_beasts (the old dire wolf)** | **ANIMATION** | **1** | **SW is SE flipped in 36 of 36 cells** |

THE DEBT (rule 115(c): the old flat sprites stay in the game until each one's rig replacement passes the VOTE tab): the
five old sheets in the game, 24 facings owed, printed every run. The list only shrinks: a debt sheet that loses a facing
is red; one that reaches eight, or leaves the site, is printed so PLUMBER drops it; a new sheet not on the list is held
to eight.

THE ONE RED: the old dire wolf is not on the debt. Rule 107 named it; its rig replacement (the beast in eight,
animation-the-beast-in-eight-10-17) got his YES; and nothing in the game draws slices/fight_beasts (the fight, the
city, the alpha, the demo and the settlement screen read no beast sheet; only the VOTE page ANIMATION_FOUR_LEGS.html
loads it). ANIMATION re-bakes it from the rig or takes it off the site.

## Proven both ways

Planted (S1 to S9): the man's eight stills and a two-key clip pass; W saved as E flipped is caught; SW as SE flipped,
pasted 13 px over on a bigger canvas, is still caught; a still with no NW and a clip with no S are caught by name; a
clip whose NW first key is NE flipped is caught; a new beast sheet of SE and SW where SW is SE flipped counts one and
is red; three real rows count three, held by a debt of three, red against a debt of four; the same sheet under
slices/vote/ is not swept; the alpha's MIRROR table of three counts five, held by its debt, red off it.

On copies of the real files (M1 to M3): the wolf redone with its walk's SW key replaced by SE flipped and its N still
deleted, both named; the real fight people read 2 (and one row fewer would be red); the real old dire wolf reads one.

## Not swept, on purpose

- VOTE sheets (slices/vote/): their frames are cut from the rig folders above, and their before rows show the old thing
  on purpose (the beast in eight's row 8 is the old game wolf, SE only, beside the new one).
- The rig truck on the map (one picture cut from the truck's SW render, inline in the city file): the cargo only ever
  rolls one way; the truck's eight renders are in its rig folder and pass.
- Things that do not turn (COOK's cover pieces) are held anyway because the rig renders them in eight; they pass.

## For the lanes

- ANIMATION: gates/four_legs_gate.py lines 63 to 70 REQUIRE SW to be SE flipped pixel for pixel. That is rule 107
  backwards; the leg goes when the old wolf goes.
- ANIMATION: gates/the_beast_in_eight_gate.py --hyena is not in the suite (and animation-the-cave-hyena-10-18 has no
  registry row).
- COMBAT, ANIMATION, CHARACTER: your old sheets are on the debt by name; the rig's people and beasts replace them one by
  one as his VOTE passes them (rule 115c), and the debt line drops when they do.

## Run it

    python3 gates/the_eight_facings_gate.py
