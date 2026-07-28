# TILE FORM TF-CMB-008 — FIGHT LITTER (spent brass and scorch)

## A. IDENTITY
- NAME: Fight litter (the spent casings and scorch a fight leaves on the ground)
- FAMILY/SET: COMBAT GROUND OVERLAY. Standalone. A small overlay set that
  accumulates during a fight and stays after it.
- THE JOB, ONE SENTENCE: this tile exists so that the ground under a fight
  records what happened on it, so a player crossing a lot can read where the
  shooting was without a single word of UI.

## B. WHY
- DEMANDED BY: the COMBAT NORTH STAR (Paolo 7/27/26), which asks for combat that
  feels **"snappy and violent and human"**. It also directly serves the rule
  this lane wrote after he killed the tally: **IF IT DOES NOT CHANGE A DECISION
  THE PLAYER MAKES, IT IS NOT A MECHANIC** (records/BOHEMIA_TALLY_KILL_7_27_26
  .txt). Litter is not claimed as a mechanic. It is claimed as WORLD, and it is
  filed at LOW priority on purpose, because it is dressing and this form says so
  rather than dressing it up as gameplay.
- WHAT LOOKS BROKEN TODAY: casings are 3px rectangles with a gravity arc, capped
  at a hard particle limit (the code comment records the bug where the fifteenth
  casing silently deleted the first and the ground stopped accumulating). Once
  landed they are single flat pixels. There is no scorch, no shell pile, no
  record of a firefight at all after the bodies are drawn.
- SHOPPING CHECK:
  * `banks/BOHEMIA_OVERLAY_BANK_7_10_26.txt`, 174 overlays, self-described as
    "OVERLAY category per Paolo learned rules: plants/rubble/stains sit ON real
    ground textures". **This is the right category and it must be opened first.**
    If it contains a small-debris or stain overlay that reads as brass, this
    form is satisfied by reuse.
  * DEMO_PROP_POOL `trash_debris` family: 17 items, **16 APPROVED**. Rendered
    and looked at: rubble piles and scrap heaps at 2x1 and 2x2. Too big and too
    chunky to be brass, but they ARE the approved language for debris on this
    ground and the palette should match them.
  * DEMO_PROP_POOL `item_pile`: 33 items, 28 approved. Same note.
  * STARTER TILESET 42: `road_0/1/2` etc are the ground this sits ON. No litter.
  * MARKING_BANK: paint, not debris. Different thing.

## C. WHERE
- SURFACE + TAB: COMBAT (the fight field, the SLICE tab). RUN later if fights
  leave persistent marks on the world, which is a Paolo ruling, not this form.
