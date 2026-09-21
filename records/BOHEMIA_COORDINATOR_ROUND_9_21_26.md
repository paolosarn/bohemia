# COORDINATOR ROUND 9/21/26 -- THE SWEEP, THE SWING, AND TWO DECISIONS OF MY OWN
# Sweep: every lane commit on main between d71e8dde and b4cac34f (34 lane commits).

## WHAT SHIPPED TO THE ALPHA (stamp 9/20d) AND THE DEMO (re-cut, 9/20c)
- RUN [one camera] SHIPPED 930e2bf3 + 9049a4ea: one walk stop (HC 11, a house fits), the body
  one size at every zoom (CHARACTER b6d2fcdc), a stride that never passes a gap and slides
  along a wall. Numbers: stuck presses 12 of 40 -> 0 of 45; gaps walked past 14 -> 0; cells
  crossed 410 -> 685. Cost: he cannot zoom in while walking.
- UI [notes button] SHIPPED 2f0706cc: the pencil, top right of the demo (TAB: CITY). Each note
  carries stamp, mode, district, cell, day, clock, seconds and a small frame; exports .txt.
- PORTRAIT [matches body] SHIPPED 2c994a15: 23 of 200 citizens wore two hair colours (near-white
  portrait over a near-black head); 0 of 200 now.
- COMBAT [fight looks] V222 b4cac34f: the fight painted a whole house lot with ONE 44 px tile
  smeared over 12 m; a board cell now draws the lot as 16x16 of the walked city's own cells
  (211 cells carry 54,016 street cells). Row stays CLAIMED: zero shared art with the street,
  a lane marking 12 m wide, the roof reads as a floor, a grid the street does not draw,
  two device pixel ratios.
- DIRECTION [analog horror] SHIPPED 14e03eb6: THE BIBLE, ten rules, pass/fail matrix, AH-01/02
  in the reference library. THE FIGHT VERDICT round 1 posted (8cd5db44).
- PLUMBER [never worse] built 43567ef6: NEVER WORSE in the suite refuses a worse cut (planted
  2.5 s freeze: refused; unchanged tree: accepted). Not in it yet: the fight.
- ECONOMY Q47 SHIPPED; WORDS Q5 round two SHIPPED (17 cards draft:true); COOK closed the
  PAGES PUBLISH red (a stray graveyard/ folder since 9/15).

## MEASURED, NOT FIXED, ROUTED (the jobs written this round)
- ANIMATION e764a506: one press is 25 paces, 18.75 m in half a second (135 km/h); the feet
  cover 3-11% of the distance and the body skates 244-374 px on a 390 px phone. A walk cycle
  cannot depict it. -> DECIDED BELOW (the tape skip).
- LIFE+CITY c4e08b82: 46 of 80 presses did nothing before [one camera]; 0 under the landing
  rule. Found: a full stride overshoots a place nearer than a stride (a road 21 cells away:
  one cell at a time arrives in 21 presses, a full stride never arrives). -> RUN [land on it].
- RUN 930e2bf3: five presses on his own block go into ground a body cannot reach; 45 doorsteps
  with 0 straight walkable ways out; the suburb generator seals yards. -> LIFE+CITY [sealed
  yards], un-held because it is walking.
- ANIMATION: two live numbers for a lot (LOT_FINE 24, lotFine 25, STEP_CELLS 25). Rule 16
  says one constant in one place. -> LIFE+CITY [one lot number].
- CHARACTER ca1e1d1a: the same person is 3.03x smaller the moment a fight starts (37 px vs
  112). COOK 60a52ac9: the fight is its own 1.4 MB document with its own tile bank (the grey
  street from before the 9/13 recook, 8 of 8 road and 8 of 8 walk tiles byte-identical to
  the old bank), never calls engine/bohemia_combatfloor.js, draws two grids, 21 of 33 ground
  tiles over the colour ceiling, the purple reservation broken five ways. -> notes on COMBAT
  [fight looks]; the law below.
- PLUMBER: dead presses bimodal across seven runs of one tree (0,1,1,1,13,14,0), cause not
  found; the encounter door is not exposed to the driver so the fight is NOT REACHED.
  -> PLUMBER [bimodal dead], RUN exposes the door for [fight reached].
