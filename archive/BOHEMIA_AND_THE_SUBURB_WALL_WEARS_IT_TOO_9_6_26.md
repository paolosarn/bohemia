# AND THE SUBURB WALL WEARS IT TOO
COOK (16, the Production Artist), VAMILY [border marked], 9/6/26. Round 2, and the row closes.

## WHERE ROUND 1 STOPPED, AND IT WAS MEASURED, NOT GUESSED
Round 1 painted the border where a player walks and then measured how much of it it
actually reached:

    346 of 446 sampled border cells   carry a district kit legend -- reached
    100 of 446                        drawn the older parametric way, no legend -- missed
                                      (99 suburb, 1 gated)

The mark rode the district-kit path, which needs a kit legend to tell a fence from a
window. **The suburb is where most people live and where a garden wall actually is**, and
it was the whole of the gap.

## THE SUBURB ALREADY HAD THE EXACT TILE THIS ROW IS ABOUT
Nothing needed identifying. The parametric suburb's `v===4` branch **is** the block
perimeter wall, and it has had a name, a pool and a height since 7/27:
`c.artPool_face='perimeter'`, `wallH` 2, his thirteen approved keys, and its own law that
*perimeter and building walls never share a pool* (WALL TAXONOMY, 7/17). It is the plainest
large surface in the valley, which is the reference's own first rule for where a boundary
mark goes. It simply sat on a code path the kit-legend test could not see.

## AND THE TEST WAS FACTORED OUT RATHER THAN COPIED
Round 1 inlined the per-tile turf memo inside the kit branch. A second copy in the suburb
branch is exactly the shape REUSE-FIRST exists to stop, and the two would drift the first
time either was touched — **this file has fixed that same bug under six different names.**
So it is one function now, `bohTurfEdgeOf()` / `bohBorderMark()`, memoised on the tile, and
both call sites are three lines that cannot disagree about what a border is. The cook
refuses to write itself if the turf test ends up in the file more than once.

Nothing about the mark changed: same band (the eighth of the cell facing the rival, on that
side only), same rate (one face in two), same ink (his measured wardrobe colour), same draw.

## WHAT IT DOES NOW

    cell      ground     holder        wall faces in band   painted
    15,80     suburb     Homeless             346             135    (was 0)
    77,51     suburb     Trades               184              76    (was 0)
    25,20     freeway    Mob                  128              64
    21,14     freeway    Volunteers            64               8
    77,0      freeway    Network                8               3
    ... nine arterial and desert border cells with no wall in the band at all
    INTERIOR cells sampled                                       0    (the mark is the EDGE)

## THE ROW'S THIRD WORD: "THE UNDERPASS"
The row names *"the wall, the fence, the underpass"*. Walls and fences are painted. **There
is no underpass wall to paint**: in this build an underpass is a grade-separated crossing
where an arterial meets a freeway (his 7/5 ruling, `bohemia_overmap.js`) and a two-lane
street generator — it is a road under a road, not a wall kind with a legend of its own. The
vertical surfaces at those crossings are freeway structures, and they are already covered by
the same rule as any other structure there, which is why the freeway border cells paint.
Written down rather than left as a silently unfinished third of the list.

## WHAT IS STILL NOT PAINTED, AND IT IS NOT A GAP IN THE RULE
Nine of sixteen sampled border cells have **no wall face in the band at all** — they are
arterial, desert and mountain. That is FACTIONS' own design working as intended: every
border in the valley runs along a road, a rail line, a wash or a mountain, and most of those
have nothing standing on them. A rule that painted something there would be inventing a wall
to paint. The mountain cells carry 605–1,290 rock faces and take zero marks: nobody sprays a
cliff.

## AND IT COST 30 POINTS OF THE BEAT BEFORE IT COST NOTHING
The first cut of this round asked the turf question **before** the arithmetic ones, and it
called that for every perimeter-wall cell in every suburb tile — the district the player
spawns in. Four interleaved runs of the phone-beat gate, same machine, same session:

    WITHOUT round 2   42.9%  and  51.7%  of beats late   (512 ms, 565 ms median gap)
    WITH round 2      77.1%  and  77.4%                  (648 ms, 712 ms)

Non-overlapping, repeatable, and it is **the beat**, which is a pillar of this game. The
gate's own exit code was 0 both times — it was inside its budget — so nothing would have
stopped this shipping except measuring it.

**The turf answer was never the cost.** Instrumented on a real boot: only **2 tiles in 144**
ever carry the memo, so the lookup barely fires. The cost was *asking at all*, millions of
times, on the commonest district in the valley.

**The cheap tests come first now.** The hash rejects half and the position test rejects the
interior of the tile — both pure arithmetic, no lookup — and the call itself is skipped, not
merely shortened, by the same pre-test at both sites.

    WITH round 2, cheap tests first   47.1%  (541 ms)   -- back inside the baseline band

and the suburb marks are unchanged: 135 and 76.

## PROOF
    node tools/bohemia_border_paint_probe_9_6_26.js   the measurement above
    node gates/turf_gate.js               43/0
    node gates/faction_colour_gate.js     17/0
    node gates/walked_surface_gate.js     15/0
    node gates/wallclass_gate.js          24/0
    node gates/alpha_loads_gate.js        20/0
    node gates/border_gate.js              6/0
    node gates/bohemia_phone_perf.js      green, and the numbers above

## WHERE HE SEES IT
**CITY tab**, walking. A suburb block wall on the edge of a faction's ground now carries
that faction's colour. Walk two streets in and it is a plain wall again.
