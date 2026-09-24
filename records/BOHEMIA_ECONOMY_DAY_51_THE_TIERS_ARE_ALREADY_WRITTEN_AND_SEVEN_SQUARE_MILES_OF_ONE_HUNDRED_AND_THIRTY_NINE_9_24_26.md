# DAY 51 — THE TIERS ARE ALREADY WRITTEN, AND IT IS SEVEN SQUARE MILES OF A HUNDRED AND THIRTY-NINE

ECONOMY lane, VAMILY row `[thirty years after]` Q51. MODE: RESEARCH — DO NOT IMPLEMENT.
**Round one of two: school.** Claimed 9/24/26 `economy-vamily-knxaeh`, commit `38d218f`.

> **THE ROW, AS RE-AIMED 9/24b under rule 32(b):** *"the question is RECLAMATION: what a
> crashed region looks like when somebody reclaims it for economic use, thirty years on (which
> trades, which blocks, what gets techier first), measured; the floor is the start."* For
> DYNASTY `[the derive]` and WORLD `[future city]`.

---

## 0. FIRST: HIS RULING KILLED THIS LANE'S OWN ROUND 50 DELIVERABLE, AND THE REAL RECORD SAYS HE IS RIGHT

**Round 50 shipped two rounds ago arguing that our generational fold is a ratchet and that the
ruin needs a MISSING SUBTRACTION: districts stop being held, buildings step down a tier.**

**Rule 32(b), Paolo 9/23, says the opposite and says it plainly.** *"The game starts in the ruin
and the future gets better... reclaims parts of cities for economic purposes, more techy and
modern."* **The ruin is act 1's FLOOR, never a fall. Nothing decays below the start.** The
coordinator's *"dark streets are lost"* default is dead, and so is mine.

*** AND THE REAL RECORD BACKS HIM, BECAUSE A REAL CITY TRIED MY VERSION AND IT DID NOT WORK. ***
Youngstown's 2010 Plan was exactly the subtraction: **shutter the emptied neighbourhoods and
cut utility and city services to the abandoned streets**, moving people to the parts with a
future. **It failed on contact with people.** Nobody took the **$50,000** incentive to move.
About **1,500 demolitions** happened against an estimated **4,000 still needed**. Fifteen years
later the city is still vacant, still anemic, and the redevelopment that did happen **centred
on downtown and left the neighbourhoods exactly as they were.**

**So the thing that actually happens is not decay below the floor. It is a floor that stays a
floor, with a small piece reclaimed on top of it.** That is his sentence, measured, and round
50's deliverable was the plan a real city wrote and could not execute. **Round 50's
measurements all stand — ten of thirteen carry whole, every accumulator is `+=` or
`Math.max`, the fold is pure — and its recommendation was wrong.** The measurement was the
work; the recommendation was one step past it. *Same shape as round 38 and I did it again.*

---

## 1. AND THE TIERS ARE NOT EMPTY. THEY ARE WRITTEN, CORRECT, AND UNREACHABLE.

The row asks for the tiers *"the derive ships empty today"*. **Measured: they are not empty.**

    districtTexture(fold, districtId)
      invest <= 0   ->  'apocalypse'     "never touched: still ruined"
      invest 1 - 4  ->  'recovering'
      invest >= 5   ->  'modern'         "sustained investment"

Run on the real function: **0 gives apocalypse, 1 and 4 give recovering, 5 and 9 and 20 give
modern.** The threshold is **five**.

*** READ THAT AGAINST HIS RULING. THE FLOOR IS 'APOCALYPSE', IT IS WHERE EVERY DISTRICT STARTS,
NOTHING TAKES YOU BELOW IT, AND INVESTMENT IS THE ONLY THING THAT MOVES YOU UP. *** **That is
rule 32(b), written as a function, before the ruling existed.** Three tiers, a floor that is
the start, and better-with-investment.

**AND NOTHING CALLS IT.** `districtTexture` appears three times in the repo and all three are
the same export line (the engine and the two slices that inline it). **Zero callers.** And
nothing ever creates an `invest` choice either: the fold has a `case 'invest'` to receive one
and no code anywhere builds one. **Both halves are dead.**

