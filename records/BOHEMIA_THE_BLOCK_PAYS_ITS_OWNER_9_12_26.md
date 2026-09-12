# THE BLOCK PAYS ITS OWNER
FACTIONS lane · VAMILY row `[block rent]` THE-BLOCK-PAYS-ITS-OWNER · 9/12/26

## THE ONE LINE
Every cell of this valley has belonged to somebody since `[who holds]`, and living
on their ground was free. It costs now, it is paid to a faction with a name, and
the faction that does not get paid cuts the lights.

## HIS RESEARCH IS THE SPEC
> In Lebanon and Iraq the faction that owns a neighbourhood's generator **charges
> every household on it monthly, by the ampere, sets the price, and cuts you off
> without warning**; it was 44% of an average family's income.
> (`records/BOHEMIA_COORDINATOR_RESEARCH_THE_GENERATOR_MAFIA_9_5_26.md`)

## MEASURED FIRST
`payTo(x,y)` has answered *"who do you pay for this block"* since `[light owners]`.
**It had exactly one caller in the whole game and it was a gate.** Nothing in the
product ever asked. Same shape as `formed()` in `[enemies unite]`: built, gated,
and never once called by the game.

## AND payTo IS THE WRONG DOOR FOR THIS
It reads the **grid**, and the grid only carries status on street cells. Measured
on the walked surface across 2,304 sampled cells:

    somebody to pay      831
    flagged free           6
    NOBODY                1467      <- including the block the player wakes on

The grid says who owns the **wire**. Turf says who owns the **ground**, for 100%
of the valley. Rent is ground, so rent asks turf.

## IT IS A TRANSFER, NOT A FIFTH VERB
The four verbs are frozen and the purse says so in its own refusal: *"a fifth is a
design change, and design changes are Paolo's."* The day-23 study is stricter
still: **"each resource is spent by exactly one verb, so you always know what
drained it"**, and electricity is already spent by `night:power`.

So rent is not a drain at all. **A drain consumes; rent moves, to somebody with a
name.** The purse has carried `transferOut` for exactly that since it was built,
posting kind `transfer` rather than `drain`, and nothing had ever called it. The
frozen four are untouched and a fifth is still refused by name.

## A FORTRESS CHARGES MORE THAN A CAMP, WITHOUT A PRICE NOBODY RULED
EVERYTHING COSTS ONE, so a fortress cannot charge a bigger number. What a bigger
operator really does is **collect on more of what you used**, and that scaling is
already in the file as his thirds. `DEPTH` is applied exactly the way `goodsFor`
applies it: to a **count**, through `Math.ceil`, never to a price.

    nine blocks of each        fortress bills 9    town bills 6    camp bills 3

**The honest limit, asserted rather than hidden:** at one block they all bill one,
because a third of one block rounds up to one. The tiers only separate once he has
walked more of somebody's ground, which is when it should matter.

## CUT OFF IS THE LIGHTS
The research says it literally: *cuts you off without warning*. `douse()` already
ships, already rides the save, and is already how the night's unpaid bill is
answered. One circuit per unpaid block, **on that faction's own ground**, so a
landlord darkens what a landlord controls and never a street belonging to somebody
you do owe.

**Nothing here invents a standing change.** What an unpaid debt does to how they
*feel* about you is a weight, and weights are his.

## DRIVEN ON THE WALKED SURFACE AND ON THE DEMO
Walked eighty cells across five factions' ground, then billed through the real
nightfall function, deliberately two batteries short:

    Blues    (town)     used 2   billed 2   paid 2
    Cartel   (fortress) used 2   billed 2   paid 2
    Church   (town)     used 4   billed 3   paid 3     <- the tier, visible
    Colorful (camp)     used 1   billed 1   paid 1
    Mob      (fortress) used 16  billed 16  paid 14    <- 2 short

    purse electricity   22 -> 0
    lit circuits       358 -> 356      the Mob cut two of its OWN streets
    ledger kinds       ["transfer"]    never "drain", and every entry names who got it

Identical on the demo. No page errors on either.

## WHAT HE READS AT NIGHTFALL
    you crossed Colorful into Mob into Church into Cartel into Blues
    Cartel land makes 1 battery a day off the dam
    Blues (town) took 2 batteries for the 2 blocks of theirs you used
    Church (town) took 3 batteries for 3 of the 4 blocks of theirs you used
    Mob (fortress) wanted 6 for the 6 blocks of theirs you used and you had 4
    so the Mob cut 2 of their own streets off

The first cut of those lines said *"1 of the 1 block"* and printed *"took 4 for 6"*
next to the shortfall. Both were what a machine says, not what a person reads.

## GATES
`faction_towns_gate` 81/0, up from 65 — extended, not duplicated. Sixteen new
claims: the ruling is carried not a price, a fortress charges more and does it by
billing more of what you used, the shares are his thirds off `DEPTH`, nobody is
billed for more than they used, the one-block limit is asserted so it is never read
as a bug, rent is a transfer and the frozen four are untouched, the ledger names who
received it, an empty purse refuses rather than going negative, the city bills after
the night's own bill, it counts blocks, it asks turf and never `payTo`, the cut-off
is the lights and only on that faction's ground, no standing is touched, the card
says it in words, and the tally resets at the wake.

Green alongside: turf 43/0, mandate 44/0, engine sync zero drift, demo build 25/0,
alpha loads 20/0.

**And one gate probe was mine, not the game's:** the first version of the turf-not-grid
claim ran a regex for "payTo ... rent" across the whole 4 MB page. That is string
arithmetic that can match anything, and it went red while the behaviour was correct.
It reads the two function bodies now. Fourth time this session a check was wrong
while the game was right.

## [PENDING Paolo] — NOTHING NEW
The row needed no ruling. Every number in it is his: one per block from EVERYTHING
COSTS ONE, and the tier shares from the thirds already in the towns module.
