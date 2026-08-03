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

### 12. SHOULD A BOHEMIA STAT BE A "MINI-GAME" RATHER THAN A NUMBER?
**NO.** Asked 8/1 off the Rogue Fable IV measurement and answered directly: *"The
answer is no I don't like the direction that you took this turn."* The page was killed
before it shipped. Do not re-propose it, and do not re-frame it.
- `records/BOHEMIA_RF4_DIRECTION_KILL_8_1_26.md`

### 13. HOW DOES TIME PASS WHILE YOU REST? IS THERE MORE THAN ONE CLOCK?
**ONE UNIVERSAL CLOCK. TIME KEEPS MOVING WHILE YOU REST, AND YOU WATCH IT PASS.**
Verbatim: *"There is one universal clock. Are you stupid?"* Rest is a **visible
fast-forward, never a fade to black**, it can be interrupted by random events, and
longer rest is a better buff. Sleeping, chilling and hanging out are ONE thing with
ONE set of benefits.
- `records/BOHEMIA_RULINGS_FROM_THE_QUESTION_ROUND_8_3_26.md` R2, R3, R4, R5, R7, R8

### 14. HOW DOES FAST TRAVEL UNLOCK? DOES CARRYING TOO MUCH STOP YOU?
**YOU UNLOCK A DESTINATION BY HAVING WALKED THE DISTRICT. ENCUMBRANCE SLOWS YOU
DOWN, IT NEVER WALLS YOU OFF.** The slowdown rides the action-cost shape already
approved — condition as the divisor, thresholds not slopes — so it needs no new
mechanism.
- `records/BOHEMIA_RULINGS_FROM_THE_QUESTION_ROUND_8_3_26.md` R9, R10
- `laws/BOHEMIA_ADDENDUM_THE_ACTION_COST_SHAPE_7_31_26.md` clauses 3 and 5

### 15. ARE DIALOGUE CHECKS A PERCENTAGE ROLL? CAN YOU REFUSE A QUEST?
**NO ROLL — BINARY, YOU CAN OR YOU CANNOT.** He is not a fan of save scumming and a
percentage check invites reloading until it passes. The gate does not have to be
charisma; **faction standing is a legitimate key**. Main quests **cannot** be
refused; side quests give you **variations instead of rejection**, and you clear one
off the **phone**.
- `records/BOHEMIA_RULINGS_FROM_THE_QUESTION_ROUND_8_3_26.md` R12, R13, R14, R15, R16

### 16. IS THERE A MORALITY METER? DO MERCY AND BRUTALITY GET SCORED?
**RECORDED SILENTLY, NEVER SHOWN.** *"I think it's definitely something to record
and then we can do what we want with the information."* It is a LEDGER, not a score
and not a bar: log the acts, show the player nothing, and NPCs comment on how you
play. Sparing somebody after you already shot them is a **different entry** from
sparing somebody with their hands up.
- `records/BOHEMIA_RULINGS_FROM_THE_QUESTION_ROUND_8_3_26.md` R17, R18, R19

### 17. DOES THE GRIME PASS HAPPEN? WHEN — BEFORE THE DEMO OR AT THE END?
**YES, HE SAID "SURE" ON 8/3 — AND THE ANSWER TO "WHEN" IS NEITHER.** It is a bake-time
**pipeline stage**, not a milestone, so it is never scheduled: every asset added from the
day it exists is grimed automatically, and adding hundreds more costs no extra grime
work. It composites at bake and **never writes to `banks/`**, it is **one dial** (the
strength is still his), and it is **indifferent to object boundaries** — which is the
whole finding. Built by the ART lane, and it still does not run until he lifts the
freeze.
- `laws/BOHEMIA_ADDENDUM_NO_PAINT_8_3_26.md` clause 2 + clause 2A

### 18. CAN YOU KILL A WITNESS TO STOP A STORY SPREADING?
**YES. APPROVED 8/3: "ABSOLUTELY ANYTHING U THINK U CAN AND SHOULD DO IS IMPORTANT."**
The mechanic is canon and no lane may soften it into "the witness is scared into
silence" — the weight of the moment is that the option is real. There is a **window**
(until the district unloads), the witness must be **findable**, and it must **cost**
(killing them is its own event with its own witnesses). The numbers are still his.
- `records/BOHEMIA_RESEARCH_STORIES_SPREAD_8_3_26.md` rule 5
- `records/BOHEMIA_RULINGS_FROM_THE_QUESTION_ROUND_8_3_26.md` R20, R21

