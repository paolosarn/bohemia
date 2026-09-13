# THE CARD DID NOT FIT A PHONE
FACTIONS lane · THE FIVE MINUTES (rule 14) · 9/13/26

## WHAT THIS ROUND WAS
Rule 14(b): a building lane with no five-minute break holds its claim and adds
nothing. **None of the seven breaks he named is a faction reading** — streets and
sidewalks, the flat freeway, PRETTY MAP and DROP IN, cards that promise and do
nothing, no fight in five minutes, no fast travel, glitches. So `[same lender]` is
claimed and **held**, nothing new was built, and the round went on the five minutes
themselves: walk the demo on a phone and answer for what this lane put there.

## WHAT THE WALK FOUND, AND IT IS MINE
    the card is 975 px of content in a 780 px window       195 px off the bottom
    rows on it                                             16
    rows this lane put there                               10, 348 px of the height
    what was cut off                                       this lane's own answer

WHERE YOU STAND is the card this lane has been loading up for four rounds. On a
phone the bottom of it — WOULD FOLLOW YOU and the sentence under it — **is off the
screen**, and so is CLOSE. His words were *"nothing's complete... I would like to
see the tiny parts come more together."*

## THE FIX ADDS NOTHING AND DROPS NOTHING
    RENT      3 rows + 2 sentences  ->  1 row + 1 sentence
    THE MIX   4 rows (one per trade) ->  1 line
    SPARES    1 sentence            ->  gone, folded into the mix line

Every fact survives: what it costs, how much of what you use they charge for, what
tonight stands at, whether walking on is free, when it is due, how many would come,
the trade mix, how many would follow. A row per fact is how a card stops fitting a
phone.

    before   content 975, window 780, overflow 195, rows 16, mine 10
    after    content 710, window 710, overflow   0, rows 10, mine  3

The whole card, CLOSE included, is on one phone screen.

## AND THE SPARE SENTENCE WAS SAYING THE MIX AGAIN
*"A fortress spares every trade standing on it: scavenger, worker, watch and
keeper"* sat directly under a list of exactly those trades with their counts. Only
spared trades are ever offered, so the mix line **is** the spare list. Two lines
saying one thing is precisely the not-coming-together he means. The tier moved onto
the mix line and the sentence went.

## TWO THINGS I NEARLY REPORTED AS BUGS AND WERE NOT
**Every control on the street is twelve pixels tall.** SLEEP, ◆ STANDING, SCAVENGE,
BUILD HERE, BIKE, ⤒ CITY — all 12 px high, well under the 44 px thumb floor this
repo has a law about. That is **Paolo's own ruling** ("for the run right now make
all the UI 50% smaller, I don't give a fuck") with the reach kept at 44 by spreading
the column: 12-tall chips at a 30 px gap is a 44 pitch. And it works — a real mouse
press at the PHONE button's centre opened the phone, which is the exact test the UI
lane named as the one that settled it. **A box height is not a reach**, and I was one
step from filing a locked ruling as a defect.

**The offer card's haggle buttons.** *Make it a bag instead / Make it a favour
instead / Half of it now, before I go* — pressed each one on a real tap; the card
changed every time. Not a 14(d) case.

## WHAT I DID NOT DO, ON PURPOSE
**No demo cut** (14a: only RUN re-cuts it) and **no alpha touched**, which also
means no build stamp this round. The change is entirely in the city file, which both
the workshop and the demo load by reference, so it reaches the demo without the
cutter — and the demo stays a byte-identical cut of an unchanged workshop, so the
demo build gate stays green instead of red. That is the way past the trap PEOPLE
named: a lane that changes only the city never has to choose between his ruling and
that gate.

**And my own land script was breaking 14(a) once a round without anybody typing it**
— it ran the demo cutter on every land. Removed.

## GATES
`faction_towns_gate` 201/0. **Five of its checks went red on correct code and were
followed, not loosened**: they pinned the row labels this round deliberately
collapsed (`WHAT IT TAKES`, `TONIGHT SO FAR`, `ANOTHER BLOCK OF THEIRS`, the spares
sentence). Every one of them still asserts the same claim — all four rent facts are
on the card, the card names the crowd and the trades, the reading answers in CITY —
by the spelling the card now uses.

One real bug came out of that: the first tightening always said *another block of
theirs*, which is wrong by one on ground you have just stepped onto. The `counted`
distinction is back, as a ternary rather than a row.

## [PENDING Paolo] — NOTHING NEW
Nothing here needed a ruling. It is his own five-minutes law applied to this lane's
own card.
