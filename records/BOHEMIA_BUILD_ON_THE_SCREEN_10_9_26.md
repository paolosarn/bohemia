# BUILD ON THE SCREEN: THE BUILD LIST IS A PLACE ON THE SETTLEMENT PICTURE
# LIFE + CITY, 10/9/26, row [build on the screen] (rule 40b, rule 43)

## WHAT WAS THERE
RUN TWO's settlement screen (slices/BOHEMIA_SETTLEMENT_SCREEN.html) is live: a painted town, its buildings
are the buttons, each keeper speaks with a face. This lane's build list (engine/bohemia_lotbuild.js: eight
things, one battery and one day, gate BUILD A LOT 62/0) was not on it. Nobody could build anything.

## WHAT IT IS NOW (tools/bohemia_settlement_build_patch.py, idempotent, every block marked)
- **BUILD** is a place on the picture like the others: open ground picked by eye in each tier's painting
  (camp, town, fortress), **four lots** (mine, draft, TUNING). Its keeper is **YOU**, as scavenging's is.
- **Whose ground**: the map says (`held` in the open message: your outfit's own base, BohemiaBetween.mine()).
  The screen writes that as FACTIONS' ledger (one taking) and the build module asks it. Not yours: YOU say
  "This is not our ground. We build where we hold. Take it first." Nothing offered, nothing spent. The page
  alone (standalone play, its header's own promise) counts as yours; in the game the map always says.
- **Yours**: the module's list in its order (wall and tank first), each with its cost and what it does
  ("1 batt keeps out hogs", "+1 water/day"...). A tap spends exactly one battery (synced back to the map
  on the post, like every act here), the map hears `build` {id, lot, day}, and the thing is GOING UP.
- **The next day** (the map's day, `day` in the open message) it STANDS, drawn on its lot from the
  street's own art: tools/bohemia_lot_sprites_factory.py cuts each thing out of the approved street (the
  street with it, minus the street without it), lifted from night to day, scaled by whole pixels
  (slices/settlement/lot/). Going up is the same sprite, faint.
- **Memory**: each place keeps its lots and its century ledger in the page's storage (as the bag does).
- The place's gossip line is never put in YOUR mouth (the player does not speak Spanglish, first votes).

## THE GATES
- gates/build_on_the_screen_gate.js (suite BUILD ON THE SCREEN) **15/0**, real touches on a phone: refused
  on the Mob's ground with no battery moved; the list is the module's own; one battery a tap; the map
  hears it; going up, then standing the next day; every sprite loads; kept across a reload; four lots then
  nothing can be pressed and nothing spent; MUTATION: the same place told it is not held refuses.
- RUN TWO's gates/settlement_screen_gate.js pinned the building list; **two lines widened to include
  BUILD** (marked). 49/0 after. Its labels gate 10/0.

## THE COOK
slices/vote/LIFECITY_BUILD_ON_THE_SCREEN_10_9.png, VOTE tab: three shots of the real page on a phone
(tools/bohemia_build_on_the_screen_cook.js + .py): the Mob's place says no; yours, a wall and a tank for
one battery each; the next day both stand on the picture.

## WHAT IS STILL OWED (the next row, written: [built on the map])
The settlement keeps its OWN century ledger per place. The map's derive (act 2, act 3) does not see it yet,
and the map does not draw what you built at your base. The map should take the `build` post into its
century ledger and show it. Also: `resources`/`clout` pay lands in the screen's purse and only batteries
sync back to the map.
