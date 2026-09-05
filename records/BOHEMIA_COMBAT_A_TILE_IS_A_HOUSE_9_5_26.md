# V198 — A TILE IS A HOUSE (COMBAT lane, 9/5/26)

VAMILY job: **BB-A-TILE-IS-A-HOUSE**, first OPEN line in COMBAT's queue.

> "instead of each combat tile being the size a human maybe each combat tile is
> the same size as the house and a pistol is like a dagger compared to the range
> of battle brothers and a rifle can do two tiles." — Paolo 9/4, LOCKED
>
> "the size of the 'ground' changes but the player is the same size just what
> they 'walk' on is a more zoomed out city so it really feels like war is
> spilling in the streets." — same day

Law: `laws/BOHEMIA_ADDENDUM_BATTERIES_ARE_THE_MONEY_AND_A_TILE_IS_A_HOUSE_9_4_26.md`

---

## THE ACCEPTANCE TEST, WHICH THE ROW WROTE ITSELF

| the row's clause | measured |
|---|---|
| the dial exists | `TILE: A BODY / A HOUSE` + `TILE WIDTH`, COMBAT tab, DEMO SETTINGS |
| a pistol reaches one house | **1** (shotgun 1, smg 1) |
| a rifle two | **2** (sniper **3**, `[PENDING Paolo]`) |
| the seeded boards are unchanged at the old setting | **true**, 25 arenas fingerprinted man-by-man and rock-by-rock |

## THREE THINGS THIS JOB NEEDED WERE ALREADY BUILT

Finding them is most of why this is small instead of a rewrite.

- **The spawn band is already derived from range.** `SPAWN_NEAR`/`SPAWN_FAR` are
  *"multiples of YOUR max range"*, so compressing the guns compressed the
  approach with no second edit. **The board follows the weapon.**
- **A step is already one cell.** V162 deleted `PRESS_STEP`. *"A step is one
  beat, and a step is now one house"* needed **nothing** — it is true the moment
  the cell is a house.
- **The accuracy curve is already a ratio.** `rangeT` is
  `(d − blank) / (far − blank)`.

## AND `rangeMult()` IS THE WRONG DOOR

Its own comment calls it *"the ONE DOOR every reach in the game passes
through"*, so scale obviously belongs in it. **It does not.** `isDark()` is
literally `rangeMult() < 0.999`, so a house-scale board would have told the whole
game **it was night** — V98's dark, V191's LIGHT IT, the spotter's night band —
silently, with every check green. **That is the darkness door.** Scale got its
own; `isDark` still reads only the night term, and the gate checks both settings
report daylight.

## HOW IT SHIPS: `hd(n)`, AND ON THE OLD BOARD IT IS A DIVISION BY ONE

`tileK()` is 1 at body scale, so `hd(n) === n / 1 === n` **exactly, for every
double**. That is IEEE 754, not an argument, and it is why the old board cannot
move. The dial adds **no draw** to any seeded stream — the 8/27 lesson this job's
own row names: *a feature that costs a seeded stream one draw re-deals every
arena in the game, with no crash and every new check green.*

**The max is his ruling. The eff is derived** — carried across each gun's own
body-scale `eff/max` — and that is what keeps the curve honest. A house table
with `eff` picked by hand quietly bent it: measured, **a rifle at its own maximum
read 0.556 against the body board's 0.429** before that was fixed. Sampled at
matched fractions of reach the rifle is now identical at both settings:
`[0, 0, 0.1429, 0.2857, 0.4286]`.

*And it is where "shotgun and SMG sit between" actually lives:* on a board whose
only reaches are 1 and 2 there is no room between them **in tiles**, so the three
short guns separate by **reliability inside their one tile** — shotgun 0.56,
pistol 0.50, smg 0.67 of it — the same ordering the body board has.

**The blades came with the guns.** A knife at reach 1.8 while a pistol reaches 1
would **out-range the gun** and invert the whole ruling. Melee is mapped, not
divided: everything is adjacent (`1/1`), and the SPEAR — the one long-reach melee
body — is the one that reaches two.

