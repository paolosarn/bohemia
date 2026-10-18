# ECONOMY DAY 57: THE PRICE TABLE AT TEN TO ONE -- BUILT, NOT RESEARCHED, AND THE LIVE SHOP ROUNDS WAGES UP
# Rule 78 lifted the research pause (Paolo 10/9: "give jobs to all chats right now"). ECONOMY's
# MODE is now RUN. Row [the price table at ten to one]: one data file the market, the posts and
# the board read -- weapon/armour sell cut by size and relation, hire price by background,
# contract pay, the daily wage formula, food and tools per day, all at ten wiki crowns to one
# battery with a one-battery floor. SHIPPED this round: the data file and its mechanism.

## 0. WHAT GOT BUILT
- records/target/bb/price_table.json -- the market-level numbers no per-item wiki extract
  carries: sell cut by settlement size and relation (two sourced points per tier,
  GROK_119), the settlement-situation multipliers (GROK_120), the one real contract-pay
  sample (GROK_10/31), the daily rates (food, tools, medicine), and the hiring-cost range
  and level-cost formula the wiki's own Game Guide states (cross-checked against
  records/target/bb/backgrounds.json, which COMBAT already extracted verbatim, rule 63d).
- engine/bohemia_pricetable.js -- the mechanism. Pure functions: toBatteries(crowns),
  dailyWageBatteries(background, level), hireCostRange(background, level),
  sellFraction(tier, relation), buyFraction(relation), situationMultiplier(name),
  contractPayBatteries(headcount), dailyRate(key). It reads price_table.json AND
  backgrounds.json directly (REUSE-FIRST: the 77-background daily-wage table already exists,
  wiki-exact, and this file does not re-type it).
- gates/pricetable_gate.js -- 19/0. Proves the formula reproduces the wiki's own worked
  example (level 11 Hedge Knight 91 crowns -> 9 batteries; level 21, 122 -> 12) and matches
  Grok's own 77-background battery-tier grouping with zero mismatches.

## 1. THE FINDING THAT PROVES US WRONG, AND IT WAS IN THE LIVE SHOP
GROK_31 says, in his own words reported: "Divide every crown price by 10. Round down for the
slice." ROUND DOWN. The live settlement screen (slices/BOHEMIA_SETTLEMENT_SCREEN.html line 232,
RUN TWO's file, read not edited -- ONE SYSTEM ONE SESSION) has:
    function priceOf(v){ return Math.max(1, Math.round((v||0)/10)); }
MATH.ROUND, not Math.floor. MEASURED, not assumed: ran every one of the 77 wiki backgrounds'
daily_wage through both rules and checked each against Grok's own independent battery-tier
grouping (the "1 battery a day: beggar 3 ... disowned noble 18" lists in GROK_34). Floor
matches Grok's own grouping with ZERO mismatches across all 77. Round-to-nearest mismatches on
13 of 74 nonzero wages (17.6%) -- disowned_noble (18 crowns) rounds to 2 batteries where the
ruled rule floors it to 1; hedge_knight, sellsword, swordmaster and gladiator (all 35 crowns)
round to 4 where the ruled rule floors to 3; adventurous_noble, assassin, crusader, orc_slayer
(25 crowns) round to 3 where the ruled rule floors to 2; lindwurm_slayer and raider (28) and
beast_slayer and retired_soldier (15) each round one battery too high as well. EVERY ITEM AND
EVERY WAGE THE LIVE SHOP PRICES WITH THIS FUNCTION IS CURRENTLY ROUNDED UP ABOUT A SIXTH OF THE
TIME WHEN IT SHOULD BE FLOORED. Routed below; not fixed here (different lane's file).

## 2. THE BB AISLE AND THE REAL AISLE, TOGETHER
The wiki IS the BB aisle here, verbatim: COMBAT's own backgrounds.json extraction is the primary
source for 76 of 77 wages and the one contract-pay sample traces to the Contracts page via
GROK_10. The real aisle is thinner than usual because this row is a currency-conversion
mechanism, not a design question -- the "real world" input that matters is the ten-to-one rate
itself (ruled, not researched) and the one place the wiki genuinely has no number: a
per-background hiring-cost table does not exist on the wiki (every one of the 77 rows says so on
its own `missing` field), so hiring prices here are a RANGE (30 to 150, swordmaster 400, from
the Game Guide) rather than a false per-background precision.

## 3. THE SELL-CUT GAP, NOW SOURCED
The live shop's SELL_CUT was a flat 0.5, commented "unsourced, the wiki pages in the repo do not
state it" (line 231). GROK_119 does state it: a city hall sells at 17.69% of worth at relation 50
and 19.69% at relation 100 (expert difficulty); a village hall 13.64% to 15.64%. sellFraction()
interpolates between those two measured points per tier instead of guessing a round number. No
town-tier figure exists on the wiki yet (using the village hall's curve until one is sourced,
flagged in the data file itself) and no camp-tier figure exists either (scaled down from the
village hall by the same ratio the village sits below the city, also flagged unsourced).

## 4. CONTRACT PAY: ONE REAL ANCHOR, NO INVENTED SKULL CURVE
GROK_10's one concrete pay line (610 crowns on completion + 10/head, 15 heads, 760 total) is the
only sourced number; "more skulls, more pay" is BB's own rule with no wiki multiplier table
behind it. contractPayBatteries(heads) scales the per-head bonus off that one anchor and leaves
the per-skull curve itself explicitly `sourced:false` in the data, for TUNING -- three felt
digits were not invented to fill a gap that has no source.

## 5. NOT BUILT THIS ROUND, AND WHY
Wiring hireCostRange()/dailyWageBatteries() into an actual hiring screen was not built: no
background-hire UI exists anywhere yet (the settlement screen's 'hall' tab only offers the four
named FOLLOWERS -- mechanic, medic, fixer, driver, engine/bohemia_followers.js, flat WAGE=1 each
-- a different, smaller roster than the 77 BB backgrounds this row prices). That UI is a second
whole thing, not this round's one thing (rule 74); the mechanism is ready for whichever lane
builds it.

## 6. ROUTED
- RUN TWO (slices/BOHEMIA_SETTLEMENT_SCREEN.html, owns the file): priceOf() rounds to nearest;
  GROK_31 rules round DOWN; floor matches Grok's own tier grouping with zero mismatches, round
  does not on 13 of 74. One-character fix (Math.round -> Math.floor), not made here (cross-lane).
- RUN TWO: SELL_CUT=0.5 (line 231) can read engine/bohemia_pricetable.js's sellFraction() by
  settlement tier and relation instead of the flat unsourced constant.
- Whoever builds company recruiting (no lane owns it yet): hireCostRange() and
  dailyWageBatteries() are ready; the hiring-cost RANGE (not a per-background point) is the
  honest number until the wiki states one.
- TUNING: the per-skull contract-pay curve, the camp/town sell-cut scale factors (both flagged
  unsourced in price_table.json), and the 1.25x gear/level-cost formula's actual felt weight.

## 7. COOK
In VOTE: the price table's first page (id economy-price-table-10-9), two sentences, pointing at
the shelf prices it will move once wired.
