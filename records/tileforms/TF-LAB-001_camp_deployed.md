# TILE FORM TF-LAB-001 — THE CAMP, SET DOWN
# BACKS BOARD ROW 3 (filed by RUN before the form law, never formed). Filled by
# LAB because LAB owns the law that defines this object
# (laws/BOHEMIA_ADDENDUM_THE_MOBILE_CAMP_7_27_26.md) and a formless HIGH row was
# blocking the art lane on the game's most-used prop.

## A. IDENTITY
- NAME: The camp, set down (the thing you carry, drop, and rest at)
- FAMILY/SET: MOBILE CAMP set — this form is the DEPLOYED state only. Its
  packed/carried state is TF-LAB-002 (different silhouette, own form). The
  comfort kit that dresses it is [PENDING Paolo] clause (g) and is board H4.
- THE JOB, ONE SENTENCE: this tile exists so that the single most-used verb in
  Bohemia's survival system — set your camp down HERE — puts something real on
  the ground that reads instantly as "this is mine, I made it, I can rest".

## B. WHY
- DEMANDED BY: laws/BOHEMIA_ADDENDUM_THE_MOBILE_CAMP_7_27_26.md clause 1
  ("THE CAMP IS MOBILE... a thing you CARRY and SET DOWN"), Paolo 7/27/26
  verbatim: "i am in love with the mobile camp idea". Clause 11 makes setting it
  down cost time, so the object has to be worth the 30 minutes. Clause 13 makes
  it the ONLY shelter in Act 1 ("theyre maybe isnt a lot of frienly options of
  hotels or friendly faction housing unless u hoof it to a homies house").
- WHAT LOOKS BROKEN TODAY: on the only surface that has it
  (slices/lab/BOHEMIA_LAB_MOBILE_CAMP_DIAL_7_27_26.html, flagged PLACEHOLDER
  ART) the camp is a 20px orange square with a radial-gradient glow. It is a
  debug marker. When the mechanism ports there is nothing to draw, so the
  highest-frequency object in the survival loop would ship as a coloured box.
- SHOPPING CHECK (records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md, and into the
  banks it points at):
  * HD PACK pack "14. Camp and tents" — 18 UP of 35 judged
    (banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt). THE NEAREST MISS IN THE
    CORPUS AND THE ART LANE MUST RENDER IT BEFORE COOKING. Two of the 18 carry
    Paolo's comment "Training data for quick tents" (idx 2, 3, both flagged
    SMALL) which makes them REFERENCE class by the index's own note, not
    shippable tiles. Four more carry BIG flags (idx 27, 31, 33, 34) so they need
    the ITEM_SCALE 0.55 correction. That leaves ~12 un-commented UP tiles whose
    content I cannot read from the verdict file — they are loose camp PROPS from
    a bought pack. WHY THEY DO NOT COVER THIS: they are dressing, not the
    OBJECT. The mechanism needs ONE thing with a KNOWN DEPLOYED FOOTPRINT
    (comfort is measured in a radius from it) and a matching packed state, and
    no loose prop can be that. USE THEM TO DRESS IT — do not re-draw what pack
    14 already has.
  * FIRE/PARTICLE LOOPS — 5 campfire/cookfire clips, 34 loops, ZERO consumers,
    index says "now routed to the mobile-base camp". THE FIRE IS ALREADY
    APPROVED AND IS NOT PART OF THIS ASK. This form draws the shelter the fire
    sits beside; cooking a new fire would be a violation of the shopping law.
  * "18. Light sources and fire barrels" (34 UP) — covers barrel fires, not a
    personal camp.
  * INTERIOR POOL (465 UP, 12 room buckets) — indoor furniture; a camp is an
    exterior object and the exterior-tiles-inside confusion runs the other way.
  * WARDROBE (195 canon) — clothing, not gear.
  Nothing in the index claims a deployable personal shelter as a single object.

## C. WHERE
- SURFACE + TAB: RUN (the walk — you set it down where you are standing) and
  CITY (it must read at human mode zoom as a thing on the block). No MAP icon:
  it is yours and temporary, not a landmark.
- DISTRICT FAMILIES: ALL exterior families — that is the point of clause 1.
  Most-used in bare desert, desert margins, washes, and the unlit gaps between
  districts (Act 1 has no alternative there).
- LAYER: prop
- SOLID? no — you stand IN your own camp; the law's atCamp test is a radius
  around it, and props never become collision (7/26 interiors law).
  ENTERABLE? no. It is not a portal — there is no interior. You rest AT it.
