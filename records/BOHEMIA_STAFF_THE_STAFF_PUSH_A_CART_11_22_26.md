# THE STAFF PUSH A CART (STAFF 2, 11/22/26) -- BUILD 11/22zzc, BUILT, NOT YET SEEN

VAMILY rule 471, ask row 709. Paolo 11/22, after 468 and 470(a): "Maybe the servants of your crew, not regular fighters but cooks or
medics or blacksmith or whatever, they're forced to forever carry instead of a shield... it's like it's a shopping cart... it can be a
one-handed slot. Maybe it could never be removed, maybe it could be upgraded, or it could be like a different type of shopping cart,
wagon maybe, shopping cart vibe idk, but these characters can only use one-handed weapons, so either a pistol or like a one-handed
melee... that shopping cart does reflect in the combat, like you'll see it."

Rules 461 (as amended 11/21: nothing scheduled, nothing that waits for a tap), 441 (whole, on the page he plays, a phone both ways),
465 (no line rewritten; the words added are the fewest, draft), 477 (UI FIVE's: the shop says one hand or two).

## WHAT IS LIVE (the demo and the alpha)

- (a) THE CART IS HIS OFF HAND, ALWAYS. Every camp person has a cart where a fighter has a shield. The fight gives a staff member no
  shield, no bag and no swap, so it can never be taken off, sold or swapped. A fighter never has one.
- (b) ONE HAND ONLY. A staff member carries one one-handed weapon: a pistol or a one-handed blow. A two-hander, a shield, a bow or a long
  gun in his book is refused and he gets the box cutter. By trade (realism first): the blacksmith his hammer (Battle Brothers' one-hand
  hammer row, our framing hammer), the cab driver and the skip tracer a snub revolver, everybody else the box cutter of 11/21.
- (c) YOU SEE IT. The cart is modelled and rendered through the 3-D rig (tools/bohemia_staff_the_cart.py: COOK's own shopping cart
  imported and called, a steel utility cart, a garden wagon on its steering tongue; the props modeller's palette, the master rig's wear,
  light, camera, stretch and eight facings, in the man's own 57 px a metre frame), with what his trade carries in it (the cook's pot,
  rice and water, the surgeon's tackle box and bandages, the blacksmith's tape rolls, toolbox and a car-door skin, rounds in ammo cans,
  gear in a duffel and a box, or empty). It stands at his left hand, its handle before him:
  - ON EVERY FIGHT BOARD: its back (the cart and its sun shadow) under his body, its front (what stands nearer the glass than he does)
    over it; it faces the way he pushes it while he walks, and when he stops it faces the nearest man of theirs; its wire rattles a pixel
    on his walk; when he falls it lies on its side with what it held spilled. Night darkens it like every sheet.
  - ON THE MAP: his camp walks in a file behind his company, each pushing his cart, at his size at every zoom, in depth with the city.
  - IN THE CAMP: every follower by the fire stands with his cart.
- (d) IT UPGRADES at his place's FORGE: one row a camp person: a steel utility cart for 150 batteries and 20 tape, then a wagon for 300
  and 40; the wagon says THE BEST CART. A dead person's cart stays with his job when his side held the field; a lost field takes it.
- (e) IN A FIGHT: a weak shield from the front (against a blow or a shot from the three tiles it faces): shopping cart 8 melee / 3 ranged,
  utility cart 11 / 5, wagon 14 / 7 (Battle Brothers' buckler is 10 / 5, the wooden shield 15 / 15: a wire cart is thinner than a buckler
  against a blade and far thinner against a round). It costs one more AP every tile he pushes it, and its weight comes off his fatigue
  like a shield's (-6, -8, -10). It carries his trade's stock out of the company's count (the cook's food, the surgeon's and the
  alchemist's meds, the blacksmith's and the scavenger's tape, the quartermaster's and the bounty hunter's rounds), up to 20, 35 or 60,
  the first of a kind first. WHEN HE FALLS IT GOES OVER and what it held leaves the count (the bar reads it at once).
- The man's card in the fight (hold a finger on him) says his cart, its two defences FROM THE FRONT and what is IN IT. Draft words.

All numbers are drafts in records/target/bb/retinue.json staff.cart and staff.arms, a modder's rows, TUNING's to move.

## MEASURED

- THE GATE (gates/the_staff_push_a_cart_gate.js, THE STAFF PUSH A CART, in the suite): 12/0. C4 on the live chance: from the front the
  attacker's chance is exactly the chance against the same man with the cart's 8 on his own defence (7 points through the fight's
  nerve and cap), from behind nothing. C5: his walk reaches 24 tiles with the cart against 49 without. C6: 60 of 60 carts face the
  nearest foe at the bell, 171 of 171 stops in 20 AUTO fights. PLANTED (carts guard every side, a two-hander kept, a fighter with a
  cart): C2, C3, C4 red.
- THE FIGHT STILL PLAYS (C12, 120 AUTO fights, 8 of his and 3 staff, the same seeds with no cart): with the carts 78.3% won, 17.2% of
  the camp dead, 7.3 rounds; with none 78.3%, 19.4%, 6.8. The cart is a trade, not a free buff: slower to get out of reach, harder to hit
  from the front; the win rate does not move.
- THE STAFF FIGHT TOO (the 11/21 gate) 37/0; THE RETINUE 29/0; THE HIRE PRICE IS THE FORMULA 10/0; EVERY MAN ACTS ON AUTO 22/0; DEMO BUILD
  25/0; PAGES PUBLISH 30/0; SETTLEMENT SCREEN 74/1 (the shop's relation price, the same red on main without this build).
- ON THE PHONE (tools/bohemia_staff_cart_on_the_phone.js, the demo and the alpha, upright and sideways; the walk, then the forge's real
  tap on its own with --forge-only, the town he starts in opened with a built forge handed to its sheet: planting his place and building
  the forge takes days, HOME BASE's gate walks that):
  - demo upright: the map 4 camp people with carts; at the bell 4 staff, each his cart drawn, 0 fighters with one; one hand (box_cutter, pickaxe, snub_revolver); the cook falls in round 2, her cart on its side, 20 food gone after; by the fire 3; the forge tap 150 batteries and 20 tape, the cab driver a steel utility cart; 46 fps, worst 333 ms; all green
  - demo sideways: the map 4 camp people with carts; at the bell 4 staff, each his cart drawn, 0 fighters with one; one hand (box_cutter, pickaxe, snub_revolver); the cook falls in round 2, her cart on its side, 20 food gone after; by the fire 3; the forge tap 150 batteries and 20 tape, the cab driver a steel utility cart; 44 fps, worst 283 ms; all green
  - alpha upright: the map 4 camp people with carts; at the bell 4 staff, each his cart drawn, 0 fighters with one; one hand (box_cutter, pickaxe, snub_revolver); the cook falls in round 2, her cart on its side, 20 food gone after; by the fire 3; the forge tap 150 batteries and 20 tape, the cab driver a steel utility cart; 44 fps, worst 333 ms; all green
  - alpha sideways: the map 4 camp people with carts; at the bell 4 staff, each his cart drawn, 0 fighters with one; one hand (box_cutter, pickaxe, snub_revolver); the cook falls in round 2, her cart on its side, 20 food gone after; by the fire 3; the forge tap 150 batteries and 20 tape, the cab driver a steel utility cart; 46 fps, worst 217 ms; all green
  - FOUND AND FIXED ON THE WAY: on the alpha sideways (its sixteen tabs over the glass) the forge's sheet with four camp rows ran off the
    bottom (the last cart and BUILD MORE cut); on its side the sheet now takes the training yard's own two columns.
  - FOUND, NOT MINE (COMBAT FOUR's, the note the last STAFF left): upright, the camp at the board's west edge stands half off the glass and
    the camera cannot centre on it; on its side the whole board fits.

## FILES

records/target/bb/retinue.json (staff.cart, staff.arms, their why); engine/bohemia_camp.js (__THE_STAFF_PUSH_A_CART__: cartOf, cartNext,
upgradeCart, armsOf, cartLoad, cartLevel, the spill in lose; staff() hands each his cart and weapon; the __STAFF_RULES__ copy re-baked);
slices/BOHEMIA_FIGHT.html (__THE_STAFF_PUSH_A_CART__: staffArms, staffCart, cartFront, cartDef, cartTurn in the rules; stepCost, gearFat,
chanceWith, moveTo, setup, startFight hooks; cartLayer/cartCell on the board in blitManNow; the card's cart line);
slices/BOHEMIA_ALPHA_0_9.html (the after-fight lose hands held: won, the bar re-read; the stamp); slices/BOHEMIA_SETTLEMENT_SCREEN.html
(homeCartRows on the forge's sheet); slices/bohemia_camp_look.js (campCart by each follower); slices/BOHEMIA_CITY_WORLD.html
(mapCampDraw, the file behind his company); slices/fight_rig/staff_cart_{shopping_cart,utility_cart,wagon}.webp and staff_carts.json
(the pictures, 396 cells); tools/bohemia_staff_the_cart.py (model, render, pack, the twins sheet); gates/the_staff_push_a_cart_gate.js;
tools/bohemia_staff_cart_on_the_phone.js; slices/BOHEMIA_DEMO.html re-cut.

## NOT DONE, NAMED

- The camp person's LEFT HAND is his own body's pose: the cart's handle stands at his hand's side, not posed into his fist (a body key
  per look and pose through the melee tool's own pipeline would put the fist on it; 18 looks and every rolled person of the valley).
- The crew screen does not yet show the camp or let him hand a camp person a different one-handed weapon (the fight and the camp book
  already refuse a two-hander: BohemiaCamp.armsOf and the fight's staffArms); UI FIVE's rule 477 card says whether a staff member may carry it.
- On a narrow board the carts crowd the back of his line (a fight tile is narrower than a cart is long); TUNING / COMBAT FOUR may want
  a column between his back row and his camp.
- TUNING's table takes the cart's drafts.

[bb Battle Brothers: a shield in the off hand, its defence on every blow; ours guards only the side it faces, and it holds the cook's pot.]
[analog horror: when the cook falls her cart goes over, the rice runs out on the road, and one wheel keeps turning.]
