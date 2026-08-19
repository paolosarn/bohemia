# THE WALKED SURFACE IGNORED THE OCCUPANCY MODEL FOR EVERY PROP IN THE VALLEY
### (8/18/26, WORLD lane)

**Measured on the real page, 40 real district cells in the real valley:**

| | walk-through prop cells agreeing with the model |
|---|---|
| **before** | **0 of 4,327** |
| **after** | **4,327 of 4,327** |

## WHAT THE MODEL SAYS, IN ITS OWN WORDS

`engine/bohemia_district_kit.js` has modelled tile occupancy per tile since July and
documents it in the file:

> `prop` — an object sitting on the ground (cart, pump, tree, furniture); **solid per its size**
> `solid` = does the tile block a body's cell (occupancy) at grade

Its **default** for `prop` and `tree-dead` is `solid: true`. So every `solid:false` in a
legend is a district author *deliberately* declaring **a body may stand here** — you push
through creosote, you walk over rubble drift, you step past a survey stake. There were
**48 such declarations across 41 districts**, written into dossiers, generated into
`records/tilespec/`, and held by `tilespec_gate` and `district_kit_gate`.

## WHAT THE GAME DID

```js
if (tl.layer === 'prop') { c.s = pal; c.walk = false; return c; }
```

One line in `realizeCell`. No mention of `tl.solid`. **Every prop in the world, blocked** —
all 48 deliberate declarations discarded one line before they reached him.

## WHY NO GATE COULD SEE IT

`district_kit_gate` holds the **model**. `walkable_gate` holds land **statistics**.
`tilespec_gate` holds the **dossier**. Every one of them was green, because each was
checking its own side of a seam **nobody was standing on**.

A contradiction between two live systems is a bug and never an interpretation choice — but
it can only *be* a bug once something compares them. Nothing did.

## AND I FOUND IT BY BEING WRONG THIS MORNING

Building the hazard classifier, the first standability rule was the kit's own answer: not
solid, on a layer a body stands on. Six tiles passed it and came back `walk:false` when the
running page was asked — `storage:3 debris / tumbleweed` among them. I tightened the rule to
`layer === 'ground'` and wrote down the lesson:

> *A PROP IS AN OBJECT ON THE GROUND, NOT THE GROUND.*

**That was the wrong lesson, and the right one is worth more than the feature.** I had two
live systems contradicting each other and I believed the one in front of me instead of
asking which was lying. Verifying on the real surface is necessary and it is not sufficient:
the surface can be the broken half.

The rule is back to the kit's answer, and the hazard class grew:

| | before | after |
|---|---|---|
| hazard tiles | 19 | **26** |
| districts | 15 | **21** |
| AMPLIFIES | 7 tiles / 6 districts | **14 tiles / 12 districts** |

Which closes a gap **this same lane filed that morning** as a missing piece of the world:

> *"THE VALLEY HAS NO WALKABLE RUBBLE FIELD — every rubble/debris tile in six districts is a
> prop the walked surface blocks, so the most classic piece of unstable ground in any game
> cannot be stood on here."*

It was never missing. It was declared, authored, dossiered, and discarded.

## FIFTEEN DECLARATIONS WERE GENUINELY WRONG, AND THAT HALF IS WHY THE FIX IS SAFE

Honouring the flag immediately exposed tiles whose `solid:false` was a misdeclaration
rather than a design. **A trunk blocks.** Shipping the fix without these would have put the
player through tree trunks:

- twelve trees — `campus:3`, `chapel:3`, `cityhall:3`, `commercial:3`, `courthouse:3`,
  `downtown:3` (street tree), `farm:3` (windbreak), `golf:12`, `library:3`, `school:3`,
  `terminal:3`, `town:3`
- `swapmeet:12` map kiosk, `truckstop:13` dead landscaping planter

Corrected **in their own legends**, which is the right place: the tile is what was wrong,
not the reader. They behave exactly as they do today and are now honestly declared.

**One correction was reverted, and the revert is recorded because a silent one is
indistinguishable from an oversight.** `strip:7` / `strip_x:7` "planter" reads, in its own
act-1 material, *"a tree well cut into the promenade, the tree gone, the pit full of grit
and trash."* That is a recess at grade, not a mass, and it stays walk-through. Two reasons:
the description is explicit, and the Strip is another WORLD session's fresh ground
(`f812f41`, the same day).

## THE GATE

`gates/occupancy_gate.js` is a **comparison and nothing else**. It boots the real page,
walks real district cells, and asks both sides the same question about the same cell:

- the model — `K.tileLayer(legend[code]).solid`
- the game — `cellAt(gx, gy).walk`

It asserts nothing about which answer is right for any particular tile — that is the
district author's call and it lives in the legend. It only refuses to let the two disagree.

**Checked in both directions**, so "make everything walkable" is not a way to pass it. Both
mutations bite:

| mutation | result |
|---|---|
| revert the surface fix | 0 of 1,103 walk-through cells agree → **red** |
| make every prop walkable | 0 of 1,834 solid cells agree → **red** |

---
**Fix:** `tools/bohemia_city_occupancy_patch.py` · **Gate:** `gates/occupancy_gate.js`
(12 checks, two mutations confirmed) · **Consequence:**
`records/BOHEMIA_THE_FLOOR_CAN_KILL_YOU_8_18_26.md` regenerated at 26 tiles
