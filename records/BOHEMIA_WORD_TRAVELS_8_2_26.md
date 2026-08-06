# WORD TRAVELS (8/2/26, PEOPLE lane) — and the two real bugs it found in an hour

Paolo, 8/2: *"honestly im lazy today. Think outside the box."*

## THE HONEST PROBLEM, AND IT WAS MINE

**Three turns of deep faction plumbing shipped and he had seen NOTHING.** People belong to
factions, reputation travels by witness and gossip, it decays, it crosses a generation —
all of it true, all of it invisible. The WORLD lane's 7/31 lesson applies here word for
word: *"a turn in this lane that has nothing to look at is a turn that missed."*

So: a page he taps and watches. **LIFE tab, top card, "WORD TRAVELS".** No decisions, no
thumbs, nothing to judge. It runs the **real engine modules, inlined verbatim** — not a
mock-up, or it would be a lie about the system.

| tap | what he sees |
|---|---|
| DO SOMETHING BAD | **8 of 18 people actually saw it.** Yellow rings. Nobody else knows a thing |
| A DAY PASSES | people wander, and whoever ends up together talks. Blue rings = heard it secondhand, worth less. **15 of 18 know by day 3**, standings slide COLD → HOSTILE |
| A GENERATION PASSES | **"Thirty years. Everyone who watched you is dead. 8 things died with them — nobody had ever repeated them. 7 survived, because people talked. Your kid now gets judged for it, and was not even born."** |

## THE DEED VOCABULARY WAS ALREADY HIS — NOTHING WAS INVENTED

I was about to propose a deed vocabulary from a blank page. **It already exists.** The quest
corpus carries **61 `@DO faction NAME +N` effects** across the studied questbook — per
faction, both directions, with real magnitudes, already authored and already studied under
QUEST STUDY LAW. That is the shape, and this page uses it. `DEED_WEIGHT` in the engine
still ships **EMPTY**; the page installs its two demo rows into its own copy only.

**REUSE-FIRST, third time today.** Colours were already chosen. Marks were already chosen.
The deed vocabulary was already written. *If you are about to invent something, grep first.*

## AND THEN IT FOUND TWO REAL BUGS IN AN HOUR — THIS IS THE POINT

**1. A DEED WAS BEING FORGOTTEN IN TWO DAYS.** On screen a serious wrong was worth **−0.05
after three days** and the whole system looked broken. Opinions were decaying on
`bohemia_memory`'s **sighting** half-life — twelve hours. Correct for *"did you see that guy
walk past"*, absurd for *"that man burned my neighbour's house down"*.
Grounded fix: routine observations fade on the ordinary curve, **significant events are held
far longer and more vividly** — the flashbulb asymmetry. A deed now carries **its own clock**,
three weeks base, scaled by how big the thing was. Sightings untouched.
Measured now: **−5.00 → −4.69 at a week → −2.88 at two months → −0.95 at six.**

**2. GOSSIP COULD NEVER FIRE.** `GOSSIP_WINDOW` was documented as a co-location window and
then used as a **staleness** window, making news untellable after **eighteen hours**. A
day-step is 1440 minutes, so on any normal clock **the module's entire third rule was dead.**
Split into `NEWS_LIFE` (a fortnight) and named for what it is.

> **BOTH BUGS PASSED EVERY UNIT TEST.** The decay tests asserted *"it went down"* — and it
> HAD gone down. The gossip tests all gossiped within minutes of the deed. **It took LOOKING
> at it.** That is the whole argument for building the visible thing, and it is the
> VERIFY-ON-THE-REAL-SURFACE law (7/18) arriving somewhere nobody thought it applied:
> not art — *simulation*.

## THE GATE

`gates/standing_gate.js` 29 → **35 claims, 11/11 self-test probes.** Three of the new claims
exist only because the demo found the bugs: *a serious wrong is still most of itself a week
later*, *news stays tellable for more than a day*, and *a bigger deed is remembered longer
than a small one*.

## WHAT COMES AFTER

1. **Nothing calls `witness()` in the real run yet.** The vocabulary now exists (the quest
   corpus) and the organ works. Wiring it is the next move and it is a RUN-lane coordination.
2. **Gap 5** — wearing another faction's colours.
3. **Gaps 6, 8, 9** — agendas, membership, internal politics.

---
*BOHEMIA — word travels — 8/2/26 — PEOPLE lane*
*Built the visible version because he had seen nothing, and it found two bugs the tests could not.*
