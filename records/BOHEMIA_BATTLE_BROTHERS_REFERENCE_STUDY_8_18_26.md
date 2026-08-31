# BOHEMIA — THE BATTLE BROTHERS REFERENCE STUDY

**LAB lane, 8/18/26.** Paolo: *"fucking look up battle brothers right now right now."*

One session = one system = one named game (`laws/BOHEMIA_ADDENDUM_THE_REFERENCE_LAB_7_26_26.md`).
The named game is **Battle Brothers** (Overhype Studios, 2017). **LAB WRITES NO COMBAT CODE.**

**NOT IN A TAB.** This is a records file. The fight is the **COMBAT** tab; the company/economy ideas
land in **CITY** and **LIFE**.

**SOURCING NOTE, stated because it limits confidence:** `battlebrothersgame.com` (the developers' own
dev blog), `battlebrothers.fandom.com` and `steamcommunity.com` are **all blocked by this environment's
egress proxy as organization policy.** The proxy README says report policy denials rather than route
around them, so I did not. Everything below came through the search channel and is quoted rather than
paraphrased. **Paolo owns this game too — if he has it, one session of him playing beats every line
below.**

---

## 0. THE HEADLINE, AND IT IS NOT ABOUT COMBAT

**BATTLE BROTHERS IS THE GAME BOHEMIA'S STRUCTURE ACTUALLY IS. ROGUE FABLE IV IS NOT.**

RF4 is a **one-hour run with a fresh character**, which is why the very first line of CLAUDE.md has to
shout *THERE ARE NO RUNS* every session to stop that premise leaking in. Battle Brothers has **no runs
at all**: one continuous campaign, one company you keep forever, people who die stay dead, a daily wage
that comes due whether or not you fought, and a strategic map over the top of the tactical battles.

Line them up against his own locked laws and it is the same skeleton:

| BOHEMIA (locked) | BATTLE BROTHERS |
|---|---|
| THERE ARE NO RUNS. A full game, ~100 hours. | One continuous campaign. No run structure at all. |
| A dynasty: three generations, **the player lives all three**, inheriting everything | A company that outlives its individual men; the roster is the continuity, not any one body |
| A handoff **inherits everything** — compound, standings, territory, family tree, **and the unhealed wounds** | Injuries persist between battles, take days, can get **infected**, and some are **permanent** |
| The most realistic economic crash simulator, but fun | A **daily wage and food bill** that arrives whether you win, lose or sit still |
| 60 mini bosses each handing you a new way to interact | (no equivalent — this is ours) |
| Act 3: the gen-3 Angel heir goes one-way | **NO ENDGAME GOAL — its single most-cited flaw. See §7.** |

**So the right way to read this study is not "another combat reference."** RF4 is the reference for
**what a fight is**. Battle Brothers is the reference for **what a campaign is** — and that is the
half of Bohemia that has no named reference at all.

---

## 1. ★★ THE TWO-LAYER ARMOUR — AND IT IS RF4's PROTECTION POINTS ARRIVING FROM A SECOND DIRECTION

> *"The combat system takes into account armor at two hit zones, body and head. When the according
> body part is hit, **armor points are reduced instead of hitpoints**, for as long as there is any
> armor left. Once the armor points reach 0, **the armor is destroyed and useless until the end of the
> battle.**"*

**THIS IS THE FINDING THAT MATTERS MOST TODAY.** Yesterday's RF4 teardown spec'd Protection Points as
*"a separate HP bar which sits atop your regular HP bar"* and noted `armor` is carried on **all 320
bodies in our fight and is 0 on every one of them** — a stat that exists and does nothing.

**Two acclaimed tactics games, built by different studios for different audiences, independently
arrived at the same answer: a destructible layer above HP.** That is no longer one game's idea worth
considering. That is convergent design, and it lands on the exact field we already carry and never use.

**WHERE THEY DIFFER, AND BOHEMIA SHOULD TAKE THE RF4 SIDE:** RF4's version is **absolute** — while one
point stands, *no* single blow reaches HP. Battle Brothers' version **leaks**: *"at least 10% of damage
will penetrate armor"* and *"maximum after-armor damage is always 50%."* RF4's rule is the one that
makes a plan trustworthy, and trustworthiness is what `perfect play = zero damage` requires.

**AND THE SECOND HIT ZONE IS FREE DEPTH:** head and body armour degrade **separately**, so aiming at
the weaker zone is a decision every single turn, with no new UI and no new numbers.

---

