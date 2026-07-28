# TILE FORM TF-RUN-005 — TILT-UP / PRECAST CONCRETE BUILDING SKIN

## A. IDENTITY
- NAME (plain words a person would say): Concrete panel wall — the big blank
  poured-concrete face of a civic building, a jail block or a downtown podium
- FAMILY/SET: TILT-UP PANEL family — panel face, panel joint (the vertical
  seam between two lifted panels), base course, parapet course, corner.
- THE JOB, ONE SENTENCE: this tile exists so that the buildings the world calls
  courthouse, library, cell block and podium stop being made of the same
  cracked house stucco as a suburban living room.

## B. WHY (the need — no ruling, no tile)
- DEMANDED BY: RUN backlog 0b (DISTRICT ART). Measured on the real run surface
  this turn — records/BOHEMIA_RUN_DISTRICT_MATERIAL_SURVEY_7_28_26.md.
- WHAT LOOKS BROKEN TODAY WITHOUT IT: sampled per cell, all rendering as
  `wall_0/1/2` stucco — downtown `podium / mid-rise` ×882, library
  `building (library)` ×682, courthouse `building (courthouse)` ×651, jail
  `building (cell block/admin)` ×424, medical `building` ×394, policestation
  `building (station)` ×334, watertreat control building. That is SEVEN
  district types, including every civic monument in the game, wearing tract
  housing. Downtown at ×882 per cell is the single largest structure count in
  the survey.
