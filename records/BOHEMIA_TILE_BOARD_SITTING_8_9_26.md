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
