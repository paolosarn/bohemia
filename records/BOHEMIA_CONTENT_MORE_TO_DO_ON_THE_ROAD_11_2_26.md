# CONTENT: MORE TO DO ON THE ROAD (11/2/26)

Paolo 11/2: "I want more content for the game, more content." Before that: "it's fun but it got pretty boring... a little
more quests to do." Ask-list rows 258 and 284 (records/BOHEMIA_EVERYTHING_HE_ASKED_10_24_26.md). Battle Brothers' way first
(reference/library/battle_brothers/: road events with a face and two or three choices that cost or pay, some of them
remembered; a long contract list), then our swag.

## 1. MEASURED FIRST (the demo as it stood on main 33b1250a)

| what a player can meet on the map | before | after |
|---|---|---|
| road events with a face and a choice | **0** (the 12 road moments in ROAD_WORDS/ROAD_CHOICES never fire: refused since 9/20 for no body on screen; only the 4 'forced' ones play, as a party you can see and run from) | **29** road events + **5** side-quest meetings = **34** |
| of those, chains (a choice now, a payoff later) | 0 | **6** chains, 7 payoff events (the kid and his brother, the trucker, the drone x2 ways, the toll, the sick man's wife, the radio keeper) |
| job kinds on the board | **10** (clear-crew, haul-caravan, find-place, find-person, hunt-kind, clear-camp, carry, hold-defend, recover-return, patrol) | **19** (+ ambush, envoy, bounty, scout, burn, collect, big-game, signal, free) |
| board offers in the pool | 41 (39 QUESTS shelf + 2) | **50** (+9 people with the new jobs) |
| side quests a player can play on the map | **0** (the 5 the demo bound in 8/14 are bound to the walk, dead since 9/28) | **5** from the .bq library, every line verbatim |
| distinct things met in the first 3 in-game days (the drive, section 4) | the board's jobs and the forced parties | **11 road events + 2 side quests + 2 new job kinds**, all with faces and choices |

## 2. WHAT WAS BUILT

- **The mouth card** (slices/bohemia_road_events.js): one card for every person on the road. Their fresh portrait (PORTRAIT's
  heads, engine/bohemia_crew_faces.js) TALKS the line and is heard through the game's one voice; their name, where they are,
  the words, two or three choices with what each costs on a chip (-10 BAT, +2 FOOD, A FIGHT, A CHANCE, +1 MAN). The map
  pauses under it (travelInterrupt, the one pause); a choice is his GO, so the march goes on when the card goes. The answer
  comes from the same mouth with what changed in amber (+18 BATTERIES, TRADES LIKES YOU LESS).
- **The director**: on every block walked on the map. Never in the first real minute (THE SECOND VOTES; the overworld law),
  22 blocks between events at least, then 6% a block (about 38 blocks between events, two to four an in-game day of steady
  walking). Picks by the ground (paved / rough / any), day or night, the chain's flags and what he has (a choice he cannot
  pay for is shown and greyed). A met event waits his 3-day repeat ruling (the SETTINGS dial); chain events come once.
- **What a choice does**, all through systems that already exist: batteries (the purse), food (the wagon, a man's night each),
  gear (the bag, a weapon row from weapons.json), a man (joins the hired with stats rolled in his background's range, or one
  walks), a town's opinion (the job system's own settled acts, Battle Brothers' relations: favor +15, done +10, part +5,
  minor offence -10...), time (the clock), a fight (through the one door, cityHandOver; the win and the loss each pay or cost),
  a chance, a chain's flag, a side quest.
