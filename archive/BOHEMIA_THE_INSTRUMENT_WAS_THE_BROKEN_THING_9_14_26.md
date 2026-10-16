# THE INSTRUMENT WAS THE BROKEN THING
FACTIONS lane · THE FIVE MINUTES (rule 14), round six · 9/14/26

## THE ONE LINE
The round went looking for more dead features in this lane and found almost none.
What it found instead was that **the tool rule 14(g) points every lane at could not
get into the city view at all**, because its two fingers landed on a button
instead of the canvas. Any lane using it to check the map, the territory or the
feed would have come back certain all three were dead.

## WHY THE ROUND WENT LOOKING
Last round this lane found that a shipped feature had been invisible for a week
while every check stayed green, because its checks were **greps**. So the handoff
said: go through every other row this lane owns and ask which have ever been read
off a real frame. Counted first:

    this lane's main gate, 207 claims
      44   GREP-ONLY     only match text in a file
      36   DRIVEN        read a value back from a real page
     127   computed      module logic, no file text at all

44 claims that prove code exists and nothing about whether a player sees it.

## AND THE AUDIT CAME BACK GOOD, WHICH IS ALSO AN ANSWER
Every visible thing this lane ships was opened on the demo, on a phone, and read
off the page:

| what | where | on the glass |
|---|---|---|
| THIS GROUND / RENT TONIGHT | the standing card | yes |
| WOULD COME WITH YOU | the standing card | yes |
| WOULD FOLLOW YOU | the standing card | yes |
| the joiners line | the town market card | yes |
| territory borders | the map | 14 outfits' ink |
| the cut-off lights | the map | 205 lit |
| footprints | the map | see below |
| the street's sentences | on foot | yes, fixed last round |

**And the number really does depend on the ground**, which is the whole promise of
that row: stood at twelve real places and got ten different answers, from 20 to
243, with a different mix of trades at each.

## THE FOOTPRINTS LOOKED DEAD AND WERE NOT, AND THE DIFFERENCE IS THE DAY
At the door the map's track layer runs and paints **nothing**: 28 parties, and
every trail exactly one cell long, when a line needs two.

That is not a bug. At 06:00 on day one **nobody has walked anywhere yet**, so every
party is still standing on its own doorstep. Let the valley go about its business
with its own mover and the ground fills in:

    at the door        longest trail  1    outfits on the glass  0
    +1 hour            longest trail  6    outfits on the glass  9
    +4 hours           longest trail 13    outfits on the glass 10

A check that read the door and cried would have been lying about the game. So the
gate now says the dawn zero out loud as the truth rather than testing around it.

## THE THING THAT WAS ACTUALLY BROKEN
The seam into the city view is crossed by a pinch. Driven on the demo:

    fingers together, toward the city    mode human, HZOOM 44, NOTHING, every time
    fingers apart, back to the street    HZOOM 44 -> 88, worked fine

One direction worked and the other did nothing at all, which is not how a gesture
fails. Asked the page who was under each finger:

    elementFromPoint(centre - 150, centre)  ->  DIV#rungbtn "STANDING"

The pinch laid its fingers 150 px apart across the middle of a 390 px phone, and
the left edge of this game is a rail of controls. **A pointerdown on a button never
reaches the canvas**, so the canvas only ever saw one finger and its two-finger
branch never ran. The same squeeze laid up and down instead:

    mode human -> CITY, HZOOM 44 -> 11, on the first try

**Nothing was wrong with the game.** The seam obeys Paolo's own 8/2 ruling, *"i
should be able to ZOOM OUT UNTIL I GET INTO THE CITY BUILDER MODE BRO"*, and it
opens on the first honest squeeze. What was wrong was the thing every lane
measures with. Four gates already load it and not one checked it.

It asks the page who is under each finger now and picks a clear axis, so a rail
added later cannot quietly break it again.

## AND A SECOND ONE IN THE SAME TOOL, FOUND BY THE GATE AN HOUR LATER
Two other lanes landed changes in the same driver mid-round, and the new gate
immediately went red on the merged tree with every finger reporting a DIV. Asked
the page what was stacked over the glass:

    DIV.dcbtn  ->  DIV#daycardIn  ->  DIV#daycard.on  ->  CANVAS#cv

**The day card was up over the whole canvas.** The driver's card sweep gave up the
moment one pass found nothing, so a card that appears a beat after the sweep was
never cleared, and every pinch, tap and reading after it went through a card.

The sweep is patient now, and its finishing test is not "did I press something" but
**"is the canvas actually reachable"**. It also presses the card's own way out
rather than only guessing at labels, because guessing at labels is a trap this file
already records having fallen into once.

## AND WHILE I WAS IN THERE, THE OTHER LANE'S GATE CAUGHT ME
The road lane's check went red on **this lane's** line, and it was right. Their
claim: *"it is said while somebody is there and gone once nobody is."* Last round's
fix cleared when **he moved**, which is nearly the rule and not the rule.

Three rules were tried for one sentence, and only the third is its own:

    every frame     nobody can read it, about a sixtieth of a second
    when he moves   stays up for a body he walked away from
    THIS            said while somebody is in your way, gone once nobody is

The game could answer it the whole time: `ctBlocked` is the same predicate the
**step** asks before it says anything, and this feature's own comment already said
*"they only hold it while you are beside it"*. Both gates are green on the third
rule; their wording named it before my code did.

## GATES
- `the_driver_reaches_the_city_gate` — **new, 7/0**. Proves the shared instrument can
  produce a positive before anybody trusts a negative from it, and pins that both
  fingers land on the canvas. Mutation: force the old across-the-rail axis, 2 red.
- `faction_towns_gate` 203 -> **208/0**. Five driven claims replacing greps on the map
  layer: a player really reaches the map, the dawn zero is the truth, the footprints
  really paint once the valley has walked, in more than one outfit's ink, on the same
  frame as the borders. Mutation: make the layer draw nothing, 2 red, and the red says
  *22 of 28 trails long enough to draw, 0 painted* — the model is fine, the render is not.
- `against_gate` 86 -> **87/0**, rewritten onto the true rule. Mutations both ways:
  clear while the body is still there, 2 red; never clear at all, 2 red.
- The road lane's `the_moment_ends` is back to **18/0**.

## RULE 14, OBSERVED
No demo cut, no alpha touched, no build stamp. Sixth round running.

## [PENDING Paolo] — NOTHING NEW

## AND ONE QUESTION CLOSED WITHOUT A FIX
The handoff asked what this lane's map layers look like at the far zoom, since
nobody had looked. Looked: **the next stop out is not a far map, it is the planet**,
with a placeholder sky. There is no zoom that shows the valley and drops the
territory. The worry was unfounded and the cull is right.
