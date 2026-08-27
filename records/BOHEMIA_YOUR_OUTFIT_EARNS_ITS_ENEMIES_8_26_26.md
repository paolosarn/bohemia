# YOUR OUTFIT EARNS ITS OWN ENEMIES

**8/26/26 — FACTIONS lane. Record, not a decision.**

## THE RULING

> "custom is your own personal faction!!!!!! and you can imagine if you play the
> game with your custom faction the values arent just for you its for how your
> factions treated bro but u prob Already have that. But, yeah, for the other
> factions."

The turn before this one did the second half: the other outfits' canon wars
became real and started bending what things cost. It also put the word CUSTOM on
the card. But the standing was still a number about the player with his outfit's
name written beside it. **Nothing your outfit did ever became a fact about your
outfit.**

Canon had been asking for this in writing the entire time:

> "Player faction. No preset philosophy. **Identity emerges from three
> generations of action.**"
> — `BOHEMIA_faction_graph.json`, on Custom. `relations: {}`.

Empty because it had never acted.

## THE RULE: DAVIS 1967, WEAK STRUCTURAL BALANCE

The choice of theory *is* the design here, so it is worth being exact.

**Heider 1946 / Cartwright & Harary 1956** (strong balance): a signed triad is
stable when the product of its signs is positive. Four stable shapes. This
implies *the enemy of my enemy is my friend*.

**Davis 1967** (weak balance): drops exactly that assumption. The **only**
implausible triad is the one with **exactly two positive edges**. Everything
else is permitted, including all-negative.

And the data sides with Davis: triads with exactly two positive edges are
massively underrepresented in real signed networks, while all-negative triads
are *over*represented — which contradicts Heider directly.

So exactly one inference is licensed:

```
you    --(+)--> Cartel        you took their side, out loud
Cartel --(-)--> Remnants      canon, permanent war, written since before this lane
you    --(?)--> Remnants      POSITIVE here would be the one forbidden shape,
                              so it resolves NEGATIVE
```

**The enemy of my friend is my enemy.** That is all it says.

### AND THE ONE IT REFUSES, WHICH IS WHY WEAK BALANCE IS THE RIGHT THEORY

All-negative triads are permitted, so being at odds with somebody **never hands
you an ally**. A strong-balance implementation would have manufactured
alliances out of arithmetic. That is writing his lore for him, and it is the
single biggest thing this mechanism could have gotten wrong.

Gate claim H4 is that refusal, and mutation M1 (swapping in the strong-balance
inference) turns it red along with H8.

## WHY IT ATTACHES TO THE OUTFIT AND NOT THE PERSON

**Tirole 1996, *A Theory of Collective Reputations*** (Rev. Econ. Studies
63:1–22). A group's reputation is the aggregate of its members' track records,
and because any one member's record is observed only with noise, his incentives
are shaped by **the group's** past behaviour as well as his own.

The finding that matters for a game about three generations:

> "new members of an organization may suffer from an original sin of their
> elders long after the latter are gone."

In Bohemia that is not a metaphor. It is the save file. Your grandchild
inherits the enemies you made, and the board is where the heir finds out what
he was handed.

## HOSTILE AND WARM ARE NOT EARNED ON THE SAME TERMS

| | earned at | why |
|---|---|---|
| **hostile** | `sided` | Siding is public by this game's own definition — "Said in front of people. That is the whole mechanism and it is enough." The other side was already watching. |
| **warm** | `burned` | You have to have actually cost yourself something. |

Negative ties are sparser, more consequential, and more reliably transmitted
than positive ones. **The cheap half of this system only ever makes you
enemies.**

## AN EARNED ENEMY IS A REPUTATION, NOT A FINE

This is the half that makes it a system rather than a one-off charge.

`whoHears()` now asks `watchers()` instead of `ripples()`, which adds the second
reason an outfit finds out about something without a chain of housemates:

- **THEM** — canon says they hold a position on the outfit you are siding with.
  They have been watching *that outfit* for years.
- **YOU** — your own outfit is at odds with them. They have been watching *you*
  since the day you made it.

Measured: side with the Cartel, then commit to the **Church**, who the Remnants
have no quarrel with whatsoever. It still reaches the Remnants, and it costs
**4 against a flat 2**, forever.

And it is weighed by the right edge. `between(REMNANTS, Church)` is null and
would have charged flat — an earned enemy reading exactly like a stranger,
which is the whole thing quietly not working.

## THE BOARD — **RUN TAB**, chip in the topbar beside PHONE

Until now the game could show him **one stranger at a time** and nothing else.
There was no surface anywhere that answered "where does my outfit stand in this
valley", which is the question his ruling is about.

```
THE CUSTOM

CARAVANS                                    YOU MADE THIS
THEY HOLD IT AGAINST YOU
WHEN YOU THREW IN WITH THE CARTEL
You threw in with people they bury. Nobody told them; they were
already looking, and now they are looking at YOU.
WHAT THEY WILL STILL GIVE YOU: 4

REMNANTS                                    YOU MADE THIS
THEY HOLD IT AGAINST YOU
WHEN YOU THREW IN WITH THE CARTEL
...
```

`ALWAYS WAS` marks a position from his lore; `YOU MADE THIS` marks one this run
earned. The chip **rings** the moment a commitment makes an enemy, because he is
not going to open a panel on the off-chance.

