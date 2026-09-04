# BB STUDY — DAY 15: WHAT MAKES ONE TURN INTERESTING, AND WHY IN THIS
# VALLEY THE ANSWER IS HEAT
# (coordinator, on his trigger. Days 1-14: records/BOHEMIA_BB_STUDY_DAY_*.md)
# THE LAST BIG BB SYSTEM: FATIGUE.

## 0. THE QUESTION
Day 3 asked how you give orders. Day 12 asked what makes a fight end.
**Nobody asked what makes a single TURN interesting** — what stops a fight
being "do the best available thing, every turn, until somebody falls
over." In the game he named the answer is one resource, and it is not
health.

## 1. BB'S ANSWER: FATIGUE, AND ARMOUR IS NOT FREE
- **Every armour piece carries a FATIGUE PENALTY that lowers your maximum
  stamina.** The heavier your gear, the fewer actions you can take.
  Almost every armour piece, every shield, and every weapon except a
  dagger costs you max fatigue.
- **Accumulated fatigue lowers INITIATIVE.** So *"someone in light armour
  will act before someone in heavy armour, and someone fresh will act
  before someone fatigued."*
- And a man who cannot move or attack because he is exhausted **is a
  liability**, not a soldier.
### THE DESIGN IN ONE LINE
**PROTECTION COSTS YOU TEMPO.** Armour is not a wall you buy, it is a
trade: you take fewer hits and you also take fewer turns, later. That is
what makes a turn a decision rather than a rotation — spending is not
free, and the man who spent yesterday is slower today.

## 2. THE OTHER AISLE — AND IT SAYS THE SAME THING IN HIS OWN SETTING
This valley runs past 40C. The real numbers for working hard in that,
from military and occupational heat-stress practice:
- **WEARING BODY ARMOUR ADDS ABOUT 5°F TO THE HEAT YOUR BODY ACTUALLY
  EXPERIENCES** (a 3°C+ offset in the more recent work for moderate and
  heavy effort). The plate does not just weigh something. **IT MAKES THE
  DAY HOTTER.**
- The standard answer to heavy work in that heat is not "go slower", it
  is a **WORK/REST CYCLE**: at the relevant heat band, heavy work runs
  **20 minutes on, 40 minutes off, with a litre of water an hour.**
- Core temperature hits the 38°C limit at about **165 minutes** in a
  28.5°C environment while wearing armour.
- And the finding that matters most for a game: ***"intermittent work and
  low intensity work prevented excessive heat strain from developing"***
  even above 30°C. **You survive the heat by going hard and then
  STOPPING.**
**SO THE REAL WORLD AND THE GAME HE NAMED AGREE: THE RESOURCE IS NOT
HEALTH, IT IS HOW OFTEN YOU CAN SPEND YOURSELF, AND ARMOUR MAKES IT
WORSE.**

