# THE FIRST JOB CANNOT BE THE PUMP, ON THE ONE SEED THIS GAME SHIPS
QUESTS lane, 9/16/26. VAMILY row [light the pump] THE-FIRST-JOB-OF-THE-GAME,
claimed 002000b. Written instead of building, under STOP PRODUCING (7/26):
"a turn that says 'I stopped, here is the one thing blocking everything' is a
GOOD turn."

## THE ROW
"water is the valley's utility, one lit pump lifts all 18,524 litres a day and a
second adds zero, and ON ONE SEED IN THREE the valley boots with every pump dark.
The first thing a player does in act one: walk to the dark pump and light it, for
one battery, and the taps run... minutes away not hours, visible change: the water
line on the night card." (coordinator 9/15, from ECONOMY Q44 6c353443)

Everything in it is TRUE. It still cannot be built, for three independent reasons,
each measured on the shipping build.

## 1. THIS GAME HAS EXACTLY ONE SEED, AND IT IS NOT ONE OF THE DARK ONES
    slices/BOHEMIA_CITY_WORLD.html:32010   const BOH_SEED_TEXT='bohemia';
    slices/BOHEMIA_CITY_WORLD.html:32011   BOH_ONE_SEED() = BOH_HASH_SEED(that)
    measured on the demo and the workshop: seed 2691674296, both.
There is a gate (one_seed_gate.js) whose whole job is to stop that drifting. So
"one seed in three" is a true statement about seeds in general and an inapplicable
one here: every player gets the same valley, every boot.

MEASURED ON THAT VALLEY, and the city's own pumpStations() agrees word for word
("On this map that leaves the pump station and both treatment plants running and
the three reservoirs dark"):
    pumpstation  24,75   27 cells away   LIT
    watertreat   19,80   32 cells away   LIT
    watertreat   20,80   32 cells away   LIT
    reservoir    60,10   38 cells away   dark
    reservoir    10,29   38 cells away   dark
    reservoir    87,60   39 cells away   dark
The water already runs. The nearest DARK plant is 38 cells away, which is the row's
"hours", not its "minutes".

## 2. LIGHTING A DARK PLANT CHANGES NOTHING, AND THE MODULE SAYS SO ITSELF
bohemia_pumps.lift() is explicit: "More running stations do not make more water
than the valley can drink." Run against the real six stations, 4,631 living:
    as it ships          18,524 L   3 running   3 dark
    all six lit          18,524 L   6 running   0 dark
    LITRES GAINED             0
    the card before      "The pumps are running. MOB hold the water."
    the card after       "The pumps are running. MOB hold the water."
Identical sentence. So the quest would end with the player having walked across the
valley to change a word that does not change.

THIS IS RULE 14(d) BY CONSTRUCTION -- a card that promises something and does
nothing -- and it is refused by this lane's OWN first gate: bohemia_asks.offer()
throws away any candidate that cannot name a visible change. I would have had to
defeat my own law to ship it.

## 3. AND THE VISIBLE CHANGE IT NAMES IS ON A CARD HE NEVER REACHES IN FIVE MINUTES
The water line renders from PUMPS_TONIGHT, which pumpNight() sets at NIGHTFALL. A
five-minute first session never gets there. Even a working water quest would pay
off on a screen the break it is meant to fix never shows.

## WHAT IS TRUE AND COULD CARRY A FIRST JOB, MEASURED, NOT CLAIMED
Offered for the coordinator to re-point the row; NOT built, because choosing among
these is a ruling and rule 10 says lanes do not add jobs.
  a. ONE FACTION HOLDS EVERYBODY'S WATER. All three running plants are held by the
     MOB on this seed, and the card already says so. "Whoever holds the pumps holds
     the valley" is live, true and dramatic on the shipping build right now.
  b. THE WATER IS ONE UNPAID BILL FROM STOPPING. [lights bill] already makes a
     circuit nobody pays for go dark and STAY dark, and pumpStations() already ties
     a plant to the street circuit it fronts. A first job about keeping the valley
     drinking has real stakes and a real visible change (the card flips to "All
     pump stations are dark"), where lighting a spare reservoir has none.
  c. IF THE ROW IS KEPT AS WRITTEN it needs either a seed where the near pump is
     dark, or the night card's water line surfaced somewhere a five-minute player
     actually sees.

## WHAT THIS LANE DID NOT DO, ON PURPOSE
Did not build a quest that adds zero litres. Did not re-point its own row (rule 10).
Did not re-cut the demo (rule 14a). The claim is held, not returned, so the row has
an owner the moment it is re-pointed.
