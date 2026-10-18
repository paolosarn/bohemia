# RUN TWO [the board's quests are people] (10/18/26)

Opened by the coordinator (rule 112), Opus 5.5 at Extra (rule 116). No question asked.

## Why
His 10/17 ANYTHING ELSE: "no more cards with quests, make an actual quest". RUN TWO's own jump list (10/1): "the
contract board reading QUESTS' 96-quest shelf instead of 4 drafted offers". Before this row every board in the valley
showed the same four drafted people (Doña Carmen, Beto, Marisol Ortiz, Old Tavo), the first one to three of them by the
place's size, whatever had happened there.

## What was built
- THE SHELF, records/target/BOHEMIA_BOARD_SHELF.json (a data file a modder edits), baked by
  tools/bohemia_run2_board_shelf.py from QUESTS' act-one designs (questbook/designs/act1, 72 contracts of 96; read,
  never asked, rule 35). 39 rows: 11 camp, 7 town, 11 fortress (one serves both), 4 raided, 4 sickness, 3 market day.
  Each row is ONE design: the client's name as the design's CLIENT PORTRAIT gives it, the design's SKULLS, the design's
  own SCREEN'S LINES cut to two sentences with the pay in the second ({pay}; {crew} is the raiding party), a cast look
  with PORTRAIT's fresh talking face, pay 30 a skull (the board's rule since 10/5; TUNING owns it). draft:true.
- THE PICK, slices/bohemia_board_shelf.js, called by BOTH the settlement's board and the phone's list (UI's
  slices/bohemia_phone_board.js, a small edit: it loads the picker and calls it with the same place, tier, map day and
  the dice's traits from BohemiaLivingMap), so the phone never lists a job the place does not offer. QUESTS QR-O's
  counts: camp 1, town 2, fortress 3; a RAIDED place keeps one job, the crew that hit it, named from FACTIONS' raid
  ledger mark (`by`); a SICK place asks for medicine first; a MARKET DAY puts a haul up first; the rest is the tier's
  pool shuffled by the place's name and the map day, a new board every 3 map days (QR-O's draft). A held job is
  skipped and the next person steps up. The four drafted OFFERS stay as the fallback until the shelf loads.

## Measured
- gates/the_boards_quests_are_people_gate.js 16/0 (in the suite as THE BOARD'S QUESTS ARE PEOPLE): the shelf is the
  bake byte for byte; every row checked against its design file; a camp, a town and a fortress on one day read 1, 2
  and 3 people, three different boards, all fresh faces; a client speaks two sentences with the button's pay; take it
  and someone else steps up; raided by the Cartel: one job, "The Cartel took the count and two of my men..."; sick:
  medicine first; three days on: a new board; shelf blocked: the four drafted offers; the phone equals each board.
- IN THE DEMO: UI's the_phones_board_gate 15/0 (THE PHONE AGREES WITH THE PLACE: Church's board, "Ride shotgun to the
  salt camp", market day) and RUN's the_loop_plays_on_the_map_gate 12/0 (L4 THE BOARD GIVES HIM A CONTRACT). Both were
  red on main before this row for one shared reason: RUN TWO's own [the arrival] card holds the glass two seconds and a
  tap only skips it, and both gates tapped the board inside that window; the loop gate also looked for "N battery" on
  a button that has read "N batt" since 10/5. Both gates now wait for the arrival to go and read the title span.

## Known, stated
- A client is tied to a tier, not a seat: two places of one tier can show the same person on the same day (the
  seeded shuffle makes it rare, not impossible). Seats for the fourteen home bases are Paolo's (QR-O).
- The city opens the settlement with the map's traits, so the ledger's RAIDED reaches the board only when RUN hands
  the ledger (OWED since [the raid is a record]); the gate proves it through open({ledger}).
- The four drafted offers' lines are still in engine/bohemia_keeper_lines.js's price line (30/60/90), unchanged.

Reference check: no art made; the faces are PORTRAIT's fresh portraits (fc0bbbd3). No reference game.
