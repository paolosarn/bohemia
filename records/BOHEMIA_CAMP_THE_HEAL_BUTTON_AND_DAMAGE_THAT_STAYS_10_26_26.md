# CAMP, round one: THE HEAL BUTTON, AND DAMAGE THAT STAYS (rule 226, 10/26/26; BUILD 10/26l, shipped 72835dfb)

Row: CAMP [the heal button, damage that stays] NO-MORE-BACK-TO-BACK-AT-FULL. His words: records/BOHEMIA_PAOLO_THE_HEAL_BUTTON_AND_DAMAGE_THAT_STAYS_10_26_26.md.
Status: BUILT, NOT YET SEEN (rule 179: EYES sees it live, line 148). Gate: gates/the_heal_button_gate.js, 8/0 on the phone profile and 8/0 on the computer profile, on the cut he plays.

## WHAT WAS WRONG, MEASURED FIRST
1. The fight's one message home (BOHEMIA_FIGHT_OVER crew rows) carried XP, dead, down, injury and NOT ONE HITPOINT OR POINT OF ARMOUR.
   The fight's crewUnit rolled every man whole at the bell (hp = his roll, armour = the piece's full durability). Every fight was the first fight.
2. THE DEAD STOOD UP (EYES 10/26, RUN's [eyes: the dead stand up]): an origin's men carry no names (BOH_START.picks().company is
   {background, level, stats, gear}); the fight named them by their PLACE in the handed list (ours.crew[i]). The shell dropped walked
   and taken men from the BACK of the list by count, and filtered the dead by name, which never matches a man with no name. So a man
   taken out of the list moved every man behind him into the dead man's name and kit, and the dead were never filtered.
3. Nothing healed: no clock read anyone's health, and TAPE (rule 209: the repair tools) was spent by nothing on the map.

## WHAT IS BUILT
- engine/bohemia_condition.js (CAMP's file): the one place that knows what each man is MISSING, by name (the crew screen's man's names
  TITO/MARCOS/LALO/NENO read back to the list's, one key), kept in localStorage bohemia.condition.v1 (the door's NEW GAME forgets it):
  the hitpoints he lost, what his helmet and his body armour lost (each against the piece he wore: a new piece comes whole), and the
  dead list, for good.
- THE FIGHT'S HALF (slices/BOHEMIA_FIGHT.html, COMBAT's file, two marked lines __DAMAGE_STAYS__, NOTE on COMBAT's board): the roster
  carries a man's .cond; crewUnit's new condApply takes it off his whole numbers (never under one hitpoint); homeMessage's crew rows now
  carry look, hp, hpMax, armH, armHMax, armB, armBMax and the pieces' ids. THE FIGHT READS ONLY SOURCED NUMBERS 10/0 after.
- THE SHELL'S DOOR (slices/BOHEMIA_ALPHA_0_9.html, RUN's file, NOTE on RUN's board): nfOpts names an origin's men once by their FIRST
  place (named), skips the count-from-the-back slice when the men have names (the name filters below it take the right men out), and
  hands over through handOver (the dead left out for good, the line re-pointed past them, every man with his .cond). nfOverIn keeps
  the end rows (afterFight) before nfAfterKeep, the surgeon's day off a laid-up man first. NEW GAME's forget list carries the key.
- THE MAP'S CLOCK (slices/BOHEMIA_CITY_WORLD.html, advance(), the one place the valley's time moves): every minute heals and mends.
- THE HEAL BUTTON: the old CAMP plate (#campbtn, same place, same size: right 121, bottom 17, 58 x 44) is his first-aid kit (the bar's
  meds, pack 12 #030, Set A he voted up) over ONE bar: the company's blood in red and its armour in grey, each over its share of the
  bar's length, the dark part what is missing; no number (rule 224), the exact figure on hover (BLOOD 87 / 123  ARMOUR 136 / 270  TAPE 30).
  A tap makes camp. In the camp (slices/BOHEMIA_SETTLEMENT_SCREEN.html camp mode) the same button stands in the same place, outlined,
  its bar filling hour by hour, and a tap breaks camp. The bar is one call (BohemiaCondition.drawBar) for UI TWO's phone app.
- THE CAMP'S UPGRADES (engine/bohemia_camp.js LIVE): the COOK now also heals (+1 an hour), the BLACKSMITH (+20 percent mending, -20
  percent tape) and the SURGEON (a laid-up man back a day sooner) are offered and live; the SCOUT's quicker march and the CART's
  stash were live already (RUN TWO). The QUARTERMASTER is not offered: Battle Brothers' is +50 tools and medicine CARRIED, and our
  counts have no carry cap to raise (ECONOMY's call, not this lane's).

## THE RATES (Battle Brothers', from the wiki copy; records/target/bb/condition.json, every row with its quoted line)
| what | number | source |
|---|---|---|
| hitpoints back on the map | 1 an hour | bb_all/0160_Attributes.txt |
| hitpoints back camped | 2 an hour | the same sentence |
| the cook | +1 an hour | bb_all/1952 (the Attributes page says 33 percent; the follower's page wins) |
| armour mended, each piece | 3 points an hour | bb_all/2014_Tools and Supplies.txt |
| camped | x2 | the same page |
| one TAPE mends | 15 points | the same page; price_table.json agrees |
| the blacksmith | x1.2 speed, x0.8 tape | bb_all/1947 (the Tools page says 33 percent; the follower's page wins) |
| the surgeon | one day fewer laid up | bb_all/1974 |
| no tape | no mending | the Tools page: 'Running out of supplies will result in inability to repair' |
Rule 117 (easier than Battle Brothers) is older than rule 226, which names Battle Brothers' rates; these are the hard end, TUNING moves them.

## MEASURED (the gate, both profiles, the live cut)
- Fight one (the gate lands the first blows by hand so the gate never passes on luck: 70 percent blood, half each piece, the line's
  last man killed, the other side one hitpoint a man; everything after is the game's own): 2 alive, both hurt and broken, RAUL dead.
- The bar after it: 87/123 hitpoints and 136/270 armour, exactly the fight's own end rows; 0.707 blood, 0.504 armour.
- Fight two: both men stood on the board with exactly the wounds handed (2 of 2 exact); RAUL was not handed and not on the board.
- Camp, 11 hours in 5.2 s: +39 hitpoints (the ceiling 44, two men at 2 an hour, one healed whole on the way), +153 armour points, tape
  40 to 30 (153 / 15 = 10.2); the bar 0.463 to 0.780 blood, 0.326 to 0.893 armour as it stood.
- Break camp (the same button): the camp gone, the button back on the map, no more camp hours, the clock still.

## NOT DONE, SAID
- The phone's HEAL app is UI TWO's (rule 212's CAMP app); the plate stands until it lands. NOTE on UI's board with the calls.
- A camp posting to the feed is FEED's trigger (the map's DAY.happened('Made camp.') and the window event bohemia:condition are there).
- The crew screen still shows every man whole; his wounds on his card are UI's or RUN TWO's (BohemiaCondition.condFor(name)).
- What comes after camp is his to decide (rule 226(e)).

[bb Battle Brothers: hitpoints come back 1 an hour on the march and 2 camped; armour 3 points a piece an hour, doubled camped, one tool
for 15; the T key makes camp; the retinue's cook, blacksmith and surgeon speed it.]
[analog horror: the bar is the only place the company's blood shows between fights: a strip of red going dark from the right, and
a strip of grey that only comes back if somebody spends the tape.]
