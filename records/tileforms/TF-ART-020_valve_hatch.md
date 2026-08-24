# TILE FORM TF-ART-020 — VALVE / HATCH (the reservoir's lids and vault covers)

## A. IDENTITY
- NAME: Valve / hatch — the round access lids on the tank pad and the
  two-leaf vault covers along the buried transmission mains
- FAMILY/SET: RESERVOIR HARDWARE — the first wired member of the
  reservoir's own vocabulary (tank pad, tank roof, overflow and
  transmission main are siblings still on the ranking).
- THE JOB, ONE SENTENCE: 1,434 'valve / hatch' cells fall to the gravel
  fallback today, so the waterworks' concrete reads pockmarked with dirt
  where its service hardware should be.

## B. WHY
- DEMANDED BY: the inventory ranking (ART lane's standing instrument):
  after the arsenal berms, 'valve / hatch' x1434 was the largest named
  surface still drawing as a fallback lie.
- WHAT LOOKS BROKEN TODAY: every valve and hatch cell draws the yard
  gravel fallback - dirt pockmarks across the pad ring and winding dirt
  trails through the setback where the buried mains run.
- MEASURED 8/24 on the walked world (geometry first, art second): 1,434
  cells at the reservoir - dozens of true 1x1 SINGLES (a lone lid on the
  pad) plus long SPARSE runs following the pipe corridors (4x51, 9x34,
  8x32 bounding boxes, 40-60% filled - service lines, not slabs).
  Neighbour census: tank pad 1058, overflow 326, transmission main 127,
  water tank 109 - the hardware lives on the pad ring and the mains.
- SHOPPING CHECK: banks/tileforms/TF-ART-012_CANDIDATES_8_8_26.json
  (approved galv steel) and banks/tileforms/TF-ART-010_CANDIDATES_8_8_26.json
  (approved rust) exist and cover the metal; nothing approved covers a
  round lid ellipse or a vault leaf pair, so those two shapes are cooked
  from the approved pools rather than shopped whole.

## C. WHERE
- SURFACE + TAB: RUN (the walk) and CITY (human mode); at MAP zoom the
  hardware is sub-pixel and deliberately absent.
- DISTRICT FAMILIES: reservoir only - the name is the reservoir's own.
- LAYER: ground (a lid is a floor plate; nothing here has height worth a
  structure course).
- SOLID? no - ENTERABLE? no (a locked vault is a story hook, not a door;
  portals are canon Paolo places).
- MUST SIT BESIDE: tank pad concrete, overflow channels, transmission
  main corridors, the valve house building - exactly the measured census.
- EDGE CONTRACT: single placement - every piece is complete inside its
  own cell (the run READ comes from the wiring repeating vault covers
  down the corridor, never from tile-edge continuation).
- NEVER BESIDE: nothing outside the reservoir district; never on a road
  or inside a building footprint.

## D. WHEN
- ACT: 1
- BEST TIME: both.
- WEATHER STATES: sunny baseline; dust and UV only, never green.
- LIT/UNLIT: unlit always - nobody owns light over the dead waterworks
  (LIGHT=TERRITORY).
- ANIMATION: static.

## E. HOW
- EXACT SIZE: 44px corpus cell, one piece per cell.
- VIEW: the world's three-quarter 45 - the round lid is an ELLIPSE
  (rx 11, ry 9), never a circle; the vault leaves are planes with a lit
  north/west edge and a shadowed south/east edge.
- PALETTE: harvested only - galv steel greys (TF-ART-012
  parapet_galv_run_n_a), rust (TF-ART-010 rail_plate_0), pale concrete
  collar (TF-ART-018 kerb_return_ne). No purple, ever.
- LIGHT: one sky light, top-lit; no self-light.
- SHADOWS: a soft baked foot shadow under the round lid's south rim only
  (it is part of the object's read); no long cast shadows (the runtime
  pass owns those).
- SCALE ANCHORS: the round lid is ~22px across in a 44px cell - a real
  0.9 m manhole in a 0.87 m cell; the vault cover fills most of its cell
  the way a 1.2 m utility vault does.
- WEAR LEVEL: thirty years dead - dusty steel, rust weep off the low rim
  on one variant, a rust bloom on one vault leaf.
- VARIANTS: two per piece (vh_round_0/1, vh_vault_h_0/1, vh_vault_v_0/1),
  picked by the th() hash; the axis pair follows the run direction.
- BASE: both pieces are RGBA overlays that RIDE ON bought concrete drawn
  first by the wiring, so a hatch cell is pad-with-hardware, never its
  own material island.

## F. THE CAPTION
```json
{
  "id": "TF-ART-020",
  "name": "valve and hatch hardware - round access lids and two-leaf vault covers",
  "layer": "ground",
  "solid": false,
  "enter": false,
  "district_families": ["reservoir"],
  "best_time": "both",
  "best_location": "the tank pad ring and the buried transmission-main corridors",
  "place_next_to": ["tank pad", "overflow", "transmission main", "water tank", "building (valve house)"],
  "never_next_to": ["any district that is not the reservoir", "a road surface", "a building interior"],
  "weather_ok": ["sunny", "cloudy"],
  "acts": [1],
  "edge_contract": "single placement - every piece complete inside its own cell; runs read from wiring repetition",
  "tags": ["reservoir", "valve", "hatch", "vault", "manhole", "waterworks"],
  "anim": "static"
}
```

## G. REFERENCES
- APPROVED ANCHOR: banks/tileforms/TF-ART-012_CANDIDATES_8_8_26.json
  (parapet_galv_run_n_a - the lid steel is harvested from it, so the
  hardware matches the galv roofs already in the world).
- NAMED OUTSIDE REFERENCE: Cities: Skylines' water-facility props and the
  GTA2 street kit's manhole language - both read utility hardware as a
  SMALL DARK ELLIPSE ON A LIGHT COLLAR at map scale, the exact two-value
  read this kit uses; neither draws bolt stipple at this size.
- REAL-WORLD GROUNDING: a US water utility services a buried transmission
  main through valve vaults at regular intervals - precast concrete boxes
  with two-leaf steel traffic covers about 1.2 m across - while the tank
  pad itself carries round 0.9 m access manholes to the drain and inlet
  works; Las Vegas Valley Water District tank sites (Fort Apache, the
  Charleston Heights tanks) show exactly this pattern on satellite: a lid
  ring around each tank and a dotted service line marching off along the
  main's easement through bare desert setback.
- ALSO OPENED IN CODE: banks/tileforms/TF-ART-010_CANDIDATES_8_8_26.json
  (rust) and banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json (pale
  concrete collar).

## H. DON'T WANT
- NOT a manhole circle - the 45 view makes every round lid an ellipse.
- NOT bolt-ring stipple - dots-as-texture is banned (8/21); the read is
  value planes and one hinge bar.
- NOT a bright concrete island per cell - the base is the pad's own
  bought concrete so the hardware belongs to its ground.
- NOT utility markings, stencils or lettering on any lid (words are his).
- NOT scattered randomly - every piece stands on a cell the world named.

## I. ACCEPTANCE
- [x] Cooked from approved banks only (REUSE CHECK in the cook docstring)
- [x] ON THE REAL SURFACE: verified live at the reservoir (cell 60,10) -
      lids in the yard, vault chains along the corridors
- [x] No purple, no self-light, no readable text, no dot stipple
- [x] Caption JSON parses and matches sections C/D

## J. ADMIN
- STATUS: COOKED AND WIRED 8/24/26 under EVERYTHING IS A THUMB (8/9):
  bank banks/tileforms/TF-ART-020_CANDIDATES_8_24_26.json (6 pieces),
  cook tools/tfcook/TF-ART-020_valve_hatch_cook.py, wired in the run
  slice's named-cell pass (singles get the round lid, cells with a
  same-name neighbour get the vault cover on the run's axis, everything
  rides on bought concrete). Live frame:
  records/target/ART_WIRED_TF-ART-020.png, card in the ART tab.
  Twentieth wired family. | REQUESTED BY: ART lane (inventory ranking)
  | DATE: 8/24/26 | PRIORITY: HIGH
- BOARD ROW #: 96 | VERDICT: —
