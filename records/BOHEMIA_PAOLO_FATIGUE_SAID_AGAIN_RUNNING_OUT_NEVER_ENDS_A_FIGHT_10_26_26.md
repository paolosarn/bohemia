# PAOLO 10/26: FATIGUE, SAID AGAIN: RUNNING OUT NEVER ENDS A FIGHT, AND HE SEES IT COME BACK (LOCKED, rule 285; on rule 283)

## HIS WORDS (verbatim, voice to text)
"Yeah, I hate it, bro. There's no calculations for stamina regeneration especially if I'm ending my turn, not taking any action
because my stamina is getting used to like this cannot be the case, bro it has to bro if I run out of stamina in a match it's over
like what the fuck"
(Said minutes after rule 283. 'Stamina' is fatigue. 'There's no calculations' = he sees no number come back when he rests.)

## WHAT THE CODE SAYS (coordinator, read on main 07:58, not edited)
slices/BOHEMIA_FIGHT.html newRound() line ~1407: 'u.fat = Math.max(0, u.fat - R('fatigue.recovery_per_turn'))', 15, every man on
the field, every round. On paper it recovers. So what he lives is one of these, and COMBAT finds which on the live game:
1. What hits him outruns the 15: struck +5 (fatigue.on_struck), every dodge or block +2 (on_dodge_or_block), a one-hand mace +10,
   a two-hand +20. A shield man with three or four on him gains 15 to 25 a round while 'resting', so the bar never falls.
2. His kit leaves almost no room: fatMax = base + gearFat + bagFat (the car door, body, helmet and bag weights, all negative), so a
   heavy man's ceiling sits a swing or two above where 15 a turn puts him.
3. The live surface (the demo's fight, AUTO's driver, END TURN with nothing spent) takes a path that skips the recovery, or the
   bar on screen is a stale number.
4. Nothing on screen shows a breath coming back, so even when it works he cannot see it ('there's no calculations').

## THE RULE (on 283, which stands)
(a) Running out of fatigue never ends a fight for a man. Rest one turn and he can swing the turn after, every kit, AUTO and by
    hand. Whatever the cause above, that is the felt result.
(b) END TURN with no AP spent is a REST: it brings at least 30 back (283(b)), and the hits taken while resting cannot cancel the
    rest [COORDINATOR'S DEFAULT, rule 205: the fatigue a rested man takes from being struck or blocking comes off the next turn's
    rise, never off the 30].
(c) He SEES it come back: at the start of each of his men's turns the fatigue bar drains with a breath icon and the number back
    (+15, +30 after a rest), on the man and on his card; the bar shows faintly how much comes back next turn. Icons, not words.
(d) RECOVER (halve it) a button any man can press when winded (283(b)).
(e) The gate (on 283(d)): rolled fights, AUTO and by hand, the worst kit on the roster (car door, heaviest body and helmet, a full
    bag) surrounded by three: rest one turn, then a swing; the bar on screen equals the engine's number every turn; the breath
    number shows every one of his turns.
(f) COMBAT [fatigue comes back every turn] IMMEDIATELY after [one pace, on the beat] ships, nothing between; line 225.
