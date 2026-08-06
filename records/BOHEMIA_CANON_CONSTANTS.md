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
VALLEY_KM2 | 84.9 | records/BOHEMIA_MAP_SIZE_VS_THE_REFERENCES_8_3_26.md | total valley area
BUILT_KM2 | 37.0 | records/BOHEMIA_MAP_SIZE_VS_THE_REFERENCES_8_3_26.md | of it that is built
ONFOOT_KM2 | 75.7 | records/BOHEMIA_MAP_SIZE_VS_THE_REFERENCES_8_3_26.md | of it you can put a foot on
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

## GATE

`gates/canon_constants_gate.js`, registered as CANON CONSTANTS. It proves every declared
value is present in its cited source, that every cited source exists, that the registry
declares itself subordinate to the laws, and that no shipped engine module contradicts a
declared constant.
