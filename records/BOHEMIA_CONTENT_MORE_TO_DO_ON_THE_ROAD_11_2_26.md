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
| distinct things met in the first 3 in-game days | the board's jobs (1 to 3 boards dealt a window, camp 1, town 2, fortress 3) and the forced parties | see section 4 (the drive) |

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

## 4. THE DRIVE: 3 IN-GAME DAYS ON THE REAL DEMO, PHONE SIZE (tools/bohemia_content_drive.js)
DRIVE_RESULTS

## 5. KNOWN, NOT DONE
- The side quests are not on the phone's contract list (they are on the map and in the feed). UI's door if it wants them.
- The 12 old road moments (ROAD_WORDS) stay where they are; this lane's events are new rows, not a rewrite of them.
- A side quest's giver is met on the road only; meeting one inside a town's screen is the settlement's door (UI/RUN).
