# ECONOMY -- ROUND 55, [six resources] BATTERIES-FOOD-MEDS-ROUNDS-TAPE-WATER
# 9/30/26. MODE: RESEARCH -- NOTHING IN THIS FILE IS IMPLEMENTED.
# Board row: VAMILY.md, economy-vamily-knxaeh, rule 47a (Paolo 9/29).
# records/BOHEMIA_PAOLO_FIVE_RESOURCES_LIKE_BATTLE_BROTHERS_AND_GUNS_DECIDED_TOGETHER_9_29_26.md

THE ROW: "the company ledger's six, each consumed the Battle Brothers way: food and water per
man per day (spoilage; the standpipe's price), tape per plate repaired (the fight already eats
tape), meds per wound per day (36b's clock), rounds per shot (scarce in act 1), batteries per
man per day in wages (Q49's debt is the first wage); what runs out first and what a stranger
does about it; one page with the rules and the first numbers to TUNING."

THE HEADLINE: FOUR OF THE SIX HAVE CODE. ONE OF THOSE FOUR IS COUNTED TWICE, IN TWO PLACES THAT
DO NOT AGREE, AND ONE OF THE SIX HAS NOTHING AT ALL -- BUT A SIBLING MODULE, BUILT THE SAME DAY
AS THIS RULING, ALREADY NAMED IT AND LEFT A SOCKET FOR IT. This is not six gaps. It is two
ledgers that were built for two different reasons, never introduced to each other, plus one
resource neither of them has ever heard of.

===========================================================================
1. WHAT THE REPO DOES TODAY, MEASURED ONE RESOURCE AT A TIME
===========================================================================
There are TWO SEPARATE SYSTEMS in this repo that could plausibly be "the company ledger," and
they use different vocabularies. engine/bohemia_purse.js is the PLAYER's own money: three
currencies (resources, electricity, clout), four frozen verbs, EVERYTHING COSTS ONE. engine/
bohemia_economy.js is the SETTLEMENT's own scarcity sim: named GOODS (water, food, salvage,
meds, fuel, power, plus the five-item field surgery kit), each with a real daily NEED per adult
and a base price. Neither file requires the other. Read against that split:

### BATTERIES -- the only one that is not really a "resource" at all
It is the currency itself. `PAYOUT.COMPLETE.electricity = 1` ("a day's work pays a battery",
round 49); `bohemia_lend.HANDSHAKE = 1` and `DUE_A_NIGHT = 1`, same currency (round 52). Wages
compounding by level are Battle Brothers' own number, already banked (round 49 section 3):
+2 crowns a level, x1.1 per level to 11, then x1.03 after; a level-11 Hedge Knight costs 91 a
day. NOTHING NEW MEASURED HERE. Cited, not re-run.

### FOOD -- built twice, and the two builds disagree
The PURSE charges `day:ate`: one debit of `resources`, flat, once per nightfall, no matter how
many mouths (round 52). The ECONOMY sim separately carries `GOODS.food = {unit:'ration',
need:1.0, base:1.5}` -- ONE RATION PER ADULT PER DAY, a real per-head number, feeding a
settlement-wide stock-and-price simulation (`mktLedger`, round 40/52) that the player's own
purse never reads and never writes. **THE PLAYER'S OWN HUNGER AND THE VALLEY'S OWN HUNGER ARE
TWO DIFFERENT NUMBERS COMPUTED BY TWO DIFFERENT ENGINES THAT DO NOT KNOW THE OTHER EXISTS.**
Battle Brothers' real number, already banked (round 49): 2 provisions per brother per day, spoils
per TYPE (this round, new: ground grains spoil in 7 days, masterfully cured rations in 16 --
Battle Brothers Wiki), the company automatically eats whatever is closest to spoiling first, and
running out lowers morale before it starves anyone (desertion, not death; round 52's own finding
that desertion FALLS in a real collapse applies here too).

### MEDS -- exists as a settlement statistic, is not connected to any wound at all
`GOODS.meds = {unit:'dose', need:0.02, base:12.0, note:'rare use, extreme value/weight'}` is a
POPULATION-LEVEL daily consumption rate for the scarcity sim, not a per-injury healing rate.
Searched the whole engine for a wound, injury or heal module: **NONE EXISTS.** Rule 36b's own
"struck down = 20% dead, else a debilitating injury 30-40 game days" is a LAW, not yet a line of
code anywhere -- there is no clock counting those days down and nothing that would read a meds
balance to shorten it. Battle Brothers' real rule, already banked (round 49): 1 medicine per
injury per day, or the injury does not heal. **THE NUMBER TO TRANSLATE ALREADY EXISTS IN OUR OWN
BANK. THE THING IT WOULD ATTACH TO DOES NOT EXIST YET.**

### ROUNDS (ammo) -- the one true zero, with a named socket waiting
Searched the whole engine and the city slice for ammo, ammunition, magazine or clip as a real
mechanic: **ZERO HITS that are not comments or a brand-new empty list.** No purse verb, no GOODS
entry, no reach-and-fire mechanic (the "pistol 1, rifle 2, scope 3" reach law from 9/22 has no
code anywhere either -- COMBAT has not built it). BUT: `engine/bohemia_scavenge.js`, shipped THE
SAME DAY as this ruling (9/29, WORLD, row [scavenge]), already carries
`KINDS = ['food', 'medicine', 'battery', 'tape', 'ammo']` -- FIVE of our SIX names, verbatim,
built from Paolo's own scavenge sentence ("food, medicine or batteries... a recent battle: more
ammo"). It has zero live callers yet and its own `bonus()` function for "more ammo after a fight"
returns UNREAD because nothing in the game records that a fight happened anywhere -- WORLD
measured that gap the same round, named it COMBAT's to close with one publish call, and did not
invent a number to paper over it. **THIS MODULE IS THE CLOSEST THING TO "THE SIX" ALREADY
BUILT, AND IT IS ONE DAY OLD.**

Battle Brothers' real ammo rule, new research this round: a bundle is 50 units; one arrow or
bolt costs 1, one handgonne shot costs 2, one thrown weapon or fire-lance charge costs 3; a
quiver holds 10 (14 crafted) and refills automatically AFTER a battle from the company's own
stockpile, never mid-fight; a Fletcher or an Arrow Maker's Shed sells more, cheaper; the
Scavenger perk recovers some of what was spent; max carry is 300-500 depending on difficulty;
ENEMIES HAVE INFINITE AMMO, an asymmetry the developers kept on purpose (Battle Brothers Wiki,
Fandom Ammunition page).

### TAPE -- built, but as a flat abstraction, never a granular repair
`fight:plate`: one debit of `resources`, flat, once per bell, regardless of how much armour
actually broke (round 52's own finding about this verb, restated: no headcount, no quantity
argument in `upkeep()`'s signature). No `GOODS` entry named "tape" exists at all -- the field
surgery kit has five named items and the general economy has six, and none of the eleven is
tape or a repair material. Battle Brothers' real rule, already banked (round 49): 1 repair tool
per 15 points of durability repaired, or the weapon breaks for good. **OURS IS A YES/NO SWITCH
WHERE THEIRS IS A METER.** That is not necessarily wrong -- it is the same "the routine hit
costs one" shape rule 23 already uses in combat -- but it means "how much armour a plate saved"
is currently invisible to the purse; only "did the bell happen" is billed.

### WATER -- a real price is banked, nothing charges the player for it
`GOODS.water = {unit:'L', need:4.0, base:0.25, note:'3L sedentary, 6-8 desert labor; 4 mixed'}`
exists in the scarcity sim exactly like food does, and it has the identical disconnect: the
player's own purse has no `drink:water` verb, no fifth currency, nothing. Round 47's own real-
world translation is already banked and needs no re-run: **one battery every four to six days**
for a household's water share (Caracas: 15-25% of a 30-battery month). Battle Brothers has no
water mechanic at all to compare against -- it is a temperate-Europe game and never needed one --
so THIS IS THE ONE RESOURCE OF THE SIX THAT IS ENTIRELY OURS, not a translation of anything BB
built. The "standpipe" the row names is real in the art (`bohemia_utility.js` draws one on every
water tower/pump building) but it has never once been a transaction point in any code.

===========================================================================
2. THE SHAPE, NOT A NUMBER TABLE: WHAT RUNS OUT FIRST AND WHAT A STRANGER DOES
===========================================================================
Reading the six against what is ALREADY MEASURED rather than guessing fresh:

  ORDER OF COLLAPSE FOR A STRANGER (round 49's own numbers, restated in this frame): work pays 1
  battery, food costs 1, the loan asks 1 a night -- HE IS EXACTLY ONE SHORT EVERY DAY. Of the six,
  BATTERIES run out FIRST because nothing hands a stranger any (round 49: zero of sixteen
  factions pay money). FOOD is second, because day:ate is the only one of the six the purse
  actually enforces today. MEDS, ROUNDS and TAPE cannot "run out" for the player at all right
  now, because nothing charges for them yet -- an absence that reads as abundance, which is
  worse than scarcity, not better (the same shape round 53 found for a fight costing zero
  minutes: a thing that should have a cost and does not is not a feature, it is a hole with
  good manners). WATER is priced but invisible the same way.

  WHAT A STRANGER DOES ABOUT IT, using mechanisms this repo already has and already tested: for
  food and water, round 53's own answer applies unchanged -- EVERYTHING COSTS ONE forbids a
  price spread, so the honest lever is ACCESS (a settlement's shelf, a standpipe's queue) and
  COUNT (bohemia_scavenge's own search-until-PICKED_CLEAN, already built, already gate-tested,
  today wired to nothing). For meds and rounds specifically, the scavenge module IS the answer
  already drafted by WORLD: `KINDS` already names both, `YIELDS` ships empty by the same
  MECHANISM-MINE/CONTENTS-PAOLO'S discipline every other table in this repo follows, and the
  one thing missing to make "a recent battle: more ammo" real is COMBAT publishing one deed
  when a fight ends -- a single call, not a new system, already routed by WORLD to COMBAT.

  THE REAL-WORLD GROUNDING FOR ROUNDS, NEW THIS ROUND: the scarce, valuable, RECOVERABLE part of
  a cartridge is the brass casing, not the powder or the bullet -- frontier and post-supply
  reloading has always worked this way, and "reloading business activity always accompanies
  periods of political and social unrest" (loaddata.com, on 1800s frontier practice and modern
  shortage cycles). That maps EXACTLY onto scavenge's own bonus concept: a battlefield leaves
  brass behind, which is why "a recent battle: more ammo" is the realistic bonus and not a
  gamified one. THE DURABLE/CONSUMABLE SPLIT ALREADY EXISTS IN OUR OWN BANK TOO -- the field
  surgery kit's `tweezers` entry is marked `durable:true` ("sterilised, never consumed, the one
  piece you keep") beside four consumed items. A cartridge case is the tweezers of ammunition:
  recoverable, reusable, worth more per unit of weight than what it once held.

===========================================================================
3. THE FINDING
===========================================================================
THE SIX ARE NOT SIX GAPS OF EQUAL SIZE. They are two pre-existing ledgers (the purse, the
scarcity sim) that were each built correctly for their own job and have never been introduced,
plus one true zero (rounds) that a sibling module already named a socket for on the day of the
ruling itself. The player-facing question "what have I got left" cannot be answered honestly by
either ledger alone today: the purse knows what the PLAYER can afford and never what a THING is
worth in the world; the scarcity sim knows what the VALLEY has and never what the player is
carrying. Rule 47a's "company ledger" does not exist as a single object anywhere in the repo --
it would have to be the first thing that reads both.

FOR TUNING, THE FIRST NUMBERS THIS ROUND CAN HAND OVER WITHOUT INVENTING ANYTHING (every one
already ruled by him, banked by an earlier round, or read straight off a shipped constant):

    a battery, a day of work                    1                          round 49
    a battery, a night's loan (given or owed)    1                          round 49/52
    food, a mouth, a day                         1 (purse) / 1.0 ration (sim, unconnected)  measured this round
    a household's water                          1 battery every 4-6 days  round 47
    medicine per injury per day, BB's own rate   1                          round 49 (translation only)
    tools per 15 durability repaired, BB's own   1                          round 49 (translation only)
    ammo per shot, BB's own rate                 1 (bow/bolt), 2 (handgonne), 3 (thrown)  new this round
    a company of any size, the purse's own bill  1 (no headcount anywhere)  round 52

NONE OF THESE IS A RECOMMENDATION TO BUILD SOMETHING TODAY. This lane does not implement. They
are the numbers TUNING would need on day one of wiring meds, rounds or a connected food ledger,
sourced rather than guessed.

===========================================================================
4. WHAT THIS ROUND DID NOT MEASURE, SAID PLAINLY
===========================================================================
- Whether "medicine" is the purse's own missing third RESOURCES icon (WORLD's own hypothesis,
  bohemia_scavenge.js's header comment, citing the purse's 7/26 "a third icon is [PENDING
  Paolo]" note). Not this lane's currency ruling to make; named and left for WORLD/the
  coordinator.
- Any specific gun-class-to-ammo-type mapping. Rule 47a section 2 of its own source record is
  explicit that weapon classes are COMBAT's big-brain research, decided with him in VOTE, not
  invented here.
- What a scarcity-sim GOODS need-rate should become once the purse and the sim are ever unified
  (whether the purse's flat 1 wins, or the sim's per-head 1.0 ration does, or a company-size
  loop like night:power's is built for food the way round 52 argued it should be). That is a
  design choice for whichever lane builds the unification, not a number to invent here.

===========================================================================
5. ROUTED
===========================================================================
WORLD        bohemia_scavenge.js already names five of the six kinds and ships YIELDS empty by
             design; nothing broken, nothing to fix. Its own bonus() gap (ammo after a fight)
             is already routed to COMBAT in its own header comment; not repeated as a new
             finding here, only cross-referenced.
COMBAT       one publish call when a fight ends (bohemia_deeds.publish, the shape
             bohemia_claims/bohemia_haggle already build rows in) is the one piece that turns
             "a recent battle: more ammo" from UNREAD into a real answer. Already WORLD's own
             routing; this round independently arrives at the same file and confirms it.
TUNING       the eight sourced numbers in section 3, none of them invented, all of them already
             ruled or already banked by an earlier round or a fresh translation this round.
COORDINATOR  a real design question, not this lane's to rule: is "the company ledger" meant to
             be a NEW third object that reads both the purse and the scarcity sim, or is one of
             the two meant to absorb the other? Both existing systems are individually correct
             for what they were built to do; unifying them is an architecture call, not a
             number.

===========================================================================
6. THE [bb ...] SCHOOL LINE (rule 33, every chat, continuously)
===========================================================================
[six resources] Battle Brothers' five (gold, food, medicine, ammo, repair tools) map almost
perfectly onto four things we already have and one true gap. Where we differ from BB on
purpose: we have no water at all in their world, and they have no headcount scaling in ours --
a company of nine costs what a company of one costs today, which BB would never allow (its own
payroll IS the brake on growing a company, round 52).

===========================================================================
7. THE ANALOG HORROR LINE (rule 20h, every chat)
===========================================================================
A man can carry an empty gun through a collapsed city for a hundred hours and the game will
never once tell him it is empty, because nothing anywhere is counting what is left in it. THE
HORROR IS THE WEAPON THAT NEVER RUNS DRY: not because ammunition is plentiful, but because
nobody built the number that would let it matter, so every shot he has ever fired was free and
none of them ever were.

===========================================================================
8. NOT IN A TAB YET
===========================================================================
This record is research. The purse and the scarcity sim are both live and reachable by playing;
bohemia_scavenge.js exists in the engine but is not wired to any screen yet. Nothing about
connecting the six, or building rounds/meds as real mechanics, has been built.
