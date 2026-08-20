# THE FLOOR INDOORS (8/20/26, WORLD lane)

> **Paolo 8/17, LOCKED: "THE WORLD HAS TO FEEL MORE ALIVE."** The RF4 lift §5 routes that to
> WORLD and closes with the brief: *a room only feels alive if the floor can do something to
> you.*

## THE FLOOR COULD DO SOMETHING TO YOU EVERYWHERE EXCEPT WHERE THE FIGHTS ARE

Since 8/18 this lane has read 31 hazard tiles out of 22 district legends, and this morning
gave four of them a third occupancy state. **All of it outdoors.** Meanwhile `__CITY_FIGHT__`
starts every fight in this game by walking through a door.

**Measured before any of this was written:** an interior cell carried `g, room, door, role,
furn` and nothing else. **Zero cells in any interior in the game had ever carried terrain.**
So `cityFightRoom`'s ground channel was 252 dots for a 21×12 house, in every room, in every
fight. The one system built to make a room feel alive was switched off in every room a fight
happens in.

And `fightroom_gate.js` was green through all of it, because it checked the channel's
**length** and never its **content** — the same shape as every other finding this week: *a
gate that checks its own side of a seam nobody is standing on stays green through anything.*

## IT INVENTED NO VOCABULARY, WHICH IS THE WHOLE DESIGN

The three materials are named so the **existing** hazard rules classify them, with no new
rule and no edit to the classifier. Checked before a line of the module was written:

| material | classifies as | by the rule that already read |
|---|---|---|
| `standing water` | **DISABLES** | a pumpstation gland letting go |
| `fallen ceiling rubble` | **AMPLIFIES** | freeway rubble across the lanes |
| `lift shaft` | **KILLS**, and a **VOID** | the intake shaft down to the tunnel |

Had it needed a new rule it would have been a new vocabulary wearing the old one's clothes.
It needed none — because these are the same three things a dead building has that a dead
quarry has: **liquid you can walk into, footing you cannot set, and a hole.**

## WHERE IT GOES IS DERIVED FROM THE BUILDING, NOT FROM A RATE

An interior has no authored hazard to read, so the temptation is to invent a frequency and
call it design. Instead every placement answers a question the plan can already answer:

- **A ceiling comes down where it is SPANNING.** A cell two or more tiles from every wall of
  its room has no wall near enough to be carrying the deck above it. That is the unsupported
  core, and it is a fact about the room's shape. **No room-list at all** — the first cut used
  a hand-written list of big-room roles (atrium, concourse, hall) and that was the same answer
  arrived at by naming things instead of measuring them, and it missed every large room whose
  role happened not to be on the list.
- **A lift shaft goes in a service room of a building that would have a lift.**

**The proof that the derivation is real is that nobody typed the numbers:**

| zone | share of floor that is hazard |
|---|---|
| residential | 2.2% |
| office | 2.1% |
| retail | 3.4% |
| landmark | 4.8% |
| **warehouse** | **7.7%** |

A warehouse ends up three times more damaged than a house because its ceiling spans further.
That gradient is an output, not a setting, and the gate asserts the ordering rather than the
values.

## THE VALLEY IS BONE DRY, AND FINDING THAT OUT WAS THE MOST USEFUL THING HERE

The first cut placed standing water in every bath, kitchen, breakroom and locker — that is
where the plumbing is, and the derivation was sound. Then I read what it produced: **34 tiles
of standing water in a HOUSE**, every seed. A bathroom the size of a swimming pool.

**The number was the small problem.** The big one is that this is Las Vegas and it is ten
years later: the driest major city in the United States, roughly 100 mm of rain a year, summer
humidity in single digits. Water in an unroofed building here does not sit for a decade. It is
gone in a season, and what is left is **the tide line and the stain, not the pool.**

So the material stays **defined** — the day he wants a flooded plant room it is one entry in
`SPREAD`, not a system — and it is **placed nowhere**, with the reason written into the module
rather than deleted, so the next person does not re-derive puddles from "but that is where the
plumbing is". **DISABLES therefore has no indoor presence, and saying so beats flooding the
valley to fill a column.**

## FOUR REFUSALS, ALL FOUR MUTATION-CONFIRMED

Almost every assertion in the gate is a refusal, because the easy way to make this look done
is to sprinkle hazard everywhere and watch the counts rise — a version that passes a count
check and ruins every room.

1. never in a doorway or beside one — a sealed room is a bug
2. never under furniture — a hole under a filing cabinet is silly
3. rubble only in the unsupported core — a cupboard does not get a collapsed ceiling
4. no shaft within 3 tiles of a door, and **the floor stays one piece**

## TWO THINGS I GOT WRONG, BOTH CAUGHT BY MEASURING

**MOST OF THIS GROUND DOES NOT BLOCK ANYTHING.** The connectivity guard was copied verbatim
from the furniture module: flood-fill the room, treat every stamped cell as an obstacle. It
looked right and was wrong twice over — **22 of 64 plates came back with the floor cut in
two, while the same plates furnished alone came back 0 of 64.** Rubble is AMPLIFIES and water
is DISABLES: ground-layer, not solid, **you walk on both.** That is what those classes *are*.
Counting them as obstacles invented a connectivity problem that did not exist. And the one
thing that *does* block — a void — is a hole in the **plate**, not the room, so a room-local
check cannot see the corridor it just sealed. **My gate had the identical error**, which is
why it reported the failure at all.

**A GATE THAT ASKS THE THING IT IS JUDGING WHAT THE ANSWER SHOULD BE IS NOT A GATE.** The
lift rule read `G.NO_LIFT[z]` — the target's own table as its own ruler — so emptying
`NO_LIFT` put lifts in houses *and* switched off the test, in one edit. Mutation-tested and
confirmed **green through the bug**. Fixed by naming the zones. And the fix exposed a second
layer: the mutation still passed, because a residential plan has no `service` room at all and
could never get a lift however the rule was written. The zone the rule actually protects is
`default` — the one zone the test list left out. **A refusal tested only where it cannot fire
is not tested.**

## THE SEAM, MEASURED ON A REAL ROOM

`fightroom_gate.js` now asserts the ground channel is **not all dots**, on a real room the
player walked into through a real door on the real page: **4 of 252 cells carrying `A`**,
where it was 252 dots. The `V` character added this morning is already in the legend, so a
lift shaft in a landmark arrives as a hole combat can tell from a wall.

---
**Spec + generator:** `engine/bohemia_interior_ground.js` · **On the surface:**
`tools/bohemia_city_interior_ground_patch.py` · **Gate:** `gates/interior_ground_gate.js`
(21 checks, four mutations confirmed) + `gates/fightroom_gate.js` (13) · **In a tab:** RUN —
walk into any building. **The ART ask is unchanged** and is in
`records/BOHEMIA_THE_FLOOR_CAN_KILL_YOU_8_18_26.md`: loose ground that reads as loose, and a
drop that reads as a drop.
