# A LEGEND COUNT IS NOT A BOARD

WORLD lane (chat 02), 10/9/26. Row `[ground effects]`.

---

## 0. THE ROW

Rule 59 (Paolo 10/1): *"every floor tile from Battle Brothers needs a proper
translation for our game... how it impacts your accuracy or your defence or the
positioning, how many action points it costs to move through."* WORLD owns the
GROUND half, COMBAT owns what the fight does with it.

---

## 1. **RULE 12: THE NUMBER THIS ROW WAS GOING TO BUILD ON IS A VOCABULARY COUNT**

`[the valley's grounds]` (10/9, mine, last round but one) measures how open a
ground is by counting its kits' **legend**: how many of the distinct tile kinds a
district declares are open rather than built.

That is a count of **what a board can contain**. It is not **how much of a board
is that thing**.

Re-measured this round on what the kits actually **draw** -- every live ground,
every district kit that can generate, five seeds each, **4.1 million cells**:

| ground | the legend says blocked | the board really is |
|---|---|---|
| open_desert | 50% | **1.5%** |
| hills | 50% | **95.8%** |
| golf_and_park | 46% | 10.7% |
| airport | 75% | 24.5% |
| the_strip | 50% | 34.5% |

**The legend says every ground in the valley is 43% to 57% blocked, a 1.33x
spread. The board says 1.5% to 95.8%, a 64x spread.** The desert fight and the
mountain fight are the two most different fights in this game and the legend
called them the same place.

**Both ends check out against the real world, which is how I know the drawn number
is the honest one and not a second bug.** The mountain kit's own legend reads
bedrock face, ridge crest, cliff band, all `solid: true`, with ravine floor and
talus between them: a mountain block really is mostly cliff. The desert kit is
ninety-seven per cent open ground. Neither of those is a defect. The 50/50 the
legend reported for both of them was.

---

## 2. **AND THE TRAVEL SPEEDS I SHIPPED ARE NOT WRONG, WHICH I CHECKED BEFORE WRITING ANY OF THE ABOVE**

The obvious next sentence is "so last round's speeds are broken too." They are
not, and saying so would have been the easy, wrong, dramatic version.

Travel uses openness as a **rank**, re-anchored on his own ruled dirt speed. A
rank survives a biased count. Re-deriving all nine derived speeds off the drawn
shares moves the **worst** of them by 0.15 and most by under 0.05, and his four
RULED speeds are untouched by construction.

**An absolute does not survive it, and a fight needs the absolute.** "How much of
this board is cover" is the whole of Battle Brothers' formation game. That is the
only honest reason to measure the same thing twice, and it is why this file does
not reuse the number next door.

---

## 3. **ONLY ONE ROW OF BATTLE BROTHERS' TERRAIN TABLE CAN FIRE ON OUR BOARDS**

The school page (`records/BOHEMIA_BATTLE_BROTHERS_SCHOOL_EVERY_FLOOR_TILE_AND_ITS_TRANSLATION_10_1_26.md`)
rules nine rows. Measured against every tile kind the valley's kits really draw:

| Battle Brothers row | can it fire here |
|---|---|
| **Obstacles** (impassable, block sight, cover) | **yes, on all thirteen** |
| **The door** (ours: a house is cover and a wall, the door is the way in) | yes, on nine of thirteen |
| Night (-2 vision, -30% ranged) | not a tile; the board carries it |
| **Swamp / murky water** (4 AP, melee-defence malus) | **NO. The valley is dry.** |
| **Rough ground / forest floor** (3 AP) | **NO. No kit draws a rough standable cell.** |
| **Height** (+1 AP a level, +10%/-10%, +1 reach) | **UNREAD. No kit records a level.** |

**The district literally named `water` contains no water.** Six kinds of dry
ground, two drained basins, a dead car, a dead tree and a prop. Zero wet cells on
any ground, re-counted by the gate every run over all 4.1 million.

The only wet water in the game at all is in the landmarks module: the reservoir,
the tailrace, Las Vegas Creek. That module is not a district kit, so **no fight
board can ever be cut from it**, and all three are marked `void` anyway, which
makes them the CLIFFS row and never the SWAMP row.

**That is right for the world, not a gap to patch.** The dollar died and the water
went with it. The school page's murky-water skins -- "a flooded underpass, a
casino fountain, the wash after rain, a pool with water in it" -- were written in
the hopeful tense. What the kits draw is drained pools.

**So the honest statement of this row is: our ground changes a fight by how much
of it you cannot stand on, and nothing else, and that single number runs 1.5% to
95.8%.**

