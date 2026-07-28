# TILE FORM TF-CITY-008 — THE THREE-COURSE BUILDING FACADE (base / mid / cap)

## A. IDENTITY
- NAME: The three stacked bands of a tall wall — the dirty bottom, the middle,
  and the top edge where it meets the sky
- FAMILY/SET: CITY FACADE family. One drawing job: base course, mid course,
  cap/parapet course, plus the door-header course that sits above a 2-tall
  doorway in a 3-tall wall.
- THE JOB, ONE SENTENCE: this exists because Paolo ruled every wall carrying a
  door is three tiles tall, and the only way the engine can currently do that
  is to STRETCH one 16-pixel tile to triple height, so a three-storey wall is
  literally the same texture smeared three times.

## B. WHY
- DEMANDED BY: Paolo 7/27, verbatim: "every wall supporting a door should be
  three tiles tall you know that's what I'm trying to tell you"; the resulting
  law, laws/BOHEMIA_ADDENDUM_THREE_TILE_WALL_7_27_26.md, which set WALL_H=3;
  the MOBILE RENDER CONTRACT, which BANS non-integer scale and aspect changes —
  a rule the current implementation only satisfies by caching its stretch,
  which is a legal workaround, not a right answer.
- WHAT LOOKS BROKEN TODAY: measured in the CITY frame's own source. The
  function is `tallTex(pool,v,n)` and its comment says exactly what it does:
  "The approved door tile is 16x16 and the slot is one cell wide by two tall.
  As a single draw that is an aspect change... Derive it ONCE into a 16x32
  canvas and blit that at 1:1 forever after." It takes ONE tile and calls
  `drawImage(im,0,0,w,h*n)` — a pure vertical stretch. So on the CITY tab a
  3-tall facade has no base course, no mid band, no cap, and its texture's
  vertical detail is three times too tall. The wall reads as a smear.
  Separately, the same function derives the DOOR at 16x32 the same way, so the
  header above a door in a 3-tall wall is a stretched door.
- SHOPPING CHECK: records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md. STARTER
  TILESET (42) enumerated: it has `wall_0/1/2`, `wall_base`, `wall_boarded`,
  `wall_window`, `wall_under_eave`, `wall_end_l/r` — a complete vocabulary for
  a ONE-STOREY house whose wall is 2-3 rows of a single storey, and its
  `roof_parapet` is a flat-roof top, not a wall cap. There is no course system
  for a genuinely tall wall. HOUSE SKINS (30) opened: wall_plain_8..11,
  wall_window_12..14, wall_boarded_15..17, wall_door_18..20 — all single-band
  field tiles in the same one-storey vocabulary. PERIMETER WALL POOL (26)
  checked and disqualified BY LAW, not by taste: the WALL TAXONOMY law forbids
  perimeter and building walls sharing a pool, and TF-CITY-004 is the
  perimeter's own joinery ask. HD PACK judged tiles: the building packs carry
  facade material but not a base/mid/cap course system in our value bands.
  Nothing in the index makes a wall tall.

## C. WHERE
- SURFACE + TAB: CITY (the tab where WALL_H=3 and facadePass() runs; walked
  mode). The RUN uses its own stack resolver and takes this second — flagged
  honestly, because Paolo plays the run and this form's first surface is the
  city tab.
- DISTRICT FAMILIES: downtown, commercial, industrial, apartment, campus,
  courthouse, library, school — every district whose buildings are taller than
  a tract house. NOT the suburb (a one-storey house is correctly served by the
  existing 2-3 row vocabulary plus the house skins).
- LAYER: structure
- SOLID? yes — ENTERABLE? no in itself; the DOOR in it is the portal, and
  INTERIOR-MATCHES-EXTERIOR means whatever is behind it is exactly the
  footprint w x h.
- MUST SIT BESIDE: itself vertically in the fixed order base -> mid -> cap;
  the door-header course directly above a 2-tall door; ground at the bottom;
  sky or roof at the top.
- NEVER BESIDE: out of order (a base course above a mid course is the
  kill condition and should be impossible by construction); a perimeter wall
  tile (WALL TAXONOMY); the eave course of a pitched roof (that is a house).
- EDGE CONTRACT: WANG-16 edge set — vertical cases with left/right ends.
  Horizontal edges must hash to the course above and below; the mid course
  must be SELF-SEAMLESS vertically so a five-storey wall is base + N mid +
  cap without a visible repeat.

## D. WHEN
- ACT: 1
- BEST TIME: both, and this form carries the SEE-THROUGH requirement Paolo
  ruled in the same breath as the height: "this game needs to focus on like
  working on an opacity filter for when I'm in front of a wall". The engine
  already draws the facade in two halves around the player at WALL_SEE=0.35.
  The ART implication is that these courses must READ at 35% opacity — a
  course whose whole identity is a fine texture disappears when it goes
  see-through, so the courses need VALUE STRUCTURE, not just grain.
- WEATHER STATES: sunny baseline; cloudy no change; RAIN-WET — a wall wets
  from the BASE up, which is a real and specific thing and is exactly what a
  base course is for. Value shift only.
- LIT/UNLIT: no self-light in the art. Windows are DEAD DARK GLASS
  (constitution glow rule, max hot frac 0.02, target measures 0.0001). Inside
  the powered 12% the light pass does the work.
- ANIMATION: static.

## E. HOW
- EXACT SIZE: 44 x 44 px per tile, one course per tile, matching the frozen
  starter tileset's cell_px. Authored NATIVE — the entire point of this form
  is to stop a 16px tile being stretched to 32 or 48, so any resampling
  anywhere in its path is a fail.
