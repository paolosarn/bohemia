# THE TERRITORY LOOK CARD (DIRECTION, 9/6/26 — VAMILY [border card])
# What a held block, a border and a marked wall LOOK like, in pixel terms,
# so COOK [border marked] and UI [danger visible] cook to a card and never
# guess. Kept current by DIRECTION. Sits under the 9/5 who-holds ruling
# (records/BOHEMIA_RULING_WHO_HOLDS_WHAT_9_5_26.md), COLOUR IS TERRITORY
# (8/26), and the style card's accent rule (one saturated piece, >= 0.55).

## 0. THE ORDER OF CHANNELS: VALUE FIRST, COLOUR SECOND, RIM LAST
Territory must read in GREYSCALE. A phone in sunlight, a colour-blind
player, and the 8/15 outline principle all say the same thing: the shape
and value carry the message, colour confirms it. THE TEST THAT RULES EVERY
COOK UNDER THIS CARD: drain the frame to greyscale — if you cannot tell
held from deserted from disputed, the cook failed, whatever its colours.

## 1. THE HELD BLOCK (standing inside somebody's ground)
- HELD READS AS MAINTAINED. The value statement first: a held block is
  SWEPT — its ground keeps an even value field (patched, cleared lanes,
  drift pushed to the walls), where deserted ground keeps the full noise
  of the dead world. Order against entropy IS the ownership read, before
  any colour appears.
- COLOUR RIDES ON MARKS, NEVER ON GROUND. The holder's colour appears
  only on discrete marks (a tag, a banner, a painted kerb line, a door);
  colour-carrying pixels stay under 2% of any tile's area. A faction
  TINT WASHED over a block is banned — it is the checkerboard failure
  class wearing politics, and it erases the register the whole world is
  drawn in.
- THE NAME IS NOT A LIE (8/26): the holder's marks wear the holder's
  actual colour at saturation >= 0.55. Drab is not a colour; a Reds
  block marked in brown is unmarked.

## 2. THE BORDER (crossing between grounds)
- THE BORDER RUNS ON A LANDMARK (the ruling, clause 3): a big road, a
  rail line, a wash, a wall. The LOOK job is to make the crossing read
  in one glance, and the landmark does most of it for free — the cook
  dresses the landmark, never paints a line on open ground.
- THE RIM IS ONE PIXEL WHERE HE SEES IT (the 8/16 principle, applied to
  ground): the holder's side of the landmark may carry a rim — painted
  kerb, wall base stripe — exactly one pixel at DISPLAY size, on the
  holder's side only. A fat border band is a map graphic, not a place.
- THE CROSSING CARRIES THE MARK: every point where a body can actually
  cross (the gate, the underpass mouth, the bridge end, the gap in the
  wall) wears a wall mark (section 3) within one tile of the crossing.
  Real territory is marked where you enter it, not evenly along it.

## 3. THE MARKED WALL (the tag, anatomically)
- ONE MARK is a discrete patch of the holder's colour, 4-12 px tall at
  112 (2-6 at 56), sitting at body height on the wall face (the middle
  band of a two-tall wall, never the top course, never the footing).
- WEATHERED, NEVER FRESH: the mark is chipped at its edges and one value
  step duller than the pure faction colour — thirty years of sun apply
  to paint too. Fresh gloss on a wall is a lie about the world's age.
  EXCEPTION, and it is the point: a mark at FULL saturation and clean
  edges reads as NEW — recent claim, active dispute. Recency = cleanness
  is the card's time channel.
- THE RHYTHM: marks repeat every 8-20 cells along a held edge, DENSER
  at corners and crossings (real marking concentrates where ground is
  contested or entered, and an even wallpaper of tags reads as texture,
  not territory).
- DISPUTED GROUND is the ONE place two factions' colours may stand near
  each other: overpainting — the newer mark partly covering the older —
  is the read for contested, and the only sanctioned second accent in
  any frame (the style card's one-accent rule bends exactly here and
  nowhere else).

## 4. WHAT THE PLAYER LEARNS WITHOUT A WORD
Swept ground = somebody feeds this block. A one-pixel kerb rim = you are
about to be inside their rules. A clean bright tag over a faded one =
this street changed hands recently and might again. None of it needs a
label, a tooltip, or a map overlay — UI [danger visible] POINTS AT these
reads, it does not replace them.

## 5. THE MACHINE BLOCK (for the future territory gate)
```json
{
  "card": "BOHEMIA_TERRITORY_LOOK_CARD_9_6_26",
  "greyscale_test": true,
  "mark_sat_min": 0.55,
  "mark_px112": [4, 12],
  "colour_area_max_share": 0.02,
  "rim_px_display": 1,
  "rim_side": "holder",
  "mark_rhythm_cells": [8, 20],
  "crossing_mark_within_cells": 1,
  "weathering": {"value_step_duller": 1, "clean_means": "recent"},
  "disputed": {"second_accent_allowed": true, "read": "overpaint newer over older"},
  "banned": ["ground tint wash", "border line on open ground",
             "marks on the top course", "even tag wallpaper", "fresh gloss except recency"]
}
```

## REFERENCES (the compare law rides along)
- records/BOHEMIA_RULING_WHO_HOLDS_WHAT_9_5_26.md and its cited field
  research (ICRC on gangs as armed groups; PoLAR on movement control in
  Honduras): boundaries live on landmarks, get marked in colour on the
  dividing object, and move when power moves.
- laws/BOHEMIA_LAW_COLOUR_IS_TERRITORY_8_26_26.md: outline first, colour
  as the back-up channel; the name is not a lie; drab is not a colour.
- CB-06/CB-07 (reference/library/city-builder/): the valley's grain and
  the sign pole as the cheapest tallest claimable thing.
- FTC-03 (reference/library/faction-town/): our fortresses are claimed
  buildings, colour on the gate, not the whole wall — the same restraint
  this card orders for blocks.
- records/BOHEMIA_VERDICT_THE_HOSTILES_LOOK_9_6_26.md: the accent is the
  warning on BODIES; this card is the same rule on GROUND.
