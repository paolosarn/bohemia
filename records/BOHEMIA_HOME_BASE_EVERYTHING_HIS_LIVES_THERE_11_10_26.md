# HOME BASE, 11/10/26: EVERYTHING HIS LIVES THERE (BUILD 11/10u; VAMILY rule 445, rule 441; ask line 571; rules 343, 433, 442(b))

His words (rule 445): "anything influenced by our impact in the world, what the bosses give us after they die, building: everything will
be in our own custom settlement that we build from the ground up, so we need a way to make that happen. Anything that's custom to us is
gonna be in the settlement system that you created, the three camera angles."
The coordinator's dispatch: (a) his settlement is the ONE home of everything custom; (b) it starts bare and grows only by what he does;
(c) it lives on the settlement screen that exists, upright and sideways, a prize or a build a place he taps, nothing floating; (d) HOME
BASE owns ONE SEAM every lane uses to hand a thing to his settlement, and the placing. First piece whole: the seam, THE POT's, THE TAP's
and THE FILTER's prizes standing in his place through it, two builds, and before he plants a prize waits for him and says so.

## MEASURED FIRST (main 04ead582, BUILD 11/10n, phone upright 390 x 844)
- A boss's prize was a NAME on the desk's plan in gold and a battery off the bill (BohemiaHome.prizesFrom). Nothing of it stood in his
  place's picture, nothing about it could be tapped, and a prize killed before he planted vanished: the desk only drew what was already
  planted.
- No lane had a way in. BOSSES' verbs, a finished job, a world event's gift and the retinue each had nowhere to put a thing of his.
- The builds stood on the camp's BUILD corner as sprites with no door of their own; tapping one opened the BUILD desk.

## WHAT WAS BUILT
1. THE SEAM (engine/bohemia_home.js give(), placeWaiting(); the map's BohemiaHomeMap.give()). One call for every lane:
   `BohemiaHomeMap.give({ id, kind, name, pic, gives, from, says, build })`, kind one of prize, trophy, build, person.
   - Before he plants, the thing WAITS on his record (rec.waiting) and the feed says "HIS POT from THE POT is ours. It waits until we
     have a place to put it." The phone's YOUR PLACE page says WAITING FOR YOUR PLACE: HIS POT.
   - Planting places everything that waited.
   - Placing: a prize or a trophy takes the back lots, last lot first (11, 10, 9...), never a lot a build holds; a build gift stands on
     the first free lot, already standing (a gift costs nothing); a person comes to live there (BohemiaHome.addResident).
   - The same id given twice is one thing (again:true). A thing of no known kind is refused (NOT_A_THING).
   - Every gift is on the place's record: the story line "{WHAT} came to us from {name} on day {day}. It stands out back."
2. THE BOSSES' PRIZES THROUGH IT. The map reads BohemiaBosses' own state every two seconds (never its file) and hands each verb's prize
   through the seam with the boss's own picture and name: THE POT's HIS POT, THE TAP's HIS WRENCH, THE FILTER's HIS FILTER
   (boss_places/hand_*.png, BOSSES' hand-out art).
3. EVERY THING OF HIS IS A DOOR ON THE TOWN SCREEN (rule 433). His place's town screen (the existing settlement screen, its own layouts
   upright and sideways) gets a door for each thing standing on a lot: the builds where they went up, the prizes on the back lots drawn
   at half a man's height with a shadow on the ground (442(b): nothing floats). The row slides in whole when its last piece would hang
   off the picture (measured upright: the pot hung past the glass's edge).
4. A TAP SAYS WHAT IT IS. The pot's sheet: "HIS POT, from THE POT. It feeds one person who lives here, a battery off every night's
   bill." The tank's: "The water tank, a gift from THE CHURCH. It stands. +1 food and water a day, more when somebody works it." Each
   sheet has BUILD MORE, one tap to the desk. The tap that opens a sheet can never press its button (measured sideways: the same tap's
   click pressed BUILD MORE).
5. TWO BUILDS THROUGH THE SEAM: a water tank from THE CHURCH and a garden bed from A JOB DONE, standing on lots 0 and 1, each a door.

## THE GATE: gates/home_base_gate.js, YOUR PLACE, PLANTED
Engine 27/0 (E9 the seam: waits, places on the back lot, refuses a thing of no kind, one thing given twice is one; a trophy never on a
built lot; a person lives there. PLANTED: a prize put down on a built lot is caught; a prize placed at once before he plants is caught).
The full run (engine and the demo upright and sideways, this tree) 123/0, real touches (D14: THE POT killed before planting WAITS; the phone says WAITING FOR YOUR
PLACE; planting places it and THE TAP's and THE FILTER's prizes on lots 11, 10, 9; two build gifts stand on free lots, a second give is
one; every thing is a door on the town screen; a real tap on the pot opens its sheet with who gave it and the bill's honest words;
PLANTED: the things taken off the message leave the prizes no door).
His things stand on the BUILD corner, so a tap in its middle now opens the thing under the thumb, and its BUILD MORE is the desk one
tap on (D8 and D13 press it, as his thumb would); a tap on the corner's open ground still opens the desk.
The tap failure found on the way (the pot's tap opened nothing) was the gate tapping while the arrival card was still up: a first tap
only clears that card, as his thumb's would. The gate now waits for the card, then taps.

## RULE 13, THE PRE-PUSH PASS (rebased on main a278cb8b, BUILD 11/10u)
YOUR PLACE, PLANTED 123/0; THE SETTLEMENT SCREEN 75/0; BUILD A LOT 62/0; THE LOTS ARE KEPT 12/0; A RAID ON YOUR BASE 18/0; DEMO BUILD
25/0; HANDOFF 10/0; HIS MAP 40/2 on the first full run (two fog legs upright, F1 and F4), then upright alone 21/0 on this tree, and clean main upright 21/0 (a loaded box, not this diff); after the last rebase, upright 21/0. RED AND NOT THIS DIFF'S: VOTE TAB 61/5 (DYNASTY's two whys with no where, JOBS' and PLUMBER 8's
long whys, PLUMBER 8's card with no stage, the alpha's landing twice, the gear door; this card passes every leg); PAGES PUBLISH 27/1 (the
publish list 907 MB against a 900 MB cap; this diff adds 0.85 MB of pictures, main is over without it).

## PICTURES (records/target/home_base/)
phone_r5_wait.webp (before planting, the phone says it waits), phone_r5_town.webp (the pot, wrench and filter standing on his lots),
phone_r5_pot.webp (the pot's sheet upright), phone_r5_tank.webp (the tank's sheet), phone_r5_side.webp (sideways), and the VOTE card's
vote_everything_his_lives_there.webp.

## NOT DONE, SAID PLAINLY
- 445(b) "IT STARTS BARE" IS NOT TRUE YET. His place opens on the camp picture with its ready-made shops, stall, bar, tents and the
  people of a camp; his things stand in that picture's BUILD corner. The honest fix is his own ground (the block's own terrain, empty
  until he builds), which is the look still waiting on his vote of the cameras (home-cameras-intimate-11-3). Next.
- The builds' own sprites are the lot pack's, small (the tank reads as a lid from above).
- A trophy and a person have the seam and its gate legs; no lane hands one yet. BOSSES (told), JOBS, WORLD 14's events and the RETINUE
  each have the call in handoffs/HOME_BASE.md.
- A thing with no lot left (more than the plan's lots) is kept as his with lot -1 and has no door yet.

[bb Battle Brothers keeps what you took on the company's stash screen, a list. Ours stands in the place you planted, a thing you tap.]
[analog horror: the pot is there before you are. It waited out back the whole time nobody had a place to put it.]