- MUST SIT BESIDE: the approved campfire loops (its reason for existing at
  night); desert ground (TF-RUN-001) and every other exterior ground; the
  comfort kit props when Paolo rules them (H4); a companion standing at it
  (clause 8's bullet removal happens here).
- NEVER BESIDE: interior floors (you cannot pitch this in a room — clause 13
  gives friendly INTERIORS their own rest path, and the page already refuses to
  pitch a tent in a hotel); another deployed camp (you own exactly one); the
  approved perimeter walls flush against it (a camp shoved into a wall reads as
  level-designed, not chosen).
- EDGE CONTRACT: SINGLE PLACEMENT — never repeats. It is one authored object
  and there is exactly one in the world at a time. No seam measurement applies.

## D. WHEN
- ACT: 1 (and it is MOST needed in Act 1 by clause 13 — Acts 2 and 3 add
  friendly roofs that compete with it, which is his ruled scarcity curve).
- BEST TIME: both, and NIGHT is when it matters. By clause 13 Act 1 has almost
  no friendly shelter, so at night this is the only lit thing you own.
- WEATHER STATES: sunny baseline; cloudy needs no change (the ambient wash
  handles it); RAIN-WET matters more here than for most props — a tarp is the
  one thing in the world that visibly SHEDS water, and the real Vegas grounding
  below is a flash-flood story. Wet variant = value/saturation shift on the
  tarp only, no new geometry, so it is a colorway not a shape.
- LIT/UNLIT: LIT variant needed, and LIGHT=TERRITORY says who owns it — YOU do.
  This is the player's own small pool of light in a city where 12% is lit and
  the lit network is somebody else's. The camp does NOT emit its own light: the
  approved fire bank owns the light source, and this object needs the catch-lit
  colorway (tarp underside picking up firelight) so the two read as one thing.
- ANIMATION: static. The movement at a camp belongs to the approved fire loops
  (leaf-pixel law: their structure is frozen, only the flame leaf moves). A
  tarp corner lifting in wind is NOT wanted in v1 — it would be a second
  animated thing competing with the fire for the eye.

## E. HOW
- EXACT SIZE: 2x2 tiles deployed footprint, authored at the frozen starter
  tileset's native px (the CITY blits at 22px; author native so both consume
  without resampling). WHY 2x2 AND THE ONE THING TO FLAG: the code needs a
  KNOWN footprint because comfort is a radius measured from the camp, so a
  number has to exist. 2x2 is the request (1x1 cannot read as a shelter a human
  fits under; 3x3 starts to look like a built structure, which clause 1
  forbids). If Paolo wants it bigger or smaller that is his word and the form
  is cheap to reissue.
- VIEW: 45-degree world view (law). The tarp gets a visible SKY-LIT TOP plane —
  it is the only large angled surface in the object and it is what sells the
  three-quarter view. The opening faces the viewer-ish so you can see the
  bedding shadow inside. NEVER a flat side-on scroller elevation.
- PALETTE: constitution ceiling; PROP value band (props sit above the ground
  band so the camp separates from the dirt it stands on). THE ONE COLOUR NOTE:
  real Vegas camps are BLUE VINYL TARP (grounding below) and a saturated blue
  will fight the constitution — the answer is the honest one, a Mojave-bleached
  tarp that has gone chalky pale grey-cyan, which is both what really happens
  and what the ceiling can take. PURPLE RESERVATION: nowhere near purple.
- LIGHT: the one global direction. NO keyline. NO dither.
- SHADOWS: none baked (separate-layer law). Expected shadow footprint: a hard
  angled cast on the sun side plus the dark UNDER the tarp, which is the
  object's most important read — the shade is why you would sit there.
- SCALE ANCHORS: a human must plausibly lie down under it (rig height is the
  ruler); it must be visibly SMALLER than the 2-tile door and smaller than a
  car, or it stops reading as something one person carries.
- WEAR LEVEL: heavy, but MAINTAINED — this is the one object in a dead world
  that someone still looks after. Bleached and patched, lashings re-tied,
  nothing rotted through. Everything else in Bohemia is abandoned; this is not,
  and that contrast is the whole emotional job of the tile.
- VARIANTS: deployed-unlit, deployed-catch-lit, deployed-wet. Three colorways
  of ONE shape (STRUCTURE-NOT-COLOR: these are not progress, they are states).

## F. THE CAPTION
```json
{
  "id": "TF-LAB-001",
  "name": "camp deployed",
  "layer": "prop",
  "solid": false,
  "enter": false,
  "district_families": ["all-exterior", "desert", "wash", "margins", "unlit-gaps"],
  "best_time": "night",
  "best_location": "any exterior tile the player chose; strongest in unlit Act-1 desert and washes far from friendly shelter",
  "place_next_to": ["campfire loop (approved bank)", "desert ground", "exterior ground", "companion", "comfort kit props (pending)"],
  "never_next_to": ["interior floors", "another deployed camp", "perimeter wall flush"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "SINGLE PLACEMENT",
  "anim": null,
  "tags": ["camp", "mobile", "player-owned", "rest", "shelter", "light-owner", "act1-critical"]
}
```

