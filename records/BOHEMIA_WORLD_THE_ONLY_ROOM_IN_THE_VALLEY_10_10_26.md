# THE ONLY ROOM IN THE VALLEY, AND NOTHING CAN REACH IT

WORLD lane (chat 02), 10/10/26. Row `[the apron, the compound and the civic interior]`.

---

## 0. THE ROW, AND WHO WROTE IT

> **[the apron, the compound and the civic interior]** 24 of the 78 districts have
> no board of their own and they are three families, so **three blocks are
> missing**. COMBAT cuts the blocks; WORLD owns what is ON that ground before a
> fight starts.

Mine, written last round under rule 74 off this lane's own measurement. The count
is right. **"Three blocks are missing" is half right, and the better half is the
correction.**

---

## 1. **RULE 12: THIRTEEN OF THE TWENTY-FOUR ALREADY HAVE A KIT, SO TWO OF THE THREE WERE READ, NOT INVENTED**

| | kits measured | floor | cover | door |
|---|---|---|---|---|
| **AN APRON** | speedway, stadium, ballpark, terminal | **72.8%** | 18.5% | 0.56% |
| **A COMPOUND** | battery, substation, watertreat | 71.3% | 27.6% | **0.031%** |
| A CIVIC INTERIOR | cityhall, courthouse, jail, policestation, firestation, medical | 61.2% | 33.3% | 0.385% |

**The apron's pieces, from the kits' own legends:** grandstand, catch fence, pit
road, garage row, light tower, tunnel mouth, racing surface, infield, scoreboard,
dead race car, concourse, facade, gate.

**The compound's:** perimeter fence, gate, transformer, switchgear, busbar, cable
trench, clarifier wall, aeration basin, pipe gallery, pole light, control
building, battery container, hazard marking, gravel yard.

Both are the row's own words handed back, counted rather than asserted. The apron
**is** open paved ground with a long shed and a fence. The compound **is** a wall
with one gate: **a door share of 0.031% is about one cell in three thousand.**
There is one way in and everybody inside knows where it is.

---

## 2. **THE CIVIC INTERIOR BREAKS, AND NOT BECAUSE THE KITS ARE THIN**

They are not thin. The six civic kits draw at **61.2% floor**. The problem is that
**every one of those cells is outside.**

Measured across all fifty kits that draw: **of 813 named pieces, 256 are things
you can stand on, and not one of them is the floor of a room.** The closest the
valley has is the covered loop under a stadium's stands, twice.

- the city hall is `city hall [building]` — a solid block
- the jail is `building (cell block/admin) [building]` with a `cell detail
  [structure]` stuck on its face — both impassable
- what the civic kits actually draw is the plaza, the forecourt, the curtain wall
  glazing, the podium, the entry pier, the roof edge and the council chamber roof

**There is a doorway and nothing behind it.**

That matters past this row. **A COMBAT TILE IS A HOUSE** (Paolo 9/4) and the
**INTERIOR-MATCHES-EXTERIOR LAW** both assume an inside the city has never drawn,
and `bohemia_boardterrain.js` already files `casino_floor` as an `INTERIOR` that is
off the map.

---

## 3. **AND THEN THE ONE THAT MAKES THE ROUND: AN INTERIOR ALREADY EXISTS AND NOTHING CAN ASK FOR IT**

The fight deals from a block library built out of `slices/fight_ground/fight_ground.json`.
Build it the way the fight builds it and cross it against the `board_mix` families
and `nfKind`:

- **18** block kinds in the library
- **15** named by a family
- **12** reachable from `nfKind`

| | blocks |
|---|---|
| **in no family AND unreachable** — can never appear in any fight, ever | **casino, freewayo, scrubroad** |
| in a family but no district leads with them — only ever the shuffled second or third block | lots, main, works |

**`casino` is 294 flat cells, 6 of height and 201 cover pieces: pillars, slot
banks and tables.** It is **the only interior in the game.** COMBAT TWO cut it and
the sweep recorded it shipping. The map cannot ask for it and the mix will never
roll it, so **it has never once been dealt into a fight.**

So the row's sentence corrects to: **two blocks are missing and the valley has the
material for both; the third is built and disconnected.** A civic interior is not
a thing nobody has drawn. It is **one wire away from the thing somebody already
drew.**

---

## 4. THE GATE

`gates/three_blocks_gate.js`, 22/0, registered as THREE BLOCKS.

Every share is re-counted off the family's own kits on each run (worst drift
0.0004). Every piece quoted must be a real legend entry of one of that family's
kits. The whole-city interior count is remade from all 50 kits. The unreachable
list is **rebuilt from the library** and held as a **ratchet that may only
shrink**, so the day somebody wires the casino in, the gate goes red and this
record is stale rather than the code being quietly right. The casino is described
from the library, never from memory. And a WORLD file may not contain a faction
name at all: who holds a compound is handed to `valleyground.poolOf`.

Mutation-proved three ways: give the civic interior material it does not have →
RED; quote a piece the valley does not draw (`control tower`) → RED naming it;
hide the casino from the unreachable list → RED.

---

## 5. THE COOK

`tools/bohemia_three_blocks_cook_10_10_26.js` -> `slices/vote/WORLD_THE_THREE_BLOCKS.png`.
VOTE tab, `world-the-three-blocks-10-10`.

Four panels. The first three are real blocks the valley's own kits drew, picked by
seed and not by eye: **the stadium bowl** (the apron, 20.2% solid), **the water
treatment plant with its clarifiers** (the compound, 26.3%), and **the hospital**
(the civic one, 42.1% solid — a slab). The fourth is **the casino floor**, drawn
from the fight's own library with its 201 slot banks where COMBAT TWO put them.

The cook refuses to draw a civic panel that is not more solid than the apron,
because the whole point of the third panel is that the building is a wall.

**AH-01, and the wrong thing is which one is full.** Four terrain samples in a row
is the ordinary part, the thing any level editor prints. **The courthouse, the
jail and the city hall are solid to the touch, and the only room anybody ever
built in this valley is a room with slot machines in it, and nothing can reach
it.**

---

## 6. ROUTED

- **COMBAT [board generator]** — the whole fix, and it is now three small things
  rather than three blocks. **Wire the casino in**: it is built, it is an
  interior, and it is the civic answer. **Cut the apron and the compound** from
  the piece lists above, which are the valley's own material. **Decide `lots`,
  `main`, `works`** — in a family, never the lead. **And `freewayo` and
  `scrubroad`** reach nothing at all.
- **COMBAT TWO** — if the casino was meant to be reachable, nothing says so; it
  shipped into a library with no wire to the map.
- **Whoever owns the interior question** — a civic interior needs a standable
  floor cell, and the valley has none. That is a kit question before it is a
  board question.
- **TUNING** — nothing felt here. Every number is a count or a share.
- **MODS** — `records/target/BOHEMIA_THREE_BLOCKS.json`.

---

`[bb blocks]` **Battle Brothers never ships a battlefield its own world cannot
ask for, and the reason is that it has no library to get out of step with.** Its
tactical maps are generated per fight straight from the world tile you stand on:
there is no shelf of boards sitting beside the map, so nothing can be built and
left unreachable. **OUR TWIST** (rule 39b): we keep the shelf, because a
hand-authored board like the casino floor — 201 slot machines in rows — is a
better fight than anything a generator will produce from a tileset, and BB's own
fights are the flattest thing about it. The price is that **a shelf needs an
inventory**, and we did not have one until this round: three blocks on it have
never been dealt, and one of them is the only indoor fight in the game. Keep the
hand-made boards, and make the machine count the shelf every run.
