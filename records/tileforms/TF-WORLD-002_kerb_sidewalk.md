# TILE FORM TF-WORLD-002 — KERB, GUTTER & SIDEWALK (the seam that touches every district)

## A. IDENTITY
- NAME: Kerb, gutter and sidewalk (the concrete edge between road and plot)
- FAMILY/SET: STREET EDGE family — sidewalk field + kerb-and-gutter run +
  corner return + driveway apron dip + kerb stub + storm-drain inlet +
  landscape strip. ONE drawing job (it is one continuous object).
- THE JOB, ONE SENTENCE: this tile exists so that SIDEWALK SANCTITY is
  something the player can actually see, because right now the boundary
  between the road and every plot in the valley is an invisible colour change.

## B. WHY
- DEMANDED BY: SIDEWALK SANCTITY (standing law, CLAUDE.md). Also the 7/28
  legibility finding: Kevin Lynch's EDGES are one of the five elements and we
  scored "by accident only" — the kerb is the most common real edge in any
  city. And the STREET-AWARE/DRIVABLE law makes the kerb the exact line a car
  entrance crosses.
- WHAT LOOKS BROKEN TODAY: arterial declares "curb + gutter", "dirt shoulder",
  "raised median", "landscape strip", "storm drain inlet"; desert declares a
  "curb stub"; five districts declare "sidewalk"; town declares "boardwalk".
  All render as flat value steps. There is no physical edge anywhere in the
  valley, so plots appear to float in the roadway.
- SHOPPING CHECK: records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md —
  * STREET BLOCKS (5 researched lanes, REAL_VEGAS R2, CITY-wired): the
    carriageway only. Checked the pool: it stops at the kerb line and does not
    contain a kerb face, a gutter pan, a corner return or a driveway dip.
  * ROAD MARKINGS (84): paint. A painted kerb stripe is not a kerb.
  * STARTER TILESET (42): one residential street — has a sidewalk read for
    that ONE street condition, not the corner/apron/median/inlet family, and
    not the desert kerb-stub condition.
  * SUBURB PERIMETER WALLS (13 approved): a wall is not a kerb.
  Nothing in the index claims the kerb family.

## C. WHERE
- SURFACE + TAB: RUN (the walk) + CITY. Reads at map zoom only as the thin
  line separating road from block — which is exactly the Lynch EDGE.
- DISTRICT FAMILIES: all — every district that fronts a street, plus the
  arterial and freeway surface cells and the desert kerb stub (the subdivision
  that was platted and never built, which is Vegas's own true story).
- LAYER: ground for the sidewalk and gutter pan; the kerb FACE is a 6-inch
  vertical and reads as ground with a lit top edge, never as structure.
- SOLID? no (a kerb is a trip, not a wall) — ENTERABLE? no
- MUST SIT BESIDE: roadway (approved street blocks) on one side; lot asphalt
  (TF-WORLD-001), dead lawn, or desert ground on the other; driveway aprons
  where a car entrance crosses it; storm-drain inlets at low points.
- NEVER BESIDE: itself back-to-back with no roadway between (two kerbs facing
  each other with nothing in the middle is the tell of a fake street).
- EDGE CONTRACT: WANG-16 edge set (it is a linear object with corners and
  returns; a blob-47 is overkill and a single placement is impossible).

## D. WHEN
- ACT: 1
- BEST TIME: both; concrete is the brightest ground surface at night under any
  light, so it is what makes a lit district read as lit.
- WEATHER STATES: sunny baseline; RAIN-WET is important because the gutter pan
  is where water actually goes — a wet gutter with a dry sidewalk beside it is
  a cheap, true detail. Value shift only.
- LIT/UNLIT: no self-light.
- ANIMATION: static.

## E. HOW
- EXACT SIZE: one tile, starter-set native px. Kerb height ~0.15 m against a
  0.75 m tile, so the face is a THIN band — resist making it a step.
- VIEW: 45-degree world view. The kerb has a visible face on the road side and
  a lit top edge; the sidewalk is a flat plane.
- PALETTE: constitution ceiling; GROUND band, but concrete sits at the TOP of
  it (it is the palest ground in the game and that is what makes it read).
- LIGHT: the one global direction. NO keyline. NO dither.
- SHADOWS: none baked; the kerb's own micro-shadow comes from the shadow pass.
- SCALE ANCHORS: a sidewalk is 1.5 m wide = 2 tiles; a kerb is 0.15 m tall.
  Get this wrong and every district's scale is wrong, because this is the
  object players unconsciously measure everything else against.
- WEAR LEVEL: Vegas concrete goes pale bone, not grey. Expansion joints every
  ~1.5 m crack first; weeds take the joints; sand drifts against the kerb face
  on the windward side. Utility cuts are patched in a slightly different tone.
- VARIANTS: sidewalk field, kerb run, corner return, driveway apron dip,
  storm-drain inlet, kerb stub (no sidewalk behind it — the never-built lot),
  wet colorway.

## F. THE CAPTION
```json
{
  "id": "TF-WORLD-002",
  "name": "kerb gutter and sidewalk",
  "layer": "ground",
  "solid": false,
  "enter": false,
  "district_families": ["all"],
  "best_time": "any",
  "best_location": "the boundary between any roadway and any plot",
  "place_next_to": ["roadway","lot asphalt","dead lawn","desert ground","driveway apron"],
  "never_next_to": ["another kerb facing it with no roadway between"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "wang-16",
  "anim": null,
  "tags": ["ground","concrete","edge","sidewalk","kerb","lynch-edge"]
}
```

## G. REFERENCES
- APPROVED ANCHOR: the approved STREET BLOCKS pool (the carriageway this
  butts against) and the frozen starter set's single residential street.
- NAMED OUTSIDE REFERENCE: Pocket City 2, where the pale sidewalk ring around
  every block is doing most of the work separating buildings from roads — it
  is the reason its cities read as cities at a glance.
- REAL-WORLD GROUNDING: Clark County standard drawings — a 6-inch vertical
  kerb with an integral 24-inch gutter pan, and 5-foot detached sidewalks with
  a landscape strip between kerb and walk (a Vegas signature; the strip is
  where the dead palm goes). Concrete here bleaches to bone-pale. Because Vegas
  gets flash floods rather than steady rain, the gutter pans and inlets are
  oversized and are the one place you see real water damage.

## H. DON'T WANT
- NOT a tall kerb. A kerb that reads as a step is the single most common
  scale error in tile art, and it makes every character look tiny.
- NOT grey. Vegas concrete is bone/pale-tan, not northern grey.
- NOT clean. No fresh pours, no crisp joints.
- NOT continuous with the roadway value — if the kerb does not separate them,
  the whole form has failed its one job.

## I. ACCEPTANCE
- [ ] Seam measured on the Wang set: every edge tile mates cleanly with every
      legal neighbour, no edge darkening
- [ ] Palette ceiling + GROUND band (top of band) + one-light green
- [ ] Squint test: at map zoom the kerb line still separates road from block
- [ ] 3x3 TILED PROOF SHEET + a corner/apron/inlet assembly proof
- [ ] ON THE REAL SURFACE: a district frontage wearing it, with the approved
      street blocks on the road side
- [ ] Caption JSON parses and matches C/D

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: WORLD | DATE: 7/28/26 | PRIORITY: HIGH
- BOARD ROW #: 31 | VERDICT: —
