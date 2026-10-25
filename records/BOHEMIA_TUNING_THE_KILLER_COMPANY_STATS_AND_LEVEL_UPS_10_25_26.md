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

## 2. THE ENDGAME COMPANY THOSE RULES MAKE (computed, not remembered)
tools/bohemia_tuning_the_killer_company.js --lines rolls his shape 2,000 times a cell the wiki's way: each man inside his own background's range,
exactly three starred stats at 60/30/10, every attribute rolled each level on its star column, the player taking his plan's picks; veterans
+1 on three. The nine in front are the backgrounds a late Battle Brothers company is built from (two hedge knights, two sellswords, two
gladiators, a retired soldier, a militiaman, a brawler); the three shooters a hunter, a sellsword and a poacher. "Any" is stars where the dice
put them; "kept" is a man whose three stars sit on his plan (the one he kept out of the many he saw: a bound, the killer premise).

HIS OLD PLAN, THREE PICKS (front: melee skill, melee defence, fatigue; back: ranged skill, fatigue, hitpoints), the average man:

      who, level, stars       hitpoints  fatigue  resolve  melee skill  ranged skill  melee def  ranged def
      front, level 1             57        98       41        62           42            8          6
      front, 11, any             57       131       41        84           42           30          6
      front, 11, kept            57       135       41        89           42           35          6
      front, 16, kept            57       140       41        94           42           40          6
      back, level 1              55        97       37        56           51            5          5
      back, 11, any              88       130       37        56           83            5          5
      back, 11, kept             92       135       37        56           88            5          5

THE CHECK THAT THE BENCH IS POINTED RIGHT: a player on r/BattleBrothers calls "about 90 melee attack and 40 melee defense by lvl 11... solid late
game frontliner material" (web search, a Reddit comment; anecdotal, version unknown). The wiki's rules, rolled, put his kept frontliner at 89
and 35 at level 11 and 94 and 40 at level 16. Battle Brothers' own dice make the man players call a killer, so the numbers below are the
real game's, not a guess.

WHAT HIS OLD PLAN NEVER TOUCHES: ranged defence. It sits at 5 or 6 on all twelve men at level 1, 11 and 16. In Battle Brothers that is a choice
a good player makes on purpose: the late brigands the fight dresses (day 80) are two shooters in ten, and a shield's +15 does the rest.

WHAT FATIGUE BUYS (why his nine raise it every level): a man's breath is his fatigue less what his kit weighs (the fight's own fatMax). The late
kit on a shield man weighs 63 (reinforced mail 26, bascinet 13, winged mace 10, heater 14), on a hammer man 57, on a shooter 51; the endgame
kit (coat of scales 38, full helm 20) weighs 82, 76 and 70. A turn gives back 15, a mace's Bash costs 13, a hammer's Smite 15.

      front shield man       late kit (63)    endgame kit (82)
      level 1 (98)            35 left           16 left: one swing, then he stands
      level 11, old plan      68 left           49 left
      level 11, fatigue
        traded for ranged
        defence (98)          35 left           16 left: one swing, then he stands

So with THREE picks, "care about ranged defence" can only be paid out of fatigue, and a front without fatigue cannot wear the heavy armour.
That is the trade his words describe, measured: three picks cannot hold his old plan AND ranged defence at once. Piece 3 plays it.

## 3. WHEN OUR ENDGAME COMES (the XP, from the live data)
The fight pays XP the wiki's way (rules.json: the killer 20, the party 80, all of it less 15), and the map sizes a job by the company
(party_math.json: one enemy per 10 points of the 12 strongest at 10 + 2 a level, x0.8 / x1.0 / x1.3 by skulls, capped at 13). The
brigands the fight dresses are worth 150 (thug) to 375 (leader) XP each (enemies.json), about 170 a man early and 262 late on the
fight's own mix. So a twelve-man company earns about 145 XP a man a fight early and about 240 late (13 x 262 x 0.85 / 12). Level 11
(15,000) comes at about fight 80, level 16 (45,000) at about fight 200. An act is a year (rule 84: 300 to 450 days); at a fight every
two or three days that is 100 to 220 fights. THE ENDGAME COMPANY IS LEVEL 11 TO 16, inside one act. The bench tests both.

