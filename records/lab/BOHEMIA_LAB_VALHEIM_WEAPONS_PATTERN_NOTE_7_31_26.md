# LAB 07 PATTERN NOTE — VALHEIM'S WEAPON TYPES (7/31/26)

Page: `slices/lab/BOHEMIA_LAB_VALHEIM_WEAPONS_7_31_26.html`
Numbers: `records/lab/BOHEMIA_LAB_VALHEIM_WEAPONS_TEARDOWN_7_31_26.txt`
Mechanics played end to end: **damage types / resistances / backstab / parry /
weapon skill**.

**This is a MODEL, not a measurement.** Valheim ships compiled Unity assemblies.
Three numbers here are genuinely SOURCED from real open-source C# (ValheimPlus,
which patches the live game and so names its real types); everything else is
DOCUMENTED and tagged `[DOC]`. A reader of only this file should still know that.

---

## WHY PAOLO ASKED, AND WHAT I FOUND INSTEAD

He asked for the weapon types. What Valheim actually has is better than a list:

> **VALHEIM'S WEAPON SYSTEM IS A DAMAGE-MULTIPLIER SYSTEM WEARING A WEAPON LIST
> AS A COSTUME.**

Almost nothing good about it is the damage printed on the weapon. It is four
multipliers you EARN, and the weapon's real job is deciding which ones you can
reach:

| the multiplier | you earn it by | Valheim's number |
|---|---|---|
| damage type vs resistance | knowing what you're fighting | up to **2x** |
| backstab | standing behind it | **3x**, knives **10x** |
| parry into stagger | timing a block | **2x** |
| weapon skill | having used it before | raises your **floor** |

## AND IT LANDS EXACTLY ON THE HOLE OUR OWN AUDIT FOUND

This is the part that makes it a lane deliverable instead of trivia. His north
star (`laws/BOHEMIA_ADDENDUM_WHAT_COMBAT_IS_FOR_7_27_26.md`, LOCKED):

> "the strategy choice to deal the most damage and take the least amount of
> damage by positioning and abilities and deeper understanding of mechanics."

His own audit of where we stand against it
(`records/BOHEMIA_COMBAT_AUDIT_AGAINST_THE_NORTH_STAR_7_27_26.md`), in capitals:

> "DEAL THE MOST DAMAGE BY POSITIONING — NOT IMPLEMENTED AT ALL."
> "ABILITIES — ... None of them increases your damage."

**Half his sentence has no code behind it.** Valheim's four multipliers are that
missing half, one for one: resistance is *deeper understanding*, backstab is
*positioning*, parry is *what you spend*, and skill is the switching cost that
makes the choice real. He did not ask me to solve that. It is just what was
sitting at the bottom of the thing he pointed at.

---

## THE SIX IDEAS I WOULD STEAL, RANKED

### 1. Resistance is applied PER DAMAGE TYPE, then armour on the total
The order of operations *is* the mechanism. Because a split-damage weapon (their
knife is pierce + slash) gets partial credit against a resistance, "wrong
weapon" becomes a **tax instead of a wall**. That single ordering decision is the
most portable thing in the whole document and it costs nothing to adopt.

### 2. The matchups are physical intuitions, not a lookup table
Bones don't care about a hole. A carapace gets punched through, not bruised. You
cannot stab a puddle. A stick does little to something the size of a truck. The
table is **learnable** because it isn't arbitrary — you can guess a new enemy
correctly the first time you meet it. A resistance table you have to memorise is
homework; one you can reason about is the "deeper understanding" leg of his
sentence.

### 3. Skill raises your FLOOR, not your ceiling
Their damage is a random roll between a floor and a ceiling that both climb —
but the ceiling is finished at level 75. **The last quarter of mastery buys no
extra power at all, only consistency.** Mastery means you stop getting robbed.
That is much closer to how getting good at something actually feels than "+1
damage per level," and it is one formula.

### 4. One number can be a whole playstyle
Knives: **10x from behind.** Bad weapon from the front, best in the game from
behind, no special-case system attached. That's what a well-chosen multiplier
buys — a build, for free.

