# TUNING ROUND 13 -- [recruit odds] HOW BATTLE BROTHERS GATES A KILLER, AND WHAT "36 AS HARD AS 12" COMES TO (10/10/26)
# Row: VAMILY TUNING [recruit odds] (rule 39d; his 9/28: 'make it easier to recruit killers so recruiting 36 killers would be as hard as
# recruiting 12 in Battle Brothers, score-wise, bonus-wise'), RESEARCH (rule 38g). Heir rules (his 9/28): a dead man still leaves an heir
# (default: survived the act, or 60 days with the company, or a family background), heir age 15-35, half the parent's traits, the family's gear.
# Wiki pages read here (reference/library/grok/wiki/PAGES_ALL): Talents, Game Guide (roster strength, hiring cost, upkeep), Character
# Backgrounds Sources, Level and Experience. The odds are my arithmetic on the wiki's talent chances. "What players do" is from the Game Guide.

## 1. HOW BATTLE BROTHERS GATES A RECRUIT (the numbers)
- WHO SHOWS UP: each settlement refreshes a list of recruits drawn from the backgrounds that settlement favours (its type, size, attached
  locations, buildings and situations). Each background has a percent chance per vacant slot (for example an Adventurous Noble is 2.2 to 5.0
  percent in a city). A good recruit is a draw from a pool, not a shop item.
- TALENTS (the hidden quality): every new brother gets stars next to THREE of his eight attributes, chosen at random with no link to
  background: 1 star 60 percent, 2 stars 30 percent, 3 stars 10 percent. A star raises the minimum of that stat's level-up roll by 1 (and a
  third star the maximum too). Stars are the "score" of a recruit that nobody can see until hired, except the traits which a paid try-out reveals.
- COST: base hiring fee by background 30 to about 150 crowns (Swordmasters 400); equipment at 1.25 times its worth; levels at
  500 x (level - 1)^1.5 (level 2: 500, 3: 1,414, 4: 2,598, 5: 4,000; the guide's own "0 to 3,000" does not match its formula). UPKEEP: base 3 to
  35 a day x a random 0.9-1.1 x 1.1^(level-1) for the first 11 levels (up to 2.59x) then x 1.03 per level above 11 (level 21 is 3.49x); a level-11
  Hedge Knight costs 91 a day, level 21 costs 122.
- WHAT CAPS THE ROSTER (the real answer to "why not 36"): only 12 fight (14 with one origin), wages for everyone are paid daily and food
  is 2 a day each, so "wages can go out of hand quickly"; the guide's advice is to keep the count near 12. And THE ENEMY SCALES ONLY OFF THE 12
  STRONGEST: roster strength = the sum of 10 + 2(level - 1) over them; the enemy multiplier is 0.94 x (0.01 x strength)^0.89, clamped 0.75 to 5,
  times the combat difficulty (Beginner 0.85, Veteran 1.00, Expert 1.15). Twelve level-1 men give 1.11; twelve level-11 men 2.94; twelve level-21 men 4.63.
  Benched men do not add to it. A bench of 24 more killers costs wages and food and adds NOTHING to the enemy's strength.

## 2. THE ODDS OF A KILLER (my arithmetic on the wiki's 60/30/10)
Total stars across the three starred attributes (the sum of three draws, each 1, 2 or 3):
    stars   chance     bar "at least this many"      one recruit in
      3     21.6 %     3 or more   100 %             1
      4     32.4 %     4 or more    78 %             1
      5     27.0 %     5 or more    46 %             2
      6     13.5 %     6 or more    19 %             5
      7      4.5 %     7 or more   5.5 %            18
      8      0.9 %     8 or more   1.0 %           100
      9      0.1 %     9 (all three are 3-star)   0.1 %          1,000
One or more 3-star talent: 27 percent; two or more: 2.8 percent. (These count stars anywhere; wanting them on the attributes a killer needs,
melee skill, melee defence, hitpoints, makes a real S-tier several times rarer still. Stars decide how good a man CAN become; levels and perks do the rest.)

## 3. WHAT "36 KILLERS AS HARD AS 12" COMES TO
Effort to find N men over a bar = N / p recruits seen (each seen recruit costs a settlement visit, a refresh, and a fee when hired). At a bar of
"7 stars or more" (1 in 18): 12 killers is about 216 recruits seen; 36 is about 648. Three ways to make 36 cost what 12 costs:
 A. LOWER THE BAR: 36 at "6 stars or more" (1 in 5) is about 190 recruits seen. One star-total point (7 to 6) is a 3.5x easier bar.
 B. THREE COMPANIES, NOT ONE: the three acts run AT ONCE (rule 31), so 36 is 12 per act, and each act's 12 is BB-hard on its own. Nothing is easier,
    nothing is harder: 36 killers across three acts IS 12 per company. The first reading (one company of 36) cannot happen: the field is 12 and
    the roster 20 (ours.json), and BB's own guide says to stay near 12.
 C. INHERITANCE (the rule he wrote): the act-1 12 are hard-won at BB's price; act 2 and act 3 each get 12 heirs for free, at half the parent's
    traits. That is 12 hard-won and 24 inherited = the effort of 12. This is the version that makes his sentence literally true.
RECOMMENDED: B and C together. Each act has its own pool and its own bar at BB's difficulty; the line carries the rest. WAGES stay per company (so
36 men do not cost 3 times the wages of one company), and the enemy strength is read per act from that act's strongest 12, as BB does.

