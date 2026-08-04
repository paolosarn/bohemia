# BOHEMIA — HOW THE WHOLE STACK FITS (proposal, 8/3/26)

> "well im thinking because our map is so big we have to have a valheim idea
> progression system as well. maybe u arent meant to explore most of the city. alot of
> it sure. but yeah what do you think of that. the progresion crafting system. plus main
> story quests. plus three acts. plus story. plus isometric pixel down. plus some project
> zomboid vibes. rythym based rogue fable 4 combat. how can we make this all work out. in
> valheim you kill hella shit. is this the vibe we are going for in the game? i want it to
> be realistic as possible but somethings gotta give or take. we may need to increase the
> amount of enemies in the game. the boss progression is so fucking good."
> — Paolo, 8/3/26

**THIS IS A PROPOSAL. NOTHING HERE IS CANON.** Every ruling-shaped statement below is
marked as his. Nothing is built. Where I say the answer already exists, I cite the file.

---

## 1. "MAYBE YOU AREN'T MEANT TO EXPLORE MOST OF THE CITY" — YES, AND THAT IS EXACTLY
## HOW VALHEIM ALREADY WORKS

**Nobody explores most of Valheim's 314 km² either, and nobody thinks Valheim is too
big.** Its map is not a checklist, it is a **search space**. You do not go to the Black
Forest to see the Black Forest. You go because copper is there, you find *a* copper
deposit, and you leave.

So the reconciliation for a 96×96 valley is one line:

**YOU ARE MEANT TO SEE EVERY DISTRICT *TYPE*. YOU ARE NEVER MEANT TO SEE EVERY DISTRICT
*INSTANCE*.**

We have 79 registered district types (`gates/district_registry_gate.js`) and 9,216 cells.
**The types are the content. The cells are the search space.** That makes the size free:
nothing is wasted, because an unvisited cell was never authored content, it was one of
the many places a thing could have been.

**AND IT MEANS NO CUT IS NEEDED.** The MAP SIZE floor
(`gates/mapsize_gate.js`, 37.0 km² built, 75.7 km² on foot) exists so the world cannot be
quietly emptied. That floor is about the world being DENSE, not about the player being
obliged to walk it. His idea and that gate do not fight.

## 2. THE HOLE I HAVE TO PULL IN HIS OWN IDEA

If most of the city is optional, **why does anybody go into the optional part?**

Valheim's answer is brutally simple: the search space **contains the thing you need**.
Copper is not in the Meadows. You are not exploring, you are shopping.

If Bohemia's optional districts contain nothing you need, they are **scenery** — and
9,216 cells of scenery is worse than a small map, because it costs the player time and
returns nothing. That is the failure mode his idea creates, and it is the one worth
naming out loud.

**THE CONSTRAINT THAT FIXES IT:** every district type must be the **only place something
comes from**. Self-storage is the only place X is. The fire station is the only place Y
is. A gas stop is the only place Z is. Then "go find a self-storage" is a real errand
with a real search, and the valley is a supply network instead of a diorama.

That is a mechanism constraint, it is mine, and **it is machine-checkable** — a gate can
assert every registered district type is the sole source of at least one thing. What each
type actually yields is content and therefore his. **[PENDING Paolo: is this the model?]**

## 3. "IN VALHEIM YOU KILL HELLA SHIT. IS THIS THE VIBE?" — NO, AND CANON ALREADY SAID
## SO TWICE

Answering straight, because this one is not open:

- **`laws/BOHEMIA_ADDENDUM_TRAUMATIC_NOT_GORY_7_31_26.md`** — a hurt body is a **CLOCK,
  not a corpse**; gore is permitted but never the mechanism; the cost lands on the
  PLAYER.
- **`records/BOHEMIA_RESEARCH_CRISIS_RESPONSE_VIOLENCE_7_31_26.md`** — the finding he
  approved: violence is traumatic when it makes **WORK** and **COSTS** you, with
  **"least possible loss of life as the desired outcome."**
- **`laws/BOHEMIA_ADDENDUM_WHAT_COMBAT_IS_FOR_7_27_26.md`**, his own words, LOCKED: *"the
  strategy choice to deal the most damage and take the least amount of damage by
  positioning and abilities and deeper understanding of mechanics."*

That last one is the argument. **It is a rule about the QUALITY of one fight and it is
silent on quantity — but the two are in tension, mathematically.** A game where you kill
hundreds cannot make each fight a strategy puzzle: the attrition would kill you if each
fight were expensive, so the fights have to become cheap, and cheap fights are not solved,
they are swung through. **Valheim's combat is deliberately shallow because its kill count
is high.** You cannot have both.

## 4. BUT HE IS RIGHT THAT THE BOSS LADDER IS THE BEST PART — AND THE KILL COUNT IS NOT
## WHY IT WORKS

**Valheim has about seven bosses.** The ladder is made of **keys and biomes**, not of
corpses (`records/BOHEMIA_RESEARCH_WHY_VALHEIM_WORKED_8_3_26.md`, mechanism 2). Delete
ninety percent of Valheim's trash mobs and the ladder works identically, because what
gates you is *the coat you do not have*, never *the kills you have not made*.

**TAKE THE LADDER. LEAVE THE BODY COUNT.**

## 5. SO WHAT IS BOHEMIA'S LADDER MADE OF? WE ALREADY HAVE IT, AND IT IS BETTER THAN A
## BIOME

Valheim's tier is a **biome**, and its key is **metal**. Ours is already written down and
it is made of people:

**CLUSTERED POWER + LIGHT = TERRITORY** (`CLAUDE.md` law list): only ~12% is lit, that
12% is **OWNED**, its network is eerily perfect, and **nobody patrols the dark.**

