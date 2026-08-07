# BOHEMIA — THE CANON CONSTANTS REGISTRY (8/5/26)

> "Think outside the box WE HAVE 11 months of forward motion work we need to complete
> Do what you have to do next and know what comes after"
> — Paolo, 8/5/26

Nothing here needs a verdict. **No number in this file is new.** Every one is copied from
a law or record that already said it, and the gate proves that on every build.

---

## WHY THIS FILE EXISTS — AND WHY THE MACHINE I PROMISED YESTERDAY DOES NOT

Yesterday's canon-rot audit proved every citation across 757 canon documents **resolves**.
I closed it by naming the next machine: proving those citations **agree** — that two live
files never state different values for the same canon quantity.

**I BUILT THAT SWEEP TODAY AND IT DOES NOT WORK. HERE IS THE HONEST RESULT.**

It swept fourteen canon quantities across every law and record and flagged **six
disagreements**. Every single one was a **false positive**, and each failed in a different
way:

| flagged | what it actually was |
|---|---|
| valley area: 18 different km² | Skyrim's 37, Valheim's 314, our roads 32.9, our on-foot 75.7 — **different subjects**, not conflicts |
| "FOUR currencies" vs three | a **questbook corpus quote** — `Q132.W1 FOUR DOORS, FOUR CURRENCIES, NO EXCHANGE RATE`, a studied quest from another game, not a Bohemia claim |
| 12% lit vs 15% lit | *"Claude recommendation (10-15% lit"* from 7/10 — a **pre-ruling recommendation**, correctly framed as historical |
| 12,288 vs 9,216 vs 3,072 steps | three **different measurements in one table** in the camp law: across Vegas, one rest's worth, and how far short you come up |
| tiles per side: eight values | unrelated grids — chunk sizes, sprite sizes, a 44px cell |
| district types: ten values | counts of different *subsets* across different dates |

**THE ROOT PROBLEM IS NOT THE REGEX. IT IS THAT PROSE NUMBERS ARE SUBJECT-BLIND.**
"37 km²" in one file is Skyrim and in another is our built area. No pattern can tell those
apart, because the difference is in the meaning, not the text. A gate built on that sweep
would cry wolf on every run, and this repo has already learned what a checker that cannot
tell a thing from a lookalike costs.

**SO THE GOOD NEWS FIRST: there are ZERO real numeric contradictions in canon.** Fourteen
quantities, 757 documents, six flags, all six explained. The numbers actually agree.

**AND THE FIX IS THE OPPOSITE OF A SMARTER SWEEP: DECLARE THE CONSTANTS.** A number that
is *declared* has a subject attached, so a machine can check it. A number that is merely
*narrated* never will. This registry is the declaration, and it is the same shape as the
answered-questions index — a machine-readable block plus a sweep — which is the one pattern
in this repo that has actually held.

## HOW IT STAYS HONEST

**Every row cites the file that already said it, and `gates/canon_constants_gate.js` reads
this block and proves the value is really in that file.** So the registry cannot drift from
canon: if a lane changes a locked number in its law, this file goes red until it is updated
to match — and if somebody edits a number *here* that the law does not support, it goes red
immediately.

**This registry is NEVER the authority.** The cited law is. This is an index, exactly like
`BOHEMIA_CANON_INDEX`. On any conflict the law wins and this file is the thing that is
wrong.

---

## THE CONSTANTS