### 5. Your defence choice sets your offence ceiling
Parry strength lives on what you're holding: shields 1.5x, buckler 2x, swords
2x, knives 4x. Two decisions collapsed into one item. And there are **two roads
to the same 2x** — grind an enemy into stagger against the 40%-of-health limit,
or parry once and get it instantly. Patience or timing, same reward.

### 6. Nobody is weak to slash
The default weapon has **no matchup to exploit**. Never the best answer, never
the wrong one. That is how you make specialists matter without punishing the
player who just wants to swing a sword. A deliberately flat generalist is a
kindness, and it is stored as a single fact.

---

## WHAT NOT TO PORT

- **Real-time swing timing and stamina-per-swing.** Bohemia's combat is a
  turn-based grid, and a turn already *is* the cost. This is why the page is a
  grid encounter and not a Unity clone: a page that copied the timing would
  prove nothing about whether the idea survives translation, which is the only
  question that matters. Their parry is a reflex; ours would have to be a
  **prediction** — you spend a turn saying "it will swing" and you are right or
  you are not. That is a genuinely different and possibly better mechanic, and
  it is Paolo's call, not mine.
- **Ten damage types.** Three is the number that makes a choice. Ten is a
  spreadsheet. Their extra seven exist because they have biomes and magic; we do
  not need the tail.
- **A 0-100 skill number per weapon.** His whole register is small legible
  numbers (Rogue Fable IV +1/+2/+3, camp law clause 8). A 0-100 skill bar per
  weapon class is another game's HUD. The *idea* (mastery = consistency) is
  worth keeping; the scale is not.
- **10x as our backstab number.** In a real-time game a 10x is balanced by the
  difficulty of getting behind something that is actively turning. On a grid,
  where flanking is a solved geometry problem, 10x would be the only strategy in
  the game. The *shape* ports; the magnitude has to be re-derived for a grid,
  and only he sets it.
- **Skill loss on death** (their `Skills.OnDeath` / `LowerAllSkills`, visible at
  `Skills.cs:124-128`). Extremely relevant to a hardcore roguelite and exactly
  the kind of thing that must not be adopted quietly.

---

## HONEST LIMITS

- **Three numbers are sourced; the rest are documented.** The weapon-CLASS
  system is real code (`Skills.cs:101-122`, and `Player.cs:376` proving an item
  carries `m_shared.m_skillType`). The damage values, resistance ladder,
  backstab and parry multipliers, stagger and skill formulas are all `[DOC]`.
  A mod can tell you a game's type system; it cannot tell you its balance.
- **The per-weapon damage splits are representative, not exact.** The real
  per-item stat blocks live in asset bundles behind the 403s the teardown lists.
  The page's claim is the *shape* of a profile, and it says so on its face.
- **Five of their systems are not modelled**, each named by what it is in the
  teardown: elemental types, stamina per swing, secondary attacks, stagger by
  accumulation, and blocking as distinct from parrying.
- **I have not seen him play it.** Everything above is what the design says, not
  what it feels like on a phone in a turn-based grid.
- **This is not my lane's system.** Combat belongs to the COMBAT lane under the
  parallel-sessions law. This page touches no combat code, claims nothing, and
  the findings are FLAGGED for that lane rather than handed to it.

---

## WHAT THIS DOES NOT DECIDE

**Bohemia has no weapon-type system, no resistance table, and no positional
damage term. All three are [PENDING Paolo] and all three are COMBAT's to build,
not the lab's.** Nothing here is ported; under
`laws/BOHEMIA_ADDENDUM_LAB_PORTS_ON_HIS_WORD_7_26_26.md` a lab finding moves
into the game only when he says so. NO DAMAGE BEFORE THE DIAL is intact: there
is not one Bohemia damage number on that page.

**The one question:** is **earn-your-multiplier** the shape we want — where a new
weapon changes which multipliers you can reach — instead of a weapon ladder where
a new gun just prints a bigger number? If yes, the follow-up is small and
specific: which multipliers, and how big on a grid.
