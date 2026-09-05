# BB STUDY — DAY 10: LOOT IS NOT A REWARD, IT IS A COUNTDOWN
# (coordinator, on his trigger. Days 1-9: records/BOHEMIA_BB_STUDY_DAY_*.md)
# THE SUBJECT: GEAR. And it is the direct continuation of day 9.

## 0. THE QUESTION
Day 9 ruled that growth cannot be levels going up. So what IS growth over
a hundred hours? **In the game he named, the answer is GEAR** — a peasant
in good armour beats a veteran in rags. And he ruled this in himself on
8/25: *"NOT A SINGLE LOOT IDEA OR ENEMY AROUND"*, and **LOOT EXISTS** is
now demand-side.

## 1. BB'S GEAR ECONOMY, AND ITS BEST IDEA IS THE ONE NOBODY COPIES
- **Armour is a second health pool.** It absorbs before you do.
- ***A WEAPON WEARS OUT ON ARMOUR, NOT ON FLESH.*** Durability
  deteriorates when it hits armour; hitting an unarmoured or lightly
  armoured man costs the weapon nothing.
- **At zero durability the weapon is PERMANENTLY DESTROYED.**
- Repair costs **Tools and Supplies** — one point of tools per fifteen
  points of durability, three points repaired an hour, faster with a
  blacksmith — or money at a town, restoring an item to peak condition.
### WHY THAT SECOND BULLET IS THE WHOLE DESIGN
**EVERY EXCHANGE COSTS BOTH SIDES MATERIAL.** You do not simply win a
fight; you spend a hammer to win it. Armour is not a wall, it is a way of
making the other man's kit run out. And it means the interesting question
before a fight is not "can I win" but **"is this worth what it will cost
me to win it."** That is day 7's motor pointed at objects instead of
people, and it is the same shape: the pressure is upkeep, not damage.

## 2. THE SHELF, MEASURED — LOOT IS BUILT, AND IT CANNOT LEAVE THE ROOM
### (a) IT IS REAL, AND IT IS HIS OWN RULING, IMPLEMENTED
Measured in the decoded fight. On every death: `dropRounds`, XP worth a
quarter of the body's health, `lootRoll()` at **LOOT_CHANCE 0.55** over an
eight-item table (a folded twenty, half a pack of smokes, a keyring
nobody's house, a cracked phone still warm, painkillers four left, a photo
of somebody's kids, un rosario worn smooth, an off-strip casino chip —
every one `draft:true`), a plate at **PLATE_CHANCE 0.22**, and a boss's
key on his body. All of it lies on the ground where he fell and you walk
to it, which is his 8/25 ruling exactly: *"you get experience and loot OFF
THEIR BODIES."*
And the code already caught its own first mistake, in its own words:
> *"nobody walks into a firing line for half a pack of smokes."*
Which is why the plate exists. **A REWARD HAS TO BE WORTH THE GROUND YOU
CROSS FOR IT.** That is a real design lesson already learned here.
### (b) *** AND NOTHING YOU PICK UP LEAVES THE FIGHT. EIGHTH INSTANCE. ***
The fight's one message out is `BOHEMIA_COMBAT_END`, and its payload is:
```
victory, result, reason, kills, dead, spared, fled, alive, fates,
playerHP, turns, encounterId, questId, stepId
```
**NO LOOT. NO XP. NO PLATES. NO KEYS.** A body count and a health number.
POSITIVE CONTROL, because this study has been burned by instruments
twice: exactly **two** things persist out of the arena, both by
`localStorage` — `bohemia.tree` and `bohemia.keys` — so the mechanism for
carrying something out EXISTS and is used. Loot is not on it. It goes into
`G.ledger.loot` and `G.rc.loot`, gets a read-line saying OFF THE BODY, and
**dies with the fight.** (And per day 9, the keys that DO persist have
zero readers, so that door is shut too.)
**YOU LOOT THE DEAD AND YOU KEEP NOTHING.**
### (c) AND ARMOUR IS A CONSUMABLE, NOT A POSSESSION
`G.pp = PLATE_START` runs at the top of every fight. Plates crack as you
take hits (PLATE CRACKED, then PLATE GONE) and come back full next bell.
So our armour is a per-fight resource. **Nothing in this game is an object
you own, maintain, and can lose for good.**
### (d) THE ONE SEED THAT EXISTS, AND IT IS PERFECT
In the walked city's medical kit spec, one line:
> `tweezers: { ... durable:true, note:'THE DURABLE. Sterilised, never
> consumed. The one piece you keep.' }`
**ONE OBJECT IN THE WHOLE VALLEY IS WRITTEN AS A THING YOU KEEP.** The
distinction between what is used up and what is kept already exists, in
one field, on one pair of tweezers.

