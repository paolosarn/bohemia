# BB STUDY — DAY 11: HOW A LONG GAME GETS WORSE
# (coordinator, on his trigger. Days 1-10: records/BOHEMIA_BB_STUDY_DAY_*.md)
# THE LAST BIG CAMPAIGN SYSTEM: ESCALATION.

## 0. THE QUESTION
A hundred hours, three acts, three generations. **So how does the world
get worse over that time WITHOUT a difficulty number?** Day 1 already
ruled out the usual answer: renown gates the offer, never the difficulty.
And NO DAMAGE BEFORE THE DIAL means we cannot turn anything up. That
sounds like a dead end. It is not, and BB solves it in a way that costs
zero balance numbers.

## 1. BB'S CRISIS, AND THE MECHANISM IS NOT WHAT I EXPECTED
- **IT IS FORETOLD BEFORE IT ARRIVES.** A crisis is announced around day
  50-70 of a campaign and begins around day 80-100.
- **IT ARRIVES IN TWO PHASES**, and the first is a BUILDUP of warning
  signs: more sightings, camps creeping closer to settlements, and more
  contracts that deal with the thing coming.
- **IT IS NOT OPTIONAL.** You do not opt in. The world turns whether you
  were interested or not, which is day 6's "the war finishes with or
  without you" applied to time instead of ground.
- Some crises permanently destroy settlements, with no way to rebuild.
### *** AND HERE IS THE MECHANISM, WHICH IS THE WHOLE FINDING: THE WORLD
### DOES NOT GET STRONGER. IT GETS ORGANISED. ***
In the greenskin crisis, **orcs and goblins stop fighting each other**,
combine forces, and start appearing in mixed units. In the undead crisis,
factions that are normally independent — the ancient dead, necromancers,
wiedergängers — **combine**, and anyone who dies can come back regardless
of how they died.
**NOBODY'S STAT BLOCK CHANGED. THE RELATIONSHIP GRAPH DID.** The enemies
who were spending their strength on each other stop, and point all of it
at you. That is escalation with **zero balance numbers**, which is exactly
the constraint we are under — and **we already own the graph it runs on.**

## 2. THE SHELF, MEASURED — AND THE NINTH INSTANCE
### (a) THE THREE ACTS ARE 23 LAW FILES AND AN ART TAG
`act1` appears **931 times** in the walked city and **every one of them is
a MATERIAL description on a tile** — "dead-dirt front/back yard, no grass,
cracked", "cracked residential street asphalt". That is the DISTRICT
DOSSIER LAW's act-1 material field doing its job. **`act2` appears ZERO
times.** The acts are an ART TIER on the surface he walks, not a state.
### (b) THE ACT STATE EXISTS, IN THE PLACE DAY 6 ALREADY FOUND
`engine/bohemia_engine.js`: `act: 1, // 1..3 (the three dynasty
generations)`, and a note that the act "affects hub count / recovery, but
layout is stable across acts." **It lives in the engine, which lives
behind BohemiaLoop, which the walked city does not load.** Same wall as
the faction world. One more thing stranded by the same migration.
### (c) *** AND TEN QUESTS ARE LABELLED ACT 2 IN A GAME WITH NO ACT ***
The quest language has an act tag and our canon uses it:
**`@ACT 1` in 17 quests, `@ACT 2` in 10.** The parser on the walked
surface reads it: `if ((m=/^@ACT\s+(\S+)/.exec(L))){ Q.act=m[1]; continue; }`
**`Q.act` has exactly ONE mention in the whole file — that line.** Nothing
reads it. Nothing can gate on it.
**NINTH INSTANCE, AND IT IS THE SAME SHAPE AS `advance_territory`:** the
quest language can SAY it, the parser stores it, and there is nobody on
the other end. Ten of our twenty-seven canon quests are waiting for a
second act that the game he plays has no way to be in.

## 3. THE OTHER AISLE — COLLAPSE IS VISIBLE BEFORE IT HAPPENS
There is a real, cross-disciplinary science of this, and it is a gift to a
game whose stated identity is the most realistic economic crash simulator.
- Complex systems — ecosystems, financial markets, the climate — have
  **tipping points**, where a system flips from one stable state into a
  contrasting one. The flip is fast. **The approach to it is not.**
- Approaching one, a system emits **generic early warning signals**. The
  headline one is **CRITICAL SLOWING DOWN: it takes longer and longer to
  recover from small shocks**, because the feedbacks that used to pull it
  back are weakening.
- Measurable companions: **rising variance and rising autocorrelation** —
  the system wobbles more, and each state looks more like the last one.
- The underlying quantity is **RESILIENCE**, and it drains quietly long
  before anything visible breaks.
**SO A COLLAPSE IS NOT A SURPRISE. IT IS A SURPRISE TO PEOPLE WHO WERE NOT
WATCHING RECOVERY TIMES.**

## 4. *** THE FINDING THAT CHALLENGES WHAT WE BELIEVE ***
**WE TREAT THE THREE ACTS AS A STORY STRUCTURE — three chapters, three
generations, a moonshot at the end.** That is true and it is his. But it
has quietly meant that escalation is somebody's writing job, and therefore
nobody's mechanic, which is why the act state is stranded in an engine the
game does not load and ten quests are tagged for a chapter that cannot
arrive.
**THE TWO AISLES AGREE ON A MECHANICAL ANSWER, AND WE ALREADY OWN BOTH
HALVES:**
1. **THE WORLD ESCALATES BY COALITION, NOT BY NUMBERS.** Danger goes up
   when the people who were fighting each other stop. We have a 14-faction
   graph with directional relations, war states including
   `permanent-war`, and a wrapped writer that cannot break canon. Turning
   two hostile outfits into allies is a **graph edit**, and it makes the
   valley meaningfully more dangerous without touching one damage value.
   **NO DAMAGE BEFORE THE DIAL IS NOT A BLOCKER HERE. IT IS THE
   SPECIFICATION.**
