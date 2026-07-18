# BOHEMIA ADDENDUM — PLOT MODULARITY LAW (Paolo 7/18/26, LOCKED)

Ruled on the suburb candidates: "I want to see all of them be modular to fit
into either a 1x2 or a 2x2. Of course all of these can be standalone, but if you
can't easily snap to the other suburbs then I don't want it."

## THE LAW
Every plot design (suburbs first, all plot types eventually) must be
CLUSTER-AWARE. A design has to generate a coherent, CONNECTED whole at 1x1
standalone AND when snapped into 1x2 / 2x1 / 2x2 (the DISTRICT MERGE LAW cluster
sizes). "Snapped" means: the wall wraps the UNION (not each cell), the internal
road network is ONE connected system reachable from a street gate, and it reads
as a single bigger neighborhood, not N walled boxes crammed together. A layout
that only works as a standalone 1x1 is REJECTED.

## THE MECHANISM
tools/bohemia_suburb_gen.js — genSub(seed, style, cw, ch) fills a cw x ch cell
union: wall wraps the union, a gate per street-facing cell, a spine + collectors
+ per-style culs/loops that span the whole cluster as one connected net, then
homes (street -> driveway -> front garage -> body) along every road. The judge
tool (slices/BOHEMIA_SUBURB_JUDGE) shows each style at 1x1 AND 2x2 so the snap is
visible before ruling. Candidate only; the winning style graduates into
bohemia_plotgen on Paolo's verdict.

## THE GATE (same turn)
gates/suburb_modular_gate.js (SUBURB MODULAR), wired into the suite. For every
style x {1x1, 1x2, 2x1, 2x2} x seeds: the road net must be connected (reachable
from a gate), homes must be present, and every home must have a garage + a
driveway. Tests the exact generator the judge shows, so what Paolo rules on is
what is enforced. A style that fails to snap fails the gate.

## RESEARCH — APARTMENT vs SUBURB LAND (Paolo asked, same turn)
Question: the ratio of apartment complexes to suburb land area in Las Vegas.
Findings (Census/ACS via the City of Las Vegas 2024 Housing Report + metro data):
- BY HOUSING UNITS: ~62% of Las Vegas homes are detached single-family; ~31-38%
  are multifamily (2+ units). Roughly 2 single-family units per 1 multifamily unit.
- BY LAND AREA (what matters for the map): apartments are 4-6x denser than
  suburbs (garden apartments ~15-25 du/acre vs single-family ~4-6 du/acre gross).
  So per unit they use far less land. Working the unit share through the
  densities: single-family suburbs occupy roughly 85-90% of RESIDENTIAL LAND and
  multifamily/apartments only ~10-15%.
- MAP RULE (mechanism, tunable, flagged): about ONE apartment-complex cell for
  every ~7-9 suburb cells in the residential fabric. Apartments cluster (near the
  Strip corridor, arterials, older core), they do not spread evenly. This informs
  the residential district mix; exact numbers + placement stay [PENDING Paolo].
Note: no published land-area percentage exists; the ~85-90/10-15 split is derived
from unit share x typical densities, not a direct stat. Sources: City of Las
Vegas Housing Report 2024 (ACS), U.S. Census QuickFacts, HUD LV metro CHMA.

## SPACING LAW (Paolo 7/18, added same day)
"All homes, even tiny as shit, at worst have a 3-tile backyard and 3 tiles
separating them from the next house." Enforced in engine/bohemia_suburb.js home()
(a 3-tile clear skirt required on both sides + the back before a home places; the
ring inset guarantees a >=3 tile backyard to the perimeter wall). Gated in
gates/suburb_modular_gate.js: homes are labelled and no two different homes may
have cells within 3 tiles (Chebyshev), across every style + cluster size.

## WALLED-BLOCK MODEL (Paolo 7/18)
Homes BACK ONTO the perimeter wall (backyards to the wall), fronts facing an
interior street. The driveway is a car apron (3 long x 4 wide, 2 cars); the
garage is the front corner of the house; the house is the bulk. Generator:
engine/bohemia_suburb.js, styles culs / double / court, real 0.75 m/tile,
cluster-aware. Approved style graduates into bohemia_plotgen on Paolo's verdict.
