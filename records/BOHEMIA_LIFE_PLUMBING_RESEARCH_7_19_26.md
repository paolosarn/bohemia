# HOW THE LIVING-WORLD STUDIOS PLUMB THEIR SIMULATIONS (research bank, 7/19/26)

Paolo asked: how do the successful studios making our caliber of game do the
coding plumbing? Researched the closest siblings (STALKER, Shadows of Doubt,
The Sims, RimWorld, Project Zomboid, Caves of Qud, Dwarf Fortress, Oblivion's
Radiant AI, Gothic). Distilled to seven patterns + a scorecard of where
Bohemia's LIFE plumbing already matches and what the next rungs are.

## PATTERN 1 - THE TWO-PLANE SIM (STALKER's A-Life; the industry standard)
STALKER simulates ~2000 NPCs across 30 maps by keeping almost all of them
OFFLINE: an entry on a graph, no pathfinding, no animation, moved abstractly
as time passes. Only the few hundred near the player are ONLINE with full
simulation. Events still happen far away (factions take ground, squads die)
because the offline plane keeps advancing cheaply.
BOHEMIA MAP: our online plane exists (the block sim, tile-level, occupancy).
Our offline plane exists IN EMBRYO and almost for free: whereAt(agent, turn)
answers "where is this person and what are they doing" from the schedule
WITHOUT simulating a single step. The valley layer = agents as (cell,
activity) lookups, tile-simulated only inside the player's bubble. The
'away' mode in makeSim is already the seam between the planes.

## PATTERN 2 - PRE-COMPUTED DAYS (Shadows of Doubt, our closest sibling)
ColePowered simulates hundreds of citizens with jobs, hangouts, favorite
places. The trick: NOTHING is decided in real time. Each citizen's whole day
is batch-planned before the day starts (10-15s of compute for a whole city),
then the live game only handles DEVIATIONS, and "there will never be more
than a handful of citizens requiring deviations." Citizens also keep decaying
MEMORIES of who/what they saw (fuzzier with time, age, distinctiveness) -
that is what makes them questionable witnesses in play.
BOHEMIA MAP: we already do the pre-computed day (sched blocks generated with
the agent, deterministic). The deviation layer and the witness-memory organ
are future rungs - memory decay is pure quest fuel for the questbook's
testimony verbs.

