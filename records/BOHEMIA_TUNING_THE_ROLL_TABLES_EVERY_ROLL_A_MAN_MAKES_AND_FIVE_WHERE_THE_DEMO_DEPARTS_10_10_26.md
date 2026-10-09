# TUNING ROUND 14 -- [the roll tables] EVERY ROLL A MAN MAKES, AND WHERE THE DEMO'S CODE DEPARTS FROM THE WIKI (10/10/26)
# Row: VAMILY TUNING [the roll tables] (Grok GROK_126 XP, GROK_127 levels, GROK_128 stars; PEOPLE [good bros] and RUN TWO [climbing] read them), RESEARCH (rule 38g).
# Wiki pages read here (reference/library/grok/wiki/PAGES_ALL): Talents, Level and Experience, Game Guide (hiring cost, upkeep). Repo: records/target/bb/rules.json
# ('experience' block, already sourced and quoted), engine/bohemia_roster.js (the demo's roster code, read in full for this).
# This closes a gap Grok left: GROK_128 said the talents page text it received "does not print the words one star beside 60". The page here does:
# "1 Star Talent - 60% chance; 2 Star Talent - 30% chance; 3 Star Talent - 10% chance". The odds are 60 / 30 / 10 for 1 / 2 / 3 stars.

## 1. EVERY ROLL A MAN MAKES, IN ORDER (one table; every number from the wiki, the page named)
AT HIRE (Talents)
  - Stars: exactly THREE of his eight stats carry stars (HP, fatigue, resolve, initiative, melee skill, ranged skill, melee defence, ranged defence), at random,
    with no link to background (a few backgrounds are excluded from a few stats). Each starred stat is 1 star 60%, 2 stars 30%, 3 stars 10%.
    The one man with other than three starred stats is the Northern Raiders monk: three stars in resolve, none elsewhere.
  - Starting stats: rolled inside the background's range (backgrounds.json). Traits are hidden until a paid try-out.
  - Starting level: the background's (an origin can state it, rule 75a). Hire fee: base 30 to about 150 (swordmaster 400) + 1.25 x gear + 500 x (level-1)^1.5.
  - Daily upkeep: base 3 to 35 x random 0.90-1.10 x 1.1^(level-1) up to level 11 (x2.59), then x 1.03 per level above 11.
PER LEVEL, 2 to 11 (Level and Experience, Talents)
  - XP totals to reach: 2:200  3:500  4:1000  5:2000  6:3500  7:5000  8:7000  9:9000  10:12000  11:15000.
  - Each level: 1 perk point and a rise in THREE different attributes. The size of each rise is a range set by that stat's stars:
        stat             0 stars   1 star   2 stars   3 stars     average gain per level (0 / 1 / 2 / 3 stars)
        HP, Fatigue, Resolve, Ranged Defence, Ranged Skill   2-4   3-4   4    4-5      3.0 / 3.5 / 4.0 / 4.5
        Initiative                                           3-5   4-5   5    5-6      4.0 / 4.5 / 5.0 / 5.5
        Melee Skill, Melee Defence                           1-3   2-3   3    3-4      2.0 / 2.5 / 3.0 / 3.5
    (One star raises the minimum by 1, two raise it by 2, three also raise the maximum by 1.)
  - So a star is worth +5 points by level 11 on a stat you always raise (+10 for two stars, +15 for three). The wiki's own tip: a Hunter with 55
    ranged skill and no star equals a Poacher with 50 and one star.
PAST LEVEL 11 (veteran levels)
  - Each level costs 4000 + 1000 x (levels above 11) XP: 12: 19,000 total, 13: 24,000, 14: 30,000. No perk point. The three rises are capped at +1 each.
    The level cap is 33 (it was 42 before the Warriors of the North expansion).
XP IN A FIGHT (Level and Experience)
  - The killer gets 20%, the other 80% is split among the whole party (reserve men count). A war-dog kill gives no killer share.
  - Modifiers multiply: unconditional -15%; Beginner combat +10%; Student perk +20% to level 11; only two brothers -15%, only one -30%.
  - XP per enemy kind: the English page lists none. The Chinese page (via Grok, GROK_126, unverified) gives roughly thug 125, raider 210, brigand leader 340,
    peasant 85, wiederganger 85, nachzehrer 105, lindwurm 680; the older builds are in parentheses there. Not used here.