## 3. THE OTHER AISLE — THE REAL VERSION OF OUR VALLEY IS CUBA
Not a guess: it is the closest documented case of a place that lost its
supplier overnight and had to keep the machines running anyway.
- After the Soviet collapse the economy fell into the **"Special Period"**,
  declared officially as a *"Special Period in a Time of Peace"*, with
  wartime rationing brought forward into peacetime.
- The operative words became **"INVENTAR Y RESOLVER"** — invent and
  resolve. That is not a slogan somebody wrote later; it is what people
  said they were doing.
- With no replacement parts for decades, engines were kept alive with
  parts pulled out of entirely different vehicles, producing
  **"Frankenstein" cars** — a body from one decade, an engine from
  another, a fix nobody designed.
- **THE GOVERNMENT PRINTED REPAIR MANUALS FOR CITIZENS.** Repair became
  civic infrastructure, and street-side repair businesses became an
  industry.
**SO THE REAL SKILL IN A COLLAPSED ECONOMY IS NOT SCAVENGING. IT IS
FIXING.** And note what the two verbs are: they are Spanish, they are
already in this valley's mouth, and they arrive with no new language work
at all — the 8/26 cap is untouched.

## 4. *** THE FINDING THAT CHALLENGES WHAT WE BELIEVE ***
The default loot loop is: kill, take, get stronger, kill bigger. **THAT
IS THE VERTICAL GROWTH DAY 9 JUST REFUSED, WEARING A BACKPACK.** And we
cannot build it anyway: it needs a damage dial we do not have.
**HERE IS THE REFRAME, AND IT IS TRUE OF OUR WORLD RATHER THAN CONVENIENT
FOR IT: NOTHING IN THIS VALLEY IS MANUFACTURED. Ten years after the
collapse, every object that exists was made before it, and the total
stock only goes DOWN. So loot is not a reward. IT IS A COUNTDOWN.** Every
plate you take is a plate that is now one fight closer to cracked, and it
is a plate somebody else does not have.
**THREE THINGS FALL OUT AND EVERY ONE IS ALREADY HALF-BUILT HERE:**
1. **THE INTERESTING VERB IS NOT ACQUIRE, IT IS KEEP WORKING.** Which is
   the one thing our medical kit already models with `durable:true`.
2. **THE VALUABLE ASSET IS A PERSON, NOT AN OBJECT.** Whoever can fix it
   outlives whatever they fixed. That is day 8's back of house, and it is
   already written in his own ladder: **THE SMITH** — *"run a WORKSHOP at
   base: scrap becomes resource currency, weapons get customised."*
3. **AND LOOT THAT IS NOT POWER HAS ONLY ONE OTHER THING TO BE: ACCESS.**
   A thing that OPENS something rather than adding to something.
### AND THAT LAST ONE IS ALREADY OUR ANSWER, ALREADY SHIPPED
**A BOSS KEY IS EXACTLY THAT OBJECT.** It lies on a body, you cross
ground for it, and what it gives you is a door, not a number — the 8/27
law's own words, a boss hands you a VERB. **We have been describing our
loot system as though it were missing while the best version of it is
already in the game and simply cannot leave the room.** Day 9 found the
keys have no readers. Day 10 finds the same pipe would carry the rest.

