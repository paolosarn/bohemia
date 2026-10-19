# RUN TWO [the hire price is the formula] -- 10/19/26

Written from RUN TWO's jump list (rule 74) out of TUNING's routed rule 117 finding (Paolo 10/18: 'I want you to be
easier than Battle Brothers'; records/BOHEMIA_TUNING_RULE_117_EVERY_FELT_NUMBER_STARTS_EASIER_THAN_BATTLE_BROTHERS_10_18_26.md
section 1 item 3: 'A HIRE COSTS FOUR AND A HALF TIMES THE FORMULA. A level-one militiaman is up to 225 batteries; the
wiki's formula gives 49. Start: four fifths of the formula'; and the screens seed: the camp staff's button said
'1 battery a night', the line '200 batteries, once', the tap charged nothing).

## What changed on the settlement screen (the hall)

- A man's price is Battle Brothers' own hire formula, every number read, none typed: the Game Guide's base range
  (30 to 150 crowns), 1.25 x his kit's value and the level cost 500 x (level - 1)^1.5, from ECONOMY's
  records/target/bb/price_table.json (wageAndHire); the kit priced off the wiki's weapon and armour rows
  (records/target/bb/weapons.json, armor.json; the same KIT the hall puts in your bag); ten crowns a battery, floor 1.
  His place in the base range is his own roll in the post's old observed range (engine/bohemia_goodbros.js), so a
  cheap man stays cheap and the same man costs the same every visit.
- Times TUNING's rule 117 start, 0.8 ('four fifths'), read from a new data file records/target/BOHEMIA_HALL_PRICE.json
  (one lever, 'easier'; 1.0 is Battle Brothers' own price; a modder edits it).
- The level-one tops now: militia 39 (Battle Brothers 48), farmhand 23 (28), butcher 26, thief 22, messenger 16,
  brawler 14. Before: militia up to 220 in a year of weeks (TUNING read 225), farmhand up to 41.
- THE CAMP STAFF: the button says the one-time price (engine/bohemia_followers.js hirePrice, a paymaster's cut
  included), the tap takes it (it took nothing), and his line says that same price (the list price ignored the cut).
- FOUND ON THE WAY: the post read S.day, which nothing sets, so it sat in week 0 forever and a town's men never
  changed; it now reads the map's day (buildDay(), what open({day}) keeps), the same men all week, new men the next
  (Battle Brothers' recruits refresh).

## What it does not touch

The star mechanic (TUNING's item 2: a hire stars one stat, Battle Brothers three on level-ups) is PEOPLE's
engine/bohemia_goodbros.js; the follower list prices (200 to 350, tuned:false) are PEOPLE's data. Level: every man at
the post is level 1 today; the level cost is in the formula for the day a post rolls a veteran.

## Gate

NEW GATE THE HIRE PRICE IS THE FORMULA 10/0 (in the suite): control (the old number over the formula for 70 of 96 men);
the oracle in the gate from the data alone, militia 39 of 48; on his phone at a camp, a town and a fortress over eight
weeks 96 buttons each the oracle's number, none over Battle Brothers'; Hire takes exactly the button's price (200 -> 183
for a 17); the post is the map's week; the camp staff's button, line and tap agree (the cook 200, 600 -> 400); the lever
planted at 1.0 makes every price Battle Brothers' own. Neighbours: settlement 74/0, one-file loop 13/0, good bros 43/0,
somebody hires you 38/0, every speaker has a face 10/0 (and the loop on the map, the phone's board and followers
re-run on the final code, in the commit).

VOTE run2-the-hire-price-is-the-formula-10-19 (slices/vote/RUN2_THE_HIRE_PRICE_IS_THE_FORMULA_10_19.webp, made by
tools/bohemia_run2_hall_price_shots.js: the same six men at a fortress, before and now).
