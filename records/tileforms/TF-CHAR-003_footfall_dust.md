# TILE FORM TF-CHAR-003 — FOOTFALL DUST (the puff a boot lifts off dry ground)

## A. IDENTITY
- NAME: Footfall dust (the small puff of dust a step kicks up on dry ground)
- FAMILY/SET: CHARACTER GROUND-CONTACT family (the sibling of TF-CHAR-001) —
  one walk puff, one heavier run/land puff (one drawing job, one form; same
  material at two energies)
- THE JOB, ONE SENTENCE: this tile exists so that a step LANDS — so walking
  on Mojave hardpan has a physical consequence instead of the character
  gliding silently over a floor that never reacts.

## B. WHY
- DEMANDED BY: the 120 BPM LAW (everything quantizes to the beat, BEAT=0.5s,
  I-MOVE-YOU-MOVE) — the walk already lands on the beat, and a footfall is
  the one moment the world has to answer the body. Also the walkable-land
  law's *render-and-look* bar: a district must read USED, and nothing reads
  used like ground that responds to being walked on.
- WHAT LOOKS BROKEN TODAY: the character walks across dry desert hardpan and
  the ground does not acknowledge it. There is no footfall fx of any kind on
  the render path. Combined with the missing contact shadow (TF-CHAR-001,
  measured: zero ellipses drawn anywhere) the result is a body that neither
  touches the floor nor disturbs it.
- SHOPPING CHECK: `records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md`:
  - FIRE/PARTICLE LOOPS (5 fx + 5 campfire/cookfire clips, 34 loops banked) —
    the nearest entry by a distance, and it was checked properly rather than
    dismissed. It does not cover this: every loop is EMISSIVE (fire, embers,
    flicker) and is now routed to the mobile-base camp. Dust is the opposite
    material — it occludes and scatters light, it does not emit it, and it
    reads pale against dark ground rather than bright against dark night. A
    recoloured ember is not a dust puff and would fail on motion alone (embers
    rise and persist; dust bursts, spreads and settles).
  - GORE OVERLAYS — decals, not motion, and red.
  - DESERT/TERRAIN pools — the ground it comes off, not the puff.
  - Nothing in the index claims a dust or impact fx. Confirmed gap.

## C. WHERE
- SURFACE + TAB: RUN (every walking/running body, player and NPC), COMBAT
  (landings, dodges, shoves), CHARACTER preview when a walk/run clip plays on
  the stage (TF-CHAR-002).
- DISTRICT FAMILIES: all DRY exterior ground — desert cells, dirt margins,
  gravel lots, the unpaved parts of every district.
- LAYER: prop
  *(Same honest note as TF-CHAR-001: there is no "fx" word in the legal
  four. It draws above ground, below/around the body, blocks nothing.)*
- SOLID? no — ENTERABLE? no
- MUST SIT BESIDE: desert hardpan, gravel, dirt margins, dead lawn; the
  character's own contact shadow (it rises out of exactly that footprint).
- NEVER BESIDE: interior floors (indoor ground is not dusty in this way and a
  puff indoors reads as a bug), and — the important one — **wet ground**. Rain
  kills this asset outright; see WEATHER.
- EDGE CONTRACT: SINGLE PLACEMENT — never repeats, never tiles. One stamp per
  footfall, at the foot.

## D. WHEN
- ACT: 1
- BEST TIME: both. It is a material behaviour, not a light behaviour, so it
  does not care about the hour — but at night it is only VISIBLE inside an
  owned light (LIGHT=TERRITORY), so in the dark it should simply not be drawn
  rather than drawn dark.
- WEATHER STATES: sunny baseline — full strength, and this is its home state.
  Cloudy — unchanged (it is not a lighting effect). **RAIN-WET — SUPPRESSED
  ENTIRELY.** Wet ground does not raise dust; a puff in the rain is the single
  most obviously wrong thing this asset could do, and it is a real risk
  because the weather overlays are a separate board row (6) built by a
  different lane. The caption's `weather_ok` deliberately excludes rain so the
  code can never do it by accident.
- LIT/UNLIT variant needed? No new art — unlit simply suppresses it.
- ANIMATION: LOOP, and it is short. **4 frames over ONE beat (0.5s at 120
  BPM)**: rise, spread, thin, gone. It must be quantized to the beat like
  everything else, so the puff belongs to the footfall rather than drifting
  free of it. LEAF-PIXEL LAW applies and is the whole discipline here —
  frame to frame only the outer leaf pixels change; there is no rigid
  structure inside a dust puff to hold, so the law's practical form is: the
  puff's ANCHOR (the contact point at the foot) is frozen, and only the cloud
  edge moves.

## E. HOW
- EXACT SIZE in px: small — a walk puff no wider than the boot (~5-7px) and
  no taller than ankle-to-mid-shin (~5px) at its widest frame. The run/land
  puff may be roughly half again as big. Authored at the 56x56 character
  frame's native scale, not tile scale.
- VIEW: 45-degree world view — the puff is a squashed dome, wider than tall,
  reading as a cloud lying on a receding floor. Never a vertical column: a
  puff drawn as a tall plume is a side-on scroller mistake.