## 2. WHERE THE DEMO'S CODE DEPARTS (engine/bohemia_roster.js and engine/bohemia_pricetable.js read; five departures, none fixed by me)
 D1. STAR COUNT. manOf gives n = 1 + floor(R() x 3), so ONE TO THREE starred stats, uniformly. The wiki says EXACTLY THREE. Effect: mean stars per recruit
     3.00 against 4.50 (a third fewer), and the killer odds in my 10/10 recruit page are 3x worse in the demo:
         stars total   wiki odds        demo's code
          5 or more    1 in 2           1 in 6
          6 or more    1 in 5           1 in 15
          7 or more    1 in 18          1 in 55
          8 or more    1 in 100         1 in 300
          9            1 in 1,000       1 in 3,000
     The file's own header says "THE STAR RULE is not in the repo's wiki text, so it is ours": stale. It is in rules.json (experience.talent_star_odds, with quote)
     and on the Talents page.
 D2. THE ODDS ARE TYPED IN THE CODE (q < .6, q < .9) and not read from rules.json, against rule 63d (the numbers are theirs, as data) and COMBAT's "no number
     typed" discipline. The values agree today; they would not follow a change to the table.
 D3. WHO PICKS THE THREE STATS. levelUp raises three RANDOM stats (pool.splice at random). The wiki says a brother "can increase three different attributes", and its own
     tip, "each star will add 5 points by level 11" on a stat "you will always level up", only holds if THE PLAYER CHOOSES. With random picks a stat is raised 3 of 8
     times a level (3.75 times in ten levels), so a star is worth about 1.9 points by level 11, not 5: stars matter 2.6x less in the demo than in Battle Brothers.
     (The page does not say "choose" outright; the tip is the evidence. Mark: unverified.)
 D4. UPKEEP DOES NOT CLIMB, THOUGH THE FORMULA IS BUILT. engine/bohemia_pricetable.js already has the wiki's wage rule (dailyWageBatteries: base x random 0.9-1.1 x 1.1^(level-1) to level 11, then
     x 1.03 per level) and the hire rule (hireCostRange: the background's range + 1.25 x gear + 500 x (level-1)^1.5, in batteries). But NOTHING CALLS EITHER (a search of slices/ and engine/
     finds them only in their own file). The roster fixes a man's wage at hire (daily_wage / 10, rounded, floor 1) and levelUp never changes it. So getting stronger is free in the demo
     and costs up to 2.59x in Battle Brothers. The fix is a call, not a new formula.
 D5. THE HIRE PRICE IS NOT USED BY LEVEL for the same reason: the formula exists (hireCostRange) and is unwired, so a level-5 man is not priced above a level-1 man of his background in the demo.
 WHAT MATCHES: the level table, the veteran XP formula, no perk point past 11, +1 on three past 11, the cap of 33, the stat-gain ranges per star, the 20/80 kill split.

## 3. THE FINDING THAT PROVES US WRONG
The gap I named in my 10/10 recruit page ("a bench of killers is free") has a second half in the roster: the demo's recruits are a third weaker in stars than the real game's, and
the stars that exist are worth 2.6x less, and wages never rise as men level. Taken together the demo makes a roster that is cheaper to keep AND worse at the one thing the
wiki says drives a recruit's value. Fixing D1 and D3 both makes "good bros" (PEOPLE) matter more; wiring D4 (the formula already exists) gives levelling a cost.

## ROUTED
- PEOPLE [good bros]: D1 (exactly three starred stats) and the star-to-gain table; RUN TWO [climbing] (the owner of roster.js): D1 to D5.
- TUNING [recruit odds] page: add the demo-departs numbers (1 in 55 vs 1 in 18 for 7+ stars).
- ECONOMY / RUN TWO: D4 and D5 are a call to the existing dailyWageBatteries and hireCostRange, not new formulas. Test material: the VOTE page is draft:true.
