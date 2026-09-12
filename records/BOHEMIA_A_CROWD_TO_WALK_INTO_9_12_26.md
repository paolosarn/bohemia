# A CROWD TO WALK INTO (9/12/26, LIFE + CITY lane)

Round 8 of VAMILY `[more people]` POPULATION-DEFAULT. Round 7 built the floor; this is the
peaks.

## WHERE ROUND 7 LEFT IT

The street is no longer empty — 116 of 120 standings with nobody became 65, and a walk
always meets somebody. But the most he ever saw at once was **2**, because one borrowed
body per screenful is exactly what that lattice promises. A city needs knots.

## AND THE FIRST MEASUREMENT SAID THE CROWDS WERE ALREADY BUILT

Standing on residential ground anywhere in the valley, across four daylight hours:

    peak 2        86 of 160 standings saw nobody, 70 saw one, 4 saw two

Standing **on** a gathering place, the same count:

    17, 14, 11, 10, 9, 8, 8, 8

Round 2's places work. **He just never ends up on one.** A place is a single cell in a
valley of millions, so the crowd exists and he walks past it forever.

## TWO CUTS FAILED THE SAME WAY, AND THE WALK CAUGHT BOTH

**Cut one: fill the nearest real place.** It measured nothing — peak still 2, histogram
identical to the round before — because the nearest place is about a hundred cells off and
my five-minute budget buys fifty-nine, so no place ever qualified.

**Cut two: drop the budget, fill the nearest place however far.** The crowd standing at a
place doubled, 17 → 37. **A walk still met 0 crowds in 16, biggest group seen 3.** A
straight walk passes a single point by luck.

That is round 6's lesson wearing a new hat: **a mechanism that is right and never happens
is not a deliverable.** And the reason both cuts looked fine on the way in is that I was
measuring by standing on sampled ground, which is not how anybody plays.

## WHAT SHIPPED

The crowd forms on the best **frontage** within **two screenfuls** of him — a screenful
being the repo's own `2 x SEE_RANGE + 1`, the same unit round 7's floor lattice uses — and
never inside one SEE_RANGE, so nobody ever forms up inside his own view. The frontage is
scored by the same instrument that picks a place (openness, plus a door on it), so the
crowd gathers on a forecourt or a shop front rather than in the middle of the road.

How many make a crowd is the population module's own `HEADS.cluster`, and never more than
half the borrowed people, so round 7's floor survives intact.

That is the coordinator's 9/7 ruling read literally: the valley's own out-of-doors people,
standing where the player is.

## AFTER

    walks that met a crowd    0 of 16   ->   5 of 16
    biggest group seen        3         ->   14
    walks that met anybody    16 of 16  ->   16 of 16   (round 7's floor, unchanged)
    empty standings           65 of 120 ->   65 of 120  (unchanged)
    at three in the morning   1, and that is correct

## THE GATE

`gates/a_crowd_to_walk_into_gate.js`, 7 pass / 0 fail, registered. **It walks**, because
two cuts of this round passed a standing test while a walk met nothing.

MUTATION-TESTED TWO WAYS:
  - remove the knot entirely (round 7's even floor alone) -> B1 and B2 red, 0 of 16 and
    biggest 3
  - let the crowd stand anywhere within the walking budget -> A2, B1 and B2 red, and it
    reproduces my own failed cut exactly: 0 of 16, biggest 3

B4 keeps it honest at the other end: no crowd stands at three in the morning, because the
mechanism can still only borrow people the schedule already has out of doors.

## ONE GATE OF MY OWN NEEDED A CORRECTION

`never_empty_gate`'s B6b — "nobody is moved or released while he can see them" — went red
when the crowd put more borrowed bodies inside his view: one of them had simply gone home.
`alive_gate` already ruled that **a hold must never outlive the schedule**, and a day
ending happens to everybody in the valley, borrowed or not. The leg now separates the
field moving somebody in view (forbidden) from their own day ending (correct). 14/0.

## NOT MINE, PROVED ON A CLEAN ORIGIN/MAIN WORKTREE

`fps_on_a_phone_gate` is 33 passed / 2 failed on main with none of my changes, the same
two legs by name: the wake card sitting over the pad on boot, and bytes to first play at
45,176,644 against a 34,005,978 budget. My tree measures 45,178,256 — **1,612 bytes more,
which is the size of the comment I added.** Frame budget 22/0, main thread 31.6% of a 56%
budget, boot 21.0s.

## THE ROW

Still CLAIMED. 5 of 16 walks meeting a crowd is a real change to what the game feels like
and it is in the walked surface and the demo, but it is not "he meets people without
trying" yet. What is left is the other eleven walks.

Tab: CITY, or just walk. Build stamp: 9/12a.