- DISTRICT FAMILIES: all. It goes wherever a fight went.
- LAYER: ground (an OVERLAY that sits on real ground texture, per the overlay
  bank's own stated rule)
- SOLID? no — ENTERABLE? no
- MUST SIT BESIDE: asphalt, concrete, graded dirt, gravel yard, blood pools
  (which come from the already-approved GORE_OVERLAY_BANK, not from here), the
  base of cover pieces (brass piles up where somebody stood and fired).
- NEVER BESIDE: interior floors, unless the fight was inside. Never on the deck
  unless somebody fired from the deck.
- EDGE CONTRACT: SINGLE PLACEMENT (scattered overlays, never a tiled field).

## D. WHEN
- ACT: 1
- BEST TIME: both. Brass catches light, so by day it is the one glinting thing
  on a dead grey lot and at night it is nearly invisible. That contrast is the
  whole appeal.
- WEATHER STATES: sunny baseline; cloudy from the wash; RAIN darkens the ground
  around it and makes the brass stand out MORE, not less.
- LIT/UNLIT variant: none.
- ANIMATION: static once landed. The in-flight casing is already handled by the
  existing particle code and is not part of this ask.
- ACCUMULATION: it grows during a fight. The caption declares a density scale so
  the code can pick a light, medium or heavy overlay rather than stacking
  hundreds of sprites, which is what the particle cap bug was really about.

## E. HOW
- EXACT SIZE: 44px cell overlays, transparent, drawn after the ground and before
  the bodies. 3 densities.
- VIEW: 45-degree world view. Brass on the ground is genuinely near-flat, so
  this is the one form where the top view dominates, but each casing is a small
  cylinder and must read as one: bright top edge, dark underside, tiny contact
  shadow. Never a flat dash.
- PALETTE: constitution ceiling; GROUND value band, but brass is allowed a
  narrow high-value glint because it is metal in the sun. Scorch sits at the
  DARK end of the same band.
- LIGHT: the one global direction, and it matters more here than anywhere: 200
  casings all lit from the same side is what sells them as one material.
- SHADOWS: tiny contact shadows are part of the overlay (they are too small for
  the separate pass to be worth it); note this as the deliberate exception.
- SCALE ANCHORS: a 9mm case is about 19mm long, so against the canon rig's foot
  it is TINY. The failure mode is drawing them too big; at this tile size a
  casing is a 2 to 3 pixel object and a pile is a texture, not a collection.
- WEAR LEVEL: fresh brass is bright and goes dull within days in the sun and
  dust. Both states are legitimate and the difference is a colorway.
- VARIANTS: 3 densities (light scatter, medium, heavy pile) x 2 ages (fresh,
  dulled), plus one scorch overlay for grenades and one for a fire. Shape
  variants beyond that are new forms.

## F. THE CAPTION
```json
{
  "id": "TF-CMB-008",
  "name": "fight litter",
  "layer": "ground",
  "solid": false,
  "enter": false,
  "district_families": ["all"],
  "best_time": "any, glints by day",
  "best_location": "on the ground where somebody stood and fired, heaviest at the base of cover",
  "place_next_to": ["asphalt", "concrete slab", "graded dirt", "gravel yard", "blood pool", "cover base"],
  "never_next_to": ["interior floors unless the fight was inside", "the deck unless somebody fired from it"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "single placement",
  "anim": null,
  "tags": ["overlay", "litter", "brass", "scorch", "combat", "accumulates", "density-light-medium-heavy"]
}
```

## G. REFERENCES
- APPROVED ANCHOR: the OVERLAY_BANK's stated rule ("plants/rubble/stains sit ON
  real ground textures") is the contract this form is written to, and the 16
  approved `trash_debris` props are the palette and grain anchor for debris on
  this ground.
- NAMED OUTSIDE REFERENCE: **Hotline Miami** for the principle that the mess a
  fight leaves is the score, and it is on the FLOOR rather than on a results
  screen. That is exactly the distinction Paolo drew when he killed the tally:
  the record belongs in the world, not in a number.
- REAL-WORLD GROUNDING: a 9mm case is about 19mm long and lands 1 to 3 metres to
  the shooter's right; brass tarnishes from bright yellow to a dull olive-brown
  within days in Mojave sun and dust. On a real Las Vegas lot the brass ends up
  drifted against kerbs and wheel stops, because wind and traffic push small
  debris to the edges, so heavy piles at the base of cover is not just a
  gameplay convenience, it is what actually happens.

## H. DON'T WANT
- NOT big. A visible individual casing at this tile size is oversized by an
  order of magnitude.
- NOT flat dashes. Each casing is a small cylinder with a top and an underside.
- NOT confetti. Random bright dots scattered on a quiet floor is the exact
  "busy floor is a failed floor" failure the desert-ground form already names.
- NOT lit from a second direction. All of it, one light.
- NOT blood. Blood already exists and is already approved
  (GORE_OVERLAY_BANK, 20 UP, explicitly a "combat floor-painting layer,
  transparent, draw-after-ground"). Do not cook blood here or anywhere.

## I. ACCEPTANCE
- [ ] SIZE PROOF: a single casing measured against the canon rig's foot; if it
      is bigger than 3px at the shipped tile size it is wrong
- [ ] palette ceiling + GROUND value band + one light direction green
- [ ] QUIET PROOF: at walk zoom the ground still reads QUIET with heavy litter
      on it; bodies and cover still pop
- [ ] 3x3 tiled proof at each density, plus the three densities side by side
- [ ] ON THE REAL SURFACE: screenshot after a real fight, on the starter
      asphalt, with the approved blood overlays wired in the same delivery
- [ ] caption JSON parses and matches sections C and D

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: COMBAT lane | DATE: 7/28/26 | PRIORITY: LOW
- BOARD ROW #: 57 | VERDICT: —
- HONEST NOTE: this is dressing, not a mechanic, and it is filed LOW on purpose.
  If it never gets cooked, nothing in combat breaks.
