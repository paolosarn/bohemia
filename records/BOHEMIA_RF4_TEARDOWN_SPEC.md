# BOHEMIA — THE RF4 TEARDOWN SPEC

**THE SEAM FILE.** Mandated by `laws/BOHEMIA_ADDENDUM_RECREATE_RF4_FIRST_8_16_26.md` §4:

> **LAB OWNS THE TEARDOWN.** It studies RF4 and produces THE SPEC: a numbered, mechanical inventory of
> RF4's systems ... plus a DIFF against what Bohemia already has. **LAB WRITES NO COMBAT CODE.**
> **COMBAT OWNS THE IMPLEMENTATION** ... citing spec item numbers in its commits.
> **THE SEAM IS A FILE**, not a conversation. Numbered items, each with a status
> (SPECED / BUILT / DIFFERS-ON-PURPOSE). **Neither lane edits the other's column.**

Paolo 8/17: *"For combat, I completely just want to. I really need you to re-create rogue fable four
holy shit please."*

**NOT IN A TAB.** This is a records file. The fight itself is the **COMBAT** tab.

---

## HOW TO USE THIS FILE — THE COLUMN RULE

| COLUMN | OWNER | RULE |
|---|---|---|
| `#`, `RF4 MECHANIC`, `SOURCE` | **LAB** | What RF4 does and where that is documented. COMBAT does not edit this and does not go read RF4 itself — if a mechanic is missing, **ask LAB for a spec item.** |
| `BOHEMIA TODAY` | **LAB** | Measured off the real alpha by `node tools/bohemia_rf4_teardown_measure.js`. Re-derived every gate run, never hand-typed. |
| `STATUS` | **COMBAT** | SPECED (written, not built) / BUILT (in the fight) / DIFFERS-ON-PURPOSE (we deliberately do it another way — say why). **LAB does not move a status to BUILT.** |

**Confidence marking.** Items marked **[PRIMARY]** come from the designer's own published words. Items
marked **[SECONDHAND]** were assembled from search summaries because the primary devlogs
(`justin-wang123.itch.io`, `store.steampowered.com`, `sites.google.com`) are **all blocked by this
environment's egress proxy** — I could not open them. A [SECONDHAND] item is a lead, not a fact, and
**COMBAT should not implement a number off one.** Say so rather than pretend the research was clean.

**MEASURED 8/17 on `slices/BOHEMIA_ALPHA_0_9.html` @ `a81c088`:** 40 arenas, 320 bodies, 0 page errors.

---

## A. THE FRAME — WHAT RF4 IS TRYING TO BE

| # | RF4 MECHANIC | BOHEMIA TODAY (measured/known) | STATUS |
|---|---|---|---|
| **RF4-01** | **Density, not length.** Traditional-roguelike depth compressed into runs completable in **under an hour**, approachable to genre newcomers. **[PRIMARY]** | Bohemia is a roguelite city-builder RPG, not a sub-hour dungeon run. The *fight* can borrow density; the *run length* cannot. | DIFFERS-ON-PURPOSE |
| **RF4-02** | **No stat or formula bloat.** Critical info presented **in the world and on the field of battle**, never buried in menus and sheets. **[PRIMARY]** | BUILT. Field readouts exist and are computed for the battlefield: `coverWord`, `coverLine`, `rangeTier`, `threatRank`, `pkgName`. | BUILT |
| **RF4-03** | **Combat is mobility, positioning, timing and target selection** — not stat-checks, not a DPS race. **[PRIMARY]** | Largely BUILT. `pickTarget`, `nearestFoe`, `threatWeight`, `exposedToMe` for selection; the 120 BPM dial for timing; cover model for position. | BUILT |
| **RF4-04** | **Unification is the living design principle.** Update 1.36 collapsed many one-off damage-boost effects into ONE stat, and did the same to Protection/Block — *"streamlining while maintaining or even increasing depth."* **[PRIMARY]** | Not a system, a discipline. One smell measured: `armor` is carried on **every one of 320 bodies and is 0 on all of them** — a stat that exists and never does anything is the bloat this principle deletes. | SPECED |

---

## B. THE TRINITY — RF4's CORE RESOURCE MODEL

RF4's defining structure. Three stats, and the point is that **each one is a minigame you play**, not
a passive modifier: *"each of the trinity stats is its own little mini game that can be optimized and
planned around, requiring you to actually do something to take advantage of them."* **[SECONDHAND]**

