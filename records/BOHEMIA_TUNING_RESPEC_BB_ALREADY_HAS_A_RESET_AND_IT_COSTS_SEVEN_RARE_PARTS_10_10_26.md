# TUNING ROUND 12 -- [respec] SWAP ONE MASTERY PAST LEVEL 11: WHAT BATTLE BROTHERS DOES, AND WHAT OURS SHOULD COST (10/10/26)
# Row: VAMILY TUNING [respec] (rule 40e; his 9/29: 'switch out a weapon mastery after you've leveled up past level 11 instead of
# needing to use mods in Battle Brothers'), RESEARCH (rule 38g). Rule 56 (his fifth votes): who dies = a flat 20 percent when no
# perk is in play, a little more per debilitating trait or injury carried; one row (see section 5).
# Wiki pages read here (reference/library/grok/wiki/PAGES_ALL): Level and Experience, Perks, Potion of Oblivion, a weapon mastery
# page (Cleaver Mastery). What the Legends mod and the respec mods do is OUTSIDE the wiki: marked recall below, to verify.

## 1. THE TREE, THE CAP, AND WHY A PICK IS PERMANENT (wiki)
- A man's level runs 1 to 11 on a fixed XP table: level 2 at 200 total, 3 at 500, 4 at 1000, 5 at 2000, 6 at 3500, 7 at 5000, 8 at 7000,
  9 at 9000, 10 at 12000, 11 at 15000. Each level gives ONE perk point and three stat rolls. There are 7 perk rows; row 2 opens after
  you spend 1 point, row 3 after 2; the points can go in any open row. So the early points are forced into the early rows, which is why
  the first picks decide the build. A level-11 brother has spent about 10 perk points.
- A weapon mastery (axe, cleaver, mace, hammer, flail and the rest) is one perk: for example Cleaver Mastery cuts the weapon's
  fatigue build-up by 25 percent and doubles cleaver bleeding to 10 a turn. One point, one weapon family, and the man is a cleaver man.
- PAST LEVEL 11 ("veteran levels", up to a hard cap of level 33, was 42 before one expansion): each level costs 4000 plus 1000 for every
  level already above 11 (so level 12 needs 4000 more, 13 needs 5000, 14 needs 6000: 19000, 24000, 30000 total), gives NO perk point, and the stat rolls are
  capped at +1 on three stats. So past 11 a man's XP buys almost nothing. That is the gap his rule fills.

## 2. THE FINDING THAT PROVES HIS PREMISE HALF WRONG
*** BATTLE BROTHERS ALREADY HAS A RESPEC IN THE BASE GAME. *** The Perks page: "he can reset selected character's perks with a Potion of Oblivion."
The Potion of Oblivion (a non-combat consumable, worth 2,500 crowns) "resets ALL perk points". It cannot be bought. It is crafted at a
Taxidermist from one each of seven rare monster parts (Heart of the Forest, Poisoned Apple, Unhold's Heart, Nachzehrer Brain, Poison
Gland, Petrified Scream, Severed Tentacle) for a fee of 5,000 crowns. A man with the Gifted perk keeps the stats it gave.
So players do not need a mod to change a build; they need one that is PARTIAL (one pick, not ten) and AFFORDABLE (not seven mid-to-late
monsters and 5,000 crowns). That is exactly what his rule is, and it is not a thing a mod gives that vanilla lacks entirely; it is a
cheaper, smaller version of a vanilla item. [Recall, unchecked: the Legends mod and small respec mods add a free or cheap perk reset;
players keep them because late-game builds are expensive to get wrong. To be verified when a stamped source lands.]

## 3. WHAT THE SWAP SHOULD COST, ANCHORED TO THE POTION (the rows, proposed, nothing built)
The potion resets about 10 perks for 2,500 worth + 5,000 fee, so ONE perk is about one tenth:
    worth share    2,500 / 10 =   250 crowns  = 25 batteries at the 10-to-1 rate (GROK_33)
    craft-fee share 5,000 / 10 =  500 crowns  = 50 batteries
So a fair swap is 25 to 50 batteries (default 40, my pick, a TUNING dial), and the parts requirement becomes a TIME requirement, since
a rare monster-part hunt is days or weeks of play: "a few days of the clock" is that, shrunk (his words). Rows:
    respec.level_gate        past 11 (his)            below 11 a pick is permanent (BB), so the early choice still matters
    respec.picks_per_visit   1 mastery               (his; the potion is all-or-nothing, ours is one at a time)
    respec.batteries         [25, 50], default 40     anchored above
    respec.days              a few (3 to 5 proposed)  the clock passes at the training ground
    respec.place             a settlement with a training ground, never a menu (rule 19)
    respec.only_masteries    true                     (his: masteries are the thing he named; the potion's other 9 perks stay permanent)
Why not cheaper: an easy swap makes every man optimal for every fight and flattens the build, which is the depth the fight-gets-deep law wants.
Why not dearer: past 11 a level costs thousands of XP for nothing, so a swap is the one thing late XP buys; if it costs more than a
fight's reward it will never be used.

## 4. WHAT IT DOES TO THE GAME (reasoned, not measured)
A man past 11 can retrain for a specific enemy (a hammer for armoured knights, a cleaver for the unarmoured). That rewards KNOWLEDGE of
the enemy, his stated goal (rewarding your own knowledge and skill), and gives past-11 XP a purpose. The risk is the one every respec has:
min-maxing between fights. The days and the batteries are the brake, and the one-per-visit cap means a whole rebuild takes a long
time on the map, which is the point.

## 5. RULE 56 IN THE SAME TABLE: WHO DIES (his fifth votes: a flat 20 percent when no perk is in play, more per debilitating trait or injury)
The shape I checked on 10/9 is the wiki's own: BB's survival is 33 percent, none if the last hit was a fatality, none if retreating, and a
Surgeon follower prevents fatalities for men with no permanent injuries. His version is flat 20 percent dead, plus a little per
carried injury. As ONE ROW: death.base 0.20 and death.per_mark (proposed 0.05, my pick, capped by my 10/9 mark cap of 4, so
at most 0.40, still under BB's 0.67). A perk can change it, which is what "when no perk is in play" means.

## ROUTED
- ECONOMY: respec.batteries; the training-ground building in WORLD/LIFE+CITY.
- PEOPLE/COMBAT: the swap is a place action at the training ground; masteries only.
- TUNING [numbers table]: the respec and XP-past-11 rows as references; death.per_mark.
- Test material: the VOTE page is draft:true.
