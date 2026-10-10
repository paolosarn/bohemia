# TUNING ROUND 15 -- [mood and desertion] THE MOOD BANDS, THE MORALE START, THE DRIFT, AND THE CLOCK (10/10/26)
# Row: VAMILY TUNING [mood and desertion] (Grok GROK_141 desertion clock, GROK_143 mood to morale; his VIA GROK rule: a hire walks a couple of days after batteries hit zero;
# traits stretch or shrink that clock), RESEARCH (rule 38g). PEOPLE and COMBAT read it.
# Wiki pages read here (reference/library/grok/wiki/PAGES_ALL): Mood, Game Mechanics ("Upkeep and Food Supply"), Game Guide, and the trait pages Loyal, Disloyal, Optimist,
# Pessimist, Greedy, Spartan, Gluttonous. NOT in the dump: the wiki's "Mood Change (negative/positive)" and "Mood Level, Mood Score" tables (they are templates). So the
# daily mood deltas below are GROK's (unverified) and are marked. Nothing is built.

## 1. THE TABLE: THE SEVEN MOOD BANDS (Mood page, read here)
    band          mood      starting morale rule
    Euphoric      86-100 %  75 % chance to start CONFIDENT
    Eager         73-85 %   50 % chance to start confident
    In Good Spirits 58-72 % 25 % chance to start confident
    Content       43-57 %   the band mood always trends toward. (No start chance is printed for Content.)
    Dissatisfied  31-42 %   can only have STEADY morale or worse
    Disgruntled   16-30 %   can only have WAVERING morale or worse
    Angry          0-15 %   can only have BREAKING morale or worse. "If things don't improve very quickly, this character may decide to desert the company."
Mood sets only the STARTING morale in a fight; morale then moves inside the fight (the rules.json morale block already holds the states and their stat multipliers).
THE DRIFT: "every day, in the absence of other factors or events, mood slowly trends towards 50 percent, or Content."
WHAT MOVES IT, wiki text: winning battles and completing an ambition raise it; losing a brother in battle and dismissing men without compensation lower it. An unpaid wage lowers
it and may lead to desertion (Game Mechanics); an unfed man's mood falls "and after a while and if angered enough" he may desert; a good variety of food (venison etc.) raises it.
THE DELTAS (GROK_141, unverified, from the missing template): not paid -1; a Greedy man not paid -2; not eaten -1; drift toward Content when nothing else happens.

## 2. WHAT TRAITS DO TO THE CLOCK (trait pages, read here; this is the stretch and shrink he named)
    Loyal       50 % LESS likely to desert if unhappy
    Disloyal    100 % MORE likely to desert if unhappy (twice as likely)
    Optimist    negative mood goes away quicker; +33 % positive mood score; cannot take a bad mood from a won battle
    Pessimist   positive mood goes away quicker; +33 % NEGATIVE mood score; may take a bad mood after a won battle
    Greedy      +15 % (the trait table; the Mechanics page says +2 crowns of wage; the two pages differ), asks for raises, takes a bad mood if you buy off a fight
    Spartan     cannot get a good mood from food variety or a bad mood from none; Gluttonous gets more of both
    Expert economic difficulty: deserters TAKE THEIR EQUIPMENT with them.

## 3. THE CLOCK, AS HIS WORDS SET IT, AND A WAY TO READ THE WIKI'S "-1" THAT MATCHES IT
The wiki gives NO day count ("how many days until a man leaves" is not on any page I could read). His rule: a hire walks "a couple of days" after the batteries hit zero, never the same day.
The only thing the wiki fixes is the SHAPE: unpaid pushes mood down by a step a day, and only the Angry band can desert. If one "-1" is one band step (an interpretation, unverified, because the template
that defines the unit is missing), the days to reach Angry for a man who goes unpaid every day are:
    start band        unpaid -1 a day     Greedy -2 a day     Pessimist (x1.33 loss)
    Euphoric          6 days              3                   4.5
    Eager             5                   2.5                 3.8
    In Good Spirits   4                   2                   3
    Content           3                   1.5                 2.3
    Dissatisfied      2                   1                   1.5
    Disgruntled       1                   0.5                 0.8
The drift toward Content adds a little time for the unhappy; the clock stops the day he is paid. A Content hire is Angry on the third day, which is "a couple of days after zero"; a Loyal man halves the chance
he actually leaves once Angry; a Disloyal one doubles it. So his sentence and the wiki fit together with one added assumption, and it gives the table a number to tune: desert.angry_days_from_content 3.

## 4. THE FINDING THAT PROVES US WRONG
THE DEMO HAS NO COMPANY MOOD AT ALL. A search of the fight, the roster and the settlement screen finds no mood or desertion rule; the only "mood" in the demo is a facial brow value and
a spoken tone. So (a) batteries at zero currently cost nothing, which is why the wages row in my sell-ratio and respec pages has no teeth; (b) the starting-morale link (euphoric men start confident
75 percent of the time) that makes feeding and paying a combat matter is absent; (c) "dismissed without compensation", the brother-dies penalty and the ambition reward have nowhere to land.
That is the loop that makes the economy bite in Battle Brothers: unpaid wages -> mood -> morale in the next fight -> desertion. Without it, the economy and the fight do not touch.

## 5. ROWS (proposed, nothing built)
mood.bands (the seven with their percent ranges); mood.start_confident {euphoric 0.75, eager 0.50, good_spirits 0.25}; mood.cap_by_band {dissatisfied: steady, disgruntled: wavering, angry: breaking};
mood.drift_target 0.50 (slow, daily); mood.delta {not_paid -1, greedy_not_paid -2, not_eaten -1}; mood.trait {loyal desert x0.5, disloyal desert x2, pessimist loss x1.33, optimist gain x1.33};
desert.only_when angry; desert.angry_days_from_content 3 (his "a couple of days"); desert.keeps_gear_on_expert true. The unit of "-1" needs one decision: a band step (reads with his clock) or a percent.

## 6. A CORRECTION TO MY 10/9 DIFFICULTY PAGE (found in the same Game Guide pages)
The Game Guide's table "Economic difficulty and other effects" reads: contract rewards Beginner 100 percent, Veteran 100 percent, EXPERT 90 percent; selling prices the same; deserters on Expert "leave with their equipment".
My difficulty-steps page said pay was "10 percent less per level" (from the Game Mechanics wording) and showed Beginner +10 percent with an asterisk as MY reading. THAT READING WAS WRONG: only Expert is lower, by 10 percent, and Beginner equals Veteran.
Corrected in place in the difficulty page and its VOTE page this round.

## ROUTED
- PEOPLE (the voice of an unhappy man, the Angry portrait) and COMBAT (starting morale from mood): section 1 and 5. ECONOMY: the unpaid-wage trigger.
- RUN TWO / roster owner: a mood field per man and the daily tick. TUNING [numbers table]: the rows above.
- Test material: the VOTE page is draft:true.
