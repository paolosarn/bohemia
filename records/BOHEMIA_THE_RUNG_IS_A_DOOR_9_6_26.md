# A RUNG'S GRANT CAN BE A DOOR, AND THAT UNBLOCKS A TWO-MONTH PENDING
# 9/6/26, WORLD lane. VAMILY [rung unlocks] — BB-THE-RUNG-PAYS. **SHIPPED.**

> "The more the city backs you, the easier building becomes, even in areas whose local faction
> doesn't love you, because the whole city has your back."
> — Paolo, **6/30**, LOCKED

## THE LADDER EXISTED AND CROSSING A RUNG PAID YOU NOTHING

`engine/bohemia_mandate.js` has carried his three rungs since 8/11 — TERRITORY, MANDATE, MAYOR
— it is inlined on the walked surface, it has a real STANDING button, and its input is live.

And `canBuild()`, the function that decides whether the rung lets you build somewhere, has had
**zero callers in the game** since the day it was written. Only its own gate ever called it.
**Tenth time this lane has found a finished thing with a published seam and nobody calling it.**

## THE PENDING WAS ONLY BLOCKING BECAUSE EVERYBODY ASSUMED THE GRANT HAD TO BE A NUMBER

His addendum's own pending offers three shapes: *"cost multipliers? unlock tiers? restriction
removal?"*

**Two of those are numbers he has not ruled. The third is a door** — and the door is already
written, in the module's own header, in his own words: *you can build in a district whose local
faction does not love you, because the whole city has your back.*

A place you could not build in and now can is not a dial, and **NO DAMAGE BEFORE THE DIAL is
not violated by opening one.** So `GRANTS.MANDATE` ships. **MAYOR stays empty and stays his** —
what "governing" grants on an already-open map is a real design question with no default, and
`MAYOR_SHARE` is unruled anyway, so the top rung cannot even be reached. **Rung two does not
wait on rung three.**

## TWO THINGS WOULD HAVE SHIPPED WRONG. MEASURING CAUGHT BOTH.

### 1. A permit that asks only "do they love you" walls the player in on day one

**Measured before writing it: the player boots at share 0 with NOT ONE friendly faction.** That
is correct — standing comes from quests and no quest has run yet.

So a permit that simply asks whether the local faction loves you **refuses everywhere on day
one**, and takes the builder, the lights bill, and every row that needs a placed building down
with it. It would have shipped as a feature and read as a broken game.

**The answer was already a law: LIGHT=TERRITORY, and NOBODY PATROLS THE DARK.** A faction's
opinion can only stop you where somebody is actually standing. On a lit block they are
watching; in the dark there is nobody there to refuse you.

### 2. The first cut refused zero real builds

I asked whether the **plot's own cell** was lit. **It refused nothing.** The grid only lays
circuits along STREET cells, so a buildable cell is never lit itself — the permit was gating
only ground you could not build on anyway.

**A BRANCH THAT HAS NEVER EXECUTED IS NOT CODE, IT IS AN INTENTION**, and this one was one
button press from shipping as a feature that did nothing. It asks about the street the plot
**fronts** now — the same question [lights bill] answers, one round after that row paid for the
identical lesson.

## THE NUMBERS THAT MAKE IT A REAL DOOR

| | |
|---|---|
| buildable plots in the valley | **580** |
| gated at rung one | **63** |
| open at rung one | **89%** |
| after crossing to MANDATE | **all of them** |

**And the gated 11% is exactly the ground that fronts a lit street** — which is the only ground
that can hold a circuit, and therefore the only ground that pays a power bill and holds
territory. **The door opens onto precisely the plots worth wanting.**

## WHAT HE SEES

Press BUILD on a lit block at rung one:

> **Blues hold this block and the lights are theirs. You build where you are loved, and you
> are not.**

On the same line the price already speaks on, because he never digs. Cross his 49% and press
the same button on the same plot, and it goes down.

## THE GATE — `gates/rung_pays_gate.js`, 21 checks, registered as RUNG PAYS

The grant exists and is a door not a dial, it cites his addendum as its source, MAYOR and
TERRITORY still answer NO_RULING by name, `MAYOR_SHARE` is still null, his 49% is used as
given, the rung is derived so losing a faction drops you with no demotion rule — and then on
the real surface, **through the real button**: the player boots with nobody on his side, 89% of
buildable plots are still open, a real count is gated, the build is refused and nothing goes
down, the refusal names the holder, crossing the share reaches MANDATE, and **the same button
on the same plot then builds.**

**Proved red both ways**: remove the permit from the buttons and 2 checks fail; empty the grant
and 3 fail.

**And one of my own checks measured the wrong population first** — it asked what share of *all
cells* were open (86%) when the question is what share of *buildable plots* are open (89%).
Streets, mountains and water are ground he could never build on at any rung, so counting them
answers a question nobody asked.

## VERIFIED

| | |
|---|---|
| walked surface | refused at TERRITORY with the reason in words; built at MANDATE on the same plot |
| demo, through the splash | identical — 63 of 580 gated, Blues refuse, MANDATE builds |
| gates | rung pays 21, mandate, turf 23, faction towns 33, roads are fast 17, lights bill 30, four verbs 32, payday 38, purse 28, day pays 18, economy 13, demo blockers 22, demo build 25 |

## WHAT IS STILL HIS

What rung three grants. `MAYOR_SHARE` — *"enough done, enough love"* is not a number. Whether
49% stays. Whether a faction that loves you should open its lit ground at rung one for reasons
other than standing.