**EVERYTHING COSTS ONE is untouched and is not a hole.** Battle Brothers' 2/3/4 AP
ladder collapses to one step by his 8/15 ruling. The gap is only that nothing in
the data would tell a rubble field from a parking lot if he ever wanted the second
beat back. The mountain's own legend calls its talus **"slow going"** in its
description, and nothing reads a description.

---

## 4. THE HOLES, NAMED RATHER THAN FILLED WITH A ZERO

**Height answers UNREAD.** A zero would read as *"this ground is flat"*, and the
mountain is 96% cliff. COMBAT's high ground is a feature the board generator
places, not a fact the ground carries.

**Four tile kinds the valley draws have no ruled row**, each named with what it is
and why it has no number: a drained pool (the opposite of murky water; you climb
into it, and nothing measures how deep), a solar array and playground equipment
(Battle Brothers has no half-height obstacle), and **overhead**, which on the
freeway is 14% of the drawn cells, so it is not a rounding error: Battle Brothers
has nothing over your head that you are not standing on.

Inventing an effect for any of them would be inventing a dial, and every felt
number is TUNING's (rule 36).

---

## 5. THE COOK, AND IT ARGUED WITH ITS OWN NUMBERS UNTIL I LOOKED AT IT

`tools/bohemia_ground_effects_cook_10_9_26.js` -> `slices/vote/WORLD_GROUND_EFFECTS.png`.
VOTE tab, `world-ground-effects-10-9`.

Thirteen real fight boards, one per ground, each cut from a kit that ground is
really made of, coloured only by what the ground changes: ground you can stand on,
cover, and the door.

**The first cut took the top-left corner of each block, and a corner is not a
sample.** The suburb panel read about 48% solid against the suburb's measured 33%:
the sheet disagreed with the numbers it exists to show. Fixed by scaling the whole
block instead of cropping it.

**And then the check that would have caught it was added, self-calibrating.** A
panel's cover must fall between the lowest and highest of its own ground's kits --
a measured envelope, not a tolerance I pick, because PLUMBER's 9/16 round is clear
that a clamp nobody can defend is how a gate gets a number nobody can defend. The
Strip's panel is a resort at 50% against the Strip's 34% average, and that is a
true fact about resorts rather than an error, which is exactly what an envelope
allows and a mean does not. Run against the old corner-crop, that check refuses
**six of thirteen panels**.

**AH-01, and the wrong thing is which one is full.** A contact sheet of terrain
samples is the ordinary part, the thing any strategy game's manual prints. The
emptiest board in the valley is the open desert and the fullest is the mountain,
and between them sit eleven boards of a city, every one about a third blocked by
things people built and left. **The ground that is hardest to cross is the one
nobody ever touched.**

---

## 6. ROUTED

- **COMBAT** -- the fight half of rule 59 is theirs. The ground hands over one
  number per board and names the rows that can fire on it. The HEIGHT row is
  theirs to place, and the board generator is where a rubble field could get its
  second beat back.
- **TUNING** -- every value carries `tuned:false` with its source.
- **MODS** -- `records/target/BOHEMIA_GROUND_EFFECTS.json`.
- **WHOEVER OWNS THE OLD ONE-EFFECT GATE** -- `gates/one_terrain_effect_gate.js`
  enforces Paolo's 9/24 "ONE terrain effect in the whole fight, nothing else on a
  tile changes a number", which **rule 59 (10/1) amends by name**. It is **not
  registered in the suite**, so it is enforcing a superseded ruling and nobody is
  running it. Named, not touched: it is COMBAT's file.
- **`[the roll]`** -- 28 of the 78 district names across the live grounds have no
  kit that can draw a block, so a fight cut from one of those cells has nothing to
  build a board from.

---

`[bb ground]` **Battle Brothers' terrain table is nine rows and we can fire one of
them, and the honest answer is to say so rather than to fake the other eight.** BB
earns its swamp, its forest and its hills because it is set in a green temperate
world where all three are a day's walk apart. **OUR TWIST** (rule 39b): ours is a
dead city in a desert, so the entire movement-cost half of that table is empty --
there is no mud, no undergrowth, and not one wet cell in the valley -- and what is
left is cover, which runs from a board that is 1.5% blocked to one that is 95.8%.
BB's terrain changes how fast you cross a tile; **ours changes whether there is
anywhere to hide**, which is the half that actually decides a formation fight. The
temptation was to invent a rough-ground skin so the table looked full. A table with
eight rows that never fire is a table that lies, and a game that only has cover had
better make cover mean everything.
