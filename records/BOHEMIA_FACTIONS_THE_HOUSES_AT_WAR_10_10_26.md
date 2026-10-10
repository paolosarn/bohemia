# THE HOUSES ARE AT WAR WITH EACH OTHER
FACTIONS lane, row [houses at war]. 10/10/26. MODE: BUILD, research first as the row says. Nothing in the alpha changed.

## Measured first (rule 12): most of the premise already existed
- WHO hates whom is already data: engine/bohemia_between.js, nine directed canon edges from the faction graph with a war flag and a sign (Cartel and Remnants: permanent war; Cartel preys on Caravans: not war, 'war would be expensive, and this pays'; Cartel leaves Volunteers alone; Mob respects Remnants; Reds and Network run close). The parties module already SENDS crews at hostiles through it. So this round stores no pair.
- WHAT NEVER HAPPENED: two parties of different factions meeting. On the real valley they do: six seeds, four waking days, 4 to 16 war meetings and 2 to 13 hostile ones.
- The wiki: War of the Noble Houses (Late Game Crises): houses "take over rival settlements reducing those settlements supply/wealth levels without destroying them"; "taking one side makes the enemy side hostile". The Holy War is a second kind (not built, named). The Conquered situation page has the effects of a taken settlement.

## Built
- records/target/bb/war.json (the quotes, our readings marked ours, the meeting rule); engine/bohemia_war.js: meetings (once a pair a day; war: stronger breaks weaker; mere hostility: stronger taxes, nobody breaks; equal or no number: standoff), sideWith (enemies of the side you take drop to the Hostile top, 9, never raised), onSettled (a base the world TOOK becomes Conquered; held and ruined do not).
- Conquered added to arrival_traits.json (+10% buying, -10% selling, -10% food, -40% items, all off the wiki page, compared by the gate) and markTaken() in bohemia_arrivaltraits.js; effects() gained food_mult.
- gates/war_gate.js (suite: WAR, 39 checks, red 27 ways; two dead guard lines the mutations showed to be redundant were deleted rather than tested). ARRIVAL TRAITS gate 45/0.
- VOTE: THE HOUSES AT WAR.

## Ours, draft
Strength decides a war meeting (the act power column the parties already carry); the radius of one square; once a day a pair; a week of Conquered; "hostile" is bar 9.

## Differences from Battle Brothers (rule 80)
BB's noble war is a timed crisis the player picks. Ours has a permanent canon war (Cartel and Remnants) that is always on, and meetings happen on the road whether you are there or not.

## Routed
- RUN clock: call W.meetings each step with BohemiaBetween.between; a broken party goes home (the parties module's own leg), a tax is a feed line; call W.onSettled with homebases.settle's events.
- RUN TWO: the town screen reads AT.effects (now with food) for Conquered.
- WORLD (the feed): meetings and takings are 'what the world did' posts.
- The Holy War (City States versus houses) is named and not built; our graph has no City States.
