# RUN TWO -- [the walk-up] and [the camp and the retinue] (10/25/26)
Rules 138 and 151(d). Opened by the coordinator (rule 112), no card (rule 127).

## [the walk-up] -- SHIPPED (BUILD 10/25n)
His words, 10/24: 'the main character of the group, or any member with the highest level... when you click anything or someone,
you still talk to them at pretty much the same speed, but you see your main guy or woman walking up to them'.
- WHO LEADS: YOU while he is in the company (the main character never dies); a company without him, its highest level.
- HIS BODY: the fight's own sheet (slices/fight_rig, eight facings, the six-key walk), a door tall like everybody; standing, he
  breathes on ANIMATION's idles (slices/rig_idles 'you').
- THE TAP: the sheet opens on that same tap (5 ms measured, finger up to sheet on); he walks beside it at the fight's pace (one
  stride every two beats, 120 BPM), straight when it is a few steps, down the street (the walkers' lanes) when it is far or a
  building is in the line; an eighth of a turn a key, never a spin; he stops beside the man or the door's keeper, facing him.
- THE SHEET COVERS THE STREET: a tall sheet slides the town up so his feet and where he is going stand above it (the hall on
  a phone: 169 px), back down when it closes.
- Gate: gates/the_walk_up_gate.js, 8/0 on the demo, real fingers.

## [the camp and the retinue]
His words, 10/24: 'if you want time to speed along, there should be a camp button: wherever you're posted up you make a camp
and upgrade your camp; depending on what tile you're on it shows up on that street tile, kind of like the settlement menu,
with the cabin and all your members; and you can hire people to join you, Battle Brothers calls it a retinue'.
HOW BATTLE BROTHERS DOES IT (the library): the retinue screen IS a campfire with tents (the wiki's Retinue page): five follower
slots opened by Renown (250, 750, 1,400, 2,250, 3,350), the cart's four upgrades (Donkey, Cart, Wagon, Big Wagon, +27 slots
each on 99). Camping doubles repairs, cuts sight and shows you to parties (Grok's day-loop page, unverified).
WHAT WAS BUILT:
- CAMP on the map: a plate in the pad's row (left of PAUSE and GO), or T (Battle Brothers' key; UI's key map had it unbound for
  want of a camp). It stops the march and opens the town screen in CAMP MODE on the block you stand on: COOK FOUR's 3D camp
  ground (tents, fires), every man of the company round the fire (the marker's own list), idling, your lead at the fire who
  walks up to what you tap. The bar shows the clock; LEAVE reads BREAK CAMP (T again).
- TIME RUNS: the map's own clock (advance()) an hour a beat while the camp stands: the day turns, the night is billed, the hurt
  mend by the day, the valley's parties walk (six world steps an hour). A hunting crew keeps coming; two blocks off (four with
  a lookout) the camp breaks and the map shows them; one that reaches you is the meet card.
- THE TENT: the clock, what the night costs and how many nights the batteries buy, your company (the crew screen), break camp.
- THE RETINUE: PEOPLE's followers (engine/bohemia_followers.js, bought once, rule 56), one to a slot, the slots opened by CLOUT.
  Only the four whose help the game can really give are offered: the scout (road time -15%, the map's cityStepMins), the lookout
  (one block further down a street, a quarter further over open ground, a camp warned two blocks sooner), the cook (the night's
  food -15%) and the paymaster (hired men's pay -15%, the other followers -15%). The blacksmith and the surgeon wait for a repair
  meter and a wound clock.
- THE CART: four steps (A HAND CART, A PICKUP BED, A BOX TRUCK, A TRAILER), +12 in the stash each (the stash's 36 grows by the
  third Battle Brothers' 99 grows by), every screen with the bag reads it (the town, the crew screen, the spoils).
- CLOUT: Battle Brothers' Renown under our word (engine/bohemia_renown.js, records/target/bb/renown.json, TUNING's to move):
  a job done +100, in part +50, failed -75, dropped -100, a won fight +5 a man beaten, an ambition +100. It opens the retinue's
  slots and (with [money teaches]) lifts a job's pay from x1 to x4.5 by 4,000. A new game clears it with the camp.
- Gate: gates/the_camp_gate.js, 8/0 on the demo, real fingers.
WHAT IS NOT DONE, SAID: the camp's ground is the camp picture on every block (the district picks between its two), not the
street tile's own ground (COOK FOUR's sheets; rule 100); the blacksmith and the surgeon are not offered; repairs in camp wait
for a repair meter.

## [money teaches] (rule 151(b), TUNING's NOTE 10/25 on the board)
His words, 10/24: 'if the first thing I did was I hired a full squad 12 people from three... a lot of people would be dying, I'd be
wasting money... keep a squad fed and paid... it would hurt my ability to hire better people or get better weapons and armor'.
TUNING's finding that proved us wrong: THE MEN AT THE POST WERE NEVER PAID (wageChargedHere 0 stretched the retinue's 'bought once').
- THE HIRED ARE PAID (engine/bohemia_wages.js): his background's wiki wage / 10, x 1.1 a level to 11, never under 1; the founding crew
  eats and is not paid. The map's nightly bill is food + pay (__THE_HIRED_ARE_PAID__, in RUN's __ONE_BILL_IN_DAYS__), so the bar's
  days left read it; the hall's card and the crew screen say each hired man's night as food + pay.
