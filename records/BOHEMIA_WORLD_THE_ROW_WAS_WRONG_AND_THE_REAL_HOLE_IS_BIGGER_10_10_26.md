# THE ROW WAS WRONG, AND THE REAL HOLE IS BIGGER

WORLD lane (chat 02), 10/10/26. Row `[the cells with no board]`.

---

## 0. THE ROW, AND WHO WROTE IT

> **[the cells with no board]** TWENTY-EIGHT-DISTRICTS-A-FIGHT-CANNOT-BE-CUT-FROM.
> Of the 78 district names the thirteen live grounds are made of, 28 have no kit
> that can draw a block, so a fight cut from one of those map cells has nothing to
> build a board out of.

**I wrote that row, last round, off my own measurement.** Rule 74 says a lane that
ships its last OPEN row writes the next from its jump list, and that is the one I
wrote. The measurement in it is correct. The conclusion is wrong.

---

## 1. **RULE 12: THE FIGHT NEVER CUTS A BOARD FROM A DISTRICT KIT**

One read of the live code says so.

The district kits draw the **walked city** and the **painted map**. The fight asks
`nfKind(district)` for one of **nine board kinds**, and COMBAT's generator deals a
board out of its own block library (`records/target/bb/ours.json`, `board_mix`).

**`estate` and `gated` have no kit, and both land on `culdesac`, a real board,
every time.** A district with no kit is not a fight with no floor.

So the row as written asked for a fix to something that is not broken. The honest
thing is to say that in the first paragraph rather than to find work in it.

**That is three rounds running where rule 12 found the premise wrong, and this is
the first time the premise was one I wrote myself.** Writing the next row from my
own measurement is what rule 74 asks for, and it is also how a lane hands itself a
false premise with its own name on it. The measurement was right; I reasoned past
it into a mechanism I had never read.

---

## 2. **WHAT IS REALLY WRONG IS NEXT DOOR, AND IT IS BIGGER**

`nfKind` is a hand-written list of district names living in the slice, parallel to
the 78 in `bohemia_boardterrain.js`, with nothing binding them together. Run every
live district through it:

| board kind | districts |
|---|---|
| **`ruin` (the catch-all)** | **24** |
| strip | 15 |
| landfill | 11 |
| suburb | 8 |
| scrub | 6 |
| shore | 6 |
| culdesac | 3 |
| wash | 2 |
| freeway | 2 |
| suburb_stem | 1 |

**Twenty-four of the seventy-eight fall through to the catch-all. That is more
than any real kind gets.** `ruin` is a real block in the city family, so the fight
works -- it just always leads with the same block. Over twenty rolled valleys:
**154 cells a valley, 1.67% of the map.**

**Who is in it matters more than how many:**

- **The airport and the airbase** -- 122 cells a valley with the speedway and the
  stadium, the biggest single set-piece terrain in the valley.
- **Every civic building**: the city hall, the courthouse, the jail, the prison,
  the police station, the fire station, the hospital, the radio station.
- **Three of the six legendary gear places** this lane shipped on 10/9: **the
  arsenal, the data fortress and the granary** -- the places guarded by up to
  sixty men holding the best gear in the game.

They all open the same fight.

That is **rule 46 (NO TWO COMBAT BOARDS ARE THE SAME) failing a level up from
where it is checked.** The board still varies, because the other one or two blocks
are shuffled. **The thing the place IS always reads as a ruin.**

And because the two lists are held together only by hand, **every district WORLD
adds becomes a ruin in silence.** The fight's list already knows one name,
`beltway`, that no live ground uses: the same drift running the other way.

---

## 3. **I BUILT THE OBVIOUS FIX AND THREW IT AWAY**

The obvious move is to give each of the 24 the existing board kind whose boards
are closest in how blocked they are. I built it. It produces:

| district | measured cover | nearest kind |
|---|---|---|
| courthouse | 30.6% | culdesac |
| jail | 29.8% | culdesac |
| medical | 42.1% | culdesac |
| arsenal | 24.6% | strip |

**A jail that fights like a cul-de-sac is worse than the ruin it replaces, because
it is confidently wrong.** Nine of the 24 land on `strip` and eight on `culdesac`
for no reason other than a percentage.

That is `[bb places]`' 9/25 defect and it is **the exact mistake this lane made on
10/9 and said it would not make again**: dressing a reading up as a measurement.
So `standInFor()` answers **NO_RULING** and names COMBAT.

