# TILE FORM TF-WORLD-011 — DEAD HEAVY VEHICLES (what the car size cannot express)

## A. IDENTITY
- NAME: Dead heavy vehicles (semi, bus, locomotive, freight car, plant, boat)
- FAMILY/SET: HEAVY VEHICLE family — semi tractor + trailer + transit bus +
  locomotive + freight wagon + dozer/compactor + tractor + small boat + a
  burned/stripped variant of each hull. ONE drawing job.
- THE JOB, ONE SENTENCE: this tile exists so the districts whose whole story is
  a stopped vehicle have that vehicle, because the canon CAR/BUS/TRAILER sizes
  describe road cars and cannot express a locomotive or an airliner.
- SCOPE NOTE: the CAR itself is canon and already sized; ENEMIES are board row
  2; AIRCRAFT are deliberately EXCLUDED here and held with the airfield icon
  ruling that is still pending Paolo.

## B. WHY
- DEMANDED BY: the district dossiers — 27 distinct vehicle materials are
  declared across the lane. The ones the road set cannot express: dead
  locomotive and freight car (rail, railyard), dead semi (freeway,
  interchange), dead bus (terminal), fire engine (firestation), tractor
  (farm), dozer/compactor (landfill), sunken boat (water), impound wreck
  (policestation), crushed-car stack (boneyard). Also the 7/28 theme sheet,
  where the truckstop's hook is literally "sleepers nose-to-tail where drivers
  stopped" and the firestation's is "bay doors open, bays EMPTY".
- WHAT LOOKS BROKEN TODAY: all render as coloured blocks. The rail corridor's
  standing consist — the single most evocative thing on 90 cells — is a row of
  rectangles.
- SHOPPING CHECK: records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md —
  * The canon vehicle sizes (CAR/BUS/TRAILER, enforced by
    gates/vehicle_size_gate.py) are SIZE CONSTANTS in the hero factory, not
    art. Checked: they constrain scale, they do not supply pixels for the
    walkable surface.
  * HD PACK UP list: no heavy-vehicle family.
  Nothing in the index claims these hulls.

## C. WHERE
- SURFACE + TAB: RUN (you walk up to and around them; several are effectively
  small rooms) + CITY.
- DISTRICT FAMILIES: rail, railyard, freeway, interchange, terminal,
  truckstop, firestation, farm, landfill, water, policestation, boneyard,
  industrial, warehouse.
- LAYER: prop (vehicle)
- SOLID? yes — ENTERABLE? not in this form. Several (the bus, the sleeper cab)
  are obvious future interiors, but INTERIOR-MATCHES-EXTERIOR would then bind
  their footprints, and no interior has been ruled. Requesting exteriors only.
- MUST SIT BESIDE: the surface they died on — rail for rolling stock, lot
  asphalt for road vehicles, dirt for plant, lakebed for the boat.
- NEVER BESIDE: rolling stock anywhere but on rails (a boxcar in a car park is
  the classic reuse error); a semi inside a building.
- EDGE CONTRACT: SINGLE PLACEMENT — a vehicle is one object, never a tiling
  field. Only the trailer/wagon may repeat, nose-to-tail, to form a consist.

## D. WHEN
- ACT: 1
- BEST TIME: both; no self-light, no working lamps.
- WEATHER STATES: sunny baseline; rain darkens paint and pools on flat decks.
- LIT/UNLIT: none.
- ANIMATION: static. Nothing runs in act 1.

## E. HOW
- EXACT SIZE: driven by the canon size constants already in the hero factory
  (CAR/BUS/TRAILER, and the RAILCAR/LOCO constants added 7/27) so that walk-
  surface art and icon art agree. Footprints in tiles derive from those.
- VIEW: 45-degree world view. Wheels and tanks get ellipse cross-sections, not
  flat side-on circles (45-degree art law, gated).
