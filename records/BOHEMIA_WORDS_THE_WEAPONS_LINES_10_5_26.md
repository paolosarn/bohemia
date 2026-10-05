# WORDS [the weapons' lines] -- ONE ROUND (words-8dqrnq, 10/5/26). Rule 75e.
One plain line per weapon, its Battle Brothers base named in small print. THIS FILE IS THE
DELIVERABLE: it does not edit COMBAT's or RUN TWO's own files (ONE SYSTEM, ONE SESSION, rule
55); they read this and apply what they want.

## FIRST, A MEASUREMENT, NOT AN ASSUMPTION
The row's own brief names five example mappings (pistol=dagger, pipe=mace, car=handgonne,
rifle=crossbow, scope=longbow). Checked against the real, live table
(records/target/bb/ours.json, `weapon_jobs`): it has SEVEN entries, not five, and two of the
brief's own examples do not match it -- the live table says shotgun=handgonne (not car), and
there is no "scope" or "longbow" anywhere in the repo at all (weapons.json's real Battle
Brothers classes are "bow" and "crossbow," never "longbow"). Built the lines to the real
table, seven jobs, not the brief's five examples:

    pistol    -> dagger
    shotgun   -> handgonne (Battle Brothers "firearm" class)
    rifle     -> crossbow
    pipe      -> mace
    sledge    -> hammer
    car_door  -> shield
    bottles   -> throwing

Flagged, not guessed past: "car" and "scope" are not real jobs yet; whoever meant them should
say what they map to, because right now nothing in the fight reads either word.

## WHERE THESE LIVE TODAY
Checked slices/BOHEMIA_FIGHT.html for a weapon card: `weapon_jobs` is not read anywhere in
that file, and no settlement weapons market exists yet in slices/BOHEMIA_SETTLEMENT_SCREEN.html
either (rule 75d's [the market] is RUN TWO's, not shipped). So there is no live card to read
back right now; these seven are a real attempt, draft:true, for whoever builds the card.

## THE SEVEN LINES, EACH GROUNDED IN ITS CLASS'S REAL NUMBERS
Not picked from one sample weapon; averaged across every Battle Brothers weapon in that
class (records/target/bb/weapons.json), so the line describes the class's real shape, not
one item's.

    PISTOL (dagger, 6 weapons, avg 23-38 dmg, weakest armour damage of any class)
    "A cheap handgun. Light and quick, but armor barely feels it."

    SHOTGUN (handgonne/firearm, 1 weapon, 35-75 dmg at 2-tile range, reloads slow)
    "One huge hit point-blank, then a slow reload."

    RIFLE (crossbow, 4 weapons, avg 43-63 dmg at 6-tile range)
    "Hits from across the street. You pay for the range with a reload between shots."

    PIPE (mace, 17 weapons, avg 92% armour damage, the highest of any one-handed class)
    "Dumb, heavy, and it crushes straight through armor."

    SLEDGE (hammer, 7 weapons, avg 184% armour damage, the highest of any class)
    "The heaviest thing you can swing. Armor does not help against it."

    CAR DOOR (shield; boosts melee/ranged defense, carries a shove skill that pushes a man
    back and costs him fatigue and height)
    "You do not swing it. You hide behind it, and you can shove a man back with it."

    BOTTLES (throwing, 9 weapons, avg 2-4 tile range, the only class that reaches past melee
    without a gun or a reload)
    "Thrown, not swung. It reaches past a pipe, and you only carry a few."

All seven swept clean: no em dash, no Spanish (the player's own weapon card is the player's
own words, rule 27), all under the 98-character dwell ceiling. Each is one line, in the
game's own voice, picked to be the ONE thing a stranger needs to decide whether he wants the
weapon, the same way the fifty perks were compressed last round; what each line drops (a
second or third real number) is a choice, not an omission, for the same reason those were.

## WHAT I DID NOT WRITE, AND WHY
Not one line per individual Battle Brothers weapon (126 of them in weapons.json): the game
does not show the player 126 different items, it shows SEVEN jobs, and `ours.json` itself
says so ("Bohemia's own numbers... only what Paolo ruled"). Writing 126 lines for weapons the
fight never individually names would be inventing a granularity nobody asked for and nobody
can see; if a future round gives individual weapons their own names inside a job (three
different pistols, say), that round writes those lines against the real list, not this one.

## NOTHING PROMISES AN UNBUILT RULE
Said once, not hidden: none of these seven lines exist on a screen yet. The record says so
up front rather than letting a green file be read as "it ships."