## THE SPRITE DOES NOT SHRINK

**37.333 px at both settings.** The multiplier is on the **floor pitch**;
`bodyScale` is never touched. Pitch goes 12.18 → 65.33, a 5.4× widening, derived
from the two numbers already in the file rather than eyeballed: a body-scale tile
is `430 × 0.085 / 112 = 0.33` sprite widths — **the person is three times wider
than the tile he stands on**, which is exactly why bodies overlap on the old
board. His house tile is 1.75 sprite widths.

## `NO DAMAGE BEFORE THE DIAL`

`applyDamage` is 40, archetypes byte-identical (`32-48/0.72`, `14-26/0.55`), and
the body-scale `WEAPON_RANGE` table is not touched by one byte. **Only distances
move.**

---

## AND THE INSTRUMENT WAS WRONG TWICE, WHICH COST MORE THAN THE FEATURE

**1. The day is not in the seeded stream.** `pickDayPhase` is a bare
`Math.random`, so one build on one seed deals morning, dusk or night at random —
and night halves every range, which moves the whole spawn band. The first
board-comparison read *"the boards changed"* and **was reading that**. Proved by
fingerprinting one page twice and getting two answers. *This is a real gap in
V88's "one number reproduces one exact fight" promise, it is pre-existing, and it
is worth somebody's turn.*

**2. The play harness was biased between its own two arms, which is worse than
noisy.** It fired any charged ability before shooting. At house scale every verb
charges faster because everybody is adjacent, so the house arm spent its turns on
abilities and never shot — and it reported **70% of house fights STUCK**. **Four
separate "fixes" were chased before the instrument was suspected.** A second
harness that only shoots and walks reported **0 stuck fights out of 20**.

Those four changes are kept, and the honest reason is that each is a **category
error corrected**, not a number tuned to a measurement: `PRESS_STANDOFF` 3.2,
`SQ_LANE` 9.5, `MEDIC_REACH` 5.0, the occupancy shove of 2.5 and the rooftop
placement are all written in **body-tiles**, and a body-tile constant on a house
board is eight times too big whatever the harness says. *The number that sent me
hunting for them was an artifact; the changes are right on their own terms.*

**On a clean page both settings now read 100% cleared, 0% stuck, 30 boards each.**
In the gate's own environment the rate swings 20 points run to run, so the gate
**reports it and does not assert it** — the same call V195 made.

## GATES AT CLOSE

| gate | |
|---|---|
| `fight_moves_you_gate.js` | **160 pass / 0 fail** (was 155/0) |
| `combat_lab_gate.js` | **931 pass / 1 fail** (the red is another lane's, pre-existing) |
| `boss_ladder_gate.js` | 87 / 0 |
| `one_engine_gate.js` | 3 / 0 |
| `pages_publish_gate.js` | 18 / 0 |
| page errors | **0** |

**Twenty combat_lab anchors were re-pointed and one slice harness fixed twice.**
The claims are unchanged; the text moved because every distance is now read on
the board it is actually on. **The slice rule bit again**: a sliced function
called `hd()` and the harness's binding list did not have it, so the gate crashed
and it looked like a broken feature.

## WHAT COMES AFTER

1. **`BB-NERVE-ON`** is the next OPEN line and it is the right one: *"the mechanic
   that ends fights early is switched off"*. Everything about fight length lands
   there.
2. **Where a scoped rifle stops** is `[PENDING Paolo]` — it ships at 3 as an
   attempt.
3. **The ground tile art at house width** is ART's canvas under DIRECTION's card
   (`ART COMBAT-GROUND-TILES`); this ships the geometry, not the picture.
4. **Interiors as a combat verb** — *step onto a house tile and you go inside it*
   — is named in the law and is not built. `THE-INDOOR-FIGHT` is already a row.
5. **An arena seed does not reproduce the time of day.** Pre-existing, found here,
   and it weakens V88's promise for anybody pinning a board.