### 19. DOES AN HEIR INHERIT THE WALKED MAP?
**NO. RULED 8/3: "NO THEN".** The heir gets the family's places — the house, the camp
sites, whatever the city has been built into — and re-walks everything else. Handing a
new generation a revealed valley would mean nobody ever walks again, which deletes the
point of fast travel unlocking by foot.
- `records/BOHEMIA_RULINGS_FROM_THE_QUESTION_ROUND_8_3_26.md` R11

### 20. WHAT DOES AN HEIR INHERIT? DO PERKS CARRY?
**NO INHERITED PERKS — A BOOSTED START INSTEAD.** What actually carries: **gear
stored at the family house**, the camp (upgradeable across acts, so you can be in
act 3 on an act-1 camp), and city/faction/mayor choices that linger. NPCs mention
your father. The whole dynasty layer is derived from **realism** — what would
actually happen forty years after.
- `records/BOHEMIA_RULINGS_FROM_THE_QUESTION_ROUND_8_3_26.md` R22–R28

### 21. HOW DOES NEGLECT BITE IF THERE IS NO UPKEEP?
**IT DOESN'T BITE. YOU JUST STILL HAVE THE SHITTY CAMP.** Falling behind is a state
you are still in, never a bill you failed to pay. Answered by the upgradeable camp
(R26), and consistent with buildings being EARNED, not afforded.
- `records/BOHEMIA_RULINGS_FROM_THE_QUESTION_ROUND_8_3_26.md` R26
- `laws/BOHEMIA_ADDENDUM_EARNED_NOT_AFFORDED_7_31_26.md`

### 22. SHOULD BOHEMIA LOOK MORE LIKE MACHINE PARTY?
**YES — HE SAID SO ON 8/3 AND IT IS A NAMED VISUAL REFERENCE NOW.** *"I really want
my game to look more like that very good."* No paint on any object, ONE grime pass
over everything, dark as the default, stepped animation. It does **not** make
Bohemia 3D, and it does **not** lift the art freeze.
- `laws/BOHEMIA_ADDENDUM_NO_PAINT_8_3_26.md`
- `records/BOHEMIA_RESEARCH_MACHINE_PARTY_8_3_26.md`

