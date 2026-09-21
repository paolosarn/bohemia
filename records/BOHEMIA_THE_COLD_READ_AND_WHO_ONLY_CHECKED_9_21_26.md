# TWO ROUNDS IN ONE: MY RATCHET CRIED WOLF, AND ELEVEN LANES HAVE NOT COOKED

PLUMBER lane, 9/21/26. Rows [cold read] and [cook gate].

## PART ONE: [cold read] -- I SHIPPED A RATCHET THAT REFUSED A CLEAN TREE

WORLD ran NEVER WORSE for the first time in a fresh container, on an UNCHANGED tree, and
it said no:

    tappableMs   548 -> 1223   REFUSED (allowed 740)

Eight runs after it read 555 to 660. Every lane's first run is the cold one, so the thing
I shipped last round says no to good work once per lane per round, and teaches re-running
until it agrees. That spends exactly the authority the row exists to build. A ratchet that
cries wolf on its first run is worse than none.

### THE MECHANISM, REPRODUCED BEFORE IT WAS FIXED

Five loads of the same page in ONE browser, one unchanged tree:

    load 1   1240 ms
    load 2    620 ms
    load 3    625 ms
    load 4    598 ms
    load 5    589 ms

The first load is twice the rest and the rest agree inside 6%. WORLD saw 1223 where I saw
1240, which is the same number. THE COST IS THE FIRST LOAD -- cold HTTP cache, cold code
cache -- not the container being generally slow. So one reload fixes it for about a
second, rather than a whole extra boot.

WHAT I CANNOT CLAIM: I reproduced this at the BROWSER level. WORLD's was a fresh
CONTAINER, which also pays cold disk. I cannot make a fresh container from here, so that
half is inferred from the two numbers agreeing, not measured.

### THE FIX, AND BOTH NUMBERS SURVIVE

The driver takes an opt-in `warmup`: load, then reload, and stamp the second load. The
ratchet scores that. The cold first load is kept and printed as `tappableColdMs`, because
THAT is what a stranger actually gets. Reporting only the warm number would be this lane
flattering itself; the cold one is simply not a number two runs can be compared on.

    TAPPABLE AT      424 ms   SCORED: the second load
    cold first load  603 ms   what a stranger gets, reported and not scored

### AND THE SAME LESSON A SECOND TIME, IN THE SAME FILE

Fixing the load exposed the next one. The bar had been set from a SINGLE run, which
stored `frozenMs = 0` -- and zero is the luckiest value a rare-event count can have. The
next honest runs froze once (517-633 ms) and then twice (1167), and the ratchet refused a
clean tree again. Adding slack for one freeze had only moved the cliff to two.

A NUMBER THAT APPEARS AS NONE-OR-SOMETIMES CANNOT BE PINNED FROM ONE SAMPLE. So accepting
now walks the cut several times and keeps the WORST of each number, which is the shape
gates/bohemia_phone_perf.js settled on for the same reason on 9/5. Scoring a push is still
one run; accepting is the deliberate, rare act and it is the one that can afford the time.

    what 3 walks saw                  the bar taken from them
    tappableMs    448, 457, 431   ->  457
    frozenMs      517, 1167, 633  ->  1167
    aimedWrong    0, 0, 0         ->  0
    cellsCovered  81, 64, 43      ->  43
    pageErrors    0, 0, 0         ->  0

### BOTH SHIP TESTS RE-RUN AGAINST THE NEW BAR

    CONTROL, an honest cut:    tappable 457 -> 424 better, frozen 1167 -> 550 better,
                               cells 43 -> 59 better.        NOT REFUSED, exit 0
    PLANTED, --plant 2500:     tappable 457 -> 2881 WORSE (allowed 617),
                               cells 43 -> 2 WORSE.          REFUSED, exit 1

It still says no to a real regression, and it no longer says no to a cold one.

## PART TWO: [cook gate] -- HIS COMPLAINT, MEASURED

PAOLO 9/21: "I'll enter the sound chat and it's not even making fucking sounds. It's
coding and checking whether the sounds are broken or not. I NEED TO BE SEEING THEM COOKING
UP MORE, EVERY TIME, NOT NEVER."

Rule 22(e) makes that a gate. `gates/cook_every_round_gate.js` compares two dates that
both exist and neither of which is inferred: the newest thing a lane REGISTERED in the
vote registry, and the newest commit that lane LANDED on main under its own prefix.

    LANE          LAST COOKED                        LAST LANDED   VERDICT
    SOUNDS        nothing, ever (owes a sound)         09-20       NEVER COOKED
    UI            9/15 FIVE WAYS THE QUEUE READS       09-20       CODED SINCE by 5 days
    COOK          nothing, ever (owes a tile)          09-20       NEVER COOKED
    CHARACTER     9/18 THE 12 PEOPLE ON YOUR STREET    09-18       cooked
    ANIMATION     nothing, ever (owes a clip)          09-20       NEVER COOKED
    PORTRAIT      nothing, ever (owes a face)          09-20       NEVER COOKED
    WORDS         9/15 THE CARD AT THE END OF YOUR DAY 09-20       CODED SINCE by 5 days
    PEOPLE        nothing, ever (owes a person)        09-20       NEVER COOKED
    LIFE+CITY     nothing, ever (owes a building)      09-20       NEVER COOKED
    FACTIONS      nothing, ever (owes a sign)          09-20       NEVER COOKED
    QUESTS        nothing, ever (owes an ask)          09-20       NEVER COOKED
    WORLD         nothing, ever (owes a thing on the phone) 09-21  NEVER COOKED

**ELEVEN OF TWELVE MAKING LANES HAVE CODED SINCE THEY LAST COOKED. NINE HAVE NEVER
REGISTERED ANYTHING AT ALL.** Only CHARACTER is current. He was not exaggerating, and the
registry has only sixteen items in it from four lanes.

IT LANDS RED ON PURPOSE. That red is the measurement, not a defect in the gate, and rule
22(e) calls for a row-level red rather than a push blocker.

### WHAT IT DELIBERATELY DOES NOT CLAIM

It cannot say WHICH round was empty or how many were. A round is one VAMILY and nothing
in the repo marks where one ends. A lane that cooked on Monday and landed three rounds of
code after reads the same as a lane that landed one. The gate says "this lane has coded
since it last cooked", names the gap in days, and stops. Inventing a round marker to make
a bigger claim is how a checker starts lying, and this lane has spent four rounds proving
what that costs.

Exemptions are the rule's own, not mine: research lanes are not held, only the twelve
lanes 22(a) names are, and an item voted away still counts as cooked. PLUMBER, RUN,
DIRECTION and COMBAT are not making lanes and are not held -- that is what 22(a) lists,
not a favour I wrote for myself.

## FLOORS ON BOTH

An unreadable registry or unreadable git history FAILS the cook gate rather than passing
it. A cook gate that passes because it found no registry is the loudest possible form of
green over nothing, and this lane has shipped three gates with that defect already.
