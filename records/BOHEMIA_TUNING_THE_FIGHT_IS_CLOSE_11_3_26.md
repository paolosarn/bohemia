# TUNING 2: THE FIGHT IS CLOSE (11/3/26; VAMILY rule 370, ask line 396; amends rule 351(c)(d) where they differ)

HIS WORDS (records/BOHEMIA_PAOLO_THE_FIGHT_IS_CLOSE_AND_STILL_FEELS_GOOD_11_3_26.md): "right now I'm just killing, I'm unstoppable...
the people have to be rare, and then I don't even fuck around and give them cheap equipment, like I just buy them [gear for] 21 and I'm
like I'm unstoppable, bro, nothing can stop me... even at the easiest difficulty [it] felt like I had difficulty... I don't even feel like
I get one shot anywhere... for all difficulties the tuning is so important, the numbers, how close things can get, but you still feel
good." He plays NEW HERE (the easiest), as a Lone Wolf.

## 0. THE ANSWER IN PLAIN WORDS
1. MEASURED BY CLOSENESS, NOT WINS (370(6)). The curve tool now reads every simulated fight for: won, men struck down, health left per
   man, near-deaths (a man who stood at a quarter of his health or less and lived), the share of enemy hits that took half a man, and
   fights where nobody went under half. Three companies (the Lone Wolf, a fresh company, HIS WAY: the Lone Wolf and the post's rare men
   in the cheapest kit), three levels, days 1, 5, 10, 20, 40, the routine job and the tough job, 20 fights a cell, 1,800 fights a table.
2. THE WALK HE FEELS IS ARMOUR. Any company in the shop's armour was untouchable from day 10: on the easiest level at day 20 to 40 the Lone
   Wolf's company won 100 in 100 with 96 to 97% of its health standing, nobody under half in 75 to 85 fights of 100, and the enemy's biggest
   blow took a tenth of a man. Rare men in the kit the post hands them (mail and a helmet) were untouchable early too (day 10: 99% of their
   health left). Rare men in the CHEAPEST kit (a stick, a padded coat, a cloth cap) were not a walk in the simulator: about two men down a
   fight at day 20. The causes, s3.
3. THE RETUNE, DATA ONLY (s4): NEW HERE fields the full crew (ours took 15% off on top of Battle Brothers' easiest aim; a small step past
   Battle Brothers' easiest, on purpose, rule 380 record s3); the two harder levels dress a strong company sooner; the late orcs and kids bring their champions more often, and the
   middle game's orcs and machines bring more of their heavy kind; the rare man is rolled in the top half of his range, not the top quarter; and on the
   armourer's shelf no worse piece costs more than a better one (30 pieces, nearly all costumes and the ancient sets).
4. WHAT MOVED (s5), the gate's pool (the three companies at days 10 and 20), on today's fight: NEW HERE's hardest job can be lost now (91
   in 100; main's numbers on the same fight 98) and costs about a man a fight (1.27; main 0.58); its everyday job sends a man down about every
   other fight (0.54; main 0.31) and leaves somebody under half in 36 fights of 100 (main 22). SEEN IT and OUTLIVED IT stand where main
   stands at days 10 and 20; their sooner dress bites from day 22 and 18 on. COMBAT 7's rule 366 enemy (it wants to live, a losing side
   breaks) landed in the same hour and softened SEEN IT's tough job on main's own numbers (94 -> 98 in 100, 1.12 -> 0.82 men down).
5. THE BIGGER LEVERS ARE PINNED, SAID (s7): SEEN IT at Battle Brothers' own aim and twice the middle game's marauders put cost on every
   company, and dropped WORLD's typical company (most_jobs_fit_the_company_gate, rule 192) from 65 to 10 in 100 on its day-20 two-skull job
   (the gate asks 60), because that tool's men fight with level-1 numbers at level 3 and 8 while the game climbs every man (rule 162(e)).
   Not shipped; ROUTED to WORLD. A 12-man company in city armour still walks its routine jobs on NEW HERE, because the enemy spreads its blows
   and no armour breaks: the cure is the enemy picking a target (COMBAT 7, rule 366), or more than 13 men a job (rule 75b says no).
6. THE GATE (s6): gates/the_fight_is_close_gate.js, in the suite as THE FIGHT IS CLOSE, 12/0 on today's fight: the bands per level on the live fight (20
   fights a cell, reproducing the committed bank), price is power, one-shot fear in every phase, the hardest start not hell, and proof the
   bands fail the game he played.

