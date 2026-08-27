# TILE FORM TF-ART-032 — THE WASH CHANNEL (invert + banks)

## A. IDENTITY
- NAME: The wash channel — the concrete invert and its sloped banks,
  the riprap form's promised second half
- FAMILY/SET: DEAD WATER — sibling of the riprap (TF-ART-023) on the
  same channel.
- THE JOB, ONE SENTENCE: 9,694 cells of the flood channel's own
  concrete (invert x5646, bank x4048) draw as bare ground.

## B. WHY
- DEMANDED BY: TF-ART-023's own form ("the channel bank and invert are
  next") and the fresh 8/27 ranking, where they were the wash's two
  remaining unclaimed names.
- WHAT LOOKS BROKEN TODAY: the valley's flood-control spine - the
  hardest-engineered ground in the county - reads as dirt between two
  riprap strips.
- MEASURED 8/27 on the walked world (cell 19,43): 'channel invert'
  x5646, 'channel bank' x4048; the invert spreads into wide basin
  reaches as well as narrow runs, which is what forced the centreline
  rule below.
- SHOPPING CHECK: the approved kerb pale
  (banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json) and the approved
  dirt (banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt) are the
  two pools; no approved bank holds channel concrete.

## C. WHERE
- SURFACE + TAB: RUN (the walk) and CITY (human mode).
- DISTRICT FAMILIES: wash.
- LAYER: ground.
- SOLID? no - ENTERABLE? no.
- MUST SIT BESIDE: the riprap armor, each other, the maintenance road.
- EDGE CONTRACT: self-seamless with an axis rule - the channel axis
  comes from the cell's own name-run (longer walk wins); the low-flow
  stain rides ONLY the centreline cells and is edge-pinned to the tile
  centre at both edges so the line joins cell to cell; off-centre
  invert is plain jointed concrete; banks streak DOWN their slope.
- NEVER BESIDE: nothing outside the wash.

## D. WHEN
- ACT: 1
- BEST TIME: both.
- WEATHER STATES: sunny baseline - the stain is thirty years old, not
  wet; deep_wet stays weather's.
- LIT/UNLIT: unlit always.
- ANIMATION: static.

## E. HOW
- EXACT SIZE: 44px corpus cell, full-cell opaque tiles.
- VIEW: flat channel planes in the world's three-quarter 45; the bank
  reads darker because a slope holds less light.
- PALETTE: harvested only - channel concrete from the approved kerb
  pale, stain, silt and weeps from the approved dirt DARKENED (the
  first cook mixed raw dirt in and the weeps came out LIGHTER than the
  slope - a weep is a shadow, not a highlight). No purple.
- LIGHT: one sky light; no self-light.
- SHADOWS: none beyond the stains themselves.
- SCALE ANCHORS: joints every 22px = metre panels; the stain ribbon
  7px = the real metre-wide low-flow channel.
- WEAR LEVEL: thirty years - the meander stain of the last flow, silt
  sheets from the last storm, weeps and spalls on the banks.
- VARIANTS: iv_h/v_0/1 (centreline), iv_p_0/1 (plain), bk_h/v_0/1,
  hashed per cell.
- CRAFT: the stain WANDERS inside its envelope (8/1 law - water never
  rules a line); panel joints are machinery and may be straight; no
  dots.

## F. THE CAPTION
```json
{
  "id": "TF-ART-032",
  "name": "wash channel - concrete invert with low-flow stain, sloped banks",
  "layer": "ground",
  "solid": false,
  "enter": false,
  "district_families": ["wash"],
  "best_time": "both",
  "best_location": "the flood channel between its riprap strips",
  "place_next_to": ["riprap", "maintenance (O&M) road", "each other"],
  "never_next_to": ["any district outside the wash"],
  "weather_ok": ["sunny", "cloudy"],
  "acts": [1],
  "edge_contract": "self-seamless - centreline-only stain edge-pinned to the tile centre, plain concrete elsewhere, banks streak downslope",
  "tags": ["wash", "channel", "invert", "bank", "flood"],
  "anim": "static"
}
```

## G. REFERENCES
- APPROVED ANCHOR: banks/tileforms/TF-ART-023_CANDIDATES_8_25_26.json
  (the riprap - this concrete meets that armor along every bank top,
  from the same kerb pale so the join holds).
- NAMED OUTSIDE REFERENCE: the LA River levels in GTA V and every film
  chase shot of it read a dead flood channel as PALE CONCRETE, ONE
  DARK MEANDER LINE and streaked banks - three values, no more, which
  is exactly this family's grammar.
- REAL-WORLD GROUNDING: the Las Vegas Wash and the Flamingo Diversion
  are concrete-lined trapezoidal channels; between storms the invert
  is dry except the dark algae-and-silt stain of the low-flow line
  wandering down its middle, and the banks carry vertical weep streaks
  where groundwater seeps through the panel joints - thirty years
  without maintenance just makes both stains permanent, which is what
  these ten tiles draw.
- ALSO OPENED IN CODE:
  banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt (dirt).

## H. DON'T WANT
- NOT a stain on every cell - the first render striped every invert
  cell at its own offset and read as a BARCODE; the low flow is ONE
  line and only the centreline carries it.
- NOT light weeps - a weep is a shadow, not a highlight.
- NOT wet, no shine, ever - deep_wet stays weather's.
- NOT dots, no purple, no self-light.

## I. ACCEPTANCE
- [x] Cooked from approved banks only (REUSE CHECK in the cook docstring)
- [x] ON THE REAL SURFACE: verified live at the wash (cell 19,43) -
      plain jointed invert with sparse meander fragments in the wide
      basin, streaked banks below the riprap
- [x] No purple, no self-light, no readable text, no stipple
- [x] Caption JSON parses and matches sections C/D

## J. ADMIN
- STATUS: COOKED AND WIRED 8/27/26 under EVERYTHING IS A THUMB (8/9):
  bank banks/tileforms/TF-ART-032_CANDIDATES_8_27_26.json (10 tiles),
  cook tools/tfcook/TF-ART-032_washchannel_cook.py, wired in the run
  slice's named-cell pass ('channel invert' -> centreline stain /
  plain concrete by perpendicular-walk balance; 'channel bank' ->
  downslope streaks by axis). SAME TURN, PURE WIRING: watertreat's
  'dry basin floor' x6920 joined the TF-ART-025 bed tiles (dried
  sludge cracks like a drought bed; zero new pixels). Live frame:
  records/target/ART_WIRED_TF-ART-032.png, card in the ART tab.
  | REQUESTED BY: ART lane (riprap follow-through + fresh ranking)
  | DATE: 8/27/26 | PRIORITY: MED
- BOARD ROW #: 106 | VERDICT: —
