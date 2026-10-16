# FACTIONS ARCHIVE (rule 96: the blocks older than the lane's two newest, newest first; moved by tools/bohemia_trail_sweep.js, nothing deleted)

<!-- moved 10/16 (CORRECT: AI and AK (the hearback's NEGATIVE folded in; sweep AK: the trail file's round 2 first, one commit)) -->
FACTIONS (factions-ovkjpf): 10/10 (round 56) LATEST -- *** [houses at war]: who is at war already lived in bohemia_between.js (canon graph); new here is MEETINGS (parties of enemies within a square clash: war breaks the weaker, prey-tax taxes, equal strength stands off), sideWith (enemies drop to Hostile 9), and a base the world TOOK becomes Conquered (wiki numbers). records/target/bb/war.json, engine/bohemia_war.js, gates/war_gate.js (39/0, red 27 ways), VOTE THE HOUSES AT WAR. Record: records/BOHEMIA_FACTIONS_THE_HOUSES_AT_WAR_10_10_26.md. Route: RUN clock calls meetings/onSettled. Next OPEN: [faces meet again] (needs PORTRAIT). Jump list is down to one row: write more next round (rule 74).

FACTIONS (factions-ovkjpf): 10/10 (round 55) LATEST -- *** [who guards]: guardFor(kind, total, phase) in engine/bohemia_factions.js, grounds in factions.json CORRECTED (seven of eleven were not terrain kinds; found by this row), wiki quotes re-read by the gate, leaders per faction, FACTIONS gate 214/0 red 33 ways, VOTE WHO GUARDS THE SIX PLACES. Record: records/BOHEMIA_FACTIONS_WHO_GUARDS_THE_SIX_PLACES_10_10_26.md. Result: all six places are House ground, so one banner guards all six. Paolo thumbed THE BAR ON ONE TOWN up ('like the rest'). Route: WORLD feeds GUARDED_BY. Next OPEN: [houses at war], [faces meet again].

FACTIONS (factions-ovkjpf): 10/10 (round 54) LATEST -- *** [beef] A-SETTLEMENT-COMES-FOR-YOU: records/target/bb/hunted.json (two wiki thresholds, quoted and verified: a house's patrols meet you when hostile; a caravan is raidable at Threatening or lower with no contract), engine/bohemia_hunted.js, gates/hunted_gate.js (35/0, red 17 ways), VOTE WHEN A SETTLEMENT COMES FOR YOU. Record: records/BOHEMIA_FACTIONS_WHEN_A_SETTLEMENT_COMES_FOR_YOU_10_10_26.md. Wrote three OPEN rows (rule 74): [who guards], [houses at war], [faces meet again]. Route: RUN clock/map calls huntersFor and attackable; RUN TWO contractAgainst. The beef chain is now data + mechanism end to end (relations, crime, arrivals, hunted); nothing of it is wired into the live game yet, that is RUN's.

FACTIONS (factions-ovkjpf): 10/9 (round 53) LATEST -- *** [raids make traits]: records/target/bb/arrival_traits.json (Raided and Well Supplied effects off the wiki, cause is the arriving party and marked ours), engine/bohemia_arrivaltraits.js, gates/arrivaltraits_gate.js (41/0, red 22 ways), VOTE A TOWN BEFORE AND AFTER A RAID. Record: records/BOHEMIA_FACTIONS_A_PARTY_THAT_ARRIVES_LEAVES_ITS_MARK_10_9_26.md. FINDING for RUN TWO: settlement_traits.json raided (price x1.25, stock x0.6, recruits -1) is not what the wiki page says (-50% items, -50% recruits, no price). Route: RUN clock calls advanceWatching then traitsFrom. Next OPEN: [beef] A-SETTLEMENT-COMES-FOR-YOU (needs the relations and crime already built).

FACTIONS (factions-ovkjpf): 10/9 (round 52) LATEST -- *** [beef] RELATIONS BANDS: records/target/bb/relations.json (whole wiki Relations page, sourced), engine/bohemia_relations.js, gates/relations_gate.js (66/0, red 33 ways, reads the wiki tarball), VOTE THE BAR ON ONE TOWN. Crime (bread -10 mapped, seen only) and guards (draw at 9 or below) are OURS, draft. Record: records/BOHEMIA_FACTIONS_THE_BAR_ON_ONE_TOWN_10_9_26.md. Route: RUN TWO reads the bar; COMBAT guardsDraw. Next OPEN: [raids make traits], [beef] A-SETTLEMENT-COMES-FOR-YOU.

FACTIONS (factions-ovkjpf): 10/9 (round 51) LATEST -- *** [the parties on the map] DATA HALF and [a house you give a fuck about] FIRST HALF: records/target/bb/factions.json (four factions: banner, make-up, ground, behaviour, face slot, want, base, memory bands), engine/bohemia_factions.js, gates/factions_gate.js (134/0, red 23 ways, suite entry FACTIONS), VOTE card "FOUR FACTIONS WITH A FACE". Record: records/BOHEMIA_FACTIONS_FOUR_WITH_A_FACE_10_9_26.md. Route: RUN reads the file for the map card; PORTRAIT fills the face slots; COORDINATOR adds a [better than bb] board line for FACTIONS (item 9 is in the standing record). Next: [beef] bands, [raids make traits], seed crews per valley.

FACTIONS (factions-ovkjpf): 10/1 (round 50) LATEST -- *** [home bases] ROUND FIVE: A CREW ARRIVING AT A BASE YOU HOLD IS A RAID,
AND THE LEDGER HALF OF THE CHAIN IS BUILT. *** The coordinator's 9/30 note on my row: "'nothing happens when they arrive' is the
next row: a crew arriving at a base you hold is a RAID." PREMISE MEASURED FIRST (rule 12): nothing in the game reads an arrival, and a
before-and-after look at the parties' `arrived` flag cannot see one reliably (a crew's whole trip is 25 to 40 cells against 89 cells a
waking day, and the module turns a crew round the step after it arrives, so a clock call that walks many steps, a night's sleep, can see a
crew arrive AND leave inside one call; a gate leg builds that case). The research was already written: QUESTS QR-R found a siege is a short
chain on one base (warning, offer, preparation days, one fight, outcome) and that the world may take a base nobody came to, but only after
a warning with days on the clock. BUILT (engine only, commit 756a2a94, on main): engine/bohemia_homebases.js gains advanceWatching (the
parties module's advance one step at a time, ending in EXACTLY its state, returning every arrival once, a drop-in for the clock's call),
raidsFrom (which arrivals are raids: a crew, at a base you hold, not a ruin, whose own home stands, open yet by the DEPTH thirds, no clock
given means the start of an act, not already raided this act), openRaid (due in four map days, against whoever held it), closeRaid (HELD
closes and writes nothing; TAKEN and RUINED go through the same two writes the rest of the game uses, by 'raid'), settle (the world's answer
on the due day when nobody came: a base at least as strong as the crew holds, a tie holds, a weaker one is TAKEN by the crew, NEVER burned,
no number no fall, a moot raid closes held, idempotent), a `raid` {by, due} on the base marker, and the raids in the save (older saves load
as no raid ever came). THE NUMBERS ARE DEFAULTS, NOT RULINGS: RAID_DEFAULTS {prepDays 4, perAct 1} (QR-R's suggestions) and the one
comparison (the act power column the parties module already hands out); every function takes opts to replace them for TUNING, and
opts.holds(seat, raid) is the seam for anything that should make a base stronger (LIFE+CITY's wall and tank). Gate HOME BASES 142 checks
(was 94), red 69 ways by mutation (was 37); two first-draft mutations were silent and each found something real (a check that counted an
arrival's step but not its repeats; three isRuin tests that heldBy already made redundant, which I deleted instead of testing). BUILD A LOT
56 to 62 green, ONE THEN HEIRS 97/0, TURF LEDGER 30/0, THREE ACTS 28/0 with the change in. MEASURED on twelve valleys: THE FOUR CREWS ARE THE
SAME FOUR ON EVERY VALLEY AND ALL FOUR ARE SENT AT FORTRESSES (Caravans 10 at the Cartel 12, Cartel 12 at the Remnants 14, Cartel 12 at the
Caravans 10, Remnants 14 at the Cartel 12), no crew is ever sent at a camp or a town, and if nobody comes exactly half hold (24 of 48);
a crew arrives at its target 4 to 18 times a waking day (median 6), which is why a base is raided once an act and not polish. SO TODAY A
PLAYER WHO HOLDS ONLY CAMPS AND TOWNS CAN NEVER BE RAIDED, and the fortresses open two thirds into an act: a roster fact, WORLD's to change.
I REVERSED MY ROUND-THREE DEFAULT (a base falls only from what you do): his own words say 'taken or ruined' and 'losing one is how it
shrinks', QR-R says the world may take a base nobody came to after a warning with days on the clock, and the coordinator's note needs an
end; the round-three card now carries a one-line pointer so a thumb on the old question is not read as a thumb on the new one. THE COOK, in
VOTE: A CREW AT YOUR GATE (vote/FACTIONS_A_CREW_AT_YOUR_GATE_10_1.html, id factions-a-crew-at-your-gate-10-1): three real frames of the
game's own map with RUN's new building art and rings over it: two Cartel crews walking at two bases you would hold (red dashed rings, dashed
lines), a crew camped at each with four red squares for four days, then four days later the Remnants base (14 against 12) holds in gold and the
Caravans base (10 against 12) is ringed in the Cartel's pink; a table of the four crews; the thumb. WHAT WE DO DIFFERENTLY FROM BB (39b): BB's
'raided' is a temporary situation on a town you do not own and its crises burn settlements whether you watch or not; ours is a clock on YOUR
base, takes only the weak ones after four days, never burns unattended, and MOVES (a line, a camp, squares that go down by day). HOW THE FRAME WAS
MADE: toMap() lands on the SKY rung, so skyExit(); the camera is set from the three seats with the player's own body panned off the glass; the
overlay wraps render(); positions go through the game's own iso(); the arrivals, raids and answers are the module run in the page on the live
valley. ROUTED (full list in the record): RUN swaps BohemiaParties.advance for advanceWatching in partiesAdvance and calls raidsFrom, openRaid,
settle once a map day; WORLD [parties move] BUY half sends crews at what is worth taking, the player's bases (ownedBy) included; COMBAT and
LIFE+CITY [where a raid is fought] call closeRaid when the fight ends and read the marker's raid for the offer; LIFE+CITY could make a wall raise
a base's strength through opts.holds; TUNING holds the three numbers; WORLD's feed reads settle() events; PEOPLE/WORDS one person and one line at the
gate; [PENDING coordinator] COLOUR IS TERRITORY vs 37e unchanged. NEXT IN THIS LANE: [home bases] and [territory ledger] stay CLAIMED. (1) rule 42a,
the human combat factions and rosters, WITH PEOPLE (COMBAT [bestiary] owns the data file); (2) a base's job facts on the marker once WORLD/ECONOMY
resolve the dark pumps; (3) when RUN's clock calls advanceWatching, look at it on the glass; (4) cut my border and ground ink on the map when RUN's
map is stable; (5) when a raid exists, inline the module and wire the save. Four of my VOTE cards now wait on him (the fourteen bases, the crews
heading at bases, your base grows part by part, a crew at your gate).
Record: records/BOHEMIA_HOME_BASES_ROUND_FIVE_THE_RAID_AT_YOUR_GATE_10_1_26.md.

FACTIONS (factions-ovkjpf): 9/30 (round 49) LATEST -- *** [home bases] ROUND FOUR: THE LEDGER NAMES THE WAY A PART
CHANGES HANDS AND ANSWERS FOR ANY BLOCK (RULE 43), AND A BASE GROWS IN JUMPS. *** Rule 43 (Paolo 9/29): taking a part
(raid, contract, boss verb, deal) is how the base grows, losing one is how it shrinks, "you own the held-parts ledger
LIFE+CITY builds on", and the base "can be half the city by act 3". PREMISE MEASURED FIRST (rule 12): round 47's ledger
already wrote took and ruined and read heldBy, so whole parts existed; three things did not: the four ways, a read for
"who holds THIS BLOCK", and a count for "a base is every block you hold". BUILT (engine only, commit 73aad0e8, on main):
engine/bohemia_homebases.js has WAYS = raid, contract, boss, deal, frozen (a taking may carry `by`; any other value is
refused by name, UNKNOWN_WAY; none records null; the save keeps it and load drops a bad one); blockHolder(partAt, rec,
bx, by, act) answers {part, holder, state} DERIVED from the part a block lies in, never stored per block (partAt is
handed in as a function, so the module takes data and not another module); heldBlocks(partAt, rec, who, n, act) counts.
Gate HOME BASES 94 checks (was 75), red 37 ways by mutation (was 29): new legs 10d (the ways) and 10e (on the real
valley, seed 12345: the empty ledger is a no-op for all 9,216 blocks; a taking flips a WHOLE part and not one block more;
a ruin holds nothing; a taking in act 2 is not there in act 1). The dead per-cell shape stays dead: a gate leg
comment-strips the logic and refuses turf, holderOf, grid, cell(s), 9216. LIFE+CITY [build a lot] round 2 (c4763f7,
landed while I was cooking) ALREADY READS THIS LEDGER (heldBy, isRuin, ownedBy on the part); their BUILD A LOT gate is
56/0 with my change in, so `by` being optional cost them nothing. MEASURED, off the game's own map: every block belongs to
exactly one of the fourteen parts (331 blocks to 1,490), so a base grows in JUMPS: the five camps are 1,949 blocks =
21.1% of Vegas, plus the four towns 4,057 = 44.0%, the five fortresses the other 56.0% and each one 5.9% to 16.2%. With
the DEPTH thirds (camps open at the start of an act, towns a third in, fortresses two thirds in) the most a player could
hold is 21%, then 44%, then it jumps to everything. "Half the city" needs NO Mob: all camps, all towns and the smallest
fortress (Caravans) is 4,602 blocks = 49.9%. On five other valleys the fortresses were 47 to 53%. It is an upper bound:
nothing can take a part yet, a player at boot holds 0. THE COOK, in VOTE: YOUR BASE GROWS PART BY PART
(vote/FACTIONS_YOUR_BASE_GROWS_PART_BY_PART_9_30.html, id factions-your-base-grows-part-by-part-9-30): three real frames
of the game's own map, gold ring = a part you would hold (camps, camps and towns, all fourteen), a bar each (21, 44,
100 percent) and the table of the fourteen. MY DEFAULT, rule 39a, a thumb: a base is WHOLE PARTS, never a piece of one
(the piece-by-piece version is the dead territory ledger under a new name); thumbs down means split a part, and that is
his to say in words. WHAT WE DO DIFFERENTLY FROM BB (39b): BB's towns are never the player's, ours pass to him whole by four
ways; ownership is a gold ring on the base and never ground colour. THE COORDINATOR'S 9/30 NOTE ON MY ROW says "nothing
happens when they arrive" is the next row: a crew arriving at a base you HOLD is a RAID (LIFE+CITY's raid picture is in
VOTE, COMBAT's board is cut from that block). That agrees with round three's default (a base falls only from what the
player does): an arrival at a base you hold is an offer and ONE fight the player answers, never an automatic loss; a
crew arriving at a base you do not hold still does nothing. NOT BUILT THIS ROUND, DESIGNED: an arrival is an EDGE (the
parties module's `arrived` going false to true, at the base's own cell), so the read is arrivals(before, after) over two
party lists and not a stored flag, and the base marker can carry `at`; I build it when the offer has a row (LIFE+CITY and
COMBAT own its shape) rather than guess it. PROCESS NOTE: main moved three times mid-round; I pushed the module commit
FIRST so its sha was final and registered the card in a second commit citing that landed sha (the coordinator's sweep
found 18 vote items with no sha; the vote tab gate's first rule is that every item carries one). ROUTED (full list in the
record): LIFE+CITY blockHolder is "a lot of a part you hold" and heldBlocks is the base's size; COMBAT calls took/ruined
with `by`; DYNASTY [one then heirs] ownedBy; WORLD [future city] STILL reads the old per-cell ledger's netFor (point it at
BohemiaHomebases.netFor / ruinsThrough, then the old ledger can go); WORLD/ECONOMY base jobs and the six dark pumps;
RUN/COOK the gold ring from ownedBy, ground unpainted; PLUMBER BATTLE BROS H5 and the census file; [PENDING coordinator]
COLOUR IS TERRITORY vs 37e, my default unchanged. NEXT IN THIS LANE: [home bases] and [territory ledger] stay CLAIMED.
(1) the arrival read when the raid's offer has a row; (2) rule 42a, the human combat factions and rosters, WITH PEOPLE
(COMBAT [bestiary] owns the data file); (3) a base's job facts on the marker once WORLD/ECONOMY resolve the dark pumps;
(4) when RUN's map is up, cut my border and ground ink if it still draws; (5) when a raid exists, inline the module and wire
the save. Three of my VOTE cards now wait on him (the fourteen bases, the crews heading at bases, this one).
Record: records/BOHEMIA_HOME_BASES_ROUND_FOUR_THE_HELD_PARTS_LEDGER_9_30_26.md.

FACTIONS (factions-ovkjpf): 9/29 (round 48) LATEST -- *** [home bases] ROUND THREE: THE WORLD ALREADY WANTS TO RAID
AND NOTHING ANSWERS. [crews exist] WAS ALREADY TRUE AND IS CLOSED BY MEASUREMENT. *** The old first line of this lane
(coordinator 9/16, "no crew has ever been on the map") measured false on the live alpha at a fresh boot: 4 of the 28
parties are crews, their tracks read at all 4 of their own cells, and it is the same four on three node valleys
(seeds 12345, 1337, 7). Closed SHIPPED by measurement, original text kept (rule 11). THE FINDING WITH TEETH: what the
four crews are heading at is a RIVAL'S HOME BASE (Caravans at the Cartel, Cartel at the Remnants and the Caravans,
Remnants at the Cartel), and on arrival advance() flips arrived and turns them round: nothing happens. The world
already has intended raids pointed at fourteen bases that have no state to receive one. BUILT (engine only, rule 18
hold and the map untouched): engine/bohemia_homebases.js markers now carry a party's destination line (to, the cell it
is heading for right now) and leg (the parties module's own legOf), and each base's threat (who is coming for it: a crew
that is OUT, at that base's own cell, not its holder's; derived, sorted, ids only; a crew going home, the holder's own
crew, a ruin, and a crew whose own base fell all threaten nobody), plus ownedBy() for rule 39c (first home base unlocks
the second generation) and 40b (build only in a settlement you own). Gate HOME BASES 75 checks, red 29 ways. THE COOK,
in VOTE: FOUR CREWS ARE ALREADY WALKING AT SOMEBODY'S BASE (vote/FACTIONS_WHO_IS_COMING_FOR_WHOM_9_29.html, id
factions-crews-are-heading-at-bases-9-29): real frames of the game's own map: south-east as it is, drawn from the list
(thin line per crew, thick dashed with an arrow for the four going to take something, red rings on the three bases a crew
is heading at), and the whole valley. MY DEFAULT, rule 39a, a thumb: a base falls only from what the player does until
he says otherwise (a valley that rewrites itself unseen changes the economy under him and the future is computed from
HIS past); it also answers QUESTS QR-R's "siege when the company is absent": a siege waits for the company. MEASURED ON THE
LIVE SEED, and it is a finding against the law's own sentence: 4 of 14 bases make any power (Network 2, Cartel the dam,
Trades 1, Volunteers 1), lit wire held by name runs Network 67 down to Anarchists 0 and Homeless 0, and ALL SIX PUMPS ARE
DARK at boot, so "each powering and watering its own blocks" (37e) is true of a few and false of most, and ECONOMY Q47's
"Anarchists hold all the live water" reads as nobody has live water now (likely WORLD's 9/27 clusters ruling, not proved,
one seed, needs the city to measure). A base's JOB is a data gap, not a picture gap: routed to WORLD and ECONOMY, none
invented. HOW THE FRAME WAS MADE: driver toMap() lands on the SKY rung, so skyExit() first, city at 70,68, TW 8; parties
advanced 0.06 of a waking day through the game's own partiesAdvance (at 0.15 two crews had already turned home and the
threat correctly vanished); the overlay wraps render(); positions through the game's own iso(). ROUTED: RUN [bb map] and
COOK [bb map art] draw from markers() (to = line, leg, threat = ring), following the RIDERS pattern in
tools/bohemia_city_work_patch.py with a patch of their own; I do NOT touch the map's renderer while RUN is rebuilding it.
DYNASTY [one then heirs] reads ownedBy for the first-home-base unlock; LIFE+CITY [build a lot] reads it for "a base you
own". PLUMBER: BATTLE BROS H5 goes red for any lane with an unpushed engine diff (the lab it guards was retired 9/4) and
is green after the push; the ENGINE CENSUS gate rewrites records/BOHEMIA_ENGINE_CENSUS.json on every run and dirties the
tree with other lanes' modules (I restored it, never committed it); PARTIES MOVE's browser leg waits for the removed wake
card (#daycardIn .dcgo). [PENDING coordinator]: COLOUR IS TERRITORY (8/26, gate faction_colour_gate.js) still says a
faction's colour is its ground and 37e says nothing on the map is drawn as territory colour; my default for both is the
colour lives on the base banner, the party banner and the light, the ground stays unpainted, and the border, ground ink
and their gates are re-aimed not deleted blind; I left them alone because RUN is in that code. NEXT IN THIS LANE:
[home bases] and [territory ledger] stay CLAIMED. When RUN's map is up, look at it and, if the border and ground ink
still draw, cut them (my code, rule 40f lifted the hold for the map); when a raid exists (COMBAT), inline the module
and wire the save. Record: records/BOHEMIA_HOME_BASES_ROUND_THREE_WHO_IS_COMING_FOR_WHOM_9_29_26.md.

FACTIONS (factions-ovkjpf): 9/28 (round 47) LATEST -- *** [home bases] ROUND TWO: THE MARKER LIST IS BUILT,
AND ROUND ONE'S FINDING WAS WRONG, AND THAT WAS MINE. *** Round one closed the row SHIPPED after the school half alone
(rules 6 and 11: it also dropped his ruling from the line); reopened to CLAIMED first thing this round, ruling restored.
ROUND ONE'S FINDING, "28 parties already beat his 'way more than fourteen'", compared us to his guess and never measured
Battle Brothers. Measured now, from search snippets (dev blog, wiki, Steam are egress-blocked): BB PUBLISHES NO FIXED PARTY
COUNT; every location, settlements and hostile camps alike, BUYS parties out of its own resources and sends them out
(smaller ones fewer), a camp is weaker until its party returns, players report a group every one to two days; a typical
map is 17 settlements across three houses; the "24 and 40" a mod mentions is a warband's SIZE, not a count. Fixed in the
library (reference/library/battle_brothers/01_WORLDMAP.md, PARTIES AT ONCE). THE REAL FINDING, in our own code: THE 28
PARTIES ARE A FIXED ROSTER. bohemia_parties.all() runs once at boot, every party walks to its destination and back for
ever, nothing buys, loses or replaces one; only the SEND half of WORLD's "Places BUY and SEND" row exists. So a base that
fell would keep sending patrols out of a ruin. Also live: day one has every party standing ON its base (none advanced),
after two waking days 24 of 28 are away, at most 10 cells; ctBases() equals derive() 14 for 14, one definition, no drift.
BUILT (engine only, rule 18 hold untouched): engine/bohemia_homebases.js + gates/homebases_gate.js (HOME BASES, 59
checks, red 20 ways by mutation). Fourteen whole bases (held, yours, taken, ruined), a per-act ledger in the century
module's shape (took, ruined, heldBy at an act, netFor and ruinsThrough signed for the derive: raided falls), the hard
ones late in an act off his own DEPTH thirds (openAt = DEPTH minus camp: a camp from the start, a town a third in, a
fortress two thirds in; progress is the CALLER's, absent means null), PARTIES LEFT (a party exists because its base
still holds it; empty ledger silences nobody), and markers(): ids, classes and numbers, never a sentence, gate-refused.
THE DEAD-SHAPE GATE LEG: the logic reads no cell, grid or turf, and nothing but the named few files touches the
superseded 9,216-cell ledger. THE COOK, in VOTE: THE FOURTEEN HOME BASES ON THE MAP (vote/FACTIONS_THE_FOURTEEN_HOME_BASES_9_28.html,
id factions-the-fourteen-home-bases-9-28): real frames of the game's own map, same camera: as it is / the list / a raid /
the north pile close up before and after / early, a third in, two thirds in. Measured on it: at the map's current zoom
6 of the 14 markers overlap another (north pile at 6.3 to 13.4 px), which is the map's pixel count, not the list.
HOW THE PICTURE WAS MADE, for the next cook: driver toMap() lands on the SKY rung ('REGION'), where skyValley clips half
the valley under the horizon and ctBases diamonds are not drawn where you think; call skyExit(), set city to 48,48 and
panY 22, then wrap render() so the overlay follows every redraw (the map draws on demand, no loop); positions are the
list's x,y through the game's own iso(); advance the parties with the game's own partiesAdvance(waking*2) or all 28
hide under their bases; a ruin must draw last or Network covers the Mob; quantizing the PNGs to 160 colours washed the
crew colours out (kept full colour, 2x downscale instead). RETIRED with it: two of my own stale VOTE cards (the
two-ladders ask died with rule 37e, round one's card carried the wrong claim), and [track leg] (rule 38b removed the walk it
spoke on; not built: shipping a polish fix to a killed surface twice over is STOP PRODUCING). ROUTED: WORLD [future
city] (bohemia_future.js) still reads the OLD ledger's netFor in its territory field: point a bases field at
BohemiaHomeBases.netFor / ruinsThrough, which is the "raided falls" number it says it cannot read; WORLD [parties move]
owns the missing BUY half, partiesLeft is the seam; COMBAT [bb fight] calls took() and ruined() when a raid ends;
RUN [bb map] and COOK [bb map art] draw from markers(); UI [settlement screen] reads state and raidable; QUESTS [the
siege] SHIPPED QR-R this round, read it before the siege state is added. WHEN THE HOLD LIFTS, my own code: the map still
paints per-lot territory ink and a border ([who holds], [colours fixed], 9/6), which rule 37e says must not be drawn as
territory colour: it leaves the play surface then. [PENDING coordinator] CLAUDE.md's pillars paragraph still says the
house-sized fight tile is dead for good; VAMILY rule 38's own correction the same hour says A COMBAT TILE IS A HOUSE
stands. Two live files disagree. NEXT IN THIS LANE: [home bases] and [territory ledger] stay CLAIMED. Next round: each
base "doing a different thing" as facts on its marker, power and water, read off minesFor and the pumps and handed in
(Homeless holds 254 of 308 generating cells, Anarchists all the live water: two bases already differ), never typed;
then the derive reading the new ledger once WORLD wires it. WHAT WE DO DIFFERENTLY FROM BB (rule 39b) is in the record.
Record: records/BOHEMIA_HOME_BASES_ROUND_TWO_THE_MARKER_LIST_9_28_26.md.

FACTIONS (factions-ovkjpf): 9/28 (round 46) LATEST -- *** [home bases] SHIPPED, SCHOOL ONLY. (CORRECTED IN ROUND 47: it was not SHIPPED, and its central claim was wrong; see round 47 above.)
His third votes item 5 killed the 9,216-cell painted territory ledger: "TERRITORY IS NOT A
MECHANIC; HOME BASES AND ROAMING PARTIES ARE." Measured live on the running alpha instead of
guessing: 28 parties already roam the map right now (14 patrol, 10 caravan, 4 crew -- already
"way more than fourteen," his own bar), and all 14 crew seats already carry a real district
kind and tier off BohemiaTowns.derive() (Mob sits a resort at fortress tier, Cartel sits
storage at fortress tier, Church sits a chapel at town tier). THE FINDING: the seats and
parties were never the broken part. The 9,216-cell painted layer was. Full record:
records/BOHEMIA_HOME_BASES_NOT_TERRITORY_SCHOOL_9_28_26.md (Battle Brothers 01/09 cited,
real-world cartel/gang-geography sources cited, routed to COOK [tile options] for the
settlement screen and COMBAT [bb fight] for the roaming-vs-seated fight distinction).
engine/bohemia_turfledger.js and gates/turf_ledger_gate.js marked SUPERSEDED in place (banner
at the top of each) rather than moved or deleted, because gates/three_acts_gate.js (WORLD's,
already shipped) hard-requires the engine file directly -- moving it would have broken a
cross-lane gate that is not mine to touch. The empty-ledger-no-op property already proven by
the gate means the banner-only change alters nothing a player sees. NOT SHIPPED THIS ROUND:
the trackSay/[track leg] fix from the previous round, on purpose -- rule 38 (FULLY COMMITTED,
9/28) killed tile-to-tile city walking "immediately," twice over in the same commit, and
[track leg]'s whole purpose was polishing that now-dead surface. Shipping it anyway would
have been the STOP PRODUCING violation (finding a legal way to ship a dead feature), not a
fix. Left OPEN for whenever party-tracking gets a real home (inside the settlement screen or
the map marker system) -- not decided this round, flagged here so the next round does not
reinvent it. NEXT IN THIS LANE: the actual raid/build mechanism off the seats+parties data,
with WORLD and COOK [tile options], per rule 37e's own routing.

FACTIONS (factions-ovkjpf): 9/27 (round 45) LATEST -- *** THIS VALLEY ALREADY TRACKS TWO
SEPARATE RANKINGS OF CREW TRUST, AND NEITHER ONE HAS EVER HEARD OF THE GROUND YOU HOLD. A
FAVOUR COUNT (BohemiaBelonging) and A BUILD-PERMISSION RUNG (TERRITORY -> MANDATE -> MAYOR)
are both real, both on a card already in the game, and BOTH HAVE EXACTLY ONE WRITER: A
QUEST RESOLVING. Holding a crew's ground, losing it, paying or refusing their rent: none of
it touches either ladder. AND QUESTS JUST WENT RESEARCH-ONLY (rule 35), so both ladders just
lost their only future source of new inputs. ***
Nothing to judge outside the VOTE tab.

VAMILY rows: [territory ledger] CLAIMED 9/24, round two still blocked by the hold (see
            below). [bb houses] CLAIMED 9/27, round two of school done. [horror signs]
            ENDED 9/24. [same lender] still CLAIMED AND HELD under 14b + 18b.
Record: records/BOHEMIA_TWO_LADDERS_NEITHER_READS_GROUND_9_27_26.md
Round 44: records/BOHEMIA_TERRITORY_SURVIVES_THE_REBUILD_9_27_26.md
Round 43: records/BOHEMIA_BB_HOUSES_ROUND_1_SCHOOL_9_27_26.md

*** [bb houses] ROUND TWO: DOES TERRITORY EVER MOVE STANDING? MEASURED, NOT ASSUMED ***
  Battle Brothers ties standing to land: a house trusts you partly because you hold or
  defend its ground. Checked whether ours does.
  LADDER ONE, THE FAVOUR COUNT: BohemiaBelonging.gaveOf(). Its own comment names both
  writers: a quest resolving in a crew's favour, and the peripheral act on a card. Read
  record() and every caller: EXACTLY TWO WRITERS, BOTH QUEST-DRIVEN (plus a decay that only
  ever subtracts).
  LADDER TWO, THE RUNG: rungRead(), shown on the WHERE YOU STAND card as YOUR RUNG
  (TERRITORY -> MANDATE -> MAYOR, build permission) and THE VALLEY (N of 16 crews with you).
  Reads DQ.shared.faction, which has ONE writer in the whole codebase: a quest script's own
  @DO faction NAME +n line. Grepped every other path, none exists.
  MEASURED: holding a fortress/town/camp -- no effect on either ladder. Losing it -- no
  effect. Paying rent on time -- no effect. Refusing rent, taking the cut lights -- no
  effect. The territory ledger recording a block changing hands -- read by NEITHER.
  BOTH LADDERS ARE REAL, BOTH ARE ON SCREEN, BOTH ARE WIRED TO EXACTLY ONE INPUT: A QUEST
  RESOLVING. And rule 35 (this round) just made QUESTS research-only, no more game code
  ever -- so both ladders just lost their only future source of new inputs. This lane's own
  ledger already knows every block that changes hands and has never been asked a question by
  either one.
  I ALMOST MISLABELLED THE FIRST SCREENSHOT: opened a richer card than expected and nearly
  narrated "YOUR RUNG: TERRITORY" without reading rungRead() first, which would have been
  the same guessed-accessor mistake caught three times already this session. Read the source
  before writing a word; two minutes, no guess.

THE COOK: slices/vote/FACTIONS_TWO_LADDERS_NEITHER_READS_GROUND_9_27.html, registered
  factions-two-ladders-neither-reads-ground-9-27. A real screenshot of the actual WHERE YOU
  STAND card (rule 32f), a small diagram of the three wires (one connected, two crossed
  out), and the measured table.

WHAT THIS ROUND DID NOT DO: did not touch either ladder's code (how much a block should be
  worth in trust is his ruling, not a measurement, MECHANISM-MINE/CONTENTS-PAOLO'S), did not
  touch the walked-surface file, still off-limits while WORLD/LIFE+CITY/RUN/COMBAT rebuild
  it under rule 34.

GATES  ART 45 16/0. REFERENCE CHECK 183/0 (the two inherited reds from last round are gone
       -- another lane fixed them, not this one). HANDOFF and pre-push pass green.
       RULE 13: full suite 107 red at ad23d875, none of them this lane's.

RULE 18 AND RULE 22, OBSERVED: nothing pushed to the demo or the alpha's play tabs.

NEXT IN THIS LANE
  1. [bb houses] round three: with the two ladders and the wire named, the actual PROPOSAL
     (once he rules whether he wants it): territory feeding standing needs one clean rule,
     not an ad hoc number -- e.g. every night a block's rent is PAID moves the favour count
     the same way a quest's small peripheral act does, and a REFUSED rent moves it the
     opposite way. That is a genuine creative fork with no defensible default (how much,
     which direction, whether refusing rent should also cost the rung) -- [PENDING Paolo]
     candidate, not built without his word.
  2. [territory ledger] round two, THE SAVE HALF: toJSON/load still have no caller, still
     blocked by the walked-surface hold (~line 56609, beside purse: and century:).
  3. [territory ledger] the read-through wiring: two lines, both carriers, gate already
     proves the no-op on all 9,216 cells.
  4. STILL TRUE AND UNOWNED: nothing in this game takes ground, so the ledger records zero
     rows. Not this lane's to invent; what it costs is his.
  THE STANDING DEBT: COMPARE EVERY PIECE OF ART TO THE WORLD, still unrun.

STILL OPEN, NONE OF IT THIS LANE'S
  [FOR WHOEVER DRAWS THE MAP] the map asks turfAt ZERO times. Handed over with numbers.
  [FOR WHOEVER OWNS BohemiaBelonging/rungRead] both standing ladders are quest-only and
  quests just went research-only. Handed over with numbers, not a formula.
  [FOR PLUMBER / RUN] PAGES PUBLISH at 268 MB against a 260 MB cap; 67 MB of dead weight
  itemised by this lane six rounds ago. Raised six times.
  [FOR WORDS / WHOEVER OWNS trackSay] `leg` computed by tracksAt and thrown away; 2:1 BACK.
  [FOR WORLD, water lifted] the pumps lift ZERO litres: needPerDay() returns 0.
  [INHERITED] faction_towns P27; partiesNear() has no callers at all.
  [FOR DIRECTION / COOK] AR-005: the widest zoom is a declared placeholder sky.
  [FOR CHARACTER / COOK] faction_outfit 16/2: Blues and Trades 0.0085 apart on a 0.035 bar.
  [INHERITED] city_memory_gate 33/1, pack_gate 46/1, both reproduced on clean main.

[PENDING Paolo] -- SIX NOW, ONE NEW
  1. DOES A DEBT CROSS THE FOLD -- CLOSING: ruled 9/13, and [same lender] carries it.
  2. THE PLANT. If "the plant" in his towns law is a GENERATOR, every fortress makes power
     off its own seat. That authors canon about the money supply, so not taken.
  3. Anarchists, Colorful and Custom are called non-territorial and still hold ground.
     (THREE INDEPENDENT MEASUREMENTS: 100% of the running water, the highest share of lit
     ground of any crew, and they drop a tier by act 3.)
  4. What it COSTS to be seen with one of the four hidden factions.
  5. COLOUR CLASHES: Mob beside Reds, Network beside Blues, Church beside Trades.
  6. NEW: should territory (holding ground, paying or refusing rent) ever move either
     standing ladder, and if so how much and in which direction. A genuine fork, no
     defensible default, this round's finding.

FIFTY-SEVEN STANDING LESSONS THIS LANE KEEPS RE-LEARNING
  BEFORE ASSUMING A ROW IS BLOCKED, CHECK WHETHER ITS NAMED BLOCKER IS STILL TRUE.
  WHEN A CHECK GOES RED, ASK WHETHER IT IS MEASURING THE GAME OR ITS OWN INVENTION.
  WHEN HIS SENTENCE IS FALSE ON THE MAP, REPORT IT rather than forcing it.
  A BLOCK OF CLAIMS BEHIND AN `if` THAT QUIETLY DOES NOT RUN IS A GREEN GATE.
  SHOWN, COUNTED AND NEVER SEEN IS THE SAME AS NOT BUILT.
  A LOAD THAT TIMES OUT IS A SYNTAX ERROR UNTIL PROVEN OTHERWISE.
  A BARE CATCH AROUND A FUNCTION THAT DOES NOT EXIST IS A CONFIDENT WRONG ANSWER.
  A GLOBAL THE RENDERER PUBLISHES AND NEVER CLEARS REPORTS THE LAST DRAW.
  A GREP PROVES THE CODE EXISTS AND PROVES NOTHING ABOUT THE GLASS.
  CHECK THE INSTRUMENT BEFORE YOU BELIEVE ITS NEGATIVE.
  AN EMPTY READING CAN BE THE TRUTH.
  BEFORE BELIEVING A RED, ASK WHETHER THE CHECK CAN STILL GET TO THE THING IT IS JUDGING.
  A CLAIM'S PREMISE CAN GO STALE WITHOUT ANYONE TOUCHING IT.
  STOP INVENTING IDENTIFIERS. Grep the name AND the SHAPE.
  A NEGATIVE RESULT IS WORTH SHIPPING WHEN IT IS BOUNDED AND MECHANICAL.
  WHEN A NEW LAW LANDS, COUNT HOW FAR THE BUILT THING ALREADY IS FROM IT.
  THE BEST COOK DRAWS AN ANSWER THE GAME ALREADY HAS.
  BEFORE YOU BLAME YOUR OWN DIFF FOR A RED, TAKE YOUR OWN FILES OUT AND RUN IT.
  CONFIRM A PUSH BY ANCESTRY, NOT BY WHAT THE PUSH COMMAND PRINTED.
  A VERDICT THAT KILLS THE PICTURE DOES NOT KILL THE QUESTION IT WAS ASKING.
  AN INSTRUMENT ONLY CHECKS THE AXIS YOU BUILT IT FOR.
  A CORRECTION GOES BESIDE THE WORD IT REPLACES, NEVER UNDER IT.
  WHEN A NEW LAW LANDS, ASK WHAT IT MAKES ANSWERABLE IN YOUR OWN LAYER.
  HOW A FUNCTION IS PASSED IS NOT ITS SIGNATURE. A wrong accessor does not fail, it AGREES.
  BEFORE YOU DRAW SOMETHING FOR A GAME, PHOTOGRAPH THE GAME.
  READ THE COMMENT, NOT THE THUMB.
  A FALLBACK CONSTANT IS NOT A MEASUREMENT.
  A HASH DIFF ON A LIVE SCENE PROVES NOTHING. People move.
  A MEMORY CAN EXIST AND STILL BE INVISIBLE. Count the reads before promising he will see it.
  TAKE THE SHAPE THAT IS ALREADY IN THE REPO.
  A NUMBER TAKEN ON THE WRONG FRAME IS NOT A MEASUREMENT EVEN WHEN IT IS THE RIGHT NUMBER.
  CHECK WHAT REACHES THE GLASS BEFORE BUILDING ANOTHER SYSTEM BEHIND IT.
  A BIG RULE LANDING IS NOT AUTOMATICALLY A BIG RULE FOR EVERY LANE.
  WHEN A SISTER LANE'S REBUILD IS IN FLIGHT, THE SAFEST WORK IS THE WORK THAT DOES NOT
  TOUCH THEIR SURFACE YET.
  *** A GUESSED LABEL IS STILL A GUESS EVEN WHEN THE SCREENSHOT IS REAL. *** A card opened
  with fields whose meaning I had not confirmed, and it would have been easy to narrate
  "YOUR RUNG: TERRITORY" as something it was not. Reading the source before writing a word
  about a real frame is the same discipline as before drawing one; the frame being genuine
  does not make the caption automatic.

--------------------------------------------------------------------------------

FACTIONS (factions-ovkjpf): 9/6 (round 10) LATEST -- *** [enemies unite]
BB-COALITION SHIPPED, this lane's half. WORLD built the coalition and the card;
formed() had ONE CALLER in the whole game and it was that card. Now a member of
either side actually treats you like it. *** Nothing to judge.

VAMILY row: [enemies unite] BB-COALITION (with WORLD), MODE: BUILD, SHIPPED 9/6 388284d6.
Record: records/BOHEMIA_A_COALITION_YOU_CAN_MEET_9_6_26.md
WORLD's half: records/BOHEMIA_THE_WORLD_GETS_ORGANISED_9_6_26.md (aace2d9)

WHAT THE JOINT HALF WAS
The row's sentence is "the enemies who were spending their strength on each other
POINT ALL OF IT AT YOU". WORLD made the coalition form and named it on the
STANDING card. Nothing else in the game asked. ctAgainstMe -- the organ deciding
whether a body watches you, keeps near you, refuses you or blocks a door -- reads
only their outfit versus yours and their own opinion of you. So the card could say
AGAINST YOU: Cartel + Remnants and a Remnant in the street stayed neutral.

WHAT SHIPPED. A third reason in bohemia_against: their outfit joined a quarrel
that was not theirs. Worst of the three wins; the coalition only explains itself
when it IS the reason. THE LEVEL IS COPIED OFF THE ALLY, never invented -- joined
a war, at war; joined a grudge, a grudge. No fourth level, and a coalition of
people who merely dislike you cannot manufacture a war.

ON THE WALKED SURFACE
  clean run                   Cartel: nothing
  two enemies who also
    hate each other           Cartel + Remnants forms
  either member reads         hostile / joined  (watch, keep near, refuse)
  an uninvolved Church        nothing
  peace with the Cartel       Remnants back to nothing

*** THE FAULT TO REMEMBER. *** The first cut read the ally's level from
ctRelToMine, which is OUTFIT VERSUS OUTFIT -- and a player with no outfit of their
own has no ripples, so it returned null for both members and did nothing WHILE THE
PAIR HAD REALLY FORMED. formed:["Cartel+Remnants"] and readCartel:"nothing" in the
same measurement. A coalition forms off rungStandings, the DEED LEDGER, so that is
the axis its level must come from.

AND A GREP IS NOT A TEST. The first version of the gate claim about that fault was
a grep; it went red on its own string arithmetic while the behaviour was correct.
THREE SEPARATE FAULTS THIS SESSION PASSED GREPS WHILE THE THING DID NOTHING (the
town-sizes panel rendering nothing, the buttons reading 0x0 behind the splash, and
this). Drive the surface.

GATES  coalition 38/0 (was 28), faction between 182/0, turf 43/0,
       faction towns 48/0, demo build 25/0, alpha loads 20/0

[PENDING Paolo] -- THREE, ALL CARRIED, NOTHING NEW
  1. Anarchists, Colorful and Custom are called non-territorial by his own notes
     and still hold ground. Should they at all?
  2. What it COSTS to be seen with one of the four hidden factions, or taken for
     one. (WORLD also carries: what a coalition should DO beyond pointing the same
     strength at you.)
  3. FOUR COLOUR CLASHES he can SEE on the map: Mob #db1800 beside Reds #db1900,
     Network #4a8ddb beside Blues #0052db. Blues and Reds keep theirs by name, so
     Network and Mob are squatting. Also: is the Cartel drab on purpose? The law
     names two drab factions, the gate carries three.

NEXT IN THIS LANE (top unblocked, in order)
  [broke raiders]  BB-UNPAID-TURNS-PREDATORY -- the row BB-COALITION itself names
    as its pair: "an outfit that loses its income goes roving, and a roving outfit
    is who somebody else recruits"
  [repeat interval]  ENCOUNTER-REPEAT-INTERVAL -- already decided, needs the dial
  [block rent]  THE-BLOCK-PAYS-ITS-OWNER -- payTo() answers who you pay for any
    block and the Network's circuits are already flagged free

--------------------------------------------------------------------------------

FACTIONS (factions-ovkjpf): 9/6 (round 9) LATEST -- *** [light owners]
NAME-THE-CIRCUIT-OWNER SHIPPED. The row said "needs Paolo" and it did not: the
blocker had shipped in this lane, and the rest was one sentence in his own file
that nobody had read. *** Nothing to judge.

VAMILY row: [light owners] NAME-THE-CIRCUIT-OWNER, MODE: BUILD, SHIPPED 9/6 8cc0c6ad.
Record: records/BOHEMIA_THE_LIGHTS_SAY_WHOSE_THEY_ARE_9_6_26.md

*** THE LESSON, AND IT IS THE SECOND ROW RUNNING. *** Two rows in a row were
marked "needs Paolo" and neither did. [town sizes] needed a DOOR, not a ruling.
[light owners] named "who holds what" as its blocker, and who holds what shipped
in this same lane hours earlier. BEFORE ASSUMING A ROW IS BLOCKED, CHECK WHETHER
ITS NAMED BLOCKER IS STILL TRUE.

WHAT WAS MEASURED
204 lit circuits, 42 could name a faction (21%). The other 162 answered with a
CATEGORY -- settlement 113, network 34, solar_lone 15 -- against Paolo 9/4 LOCKED
"every part of the valley is owned by a faction".

THE SENTENCE NOBODY HAD READ
bohemia_powergrid.js said naming the `network` circuits was "A GUESS ABOUT HIS
CANON, NOT A READING OF IT". bohemia_belonging.js, the NETWORK rule, his words:
  hold: "The feed, the radio repeaters, and THE LIT GRID. They are the reason a
         message crosses the valley in an hour instead of a day, AND THEY HAVE
         NEVER ONCE CHARGED FOR IT."
It is a reading. It is now asked, never typed: the city scans his belonging rules
for whoever's `hold` names the lit grid, so moving it in that file moves this.

*** AND THE SECOND HALF IS A CONSTRAINT [block rent] MUST NOT BREAK. *** "Never
once charged", said twice. 23 circuits are marked free and payTo() answers NOBODY
for them. [block rent] is the next row worth taking and its premise is that the
generator owner charges every household -- it would have billed the Network.

MEASURED ON THE WALKED SURFACE
  circuits naming a faction        37  ->  60
  circuits the Network holds        5  ->  28
  circuits marked free              0  ->  23
  circuits that know their ground        173 of 173
  circuits that can name who you pay     150 (the rest are free)

WHAT IS STILL NOT NAMED, ON PURPOSE: settlement and solar_lone are not factions.
They carry GROUND instead, so an unowned circuit still says whose land it is on --
a different fact from whose wire it is, and the one [block rent] needs.

THREE FAULTS, AND THE FIRST IS THE ONE TO REMEMBER
1. LOAD ORDER. The grid-holder was resolved to a VALUE at build time, and the city
   builds its power map AT LOAD while the module carrying his sentence is inlined
   further down the same file. Measured: name null, 34 circuits anonymous, 0 free,
   while a direct call answered perfectly. LATE-BIND ANYTHING THE CITY NEEDS AT
   LOAD -- pass a function, ask when needed. Same shape as the CLOUTMOD bug.
2. A bare ctCanonFaction reference would have thrown ReferenceError at load and
   taken the whole grid with it: it is declared in a LATER SCRIPT BLOCK, where
   hoisting does not reach. Use typeof.
3. The module resync reported UNRECOGNISED for the powergrid, because the engine
   file was edited twice without committing so the embedded body matched a state
   git had never seen -- the tool finds the old body by walking history. If that
   happens: replace the embedded span directly, then COMMIT so it tracks again.

GATES  turf 43/0 (was 36/0), faction towns 48/0, faction between 182/0,
       rung pays 21/0, demo build 25/0, alpha loads 20/0

[PENDING Paolo] -- THREE, ALL CARRIED, NOTHING NEW
  1. Anarchists, Colorful and Custom are called non-territorial by his own notes
     and still hold ground. Should they at all?
  2. What it COSTS to be seen with one of the four hidden factions, or taken for
     one.
  3. FOUR COLOUR CLASHES he can now SEE on the map: Mob #db1800 beside Reds
     #db1900, Network #4a8ddb beside Blues #0052db. Blues and Reds keep theirs by
     name, so Network and Mob are squatting. Also: is the Cartel drab on purpose?
     The law names two drab factions, the gate carries three.

NEXT IN THIS LANE (top unblocked, in order)
  [enemies unite]  BB-COALITION  (with WORLD)
  [broke raiders]  BB-UNPAID-TURNS-PREDATORY
  [block rent]  THE-BLOCK-PAYS-ITS-OWNER -- payTo() now answers who you pay for
    any block, and the Network's circuits are already flagged free for it

--------------------------------------------------------------------------------

FACTIONS (factions-ovkjpf): 9/6 (round 8) LATEST -- *** [town sizes]
TOWN-TIERS-ARE-HIS SHIPPED. He can move any faction's town size from the DIRECT
tab and the walked city agrees the same second. *** Nothing to judge.

VAMILY row: [town sizes] TOWN-TIERS-ARE-HIS, MODE: BUILD, SHIPPED 9/6 a04fc969.
Record: records/BOHEMIA_HE_CAN_MOVE_A_TOWN_9_6_26.md

THE ROW SAID "needs Paolo" AND IT DID NOT
Its own brief is two halves: "the draft tiers off act1_power ship; HE MOVES ANY
FACTION HE LIKES." The first shipped 9/5. The second was missing, and it was not
a ruling -- it was a door. Nothing waits on him now.

WHAT SHIPPED. Tab: DIRECT, a fourth mode beside CUTSCENES / QUESTS / STANDING.
Fourteen rows, four chips each (FORTRESS / TOWN / CAMP / WORK IT OUT), every chip
44px. He is choosing a CONSEQUENCE, not a label -- each row prints what the tier
buys, read off the real modules:
  fortress 11 of 11 goods, 7 blocks across
  town      8 of 11 goods, 5 blocks across
  camp      4 of 11 goods, 3 blocks across
WORK IT OUT is the default and a real choice: it returns the faction to DERIVED
rather than freezing today's answer, so re-ranking somebody in the graph moves
their tier instead of leaving it disagreeing with canon.

*** THREE FAULTS HID BEHIND SOURCE CHECKS THAT ALL PASSED. READ THIS BEFORE
BUILDING ANOTHER PANEL IN THE ALPHA. ***
1. window.BohemiaTowns IS NOT IN THE ALPHA. It is inlined in the walked city and
   nowhere else. Any dial that needs an engine module must ASK THE CITY and render
   the reply -- the STANDING dial's own comment says why in full, and retyping the
   rule into the alpha is the second-copy drift this lane keeps deleting.
2. dirRender RETURNS. Its shared branch for dial modes calls dirDial() and
   returns, and dirDial() hides the host unless the mode is 'standing'. A new dial
   mode must be wired INSIDE that branch, not next to the call in the message
   listener.
3. EVERY BUTTON READS 0x0 BEHIND THE SPLASH, because #app is display:none. THIRD
   TIME THIS SESSION that ruler has lied. Tap #front before measuring anything.

THE SHIP TEST, DRIVEN ON A REAL CANVAS
  Colorful (act1_power 1) reads "worked out from strength: CAMP - sells 4 of 11"
  press FORTRESS -> "YOURS: FORTRESS - sells 11 of 11"
  the walked city, asked with its OWN module -> fortress/11
  press WORK IT OUT -> back to CAMP - sells 4 of 11, save cleared

GATES  faction towns 48/0 (was 33/0), faction between 182/0, turf 36/0,
       faction colour 17/0, demo build 25/0, alpha loads 20/0

[PENDING Paolo] -- THREE, ALL CARRIED FORWARD, NOTHING NEW
  1. Anarchists, Colorful and Custom are called non-territorial by his own notes
     and still hold ground. Should they at all?
  2. What it COSTS to be seen with one of the four hidden factions, or taken for
     one. Nothing answers it.
  3. FOUR COLOUR CLASHES, and he can now SEE them on the map: Mob #db1800 beside
     Reds #db1900, Network #4a8ddb beside Blues #0052db. Blues and Reds keep
     theirs by name, so Network and Mob are the ones squatting. Also: is the
     Cartel drab on purpose? The law names two drab factions, the gate carries
     three.

KNOWN RED AND NOT THIS LANE'S: faction_outfit 16/2 (Blues/Trades silhouettes
0.009, mean 0.070). VERIFIED on a clean checkout of origin/main with none of this
work -- identical numbers. It is a SHAPE problem and the alpha's own comment
already documents it. Do not chase it from here.

NEXT IN THIS LANE (top unblocked, in order)
  [light owners]  NAME-THE-CIRCUIT-OWNER -- says "needs Paolo (who holds what)",
    and who holds what SHIPPED 9/6: turfAt answers every cell and the border is
    drawn and coloured. Worth re-reading before assuming it is blocked.
  [enemies unite]  BB-COALITION  (with WORLD)
  [crossing costs]  THE-WRONG-COLOUR-REACTS -- has a real border AND a real
    colour to cross now; the last four rows were feeding it

--------------------------------------------------------------------------------

FACTIONS (factions-ovkjpf): 9/6 (round 7) LATEST -- *** [colours fixed]
COLOUR-AUDIT SHIPPED. Every faction already HAD a colour and it was locked inside
a browser; three rows were stopped on it. It is a published number now and the
map paints it. *** Nothing to judge.

VAMILY row: [colours fixed] COLOUR-AUDIT, MODE: BUILD, SHIPPED 9/6 0160c71.
Record: records/BOHEMIA_HIS_COLOUR_ANSWER_WAS_LOCKED_IN_A_BROWSER_9_6_26.md
Law: laws/BOHEMIA_LAW_COLOUR_IS_TERRITORY_8_26_26.md

WHAT WAS WRONG WAS NOT THE COLOURS, IT WAS THE REACHABILITY
He ruled colour on 8/26 and answered it garment by garment. That answer existed
ONLY as rendered pixels: faction_colour_gate reached it by launching a browser
and counting cloth, and nothing in the game could, because the RGB ramps live in
the alpha and the city carried a grep count of NOUGHT. Blocked on it: FACTIONS
[who holds] (drew borders in a two-colour language and said so), UI [owner shown],
COOK [border marked]. The last two are FREE NOW.

WHAT SHIPPED
tools/bohemia_faction_colour.js measures his wardrobe, writes
engine/BOHEMIA_faction_colours.json and inlines it into the city beside the
faction graph. Re-written every run, never one-shot. It takes NO colour decision.
  Blues 210 #2d5fb3   Colorful 90 #60a136   Mob 0 #572f2a   Reds 0 #773229
  Church 30 #826c3e   Anarchists 30 #573f2a  Caravans 30 #6c5b41
  Remnants 60 #4c5238 Network 210 #465362    Trades 150 #496558
  Homeless / Cartel / Volunteers: drab
THIRTEEN, NOT FOURTEEN -- Custom has no wardrobe entry by design.

*** IF YOU DRAW WITH THESE, LIFT THEM. *** The measured average is the colour of
CLOTH, dyed to be worn in daylight. The Mob's #572f2a is nearly black on a night
overmap. The map keeps the HUE exactly (that is the part that is his) and pushes
value and saturation up. Drab factions get the map's gold, because a border in
their average grey is invisible -- that is the law's exemption, not a shortcut.

THE AUDIT, AND WHY ALMOST NONE OF IT WAS FIXED
The law draws the line: the machine may fix a CONTRADICTION, never TASTE.
  FOUR CLASHES: hue 30 Caravans/Anarchists/Church, hue 210 Blues/Network,
  hue 0 Reds/Mob. NOT ONE is between two factions his canon puts in any relation
  -- measured against his graph, every clashing pair is `none`. The law's research
  is that colour is OPPOSITIONAL, so two ENEMIES in one hue is a lie about his
  graph and two strangers in one hue is a coincidence. Nothing is urgent.
  If he ever does move them: Blues owns 210 and Reds owns 0 BY NAME (test 4), so
  Network and Mob are the ones squatting.
  FIXED: PINNED_CLASH was 5 for a true count of 4. The gate had been printing
  "lower it to 4 so it cannot slide back" and nobody had. A ratchet that has
  slipped is not a ratchet.
  FOUND AND NOT FIXED: the gate's drab exemption names THREE factions and the law
  names TWO. The Cartel was added to the list and not to the law. Now printed
  every run rather than sitting silent, and the list cannot grow while it waits.

TWO BROKEN RULERS THIS ROUND, AND ONE WAS MINE
1. faction_outfit came back 16/2. VERIFIED ON A CLEAN CHECKOUT OF origin/main
   with none of this work: identical numbers (Blues/Trades 0.009, mean 0.070).
   Inherited, a SILHOUETTE problem, and the alpha's own comment already documents
   it. Not this lane's.
2. fps came back 32/3 at 4.2fps -- run beside six other browser gates. Run alone:
   35/0. SEVEN CONCURRENT CHROMIUMS MEASURE THE BOX, NOT THE GAME. Do not run the
   frame-rate gate in a parallel batch.

GATES  faction colour 17/0 (was 9/0), faction between 182/0, turf 36/0,
       demo build 25/0, alpha loads 20/0, fps on a phone 35/0 (alone)

[PENDING Paolo] -- THREE NOW
  1. Anarchists, Colorful and Custom are called non-territorial by his own notes
     and still hold ground. Should they at all?
  2. What it COSTS to be seen with one of the four hidden factions, or taken for
     one. Nothing answers it.
  3. FOUR COLOUR CLASHES, and now he can SEE them: on the map the Mob is #db1800
     beside the Reds' #db1900, the Network #4a8ddb beside the Blues' #0052db.
     Also: is the Cartel drab on purpose? The law names two drab factions, the
     gate carries three.

NEXT IN THIS LANE (top unblocked, in order)
  [crossing costs]  THE-WRONG-COLOUR-REACTS -- has a real border AND a real colour
    to cross now; this is the row the last three were feeding
  [repeat interval]  ENCOUNTER-REPEAT-INTERVAL -- already decided, needs the dial
  [power territory]  A-FACTION-MINES-ITS-LAND

--------------------------------------------------------------------------------

FACTIONS (factions-ovkjpf): 9/6 (round 6) LATEST -- *** [hidden factions]
THE-OTHER-FOUR SHIPPED. Four factions in his own graph could never appear on a
single person, and each already had a line nobody could hear. All four are now
reachable AND hearable on the demo. *** Nothing to judge.

VAMILY row: [hidden factions] THE-OTHER-FOUR, MODE: BUILD, SHIPPED 9/6 f554a28.
Record: records/BOHEMIA_THE_FOUR_THAT_HOLD_NO_GROUND_9_6_26.md

WHAT THE ROW ASKED FOR FIRST WAS A MEASUREMENT, AND IT WAS DAMNING
5,148 people, 566 affiliated, across EXACTLY the fourteen selectable outfits.
Pures, Panthers, La Familia and Triads: ZERO people, four authored lines, none
of them hearable.

IT WAS NOT A BUG. factionOf reads the fourteen SEATS and his graph gives these
four none, correctly -- he types them `social_force` and the note says "MEMBERS
INSIDE OTHER FACTIONS. Larger in act1 (crash drove identity clustering), fixed
ceiling, stagnant across acts." Not a place. A hidden second affiliation. No
bigger base list could ever have reached them.

*** THE PART THAT MATTERS MOST IF YOU TOUCH THIS. ***
WHICH ONE ORGANIZES A BLOCK is derived. WHO BELONGS is never read off a person.
The obvious reading of four identity-supremacist groups is that membership
follows heritage; the game models no heritage (personOf carries a look seed, an
id seed, a language, a role) and inventing one to assign somebody to a
supremacist group would be authoring the most sensitive content in his canon.
Geography is what his own note describes -- "identity CLUSTERING" -- and the gate
locks it structurally: one person walked across the map comes back as more than
one of the four, which a heritage rule could not do. DO NOT "improve" this by
adding an ancestry field.

MEASURED
  people who could carry one      0 of 5148  ->  94 (1.83%)
  of the four, reachable                  0  ->  4 of 4
  authored lines a player can hear   0 of 4  ->  4 of 4
  rich half of the valley                        0.81%
  poor half                                      2.19%
  blocks with one organizing them       1968 of 9216 (21.4%)
  block-level spread                    515/491/482/480, even

Panthers 55 against Triads 6 is REPORTED, NOT TUNED. The block draw is even; the
imbalance is that Panthers landed on populous blocks. Flattening it would erase
the geography that makes the layer mean anything. Worth watching whether a player
can go a whole game without meeting a Triad.

TWO THINGS THAT WOULD HAVE SHIPPED WRONG
1. THE POVERTY SCALING WAS DEAD ON ARRIVAL. It asked how rich a block is as a
   SHARE OF THE RICHEST, and the richest is the Strip: 2,267,749 against a second
   place of 209,223. Everything else rounded to zero, so a scale built to
   separate rich from poor put 5,049 of 5,148 people in ONE BUCKET. It is a RANK
   now. Any future "how good is this ground" question should use worthRank, never
   worth over max.
2. A CARRIER COULD NOT SAY ANYTHING. The bucket went below bucket(person.role),
   which answers for everybody. 40 carriers, six acts each, 240 askings, ZERO
   lines. This organ already carries a paragraph on the identical defect for
   reactions.

GATES  faction between 182/0 (new pass V, on the demo file a stranger opens),
       faction membership 74/0 (extended, not duplicated), turf 36/0

[PENDING Paolo] -- TWO NOW
  1. Anarchists ("territorially inconsistent"), Colorful ("Community-based not
     territorial") and Custom ("Player faction. No preset philosophy") are told
     by his own notes NOT to hold ground, and still get a seat and a territory.
     Whether they should hold ground AT ALL is his ruling.
  2. WHAT THE FOUR DO TO YOU. They exist and can be met; what it COSTS to be
     seen with one, or to be taken for one, is unwritten. That is a real fork
     about the game, not a number.

NEXT IN THIS LANE (top unblocked, in order)
  [colours fixed]  COLOUR-AUDIT -- worth more than it was: UI [owner shown] and
    COOK [border marked] are both blocked on a faction colour number that does
    not exist anywhere outside the alpha's wardrobe
  [crossing costs]  THE-WRONG-COLOUR-REACTS -- has a real border to cross now
  [repeat interval]  ENCOUNTER-REPEAT-INTERVAL -- already decided, just needs the dial

--------------------------------------------------------------------------------

FACTIONS (factions-ovkjpf): 9/6 (round 5) LATEST -- *** [who holds]
EVERY-DISTRICT-HAS-AN-OWNER SHIPPED. Every border in the valley now runs along
something a player can see: 65.7% -> 100%. *** Nothing to judge.

VAMILY row: [who holds] EVERY-DISTRICT-HAS-AN-OWNER, MODE: BUILD, SHIPPED 9/6 8bf3a91.
Record: records/BOHEMIA_A_BORDER_YOU_CAN_SEE_9_6_26.md
Ruling it rests on: records/BOHEMIA_RULING_WHO_HOLDS_WHAT_9_5_26.md

WHAT WAS ALREADY TRUE AND THIS ROW DID NOT REDO
BB-TURF (9/5) gave every cell an owner. 100% coverage was already there. This row
was about the EDGES, which nothing had ever looked at.

WHAT SHIPPED
holderOf() is a scaled Voronoi, so a border landed wherever two seats balanced --
a diagonal through the middle of a block with nothing on the ground to explain
it. Measured before: 466 of 709 borders on something you can see; 243 cutting
across open buildable ground. And the shares were an artifact: Network 2195
cells, Volunteers FOUR.
THE UNIT OF OWNERSHIP IS NOW A BLOCK, NOT A CELL. Cut the valley along everything
a player can see (road, freeway, rail, water, mountain, desert) and 465 blocks are
left, each ringed by visible edges. A block is owned whole, so a border can only
fall on the skeleton -- two buildable cells that touch are in the same block by
construction. STRUCTURAL, not tuned. There is no number in this rule to nudge.
Draft order: his HOLDS override, then a capital holds its own block, then
factions pick by act1_power strongest-first, each pick the most valuable
unclaimed block TOUCHING ground they already hold.

MEASURED
  borders on something you can see   466/709 (65.7%)  ->  2372/2372 (100%)
  smallest faction holding           4 cells          ->  331 cells
  resort+strip cells held by the Mob                      199 of 199
  act1 -> act3 cells changing hands                       37.1%
  build cost, cached with the valley                      128ms once

TWO THINGS WORTH CARRYING
1. WORTH: TWO RULERS WERE WRONG BEFORE THE THIRD WORKED. Counting BUILDINGS ranks
   trailer parks (26.9/plot) above casinos (4) -- a resort is one huge building, a
   trailer park thirty tiny ones, so it measures fragmentation. Counting BUILT
   TILES ON A CELL puts `strip` at ZERO, because the strip district IS the
   boulevard. Right answer: built tiles summed over a BLOCK, where the boulevard
   rides along with the 118 resort cells beside it. Both wrong versions would have
   shipped as features.
2. A CAPITAL CAN SIT ON SOMEBODY ELSE'S GROUND AND IT IS NOT A BUG. The gate
   asserted every seat owns its block; the world said no three times. The reflex
   was to shove seats apart until the sentence came true. His own canon had
   already written it: the Volunteers are "resource-poor by design. Nobody wants
   to be seen attacking them, even Cartel stays hands-off." The claim changed, not
   the world. turf() now reports its guests.

WHAT THIS UNBLOCKS, AND THE ONE WALL BOTH WILL HIT
UI [owner shown] THE-CITY-SHOWS-WHO-OWNS-IT and COOK [border marked]
THE-BORDER-WEARS-ITS-COLOUR both name this row as their blocker. Both are now
free: turfGrid() answers per cell off one flat array and the border is a real set
of edges, every one on a landmark a painter could paint.
*** THERE IS NO FACTION COLOUR NUMBER IN THIS REPO. *** A faction's colour is
implied by its GARMENTS (FACTION_LOOKS in the alpha: COBALT SNEAKERS, RUST BOOTS,
OLIVE SHOULDER MANTLE) and the RGB ramps those resolve to live in the alpha and
NOWHERE ELSE -- the city file carries zero of them. faction_colour_gate gets its
answer by rendering cloth in a browser and counting pixels, which no draw loop
can do. First job for either row: lift the ramps somewhere both surfaces reach
and derive a hue per faction FROM HIS OWN WARDROBE, never by picking one.
That is also why the border this row drew on the MAP is in the map's existing
two-colour language (yours against theirs) rather than in the holder's colour.

GATES (on the merged tree)
  TURF                 36 / 0   (extended, not duplicated: the before number is
                                 measured in the same loop as the after)
  FACTION TOWNS        33 / 0
  COLD BOOT            11 / 0
  FPS ON A PHONE       35 / 0
  RUNG PAYS            21 / 0
  FACTION MEMBERSHIP   60 / 0
  STANDING             35 / 0
  ALPHA LOADS          20 / 0

[PENDING Paolo] -- still one, unchanged from last round
  Anarchists ("territorially inconsistent"), Colorful ("Community-based not
  territorial") and Custom ("Player faction. No preset philosophy") are told by
  his own notes NOT to hold ground like the others. They still get a seat, and
  now a real territory, because the rule gives everybody one. Whether a faction
  his canon calls non-territorial should hold ground AT ALL is his ruling.

NEXT IN THIS LANE (top unblocked, in order)
  [hidden factions]  THE-OTHER-FOUR -- the four non-selectable factions: do they
    exist anywhere a player can meet them? measure, then place a presence or write
    [PENDING Paolo]
  [colours fixed]  COLOUR-AUDIT -- and it is now worth more than it was: two other
    lanes are blocked on a faction colour number that does not exist
  [crossing costs]  THE-WRONG-COLOUR-REACTS -- has a real border to cross now



--------------------------------------------------------------------------------

FACTIONS (factions-ovkjpf): 9/6 (round 4) LATEST -- *** [faction homes]
FACTION-SEATS SHIPPED. Every faction now sits on ground its own note names, and
the boot and the walked city name the SAME seats because there is now one placer
instead of two. *** Nothing to judge.

VAMILY row: FACTION-SEATS [faction homes], MODE: BUILD, SHIPPED 9/5 1ec213f.
Record: records/BOHEMIA_A_FACTION_SITS_WHERE_ITS_CANON_SAYS_9_5_26.md

WHAT SHIPPED
bootFactions zipped SORTED faction ids to an evenly-strided sample of a district
list that is 100% ordered by y, so the initials picked the latitude --
correlation(alphabetical rank, seat y) = 0.9966, Anarchists at y=2 and
Volunteers at y=83. Seats now sit on the kind of ground each faction's own note
names; the three factions his canon calls non-territorial get NO home and fall
back to spread; strongest picks first by act1_power; six cells apart, five off
the boundary, populated ground preferred, and all three of those yield to his
canon. One line in BohemiaTowns.SEATS moves any seat anywhere.

*** THE PART THAT MATTERS MOST AND IS EASY TO MISS: THE RULE LIVES IN
bohemia_towns.js, NOT IN bohemia_loop.js. *** The walked surface reads its seats
through BohemiaTowns.derive() -- powerSeats -> turfAt -> who owns every cell ->
the power grid. Putting the canon placer in the loop would have rebuilt the exact
defect FACTION-TOWNS spent a round killing, one layer up: ctBases() saying the
Mob lives on a resort while turfAt() still answered by the alphabet. derive() and
bootFactions now call the same placeHomes(). If you ever need to change where
factions sit, change it THERE, once.

MEASURED
  on ground his own note names, 5 seeds     1/55  ->  53/55
  seats on the valley boundary row              4  ->  0
  fewest residential districts within 8 cells   0  ->  23
  boot vs walked surface disagreement                0
  deterministic across boots                       yes

GATES (on the merged tree, main's tip underneath)
  FACTION BETWEEN     pass U, U1-U11
  FACTION ARC         101 / 0    (was 91/0 on main, 57/29 at my worst)
  FACTION TOWNS        33 / 0    (WORLD's gate, still green with the new placer)
  FACTION MEMBERSHIP   60 / 0
  STANDING             35 / 0
  COMMITMENT           72 / 0

FOUR BROKEN RULERS THIS JOB, AND THAT IS THE LESSON WORTH CARRYING
Every red this job produced was the measurement, not the target:
  1. the arc gate's SPARSE dial was setDial(1) -- a population where half the
     outfits do not exist, so the walk could not find them
  2. the fold button measured 0px because #app is display:none behind the splash;
     it was 44x174 the whole time
  3. commitment_gate D11 called whoHears with {ties} alone when BOTH real call
     sites in the city pass keyOf: ctVKey -- without it every "H1-1" in the
     valley is ONE PERSON and the social graph collapses to 241 names for 5194
     people. It was measuring a call the game never makes.
  4. faction_between U3 was correlation < 0.5 on FOURTEEN points, where |r| > 0.5
     happens by chance about one seed in fifteen. It went red on a change with
     nothing alphabetical in it. The available wrong move was to nudge the bound
     to 0.7. It is now causal instead: same maps, five seeds, old rule vs new
     rule, counting how often each lands a faction on ground its note names --
     53/55 against 1/55 -- plus an order-invariance test.
Before tuning anything to make a number move, check the number.

[PENDING Paolo] -- ONE, and it is real canon, not a preference
  Anarchists ("territorially inconsistent"), Colorful ("Community-based not
  territorial") and Custom ("Player faction. No preset philosophy") are told by
  his own notes NOT to hold ground like the others. They currently get a seat by
  spread alone because the row asked for one each. Whether a faction his canon
  calls non-territorial should hold ground AT ALL is his ruling.

NEXT IN THIS LANE (top unblocked, in order)
  [who holds]  EVERY-DISTRICT-HAS-AN-OWNER  -- the top of the lane, and the seats
    it needed now exist. The ruling is written (records/BOHEMIA_RULING_WHO_HOLDS_
    WHAT_9_5_26.md) and turfAt() already answers per cell off these seats; what is
    missing is the BORDER following something you can see (road, rail, wash, wall)
    and the holder's colour on the edge. Tab: MAP and CITY.
  [hidden factions]  THE-OTHER-FOUR
  [colours fixed]  COLOUR-AUDIT

--------------------------------------------------------------------------------

FACTIONS (factions-ovkjpf): 9/6 (round 3) LATEST -- *** [faction homes] ONE GATE
FROM DONE. ARC GATE IS GREEN AND BETTER THAN IT STARTED (101/0 against 91/0);
COMMITMENT GATE IS 69/3 AND THE REASON IS WRITTEN DOWN, NOT GUESSED. NOT PUSHED
TO MAIN, ROW STAYS CLAIMED. *** Nothing to judge.

VAMILY row: FACTION-SEATS [faction homes], MODE: BUILD, CLAIMED 9/5.
Work is on claude/factions-ovkjpf. MAIN IS GREEN AND STAYS GREEN.

WHAT IS BUILT AND MEASURED (unchanged, restated so this block stands alone):
bootFactions zipped SORTED faction ids to an evenly-strided sample of a district
list that is 100% ordered by y, so the initials picked the latitude --
correlation(alphabetical rank, seat y) = 0.9966, Anarchists at y=2 and
Volunteers at y=83. Seats now sit on the ground each faction's own note names
(FACTION_HOMES quotes the words each row rests on); the three factions his canon
calls non-territorial get no home and fall back to spread; strongest picks first
by act1_power; inland and populated ground preferred but HIS CANON WINS over
both. Correlation is now 0.0552, deterministic across boots, no two seats
stacked, baked into the walked city by the same rule. worldMap.factionSlots is a
ghost that two files claimed bootFactions used -- corrected in place.

GATES ON MY BRANCH:
  FACTION BETWEEN     174 / 0    (11 seat claims, three biting mutations)
  FACTION ARC         101 / 0    (was 91/0 on main, 57/29 at my worst)
  FACTION MEMBERSHIP   60 / 0
  STANDING             35 / 0
  COMMITMENT           69 / 3    <-- the only red, and it is mine (72/0 on main's
                                     seats, isolated by swapping only those files)

*** THE ONE THING TO PICK UP, AND IT IS A CONTRADICTION I MEASURED RATHER THAN A
GUESS. *** commitment_gate Ez picks its subject with a probe that climbs the wall
with the candidate and requires the climb to land. That probe reports landed:5 of
ceiling 5 for the ANARCHISTS. The real loop, on the same person, presses nine
times and the trace it now prints says:
    day 1  button ctgive   gave 0->1
    day 2  button MISSING  gave 1->1   (and every day after)
The Anarchists are a once-only outfit by his canon -- "be there ONCE, when it
matters" -- so the RUN is right and THE PROBE IS WRONG. Find why the probe climbs
where the run cannot; the presses report themselves now, so start from the trace.

THREE DIFFERENCES BETWEEN PROBE AND RUN WERE FOUND AND CLOSED, AND NONE WAS IT:
  the probe counted BUTTON PRESSES rather than standing gained, so a once-only
    act scored a full five (now requires the count to rise);
  the run climbed with ctClose/ctOpen while the probe used ctClose/ctSawCell/
    ctOpen (now matched);
  the run's ring started at [0,0], standing the player ON TOP of the person --
    ctAdjacent counts distance 0 as a match -- which the probe's ring never does
    (removed; OCCUPANCY LAW says one body per cell).
A TEST THAT PICKS ITS SUBJECT WITH ONE PROCEDURE AND THEN USES ANOTHER IS NOT
TESTING WHAT IT SELECTED FOR. All three were that shape and it is worth expecting
a fourth.

D11 (withLines:0) MAY NOT BE A BUG. It needs two affiliated people from DIFFERENT
outfits to share a workplace, and seats on canon ground spread the outfits apart.
faction_arc's own note already calls this class of thing WORLD/density, not this
lane. Named rather than tuned: moving MIN_APART until a number goes green would
be fitting the world to a test.

WHAT THE ARC GATE COST AND WHAT IT TAUGHT (kept because it is the lesson, not the
bookkeeping): every one of the 29 it broke was a walk that picks ONE subject and
reports the game broken when that subject cannot be read, or a FIXED NUMBER
standing in for a condition -- a 15-press cap that could not reach a ceiling that
moves, a 20-day drain that could not empty a count that grew. And the gate was
PINNED AT A POPULATION DIAL WHERE 7 OF THE 14 OUTFITS DO NOT EXIST, so six claims
were asking about people the pinned world did not contain. Pinned at 8 now, the
smallest dial where every outfit is present.

WHAT IS PENDING HIM: nothing new. Moving a seat is his, as the row says.
AFFILIATED_RATE (0.30) and REACH_CELLS (12) remain his.

--------------------------------------------------------------------------------

FACTIONS (factions-ovkjpf): 9/5 (round 2) LATEST -- *** [faction homes] STILL IN
PROGRESS. THE ALPHABET WAS DECIDING THE GEOGRAPHY OF THE VALLEY, AND THE GATE
THAT CAUGHT ME WAS PINNED TO A WORLD MISSING HALF ITS OUTFITS. NOT PUSHED TO
MAIN, ROW STAYS CLAIMED. *** Nothing to judge.

VAMILY row: FACTION-SEATS [faction homes], MODE: BUILD, CLAIMED 9/5.
Work is on claude/factions-ovkjpf. MAIN IS GREEN AND STAYS GREEN.

THE DEFECT (unchanged from round 1, restated so this block stands alone):
bootFactions zipped SORTED faction ids to an evenly-strided sample of a district
list that is 100% ordered by y, so the initials picked the latitude --
correlation(alphabetical rank, seat y) = 0.9966, Anarchists at y=2 and
Volunteers at y=83. Seats now sit on the ground each faction's own note names
(FACTION_HOMES quotes the words each row rests on); three factions his canon
calls non-territorial get no home and fall back to spread; strongest picks first
by act1_power. Correlation is now 0.0552. worldMap.factionSlots is a ghost that
two files claimed bootFactions used -- corrected in place, not deleted.

*** ROUND 2 WAS ALL GATE REPAIR, AND IT FOUND SOMETHING BIGGER THAN MY BUG. ***
faction_arc_gate was 91/0 on main, 57/29 at my worst, and is 92/5 now.

THE GATE PINNED ITS POPULATION AT A DIAL WHERE HALF THE VALLEY'S OUTFITS DO NOT
EXIST. Its own rule is right and is kept -- a test that depends on how many
people are in the world must PIN that number, the way it pins the seed -- but it
does not say pin it at 1; 1 was the default the day it was written. Measured on
the same seed over the roster it reads:
    dial  1   298 people    7 of 14 outfits present   Colorful  0
    dial  2   595           10                        Colorful  1
    dial  4  1189           11                        Colorful  3
    dial  8  2377           14                        Colorful  4
    dial 16  4486           14                        Colorful 11
So the Colorful's whole screening arc, an outfit with no act to compare, and the
coverage of every act type were asking about people the pinned world did not
contain. They passed only because the old seats happened to drop a base near the
few dial-1 people. NOTHING ABOUT BELONGING HAD CHANGED. Pinned at 8 now: the
SMALLEST dial with every outfit present, and smallest matters -- at 16 the roster
is 4486, every scan walks it, and the run went past its ten-minute budget.

AND THE OTHER HALF WAS ONE SHAPE REPEATED TEN TIMES: a walk that picks ONE
subject and reports the game broken when that one subject cannot be read. The
gate's own comment already knew it -- "ctOpen() shows whoever is actually
NEAREST, which is not always who you picked... The card was somebody else's" --
and that lesson had been applied in section F and nowhere else.
  __standBeside now ASKS ctAdjacent whether the subject is the one that opens
  instead of reimplementing its rule (my first version modelled the rule and was
  still wrong at half the sites; a second copy of a rule is a second chance to be
  wrong about it). __pickAffiliated is one shared picker, takes an optional
  predicate on the outfit, proves the stand before handing the subject over, and
  is bounded to forty tries per base because verifying is cubic. __standableOf
  finds a member of a NAMED outfit that can actually be read. Three call sites
  were hiding behind different variable names (back, c, an inline walkBack).
  B10 needed an outfit that GIVES FIRST -- his they-give-first shape, Cartel,
  Church, Network -- which the step's own comment already named as Cartel canon.

REMAINING 5, MEASURED, SO THE NEXT ROUND STARTS WARM:
  F2  CHURCH's name mechanic: cardButton and cardRest both null, so the scan
      never opened a Church member's card. Section F reads the card's own RUNS
      WITH row as its subject, which is right, but still walks outward from base
      centres and can miss an outfit. It wants __standableOf, which R1 now uses.
  J1-J4  The deep commitment walk reaches sided and stops:
      [{state:none, offered:"Say you are with them"}, {state:sided, offered:null}]
      The first wall offers a side, the second never offers the burn. Either the
      climb after siding does not reach the new ceiling, or the burn is offered
      only by an outfit shape this subject lacks -- the same question B10 was.

MY OWN GATE IS GREEN THROUGHOUT: FACTION BETWEEN 174/0, including 11 seat claims
(U1-U11) and three biting mutations: ignore the canon homes and U3/U4/U5/U6/U9
die; drop the edge inset and M2 dies; make seats non-deterministic and U7/U9 die.

WHAT IS PENDING HIM: nothing new. Moving a seat is his, as the row says.
AFFILIATED_RATE (0.30) and REACH_CELLS (12) remain his.

--------------------------------------------------------------------------------

FACTIONS (factions-ovkjpf): 9/5 LATEST -- *** [faction homes] IN PROGRESS. THE
ALPHABET WAS DECIDING THE GEOGRAPHY OF THE VALLEY. NOT SHIPPED, NOT PUSHED TO
MAIN, THE ROW STAYS CLAIMED. *** Nothing to judge.

VAMILY row: FACTION-SEATS [faction homes], MODE: BUILD, CLAIMED 9/5.
Work is on the session branch only. MAIN IS GREEN AND STAYS GREEN.

THE DEFECT, MEASURED ON THE REAL BOOT:
    correlation(alphabetical rank, seat y) = 0.9966
bootFactions zipped SORTED faction ids to an evenly-strided sample of the
district list, and that list is 100% ordered by y. So the initials picked the
latitude: Anarchists at y=2, Volunteers at y=83, for no reason except A comes
before V. The kinds were nobody's home either -- the Church on a suburb, the
Cartel on a solar farm -- while the generated map holds a chapel, an arsenal, a
police station, six dataforts and 118 resorts that nothing ever used.

AND worldMap.factionSlots IS A GHOST. bohemia_engine.js computes
_spreadPoints(14, beltway, ...) under a comment calling it "Faction base
placements", and TWO files (bohemia_agents.js and the walked city) assert that
bootFactions seats factions on it. It never did, and the live worldMap does not
carry the key: measured, factionSlots is 0. Both comments are corrected in place
rather than deleted -- same defect as __CITY_DIAL__ on 8/28.

WHAT IS BUILT: FACTION_HOMES in engine/bohemia_loop.js maps each faction to the
district kinds ITS OWN NOTE names, every row quoting the words it rests on --
the Mob "Controls the Strip", the Homeless "Sewer/tunnel HQ", the Remnants
"survivors incl Nellis", the Trades "Best for vehicle/solar/construction". A
wrong seat is therefore a MISREADING of his file that somebody can check.
WHERE HIS NOTE NAMES NO PLACE, NOTHING IS INVENTED: Anarchists ("territorially
inconsistent"), Colorful ("Community-based not territorial") and Custom ("No
preset philosophy") get no home and fall back to spread. Strongest picks first
using act1_power, which is his number. Seats prefer inland ground (a boundary
capital is clipped in the map render) and populated ground, but HIS CANON WINS
over both: the valley has ONE arsenal, ONE truckstop, ONE intake.
    11 of 14 sit on ground their own note names
    correlation 0.9966 -> 0.0552
    deterministic across boots, no two seats stacked
Baked into the walked city with the same rule (one rule, two surfaces).

*** AND IT IS NOT DONE, BECAUSE IT BROKE faction_arc_gate AND THAT IS MINE. ***
Measured rather than assumed: origin/main runs it 91/0 and my tree ran it 57/29.
It is now 74/8. Every claim I fixed was the same shape, and THE GATE'S OWN
COMMENT ALREADY KNEW IT: "ctOpen() shows whoever is actually NEAREST, which is
not always who you picked... The card was somebody else's." That lesson had been
applied in section F and nowhere else; eight other sites stood at `person.x + 1`
and assumed. It passed for weeks only because the old seats put every capital in
a dense suburb.
  __standBeside now ASKS ctAdjacent whether the subject is the one that opens,
  instead of reimplementing its rule (my first version modelled the rule and was
  still wrong at half the sites -- a second copy of a rule is a second chance to
  be wrong about it). __pickAffiliated is one shared subject picker that prefers
  somebody standing alone. Three call sites were hiding behind different variable
  names (`back`, `c`, an inline walkBack) and each reopened a stranger after a
  day roll.

THE REMAINING 8, AND WHY, SO THE NEXT ROUND DOES NOT START COLD:
C1, D3, F2 (coverage: an outfit with no act to compare, every act type pressed,
the Church's name mechanic) and N1-N3 (the Colorful's second question). All the
same shape: the walk must reach members of a SPECIFIC faction, and three seats
now sit where the city sim loads almost nobody.
    SEAT        people near it   its own members
      Trades          1500              435
      Blues           1400              375
      Church           205               65
      Cartel             5                0
      Reds               5                0
      Homeless           5                0
Cartel and Reds have THIRTY dense districts within eight cells and still load
five people, so DISTRICT DATA DOES NOT PREDICT THE CITY'S POPULATION and I
stopped tuning placement against a proxy that does not correlate. Custom reads 0
by design: ctOtherBases strips the player's own outfit.
NEXT ROUND SHOULD EITHER (a) find what actually drives local population in the
city sim and score seats on that, or (b) accept that some canon seats are thinly
populated and give the arc gate's coverage scans a way to reach a named faction
directly rather than by walking outward from base centres.

MY OWN GATE IS GREEN THROUGHOUT: FACTION BETWEEN 174/0 (was 160), including 11
new seat claims (U1-U11) and three biting mutations -- ignore the canon homes and
U3/U4/U5/U6/U9 die; drop the edge inset and M2 dies; make seats non-deterministic
and U7/U9 die.

AND THREE OLD CLAIMS WERE REWRITTEN RATHER THAN LOOSENED, because the world they
asserted no longer exists:
  K0 used to assert the DEAD ZONE was real (837 people near the spawn, none
  affiliated). The spawn zone now measures thousands affiliated, so it guards the
  CURE instead -- and keeps the anti-artifact half, empty cells must still be 0.
  S4 was MY OWN TRIPWIRE from 8/30 and it fired because the game got better: it
  asserted a demo player could reach ZERO affiliated people, and said in its own
  note that if that stopped being true somebody should know. Seats on canon
  ground put a chapel three cells from the spawn. My FIRST rewrite of it was
  still wrong (I asserted "nearest base >= 5", the same mistake in a smaller
  font); it now measures the distance to the faction THIS DAY'S DEED ACTUALLY
  PAYS, which is the property that justifies the cast-witness.
  K1's prose carried stale numbers and was corrected.

WHAT IS PENDING HIM: nothing new. Moving a seat is his, as the row says.
AFFILIATED_RATE (0.30) and REACH_CELLS (12) remain his.

--------------------------------------------------------------------------------

FACTIONS (factions-ovkjpf): 9/5 LATEST -- *** FAMILY. THE GENERATION TURNS, AND THE
VALLEY REMEMBERS WHAT GOT REPEATED. *** Nothing to judge.

TAB: **RUN** -> the OUTFIT board, under the outfits (what they still say about your
family). TAB: **DIRECT** -> STANDING -> FOLD A GENERATION (the instrument).

WHY THIS WAS THE WORK. CLAUDE.md's own top, his 8/28 ruling that the dynasty lives,
says a handoff INHERITS EVERYTHING the last life built and names the list: "compound,
STANDINGS, territory, the family tree, and the unhealed wounds". Standings are named
and they are this lane's. bohemia_standing.js has carried inherit() and legendOf()
since 8/20 and organ_reach has reported both reached by NOTHING ANYWHERE on every run
since. NEITHER COULD HAVE MEANT ANYTHING SOONER: inherit keeps only deeds with hops>0,
the ones somebody RETOLD, and a deed's loudness did not decide its hop budget on the
walked surface until 8/28 when the quest corpus started filling DEED_WEIGHT. The
dynasty half was waiting on the reputation half and nothing said so.

MEASURED THROUGH THE REAL ORGANS. 400 people over 40x40, one deed of each loudness,
gossiped ten rounds, then a generation folds:
    CLOUT       saw  gossiped   held  retold  CARRIED   died
      quiet       33        20     53      20       20     33
      notable     86        25    111      25       25     86
      risky      154        71    225      71       71    154
      reckless   285        60    345      60       60    285
*** AND THE RUN BEFORE THAT SAID inherit() CARRIED NOTHING AT ALL, at every loudness,
in every valley size. *** I had placed the valley with x=(i*7919)%W, y=(i*104729)%W,
which collapses onto a LATTICE LINE instead of filling the square, so almost nobody had
a gossip neighbour, so nothing was ever retold, so nothing could cross. I WAS ONE STEP
FROM FILING "the louder the deed the less survives" AS AN ENGINE BUG IN THE DYNASTY'S
OWN PREMISE. The tell was that the answer was TOO DRAMATIC: an organ whose every unit
test passes does not usually fail totally. WHEN A MEASUREMENT INDICTS SOMETHING THIS
OLD, MEASURE THE MEASUREMENT FIRST.
ONE OBSERVATION KEPT RATHER THAN FIXED: reckless (60) carries less than risky (71)
because at reach 24 nearly everybody is an EYEWITNESS, and an eyewitness cannot be told
what they already saw (gossip dedupes on actor+kind+turn). Saturation shrinks the pool
who can carry the story. The ordering quiet << notable < risky ~ reckless holds and the
7/21 CLOUT_WEIGHTS are HIS, so this is written down and NOT retuned.

WHAT SHIPPED: ctFold folds every mind through inherit. THE HEIR IS ALSO '@', which is
the ruling and not a shortcut -- a run resets you to nothing, a handoff is the opposite,
so keeping the id means every card and rung keeps working and reads the family history
as the player's own, which is exactly "you are born owing what your father owed".

FACTIONS (factions-ovkjpf): 9/5 LATEST -- *** FAMILY. THE GENERATION TURNS, AND THE
VALLEY REMEMBERS WHAT GOT REPEATED. *** Nothing to judge.

TAB: **RUN** -> the OUTFIT board, under the outfits (what they still say about your
family). TAB: **DIRECT** -> STANDING -> FOLD A GENERATION (the instrument).

WHY THIS WAS THE WORK. CLAUDE.md's own top, his 8/28 ruling that the dynasty lives,
says a handoff INHERITS EVERYTHING the last life built and names the list: "compound,
STANDINGS, territory, the family tree, and the unhealed wounds". Standings are named
and they are this lane's. bohemia_standing.js has carried inherit() and legendOf()
since 8/20 and organ_reach has reported both reached by NOTHING ANYWHERE on every run
since. NEITHER COULD HAVE MEANT ANYTHING SOONER: inherit keeps only deeds with hops>0,
the ones somebody RETOLD, and a deed's loudness did not decide its hop budget on the
walked surface until 8/28 when the quest corpus started filling DEED_WEIGHT. The
dynasty half was waiting on the reputation half and nothing said so.

MEASURED THROUGH THE REAL ORGANS. 400 people over 40x40, one deed of each loudness,
gossiped ten rounds, then a generation folds:
    CLOUT       saw  gossiped   held  retold  CARRIED   died
      quiet       33        20     53      20       20     33
      notable     86        25    111      25       25     86
      risky      154        71    225      71       71    154
      reckless   285        60    345      60       60    285
*** AND THE RUN BEFORE THAT SAID inherit() CARRIED NOTHING AT ALL, at every loudness,
in every valley size. *** I had placed the valley with x=(i*7919)%W, y=(i*104729)%W,
which collapses onto a LATTICE LINE instead of filling the square, so almost nobody had
a gossip neighbour, so nothing was ever retold, so nothing could cross. I WAS ONE STEP
FROM FILING "the louder the deed the less survives" AS AN ENGINE BUG IN THE DYNASTY'S
OWN PREMISE. The tell was that the answer was TOO DRAMATIC: an organ whose every unit
test passes does not usually fail totally. WHEN A MEASUREMENT INDICTS SOMETHING THIS
OLD, MEASURE THE MEASUREMENT FIRST.
ONE OBSERVATION KEPT RATHER THAN FIXED: reckless (60) carries less than risky (71)
because at reach 24 nearly everybody is an EYEWITNESS, and an eyewitness cannot be told
what they already saw (gossip dedupes on actor+kind+turn). Saturation shrinks the pool
who can carry the story. The ordering quiet << notable < risky ~ reckless holds and the
7/21 CLOUT_WEIGHTS are HIS, so this is written down and NOT retuned.

WHAT SHIPPED: ctFold folds every mind through inherit. THE HEIR IS ALSO '@', which is
the ruling and not a shortcut -- a run resets you to nothing, a handoff is the opposite,
so keeping the id means every card and rung keeps working and reads the family history
as the player's own, which is exactly "you are born owing what your father owed".
legendOf tells the two apart again because it counts ONLY deeds carrying `inherited`.
AND IT IS READABLE, on the OUTFIT board:
    WHAT THEY STILL SAY ABOUT YOUR FAMILY
      YOUR FATHER            2 STILL TELL IT
        Handed the tap to the trades. Daylight patch, every name on the work order.
The sentence is the quest's own @LOG line out of BohemiaDeeds.labels(), the same source
the card's reasons use, so the family's history and the day's gossip are never two
different voices. A row with no sentence is DROPPED rather than shown as a raw id. The
generation is written down (boh.city.gen): a dynasty that forgets which life it is on
when you close the tab is not a dynasty.

AND HE CAN TURN IT HIMSELF (8/12). DIRECT -> STANDING -> FOLD A GENERATION. How a
reputation crosses a generation is mine and built; WHEN one turns is a story decision
and HIS, and the game has no such beat yet, so without this the answer to "where does
he change this himself" is "he tells me and I edit a file", which is not shipped.
Proved end to end: first tap arms and warns, second tap folds, and the city answers
with what it COST -- "generation 2 - 2 still told, 2 died with the people who saw
them". IT ASKS TWICE ON PURPOSE: a fold cannot be undone and what it destroys is the
only record of what the player did. NOTHING FOLDS ON ITS OWN -- no timer, no act
boundary, no death.

THREE BROKEN RULERS IN ONE TURN, all producing a confident wrong number about somebody
else's code: the lattice-line valley above; the fold button measuring 0px tall (which
would have failed THE THUMB -- #app is display:none behind the front splash, so every
DIRECT element measures zero until it is tapped, and the button was 44x174 the whole
time, so the gate now dismisses the splash before it measures); and last turn's cast
read one level too shallow.

GATES: FACTION BETWEEN 163/0 (was 149) - DIRECT 33/0 - STANDING 35/0 - THE WHOLE DEMO
23/0 - DEMO BUILD 25/0 - ALPHA LOADS 20/0.
THREE MUTATIONS, ALL BITE: make the fold carry everything and T6/T7 die; show raw
machine ids and T9 dies alone; stop writing the generation down and T8 dies alone.
T1 AND T6 ARE THE CLAIMS THAT MATTER AND BOTH ARE ABOUT WHAT MUST NOT SURVIVE -- a gate
that only checked that something crossed would pass just as happily on a fold that
carried everything, which is the version that quietly turns a dynasty into a save file.
The demo carries only the `run` tab, so the dev fold control is unreachable there.

RECORD: records/BOHEMIA_FAMILY_THE_GENERATION_TURNS_9_5_26.md

STILL DEAD: BohemiaPeople.peopleOf and BohemiaDeeds.sayWhy (sayWhy is now superseded by
the surface reading labels() directly -- collapse to one path next time this is opened).
*** AND THE BIGGEST THING HOLDING THIS LANE DOWN IS NOT THIS LANE'S: THE DEMO DRAWS ONE
PERSON AT A TIME (measured 8/30, maxDrewAtOnce 1 with 34 people within six cells). That
caps EVERY witness set in the game at one person, so the whole loudness model -- reach,
hops, RECKLESS BEATS QUIET -- cannot express itself in play. RUN/WORLD's. ***

AND THERE IS A DYNASTY LANE (dynasty-w4yxiz) WORKING THE SAME PREMISE FROM THE OTHER
END, which this session did not know about until the rebase: it is RESEARCH ONLY on
what GEN 1 IS (the coyote's life, day 2 of it shipped 9/5). No collision -- they are
writing what a first generation's life looks like, this built the MECHANISM a handoff
needs, and the two meet at the moment the story finally turns a generation. Whoever
picks that beat up should read both records together.

WHAT IS PENDING HIM: nothing new. AFFILIATED_RATE (0.30), REACH_CELLS (12) and the 7/21
CLOUT_WEIGHTS remain his.

CONTAINER WARNING: this container has REWOUND THE WHOLE REPO to an older snapshot twice
in one session, remote refs included. Recovery is `git fetch origin main` (slow) then
`git checkout -B <branch> origin/main`. COMMIT EARLY AND OFTEN. Run gates in the
FOREGROUND, and a single Bash call is capped at 10 minutes, so one mutation per call.

--------------------------------------------------------------------------------

FACTIONS (factions-ovkjpf): 8/30 LATEST -- *** THE MAN WHO GAVE YOU THE JOB NEVER
FOUND OUT HOW YOU DID IT, AND IN THE DEMO NOBODY EVER COULD. *** Nothing to judge.

TAB: **RUN** (the demo's only screen). Play the day, resolve the job, then open the
OUTFIT board or read the card of anybody who runs with that outfit.

THE MEASUREMENT THAT MADE THE TURN, taken on slices/BOHEMIA_DEMO.html -- THE FILE A
STRANGER ACTUALLY GETS, not the workshop:
    34 people within six cells of the spawn ....... 0 affiliated
    61 people loaded in the whole valley .......... 0 affiliated
    30 cells to the nearest faction base
So a demo player could do the Trades' job perfectly and the Trades would never hear
of it. Everything this lane shipped on 8/27 and 8/28 -- the outfit's view, the quest
deeds, the card, the OUTFIT board -- was UNREACHABLE IN THE DEMO. Not a faction being
unimpressed: a system nobody can reach. MEASURING THE DEMO RATHER THAN THE BENCH IS
THE WHOLE REASON THIS WAS FOUND, and the UI lane's 8/30 turn is the precedent: twelve
of thirteen controls were under the thumb minimum ON THE DEMO while the bench looked
fine.

AND HIS FILES ALREADY SAID WHO IS IN THE SCENE:
    @ROLE lineman  REQ  faction=TRADES   block=browned
    @ROLE fixer    OPT  faction=NETWORK  met_before=false
53 of the 66 @ROLE lines in quests/bq carry an authored faction. REQ is not
decoration -- bohemia_bq.js FAILS THE BUILD on an unfilled REQ role -- and block=
binds the lineman to the very block the job happens on. A required character bound to
the place is IN THE SCENE. And the casting layer already existed and already worked:
measured 380 people around the Trades' ground, 109 of them Trades, both roles filled
with a real Trades lineman and a real Network fixer. NOTHING HAD EVER MADE THEM
WITNESSES.

WHAT SHIPPED, proved on the demo:
    before   members 0, whoSaw 0, rung null
    publish  witnesses 1
    after    value 0.8, rung NEUTRAL, members 1, whoSaw 1
    why      watched it: Handed the tap to the trades. Daylight patch, every name
             on the work order.
That last line is HIS OWN @LOG SENTENCE, on a card, in the demo.

WHY IT IS NOT THE KARMA IT REPLACES: 8/28's rule is that a faction learns nothing it
did not witness, and it stands. This does not widen it to the valley; it adds exactly
the people his own file marks REQUIRED. Optional roles are NOT added -- you may never
have met them, and a faction learning through somebody the player never encountered is
the omniscient karma this whole thing replaces.

WHAT I DID NOT DO: engine/bohemia_agents.js states its own honest limit, that the
job-site widening does NOT rescue a block 20 cells from everything, that this is a
fact about the map, and that papering over it there would be fitting the world to a
screenshot. That is right. NO BASE MOVED, NO MAP TOUCHED. AFFILIATED_RATE (0.30) and
REACH_CELLS (12) remain [PENDING Paolo].

TWO BUGS, BOTH MINE, BOTH FOUND BY PROBING THE REAL SURFACE:
  A. ctDayCast returns { q, day, cast:{role -> person} } AND I READ IT ONE LEVEL TOO
     SHALLOW. cast[role] found nobody and published witnesses:0 -- the same answer as
     "there is no cast", which is precisely the ambiguity this feature exists to end.
     A direct castAddresses call had been filling both roles the whole time.
  B. I STAMPED THE QUEST'S SPELLING ON THE MIND. The cast entry carries the role's
     REQUIRED faction (TRADES); every mind is stamped with ctFactionOf's answer (the
     canon id Trades); standingOf compares those STRICTLY. So the deed landed,
     witnesses:1, and whoSaw stayed 0 -- the faction filtered its own new witness
     straight back out. Fixed with ctCanonFaction, and THE FIX BELONGS AT THE STAMP
     rather than in standingOf: both sides of that compare are city ids by
     construction, and loosening it would only hide the next mis-stamp.
     ctCanonFaction answers null for a name no outfit has, so a typo in a quest stays
     visible instead of quietly becoming somebody.

GATES: FACTION BETWEEN 149/0 (was 137) - THE WHOLE DEMO 23/0 - DEMO BUILD 25/0 -
ALPHA LOADS 20/0 - FACTION ARC 91/0 - STANDING 35/0 - CITY BARKS 13/0.
Gate S runs ON THE DEMO FILE and does what the splash does (taps the real RUN tab),
because the demo has no tab bar. S4 ASSERTS THE PREMISE RATHER THAN REMEMBERING IT:
the demo player can reach zero affiliated people and the nearest base is 30 cells; if
that ever stops being true the reason for this feature goes away and a RED GATE should
say so rather than a record nobody re-reads.
THREE MUTATIONS, ALL BITE: stop making the required cast a witness and S6/S7/S8 die;
stamp the quest's spelling and S7/S8 die; drag optional roles in and S11 dies alone.
dayloop_gate is 57/2 and THAT PREDATES THIS -- verified against origin/main's own
city, identical 57/2.

RECORD: records/BOHEMIA_THE_MAN_WHO_GAVE_YOU_THE_JOB_8_30_26.md

FOUND AND NOT FIXED, NAMED SO IT IS NOT INVISIBLE:
  *** THE DEMO DRAWS ONE PERSON AT A TIME. *** maxDrewAtOnce 1 over a walk, with 34
  people within six cells. The draw loop has NO CAP, so this is the city reading as
  empty rather than a faction bug -- playtest-dispatch item 5, "the city is dead and
  DEAD IS NOT THE DEFAULT", which belongs to RUN/WORLD. IT ALSO CAPS EVERY WITNESS SET
  IN THE GAME AT ONE PERSON, so the whole loudness model (reach, hops, RECKLESS BEATS
  QUIET) cannot express itself. Worth somebody taking seriously.
  BohemiaStanding.inherit / legendOf -- the dynasty handoff, still dead, still needs a
  story moment the demo does not have, and the top of CLAUDE.md carries an open
  [PENDING PAOLO] on whether the dynasty lives at all. Not for a session to resolve in
  passing.

ALSO FOUND ON THE MERGED TREE AND NOT MINE TO FIX: the city carries STALE inlined
copies of engine/bohemia_watertreat.js and engine/bohemia_speedway.js (and railyard
on origin/main itself). ENGINE SYNC LAW: one canonical body per module, and a stale
inlined snapshot is the bug that meant nobody in Las Vegas had a faction for thirteen
days in August with every gate green. `python3 tools/bohemia_city_module_resync.py`
fixes it in one run. Left alone because those are WORLD's modules and a resync mid-
flight would move a system this session does not own -- ONE SYSTEM, ONE SESSION.

WHAT IS PENDING HIM: nothing new.

CONTAINER WARNING: this container has REWOUND THE WHOLE REPO to an older snapshot
twice in one session, remote refs included. Recovery is `git fetch origin main` (slow)
then `git checkout -B <branch> origin/main`. COMMIT EARLY AND OFTEN. Background
processes barely advance between tool calls -- run gates in the FOREGROUND, and note a
single Bash call is capped at 10 minutes, so one mutation run per call.

--------------------------------------------------------------------------------

FACTIONS (factions-ovkjpf): 8/28 (v) LATEST -- *** THE SWEEP THAT FINDS DEAD
ORGANS HAD NEVER LOOKED AT FIVE OF THEM, AND ONE OF THEM WAS THE OUTFIT'S VIEW
OF YOU. *** Nothing to judge.

TAB: **RUN**. Walk up to somebody who runs with an outfit and read their card.
Then open the OUTFIT board. Build 8/28v.

HOW IT WAS FOUND, WHICH MATTERS MORE THAN WHAT IT IS.
tools/bohemia_organ_reach.js exists to answer one question: does anything on the
walked surface actually call this. Its own docstring warns that "a module the
sweep does not know about is invisible to exactly that check, which is the rot
this file exists to kill, wearing the sweep's own uniform." Then its module
table was the thing carrying the rot. FIVE faction-family modules were inlined
in the walked page and had never once been swept -- bohemia_standing,
bohemia_known, bohemia_clout, bohemia_asking, bohemia_deeds. Found in ninety
seconds by `ls engine/` and diffing against the table. AN UNREGISTERED ORGAN IS
NOT MERELY UNCHECKED: the sweep actively certifies it as fine, because a green
summary reads as "everything is wired".

    BohemiaStanding  NOTHING ANYWHERE: standingOf, becauseOf, inherit, legendOf
    BohemiaDeeds     NOTHING ANYWHERE: publishStage, sayWhy, labels

RULE 4 WAS NEVER CALLED. bohemia_standing.js states four rules in its header;
three are running in the city. The fourth, verbatim: "A FACTION'S VIEW IS ITS
MEMBERS' VIEWS. standingOf() averages the opinions of the people who actually
belong to it." The city witnesses four deed kinds and every one is an organ this
lane built; ctWitnessPass records who saw you, ctGossipPass spreads it,
ctOpinionOf shows ONE PERSON'S private view on their card. So you could turn the
Church down in front of five of its people, all five would privately think less
of you, AND THE CHURCH AS AN OUTFIT HAD NO VIEW OF YOU AND NEVER WOULD. The
ladder in front of that door is BELONGING -- what you GAVE them. Two different
things have shared the word "standing" in this lane for a week and only one was
ever on the screen.

A LIVE COMMENT ASSERTED THE MISSING WIRING. __CITY_DIAL__ said filling
DEED_WEIGHT "lights up opinionOf, standingOf, becauseOf and the rungs with no
other wiring at all." opinionOf, true. The other two were called by nothing, so
his dial could fill the table perfectly and neither would ever run. Corrected in
place, not deleted -- one warning to the next reader.

WHAT SHIPS VS WHAT WAITS FOR HIS DIAL. DEED_WEIGHT still ships EMPTY and nothing
here fills it; the DIRECT tab's STANDING dial is where that decision lives. So
it NEVER PRINTS A RUNG -- rungFor(0) says NEUTRAL and printing it would invent
the judgement he has not made. BUT `members` is true today with an empty table:
a mind exists only for somebody you have been near, so it counts how many of
that outfit's people have been where you have been, and a headcount needs no
ruling. Measured on the real surface:

    RUNS WITH                 CARTEL
    THE CARTEL HAS SEEN YOU   1 OF ITS PEOPLE
      That is how many of them have been close enough to you to remember it.

and the same rows the moment he turns one dial, with no further wiring:

    WHAT THE CARTEL THINKS    HOSTILE - 1 OF ITS PEOPLE CARRIES SOMETHING
      Somebody in the CARTEL watched you turn an outfit down.

*** AND THE HONEST ANSWER TO THIS LANE'S OLDEST FINDING. *** 837 people near the
spawn, none affiliated, nearest base 29 cells. Still placement, still not mine,
four turns running. WHAT WAS NEVER DONE IS SAYING SO IN THE GAME:

    REMNANTS   HAS NEVER LAID EYES ON YOU

True at spawn for every outfit in the valley. No dial, no placement, no ruling.
It tells the player the outfit exists, that being seen is how it comes to know
him, and that it is not here. Bounded by skin in the game: an outfit gets a row
only if you have met one of its people OR given it something, so the board never
becomes a wall of fourteen zeroes.

THE ONE MODELLING DECISION. standingOf needs factionOfOwner(id) and ctFactionOf
takes a PERSON, which an id cannot be turned back into. So the outfit is STAMPED
on the mind in ctWitnessPass, the one place holding both. RE-STAMPED EVERY PASS
on purpose: what you know is who they ran with THE LAST TIME YOU SAW THEM, so a
vouch reads through next time you walk past and a lost place stops reading as
anything, with no second notification system. Rides ctMindSave's whole-object
JSON: no new save key, no migration.

THE PROBE LIED FIRST AND THE REASON IS REUSABLE. drew=0, minds=0, stamped=0 WITH
THE CODE WORKING. A probe on slices/BOHEMIA_CITY_WORLD.html measures a ghost
town: that page has no PLAYER_CV because the character bake is POSTED IN from
the alpha, so peoplePass returns before drawing anybody. Two more, both of which
would have produced a false result: THE CITY FRAME IS LAZY (every frame is
about:blank until the RUN tab is opened), and YOU HAVE TO WALK (ctWitnessPass
runs once per GAME minute and this world is I-MOVE-YOU-MOVE, so standing still
never advances the clock -- forcing CT_SAW_MIN open would measure the poke).

AND A GATE CLAIM FAILED WHILE THE FEATURE WORKED. Three claims went red reading
document.getElementById('card'), an element that does not exist; the card is
#ctcard. innerText was '' while the view object printed beside them already said
HOSTILE. FIX THE RULER, NEVER THE TARGET.

STILL DEAD, NAMED RATHER THAN QUIETLY LEFT:
  BohemiaStanding.inherit / legendOf -- reputation outliving the person who
    earned it, which is the dynasty premise. Needs the story's handoff moment,
    which does not exist in the demo yet.
  BohemiaDeeds.publishStage / sayWhy / labels -- the bridge from a quest outcome
    to who saw it. *** 82 FACTION DELTAS AND 203 CLOUT TAGS ARE AUTHORED ACROSS
    quests/bq/*.bq AND NO RUNNING SURFACE HAS EVER READ ONE OF THEM. *** The
    loudness half (reachOf/hopsFor) IS wired; the publish half is not, and the
    quest sources are not in the city frame at all. That is the quest runtime's
    surface, not this lane's -- named here so it stops being invisible.
  BohemiaPeople.peopleOf -- unchanged.

GATES: FACTION BETWEEN 122/0 (was 108) - FACTION ARC 91/0 - STANDING 35/0 -
FACTION MEMBERSHIP 60/0 - COMMITMENT 72/0 - ALPHA LOADS 20/0 - DEMO BUILD 25/0.
THREE MUTATIONS, ALL BITE: kill the stamp and seven claims die (Q4 Q5 Q7 Q8 Q9
Q10 Q11); print a rung with the table empty and Q6/Q7/Q12 die; drop the
never-seen outfit and Q12 dies alone.
THE 469-GATE SUITE CANNOT FINISH IN THIS CONTAINER -- 63 gates in ten minutes,
and background processes barely advance between tool calls, so everything here
was run in the FOREGROUND. Two reds surfaced in the partial pass and NEITHER IS
THIS CHANGE, checked rather than assumed: SOUND MESSAGE reads none of the files
this touches, and COMBAT SOUND is killshot-dependent and flaky -- 4/2 on
origin/main's own alpha, 6/0 on this tree, isolated by swapping just the alpha.

RECORD: records/BOHEMIA_THE_OUTFIT_NEVER_HAD_A_VIEW_8_28_26.md

WHAT IS PENDING HIM: nothing new. DEED_WEIGHT stays empty until he turns the
STANDING dial in the DIRECT tab, which is where that decision already lives.
AFFILIATED_RATE (0.30) and REACH_CELLS (12) remain [PENDING Paolo].

CONTAINER WARNING FOR WHOEVER IS NEXT IN THIS LANE: this session's container
REWOUND THE WHOLE REPO TO THE 8/15 COMMIT mid-turn, remote-tracking refs
included, and ate about forty minutes of finished work that had not been
committed. Recovery is `git fetch origin main` (slow, ~4 min on this repo) then
`git checkout -B <branch> origin/main`. COMMIT EARLY AND OFTEN HERE; do not hold
a change until the gates are green.


--------------------------------------------------------------------------------

FACTIONS (factions-ovkjpf): 8/28 (v) LATEST -- *** THE SWEEP THAT FINDS DEAD
ORGANS HAD NEVER LOOKED AT FIVE OF THEM, AND ONE OF THEM WAS THE OUTFIT'S VIEW
OF YOU. *** Nothing to judge.

TAB: **RUN**. Walk up to somebody who runs with an outfit and read their card.
Then open the OUTFIT board. Build 8/28v.

HOW IT WAS FOUND, WHICH MATTERS MORE THAN WHAT IT IS.
tools/bohemia_organ_reach.js exists to answer one question: does anything on the
walked surface actually call this. Its own docstring warns that "a module the
sweep does not know about is invisible to exactly that check, which is the rot
this file exists to kill, wearing the sweep's own uniform." Then its module
table was the thing carrying the rot. FIVE faction-family modules were inlined
in the walked page and had never once been swept -- bohemia_standing,
bohemia_known, bohemia_clout, bohemia_asking, bohemia_deeds. Found in ninety
seconds by `ls engine/` and diffing against the table. AN UNREGISTERED ORGAN IS
NOT MERELY UNCHECKED: the sweep actively certifies it as fine, because a green
summary reads as "everything is wired".

    BohemiaStanding  NOTHING ANYWHERE: standingOf, becauseOf, inherit, legendOf
    BohemiaDeeds     NOTHING ANYWHERE: publishStage, sayWhy, labels

RULE 4 WAS NEVER CALLED. bohemia_standing.js states four rules in its header;
three are running in the city. The fourth, verbatim: "A FACTION'S VIEW IS ITS
MEMBERS' VIEWS. standingOf() averages the opinions of the people who actually
belong to it." The city witnesses four deed kinds and every one is an organ this
lane built; ctWitnessPass records who saw you, ctGossipPass spreads it,
ctOpinionOf shows ONE PERSON'S private view on their card. So you could turn the
Church down in front of five of its people, all five would privately think less
of you, AND THE CHURCH AS AN OUTFIT HAD NO VIEW OF YOU AND NEVER WOULD. The
ladder in front of that door is BELONGING -- what you GAVE them. Two different
things have shared the word "standing" in this lane for a week and only one was
ever on the screen.

A LIVE COMMENT ASSERTED THE MISSING WIRING. __CITY_DIAL__ said filling
DEED_WEIGHT "lights up opinionOf, standingOf, becauseOf and the rungs with no
other wiring at all." opinionOf, true. The other two were called by nothing, so
his dial could fill the table perfectly and neither would ever run. Corrected in
place, not deleted -- one warning to the next reader.

WHAT SHIPS VS WHAT WAITS FOR HIS DIAL. DEED_WEIGHT still ships EMPTY and nothing
here fills it; the DIRECT tab's STANDING dial is where that decision lives. So
it NEVER PRINTS A RUNG -- rungFor(0) says NEUTRAL and printing it would invent
the judgement he has not made. BUT `members` is true today with an empty table:
a mind exists only for somebody you have been near, so it counts how many of
that outfit's people have been where you have been, and a headcount needs no
ruling. Measured on the real surface:

    RUNS WITH                 CARTEL
    THE CARTEL HAS SEEN YOU   1 OF ITS PEOPLE
      That is how many of them have been close enough to you to remember it.

and the same rows the moment he turns one dial, with no further wiring:

    WHAT THE CARTEL THINKS    HOSTILE - 1 OF ITS PEOPLE CARRIES SOMETHING
      Somebody in the CARTEL watched you turn an outfit down.

*** AND THE HONEST ANSWER TO THIS LANE'S OLDEST FINDING. *** 837 people near the
spawn, none affiliated, nearest base 29 cells. Still placement, still not mine,
four turns running. WHAT WAS NEVER DONE IS SAYING SO IN THE GAME:

    REMNANTS   HAS NEVER LAID EYES ON YOU

True at spawn for every outfit in the valley. No dial, no placement, no ruling.
It tells the player the outfit exists, that being seen is how it comes to know
him, and that it is not here. Bounded by skin in the game: an outfit gets a row
only if you have met one of its people OR given it something, so the board never
becomes a wall of fourteen zeroes.

THE ONE MODELLING DECISION. standingOf needs factionOfOwner(id) and ctFactionOf
takes a PERSON, which an id cannot be turned back into. So the outfit is STAMPED
on the mind in ctWitnessPass, the one place holding both. RE-STAMPED EVERY PASS
on purpose: what you know is who they ran with THE LAST TIME YOU SAW THEM, so a
vouch reads through next time you walk past and a lost place stops reading as
anything, with no second notification system. Rides ctMindSave's whole-object
JSON: no new save key, no migration.

THE PROBE LIED FIRST AND THE REASON IS REUSABLE. drew=0, minds=0, stamped=0 WITH
THE CODE WORKING. A probe on slices/BOHEMIA_CITY_WORLD.html measures a ghost
town: that page has no PLAYER_CV because the character bake is POSTED IN from
the alpha, so peoplePass returns before drawing anybody. Two more, both of which
would have produced a false result: THE CITY FRAME IS LAZY (every frame is
about:blank until the RUN tab is opened), and YOU HAVE TO WALK (ctWitnessPass
runs once per GAME minute and this world is I-MOVE-YOU-MOVE, so standing still
never advances the clock -- forcing CT_SAW_MIN open would measure the poke).

AND A GATE CLAIM FAILED WHILE THE FEATURE WORKED. Three claims went red reading
document.getElementById('card'), an element that does not exist; the card is
#ctcard. innerText was '' while the view object printed beside them already said
HOSTILE. FIX THE RULER, NEVER THE TARGET.

STILL DEAD, NAMED RATHER THAN QUIETLY LEFT:
  BohemiaStanding.inherit / legendOf -- reputation outliving the person who
    earned it, which is the dynasty premise. Needs the story's handoff moment,
    which does not exist in the demo yet.
  BohemiaDeeds.publishStage / sayWhy / labels -- the bridge from a quest outcome
    to who saw it. *** 82 FACTION DELTAS AND 203 CLOUT TAGS ARE AUTHORED ACROSS
    quests/bq/*.bq AND NO RUNNING SURFACE HAS EVER READ ONE OF THEM. *** The
    loudness half (reachOf/hopsFor) IS wired; the publish half is not, and the
    quest sources are not in the city frame at all. That is the quest runtime's
    surface, not this lane's -- named here so it stops being invisible.
  BohemiaPeople.peopleOf -- unchanged.

GATES: FACTION BETWEEN 122/0 (was 108) - FACTION ARC 91/0 - STANDING 35/0 -
FACTION MEMBERSHIP 60/0 - COMMITMENT 72/0 - ALPHA LOADS 20/0 - DEMO BUILD 25/0.
THREE MUTATIONS, ALL BITE: kill the stamp and seven claims die (Q4 Q5 Q7 Q8 Q9
Q10 Q11); print a rung with the table empty and Q6/Q7/Q12 die; drop the
never-seen outfit and Q12 dies alone.
THE 469-GATE SUITE CANNOT FINISH IN THIS CONTAINER -- 63 gates in ten minutes,
and background processes barely advance between tool calls, so everything here
was run in the FOREGROUND. Two reds surfaced in the partial pass and NEITHER IS
THIS CHANGE, checked rather than assumed: SOUND MESSAGE reads none of the files
this touches, and COMBAT SOUND is killshot-dependent and flaky -- 4/2 on
origin/main's own alpha, 6/0 on this tree, isolated by swapping just the alpha.

RECORD: records/BOHEMIA_THE_OUTFIT_NEVER_HAD_A_VIEW_8_28_26.md

WHAT IS PENDING HIM: nothing new. DEED_WEIGHT stays empty until he turns the
STANDING dial in the DIRECT tab, which is where that decision already lives.
AFFILIATED_RATE (0.30) and REACH_CELLS (12) remain [PENDING Paolo].

CONTAINER WARNING FOR WHOEVER IS NEXT IN THIS LANE: this session's container
REWOUND THE WHOLE REPO TO THE 8/15 COMMIT mid-turn, remote-tracking refs
included, and ate about forty minutes of finished work that had not been
committed. Recovery is `git fetch origin main` (slow, ~4 min on this repo) then
`git checkout -B <branch> origin/main`. COMMIT EARLY AND OFTEN HERE; do not hold
a change until the gates are green.


--------------------------------------------------------------------------------

FACTIONS (factions-ovkjpf): 8/28 (o) LATEST -- *** I SHIPPED A PROMISE
YESTERDAY AND NOTHING KEPT IT. Now it does. Nothing to judge. ***

TAB: **RUN**. Put somebody up for an outfit (INSIDE buys that, shipped
yesterday), then let your standing with that outfit fall to A STRANGER. They
lose their place. You find out by walking past them.

THE PROMISE. The vouch shipped with this on the card, in MY words:
    "It costs you a rung of your own standing to spend it, AND AFTER THAT WHAT
     THIS PERSON DOES IS YOURS."
MEASURED: nothing read the vouch bag except the line granting the faction. A
consequence written into a sentence and never built -- the exact bug this lane
spent a week finding in other people's code, introduced fresh twelve hours ago
in a commit whose own message was about that bug.

THE RULE: YOUR WORD IS THE ONLY THING HOLDING THEM. They did not earn the
place, you did, and you spent it on them, so it lasts exactly as long as your
standing does. Fall to A STRANGER and everybody you put up there loses their
place the same day.
  A SLIP IS NOT A FALL: at the rung ABOVE the floor they keep it. The rule is
  "your word became worth nothing", never "you missed a day". The floor is the
  ladder's own bottom rung read BY NAME, so retuning the ladder retunes this.
  NO NEW MACHINERY: neglect already charges at day-end, so walking away drains
  you toward zero on its own. The sweep runs on that same hook immediately
  after and only READS what neglect just wrote -- it never writes standing,
  because two writers on one day's number is the bug fixed six times here.
  RECOVERABLE: they run with nobody again so the offer returns. Climb back to
  INSIDE and put them up a second time. The door that closed is the same door.

REALISM IS THE FLOOR, NOT THE CEILING (the TRAINING lane's finding this
morning, and it is the right correction). The REAL version of this is a number
crossing a threshold. The MEMORABLE version is that there is NO NOTIFICATION
anywhere: you find out by walking past somebody you helped and reading
    THEY WERE IN, ONCE :: WITH THE CHURCH · BECAUSE OF YOU
    "Your word put them there and nothing else did. You let it go to nothing
     with the CHURCH, so their place went with it. They have not said anything
     about it."
The ⚔ OUTFIT board keeps the list (still in / lost, and on what day) so there
is somewhere to go and look rather than an interruption.

ONE DEFECT, CAUGHT BY DRIVING THE ARC RATHER THAN READING THE DIFF:
ctOutfitHtml has TWO return paths and the first version patched one. The
empty-state return fires whenever your outfit holds no positions -- which is
most of the game, and exactly the state a player is in when they start putting
people up -- so the list rendered only in the branch nobody was in.

  FACTION BETWEEN  108 passed, 0 failed (was 99)   FACTION ARC 91/0
  CARD FOLD 18/0   ORGAN REACH 8/0   ALPHA LOADS 20/0
Two mutations, both bite.

*** STILL THE ONE THING BLOCKING THIS LANE, AND STILL NOT MINE ***
837 people within six cells of the spawn, none affiliated; nearest base 29
cells. Findable, reasoned, mapped, and now with a real arc at the top of the
ladder -- but NOT NEAR. (1) spawn and bases come from two systems that have
never heard of each other and boot() returns no player position to reconcile
against, so it is placement; (2) AFFILIATED_RATE / REACH_CELLS, both [PENDING];
(3) outfits with people who travel, needs a dial.

--------------------------------------------------------------------------------

FACTIONS (factions-ovkjpf): 8/28 (n) LATEST -- *** THE TOP OF THE LADDER BOUGHT
NOTHING FOR SIXTEEN DAYS, AND THE RUNG ITSELF SAID WHAT IT WAS FOR. Nothing to
judge. ***

TAB: **RUN**. Get to INSIDE with an outfit, then walk up to somebody who runs
with nobody. New button: PUT THEM UP FOR THE <OUTFIT>.

MEASURED: the ladder is A STRANGER 0, SOMEBODY WHO SHOWED UP 1, USEFUL 3,
COUNTED 6, INSIDE 10. bohemia_claim and bohemia_favour BOTH key off COUNTED, by
name, at build time. NOTHING ANYWHERE KEYED OFF INSIDE -- every hit in the
engine, the tools and the walked surface is the word inside a ladder literal or
its own definition. So you climb the last four rungs THROUGH THE WALL (which
costs a burned bridge, the most expensive thing this system asks) and the only
thing that changes is the word on the card.
bohemia_commitment's own docstring: "A ladder with no wall is a progress bar."
A ladder whose TOP RUNG BUYS NOTHING is a progress bar with a wall in the middle.

AND THE RUNG SAYS WHAT IT IS FOR. Its note has shipped since 8/12:
    "The newcomer is the old-timer now, and the next newcomer is your problem."
A specification, not flavour, and nothing implemented it. The mirror was even
half-built -- bohemia_ties.vouchFor() finds somebody to vouch for a STRANGER TO
YOU, and the direction the note describes did not exist. NOTHING IS INVENTED
HERE: the feature is that sentence made true.

IT COSTS ONE RUNG OF YOUR OWN (Portes 1998, EXCESS CLAIMS ON GROUP MEMBERS --
being inside is a relationship that makes demands, not a prize). Through
BohemiaBelonging.adjust, THE ONE WRITER. INSIDE at 10 -> 9, so the top rung buys
exactly TWO before you climb back. And it is the first thing in this game that
changes another PERSON rather than the player.

HOW SOMEBODY JOINS WITHOUT A SECOND PLACEMENT RULE: allegiance is COMPUTED from
bases + a seat hash, so there is nothing to write to. A vouch records an
override in the save and ctFactionOf consults it FIRST, never blended with the
roll, keyed 'P:city:'+id like the met-ledger so it survives walking away.

*** AND I WROTE THE SAME BUG THIS FILE ALREADY HAS A COMMENT ABOUT. *** The
explanatory rows referenced a `p` that does not exist inside ctIntroRows(body,
intro, fid, ctOnwardKey), threw, and MY OWN try/catch ate it. The BUTTON worked
the whole time (ctDraw really does have `var p = CT_OPEN`), so the offer
appeared and the sentence explaining it silently did not. "A BARE CATCH HERE
COST THIS LANE THREE DAYS" is already a comment in this file about ctFactionOf.
I wrote another one twelve hours later. Fixed; the catch now speaks once.

  FACTION BETWEEN  99 passed, 0 failed (was 88)   CARD FOLD 18/0
  ORGAN REACH 8/0   ALPHA LOADS 20/0
Three mutations, all bite.

A THING I WENT LOOKING FOR AND DID NOT FIND, worth knowing so nobody re-finds
it: over file:// the demo LOOKS like a stranger can reach the builder's drawer
(devbtn visible, tray opens, REROLL a 95x31 button). Over HTTP -- which is what
the published site is -- it is correctly hidden. The cutter's comment predicts
exactly this and demo_build_gate already launches with
--allow-file-access-from-files for the reason. I was measuring the harness.
THE DEMO'S FACTION SYSTEM WORKS END TO END ON THE REAL PROTOCOL: chip, board,
valley list, 14 bases, all live in BOHEMIA_DEMO.html.

*** STILL THE ONE THING BLOCKING THIS LANE, AND STILL NOT MINE ***
837 people within six cells of the spawn, none affiliated; nearest base 29
cells. Findable, reasoned, mapped -- not NEAR. (1) spawn and bases come from two
systems that have never heard of each other and boot() has no player position to
reconcile against, so it is placement; (2) AFFILIATED_RATE / REACH_CELLS, both
[PENDING]; (3) outfits with people who travel, needs a dial.

--------------------------------------------------------------------------------

FACTIONS (factions-ovkjpf): 8/28 (d) LATEST -- *** YOU COULD OPEN THE MAP OF THE
VALLEY AND IT DID NOT SAY WHOSE GROUND WAS WHOSE. Nothing to judge. ***

TAB: **RUN**, then **⤢ WHOLE MAP**. Every outfit's ground is marked. Yours reads
differently from theirs. Your ground and the nearest one are named even zoomed
all the way out; the rest name themselves as you zoom in.

WHY: yesterday the board learned to say COLORFUL, NORTHWEST, A LONG WAY OFF.
That is a bearing, and a remembered compass word is NOT navigation across 29
cells. The open-world research's working middle -- "see it in the distance, go,
spot the next thing from there" -- ASSUMES YOU CAN SEE IT, and in a top-down
valley 3,712 tiles wide you cannot.

MEASURED: renderCity() did not call ctBases() ONCE. Every ctBases() call in the
file sat in the faction code. The map of the whole valley said nothing about
anybody holding any of it, while the canon says LIGHT=TERRITORY, CLUSTERED
POWER (12% lit, OWNED), NOBODY PATROLS THE DARK. Territory here is visible by
construction and the map was the one place that never admitted it.

MAP LAW respected: NOTHING IS PLACED. Every position is one bohemia_loop.boot()
decided and the city baked. NOT A HUD PIN either: it does not follow him, it is
not on the walking screen, it points at no quest.

IT COMPOSES WITH THIS MORNING'S GUARD FOR FREE. The map asks ctBases(), which
now knows when the world was rerolled out from under the bake, so after a reroll
it draws nothing instead of painting the last valley's borders over this one.

*** TWO DEFECTS THAT WERE CORRECT IN THE SOURCE AND WRONG IN THE RENDER ***
  1. The markers were sized in TILES. At WHOLE MAP zoom TW is 3.74 PIXELS, so
     every marker was a four-pixel smudge on the one screen you open to plan a
     walk. Screen-sized now. Found by screenshotting it.
  2. CUSTOM and COLORFUL are nine cells apart, about twenty pixels at that zoom,
     and CUSTOM's plate painted over the front of COLORFUL's name. Both "drawn",
     one unreadable. Labels nudge now, with a leader line back to their ground.

*** AND TWO OF MY OWN GATE CLAIMS WERE DECORATION UNTIL MUTATION PROVED IT ***
  M2 said the markers are screen-sized by checking they were PAINTED, which is
     what M1 already says. Tile-sized markers left it GREEN -- still painted,
     just a smudge. It counts AREA now against a MEASURED floor: shipped paints
     min 24 px per marker, the bug paints min 11, so the floor is 20.
  M5 said no label is buried under another by counting text-coloured pixels in
     a band above each marker. Removing the collision fix left it GREEN, because
     the band is 90px wide and THE NEIGHBOUR'S LABEL IS THE SAME COLOUR. The
     render now publishes its label boxes (window.__GROUNDLABELS, the idiom
     renderCity already uses for window.__LAMPQ) and the claim checks overlap.
  A CLAIM THAT CANNOT FAIL IS NOT A CLAIM, and pixel-counting claims are
  especially good at looking rigorous while proving nothing.

  FACTION BETWEEN  88 passed, 0 failed (was 81)   CARD FOLD   18/0
  ORGAN REACH       8/0   EVERY PANEL 14/0        ALPHA LOADS 20/0
Four mutations, all bite.

*** STILL THE ONE THING BLOCKING THIS LANE, AND STILL NOT MINE ***
837 people stand within six cells of the spawn and not one runs with anybody;
nearest base 29 cells. The board makes it findable, gives a reason to go, and
the map now shows where. NONE OF THAT MAKES IT NEAR. Three ways out:
  1. The spawn and the bases come from two systems that have never heard of each
     other. bohemia_loop.boot() returns factionBases and NO player position, so
     reconciling them means DECIDING placement. His.
  2. The dials: AFFILIATED_RATE (0.30), REACH_CELLS (12), both [PENDING].
  3. Outfits get people who TRAVEL. Needs a new dial, needs a ruling.

--------------------------------------------------------------------------------

FACTIONS (factions-ovkjpf): 8/27 (r) LATEST -- *** A GUARD THAT COMPARED TWO
CONSTANTS, AND A LIST OF DIRECTIONS WITH NO REASONS ON IT. Nothing to judge. ***

SHIPPED TO MAIN (stamp 8/27w): TF-ART-026..032 -- the landfill's waste fill +
berm rings (berms are PURE REUSE of the arsenal mag pieces), the railyard's 118
boxcars + dead loco as roof-read sprites (101 blobs measured EXACTLY 7x4 = a real
50-foot car), the datafort's membrane/generator roofs + 1,189 stopped cooling
fans, the library's scored plazas + planter BEDS (a 5x7 blob is one bed, not 35
boxes -- the look caught the waffle), the radio site's guy-wire fans (each cell
BEARS ON ITS NEAREST MAST), its propane tanks + ice bridges (the measurement
split the shared name), and the wash's invert + banks (stain on CENTRELINE CELLS
ONLY, edge-pinned -- the first render was a barcode). Watertreat's dry basins
joined the bed tiles free. Every family measured on the walked world first,
verified live, full form + board row + ART card.

THE ICON OVEN: bake 6 shipped -- farm rows ON the pad (the ground fit ignored
flat patches), the drive-in screen finally WHITE (two diseases: the frame stood
camera-side of the screen because +y faces the viewer, and SCREEN's palette can
never bleach by multiplication). THE INSTRUMENT THAT FIXED IT: a 1.7-second
single-hero probe (scratchpad hero_one.py pattern, rebuild if wiped) after three
73-160min blind bakes each. Wave 4 judged by probe: 8 of 10 remaining kills stand
on signature; MALL rebuilt low-and-blank (joined NOT_A_BUILDING + LOW_BY_NATURE),
WATERPARK slide tower is an open frame with 3 flumes exiting AT the deck edge on
bearings OFF the camera diagonal (dx~=dy projects as a vertical caterpillar).
BAKE 7 IS GRINDING as this ships, carrying: mall, waterpark, the landfill scale
house (was tunneling a bench), and the SQUINT/HUE twin cures (basin floor grades
dark, wash invert pale + stained over grey corridor, rail rides dark cess bands,
arterial draws the double yellow its palette always carried -- squint/hue were
red on main BEFORE this session; verified in a worktree). When bake 7 lands: wire
patch, icon gates by EXIT CODE, ship.

SUITE TRIAGE (worktree-verified): every other red reproduces on clean main --
RENDER PIXEL/FULL RES identical numbers, 19 stale LOOK pictures all CHARACTER
lane's, GRAVEYARD's 10 live refs are hair tokens, REUSE FIRST is the floor cook.

NEXT: (1) bake 7 lands -> verify pixels, wire, ship; (2) 5th composition audit;
(3) daily re-probe (12 landmark grounds STILL sealed: strip/casino/freeway/
speedway/resort/minigp/ballpark/interchange/strat/highroller/luxor/sphere;
trailer awnings unnamed -- pounce when WORLD names them); (4) session-dead, no
recook: strip, strip_x, minigp, dam; casino/resort CBB frozen until the Strip
exists. PENDING PAOLO: the act-one-approve vs other-act-approve explanation he
promised.

FACTIONS (factions-ovkjpf): 8/27 (i) -- *** 837 PEOPLE STAND WITHIN SIX
CELLS OF WHERE HE SPAWNS AND NOT ONE OF THEM RUNS WITH ANYBODY. Two weeks of
faction work sat 29 cells away behind a green suite. Nothing to judge. ***
TAB: **RUN**, the ⚔ OUTFIT chip. The board now has a second half: THE VALLEY.
WHY I WENT LOOKING: the CHARACTER lane's handoff this week ended with a line
aimed at everybody -- "WHEN HE ASKS FOR SOMETHING, CHECK LATER THAT IT ACTUALLY
GOT WORN" (four garments cooked for the Colorful in July, worn by NOBODY for
five weeks). I pointed it at my own lane and asked the only question that
matters about everything this session shipped: CAN HE REACH ANY OF IT.
THE MEASUREMENT (real surface, cold start, no save):
  player spawns at cell 48,48
  169 cells swept around him, ZERO of them empty, 837 PEOPLE standing in them
  ZERO of those 837 run with anybody
  nearest affiliated person: 9 cells. Nearest base: Colorful, 29 cells.
  FN is 128, so that is 3,712 fine tiles of walking
  REACH_CELLS is 12, so nobody within ~17 cells of his front door CAN be
    affiliated with anyone. Not sparse. Arithmetically empty.
  The open-world research puts the useful gap between points of interest at
    60-120 seconds of travel. This is 10-20x that.
Belonging, the rungs, the wall, commitments, word travelling, the canon wars,
earned enemies, the board -- ALL OF IT sits behind that walk and nothing
anywhere told him it was there. It is the Colorful garments again, at the scale
of a whole lane.
WHAT I DID NOT DO: AFFILIATED_RATE (0.30) and REACH_CELLS (12) are both
[PENDING Paolo] in bohemia_agents.js -- widening either affiliates the whole
valley by MY decision, not his, and does it to every cell at once. MAP LAW: the
bases do not move and the spawn is not mine. So it is REPORTED, not tuned.
WHAT SHIPPED: the board's second half. Every outfit the map holds, which way
their ground lies from where he is standing RIGHT NOW, how far in plain words,
whether he has ever dealt with them, nearest first, with the nearest called out
on its own line because a list is not a direction.
    NEAREST GROUND THAT BELONGS TO ANYBODY: COLORFUL, NORTHWEST, A LONG WAY OFF.
    COLORFUL   NORTHWEST · A LONG WAY OFF          NEVER MET
    MOB        WEST · A LONG WAY OFF               NEVER MET
    CUSTOM     YOURS · THIS IS YOUR GROUND
GROUNDED IN HIS OWN CANON, not a preference. Would somebody living here know
whose ground is whose? YES -- that is what territory MEANS. LIGHT=TERRITORY,
CLUSTERED POWER (12% lit, OWNED), NOBODY PATROLS THE DARK. Territory is visible
by construction. What he does NOT know is any of them personally, and that half
is untouched. And it is a BEARING, NOT A WAYPOINT: the research puts the working
middle between fully-guided (pins, markers) and fully-organic. A pin is a HUD.
THE NUMBER PRINTS IN EVERY SUITE RUN NOW, red or green:
  MEASURED: 837 PEOPLE within 6 cells of the spawn across 169 cells (0 of them
  empty), and 0 of those people run with anybody.
  MEASURED: player spawns at cell [48,48]; nearest affiliated person 9 cells
  (Colorful); nearest base Colorful at 29 cells = 3712 fine tiles
A number nobody looks at is exactly how a hole this size stayed invisible for
two weeks behind a green suite. If somebody fixes the spawn or the placement,
this line moves and everybody sees it move.
AND I CAUGHT MY OWN CLAIM BEING DECORATION. K3 first checked only that no row
said NORTH and SOUTH at once -- which a completely INVERTED COMPASS passes
without blinking, and that is the likeliest bug this feature has because screen
y grows SOUTHWARD and every instinct says otherwise. It now recomputes every
bearing from the base positions; flipping north/south turns it red.
  FACTION BETWEEN  73 passed, 0 failed (was 65)   CARD FOLD   18/0
  ORGAN REACH       8 passed, 0 failed            EVERY PANEL 14/0
*** WHAT THE FLEET NEEDS TO DECIDE, AND IT IS NOT A FACTION BUG ***
The board makes the system FINDABLE. It does not make it NEAR. Three ways out
and none of them is mine:
  1. THE SPAWN AND THE FACTION BASES WERE PLACED BY TWO SYSTEMS THAT HAVE NEVER
     HEARD OF EACH OTHER. The house comes from one rule, the bases from another,
     nothing reconciles them. That is a fleet-level integration gap.
  2. The dials move, and both are his.
  3. Outfits get people who TRAVEL. Real gangs have territory AND runners; a
     Cartel man in your neighbourhood is completely realistic. Needs a new dial,
     so it needs his ruling first.
--------------------------------------------------------------------------------

FACTIONS (factions-ovkjpf): 8/26 (ad) -- *** YOUR OUTFIT EARNS ITS OWN
ENEMIES NOW, AND THERE IS A BOARD TO SEE THEM ON. Nothing to judge. ***

TAB: **RUN**. New chip in the topbar beside PHONE: **⚔ OUTFIT**. It rings the
moment a commitment makes your outfit an enemy.

THE RULING (Paolo 8/26)
  "custom is your own personal faction!!!!!! ... the values arent just for you
   its for how your factions treated bro."
  Last turn did the OTHER outfits' wars. This turn does YOURS.

THE RULE IS DAVIS 1967, WEAK STRUCTURAL BALANCE, and the choice of theory IS
the design. Heider/Cartwright-Harary strong balance implies "the enemy of my
enemy is my friend". Davis dropped exactly that: the ONLY implausible triad is
the one with EXACTLY TWO POSITIVE EDGES, and the data agrees (two-positive
triads are massively underrepresented in real signed networks, all-negative
ones are OVERrepresented). So one inference is licensed:
    you(+)Cartel, Cartel(-)Remnants  ->  you(-)Remnants
THE ENEMY OF MY FRIEND IS MY ENEMY, and nothing else. The refusal is the point:
being at odds with somebody NEVER hands you an ally. A strong-balance version
would have manufactured alliances out of arithmetic, which is writing his lore.

AND WHY THE OUTFIT CARRIES IT: TIROLE 1996, COLLECTIVE REPUTATIONS -- "new
members of an organization may suffer from an original sin of their elders long
after the latter are gone." In a three-generation game that is the save file.

AN EARNED ENEMY IS A REPUTATION, NOT A FINE. whoHears() now asks watchers()
instead of ripples(), which adds the second reason an outfit finds out with no
chain: they have been watching YOU since the day you made them. Measured: side
with the Cartel, then commit to the CHURCH (who the Remnants have no quarrel
with at all) and it STILL reaches them, at 4 against a flat 2, forever.

HOSTILE AND WARM ARE NOT EARNED ON THE SAME TERMS. Hostile lands at `sided`
(siding is public by this game's own words). Warm costs `burned` -- you have to
have actually paid something. The cheap half only ever makes you enemies.

*** AND NOBODY IS BORN IN THE PLAYER'S OWN GANG ANY MORE. *** Measured: a
census of every base cell had TWO STRANGERS running with CUSTOM, the outfit he
named in capitals, which the player has not formed or recruited anybody into.
They joined by living near its base. Fixed at the ASSIGNMENT, never on the map
(MAP LAW -- the base stays, it is YOUR base). They went to Colorful, which
holds that ground; total affiliated count unchanged.

WHAT SHIPPED
  engine/bohemia_between.js         + earn(), watchers(), weighRel(), the
                                      earned layer. Authored canon always wins,
                                      enforced by control flow.
  engine/bohemia_commitment.js      whoHears asks watchers(); costs weighs by
                                      the edge that is actually charging you
  tools/bohemia_city_outfit_patch.py  the wire + the board
  gates/faction_between_gate.js     65 claims, 0 failed (was 40). Parts H/I/J
                                      new; ten press the REAL commit button in
                                      a real browser and ask what the world
                                      became. 8 mutations, all bite.
  records/BOHEMIA_YOUR_OUTFIT_EARNS_ITS_ENEMIES_8_26_26.md

TWO OF MY OWN CLAIMS PASSED FOR THE WRONG REASON and mutation found both. H2
asserted "a siding buys no friends" while siding with the CARTEL, who have no
warm relation at all, so it passed no matter what the rule did. H6 asserted
canon beats an earned edge while planting the edge on a DIFFERENT PAIR than the
one it asked about. A CLAIM THAT CANNOT FAIL IS NOT A CLAIM.

FACTION ARC WENT 93 -> 91 CLAIMS AND THAT IS THE FIX WORKING, not lost cover.
Its F section runs two claims PER OUTFIT YOU CAN MEET and Custom is correctly
no longer one. F1's floor (>= 4 outfits) still passes.

THE FLEET SHOULD KNOW: SIX OF FOURTEEN OUTFITS HAVE NOBODY AT THEIR OWN BASE,
and for four of them it is arithmetic, not a bug. People living in each base's
cell: Anarchists 1, Blues 1, Remnants 1, Caravans 2, Mob 3. At an affiliation
rate of 0.30 that is an expected 0.3-0.6 affiliates, who must then pick THAT
base out of everything within REACH_CELLS (12). Empty is the maths working.
That is a PLACEMENT/POPULATION fact; AFFILIATED_RATE and REACH_CELLS are
[PENDING Paolo] and MAP LAW forbids moving a base, so it is recorded not fixed.
The consequence worth naming: you can now earn the Remnants as an enemy and
never meet a Remnant. The board still says they exist and are watching, so it
degrades into a fact rather than into nothing.

--------------------------------------------------------------------------------

FACTIONS (factions-ovkjpf): 8/26 (q) -- *** THE OUTFITS ARE AT WAR WITH
EACH OTHER AND THE CARD SAYS SO. Paolo ruled it this turn and half of it was
already sitting in the repo unread. Nothing to judge. ***

TAB: **RUN**. Walk up to anybody who runs with an outfit and the card now has a
row under RUNS WITH saying who they are up against. Cartel members read
"AND ARE UP AGAINST :: CARAVANS, REMNANTS".

THE RULING (Paolo 8/26, verbatim)
  "custom is your own personal faction!!!!!! and you can imagine if you play the
   game with your custom faction the values arent just for you its for how your
   factions treated bro but u prob Already have that. But, yeah, for the other
   factions."

WHAT WAS ALREADY IN THE REPO AND HAD NEVER BEEN READ
  engine/BOHEMIA_faction_graph.json holds NINE directed canon relations
  (permanent-war, prey-tax, professional-respect, adjacent, hands-off). Its own
  _meta says "All canon; nothing invented". bohemia_engine.js FactionCanon
  priced every one of those labels on 7/2. THE CITY HAS NEVER READ EITHER:
  `grep -c BohemiaEngine slices/BOHEMIA_CITY_WORLD.html` was 0.
  So costs() charged every hearer the same number, and the Remnants -- at
  permanent war with the Cartel -- took exactly what the Church took.

WHAT SHIPPED
  engine/bohemia_between.js        what two OUTFITS are to each other. Not about
                                   the player. Pairs copied from the graph,
                                   numbers PARSED out of FactionCanon.REL_SPEC
                                   at build time so the two can never drift.
  tools/bohemia_between.py         the generator
  tools/bohemia_city_between_patch.py  the wire
  gates/faction_between_gate.js    40 claims, 0 failed, registered as
                                   FACTION BETWEEN. Eleven of them load the
                                   SHIPPED CITY IN A REAL BROWSER at 390x844.
  records/BOHEMIA_THE_GAME_HELD_A_WAR_AND_COULD_NOT_FEEL_IT_8_26_26.md

THREE DEFECTS, NONE VISIBLE IN A DIFF, ALL VISIBLE IN A CARD
  1. THE DEAD ZONE. The Cartel tax the Caravans (init -45). At base cost 1 --
     the most common case in the game -- the proportion rounded to ZERO. A canon
     position is now an INVARIANT, which is FactionCanon's own lesson ("a
     starting value decays; an invariant holds") applied to the cost side.
  2. THE ROW BEHIND THE WRONG GUARD. The world-fact row went into ctHearRows,
     which is only called at `if(ctLadder && ctWall && ctWall.atWall && ...)`,
     so it rendered on no ordinary card at all. Same shape as the tertius row
     that sat behind an early return on the exact condition it described.
  3. THE CARD THAT CONTRADICTED ITSELF. There are TWO whoHears calls in the
     city. Teaching one shipped a card reading "WILL HEAR IT AS FACT: CARAVANS,
     REMNANTS" three lines above "NOBODY WHO COULD CHARGE YOU FOR IT IS CLOSE
     ENOUGH TO KNOW".

AND IT COULD NOT FIRE, WHICH WAS MEASURED BEFORE IT WAS FIXED
  A sweep of the live city -- every base, every affiliated person, the real
  whoHears against the real roster -- found TWO hearing pairs in the ENTIRE
  VALLEY (Mob<->Network), and neither is a pair canon holds a position on. The
  acquaintance walk needs a chain of housemates between two outfits and a thin
  population has none. And the chain is the WRONG TEST anyway: this module's own
  words say sided is "Said in front of people" and burned is "they know which
  somebody". whoHears grew opts.watching -- a canon position is a reason to be
  already looking. A neutral arrangement is NOT surveillance (hands-off made the
  Volunteers charge for every Cartel commitment under their own shipped sentence
  "There is no side to be on here").

THREE THINGS THE FLEET SHOULD KNOW
  1. THE VALLEY IS TOO THIN FOR WORD TO TRAVEL. Two hearing pairs on the whole
     map. The watcher rule routes around it for canon-related outfits and does
     nothing for the other ~200 pairs. Whatever thickens the population or the
     tie graph will make a lot of already-built machinery start firing at once.
  2. FIVE OF SIXTEEN OUTFITS ARE UNREACHABLE. Blues and Anarchists have bases at
     the top edge (y=0, y=3) and zero members; Karens, Social Forces and
     Amalgamation have belonging rules and no base at all.
  3. HIS OWN OUTFIT IS EMPTY ON PURPOSE. Custom has relations:{} and canon's note
     is "Player faction... Identity emerges from three generations of action."
     Gate claim C4 asserts that is CORRECT, because on 8/21 this lane reported
     his own faction as a defect and he had to correct it.

BOTH NEW ARGUMENTS ARE OPT-IN. costs(...,opts) and whoHears(...,{watching}) with
nothing passed return exactly yesterday's numbers, so no other lane's surface
moves underneath it.

--------------------------------------------------------------------------------
FACTIONS (factions-ovkjpf): 8/18 -- *** THE DEBT GETS CALLED IN. The free


FACTIONS (factions-ovkjpf): 8/18 -- *** THE DEBT GETS CALLED IN. The free


FACTIONS (factions-ovkjpf): 8/18 -- *** THE DEBT GETS CALLED IN. The free


FACTIONS (factions-ovkjpf): 8/18 -- *** THE DEBT GETS CALLED IN. The free


FACTIONS (factions-ovkjpf): 8/18 -- *** THE DEBT GETS CALLED IN. The free


FACTIONS (factions-ovkjpf): 8/18 -- *** THE DEBT GETS CALLED IN. The free


FACTIONS (factions-ovkjpf): 8/18 -- *** THE DEBT GETS CALLED IN. The free


FACTIONS (factions-ovkjpf): 8/18 -- *** THE DEBT GETS CALLED IN. The free


FACTIONS (factions-ovkjpf): 8/18 -- *** THE DEBT GETS CALLED IN. The free


FACTIONS (factions-ovkjpf): 8/18 -- *** THE DEBT GETS CALLED IN. The free


FACTIONS (factions-ovkjpf): 8/18 -- *** THE DEBT GETS CALLED IN. The free


FACTIONS (factions-ovkjpf): 8/20 (d) -- *** FIVE OF HIS SIXTEEN OUTFITS
COULD NEVER HAND OVER A NAME ON THE SURFACE HE WALKS. Four of them can now.
TAB: CITY -- walk up to somebody who runs with an outfit. Nothing to judge. ***

THE SHAPE THIS LANE KEEPS FINDING, for the SEVENTH and EIGHTH time this week:
AN ORGAN COMPUTES SOMETHING AND NOTHING ON THE WALKED SURFACE CALLS IT. Six of
those were found by tripping over them. These two were found by SWEEPING for the
shape on purpose -- counting the call sites of every function this lane exports.

  BohemiaIntros.askOutcome              0 CALLERS  -> what asking a name COSTS
  BohemiaTies.overheardFrom/onwardFrom  0 CALLERS  -> anywhere in the repo, at all

1. WHAT ASKING COSTS, BEFORE HE ASKS. Three of the sixteen charge for a direct
   ask (CARTEL "a smile and a redirect, every time, forever", MOB "a small
   permanent mark", ANARCHISTS "an insult, once"); thirteen are free, which is
   why it stayed invisible. THE ROW EXISTED AND ANSWERED THE WRONG QUESTION:
   `if(m.cost) ctRow('AND', m.cost)` is meeting().cost, EMPTY before you ask and
   filled in after. The card could always say what asking DID cost and never what
   it WOULD. Nothing invented: "a permanent mark" is not a stat this repo has.

2. FIVE EARN-CONDITIONS NOTHING EVER SET. BohemiaIntros.earned() switches on
   eight; the city filled exactly one (`var iSt = { asked: ... }`). So MOB
   (vouch), REMNANTS (overheard), BLUES (standing), HOMELESS (honesty) and TRADES
   (work) could never get past the first rung of their own dossier's mechanic.
   *** AND FOUR OF THE FIVE WIRES WERE ALREADY WRITTEN -- ON BOHEMIA_RUN_SLICE_
   7_26_26.html, A SURFACE THAT IS NOT THE GAME. *** engine/bohemia_ties.js was
   built 8/12 for exactly this (Feld 1981 foci + Dunbar layers), answerFor()
   shipped 8/11, the ledger's honest/lied bits 8/13. The city got none of it.
   A WIRE TO THE WRONG SURFACE IS NOT A WIRE.
   The Mob card now reads, with no ask, which is their anchor verbatim:
       MALACHI BETANCOURT
       WHO PUT YOU ON   PERLA BONILLA - YOU RUN WITH THE SAME OUTFIT
   And the Homeless finally ask you where you sleep and take an answer.

NOT WIRED, NAMED NOT FAKED: TRADES earns its name with hires>=2 and THE CITY HAS
NO HIRING. Minting one would invent an economy in the exact place his dossier is
most specific. st.hires stays 0, the card keeps saying HIRE THEM TWICE in his
words, and gate L8 names the gap. [expires when a hire verb appears]
AND TWO CANNOT FIRE FOR A POPULATION REASON, NOT A WIRING ONE: ONE Remnant in
the whole valley (nobody to overhear it from) and ZERO Blues. L9 states that as a
claim that can actually fail -- if the graph ever produces a third party out of a
one-member outfit, it goes red.

*** THE PROCESS FINDING WORTH STEALING: MEASURE, DO NOT REASON, ABOUT PIXELS. ***
I argued IN WRITING that the vouch row was height-neutral (HOW YOU GET THE REST
empties exactly when WHO PUT YOU ON appears). It sounded airtight. MEASURED: 833px
of 844, NINETY-NINE PERCENT -- because earning the name also turns the quirk row
on, so the card gains two and loses one. A good argument about a measurable thing
is still not a measurement. Third time this lane added a row to this card and
went red, first time the argument was any good.
AND THE FIX WAS TWO RULES, NOT THREE TRIMS (trimming three unrelated rows until
the number goes green is fitting content to the ruler in a different coat):
  A DUPLICATE IS NOT DISCLOSURE -- the heading BECOMES the name, so the NAME row
    under it repeats it verbatim on exactly the fullest cards. Identical defect
    the TRADE row was fixed for on 8/18, identical test.            833 -> 810
  THE HEADLINE IS LIVE, THE EXPLANATION IS THE OUTFIT'S -- ctRow('', ...) has been
    this card's mark for "the sentence explaining the row above" in four systems,
    and every one is identical on every member of that outfit forever, which is
    word for word the fold's own test. They were simply outside it.  810 -> 734 (87%)
AND THE BAR ITSELF WAS WRONG: cardfold A1 stands next to whoever is affiliated and
NEAREST, which is almost never somebody who can be vouched for, so the worst case
was outside the measurement that exists to hold the card to the phone. A12
constructs it deliberately now. A BAR THAT DOES NOT MEASURE THE WORST CASE IS NOT
A BAR.

GATES: FACTION ARC 66/0 (parts A-L, the whole journey on the real page, no stubs)
| CARD FOLD 15/0 | plus the rest of the suite green.
Mutation-proved five ways: revert iSt to one field -> L1/L2/L3/L5/L7 red; drop the
answer button -> L4/L5/L6 red; drop WHO PUT YOU ON -> L3/A14 red; unfold the
explainers -> A12/A13 red; restore the duplicate NAME row -> A16 red.
*** AND THE FIFTH MUTATION CAUGHT ME, NOT THE CODE. *** I predicted the duplicate
NAME row would red A12 and IT DID NOT -- 15/0 with the duplicate restored,
because the explainer fold had already bought so much headroom that ~23px no
longer crosses the bar. A HEIGHT CHECK CATCHES A DUPLICATE ONLY BY ACCIDENT, and
only until the next row lands. A RULE DESERVES ITS OWN CLAIM, NOT A SIDE-EFFECT
OF A PIXEL BUDGET: A16 now asserts it directly, the way A8 already does for the
TRADE row one row lower. Written down because the mutation test is only worth
anything if you report the one that did not bite.

Law:   laws/BOHEMIA_ADDENDUM_NOBODY_EVER_WALKED_IT_8_20_26.md (sec 4h, 4i)
Tools: bohemia_city_asking_cost_patch.py | bohemia_city_thirdparty_patch.py |
       bohemia_city_namededupe_patch.py | bohemia_city_notesfold_patch.py
       (all idempotent, all MARKER-guarded)

*** AND THEN THE SWEEP, RUN AGAIN, PRODUCED A NINTH -- THE PAYOFF OF THE WHOLE
SYSTEM. BohemiaCommitment.tertius: 0 CALLERS since the wall shipped. ***
Burt/Simmel TERTIUS GAUDENS -- two outfits with no line to each other means you
span a structural hole and you are THE ONLY ROUTE BETWEEN THEM. The 2024 TERTIUS
DOLENS correction is what makes it a game: connect them and the identical
position COSTS you, because both sides can see the other half of what you are
doing. Same behaviour, opposite sign, decided by the graph and not by you. Until
this wire, standing with the Cartel and standing with the Mob were two numbers on
two different cards and the game had no opinion about holding both.

AND MY FIRST PLACEMENT WAS DEAD ON EXACTLY THE HALF THAT MATTERS. ctHearRows
early-returns when nobody has a line -- and AN EMPTY `heard` IS THE STRUCTURAL
HOLE. So the row printed only when you were EXPOSED and stayed silent when you
were THE ONLY ROUTE. Measured: organ said YOU ARE THE ONLY ROUTE BETWEEN THEM,
card said nothing. A ROW ADDED AFTER AN EARLY RETURN IS NOT ADDED -- same family
as the border pass that was individually correct and sat in the wrong place in
the pipeline (8/16). Reading the function does not find it; running it does.
M3 proves the fix by asserting BOTH rows on one card, because the NOBODY row is
emitted by the early return itself.

*** THE BIG ONE, AND IT IS NOT THIS LANE'S: EVERY COMMITMENT IN THIS GAME IS
CURRENTLY FREE. *** The dolens branch never fired for ANY of the 110 outfit
pairs, so I counted the graph instead of guessing:

    affiliated                          32 of 298
    ties between two affiliated people     106
       same outfit                         106
       CROSSING AN OUTFIT LINE               0
    whoHears lines in the whole valley       0
    foci shared by 2+:   home 0   work 34   faction 8

WHO WILL HEAR / WILL HEAR IT AS FACT / AND IT COSTS YOU / tertius DOLENS are all
structurally unreachable. Saying out loud that you are with somebody has no
downside anywhere in the valley. THREE STACKED CAUSES:
  1. THE VALLEY HAS NO HOUSEHOLDS. homesIn() takes ONE fine cell per person, so
     298 people have 298 homes and the HOME focus (the strongest tie in Feld and
     the one that most naturally crosses an outfit line) groups nobody. CHECKED
     SPECIFICALLY: this is NOT a keying bug in bohemia_ties -- a bug of exactly
     that shape was found and fixed on 8/15 and the same conclusion would have
     been wrong twice. The adapter reports the world faithfully.
  2. A FACTION TIE IS SAME-OUTFIT BY DEFINITION, so it can never bridge.
  3. WORK IS THE ONLY POSSIBLE BRIDGE, and 32-of-298 never pairs two affiliated
     people from different outfits. Zero is what the arithmetic predicts.
ANY ONE OF THESE UNBLOCKS THE WHOLE HALF: households (biggest lever by far --
Feld's home focus is a clique under Dunbar's support-clique layer of 5, so every
household makes everyone in it acquainted), the AFFILIATED_RATE dial, or the
three empty bases. All WORLD / [PENDING Paolo].
Record: records/BOHEMIA_EVERY_COMMITMENT_IN_THIS_GAME_IS_FREE_8_20_26.md
Held by M5, which is falsifiable rather than decorative: if cross-outfit ties
ever exist while whoHears still returns zero lines, the two disagree and it reds.

GATES AFTER THE SECOND PIECE: FACTION ARC 71/0 (parts A-M) | CARD FOLD 16/0.
Tool: tools/bohemia_city_tertius_patch.py | tools/bohemia_organ_reach.js (the
sweep -- run it before writing any new organ; it found the 7th, 8th and 9th).

*** AND THE TENTH AND LAST ONE IS DONE: THE COLORFUL SCREEN YOU NOW. ***
st.onward was COUNTED on the card from the morning and nothing ever SPENT it.
His canon: "the second question is WHO YOU CAME WITH. That question is the actual
screening and the name was the small talk. Answer it WELL and you are introduced
onward to three people; answer it BADLY and you are still treated kindly and
never introduced to anybody."
THE ONE WORD HE DID NOT DEFINE IS "WELL", and that is mechanism. GROUNDED: Gould
& Fernandez's brokerage typology puts the GATEKEEPER in charge of incoming access
to their own group; the chain-referral work finds the same person acting as
SPONSOR at once, exchanging REPUTATIONAL ENDORSEMENT -- extending their own
standing to the newcomer. Trust in bounded communities is reputational currency
grounded in shared networks, which is why "who sent you" is THE question: the
answer is a LEGITIMACY SIGNAL whose value is that it can be CHECKED against the
community's own graph. So a good answer names somebody THEY know, whose name YOU
went and earned. And Granovetter 1973 settles what looked like a bug: onwardFrom
picking the STRONGEST three is right, because they are the Colorful's strong ties
and therefore YOUR weak ones -- your word only carries with people who trust you.
THE STACK NOW FEEDS ITSELF: answering well needs names, the reward is more names.
Gate: part N (N1-N6). 77/0. Mutation-proved: no came-button -> N1/N2/N4/N5 red;
no alone-button -> N3 red.

*** AND THE FIRST CUT TOLD HIM A LIE, CAUGHT BEFORE SHIPPING. *** The row read
"YOU ANSWERED, AND THEY OPENED DOORS" on a card where MEASURED nothing opened --
2 met before, 2 after -- because that Colorful had ONE acquaintance and it was
the person I had just named. The save holds two bits (you answered; it held up)
and THOSE ARE THE ONLY TWO THINGS A ROW READING THE SAVE IS ENTITLED TO SAY. What
it actually BOUGHT is spoken aloud where the real count is in hand. N5 holds it.

*** THE HEADLINE NUMBER FOR THE WHOLE DENSITY FINDING, measured chasing that: ***

    HOW MANY PEOPLE EACH PERSON KNOWS (298 people)
      knows 0: 199   <-- TWO THIRDS OF THE VALLEY KNOW NOBODY AT ALL
      knows 1:  49   knows 2: 31   knows 3: 3   knows 4: 7
      knows 5:   1   knows 7:  5   knows 8: 3
      mean 0.71   max 8   able to open THREE: 19 of 298
    THE COLORFUL, whose dossier promises three:  knows 1 · knows 1

The outfit whose entire mechanic is introducing you onward HAS NOBODY TO
INTRODUCE. THE MACHINERY IS FINE and that was checked separately -- the
best-connected person opens exactly the three his canon promises, and N6 is
falsifiable on precisely that. Same single cause as M5: one person per roof means
the home focus, the strongest tie there is, groups nobody. WORLD / [PENDING].

*** A GATE CAN GO RED BECAUSE ITS EVIDENCE MOVED, NOT BECAUSE ITS CLAIM BROKE. ***
M3 proved "the position row runs before the early return" by asserting BOTH rows
on one card -- then __CITY_WORSTCARD__ deliberately suppressed the NOBODY row as
a duplicate and the evidence vanished BY DESIGN. The two look identical from the
failure line. THE TEST: is the claim still provable another way? If not, the code
is wrong and the gate is right. Here it was, and more directly.

AND TWO MUTATION RUNS SILENTLY DID NOT RUN: the script searched for a literal
'·' where the file stores the escape '·', so the assert threw, the gate ran
against UNBROKEN code and reported 77/0 -- a green that proved nothing. A MUTATION
THAT DID NOT APPLY LOOKS EXACTLY LIKE A MUTATION THAT DID NOT BITE. Assert the
anchor count, and prefer a unique PHRASE over anything with punctuation in it.

NEXT FOR THIS LANE, in order:
 1. *** WHAT DOES BEING **INSIDE** ACTUALLY GET YOU? *** [PENDING Paolo] and it is
    the top of the whole system. MEASURED, same person, three states:
        COUNTED (sided, gave 9)   buttons: name / burn a bridge / do it / no / take
        INSIDE  (burned, gave 20) buttons: name / do it / no / take
        INSIDE  (burned, gave 60) IDENTICAL to gave 20 but for the meet counter
    You climb five rungs and burn a bridge somewhere else to pass the last wall,
    and the card is the rung below MINUS THE WALL. His INSIDE note says "the
    newcomer is the old-timer now, and the next newcomer is your problem" -- a
    DIRECTION, not a mechanic. Inventing the mechanic is writing canon he
    reserved, so it went to him in plain words. WHEN HE ANSWERS, build it.
    NOTE the shape of the likely answer is already half-built: BohemiaTies
    .vouchFor requires a voucher who is INSIDE the same outfit and whose name you
    know. His note reads like the player becoming that voucher.
 2. RUN THE SWEEP AS A GATE. DONE 8/21 -- gates/organ_reach_gate.js, TEN instances
    in a week said the machine should catch this, not my attention. Four rules and
    THE ALLOWLIST IS CHECKED IN BOTH DIRECTIONS so it cannot rot: nothing-anywhere
    is a defect with no exemption; off-the-surface needs a WRITTEN REASON; a
    declared helper that LATER GETS WIRED must be deleted; an entry for something
    gone is rot. It caught its author THREE TIMES on day one.
    *** AND IT STRUCTURALLY CANNOT CATCH THE ELEVENTH. *** A note is DATA, so it
    has no call site to count -- five authored rung sentences ("Three times is a
    pattern. They start expecting you.") had NEVER been rendered and the sweep
    reports bohemia_belonging perfectly healthy. A GATE YOU TRUST FOR THE WRONG
    QUESTION IS WORSE THAN NO GATE. Unread PROSE needs a gate that walks the card
    and reads it (faction_arc part P), not one that counts callers. It currently reports 2 left: BohemiaCommitment.states (introspection)
    and BohemiaPeople.peopleOf (PEOPLE's module, not mine). EVERY organ this
    lane owns now has a caller on the surface he walks.
    KNOWN BLIND SPOT, ALREADY HANDLED, DO NOT REGRESS IT: the first sweep
    reported BohemiaTies as 0-called and it was WRONG -- the module is passed as
    a VALUE ({ties:BohemiaTies}) into whoHears, so a textual Global.fn( count is
    a lie. A SWEEP THAT CANNOT TELL AN INJECTED MODULE FROM A DEAD ONE IS THE
    BROKEN THING. Checked before claiming; it would have been a false finding.
 3. THE STANDING FINDINGS THAT ARE NOT MINE: 32 affiliated of 298; nobody in the
    valley shares a roof (298 people, 298 distinct home coordinates); three bases
    (Anarchists, Blues, Church) have ZERO members so `presence` is unreachable;
    nearest affiliated person is 18 cells from spawn with 24 strangers nearer.
    MAP LAW / density / [PENDING Paolo].



FACTIONS (factions-ovkjpf): 8/18 -- *** THE DEBT GETS CALLED IN. The free


FACTIONS (factions-ovkjpf): 8/18 -- *** THE DEBT GETS CALLED IN. The free


FACTIONS (factions-ovkjpf): see the FACTIONS block higher up this file (8/20 (d)) -- this was a duplicated stub of the same heading and is not a second lane.


FACTIONS (factions-ovkjpf): 8/20 -- *** NOBODY HAD EVER WALKED THE WHOLE
FACTION JOURNEY. NINE GATES, ALL GREEN, FOUR TIMES BROKEN. Now one gate walks it
end to end, and doing it found two more bugs on the first try.
TAB: CITY -- walk up to somebody who runs with an outfit and go the whole way. ***

THE FACTION STACK HAS NINE GATES AND EVERY ONE VERIFIES A LAYER -- the organ
clamps, the card displays, the rule derives, the save round-trips. EVERY ONE WAS
GREEN WHILE THE STACK WAS BROKEN, FOUR TIMES:
  8/15  factionOf was not a function -> ZERO of 166 people ran with anybody, for
        thirteen days
  8/18  BohemiaCommitment.give() was called ZERO times on the walked surface ->
        nine presses reached 9 against a ceiling of 5
  8/18  the favour opened an account and NOTHING EVER COLLECTED IT
  8/19  `burned` said "you cost yourself somewhere else to be here" and nothing
        anywhere cost you anything anywhere else
THE ORGAN WAS VERIFIED AND THE WIRING WAS NOT, four times, and each time the thing
that found it was a person driving the real card by hand. NO CLAIM ANYWHERE
PLAYED THE ARC.

THE LAW: A STACK OF VERIFIED LAYERS IS NOT A VERIFIED JOURNEY. Any system a
player moves THROUGH needs one claim that travels the whole distance, in order,
through the controls he actually presses, asserting every step MOVES something.
Gate: faction_arc_gate.js, 13 claims. meet -> ask their name -> read their terms
-> do what they want -> hit THE WALL -> take a side -> climb further -> take what
they offer -> OWE them -> get asked. Real affiliated person, no stub, and it
FAILS rather than skips if the valley has nobody -- "nobody in Las Vegas runs
with anybody" is the exact state the game was silently in, and a gate that shrugs
at it is how that happened.
Law: laws/BOHEMIA_ADDENDUM_NOBODY_EVER_WALKED_IT_8_20_26.md

*** AND WALKING IT FOUND TWO THINGS ON THE FIRST TRY. ***
1. THE CARD STAYED OPEN ON SOMEBODY WHO WAS NO LONGER THERE. ctVerb() runs on
   EVERY render and early-returns the moment a card is open, so it manages the
   TALK button and never asked whether that person was still next to you. The
   card was opened by TALK and closed ONLY by GO -- you could walk the entire
   valley with somebody's card up and their buttons live. Worse on a day roll,
   because WAKING UP MOVES THE PLAYER:
       day 1  me [10246,2268]  them [10245,2268]  adjacent TRUE
       day 2  me [10293,2248]  them [10245,2268]  adjacent FALSE, card VISIBLE
   Same family as the 8/18 wall: a control on screen that does not do what the
   screen says. There it could not move anything; here it moved THE WRONG
   PERSON'S standing. Fixed in the one place that already runs on movement.
2. TURNING UP IS ONCE A DAY and that is the design ("YOU ALREADY DID TODAY. COME
   BACK TOMORROW.") -- you cannot buy your way in by pressing a button. So the
   walk SLEEPS AND GOES BACK TO FIND THEM, because that is what playing is.

TWO THINGS THE GATE ADMITS ABOUT ITSELF, in its own header:
  - It CANNOT tell the clamp from the button suppression: two mechanisms enforce
    the ceiling and either alone stops the climb, so the mutation actually run
    removes BOTH (the exact 8/18 bug) and reds B5 and B8. The clamp alone is
    proved by commitment_gate Ez6. AN ARC GATE TESTS THE JOURNEY; IT IS NOT A
    SUBSTITUTE FOR THE MECHANISM GATES.
  - Its own first draft read sv.meta.owed directly and reported 0 while the real
    debt was 6 -- the three-spellings bug, SEVENTH time in this lane, written by
    the person who fixed the other six.

GATES: FACTION ARC 13/13 (new), COMMITMENT 72/72, CARD FOLD 11/11, CLAIM 45/45,
FAVOUR 31/31, BELONGING 58/58, INTRODUCTIONS 46/46, WALKED SURFACE 9/9. And the
ctVerb change was checked against every other lane that draws on this card:
CITY TALK 18/18, PEOPLE 158/158, STANDING 35/35, ASKING 21/21, WHAT YOU HEARD
19/19, QUIRK 32/32, STREET EXCHANGE 31/31.

*** AND THEN WALKING THE OTHER ECONOMIES FOUND A THIRD SURFACE LIE. *** The arc
first walked the Cartel (they-give-first, wants:debt) which is 4 of 16 outfits.
The other twelve had never been driven at all. On a real COLORFUL member:
    RUNS WITH   COLORFUL
    THEY WANT   WHAT YOU ARE
    YOU ARE     A STRANGER - 1 MORE TO SOMEBODY WHO SHOWED UP
    THE WALL    5 MORE AND TURNING UP STOPS WORKING
                NOTHING TO PRESS. THEY ARE STILL DECIDING WHAT YOU ARE.
    buttons     NONE AT ALL
ONE MORE WHAT? FIVE MORE OF WHAT? Third time this week the same disease: A
SURFACE DESCRIBING A MECHANISM THE PLAYER CANNOT REACH.

AND THE MISSING ACT IS NOT THE BUG -- HIS OWN DOSSIERS SAY SO. Two outfits want
`character` and ACTS has no entry for it. That looked like a hole until I read
what he wrote:
  THE COLORFUL   "To know whether you are safe to be around. That is the whole
                  assessment and IT NEVER STOPS RUNNING."
  SOCIAL FORCES  "Recruits, and specifically recruits who are frightened. They
                  approach AFTER something bad has happened to you, NEVER BEFORE."
CHARACTER IS NOT SOMETHING YOU DO, IT IS SOMETHING THEY READ OFF YOU. Neither
describes a task. A "prove your character" button would be inventing canon in the
two places he was most careful, so THE ENTRY STAYS MISSING and the CARD stops
promising a climb -- no rung, no wall, and it says the real rule instead.
THE DISTINCTION IS THE WHOLE FIX: noActBecause already separates a PERMANENT
absence from a TEMPORARY block ("YOU ALREADY DID TODAY"), and only the permanent
one silences the ladder. Both mutations bite: restore the false ladder and C1-C3
go red, silence everybody's ladder and B6 does.

ALSO MEASURED, not a bug: 13 of 16 outfits are playable across five acts
(information, debt, presence, legibility, labour). The Amalgamation's "nothing"
is deliberate canon and correctly gated. And there is a base called "Custom"
whose faction is not one of the sixteen -- it falls through to NOBODY IN
PARTICULAR and DEGRADES CLEANLY (runs-with row, ask-their-name, no terms, no
crash), so it is noted and not touched: base placement is MAP LAW.

GATES: FACTION ARC 17/17 (was 13, +4 for the ladder), COMMITMENT 72/72, CARD FOLD
11/11, CLAIM 45/45, FAVOUR 31/31, BELONGING 58/58, INTRODUCTIONS 46/46, WALKED
SURFACE 9/9, CITY TALK 18/18, PEOPLE 158/158, STANDING 35/35.

*** EVERY ACT A PLAYER CAN PRESS IS PRESSED NOW, AND ONE OF THEM NOBODY CAN. ***
There are FIVE acts across the sixteen and until this turn EXACTLY ONE had ever
been pressed on the walked surface. Now, each on a real member, each moving the
count:
    debt         Cartel     "Take what they are offering"
    information  Homeless   "Tell them what you have seen"
    labour       Trades     "Give them an hour of it"
    legibility   Network    "Let them write you down"
AND THE FIFTH CANNOT BE REACHED BY ANYBODY:
    acts with members: debt 10, information 3, character 2, legibility 7, labour 7
    NOT REACHABLE:     presence -- bases with nobody: Anarchists, Blues, Church
THREE BASES STAND IN THE VALLEY WITH ZERO MEMBERS and they are precisely the
three `presence` outfits, so "Show up for them" cannot be pressed by any player
anywhere. Placement + density (MAP LAW, and the REACH_CELLS / AFFILIATED_RATE
dials already [PENDING Paolo]), so THE GATE NAMES IT RATHER THAN FAILING ON IT --
same rule the suite learned about unrun gates on 8/19.

AND MY FIRST VERSION OF THAT CHECK HAD AN ESCAPE HATCH. Deleting `labour` from
the ACTS table made its claim VANISH rather than fail: 22 passed, 0 failed, one
fewer claim, no red. SILENCE READING AS COVERAGE, in my own gate, one turn after
writing the law about it. The data cannot separate "character has no act BY
DESIGN" from "labour lost its act BY REGRESSION", so the set of five is PINNED BY
NAME. Mutation-proven against the table the PAGE uses, not the engine file --
mutating the engine file alone changes nothing the gate reads.

*** AND NOBODY HAD EVER ANSWERED THEM. *** The walk went as far as "THEY ARE
ASKING YOU" and stopped. Neither answer had ever been pressed, and the answer is
the whole point of the claim (Portes 1998):
    SAYING YES BUYS YOU NOTHING -- meeting an obligation is the RENT on being
      counted, not a rung.
    SAYING NO COSTS YOU the standing that made you worth asking.
That asymmetry is the first thing a kind edit would break. Both answers are now
walked FROM THE SAME STATE on a fresh page each, so they are compared against
each other and not against two different histories. Both mutations bite: pay for
a yes and E2 reds, make refusal free and E3+E4 do.

A GUARD ON THE RESYNC TOOL, described honestly because THE CAUSE IS NOT PROVEN. A
mutation cycle left BOHEMIA_CITY_WORLD.html 1,159 lines shorter (1159 deletions,
0 insertions) and the only tool that had written to it was
bohemia_city_module_resync.py. git checkout restored it. I COULD NOT REPRODUCE
IT -- re-running the same edit resyncs cleanly, delta 0. So the guard is NOT the
fix for that incident; it guards the only path in that tool that GUESSES where a
module body ends, refusing a cut more than twice the module's size. Calling it
the cure for something I never reproduced would be shipping a false finding.

FACTION ARC 24 -> 28 claims.

*** THE SIXTEEN NAME MECHANICS ARE WALKED NOW, and the card matches the organ on
all eight outfits reachable: *** CARTEL gives nothing ever, TRADES gives "WATCH"
(a trade, not a name) until you hire them twice, VOLUNTEERS hand it over
instantly, HOMELESS have no button at all (they ask where you sleep), and
NETWORK/REDS/COLORFUL already know yours.
AND I ALMOST SHIPPED A FALSE FINDING ABOUT THE MOB. The first pass picked a
person, walked to them, opened the card, and labelled the result with THAT
PERSON'S faction -- but ctOpen() shows whoever is actually NEAREST. It reported
the Mob handing over a full name to a direct ask, flat against its anchor ("YOU
ARE INTRODUCED, YOU DO NOT ASK"), and I was one step from writing the wiring up
as broken. IT IS NOT. THE CARD WAS SOMEBODY ELSE'S.
  A PROBE THAT DECIDES WHO IT IS LOOKING AT CAN BE WRONG ABOUT WHAT IT SAW.
The card's own RUNS WITH row is the subject now, never my pick.

*** AND HERE IS THE NUMBER THAT DECIDES WHETHER ANY OF THIS IS IN THE DEMO. ***
Measured on a COLD START, which is the state a player is actually in:
    spawn cell                                 [48,48]
    nearest person who runs with anybody       18 cells (Mob)
    nearest base                               29 cells (Colorful)
    PEOPLE NEARER THAN THAT FIRST ONE          24
    affiliated in the valley                   32 of 298
YOU CAN MEET TWENTY-FOUR PEOPLE BEFORE YOU MEET ONE WHO BELONGS TO ANYTHING. The
faction stack is finished and verified -- 43 claims walk the whole journey -- and
a short session can plausibly contain zero contact with any of it.
I DID NOT TUNE ANYTHING. Raising REACH_CELLS to cover the spawn would affiliate
somebody with a base 29 cells away, contradicting the Kalyvas control-decays-with-
distance model the pick is built on: it buys a number and costs the model. Moving
a base is MAP LAW. Raising AFFILIATED_RATE does nothing because REACH is the
binding constraint, not the roll.
faction_arc part G measures it on a cold start EVERY RUN and prints it, and is
deliberately NOT a ratchet -- a gate that reds when he moves a base would be a
gate outranking a ruling. It asserts only that the number EXISTS.
AND THE FIRST VERSION OF THAT MEASUREMENT WAS WRONG: it read ctCell() on the page
the walk had used, which was standing AT the Volunteers base, and said 4 cells. A
measurement of "where he starts" taken after you have walked him somewhere is a
measurement of nothing. It runs on its own fresh page now.
Record: records/BOHEMIA_TWENTY_FOUR_STRANGERS_FIRST_8_20_26.md

FACTION ARC 42 -> 43 claims.

NEXT FOR THIS LANE (decided, not asked): THE THREE WAYS THE 18 CELLS CLOSE ARE
ALL SOMEBODY ELSE'S -- a base nearer spawn (MAP LAW), a denser valley (WORLD), or
A REASON TO WALK EIGHTEEN CELLS (QUESTS/RUN), and the third is the cheapest and
needs no world change at all. So this lane's own next job is the last unwalked
piece it owns: THE COMMITMENT CONSEQUENCES. Taking a side is walked, but `burned`
-- the stage that cannot be walked back -- has never been reached by anybody, and
neither has NEGLECT, the cost of not turning up, which is the only thing in the
stack that moves while the player is doing something else.

--- superseded note, kept for the trail ---
THE SIXTEEN NAME MECHANICS had never been walked. Every outfit does something different when you ask its members their
name (the 8/11 introductions organ, 46 gated claims) and every one of those
claims is STRUCTURAL -- the rule resolves, the anchor holds, the signature is
distinct. NOT ONE presses the button on a real member of a real outfit and reads
what comes back. That is exactly the shape that hid four bugs this week, and it
is sixteen presses.

---

FACTIONS (factions-ovkjpf): 8/19 (i) -- *** THE GATE SUITE WAS GIVING UP
TWO THIRDS OF THE WAY THROUGH AND LOOKING LIKE IT PASSED. Fixed, plus the
45-MINUTE ORPHAN underneath it. TAB: none, this is the machine that guards every
tab. ***

A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED makes bohemia_gates.py the net and
"green or it does not ship" the rule. EVERY LAW IN THIS REPO RESTS ON THAT
SENTENCE, AND IT HAD QUIETLY STOPPED WORKING. The WORLD lane measured 217 of 382
gates before the container clock killed it; this lane hit the same wall twice in
one session. So every lane was shipping on a PARTIAL run and could not tell which
part it missed -- a killed run does not announce itself, it trails off mid-table
and the last thing on screen is a pass.
  SILENCE ABOUT AN UNRUN GATE READS EXACTLY LIKE GREEN.
That is a bug in the RUNNER, not in any gate, which is why it belonged to nobody
and sat.

THE ROOT CAUSE, MEASURED: the per-gate cap was 1800s and TOOLS RUN spends all of
it (bohemia_district_hero_factory.py takes 31 MINUTES). ONE GATE ATE THIRTY OF
THE ~FIFTY MINUTES A CONTAINER SURVIVES, and the verdict is identical either way
because a timeout is a failure. The extra 23 minutes bought nothing except the
last third of the table never running.

WHAT CHANGED, all in the runner, no gate's assertions touched:
  - 600s per-gate cap (BOHEMIA_GATE_CAP). Longest HEALTHY gate measured is 61s.
    A gate that cannot answer in ten minutes is broken as a ship gate whether it
    would pass or not; every ship in this repo waits behind it.
  - a whole-suite budget so the run STOPS ITSELF WHILE IT CAN STILL SPEAK.
  - the unrun list printed BY NAME, under NOT GREEN AND NOT RED: UNFINISHED.
  - exit 1 on an unfinished run. An unrun gate has held nothing.
  - a [n/total] counter on every line, so even a hard kill says how far it got.
  - --only <name>, so a lane keeps the lock, deps check and table check instead
    of calling gates by hand. AND A FILTERED RUN NEVER SAYS ALL GATES GREEN
    EITHER -- same lie as silence, smaller.

*** AND A SECOND BUG UNDER IT, FOUND BY LOOKING AT WHAT WAS STILL ON THE CPU. ***
subprocess.run(timeout=) kills the CHILD it started and NOTHING ELSE. TOOLS RUN
spawns the hero factory, so when the gate hit its cap and was declared timed out
THE FACTORY KEPT RUNNING -- caught at FORTY-FIVE MINUTES, burning a core beside
every gate that ran after it. So every timing downstream of a timeout was
inflated by a process nobody could see, and the measurement above UNDERSTATES
what the old cap was costing. Each gate now runs in its own process group and a
timeout kills the GROUP.
PROVEN BOTH WAYS before the claim was written: old path leaves the grandchild
alive (rc=124, 1 left), group kill reaps it (rc=124, 0 left). Mutation-tested.
Gate: suite_honesty_gate.js 11/11 -- it RUNS THE RUNNER in a child process,
because "the code has an unrun list" and "the run says so" are different facts.
It drives --dry-run (walks the table, executes nothing) so ONE SUITE AT A TIME
(7/30) is untouched for every run that actually runs something.
Law: laws/BOHEMIA_ADDENDUM_A_SUITE_THAT_CANNOT_FINISH_8_19_26.md

*** AND IT RUNS IN SHARDS NOW, BECAUSE THE SUITE IS BIGGER THAN A CONTAINER. ***
With the cap fixed and the orphan reaped it still could not finish: 236 gates in
2748s, 15 failures, and 150 NAMED as never run. Honest, and unfinished. That is
~11.6s a gate, so all 386 need ~75 minutes and a container survives ~50 -- TOOLS
RUN's whole 600s is only a third of a 25-minute gap, so NO AMOUNT OF TRIMMING
CLOSES IT. Hence --shard i/n, interleaved so each shard gets a fair mix instead
of one inheriting every browser gate.
  MEASURED, and guessing was the mistake:
    full run       owned 386, ran 236, 2748s  -> NO, 150 unrun
    --shard 1/2    owned 193, ran 162, 2707s  -> NO, 31 of its own unrun
    --shard 1/3    owned 129, ran 129, 1490s  -> YES, reached 385/386, no unrun
  THREE SHARDS, ~25 MINUTES EACH. Use:
    python3 gates/bohemia_gates.py --shard 1/3   (then 2/3, then 3/3)
THE CLAIM THAT MATTERS IS COVERAGE, NOT SPEED: a scheme that drops or
double-runs a gate is WORSE than none because it still looks complete. So the
gate counts the UNION and the MULTIPLICITY against a full run -- 386 in both
halves, every gate exactly once. Both failure modes mutation-proven.

*** AND A REAL SHARD RUN FOUND A BUG I HAD SHIPPED 20 MINUTES EARLIER, IN THE
EXACT THING THIS WORK EXISTS TO PREVENT. *** --shard 1/2 owns 193, stopped having
run 162, and reported SIXTY-TWO never ran. It owned 31. The unrun list took
GATES[i:] wholesale and counted THE OTHER SHARD'S GATES as ones it had failed to
reach. A NUMBER THAT READS LIKE A FACT AND IS NOT ONE is the disease this work
exists to kill, and it shipped inside the cure.
Now checked as ARITHMETIC rather than as a shape, which is what makes it
provable: what a run RAN plus what it reports UNRUN must equal exactly what that
run OWNED. Asserted for a full run, both halves of a 2-shard split, and an --only
run. THE MUTATION IS THE INSTRUCTIVE PART: restore the wholesale count and three
of four go red while THE FULL RUN STAYS GREEN -- which is exactly why the
original bug was invisible.
And the runner works out the shard count ITSELF now rather than leaving the next
person to guess as I did, printing the measured seconds-per-gate and AT LEAST how
many shards cover the table. The rate is a SAMPLE and not a random one (the slow
gates cluster; one alone is 600s), so it leaves real headroom.
suite_honesty_gate: 19/19, six mutations all bite.

FOR ANYBODY DEBUGGING PROCESSES IN THIS REPO: `pkill -f <pattern>` and
`pgrep -f <pattern>` MATCH THE COMMAND LINE THEY ARE TYPED ON. Three times this
turn a cleanup command killed its own shell (exit 144) because the pattern was in
the bash -c string. Put the pattern in a script file.

*** AND THE THING THAT ACTUALLY BLOCKS THIS LANE, MEASURED AND NOT MINE. ***
I went to make the faction systems reachable and found the substrate empty:
    people in the valley                298
    populated neighbourhoods            139
    distinct home coordinates           298
    household size distribution      {1: 298}
    people sharing a roof with anybody    0
EVERY PERSON IN LAS VEGAS LIVES ALONE. bohemia_population declares
HOUSEHOLD_MEAN = 2.2 and what reaches the walked surface is 1.0.
MY FIRST READ WAS WRONG AND THE MEASUREMENT CORRECTED IT: I blamed the city's
ctAgent adapter, but pplPeople's own records already carry 298 distinct home
coordinates. The adapter is faithfully reflecting one-person-per-house.
So the HOME focus -- one of the three dimensions of the acquaintance graph -- can
never fire for anybody, affiliated or not. A third of the social substrate is
dead by construction, and only WORK can currently produce a tie at all.
I DID NOT WIDEN THE TIE RULE and I DID NOT EDIT bohemia_population (ONE SYSTEM
ONE SESSION, and the WORLD lane shipped into it twice today). Record with the
numbers: records/BOHEMIA_NOBODY_IN_THE_VALLEY_SHARES_A_ROOF_8_19_26.md
  IF PEOPLE EVER SHARE ROOFS, this lane's word-of-mouth, broker position and
  side-cost systems COME ALIVE WITH NO FURTHER WORK. They are wired, gated and
  waiting on exactly that one fact.

NEXT FOR THIS LANE (decided, not asked): nothing more on word-of-mouth until the
substrate changes -- building a fourth dormant system is the STOP PRODUCING
failure by definition. The reachable work is on the SINGLE person in front of
you, which needs no graph: the claim and the favour still only ever call adjust()
on ctFid, and the introductions/bargain/wall/claim/favour stack has never been
walked end to end by one player in one sitting on the real surface.

---

FACTIONS (factions-ovkjpf): 8/19 (c) -- *** 298 PEOPLE IN THE VALLEY WERE
ANSWERING TO 17 NAMES, AND THE WHOLE WORD-OF-MOUTH GRAPH WAS FICTION BECAUSE OF
IT. Also: taking a side finally costs you somewhere else. TAB: CITY. ***

WHAT I WAS BUILDING. The `burned` commitment stage has shipped this sentence
since 8/15: "You cost yourself somewhere else to be here." NOTHING ANYWHERE EVER
COST YOU SOMEWHERE ELSE -- BohemiaBelonging.adjust was called in exactly two
places and both passed the outfit you are standing in front of. Word travelled,
the card printed WHO WILL HEAR, and then nothing happened to any of them. Same
disease as the debt that was never collected, one system over, in a system this
lane wrote itself.

IT NEEDS NO RIVALRY TABLE AND THAT IS WHAT KEEPS IT LEGAL. Who hates whom is HIS
canon and unruled. Coser / Lipset & Rokkan: a tie to one side is a liability with
EVERY other side, not only declared enemies, and that generalised liability IS
the mechanism by which cross-cutting ties damp conflict. So the cost lands on
whoever finds out, and no outfit is named anywhere in the code (asserted).
  A RUMOUR CANNOT COST YOU -- read off LANDING's own shipped words, "they will
    not hear exactly what". You do not lose standing over what nobody can pin on
    you.
  YOU CANNOT FALL BELOW A STRANGER, and it never takes more than you had.
  THE AMOUNT IS THE STAGE INDEX (0/1/2), derived like neglect, never typed.
  AND IT IS PRINTED BEFORE THE BUTTON (this lane's own 8/15 rule 2): a cost you
    find out afterwards is a punishment, a cost you read first is a decision.
This is also what finally makes TERTIUS a decision instead of a caption: stand
where your outfits have no line to each other and it costs you NOTHING.
Law: laws/BOHEMIA_ADDENDUM_IT_COSTS_YOU_SOMEWHERE_ELSE_8_19_26.md

*** AND BUILDING IT FOUND SOMETHING MUCH WORSE. ***
The card reported TRADES hearing about a Reds commitment through a FACTION focus
at one hop. That is impossible -- a faction focus cannot bridge two factions,
their keys are F:REDS and F:TRADES and they do not match. So I pulled the thread.

  MEASURED ON THE REAL PAGE:
    people in the valley roster            298
    distinct ids                            17
    ids used by more than one person        16
    ids used by people IN DIFFERENT OUTFITS 11
  "H1-1" alone covered ~140 people spanning Cartel, Caravans, Colorful, Network,
  Homeless, Reds, Trades, Volunteers and Remnants.

bohemia_population numbers people PER NEIGHBOURHOOD (H1-1, H2-1...) and
ctValleyRoster concatenates every neighbourhood. whoHears keys byKey/seen/tiesOf
on that id, so one name stood in for a hundred and forty real people and the rest
were silently skipped as already-visited. THE SOCIAL GRAPH OF THE VALLEY WAS
LARGELY FICTION, and had been since 8/15.

WHY NO CLAIM CAUGHT IT, AND THIS IS THE PART THAT GENERALISES: every who-hears
assertion tested SHAPE -- somebody hears, a rumour lands further than a fact, the
bridge is cross-cutting -- and all of those stay TRUE on a graph built from
colliding keys, because COLLISIONS ADD EDGES RATHER THAN REMOVE THEM. Nothing
ever looked empty, so nothing ever looked wrong. NOBODY ASKED WHETHER TWO PEOPLE
WITH THE SAME NAME WERE THE SAME PERSON. A shape assertion structurally cannot
ask that.

THE FIX IS FOUR LINES and engine/ is untouched: the foci were never wrong
(home.building and j.site are real valley coordinates, unique across the map),
only the KEYS collided, and whoHears has accepted an opts.keyOf since the day it
was written. 298 people, 298 distinct keys now.
Law: laws/BOHEMIA_ADDENDUM_TWO_HUNDRED_PEOPLE_SEVENTEEN_NAMES_8_19_26.md

*** AND THE FIX EMPTIED THE FEATURE, WHICH IS THE FINDING, NOT A PROBLEM TO HIDE.
With real keys NOBODY IN THE VALLEY HEARS ANYTHING AT ALL. Ground truth, and it
does not depend on keys:
    people 298 | affiliated 32 | outfits present 11
    distinct homes among affiliated people      32
    homes shared by two affiliated people        0
    workplaces holding two DIFFERENT outfits     0
THIRTY-TWO AFFILIATED PEOPLE LIVE IN THIRTY-TWO DIFFERENT BUILDINGS. Not one pair
shares a roof, never mind two different outfits sharing one. So the 8/15
word-travels system was producing output ONLY because of the collisions.

I DID NOT WIDEN THE TIE RULE TO MAKE MY FEATURE LOOK ALIVE -- that would have
manufactured exactly the fiction the fix just deleted, the same bug chosen on
purpose. The density dials (REACH_CELLS 12, AFFILIATED_RATE) and base placement
are HIS and already flagged. This lane records the number and stops.
H3 asserts CONSISTENCY, never emptiness -- the card must never say an outfit
heard when no two outfits share a setting -- so it holds in both worlds.

GATES: COMMITMENT 72/72 (parts G and H new, three mutations all bite), TIES
40/40, INTRODUCTIONS 46/46, BELONGING 58/58, CARD FOLD 11/11, CLAIM 45/45,
FAVOUR 31/31. A13 was fixed AT THE RULER: it asserted "exactly three
placeholders" as a proxy for "everything unruled is tagged", and went red the
moment a second priced fact was tagged CORRECTLY.

NEXT FOR THIS LANE (decided, not asked): THE OTHER TWO WRITERS. adjust() is now
called on somebody other than the person in front of you exactly once. The claim
(8/16) and the favour (8/16) still only ever touch ctFid, so refusing the Church
is invisible to everybody who would care. Same shape, same graph, and it is
DORMANT UNTIL THE DENSITY CHANGES -- which is the honest reason to do the cheap
half first and not pretend otherwise.

---

FACTIONS (factions-ovkjpf): 8/18 (m) -- *** THE WALL WAS A SIGN AND NOT A
FENCE, FOR THREE DAYS, AND EVERY GATE WAS GREEN. Also: the person card had
quietly grown to 96% of the phone. TAB: CITY (tap anybody who runs with
somebody) + LOOK ("THE CARD FITS AGAIN"). ***

THE FIND, AND IT IS THE ONE WORTH READING. 8/15 shipped THE WALL: turning up for
an outfit runs out of road, and only a real commitment gets you past it. The card
says so. The organ clamps. AND THE BUTTON DID NOT GO THROUGH THE ORGAN.
BohemiaCommitment.give() -- the clamp, the whole point of the system -- was called
ZERO TIMES on the walked surface. The act button went straight to
BohemiaBelonging.record(), which has no ceiling at all.

  MEASURED ON THE REAL CARD, BEFORE THE FIX:
    press the act row 9 times  ->  gave 9, ceiling 5, commitment 'none', row COUNTED
  You walk through the wall while the card tells you it is there.

WHY EVERY GATE WAS GREEN, WHICH IS THE PART TO KEEP. Two checks existed, both
real, both passing, and BOTH TRUE: part A proved give() clamps (it does, and
nothing called it); part D proved the card DISPLAYS the wall and that the commit
button MOVES the state (both true). NO CLAIM ANYWHERE PRESSED THE ACT BUTTON PAST
THE WALL ON THE REAL SURFACE. Same shape as the 8/15 stale-agents outage one
level down: THE ORGAN WAS VERIFIED AND THE WIRING WAS NOT, and "the card shows
the right thing" was mistaken for "the thing is enforced".

FIXED BELT AND BRACES: the act button is not offered at the wall (a button that
does nothing tells the player the wall is soft, which is the exact lie the wall
exists to prevent), AND both writers go through ONE clamped helper so a third
caller cannot quietly reopen it.

AND THE FIRST VERSION OF THE NEW CHECK WAS ITSELF A LIE -- hiding the button did
all the work, so Ez1 PASSED with the clamp completely gutted. Ez6 presses the
writer directly with no button in the way. Mutation-proven: gut the clamp, that
claim goes red (52/1); restore it, 53/0. EVERY CLAIM THIS LANE SHIPS NOW GETS
WATCHED TO FAIL ONCE BEFORE IT IS TRUSTED.
Law: laws/BOHEMIA_ADDENDUM_THE_WALL_WAS_A_SIGN_8_18_26.md

*** SECOND THING: NOBODY OWNED THE TOTAL. *** Five systems write rows onto the
person card now (the name, the bargain, the wall, the claim, the favour). Every
one asked "is my row right?" and every one was right. Nobody asked what the card
WEIGHED. Measured at iPhone portrait, 844px tall:
    first meeting        15 rows   591px   70%
    after taking three   17 rows   640px   76%
    counted and owing    22 rows   808px   96%
At 96% the card IS the phone and the sixth system overflows it. This is what the
factory pattern does when it works: independent systems, each gated on its own
correctness, sharing one finite surface nobody's gate measures.

THE FOLD, and it is not a taste call. Nielsen 2006 (progressive disclosure) plus
Cowan 2001 (the real working-memory limit is about FOUR chunks, not seven) give
the rule; THE DATA gives the answer to what folds: THEY WANT / THEY HOLD / PAID
IN / CAREFUL are IDENTICAL on every member of that outfit forever, so they are a
fact about the OUTFIT and you read terms ONCE. They collapse to one tappable line
the moment you have any standing at all (gave > 0) -- exactly the moment you have
demonstrably already acted on those terms, so it reads off state that already
exists: NO new save field, NO new dial, nothing PENDING. 96% -> 84%.
DEFER, NEVER DROP: every folded fact returns on tap, and the gate reds if it does
not. A first meeting still shows the terms in full (you cannot have read what you
were never shown) and the next card opens folded again.
Law: laws/BOHEMIA_ADDENDUM_THE_CARD_HAS_TO_FIT_8_18_26.md

*** AND THEN THE REAL SURFACE CAUGHT WHAT NINE GREEN CLAIMS COULD NOT. *** All
nine passed while the tap target was 153x14px. Every one of them opened the fold
with .click() or an element tap, which lands DEAD CENTRE every time -- and a thumb
on a real phone does not. Apple's HIG has said 44x44 since 2013 and Material says
48dp, for the same physical reason: a fingertip contact patch is about 10mm.
The whole ROW is the target now (332x46px), and A10/A11 measure the BOX on a real
touch page and open it with a REAL TAP instead of a synthetic click. Cost 2 points
of screen (84% -> 86%), which is the correct trade. Mutation-proven.
  THE HANDLER IS BOUND and A PERSON CAN REACH IT ARE DIFFERENT FACTS, AND ONLY ONE
  OF THEM IS THE GAME. A synthetic click is the touch-target equivalent of a gate
  that mocks the thing it is testing -- the same disease as 8/15's stubbed
  ctFactionOf, one layer up.

TWO MORE THINGS ONLY LOOKING AT THE RENDERED PIXELS CAUGHT (VERIFY ON THE REAL
SURFACE, 7/18), also after the gate was already green:
  1. The fold said "tap to read THE REST" one row under the Cartel's "HOW YOU GET
     THE REST -> NOTHING. EVER." Two different "the rest", one line apart, on a
     390px phone. Neither row is wrong; the collision only exists once they are
     neighbours. It says "tap to read" now.
  2. The commitment row was labelled "YOU HAVE" and sat four rows under "YOU HAVE
     MET", so it read as a truncated duplicate. It is "HOW FAR IN" now.

GATES: CARD FOLD 9/9 (new, all nine mutation-proven), COMMITMENT 53/53 (Ez6 new),
CLAIM 45/45, FAVOUR 31/31. Card measured at 84% on the merged tree with the
PEOPLE lane's 8/18 work in -- they added to the exchange surface, not the card,
so no collision.

*** THE STANDING JOB THIS CREATES, FOR ANY LANE: EVERY LANE THAT ADDS A ROW TO A
SHARED SURFACE OWNS THE TOTAL, NOT JUST THE ROW. The next system to write onto
the person card starts by measuring it. ***

*** THIRD THING: I KILLED MY OWN NEXT JOB, BECAUSE IT WAS WRONG. *** The handoff
has said "CONSOLIDATE THE TWO RUNGS TABLES" for four days and I restated it three
times. bohemia_standing (8/2, PEOPLE) and bohemia_belonging (8/12, this lane) both
have a RUNGS table, so it looked like the last duplicate mechanism in the lane.

IT IS A NAME COLLISION, NOT A DUPLICATE, and the evidence was sitting three lines
above my own flag in my own 8/15 law -- a table saying the two modules answer
DIFFERENT QUESTIONS. I read the identifier and stopped reading.

  MEASURED, feeding the SAME NUMBER to both:
      n=0   belonging A STRANGER              standing NEUTRAL
      n=1   belonging SOMEBODY WHO SHOWED UP  standing WARM
      n=3   belonging USEFUL                  standing FWU
      n=6   belonging COUNTED                 standing FWU
      n=10  belonging INSIDE                  standing FWU
  They disagree on EVERY input. They share ZERO words. Standing goes negative
  (people can think worse of you than nothing); belonging cannot (you cannot be
  less than a stranger to an outfit you never helped).

AND THE ARGUMENT THAT SETTLES IT: you can be INSIDE the Cartel and still be
somebody a particular member thinks badly of. Both true at once, both load-
bearing. ONE TABLE CANNOT HOLD THAT STATE. A "consolidation" would not tidy these,
it would silently rewrite both systems' answers.

FENCED so nobody does it later: commitment_gate part F, 6 claims, READ-ONLY
against the other lane's module (this lane already overwrote bohemia_standing.js
once by accident on 8/15 -- it is not mine to rename). 59/59.
Record: records/BOHEMIA_THE_TWO_RUNGS_TABLES_ARE_NOT_A_DUPLICATE_8_18_26.md
LESSON: A SHARED IDENTIFIER IS NOT A SHARED MECHANISM, AND A FLAG IS A HYPOTHESIS,
NOT A WORK ORDER. Anything sitting in the handoff as "next" gets re-derived before
it gets done, not after. Four minutes of printing two tables would have caught it.

NEXT FOR THIS LANE (decided, not asked, and this one IS derived): NOTHING COSTS
YOU ANYWHERE ELSE. The commitment stage called "burned" says, in its own shipped
text, "YOU BURNED A BRIDGE -- you cost yourself somewhere else to be here", and
GREP SAYS NOTHING ANYWHERE EVER COSTS YOU SOMEWHERE ELSE: BohemiaBelonging.adjust
is only ever called with ctFid, the outfit you are standing in front of. Word
already travels (whoHears/landing ship and work -- other outfits hear what you did
AS FACT at one hop and AS A RUMOUR beyond) and then NOTHING HAPPENS TO THEM. It is
the same disease as the debt that was never collected, one system over: a stage
named for a consequence the game does not apply. The research is already done and
it is the whole point of the cross-cutting-cleavage literature (Coser, Lipset &
Rokkan): a tie to one side is a LIABILITY with the other, and that liability is
the mechanism by which cross-cutting ties damp conflict. Taking a side should cost
you with whoever hears it and cares.

STILL [PENDING Paolo], unchanged and NOT mine: REACH_CELLS (12) and
AFFILIATED_RATE (0.30), the two dials that decide how far you walk before you
meet anybody who runs with anybody. From the spawn cell the nearest 1,438 people
include ZERO affiliated; the first is 9 cells out, the nearest base 29. Base
placement is MAP LAW (his), and routing the demo past an outfit is QUESTS/RUN.

---

FACTIONS (factions-ovkjpf): 8/18 -- *** THE DEBT GETS CALLED IN. The free
thing the Cartel gave you three days ago now has somebody coming for it.
TAB: CITY (tap anybody who runs with somebody) + LOOK ("THEY ARE NOT WAITING"). ***

THE HOLE. 8/16 shipped the favour: some outfits hand you something free the first
time you meet them and it puts you in DEBT, and the card kept a tally. NOTHING
EVER COLLECTED IT. His Cartel canon ("They want you to OWE them") had a hook and
no line -- the authored-but-unread disease inside a system this lane wrote itself
two days earlier.

THE THREE CONNECTIONS:
  1. AN OUTFIT YOU OWE DOES NOT WAIT ITS TURN. makeRation has carried a BYPASS
     slot since Paolo approved it 7/26 ("the birthday shape: an occasion that
     ignores both windows") and NOTHING HAD EVER CALLED IT. This is what it was
     for: the weekly limit models restraint and a creditor has none.
  2. REFUSING A CREDITOR COSTS MORE THAN REFUSING A FRIEND -- one extra rung per
     unpaid favour. Measured on the real card: counted at 6, owing 3, refuse -> 2.
     That is the whole reason the free thing was free.
  3. AND THE ACCOUNT CAN BE CLOSED. Meeting a claim works one favour off, because
     A DEBT YOU CAN NEVER CLEAR IS A SENTENCE, NOT A RELATIONSHIP (Gouldner: the
     interval between taking and returning has to be able to close).
The card says THEY ARE NOT WAITING / "the polite gap between asks is for people
who do not" -- without that row the bypass is invisible and the player cannot
trace it to the free thing they took, which is the fact that made it a decision.

  law: laws/BOHEMIA_ADDENDUM_THE_DEBT_GETS_CALLED_IN_8_18_26.md
  gates/claim_gate.js part D2, 9 new claims (45 total); favour 31 unchanged
  wired by tools/bohemia_city_collect_patch.py; engine/bohemia_favour.js settle()

THE BOUNDARY, ASSERTED NOT TRUSTED: favour owns the debt, claim owns asking, and
NEITHER TOUCHES THE OTHER'S SAVE. The claim takes a NUMBER and returns a NUMBER;
the surface reads the ledger, passes the int and applies the settlement through
the ledger's own writer. Claim could have imported favour -- one import and a
circular dependency waiting to happen, since favour already anchors ON claim.

THE ANCHOR LAW EARNED ITS KEEP. Changing answer(save,fid,said,given) ->
answer(...,owed) made bohemia_favour's citation of it stale and THE GENERATOR
REFUSED TO RUN, the same minute, not a week later. The anchor now names the
`owed` parameter specifically, so dropping it refuses rather than silently
ledgering a debt nobody ever asks about.

WHAT COMES NEXT FOR THIS LANE, in order:
 1. THE PERSON CARD IS GETTING LONG. Five systems now write rows onto it (name,
    bargain, wall, claim, favour) and on the collection screenshot it is ~20 rows
    before the buttons. It all reads, but it is one more system away from being a
    wall of text. Worth a pass that decides what COLLAPSES when it is not the
    live question, before adding a sixth.
 2. Consolidate the two RUNGS tables (bohemia_standing 8/2 + bohemia_belonging
    8/12). Flagged 8/15, still open, last known duplicate mechanism in the lane.

STILL TRUE AND STILL NOT MINE: from the spawn cell the nearest 1,438 people
include ZERO who run with anybody. Base placement is MAP LAW; REACH_CELLS and
AFFILIATED_RATE are [PENDING Paolo]; routing the demo past an outfit is QUESTS/RUN.

THE FOUR-COMMAND RULE still holds: any engine edit stales the city inline copies
(bohemia_city_module_resync.py), the run slice (build_run_slice.js), the census
(bohemia_reachability_census.py) and the LOOK pictures (bohemia_look_shots.js +
bohemia_look_build.py). All four run before every ship.
FACTIONS (factions-ovkjpf): 8/17 -- *** THE LADDER FINALLY POINTS AT
SOMETHING: THEY CAN GIVE YOU THINGS NOW, AND THE FREE ONES ARE THE DANGEROUS ONES.
TAB: CITY (tap anybody who runs with somebody) + LOOK ("THE FIRST THING IS FREE"). ***

THE HOLE. 8/12 the ladder, 8/15 the wall, 8/16 the claim -- so an outfit could
COUNT you and LEAN ON you, and could never GIVE YOU ANYTHING. His sixteen `pays`
and `hold` lines, real economies thumbed 8/2, were CARD TEXT: swept engine/ and
there was no ask/request/receive/grant anywhere. You could climb to INSIDE and the
only thing that changed was a word.

THE RESEARCH, AND HIS OWN CANON GOT THERE FIRST. Scott 1972 and Eisenstadt &
Roniger 1984: a patron tie carries "LONG-RANGE CREDIT AND OBLIGATIONS" -- it is a
RUNNING ACCOUNT, not a trade. You do not pay for a favour, you carry one. And the
CARTEL DOSSIER WROTE THAT MECHANIC ON 8/2, in his words: "They want you to OWE
them... the first thing they give you is free and it is exactly the thing you
needed that week." The research did not tell me what to build; it told me what he
had already built and I had not read as a mechanic.

THREE ECONOMIES, ALL OFF firstMove -- CANON THAT HAD NEVER DONE ANYTHING BUT
PRINT ONE WARNING ROW:
  they-give-first (4)  give from the FIRST meeting, free, and it puts you in DEBT
  you-give-first (11)  nothing until they COUNT you, and then it SPENDS standing
  never (1)            nothing to anybody, at any depth, and the card says it is
                       not a depth problem
What they hand over is his line BYTE FOR BYTE across every outfit (gated), and no
outfit is named in the module's code.

THE ONE-GESTURE MERGE, and it is the nicest thing in the turn. The Cartel WANTS
`debt`, so the thing they want FROM you and the favour they offer TO you are the
SAME MOTION -- the card was offering it twice. That is not a wiring accident: with
them, HELPING YOURSELF IS HOW YOU CLIMB AND EVERY RUNG IS A DEBT. One button now
fires both halves; measured on the real card, one press gives gave:1 AND owed:1.

  engine/bohemia_favour.js   generated by tools/bohemia_favour.py
  gates/favour_gate.js       31 claims, registered as FAVOUR
  law: laws/BOHEMIA_ADDENDUM_WHAT_YOU_CAN_ASK_OF_THEM_8_16_26.md
  wired by tools/bohemia_city_favour_patch.py

FOUR BUGS, ALL MINE, ALL FOUND BY LOOKING: ctAct.label read off null (the favour
is takeable when the act is blocked); the merge was COMPUTED BEFORE the thing it
reads so it silently never fired; a `var x = false` placed AFTER an earlier
assignment, which hoisting made clobber it back; and "1 times you took", the tell
of a string nobody read out loud.

*** THE FOUR-COMMAND RULE (was three on 8/16, and the fourth was found the same
way -- one suite at a time). ANY engine edit stales: ***
  python3 tools/bohemia_city_module_resync.py     the city's inline copies
  node    tools/build_run_slice.js                the legacy run slice
  python3 tools/bohemia_reachability_census.py    the census
  node    tools/bohemia_look_shots.js  + python3 tools/bohemia_look_build.py
                                                  the pictures (their mtime is
                                                  compared to the CITY's, so any
                                                  city change restales them all)

WHAT COMES NEXT FOR THIS LANE, in order:
 1. COLLECT THE DEBT. bohemia_favour records what you owe; bohemia_claim owns
    asking. Wiring "you owe them, so they ask harder / sooner / and refusing costs
    more" is the obvious next connection and it belongs in ONE place -- claim's.
    That closes the loop: take their help -> owe them -> they come for it.
 2. Consolidate the two RUNGS tables (bohemia_standing 8/2 + bohemia_belonging
    8/12). Flagged 8/15, still open, last known duplicate mechanism in the lane.

STILL TRUE AND STILL NOT MINE: from the spawn cell the nearest 1,438 people
include ZERO who run with anybody; first affiliated is 9 cells out. Base placement
is MAP LAW; REACH_CELLS and AFFILIATED_RATE are [PENDING Paolo]; routing the demo
past an outfit is QUESTS/RUN.

FACTIONS (factions-ovkjpf): 8/16 (b) -- *** WHO YOU RUN WITH IS NOW ABOUT
WHERE YOU LIVE, AND HALF THE VALLEY'S COMMUTE WAS BEING THROWN AWAY.
TAB: CITY (tap anybody near a faction base). ***

TWO BUGS IN factionOf, BOTH SILENT BECAUSE THE WRONG ANSWER LOOKS LIKE AN HONEST
"they run with nobody":
  1. jobCell() mapped FOUR bearings (N/S/W/E). That matched its only original
     producer -- jobsNear() scans a cardinal ring. Then on 8/15 I made the city
     pass through workDir from personFields, which draws from EIGHT. MEASURED:
     49% of the valley draws a diagonal and every one fell through to null, so
     the 8/11 ruling that you run with whoever your LIVING depends on was not
     running for half the people. Fixed strictly additively (the four cardinal
     answers are gated byte-identical). Valley affiliation 27 -> 31, outfits 10 -> 11.
  2. The pick was UNIFORM over everything in reach, so somebody living next door
     to the Church was exactly as likely to run with a Cartel twelve cells away.
     Kalyvas 2006: control is a continuum, not a radius, and COLLABORATION FOLLOWS
     CONTROL. The draw is weighted by distance now, linearly off REACH_CELLS
     itself -- NO NEW DIAL. Measured on the walked surface: standing on a base,
     11/16 affiliated people (69%) run with THAT outfit, and the Mob/Network
     bases sit 12 cells apart so you find BOTH on that ground -- a contested zone
     falling out of the geometry rather than being authored.
  law: laws/BOHEMIA_ADDENDUM_ALLEGIANCE_FOLLOWS_THE_GROUND_8_16_26.md
  gate: faction_membership_gate 60 claims (was 55)

I HAD TO REWRITE A GATE CLAIM AND THE REASONING IS IN THE LAW. The old claim
demanded an EVEN split across bases at 2, 8 and 12 cells -- correct while the pick
was uniform, and it existed to catch a correlated-hash bug that twice gave one
faction 63%. Under distance weighting an uneven split is the CORRECT answer, so
that claim would have forbidden the fix. The rewrite measures hash fairness at
EQUAL distance (34.1/33.5/32.4 -- the 63% bug would still be caught) and adds
three claims locking the new behaviour, including one asserting the unequal-
distance split IS uneven so nobody "restores" the old claim without seeing why.

*** THE THREE-COMMAND RULE, LEARNED THE HARD WAY TWICE NOW ***
ANY edit to an engine module stales THREE derived artifacts and each has its own
gate that finds out one at a time:
  python3 tools/bohemia_city_module_resync.py      (the city's inline copy)
  node    tools/build_run_slice.js                 (the legacy run slice -- still
                                                    has to stay byte-current)
  python3 tools/bohemia_reachability_census.py     (the census, if a surface moved)
  node    tools/bohemia_look_shots.js              (the LOOK pictures -- the gate
           + python3 tools/bohemia_look_build.py    compares their mtime to the
                                                    city's, so ANY city change
                                                    restales all of them)
FOUR, not three -- the fourth was found the same way as the other three, one
suite at a time. Run all four after any engine edit.

STILL TRUE AND STILL NOT MINE: from the spawn cell (48,48) the nearest 1,438
people include ZERO who run with anybody; first affiliated is 9 cells out. Neither
fix moves that -- it is base placement (MAP LAW) plus two [PENDING Paolo] dials
(REACH_CELLS 12, AFFILIATED_RATE 0.30). Routing the demo past an outfit is
QUESTS/RUN.

WHAT COMES NEXT FOR THIS LANE: consolidate the two RUNGS tables --
bohemia_standing (8/2 witness reputation) and bohemia_belonging (8/12 ladder)
both carry one. Flagged 8/15, still open, and it is the last known duplicate
mechanism in the lane.
FACTIONS (factions-ovkjpf): 8/16 -- *** THE OUTFIT ASKS YOU BACK NOW.
TAB: CITY (tap somebody you have done favours for) + LOOK (picture "THEY ASK YOU BACK"). ***

THE FEATURE. The ladder (8/12) and the wall (8/15) both modelled what YOU do to
THEM -- you could be COUNTED by the Church and they would never once ask you for
anything. Portes 1998's second dark side of social capital is EXCESS CLAIMS ON
GROUP MEMBERS, the half no faction system builds. So once an outfit counts you it
ASKS, for the thing it already wanted. SAYING YES BUYS NOTHING (it is the rent on
being counted, not a ladder). SAYING NO drops you straight below COUNTED, by an
amount derived from the shipped rungs. Gouldner 1960 is why it has a clock and not
a price: an unanswered claim ages in public and says how many days.
  engine/bohemia_claim.js (generated by tools/bohemia_claim.py)
  gates/claim_gate.js, 36 claims, registered as CLAIM
  law: laws/BOHEMIA_ADDENDUM_WHAT_BEING_INSIDE_COSTS_8_16_26.md
  wired by tools/bohemia_city_claim_patch.py; picture in the LOOK tab

ADOPTED, NOT REBUILT (again): the limiter is BOH_RESOLVE.makeRation, APPROVED by
Paolo 7/26 and unadopted until now -- its sibling makeCeiling was adopted 8/15, so
BOTH halves of that verdict are now live. Proven adopted by deleting the dependency
and demanding a refusal. Its LIMITS stay [PENDING Paolo] (verdict item c): the
surface passes {} so the pipe RUNS and never refuses yet.

*** THE THING THE NEXT SESSION MOST NEEDS TO KNOW, AND IT IS NOT MINE TO FIX ***
THE PLAYER MAY NEVER MEET ANY OF THIS IN THE DEMO. Measured on the walked surface
this turn: from the spawn cell (48,48) the nearest 1,438 PEOPLE INCLUDE ZERO who
run with anybody. The first affiliated person is 9 CELLS AWAY; the nearest faction
base is 29. The demo's three quests are EVENT-triggered (enter_building,
enter_district), not placed, so walking past an outfit is luck, not design.
Where the outfits sit is MAP LAW (Claude never designs map layouts) and both
REACH_CELLS (12) and AFFILIATED_RATE (0.30) are [PENDING Paolo] dials. ROUTING THE
DEMO PAST AN OUTFIT IS QUESTS/RUN. Stated rather than quietly tuned, because
stretching a dial to force gang members into the player's suburb would be fitting
the world to a screenshot.

FIVE BUGS THE GATE FOUND, NOT A PERSON, and two of them were MY OWN CHECKS:
  - the ration was one per PROCESS, not per save: limits froze at whatever the
    first caller passed and spent counts leaked across saves. One cause, four
    failures. WeakMap keyed on the save now.
  - the save was looked up by the DISPLAY LABEL ("THE CHURCH") not the id
    ("CHURCH"). Found nothing, forever, silently. SIXTH time this class has bitten.
  - I HAND-EDITED A GENERATED FILE (bohemia_belonging.js says EDIT THE TOOL NEVER
    THIS FILE) and the belonging gate's own regeneration check silently wiped it.
    That is what that check is for. Added to tools/bohemia_belonging.py instead.
  - E4 grepped a faction name out of a COMMENT -- a checker that cannot tell a
    mention from a use is the broken one. Strips comments now.
  - F2 asserted a design that was never the design. The claim was wrong, not the
    code. Both fixed at the RULER, never the target.

ALSO WORTH KNOWING: MY LOCAL BRANCH GOT REWOUND MID-SESSION by a stray rebase to a
commit from two days earlier, and a measurement I ran against it said "zero people
in the whole valley are affiliated" -- which was FALSE and nearly sent me
redesigning faction geography. origin/main was intact the whole time. If a
measurement contradicts a gate that just passed, CHECK WHICH TREE YOU ARE ON before
believing either.

WHAT COMES NEXT FOR THIS LANE: (1) consolidate the two RUNGS tables --
bohemia_standing (8/2 witness reputation) and bohemia_belonging (8/12 ladder) both
carry one, flagged 8/15 and still open. (2) The Voronoi-contestation model for
factionOf: control should be a Kalyvas gradient (five zones, collaboration follows
control) rather than a hard 12-cell cliff where allegiance switches off at an exact
radius. Researched this turn, NOT built -- it preserves his dial exactly and makes
contested ground real, which would feed the who-will-hear graph directly.

FACTIONS (factions-ovkjpf): 8/15 -- *** THE LADDER HAS A WALL NOW, AND
BUILDING IT FOUND THAT NOBODY IN THE CITY HAD EVER HAD A FACTION AT ALL.
TAB: CITY (walk up to somebody and tap them) + LIFE (the page "THE WALL"). ***

THE FEATURE. The 8/12 ladder went stranger -> inside and you could climb all of it
by pressing one button ten times. Now turning up RUNS OUT OF ROAD: the Church will
call you USEFUL and never COUNTED however many times you show up. The only thing
that passes a wall is a COMMITMENT ("say you are with them"), and the card tells
you WHICH OTHER OUTFITS WILL HEAR ABOUT IT BEFORE YOU PRESS -- as fact at one hop,
as a rumour further out, silence where there is no line at all.
  engine/bohemia_commitment.js (generated by tools/bohemia_commitment.py)
  gates/commitment_gate.js, 47 claims, registered as COMMITMENT
  law: laws/BOHEMIA_ADDENDUM_THE_WALL_AND_WHO_FINDS_OUT_8_15_26.md
  page: slices/BOHEMIA_THE_WALL_8_15_26.html, linked in the LIFE tab

IT ADOPTS RATHER THAN REBUILDS. BOH_RESOLVE.makeCeiling was APPROVED BY PAOLO ON
7/26 and had ZERO CALLERS for twenty days. The gate proves the adoption by
DELETING the dependency in a child process and demanding a refusal -- every other
check would still pass if a private fallback clamp existed.

*** THE BIG FIND, AND IT IS BIGGER THAN THE FEATURE. ZERO PEOPLE IN THE CITY RAN
WITH ANYBODY. *** Not few. None, measured across 166 people at 40 locations and
then all 56 people standing on all 14 faction bases. Two failures stacked:
  1. The city carried a 7/29 SNAPSHOT of engine/bohemia_agents.js. The faction
     half of that module (factionOf, normalizeBases, jobCell, AFFILIATED_RATE,
     REACH_CELLS) was written 8/11 -- THIRTEEN DAYS LATER -- and never landed.
  2. This lane's own bridge was `try { ... } catch(_e){ return null; }`, so a
     TypeError became "nobody in Las Vegas runs with anybody", silently, forever.
NULL WAS ALREADY A REAL ANSWER (most of the valley belongs to no outfit), which is
exactly why it must never also be the error answer. Fixed both. After: 298 people,
27 affiliated, 10 outfits, on the walked surface, for the first time.

AND MY OWN GATE NEVER SAW IT BECAUSE IT STUBBED ctFactionOf. Four green turns were
true about a stub. A TEST THAT MOCKS THE BROKEN THING CANNOT SEE THAT IT IS
BROKEN. Both gates now find a REAL affiliated person or fail and say the world has
none (commitment_gate D3a/D10/D11, walked_surface_gate C1a).

*** I ALSO OVERWROTE A SHIPPED MODULE AND ITS GATE. *** I first called this
bohemia_standing.js. engine/bohemia_standing.js ALREADY EXISTED -- 8/2, witness
reputation on bohemia_memory, gated 35/35, commit titled "WORD TRAVELS". Restored
from git the same turn; its gate is 35/35 untouched. My REUSE CHECK swept for a
CALLER of makeCeiling instead of asking whether a module for this already existed.
THE BOUNDARY, so nobody builds a third:
  bohemia_standing.js    what people THINK of you, from deeds they SAW
  bohemia_commitment.js  how far IN you are with an outfit
Both now carry a RUNGS table. FLAGGED FOR CONSOLIDATION, not merged blind.

THREE MORE BUGS THE GATE FOUND, NOT A PERSON: the card promised "1 MORE TO
COUNTED" when one more did nothing; allegiance was computed at the PLAYER's cell
so walking one cell changed who somebody ran with; and the "valley" roster was a
window around the player, so standing near the map edge gave a 119-person valley.

WHAT IS THIN, AND IT IS NOT THIS LANE'S TO MOVE: only 3 of 10 outfits have any
line to another, because affiliation is 9% not the 30% AFFILIATED_RATE names --
most cells are further than REACH_CELLS (12) from any base. That is a MAP fact
(MAP LAW: Claude never designs map layouts) and a [PENDING Paolo] dial. Stated on
the page rather than tuned, because tuning it would mean inventing density.

WHAT COMES NEXT FOR THIS LANE, in order: (1) THE CLAIM -- Portes' "excess claims
on group members", the half nobody builds: once you are COUNTED the outfit starts
asking things of YOU, and refusing costs a rung. The research is done and in the
law; the organ is not built. (2) consolidate the two RUNGS tables. (3) the RATION
half of the 7/26 verdict is still unadopted.

FACTIONS (factions-ovkjpf): 8/12 (c) LATEST — *** HE CLOSED THE ENTRANCE'S SCOPE THE
SAME DAY HE OPENED IT: ONE MAIN QUEST, FOURTEEN DRESSINGS. NOT FOURTEEN GAMES. ***
laws/BOHEMIA_ADDENDUM_THE_CUSTOMIZABLE_ENTRANCE_8_12_26.md (updated)
Gate: ENTRANCE SCOPE, 10/10, BLOCKING. Tab: LIFE -> THE ENTRANCE (opens on it).

HIS WORDS, asked whether the faction choice changes the main quest's CONTENT or only
where it opens: "It only changes the location and possible vibe and colors possible
dialogue but yeah it's not day and night. It's just with different clothes on."

    MOVES: location, vibe, colours, some dialogue
    DOES NOT MOVE: the story, the family, the beats (fight / sibling / dinner / burial),
                   the arc, the ending, the structure

THE SECOND HALF IS THE ONE A BUILD QUIETLY LOSES, which is why it is gated. A
customizable entrance is exactly the feature that becomes fourteen games: the Cartel
opening should REALLY be different so it gets its own quest file, then the Church one
does, and now there are fourteen main quests to write, test and keep in sync forever --
for a difference he says outright is NOT day and night.
    FOURTEEN DRESSINGS IS A WEEK. FOURTEEN QUESTS IS THE REST OF THE YEAR.

THE DRESSING PATH ALREADY EXISTS AND IS PROVEN, so nobody has an excuse to fork: the .bq
format gates an option on the player's faction TODAY. Measured by the gate --
`[gate: faction:REDS]` validates clean, is HIDDEN by default, and OPENS for the faction
raised on it. No format change, no second file.

GATE (ratchet, nothing is forked today): bans a per-faction FORK of a canon quest
(S01_REDS.bq beside S01_THE_METER_READER.bq) while leaving quests legitimately ABOUT a
faction alone -- the corpus is full of those and they are the point. Self-tests by
feeding itself both shapes. 21 canon quests, 21 distinct ids, 0 forked.

STILL [PENDING PAOLO] from the same law: are all 14 available at the door (CUSTOM has no
ground by definition, NETWORK is the Amalgamation's manufactured protection); what
"faction neighborhood housing" is architecturally; whether other factions know from
minute one what you were raised as.

STILL TRUE AND STILL HIS: 9 of 14 factions sit on a district you could live in. Anarchists
and Blues are on a solar farm, Cartel and Homeless in retail, Church on a farm -- and
canon puts the Homeless HQ in the sewer under the King Hobo. Base placement is worldgen
and where a faction lives is MAP CONTENT. Measured on the ENTRANCE page, left alone.




FACTIONS (factions-ovkjpf): 8/12 (c) LATEST — *** HE CLOSED THE ENTRANCE'S SCOPE THE
SAME DAY HE OPENED IT: ONE MAIN QUEST, FOURTEEN DRESSINGS. NOT FOURTEEN GAMES. ***
laws/BOHEMIA_ADDENDUM_THE_CUSTOMIZABLE_ENTRANCE_8_12_26.md (updated)
Gate: ENTRANCE SCOPE, 10/10, BLOCKING. Tab: LIFE -> THE ENTRANCE (opens on it).

HIS WORDS, asked whether the faction choice changes the main quest's CONTENT or only
where it opens: "It only changes the location and possible vibe and colors possible
dialogue but yeah it's not day and night. It's just with different clothes on."

    MOVES: location, vibe, colours, some dialogue
    DOES NOT MOVE: the story, the family, the beats (fight / sibling / dinner / burial),
                   the arc, the ending, the structure

THE SECOND HALF IS THE ONE A BUILD QUIETLY LOSES, which is why it is gated. A
customizable entrance is exactly the feature that becomes fourteen games: the Cartel
opening should REALLY be different so it gets its own quest file, then the Church one
does, and now there are fourteen main quests to write, test and keep in sync forever --
for a difference he says outright is NOT day and night.
    FOURTEEN DRESSINGS IS A WEEK. FOURTEEN QUESTS IS THE REST OF THE YEAR.

THE DRESSING PATH ALREADY EXISTS AND IS PROVEN, so nobody has an excuse to fork: the .bq
format gates an option on the player's faction TODAY. Measured by the gate --
`[gate: faction:REDS]` validates clean, is HIDDEN by default, and OPENS for the faction
raised on it. No format change, no second file.

GATE (ratchet, nothing is forked today): bans a per-faction FORK of a canon quest
(S01_REDS.bq beside S01_THE_METER_READER.bq) while leaving quests legitimately ABOUT a
faction alone -- the corpus is full of those and they are the point. Self-tests by
feeding itself both shapes. 21 canon quests, 21 distinct ids, 0 forked.

STILL [PENDING PAOLO] from the same law: are all 14 available at the door (CUSTOM has no
ground by definition, NETWORK is the Amalgamation's manufactured protection); what
"faction neighborhood housing" is architecturally; whether other factions know from
minute one what you were raised as.

STILL TRUE AND STILL HIS: 9 of 14 factions sit on a district you could live in. Anarchists
and Blues are on a solar farm, Cartel and Homeless in retail, Church on a farm -- and
canon puts the Homeless HQ in the sewer under the King Hobo. Base placement is worldgen
and where a faction lives is MAP CONTENT. Measured on the ENTRANCE page, left alone.



FACTIONS (factions-ovkjpf): 8/12 (f) LATEST — *** THE ENTRANCE NOW SHOWS WHAT EACH
OPENING IS ACTUALLY LIKE — AND I NEARLY SHIPPED SEED NOISE AS CANON. ***
Tab: LIFE -> THE ENTRANCE (opens on it). Nothing to judge.

FIRST, TWO CORRECTIONS OF MY OWN MEASUREMENTS, both caught before shipping:

1. "THE NEAREST RESIDENT IS 54 TILES AWAY" (8/12 e) WAS MY BUG, not the world's. I was
   counting SLEEPING agents at their houses. Corrected: the run is at 07:30, FOUR of
   eleven are outdoors, and ONE is within earshot of the quest tile. SIM.outAgents is a
   FUNCTION and I read its arity as a count. The world is alive; the witness numbers
   were honest all along.

2. "MONOCULTURE vs CONTESTED IS A FACT ABOUT THE FACTION" — WRONG, and it looked
   beautiful, which is why it needed checking. Standing a fixed sample of 60 people on
   each faction's ground and asking the real allegiance function who they run with gives
   two clean kinds of opening: everyone around you is yours, or you grow up among other
   people's factions. My first read said this matched his canon notes (Colorful is
   "community-based not territorial" and came out contested). ACROSS FIVE WORLD SEEDS
   ONLY 3 OF 14 KEEP THE SAME CHARACTER. It is a fact about THE MAP, not the faction.
   The page now says MONOCULTURE HERE / CONTESTED HERE and states plainly that a new
   world re-rolls it — which is the genuinely interesting version, and a real reason to
   replay.

BUILT: each of the 14 entrance cards now carries what the opening is LIKE — how many of
the people around you would run with you versus with somebody else, measured the same
way for every faction so the comparison is fair. Labelled as a probe of the world at that
spot, not a census.

STILL TRUE AND STILL HIS: 9 of 14 sit on a district you could live in (Anarchists and
Blues on a solar farm, Cartel and Homeless in retail, Church on a farm; canon puts the
Homeless HQ in the sewer under the King Hobo). Base placement is worldgen and where a
faction lives is MAP CONTENT.

STATE OF THIS LANE: the people layer is wired end to end and visible — allegiance on the
person you talk to, the consequence on the phone card, real witness counts at the moment
a quest resolves. The integration ledger's remaining gaps (district art, day cycle,
economy, dress-by-rank, vehicles) all belong to other lanes.


FACTIONS (factions-ovkjpf): 8/12 (e) LATEST — *** THE WITNESS ORGAN IS FINALLY RUNNING
IN THE GAME. Four days of it (STANDING 35 claims, DEED BRIDGE 27) had never been CALLED
by anything. *** Nothing to judge.

WHAT WAS WRONG: the consequence card said "WORD CARRIED 24 TILES" -- a DERIVED radius,
the distance a thing of that loudness travels. True, and not the same claim as "these
people saw you". The run had no minds at all and called witness() zero times.

NOW: at the moment a quest resolves, the deed is published at the player's tile -- not
when the phone opens, because who saw a thing depends on where everyone was WHEN IT
HAPPENED. The block's own people ARE the minds (no new population; they just get the one
array bohemia_standing asks for), and DEED_WEIGHT is filled from HIS corpus at first use,
so every weight traces to a @DO faction line he wrote.

TWO NUMBERS, AND THE CARD MUST NOT CONFUSE THEM -- the first cut did:
  publish() is FACTION-SCOPED on purpose (a Red genuinely does not care who buys seed),
  so it counts who FORMED A VIEW, and on this block that is honestly zero.
  "N people saw it" is a PHYSICAL claim: who was close enough. Counted separately, as
  everyone within the reach the deed's own clout tag earned.
The first version printed the opinion count under the words PEOPLE SAW IT and read as
broken while the mechanism was right.

MEASURED AT THE TILE WHERE THE QUEST REALLY RESOLVES (the lineman's, not spawn):
    quiet 0 / notable 0 / risky 0 / reckless 1
The nearest resident is 54 TILES AWAY -- everybody is home and indoors at that hour. That
is NOT a bug: the run already narrates the quiet fork as "Done, and nobody heard it", so
the system agrees with the story. But a printed 0 reads like a broken counter, so the
card says NOBODY SAW IT in words.

THE GEOMETRY FINDING, same family as the faction dead zone: the demo block's people are
far from where its quest resolves, so the loudness axis barely discriminates there (it
does work -- reach 7/12/17/24 -- there is simply nobody standing in it). Two honest ways
to change that and BOTH ARE SOMEBODY ELSE'S: where the quest is placed (run lane) and
when it resolves (a quest that ends at 3am has no audience by definition). Not tuned.

GATES: RUN 126, CURRENT SLICE 6, STANDING 35, DEED BRIDGE 27. The current slice went red
first -- it embeds the loop and I had rebuilt only the run. Same trap as 8/9; rebuild
BOTH slices whenever engine or run source changes.


FACTIONS (factions-ovkjpf): 8/12 (c) LATEST — *** HE CLOSED THE ENTRANCE'S SCOPE THE
SAME DAY HE OPENED IT: ONE MAIN QUEST, FOURTEEN DRESSINGS. NOT FOURTEEN GAMES. ***
laws/BOHEMIA_ADDENDUM_THE_CUSTOMIZABLE_ENTRANCE_8_12_26.md (updated)
Gate: ENTRANCE SCOPE, 10/10, BLOCKING. Tab: LIFE -> THE ENTRANCE (opens on it).

HIS WORDS, asked whether the faction choice changes the main quest's CONTENT or only
where it opens: "It only changes the location and possible vibe and colors possible
dialogue but yeah it's not day and night. It's just with different clothes on."

    MOVES: location, vibe, colours, some dialogue
    DOES NOT MOVE: the story, the family, the beats (fight / sibling / dinner / burial),
                   the arc, the ending, the structure

THE SECOND HALF IS THE ONE A BUILD QUIETLY LOSES, which is why it is gated. A
customizable entrance is exactly the feature that becomes fourteen games: the Cartel
opening should REALLY be different so it gets its own quest file, then the Church one
does, and now there are fourteen main quests to write, test and keep in sync forever --
for a difference he says outright is NOT day and night.
    FOURTEEN DRESSINGS IS A WEEK. FOURTEEN QUESTS IS THE REST OF THE YEAR.

THE DRESSING PATH ALREADY EXISTS AND IS PROVEN, so nobody has an excuse to fork: the .bq
format gates an option on the player's faction TODAY. Measured by the gate --
`[gate: faction:REDS]` validates clean, is HIDDEN by default, and OPENS for the faction
raised on it. No format change, no second file.

GATE (ratchet, nothing is forked today): bans a per-faction FORK of a canon quest
(S01_REDS.bq beside S01_THE_METER_READER.bq) while leaving quests legitimately ABOUT a
faction alone -- the corpus is full of those and they are the point. Self-tests by
feeding itself both shapes. 21 canon quests, 21 distinct ids, 0 forked.

STILL [PENDING PAOLO] from the same law: are all 14 available at the door (CUSTOM has no
ground by definition, NETWORK is the Amalgamation's manufactured protection); what
"faction neighborhood housing" is architecturally; whether other factions know from
minute one what you were raised as.

STILL TRUE AND STILL HIS: 9 of 14 factions sit on a district you could live in. Anarchists
and Blues are on a solar farm, Cartel and Homeless in retail, Church on a farm -- and
canon puts the Homeless HQ in the sewer under the King Hobo. Base placement is worldgen
and where a faction lives is MAP CONTENT. Measured on the ENTRANCE page, left alone.




FACTIONS (factions-ovkjpf): 8/12 (c) LATEST — *** HE CLOSED THE ENTRANCE'S SCOPE THE
SAME DAY HE OPENED IT: ONE MAIN QUEST, FOURTEEN DRESSINGS. NOT FOURTEEN GAMES. ***
laws/BOHEMIA_ADDENDUM_THE_CUSTOMIZABLE_ENTRANCE_8_12_26.md (updated)
Gate: ENTRANCE SCOPE, 10/10, BLOCKING. Tab: LIFE -> THE ENTRANCE (opens on it).

HIS WORDS, asked whether the faction choice changes the main quest's CONTENT or only
where it opens: "It only changes the location and possible vibe and colors possible
dialogue but yeah it's not day and night. It's just with different clothes on."

    MOVES: location, vibe, colours, some dialogue
    DOES NOT MOVE: the story, the family, the beats (fight / sibling / dinner / burial),
                   the arc, the ending, the structure

THE SECOND HALF IS THE ONE A BUILD QUIETLY LOSES, which is why it is gated. A
customizable entrance is exactly the feature that becomes fourteen games: the Cartel
opening should REALLY be different so it gets its own quest file, then the Church one
does, and now there are fourteen main quests to write, test and keep in sync forever --
for a difference he says outright is NOT day and night.
    FOURTEEN DRESSINGS IS A WEEK. FOURTEEN QUESTS IS THE REST OF THE YEAR.

THE DRESSING PATH ALREADY EXISTS AND IS PROVEN, so nobody has an excuse to fork: the .bq
format gates an option on the player's faction TODAY. Measured by the gate --
`[gate: faction:REDS]` validates clean, is HIDDEN by default, and OPENS for the faction
raised on it. No format change, no second file.

GATE (ratchet, nothing is forked today): bans a per-faction FORK of a canon quest
(S01_REDS.bq beside S01_THE_METER_READER.bq) while leaving quests legitimately ABOUT a
faction alone -- the corpus is full of those and they are the point. Self-tests by
feeding itself both shapes. 21 canon quests, 21 distinct ids, 0 forked.

STILL [PENDING PAOLO] from the same law: are all 14 available at the door (CUSTOM has no
ground by definition, NETWORK is the Amalgamation's manufactured protection); what
"faction neighborhood housing" is architecturally; whether other factions know from
minute one what you were raised as.

STILL TRUE AND STILL HIS: 9 of 14 factions sit on a district you could live in. Anarchists
and Blues are on a solar farm, Cartel and Homeless in retail, Church on a farm -- and
canon puts the Homeless HQ in the sewer under the King Hobo. Base placement is worldgen
and where a faction lives is MAP CONTENT. Measured on the ENTRANCE page, left alone.



FACTIONS (factions-ovkjpf): 8/12 (f) LATEST — *** THE ENTRANCE NOW SHOWS WHAT EACH
OPENING IS ACTUALLY LIKE — AND I NEARLY SHIPPED SEED NOISE AS CANON. ***
Tab: LIFE -> THE ENTRANCE (opens on it). Nothing to judge.

FIRST, TWO CORRECTIONS OF MY OWN MEASUREMENTS, both caught before shipping:

1. "THE NEAREST RESIDENT IS 54 TILES AWAY" (8/12 e) WAS MY BUG, not the world's. I was
   counting SLEEPING agents at their houses. Corrected: the run is at 07:30, FOUR of
   eleven are outdoors, and ONE is within earshot of the quest tile. SIM.outAgents is a
   FUNCTION and I read its arity as a count. The world is alive; the witness numbers
   were honest all along.

2. "MONOCULTURE vs CONTESTED IS A FACT ABOUT THE FACTION" — WRONG, and it looked
   beautiful, which is why it needed checking. Standing a fixed sample of 60 people on
   each faction's ground and asking the real allegiance function who they run with gives
   two clean kinds of opening: everyone around you is yours, or you grow up among other
   people's factions. My first read said this matched his canon notes (Colorful is
   "community-based not territorial" and came out contested). ACROSS FIVE WORLD SEEDS
   ONLY 3 OF 14 KEEP THE SAME CHARACTER. It is a fact about THE MAP, not the faction.
   The page now says MONOCULTURE HERE / CONTESTED HERE and states plainly that a new
   world re-rolls it — which is the genuinely interesting version, and a real reason to
   replay.

BUILT: each of the 14 entrance cards now carries what the opening is LIKE — how many of
the people around you would run with you versus with somebody else, measured the same
way for every faction so the comparison is fair. Labelled as a probe of the world at that
spot, not a census.

STILL TRUE AND STILL HIS: 9 of 14 sit on a district you could live in (Anarchists and
Blues on a solar farm, Cartel and Homeless in retail, Church on a farm; canon puts the
Homeless HQ in the sewer under the King Hobo). Base placement is worldgen and where a
faction lives is MAP CONTENT.

STATE OF THIS LANE: the people layer is wired end to end and visible — allegiance on the
person you talk to, the consequence on the phone card, real witness counts at the moment
a quest resolves. The integration ledger's remaining gaps (district art, day cycle,
economy, dress-by-rank, vehicles) all belong to other lanes.


FACTIONS (factions-ovkjpf): 8/12 (e) LATEST — *** THE WITNESS ORGAN IS FINALLY RUNNING
IN THE GAME. Four days of it (STANDING 35 claims, DEED BRIDGE 27) had never been CALLED
by anything. *** Nothing to judge.

WHAT WAS WRONG: the consequence card said "WORD CARRIED 24 TILES" -- a DERIVED radius,
the distance a thing of that loudness travels. True, and not the same claim as "these
people saw you". The run had no minds at all and called witness() zero times.

NOW: at the moment a quest resolves, the deed is published at the player's tile -- not
when the phone opens, because who saw a thing depends on where everyone was WHEN IT
HAPPENED. The block's own people ARE the minds (no new population; they just get the one
array bohemia_standing asks for), and DEED_WEIGHT is filled from HIS corpus at first use,
so every weight traces to a @DO faction line he wrote.

TWO NUMBERS, AND THE CARD MUST NOT CONFUSE THEM -- the first cut did:
  publish() is FACTION-SCOPED on purpose (a Red genuinely does not care who buys seed),
  so it counts who FORMED A VIEW, and on this block that is honestly zero.
  "N people saw it" is a PHYSICAL claim: who was close enough. Counted separately, as
  everyone within the reach the deed's own clout tag earned.
The first version printed the opinion count under the words PEOPLE SAW IT and read as
broken while the mechanism was right.

MEASURED AT THE TILE WHERE THE QUEST REALLY RESOLVES (the lineman's, not spawn):
    quiet 0 / notable 0 / risky 0 / reckless 1
The nearest resident is 54 TILES AWAY -- everybody is home and indoors at that hour. That
is NOT a bug: the run already narrates the quiet fork as "Done, and nobody heard it", so
the system agrees with the story. But a printed 0 reads like a broken counter, so the
card says NOBODY SAW IT in words.

THE GEOMETRY FINDING, same family as the faction dead zone: the demo block's people are
far from where its quest resolves, so the loudness axis barely discriminates there (it
does work -- reach 7/12/17/24 -- there is simply nobody standing in it). Two honest ways
to change that and BOTH ARE SOMEBODY ELSE'S: where the quest is placed (run lane) and
when it resolves (a quest that ends at 3am has no audience by definition). Not tuned.

GATES: RUN 126, CURRENT SLICE 6, STANDING 35, DEED BRIDGE 27. The current slice went red
first -- it embeds the loop and I had rebuilt only the run. Same trap as 8/9; rebuild
BOTH slices whenever engine or run source changes.


FACTIONS (factions-ovkjpf): 8/15 (a) LATEST — *** I COUNTED THE REST OF THE FLEET, AND
22 OF 30 "INTEGRATED" SYSTEMS STILL ONLY PROVE THEMSELVES ON THE APP HE NEVER SEES. ***
Nothing to judge. THIS ONE IS FOR EVERY LANE, NOT JUST MINE.

Yesterday I found four days of my own player-facing work sitting on
slices/BOHEMIA_RUN_CURRENT.html - preloaded on every visit, NEVER DISPLAYED - and migrated it to
the city. Then I read the ledger and counted, and it is not just me.

*** THE SCOREBOARD HAS 35 ROWS, 30 CLAIMING INTEGRATED, AND integration_gate READ THE DARK FILE
FOR EVERY SINGLE ONE. *** The ledger's own header has warned about exactly this since 8/4 ("the
greens below are not evidence about the surface he plays, and no reader can tell which ones
are"). A warning nobody can act on is not a warning, it is a disclaimer. So I turned it into a
LIST.

tools/bohemia_surface_audit.py, and the count as of today:
   6  ON THE WALKED SURFACE
  22  ONLY ON THE ONE HE NEVER SEES
   0  ON NEITHER
   7  CANNOT TELL FROM ITS OWN PROBE

*** THE CLAIM IS DELIBERATELY NARROW AND THE FILE, THE PAGE AND THE GATE ALL SAY SO. *** The city
is a separate renderer that shares almost no drawing code with the run, and the ledger header
says most systems ARE there under another spelling. NOT FOUND MEANS GO AND LOOK, addressed to the
lane that owns the row, by the lane that just made this exact mistake with its own three. It
never means broken, and I do not get to declare another lane's work dead from a string search.
NO LANE'S CODE IS TOUCHED BY ANY OF THIS.

The probes are READ OUT OF THE GATE, never retyped, so the audit cannot test for evidence a probe
does not actually use. A probe that never reads the city at all is counted CANNOT TELL rather
than guessed at.

*** AND I FOUND ONE MORE OF MY OWN: I MIGRATED THE CODE AND NEVER REPOINTED MY PROBES. *** My
three rows were still proving the dark file the day after I "fixed" them. They now check the
CITY, which is the shape of the fix the other 22 need - about four lines each.

GATE: gates/walked_surface_gate.js 23 -> 29 claims, 0 failed. The audit is regenerated and diffed
so the number on the page can never be yesterday's wearing today's date.

WHERE HE LOOKS: *** LIFE TAB -> WHICH SURFACE IS IT ON? *** (orange card, top). Every row, its
verdict, and whether the row names its surface. ONLY THE FLAGGED filters to the 22.

WHAT COMES AFTER, AND IT IS FOR THE OTHER LANES: each owning lane repoints its own probe at the
city and, where the work really is not there, migrates it the way tools/bohemia_city_factions_
patch.py does. That is 22 small jobs, not one big one, and the demo needs them.

STILL [PENDING PAOLO], unchanged: REACH_CELLS 12 and AFFILIATED_RATE 0.30; whether all 14
factions are available at the door; the Mob dossier's open question about the Cartel.

--------------------------------------------------------------------------------

FACTIONS (factions-ovkjpf): 8/14 (b) LATEST — *** I SPENT FOUR TURNS BUILDING ON A
SURFACE HE NEVER SEES. IT IS ON THE REAL ONE NOW. *** Nothing to judge.

*** THIS IS A POST-MORTEM ON MY OWN WEEK, AND IT IS THE HEADLINE. *** The coordinator ruled on
8/14 that THE CITY WORLD IS THE WALKED SURFACE and slices/BOHEMIA_RUN_CURRENT.html IS LEGACY -
preloaded on every visit and NEVER DISPLAYED. I verified it myself rather than taking the
document's word: open the real alpha, tap RUN, and p-run computes to display:none while p-city is
block and #runFrame.offsetParent is null.

BY THEN THIS LANE HAD PUT FOUR TURNS OF PLAYER-FACING WORK ON THE RUN'S PERSON CARD:
  8/12  the sixteen introductions
  8/12  who knows who, and the vouch that names your introducer
  8/12  what a faction wants from you, what it holds, how far in you are
  8/14  the peripheral act and its preconditions
All real. All gated. NONE OF IT ON THE SURFACE HE PLAYS. The judge pages in the LIFE tab saved
half of it - he can look at all four - but the in-game half has been dark since it shipped. That
is the authored-but-unread disease, committed by the lane that wrote the gate against it.

*** AND THE DEEPER FAILURE WAS THE RECORD, NOT THE CODE. *** integration_gate let three rows say
INTEGRATED while probing a file nobody sees, under a ledger header that had WARNED about exactly
this since 8/4 ("the RUN tab does not display that file"). I read that header and wrote three
rows under it anyway. A WARNING IS NOT A GATE.

WHAT SHIPPED - THE MIGRATION:
- tools/bohemia_city_factions_patch.py moves all three organs onto the city, injected with the
  ==== engine/x.js ==== banner so they JOIN THE ENGINE SYNC SWEEP (the city's resync went 47 -> 50
  embedded modules and reports them fresh).
- *** THE PORT WAS NOT A COPY-PASTE, AND THAT IS THE INTERESTING PART. *** The city's people are
  SHIMS: ctAgent() fabricates H<n>-1 (everybody alone in their own house) and job:{kind:'scav'}
  (everybody a lone scavenger), and there was NO FACTION anywhere in the file. Ported naively all
  three organs sit inert. The one fact that unlocks them is WHO SOMEBODY RUNS WITH.
- ONE ANSWER, NOT TWO: the faction bases are the LOOP'S OWN placement rule, baked at patch time
  and gated BYTE-IDENTICAL against it, keyed to the seed text. Deriving a second set from the
  city's own overmap would put the Cartel in two places depending which surface you stand on -
  the two-systems-disagreeing bug this lane has now fixed four times.
- The card on the walked surface now reads: RUNS WITH CHURCH / THEY ASKED YOU: YOUR NAME / THEY
  WANT: YOU, THERE / THEY HOLD: stored food... / CAREFUL: THEY HELP YOU BEFORE YOU AGREE TO
  ANYTHING / YOU ARE: A STRANGER / NOT ON THEIR GROUND. GO TO THEM. / THEIR GROUND: 34 CELLS
  NORTH. Verbatim canon, preconditions honoured, buttons at the bottom.
- THE LEDGER ROWS NOW NAME THEIR SURFACE and say plainly they were true about a dark file for
  two days.

GATE: gates/walked_surface_gate.js, 23 claims, 0 failed. It checks the thing the integration
probes structurally cannot: not IS IT WIRED but IS IT WIRED WHERE HE LOOKS. Which surface he sees
is MEASURED in a real browser, so if the build ever flips back the lane is told instead of guessing.

*** STILL THIN ON THAT SURFACE, SAID RATHER THAN PAPERED OVER: *** the city's people have no real
household and no real job site, so two of the tie graph's three foci are empty there and the
vouch can only fire through the faction focus. That is a WORLD-lane shape - the walked surface's
people need the same roster data the run's have - and it is not something to fake from here.

WHAT COMES AFTER: every other lane that shipped into the run slice has the same problem I did.
The integration ledger has 30 INTEGRATED rows and its probes ALL read the run file. Somebody
should sweep the other 27 the way I swept my 3, and walked_surface_gate is the shape to do it in.

STILL [PENDING PAOLO], unchanged: REACH_CELLS 12 and AFFILIATED_RATE 0.30; whether all 14
factions are available at the door; the Mob dossier's open question about the Cartel.

--------------------------------------------------------------------------------

FACTIONS (factions-ovkjpf): 8/14 (a) LATEST — *** THE BUTTON WORKED FROM ANYWHERE WITH
NOTHING BEHIND IT. NOW YOU HAVE TO GO TO THEM, AND YOU HAVE TO HAVE SOMETHING TO SAY. ***
Nothing to judge.

Yesterday I shipped the act: a button on somebody's card that does the thing their outfit
actually wants. It had ONE constraint - once a day. Which meant "TELL THEM WHAT YOU HAVE SEEN"
worked whether or not you had seen anything, anywhere, ever, and "SHOW UP FOR THEM" worked from
the other side of the valley. *** A BUTTON YOU CAN PRESS FROM ANYWHERE WITH NOTHING BEHIND IT IS
THE SAME LIE AS A BUTTON THAT DOES NOTHING. *** I flagged it myself in yesterday's handoff and
this is it fixed.

TWO OF THE FIVE KINDS NOW HAVE A CONDITION THE WORLD CAN GENUINELY CHECK:
- PRESENCE (Church, Blues, Anarchists): you have to be ON THEIR GROUND. Their base is a real
  district the world placed, and bohemia_agents already declares how far a base's pull carries.
  *** NO NEW DIAL WAS MINTED *** - that number is [PENDING Paolo] on that module and if he
  retunes it this follows. Measured on the demo block: the Church is 4 cells away and the
  Remnants are 85, so it is a real constraint and not a formality.
- INFORMATION (Remnants, Homeless, Caravans): you have to have SOMEWHERE YOU HAVE STOOD that
  they have not heard about. Telling them SPENDS it. You have to go and look, and come back.

The other three need nothing but the hour, and inventing a gate for them would be inventing
content: giving the Trades an hour of your labour requires an hour of your labour and that is
the whole of it.

*** WHEN YOU ARE NOT ON THEIR GROUND THE CARD SAYS WHICH WAY TO WALK AND HOW FAR. *** "Go to
them" with no direction is the hunting he banned on 8/11. It reads THEIR GROUND / 85 CELLS SOUTH,
off the real base coordinates the world placed.

AN UNANSWERED CONDITION NEVER BLOCKS. Only an explicit false does. Refusing because the world has
no base placed for an outfit is refusing for a gap in the world rather than a fact about the
player, and that is a lie with extra steps.

NEW WORLD STATE, both tiny and both riding meta so no save migration was needed: meta.seen (the
cells you have actually stood in) and meta.told (how much you had seen the last time you reported
to each outfit).

GATE: gates/belonging_gate.js 50 -> 58 claims, 0 failed. The preconditions are driven on the REAL
surface: find an outfit whose ground is genuinely far, confirm there is no button and the card
points the way; tell the Remnants what you saw and confirm it is spent until you go somewhere new.

THE STACK IS NOW FIVE DEEP AND NEEDS NO QUEST: walk up to somebody -> learn their name the way
their outfit does it -> find out who they run with -> read what that outfit wants -> GO TO THEIR
GROUND OR GO AND LOOK AT SOMETHING -> do it -> watch the rung move.

WHERE HE LOOKS: *** LIFE TAB -> WHAT THEY WANT FROM YOU. *** Every YOU CAN row now names its
condition.

WHAT COMES AFTER: the acts are still all worth exactly one step. A faction should care MORE about
the thing it is desperate for than about a routine favour, and the dossiers already say which is
which (the Homeless value warning "more than food"). That is the next honest brick, and it is
reading his canon again rather than inventing a weight table.

STILL [PENDING PAOLO], unchanged: REACH_CELLS 12 and AFFILIATED_RATE 0.30; whether all 14
factions are available at the door; what "faction neighbourhood housing" is architecturally; the
Mob dossier's open question about the Cartel and the guarantor seat.

--------------------------------------------------------------------------------

FACTIONS (factions-ovkjpf): 8/13 (a) LATEST — *** THE BARGAIN WAS LEGIBLE AND YOU COULD
NOT ACT ON IT. NOW YOU CAN. *** Nothing to judge.

This morning the card started telling you what an outfit wants. And there was NO WAY TO GIVE IT
TO THEM - the only thing in the entire game that could move the belonging ladder was an authored
quest with @DO faction X +N. A Remnant tells you they want honest word about the road and you
stand there with no button. That is the inverse of my own rule from the day before: not a button
that does nothing, A BUTTON THAT DOES NOT EXIST.

WHAT SHIPPED - ONE ACT PER KIND OF WANT, each named for what that outfit actually wants:
  Tell them what you have seen   (Remnants, Homeless, Caravans)
  Show up for them               (Church, Blues, Anarchists)
  Give them an hour of it        (Trades, Volunteers)
  Take what they are offering    (Cartel, Reds)
  Let them write you down        (Mob, Karens, Network)

*** TWO KINDS CORRECTLY HAVE NO BUTTON *** and both are his canon, not a gap: the Colorful and
the Social Forces are ASSESSING you and it never stops running - you cannot press a button to be
safe to be around - and the Amalgamation makes no offer at all. The card says WHY there is
nothing to press instead of just being blank.

IT COSTS AN HOUR AND THE HOUR IS NOT A NEW PRICE. TIME IS SPENT BY ACTIONS (7/26) makes the
action-cost table canon and forbids a lane writing one, so the act REUSES the HANGOUT moment he
already priced at 1. Doing somebody a favour IS spending an hour with them. Gated, so nobody
quietly mints a price later.

*** ONCE A DAY, AND I HAD THE RESEARCH BACKWARDS AT FIRST. *** I went in assuming instant
repayment CANCELS a bond. Gouldner 1960 and Malinowski say the opposite: obligations persist, a
gift is not returned on the spot, and the INTERVAL between giving and getting back is where the
relationship actually lives. So the daily limit is not an anti-grind dial bolted on - the wait IS
the mechanic. You cannot buy your way inside in one afternoon. I corrected my premise instead of
shipping the version I liked.

ONE WRITER: the world bridge and the card now move the same number, so it lives in
BohemiaBelonging.record() and both go through it - including folding the three spellings of a
faction, which have now bitten this codebase FOUR times. The loop resolves the module lazily and
falls back to a plain increment on a bare boot, so the world bridge is never blocked on a surface
module.

GATE: gates/belonging_gate.js, 50 claims, 0 failed. The whole loop is driven through the REAL DOM
of the REAL built run: read the bargain, press the act, watch the rung go from A STRANGER to
SOMEBODY WHO SHOWED UP, find the button gone and the card saying COME BACK TOMORROW. Two of my
own probes were wrong first (one inherited a planted count from an earlier claim, one sliced the
text it then searched) and I fixed the probes, not the code.

THE THREE ORGANS NOW STACK END TO END, NO QUEST REQUIRED: walk up to somebody -> learn their name
the way their outfit does it -> find out who they run with -> read what that outfit wants ->
do it -> watch the rung move.

WHERE HE LOOKS: *** LIFE TAB -> WHAT THEY WANT FROM YOU. *** Every card now has a YOU CAN row.

WHAT COMES AFTER: the act is currently the same weight whoever you do it for and wherever you
are. The obvious depth is that TELLING THE REMNANTS WHAT YOU SAW should depend on having actually
seen something - the witness organ already records what happened in front of people, and nothing
reads it back the other way. That is the next honest brick.

STILL [PENDING PAOLO], unchanged: REACH_CELLS 12 and AFFILIATED_RATE 0.30; whether all 14
factions are available at the door; what "faction neighbourhood housing" is architecturally; and
the Mob dossier's own open question about the Cartel and the guarantor seat.

--------------------------------------------------------------------------------

FACTIONS (factions-ovkjpf): 8/12 (j) LATEST — *** I BUILT A DOOR AND A LOCK AND THEN
LEFT THE ROOM EMPTY. THE ROOM HAS SOMETHING IN IT NOW. *** Nothing to judge.

Two turns ago the game learned SIXTEEN WAYS to give you somebody's name. One turn ago it learned
that the Mob will not be asked, somebody inside has to vouch. And then you walked through that
door and THERE WAS NOTHING IN THERE - no reason to want in, no idea what they wanted, no idea
what it was worth.

*** BOTH HALVES OF THAT ANSWER HAVE BEEN IN YOUR DOSSIERS SINCE 8/2, THUMBED UP, READ BY
NOTHING. *** WHAT THEY WANT FROM YOU, and WHAT THEY TRADE / CONTROL. Third turn running that the
thing I needed was already written by him and unread. And they are not sixteen ways of saying
"help us" - they are sixteen ECONOMIES:

  REMNANTS    "Not loyalty. INFORMATION ABOUT THE ROAD... they will pay in ammunition"
  MOB         "You ACCOUNTED FOR. Not loyal, not employed - listed"
  CARTEL      "They want you to OWE them... the first thing they give you is free"
  CHURCH      "They will help you before you agree to any of that"
  VOLUNTEERS  "will refuse a gift that would make them worth robbing"
  ANARCHISTS  "For you to show up. Not sign anything, not join anything"
  AMALGAMATION "the only thing in the valley with no offer"

*** THE CARTEL AND THE CHURCH BOTH MOVE FIRST. *** Same mechanic, opposite intent, both in his
own words, and the game never tells you which one you are in. That is the best thing in this
whole turn and I did not write a word of it.

THE RESEARCH: Lave & Wenger 1991, LEGITIMATE PERIPHERAL PARTICIPATION. Nobody JOINS a real
community - newcomers get let in at the EDGE to do something small and drift inward as they turn
out to be useful, until the newcomer is the old-timer. That is exactly what all sixteen of his
sentences describe, and the Anarchists say it outright. So belonging is a SLOPE, not a switch.

WHAT SHIPPED:
- engine/bohemia_belonging.js — generated from the dossiers, 32 anchors (two per faction), the
  generator refuses to run if either sentence moves.
- THE PERSON CARD NOW CARRIES THE WHOLE BARGAIN: what they want in three words, what they hold,
  what they pay in, what they will not take, whether they move first, and how far in you are.
- *** BELONGING IS NOT STANDING, AND THE GATE PROVES IT. *** Standing is what they THINK of you;
  this is HOW MANY TIMES YOU DID THE THING. You can be well liked by an outfit you never once
  turned up for. Driven through a real quest: +6 then +1 is TWO deeds, not seven, and hurting
  them is not a step toward belonging (that axis already exists).
- The count rides save.meta.gave, so the ladder survives a reload. No save migration needed.

GATE: gates/belonging_gate.js, 37 claims, 0 failed.

*** THE GATE CAUGHT A LIVE BUG I HAD ALREADY HAND-CHECKED AND CALLED FINE. *** The world bridge
writes the counter under the FactionWorld's id ('Remnants'); the card asked with the quest's
@ROLE token ('REMNANTS'). Straight lookup, 0 forever, ladder never moves. My own browser check
passed because I happened to type the spelling my code expected. THE THREE SPELLINGS OF A FACTION
HAVE NOW BITTEN THREE TIMES IN THIS CODEBASE and it is normalised in all three organs.

NOTHING OF HIS IS DECIDED. The Mob dossier's own open question (whether the Mob IS the Cartel,
whether they hold the guarantor seat) is carried through as PENDING, printed on the page as STILL
YOURS TO DECIDE, and gated so nobody quietly answers it.

INTEGRATION LEDGER: 29/34 -> 30/35.

WHERE HE LOOKS: *** LIFE TAB -> WHAT THEY WANT FROM YOU. *** All sixteen, both of his paragraphs
on each card, and a button at the top that walks you from stranger to inside so every card
changes under him.

MINE AND HE CAN HATE THEM: the rungs are 1 / 3 / 6 / 10 acts from stranger to inside. My call
under EVERYTHING IS A THUMB; deliberately small, because a peripheral task is supposed to be
doable the first week.

WHAT COMES AFTER: the three organs now stack (learn a name -> get vouched in -> know what they
want) and the obvious next brick is that DOING the thing should be possible outside a quest -
today the only way to move the ladder is an authored @DO faction line. A Remnant asks you what
the road looked like; there should be a way to answer.

STILL [PENDING PAOLO], unchanged: REACH_CELLS 12 and AFFILIATED_RATE 0.30; whether all 14
factions are available at the door; what "faction neighbourhood housing" is architecturally.

--------------------------------------------------------------------------------

FACTIONS (factions-ovkjpf): 8/12 (i) LATEST — *** EVERY PERSON IN THE VALLEY WAS AN
ISLAND. THEY KNOW EACH OTHER NOW, AND THE MOB IS A CLOSED DOOR YOU CANNOT TALK THROUGH. ***
Nothing to judge.

WHAT CAME AFTER, and this lane named it itself at the bottom of yesterday's law. The sixteen
introductions shipped with three earning conditions dead, and all three died of ONE thing: there
was no such thing as a third party anywhere in the game. Four of his dossiers ask for one:

  MOB       "a third person supplies it, and that person is vouching"
  REMNANTS  "it usually arrives from somebody ELSE - you hear another soldier use it"
  COLORFUL  "you are introduced onward to three people"
  CARAVANS  "a caravanner nobody vouches for"

*** THE RESEARCH IS WHAT MADE IT BUILDABLE TODAY. *** Feld 1981, THE FOCUSED ORGANIZATION OF
SOCIAL TIES: friendships are not random and are not mostly about liking - they form around FOCI,
shared settings people are jointly organised around, and similarity is mostly an OUTPUT of that
rather than the cause. AND THIS ENGINE ALREADY STAMPED EXACTLY THREE FOCI ON EVERY AGENT AND HAD
NEVER USED ONE OF THEM SOCIALLY: the roof over their head, the job site the generator scanned off
the real overmap, and the outfit they run with. So not one die is rolled here that the world had
not already rolled. Same disease as yesterday, one layer down: the data was there, nothing read it.

DUNBAR IS THE CEILING AND IT IS MEASURED, NOT ASSERTED. Support clique 5, sympathy group 15,
affinity group 50, active network 150. Below its layer a shared setting really does acquaint
everybody; above it the graph THINS to an expected degree exactly ON the layer. Counted: 400
people in one outfit come out holding 49.1 acquaintances against a layer of 50. Without that,
300 survivors would all know all 300 and the whole thing would be worthless.

*** A VOUCH IS A GUARANTEE, NOT A FLAG. *** In the Russian thieves-in-law the sponsor and
'crowners' are GUARANTORS of the candidate's reputation; the yakuza run on an introduction by an
existing member. A stranger's word is worth nothing. So the person who gets you into the Mob has
to be somebody whose NAME YOU ALREADY EARNED and who is INSIDE THE OUTFIT. That is what makes the
Mob genuinely closed instead of just slower.

WHAT SHIPPED:
- engine/bohemia_ties.js — the acquaintance graph. Reads three facts, invents nothing, has no
  roster and no name pool and no dialogue.
- vouch, overheard and onward all ANSWER NOW. Seven of the eight earning conditions are live;
  only `work` (hire them twice) is left and it waits on the jobs loop, which is not this lane.
- THE CARD NAMES WHO DID IT: "INTRODUCED BY <name> · WORK THE SAME PLACE". A vouch that does not
  say whose word it was is just a flag flipping.
- OVERHEARD IS DELIBERATELY WEAKER THAN A VOUCH, and that difference IS the difference between
  the Remnants' mechanic and the Mob's: you only have to have MET the other soldier, not to know
  what to call them. Overhearing costs the person speaking nothing.

GATE: gates/ties_gate.js, 40 claims, 0 failed. Symmetry checked on EVERY pair across six real
generated blocks (hashing an ORDERED pair gives a one-way friendship that spot-checks fine and is
nonsense). Part D plays the whole Mob story through the REAL DOM of the REAL built run: ask
directly and get nothing, earn a neighbour's name, watch their word open the door, read the
introducer off the card.

*** I SHIPPED A CACHE AND THEN DELETED IT, ON PURPOSE. *** The roster was memoised on (length +
cell), which is wrong in the one way that matters: allegiance ALSO changes when a quest places
its cast, so a cached roster would hold a different opinion about somebody than the allegiance
line two rows above it on the same card. Two systems disagreeing about one person is the bug this
lane keeps shipping (8/11's card, 8/12's stale inline). It got deleted, not given a cleverer key.
Three of my own gate claims were wrong first and I fixed the claims, not the code -- one measured
a malformed id instead of a person, one had the small-outfit case backwards, and one was defeated
by my own cache.

INTEGRATION LEDGER: 28/33 -> 29/34.

WHERE HE LOOKS: *** LIFE TAB -> WHO KNOWS WHO. *** A real generated block drawn as a web,
coloured by which of the three settings made each tie; the Mob's rule played out in three steps
by the real module; every person's foci and acquaintances; and the Dunbar ceiling measured on the
page at four outfit sizes. ANOTHER BLOCK reshuffles it. Nothing to tap, nothing to judge.

HONEST LIMIT, said in the module, the gate and the law rather than papered over: THE ROSTER IS
ONE BLOCK. Two Mob members twenty cells apart are not acquainted, because the run only ever
materialises one cell at a time. Roof and job ties are unaffected (both are on-block by
construction); a cross-cell faction tie needs a valley-wide roster, which is the WORLD lane's
model and not something to fake from here.

WHAT COMES AFTER: `work` is the last dead earning condition and it belongs to the jobs/economy
loop. The bigger prize the graph just unlocked is that NPCs now have somebody to talk ABOUT -
gossip currently spreads by proximity alone, and it should travel down these ties.

STILL [PENDING PAOLO], unchanged: REACH_CELLS 12 and AFFILIATED_RATE 0.30; whether all 14
factions are available at the door; what "faction neighbourhood housing" is architecturally.

--------------------------------------------------------------------------------

FACTIONS (factions-ovkjpf): 8/12 (h) LATEST — *** SIXTEEN AUTHORED INTRODUCTION
MECHANICS HAD BEEN SITTING UNREAD FOR TEN DAYS. THEY ARE IN THE GAME NOW. ***
Nothing to judge.

HE SAID: "lets do more than faction memeory please." Fair — six turns of this lane went into
what a faction REMEMBERS about you. So I went looking for the other half and found it already
written, by him, and read by nothing.

*** EVERY ONE OF THE 16 FACTION DOSSIERS HE THUMBED UP ON 8/2 HAS A SECTION CALLED "WHEN YOU
ASK THEIR NAME", AND EVERY ONE OF THEM IS A DIFFERENT MECHANIC. *** Half of them say the word
out loud: TRADES "the earned-name mechanic is earned with WORK instead of words", CARTEL "the
one faction where the name mechanic runs backwards", BLUES "gated by REPUTATION rather than by
conversation", MOB "ask directly and you get a small permanent mark against you". 1,089 lines
of approved canon, and the ONLY TWO FILES IN THE REPO THAT HAD EVER OPENED THEM were the
generator that wrote them and the gate that checks they exist. Meanwhile the game did one thing
for all sixteen: press "Ask their name", get a full name, everybody, forever.

THIS IS THE PHILOSOPHICAL CLOTHES HE CORRECTED ME ON. Meeting a stranger is the most repeated
act in the game; sixteen sets of clothes on that one act is sixteen different games of the same
scene. The Church takes your name before you can ask for theirs and never forgets it. The Trades
hand you a trade and you buy the name with two jobs. The Mob will not be asked at all. The
Cartel greets you by a name you never gave anyone. The Amalgamation does the same and NOTHING ON
SCREEN MAY EXPLAIN IT (his words, and the flag is in the data so a surface cannot forget).

WHAT SHIPPED:
- engine/bohemia_introductions.js — the organ. GENERATED from records/factions/*.md by
  tools/bohemia_introductions.py. Four axes express all sixteen with no special cases: opener
  (who moves first) / first (what the first contact leaves you holding) / earn (what turns a
  handle into a name) / cost (what getting it wrong costs, and WHICH wrong move is charged).
- *** THE ANCHOR. *** Every rule declares a verbatim fragment of its own dossier sentence and
  the generator REFUSES TO RUN if that fragment moved. Reword a dossier and the build dies until
  a human re-reads it. The mechanic can never quietly drift off his words.
- WIRED INTO THE RUN. The card's NAME row is REWRITTEN from the organ (never printed beside
  people.js's answer, which hands over the full name the second the ledger says you asked — that
  would put two answers to one question on one card, the exact bug I shipped 8/11). The one
  button's label AND outcome come from the organ. Three of the sixteen correctly have NO button,
  and in all three his canon says the name was never the transaction.
- THE LEDGER GAINED ONE BIT: `honest`. The Homeless do not want your name, they want to know
  where you sleep, so answering honestly is a real pressable move and it survives a save.
- *** THE BLUES MECHANIC COMPLETES IN PLAY TODAY. *** standing was the one unbuilt earning
  condition whose system already existed. groupHasAnOpinion() reads the REAL FactionWorld the
  quest-consequence line already reads. An OPINION means off neutral EITHER WAY — his sentence
  does not say they have to like you.

GATE: gates/introductions_gate.js, 44 claims, 0 failed. Distinctness is MEASURED (15 distinct
behavioural signatures; NETWORK=REDS are canon twins and get NAMED in the output). Part C opens
the REAL built run in a REAL browser, presses the REAL button and reads the REAL card row by row
— because this lane already shipped advance_territory "wired" by name-grep and dead in fact
(8/9) and an allegiance line invisible for a day because the check used a side door (8/11).
TWO OF MY OWN PROBES WERE WRONG FIRST AND I FIXED THE PROBES, NOT THE TARGETS: one asked a
different agent than the one it had asked the question of, and one grepped for the word
"verdict" and failed on the page's own sentence "Nothing here needs a verdict".

INTEGRATION LEDGER: 27/32 -> 28/33.

WHERE HE LOOKS: *** LIFE TAB -> THE SIXTEEN INTRODUCTIONS. *** All sixteen, his canon paragraph
at the top of each card, the mechanic underneath, and the meeting played out in three steps by
the REAL module inlined. Nothing to tap, nothing to judge, and he is never sent into the RUN app
to find it.

STILL UNBUILT, NAMED SO NOBODY CLAIMS IT: work (hire count — needs the jobs loop), vouch (a
third party introduces you — needs the companion/social layer), overheard (needs ambient
speech). The organ treats every unanswered condition as FALSE, never assumed. Until they land a
Trades member stays SCAVENGER, which is the correct answer, not a gap.

WHAT COMES AFTER: the three unbuilt conditions are the three doors. `vouch` is the most
interesting and the most missing — nothing in the game can introduce you to anybody, which is
also why the Mob currently has only the punishing half of its mechanic.

STILL [PENDING PAOLO], unchanged: REACH_CELLS 12 and AFFILIATED_RATE 0.30; whether all 14
factions are available at the door; what "faction neighbourhood housing" is architecturally.

--------------------------------------------------------------------------------

FACTIONS (factions-ovkjpf): 8/12 (g) LATEST — *** THE WORLD SAYS IT BACK TO YOU NOW.
AND I FOUND A BUG OF MY OWN THAT MADE THE 8/11 ALLEGIANCE LINE INVISIBLE THE WHOLE TIME. ***
Nothing to judge.

"THE BEST FUNNEST DEEPEST" REFRAMED IT. This lane has built a lot of depth -- reputation
that travels, decays, gets retold, outlives you -- and every bit of it surfaced as a
READOUT. A count, a rung, a colour. Information, not experience. Nothing in the world
ever ACTED differently because of what it knew.

*** MY OWN BUG, AND IT IS THE EXACT LAW I KEEP CITING AT OTHER PEOPLE ***
showAllegiance() wrote straight into #idcard and was called BEFORE
BohemiaPeople.cardFor(), which opens with `card.innerHTML=''`. So "RUNS WITH THE TRADES"
was WIPED EVERY SINGLE TIME and has been invisible in the real talk panel since it
shipped on 8/11. My verification called showAllegiance() DIRECTLY instead of going
through drawPerson(), so it passed a test that never touched the real path. VERIFY ON
THE REAL SURFACE (7/18) means the surface, not a side door into the same function.
Fixed: it owns its own node and runs after the card is built. Confirmed through
drawPerson() this time -- a stranger's card now really shows RUNS WITH THE CHURCH - AISLE.

BUILT: THEY SAW YOU DO IT. Somebody who was standing there when you resolved a quest now
says so, and the line they repeat is THE QUEST'S OWN @LOG -- his sentence, his voice, the
same text the feed card shows. Not one word is written by me. It is weightless by
construction (a record of who was in reach; moves no standing, touches no faction) so it
cannot disturb zero-sum, which the faction-scoped deed records depend on.

THREE CUTS TO GET WHO-KNOWS RIGHT, and each was caught by looking at the card:
  1. everyone within reach  -> a "witness" whose own card read ASLEEP AT HOME
  2. only SIM.outAgents()   -> honest, and too strict: cut a live line with sparks at
                               half seven and the neighbour in bed knows
  3. OUTDOORS AT FULL REACH, INDOORS AT HALF -- one uniform physical rule (a wall
     weakens sound, it does not block it) instead of a list of which tiers wake people,
     and it lets the loudness axis do work it already earned. #quiet (reach 7) barely
     carries indoors; #reckless (24) gets through walls twelve tiles out.
And the words follow the fact: THEY SAW YOU DO IT outdoors, THEY HEARD IT FROM INSIDE
indoors -- because the probe caught a card reading ASLEEP AT HOME above "they saw you".

GATES: RUN 126, CURRENT SLICE 6, STANDING 35, DEED BRIDGE 27, MEMBERSHIP 55,
INTEGRATION 116 (27/32), NO HUNTING 7.


FACTIONS (factions-ovkjpf): 8/12 (c) LATEST — *** HE CLOSED THE ENTRANCE'S SCOPE THE
SAME DAY HE OPENED IT: ONE MAIN QUEST, FOURTEEN DRESSINGS. NOT FOURTEEN GAMES. ***
laws/BOHEMIA_ADDENDUM_THE_CUSTOMIZABLE_ENTRANCE_8_12_26.md (updated)
Gate: ENTRANCE SCOPE, 10/10, BLOCKING. Tab: LIFE -> THE ENTRANCE (opens on it).

HIS WORDS, asked whether the faction choice changes the main quest's CONTENT or only
where it opens: "It only changes the location and possible vibe and colors possible
dialogue but yeah it's not day and night. It's just with different clothes on."

    MOVES: location, vibe, colours, some dialogue
    DOES NOT MOVE: the story, the family, the beats (fight / sibling / dinner / burial),
                   the arc, the ending, the structure

THE SECOND HALF IS THE ONE A BUILD QUIETLY LOSES, which is why it is gated. A
customizable entrance is exactly the feature that becomes fourteen games: the Cartel
opening should REALLY be different so it gets its own quest file, then the Church one
does, and now there are fourteen main quests to write, test and keep in sync forever --
for a difference he says outright is NOT day and night.
    FOURTEEN DRESSINGS IS A WEEK. FOURTEEN QUESTS IS THE REST OF THE YEAR.

THE DRESSING PATH ALREADY EXISTS AND IS PROVEN, so nobody has an excuse to fork: the .bq
format gates an option on the player's faction TODAY. Measured by the gate --
`[gate: faction:REDS]` validates clean, is HIDDEN by default, and OPENS for the faction
raised on it. No format change, no second file.

GATE (ratchet, nothing is forked today): bans a per-faction FORK of a canon quest
(S01_REDS.bq beside S01_THE_METER_READER.bq) while leaving quests legitimately ABOUT a
faction alone -- the corpus is full of those and they are the point. Self-tests by
feeding itself both shapes. 21 canon quests, 21 distinct ids, 0 forked.

STILL [PENDING PAOLO] from the same law: are all 14 available at the door (CUSTOM has no
ground by definition, NETWORK is the Amalgamation's manufactured protection); what
"faction neighborhood housing" is architecturally; whether other factions know from
minute one what you were raised as.

STILL TRUE AND STILL HIS: 9 of 14 factions sit on a district you could live in. Anarchists
and Blues are on a solar farm, Cartel and Homeless in retail, Church on a farm -- and
canon puts the Homeless HQ in the sewer under the King Hobo. Base placement is worldgen
and where a faction lives is MAP CONTENT. Measured on the ENTRANCE page, left alone.




FACTIONS (factions-ovkjpf): 8/12 (c) LATEST — *** HE CLOSED THE ENTRANCE'S SCOPE THE
SAME DAY HE OPENED IT: ONE MAIN QUEST, FOURTEEN DRESSINGS. NOT FOURTEEN GAMES. ***
laws/BOHEMIA_ADDENDUM_THE_CUSTOMIZABLE_ENTRANCE_8_12_26.md (updated)
Gate: ENTRANCE SCOPE, 10/10, BLOCKING. Tab: LIFE -> THE ENTRANCE (opens on it).

HIS WORDS, asked whether the faction choice changes the main quest's CONTENT or only
where it opens: "It only changes the location and possible vibe and colors possible
dialogue but yeah it's not day and night. It's just with different clothes on."

    MOVES: location, vibe, colours, some dialogue
    DOES NOT MOVE: the story, the family, the beats (fight / sibling / dinner / burial),
                   the arc, the ending, the structure

THE SECOND HALF IS THE ONE A BUILD QUIETLY LOSES, which is why it is gated. A
customizable entrance is exactly the feature that becomes fourteen games: the Cartel
opening should REALLY be different so it gets its own quest file, then the Church one
does, and now there are fourteen main quests to write, test and keep in sync forever --
for a difference he says outright is NOT day and night.
    FOURTEEN DRESSINGS IS A WEEK. FOURTEEN QUESTS IS THE REST OF THE YEAR.

THE DRESSING PATH ALREADY EXISTS AND IS PROVEN, so nobody has an excuse to fork: the .bq
format gates an option on the player's faction TODAY. Measured by the gate --
`[gate: faction:REDS]` validates clean, is HIDDEN by default, and OPENS for the faction
raised on it. No format change, no second file.

GATE (ratchet, nothing is forked today): bans a per-faction FORK of a canon quest
(S01_REDS.bq beside S01_THE_METER_READER.bq) while leaving quests legitimately ABOUT a
faction alone -- the corpus is full of those and they are the point. Self-tests by
feeding itself both shapes. 21 canon quests, 21 distinct ids, 0 forked.

STILL [PENDING PAOLO] from the same law: are all 14 available at the door (CUSTOM has no
ground by definition, NETWORK is the Amalgamation's manufactured protection); what
"faction neighborhood housing" is architecturally; whether other factions know from
minute one what you were raised as.

STILL TRUE AND STILL HIS: 9 of 14 factions sit on a district you could live in. Anarchists
and Blues are on a solar farm, Cartel and Homeless in retail, Church on a farm -- and
canon puts the Homeless HQ in the sewer under the King Hobo. Base placement is worldgen
and where a faction lives is MAP CONTENT. Measured on the ENTRANCE page, left alone.



FACTIONS (factions-ovkjpf): 8/12 (f) LATEST — *** THE ENTRANCE NOW SHOWS WHAT EACH
OPENING IS ACTUALLY LIKE — AND I NEARLY SHIPPED SEED NOISE AS CANON. ***
Tab: LIFE -> THE ENTRANCE (opens on it). Nothing to judge.

FIRST, TWO CORRECTIONS OF MY OWN MEASUREMENTS, both caught before shipping:

1. "THE NEAREST RESIDENT IS 54 TILES AWAY" (8/12 e) WAS MY BUG, not the world's. I was
   counting SLEEPING agents at their houses. Corrected: the run is at 07:30, FOUR of
   eleven are outdoors, and ONE is within earshot of the quest tile. SIM.outAgents is a
   FUNCTION and I read its arity as a count. The world is alive; the witness numbers
   were honest all along.

2. "MONOCULTURE vs CONTESTED IS A FACT ABOUT THE FACTION" — WRONG, and it looked
   beautiful, which is why it needed checking. Standing a fixed sample of 60 people on
   each faction's ground and asking the real allegiance function who they run with gives
   two clean kinds of opening: everyone around you is yours, or you grow up among other
   people's factions. My first read said this matched his canon notes (Colorful is
   "community-based not territorial" and came out contested). ACROSS FIVE WORLD SEEDS
   ONLY 3 OF 14 KEEP THE SAME CHARACTER. It is a fact about THE MAP, not the faction.
   The page now says MONOCULTURE HERE / CONTESTED HERE and states plainly that a new
   world re-rolls it — which is the genuinely interesting version, and a real reason to
   replay.

BUILT: each of the 14 entrance cards now carries what the opening is LIKE — how many of
the people around you would run with you versus with somebody else, measured the same
way for every faction so the comparison is fair. Labelled as a probe of the world at that
spot, not a census.

STILL TRUE AND STILL HIS: 9 of 14 sit on a district you could live in (Anarchists and
Blues on a solar farm, Cartel and Homeless in retail, Church on a farm; canon puts the
Homeless HQ in the sewer under the King Hobo). Base placement is worldgen and where a
faction lives is MAP CONTENT.

STATE OF THIS LANE: the people layer is wired end to end and visible — allegiance on the
person you talk to, the consequence on the phone card, real witness counts at the moment
a quest resolves. The integration ledger's remaining gaps (district art, day cycle,
economy, dress-by-rank, vehicles) all belong to other lanes.


FACTIONS (factions-ovkjpf): 8/12 (e) LATEST — *** THE WITNESS ORGAN IS FINALLY RUNNING
IN THE GAME. Four days of it (STANDING 35 claims, DEED BRIDGE 27) had never been CALLED
by anything. *** Nothing to judge.

WHAT WAS WRONG: the consequence card said "WORD CARRIED 24 TILES" -- a DERIVED radius,
the distance a thing of that loudness travels. True, and not the same claim as "these
people saw you". The run had no minds at all and called witness() zero times.

NOW: at the moment a quest resolves, the deed is published at the player's tile -- not
when the phone opens, because who saw a thing depends on where everyone was WHEN IT
HAPPENED. The block's own people ARE the minds (no new population; they just get the one
array bohemia_standing asks for), and DEED_WEIGHT is filled from HIS corpus at first use,
so every weight traces to a @DO faction line he wrote.

TWO NUMBERS, AND THE CARD MUST NOT CONFUSE THEM -- the first cut did:
  publish() is FACTION-SCOPED on purpose (a Red genuinely does not care who buys seed),
  so it counts who FORMED A VIEW, and on this block that is honestly zero.
  "N people saw it" is a PHYSICAL claim: who was close enough. Counted separately, as
  everyone within the reach the deed's own clout tag earned.
The first version printed the opinion count under the words PEOPLE SAW IT and read as
broken while the mechanism was right.

MEASURED AT THE TILE WHERE THE QUEST REALLY RESOLVES (the lineman's, not spawn):
    quiet 0 / notable 0 / risky 0 / reckless 1
The nearest resident is 54 TILES AWAY -- everybody is home and indoors at that hour. That
is NOT a bug: the run already narrates the quiet fork as "Done, and nobody heard it", so
the system agrees with the story. But a printed 0 reads like a broken counter, so the
card says NOBODY SAW IT in words.

THE GEOMETRY FINDING, same family as the faction dead zone: the demo block's people are
far from where its quest resolves, so the loudness axis barely discriminates there (it
does work -- reach 7/12/17/24 -- there is simply nobody standing in it). Two honest ways
to change that and BOTH ARE SOMEBODY ELSE'S: where the quest is placed (run lane) and
when it resolves (a quest that ends at 3am has no audience by definition). Not tuned.

GATES: RUN 126, CURRENT SLICE 6, STANDING 35, DEED BRIDGE 27. The current slice went red
first -- it embeds the loop and I had rebuilt only the run. Same trap as 8/9; rebuild
BOTH slices whenever engine or run source changes.

FACTIONS (factions-ovkjpf): 8/12 (d) LATEST — *** "DIFFERENT CLOTHES" IS A CLAIM ABOUT
WHAT A FACTION IS, NOT A SCOPE LIMIT — AND HIS OWN CORPUS ALREADY PROVES IT. ***
Tab: LIFE -> SAME BODY, DIFFERENT CLOTHES (opens on it, nothing to tap).

I READ HIM TOO LITERALLY AND HE CORRECTED IT: "when I said different clothes, I meant it
kind of in a philosophical way as well like it's just dressed differently. I didn't of
course they will wear a different clothes but it's bigger than that."

THE CLAIM: the factions are not different kinds of people doing different things. They
are the SAME people doing the SAME small set of things, wearing different stories about
why. GROUNDED in institutional isomorphism (DiMaggio & Powell): organizations in a field
converge on the same structures because it is LEGITIMATE, not because it is efficient,
while the justifying narrative stays distinct. Same behaviour, different legitimating
story.

*** HIS OWN CORPUS ALREADY DOES IT. MEASURED, NOT ASSERTED. ***
Across every faction-moving ending he has written:
                QUIET NOTABLE RISKY RECKLESS
    TRADES        4      4      1      1
    REDS          3      3      2      2
    REMNANTS      .      1      2      3
    VOLUNTEERS    3      1      2      .      ... (12 factions)
    ALL          13     19     15     12
    FACTIONS SPANNING 2+ TIERS: 12 of 12
No faction is the quiet one. No faction is the reckless one. And at the SAME tier,
opposite ideologies read as the SAME ACT:
  QUIET     HOMELESS "talked them up out of the deep, slow, in the dark" / CARAVANS
            "paid the toll out of my own pocket... quiet, forgettable" / VOLUNTEERS
            "gave the true number, plainly" / REDS "brokered it in a stairwell"
            = handle it without a crowd and absorb the cost yourself
  RECKLESS  HOMELESS "ended it loud in the deep, for the bounty" / CARAVANS "broke the
            checkpoint loud, guns and fire and a crowd" / BLUES "broke the grate off the
            culvert mouth with a crowd watching"
            = do it in front of everybody and take what comes

THE CONSEQUENCE FOR THE BUILD: THE AXIS THAT VARIES IS HOW LOUD YOU WERE, NOT WHO YOU
ARE — and that axis is already his (#quiet/#notable/#risky/#reckless, 7/21) and already
wired to reach, retelling and standing (8/6). A faction is a DIALECT over a shared act,
not a different behaviour set. So one main quest with fourteen dressings is not a
compromise for scope, IT IS THE ACCURATE MODEL; fourteen forked quests would state
something about this world that is false.

BUILT: slices/BOHEMIA_SAME_BODY_8_12_26.html. All 59 of his faction endings sorted by
HOW LOUD instead of by WHO — every other faction view in this project sorts by faction,
which is the exact framing he is arguing against. Nothing edited; the only thing added is
the sort order.

GATE: ENTRANCE SCOPE now 11/11 and carries the measurement as a printed NOTE, DELIBERATELY
NOT AS A FAILING CLAIM. Turning "every faction spans 2+ tiers" into a rule would put
authoring pressure on HIM — write a new faction with one ending and the gate calls it a
violation. It is evidence, and a human decides whether a drift matters.

FACTIONS (factions-ovkjpf): 8/12 (c) LATEST — *** HE CLOSED THE ENTRANCE'S SCOPE THE
SAME DAY HE OPENED IT: ONE MAIN QUEST, FOURTEEN DRESSINGS. NOT FOURTEEN GAMES. ***
laws/BOHEMIA_ADDENDUM_THE_CUSTOMIZABLE_ENTRANCE_8_12_26.md (updated)
Gate: ENTRANCE SCOPE, 10/10, BLOCKING. Tab: LIFE -> THE ENTRANCE (opens on it).

HIS WORDS, asked whether the faction choice changes the main quest's CONTENT or only
where it opens: "It only changes the location and possible vibe and colors possible
dialogue but yeah it's not day and night. It's just with different clothes on."

    MOVES: location, vibe, colours, some dialogue
    DOES NOT MOVE: the story, the family, the beats (fight / sibling / dinner / burial),
                   the arc, the ending, the structure

THE SECOND HALF IS THE ONE A BUILD QUIETLY LOSES, which is why it is gated. A
customizable entrance is exactly the feature that becomes fourteen games: the Cartel
opening should REALLY be different so it gets its own quest file, then the Church one
does, and now there are fourteen main quests to write, test and keep in sync forever --
for a difference he says outright is NOT day and night.
    FOURTEEN DRESSINGS IS A WEEK. FOURTEEN QUESTS IS THE REST OF THE YEAR.

THE DRESSING PATH ALREADY EXISTS AND IS PROVEN, so nobody has an excuse to fork: the .bq
format gates an option on the player's faction TODAY. Measured by the gate --
`[gate: faction:REDS]` validates clean, is HIDDEN by default, and OPENS for the faction
raised on it. No format change, no second file.

GATE (ratchet, nothing is forked today): bans a per-faction FORK of a canon quest
(S01_REDS.bq beside S01_THE_METER_READER.bq) while leaving quests legitimately ABOUT a
faction alone -- the corpus is full of those and they are the point. Self-tests by
feeding itself both shapes. 21 canon quests, 21 distinct ids, 0 forked.

STILL [PENDING PAOLO] from the same law: are all 14 available at the door (CUSTOM has no
ground by definition, NETWORK is the Amalgamation's manufactured protection); what
"faction neighborhood housing" is architecturally; whether other factions know from
minute one what you were raised as.

STILL TRUE AND STILL HIS: 9 of 14 factions sit on a district you could live in. Anarchists
and Blues are on a solar farm, Cartel and Homeless in retail, Church on a farm -- and
canon puts the Homeless HQ in the sewer under the King Hobo. Base placement is worldgen
and where a faction lives is MAP CONTENT. Measured on the ENTRANCE page, left alone.




FACTIONS (factions-ovkjpf): 8/12 (c) LATEST — *** HE CLOSED THE ENTRANCE'S SCOPE THE
SAME DAY HE OPENED IT: ONE MAIN QUEST, FOURTEEN DRESSINGS. NOT FOURTEEN GAMES. ***
laws/BOHEMIA_ADDENDUM_THE_CUSTOMIZABLE_ENTRANCE_8_12_26.md (updated)
Gate: ENTRANCE SCOPE, 10/10, BLOCKING. Tab: LIFE -> THE ENTRANCE (opens on it).

HIS WORDS, asked whether the faction choice changes the main quest's CONTENT or only
where it opens: "It only changes the location and possible vibe and colors possible
dialogue but yeah it's not day and night. It's just with different clothes on."

    MOVES: location, vibe, colours, some dialogue
    DOES NOT MOVE: the story, the family, the beats (fight / sibling / dinner / burial),
                   the arc, the ending, the structure

THE SECOND HALF IS THE ONE A BUILD QUIETLY LOSES, which is why it is gated. A
customizable entrance is exactly the feature that becomes fourteen games: the Cartel
opening should REALLY be different so it gets its own quest file, then the Church one
does, and now there are fourteen main quests to write, test and keep in sync forever --
for a difference he says outright is NOT day and night.
    FOURTEEN DRESSINGS IS A WEEK. FOURTEEN QUESTS IS THE REST OF THE YEAR.

THE DRESSING PATH ALREADY EXISTS AND IS PROVEN, so nobody has an excuse to fork: the .bq
format gates an option on the player's faction TODAY. Measured by the gate --
`[gate: faction:REDS]` validates clean, is HIDDEN by default, and OPENS for the faction
raised on it. No format change, no second file.

GATE (ratchet, nothing is forked today): bans a per-faction FORK of a canon quest
(S01_REDS.bq beside S01_THE_METER_READER.bq) while leaving quests legitimately ABOUT a
faction alone -- the corpus is full of those and they are the point. Self-tests by
feeding itself both shapes. 21 canon quests, 21 distinct ids, 0 forked.

STILL [PENDING PAOLO] from the same law: are all 14 available at the door (CUSTOM has no
ground by definition, NETWORK is the Amalgamation's manufactured protection); what
"faction neighborhood housing" is architecturally; whether other factions know from
minute one what you were raised as.

STILL TRUE AND STILL HIS: 9 of 14 factions sit on a district you could live in. Anarchists
and Blues are on a solar farm, Cartel and Homeless in retail, Church on a farm -- and
canon puts the Homeless HQ in the sewer under the King Hobo. Base placement is worldgen
and where a faction lives is MAP CONTENT. Measured on the ENTRANCE page, left alone.



FACTIONS (factions-ovkjpf): 8/12 (b) LATEST — *** NEW LAW, HIS: THE CUSTOMIZABLE
ENTRANCE. YOU PICK THE FACTION YOU ARE BORN UNDER; YOUR FAMILY IS THE SAME EITHER WAY. ***
laws/BOHEMIA_ADDENDUM_THE_CUSTOMIZABLE_ENTRANCE_8_12_26.md
Tab: LIFE -> THE ENTRANCE (top card, opens on it, nothing to tap).

HIS WORDS: "i want the factions and the way the main quest starts with the faction ypu
chose at the faction neighborhood housing or whatever. wer decided your family will be
the same and shit so yeah. customizable entrance to the game type shit"

THE SPLIT THAT MAKES IT WORK, and it is the whole design: THE EMOTIONAL SPINE IS FIXED,
THE POLITICAL SPINE IS CHOSEN. The ACT 1 OPENING (7/19) is untouched -- cold open, the
family-defense fight IS the tutorial, the opening loss is the SIBLING, then the grief
dinner, then the burial on the ridge. What the player picks is WHOSE GROUND they open
their eyes on. A customizable entrance that changed the FAMILY would make the opening a
character sheet; changing only the WHERE keeps it a story about one specific family and
makes a second playthrough a different world rather than a different protagonist.

IT ALSO DISSOLVES A PROBLEM ALREADY ON THE TABLE. 8/11 flagged that the demo block sits
20 cells from any base with reach 12, so nobody around you belongs to anybody and the
faction layer reads as absent; the only fixes were moving the block (MAP LAW) or widening
the reach (fitting the world to a screenshot). Under this ruling the game never starts you
at an arbitrary block -- it starts you inside your chosen faction's ground. The dead zone
was an artifact of a block nobody had chosen.

BUILT: slices/BOHEMIA_THE_ENTRANCE_8_12_26.html. All 14 selectable factions, every field
read from canon -- alignment and the one-line note straight out of BOHEMIA_faction_graph
.json, colour and mark out of FACTION_LOOK/FACTION_MOTIF (his 8/2 tables), and HOME is the
district the REAL loop actually seats that faction on. CUSTOM correctly shows a mark and
NO COLOUR ("identity emerges from play") instead of being handed a swatch.

*** THE ONE CONCRETE THING BETWEEN THE RULING AND REALITY, MEASURED ***
He said the game starts at the faction neighbourhood HOUSING. NINE OF FOURTEEN sit on a
district you could actually live in. The other five do not:
    ANARCHISTS  solar / office      BLUES     solar / office
    CARTEL      commercial / retail HOMELESS  commercial / retail
    CHURCH      farm / default
HOMELESS is the loudest: canon says their HQ is the SEWER/TUNNEL under the King Hobo, and
the world seats them in a shop. Base placement is worldgen (the loop zips sorted faction
ids to an evenly-strided sample of districts) and WHERE A FACTION LIVES IS MAP CONTENT --
MAP LAW: Claude never designs map layouts. So it is measured on the page and left alone.

[PENDING PAOLO], in the law: does the choice change the main quest's CONTENT or only where
it opens (his words read as the opening); are all 14 available at the door (CUSTOM has no
ground by definition, NETWORK is the Amalgamation's manufactured protection); what
"faction neighborhood housing" is architecturally; and whether other factions know from
minute one what you were raised as.

FACTIONS (factions-ovkjpf): 8/12 (a) LATEST — *** THE FACTION LAYER IS VISIBLE IN THE
DEMO, WITH NO KNOB TOUCHED. *** Tab: LIFE -> WHAT IT COST YOU (opens on it). In the run
it is on the person you walk up to; NEVER send him into the run to check that
(laws/BOHEMIA_ADDENDUM_NEVER_MAKE_HIM_HUNT_8_11_26.md).

He left the A/B call to me -- leave the demo blank, or crank a faction's pull 12 -> 24
cells -- and said "maybe we can halfway implement them in other ways". B is fitting the
world to a screenshot. So neither; two REAL channels instead.

1. AUTHORED BEATS DERIVED. The people the demo puts in front of you are the quest CAST,
   and their faction was never a dice roll -- he wrote it into the role:
       @ROLE lineman  REQ  faction=TRADES  block=browned
   A person standing on a placed quest's speaker tile takes that AUTHORED faction;
   derived allegiance only answers for the ambient crowd. VERIFIED IN A REAL BROWSER:
   the lineman reads "RUNS WITH THE TRADES - PLATE" in rgb(208,122,42) = #d07a2a, his
   Trades colour byte for byte, zero page errors. This is also what makes the layer
   immune to WHERE THE BLOCK LANDED, which was the real reason the demo was blank.

2. YOU RUN WITH WHOEVER YOUR LIVING DEPENDS ON. Allegiance was a pure function of where
   a person SLEEPS, the weakest real channel. Weak-state conflict literature is
   consistent: armed groups' political capital comes from sponsoring access to JOBS and
   basic services, and economic dependence through livelihood is what ties people to
   them -- patron-client ties follow the work, not the address. The agent already
   carries a job site scanned off the real overmap, so a working person's allegiance now
   also weighs whoever holds ground near WHERE THEY WORK.
   HONEST LIMIT (in the source too): job sites are within 3 cells, so this widens the net
   a little, not a lot. It does NOT rescue a block 20 cells from everything.

STILL [PENDING PAOLO], UNTOUCHED: REACH_CELLS 12, AFFILIATED_RATE 0.30. The demo block
[37,22] is still 20 cells from the nearest base, so its AMBIENT crowd shows nothing --
correctly. The cast carries the demo.

GATES: RUN 126, CURRENT SLICE 6, MEMBERSHIP 55, DRESS 46, INTEGRATION 116 (27/32).

CARRIED FORWARD, STILL TRUE: yesterday's find that factionOf took an ARRAY while the
loop passes an OBJECT, so NOBODY had ever belonged to anything in a real run while a
50-claim gate stayed green on a fixture. A FIXTURE IS NOT THE CALLER. The gate now boots
the real loop.

FACTIONS (factions-ovkjpf): 8/11 (z) LATEST — *** FACTION MEMBERSHIP HAS BEEN DEAD IN
THE REAL GAME SINCE IT SHIPPED, AND ITS 50-CLAIM GATE WAS GREEN THE WHOLE TIME. ***
records/BOHEMIA_NOBODY_HAS_EVER_BELONGED_8_11_26.md. Nothing to judge.

HOW IT WAS FOUND: "we have a demo to ship", so I went to the integration ledger and
asked what a player actually SEES. Two things in this lane were zero -- the run does not
react to standing, and his 13 faction COLOURS + 14 MARKS (picked 8/2, sitting in
bohemia_dress.js ever since) had never been loaded by the run. Went to wire the colours.
Nothing rendered.

THE BUG:
    function factionOf(agent, cell, bases){
      if(!agent||!bases||!bases.length||!cell) return null;   <-- ARRAY expected
The ONLY caller is bohemia_loop.js's boot:
    ctx.factionBases[fid] = { x:..., y:... };                 <-- OBJECT, no name, no length
First line returned null for every person in the valley, every time. Measured against
real boot data: 0 of 60 affiliated standing ON a base. After the fix: 13 of 60,
returning real ids. NOBODY HAS EVER BELONGED TO ANYTHING IN A REAL RUN.

WHY THE GATE MISSED IT, and this is the transferable part: it fed factionOf a FIXTURE
    const BASES = [{ name:'REMNANTS', x:20, y:20 }, ...];
A FIXTURE IS NOT THE CALLER. Fifty claims, including a 4,033-agent split measured at
29.9% and called even -- all true about the fixture, all irrelevant to the world. A new
variant of the disease this lane keeps hitting: not authored-and-unread, not
readable-but-discouraged, but GATED AGAINST THE WRONG SHAPE, which is worse because the
green is louder.

FIX: normalizeBases() accepts both forms. Normalised in factionOf and NOT in the loop on
purpose -- the loop's object form is what other code already reads, and changing that
contract would move the breakage instead of fixing it. Gate now boots the REAL loop and
hands it the REAL ctx.factionBases: 55/55, "14 bases, 18/80 of a crowd standing on one
affiliated". Two guards added so it cannot rot: an empty bases object must still yield
nobody, and the array form must still work (this ADDED a shape, it did not swap one).

ON SCREEN NOW: the run loads bohemia_dress.js and the person you walk up to says who
they run with, in HIS colour with HIS mark -- "RUNS WITH THE TRADES - PLATE". Derived,
never assigned; keyed to the seat so it survives a save; somebody who runs with nobody
says NOTHING, because most of the valley is unaffiliated and a label on all of them is
noise. The street bodies are real baked characters and RE-COSTUMING THEM IS THE CLOTHES
LANE'S PIPELINE -- not cut into. This is NPC identity, which is this lane's own.

*** THE DEMO BLOCK IS IN A FACTION DEAD ZONE -- [PENDING], AND NOT MINE TO TUNE ***
    demo block [37,22] | nearest base Caravans 20 cells | REACH_CELLS 12
    within reach: 0 of 14 bases | affiliated on the block: 0 of 11 people
The mechanism is right; the block is genuinely outside every faction's pull, so the
allegiance line shows NOTHING in the demo as it stands. Two ways to change that and both
belong to somebody else: MOVE THE BLOCK nearer a base (MAP LAW: Claude never designs map
layouts) or RAISE REACH_CELLS/AFFILIATED_RATE (both marked [PENDING Paolo] in source).
Tuning them so a demo looks busier is fitting the world to the screenshot.

FACTIONS (factions-ovkjpf): 8/11 (s) LATEST — *** NEW LAW, HIS: NEVER MAKE HIM HUNT. ***
laws/BOHEMIA_ADDENDUM_NEVER_MAKE_HIM_HUNT_8_11_26.md. Gate: NO HUNTING, 7/7, BLOCKING.
Tab: LIFE -> WHAT IT COST YOU (top card, opens on it, nothing to tap).

HIS WORDS: "you can't have me test shit out in the run app for real like unless you're
gonna place me right in front of it every time... I'm not hunting bro like how the fuck
am I supposed to find what you want me to find so put a new rule somewhere never tell
me to check something out by checking the run app"

WHAT EARNED IT WAS MINE, the turn before. I shipped the faction consequence line INTO
the run -- correct, that is where a player meets it -- and then told him to reach it by
playing the block quest and opening the phone. Minutes of navigation to confirm one
readout, and if a trigger does not fire he concludes the work is broken. A HUNTING
INSTRUCTION TURNS GOOD WORK INTO A FALSE NEGATIVE, which is worse than not surfacing it.

THE RULE: never route him through the run to inspect something. Place him right in
front of it, every time. If it needs steps to reach, it is not shipped for judgement.
The run is for PLAYING, never for INSPECTING. Shipping INTO the run stays correct and
encouraged -- the ban is on using it as an inspection route.

FIXED THE SAME TURN: slices/BOHEMIA_WHAT_IT_COST_8_11_26.html, top card in LIFE. All
89 endings across his 21 canon quests, each showing the exact card the phone gives him
-- follower count, then WORD CARRIED n TILES, which factions moved and to what rung,
who got stirred up. Renders on load. Same modules and same reachOf()/rungOf() calls the
run makes, so the page cannot drift into showing something the game does not do.

GATE: no_hunting_gate.py, BLOCKING. Fires only on the exact costly shape (a look-here
pointer + the run as the route + chained steps), never on the word "run" and never on
shipping into it. Self-tests by feeding itself the sentence that earned the law. Also
holds: every hub card points at a page that EXISTS, and a judged surface RUNS ITSELF on
load. Its first cut had a VACUOUS claim -- it looked for page filenames inside the
handoff, found zero, and passed green -- so it was turned around to sweep the hubs,
where the set can never be empty. That trap has now been caught three times in two days.

FACTIONS (factions-ovkjpf): 8/11 (r) LATEST — *** THE RUN FINALLY SHOWS WHAT A QUEST
COST YOU. THE INTEGRATION LEDGER'S OLDEST PARTIAL IS CLOSED. ***
Tab: LIFE -> WHAT IT COST YOU (opens on it, nothing to tap). It ALSO landed in the
RUN's phone where a player meets it, but NEVER send him into the run to check it --
laws/BOHEMIA_ADDENDUM_NEVER_MAKE_HIM_HUNT_8_11_26.md, which this line earned.
27/32 systems now integrated (was 25/31).

"WE HAVE A DEMO TO SHIP" changed the target, so I went to the integration ledger
instead of building another system. The oldest PARTIAL, sitting there since 7/26:
    factions / world bridge | PARTIAL | quest outcomes really move faction standing,
                                        but nothing in the run SHOWS it
Four days of reputation machinery moving real numbers a player never sees. For a demo
that is fatal -- the entire faction layer was invisible.

THE RUN LANE'S JOB IS INTEGRATION, NOT FEATURES (Paolo 7/26): "the measure of the lane
is not what did you add, it is what is finally IN it that we already made." NOTHING NEW
WAS COMPUTED. The run simply never loaded two modules that were already built and
already gated (bohemia_standing 35 claims, bohemia_deeds 27) and never read the
FactionWorld its own world bridge had already moved.

THE FEED CARD now carries the consequence under the vanity follower count:
    WORD CARRIED 24 TILES      the clout tag's real reach (#quiet 7, #reckless 24)
    CARAVANS +10 - NEUTRAL     which factions moved + the rung they now sit on, read
                               off the LIVE FactionWorld, never the quest's scratch
    CARTEL STIRRED UP          @DO faction_posture, wired 8/7

VERIFIED ON THE REAL SURFACE, not by the build succeeding: driven in a real browser to
the phone, zero page errors, rendering
    'The Toll Road - COMPLETE / +110 followers / WORD CARRIED 24 TILES /
     CARAVANS +10 - NEUTRAL / CARTEL STIRRED UP'

CLOSING THE ROW NEEDED A PROBE FOR THE SHOWING, NOT THE MOVING. Otherwise the ledger
would read INTEGRATED because a number changed in memory where no player can see it --
the exact class of claim that gate exists to refuse. New probe world_bridge_shown
checks the run really renders off standingWith('player'), rungOf() and
BohemiaDeeds.reachOf(). INTEGRATION 116 passed. RUN GATE 126 passed.

WHAT IS STILL NOT IN THE RUN, from the same ledger (none of it mine):
    district heroes + district art (21 types) .. PARTIAL, material pass only
    day cycle / light / LIGHT=TERRITORY ....... NOT YET, block is one fixed hour
    economy .................................. NOT YET, off by his 7/31 ruling
    dress-by-rank ............................ NOT YET, bodies are random colourways
    vehicles ................................. NOT YET, driveways empty
If the demo needs one more thing after this, DAY CYCLE is the one a player feels
hardest -- a fixed noon reads as a prototype.

CONTAINER WARNING, THIRD TIME TODAY: this container silently reverted to an 8/2
snapshot mid-turn three separate times, losing the local checkout each time. Everything
pushed survived; only uncommitted work was at risk. COMMIT AND PUSH EARLY AND OFTEN.
The revert also wipes Pillow/numpy despite the SessionStart hook, and
tools/build_run_slice.js hard-fails without PIL -- rerun
`python3 -m pip install -r gates/requirements.txt` when a build dies on ModuleNotFound.
A restored run-slice source can also be STALE (mine was missing a placeholder the
current builder needs) -- always re-apply edits to main's version, never restore a copy.

FACTIONS (factions-ovkjpf): 8/7 (p) LATEST — *** PAOLO RULED A: "A BOND BUILT IN ONE
QUEST OPENS A DOOR IN ANOTHER. CONTINUITY IS THE DYNASTY." BUILT THE SAME TURN. ***
Law: laws/BOHEMIA_ADDENDUM_CONTINUITY_IS_THE_DYNASTY_8_7_26.md. Nothing to judge.

WHAT WAS IN THE WAY: quest state is PER-QUEST by construction -- freshState(Q) hands
every runtime its own object -- so `@DO bond grower +18` was invisible to every other
quest. 44 authored bond rulings with no mechanism by which one could EVER have
mattered to a later story.

THE IDENTITY PROBLEM, AND HIS OWN FILES SOLVE IT. A bond attaches to a PERSON, and a
quest's LABEL for someone is not a person. Measured BEFORE designing anything: 43
distinct role names, 5 used by more than one quest, and those five settle it:
    neighbor  S06 `is=the_neighbor household=behind_fence`
              S09 `is=the_neighbor household=behind_fence`   IDENTICAL -> one person
    runner    S02 `faction_any knows_the_load=true`
              S12 `faction=CARTEL moves_medicine=true`       DIFFERENT -> two people
HE HAS BEEN DECLARING IDENTITY IN THE @ROLE CONDITIONS SINCE BEFORE ANYTHING COULD
READ IT. Writing the neighbour's conditions verbatim twice IS him saying it is the
same neighbour. So the key is the CONDITION SET, never the label -- continuity needed
NO new authoring, and two different `runner`s can never be silently merged.
46 distinct people are identified across the 21 canon quests this way.

MECHANISM: one ledger per quest manager, handed to every runtime it makes. @DO bond
writes the quest's own state AND the ledger, keyed by person. A numeric gate
([gate: neighbor>=10]) reads the CARRIED bond. It is in the save. It SHIPS EMPTY. A
runtime built without a ledger is bit-for-bit what it was, so nothing existing moved.

GATE: continuity_gate.js 7/7, 8 planted mistakes caught. Holds the crossing, the
identity discrimination (different person sharing a label inherits NOTHING), reload
survival, no double-counting, and the untouched old behaviour. Registered as
CONTINUITY. Re-verified after the change: runtime 33, bq 29, loop quests 16, faction
bridge 56, ledger 16, clout 18, canon quests 426, quest study 303, authored unread 11,
current slice 6, RUN GATE 126.

SLICES REBUILT: the loop changed, and CURRENT_SLICE + RUN_CURRENT inline it. That is
the same trap that went red on me earlier today -- rebuild them or those two gates
fail with "the committed slice is stale".

NAMED SO IT IS NOT ASSUMED:
  - `learn` and `set_flag` do NOT carry yet. Same shape, same fix available, unbuilt.
  - 391 of 395 dialogue options are still [gate: none]. The machinery is real now;
    whether the WRITING reaches for it is authoring, and authoring is his.
  - Nothing binds a quest role to one of the 268 derived world people. Identity here
    is the author's condition set -- stable and correct, but not the same thing as
    pointing at a body standing in a district.

CONTAINER WARNING FOR THE NEXT SESSION: this container reverted to an 8/2 snapshot
TWICE mid-turn, silently, losing the local checkout both times. Everything already
pushed was fine; only uncommitted work was at risk. COMMIT AND PUSH EARLY. Also, the
revert wipes Pillow/numpy even though the SessionStart hook installs them, and
tools/build_run_slice.js hard-fails without PIL -- rerun
`python3 -m pip install -r gates/requirements.txt` if a build dies on ModuleNotFound.

FACTIONS (factions-ovkjpf): 8/7 (c) LATEST — *** A SECOND WAY AUTHORED CONTENT DIES,
AND IT IS NASTIER: THE MECHANISM WORKS AND THE CHECKER TELLS THE AUTHOR HE IS WRONG. ***
Nothing to judge.

Chasing yesterday's QUEST-ONLY rows, @DO bond was the suspect: 44 authored rulings,
the second most-written faction verb after `faction` itself, and the corpus gates on
it ZERO times.

I first concluded bonds were STRUCTURALLY UNREADABLE. THAT WAS WRONG, and reading the
code is what caught it. bohemia_quest_runtime.js _cond has a numeric branch:
    else if(key in s.bonds)   cur=s.bonds[key];
So `[gate: grower>=10]` genuinely works. Bonds were wired the whole time.

THE REAL DEFECT: bq.js WARNED AT YOU FOR USING IT. GATE_KEYS is the `key:value`
vocabulary (flag:, knows:, role:, has:). A NUMERIC gate's key is a bond target or a
faction id, which was never supposed to be in that list -- so the validator flagged
the one correct way to use 44 authored rulings as a mistake. That is worse than an
unwired feature: an unwired feature is invisible, but a feature whose only correct use
is reported as an error actively teaches the author to stop trying. Gating on bonds
zero times is exactly what you would expect.
Paolo 8/1 twice over: a checker that cannot tell a use from an error is the broken
one, and you fix the RULER, never the target.

FIX: a numeric gate key is legal when it is stage, gen, or a DECLARED @ROLE of that
quest. Measured before writing it: all 44 bond targets in the corpus are declared
roles, 0 exceptions. Faction ids deliberately stay out -- canon content this parser
does not get to enumerate -- so a faction-keyed numeric gate is still warned about.
Corpus revalidated: 21 canon quests, 0 errors.

GATE: authored_unread_gate.py now 11/11, and BOTH halves are measured because a
validator that stops complaining about something still broken is worse than the
warning:
    a numeric gate on a DECLARED @ROLE no longer warns ......... PASS
    a genuinely unknown gate key STILL warns ................... PASS
    the bond gate really GATES: hidden before, open after +18 .. PASS

*** THE BIGGER MEASUREMENT, HIS CALL NOT MINE, NO QUEST FILE TOUCHED ***
    391  [gate: none]
      2  knows
      2  flag
      0  has / role / faction / gen / bond
    395 gates total, FOUR of them conditional
Meanwhile the corpus authors 142 pieces of recorded state (62 learn + 36 set_flag +
44 bond) and conditions on four. It reads two ways and only he can say which: either
the state is recorded for cross-quest continuity not yet built (correct and early), or
the branching machinery exists and the writing has not reached for it (in which case
every playthrough offers the same options no matter what you did). The validator
warning was a real cause either way and is now gone.

NOTE ON THIS CONTAINER: it was restored from an older snapshot mid-turn and the local
tree reverted to 8/2. Everything from 8/6-8/7 was already pushed and is intact on
main (deed bridge, HOW LOUD YOU WERE, posture bridge, WHO YOU STIRRED UP, the
authored-unread machine). Verified commit by commit before continuing. Only this
bq.js fix was uncommitted, and it survived as a working-tree edit.

FACTIONS (factions-ovkjpf): 8/7 (b) LATEST — *** I FOUND THE SAME BUG BY HAND THREE
DAYS RUNNING, SO I BUILT THE MACHINE THAT ASKS THE GENERAL QUESTION. ITS FIRST HONEST
RUN FOUND A FOURTH: THE TERRITORY SYSTEM HAS NEVER MOVED A DISTRICT. ***
Nothing to judge. Machine + finding.

ONE DISEASE, FOUR COSTUMES, all four found by a human noticing:
  7/30  an approved bank that never draws a pixel
  8/4   17 finished things shipping where no player looks
  8/6   69 clout tags read only by a vanity follower count
  8/7   17 @DO faction_posture rulings parsed into a real field and dropped
Every gate in the repo was green through all four, because nothing could ask the
general question. A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED -- and this one did not
even have a law.

TWO WRONG VERSIONS BEFORE THE RIGHT ONE, and both failure modes are worth carrying:
  v1 grepped the VERB NAME -> called advance_territory dead, because the verb is
     snake_case and the field it writes is camelCase. The 8/4 census already had this
     exact scar ("four false alarms out of five").
  v2 grepped the STATE FIELD (read from the runtime's own switch, never typed) ->
     called EVERYTHING alive, because two judge pages re-implement the runtime for
     preview and a simulator looks identical to a consumer.
A third heuristic would have had its own blind spot, so per Paolo 7/26 ("a fourth
version means you already failed") the APPROACH changed:
    DO NOT ASK WHO READS IT. ASK WHETHER IT CHANGES ANYTHING.
Boot a real world, snapshot, resolve a quest carrying exactly one @DO verb through the
real runtime, boot again without it, diff. It never reads a character of source.

*** THE FIND: @DO advance_territory HAS NEVER MOVED A DISTRICT. ***
It fires -- bohemia_loop.js really does call advanceRound(), and the existing bridge
test proves the call happens. THE CALL HAPPENS AND THE AI DECLINES. Measured:
    default quotas, 1 round   -> changed: false
    default quotas, 13 rounds -> changed: false
    every faction boots 1 district / quota 1
scoreClaim has an explicit gate for exactly that: `if (deficit <= 0 && !owner) return
-1;  // sated: ignore empty land`. Deficit is zero for everybody, so every faction
declines every target every round, forever. A correctly-implemented no-op since it
shipped, with four authored rulings firing an engine that always says no.
    quota+1, 1 round -> changed: TRUE
FACTION_POSTURE IS THE MISSING HALF OF ADVANCE_TERRITORY. One says "shake the map
now", the other says "and here is who is hungry enough to move". Both authored,
neither connected to the other. Wiring posture in 8/7(a) is what makes the territory
system do anything at all -- which I did not know when I wrote it.

WHY THE FIX IS NOT "RAISE THE DEFAULT QUOTA": quota is CONTENT. How much ground a
faction wants is a canon question about who they are, and his posture rulings already
answer it, per quest, in his numbers, on the narrative beat where it belongs. The
system was designed right; only the wire between its two halves was missing.

GATE: gates/authored_unread_gate.py, registered as AUTHORED UNREAD, 7/7. Fails if any
@DO verb is INERT (changes nothing anywhere) or UNPARSED (he writes it, the runtime
has no case). Vocabulary is read out of the runtime's own switch so it follows a
rename automatically. THE FIFTH INSTANCE OF THIS BUG CANNOT HAPPEN SILENTLY -- that is
the actual deliverable; advance_territory is what it caught on the way out.

NAMED, NOT LEFT TO BE INSTANCE FIVE: this sweeps the @DO vocabulary ONLY. The same
disease can live in @STUDY citations, @ROLE REQ keys, and [gate: ...] conditions,
none of which are swept. And QUEST-ONLY is a coarse verdict -- @DO play "changes
state" only because it appends a line to a log, which means THE SOUND STILL NEVER
PLAYS. The gate is currently too generous to fail on that.

FACTIONS (factions-ovkjpf): 8/7 (a) LATEST — *** THE THIRD QUEST EFFECT, AUTHORED
SINCE 7/25, PARSED CORRECTLY, AND READ BY NOTHING. ***
Tab: LIFE -> WHO YOU STIRRED UP. Nothing to judge, nothing to tap.

engine/bohemia_quest_runtime.js line 117 has parsed `@DO faction_posture CARTEL +1`
into rt.state.posture since 7/25. The world bridge in bohemia_loop.js carried the
OTHER TWO quest effects all the way to the real FactionWorld -- standing and
@DO advance_territory -- and walked straight past that one. SEVENTEEN authored
rulings, parsed correctly, written to a real field, read by nothing. Same disease as
yesterday's clout tags, one layer up: this is how factions move on EACH OTHER.

POSTURE IS NOT STANDING, AND HIS FILES PROVE IT RATHER THAN ME ASSERTING IT. Authored
stages write BOTH on the SAME faction in one breath:
    @DO faction CARAVANS -15          <- what they think of YOU
    @DO faction_posture CARAVANS +1   <- something else entirely
(S17.33, and S13.33 does it on REDS.) If posture meant "toward the player" those are
duplicate lines. Read against the quest carrying it -- "a public humiliation of one is
a real faction event" -- it is HOW MOBILISED a faction becomes. Every authored value is
+1 or +2: nobody has ever written a faction CALMER, so the mechanism cannot invent one.

IT MOVES A KNOB THAT ALREADY EXISTS. Faction.quota is already, in the engine's own
words, "districts it WANTS to hold", and already the appetite term scoreClaim() reads.
Nine lines inside an existing bridge function. No new field, no new module, no second
appetite system, and the territory AI is untouched.

PACING LAW HELD (Paolo 7/24: factions are not at war 24/7). Appetite is not a turn. A
posture line moves NOT ONE DISTRICT on its own -- only @DO advance_territory still
shakes the map, and the gate proves it by asserting the owner map is byte-identical
after a posture quest resolves.

WHAT IT DOES TO THE VALLEY. Same seed, same map, same AI, same 12 rounds, the only
difference being whether his rulings applied:
    18 of 32 districts came out under a different flag
    Network 1 -> 6 (+5)   his corpus stirs it up most: +1 +1 +1 +2
    Reds    1 -> 5 (+4)   Blues/Cartel/Remnants 1 -> 3
    every faction with NO posture ruling stayed at 1
The map redraws itself entirely out of content he already wrote, and the biggest winner
being the Network is lore-consistent with his 8/2 ruling that it is the Amalgamation's
pawn.

*** THE ONE THING PENDING HIM, AND I NAMED IT RATHER THAN DODGING IT ***
laws/BOHEMIA_ADDENDUM_BUILD_THE_WORLD_7_31_26.md says "FACTIONS ARE OFF. No standing
ledger, no territory model, no faction beats." THERE IS NO WRITTEN LIFT IN /laws. I
built on his NEWER verbal direction -- he opened this session with the single word
"factions", said "lets do some faction shit", and said "execute" three turns running --
over a written law he has not formally retracted. TRUTH HIERARCHY: newest ruling wins.
Paolo 8/1: a gate must never outrank a ruling. What made it sit right rather than being
the legal-way-to-ship-a-frozen-thing STOP PRODUCING names as itself the violation:
  - NO new faction machinery. No file matching bohemia_faction*.js; the footprint
    build_the_world_gate.py froze is untouched and still shrinking-only.
  - NOTHING was authored. Every number is a line he already wrote.
  - IT IS VISIBLE. The 7/31 law's actual complaint was invisible plumbing -- "a turn in
    this lane that has nothing to look at is a turn that missed." This ships a page.
IF HE SAYS THE FREEZE STANDS, it is nine lines to revert. If he lifts it, write the
addendum and tell build_the_world_gate.py.

GATE: faction_posture_gate.js, 8 claims, 7 planted mistakes caught. Worth knowing: its
FIRST version drove the bridge through an export that does not exist, nothing ran, and
the claim FAILED rather than passing vacuously -- because it measures the WORLD ("the
quota moved") and not the CODE ("the function was called"). Rewritten to drive the real
route bohemia_loop_faction_bridge_tests.js already proves (boot, start a quest, walk a
real dialogue choice). Those 56 tests still pass.

ALSO FIXED YESTERDAY, ALREADY ON MAIN: the deploy. The link had not published since 8/5
-- 30 runs, 18 cancelled, 8 failed, zero success -- because two deployers were fighting.
Cleared once the Pages source was switched to GitHub Actions.

NOTE FOR WHOEVER OWNS THE BUILD STAMP: commit 1593f8e set it to "BUILD 8/4m", a date
older than work already on main. Not adjudicating it; I set 8/7a for today.

FACTIONS (factions-ovkjpf): 8/6 (k) LATEST — *** HIS QUEST CORPUS ALREADY SAID HOW
LOUD EVERY DEED WAS, AND ONLY THE VANITY FOLLOWER COUNT WAS LISTENING. ***
Tab: LIFE -> HOW LOUD YOU WERE. Nothing to judge, nothing to tap, it auto-runs.

Every canon .bq outcome writes TWO numbers, and has since they were authored:
  how BIG   `@DO faction REDS +12`                       59 of them
  how LOUD  `#quiet` `#notable` `#risky` `#reckless`     69 of them
The loud half fed defaultFollowerScore() and NOTHING ELSE. Faction standing was
applied godlike -- valley-wide, instantly, with nobody having seen anything -- so a
back-yard handshake and a public humiliation in front of a whole block moved a
faction THE SAME AMOUNT. In a game whose own 7/21 law is titled RECKLESS BEATS QUIET.

BUILT: engine/bohemia_deeds.js. The tag now decides how far the news carries and how
many times it gets retold:
    reach = SEE_RANGE * sqrt(cloutWeight / CLOUT_NEUTRAL)
read off his LIVE table in bohemia_loop.js, never copied. A clout weight is how many
people care; that many people occupy an AREA, so RADIUS goes with its square root.
    #quiet 7 tiles/1x | untagged 9/2x | #notable 12/3x | #risky 17/4x | #reckless 24/5x
AN UNTAGGED DEED LANDS ON EXACTLY SEE_RANGE AND EXACTLY MAX_HOPS. sqrt(15/15)=1, so
the default case is bit-for-bit what the world already did and the tag can only move
you OFF it. Linear scaling would have put one loud act in front of 66 tiles and news
teleports again -- the exact failure the witness organ exists to kill.

THE LAW THAT WAS WRITTEN DOWN AND NEVER PRODUCED. bohemia_standing.js has said since
the day it shipped that "a quiet good deed dies with the witness, a notorious one
becomes the thing your child is judged for" -- because inherit() only carries a deed
somebody RETOLD. Nothing made the difference; every deed had the same hop budget, so
quiet and notorious were literally the same word. Thirty years, 385-person valley:
    #quiet 6 | #notable 36 | #risky 64 | #reckless 110 still telling it
Monotonic across all four of his tiers. 18x spread.

NOTHING INVENTED, and the gate measures it rather than believing a comment:
DEED_WEIGHT still SHIPS EMPTY (checked BEFORE the bridge loads), every row traces to
a @DO line by re-grepping the raw source, no faction is named in the bridge's code,
and the units conversion is DERIVED -- the biggest act in the corpus in front of a
whole faction moves exactly ONE RUNG (18/2 = 9, measured off his files, and it
re-normalises itself if he ever writes a bigger deed).

THREE THINGS I BUILT WRONG FIRST, written down because they are the transferable part:
  1. A CLAIM AUTHORED BEFORE ITS MEASUREMENT. The gate asserted a quiet deed carries
     ZERO across a generation. Measured, it carries a few. Rewrote the claim to what
     is true (the SPREAD, across all four tiers), not the measurement to the claim.
  2. A THRESHOLD MASQUERADING AS A LAW. "reckless reach must be under 22 tiles"
     failed by two tiles and taught me nothing. The property that matters is
     SUB-LINEARITY -- twice the drama is less than twice the sightline -- which is
     exact, needs no constant of mine, and is checked against his live table.
  3. A WORLD TOO SMALL FOR THE QUESTION. The generational panel first ran in the
     faction-sized field, where the loudest deed reached 73 of 88 people and so had
     only 15 strangers left to hear about it -- and the chart came out saying a
     reckless deed is FORGOTTEN FASTEST. The mechanism was right; the frame was
     wrong. That panel now runs in the valley, because the thing being measured is
     whether there was anybody LEFT TO TELL.

GATE: deed_bridge_gate.js, 27 claims, 15 planted mistakes caught every run. Registered
in bohemia_gates.py as DEED BRIDGE. standing_gate still 35/35 after the two surgical
changes to bohemia_standing.js (per-deed range/maxHops/only on witness(), per-deed hop
budget honoured in gossip(); every default is the old behaviour exactly).

STILL OPEN AND DELIBERATELY NOT MINE: bohemia_loop.js STILL applies @DO faction
straight to FactionWorld -- the omniscient scalar. Swapping it to publish() is a small
change in the QUESTS/RUN lane's file, and ONE SYSTEM ONE SESSION says it is not mine
to cut. The witnessed organ is proved, gated and watchable; the swap is theirs.

BOUNDARY NOTE: another PEOPLE session (7h9sfy) shipped durable-save the same day.
Different system inside the same lane -- no overlap, backlog conflict resolved keeping
both entries.

FACTIONS (ovkjpf): 8/20-8/21 — THE BELONGING SYSTEM IS CONNECTED END TO END.
Eleven times in one week the same shape: AN ORGAN COMPUTES SOMETHING AND NOTHING
ON THE WALKED SURFACE CALLS IT. It never shows as a crash -- the organ is right,
its unit test is green, ITS OWN GATE IS GREEN, and the feature does not exist for
the player. Nine of the eleven were found by tripping over them.

WHAT IS NOW ON THE CARD (all measured on the real city page, all mutation-proved):
  meet -> learn the name the way THAT OUTFIT does it (five of the sixteen
  mechanics were dead: MOB vouch, REMNANTS overheard, BLUES standing, HOMELESS
  "where do you sleep", COLORFUL screening) -> see who they run with -> read
  their terms -> act -> hit the wall -> take a side -> get counted -> get asked
  -> owe -> get collected from -> neglect decays it -> history persists.
  Plus: WHAT ASKING COSTS, printed BEFORE the button (3 outfits charge);
  YOUR POSITION (Burt/Simmel tertius gaudens vs the 2024 dolens correction);
  and the five authored RUNG NOTES, which no surface had ever asked for.
GATES: FACTION ARC 82/0 · CARD FOLD 18/0 · ORGAN REACH 8/0 · TOOL IDEMPOTENT 5/0.

*** TWO THINGS ARE HIS AND BOTH ARE ABOUT THE WORLD, NOT THE CODE ***
 1. WHAT DOES BEING **INSIDE** GET YOU? Measured, same person, three states:
      COUNTED (sided, gave 9)    buttons: name/burn a bridge/do it/no/take
      INSIDE  (burned, gave 20)  buttons: name/do it/no/take
      INSIDE  (burned, gave 60)  IDENTICAL to gave 20 but for the meet counter
    You climb five rungs and burn a bridge elsewhere and the card is the rung
    below MINUS THE WALL. His INSIDE note -- "the newcomer is the old-timer now,
    and the next newcomer is your problem" -- is a DIRECTION, not a mechanic.
    NOTE the likely answer is half-built already: BohemiaTies.vouchFor needs a
    voucher who is INSIDE the same outfit and whose name you know. His note reads
    like the player becoming that voucher.
 2. DOES ANYBODY SHARE A HOUSE? MEASURED: 199 of 298 people know NOBODY AT ALL
    (mean 0.71, max 8; only 19 of 298 can introduce you onward to three).
    ZERO cross-outfit ties exist in the whole valley, so whoHears returns NOBODY
    for every outfit and the entire cross-cutting-cleavage half is unreachable:
    WHO WILL HEAR, AND IT COSTS YOU, and tertius DOLENS can never fire.
    EVERY COMMITMENT IN THIS GAME IS CURRENTLY FREE.
    CAUSE, three stacked: homesIn() seats ONE person per fine cell so the HOME
    focus (Feld's strongest, and the one that most naturally crosses an outfit
    line) groups nobody; a FACTION tie is same-outfit by definition; WORK is the
    only possible bridge and 32-affiliated-of-298 never pairs two affiliated
    people from different outfits. CHECKED SPECIFICALLY that this is NOT a keying
    bug in bohemia_ties -- a bug of exactly that shape was found and fixed 8/15
    and the same conclusion would have been wrong twice.
    Record: records/BOHEMIA_EVERY_COMMITMENT_IN_THIS_GAME_IS_FREE_8_20_26.md

TRAPS THIS LANE PAID FOR. DO NOT REPEAT THEM.
  READING THE CODE GAVE A DIFFERENT ANSWER THAN RUNNING IT, THREE TIMES: the
    organ sweep called BohemiaTies dead (it is INJECTED as a value); two static
    counts of "broken tools" said 63 then 61 (running them said 52, and one in
    both lists ran perfectly). A CLASSIFIER THAT CANNOT TELL A WORKING THING FROM
    A BROKEN ONE IS THE BROKEN THING.
  A COMMENT IS NOT A CALLER. I wrote the search pattern inside a comment
    EXPLAINING the search, and the comment became the only "caller" the function
    had. Deleting the real call left the gate green.
  A CLAIM THAT ONLY LOOKS AT THE CASE IN FRONT OF IT IS NOT A CLAIM. Twice: a
    size bar measuring a comfortable card, and a citation check reading one rung
    of five. Both passed while broken; both caught by mutation.
  A GATE CAN GO RED BECAUSE ITS EVIDENCE MOVED, NOT BECAUSE ITS CLAIM BROKE.
    THE TEST: is the claim still provable another way? If not, the code is wrong.
  A MUTATION THAT DID NOT APPLY LOOKS EXACTLY LIKE ONE THAT DID NOT BITE. Assert
    the anchor count; prefer a unique PHRASE over anything with punctuation.
  A GATE THAT IS ALWAYS RED IS ONE EVERYBODY IGNORES. tool_idempotent's first cut
    refused on a dirty tree and went red on its own registration commit.
  THE ORGAN SWEEP STRUCTURALLY CANNOT FIND UNREAD PROSE -- a note is DATA, so it
    has no call site. Five authored rung sentences were invisible to it.
FACTIONS (ovkjpf) 8/21 ADDENDUM — *** THE WHOLE SYSTEM HAD NO MEMORY. ***
ctBelongSave() returned a plain window object: nothing wrote it, nothing read it
back. MEASURED on the real page -- work for the Cartel, commit, take a debt,
reload: gave 9->0, commitment burned->none, owed 4->0, and THE NAME SURVIVED.
So the game remembered what to call you and forgot that you burned a bridge for
them. A COUNT IS NOT A MEMORY, one level up.
WHY 82 GREEN CLAIMS NEVER SAW IT: `grep -c 'reload()' faction_arc_gate.js` -> 0.
Every claim walked the arc and NOT ONE EVER CLOSED THE GAME AND CAME BACK.
A GATE THAT NEVER RELOADS CANNOT TELL A SAVED GAME FROM A SESSION.
FIXED: ctSave() carries both ledgers, ctBelongSave() hydrates on first read. One
writer, one reader. Same pattern as boh.city.met, second key, same seam. The
debug wipe() took only the met-ledger and now takes both -- A WIPE THAT LEAVES
HALF THE SAVE IS NOT A WIPE. Gate: part Q (Q1/Q2/Q3). 88/0.

*** AND MY CORRUPT-SAVE CHECK TESTED THE WRONG LAYER, TWICE. *** The version
guard mutation did not bite (the gate only ever writes a VALID blob, so the
discard path was a claim nothing exercised). Q3 was written to fix that and DID
NOT BITE EITHER: the payload was UNTERMINATED JSON, so JSON.parse threw, the
try/catch swallowed it, and the guard under test was never reached.
WHEN TWO GUARDS STACK, A TEST THAT TRIPS THE OUTER ONE PROVES NOTHING ABOUT THE
INNER ONE. Aim the payload at the layer under test: valid JSON, wrong version,
PLAUSIBLE standing. Now 87/1 with the guard deleted, 88/0 restored.

STILL TRUE, NOT THIS LANE'S: the city's ledgers live OUTSIDE the game's save
slots. bohemia.save.v1 is RUN's slot list; boh.city.met and boh.city.belong are
global keys. So LOADING AN OLDER SAVE DOES NOT REWIND YOUR FACTION STANDING.
Pre-existing (the met-ledger has always behaved this way) and making faction
state slot-aware while "who you have met" is not would be WORSE -- two
behaviours for facts about the same person. One pass, both ledgers, whoever owns
the save-slot design.
Record: records/BOHEMIA_THE_BELONGING_SYSTEM_HAD_NO_MEMORY_8_21_26.md

FACTIONS (ovkjpf) 8/21 — HOUSEHOLDS ARE IN, AND G1 IS RED ON PURPOSE.
Paolo ruled it: "people share houses yes bro". NOTES ARE RULINGS, built same turn.
    BEFORE  298 people, 298 homes, ZERO households, 199 of 298 knew NOBODY,
            106 ties between affiliated people and ALL 106 same-outfit,
            CROSS-OUTFIT LINES: 0, whoHears answered NOBODY for every faction.
            EVERY COMMITMENT IN THE GAME WAS FREE.
    AFTER   183 households (mean 1.63), people knowing nobody 199 -> 114,
            cross-outfit ties 0 -> 2, whoHears LINES 0 -> 4
            (CUSTOM<->MOB, MOB<->NETWORK).
THE DEDUP STAYS: one body per cell is also a law. A house is not a cell, it is
several people in several rooms at one address -- everyone keeps their own cell
and gains a shared HOUSEHOLD. Nothing overlaps.
SIZES RESEARCHED: US mean 2.58 / 28.9% alone is a PROSPERITY number; job loss
TRIPLES house-sharing, doubling-up runs 6%+ vs 2% baseline (HUD/AHS, Census
SEHSD-WP2011-04). Table: 1p 8% / 2p 26% / 3p 28% / 4p 22% / 5p 16%, capped at
Dunbar's support clique. One table, every number sayable out loud.

*** G1 IS RED AND IT HAS AN OWNER. DO NOT "FIX" IT BY SOFTENING IT. ***
The headcount is fixed at 298, so bigger households mean FEWER DISTINCT HOME
LOCATIONS and the nearest affiliated person to any spawn gets further away.
CONNECTION BOUGHT WITH COVERAGE -- arithmetic, not a bug.
ISOLATED, NOT GUESSED: same gate, same seed, main's city -> 92/0 GREEN; with
households -> red. AND A NARROWER SPAWN PROBE SHOWED THE TWO BUILDS IDENTICAL
(4 drawn, 0 affiliated either way), which is exactly why it had to be RUN both
ways instead of reasoned about. An earlier attempt at that A/B was worthless --
stashed a CLEAN tree, so both sides measured the same build, and it would have
reported a fake regression.
THE FIX IS WHERE PEOPLE LIVE and it is HIS: seed a couple of affiliated
households near the spawn, or raise the population, or raise AFFILIATED_RATE
(33 of 298, already [PENDING]). ASKED, NOT DECIDED.

ALSO SHIPPED: F3 asserted string EQUALITY where the claim was CONTAINMENT --
the card reads "BE INTRODUCED BY SOMEBODY WHO VOUCHES · ASKING COSTS: ..." and
the rule is the first half, verbatim. Latent since the asking-cost row shipped;
only fires when a roster puts a MOB member in the un-asked state. Pushed to main
ON ITS OWN, ahead of the change that surfaced it.

TRAP WORTH CARRYING: TWO OF MY OWN A/B RUNS WERE VOID AND LOOKED FINE. One
stashed a clean tree; one copied the city to /tmp and broke its relative assets.
A COMPARISON THAT DID NOT ACTUALLY COMPARE LOOKS EXACTLY LIKE A NULL RESULT.
Assert the two sides DIFFER in the way you set them up to differ, before
believing what they tell you.

--------------------------------------------------------------------------------
--------------------------------------------------------------------------------
