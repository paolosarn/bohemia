# THE FACTION DOSSIERS (8/2/26, PEOPLE lane)

Paolo's direct order, 7/31 lore sitting, recorded by the coordinator and filed as
backlog PEOPLE item 00 — the lane's top item:

> **"WE NEED TO REALLY FLESH THE FACTIONS OUT FR MAKE ALL OF THEM AWESOME AND
> INTERESTING"**

**SIXTEEN DOSSIERS, ALL OF THEM, ON ONE JUDGE SHEET IN THE LIFE TAB.** He said ALL
of them, so it is the whole canon roster and not the coordinator's shortlist of
seven: 13 selectable factions, the Karen community, the Amalgamation, and the four
social forces as one card.

---

## WHAT A DOSSIER IS

Every card is TWO blocks and the split is the whole point of the design.

**THE GREY BLOCK — ALREADY CANON, NOT UP FOR JUDGEMENT.** Alignment, act-1 and
act-3 power rank, canon relations, and the graph's own note, all **read out of
`engine/BOHEMIA_faction_graph.json` at generate time** ("All canon; nothing
invented", derived from GDD v2 section 9). It is never typed by hand, so a dossier
cannot quietly drift off canon, and the gate re-checks every line of it against the
live graph.

**THE GOLD BLOCK — MY PROPOSAL, HIS THUMB.** The nine rows his order asked for,
plus one this lane added because it already built the machine that needs it:

| row | |
|---|---|
| IDENTITY IN FIVE WORDS | the theme-sheet test: could a player describe them to another player |
| GROUNDED IN THE REAL | the actual social pattern, researched. Not vibes |
| TERRITORY + BASE | where they are |
| WHAT THEY TRADE / CONTROL | why anyone deals with them |
| HOW THEY DRESS | **approved wardrobe only** — his words |
| HOW THEY TALK | register, not lines. The lines are his |
| **WHEN YOU ASK THEIR NAME** | *added row, see below* |
| WHAT THEY WANT FROM YOU | the hook that makes them playable |
| THREE QUEST HOOKS | one-line premises. Not quests |
| THE LIFE LESSON UNDERNEATH | never preached |

---

## THE ADDED ROW, AND WHY IT TURNS A LIST INTO A SYSTEM

This lane shipped the ask-a-name machine on 7/31 off his ruling: *"you'll have to
ask everyone... then the game will track that so anytime you might see them in the
future their name will pop up."* Everyone starts as a generic faction identity and
a name is EARNED.

So every dossier answers **what happens when you ask a stranger of this faction
their name**, and no two answers are the same:

- **REMNANTS** — surname on the first ask, first name almost never; you usually
  hear it from somebody else first.
- **CARTEL** — they know YOURS before you ask, and you never get theirs. The
  mechanic running backwards.
- **NETWORK** — freely given, unprompted, warmly, on the first meeting — **and
  that is the tell.** Everyone else has to be asked.
- **HOMELESS** — they do not ask your name, they ask where you sleep.
- **MOB** — you are introduced; asking directly is the mistake.
- **CARAVANS** — name and route in one breath, because being known is their armour.
- **CHURCH** — they ask first, and they still have it a year later, in front of
  people.
- **VOLUNTEERS** — they never got round to asking. They ask what hurts.
- **TRADES** — you get a trade, not a name. *"Sparks." "Water."* Hire them twice
  and the real one arrives.
- **REDS** — the name comes with the terms, same sentence.
- **BLUES** — the group's name first, theirs last; gated by reputation, not
  conversation.
- **ANARCHISTS** — a chosen name immediately, the birth name never. Asking for the
  "real" one is the insult, and the game should let the player make that mistake
  once.
- **COLORFUL** — names both ways instantly, and the second question is who you came
  with. That question was the actual screening.
- **KARENS** — they ask your name **and write it down.** The one faction where
  being asked is the threat.
- **AMALGAMATION** — it knows every name and it is never the one speaking.

That is one mechanic reading fifteen different ways with no new code. It is the
difference between a list of factions and a system.

---

## THE RESEARCH, BECAUSE HE ASKED FOR REAL SOCIAL PATTERNS

Each faction is grounded in a documented real thing, the way the district hooks
were. The ones worth reading:

- **REMNANTS** — Rome's *limitanei*, and the Soviet garrisons of 1991: a military
  that outlives its state becomes a PLACE, not a power. And the honest ground for
  the canon line "specifically do not want to be a government" — **the moment you
  govern, you own the famine.**
- **MOB** — Mancur Olson's roving vs **stationary bandit**, and Tilly's
  state-making-as-organised-crime. That makes Mob and Cartel *the same violence
  with opposite time horizons*, which is the cleanest distinction available and
  costs nothing to play. **AND A HOLE PULLED IN THE VEGAS LEGEND:** canon keeps
  the early-police DNA, but the record disagrees with the folklore — 1974 saw more
  gangland killings in Vegas than the previous 25 years combined. What was
  genuinely true is narrower and better: they made promises BINDING in a business
  the courts would not touch, which is exactly the GUARANTOR seat the GDD already
  calls the scariest chair in the canon.
- **CHURCH** — the LDS welfare system: bishops' storehouses, a private trucking
  arm, supplies on the ground inside 24 hours. **It works because a congregation is
  a STANDING CENSUS** — when the phones die, the only working org chart in the
  valley is the one that met on Sunday and took attendance. Which is also the dark
  half: the census that finds the sick knows who is not attending.
- **VOLUNTEERS** — Quarantelli and disaster sociology: panic and mass looting after
  a catastrophe are largely a MYTH, prosocial mutual aid is the norm, and *elite
  panic* is the documented real failure. A valley made of factions needs this
  faction or it is telling a lie about people. Their untouchability is a market
  fact, not a moral one: everyone is one bad day from needing them.
- **BLUES** — Elinor Ostrom's Nobel work on commons governance, and Valencia's
  water court, which has met every Thursday for a thousand years. The canon
  "tactical liability" is real and specific: a water dispute can wait until
  Thursday, an ambush cannot.
- **HOMELESS** — the most literally true faction in the game. Vegas's real
  flood-channel population, already cited in this repo's own wash tilespec, and a
  culture organised around WEATHER LITERACY because the killer is water at 30mph,
  not people. Their resistance is **experience, not nobility** — they already
  survived losing everything once.
- **KARENS** — the joke name is hiding the most credible surviving institution in a
  Sun Belt valley. **An HOA is private government** with bylaws, dues, elections
  and lien power, ~60% of Las Vegas homes sit inside one, and a golf course is a
  **pre-built farm with the plumbing already in the ground.** The comedy and the
  competence are the same trait.
- **TRADES** — the hiring hall, and the fact that what fails in a collapse is not
  machines but MAINTENANCE KNOWLEDGE. Their neutrality grounded harder than "it
  costs them clients": *a plumber who serves one faction is a soldier.*
- **REDS** — R.A. Radford's 1945 POW-camp economy paper: a unit of account and a
  price system emerge in weeks with nobody creating them. A working price is
  INFRASTRUCTURE, and compound interest is patience with arithmetic bolted on —
  which is why they are the only faction whose plan gets stronger by waiting.
- **ANARCHISTS** — Occupy Sandy out-delivering institutional relief because it had
  no approval chain. And the reason they fall by act 3: a scene is a MOBILISATION
  technology, not a MAINTENANCE one.
- **COLORFUL** — the ballroom house system and the AIDS-era care networks. Canon
  ranks them 1 of 14 and that is CORRECT, not a slight: **power in this game is
  measured in things you can lose,** and a network of households cannot be found.
- **SOCIAL FORCES** — sorting under threat, not hatred first; prison sociology is
  the sharpest case. Which is exactly why canon's "larger in act one, fixed
  ceiling" is right — fear is a bull market in year one and a dead one by year
  thirty.

---

## WHAT THE DRESS ROWS ACTUALLY FEED — AN EMPTY SOCKET, NOT A NEW SYSTEM

`engine/bohemia_dress.js` already ships `FACTION_VETERAN_KIT = {}` empty, waiting
on his 7/21 ruling: *"veteran faction members actually have to wear most of the
clothes we give them."* Every dossier fills that socket with **128 garment names,
every one a real row in the 240-item canon wardrobe bank**, machine-checked against
it — and against its declared LAYER, which is how a typo got caught before it ever
reached a dossier.

**HIS SIX RULINGS ARE CARRIED VERBATIM AND CARRY NO THUMB.** Reds, Cartel, Church,
Mob, Caravans and Colorful were ruled on 7/21; they are parsed out of the live
module and printed as SETTLED. NOTES ARE RULINGS — asking him to re-confirm his own
words is not a question, and the gate fails if a ruled faction is re-proposed.

### THE COLOUR FINDING, MEASURED RATHER THAN GUESSED

The 7/21 dress pass ruled six factions and PARKED the other seven, in its own
words, because *"real color collisions turned up between them in review."* Nobody
ever went back. So this pass measured it, using the engine's own distance function
and its own 95-unit family tolerance, read out of the module so it cannot drift:

**THE MUTED CORPUS CANNOT CARRY THIRTEEN DISTINGUISHABLE FACTION COLOURS.** Every
dark muted candidate collides with the Cartel's oxblood — olive drab lands 39 units
away, field green 47, steel 78, khaki 80, all inside his tolerance. Moss green
collides with the Mob's mustard at 86.

So the proposal is **two colours, not seven**, and eleven factions identified by
SILHOUETTE instead — which is **STRUCTURE-NOT-COLOR (7/19)** doing exactly the job
that law exists for:

- **VOLUNTEERS → bone white `#d4d0c8`.** For a working reason: a medic must READ AT
  DISTANCE under stress, which is why the real convention is high-contrast
  off-white. Second job for free — white is the hardest thing to keep clean in a
  dust valley, so a clean Volunteer is announcing they have water to spare.
  Nearest ruled colour: the Church's gold at 116. Clear.
- **BLUES → cobalt `#326ed2`.** The wardrobe's only true saturated blue, so it
  cannot be confused with the denim everybody already wears, and blue reads as
  WATER, which is what this faction is. Nearest ruled colour: 184. Clear.
- **REMNANTS, TRADES, NETWORK, HOMELESS, ANARCHISTS, KARENS → deliberately NO
  colour**, each for a reason that is stronger than a hue:
  - Remnants: **everyone in America wears olive drab surplus.** A green shirt means
    nothing. What civilians cannot get is WEBBING.
  - Trades: canon says they never take a public position — **a faction colour IS a
    public position**, worn daily. They read by apron and tool belt.
  - Network: their tell is that their clothes are **INTACT** in a valley of
    patched ones. Expressed as a negative kit rule the existing machine already
    supports.
  - Homeless: a colour is a thing you chose.
  - Anarchists: refusing the uniform is the identity, and "no entry = free draw"
    is already exactly right.
  - Karens: an HOA has never had a team colour in its life. It has **STANDARDS.**

**AND ONE FINDING THAT IS HIS, NOT MINE, REPORTED AND NOT ENFORCED:** the Caravans'
tan `#caa05a` sits **76 units from the Church's vestment gold `#ffd75c`** — inside
his own tolerance, and both are `family` mode, so on a body there is nothing left to
tell them apart. (The Caravans/Mob overlap at 59 is fine: the Mob is `stripe` mode,
so pattern separates them.) The gate prints this every run and never fails on it,
because failing a build on his own ruling is not the gate's job.

**NAMED MECHANISM GAP, FLAGGED RATHER THAN FAKED:** the ROOKIE half of
dress-code-by-rank nudges an outfit until half the body reads the faction colour.
Six factions here have no colour, so the rookie rule has nothing to act on. If he
wants rank to read on a Trade or a Karen, the machine needs a second rookie mode —
a forbidden list rather than a colour. Small change, not a new system, and not
built without a ruling.

---

## THE BOUNDARY, NAMED HONESTLY

**BUILD THE WORLD (7/31) turned factions, quests and the economy OFF.** That ruling
and this order landed the same day, and they do not conflict once you read what each
one bans: the ruling bans MACHINERY (*"no standing ledger, no territory model, no
faction beats"*) and the order asks for LORE. But STOP PRODUCING (7/26) says finding
a legal way to ship a frozen thing IS the violation, so the boundary gets a machine
instead of a promise:

- **No new engine faction module.** The gate asserts the set is still a subset of
  what `build_the_world_gate.py` froze. It is currently EMPTY.
- **No quest content.** The three hooks per faction are one-line premises on a
  proposal sheet. **No `.bq` file is written, nothing in `questbook/` or `quests/`
  is opened, no placement and no payout table exists here** — and the gate greps
  the factory for those *as uses, never as mentions*, because Paolo 8/1: a checker
  that cannot tell a mention from a use is the broken one.
- **The factory writes to exactly two places** — `records/factions/` and the one
  judge sheet — and the gate checks that too.

**TWO CARDS DELIBERATELY CARRY NO HOOKS**, and say so on the card rather than
quietly shipping thin: the **AMALGAMATION** (the act-1 in-fiction names for the
haunting are explicitly PENDING PAOLO in the 7/24 ghost lock, so a hook would be me
inventing the vocabulary of the game's central mystery) and the **SOCIAL FORCES**
(canon says quests are built around them and that content is his to place).

**CUSTOM HAS NO DOSSIER AT ALL, ON PURPOSE.** Canon: no predetermined philosophy,
the player draws their own flag, identity emerges from three generations of action.
Writing that dossier would be me writing his character for him. The gate asserts the
absence *and* that a reason is recorded, so it reads as a decision rather than an
oversight.

**MARCO: THE RULING MOVED WHILE THIS WAS BEING BUILT, AND THE GATE MOVED WITH IT.**
I wrote the dossiers against *"MARCO IS NOT THE KING OF HOBOS LMAO"* — name-only, ask
never fill. Four hours later he re-stated Marco clean and it is canon now: *"Marco
hardcore realist and neighborly. Happy to help."* My first gate hard-coded the old
state, which is **A GATE OUTRANKING A RULING** (Paolo 8/1) — so it now READS THE LIVE
ADDENDUM instead of remembering a version of it, and enforces the part that is still
open: **HIS FACTION.** That same ruling says faction-or-unaffiliated is his call and
unmade, and a faction sheet is precisely the document that could quietly decide it. So
no dossier claims him, every line that names him says the faction is still open, and the
dead "king of the hobos" reading cannot come back. (The KING HOBO is separate, untouched
canon from GDD v2, reproduced and not developed.)

---

## THE GATE — 659 CLAIMS, AND IT SELF-TESTS

`gates/faction_dossier_gate.py`, registered in the suite as **FACTION DOSSIERS**.

Every selectable faction covered · every row answered and not thin · the canon graph
reproduced exactly · his six rulings carried verbatim and never re-asked · approved
wardrobe only, name and layer · **no purple anywhere** (purple is the Amalgamation's
alone, and pointing it at the Amalgamation's own protection layer would hand away
the act-3 reveal) · every proposed colour clearing the engine's own tolerance
against every other · the frozen machinery not grown · no dossier claiming Marco, checked
against the LIVE ruling rather than a remembered one · the
sheet reachable from the LIFE hub with thumbs, SUN MODE, a comment box and a .txt
export.

**IT SELF-TESTS WITH SIX PLANTED MISTAKES EVERY RUN**, each one somebody could
really make: a purple proposal, an invented garment, a colour that collides with a
ruled one, a ruling re-proposed for a thumb, an emptied row, and a card shipping
fewer than three hooks. **All six caught.** That proves the checker works rather
than proving the repo happens to be clean today — the lesson banked from the 8/2
fence-orphan gate.

**AND THE FACTORY REFUSES TO GENERATE** rather than emitting a lie: an unknown
garment name or one filed under the wrong layer stops the run with the reason. It
already caught one — `BLANKET SHOULDER ROLL` is `gear`, not `back`.

---

## VERIFIED ON THE REAL SURFACE

Real browser at 390x844, through the real door: splash tapped, **LIFE tab** opened,
top card is THE FACTION DOSSIERS. 16 cards on the sheet, a card opens to 25 rendered
blocks, a thumb moves the tally 0→1, SUN MODE flips the page to daylight, **zero
console errors**.

---

*BOHEMIA — the faction dossiers — 8/2/26 — PEOPLE lane*
*Sixteen proposals, nothing canon until he thumbs it, and one name mechanic reading*
*fifteen different ways.*