| # | RF4 MECHANIC | BOHEMIA TODAY (measured) | STATUS |
|---|---|---|---|
| **RF4-05** | **PROTECTION POINTS (PP) — a rechargeable shield with a hard BLOCK rule.** A single attack can **never** break through PP into HP: as long as you have **even 1 PP** you shrug off the largest blow. You deliberately tank a huge hit, then avoid damage for a few turns to rebuild. This merged 4-5 separate defensive stats. **[SECONDHAND, and the most important item in this file]** | **NOTHING LIKE IT.** No PP, no block-on-last-point, no rebuild-by-not-being-hit. `armor` is present and 0 on all 320 bodies. | SPECED |
| **RF4-06** | **ENEMIES USE THE EXACT SAME PP SYSTEM.** Armored enemies are not a special case. **[SECONDHAND]** | Not applicable yet (RF4-05 absent). Note the shape: **one system, both sides** — that is RF4-04 in action. | SPECED |
| **RF4-07** | **POWER — one unified offensive stat**, replacing a pile of one-off damage boosts. Wang's *"single go-freaking-nuts effect."* **[PRIMARY]** | **ABSENT.** No `power`/`pow` in combat state. | SPECED |
| **RF4-08** | **SPEED POINTS — mobility as a spendable resource.** *"As a character's mobility increases the number of available actions increases... increased mobility doesn't inherently make the player stronger but rather opens up more tactical possibilities."* Abilities cost Speed Points. **[SECONDHAND]** | PARTIAL. `stam`, `dashArm`, `sprintArm` exist in combat state — movement is resourced, but not as a trinity stat that buys extra actions. | BUILT |
| **RF4-09** | **PP/Power/Speed are tuned at fine granularity on purpose.** 1.36's stated win: *"drastically easier to tune... previously 0BP => 1BP => 2BP were enormous jumps."* **[SECONDHAND]** | N/A. **NO DAMAGE BEFORE THE DIAL** — LAB sets no combat numbers here, and this item exists to warn that whoever does should avoid coarse integer tiers. | SPECED |

---

## C. THE ABILITY ECONOMY

| # | RF4 MECHANIC | BOHEMIA TODAY (measured) | STATUS |
|---|---|---|---|
| **RF4-10** | **Item-abilities with MIXED resource types.** Some are plain cooldowns; others **charge up** when the player attacks, gets hit, casts, or spends Speed Points. **[SECONDHAND]** | **No ability system.** `useAbility` / `castAbility` / `spendCharge` / `chargeUp` all absent. | SPECED |
| **RF4-11** | **Random weapon procs were CONVERTED into charge-up abilities** — taking something uncontrollable and handing it to the player as a tactical choice. **[SECONDHAND]** | N/A. Worth flagging as the single most transferable idea here: it converts luck into agency, which is also RF4-14 (determinism). | SPECED |
| **RF4-12** | **Resources tuned so you cannot dump everything, win, and rest to refill.** **[PRIMARY]** | **DIFFERS-ON-PURPOSE, already decided.** The 6/30 DNA doc §4 rules the opposite and better: *"the game never punishes taking your time."* Tension comes from execution and position, not a depleting bar. Do not import the resource tax. | DIFFERS-ON-PURPOSE |
| **RF4-13** | **The fight already has verbs, and the gap is narrower than it sounds.** (Not an RF4 item — a correction to stop RF4-10 being overstated.) | BUILT: `grenade`, `dashArm`, `sprintArm`, `suppCd` (a real cooldown), `hold`, `defend`, `stam`. | BUILT |

---

## D. GEOMETRY, AND WHY HE ASKED FOR INDOOR

| # | RF4 MECHANIC | BOHEMIA TODAY (measured) | STATUS |
|---|---|---|---|
| **RF4-14** | **Determinism where it counts.** Wang removed random damage mitigation so outcomes are predictable; randomness lives in layout and drops, not in whether your plan works. **[PRIMARY]** | BUILT. `bohemiaDice`, deterministic patterns, and **armor 0 on all 320 bodies** means there is no random mitigation to begin with. | BUILT |
| **RF4-15** | **★ WALLS ARE MECHANICS, NOT SCENERY.** Infusion-of-Storms grants +1 Power *"when ending turn WIDE OPEN, meaning NOT ADJACENT TO ANY WALLS."* Abilities **read the room.** **[PRIMARY]** | **ABSENT as a rule.** Cover and LOS are read, but no ability or effect keys off *wide-open-ness* or wall adjacency. This is the item that justifies his indoor instinct. | SPECED |
| **RF4-16** | **Environment as a constant combatant** — terrain, clouds, auras, cover, chokepoints, open spaces, and emergent interactions between them. **[PRIMARY]** | **BUILT, and strongly — the most RF4-faithful part of the system.** Cover carries HP and **chews away under fire** (`chewCover`, `coverHP`), cars **cook off** (`cookOff`), decks and stairs (`onDeck`, `stairNear`, `underDeck`), darkness (`isDark`). | BUILT |
| **RF4-17** | **Line of sight and line of fire decide the battlefield.** | **BUILT.** `myCoverAgainst`, `myConcealAgainst`, `dirIndex`, `hasLine`, `peeking`, `firing`. Locked in the 6/27 combat addendum as the RF4 line-of-fire model. | BUILT |
| **RF4-18** | **Range matters to whether you can engage at all.** | BUILT as of 8/16 by COMBAT: `wpnRange`, `myRange`, `foeRange`, `maxRange`, `rangeMult`, `distAccuracy`. | BUILT |
| **RF4-19** | **Movement is the identity.** You run *from* some enemies while running *toward* others. **[PRIMARY]** | **BUILT 8/16, and he picked the mechanism himself** off RF4's stairs: every fight has a way out and reaching it is the win. Measured never-moves **0/16**, walks-to-it **16/16**. `placeWayOut`, `exitCheck`. | BUILT |

