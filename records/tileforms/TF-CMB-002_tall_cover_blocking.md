# TILE FORM TF-CMB-002 — TALL COVER, THE STUFF YOU HAVE TO GO AROUND

## A. IDENTITY
- NAME: Tall cover (chest-to-head, you cannot climb it, you walk around it)
- FAMILY/SET: COMBAT COVER family, the TALL half. TF-CMB-001 is the LOW half.
  One coherent drawing job: 3 to 4 silhouettes that all top out ABOVE the rig's
  chest, because the shared height is the gameplay contract.
- THE JOB, ONE SENTENCE: this tile exists so that a player looking at the field
  knows which pieces will stop a bullet completely and cost him a walk around,
  before he commits the turn.

## B. WHY
- DEMANDED BY: the COMBAT NORTH STAR (Paolo 7/27/26,
  laws/BOHEMIA_ADDENDUM_WHAT_COMBAT_IS_FOR_7_27_26.md) plus his POINT BLANK
  ruling ("u want to get into point blank range"), which only means anything if
  the player can see, in advance, which route to point blank is walled and which
  is open. The mechanic is LIVE: `tall:true` pieces are excluded from
  `bestCover(lowOnly)` and refuse the vault.
- WHAT LOOKS BROKEN TODAY: a tall piece and a low piece are the SAME rectangle,
  drawn taller. There is no material, no top, no texture and no object identity
  on either. The field is a scatter of brown boxes at two heights, and the two
  heights are the only difference between the most important objects in the
  game.
- SHOPPING CHECK (same method as TF-CMB-001: (pack,idx) cross-referenced against
  the 1,927-entry UP list, then rendered and looked at):
  * DEMO_PROP_POOL `cover` family, 12 approved: **NOTHING in it is tall.** Every
    approved barricade is a knee-to-waist piece. The one chest-height thing in
    the whole prop pool is the dumpster, and it is a single sprite.
  * `container` family, 31 approved: fire barrels (already routed to the mobile
    camp) and crates. A barrel is roughly waist height, so it belongs to
    TF-CMB-001, not here.
  * PERIMETER_WALL_POOL, 26 approved entries, 13 keys x 2 colorways: the closest
    real hit. Approved, tan-dominant by the 85/15 law, minimum 2 tiles tall, so
    genuinely TALL. **The art lane should try cutting a 1-tile STUB out of an
    approved wall key before drawing a new one.** What it does not cover: a
    perimeter wall is a continuous RUN with no ends, and a freestanding
    1-tile chunk needs two authored END faces that the run tiles do not have.
    It also has no top face read at 45, because a perimeter wall is never
    looked down on.
  * STARTER TILESET 42: `wall_0/1/2` stucco, `wall_end_l`, `wall_end_r`,
    `wall_base` are BUILDING walls in the building's own grammar, not a
    freestanding object on a lot, and they carry no top.
  * STREET_PROP_POOLS: `car_wreck` x20 exists and is tall cover, but a car is a
    different silhouette and gets its own form (TF-CMB-003).

## C. WHERE
- SURFACE + TAB: COMBAT (the fight field, the SLICE tab); RUN lots later.
- DISTRICT FAMILIES: commercial, industrial, storage, parking structures,
  strip-mall service aprons.
- LAYER: structure
- SOLID? yes (blocks movement, the dash path, and line of sight) —
  ENTERABLE? no
- MUST SIT BESIDE: asphalt, concrete slab, graded dirt, low cover, itself in
  runs, the deck's support line (a column under a deck edge is the most honest
  placement in the game).
- NEVER BESIDE: interior floors. Never inside the deck footprint. Never
  free-floating in open desert.
- EDGE CONTRACT: SINGLE PLACEMENT. One object, one tile. Runs are placed, not
  tiled.

## D. WHEN
- ACT: 1
- BEST TIME: both. No self-light. At night it is a black shape unless somebody
  owns the light near it, which is the point of LIGHT=TERRITORY.
- WEATHER STATES: sunny baseline; cloudy from the wash; RAIN darkens the top and
  streaks the vertical face. Value shift only.
- LIT/UNLIT variant: none of its own.
- ANIMATION: static.

## E. HOW
- EXACT SIZE: 44px cell, footprint 1 tile. **THE HEIGHT IS THE SPEC: the
  silhouette tops out at or above the canon rig's chest, and must be
  unmistakably taller than every TF-CMB-001 piece beside it.** A man standing
  behind it is hidden from the shoulders down.
- VIEW: 45-degree world view. A tall object at 45 shows a big front face AND a
  foreshortened sky-lit top; the top is what stops it reading as a 2D scroller
  wall. Bands bow toward the viewer.
