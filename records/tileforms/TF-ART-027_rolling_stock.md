# TILE FORM TF-ART-027 — ROLLING STOCK (the stranded boxcars and the dead loco)

## A. IDENTITY
- NAME: Rolling stock — the railyard's stranded boxcars and its one dead
  locomotive, as roof-read multi-cell sprites
- FAMILY/SET: DEAD VEHICLES — sibling of the parked trailers (TF-ART-002
  volume) in the multi-cell-prop family.
- THE JOB, ONE SENTENCE: 3,346 cells of the railyard's signature content
  (118 boxcars + 14 locomotive blobs) draw as generic wall mass.

## B. WHY
- DEMANDED BY: the fresh inventory ranking (8/26 re-sweep): 'rolling
  stock (boxcar)' x3012 was the second-largest unclaimed name in the
  world after the landfill's fill.
- WHAT LOOKS BROKEN TODAY: the railyard's whole identity is cars
  stranded on tracks, and every car reads as a windowless building.
- MEASURED 8/27 on the walked world: 'rolling stock (boxcar)' x3012 in
  118 blobs - 101 of them EXACTLY 7x4 cells (a real 50-foot boxcar at
  0.87 m/cell), the rest edge-clips - and 'locomotive' x334 in 14
  blobs, 11 of them the same 7x4. The dossier: "a rusted freight car
  stranded on the track, doors sprung."
- SHOPPING CHECK: the approved galv
  (banks/tileforms/TF-ART-012_CANDIDATES_8_8_26.json), the approved
  oxide capsheet (same bank), the approved bluegrey paint
  (banks/tileforms/TF-ART-002_CANDIDATES_8_8_26.json) and the approved
  rust (banks/tileforms/TF-ART-010_CANDIDATES_8_8_26.json) are the four
  pools; no approved bank holds a railcar.

## C. WHERE
- SURFACE + TAB: RUN (the walk) and CITY (human mode).
- DISTRICT FAMILIES: railyard (and any future district that names
  rolling stock).
- LAYER: prop (a solid multi-cell vehicle prop, like the parked trailers).
- SOLID? yes - ENTERABLE? no (the sprung doors are a future volume).
- MUST SIT BESIDE: rail track, ballast / gravel, the yard's service
  roads.
- EDGE CONTRACT: single placement - ONE RGBA sprite per flood-walked
  blob, anchored at the blob's right-bottom cell (the established
  multi-cell prop law), ballast ground drawn under every cell first.
- NEVER BESIDE: nothing off the ballast.

## D. WHEN
- ACT: 1
- BEST TIME: both.
- WEATHER STATES: sunny baseline; deep_wet stays weather's.
- LIT/UNLIT: unlit always (LIGHT=TERRITORY).
- ANIMATION: static - nothing here has moved in thirty years.

## E. HOW
- EXACT SIZE: 308x176 px (7x4 corpus cells) per sprite.
- VIEW: the 45 from above - the ROOF is the read: transverse panel
  seams, the raised running board down the centreline, end platforms,
  a brake wheel as a small solid disc, soft ground shadow east+south
  (the same grammar as the approved trailer boxes).
- PALETTE: harvested only - galv pale, oxide red and bluegrey repaint
  from the approved pools, rust blooms from the approved rail plate.
  The bleached car is blended a step toward oxide so it never reads as
  fresh mill silver. No purple.
- LIGHT: one sky light; north edge lit, south falls off; no self-light.
- SHADOWS: the sprite's own soft east+south ground shadow.
- SCALE ANCHORS: a 7x4-cell car is 6.1x3.5 m - real boxcar width; panel
  seams at 22px = half-metre panels.
- WEAR LEVEL: thirty summers; blooms cluster at panel seams, the oxide
  car wears the most.
- VARIANTS: boxcar_0 (oxide), boxcar_1 (dusty bleach), boxcar_2
  (bluegrey), hashed per blob anchor; loco_box (one body - a yard has
  one dead switcher).
- CRAFT: panel seams are machine-straight (they are machinery, not
  hair); the brake wheel is a solid disc, never a dotted run (8/21
  stipple ban); no reporting marks, no numbers, ever - the words are his.

## F. THE CAPTION
```json
{
  "id": "TF-ART-027",
  "name": "rolling stock - stranded boxcars and the dead locomotive",
  "layer": "prop",
  "solid": true,
  "enter": false,
  "district_families": ["railyard"],
  "best_time": "both",
  "best_location": "the classification tracks of the railyard",
  "place_next_to": ["rail track", "ballast / gravel"],
  "never_next_to": ["anything off the ballast"],
  "weather_ok": ["sunny", "cloudy"],
  "acts": [1],
  "edge_contract": "single placement - one sprite per flood-walked blob at its right-bottom anchor",
  "tags": ["railyard", "boxcar", "locomotive", "freight", "vehicle"],
  "anim": "static"
}
```

## G. REFERENCES
- APPROVED ANCHOR: banks/tileforms/TF-ART-002_TRAILER_VOLUME_8_22_26.json
  (trailer_box_0 - the approved dead-vehicle-from-above grammar this
  family extends: roof read, lit west/north edge, soft ground shadow).
- NAMED OUTSIDE REFERENCE: the stranded freight in RimWorld crash sites
  and Unturned's Russia map railyards both read cars from above as
  ROOFS with a lengthwise walk line and dark end platforms, exactly
  this sprite's anatomy.
- REAL-WORLD GROUNDING: the UP Arden yard south-west of Vegas is rows
  of mixed rolling stock seen straight down - weathered oxide-brown
  roofs beside faded galvanised ones, panel seams crosswise, the
  running board a pale lengthwise stripe, every car casting one hard
  sun shadow to its south-east; a yard sorts cars from every railroad,
  which is why the three paints stand in one consist.
- ALSO OPENED IN CODE:
  banks/tileforms/TF-ART-012_CANDIDATES_8_8_26.json (galv + oxide),
  banks/tileforms/TF-ART-010_CANDIDATES_8_8_26.json (rail_plate_0).

## H. DON'T WANT
- NOT reporting marks, fleet numbers or logos - no readable text ever.
- NOT fresh silver - even the bleached car is dusty.
- NOT dot stipple (banned 8/21) - the brake wheel is a solid disc.
- NOT a second locomotive body - a dead yard has one dead switcher.
- NOT interiors - sprung doors are a future volume, not this form.

## I. ACCEPTANCE
- [x] Cooked from approved banks only (REUSE CHECK in the cook docstring)
- [x] ON THE REAL SURFACE: verified live at the railyard (cell 55,29) -
      cars standing on their tracks at the true 7x4 footprint
- [x] No purple, no self-light, no readable text, no stipple
- [x] Caption JSON parses and matches sections C/D

## J. ADMIN
- STATUS: COOKED AND WIRED 8/27/26 under EVERYTHING IS A THUMB (8/9):
  bank banks/tileforms/TF-ART-027_CANDIDATES_8_27_26.json (4 sprites),
  cook tools/tfcook/TF-ART-027_rollingstock_cook.py, wired in the run
  slice's named-cell pass ('rolling stock (boxcar)' + 'locomotive' ->
  one sprite per flood-walked blob, ballast under, the multi-cell prop
  law). Live frame: records/target/ART_WIRED_TF-ART-027.png, card in
  the ART tab.
  | REQUESTED BY: ART lane (fresh inventory ranking) | DATE: 8/27/26
  | PRIORITY: HIGH
- BOARD ROW #: 101 | VERDICT: —
