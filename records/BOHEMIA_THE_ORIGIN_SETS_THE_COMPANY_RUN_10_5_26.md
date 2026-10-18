# THE ORIGIN SETS THE COMPANY (RUN, 10/5/26, [the origin sets the company], rule 75a)

> **PAOLO 10/5:** *"depending on your origin, that's how many people will be in your group... Lone Wolf,
> some super soldier by himself... peasant militia, up to 16 instead of 12... the demo has none of it."*

## MEASURED FIRST
- **The door's picks made no men.** `picks()` returned a `crew` number between -2 and +2, and the only
  thing that read it was the size of the ENEMY's crew on a job. The cards' "Three of you..." were words.
- **Every fight fielded the same twelve,** COMBAT's fixed crew list, whatever was picked. The shell
  passed the fight only the board's kind and the night.
- **Our fifteen origins checked against the wiki:** ten of fifteen difficulty tiers off by one (the wiki
  has three: Easy, Medium, Hard; we had a Very Hard); the start money unrelated to the funds (the water
  truck and the fight pit got the most, Battle Brothers gives them little; the anatomists start richest
  in Battle Brothers and got a middling 4); "Ten neighbours" (the page says 12 men); "Half your crew owes
  you" (4 of 6). The earlier research summary (GROK_14) had three errors, written from memory.

## NOW (`__THE_ORIGIN_SETS_THE_COMPANY__`)
- **records/target/bb/origins.json,** Battle Brothers' fifteen from the wiki dump (the Origins index and
  the Lone Wolf page in CORE_WIKITEXT.md, the other fourteen pages in PAGES_ALL.tar.gz), each with:
  the starting men (a background from backgrounds.json, and the level where the page states one), the
  High/Medium/Low funds and the batteries at 10 crowns to 1 (rule 75a), the roster cap and the field
  cap (default 20 and 12; the Block Watch and the Debt Collectors 25 and 16, the Promise Keepers 18,
  the Fight Pit and the Lone Wolf 12), the page's own rules quoted, and our skin (name, line, draft:true).
- **The door reads it.** THE SHELVES are Battle Brothers' funds: FULL = High, THIN = Medium, BARE = Low.
  A card says what the game applies: "START 100 BATTERIES · JUST YOU · 12 IN A FIGHT". The tiers are the
  wiki's. An origin no longer changes the enemy's crew (the road's math is [a few, not twelve]).
- **The company goes to the fight.** BEGIN carries it (and the caps) to the map for RUN TWO's roster;
  every fight's options carry the company and the field cap; the fight (two small reads in COMBAT's file)
  takes the men in order, each with the kit and the look of his place in COMBAT's line and the origin's
  background and level, and stops at the cap. Nothing handed = the twelve, as before.
- **Measured on the demo:** THE LONE WOLF on bare shelves begins with 75 batteries and fights alone, a
  level-4 hedge knight; THE BLOCK WATCH fields twelve peasants (two farmhands, a poacher, two daytalers,
  a miller, a fisherman, two militia, a minstrel, a vagabond, a butcher); A NEW CREW three companions.

## WHAT THIS CHANGES THAT OTHERS SHOULD KNOW
- **The start money is now Battle Brothers' scale** (70 to 270 batteries at THIN), while a job still pays
  1 battery and the settlement's buildings cost 1. Those are now tiny next to the start; the job pay
  belongs with [a few, not twelve] and ECONOMY, the prices with RUN TWO's [the market] (same 10 to 1).
- **The Lone Wolf now meets the same nine brigands alone.** The enemy is still COMBAT's fixed first
  band until [a few, not twelve] (next on this lane) sizes the road's parties by the math.
- **Kit is by place in line** (COMBAT's twelve kits) until an origin's own kit is data; only the
  Deserters' and the Promise Keepers' kits are stated on their pages (quoted in the file).
- FOR COMBAT: `setup()` reads `opts.company` and `opts.cap`; `crewUnit()` honours `c.level`.

## CHECKS
- **THE ORIGIN SETS THE COMPANY**, new, 7/0, registered slow. Mutations, each red: the fight's options
  drop the company (O5, O6: twelve again); the fight ignores it (O5, O6); the old start multiplier
  (O2, O3, O4: 2 batteries, the file says 75); the origin's level ignored (O5: level 5).
