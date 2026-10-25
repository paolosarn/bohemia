# ECONOMY DAY 80: HOW MANY CURRENCIES. HIS FOUR ARE BATTLE BROTHERS' FOUR, AND THE GAME COUNTS ONE (10/25/26)

VAMILY ECONOMY [how many currencies], rule 164 item 2 (Paolo 10/24, on his PC: "we have four different currencies
in this game, you're only showing batteries, it's insane"). MODE: RESEARCH, one short page. Nothing built here.
Session economy-vamily-10-25, opened by the coordinator (rule 112). For UI, whose row [the PC playtest: the UI's
part] is open and waiting on this.

---

## 0. THE ANSWER

1. **The bar should show SIX: BATTERIES, FOOD, WATER, TAPE, MEDS, ROUNDS.** That is rule 47 (Paolo 9/29, LOCKED),
   in Battle Brothers' order with the desert's water after food. Holding the batteries still shows the nights left
   (that part of rule 151(a) is his).
2. **His "four" is Battle Brothers' four.** On 9/4 he said "battle brothers has 3-4 currencies too"; on 9/29 he
   listed them: "medicine, ammo, repair tools, food, and then gold." Battle Brothers counts money plus four things
   that get used up. Ours: batteries, plus FOOD, TAPE, MEDS, ROUNDS. Water is the sixth, the desert's. The town
   stall sells a different four (food, water, meds, rounds); put both fours together and you get exactly rule 47's
   five, so six on the bar covers every way of reading him.
3. **Not on the bar:** scrap (a loot good you sell), clout (standing, which nobody can buy; Battle Brothers keeps
   renown off its bar too), fuel and gas (not held by anyone).
4. **THE FINDING THAT PROVES US WRONG: only ONE of the six is a real number today.** Batteries are counted. FOOD is
   pooled into one generic count together with loot, so even food's number would lie. WATER, MEDS and ROUNDS are
   sold at the stall for a battery that buys nothing. TAPE has no count at all. Six icons on the bar today would
   show five dashes or five wrong numbers. So the counts get made first, then the bar shows them.
5. **How the bar lost them:** his words on 10/24 (rule 151(a)) were only about the DAYS LEFT: "it shouldn't show me
   how many days are left on the front; if I hold or hover over the amount of batteries, maybe then it displays how
   many days I have left." The word "only" in "the bar shows batteries only" was the coordinator's, not his. UI
   built the "only" at 20:52 (BUILD 10/24n). The same evening he called it insane. The bar had already gone from
   five figures and three dashes to two (TUNING's change 5, the ten changes round); 151(a) took it to one.

---

## 1. WHAT THE GAME HOLDS TODAY (measured on main, 10/25)

The demo's map is slices/BOHEMIA_CITY_WORLD.html in a frame; towns open slices/BOHEMIA_SETTLEMENT_SCREEN.html.

| the six | a count of its own? | what spends it | on the bar? |
|---|---|---|---|
| BATTERIES | yes: the purse's `electricity` (engine/bohemia_purse.js, the three keys at line 72); starts at the origin's money (290 for the default crew) | the nightly bill (2 a man), hires, the stall, the clinic, the barber, rent | YES, the only one (slices/bohemia_ui_materials.js, the glass pane) |
| FOOD | NO: pooled in `resources` with everything else; loot's rounds and scrap are credited into the same pool | `day:ate`, one a night | no |
| WATER | NO: folded into the nightly bill's money | the stall takes a battery and adds nothing (`counts:null`) | no |
| TAPE | NO key at all: `fight:plate` spends the generic `resources` | the fight's plate | no (its icon draws nothing) |
| MEDS | NO | the stall takes a battery and adds nothing | no |
| ROUNDS | NO company count: each gun's rounds live inside one fight only | the stall's "Six rounds" takes a battery and adds none | no (the crew screen shows a gun's "5 RDS") |

Also written and never seen: the town keeps its own purse and its food never reaches the map (only batteries sync
back); the old six-icon strip is still built and hidden by one CSS line; the bar's meds, rounds, tape and water
read a ledger object that only exists inside a test, so they would always be dashes; engine/bohemia_stash.js and
engine/bohemia_pricetable.js load their numbers only under node, never in the browser.

## 2. HIS FOUR, READ AGAINST THE CANON (newest date wins)

| date | what was ruled | what it says about the bar |
|---|---|---|
| 7/26 | laws/BOHEMIA_ADDENDUM_THREE_CURRENCIES_CENTURY_7_26_26.md: three currencies, RESOURCES, ELECTRICITY, CLOUT; no spreadsheet sim | three |
| 7/28 | laws/BOHEMIA_ADDENDUM_COMBINED_CURRENCY_ICONS_7_28_26.md: each currency one combined icon (an apple, a hammer, duct tape for resources) | three icons |
| 9/4 | his words: "battle brothers has 3-4 currencies too, how they manage it is superb" (records/BOHEMIA_BB_STUDY_DAY_23_FOUR_VERBS_THREE_CURRENCIES_9_4_26.md); batteries become the money and "this does not add a fourth" (laws/BOHEMIA_ADDENDUM_BATTERIES_ARE_THE_MONEY_AND_A_TILE_IS_A_HOUSE_9_4_26.md) | his "four" first appears, and it is Battle Brothers' |
| 9/7 | laws/BOHEMIA_ADDENDUM_THE_TOP_MENU_BAR_9_7_26.md: the bar may never show more than three | three, max |
| 9/29 | rule 47 (records/BOHEMIA_PAOLO_FIVE_RESOURCES_LIKE_BATTLE_BROTHERS_AND_GUNS_DECIDED_TOGETHER_9_29_26.md): "medicine, ammo, repair tools, food and then gold" = MEDS, ROUNDS, TAPE, FOOD, BATTERIES, plus WATER; "the HUD shows them" | SIX, and it replaces 9/7's cap |
| 10/24 | rule 151(a): days left behind a hold on the batteries (his words); "batteries only" (the coordinator's word) | one, by a misread |
| 10/24 | rule 164 item 2: "four different currencies... only showing batteries, it's insane" | every currency; newest |

So the canon's answer is rule 47's six. The 7/26 three are not dead; they are what a BUILDING makes (resources,
electricity, clout), the same stuff grouped by a different question (Day 81, the mayor page, section 2c).

**Battle Brothers' bar, for UI (how did Battle Brothers do it):** crowns, food (shown as days), tools, medicine,
ammunition, the day count and a sun for the time of day (reference/library/battle_brothers/10_UI_AND_FEEL.md).
Five resources, no labels, an icon and a number each. What makes it work is the rule this repo wrote down on 9/4:
**you never spend a resource; what you did spends it.** You walk, the men eat. You fight, the tools fix what broke.
You shoot, the quiver empties. You get hurt, the medicine goes. One verb each, so the number on the bar always means
something you can feel.

## 3. THE BAR, FOR UI

- **Left to right: BATTERIES, FOOD, WATER, TAPE, MEDS, ROUNDS.** An icon and a number each, no words (the six
  already exist as art cut from his survival packs, UI's 10/13 round). Six small numbers is one more than Battle
  Brothers and still Nintendo-simple (rule 117(b)).
- **Hold the batteries: the nights left show** (his 151(a) words, kept exactly). Food and water could show days the
  same way on a hold (Battle Brothers shows food as days); a default for UI, not a ruling.
- **Low reads red:** under three days of food or water, or the bill's red line on the batteries (already built).
- **Not on the bar:** scrap, clout, fuel, gas.
- **Never a dash and never an invented number** (the 9/7 law's line that still stands): an icon goes up when its
  count is real. Batteries can go up as they are; the other five wait on section 4.

## 4. WHAT HAS TO BE TRUE FIRST (for the lanes that build it)

1. **The purse gets six counts** (rule 47(a)), replacing the one generic `resources` pool. The purse's own comment
   "a fourth breaks the anti-spreadsheet ruling" is from before rule 47 and before 164.
2. **Each count is spent by its one verb**, the Battle Brothers way: food and water by the night (2 a man a day
   times the ground, engine/bohemia_stash.js already does the food half), tape by the fight's plates and repairs,
   meds by a wound per day, rounds by the shot from one company stock (Day 78), batteries by wages and the bill.
3. **What you buy goes into its count:** the stall's water, meds and rounds add to WATER, MEDS, ROUNDS; loot's
   rounds go to ROUNDS; scrap is sold for batteries and never becomes food.
4. **The town and the map share one purse**, so food bought in town is food on the map.
5. **Then the bar shows the six.**

## 5. FINDINGS NOT ASKED FOR

- The nightly bill charges money for "food and water" while the stall also sells food and water by the ration: two
  ways to pay for the same meal, and the one on the bar (batteries) hides the other. When the six are counted, the
  bill becomes wages only and the meal comes out of FOOD and WATER (Battle Brothers: wages in crowns, food from the
  pack).
- Clout can be spent (`ask:leaned`) but there is no way on the map to earn it: a currency with a drain and no
  faucet (Day 23 named this exact shape on 9/4).

## ROUTED

- **UI** [the PC playtest: the UI's part], item 2: the bar's six in section 3; a NOTE on its board.
- **RUN** (the map's purse and the nightly bill; one purse with the town): section 4, items 1, 2, 4.
- **RUN TWO** (the town's stall and scavenging adding to their own counts): section 4, item 3.
- **COMBAT** (rounds drawn from the company's stock into the fight, tape spent after it): section 4, item 2.
- **TUNING** (research only): the starting six for each origin, easier than Battle Brothers (rule 117).
- **MODS** (research only): the six as rows in the data line.
- **COORDINATOR**: rule 151(a)'s "only" was not his word; rule 164 item 2 replaces it. Rule 47's six stand.

Sources: the measured file lines above (main at 27bd138c); reference/library/battle_brothers/10_UI_AND_FEEL.md;
records/BOHEMIA_BB_STUDY_DAY_23_FOUR_VERBS_THREE_CURRENCIES_9_4_26.md; his verbatim words in
records/BOHEMIA_PAOLO_DAYS_ON_HOLD_MONEY_TEACHES_THE_SPEED_THE_CAMP_MEET_BEFORE_YOU_FIGHT_AND_SIGHT_DOWN_THE_STREET_10_24_26.md
and records/BOHEMIA_PAOLO_THE_PC_PLAYTEST_AND_THE_TWENTY_DOLLARS_10_24_26.md; UI's commit 30379982 (BUILD 10/24n).