- **Nine new job kinds as DATA** (records/target/BOHEMIA_JOB_KINDS.json 'legs'; the engine is a LEGS section in
  slices/bohemia_job_kinds.js): a kind is a list of places (spot / road / far / another town / back to the client) and what
  waits there (wait on the clock, wait for dark, a talk with two or three choices, a fight, the words, what it gives). A modder
  writes a new kind as a row, no code.
    AMBUSH (Raid Caravan: wait at the cut 90 min, the convoy's guards; twist: their scouts first),
    ESCORT (Escort Envoy: walk the clerk to another town, paid at THEIR gate; twist 40%: the men who want him, halfway),
    BOUNTY (the named man, only after dark: Chuy Lento and his boys),
    SCOUT (Discover Location: three wells, no fight, each says what is there),
    BURN (Raze: the tire yard, its watchmen; the nearest town thinks less of you),
    COLLECT (ours: the economy is the story: Don Beto talks; take it all = his nephews, take half = half pay and the street
             likes you, pay his debt yourself = 20 batteries and a favor),
    BIG GAME (Big Game Hunt: one lab lion, far out),
    THE SIGNAL (the strange one, analog horror: two masts at night, a tape deck reading prices up to TODAY; take the tape,
             smash it for part pay, or leave it playing and the job is lost),
    FREE (Free the Prisoners: the pen's guards; one of the freed joins the crew when the client pays).
  Every new kind shows its trip before the yes (whereTo / BACK), its danger on the board (fightsOf), its next place on the map
  (nextOf, markNext), and is paid at the town's edge (payHere).
- **Five side quests** (records/target/BOHEMIA_SIDE_QUESTS.json, baked by tools/bohemia_side_quests_bake.js from QUESTS' .bq
  pages, every say and choice VERBATIM; QUESTS stays research only): SAY IT BACK (S07), THE LAST GOOD DOCTOR (S12), WHAT THE
  DOG KNOWS (S14), WHAT CRIES IN THE DEEP (S04), THE SEED THAT DOES NOT COME BACK (S17). 46 talk nodes, 95 lines, 98 choices.
  The giver stops you on the road (a face, their words). When the talk turns to somebody who is not here, that person's place
  goes on the map, marked like a job (a tap walks there); arriving, they talk; an ending stage closes it, pays what the .bq
  says (its faction rows become the town's opinion), and its @LOG line goes to the phone's feed as the journal. People,
  places and things; nothing pops up that is not a mouth with a portrait.
- A new game forgets the road (bohemia.roadevents.v1 joins the start screen's forget list).

## 3. RULES KEPT
- Every word is an attempt, draft:true, in the data files; the code owns none. The valley's people speak Spanglish; the
  player's choices are plain English. The .bq quests' words are QUESTS' and PEOPLE's, untouched.
- MODS: three modder's files (road events, side quests, job kinds' legs); a new event, quest or job kind is a row.
- The main quest: untouched. UI's phone, the transitions, ROBOT's crew, FINISHER's rows, the towns' pictures: untouched.
- Numbers (gap, chance, pay, food, fights' sizes) are shapes TUNING owns.

## 4. THE DRIVE: 3 IN-GAME DAYS ON THE REAL DEMO, PHONE SIZE (tools/bohemia_content_drive.js; the run: records/CONTENT_THE_THREE_DAY_DRIVE_11_2_26.json)
**Run 5 (the last, after every fix; the file is this run):** 3 in-game days (day 1 to day 4), 680 blocks, **21 met: 17 road
events + 4 side quests, all 4 finished** (SAY IT BACK, THE SEED, WHAT CRIES IN THE DEEP, THE LAST GOOD DOCTOR ending 32), **3
chains paid off** (the tollkeeper remembers, the kid's brother comes back and joins, the sick man's wife brings the knife), the
2 new jobs taken and paid (53 of 53, 60 of 60), crew 3 to 5, purse 290 to 384, **0 thrown**.

Run 4, BOHEMIA_DEMO.html at 390x844 touch, the real director's real gap and chance (nothing forced):
- **3 in-game days** (day 1 06:00 to day 4), 664 blocks walked on the map, **0 thrown** (page, map frame, driver).
- **Road events met on their own: 11 distinct** (the tollkeeper, the water thief, the Blues patrol, the one-armed hunter's lion,
  the coyote boy, the radio on a pole, the Red deserters, the dead courier, the lost drone, the night nurse, and a CHAIN PAYING
  OFF: the tollkeeper paid on day 1 came back on day 3 remembering it). 4 more chains set for later (paid_the_toll,
  took_the_radio, kept_the_drone, hid_the_water_woman). Every card was a talking face (the mouth key moving on 18 of 20 cards
  at capture) with 2 or 3 choices; 2 road fights won and paid (the Blues +20, the lion +30); a man joined (crew 3 to 4).
- **Side quests: 2 met on the road and finished** (THE SEED THAT DOES NOT COME BACK: the grower, then the trader's truck
  marked on the map and walked to, ending 30, +3 food, the Blues like you more; WHAT THE DOG KNOWS: the scavenger, then the
  sergeant at the stairwell, ending 30, +8 batteries).
- **New jobs: 2 taken and paid**: SCOUT (three wells, no fight, paid 53 of 53) and COLLECT (Don Beto talked; 'take all of it'
  started his nephews' fight; won; paid 60 of 60).
- Purse 290 to 410, food 21 to 18 (three nights eaten, quest and hunt food back), crew 3 to 4.
- Two test-tool fixes on the way (the tool's, not the game's): a forced win must put THEIR men down (a win with them standing
  reads as a walk-away, so the job waited for a rematch), and the spoils screen waits for LEAVE.
- Caught by the drive and fixed: the seed quest's .bq calls the grower 'her' and the trader 'his'; the glue had them the other
  way round. Now DOÑA ANSELMA and EL GÜERO.

## 5. THE CHECKS THIS CHANGE TOUCHES (run once at the end)
- every_job_kind_gate: 36 of 37 (the one red, P3 the patrol's pay, passed on the run before and is the dice; it was 32 of 37
  before the switch below). the_boards_quests_are_people_gate 16/16, a_plain_way_to_drop_a_job_gate 6/6, attempt_gate 15/15,
  long_injury_gate 56/56.
- the_trip_before_the_yes_gate T6 red: RED ON MAIN TOO (measured with main's three files put back: the same 'null'); every one
  of the 9 new kinds says its trip on the phone (all 27 kind-and-town pairs exact, e.g. '3 H TO ANARCHISTS, THEN 2 H TO DON
  BETO, THERE AND BACK').
- language_gate 1 red (the fight's dial and the veteran) and no_face_from_a_body_gate 8 red (the crew screen, the town's lot,
  hall and board faces of person_town_* / person_volunteers_* / you): screens and looks this change does not touch.
- **A SCRIPTED BROWSER MEETS THE ROAD ONLY WHEN IT ASKS**: the first run of every_job_kind_gate went 5 red because its walks
  stalled under a road card it could not answer. A real phone never runs under automation (navigator.webdriver), so the road
  always talks to a player; a scripted walk sets window.__ROADEV_ON = true to meet it (the drive does). EYES: set it on your walks.

## 6. KNOWN, NOT DONE
- The side quests are not on the phone's contract list (they are on the map and in the feed). UI's door if it wants them.
- The 12 old road moments (ROAD_WORDS) stay where they are; this lane's events are new rows, not a rewrite of them.
- A side quest's giver is met on the road only; meeting one inside a town's screen is the settlement's door (UI/RUN).
