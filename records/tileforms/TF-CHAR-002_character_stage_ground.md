# TILE FORM TF-CHAR-002 — THE CHARACTER STAGE (the ground and backdrop he
# judges his character standing on)

## A. IDENTITY
- NAME: The character stage (a real piece of Vegas ground, and the wall
  behind it, for the CHARACTER tab)
- FAMILY/SET: CHARACTER STAGE family — one ground plate + one backdrop wall
  band + the shadowed skirting where they meet (one drawing job, one form)
- THE JOB, ONE SENTENCE: this tile exists so that Paolo judges his character
  standing on the world he will actually walk on, instead of floating in a
  purple void that flatters everything equally.

## B. WHY
- DEMANDED BY: VERIFY ON THE REAL SURFACE (7/18, LOCKED) — art is verified
  ONLY on the surface he sees. The CHARACTER tab IS that surface for the
  body, the wardrobe and the body dials, and right now that surface tells him
  nothing about how the character reads in the game.
- WHAT LOOKS BROKEN TODAY: **measured — the preview is a CSS gradient.**
  `#charCv{background:linear-gradient(#383646,#262430)}` and the portrait sits
  on flat `#12100c`. There is no floor, no horizon and no scale reference, so
  a body has nothing to stand on and nothing to be judged against. The cost is
  documented, not theoretical: when he asked for the 1px outline on 7/27 the
  only way to answer *"does this help him fit in the world"* was for me to
  render a fake tan ground into a proof sheet by hand
  (`records/outline/CHARACTER_OUTLINE_7_27_26.png`), because the real surface
  could not show it. Every clothing and dial verdict has the same blind spot.
- SHOPPING CHECK: `records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md`:
  - STARTER TILESET (42, CBB, md5-locked) — the closest real candidate and
    genuinely usable for the FLOOR half if the art lane prefers. Why it does
    not close the form: it is frozen and md5-locked to the RUN target, it has
    no vertical backdrop band, and a judging stage needs a *neutral, quiet*
    plate chosen for contrast against skin and cloth, not a district material
    chosen for the world. Naming it here so the art lane can decide to reuse
    rather than cook, which is the whole point of the shopping law.
  - DESERT/TERRAIN pools — disqualified by the RUN lane's own 7/28 measured
    seam finding (near-black borders, 3-5x wrap discontinuity). Putting a
    known-broken tile behind the character would make the judging surface
    lie.
  - INTERIOR POOL (465 UP, 12 room buckets) — real floors, but every bucket is
    a *room*; a room reads as a location and a location competes with the
    character for attention.
  - HOUSE SKINS (30/30 UP) — wall art, but exterior-facing and district-
    specific; it would put the character in someone's front yard.
  - Nothing in the index is a neutral judging stage. Confirmed gap.

## C. WHERE
- SURFACE + TAB: CHARACTER tab — the main preview canvas (`#charCv`), the
  8-facing grid (`g8_0..7`), and the ANIMATION tab's preview which shares the
  same stage. NOT the world; this never appears in RUN or CITY.
- DISTRICT FAMILIES: none — this is a studio backdrop, not a place.
- LAYER: ground (the plate) — the backdrop band is `structure`
- SOLID? no — ENTERABLE? no
- MUST SIT BESIDE: itself (the plate runs the full canvas width); the
  backdrop band above it; the character's own contact shadow (TF-CHAR-001)
  lands on this plate and is the reason the plate must be a mid value, not a
  dark one.
- NEVER BESIDE: any district material — it must never leak into the world
  render, and no world surface may adopt it. If it ever shows up in RUN that
  is a bug, not a feature.
- EDGE CONTRACT: SELF-SEAMLESS horizontally (the plate wraps left-right so any
  canvas width works). Vertically it is a single placement — one floor line,
  one backdrop, never stacked.

## D. WHEN
- ACT: 1
- BEST TIME: both, and it should be SWITCHABLE. Day is the judging default,
  because the corpus and the constitution are authored in daylight values.
  A night state matters because 88% of the world is unlit (CLUSTERED POWER)
  and he has never once seen his character in the dark he will mostly be in.
- WEATHER STATES: sunny baseline is the judging default. Cloudy and rain-wet
  are wanted as *toggles* on this stage specifically, because the weather
  overlays (board row 6) will change how every garment reads and there is
  currently nowhere to check that before it ships.
- LIT/UNLIT variant needed? Yes — see BEST TIME. The lit state is a neutral
  studio light; the unlit state is the real 12%-lit world's darkness.
- ANIMATION: static. A moving backdrop would compete with the animation he is
  trying to judge, which is the opposite of the job.

## E. HOW
- EXACT SIZE in px: the plate authored at the starter tileset's native tile
  px so it can be reused or swapped without resampling; the canvas is
  `min(92vw,420px)` wide, so it must wrap horizontally at any width. Backdrop
  band roughly the upper two-thirds, floor line at about the lower third —
  the character's feet land on the line.
- VIEW: 45-degree world view (law). The floor plate recedes; the backdrop is
  a flat far wall. The floor line is where they meet and it must read as a
  corner, not as a horizon.
