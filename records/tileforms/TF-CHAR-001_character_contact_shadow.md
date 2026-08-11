# TILE FORM TF-CHAR-001 — CHARACTER CONTACT SHADOW (the shadow every person,
# NPC and enemy casts on the ground)

## A. IDENTITY
- NAME: Character contact shadow (the dark patch a body puts on the ground it
  is standing on)
- FAMILY/SET: CHARACTER GROUND-CONTACT family — one standing/idle shadow, one
  wider walk/run shadow, one crouched/seated shadow (one drawing job, one
  form; they are the same material at three footprints)
- THE JOB, ONE SENTENCE: this tile exists so that a person stops FLOATING —
  so the character reads as standing ON the desert instead of pasted over it.

## B. WHY
- DEMANDED BY: Paolo 7/27, asking for the 1px outline — *"I think it would
  help fit them in the world a lot better."* The outline was half that ask;
  an outline separates a body from the background but cannot put it ON the
  ground. Also demanded by SHADOWS ARE SEPARATE (7/26, LOCKED): a depth/light
  read belongs in a **separate render-time layer**, never multiplied into
  sprite pixels — which makes a standalone shadow asset the only legal way to
  do this at all.
- WHAT LOOKS BROKEN TODAY: **measured — the alpha draws ZERO ellipses on any
  surface** (`grep -c "ellipse(" slices/BOHEMIA_ALPHA_0_9.html` → 0). There is
  no contact shadow anywhere: not in the RUN world, not in the CHARACTER
  preview, not on NPCs. Every body in Bohemia hovers. It is the single
  loudest reason a sprite reads as a sticker on a background.
- SHOPPING CHECK: `records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md`, every row:
  - GORE OVERLAYS (20 UP) — nearest thing to a ground decal in the whole
    index. Wrong: they are blood, red, and story-placed by Paolo; a blood
    pool is not a light-occlusion patch and cannot follow a walk cycle.
  - FIRE/PARTICLE LOOPS — emissive fx, the opposite of an occlusion.
  - SEAM-FIXED SURFACES / DESERT-TERRAIN / STARTER TILESET — all *ground*
    tiles. A shadow is drawn ON ground, it is not a ground material.
  - HD PACK UP list — checked for a shadow/decal bucket: the 12 interior room
    buckets and the terrain pools carry no character-scale soft decal.
  - Nothing in the index claims character contact shadow. Confirmed gap.

## C. WHERE
- SURFACE + TAB: RUN (every person on the walk), CHARACTER (the preview and
  the 8-facing grid), COMBAT (every enemy and the player), CITY at human mode.
  Everywhere a body is drawn on a floor.
- DISTRICT FAMILIES: all — it belongs to the body, not the district.
- LAYER: prop
  *(Honest note for the art lane: none of the four legal layer words is
  "decal". It is drawn ABOVE the ground material and BELOW the body sprite,
  it never blocks and is never entered. `prop` is the closest legal word and
  the caption's `solid:false / enter:false` is what the code should actually
  read.)*
- SOLID? no — ENTERABLE? no
- MUST SIT BESIDE: any ground material (desert hardpan, asphalt, sidewalk,
  interior floors, apron concrete). It multiplies whatever is under it.
- NEVER BESIDE: nothing is illegal beside it, but it must NEVER be drawn on a
  cell the body is not standing on, and never on a wall/structure face — a
  shadow on a vertical surface is a different asset and is not this form.
- EDGE CONTRACT: SINGLE PLACEMENT — never repeats, never tiles. It is one
  stamp per body, anchored to the feet.

## D. WHEN
- ACT: 1
- BEST TIME: both, and this is the interesting part. **Day**: Las Vegas sits at
  ~36°N with roughly 294 sunny days a year, so the shadow is present nearly
  always and is SHORT and hard-edged near midday. **Night**: the sun shadow is
  gone; under a lit territory (LIGHT=TERRITORY, 12% lit, owned) the body casts
  a shorter, softer pool away from the owned lamp; in the unlit dark it fades
  out entirely — nobody patrols the dark, and nothing casts there.
- WEATHER STATES: sunny baseline (full strength). Cloudy wash — much weaker
  and much softer, because an overcast sky is one big diffuse source; this is
  the state where a hard ellipse would look most wrong. RAIN-WET ground — the
  shadow WEAKENS (wet ground is already dark) but gains a short vertical smear
  where the body meets a reflective sheen. Value shift only, same footprint.
- LIT/UNLIT variant needed? YES, and it is the LIGHT=TERRITORY hook: unlit =
  essentially absent, lit = present and pointed away from the owner's lamp.
- ANIMATION: static per pose — it is NOT its own animation. It is stamped per
  frame from the body's own footprint, so it changes as the walk changes
  without a frame set of its own. (Leaf-pixel law is satisfied trivially:
  there is no structure to freeze.)

