# THE TOP BAR CUT ITSELF, AND IT WAS NEVER 3 PIXELS
UI lane (chat 11), 9/15/26. Board row [eyes: bar cut]. Gate: gates/top_bar_gate.js, 15 legs.

## WHAT EYES REPORTED
E26 round 4 (9b8f85e): on the walked city at 390x844, div#barleft ("HUMAN MODE" plus
"SUBURB - ON FOOT") is cut by 3 pixels. The finding had been sitting unread behind an
infrastructure failure: the EYES gate was red on ERR_CONNECTION_REFUSED, a server it never
started, so nobody read past the red.

## WHAT IT ACTUALLY IS
Reproduced, twice, and NOT 3 px either time: 21.4 px over on one run and 62.2 px over on
another. The number moves because it depends on the MUSIC TRACK NAME sitting in the bar at
that moment, and the track changes. A single measured overflow of a bar whose contents
change is a snapshot, not a size.

THE ROOT CAUSE IS A FLEX ROLE, NOT A WIDTH. #barleft was flex:0 1 auto with min-width:0 and
overflow:hidden; #barright was flex:0 0 auto. Read in plain words: the player's own STATE
("HUMAN MODE", "SUBURB - ON FOOT") was the only thing in the bar allowed to shrink, and the
music track title was allowed to take whatever it wanted. The bar told him what song was
playing at the cost of telling him where he was standing.

## THE FIX
The roles are swapped. The state does not shrink (flex:0 0 auto, white-space:nowrap). The
music chip does (flex:0 1 auto, min-width:0, overflow hidden, text-overflow ellipsis), so a
long title ends in three dots instead of eating the sentence next to it. No width was typed
anywhere; a hand-typed width is right the day it is typed and wrong the next time somebody
adds a word, which is the same lesson [rail collides] wrote.

## PROVED
Forced a track title four times too long and measured on the real page: the music chip's box
is 58.8 px against a scroll width of 241 (clipped, as intended), the state is NOT clipped,
the page does not scroll sideways, and nothing is drawn past the screen edge. Three new legs
in gates/top_bar_gate.js carry that, 15 ok / 0 failed, mutation-proved by restoring the old
flex values (2 legs go red).

## THE PART WORTH KEEPING
A number in a bug report about a box whose contents vary is the smallest true thing that was
observed, not the size of the bug. Trusting "3 px" would have produced a 3 px fix.