## 5. WHAT WE TAKE, AND WHAT WE REFUSE
**TAKE:** gear that wears, and wears on ARMOUR rather than on flesh, so
every exchange costs both sides; a repair cost paid in tools and time, so
a fight has a price you can decide against; the durable-versus-consumed
distinction we already wrote once; loot as ACCESS, because that is the
only kind that survives having no damage dial; and the fixer as the prize.
**REFUSE:** loot as a power ladder (day 9); an inventory screen as the
main verb, because the documented failure of loot systems is exactly the
busywork day 7 refused for survival meters; infinite spawned gear, which
would quietly re-manufacture a world that cannot manufacture; and any
number, as always.

## 6. ROUTED
- **COMBAT / SHARED — BB-LOOT-LEAVES.** Put what you picked up in
  `BOHEMIA_COMBAT_END`. It currently carries a body count and a health
  number; the loot, the XP, the plates and the keys all die in the arena.
  The carrying mechanism already exists and is used twice. **Pairs with
  day 9's BB-KEYS-LAND — same pipe, same afternoon.**
- **WORLD — BB-ONE-WAY.** Nothing in the valley is manufactured. The stock
  of everything only goes down, and a thing you take is a thing somewhere
  else no longer has. This is the frame the market model (day 2) and the
  supply lines (day 7) both want, and it needs no new economics.
- **PEOPLE / QUESTS — BB-WHO-FIXES-IT.** The person who can fix it is
  worth more than the thing. Uses day 8's former trades directly, and it
  is already a boss in his ladder (THE SMITH). A quest that needs a
  working generator should be a quest about a PERSON.
- **COMBAT — BB-LOOT-IS-ACCESS.** Loot opens doors; it does not add
  numbers. The boss key is the pattern and it is already built. Nothing
  here sets a damage value, so it ships under NO DAMAGE BEFORE THE DIAL.
**RUNNING ORDER:** behind the demo. BB-LOOT-LEAVES is small, and doing it
in the same turn as BB-KEYS-LAND makes two of this study's eight
"built-but-goes-nowhere" findings disappear at once.

## 7. CONFIDENCE
- The loot table, the two chance dials, the end payload's exact fields,
  the two localStorage survivors, the plate reset and the tweezers line:
  **MEASURED** in the decoded combat payload and the walked city, with the
  positive control stated.
- BB's weapon durability wearing on armour, permanent destruction at zero,
  and the tools-to-durability repair rate: wiki, the developers' own blog
  post title on weapon durability, and player discussion. The blog itself
  is proxy-blocked here and was NOT read. **MEDIUM-HIGH.**
- The Special Period, "inventar y resolver", parts cannibalised across
  vehicles, and state-published repair manuals: widely documented,
  consistent across sources. **HIGH.**
- §4's reframe, §5 and §6: **MY ARGUMENT AND MY ROUTING.** That loot must
  be access rather than power follows from his own rulings (no damage
  dial, growth goes sideways), so it is a derivation, not a preference.

## SOURCES
Battle Brothers wiki (Tools and Supplies) and the developers' blog post on
weapon durability, plus Steam gameplay discussions on repair rates,
blacksmiths and town repairs. Documentation of Cuba's Special Period:
the official "Special Period in a Time of Peace" framing and wartime
rationing, "inventar y resolver" as the operative verbs, parts pulled from
Soviet-bloc vehicles producing "Frankenstein" cars, state-printed repair
manuals and the street repair economy. IN-REPO: the decoded `COMBAT_B64`
payload inside slices/BOHEMIA_ALPHA_0_9.html (LOOT_TABLE, lootRoll,
LOOT_CHANCE, PLATE_CHANCE, bodyFell, endPayload, the two localStorage
writes), slices/BOHEMIA_CITY_WORLD.html (the medical kit's `durable:true`
tweezers), laws/BOHEMIA_LAW_A_BOSS_HANDS_YOU_A_VERB_8_27_26.md,
records/BOHEMIA_THE_BOSS_LADDER_v7_8_7_26.md (THE SMITH),
laws/BOHEMIA_ADDENDUM_THE_PLAYTEST_DISPATCH_8_25_26.md (item 8, LOOT
EXISTS), and days 1-9 of this study.
