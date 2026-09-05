# BB STUDY — DAY 18: THE MIDDLE HORIZON
# WHAT ARE YOU WORKING ON THIS WEEK?
# (coordinator, on his trigger. Days 1-17: records/BOHEMIA_BB_STUDY_DAY_*.md)

## 0. THE QUESTION, AND IT IS A GAP IN THE STUDY ITSELF
Day 7 found the **daily** motor: why you get up tomorrow. Days 9 and 11
found the **hundred-hour** arc: how you grow and how the world turns.
**NOBODY ASKED WHAT YOU ARE WORKING ON THIS WEEK.** That is the horizon
where a player either forms an intention or drifts, and it is the one
this study skipped.

## 1. BB'S ANSWER: AMBITIONS, AND TWO THINGS TRANSFER
When you have no ambition running you **pick one from three or four**.
- **Early ones are small and frankly tutorial-ish**: get the company up to
  a dozen men; gather enough crowns to have a battle standard made.
- **Then they become mid-term**, and eventually campaign-scale — stopping
  an invasion, leaving a mark.
- **The reward:** at least 100 renown (which raises what contracts pay),
  a lift in the company's mood, and *"often unique rewards you can't
  otherwise attain"* — the battle-standard ambition gives you **a unique
  item based on your own banner**, another **changes how you look on the
  world map**.
- **And there is a cost to drifting:** fail to fulfil one for a long time
  and the men lose confidence in your leadership, and mood suffers.
### THE TWO TRANSFERABLE PARTS
1. **YOU CHOOSE IT.** It is a self-set goal off a short menu, not an
   assigned quest. That is the difference between an errand and an
   intention.
2. **THE REWARD IS OFTEN AN IDENTITY OBJECT, NOT A NUMBER.** A banner. A
   different silhouette on the map. **Something that says who you are
   now** — which is day 10's conclusion arriving from a different
   direction.

## 2. THE OTHER AISLE, AND IT IS BLUNTER THAN I EXPECTED
The foundational study on goal distance: 40 children, aged 7 to 10, all
of them behind and uninterested in arithmetic, put through self-directed
learning under three conditions — **proximal sub-goals** (finish one set
this session), **a distal goal** (finish everything by the last session),
or a general "work productively".
- Under **proximal sub-goals** they progressed rapidly, reached
  substantial mastery, and developed **both a sense of personal efficacy
  and genuine interest** in a subject that had held no attraction.
- ***DISTAL GOALS HAD NO DEMONSTRABLE EFFECTS.***
Not "weaker". **None.**
**A GOAL A HUNDRED HOURS AWAY DOES NOT MOTIVATE ANYBODY. THE MIDDLE IS
THE PART THAT ACTUALLY MOVES PEOPLE.**

## 3. THE SHELF — AND THIS TIME THE GOOD NEWS IS BIG
### (a) THE MIDDLE HORIZON EXISTS, IT IS HIS, AND IT IS ON THE SURFACE HE
### WALKS
`engine/bohemia_mandate.js` is **inlined into the walked city** — not
stranded behind the loop like the faction world (day 6). It carries his
own 6/30 ruling as its header:
> *"the shining jewel is customizing the city in your friendly territory,
> and at some point you become mayor when you've done so much that damn
> near everyone loves you. The more the city backs you, the easier
> building becomes, even in areas whose local faction doesn't love you,
> because the whole city has your back."*
And it is built as **three rungs mapping onto the three acts**:
**TERRITORY** (build where you are loved) → **MANDATE** (the city backs
you, so you can build where the locals do not) → **MAYOR** (you are not
negotiating any more, you are governing). *"Negotiation gives way to
mandate gives way to rule."*
### (b) IT IS REACHABLE, AND ITS INPUT IS LIVE
There is a real on-screen button — **"◆ STANDING"**, bottom-left of the
walked surface — wired to a card that shows your rung, your share, and
**how many more factions you need**. And `rungStandings()` reads
`DQ.shared.faction`, the shared quest ledger, which day 7 showed is
genuinely written by `@DO faction` and by the daily neglect charge.
**SO IT IS NOT DEAD. THE NUMBER MOVES.**
The engineering is good, too: the rung is **DERIVED from current standing
every time it is asked**, with its own comment explaining why — *"a stored
rung would have needed a demotion rule; a computed one cannot get stuck
high."* Losing favour drops you by construction.
### (c) *** AND CROSSING A RUNG PAYS YOU NOTHING YOU CAN USE. ***
Two measurements, and both are honest [PENDING]s rather than bugs:
- `var MANDATE_SHARE = 0.49;` — his own number, flagged in the code as
  *"starting instinct, not final"*.
