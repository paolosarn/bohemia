# ECONOMY DAY 63: WHAT A CONTRACT PAYS -- DISTANCE FOLDS IN, THE TWIST HAS ONE REAL PRICE, THE PAIR HAS NONE
# Rule 74 top row [contract pay], for RUN [settlement screen] and QUESTS' contracts (rule
# 35c): how Battle Brothers prices a contract (danger, distance, the house's standing, the
# haggle and its cost to reputation) and ours in batteries; the twist's price. One page,
# numbers to TUNING. *** 9/30 rule 51: price the PAIR, the slot count is TUNING's.

## 0. ROUND 59 ALREADY BUILT THE CORE MECHANISM -- THIS ROUND CLOSES THREE GAPS IT LEFT NAMED
[the contract's worth] (SHIPPED 10/9/26, records/BOHEMIA_ECONOMY_DAY_59_THE_CONTRACTS_WORTH_
THE_WIKI_TABLE_BEATS_ITS_OWN_RULE_10_9_26.md) already shipped the haggle mechanic, the worked
pay table in batteries, and the relations-cost table (records/target/bb/contract_terms.json,
engine/bohemia_contracts.js, 24/0). It explicitly named three things it did NOT do: price
distance (checked the wiki page, found no distance pay factor), price a contract's twist, and
anything about running two contracts at once. This row's own text repeats "danger, distance...
the twist's price" and adds rule 51's PAIR -- so the job is closing those three gaps, reading
on top of the existing data file, never rebuilding it.

## 1. DISTANCE IS NOT A PAY LEVER IN BB -- IT IS AN ENCOUNTER-COUNT LEVER, SOURCED
GROK_139 (reference/library/grok/GROK_139_CONTRACT_PAY_2026_10_09.md, passed filter 10/9) reads
the wiki's own Game Mechanics page directly and reports two separate facts, neither invented:
"clout does not change the fight size, clout does change the pay; skulls change both the size
and the pay," and "a longer escort is harder because you meet more parties." That second line
is the whole answer to distance: BB does not price distance as its own line item at all -- a
longer route means MORE ENCOUNTERS, which is already folded into the skull rating round 59's
data file reads. Round 59's own refusal to invent a distance formula was correct; the finding
this round adds is that there is no formula to find, because distance was never its own lever
-- it is encounter frequency wearing a skull's clothes. Nothing in contract_terms.json needs a
new "distance" field; a longer road should roll more of the SAME encounter table more times,
which is WORLD's own travel system, not a new pricing rule.

## 2. THE TWIST HAS EXACTLY ONE SOURCED PRICE, AND IT IS NOT A FLAT PENALTY
Read directly off the wiki tarball (reference/library/grok/wiki/PAGES_ALL.tar.gz,
bb_all/0703_Escort Caravan.txt), the Escort Caravan contract states its own twist's price in
the page's own words: losing ALL the escorted donkeys fails the contract outright (no partial
pay at all); losing SOME but not all costs exactly 50% of the crowns and 50% of the relations
gain, with renown UNCHANGED. That is a real, exact, sourced number -- not a direction, a digit
BB itself commits to in its own text. Checked against three other contract-type pages for the
same shape (Deliver Item, and the contracts round 59 and round 60 already read): NONE of the
others state a numeric twist penalty in their own page text -- they describe the twist EVENT
(stolen cargo, hostile mercenaries, an evil artifact) but leave its pay consequence to the
event's own outcome table, which this lane has not pulled page by page. So the honest finding
is narrower than "contracts have a twist price": ONE contract type (Escort Caravan) states its
own twist price in the contract page itself, at 50% crowns and relations, full renown; every
other type's twist pay consequence lives inside its EVENT page, unpulled, and is NOT invented
here as a guess.

## 3. THE PAIR (RULE 51) HAS NO BB PRECEDENT AT ALL -- THIS IS OUR OWN SYSTEM, NOT A TRANSLATION
Checked: BB's own contract system offers one contract at a time per settlement hall, taken or
declined; it has no concept of two contracts running on the same road together, so there is
nothing to translate. Rule 51's "price the pair" is OUR OWN invention layered on top of BB's
single-contract shape, and the real-world aisle carries it instead: a courier or trucking
company running two loads on one route always subordinates the flexible job to the one with
the hard deadline (a real logistics discipline called service-level prioritization), and the
same shape applies here without inventing a number -- a caravan's ESCORT has a hard clock (it
fails if the caravan is lost or the window closes) while a HUNT's moving beast has a soft one
(it can be chased longer, at a cost of its own in time and risk). The direction, sourced from
that real logistics shape rather than felt: the hard-deadline contract (escort) should price
HIGHER per unit of difficulty than the soft-deadline one (hunt) for the same skull rating, the
same way a guaranteed-delivery contract pays a premium over a flexible one in real freight
pricing. No digit is typed; TUNING owns the premium's size, same as the slot count (2) rule 51
already assigned to TUNING.

## 4. THE NUMBERS TABLE TO TUNING -- WHAT IS ACTUALLY SOURCED VS WHAT IS STILL A DIRECTION
| Lever | Sourced fact | What ships | TUNING's gap | Source |
|---|---|---|---|---|
| Distance | no distance pay field exists in BB; distance = more encounters at the existing skull rating | no new field; a longer route rolls WORLD's encounter table more times | the roll frequency per distance unit | GROK_139, reference/library/grok/GROK_139_CONTRACT_PAY_2026_10_09.md |
| Twist (Escort Caravan only) | lose some donkeys: -50% crowns, -50% relations, renown unchanged; lose all: contract fails outright, zero pay | contract_terms.json gets one exact twist-penalty row for Escort Caravan | every OTHER contract type's twist penalty, unpulled from its event page | bb_all/0703_Escort Caravan.txt |
| The pair (rule 51) | no BB precedent; a real logistics direction (hard deadline prices higher than soft deadline at the same skull rating) | nothing numeric; a documented direction only | the premium's size and the slot count (2) | real freight/courier service-level pricing; rule 51 |
No digit above beyond the one sourced 50%/50%/0% row is typed as final.

## 5. BANK
Eight role-place lines, draft:true, in banks/BOHEMIA_ECONOMY_TEST_LINES_9_5_26.md (round 63,
prefix one S longer than round 62's).

## 6. ROUTED
- WORLD: distance's real mechanism is an encounter-roll frequency, not a new price field;
  the travel system (already WORLD's own) is where a longer road should roll more often.
  NOT IMPLEMENTED, research only.
- RUN TWO / QUESTS: the one sourced twist row (Escort Caravan, -50%/-50%/+0) is ready to add
  to contract_terms.json's existing shape the moment a lane runs code; every other contract
  type's twist pay is unpulled and flagged, not guessed.
- TUNING: the premium size for a hard-deadline contract over a soft-deadline one, and the
  slot count, both still open per rule 51.
