# BOHEMIA RESEARCH — WHY VALHEIM WORKED (8/3/26)

> "okay so im an intense fan of valheim and its progression open world system.
> please do big brain research on why valheim is so succesful please"
> — Paolo, 8/3/26

Five rounds. **And unlike the Machine Party study, this one is SOURCED** — the
ValheimPlus source tree is reachable from this environment, so the mechanical claims
below carry real `file:line` citations off code that patches the actual game classes.
Where a claim is press or community rather than code, it says so.

Valheim is already a named reference in the stack. This is not a proposal to import
anything; it is an explanation, and at the end, an honest account of how much of it we
already have.

---

## THE ANSWER IN ONE LINE

**VALHEIM'S PROGRESSION HAS NO CHARACTER SHEET. YOUR POWER LIVES IN YOUR BELLY, YOUR
GEAR, YOUR BASE AND YOUR MUSCLE MEMORY — NEVER IN A NUMBER ATTACHED TO YOU.**

Your maximum health **never permanently rises**. Not once, not ever, across the whole
game. Every other survival RPG makes you stronger by making a number on you bigger.
Valheim refuses, and everything good about it falls out of that refusal.

---

## THE COMMERCIAL FACTS (press, not code)

- **Iron Gate AB**, Skövde, Sweden. **FIVE PEOPLE.** Published by Coffee Stain.
- Steam Early Access **2 February 2021**, at **$19.99**, in a **~1 GB download**.
- **1 million copies in 8 days.** ~5 million in a month. **10 million in just over a
  year**, later 12M+. Sales velocity above PUBG's and above Minecraft's opening.
- No large marketing spend. A modest streamer campaign, then organic word of mouth —
  players compared it to the first time they played Minecraft.

**AND THE SENTENCE THAT MATTERS MOST TO US.** It began life as an MMO and they cut
that. Iron Gate's own words: *downscaling the game like this and narrowing the scope of
it is probably the best design decision I've ever made for Valheim.* **A five-person
team's biggest win was a scope cut.** Worth keeping in front of a one-human project with
eleven months of runway.

---

## THE SEVEN MECHANISMS, WITH THE CODE

### 1. ★ YOUR MAXIMUM HEALTH IS COMPUTED FROM WHAT IS IN YOUR STOMACH

`Player.Food` is an object with three values and a source item:

```
Player.Food.m_health   /* ValheimPlus/GameClasses/Player.cs:325 */
Player.Food.m_stamina  /* Player.cs:326 */
Player.Food.m_eitr     /* Player.cs:327 */
Player.Food.m_item     /* Player.cs:328 */
```

and `Player.GetTotalFoodValue` (`Player.cs:322`) sums them. **Max health is a derived
quantity, not a stored one.** You hold three foods at a time; eat badly and you are a
25-hp creature again no matter how many hours you have played.

The decay is the elegant part, and the mod proves the shape of it exactly. Disabling
food degradation is implemented by *swapping which field is read* — from the food's
**current, decaying** value to the item's **original** value:

```
field_Food_m_health        -> field_SharedData_m_food        /* Player.cs:349-357 */
field_SharedData_m_food    /* the ORIGINAL value, Player.cs:330 */
m_foodBurnTime             /* the duration, Player.cs:254 */
```

So **each meal carries its own countdown, and your ceiling falls with it.** That is why
Valheim always feels like it has stakes: your peak is rented, never owned.

### 2. ★ THE GATE IS A KEY, NOT A LEVEL

Progression is **boss-gated and biome-gated**. Each boss drops a trophy (which is the
summon item for it) and grants a **Forsaken Power** you swap depending on what is next.
Each biome's metal is what makes the *following* biome survivable, and each step leans
on a specific mechanic from the one before — Swamp to Mountains needs **frost
resistance**, Mountains to Plains needs **padded armour** against fire arrows.
(Community-documented, not code.)

**Nothing here is an XP threshold.** You are never told "you are not level 20." You are
stopped because you do not have the coat. Which means a good player can push early, a
new player is never blocked by an invisible number, and every gate teaches the specific
thing it is gating.

### 3. ★ THE 23 SKILLS ARE ALL VERBS

The full skill enumeration (`ValheimPlus/GameClasses/Skills.cs:20-45`): Swords, Knives,
Clubs, Polearms, Spears, Blocking, Axes, Bows, ElementalMagic, BloodMagic, Unarmed,
Pickaxes, WoodCutting, Crossbows, **Jump, Sneak, Run, Swim, Fishing, Cooking, Farming,
Crafting, Ride**.

**There is no Strength, no Dexterity, no Intelligence.** Every entry is a thing you
physically do, and it rises by doing it — `skill.m_accumulator` against
`skill.GetNextLevelRequirement()` (`Skills.cs:61`). You do not choose to get better at
running. You got better at running because you ran.

