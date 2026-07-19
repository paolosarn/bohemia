# BOHEMIA ADDENDUM — STREET-AWARE / DRIVABLE ACCESS LAW (Paolo 7/19/26, LOCKED)

Paolo, verbatim: "whether it just has one street connection or has two because it's a
corner is gonna be super important. OK for everything moving forward and keep in mind."

## THE LAW
Every district that fronts the road network must be built STREET-AWARE and DRIVABLE, and it
must be correct for BOTH cases a cell can be placed in:
- **STANDALONE grid** — the cell touches ONE street (on any edge: N, S, E, or W).
- **CORNER** — the cell touches TWO streets (an L of two adjacent edges).

Requirements every such district satisfies:
1. **ONE car entrance.** A district gets a single vehicle entrance, on the street it fronts.
   A corner does NOT get two car entrances (real sites don't) — the car entrance goes on the
   PRIMARY street (frontage order S > E > W > N), and each additional street gets a
   **pedestrian gate** only.
2. **A real DRIVABLE network.** Wherever a car normally goes — the driveway from the curb cut
   and the parking-lot aisles — is an explicit CAR-DRIVABLE surface, SEPARATE from pedestrian
   paths (you never drive the walking trail). From the street curb cut a car can reach EVERY
   parking stall (drive network is one connected blob; zero orphan stalls).
3. **Gates only on real street edges.** No gate is ever emitted on an edge that isn't a street.

## THE MECHANISM (so it's authored ONCE and always correct)
`engine/bohemia_district_kit.js` carries the shared machinery — a district builds its layout
in a CANONICAL frame with the car entrance at the SOUTH edge, then calls:

    K.rotateToStreet(canonicalGrid, streets, {gate:5, pedWalk:1, pedOver:isSoft, pedInset:18})
      -> {g, primary, gates}

which spins the grid so the car entrance lands on the actual primary street and adds
pedestrian gates on the corner side streets. Helpers: `primaryStreet`, `rotateCW`,
`scanGates`, `pedGate`, and the drivable-gate checks `driveNetworkOk(g,driveCode)`,
`driveTouchesEdge(g,driveCode)`, `stallsReachable(g,stallCode,driveCode)`.

## THE MACHINE GATE (a law without a gate is not enforced)
- `gates/district_kit_gate.js` proves the machinery itself (rotateCW, primaryStreet,
  rotateToStreet lands the entrance + adds the corner pedestrian gate, driveNetworkOk,
  stallsReachable).
- Each district's own gate asserts the law on THAT district across configs — the reference
  is `gates/park_gate.js` (11 checks over 6 configs: each single edge S/N/E/W + corners S+E,
  N+W — drive connected, driveway reaches the primary street, every stall car-reachable,
  corner has a pedestrian gate on the side street).

## STANDING JOB (retrofit)
The park (bohemia_park) is the first district fully on this law. The earlier districts
(commercial, industrial, medical, solar) predate it and OWE the retrofit onto
`rotateToStreet` + an explicit drive code + the drivable-gate checks. Do it as each is next
touched; NEW districts use the mechanism from the start. We will have SEVERAL parks — each
gets it for free by building canonical-south and calling rotateToStreet.
