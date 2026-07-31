# TILE FORM TF-CMB-003 — THE DEAD CAR YOU FIGHT FROM BEHIND

> ### RULED AND ANSWERED 7/29-7/30. NOTHING WAS COOKED.
> **Paolo 7/29: "we have hella cars on file that are aproved. and when u slide a
> car in it should be 2 tiles by 3 tiles so yeah."** Then 7/30, after I deferred
> it twice: **"I DIDNT SEE ANY CARS BRO WTF IS WRONG WITH YOU!"**
>
> **HIS SIZE RULING SUPERSEDES SECTION E's deferral to the `_vehicle` helper: a
> car is 2 TILES BY 3.** That is the footprint, and it is what shipped.
>
> **AND THE SHOPPING CHECK CAME BACK A HIT, so this form is CLOSED BY REUSE.**
> `banks/BOHEMIA_STREET_PROP_POOLS_7_18_26.txt` pool `car_wreck`, 20 items,
> provenance "HD_TILE_REPO part2 / 10. Abandoned cars (top-down, the V11 bake
> family)". All 20 were RENDERED AND LOOKED AT before anything was built: real
> top-down abandoned cars, sedans plus a pickup plus a cop car, every one
> sun-bleached and rust-blotched and chalky. Exactly the Mojave failure mode
> section G describes (they BAKE, they do not rot).
>
> So the answer to section B's question is: **the art already existed and did not
> need drawing.** Shipped 7/30 in the combat demo, 8 of the 20 embedded, as a
> six-cell footprint with one sprite over it. Engine and cabin cells are TALL,
> boot cells are LOW, which delivers section E's asymmetric hide with no new
> geometry at all.
>
> **STATUS: CLOSED BY REUSE. Nothing for the art lane to cook.** The one thing
> that could still reopen it is Paolo looking at the shipped cars and rejecting
> the look, in which case this form is the evidence trail and section H already
> lists what to avoid.
> Tool: `tools/bohemia_combat_cars_patch.py`, gate section 37.

## A. IDENTITY
- NAME: The dead car (a stopped, sun-killed car, used as cover in a fight)
- FAMILY/SET: COMBAT COVER family, the ONE named object in it. Not a variant of
  TF-CMB-001 or TF-CMB-002: a car is its own silhouette and its own scale rule.
- THE JOB, ONE SENTENCE: this tile exists so that the most obvious piece of
  cover any human being would take on a Las Vegas parking lot actually exists on
  the field instead of being a brown box.

## B. WHY
- DEMANDED BY: the COMBAT NORTH STAR (Paolo 7/27/26) plus the arena vocabulary
  he asked for ("maybe its time to add a shuffable arena map fr"). Every arena
  the generator rolls is a lot, and a lot with no cars on it is not a lot.
- WHAT LOOKS BROKEN TODAY: there are no vehicles on the combat field at all.
  Zero. The whole field is code-drawn tan boxes on a code-drawn grey fill, and a
  fight in a dead city with no dead cars in it reads as a test harness, which is
  what it currently is.
- SHOPPING CHECK:
  * `banks/BOHEMIA_STREET_PROP_POOLS_7_18_26.txt` carries **`car_wreck` x20**.
    THIS IS THE FIRST THING THE ART LANE MUST OPEN. Caveat recorded honestly:
    that file self-describes as "derived pool for the bake factory; corpus art,
    no new canon", it is not a row in
    records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md, and it has no Paolo verdict
    of its own. So it is corpus-derived, not thumbed. If those 20 read at 45 and
    at the canon car size, this form is satisfied by reuse and NOTHING should be
    cooked.
  * VEHICLE SIZE law: there is ONE canon car/bus/trailer size across every hero,
    enforced by `gates/vehicle_size_gate.py` via the shared `_vehicle` helper.
    Whatever ships MUST match it. That gate is the size ruler, not this form.
  * DEMO_PROP_POOL: no vehicles in any family. STARTER TILESET 42: no vehicles.
    DISTRICT HERO art draws cars, but via the `_vehicle` helper at hero scale on
    the city map, not as a placeable combat-field object.

## C. WHERE
- SURFACE + TAB: COMBAT (the fight field, the SLICE tab); RUN lots and streets
  later.
- DISTRICT FAMILIES: all. Cars died where they stopped, which is everywhere.
- LAYER: structure
- SOLID? yes (blocks movement and line of sight) — ENTERABLE? no for Act 1.
  (A car you can get INTO is a portal-layer ask and a Paolo ruling; not this
  form.)
- MUST SIT BESIDE: asphalt, concrete slab, graded dirt, painted stall lines,
  kerb and gutter, low cover, tall cover. Parked square to a stall is the
  default; blocking an aisle at an angle is the second reading.
- NEVER BESIDE: interior floors. Never on a roof or a deck it could not have
  driven onto (a deck reachable by ramp is legal, a roof is not). Never
  stranded in open desert with no road or lot touching it.
- EDGE CONTRACT: SINGLE PLACEMENT.

## D. WHEN
- ACT: 1
- BEST TIME: both. No self-light: nothing has a working headlight, and a lit car
  is a story event, not a tile.
- WEATHER STATES: sunny baseline; cloudy from the wash; RAIN darkens the body,
  beads on the horizontal panels and pools under the sills.
