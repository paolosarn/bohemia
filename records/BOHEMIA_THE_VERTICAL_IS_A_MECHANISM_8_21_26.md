# THE VERTICAL IS A MECHANISM, NOT A LAMP

8/21/26 — WORLD lane. Tab: **RUN** (the street you spawn on) and **CITY** (everywhere else).

---

## WHERE THIS STARTED

This morning's fix stood one object up: the streetlight, 0 draws → 46, `c.lamp` → `LAMP_IMG`.
It left a measured list behind — 18 declarations / 1,773 tiles of props that are *standing
objects* in their legend and draw as one flat coloured square — and the obvious next move
looked like "give those props art."

**It wasn't.** The census said why:

```
prop families the WHOLE valley authors, one plot of each district:
  bin 3 districts · sign 2 · pallet 2 · mailbox 1 · barricade 1 · pole 1 · bench 1 · cart 1
```

Eight families. The lamp was a **wiring** problem — forty-two districts had already authored
the tile and nothing drew it. This is the opposite: there is almost nothing to draw. A dead
American suburb with no bin at the kerb, no bag in the gutter, no tyre in the wash is not
under-rendered. It is **unfurnished**.

## WHAT SHIPPED

### 1. The flag became a family

`c.lamp` was a lamp-shaped path from flag to sprite. The next prop would have meant `c.bin`
→ `BIN_IMG`, then `c.cone` → `CONE_IMG`, and a fourth copy of the same eight lines every
time. FACTORY LAW: a thing you will need many of gets a mechanism.

Now `c.post = {p:'bin', v:2}`, one collector, one draw, and **one legend-name → family
table**. The lamp is mapped onto it so every lamp shipped this morning draws byte-for-byte
the same.

```
46 draws  ->  603 draws    across 36 districts
```

Everything the valley had **already authored** stood up for free, without a line of content
being written:

```
mall        2 dumpsters          warehouse   2 dumpsters + 9 pallets
campus     12 benches            commercial 12 pallets
arsenal   113 barricades         apartment   2 mailbox kiosks + 6 dumpsters
```

### 2. The bank is shopped, not cooked

REUSE-FIRST, in its strongest form: **not one pixel was drawn.**
`banks/BOHEMIA_STANDING_SET_7_10_26.txt` is 575 corpus objects already typed as STANDING
(block + occlude) since 7/10, and its street packs are exactly what a dead kerb needs. The
pixels resolve out of the HD tile repo. Twenty objects across eleven families:
**bin ×4 · bag ×2 · barrel ×2 · barricade ×3 · bollard ×2 · cone ×2 · bench · dumpster ·
mailbox · pallet · tyre.**

**And the kill pipeline is the law, in code, not my eye.** Six candidates were killed by
measuring their pixels:

```
bin      #12  PURPLE RESERVATION 2.6%   (a purple recycling logo)
cabinet  #29  PURPLE RESERVATION 7.4%
bench    #17  PURPLE RESERVATION 0.4%
signpost #10  ACT ONE ONLY, neon 8.2%
mailbox  #15  ACT ONE ONLY, neon 2.4%
cabinet  #28  ACT ONE ONLY, neon 3.1%
```

### 3. The suburb got its bins

The district he spawns in is the one district **not on the kit path** (`m.sub`, hand-written),
so it carries its own code and its own case — the same split the streetlight hit. Code 14 is
a wheeled collection cart.

**Where a bin stands is when this street stopped.** Vegas residential collection is wheeled
carts: they live beside the garage and get rolled to the kerb the night before. So the ones
at the kerb were put out for a collection that never came. That is the valley's whole premise
said in one prop, and it costs nothing to say it that way instead of scattering them at random.

Never in the walk and never on the apron: a bin is solid, Paolo's walk is one grid wide
(7/31, LOCKED), and a solid cell in a one-wide walk does not narrow it — it **severs** it.

## THREE THINGS I GOT WRONG, AND HOW EACH WAS CAUGHT

**1. I nearly published an alarm about the lamps.** Seen on a 2× contact sheet, the approved
"dark" lamps read as glowing amber lanterns — which in a 12%-lit dead world would have been a
serious problem I had shipped hours earlier. Measured against the lit originals before saying
anything: **100% of the very-bright pixels are killed in all seven.** The amber is brass frame
and dead glass. The alarm was wrong and the sheet was the liar.

**2. My own kill filter killed a green dumpster.** It carried a third law, "no vegetation",
implemented as *how many green pixels* — and a green dumpster is 14.3% green painted steel.
No tuning fixes that: **a colour histogram cannot tell a leaf from paint.** That is the 8/1
lesson in a new costume (a checker that cannot tell a mention from a use is the broken one;
fix the ruler, never the target). The pipeline is now honestly split — purple and emissive are
*colour* facts and get colour tests forever; "is this a plant" is a *semantic* question and is
answered by not listing planters as candidates, with the reason recorded.

