# HOME BASE, 11/10/26: ONLY THE PLACE YOU PLANT IS YOURS (BUILD 11/10e; VAMILY rule 442(c), rule 441; ask line 546)

His YES on YOUR PLACE, PLANTED, with his note: "The only place that will be mine on the map is where we decide the custom settlement is,
that's it." The coordinator's routine: find and remove every other thing that reads as his own place; before he plants he has NO place,
after it exactly one; a gate with a planted fail, proven on a phone, a fresh game and a saved one.

## MEASURED FIRST (main d74940d8, the demo, phone upright)
Everything that made a place his ran through two doors:
1. THE SEED'S CAMP: his outfit (canon's player faction, 'Custom') had a seat in ctBases() and turfSeats() from the first second, so
   the painter painted a camp for him, the map named it (YOUR CAMP after 11/9d, CUSTOM before), the old territory layer coloured its
   ground "his" (turfGrid's own: brighter and thicker), it opened with BUILD on it, and FACTIONS' ledger took it for him on day 0
   ('deal', hbRec()).
2. THE LEDGER: two bosses' falls hand him the nearest home base (records/target/bb/boss_map.json falls.holds 'you' for THE TAP and
   THE MIDWIFE, slices/bohemia_his_map.js holds() -> BohemiaHomeBases.took(..., to: 'you', by: 'boss')). A raid by him (raidTake)
   could too, behind the switched-off 'Take it'.
Not his place, kept: the camp he pitches to rest (HEAL) stands only while he rests and leaves nothing on the map.

## WHAT CHANGED (slices/BOHEMIA_CITY_WORLD.html __HOME_BASE__, __ONLY_THE_PLANTED_PLACE__)
- Before he plants, his outfit's seat is OUT of ctBases() and turfSeats(): nothing paints it, names it, colours its ground, opens it,
  raids it, or takes it in the ledger. After, it is the planted block, as 11/9d made it.
- The ledger's took() refuses any taking to him but of his planted place ('ONLY_THE_PLANTED_PLACE', counted in __HOME_REFUSED): the
  bosses' 'holds: you' and any raid or deal land nowhere. BOSSES' and WORLD TWO's files are untouched; the guard is in this block.
- lotIsMine(name) answers yes only for the planted place (and only while the ledger agrees).
- Planting writes the taking itself ('deal', 'planted') and redraws the ground layer (TURF_MAP_KEY cleared).

## THE GATE: gates/home_base_gate.js (YOUR PLACE, PLANTED), D11 new: engine 22/0, upright 55/0, sideways 53/0
D11 a fresh game before planting: his camp not on the map, no seat, not in the ledger, no base answers his, CUSTOM and YOUR CAMP named
nowhere; a boss's fall handing him a town refused by the ledger; after planting exactly one, the planted block, in the ledger once; a
saved game closed and opened again with CONTINUE (upright): exactly one, the same block; planted: a second place written his past the
guard (the raw took) is counted, red. The places counted are every home base and every region place the map knows, read from the
ledger itself, never from lotIsMine alone (the guard is what is being tested).

## OTHER LANES' GATES THIS RULING MOVES (re-aimed to it, nothing loosened; one retired)
- A RAID ON YOUR BASE (LIFE+CITY): leg A read 'your outfit's base is yours from the first day'; it now plants his place first at the
  seed's own seat (BohemiaHomeMap.plantAt, a checkers' door) and every leg runs on it: 18/0 (main 18/0; one run of five threw an image
  not yet loaded in the loss fight, the next run clean).
- BUILT ON THE MAP (LIFE+CITY, 'THE LOTS ARE KEPT'): read 'your base' as whatever base was his on day one; it now plants first the
  same way: 12/0.
- HIS MAP (WORLD TWO / BOSSES, 42/0) leg B5: 'a base changing hands by boss' asserted the town became his; it now asserts a boss's fall
  never makes a town his (the ledger refuses it), the wall and reveal legs as before.
- TAKE THE NEXT PART (LIFE+CITY, 10/10) RETIRED to graveyard/take_the_next_part_11_10_26/ with
  graveyard/POSTMORTEM_TAKE_THE_NEXT_PART_11_10_26.txt: its feature (take a town, it becomes his) is what 442(c) forbids; the button
  was already off in the game (rule 88). NOTE for LIFE+CITY and BOSSES: THE TAP's and THE MIDWIFE's falls.holds 'you' now land
  nowhere; re-aiming them (to 'free', or to a faction) is BOSSES' call.

## VOTE
home-base-only-the-planted-place-11-10 (STAND-IN for the camp's look, which is the town picture system's): the same spot of a new
game where the seed used to put his camp, with nothing of his on the map, beside it planted, CASA ROSA, the only one.

[bb Battle Brothers gives the company no town of its own at all; ours gives him exactly one, and only where he chose.]
[analog horror: the block where his camp used to stand is just a block now; nobody there was ever his.]
