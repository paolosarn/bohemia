# WORDS [the eight enemy classes' lines] -- ONE ROUND (words-8dqrnq, 10/9/26).
COMBAT [weapons say what they do] (b17ebb6) drafted eight classes in records/target/bb/weapon_lines.json
"for WORDS": sword, cleaver, axe, polearm, spear, bow, flail, throwable_item. THIS FILE IS
THE DELIVERABLE: it does not edit weapon_lines.json (ONE SYSTEM, ONE SESSION, rule 55);
COMBAT applies what it wants.

## CHECKED EVERY LINE AGAINST THE REAL WEAPONS.JSON NUMBERS, NOT THE VIBE OF THE SENTENCE
Computed each class's own average damage, armour percent, hands and range straight from the
126-row table and cross-checked every named skill's real effect field. SEVEN OF EIGHT WERE
ALREADY RIGHT:
SWORD (16 rows, 46.8-57.7 damage, 80.6% to armour): Slash's real effect is +10% chance to
  hit, confirmed; "the easiest swing to land" is sourced, not a guess.
CLEAVER (14 rows, 36.1-52.9 damage): Cleave really does cause bleeding, Decapitate really
  does finish a target that is already hurt; both confirmed in the skill data.
AXE (12 rows, 50.0-70.4 damage, 136.3% to armour, the highest of any class checked this
  round): Split Shield really does direct damage to a shield specifically, so "split a car
  door in two" is sourced twice over, once by the raw armour number and once by the named
  skill.
POLEARM (10 rows, 49.0-72.5 damage, two hands only, reach 1-2): Impale and Reap both cost 6
  AP exactly as drafted; the "over your own man's shoulder" reach mechanic matches the
  class's own range field.
SPEAR (8 rows, 32.5-43.1 damage): Thrust's real effect is +20% chance to hit, confirmed;
  Spearwall really is a reaction that lands on the first man who steps in (its own effect
  text: "canceled if it misses to land a hit on opponent").
BOW (8 rows, 36.9-56.3 damage, 58.1% to armour, reach 7): bows carry no Reload skill at all
  (Quick Shot, Aimed Shot only) while crossbows and firearms both do (checked the real skill
  lists side by side); "no reload" is a sourced contrast, not an assumption.
THROWABLE ITEM (7 rows, range 3, no damage stat of its own): matches "not a weapon... no
  damage of their own" exactly; the six real skills (Throw Net, Throw Acid Flask, Throw
  Blessed Water, Throw Fire Pot, Throw Smoke Pot, Throw Flash Pot) are the net, the fire pot
  and the flask the line names.

## ONE LINE OVERCLAIMED, FIXED
FLAIL's drafted line, "Swings over a car door and goes for the head," and its own "why" field
("Lash ignores the shield and aims at the head") claims the hit bypasses a shield. Checked
Lash's actual sourced effect: "100% chance to hit the head (if the attack hits), 30% Direct
Damage." The head-shot guarantee is real and sourced; nothing in the data says it ignores a
shield specifically, so that half of the claim is an assumption riding along with a true one.
BEFORE: "Swings over a car door and goes for the head."
AFTER:  "A chain and spikes. Goes for the head no matter what you're holding up."
WHY: keeps the one sourced fact (a guaranteed head hit) and drops the unsourced one (a shield
bypass), while still implying the same idea in a way the data actually backs.

## NAMES, CHECKED AGAINST THE SEVEN ALREADY SHIPPED
BLADE, CLEAVER, AXE, POLE, SPEAR, BOW, CHAIN, KIT: all one or two blunt words, matching the
register of the seven player-facing jobs shipped two rounds ago (PISTOL, SHOTGUN, RIFLE,
PIPE, SLEDGE, CAR DOOR, BOTTLES). None of these eight carry a player job (job:null in the
data, by design: "the eight classes the enemy carries," never the player's seven).

## RULE 27 AND THE UNBUILT-RULE CHECK
All eight lines swept against the real 274-word Spanish set: 0 hits. No em dash in any line.
All eight under the 98-character dwell ceiling (longest is 73). Every one of these is a
combat label, never a line the player speaks. NOT WIRED YET, said plainly: the weapon card
these lines feed (a held finger on the strike square or on a man) was built by COMBAT for the
player's seven jobs two rounds ago; whether it shows the enemy's eight classes too is
COMBAT's call, not checked here.
