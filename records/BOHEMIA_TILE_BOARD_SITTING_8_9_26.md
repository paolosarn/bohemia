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
