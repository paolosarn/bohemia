# THE TILE BOARD SITTING — 15 FAMILIES COOKED, 525 CANDIDATE TILES, ONE JUDGE PAGE

8/9/26 · ART LANE · Paolo 8/8: "ultracode go: swarm the tile request board. Cook
every OPEN form in records/tileforms/ top-down by priority in parallel... deliver
everything as assembled judge scenes batched by discipline for one Paolo sitting.
Don't stop until the board or the clock runs out."

The clock ran out. This is what got done, what did not, and where the honest
edges are.

## WHAT GOT DONE

The board's 67 forms were triaged by all 7 disciplines, deduplicated per the
COLLISIONS blocks into **49 merged jobs**, and cooked top-down by priority. The
session usage limit killed the swarm mid-flight; **15 of the 49 jobs finished**
(14 in the swarm, the landfill finished inline after two crash fixes in its own
cook). Nothing marked DO NOT COOK was cooked — the parapet-corner hold on
TF-ART-017 is honoured: TF-ART-012 filed the parapet WANG-16 ring FIRST and owns
it in its own spec; 017 (which duplicates the corner) was never cooked and its
ownership question stays with the coordinator.

The 15 cooked families, 525 candidate tiles total:

| form | family | tiles |
|---|---|---|
| TF-ART-001 | CMU block wall | 6 |
| TF-ART-002 | corrugated metal + roll-up doors | 26 |
| TF-ART-003 | parking lot striping | 49 |
| TF-ART-004 | chain-link fence | 31 |
| TF-ART-005 | dead sports turf + track | 60 |
| TF-ART-006 | empty pool basin | 38 |
| TF-ART-008 | storefront glass | 34 |
| TF-ART-009 | brick masonry | 10 |
| TF-ART-010 | rail track bed | 22 |
| TF-ART-011 | the freeway | 16 |
| TF-ART-012 | commercial flat roof | 86 |
| TF-ART-013 | mobile home siding | 45 |
| TF-ART-014 | dead crop field | 43 |
| TF-ART-015 | landfill cell | 55 |
| TF-CMB-005 | deck stair run | 4 |

Every bank carries `law: "UNJUDGED. Nothing here is canon until Paolo sweeps
it."` **Not one of these tiles draws a pixel in the game.** Cook scope was held:
only `tools/tfcook/`, `banks/tileforms/`, `records/tileforms_proofs/` were
written by cooks.

## HOW IT WAS VERIFIED (because the swarm's own verify stage never ran)

The workflow's design was cook -> adversarial verify per job. The usage limit
killed every verify agent — the run result listed 13 "kills" that were actually
verify agents dying with null verdicts, NOT skeptic refutations. Zero skeptic
verdicts exist from the swarm. So verification was redone inline:

1. **Measured sweep, all 15 banks:** max purple 0.0% everywhere (PURPLE
   RESERVATION, measured not trusted), max saturated-green 0.4% (dead valley),
   mean saturation 0.14-0.30 (his shipping ground is 0.16-0.18), transparency
   only where the object is see-through (chain-link 71.8% — correct for mesh).
2. **Render-and-look on the proofs** (the thing that caught all six ground
   failures): TF-ART-012's contact sheet and anchor composite (the cooked
   parapets sit in the world's value band; the incumbent bright-orange
   `roof_parapet` is visibly the outlier it was flagged as), TF-ART-003's
   assembled stall row, TF-ART-005's contact sheet, TF-ART-010's 20-cell
   continuity run under the freeway pier, TF-ART-015's 12x12 assembled scene.
3. **The real surface:** the judge page booted in the alpha, inside the ART
   tab, via the TILE BOARD banner — 15 cards, 52/52 proof shots painting,
   tap-cycle stepping, export producing `BOHEMIA_TILE_BOARD_VERDICT.txt`, back
   link returning to ART. art_tab_gate 28/28.

## THE JUDGE PAGE (NAME THE TAB: it is in the ART tab, the TILE BOARD card)

`slices/BOHEMIA_TILEFORMS_JUDGE_8_9_26.html`, built by
`tools/build_tileforms_judge.js`. One card per family, money shot first (the
family ASSEMBLED beside approved art), tap to step through, thumbs, per-card
note, bottom comment, SUN MODE, export .txt. The 52 curated proof shots are
COPIED into `records/target/tileforms/` (10.2 MB) because GitHub Pages publishes
only slices/ + engine/ + records/target — a page referencing
records/tileforms_proofs/ would work on disk and 404 in production, the exact
trap _config.yml warns about.

## WHAT DID NOT GET DONE — 34 OF 49 JOBS, NAMED, NOT GLOSSED

The swarm died on the session usage limit with 34 merged jobs uncooked,
including every CITY, WORLD, RUN, CHAR and LAB form and the rest of CMB. The
board (`records/tileforms/`) still shows them OPEN. The workflow can resume with
cached results (script + runId in the handoff), **but ultracode is off and
resuming was interrupted three times, so nothing relaunches without Paolo
saying so.**

## CRASHES FIXED INLINE (root cause, same turn)

- `TF-ART-015_cook.py` measure(): a fully-transparent tile produced an empty
  pixel array and a 1-D hsv array crashed the indexer. Empty mask now measures
  as zeros instead of crashing.
- Same cook, seam stats: a tile family whose names did not prefix-match its
  seam group produced an empty wrap list and `max()` threw. Empty list now
  reports wrap_max 0.0.

## 8/9 SECOND PASS (the GO after the verdict): +2 COOKS, +10 CLOSURES

Paolo's GO ("get this demo rolling") resumed the board inline. Recovered the
swarm's dedup map from the workflow journal instead of re-deriving it:

- **10 duplicate forms closed by the merged cooks** (their status lines now
  point at the bank that covers them): TF-RUN-003/TF-WORLD-003 -> chain-link,
  TF-RUN-004 -> corrugated, TF-WORLD-005 -> sports, TF-WORLD-004 -> pools,
  TF-WORLD-008 -> storefront, TF-WORLD-006 -> rail, TF-RUN-006 -> mobile home,
  TF-WORLD-007 -> flat roofs, TF-WORLD-012 -> landfill.
- **TF-RUN-008/009/010 cooked as one batch** (the forms' own law): the game's
  first UI marks. Resources = tape roll + hammer + apple, energy = jerrycan +
  bolt + battery, clout = merged crowd + speech bubble. 32px native, master-ramp
  snapped, no keyline/glow/purple, solid-black silhouette test passed, normal +
  dimmed states, phone-chrome mock both themes. 6 marks.
- **TF-CHAR-001 cooked**: the character contact shadow. 6 alpha stamps
  (standing/walk/crouched x lit/unlit), multiply model, measured step-down on
  every approved starter ground (dirt 25, gravel 30, sidewalk 23, asphalt 12,
  interior 4.5 - the fade on dark ground is the design), real-frame A/B from
  the shipped build. SHADOWS ARE SEPARATE honoured: never baked into sprites.

The sitting is now **17 families, 537 candidate tiles**, all UNJUDGED, one page.
Still open on the board: 22 merged jobs (the biggest: deck slab + covers for
CMB, kerb/apron TF-ART-018, signs TF-WORLD-010, camp TF-LAB-001, tilt-up
TF-RUN-005, desert ground TF-RUN-001 - the ground half needs Paolo's seventh-
attempt ruling first).

## 8/11 THIRD PASS: THE FIRST APPROVED FAMILY IS IN THE GAME

TF-ART-010 rail is WIRED (the first of the 14). The run's draw path gained an
approved-families hook that outranks the generic bought-ground override (a rail
corridor is not 'dirt'): every 'rail track' cell in the railyard centres a
5-slice yard corridor (rails landing on the ballast rows either side - the fan
spaces tracks 7 rows apart so corridors can never collide), phase A/B
alternating per cell per the bank's own 88px tie contract, and the yard's
'ballast / gravel' bed draws the approved plates. The builder REFUSES any bank
whose law line is not APPROVED, so nothing unjudged can ever reach the map.
Verified standing in the yard on the real surface: ties, rails, plates,
continuity, boxcars sitting on their tracks. Gates: run 126, light 41, exterior
pool 37, grime 24, alpha loads 20, bought beats painted 20.

Remaining rail volume: turnout, crossing, buffer stop, the vertical mainline.
Next families to wire, in order of surface: flat roofs, corrugated skins,
parking stalls (needs stall-name probe per district), chain-link (multi-cell
overlay, own pass).

## 8/11 FOURTH PASS: SECOND FAMILY WIRED (PARKING LINES), AND A MISS CAUGHT BY A/B

TF-ART-003 striping is live wherever the world NAMES its painted lines: 'stall
marking' / 'stall stripe' cells (courthouse, commercial, chapel, industrial,
warehouse, downtown) pick line pieces by 4-neighbour topology (runs, ends,
corners, tees, cross - same WANG idea as the parapet ring).

THE MISS, CAUGHT ON THE REAL SURFACE BEFORE SHIPPING: the first cut also keyed
on 'parking stall', and medical's 289 such cells are whole BAYS, not lines - an
in-page A/B (same frame, pieces stripped) showed my line pieces painting a
lattice over the bays' own row art. Bay names are excluded by measurement now,
and the drive-in's arc markings stay a deliberate blank (no curved piece in
the family; a straight tile on an arc is a lie). Gates re-run green after the
fix (run 126, light 41, alpha loads 20, grime 24, bought 20, exterior pool 37).

## 8/11 FIFTH PASS: THIRD FAMILY WIRED (THE PARAPET RING)

TF-ART-012's coping ring is live: 'roof edge' cells (the dossiers already
traced the line - downtown 194, chapel 380, courthouse 168, library 596) pick
run/out-corner/in-corner/end pieces from which sides face open air, a/b phase
along the run, colourway by district family (downtown oxide, civic bone, the
rest galv). 'rooftop plant' cells wear the duct pieces. The RTUs are 88x86 -
NOT a whole number of cells - so they stay unwired by the no-resample law and
are named as volume, not skipped silently. Verified standing at the library
ring on the real surface: coping runs both edges and turns its corner.
Gates: run 126, light 41, alpha loads 20, bought 20, grime 24.

THREE OF FOURTEEN FAMILIES ARE NOW IN THE GAME: rail, stripes, the ring.

## 8/11 SIXTH PASS: FOURTH FAMILY WIRED (CORRUGATED METAL)

TF-ART-002 joined ten metal districts' wall pools as four materials of its own
(bare + rust runs, offwhite, sand, bluegrey paints) through the 8/3
one-material-per-building machinery - pure builder wiring, no new draw rule.
Verified standing in the warehouse: rust-run mass, plate mass and a paint mass
on adjacent buildings, per-cell shuffle, no stamping. The under-eave course,
end jambs and 110px roll-up doors need course/multi-cell placement and are
named volume. Gates: run 126 (after fixing my own buildstamp to the
date-letter shape the gate rightly demands), alpha loads 20, light 41,
grime 24, bought 20.

FOUR OF FOURTEEN FAMILIES ARE IN THE GAME: rail, stripes, ring, metal.

## 8/11 SEVENTH PASS: FIFTH FAMILY WIRED (CHAIN-LINK)

