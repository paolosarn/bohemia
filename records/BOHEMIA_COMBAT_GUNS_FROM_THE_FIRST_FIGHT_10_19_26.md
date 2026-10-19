# COMBAT [guns from the first fight] 10/19/26 (rule 120(a))

His words, 10/18, to the coordinator: "the combat is still so fucking ass... I wanna start off with the guns too... the guns
were supposed to be the main way this is gonna be solved." Rule 120(a): every origin's first fight has guns in the company's
hands, and the gun is the main way a fight is won (rule 83 stands: guns two tiles and more, melee one); the starting kit, the
first band and the tutorial fight are built around shooting. Opened by the coordinator (rules 112, 116), Opus 5.5 Extra.

## What was wrong, measured before work (the fight's own rules, headless, AUTO both sides)

1. THE DEMO'S COMPANY CARRIED NO GUN. The door hands the fight its men as background and level only; every man without gear
   takes the kit of his place in the crew rows, and the first three places were PIPE + CAR DOOR, PIPE + CAR DOOR, SLEDGE. A
   NEW CREW, the door's own first pick, walked into its first fight with two pipes and a sledge: zero shots in 120 fights.
2. THE PISTOL NEVER FIRED, ANYWHERE. Our PISTOL rides Battle Brothers' dagger (weapon_lines.json, the market's CLASSNAME), a
   one-tile row. Rule 83 shut every gun out of the tile beside it, so the pistol's only strike was its stab at one: a knife
   with a gun's name. ours.gun_min_range said so in its own why ("until his guns vote gives it a shot, rule 47b").
3. THE FIRST BAND COULD NOT BE BEATEN BY THREE MEN. Day one's mix is 8 thugs to 2 lesser raiders a slot (75 health, 55 to 110
   body armour); a band of three met two raiders often enough that A NEW CREW won 55 in 100 against three and 20 in 100
   against four, whatever it carried.
4. BATTLE BROTHERS' VETERAN AIM WAS OUR DEFAULT. TUNING's lever combat.hit_roll_shift (rule 117: their Beginner is our start)
   was never built: the door's SEEN IT played at their Veteran.

## Built

- THE PISTOL SHOOTS (ours.pistol_shot): two to four tiles as Battle Brothers' own one-handed missile, the javelin row of the
  pistol's own price rank (knife: crude javelins; dagger and notched blade: javelins; rondel, qatal, estoc: heavy javelins):
  Throw Javelin's 4 AP, +20 to hit and -10 a tile past two, 30 to 45 damage, 45 through armour. Its name, id, price and weight
  stay the pistol's. Its uses are A MAGAZINE: five rounds, then Battle Brothers' crossbow Reload (4 AP) refills them, only
  when empty (rule 117b). Measured why: with five uses for the whole fight the company fired eleven shots a fight whatever
  the gap, so shooting could never be the main way. PISTOL WORK (dagger mastery) is still the pistol's: its shot at 3 AP.
- EVERY GUN IS A CLUB AT ONE (ours.gun_club, his words for the pistol): at one tile a pistol, a rifle or a shotgun strikes
  as the bludgeon (the pipe's own row); a gunman beside a man clubs him where he stands and never walks out through the free
  swing. Both sides. Measured why: the auto brain walked the gunman out of the thug's reach, he ate the free swing, and the
  guns kit lost to the pipes 63 to 88 in 100.
- GUNS FIRST, IN THE RIGHT HANDS (ours.crew, ours.guns_first_kit): the kit runs guns first in the company's order (three
  men: pistol + car door, rifle, pistol + car door; six: five guns and a sledge; twelve: three pistols, three rifles, two
  shotguns, bottles, a sledge, two pipes), and it is DEALT: the long guns to the best eyes (the middle of each background's
  wiki ranged skill), the melee jobs to the best arms, the rest in the line's order. A NEW CREW's ranged companion takes the
  rifle. Gear the roster hands over always wins.
- THE FIRST BAND IS BUILT TO BE SHOT AT (ours.enemy_tiers 'first'): days 1 to 7 are thugs alone, the wiki's early band
  before its "sometimes Raiders"; the lesser raider from day 8.
- BATTLE BROTHERS' BEGINNER AIM IS OUR DEFAULT (ours.hit_roll_shift): +5 on his men's chance and -5 on theirs on NEW HERE
  and SEEN IT; OUTLIVED IT is their Veteran (0), our hard end. Inside the number on the tile.
- ON THE GLASS: a gunman's shooting ground is taped off on the tiles (rule 83's ranges lit: two tiles out to his gun's last,
  every tile he can see), the shot plays the rig's own fire clips (the pistol's kick in one hand, the long gun's into the
  shoulder, fight_people's shot_1h and shot, baked and never played before), the club at one is a swing and a swing's sound,
  his card reads PISTOL with "it shoots as Bundle of Javelins", reach 2 to 4 tiles, rounds 5 then a reload, a club at one.
- A displaced man keeps his own line: with nine shooters in the back line, a shooter whose slot is a house slid into the
  shieldwall's column; now he slides along his own line.

## Measured after (records/target/BOHEMIA_COMBAT_GUNS_FIRST_MEASURED.json, tools/bohemia_combat_guns_from_the_first_fight_10_19_26.js)

RESULTS_TABLE

## Not built, said
- The lone wolf is still hard (VERY HARD by Battle Brothers' own mark): one man in the crew rows' padded surcoat; Battle
  Brothers' Lone Wolf starts as a hedge knight in his gear. The pistol and car door ties the best melee kit; his armour is
  the gap (TUNING, RUN TWO, CHARACTER).
- The shotgun's cone (Battle Brothers' Fire Handgonne hits a cone of tiles) is one man today ([weapon shapes]).
- The rounds between fights are ECONOMY's [the first bullets]: in the fight the magazine reloads free.
- The enemy's nerve (0.9) and his own (1.1), and the miss-streak help, are TUNING levers not built this round.

## Routed
- RUN: nothing to cut: the demo opens the fight live and hands no gear, so the guns kit is what the demo plays.
- TUNING: the first week, the magazine, the club and the Beginner aim are rows of ours.json with their why; every number DRAFT.
- WORDS: the card's words ("it shoots as", "Rounds", "At one tile") and the aim lines are drafts.
- ECONOMY [the first bullets]: the company's rounds between fights.
