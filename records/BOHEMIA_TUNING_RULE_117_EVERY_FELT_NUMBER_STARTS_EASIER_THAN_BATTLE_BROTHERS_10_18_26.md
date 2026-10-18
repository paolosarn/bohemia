# TUNING [rule 117 in the table] EVERY FELT NUMBER STARTS EASIER THAN BATTLE BROTHERS (10/18/26)
# Rule 117 (Paolo 10/18, LOCKED, on TUNING's numbers card): "I want you to be easier than Battle Brothers... bringing Battle
# Brothers into this fun, like Nintendo simplified way kind of vibes, like minimalist vibes... if there's a lot to do, let's just
# make the people feel that they're successfully doing it, really good vibes." Research only (rule 38g); nothing in the game reads
# any file named here. Battle Brothers is the model for HOW a system works (rule 41), never for how hard it is.

## 0. WHAT LANDED
- The one numbers table (records/BOHEMIA_TUNING_THE_ONE_TABLE_10_17_26.md, 209 rows) now carries a 117 column on EVERY row,
  and a new section E: the 22 levers, each with Battle Brothers' value as the HARD END of its slider and our START easier.
- The marks: 122 HELD AT BB, BOTH SIDES; 45 PRICE, FRIENDLY END; 28 NOT A HARDNESS NUMBER; 6 EASIER; 5 ALREADY EASIER;
  3 HARDER THAN BB; 0 unmarked. 8 levers are NEW ROWS the table does not hold yet (proposed, section E says so).
- Data: banks/BOHEMIA_TUNING_RULE_117_EASIER_THAN_BB_10_18_26.json (draft:true; one object per lever, a modder can edit it).
  The table's generator (tools/bohemia_tuning_one_table_seed.js) reads it and prints UNMARKED for any row in no family,
  so a new felt number cannot slip in without a 117 mark.
- Side fix: RUN TWO's settlement screen moved five prices behind the place's cards (tm.buy, tm.men); the screens seed
  caught all five as DRIFTED, exactly as built, and its patterns now read the new code (0 drifted). Market day no longer
  adds a flat two men: the cards move the posts by a share (+25 percent on a fair).
- COMBAT made rule 56 live since my last round (deathChance(): 0.20 plus 0.05 a mark, cap four): the table gained the row
  ours.struck_down_death_per_mark with its feel line, marked ALREADY EASIER (four marks is 0.40, under Battle Brothers' 0.67).

## 1. THE THREE PLACES THE GAME IS HARDER THAN BATTLE BROTHERS TODAY (rule 117: a NO before he sees it)
1. THE VETERAN DIES AT TWICE HIS NUMBER. His ruling is 0.10 for a veteran; the fight reads only the base roll, so a veteran
   dies at 0.20 (plus the marks). Found 10/17, routed to COMBAT, still open. Owner: COMBAT (read ours.veteran_death_chance in
   deathChance()).
2. A HIRED MAN IS WORTH LESS THAN A BATTLE BROTHERS RECRUIT. The hall stars ONE stat and adds it to his start; Battle Brothers
   stars THREE and they raise every level-up (wiki, Talents). Owner: PEOPLE + RUN TWO. Start: three, with the easier odds below.
3. A HIRE COSTS FOUR AND A HALF TIMES THE FORMULA. A level-one militiaman is up to 225 batteries; the wiki's formula
   (engine/bohemia_pricetable.js, which no screen loads) gives 49. Owner: RUN TWO + ECONOMY. Start: four fifths of the formula.

## 2. THE LEVERS (the start is easier; Battle Brothers' value is the hard end; the slider goes up from the start)
| lever | Battle Brothers (the hard end) | our start | shown or under | the win he feels |
|---|---|---|---|---|
| your hit roll | Veteran 0 (Beginner +5 to you, -5 to them) | +5 to you, -5 to them | inside the shown hit number | more swings land |
| a bad streak ends | none | after a miss on a 50+ shot, +10 on the next until one lands | inside the shown hit number | no three misses in a row on a good shot |
| the enemy party's size | 1.0 of the budget (Beginner 0.85) | 0.85 | under (he sees fewer men) | you outnumber them; the fight ends in 2 to 4 minutes |
| when the better crews come | the table's pace (Beginner: 5 days later) | the middle phase at day 25 (was 20), the late at 75 (was 60) | under | the early acts feel like winning |
| how fast men level | -0.15 on every gain (Beginner +10 percent) | -0.05 | under; the level-up is shown | a level-up every two or three early fights |
| breath back a turn | 15 | 18 | under: a bar, never the number | one more swing before he is spent |
| the enemy's nerve | 1.0 | 0.9 of their resolve | shown as the rout | THE ROUT: they run from you |
| star odds (hire and crew) | 60 / 30 / 10 in 100 | 50 / 35 / 15 | shown as the stars | a three-star stat one hire in seven, not ten |
| what a hall pays for loot | 13.6 to 19.7 in 100 by size and relation | 20 in 100 | one price per item | loot is worth carrying home |
| starting batteries | 200 (Battle Brothers' Medium 2000 crowns) | 250 (their High) | the one battery count | the first market feels rich |
| what the wagon carries | 150 / 300 / 100 (tools, ammo, medicine) | 200 / 500 / 150 (their Beginner) | under until nearly full | nothing left on the ground |
| unpaid days before a man walks | about 3 | 5, his face sours a day before | shown as his face | one warning, one day to pay |
| already easier, his rulings | death 0.67, permanent injury, the captain can die, a daily wage | 0.20, 30 to 40 days, never, bought once | as now | four in five come back with a scar and a story |
Held, not moved: the hit cap 5 to 95 (a sure thing makes it a chess puzzle again, rule 37); every rule both sides share
(hit chance maths, costs, morale tables, gear and enemy rows), because Battle Brothers itself keeps enemy stats and gear the
same on every difficulty ("enemies carry the same equipment with the same stats on all difficulty levels") and moves the
COUNT and the TIMING. We do the same: the levers sit on the count, the timing, the dice and the money, never on a shared rule.

## 3. WHY THESE LEVERS (how other games make it easier; a genre study, none is a reference game)
- BATTLE BROTHERS' OWN BEGINNER is the start for half the levers: your roll 5 better and theirs 5 worse, +10 percent XP, the
  crisis 5 days later, bigger carry caps, enemy parties from about 0.85 of the budget (players' read of the files; Steam,
  battlebrothers.fandom.com Update 1.4.0.49 for the XP). Rule 117a in one line: their easiest is our default.
- THE PLAYER FEELS A 3-TO-1 FIGHT IS A WIN. Sid Meier, GDC 2010 keynote 'The Psychology of Game Design (Everything You Know Is
  Wrong)': testers felt a battle at 3-to-1 odds was one they should win, and losers blame the dice (VentureBeat, Engadget,
  The Strong museum write-ups). So the honest dice feel unfair; the streak breaker answers that without lying.
