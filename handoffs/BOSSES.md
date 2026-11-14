# BOSSES (written only by the BOSSES lane)

## BOSSES, 11/14/26: THE TOOTH'S COLLECTORS, HIS OWN WAY (the coordinator's round 'BOSSES turn up', rules 441, 447; ask lines 167, 522, 571), BUILD 11/14n
Record: records/BOHEMIA_BOSSES_TEN_TO_TWELVE_11_14_26.md. Gate: "THE TOOTH" (THE TOOTH CHANGES THE MAP, registered; 21/0 both ways). VOTE bosses-the-tooths-collectors-11-14.
- HIS COLLECTORS (19): at the gates of the 3 towns nearest his chair; 3 batteries off the purse as the crew comes OUT of one, once a day
  per town (a debit while a town's screen is up is undone when the town hands the map back its purse: ECONOMY / RUN, worth knowing for
  any lane that charges inside a town). When he falls: gone, and what they took is credited back once.
- FIX A TOOTH (verb 'fix'): the worst fresh wound in the crew closes, once a day; FIRST in the verbs' order (the phone shows one verb).
  The ladder says main-quest weight on Paolo's ruling: until he rules, this is the draft. CHARACTER / COMBAT: it sets that man's
  BohemiaCondition wound to null, nothing else.

## BOSSES, 11/14/26: THE PLATE'S WAGON, HIS OWN WAY (the coordinator's round 'BOSSES turn up', rules 441, 447; ask lines 167, 522, 571), BUILD 11/14h
Record: records/BOHEMIA_BOSSES_TEN_TO_TWELVE_11_14_26.md. Gate: "THE PLATE" (THE PLATE CHANGES THE MAP, registered; 21/0 both ways). VOTE bosses-the-plates-wagon-11-14.
- THE NEXT THREE'S ASSETS SHIPPED WITH THIS BUILD: the three men (tools/bohemia_bosses_ten_to_twelve_11_14_26.py, packed own_kit), their
  places, marks and pieces (tools/bohemia_bosses_ten_to_twelve_places_11_14_26.py), the three things (hand_press, hand_fix, hand_look); and
  the code of all three ((18) HIS WAGON, (19) HIS COLLECTORS, (20) HIS BLUR, verbs press, fix, look), inert until each one's row ships.
- HIS WAGON (18): back and forth along its road with the game's own clock (clockMins: T.day*1440+T.min), the block it stands on shut
  through cityWalkable's bosses wrapper; stripped and parked when he falls. PRESS ARMOUR: his row's 'item' (a PRESSED PLATE) into
  bohemia.bag.v1 once a day next to scrap, ordered before WELD.
- ECONOMY / TUNING: a free 75-durability plate a day next to scrap is his row's to tune (cooldown_days, item). COMBAT TWO: his board
  'landfill', BB's Two-Handed Mallet.

