# YOU CAN SEE WHAT THE BLOCK TAKES
FACTIONS lane · VAMILY row `[rent visible]` YOU-CAN-SEE-WHAT-THE-BLOCK-TAKES · 9/13/26

## THE ONE LINE
The block has charged you rent since `[block rent]` landed and it only ever told
you at nightfall, after the day was spent. Now it tells you while you are standing
on it, and when they cut your lights you can see which streets went out.

## THE GAME ALREADY HAD THE WORDS. THEY WERE IN THE WRONG PLACE.
Measured before a line was written: **forty blocks walked across six factions'
ground, and the street said nothing all day.** Then the reckoning card said this:

> *Blues (town) wanted 3 for 3 of the 4 blocks of theirs you used and you had 2,
> so the Blues cut 1 of their own street off*

That is a perfect sentence arriving after the decision it was about. Same failure
QUESTS found on the job offer: a walk quoted at seven hours **after** you agreed
to it. So nothing here changes what anything costs. It moves the telling earlier.

## WHAT ONE MORE BLOCK COSTS IS THE BILL ASKED TWICE
`rentAhead` calls `rentOn` with the count you have and the count you would have.
There is no second formula, because the one thing a preview must never do is work
the number out its own way — **a preview that disagrees with the bill is the only
way this can be wrong.** It also reads the same billable map nightfall reads, your
own generators already off the line, which was four lines buried inside the
nightfall function and is now one body with two callers.

Proved on the walked surface: after a real sixty-block route the card said
**14 batteries** and the night took **14**.

## THE SHAPE IS FOUND, NOT WRITTEN OUT PER TIER
`rentShape` runs the bill up a ladder and looks for the smallest window that
repeats:

    fortress   1 2 3 4 5 6 7 8 9    charges for 1 block in every 1
    town       1 2 2 3 4 4 5 6 6    charges for 2 blocks in every 3
    camp       1 1 1 2 2 2 3 3 3    charges for 1 block in every 3

**Nobody typed any of that.** It is his own DEPTH thirds said back in a shape a
person can hold in their head, and if he ever re-cuts that table the words follow
with nothing to edit. A camp lets you walk two blocks in three for nothing. A
fortress charges for every step.

## THE HALF THAT COULD NOT BE DONE UNTIL THE REAL BLOCKER WAS FOUND
The row also asks that *"the moment it is cut off, the block goes dark in a way
you notice."* My first idea was to cut the block they billed you for, rather than
whatever circuit a scan from (0,0) hit first. Both of those turned out to be
answers to the wrong question.

**MEASUREMENT ONE.** Of 188 cells lying on blocks a faction billed for on a real
route, **zero carried a lit circuit.** Circuits only run along streets, so the
ground you walk usually has no line on it to cut at all. A your-block-only rule
would have cut nothing, every time, while every check stayed green — the same trap
`[power territory]` found when it nearly gated a valley's output on lights.

**MEASUREMENT TWO, AND IT IS THE ROW'S REAL BLOCKER.** Every circuit in the valley
was put out — all 173, 358 lit cells to zero — the aerial was redrawn, and the
frame came back with an **identical hash and a brightness change of zero.**

> *The grid has been real data since the world was built and nothing has ever
> drawn it.*

So darkness could not be noticed by anybody, and no choice about which street to
cut could have fixed that. WORLD wrote this down on 9/5 and called their probe the
broken instrument. The probe was right.

## SO THE MAP DRAWS THE LIGHTS
Live cells are painted in **their holder's ink** — the same `__holderInk` the
borders and the tracks already use, because COLOUR IS TERRITORY and a lit street
is territory somebody is paying for. A cut wire is drawn cold with a ring, and the
ring is brighter on the night it happened.

**And a wire that was never live is not drawn**, which the first cut got wrong and
only looking at the screen caught: the valley has about 1,500 dead feeders against
360 lit ones, so drawing every wire buried the lights under four times as many
dark dots and the frame before a cut and the frame after were identical to a human
eye. The exact failure the layer exists to end, rebuilt inside the fix for it.
Ground that never had power has not gone dark; it was always dark.

