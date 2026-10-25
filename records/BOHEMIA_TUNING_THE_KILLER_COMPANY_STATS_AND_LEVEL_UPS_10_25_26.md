# TUNING -- [the killer company: stats and level-ups] WHAT AN UNSTOPPABLE COMPANY IS MADE OF (10/25/26)
# Row: VAMILY TUNING [the killer company: stats and level-ups] (rule 162, research only, rule 38g; no card, the page and the table rows are the report).
# His words, 10/24 (records/BOHEMIA_PAOLO_THE_KILLER_COMPANY_STATS_AND_LEVEL_UPS_10_24_26.md): 'three people with the gun in the back line... ranged
# attack, melee attack and fatigue/health... the nine other people... fatigue, melee attack and melee defense... now you gotta care a lot more
# about range defense... we might just have to give more points... the rolls on resolve mattered.'
# Sources: the wiki in the library (reference/library/grok/wiki/PAGES_ALL.tar.gz: bb_all/1165_Level and Experience, 1926_Talents, 0160_Attributes,
# 0424_Combat Mechanics, 1316_Morale, 0838_Gifted, 0285_Brawny, 0117_Anticipation), records/target/bb/rules.json's experience block (already quoted
# line for line), records/target/bb/backgrounds.json, enemies.json, the live roster (engine/bohemia_roster.js) and the live fight
# (slices/BOHEMIA_FIGHT.html), played headless by tools/bohemia_tuning_the_killer_company.js. Web for the player benchmarks, named where used.
# Written in pieces, committed as each lands (the coordinator's 15-minute cadence).

## 1. BATTLE BROTHERS' LEVEL-UP, EXACTLY (every number from the wiki page named)

AT HIRE (Talents)
- Eight attributes: hitpoints, fatigue, resolve, initiative, melee skill, ranged skill, melee defence, ranged defence.
- Exactly THREE of the eight carry stars, at random, "without any connection to a background or trait" (a few backgrounds are barred from a few
  stars). Each starred one is 1 star 60%, 2 stars 30%, 3 stars 10%. The one exception in the whole game: the Northern Raiders' monk, three stars
  in resolve and none anywhere else.
- His starting numbers are rolled inside his background's range (the Apprentice row is the shared base: hitpoints 50-60, fatigue 90-100,
  resolve 30-40, initiative 100-110, melee skill 47-57, ranged skill 32-42, melee defence 0-5, ranged defence 0-5; every other background adds
  its modifiers on top).

EACH LEVEL, 2 TO 11 (Level and Experience; Talents)
- "With each level your brothers gain they receive a perk point and can increase three different attributes."
- The game rolls a gain for every attribute and shows it; the player picks THREE of the eight. The roll's range is set by that attribute's stars:

      attribute                     0 stars  1 star  2 stars  3 stars    average gain a level (0 / 1 / 2 / 3)
      hitpoints, fatigue, resolve,   2-4      3-4     4        4-5        3.0 / 3.5 / 4.0 / 4.5
      ranged skill, ranged defence
      initiative                     3-5      4-5     5        5-6        4.0 / 4.5 / 5.0 / 5.5
      melee skill, melee defence     1-3      2-3     3        3-4        2.0 / 2.5 / 3.0 / 3.5

  ("1 star increases the minimum by 1, 2 stars by 2 and 3 stars also increase the maximum by one.")
- So ten level-ups are THIRTY raises. The wiki's own tip: "for stats you will always level up... each star will add 5 points by level 11 on
  average"; a man with no star who starts 5 higher is the same man as one with a star.
- The XP to reach each level: 2:200 3:500 4:1000 5:2000 6:3500 7:5000 8:7000 9:9000 10:12000 11:15000.

PAST 11, THE VETERAN LEVELS (Level and Experience)
- Each level above 11 costs 4000 + 1000 x (level - 11) more XP (12 at 19,000 total, 13 at 24,000, 14 at 30,000, 15 at 37,000, 16 at 45,000),
  gives NO perk point, and "the stat rolls are reduced to a maximum of +1 for three stats". The cap is 33 (it was 42 before Warriors of the North).

THE PERKS THAT ARE REALLY STAT POINTS (the perk pages)
- Gifted: "instantly gain a levelup... with maximum rolls but without talents" (one more level's three picks, each at its no-star top: 4, 4, 3).
- Colossus: +25% hitpoints. Fortified Mind: +25% resolve. Brawny: the fatigue and initiative cost of armour and helmet cut by 30%.
- Anticipation: against a shot, 1 + 10% of BASE ranged defence per tile to the shooter, never under +10. (The only perk built on ranged defence.)

THE TWO RULES THAT DECIDE WHAT A POINT IS WORTH (Combat Mechanics; Morale)
- Defence is "subject to diminishing returns stat-wise at values beyond 50: each Melee Defense attribute point over 50 is halved." So the 51st
  point of defence buys half what the 50th did; a killer's defence is worth building to 50 and expensive past it.
- A morale check is a roll against resolve: "Resolve is the base chance to succeed. The maximum chance to succeed is 95%." Every point of resolve
  is one more in a hundred that a man holds when a friend falls, a big hit lands or he is surrounded; that is his 'whether they flee or not'.
- Ranged defence is the forgotten stat in Battle Brothers: a recruit starts at 0 to 5, a sellsword or a retired soldier at 5 to 13, and the
  wiki's own Attributes page lists only shields, Shieldwall, Dodge and Anticipation as the ways to raise it. Players argue about it: one
  2018 Steam post calls Anticipation "a wasted pick" once Nimble was buffed, a 2017 post warns "even best unique helmets can't really protect
  from heavy crossbow bolts" (steamcommunity.com/app/365360/discussions/0/1743353798886310459, .../135512133545402508). In Battle Brothers the
  arrows are a minority of the enemy; in Bohemia the guns lead (rule 120). That is the whole reason this page exists.

PIECE 2 (the endgame company Battle Brothers' rules make, computed) AND PIECE 3 (our numbers, played on the live fight) FOLLOW.
