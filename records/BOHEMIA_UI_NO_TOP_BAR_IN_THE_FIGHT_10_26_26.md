# UI [no top bar in the fight] -- rule 280, 10/26/26 (session ui-no-top-bar)

## HIS WORDS (records/BOHEMIA_PAOLO_NO_TOP_BAR_IN_THE_FIGHT_10_26_26.md)
'when it's combat mode I don't need to see my batteries and the time of day... in combat it can completely go away'

## MEASURED BEFORE (the demo, BUILD 10/26zzi, the toll crew on the road, through the map's own door)
- Phone upright (390 x 844): the fight wore the map's whole bar across its top, 0,0 to 390 x 108 (DAY 1 and the hour's dial,
  the crew 3/20, 290 batteries, food and water 21, tape 40, meds 30, rounds 80). The fight measured its board under it: TOPH 108.
- Phone on its side (844 x 390) and a computer (1440 x 900): one row, 60 points, the same facts.
- The loot screen (RUN TWO's spoils door, the whole glass at z 8000) wore no bar at all; YOU WON sat at the top of the glass.
- MOTION held a copy of the map's bar over the clouds until the fight's own bar was up (rule 229's 'nothing blinks').

## WHAT IS BUILT (slices/bohemia_ui_materials.js; a marked block in slices/bohemia_motion.js)
1. THE FIGHT DRAWS NO BAR WHILE IT IS ON. hudFight() still builds the one bar in the fight's #top (the phone's CREW, NOTES and
   SETTINGS press its very buttons, UI TWO's barPress: one handler each, no button twice), but html.bm-nobar keeps #top off the
   glass (display none) for as long as COMBAT's FIGHT.S.over is false. No batteries, no supplies, no clock, no day. The fight
   measures its top as 0 (TOPH 0), so the board gets the bar's room: the board's share of the glass, the toll crew, went from about
   72 to 85 percent with the phone upright, 49 to 64 on its side, 76 to 83 on a computer (the bar was 108, 60 and 60 points).
2. THE BAR COMES BACK THE MOMENT THE FIGHT IS OVER. A 100 ms watch on FIGHT.S.over lays the map's facts, takes the class off
   and drops the bar in from above the glass through MOTION's one layer (BohemiaMotion.fly, on twos, the tin leaning; a fade in
   place under LESS MOTION). If the same page starts again (COMBAT's start()), the bar goes off again.
3. THE LOOT SCREEN WEARS THE BAR. hudLoot() builds the same bar at the top of RUN TWO's spoils screen (#bmloot, sticky), painted
   from the MAP's parts every half second, in the map's rectangle to the pixel (390 x 108 upright, 844 x 60 on its side,
   1440 x 60 on a computer); the screen's own head (YOU WON, the tally) sits under it and sticks under it as he scrolls
   (--bm-hud-h). The phone's own rule reaches that page (html.boh-phone-on), so there the bar's gear and NOTES step aside and the
   crew chip is a readout: the loot screen's own LOOT ALL, MAKE CAMP and LEAVE are its presses (286(b)).
4. THE DOOR (MOTION's file, marked __NO_TOP_BAR_IN_THE_FIGHT__, NOTE on MOTION's board): the map's bar is no longer held over the
   clouds waiting for a fight's bar (it would have hung there to its 12 s timeout); it LIFTS OFF the top of the glass as the
   clouds roll in (a leaving piece, 250 to 500 ms planned), and the map's own sits at opacity 0 under the clouds and the fight
   until nfHome lays it back (barBack, plus a half-second watch for a fight closed by another door). Going home the existing
   hold carries the fight's bar (up again at the over) to the map's.

## MEASURED AFTER (three screens, two rolled road fights each: the toll crew and two patrols; no page error)
- In the fight: no #bmtb drawn on any page, nothing at the map bar's place hit-tests to a bar, no DAY n, no hour, no battery count
  in the fight's words, the shell's or the phone's drawn face (the phone's home clock sits under its opaque fight face and is
  not drawn); TOPH 0.
- The phone's CREW opens the one company screen over the fight, SETTINGS the game's settings, NOTES the notes (a note saved there
  is in the same notes, marked as the fight).
- The loot screen: the bar in the map's rectangle within 1.5 points, the same day and crew, the batteries a number; YOU WON whole
  under it.
- LEAVE: the map's bar whole (opacity 1), on top, at its place.
- MOTION's log: the lift 312 to 524 ms, 0 frames without it; the hold home 5 to 11 ms, 'the real one is back'.

## GATES (rule 13)
- NEW, in the suite: gates/no_top_bar_in_the_fight_gate.js, NO TOP BAR IN THE FIGHT (rule 280(d)): N1 to N7 on phone upright,
  on its side and a computer, two fights each; five plants (the fight's bar forced back, a clock on the fight's glass, a clock on
  the phone's fight face, the loot screen's bar hidden, the map's bar left see-through); 62/0.
- RE-AIMED, each marked in its own words: ONE HUD EVERYWHERE 64/0 (the fight's half: no bar, TOPH 0, CREW/SETTINGS/NOTES the phone's,
  a plant of the bar forced back); THE DAYS ONCE 59/0 (nothing across the fight's top, TOPH 0); THE UI MORPHS M8 (MOTION's; the bar
  lifts off at the door in budget, no bar in the fight).
- THE UI BELONGS TO THE WORLD gains THE NOTES (the box on board, his words on paper, the presses tin, SAVE amber, every word 4.5 to 1
  in the sun; nothing changes size).

## ALSO: THE UI GOES CRASHBOX, THE NEXT TWO PIECES (rule 130(b), Paolo 10/23: 'the UI kind of still sucks, it doesn't look as
## elevated as the Crashbox style'; the coordinator's order item 4)
Swept every box he touches against the kit's table (KIT_RULES): the meet card, the settings, the crew screen, the town, the loot
screen and the phone already wear rendered pieces. Two did not hold up:
1. THE NOTES BOX (the one he writes to the manager from, the phone's NOTES on the map, in the town and in the fight) was the last
   box he touches still drawn as a flat plate (#notecard: one colour and four inset lines). Now: a sheet of the rendered board, what
   he writes on the rendered thermal paper in the receipt's ink (he writes on the till roll the game prints on), CLOSE, COPY ALL and
   EXPORT tin, SAVE AND KEEP PLAYING the amber tin; NOTES, where he was and the notes he kept printed light on the board. Same boxes,
   same sizes (the kit's own rule: measured with the kit on and off). Picture: the notes on the map, phone upright, this round.
2. AUTO'S WORD IN THE SUN: the fight's AUTO wears COMBAT's odds tint (rule 144) laid by multiply, which darkened the tin under the
   word to 3.28 to 1 in the sun (THE UI BELONGS TO THE WORLD red ON MAIN before this round, measured with main's file). Laid by
   'color' now: the tin keeps its own light and takes only the hue, green when the fight is his, red when not; the tint's element
   and numbers stay COMBAT's (NOTE on COMBAT's board).
No Blender in this container (and no installs), so nothing new was rendered this round: both pieces wear the kit's existing renders.
The fight's thin bars over the men (COMBAT's canvas fills) are the next flat thing; a rendered bar piece needs the Blender pass.

## WEAK, SAID
- On an iPhone in standalone mode (viewport-fit cover) the board now runs under the status bar's safe area at the top; the
  phone's browser chrome covers that on the web. COMBAT's camera reads TOPH; a top safe-area margin is COMBAT's call (NOTEd).
- The loot screen's bar is a readout while the phone is under the spoils door (the phone stands at z 60, the door at 8000):
  settings and notes are not reachable on the loot screen, as before this change (NOTE UI TWO, RUN TWO).

## [bb] Battle Brothers' tactical screen keeps only the turn order across the top and the man's bar at the bottom; the world map's
   money and food are not on it. The loot screen after a fight shows the company's crowns and food again. We do the same.
## [analog horror] the bar is a tape label peeled off for the fight and pressed back on when it is over: the fight is the part of
   the tape with no label on it.
