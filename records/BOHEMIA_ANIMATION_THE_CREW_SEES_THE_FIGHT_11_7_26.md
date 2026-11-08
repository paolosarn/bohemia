# THE CREW SCREEN SEES THE FIGHT (ANIMATION, 11/7/26; rule 369 amended 11/4, ask line 433; the coordinator's routine 'ANIMATION: crew screen after a fight')

His words, 11/4 (rule 369 amended): 'if I level up my character right after [a fight], and it's doing the victory screen and they're
scavenging the remains, if you bring up the crew screen it should be showing them in that victory scavenging background, not just them
at the camp.' The coordinator's brief: the battlefield with his men going through the dead, the fight's own board and the rig's existing
poses first (rule 430: layout and placement, not finished art), simple and quick, 60 on a phone, nothing shown he did not tap for (rule
433), inside UI 9's sizes (11/7i), and nothing of UI THREE's item boxes or shop.

## THE ANSWER (for him, eighth grade)

1. Win a fight, tap CHOOSE HIS LEVEL-UP on the end screen: the crew screen now shows that fight, not the camp. Same street, the dead
   where they fell, your men walking between them, kneeling to go through their coats, checking on the one who went down.
2. The man you picked stands in the middle of his sheet, the same size as always. Tap another man (in the line, or on the ground) and
   the camera glides to him in under half a second.
3. A man who ran from the fight is not on that street: he stands as his own figure in the middle, the fight behind him.
4. Every word on the picture has a soft dark shade behind it, so it reads wherever the street slides under it.
5. It costs about 1 to 2 ms a frame; the page holds 60 frames a second. Leave the end screen and the crew screen is the camp again.

## MEASURED FIRST

The demo (390 x 844), out of the town it opens in, a road fight won, one of his given a level, CHOOSE HIS LEVEL-UP tapped: the
company screen opened on COOK FOUR's camp picture (camp-0), his three men round a fire (records/target/animation/crew_after_fight/
before_phone.webp). The end screen behind it was playing RUN FOUR's aftermath (rule 245): the fight's own board, ANIMATION's loot and
tend (records/BOHEMIA_ANIMATION_THE_MINUTES_AFTER_A_FIGHT_10_26_26.md). Nothing new had to be drawn: the scene existed, one screen
back.

## WHAT WAS BUILT

- slices/BOHEMIA_ROSTER_SCREEN.html, the block __THE_CREW_SEES_THE_FIGHT__: campBg looks first for a finished fight behind the screen
  (campFightHost: a window up the chain is the fight, or holds #fightFrame, and its FIGHT.S.over); mid-fight and on the map nothing
  changes. It loads slices/bohemia_aftermath.js into the screen's own window and plays AM.fromFight(fight) on #campbg (one canvas,
  aria-hidden, no pointer). The end screen's own copy is paused while #crewdoor is up (its own paused()), so one scene plays at a time.
