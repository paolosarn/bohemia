# BB STUDY — DAY 6: WHO HOLDS THE GROUND
# (coordinator, on his trigger "bb study, next day", sent again after the
# five-day plan closed. THE PLAN WAS MINE AND IT WAS SHORT BY A PILLAR —
# see §0. Days 1-5: records/BOHEMIA_BB_STUDY_DAY_*.md)

## 0. WHY THERE IS A DAY 6, AND IT IS MY MISS, NOT A BONUS ROUND
He named THREE things in the message that started this study:
> "**the world, the caravan system, the CITY-STATE SYSTEM** — we could
> think about different parts of Vegas as different faction holdings."
Day 1 did the WORK (who offers you a job). Day 2 did the MONEY (what
things cost and where). **NOBODY DID THE GROUND.** Five days closed with
the third pillar untouched, and he sent the trigger a sixth time.
**A PLAN IS NOT A LAW.** Day 5 was the end of my outline, not the end of
his question. So: territory.

## 1. THE MEASUREMENT, AND IT IS THE FIFTH TIME THIS STUDY HAS FOUND THE
## SAME SHAPE — EXCEPT THIS ONE IS MINE
### (a) THE FACTION WORLD IS REAL, AND IT IS OLDER AND BIGGER THAN I KNEW
`engine/bohemia_engine.js` has carried a full faction system since
**6/30/26**: a `FactionWorld` with `owner` (districtId -> factionId),
standings on a named ladder (HOSTILE < COLD < NEUTRAL < WARM < FWU) with
spillover through links, `playerMandate()` for the Mayor Arc, and a
**TERRITORY AI** — `claimableTargets`, `scoreClaim`, `factionTurn`,
`advanceRound` — deliberately cheap: generate a few candidate moves,
score each with one utility function, take the best, no lookahead, no
per-tile pathfinding, deterministic off the seeded stream. Its own header
says it is "the system the Mayor Arc and base-defense both read from."
`engine/bohemia_between.js` carries the war states, including
`permanent-war`, and `BOHEMIA_faction_graph.json` carries 14 factions
with `act1_power` / `act3_power` ordinal ranks and notes like
*"territorially inconsistent"* — HIS canon, from GDD §9.
### (b) NONE OF IT RUNS WHERE HE WALKS, AND THE BUILD SAYS SO ITSELF
`FactionWorld` is created in `engine/bohemia_loop.js`. And the walked
surface does not load the loop. **THIS IS NOT MY INFERENCE — ANOTHER LANE
WROTE IT DOWN IN THE ALPHA:**
> *"walked city loads BohemiaClout and NOT BohemiaLoop, so LOOP is null
> there."*
Counted across the three slices (`slices/BOHEMIA_CITY_WORLD.html` is the
one walked surface, loaded by `fr.src=CITY_SRC` — verified, not assumed):
| token | WALKED CITY | legacy run slice |
|---|---|---|
| `factionAdjacency` | **0** | 7 |
| `factionTurn` | **0** | 4 |
| `bootFactions` | **1, and it is a comment** | 4-5 |
| `FactionWorld` / `shiftStanding` / `ownerOf` | **0** | present |
### (c) TEN QUESTS SAY THE MAP CHANGES HANDS. NOTHING IS LISTENING.
There is a PACING LAW (Paolo 7/24) written into the walked surface: the
territory AI's `advanceRound` *"is never a tick — it fires when the
narrative calls for it, a quest resolves, a story beat lands."* The lever
is a quest verb, `@DO advance_territory`.
**10 OF OUR 27 CANON QUESTS USE IT.** On the walked surface the verb is
parsed and sets `s.advanceTerritory=true` — and **the only code that
reads that flag lives in the retired slice** (`if (s.advanceTerritory &&
factionAdjacency) factions.advanceRound(...)`). Ten quests declare a
story beat that moves the valley's ground, and the flag is set and
dropped on the floor.
### (d) A CORRECT COMMENT STANDING OVER ABSENT CODE
Line 2150 of the walked city: *"every faction on real
worldMap.factionSlots coordinates via bootFactions."* `factionSlots`
appears in that file exactly once — in that sentence. **The hairline
lesson, again: a comment that is true of the design and false of the file
survives every review that reads the comment and believes it.**
### (e) *** AND THE HONEST PART: I AM THE ONE WHO STRANDED IT. ***
The 8/14 **ONE WALKED SURFACE** decision is mine, in the backlog, in my
words: the city world is the walked surface, the run slice is legacy, and
*"demo-critical wiring migrates (SOUNDS P0-WALK, RUN 00's fight/pay)."*
**I NAMED THE THINGS THAT WOULD MOVE AND ASSUMED THE REST WOULD KEEP.**
The faction world was not on the list, so it stayed on the ship we
abandoned, along with the quest casting bridge that placed quests on
ground factions actually held — which is playtest dispatch item 2's
mechanical cause, and it was six weeks old when he complained.
**THE STANDING RULE, AND IT IS NEW: A MIGRATION LIST IS A DELETION LIST
FOR EVERYTHING NOT ON IT.** Naming what moves is not a plan; naming what
DOES NOT move, and saying out loud that it is now dark, is.
### (f) WHAT I HAD WRONG IN MY FIRST DRAFT, CORRECTED BEFORE SHIPPING
I nearly wrote "quests are not attached to places on the walked surface."
**FALSE.** The lane built `castAddresses` there: a quest's roles get a
real address, found once, deterministic, rings in order, and a miss
returns NULL rather than handing a stranger an insider's part. That work
is done and it is good.
**THE ACCURATE CLAIM IS NARROWER AND WORSE:** it casts against **people
who run with an outfit** (`peopleAt`), not against **ground an outfit
holds**. So on the surface he walks, **A FACTION IS A LABEL PEOPLE WEAR,
NOT GROUND ANYBODY HOLDS.** There is no "their block" to take, defend or
lose. Which is exactly why `advance_territory` has nothing to move.
### (g) CHECKED AND CLEAN, SAID OUT LOUD SO NOBODY RE-RAISES IT
Four engine modules are referenced in the legacy slice and not the walked
one: `bohemia_save`, `bohemia_crypt`, `bohemia_rooms`,
`bohemia_overmap_bridge`. **THE SAVE IS FINE** — the iPhone-proof save
lives in the PARENT shell (`root.BohemiaSave`, `CITYSAVE =
BohemiaSave.make(...)`) and the frame reports state up through
`citySnapshot()`. Correct design, not a hole. The other three are an
**OPEN AUDIT**, not a finding: I have not checked them and I am not going
to guess.