**What it gives instead is which block the library is MISSING**, which is a fact
about the block library rather than a guess about the map. The 24 are three
families and the library has no block for any of them:

| family | districts | cells a valley | the block it wants |
|---|---|---|---|
| **infrastructure** | 7 | **122.2** | AN APRON: open paved ground, one long shed, a perimeter fence |
| **plant** | 9 | 17.5 | A COMPOUND: a wall with one gate, tanks and sheds inside it |
| **civic** | 8 | 14.6 | A CIVIC INTERIOR: a counter, a corridor spine, small rooms either side |

**The grouping is a reading and it is stated as mine**, with `tuned:false`. A
courthouse and a jail are the same kind of place to fight in -- a public counter,
then corridors, then cells and offices -- and that is what the real buildings are,
not what a percentage says.

---

## 4. THE GATE, AND THE ONE LEG THAT MATTERS

`gates/board_kinds_gate.js`, 24/0, registered as BOARD KINDS.

**It parses `nfKind()` out of the live slice on every run** and pushes all 78
districts through both the fight's own function and the mirror. One name different
anywhere and it is red. Nothing else in the file is worth anything if the mirror
is stale.

**And the fall-through count is a ratchet: 24 today, and it may only shrink.** That
is what stops the next district WORLD adds becoming a ruin in silence.

Mutation-proved three ways, and the first is the real test: **edit one district
name inside the live fight and the gate names it** (`courthouse: slice=culdesac
mirror=ruin`). Guess a stand-in and it goes red. Drop a district out of its family
and it goes red naming the district.

**My own parser was wrong twice before it was right, and the gate caught it both
times.** The first version took the first line ending in a `return` and came back
with `strip` -- the first rule, not the fall-through -- and the mirror disagreed on
nine districts. The second found nothing because the real catch-all line carries a
trailing comment. It is anchored on the line's shape now. A parser that reads the
wrong line is the same class of defect as a legend count read as a board, which is
last round's finding, so this lane has now made that mistake twice in two rounds in
two different instruments.

---

## 5. THE COOK

`tools/bohemia_board_kinds_cook_10_10_26.js` -> `slices/vote/WORLD_THE_SAME_FIGHT.png`.
VOTE tab, `world-the-same-fight-10-10`.

The valley with every cell coloured by the board it fights on: nine real kinds in
three quiet near-black steps, and the catch-all lit in three colours, one per
family. The airfield is the big pale block out past the edge of town, the civic
core is the orange cluster near the middle, the guarded compounds are rust pips
scattered across the valley. **Nothing is arranged; the generator placed all of
it, and the picture is one rolled valley with the refusals swept over twenty.**

**AH-01, and the wrong thing is what is lit.** A map colour-coded by which level
loads is the ordinary part, the thing a level editor prints. **The jail, the
courthouse, the city hall, the police station, the hospital and the armoury are
all the same place.** Every building the old world kept order in has collapsed
into one room.

---

## 6. ROUTED

- **COMBAT [board generator]** -- all of the fix. Three blocks to cut (the apron,
  the compound, the civic interior) and nine names to add to `nfKind`. The apron
  first: it is 122 cells a valley on its own, eight times the civic core.
- **COMBAT / the coordinator** -- `nfKind` lives in the slice as a hand-written
  list. The mapping is now a data file and the gate binds the two; whether the
  slice should read the data file instead of its own regexes is COMBAT's call.
- **`beltway`** -- the fight's list knows it and no live ground uses it. One word,
  either way.
- **TUNING** -- nothing felt here. The only numbers are counts.
- **MODS** -- `records/target/BOHEMIA_BOARD_KINDS.json`.

---

`[bb boards]` **Battle Brothers never has this problem and the reason is the one
thing we gave up on purpose.** Its tactical map is picked from the world map tile
you fight on, and because that world is authored once by hand, every tile type it
has is a tile type somebody drew a battlefield for: there is no fall-through,
because there is nothing to fall through from. **OUR TWIST** (rule 39b): our
valley is generated, so the district list can grow past the board list and nobody
notices -- which is exactly what happened to 24 of 78. The answer is not to
hand-author the valley. It is that **a rolled world needs the two lists bolted
together by a machine**, so the day somebody adds a district, the fight says "I
have no board for that" out loud instead of quietly loading a ruin. BB buys
correctness by never changing; we have to earn it every run.