- The camera: follow() is the man picked; his feet on his figure's feet (campSpot), his people at the figure's 98 points (rule 21: the
  ground may zoom, the person may not), the ground at 1.5 covers of the glass (the town's) or closer where the scene needs it so every
  place his men go (the dead, a friend down, each other, a tile round) can be brought to the middle, never past the fight's near stop.
  MEASURED: at the end screen's own near stop the men are 196 points (twice the figure) and spilled over his slots and numbers; at the
  figure's size with only the cover the 20 x 15 board was as tall as the phone and nobody could be brought to the middle; on its side
  the man who walked to the bodies right of the board's middle was held by its edge 99 points off his sheet.
- A tap: in the line (his own choose) or on the ground (campMenOnGlass now reads the scene's men: standing, and a friend down where he
  lies) glides there in 450 ms, eased in and out, drawn every frame (the scene's life stays at its twelve a second).
- A man not on the board (he ran, or sat it out): the camera holds the scene's middle, nobody held under his figure, his sheet's figure
  shown (bm-camp-town off for him); measured first, the camera fell back to drifting and parked another man under his figure.
- The words: over the fight the camp's lamp stands down. MEASURED: measured once off the picture (the camp's way), a word inside the lit
  pool round him ('LEVEL 3: PICK 4 TO RAISE') went to 2.02 to 1 two seconds later as a pale wall slid under it, and the pool is never
  shaded; re-measuring every two seconds still dipped to 4.38. Now each word on the picture carries its own soft shade (a blurred
  rectangle, CAMP_SHADE, as dark as its ink needs over white: the worst the board can bring), built when his sheet is drawn (and looked for
  again every three seconds of the clock, never while the camera glides: 0.7 to 0.9 ms) and laid over each frame: nothing is read off
  the glass. Worst measured after: 7.04 to 1.
- slices/bohemia_aftermath.js, additive options only (the end screen passes none and draws as before): o.follow, o.glide, o.feet, o.man,
  o.cover, o.over; state() adds glides, glide, gliding, held and the lying men's names. The old 're-centre when holding nobody' line
  now stands for the end screen's camera only (it made the crew screen's camera jump instead of glide from the scene's middle).

## THE CHECKS

gates/the_crew_screen_sees_the_fight_gate.js (registered in the suite as THE CREW SCREEN SEES THE FIGHT), on the live demo, upright and
on its side, a real tap on the end screen's level-up: F1 the fight's own board (same baked picture, the dead and the down where they
fell, every man who can walk; no camp picture; the end screen's copy holds still), F2 his men go through the dead (each walks and stops
at a body or a friend, one kneels in a dead man's coat, the friend down gone to), F3 the man picked at his sheet's middle at 98 points,
his figure standing down, F4 a finger on each man in the line glides there under 550 ms, F5 a finger on a man on the ground, F6 a man
who ran stands as his own figure with nobody held under him, F7 nothing printed (one canvas, aria-hidden, no pointer, no fillText in
the player), F8 every word on the picture at 4.5 to 1 with the words taken out, four times, F9 the draw under 8 ms (12 at the 95th),
each glide drawn every frame, the page within 15 percent of the same page held, F10 DONE on the phone back to the end screen and its copy
playing again. PLANTED: the camp put back (the fight's end not read), the camera frozen on a tap, his men held still. 26/0 on the tree rebased onto
main (11/7za) and re-cut. The gate's own misses on the way, each its aim and not the screen: it read the camera before the glide began
(a wait lost with debug lines), it aimed at a man walking (the picture is now held still only while it aims), it aimed at the PICK 4
MORE panel and then at a 6-point gap between a stat bar and the armour line (a phone snaps a finger to the nearest control: it now needs
a finger's width of open picture), and on its side it looks for up to ten seconds for a man in the open band (his men walk there).
The touched files' other gates: THE AFTERMATH 9/3 (the 3 reds, two road fights held by the town the demo now opens in and D2's
p95 0.660, are on clean main too, measured on a copy of the tree with main's two files); THE CREW SCREEN SEES THE CAMP 30/3 (its map
camp step stays in the town, 'kind town': clean main the same); THE ROSTER SCREEN 15/0; THE SCREENS PAST THE PHONE 36/0; THE CREW
SCREEN AT FOURTEEN 20/1 (cut: Marisol, a standalone screen this never runs on; clean main the same).

## THE CARD

animation-the-crew-sees-the-fight-11-7 (STAND-IN: a layout and a camera from finished art, rule 430): slices/vote/
ANIMATION_THE_CREW_SEES_THE_FIGHT.html, BEFORE (the camp, measured first) beside NOW (the browser's own screen recording of the demo on
the phone's profile, packed into one moving webp at the game's speed, every frame through the glide: the end screen, the tap, Desi
kneeling at Raul who went down, the finger on YOU, the camera crossing the street to YOU kneeling at a dead man).
tools/bohemia_animation_crew_after_fight_capture.js and .py.

## WHAT IS LEFT

- The crew screen opened mid-fight still shows the camp (not asked; the aftermath's acts would be wrong while the fight is on).
- His gear changed on this screen does not change the man on the board (the board draws his fight sheet, as the town draws its own).

[bb crew screen]: Battle Brothers keeps its company screen over a painting of the camp's fire and ends a battle on a flat loot panel,
nobody shown; ours is the field itself, live, his men in it. [analog horror]: nothing filtered at the page: the scene is the fight's
own baked board and the aftermath's own tape (its lines every third row, its dark edges, R10 'grime is baked'); the words' shades are
the screen's light, not a filter on the picture.

## REFERENCE CHECK (the 9/4 duty)

No new art. The reference stays the aftermath's own (records/BOHEMIA_ANIMATION_THE_MINUTES_AFTER_A_FIGHT_RESEARCH_10_26_26.md: FM 3-21.8
consolidate and reorganize, TCCC, Sledge, Marshall). No reference game for the look.
