# WHAT IS IN THE ROOM (8/18/26, WORLD lane)

> **The RF4 lift, §6, quoting his synthesis:** *"if your combat loop requires retreat,
> your level generator has a **hard obligation** to guarantee retreat is possible... a
> cramped room deletes the entire core verb."*

This morning `gates/retreat_gate.js` measured that obligation and found a clean break.
This is the fix, and the timing was not luck: **`__CITY_FIGHT__` ("THE DOOR IS THE
FIGHT") landed on the walked surface while this was being built.** `inEnter` is now both
the way inside and the way into a fight. The room being furnished is the room the fight
happens in.

## THE NUMBER

| footprint | no-retreat plans (bare → furnished) | stranded floor cells |
|---|---|---|
| 6×6 | 54 → 35 | 864 → 377 |
| 8×8 | 54 → 34 | 1890 → 854 |
| 10×10 | 54 → 29 | 3294 → 1086 |
| 12×10 | 36 → 13 | 2664 → 736 |
| **16×14** | 6 → **0** | 918 → **0** |
| 20×16 and up | 0 → 0 | 0 → 0 |

**Stranded floor cells: 9,630 → 3,053, down 68%.**
**The break point: 320 tiles → 224 tiles, ratcheted so it may only come down.**

## THREE CLASSES, AND ONLY ONE OF THEM HIDES YOU

- **COVER** — chest-to-head and opaque: racking, lockers, a fridge, a wardrobe, a counter
  run, a reception desk. Blocks the body **and** the look. This is what turns a box into
  a room you can fight in.
- **LOW** — knee-to-waist: a bed, a sofa, a desk, a meeting table. Blocks the body,
  **not** the look. It shapes where you can walk and where you can be pushed, and it is
  honest about what it is: there is no crouch in this game, so a sofa cannot hide you and
  will not pretend to.
- **LOOSE** — a spilled drawer, scattered paper. Blocks nothing. A looted room is not an
  empty room, and nothing downstream may count litter as cover.

**The split is the whole design.** Calling a desk "cover" would make every office in the
game pass the retreat obligation while playing exactly as badly as before. A number that
improves while the game does not is worse than a number that stays red. The gate
mutation-tests that exact flip and it bites.

## THE FIX FOR A SHED IS NOT A WALL

A 6×6 plate is **4.5 metres square**. Partitioning it so a gate goes green is inventing
architecture that does not exist, and REALISM FIRST forbids it. So the smallest plates
are **improved and not claimed fixed** — 98 of 162 still strand somebody, and that number
stays in the gate output rather than being tuned away. A 4.5 m room with one shelf in it
still has sightlines. Saying so beats tuning density until the number goes green.

## THREE WAYS THIS COULD HAVE BEEN A LIE, ALL THREE MACHINE-HELD

1. **Furniture you can walk through.** `inPassable` refuses a `cover` or `low` cell. Every
   retreat number above assumes a racking run stops you; without this the gate stays green
   while the player strolls through it.
2. **Furniture across a doorway.** A door and the cell each side of it stay clear. An empty
   room is boring; a sealed one is a bug. Remove the guard and the gate reports **2,722
   violations**.
3. **Furniture that cuts a room in two.** A racking run across the middle of a stockroom
   strands the half without the door, and nothing else in the engine would ever notice.
   Flood-fill after every placement, take the piece back if the floor stopped being one
   piece. Remove the guard and **233 plates** come back split.

## THE REUSE CHECK ENDED IN A WARNING, NOT A SHOPPING LIST

Both interior banks were **opened, decoded and looked at** — rendered to PNG and viewed,
not read about:

- **`banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt`** — 31 furniture, 60 container, 80 clutter,
  50 debris at 48px. Its header claims *"every tile here carries a Paolo UP verdict from
  the Great Sweep."* What is actually in it: **banded oak barrels, burlap sacks, wooden
  crates, tavern benches, potion bottles and live flowering plants.** It is a generic
  fantasy asset pack. Nobody in a 2020s Las Vegas apartment owns a coopered barrel, and
  live greenery breaks the dead-world standing law outright.
- **`banks/BOHEMIA_DEMO_PROP_POOL_7_10_26.txt`** — 314 props. Its `container` family is
  **glowing sci-fi loot crates**. Its `cover` family (13, "Barricades and defenses") is
  the one genuinely usable set in either bank: concrete jersey barriers with yellow hazard
  stripes, sandbag stacks, a striped traffic barricade, steel plate. Real, and right for a
  room somebody fortified — and wrong for a bedroom.

**So nothing is wired from either.** Putting a coopered barrel in the one surface he plays,
because a bank existed and a law said reuse first, is how a build ends up looking like
somebody else's game. REUSE-FIRST asks what you opened and why nothing fit. That is why
nothing fit.

## WHAT DRAWS INSTEAD, AND THE ART ASK

A flat volume with a lit top and a darker front — the 45-degree read, and the same thing
this renderer already does when a tile bank is missing. **COVER rises into the cell above
it** the way the interior walls already do; **LOW does not.** So the two classes are told
apart by *shape* before any colour is parsed, which is the point.

**The ART ask is two forms, not twenty-five:**

1. **A CHEST-TO-HEAD MASS you cannot see over** — steel racking, a locker bank, a
   commercial fridge, a counter run. One form that reads as *this hides me*.
2. **A KNEE-TO-WAIST MASS you can see over** — a bed, a sofa, a desk, a table. One form
   that reads as *this does not*.

Both at the 45 DEGREE ART LAW, act-1 dead: stripped, shoved, tipped, the drawers out. The
25 piece ids already exist in `engine/bohemia_furnish.js` and can take variants later;
what is missing is the one visual difference between *cover* and *not cover*, readable at
interior zoom.

## SEPARATELY, AND NOT MINE — SOMETHING I SAW WHILE VERIFYING

Walking into a real house on the real surface to check the furniture draws, the interior
renders **fantasy dungeon floor and door tiles, including large live green flowering
vegetation**, inside a residential building in a valley that stopped watering things a
decade before act one opens. That is the same dead-world standing law the 7/22 prefab fix
enforced outdoors (`'g'/'t' used to paint live grass/tree green — a standing-law
violation`), failing indoors.

This is **already a live, owned story**: `__HOUSE_FLOORS__` (Paolo 8/6, *"Tile wood and
carpet bro ofc bro wtf"*) records that wood and carpet do not exist in anything he owns
across fifteen floor packs, and names his tile as a declared interim. **I did not touch
it** — ONE SYSTEM, ONE SESSION. Flagged here because the live-vegetation half is a
standing-law violation on the surface he plays, and the interim note does not mention it.

---
**Spec + generator:** `engine/bohemia_furnish.js` · **On the surface:**
`tools/bohemia_city_furnish_patch.py` · **Gate:** `gates/furnish_gate.js` (32 checks,
three mutations confirmed) · **The measurement it answers:**
`records/BOHEMIA_A_ROOM_YOU_CAN_BACK_OUT_OF_8_18_26.md`