## 4. OUR NUMBERS ON THE LIVE FIGHT (tools/bohemia_tuning_the_killer_company.js --fights)
THE TEST: his twelve, rolled the wiki's way under each level rule, handed to the live fight with their chosen stats exactly the way the
roster hands them (engine/bohemia_roster.js company(): 'every man fights as his card says', RUN TWO's rule 162(e) round), in the late
kit (reinforced mail, bascinet with mail; winged mace and heater shield, two-handed hammer, heavy crossbow) and the endgame kit (coat of
scales, full helm), both sides on the fight's own brain, against: THE LATE BRIGANDS as the fight dresses them on day 80 (two shooters
in ten), A GUN LINE (half of them shoot: a crew that fights like ours, rule 120), and the kids (goblins: bolas and nets), at 13 (the
map's cap), 20, 30 and 40. 100 seeded fights a cell; every rule meets the same fights. The control: the stats the bench hands are the
stats the fight's unit carries (melee skill 83 handed, 83 in the fight; ranged defence 1 and 1), and the attack event is read where
the fight writes it (id the striker, shot for a ranged blow). The level rule is the ONLY thing that moves between rows.

### 4a. THE FLOOR AND BATTLE BROTHERS' THREE PICKS (level 11, late kit unless named; per fight: won in 100, men struck down, dead in 100 fights)

      the fight                          no level-ups at all          his old plan, three picks      what it buys
      12 v 13 brigands (the map's cap)   88, 3.15 down, 59 dead       99, 0.38, 6                    the level-ups are the game
      12 v 20 brigands                   21, 10.4, 188                97, 1.43, 37
      12 v 30 brigands                    0, all 12 down              67, 6.22, 119
      12 v 30 brigands, ENDGAME kit       0                           88, 3.08, 67                   the heavy kit pays, if he can carry it
      12 v 40 brigands, ENDGAME kit       0                           53, 7.26, 123
      12 v 20 the GUN LINE               45, 8.66, 178               100, 2.13, 46
      12 v 30 the GUN LINE                0                           77, 5.86, 119
      12 v 40 the GUN LINE                0                           30, 9.62, 166
      12 v 40 the kids                   95, 1.69, 28                100, 0.13, 1                   the goblins are easy for everyone
    Their shots land 24 in 100 on his old plan against the gun line at 20 (ranged defence 5 or 6 on all twelve); their swings 24.
    Unstoppable it is not: three picks and his old plan lose a man to death in four of every ten hard fights past 20.

### 4b. THE THREE-PICK DILEMMA, MEASURED: ranged defence can only be paid out of fatigue

      the fight                          his old plan (fatigue)      ranged defence for fatigue     who wins the trade
      12 v 20 the GUN LINE               100, 2.13 down, 46 dead     100, 0.63, 10                  RANGED DEFENCE, by far
      12 v 30 the GUN LINE               77, 5.86, 119               98, 2.27, 45                   RANGED DEFENCE: 77 -> 98 won
      12 v 40 the GUN LINE               30, 9.62, 166               59, 7.22, 133                  ranged defence
      12 v 30 brigands, late kit         67, 6.22, 119               64, 6.26, 115                  a wash
      12 v 30 brigands, ENDGAME kit      88, 3.08, 67                33, 9.24, 186                  FATIGUE, by far: 88 -> 33 won
      12 v 40 brigands, ENDGAME kit      53, 7.26, 123                9, 11.4, 210                  fatigue
    Ranged defence 39 cuts THEIR SHOTS from 24 to 8 in 100 (the gun line at 20) and from 19 to 7 at 30. But a front left at 98 fatigue
    in the endgame kit begins half his turns spent (50 to 72 in 100 turns against 9 to 35 on the old plan): he cannot swing.
    THAT IS HIS SENTENCE IN NUMBERS: against guns the best team needs ranged defence, the heavy armour needs the fatigue, and three
    picks a level cannot hold both. 'We might just have to give more points' is right; 4c measures how many.

### 4c. MORE POINTS A LEVEL, MEASURED (level 11; won in 100, men struck down a fight, dead in 100 fights)
'four' is his old plan plus ranged defence (front: melee skill, melee defence, fatigue, ranged defence; back: ranged skill, fatigue,
hitpoints, ranged defence): his shape exactly. 'four, hitpoints' spends the fourth on hitpoints in front and resolve behind, no ranged
defence (a side run on the same cells). 'five' is four plus hitpoints in front and resolve behind. ('Three picks plus ranged defence
rising by itself' rolls the same men as 'four' and 'four plus ranged defence by itself' the same as 'five'; each pair was played once.)

      the fight                          three (BB)        four               four, hitpoints     five
      12 v 30 the GUN LINE               77, 5.86, 119     98, 1.33, 20       98, 2.98, 53        100, 0.53, 13
      12 v 40 the GUN LINE               30, 9.62, 166     85, 4.07, 65       (not played)        97, 1.71, 35
      12 v 30 brigands, late kit         67, 6.22, 119     88, 3.50, 63       85, 3.79, 65        93, 2.11, 35
      12 v 30 brigands, ENDGAME kit      88, 3.08, 67      93, 1.93, 40       98, 2.03, 40        98, 1.11, 21
      12 v 40 brigands, ENDGAME kit      53, 7.26, 123     75, 4.69, 88       (not played)        85, 3.18, 60
      12 v 20 the gun line, LEVEL 16     100, 1.74, 34     100, 0.15, 1       (not played)        100, 0.09, 2
      12 v 20 the gun line, STARS KEPT   100, 1.82, 30     100, 0.36, 6       (not played)        100, 0.18, 0
      MIDDLE OF THE GAME, level 6:
      12 v 13 brigands                   96, 1.80, 39      98, 1.25, 23       (not played)        98, 1.07, 21
      12 v 13 the gun line               100, 1.36, 19     100, 0.60, 9       (not played)        100, 0.52, 9
    Their shots land 19 in 100 on three picks against the gun line at 30 and 7 on four. The fourth pick on hitpoints instead of
    ranged defence wins the brigands in heavy kit (98 against 93) and loses twice the men to the gun line (2.98 down against 1.33):
    THE FOURTH PICK IS A REAL CHOICE, and the guns decide it the way he said they would.

### 4d. RESOLVE, MEASURED (rule 162(d): 'the rolls on resolve, whether they flee or not')
      the fight                          his old plan      resolve behind only    resolve in front (front's fourth pick)
      12 v 13 ghosts (the scream)        5.19 ran a fight  4.53                   1.05
      12 v 20 ghosts                     10.91 ran, 14.1   10.36, 12.8 rounds     3.01 ran, 4.5 rounds
                                         rounds
      12 v 30 brigands, late kit         (five) 1.04 ran, 93 won                  0.04 ran, 98 won
    The geists' Horrific Scream is four morale checks against resolve (the fight's own scream()). With his old plan nearly all
    twelve break against twenty of them and the fight takes three times as long; a front that took resolve as its fourth pick
    holds. Resolve rolls 2-4 a level (4-5 with three stars): over ten levels that is 33 more resolve on a front of 41, which is
    the difference between running and holding. HIS MEMORY IS RIGHT, AND IT IS A FOURTH-PICK THING: against screamers and big
    hordes, resolve; against guns, ranged defence; against heavy hitters, hitpoints.

## 5. THE NUMBERS (draft; research only, nothing wired by this lane; rows in the one table, section F)

THE PICK: FOUR ATTRIBUTES A LEVEL, chosen by the player from all eight rolled, Battle Brothers' way (one more than its three).
 - Why four: his shape plus ranged defence on all twelve is exactly four stats a level (front: melee skill, melee defence, fatigue,
   ranged defence; back: ranged skill, fatigue, hitpoints, ranged defence), and four builds it by level 11 (front 84 / 30 / 131 / 39,
   back 83 / 130 / 88 / 38 with the stars where the dice put them). On the live fight that company wins 98 in 100 against thirty men
   of whom half shoot, with 1.3 men struck down a fight: the killer company. It still loses one fight in seven against forty shooters and one in four against forty brigands in heavy kit: not a god.
 - Why not five: five is nearly invincible (97 in 100 against forty shooters, 1.7 down) and leaves nothing to choose: the front's five
   are the same five every level and the only decision is the sixth. 'In Battle Brothers you had to really prioritise' dies at five.
   Four keeps one real choice every level (ranged defence, hitpoints or resolve) and the fight shows each one winning somewhere.
 - Why not three plus ranged defence rising by itself: the same numbers, but the game makes the choice for him. Rule 162(a) keeps
   the min-max.
 - The rolls stay Battle Brothers' own, star for star (2-4 / 3-4 / 4 / 4-5 for ranged defence, hitpoints, fatigue, resolve, ranged
   skill; 1-3 / 2-3 / 3 / 3-4 for melee skill and defence; 3-5 / 4-5 / 5 / 5-6 initiative). RANGED DEFENCE IS WEIGHTED FOR GUNS BY THE
   FOURTH PICK, NOT BY A BIGGER ROLL: its roll is already a secondary stat's, and 39 at level 11 cuts their shots from 24 to 8 in 100.
   A bigger roll on top would count the guns twice.
 - Veteran levels (12 to 33): +1 on FOUR stats, no perk point (Battle Brothers: +1 on three). The cap stays 33, the XP table stays.
 - Perks: one point a level to 11, unchanged.
 - Stars at hire: EXACTLY THREE starred stats at 60/30/10, the founding crew too (engine/bohemia_roster.js manOf still gives one to
   three, uniformly: TUNING's 10/10 departure D1, still open; the hall already gives three). A man is a killer by his stars: with his
   stars on his plan the four-pick front reaches 89 / 35 / 135 at level 11.
 - Resolve: no new rule; it is in the picks, and 4d shows when he wants it.

WHAT THE MAP DOES TO THE TEST (named for WORLD, COMBAT and RUN, not decided here): party_math caps a job and a roaming party at 13.
Against 13 every level-11 company here wins 99 or 100 with under 0.4 down, on three picks or four. So the killer company is only tested
by the fights past 13 (the crisis, three parties at once, rule 79's big board). Without them the endgame company has nothing to be
killer against.

WHERE IT IS READ: RUN TWO's level-up (engine/bohemia_roster.js levelUp: pick = rules.json per_level.attributes_raised, 3; veterans
veteran_level_rules.stats, 3) would read the two new rows instead; the fight already fights every man as his card says
(company().stats, rule 162(e)), so nothing in the fight moves.

