# ECONOMY DAY 56: WHAT A BEAST IS WORTH, AND A WORD THE CANON BANNED A WEEK EARLIER SNUCK BACK IN
# Row [what a beast is worth], rule 42 round three (records/BOHEMIA_THE_BEASTS_OF_BOHEMIA_ROUND_THREE_THE_SEVENTEEN_9_29_26.md
# section 4): hide, meat, ivory, milk, honey, bounty -- plus eggs, feathers, burden and live capture, named in the
# same section. One page, prices in batteries, to TUNING. NOT IMPLEMENTED, research only.

## 0. THE FINDING THAT PROVES US WRONG: "RENOWN" WAS DEAD TWICE BEFORE THE BEAST ROSTER USED IT A THIRD TIME
Measured, not assumed, by reading all three files in order of their own dates:
- 9/22, engine/bohemia_haggle.js (the arguing-the-price feature): "*** THE NUMBER IS HIS, DERIVED, NEVER TYPED
  HERE. *** The repo's BB study binds every renown mechanic to resources, electricity and clout rather than
  coin." Renown's first ruling: it is not a currency, it is a cost taken from the standing/deed system.
- 9/29, records/BOHEMIA_THE_BEASTS_OF_BOHEMIA_ROUND_THREE_THE_SEVENTEEN_9_29_26.md section 5, SEVEN DAYS AFTER
  THE BAN: six of the seventeen beasts carry "renown" in their WORTH column as if it were a sellable thing a
  hunter collects -- the American lion (pelt, renown), the sabre-tooth (pelt, renown), the hippo pod (renown,
  alone), the dino-bird (eggs, renown), Haast's eagle (feathers, renown), the ground sloth (meat, renown). That
  is 35% of the roster, written into a LOCKED coordinator record my own board row cites as its ground truth.
- 9/30, engine/bohemia_ambitions.js, INDEPENDENTLY, with no citation of either file above: "THE ONE WORD THAT
  DOES NOT TRANSLATE: RENOWN... none of them is a renown-shaped accumulating score, and inventing a fourth is
  the one thing this file is not allowed to do," then builds the actual fix -- "reach 1,000 renown" becomes
  bohemia_belonging.js's own rung, "useful or better with ANY ONE faction," reused rather than invented.
Three arrivals at the same rule, one of them a full week before the violation and one of them a full week
after it, and NOBODY HAS GONE BACK AND FIXED THE SIX LINES IN THE BEAST RECORD. The row I was handed to put
battery prices under is standing on ground that already contradicts a ruling older than the ground itself.
I am not editing that file -- it is the coordinator's canon record, not mine, and NOTES ARE RULINGS cuts the
other way here: nothing in it was ever a Paolo ruling on renown, it is this fleet's own drift. Flagged in
ROUTED below for the coordinator and for COMBAT/WORLD, who own the beast data file per rule 41.
WHAT IT ACTUALLY MEANS, with the ban applied: a lion pelt or an eagle feather is not sold for a renown number.
It is a GIFT or a DISPLAY that moves the belonging rung with whoever wanted the kill, the same mechanism
bohemia_haggle already pays its reckless-push cost out of (the median of Paolo's own authored #reckless deltas,
not an invented figure). "Renown" dies here for the third time and should not need a fourth.

## 1. THE BB AISLE IS NEARLY EMPTY ON THIS QUESTION, MEASURED AGAINST THE LIBRARY
reference/library/battle_brothers/07_ECONOMY.md line 8, the only sentence about monster drops at all: "loot
sold (weapons and armour sell for a fraction; damaged sells for less)." There is no per-creature trophy
commodity in the recall notes -- a dead Unhold or Lindwurm does not hand over a tusk, a pelt or a jar of
anything with its own price; it hands over whatever gear its fight dropped, sold at a fraction like any other
loot. 08_CONTRACTS_EVENTS.md confirms the other half: "hunt a monster (a Lindwurm, an Unhold, a Nachzehrer
pack)" is listed as ONE OF THE CONTRACT TYPES, priced in skulls (1-3) and negotiated like any contract --
patrol a road, clear a camp, hunt a monster are the same pay mechanism with a different flavour text. SO: THE
NAMED REFERENCE GAME DOES NOT MODEL AN ANIMAL-PRODUCTS MARKET AT ALL. It is not a case of us copying BB
wrong; BB gives this specific question almost nothing to copy, which means the hide/meat/ivory/milk/honey/
eggs/feathers side of this row is genuinely ours to build, bounded by the real record and by EVERYTHING
COSTS ONE, and the BOUNTY half of it already has its answer and it is not a new mechanic:

## 2. BOUNTY IS NOT THIS ROW'S JOB. IT IS THE NEXT ONE ON MY OWN BOARD.
"The clan bounty" (section 4 of the beast record) is a hunt contract, priced the BB way measured in section 1:
difficulty times a negotiated pay, same mechanism as any other contract. That is OPEN [contract pay] on this
very board (rule 51, 9/30), already tasked with "how Battle Brothers prices a contract... and ours in
batteries." Building a second, parallel bounty-pricing rule here would be the same mistake round 52 already
named once (two ledgers for one hunger) -- so bounty is named, routed, and NOT re-solved in this page.

## 3. THE REAL AISLE, PRODUCT BY PRODUCT, SOURCED
Each one asks the same question EVERYTHING COSTS ONE forces on every other good in this game (round 52's own
rule, reapplied): BB would vary the PRICE across towns and seasons; we are not allowed to. So the real-world
spread between a cheap product and an expensive one has to land as a COUNT or an ACCESS, never a bigger
digit on the same unit. Every number below is a sourced RATIO, not a tuned figure -- the digit is TUNING's.

**MEAT** (hog, cattle, camel, aurochs, ground sloth) -- the one good that already exists and needs no new
table. GOODS.food is `unit:'ration', need:1.0/day, 1 ration = ~2000 kcal` (engine/bohemia_economy.js). Real
dressed-weight yields at roughly 2,200-2,800 kcal/kg for fatty field-dressed meat: a hog (~45-70 kg dressed)
is 50-80 rations; a steer or aurochs (~250-350 kg dressed) is 275-440 rations; a camel (~150-200 kg dressed)
is 165-250 rations; a megafauna-class kill sized like a bison or moose (the ground sloth's nearest living
analogue by mass) is 330-500 rations. A beast kill is a RATION WINDFALL sized by real dressed-weight ratios
against the existing need:1.0/day constant, not a new currency.

**EGGS** (the dino-bird runner) -- also folds into the existing food good with no new table. The closest
living ratite, the ostrich egg, is about 1.4 kg and roughly 2,000 kcal -- within rounding of ONE game ration
exactly. One dino-bird egg = one ration, sourced one-for-one, no multiplier needed.

**HONEY** (the swarm) -- also food-shaped, with one real difference worth keeping: honey does not spoil
(archaeological honey thousands of years old is still edible), where the existing food good spoils per type
in 7-16 days (round 55's own citation of BB's own rule). A wild hive raid real-world yields 5-15 kg of honey;
at 304 kcal/100g that is 15,200-45,600 kcal, 7.6-22.8 rations. Honey is a food-table entry that is sized like
a mid-size kill and, uniquely among the six Battle-Brothers-translated resources, NEVER goes on the spoilage
clock -- a real, sourced exception, not an invented one.

**HIDE** (feral dog, dire wolf pelt, cattle, tegu/monitor skin) -- needs a new GOODS entry, `unit:'hide'`,
`need:0` (an event good, same shape as the five field-surgery-kit items that already ship need:0, base:1).
Real-world spread is enormous and must become COUNT, not price: a cattle hide (25-35 kg raw) is a real
commodity (recent US raw-hide prices have fallen from roughly $80-100 to near $0-10 a hide this decade on
collapsed leather demand -- the real record ITSELF shows this product can be worth almost nothing, which
argues for low, not high, in whatever TUNING sets); a dog or dire-wolf pelt is a fraction of that mass, which
is why the record bundles small pelts ("hide" for the dog, "pelt, bounty" for the wolf) rather than pricing
them like a cattle hide. Tegu/monitor skin is the one small hide with real standing per-unit value today
(exotic leather goods, a genuine US tegu-boot trade) higher than a 2020s cattle hide pound for pound -- so
the honest ordering, by COUNT per kill rather than price per unit, is: one large hide (cattle/camel/horse/
aurochs) = several hide-units; one small pelt (dog/wolf) = a bundle needed to equal one unit; one tegu/
monitor = one unit despite its small size, because its real per-unit value is already high.

**IVORY** (the mammoth only) -- a new GOODS entry, the one deliberate WINDFALL good on this list. A mature
mammoth's tusks run roughly 20-45 kg each, and the real Siberian permafrost-thaw ivory trade (legal under
CITES because mammoths are extinct, unlike elephant ivory) prices raw "block" tusk at roughly $350 to
$1,500+/kg, meaning a single mammoth's tusks are worth tens of thousands of real dollars -- an order of
magnitude past any other product on this page. Translated the same way round 52 translated the Caracas water
ratio (sourced real multiplier, no invented digit): ivory's real per-kg value runs 10-50x a decent hide's,
which argues the COUNT a mammoth ivory-kill pays should sit an order of magnitude above a cattle-hide kill's
count, not a fractional bump. This matches the record's own placement: the mammoth is act 3, two tiles, "a
landmark, a hunt of a lifetime" -- the game already treats it as rare before this page touched it.

