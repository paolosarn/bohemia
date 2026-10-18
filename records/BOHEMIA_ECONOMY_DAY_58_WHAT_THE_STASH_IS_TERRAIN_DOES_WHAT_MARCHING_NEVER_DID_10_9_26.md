# ECONOMY DAY 58: WHAT THE STASH IS -- THE SIX COUNTS' DAILY RATES, SOURCED, AND A CORRECTION TO MY OWN ROUND 53
# Rule 74 top row [what the stash is]. The six counts' rules from the wiki's own pages (food by
# terrain, tool repair rate, medicine and ammo caps and per-shot costs) in a data file the clock
# reads. MODE: RUN. SHIPPED this round: records/target/bb/stash_rates.json,
# engine/bohemia_stash.js, gates/stash_gate.js.

## 0. WHAT GOT BUILT
- records/target/bb/stash_rates.json -- the terrain food multiplier (plains 1.0 to mountains
  2.0), the extended food-spoilage list, the tool repair RATE (not just the exchange rate the
  price table already had: 3 durability/hour, a camp doubles it, a blacksmith adds 33%), the
  medicine and ammo carry caps and quartermaster bonuses, and the ammo per-shot cost table
  (arrow/bolt 1, handgonne 2, thrown/fire-lance 3, bundle 50). Cross-cites
  records/target/bb/price_table.json's dailyRates rather than re-typing the numbers already
  there (REUSE-FIRST).
- engine/bohemia_stash.js -- the mechanism: foodNeededPerDay(headcount, terrain),
  soonestToSpoil(shelf), toolPointsForDurability(loss), hoursToRepair(loss, opts),
  medicineNeededPerDay(openInjuries), ammoCostForShot(kind), shotsPerBundle(kind),
  carryCap(good, difficulty), daySpend(party).
- gates/stash_gate.js -- 25/0.

## 1. THE FINDING THAT CORRECTS MY OWN WORK, FOUR ROUNDS BACK
BOHEMIA_ECONOMY_DAY_53 (round one, 9/27, this lane's own school round for Q53 [two clocks])
concluded: "BATTLE BROTHERS, the named reference, independently made both same calls: battles
halt its own campaign clock entirely, and provisions are a flat 2/day whether marching or
camping." That is TRUE and still stands -- but it is not the whole picture. GROK_116
(reference/library/grok/GROK_116_UNDERBELLY_DAY_2026_10_04.md, citing
https://battlebrothers.fandom.com/wiki/Provisions directly) shows the 2/day baseline is
multiplied by TERRAIN: plains 1.0, steppe/snow/hills/swamp 1.1, badlands 1.25, desert 1.5,
mountains 2.0. These are two SEPARATE axes -- march-vs-camp (flat, round 53 was right) and
terrain TYPE (scaled, round 53 never asked). Round 53's school round answered the question it
was asked and the question itself was incomplete; this round's gate (leg C) proves the fix
reads a terrain, never a moving/camping flag, so it cannot quietly reopen the axis round 53
closed.

## 2. THE BB AISLE, DIRECT FROM THE WIKI THIS TIME
Three Grok sheets this round (GROK_116, 132, 134) all cite their wiki pages directly
(Provisions, Tools and Supplies, Medical Supplies, Ammunition) rather than reporting a verdict
secondhand, which is why this round could gate against exact numbers rather than ranges: the
tool repairs at 3 durability/hour (doubled at a camp, +33% with a blacksmith), medicine heals
one point per OPEN injury per day (lost health that is not a standing injury heals on its own
and needs nothing), and ammo spends differently by weapon class with a 50-point bundle as the
unit of resupply. None of these numbers needed inventing; all four match GROK_31/34's earlier,
independently-sourced numbers where they overlap (the tool exchange rate, the medicine-per-day
rate), which is cross-checked explicitly in gate leg I.

## 3. ONE REAL DISAGREEMENT, FLAGGED NOT RESOLVED
GROK_116 reports "he said food and water share one pile" in the Grok chat. That contradicts the
already-ruled rule 47 (food and water as two separate counts on the bar) AND his own 10/2 sixth
votes, which confirmed rule 47's six stand. Per rule 49f, a VIA GROK report is unverified until
he rules on it in VOTE directly, and this one conflicts with a standing ruling rather than
filling a gap, so it is named in stash_rates.json's own `sharedPileNote` block and left alone --
the live six-count bar is the standing truth until he says otherwise in the one place he votes.

## 4. WHAT THIS ROUND DID NOT DO
No wiring into the live day loop (bohemia_dayloop.js) or the purse's frozen verbs. Per MODS'
own [what is data and what is not] finding this same round, most of records/target/bb/ has zero
live callers yet; this file is in the same state deliberately -- correct and ready, not
force-fit into a day-loop rewrite that is its own whole thing (rule 74).

## 5. ROUTED
- WORLD/RUN (whoever builds road travel): foodNeededPerDay(headcount, terrain) is ready to call
  once a travelling party and its terrain exist on the map side.
- Whoever builds the fight's resupply screen: ammoCostForShot/shotsPerBundle/carryCap are ready;
  COMBAT's own ammo spend during a fight is a separate, bigger piece this file does not touch.
- Coordinator/VOTE: the shared-food-and-water-pile report (section 3) needs his own word, not a
  lane's guess, since it contradicts a standing ruling rather than filling a gap.

## 6. ALSO FIXED THIS ROUND, NOT MINE
Found and fixed, while rebasing, an unresolved git merge in VAMILY.md's WORLD section (two
copies of [the valley's grounds], one a stale CLAIMED stub and one the real SHIPPED row with its
full result, left behind by a prior rebase that never finished): kept the SHIPPED version,
dropped the stale duplicate. Not my section, but it had the handoff gate red for every lane.

## 7. COOK
In VOTE: a day's spend on the road (id economy-stash-rates-10-9), two sentences: a six-man
company in the desert eats 18 food-points and heals 2 injuries' worth of medicine a day, a
third more food than the same company on plains.
