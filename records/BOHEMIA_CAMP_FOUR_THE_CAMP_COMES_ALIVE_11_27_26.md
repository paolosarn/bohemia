# CAMP FOUR: THE CAMP COMES ALIVE, THE CLOCK AT THE TOP, HEAL WARM (11/27/26)

VAMILY rules 482, 487, 472(b)(e), 484 amended, 441. The coordinator's routine 'CAMP FOUR: rule 482' (11/27): "run the full suite you
skipped, then camp better again: time passing in camp ties to the clock now moving to the top of the screen (rule 487, UI FIVE), HEAL
never slow, and the crew idling looks alive. Ship a build he can see." BUILD 11/27s - THE CAMP COMES ALIVE. BUILT, NOT YET SEEN (rule 179).
Improve, not add (480(b), 482(d)): the acts are ANIMATION's, already drawn for every man; the clock is the camp's own tape moved; the
warm page is MOTION 3's, read at a new moment.

## His words

> "I feel like the players aren't connected to the time in the day, so... take it off the phone and put it at the top of the screen
> cause I feel like people aren't connecting" (11/27, rule 487)
>
> "I still want the characters to move around as they were, doing whatever, just breathing and idling around... see them chilling"
> (11/22, rule 472)
>
> "combat keeps crashing, like when I get into combat and then when I finish it, it's insane" (11/27, rule 484 amended: read before
> the HEAL change below, and it moved where the page is read)

## What it looked like (main 1a47fd794, the demo)

- THE CREW: a camp made whole, its clock stopped: three men in three still poses a camp apart (the crate, the pot, YOU by the cart),
  none turned to another; every six seconds one carried to the next of the same four jobs (the pot, the gun, the crate, the watch).
  ANIMATION had drawn every man of his in acts the camp never asked for (slices/rig_town, 16 looks: talk, smoke, drink, sit, light).
- THE TIME: the tape in the camp's top corner while the hours ran, gone at the stop; the day and the clock on the phone only (UI
  FIVE moved the clock to the bar the same round).
- HEAL: the camp's first frame 8.0 to 11.4 s after the press on a slowed phone (4x; 1.8 s at full speed), most of it a hidden copy of
  the fight page read cold to bake the camp's ground (5.6 s of 8.9 s at 4x, the profile: '(program)' 6.2 s, the page's 1.25 MB of
  HTML and 0.8 MB of scripts). A camp after a fight no longer needs that page (its board handed at the tap, CAMP FOUR 11/26l), so since
  then nothing read it ahead for HEAL.

## What changed (each with its switch back)

