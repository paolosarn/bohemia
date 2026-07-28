# TILE FORM TF-LAB-003 — FIELD DRESSINGS (the bandage and the gauze)

## A. IDENTITY
- NAME: Field dressings — a roll of bandage and a gauze pad, sealed and used
- FAMILY/SET: CAMP FIRST AID set. Same drawing job (soft white cotton goods in
  their packets, plus their bloodied used state). The laid-out instrument kit
  the companion uses is a different silhouette and is TF-LAB-004.
- THE JOB, ONE SENTENCE: this tile exists so that "a camp where u can apply a
  bandage... apply gauze" is a thing you can see on the ground beside you
  instead of a line of text in a menu.

## B. WHY
- DEMANDED BY: laws/BOHEMIA_ADDENDUM_THE_MOBILE_CAMP_7_27_26.md clause 8, in
  Paolo's own words 7/27/26: "a camp where u can apply a bandage. a place a
  companion can pull out a bullet from your body. apply gauze." Clause 15 (his
  blood-loss question) makes dressings the answer to a wound, so they are the
  visible half of a ruled mechanic. Clause 4 means they are not inventory items
  — they come out of the one clumped pool — so the ART is a prop you see at
  camp, never an icon in a bag.
- WHAT LOOKS BROKEN TODAY: the dial page has a text button reading "apply a
  bandage" and a red 5x5px square on the walker to say you are hurt. There is
  no dressing art anywhere in the repo, so the most human moment the survival
  system has — patching yourself up — currently has less visual presence than a
  road marking.
