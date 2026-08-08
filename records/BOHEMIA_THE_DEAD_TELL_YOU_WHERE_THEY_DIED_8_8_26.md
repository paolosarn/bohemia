# THE DEAD TELL YOU WHERE THEY DIED
## 8/8/26, WORLD lane. Paolo's 7/31 corpse ruling, built across the whole valley.

> "We need a lot more corpses a lot more skeletons in the game."
> "ofc i want a realistic mix of skeletons and husks."
> — Paolo, 7/31 lore sitting, LOCKED
> "Build the dead-placement system: skeletons in the open, husks in sealed
> places, realistic mix, story-via-placement." — commissioned 8/8

**TAB: RUN.** Walk the world and they are there.

---

## THE RULING IS FORENSICALLY CORRECT, WHICH IS WHY IT WAS EASY TO BUILD

Paolo did not pick a look. He picked the actual mechanism, and the science says
the same thing:

- **In the open.** Vultures can strip a body to bone in as little as five hours;
  coyotes and vultures start within about two days, and **complete disarticulation
  arrives within about six weeks.** Dispersed bones are found adjacent to the
  deposition site or along nearby **game trails** — so scatter is short-range and
  **directional**, never a uniform sprinkle. Ten years of Mojave UV bleaches the
  rest. → a **partial, scattered, pale** set of bones.
- **Sealed and dry.** *"The absence of external or internal moisture leads to
  mummification of the entire body, which completely restricts disarticulation
  and animal scavenging."* Aridity preserves remains for **hundreds of years**.
  → one **intact husk**, in the position it died in, never scattered, because
  nothing could reach it.

**A body the animals could reach is bones and is spread out. A body they could not
is still a person and is exactly where it fell.** That is the whole rule, and it
is now the code.

---

## WHY THIS DID NOT MEAN EDITING SIXTY-ONE DISTRICTS

Every district already declares, per tile, a `kind` that the kit resolves to a
layer + solid + **enter** (DISTRICT DOSSIER LAW, 7/19). **That is an exposure map
and nobody had ever read it as one.**

    OPEN    ground-layer, not solid    roads, lots, lawn, plaza, walks, desert
    SEALED  a vehicle, or a building tile that declares an interior
    NONE    solid mass with no way in, props, portals, overhead

So the dead pass is **one file** that works on all 61 registered districts today
and on every district anybody adds tomorrow, without touching one of them.

---

## HOW MANY, AND THE NUMBER I NEARLY GOT WRONG

Derived from canon, never typed in:

| | |
|---|---|
| real Clark County pre-crash | 2.34 M |
| model scale (1:17.3 by housing) | → **135,260** in our valley |
| GDD v5: ~3% remain | → **131,202 dead** |
| still readable as remains at 10 years | **60%** → **78,721** |

**The 60% is the argument, not a dial I liked the look of.** ~4,000 survivors were
left holding ~131,000 bodies: **thirty-three dead per living person**, in summer,
with no fuel and no machinery. Real mass-casualty events overwhelm disposal at far
gentler ratios. So the honest default is not "most were cleared" — it is **the dead
were never cleared at all.** What ten years took is **legibility, not count**, and
that is modelled by form and scatter, which is the correct place for it.
*(The disposal fork in the death-math addendum is still **[PENDING Paolo]** — a/b/c.
That ruling moves this one number and nothing else, on purpose.)*

### THE DENOMINATOR WAS WRONG BY 33% AND THE GATE IS WHAT FOUND IT

To conserve the valley total you divide by the mean story weight of **a real
valley cell**. I first used the plain mean over the story table. That is not the
same thing, and it overshot by **33%** — because this valley is mostly suburb
(2,582 cells) and arterial (2,434), both heavier than the table average. **A table
of 77 rows says nothing about a map that uses two of them for half its area.**

    plain table mean     6.71   ->  104,825 placed vs 78,721 target
    cell-weighted mean   8.94   ->  lands on the death math (ratio 1.03)

`dead_gate.js` re-measures it against the **live** world every run, so a lane that
changes the district mix cannot silently move the body count of the game.

---

## STORY-VIA-PLACEMENT: THE DEAD ARE NOT WALLPAPER

Paolo: *"where bodies lie tells what happened there."* A body every ten metres
everywhere says nothing. **Concentrate it and the map narrates.** Every row is
defensible:

| place | reads |
|---|---|
| **suburb / apartment / estate** | died **at home**, indoors — the biggest bucket in any real mass-mortality event |
| **jail, prison** | **locked in.** Nobody opened the doors. Near-zero outdoors, highest sealed in the game |
| **medical** | the wards, then the corridors, then the line outside that never got in |
| **resort** (118 cells) | thousands of rooms of people with no way home, and the doors held |
| **the Strip** | caught in the open, and sealed in the cars beside them |
| **freeway / interchange** | the exodus, stopped |
| **water, reservoir, springs** | they crawled toward it and stopped short |
| **industrial, warehouse** | almost empty. **Work emptied — people went home to die** |
| **cemetery** | almost no loose dead. It is where they were *supposed* to go. Only the overflow at the gate |
| **open desert** | the walk-out that did not make it. Thin, scattered, and **zero husks** — nothing out there is sealed |

---

## THE INTERIOR LAW DID THE HARDEST PART FOR FREE

**INTERIOR-MATCHES-EXTERIOR (Paolo 7/19, LOCKED)** says the floor plate *is* the
footprint. So a husk placed on building tile `(x,y)` **is** the husk standing at
`(x-foot.x, y-foot.y)` when you walk in. No second placement, no second roll, and
**no way for the two views to disagree.** The body you cannot see from the street
is at exactly the tile you find it at when you open the door.