## 4. THE HEIR RULES AS ROWS (his defaults, my numbers where marked)
- Eligible if ANY of: survived the act; 60 days with the company; a family background (his). With "60 days" nearly every dead man qualifies, so a line
  almost never breaks; the survived-the-act rule alone is the strict one. Fraction who survive an act of F fights, with a struck-down chance s and
  20 percent death: (1 - 0.2 s)^F, which comes to: s 3%: 0.74 / 0.55 / 0.30 for F = 50 / 100 / 200; s 5%: 0.61 / 0.37 / 0.13;
  s 8%: 0.45 / 0.20 / 0.04. (s is for the new fight UNMEASURED, per my 10/10 stale-findings page; these are what-ifs.)
- Heir age 15 to 35 (his). Heir talents: "half the parent's traits". Proposal: each parent talent loses one star (3 to 2, 2 to 1, 1 to 1), so a 9-star
  father leaves a 6-star son. That is a 6+ at the 7+ bar's price: "score-wise, bonus-wise" a good father makes a good but not equal son.
  Gear: the family's, as the parent left it (his).
- Rows: heir.eligible_survived true; heir.eligible_days 60; heir.eligible_family true; heir.age [15, 35]; heir.star_loss 1; heir.min_star 1;
  recruit.bar_stars [7 hard, 6 for the larger company]; recruit.talent_chances [0.6, 0.3, 0.1]; roster.field 12; roster.max 20.

## 5. THE FINDING THAT PROVES US WRONG (a note on my own earlier pages)
My difficulty page said the enemy scales off crew strength "which our fight has no term for". Here it is exactly: the multiplier above, with a clamp and a
combat-difficulty factor, summed over the 12 strongest only. If the demo has no such term, a strong crew cannot be punished and a bench
of killers is free. That belongs to COMBAT [the enemy math].

## ROUTED
- DYNASTY [heirs]: section 4 (eligibility, age, star loss, gear). PEOPLE [origins/backgrounds]: the star draw (60/30/10) and the background pool percents.
- COMBAT [the enemy math]: roster strength and its multiplier (section 1), read per act.
- ECONOMY: hire cost, upkeep formula, wages per company; WORLD: which settlements favour which backgrounds.
- TUNING [numbers table]: the rows in section 4. Test material: the VOTE page is draft:true.
