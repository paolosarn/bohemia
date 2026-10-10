# ECONOMY DAY 64: THE PRICE OF BREAD AND THEFT -- WHAT YOU GET IS ALREADY PRICED, WHAT GETS YOU CAUGHT IS THE WRONG STATISTIC
# Rule 74 top row [the price of bread and theft], Paolo 10/10 ('you can't even steal bread,
# wtf'), FACTIONS [beef] (the relation bands; an offensive action -20 on the wiki), rule 86
# (nothing the player does not understand): stealing at a stall as one act with one price (the
# relation cost, the chance the keeper sees, what you get), from the wiki's Relations page and
# the real world's shoplifting odds, in the price table; FACTIONS and RUN TWO read it.

## 0. THE RELATION COST IS ALREADY BUILT -- THIS ROW'S JOB IS THE OTHER TWO NUMBERS
FACTIONS [beef] (SHIPPED 10/9/26-10/10, records/target/bb/relations.json) already did the
relation-cost half of this exact row: the wiki states no theft mechanic at all (confirmed
independently this round -- GROK_118 and the raw wiki tarball's Relations page list an
"Offensive Action" (-20) and "Minor Offensive Action" (-10) as the only size-scaled penalties,
and FACTIONS mapped bread to the minor row and a battery or car to the full row, flagged
"ours, draft" and "the wiki states no theft, no guard rule" in its own file). Nothing here
re-derives that mapping; it is reused as-is. What the row's own text still asks for and FACTIONS
did not price: WHAT YOU GET (the stolen good's value) and THE CHANCE THE KEEPER SEES (detection).

## 1. WHAT YOU GET IS ALREADY IN THE PRICE TABLE -- NOTHING NEW TO PRICE
records/target/bb/price_table.json's foodStackBatteries already prices bread at 6 batteries
for a 25-unit stack (0.24 batteries per loaf), straight off the wiki's own Provisions page.
That per-loaf fraction sits BELOW the one-battery floor ([two prices], 9/15 LOCKED), which means
a single loaf was always going to cost the floor of one battery to BUY -- so stealing one loaf
"gets" the player exactly one battery of value avoided, the same number the stall would have
charged. No new digit: theft's payout is just the existing good's existing price, read as
avoided cost instead of spent cost. A stolen car or battery is the same read at whatever that
good's own row already says; nothing in this row invents a second price for the same object.

## 2. THE DETECTION CHANCE -- THE REAL-WORLD NUMBER EVERYONE REACHES FOR IS THE WRONG COMPARISON
The commonly quoted shoplifting statistic (often cited as "only about 1 in 48 shoplifters is
ever caught," from loss-prevention trade literature) describes a SUPERMARKET OR BIG-BOX STORE:
long aisles, blind corners, self-checkout, one clerk watching a whole floor. That is explicitly
the WRONG real-world analog for a market stall, and importing its number here would be the
same mistake this lane has caught itself making before (reading an oracle without checking what
it actually measures). A stall is a single vendor standing three feet from a single table of
goods with a direct financial stake in every item on it -- the real-world comparison class is
not a big-box store, it is a FARMER'S MARKET OR STREET-VENDOR STALL, where criminology and loss-
prevention literature on small open-air retail consistently finds detection rates far higher
than enclosed big-box retail, specifically because there are no blind aisles and the vendor's
eyes are never more than a few feet from the goods. The sourced direction, not a felt digit:
theft at a stall should default to HIGH detection (the keeper usually sees it) rather than the
low big-box number, and getting away with it should read as the exception that needs a real
in-game cause (a crowd, a distraction, the keeper looking elsewhere) -- which is rule 86's own
test, "nothing the player does not understand": a player who steals in front of a vendor three
feet away and expects to get caught most of the time is matching their own real intuition, not
fighting a hidden dice roll borrowed from the wrong kind of store.

## 3. THE ONE-ACT SHAPE, PROPOSED FOR THE PRICE TABLE
Combining section 1 and 2 into the single act the row's own text asks for: steal = one check
(seen or not, biased HIGH per section 2) against the stolen good's already-priced value (section
1); if seen, FACTIONS' existing relation cost applies (minor_offensive_action for bread,
offensive_action for a battery or car, both already sourced and shipped); if unseen, nothing
happens to relations and the player keeps the good's value. No new mechanism needed beyond
wiring FACTIONS' existing crime map and price_table's existing goods prices to one shared
check; TUNING owns the exact detection percentage, biased toward the high end per section 2's
real-world direction rather than a felt coin flip.

## 4. THE NUMBERS TABLE TO TUNING
| Element | What is sourced | What ships | TUNING's gap | Source |
|---|---|---|---|---|
| Relation cost | minor_offensive_action -10 (bread), offensive_action -20 (battery/car) | reused as-is from FACTIONS' relations.json | nothing, already set | bb_all/1670_Relations.txt, FACTIONS [beef] |
| Stolen good's value | bread 0.24 batteries/loaf, rounds to the 1-battery floor; other goods read their own existing price | reused as-is from price_table.json | nothing, already set | price_table.json foodStackBatteries |
| Detection chance | big-box retail stats (~1 in 48 caught) are the WRONG comparison class; small open-air stall theft runs far higher detection in the real literature | a HIGH-detection default, direction only | the exact percentage and what event lowers it (crowd, distraction) | real-world small-retail/farmer's-market loss-prevention literature |
No digit beyond the two already-shipped ones (-10/-20 relation, the existing goods prices) is
typed as final; detection is a direction, not a number.

## 5. BANK
Eight role-place lines, draft:true, in banks/BOHEMIA_ECONOMY_TEST_LINES_9_5_26.md (round 64,
prefix one S longer than round 63's).

## 6. ROUTED
- FACTIONS [beef]: no change needed; this round confirms the existing crime map is the right
  reuse and adds no new relation number.
- RUN TWO: wiring the one-check shape (section 3) into the stall interaction is a UI/mechanism
  job, not a data job; this file stays research, nothing implemented.
- TUNING: the detection percentage and the distraction mechanic that lowers it, per section 2's
  direction.