**So the honest version of the row's premise is better than the row's: the derive does not ship
the tiers empty. It ships them written, correct, matching a ruling made weeks later, and
wired to nothing.** *Master section 0.FIVE, thirty-ninth instance.*

---

## 2. THE REAL RECORD: RECLAMATION IS A SMALL FRACTION OF THE GROUND

### DETROIT, AND THE NUMBER IS THE RATIO

    the reclaimed core, "greater downtown"        7.2 square miles
    the city                                      139 square miles
    ---------------------------------------------------------------
    RECLAIMED                                     about 5%

    vacant land, 2012                             40 of 139 square miles, about a THIRD

The 7.2 covers downtown, Corktown, Midtown, New Center, Woodbridge, Eastern Market, Lafayette
Park and Rivertown, and it is described in its own report as being **on a separate growth track
from the rest of the city** — *"the other 132 square miles"* remaining the open question.
Downtown rebounded after the 2013 bankruptcy while **vacant land, blight and no private capital
kept the other neighbourhoods out of it.**

**One block in twenty, thirty years on, with real money and a real bankruptcy in between.**

### YOUNGSTOWN, AND THE NUMBER IS THE LOSS

    population 1960                               166,689
    population 2010                                66,982
    ---------------------------------------------------------------
    LOST                                          about 60% in fifty years

And the same shape at the end of it: the redevelopment **centred on downtown and neglected the
neighbourhoods**, which continue with high unemployment, vacancy and crime.

**Two cities, two methods, one outcome: a small reclaimed core and a large floor that stays.**

---

## 3. WHICH TRADES, AND WHAT GETS TECHIER FIRST

**The documented Detroit answer is office work, and it moved into buildings that were already
standing.**

- **6,000 workers** moved downtown from 2010, into what the moves themselves called a **rising
  technology district**.
- The anchor building held a *"brainforce"* of nearly **4,000 technology and web-based
  workers**.
- Around it: a **graphic design firm** as anchor tenant of another old building, and **venture
  funding for start-ups** arriving the following year.

*** THE PATTERN THAT MATTERS FOR US: RECLAMATION REUSES THE STANDING BUILDINGS. IT DOES NOT
BUILD NEW ONES. *** The Compuware building, the Madison Building — old stock, re-occupied, and
the "techier and more modern" part is **what happens inside them**, not a new skyline.

**That is REUSE-FIRST, in the real world, as the shape of recovery** — and it is exactly what
our fold already carries, because `builds` never falls down. *The building surviving whole is
not the bug round 50 called it. It is the precondition for the only kind of recovery the record
actually documents.*

**The order, as the record gives it:** a big employer takes a standing building → the trades
that serve people follow (food, design, small services) → money for new ventures arrives after
the people do. **Nobody builds first. Somebody moves in first.**

---

## 4. WHAT NEVER COMES BACK

- **The population does not.** Youngstown is down 60% over fifty years and the plan to
  consolidate it failed; Detroit's 132 square miles are still the open question.
- **The old trade does not.** Neither city got its industry back. **What came back was a
  different kind of work in the same rooms.**
- **And the neighbourhoods do not, in either case.** Both cities' recoveries are described the
  same way by their own sources: downtown, and not the rest.

---

## 5. THE SHAPE (school; the number is round two)

> **THE TIERS ARE RIGHT AND THEY ARE THREE.** `apocalypse` → `recovering` → `modern`, floor at
> the start, investment the only lift. **That is his ruling, already written as a function,
> with zero callers.** The work is not designing it. It is calling it.
>
> **RECLAMATION IS A SMALL FRACTION AND THE RECORD IS BLUNT ABOUT IT.** About **5%** of
> Detroit's land is the reclaimed core; about a **third** was vacant. So `modern` should be
> rare, `recovering` uncommon, and `apocalypse` the great majority, thirty years on, **even
> when somebody with real money is reclaiming hard.**
>
> **RECLAMATION REUSES STANDING BUILDINGS.** A reclaimed block is an old block with different
> work inside it, and *"techier and more modern"* is the work and the light, not new towers.
> **`builds` carrying whole is what makes that possible**, so round 50's proposal to step tiers
> down would have removed the raw material of the only documented recovery.
>
> **AND THE BLOCKS THAT COME BACK ARE THE ONES BESIDE SOMETHING THAT NEVER LEFT.** Both cities'
> cores held an anchor through the worst of it. **Reclamation spreads from what was still
> running**, which is round 47's finding wearing another hat: in our valley the thing still
> running is the lit street.

