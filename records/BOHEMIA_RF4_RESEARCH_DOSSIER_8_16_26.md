# THE ROGUE FABLE IV RESEARCH DOSSIER (8/16/26, coordinator, on Paolo's
# order: "I need you to support with big brain research for this rogue
# fable four shit, look on everything online, the deep wiki, tutorials,
# combat guides and tips, the whole thing")

## WHAT THIS IS AND IS NOT
This is the RESEARCH INPUT for LAB's teardown spec, not the spec. LAB
still owns records/BOHEMIA_RF4_TEARDOWN_SPEC.md — the numbered items, the
status column and the diff against our build. The seam from
laws/BOHEMIA_ADDENDUM_RECREATE_RF4_FIRST_8_16_26.md is unchanged: LAB
specs, COMBAT builds. This file just means neither of them has to spend a
turn finding what is already findable.
COLLECTION NOTE, stated because it limits confidence: the network proxy
blocks Steam, itch.io and Fandom directly, so this is assembled from
search-surfaced text of the designer's own devlogs, patch notes, the
wikis and player guides. Everything below is attributed. Where I could
not reach the primary page in full, I say so rather than filling the gap.

=============================================================================
## 1. THE THESIS — AND IT IS THE MOST IMPORTANT THING IN THIS FILE
=============================================================================
The designer, Justin Wang, states the core of RF4's combat as a
deliberate tension between two opposed styles, and the goal of maximizing
BOTH:
> "On the one hand the game is intended to be highly tactical and reward
> clever decision making, game knowledge, and careful planning, drawing
> heavily on traditional rogue-like design. Of equal importance and
> opposing this perspective is the idea that the game should be fast,
> action packed and full of crunchy, satisfying explosions, drawing on
> old school **'Boomer Shooters'** with their high mobility, circle
> strafing and general mayhem."
### WHY THIS MATTERS MORE THAN ANY MECHANIC BELOW
RF4 IS REACHING FOR THE FEELING BOHEMIA CAN PRODUCE NATIVELY. Wang is
trying to get boomer-shooter energy out of a turn-based grid. Bohemia has
actual guns, line of sight, cover, and a 120 BPM execution dial — the
shooter half is already real here. So the recreation is not copying a
distant game; it is BUILDING THE DECISION LAYER UNDER A SHOOTER WE
ALREADY HAVE. That is exactly what the 6/30 combat-DNA doc argued, now
confirmed by RF4's own designer stating the ambition in his own words.

=============================================================================
## 2. THE SHAPE OF A RUN
=============================================================================
- ~ONE HOUR, ending in a climactic boss (The Wizard Yendor). Full
  traditional-roguelike depth compressed into that hour; approachable to
  players new to the genre.
- 13 UNIQUE ZONES in a procedural dungeon, arranged as a main descent
  with OPTIONAL BRANCHES:
    Level 1: The Upper Dungeon
    Level 2: The Swamp / The Under Grove / The Sunless Desert
    Level 3: The Orc Fortress / The Dark Temple
    Branch 1: The Ice Caves / The Core / The Sewers
    Branch 2: The Arcane Tower / The Iron Forge / The Crypt
    Level 4: The Vault Of Yendor
- 250+ MONSTERS, 30+ BOSSES.
- DELIBERATELY FREE OF STAT AND FORMULA BLOAT, with "most of the critical
  information presented in the world and on the field of battle itself"
  rather than in menus and sheets.

=============================================================================
## 3. THE COMBAT MECHANICS, CONCRETE
=============================================================================
**3a. PRIORITY TARGETS ARE THE CORE PUZZLE.** Fights are the player
versus 2+ enemies, and there is "almost always a highest priority
target" — either dangerous, or a SUPPORT type that buffs or heals. The
intended play: "rather than simply blasting away at whichever enemy is
closest the player often needs to plan a few turns ahead, IGNORE THE
NEAREST ENEMIES and somehow maneuver himself into position to kill the
Priority-Target who is often hiding in the back."
**3b. SUPPORT ENEMIES HAVE THEIR OWN AI, AND IT RUNS AWAY FROM YOU.**
Backliners maintain line-of-sight and range with at least one ALLY while
biased AGAINST being close to, or in line-of-sight of, the PLAYER. They
are built to be hard to reach, which "forces the player to either aggro
into them or have tools to pick them off."
**3c. THE ANTI-PULL RULE.** "There is now a 50% chance that enemies will
shout immediately upon gaining agro to prevent easy, repeatable single
pulls." The corridor-pull degenerate strategy is deliberately broken.
(Series precedent, RF3: a shout aggros enemies within 6 tiles; nothing
beyond ~10.5 tiles can be aggroed that way; outside line-of-sight the
radius halves to 3.)
**3d. COUNTER-ENEMIES AND THE ANTI-DOMINANT-ABILITY RULE.** Abilities
"too effective in many situations" are nerfed or removed, on the stated
grounds that relying on a single action reduces the need for varied
tactics. Counter-enemies are introduced specifically to force the player
off a favourite playstyle and widen the tactical scope.
**3e. KITING IS VITAL BUT NOT UNIVERSAL.** Player-guide consensus: when
overwhelmed, retreat, let the group spread out, and funnel them through
choke points — but it explicitly does not work everywhere.
**3f. UNIFICATION IS THE LIVING DESIGN PRINCIPLE.** Update 1.36 collapsed
a mess of one-off damage-boosting effects on talents, equipment, weapons
and NPCs into ONE stat: POWER, "the single, unified 'go freaking nuts'
effect." Protection/Block were unified the same way. Stated goal:
"greatly streamlines things while maintaining or even increasing depth
and complexity," and a named advantage is that anything modifying Power
now modifies ALL power.
**3g. ABILITIES READ THE ROOM.** Infusion-of-Storms grants +1 Power for
ending your turn "wide open, meaning not adjacent to any walls."
War-Cry grants +1 Power plus stun and shout, +2 on its upgrade. GEOMETRY
IS AN INPUT TO ABILITIES, not scenery.