The empty state is a real answer and teaches the system in one screen:

> NOBODY IN THIS VALLEY HAS A POSITION ON YOU YET.
> You have not thrown in with anybody far enough for it to reach the people
> they are at odds with. The day you do, this fills up and it does not empty
> again.

**Why a panel and not a phone screen:** the phone is an iframe loading
`BOHEMIA_CURRENT_SLICE.html`, another lane's file. ONE SYSTEM, ONE SESSION —
untouched. The board follows the city's own `#savepanel` / `#keypanel` pattern
and is registered in `OUTSIDE_PANELS`, so a tap outside closes it (Paolo 8/24).

## NOBODY IS BORN IN THE PLAYER'S OWN GANG ANY MORE

Measured, not suspected. A census of every base cell in the live world:

```
Cartel 1, Church 1, Colorful 1, CUSTOM 2, Homeless 2,
Network 4, Mob 1, Reds 2, Trades 2, Volunteers 1
```

**Two strangers were running with CUSTOM** — the outfit he named in capitals
with six exclamation marks, which the player has not formed, named, or recruited
one person into. They joined it the way anybody joins anything here: by living
near its base. Correct machinery pointed at the one outfit it must not touch.

Fixed at the **assignment**, never on the map. MAP LAW: the base stays exactly
where the run put it, because it is *your* base and it belongs there. It is only
removed from the list of outfits a stranger can be born into. The two went to
Colorful, which holds that ground; the total affiliated count did not move.

Recruiting is a different mechanism and this is not it. Somebody *choosing* your
outfit later is a thing you earn; spawning into it at world-gen is a thing
nobody chose.

## THE TEXT BUG, CAUGHT BY LOOKING AT THE REAL BOARD

The Caravans row read **"THEY TAX THEM"** — inherited from the Cartel's relation
with them. True, and about two other outfits. You did not tax anybody. An earned
edge keeps the canon label as provenance (the price comes off it) but the words
a person reads now describe the edge between them and *your* outfit.

Not visible in a diff. Visible in a board.

## STANDING FINDING, MEASURED AND NOT MINE TO FIX

The canon wars now point at outfits you may never meet. Population at each
faction base, in the live world:

| outfit | at | people in that cell | run with it |
|---|---|---|---|
| Anarchists | 7,0 | **1** | 0 |
| Blues | 46,3 | **1** | 0 |
| Remnants | 74,70 | **1** | 0 |
| Caravans | 22,12 | **2** | 0 |
| Mob | 22,52 | 3 | 0 |
| Custom | 24,39 | 15 | 0 *(correct — see above)* |
| Network | 16,58 | 15 | 2 |
| Colorful | 34,33 | 4 | 1 |

**Six of fourteen outfits have nobody at their own base, and for four of them
the cause is arithmetic rather than a bug.** With one or two residents in a
cell and an affiliation rate of 0.30, the expected number of affiliates is
0.3–0.6 — and they must then pick *that* base out of everything within
`REACH_CELLS` (12). Empty is the maths working.

This is a **placement/population** fact, not faction logic. `AFFILIATED_RATE`
and `REACH_CELLS` are marked `[PENDING Paolo]` and MAP LAW forbids me moving a
base, so this is recorded rather than fixed. The consequence worth naming: you
can now earn the Remnants as an enemy and never meet a Remnant. The board still
tells you they exist and that they are watching, so the system degrades into
a fact rather than into nothing.

## GATE

`gates/faction_between_gate.js` — **65 claims, 0 failed** (was 40). Parts H, I
and J are new; ten of them press the real commit button in a real browser at
390×844 and then ask the world what it became.

Eight mutations run:

| mutation | went red |
|---|---|
| strong balance instead of weak (enemy of my enemy becomes a friend) | H4, H8 |
| a warm edge earnable from a mere siding | H2 |
| earned edges checked before authored canon | H6 |
| earning made non-idempotent | H7 |
| the commit button stops calling `earn()` | J4, J6, J7 |
| NPCs allowed back into the player's gang | J8 |
| `whoHears` forgets who is watching *you* | I2, I3 |
| an earned enemy weighed by the wrong edge | I3, F2 |

### TWO OF MY OWN CLAIMS PASSED FOR THE WRONG REASON

Both found by mutation, which is the only reason they were found at all.

- **H2** asserted that a mere siding buys you no friends — *while siding with
  the Cartel*, whose canon positions are two hostile and one hands-off. No warm
  relation exists anywhere near them, so the claim passed no matter what the
  rule did. Deleting the burned requirement entirely left it green.
- **H6** asserted that an earned edge can never overwrite authored canon — and
  planted the earned edge on `CUSTOM|REMNANTS` while asking about
  `REMNANTS|CARTEL`. A different pair, so the fight never happened.

**A claim that cannot fail is not a claim.** Six of eight mutations bit
immediately; the two that did not were both the ruler being wrong, not the
target.

## Sources

- [Testing structural balance theories in heterogeneous signed networks](https://arxiv.org/pdf/2303.07023)
- [Partitioning signed networks](https://arxiv.org/pdf/1803.02082)
- [Signed Networks in Social Media](https://arxiv.org/pdf/1003.2424)
- [Tirole 1996, A Theory of Collective Reputations](https://academic.oup.com/restud/article-abstract/63/1/1/1545054)