## BOSSES, 11/14/26: ROW 611, THE CARD WAITS ITS TURN (the coordinator's round 'BOSSES turn up', rule 447, 441), BUILD 11/14a
- slices/bohemia_bosses.js townTurn(): a boss card (asker, sign read out, after) waits while the walk goes into a town (TRAVEL.town), for
  6 s after it (the gap before the town's screen shows), while the town's screen is up and for 4 s after it closes. talk(): the card's
  layer (#roadcard, CONTENT's) lets taps through for its first 500 ms, so a tap meant for a building never answers her.
- Gate: gates/the_card_waits_its_turn_gate.js (THE CARD WAITS ITS TURN, registered), 10/0 both ways, two plants. FIXES 2: row 611 is closed.
- CONTENT: your other cards (road events) can take the same first-beat guard if EYES finds them eating a tap; I touched only the cards this
  file opens.

## BOSSES, 11/11/26: THE MACHINIST'S NAILS, HIS OWN WAY; THE ROUND DONE (the coordinator's round 'BOSSES next round', rule 441; ask lines 167, 522, 571), BUILD 11/11v
Record: records/BOHEMIA_BOSSES_SEVEN_TO_NINE_11_11_26.md. Gate: gates/the_next_three_change_the_map_gate.js "THE MACHINIST" (THE MACHINIST CHANGES THE
MAP, registered; the demo upright 23/0, the alpha on its side 23/0; five plants). VOTE bosses-the-machinists-nails-11-11 (stand_in).
- HIS NAILS (slices/bohemia_bosses.js (17); his 'nails' row: 14 blocks within 4, slow 3, fast 0.6): every nailed block costs the walk 3
  times the map's own minutes (cityStepMins wrapped, the way cityWalkable is: the walk by minutes and the clock both read it). WHEN HE
  FALLS they are swept and the same blocks are his carts' road at 0.6 times the minutes for good. WORLD TWO opens THE PIPE SHOP (yours).
- WELD A PIPE GUN (verb 'weld'): next to scrap (industrial, storage, arsenal, boneyard, landfill, junkyard), once a day: his row's 'item'
  (PIPE GUN, the Handgonne's numbers, draft) into bohemia.bag.v1, or YOUR BAG IS FULL. HIS PIPE GUN to your place through HOME BASE's seam.
- JOBS / RUN: cityStepMins now has a bosses wrapper on top of yours (it multiplies only his nailed or swept blocks; BohemiaJobKinds.pace
  still inside). ECONOMY / TUNING: a free pipe gun a day next to scrap is his row's to tune (cooldown_days, item.price 120).
- THE ROUND IS DONE: all three of the ladder's 7 to 9 shipped one build each (11/11n, 11/11r, 11/11v), each both ways, each a VOTE card.
  NEXT on the ladder: 10 to 12 (records/BOHEMIA_THE_BOSS_LADDER_v7_8_7_26.md), the same pipe (model tool, places tool, a section, a leg).

## BOSSES, 11/11/26: THE CHARGE'S MINES, HIS OWN WAY (the coordinator's round 'BOSSES next round', rule 441; ask lines 167, 522, 571), BUILD 11/11r
Record: records/BOHEMIA_BOSSES_SEVEN_TO_NINE_11_11_26.md. Gate: gates/the_next_three_change_the_map_gate.js "THE CHARGE" (THE CHARGE CHANGES THE MAP,
registered; the demo upright 22/0, the alpha on its side 22/0; six plants). VOTE bosses-the-charges-mines-11-11 (stand_in).
- HIS MINES (slices/bohemia_bosses.js (16); his 'mines' row: 5 cans 2 to 5 out, the sign's way in first, spotted within 3, Pierced Leg
  Muscles 4 days 20 blood): by day a mine beside the crew or down the street in sight is spotted for good, drawn, and the map's own walk
  goes round it (never where that cuts the crew off from him); at night one nobody spotted goes off under the walk: the walk stops, one man
  (never the main man; the man who walks with you if nobody is on the books yet) takes the wound through BohemiaCondition, the radio posts
  it. WHEN HE FALLS every can is dug up, kept after a reload.
- BLOW A HOLE (verb 'blow'): beside a wall between two streets where the walk through is at least 3 blocks shorter, once a day: the block
  is walked for good (cityWalkable's bosses wrapper: shut, locked, a spotted mine, then a hole you blew). The phone shows one verb, the
  order's first: beside a shop PICK THE LOCK takes the button (UI: if the band ever shows two, BLOW is ready for it).
- COMBAT TWO: his board 'canyon', BB's Two-Handed Hammer, a raider, a thug, a marksman. TUNING: the counts are his row's. CHARACTER /
  COMBAT: a mine writes one man's wound into BohemiaCondition the way a fight's end does (lostHp, wound {mark, left, of, day}).
- THE GATE'S NIGHT FOR A WALK (any lane): T.min alone lasts one step; set the day's clock (DAY.min = 18*60+10; daySync()) for a walk
  taken at night.

## BOSSES, 11/11/26: THE LOCKSMITH'S GATES, HIS OWN WAY (the coordinator's round 'BOSSES next round', rule 441; ask lines 167, 522, 571), BUILD 11/11n
Record: records/BOHEMIA_BOSSES_SEVEN_TO_NINE_11_11_26.md. Gate: gates/the_next_three_change_the_map_gate.js "THE LOCKSMITH" (THE LOCKSMITH CHANGES
THE MAP, registered; both ways: the demo upright 21/0, the alpha on its side 21/0; five plants). VOTE bosses-the-locksmiths-gates-11-11 (stand_in).
- THE NEXT THREE'S ASSETS SHIPPED WITH THIS BUILD (rule 337): the three men through BOSSES 4's pipe (tools/bohemia_bosses_seven_to_nine_11_11_26.py,
  BOSSES 4's tool imported and never edited; packed own_kit as boss_locksmith_0, boss_charge_0, boss_machinist_0, purple 0.0%); their places,
  verb marks and map pieces (tools/bohemia_bosses_seven_to_nine_places_11_11_26.py: lockshop, powderyard, pipeshop, cutlock, rubble,
  weldbench, curfew night/day/after, mine, nails); the three hand things (hand_pick, hand_blow, hand_weld). THE CHARGE and THE MACHINIST
  have no data row yet, so nothing of theirs shows until their builds.
- HIS GATES (slices/bohemia_bosses.js (15); his 'curfew' row: 4 gates, 2 to 7 blocks out, each at least 4 blocks of detour): the clock
  decides the roads. Open by day; chained at night and the map's own walk goes the long way round (cityWalkable's one bosses wrapper:
  shut, then locked). Never cuts a way: with every gate shut the crew still reaches his shop and every town, no block near his shop is
  left in a pocket between two gates (measured on the demo: two gates on one street locked the blocks between them till morning; the
  choice now refuses any pocket, and K2 checks it), and the block the crew stands on is never shut under it. WHEN HE FALLS the chains are
  cut and the roads stay open all night, kept after a reload.
- PICK THE LOCK (verb 'pick'): beside a police station, a jail, a shop, a mall, a storage yard; once a door; 8 batteries. HIS PICK SET goes
  to your place through HOME BASE's seam (section 14, as for THE BURN, THE SURVEYOR, THE CLIMB).
- WORLD TWO: his sign is your boss_map row 7 (the scratched padlock, falls wall:1); nothing of yours touched. TUNING: 4 gates, 4 blocks
  of detour, 8 batteries a door, his 1.6 blood are in his row. COMBAT TWO: his board is 'place_downtown', his crew two thugs and a
  caravan guard, his weapon BB's Bike-Lock Chain. HOME BASE: 'prize:pick' is yours too, the same agreement as the three before.
- NEXT: THE CHARGE (his mines: spotted by day, they go off at night; BLOW A HOLE) and THE MACHINIST (his nails: three times the minutes,
  his carts' road after; WELD A PIPE GUN), one build each.

## BOSSES 445, 11/10/26: WHAT THE BOSSES GIVE STANDS IN HIS SETTLEMENT (rule 445, ask line 571), BUILD 11/10z
The coordinator's routine 'BOSSES: prizes land in his settlement'. Record: records/BOHEMIA_BOSSES_THE_NEXT_THREE_CHANGE_THE_MAP_11_10_26.md.
- slices/bohemia_bosses.js (14): every verb his kills handed him that home_base.json's prizes table does NOT list goes through HOME BASE's
  seam in its own shape and id: BohemiaHomeMap.give({id:'prize:<verb>', kind:'prize', name: verb.hand.name, pic:'boss_places/<hand pic>',
  from: the boss's name, says: verb.hand.line, day}). Nothing placed here. THE BURN's HIS FUEL, THE SURVEYOR's HIS MAP, THE CLIMB's HIS HOOK
  now stand beside THE POT's, THE TAP's and THE FILTER's (which HOME BASE's own homeBossGifts hands, with prize_pays).
- HER CARD after a kill says where his thing is, in its own header: 'HIS FUEL IS YOURS: IT WAITS FOR YOUR PLACE' / '...: IT STANDS AT YOUR
  PLACE' (BohemiaBosses.prizeWhere(verb) reads the seam's record), for all six.
- HOME BASE, THE FIELDS, AGREED HERE: the id 'prize:<verb>' is yours too, so whichever of us hands it first, the other's call is the
  seam's 'again' (one thing). If you want the next three in your table (a piece of home_lots.json, a line in bill.prize_pays), add burn,
  survey, climb rows: this file skips any verb your prizes table lists, so yours wins with nothing to undo here. gives: I pass none (the
  bill is yours); says carries the verb's one plain line.
- Gate: G1 and P5 in gates/the_next_three_change_the_map_gate.js (all three bosses); THE CLIMB's C1b asks his hook stands there once he
  plants. THE BURN 20/0 on the alpha on its side, THE CLIMB 20/0 on the demo upright.

## BOSSES 443, 11/10/26: THE CLIMB'S RIGGERS, HIS OWN WAY (rules 443(a), 441, 445; ask lines 167, 522), BUILD 11/10y
Record: records/BOHEMIA_BOSSES_THE_NEXT_THREE_CHANGE_THE_MAP_11_10_26.md. Gate: gates/the_next_three_change_the_map_gate.js "THE CLIMB" (THE CLIMB
CHANGES THE MAP, registered; both ways: the demo upright 18/0 (and 18/0 again with the camera's riggers), the alpha on its side 18/0; three plants). VOTE bosses-the-climbs-riggers-11-10 (stand_in).
- HIS RIGGERS (slices/bohemia_bosses.js (13); his 'riggers' row: sight 6, leash 8, two riggers, back in a day, three kept by name, the
  words): Battle Brothers' location that sends parties. WHILE HE STANDS a party off his hoist comes down the street for the crew inside
  his sight (a block a crew block, painted only where mapSees), their card first through RUN's one door (why 'riggers:<boss>', the end
  heard on BOHEMIA_CITY_COMBAT_END like the machines), beaten they are down a day. WHEN HE FALLS the people he kept up top (LUZ, DON
  ARTURO, MARISOL) stand at the foot of his towers; stepping onto one hands her to the settlement through HOME BASE's seam:
  BohemiaHomeMap.give({id:'climb:kept:<name>', kind:'person', name, look, from:"THE CLIMB's tower"}): waiting before he plants,
  placed by planting, a resident after. Kept after a reload, nobody twice.
- HOME BASE: your give() feed line for a waiting PERSON reads "LUZ from THE CLIMB's tower is ours. It waits until we have a place to put
  it." (a thing's words for a person); yours to word for kind 'person'. And the three boss prizes plus my people share rec.waiting fine.
- NOTES: TUNING, 6 blocks of sight, 8 of leash, two riggers a fight, a day before the next party; COMBAT TWO, the riggers' fight is the
  board the city cuts at that spot; WORDS, the three names and their lines are drafts.
THE LADDER'S FIRST SIX NOW EACH CHANGE THE MAP THEIR OWN WAY: a wall (THE POT), a toll then taps (THE TAP), guards then wrecks (THE
FILTER), the night then fires (THE BURN), the map's memory then its lines (THE SURVEYOR), a hunt then people at your place (THE CLIMB).

## BOSSES 443, 11/10/26: THE SURVEYOR'S HOLE IN THE MAP, HIS OWN WAY (rules 443(a), 441; ask lines 167, 522), BUILD 11/10v
Record: records/BOHEMIA_BOSSES_THE_NEXT_THREE_CHANGE_THE_MAP_11_10_26.md. Gate: gates/the_next_three_change_the_map_gate.js "THE SURVEYOR" (THE
SURVEYOR CHANGES THE MAP, registered; both ways: the demo upright 18/0, the alpha on its side 18/0; three plants). VOTE bosses-the-surveyors-hole-11-10 (stand_in).
- HIS HOLE (slices/bohemia_bosses.js (12); his 'hole' row: radius 5, 4 posts 2 to 5 out, the words): his ladder lock 'you only know
  what you have walked' made his. WHILE HE STANDS: his chainmen take the street signs down (4 cut sign poles painted round his office)
  and the map FORGETS his side: every block of it the crew cannot see goes back under the fog (FOG.seen and its mask, written here the
  way fogReveal writes them; no line in RUN's file), painted as a dead signal once he is known; one of yours says it, @manny_trucks posts
  it. WHEN HE FALLS: on the kill's tape the blades go back on and his side lifts out of the fog for good; then his chain lines run from
  his door to every town (the map's own route, a town each 90 ms so no frame waits); MANNY's card says it. Kept after a reload.
- A FALLEN BOSS'S CHANGE WAITS FOR HIS CAMERA (beatOwed): measured 11/10, the map drew once between the fall and the beat and his side had
  already lifted, so the camera found nothing; THE BURN's dark had the same gap (it now holds until the tape too).
- VOTE picture: BOSSES_AWAY=14 node tools/bohemia_bosses_vote_the_change_11_9_26.js "THE SURVEYOR" (the crew walks off first; the BEFORE
  is now the beat's hold frame).
- HIS LINES keep the blocks they drew (H.lines.path, H.lines.doors) and end at each town's door (measured 11/10: the route stops beside
  a door, and a route planned again after a reload is a different route).
- NOTES: TUNING, 5 blocks of his side and 4 posts; RUN, the fog's bits are written by this file for his side only (fogForget, a 2 px square
  of the mask at alpha 0.965 and the bit cleared); WORLD TWO, his row's falls.reveal 'towns' stands (the towns shown), his lines add the
  roads to them.
NEXT: THE CLIMB (his riggers hunt you; after, the people he kept up top go to your place through HOME BASE's new BohemiaHomeMap.give,
kind 'person': it holds them until he plants, so the CLIMB's own waiting goes).

## BOSSES 443, 11/10/26: THE BURN'S DARK, HIS OWN WAY (rules 443(a), 441; ask lines 167, 522), BUILD 11/10p
Record: records/BOHEMIA_BOSSES_THE_NEXT_THREE_CHANGE_THE_MAP_11_10_26.md. Gate: gates/the_next_three_change_the_map_gate.js "THE BURN" (THE BURN
CHANGES THE MAP, registered; both ways: the demo upright 18/0, the alpha on its side 18/0; three plants). VOTE bosses-the-burns-dark-11-10 (stand_in).
- HIS DARK (slices/bohemia_bosses.js (11); his 'dark' row: radius 5, sight 1, 4 drums 2 to 4 out, the words): his ladder lock 'night ends
  your day' made his. WHILE HE STANDS: at night on his side the crew sees 1 block (the map's fog asks BohemiaBosses.dark(), the one marked
  line __THE_BURNS_DARK__ in slices/BOHEMIA_CITY_WORLD.html's fogRadius, beside __THE_BOSS_FIRES_LIGHT_THE_NIGHT__), the map paints his side
  black at night with only his 4 drums glowing; one of yours says it the first night, @abuela_paz posts it. WHEN HE FALLS: the dark lifts on
  the kill's tape and his drums are fires of yours (lit(): 2 blocks round each at night, like day), painted with the neighbours; ABUELA
  PAZ's card says it. Kept after a reload.
- THE ALPHA'S MAP WAS BLACK (rule 441, measured upright and on its side): its canvas sat at 1 x 1 px (cvPixels()) because fit() ran while
  #stage had no size and nothing measured it again until a window resize. ONE MARKED LINE in RUN's slices/BOHEMIA_CITY_WORLD.html after
  fit's resize listener, __THE_MAP_SIZES_WHEN_ITS_STAGE_DOES__ (a ResizeObserver on #stage, on the next frame, a no-op where it fits).
  RUN: yours to keep or fold into fit(); the before is in the record. CONTENT: on the alpha on its side your road card (308 px in a 348 px
  frame) puts a second button under the edge (a scroll box); the bosses' cards now fit themselves (fitCard), yours do not yet.
- THE ALPHA (rule 441, measured on its side): it comes out of the starting town in the close view (MODE 'human'), where the map is not
  drawn and no sign is placed; the gate pinches out (the game's own swapMode, what the pinch calls). A fight can hand him back there
  too: HER CARD NOW WAITS FOR THE MAP (talkTick), so the kill's camera is never skipped. The driver's d.shot crops to a box measured at
  the door (3 x 3 px on the alpha on its side): the gate shoots the whole screen.
- ART: tools/bohemia_bosses_the_next_three_11_10_26.py (slices/boss_places/drum_*, signpost_*, riggers_*: all three bosses' pieces,
  1.6x the line cooks' build so they read on the phone). VOTE picture: BOSSES_NIGHT=1 node tools/bohemia_bosses_vote_the_change_11_9_26.js "THE BURN".
- NOTES: TUNING, 5 blocks of dark, 1 block of sight, 4 drums; RUN, the one line in fogRadius; HOME BASE, nothing of THE BURN's lives in
  the settlement yet (his prize, HIS FUEL, is your verb; a drum at his place is yours to place if you want one).
NEXT: THE SURVEYOR (the map forgets his side; after, his side back and his lines to every town) and THE CLIMB (his riggers hunt you; after,
the people he kept up top move into your place through BohemiaHome.addResident), code written, assets painted.

## BOSSES 440, 11/9/26: THE FILTER'S MACHINES, HIS OWN WAY (rule 440(b), ask lines 167, 522), BUILD 11/9m
Record: records/BOHEMIA_BOSSES_THE_TAP_AND_THE_FILTER_CHANGE_THE_MAP_11_9_26.md. Gate: gates/the_filter_changes_the_map_gate.js (THE FILTER
CHANGES THE MAP, registered; 18/0 on the phone, THE POT and THE TAP first, three plants). VOTE bosses-the-filters-machines-11-9 (stand_in).
- HIS MACHINES (slices/bohemia_bosses.js (10); his 'machines' row: count 3, near 3, far 6, two wiederganger, tape 4, the words): his row's
  lesson made true on the map. WHILE HE STANDS 3 plant robots stand on street blocks round his door; the crew beside one is met by it
  (its card first through RUN's one door, two of his robots on the board), a win drops it. WHEN HE FALLS every one still standing drops
  where it stands on the beat's tape; DOC REYES's card says it; @doc_reyes posts it. A wreck stripped once: +4 tape. Kept after a reload.
- ART: tools/bohemia_bosses_the_filters_machines_11_9_26.py (slices/boss_places/machine_*). The machine's fight hears the one door's end
  ('message' BOHEMIA_CITY_COMBAT_END, WORLD TWO's way); FALL BACK leaves it standing, re-armed once the crew is 3 away.
- NOTES: TUNING, 3 machines, two robots a fight, 4 tape; COMBAT TWO, a machine's fight is the board the city cuts at that spot (a robot's
  own arena would be theirs); BohemiaBosses.machines(n) / machineAt(x, y) for anybody.
THE THREE SO FAR: THE POT shuts streets (a wall), THE TAP's pipe costs blood then pays taps (a toll, then a verb's places), THE FILTER's
robots fight then drop (danger, then salvage). NEXT on the ladder: THE BURN (night), THE SURVEYOR (the map itself), THE CLIMB (towers);
each its own way, assets first.

## BOSSES 440, 11/9/26: THE TAP'S PIPE, HIS OWN WAY (rule 440(b), ask lines 167, 522), BUILD 11/9i
Record: records/BOHEMIA_BOSSES_THE_TAP_AND_THE_FILTER_CHANGE_THE_MAP_11_9_26.md. Gate: gates/the_tap_changes_the_map_gate.js (THE TAP
CHANGES THE MAP, registered; 17/0 on the phone, THE POT first, three plants). VOTE bosses-the-taps-pipe-11-9 (stage stand_in).
- MEASURED: THE TAP held nothing on the map while he stood; his fall lit 2 blocks and handed a home base over (WORLD TWO's row, kept).
- HIS PIPE (slices/bohemia_bosses.js (9); his 'pipe' row: length 7, bolt 6, the words): a main from his door along the map's own route
  toward the nearest town. WHILE HE STANDS: his watchers on it with crossbows; the walk is NOT refused (THE POT's way), it costs a bolt
  a block (6 blood off one man in turn, never his last; a man no fight has seen is missed), the number rising, El Chino's post.
  WHEN HE FALLS: the beat rolls the pipe to taps; every pipe block a main for his own verb (TURN THE WATER ON, +6, once each); El
  Chino's card under the wrench; @la_vecina's post. Kept after a reload.
- ART: tools/bohemia_bosses_the_taps_pipe_11_9_26.py through COOK's rig, THE CHECKPOINT's frame (slices/boss_places/pipe_*).
- THE VOTE PICTURES for any boss: tools/bohemia_bosses_vote_the_change_11_9_26.js "<BOSS>" <outdir> (the kill's own camera beat).
- NOTES: TUNING, 7 blocks and 6 blood a bolt (walking the whole pipe is 42 blood across the crew); WORLD 13 and COMBAT TWO untouched
  (the pipe reads the map at run time through cityRoute, townDoor, cityWalkable); BohemiaBosses.pipe(n) / onPipe(x, y) for anybody.
NEXT: THE FILTER's machines, shipped as 11/9m (the block above).

## BOSSES 437, 11/8/26: THE FIRST BOSS CHANGES THE MAP, END TO END (rule 437(a), ask lines 167, 346, 522), BUILD 11/9b
Record: records/BOHEMIA_BOSSES_THE_FIRST_BOSS_CHANGES_THE_MAP_11_8_26.md. Gate: gates/the_first_boss_changes_the_map_gate.js (THE FIRST BOSS
CHANGES THE MAP, registered; 18/0 on the phone with four plants; THE FIRST THREE BOSSES 108/1, its red C1 is the fight's chipBlit throw, named for COMBAT; HIS MAP 21/0). VOTE bosses-the-first-boss-changes-the-map-11-8 (stage stand_in).
- MEASURED: THE POT's walk 17/2 on main a0182e99: at his place the fight opened with NO CARD (RUN's door shows the meet card only for what
  his walking meets; WORLD TWO's tick starts the fight between steps); his fall changed one picture and a lights row; his crew held no
  street, closed no road, the map routed the same after him.
- HIS GROUND (slices/bohemia_bosses.js (8); data boss_act_one.json THE POT 'ground', a modder's row: crew, radius 3, till 30, the words):
  the ring 3 blocks out from his door, every way IN shut by his line cooks' checkpoint except his front (the map's own route in from
  the sign); never a shut that cuts you off from his door or a town; the map's walk refuses a shut block (cityWalkable wrapped here the
  way WORLD 7's shut roads wrap it; the bench gets none).
- THE ART: THE CHECKPOINT through the rig (tools/bohemia_bosses_the_pots_ground_11_8_26.py; carts, his speed rack, a burned car, a burn
  barrel on the beat, a towel with his red band, two cooks in whites; after: shoved to the kerb), x and y, before and after, beat frames
  (slices/boss_places/checkpoint_*). The rig needs a ground plate: an unpainted one the kitchen's size is carried (measured: without it
  the camera sat inside 300 m carts).
- THE FALL: the beat rolls his checkpoints open with his kitchen; every shut street walks; HIS TILL +30 (purse ledger 'boss-till:THE POT',
  once); TÍA CARMEN's card under his pot: 'HIS LINE COOKS RAN. N STREETS OPEN ON THE MAP. HIS TILL: +30 BATTERIES.'; the feed: @strip_eats
  beside the radio, and your company's till post. Kept after a reload (bohemia.bosses.v1; WORLD TWO's fallen flag is the truth).
- HIS CARD FIRST AGAIN: one marked line in WORLD TWO's startFight (slices/bohemia_his_map.js, __THE_BOSSES__): cityHandOver inside RUN's
  meetWalk, so the meet card shows (face, title, tip, ENGAGE, FALL BACK).
- NOTES, AGREED HERE (nobody else's file edited but that one marked line): WORLD 13, the generator is untouched; the ground reads the map
  at run time through cityWalkable, cityRoute, om.at, townDoor; to know where a crew holds streets: BohemiaBosses.ground(n),
  BohemiaBosses.shutAt(x, y). COMBAT TWO, the boards are untouched; a board cut beside a shut block may stand his carts on its street
  edge (shutAt says which; the pictures are slices/boss_places/checkpoint_*); nothing shipped needs it (nobody stands on a shut block).
  TUNING: radius 3, till 30. FEED: the feed is a moment (14 in memory), so the strip's post is not there after a reload; the change is.
NEXT: the other five take a 'ground' row each (THE TAP's crew holds the mains, THE FILTER's the water works...); his crew as a party on
the map that stops when he falls (Battle Brothers' camps send parties); a camera glide to his ground when the flyer marks it.

## BOSSES 4, 11/3/26: THE BURN, THE SURVEYOR, THE CLIMB, EACH WHOLE, ASSETS FIRST (rules 330, 337, 338; ask line 341), BUILD 11/3zzzm
Record: records/BOHEMIA_BOSSES_FOUR_TO_SIX_11_3_26.md. Gate: gates/bosses_act_one_gate.js now walks all six (BOSSES_EVERY_SECOND as before).
- ASSETS FIRST: each man his own model through COOK ARMOUR's pipe (tools/bohemia_bosses_four_to_six_11_3_26.py: roll, look <id>, batch,
  pack, cards, purple), his weapon on his hand's bone (own_kit): THE BURN a soot-black turnout coat, leather fire helmet, jerrycan, lit
  flare, the fire axe; THE SURVEYOR a hi-vis vest, white hard hat, map tube, plumb bob, the range pole; THE CLIMB an oxblood bellhop
  jacket under an orange harness, rope, pillbox cap, the hoist's hook on a chain. Faces in PORTRAIT's manifest.
- HIS PLACE before and after (tools/bohemia_bosses_paint_four_to_six_11_3_26.py, rows added to slices/boss_places/boss_places.json):
  THE FUEL YARD (one fire, then four barrels for anybody), THE SURVEY OFFICE (one window, then the map on a board), THE HOIST (the cage
  at the top, then down and the top floors lit); marks barrel, stake, rope. The things he hands you: hand_burn/survey/climb.png
  (tools/bohemia_bosses_what_they_hand_you_11_3_26.py fuel map hook).
- LEAD-UP: ABUELA PAZ / THE MARK, MANNY / THE MAN AT THE BAR, NENA / THE FLYER (records/target/bb/boss_act_one.json).
- VERBS, each its own kind of place (the phone shows one): LIGHT A FIRE (at night, a dark block off a town, once a night; your fires
  light 2 blocks at night: slices/BOHEMIA_CITY_WORLD.html sightLit and fogRadius, marked __THE_BOSS_FIRES_LIGHT_THE_NIGHT__), FILL IN
  THE MAP (on a road, once a day, fogReveal 10), GO UP (beside a tower, once a tower, 12 batteries). verbs_order puts them before COOK.
- LESSONS are the fight's own rules (a boss fight never deals COMBAT MAPS 3's place boards): the axe's Round Swing, the spotters'
  height, the hook's whip reach. Boards: landfill, ruin, casino.
- PROOF: the six-boss gate 108/1 (run 4: THE BURN's held finger once); fixed by the runs: a boss past the valley's edge gets his place
  behind his men, his own verb first at his own place, a two-handed boss weapon drops the rolled shield (BOHEMIA_FIGHT.html, marked).
- NOTES FOR HOME (rules 343, 347, 349: notes only): the prize on your lot and negotiable or not, in the record's section 7.
- VOTE: bosses-the-burn-11-3, bosses-the-surveyor-11-3, bosses-the-climb-11-3 (records/target/bosses_four_to_six/VOTE_BOSS_*.webp, moving).
NEXT: the other thirteen of act one the same way; TUNING owns 1.6x/1.4x, 2 blocks, 10 blocks, 12 batteries; if he wants every power
side by side on the phone, that is UI's band.

## BOSSES FIX, 11/3/26: WHAT A KILL DOES (rule 338, ask line 346), BUILD 11/3zzf
Record: records/BOHEMIA_BOSSES_WHAT_A_KILL_DOES_11_3_26.md. Gate: gates/bosses_act_one_gate.js (A5m, A5b, A5f, A5i, A6c; BOSSES_EVERY_SECOND=<dir>
takes a picture a second after the win).
- MEASURED: a stranger never saw the change (the map came back dark and a six-line card covered his place in a second); the map
  after wore a cracked skull, a door, two plates and a 9-second plate, his men standing on the changed place; a grey THE POT IS
  COOLING showed on every block.
- THE MOMENT HE FALLS (slices/bohemia_bosses.js (5)): the camera to his place, the before, the after rolling in like a tape, on this
  lane's glass over the map; then the one who asked says one line for the valley and holds out the thing (his pot, wrench, filter:
  slices/boss_places/hand_*.png, tools/bohemia_bosses_what_they_hand_you_11_3_26.py through DIRECTION's rig) with one plain line,
  numbers in it; TAKE IT flies it onto the phone's verb button; then a minute's hush (the next asker waits).
- THE MAP AFTER: WORLD TWO's skull, door and plate stand down for a painted place (slices/bohemia_his_map.js, marked); no 9-second
  plate; the name faint and boxless under the place when close; the place painted beside his men, never under them.
- USING IT: the button shows the thing and lights only where it works (no grey cooling button), a tube flicker as it comes on
  (slices/bohemia_phone.js, marked); every use plays the change where he stands and the number rises off his men.
NEXT: the other sixteen take a row each (after.valley, verb.hand, verb.first.rise) and a model each in the hand tool; a sharper
wrench jaw; UI 4's tooltip takes over the held finger.

## BOSSES 2, 11/2/26: EACH HIS OWN LOOK, A LEAD-UP, A VERB THAT MAKES SENSE (rule 330, ask lines 328 and 329), BUILD 11/3zt
Record: records/BOHEMIA_BOSSES_EACH_HIS_OWN_LOOK_A_LEAD_UP_A_VERB_THAT_MAKES_SENSE_11_2_26.md. Gate: gates/bosses_act_one_gate.js.
- THE POT, THE TAP, THE FILTER each in HIS OWN look on the people's rig (tools/bohemia_bosses_the_three_men.py, CHARACTER's tool
  pointed at three one-man types; slices/fight_rig boss_*_0, kind 'boss'; faces in PORTRAIT's manifest), in the fight and on his
  meet card (face talking, title, lesson).
- Each place PAINTED in the map's own look, before and after, two beat frames (tools/bohemia_bosses_paint_their_places_11_2_26.py,
  the district factory's parts through COOK's map rig render; slices/boss_places/). No pixel-row art left in slices/bohemia_bosses.js;
  WORLD TWO's lights-back-on dots stand down where a place is painted and are gone at the far zoom.
- The lead-up (CONTENT's mouth card): the one who lost something asks (TÍA CARMEN, EL CHINO, DOC REYES), one of your men reads the
  sign out, his place is marked; when he falls she comes back and says what the verb does in plain words and numbers.
- The phone's verb button is one plain line, a held finger shows a sentence (minimal, for UI 4 to take over), the first use says
  what it did on the map and the feed.
NEXT: the other sixteen of act one (a row each in boss_act_one.json, an entry each in the two tools); UI 4's tooltip takes over the
verb's; the pot lid and the valve wrench as CHARACTER clay pieces.

## BOSSES 1, 11/2/26: ACT ONE'S FIRST THREE BOSSES, END TO END (rule 302, ask line 287), BUILD 11/2zzg
Record: records/BOHEMIA_BOSSES_ACT_ONE_THE_FIRST_THREE_11_2_26.md.
