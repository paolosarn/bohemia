# THE BIG MISSING (7/29/26, coordinator — Paolo: "we have 11 months of forward
# motion before the game is complete, what are we BIG missing")

Sourced against: his own progress ledger (7/28), the engine reality map
(7/28), GDD v5 (the design truth), and the live backlogs. These are not the
routed gaps the lanes already own — these are the ORGANS THE GAME DOES NOT
HAVE YET, ranked by how much of the final game sits on top of them. Items
marked [HIS DESIGN] cannot be built until Paolo gives direction — they are
the yap-session agenda, and they are the schedule risk, because content
lanes stack on top of them.

## 1. THE GAME DAY — the core loop has never run end to end
Every organ exists somewhere: quests (text), combat (dial), currencies
(ruled), time-spending (resolver), sleep-save (built), travel (walkable
valley). What does NOT exist is one playable DAY: wake at base -> pick up a
quest -> travel to it -> resolve it (talk or fight) -> GET PAID in the three
currencies -> spend something -> sleep, save. The circulatory system between
the organs is the game, and it has never once circulated. This is why his
own quest number is 10% "even though we haven't made a single one" — he can
feel that the pieces don't add up to a day yet. OWNER: RUN (this IS the
integration lane's charter — make the day loop the milestone, not more
features). Blocked pieces: quest placement rule [PENDING], economy payout
(see 3).

## 2. THE CITY-BUILDER HALF IS LORE, NOT GAMEPLAY [HIS DESIGN — the big one]
The game is a roguelite RPG CITY-BUILDER. The RPG half has an engine.
The city-builder half has: a STRUCTURE layer note in the GDD ("the
citybuilder writes here"), WALLS "a mechanic, not a rect [PENDING,
city-builder act tiers]", "transit as a city-builder output [PENDING]" —
and no design for the actual loop: WHAT the player builds, FROM what
resources, WHY (what a built thing produces), WHERE building is allowed,
and how rebuilding drives the three acts. Nobody can build this half
without him; no lane owns it; nothing in any backlog constructs it. It is
the single largest undesigned system in the game and most other missing
things (economy sinks, faction stakes, vehicle unlocks) plug into it.
NEEDS: dedicated design sessions with Paolo (yap-session class), output =
the city-builder loop addendum, then a lane can own it.

## 3. THE ECONOMY DOES NOT RUN — currencies exist, money does not move
Three currencies LOCKED (medicine / electricity / resources), the century
rule ruled, the survival accounting researched to the bone (ceiling math,
logistics, convoys). But no system anywhere PAYS a quest, PRICES a good,
runs a market day, or gives currency a sink. The guarantor seat, convoy
cadence, price spreads — all [PENDING] in GDD v5 part three. Without this,
quests can't reward, the city-builder can't cost, and clout has no rival.
OWNER: WORLD (mechanism: ledger + payout + price tables SHIPPED EMPTY per
mechanism-mine); the numbers and the convoy cadence are [HIS DESIGN].

## 4. THE FACTION GAME — the middle game has no system
Factions are the richest lore in the canon (Remnants, Cartel, Network,
Homeless, the Karen community, the Amalgamation) and the GDD's middle game
is faction work: convoy escorts, the Arsenal contest, the guarantor's rise.
Built today: faction BASES on the map and a beat predicate in world_resolve.
Missing entirely: standing/reputation, territory pressure, faction quests
beyond text, any way a faction reacts to you. LIGHT=TERRITORY is a render
law waiting for a territory SYSTEM to mean something. OWNER: WORLD
(mechanism skeleton); which factions do what to whom is [HIS DESIGN], but
the standing ledger + territory model can ship empty and gated now.

## 5. COMPANIONS / THE BROTHERHOOD — ruled core, zero built
His ruling: companions and the brotherhood are core to the fantasy. Reality
map: no follower entity on any surface, no ally in combat (one hostile
array). The path is already sequenced behind the combat extraction (ruled
7/28) — but nobody should mistake "sequenced" for "small": ally AI, party
movement on the walk, and the social layer (who joins, why, what they
remember) is a system the size of combat itself. OWNER: COMBAT (in-fight) +
RUN (on-walk following) + [HIS DESIGN] for who/why/lore.

## 6. NPCS ARE BODIES, NOT PEOPLE — and dialogue has no system
28 scheduled bodies walk the block; none has a name, a face bound to a
schedule, a memory, or anything to say outside hardcoded quest lines. The
quest corpus is dialogue-rich TEXT with a judge-page player — there is no
in-world conversation system (portrait, lines, choices) on the walk
surface. Every quest, companion, and faction feature lands on top of this
hole. OWNER: mechanism split RUN (surface) / WORLD (who exists) — the cast
of the valley is [HIS DESIGN] at the named-character level, procedural
below.

## 7. WHERE THE GAME LIVES — the save-durability landmine and the ship vehicle
Technical, invisible, and it can hurt real players: iOS WebKit EVICTS
script-writable storage (localStorage/IndexedDB) after ~7 days of site
inactivity for Safari-tab web apps — a player who puts the game down for a
week can come back to DELETED SAVES. His one-blob cloud ruling anticipates
this and is unbuilt. Also unruled: what the game ships AS in 11 months —
web link, installable home-screen app (eviction rules differ), or App Store
wrapper. That choice needs a ruling around month 8 because store review,
monetization, and packaging work back from it. OWNER: RUN (export/cloud
blob mechanics now — the export code already exists, cloud is the gap);
ship-vehicle choice is [HIS DESIGN, month ~8 deadline].

## 8. THE VEHICLE LADDER — locked design, zero build
Man-powered start, bike as the mid-game unlock, car as the endgame prize —
LOCKED in GDD v5 with the travel table, and nothing on any surface rides.
The bike alone re-sizes the playable world (26 min valley crossing vs 1.7h
walk) and is act-1 material. OWNER: RUN+WORLD mechanism; unlock chain
[PENDING his call, already in GDD part seven].

## NOT MISSING (so nobody panics): UI (his call: toward the end), acts 2-3
(parked by his own act-1-only ruling), weather/verticality/streaming/SFX
(ruled and routed this week), art volume (the form pipeline is live).

## THE 11-MONTH SHAPE (mechanism proposal, dates his to bless)
M1-2 (Aug-Sep): the GAME DAY loop closes (quest->pay->spend->sleep); combat
  extraction lands; verticality pilot; art pipeline grinding the board.
M3-4 (Oct-Nov): city-builder design sessions -> the loop addendum -> build
  starts; economy skeleton ships empty; dialogue system v1; bike.
M5-7 (Dec-Feb): the faction game + companions on the spine; quest volume
  (the other 20 + act-1 arc) through the placement rule; city-builder v1
  playable; sounds/ambience full pass.
M8-9 (Mar-Apr): content lock for act 1; ship-vehicle ruling executed
  (store/PWA); cloud save real; perf/onboarding hardening.
M10-11 (May-Jun): polish, difficulty, the demo->release path, playtest
  loops on telemetry. COMPLETE = act 1 shippable, acts 2-3 parked by law.
