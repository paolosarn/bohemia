# THE STREET WAS NEVER ON THE GLASS
FACTIONS lane · THE FIVE MINUTES (rule 14), round five · 9/14/26

## THE ONE LINE
Three shipped features have been invisible to every player who ever opened the
game. The tracks under his feet, the block that does not want him, and the road's
own encounter lines all write to one shared line, and the pack pass wiped that
line at the end of **every frame** whenever nothing was warning him. Measured on a
walk out of the demo's own starting spot: the street had something true to say on
**2 of 60 steps and said it 0 times.** It is 2 of 2 now.

## HOW IT WAS FOUND, AND IT STARTED AS A CLEAN-UP
Round four fixed one writer that did not tidy up after itself. The handoff named
the obvious follow-up: sweep for the next shared element before it makes the same
glitch. **The sweep says there is no next one.** Of 73 elements written by name in
the city, `#packline` is the only one with more than three writers:

    #packline   6 writers   ctAgainstClear ctAgainstSay packButton trackSay walkSay wire
    #cbprice    3 writers   cbPaid cbPermitOk cbTill
    everything else  2 or 1, and nearly every pair is one owner in two halves
                             (an init and an update), not five strangers

So the sweep came back almost empty, and the interesting question was the one left
over: **is anything written to that line ever actually seen?**

## THE ANSWER WAS NO, AND THE GATES ALL SAID YES
[tracks read]'s claims were greps. A grep proves the code exists. So it was driven
on the demo, on a phone, reading both the text **and** whether the element is on
the glass:

    trackSay() alone                 "Church came through here just now."   SHOWN
    one real render() frame          the same text                          hidden
    ten real frames in a row         hidden, hidden, hidden ... every one

`render()` opens with the street speaking and later runs the pack draw pass, which
ends in `packButton()`. That function's last branch was:

    else if (!near) { l.style.display = 'none'; PACK_SAID = 0; }

It hid the whole shared line, **whoever had written it**, whenever no warning pack
was near. Measured in ordinary play: `PACK_DREW` 0, `PACK_NEAR` false. So that is
almost always.

## THE NEGATIVE CONTROL NAMED THE CULPRIT AND CLEARED THE OTHER SUSPECT
Two suspects, tested one at a time and together, same session, same camera:

    TRACKS    as shipped              hidden        packButton removed    SHOWN
    CROSSING  as shipped              hidden        packButton removed    SHOWN
    CROSSING  my own clear removed    hidden        both removed          SHOWN
    ROAD      as shipped              hidden        packButton removed    SHOWN

Every row with `packButton` in is hidden. Every row with it out is shown. One
function, three features.

## THE FIX IS THE DISCIPLINE ALREADY WRITTEN IN THE FILE TWICE
The tracks already clear **only their own words**, and round four gave the crossing
line the same manners. The pack now does too: it remembers what it wrote and hides
only that. Its own sentence still goes away when nothing is warning you, which is
the over-fix this must not become.

## AND THEN THE GATE CAUGHT A SECOND ONE, MINE, FROM ONE ROUND AGO
Writing the check for "does it survive a real frame" made round four's own fix go
red, and it was right to.

    somebody steps into your way. they meant to.   ->   ""   after ONE frame

`ctAgainstClear` hangs off `dayDistrictCheck`, and that opens **every `render()`** —
sixty times a second, not once per step. So round four swapped a sentence that
stayed forever for a sentence that lived about a sixtieth of a second. **Both
score "the line is not stale" perfectly.** It clears when he MOVES now, measured
against the cell he was standing in when it happened.

**A FRAME IS NOT A STEP**, and a fix that is never seen is the same bug wearing the
opposite coat.

## WHAT ROUND FOUR ACTUALLY FIXED, SAID HONESTLY
Round four reported a sentence sitting on the street for forty blocks. That was
true in the page and it did silence the track line, so the fix was right. But that
walk was driven with `dayDistrictCheck`, not `render()`, so **the pack pass never
ran and the lie was never on his screen either.** The headline was stronger than
the measurement. The instrument, not the finding, was the weak part.

## THE NUMBER THAT IS NOT AN ANECDOTE
Sixty real cells, real frames, one session, the branch the only thing that moved:

    with the old branch   2 steps had something true to say, 0 said it
    with the new one      every step that had something to say said it, 0 missed

## GATES
`against_gate` 80 -> 86/0, five new claims, all driven on the demo. Mutation-tested
in **three** directions, because two of them are the same bug from opposite sides:

    old pack branch back            6 red   (walk reads: had 1, readable 0)
    clear fires every frame again   2 red
    clear never fires at all        2 red   (the over-fix: the permanent lie)

One claim was also caught measuring nothing: the walk first ran from wherever the
previous sub-test left him, scored **0 of 0 and passed**. A block of claims that
quietly has nothing to check is a green gate. It walks a trail the game's own
reader found now, and it fails rather than passes when it finds nothing to measure.

## THE HANDOVER FROM LAST ROUND IS ALREADY CLOSED, AND NOT BY ME
Round four handed `walkSay`'s missing clear to the lane that owns the road
encounters. **PEOPLE shipped it (53c03d97) while this round was running**: the road
line clears after the director's own approved ninety-second gap, and only its own
words. Checked on the tree this round shipped, not assumed. **A handover left
standing after it has been done sends the next reader hunting a ghost**, so it is
struck here rather than carried.

And the four rules now read well together, which is the part worth keeping:

    tracks        clear on SPACE   step off the prints
    blocked body  clear on STATE   he moved
    road moment   clear on TIME    ninety seconds
    the pack      clear on STATE   nothing is warning you any more

Each is right for its own thing, and every one of them takes back **only its own
words**. That is the whole discipline for a shared element, and it took four lanes
and about five rounds to arrive at it in four places independently.

## TWO LANES MEASURED THE SAME QUIET STREET, SEPARATELY, THIS ROUND
PEOPLE: one line in 600 taps over 29 cells. This lane: 2 sentences in 60 steps.
The pipe is honest now and there is simply not much travelling down it. That is
content density, not plumbing, and it is nobody's bug until somebody rules on how
often the street should speak.

## RULE 14, OBSERVED
No demo cut, no alpha touched, no build stamp. Fifth round running. The change is
in the city file, which both surfaces load by reference.

## [PENDING Paolo] — NOTHING NEW
