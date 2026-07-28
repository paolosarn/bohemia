# TILE FORM TF-CITY-007 — SUBURBAN YARD DRESSING (the things in a front yard
# that prove a person lived there)

## A. IDENTITY
- NAME: The stuff in a Vegas front yard — the mailbox, the AC pad, the bin,
  the rock border, the boulder
- FAMILY/SET: SUBURB YARD DRESSING set. One drawing job, 7 props: kerbside
  mailbox, ground-mounted condenser on its pad, wheeled trash bin (upright and
  tipped), decorative boulder, xeriscape rock-border edging, hose bib with
  dead hose, house number plaque.
- THE JOB, ONE SENTENCE: this exists because our suburb yards are flat tan
  rectangles with literally nothing on them, so a neighbourhood reads as a
  model of a neighbourhood rather than somewhere ten thousand people used to
  live.

## B. WHY
- DEMANDED BY: the WALKABLE-LAND law's SPIRIT clause, quoted exactly — "hold
  the render-and-look bar: a walkable district must read FINISHED and USED
  (dense buildings + purpose), not thin features stranded in empty lawn/
  pavement"; Paolo 7/28 after the border walls landed: "it still looks like
  shit so much of the game but whatever."
- WHAT LOOKS BROKEN TODAY: measured in the run's tile resolver — a yard cell
  returns `['yard_0','yard_1','yard_2']` and nothing else; there is no prop
  layer on yards anywhere in the renderer. Screenshotted 7/28 on the real run
  surface (scratchpad x_door.png, x_street.png): every front yard in the block
  is an unbroken tan field between the driveway and the kerb. The three
  approved yard skins (yard_deserttan_27, yard_mojavegold_28, yard_rebelred_29)
  changed the COLOUR of that field on 7/28 and could not change the fact that
  it is empty, because they are ground materials and this is a prop gap.
- SHOPPING CHECK: records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md, every row
  that could hold an exterior residential prop. HOUSE SKINS (30) opened — 3
  yard tiles, all ground materials, zero props. STARTER TILESET (42)
  enumerated — no props at all; it is a pure surface set. INTERIOR POOL (465,
  12 buckets) — indoor furniture, and by the interiors law interior tiles never
  leak outside; also the wrong scale. DESERT/TERRAIN picks — ground and rock
  SURFACES, plus the pool is separately MEASURED broken on seams
  (records/BOHEMIA_DESERT_POOL_SEAM_FINDING_7_28_26.md), and a decorative
  boulder is a placed object not a ground texture. LAMPS (7 dark variants) —
  street furniture, already wired to sidewalks, not yard props. HD PACK judged
  tiles — checked for exterior residential props; what exists is off-genre or
  European-suburban and out of band. Nothing in the index dresses a yard.
- SEPARATION FROM AN EXISTING BOARD ROW, stated so this is not a duplicate:
  board row 5 (DEAD FOLIAGE SET) covers dead PLANTS — lawns, shrubs, trees,
  palms, tumbleweed. This form covers MAN-MADE OBJECTS only. They compose in
  the same yard and neither can substitute for the other.

## C. WHERE
- SURFACE + TAB: RUN (the walk) and CITY (human mode). At map zoom: invisible.
- DISTRICT FAMILIES: suburb, gated, estate, trailer, apartment courtyards.
- LAYER: prop
- SOLID? no — props are never collision (the 7/26 interiors law, applied
  outside for the same reason: a prop that stops you is a wall pretending to be
  furniture) — ENTERABLE? no
- MUST SIT BESIDE: yard ground of any approved skin; the kerb (the mailbox
  lives AT the kerb, by federal delivery rule, not at the front door); the
  house wall (the condenser pad sits against it); the driveway (the bin lives
  at the side of the drive).
- NEVER BESIDE: the road surface itself (a mailbox in the traffic lane);
  interior floors; a roof (rooftop equipment is TF-CITY-002 and the two must
  not be confused — see the anti-reference).
