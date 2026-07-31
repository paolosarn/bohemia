# BOHEMIA — THE ANSWERED QUESTIONS INDEX (7/31/26)
# THE REGISTRY OF THINGS PAOLO HAS ALREADY RULED, AND MUST NEVER BE ASKED AGAIN.

> "BROTHER FOR BOHEMIA ITS NOT A ONE LIFE RUN IVE ANSWERED THIS LIKE 50 TIMESS!!!!!"
> — Paolo, 7/31/26

## WHY THIS FILE EXISTS

Twice in two turns I ended a reply by asking him a question **canon had already
answered**:

1. *"When a utility dies, does it disappear or does it get an owner?"* — settled by
   the CLUSTERED POWER law (the lit ~12% is OWNED) and LIGHT = TERRITORY.
2. *"In a roguelite, what happens to standing when the run ends?"* — settled in at
   least five law files. **Bohemia is not a one-life run. It is a DYNASTY.**

Each of those cost him a reply and got a "wtf" and a "50 TIMESS". The autonomy
doctrine already requires every turn to end with a JUDGE THIS list; **nothing in
the machine checked whether the questions on it were real.** A settled question is
worse than no question: it taxes the one human this whole apparatus exists to
protect, and it makes him re-litigate his own canon.

`laws/BOHEMIA_ADDENDUM_NOTES_ARE_RULINGS_7_19_26.md` said never make him
re-confirm his own **words**. This file extends that one step further: never make
him re-confirm his own **laws**.

**MECHANISM-MINE / CONTENTS-PAOLO'S applies to this file too.** I do not decide
what is settled. Every row below cites the ruling that settled it, and a row
without a citation is not a row.

## HOW IT IS ENFORCED

`gates/answered_gate.py`, registered in the suite as ANSWERED. It reads the
machine-readable block below, then sweeps the handoff, the backlog and `records/`
for question-shaped text. **A question that matches a settled topic fails the
build.** Not a warning — a red gate, because a promise to remember is exactly what
failed twice.

The gate deliberately does NOT try to understand questions. It matches trigger
phrases, which is crude and will occasionally be wrong. When it is wrong the fix
is to sharpen the trigger, never to delete the row.

## HOW TO ADD A ROW

When Paolo rules something, add it here **the same turn**, with the file that
holds the ruling. If you find yourself about to ask him something, search this
file first. If it is here, you already have your answer — go and read it.

---

## THE SETTLED QUESTIONS

### 1. IS IT A ONE-LIFE RUN? DOES PROGRESS RESET ON DEATH?
**NO. IT IS A DYNASTY.** Three generations — Animal / Human / Angel — across
roughly 100 years of rebuild, with dynasty saves spanning all three, succession,
and heirs inheriting the choice log. "Roguelite" describes the run structure, not
a permadeath wipe. Companions do not die either; permadeath is named an
anti-feature.
- `laws/BOHEMIA_PROJECT_SETUP.md` — "spans three dynasty generations across
  roughly 100 years of rebuild"
- `laws/BOHEMIA_ADDENDUM_ENGINE_ARCHITECTURE_6_30_26.md` — "dynasty saves spanning
  three generations"; "a single playthrough spans three generations"
- `laws/BOHEMIA_ADDENDUM_FAMILY_CORE_THEME_7_19_26.md` — "the fold, succession,
  heirs inheriting the choice log"
- `laws/BOHEMIA_ADDENDUM_ACT3_MOONSHOT_STRUCTURE_7_19_26.md` — "the generations are
  Animal / Human / Angel"
- `laws/BOHEMIA_ADDENDUM_CITYBUILDER_MODEL_7_1_26.md` — "Three cities = three
  generations"
- `laws/BOHEMIA_ADDENDUM_ACT1_PROCEDURAL_ENDING_AND_DESTROYERS_7_19_26.md` —
  "companions do NOT die (permadeath is an anti-feature)"