### 4. ★ ONE RADIUS DOES TWO JOBS: THE WORKBENCH IS THE NO-SPAWN AREA

The workbench's **build range is the same circle as its enemy-exclusion area**, and the
source comment says so outright:

```
Helper.ResizeChildEffectArea(__instance, EffectArea.Type.PlayerBase, ...)
// "Various other systems query this collision instead of the PrivateArea radius
//  for permissions (notably, enemy spawning)."
                              /* ValheimPlus/GameClasses/CraftingStation.cs:26-28 */
m_rangeBuild                  /* CraftingStation.cs:21 */
```

**Placing a workbench is simultaneously an act of construction and an act of claiming
ground.** One object, one circle, two meanings, zero extra systems. And it costs you
something real: `m_craftRequireRoof` (`CraftingStation.cs:48`) means a station only works
**under a roof** — so crafting forces you to build a building, not drop a box.

**THIS IS EXACTLY HIS R1 RULING, CONFIRMED IN REAL CODE.** Bohemia's camp is already
"a no-spawn radius the way a Valheim workbench is"
(`records/BOHEMIA_RULINGS_FROM_THE_QUESTION_ROUND_8_3_26.md` R1). He was right about
what the mechanism is, and the reference goes one better by making that circle the same
one you build inside.

### 5. ★ DIFFICULTY IS LOCAL AND PHYSICAL, NOT A LOBBY SETTING

```
Game.GetDifficultyDamageScalePlayer   /* ValheimPlus/GameClasses/Game.cs:32 */
Game.m_damageScalePerPlayer           /* Game.cs:40 */
Game.GetDifficultyDamageScaleEnemy    /* Game.cs:51 */
Game.m_healthScalePerPlayer           /* Game.cs:59 */
Game.GetPlayerDifficulty              /* Game.cs:82 */
Game.m_difficultyScaleRange           /* Game.cs:85 — "the range used to
                                         check the number of players around" */
```

Enemy damage and health scale with **how many players are physically near you, inside a
radius**. Difficulty is a property of the patch of ground you are standing on. Nobody
picks Normal or Hard.

### 6. ★ STAMINA PRICES VERBS — AND ENCUMBRANCE IS JUST ONE OF THEM

Every stamina cost is a named per-action field (`Player.cs:27-35`):

```
m_dodgeStaminaUsage · m_encumberedStaminaDrain · m_sneakStaminaDrain
m_runStaminaDrain   · m_jumpStaminaUsage      · m_staminaRegen
m_staminaRegenDelay · m_swimStaminaDrainMinSkill / MaxSkill
```

Two findings in that list.

**`m_encumberedStaminaDrain` IS HIS R10 RULING IN THEIR CODE.** Being overloaded is not
a wall and not a refusal — it is a **line item on the same meter as running and
jumping**. He ruled encumbrance "a slow down" on his own instinct; Valheim spends it out
of the identical pool as every other verb.

**AND SKILL INTERPOLATES A COST BETWEEN TWO BOUNDS.** `m_swimStaminaDrainMinSkill` and
`...MaxSkill` mean the price of swimming is a lerp on your Swim skill. Getting better
does not unlock anything — **it makes the same action cheaper.** Which is precisely the
shape of our own approved action clock: condition as the divisor, never a second cost
(`laws/BOHEMIA_ADDENDUM_THE_ACTION_COST_SHAPE_7_31_26.md` clause 3).

### 7. THRESHOLDS, NOT SLOPES — AND OUR CLAUSE 5 IS THEIR FALL DAMAGE

```
float linearFallDamage = ((fallDistance - 4f) / 16f) * 100f;
                              /* ValheimPlus/GameClasses/Character.cs:153 */
```

**Free under four metres**, then linear. A real line is crossed and the penalty begins;
below it there is nothing to manage. Same principle as clause 5 of our action cost
shape, arrived at independently, and it is why Valheim never feels like admin.

### AND THE DEATH PENALTY IS A SKILL HAIRCUT, NOT A WIPE

`Skills.LowerAllSkills` (`Skills.cs:72`) with a `deathPenaltyMultiplier`
(`Skills.cs:84`). You drop your gear where you fell and can go and get it; what you
actually lose is a slice off every skill. **Death costs you sharpness, never
progress** — nothing you built, unlocked or learned is taken away.

---

## WHY THAT COMBINATION SUCCEEDED

Put the seven together and the reason is one thing: **every source of power in Valheim is
a THING IN THE WORLD, so getting stronger is always an activity and never a menu.**

- Stronger means **a better meal** — so you farm, cook, and explore for ingredients.
- Stronger means **better metal** — so you go somewhere new and dangerous.
- Stronger means **a better base** — so you build, and your base claims territory.
- Stronger means **you personally got better at the verb** — so you play.

