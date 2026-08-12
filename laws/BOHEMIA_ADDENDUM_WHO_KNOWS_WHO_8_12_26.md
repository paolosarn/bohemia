# BOHEMIA ADDENDUM — WHO KNOWS WHO (8/12/26, FACTIONS lane, LOCKED)

> **Paolo, 8/12: "do big brain online research if you need to then execute and have
> any questions on your task... Do what you have to do next and know what comes after."**

This is what came after, and this lane named it itself, yesterday, at the bottom
of `BOHEMIA_ADDENDUM_THE_SIXTEEN_INTRODUCTIONS_8_12_26.md`.

## THE HOLE

The sixteen introductions shipped with three earning conditions switched off. All
three failed for the same reason, and it is bigger than the introductions:

> **EVERY PERSON IN BOHEMIA WAS AN ISLAND.**

Four of his sixteen faction dossiers ask for a third party, and there was no such
thing as a third party anywhere in the game:

| | his canon, verbatim |
|---|---|
| MOB | "YOU ARE INTRODUCED, YOU DO NOT ASK... **a third person supplies it, and that person is vouching.**" |
| REMNANTS | "The first name is the thing you earn, and **it usually arrives from somebody ELSE** — you hear another soldier use it before they ever offer it." |
| COLORFUL | "Answer it well and **you are introduced onward to three people.**" |
| CARAVANS | "A caravanner who will not tell you their name and their run is **a caravanner nobody vouches for.**" |

## THE RESEARCH, BECAUSE HE ASKED FOR IT

**FELD 1981, THE FOCUSED ORGANIZATION OF SOCIAL TIES** (*Am. J. Sociology*
86:1015–1035). Ties are not random and they are not mostly about liking. They form
around **FOCI** — shared settings people are jointly organised around. Homophily
is largely an *output* of that structure rather than an innate preference: the
setting puts similar people in one room and the room does the rest. The more
restrictive the focus, the more segregated the network it produces.

**And this engine already stamped exactly three foci on every agent and had never
used one of them socially:**

- **HOME** — the house seat (`bohemia_people.seatOf`)
- **WORK** — the job site the generator scanned off the real overmap
- **FACTION** — the outfit (`bohemia_agents.factionOf`)

So no dice are rolled here that the world had not already rolled. This is the
authored-but-unread pattern again, one layer down: the data was there, nothing
read it.

**DUNBAR'S LAYERS** — support clique 5, sympathy group 15, affinity group 50,
active network 150, scaling ratio ~3. These are **ceilings**, and they are why a
focus cannot simply be a clique. Below its layer a shared setting really does
acquaint everybody (five people in a house all know each other). Above it the
graph **thins**, to a symmetric deterministic subset whose expected degree is
exactly the layer. Measured: 400 people in one outfit come out holding **49.1**
acquaintances against a layer of 50. Without this, 300 survivors would all know
all 300.

**VOUCHING IS A GUARANTEE, NOT A FLAG.** In the Russian thieves-in-law a candidate
is nominated by existing members acting as sponsor and "crowners", and the crowners
are **guarantors** of his reputation; joining the yakuza runs through an
introduction by an existing member who can vouch for you. A stranger's word is not
a vouch. So the person who introduces you to a Mob member must **(a)** be somebody
whose *name you already know* — they have to be a person to you, or nothing is
being staked — and **(b)** be *in that outfit*. That is what makes the Mob
genuinely closed instead of merely slower.

## THE LAW

**1. THE GRAPH ONLY READS.** `engine/bohemia_ties.js` never assigns anybody to
anybody. It reads three facts the world already decided and answers one question:
does A know B, and how. It has no roster, no name pool and no dialogue, and it
must never grow one.

**2. TIES ARE SYMMETRIC, ALWAYS.** A one-way friendship is a bug. The thinning
rule hashes the **sorted** pair, so the answer is identical whichever way round
you ask it. Gated across every pair on six real generated blocks.

**3. THE CEILING BINDS.** Dunbar's layers are not decoration. A focus below its
layer is a clique; above it, the expected degree lands on the layer. Both halves
are measured, not asserted.

**4. DERIVED, NEVER STORED.** The run throws every agent away on a save load and
rebuilds them from the seed. The graph is a pure function of the roster, so the
same block always comes back with the same web, on any device, forever.

**5. THE STRONGEST TIE IS THE ANSWER.** Two people can share a roof *and* a job
*and* an outfit. "How do you know them" has one best answer, and it is the roof.

**6. NO CACHE ON WHO SOMEBODY RUNS WITH.** The first version memoised the roster
on (length + cell). Allegiance also changes when a quest places its cast, so a
cached roster would hold a different opinion about somebody than the allegiance
line two rows above it on the same card. The cache was deleted rather than given a
cleverer key: **two systems disagreeing about one person is the bug this lane
keeps shipping** (8/11's card, 8/12's stale inline).

## WHAT IT UNLOCKED, THE SAME TURN

- **`vouch`** — the Mob. You cannot talk your way in. Somebody inside, whose name
  you earned, has to say yours. The card then prints **who** and **how they know
  each other**, because a vouch that does not name the person who staked something
  is just a flag flipping.
- **`overheard`** — the Remnants. Deliberately weaker, and the difference *is* the
  difference between the two factions: you only have to have **met** the other
  soldier, not to know what to call them. Overhearing costs the speaker nothing.
- **`onward`** — the Colorful. The three they can introduce you to are their three
  strongest real ties, counted and never named — you do not learn three strangers'
  names by being told they exist.

Seven of the eight earning conditions now answer. **`work`** (hire them twice) is
the last one, and it waits on the jobs/economy loop, which is not this lane's.

## THE HONEST LIMIT

**The roster is THIS BLOCK.** Two Mob members twenty cells apart are not
acquainted, because the run only ever materialises one cell of the valley at a
time. Household and job ties are unaffected — both are on-block by construction —
but a faction tie across blocks needs a valley-wide roster, which is a different
lane's world model and is not something to fake from here. Said out loud in the
module, in the gate and here, so nobody mistakes it for a fix.

## THE MACHINE

`gates/ties_gate.js`, 40 claims, built against the five ways this actually breaks:
a one-way friendship, everyone-knows-everyone, a vouch from a stranger, wired-by-
name-and-dead-in-fact, and inventing people. Part D opens the **real built run in a
real browser** and plays the whole Mob story through the real DOM: ask directly and
get nothing, earn a neighbour's name, watch that neighbour's word open the door,
and read the introducer off the card.

## WHERE HE LOOKS

**LIFE tab → WHO KNOWS WHO.** A real generated block drawn as a web, coloured by
which of the three settings made each tie; the Mob's own rule played out in three
steps by the real module; every person's foci and acquaintances; and the Dunbar
ceiling measured on the page at four outfit sizes. Nothing to tap, nothing to
judge, and he is never sent into the RUN app to find it.
