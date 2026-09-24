# DAY 51, ROUND TWO — ONE FIFTH OF DETROIT, AND THE PLAYER IS NOT THE ENGINE

ECONOMY lane, VAMILY row `[thirty years after]` Q51. MODE: RESEARCH — DO NOT IMPLEMENT.
**Round two of two: the numbers.** Round one is
`records/BOHEMIA_ECONOMY_DAY_51_THE_TIERS_ARE_ALREADY_WRITTEN_AND_SEVEN_SQUARE_MILES_OF_ONE_HUNDRED_AND_THIRTY_NINE_9_24_26.md`.
Claimed 9/24/26 `economy-vamily-knxaeh`, commit `38d218f`.

> **WHAT ROUND ONE HANDED THIS ROUND.** The three tiers already exist and match rule 32(b)
> exactly: `apocalypse` at zero investment, `recovering` at 1-4, `modern` at 5 or more, with
> the ruin as the floor and investment the only lift. **Zero callers, and nothing anywhere
> creates an investment.** The real ratio is Detroit's **7.2 square miles of 139, about 5%**.
> **Round two costs it, and proposes no decay: rule 32(b) forbids falling below the floor.**

---

## 1. FIRST, WHAT A TIER IS KEYED BY, BECAUSE IT IS NOT WHAT I EXPECTED

`invest` is keyed by `districtId`, and I assumed a district was a named neighbourhood. **It is
not.** `districtsOf` returns **built overmap TILES** — `{x, y, kind}`, kinds like commercial,
suburb, apartment, substation, swapmeet, casino, park.

    built tiles per valley, mean of ten seeds        2,770
    of the overmap's total tiles                     9,216
    a tile, from round 46's measurement              96 m across

**So the tier is per built tile, and a valley has about 2,770 of them.** That is the
denominator this whole round needed, and getting it wrong would have made every number below
wrong by two orders of magnitude.

---

## 2. THE COSTING, AND IT ANSWERS THE ROW IN FOUR LINES

    Detroit reclaimed                     5.2%  of its land
    5.2% of 2,770 built tiles             144 tiles reach 'modern'
    at the shipped threshold of 5 each    720 points of investment
    ----------------------------------------------------------------
    A GENERATION'S GROSS WAGES            130 batteries

That last line is **DYNASTY's own number, not mine**: their `[days per life]` row says *"at
fifteen real minutes a day, a hundred hours is 400 days, about 130 a generation."* **It is a
PREMISE, and their row is still OPEN, so it has not been researched yet.** Everything below
moves with it if it moves.

*** SO REACHING DETROIT'S RATIO COSTS 720 AND A WHOLE GENERATION EARNS 130. ***

### AND THE REAL NUMBER IS WORSE, BECAUSE OF ROUND 49

Round 49 measured his day: **work pays one, food costs one, the loan asks one a night.** A day
of wages is a day of eating. **Net zero.** So 130 is his GROSS, not what he can spend, and the
only way any of it reaches a tile is by not eating or by earning some other way.

**Give him the impossible best case anyway — every gross battery to reclamation, eating
nothing for thirty years:**

    130 / 5                     =  26 tiles
    26 of 2,770                 =  0.94% of the valley
    against Detroit's 5.2%      =  18% OF THE REAL RATIO

*** SPENDING LITERALLY EVERY BATTERY HE EARNS IN A WHOLE GENERATION, AND STARVING, HE
RECLAIMS UNDER ONE FIFTH OF WHAT DETROIT MANAGED. ***

---

## 3. WHICH MEANS THE ROW'S REAL ANSWER: THE PLAYER IS NOT THE ENGINE

**And that is not a problem with the numbers. It is what the record says.**

Detroit's reclaimed core was not reclaimed by a person. **It was one employer moving 6,000
workers into standing buildings**, with a bankruptcy, a billionaire and a decade behind it.
Youngstown's was a city government with a plan and **$50,000 per household**, and it still
failed. **Nowhere in the record does an individual reclaim a district.**

> **SO THE PLAYER'S BATTERIES ARE A NUDGE, NOT THE ENGINE.** At the shipped threshold he can
> personally carry **a handful of tiles across a lifetime** — and that is the correct size for
> a man who earns one a day. **The bulk of `invest` has to come from the world: a faction that
> holds ground, a trade that comes back, an employer that moves in.** His five batteries on the
> block where he lives should be the thing that makes it *his*, not the thing that rebuilds a
> city.

**AND THE THRESHOLD OF FIVE IS DEFENSIBLE, SO LEAVE IT.** Five is **five days of a working
man's entire wage** for one tile. Big enough to be a real decision, small enough that a
determined generation moves a neighbourhood. *A different threshold does not fix the
arithmetic above, because the arithmetic is about who is paying, not how much.*

---

## 4. HOW MANY TILES GO MODERN IN AN ACT, THE HONEST RANGE

The row asks for the tiers as numbers. **Measured against the real record, per act:**

    'modern'      RARE. About 5% is what a real city with real money reached in thirty
                  years, so about 144 tiles of 2,770 is the CEILING, not the target.
                  The player's own share of that is a handful.
    'recovering'  UNCOMMON. Detroit's vacant land was about a third of the city and the
                  rest was neither reclaimed nor empty: standing, occupied, not renewed.
    'apocalypse'  THE GREAT MAJORITY, thirty years on, even when somebody is reclaiming
                  hard. This is the floor and rule 32(b) says it never drops below it.

**And the shape across the three acts: act 1 is nearly all floor, act 2 shows the first
reclaimed cluster, act 3 is the floor plus everything that was reclaimed and kept.** *How much
better is the manager's dial, in VOTE, and rule 32(b) says so out loud. These are the walls
the dial should sit between, not the setting.*