```constants
CELLS_PER_SIDE | 96 | laws/BOHEMIA_ADDENDUM_THE_VALHEIM_SHAPE_8_4_26.md | districts across the valley, per side
TILES_PER_CELL_SIDE | 128 | laws/BOHEMIA_ADDENDUM_THE_VALHEIM_SHAPE_8_4_26.md | fine tiles across one district
FINE_TILES_PER_SIDE | 12288 | laws/BOHEMIA_ADDENDUM_THE_VALHEIM_SHAPE_8_4_26.md | 96 x 128, the whole valley's fine grid
METRES_PER_TILE | 0.75 | laws/BOHEMIA_ADDENDUM_THE_VALHEIM_SHAPE_8_4_26.md | real-world scale of one fine tile
VALLEY_KM2 | 84.93 | records/BOHEMIA_MAP_SIZE_VS_THE_REFERENCES_8_3_26.md | total valley area
BUILT_KM2 | 38.35 | records/BOHEMIA_MAP_SIZE_VS_THE_REFERENCES_8_3_26.md | of it that is built
ONFOOT_KM2 | 76.09 | records/BOHEMIA_MAP_SIZE_VS_THE_REFERENCES_8_3_26.md | of it you can put a foot on
STEPS_ACROSS_VALLEY | 12288 | laws/BOHEMIA_ADDENDUM_THE_MOBILE_CAMP_7_27_26.md | steps to cross Vegas
SECONDS_PER_STEP | 3.52 | laws/BOHEMIA_ADDENDUM_THE_MOBILE_CAMP_7_27_26.md | average, in-game
BEAT_SECONDS | 0.5 | laws/BOHEMIA_ADDENDUM_THE_ACTION_COST_SHAPE_7_31_26.md | the 120 BPM LAW's beat
BPM | 120 | laws/BOHEMIA_ADDENDUM_120BPM_FIRST_AND_THE_PERMISSION_PRESS_7_26_26.md | everything quantises to it
LIT_PERCENT | 12 | laws/BOHEMIA_ADDENDUM_TEN_YEARS_COLD_7_31_26.md | CLUSTERED POWER: the lit share, and it is OWNED
CURRENCIES | 3 | laws/BOHEMIA_ADDENDUM_THREE_CURRENCIES_CENTURY_7_26_26.md | resources, electricity, clout. no fourth thing
GENERATIONS | 3 | laws/BOHEMIA_ADDENDUM_ACT3_MOONSHOT_STRUCTURE_7_19_26.md | Animal / Human / Angel
```

Fourteen. Deliberately small: **only quantities that are LOCKED and UNAMBIGUOUS go in
here.** A number still under discussion does not belong in a registry that fails builds,
and neither does one whose meaning depends on context.

## MEASURED OUT OF THE RUNNING WORLD (added 8/7/26)

The block above is DECLARED and proved against the law prose that states it. That is half
the job, and on 8/7 I measured how much of the other half was actually being done. Check E1
claims "no shipped engine module contradicts a declared constant." What it does is match a
variable whose NAME equals a registry key, and the engine does not name things that way —
the valley's size is `OVER_N x TILE_FINE x CELL_M`, not `VALLEY_KM2`; the three currencies
are an array whose LENGTH is three, not a number `3`.

**Measured: 13 of the 14 constants had ZERO engine declarations for E1 to compare. It swept
112 modules and found two numbers, both of them BPM.** For everything that mattered the
check could not fail. **A check that cannot fail is worse than no check, because it reports
safety.**

**And the drift was real and already sitting there.** First run of the measurement tool
against the canon seed: `BUILT_KM2` measured **38.35** where this file declared 37.0, and
`ONFOOT_KM2` measured **76.09** where it declared 75.7. Not a bug in the engine — the map
has been GROWING since the 8/3 measurement (a dozen districts landed after it) and nothing
ever re-measured. Exactly the silent drift this registry exists to prevent, living inside
it. The three area rows above are now corrected to the re-measured values.

So the rows below are **GENERATED off the live engine** by
`tools/bohemia_canon_measure.js`, and the gate regenerates them and fails if the file
moved — the same "regenerating changes nothing" shape `gates/run_gate.js` uses on the run
slice. **These rows cannot drift, because nobody types them.**