## 1. THE MEASURE (tools/bohemia_difficulty_the_curve.js --close; the live fight headless, AUTO both sides, seeded; draft:true banks)
- THE FIGHT: slices/BOHEMIA_FIGHT.html's own fight-data and fight-rules (exactly the files its loadAll() reads), the map's job math line for
  line (partyMath 'job': Battle Brothers' contract multiplier on the roster's strength, the skulls, the level's count, dressed for the day
  the company's strength stands for, never further ahead of the calendar than the level allows), AUTO on both sides.
- THE COMPANIES (a growth line, said plainly; the fights do not feed back into who he hires), EVERY MAN CLIMBS: his level-ups taken on his
  stars and his plan (engine/bohemia_roster.js levelUp's own columns, rules.json stat_gains_by_stars, recruit_ceiling.json plans; the roster
  hands the fight every man's chosen stats, rule 162(e)), the one thing the DIFFICULTY round's tool did not do (its level-9 Lone Wolf
  fought with his level-4 numbers).
  LONE WOLF: the door's roll (engine/bohemia_origin_start.js 'wolf': the level-4 hedge knight in his door kit), alone to day 5, ten men by
  day 20, twelve by 30; hires in the town's armour (mail hauberk, padded flat top) from day 10, the city's (reinforced mail, bascinet) from
  day 20 (DIFFICULTY's line, kept for comparison: a rich player). FRESH COMPANY: A New Crew's three companions as the door rolls them,
  twelve by day 40, the town's armour from day 20, the city's from 40. HIS WAY: the Lone Wolf in his kit and every hire one of the post's
  rare men (records/target/bb/rare_recruits.json: road knight, gun for hire, blade master, rolled as the post rolls them, level 2 or 3 and
  climbing), each in THE CHEAPEST KIT of his kind (the bottom row of his weapon's class, a car door if he carries a shield, padded_surcoat
  and aketon_cap: about 21 batteries a man), never upgraded. --own-kit dresses them as the post does instead (s3.4).
- THE JOBS: the routine one (one skull to day 3, then two) and the tough one (two skulls to day 3, then three); factions in turn
  (brigands twice, machines, kids, heavies).
- THE READS, per fight: won; men struck down (down or dead); health left (each man's health over his whole, a man down 0); the worst
  man's health; near-deaths; big hits (the enemy's landed hits that took half of the man's whole health or more, over all their landed
  hits); the biggest single hit; fights where nobody went under half health; rounds.

## 2. BEFORE (banks/BOHEMIA_TUNING_THE_FIGHT_IS_CLOSE_BEFORE_11_3_26.json, the data as it stood at 53d99a20)
Pooled over the three companies at days 10 and 20 (won / men struck down a fight / fights where nobody went under half / health left / big
hits): NEW HERE routine 98 / 0.37 / 78 / 92% / 10%, tough 98 / 0.56 / 60 / 87% / 10%; SEEN IT routine 99 / 0.59 / 65 / 88% / 11%, tough
94 / 1.12 / 51 / 77% / 10%; OUTLIVED IT routine 92 / 1.29 / 51 / 76% / 13%, tough 68 / 2.96 / 28 / 51% / 14%. The full tables are in s5.

## 3. WHY: OUR NUMBERS AGAINST BATTLE BROTHERS' (the library: reference/library/grok/wiki/PAGES_ALL.tar.gz; our rows: records/target/bb/)
THE LEVERS, named, biggest first.
1. ARMOUR WINS EVERY SPREAD FIGHT. Battle Brothers' damage rule, ours exactly (rules.json damage, bb_all/0504_Damage.txt): a blow takes
   only base x armour-ignore minus a tenth of the armour left from health, and the rest from the armour; only once the piece is gone does
   the full blow land. So 210 armour turns a raider's longaxe (70 to 95) into 3 or 4 health a blow until three blows break it. Our enemy
   brain spreads its blows (8 to 13 landed a fight on twelve men in the before table), so no piece breaks and nobody bleeds: the armoured
   company's health left was 96 to 98% at every day from 10 on. In Battle Brothers the late company meets 20 to 30 men; ours meets 13 at
   most (party_math.json job.max, rule 75b 'never twelve against twelve') and the heavies and kids fewer (count_scale 0.45, 0.6). MEASURED:
   job.max 13 -> 16 changed only day 40 and the armoured company on NEW HERE still won 100 with 93 to 97% of its health; not shipped.
2. THE EASIEST LEVEL STACKED TWO GIFTS. NEW HERE carried Beginner's 5 points of aim (ours.json hit_roll_shift, 'On
   Beginner combat difficulty player gets 5 points lower (better) to hit rolls and enemies get 5 points worse ones', bb_all/0828_Game
   Mechanics.txt) AND took 15% off every crew (party_math.json difficulty_count_mult 0.85). CORRECTED 11/3 (rule 380 record s3): an earlier
   line here said Battle Brothers' Beginner never shrinks a crew; the wiki says Beginner brings 'easier groups later' and Expert 'harder enemy
   groups appear sooner' (count and tier, GROK_60), so its easiest may well field fewer. Ours now sends NEW HERE the full crew ON PURPOSE, a
   small step harder than Battle Brothers' easiest, because his newest words are that even that one bit and ours did not (rule 370(1)). SEEN IT carries Beginner's aim too (rule 117(a), 'easier than Battle Brothers'); Battle Brothers' Veteran
   is 0.
3. THE ENEMY DID NOT KEEP UP. The first week was thugs alone (ours.json enemy_tiers first: {thug 1}); the library says 'Thugs and sometimes
   Raiders' (bb_all/0299_Brigands.txt). The middle game held one marauder in eleven (the page: 'armored Marauders can spawn' as raiders
   grow common). The late champion was one man in 21 among the brigands and one in 11 to 14 among the kids and orcs, where the page puts 'a
   Brigand Leader and other elite enemies' in most late groups; a strong company met the late men about day 28, 25 and 20 by level.
4. RARE MEN WERE GODS ON PURPOSE. rare_recruits.json rolled the rare man in the TOP QUARTER of his background's range (stat_floor 0.75,
   10/25 'god-tier') with three talents and his levels; Battle Brothers rolls a hedge knight in his whole range (bb_all/0973_Hedge Knight
   (Background).txt: hp 62-73, melee skill 58-67, melee defence 6-10) and the post shows one 2.2 to 8.3% of the time (bb_all/0370). The road
   knight's own kit is a mail hauberk (150) and a nasal helmet with mail (200): in it he is the armoured company of lever 1 (measured with
   --own-kit: his way on NEW HERE at day 10 won 100 with 99% of its health).