TF-ART-004 is live in every district that NAMES its fence line ('fence' /
'perimeter fence' / 'chain-link fence' - thirteen districts, ~2,300 cells) and
excluded from every 'wall' (the jail's razor wire and the suburb community
wall are different objects). Placement per his 8/11 bar: one fence LINE wears
one style (variant keyed per row/column), the E-W run art is a 4-cell sheet
sliced per cell so the weave never restarts, the fence stands two cells tall
with the mesh overlaying what is behind it, the fence cell's own ground paints
under the see-through mesh, posts land at junctions/corners/stubs, one segment
in seventeen is breached. Looked at live at the solar farm: the E-W mesh runs
read like the approved proofs; N-S columns are thinner but continuous. Gates,
toppers, slats, sag/lean are named volume.
FIVE OF FOURTEEN FAMILIES ARE IN THE GAME: rail, stripes, ring, metal, mesh.

## 8/11 EIGHTH PASS: SIXTH + SEVENTH FAMILIES WIRED (GHOST BRICK, MOBILE HOMES)

Both are pool joins through the one-material-per-building machinery (which now
seeds on the flood-filled MASS per his placement ruling): TF-ART-009's
painted-over ghost-brick field joined six old-brick districts; TF-ART-013's
three park colourways (field + stripe courses) joined the trailer pool. Both
looked at live: one home one colour in the park; whitewashed brick with the
old wall bleeding through above downtown's dead storefront glass (the brick
card was NOT shipped until a mass that actually hashed to brick was found and
shot - a card that lies is a card that lies). Course volume named: soldier
rows, corners, skirts, mh roofs, awnings, hitch, burned row.
SEVEN OF FOURTEEN FAMILIES ARE IN THE GAME:
rail, stripes, ring, metal, mesh, brick, mobile homes.
Remaining unwired: CMU block wall (TF-ART-001), sports fields (TF-ART-005,
needs field assembly logic), pools (TF-ART-006, basin assembly), storefront
glass (TF-ART-008, facade course logic), freeway (TF-ART-011, corridor like
rail), crop fields (TF-ART-014, farm rows), deck stairs (TF-CMB-005, blocked
on the TF-CMB-004 slab cook).

## 8/11 NINTH PASS: EIGHTH FAMILY WIRED (THE CROP FIELDS)

TF-ART-014 draws on the farm's own named ground: 'field soil' (2,184 cells) is
fallow bare plot, 'crop rows' (513) are the furrow fields with ONE furrow style
per plot, 'irrigation' (211) is silted earth ditch. These were the deliberate
blanks of the 8/5 prop pass - held empty until the right family existed rather
than dressed wrong. Looked at live: the farm reads as one continuous dead
fallow field with furrow bands. Edge WANG set, berms, concrete ditches and the
dirt track are named volume.
EIGHT OF FOURTEEN FAMILIES ARE IN THE GAME.
Remaining unwired (6): CMU courses (cap/vent, needs material-aware course
logic), sports fields + pools + storefronts (assembly logic), freeway (render
path is not district cells - needs its own research), deck stairs (blocked on
the TF-CMB-004 slab cook).

## 8/11 TENTH PASS: NINTH FAMILY WIRED (DEAD SPORTS TURF), AND AN HONEST HOLD

TF-ART-005 draws on every 'dead turf' surface: the park's open lawn (3,067
cells), the school field, the stadium turf - mow stripes alternating per row so
the lawn reads mown-then-died - plus courts, tracks, infields, putting and
bunkers keyed on their own names. Looked at live in the park.
THE HOLD: TF-ART-008 storefronts got its draw rule and pieces BUILT, but two
real-surface probes at downtown shop runs never caught the pieces on screen -
the 'storefront' cells likely draw through a different layer than the structure
branch. Unverified placement does not ship (his 8/11 bar), so the hook is
DISABLED with the reason in the code, the family stays counted as unwired, and
the next turn's first job is finding the real layer.
NINE OF FOURTEEN FAMILIES ARE IN THE GAME.

## 8/11 ELEVENTH PASS: TENTH FAMILY WIRED (STOREFRONTS), AND THE MYSTERY WAS THE PROBE

TF-ART-008 is live on downtown's 'storefront (green)' structure cells: dead
dark glazed bays with boarded/shutter/grille treatments per 2-cell segment, no
glow (power is territory). THE LESSON, recorded because it cost a held ship:
the "layer mystery" was never a layer problem - both failed probes stood at
AWNING clusters because the loose /storefront/i test matched 'storefront
awning' (overhead) cells too. The checker was the broken thing, again. The
structure hook now explicitly refuses overhead cells so an awning can never
pull a glass bay onto the canopy layer; awnings themselves are canopy-layer
volume with the signbands, pilasters, ends and the smashed pair.
TEN OF FOURTEEN FAMILIES ARE IN THE GAME. Remaining four: CMU courses,
freeway (own render path), pools (basin assembly), deck stairs (blocked on
the TF-CMB-004 slab cook).

## 8/12 TWELFTH PASS: ELEVENTH FAMILY WIRED (THE DRAINED POOLS)

TF-ART-006 draws on every named pool basin: the waterpark's wave pool (563
cells) and splash pool, the apartments' backyard pools. The WANG rim is named
by which sides face out of the basin (the roof-ring mask, third reuse), the
floor is silt with the odd drain, one ladder per pool on a north rim, and the
old blue tile waterline survives on the back walls. Looked at live at the
waterpark. Slopes, wet deep ends and the 5x5 clarifier are volume. The card
shipped QUANTIZED (1.6 MB vs 3.3) - the Pages cap is at 245 of 260 MB and
every new shot now compresses or replaces.
ELEVEN OF FOURTEEN FAMILIES ARE IN THE GAME. Remaining three: CMU courses,
freeway (own render path), deck stairs (blocked on TF-CMB-004).

## 8/14 THIRTEENTH PASS: TWELFTH FAMILY WIRED (THE CMU COURSES)

TF-ART-001 finishes the plain block buildings: the cap beam draws as the TOP
COURSE of every block-material wall mass (and the orange starter parapet dies
there - the cap IS the top), the vent block sits sparse at 1-in-18 mid-wall.
The machinery is honest about WHICH masses are block: the builder ships
bd/bdef boolean flags beside every civic wall pool and the page re-runs the
exact mass hash (civicIsBlockMass) - so a tilt-up warehouse next door keeps
its parapet and only buildings that actually drew block_grey/block_painted
get courses. Those live in the DEFAULT pool, so the family shows on the
unremarkable districts (solar, terminal, anything unlisted), which is exactly
what CMU is for. One build bug caught by the always-run grep: the piece grab
sat AFTER the page-injection replace and shipped zero pieces; moved above it,
verified 6 pieces in the page, then looked at the solar farm live. Card
quantized (1.6 MB). TWELVE OF FOURTEEN FAMILIES ARE IN THE GAME. Remaining
two are both blocked outside this lane: freeway (world cells are still
reserved-landmark ground, WORLD lane must realize the districts) and deck
stairs (TF-CMB-004 slab cook still OPEN on the board).

## 8/14 FOURTEENTH PASS: THE VOLUME LEDGER OPENS (GATES AND SKIRTS), AND THE
## TAB SHOTS GO ON A DIET

The families are done until other lanes move, so the ledger opened. TWO packs,
both pure REUSE - the 8/8 cooks had already made the pieces and his 8/11 UP
approved the whole banks, so nothing new was cooked:
- TF-ART-004 GATES: gate_shut / gate_sag / gate_open are 88px TWO-CELL pairs
  riding the horizontal run; both halves must be plain run (no hub, no
  vertical) so half a gate can never hang off a corner post; about one pair in
  thirteen, style fixed per pair. Looked at live at the battery yard: hinge
  post, sagging leaf, latch post, world through the mesh.
- TF-ART-013 SKIRTS: the panel band overlays the LOWER 26px of every
  trailer-district mass bottom row, so the body siding still reads above it;
  vent 1-in-11, missing panel 1-in-17 with the dark under-trailer void behind.
  Looked at live in the park.
AND the pages diet: the nine raw ART tab cards quantized in place, 34 MB down
to 17. The published surface drops from ~248 MB to ~231 of the 260 cap -
headroom for the next dozen cards. Both refreshed cards (gate in the run,
skirt at the base) ship quantized like everything now does.
Ledger next: rail turnouts, wheel stops (needs world stall-bay data), roll-up
doors, fence slat/topper runs, mh awnings + hitches + the burned row, sf
signbands, pool slopes, turf court lines.

## 8/15 FIFTEENTH PASS: THE FENCE WARDROBE AND THE BURNED ROW (VOLUME, ALL REUSE)

Four more ledger items, still zero new cooks - the approved 8/8 banks held
every piece:
- TF-ART-004 fence wardrobe: the eight security districts (storage, battery,
  substation, arsenal, fort, airbase, radio, reclaim) run BARBED and RAZOR
  wire lines, the trailer park and swap meet run privacy SLATS, and everywhere
  the desert blows TRASH into the mesh (1-in-19) with the odd section LEANING
  (1-in-23). One line still wears one style. Looked at live: the razor coil
  running the substation line.
- TF-ART-013 burned row + hitches: the burn joins the trailer pool as a
  MATERIAL of its own, so about one mass in six is a whole charred hull -
  whole-home, one material per mass, never a per-cell patchwork - and every
  home keeps its tow hitch at the west tongue end, drawn in front of the
  skirt. Looked at live: a turquoise home beside two burned hulls, skirts and
  hitches on all of them. Card updated.
Ledger remaining: mh awnings (placement needs care - canopy layer over the
yard cell), roll-up doors, rail turnouts, sf signbands, pool slopes, turf
court lines. Wheel stops still need world bay data. Freeway and deck stairs
still blocked outside the lane.

## 8/15 SIXTEENTH PASS: THE ROOFS GOT THEIR DEAD MECHANICAL AND THE POOLS GOT
## THEIR DEEP END (VOLUME, ALL REUSE AGAIN)

