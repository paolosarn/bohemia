# TILE FORM TF-ART-031 — PROPANE TANKS + ICE BRIDGES (the radio site's plant)

## A. IDENTITY
- NAME: Propane tanks and ice bridges — the fuel that fed the
  transmitters and the elevated trays that carried their cables
- FAMILY/SET: DEAD INFRASTRUCTURE — sibling of the guy wires
  (TF-ART-030) at the same site.
- THE JOB, ONE SENTENCE: 3,376 cells of the radio site's plant - its
  biggest named content - draw as plain ground.

## B. WHY
- DEMANDED BY: the 8/27 radio measure (made for TF-ART-030) surfaced
  'propane tank / ice bridge' x3376 - BIGGER than the guy wires the
  visit came for; logged as board row 105 and answered next pass.
- WHAT LOOKS BROKEN TODAY: the generator yards and cable runs that
  explain HOW a dead transmitter site once ran are invisible.
- MEASURED 8/27 on the walked world (cell 37,26): 139 blobs whose dims
  sort the shared name into its two real things - dozens of SMALL
  blobs (1x2, 2x2, 3x2: the tank banks) and long THIN runs (21x3,
  39x7, 30x8: the elevated tray lines).
- SHOPPING CHECK: the approved kerb pale
  (banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json), the approved
  galv (banks/tileforms/TF-ART-012_CANDIDATES_8_8_26.json) and the
  approved rust (banks/tileforms/TF-ART-010_CANDIDATES_8_8_26.json)
  are the pools; no approved bank holds a tank cylinder or a cable
  tray from above.

## C. WHERE
- SURFACE + TAB: RUN (the walk) and CITY (human mode).
- DISTRICT FAMILIES: radio.
- LAYER: structure (tanks and trays both stand off the ground; the
  cell draws its yard ground first).
- SOLID? follows the district's occupancy - ENTERABLE? no.
- MUST SIT BESIDE: the equipment huts, the masts, the site ground.
- EDGE CONTRACT: single placement per cell with an AXIS SPLIT - thin axis <=3 AND long
  axis >=5 reads as a BRIDGE RUN along the long axis (h/v pieces);
  everything else reads as TANKS; a bank of tank cells is a tank row,
  which is what a real generator yard is.
- NEVER BESIDE: nothing outside the radio site.

## D. WHEN
- ACT: 1
- BEST TIME: both.
- WEATHER STATES: sunny baseline; deep_wet stays weather's.
- LIT/UNLIT: unlit always.
- ANIMATION: static.

## E. HOW
- EXACT SIZE: 44px corpus cell tiles over the yard ground.
- VIEW: the 45 from above - the tank is a horizontal cylinder (lit
  crown line, shadowed belly, rounded ends, saddle shadows on the
  ground, the valve dome peeking over the crown); the tray is a galv
  ribbon with lit rims, crosswise rib ticks and post shadows.
- PALETTE: harvested only - bleached tank white from the approved kerb
  pale, tray steel from the approved galv, weld blooms from the
  approved rust. No purple.
- LIGHT: one sky light; no self-light.
- SHADOWS: saddle and post shadows, alpha, never baked into ground.
- SCALE ANCHORS: one cylinder per cell = a real 500-gallon tank at
  0.87 m/cell; the tray ribbon 12px = a metre-wide cable bridge.
- WEAR LEVEL: thirty years - girth-weld rust on half the tanks, a rust
  streak down the odd tray rib.
- VARIANTS: pt_tank_0/1, ib_h_0/1, ib_v_0/1, hashed per cell.
- CRAFT: the cylinder follows the 45 law (ellipse ends, sky-lit
  crown); tray ribs are machinery and may be straight; no dots.

## F. THE CAPTION
```json
{
  "id": "TF-ART-031",
  "name": "propane tanks and ice bridges - the transmitter site's plant",
  "layer": "structure",
  "solid": true,
  "enter": false,
  "district_families": ["radio"],
  "best_time": "both",
  "best_location": "the generator yards and cable runs of the radio site",
  "place_next_to": ["equipment hut", "guyed mast", "site ground"],
  "never_next_to": ["anything outside the radio site"],
  "weather_ok": ["sunny", "cloudy"],
  "acts": [1],
  "edge_contract": "single placement - axis split per cell, thin<=3 and long>=5 is a bridge run, else tanks",
  "tags": ["radio", "propane", "tank", "ice bridge", "cable tray"],
  "anim": "static"
}
```

## G. REFERENCES
- APPROVED ANCHOR: banks/tileforms/TF-ART-012_CANDIDATES_8_8_26.json
  (parapet_galv_run_n_a - the tray steel is the approved galv, so the
  bridges sit in the same metal family as every roof they serve).
- NAMED OUTSIDE REFERENCE: the tank farms in RimWorld and Factorio
  both read propane storage from above as ROWS OF PALE CYLINDERS with
  dark belly shadows - the row IS the read, one vessel per cell,
  exactly this form's grammar.
- REAL-WORLD GROUNDING: a real AM transmitter site (KDWN's Las Vegas
  array included) runs on utility power with propane backup - white
  500-gallon cylinders in fenced banks by the equipment hut - and
  feeds its towers through ICE BRIDGES, elevated galvanised cable
  trays on short posts that carry the transmission lines from hut to
  tuning house to mast; from the air the site reads as white tank rows
  plus straight silver ribbons converging on the towers, which is what
  these six tiles draw.
- ALSO OPENED IN CODE:
  banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json (kerb_return_ne),
  banks/tileforms/TF-ART-010_CANDIDATES_8_8_26.json (rail_plate_0).

## H. DON'T WANT
- NOT one giant tank sprite per blob - a yard is a BANK of vessels.
- NOT flat-side-on cylinders - the 45 law governs (ellipse ends,
  sky-lit crown).
- NOT fresh white - every tank is thirty years bleached.
- NOT dots, no purple, no self-light, no readable text.

## I. ACCEPTANCE
- [x] Cooked from approved banks only (REUSE CHECK in the cook docstring)
- [x] ON THE REAL SURFACE: verified live at the radio site (cell
      37,26) - tank rows in the yards, tray ribbons running toward the
      masts
- [x] No purple, no self-light, no readable text, no stipple
- [x] Caption JSON parses and matches sections C/D

## J. ADMIN
- STATUS: COOKED AND WIRED 8/27/26 under EVERYTHING IS A THUMB (8/9):
  bank banks/tileforms/TF-ART-031_CANDIDATES_8_27_26.json (6 tiles),
  cook tools/tfcook/TF-ART-031_tank_icebridge_cook.py, wired in the
  run slice's named-cell pass ('propane tank / ice bridge' -> axis
  split, tanks vs h/v tray runs). Live frame:
  records/target/ART_WIRED_TF-ART-031.png, card in the ART tab.
  | REQUESTED BY: ART lane (radio measure) | DATE: 8/27/26
  | PRIORITY: MED
- BOARD ROW #: 105 | VERDICT: —