---

## 5. WHERE THE RECLAMATION SHOWS UP FIRST

Round one's record: reclamation **reuses standing buildings**, and it spreads **from something
that never left.**

> Our valley already has the "never left": **round 47 measured that one faction holds all the
> running water in every valley that has any, and that a plant runs only if the street it
> fronts is live.** **The lit street is the anchor.** The first tiles to leave `apocalypse`
> should be the ones beside it, and the kinds the record favours are the ones already in our
> tile list: **commercial and apartment near a live street**, not the estate on the ridge.
>
> **And nothing needs building.** A reclaimed tile is the same tile with different work in it,
> which is why `builds` carrying whole is the precondition and not the bug.

---

## 6. THE DELIVERABLE

> **THE TIERS ARE RIGHT, THE THRESHOLD OF FIVE IS RIGHT, AND NEITHER NEEDS DESIGNING. WIRE
> THEM.** `apocalypse` / `recovering` / `modern`, floor at the start, investment the only lift.
> **Zero callers today, and nothing creates an investment at either end.**
>
> **THE DENOMINATOR IS 2,770 BUILT TILES**, and a tier is per tile, not per neighbourhood.
>
> **DETROIT'S RATIO COSTS 720 POINTS. A WHOLE GENERATION EARNS 130 GROSS AND NETS ZERO.** Best
> case, starving, he reaches **0.94% of the valley, which is 18% of the real ratio.**
>
> **SO THE PLAYER IS A NUDGE AND THE WORLD IS THE ENGINE.** Most `invest` comes from factions,
> returning trades and employers. **His own five batteries make one block his.** That is the
> right size for a man who earns one a day, and it is what the record describes.
>
> **RECLAMATION STARTS BESIDE THE LIT STREET** and reuses what is standing. **No decay
> anywhere: rule 32(b).**

---

## 7. WHAT THIS ROUND DID NOT DECIDE

- **How much better act 3 gets.** Rule 32(b) names it: **the manager's dial, in VOTE.** Section
  4 gives the walls, not the setting.
- **Where the world's investment comes from.** That a faction or an employer pays most of it is
  the shape; which ones, and what makes them, is WORLD's and FACTIONS'.
- **Whether a `modern` tile can slip back to `recovering`.** Round one refused to assume either
  reading of *"nothing decays below the start"* and round two keeps refusing. **It is one
  sentence from him either way.**
- **The 130.** It is DYNASTY's premise off an OPEN row. **If their research moves it, every
  number in section 2 moves with it**, and this record says so on its face rather than burying
  it.
- **Anything about the demo.** Rules 14, 15, 18(b) unchanged. Rule 22 binds MAKING lanes and
  names twelve; ECONOMY is not one. **Rule 33 landed this round and gives this lane a new
  `[bb money]` row; it is not this row and it is not touched here.**

---

## 8. ROUTED

- **DYNASTY `[the derive]`** — **the denominator is 2,770 built tiles and a tier is per tile.**
  Detroit's ratio is 144 tiles and 720 points; a generation grosses 130. **The player cannot be
  the engine and the record agrees.**
- **DYNASTY `[days per life]`** — **your 130 is load-bearing for this whole costing and your
  row is still OPEN.** If it moves, section 2 moves. Flagged rather than assumed.
- **WORLD `[future city]`** — **most `invest` has to come from the world**, and reclamation
  starts beside the lit street and reuses standing buildings. The tile kinds the record favours
  are already in our list: commercial and apartment near live ground.
- **WORLD / DYNASTY** — **nothing creates an `invest` choice at either end.** The lift does not
  exist; the tiers that read it do. Both ends are one wiring job.
- **FACTIONS** — round 47's water monopoly is the anchor reclamation spreads from, by
  derivation. **One faction holds all the running water in every valley that has any.**
- **COORDINATOR** — **Q51 complete, both rounds.** The next OPEN lines on this lane are
  `[bb money]` (rule 33) and Q52 `[inherited trust]`, in that order.

---

## 9. THE GATE NOTE

**Pre-push pass**: economy, purse, payday, attempt, canon rot, demo blockers, language,
handoff. Results in the commit. **Canon rot's C3 red is the retired-lab and tileform rot this
lane sized and routed last round, proven on clean HEAD; not mine, named again so nobody reads
it as new.**
**Full suite: 107 red at `ad23d875`, mine are: none.**

**The project-level hole, instance 40.** These gates check that a part does what it says.
Nothing checks that two parts agree, that a part keeps working for as long as the game lasts,
that it is the right part to have, or that the parts form a loop that closes.

**This round's instance is an arithmetic one and it is new: TWO SHIPPED NUMBERS THAT CANNOT
BOTH BE SATISFIED, AND NOTHING CAN NOTICE.** The tier threshold says five points a tile; the
purse says a day of work pays one; the shelf says food costs one. **Each is correct, each
passes its own gate, and together they say a generation of unbroken labour reclaims under one
percent of the valley.** *Nothing in the suite multiplies one shipped constant by another and
asks whether the answer is a game.*

## 10. THE PROBE NOTE, AND IT IS THE ONE THAT SAVED THE ROUND

**I assumed a "district" was a named neighbourhood and nearly costed this whole row against a
denominator of about fifteen.** The measurement said **2,728 on seed 7**, which is more
districts than blocks — *an impossible shape, and that is what made me look.* They are built
overmap tiles. **Had I not checked, every number in section 2 would have been wrong by two
orders of magnitude and would have read perfectly plausibly.**

*The rule that caught it is the one this study keeps writing down: a number that disagrees with
the shape of the thing it describes is an instrument fault, not a finding.*

---

*ECONOMY round 51, two of two. Q51 complete. Research only. Nothing in the game changed.*
