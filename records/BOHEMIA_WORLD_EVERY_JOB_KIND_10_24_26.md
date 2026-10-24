# WORLD [every job kind] -- THE EIGHT VERBS IN THE GAME (10/24/26, rule 153(b))

Paolo 10/24: 'right now the only jobs you have are pull up on people and kill them, but in Battle Brothers there were a lot
of different jobs: find something on the map, or do a caravan, or roam around until you find a certain enemy type and kill
a bunch of them; I want more quest types.'

## 1. MEASURED FIRST

- The town boards hold 39 people (QUESTS' act-one shelf, records/target/BOHEMIA_BOARD_SHELF.json, RUN TWO's bake). Their
  own words already ask for every verb: 'Walk the water carts to the wash', 'Find the caravan four days late', 'Hunt the
  pack that drinks here', 'Hit their fire in the dry wash', 'Carry the sealed letter over the pass', 'Hold the farm tower
  one night', 'Bring back the light regulator'.
- Every one of the 39 played the same way: __THE_LOOP_ON_THE_MAP__ (slices/BOHEMIA_CITY_WORLD.html) marked a crew six to
  ten blocks out (loopTarget), reaching it opened a fight (loopArrived), the win paid (the COMBAT_END handler). The kind
  was in the words and nowhere in the game.
- THE LOOP PLAYS ON THE MAP (RUN's gate) was 12/0 before a line was written (3 min 2 s on this box).

## 2. WHAT IS BUILT: ONE JOB SYSTEM, A KIND PER JOB

- records/target/BOHEMIA_JOB_KINDS.json (draft:true, a modder's file): the kinds from QR-AF's table with their shapes
  (crates by stars, the caravan's pace, ambushes by stars, the find ring, the hunt count by stars, the pack size, the camp's
  flat and per-head split, waves by stars, the hold's nights, each twist and its rate); a row per board offer naming its
  kind; title patterns for a row nobody named; the default is today's crew, so a new board row never breaks.
- slices/bohemia_job_kinds.js (BohemiaJobKinds): the kinds' rules. The map's loop hands it the job at five moments:
  TAKEN (make: where the job is and what it says), ARRIVED (a journey's end or a touch where he stands), A STEP (the cargo
  follows, the packs and raiders move), A FIGHT ENDED (the kind settles it), HERE (a touch at his feet is the arrival);
  plus the clock a block costs (pace), a tap on what it drew (tap) and the drawing (draw). Every fight goes through the
  one door (cityHandOver) with LOOP.fighting set to the job, so the loop's own COMBAT_END handler hands the end back.
- slices/BOHEMIA_CITY_WORLD.html, ten one-line hooks marked __EVERY_JOB_KIND__ (RUN's file; NOTE on RUN's board):
  the script tag; loopTakeContract (make, and the job's own take line); loopJobAt skips a kind's job; loopArrived asks the
  kinds first; the COMBAT_END handler hands a kind's job over; loopJobsDraw draws the kinds and skips their jobs;
  travelTo's touch-where-you-stand; mapStepWorld's step; mapTapWhat's tap; cityStepMins' pace.

THE KINDS (QR-AF id, the word on the map, how it plays):
- ESCORT (haul-caravan, 7 offers): the cargo is the rig truck he voted UP, following one block behind; another town is the
  destination (on the glass first); every block costs 1.6x the clock while it walks with him; one or two ambushes by stars
  come out AHEAD on his road and close a block for his block (a caravan cannot outrun them); a won fight drops a crate for
  each man of his who went down (capped at half); a lost fight takes half of what is left; nothing left, the job is lost;
  each crate that arrives pays its share, all of them the whole job. Twists 1 in 5: T18 a crew at the gate says the cargo is
  stolen (one more fight), T13 a crate walks off in the night.
- FIND (find-place, 5; find-person, 3): the client says which way and how far; a dashed ring of four blocks on the map
  (the place within three of its middle); a stop inside the ring says which way and how far ('Battle Brothers gives
  directions if lost'); within two blocks it turns up, with the row's own words; back to the client, paid. Twist 1 in 5:
  T22 it was a setup, a fight where it was. find-person: the held ones are guarded from two stars (a fight), then they walk
  home behind him, a head a crate, at the caravan's pace; T21 one will not come.
- HUNT (hunt-kind, 5): packs of the fight's own 3D dire wolves and cave hyenas (slices/fight_rig sheets, a row a facing, the
  walk frames when they smell him) roam around the town; a touch goes after one (re-aimed every block); within four blocks
  they come at him; contact is the fight (faction beasts); every kill counts on the job ('HUNT 2/7' on the pack's plate) until
  the client's number; packs that are gone come back farther out; enough, and back to the client, paid. Packs are four fifths
  of a crew job's count (measured: 3 to 5 wolves beat a new crew of three twice). Twist 1 in 10: T23 the last had young.
- CAMP (clear-camp, 3): a camp with a fire and its men (or beasts) at the job's spot, two more than a crew; the fight there;
  paid there, 60% flat and 40% a head put down, capped at the camp's size. Twist 1 in 4: T17 half are families, fewer stand,
  the fee locked at the offer.
- DELIVER (carry, 1): a thing in the bag to another town, no truck and no slowness; signed for there, paid. Twist 1 in 5,
  the wiki's own: thieves ahead on the road; if they win it goes to their lair, a camp off the road, to be taken back.
- DEFEND (hold-defend, 5): the client's gate is marked HOLD with the nights left; standing on it the night comes, wave after
  wave (one to three by stars), the next by itself; every wave held pays its share, all held the whole job; not there in time,
  the place is raided and nobody pays.
- RECOVER (recover-return, 12): the thing is somewhere with whoever has it (men, beasts, or nobody: a fetch); the fight there;
  he has it; back to the client, paid; a lost fight leaves it there, fewer on it, the job open. Twist 1 in 6: they moved it,
  fresh tracks two to four blocks on.
- CLEAR (clear-crew, 3 left: the road crew, the intake deck, the sand): today's job, unchanged.
Every kind keeps its stars (the skulls number, rule 146(e) is the display's), its pay in batteries (the board's 30 a star
through loopJobPay), and saves with the loop's own save (LOOP.held is written whole).

## 3. PLAYED END TO END IN THE DEMO (gates/every_job_kind_gate.js, real touches; AUTO in the rebuilt fight)

See the gate's own output in the commit message for each push.

## 4. WHAT I COULD NOT DO, SAID

- PATROL has no board person: none of QUESTS' 96 act-one designs is a patrol, the shelf is RUN TWO's bake from those
  designs, and adding a person without a design is QUESTS' and RUN TWO's call. The kind is designed (QR-AF P1); the row
  stays OPEN for it.
- The fight does not know a fight is an escort's or a hold's (the cargo on the board, a wall to hold): COMBAT's code. NOTE
  on COMBAT's board; the hand-over says why ('contract:<id>:raid', ':wave', ':pack', ':camp', ':guards', ':lair', ':thief').
- The phone shows held jobs as it did: UI's code. BohemiaJobKinds.word(offer) and status(job) are there for it. NOTE on
  UI's board.
- The board says the kind only in the client's words: RUN TWO's code. NOTE on RUN TWO's board.