5. THE LONE WOLF'S KIT IS BATTLE BROTHERS' ENDGAME ON DAY ONE. The door rolls him reinforced mail to a coat of plates (210 to 320) and a
   closed flat top with mail or a full helm (230 to 300) (origins.json wolf door; 10/25 'a gilded god', Battle Brothers' 'great equipment').
   A day-one thug's best blow on him is 1 health (the floor, ours.json hit_floor_hp): his day 1 read 'max 1%' on every level. Kept (his own
   ruling). 'Thugs and sometimes Raiders' in the first week would have given the first fights a two-hander that dents plate; COMBAT's rule
   120(a) keeps that week thugs alone (s4, tried).
6. CHEAP GEAR, MEASURED: cheap ARMOUR does not win. Padded surcoat (50) and an aketon cap (40) take a thug's goedendag (45 to 75) to a third
   of a 60-health man on the first blow and nothing holds after the coat is gone; mail (150) holds the same blow to 6%. His way in the
   cheapest kit lost 1.75 to 4 men a fight at day 20 to 40 before this round. The cheap thing that out-hits its price is THE PISTOL: a knife
   (30 crowns, 3 batteries) fires as Battle Brothers' crude javelins (ours.json pistol_shot: 30 to 40 damage, 45% through armour), a bundle
   the library prices at 150; the dagger (180) fires the 200-crown bundle. Named, not moved (s7).
7. PRICE TO PROTECTION. Battle Brothers' shelf climbs steeply (a padded surcoat 50 armour for 90 crowns, a mail hauberk 150 for 1,000, a coat
   of scales 300 for 6,000: three times the armour for eleven times the price, then twice for six), and that curve is kept. What broke 'price
   is power' was 30 pieces that cost MORE than a piece of their slot holding as much and weighing no more: costumes and event clothes priced
   for their story (the Noble Tunic, 100 crowns for 20 armour, beside the Undertaker's Apron, 65 for 30), the ancient and decayed sets, and
   three of our own armory pieces (the football pads, the football helmet, the welding mask).
8. ONE-SHOT FEAR WAS IN THE ROWS, NOT IN THE FIGHTS. A thug's goedendag at its best takes 125% of an unarmoured 60-health man, a raider's
   pike 133%, a marauder's executioner's sword 183%, the marksman's scoped deer rifle 108% (162% to the head). Against mail the share falls
   to 0 to 39%, and with the blows spread an armoured company never met one: 0 to 2% of the landed blows took half a man.

## 4. THE RETUNE (TUNING's one table; every row carries its amended_11_3 note)
1. party_math.json difficulty_count_mult [0.85, 1, 1.15, 1.3] -> [1, 1, 1.15, 1.3]: NEW HERE's crews as the math sends them, a small step
   harder than Battle Brothers' Beginner on purpose (370(1), newest over rule 117's 'the party at 0.85'). NEW HERE keeps Beginner's aim.
2. party_math.json job_bb.dress_ahead.mult [2.5, 3, 4] -> [2.5, 3.5, 4.5]: a strong company meets the late men (dress day 60) about day 28
   on NEW HERE, 22 on SEEN IT, 18 on OUTLIVED IT (was 28, 25, 20), so the three levels stay apart now that NEW HERE fields the full crew;
   the difficulty_levels say lines say so (draft:true).
3. ours.json enemy_tiers.mix.heavies.late champion 0.3 -> 0.8; kids.late champion 0.3 -> 0.6: one man in six of a late orc or kid crew
   (Battle Brothers' champions, bb_all/0363: 'stronger versions of enemies that always have a named item'). And the middle game's orcs
   {warrior 2, young 2} -> {3, 2} and machines {robot 3, plated robot 1} -> {2, 2}: the heavier kind grows as the game does, in the factions
   WORLD's typical company never meets (measured: it did not move SEEN IT's tough job, 97 and 0.92; kept for the fights it does touch).
