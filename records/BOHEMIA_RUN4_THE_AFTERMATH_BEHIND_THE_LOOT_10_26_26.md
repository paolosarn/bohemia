# RUN FOUR: THE AFTERMATH PLAYS BEHIND THE LOOT SCREEN (row [the aftermath plays behind the loot screen]; rule 245; 10/26/26)

## HIS WORDS
Rule 245 (Paolo 10/26, LOCKED): 'the background is all black... like when you're in the crew... instead a live show, as zoomed in
as it can be, of your characters looting the bodies, walking between them, talking about what's next... research what people
typically do after battles... animating in the background at a lower opacity... we're gonna need a bunch more animations across the
board.' Record of the ruling: records/BOHEMIA_PAOLO_OPTIMIZE_LOOT_AND_THE_AFTERMATH_BEHIND_THE_LOOT_AND_THE_FACES_BREATHE_10_26_26.md.

## MEASURED BEFORE
The shell lays the end screen over the fight in a frame on a flat #120e0a; the page's own ground was #0f0c09. Wherever no plate stood
(the margins, the gaps, under the crew on a computer, around every section head) the screen was black. The fight that just ended was
still standing behind it the whole time (its frame is taken down only on LEAVE), its board baked, every man's sheet in memory.

## WHAT MEN DO IN THE MINUTES AFTER A FIGHT (research, rule 245(b); sources recalled, marked as recall)
- THE ARMY'S WORD FOR IT IS CONSOLIDATE AND REORGANIZE (US Army FM 3-21.8, The Infantry Rifle Platoon and Squad, 2007, recall):
  security first (men out on the edges facing away), then the wounded treated and moved, the enemy dead and wounded searched for
  weapons, papers and anything of use, ammunition counted and shared out, and a report up the line of water, ammunition, casualties
  and equipment (LACE). The order matters: nobody searches a body before somebody is watching the street.
- THE QUIET AND THE SHAKING (Dave Grossman with Loren Christensen, On Combat, 2004, recall): when the fight stops the body pays for
  the adrenaline; hands shake, men go heavy and slow, some can not stop talking, some say nothing. The first minute is nobody moving.
- LOOTING THE DEAD IS OLD AND PERSONAL (E. B. Sledge, With the Old Breed, 1981, recall: Marines on Peleliu and Okinawa going through
  the Japanese dead for pistols, flags, watches and gold teeth; the Waterloo battlefield stripped of boots, coats and valuables in
  the night after the battle, by soldiers, camp followers and locals; the teeth pulled for dentures sold as 'Waterloo teeth',
  Paul O'Keeffe, Waterloo: The Aftermath, 2014, recall). A man going through a body kneels by it a long while, alone.
- A SMOKE AND A TALK: in the memoirs of both world wars the cigarette after the shooting stops is near universal (cigarettes were in
  the ration), and the talk is low and about the next thing: who is hurt, how far to the town, what it pays.
- [bb] BATTLE BROTHERS shows none of this: the after-battle report is a flat panel, then the loot screen. Its fight leaves the bodies
  where they fell and the company's wounds carried; the minutes after are left to the player's head.

## THE FINDING THAT PROVED US WRONG
Our first cut had every man who could walk go straight into the dead, the friend down first. The doctrine says SECURITY FIRST: with
three or more standing, one man goes to the edge of the group and stands facing out, away from the dead, before and while the others
search. Built: with three or more up, the last of them takes the watch first (he stands a few bars facing out from the bodies), then
joins the search. With two, both go to work: there is nobody spare, which is itself the lesson.

## WHAT IS BUILT (slices/bohemia_aftermath.js, laid behind slices/BOHEMIA_SPOILS_SCREEN.html)
1. THE FIGHT'S OWN BOARD: read off the fight frame still standing behind (FIGHT through its own eval, as the shell's nfFight reads it;
   FIGHT_UI.board, the board baked for this fight with its ground, cover and lamps; lookOf, sheetOf (the night's copy where no lamp
   reaches), gunSheet, the packed atlases the fight holds, its BohemiaIdles). Nothing is loaded that the fight did not already hold but
   ANIMATION's act sheets (his smoke and his talk); the cost is one canvas.
2. WHERE THE DEAD FELL: every man of theirs dead and every man of his dead or down lies on his own tile in the fall's last key, a pool
   under him (the fight's own colour and size).
3. HIS MEN WHO CAN WALK: a quiet first (two to four beats nobody moves); the watch (three or more); a friend down is gone to first and
   stood over (the 'tend' stop); then body to body, each body given to the man nearest with fewest, a third of a tile beside it facing
   it, eight to twelve beats; a smoke for the man whose look has ANIMATION's smoke (YOU); two of them meet half way and talk (YOU's
   talk turns, the other in his idles); then round again. Walking is his fight sheet's walk (the carry walk with a long gun in his
   hands; a pistol is put away), on the tiles a man can stand on, at 0.6 of a house tile a second, the walk's six keys a second.
   Standing is his idles (he breathes and shifts his weight: engine/bohemia_idles.js), facing what he is at.