## PATTERN 3 - NEEDS + SMART OBJECTS (The Sims; the greatest scaling trick)
Sims are deliberately dumb; the OBJECTS are smart. Every object ADVERTISES
what it offers ("fridge: -hunger", "bed: -tiredness"); an agent scores nearby
advertisements against its current needs and walks to the winner. Why it
matters: content scales without AI code. Adding a new thing for people to do
= placing a new object in the world. Zero new brain logic. (Lineage: Will
Wright's SimAnt pheromones, objects as the attractors.)
BOHEMIA MAP: our floorplan rooms already carry roles (bed/kitchen/living).
The natural evolution: rooms and props advertise, agents consult
advertisements inside their schedule blocks. This is ALSO the cleanest fit
with MECHANISM-MINE/CONTENTS-PAOLO'S: Paolo places the world, and the placed
world itself tells agents what can be done there. Nothing hardcoded.

## PATTERN 4 - JOBS AS DATA (RimWorld's think trees)
A pawn asks a ThinkTree (priority hierarchy evaluated against conditions)
for its current Job; a JobDriver breaks the job into Toils (atomic steps:
walk here, use this, wait). Tynan's philosophy on depth: the sim exists to
GENERATE STORIES; simulate only what surfaces as visible consequence.
BOHEMIA MAP: our acts (work/scav/errand/watch) are jobs; when acts need
steps (scavenge = walk to house, search 3 turns, carry back), the toil
pattern is the shape. Keep it data, keep it shallow-but-visible.

## PATTERN 5 - VIRTUAL POPULATIONS (Project Zomboid)
Zomboid never simulates every zombie. Population is NUMBERS PER CELL
(~300x300 tiles): density maps, per-cell respawn timers, migration at cell
edges. Individuals only materialize as real bodies near the player, spawned
at the edges so you never see it happen.
BOHEMIA MAP: this is how the whole 96x96 valley holds a population without
100k agent objects. Per-district-cell population counts (rolled from the
die-off dial once Paolo rules it), agents materialized deterministically
from the cell seed when the player's bubble arrives. We already generate
agents per-plot deterministically - the counts layer on top is small.

## PATTERN 6 - THE RADIANT AI LESSON (Oblivion) + GOTHIC'S COUNTER-PROOF
Bethesda built full autonomy for Oblivion (needs + goals + freedom). In
testing, NPCs bought out entire shops, murdered dealers for a rake, punched
dogs to death to settle arguments. They shipped tight SCHEDULES with scripted
flavor instead, because full free-will sim is unauthorable chaos in a content
game. Meanwhile Gothic - beloved for the most "alive" world of its era - was
pure hand-tuned schedules: sit at the fire in the evening, cook, fix the hut,
walk the camp. No intelligence at all. FEELING alive is schedule craft, not
brain depth.
BOHEMIA MAP: validates the schedule-block core we built and Paolo's archetype
correction (different clocks, different lives = Gothic's trick exactly).
When we add deviation, it must be BOUNDED and gated, never free-will.

## PATTERN 7 - DATA-DRIVEN ENTITIES (Caves of Qud)
Qud's engine is an entity-component system where everything (a dwarf of an
item, a wall, a mutation) is an entity made of parts, parts talk by event
messages, and content lives in data files. That is why 70+ factions, the
water ritual, and total moddability were reachable by a two-person team.
BOHEMIA MAP: our modules already compose through data (the wardrobe bank,
DISTGEN table, empty faction tables). Keep growing content as DATA the
engine reads, never as code branches. The gates enforce it.

## THE CAUTIONARY TALE - DWARF FORTRESS
The deepest sim ever built: personalities, economies, climates, histories.
Also: 20 years, one person at ~100hr weeks, single-threaded performance
death, and mountains of depth no player ever perceives. RimWorld ships a
fraction of the depth and generates MORE legible stories per CPU cycle.
LESSON FOR US: depth budget = only what surfaces in play. Paolo's economy
ruling (7/19: don't tune numbers against a world that doesn't exist) is
this exact lesson, arrived at independently.

## BOHEMIA SCORECARD (where our plumbing stands vs the industry)
HAVE, MATCHES THE PROS:
  pre-computed deterministic days (SoD pattern) / online tile sim with
  occupancy (the bubble) / schedule archetypes (Gothic craft) / data-driven
  content tables (Qud pattern) / regression gates (nobody else has these)
NEXT RUNGS, IN THE ORDER THE RESEARCH SUGGESTS (all parked until Paolo
reopens LIFE - world art first):
  1. VIRTUAL POPULATION LAYER: per-cell counts off the die-off dial
     (Zomboid), agents materialize deterministically in the bubble.
  2. FORMAL TWO-PLANE SIM: whereAt() as the valley's offline plane
     (STALKER), online bubble = current plot(s) only.
  3. SMART ADVERTISEMENTS: roled rooms/props advertise acts (Sims);
     schedules consult them. Contents stay Paolo's placed world.
  4. BOUNDED DEVIATION + WITNESS MEMORY (SoD): events push agents off
     plan; decaying memories feed the questbook's testimony verbs.
NEVER: free-will autonomy (Radiant lesson), depth that doesn't surface
(DF lesson), real-time per-agent decisions when a batch plan works (SoD).

## SOURCES
- STALKER A-Life: dev.to AlifePlus reactive architecture; Black Shell Media
  "A-Life: An Insight into Ambitious AI"; Anomaly modding docs (alife API)
- Shadows of Doubt: ColePowered DevBlog 8 "Simulating a City", DevBlog 13
  (procedural interiors), DevBlog 15 (moving in citizens), DevBlog 23
  (generating citizens)
- The Sims: Zubek "Needs-Based AI" (GPU Pro draft); Forbus/Wright course
  notes lineage; GMTK "The Genius AI Behind The Sims"
- RimWorld: RimWorld mod guide "How Pawns Think" (ThinkTree/JobDriver/Toils);
  Tynan Sylvester interviews (story-generation philosophy)
- Project Zomboid: PZwiki zombie population; sandbox population docs
- Caves of Qud: Bucklew IRDC 2015 "Data-Driven Engines of Qud & Sproggiwood"
- Radiant AI: paavohtl "What was Radiant AI, anyway?"; Grokipedia Radiant AI
- Dwarf Fortress: Game Developer interviews with Tarn Adams; PC Gamer
  "42% towards simulating existence"
