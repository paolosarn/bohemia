# CAMP FOUR: THE CAMP WAITS FOR YOU, AND YOU SEE IT BUILT (11/22/26)

VAMILY rule 472, ask rows 711 and 712. BUILD 11/22zz - THE CAMP WAITS FOR YOU. BUILT, NOT YET SEEN (rule 179).

## His words (11/22)

> "if I make camp, I don't want it to auto and I want time to go by until everyone's healed, but then when everyone is healed I want
> time to stop, but I still want the characters to move around as they were, doing whatever, just breathing and idling around, and then
> maybe something on the screen or the phone, like fully healed, resume back to world map, not that exact word, something more friendly
> with the world building... we made camp, it loads, it takes 30 seconds, I don't know why it freezes when it loads, I don't get to see
> any sort of transition, it's just like the combat map, it freezes for like 10 seconds and then everything's populated in, I didn't get
> to see anyone build the camp, which is very strange... once they're fully healed, armor and health, just have them stick idling, and
> then I have to definitely click something to resume getting back on the world map... right now once they're fully healed up it just
> instantly takes me back to the world map. What if I want to zoom in on my character, see them chilling?"

## What was wrong, measured (main 14cfe9f3, the demo, phone upright, this box at full speed)

| what | before |
|---|---|
| HEAL off the start town, his one man at half | the camp broke itself 'healed' 1.6 s after HEAL, at hour 3, before its board had baked: he never saw the camp |
| HEAL, the camp held open (the gates' hold) | the hours ran from the first beat while the board baked: 9 hours before the set-up played, 16 before it stood |
| a camp made with everybody whole | ran its hours on and on: 139 hours in 67 s after a won fight |
| MAKE CAMP after a won fight | 7.3 s from the tap to the camp's first frame; the fight's last frame held still on the glass (PAUSE, MAKING CAMP) all that time |
| where the 7.3 s went | a hidden copy of the fight page dealt the SAME board again and baked it whole: its ground one step of 3.2 s; then 2 s composing; 1.2 s writing the picture as a file and reading it back |
| frames | stalls up to 600 ms here between the tap and the camp (four times that on a phone) |
| the camp's pinch | stopped at 1.5 (a man about 84 px) |

The phone does it four times slower (THE STOPWATCH LINE's 4x profile), so 7.3 s here is his "freezes for like 10 seconds", and
HEAL's board on a fresh page is his "30 seconds".

## What is live now

1. **The clock runs only while they mend.** A camp's hours run while a man of his is under 99 percent of his blood or his armour
   (the table's camp_done_at). The hour the last one is whole, THE CLOCK STOPS: no hour, no bill, no walking world. The camp stays on
   the glass. A camp made with nobody hurt stops the moment it stands. Nothing sends him back: HEAL, BREAK CAMP, T, a pinch out and a
   crew that reaches him end it, as before. A town's rest stops the same way and stays in the town. (CITY_WORLD `__CAMP_WAITS_FOR_HIM__`:
   campDone, campWholeNow, campRoad, campHour; rule 278(a)'s break and 267(a)'s running rest are amended by 472.)
2. **Every camp is built before an hour runs.** The set-up hold (MOTION 3's, rule 444(a)) was only for a camp made off a fight; now it
   is every camp but a town's rest, with a minute's guard (a slow phone bakes longer than 15 s).
3. **The phone says it, and his tap is the way out.** While the camp waits: the phone's band is HIT THE ROAD (the tin, the door's own
   picture, lit on the beat), and its strip is one of his men saying it, his name over the line. A tap on either: the camp put away, the
   map on the glass, the clock on PAUSE until his GO. The lines (draft:true, rule 467: they curse where a real person would):
   - mended: "Everybody's patched up. The road's fuckin' waiting." / "Shit, we're whole again. Let's get back out there." /
     "Tape's on, nobody's bleeding. Road's waiting on us, jefe."
   - camped with nobody hurt: "Nobody's hurt, so what the hell are we sitting for? Road's waiting." / "Fire's going and we're all in
     one piece. Say when."
   - Rule 465: no line in the game was rewritten; these are a new moment's lines. The old CAMP_DONE_LINES stay as they were (said only
     the way it was, window.__CAMP_BREAKS_WHEN_WHOLE).
4. **They keep living.** The clock stopped, every six seconds (twelve beats) one of his men (never YOU: you walk to his taps) gets up
   from what he was doing and goes to his next thing: the cook to the gun, the gun to the fire, a turn on watch. By night they sleep but
   the one on watch. And any man whose place changes WALKS there from where he stood, at a walking pace, facing the way he goes (the hour
   turning while they mend used to pop him to his new spot). (slices/bohemia_camp_look.js drift and stroll.)
5. **He can zoom in on his man.** The camp's pinch goes as close as the fight's own closest stop: a man 166 css px (it stopped at 1.5).
   On a computer the wheel zooms in toward the pointer and back out to the fit (never out of the camp).
6. **After a fight, the camp comes up at once.** The fight's page had the board baked and on the glass the moment he tapped. Now, at the
   tap, it hands the camp that board (its dead laid where they fell, the map round it, what the camp reads of the ground) in 37 to 51 ms;
   the camp stands on it with no second deal and no second bake, its picture made in memory and drawn as it is (no file written or read);
   its night graded over the same picture with the fight's own night numbers. The map under the held last frame is no longer drawn (its
   fog and tiles were 0.9 s of the main thread under a picture nobody sees). No hidden page is loaded behind the loot screen any more.
   (BOHEMIA_FIGHT.html campQuick; the shell's campFromFightKeep; slices/bohemia_camp_board.js quickLand and fvLandedQuick; the
   settlement's ground loader takes the canvas.)
7. **HEAL on the map, a live transition, half the wait.** The moment between (WORLD's: the light down round him, his fire catching at his
   marker, its embers, the camcorder's clock) now waits at his fire until the camp's ground is drawn under it, then the camp comes up over
   two beats: never the dark screen. The board's first light stands the camp up the moment it is baked; the other light is laid in under
   it when it comes.

## After, measured (this box at full speed; THE CAMP WAITS FOR HIM's own reads)

| what | before | after |
|---|---|---|
| MAKE CAMP to the camp's first frame (upright) | 7.3 s | 1.8 to 2.1 s |
| the same, the phone on its side | (not measured before) | 1.95 to 2.5 s |
| the board for the camp after a fight | 6.3 s (a second deal and bake) | 52 to 223 ms to the first light |
| the work at the tap itself | none | 35 to 51 ms (the fight's hand-over; 43 ms on its side, where redrawing the map's ring was 356 ms) |
| worst held frame, tap to first frame | 600 ms | 400 ms |
| HEAL to the camp's board in | 4.3 to 4.7 s | 3.3 s |
| hours that run before a HEAL camp stands | 9 | 0 |
| a hurt camp when they are whole | broke itself, back to the map | the clock stops, the camp stays |
| a camp made whole | 139 hours in 67 s | 0 hours |
| the closest a man stands at camp | 84 px | 166 px |

## At phone speed (4x CPU, THE STOPWATCH LINE's profile, the GPU canvas on; the demo upright, a suburb fight won, MAKE CAMP)

The same build both ways: the old way is this build with its switches thrown (window.__CAMP_NO_QUICK, __CAMP_MAP_UNDER_HOLD,
__CAMP_SETUP_FIGHT_ONLY, __CAMP_IN_NO_WAIT), which is main's path.

| what | the old way | now |
|---|---|---|
| MAKE CAMP to the camp's first frame | 24.1 s | 10.0 s |
| the camp's board in, from its ask | 14.4 s (its ground one step of 7.6 s) | 0.95 s (the hand-over at the tap 150 ms) |
| frames held over half a second, tap to first frame | 8 (worst 1.55 s) | 5 (worst 1.15 s) |
| the fight's street held still on the glass | 24.0 s of the 24.1 | 9.0 s of the 10.0 |
| MAKE CAMP to MOTION's held street (the loot screen torn and folded, the map back) | 5.0 s | 5.5 s |

What is left of his "freezes for like 10 seconds", named: (1) the 5.5 s from the tap until the held street goes up (the receipt torn,
the loot screen folding into the phone, the fight page let go, the map back: the shell's and MOTION's, never the camp's); (2) about
4.5 s from there to the camp's first frame: the map's camp made (the shell asks every quarter second), the camp screen opened, the
board composed (0.95 s), YOU placed on it. Both for PLUMBER 8 (rule 472(e)) with these numbers; the bake that was the 14 s is gone.

## Not done, named

- **HEAL's remaining wait is the hidden fight page loading** (2.2 s of the 3.3 s here; about four times that on a phone). The camp
  board has nothing to stand on until that page has dealt the block's board. The fix is a warm page kept on the map while the company
  is hurt, which costs memory and main-thread time while he walks; that trade is PLUMBER 8's (rule 472(e)). The transition no longer
  shows it as a freeze: he watches his fire catch on the map.
- **A night fight baked before this build** has no day kept: a camp made off it keeps its night until he leaves (a fight baked from
  this build keeps its day, UI.boardDay).
- The STAFF's carts (rule 471) are not shipped; the camp's set-up sets down the camp's own shopping cart (CAMP TWO's carrier).

## Gates

THE CAMP WAITS FOR HIM (new, gates/the_camp_waits_for_him_gate.js, registered): W1 to W8, P1, P2, A1. HEALING STOPS ITSELF AT FULL
re-aimed (F1, F2) to rule 472; THE HEAL BUTTON's H5 reads the hours from the end of the camp's set-up; CAMP HOLDS UNTIL HE ENDS IT and
RUN TWO's camp gate (not in the suite) hold the new stop off for the legs that measure a running clock, and count from the set-up's end.

RESULTS on this build (each gate alone, this box): THE CAMP WAITS FOR HIM 18/0 on the demo upright and on its side, 11/0 on the alpha
upright, 9/0 on the alpha on its side (W8 there: first frame 2.1 s upright, 2.5 s and 1.95 s on its side, worst held frame 0.5 s);
HEALING STOPS ITSELF AT FULL 8/0; THE HEAL BUTTON 16/0; CAMP HOLDS UNTIL HE ENDS IT 14/0 and A TOWN IS SAFE 12/0 (both were on the
quarantine: struck); MAKE CAMP FROM THE FIGHT 11/0; THE CAMP LETS GO WHEN HE LEAVES green; THE CREW SCREEN SEES THE CAMP green; THE CAMP IS
THE FIGHT'S BOARD 34/2 (main's own files: 28/8; its two reds here are the sideways same-picture check that reads 1 to 5 percent of the glass
on main too, 'not measured' here); THE CAMP IS PITCHED ON THE BOARD 9/5, the very same five legs red on main's own files (B2 twice, B4
twice, B7 upright; quarantined there as LOAD); its B7 picture check re-aimed to the camp's ground made in memory ('camp:'); THE CAMP IS HIS
OWN: K7 red, red on main the same (below). Re-aimed this round to the camp's real behaviour: Cn4 reads YOU among his men when he lies hurt,
Cn5 asks the dead and the walls only of a man who is free (the camp's own rule).

RED ON MAIN BEFORE THIS (measured on main's own files, 14cfe9f3, the same box): THE CAMP IS HIS OWN K7 (the compass of danger at camp: no
threat read at all, every edge dark; CAMP TWO's leg) and its K4a and K4c (the hours healed the men before the leg read them; with this
build no hour runs before the camp stands, and both are green). Named, not mine to fix this round: K7 goes to the CAMP lane's next round.

## Landed on main ON TOP OF PLUMBER 8 (BUILD 11/22zz)

Main moved while this was proven: PLUMBER 8's THE CAMP LOADS IN ONE GO (11/22zv, 11/22zx; rule 472(e)) touched the same camp files.
How the two were joined:
- THE PICTURE HANDED is PLUMBER's convention: a plate keeps its canvases (P.cv, P.ncv), variantOf hands VAR.cv = {day, night}, his
  asPic(c, u) makes a canvas answer as a loaded picture. My own asPic is gone. The camp after a fight (fvLandedQuick) names its canvases
  camp:day / camp:night (camp:day+ / camp:night+ once both lights are in); HEAL's plates keep his camp-board: names.
- THE CLOCK, in campHour's order: MOTION 3's set-up hold (from this build every camp but a town's rest), PLUMBER's load hold
  (campStillLoading), then the whole stop (472(a)). All three stand.
- The look's '+' swap lays both lights from vv.cv (the day too, for a camp that stood on the night alone).
- HEAL's first light: one copy and one picture for both slots until the other light is in (it was two of each: at 4x CPU the HEAL camp's
  longest task read up to 1.09 s against PLUMBER's 1 s ratchet).
- Gates: THE CAMP IS PITCHED ON THE BOARD's picture check takes camp-board: and camp:. THE CAMP LOADS IN ONE GO's plant now also sets
  __CAMP_SETUP_FIGHT_ONLY and __CAMP_BREAKS_WHEN_WHOLE: his valley's company is whole, and under 472(a) a whole company's camp runs no
  hour at all, so his old ways need both back to read hours gone (its L3, on a whole company, is now held two ways: his load hold and
  472(a)).

RESULTS on the merged build, each gate ALONE on this box (a first pass with everything at once and the suite beside it, load 21 on 4
cores, read red on timing legs only, every one green alone): THE CAMP WAITS FOR HIM 18/0 (the demo upright and on its side); THE HEAL
BUTTON 16/0; CAMP HOLDS UNTIL HE ENDS IT 14/0; HEALING STOPS ITSELF AT FULL 8/0; A TOWN IS SAFE 12/0; THE DEMO BUILD green; THE CAMP LOADS
IN ONE GO 5/1 (the demo upright, CPU 4x, HEAL on the map: the camp's picture in 9.1 s, the longest task 868 ms, 3.1 s held in tasks over 50 ms; the old ways 19.5 s; its one red is L1's 9 s, and main's own files read 10.2 s on this same box, red the same: this box, not the build); THE CAMP IS PITCHED ON THE BOARD 9/5, the same five as main's own files (quarantined, LOAD); THE CAMP IS THE FIGHT'S
BOARD 31/5, every red one main's own files have (Cn3 on its side 'not measured', Cn5 quarantined as ask row 681); RUN TWO's THE CAMP
GATE (not in the suite) 5/3, main's own files 3/5 on the same box.

[bb Battle Brothers: camping is the party sitting on the map while the days run, and the bars fill; it never ends itself. Ours stops the
clock when they are whole and waits for his word.]
[analog horror: the clock stops on its own and the fire keeps burning; nobody moves on until you say so, and they keep moving about.]
