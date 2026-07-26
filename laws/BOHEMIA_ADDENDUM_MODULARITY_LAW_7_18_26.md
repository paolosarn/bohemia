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

## LOTS FIRST + REAL CALIBRATION (Paolo 7/18)
Paolo: "compact as many houses as reasonably next to each other... front yard,
backyard, house, they squeeze in as many as they can." He gave a real address
to calibrate against (a home on Campana Dr, Las Vegas 89147). Findings from that
tract (public real-estate data on the street):
- Lots ~6,100-7,000 sq ft (~0.14-0.16 acre); 2-story homes ~1,970-2,940 sq ft,
  built ~1990-93; ground footprint ~1,400 sq ft (~18x14 tiles at 0.75 m/tile).
- Realistic density: ~12-20 homes per 96 m cell (lots ~24 tiles wide x ~40 deep).
THE RULING: plat LOTS FIRST, streets serve them (not roads-first-sprinkle-homes).
engine/bohemia_suburb.js rebuilt: horizontal streets spaced one back-to-back
lot-pair apart; a house is placed on every lot along every street (both sides,
LOTW apart); top + bottom rows back the walls; front yard + house + backyard per
lot. Styles: grid (tract rows) / culs (rows + a cul-de-sac cross-street) / double
(full grid). ~22-25 homes per block. The gate's SPACING + connectivity + garage/
driveway checks still hold.

## MODULARITY — IMPLEMENTED + LOCKED (Paolo 7/18/26, evening)
Both levels are now real in engine/bohemia_suburb.js and gated (gates/suburb_modular_gate.js, 14 checks):

HOUSE FACTORY (houses are not clones): typed MODELS[] — constant depth (rows still
pack) but varied WIDTH (13..21 tiles), garage size, garage SIDE (left/right front
corner), and STORIES. Two-story homes stamp an inset upper floor (grid code 9) so
they read taller top-down. Each lot picks a model deterministically from (seed,x,y).
Gate: a block must show 3+ distinct widths AND both one- and two-story present.

STREET-AWARE NEIGHBORHOOD: generate(seed,{cw,ch,streets:[...]}). `streets` lists the
UNION edges that face a road (N/S/E/W). Gates punch ONLY through street edges, each
with a spoke to the interior ladder:
 - ONE GRID on one street -> one gate on that street.
 - CORNER (two street edges) -> exits BOTH streets.
 - MERGE: adjacent same-type cells become a cw x ch UNION — ONE perimeter wall, ONE
   connected rail+rung network, gates scaled per edge length (a 2-wide main street
   gets 2 gates). 2x1 ~50 homes, 2x2 ~107 homes, all connected.
Gate enforces: gates only on street edges, every street gets a gate, corner=2 edges,
2x1=2 gates on the main street, plus connectivity at 1x1/corner/2x1/1x2/2x2.
Old API generate(seed,'ring',cw,ch) still works (defaults to a south street).
Proof (still, not walkable): slices/BOHEMIA_SUBURB_MODULAR_PROOF.html.

WHAT COMES AFTER (the fold into the world model, mine/unblocked): the overmap/bridge
must tell a residential cell which of its edges face streets (from the street grid)
and whether it merges with same-type neighbors, then call generate() with those
streets + shape. Then world().plot() over any residential cell returns a real,
correctly-gated neighborhood of varied homes — and LIFE (agents) can move in.
