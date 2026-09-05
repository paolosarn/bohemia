# BB STUDY -- DAY 23: FOUR VERBS, THREE CURRENCIES
# (coordinator, 9/4/26, ON HIS DIRECTION: "battle brothers has 3-4 currencies
# too you should look into that fr how they manage it is superb")
# Days 1-22: records/BOHEMIA_BB_STUDY_DAY_*.md

## 0. THE QUESTION, AND IT IS HIS
Not a day I picked. He named the subject and he named the judgement:
**"how they manage it is superb."** So the job is to say exactly WHAT is
superb about it, in one sentence a lane can build from, and then measure
how far we are from it.

## 1. WHAT BATTLE BROTHERS ACTUALLY HAS
Crowns, plus **four things that get used up**:
```
PROVISIONS   two units per man per day. it SPOILS, best quality slowest,
             and the men always eat what is closest to spoiling first.
             run out -> mood falls -> after a while, MEN DESERT.
TOOLS        one point repairs 15 points of armour or weapon durability.
             used after EVERY fight. run out -> your gear stays broken.
MEDICINE     heals injuries faster. run out -> the wounded stay wounded longer.
AMMUNITION   refills quivers and thrown weapons. run out -> archers are useless.
```
All four are bought and sold at towns, at prices that depend on where the
town is (food cheap near farms, tools near cities). All four take up bag
space, so you cannot carry the world.