- PALETTE: constitution ceiling; PROP values. Vehicles are legitimate hue
  carriers — a faded red fire engine and a faded yellow dozer are exactly the
  distinct colour the 7/28 measurement says our districts lack.
- LIGHT: the one global direction. NO keyline. NO dither.
- SHADOWS: none baked; a vehicle's ground shadow is the separate pass.
- SCALE ANCHORS: the canon CAR is the ruler — a semi trailer is ~2.6 CAR
  lengths, a bus ~2.6, a locomotive ~4.3. Those ratios are already fixed in
  the factory constants and must not drift.
- WEAR LEVEL: Vegas sun destroys paint and plastics but barely rusts steel.
  So: chalked, sun-faded paint with the clear-coat peeled in sheets; flat,
  cracked, sun-rotted tyres sitting on the rim; glass crazed or gone; interiors
  bleached. Rust is LOCAL (panel edges, exhaust, rail wheels), not all-over.
  Anything with copper or catalytic value has been stripped.
- VARIANTS: per hull — intact-derelict, stripped, burned. STRUCTURE-NOT-COLOR:
  paint colourways share the form; a different hull is a different form.

## F. THE CAPTION
```json
{
  "id": "TF-WORLD-011",
  "name": "dead heavy vehicles",
  "layer": "prop",
  "solid": true,
  "enter": false,
  "district_families": ["rail","railyard","freeway","interchange","terminal","truckstop","firestation","farm","landfill","water","policestation","boneyard","industrial","warehouse"],
  "best_time": "any",
  "best_location": "wherever the vehicle stopped and was never moved -- on rails, in a bay, in a lot, in a field",
  "place_next_to": ["permanent way (rolling stock only)","lot asphalt","dirt yard","lakebed"],
  "never_next_to": ["rolling stock off the rails","a semi inside a building"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "single placement (trailers and wagons may repeat nose-to-tail)",
  "anim": null,
  "tags": ["prop","vehicle","heavy","dead","hue-carrier","canon-size-bound"]
}
```

## G. REFERENCES
- APPROVED ANCHOR: the canon CAR/BUS/TRAILER/RAILCAR/LOCO size constants
  (gates/vehicle_size_gate.py enforces them) — the art must be built to those
  exact ratios so the walk and the icons agree.
- NAMED OUTSIDE REFERENCE: Fallout: New Vegas's derelict rolling stock and
  road wrecks for how a dead vehicle reads in desert light; The Last of Us for
  vehicles as ARCHITECTURE you navigate around rather than set dressing.
- REAL-WORLD GROUNDING: the Union Pacific yard in Las Vegas and the I-15 truck
  corridor. Critically, desert derelicts do NOT look like wet-climate wrecks:
  in the Mojave, cars sit for decades with straight panels and readable paint
  because there is no road salt and little moisture — they die by UV. Tyres rot
  and flatten long before the body corrodes. This is why the boneyard district
  already specifies "faded blue / faded white / rust" as three separate reads.

## H. DON'T WANT
- NOT rusted-to-lace wrecks. That is a wet-climate image and it is wrong here.
- NOT a flat side-on wheel (45-degree art law, gated).
- NOT off-canon sizes — the size gate exists precisely because scale drifted
  between heroes once already.
- NOT enemies or occupied vehicles (row 2 owns enemies).
- NOT aircraft (held with the pending airfield-icon ruling).

## I. ACCEPTANCE
- [ ] Canon size ratios verified against the vehicle-size gate constants
- [ ] 45-degree check: no flat side-on circular forms
- [ ] Palette ceiling + PROP values + one-light green
- [ ] Assembled proof: a rail consist nose-to-tail on the permanent way, and a
      truckstop sleeper row
- [ ] Squint test: at map zoom a consist reads as a train, not a smear
- [ ] ON THE REAL SURFACE: a rail cell and the truckstop
- [ ] Caption JSON parses and matches C/D

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: WORLD | DATE: 7/28/26 | PRIORITY: MED
- BOARD ROW #: 20 | VERDICT: —
