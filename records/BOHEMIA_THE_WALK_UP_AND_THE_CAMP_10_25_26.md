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
