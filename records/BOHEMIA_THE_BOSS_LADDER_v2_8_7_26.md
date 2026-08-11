# BOHEMIA — THE BOSS LADDER v2: 17 BOSSES, ONE LOCK EACH (8/7/26)

**THIS IS THE LIVE LADDER.** It supersedes the table in
`records/BOHEMIA_THE_BOSS_LADDER_CANDIDATES_8_3_26.md`, which stays as the history: v1's
thirteen byte-identical (he liked them), the 8/4 five, and the two dead reframings.

Built on his ten rulings, recorded verbatim in
`records/BOHEMIA_HIS_BOSS_RULINGS_8_7_26.md`. He commissioned this rebuild:

> "rethink of the bosses their holds and what you can then shit. do big brain online research
> if you need to then execute"

---

## THE DEFECT HE CAUGHT, AND WHY IT HAPPENED

> "THE STRIPPER / THE WRECKER / THE TOLL — these are the exact same bro"

He is right. Strip a building for materials, take a building down, clear a blocked road:
**three bosses, one verb.** REMOVE A STRUCTURE.

It happened because I was generating bosses from **nouns** — water, fuel, salvage,
demolition, passage — and asking "who would own this?" Owning a noun does not make a distinct
power. Three different nouns produced one verb and nobody noticed for four days.

## THE RULE THAT FIXES IT, AND THE MACHINE THAT HOLDS IT

**★ ONE BOSS = ONE LOCK = ONE THING THAT WAS IMPOSSIBLE AND NOW IS NOT.**
**NO TWO BOSSES MAY OPEN THE SAME LOCK.**

Every boss below declares its LOCK: the specific thing you cannot do before you kill them.
`gates/boss_ladder_gate.js` fails the build if two bosses declare the same lock, if a boss
declares none, or if a lock is a noun instead of an impossibility. **The collapse he found by
eye is now machine-checkable**, which is the only reason it will not happen a third time.

## THE RESEARCH, AND IT CORRECTED MY OWN FRAMING

I have been calling this "Valheim's boss progression" for four days. Having read what
Valheim's boss powers actually do, that is wrong in a way that matters.

**VALHEIM'S FORSAKEN POWERS ARE PASSIVE BUFFS, NOT KEYS.** Eikthyr: −60% stamina use for
running and jumping. The Elder: +60% chop and pickaxe damage, +30% health regen. Bonemass:
−25% physical damage taken, free blocking. Moder: permanent sailing tailwind, carry heavy
loads over mountains. Yagluth: lightning resistance and slightly more damage. Not one of them
makes a previously impossible thing possible.

**WHAT ACTUALLY GATES VALHEIM IS THE BIOME'S MATERIALS** — you need the next ore to make the
next tier. And he explicitly killed that framing on 8/3: *"giving like material vibes and not
like tool vibes … I think that's kind of stupid."*

**SO THIS LADDER IS NOT VALHEIM'S MECHANISM. IT IS METROID'S.** He loves Valheim's *ladder
shape* — a clear escalating line of named bosses. The *mechanism* he described, "you unlock a
new skill or a tool to alter the world around you," is lock-and-key ability gating: the boss
drops the key, and the key opens one class of door nothing else opens. That genre's whole
discipline is that **each ability must answer a different kind of obstacle**, which is exactly
the rule above and exactly what strip/wreck/toll violated.

Naming it correctly matters because it tells us what to copy: not Valheim's buffs, and not
Valheim's ore.

---

## ACT 1 — ANIMAL. The locks are on YOUR BODY. Four bosses.

| # | BOSS | HOLDS | THE LOCK (impossible before) | THE KEY (possible after) |
|---|---|---|---|---|
| 1 | **THE TAP** | a live water main | you cannot be far from water for long | draw water from any pipe in the valley |
| 2 | **THE BURN** | fuel, and who gets warm | night ends your day; cold sends you home | fire anywhere, so you get the night back |
| 3 | **THE CLIMB** | the last hoist that lifts | everything above the ground floor is scenery | get up: roofs, upper floors, towers |
| 4 | **THE STRIPPER** | what may be taken apart | a sealed building is a wall you cannot pass | take a structure apart, so nothing is sealed |