- LIT/UNLIT variant: none of its own.
- ANIMATION: static. It never moves, ever. That is the whole point of it.
- FOOTPRINT NOTE for the machine: this is the only cover object in the family
  that is longer than one tile in one axis, so the caption declares it and the
  generator must place it on a real multi-tile footprint, not squeeze it.

## E. HOW
- EXACT SIZE: 44px cell grid. Footprint is the CANON CAR LENGTH from the
  `_vehicle` helper, which is the single source of truth (typically 2 tiles long
  by 1 wide at this cell size, but the helper decides, not this form).
- VIEW: 45-degree world view. This is the object most likely to be drawn wrong,
  because cars are the thing artists most often draw side-on. Roof and hood are
  sky-lit and visible; the greenhouse (glass) is a dark inset; the body bands
  bow toward the viewer. Four bearings if the generator can rotate it, otherwise
  two (long axis and short axis) with the long axis as the primary.
- PALETTE: constitution ceiling; STRUCTURE value band. Sun-killed paint is
  DESATURATED, so a red car reads as chalky pink-brown, never as red.
- LIGHT: one global direction. NO keyline. NO dither.
- SHADOWS: none baked; a car throws a large low shadow and the separate pass
  owns it.
- SCALE ANCHORS: the canon `_vehicle` car length, and the rig standing at the
  door. A man behind the engine block is hidden to the chest; a man behind the
  boot is hidden to the waist. That asymmetry is a gameplay gift and the art
  should make it legible.
- WEAR LEVEL: years in the Mojave with nobody touching it. Clearcoat gone so the
  roof and bonnet are chalked matte while the vertical panels keep a little
  gloss; tyres flat and cracked so it SITS LOW on its rims; glass either crazed
  white or gone; sand drifted up the windward side; no rust bloom worth
  mentioning, because it is a desert, not a coast. Desert cars bleach, they do
  not rot.
- VARIANTS: 3 body silhouettes at most (a sedan, a pickup, a small crossover)
  plus colorways. More silhouettes are new forms. A burned-out shell is a
  different WEAR and can share this form as a variant.

## F. THE CAPTION
```json
{
  "id": "TF-CMB-003",
  "name": "dead car",
  "layer": "structure",
  "solid": true,
  "enter": false,
  "district_families": ["all"],
  "best_time": "any",
  "best_location": "parked square in a stall, or stopped at an angle blocking a lot aisle",
  "place_next_to": ["asphalt", "concrete slab", "stall lines", "kerb", "low cover", "tall cover"],
  "never_next_to": ["interior floors", "roofs", "open desert with no road or lot"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "single placement",
  "anim": null,
  "tags": ["cover", "vehicle", "combat", "multi-tile", "asymmetric-height"]
}
```

## G. REFERENCES
- APPROVED ANCHOR: the canon `_vehicle` size helper (machine-locked by
  `gates/vehicle_size_gate.py`, 14 checks across every hero) is the size truth;
  the district heroes that already draw cars are the nearest drawn anchor.
  `car_wreck` x20 in STREET_PROP_POOLS is the reuse candidate to try first.
- NAMED OUTSIDE REFERENCE: **Jagged Alliance 2** again for cover read off the
  world; and **Project Zomboid** specifically for how a dead car reads from
  above in a top-down game: it sits LOW on dead tyres, the roof is the biggest
  and brightest plane in the sprite, and the glass is the darkest, which is
  exactly the value ladder that makes a car legible at small size.
- REAL-WORLD GROUNDING: a car left in Las Vegas sun does not rust, it BAKES.
  Clearcoat fails first and the horizontal surfaces (roof, bonnet, boot) chalk
  to a flat pastel while the doors stay comparatively glossy; the dash and
  interior plastics crack and the glass crazes; tyres dry-rot and deflate so the
  whole body drops. Colours fade toward the same chalky pastel regardless of
  what they started as. The valley is full of them in lot corners and behind
  chain link.

## H. DON'T WANT
- NOT a side-on scroller car. This is the highest-risk object in the whole
  request list for exactly that failure.
- NOT a saturated car. A bright red or bright blue car breaks the constitution
  ceiling and lies about the sun.
- NOT rusted-to-a-lace wasteland car. That is a coastal or rainy failure mode.
  Vegas bleaches; it does not eat metal.
- NOT sitting proud on good tyres. If it looks driveable, it is wrong.
- NOT a burning car and NOT a wrecked-in-a-crash pileup unless it is an
  explicitly chosen variant; the default is a car that simply stopped.

## I. ACCEPTANCE
- [ ] `vehicle_size_gate` green: the footprint matches the ONE canon car size
- [ ] palette ceiling + STRUCTURE value band + one light green; saturation check
      against the constitution (a sun-killed car must measure desaturated)
- [ ] 45 check green (`art_45_gate`): the roof is visible and sky-lit
- [ ] HIDE PROOF: rig behind the engine block is hidden to the chest, behind the
      boot to the waist, and both are screenshotted
- [ ] squint test at 1-tile map zoom: still reads CAR
- [ ] 3x3 proof: three parked in a row read as a parked row, not a traffic jam
- [ ] ON THE REAL SURFACE: screenshot on the combat field on starter asphalt
- [ ] caption JSON parses and matches sections C and D

## J. ADMIN
- STATUS: CLOSED BY REUSE (7/30) | REQUESTED BY: COMBAT lane | DATE: 7/28/26 | PRIORITY: HIGH
- BOARD ROW #: 52 | VERDICT: —