## 3. THE SHELF — WE HAVE BOTH HALVES AND THEY HAVE NEVER MET
### (a) THE FIGHT HAS A WORK/REST CYCLE ALREADY, AND IT IS HIS
`const STAM_MAX=3;` — and the comment says whose idea it is: *"V54
STAMINA (Paolo, Fable model): stamina actions DON'T end your turn."*
Sprinting spends a pip and **your turn keeps going**. The pips come back
on the clock, announced as **SECOND WIND** — *"the clock came round, your
legs are back."*
**THAT IS A WORK/REST CYCLE. HE DESIGNED ONE WITHOUT CALLING IT THAT.**
Spend hard, wait, get it back. It is the 20-on-40-off rule with the
serial numbers filed off, and it is already on the beat.
### (b) THE WALKED CITY ALREADY ORGANISES ITS ENTIRE DAY AROUND THE HEAT
Measured on the walked surface: outdoor labour happens **EARLY** because
of *"summer 40C+ afternoons"*, the canon includes a **"Mojave midday
shelter"**, people consolidate for heat, and every person carries a
`heatTol` — a personal heat tolerance. The city knows exactly how hot it
is and reorganises everybody's schedule around it.
### (c) *** AND THE FIGHT HAS NEVER HEARD OF ANY OF IT. ***
`enter(G,d,env)` receives: the player's HP, a roster, a package id, and a
stamina max. **No hour. No temperature. No weather. No memory that you
just walked three kilometres to get there.** And the first thing it does
is `cleanSlate(G)` — *"nothing from the last fight survives."*
POSITIVE CONTROL, because this nearly fooled me: `heat` appears **42
times** in the decoded fight. **Every one of them is MUZZLE heat** (shots
stacking within 2.5 seconds) **or a CAR cooking off** (`CAR_COOK`). Not
one is temperature. The instrument found a real word and the word means
something else.
**THE DESERT IS THE SETTING OF THIS ENTIRE GAME AND THE FIGHT TAKES PLACE
IN A CLIMATE-CONTROLLED ROOM.**
### (d) AND OUR ONE PIECE OF ARMOUR IS PURE UPSIDE
Day 10 measured it: `G.pp = PLATE_START` at every bell, plates crack and
come back full, and one perk simply gives you another one. **In both
aisles armour is a TRADE. In ours it is a gift.** The single piece of
gear the game has is the one thing that should cost the most, and it
costs nothing.

## 4. *** THE FINDING THAT CHALLENGES WHAT WE BELIEVE ***
**WE HAVE BEEN BUILDING THE FIGHT AS A SEALED BOX, AND EVERY PIPE FINDING
IN THIS STUDY SO FAR HAS BEEN OUTBOUND.** Day 9: the boss keys are
published and nobody listens. Day 10: the loot never leaves. Day 12: the
player cannot leave. **Day 15 is the first INBOUND one: nothing goes IN
either.** The fight does not know what time it is, how hot it is, what
you are wearing, or how far you have walked today.
That is why the arena feels like a different game from the valley, and it
is not an art problem or a systems-depth problem. **IT IS ONE MESSAGE
WITH FOUR FIELDS IN IT.**
**AND THE PAYOFF IS ENORMOUS FOR THE SIZE OF THE CHANGE**, because every
piece is already built:
- Stamina pips are already a work/rest cycle, on the beat, and his.
- The city already knows the hour and the temperature and already changes
  behaviour because of them.
- The armour already exists and already resets.
**A FIGHT AT 06:00 AND A FIGHT AT 14:00 SHOULD NOT BE THE SAME FIGHT**,
and making that true costs no new system, no new art, and — this matters
— **no damage number.** Fewer pips in the afternoon is not damage. It is
a budget. NO DAMAGE BEFORE THE DIAL is untouched.
### AND IT ANSWERS A ROW THIS STUDY ALREADY ROUTED
Day 3 concluded that **the clock is our plinker** — that ranged pressure
in a valley with no archers has to come from time and terrain. **This is
that, made concrete.** The thing that says HURRY UP is the sun.

## 5. WHAT WE TAKE, AND WHAT WE REFUSE
**TAKE:** fatigue as the resource that makes a turn a decision; armour
that costs tempo, because both aisles say it does and ours currently says
it does not; the work/rest shape we already have, tied to the hour and
the heat; and shade as a real thing rather than a shadow, since the city
already has both the word and the behaviour.
**REFUSE:** a heat METER on the player — day 7 settled that survival
meters are the genre's most reliably hated mechanic and the desert is the
setting, not the scoreboard. **Heat sets the BUDGET, it does not drain a
bar.** Also refused: a fight that is harder in the afternoon in the sense
of enemies hitting for more. It is not difficulty, it is fewer pips.

## 6. ROUTED
- **COMBAT / RUN — BB-THE-FIGHT-KNOWS-THE-DAY.** The encounter payload
  carries the world with it: the hour, the heat, and whether you are in
  shade. Today `enter()` gets HP, a roster and a package id, and the first
  thing it does is wipe the slate. **This is the INBOUND twin of
  BB-LOOT-LEAVES and BB-KEYS-LAND — same pipe family, opposite direction,
  and all three are one afternoon's work on one message.**
