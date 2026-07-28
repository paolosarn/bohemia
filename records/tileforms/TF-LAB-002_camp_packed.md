# TILE FORM TF-LAB-002 — THE CAMP, PACKED (the other half of clause 1)

## A. IDENTITY
- NAME: The camp on your back (the bundle you carry between places)
- FAMILY/SET: MOBILE CAMP set — the PACKED state. Its deployed state is
  TF-LAB-001 (different silhouette, own form per rule 1).
- THE JOB, ONE SENTENCE: this tile exists so that "the camp is MOBILE" is
  something you can SEE — the player is visibly carrying the shelter, so
  setting it down is a decision you watch yourself make instead of a menu
  toggle.

## B. WHY
- DEMANDED BY: laws/BOHEMIA_ADDENDUM_THE_MOBILE_CAMP_7_27_26.md clause 1, whose
  wording is two states, not one: "it is a thing you CARRY and SET DOWN".
  Clause 11 ("SETTING UP CAMP TAKES TIME") only lands if the player can see
  they are hauling the thing that costs that time. Clause (f) — what limits how
  much camp you can carry — is [PENDING Paolo], and this tile is what makes
  that limit legible when he sets it.
- WHAT LOOKS BROKEN TODAY: nothing draws it. On the dial page the packed state
  is a 6x7px tan rectangle on the player's hip — a debug tell, not art. So the
  game's headline survival ruling ("mobile") is currently invisible: a player
  cannot tell a camper from a non-camper by looking, which wastes the one
  silhouette that would communicate it for free.
- SHOPPING CHECK (records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md and its banks):
  * WARDROBE — 195 canon items (banks/BOHEMIA_WARDROBE_CANON_7_19_26.txt),
    consumed by the cast bridge. THE NEAREST MISS, and I checked it because a
    carried bundle is wardrobe-adjacent: it is garments only, and by
    STRUCTURE-NOT-COLOR the wardrobe's asks are garment SHAPES. A carried
    shelter is not clothing and adding it as a garment would corrupt that law's
    line between a colorway and a new silhouette.
  * HD PACK "14. Camp and tents" (18 UP) — the pack that would plausibly hold a
    rolled bundle. Its UP tiles are WORLD props sitting on ground, judged in
    context as such; nothing in the verdict file indicates a body-mounted
    variant, and a world prop cannot double as a rig attachment (it has no
    anchor, no facing set, and the wrong scale by the pack's own BIG/SMALL
    flags).
  * The rig and its BAKED.pose (RIG LAW) — the carry has to hang off the rig,
    but the rig is a BODY, not gear, and RIG LAW forbids reshaping painted
    regions to fake a pack.
  Nothing in the index carries anything. This is a total gap.

## C. WHERE
- SURFACE + TAB: RUN (on the player, every step of the walk) and CHARACTER (it
  should be visible on the body in the character box, or the player cannot
  confirm they are carrying it). CITY: reads only as a silhouette bump.
- DISTRICT FAMILIES: all — it is on the player, so it is wherever they are.
- LAYER: prop (a body-mounted prop, drawn with the walker, not on the map grid)
- SOLID? no — ENTERABLE? no
- MUST SIT BESIDE: the rig's back/shoulder region (RIG LAW: it ATTACHES, it
  never reshapes); the approved wardrobe's outer layers, since it is worn OVER
  whatever he has on, and it must not fight the 195 canon garments for space.
- NEVER BESIDE: itself (one camp); the deployed camp — the two states are
  mutually exclusive and drawing both at once is the bug this pair exists to
  make impossible.
- EDGE CONTRACT: SINGLE PLACEMENT — never repeats. Body-mounted, no tiling.

## D. WHEN
- ACT: 1 (most carried in Act 1 by clause 13's scarcity curve; still carried in
  2 and 3 by anyone who does not want to walk to a hotel).
- BEST TIME: both; no change at night beyond the global ambient pass.
- WEATHER STATES: sunny baseline; cloudy no change; RAIN-WET — a wet bundle
  reads darker and heavier, and since the real material is vinyl tarp it should
  gloss slightly rather than soak. Colorway, not geometry.