- PALETTE: constitution ceiling; STRUCTURE value band. Tan wall 85/15 applies to
  anything wall-like.
- LIGHT: one global direction. NO keyline. NO dither.
- SHADOWS: none baked. A tall piece throws a LONG shadow and the separate shadow
  pass owns it; note the expected footprint so the pass can size it.
- SCALE ANCHORS: a cast-in-place parking-structure column sits on roughly 24-foot
  bays and reads about 2 feet square in plan; standard CMU block is 8x8x16
  inches, so a 6-course stub is 4 feet, which is chest-to-shoulder on the rig.
  The rig is the ruler, the block course is the texture ruler.
- WEAR LEVEL: Clark County subdivision-grade CMU under 30 years of sun: tan
  stucco burned pale and blown off in patches showing the grey block underneath,
  efflorescence bloom near the base, the top course chipped. Concrete columns
  are rust-stained where the rebar has started to bleed through.
- VARIANTS: 3 to 4 silhouettes at the same top height: (1) a CMU block wall stub
  with two authored ends, (2) a square concrete column, (3) a steel utility /
  electrical pedestal cabinet, (4) a dumpster. Colorways free. A new HEIGHT is a
  different form.

## F. THE CAPTION
```json
{
  "id": "TF-CMB-002",
  "name": "tall cover, blocking",
  "layer": "structure",
  "solid": true,
  "enter": false,
  "district_families": ["commercial", "industrial", "storage", "parking structures", "combat lots"],
  "best_time": "any",
  "best_location": "on pavement, breaking a long sightline, under or beside a deck edge",
  "place_next_to": ["asphalt", "concrete slab", "graded dirt", "low cover", "tall cover", "deck slab edge"],
  "never_next_to": ["interior floors", "deck footprint", "open desert with no lot"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "single placement",
  "anim": null,
  "tags": ["cover", "tall", "blocking", "combat", "chest-high", "sightline"]
}
```

## G. REFERENCES
- APPROVED ANCHOR: the PERIMETER_WALL_POOL keys (26 approved entries, tan 85 /
  original 15) for the block-wall material and colour truth; the starter
  tileset's `wall_end_l` / `wall_end_r` for how this world draws the moment a
  wall STOPS.
- NAMED OUTSIDE REFERENCE: **Jagged Alliance 2** for the principle that cover is
  read off the world and not off an icon, and **XCOM 2** as the anti-reference:
  XCOM lets any prop be cover because the shield pip carries the information.
  Bohemia has deliberately no such pip, so the object carries it. Also
  **Into the Breach** for the discipline that in a small grid every object on
  the board must be instantly classifiable by silhouette alone, because the
  player is reading the whole board at once, not one prop at a time.
- REAL-WORLD GROUNDING: the Clark County subdivision perimeter wall is CMU block
  (8x8x16 in units) rendered in tan stucco, and it is everywhere in Las Vegas.
  Parking structures in the valley are cast-in-place post-tensioned concrete on
  roughly 24-foot column bays with 17 to 27 foot slab spans. Both materials fail
  the same way in the Mojave: the stucco chalks and blows off in patches, the
  concrete stains rust where the reinforcement bleeds, and everything bleaches
  toward grey-tan.

## H. DON'T WANT
- NOT a taller copy of the low piece. Different HEIGHT is necessary but not
  sufficient; these are different OBJECTS made of different materials.
- NOT a flat side-on scroller face. A tall object is exactly where the 45 law
  gets broken, so the sky-lit top is mandatory.
- NOT green. NOT purple (PURPLE RESERVATION: purple is the Amalgamation alone,
  and the purity gate sweeps).
- NOT the blue-cap colour code from the current code-drawn box.
- NOT clean, NOT new, NOT a fresh tan stucco wall. This is 30 years of sun.

## I. ACCEPTANCE
- [ ] HEIGHT PROOF, measured in px: beside the canon rig and beside a TF-CMB-001
      piece, the top is at or above the rig's chest and clearly above the low
      piece
- [ ] HIDE PROOF: a man standing behind it is hidden from the shoulders down
- [ ] palette ceiling + STRUCTURE value band + tan 85/15 + one light green
- [ ] purity sweep green (no purple)
- [ ] squint test at 1-tile map zoom: still reads TALL
- [ ] 3x3 tiled proof sheet: a run of three reads as one wall WITH ends
- [ ] ON THE REAL SURFACE: screenshot on the combat field beside a low piece and
      the canon rig
- [ ] caption JSON parses and matches sections C and D

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: COMBAT lane | DATE: 7/28/26 | PRIORITY: HIGH
- BOARD ROW #: 51 | VERDICT: —