**MILK and BURDEN** (camel, live) -- the one entry that is not a kill at all, and does not belong in a sale
table. A lactating camel gives 5-20 L/day for 9-18 months (against the existing water need of 4.0 L/person/
day already in GOODS); a loaded camel carries roughly 150-200 kg over desert terrain, 6-8x a human porter's
20-25 kg. Both are RECURRING yields from a KEPT animal, not a one-time trophy sale -- this is a company asset
question (feed it, it feeds you back, every day, the way the purse's own frozen verbs already work), which
routes to LIFE+CITY and WORLD's livestock/keeping systems, not to a market price here.

**FEATHERS** (Haast's eagle) -- the one product with a real precedent for being worth MORE than the money
itself. The Victorian plume trade paid up to $32/ounce for egret aigrette feathers in 1915, against gold's
contemporaneous ~$20/ounce -- a real luxury good that nearly extinguished several heron and egret species in
the US and directly provoked the Audubon movement and the 1918 Migratory Bird Treaty Act's export ban. That
is exactly the record's own "renown" instinct for this item, and section 0 above says why it should not be a
sale at all: a feather is a FEW units, each worth many battery-equivalents in real terms, best spent as a
GIFT that moves a faction's belonging rung (section 0) rather than a commodity with a battery price -- the
plume trade itself was a status good bought by hat-makers and the wealthy to be SEEN with, not eaten or worn
for warmth, which is a belonging-rung behaviour, not a shelf-good behaviour.

**LIVE CAPTURE** (a handler's dog, camel or horse) -- checked against the company module directly: there is
no recruit-cost function anywhere in engine/bohemia_company.js to anchor this against (the module's own
header already says why: "THEY ARE PEOPLE WITH LEDGERS, NOT A ROSTER," no roster to price a slot in). Real
precedent exists (a trained falconry bird trades for $2,000-$20,000+ in today's Gulf market; a working horse
replaces roughly 5-10 human-labour-days of hauling), but with no in-engine anchor to translate the ratio
against, inventing a number here would be exactly the thing MECHANISM-MINE/CONTENTS-PAOLO'S forbids. Routed
to PEOPLE/FACTIONS [keepers] (already named as the owner of the handler mechanic in rule 42-i) rather than
priced blind.

## 4. WHAT THIS ROW ACTUALLY HANDS TUNING (ratios sourced above, no digit chosen here)
  - meat ration-count per kill: hog 50-80, cattle/aurochs 275-440, camel 165-250, ground-sloth-class 330-500
  - egg-to-ration: 1:1 (dino-bird egg = one ration, ostrich-egg sourced)
  - honey ration-count per hive raid: 7.6-22.8, AND flagged never-spoils (unlike every other food entry)
  - hide COUNT ladder (not price): small pelt bundle < 1 unit each; large hide several units; tegu/monitor 1
    unit despite small size (real per-unit value already above a 2020s cattle hide)
  - ivory COUNT: one order of magnitude above a large-hide kill, sourced from ivory's real 10-50x per-kg
    premium over hide
  - feather and live-capture: NOT a battery price at all -- routed, not numbered (sections above)
  - milk/burden: NOT a sale -- a daily kept-asset yield, routed to LIFE+CITY/WORLD
  - bounty: NOT this row -- routed to OPEN [contract pay]
Eight products addressed, zero digits invented, three (bounty, feathers, live capture) correctly refused a
battery price at all rather than forced into one. NOT IMPLEMENTED, research only.

## 5. BANK
Eight role-place lines, draft:true, in banks/BOHEMIA_ECONOMY_TEST_LINES_9_5_26.md (round 56, prefix
SSSSSSSSSSSSSSSS, one S longer than round 55's, matching the file's own running convention).

## 6. ROUTED
- COORDINATOR + COMBAT/WORLD (own the beast data file, rule 41): the six "renown" lines in THE SEVENTEEN
  (records/BOHEMIA_THE_BEASTS_OF_BOHEMIA_ROUND_THREE_THE_SEVENTEEN_9_29_26.md section 5 -- lion, sabre-tooth,
  hippo pod, dino-bird, eagle, ground sloth) contradict a ruling (bohemia_haggle, 9/22) older than the record
  itself, and should read as a belonging-rung gift/display, not a sellable "renown," per bohemia_ambitions.js's
  own 9/30 translation of the identical word.
- WORLD: two new GOODS entries, `hide` and `ivory`, `need:0` like the five field-surgery-kit items, counts per
  section 4 above, digits TUNING's.
- LIFE+CITY and WORLD: camel milk and burden as a kept-animal daily yield, not a sale (section 3).
- PEOPLE/FACTIONS [keepers]: live-capture value (a handler's dog/camel/horse), no in-engine anchor exists yet
  to price it against.
- TUNING: the eight sourced ratios in section 4, none of them typed as a felt number here.
- ECONOMY's own next line, OPEN [contract pay]: bounty, already named there, not re-solved here.
STATE unchanged: the builder half is a quarter built; this page adds no code.
