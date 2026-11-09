HOME BASE (home-base-01gkdyuv): 11/8 LATEST -- BUILD 11/9d - YOUR PLACE, PLANTED, BUILT, NOT YET SEEN (rule 437(b), asks 356 and 522;
rules 347, 343, 412, 429(h), 438(a)). Record: records/BOHEMIA_HOME_BASE_YOUR_PLACE_PLANTED_11_8_26.md.

WHAT IS LIVE ON THE DEMO
- engine/bohemia_home.js (pure: grade, best, make, plant PERMANENT, nameOf, rename, addResident, prizesFrom, bill, plan, roadCheck,
  lotsOpen, save/load keyed by the game's seed) + records/target/bb/home_base.json (every number and word; TUNING's row, WORDS' lines).
- slices/BOHEMIA_CITY_WORLD.html __HOME_BASE__ (the block at the end of the file): ctBases/turfSeats/crewBillNight/mapPlatesDraw/
  loopPostOpen WRAPPED, never edited; window.BohemiaHomeMap {state, plant, rename, go, probe, offer, billNight, rec, label};
  save key bohemia.home.v1 (a new seed = a new home).
- slices/bohemia_phone.js __HOME_BASE__: the .pl PLANT button in the band (beside the boss's verb it takes the right half), the
  'home' page (grade, BETTER/GO THERE, PLANT HERE, 'Are you sure? This is permanent.', planted: the night, living there, prizes,
  standing, GO HOME); the phone's header says his place's name for CUSTOM.
- slices/BOHEMIA_SETTLEMENT_SCREEN.html __HOME_BASE__: the BOHEMIA_HOME message (cleared on every open), the desk in buildSheet
  (homeDesk, homePlanCanvas), buildLots() (4/8/12 as it grows), drawBuilt in rows of four. Before planting BUILD at his camp says plant first.
- Gate gates/home_base_gate.js (YOUR PLACE, PLANTED; --engine for the 17 engine legs in a second). VOTE home-base-your-place-planted-11-8 (STAND-IN).

SEAMS FOR OTHER LANES
- TOWN FIX (rule 438(a)) takes the floating door signs off: this gate opens BUILD by BohemiaSettlement.where('build'), never a sign.
- BOSSES: a spared (negotiable) boss -> BohemiaHomeMap.rec() + BohemiaHome.addResident(rec, {name, look, why:'spared', day}); home.json
  prizes{} maps a verb id to its piece (cook/open/purify now); a new boss's verb is one row there.
- DYNASTY: the record (planted x,y,day,grade, name, residents, prizes, nights, lastBill) is what act two derives from (347(g), 412).
- RETINUE/CAMP: a retinue hire could post up too (addResident); not wired.

NEXT, IN ORDER
1. His vote on the card. 2. The look: his place's own picture (the cameras of rule 354 once he passes them, or the plan made art,
golden piece first, rule 408). 3. 347(c): what each building is made of and painted, its sign, moving a building between lots.
4. A raid at his place walked end to end on the demo (the seat moves; LIFE+CITY's raid code reads it). 5. The acts.
[bb Battle Brothers has no home of its own; its retinue and its ambitions are the nearest pieces. Ours is the place you choose and pay for.]
[analog horror: the bill comes at night whether anyone is home, and the men you let go are still there when you come back.]