The 8/8 cooks were more complete than the wiring ever was - both banks held
finished, approved, UNWIRED pieces:
- TF-ART-012: the RTUs the 8/11 wiring note parked ("88x86, not a whole
  number of cells, stay unwired") are ON. The objection was never the art,
  it was placement, and the answer was the exterior-prop pattern: draw the
  multi-cell RGBA at the SAME uniform scale as every tile (no resample),
  anchored at the right-bottom cell of the footprint so the left-to-right
  cell loop never draws a field over them, one roll per 4-column block so
  units cannot collide. Small units, the large unit, roof hatches, drain
  sumps, pulled panels on roof interiors; scuppers drain the south parapets;
  sand drifts pile on galv north/east walls. Looked at live: a dead unit
  standing on a commercial gravel roof.
- TF-ART-006: poolDeepAt (all-pool 2-cell ring) marks the hopper, deep_0..2
  draws it darker, and slope pieces descend toward it from the shallow floor.
  Luminance is geometry, the cook's own words. Looked at live at the wave
  pool. deep_wet stays parked on weather state; the clarifier stays parked on
  world occupancy (a drawn basin the player walks over would lie).
Also FILED: mh awnings are BLOCKED ON WORLD like the freeway - a canopy the
player passes under needs world-named overhead cells (LAYERG drives the
pass-under fade) and map data is the WORLD lane's under MAP LAW. Both cards
reshot. Ledger remaining in-lane: turf court lines, rail turnouts, sf
signbands - all need real cooks now, the pure-reuse well is dry.

## 8/15 SEVENTEENTH PASS: THE PAINTED LINES (THE WELL WAS NOT DRY)

I declared the pure-reuse well dry one pass early. The TF-ART-005 bank holds
60 tiles and the wiring had only ever grabbed 20: court_line_<NESW> (the full
WANG-16), track_lane NS/EW + four corners, turf_line_<NESW> and the speedway
banking were all cooked 8/8, approved 8/11, and sitting there. THIS PASS:
- Court lines: the rim-mask pattern's FOURTH reuse - a court cell facing out
  wears the ghost ring on that side. Thirty-year wash, nearly gone, still
  legible: verified at a park court on the blue acrylic.
- Track lanes: straight pieces where the track continues N-S or E-W, corners
  where the ring bends, and a wide track pad honestly stays plain field
  (lane geometry on a blob would be a lie). Verified at the school track.
STILL PARKED IN THE BANK: turf_line_<NESW> (yard lines need a named FIELD
rect - the park's dead turf is one continuous lawn and lining all of it
would be wrong; needs world naming or a rect-finder with a ruling) and
banking_0..2/aprons (the speedway's cells need probing for a banking name).
FREEWAY RE-CHECKED after the WORLD lane's 8/15 ribbon ship: the walked
world's freeway cells are STILL reserved-landmark ground - their ribbon was
the vista view. TF-ART-011 stays blocked on WORLD.

## 8/15 NINETEENTH PASS: THE STOREFRONT FAMILY COMPLETES (SMASH + PILASTERS)

Second cook of the day (tools/tfcook/TF-ART-008_smash_pilaster_cook.py):
- THE SMASHED FRONT is cooked ON the family's own bay art - frame kept, pane
  knocked out to a black void with a ragged shard fringe and dull grit at the
  sill - so a looted bay matches the intact bay beside it pixel for pixel.
  GLASS segments only (boarded/shuttered/grilled are already sealed), BOTTOM
  row only (looters enter at street level), one shop column in thirteen.
- THE PILASTERS give the block its bay rhythm: painted-masonry piers at every
  2-cell segment boundary, full height, drawn over the signband so the fascia
  runs BETWEEN piers the way a real strip front does.
Verified live downtown - bands, piers and a looted bay in one street; card
reshot. TF-ART-008 IS COMPLETE: signbands, pilasters, ends and the smashed
pair, every volume item the form named, all in the game.
NEXT REAL COOK: rail buffers (yard track ends) and the level crossing where
the mainline meets a street. Blocked-on-world list unchanged.

## 8/16 TWENTIETH PASS: THE TRACKS END LIKE TRACKS

Third real cook (tools/tfcook/TF-ART-010_ends_cook.py). MEASURED FIRST: the
walked world's rail is the yard only - 2,727 track cells, all east-west, 517
ends per side, ZERO road adjacency. So: no level crossing exists to dress
and no through mainline exists to turnout - both PARKED on world geometry,
recorded on the form. What could ship honestly: about one end in four keeps
its rusted steel BUFFER STOP (banded beam, raked posts, cast shadow) and the
rest sink under a blown-sand TAPER with one rail tip still showing. The
pieces are RGBA overlays cooked to sit OVER the corridor art, so the rails
visibly ARRIVE at the stop - the first opaque version wiped them and was
recooked before it ever shipped. First version of the cook also failed the
look (stick-figure beam, clean wedge drift) and was iterated ONCE before
wiring: render-and-look applies to my own cooks the same as to the world.
Verified live at a buffered end against the yard shed; card reshot.

## 8/16 TWENTY-FIRST PASS: THE DECK SLAB COOKS, AND THE STAIRS UNBLOCK

The oldest HIGH-priority row on the board (TF-CMB-004, OPEN since 7/28,
blocking the 8/11-approved stairs) is cooked: 14 pieces - three top plates
plus the wet colorway, the WANG edge/corner ring with the sun-lit lip, the
edge-beam face authored to the demo's own DECK_H ratio with hard formwork
verticals + efflorescence + rebar rust, and the near-black soffit (the dark
where nobody patrols). THREE RENDER-AND-LOOK ITERATIONS before banking: the
starter concrete tiles are heavily CRACKED ground - right colour, wrong
condition for a structural plate - so the plate is synthesized from their
colour statistics with only hairline cracks kept; then the crack pattern
repeated across edge tiles sharing a seed and was re-seeded per tile. Ghost
stall paint is sampled from the approved TF-ART-003 stripe - the free win
the 7/28 form predicted if the stripes ever went UP, and they did.
WIRING IS THE COMBAT LANE'S (the fight field renderer is their system). The
handoff flags them: both deck banks ready to wire together. NOT IN A TAB
YET - the deck reaches Paolo when COMBAT wires it into their surface.

## 8/16 TWENTY-SECOND PASS: THE KERB KIT COOKS, AND THE PLACEMENT TRUTH

TF-ART-018 (board row 15, the lane's own queue): cooked on the harmonized
street pool per the 7/31 law, cap and face authored to the frozen starter
kerb's own measured numbers (176 cap band / 59 face) so transitions and
straight runs read as one object. AT THE BAR: the four corner RETURNS (the
cap arcs the corner over the road wedge) and the four crossing RAMPS
(bleached warning pad, dropped throat). HELD: the four M2 drops - first
render over-ringed the cell, one more design pass owed. PARKED: M4 inlets
(no world cell names a drain; inventing drainage is a placement lie).
THE PLACEMENT TRUTH, measured twice on the live surface: plain 'sidewalk'
cells exist ONLY in the suburb family (a 16x16-cell non-suburb sweep found
ZERO), and the suburb ground stack is the dressed reference district. The
wire-in hook found no legal site, so IT WAS PULLED rather than shipped
inert - a hook that never fires is a claimed feature that does not exist.
Next pass: wire the returns into the suburb path deliberately, verified at
a real corner, or hand the placement call to the coordinator if the suburb
stack proves owned.

## 8/16 TWENTY-THIRD PASS: THE KERB TURNS ITS CORNERS (THIRTEENTH WIRED FAMILY)

Second pass on TF-ART-018, done deliberately where the first pass measured:
the returns wire into the SUBURB ground path (before the bought pool), fire
at every sidewalk cell with two adjacent orthogonal roads, and were looked
at live at a real intersection - the cap arcs its quarter turn over the
road wedge and mates with the straight bought runs beside it. The M5 ramp
branch was tested the same way and REMOVED: no named sidewalk cell ever
borders a named crosswalk cell, and a branch that never fires is a claimed
feature that does not exist. Ramps and drops stay banked (drops still owe a
design pass). THIRTEEN FAMILIES ARE IN THE GAME and the kerb card is in the
ART tab.

## 8/17 TWENTY-FOURTH PASS: THE DRIVEWAY DROPS, AND WHERE THE REAL GATES LIVE

M2 redesigned and wired: the drop is an RGBA overlay lip now (the opaque
first version over-ringed the cell) - low cap across the driveway mouth,
flaring to full kerb at each end - and it fires on the real curb-cut
definition: any driveway cell with exactly one road neighbour. Thousands of
suburb driveways meet the street properly now. Verified live at a mouth.
TWO MEASUREMENT LESSONS: (1) the 80 world-named 'gate / curb cut' cells all
sit ON cell borders (x or y = 0, the fence line) - my border-excluding scan
missed every one of them for a full pass; scan from 0 when the object lives
on the seam. (2) Those cells are REAL entrances - a future pass should move
the hash-placed fence gates onto them instead of rolling dice. Recorded on
the form. Ramps stay banked (no crossing landing is named). The kerb card
is reshot at a driveway mouth.

## 8/17 TWENTY-FIFTH PASS: GATES AT THE REAL ENTRANCES

The 8/16 finding pays off: the world-named 'gate / curb cut' cells (all on
cell borders, the fence lines' own entrances) now draw their driveway
ground and a single-leaf OPEN gate from the approved art. RUN-AWARE from
the second render on: a multi-cell entrance hangs its leaves at the END
posts only - the first render put a full gate on every cell of the run and
read as a picket line of gates, caught on the live surface and fixed the
same pass. The hash-rolled mid-run gates from 8/14 stay (they read as yard
gates); the REAL entrances now read as what they are: places a car drives
in. Freeway re-probed after four more WORLD ships: STILL reserved ground.

## 8/17 TWENTY-SIXTH PASS: THE AWNINGS WERE NEVER BLOCKED

The volume ledger had "awnings" filed as blocked-on-world since 8/15 - and
that was HALF right: the TRAILER awnings need world cells that do not
exist. But downtown's storefront awnings were sitting on 154+ world-named
'storefront awning' cells per block, ALL on the overhead layer, with the
pass-under fade machinery live since forever, waiting for pixels. The
approved two-cell tattered drops now hang on every SOUTH-FACING front (one
colourway per shop run, matching the facade branch), sidewalk drawn under,
and you walk beneath them. MEASURED on the first render and gated: the art
is authored for south-facing fronts; on a vertical run it stamps sideways
into a dark ribbon, so side-facing runs keep their plain canopy and
SIDE-FACING DROPS are the named volume remainder. The lesson worth the
pass: re-read your own blocked list against the world every few days - one
of its entries was a door that was never locked.

## 8/18 TWENTY-SEVENTH PASS: EVERY AWNING HANGS (THE SIDE RIBBONS)

The 8/17 remainder closed same-week: side-facing awning ribbons cooked
(tools/tfcook/TF-ART-008_sideawning_cook.py) with fabric colours SAMPLED
from the family's own approved drops, so a shop that turns a corner keeps
its awning colour around it. The ribbon is a continuous N-S canopy: sag
scallop per 11px arm bay (44 divides clean, so runs tile seamlessly), lit
crest on the street-side curve, support-arm pixels at the facade, torn
gaps that show the sidewalk through. Wired for east AND west facades;
verified live on the vertical run that read as a dark ribbon two passes
ago. Every named awning cell in downtown now draws, all four facings.

## 8/18 TWENTY-EIGHTH PASS: THE COMPOSITION AUDIT (six districts, one fix)

Nobody had looked at the thirteen families TOGETHER since each shipped
alone, so this pass walked six districts on the live build and looked hard
at every frame for stacking sins: downtown (bands + piers + smash + awnings
+ glass in one street: composed), trailer park (skirts + hitches + burned
hulls + slat fence + crossings: composed), railyard (tracks + ends +
corrugate + props: composed), solar, suburb (returns + drops + crossings:
composed). THE ONE REAL FINDING: the waterpark's field-sized lawn read as
WALLPAPER - the turf colour variant was constant per row (only the a/b mow
banding alternated), invisible on park-sized lawns and glaring at field
scale. FIXED: the variant now shuffles per 4-cell block along the row, mow
banding untouched, verified before/after on the same lawn. The full cure is
MORE turf variants (the bank holds 3 per stripe) - filed as cook volume.
The audit habit is now part of the ledger: compose-and-look every few
passes, not only piece-and-look every pass.

## 8/19 TWENTY-NINTH PASS: THE SIGNS STAND UP (TF-WORLD-010, the HIGH row)

The board's oldest HIGH row (7/28) shipped: EVERY DISTRICT GETS ITS TALL
THING. Measured first - the districts have been naming their own sign
cells all along (commercial 'pylon sign / pole', swapmeet 'market pylon
sign', school + drivein 'marquee sign', drivein 'screen tower' at 92x25
cells, stadium 'scoreboard / jumbotron', downtown 'blade sign' on the
overhead layer, policestation 'roof antenna / dish') and every single one
rendered as a flat generic brick mass. Now they draw as dead Vegas signs:
bleached blown-out pylon cabinets on steel legs, crazed marquee letter
boards carrying the SHADOWS of gone letters (rects, never glyphs - the
words are Paolo's), the giant torn drive-in screen with lattice through
the holes, the dead bulb-matrix scoreboard, blade signs jutting over the
sidewalk, the roof dish still pointed at something. 37 pieces
(tools/tfcook/TF-WORLD-010_cook.py), faces harvested from the approved
signband plastics + kerb concrete, steel from galv parapet + rail plate.

THE LESSON THIS PASS PAID FOR: harvest by LUMINANCE ROLE, not by
dominance. The signband cans are the right LANGUAGE for a dead sign but
their dominant pools are dark fascia browns - the first render's "bleached
faces" were brown boxes. The bleached pale had to come from the street
concrete (lifted 1.15 for sun-bleach); the cans kept their real job,
tinting the ghost bands DARK per the family's own 8/15 rule. And the
second render lesson: never bake a repeating element (the pole) into an
edge-band piece - a 7-wide cabinet stood on a colonnade of seven legs
until the pole became its own overlay placed at the real leg columns.

Sweep-verified the hook claims EXACTLY the seven measured surfaces and
nothing else. Truckstop's price pylon wires itself when one generates;
terminal's 'schedule board / clock' from the form DOES NOT EXIST in the
world (measured) - flagged, nothing to wire until WORLD names it.

## 8/19 THIRTIETH PASS: THE PANELS GET THEIR JOINTS (TF-RUN-005)

The other 7/28 HIGH row closed the same day as the signs. The tilt-up
field has been live on the civic and industrial masses since 8/3, but it
read as a repeating texture - and the form's own spec said the whole
asset is the JOINT RHYTHM: "big blank fields punctuated by joints, NOT a
repeating texture." Eleven overlay pieces now ride the approved field: a
caulked joint every 4-6 columns (rhythm rolled per building, phase locked
to the flood-filled mass anchor), the poured cap as its own top course
(the orange starter parapet now dies on tilt-up masses too, the way the
CMU cap killed it on block masses), the plinth with efflorescence bloom
at grade, sparse rain weeps (dry aging - dust, UV, streak, never green),
and the rare boarded punched window in weathered sf_boarded ply. Every
grey harvested from the field tiles themselves.

THE BUG THE FIRST RENDER CAUGHT: the payload shipped the new td/tdef
tilt-up flags and the page found ZERO tilt-up masses - because the
slice's CIVIC_SKIN decoder copies KNOWN KEYS ONLY, and a payload field
does not exist until the decoder learns it. One line. The lesson joins
the grab-before-replace law: the pipe has TWO ends, and adding a field to
the sender is half a wiring.

Verified live: warehouse (joints, boards, plinth bloom), jail (cap
course), medical. Painted-tan colorway and rain-wet darkening stay
future volume (colorways and weather, not new forms).

## 8/19 THIRTY-FIRST PASS: THE BUILDINGS GET THEIR THICKNESS (TF-ART-017, first slice)

The lane's own HIGH form: every building was a cardboard flat - ends that
never turned, windows that were pictures. The insight that made it
shippable in one pass is the form's own light law taken literally: "the
corner is a VALUE STEP between two planes and nothing else." So the six
pieces are pure luminance overlays (RGBA light/shade, no colour of their
own) that ride WHATEVER material sits underneath - all fifteen approved
house skins and every civic material get thickness from ONE set, no
30-colourway explosion, STRUCTURE-NOT-COLOR at its purest.

Wired: the suburb end cells and every civic mass edge wear the outside
corners (12px return at the measured Clark County wall thickness, the
bead's dead-straight rust hairline on the arris); the suburb windows and
boarded openings wear their reveals (opening rects MEASURED off the
approved starter tiles; shaded jamb / lit jamb / darkest soffit / lit
sill / sill-corner weeps only).

Verified by reshooting the IDENTICAL jail site before and after: the
pixel diff is column-localised exactly at the mass edge bands. Scope
resolutions recorded in the form: parapet corner struck (TF-ART-012
shipped it 8/11 - the overlap resolved by the record, not by a question);
rake corner held with TF-CITY-001; concave corners cooked and BANKED (no
live concave site measured - inert-hook rule); the doors stay untouched
(Paolo's animated clip-bank art in a later pass owns that surface).

## 8/19 THIRTY-SECOND PASS: THE POWER DISTRICTS READ AS POWER (TF-ART-016 + the ordered merge)

Fourth family of the day. The form's own section B ordered a MERGE with
TF-RUN-007 before any cook, and the merge is now on the record: 016
survives with 007's frozen-tracker hook; 007's spiderweb-fracture clause
corrected (laminated tempered glass crumbs milky and stays put); 007's
see-over-the-rows clause loses to the dossier's locked layering ruling.

MEASURED FIRST: solar's tables are 27/36 cells x exactly 4 deep, pads in
3x4 blobs, and the battery yard has NO panel cells - so the canon
two-state split (solar eerily maintained / battery dead) lands with no
invented placement at all: maintained panels + pads at solar, dead racks
at battery, dead-glass sub-states BANKED until a stripped block exists.

The wiring reads the world's own geometry: a panel cell's ROW in its
table is the count of panel cells above it - back rail, glass, glass,
front-lip-over-under-slot - with the module frame on the phase column and
table ends wearing the torque-tube stub. One render iteration: the first
busbars were dotted columns and read as stipple (the banned thing);
they are two faint continuous lines now.

The gravel-lane member folded into the approved yard gravel exactly as
the form predicted. Glass value from the approved wall_window, steel from
the galv parapet, rust from the rail plate. Verified standing in the
ranks and among the racks. Seventeenth wired family.

## 8/19 THIRTY-THIRD PASS: THE CIVIC REMAINDERS, AND THE TENNIS-COURT COURTHOUSE

Fifth family of the day, and the lane's own queue is now EMPTY. TF-ART-007
asked for 1920s cut stone; the walked world built MODERN civic - the
courthouse names 748 'precast panel joint' cells (Clark County builds
precast) and the terminal is curtain wall. The measurement corrected the
form: the material half was answered 8/3; what shipped is what the world
names - courthouse joints (REUSING the shipped TF-RUN-005 tu_joint,
borrowed-material so a 1-wide joint line never rolls its own), chapel
arcade columns + stained glass, dead glazing on dome / clerestory /
oculus / curtain wall.

AND THE CONFESSION, on the record where it belongs: the courthouse was
BLUE because MY 8/15 court-lines pass matched the substring 'court'.
Courthouse, memorial court, truck court, courtyard, food court, three
forecourts - nearly 8,000 cells across five-plus districts wearing
basketball acrylic for four days, and the 8/18 composition audit missed
it because it only walked the sport districts. courtAt() is a positive
sport-name predicate now. THE DEBUG LESSON: three renders were spent
asking "why are my joints red" - the white-probe build (paint the branch
solid white in a throwaway page, one screenshot) answered in one shot
what pixel-forensics could not. When a fix changes nothing twice, the
thing you are staring at is not the thing that is wrong. And the audit
lesson: a substring predicate is a claim about EVERY name in the world,
so it must be swept against every name in the world the day it ships.

## 8/20 THIRTY-FOURTH PASS: THE PREDICATE AUDIT (the tennis-court bug's whole class)

Yesterday's courthouse bug was a CLASS, not an incident, so this pass
swept it: every NAMEG substring predicate in every wired family (26
predicates across rail, roof, storefront, awning, gate, sign, solar,
civic, turf, pool, fence) cross-checked against the full inventory of
the walked world's names (414 distinct names, all districts).

RESULT: one true finding, one false positive, the rest clean.
- TRUE: the terminal's 'rooftop solar array' matched the roof family's
  'rooftop' duct branch and drew random ducts on a LEED solar roof.
  Fixed: it draws the solar family's own glass laid flat now, claimed
  before the duct branch. Verified live on the terminal roof.
- FALSE POSITIVE, documented so nobody re-chases it: commercial's
  'storefront walk' (a ground sidewalk) matches the storefront glass
  predicate, but the pipeline's ORDER is the guard - the bought-ground
  pass claims and continues before the structure hooks can reach it. A
  predicate audit must read the chain, not just the regex.
- The fence 'wall' exclusion, the gate two-token test, and every
  single-site name (screen tower, scoreboard, blade sign, precast joint,
  arcade columns, oculus...) matched exactly their intended cells.

ALSO RE-PROBED (the standing cadence): strip / casino / freeway /
speedway / resort / minigp / ballpark are ALL still 16,384 cells of
"(reserved landmark ground)" - WORLD's 99.9%-built ship was the overmap,
not these interiors. The blocked-outside list stands unchanged.

## 8/20 THIRTY-FOURTH PASS: THE INNER CORNERS LAND, AND THE PARKED LIST RE-PROBED

The re-probe cadence paid immediately: the 8/19 "no live concave site"
measurement went stale within a DAY. The valley finished building and the
8/20 sweep found reentrant corner sites in THIRTY-FIVE districts (gypsum
255, radio 189, stadium 172, medical + pumpstation 154, boneyard 150,
granary 121, arsenal 115...). The banked cor_in pieces wired: a mass edge
whose open side is a POCKET (mass wrapping past the opening above or
below) is a wind eddy, not an open-air arris - it wears the deepened
shade wedge with silt at its foot instead of the lit outside-corner
return. Verified at the storage unit rows. TF-ART-017's "the inner
corner is the trap" piece is done.

THE REST OF THE PARKED LIST, re-probed same sweep, all still parked:
every reserved landmark ground still one name deep (strip, casino,
freeway, speedway, resort, minigp, ballpark, interchange, strat,
highroller, luxor, sphere - WORLD's), trailer awnings still unnamed
(WORLD's), no crossing cells, no clarifier. ONE new name surfaced:
reclaim 'inlet header' x171 - noted for a future volume pass, no banked
piece covers it. THE CADENCE LESSON, now proven twice in two days: a
"no sites" measurement is a snapshot, not a fact.

## 8/20 THIRTY-FIFTH PASS: SECOND COMPOSITION AUDIT + THE RECLAIM HEADERS

The first audit (pass 28) walked thirteen families; six more landed since
and nobody had looked at them TOGETHER. This pass walked eight districts
where the new work stacks: drive-in (signs + screen + lot), commercial
(pylon + lamps + stalls), solar (ranks + fence + gravel), battery (racks
+ containers), courthouse (joints + coping + plaza), chapel (columns +
stained glass + court ground), stadium (scoreboard + yard lines + turf),
storage (inner corners + gates). VERDICT: COMPOSED - no regression found.
Two taste notes filed, not fixed (SPIRIT calls, not bugs): the drive-in
screen's per-tile panel grid reads faintly graph-papery at distance, and
the commercial pylon's blown-panel density sits at the busy end. Both
stay as-is unless Paolo reacts.

And the 8/20 re-probe's one new name shipped same pass: the reclaim
plant's INLET HEADERS (x171) draw as dead galvanised distribution
manifolds - ellipse-section barrels with lit crests, bolted flanges with
their rust streaks, riser stubs to grade. Verified live: three long
header runs crossing the reclaim yard, unmistakably a water plant now.

## 8/20 THIRTY-SIXTH PASS: THE SERVICE LANES REMEMBER THE TRUCKS

TF-ART-016's fifth member, the one the form itself folded into the
approved gravel, shipped as the dressing it promised to be: every plant
service lane (solar 'gravel access road' x8989, battery / substation /
reclaim 'access road') draws its two compacted WHEEL TRACKS and the pale
crown between them, riding the bought yard gravel - rut and crown values
derived from that gravel itself so the dressing can never step off its
ground. Axis read from the lane's own continuation, both at junctions.
Verified at the solar aisles: the dead cars sit on the ruts. Compacted
caliche does not heal; the trucks are thirty years gone and the lane
still remembers them. Daily re-probe first, same turn: all landmark
grounds STILL reserved (the Strip work was signals, not ground naming).

ADDENDUM TO PASS 36, same turn: THE CAP BLEW AND THE DIET RAN. Mid-ship
the publish gate went red - 271 MB against the 260 cap (the surface grew
27 MB in a day under the fleet's pace). The proven diet ran: thirty raw
screenshot/proof PNGs across the published surface quantized to 256
colours (27 MB freed, 245/260 with headroom). THREE FILES WERE QUANTIZED
AND THEN RESTORED BYTE-EXACT ON REVIEW: the TARGET front-face reference,
the graveyarded TARGET B, and PAL_FROZEN - a measurement reference or a
frozen palette record is not a screenshot, and dieting one would bend the
ruler the gates measure with. texture_match re-run green after restore.

## 8/21 THIRTY-SEVENTH PASS: THE GRID HAS ITS MACHINES (TF-ART-019)

The post-board gap sweep's two biggest unclaimed surfaces measured and
shipped as one kit. Geometry first: the substation lays 'transformer'
x1547 in 19x20 BAYS (real firewall spacing - one transformer each), the
switchgear as a thin lattice grid, the busbars OVERHEAD and non-solid
(the world already ruled you walk under them); the battery yard lays
'battery container' x3360 in 14x16 BANKS, and 14 cells is 10.5 m - a
40-foot container EXACTLY - so a bank is five containers side by side
and the art SUBDIVIDES what the world merged (lid, lid, seam rows).

Twelve pieces: the 6x8-cell transformer body (tank, fin banks, three
porcelain bushing stacks, conservator, clean pad shadow - MAINTAINED,
the network's eerily perfect half), lattice posts, sagging overhead
conductors with disc insulators, pedestal insulators, container lids
with lit rims, seam slots, locking-bar door ends, and the dead HVAC
pack with its stopped fan.

THE ANCHOR LESSON, paid on the first render: a multi-cell prop drawn
once from an anchor cell DIES when that anchor scrolls off-screen, and
on a 19x20 bay the anchor usually IS off-screen. The fix is the MOSAIC:
every bay cell blits its own 44px slice of the body image, positioned
off the bay's own bbox - partial visibility and draw order can never
lose it. That pattern supersedes right-bottom anchoring for any prop
bigger than the screen's margin.

Verified live standing at a bay (the transformer whole in frame) and in
the container rows. Nineteenth wired family.

## 8/21 THIRTY-SEVENTH PASS: THE LAWNS WERE GRAVEL (24,000 cells found by ranking)

New instrument for the empty-queue days: rank the full world name
inventory by count, minus every name a wired family or the ground vocab
claims - whatever tops the list is the biggest lie still standing. The
first run found 24,000 cells of LAWN drawing as gravel yard: 'memorial
lawn' x9993 (the whole cemetery), 'dead rough' x9751 (the golf course),
'dead lawn' x4590 (fire station) + 'dead lawn (campus ground)' x4209 -
none matched any ground rule, all fell to the final yard fallback.

The fix cost ZERO new pixels: the approved TF-ART-005 turf. The mown
lawns (cemetery, station, campus) wear the row-locked mow banding; the
golf ROUGH uses the same pieces with the a/b pair and variant shuffled
PER CELL, which kills the mow read - placement, not a recook, makes
patchy unmown rough out of striped lawn pieces. Verified live: the
cemetery reads as a dead memorial lawn with the graves sitting in it,
the rough reads wild against the fairway. Exact-name predicates only.
Daily re-probe first, same turn: all twelve landmark grounds still
reserved, trailer awnings still unnamed, no crossings.

## 8/21 THIRTY-EIGHTH PASS: THE SUN DECK AND THE STOCKPILES (the ranking pays again)

Two more from the inventory ranking. The waterpark's SUN DECK (x8364, the
single biggest name at the park) matched no ground rule and drew gravel -
a pool deck is poured concrete, so it wears his bought walk pool now,
zero new pixels, verified numerically on the live frame (deck mean RGB
137/125/109 = the concrete family, against gravel's 179/148/102). And the
gypsum plant's STOCKPILES (x3015) cooked as the palest thing in the
valley - near-white mineral mounds, lit crests and shaded feet, conveyor
ridge lines, the white derived from the approved pale concrete lifted,
never invented. Verified live: the piles cluster by the quarry exactly
like a working plant's product yard that nobody ever hauled away.

ADDENDUM TO PASS 38, same hour: I SHIPPED LIVE CONFLICT MARKERS TO MAIN
AND CAUGHT IT MYSELF WITHIN MINUTES. The rebase left an unresolved block
at the top of the handoff, and my ship pipeline checked the nomarkers
gate THROUGH GREP - which happily matched the line saying "4 fail" and
returned success, so the push went through red. Both sides restored,
markers gone, hotfixed to main inside the same hour (e64b4dc). THE LAW
THIS RE-PROVES is already written on this very file from the last two
times another lane did it: the gate's EXIT CODE is the gate; a pipe that
greps a gate's text can bless a failure. My ship flow now asserts exit
codes. Filed here because the record is for MY failures too.

## 8/21 THIRTY-NINTH PASS: THE BOWL GETS ITS SEATS

The stadium's single biggest surface - 2,499 cells of 'seating / stands
(the bowl)' - and the school's 303 metal bleachers were falling to the
generic wall mass. They draw as RAKED ROWS now: bench top over its own
shadow over the tread, rows running parallel to the field edge (axis
from the blob's own continuation), a pale aisle stair strip every
seventh column, the odd missing plank showing the dark understructure.
Metal benches at the school per its own legend; neutral warm grey at the
bowl per the stadium dossier (never purple). The concourse loop under
the stands (x1315) pours its bought concrete instead of gravel. One
render iteration: the first aisle cells painted only their strip and
left their flanks BLACK - an overlay that replaces a cell must paint the
whole cell or ride on something that does. Verified live: the bowl wraps
the dead scoreboard in bench rows now, weeds in the concourse.

## 8/21 FORTIETH PASS: THE GRAVES, THE SPUR, AND THE ALLEYS

Three more off the ranking. The cemetery's 925 HEADSTONES - every one a
single prop cell drawing as a wall block in the new lawn - stand as
bleached stone slabs now (three shapes, lit tops, foot shadows, the odd
lean from settling ground; NO name, date or glyph on any face - the dead
are his to name). The granary's 2,059-cell RAIL SPUR drew gravel because
the rail family never knew the synonym - and the spur CURVES, so the
honest wire puts the track row only on locally-straight cells and the
ballast bed on the curve fragments, which is what a curve looks like
from above anyway. And the downtown and commercial ALLEYS (2,377 cells)
pour old asphalt instead of gravel. Verified live: the cemetery reads as
a cemetery at last - rows of stones in the dead lawn.

## 8/21 FORTY-FIRST PASS: THIRD COMPOSITION AUDIT (and the probe earns its keep again)

Walked the four newest stacks. Cemetery: COMPOSED (stones in rows on the
lawn). Stadium: COMPOSED (seats + aisles + scoreboard + yard lines).
Gypsum: COMPOSED (white piles by the quarry). Granary: the audit CAUGHT
what looked like my spur wire painting corduroy across the whole yard -
two fix iterations later the frame had not changed, and the courthouse
lesson kicked in: WHEN A FIX CHANGES NOTHING TWICE, THE THING YOU ARE
STARING AT IS NOT THE THING THAT IS WRONG. The white-probe build proved
the real spur cells are exactly the two long sidings (which my wire
dresses correctly - rails on the 6+ runs, ballast elsewhere), and the
tan dashed field I was chasing is a DIFFERENT pre-existing granary
surface, not mine and not broken enough to chase. The two iterations
stay: the minimum-run law (rails only on sidings 6+ cells) is more
honest than what shipped yesterday either way. Audit verdict: COMPOSED
across all four stacks; one self-misread, corrected by instrument.

## 8/22 FORTY-SECOND PASS: THE TRAILERS PARKED THIRTY YEARS AGO

Daily re-probe first: all twelve landmark grounds still sealed (WORLD's
own commit the same hour: "THE LAST 30: what is still sealed, measured
instead of assumed" - they are working the seal; the pounce stays armed).
Then the ranking's next: the industrial yard's 'parked trailer' x1792 -
measured as twenty-eight blobs, EVERY ONE exactly 4x16 cells, a real
40-foot box trailer at 3m x 12m, drawing as wall mass. One 176x704 RGBA
prop, anchored right-bottom per the multi-cell law: the sky-lit ribbed
aluminium roof carries the read, lit west edge, dark east, door seams
and latch bars at the rear, kingpin plate at the nose, ground shadow off
the east and south. Three wear variants (bleached / patched / rust-
bloomed), aluminium from the approved galv, rust from the approved rail
plate, no logo or fleet number ever. Verified live: a full trailer in
the truck court reads as exactly what it is.

## 8/24 FORTY-THIRD PASS: THE ARSENAL BERMS (measured three times, wrong twice)

Daily re-probe first: all twelve landmark grounds still sealed, trailer
awnings still unnamed. Then the ranking's next: the arsenal's
'earth-covered magazine' x1372 - twelve blobs, and the measurement said
"19x16 each", so I cooked a MOUND: crest / mid / flank earth bands, a
concrete headwall, a steel blast door. Two banding iterations later the
frame read as a flat tan road, and the white-probe earned its keep for
the fourth time: the 19x16 was the RING'S BOUNDING BOX. The name is not
a mound at all - it is the earth BERM RING wrapped around each bunker
block. So the wire became a pure berm and the headwall + door pieces
went to the bank unwired (mag_head_0/1, mag_door - a berm has no
headwall; they wait for a shape that does). Then the FOURTH look: the
recook still measured uniform ~170 across the whole arm, and arithmetic
closed it - 1372 cells / 12 blobs fits a ring TWO cells thick, not
four, so the centreline test made every cell crest. A 2-thick berm has
no room for crest+flank per side; it reads as a RIDGE - lit flank +
shaded flank, light from the NW like every cast shadow in the frame.
Verified live: the ring around each igloo block finally reads raised.
Lessons banked: a blob measurement quotes a BOUNDING BOX, not a shape
(count the cells before believing the rectangle), and when a band
scheme needs N cells of width, check the width fits before wiring it.

## 8/24 FORTY-FOURTH PASS: THE WATERWORKS HATCHES

Same GO, next name on the ranking: the reservoir's 'valve / hatch'
x1434, all falling to the gravel fallback - dirt pockmarks across the
pad ring and dirt trails through the setback. Measured first: dozens of
true 1x1 singles plus long SPARSE runs (4x51, 9x34, 8x32 bounding boxes
at 40-60% fill - service lines following the buried mains, not slabs),
neighboured by tank pad (1058), overflow (326) and transmission main
(127). Two pieces, both RGBA riding on bought concrete: the round
access lid (an ellipse per the 45 law, hinge bar, no bolt stipple, rust
weep on the old ones) for lone cells, and the two-leaf vault cover in a
pale collar for corridor cells, axis picked from the run's own
neighbours. Verified live at the reservoir: lids in the yard, vault
chains marching the easement. Twentieth wired family. Same turn, the
suite's confirm pass flagged my own TF-ART-019 record: the 8/21 grid
kit shipped a "short form" shortcut instead of the full contract, and
the tileform gate rightly killed it - repaired to the full C-I form
with a board row, 8287/0 by exit code. The reservoir's remaining names
(tank roof, overflow, transmission main) stay on the ranking.

## 8/24 FORTY-FIFTH PASS: THE LOADOUT ROW AND THE POST LINES (double ship)

Two names off the ranking in one GO. The granary's 'spout / dust bin'
x1514 (81 blobs hugging the dump apron 1001 and rail spur 511): a grain
elevator's whole reason to exist is the loadout row, and it drew dirt.
Wired as two pieces on bought concrete - the cyclone dust collector
(ellipse rim, cone to a dark throat) for the silo bases, the loadout
spout (boom, dark drop mouth, grain-dust bleach still on the deck) for
spur-adjacent cells. The arsenal's 'barricade post' x1607 (85 blobs,
sparse lines across the storage ground beside my berms and the
traverses): a depot controls movement without walls because blast
safety wants open ground, so post-and-cable it is - short
concrete-filled posts, half rusted through, one continuous sagging
cable pinned at the same height at every cell edge so spans join
seamlessly (the busbar lesson: lines, never dots). Both verified live
in zoom: cable spans visible between posts, cyclones reading as steel.
Hawthorne NV is the depot reference. Twenty-two wired families. Both
forms filed FULL (the TF-ART-019 lesson: no short forms, ever), board
rows 94/95, tileform gate 0 by exit code.

## 8/25 FORTY-SIXTH PASS: FOURTH COMPOSITION AUDIT + THE WASH'S ARMOR

Daily re-probe first: all twelve landmark grounds still at exactly one
name (sealed), trailer awnings still unnamed. FOURTH COMPOSITION AUDIT
(five family ships since the third): walked a DIFFERENT arsenal corner -
the berm ring's two-tone varies correctly by arm orientation (no
wallpaper, mottle and scrub shuffle), the post lines, fence wardrobe and
lanes read together; granary and reservoir full frames from the 8/24
ships re-judged - COMPOSED across all four stacks, no predicate leaks
(all four new predicates are exact-name). Then the ranking's next: the
wash's 'riprap' x936 - two 115x3 ARMOR STRIPS flanking the channel plus
scattered patches, all drawing bare dirt. Full-cell packed-stone ground
tile: every stone a lit north facet over a shadowed south facet with
baked dirt gaps (facets from the approved kerb pale, a third warmed to
caliche tan; no outlines, no stipple - the 74%-orphan lesson), three
hashed variants against wallpaper on the long strips. Verified live at
the wash: the strip runs the channel edge and reads as rock. The
tileform gate caught a line-wrapped path in the form's shopping check
(a filename split across lines is a filename that does not exist to the
checker) - unwrapped, 8774/0 by exit code. Twenty-three wired families.

## 8/25 FORTY-SEVENTH PASS: THE FULL ICON BOARD VERDICT (5 YES, 20 CBB, 44 NO)

He judged all 69 district map icons in one sitting and named the disease
in one breath: "not everything needs to be represented with buildings...
you keep wanting to add windows to the streets... even the mountain and
desert you tried to make tall buildings." VERIFIED ON THE PIXELS before
acting: the park's trees were boxes on stilts beside a windowed restroom,
the mountain was a wedding cake, the desert grew an 8.6-unit tower, the
freeway's 5-unit walls wore the wall-dressing pass's window-like joints,
and the school's 8.2-unit yellow light towers were "the yellow lines
that go much farther than they needed". ONE PIPELINE DEFECT JUDGED 44
TIMES: the factory's building passes ran on every hero. Fixed at the
pipeline (NOT_A_BUILDING skips all building passes), rebuilt park /
mountain / desert / freeway / school, rebaked all 69 (73 minutes of
CPU), verified the six on the baked pixels, re-wired the city page
(proved by the sha1 recipe after my own md5 probe false-alarmed - fix
the ruler), big_icons gate amended to his newest word (park exempt,
exempt floor 2.0), 44 graveyard entries with one shared post-mortem.
Second rejections (strip, strip_x, minigp, dam) are DEAD FOR THE
SESSION. casino/resort move NO -> CBB by newest-date-wins. STILL OWED:
2x2 planting for stadium/speedway/casino-class venues (recorded ruling,
needs city-app blob planting), and ranked fresh-cook waves for the
other killed slots under the five rulings.

## 8/25 FORTY-EIGHTH PASS: THE VENUES TAKE THEIR FOUR LOTS (2x2, both halves)

The owed half of the icon verdict ("some buildings by their size will
naturally be 2x2... the stadium or moto speedway. probably even the
casinos"). MEASURED FIRST: the overmap already builds the stadium as a
2x2 blob and the speedway as 4x3 - the old city render stamped the SAME
hero on every cell, four little stadiums inside one stadium. Casinos
are five 1x1 cells, so they stay 1x1 on the generated map. TWO HALVES
SHIPPED, both in-place edits on the live city app (the region carries
other lanes' work - never regenerate, update):
(1) RENDER: a venue district draws its hero ONCE per blob, flood-walked,
anchored at the blob's FRONT cell (max y then x - painted last, the
multi-cell prop law from the run slice), scaled to span (w+h)/2 cells,
centred on the blob; the blob's other cells paint the venue's own pad.
Proven on the live page: 12 speedway cells -> 11 skip + 1 anchor
{w:4,h:3,cx:14.5,cy:7}, one oval on screen.
(2) PLANTING: the builder's plain BUILD button routes stadium/speedway/
casino through the EXISTING buildBig 2x2 verb (Paolo 7/18 built it; his
8/25 word makes it the venue default) - a planted venue always claims
four lots. Proven live: picked stadium on empty desert, tapped BUILD,
span {2x2, stadium} written, all four lots stadium, ONE hero spanning
them in the render. Hero wire + walked surface + all 16 city gates
green by exit code.

## 8/25 FORTY-NINTH PASS: THE BEDS SOMEBODY ONCE RAKED (parallel to the icon bake)

While the icon wave-2 rebake ground its 75 minutes, the tile ranking's
next: the police station's 'landscaping' x1131 - ONE connected web of
bed strips (118x116 bounding box) ringing the station, lot and secure
yard, all falling to the gravel fallback. The read that matters:
xeriscape MULCH STAYS RAKED for thirty years (rock does not die) while
every plant in it dies to straw - so the bed reads MANICURED against
the wild desert, which is the whole story of a civic building nobody
comes back to. Granite mulch warmed from the approved dirt (three
hashed variants, one-pixel value grain, never dots), a dead agave
rosette radiating on the 45 ellipse about every seventh cell, a
feature boulder every nineteenth. Verified live at the station: the
warm even band reads apart from the desert at a glance. Twenty-fourth
wired family, full form, board row 92, tileform + reusefirst 0 by exit
code. Targeted git adds only this ship - the hero bank was mid-bake in
the background and a git add -A would have staged a half-written file.

## 8/25 FIFTIETH PASS: THE RESERVOIR IS FINISHED (deck + overflow, volume)

Second parallel ship while the icon rebake ground on: 'tank roof' x3295
(the buried reservoir's concrete deck, blobs to 26x106) and 'overflow'
x1028 (splash structures on the pad), volume under TF-ART-020 exactly
as its form promised. The deck is a jointed panel per cell with
self-seamless N+W joints, patches and cracks thinned to one-in-seven
after the first wire's one-in-three read as polka squares (caught on
the live surface before shipping), mushroom vents sparse. The overflow
basin carries the dry stain fan of the last time water ever left. With
this the reservoir's whole named vocabulary is wired except the buried
transmission main, whose vault rows already mark it. Sitting pass 50.

## 8/26 FIFTY-FIRST PASS: ICON WAVE 2 (five more kills answered)

The second ranked wave against the 8/25 board: cemetery (temple ->
modest vault, the stones carry it), water (tank-tall shore rocks ->
knee-high knobs on a horizontal), landfill (concentric ziggurat ->
benches sliding toward the working face, flare cut from 12.6 to
working height), basin (the 4.9-unit riser slab -> twice the crest),
radio (drums from double the truss face to half over it - refinery
becomes antenna farm). Verified on the baked pixels, all 69 rewired
into the city page, gates 0 by exit code. The big_icons gate's
low-by-nature list finally gained WATER - its builder docstring had
claimed "named" since 8/4 while the list never carried it, and the
tank-tall rocks were exactly what hid the gap. This bake took 160
minutes of CPU (the first took 73); the poller that watches it now
watches the PROCESS, not a fixed clock, after one false wake.

## 8/26 FIFTY-SECOND PASS: THE GALLERY GETS ITS ROOF (and the sheds do not, yet)

Daily re-probe first: twelve landmark grounds still sealed, awnings
still unnamed. Then the granary's gallery: the 101x3 conveyor bridge
now wears gable galv (ridge cap, lit/shaded slopes, continuous ribs)
banded by the thin-axis rule the berm taught. THE LOOK CAUGHT A SCOPE
ERROR BEFORE IT SHIPPED: the first wire skinned the 9x9 rail sheds too
and they read as one giant corduroy sheet with the player walking on
it. Scoped to runs of width three or less the same hour; the sheds
keep their generic mass until a real shed treatment exists, and saying
so in the record beats shipping a wallpaper lie. Headhouse tops ride
the same rule where they are thin.

## 8/26 FIFTY-THIRD PASS: HE ASKED HOW MANY TILES, AND THE ANSWER WAS EMBARRASSING

Paolo: "you might think you have all of the pixelated, beautifully
crafted tiles that you need to make everything that you need, and you
don't. How many tiles are you using?" MEASURED, not guessed: the run
draws ~886 distinct tile assets (465 cooked tileform pieces, 42 starter,
46 bought grounds, 30 texture-match, ~132 civic skins, 18 perimeter, 9
doors, 8 openings, 10 ground-pool, 126 exterior objects) - while HIS OWN
7/13 Great Sweep approved 1,927 bought tiles of which only ~647 had ever
drawn a pixel. The outdoor pool was capped at 18 per bucket by an old
legibility guess. ACTED: cap doubled to 36, three new buckets (burn
scars, cargo containers, workbenches+tools - the loot packs and the
dead-system exclusions untouched), pool 126 -> 283 objects. THEN THE
TASTE SWEEP, four passes on a contact sheet, because his thumb approved
the TILE and the world's laws govern WHERE: killed 106 by content hash -
fresh produce/meat/preserve stalls (in act 1 nobody is buying), lit
lanterns, powered beacons and the lit forge (LIGHT=TERRITORY), glowing
sci-fi canisters, the sword crate, the numbered disc, the heraldic
banner, live embers in thirty-year-old burn scars, and finally the lit
green pedestrian signal (found by measuring its own green pixels). The
'light sources and fire barrels' pack proved to be a FIRE FACTORY that
backfilled every kill with another flame - removed from the regex, with
exactly TWO fire barrels pinned back by hash as the life sign (DEAD IS
NOT THE DEFAULT). Paid for the payload growth honestly: the VOTE page
was embedding 69 bake-size sprites (29 MB with an EMPTY queue) - now
embeds at display size (6.6 MB), publish surface 258 -> 236 of 260.
Verified live at a commercial lot: crates, tarped cargo, tires, sacks,
an emptied stall, one modest campfire - a lot people LEFT, not a market
morning. Wave 3 of the icon kills and the industrial 'truck court'
surface-map gap (measured, unpropped today) are next.

## 8/26 FIFTY-FOURTH PASS: THE WORKING DISTRICTS GET THEIR PROPS (surface-map gap)

Measured yesterday while probing the widened pool: INDUSTRIAL - a
district of 6,863 'asphalt drive' and 1,893 'truck court' cells - had
ZERO prop surfaces, because the surface map never learned its
vocabulary ('truck court' is not 'lot'; 'yard road' is not 'road').
Same gap: the granary's 3,828-cell dump apron, the wash's maintenance
road, the reservoir's access roads, the arsenal's storage ground.
Widened the map by the measured names: any name carrying 'road' or
'asphalt drive' is a road (the NEVER list still pulls driveways and
rail track out first), 'truck court' / 'apron' / 'stall stripe' join
the hardstanding class, 'storage ground' joins the waste class.
Verified live at the industrial truck court: dead trucks where they
stopped, rubble, pallets, a tarp shelter, a boarded gate - a yard
people abandoned, not empty asphalt. His own approved wrecks and
props, drawing in five more districts. ALSO RECORDED, PENDING HIS
WORD: he said he will explain "act one approve and other act approve"
- no assumption made about act-scoping of the 7/13 sweep until he
does. Wave-3 icon bake (8 low-by-nature districts uninflated, farm
refielded, the drive-in's black-slab frame bug fixed) is grinding in
the background and ships when it lands.

## 8/26 FIFTY-FIFTH PASS: THE FRESH RANKING AND THE LAKE THAT LEFT ITS BED

Re-ran the inventory instrument (753 names, one sample cell per
district across the full 96x96): after six shipped families the old
queue was stale, and the new top lies were 'exposed lakebed' x4109
(Mead's bathtub bed drawing as gravel), 'quarry floor' x3691+x3699
(both pits), 'hardpan' x1223, 'dead fairway' x2074. One cook of six
tiles: drought-bed polygons (wandering crack seams with sunlit lips -
the 8/1 no-straight-lines law applied to geology) and the swept bench
floor (wheel-lane compaction as broad value dips, one blast-scar drag
variant). The fairway shipped as PURE WIRING into the approved turf
stripes - zero new pixels, a fairway is a lawn with a job. Verified
live at the intake, the quarry and the golf course. A false alarm on
the way: two lit traffic signals in the intake frame looked like sweep
escapees, but measuring the pool by red+green found nothing - they are
another system's street furniture, pre-existing, not the pool's. The
twenty-fifth wired family; the wave-3 icon bake still grinding behind
all of it.

## 8/27 FIFTY-SIXTH PASS: ICON WAVE 3 LANDS (five clean, three to the oven again)

The overnight bake landed and the look sorted it: SUBURB reads as a
single-storey subdivision again, TRAILER as rows of single-wides with
hitches, STORAGE as long low unit rows, GOLF as greens and bunkers
with a low clubhouse, and the GYPSUM DOME is finally a smooth
hemisphere with no wedding-cake stripes - the inflate/dress exclusion
did exactly what the diagnosis said. Three imperfects went straight
back to the oven in one batch: the FARM's furrow rows bled past the
plot's diamond edge (inset), the DRIVE-IN's bleached face pointed EAST
while the camera reads the SOUTH face of an east-west wall (the icon
showed the dark back - face swapped), and the QUARRY was still the
hole-that-was-never-there: solid stacked prisms render as a MOUND, the
same bug the basin fixed 8/19, so the benches are annuli now with a
low floor disc at the bottom. The five clean wins are wired and ship
now; all icon gates 0 by exit code.

## 8/27 FIFTY-SEVENTH PASS: THE QUARRY IS A HOLE AT LAST (and two stragglers re-oven)

Bake 4 landed: the QUARRY finally reads as a PIT - ring benches around
an open hole with a floor disc at the bottom, the basin's
hole-is-a-frame lesson applied - wired and shipping. The farm's rows
still bled at the plot edge (inset again, tighter) and the drive-in's
screen STILL showed a dark long face: my face-key guess was wrong
twice, so theory is fired and both long faces are bleached - whichever
one this camera renders IS the screen, and the back bracing still says
which side is the back. Bake 5 carries those two, nothing else.

## 8/27 FIFTY-EIGHTH PASS: THE PROBE THAT SHOULD HAVE EXISTED THREE BAKES AGO (+ the dump gets its ground)

Bake 5 landed and the farm STILL bled and the drive-in was STILL dark -
the third blind failure each, at 73-160 minutes per guess. So the
missing instrument got built: a SINGLE-HERO local bake (one district
through the exact pass pipeline at half supersampling, 1.7 seconds).
Two probes found two root diseases no amount of re-reading found:
(1) FARM - _draw_ground fits the pad only to solids at least 0.5 tall,
so the 0.12-tall furrow rows never counted and the pad hugged the
buildings; the fit now includes declared ground patches. (2) DRIVE-IN,
two diseases at once - the camera reads +y faces (depth = x+y+z,
nearest MAX), so the frame box at LARGER y sat IN FRONT of the screen
and was wider and taller: the dark slab in every icon was the FRAME
covering the screen, with the bracing struts streaking across it;
"behind" in this projection is SMALLER y. And SCREEN's palette entry is
itself dark slate, so no multiplier could ever bleach it - the face now
blends hard toward absolute white, because a projection screen is
painted white whatever the steel is. Both probed clean in seconds.
Bake 6 grinds behind this pass.

Meanwhile the board moved: TF-ART-026 WASTE FILL. Measured on the
walked world: 'waste fill' is 6,400+ cells PER landfill cell - the
dump's dominant surface - drawing as yard gravel, and 'cell berm' is
2,400 cells per cell in rings measured EXACTLY 3 thick (1,917 of
2,406), which is the same ridge grammar as the arsenal magazines. So:
the fill cooked from approved dirt/pale/rust (cover soil worn through
to dark refuse, bleach flecks, rust scrap, one variant carrying a dead
compactor's track pass), and the berms wired as PURE REUSE of the
approved mag_ pieces with zero new pixels. Verified live at the
landfill: the fill field draws inside its banded berm ring. The
twenty-sixth wired family, and cover soil already lands in the dirt
family by name so the whole district ground now resolves.

## 8/27 FIFTY-NINTH PASS: THE YARD KEEPS ITS DEAD TRAINS (TF-ART-027)

'Rolling stock (boxcar)' x3012 was the second-biggest unclaimed name in
the world and the measurement said something better than a count: 101
of the 118 blobs are EXACTLY 7x4 cells - a true 50-foot boxcar - and
the 14 locomotive blobs are the same footprint. That is the parked
trailer situation to the letter, so the trailer's own law answered it:
one roof-read RGBA sprite per flood-walked blob, anchored right-bottom,
ballast drawn under every cell first. Three weathers hashed per blob
(oxide, dusty bleach, bluegrey - a yard sorts cars from everywhere),
rust blooming at the panel seams, the running board down the
centreline, no reporting mark or number ever. The loco got its own
body: darker painted steel, radiator fan rings, the cab band. Two
craft catches on the contact sheet before wiring: the brake-wheel hint
was a DOTTED run (the 8/21 stipple ban) and became a solid disc, and
the bleached car read as fresh mill silver and got blended a step
toward oxide - thirty dusty years, never new metal. Verified live on
the classification tracks: cars standing at the true footprint. The
twenty-seventh wired family.

## 8/27 SIXTIETH PASS: THE FORT THAT KEPT THE INTERNET (TF-ART-028)

'Data hall' x2966 was the third-biggest unclaimed name and the look
explained why it mattered: the datafort's hero - the windowless
four-hundred-thousand-square-foot box - rendered as a smear of brown
static. Measured: the hero blob is 80x55, the generator wing is one
76x51 plate, and 1,189 cooling units line the hall faces in rows from
1x1 singles to a 49x12 yard. The reservoir deck's per-cell roof-plate
law answered all three: pale membrane in sheet courses with N+W seams
(cooled toward the approved galv so a roof never reads as desert
sand), darker standing-seam generator deck with oil stain and seam
rust, and one dead CRAC module per cooling cell - fan ring, dark
throat, STOPPED fan cross, rusted base on the old ones. The run's
!body guard means the per-cell skin dresses only the top; every 3/4
front face keeps its wall material. Verified live at the fort: the
brown static is gone, the campus reads like the Switch SUPERNAP
satellite photo thirty years dead. The twenty-eighth wired family.

## 8/27 SIXTY-FIRST PASS: THE PLAZA NOBODY READS ON ANYMORE (TF-ART-029)

The library measure named a whole civic family in one sweep: terrace /
plinth x2379, forecourt x1574, entry plaza x1171, courtyard x775,
planters x516 - 6,415 cells of the most formal ground in the valley
drawing as scrapyard gravel. Three pieces from three approved pools:
scored paving with the grime settled INTO the half-metre saw joints
(the grid darkens, the slabs stay pale - that is how real plazas age),
the plinth in bigger lighter slabs, and the planters. TWO catches by
looking: the straw rosette harvested a near-black pool and got lifted
toward the pale (dead straw reads LIGHTER than the soil it died in),
and the first live frame drew a 5x7 planter blob as 35 individual
boxes - a WAFFLE - so the planter went blob-aware: a lone cell keeps
its full box, a bed cell draws soil with the concrete rim only on its
outside edges. Verified live at the library, un-waffled. The
twenty-ninth wired family. Four families this window (fill, trains,
fort, plaza); the icon bake still grinding behind all of it.

## 8/27 SIXTY-SECOND PASS: THE WIRES THAT HOLD THE TOWERS (TF-ART-030)

'Guy wire' x2798 sat flagged marginal until the measure showed the fans
ARE the radio district's shape: 132 radial blobs running from the 45
guyed-mast cells to the named anchor blocks. The method is geometry,
not texture: each wire cell computes the bearing to its NEAREST mast
(positions lazily cached, one scan per district cell) and lays a thin
steel line snapped to eight directions - 1px steel, galv glint
sun-side, faint shadow offset SE - so every line in the fan CONVERGES
on its tower like the real KDWN array from the air. A taut guy has no
sag from above; straight is honest here, it is rigging, not hair.
Verified live: the radial runs continuous across cells. The thirtieth
wired family. Same measure also surfaced 'propane tank / ice bridge'
x3376 - BIGGER than the wires - logged as open board row 105 for the
next pass, not chased now.

## 8/27 SIXTY-THIRD PASS: WHAT FED THE LAST TRANSMITTER (TF-ART-031)

Board row 105 answered the pass after it was logged: 'propane tank /
ice bridge' x3376 in 139 blobs, one name for two real things, and the
MEASUREMENT is what splits them - dozens of small blobs (1x2, 2x2:
the tank banks) against long thin runs (21x3, 39x7: the elevated
cable trays). The wiring carries the same split per cell: thin axis
<=3 and long axis >=5 reads as a galvanised ICE-BRIDGE ribbon along
its axis (lit rims, crosswise ribs, post shadows), everything else
reads as a bank of bleached 500-gallon TANK cylinders - lit crown,
shadowed belly, saddle shadows, weld rust on half of them, the valve
dome over the top. Verified live: tank rows in the yards, silver
ribbons converging on the masts, exactly the satellite read of a real
transmitter site. The thirty-first wired family; the radio district's
three big names (wires, plant, and its site ground by name fallback)
all resolve in one day.

## 8/27 SIXTY-FOURTH PASS: THE CHANNEL REMEMBERS ITS LAST FLOW (TF-ART-032 + a free floor)

The riprap form's own promise ("the channel bank and invert are next")
came due: invert x5646 + bank x4048, the wash's last two unclaimed
names. Channel concrete from the kerb pale, and TWO catches by looking
before it shipped: the weeps mixed in raw dirt and came out LIGHTER
than the slope (a weep is a shadow, not a highlight - darkened), and
the first live frame put the low-flow stain on EVERY invert cell at
its own offset, which reads as a BARCODE, not a river. The fix is a
rule, not a repaint: only the run's centreline cells carry the stain
(perpendicular walks balanced), and the wander is edge-pinned to the
tile centre at both edges so the line JOINS cell to cell - wide basin
reaches go plain jointed concrete with sparse fragments, narrow runs
carry one continuous line. Banks streak down their slope by axis.
And the water plant got its floors for free: 'dry basin floor' x6920
wired into the TF-ART-025 bed tiles, because dried sludge cracks into
the same desiccation polygons a dried lake does - zero new pixels.
The thirty-second wired family. Also re-ranked the whole world fresh:
memorial lawn, sun deck and dead rough turned out already claimed
(the ranking list was stale, the slice was not), so after this pass
the biggest unclaimed names left are generic grounds the bought pools
already own. The named-content queue is, for the first time, CLEARED.

## 8/27 SIXTY-FIFTH PASS: ICON WAVE 4 JUDGED BY THE PROBE (two rebuilt, eight stand)

The single-hero probe made wave 4 an afternoon instead of a week: all
ten remaining kill-board icons baked locally in seconds and JUDGED ON
SIGNATURE. Eight stand as they read post-pipeline-fix: battery (rack
rows), campus (mid-rise cluster in trees), firestation (the red bay
doors), arsenal (magazine rows), terminal (concourse drum), cityhall
(civic drum), policestation and library (the Predock one-building
composition he approved at 85% on 8/2 - not re-touched). Two failed
their signature and got rebuilt: the MALL read as three mid-rise
window blocks - downtown, not a mall - so it is LOW AND BLANK now
(two-storey windowless tilt-up anchors, the one glass at the entry
under its canopy, RTU boxes on the roof) and joined the pass-exclusion
set because widen-and-raise kept re-inflating it, the probe catching
the re-inflation in 1.7 seconds. And the WATERPARK's stacked shrinking
platforms were the same wedding cake the dome fix named, so the slide
tower is an OPEN FRAME now - four legs, equal decks, air between -
with three flume ribbons pouring off the top deck to their own runout
pools. TWO probe catches on the flumes alone: they exited through the
tower's own middle (now they exit AT the deck edge), and a flume bearing
parallel to the camera diagonal projects as a vertical caterpillar
(dx ~= dy - the bearings now avoid the diagonal). These two ride BAKE
7 after bake 6 ships; the other eight ship with bake 6 as they stand.

## 8/27 SIXTY-SIXTH PASS: THE FIFTH COMPOSITION AUDIT (second-order pieces, three findings)

The audit rule this time: LOOK at the pieces the family ships shipped
but the verification never framed - the locomotive, the vertical tray
runs, the narrow invert. THE LOCO READS TRUE (fan rings, cab band, the
dark deck among the pale cars - no fix). TWO REAL FINDINGS, both fixed
and re-looked the same hour: (1) THE TANK CARPET - the radio site's
big yards (up to 49x12 cells) drew one cylinder on EVERY cell, five
hundred tanks wall to wall; a real farm stands in rows with working
aisles, so yard-blob cells on alternate rows now draw bare ground and
the site reads like a fuel depot instead of a pill box. (2) THE DASHED
RIVER - the invert's centreline test demanded EXACT walk balance,
which only exists at odd widths, so the stain dropped out on every
even-width row; the tie-break (equal or one short on the near side)
picks exactly one cell per row at any width and the line runs
continuous now, braiding where the ragged basin edge genuinely shifts
the centre - which is what a real low flow does. Bake 7 grinding
behind the audit with the wave-4 and twin-cure source aboard.

## 8/27 SIXTY-SEVENTH PASS: BAKE 7 SHIPS WAVE 4 (and the twins are one hair from cured)

Bake 7 landed with all seven changed icons reading true at bake
quality: the MALL is a dead mall (low blank tilt-up, entry glass under
its canopy, RTUs), the WATERPARK is a slide tower (open frame, three
flumes to their runout pools), the BASIN is dark engineered ground
inside its berms, the WASH is pale lined concrete with the stain, the
RAIL rides dark ballast, the ARTERIAL wears its double yellow, and the
LANDFILL's scale house stands clear of the mound. big_icons,
round+doors, hero wire, icon, square and dossier gates all 0 by exit
code. SQUINT and HUE remain red - both were red on main before this
session (verified in a clean worktree) - but the five twin pairs
measured 0.0263-0.0300 against the 0.030 bar, all within 0.004. The
finishing moves are authored for BAKE 8: the desert pad WARMS (varnish
and caliche are the yellow-brown ones; every graded site is bladed
grey - one change moves three pairs), the rail cess deepens a step,
and the arterial gains its honest second hue FAMILY - faded D-series
street-name blades on the light masts, signage green, not vegetation.

## 8/27 SIXTY-EIGHTH PASS: THE FINDING THAT OUTRANKS EVERYTHING ABOVE IT

Chasing the backlog for the lane's next item surfaced the coordinator's
8/14 banner: THE CITY WORLD IS THE WALKED SURFACE, THE RUN SLICE IS
LEGACY - and the alpha's own 8/21 comment goes further: the run slice
is never even DOWNLOADED any more. Measured the same hour: the walked
city page contains ZERO of the named-cell branches and zero tileform
pieces. All thirty-two wired families - every pass in this record -
draw on a surface the player never loads. This is the 7/21 colorful-
clothes class the handoff itself warns about: the material existed and
never reached the player, and every "TAB: RUN" line in these passes
was true of the file and false of the product. Nothing is lost: the
run slice is the harvest source by the coordinator's own words, the
banks are approved, and the sound/combat/payday migrations plus the
interiors floors prove the walked page takes lane wiring (main commit
ad42288 even hardened the chunker to carry foreign data forward). THE
GREAT TILE MIGRATION is board row 107, HIGH, seam design shared with
CITY/WORLD. New standing rule, effective now: MEASURE ON THE WALKED
SURFACE FIRST before any new exterior family is cooked. Full finding:
records/BOHEMIA_FINDING_THE_TILES_RIDE_A_SURFACE_NOBODY_WALKS_8_27_26.md

## 8/28 SIXTY-NINTH PASS: HUE GOES GREEN FOR THE FIRST TIME (bake 8)

The container restart ate bake 8 mid-run; relaunched, landed, and the
finishers did their work: HUE IS GREEN - the arterial's faded
street-name blades are its honest second hue family - and the warm
desert pad cleared ALL THREE desert twin pairs at once (basin=desert
0.0336, desert=wash 0.0362, desert=rail 0.0374, all clear of the
0.030 bar). Two pairs remain, both sharing the BASIN (basin=wash
0.0280, basin=rail 0.0291), and the basin's honest distinguisher is
authored for bake 9: LIFE - a detention basin is the one floor in the
valley that occasionally holds water, so dead salt-cedar scrub mats
thick over its silt, which neither the bare lined wash nor the
ballast corridor can ever grow. Wired, icon gates 0 by exit code,
shipping now; squint is down from five pairs to two and main was
carrying three before this session started.

## 8/28 SEVENTIETH PASS: THE GREAT TILE MIGRATION, PHASE 1 - THE TILES REACH THE PLAYER

Board row 107 opened and its first phase SHIPPED the same day. The
scout found the seam already built: the walked page resolves every kit
cell to its legend entry and routes ground cells to approved art pools
BY NAME (the proper-sidewalks table), and the floors precedent plus
the hardened chunker (main ad42288) provide a payload-safe carrier.
So Phase 1 is a REGISTRATION, not a rewrite: a 90 KB late-loading pool
file (tools/bohemia_city_tileform_pool.py, approved banks only, law
line asserted) merges nine ground pools into SA_IMG, and thirteen
name rows route the cells - waste fill, drought bed (intake, terminal
hardpan, watertreat basins), pit floors, plaza, plinth, invert, bank
(axis from the kit's own run), xeriscape, tank deck. The variant
hashes per cell, with the 7/14 one-material law kept by the pools
themselves (same-material pattern variants cooked to break their own
repeat). VERIFIED ON FOOT, on the surface Paolo actually walks:
standing ON the waste fill at the landfill (6,803 cells assigned,
counts matching the run world exactly) and ON the scored plaza at the
library (3,519 + 2,379). One day after the stranded-tiles finding,
the biggest surfaces reach the player. Phase 2: the structure-layer
families through the prop/post path, the centreline stain, the
planter beds.

## 8/28 SEVENTY-FIRST PASS: PHASE 2A - A BOXCAR IS NOT A CAR

The migration's second act, hours after the first: the walked city's
vehicle branch was parking a 2x4 SEDAN lattice on every kind:'vehicle'
blob, so the railyard's 7x4 boxcars drew as three squashed cars each.
The rolling stock now rides the same vehicle-post contract as the
cars - the pool tool repackages the approved TF-ART-027 masters
NOSE-UP (a quarter turn at package time, so the stall draw's own
rotation serves them unchanged) and the branch gives boxcar and loco
their own 7x4 lattice. Verified on foot at the railyard: 118 boxcar
posts and 14 loco posts, the EXACT blob counts measured on 8/27, two
of them filling the screen either side of the player as a boxcar
should. Structural gates green. Phase 2B holds the structure-layer
roofs, the tanks, the stain and the planter beds.

## 8/28 SEVENTY-SECOND PASS: PHASE 2B - THE STRUCTURES CROSS OVER

The migration's third act in twenty-four hours: the structure and prop
layers route by name now. c.sPool carries the approved pool on the
cell and the baker honours it AHEAD of the generic material pool -
the first render proved why the order matters: the datafort's halls
wore patchwork brick and corrugated (artPool knows what a roof is
MADE OF; the name knows what it IS - specific beats generic, the same
rule the APPROVED FAMILIES FIRST pass runs on). Two families sat
behind a second ambush: the cooling units and the radio tanks are
PROP-layer cells whose branch returns early, so the routing rode into
that return too. The wash's centreline stain and the blob-aware
planter came across with their 8/27 audit rules intact, reading the
kit's own runs. Verified on foot in human mode, three districts: the
membrane and generator decks underfoot at the datafort, tank rows
with working aisles at the radio site, the pale jointed invert with
its stain fragments and weep-streaked banks at the wash. 2C remains:
guy wires (mast bearings), planter rims (overlay pass), and the
boxcar polish.