## G. REFERENCES
- APPROVED ANCHOR: the approved campfire/cookfire loops
  (banks/BOHEMIA_FIRE_FLICKER_BANK_7_13_26.txt — 5 clips, zero consumers,
  routed here by the index). This object is authored TO SIT WITH THEM: same
  scale, same firelight direction, judged in one scene with the fire lit.
  Secondary anchor: pack "14. Camp and tents" UP set, to be rendered and
  dressed from, not re-drawn.
- NAMED OUTSIDE REFERENCE: This War of Mine — for the READ of improvised
  construction: things LASHED and PROPPED rather than built, where you can see
  which bits were scavenged from what. Take the read, not its flat 2D side-on
  cutaway view, which is the exact anti-reference below. Second: Frostpunk, for
  how one small shelter reads as a warm point in a hostile field — the pool of
  warm value against a cold desaturated field is the composition to steal.
- REAL-WORLD GROUNDING (researched 7/28): Las Vegas's real camps are in the
  storm-drain tunnels and the drainage canals and desert washes — the flood
  system built from the 1990s to protect the Strip, with roughly 1,500 people
  living in it. The reported construction is specific and it is what this tile
  should be made of: "a frame of scavenged wood and metal covered by blue vinyl
  tarp". The SHOPPING CART is the real transport unit for a Vegas camp (during
  monsoon floods the water carries carts, boulders and wood through the
  tunnels), and milk crates, pallets, furniture and bicycles are the real camp
  furniture. Two Mojave truths that must show: everything is SUN-BLEACHED
  (blue vinyl goes chalky and pale, not vivid), and camps sit in washes — the
  places that are dry for 11 months and then lethal, which is exactly the right
  register for a camp you can pick up and move.
  Sources: reviewjournal.com (North Las Vegas drainage canal camp; tunnel
  flooding), newsnationnow.com / vice.com (the tunnel "city" under the Strip).

## H. DON'T WANT
- NOT a clean recreational dome tent. No REI nylon, no taut new fabric, no
  brand-new poles. This is not camping, it is living outside.
- NOT a medieval/fantasy canvas tent — a live risk because pack 14 is a bought
  asset pack and that is what those packs usually contain. If the pack's UP
  tiles read fantasy, dress with them sparingly and let this object carry the
  Vegas read.
- NOT GREEN. Dead world, and the weather ruling ("alot of foliage is going to be
  dead anyway") makes green the wrong note everywhere.
- NOT a flat side-on scroller face (45 DEGREE ART LAW, and the named failure
  mode in the graveyard's B_ISOBLOCK / C_CUTAWAY kills — front face at street
  level is what he picked, so the tarp must show its angled top).
- NOT clean or new anywhere except one thing: the lashings look recently
  re-tied. That single note of upkeep is the point; a pristine tile is a failed
  tile and so is a rotted one.
- NOT a built structure with foundations, walls, or a door — clause 1 forbids
  anything that reads as a fixed home. If it looks like it could not be picked
  up in half an hour, it is wrong.
- NOT the mall-icon mistake (DISTRICT_HERO_v1 graveyard: "generic tan iso BOXES
  with tiny signature bits — you could NOT tell what each building was"). A
  tan box with a triangle on it is not a camp.

## I. ACCEPTANCE
- [ ] Seam measured: n/a (SINGLE PLACEMENT) — but the 2x2 footprint must sit on
      desert ground with no halo, gap, or dark edge where prop meets ground
- [ ] Palette ceiling + PROP value band + one-light checks green; purity sweep
      clean (no purple)
- [ ] Squint test: n/a (no map presence) — but at CITY human-mode zoom it must
      still read as a camp, not a smudge
- [ ] 3x3 TILED PROOF SHEET: n/a for repeat, BUT deliver the 3x3 of the GROUND
      it sits on with the camp centred, so prop-on-ground integration is judged
- [ ] ON THE REAL SURFACE: screenshot on the walk with the APPROVED CAMPFIRE
      LOOP LIT beside it, at night, plus the same spot in daylight. Judged as
      one scene, never as a loose prop (form law rule 5).
- [ ] The catch-lit variant is judged WITH the fire, or it cannot be judged
- [ ] Caption JSON parses and matches sections C/D
- [ ] Rendered beside pack 14's UP set, so Paolo can see what was dressed from
      the corpus versus what was newly drawn

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: LAB (owner of the mobile camp law; backs RUN's
  board row 3, which had no form) | DATE: 7/28/26 | PRIORITY: HIGH
- BOARD ROW #: 3 | VERDICT: —