## 2. *** THE THING NOBODY HAS NOTICED: THE VALLEY ALREADY HAS AN
## OWNERSHIP MAP, AND IT IS MADE OF ELECTRICITY ***
This is the best news in the study and it was sitting in his own 7/20
law. On the walked surface, in live code, answering whether a scene can
spawn:
> *"A SEAM IS TWO OWNERS TOUCHING. LIGHT=TERRITORY: a live circuit's
> owner is who holds that ground, so a seam is where two different live
> owners are adjacent. **Not a metaphor, the grid's own data.**"*
Every live circuit already carries an `owner`, and the walked city
already computes **BORDERS** from it. The valley has a territory map
today. **IT JUST DOES NOT KNOW WHO ANYBODY IS.** The owner is a
CATEGORY, not a name: `{settlement:0.55, faction:0.2, network:0.15,
solar_lone:0.1}`, defaulting to `'settlement'`. One circuit in five is
owned by the generic word "faction".
**SO TERRITORY ON THE WALKED SURFACE IS A NAMING JOB, NOT A PORTING
JOB.** Give that owner a real id out of the graph he already wrote and
the valley has holdings, borders and seams, with no new system, no loop,
and no engine migration. And it is more Bohemia than a coloured map
overlay would ever be: **you can SEE who holds a block, at night, from
the street, because his 12%-lit law already made light the tell.**
WHO HOLDS WHAT IS HIS. The mechanism is mine; the names are not.

## 3. AISLE ONE — WHAT THE GAME HE NAMED DOES WITH GROUND
- **THE WAR FINISHES WITH OR WITHOUT YOU.** The houses start in a cold
  war, work against each other on their own goals, and take each other's
  settlements — reducing a place's supply and wealth rather than deleting
  it. The world does not wait for the player to be interested.
- **PICKING A SIDE COSTS MAP.** Siding with one house turns the other
  hostile and *"locks you out of a significant portion of the map."* The
  cost of an alliance is measured in GROUND YOU CAN NO LONGER WALK.
- ***AND THE MECHANIC WORTH STEALING OUTRIGHT: YOU TAKE A PLACE BY TAKING
  WHAT FEEDS IT.*** Raiders hit the **outlying support locations first** —
  the towers, the lumber yards, the copper mines, the vineyards — before
  the town itself. Not a stack fight at the gates. **We are built for
  this and did not notice:** `engine/bohemia_utility.js` already holds the
  real Las Vegas water system (84 reservoirs and tanks, nearly a billion
  gallons, 400,000+ homes) and the flood basins; the power grid already
  has owners and seams; his own boss ladder has THE CISTERN, whose grant
  is *"catch the monsoon off the rooftops, and stop asking anybody for
  water."* **THE VALLEY'S SUPPLY LINES ARE ALREADY MODELLED. Nobody can
  cut one.**