---

## E. ENEMY AND ENCOUNTER DESIGN

| # | RF4 MECHANIC | BOHEMIA TODAY (measured) | STATUS |
|---|---|---|---|
| **RF4-20** | **★★ SMALL FIGHTS. 3-6 enemies, never swarms.** Fights *"become messy when there are more than about 5-6"*; bigger groups *"devolve into messy kiting and choke-point abuse"*; he wants *"even 3-4 enemies to be a real challenge and a wandering extra to be a serious problem."* **[PRIMARY]** | **MEASURED: 8.0 per fight. min 8, max 8, across 40 arenas. INSIDE RF4's 3-6 BAND: 0 OF 40.** The single largest measured divergence in this file. See the note below — **eight is not a ruling.** | SPECED |
| **RF4-21** | **Deep, complex individual enemies** rather than HP stacks, **designed to synergize so each group is a unique puzzle.** **[PRIMARY]** | **HALF BUILT, and better than expected.** 5 types (GOON 139 / SEC-BOT 71 / SNIPER 40 / SHIV 35 / BAT 35), **8 HP tiers 45-200**, 70 of 320 melee, **40 elite**, 2 reach values, 2 cadences. What is missing is *synergy* — roles that combine. The 6/30 doc's own open question already says enemy synergy is *"not yet specced."* | SPECED |
| **RF4-22** | **No fights won before they begin.** You should not delete an unaware group with one opener. Fights run *a bit longer* so advanced tactics can play out, while staying snappy. **[PRIMARY]** | **NOT MEASURED.** The 6/30 doc says Bohemia deliberately inverts this (a perfect chain clears in one turn as a master-player reward). Whether the *median* fight collapses into an instant wipe is a real risk the doc itself names and **I did not measure it.** Flagged, not guessed. | SPECED |

### ★ ON RF4-20, BEFORE ANYBODY IS BLAMED FOR IT: EIGHT IS NOT A RULING

I checked before writing it down, because **A GATE MUST NEVER OUTRANK A RULING** and if Paolo had
ruled "eight" then RF4 does not get a vote.

- `BOHEMIA_ADDENDUM_COMBAT_6_27_26.md` uses eight as the **STRESS CASE**, not the norm:
  *"[LOCKED] Perfect play = zero damage at any enemy count. **One enemy or eight.**"* plus the test
  case *"8 enemies, BOHEMIAN -> EASY."* Eight is **the ceiling the engine must survive.**
- The 6/30 RF4 DNA doc **already adopted the small-fight target as ours**: *"That's RF4's '3-4 enemies
  should be hard, a wandering extra is a serious problem' **as an explicit design axis**."*

**So the ceiling shipped as the constant.** Nothing says a fight *is* eight men; a law says the engine
must not break when it is. The design axis that was supposed to make encounter size **vary** was never
wired, so `G.numEnemies` sits at 8 and every fight is the same size.

**WHY THAT PLAUSIBLY IS WHAT HE IS FEELING WHEN HE ASKS FOR RF4.** The roster is deep and the
encounter is flat. At a permanent 8, every fight is the same arithmetic, and five differentiated enemy
types get averaged out inside a crowd big enough that no single one of them is ever *the puzzle*.
**THE DEPTH IS BUILT AND IT NEVER SURFACES.**

**WHAT COMBAT DECIDES HERE, AND LAB MUST NOT:** the encounter-size **curve**. Does a 3-man fight
exist? Does a wandering extra arrive mid-fight and become a crisis, the way Wang describes? Does size
scale by act, district or threat? `G.numEnemies` is the knob; the curve is design.

---

## F. STRUCTURE, BUILDS, AND WHAT RF4 OMITS

