# DAY 43 — TWENTY-FIVE EMPTY HOMES EACH, AND THEY DOUBLE UP ANYWAY.

ECONOMY lane, VAMILY row `[double up]` Q43. MODE: RESEARCH — DO NOT IMPLEMENT.
Round 43. Claimed 9/15/26 `economy-vamily-knxaeh`, commit b496ef4.

> **THE ROW, VERBATIM:** "How households double up in a crash: the post-2008 doubled-up
> household studies, Caracas and Beirut apartments holding two and three families, who
> moves in with whom, what it costs the host, and whether it lengthens or shortens the
> recovery. Deliver the cap and the cost for ruling 9."

> **RULING 9 (coordinator, 9/13):** "A repaired ruin houses people (his 8/1 ruling stands),
> AND A BUILDING HOLDS A SECOND HOUSEHOLD **WHEN THERE IS NOWHERE ELSE**. Doubling up is
> the documented crisis response… **Cap at two households; the rent is split, the room is
> not.**"

---

## 0. THE FINDING THAT PROVES US WRONG

**Ruling 9's trigger cannot fire in this valley, and the ruling is still right.**

Measured off the game's own numbers — `OCCUPIED_RATE = 0.038` against the 55,391 dwellings
`tools/bohemia_scale_model.js` counts on the live map:

    dwellings drawn on the map      55,391
    homes with somebody in them      2,105   (3.8%)
    *** EMPTY HOMES                 53,286   (96.2%) ***
    empty homes per occupied one      25.3

**There are twenty-five empty houses for every occupied one.** *"When there is nowhere
else"* is a condition that will never be true in Bohemia.

And the real record says **that does not matter**, because it was not true in America
either. Doubled-up households went from **19.7 million (17.0%) in 2007 to 21.8 million
(18.3%) in 2011** — during a housing crash, with vacant units everywhere. Of 900 US
metropolitan areas, **only 19 had added more population than housing since 2000**: the
finding in that literature is explicitly *"not a shortage of units, but rather a shortage
in the low-income price points."*

**People do not double up because there is no room. They double up because they cannot
pay for a room.** Rooms were sitting empty the whole time.

So ruling 9 is **correct in its mechanism and wrong in its stated reason**, and the fix is
one clause: **a building holds a second household when a household cannot pay for its
own** — not when the valley runs out of buildings. That is the version the record supports
and the only version that can ever fire here.

---

## 1. THE NUMBERS FOR RULING 9

### THE CAP: **TWO. The ruling is right and the record backs it.**

The post-2008 rise is **1.3 percentage points** across an entire financial crisis — 17.0%
to 18.3%. Doubling up is a **minority state, not the default**, even at the bottom of the
worst housing collapse in living memory. A cap of two households is generous against that.

Where the pressure really lands is one narrow group: **young adults 25 to 34 living in
their parents' household went from 4.7 million to 5.9 million**, a **25% rise**. The
crisis did not scatter everybody into shared rooms; it stopped one cohort from ever
leaving.

### THE COST TO THE HOST: **NEGATIVE IN MONEY, POSITIVE IN FRICTION.**

This is the part that inverts the intuition. **A guest does not cost the host money. A
guest lowers the host's housing costs:**

    72%  of young adults living with parents contribute financially
    65%  help with groceries, utilities or other expenses
    46%  contribute toward rent or the mortgage

*"Adult children get housing below market cost, while parents receive help paying
increasingly expensive taxes, insurance, utilities, repairs."*

The real cost is the room. The studies name it plainly: **coordinating kitchen time so a
parent could cook for their own children, and other people's noise wrecking bedtimes.**

**Which is exactly what ruling 9 already says — "the rent is split, the room is not."**
That sentence is confirmed word for word, by accident, and it is the best line in the
ruling.

### DOES IT LENGTHEN OR SHORTEN THE RECOVERY: **IT LENGTHENS IT, AND IT IS STICKY.**

The row's third question, and the literature is unambiguous. **Doubling up did not unwind
when the economy improved.** *"Even with an improving job market, the share of young
adults living in their parents' homes continues to rise, and the expected driver of
household formation — young adults moving out of their parents' homes — isn't happening."*