## 2. ★★ FATIGUE IS AN ACTION ECONOMY — THE SAME MECHANIC AS RF4's SPEED POINTS, INVERTED

> *"Fatigue is gained by performing any kind of action **or being hit** in combat and is reduced at a
> fixed rate each turn. The maximum fatigue depends on the stamina value and the type of armor worn
> (**heavy armor reduces the fatigue maximum**). Actions are designed so **any character can perform at
> least one slash a turn, no matter how fatigued they are.**"*

And it feeds the turn order directly:

> *"Initiative is calculated **each round** based on a character's action points, their accumulated
> fatigue and the type of armor worn. Characters that are slower, more fatigued or wearing heavier
> armor generally **act later in a round** than those that are quick, fresh and lightly armored."*

**PUT THE TWO REFERENCES SIDE BY SIDE AND THE SHAPE IS ONE SHAPE:**

| | RF4 SPEED POINTS | BB FATIGUE |
|---|---|---|
| direction | **spend to gain** free actions | **accrue** until you can do less |
| the clock | refills on a **global world clock** | sheds at a **fixed rate each turn** |
| what it costs you | nothing — upside only | **your place in the turn order** |
| armour's role | — | heavy armour **lowers your ceiling** |
| the floor | — | **you can always swing once** |

**THE TRANSFERABLE PART IS THE FLOOR.** *"Any character can perform at least one slash a turn, no
matter how fatigued they are."* That is a guarantee that the resource **never takes your turn away** —
it only takes your *options*. It is the same instinct as RF4's upside-only ruling and the same instinct
as our own *"the game never punishes taking your time."* **Bohemia already carries `stam`.** Two
independent references now say the same thing about how it should behave.

**AND THE ARMOUR TRADE IS THE GOOD KIND:** heavy armour gives you a bigger destructible layer (§1) and
costs you fatigue ceiling and turn order (§2). One decision, two systems, no stat sheet. That is RF4's
unification discipline showing up in a different game.

---

## 3. ★ MORALE — NOBODY IN OUR FIGHT HAS A MENTAL STATE

> *"Characters are subject to morale which fluctuates based on how the battle unfolds; factors that
> change a character's morale include: **slaying an enemy, seeing an enemy be slain by an ally, seeing
> an ally fall, seeing an ally flee, being wounded and being outnumbered.** At the start of each
> character's turn, if a character's current morale is lower than their base morale, a morale check is
> performed... If a morale check fails, that character is considered **wavering**."*

**THIS IS THE CHEAPEST "THE WORLD HAS TO FEEL MORE ALIVE" IN EITHER REFERENCE, and it lives inside the
fight.** Look at the trigger list: **every single one is something that already happens in our combat
and that we already detect.** We kill, they kill, bodies fall, we count enemies. Nothing new has to be
sensed — the events are all there, unread.

**IT ALSO ANSWERS RF4-25 FROM A DIFFERENT ANGLE.** The RF4 teardown's biggest gap is that **no enemy
reads any other enemy.** Morale is enemies reading each other **without any AI coordination at all** —
a body that watches its friend die and wavers is synergy, and it costs one number per person.

**AND IT IS THE MOST GROUNDED MECHANIC IN EITHER GAME.** People in a gunfight in a dead city break.
Realism-first says this wins on its own merits before anyone argues fun.

---

## 4. ★★★ THE COLLISION: BATTLE BROTHERS IS PURE DICE, AND OUR LAW FORBIDS THAT

> *"The basic formula for to-hit is: **toHit = skill − defense**. Hit chance for regular attacks
> **cannot be lower than 5% and cannot go higher than 95%.** You make a roll with a d100..."*
> *"**Battle Brothers is pure RNG**, and every roll is independent."*

**DO NOT TAKE THIS. IT BREAKS A LOCKED LAW.** Bohemia's combat addendum locks
*"perfect play = zero damage at any enemy count. One enemy or eight."* **A 5% floor on being hit means
perfect play cannot produce zero damage — ever.** The two are arithmetically incompatible.

**AND THE REFERENCE ITSELF SAYS THIS HURTS.** It is the loudest single complaint in the community
("hit chance calculations must be a scam"), and **RF4 went the other way on purpose** — it removed
random damage mitigation so that *"randomness lives in layout and drops, not in whether your plan
works."* RF4 also floors its damage at 50% of listed **specifically so the player can plan against the
worst case.**