## E. HOW
- EXACT SIZE in px: footprint width of the body it belongs to — for the canon
  body that is ~11-14px wide (the measured foot-row silhouette) by ~4-5px
  deep. Authored at sprite native (the 56x56 character frame's scale), not at
  tile scale.
- VIEW: 45-degree world view — this is why it is an **ellipse**, not a circle
  and not a rectangle. Foreshortened on the depth axis, exactly the same
  cross-section logic the 45 DEGREE ART LAW already demands of every
  cylindrical form. The blessed lamp bank is the reference for that read.
- PALETTE: constitution ceiling. It is a MULTIPLY-style darkening of the
  ground band beneath it, never its own colour family — so it inherits
  whatever ground it lands on and can never introduce a new hue. Purple is
  reserved (Amalgamation) and must not appear in the darkening.
- LIGHT: the one global light direction — the shadow is offset AWAY from it.
  NO keyline. NO dither.
- SHADOWS: n/a — this IS the shadow layer. It must never be baked into the
  body sprite (that is the exact SHADOWS ARE SEPARATE violation).
- SCALE ANCHORS: the human body's own foot separation; the 2-tile door for
  height sanity; a shadow must never be wider than the body's widest row.
- WEAR LEVEL: n/a (light, not matter).
- VARIANTS: 3 footprints (standing, walk/run spread, crouched/seated) x the
  lit/unlit strength. Strength is a value knob, not a new shape, so it stays
  inside this form under STRUCTURE-NOT-COLOR.

## F. THE CAPTION
```json
{
  "id": "TF-CHAR-001",
  "name": "character contact shadow",
  "layer": "prop",
  "solid": false,
  "enter": false,
  "district_families": ["all"],
  "best_time": "day strongest; night only inside an owned light; absent in the dark",
  "best_location": "the ground cell a body is standing on, any surface",
  "place_next_to": ["desert ground", "asphalt", "sidewalk", "interior floor", "apron concrete"],
  "never_next_to": ["wall faces", "any vertical surface", "a cell with no body on it"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "single placement",
  "anim": null,
  "tags": ["character", "shadow", "decal", "ground-contact", "separate-layer"]
}
```

## G. REFERENCES
- APPROVED ANCHOR: the blessed lamp bank (`BOHEMIA_LAMP_DARK_VARIANTS_7_14_26`)
  — it is the corpus item that establishes both the one light direction and
  the 45-degree ellipse cross-section this shadow must obey. Second anchor:
  the frozen CBB target screen's ground value band, since the shadow's job is
  to darken exactly that band without leaving it.
- NAMED OUTSIDE REFERENCE: **Hyper Light Drifter** — its characters sit on a
  simple, soft, low-contrast ground pool that never reads as a black hole; the
  thing to take is that the shadow is much LIGHTER than instinct says.
  Secondary: **Eastward**, for a warm shadow on warm ground (its shadows keep
  the ground's hue instead of going neutral grey), which is the correct
  behaviour on pale caliche.
- REAL-WORLD GROUNDING: a body's shadow on Las Vegas ground. Two researched
  facts drive the art. (1) The valley floor is pale caliche and pale concrete,
  which is a strong BOUNCE surface — so a real Vegas shadow is not dark. Light
  reflecting off the surrounding hardpan fills it, and the shadow reads as a
  warm, desaturated *step down* from the ground, not as black. (2) At ~36°N in
  summer the sun is close to overhead at midday, so the shadow is SHORT and
  tucked under the body; it lengthens hard in the low winter/evening sun. On
  aged asphalt (already dark) the same shadow nearly disappears — which is why
  this must multiply the ground rather than paint a fixed colour.

## H. DON'T WANT
- **NOT a black ellipse.** Pure black is the constitution's banned keyline
  value arriving by another door, and it is the single most common way this
  asset is done badly. The grounding above is the argument: real Vegas shadows
  are bounce-filled and pale.
- **NOT a hard-edged sticker.** A crisp uniform oval reads as a UI drop shadow
  under a button, not as light.
- **NOT baked into the sprite.** SHADOWS ARE SEPARATE (7/26) — this is the law
  that killed the far-arm darkening; a shadow multiplied into body pixels
  mid-composite is the same violation and will be rejected on sight.
- **NOT offset like a CSS drop shadow** (a copy of the body pushed 2px down
  and right). It is a footprint on the floor, not a duplicate of the person.
- **NOT purple-tinted.** PURPLE RESERVATION — purple is the Amalgamation's
  alone; a "cool" shadow that drifts violet is a purity-gate failure.
- **NOT the same strength day and night.** A full-strength shadow at night in
  an unlit cell is a lie about where the light is (LIGHT=TERRITORY).

## I. ACCEPTANCE
- [ ] Seam measured: n/a (SINGLE PLACEMENT, never tiles)
- [ ] Palette ceiling + one-light checks green; purity sweep clean (no purple)
- [ ] Value proof: the shadow's darkest pixel is measured as a *step down*
      from the ground band it sits on, NOT an approach to black — a hard
      number, since "not too dark" is exactly the argument this form exists
      to end
- [ ] Squint test: at walk zoom the body must read as CONTACTING the ground;
      at map zoom the shadow must vanish rather than become a dot
- [ ] 3x3 TILED PROOF: n/a — instead, a WALK-CYCLE proof (the shadow across
      all 24 phases of walk on E and S, proving it tracks the feet and does
      not strobe)
- [ ] ON THE REAL SURFACE: the character standing on desert hardpan AND on
      asphalt AND on an interior floor, beside the same frames with no shadow
- [ ] Caption JSON parses and matches C/D

## J. ADMIN
- STATUS: CANDIDATES KILLED by Paolo 8/11/26 (TILE BOARD sitting, bare DOWN; bank and cook removed, DEAD in the graveyard). The grounding SLOT stays real: a fresh answer is judged WIRED and WALKING, never a remake of the stamps. Post-mortem: records/BOHEMIA_TILE_BOARD_KILLS_POST_MORTEM_8_11_26.md | REQUESTED BY: CHARACTER lane | DATE: 7/28/26 | PRIORITY: HIGH
- BOARD ROW #: 7 | VERDICT: —