2. **THE ACT TURN IS FORETOLD BY THE VALLEY GETTING SLOWER TO RECOVER.**
   Not a cutscene, not a calendar the player cannot see: the real
   early-warning signal, made of quantities this game **already
   computes** — how long a dark block takes to come back on
   (LIGHT=TERRITORY, day 6), how many days of a good are left
   (`daysLeft`, day 2), whether a holding's income is still being paid
   (yours+lit+patrolled, day 7). A block that used to relight in a day
   takes three. A shortage that used to clear does not.
**THAT IS "THE MOST REALISTIC ECONOMIC CRASH SIMULATOR, BUT FUN" MADE
LITERAL:** the player learns to read the same signal a real analyst reads,
and the ones who are paying attention see Act 2 coming and the ones who
are not get hit by it. **AND IT IS THE OPPOSITE OF A DIFFICULTY SLIDER —
the world does not hit harder, it stops bouncing back.**

## 5. WHAT WE TAKE, AND WHAT WE REFUSE
**TAKE:** escalation as a coalition change on a graph we already have;
an act turn that is FORETOLD, with a buildup the player can read;
escalation that is NOT optional, because a world that waits for you is
scenery; and warning signals made of recovery time rather than of a
number going up.
**REFUSE:** a difficulty curve (day 1 already refused reputation-scaled
difficulty and this is the same refusal on the time axis); an act turn
that is only a cutscene; permanent destruction of places without his
ruling, since what the valley loses is canon and canon is his; and any
escalation the player cannot see coming, because that is not tension, it
is an ambush.

## 6. ROUTED
- **SHARED / WORLD — BB-THE-ACT-IS-A-STATE.** There is an act (`act: 1..3`
  in the engine) and the walked surface has no idea. **Ten of twenty-seven
  canon quests declare `@ACT 2`, the parser stores it in `Q.act`, and
  `Q.act` has one mention in the file — the line that sets it.** Either
  the act becomes real where he walks or those ten quests are labelled for
  a chapter that cannot arrive. Depends on the same decision as day 6's
  BB-LOOPLESS; they are one afternoon.
- **WORLD — BB-COALITION.** Escalation is a change in the relationship
  graph, not in a stat block: the outfits that were spending their
  strength on each other stop. The graph, the relations and the war states
  already exist. WHO allies with whom, and when, is HIS.
- **WORLD — BB-SLOWER-EVERY-TIME.** Before an act turns, the valley takes
  longer to come back from small shocks. Built out of quantities already
  computed: relight time, `daysLeft`, whether a holding still pays. No new
  economics, no new numbers from him.
- **UI / RUN — BB-FORETOLD.** The player has to be able to READ the
  buildup. A crisis announced 20-50 days before it lands is the design,
  not a courtesy. This is the display half of BB-SLOWER-EVERY-TIME, and
  without it that row is a simulation nobody can see.
**RUNNING ORDER:** behind the demo. BB-THE-ACT-IS-A-STATE rides along with
BB-LOOPLESS, and is the one that unblocks ten written quests.

## 7. CONFIDENCE
- The 931 `act1` material tags, the zero `act2`, the engine's `act: 1..3`,
  the 17/10 `@ACT` split across canon quests and `Q.act` having exactly one
  mention: **MEASURED**, with the false-positive check stated (I counted
  `act`, `acts`, `action` separately before trusting the number).
- BB's crisis timing (foretold day 50-70, starts day 80-100), the two
  phases, the buildup signs, non-optionality, and the coalition mechanic
  (orcs and goblins combining; the undead factions combining): wiki, the
  developers' own dev blog #92 as reported, and player discussion. The
  blog is proxy-blocked from this environment and was NOT read directly.
  **MEDIUM-HIGH.**
- Critical slowing down, rising variance and autocorrelation as generic
  early-warning signals of critical transitions, and loss of resilience as
  the underlying quantity: peer-reviewed and cross-disciplinary,
  replicated including in a whole-ecosystem experiment. **HIGH** for the
  theory; applying it to a game world is my design argument.
- §4, §5 and §6: **MY ARGUMENT AND MY ROUTING.** That escalation by
  coalition satisfies NO DAMAGE BEFORE THE DIAL is a derivation from his
  own rulings; who allies with whom is reserved.

## SOURCES
Battle Brothers wiki (Late Game Crises) and dev blog #92 as reported,
plus Steam discussions, for crisis timing, the buildup phase, the three
crisis types, permanent settlement destruction, and the combining of
normally hostile factions. Scheffer et al., "Early-warning signals for
critical transitions" (Nature, 2009); Carpenter et al., "Early Warnings of
Regime Shifts: A Whole-Ecosystem Experiment" (Science, 2011); and the
critical-slowing-down literature on recovery rate, variance and
autocorrelation as resilience indicators. IN-REPO:
slices/BOHEMIA_CITY_WORLD.html (the act1 material tags, the `@ACT` parser
and `Q.act`), engine/bohemia_engine.js (`act: 1..3`),
engine/BOHEMIA_faction_graph.json and engine/bohemia_between.js (relations
and war states), quests/bq/*.bq (17 `@ACT 1`, 10 `@ACT 2`),
laws/BOHEMIA_ADDENDUM_ACT3_MOONSHOT_STRUCTURE_7_19_26.md, and days 1-10
of this study.
