# BOHEMIA — ADDENDUM: WORLD BEFORE QUESTS (Paolo 7/26/26, LOCKED)

## THE RULING, IN HIS WORDS
> "We are not ready to deliver and care about quest right now, bro. You gotta work on
> something else for the world model bro... I can't trust you on quest right now and we
> don't even have enough of the world built to really host anything... how many times I
> gotta tell the fucking Bohemian file. We are not ready to worry about quest right now
> we need to actually build a fucking world."

Delivered in response to a WORLD-lane turn that shipped quest PLACEMENT candidates
(records/BOHEMIA_QUEST_PLACEMENT_CANDIDATES_7_26_26.md). The work itself was not the
problem; the SUBJECT was. He has said it before, and this addendum exists so no session
has to be told again.

## WHAT IT MEANS, MECHANICALLY
1. **The WORLD lane does not work on quests.** Not placement, not casting, not the quest
   bridge, not quest content. Those items are PARKED in BOHEMIA_BACKLOG.md until Paolo
   himself reopens them. The already-shipped placement judge stays reachable and stays
   unjudged; it is not re-surfaced, not re-asked about, not "finished."
2. **The WORLD lane builds the WORLD.** Ground you can stand on, a valley that reads as a
   place, the spine everything else hangs off. The measure is not "is the system elegant,"
   it is "is there more real world than there was this morning."
3. **A hosting bar comes before a hosting feature.** "We don't even have enough of the
   world built to really host anything" is the test to apply to any proposed world-lane
   item: does this make the valley more able to HOST people, stories and play, or does it
   decorate a valley that cannot host them yet? Build the first thing.
4. **This binds the lane, not the fleet.** The QUESTS lane still writes quests (that is
   its charter, and quest TEXT is a thing Paolo reads in one sitting). What is dead is
   the WORLD lane spending its turns on quest plumbing.

## WHAT THE CENSUS SAID THE SAME TURN
Asked "what is actually missing," the valley answered plainly. Of 9,216 cells:
- 3,709 (40%) were real generated districts
- **3,386 (37%) were ROAD CELLS with no generator at all** — 2,434 arterial, 952 freeway,
  rendering as a flat grey slab. More of the valley was untextured road than was built
  district. Every district in the game fronts onto ground that did not exist.
- 927 mountain / 620 desert (terrain), and ~400 cells of bespoke landmark placeholder
  (the Strip, the resorts, the airport) that are Paolo's hand by law.

So the first answer to "build a fucking world" was the streets. Shipped the same turn:
`engine/bohemia_arterial.js` + `engine/bohemia_freeway.js`, taking the generated valley
from 40% to 77%.

## THE SURFACE CELL LAW (new, machine-gated the same turn)
A road cell is **real ground and not a district**. It gets a generator, a dossier, a
legend, layers and collision like anything else you stand on, and it registers in the
world model's `SURFACEGEN`, never `DISTGEN`. Therefore:
- `isAutoDistrict('arterial') === false`, `isSurfaceCell('arterial') === true`
- no faction can be based on a street, no economy district can be a street, no spawn tier
  or quest address can resolve to a street
- the live loop's district count is **unchanged** by adding surfaces (this is asserted,
  not assumed: gates/roadcell_gate.js §8)

A surface generator is a NETWORK TILE, not a street-fronting lot: it is handed the
directions whose neighbours are also road and builds what serves them. It never calls
`rotateToStreet`. All 16 link masks must build.

**Gate:** `gates/roadcell_gate.js`, registered as ROAD CELLS. 38 checks: every mask
builds and drives through, determinism, sidewalk continuity per side, the corridor is one
traversable space, LINE COLOR held (yellow only at the turn bay, never on a freeway),
EXPLAIN-EVERY-TILE, the overpass deck is a real OVERHEAD layer on solid piers, purity,
the blast-radius guard above, and every road cell in the real valley rendering a plot.

## WHAT THE WORLD LANE DOES NEXT (in order, until he says otherwise)
1. The rest of the ground: the 620 desert cells and the terrain that still renders flat.
2. The bespoke-landmark placeholders that are NOT Paolo's hand to draw (transport and
   infrastructure: airport, rail, campus) versus the ones that are (the Strip, casinos,
   resorts) — the latter stay reserved, by law.
3. The valley's composition itself: whether 70% suburb and 301 solar cells is the city
   Paolo wants is a DIRECTION call and stays [PENDING Paolo], but the census is now on
   record so he can rule on it in one look.
