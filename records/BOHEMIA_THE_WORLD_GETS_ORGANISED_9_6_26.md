# THE WORLD DOES NOT GET STRONGER, IT GETS ORGANISED
# 9/6/26, WORLD lane. VAMILY [enemies unite] — BB-COALITION. **SHIPPED.**

> In its late-game crises, factions that normally fight each other STOP. Orcs and goblins
> combine and appear in mixed units; the ancient dead, necromancers and wiedergangers,
> normally independent, combine. **NOBODY'S STAT BLOCK CHANGED. THE RELATIONSHIP GRAPH DID.**
> — the row, on the best escalation mechanic in the game he named

## SO ESCALATION IS A GRAPH EDIT, AND THE MODULE HAS NO NUMBERS IN IT AT ALL

The condition is pure graph and needed no ruling:

> **A and B are hostile to EACH OTHER in his own authored relations, AND both are hostile to
> YOU.** Then they stop spending it on each other.

Every term already existed. `engine/bohemia_between.js` carries his 14-faction graph with
directional labels and signs — permanent-war, prey-tax, preyed-taxed, hands-off,
professional-respect. The player's standing is the cross-quest ledger, and **quests really
write the negative side**: `faction REMNANTS -6`, `faction MOB -5`, `faction BLUES -6`,
`faction REDS -6` are live lines in shipped quests, so a player really can make enemies.

## THERE IS NO THRESHOLD, ON PURPOSE

The obvious version is *"when N factions hate you"* — and **N is a number nobody ruled.**

The pairwise version needs none. Two outfits who hate each other and both hate you have a
reason to stop, and that reason is **a fact about the graph rather than a dial.** The gate
holds the file clear of one: the only comparison in the logic is against zero, which is the
*sign* of a standing rather than a size of one.

**NO DAMAGE BEFORE THE DIAL is not a blocker here, it is the specification.** Nothing changes
anybody's strength — only who is pointing it at whom.

## DERIVED, NEVER STORED

Ask again after you make peace with one of them and the coalition is simply not there. **A
stored coalition would have needed a dissolution rule** and would have sat formed forever the
first time somebody forgot to write one. Same anti-stuck design as the mandate rung.

And **his graph is intact underneath**: the feud is suspended, never deleted. `between()` still
reports Cartel/Remnants as `permanent-war`.

## WHAT HE SEES

On the STANDING card he already opens, directly under WITH YOU because they are the same
question with opposite signs:

> **AGAINST YOU** — Cartel + Remnants
>
> *They were enemies. They have stopped, and that is about you. Nobody got stronger; they just
> are not spending it on each other any more.*

Silent on a clean run. Make peace with one and the line goes away.

## THE MEASUREMENT THAT CHANGED THE BUILD

His authored `PAIRS` table is **five pairs, and only two of them are hostile** — Caravans
versus Cartel, and Cartel versus Remnants. Both involve the Cartel. So a coalition read off
canon alone could only ever be one of two.

**A first cut that read `PAIRS` only would have shipped a mechanic capped at his starting
graph, which is exactly backwards**: the world getting organised is supposed to happen
*because of what you did*. `between()` has always also served feuds the player **earned** in
play, and `allEarned()` enumerates them. Earned feuds count, and the coalition grows with the
run.

**How many pairs are hostile is CONTENTS.** More are his to author; the mechanism does not
care how many there are.

## THE BUG THAT NEARLY SHIPPED IN SILENCE

The module resolved `BohemiaBetween` **at load time**. Measured: **zero pairs on the walked
surface while node saw five.** The city inlines modules in an order this file does not
control, so at the moment it was evaluated `BohemiaBetween` did not exist yet and it bound
null — forever.

Nothing threw. It reported *"no coalitions"*, **which is indistinguishable from a peaceful
valley.** It binds when it is asked now, never when it loads.

Same class as the temporal-dead-zone trap the towns seats hit one round ago: **ask for a
neighbour when you need it, not when you load.** The gate catches it — put the early binding
back and four checks go red naming the zero.

## AND A LINE ON THAT CARD HAD GONE STALE, BY MY OWN HAND

The STANDING card said:

> *Nobody holds this ground yet. No faction has claimed this district, so there is nobody here
> to ask.*

True when it was written. **False since BB-TURF shipped**, because every one of the 9,216 cells
in the valley now has a named holder. A card telling him nobody is here **while a faction is
refusing him a building permit two taps away** is worse than a card that says nothing. It names
the holder now: **THIS GROUND — Church.**

## THE GATE — `gates/coalition_gate.js`, 28 checks, registered as COALITION

No threshold in the logic, no damage, no stored flag, `COALITIONS` ships empty, his pact wins
whatever the standings say, one enemy is not a coalition, two who also hate each other are,
the label comes off his own graph, peace dissolves it, a stranger is not an enemy, the feud
survives underneath — and on the walked surface: the module can see his graph from there, the
card names them, and it says what it means without claiming anybody got stronger.

**Proved red three ways**: loosen the condition to one enemy and 7 fail; bind `between` at load
time and 4 fail naming the zero; the stale-line check fails if that sentence comes back.

## VERIFIED

| | |
|---|---|
| walked surface | clean run silent; two enemies unite; card names them; peace dissolves it |
| demo, through the splash | identical — 5 pairs seen, Cartel + Remnants, same words |
| gates | coalition 28, rung pays 21, mandate 33, turf 23, faction towns 33, roads are fast 17, lights bill 30, four verbs 32, payday 38, purse 28, day pays 18, economy 13, demo blockers 22, demo build 25, deed bridge 27 |

## WHAT IS STILL HIS

Who allies with whom, and when — `COALITIONS` is the one-line door and it ships empty. How many
of his factions are enemies at all. What a coalition should *do* beyond pointing the same
strength at you, which is a design question and not a default.
