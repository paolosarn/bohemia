# TILE FORM TF-CITY-005 — THE NEIGHBOURHOOD GATE (the one way into a walled
# suburb, currently a blank concrete square)

## A. IDENTITY
- NAME: The entrance to a walled neighbourhood — the gate opening, the gate
  itself, and the little walk-through gate beside it
- FAMILY/SET: SUBURB BORDER WALL family, opening half. One drawing job: the
  vehicle gate opening (its two pilasters and the header), the gate leaf in
  its states, and the pedestrian side gate.
- THE JOB, ONE SENTENCE: this exists because the run currently draws the
  neighbourhood gate — legend code 5, the ONE entrance to a walled community
  and a declared PORTAL in the district's own dossier — as `concrete_0`, a
  plain slab of pavement.

## B. WHY
- DEMANDED BY: the suburb dossier's own LEGEND and LAYERING, which name code 5
  `gate` / kind `gate` / "neighborhood street entrance off the arterial" and
  list it under PORTAL — the DISTRICT DOSSIER LAW says every tile resolves to a
  layer and this one resolves to PORTAL with no portal art; the STREET-AWARE /
  DRIVABLE ACCESS LAW (7/19), which REQUIRES one car entrance on the primary
  street and a PEDESTRIAN gate on the side street at corners, so the
  pedestrian gate is a legally mandated object with no pixels; the suburb
  dossier's circulation line, "gates only on street edges (a corner exits two
  streets)".
- WHAT LOOKS BROKEN TODAY: measured directly in
  slices/BOHEMIA_RUN_SLICE_7_26_26.html — the tile resolver contains, in
  full, `if(c===5) return 'concrete_0';  /* the gate mouth */`. That is it.
  The threshold of every walled neighbourhood in the valley is a concrete
  square identical to a driveway. Screenshot: scratchpad x_gate.png — the
  perimeter reads as an unbroken grey stripe and the entrance is invisible.
  The PEDESTRIAN gate does not exist in the generator's legend at all, so the
  street-aware law's corner requirement has no representation of any kind.
- SHOPPING CHECK: records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md, every row
  that could hold an opening. PERIMETER WALL POOL (26 entries) opened — all
  straight solid runs, no opening, no leaf. DOOR CLIPS
  (banks/BOHEMIA_DOOR_ANIM_BANK_7_13_26.txt, 30 clips) opened and keyed: 29
  residential/industrial SWING doors and 1 industrial rollup, all of them
  BUILDING doors in a 2-tile opening — a vehicle gate is a wall opening wide
  enough for a car and is a different object at a different scale, and the
  WALL TAXONOMY law's logic (perimeter and building never share a pool)
  applies to their openings too. DOOR_EW_BANK checked: east/west edge cases of
  the same building doors. STARTER TILESET: door_top/door_bottom, again a
  building door. Nothing in the index is a gate.

## C. WHERE
- SURFACE + TAB: RUN (the walk — this is the first thing you pass walking out
  of your own neighbourhood) and CITY (human mode). AT MAP ZOOM IT MATTERS:
  the gate is where a district connects to the road network, so it is the
  silhouette's one notch.
- DISTRICT FAMILIES: suburb, gated, estate, apartment, storage, school,
  cemetery — every walled district. The LANDLOCKED DISTRICT LAW makes this
  load-bearing: a landlocked suburb relays its street access through a
  same-family neighbour, and the gate is where that relay physically happens.
- LAYER: portal (the vehicle opening and the pedestrian gate); the pilasters
  and header around it are structure.
- SOLID? the leaf is solid when shut, the opening is not — ENTERABLE? YES.
  What is INSIDE: the neighbourhood itself. This is a district-to-district
  threshold, not a building interior, so INTERIOR-MATCHES-EXTERIOR does not
  apply; what applies is that the opening must be wide enough for the car
  surface the drivable-access law defines.
- MUST SIT BESIDE: perimeter wall straight runs of the SAME key and variant on
  both sides (one wall per community); the neighbourhood road (code 1) running
  through it; the arterial or the street outside.
- NEVER BESIDE: a house wall; a driveway apron (a gate opens onto a STREET,
  never onto a private drive — that is the difference between a gate and a
  garage); another gate on the same wall run (few entries is the whole point);
  a second CAR gate on a side street (street-aware law: corners get a
  PEDESTRIAN gate, never a second car entrance).
