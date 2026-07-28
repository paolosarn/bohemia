# TILE FORM TF-CMB-001 — LOW COVER, THE STUFF YOU CAN CLIMB OVER

## A. IDENTITY
- NAME: Low cover (the waist-high stuff you duck behind and can vault)
- FAMILY/SET: COMBAT COVER family, the LOW half. TF-CMB-002 is the TALL half.
  One coherent drawing job: 3 to 4 silhouettes that all top out at the SAME
  height, because the shared height is the gameplay contract.
- THE JOB, ONE SENTENCE: this tile exists so that a player can tell at a
  glance, with no HUD icon and without tapping anything, which pieces of cover
  on the field he is allowed to vault over.

## B. WHY
- DEMANDED BY: the COMBAT NORTH STAR (Paolo 7/27/26, recorded in
  laws/BOHEMIA_ADDENDUM_WHAT_COMBAT_IS_FOR_7_27_26.md): "the strategy choice to
  deal the most damage and take the least amount of damage by positioning". The
  mechanic is already LIVE in the demo: every cover piece carries `tall:true` or
  `tall:false`, `bestCover(lowOnly)` only returns the low ones, and the vault
  move refuses a tall piece. The distinction is real and the art does not carry
  it.
- WHAT LOOKS BROKEN TODAY: every piece of cover in the fight is the identical
  untextured tan rectangle (`#6e604a`) with an ellipse cap, drawn in code. The
  ONLY thing that tells you a piece is vaultable is that its cap is tinted blue
  (`#7a94a8`) instead of tan. That is a colour code painted on an abstract box,
  and it is carrying an entire mechanic on its own. STRUCTURE-NOT-COLOR exists
  precisely because a colour is never allowed to be the thing.
- SHOPPING CHECK (done properly: the demo prop pool's (pack,idx) keys
  cross-referenced against the 1,927-entry UP list in
  banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt, then RENDERED AND LOOKED AT):
  * `banks/BOHEMIA_DEMO_PROP_POOL_7_10_26.txt`, family `cover`, pack
    "5. Barricades and defenses": 13 items, **12 of them APPROVED**. This is a
    STRONG PARTIAL HIT and the art lane must try it before drawing anything:
    three NDOT-profile jersey barriers, sandbag stacks, and a low stone wall are
    all in there and all thumbed UP.
  * WHY A FORM EXISTS ANYWAY, three reasons: (a) they are drawn near side-on,
    front face only, tops barely present, which breaks the 45 DEGREE ART LAW on
    a field looked at from above; (b) several are the wrong world entirely
    (czech hedgehogs, wooden spike barricades, a red-and-white boom gate) which
    is a siege, not a Las Vegas parking lot; (c) NOTHING in the bank was
    authored to the vaultable/not-vaultable height contract, which is the entire
    reason this family exists.
  * `container` family, same pool: 31 approved, but they are lit fire barrels
    and crates. The fire barrels are already routed to the mobile camp.
  * STARTER TILESET (42, md5-locked): ground and building tiles only. It has no
    freestanding cover object of any kind.
  * PERIMETER_WALL_POOL (26 approved): perimeter walls are 2 tiles minimum by
    law, so they are tall by definition, and they are a RUN not a piece.

## C. WHERE
- SURFACE + TAB: COMBAT (the fight field, the SLICE tab). The same pieces belong
  on RUN lots once the run has fights on them.
- DISTRICT FAMILIES: commercial, industrial, storage, strip-mall service aprons,
  road margins. Anywhere a fight happens on pavement.
- LAYER: structure
- SOLID? yes (it blocks movement and the dash path) — ENTERABLE? no
- MUST SIT BESIDE: asphalt (starter `road_0/1/2`), concrete slab
  (`concrete_0/1`), graded dirt (`dirt`), the deck's cast shadow, and ITSELF in
  runs of two to four (the arena generator clusters pieces into walls and
  corners on purpose, so three in a row must read as one wall).
- NEVER BESIDE: interior floors. Never inside the deck footprint (the generator
  already deletes those). Never stranded on open desert with no lot around it.
- EDGE CONTRACT: SINGLE PLACEMENT. Each piece is one object on one tile. Runs
  are made by placing several, which the generator already does.

## D. WHEN
- ACT: 1
- BEST TIME: both. At night it is lit only by whoever owns the light
  (LIGHT=TERRITORY); it has no light of its own and nobody patrols the dark.
- WEATHER STATES: sunny baseline; cloudy needs nothing (the wash handles it);
  RAIN darkens the top face and pools at the base. Value shift only, so it is a
  colorway and not a new shape.
- LIT/UNLIT variant: none of its own.
- ANIMATION: static.

## E. HOW
- EXACT SIZE: 44px cell (the starter tileset's `cell_px`, so combat and the run
  consume the same pixels with no resampling). Footprint 1 tile.
  **THE HEIGHT IS THE SPEC: the whole silhouette tops out at waist height on the
  canon rig, and must be visibly LOWER than any TF-CMB-002 piece standing beside
  it.** If that fails, the tile fails, however good it looks.