```measured
# GENERATED by tools/bohemia_canon_measure.js -- DO NOT HAND-EDIT.
# Measured off the running engine at canon seed 7.
# canon_constants_gate.js regenerates this and fails if it moved, so these
# rows cannot drift from the world the way the hand-typed ones did.
CELLS_PER_SIDE      | 96       | engine/bohemia_overmap.js OVER_N, live
TILES_PER_CELL_SIDE | 128      | engine/bohemia_overmap.js TILE_FINE, live
FINE_TILES_PER_SIDE | 12288    | OVER_N x TILE_FINE, derived from live
METRES_PER_TILE     | 0.75     | engine/bohemia_overmap.js CELL_M, live
VALLEY_KM2          | 84.93    | buildOvermap(7) census: all 9216 cells x 0.009216 km2
BUILT_KM2           | 38.35    | census minus road/desert/rock: 4161 cells
ONFOOT_KM2          | 76.09    | census minus rock/water: 8256 cells
STEPS_ACROSS_VALLEY | 12288    | one step per fine tile, so === FINE_TILES_PER_SIDE
BEAT_SECONDS        | 0.5      | engine Heartbeat.MS_PER_BEAT / 1000, live
BPM                 | 120      | engine Heartbeat.BPM, live
CURRENCIES          | 3        | bohemia_engine.js CURRENCIES array length (structural, not live)
GENERATIONS         | 3        | engine Generations.GEN_COUNT, live
```

**THE ANTI-VACUITY RULE.** Every constant is either MEASURED above or EXEMPT with a written
reason, and the gate asserts the exempt set is EXACTLY those two. Nothing can join it
silently.

- **`SECONDS_PER_STEP`** — a design number in
  `laws/BOHEMIA_ADDENDUM_THE_MOBILE_CAMP_7_27_26.md`. The action clock in
  `bohemia_engine.js` spends time per ACTION, not per step, so there is nothing running to
  measure. Becomes measurable the day a per-step cost lands in code, and must be measured
  then. (This row's reason originally named the law only in words and cited no file, which
  failed W3 — the check demanding that every exemption name a real artifact. Fixed by
  citing it, not by loosening the check.)
- **`LIT_PERCENT`** — CLUSTERED POWER says 12% lit and OWNED. Neither `bohemia_overmap.js`
  nor `bohemia_world.js` exports any power/lit/grid accessor (checked 8/7), so the share
  cannot be counted off a real world. Whoever builds the power grid adds the accessor and
  moves this row into MEASURED.

**AREA TOLERANCE, STATED RATHER THAN HIDDEN.** The three area rows are held to ±5% of the
declared value, because a lane legitimately adding a district really does change the built
area and a strict equality there would cry wolf every time the city grew. The generated
block records the EXACT live number every run, so the tolerance hides nothing: it only
decides when a human has to come and re-measure.

## WHAT I LEFT OUT, AND WHY — SO NOBODY THINKS IT WAS AN OVERSIGHT

- **The phone's 390×844 and DPR 2.** Real and locked, but they live in the mobile render
  contract's own gates, which already check them on the real surface. Declaring them here
  would put two machines in charge of one number.
- **79 district types.** Correct today, but it is a *count of a growing registry*, not a
  constant — `district_registry_gate.js` derives it from the registry itself, which is the
  right way round. A constant that changes every time a lane adds a district is not a
  constant.
- **The act repair caps (~15% / ~33-40% / 80-100%).** Locked, but stated as ranges and
  explicitly directional. A range is not a value.
- **Every dial and every damage number.** NO DAMAGE BEFORE THE DIAL.

## WHAT THIS BUYS OVER ELEVEN MONTHS

Fourteen numbers that nine parallel sessions all depend on now have **one declared home and
a machine watching it.** The specific failure it prevents: a lane changes the valley size or
the beat in its own law, every other lane keeps building on the old number, and nothing
notices for weeks.

## WHAT IS STILL NOT SOLVED

**Prose-level semantic contradiction detection.** Not by me, and I now think not by a
regex at all. The finding above is the useful part: **it cannot be done by pattern-matching
narrated numbers, so do not spend a day trying.** If it is ever worth doing, the route is
more declarations — moving numbers out of prose and into blocks like the one above — not a
cleverer sweep.

## THE COUNT IS RIGHT AND THE CONTENTS ARE WRONG (8/7/26)

The find that only a NON-numeric check could make, and the reason Part C exists.

