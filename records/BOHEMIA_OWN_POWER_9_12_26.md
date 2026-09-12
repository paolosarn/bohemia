# YOUR OWN POWER IS YOUR WAY OUT (9/12/26, WORLD lane) — board row [own power]

Ship: `engine/bohemia_ownpower.js` (new), the walked surface, and
`gates/own_power_gate.js` (29 checks, registered as **OWN POWER**).
Tab: **CITY**, on the nightfall card beside the rent. Also in the demo.

---

## THE ROW

From the 9/5 generator-mafia research: the Lebanese families who built their own
rooftop solar were buying their way out of the block's owner.

> "a power building you place on your land takes you OFF the block's line: the
> monthly cut stops, your batteries are yours, and the faction that owned the line
> notices (a standing hit, a visit). This is what 'set up buildings and auto-mine
> batteries' (Paolo 9/5) means in the world."

## BOTH HALVES IT NEEDED WERE ALREADY BUILT, AND THIS IS THE JOIN

| what | who built it |
|---|---|
| living on a faction's ground costs a cut, billed per **block** you used | `[block rent]`, 9/12, FACTIONS |
| solar, the battery farm and the substation mint a battery a day | `[batteries mined]`, 9/11, this lane |

So going off the line is **not a new charge and not a new table**. It is the **same
bill with your own blocks taken out of it**: `used` goes in, a smaller `used` comes
out. `rentOn()` is never touched — it belongs to another lane and it is already
right.

**The block is the unit because the bill is.** `[block rent]` bills per block of a
faction's ground you used, so the thing that cancels a billed block has to be
counted in blocks too, or the two systems would be talking past each other. Two
generators on one block is one block.

## WHAT IT DOES, MEASURED ON THE WALKED SURFACE

```
ground he walked          Mob 1, Church 3, Cartel 2 blocks
rent billed               5 batteries
generators on his ground  3 Church blocks go off the line
rent billed now           3 batteries
```

**Two batteries a night that used to be theirs are his.** The card says so, above
the bill, because the good news about a bill belongs next to the bill:

```
3 blocks of yours run on your own power now, and it kept 2 batteries
out of their hands — Church noticed.
```

## THE LINE THIS ROW MUST NOT CROSS, AND DID NOT

"the faction that owned the line notices **(a standing hit, a visit)**."

- **The hit is a WEIGHT.** `bohemia_standing.js` ships `DEED_WEIGHT` empty and says
  why: what counts as a deed and what it is worth to whom is his.
- **The visit is an ENCOUNTER**, and the encounter director's tables are his.
- `[block rent]` made the identical call one row earlier, in its own words:
  *"Nothing here invents a standing change: what an unpaid debt does to how they
  FEEL about you is a weight, and weights are his."*

So the noticing is **real, named and said out loud** — the card tells him which
faction it was — and the size of the grudge and the knock at the door are left to
him. The gate asserts directly that this module writes no standing and calls no
encounter, and that `DEED_WEIGHT` is still empty.

**And it did not force the deed door.** `bohemia_standing.js`'s `witness()` needs
minds standing within sight and a `where()` for each. A faction knowing about its
own wire is not a person seeing you do something, and pushing it through that door
would be the exact mistake `[block rent]` wrote down about `payTo()`: using the
function whose **name** matches rather than the one whose **question** matches.

## THE SAVING IS ASKED, NOT CALCULATED TWICE

`saved()` runs the rent rule **both ways** — full `used` and discounted `used` — and
reports the difference. Whatever a fortress charges and however the thirds round,
that is the real number. Doing the arithmetic a second time here is how two systems
start disagreeing about what a battery costs.

And the discount **can never go below zero**: you cannot be off the line on more of
somebody's ground than you stood on, and a negative `used` would pay you rent.
Removing that clamp turns the gate red.

## ONE CHECK OF ANOTHER LANE'S THAT I BROKE, AND HOW

`faction_towns_gate.js` N12 pinned the literal string `rentOn(TURF_USED`. I now
hand `rentOn` a **discounted copy** of that map, so the variable at the call site
has a different name while the source of truth is still turf — and their check went
red on a claim that is still completely true.

Widened it to assert the same claim without pinning the name: the rent body must
still build its bill from `TURF_USED`, must still call `rentOn`, must still ask
`turfAt`, and must **still never mention `payTo`**. That last half is the one that
caught a real bug and it is untouched and still absolute — proved by putting
`payTo` back into the rent path and watching N12 go red again.

**This is fixing a ruler that got too literal, not loosening a check to make my own
work pass**, and the difference is written into the gate beside the change.

## PROOF

- `node gates/own_power_gate.js` → **29 passed, 0 failed**, registered, suite 594
- red both ways: let the discount go negative (which would *pay* him rent) →
  **1 red**; count plots instead of blocks → **1 red**
- FACTION TOWNS back to **81/0**, and N12 still goes red the moment `payTo` returns
- neighbours green: CENTURY STAYED 34/0, BATTERIES MINED 36/0, PARTIES MOVE 39/0,
  PURSE 28/0, DEMO BUILD 25/0, PAGES PUBLISH 18/0, GATE REGISTRY 6/0, ATTEMPT 15/0
- all eight of this lane's gates verified registered, read the way the registry
  checker itself reads the table, 0 rows invisible

Build stamp: **BUILD 9/12g - YOUR OWN POWER IS YOUR WAY OUT**