**SO WE HAVE TWO REFERENCES AND THEY DISAGREE, AND THE DISAGREEMENT IS INSTRUCTIVE:** the newer, more
tightly-designed one removed the dice, and the older one is most criticised exactly where the dice
are. **TAKE BATTLE BROTHERS' STRUCTURE. REFUSE ITS DICE.**

---

## 5. DIFFICULTY WITHOUT STAT INFLATION — THE DEVELOPERS SAY IT OUT LOUD

> *"Rather than inflating enemy stats, developers use savegame restrictions (ironman), **resource
> limitations, more enemies in encounters or late game enemies appearing earlier in the game, slower
> healing times for wounded Brothers** and so forth."*

**THIRD INDEPENDENT SOURCE FOR THE SAME PRINCIPLE.** RF4 says *"movement asymmetry is a cleaner
difficulty lever than stat inflation."* Our own law says **NO DAMAGE BEFORE THE DIAL.** Battle Brothers
says it again from the campaign side: difficulty comes from **scarcity and pressure**, not bigger
numbers.

**NOTE THE ONE WE COULD USE TOMORROW WITHOUT TOUCHING COMBAT: *slower healing.*** Difficulty applied to
the **calendar** rather than the fight. That is a CITY/LIFE lever, and it costs no combat balance at all.

---

## 6. THE COMPANY ECONOMY — A CLOCK THAT RUNS WHETHER OR NOT YOU PLAY

- **A daily wage per man**, *"increased by 2 crowns per level up"*, and the **greedy** trait costs 2
  more immediately. Fail to pay and *"their mood will decrease and they may decide to desert."*
- **Food is a second, separate daily drain** — 2 units per man per day, modified by traits.
- Players report *"brothers cost about 450 per day, with savings quickly getting eaten up during dry
  spells."*
- **Contracts are priced by inherent difficulty** — a fixed value per contract type (return an item
  400, find an artifact 2,000) — and completing them **changes the world state**: escorting a caravan
  leaves a castle *"freshly supplied."*

**WHY THIS IS THE MOST BOHEMIA-RELEVANT SECTION IN THE WHOLE STUDY:** Bohemia is *"the most realistic
economic crash simulator, but fun."* Battle Brothers is the working proof that **a per-day, per-head
cost is enough to generate an entire campaign's worth of tension** — you take the bad contract because
payroll is Tuesday. **YOUR PEOPLE COST MONEY TO KEEP ALIVE** is a stronger economic engine than any
resource-node system, and it makes every hire a permanent liability rather than a free upgrade.

**AND IT COUPLES DIRECTLY TO §3 AND §8:** unpaid men waver and desert, injured men still eat, and a
long recovery is money leaving with no work coming back.

**LEVELLING RAISES THE WAGE.** A veteran is *better and more expensive*, so growth is not free — which
is the anti-snowball valve his perk tree will eventually need.

---

## 7. ★★ WHAT IT GETS WRONG — AND BOHEMIA ALREADY HAS THE ANSWER

**LAB's job is to pull holes, so here are the real ones, from its own players:**

1. **NO ENDGAME GOAL. This is the flaw players name first.** *"Battle Brothers has one major flaw — no
   goal, so while it's fun to develop your crew and gather loot, it really feels futile when you
   realize it is all for naught."*
   **BOHEMIA ALREADY HAS WHAT IT LACKS.** Three generations, ~100 years, and the Act 3 gen-3 Angel heir
   going **one-way**. That ending is the exact thing whose absence hollows out Battle Brothers' late
   game. **Worth saying plainly: the dynasty is not decoration, it is the fix for this game's biggest
   failure.**
2. **THE DIFFICULTY CURVE BREAKS AT BOTH ENDS.** *"Battles either become far too easy or insanely
   difficult... you either win without taking a scratch in an insultingly easy battle or all your mercs
   are killed by completely overpowered end game enemies."* A power-curve warning for our own perk tree.
3. **REPETITION.** *"Mid and late game involves usual grinding for cash until you are strong enough."*
   Our answer is already written: **60 mini bosses, each handing you A NEW VERB.** A new verb is the
   opposite of a grind, and this is the game that proves why that matters.
4. **WORLD-MAP INCONSISTENCY.** *"Heavily armed troupes of mercenaries materialize out of nowhere in
   opposition to every rule that the game has established about the worldmap."* Straight at our
   LIGHT=TERRITORY / nobody-patrols-the-dark laws: **if the map has rules, the spawner obeys them.**

---

## 8. INJURIES PERSIST, AND THAT IS THE DYNASTY MECHANIC IN MINIATURE