4. THE CAMERA: the fight's near stop (a house tile 121 css px, the man at his 104: the closest it zooms, the person never past it),
   following one man four bars then the next, half a second behind, like a hand-held camera; on a phone his feet are held in a window
   on the field (30 percent of the screen's height) between the result bar and the crew, where the scene plays clearest; on a computer
   the open ground beside the crew.
5. DIMMED TO THE FLOOR: 56 percent black over it, a vignette to the edges, faint scanlines every third row (the camera is a tape: the
   analog horror is at the source, not a filter on the UI). Every word that stands on the scene and not on a plate (the section heads,
   their counts, the fight's lines) carries its own dark ground (84 percent) and a soft shadow, so it reads at 4.5 to 1 or better.
6. DRAWN ON OPEN, KEPT ON THE BEAT: the first picture is drawn the moment the screen opens; then twelve frames a second (twice the
   walk's six keys, six a beat at 120) while the screen
   shows (stopped when the crew screen lies over it or the tab is hidden); LEAVE stops the clock and lets go of the fight's board and
   sheets before the shell takes the frame down.
7. ANIMATION'S [the minutes after a fight] PLUG IN WITHOUT A CHANGE HERE: a stop's act ('loot' at a body, 'tend' by a friend) is asked
   of BohemiaIdles.activity(look, seed, now, face, {act}) first; the day his look has those sheets, the man kneels and goes through the
   pockets instead of standing over the body.

## THE GATE: gates/the_aftermath_gate.js (in the suite as THE AFTERMATH)
A1 the page alone: drawn on open, never black, the sample men in acts; LEAVE (a real tap) stops it. Then the live demo, two rolled
road fights on a phone and one on a computer: D1 the same baked board the fight holds, the dead and down where the fight left them,
every man who can walk; D2 never black (the window's or the open ground's luminance and spread); D3 twelve seconds: every man who
can walk seen walking and seen stopped at a body or a friend, the friend down gone to; D4 every word on the scene at 4.5 to 1 or
better, measured off the screen with the words taken out (only words he can see: a word under the bar or the strip is not on the
scene); D5 the back's draw at its twelve frames a second under 60 ms of every second (6 percent of the thread) and under 12 ms at the
95th (never a frame's budget), the page's frames a second with it playing within 15 percent of the same page with its clock held
(this box draws a 3x phone's glass at about 27 a second with no GPU whatever is on it, a computer at 60), the canvas and its overlay
under 12 MB (the dim, the vignette and the scanlines are one picture made once for the screen's size and laid over each frame in one
pass: 2.6 MB the pair on a phone, 10 on a computer), nothing the end screen loads for it but ANIMATION's act sheets.
THE RUNS, SAID HERE: first 15/5. Two of the five were the gate's own (a word under the strip measured against the strip; the fight's
own loads counted as the scene's); the phone's 22 frames a second was the box's (27 with the scene's clock held, 24 with it running);
the worst single frame (32 ms, once) is the first decode of an act sheet, so the line holds the 95th. Third run 17/3, and two were
real: the man on the watch never left it (he had no body to go to after it: he joins the search now), and the vignette as a CSS layer
over a canvas that changes cost the phone's glass 30 percent of its frames on this box (19 against 27): it is back in the canvas as a
stretched 96 px picture and a pattern, at twelve frames a second. Fourth run 18/2: still 21 against 27 on the phone with only 16 to 46
ms of script a second, so the cost was the glass taking 1.3 million new pixels twelve times a second: the canvas is now one pixel a
css pixel (a ninth of the phone's device pixels), stretched with no smoothing; the man's sheet pixel lands on the same three device
pixels the fight gives it (the fight's rigScale at the near stop is the device ratio). And one two-second sample of the page's rate
swings 15 percent here (held 27, 26, 30; running 22, 27, 28 on one fight), so the line compares the medians of four turns each way.
Fifth run 19/1: the phone in its line (26 against 27, 9 to 20 ms of script a second); the computer at 65 ms a second of script over
the 60 line, its four full passes a frame (the board, the dim, the vignette, the scanlines): the last three are one picture now.

## WHAT IS NOT DONE
- No kneel, no binding a cut, no reloading: those are ANIMATION's [the minutes after a fight] (OPEN on its board). Until they land a
  man stands over a body breathing; YOU smokes and talks with his own pictures.
- The other men's talk is their idles: ANIMATION's town acts exist for YOU and the town's people, not for the cast's fight looks.
- The struck-down friend lies still; a wounded man's reaction (rule 246(b)) is PORTRAIT's face first.

[bb] Battle Brothers leaves the minutes after a fight to the player's head; ours plays them on the fight's own ground, a man to a body,
the friend first, a smoke, the talk.
[analog horror] the camera on his men after the shooting is a tape: scanlines, the edges going dark, and the bodies never get up.

THE LAST RUNS, SAID HERE: sixth 19/1 (the computer's script 60 ms a second against a line of 60 it had picked for itself, the page at
60 of 61). That line had nothing under it, so it now names what it protects: the back's draw under half a 60 Hz frame on average (8 ms)
and never a frame's budget at the 95th (12 ms), the page's own rate within 15 percent of the same page with the scene held. The board's
blit is cut to the view. On the shipped tree: 20/0 (the phone 14 and 25 ms of script a second, its rate 25 and 26 against 27 held; the
computer 55 ms, 60 against 60).

AND, ON A LATER TREE (10/26, with [every level waits for him]): D3 went red once: YOU walked the whole twelve seconds toward the dead
of a fight won at the first contact, eight tiles off, and stopped at none. A long leg is now a hurried one: never more than five
seconds a leg, his steps quicker with it so his feet never slide. And the scene's draw is wrapped: one bad picture costs that frame,
never the scene or the console (state() counts it as errs).