- LIT/UNLIT: none of its own. It is lit by whatever lights the player.
- ANIMATION: static as a shape, BUT it is drawn on a walking body, so the
  leaf-pixel law governs: the pack's STRUCTURE stays frozen across the walk
  cycle and only the leaf (a strap end, the bedroll's lashed tail) may move.
  A pack that deforms per frame breaks the law and looks like jelly.

## E. HOW
- EXACT SIZE: fits the rig's back/shoulder region — roughly one third of torso
  height, authored at the rig's native px so it lands without resampling. It
  must NOT exceed the rig's silhouette by more than it has to: a bundle taller
  than the head reads as comedy.
- VIEW: 45-degree world view (law), and it needs the full facing set the walk
  uses — on the back when walking away, edge-on in profile, mostly hidden when
  walking toward the camera. That directional set is part of this one job.
- PALETTE: constitution ceiling; PROP value band, but tuned DARKER than
  TF-LAB-001's deployed tarp — a rolled bundle is folded shade, and it must
  separate from the wardrobe's garment values behind it or the silhouette
  muddies.
- LIGHT: the one global direction. NO keyline. NO dither.
- SHADOWS: none baked; it contributes to the player's existing shadow, which is
  the separate pass's problem, not a baked blob under the pack.
- SCALE ANCHORS: the rig's shoulder-to-hip run is the ruler. Cross-check
  against TF-LAB-001: the packed bundle must plausibly BECOME that 2x2 deployed
  camp — if the maths of "that unrolls into that" fails the eye, both tiles are
  wrong and they are judged as a pair.
- WEAR LEVEL: the same maintained-but-battered register as TF-LAB-001. Same
  bleached tarp, same re-tied lashings — the player must recognise the packed
  and deployed objects as THE SAME OBJECT, which is the whole reason these two
  forms are a set and get judged together.
- VARIANTS: dry and wet colorways of one shape, times the facing set.

## F. THE CAPTION
```json
{
  "id": "TF-LAB-002",
  "name": "camp packed",
  "layer": "prop",
  "solid": false,
  "enter": false,
  "district_families": ["all"],
  "best_time": "any",
  "best_location": "on the player's back, everywhere, whenever the camp is not set down",
  "place_next_to": ["rig back region", "approved wardrobe outer layers"],
  "never_next_to": ["camp deployed", "another camp packed"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "SINGLE PLACEMENT",
  "anim": null,
  "tags": ["camp", "mobile", "carried", "body-mounted", "rig-attachment", "silhouette-tell"]
}
```

## G. REFERENCES
- APPROVED ANCHOR: the canon rig + BAKED.pose (RIG LAW) and the approved
  wardrobe's outer layers (banks/BOHEMIA_WARDROBE_CANON_7_19_26.txt) — this
  attaches to the first and must not fight the second. Judged ON the rig, in
  the walk, never as a loose bundle.
- NAMED OUTSIDE REFERENCE: Death Stranding for the one idea worth stealing —
  that a carried load is a READABLE SILHOUETTE and the character's outline
  tells you what they are carrying before you see any detail. Take only the
  silhouette-first thinking; nothing about its scale, its tech, or its stacking.
  Second: Kenshi's backpacks, for how a bundle sits on a small sprite without
  swallowing the body.
- REAL-WORLD GROUNDING (researched 7/28): the real transport unit for a Las
  Vegas camp is the SHOPPING CART — reported explicitly in the tunnel and
  drainage-canal camps, where monsoon floodwater carries carts, wood and
  boulders through the drains. So the honest Vegas answer to "how do you move a
  camp" is: a cart if you have one, a bundle if you do not, and a tarp is what
  wraps it either way. Real bundles are the tarp itself used as the sack — you
  do not carry a tarp AND a bag, you roll the bag inside the tarp and lash it.
  A NOTE ON THE CART, FLAGGED NOT DECIDED: a cart is a stronger Vegas read than
  a backpack and board row 3 already says "deployed cart", but whether the
  player pushes a cart or carries a bundle changes movement and is NOT a call
  the art lane or LAB should make. THIS FORM ASKS FOR THE BUNDLE (it works with
  any movement rules). If Paolo says cart, this form is reissued, cheaply.
  Sources: reviewjournal.com (drainage canal camp, tunnel flood debris),
  newsnationnow.com (the tunnel population).

## H. DON'T WANT
- NOT a clean hiking backpack with branded straps and a frame. Not outdoor
  retail. Not new.
- NOT a fantasy adventurer's bedroll-and-pot ensemble jangling off a belt.
- NOT so big it becomes the character's silhouette. The player is a person
  carrying a camp, not a camp with legs.
- NOT deforming per walk frame (leaf-pixel law: structure frozen, leaf only).
- NOT a reshaped rig region. RIG LAW is absolute: Paolo's painted regions are
  SACROSANCT, so this ATTACHES and never meshes into the body.
- NOT GREEN, NOT purple (PURPLE RESERVATION), NOT flat side-on.
- NOT visually unrelated to TF-LAB-001. If a player cannot tell that the thing
  on their back is the thing they set down, both forms failed.

## I. ACCEPTANCE
- [ ] Seam measured: n/a (SINGLE PLACEMENT)
- [ ] Palette ceiling + PROP band + one-light green; purity sweep clean
- [ ] Squint test: at walk zoom, a packed player is distinguishable from an
      unpacked player by SILHOUETTE ALONE, greyscaled, at 1x
- [ ] 3x3 tiled proof: n/a — instead deliver the WALK STRIP (the full facing
      set across the walk cycle) so the leaf-pixel law can be checked
- [ ] ON THE REAL SURFACE: on the rig, in the walk, in the CHARACTER box; and
      the PAIR SHOT — packed player standing beside the deployed TF-LAB-001, so
      "that unrolls into that" is judged by eye
- [ ] Leaf-pixel gate green across the walk (structure frozen)
- [ ] Caption JSON parses and matches C/D

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: LAB (mobile camp law clause 1, the half nothing
  on the board covered) | DATE: 7/28/26 | PRIORITY: HIGH
- BOARD ROW #: 80 | VERDICT: —
