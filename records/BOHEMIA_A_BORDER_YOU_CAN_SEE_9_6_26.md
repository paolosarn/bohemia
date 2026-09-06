# A BORDER RUNS ALONG SOMETHING YOU CAN SEE
FACTIONS lane · VAMILY row `[who holds]` EVERY-DISTRICT-HAS-AN-OWNER · 9/6/26
Ruling: `records/BOHEMIA_RULING_WHO_HOLDS_WHAT_9_5_26.md`

## THE ONE LINE
Every one of the 9,216 cells in the valley belongs to a faction, and **every
single place two owners meet now runs along a road, a freeway, a rail line, a
wash, a mountain or the desert** — up from two in three. Nothing about that is
tuned: it is true by construction.

## WHAT WAS ALREADY TRUE, AND THIS ROW DID NOT REDO IT
BB-TURF shipped 9/5 and gave every cell an owner. 100% coverage was already
there. This row is about the EDGES, which nothing had ever looked at.

## WHAT WAS WRONG
`holderOf()` is a scaled Voronoi: nearest seat, divided by tier reach. Every cell
gets an answer, but the answer changes wherever two seats happen to balance — a
diagonal line through the middle of a block, with nothing on the ground to
explain it. Measured on the shipped seed before any of this:

    709 places two owners met
    466 of them ran along something a player can see   (65.7%)
    243 of them cut straight across open buildable ground

And the shares were an artifact, not a map:

    Network 2195 cells ... Volunteers 4 cells

Four cells is not a holding. It is where two circles happened to meet.

## THE RESEARCH SAYS THAT IS BACKWARDS
Real armed-group territory does not run on invisible lines. It runs on landmarks
you cannot miss — highways, rail, parks, washes — and Chicago's Dan Ryan
Expressway splits the South Side factions. The ruling wrote it down as rule 3:
*"if you cannot see why the border is there, it is in the wrong place."*

## WHAT SHIPPED
**The unit of ownership is not a cell, it is a BLOCK.** Cut the valley along
everything a player can see — road, freeway, rail, water, mountain, open desert —
and 465 blocks of buildable ground are left, each ringed by visible edges. A
block is owned whole.

Then a border between two owners can only ever fall on the skeleton, because two
buildable cells that touch are in the same block by construction. **The property
is structural. There is no number in this rule to nudge until the percentage
comes out right.**

### The draft, in his order
1. **His override first.** `HOLDS` ships empty; one line in it wins over everything.
2. **A capital holds its own block.**
3. **Factions pick by `act1_power`, strongest first**, and each pick is the most
   valuable unclaimed block *touching ground it already holds* — territory grows
   outward from a capital the way real ground does. A faction with nothing free
   next to it takes the nearest unclaimed block to its seat, so nobody is left
   with four cells.
4. **The skeleton goes to whoever reaches it first.** A road *is* the border, so a
   breadth-first wave out of every owned block settles who owns the road itself;
   ties go to the stronger name so every device agrees.

### Worth: two rulers were wrong before the third one worked
Rule 2 needs to know what ground is worth. Both obvious answers were wrong, and
both would have shipped as features:

- **Count the buildings.** Ranks trailer parks (26.9 per plot) and suburbs (19.9)
  *above* casinos (4) and resorts (4) — because a resort is one enormous building
  and a trailer park is thirty tiny ones. It measures fragmentation. It would have
  made the trailers the richest ground in Las Vegas.
- **Count the built tiles on the cell.** Puts `strip` at **zero**, because the
  strip district *is* the boulevard and carries no buildings. It would have handed
  Las Vegas Boulevard to the weakest faction in the valley.

The second is right at the BLOCK level and wrong at the cell level: the
boulevard's cells sit in the same block as the 118 resort cells beside them, so
the block scores enormous and the corridor rides along. **Worth is summed over a
block, never read off a cell.** That is the whole fix.

The measured order is the order the ruling names in words — resort 12043, casino
11477, downtown 9624 at the top; solar, airbase, airport and the boulevard itself
at 0. That agreement is the reason to trust it. `turf_gate` re-measures the table
off the real valley and goes red naming the kind if any answer moves band, the
same contract `NOT_A_TOWN` already carries.

## THE MOB CONTROLS THE STRIP, AND NOBODY TYPED THAT
His note says it in those words. It falls out of the rule: FACTION-SEATS put the
Mob's capital on a resort, the resort sits in the block the boulevard runs
through, and a capital owns its own block. Measured: **all 118 resort cells and
all 81 strip cells, Mob, and no other faction holds one.**

The Network holds downtown (22 of 27) — "strongest national/international ties".
The Reds, "the economic engine", took three of the six most valuable blocks.