## 2. *** WHAT IS SUPERB ABOUT IT, IN ONE SENTENCE ***
> **YOU NEVER SPEND A RESOURCE. WHAT YOU DID SPENDS IT.**
Nobody in Battle Brothers opens a menu and allocates tools. You FIGHT, and
the tools drain to fix what the fight broke. You WALK, and the men eat.
You SHOOT, and the quiver empties. You GET HURT, and the medicine goes.
**Each resource is spent by exactly one verb, so you always know what
took it, and there is no screen where you manage any of it.**
That single rule is the anti-spreadsheet answer he has been asking for
since 7/26 ("games like that are called spreadsheet simulators and I'm not
a fan"). A spreadsheet is where you allocate. Here nothing is allocated.
**The resource is the shadow of the thing you did.**
### AND THE FOUR PUNISHMENTS ARE FOUR DIFFERENT SHAPES
Run out of food and the punishment is **SOCIAL** (they leave). Run out of
tools and it is **PHYSICAL AND DELAYED** (you find out next fight). Run out
of medicine and it is **TIME** (healing slows). Run out of ammo and it is
**IMMEDIATE AND TACTICAL**. None of the four is game over, and none of the
four is a bar on the player. Day 7 already found that survival meters are
the genre's most hated mechanic and that the most punishing campaign ever
shipped has no hunger meter on the player at all -- **this is how.** The
stock is the company's, the drain is automatic, the pain lands on people
and on the next fight.
### AND ONE OF THEM ROTS
Food spoils, and the men eat the nearest-to-spoiling first. So you cannot
hoard your way out; you have to keep moving and keep trading. That is day
10's "loot is a countdown" applied to the pantry.
### AND THE DEVS SAID THE HONEST THING OUT LOUD
From their own blog, before they reworked it: *"Handling provisions is one
of those mechanics that are kind of underwhelming. You get why it's there
-- the logistics of running a mercenary company should be part of the game
-- but it doesn't really add that much."* **So they reworked food so that
HAVING it does something** (thresholds that buff, not only a drain that
hurts), and made it diverse. **A resource that only punishes is a chore. It
has to give you something when it is full.**

## 3. THE MEASUREMENT -- NOTHING YOU DO IN BOHEMIA COSTS ANYTHING
His law (7/26, LOCKED): **three currencies** -- RESOURCES (an apple, duct
tape, a possible third icon pending), ELECTRICITY, CLOUT. Frozen at three;
the purse comment says *"a fourth breaks the anti-spreadsheet ruling."*
Measured today, in the walked city and every engine module:
- **The ONLY debit in the whole game is buying at a market**, in
  `resources`. One caller. Its own comment: *"A HARD SINK, on purpose... the
  half of a faucet-and-drain economy that actually fights inflation."* It is
  the right idea, and it is the only one.
- **ELECTRICITY HAS NEVER MOVED. CLOUT HAS NEVER MOVED.** Zero credits,
  zero debits, anywhere, ever.
- The ledger already knows the word: `KINDS = [source, drain, convert,
  transfer]`, with `drain` described as *"destroyed and gone -- a HARD SINK
  -- this is what fights inflation."* **The vocabulary is built. One verb
  uses it.**
- The day loop's `STAKES: []` is *"empty ON PURPOSE"* (day 7).
- **The lit grid costs nothing per night.** LIGHT=TERRITORY is live, every
  circuit carries an owner, and holding a lit block is free.
- Armour resets every bell (day 10), so a fight costs nothing.
- Walking costs time and nothing else (day 19).
**SO: WALKING IS FREE. FIGHTING IS FREE. HOLDING GROUND IS FREE. ASKING IS
FREE. THE ONLY THING THAT COSTS ANYTHING IS SHOPPING.** And day 20 found
nobody has ever been paid, which now reads differently: **with nothing
draining, being paid would be a score, not an income.** An economy is a
faucet AND a drain, and we have written the word for the drain and never
turned one on.

## 4. *** THE MAP, AND IT FITS HIS THREE WITHOUT A FOURTH ***
He said "3-4 currencies." BB has crowns plus four consumables. His law is
three, frozen. **They fit, because his RESOURCES bucket already carries the
icons, and the icons are the consumables.** His own words: *"an apple, duct
tape, and maybe another important thing."* Duct tape IS tools and supplies.
The apple IS provisions. So the mapping is four verbs on three currencies,
and every verb already exists in the game:
```
THE DAY EATS FOOD          (apple)      you got up, people who depend on you ate.
                                        run out -> the people you owe stop
                                        showing up (day 7's obligation burn,
                                        BB's desertion). NO METER ON THE PLAYER.
THE FIGHT EATS TAPE        (duct tape)  the bell rang, the plate you wore is
                                        spent. run out -> no plate next bell.
                                        BB's tools; day 10's "wear on armour".
THE NIGHT EATS POWER       (electricity) every lit circuit you hold burns one.
                                        run out -> your block goes dark, and
                                        NOBODY PATROLS THE DARK. holding
                                        ground finally costs something.
ASKING EATS CLOUT          (clout)      you leaned on somebody. run out ->
                                        they are done being asked (the
                                        approved claim ration, day 7).
```
Four verbs. Three currencies. No new icon, no new screen, no fourth
currency, and **every amount is 1** under EVERYTHING COSTS ONE (8/15),
which is the only reason this can be built without a single number from
him. AND THE OTHER HALF, from the BB devs' own lesson: **each one gives you
something when it is full**, and under NO DAMAGE BEFORE THE DIAL that
something is ACCESS, never a stat (day 10): full food, your people are
there; tape in hand, a plate at the bell; power, your lights hold and the
dark stays where it is; clout, you can ask.
### WHAT SPOILS
Food. That is the one BB rule worth copying exactly, because it is what
keeps you from hoarding and it is REALISM FIRST in the Mojave (nothing
keeps at 40C). The apple rots; the tape and the batteries do not.

## 5. WHAT WE TAKE, AND WHAT WE REFUSE
**TAKE:** the one sentence in section 2, as the rule for every drain we
ever add. The four verbs. Spoilage on food only. And "full means access",
so a resource is never only a punishment.
**REFUSE:** a fourth currency -- his law freezes three and the icons carry
the rest. A hunger bar, a thirst bar, any meter on the player's body --
day 7 and BB both say the pain lands on people and on the next fight, not
on a gauge. Ammunition as a currency: guns are bad in close forever (day
3) and rounds already ride the fight's own loot; making them a purse line
would drag the fight into the spreadsheet. And any number above 1.

## 6. ROUTED
- **WORLD -- BB-FOUR-VERBS-THREE-CURRENCIES.** The four drains above, on
  the walked surface, each posted as a ledger `drain` with the verb as its
  reason, at 1 each. Sits directly behind BB-THE-LETTER-IS-ONE because a
  drain with no faucet is a countdown to zero on day one. **Second in the
  WORLD queue.**
- **WORLD -- BB-THE-NIGHT-EATS-POWER.** The one drain with the most game in
  it: every lit circuit you hold costs one electricity a night, and a block
  you cannot pay goes dark. LIGHT=TERRITORY becomes a bill, which is what
  makes territory (day 6) mean something. Rides the row above.
- **COMBAT -- BB-THE-FIGHT-EATS-TAPE.** The plate reset at every bell is
  paid for in tape; no tape, no plate. Composes with BB-ARMOUR-COSTS (day
  15) and the weapon-wears-on-armour idea (day 10).
- **RUN / UI -- BB-THE-SHADOW-OF-WHAT-YOU-DID.** The reckoning card names
  which verb took what today -- "the day ate one food, the night ate two
  power" -- because the whole point of one-verb-one-resource is that the
  player always knows what took it. Rides with BB-THE-END (day 13).
- **PEOPLE -- (no new row.)** BB's desertion is our BB-OBLIGATION-BURN, day
  7, already routed. Food running out feeds it; nothing new to write.

## 7. CONFIDENCE
- Electricity and clout never moving, the single debit caller, the `drain`
  kind's own comment, `STAKES: []`, and the lit grid costing nothing:
  **MEASURED** today in the walked city and engine/.
- His three-currency law and its exact wording (apple, duct tape, a third
  pending): **QUOTED FROM THE LAW.**
- BB's four consumables, two units of food per man per day, spoilage and
  eat-nearest-to-spoil-first, one tool point per 15 durability, desertion
  on hunger: wiki, **HIGH.** The devs' "kind of underwhelming" quote and the
  threshold-buff rework: from their blog via search; the blog is
  proxy-blocked here and was NOT read directly. **MEDIUM-HIGH.**
- Section 2's one-sentence rule, section 4's mapping onto his three, and
  section 6: **MY ARGUMENT AND MY ROUTING**, on his direction.

## SOURCES
Battle Brothers wiki pages on Provisions (two per man per day, spoilage,
eat-nearest-to-spoil-first, mood and desertion), Tools and Supplies (one
point per 15 durability, auto-repair after every fight), Medicine and
Ammunition, and Game Mechanics. Battle Brothers developer blog #65
"Provisions & Sound" (the "kind of underwhelming" admission and the
threshold buff/debuff rework) and #84 "Mood and Desertion". IN-REPO:
laws/BOHEMIA_ADDENDUM_THREE_CURRENCIES_CENTURY_7_26_26.md;
engine/bohemia_purse.js (`CURRENCIES`, `KINDS`, `debit`);
engine/bohemia_payday.js and slices/BOHEMIA_CITY_WORLD.html (the market
buy, the only debit); the day loop's `STAKES`; and days 2, 3, 6, 7, 10, 15,
19 and 20 of this study.