---

## REUSE-FIRST: THIS COOKS ZERO PIXELS, AND THE ART WAS ALREADY HIS

Two days ago another lane measured that **89.5% of the art in this repo has never
drawn a pixel.** The single largest never-drawn approved bank is `TP_TILES.gore`
— **73 tiles, zero draws.**

Proved by aspect-sequence match against `BOHEMIA_HD_TILE_REPO_part*.txt` that it
is two packs from his Great Sweep: *"10. Zombie bodies and bones"* (34) and
*"skeletons and bones"* (39). **62 of the 73 carry Paolo's own UP.** All 11 DOWN
are in the zombie pack, and the module uses UP-only ranges **with a ±1 index
safety margin around every DOWN**, so even a one-off mapping error cannot surface
a tile he killed.

**Blood/gore stays out permanently.** It is fresh-kill canon and still on hold
("story-placed by Paolo"). **Ten-year-old dead do not bleed.**

---

## FOUR THINGS WENT WRONG AND ALL FOUR WERE CAUGHT BEFORE SHIPPING

1. **The biggest district in the valley held zero dead, silently.**
   `BohemiaDistrictKit.get('suburb')` returns **null** in the running app — the
   suburb is the one district inlined before the kit, so its registration has
   never run there (recorded 8/3, deliberately left that way). Trusting the
   registry meant **2,582 cells of suburb quietly held nothing**, and the feature
   would have shipped looking like it worked everywhere except where Paolo walks.
   Caught by measuring coverage in the real browser, not by reading the code.
2. **The renderer drew a scatter trail the pass never validated.** The module
   picked the dispersal direction from one hash; the draw re-derived it from the
   tile index — a different number. So bones validated running north were drawn
   running east, through walls. **Anything two places compute separately is a bug
   waiting for a seed.** The direction now ships with the body.
3. **I drew them as specks, and squashed his art doing it.** First render: 0.55 of
   a cell, forced square. I looked at the screenshot: two pale dots on the asphalt,
   and portrait tiles (17×28) crushed by a third. A tile is 0.75 m and an adult is
   1.7 m — **a body spans over two tiles.** The "BIG: render smaller" sweep flag is
   about props standing in a room; **a femur is not a sofa.** Height now carries
   the scale and width follows each tile's own ratio, so a judged tile is never
   reshaped.
4. **My own gate invented 51 violations that did not exist** — it reconstructed
   the scatter direction instead of reading it, committing the same bug it was
   built to catch. And a second check went red on the module's own REUSE line
   saying the blood bank was *NOT* used. **A checker that cannot tell a mention
   from a use is the broken one.** Fixed the ruler, not the target.

---

## WHAT IS MISSING, NAMED RATHER THAN HIDDEN

- **There are no abandoned cars on the road cells.** Dead cars exist only as
  district lot tiles, so the *"sealed in the cars"* half of the exodus story has
  no surface to land on. The husks are **not** quietly re-routed into the open to
  pad the number — the shortfall is real. A car layer on the roads is a world job.
- **Mountain and water hold nobody**, deliberately: `realizeCell` marks both
  unwalkable, and a body you can never walk up to is a body nobody will ever see.
  Their cells still count in the weight table, so the total stays conservative
  rather than padded.
- **Named dead stay Paolo's.** The tower die-off, the exodus road, the hospital
  order. This lays down the ambient dead the world is made of and leaves `story`
  on every placement so an authored beat can override a site later.

---

## THE GATE

`gates/dead_gate.js`, suite **THE DEAD**, **42 claims, 61 districts swept, 2,657
bodies checked.** It asserts the *ruling*, never one spelling of it: is a body in
the open a skeleton, is a sealed body a husk, does the valley hold what the death
math says, does the page Paolo walks actually call the pass, and does it draw
under the walls rather than over them.

**Eight planted mistakes, eight caught by name** — husks turned into skeletons
(1,234 violations), mummies made to scatter, the tile range widened over his DOWN
verdicts (18), bodies shrunk back to specks, the denominator halved (ratio 2.31),
the page unwired, the draw order flipped over the walls, and the room husks let
through the walls outdoors.

Verified on the real surface with `tools/bohemia_dead_look.js`, which drives the
actual world page at iPhone portrait and counts what reached the glass:
**6 of 6 sampled districts drew remains on the real canvas.**

---

---

## AND THE CHECKOUT LIED AGAIN, MID-BUILD

Another lane recorded this on 8/7 (`BOHEMIA_THE_CHECKOUT_LIES_8_7_26.md`). It
happened to me today, in the middle of this work: **`HEAD` silently rolled back to
an older commit** while the working tree kept my files. The reflog had no record of
anything I had done this session — it ended at a rebase from a previous one.

The trap is that everything still *looks* fine. `git status` answers, gates run,
files are where you left them. What is actually true is that **the tree is a mix of
your new work and a stale base**, so a commit from there would have quietly
reverted other lanes' changes to `BOHEMIA_CITY_WORLD.html` — including the
house-flooring work that landed while I was building.

What worked, and is worth copying: **copy every new file out of the repo first**,
then `git checkout -B <branch> origin/main --force`, then **re-apply** — re-run the
patch tool against the *fresh* page rather than committing the patched stale one.
The patch tool being idempotent and anchored on text (never line numbers) is what
made re-applying a 30-second job instead of a merge.

**A gate suite that was running at the time was killed on purpose.** It had measured
the stale tree, so its verdict was about a tree that no longer existed. A green
result from the wrong tree is worse than no result.

## THE LIFE LESSON UNDERNEATH (never preached in game)
Where a person ends up says more about what happened to them than anything they
were carrying.