### 23. CAN A LANE DECIDE ART LOOKS GOOD ENOUGH TO SHIP?
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
stat be a mini-game | no. he said no on 8/1; do not re-propose | records/BOHEMIA_RF4_DIRECTION_KILL_8_1_26.md
mini-game rather than a modifier | no. killed 8/1 | records/BOHEMIA_RF4_DIRECTION_KILL_8_1_26.md
should the violence be gory | no. TRAUMATIC not gory; gore is never the mechanism | laws/BOHEMIA_ADDENDUM_TRAUMATIC_NOT_GORY_7_31_26.md
how gory should | traumatic, not gory. two different dials | laws/BOHEMIA_ADDENDUM_TRAUMATIC_NOT_GORY_7_31_26.md
universal clock | one. and time keeps moving while you rest | records/BOHEMIA_RULINGS_FROM_THE_QUESTION_ROUND_8_3_26.md
more than one clock | no. ONE universal clock, and the camp meter is a meter | records/BOHEMIA_RULINGS_FROM_THE_QUESTION_ROUND_8_3_26.md
fade to black | no. rest is a VISIBLE fast-forward you watch | records/BOHEMIA_RULINGS_FROM_THE_QUESTION_ROUND_8_3_26.md
does time stop while you rest | no. time keeps moving, events can interrupt | records/BOHEMIA_RULINGS_FROM_THE_QUESTION_ROUND_8_3_26.md
hanging out different from sleeping | no. sleep/chill/hang out are ONE thing | records/BOHEMIA_RULINGS_FROM_THE_QUESTION_ROUND_8_3_26.md
chilling a separate | no. sleep/chill/hang out are ONE thing, one set of benefits | records/BOHEMIA_RULINGS_FROM_THE_QUESTION_ROUND_8_3_26.md
how does fast travel unlock | by having WALKED the district | records/BOHEMIA_RULINGS_FROM_THE_QUESTION_ROUND_8_3_26.md
gate fast travel | on having walked the district on foot | records/BOHEMIA_RULINGS_FROM_THE_QUESTION_ROUND_8_3_26.md
encumbrance a hard | no. encumbrance is a SLOWDOWN, never a wall | records/BOHEMIA_RULINGS_FROM_THE_QUESTION_ROUND_8_3_26.md
carrying too much stop | no. it slows you down, it never blocks you | records/BOHEMIA_RULINGS_FROM_THE_QUESTION_ROUND_8_3_26.md
speech check a percentage | no. BINARY. you can or you cannot. no save scumming | records/BOHEMIA_RULINGS_FROM_THE_QUESTION_ROUND_8_3_26.md
percentage on a check | no. binary only -- a percentage invites save scumming | records/BOHEMIA_RULINGS_FROM_THE_QUESTION_ROUND_8_3_26.md
save scumming | he is not a fan. checks are binary, never a roll | records/BOHEMIA_RULINGS_FROM_THE_QUESTION_ROUND_8_3_26.md
refuse a main quest | no. main quests cannot be refused | records/BOHEMIA_RULINGS_FROM_THE_QUESTION_ROUND_8_3_26.md
turn down a quest | side quests give VARIATIONS, not rejection; clear it off the phone | records/BOHEMIA_RULINGS_FROM_THE_QUESTION_ROUND_8_3_26.md
morality meter | no. record it SILENTLY. a ledger, never a bar | records/BOHEMIA_RULINGS_FROM_THE_QUESTION_ROUND_8_3_26.md
a morality score | no. logged silently, shown to nobody | records/BOHEMIA_RULINGS_FROM_THE_QUESTION_ROUND_8_3_26.md
show the player their | no morality/karma display. the ledger is silent | records/BOHEMIA_RULINGS_FROM_THE_QUESTION_ROUND_8_3_26.md
inherited perks | no. a BOOSTED START instead | records/BOHEMIA_RULINGS_FROM_THE_QUESTION_ROUND_8_3_26.md
perks carry to the heir | no. no individual perks; gear at the family house carries | records/BOHEMIA_RULINGS_FROM_THE_QUESTION_ROUND_8_3_26.md
what does an heir inherit | gear at the family house, the camp, lingering city choices | records/BOHEMIA_RULINGS_FROM_THE_QUESTION_ROUND_8_3_26.md
how does neglect bite | it doesn't. you just still have the shitty camp | records/BOHEMIA_RULINGS_FROM_THE_QUESTION_ROUND_8_3_26.md
look more like machine party | yes. named visual reference 8/3, and it is not 3D | laws/BOHEMIA_ADDENDUM_NO_PAINT_8_3_26.md
should we make it 3d | no. pixel art at 45 degrees. the reference is not the geometry | laws/BOHEMIA_ADDENDUM_NO_PAINT_8_3_26.md
does the grime pass happen | yes. he said SURE on 8/3 | laws/BOHEMIA_ADDENDUM_NO_PAINT_8_3_26.md
when do we do the grime | neither before the demo nor at the end -- it is a bake-time pipeline stage | laws/BOHEMIA_ADDENDUM_NO_PAINT_8_3_26.md
before the demo or at the end | neither. a pipeline stage is never a milestone | laws/BOHEMIA_ADDENDUM_NO_PAINT_8_3_26.md
grime strength | the dial is still his; the pass itself is approved | laws/BOHEMIA_ADDENDUM_NO_PAINT_8_3_26.md
kill a witness | yes, approved 8/3. window, findable, and it costs | records/BOHEMIA_RESEARCH_STORIES_SPREAD_8_3_26.md
silence a witness | yes. approved 8/3, and it may not be softened | records/BOHEMIA_RESEARCH_STORIES_SPREAD_8_3_26.md
stop a story spreading | yes -- kill the vector before the district unloads | records/BOHEMIA_RESEARCH_STORIES_SPREAD_8_3_26.md
heir inherit the walked map | no. "NO THEN" 8/3. only the family's places carry | records/BOHEMIA_RULINGS_FROM_THE_QUESTION_ROUND_8_3_26.md
inherit the map | no. the heir re-walks everything but the family's places | records/BOHEMIA_RULINGS_FROM_THE_QUESTION_ROUND_8_3_26.md
walked map carry | no. ruled 8/3 | records/BOHEMIA_RULINGS_FROM_THE_QUESTION_ROUND_8_3_26.md
```