None of those can be granted by a level-up screen, which is why the game has no level-up
screen. And because your ceiling **decays**, there is no state where you are done and
safe. That is the engine underneath ten million copies from five people: not content
volume, but a progression loop where every step is a place you went or a thing you made.

The scope cut is the other half. They removed the MMO and shipped a small, dense,
1 GB game at $19.99 with no marketing, and it outsold everything.

---

## HOW MUCH OF THIS BOHEMIA ALREADY HAS (more than I expected)

I went looking for what to learn and mostly found agreement. **Four of the seven are
already canon**, three of them from his own instinct before this research existed:

| Valheim mechanism | Bohemia already |
|---|---|
| Workbench radius = no-spawn area | **R1**, the camp is a no-spawn radius "the way a Valheim workbench is" |
| Encumbrance is a line item, not a wall | **R10**, "I'm pretty sure it will be a slow down" |
| Skill/condition scales the COST of an action | **ACTION COST SHAPE clause 3**, condition as the divisor |
| Free under a line, then it bites | **ACTION COST SHAPE clause 5**, thresholds not slopes |
| No abstract stat sheet | **R25** no inherited perks, **R17** the ledger is silent, no morality bar, three currencies as plain counters |
| The gate is a key, not a level | **R9**, fast travel unlocks by having WALKED there |
| Danger is a property of the ground | **CLUSTERED POWER + LIGHT = TERRITORY** — the lit 12% is owned, nobody patrols the dark |

That last row is the one worth sitting with. Valheim's best trick is that you can *look
at the world* and read how dangerous it is, because danger is attached to places.
**Bohemia already has that, and ours is arguably stronger**, because light is territory
and territory has an owner — a person, not a biome.

## WHAT DOES NOT TRANSFER

- **The food-as-max-health model.** It is beautiful and it is not ours to adopt: it is a
  damage-and-health system, and **NO DAMAGE BEFORE THE DIAL.** Recorded as understood,
  not proposed.
- **Sailing, and the open sea as connective tissue.** Our world is a valley you walk. The
  ocean is the reason Valheim's 314 km² is not comparable to ours
  (`records/BOHEMIA_MAP_SIZE_VS_THE_REFERENCES_8_3_26.md`).
- **Player-count difficulty scaling.** Bohemia is single-player.
- **Losing skill on death.** We are a DYNASTY, not a one-life run (settled question 1),
  and generational carry is already ruled — R24 gear at the family house, R25 a boosted
  start.
- **First-person and 3D anything.** 45 DEGREE ART LAW stands.

## FLAGGED, NOT ASKED — AND DELIBERATELY NOT DECIDED

- **What the equivalent of "I cannot survive over there yet" is, moment to moment.** In
  Valheim it is frost and fire arrows. In Bohemia the acts are the tiers and light is
  the territory, but the specific *readable* stop sign is not written down anywhere I
  can find. **[PENDING Paolo]** — and it is a content question, not a mechanism one, so
  it stays flagged rather than answered by a lane.
- **Whether skill exists at all as a concept for the player**, versus condition only.
  Ours is "condition is the divisor"; theirs is condition AND 23 verbs. Not mine.
- Every number in all of it.

## HONEST LIMITS

- **The code citations are to ValheimPlus, a MOD, not to Iron Gate's source** — which is
  closed. ValheimPlus patches the real game classes, so the field names, method names and
  their relationships are genuine; but a line number is a line in the *mod*, and the
  formulas it inserts (fall damage at `Character.cs:153`) are the mod's reimplementation
  of the vanilla curve, not necessarily vanilla byte-for-byte. **Treat the STRUCTURE as
  sourced and any specific constant as indicative.**
- Mechanism 2 (boss and biome gating) is **community-documented, not code** — I did not
  read a progression table in source.
- The commercial figures are press. 10M is the officially announced number; 12M+ is a
  later third-party report.
- Steam, the wikis and every review site 403'd through this environment's proxy;
  `raw.githubusercontent.com` did not, which is the only reason this study has real
  citations at all.

## SOURCES

- **Code:** `Grantapher/ValheimPlus`, master — `ValheimPlus/GameClasses/Player.cs`,
  `Skills.cs`, `CraftingStation.cs`, `Character.cs`, `Game.cs`. Fetched and read this
  turn.
- **Press/community (search-index summaries):** Iron Gate/Coffee Stain sales
  announcements via Game Developer, PC Gamer, 80.lv and PC Games Insider; the Iron Gate
  scope-cut interview via PCGamesN; Engadget's five-week interview; VGTimes' five-person
  interview; How To Market A Game's launch breakdown; the Valheim wiki and community
  progression guides; community food-system guides.
