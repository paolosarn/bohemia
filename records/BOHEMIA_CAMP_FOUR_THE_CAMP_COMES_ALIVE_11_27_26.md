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

## After the build: HIS LINE IN CAMP (BUILD 11/27zo - THE BARS KEEP HIS LINE)

Found running the camp's own reds after the suite (THE BARS OVER THEIR HEADS was on the quarantine, CAMP's, 'UNSURE: one run's B4
detail decides'). B4's detail decided it, and it was this lane's own: since 11/26 (THEIR BARS AT A GLANCE) the camp drew the fight's
bars over EVERY man while anyone mended, a man at 95 percent among them, against his own words (rule 261(e) and 278(c), Paolo 10/26: 'if
they're at full health it never has to display... above 87 percent it doesn't display anymore... I need to see how everyone's
healing'). And the fill eased to the camp's acts' numbers, which are the hour the camp was opened: a man's bars never rose as the hours
mended him (THE CAMP READS AT A GLANCE's G1 passed on the ease alone, read when every man carried bars).

1. HIS LINE (slices/bohemia_camp_look.js barOf; `window.__CAMP_BARS_ALL` = the way it was): a man in camp carries his bars as he does on
   the map and in a town, under the condition's own line (bars().show: under 87 percent, or a fresh wound's days), none over it. A
   man's bars go the moment he mends past 87, as on the map; the stop reads EVERYONE WHOLE on the tape, and no bar stands.
2. HIS NUMBER NOW: the fill is the condition's hpF and armF (read at most five times a second), the numbers the map's and the town's
   bars draw; the camp's own numbers only for a man with no record. The rise eases in and shines as before.
3. The look's state let go of the bars it last drew when it draws none (`bars.at` stood after they went; G2 read it).

Gates: THE BARS OVER THEIR HEADS 12/0 phone and computer (was 6/6; LIFTED, its quarantine line struck, the ratchet and VAMILY's red
debt line 392/308). Its legs re-aimed and why: B1 and B2 (the map) waited for the shell's FIRST PLAY (PLUMBER 6
__FIRST_PLAY_IS_LIGHT__ holds the map's people sheets until it; the leg closed the start town before its picture was in, the hold stayed
on, his two men were never drawn: 'sheets: town:0, first: true'); B4 (the camp) reads the look's own men and bars (the camp is drawn by
its look on the fight's board since rules 406(b), 442(a), not by the settlement's folk: 'the camp has 0 men'), each fill against his
number within an hour's mending. THE CAMP READS AT A GLANCE 8/0 upright and 7/0 on its side (two runs; G3 on its side missed once with
the suite running: the tape's STOP read past its three seconds, green the next run): G1 and G2 re-aimed to the line, the cut 70 off
(was 45) so the bars stand long enough to read rising. STRUCK DOWN, HE STILL FIGHTS 36/0 (S6 waits for the camp's hours to start:
11 to 14 s on a box at a load of 14, the set-up's 2.25 to 4.5 s by design and the rest the load; shipped fb86e3699).

## After the build: A CREW AT CAMP FIGHTS HIM ON THE CAMP'S GROUND (rule 406(b)(c), the same build)

THE CAMP IS PITCHED ON THE BOARD (CAMP THREE's, quarantined 11/10 'LOAD: timed out') read 9 passed, 5 failed alone on main, both ways,
and its details were real, not load:
- B4 *** A CREW AT CAMP FIGHTS HIM THERE ***: MEASURED, one arterial block, one deal (2388192501), the same district and kind: the camp
  stood on 'strip + suburb + lots' (830c681d) and the crew's fight dealt 'yards + lots + suburb + culdesac' (a0edc23f). The one door
  (cityHandOver) stamps every fight with the place on its cell (WORLD THIRTEEN __THE_CUT__, msg.template) and the cell's ground, zone
  and street (__THE_GROUND_AND_THE_ZONE__, __EVERY_ZONE_ITS_GROUND__, msg.ground), and the fight deals its dressing from them; the
  camp's ask (campBoardAsk) carried neither, so the camp stood on a board no fight there is ever dealt. NOW (BOHEMIA_CITY_WORLD.html
  campStampLikeTheDoor, `window.__CAMP_ASK_PLAIN` = the way it was): the camp asks with the door's own stamps, so its ground is the
  board a fight there deals and the crew fights him on it (both 'yards + lots + suburb + culdesac', a0edc23f, every piece drawn). If
  the door's stamps change, B4 goes red.
- B2 (six and twelve men): the fixture broke the camp to stop its hours, and since MOTION 3's __THE_CAMP_LETS_GO_WHEN_HE_LEAVES__ a
  broken camp lets its board page go ('state: none'); it keeps the board while it asks (MOTION 3's own switch), green.
- B7 upright: the one dead man of that deal lay off the upright glass (the camp after a win is the fight's own camera, MOTION 3 rule
  442(a)): 'inView 0', so no man had a body to go through ('loot' never dealt). On its side green. The quarantine line stays, its
  reason this, owner CAMP FOUR.

## The full suite (the routine's first ask)

SUITE_RESULTS

[bb Battle Brothers: the company sits round the fire between contracts; the men are the life of the screen, and the day's clock is at
the top, always.]
[analog horror: the camcorder's clock burned into the top of the tape, and under it the fast-forward that stops when they are whole.]