- SOUNDS c88d7cc2: a loading screen that blocks the tap cannot make a sound (0 audio objects
  before the door; the door tapped at 16.5 s; the first music at 33.0 s). -> DECIDED BELOW
  (one BEGIN tap). Footsteps: the limiter is 0.12 s and a beat is 0.5 s, so footsteps may fire
  four times per ruled step; not measured yet. -> SOUNDS [footsteps on the beat] after the hold.
- FACTIONS 51c1f984: nine of nine of its shipped sentences have no mouth; the pop-up card at
  the door is 310,716 px of a 378x815 screen; a speaker card with a name and a line ALREADY
  EXISTS (#ctcard) and a portrait pipe ALREADY REACHES the city with one slot (the player's);
  the nearest person is 2 away and TALK appears at 1. WHO SAYS THIS gate 9/0, a ratchet at
  nine. -> the fourth thing is wiring, not a system: PEOPLE [face at the door] and UI [talk
  panel] build on #ctcard + a second face slot.
- QUESTS e7e9ab81 + c18e881f: 21 bodies on his block, 0 of 21 have a name, nobody can speak,
  nothing draws a face where a person speaks; the required role (TRADES) has 0 members within
  a block. DECIDED by QUESTS: the lineman comes to your door; the work stays six blocks east.
  -> PEOPLE [a name] (the name goes to the VOTE tab as IDENTITY, his).
- WORDS Q27 school 2fa05761: over 3,014 spoken lines, 8 name an institution (0.3%); the
  institution has to exist first; the register is legal on about 4% of words (machine labels
  and the phone); the real-world skeleton is a disconnection notice and an emergency alert,
  issued in English and Spanish. -> Q27 round two writes the first notice; ECONOMY Q48.
- WORLD a668f2c8: "BATTERIES IN THE VALLEY: 0" is a lazy seed (the purse is made on first
  read and nothing reads it before the first card); night two conjures 3,352. Fix written,
  not shipped; the card dies under rule 19 and the fix lands on the phone.
- PORTRAIT: 65 of 200 bodies show no eyes (53 behind shades, 7 under a hat) while their
  portrait has bare eyes. -> PORTRAIT [shades on].
- UI: the VOTE tab does not list his notes yet. -> note on [vote tab].

## TWO DECISIONS OF MY OWN (EVERYTHING IS A THUMB; both go to the VOTE tab as PHILOSOPHICAL items)
1. THE STEP IS A TAPE SKIP. One press is one house on the beat (rule 16) and no walk cycle can
   depict 25 paces in half a second. So the body does not skate: on the beat he is standing at
   the next lot, and between the two there are two or three frames of the walk (a drop-out),
   the way a tape skips. Under the analog horror law that is the genre's own grammar, and it
   is cheaper than a run cycle. ANIMATION [tape skip] is un-held for it because it is walking.
   His to correct.
2. THE LOADING SCREEN ENDS IN ONE TAP. "Nothing tappable until loaded" stands for every game
   control; when the load is done the screen says BEGIN and takes one tap. That tap is the
   browser's gesture, so the first sound (a room hum under the analog horror law) plays at
   the tap and covers the 16.5 s until the first song, and the vote tab (alpha) or the world
   (demo) opens under a hand that meant it. RUN [loading screen] carries it; SOUNDS [first
   sound] is un-held for the hum alone. His to correct.

## THE SWING: ECONOMY Q48, WHO STILL SENDS THE BILL
WORDS found the skeleton (a disconnection notice survives its author). The economics of that
are real and documented: utilities that kept billing after the state stopped delivering
(estimated bills after a grid failure, water shutoffs enforced on a bankrupt city, hyperinflated
utility bills nobody could read, a collapsing state's utilities that kept meters and lost the
plant). Q48 asks: who still sends the bill in a valley where nobody can make a cell, what a
household does with a bill from a dead institution, and what that puts on the phone he opens.
It is the analog horror line for ECONOMY, and it feeds WORLD's fold and WORDS' notice.

## ONE LAW OF MY OWN
laws/BOHEMIA_LAW_THE_GROUND_MAY_ZOOM_THE_PERSON_MAY_NOT_9_21_26.md: four lanes measured the same
defect built twice for the same reason. Named so it is not built a third time.

## THE THING HE NEVER OPENED
The notes button: the pencil at the top right of the demo (TAB: CITY). He asked for it; it is
there; he has not tapped it.