| # | RF4 MECHANIC | BOHEMIA TODAY | STATUS |
|---|---|---|---|
| **RF4-23** | **Scope: a procedural dungeon of 13 zones, 250+ monsters, 30+ bosses**, ending on a climactic named boss. **[PRIMARY, from the 8/16 law]** | Bohemia has a 65-mile valley, a 53-node acquisition ladder and 5 combat enemy types. The *zone* structure maps onto districts and interiors, not a vertical dungeon. | DIFFERS-ON-PURPOSE |
| **RF4-24** | **Deep, open-ended character development tuned for WIDE BUILD VARIETY.** Runs differ because builds differ; 7+ classes, cross-classing, *"every build viable."* **[PRIMARY]** | **[PENDING PAOLO], and the 6/30 doc already asked it:** does Bohemia want RF4-level build diversity, or is the dial the primary variety axis with builds a lighter layer? That answer sizes the whole perk tree. Not LAB's to decide. | SPECED |
| **RF4-25** | **Skill over stats.** Runs won with zero in six stats, no items, no levels, no hits taken. **[PRIMARY]** | **BUILT, and locked harder than RF4:** *"perfect play = zero damage at any enemy count"* is already [LOCKED], and armor 0 on all 320 bodies means there is no stat wall to hide behind. | BUILT |
| **RF4-26** | **Juice — a whole dev phase making every action POP**, on the belief that feel is inseparable from play. **[PRIMARY]** | BUILT. Per-action fx and sfx, killshot cameras, the groove chain. | BUILT |
| **RF4-27** | **WHAT RF4 DELIBERATELY OMITS** — and this is a spec item because omissions are design: no random damage mitigation (RF4-14), no rest-to-refill loop (RF4-12), no swarm encounters (RF4-20), no stat sheets or formula screens (RF4-02), no info hidden in menus. | Bohemia matches on mitigation and menus. It **deliberately breaks** with RF4 on the resource tax (RF4-12) and does not yet match on swarms (RF4-20). | BUILT |
| **RF4-28** | **THE EXPRESSION LINE.** Per the 8/16 law §5: systems are free to recreate, **expression is not.** Never copy a name, string, icon, screen or the title. Every RF4 name is being reskinned to post-crash Vegas regardless. | Nothing in this file copies an RF4 name into Bohemia. `Infusion-of-Storms` appears once, as a **citation of RF4's own ability** to document the wall-adjacency rule (RF4-15), never as a Bohemia name. | BUILT |

---

## G. WHAT LAB OWES NEXT, AND WHAT IT DID NOT DO

**LAB WROTE NO COMBAT CODE.** No engine file, no slice, no combat constant. The 8/15 addendum says
*"COMBAT owns this"* in those words and ONE SYSTEM ONE SESSION is law. `G.numEnemies` was measured,
never touched.

**THE THREE ITEMS WHOSE PRIMARY SOURCE I COULD NOT OPEN** are RF4-05, RF4-08 and RF4-10 — the
trinity and the ability economy, which are the heart of the recreation. Every relevant domain
(`justin-wang123.itch.io`, `store.steampowered.com`, `sites.google.com`) is egress-blocked here.
They are marked **[SECONDHAND]** and **COMBAT must not implement numbers off them.** Getting a primary
read on those three is the top of LAB's own queue; if Paolo can open the devlogs on his phone, one
screenshot of the combat design page closes the biggest hole in this spec.

**WHAT IS DEMO-RELEVANT, per the 8/16 law §6:** the missing combat-entry wire on the walked surface
(demo board row 1) is the same job as indoor combat — walk in a door, fight in the room. That is
COMBAT's, and RF4-15 (walls are mechanics) is the spec item that makes indoor worth the trouble
rather than just a smaller map.

---

## SOURCES

- `laws/BOHEMIA_ADDENDUM_RECREATE_RF4_FIRST_8_16_26.md` (8/16, LOCKED) — this file's mandate, the lane
  seam, the expression line, and the RF4-01/02/03/04/15/23/24 material.
- `laws/BOHEMIA_ADDENDUM_COMBAT_DNA_RF4_6_30_26.md` (6/30) — the nine pillars and the phase-two spec.
  Nothing here repeals it.
- `laws/BOHEMIA_ADDENDUM_COMBAT_6_27_26.md` — the RF4 line-of-fire cover model, and the eight-enemy
  stress case that proves eight was never a ruling.
- `laws/BOHEMIA_ADDENDUM_THE_FIGHT_HAS_TO_MOVE_YOU_8_15_26.md` (8/15) — RF4-19, and *"COMBAT owns this."*
- Rogue Fable IV, Justin Wang: the Project Focus material and the Update 1.36 "Major Mechanics
  Overhaul" notes. **Reached through search summaries only — the primary pages are egress-blocked from
  this environment**, which is why the trinity items carry [SECONDHAND].
- Every `BOHEMIA TODAY` measurement is regenerated by `node tools/bohemia_rf4_teardown_measure.js`
  and re-checked by `gates/rf4_teardown_gate.js`.