- PALETTE: constitution ceiling; the GROUND value band, one or two steps
  LIGHTER than the ground it comes off. Dust is the ground airborne, so it
  must be the ground's own hue — it is a value move, never a new colour.
- LIGHT: the one global direction; the puff is lit on the sun side and only
  slightly darker away from it. NO keyline (a bordered puff is a balloon).
  NO dither — this is the classic asset where dithering gets smuggled in as
  "softness", and it is still banned.
- SHADOWS: none baked. The puff does not cast; the body's shadow (TF-CHAR-001)
  is unaffected by it.
- SCALE ANCHORS: the boot itself, and the character's foot separation in the
  walk cycle. A puff bigger than the foot that made it is wrong.
- WEAR LEVEL: n/a (it is air) — but the COLOUR carries the wear: it is pale
  caliche dust, the same bone-pale the real Mojave floor is.
- VARIANTS: walk puff, run/land puff. Both share the 4-frame beat. Anything
  bigger (a vehicle plume, a collapse) is a different form and a different
  lane.

## F. THE CAPTION
```json
{
  "id": "TF-CHAR-003",
  "name": "footfall dust",
  "layer": "prop",
  "solid": false,
  "enter": false,
  "district_families": ["desert", "margins", "gravel lots", "unpaved district ground"],
  "best_time": "any; at night only inside an owned light, otherwise not drawn",
  "best_location": "at the foot, on dry exterior ground, on the footfall beat",
  "place_next_to": ["desert ground", "gravel", "dirt margin", "dead lawn", "character contact shadow"],
  "never_next_to": ["interior floors", "wet ground", "standing water"],
  "weather_ok": ["sunny", "cloudy"],
  "acts": [1],
  "edge_contract": "single placement",
  "anim": {"frames": 4, "beats": 1, "bpm": 120},
  "tags": ["character", "fx", "dust", "footfall", "ground-contact", "beat-quantized"]
}
```

## G. REFERENCES
- APPROVED ANCHOR: the PARTICLE_LOOP / FIRE_FLICKER bank
  (`BOHEMIA_FIRE_FLICKER_BANK_7_13_26` + `PARTICLE_LOOP_BANK`) — anchor for
  the *timing and frame discipline* of an approved short loop, explicitly NOT
  for its emissive material. Value anchor is the frozen CBB target screen's
  ground band, since dust is that ground in the air.
- NAMED OUTSIDE REFERENCE: **Shovel Knight** — its landing puffs are the
  textbook pixel dust: tiny, 3-4 frames, gone before you consciously see
  them, and they sell weight entirely through timing rather than size.
  Secondary: **Blasphemous**, for dust that keeps the ground's own colour
  instead of going white.
- REAL-WORLD GROUNDING: Mojave dust off the Las Vegas valley floor. The
  researched specifics that should drive the art: the surface is caliche — a
  calcium-carbonate crust — so the dust it raises is PALE, chalky and almost
  bone-coloured, not brown. It is also FINE (the valley's PM10 dust problem is
  a real, regulated Clark County issue precisely because the particles are so
  small), which means it hangs and spreads rather than falling straight back
  like sand. And it only happens dry: after one of the valley's rare rains the
  same ground raises nothing at all, which is exactly why rain suppresses this
  asset instead of merely dimming it.

## H. DON'T WANT
- **NOT a white cloud.** Pure white is off the ground band and reads as smoke
  or steam. Dust is the floor, airborne.
- **NOT smoke.** Smoke rises, billows and persists; dust bursts low, spreads
  and dies inside one beat. Getting this wrong turns every footstep into a
  small fire.
- **NOT a tall plume.** 45 DEGREE ART LAW — a vertical column is the side-on
  scroller read the law exists to prevent.
- **NOT dithered.** "Soft" is the excuse dither always arrives under, and it
  is still banned.
- **NOT in the rain.** Named explicitly because a separate lane owns the
  weather overlays and this is the collision that would look stupidest.
- **NOT persistent.** No lingering haze, no accumulation. One beat, gone. A
  puff still on screen two beats later is a failed puff.
- **NOT bigger than the boot.** Oversized dust turns a walk into a stampede.

## I. ACCEPTANCE
- [ ] Seam measured: n/a (SINGLE PLACEMENT)
- [ ] Palette ceiling + ground value band + one-light checks green; no dither
      detected; purity sweep clean
- [ ] BEAT PROOF: the 4 frames measured against BEAT=0.5s at 120 BPM, and the
      puff proven to start on the frame the foot plants — a puff that fires
      off-beat breaks I-MOVE-YOU-MOVE and is rejected
- [ ] LEAF-PIXEL PROOF: frame-to-frame diff shows the anchor pixels frozen and
      only the cloud edge moving
- [ ] Squint test: at walk zoom it must read as dust, not as a white blob or
      a bullet impact
- [ ] 3x3 TILED PROOF: n/a — instead, a full walk-cycle strip showing both
      feet firing across a whole loop without strobing or doubling
- [ ] ON THE REAL SURFACE: the character walking on desert hardpan in RUN,
      beside the same walk with the fx off; plus one frame proving it does NOT
      fire on wet ground
- [ ] Caption JSON parses and matches C/D

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: CHARACTER lane | DATE: 7/28/26 | PRIORITY: MED
- BOARD ROW #: 12 | VERDICT: —