This registry declares `CURRENCIES 3`. The engine ships exactly 3. Every numeric check on
earth is green. But `laws/BOHEMIA_ADDENDUM_THREE_CURRENCIES_CENTURY_7_26_26.md` is LOCKED and
names them **RESOURCES / ELECTRICITY / CLOUT**, and `engine/bohemia_engine.js` ships
**ELECTRICITY / MEDICINE / CLOUT**.

`MEDICINE` is not one of the three. The law's clause 1 says "THREE CURRENCIES ONLY" and
defines RESOURCES as *physical goods — apple = food, duct tape = materials*; naming the whole
category MEDICINE narrows it to a single good. And the row above says, in words, "no fourth
thing."

**NOT FIXED HERE. Currency identities are CONTENTS-PAOLO'S**, and the change is a rename
inside another lane's module. So it is **RATCHETED**: the one known disagreement is named in
the gate, and C3 fails the moment a SECOND identity disagrees or the count moves. A known
violation that cannot grow beats a red gate nobody is allowed to clear, and beats a green
gate that cannot see the problem at all.

**[PENDING Paolo]** — either the engine renames MEDICINE to RESOURCES, or MEDICINE is ruled
canon and the law is amended. Proven by mutation that the gate goes green the moment the
engine renames it, so the fix is not blocked by the ratchet.

## HOW THE NEW HALF WAS VERIFIED — ELEVEN PLANTED MISTAKES

Green is not evidence. Every claim in Part W and Part C was mutation-tested:

| mutation | caught by |
|---|---|
| registry `BUILT_KM2` pushed outside the 5% area tolerance | W5 |
| a 15th constant with no measurement and no exemption | **W1 (anti-vacuity)** |
| the engine's valley shrunk to 64 cells a side | W5, W6 |
| somebody hand-edits the GENERATED measured block | W6 |
| a FOURTH currency lands in the engine | W5, W6, C2, C3 |
| **the engine renames MEDICINE → RESOURCES (the FIX)** | **nothing, correctly — the ratchet must not block the fix** |
| a SECOND identity disagreement (CLOUT renamed too) | C3, C4 |
| a measurement returns undefined | W4, W6, W8 |
| an exemption reduced to a genuine shrug | W3 |
| an exemption that is long and cites a file but names no expiry | W3 |
| an exemption reduced to a shrug — *first three attempts* | **nothing. My mutations were broken.** |

**THREE OF MY OWN CONTROLS DID NOT REPRODUCE THE FAILURE THEY WERE TESTING**, and that is the
most useful line in this file. The first *prepended* text to a long reason, making the string
longer; the second truncated a sentence but left both the expiry clause and the filename
intact; the third ran against a baseline that was already failing, so it isolated nothing.
Each time the gate looked either fine or broken for the wrong reason. **A CONTROL THAT DOES
NOT REPRODUCE THE FAILURE PROVES NOTHING** — and this is the third turn running that this
repo has paid to learn it, which makes it a pattern about how I write mutations, not about
any one gate.

**AND W3 CAUGHT ME.** Its first version measured only the LENGTH of an exemption's reason,
which a mutation showed is a bad proxy — a 121-character shrug passes. Rewritten to require
that a reason NAME ITS OWN EXPIRY (the condition that would make the row measurable) and cite
a real artifact, it immediately **failed on my own text**: `SECONDS_PER_STEP`'s reason
described its law in words and cited no file. Fixed the reason, not the check.

## GATE

`gates/canon_constants_gate.js`, registered as CANON CONSTANTS. **33 checks.** It proves every
declared value is present in its cited source, that every cited source exists, that the
registry declares itself subordinate to the laws, that no shipped engine module contradicts a
declared constant — and, since 8/7, that **every constant is measured off the RUNNING WORLD or
exempt with a reason that names its own expiry**, that the generated rows cannot drift, and
that the three currencies' IDENTITIES are watched and not just their count.

`tools/bohemia_canon_measure.js` does the measuring and is the single home for the BUILT /
ON-FOOT classification sets.
