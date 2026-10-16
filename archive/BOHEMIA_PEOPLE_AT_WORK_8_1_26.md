# THE OTHER END OF THE COMMUTE (8/1/26, PEOPLE lane)

Paolo: "WE HAVE 11 months of forward motion work we need to complete. Do what you
have to do next and know what comes after."

## WHAT I FOUND, MEASURED BEFORE IT WAS CLAIMED

Two bugs sitting on top of each other, both about where people are.

### 1. TEN PEOPLE SLEPT IN A STRIP MALL
`agentsForBlock` makes a HOUSEHOLD out of every building handed to it — bedrooms,
a home to walk back to, the lot. `agentsForPlot` handed it every building in the
valley, whatever the district was. Measured on 58 sampled cells: the census and
the generator DISAGREED ON 52 OF THEM.

    COMMERCIAL cell 17,5   census 0   agents 10   — all 10 sleep in the strip mall
    SOLAR      cell 17,0   census 0   agents  3   — in the inverter shed
    STORAGE    cell 47,8   census 0   agents  6   — in the storage units

The identity card I shipped the day before would have told the player "LIVES:
HOUSE 2 ON THIS BLOCK" while they stood in a shopping centre.

TWO ROOT CAUSES, not one:
  - **The housing list was wrong.** `RESIDENTIAL={suburb,gated,estate}`, while the
    district kit's OWN registrations say apartment, suburb and trailer are
    `category:'residential'` (bohemia_apartment.js:99, bohemia_suburb.js:308,
    bohemia_trailer.js:84). A hand-written list had drifted from the registry and
    was calling real apartment blocks and trailer parks uninhabited.
  - **The generator never asked.** agentsForPlot ignored the list entirely.

### 2. EVERY WORKER IN THE VALLEY LEFT THE WORLD AT 7AM
Agents have carried `job:{kind:'site', district, dir, dist}` since 7/19. They walk
out of their gate, `leaveGrid(a,'away')`, and cease to exist. Nothing renders
them, nothing puts them anywhere. **Half a journey has been simulated for two
weeks: they depart and never arrive.** So every workplace in the valley stood
empty all day while the sim insisted people were at it.

## WHAT I BUILT

**`workersForPlot` is `jobsNear` run backwards.** jobsNear looks from a home along
four compass rings out to radius 3, so the homes that can possibly send anybody to
a given cell are at exactly the twelve mirrored positions. Re-derive those blocks
from their own seeds, keep the agents whose job points back here, and stand them
in it.

**IT INVENTS NOBODY.** These are the same people, same ids, same seeds, same
identity keys — rendered where the sim already said they were.

    at home (20,5): 9 commuters -> H4-2/4090211328 H7-1/1124453376 H7-2/2165916928
    at work (20,3): 9 workers   -> H4-2/4090211328 H7-1/1124453376 H7-2/2165916928
    SAME PEOPLE ON BOTH ENDS: true

A visitor is a resident INVERTED in the sim: 'home' means gone from this grid,
'work' means here. Their `home.building` indexes another cell's buildings and is
never used against this one's doors.

## THE MEASURED RESULT

    census vs agents mismatches   52 of 58   ->   0 of 738
    residents (real ones)                          8,282
    workers who now actually arrive                2,306
    built workplace cells staffed                  110 of 370

ON THE REAL RUN, walking to the clinic west of the player's own house:
**29 people in it, 16 out in it right now, and SIX OF THEM ARE THE PLAYER'S OWN
NEIGHBOURS** — same identity keys as the residents of the home block. Ask a
neighbour their name in your street and you will know them at the clinic.

## THE HONEST TRADE
Cells holding people went 834 -> 731 (36% -> 32% of the valley). That is the lie
being removed: farm, storage, downtown, resort and the other non-job districts had
fake residents and now have nobody. Commercial went the other way — 683 fake
residents became 2,049 real workers. Net, the valley has more people in the places
people should be and none in the places they should not.

WHAT I DID NOT DO: expand `JOB_DISTRICTS` (commercial/industrial/medical/solar).
A FARM is obviously a workplace and the GDD treats farms as the valley's food
system, but adding one changes where every existing resident commutes and that is
a valley-wide behaviour change owned by WORLD, not a people fix. Flagged, not
taken.

RESEARCH THAT SHAPED THE DESIGN: in subsistence economies ~80% of labour is
subsistence agriculture and work is home-based or on family property; the
separation of home and workplace is an INDUSTRIAL phenomenon. So the right move
was never to invent a workforce for every district — it was to render the small
number of commuters the sim already had.

## GATE
`gates/people_gate.js` part D, 11 claims, driven on the real run through the run's
own loadCell. Two mutations proved it red-able: families moved back into the strip
mall (D1, D2 fail), and workers stopped arriving (D4, D5, D8, D9, D10 fail).

## WHAT COMES AFTER
1. **The roads are empty.** 568 arterial + 228 freeway cells = 35% of the valley,
   and there is not one person on any of them. Nobody is ever BETWEEN places. That
   is the next people-shaped hole and it is bigger than this one.
2. **JOB_DISTRICTS is four entries.** farm/storage/railyard/landfill/watertreat are
   workplaces with nobody working them. Needs WORLD, or a ruling.
3. **Sleeping arrangements outside housing are [PENDING Paolo].** Post-collapse
   people really do occupy commercial buildings — but as squatters or a compound,
   never as a nuclear family with bedrooms. The mechanism now says "no residents
   here"; whether a strip mall holds a squat is his canon, and the table is empty.