**★ 4 IS THE MERGE.** THE STRIPPER, THE WRECKER and THE TOLL were one boss wearing three
names. One boss now owns the verb, and the point is not the materials — **it is that a sealed
door, a welded shutter and a collapsed road all stop being edges of the map.** Materials fall
out of it as a by-product, which is what stops it being a "material vibes" boss.

**THE CLIMB moved to act 1 on his ruling** ("sounds like an act 1 shit"), and he was right for
a reason worth keeping: climbing is a thing YOUR BODY does, and act 1 is the body act.

**★ AND THE GATE CAUGHT ME DOING IT AGAIN ON THE FIRST RUN.** My rebuild added a sixth act-1
boss, THE MULE, whose lock was *"you can only take what your arms hold"* — which is THE
OPERATOR's lock, *"some mass is simply too heavy for hands"*, wearing a different name. Same
defect he had just finished pointing at, committed inside the fix for it, four minutes later.
`boss_ladder_gate.js` flagged it before it shipped, so THE MULE is cut: it was my own
unprompted addition and it duplicated. **THE GRID** was reworded in the same run for sharing
the verb "move" with THE OPERATOR. **18 → 17**, and the rule paid for itself immediately.

## ACT 2 — HUMAN. The locks are on the CITY. Eight bosses.

| # | BOSS | HOLDS | THE LOCK (impossible before) | THE KEY (possible after) |
|---|---|---|---|---|
| 5 | **THE SOIL** | the last living ground | your population is capped by food | make ground grow, so more people can live |
| 6 | **THE DRAIN** | where the waste goes | a filthy district's population cap is ZERO | clear the filth, so settlers accept a bed there |
| 7 | **THE LIGHTS** | a lit block | the dark belongs to whoever owns the light | switch on any street, so night is yours |
| 8 | **THE POUR** | the last working batch plant | everything you build is patched and temporary | pour a foundation, so a thing you build STAYS |
| 9 | **THE FOREMAN** | the working hands | nothing gets built unless you are standing there | a crew works while you are elsewhere |
| 10 | **THE OPERATOR** | the heavy machines | some mass is simply too heavy for hands | move what hands cannot |
| 11 | **THE FIXER** | where the one working part is | a broken irreplaceable part is permanent | repair instead of replace |
| 12 | **THE WARD** | the last working clinic | a wound you cannot treat is a death | pull somebody back who would have died |

**★ 7 ANSWERS HIS QUESTION DIRECTLY.** He asked: *"define habitable so if people have to shit
in a hole in the ground its not habitable."* Fair, and the old wording deserved it. So
habitable is now a **number a player can see**: every district carries a FILTH level, and
while it is high **its population cap is zero** — you can build whatever you like there and
nobody will stay, because sanitation is the actual mechanic and not a word. THE DRAIN's key is
the only thing that lowers it. **Habitable means a settler will accept a bed there.** That is
one concrete sentence, which the old version could not manage.

**THE SOIL OPENS ACT 2 on his ruling** ("this should be the beggining of act 2 pls"), and it
is the right door: act 2 is the act where the city grows, and food is what lets it.

**THE WARD's lock changed.** It used to be "treat wounds anywhere", which was really just
range again — the same lock as THE TAP. Its lock is now DEATH, which is distinct, and it earns
its place in a hardcore roguelite with three generations.

## ACT 3 — ANGEL. The locks are on the VALLEY. Five bosses.

| # | BOSS | HOLDS | THE LOCK (impossible before) | THE KEY (possible after) |
|---|---|---|---|---|
| 13 | **THE GRID** | the whole network | power is local; a district lives or dies alone | feed power to any district, so none lives or dies alone |
| 14 | **THE ENGINE** | the last vehicle that runs | the valley is too big to cross on foot | drive it, having earned the map by walking it |
| 15 | **THE VOICE** | the only relay still standing | nobody knows you exist; nobody comes | your phone calls people IN, and they settle |
| 16 | **THE BOOK** | who owes whom | some things one person cannot do at all | spend a debt: somebody ARRIVES and does it |
| 17 | **THE SCHOOL** | who gets taught | a skill dies with the person who had it | teach it, so it outlives them |

