# TEN SECONDS TO PLAY, ROUND THREE: THE MAP ANSWERS AFTER BEGIN (RUN, 10/11/26, [ten seconds to play])

> **PAOLO 10/5:** *"I feel like I gotta wait 40 seconds for this shit to load."* The row's end state: from the tap on the
> link to the first tap that moves the party, under ten seconds at 4x.

## THE ROW'S OWN STOPWATCH (new this round)
Rounds one and two measured to BEGIN lit. The row's number is to the first tap that MOVES THE PARTY, so the
stopwatch now does what a person does: the link, NEW GAME, BEGIN the moment it lights, one tap on open ground a
second later, and the clock stops when the party crosses its first block (the demo at 4x, served like Pages). It is
leg M1 of the new check and prints its number every run.

| from the link, at 4x | main (68e70d5b) | now |
|---|---|---|
| BEGIN lit | 18.1 / 30.4 s | 14.5 to 15.8 s (12.3 to 12.6 s without the stopwatch's own polling) |
| HIS FIRST BLOCK CROSSED | 32.5 / 34.7 s | **19.1 to 21.5 s** (five runs) |
| longest freeze between BEGIN and that block | 0.97 / 3.8 s | 0.42 to 0.45 s |

## MEASURED FIRST: THE 20 SECONDS AFTER BEGIN WERE 93% FROZEN
No tap, the demo at 4x, every long task from BEGIN for 20 s, and a CPU profile of the same window by the second:
the longest freeze 3.9 to 5.7 s, 18.6 of 20 s frozen. That is the wait he feels after the door. Five causes:
1. **The act faces looked themselves up on the street** (3 s). The phone's three act faces ask the shell for a face,
   and the ask says what the name reads as; for an id like `act2~s0~he` that searched `ctEveryone()`, which built the
   street's nine blocks of people to find nobody and answer `either`. Now an act id answers `either` without the
   search (the same answer). Street blocks built after BEGIN: 15 to 6.
2. **The morning's offer built six street blocks in ONE task** (3.9 s). The offer says how far the job's people are
   (`offerRing` to `castAddresses`), and finding them generates the walked street's ground. Now, in the demo,
   `wakeWarm` runs the same search dry first (a block not built answers nobody), builds the first block it would
   have opened, one a task on idle time, and repeats until the search opens nothing new; then the ring. The search
   is pure and visits blocks in a fixed order, so it builds exactly the ring's blocks. None while he is on the road.
3. **Every street sprite made a picture in ONE task** (4.9 s). `__tilesArrived` turned the 26 MB bank into pictures
   from data: addresses, which decode on the page's own thread. Now in handfuls of 6 ms, the camps first, a family
   handed over only when whole, the countdown armed after the last handful. THE LATE ART GATE 21/0.
4. **The crowd baked a whole person a task** (2 s each at 4x): six more people (530 ms at full speed) and twelve
   walks (285 ms). Now, in the demo, one facing a task, after his walk and the six's breath, and never while the map
   says he is moving; a person is posted only whole, the same message. The still is the breath's own 0.25 picture,
   as the boot six's are (one bake fewer a facing).
5. **The late load was a second boot** (2.3 s, after his first trip). The city frame's load event waits for every
   script the page adds, so it fired after the 26 MB of sprites, about 12 s after BEGIN at 4x; the shell's load
   handler then sent his body again (his walk baked over) and put the save back. In the demo, what the map already
   asked for and got (its save, his body) is not sent again; the rest of the handler is unchanged.

After: the longest freeze in the 20 s after BEGIN **1.8 to 2.4 s** (was 3.9 to 5.7), frozen 68 to 79% (was 93%).

## WHAT IS LEFT (19 to 21 s against 10)
- BEGIN lights at about 12.5 s at 4x: the six people's stills (0.95 s at full speed), parsing the two pages
  (0.72 s), the city frame's boot (0.7 s), the map's first paints (0.36 s). This is the biggest piece.
- From BEGIN to the first block: about 1 s for the BEGIN tap to answer, then a person's second, then about 1 s
  from the tap to the first block crossed at 1x travel.
- The street block one at a time is still up to 1.9 s at 4x: the walked street's ground generation is the cost
  (`realizeCell` / `tileMeta`), not ours to cut in this row.

## FOUND, NOT MINE (for the owners)
- **The workshop wipes its first later person.** On the alpha the shell re-sends the first six people after the first
  of the later six has landed (a non-append cast), so 'apron' is not on the alpha's map; main does the same. The
  check compares the crowd person by person, by name, for that reason. (LIFE + CITY, the cast.)
- **The driver's door knock taps the map.** `knock()` taps #fronttap and then #front; when the first tap opens the
  door the second lands on the map and sets a journey to the screen centre. (PLUMBER, tools/bohemia_drive_the_demo.js.)
  The new check goes through BEGIN itself so the knock finds no door.

## CHECKS
**THE MAP ANSWERS AFTER BEGIN**, new, 10/0, registered slow (about 75 s): M1 the stopwatch (the first tap moves the
party, the number printed); M2 no freeze over 2.5 s in the 20 s after BEGIN; M3 no breath, crowd, walk or ring-street
step while the map says moving (receipts counted where the work runs: `ROAD_RECEIPT`, `WAKE_WARM.onRoad`); M4 the act
faces never call the street's people; M5 the morning still rings, its street built a block a task; M6 every sprite
family, hero and door clip made; M7 the crowd's frames person by person the same as the workshop's whole-person bake;
M9 the late load puts no save back after BEGIN and bakes his body once; M8 nothing threw. Mutations: see the commit.
