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
