# TUNING ROUND 2 -- [lifespans] HOW OLD PEOPLE LIVE IS A ROLL (9/28/26)
# Row: VAMILY TUNING [lifespans], MODE RESEARCH (rule 38g: build nothing until he says build).
# His words (vote 9/27, records/BOHEMIA_PAOLO_THIRD_VOTES_9_28_26.md l.59): "Dies of age UP: a random variable
# number, procedurally generated how old people live; big brain research; come up with mechanics that make it fun."
# Law: laws/BOHEMIA_ADDENDUM_THE_THIRD_VOTES_9_28_26.md s13. With PEOPLE (the person) and DYNASTY (the fold).
# Sources: real-world figures are RECALL-GRADE from named studies, marked; to verify online next round.
# The curve numbers below are MEASURED by simulation (20,000 lives a setting, seed 1), script in section 6.

## 1. OUR REPO TODAY (measured first, rule 12)
- NOTHING IN THE GAME AGES ANYBODY OUT. engine/bohemia_family.js deleted its parked bury() writer, whose note
  said "WHEN a person dies of age is a magnitude, so it waits on Paolo." engine/bohemia_standing.js (~l.789)
  makes `alive` an optional question for the same reason. His 9/27 vote is that answer: a random roll.
- Age exists as BANDS (family.js): child <13, teen 13-17, adult 18-64, elder 65+, midpoints used when all we
  have is the word (adult = 41). A fold is ~30 years (canon). So an adult at act 1 is ~71 at the fold.
- There is no health number, no cause of death, no age effect on the fight.

## 2. THE REAL WORLD (the realism-first half)
1. LOW LIFE EXPECTANCY IS MOSTLY DEAD CHILDREN, NOT SHORT ADULT LIVES. Gurven & Kaplan 2007 (hunter-gatherer
   demography, recall): life expectancy at birth ~30s, but the most common adult age of death is ~68-78. A
   collapse game that kills its adults at 45 is the classic mistake. Adults who make it mostly get old.
2. DEATH RISK DOUBLES ABOUT EVERY 8 YEARS AFTER 30 (the Gompertz law, 1825, still the best-fit curve for adult
   human mortality; Makeham added a flat "bad luck" term: accidents, violence, infection). Everything in this
   page is those two numbers.
3. A CRASH TAKES YEARS OFF THE MIDDLE-AGED, AND THEY COME BACK. Russia 1990-94 (Notzon et al., JAMA 1998;
   Shkolnikov, recall): male life expectancy fell from ~64 to ~57.6 in four years, almost all from men 25-64
   (heart, alcohol, violence, stress), not the old or the young, and it partly recovered when things steadied.
   Case & Deaton's "deaths of despair" (US, 2015-2020) is the same shape: the flat bad-luck term and the stress
   multiplier go up; the curve itself does not.
4. SOME PEOPLE JUST LIVE LONG. Even in bad places a real share reach their 80s and 90s. Variance is real.

## 3. HOW GAMES DO IT (the best-games half; research may study anyone, canon references stay his list)
- BATTLE BROTHERS: brothers do not age at all (recall); they leave by death, injury, desertion. The lesson
  it gives us is the OTHER way: its deaths matter because a man carried a history, not because of a timer.
- CRUSADER KINGS (study only): age raises a hidden death chance every month, health and stress modify it,
  and the heir takes over. A death at 61 is a story because it lands on a succession nobody was ready for.
- DWARF FORTRESS (study only): every creature rolls a hidden max age at birth from a species range. Works,
  but the player can never feel it coming, and a death with no warning reads as the game cheating.
- RIMWORLD (study only): age brings conditions (bad back, cataracts, frailty, dementia) that SHOW, and they
  change what a person can do. Death is foreshadowed by the body.
WHAT PLAYERS KEEP: a death is a story when (a) you SAW IT COMING in the body, (b) something YOU DID moved it,
and (c) it LANDS on a moment (a handoff, a debt, an unfinished job). A roll with none of those is noise.