**3. I almost wrote a fabricated measurement into the code.** A 22-house block stood 28 bins,
I assumed the hash, "fixed" it with `Math.imul` and started writing *"MEASURED: a gate written
to pass 38% passed about 82%"* — a number I never took. Measured properly: the coin was clean
(95, 11, 95, 77, 16, 30, 35, 7, 49…) and the cause was **my own inverted condition** —
`>=62 continue` passes sixty-two percent, not thirty-eight. The `imul` change is still correct
(a real latent precision bug) but it was not the cause, and the comment now says so.

## THE GATE

`gates/props_gate.js`, 32 checks, suite entry **PROPS**. Proved red by drifting the lamp
footprint. It re-measures the bank with **its own PNG reader** — a gate that imports the tool
it checks is asking the accused to testify — binds the script tag to the sibling art file
(the 8/6 repo-budget precedent: two lists that must not drift), pins the lamp's footprint so
the now-shared draw cannot regress something Paolo already has, and refuses any suburb bin in
the walk or on an apron.

**And the LAMP gate went red, correctly, and was re-aimed rather than weakened.** Folding the
lamp onto the shared draw invalidated two of its regexes. They now assert the lamp's *branch*
of the shared draw — that the lamp family still resolves to the approved `LAMP_IMG` pool, and
that the glow is asked **only** of the lamp and **only** of a live POWER circuit. Re-proved
red by deleting the `_fam==='lamp'` guard.

## HOUSEKEEPING

**This container came up on a foreign branch.** `claude/world-9lfjtf` had been rewritten by
another session using the same reused branch name, and its working tree was *older than main*
— 41 modified files that looked like mid-flight work and were actually reversions. Verified
before touching anything: my streetlight ship is an ancestor of `origin/main`, the other
session's commits are all on `origin/main`, and the tree was missing content main has. Reset
to main, nothing lost. Same trap the CHARACTER lane hit on 8/21: **if a container looks like
it has uncommitted work, diff it against origin/main before believing it.**


---

## AND THEN THE CARS, WHICH WERE THE BIGGEST ONE ALL ALONG

