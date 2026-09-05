# FOUR VERBS, THREE CURRENCIES, AND NOTHING IS FREE ANY MORE
# 9/5/26, WORLD lane. VAMILY [living costs] — BB-FOUR-VERBS-THREE-CURRENCIES.

> "battle brothers has 3-4 currencies too... how they manage it is superb."
> — Paolo, **9/4**

## WHAT IS SUPERB ABOUT IT, IN ONE SENTENCE

**YOU NEVER SPEND A RESOURCE. WHAT YOU DID SPENDS IT.**

In the game he named, nobody allocates tools from a menu. You fight and tools drain to fix
what broke. You walk and the men eat. There is no screen where any of it is managed, which
is the anti-spreadsheet answer he has been asking for since 7/26.

**MEASURED 9/4, BEFORE ANY OF THIS:** the only debit in the entire game was buying at a
market. Walking was free. Fighting was free. Holding ground was free. Asking was free.
Electricity had never moved. Clout had never moved in either direction.

## WHAT SHIPPED

| verb | currency | what the card says |
|---|---|---|
| `day:ate` | resources | the people who depend on you ate |
| `fight:plate` | resources | the plate you wore at the bell is spent |
| `night:power` | electricity | every lit circuit you hold burned one |
| `ask:leaned` | clout | you leaned on somebody |

All four post on the walked surface, through the hooks the game itself uses: nightfall, the
message combat really sends, the ask card's own function, and a sweep of the power grid.

**ONE VERB PER CURRENCY IS THE WHOLE DESIGN**, not a tidiness rule. It is the single thing
that makes the reference work: you always know what took it. Electricity has exactly one
verb and clout has exactly one, and the gate fails if either ever gains a second. Resources
carries two on purpose, because the apple and the duct tape are one bucket by his own 7/26
ruling.

**A FIFTH VERB IS REFUSED** (`NO_SUCH_VERB`), the same shape as the currency list refusing a
fourth currency. **AND THE AMOUNT CANNOT BE PASSED IN.** `upkeep()` has no amount parameter
at all: a caller that could pass 2 would be a door for a number nobody ruled. When he tunes
it, he tunes one line.

## THE RECKONING NAMES THE VERB, NEVER A CATEGORY

`-1 food` would be the failure. The card he already reads at the end of the day says **"the
people who depend on you ate"**, and a line he could not pay is coloured and reads **"and
you could not pay it"**, because running out is not an error — it is the loudest thing that
can happen on that card.

A verb that fired six times is **one line with a count**, not six lines. You can ask a lot
of people in a day.

## THIS IS WHAT A REAL DAY NOW READS LIKE, PHOTOGRAPHED IN THE DEMO

> The Meter Reader: COMPLETE (notable)
> **paid: 1 battery**
> the people who depend on you ate — *and you could not pay it*

You worked all day, you got paid the battery he ruled, and you still could not feed them.
**That is the economic crash simulator in three lines**, and it is the game's own identity
arriving on a card that was already there.

And with one lit circuit held, in the demo through the splash: **paid 1 battery, and the
night took it straight back for the light.** The loop closes on the first day.

## LAST ROUND SAID THERE WAS NO FIGHT HOOK. THERE HAS BEEN ONE SINCE 8/21.

My own handoff, written last round, says in plain words: *"there is NO fight hook on the
walked surface (measured: no FIGHT_DONE / bell event anywhere in it)."*

The hook is `BOHEMIA_CITY_COMBAT_END`. It has a consumer, a post-mortem and a patcher, and
it has been in this file for two weeks. The search looked for `FIGHT_DONE` and a bell, which
is not what the shell calls it, **found nothing, and reported the absence as a fact about
the game instead of a fact about the search.**

**A NEGATIVE RESULT IS A CLAIM ABOUT YOUR INSTRUMENT UNTIL YOU HAVE SHOWN THE INSTRUMENT
COULD HAVE SEEN A POSITIVE ONE.** Fourth time this lane has paid for it: the connector filter
that returned everything, the channel threshold that missed `#49512e` by one point, the walk
sweep that reported 0.0%, and now a hook that was never missing.