=============================================================================
## 4. CHARACTER DEVELOPMENT
=============================================================================
- CLASSES have a main attribute and a mix of ACTIVE and PASSIVE talents
  (Rogue and Duelist: Dexterity; Warrior and Barbarian: Strength).
- TOMES are the level-up currency: "each Tome gives 2 random talents out
  of a possible of 3, and a tome for the current character's class will
  give a point of the class's primary attribute instead."
- TALENTS HAVE UPGRADES, and the upgrade changes what the talent is FOR:
  "players pick upgrades to make talents fill different gaps or perform
  different functions... even characters with the same talents can differ
  significantly based on which upgrades they choose." That is where the
  build variety actually lives — not in the talent list.
- CLASSES HAVE DIFFERENT SKILL FLOORS by design; the Rogue is described
  as one of the harder ones, "a lot of little tricks... a pretty high
  skill floor."

=============================================================================
## 5. THE ITEM / CONSUMABLE ECONOMY, AND A PLAYER-BEHAVIOUR FINDING
=============================================================================
Guide consensus: "every single consumable is pretty much a guaranteed
free fight win," and the most common cause of death is DYING WITH A
HOTBAR FULL OF THEM. Players hoard powerful one-shots for a rainier day
that kills them first.
FOR US: this is the hoarding failure mode the 8/15 rewind ruling already
dodged. Paolo rejected the pickup/vial model and priced the rewind
against background production instead — an income stream gets spent, a
precious consumable gets hoarded. RF4 has the problem; our rewind does
not. Worth keeping in view when the recreation reaches items: DO NOT
import RF4's consumable economy wholesale without importing its known
defect.

=============================================================================
## 6. THE THREE FINDINGS THAT MATTER MOST FOR BOHEMIA
=============================================================================
**FINDING 1 — RF4 ALREADY SOLVED "THE FIGHT HAS TO MOVE YOU."**
His 8/15 law came from playing our combat: "I just found some cover and I
stayed in the same place just shooting people... THERE'S NO MOVEMENT
WHATSOEVER AND I HATE IT." RF4 produces forced movement with THREE
independent mechanics, all in §3:
  1. the 50% aggro-shout, which kills the sit-and-pull pattern;
  2. the priority target placed AT THE BACK, so winning means advancing
     past the nearest threat;
  3. support AI that actively avoids your line of sight, so the thing you
     must kill keeps leaving.
None of those are animation or juice. They are all POSITIONAL PRESSURE
FROM ENEMY DESIGN. That is the answer to his complaint, and it is
already the top item in the COMBAT lane's queue (MOVE) — the recreation
and that law are the same work.
**FINDING 2 — UNIFICATION IS THE TRANSFERABLE DISCIPLINE, NOT THE
NUMBERS.** The single most repeatable lesson from 1.36 is the willingness
to collapse many near-duplicate systems into one and get MORE depth, not
less. This is the same instinct as his own THREE CURRENCIES law
("spreadsheet simulators and I'm not a fan") and the same instinct as the
8/16 sweep finding about near-duplicate candidates. When the teardown
finds two Bohemia systems that are secretly the same system, collapse
them — that is a faithful RF4 recreation even when the mechanic differs.
**FINDING 3 — INFORMATION ON THE FIELD, NOT IN MENUS.** RF4's "no stat
and formula bloat, critical information presented in the world and on the
field of battle" is the exact thing Paolo asks for constantly in other
words (normie-easy, never make him hunt, show it in a tab). A faithful
recreation therefore CANNOT ship a stat sheet. If the teardown produces a
mechanic that can only be understood from a menu, the recreation has
failed on RF4's own terms.

=============================================================================
## 7. GAPS I COULD NOT CLOSE — DO NOT LET THESE BE GUESSED
=============================================================================
The proxy blocked the primary pages, so these remain OPEN for LAB (or for
Paolo, who owns the game and can read them in one sitting):
- THE TURN / ENERGY MODEL. Whether actions cost variable energy, how
  speed and haste work, and whether movement and attacks share a clock.
  This is the single most important unknown for us, because it is where
  RF4's turn structure meets our 120 BPM beat.
- EXACT DAMAGE AND MITIGATION MATH after the Protection/Block
  unification, and how much randomness survives in a hit.
- HOW HEALTH IS RESTORED between fights, and what prevents rest-cheese.
- THE FULL TALENT LISTS and how many talents a run actually accumulates.
- WHAT RF4 DELIBERATELY OMITS versus its own predecessor RF3 — the
  streamlining list is the most instructive document we do not have.
RECOMMENDED, and cheap: Paolo owns the game. One recorded run with
commentary would answer every gap above better than any further search,
and it is the kind of thing he enjoys. NOT A BLOCKER — LAB can spec
everything in §1-5 today.

## SOURCES
sites.google.com/view/roguefableiv (project focus and design goal);
Justin Wang's devlog "Game Design: Combat" (11 Dec 2023) and the update
0.9-0.24 devlog series on itch.io; Steam update 1.36 "Major Mechanics
Overhaul" and update 1.9 "Major Talent Rework" patch notes; the Rogue
Fable IV Fandom wiki (Floors, Tomes, Characters, class pages) and the
Rogue Fable III wiki Tactics page for the shout-radius precedent; the
Steam Community "Rogue Fable III Tactics Guide"; itch.io community
threads on class skill progression. All reached via search-surfaced text;
direct page fetches were blocked by the network proxy.
