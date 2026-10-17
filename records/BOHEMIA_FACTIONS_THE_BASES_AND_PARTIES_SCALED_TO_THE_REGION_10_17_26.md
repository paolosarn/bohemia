# THE HOME BASES AND THE ROAMING PARTIES, SCALED TO THE REGION
FACTIONS lane, the 10/16 big swing (rule 110; the job on the MODE line from rule 109d). 10/17/26. MODE: a page and a data file under the rule-88 hold (pages without sheets). No VOTE sheet, nothing into the demo, nothing wired.

> **PAOLO 10/16:** *"our map has to be as big as fucking Battle Brothers and that's still not the case... I don't know if we need to break the grid and have more grids... I'm choosing Battle Brothers."*
> **Rule 109(d):** *"FACTIONS' bases and parties scale to the region."*

## The thing (one line)
The map grew from a 96 by 96 valley to a 496 by 496 region with twelve real places on it (RUN, 10/16). This round says WHO HOLDS each of the twelve, puts EIGHT WILD LOCATIONS out there the way Battle Brothers puts camps, crypts and lairs in its wild, and counts what the region SENDS, in the exact row shape the parties module already eats, so the region fills with parties the same minute RUN hands it the rows.

## Measured first (rule 12)
- **RUN's region** (slices/bohemia_region.js): twelve places by real bearing from the city, pulled onto a road or open ground by RUN's placer; 26 settlements against Battle Brothers' 17; the camera and the walk out are RUN's. The places are destinations "with nothing of their own yet" (RUN's record). Nothing out there belonged to anybody and nothing out there sent anybody.
- **The valley's parties** (live, seed 12345): 28 from the fourteen seats, 14 patrol, 10 caravan, 4 crew. REACH (fortress 3, town 2, camp 1) is the rule that makes the number, off engine/bohemia_towns.js.
- **The parties module takes a region row as it is.** Fed three region seats beside the valley's fourteen it sent six more parties, REACH each, at region coordinates, without a line changed. So the data file's job is to BE those rows.
- **One defect found by that test, named not patched:** a wild location (a road crew's hideout, faction `brigands`) handed to today's module sends CARAVANS, nine of nine, because hostility is read only off BohemiaBetween.between() and the canon graph has no brigands, dead, beasts or nomads: an unknown faction reads as a friend. The rows carry `wild: true` so the fix has its field: in hostilesOf, a town with `wild` is hostile to every settlement (init -1), one line in WORLD's file. Routed to WORLD [parties move] and RUN. The count is right today; the agenda is not.

## The school (every line quoted in the data file and read back by the gate)
- **17 settlements per map** (2 city halls, 3 town halls, 6 village halls, 2 strongholds, 2 castles, 2 fortified manors), split among the houses 6/6/5 up to 10/5/2 (Global Map).
- **Camps in the wild** are revealed by contracts and exploration and "can be pillaged and destroyed" (Global Map). Hostile locations are brigand hideouts, orc and goblin camps, undead crypts, beast lairs, ruins (library 01).
- **Fortified settlements spawn patrols** "which secure the streets between the settlements of their house"; a castle's watchtowers "also spawn soldiers"; **towns spawn caravans** "from time to time" (Factions and Relations).
- **Every location sends parties**, "although smaller locations do so less and in fewer numbers, and some factions may be more passive than others"; factions are "most active near their territory" (dev blog). **The undead** "are generally content sitting in their crypts and guarding their treasures."
- **A location buys parties out of resource points**, is weaker while they are out, and **re-draws its whole roster every 10 days**; **locations do not respawn**; an active one that does well **founds a daughter in the same area**, never across the map (Developer Posts).
- **Fewer roaming parties in the civilized part, on purpose**; the wild has more (Developer Posts). **Difficulty of non-contract locations and roaming parties scales with distance to civilization and time** (Game Mechanics).
- **Brigands** live in the hills around the settlements and hide beside roads; **nomads** move from water to water; **beasts** roam; **rival mercenary companies** roam and take contracts (their pages).
- **No fixed count of parties at once**: it is emergent (library 01, sourced 9/28).

## Built: records/target/bb/region_bases.json (the data file) and gates/region_bases_gate.js (REGION BASES, in the suite)
### The twelve places, who holds them, and why (each holder from his own faction notes and the real place)
| place | tier | holder | the real place and the reason |
|---|---|---|---|
| HENDERSON | town | Trades | the BMI industrial complex; the skilled-worker guild's plant town |
| BOULDER CITY | town | Church | the federal company town, dry and orderly by law; the crisis organizers keep order |
| HOOVER DAM | fortress | Network | the grid's source; [light owners] 9/6: the Network holds the lit grid |
| LAKE MEAD MARINA | camp | Anarchists | the valley's water comes out of the lake; 610805d: the Anarchists hold all the live water |
| JEAN | camp | Cartel | the closed prison on the I-15 exit south; the Cartel taxes the Caravans' road (the graph: prey-tax) |
| PRIMM | town | Caravans | the state line; outside-world trade's south door |
| SEARCHLIGHT | camp | Reds | the gold mines; the compound-interest faction's bought-cheap holding |
| INDIAN SPRINGS | fortress | Remnants | Creech, the drone base; "military drones, incl Nellis" |
| MT CHARLESTON LODGE | camp | Blues | the only forest for a hundred miles; the environmentalists' mountain |
| PAHRUMP | town | Mob | casinos and legal brothels over the hump; tribute business |
| MOAPA | camp | Volunteers | the reservation's river farms; the camp nobody wants to be seen attacking |
| MESQUITE | town | Caravans | the north door on I-15; a house holds several settlements (6/6/5) |

Eleven of fourteen factions hold region ground; the Caravans hold two (both doors). Colorful, Homeless and Custom hold none, by their own notes (community not territory; the sewer HQ under the city; the player). The gate refuses a holder past the wiki's lopsided share (10 of 17).

### The eight wild locations (Battle Brothers' camps, crypts and lairs, in our skins)
| location | kind | faction | agenda | the real place |
|---|---|---|---|---|
| ROAD CREW AT RAILROAD PASS | hideout, camp | brigands | crew | the pass US-93 climbs between Henderson and Boulder City; brigands in the hills beside the road |
| ROAD CREW AT SLOAN QUARRY | hideout, camp | brigands | crew | the quarry beside I-15 south; the crew's want is the freeway |
| THE DEAD AT APEX LANDFILL | ruin, camp | zombies | crew | the regional landfill north on I-15; the dead hold ruin and landfill; the one FAR location (71 blocks), late mix from day one |
| THE DEAD AT NELSON | ruin, camp | zombies | crew | the Eldorado Canyon ghost town and its mine |
| THE LOST CITY | crypt, town-sized | ancient_dead | patrol (holds) | the Puebloan town the lake drowned near Overton; the dead sit in their crypt |
| THE DEN AT TULE SPRINGS | den, camp | beasts | patrol (holds) | the fossil beds, the lab's site (beasts law s3) |
| THE LAIR AT GYPSUM CAVE | den, camp | beasts | patrol (holds) | the sloth's cave east of the city; the sloth is the Unhold's rule in an animal's skin (s6) |
| THE NOMADS ON JEAN DRY LAKE | camp | nomads | crew | the playa by the prison; the desert's people, water to water |

Plus one **rival company** roaming without a base, hired off a settlement's board (ours, draft, one at a time in act one).

### The four numbers for bases and parties (rule 109c's shape; the gate recomputes every one)
| | ours | Battle Brothers |
|---|---|---|
| settlements | **26** (14 valley seats + 12 region places) | 17, parsed off the wiki page by the gate |
| wild locations | **8** | the wiki does not say |
| parties at once | **59**: the valley's 28 (counted live) + 21 from the places (REACH over their tiers) + 9 from the wild locations + 1 rival company; **58 counted live** when the rows are handed to the real parties module beside the valley's seats | no published count; emergent (a location buys parties out of what it has) |
| crews (the hostile kind) | valley 4 of 28, region 5 of 9: more trouble the farther out | "reduced in the civilized part on purpose" |

### The rules (Battle Brothers' where quoted; ours marked ours and draft, for TUNING's table)
- A place sends REACH[tier] parties: the valley's own rule, the wiki's "smaller locations do so less and in fewer numbers".
- A wild location is a seat whose parties are crews; the dead and the beasts hold (patrol) off "content sitting in their crypts" and "beasts roam the lands".
- **Far from civilization fields the late mix** (ours: 60 blocks, the map's own distance to the nearest held settlement; wiki: "scales mostly with distance to civilization and time"). The gate computes the band for every wild row and prints it: Apex is the only far one on the real map. I had guessed Nelson far and the measurement said 46 blocks from two towns; the file was corrected to the number, not the number to the guess.
- The roster turns over every 10 days (wiki).
- A location that does well spreads: after 3 raids home (ours) a daughter within 24 blocks (ours: the ring RUN's placer already searches), never across the map, never a respawn (wiki).
- A base that fell sends nobody: the ledger the fourteen already obey (engine/bohemia_homebases.js), applied to every row by handing it the same rows.

### The gate: REGION BASES, 244 checks, red 32 ways by mutation of the data file
The school is real (every quote read back out of the tarball; the 17 parsed, never typed); the two files cannot drift (the twelve places repeat RUN's TOWNS name, bearing and tier for tier; a RUN place with no holder, or a place RUN does not draw, is red); the numbers are recomputed (REACH read off the towns module; the valley's 28 and 4 crews counted live; the region's rows handed to the real parties module and counted; a typed Battle Brothers party count is red); the shape (a holder is a selectable canon faction and never the player; no holder past 10 of 17; a wild row's faction and every unit id are enemies.json's and belong together; inside the region, outside the city, marked wild; the dead and beasts hold and the crews raid; a marker field is never a sentence, 37e; every ours number is draft and named for TUNING; the between gap written in the file, not hidden; the gaps and the routing named). The 32 mutations each went red on the line that names them (drift a bearing, drift a tier, drop a RUN place, add a place RUN does not draw, the player holds a place, an unknown holder, a fourth agenda, a sentence in a marker field, one faction holds everything, a fake quote, type the wiki count, a wild row inside the city, off the region, not marked wild, a unit from another faction, a unit that does not exist, a faction not in enemies.json, the dead sent raiding, a mix not marked ours, lie about the place count, the total, the valley, type a BB party count, lie about the crews, hide the gap, an ours number not for TUNING, not draft, a rule with no wiki line, drop the gaps, drop the routing, settlements short of the wiki, the far line not ours).

## Different from Battle Brothers (rule 80)
Battle Brothers' wild camps are nameless and could be anywhere; ours are the real places people from here know (Railroad Pass, Sloan, Apex, Nelson, the Lost City, Tule Springs, Gypsum Cave, Jean Dry Lake), each on the ground that made it what it is, and the lairs are where the bones were dug up, because the beasts came out of the lab at the fossil beds. A faction's region holding comes from his own note on the faction, so a player who knows the Network holds the lights can guess who holds the dam before the map tells him.

[bb: a location is a bank of resource points that buys parties and is weaker while they are out; the wild is where the trouble roams and the civilized part is quiet on purpose; locations never respawn, they spread (Developer Posts, Dev Blog on 1.4, Game Mechanics)]
Analog horror: the wild locations are ordinary places with their signs still up (a casino at the pass, a quarry's gate, the landfill's scale house, a museum on the shore) and something living in them that should not be; the horror is the familiar place, not a monster drawn on it. COOK FOUR's pictures when the hold lifts.

## The turn (rule 95.1; the coordinator's 10/11 note: mark the rows SHIPPED with the record path or OPEN with two lines)
Eight CLAIMED rows were past their third sweep. All eight shipped data, a module, a gate and a record on their own date and were never re-marked; none is being handed back. Marked SHIPPED on the board with their labels, Paolo's citations and record paths kept (rule 11): [a house you give a fuck about], [the parties on the map], [beef] (relations), [raids make traits], [beef] (a settlement comes for you), [who guards], [houses at war], [faces meet again]. The LEFT clauses (RUN's clock, RUN TWO's screens, PORTRAIT's faces, WORLD's GUARDED_BY) stand as routing.

## Not built, said out loud
- Nothing draws a region marker, nothing sends a region party, nothing saves a region ledger: RUN hands the rows (the routed block in the file says the exact shape) when the hold lifts; this lane wires nothing under rule 88.
- The greenskins and the barbarians have no Bohemia skin yet; no location fields them. The City States are not in the canon graph. The beasts law's roster gate is still owed by COMBAT.
- A region party's fight roster for a canon faction is COMBAT's enemy_tiers by tier; the file names units only for the wild locations whose faction is Battle Brothers'.
- The sight radius ([the sight numbers]) is the next OPEN row and was not touched.

## Routed
- **RUN:** build seats from region_places and hostile_locations (faction = holder or faction, tier, kind, x = mid + east, y = mid - north, power = the holder's act power or the tier rank) and pass them to BohemiaParties.all beside the valley's; hand the same rows to BohemiaHomebases; a crew that reaches a region place leaves it Raided (arrival traits).
- **WORLD [parties move]:** hostilesOf treats a `wild` town as hostile to every settlement (one line); until then a wild row sends caravans.
- **WORLD [the region]:** the ground kinds under each row (the fifteen terrains); **COOK FOUR:** a picture per place and per wild kind (hideout, ruin, crypt, den, nomad camp); **TUNING:** 60, 3, 24, one rival company; **EYES [the map's four numbers]:** 26 beside 17, 59 beside "no published count"; **COMBAT:** the Unhold's rule for the sloth, the real mixes for the ancient dead and the nomads.

## Gates run (rule 13: the pre-push pass, by name)
REGION BASES 244/0 (new), FACTIONS 346/0, HUNTED 35/0, WAR 39/0, ARRIVAL TRAITS 45/0, RELATIONS 66/0. Red on main before this diff and not mine: HOME BASES 141/1 (slices/BOHEMIA_CITY_WORLD.html reads the superseded cell ledger: a dead shape returning in somebody's slice, named for the coordinator), GATE REGISTRY 5/1 (66 orphan gate files, none this lane's; REGION BASES is registered), OPEN ROW 8/1 (RUN TWO short of three). Full suite unmeasured since 037d784.