## A CAPITAL CAN SIT ON SOMEBODY ELSE'S GROUND, AND THAT IS NOT A BUG
The gate's first version of this asserted every seat owns the block under it. The
world said no three times: the Church's chapel and the Mob's resort are both
inside the 431-cell Strip block, and the Network, the Reds and the Volunteers all
sit in one 35-cell block downtown.

The reflex was to push the seats apart until the sentence came true. Then his own
canon turned out to have written it already:

> Volunteers: "Resource-poor by design. **Nobody wants to be seen attacking them,
> even Cartel stays hands-off.**"

A clinic that survives because nobody will touch it, standing on ground somebody
else holds, *is* that sentence. So the world kept its answer and the claim
changed. What is locked instead is the invariant that matters: **the stronger
faction holds the ground, never the weaker one**, and a guest still holds real
ground of its own elsewhere. `turf()` reports its guests rather than leaving the
fact to be noticed.

## THE NUMBERS
| | before | after |
|---|---|---|
| cells with an owner | 9216 / 9216 | 9216 / 9216 |
| borders running along something you can see | 466 / 709 (**65.7%**) | 2372 / 2372 (**100%**) |
| smallest faction holding | Volunteers, **4 cells** | Volunteers, **331 cells** |
| largest faction holding | Network, 2195 | Mob, 1490 (the Strip) |
| resort + strip cells held by the Mob | — | **199 of 199** |
| cells that change hands from act 1 to act 3 | — | 3415 (**37.1%**) |
| cost to build, cached with the valley | — | 128 ms, once |
| cold boot / fps on a phone | 11/0 · 35/0 | 11/0 · 35/0 |

## ACT 3 REDRAWS IT, WITH NO SECOND RULE
`act3_power` was already in his graph. The same rule run against the endgame
column moves 37.1% of the valley: the Mob gains 241 cells, the Network loses 179,
the Church loses 78. The world visibly changes hands across the game and nothing
was written to make it.

## WHAT IS NOT DONE, AND WHY
**Rule 4 says the border is marked "in the holder's colour", and there is no such
number anywhere a map can reach.** A faction's colour lives in its WARDROBE — as
garment names in the alpha's `FACTION_LOOKS`, whose ramps are RGB triples in that
file only. The city carries none of them. Inventing a hue per faction is exactly
what COLOUR IS TERRITORY (8/26) reserves: *"which faction owns which hue is HIS."*

So the border IS now drawn on the MAP — it was decided and completely invisible
before, which is the authored-but-unread disease — but in the two-colour language
the map already speaks, yours against theirs. Only the edge, never a fill: a wash
of colour over the valley would bury the streets and lights the map is for, and
the border is the thing the ruling names.

**And the colour half was never this row's to begin with.** Two rows on the board
already own it, and both name this row as the thing they were waiting for:

- UI `[owner shown]` THE-CITY-SHOWS-WHO-OWNS-IT — *"with FACTIONS [who holds]
  landing, CITY mode shows the owner of every district in its colour, and the
  borders where you can see them."* Unblocked now: `turfGrid()` answers per cell
  off one flat array, and `turf().guests` says who is standing on whose ground.
- COOK `[border marked]` THE-BORDER-WEARS-ITS-COLOUR — *"cook the edge: a
  territory border is marked where a player can see it, in the holder's colour, on
  the wall, the fence, the underpass."* Unblocked now: the border is a real,
  queryable set of edges, and every one of them is on a landmark a painter could
  actually paint.

**THE ONE THING BOTH OF THOSE WILL HIT, WRITTEN DOWN HERE SO NOBODY REDISCOVERS
IT:** there is no faction colour number in this repo. A faction's colour is
implied by its GARMENTS (`FACTION_LOOKS` in the alpha: `'COBALT SNEAKERS'`,
`'RUST BOOTS'`, `'OLIVE SHOULDER MANTLE'`), and the RGB ramps those names resolve
to (`COBALT={dk:[30,70,140],...}`) exist in the alpha and nowhere else — the city
file contains zero of them. `faction_colour_gate` gets its answer by rendering
cloth in a browser and counting pixels, which no draw loop can do. So the first
job for either row is to lift the ramps into a place both surfaces can reach and
derive a hue per faction *from his own wardrobe*, never by picking one — COLOUR IS
TERRITORY (8/26) says "which faction owns which hue is HIS", and he has in fact
already answered it, just in garment names instead of numbers.

## GATES
`turf_gate.js` extended rather than duplicated (REUSE-FIRST) — the before number
is measured in the same loop as the after, so it proves a fix instead of
restating one. Biting mutation included: scribbling one faction across the valley
drops the border measurement below 99%. Green alongside: `cold_boot` 11/0,
`fps_on_a_phone` 35/0, `faction_towns` 33/0.