The shape is cached once, because which cells carry a wire is a pure function of
the seed and only the on-or-off changes; rebuilding 1,900 objects sixty times a
second for that is how a phone loses its frame.

## AND THE CUT LANDS WHERE YOU WALKED
Their lit circuits are sorted by distance to the blocks they billed you for, and
the closest go out first. A landlord cutting a street across the valley is not a
landlord, whatever the arithmetic says.

    cut tonight                 14 circuits
    within six cells of you      9
    median distance              5 cells
    lights near your route      18 -> 3

## DRIVEN END TO END ON THE WALKED SURFACE AND THE DEMO
    DAY ONE, BEFORE ANYTHING IS SPENT
      THIS GROUND         Mob
      WHAT IT TAKES       1 battery a night, every block
                          A fortress charges for every block you use.
      TONIGHT SO FAR      1 battery for 1 block
      ANOTHER BLOCK       COSTS ONE
      Due at 22:00, in batteries.

    AFTER A SIXTY-BLOCK WALK
      Everybody wants 14 batteries off you tonight   (and the night took 14)

    STANDING ON A STREET THEY CUT
      CARTEL cut this street off. You did not pay for it.

    THE MAP
      125 lights painted on a real canvas in nine factions' inks
      every circuit doused -> frame hash moves, brightness drops
      (before this row: hash identical, brightness change zero)
Identical on the demo. No page errors on either.

## THE MISTAKE, AND IT IS WORTH THE PARAGRAPH
An edit that replaced a paragraph inside a block comment carried a `*/` with it
and closed the comment early, so four lines of prose became code. The page then
failed to boot, the day card never appeared, and my first thought was that the
page had got slow. **A load that times out is a syntax error until proven
otherwise**, and the one-line check that settles it — load the page, count
`pageerror` — takes eleven seconds.

## GATES
`faction_towns_gate` **170/0**, up from 144 — extended, not duplicated.
Twenty-six new claims, eight of them driving the real surface: the preview is the
bill asked twice and matches it block by block, `free` is exactly "this adds
nothing", the shape is found rather than typed and checked against rentOn, it is
his DEPTH thirds, one body feeds both the preview and the bill, the reading spends
nothing, the cut is sorted by distance and the reason it is a distance is written
in, the grid can be enumerated without probing the valley, the shape is cached,
lights ride the holder's ink, a never-live wire is not drawn, the render publishes
what it painted, the card carries all four of the row's things under the owner
row, standing still is not another charge, the preview equals the bill on the real
surface, the map really paints, dousing really changes the frame, the darkness
lands near the route, the cut street names itself, and it answers in CITY too.

**Negative-controlled both halves.** Making the preview guess instead of asking
turned M1 red on its own. Stopping the map from drawing the lights turned M21 and
M22 red. And that second control taught the check something: **the frame hash
moving is not on its own proof**, because the street render changes between two
draws anyway. It is proof in a controlled pair (nothing touched but the dousing,
which is how the original zero was measured) and not in a live drive. The claim
that bites out there is the count of lights painted going to zero.

**Two of this lane's own earlier checks went red and were followed, not loosened.**
`N12` reads the rent path, which is three functions now that the billable map
moved out of nightfall, and still asserts both halves of its claim: built from
turf, never mentions `payTo`. `N13` keeps its claim and drops the variable name
from the douse call.

Green alongside: engine sync zero drift, bundle 16/0, banner 14/0, turf 43/0,
demo build 25/0, alpha loads 20/0.

## THE BOUNCE-BACK THIS ROW SET OFF, AND IT WILL HAPPEN AGAIN
Editing the powergrid put `BOH_POWERGRID` into drift for the second time: 2 bodies
across 6 carriers, the four stale ones being the two graphics masters (twice in
one of them) and `BOHEMIA_RUN_CURRENT.html`. **The city resync tool does not know
those three files exist.** Re-inlined from canon using the sync gate's own
extractor, so the boundaries cannot disagree with the gate that judges them, and
the bundle's per-file md5 headers refreshed. The next lane that edits that module
will hit it too.

## [PENDING Paolo] — NOTHING NEW
Nothing here needed a ruling. The rent is his ONE, the thirds are his table, the
colours are his, and the only number in the surface is where the lights are.