- XCOM: ENEMY UNKNOWN'S EASIER SETTINGS add a hidden +15 per consecutive miss on shots of 50 or better, capped at 95
  (Ufopaedia, Difficulty (EU2012); community-read from the game's config, sources disagree on 10 or 15). We take the shape,
  +10, and put it INSIDE the shown number so the tile never lies.
- FIRE EMBLEM (Nintendo, his word 'Nintendo simplified'): the forecast shows three numbers (hit, damage, crit) and nothing
  else; from The Binding Blade on it rolls two numbers and averages them, so a shown 80 lands about 92 in 100 and a shown 30
  about 18 (fireemblemwiki.org, True hit). Fire Emblem Fates' Phoenix mode exists for players 'afraid it might be too hard'
  (Siliconera, the developers). What we take: show few numbers, keep the maths under the surface (rule 117b's SHOWN and UNDER
  lists in the data file). What we do NOT take: a shown number that is not the real one.

## 4. WHAT EACH BUILDING LANE DOES WITH IT (routed; nothing here is built by TUNING)
- COMBAT: the veteran row (section 1.1); the hit roll shift, the streak breaker, the band size, the enemy's nerve, the phase
  days, the breath, the XP as rows read through R() (they are not in the table yet; section E names them NEW ROW).
- PEOPLE + RUN TWO: three starred stats, the 50 / 35 / 15 odds, the hire price off the formula at four fifths, the walk-out at 5.
- ECONOMY + RUN TWO: the hall pays 20 in 100, 250 starting batteries, Beginner's carry caps.
- UI: the SHOWN list (the hit number, two bars, one battery count, a price, the days, the stars) and nothing else by default.
- MODS: the lever file is already one object per lever; it is the shape a difficulty mod would edit.

## 5. SOURCES (fetched this round; the web was open)
- https://ufopaedia.org/Difficulty_(EU2012) ; https://www.nexusmods.com/xcom2/mods/212 ; https://steamcommunity.com/app/200510/discussions/0/142261027580802174
- https://fireemblemwiki.org/wiki/True_hit ; https://www.siliconera.com/fire-emblem-if-developers-on-why-they-added-the-easier-phoenix-mode/
- https://venturebeat.com/2010/03/12/quotes-from-sid-meiers-keynote-gdc-speech ; https://www.engadget.com/2010-03-14-sid-meier-talks-player-psychology-and-the-year-of-civilization.html ; https://www.museumofplay.org/blog/gdc-2010-game-psychology-101/
- https://battlebrothers.fandom.com/wiki/Update_1.4.0.49 ; https://steamcommunity.com/app/365360/discussions/0/2847921219527966942 (Beginner's 0.85 and +5, players)
- Battle Brothers' difficulty numbers: records/BOHEMIA_TUNING_THE_DIFFICULTY_STEPS_EXACTLY_10_9_26.md (the wiki dump).

[bb Battle Brothers moves difficulty through the enemy's count and timing and your dice and money, never the shared rules; that is the shape we keep, set one step easier.]
[analog horror: the rout is the loudest win and it should sound like it: men turning and running, the beat landing; named for SOUNDS, not moved.]
