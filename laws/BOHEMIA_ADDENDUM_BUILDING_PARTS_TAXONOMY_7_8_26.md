# BOHEMIA — BUILDING PARTS TAXONOMY (7/8/26)

## Locked context
- Wasteland packs are DIALECT REFERENCE only, never city ship art.
- City = top-down grid districts. Buildings BUILT by Claude in Paolo's camera.
- Architecture: pack teaches part dialects -> Paolo crowns parts per act ->
  factory assembles grid buildings from crowned parts.
- THREE-VERSION LAW: every part exists 3x in code, one crown per act.
  `part_a1 / part_a2 / part_a3`. Act 1 = founding/ruined/salvage,
  Act 2 = recovering, Act 3 = modern rebuild. Crowned independently.
- Tier engine already resolves which era shows (act ceiling x economy).

## COARSE parts list (LOCKED grain 7/8/26 — crown ease over granularity)
12 crowns. Each line = one part type = 3 code entries (a1/a2/a3).
Fiddly detail merged so Paolo points at ~12 things, not 24.

### Structure (the box)
- base    — foundation/footprint edge where building meets ground
- wall    — main vertical face (corner handled as wall variant, not its own crown)
- roof    — top cap + edge/overhang shadow, seen from 3/4 above

### Openings
- door    — main entrance + its frame (one crown)
- window  — glazed opening + broken/boarded variant (one crown)
- garage  — big roll/bay door (industrial, casino service)

### Skin (merged detail)
- trim    — banding + material breaks + awning/canopy (one crown)
- sign    — signage plate + neon lit element (one crown, blank; faction paints it)
- grime   — rust + scorch + stain wear layer (one crown, whole wear language)
- utility — vents + pipes + conduit/wiring runs (one crown)

### Ground contact (the slot skirt)
- skirt   — stoop/threshold + curb edge (one crown)
- debris  — rubble/junk pile against the wall (Act 1 heavy)

## If even 12 is too many
Fallback ultra-coarse (5 crowns): shell(base+wall+roof),
opening(door+window+garage), detail(trim+sign+utility),
wear(grime), skirt(skirt+debris). [PENDING Paolo, only if 12 feels like too much]

## Assembly note
Factory picks act tier -> pulls matching-era parts -> assembles per
building-type recipe (casino, house, mall, datafort...). Same crowned
parts build every district type; recipe changes footprint + which parts + count.
Building inherits 3 eras free because every part has 3.

## STATUS
- Taxonomy: [PENDING Paolo cut/add]
- Crowning: not started, waits on final part list
- Factory: blocked on crowned parts

## CROWN COUNT (LOCKED 7/8/26)
Paolo crowns ANY number per part per act — 1 or 10, his call, no rule.
Factory adapts: 1 crown = that's the dialect; N crowns = factory reads all
N as the language and generates from the whole set. Paolo never picks a
"right number", he taps what looks right, factory deals with it.
- 1 crowned    -> single-exemplar dialect
- N crowned    -> multi-exemplar dialect (factory infers the shared language)
Never blocks on count. Crowning is pure tap, zero ceremony.
