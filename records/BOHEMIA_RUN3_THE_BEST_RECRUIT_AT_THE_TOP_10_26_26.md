# RUN THREE -- [the best recruit at the top] and [four percent] (10/26/26)
# Rules 216 and 214 (records/BOHEMIA_PAOLO_THE_BEST_RECRUIT_AT_THE_TOP_10_26_26.md,
# records/BOHEMIA_PAOLO_FOUR_PERCENT_AND_THE_FEED_GETS_ITS_OWN_CHAT_10_26_26.md); EYES' halls note
# (records/BOHEMIA_EYES_EVERY_ASK_ROUND_TWO_AND_THE_EVERYDAY_PATHS_10_25_26.md: 'nineteen recruits in four halls, every one a
# pistol man; no rare man'). The hall (the post) is RUN THREE's; the rest of the town is RUN TWO's.

## HIS WORDS
'in the recruiting pitstop just put the best at the absolute top... the more stars, the more expensive... keeping in mind the price
they ask depending on their background... a bunch of stars but their cost is less than a Battle Brothers Hedge Knight... when we
level them up as much as we can, their stars and default good stats lead the way... you might have to make a calculator... that's
one failure of Battle Brothers, no proper filter to quickly see who's the fire one... it doesn't respect your time.'
'make it 4 percent... for the women.'

## MEASURED BEFORE
- The hall listed its men in the roll's order. engine/bohemia_goodbros.js deals one man per trade in a fixed order (farmhand,
  messenger, butcher, brawler, thief, militia) and the hall took the first n: a town's four were the same four trades every week,
  a thief or a block watch never stood at a town's post, a camp only ever had a farmhand and a runner.
- Every man held the pistol (every trade's kit starts with the knife row, ours.pistol); EYES' 'every one a pistol man'.
- No number said who would be good. The rare man was in (3 in 100 a slot at towns and fortresses, measured 3.3 and 2.7 over 500
  weeks): nineteen men in four halls with none is about a coin flip (0.97^19 = 0.56), so his rate stands; he now sorts to the top.
- The share of women was his old 1 percent.

## WHAT IS BUILT
1. FOUR PERCENT (262c23b0). records/target/bb/post_women.json share.value 0.01 -> 0.04; TUNING's one table row post.women_share
   (records/BOHEMIA_TUNING_THE_ONE_TABLE_10_17_26.md section M) the same number; the gate binds the two. 407 of 10,000 test hires
   are women (wants 400). STILL PLAYS AT 0: no woman's whole body exists (CHARACTER's mix: 71 'm', 81 unset, all on the master rig,
   a man's), and rule 203(a) forbids a man's body with a woman's name. The moment a person with sex 'f' and fight true is in
   engine/bohemia_people_mix.js the post deals her at 4 percent. NOTEs on CHARACTER's board since 10/25.
2. THE CEILING (engine/bohemia_roster.js ceiling(), worthOf(), planFor(), rankIn(); inputs records/target/bb/recruit_ceiling.json):
   ROUND ONE shipped 9aeda231 on my own weights (the level-up table's roll sizes, a floor). TUNING's check landed the same hour
   (records/BOHEMIA_TUNING_THE_RECRUITS_CEILING_10_26_26.md, the one table section O, measured on the live fight) and ROUND TWO
   takes it whole:
   - What he is expected to be at level 11 through the crew screen's own level-up: levelUp() rolls every stat on his star column
     (stat_gains_by_stars), raise() takes per_level.attributes_raised (four). The calculator takes the first four off his kind's
     plan, each at its column's mean ('a-b' is (a+b)/2), times the levels left (11 minus his level): recruit.ceiling_formula.
   - TUNING's plans and weights (men struck down saved per point): MELEE melee skill 1, melee defence 0.41, ranged defence 0.38,
     hitpoints 0.35; GUN ranged skill 1, melee defence 0.76, hitpoints 0.24, fatigue 0.24 (a gunman's second stat is melee defence
     since rule 185 put the guns in reach of a blade). One number a kind: the four's weighted sum over the weights' sum; his kind
     is the better (TUNING's bench's own pick).
   - SHOWN AS A RANK (recruit.ceiling_shown): the page rolls 400 posts of six the hall's way once (trades, stars, traits on their
     own seed) and a man's number is the share of them he beats, 'better than N of 100' (never 100), drawn as a bar with N on it
     (rule 223: the fill is N over 100, the exact level-11 figures a long press away, rule 224(b)). The rare man is not in the
     sample, so he reads near the top (99), as he is.
   - His stats include his trait's flat numbers (the card's, what he walks in with) and his three stars; a rare man counts from his
     level (2 or 3).
   - CHECKED: for 100 rolled men, 300 climbs each to level 11 through grant() and raise(): every ceiling within a point of the
     climbs' mean (worst 0.22).