## 4. AISLE TWO — HOW GROUND IS ACTUALLY HELD WHERE THERE IS NO STATE
**(a) WHY ANYBODY BOTHERS TO HOLD A PLACE.** The standard account of
where government comes from: a **ROVING BANDIT** steals everything and
moves on, bearing almost none of the cost of what he wrecks. A bandit who
settles and monopolises the theft becomes a **STATIONARY BANDIT**, and in
doing so acquires an **ENCOMPASSING INTEREST** in the place: he takes a
regular cut instead of everything, provides protection as a public good,
and starts wanting the place to do WELL, because a richer block pays a
bigger cut. Protection from roving bandits is why the people put up with
him.
**THAT IS A DESIGN SPEC FOR EVERY FACTION IN THIS VALLEY.** A faction
that holds ground and does nothing for it is not a landlord, it is a
roving bandit standing still — and the people under it have no reason not
to switch. The mechanism writes itself: **HOLDING GROUND MUST COST
SOMETHING AND PAY SOMETHING, AND WHAT IT PAYS THE HELD IS WHAT KEEPS IT
HELD.**
**(b) WHEN TURF REPLACES REPUTATION — AND THIS IS THE CHALLENGE.** The
study of prison gangs as governance finds that before the 1950s
California prisons had **no gangs**: a small population ran on an
informal code, and reputation was enough, because everyone knew everyone
and knew the code. **THE ORDER CHANGED WHEN THE POPULATION EXPLODED** —
new arrivals did not know the code, inmates had nothing in common, and
the reputation system stopped working. What replaced it was **gangs
providing governance**: contract enforcement, personal security, dispute
resolution, control of the market. Not because people got worse. Because
the group got too big for everyone to know everyone.

## 5. *** THE FINDING THAT CHALLENGES WHAT WE BELIEVE ***
**DAY 1 CONCLUDED THAT REPUTATION IS A WEB, NOT A BAR, AND I WROTE IT AS
THOUGH IT WERE THE MODEL FOR THE WHOLE VALLEY.** The medieval-trader
evidence it rests on is real, and it is evidence about a SMALL, CLOSED,
MUTUALLY-KNOWN GROUP.
**THE PRISON-GANG EVIDENCE SAYS THE WEB HAS A POPULATION CEILING, AND
ABOVE IT ORDER GOES TERRITORIAL.** So "reputation web" versus "turf" is
not a design preference and we do not have to pick. **IT IS A FUNCTION OF
HOW MANY PEOPLE ARE IN THE ROOM** — and our valley contains both regimes
at once, on purpose, because he built it that way: a small settlement
where everybody knows you runs on the Day 1 web, and a dense district
runs on whoever holds the circuits.
**THAT IS A RULE, NOT A VIBE, AND IT IS TESTABLE IN OUR OWN WORLD:** how
you get work in a place should depend on the SIZE of the place. Small:
somebody vouches for you. Big: somebody owns the block and takes a cut.
It also quietly explains why the Day 1 hole (nobody has an opinion about
you) and the Day 6 hole (nobody holds anything) are the SAME HOLE seen
from two population sizes.
**AND THE SECOND CHALLENGE IS AIMED AT ME:** I have spent six days
finding systems that exist and are pointed away from the player, and this
one was pointed away BY MY OWN MIGRATION DECISION. The pattern is not
that lanes build the wrong things. **THE PATTERN IS THAT NOBODY OWNS THE
WIRE BETWEEN TWO LANES, AND I AM THE ONLY SEAT THAT CAN SEE ONE.**

## 6. WHAT WE TAKE, AND WHAT WE REFUSE
**TAKE:** the world moves without you; you take a place by taking what
feeds it, not by a stack fight; holding ground pays the holder AND the
held or it does not stay held; an alliance costs you ground you can walk;
territory is legible from the street, at night, because light is already
the tell; and how you get work depends on how big the place is.
**REFUSE:** a coloured map-painter layer as the way you see territory (we
have a better tell and it is diegetic); a faction war the player cannot
perceive from the street (simulation nobody can see is a heater); WHO
holds what, which is his; and any number, as always.

## 7. ROUTED (day 5 spent the "nothing routes yet" rule; these are rows)
- **WORLD — BB-TURF.** Name the circuit owner. The grid already has
  owners, borders and seams on the walked surface; make the owner a real
  faction id from `BOHEMIA_faction_graph.json`. No loop, no migration, no
  new system. WHO holds what is HIS and ships empty of canon.
