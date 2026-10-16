# RUN IS ONE BUTTON, AND IT SITS WHERE YOUR THUMB IS

Paolo, T4: "I want to remove some of the things off the top menu and make them
more intuitive and awesome with the UI of action movement... for the run which
you're gonna smart combine with the dash involvement maybe like if you run
towards a Cover it takes two stamina instead of one, and then it will
automatically do the move... first off the top menu removing the dash and vault
button definitely I never use them and I think I'd rather incorporate them in a
standardized run button next to the actual action in movement buttons actually
on screen."

---------------------------------------------------------------------------
## WHY HE NEVER USED THEM, AND IT IS IN THE CODE

DASH and VAULT were two of fourteen buttons in a row at the TOP of the screen,
and the thing they do happens at the BOTTOM of the screen, on the ring, with
his thumb.

DASH did not even act on its own. It ARMED. So the sequence was: reach to the
top of the phone, tap DASH, travel all the way back down to the ring, tap a
direction. Two taps at opposite ends of a phone for one move.

VAULT was worse. It is a button that does nothing at all unless you are already
standing next to a specific kind of pillar, so most of the times he tapped it
he got a refusal message.

Nobody uses a verb that lives on the other side of the screen from the hand
that performs it. He was not failing to learn the buttons; the buttons were in
the wrong place.

---------------------------------------------------------------------------
## RUN IS ONE VERB THAT KNOWS WHAT YOU MEANT

It sits in the thumb cluster, on the ring, where the movement already is. Tap
RUN, tap a direction, and it looks down that line and does the right thing:

    THERE IS COVER OUT THERE      you go ALL THE WAY TO IT, automatically,
                                  2 pips. His words exactly.
    IT IS LOW AND YOU ARE ON IT   you go OVER it. That is VAULT, with no
                                  button and no refusal.
    NOTHING OUT THERE             one tile, 1 pip. The 8/1 sprint ruling,
                                  unchanged.

It keeps DASH's real payload: the run is FREE (your turn does not end, nobody
shoots) and arriving somewhere new BREAKS THEIR RED LINES. Dash's point was
never "two tiles" -- it was that the fight loses track of you. Running into
cover does that better, for the same 2 pips.

MEASURED over 200 real spawns, eight directions:
    86 ran all the way to cover      91 no cover down that line, one tile
    23 refused (already against it, or the landing cell blocked)
    0 landed short      0 console errors
And the two edge cases, forced: a LOW pillar one tile away gets vaulted (you
end up past it); a TALL pillar one tile away is refused with ALREADY ON IT.

THE GRENADE CAME DOWN TOO, same reason, same fix: "I want a grenade button next
to the action and directional movement buttons as well." It is the same button
calling the same doThrow, in the thumb cluster. The top-row GRENADE stays for
a desktop cursor. THE MINI-GAME HE FLOATED IS NOT BUILT: he said "should
probably have its own mini game too potentially", and "potentially" is not a
ruling. It is on the ask list.

---------------------------------------------------------------------------
## TWO THINGS I MEASURED THAT WOULD HAVE SHIPPED BROKEN

**THE BUTTONS COVERED TWO OF HIS DIRECTIONS.** My first placement was
left:-56px. Measured on the real surface: RUN overlapped the W and NW pips and
GREN overlapped the W and SW pips. The direction pips sit at R=66, which puts
the W pip's left edge 34px outside the wrap, so anything at -56 with a 46px
width eats it. Moved to -100px and re-measured: zero overlaps, and every one of
the eleven buttons in that corner receives its own tap.

**RUN WALKED ME INSIDE A WALL.** The first cut spent the pips first and
refunded on refusal. A TALL pillar already one tile away gives stop = L-1 = 0,
the no-move fallback pushed one tile FORWARD, and RUN put me standing inside a
solid wall for 2 pips. That is an OCCUPANCY LAW break shipped by a convenience.
Now every check happens BEFORE a single pip is spent, and all three branches
test the destination against the pillars and against every living man on your
floor.

Neither of those was caught by reading the code. Both came from measuring the
real surface, which is the 7/18 law and it keeps paying.

---------------------------------------------------------------------------
## WHAT IS DELIBERATELY NOT DONE

doDash, doDashMove and doVault are NOT deleted. GRAVEYARD IS FINAL cuts both
ways: nothing dies without his word, and he said remove the BUTTONS. The
functions stay callable and unwired, so either verb is a one-line restore
instead of a rebuild.

SPRINT stays on the top row. He named dash and vault; he did not name sprint,
and sprint is the toggle he re-ruled on 8/1 (one tile, one pip, free move).
Removing it would be me deciding something he did not.

---------------------------------------------------------------------------
## THE GATE

Eight new checks in gates/combat_lab_gate.js. Negative-tested: all eight fail
on an unpatched alpha. Two existing checks migrated with the supersession
named -- the V54 toolkit check now names the four buttons that exist (RUN is
disabled in the aim phase like the rest of the toolkit), and the enemy-facing
cover-call count goes 3 -> 4 because runBreakLocks carries its level like every
other call. The invariant is that no enemy-facing call may be levelless, not
that there are exactly three of them.