- THE PAY CLIMBS WITH THE COMPANY'S NAME: loopJobPay and the board's payShown x (1 + 3.5 x clout / 4,000), TUNING's x1 to x4.5;
  the phone reads loopJobPay too.
- FOUR LEVEL-UP PICKS (TUNING's [level-up numbers] NOTE, rule 162(b)): records/target/bb/rules.json per_level 3 -> 4, veterans 3 -> 4,
  each with an 'ours' line; the spoils gate picks four.
- Gate: gates/money_teaches_gate.js 7/0 on the demo (the hires are real taps at the hall).

## [eyes: crowd taps] (EYES [the playtest] item 8 and round 2, rule 150)
MEASURED on a 390 px phone at Church (the standalone screen, then the demo): the stall's knot answered on 26 to 29 px (three of five),
and on market day eleven stood in one patch of sand. Geometry: eleven men a door tall in that patch cannot each own a 44-point square.
- On a small screen the knot stands a little looser: a man at least 31 points from the next (46 picture px on a computer, about 98
  on a phone), still two rows deep.
- A finger just over a man's head or at his feet in the open is him (over a door only a body answers, as before); every person's
  finger column is at least 48 points wide.
- A market day's extra people WALK (rule 131(b): the ones you cannot tap are the ones who move): walkers +6 (was +2), one more stands
  at the stall (was +6 standing).
- Result on the phone: every person on the glass 44 points or more on the first tap, plain and market day (was 13, then 26).

## [the walk-up, on the ground] (rule 169, Paolo 10/25, after playing BUILD 10/25n)
His words: 'you have the player character walking towards the people but you don't understand what the fuck is going on at all...
walking on top of buildings and shit'; and 'when my character walks and he's at the bottom of the settlement screen, the settlement
screen is shaking'.
WHAT THE FIRST GATE MEASURED THAT THE SCREEN DID NOT SHOW: the walk-up kept him off the TAPPABLE buildings' boxes only (VAR.boxes:
the hall, the board, the stall...), and its gate checked his path against those same boxes. Every other house, wreck, fence, rail,
tent and prop in the picture was open ground to both, so a straight line or a lane ran him over roofs and both said green.
THE SHAKE: the slide that lifts the town above a tall sheet was worked out again every frame from where he stood; a walk near the
foot of the screen and the slide chased each other.
NOW:
- THE GROUND IS THE PICTURE'S: slices/settlement_walk.json, every building (roof to front-wall foot), wreck, stall, fence, rail,
  tent, crate pile, drum, dumpster, board, lamp and fire of all seven pictures (two towns, two camps, two fortresses, home), traced
  off the drawn art; tools/bohemia_run2_settlement_walk_sheet.py draws them back over each picture
  (records/target/settlement_walk/<picture>.png) to be checked by eye; grown by half a body sideways and a step at the foot.
- HIS WAY is found on that ground (10 px cells, A*, eight ways, never cutting a block's corner, around the people standing too),
  pulled straight wherever 2 px samples clear the blocks by 3 px more; the short way. He stops beside the man (else the other side,
  else in front, else the nearest ground: in town_1 the stall's counter is jammed against a house roof, so it is the road beside it),
  facing him. A way longer than sixteen beats is not walked: he is already there when the talk opens (169(c)). A picture with no
  ground traced is never walked.
- THE TOWN MOVES ONCE A TAP: the slide is worked out once when the sheet is up (his whole way above it), a quarter-second tween
  that ends exactly there, still while he walks, one move back when the sheet closes.
- Gate: gates/the_walk_up_on_the_ground_gate.js 6/0: all seven pictures traced; 2,548 ways between every building and person on
  every picture, none across a block (839 too long, placed); 94 real taps on phone and computer, 70,041 frames, his feet never in a
  block; 94 of 94 beside the one tapped; 0 back-and-forth moves of the town.