- **SHARED — BB-LOOPLESS.** The walked surface does not load
  `BohemiaLoop`, so the faction world, the standing graph and the quest
  casting bridge are dark there. Decide it explicitly: load the loop, or
  write down which pieces are dead on the walked surface so nobody routes
  work against them again. This is the row the other twelve depend on.
- **QUESTS — BB-TERRITORY-FLAG.** `@DO advance_territory` is set by 10 of
  27 canon quests and read by nothing the player can reach. Either it
  moves ground or those ten quests are telling the player something that
  does not happen.
- **WORLD — BB-SUPPLY-FIRST.** You take a place by taking what feeds it.
  The water system and the flood basins are already modelled off real
  Clark County data and NOTHING CAN BE CUT. Start with one cuttable
  supply line, not a war.
- **PEOPLE — BB-ENCOMPASSING.** Holding ground costs and pays, and what
  it pays the people under it is why it stays held. Pairs with BB-TAX-free
  design: no money exists, so a cut is taken in RESOURCES, ELECTRICITY or
  CLOUT — which is EVERYTHING COSTS ONE, already law.
- **PEOPLE/QUESTS — BB-POPULATION-RULE.** How you get work depends on the
  size of the place: small runs on who vouches for you (Day 1), dense runs
  on who holds the block (Day 6). One rule, two regimes, and it makes
  BB-OFFER-GATE sharper rather than competing with it.
- **SHARED — BB-MIGRATION-AUDIT.** A migration list is a deletion list
  for everything not on it. Audit what else the 8/14 move stranded.
  Already checked and CLEAN: the save. Already checked and BROKEN: the
  faction world and the casting bridge. Unchecked: `bohemia_crypt`,
  `bohemia_rooms`, `bohemia_overmap_bridge`.
**RUNNING ORDER, MINE:** none of these outranks the demo either.
**BB-TURF is the exception worth taking early** — it is small, it is
local to the walked surface, it needs nothing ported, and it turns a
system he already ruled on (light is territory) into the thing he asked
for by name (parts of Vegas as faction holdings).

## 8. CONFIDENCE
- Every in-repo count in §1 and §2: **MEASURED**, in the file the alpha
  actually loads (`fr.src='BOHEMIA_CITY_WORLD.html'`, verified — I did
  not repeat day 4's base64 mistake), with positive controls, and one
  claim confirmed by the build's own comment rather than by inference.
- §1(f) is a correction I made to my own draft before shipping it.
- The territory AI's design intent: the engine's own header. **HIGH.**
- The faction-war and take-the-supply-first behaviour: wiki and player
  discussion; the developer blog is proxy-blocked here and was NOT read.
  **MEDIUM-HIGH.**
- Roving/stationary bandits and the encompassing interest: standard
  political economy, consistent across sources. **HIGH.**
- Prison-gang governance and the population threshold: a published book
  and its reviews, read via summaries and quotations, not cover to cover.
  **MEDIUM-HIGH**, and it is historical/qualitative, so §5 is a design
  rule drawn from it, not a measured law.
- §5's population rule, §6 and §7: **MY ARGUMENT AND MY ROUTING.**

## SOURCES
Mancur Olson on roving versus stationary bandits and the encompassing
interest (stationary-bandit theory; Power and Prosperity); David Skarbek,
"The Social Order of the Underworld: How Prison Gangs Govern the American
Penal System" (Oxford, 2014) and its reviews, on the convict code, the
population explosion, and gangs as governance; Battle Brothers wiki
(Noble Houses, Factions and Relations, Late Game Crises) and Steam
discussions on the noble war finishing with or without the player, siding
locking you out of the map, and raiders taking outlying support locations
first. IN-REPO: engine/bohemia_engine.js (FactionWorld, the territory AI,
the 6/30 header), engine/bohemia_loop.js, engine/bohemia_between.js,
engine/BOHEMIA_faction_graph.json, engine/bohemia_utility.js (the real
water system), slices/BOHEMIA_CITY_WORLD.html (the pacing law comment,
`advance_territory`, `castAddresses`, `roadCan('seam')`),
slices/BOHEMIA_ALPHA_0_9.html (CITY_SRC, BohemiaSave, and the
"LOOP is null there" comment), BOHEMIA_BACKLOG.md (the 8/14 ONE WALKED
SURFACE decision and its migration list), records/BOHEMIA_THE_BOSS_
LADDER_v7_8_7_26.md (THE CISTERN), and days 1-5 of this study.