- Temporary injuries heal over **days** — *"light injuries will take a day whereas some more serious
  injuries can take up to 7 days"* — and can be sped up by **visiting a temple**, or by recruiting a
  **Surgeon** (unlocked only after treating 5 injuries, then 3,500 crowns).
- Wounds can get **worse while healing**: *"just as he is about to heal the wound gets infected,
  putting him out for another 2-4 days."*
- **Permanent injuries never heal** and change what a man can still do — players note a permanently
  injured brother *"can become a backliner."*
- The counter-play is roster depth: *"have a fairly wide bench to swap people who are injured."*

**CLAUDE.md ALREADY SAYS A GENERATIONAL HANDOFF INHERITS "THE UNHEALED WOUNDS."** This is the reference
implementation of that sentence. The sharp part is the third bullet: **a permanent injury does not
delete a person, it re-roles them.** A body that can no longer hold the front line still holds the
back. That is far better than losing them, and it is exactly how a family absorbs damage over a hundred
years.

---

## 9. ★ THE ART FINDING, AND IT LANDS ON HIS OWN LANE

> *"All characters are depicted in an **almost caricature style with large heads and prominent facial
> features**, in fact they are **borderline cute looking**."* — and it is deliberate, because
> *"the game of Battle Brothers is pretty grim, and bloodshed and injuries occur at every turn and the
> death of Battle Brothers is common."*

**A GRIM GAME EXAGGERATED ITS FACES ON PURPOSE, TO MAKE CONSTANT DEATH BEARABLE AND TO MAKE STRANGERS
LEGIBLE AT A GLANCE.** Bohemia is post-crash Vegas, the portrait pops up every time somebody speaks,
and our own 8/27 law already found that **identity at 64×64 is SIZE AND SPACING, NOT DETAIL** — which
is the same conclusion reached from the pixel side rather than the tone side.

**AND ROSTER ATTACHMENT IS ENGINEERED, NOT HOPED FOR:** *"a stuttering ratcatcher, a greedy witch
hunter or a drunkard disowned noble"*, plus *"differences in stats help building personalities — you
start thinking of a Brother with high hitpoints as 'the tough guy'"*, plus custom names and custom
armour. **A named body with one flaw and one number that sticks out is a character.** That is cheap,
and it is the thing that makes permadeath hurt instead of annoy. **WHO ANYBODY IS STAYS PAOLO'S** —
this is the mechanism, not the cast.

---

## 10. WHAT I AM NOT DECIDING

**LAB WROTE NO COMBAT CODE and nothing here is canon.** Everything below is a direction call and stays
his, per EVERYTHING IS A THUMB's carve-out for genuine forks:

- **[PENDING, Paolo's call]** Does the fight get a **morale/waver state** (§3)? It is the cheapest
  aliveness in either reference and every trigger already fires in our combat.
- **[PENDING, Paolo's call]** Does the company economy get a **daily per-head wage** (§6)? It is the
  strongest realistic-crash engine found in either game, and it makes every person a liability.
- **[PENDING, Paolo's call]** Do **permanent injuries re-role a person** rather than retire them (§8)?
- **NOT PENDING, ALREADY ANSWERED BY LAW:** the pure-dice to-hit model (§4) is refused —
  `perfect play = zero damage` is locked and a 5% hit floor contradicts it arithmetically.

**THE ONE THING I WOULD BUILD FIRST IF IT WERE MINE TO DECIDE, AND IT IS NOT:** the destructible
armour layer (§1), because **two independent references converged on it** and we are already carrying
the field with a zero in it on all 320 bodies.

---

## SOURCES

Reached through the search channel only — `battlebrothersgame.com`, `battlebrothers.fandom.com` and
`steamcommunity.com` are all blocked by this environment's egress proxy as organization policy.
Overhype Studios' own developer blog (the tactical-combat, character-stats, features and concept-art
entries), the Battle Brothers wiki (Combat Mechanics, Hit Chance, Damage, Attributes, Perks, Temporary
Injuries, Level and Experience), Metacritic user reviews, the RPG Codex review, and Steam community
discussions on wages, damage calculation and injury duration.

Cross-references inside this repo: `records/BOHEMIA_RF4_TEARDOWN_SPEC.md` (§1 vs RF4-05, §2 vs RF4-49,
§3 vs RF4-25, §4 vs RF4-17 and RF4-56, §5 vs RF4-51), `laws/BOHEMIA_ADDENDUM_COMBAT_6_27_26.md`
(the zero-damage lock), and CLAUDE.md's dynasty and no-runs clauses.