- EDGE CONTRACT: SINGLE PLACEMENT — never repeats, EXCEPT the rock-border
  edging, which is a linear run and is SELF-SEAMLESS along its axis with an
  end cap. Two contracts in one form is deliberate and is called out here so
  the acceptance test knows to measure the border's wrap and not the others'.

## D. WHEN
- ACT: 1
- BEST TIME: both. Nothing self-lights. Nothing runs.
- WEATHER STATES: sunny baseline; cloudy no change; RAIN-WET — plastic and
  sheet metal darken and go glossy-dark far more than the dirt around them,
  which is the one moment these props separate from the ground. Value only.
- LIT/UNLIT: none. (Deliberate: the obvious idea is a solar path light, and it
  is wrong — a lit yard object would break DEAD IS DEFAULT and hand light to a
  household that does not own any. LIGHT=TERRITORY.)
- ANIMATION: static, all seven.

## E. HOW
- EXACT SIZE: authored on the 44 x 44 px cell. Mailbox, hose bib, house number
  and border are SUB-TILE. The condenser and the wheeled bin are roughly one
  cell footprint and, being boxes at 45 degrees, draw TALLER than their cell.
  The boulder is 1-2 cells.
- VIEW: 45-degree world view, and this set is where the law is easiest to
  break because these are small objects: the bin is a BOX with a sky-lit lid,
  the boulder is an ELLIPSE cross-section with a lit top (the blessed lamp bank
  is the reference for both), the mailbox is a box on a post whose post
  attaches to the ground correctly rather than floating.
- PALETTE: constitution ceiling. Value band: **ground** (mean 103.7, lo 49.3,
  hi 152.2) — these sit ON the ground plane and must not out-value the house.
  The bin is the one object allowed to sit low in the band; a sun-bleached
  plastic bin is PALE, not dark, which is a real and specific Vegas fact.
- LIGHT: upper left, shadows down and to the right. NO keyline. NO dither.
- SHADOWS: none baked; the runtime pass gives every one of these a shadow and
  that shadow is most of what makes a small prop sit on the ground rather than
  hover.
- SCALE ANCHORS: a mailbox post is chest height on a person; a wheeled bin is
  waist-to-chest; a residential condenser is about knee-to-waist and roughly
  2.5 ft square; a decorative boulder is knee height. The 2-tile door and the
  human rig are the anchors. Anything bigger than a person in a front yard is
  wrong.
- WEAR LEVEL: ten years, and this set is where the dead world is TOLD rather
  than stated. Mailbox doors hanging open and empty — nobody has delivered
  anything in a decade, and an open empty mailbox is the whole apocalypse in
  one object. Bins tipped and scattered, or missing entirely (a wheeled bin is
  the most useful container in a scavenging economy and most of them are GONE —
  the honest density is fewer bins than houses). Condenser cases opened and
  gutted for the copper coil, which was already a Vegas theft economy before
  the collapse. Plastic sun-bleached to chalk. Rock borders kicked out of line
  and half-buried in blown silt.
- VARIANTS: mailbox (shut / hanging open), bin (upright / tipped / absent),
  condenser (cased / gutted). Everything else single. No colorway variants —
  these are found objects, and per STRUCTURE-NOT-COLOR a recolour would not be
  progress anyway.

## F. THE CAPTION
```json
{
  "id": "TF-CITY-007",
  "name": "suburban yard dressing",
  "layer": "prop",
  "solid": false,
  "enter": false,
  "district_families": ["suburb", "gated", "estate", "trailer", "apartment"],
  "best_time": "any",
  "best_location": "front yard: mailbox at the kerb, condenser against the house, bin beside the driveway, rock border along the yard edge",
  "place_next_to": ["yard ground (any approved skin)", "walk_kerb", "house wall", "driveway"],
  "never_next_to": ["road surface", "interior floor", "roof"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "single placement (rock border: self-seamless along its axis)",
  "anim": null,
  "tags": ["prop", "yard", "suburb", "xeriscape", "salvage", "dead-world"]
}
```