- PALETTE: constitution ceiling. **This is the one place the value band is
  chosen for CONTRAST, not for realism**: the plate sits in the ground band's
  mid, far enough from both the pale skin tones (the corpus skin ramp tops out
  at 224,211,203) and the near-black coat values (~42 luminance) that neither
  disappears. A stage that hides half the wardrobe is a failed stage.
- LIGHT: the one global light direction — same as the world, so a garment
  judged here is judged under the light it will ship under. NO keyline. NO
  dither.
- SHADOWS: none baked into the plate. The character's shadow comes from
  TF-CHAR-001 and lands on top; the backdrop's own contact shade at the floor
  line is part of the drawing (that skirting is what sells the corner).
- SCALE ANCHORS: the human body itself (the canon body is ~46px standing) and
  the 2-tile door height — the backdrop should carry ONE quiet scale cue at
  door height so he can see instantly whether a body-dial setting has made a
  giant or a dwarf.
- WEAR LEVEL: dead world, but QUIET. Aged concrete and a sun-bleached wall
  with a little staining. Enough that it is Bohemia and not a photo studio;
  not so much that it draws the eye off the person.
- VARIANTS: day/night x sunny/cloudy/wet as value states of the same drawing.
  Shape variants would be a new form.

## F. THE CAPTION
```json
{
  "id": "TF-CHAR-002",
  "name": "character stage",
  "layer": "ground",
  "solid": false,
  "enter": false,
  "district_families": [],
  "best_time": "day default for judging; night toggle to check the 88% unlit world",
  "best_location": "the CHARACTER and ANIMATION tab previews only, never the world",
  "place_next_to": ["itself horizontally", "character stage backdrop", "character contact shadow"],
  "never_next_to": ["any district material", "any RUN or CITY surface"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "self-seamless horizontally; single placement vertically",
  "anim": null,
  "tags": ["character", "ui-stage", "judging-surface", "backdrop", "not-world"]
}
```

## G. REFERENCES
- APPROVED ANCHOR: the frozen CBB target screen (`records/target/` +
  `BOHEMIA_VISUAL_CONSTITUTION.json`) — the stage must be built from that
  screen's ground and structure bands, because the whole point is that a
  character judged here is judged in the shipped palette. Second anchor: the
  STARTER TILESET's concrete/apron values.
- NAMED OUTSIDE REFERENCE: **Darkest Dungeon**'s hero-inspection panels — a
  quiet, dim, in-world backdrop that never competes with the figure, and
  proves a judging surface can have atmosphere without becoming a scene.
  Secondary: **Dead Cells**' outfit preview, for keeping one strong floor line
  so the feet visibly plant.
- REAL-WORLD GROUNDING: a Las Vegas back-of-house concrete pad against a
  stuccoed CMU wall — the surface behind every strip mall and service door in
  the valley. Researched detail that should show: Clark County pads are poured
  concrete that goes PALE grey-tan and crazes into fine cracks under UV; the
  wall above is tan stucco over block, and after years without maintenance it
  chalks (the surface literally powders and lightens) and carries a dark
  splash line along the bottom foot where the rare rain kicks dirt up off the
  pad. That splash line is the detail that makes the corner read.

## H. DON'T WANT
- **NOT a flat side-on scroller wall.** 45 DEGREE ART LAW — the floor must
  recede; a wall-and-floor drawn as one flat plane is the exact failure the
  law names.
- **NOT a scene.** No furniture, no props, no story. The moment it has a
  chair, it is a room and it is competing with the character.
- **NOT busy.** A textured, noisy backdrop is a stage that hides pixel-level
  problems — which is the opposite of a judging surface's entire purpose.
- **NOT the purple void it replaces**, and NOT purple at all (PURPLE
  RESERVATION — the Amalgamation's alone; the current `#383646` gradient is
  already skating close to a reserved family on the one screen he uses most).
- **NOT high contrast.** A near-black backdrop hides his black coat; a white
  one blows out skin. Either failure makes half the wardrobe unjudgeable.
- **NOT green.** Nothing in this dead valley is green.

## I. ACCEPTANCE
- [ ] Seam measured: horizontal wrap delta within the normal neighbor step
      (the desert-pool lesson applies — a visible vertical seam behind the
      character would be read as a character bug, which is worse)
- [ ] Palette ceiling + value band + one-light checks green; purity sweep
      clean (no purple)
- [ ] CONTRAST PROOF, specific to this asset: the canon body's palest skin
      (224,211,203) and the coat's darkest cloth (~42 luminance) are BOTH
      measured as separable against the plate. A stage that fails this is
      rejected regardless of how it looks.
- [ ] Squint test: n/a (no map presence) — instead, the character must remain
      the first thing the eye lands on
- [ ] 3x3 TILED PROOF: horizontal repeat proof at the widest canvas (420px)
- [ ] ON THE REAL SURFACE: screenshot of the actual CHARACTER tab wearing it,
      with the canon body, beside the current purple gradient for contrast
- [ ] Caption JSON parses and matches C/D

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: CHARACTER lane | DATE: 7/28/26 | PRIORITY: HIGH
- BOARD ROW #: 8 | VERDICT: —
