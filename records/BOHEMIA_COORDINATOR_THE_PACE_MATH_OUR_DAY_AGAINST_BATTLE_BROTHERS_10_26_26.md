# COORDINATOR 10/26: THE PACE MATH, OUR DAY AGAINST BATTLE BROTHERS' (for rule 264; Paolo: 'please do the math on how our speed compares to Battle Brothers... confirm one of our days is three or four of theirs... how far they walk, how many interactions, how much combat')

## BATTLE BROTHERS (sources)
- A day on the world map is about 1 3/4 minutes of real time; time stops in towns, events and fights. (battlebrothers.fandom.com/wiki/Game_Mechanics)
- Healing: 1 hit point an hour on the march, 2 camped. (wiki Attributes; our copy bb_all/0160_Attributes.txt, records/target/bb/condition.json)
- Repair: 3 durability an hour, doubled camped; 1 tool per 15 durability. (wiki Tools and Supplies; bb_all/2014)
- Distances: a camp the game calls 'near' was 2 days one way; trading is 'a couple of days per travel'; contracts across the map take longer. (Steam forums, battlebrothersgame.com forum 'Contract distance', fandom Contracts)
- Fights over a run: a veteran brother logged 306 battles and another 179 (sevastromo.com); long runs go 350 to 400 days, the first crisis about day 80 (Steam forums). A long-lived brother fights about ONE BATTLE A DAY, often less early on.
- So a contract is about 3 to 5 days there and back, and the gap between fights is about a day (24 map hours).

## OURS (measured in the repo)
- Our map clock: 10.75 game minutes a block on dirt (an hour is 2.3 real seconds of travel on dirt, 4.6 on a road); the clock stops in
  a town, a fight, and when he stands still (FEED's measure, slices/BOHEMIA_CITY_WORLD.html, 10/26).
- Our jobs (records/target/BOHEMIA_JOB_KINDS.json): the target 6 to 30 blocks out, most 6 to 18; four kinds are local. A typical job is
  about 12 blocks out, 24 there and back: about 4.3 game hours on dirt, less on roads; plus the town stops (clock off).
- Every job has its sure fight, and the road adds chance fights (rule 208).
- So a game day of steady play holds about 4 to 6 jobs and 4 to 8 fights. The gap between fights is about 3 to 6 map hours.

## THE RATIO
- Fights per map day: ours about 5, Battle Brothers' about 1. ONE OF OUR DAYS HOLDS ABOUT 4 TO 6 OF THEIRS in fights. His feel
  (3 to 4) is the low end and is right in kind.
- Real time per day is close (theirs about 105 s, ours 55 to 110 s), so it is not that our clock runs fast: our fights sit five times
  closer together on the map.

## WHAT IT DOES TO HEALING (why his men arrive hurt)
- Battle Brothers, a day between fights: +24 hit points marching (+48 camped), +72 armour (+144 camped). A typical wound (20 to 40) is
  mostly gone by the next fight; armour lags, which is why players camp.
- Ours, about 5 hours between fights at Battle Brothers' hourly rates: +5 hit points marching (+10 camped), +15 armour (+30 camped). A
  man who lost 30 needs about six fights' worth of time to heal. That is the wall he hit.

## THE CALL (rule 264(b), the coordinator's default, rule 205, his to change)
- SCALE OUR HOURLY RATES BY FOUR, his own number, the conservative end of the measured 4 to 6: 4 hit points an hour marching, 8
  camped; armour 12 an hour marching, 24 camped; tape per durability unchanged (it is the cost, not the speed). Injuries' days (the
  debuff's 30 to 40) are counted in our days and stay as they are (they are long on purpose, rule 234).
- With it, the share of the gap he heals matches Battle Brothers': a typical wound mostly gone by the next fight on the march, armour
  still worth a camp.
- TUNING measures fights per map day on real play (EYES' long play, 10 fights in a row) and moves the four to the measured ratio;
  CAMP reads it from records/target/bb/condition.json (one table).