## G. REFERENCES
- APPROVED ANCHOR: banks/BOHEMIA_LAMP_DARK_VARIANTS_7_14_26.txt — the blessed
  lamp bank is the repo's named reference for a dead man-made object standing
  on a ground plane at 45 degrees, and the mailbox is a lamp-post problem with
  a box on top. Secondary: the three approved yard skins
  (yard_deserttan_27 / mojavegold_28 / rebelred_29), which are the ground these
  props must sit on without a halo.
- NAMED OUTSIDE REFERENCE: Project Zomboid's residential yard props for
  DENSITY discipline at this zoom — how few objects a yard needs before it
  reads as lived-in, and how fast it tips into looking like a junkyard. Take
  the restraint, never the palette. Secondary: Death Road to Canada's roadside
  object silhouettes for how a tiny prop stays readable when it is six pixels
  tall.
- REAL-WORLD GROUNDING: the Las Vegas front yard is not a lawn and has not
  been one for a generation, and the reason is documented policy. The Southern
  Nevada Water Authority's Water Smart Landscapes rebate pays homeowners per
  square foot to tear out grass and replace it with desert landscaping — the
  conversion program is one of the largest of its kind in the country and the
  valley's residential frontage has been mass-converted to rock. The resulting
  standard Vegas front yard is: decorative gravel over weed fabric, a hard
  border of larger rock or concrete edging, a decorative boulder or two, a
  handful of widely-spaced desert plants, and man-made objects — the kerbside
  mailbox, the bin, the hose bib, the house numbers. Note the split with
  TF-CITY-002: rooftop package units are the Vegas norm, but plenty of homes
  ALSO have a ground-side condenser or the concrete pad where one used to be,
  and the empty pad is a better object than the unit. This is why the yard
  props are man-made and the plants are a different form: in real Vegas the
  yard is mostly rock and objects, not vegetation, and our yard skins are
  already the rock.

## H. DON'T WANT
- NOT a green lawn, not a sprinkler, not a hedge. The valley does not have
  them and act 1 has no vegetation.
- NOT a rooftop package unit on the ground. TF-CITY-002 is the roof; this is
  the yard; confusing them puts a Vegas roof object in a Midwest yard.
- NOT a junkyard. The density failure is worse than the emptiness failure
  because it is harder to undo — most yards get ONE object, some get none.
- NOT working, NOT clean, NOT complete. Everything is bleached, opened, or
  gone.
- NOT lit. No solar path lights, no lit house numbers.
- NOT green, NOT purple (PURITY law).
- NOT lettering on the house-number plaque unless Paolo rules the numbering.
  MECHANISM-MINE / CONTENTS-PAOLO'S: the plaque exists, the digits are his.

## I. ACCEPTANCE
- [ ] Seam: n/a for the six placed props; the rock border's wrap MEASURED
      along its axis (interior-vs-edge delta within the normal neighbour step
      — the desert-pool lesson applies to any linear run)
- [ ] Every prop sits on all three approved yard skins with no halo and no
      background square
- [ ] Palette ceiling + **ground** band + one-light + no-keyline + no-dither +
      no-glow checks green
- [ ] Squint test: each prop readable as its own object at walk zoom; the
      mailbox in particular must not read as a post
- [ ] DENSITY PROOF, not a 3x3: a whole block of six front yards dressed at
      the intended density, to prove the street reads lived-in without reading
      cluttered. This is the judgement that matters and a lone-prop sheet
      cannot answer it.
- [ ] ON THE REAL SURFACE: the run, standing in the street (the exact
      scratchpad x_street.png framing), beside today's empty-yard render
- [ ] Caption JSON parses and matches C/D
- [ ] COMPOSES WITH board row 5 (dead foliage): shown in one yard together, to
      prove neither form pre-empts the other

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: CITY lane (screenshotted on the real run
  surface 7/28; yard resolver returns three ground tiles and nothing else)
  | DATE: 7/28/26 | PRIORITY: MED
- BOARD ROW #: 66 | VERDICT: —
