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
- PAST THE FIRST FOUR, A SHIELDWALL: the twelve are two pistols, three rifles, a shotgun and bottles behind two sledges and
  three pipes with car doors (measured: nine shooters behind three melee men could not be screened, 10 in 100 of the
  shooters' turns ended past the front man; 2 with the wall). YOU keep the first slot, your own pistol and car door (the best
  eye made the level-four captain a rifleman with only passive perks, and AUTO used no perk skill in twelve fights).
- A man the roster hands a weapon is that weapon's man (his job, his perks, his strike square): a handed bludgeon wore the
  pistol square of its place's old kit.

## Measured after (records/target/BOHEMIA_COMBAT_GUNS_FIRST_MEASURED.json, tools/bohemia_combat_guns_from_the_first_fight_10_19_26.js)

Every origin's company as the door builds it, against its first week's band (day 1, brigands, SEEN IT), 60 fights a cell, AUTO both sides. BEFORE = the fight as it was (rules and ours.json at a1013fe2). Win in 100, before -> now; the share of their dead whose last hit was a shot; shots a fight.

| origin | men | vs 2 | vs 3 | vs 4 | guns killed (vs 3) | shots a fight (vs 3) |
|---|---|---|---|---|---|---|
| THE CREW THAT IS LEFT | 3 | 90 -> 97 | 55 -> 87 | 25 -> 68 | 57% | 12 (was 0) |
| A NEW CREW | 3 | 90 -> 97 | 55 -> 87 | 25 -> 68 | 57% | 12 (was 0) |
| UP FROM HENDERSON | 3 | 90 -> 97 | 55 -> 87 | 25 -> 68 | 57% | 12 (was 0) |
| THE WATER TRUCK | 2 | 60 -> 57 | 8 -> 17 | 2 -> 5 | 55% | 6.6 (was 0) |
| THE BLOCK WATCH | 12 | 100 -> 100 | 100 -> 100 | 100 -> 100 | 61% | 15.4 (was 0) |
| THE SCAVENGERS | 3 | 78 -> 95 | 58 -> 85 | 25 -> 50 | 69% | 11 (was 0) |
| THE PROMISE KEEPERS | 2 | 67 -> 75 | 33 -> 37 | 3 -> 5 | 44% | 6.7 (was 0) |
| THE DESERTERS | 3 | 88 -> 93 | 67 -> 67 | 28 -> 42 | 61% | 11.4 (was 0) |
| THE RAIDERS | 4 | 98 -> 100 | 88 -> 98 | 70 -> 88 | 64% | 13.7 (was 0) |
| THE LAB RATS | 3 | 82 -> 95 | 63 -> 75 | 27 -> 45 | 68% | 11.6 (was 0) |
| THE FAITHFUL | 4 | 95 -> 100 | 78 -> 97 | 62 -> 77 | 69% | 15.2 (was 0) |
| THE DEBT COLLECTORS | 6 | 100 -> 100 | 98 -> 100 | 92 -> 98 | 63% | 13.4 (was 0) |
| THE HUNTERS | 3 | 80 -> 93 | 65 -> 68 | 30 -> 30 | 72% | 11.1 (was 0) |
| THE FIGHT PIT | 3 | 93 -> 98 | 68 -> 87 | 48 -> 45 | 70% | 11.3 (was 0) |
| THE LONE WOLF | 1 | 15 -> 40 | 0 -> 3 | 0 -> 0 | 52% | 3.1 (was 0) |

Read: the guns win as often or more in 43 of 45 cells; the two where they do not are two fights in 60 (the water truck's 2 against 2, 60 -> 57; the fight pit's 3 against 4, 48 -> 45). The two-man origins (the water truck, the promise keepers) and the lone wolf stay hard past two thugs: Battle Brothers marks them hard origins, and the job math gives a fresh crew of two a band of two at one skull.

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
