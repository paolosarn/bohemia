# A HOLE IS NOT A WALL (8/20/26, WORLD lane)

> **The gap this closes** is gap 2 and gap 3 of
> `records/BOHEMIA_THE_FLOOR_CAN_KILL_YOU_8_18_26.md`: *"THE REAL LETHAL DROPS ARE MODELLED
> AS WALLS... you bump into them instead of falling in"* and *"ONE CODE, TWO THINGS."*

## THE WORLD HAD TWO ANSWERS AND NEEDED THREE

Until today every tile in the valley was one of two things: **something you stand on**, or
**something you bump into**. That is enough for a kerb and a wall, and it is exactly wrong
for the four most genuinely lethal pieces of ground in this world:

| tile | what it is |
|---|---|
| `quarry:7` bench lip / crest | the top of a cut face, loose rock along the edge |
| `gypsum:7` bench lip / crest | the same, in raw white gypsum |
| `intake:13` intake shaft / main | the shaft down to the tunnel |
| `reclaim:6` crusted pond centre | *"dried hard enough to walk on and not hard enough to trust"* |

All four were `kind:'structure'`, which **defaults SOLID**. So the game modelled the deepest
holes in the valley as walls you bounce off — the precise opposite of what they are.

**And it cost the whole feature, not just the tiles.** The hazard classifier admitted a tile
only if a body could STAND on it. His own KILLS clause is *"an enemy KNOCKED or CHARGING in
dies outright"* — a body that is knocked in is, by definition, somewhere it could not have
walked. So gating the lethal class on standability threw away exactly the tiles the lethal
class exists for. **All four matched the KILLS rule by name and all four were classified as
nothing.** The rule was right, the tiles were right, and the gate between them dropped them
in silence.

## THE THIRD STATE

Declared per tile as `void:true`, defined by what it does to a **body**:

- **solid — NO.** A hole cannot block anything. A body thrown at it goes in.
- **walkable — NO.** Pathing refuses it. Nothing walks into a shaft by choice.

Which is the shape of his own rule: **CONSENT is the test, not depth.** Walking in is not
something the game lets you do; being put in is, and that is the one that kills.

**DECLARED, NEVER DERIVED.** It would have been cheaper to say *"structure that does not
block IS a hole"* — measured, **zero** tiles in sixty-six legends used that encoding, so it
would have worked today with no edit anywhere. It is also a trap: the first author who
writes a knee-high wall as `structure + solid:false` silently digs a pit under it and
nothing would ever say so. A hole is a thing somebody **meant**, so it is written down.

## ONE CODE CANNOT CARRY TWO OCCUPANCIES

`gypsum:7` meant *"bench lip"* **and** *"dome shell"* — an edge you go over and a shotcrete
hemisphere you bump into, sharing one number. The tile could therefore be neither: the KILLS
rule had to veto `/dome shell/i` by name to stop a roof being lethal, and that veto also
threw away the lip. The dome is **code 15** now, 360 cells of it, and 7 is the lip alone. The
veto still exists and is finally free — it stops a roof being lethal and nothing else.

## MEASURED ON THE SURFACE HE WALKS

| | before | after |
|---|---|---|
| KILLS membership | 4 tiles / 3 districts | **8 tiles / 7 districts** |
| voids in the valley | 0 | **2,405 cells** (reclaim:6 ×1683, intake:13 ×355, quarry:7 ×207, gypsum:7 ×160) |
| voids behaving correctly | — | **2,405 of 2,405** |

Every one of those 2,405 is checked against **three** claims, not one, because they are three
different promises to three different consumers:

1. **it refuses a body** — pathing reads this
2. **it says out loud that it is a hole** — combat reads this; *a cell that refuses you
   without saying why is indistinguishable from a wall*, which is the bug this ends
3. **it is DRAWN darker than the rock it is cut from** — he reads this

Claim 3 exists because of the mountain on 8/18: every flag correct, every number green, and
927 cells rendering as brickwork. **The flags and the picture are two different claims and
only one of them is what he sees.** Both mutations bite: flip the void flag off and 2,405 of
2,405 stop agreeing; make the shade equal the palette colour and the drawing assertion goes
red.

## WHAT COMBAT GETS, AND WHAT IT DOES NOT

The fight-room payload's ground channel gains **`V`**, and `V` outranks `K` deliberately.
Both kill on forced entry, but a `K` is ground a body can walk onto and choose to stand on,
and a `V` cannot be pathed into at all and does not stop a body thrown at it. Conflated,
combat would either path somebody into a shaft or treat the shaft as a wall — the only two
ways to get this wrong. The legend rides in the payload, as always.

**What a knockback DOES here is COMBAT's ruling, not this lane's.** WORLD makes the room
legible and stops there.

## THE ART ASK, UNCHANGED AND NOW HALF-ANSWERED

A void draws on the **ground** channel at a darker value of its **own palette colour**, so a
hole in white gypsum still reads as gypsum and a hole in limestone still reads as limestone.
One material, two values. That is the 8/18 ART ask (*"a rim, a shadow line, a floor at a
different value"*) answered as far as a renderer can answer it. **The rim itself is pixels
and is still ART's.**

## AND TWO PATCH TOOLS THAT COULD NOT RE-RUN

`bohemia_city_fightroom_patch.py` and `bohemia_city_occupancy_patch.py` both began with
`if MARK in src: print('already applied'); exit(0)`. From the moment each first landed in a
commit its output **froze**: every later edit did nothing to the page while the tool reported
success. This is not hypothetical — the `V` character was added to the combat payload, the
tool was run, it said applied, and **it was not on the surface**. Both are reversible now,
and the fight-room tool also cuts the legacy unmarked block, because cutting only the marked
form left the old copy in place and produced **two `function cityFightRoom` definitions in
one file**, with the browser running whichever came last.

---
**Mechanism:** `engine/bohemia_district_kit.js` (`tileLayer` → `void`) ·
`engine/bohemia_hazard.js` (`enterable`, `isVoid`) · **Content:**
`engine/bohemia_utility.js` (4 legends + the gypsum split) · **On the surface:**
`tools/bohemia_city_void_patch.py` · **Gates:** `gates/hazard_gate.js` (74) +
`gates/occupancy_gate.js` (16) · **In a tab:** RUN, and the picture is `the-hole` in the
LOOK tab.
