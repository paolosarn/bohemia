# TILE FORM TF-ART-023 — RIPRAP (the wash's rock armor)

## A. IDENTITY
- NAME: Riprap — the dumped angular rock armoring the flood channel's
  banks against scour
- FAMILY/SET: WASH GROUND — first wired member of the wash's own
  vocabulary (channel bank, invert and the low-flow trickle remain).
- THE JOB, ONE SENTENCE: 936 'riprap' cells fall to the gravel fallback,
  so the channel's armor bands read as bare dirt.

## B. WHY
- DEMANDED BY: the inventory ranking (ART lane's standing instrument):
  the next largest named surface after the arsenal barricades.
- WHAT LOOKS BROKEN TODAY: the two long armor strips flanking the
  channel and the scattered rock patches all draw the same yard gravel
  as everything else - the wash's most distinctive ground is invisible.
- MEASURED 8/25 on the walked world: 936 cells in 78 blobs - two 115x3
  ARMOR STRIPS running the channel edges plus singles and small patches
  in the dead ground. Neighbour census: desert dead-ground 362,
  maintenance road 237, channel bank 198, flood structure 15.
- SHOPPING CHECK: banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json
  (approved pale concrete) and
  banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt (approved dirt)
  exist and are the two pools this ground is built from; no approved
  bank holds a packed-stone tile.

## C. WHERE
- SURFACE + TAB: RUN (the walk) and CITY (human mode); at MAP zoom the
  strips read as pale channel edging, which is correct.
- DISTRICT FAMILIES: wash only.
- LAYER: ground (a rock field is a floor, rough but walkable - occupancy
  is the world's ruling, not this tile's).
- SOLID? no - ENTERABLE? no.
- MUST SIT BESIDE: channel bank, maintenance road, desert dead-ground -
  exactly the measured census.
- EDGE CONTRACT: self-seamless - the gaps between stones are baked dirt,
  so neighbouring riprap cells read as one continuous rock field; three
  hashed variants break any period.
- NEVER BESIDE: nothing outside the wash; never replacing the channel
  invert's own concrete.

## D. WHEN
- ACT: 1
- BEST TIME: both.
- WEATHER STATES: sunny baseline, always dusty-dry; the rain-wet state
  belongs to the weather lane (deep_wet), not this tile.
- LIT/UNLIT: unlit always (LIGHT=TERRITORY; nobody owns the wash).
- ANIMATION: static.

## E. HOW
- EXACT SIZE: 44px corpus cell, full-cell opaque ground tile.
- VIEW: the world's three-quarter 45 - every stone is a lit north facet
  over a shadowed south facet, sky light from one direction.
- PALETTE: harvested only - the approved kerb pale is the caliche facet
  (a third of the stones warmed toward tan), the approved dirt dimmed is
  the gap earth. No purple.
- LIGHT: one sky light; no self-light.
- SHADOWS: the stones' own facet shadows and gap darkness only.
- SCALE ANCHORS: stones 6-13px in a 44px cell - real 15-50 cm armor
  rock in a 0.87 m cell, the D50 a real channel spec calls for.
- WEAR LEVEL: thirty years of dust; no moss, no water stain.
- VARIANTS: three full tiles (rip_0/1/2) hashed per cell so the 115-cell
  strips never wallpaper.
- CRAFT: no outline rings, no dot stipple - facet value pairs only
  (one pixel of step at this scale, never three).

## F. THE CAPTION
```json
{
  "id": "TF-ART-023",
  "name": "riprap rock armor - packed angular stone on the wash's banks",
  "layer": "ground",
  "solid": false,
  "enter": false,
  "district_families": ["wash"],
  "best_time": "both",
  "best_location": "the armor strips flanking the flood channel and the scattered rock patches in the dead ground",
  "place_next_to": ["channel bank", "maintenance (O&M) road", "desert dead-ground", "concrete flood structure"],
  "never_next_to": ["any district that is not the wash", "the channel invert's concrete"],
  "weather_ok": ["sunny", "cloudy"],
  "acts": [1],
  "edge_contract": "self-seamless - baked dirt gaps make neighbouring cells one continuous rock field; three hashed variants",
  "tags": ["wash", "riprap", "rock", "armor", "channel", "flood"],
  "anim": "static"
}
```

## G. REFERENCES
- APPROVED ANCHOR: banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json
  (kerb_return_ne - the pale pool the stone facets are harvested from,
  so the armor sits in the same value family as the kerbs it meets at
  the maintenance road).
- NAMED OUTSIDE REFERENCE: the rock and scree tiles in Slynyrd's pixel
  landscape studies and Songs of Conquest's cliff-foot rubble - both
  read tumbled stone as PACKED LIT/SHADOW FACET PAIRS with dark gaps
  and no outlines, the exact craft rule this tile follows.
- REAL-WORLD GROUNDING: the Las Vegas Wash and the Clark County flood
  channels are armored with dumped caliche and limestone riprap in
  bands three to five metres wide along the bank toes - pale angular
  rock in the 15-50 cm range - and on satellite those bands read as
  bright rough strips flanking the smooth concrete, exactly the two
  115-cell strips the world measured; the scattered patches match the
  spot armor at culvert mouths and grade breaks.
- ALSO OPENED IN CODE: banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_
  7_28_26.txt (the approved dirt for the gaps).

## H. DON'T WANT
- NOT outlined stones - the 74%-orphan disaster rule: facets, not rings.
- NOT dot stipple (banned 8/21) - stones are 6-13px value masses.
- NOT uniform grey - a third of the rock warms toward tan like real
  caliche.
- NOT wet or mossy - dust only; the wet state is the weather lane's.
- NOT a repeating period - three hashed variants, checked on the long
  strip.

## I. ACCEPTANCE
- [x] Cooked from approved banks only (REUSE CHECK in the cook docstring)
- [x] ON THE REAL SURFACE: verified live at the wash (cell 19,43) - the
      full-width armor strip and the scattered patches
- [x] No purple, no self-light, no readable text, no outlines/stipple
- [x] Caption JSON parses and matches sections C/D

## J. ADMIN
- STATUS: COOKED AND WIRED 8/25/26 under EVERYTHING IS A THUMB (8/9):
  bank banks/tileforms/TF-ART-023_CANDIDATES_8_25_26.json (3 tiles),
  cook tools/tfcook/TF-ART-023_riprap_cook.py, wired in the run slice's
  named-cell pass (full-cell ground, hashed variant per cell). Live
  frame: records/target/ART_WIRED_TF-ART-023.png, card in the ART tab.
  | REQUESTED BY: ART lane (inventory ranking) | DATE: 8/25/26
  | PRIORITY: MED
- BOARD ROW #: 93 | VERDICT: —