The mechanism made the next find cheap to act on. **Thirty-odd districts author a
`kind:'vehicle'` tile** — dead car, abandoned car, parked car, patrol car, impound wreck,
wrecked car — and the kit maps `vehicle` to `layer:'prop'`, so **every car in the valley drew
as a flat coloured square.** Meanwhile `banks/BOHEMIA_STREET_PROP_POOLS_7_18_26.txt` has held
**twenty approved top-down abandoned cars** since 7/18 ("HD_TILE_REPO part2 / 10. Abandoned
cars, the V11 bake family") and nothing in this game had ever drawn one.

Same shape as the streetlight. An order of magnitude more tiles:

```
medical 1,101 · boneyard 3,589 · policestation 915 · interchange 417 · downtown 328
convention 316 · firestation 272 · mall 190 · freeway 156 · commercial 108 ...
603 draws -> 2,007 across 36 districts
```

**A car is not a standing prop.** The masters are top-down, so a car lies flat in its
footprint: rise 0, no occlusion, a thing on the ground rather than a thing you walk behind.

**And the lattice has to follow the blob, because the plot may be turned.** Districts are
authored canonical-south and rotated to whatever street they front (kit `rotateToStreet`), so
a rank of cars authored 2 wide × 4 long arrives **4 wide × 2 long** half the time. My first
cut used a fixed 2×4 lattice and cut those ranks in half — measured on the running page, a
4×2 rank came back as `w:2,h:2` twice, and the sprite squashed into a square is exactly what
the screenshot showed. Finding the run *both ways* through the cell and stepping along the
longer one fixes it, and it also handles the merged case: medical parks cars shoulder to
shoulder into 5×6 blobs that, drawn as one blob, would be **one car six metres wide.**

Gate: eight more checks in `props_gate.js` (40 total), proved red by pinning the lattice back
to a fixed 2×4.

**One more re-runnability bug, mine, same afternoon.** The props patch reversed its draw block
by matching its **first line** — content. The moment I edited the block to carry a per-cell
extent, the stored line stopped matching the page, the reversal silently did nothing, and the
tool exited loud on a missing anchor. Loud is the good outcome and it was still luck. It cuts
by marker now, which converges no matter what the body becomes. That is the third time this
week the same rule has had to be re-learned: **reverse by marker, never by content.**


---

## AND THEN HE ANSWERED THE ONE QUESTION

I had wired the fire barrels and deliberately placed none, because all twelve banked barrels
are **actively burning** and a fire says somebody is here *right now* holding this spot —
who holds what ground is his. He answered:

> **"Ofc ppl will warm themselves by barrel fire in act one."**

NOTES ARE RULINGS (7/19), so it went in the same turn. And it settles far more than a prop:
**act one has living people in it.** They are outside, and they are cold.

### Where a fire burns is the power law made visible

Measured: the valley is **94.5% dark** (CLUSTERED POWER — 12% of circuits live, owned, the
network eerily perfect). So:

> A **streetlight** is what burns on the share somebody **owns**.
> A **barrel** is what burns on all the rest, where everybody else is.

Same authored tile, two readings. The generator only says *a person would light one here*;
the **city decides whether it is actually burning by asking POWER** — on a live circuit the
barrel stands cold, because nobody breaks up furniture to keep warm on a street that still
has electricity. You can tell whose ground you are standing on by looking at the light.

And at night the fire is **its own circuit**: the lamp asks POWER before it glows, the barrel
does not have to ask anybody, which is the whole point of it.

Placed in the lee of the block wall, in a corner where two walls meet — a Mojave winter night
runs to freezing and that wall is the only windbreak on the plot. Never on the frontage.
**About one neighbourhood in five** has anybody left in it: a fire means people, people are
the scarcest thing in this valley, and one barrel per neighbourhood says far more than one per
block. *That they exist is his; how many and where is mine.*

### Four bugs on the way in, all mine, all caught by measuring

1. **`0x1F1RE` is not valid hex.** A cute constant that would have been a syntax error. Caught
   before it ever ran, by an assertion failing on an unrelated line.
2. **The scan started at index 2** and found nothing across 24 seeds — the block wall is a
   one-thick ring at the very edge, so the only cells with two wall neighbours are the inside
   corners at (1,1), *exactly* the cells the bound skipped.
3. **The real one.** `inb(g,x,y)` in this module is `x>=1 && y>=1 && x<W-1 && y<H-1` — it
   means **"a cell you may WRITE to"**, and it deliberately excludes the outer ring. **The
   block wall IS that ring.** Asking `inb()` whether the wall exists answers *no*, so walls
   counted zero everywhere and 24 seeds produced 24 empty neighbourhoods with the coin passing
   normally. A helper named for bounds that actually means *the writable interior* is safe to
   place with and wrong to look with.
4. **Returning the first match** put the fire at (1,1) on every single plot — eleven
   neighbourhoods, eleven fires, one corner. Individually plausible, collectively a bug the
   player reads instantly. Collect the candidates, then choose.

And one I caught in my own code before it shipped: I keyed the flame to an invented `BEATN`
that does not exist. Worse, **the city redraws on a STEP, not a frame** (I-MOVE-YOU-MOVE), so
an animated flame would have been a flicker that never flickers — a lie told in code. It is
keyed to the world clock and the cell instead: it varies barrel to barrel and shifts as the
night goes on, and the comment says exactly that.

Gate: 8 more checks (48 total), proved red by deleting the on-grid swap.


---

## THE CARS THAT NEVER LEFT (8/23)

The suburb had **fourteen codes and not one vehicle** — every driveway on the street he spawns
on empty, which is the single thing a dead American suburb would never be.

**Why they are still here is the premise of the whole game.** In an *evacuation* people drive
away and the drives are empty. In an **economic** collapse they stay until they cannot, and the
car dies where it sits: no fuel, no parts, nowhere to go. Detroit is the reference and it is
unambiguous — abandoned vehicles in drives, at kerbs and pushed onto yards are so defining a
feature of a foreclosed neighbourhood that the city runs enforcement programmes for them.
Bohemia's identity is *"the most realistic economic crash simulator"*, so the car staying is
not set dressing, it is the thesis.

### Two wrong placements, both measured before they were believed

**Filling the drive** is the obvious reading and it is wrong *for this model*. Our driveway is
`DVW=2` tiles — at `TILE=0.75` that is 1.5 m, **one car wide**, not the 16-20 ft two-car apron
a real Vegas tract house has. So a car in it seals the garage:

```
roadConnected   1.000  ->  0.851     FAILED ON ALL TWELVE TEST PLOTS
```

An earlier cut dodged that by taking apron cells within a radius of the garage end — which is
an L or a plus, never a car. Measured on the running page, the blobs came back **1x3, 1x1 and
3x1**, and the sprite drew one cell wide.

**The Detroit reference already had the answer**: a car pulled onto the dirt beside the drive.
It is the truer image anyway — it is what you do when it stops running and you still need the
drive — and it costs the network nothing.

```
roadConnected   1.000 on every plot     ~5 cars per neighbourhood
extents on the page:  2x3 and 3x2, clean rectangles, correctly turned
```

Gate: 7 more checks (55 total). The mutation that matters parks a car back in the drive and
takes `roadConnected` to **0 of 6 plots** — my first attempt at that mutation was too weak to
bite, which is worth saying: a mutation that does not reproduce the bug you are guarding
against is not a test, it is a decoration.


---

## RUBBLE IS A FIELD, NOT AN OBJECT (8/23)

**16 declarations / 4,665 tiles** of rubble and debris across the valley — basin 1,736 in one
plot, rail 1,001, interchange 582 — every one of them flat. And three corpus packs nobody had
ever opened held **41 usable heaps** after the law filter.

**The emission rule is the whole find.** One-per-blob is right for a bin and *absurd* here: an
anchored sprite on basin's 1,736-tile field would be one heap the size of a city block. Rubble
**scatters on a lattice** — roughly one heap per 4×4, and deliberately *not* at every station,
because a full lattice is a grid, which reads worse than wallpaper.

```
basin  68 heaps/plot   rail 24   freeway 3   interchange 3      no page errors
```

Three emission rules now, and each is a different truth about what a thing IS:

| rule | for | why |
|---|---|---|
| one per **blob** | bin, bench, dumpster, mailbox | a discrete object, standing |
| one per **2×4 sub-block** | car | a discrete object with a *size*, and ranks merge |
| **scatter on a lattice** | rubble | not an object at all — a field |

And the gate's own one-per-blob assertion went red on my refactor, correctly: rubble opts out
of that path on purpose, so the check now asserts the anchored path still guards its west and
north neighbours rather than assuming it is the only path.

### REUSE-FIRST, discharged honestly, and one thing genuinely needs cooking

Before any of this I swept the corpus for a **utility pole** — 27 unswept street/exterior packs,
109 tiles rendered and looked at. There is no distribution pole anywhere in it. `arterial:10`
authors one and it stays a flat square until somebody draws it. That is the first thing in a
while that genuinely needs **cooking** rather than shopping (45 DEGREE ART LAW), and saying so
is the honest end of a reuse check rather than a reason to skip one.

I also found `tall_ratio` in the standing set is **1.00 for all 575 objects** — computed on the
square canvas rather than the content, so the field says nothing. Another piece of metadata
that looks like an answer and is not.


---

## THE POWER POLE, COOKED (8/23)

`arterial:10` and `arterial_x:10` have authored a power pole since the district was written,
and it has drawn as a flat coloured square the whole time. This is the first thing in a long
while that could not be shopped.

**REUSE CHECK, and it came back NEGATIVE — which is the point of doing one.** 294 corpus packs,
the 575-object standing set, 27 street/exterior packs I had not opened, **109 tiles rendered
and looked at.** There is no distribution pole anywhere in the corpus. (I also found
`tall_ratio` in the standing set reads **1.00 for all 575 objects** — computed on the square
canvas rather than the content, so the one field that could have found a tall thin object says
nothing.) A reuse check that can only ever come back positive is not a check.

**What it reuses is the drawing itself.** Every helper comes from
`tools/bohemia_traffic_signal_factory.py` — `ellipse_disc`, `bowed_band`, `cyl_index`, `bow` —
the toolkit that already passes the 45 law. A second hand-rolled three-quarter renderer is
exactly the duplication FACTORY LAW exists to stop.

**Anatomy researched, not remembered**: wood pole from a tree trunk; a wooden crossarm bolted
across and braced diagonally; porcelain insulators that "look like stacked plates"; four wires,
three phases and a neutral; and on some poles a transformer, the can that steps voltage down
for the houses under it. Some spans are **snapped**, the loose end curling — a decade with no
linemen is the premise, and an unbroken grid overhead would contradict CLUSTERED POWER every
time he looked up.

### The eye was wrong and the measurement was right, again

My first look said *far too dark*. Measured against the blessed banks before changing anything:

```
approved lamp    mean 45-49   p90 102-113   max 180-187
approved signal  mean 38-40   p90  93-95    max 169
MY POLE (v1)     mean 37-39   p90  94       max 128
```

The mean and p90 already **matched the approved art**. My eye was reading a black contact
sheet. What was actually missing was the **top end** — the shaft never took a specular hit at
all. Re-rendered on desert ground instead of black, with the highlight added, it reads.

**And the art corrected my own text.** I wrote that desert sun silvers these grey — untreated
wood silvers, but a utility pole is **creosote-treated** and stays dark brown-black for
decades, which is exactly what the render came out as. The art was right and the description
was wrong, so the description changed.

`gates/art_45_gate.py` passes it: *ellipse base (widest row 11 above bottom, 23 vs 11 px wide),
top-lit 62 vs wall 30.* props_gate is at **67 checks**.
