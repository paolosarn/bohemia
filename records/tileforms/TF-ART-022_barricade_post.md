# TILE FORM TF-ART-022 — BARRICADE POST (the arsenal's post-and-cable lines)

## A. IDENTITY
- NAME: Barricade post — the concrete-filled steel posts strung with
  cable that ring the arsenal's storage ground
- FAMILY/SET: ARSENAL HARDWARE — third member of the arsenal's
  vocabulary (berms and traverses came first).
- THE JOB, ONE SENTENCE: 1,607 'barricade post' cells fall to the gravel
  fallback, so the depot's vehicle-control lines do not exist.

## B. WHY
- DEMANDED BY: the inventory ranking (ART lane's standing instrument):
  next largest named surface after the granary hardware.
- WHAT LOOKS BROKEN TODAY: the storage ground reads as open gravel you
  could drive anywhere - a depot whose whole design is CONTROLLED
  movement shows no control at all.
- MEASURED 8/24 on the walked world: 1,607 cells in 85 blobs - small
  clusters at the issue points plus long SPARSE lines (36x10 bounding
  box at 37% fill - post lines, not walls). Neighbour census: storage
  ground 1109, seepage 347, earth-covered magazine 236, concrete
  arch/traverse 173.
- SHOPPING CHECK: banks/tileforms/TF-ART-012_CANDIDATES_8_8_26.json
  (approved galv) and banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json
  (approved pale concrete) exist and cover post metal and fill; no
  approved bank holds a post-with-cable piece, so it is cooked from the
  approved pools.

## C. WHERE
- SURFACE + TAB: RUN (the walk) and CITY (human mode); absent at MAP zoom.
- DISTRICT FAMILIES: arsenal only.
- LAYER: ground (a knee-height post is floor furniture, not a wall
  course; it never blocks the walk).
- SOLID? no - ENTERABLE? no.
- MUST SIT BESIDE: storage ground, the magazines, the traverses, the
  service lanes - exactly the measured census.
- EDGE CONTRACT: self-seamless for the cable spans (every span is pinned
  at the same height at both cell edges, so neighbouring cells join
  without a seam); single placement for the post itself.
- NEVER BESIDE: nothing outside the arsenal; never blocking a gate cell.

## D. WHEN
- ACT: 1
- BEST TIME: both.
- WEATHER STATES: sunny baseline; dust and UV only, never green.
- LIT/UNLIT: unlit always (LIGHT=TERRITORY).
- ANIMATION: static.

## E. HOW
- EXACT SIZE: 44px corpus cell; post ~5px wide, 18px tall; the cable is
  one continuous 1px line spanning the full cell.
- VIEW: the world's three-quarter 45 - ellipse cap on the post, shaft
  with a lit west face and shadowed east, foot shadow south.
- PALETTE: harvested only - galv steel (TF-ART-012), rust (TF-ART-010),
  pale concrete fill (TF-ART-018). No purple.
- LIGHT: one sky light, top-lit; no self-light.
- SHADOWS: the post's own small foot shadow and the cable's 1px whisper
  shadow only.
- SCALE ANCHORS: a 5px-wide post in a 44px cell is a real ~20 cm bollard
  in a 0.87 m cell; cable at cap height.
- WEAR LEVEL: variant 0 pale concrete-filled, variant 1 rusted through -
  half the depot's posts have not been painted since the crash.
- VARIANTS: two posts, two cable sags per axis (bp_post_0/1,
  bp_cable_h_0/1, bp_cable_v_0/1), picked by th().
- BASE: RGBA riding on bought gravel drawn first by the wiring - the
  yard's own ground.

## F. THE CAPTION
```json
{
  "id": "TF-ART-022",
  "name": "barricade posts - concrete-filled steel posts strung with cable",
  "layer": "ground",
  "solid": false,
  "enter": false,
  "district_families": ["arsenal"],
  "best_time": "both",
  "best_location": "the storage ground around the magazines and traverses",
  "place_next_to": ["storage ground", "earth-covered magazine", "concrete arch / traverse", "service lane"],
  "never_next_to": ["any district that is not the arsenal", "a gate cell"],
  "weather_ok": ["sunny", "cloudy"],
  "acts": [1],
  "edge_contract": "self-seamless cable spans (ends pinned at the same edge height); single placement posts",
  "tags": ["arsenal", "barricade", "bollard", "post", "cable", "depot"],
  "anim": "static"
}
```

## G. REFERENCES
- APPROVED ANCHOR: banks/tileforms/TF-ART-012_CANDIDATES_8_8_26.json
  (parapet_galv_run_n_a - cap and cable steel harvested from it).
- NAMED OUTSIDE REFERENCE: Jagged Alliance 2's military-base maps and
  the ARMA depot templates both draw perimeter posts as SHORT PALE PINS
  with a single connecting line - the two-element read (pin + line) this
  kit uses; neither draws the cable as dots.
- REAL-WORLD GROUNDING: US Army ammunition depots (Hawthorne, Nevada is
  the canonical one, an hour from Vegas) control vehicle movement across
  their storage grounds with lines of concrete-filled steel posts strung
  with steel cable between the magazine rows - not walls, because blast
  safety wants OPEN ground - and on satellite those lines read exactly
  as the measured sparse rows: dotted pins marching across bare ground
  between the igloos, denser at issue points, absent on the lanes.
- ALSO OPENED IN CODE: banks/tileforms/TF-ART-010_CANDIDATES_8_8_26.json
  (rust) and banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json (pale
  concrete fill).

## H. DON'T WANT
- NOT a fence or wall - blast safety wants open ground; posts and cable
  only.
- NOT a dotted cable (dots-as-texture banned 8/21) - one continuous 1px
  sagging line.
- NOT solid cells - the walk passes these; they are visual control, not
  collision (occupancy is the world's ruling, not this kit's).
- NOT reflective paint bands or lettering (words are his).
- NOT posts on unnamed cells - every post stands where the world says.

## I. ACCEPTANCE
- [x] Cooked from approved banks only (REUSE CHECK in the cook docstring)
- [x] ON THE REAL SURFACE: verified live at the arsenal (cell 47,34) -
      post lines with cable spans across the storage ground
- [x] No purple, no self-light, no readable text, no dot stipple
- [x] Caption JSON parses and matches sections C/D

## J. ADMIN
- STATUS: COOKED AND WIRED 8/24/26 under EVERYTHING IS A THUMB (8/9):
  bank banks/tileforms/TF-ART-022_CANDIDATES_8_24_26.json (6 pieces),
  cook tools/tfcook/TF-ART-022_barricade_post_cook.py, wired in the run
  slice's named-cell pass (cable spans join along the run axis, post on
  top, all riding on bought gravel). Live frame:
  records/target/ART_WIRED_TF-ART-022.png, card in the ART tab.
  | REQUESTED BY: ART lane (inventory ranking) | DATE: 8/24/26
  | PRIORITY: HIGH
- BOARD ROW #: 94 | VERDICT: —