1. THE CREW LIVES (slices/bohemia_camp_look.js livesActs, livesSpots; `window.__CAMP_IDLE_PLAIN`). Once they are whole, the men with
   nothing to do (never YOU, never the hurt, the dead's man or the wall's man) live a scene: two face each other a stride apart and
   TALK (ANIMATION's talk, the hands going), one SMOKES or DRINKS by the fire, they SIT round it on crates; a lone talker goes to the
   nearest man, who turns to him. The scene turns one man at a time (the same six-second drift, the same walk), and the hour picks the
   scenes: mornings the pot and talk, afternoons talk and smokes, evenings round the fire; by night they sleep and one keeps watch, as
   before. The phone's words for the four new acts: draft:true.
2. ONE CLOCK AT THE TOP (bohemia_camp_look.js tapeDraw, topClockEl; `window.__CAMP_TAPE_CORNER`). UI FIVE put the day and the hour at
   the map's bar's right end the same round (BUILD 11/27f THE CLOCK UP TOP, rule 487 is theirs; it reads the map's clock twice a second,
   so it races while the camp's hours run). The camp now draws NO clock of its own under it: the tape's line hangs right under their
   clock, '+N HOURS' with the fast-forward on the beat while the hours run, 'STOP  EVERYONE WHOLE' three seconds at the stop, then
   nothing, so the one clock at the top runs and the tape says why. When there is no clock on the bar (any page that wears none), the
   camp's own stands in at the top in the middle: 'DAY n  HH:MM' with the sun by day and the moon from six, the tape's line under it.
   Found in any page above the camp's (their #bmtb .s.clk, or anything marked data-top-clock), read twice a second, never a frame. The
   camp hands its time to the top page every hour (`top.__CAMP_TIME` = { on, day, min, night, hours, running, whole }, the event
   `bohemia-camp-time`).
3. HEAL IS WARM (BOHEMIA_ALPHA_0_9.html campWarm, campWarmLater, campWarmTake, campWarmDrop; the camp board's shellWarm;
   BohemiaMapCamp.mending; `window.__HEAL_COLD`). After LEAVE from a fight with any man still mending, once the fight's page is gone and
   the map has been back four seconds, the camp's page is read in the map's idle time and kept hidden while someone still mends; HEAL
   takes it and only bakes. Idle it holds no pictures (0 canvases) and about 6 MB of script; reading it is two tasks of 56 ms at full
   speed (218 and 175 ms at 4x). NEVER ON THE LOOT SCREEN: the first version read it there (as MOTION 3 did for MAKE CAMP); rule 484
   amended (his iPhone dies going into and coming out of a fight) moved it to the quiet map, so no page is added while the fight's is
   alive. It goes when a fight's card comes up or a fight opens (one hidden fight page at a time), when every man is whole, after ten
   minutes, or when a camp is made off the fight.

## Measured

- HEAL, the demo upright, full speed: a fight won, LEAVE, HEAL: the camp's first frame 849 to 1,319 ms warm, 1,773 to 1,830 ms cold
  (__HEAL_COLD). At 4x with the page warm: 4.7 s (8.9 to 11.4 s cold, the full suite running beside it).
- THE CREW LIVES (the gate, the drift hurried for it): talk, smoke, drink and the pot seen; DESI and RAUL face to face 75 px apart in
  17 of 70 reads; never two men on one spot.

## Gates

THE CAMP COMES ALIVE (new, gates/the_camp_comes_alive_gate.js, in the suite): C1 one clock at the top (UI FIVE's, the tape under it)
and C2 the camp's own when the bar has none, both ways; C3 the crew lives, C4 HEAL warm and P1, upright: 7/0 (warm 1,238 ms, cold 2,704
ms, the full suite running beside it). THE CAMP READS AT A GLANCE's G3 RE-AIMED (rule 487): the tape's words go at the stop, the clock
stays: 15/0.

The camp's own, one at a time on this build: THE CAMP WAITS FOR HIM 18/0, HIT THE ROAD (upright) 7/0, THE CAMP LOADS IN ONE GO 6/0,
MAKE CAMP FROM THE FIGHT 11/0, CAMP HOLDS UNTIL HE ENDS IT 14/0, A TOWN IS SAFE 12/0, THE HEAL BUTTON 16/0 twice (15/1 once on H5, and
15/1 once on main's own files: the leg flickers on both). IN AND OUT THE IPHONE'S WAY (PLUMBER 8, rule 484) 7/0 with the warm page in:
back on the map 120 and 128 MB of canvas. THE FIGHT IS READ WHILE HE READS THE CARD 15/2 here and 15/2 on main's own files (W3 and W4,
named for PLUMBER 8). UI FIVE's THE CLOCK UP TOP: 17/1 and 16/2 here on K2 (the bar read 1.1 s after the clock is moved, on the alpha),
18/0 twice on main; measured by hand on both under the suite's load (the box at a load of 19 on 4 cores): the bar caught up in 1.3 to
1.7 s on main and on this build alike, the read's window; UI FIVE re-aimed it on main since (8d668cfa4, 'reads the bar against its own
painting').

## The full suite (the routine's first ask)

SUITE_RESULTS

[bb Battle Brothers: the company sits round the fire between contracts; the men are the life of the screen, and the day's clock is at
the top, always.]
[analog horror: the camcorder's clock burned into the top of the tape, and under it the fast-forward that stops when they are whole.]