- SHOPPING CHECK (records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md, then the
  banks, then the full 87-pack verdict file):
  * THERE IS NO MEDICAL PACK IN THE APPROVED CORPUS AT ALL. I enumerated all 87
    pack names in banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt and matched
    against medic / hospital / clinic / pharm / chem: ZERO packs. Not judged
    DOWN — never present. This is the cleanest gap on the board.
  * GORE OVERLAYS — 20 UP (banks/BOHEMIA_GORE_OVERLAY_BANK_7_10_26.txt, "red
    legal here", index says story-placed by Paolo, hold). THE NEAREST MISS, and
    genuinely useful ADJACENT: gore is the WOUND, a dressing is the TREATMENT,
    and the used/bloodied variant of this tile must sit next to that bank's red
    without clashing. Checked and it does not cover the ask: an overlay of blood
    is not a rolled bandage.
  * INTERIOR POOL (465 UP, 12 room buckets) — the likeliest hiding place for a
    first-aid box; the buckets are room furniture and no medical bucket exists.
  * "11. Crates, barrels and supplies" (44 UP) / "Cargo, crates and containers"
    (25 UP) — these are the CONTAINERS a dressing is found in, not the dressing.
  Nothing in the index is a dressing. Total gap.

## C. WHERE
- SURFACE + TAB: RUN (at the camp, when you treat a wound) and CITY at human
  zoom only as a small pale note on the ground. Also the interiors of any
  friendly shelter, since clause 13 says the same three verbs work under a real
  roof.
- DISTRICT FAMILIES: all — it travels with the player and appears wherever the
  camp or a friendly interior is.
- LAYER: prop
- SOLID? no — ENTERABLE? no
- MUST SIT BESIDE: the deployed camp (TF-LAB-001) — this is camp dressing in the
  literal sense; the instrument kit (TF-LAB-004); the approved gore overlays
  (the used variant lives next to their red); interior floors of friendly
  shelter.
- NEVER BESIDE: food or the supply pool's containers as if it were the same
  thing — clause 4 clumps water/food/build into ONE pool and medical is NOT
  named in that clump, so a dressing must never read as a ration.
- EDGE CONTRACT: SINGLE PLACEMENT — never repeats. Small authored props.

## D. WHEN
- ACT: 1
- BEST TIME: both. No night change beyond ambient; at a lit camp it catches the
  approved firelight like everything else there.
- WEATHER STATES: sunny baseline; cloudy no change; RAIN — a sealed packet is
  the ONE thing in this game that rain does not touch, and that is worth
  drawing: beads on foil while everything else darkens. The used cloth,
  opposite: rain makes it sodden and the red spreads.
- LIT/UNLIT: none of its own.
- ANIMATION: static. If the art lane wants the applied state to appear over a
  frame or two that is an ANIM ask and a separate form.

## E. HOW
- EXACT SIZE: small props, well under one tile each — roughly a quarter tile for
  the roll, a third for the opened packet, authored at starter-set native px.
  They must be legible at walk zoom while staying physically small: a bandage
  the size of a crate is the classic scale failure.
- VIEW: 45-degree world view (law). A gauze roll is a CYLINDER and gets the
  ellipse cross-section treatment (the blessed lamp bank is the reference for
  how a cylinder reads in this world); the packet is a flat rectangle lying on
  the ground and shows its sky-lit top face.
- PALETTE: constitution ceiling; PROP value band, and this is the one prop in
  Bohemia allowed to sit at the TOP of that band — clean cotton is the
  lightest, cleanest value in a dead city, and that contrast IS the design (see
  grounding). The used variant drops several values and borrows the gore bank's
  legal red.
- LIGHT: the one global direction. NO keyline. NO dither.
- SHADOWS: none baked; a small tight contact shadow from the separate pass.
- SCALE ANCHORS: a human hand (rig) — a roll fits in a palm; the packet is
  hand-sized. Cross-check against the 2-tile door law only to confirm it is
  tiny.
- WEAR LEVEL: SPLIT, deliberately. The sealed items are the ONE clean thing in
  the world — factory white, packet intact. The used items are filthy. Nothing
  in between, because the whole point is that a sealed dressing survived.
- VARIANTS: (1) sealed roll, (2) sealed pad in its packet, (3) opened/partly
  unrolled, (4) used and bloodied. Four states of one drawing job. Anything with
  a genuinely new silhouette (a splint, a tourniquet, a needle) is its own form.

## F. THE CAPTION
```json
{
  "id": "TF-LAB-003",
  "name": "field dressings",
  "layer": "prop",
  "solid": false,
  "enter": false,
  "district_families": ["all", "camp", "friendly-interiors"],
  "best_time": "any",
  "best_location": "at the deployed camp or inside friendly shelter, at the moment a wound is treated",
  "place_next_to": ["camp deployed", "bullet kit", "gore overlays (used variant)", "interior floors"],
  "never_next_to": ["supply pool rations (medical is not in the clumped pool)"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "SINGLE PLACEMENT",
  "anim": null,
  "tags": ["medical", "first-aid", "bandage", "gauze", "camp", "treatment", "clean-in-a-dead-world"]
}
```

## G. REFERENCES
- APPROVED ANCHOR: the approved GORE OVERLAY bank
  (banks/BOHEMIA_GORE_OVERLAY_BANK_7_10_26.txt, 20 UP, red legal) — the used
  variant is authored to sit WITH that red, same saturation discipline, judged
  in one scene with a wound. Secondary anchor: the blessed lamp bank, for how a
  cylinder is drawn at 45 degrees in this world.
- NAMED OUTSIDE REFERENCE: Escape from Tarkov's medical items for one specific
  thing only — that sealed medical packaging reads as VALUABLE at a glance
  because it is the only crisp, printed, undamaged surface on screen. Take the
  crispness, not its photoreal rendering or its item-bloat (its huge medical
  taxonomy is exactly what the loot law killed here). Second: Project Zomboid's
  bandage states for the READ of clean-vs-dirty-vs-bloody as three obvious
  values — the states, not its pace, which is graveyarded.
- REAL-WORLD GROUNDING (researched 7/28): the real object is a rolled white
  COTTON gauze bandage, about 4.5 inches wide, sold sterile in airtight
  individual packets; the trauma-grade version comes vacuum-sealed in rugged
  packaging, and a typical packet is about 3 x 2 x 1 inches. That packaging is
  the honest reason this prop matters in a dead Las Vegas: a foil-sealed
  dressing is one of very few manufactured things that is still genuinely
  STERILE and INTACT after years in a looted pharmacy, so finding one is the
  rare moment when the world hands you something new instead of something
  ruined. Everything else in Bohemia is degraded; this is not, and the tile
  should feel like that. Sources: North American Rescue (S-rolled gauze, trauma
  packaging), Band-Aid / Vitality Medical / first-aid-product.com (roll sizes,
  sterile individual packaging).

## H. DON'T WANT
- NOT a floating white cross or a green cross icon. No symbols, no UI glyph
  pretending to be a prop — that is the mall-icon mistake from the
  DISTRICT_HERO_v1 graveyard in miniature.
- NOT a red cross of any kind (it is a protected emblem in the real world and it
  is lazy shorthand besides).
- NOT a modern first-aid KIT BOX with a moulded plastic handle. Bohemia's
  medical comes out of the one pool, not out of branded kits.
- NOT an inventory-icon read: no drop shadow into a slot, no rim light, no
  three-quarter product shot. It lies on the ground in the world.
- NOT clean in the used variant, and NOT dirty in the sealed variant. The split
  is the point and blending them destroys it.
- NOT green, NOT purple (PURPLE RESERVATION), NOT flat side-on (45 DEGREE LAW).
- NOT scaled like a crate. A bandage you could sit on is the failure mode.

## I. ACCEPTANCE
- [ ] Seam measured: n/a (SINGLE PLACEMENT)
- [ ] Palette ceiling + PROP band + one-light green; purity sweep clean; the
      used variant's red checked against the approved gore bank's saturation
- [ ] Squint test: at walk zoom the sealed item still reads as PALE AND CRISP
      against desert ground — if it disappears into the dirt it has failed its
      one job
- [ ] 3x3 tiled proof: n/a — instead the FOUR-STATE STRIP (sealed roll, sealed
      pad, opened, used) side by side at 1x, so the state read is judged
- [ ] ON THE REAL SURFACE: at the deployed camp beside TF-LAB-001, with the
      used variant next to an approved gore overlay
- [ ] Caption JSON parses and matches C/D

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: LAB (mobile camp law clause 8; zero medical in
  the 87-pack corpus) | DATE: 7/28/26 | PRIORITY: MED
- BOARD ROW #: 81 | VERDICT: —