---

## 6. WHAT THIS ROUND DID NOT DECIDE

- **Any number.** Round two costs the tiers: how much investment is a tier, how many blocks
  reach `modern` in an act, and whether the threshold of five is right against the 5% ratio.
  **Round 38 is why this line exists, and round 50 is why it is in bold**: that round measured
  correctly and recommended one step past its own evidence.
- **How much better act 3 gets.** Rule 32(b) says it out loud: **the manager's dial, in VOTE.**
  Not mine.
- **Whether a reclaimed block can slip back.** *"Nothing decays below the start"* forbids
  falling past the floor; it does not say a `modern` block can never become `recovering` again.
  **I am not assuming either reading.**
- **Anything about the demo.** Rules 14, 15, 18(b) unchanged. **Rule 32(a): nothing is forced
  and nothing happens in the first second** — nothing in this round asks for anything to fire
  at anybody. Rule 22 binds MAKING lanes and names twelve; ECONOMY is not one.

---

## 7. ROUTED

- **DYNASTY `[the derive]`** — ***the three tiers exist, they match his ruling exactly, and
  they have zero callers.*** `districtTexture`: 0 apocalypse, 1-4 recovering, 5+ modern. The
  work is wiring, not design.
- **WORLD `[future city]`** — **reclamation is about 5% of the ground and it reuses standing
  buildings.** A reclaimed block is an old block with different work in it. *"Techier" is what
  is inside, not a new skyline.*
- **WORLD / DYNASTY** — **nothing ever creates an `invest` choice.** The fold has a case to
  receive one and no code builds one, so the lift that moves a district up a tier does not
  exist yet at either end.
- **COORDINATOR** — **your 'dark streets are lost' default and this lane's round 50 deliverable
  are the same idea, and Youngstown tried it: services cut to abandoned streets, $50,000 to
  move, nobody took it.** His ruling is the one the record supports.
- **LIFE + CITY / FACTIONS** — **the blocks that come back are beside something that never
  left.** Round 47 already measured what is still running in our valley: the lit street.

---

## 8. THE GATE NOTE

**Pre-push pass**: economy, purse, payday, attempt, canon rot, demo blockers, language,
handoff. Results in the commit.
**Full suite: 107 red at `ad23d875`, mine are: none.**

**The project-level hole, instance 39.** These gates check that a part does what it says.
Nothing checks that two parts agree, that a part keeps working for as long as the game lasts,
that it is the right part to have, or that the parts form a loop that closes.

**This round's instance is the happiest one this study has found and it is still a defect: A
PART THAT ALREADY IMPLEMENTS A RULING MADE WEEKS AFTER IT WAS WRITTEN, AND HAS NEVER BEEN
CALLED.** `districtTexture` is three tiers with the ruin as the floor and investment as the
only lift, which is rule 32(b) exactly. **Nobody knew it was there** — not the coordinator who
wrote the dead default, not this lane when it spent a whole round arguing the fold could not
produce a ruin. *A gate that asked "which exported functions have no callers" would have put
this on somebody's desk long ago, and on this study's evidence it would have found `convert`,
`transferIn`, `relight`, `bohemia_lend.js` and this in one run.*

## 9. THE PROBE NOTE

**One thing I did right and it is worth writing down, because last round I did it wrong.** I
ran the three tiers on the real function across six values rather than reading the thresholds
off the source. **The source says `< 5` and I would have reported "under five"; the run says 4
is recovering and 5 is modern**, which is the same fact stated in a way a builder can use
without re-deriving an off-by-one. *Round 50's lesson applied one round later: read the
constant, then run it.*

---

*ECONOMY round 51, one of two. Research only. Nothing in the game changed.*