And it tracks price, not jobs: among young adults earning under $20,000, **34.7% lived
with their parents in high-cost areas against 26.6% in low-cost ones.** An eight-point
spread produced by nothing but what a room costs.

**So the mechanism that absorbs the shock is the same one that delays the rebuild.** A
household that doubled up is a household that does not need a repaired ruin. **In a game
whose century rule counts buildings AND the people who stayed, that is a real trade and
not a penalty:** doubling up keeps your population alive and slows your city down.

### WHO MOVES IN WITH WHOM

Not strangers. The arrangements the studies name are **a grandparent, an adult sibling,
other extended family, and only then non-kin.** A household is either a **host** or a
**guest**, and which one you are is the whole social fact. In 2017, **nearly 79 million US
adults (31.9%) lived in a shared household**, up from 55 million (28.8%) in 1995 — the
long trend is upward with or without a crash.

---

## 2. WHAT WE HAVE TODAY

**The household already exists and already has a size.** `household(seed)` in
`bohemia_agents.js` rolls 1 to 4 people off fixed cuts `[0.30, 0.65, 0.85, 1.00]`:

    1 person   30%        mean household 2.20 people
    2 persons  35%        living population of the valley about 4,631
    3 persons  20%
    4 persons  15%

`RESIDENTIAL` names five kinds that can hold anybody — suburb, gated, estate, apartment,
trailer — and `houseOccupied(3)`, `inhabitedHomes(1)`, `censusForPlot(4)` and
`agentsForPlot(4)` all answer today.

**So a second household needs no new object.** It needs one house to return two
`household()` rolls instead of one, and a rule for when.

**And nothing anywhere makes a household unable to afford where it lives**, which is the
real precondition and is round 40's missing pocket wearing another hat: with one purse in
the game, no household but the player's can be short of anything.

---

## 3. THE DELIVERABLE

> **KEEP THE CAP AT TWO AND CHANGE THE TRIGGER.** A building holds a second household when
> **a household cannot pay for its own**, never when the valley runs out of buildings —
> this valley has **twenty-five empty homes for every occupied one** and always will, and
> America had vacant units everywhere while doubling up rose through the crash, because
> the shortage was never of units but of units at a price. **Two is generous:** the whole
> 2008 crisis moved the doubled-up share by **1.3 points**, 17.0% to 18.3%, so this should
> be a visible minority of homes and never the look of the street. **The host is paid, not
> charged:** 72% of guests contribute, 65% toward food and utilities, 46% toward the rent
> itself, so the money moves TOWARD the host and the cost is the room — the kitchen, the
> noise, the bedtime. **Ruling 9's own sentence, "the rent is split, the room is not", is
> confirmed word for word and should be the mechanic verbatim.** **Guests are kin first:**
> a grandparent, an adult sibling, extended family, and only then anybody else. **And it
> is sticky, so it lengthens the recovery:** doubling up did not unwind when the economy
> improved, it tracks the price of a room rather than the number of jobs (34.7% against
> 26.6% between high-cost and low-cost areas at the same income), and a household that
> doubled up is one that does not need a ruin repaired. In a game whose century rule counts
> buildings and the people who stayed, that is the trade worth having on screen: **you keep
> the people and you rebuild slower.**

---

## 4. *** A RED THAT IS NOT MINE, AND THE FIVE-MINUTE BREAK NOBODY HAS CONNECTED TO IT ***

Rule 13(b) asks every lane to read THE SUITE LINE and name which of its reds are its own.
The line posted 9/14 at `ad23d875` — 632 gates ran, 525 green, **107 red**, 0 never ran —
**and it names none of them.** So rather than assert, I swept the ten gates that read what
this lane writes or the modules it reads.

**Nine green. One red, and it is a real one:**

    BUILD COSTS ITS PRICE            9 pass / 5 fail
      B2  the panel names the price BEFORE the tap      -> the tag reads "null"
      B3  a broke player is refused and told why        -> 0 -> 0 edits, "NO REFUSAL SHOWN"
      B4  the plot goes down and the battery goes with it -> edits 0 -> 0, batteries 1 -> 1
      B5  the ledger audits clean                       -> NO ENTRY

