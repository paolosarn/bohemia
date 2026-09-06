# NOBODY STANDS IN THE STREET ALL DAY — 8/4/26, PEOPLE lane

Five gates were red or crashing on main for their whole visible history. Fixing
the way they *look* at the world found two real bugs in the world itself.

---

## PART 1 — WHY FIVE GATES WERE DEAD

LIFE, DRESS, POPULATION, MEMORY (red) and DEVIATION (crashing outright, which is
worse: a crash asserts *nothing*). All five failed the same way — "0 agents
simmed", "0 distinct tops", "0 sightings", `Cannot set properties of undefined` —
and **nobody wrote bad code**.

    seed 7, occupiedRate 0.30   ->  6 agents in 19 homes
    seed 7, occupiedRate 0.038  ->  0 agents in 19 homes
    seeds 1..40 at 0.30         ->  40 populated, 0 empty
    seeds 1..40 at 0.038        ->  27 populated, 13 EMPTY

They were written on 7/19 when `OCCUPIED_RATE` was 0.30. At that rate every seed
and every plot came up populated, so "build one block at seed 7 and assert people
are in it" was a **safe bet and a fine fixture**.

On 8/1 the rate became **0.038** — not a guess and not a regression, but
arithmetic off Paolo's own question ("now we have the scale model, and on top of
it an apocalypse"): 2050 Vegas ~2.9 M, scale 1:78, GDD v5's ~3% survival =
**1,113 people in the whole valley**. That number is correct and it stays.

What it did was turn a safe bet into a coin flip. A 20-home block now averages
0.76 occupied houses — **empty is the modal outcome** — and seed 7 came up tails.

### This is not a licence to edit gates until they go green

That is the pre-named forbidden shortcut and it does not stop being one because
I think I am right. The test I held every claim to: **does the new claim assert
MORE?** A distribution claim pins *both* ends — the valley is mostly empty (the
die-off is real) **and** somewhere in it people are living (it is not dead-dead)
— and it cannot flip on which seed a scan reaches. The old claim could not tell
those two failures apart. Both directions are mutation-tested: at rate 0 the
fixture throws, at rate 1 the mostly-empty claim fails.

### And the trap one level down

The obvious fix is "scan for the first seed that HAS people and sim that one."
Measured, that is the same bug in a better disguise:

| seed | people | sightings | missing-persons answerable |
|---|---|---|---|
| 3 | 6 | 4 | **yes** |
| 9 | 6 | 8 | no |
| 21 | 6 | 4 | no |
| 39 | 6 | **0** | no |

Picking the lowest seed that passes **is** choosing the coin. Six people spread
over twenty-one houses genuinely may never meet all day, and that is the dead
world working. So the gates ask the **set**: 40 blocks, 825 homes, 91 people, 27
inhabited. `gates/bohemia_block_fixture.js` is the one fixture, and it **throws**
rather than hand back an empty a caller might sim in silence.

**And the four copies had already drifted.** `deviation_gate`'s door picker was
fixed on 7/31 to try SIDEWALK first — "a house fronting the walk found NO door,
its residents could never leave" — and the other three never got that fix. They
did not go red over it because they were simming nobody.

| gate | before | after |
|---|---|---|
| LIFE | 21 / **3** | **24 / 0** |
| DRESS | 42 / **2** | **46 / 0** |
| POPULATION | 5 / **3** | **10 / 0** |
| MEMORY | 7 / **2** | **10 / 0** |
| DEVIATION | **CRASH** | **12 / 0** |

---

## PART 2 — THE BUG THE BLIND GATE WAS HIDING

The moment POPULATION could see, it went from **0 spot checks to 1,905** and
failed on the first run. Not a fixture problem. A real one.

    H5-3   @111,18   wants 111,17   - held by H14-1
    H14-1  @111,17   wants 111,18   - held by H5-3

Two people who wanted to swap cells. Each one's next step was the other one's
body, so neither could move.

> They stood there **1,589 and 1,533 turns — over a game day each** — on walks
> home of 173 and 165 steps. Everybody else on the block walked home at exactly
> one cell per turn.

**And they both had somewhere to go.** H5-3 had 110,18 and 111,19 free; H14-1 had
110,17 and 111,16. It was not a one-wide corridor, it was an open street neither
of them ever looked at — because the blocked branch read:

    else a._path=null;      // blocked body: wait, replan next turn

and **the comment is what hid it**. Replanning changes nothing: `path()` is a
deterministic BFS over the *static* grid, so from the same cell to the same
target it returns the same route into the same body, forever.

### The fix is the route, not a rule about who yields

Replan with the other **bodies as walls** and take the detour. Deterministic
(same BFS, same occupancy), one step per turn, OCCUPANCY LAW intact because
`occFree` still guards the destination. No detour — a genuinely one-wide corridor
— falls through to the old wait, which is correct there.

    AFTER:  173 steps -> 173 turns.   165 steps -> 167 turns.

### It had to be carried to four files

The engine fix means nothing on its own: **four shipped slices inline that
function byte for byte**, including `slices/BOHEMIA_CITY_WORLD.html` — the walked
world, the surface the RUN tab opens. The sync gate does not police this module,
so nothing was going to notice. `tools/bohemia_walk_deadlock_patch.py` reads the
replacement **out of the engine at run time**, so it can never ship a slice a
version the engine does not have.

### I wrote the fix wrong the first time, and the new gate caught it

`a._path` and `around` are the same array, so `shift()` mutates both: reading
`around[1]` afterwards gives the cell **two ahead** — a two-cell teleport — and
crashes outright when the detour is one step long. `walk_deadlock_gate`'s
one-step claim caught it within the hour. That claim is why it is in there.

**The regression test makes Paolo the blocker**, because he is who will actually
do this: the player is parked on the agent's next cell *every single turn* and
the agent still has to arrive. OCCUPANCY LAW includes the player, so before this
fix, standing in a doorway froze a neighbour for the rest of the day.

---

## PART 3 — FIVE HAIRSTYLES NOBODY COULD WEAR

DRESS's freshness count was red at **231 banked vs 236 canon**. The bank was not
stale; **the parser was**.

(SUN CROP is DEAD as of 8/20/26 -- quoted here only as the row FORMAT.)
    {n:'SUN CROP',st:'canon',layer:'hair',lux:true,gen:...}
                             ^^^^^^^^^^^^ ^^^^^^^^

The clothing lane's 8/1 hair batch writes its tag *after* the layer. The
extractor allowed tags only *before* it. **SUN CROP, DUSK SHAG, TEMPLE TAPER,
ASH SWEEP and SALT CROWN** — five approved, shipped hairstyles — matched nothing,
were dropped in silence, and could never be worn by a single person in the
valley. Hair went 10 -> 15 items.

**A count is a smoke alarm, not a diagnosis.** The old check could say how many
were missing and never which. It names them now.

---

## WHAT SHIPPED

| | |
|---|---|
| gates repaired | **5** (4 red + 1 crashing) |
| new gate | WALK DEADLOCK, 23 claims, registered |
| new fixture | `gates/bohemia_block_fixture.js` (one canonical block, throws on empty) |
| real bugs found | the head-on deadlock; 5 unwearable hairstyles |
| bug found in my own fix | the two-cell teleport, by the new gate, same hour |