- `var MAYOR_SHARE = null;` — ***[PENDING Paolo: "enough done, enough
  love" is not a number]***. So `if (MAYOR_SHARE != null && ...)` can
  never fire. **THE LADDER HAS THREE RUNGS AND TOPS OUT AT TWO.**
- And the grants themselves **ship empty**: `grantsAt` answers NO_RULING
  by name, because *"what specifically 'easier' grants at each rung"* is
  canon nobody has ruled, and the module correctly refuses to invent a
  cost multiplier.
**SO TODAY, CROSSING INTO MANDATE CHANGES A SENTENCE ON A CARD AND
NOTHING YOU CAN DO.**

## 4. *** THE FINDING THAT CHALLENGES WHAT WE BELIEVE ***
**WE HAVE A MIDDLE HORIZON AND IT DOES NOT PAY, AND IT HAS BEEN THAT WAY
SINCE 6/30.**
That is not a lane's failure — refusing to invent his canon is the law
working. But look at what the research says the cost of that stalemate
is: the daily motor exists (day 7), the hundred-hour destination exists,
and **the only rung between them is the one that hands you nothing.**
Bandura's result is that the distal goal on its own does nothing at all.
**A TWO-MONTH-OLD PENDING IS SITTING ON THE ONLY PART OF THE STRUCTURE
THAT THE EVIDENCE SAYS ACTUALLY WORKS.**
### AND THIS STUDY ALREADY PRODUCED THE KEY, WHICH IS WHY THIS IS A DAY
### AND NOT A COMPLAINT
Day 10 concluded: **loot cannot be power, so it has to be ACCESS.**
Apply exactly that here. The pending is only blocking because everybody —
including the module's own [PENDING] line, which asks *"cost multipliers?
unlock tiers? restriction removal?"* — assumed the grant had to be a
**dial**.
**IT DOES NOT. THE GRANT CAN BE A DOOR, AND THE DOOR IS ALREADY WRITTEN
IN THE RUNG'S OWN WORDS:**
> *"The city backs you. You can build in a district whose local faction
> does not love you, because the whole city has your back and the locals
> do not have to."*
**THAT IS AN ACCESS GRANT, STATED IN PLAIN ENGLISH, IN THE FILE, ALREADY.**
It needs no cost multiplier, no number, and no ruling — because a place
you could not build in and now can is not a dial, it is a door. **NO
DAMAGE BEFORE THE DIAL is not violated by opening a door.**
**MAYOR_SHARE stays his and stays pending.** It is genuinely a canon
question ("enough done, enough love"), and it does not block rung two.

## 5. WHAT WE TAKE, AND WHAT WE REFUSE
**TAKE:** a goal at the week scale, because the evidence says the
hundred-hour one does nothing on its own; **the player CHOOSES it** from
a short list; the reward is a DOOR or an identity object rather than a
multiplier; and drifting has a cost, which we already have in a better
form than mood — day 7's obligations to people.
**REFUSE:** inventing his rung grants as numbers; a mid-term goal handed
to you rather than chosen; and a goal you have to go hunting for. **A
GOAL YOU HAVE TO FIND IS NOT A GOAL** — right now the middle horizon is
behind a button you have to notice and press, and day 14's cold hand
never presses anything it does not need to.

## 6. ROUTED
- **WORLD — BB-THE-RUNG-PAYS.** *The row that unblocks a two-month-old
  pending without asking him anything.* A rung's grant is **ACCESS, not a
  multiplier** (day 10's rule). The door is already written in the file:
  *"you can build in a district whose local faction does not love you."*
  Ship that as the mechanical grant. `grantsAt` stops answering NO_RULING
  for rung two. **MAYOR_SHARE and the rung-three grant stay his and stay
  pending.**
- **RUN / UI — BB-THIS-WEEK.** The middle goal has to be visible without
  hunting. Today it lives behind a "◆ STANDING" button you must notice;
  the research says the week-scale goal is the one that actually moves a
  player, so it should be somewhere he passes anyway. **Cheapest place:
  the reckoning card, which day 7 and day 13 already converged on** — it
  is the last thing seen every day and it currently says nothing about
  what you are working toward.
- **QUESTS / PEOPLE — BB-YOU-PICK-IT.** The mid-term goal is CHOSEN from
  a short list, not assigned. That is the difference between an errand and
  an intention, and it is the half of BB's ambitions that costs no canon.
  Abandoning one costs something — and we already have the right currency
  for that, which is who you let down (day 7), not a mood bar.
**RUNNING ORDER:** behind the demo, except that BB-THIS-WEEK is one line
on a card two other days already want to open, so it rides with
BB-WHAT-YOU-OWE and BB-THE-END.

## 7. CONFIDENCE
- The mandate module being inlined on the walked surface, the three
  rungs, the "◆ STANDING" button, `rungStandings()` reading
  `DQ.shared.faction`, `MANDATE_SHARE = 0.49`, `MAYOR_SHARE = null`, and
  `grantsAt` answering NO_RULING: **MEASURED**, and several of them quoted
  from the module's own header and comments.
- BB's ambitions (pick from 3-4, the early tutorial-ish ones, 100+ renown
  and mood, unique rewards like the banner item and the world-map look,
  and mood loss for drifting): wiki and dev blog #89 as reported; the blog
  is proxy-blocked here and was NOT read directly. **MEDIUM-HIGH.**
- Bandura & Schunk (1981), 40 children, proximal sub-goals versus distal
  goals versus general goals, and "distal goals had no demonstrable
  effects": a seminal, heavily cited study. **HIGH** for the result. It is
  one study on children learning arithmetic, so I am using it as a strong
  directional finding about goal distance, not as a measurement of adults
  playing a video game.
- §4's unlock and §6: **MY ARGUMENT AND MY ROUTING.** The claim that an
  access grant needs no ruling follows from day 10 and from NO DAMAGE
  BEFORE THE DIAL; if he disagrees, the rung waits, and that is his call.

## SOURCES
Battle Brothers wiki (Ambitions, Game Guide) and dev blog #89 as
reported, plus Steam discussion, for the ambition menu, the early
small-scale ambitions, renown and mood rewards, the unique banner item
and world-map appearance changes, and the mood penalty for leaving one
unfulfilled. Bandura & Schunk, "Cultivating Competence, Self-Efficacy,
and Intrinsic Interest Through Proximal Self-Motivation" (1981), for
proximal versus distal goals; and the wider goal-setting literature.
IN-REPO: slices/BOHEMIA_CITY_WORLD.html (the inlined
engine/bohemia_mandate.js, its 6/30 header quoting him, the three rungs,
`MANDATE_SHARE`, `MAYOR_SHARE`, `grantsAt`, `rungRead`,
`rungStandings`, `rungWords`, `showStanding`, `#rungbtn`),
laws/BOHEMIA_ADDENDUM_PERSISTENT_CONSEQUENCE_MAYOR_6_30_26.md,
records/BOHEMIA_BB_STUDY_DAY_7_WHY_YOU_LEAVE_THE_HOUSE_8_28_26.md,
records/BOHEMIA_BB_STUDY_DAY_10_LOOT_IS_A_COUNTDOWN_8_28_26.md, and days
1-17 of this study.