**★ 16 IS REBUILT ON HIS INSTRUCTION.** He said: *"make this revolve around the phone or
something like why would i want to broadcast to the valley. a settlement beacon like fallout
4?"* He was right that broadcasting does nothing for the player. So the direction reverses:
**it is not you talking, it is people arriving.** Fallout 4's recruitment beacon is a powered
object that runs a daily check and pulls in settlers, and crucially **it only works if the
place already has food, water and beds** — so the beacon is not a shortcut, it is a reward for
having actually built something. That gating is the part worth stealing, and it lands on the
phone he already carries. **He explicitly did NOT approve this** ("im not even saying i like
this flesh it out more"), so it is a candidate.

**★ 17 IS HIS INVENTION AND IT IS THE BEST THING ON THIS LADDER.** *"can this be like a final
fantasy summon. actually thats a fire idea. mark that down some where. maybe clout is the
mana?"* Recorded in full in `records/BOHEMIA_HIS_BOSS_RULINGS_8_7_26.md`. Calling in a debt is
a SUMMON: you spend something and a person arrives and does what you cannot. It makes a debt a
thing you HOLD AND SPEND instead of a number that colours a conversation, which is the same
move the reputation research already landed on. **Whether clout is the cost is his** — he said
"idk" and that is not a ruling.

**THE SCHOOL's lock changed** from "teach a skill" (vague) to **a skill dies with its owner** —
which is act 3's actual subject, because three generations is canon and this is the only boss
whose key crosses one.

---

## WHAT DIED, AND WHY

| BOSS | WHY |
|---|---|
| **THE WRECKER** | KILLED, folded into THE STRIPPER. Same verb: remove a structure. |
| **THE TOLL** | KILLED, folded into THE STRIPPER. Same verb. Its flavour was good, its power was a duplicate. |
| **THE CHANNEL** | KILLED by him: *"this is ass bro"*. Mine, added and dead inside one message. No v2 of the flood-wash boss. |
| **THE JUDGE** | KILLED. He said it *"sounds like it would be a spreadsheet simulator"* — and he is citing his own law back at me: clause 2 of the three-currencies addendum BANS the Civ-5 / Surviving-the-Aftermath spreadsheet feel. A crime-and-punishment system is that. |
| **THE BROKER** | KILLED. Mine, weakest thing on the ladder, fails his build-or-explore test, and he offered it no defence. |

**22 → 17.** Fewer, and every one opens a door the others cannot.

## WHAT IS STILL HIS

- **THE VOICE**: not approved, needs fleshing out further. Alive as a candidate only.
- **THE SUMMON**: whether clout is the mana, what arrives, how many, whether a spent debt is
  gone forever. All his.
- **Every number.** The filth level, the population caps, the costs, the order inside an act.
  NO DAMAGE BEFORE THE DIAL.
- **Who these people are.** The names are handles for a mechanism. Faction identity, and
  whether any of these are existing factions rather than individuals, is
  CONTENTS-PAOLO'S.
- **Whether 18 is the number.** He has said more than 18 is allowed; this rebuild came DOWN to
  17 because five were duplicates or dead, not because 17 is a target.

## WHAT THIS DOES NOT DO

Designs no combat, sets no damage, writes no faction canon, and builds nothing playable. It is
a shape and a rule, with a machine holding the rule. Nothing here is in a tab and nothing here
is wired to the game.

## SOURCES

- Metroidvania lock-and-key / capability gating: [Thinky Games on knowledge-gated
  design](https://thinkygames.com/features/metroidbrainia-an-in-depth-exploration-of-knowledge-gated-games/),
  [the pacing of metroidvania games](https://itch.io/devlog/87273/the-pacing-of-metroidvania-games.amp),
  [Hollow Knight terrain design](https://ludonauta.itch.io/platformer-essentials/devlog/1084669/the-hidden-genius-behind-hollow-knights-terrain-design)
- Valheim's forsaken powers, which are buffs and not keys: [Valheim
  Wiki](https://valheim.fandom.com/wiki/Forsaken_power), [EIP Gaming
  overview](https://eip.gg/valheim/guides/forsaken-powers-overview/)
- Fallout 4's recruitment beacon and its food/water/beds gating: [Fallout
  Wiki](https://fallout.fandom.com/wiki/Recruitment_radio_beacon), [The
  Gamer](https://www.thegamer.com/fallout-4-increase-attract-recruit-more-settlers-guide/)
