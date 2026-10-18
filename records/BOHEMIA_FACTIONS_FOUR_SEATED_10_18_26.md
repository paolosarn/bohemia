# FOUR SEATED: THE KEEPERS, THE EYE IN THE SKY, THE BLOCK WATCH AND THE RUNNERS GET A SEAT
FACTIONS lane, round 66, 10/18/26. Row [four seated] (THE-KEEPERS-THE-EYE-THE-WATCH-AND-THE-RUNNERS-GET-A-SEAT),
written by this lane from its jump list after [home bases]: rule 42a (9/29) and rule 37e (Paolo 9/27: 'MANY ROAMING
PARTIES'). Opened by the coordinator under rule 112; no check-in, no question; Opus 5.5 Extra, no extra usage (rule 116).
The lane is under the rule-88 hold (pages without sheets): data, an engine change nothing live calls yet, gates, this
page. Nothing drawn, nothing in VOTE, nothing in the demo. NOT IN A TAB.

## THE ONE-LINE ANSWER
Every one of the twelve factions now has a real seat on WORLD's real land or a written Battle Brothers reason for
having none, and all five that had a want and no seat now move parties: the keepers camp at Corn Creek, the runners
at Valley of Fire, the eye in the sky holds Lake Las Vegas, the house holds the Apex depot, and the block watch has
no seat on purpose and turns out wherever a crew is going.

## MEASURED FIRST (before a line was written)
- The row named four. MEASURING FOUND SEVEN: of factions.json's twelve, only the road crews, the dead, the beasts and
  the water people held a region row, the hired guns roamed without one, and the house, the head takers and the flock
  were in the same state as the row's four: a roster, a ground and a want, no seat, no reason. Through
  BohemiaWants.all on the real valley (seed 12345) plus the region's rows, NONE of them sent a single party.
- THE EIGHT OLDER WILD ROWS ARE NOT ON THE REAL LAND. They were bearings in RUN's round-one frame, laid before WORLD
  wrote the real region (engine/BOHEMIA_REGION_LAND.json, 384 m a block, 34 real places). Read against it, each sits
  16 to 68 blocks from the real place it names (Nelson 68, Railroad Pass 56, Jean Dry Lake 48, Sloan and Gypsum Cave
  40, Apex and the Lost City 32, Tule Springs 16) and seven of eight stand on ground their own faction does not hold
  (the Gypsum Cave lair is inside the lake's district; the Jean Dry Lake nomads are on the McCullough Range). This is
  the finding that proves us wrong, and it is the next row: [real camps].
- THE PARTIES MODULE SENDS CARAVANS TO A BEAST'S DEN. Handed a settled seat beside the wild rows, its other parties
  went by friendliesOf(), which counts every seat between() has never heard of as a friend; the eye's first draft sent
  a caravan to the Tule Springs den. Battle Brothers' city states send 'caravans to trade with other settlements', so
  a settled seat's spare parties now trade only with settlements (engine/bohemia_wants.js, the rest-of-business line).

## THE SEATS (records/target/bb/region_bases.json; every block read off WORLD's land by the REGION BASES gate)
| faction | name | seat (row id) | WORLD's place, block, ground | kind of seat | sends | Battle Brothers |
|---|---|---|---|---|---|---|
| barbarians | The keepers | corn_creek_keepers | CORN CREEK, (4,-42), open_desert, one block below the springs | wild camp | 1 crew (feed-the-herd) | 'groups of wildmen roaming the northern parts of the map'; 'you'll get to see barbarian camps and villages'; Drive Away Barbarians: 'Destroy an enemy camp.' |
| goblins | The runners | valley_of_fire_runners | VALLEY OF FIRE, (199,-38), lot_and_bigbox, the place's own block | wild camp | 1 crew (hit-and-run) | 'Goblins live in the lands beyond the reach of human civilization'; 'Destroy an enemy camp or lair.'; Goblin Land: 'The next settlement is 11 or more tiles away' |
| city_states | The eye in the sky | lake_las_vegas_eye | LAKE LAS VEGAS, (103,57), golf_and_park, the place's own block | settled fortress | 1 patrol (guard-the-money) + 2 caravans | 'They dot the southern deserts where water is to be found, reigning over a precious resource'; 'not ruled by nobility, but by wealth'; 'send regiments to patrol surroundings, and caravans to trade with other settlements' |
| noble_houses | The House | apex_depot_house | APEX, (103,-21), industrial, the place's own block | settled fortress | 1 patrol (hold-the-depot) + 2 caravans | 'the house which controls one can be identified by the flag they wear'; 'They send Supply Caravans, guarded by their troops.' |
| militia | The block watch | NONE, on purpose | every town and camp a crew is going at | turns out | 1 watch per threatened place | 'Each non-military settlement is a separate faction... when enemies come close, can send militia squads'; 'Militia forces can be gathered when a hostile party is sighted close to a settlement and disbanded again after the threat disappeared.' |
| bounty_hunters | The head takers | NONE: roaming_without_a_base head_takers | the road crews' camp a contract sends you to | roams | 1 (ours, draft) | 'Bounty Hunter is a dangerous enemy you sometimes encounter doing Drive Away Bandits contracts.' |
| cultists | The flock | NONE: no_seat | where an event or a quest puts them | met in events | 0 | 'You can encounter Cultists only in the Religious Peasants and Come Across Ritual events.' |
The eye's ground is the casino floor and WORLD's region legend has no casino floor (it is a valley ground only), so the
eye stands on the real place's own block; the gate allows exactly that case and no other.

Why these places, in the real world:
- CORN CREEK is the field station of the Desert National Wildlife Refuge, set aside in 1936 to keep the desert bighorn
  herd. The keepers keep the lab's herd. It is 35 blocks up the wash from Tule Springs, the lab the herd broke out of.
- VALLEY OF FIRE is red sandstone with slot canyons, one road through it and nobody living for twenty miles. Bikes and
  quads in, out and gone: an ambusher's ground, past the reach of every town.
- LAKE LAS VEGAS is a private lake made by damming the Las Vegas Wash: three hundred acres of water in the desert,
  gated resorts and a casino round it, built for the rich. A city state is where the water is, ruled by money.
- APEX is the industrial park where I-15 meets US-93, the truck yards and the rail spur where the freight turned off.
  The house wants the depot; the depot is its fort.

## THE WATCH (engine/bohemia_wants.js turnOut, read off records/target/bb/wants.json keep-the-block turns_out)
- Battle Brothers' militia have NO seat: they are the settlement's own people, gathered when a hostile party comes
  close and disbanded after. 'Close' is no number on the wiki, so OURS is the crew's own mark: every TOWN or CAMP a
  crew is going at gathers ONE watch party standing on the place, wearing the watch's banner and saying whose place
  it defends (defends) and which crews it turned out against (against). Never at a fortress (soldiers), never at a
  wild seat (no townsfolk), never against its own crew or at its own place.
- BohemiaWants.all now appends the watch after every seat's parties; each watch party says turned_out:true so any
  reader can tell it apart. The valley alone (seeds 12345, 7, 999) turns out none: its crews go at fortresses.
- The disband (the crew gone, dead or settled) is RUN's clock; how many men a watch has ('A rich town can field more
  militia than a poor town') is COMBAT's enemy_tiers.

## WHAT MOVED (seed 12345, the valley's fourteen seats plus every region row, through BohemiaWants.all)
- BEFORE (the four and the house removed): 62 parties, 4 of them watch; of the five, only the watch moved.
- AFTER: 70 parties, 4 of them watch; all five move.
  - the keepers: a crew at the valley's Reds downtown (the nearest place);
  - the runners: a crew at the eye's casino on Lake Las Vegas (the shortest trip by way of a lot);
  - the eye: a patrol to the Strip, caravans to the Anarchists' and the Homeless's suburbs;
  - the house: a patrol to the nearest depot ground, caravans to the Volunteers' medical camp and the Church's chapel;
  - the watch turns out at JEAN for the Cartel (five crews: the Caravans' and the Remnants'), HENDERSON for the Trades
    (the road crews), SEARCHLIGHT for the Reds (the dead) and the valley's Reds downtown (the keepers).
- The file's REACH count: parties at once 59 -> 68 (valley 28, the twelve places 21, the locations 19: ten wild 11,
  two settled 6, two companies without a base 2). Factions holding region rows 4 -> 8; with a seat or a reason 12/12.
- The ledger seeds 24 region ids now (12 places, 10 wild, 2 settled): a take at Lake Las Vegas writes from:'city_states',
  at the Apex depot from:'noble_houses' (engine/bohemia_homebases.js setRegion reads settled_locations; the inlined copy
  in slices/BOHEMIA_CITY_WORLD.html swapped between its banners and compared byte for byte).

## WHAT IS OURS (marked in the data, his to correct)
- Each seat's choice of real place, the 'why' lines, the watch's trigger (the crew's mark, not a distance), the head
  takers' one-at-a-time, the eye standing on the resort's park because the region has no casino floor.
- FOR TUNING (rule 117, easier than Battle Brothers): the keepers' camp is 65.5 blocks from the nearest settlement and
  the runners' 84, both past this file's far_blocks 60, so by its own rule they field their LATE make-ups from the first
  day (the keepers' late roster has the beastmaster and the armoured unhold). TUNING decides whether that stands.

## THE GATES (all run on this tree; the full suite unmeasured since bff24e05, rule 13)
- REGION BASES 332/0 (was 247): settled locations held to their own shape; the totals recount them; NEW SECTION 4,
  THE FOUR SEATED: every rule in one function read off WORLD's real land (the place exists, the seat is within one
  block, the block can be stood on, it is the row's ground and its faction's own or the place's own block where the
  region has none of it, base.seat names the row, a city or a house is a settlement, a camp in the wild sends crews, the
  wildmen are north of the city, Goblin Land is 11 or more from a settlement, the watch has no row, a no-seat row says
  why with a wiki line, a faction without a seat says seat:null, the counts are the rows), nineteen planted mistakes
  each red by its own name; prints every wild row's place on WORLD's land; measures BEFORE and AFTER through
  BohemiaWants.all.
- WANTS SEND PARTIES 181/0 (was 153): legs C and D tell the turned-out watch apart; NEW LEG I: each seated faction's
  seat sends REACH[tier] with its want's party first, settled seats trade only with settlements, the watch turns out at
  every town or camp a crew goes at and nowhere else, stands on the place, names every crew, the data file drives it
  (no turns_out, no watch; tiers to fortress, the watch moves), and four probes for cases the real map never makes.
- HOME BASES 168/0 (was 167): the settled seats are held by their own factions from an empty ledger.
- NINE MODULE MUTATIONS, each undone one at a time, every one red (tiers ignored, a wild seat, one watch per crew, all()
  without the watch, a settled seat trading with a den, the watch in the place's banner, the second crew forgotten,
  the watch against itself, the ledger forgetting the settled seats).
- Also green: FACTIONS 1060/0, TAKE A TOWN 185/0, ARRIVAL TRAITS 45/0, WAR 39/0, BUILD A LOT 62/0, RELATIONS 66/0,
  HUNTED 35/0, VALLEY GROUNDS 43/0, LANGUAGE 85/0, THE ONE RULER 33/0, THE ARRIVAL 37/0, A RAID ON YOUR BASE 18/0,
  FACTION DOSSIERS (16, 9/9 probes), ENGINE SYNC holds (19 modules, zero drift).
- RED ON MAIN BEFORE THIS DIFF, NOT MINE (each re-run on a clean worktree of bff24e05, identical): INLINED FRESH 0/1
  (engine/bohemia_followers.js has no closing banner, PEOPLE), GATE REGISTRY 6/1 (an unregistered gate file, not one of
  mine), ONE THEN HEIRS (six fails in the act-2 hop on the page).
- REAL SURFACE: slices/BOHEMIA_CITY_WORLD.html in headless Chromium at 390 x 844, 0 page errors; setRegion(json) seeds
  24; the keepers, the runners, the eye and the house read as held by their own factions; Henderson still the Trades.

## ROUTED
- RUN: hand settled_locations in beside hostile_locations (same row shape, wild:false) to the parties and the ledger;
  swap BohemiaParties.all for BohemiaWants.all so the watch turns out; disband a watch when the crew that gathered it is
  gone; the four new markers wear their banners (school.the_flag_says_who).
- COOK FOUR: four pictures (the keepers' camp below the springs, the runners' lot in the red rock, the eye's gated lake,
  the house's walled truck yard).
- COMBAT: how many men a watch turns out with (Battle Brothers: a rich town fields more).
- TUNING: far_blocks 60 puts the two new camps on their late rosters from day one (rule 117 is yours); one head-taker
  party at a time.
- WORLD: nothing to change; WORLD's 34 real places are the seats now. [real camps] will ask whether the
  twelve places follow WORLD's places too (HENDERSON is inside the valley box in WORLD's land and MESQUITE past the rim).

## [bb four seated] SCHOOL LINE
Battle Brothers never gives a faction a seat for decoration: houses hold forts, city states hold the water, wildmen and
goblins keep camps a contract sends you to, militia are the town itself, bounty hunters and cultists live inside a
contract or an event. We copied that, and found two things it does not do: it never seats a faction on a real map,
and it never shows the town's own people turning out; ours does both, from one data file a modder can edit.