Map it across and it lands almost too cleanly:

| Valheim | Bohemia, from existing canon |
|---|---|
| The biome you can survive in | **The lit block, and who owns it** |
| The boss at its centre | **The person who owns that block** |
| The metal that gates the next tier | **The power itself** — already one of the three currencies |
| The trophy on your wall | **The story of how you took it** (R17's silent ledger, R21's spread) |
| Frost resistance, padded armour | **A new garment SHAPE** — see section 6 |

**A BOSS LADDER MADE OF PEOPLE INSTEAD OF ANIMALS IS STRICTLY BETTER FOR THIS GAME**, for
four reasons that are all already canon:

1. **It is realistic**, which he asked for. Ten years after a crash, what is scarce is
   power and what is contested is territory. That is what actually happens.
2. **It fits the three acts.** The city is rebuilt block by block, so the tiers ARE the
   act structure rather than sitting beside it.
3. **It fits the dynasty.** A person you beat, spared, or killed is remembered — and the
   memory spreads (R20/R21). An animal is not.
4. **★ YOU CAN TAKE A BLOCK WITHOUT KILLING ANYBODY.** That is the single thing that makes
   this Bohemia and not Valheim, and it is what "least possible loss of life as the
   desired outcome" needs in order to mean anything mechanically. A boss you can *talk
   out of the building* is only possible if the boss is a person.

**[PENDING Paolo, and this is the linchpin of everything above.]**

## 6. THE GEAR LADDER IS ALREADY BUILT. IT IS THE WARDROBE.

He asked about "the progresion crafting system," and it exists:
**`laws/BOHEMIA_ADDENDUM_STRUCTURE_NOT_COLOR_7_19_26.md`** (LOCKED 7/19) — colorways are
legal but **never progress**; progress is a new garment **SHAPE**, a new silhouette or
category, machine-locked by `structure_gate.js`. A recolor is filler, never the headline.

**That is Valheim's armour ladder, already written.** Bronze to iron in Valheim is a new
silhouette, not a repaint. Ours says the same thing in the same terms. So Bohemia's
crafting progression is **clothing**, the law governing it is already locked, and there is
a gate on it.

Which also answers what the tier gate *feels* like: in Valheim you cannot enter the
Mountains without a cape. In Bohemia you cannot hold a block without the coat that lets
you be out in it.

## 7. "SOMETHINGS GOTTA GIVE" — THE SPECIFIC ANSWER ON ENEMY COUNT

He is right that there is a real tension, and it is worth stating plainly:

**REALISM SAYS a city ten years cold has few people and far fewer fights. VALHEIM DENSITY
SAYS many encounters.** Both cannot be true.

**THE GIVE THAT KEEPS BOTH: MORE ENEMIES PER ENCOUNTER, NOT MORE ENCOUNTERS.**

- A gang of nine holding one block **is** realistic. Nine separate gangs on one street is
  not.
- It raises the enemy count on screen, which is what he actually asked for, **without**
  raising the number of fights, which is what realism cannot survive.
- **It is the cheapest possible fix for the exact asymmetry his own combat audit found.**
  `laws/BOHEMIA_ADDENDUM_WHAT_COMBAT_IS_FOR_7_27_26.md` §4: *"POSITION CONTROLS WHAT YOU
  SUFFER AND NOTHING ABOUT WHAT YOU DELIVER."* Nine bodies in one room make the ground an
  argument for attacking from somewhere specific, with **no new mechanic at all** — angles,
  chokepoints and crossfire come free from the count.
- And it keeps every fight expensive, which is what TRAUMATIC NOT GORY requires.

**[PENDING Paolo: how many is a lot.]** No number, and no damage — NO DAMAGE BEFORE THE
DIAL.

## 8. HOW THE WHOLE STACK COHERES, IN ONE PARAGRAPH

**Isometric pixel** is the camera (45 DEGREE ART LAW). **Rhythm/RF4 beat-tactics** is the
fight — and nothing here contradicts anything, because what got killed on 8/1 was *a stat
presented as a minigame* (settled question 12), **not** RF4 combat: the COMBAT LAB is
already beat-based at 120 BPM and `laws/BOHEMIA_ADDENDUM_COMBAT_DNA_RF4_6_30_26.md` has
been live since June. **Project Zomboid is atmosphere ONLY** — the settled anti-reference
is specifically its **loot pace** (settled question 7: loot is a resource with a count,
looting is one fast action), so the dread and the decay are welcome and the item-by-item
inventory is not. **Valheim is the progression spine.** **Pocket City 2** is the builder
layer sitting on the blocks you have taken. **The three acts are the tiers.**

And the single thread through all of it:

> **YOU TAKE A BLOCK. YOU LIGHT IT. YOU BUILD ON IT. THE STORY OF HOW YOU TOOK IT
> SPREADS. THAT IS THE LADDER, AND YOU CLIMB IT THREE TIMES, ONCE PER GENERATION.**

## 9. WHAT I AM NOT DECIDING

- **Whether the boss is a person who owns a lit block.** Section 5. His, and it is the
  one that unlocks the rest.
- Whether every district type is the sole source of something. Section 2.
- How many enemies "a lot" is. Section 7. And no damage numbers, ever, before the dial.
- What each district type yields. Contents his, always.
- Anything about the map layout. **MAP LAW: Claude never designs map layouts.**
- Whether a block can be taken without violence at all, and what that costs.

## 10. WHAT THIS DOES NOT CHANGE

Nothing is superseded by this file. It proposes a synthesis of laws that already exist and
adds no new canon. If he rules section 5, the addendum gets written that same turn and
this record becomes its working.
