# TUNING ROUND 11 -- [ammo] HOW BATTLE BROTHERS MAKES AMMUNITION SCARCE, AND WHAT OURS LACKS (10/10/26)
# Row: VAMILY TUNING [ammo] (rule 46d; his 9/29: 'if you have no ammo you gotta do what you gotta do'), RESEARCH (rule 38g). With ECONOMY.
# All Battle Brothers numbers read from the wiki dump here: Ammunition, Quiver of Arrows/Bolts, Handgonne, Reload Handgonne,
# Reload, Shoot Bolt, Quick Shot, Aimed Shot, Game Mechanics (starting funds); our weapon rows (records/target/bb/weapons.json).
# Arithmetic is mine and marked. Nothing built.

## 1. THE MECHANISM, FROM THE WIKI
- ONE COMPANY STOCK, counted in POINTS. A bundle is 50 points, worth 100 crowns (so 2 crowns a point). The stock is capped by the
  economic difficulty: 300 points (Veteran, Expert), 500 (Beginner); the quartermaster follower adds 100.
- A WEAPON HOLDS A SMALL LOAD. A quiver of arrows or bolts is "for 10 uses" (worth 35 crowns). It refills AUTOMATICALLY AFTER EACH
  BATTLE if the stock has the points. Replacing one arrow or bolt costs 1 point; one Handgonne shot costs 2; one thrown weapon
  (axe, javelin, bola) or fire-lance charge costs 3. A throwing bundle is "for 5 uses". Swapping an empty quiver mid-fight costs 4 AP.
- THE SKILLS COST ACTION POINTS, not money: bow Quick Shot 4 AP (15 fatigue) and Aimed Shot 7 AP (20); crossbow Shoot Bolt 3 AP
  (5 fatigue) then Reload 4 AP (20); Handgonne Reload 9 AP (20 fatigue), which is a man's whole 9-AP turn. The Handgonne
  needs a gunpowder bag, cannot fire in melee, hits a cone and always body and head, damage 35 to 75, and is sold by an Alchemist.
- THE START KIT SETS THE SCARCITY (Game Mechanics): ammo 20 points on Low, 40 on Medium, 80 on High (provisions 50 on all).
  A Low company starts with twenty arrows, ten Handgonne shots, or six throws.

## 2. WHERE THE SCARCITY ACTUALLY LIVES (my arithmetic on those numbers)
- NOT IN THE PRICE. One full quiver is 10 points = 20 crowns, and the start funds are 1,500 to 2,500 crowns: 750 to 1,250 points, so a
  Low company can afford 25 to 125 shooter-fights of arrows. Price never binds; BB ammunition is cheap on purpose.
- IN THE STOCK AND THE LOAD. A bow man empties a 10-point quiver in about five turns of Quick Shots (two a turn), so a
  four-shooter company spends 40 points in a fight that runs ten rounds. The Medium start (40) is ONE such fight, Low (20) is half
  of one, High (80) is two. After that the company buys, and what limits that is what the settlement has in stock (a Fletcher, the
  Arrow Maker's Shed) and the 300-point carry cap (about seven full-quiver fights for four shooters).
- ON THE FIGHT: a crossbow cycles Shoot 3 + Reload 4 = 7 AP, so about one shot a turn; a Handgonne cycles about one shot every other
  turn (the 9 AP reload). Bows are the cheapest to keep firing, Handgonnes the most dramatic and the most ammunition-hungry per
  shot (2 points). So "the switch point where a company reaches for blades" is simply when the stock divided by shooters divided by
  fights-it-must-last drops under one quiver: for ten fights, four shooters, the Medium start gives each man one shot a fight.

## 3. THE FINDING THAT PROVES US WRONG
*** OUR GAME HAS NO AMMUNITION ECONOMY AT ALL. *** records/target/bb/ours.json maps pistol to the dagger (no ammo), shotgun to the
Handgonne, rifle to the light crossbow, bottles to throwing axes. The new fight tracks only what sits in the weapon (a throwing
bundle's "5 uses" and the Handgonne and crossbow reload), and refills nothing. The settlement screen has no ammunition
(0 mentions) and the start kit has no ammo line. So a rifle shot costs one beat and nothing else, and "bullets are scarce" cannot
be felt. Worse, his 9/29 wish ("if you have no ammo you gotta do what you gotta do") and the plan "bows and blades in act 1, bullets
by act 3" have no number behind them. Because BB scarcity is stock and load and not price, copying BB's price (2 crowns a point)
would change nothing; what has to be copied is the STOCK, the CARRY CAP, the AUTO-REFILL RULE and the START KIT.

## 4. THE SHAPE FOR ECONOMY, WITH THE ACT-1-TO-ACT-3 CURVE (proposal, rows, nothing built)
Take BB's four mechanisms verbatim as rows: ammo.stock_cap [500, 300, 300] (by economic difficulty), ammo.quiver_uses 10,
ammo.refill_after_battle true, ammo.points_per_replacement {arrow 1, bolt 1, handgonne 2, thrown 3}, ammo.bundle_points 50,
ammo.start_kit [80, 40, 20], skill.ap.* from the wiki. Then the one thing that is ours, his collapse: AMMO.AVAILABILITY by act, a
settlement stock multiplier on how much the Fletcher/Alchemist has. Act 1: arrows and bolts available, no powder (the Handgonne is an
Alchemist item, so keep Alchemists out of act 1); act 2: powder appears; act 3: bullets back. That makes "bows and blades are real in
act 1, bullets return by act 3" a table, not a story. The price stays BB's (2 crowns a point, bought at the settlement's buying
modifier) so the SELL RATIO page governs resale.
Open for ECONOMY: whether a "bullet" is the Handgonne's 2-point shot or its own line (our shotgun/rifle names make players think of
bullets, BB's tools are arrows, bolts and powder). That naming is theirs and the PEOPLE/WORDS lanes'.

## ROUTED
- ECONOMY: section 4 rows; the availability-by-act curve; the stock line on the settlement screen and the start kit.
- COMBAT: a company stock, auto-refill after a fight, and a swap-quiver action (4 AP) so the fight reads a stock, not only a weapon.
- WORLD: which settlements have a Fletcher and an Alchemist, by act.
- TUNING [numbers table]: ammo rows as references. Test material: the VOTE page is draft:true.