- **COMBAT — BB-THE-HEAT-IS-THE-CLOCK.** Stamina pips are a work/rest
  cycle already (`STAM_MAX=3`, SECOND WIND, his own Fable model). Let the
  hour and the temperature set how many you get and how fast they come
  back. Real anchors, not invented ones: heavy work in that heat runs
  20 on / 40 off, and intermittent work is what actually prevents heat
  strain. **Fewer pips is a budget, not damage.**
- **COMBAT — BB-ARMOUR-COSTS.** A plate should cost tempo. In BB armour
  lowers max fatigue and fatigue lowers initiative, so *"someone fresh
  will act before someone fatigued"*; in the real world armour adds ~5°F
  to what your body experiences. Ours is pure upside and resets full every
  bell. Pairs with day 10's BB-LOOT-IS-ACCESS: a plate you must decide
  whether to wear is an object; a plate that is always on is a stat.
- **WORLD — BB-SHADE-IS-A-RESOURCE.** The walked city already has shade,
  a "Mojave midday shelter" in canon, schedules that run early because of
  40C afternoons, and a per-person `heatTol`. Shade currently costs
  nothing and buys nothing. Make standing in it mean something, and the
  heat becomes a map feature instead of a fact.
**RUNNING ORDER:** behind the demo. But note that BB-THE-FIGHT-KNOWS-THE-
DAY, BB-LOOT-LEAVES (day 10) and BB-KEYS-LAND (day 9) are **three
findings on one message**, and whoever opens that file should do all
three.

## 7. CONFIDENCE
- `STAM_MAX=3`, the Fable-model comment, SECOND WIND, `enter()`'s
  arguments, `cleanSlate`, `G.pp = PLATE_START`, and the city's heat
  behaviour (`heatTol`, the Mojave midday shelter, early outdoor labour):
  **MEASURED**, with the muzzle-heat false positive stated explicitly.
- BB's armour fatigue penalties and fatigue lowering initiative: wiki and
  player discussion, consistent. The dev blog is proxy-blocked here and
  was NOT read directly. **MEDIUM-HIGH.** I did not find authoritative
  detail on zone-of-control or height rules and I am not going to invent
  them.
- The heat numbers (a ~5°F / 3°C+ WBGT offset for body armour, 20/40
  work-rest with a litre an hour at the relevant band, 38°C core at ~165
  minutes, intermittent work preventing strain): military and
  occupational heat-stress guidance and the studies behind it. **HIGH**
  for the direction and the practice; the exact bands depend on
  acclimatisation, humidity and workload, so they are anchors for design,
  not values to copy into code.
- §4, §5 and §6: **MY ARGUMENT AND MY ROUTING.** Every dial is his.

## SOURCES
Battle Brothers wiki (Attributes, Combat Mechanics) and Steam gameplay
discussion on armour and helmet max-fatigue penalties, fatigue lowering
initiative, and an exhausted brother being a liability. US and Canadian
military heat-stress guidance and the WBGT literature on body-armor
offsets, work/rest cycles and water intake, and the studies on core
temperature limits and intermittent work under heat strain. IN-REPO: the
decoded `COMBAT_B64` payload inside slices/BOHEMIA_ALPHA_0_9.html
(`STAM_MAX`, the V54 stamina comment, SECOND WIND, `enter`, `cleanSlate`,
`PLATE_START`, and the muzzle/car heat that is not temperature),
slices/BOHEMIA_CITY_WORLD.html (the 40C afternoon schedules, the Mojave
midday shelter, `heatTol`, shade),
laws/BOHEMIA_LAW_TRENCHCOATS_ARE_RESERVED_8_27_26.md ("THIS IS A DESSERT
GAME. ITS HOT!!!!"), records/BOHEMIA_RF4_ENEMY_DOSSIER_8_25_26.md (the
clock is our plinker), and days 1-14 of this study.