- SHOPPING CHECK (records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md):
  - SEAM-FIXED SURFACES `1. Cracked contrete tiles` (42) — **the closest
    near-miss on the board, and it does not cover this.** Rendered and looked
    at this turn: it is cracked concrete PAVING seen from ABOVE, with weeds in
    the cracks. It is a horizontal ground surface. This ask is a VERTICAL FACE
    in the 45-degree view with panel joints and a parapet. Different plane,
    different read. (That bank IS the right answer for concrete GROUND, which
    is why this form does not ask for ground — see the survey's wiring list.)
  - `Wall tiles (1)` / `3. Broken wall tiles` — looked at: medieval masonry and
    ruined battlements. Off-genre.
  - PERIMETER WALL POOL (13 approved) — residential-scale masonry community
    walls, ~2 tiles, wrong scale and wrong social meaning for a courthouse.
  - HOUSE SKINS (30 approved) — residential. Wrong.
  - Genuine hole for the vertical face.

## C. WHERE (place — the game code reads this)
- SURFACE + TAB: RUN (the walk); CITY human mode.
- DISTRICT FAMILIES: downtown, courthouse, cityhall, library, jail,
  policestation, medical, watertreat, terminal, school, chapel.
- LAYER: structure
- SOLID? YES — ENTERABLE? yes via the approved 2-tall door; INSIDE is the
  interior pool's institutional room recipes.
- MUST SIT BESIDE: itself in long runs; its own panel joint every few tiles;
  the approved 2-tall door; sidewalk or concrete pad at the base; parapet/roof
  deck above (the starter set already has `roof_deck` and `roof_parapet`, which
  are the RIGHT roof for this family and are currently barely used).
- NEVER BESIDE: house stucco on the same building; corrugated metal on the same
  building; dead lawn hard against the base (civic buildings meet paving).
- EDGE CONTRACT: SELF-SEAMLESS horizontally within a panel, plus a SINGLE
  PLACEMENT panel-joint tile dropped at a regular interval. That is how real
  tilt-up reads: big blank fields punctuated by joints, NOT a repeating
  texture. Getting the joint rhythm right is most of this asset.

## D. WHEN (time & state — the invisible-caption inputs)
- ACT: 1
- BEST TIME: both. Concrete is the least time-sensitive material in the game —
  which is a feature: these are the buildings that look the same the day the
  power dies and ten years later. At night it is pure ambient.
- WEATHER STATES: sunny baseline; cloudy no change; RAIN: concrete darkens
  visibly and unevenly (this is the material where rain reads best on a
  vertical face) — a wet colorway is wanted, value shift only.
- LIT/UNLIT variant needed? No self-lit variant. Civic buildings are prime
  LIGHT=TERRITORY candidates (a lit courthouse is a statement about who holds
  it) so it must receive light cleanly across a big blank field without
  banding.
- ANIMATION: static.

## E. HOW (build spec — the art lane's one-shot recipe)
- EXACT SIZE in px: frozen starter tileset native cell, 1x1, slotting into the
  run's existing 4-course building stack.
- VIEW: 45-degree world view — VERTICAL FACE, three-quarter, never flat
  side-on (45 DEGREE ART LAW).
- PALETTE: constitution ceiling; STRUCTURE value band. Concrete is a NARROW
  value range with almost no hue — the hardest thing here is making a big blank
  grey field that is not boring and not noisy. The answer is form and joints,
  not texture.
- LIGHT: the one global direction. NO keyline. NO dither. A large flat field is
  exactly where dither is most tempting and most visible — it is banned.
- SHADOWS: none baked; the parapet's own shadow line belongs to the roof
  course.
- SCALE ANCHORS: the approved 2-tall door; real tilt-up panels are 20-30ft wide
  and a full storey tall, so a panel joint every 4-6 tiles is right. Too many
  joints and it reads as cinder block, which is a different building.
- WEAR LEVEL: dead world. Rain streaking below every ledge and window head
  (concrete's signature aging), efflorescence bloom at the base, hairline
  cracks radiating from openings, staining where downspouts used to run. The
  key Vegas note: very little biological growth — no moss, no algae — so the
  weathering is all DUST, UV and streak, never green.
- VARIANTS: plain panel, panel-with-joint, base course, parapet course, and one
  "boarded opening" variant. Colorways: raw grey and the painted-tan civic
  variant (colorways, not new forms).

## F. THE CAPTION (ships with the tile — machine-readable)
```json
{
  "id": "TF-RUN-005",
  "name": "tilt-up / precast concrete building skin",
  "layer": "structure",
  "solid": true,
  "enter": true,
  "district_families": ["downtown", "courthouse", "cityhall", "library", "jail", "policestation", "medical", "watertreat", "terminal", "school", "chapel"],
  "best_time": "any; the material that looks the same before and after the collapse",
  "best_location": "the face of any civic, institutional or podium mass; joints every 4-6 tiles",
  "place_next_to": ["tilt-up concrete panel", "panel joint", "2-tall door", "sidewalk", "cracked concrete pad", "roof parapet", "roof deck"],
  "never_next_to": ["house stucco on the same building", "corrugated metal on the same building", "dead lawn at the base course"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "self-seamless horizontally + single-placement panel joint at interval",
  "anim": null,
  "tags": ["structure", "concrete", "civic", "wall-face", "big-blank-field", "rain-reads-well"]
}
```

## G. REFERENCES (all three required)
- APPROVED ANCHOR: the frozen starter tileset's `roof_deck` and `roof_parapet`
  — the two tiles that already exist for FLAT-ROOFED buildings and are barely
  used because nothing in the run is built to wear them. This family is their
  missing body; deliver it value-matched to those two and to `wall_base`.
- NAMED OUTSIDE REFERENCE: **Pocket City 2** for how large civic masses stay
  quiet and readable at small scale without texture noise — the lesson is that
  a big building earns its read from SILHOUETTE AND JOINTS, not surface
  detail. **Disco Elysium**'s concrete for streak-and-stain weathering on a
  vertical face done with value alone.
- REAL-WORLD GROUNDING: Las Vegas's civic and industrial stock from the 70s
  onward is tilt-up: panels cast flat on the slab, lifted into place, joints
  caulked. You can read the construction method off the finished building —
  that is the detail that makes it truthful. Local aging is specifically DRY:
  no moss or algae (which is what makes concrete look green-black in wetter
  cities), instead UV chalking, wind-driven dust settling on every ledge, and
  hard dark rain streaks below openings from the few storms a year. Caulk in
  the panel joints goes brittle, cracks and drops out, leaving a dark line.

## H. DON'T WANT (the anti-reference)
- NOT house stucco (the defect this kills).
- NOT cinder block. Too many joints turns tilt-up into CMU, which is a
  different, cheaper, smaller-scale building and reads wrong for a courthouse.
- NOT mossy, algae-stained, or green-black. Wrong climate entirely.
- NOT brutalist-textured (no board-form timber grain, no exposed aggregate
  feature panels) — that is an architectural statement Vegas's stock does not
  make, and it would fight the quiet the districts need.
- NOT noisy. A big blank field is CORRECT here; the temptation to fill it with
  texture is the failure mode.
- NOT dithered — a large flat area is where dither is most visible and it is
  banned by the constitution.
- NOT flat side-on. 45 DEGREE ART LAW.

## I. ACCEPTANCE (what the machine proves BEFORE Paolo ever sees it)
- [ ] Horizontal seam measured across a 10-tile civic face; no edge darkening
- [ ] JOINT RHYTHM PROVED: a 12-tile run with joints at the specified interval
      reads as lifted panels, not as block work (this is the judgement call the
      form exists to pre-answer)
- [ ] Palette ceiling + STRUCTURE value band + one-light + NO-DITHER checks
      green across a large flat field specifically
- [ ] Drops into the existing 4-course stack with no renderer change, and pairs
      with `roof_parapet`/`roof_deck` above
- [ ] 3x3 tiled proof + a long-run proof
- [ ] ON THE REAL SURFACE: screenshot of downtown (×882 structure tiles, the
      largest in the survey) wearing it, beside the current stucco render
- [ ] Caption JSON parses and matches sections C/D

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: RUN lane (0b district-material survey, 7/28)
  | DATE: 7/28/26 | PRIORITY: HIGH
- BOARD ROW #: 12 | VERDICT: —