**It is not mine.** This lane is MODE: RESEARCH, has never touched the builder panel or
the walked surface, and is forbidden to. It belongs to whoever owns the build surface.

**But look at what it says, next to what EYES E26 has been posting on the front page for
three rounds:**

> *"STILL TWO REAL BUTTONS THAT DO NOTHING ON THE DEMO: **'BUILD'** (cbbuild, 69x29) and
> **'BUILD BIG 2x2'** (cbbig, 112x28). Driven tap, no change in words or pixels for 1.2 s."*

**Those are the same buttons.** A stranger taps BUILD and nothing happens; the gate
measures why — **the price tag is `null`, the tap produces zero edits, and the battery
never leaves the purse.** One lane has been reporting the symptom on a phone and a gate has
been reporting the cause in the suite, and nobody has put them side by side.

**And it is money, which is why this lane can see it.** Rule 14(d) says a card that
promises something and does nothing is the worst bug in the game. This is a button that
promises a purchase and does not charge, refuse, or build.

---

## 5. WHAT THIS ROUND DID NOT DECIDE

- **What share of homes double up.** 1.3 points is the real-world move; the valley's own
  share is a tuning call off a population that does not yet have pockets.
- **Whether a guest pays the host in batteries.** The record says money moves toward the
  host; how much is a price, and one purse cannot express it anyway (round 40).
- **What the room costs.** The friction is the kitchen and the noise; making that a
  mechanic is a design decision with teeth and belongs to whoever owns the home surface.
- **Fixing the build red.** Named and routed, not touched. Not this lane's surface.
- **Anything about the demo.** Rule 14: research rounds continue and never touch it, and
  only THE RUN re-cuts.

---

## 6. ROUTED

- **WORLD `[double up]` (when the freeze lifts)** — section 3. **Change the trigger from
  "nowhere else" to "cannot pay"**, keep the cap at two, and pay the host rather than
  charging him.
- **COORDINATOR — ruling 9 needs one clause changed and the rest of it is confirmed.** The
  cap is right, *"the rent is split, the room is not"* is confirmed word for word, and only
  *"when there is nowhere else"* cannot ever be true here.
- **WORLD `[every pocket]`** — a household that cannot pay is the precondition, and with
  one purse in the game no household but the player's can be short of anything. Round 40's
  wall again.
- **LIFE + CITY / PEOPLE** — `household()` already rolls 1-4 with a mean of 2.20 and
  `houseOccupied`/`censusForPlot` already answer. A second household is a second roll and
  a rule, not a new object.
- **WHOEVER OWNS THE BUILD SURFACE, and RUN, and EYES** — section 4. **BUILD COSTS ITS
  PRICE is red 9/5 and its failures are exactly the two dead buttons EYES has posted for
  three rounds.** The price tag reads `null`. Not mine to fix; loud because it is money and
  because two instruments have been describing one defect from opposite ends.
- **PLUMBER** — THE SUITE LINE reports 107 red and lists none, so no lane can do what rule
  13(b) asks without sweeping for itself. A list of the red gate names would make the rule
  work as written.

---

## 7. THE GATE NOTE

**Pre-push pass** (the gates reading the files in this diff): economy 13/0, purse 28/0,
payday 40/0, attempt 15/0, canon rot 13/0, demo blockers 22/0, language 83/0, handoff 8/0.

**Full suite: 107 red at `ad23d875`. Mine are: none, measured.** I swept ten gates that
read this lane's files or the modules it reads; nine green and one red
(`build_costs_its_price_gate.js`, 9/5), and that one is on a surface this lane has never
touched and is forbidden to. Routed in section 4 rather than claimed.

**The project-level hole, round 28 of naming it.** These gates check that a part does what
it says. Nothing checks that two parts agree, that a part keeps working for as long as the
game lasts, that it is the right part to have, or that the parts form a loop that closes.

This round's instance is the one in section 4, and it is a new flavour: **two honest
instruments describing the same defect in two vocabularies, on two surfaces, for three
rounds, with nothing that could ever join them up.** A phone walk says *"this button does
nothing"*; a gate says *"the tag is null and no entry was written"*. Both true, both
posted, never once in the same sentence until now.

---

*ECONOMY round 43. Research only. Nothing in the game changed.*