### 2. WHEN A UTILITY DIES, DOES IT DISAPPEAR OR GET AN OWNER?
**IT IS ALREADY DEAD, EVERYWHERE, AND WHAT STILL WORKS IS OWNED.** Only ~12% is
lit, that 12% is owned, its network is eerily perfect, light is territory, and
nobody patrols the dark. Not an event, not a timer.
- CLUSTERED POWER + LIGHT = TERRITORY (summarised in `CLAUDE.md`'s law list)
- `laws/BOHEMIA_ADDENDUM_TEN_YEARS_COLD_7_31_26.md` clause 3

### 3. WHEN DOES THE GAME START? DOES THE PLAYER SEE THE CRASH?
**TEN YEARS AFTER THE CRASH. THE PLAYER WAS NOT THERE.** The crash is backstory.
Nothing simulates it happening.
- `laws/BOHEMIA_ADDENDUM_TEN_YEARS_COLD_7_31_26.md` clause 1

### 4. SHOULD THERE BE AN ECONOMY / PRICES / INFLATION / MARKETS?
**NO. NOT AS A CATEGORY.** Three currencies only — resources, electricity, clout —
as counters on simple icons. A price that MOVES BY ITSELF is banned; a number on a
tag that Paolo sets is fine.
- `laws/BOHEMIA_ADDENDUM_THREE_CURRENCIES_CENTURY_7_26_26.md`
- `laws/BOHEMIA_ADDENDUM_TEN_YEARS_COLD_7_31_26.md` clause 2 + the boundary

### 5. HOW MANY CURRENCIES?
**THREE. RESOURCES, ELECTRICITY, CLOUT. NO FOURTH THING.**
- `laws/BOHEMIA_ADDENDUM_THREE_CURRENCIES_CENTURY_7_26_26.md`

### 6. HOW DOES TIME PASS? IS IT REAL-TIME OR TURN-BASED?
**THE WORLD MOVES WHEN YOU SPEND TIME TAKING AN ACTION.** I-move-you-move,
quantised to the beat at 120 BPM. And the SHAPE of an action's cost is settled:
fixed cost, condition as the divisor, a hard cap.
- `laws/BOHEMIA_ADDENDUM_TIME_IS_SPENT_BY_ACTIONS_7_26_26.md`
- `laws/BOHEMIA_ADDENDUM_THE_ACTION_COST_SHAPE_7_31_26.md`
- the 120 BPM LAW (in `CLAUDE.md`)

### 7. SHOULD LOOT BE DETAILED / ITEM-BY-ITEM / LIKE PROJECT ZOMBOID?
**NO. LOOT IS A RESOURCE WITH A COUNT AND LOOTING IS ONE FAST ACTION.** Project
Zomboid is a permanent ANTI-reference for loot pace. Two loot emulations were
killed; the subject is closed.
- `laws/BOHEMIA_ADDENDUM_LOOT_IS_RESOURCES_FAST_7_26_26.md`

### 8. SHOULD WE SHIP A PULL REQUEST FOR THIS?
**NO. NEVER. COMMIT STRAIGHT TO MAIN.**
- `CLAUDE.md` SHIP FLOW, amended 7/25/26

### 9. IS ACT 1 A LIVING WORLD? SHOULD THERE BE PLANTS / GREENERY?
**NO. ACT 1 IS A DEAD WORLD.** No vegetation ever — no trees, no pools, no grass.
- the dead-world rule, enforced in `engine/bohemia_suburb.js` and its gate

### 10. DO BUILDINGS COST UPKEEP? CAN THE CITY GO BANKRUPT?
**NO. BUILDINGS ARE EARNED, NOT AFFORDED.** No upkeep, no income, no bankruptcy —
those were superseded on 7/31. Buildings unlock by levelling, quests and act tier,
which is what Pocket City 2 actually gates on anyway.
- `laws/BOHEMIA_ADDENDUM_EARNED_NOT_AFFORDED_7_31_26.md`
- `laws/BOHEMIA_ADDENDUM_CITYBUILDER_MODEL_7_1_26.md` (the dead clause, struck in place)

### 11. SHOULD THE VIOLENCE BE GORY?
**NO — TRAUMATIC, NOT GORY. THEY ARE TWO DIFFERENT DIALS.** Gore is permitted but it
is never the mechanism. A hurt body is a CLOCK, not a corpse; the cost lands on the
PLAYER; and the strongest tools he named are not visual at all (screaming, begging).
- `laws/BOHEMIA_ADDENDUM_TRAUMATIC_NOT_GORY_7_31_26.md`
- `records/BOHEMIA_RESEARCH_CRISIS_RESPONSE_VIOLENCE_7_31_26.md`

### 12. CAN A LANE DECIDE ART LOOKS GOOD ENOUGH TO SHIP?
**NO. HE THUMBS. EVERYTHING ELSE IS OURS.** Machine gates prove craft; only Paolo
judges whether it looks right.
- `laws/BOHEMIA_AUTONOMY_DOCTRINE_7_26_26.md`
- `laws/BOHEMIA_ADDENDUM_NOTES_ARE_RULINGS_7_19_26.md`

---

## THE MACHINE BLOCK
Read by `gates/answered_gate.py`. Format: one row per settled question,
`trigger phrase | the answer in a few words | the file that rules it`.
A trigger is matched case-insensitively against question-shaped text. Keep triggers
SPECIFIC — a trigger so broad it catches ordinary prose is a bug in the trigger.

```answered
one life run | it is a DYNASTY, three generations, ~100 years | laws/BOHEMIA_PROJECT_SETUP.md
one-life run | it is a DYNASTY, three generations, ~100 years | laws/BOHEMIA_PROJECT_SETUP.md
standing when the run ends | dynasty: it carries, heirs inherit the choice log | laws/BOHEMIA_ADDENDUM_FAMILY_CORE_THEME_7_19_26.md
progress when the run ends | dynasty: it carries across three generations | laws/BOHEMIA_ADDENDUM_ENGINE_ARCHITECTURE_6_30_26.md
reset on death | no. dynasty saves span three generations | laws/BOHEMIA_ADDENDUM_ENGINE_ARCHITECTURE_6_30_26.md
does a utility disappear | already dead everywhere; the lit 12% is OWNED | laws/BOHEMIA_ADDENDUM_TEN_YEARS_COLD_7_31_26.md
disappear or get an owner | already dead everywhere; the lit 12% is OWNED | laws/BOHEMIA_ADDENDUM_TEN_YEARS_COLD_7_31_26.md
disappear, or does it get an owner | already dead everywhere; the lit 12% is OWNED | laws/BOHEMIA_ADDENDUM_TEN_YEARS_COLD_7_31_26.md
should there be an economy | no. no economic gameplay as a category | laws/BOHEMIA_ADDENDUM_TEN_YEARS_COLD_7_31_26.md
how many currencies | three: resources, electricity, clout | laws/BOHEMIA_ADDENDUM_THREE_CURRENCIES_CENTURY_7_26_26.md
a fourth currency | no. three only, no fourth thing | laws/BOHEMIA_ADDENDUM_THREE_CURRENCIES_CENTURY_7_26_26.md
open a pull request | no. never. commit straight to main | CLAUDE.md
should i open a pr | no. never. commit straight to main | CLAUDE.md
detailed loot | no. a resource with a count, one fast action | laws/BOHEMIA_ADDENDUM_LOOT_IS_RESOURCES_FAST_7_26_26.md
loot like project zomboid | no. Zomboid is a permanent anti-reference for loot pace | laws/BOHEMIA_ADDENDUM_LOOT_IS_RESOURCES_FAST_7_26_26.md
plants in act 1 | no. act 1 is a DEAD world, no vegetation ever | laws/BOHEMIA_PROJECT_SETUP.md
greenery in act 1 | no. act 1 is a DEAD world, no vegetation ever | laws/BOHEMIA_PROJECT_SETUP.md
when does the game start | ten years after the crash | laws/BOHEMIA_ADDENDUM_TEN_YEARS_COLD_7_31_26.md
daily upkeep | no. buildings are EARNED, not afforded | laws/BOHEMIA_ADDENDUM_EARNED_NOT_AFFORDED_7_31_26.md
go bankrupt | no. no income and no bankruptcy | laws/BOHEMIA_ADDENDUM_EARNED_NOT_AFFORDED_7_31_26.md
buildings cost upkeep | no. earned by levelling, quests and act tier | laws/BOHEMIA_ADDENDUM_EARNED_NOT_AFFORDED_7_31_26.md
should the violence be gory | no. TRAUMATIC not gory; gore is never the mechanism | laws/BOHEMIA_ADDENDUM_TRAUMATIC_NOT_GORY_7_31_26.md
how gory should | traumatic, not gory. two different dials | laws/BOHEMIA_ADDENDUM_TRAUMATIC_NOT_GORY_7_31_26.md
```
