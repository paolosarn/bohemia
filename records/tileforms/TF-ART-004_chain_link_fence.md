# TILE FORM TF-ART-004 — CHAIN-LINK FENCE (AND ITS RAZOR-WIRE VARIANT)

## A. IDENTITY
- NAME: Chain-link fence (and its razor-wire variant)
- FAMILY/SET: CHAIN-LINK family — plain run, top rail, corner post, gate (closed/open/sagging), razor-wire top for secure sites
- THE JOB, ONE SENTENCE: this tile family exists so that the fenced districts read as fenced, since a fence is what separates "you may walk here" from "somebody owned this" in every industrial lot in the valley.

## B. WHY
- DEMANDED BY: the district gates themselves assert fencing: storage ("fortress fence"), salvage ("fenced"), landfill ("fenced"), farm ("fenced"), substation ("double-fenced"), jail ("razor-wire wall"), solar, police impound. Every one of those renders a fence today out of something that is not a fence.
- WHAT LOOKS BROKEN TODAY: secure sites do not read as secure. The self-storage fortress fence, which is the district's whole character, is not drawn as chain-link
- SHOPPING CHECK: records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md walked in full. STARTER TILESET (42, CBB, md5-locked) is the only approved TILE set and it is one residential street: asphalt, sidewalk/kerb, gravel yard, concrete slab, dirt, stucco wall, terracotta roof, flat deck. PERIMETER WALL POOL (26 approved entries) checked and it is the near-miss that matters: those are SOLID masonry suburb boundary walls, approved for exactly that, and a solid wall is the opposite of a fence — you cannot see the yard through it, which is the entire point of chain-link on a salvage or storage lot. HD PACK UP set has no fencing family. Nothing in the index claims a see-through barrier.

## C. WHERE
- SURFACE + TAB: RUN + CITY; at map zoom it is the district outline, not an icon
- DISTRICT FAMILIES: self-storage, salvage yard, landfill, farm, substation, jail, solar, battery, police impound, school, railyard, water treatment
- LAYER: structure
- SOLID? yes — but SEE-THROUGH, which is the whole design problem: it blocks the body and not the eye — ENTERABLE? no — the GATE tile is the portal
- MUST SIT BESIDE: itself in long runs; its own corner post; CMU block (a fence often starts where a wall ends); desert ground and gravel at its base; the gate
- NEVER BESIDE: never around a house lot (suburbs get the approved masonry wall — that is a Paolo-approved distinction and this must not blur it); never indoors
- EDGE CONTRACT: SELF-SEAMLESS horizontally with a declared post pitch (posts must land on a rhythm, not wherever a tile boundary falls); corner and gate are SINGLE PLACEMENT

## D. WHEN
- ACT: 1
- BEST TIME: both; at night a lit lot throws the diamond pattern as a real shadow, which is free atmosphere from the existing shadow pass
- WEATHER STATES: sunny baseline; RAIN barely changes it; wind-blown trash caught in the bottom of the mesh is the wear detail that sells it
- LIT/UNLIT: no
- ANIMATION: static

## E. HOW
- EXACT SIZE: 44 px cell; a real fence is 6ft (storage/salvage 8ft), so ~2.5-3.5 cells tall at CELL_M 0.75 — this is a MULTI-CELL vertical family like the wall
- VIEW: 45-degree world view; the mesh is the hard part — it must read as a see-through plane, not a grey rectangle
- PALETTE: constitution ceiling; STRUCTURE band but LOW CONTRAST on purpose — the mesh should sit quiet and let the yard behind it read; galvanised grey family
- LIGHT: the one global direction, upper LEFT. NO keyline. NO dither.
- SHADOWS: none baked; the diamond shadow is a runtime pass gift
- SCALE ANCHORS: 6ft fence against a 1.75m human is the entire scale read; posts every 10ft = ~4 cells
- WEAR LEVEL: galvanising dull, mesh pushed out of shape where people climbed or cut it, one panel peeled back at a corner (that is how people actually get in), trash in the bottom courses
- VARIANTS: plain run, top-rail run, corner post, gate closed, gate sagging open, razor-wire top (jail/substation only)

