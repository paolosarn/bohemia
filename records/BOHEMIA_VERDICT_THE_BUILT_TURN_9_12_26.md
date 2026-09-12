# VERDICT: THE FIGHT TURN, JUDGED BY SECTION 6 (DIRECTION, 9/12/26)
# [judge the turn] reclaimed and shipped on this judgment. COMBAT's build:
# their [enter zoom] ship (the zoom and the shade are the city's, the fight
# loop pays zero). Judged frozen, on the live page, with my own instrument -
# never their numbers alone.

## VERDICT: PASS

Frozen frames drawn by the build's own shade function on the live canvas at
five points of the move (u = 0.15 / 0.35 / 0.55 / 0.80 / 0.95), measured
synchronously so the game loop could not repaint over them:
1. THE CORE STAYS INSIDE ITS CAP: core-level coverage (pixels multiplied
   below 0.855) peaks at 48.8% against the card's 60% ceiling - and my
   independent instrument lands within half a point of COMBAT's own 48.3,
   two instruments agreeing.
2. NEVER ALL FOUR EDGES: top and bottom edge bands read 0% shaded at every
   point of the move; the shade owns at most two edges at once.
3. IT TRAVELS ONE WAY: the left edge carries the shade early (57% at
   u=0.35), the right edge late (53% at u=0.95), never both fully - it
   enters, crosses, leaves. A shadow that crosses reads as sky.
4. VALUE ONLY, BY ARITHMETIC: black-at-alpha compositing multiplies every
   channel equally; measured channel disagreement peaks at 0.079, which is
   exactly one 8-bit rounding step on dark values (a channel of 13 can only
   move in steps of 1/13). No hue or saturation drift exists to see.
5. THE FROZEN FRAME IS STILL THE STREET: records/target/DIRECTION_THE_TURN_
   FROZEN_AT_THE_SWAP_9_12_26.png - palette intact, sidewalk and asphalt
   and the dressed body all read, no white fog, no full-frame dim.
   Greyscale survives by construction (point 4).

## RULED WHILE JUDGING
COMBAT marked the travel direction draft:true (no wind in canon). Ruled
into the card as section 5B: LEFT TO RIGHT, always - one direction is what
makes repetition read as weather.

## ONE NOTE ROUTED, NOT A RED
The generic street-to-map move (DROP IN's transition()) still veils the
whole frame at up to 0.9 - the exact "fade-to-black in a costume" the card
bans FOR THE FIGHT. The card governs the fight turn, so this is legal
today, but the game now owns a correct cloud mechanism and a wrong old
veil side by side; one mechanism should win eventually. For the
coordinator's board, whoever owns DROP IN.

Proof: measurements in this record; instrument in the session scratchpad
(fzjudge2); evidence frame in records/target; the card amendment in the
same commit.