- VIEW: 45-degree world view. A tall wall is a FRONT FACE and its cap must
  show a sliver of sky-lit TOP, or the building reads as a flat sticker. This
  is the difference between a 45 game and a 2D scroller and it is the whole
  reason the 45 DEGREE ART LAW exists.
- PALETTE: constitution ceiling. Value band: **wall** (mean 96.0, lo 37.5, hi
  167.6) for base and mid; the cap's sky-facing sliver belongs in **top**
  (110.2, 72.8-137.4). The constitution's own note explains why walls are the
  darkest band — "the walls are the faces sitting in their own eave shadow" —
  and the base course should be the darkest thing in it.
- LIGHT: upper left, shadows down and to the right. NO keyline. NO dither.
- SHADOWS: none baked. A 3-tall wall casts a long shadow and that is the
  runtime pass; it is also why the base course must not have a shadow painted
  into it, or the building gets two.
- SCALE ANCHORS: the 2-tile door IS the anchor and it is load-bearing here —
  three courses must read as roughly a storey and a half of real building
  against a human-height door. The 7/27 law's whole point is that a door needs
  a wall taller than itself.
- WEAR LEVEL: ten years, and the courses should each fail differently, which
  is the argument for having them at all: the BASE takes the splash line, the
  kicked dirt, the spalled stucco and the boarded lower windows; the MID is
  the cleanest, just sun-faded; the CAP is where the flashing lifts and the
  parapet coping cracks. A single stretched texture cannot say any of that.
- VARIANTS: base, mid, cap, door-header — four courses, cooked per facade
  material as the districts need them. Colorways ride the material.

## F. THE CAPTION
```json
{
  "id": "TF-CITY-008",
  "name": "three-course building facade",
  "layer": "structure",
  "solid": true,
  "enter": false,
  "district_families": ["downtown", "commercial", "industrial", "apartment", "campus", "courthouse", "library", "school"],
  "best_time": "any",
  "best_location": "any building wall taller than one storey; the header course directly above a 2-tall door",
  "place_next_to": ["itself in order base->mid->cap", "2-tall door below the header", "ground", "roof"],
  "never_next_to": ["out of course order", "perimeter wall tile", "pitched-roof eave course"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "wang-16",
  "anim": null,
  "tags": ["structure", "facade", "course", "three-tile-wall", "see-through", "city"]
}
```

## G. REFERENCES
- APPROVED ANCHOR: banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt — the frozen
  CBB starter tileset's wall family (`wall_0/1/2`,
  `wall_base`, `wall_under_eave`, `wall_end_l/r`) — its material and its
  published seam rings are the truth this extends upward. `wall_base` in
  particular already IS a base course for a one-storey house ("thirty years of
  dust", per the run's own comment) and is the direct model for the tall
  version.
- NAMED OUTSIDE REFERENCE: Project Zomboid's multi-storey wall sets for the
  COURSE SYSTEM itself — base, storey, cornice as separate tiles is why its
  tall buildings read at a top-down angle and ours do not. Take the system,
  never the palette. Secondary: Streets of Rogue for how a tall wall stays
  legible when the player is standing behind it, which is the see-through case.
- REAL-WORLD GROUNDING: the Las Vegas valley's non-residential building stock
  is overwhelmingly one-to-three storey stucco-over-frame and tilt-up concrete
  with a FLAT roof behind a PARAPET — the parapet is the single most
  characteristic silhouette in the valley outside the Strip, and it is exactly
  the "cap course" this form asks for. The base course is real too: valley
  buildings take a hard splash-and-dust line at the bottom from monsoon runoff
  and blown silt, and after a decade with no washing that line is the most
  visible ageing on any wall in the city. Vegas facades do NOT weather like
  eastern brick; they chalk, fade unevenly on the south face, and spall at the
  bottom.

## H. DON'T WANT
- NOT a stretched texture. That is the bug being fixed. If the cook produces
  one tile intended to be scaled, it has failed the form.
- NOT a flat sticker facade. A cap with no sky-lit top violates the 45 law.
- NOT a black keyline between courses. The course change is a VALUE STEP.
- NOT eastern/brick weathering — no moss, no water streaks down from window
  sills, no green. Vegas chalks and spalls.
- NOT a lit window, ever. Dead dark glass.
- NOT the perimeter wall pool. WALL TAXONOMY, and it is the exact mistake
  Paolo already caught once this week.
- NOT so fine-grained that it vanishes at 35% opacity. The see-through pass is
  a hard design constraint on this specific form.

## I. ACCEPTANCE
- [ ] Seam ring hash: each course's horizontal edges hash to the course it
      meets; the MID course's vertical wrap MEASURED (it repeats N times in a
      tall building, so a wrap discontinuity is a stripe up the facade)
- [ ] Palette ceiling + **wall** band for base/mid, **top** for the cap's sky
      sliver + one-light + no-keyline + no-dither + no-glow checks green
- [ ] Squint test: at walk zoom the wall must read as a BUILDING WITH A TOP,
      not a texture
- [ ] SEE-THROUGH TEST (specific to this form): rendered at WALL_SEE=0.35 and
      still legible as three distinct courses — that is Paolo's own ruling
      being satisfied, not a nice-to-have
- [ ] 3x1 vertical stack proof (base/mid/cap) plus a FIVE-STOREY proof
      (base + 3 mid + cap) to prove the mid course does not stripe
- [ ] ON THE REAL SURFACE: the CITY tab, walked mode, standing in front of a
      3-tall wall, beside today's stretched render
- [ ] Native 44x44 with no resampling anywhere in the path
- [ ] Caption JSON parses and matches C/D

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: CITY lane (measured 7/28 in the CITY frame's
  own tallTex(), which is a documented vertical stretch of a single tile)
  | DATE: 7/28/26 | PRIORITY: MED
- BOARD ROW #: 67 | VERDICT: —
