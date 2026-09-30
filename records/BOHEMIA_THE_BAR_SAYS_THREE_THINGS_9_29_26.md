# THE BAR SAYS THREE THINGS: BUILT, NOT ASKED (UI lane 11, ui-kmqmrf, 9/29/26)
# Row [bb interface], round eight. Rule 39(a) BUILD IT, DON'T ASK (Paolo 9/28); rule 40(f) the hold is
# lifted for the map (Paolo 9/29). Library vol 10: on the Battle Brothers map the top bar is the
# feedback of travel.

## WHAT CHANGED
The demo opens on the map (RUN e4c66f2). Its top bar was 50 px of black with one NOTES button, and the
hour moved only on the phone's few-pixel status clock. His vote item WHAT THE BAR SAYS had waited three
rounds with my default written on it (B: batteries, the hour, where you are). Rule 39(a) says a round
that ends in a question instead of a thing is a failed round, so B is BUILT:
    [battery] 0   06:00   SUBURB                                             NOTES
Three lit plates in the bar's own chip language, left of NOTES. On the map only (MODE==='city'); the
walked street is dead as a surface (38b) and keeps its old bar in the alpha.

## EVERY READING IS THE GAME'S OWN FACT
    batteries  purseBalances().electricity  (batteries are the money, 9/4; electricity is that
               currency's key in the purse; the player starts at 0, "the game starts in the ruin")
    the hour   clockStr(), the part after the dot -- the same function the phone's clock reads
    where      om.at(city.x, city.y).district -- the same lookup updHud writes into #hslot
A reading draws itself or does not draw: no placeholder, no invented zero. While the three show, the old
words for the same facts (#hmode, #hslot, #barmid) step aside so nothing is said twice.

## MEASURED ON THE REAL DEMO, THROUGH THE ONE DRIVER
At the door: 0 / 06:00 / SUBURB, equal to the purse, the clock and the district. Tap the map to
travel, 3 s later: 0 / 06:26 / FREEWAY, still equal. The strip is 140 px wide, ends at x 156 against
NOTES at 338 (390 wide) and 162 against 268 (320 wide). pointer-events:none: a finger at each reading
lands on the bar. 0 page errors.

## THE GATE AND WHAT IT CATCHES
gates/the_bar_says_three_things_gate.js 15/0, on the demo, refusing to report if the driver never got
past the door. THREE MUTATIONS, each caught and restored byte-identical:
    never paint the readings           -> 8 red
    freeze the hour at 06:00           -> 2 red (the bar stops being the feedback of travel)
    let the readings take a finger     -> 2 red (the source leg AND the finger on the glass)
AND THE GATE'S OWN HOLE, FOUND BY THE FIRST MUTATION: with nothing drawn, "fits left of NOTES at 390"
still PASSED, because the right edge of no chips is -Infinity. Both fit legs now require all three.

## WHAT THIS DOES TO THE DEMO, SAID TO RUN
The demo references the city world, so the three readings show on the demo's map too. RUN's cut strips
#hmode,#hslot,#barmid,#hclock by name (18g, "the day readouts"); #barread is new and not in that list,
ON PURPOSE: the demo's first screen is where a friend needs to feel time pass while travelling. If RUN
wants it off the demo, one id in the strip list does it. Default per 39(a): on.

## THE VOTE ITEM
ui-what-the-bar-says-9-27 stays in the VOTE tab, and its words now say B IS IN THE GAME: tap A or C to
change it. Correct-after, not approve-before (EVERYTHING IS A THUMB, 8/9).

## ALSO THIS ROUND
[faces blank] goes to DYNASTY, who claimed [one then heirs] (rule 39c: ONE face on the phone until the
second generation): the same paint path, the same one-line fix, handed over with the proof from round
seven rather than landed in a strip another lane is rebuilding.