3. THE HALL (slices/BOHEMIA_SETTLEMENT_SCREEN.html, __THE_BEST_RECRUIT_AT_THE_TOP__):
   - Lists by the ceiling, highest first, every visit; waits ('LOOKING THEM OVER...') until the calculator's files are in, and shows
     the roll's order if they cannot load.
   - Every card: CEILING as a bar with his rank on it, MELEE or GUN, his price (the Hire button's).
   - BARGAIN: TUNING's recruit.bargain_line inside 216(f) as ruled: his rank in the top fifth of all men AND his price under the
     hall's median AND his rank per battery over the hall's median. 11 in 36 halls (round one's line marked 45: a median marks half
     a hall by construction, TUNING's finding).
   - A man priced over the hall's median says why: the biggest part of the hall's own formula (hallPrice: his trade's asking, his
     levels, the kit he brings), e.g. 'COSTS MORE: THE RIFLE AND KIT HE BRINGS (+45)', 'COSTS MORE: HIS LEVEL 3 (+...)'.
   - [COORDINATOR'S DEFAULT, rule 205, his to kill] the header's two halves BEST / BEST FOR THE PRICE; one tap switches.
   - The stars and the trait stay on every card before he hires (rules 133, 146(e)); no try-out fee.
4. A REAL MIX (EYES): the six trades dealt in the week's own order (every trade now stands at towns; camps see 6 over weeks); a GUN
   man (his numbers make him better at the gun plan) walks in with the rifle (ours.weapon_rows.rifle, the light crossbow) where his
   trade carried the pistol, priced on the same formula (about 30 batteries more: Battle Brothers prices the kit a recruit brings);
   a MELEE man keeps the pistol in his hand (rule 120(a), guns first) and his trade's arm in the bag. 57 gun men and 83 melee men
   in 140 over 36 halls on round one's weights, 97 gun and 43 melee on TUNING's. The rare man keeps his own kit.

## GATES
- NEW gates/the_best_recruit_at_the_top_gate.js THE BEST RECRUIT AT THE TOP 12/0 (C1 the calculator is the level-up; C2 the order
  in 36 halls by real taps on his phone, the bar's fill to its number within a pixel; C3 BARGAIN and the why exactly the rule; C4 the switch in one tap; C5 stars and trait; C6
  the mix and the rare man's rate; C7 the computer; C8 the live demo through the title, a real tap on the hall; C9 nothing threw).
- gates/a_few_women_at_the_post_gate.js 4/0 at 4 percent, the file and the one table bound.
- RE-AIMED: the_hire_price_is_the_formula 10/0 (the oracle prices the man's own kit); the_trait_before_you_hire 12/0 (each band
  read when dealt; it read the first fight seconds into it, and a rifle man can have shot: 1 red in 4 runs before, 0 in 5 after).
- Green after the rebase: the_hire_shows_the_whole_man 10/0, settlement_screen 74/0, the_stars_sit_with_the_words 8/0,
  the_roster_and_posts_look 28/0, who_you_hire_fights 21/0, demo_build 25/0, the_fight_reads_only_sourced_numbers 10/0.
- RED ON MAIN BEFORE THIS (same on a clean worktree of 262c23b0, not this change): money_teaches 3/1 and the_rare_man_at_the_post's
  demo legs (the town's #crew button had no box in the demo), no_two_people_alike (the crew screen leg and the map legs),
  the_face_is_his_own_face (a board client). On round two's main the_rare_man_at_the_post is 10/0 again.

## FOR TUNING
Taken whole (section O): the formula, the four and the weights, the rank, the bargain line (held inside 216(f)'s median worth, so
both the ruling's gate and your line hold). The plans' fifth stat (melee fatigue 0.32, gun ranged defence 0.12) is read only if the
picks a level grow past four. If the weights move with the enemy ('the hall reads the road's'), the file is the one place to change.

[bb Battle Brothers hides the stars behind a try-out fee and has no sort: the hall's order is the roll's, and the Hedge Knight's
price is his background's. Ours shows the stars, sorts by what the level-up will make of him, and says when the price is the kit.]
[analog horror: the hall's card reads like a pawn ticket: a number for what a man will be worth once the work has used him up.]