## AND THE ONE PLACE I REFUSED TO BUILD

`night:power` bills a lit circuit **you hold**. The power grid is real code and has been
since 7/20 — feeder-sized circuits, 12% lit, an OWNER stamped on every live one: settlement,
faction, network, solar_lone. **There is no `player` owner in it.** So today you hold nothing
and the night bills you for nothing.

The temptation was to bill him for the circuit under his own front door so the drain would
fire on camera. **That is inventing ownership to make a mechanism look alive**, which is
exactly the move that left an empty table behind a "built, wired and gated" pipe for twenty
days. Who holds what is BB-THE-NIGHT-EATS-POWER's ruling ("which circuits are his is still
his") and BB-TURF's. The moment either stamps a circuit `player`, this bills it, with nothing
else to change.

So the gate proves it **by mutation** instead: stamp one live circuit `player` in memory and
the same call must bill it. 0 before, 1 after.

## AND THE ASK POSTS BUT DOES NOT GATE, ON PURPOSE

The row's design says *"run out and they are done being asked"*. **Nothing in this game
credits clout.** A gate on the ask would take the 7/31 YOU HAVE TO ASK feature off the
surface entirely, on the first tap, forever. So the drain posts, the refusal is recorded, the
reckoning names it, and the access half waits for a clout faucet — which is not this row.

**AND THE SAME GAP ON THE OTHER SIDE, WRITTEN DOWN BECAUSE IT IS THE NEXT REAL THING:**
`buy()` debits the battery and **the good does not land in the purse as `resources`**. You
buy the rice and you do not have the rice. That is worth being exact about: resources are
not unreachable — LIFE+CITY shipped `engine/bohemia_production.js` this round and a placed
building yields one on the wake beat — but the SHOP, the thing the player actually uses on
day one, is a dead end. The purse has carried an atomic `convert()` since 7/31 and it has
never been called; a bag of rice for one battery is exactly
`convert(electricity 1 -> resources 1)`. **That is [rice clock]
THE-BAG-OF-RICE-IS-THE-TUTORIAL's row**, which is already on the board, and it is
deliberately not built here.

## A BUFFER EMPTIED WHERE IT IS READ INSTEAD OF WHERE IT IS FILLED

The day's spend list was cleared at nightfall, one line above the first drain. That was
correct while nightfall was the only writer, and **silently wrong the second a verb fired at
11am**: asking and fighting posted, then the reckoning wiped both before it drew the card. It
is cleared at `showWake()` now, and the gate pins it there in both directions.

## THE ASK DRAIN LIVES IN THE GENERATOR

The ask block on the walked surface is cut and re-inserted by
`tools/bohemia_city_asking_patch.py` every time it runs. An edit made only in the generated
copy is an edit the next run deletes. The drain went into the generator; the gate checks the
generator, not the copy.

## THE GATE — `gates/four_verbs_gate.js`, 32 checks, registered as FOUR VERBS

The table is frozen, a fifth verb is refused, the amount is out of the signature, one verb
per currency for electricity and clout, all four fire on the real surface through the game's
own hooks, the reckoning names every one, repeats are grouped, an ordinary night is one line
and not a wall, nothing stamps a circuit `player`, and the power mechanism is proved by
mutation.

**Proved it can go red**: deleting the fight post drops it to 28/4.

## VERIFIED

| | |
|---|---|
| walked surface | all four post; ordinary day is one honest line; no page errors |
| demo, through the splash, over HTTP | all four post and the card names all four; 1 battery earned, 1 burned on the light |
| gates | four verbs 32, purse 28, payday 37, day pays 18, asking 22, combat entry 26, demo blockers 22, placeholder 14, economy 13, demo build 25 — **237 checks, 0 failed** |

## WHAT IS STILL HIS

Every amount, after he plays to the end. Which circuits are his. What a failed job pays.
Whether battery sizes are denominations.
