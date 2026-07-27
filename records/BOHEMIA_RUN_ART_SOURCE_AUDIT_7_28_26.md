# BOHEMIA — WHAT THE RUN IS ACTUALLY MADE OF (measured, 7/28/26)

> "walls are there now doing good im happy it still looks like shit so much of
>  the game but whatever"

The walls are settled (records/BOHEMIA_SUBURB_BORDER_WALL_VERDICT_7_28_26.txt).
This is the answer to the other half, and it is not an opinion — it is a count.

METHOD: patch `drawImage` before the run boots, tag every image object by the
bank it came from, draw real frames inside the house and out on the block, and
count who drew what. Same instrument that found the resample bugs. It reports
what the game DID, not what the source looks like it might do.

---

## THE COUNT

**OUT ON THE BLOCK — 330 draws**

| share | draws | source |
|---|---|---|
| **83%** | 273 | **THE CBB TARGET TILESET** — the 42 tiles from the target screen |
| 17% | 57 | his 13 suburb border walls (approved 7/28, live today) |

**INSIDE YOUR HOUSE — 288 draws**

| share | draws | source |
|---|---|---|
| 63% | 180 | the interior pool (Great Sweep UP verdicts) |
| 35% | 102 | THE CBB TARGET TILESET |
| 2% | 6 | untagged |

---

## WHAT THAT MEANS, PLAINLY

**Eighty-three percent of what he walks through is the CBB tileset.** CBB is his
own verdict on the target screen — *could be better*. He never said that art was
good; he said it was good enough to unfreeze production
(records/BOHEMIA_TARGET_SCREEN_VERDICT_7_26_26.txt). Then the entire walked world
got built out of it. "it still looks like shit so much of the game" is an
accurate description of a world that is 83% could-be-better by area.

The 17% that is not CBB is the one thing he just said he was happy with.

## AND THE SAME BUG AS THE WALL, ONE LAYER UP

`ROOF_IMG`, `WALL_IMG` and `YARD_IMG` — his **thirty house skins, all thumbed UP
on 7/21** (records/BOHEMIA_HOUSE_SKIN_VERDICT_7_21_26.txt) — appear **exactly
once each** in the built run: their own definition. They are decoded into memory
on load and **never drawn. Not one pixel, not one frame.**

The houses in the run are built from the CBB tileset's building stack
(`wall_base`, `wall_end_l`, `wall_under_eave`, `roof_slope`, `garage_top`…),
which is exactly where `wall_base` came from when it was also being used as the
suburb border wall.

The builder even *checks the banks are present* — `throw new Error('the lifted
art block is missing one of the approved banks')` — and nothing anywhere checks
they are USED. Present and unused passed every gate in the repo.

So: his 13 border walls were loaded-and-unused until today. His 30 house skins
are loaded-and-unused right now. That is one bug class, twice, and it is the
single biggest reason the game does not look like the art he has approved.

---

## WHY THIS IS NOT A FIX I MADE TONIGHT

Swapping the house skins in is **not** the same size of job as the wall was. The
wall is one flat tile per cell. The houses go through a designed PROJECTION — the
building stack picks a different tile for the base course, the eave shadow, the
left corner, the right corner and the garage mouth, so a house reads as a solid
mass seen from the south rather than a rectangle of texture
(records/BOHEMIA_RUN_BUILDING_STACK_7_27_26.md). His house skins are flat 44x44
wall/roof/yard textures with no corner or eave variants.

Dropping them in wholesale would give him back his materials and **take away the
massing** — and he has just, for the first time today, said something looks good.
Making the houses flat again to win a palette argument is a bad trade to make on
his behalf at 3am. That is a director's call.

## THE THREE WAYS IT COULD GO — his pick, not mine

1. **SKIN THE STACK.** Keep the projection exactly as it is and re-tint/re-face
   only the flat parts (base course, mid wall, roof field) from his approved
   skins, leaving the corner, eave and garage-mouth tiles alone. Keeps the
   massing, gets ~70% of his materials in. Most work, least risk.
2. **HIS SKINS, FLAT.** Houses become his approved roof/wall/yard textures with
   no stack. Fastest, and the massing goes away.
3. **LEAVE THE HOUSES, FIX THE GROUND.** The block's ground — road, concrete,
   yard, walk, kerb, dirt — is also CBB tileset and is the largest single area on
   screen. Approved ground art exists (terrain picks, yard skins). Nothing about
   the buildings changes.

Nothing is being cooked for any of these. Every one of them is his own approved
art finally being drawn.