4. rare_recruits.json stat_floor 0.75 -> 0.5: the rare man in the top half, still above any lowborn at what matters (370(4)).
5. armor.json: 30 pieces lowered to five crowns under the cheapest piece of their slot that holds at least as much and weighs no more
   (tools/bohemia_tuning_price_is_power.py; Battle Brothers' crowns kept on each row as wiki_value). Nothing anybody buys for its armour got
   dearer; the shields broke nothing.
6. records/target/bb/roster.json regenerated by its own tool (tools/bohemia_combat_the_roster.py) after the mix moved: THE BESTIARY 10/0
   (it was 9/1 on main, the roster stale since the beasts' late mix lost the schrat).
TRIED AND NOT SHIPPED (measured): (a) SEEN IT at Battle Brothers' Veteran aim (hit_roll_shift [5, 0, 0, -5]) with the middle game's
marauders doubled and the late game's marauders 4 and champion 1.5: every armoured company paid (SEEN IT's at day 20 lost 2.5 men a routine
fight, was 0.05), and WORLD's typical company won its day-20 two-skull job 10 to 50 in 100 (most_jobs_fit_the_company_gate asks 60; s7).
(b) The late phase from dress day 50 with a faster dress: the late men at day 17 to 21 and his way won its day-20 routine job 55 to 60 in
100 on the two harder levels, a slaughter. (c) job.max 16: day 40 only, and rule 75b. (d) The first week as 'Thugs and sometimes Raiders' (bb_all/0299_Brigands.txt) as {thug 12,
lower raider 1}: COMBAT's rule 120(a) builds the first week's band to be shot at, thugs alone, the lesser raider from day 8
(guns_from_the_first_fight_gate leg 4, 'THE FIRST BAND IS BUILT TO BE SHOT AT'): not shipped.

## 5. BEFORE AND AFTER (banks/..._BEFORE_ and _AFTER_11_3_26.json; the same tool, seeds and companies; BEFORE is the data and the fight he
## played, 53d99a20; NOW is this round's data on today's fight, 290226409, COMBAT 7's rule 366 enemy and kill cams in it)
Each cell: won in 100 / men struck down a fight / fights in 100 where nobody went under half / big hits (the share of their landed hits that
took half a man). Bold is now.

LONE WOLF (alone to day 5, then hires in the shop's armour from day 10)
won in 100 / men struck down a fight / fights in 100 where nobody went under half / big hits (the share of their landed hits that took half a man)
| level | day | ROUTINE before | ROUTINE now | TOUGH before | TOUGH now |
|---|---|---|---|---|---|
| NEW HERE | 1 | 100 / 0 / 100 / 0% | **100 / 0 / 100 / 0%** | 100 / 0 / 100 / 0% | **95 / 0.05 / 95 / 4%** |
| NEW HERE | 5 | 70 / 0.3 / 70 / 2% | **55 / 0.45 / 45 / 2%** | 65 / 0.35 / 65 / 2% | **40 / 0.6 / 40 / 2%** |
| NEW HERE | 10 | 100 / 0.05 / 95 / 2% | **100 / 0 / 95 / 0%** | 100 / 0 / 100 / 0% | **95 / 0.3 / 75 / 5%** |
| NEW HERE | 20 | 100 / 0.1 / 85 / 2% | **100 / 0.1 / 80 / 1%** | 100 / 0.1 / 85 / 1% | **100 / 0.3 / 75 / 5%** |
| NEW HERE | 40 | 100 / 0.15 / 85 / 0% | **100 / 0.5 / 70 / 2%** | 100 / 0.2 / 75 / 0% | **100 / 0.4 / 60 / 0%** |
| SEEN IT | 1 | 100 / 0 / 100 / 0% | **100 / 0 / 100 / 0%** | 100 / 0 / 95 / 0% | **100 / 0 / 95 / 0%** |
| SEEN IT | 5 | 50 / 0.5 / 50 / 1% | **50 / 0.5 / 50 / 1%** | 40 / 0.6 / 30 / 2% | **35 / 0.65 / 25 / 2%** |
| SEEN IT | 10 | 100 / 0 / 100 / 0% | **100 / 0 / 100 / 0%** | 95 / 0.2 / 85 / 2% | **100 / 0.15 / 80 / 1%** |
| SEEN IT | 20 | 100 / 0.05 / 85 / 1% | **100 / 0.05 / 90 / 0%** | 100 / 0.1 / 85 / 0% | **100 / 0.05 / 85 / 0%** |
| SEEN IT | 40 | 100 / 0.15 / 75 / 1% | **100 / 0.2 / 75 / 0%** | 100 / 0.25 / 75 / 0% | **100 / 0.3 / 75 / 0%** |
| OUTLIVED IT | 1 | 95 / 0.05 / 95 / 3% | **95 / 0.05 / 95 / 3%** | 100 / 0 / 100 / 0% | **100 / 0 / 100 / 0%** |
| OUTLIVED IT | 5 | 45 / 0.55 / 45 / 2% | **40 / 0.6 / 40 / 2%** | 20 / 0.8 / 20 / 3% | **25 / 0.75 / 25 / 3%** |
| OUTLIVED IT | 10 | 100 / 0.05 / 85 / 1% | **100 / 0.05 / 90 / 1%** | 80 / 0.9 / 50 / 7% | **80 / 0.8 / 60 / 6%** |
| OUTLIVED IT | 20 | 100 / 0.9 / 60 / 5% | **100 / 1.6 / 50 / 7%** | 75 / 3.1 / 40 / 8% | **75 / 3 / 40 / 7%** |
| OUTLIVED IT | 40 | 100 / 0.2 / 80 / 0% | **95 / 0.85 / 70 / 1%** | 95 / 0.75 / 55 / 1% | **95 / 0.6 / 80 / 1%** |

FRESH COMPANY (A New Crew's three, twelve by day 40)
won in 100 / men struck down a fight / fights in 100 where nobody went under half / big hits (the share of their landed hits that took half a man)
| level | day | ROUTINE before | ROUTINE now | TOUGH before | TOUGH now |
|---|---|---|---|---|---|
| NEW HERE | 1 | 100 / 0.15 / 85 / 5% | **100 / 0.3 / 65 / 7%** | 90 / 0.65 / 40 / 12% | **90 / 0.55 / 40 / 12%** |
| NEW HERE | 5 | 90 / 0.55 / 55 / 12% | **85 / 1.2 / 45 / 14%** | 95 / 0.4 / 40 / 17% | **70 / 1.7 / 15 / 20%** |
| NEW HERE | 10 | 100 / 0.1 / 80 / 9% | **100 / 0.3 / 60 / 11%** | 100 / 0.3 / 45 / 10% | **95 / 0.95 / 35 / 17%** |
| NEW HERE | 20 | 100 / 0.05 / 85 / 3% | **100 / 0.45 / 65 / 4%** | 100 / 0.35 / 55 / 3% | **95 / 1.2 / 45 / 6%** |
| NEW HERE | 40 | 100 / 0.2 / 80 / 0% | **100 / 0.3 / 75 / 0%** | 100 / 0.45 / 55 / 0% | **100 / 0.35 / 55 / 0%** |
| SEEN IT | 1 | 95 / 0.5 / 65 / 13% | **100 / 0.3 / 70 / 11%** | 95 / 0.5 / 45 / 11% | **100 / 0.45 / 40 / 10%** |
| SEEN IT | 5 | 95 / 0.8 / 35 / 14% | **90 / 1 / 35 / 12%** | 80 / 1.7 / 15 / 15% | **85 / 1.5 / 10 / 13%** |
| SEEN IT | 10 | 100 / 0.3 / 55 / 11% | **100 / 0.3 / 55 / 6%** | 100 / 0.8 / 35 / 10% | **100 / 0.65 / 40 / 8%** |
| SEEN IT | 20 | 100 / 0.4 / 70 / 5% | **95 / 0.9 / 50 / 9%** | 80 / 2.4 / 45 / 12% | **90 / 1.4 / 45 / 9%** |
| SEEN IT | 40 | 95 / 1.4 / 60 / 2% | **95 / 1.1 / 60 / 2%** | 100 / 0.5 / 65 / 1% | **100 / 0.55 / 65 / 0%** |
| OUTLIVED IT | 1 | 95 / 0.55 / 60 / 15% | **95 / 0.55 / 60 / 15%** | 70 / 1.1 / 30 / 13% | **60 / 1.4 / 35 / 18%** |
| OUTLIVED IT | 5 | 80 / 1.4 / 15 / 19% | **75 / 1.6 / 20 / 20%** | 40 / 2.9 / 10 / 21% | **35 / 2.8 / 10 / 18%** |
| OUTLIVED IT | 10 | 90 / 1.3 / 35 / 27% | **95 / 1.1 / 25 / 25%** | 55 / 3.4 / 10 / 25% | **55 / 3.5 / 10 / 25%** |
| OUTLIVED IT | 20 | 95 / 0.9 / 65 / 5% | **90 / 1.4 / 50 / 9%** | 80 / 3 / 40 / 11% | **65 / 3.6 / 35 / 9%** |
| OUTLIVED IT | 40 | 95 / 1 / 75 / 1% | **95 / 0.95 / 70 / 1%** | 95 / 1.1 / 65 / 0% | **100 / 0.9 / 60 / 0%** |

HIS WAY (the Lone Wolf and the post's rare men in the cheapest kit)
won in 100 / men struck down a fight / fights in 100 where nobody went under half / big hits (the share of their landed hits that took half a man)
| level | day | ROUTINE before | ROUTINE now | TOUGH before | TOUGH now |
|---|---|---|---|---|---|
| NEW HERE | 1 | 100 / 0 / 100 / 0% | **100 / 0 / 100 / 0%** | 100 / 0 / 100 / 0% | **100 / 0 / 100 / 0%** |
| NEW HERE | 5 | 70 / 0.3 / 70 / 2% | **60 / 0.4 / 50 / 2%** | 65 / 0.35 / 65 / 2% | **40 / 0.6 / 40 / 1%** |
| NEW HERE | 10 | 100 / 0.15 / 70 / 2% | **95 / 0.45 / 60 / 7%** | 95 / 0.45 / 40 / 6% | **80 / 1.4 / 20 / 11%** |
| NEW HERE | 20 | 90 / 1.8 / 50 / 22% | **95 / 1.9 / 25 / 26%** | 95 / 2.1 / 35 / 28% | **80 / 3.4 / 35 / 23%** |
| NEW HERE | 40 | 75 / 4 / 20 / 13% | **90 / 3.1 / 25 / 14%** | 95 / 1.9 / 40 / 12% | **95 / 2.4 / 35 / 15%** |
| SEEN IT | 1 | 100 / 0 / 100 / 0% | **100 / 0 / 100 / 0%** | 100 / 0 / 95 / 0% | **100 / 0 / 95 / 0%** |
| SEEN IT | 5 | 55 / 0.45 / 55 / 1% | **45 / 0.55 / 45 / 1%** | 35 / 0.65 / 25 / 2% | **30 / 0.7 / 20 / 2%** |
| SEEN IT | 10 | 100 / 0.4 / 60 / 9% | **100 / 0.2 / 80 / 5%** | 95 / 0.75 / 35 / 6% | **95 / 0.85 / 35 / 7%** |
| SEEN IT | 20 | 95 / 2.4 / 20 / 25% | **100 / 2.2 / 20 / 21%** | 95 / 2.5 / 20 / 22% | **95 / 2.4 / 30 / 23%** |
| SEEN IT | 40 | 90 / 2.9 / 20 / 15% | **90 / 3.7 / 15 / 15%** | 90 / 2.8 / 30 / 13% | **90 / 2.6 / 25 / 16%** |
| OUTLIVED IT | 1 | 95 / 0.05 / 95 / 3% | **95 / 0.05 / 95 / 3%** | 100 / 0 / 100 / 0% | **100 / 0 / 100 / 0%** |
| OUTLIVED IT | 5 | 45 / 0.55 / 45 / 2% | **40 / 0.6 / 40 / 2%** | 20 / 0.8 / 20 / 3% | **25 / 0.75 / 25 / 3%** |
| OUTLIVED IT | 10 | 95 / 0.55 / 45 / 6% | **90 / 0.9 / 40 / 9%** | 60 / 1.9 / 10 / 8% | **55 / 1.6 / 20 / 7%** |
| OUTLIVED IT | 20 | 70 / 4 / 15 / 26% | **60 / 4.9 / 15 / 28%** | 55 / 5.5 / 15 / 25% | **45 / 6 / 10 / 26%** |
| OUTLIVED IT | 40 | 95 / 2.5 / 25 / 15% | **85 / 3.5 / 15 / 14%** | 85 / 3.6 / 25 / 14% | **80 / 4.2 / 20 / 14%** |

POOLED, the gate's sample (the three companies, days 10 and 20; won / men struck down a fight / nobody under half in 100 / health left /
big hits). BEFORE: the game he played. MAIN TODAY: main's numbers on today's fight (COMBAT 7's enemy in it; the curve tool run in a clean
copy of 290226409). NOW: this round's numbers on today's fight.
| level | routine BEFORE | routine MAIN TODAY | routine NOW | tough BEFORE | tough MAIN TODAY | tough NOW |
|---|---|---|---|---|---|---|
| NEW HERE | 98 / 0.37 / 78 / 92% / 10% | 100 / 0.31 / 78 / 92% / 9% | **98 / 0.54 / 64 / 88% / 10%** | 98 / 0.56 / 60 / 87% / 10% | 98 / 0.58 / 60 / 86% / 10% | **91 / 1.27 / 48 / 74% / 12%** |
| SEEN IT | 99 / 0.59 / 65 / 88% / 11% | 98 / 0.66 / 68 / 88% / 9% | **99 / 0.62 / 66 / 88% / 9%** | 94 / 1.12 / 51 / 77% / 10% | 98 / 0.82 / 53 / 81% / 9% | **97 / 0.92 / 53 / 80% / 9%** |
| OUTLIVED IT | 92 / 1.29 / 51 / 76% / 13% | 90 / 1.55 / 45 / 74% / 14% | **89 / 1.65 / 45 / 72% / 14%** | 68 / 2.96 / 28 / 51% / 14% | 65 / 3.10 / 30 / 51% / 14% | **63 / 3.10 / 29 / 50% / 13%** |

WHAT IT SAYS IN PLAIN WORDS
- NEW HERE (his level): the hardest job on the board can be lost (91 in 100; 98 before and on main today) and costs about a man a fight
  (1.27; was 0.56); somebody ends under half in 52 fights of 100 (was 40). The everyday job: a man down about every other fight (0.54; was
  0.37, main today 0.31), somebody under half in 36 of 100 (was 22). The fresh company's tough job at day 20 is 95 in 100 with 1.2 men down
  (was 100 and 0.35); rare men in the cheapest kit lose about two men a routine fight at day 20: a rare man in cheap gear is a rare man in
  danger (370(3)).
- STILL A WALK ON NEW HERE: twelve men in the city's armour (the Lone Wolf's rich line) at day 20: 100 in 100, a man down one fight in ten,
  nobody under half in 80 of 100 (was 85); at day 40 a man down every other fight, 70 of 100 clean. Lever 1 holds it; s7.
- SEEN IT and OUTLIVED IT: where main stands on today's fight at days 10 and 20; from day 22 (SEEN IT) and 18 (OUTLIVED IT) a strong
  company meets the late men (the champions, the marauders) about three days sooner than before.
- WHAT IT COSTS EARLY: a small company at day 5 on NEW HERE meets the crews Battle Brothers' Beginner sends: the fresh company's routine
  job 85 in 100 with 1.2 men down (was 90 and 0.55); the Lone Wolf alone 55 (was 70).

## 6. THE GATE: gates/the_fight_is_close_gate.js (in the suite as THE FIGHT IS CLOSE), 12 passed, 0 failed on today's fight, about 2.5 min
Every band is a row of records/target/bb/party_math.json closeness_bands (with its source), read by the gate and the card.
- P1 PRICE IS POWER: no piece on the shelf costs more than a piece of its slot that holds as much and weighs no more (0 break it).
- P2 THE GOOD PIECE COSTS WHAT IT IS WORTH: the dearest body and helmet cost 10 times or more the cheapest piece that holds a third of them
  (body: coat of plates 7,000 against a southern mail shirt 400, 17.5x; head: decorated full helm 4,000 against 345, 11.6x).
- O1 ONE-SHOT FEAR: every phase of brigands, kids, heavies and machines has a blow that takes half an unarmoured 60-health man (the first
  week's goedendag 125%), and mail (150) holds it under half (6%).
- B1 THE BANDS on the live fight, per level, routine and tough, pooled over the three companies at days 10 and 20 (20 fights a cell, the
  bank's own seeds, so the live fight must reproduce the committed after bank):
  NEW HERE routine: won 88+, struck 0.45 to 1.5, nobody under half in 72 or fewer, health left 90% or less, big hits 5%+;
            tough: won 60 to 96, struck 0.9 to 3, nobody under half in 58 or fewer.
  SEEN IT routine: won 85+, struck 0.45 to 2, nobody under half 72 or fewer, health left 90% or less; tough: won 55 to 98, struck 0.8 to
            3.5, nobody under half 58 or fewer (SET WHERE TODAY'S FIGHT STANDS: it was 96 and 1.0 until COMBAT 7's breaking enemy took
            main's own SEEN IT tough job to 98 and 0.82 in the same hour; closeness_bands.seen_tough_why; tightening it back is s7's).
  OUTLIVED IT routine: won 75+, struck 1 to 2.5, nobody under half 60 or fewer, health left 80% or less; tough: won 40 to 85, struck 2 to
            4.5, nobody under half 40 or fewer. Every band also asks big hits 5% or more.
  Battle Brothers' floor for the two harder levels: its Veteran on our own fight (banks/BOHEMIA_TUNING_THE_WHOLE_GRID_10_18_26.json setting
  'bb'): twelve men against the map's thirteen won 95 to 99 with 1.2 to 2.8 men struck down a fight.
- B2 THE HARDEST START IS NOT HELL: OUTLIVED IT's routine job on days 1 and 5 won 35 in 100 or more by every company, the Lone Wolf alone
  included (Lone Wolf 95 / 40, fresh 95 / 75, his way 95 / 40).
- B3 THE GATE BITES: the before bank fails NEW HERE's bands on five counts (routine: 0.37 struck, 78 clean, 92% health; tough: won 98, 0.56
  struck, 60 clean); the after bank holds every band.

## 7. NOT FIXED, SAID, AND WHERE IT GOES
- THE BRIGANDS AND SEEN IT'S AIM ARE PINNED BY RULE 192'S GATE. most_jobs_fit_the_company_gate (WORLD) plays its 'typical company' with
  tools/bohemia_world_most_jobs_fit.js, which hands each man a level (3 at day 20, 8 at day 90) and no stats, so the fight rolls him as a
  level-1 man; the game's roster hands every man the stats he chose at each level (engine/bohemia_roster.js company(), rule 162(e)). That
  company has 5 points of room (day 20 two skulls 65, the gate asks 60), so SEEN IT at Battle Brothers' aim and a meaner brigand mix (s4,
  tried) took it to 10 to 50. Measured on this round's shipped numbers it reads exactly as on main: day 1 95/80/80, day 20 95/65/30, day 50
  95/90/35, day 90 95/55/55 (its M1 day-90 two-skull cell at 55 is red on main too, DIFFICULTY's note; M2 holds at 0/15/15/0). ROUTED to
  WORLD: climb the tool's men as the game climbs them; then SEEN IT's aim and the brigand mix in s4(a) can ship.
- THE ARMOURED COMPANY ON NEW HERE (twelve men in 210 armour win routine jobs with nobody under half in 70 to 80 of 100): the enemy spreads
  its blows, so no armour breaks. COMBAT 7's rule 366 landed this hour (the enemy wants to live, takes high ground) and did not change it on
  main's numbers; the target choice that breaks one man's armour is the lever, and more than 13 men a job breaks rule 75b. ROUTED to
  COMBAT 7 with this measurement.
- COMBAT 7'S BREAKING ENEMY SOFTENED SEEN IT'S TOUGH JOB (main's own numbers on today's fight: 94 -> 98 in 100, 1.12 -> 0.82 men down);
  the band is set where the fight stands (s6) and tightening it back waits on the brigand levers WORLD's gate pins.
- THE LONE WOLF ALONE ON DAY 5 (every level's hardest point: the routine job 55 / 50 / 40 in 100, the tough job 40 / 35 / 25): a lone man
  meets Battle Brothers' floor crew (job_bb.mult_min 0.75, 'about 8 level 1 characters') and the first hire is the cure (with two hires on day
  10 he wins 95 to 100). Lowering the floor would ease every small company's early game, the opposite of 370; B2 holds the hardest level.
- THE PISTOL'S PRICE (a 3-battery knife fires 15-battery javelins): ROUTED to ECONOMY (every hire's kit carries a knife, so its price moves
  every hire's price; the_hire_price_is_the_formula_gate reads it from the data).
- MORE KINDS OF THREAT (370(7)): the sawed-off and the pump shotgun are carried by nobody (armory.json carried_by []), so 'the shotgun at one
  tile' never comes at him; a road gunman is FACTIONS' row (bohemia_enemies.json). ROUTED.
- NOT IN THE MEASURED LINES: the roaming parties and the newer factions (house, watch, keepers, water, the beasts); they read the same tiers
  and difficulty, so this round's numbers move them the same way.

## ROUTED
- WORLD: tools/bohemia_world_most_jobs_fit.js's men climb as the game climbs them (rule 162(e)); then TUNING ships s4(a).
- COMBAT 7 (rule 366): enemy target choice; the armoured company's walk is the measurement it moves.
- ECONOMY: the pistol's price (s3.6).
- FACTIONS: a road shotgun man (s7).
[bb the step: Battle Brothers' easiest level gives five points of aim and easier groups later; ours gave the aim and 15% off every crew; now it
gives the aim and the full crew, a small step past Battle Brothers' easiest, so the easiest level bites the way his did]
[analog horror: the men on the road get better because you did; nobody says so, there are just more of the ones with a name on their blade]

## 8. THE OTHER GATES THESE FILES FEED (rule 13: the pre-push pass)
Pre-push pass, on this round's tree (rule 13; the full suite is not run by one lane). GREEN: THE FIGHT IS CLOSE 12/0, THE BESTIARY 10/0 (9/1 on
main: the roster was stale; regenerated), GUNS FROM THE FIRST FIGHT 13/0 (after the first-week change was taken back), MOST JOBS FIT THE
COMPANY's numbers exactly as main's (day 1 100/75/75, day 20 95/65/30, day 50 95/75/30, day 90 100/55/55: its M1 day-90 two-skull cell at 55
is red on main too, M2 holds), FACTIONS, MELEE IS ONE TILE, THE FIGHT HOLDS THE WHOLE GRID, THE PERKS ARE LIVE, THE ROSTER SCALES THE ENEMY,
THE HIRE PRICE IS THE FORMULA, GOD GEAR, EVERY ITEM HAS AN ICON, THE ARMOUR HE WEARS SHOWS, EVERY ORIGIN STARTS LIKE ITSELF, THE SHOP KEEPS
ITS ARMOUR, EVERY BEAST ITS OWN OUTLINE, PRICE TABLE 19/0, TWO PRICES 28/0. RED HERE AND ON MAIN, THE SAME LEGS, NOT THIS LANE'S: GHOSTS AND
APPARITIONS (act weights for FACTIONS' new kinds), AUTO KILLS ONE AT A TIME F5 (the champions' lessons), A FEW NOT TWELVE P3/P4, THE JOBS'
PART N2 (27/4 on main, 30/1 here), THE NEW ENEMIES 8/4, THE RARE MAN AT THE POST R5 (the demo's tap), THE SHOP SAYS WHAT IT DOES W1, THE
REBUILT FIGHT PLAYS (4 legs here, 6 on main), THE FIGHT READS ONLY SOURCED NUMBERS (dealHash). UNMEASURED, SAID: THE JOB TELLS THE TRUTH, IN
BLOOD drives the demo and did not finish inside 20 minutes on this box twice (its browser closed by the timeout).

## 9. THE BIG BEASTS ARE DEADLY UP CLOSE (rule 370 amended (9), the coordinator's note 11/3 09:30; Paolo on BEASTS 2's card: 'these big ass
## animals better fuck you up if they get close to you for real')
- MEASURED BEFORE (tools/bohemia_difficulty_the_curve.js --close --factions bulls,bears,sloths,camels,lions, the three companies, days 10 and
  20, every level, 20 fights a cell; banks/BOHEMIA_TUNING_THE_BIG_BEASTS_BEFORE_11_3_26.json): the bull, the bear, the sloth and the camel all
  struck with the unhold's Sweep (40 to 80, 40% through armour): 133% of an unarmoured man at its best, but a mail shirt held it to a tenth
  of a man, so 17 in 100 of their landed blows took half a man (1 in 100 on the company in the shop's armour). Won 99 in 100.
- THE NUMBERS (records/target/bb/bohemia_enemies.json, each beast's attack pointed at a wiki row already in beast_attacks.json; BEASTS 2
  keeps the bodies, brains and rule rows): the bull's horns the Ijirok's Gore (100 to 130), the bear's maul the Bite (70 to 110), the
  sloth's claws the schrat's Uproot (70 to 100), the camel's kick the Size 2 Headbutt (70 to 90), each half through armour: at its best a dead
  man in rags and half a man in mail (62 / 67 / 58 / 50%). One heavy blow a turn instead of two Sweeps. The mountain lion keeps the cat's bite
  (50 to 70, 117% of an unarmoured man; a cougar's teeth do not go through mail; its danger is the ambush and the pin). The ancient bison is
  not in his five and kept the Sweep: with the Gore, six new men beat its sized party 5 in 10 instead of 8 (the new enemies' gate).
- MEASURED AFTER (banks/BOHEMIA_TUNING_THE_BIG_BEASTS_AFTER_11_3_26.json): 48 in 100 of their landed blows take half a man (15 on the armoured
  company); still won 98 in 100, because they are shot on the way in, and the man they reach goes down (struck 0.23 -> 0.34 a fight).
- THE GATE: THE FIGHT IS CLOSE O2 (each blow on paper: half an unarmoured man; the four heavy ones half a man in mail) and B5 (in the fight:
  35 in 100 or more, 10 on the armoured line; the before bank fails it), 14/0. closeness_bands.big_beasts and big_beasts_why hold the numbers.
- THE OTHER GATES: THE BEAST IN EIGHT 26/0, EVERY BEAST ITS OWN OUTLINE 11/0, the roster fresh; THE NEW ENEMIES 8/4 with the same four legs
  red as main (its SIZED leg: bulls 9/10 and 10/10, bears 2/10 and 10/10, sloths 2/10 and 10/10, camels 10/10, as main within a fight);
  THE FIGHT HOLDS THE WHOLE GRID 16/1 on main too (the dire wolves in one early cell, from the newest fight, not these numbers).