- VIEW: 45-degree world view. Top face VISIBLE and sky-lit, front face turned
  into the light, top read as an ellipse-family cross-section, never a hard
  side-on rectangle.
- PALETTE: constitution ceiling; STRUCTURE value band, which sits above the
  ground band so a piece pops off the asphalt instead of sinking into it.
- LIGHT: the one global direction. NO keyline. NO dither.
- SHADOWS: none baked. The field already draws its contact ellipse.
- SCALE ANCHORS: the real NDOT F-shape barrier is 32 inches tall, 24 inches at
  the base tapering to a 9 inch top, 10 feet long, about 4,000 lb. 32 inches is
  mid-thigh to waist on a 5-foot-10 human. **THAT NUMBER IS THE HEIGHT
  CONTRACT** and the rig is the ruler.
- WEAR LEVEL: unsealed Vegas concrete after years with nobody maintaining it.
  Chalky pale grey, hazard-stripe paint mostly burned off, sand drifted at the
  base, corners chipped where a truck clipped it.
- VARIANTS: 3 to 4 silhouettes at the SAME top height: (1) jersey barrier /
  K-rail, (2) a row of poured concrete wheel stops, (3) a low CMU planter box
  with the dead thing still in it, (4) sandbag stack. Colorways are free. A new
  HEIGHT is a different form.

## F. THE CAPTION
```json
{
  "id": "TF-CMB-001",
  "name": "low cover, vaultable",
  "layer": "structure",
  "solid": true,
  "enter": false,
  "district_families": ["commercial", "industrial", "storage", "road margins", "combat lots"],
  "best_time": "any",
  "best_location": "on pavement, in runs of 2-4, across the open ground between the player and a shooter",
  "place_next_to": ["asphalt", "concrete slab", "graded dirt", "low cover", "tall cover"],
  "never_next_to": ["interior floors", "deck footprint", "open desert with no lot"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "single placement",
  "anim": null,
  "tags": ["cover", "low", "vaultable", "combat", "waist-high"]
}
```

## G. REFERENCES
- APPROVED ANCHOR: the 12 approved barricades in DEMO_PROP_POOL pack
  "5. Barricades and defenses" (the three jersey barriers are the direct
  anchor); the starter tileset's `road_0` asphalt is the ground under it.
- NAMED OUTSIDE REFERENCE: **XCOM 2**, and it is the ANTI-lesson as much as the
  lesson. XCOM never makes you read the object: it puts a shield pip beside the
  soldier, full / half / empty, teal / yellow / red, and the cover object itself
  can be anything. Bohemia has no shield pip and Paolo killed the last HUD
  readout for being "more data to be proud of, no one gives a fuck", so **in
  this game the OBJECT has to say it.** Jagged Alliance 2 is the closer relative
  and does exactly that: two levels, cover read off the world itself.
- REAL-WORLD GROUNDING: the NDOT F-shape precast barrier is the standard Nevada
  roadwork and lot barrier, 32 in high, 24 in base tapering to a 9 in top, 10 ft
  long. Las Vegas surface lots are ringed with them and studded with poured
  concrete wheel stops at every stall head. The asphalt around them, once nobody
  sealcoats it (the local trade says every 3 to 5 years), oxidises from black to
  a dingy grey and goes brittle and crack-webbed. Everything out there is PALER
  than a game usually paints it.

## H. DON'T WANT
- NOT the blue cap. A colour code is not a silhouette. If the piece still needs
  a tint to say "vaultable", the form failed.
- NOT a flat side-on scroller face (45 DEGREE ART LAW). This is looked at from
  above and in front, with a real top.
- NOT medieval or siege: no czech hedgehogs, no wooden spikes, no boom gates.
  Those are in the bank and they are wrong for this world.
- NOT chest high. If it reads chest high it is TF-CMB-002 and it has broken the
  one mechanic this family exists to carry.
- NOT clean, NOT new, NOT freshly painted. Nobody has maintained anything.

## I. ACCEPTANCE
- [ ] HEIGHT PROOF, measured in px: rendered beside the canon rig AND beside a
      TF-CMB-002 piece. The top is unambiguously below the rig's waist and
      unambiguously lower than the tall piece.
- [ ] palette ceiling + STRUCTURE value band + one light direction green
- [ ] squint test at 1-tile map zoom: the low/tall difference SURVIVES
- [ ] 3x3 tiled proof sheet: three placed in a row read as ONE wall, not three
      loose objects (the generator clusters them, so this is the real case)
- [ ] ON THE REAL SURFACE: screenshot on the combat field, on the starter
      asphalt, with a man crouched behind it and a tall piece in frame
- [ ] caption JSON parses and matches sections C and D

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: COMBAT lane | DATE: 7/28/26 | PRIORITY: HIGH
- BOARD ROW #: 50 | VERDICT: —