## 4. THE FINDING THAT PROVES US WRONG
Our canon says the valley is rough, and the easy build is "short lives". The real record says the opposite:
adults in hard places mostly reach their late 60s to 80s; a crash cuts the MIDDLE (25-64) and the cut comes
back when times improve. Measured on the curve below: in crash times, of adults alive at 41, 54% are still
alive 30 years later at the fold; in good times, 76%. So at every fold roughly HALF TO THREE QUARTERS of the
people you knew are still standing. The standing.js note that refused "everybody who watched you is dead"
was right, and now it has a number.

## 5. THE MECHANIC (recommended shape; the numbers are table rows when he flips TUNING to build)
A. NOT A HIDDEN DEATH AGE. A YEARLY RISK. Each year a person's chance of dying of age is
   bad luck + base x 2^((age)/8.2) x stress. Rows: BAD_LUCK, BASE (6e-5), DOUBLING_YEARS (8.2), STRESS.
   Random every life, never fixed, and it answers to what happens. That is his "random variable" and it is
   the real one.
B. THE TIMES MOVE IT, AND THE THREE ACTS MOVE THE TIMES. The world's state sets BAD_LUCK and STRESS. Measured
   (adults from 18, 20,000 lives each):
     GOOD  (bad luck 0.0005, stress 1.0): 1 in 10 dies before 57, median 81, 1 in 10 lives past 95
     HARD  (0.002, 1.3):                  before 48,           median 76,  past 91
     CRASH (0.005, 1.8):                  before 35,           median 69,  past 86
   "The game starts in the ruin and the future gets better" (second votes) means act 1 rolls on CRASH and a
   well-played act 3 on GOOD. The player's earlier acts literally add years to the later acts' people. That is
   rule 31 (the future is computed from the past) paid in years, and it is the realism: Russia's men got them back.
C. WHAT HE DOES MOVES IT (the fun). Each permanent mark from the death rule (lost eye, limp) multiplies STRESS a
   little (a row, e.g. x1.08 each). A veteran who fought 20 fights and survived at 10% pays for it at 60. Rest,
   a doctor in a settlement, a home base all lower it a little. Nothing he sees as a number: he sees the body.
D. THE BODY SHOWS IT FIRST (the omen, RimWorld's lesson). When yearly risk crosses a line (a row, e.g. 3%), the
   person gets a visible age condition: a stoop (ANIMATION already cut THE ELDER STOOPS), grey hair at the
   barber, a cough in their lines, one less action in a fight. When it crosses a second line (~10%) they say it
   out loud, from a mouth with a portrait. No death of age ever arrives without a warning he could have read.
E. IT LANDS ON A MOMENT. A death of age is checked at the fold and at year-ends, never mid-fight. It leaves
   something: the debt passes to someone, the house to someone, the grudge to someone. DYNASTY owns what passes.
F. NEVER IN THE FIRST HOUR, and the main character is NOT decided here: "the main character never dies" is a
   fight rule (37g). Whether he can die of age at 90 is a real creative fork and is [PENDING Paolo], carried by
   the coordinator. Default until ruled: no, the three of you age and stoop but do not die of age on screen.

## 6. THE SCRIPT (so the numbers can be argued with)
    h(age) = A + B * exp(0.085 * age) * m ; die this year with 1 - exp(-h); start at 18, step one year.
    G = 0.085 is ln2 / 8.2. Settings above as (A, m) with B = 6e-5. Toy: VOTE, "HOW LONG THEY LIVE".

## ROUTED
- TUNING [numbers table]: rows BAD_LUCK, BASE, DOUBLING_YEARS, STRESS per world state, MARK_STRESS, OMEN_1, OMEN_2.
- TUNING [death rule]: marks feed MARK_STRESS; the veteran's 10% has a cost later.
- PEOPLE: the omen lines, the stoop, the cough; the person who inherits.
- DYNASTY: the fold is where a death of age lands; the future's STRESS comes from the earlier acts' ledgers.
- ANIMATION: THE ELDER STOOPS is the first omen, already cut.
- [PENDING Paolo] via coordinator: can the main three die of age? Default no.
- Test material: the toy page is draft:true, never in the game.