## F. THE CAPTION
```json
{
  "id": "TF-ART-004",
  "name": "chain-link fence",
  "layer": "structure",
  "solid": true,
  "enter": false,
  "district_families": [
    "self-storage",
    "salvage yard",
    "landfill",
    "farm",
    "substation",
    "jail",
    "solar",
    "battery",
    "police impound",
    "school",
    "railyard",
    "water treatment"
  ],
  "best_time": "both",
  "best_location": "the boundary of any owned or secured lot",
  "place_next_to": [
    "chain-link fence",
    "cmu block wall",
    "gravel",
    "desert ground",
    "asphalt"
  ],
  "never_next_to": [
    "suburb house lot",
    "building interior"
  ],
  "weather_ok": [
    "sunny",
    "cloudy",
    "rain"
  ],
  "acts": [
    1
  ],
  "edge_contract": "SELF-SEAMLESS horizontally with a declared post pitch (posts must land on a rhythm, not wherever a tile boundary falls); corner and gate are SINGLE PLACEMENT",
  "anim": null,
  "tags": [
    "structure",
    "barrier",
    "see-through",
    "industrial"
  ]
}
```

## G. REFERENCES
- APPROVED ANCHOR: the approved perimeter wall pool for how a boundary reads in this world and at what value — this is its see-through counterpart, deliberately quieter
- NAMED OUTSIDE REFERENCE: Zomboid's chain-link for the see-through problem specifically: it solves it with a sparse two-value diamond and a strong post, never a dense mesh; the anti-lesson is any fence drawn as fine mesh, which turns to noise the moment the world scrolls
- REAL-WORLD GROUNDING: Clark County industrial fencing is 6-8ft galvanised chain-link, 2in mesh, line posts at 10ft, top rail on the better installs, three-strand barbed or razor on secure sites (substations, jails, impound). In the Mojave the galvanising survives well but the mesh sags and bellies between posts, and the bottom rail fills with wind-driven trash and tumbleweed — that trash line is the most recognisable thing about a real desert fence.

## H. DON'T WANT
- NOT a fine dense mesh — at 44px a real 2in diamond is sub-pixel and becomes exactly the per-pixel noise the craft laws ban
- NOT a solid grey barrier — if you cannot see the yard through it, it is a wall and we already have an approved wall
- NOT the suburb perimeter wall's replacement anywhere (Paolo approved that for houses; this is for industry)
- NOT drawn with a black keyline around every diamond

## I. ACCEPTANCE
- [ ] Seam measured (edge contract above): wrap delta within the normal neighbour
      step, no edge-darkening (the desert-pool lesson)
- [ ] Pixel craft gate green: orphan share, single-use colours, block size 1,
      pillow score, cluster density, set-wide palette
      (laws/BOHEMIA_PIXEL_CRAFT_LAWS_7_27_26.md)
- [ ] Palette ceiling + this layer's value band + one-light checks green
- [ ] Squint test at map zoom (where this family has a map presence)
- [ ] 3x3 TILED PROOF SHEET rendered — never judged as a lone tile
- [ ] ON THE REAL SURFACE: screenshot in place in its district, beside the
      approved anchor named in G
- [ ] Caption JSON parses and matches sections C/D

## J. ADMIN
- STATUS: APPROVED 8/11/26 AND WIRED 8/11/26: thirteen fence-naming districts draw the see-through runs, N-S columns and post hubs (one line one style, ground painted under the mesh, breach 1-in-17 segments); the jail's razor-wire WALL is excluded as a different object. Gates, toppers, slats and the sag/lean variants are the named volume. | REQUESTED BY: ART lane (own queue, breaking down board row 7)
  | DATE: 7/28/26 | PRIORITY: HIGH
- BOARD ROW #: 13 | VERDICT: —
