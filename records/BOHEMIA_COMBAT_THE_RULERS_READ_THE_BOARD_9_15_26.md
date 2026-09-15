# V219 — THE RULERS READ THE BOARD (COMBAT lane, `[house board]` follow-up)

**Standing duty 8, on my own shipped line: play it.**

V218 turned the house board on last round and I proved it in numbers. This round I
started a fight the way he starts one and **photographed it** — and the picture said
two things the numbers did not.

---

## WHAT THE SCREEN SAID, ON THE GLASS, IN A REAL FIGHT

```
"LONG RANGE ~2m"     for a man standing ONE HOUSE away
"WAY OUT 10T"        for a win condition placed OUTSIDE THE BUILT WORLD
```

Both are the same defect the scale change keeps turning up: **a distance written in
body tiles, carried onto a board made of houses.** That is the sixth and seventh time
in two rounds. It is the real lesson of this ruling, and it is why both fixes below
are **derived** from numbers the game already holds instead of typed.

## ONE: A HOUSE IS NOT A METRE AND A HALF

Two readouts turned tiles into metres with a hardcoded `*1.5` — the enemy row and the
aim line. 1.5 m is a **body** tile, a person's step, and it was right for years. On a
board of houses it told him a man a full house away was **two metres** off.

Metres per tile is now `1.5 × tileK()`, the body-tiles-per-tile number V198 already
defined. On the body board `tileK()` is 1 and the number is 1.5, byte-identical. On
the house board it is 8, so a house is **twelve metres** — which is also a real
suburban lot frontage, so the realism arrives without anybody choosing it. One number
in one place, which is section 3 of his own 9/15 law.

## TWO: THE WIN CONDITION WAS OFF THE MAP

V159 made **reaching the way out** the win: *"killing every man no longer ends the
fight."* It is clamped between `EXIT_MIN` 10.0 and `EXIT_MAX` 18.0 **tiles**, typed,
never read through the scale door. On the house board that is ten to eighteen
**houses**, against:

```
sightTiles()   6      you cannot see it
contentR()     7.6    THE WORLD IS NOT BUILT THAT FAR
one step       1 house a turn, so 10 to 18 turns of walking
the fight      about 14 turns
```

> The one place on the board that is **for** him stood beyond the edge of the world
> that was built, and the HUD said WAY OUT 10T at it.

V200 already wrote this exact sentence about interiors — *"EXIT_MIN is 10 tiles, a
real interior is 11x7, so this would place the way out THROUGH THE WALL —
unreachable… with the HUD still reading WAY OUT 14T at it"* — and refused to place one
indoors. The same sentence had become true of the whole outdoor house board.

**Derived, so the body board cannot move.** Those two figures are really a *fraction
of sight*: against the body board's `SIGHT_TILES` of 17, `EXIT_MIN` is 0.588 of sight
and `EXIT_MAX` is 1.059. Written that way they reproduce 10.0 and 18.0 **exactly** on
the body board, by construction, and on the house board they land at 3.5 to 6.4
houses:

- a walk of four to six turns, a real trip inside a fourteen-turn fight
- inside `contentR` (7.6), so the ground it stands on is actually built
- at the edge of sight (6), so he can see where he is going

`EXIT_R` — *how close is "you made it"* — is deliberately **not** scaled: 1.4 means
the tile next to it counts, which reads the same at either size, because you cannot
stand closer than adjacent.

## THREE: ADJACENT IS NOT ONE, IT IS THE SQUARE ROOT OF TWO

Found on the merged tree, in a real teaching fight, after the two fixes above were
already green:

```
the one man on the board   edist 1.41, a DIAGONAL neighbour
a pistol reaching          1
steps that would close it   none; there is nowhere closer to stand
```

V218 put the house floor at 1 last round and that covers the man directly beside you.
`doMove` steps in **eight** directions — the code's own words are *"full tile steps,
diagonals included (Chebyshev)"* — while `edist` is a **Euclidean** radius. So the
nearest a body can ever be is 1 orthogonally or **root two** diagonally, and a floor
of 1 means *"adjacent, but only on four sides of you"*. Same dead first turn, one
corner over.

`Math.SQRT2` is the smallest number that means adjacent on this board. It is not a
tuning choice; it is the geometry of a square. The body board is untouched.

## PROOF

`house_rulers_gate` — **13 passed, 0 failed.** It starts a real fight by tapping a
body on the street, then reads **what the player is told**, out of the shipped
readouts:

```
the aim line        "LONG RANGE ~12m · EASY dial · SNAPCENTER · SHOT 1 OF 2"
the HUD             "WAY OUT 4T"
the way out         3.53 houses, inside contentR 7.59 and inside sight 6
the body board      still 1.5 m a tile, still 10.0 and 18.0, to four decimals
```

**Mutation-proved three ways:** put the metre ruler back to the body tile → the two
metre arms go red; stop the exit clamp reading the board → the *inside the world* and
*inside sight* arms go red; put the adjacency floor back to four sides → the *man on
the diagonal* arm goes red.

And it is confirmed **on a photograph**, which is what found it: the same fight, after
the fix, reads `LONG RANGE ~12m` and `WAY OUT 4T` on the glass.

### And two instruments moved with it, both out loud

- **The rout gate's runner staging.** Last round I tied it to the pistol's reach. With
  the adjacency floor at its correct value that put the runner at 1.41, past which one
  step clears both guns, so the rifle bought nothing and the window arm went red saying
  so. **It was right to.** Starting a runner at the very edge of the shorter gun is a
  worst case, not a fight. He now breaks from **adjacent**, which is where a man is when
  he turns and runs from you, is one tile on either board, and is the only start from
  which *"how much longer does the better gun hold him"* has an answer. With it: a
  pistol holds him one turn, a rifle two.
- **The combat lab's byte-pinned `maxRange` regex**, re-pointed for the fifth time in
  that line's history. The night scaling it actually asserts is byte-identical.

## THE DIAL

No damage number is touched. Nothing here changes a reach, a chance or a hit.

## WHAT THE PHOTOGRAPH ALSO SHOWED, MEASURED AND NOT TAKEN

- **The bodies are right.** In the aim view the player and the enemy are drawn as
  people, each about half a tile tall against the big house tiles. The scale reads the
  way the ruling asks.
- **Half the screen above the fight is the bench menu** — SETTINGS, YOU 100/100, WAIT,
  SUPPRESS, HAND-PEEK: OFF, NEW ENCOUNTER, STREET #79603 — and `SHOVE hostile_0` shows
  a raw internal id. **This is the alpha's combat tab, not necessarily the demo**, and
  rule 14(g) says never report a break you have not reproduced on the glass he plays.
  It is named here so the next round measures it on the demo rather than guessing.

---

**Tool:** `tools/bohemia_house_rulers_patch.py` (MARK `__THE_RULERS_READ_THE_BOARD__`,
the fight blob only) · **Gate:** `gates/house_rulers_gate.js` · **Tab:** COMBAT, and
any fight you walk into from CITY.