- EDGE CONTRACT: SINGLE PLACEMENT — never repeats. Its wall-facing edges must
  hash to the perimeter key it interrupts (constitution seam contract), but
  the piece itself appears once per community.

## D. WHEN
- ACT: 1
- BEST TIME: both, and the gate is the most meaningful night object in a
  suburb: LIGHT=TERRITORY says a lit gate means someone OWNS this
  neighbourhood, and an unlit one means nobody does. Same geometry.
- WEATHER STATES: sunny baseline; cloudy no change; rain darkens the pilasters
  and pools in the gate track — value only.
- LIT/UNLIT: **BOTH VARIANTS REQUIRED, and this is the one place in the form
  where it is not cosmetic.** DEAD IS DEFAULT (the lamp bank's own law); a LIT
  gate is a claim of territory and belongs only to the 12% clustered-power
  communities. The lit variant is rgb-only glow, never an alpha change
  (LEAF-PIXEL law: alpha=motion, rgb-only=glow).
- ANIMATION: static for the leaf states. NOT animated: a powered sliding gate
  needs a motor and act 1 has no power outside the 12%. **If Paolo wants the
  lit-cluster gate to actually slide, that is his ruling and it becomes a
  variant of this form.**

## E. HOW
- EXACT SIZE: 44 x 44 px cells. The vehicle opening is TWO TILES WIDE minimum
  (a car surface), 2 tiles tall to match the perimeter wall's height; the
  pilasters flanking it stand one course PROUDER than the wall, which is how
  every real Vegas entry reads. The pedestrian gate is ONE tile wide.
- VIEW: 45-degree world view. An opening is where the 45 view is most easily
  faked: you must see the THICKNESS of the wall in the reveal of the opening,
  and the pilaster caps must show their tops. A flat notch cut out of a stripe
  is the failure.
- PALETTE: constitution ceiling. Value band: **wall** (96.0, 37.5-167.6) for
  the masonry, **top** (110.2, 72.8-137.4) for the pilaster caps. The gate leaf
  is METAL — tubular steel or wrought iron — and sits LOW in the wall band,
  because it is the darkest thing in the composition and that is what makes an
  opening read as an opening.
- LIGHT: upper left, shadows down and to the right. NO keyline. NO dither. The
  gate leaf's bars are value steps, not black lines — this is the piece most
  likely to smuggle a keyline in as "bars".
- SHADOWS: none baked. A gate's bar shadow across the road is the runtime
  pass's job and it is the best free storytelling in the set.
- SCALE ANCHORS: a real Vegas community vehicle gate opening is ~20-24 ft (two
  lanes or one lane plus a median); the pedestrian gate is a normal 3 ft
  person-width. The 2-tile front door and the garage bay are the human anchors.
  If a car cannot obviously fit through it, it is wrong.
- WEAR LEVEL: ten years. This is where the story is. The realistic states are
  (a) rolled fully back and rusted solid in the open position — the common
  case, because the last thing anyone did was leave; (b) off its track,
  sagging into the opening; (c) shut and chained — which means someone still
  lives here and IS a territorial claim, so it should be rare and meaningful.
  The call box / keypad pedestal is dead, its faceplate pried off for the
  wiring.
- VARIANTS: 3 leaf states (rolled back / off-track / shut-and-chained) x
  lit/unlit, plus the pedestrian gate in open and shut. Per perimeter key
  colorway as needed. Same silhouettes throughout: one form.

## F. THE CAPTION
```json
{
  "id": "TF-CITY-005",
  "name": "neighbourhood gate",
  "layer": "portal",
  "solid": false,
  "enter": true,
  "district_families": ["suburb", "gated", "estate", "apartment", "storage", "school", "cemetery"],
  "best_time": "any; lit only inside a powered cluster",
  "best_location": "the one break in a community wall, on the primary street; the pedestrian gate on a side street at a corner",
  "place_next_to": ["perimeter wall straight run (same key, same variant)", "neighbourhood road", "arterial"],
  "never_next_to": ["house wall", "driveway apron", "another gate on the same run", "a second car gate on a side street"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "single placement",
  "anim": null,
  "tags": ["portal", "gate", "perimeter", "territory", "suburb", "street-aware"]
}
```

## G. REFERENCES
- APPROVED ANCHOR: banks/BOHEMIA_PERIMETER_WALL_POOL_7_14_26.txt — the
  pilasters and header are cooked FROM the key the gate interrupts, so the
  entrance belongs to its own wall. Secondary anchor:
  banks/BOHEMIA_LAMP_DARK_VARIANTS_7_14_26.txt for the dead-metal treatment and
  for the rgb-only glow pattern on the lit variant (the blessed V11 wired
  pattern is the reference the CITY tab already uses).
- NAMED OUTSIDE REFERENCE: Fallout: New Vegas's Westside and the walled
  neighbourhood entrances around Freeside for exactly this read — a gap in a
  long wall that says "this is where a community decides who comes in." Take
  the READ and the storytelling of the gate state, never the 3D texture.
  Secondary: Project Zomboid's gate tiles for the joinery vocabulary of an
  opening in a fence run.
- REAL-WORLD GROUNDING: Las Vegas is one of the most gated-community-dense
  metros in America — the walled subdivision with a single controlled entrance
  is THE valley housing form, which is why our suburb dossier's own
  circulation note says "few entries". The real object is a pair of stuccoed
  CMU pilasters (matching the perimeter wall, because Clark County requires
  perimeter walls to match the abutting subdivision design) flanking a
  wrought-iron or tubular-steel slide gate on a ground track, with a callbox
  pedestal on the entry side and a separate narrow pedestrian gate beside it.
  Pilaster spacing on the wall itself is capped at 24 ft on centre by code,
  and the entry pilasters are the one place they are deliberately heavier.
  When the power goes, a slide gate fails OPEN — which is why "rolled back and
  rusted" is the honest default state and a CHAINED gate is a statement.

## H. DON'T WANT
- NOT `concrete_0`. A blank slab is the bug.
- NOT a building door. Not from the door bank, not the industrial rollup, not
  door_top/door_bottom. Wrong scale, wrong pool, wrong law.
- NOT a fantasy/medieval gate. No portcullis, no timber, no arch with a
  keystone. This is a 1990s Clark County HOA entrance.
- NOT black bars. The gate leaf's bars are value steps within the wall band;
  a black grille is a keyline and the constitution bans it (max near-black
  0.06).
- NOT a second CAR gate on a side street. The street-aware law is explicit and
  the art must not tempt the placement.
- NOT lit by default. DEAD IS DEFAULT; the lit variant is a 12% claim.
- NOT decorated with a community name plaque unless Paolo rules the name.
  MECHANISM-MINE / CONTENTS-PAOLO'S — the plaque geometry may exist, the
  lettering does not.

## I. ACCEPTANCE
- [ ] Seam ring hash: the wall-facing edges hash to the perimeter key the gate
      interrupts
- [ ] Palette ceiling + **wall**/**top** bands + one-light + no-keyline +
      no-dither + no-glow on the UNLIT variant (max hot frac 0.02) checks green
- [ ] Squint test at map zoom: the gate must read as the district outline's
      one notch
- [ ] Proof sheet: not 3x3 (single placement) — instead the OPENING IN A RUN:
      a long perimeter wall with the gate in it, all three leaf states side by
      side, plus the pedestrian gate at a corner per the street-aware law
- [ ] LIT/UNLIT pair shown together, and the lit one proved rgb-only (no alpha
      change) per the leaf-pixel law
- [ ] ON THE REAL SURFACE: the run, walking out of your own neighbourhood
      through it, beside today's concrete-square render
- [ ] Caption JSON parses and matches C/D
- [ ] ENGINE PRECONDITION NAMED: the generator's legend has no pedestrian-gate
      code. The art can be judged without it; PLACING it needs a code-6-adjacent
      legend entry, which is a suburb-generator change and a separate backlog
      item, not a reason to hold the art.

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: CITY lane (measured 7/28 in the run's own tile
  resolver: `if(c===5) return 'concrete_0';`) | DATE: 7/28/26 | PRIORITY: HIGH
- BOARD ROW #: 64 | VERDICT: —
