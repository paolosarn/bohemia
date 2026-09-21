# V223 — THE PERSON IS 112, AND THE GROUND IS HIS OWN ART (COMBAT lane, `[fight looks]`)

Three things the board put inside this row this round, all of them in the picture.

---

## ONE: THE PERSON IS 112, AND THE LINE THAT BROKE IT SAT UNDER A HEADLINE SAYING SO

**Rule 21** (coordinator 9/21): *"A person is drawn at ONE pixel size on every surface
he walks or fights on (112 box, about 100 px painted) and the camera moves the ground,
never his size… the fight leg OWED to COMBAT `[fight looks]`."*

The whole defect is one function, and the paragraph directly above it already says it
is wrong:

```
  ===== V198 THE GROUND IS WIDER AND THE PERSON IS NOT =====
  HIS SENTENCE: "the size of the 'ground' changes but the player is the same size"
  So this multiplies the FLOOR PITCH and NEVER TOUCHES bodyScale.

  function bodyScale(){ return 1/FIELD_ZOOM; }   /* the people ride the same
                                                    number as the floor */
```

`FIELD_ZOOM` is 3, so the fighter was drawn at **37 px** against the street's 112.
That is CHARACTER's measured 3.03x. It was never a tuning choice: it is a line that
contradicts its own block.

### And the same division was shrinking two more ruled numbers

`TILE_WIDE` is declared *"[DIAL] a house tile in SPRITE WIDTHS — his number"*, 1.75,
and `tileWideMult` builds the lot as `TILE_WIDE * (112*bodyScale())`. **A third of a
person made a third of a house.** So putting the body back puts the lot back, and the
third number falls out on its own:

```
  the body      37 px  ->  112 px      the box the street has shipped at for months
  a house lot   65 px  ->  196 px      1.75 sprite widths, which is what the dial says
  the body                 0.57 lots   "about half a lot tall" -- rule 16's own default
  contentR      7.6    ->  3.86        the world is built to what the screen shows
```

**Nothing is typed.** The body board is untouched: `houseOn()` is false there, so the
old value runs byte for byte, and the gate proves it by turning the board off and
reading 37 back.

---

## TWO: THE GROUND IS THE ART HE ALREADY APPROVED

COOK `db792724` cooked the fight's whole ground bank out of art he approved on 7/28 —
13 kinds, 66 images at 44 px and the same 66 at 88 — and the board's note says **WIRE
IT NOW**, because it is his own art and needs no vote. COOK `60a52ac9` measured why it
matters: the bank it replaces was the city's street from **before** the 9/13 recook,
byte for byte, inside a document that never calls the city's floor, so no cook of the
city could ever reach the fight.

The four old banks are emptied and the cooked one loads in their place, so **the fight
carries one ground bank and it is his.** The proof the gate uses is the counts COOK
deliberately raised, because the old bank cannot produce them:

```
  kerbL  1 -> 8     kerbR  1 -> 8     gutterL  1 -> 4     gutterR  1 -> 4
```

Those four had **one picture each** and tiled identically down the whole frame.

### COOK's drawing rule, taken as the general one

Their words: *"Draw 44 at 1:1 or 88 at 2x, never 44 at 67 — that 1.523 scale IS the
blur."* Generalised: **never upscale a source tile by a fraction.**

- **A lot patch is pure minification**, so the rule does not bind it — but V222's did
  bind itself: it composed at 176 px and drew at the cell, which at a 196 px lot is a
  **1.11 fractional upscale**. The patch is now built *at the size it is drawn*, so it
  blits 1:1 and every street cell inside it is a clean shrink of a 44 px source — the
  same operation the walked street performs (44 → 11, measured). `LOT_SUBPX` is gone,
  which was the last typed number in that path.
- **A marking or a roof** is one tile across the cell and cannot be tiled (V222
  photographed what tiling the median does to the road's yellow dashes), so at a 196 px
  lot it has to come up. It now comes up from **COOK's 88 px art**, which is what that
  second set was cooked for.

---

## THREE: THE STREET DRAWS NO GRID AND THE FIGHT DREW TWO

The sweep's note 3, and DIRECTION round 2: *"the chrome grew."*

**Measured first, because one of the two is not what it looks like.** `drawFloor`'s
grid is painted *under* the board and was photographed being completely covered — it
has never been on his screen at all. It goes anyway, as a stroke per cell of a canvas
nobody sees. The one he **does** see is the board's own, and it goes, **behind a dial
rather than deleted**, because the ship test is that a stranger cannot tell where the
walk ended and the fight began, and a grid the walked world does not have is the
loudest thing on the glass saying this is a different program.

---

## PROOF

`the_person_is_112_gate` — **24 passed, 0 failed**, across THE WORKSHOP and THE CUT HE
OPENS. It is rule 21's fight leg, which the law names as owed to this row. It reads
the street's own 112 in the same session, because a claim about two surfaces needs
both halves.

**Mutation-proved:** against main without the change, **10 red, five arms on each
surface, symmetrically** — body 37, lot 65, kerbL 1, no 2x bank, and the floor
stroking a grid.

`lot_is_sixteen_tiles_gate` — one arm **amended, and the old number was the defect**:
it pinned the patch at 176 px, which is the fractional upscale above. It now asks that
the patch is built at whatever the camera makes a cell, so it blits 1:1.

### Two arms of my own gate were lies, and the mutation run caught both

1. *"he stands about half a lot tall"* passed on the old tree too — 37/65 is also 0.57,
   because body and lot were **both** divided by three. It is kept, reworded as what it
   actually is: a guard that nobody moves one without the other.
2. *"the street draws no grid"* read `G.cellGrid` and called false a pass — but that
   flag is undefined on the old tree too, where the grid is drawn unconditionally. **It
   passed on a tree that draws the thing it claims is gone.** Replaced with a count of
   the strokes the floor actually makes.
3. And the replacement over-counted on its first run: 392 strokes with the grid already
   gone, because a second of frames also draws the reach diamonds, rings and aim line.
   The floor paints into its own cache canvas, so the count is taken there and nowhere
   else. **0 now, 468 and 2,091 on the old tree.**

---

## THE ONE NEW RED IS MINE, AND I AM SHIPPING IT NAMED RATHER THAN HIDDEN

`house_board_gate` goes **17/0 to 16/1**, and the baseline says plainly that it is
mine: on main's own alpha the same gate is 17/0. The leg is *"the glass holds a
handful of houses, not a car park of them"*, bounded 4 to 10, and it now reads
**3.03 across at the camera he is actually looking through.**

**It is a true statement about the game, not a broken instrument** — I repointed the
ruler first, because it was measuring at zoom 1 while its own words say THE GLASS, and
it still fails. **So the bound is not being loosened.**

### What it means, and why it is not this round's fix

Two of his own numbers now collide. A person is 112 (rule 21) and a lot is 1.75 sprite
widths (his dial), so a lot is 196 px and a phone holds about three of them. Against
that:

```
  a rifle reaches          2 houses      you see your reach and one more
  sight                    6 houses      the game says you can see twice what fits
  the way out              3.5 - 6.4     IT IS OFF SCREEN
```

`TILE_WIDE` is marked *"his number, by eye, and his to change"*, and it was set by eye
when a sprite width was 37 px. Nobody re-looked at it after the body tripled — which
is the same finding as everything else this round, one more time.

**The fix is rule 21 applied to the live camera, and it is a second behavioural change
that deserves its own measurement and its own photograph.** The fight auto-frames: it
scales the whole world, people included, to fit the men on screen. Under rule 21 that
camera should move the **ground** and leave the person at 112 — then it can open to six
houses without shrinking anybody, which is both the ruling and the Battle Brothers
read he asked for. That needs the ruled size split from the drawn size, so
`tileWideMult` and `contentR` keep seeing the ruled 112 while the draw compensates for
the live zoom. **Next round, first thing.**

Two other reds in the pass are **not** mine and the baseline proves it: `first_fight_gate`
is 3/6 on main with the identical throw, and `you_can_start_it_gate` is 18/1 on main.

---

## WHAT IS STILL WRONG, MEASURED, NOT FIXED

1. **THE TWO CANVASES RENDER AT DIFFERENT DEVICE PIXEL RATIOS**, and this is now the
   *only* thing left between the two surfaces on body size. The walked canvas is
   ratio 1 and the fight canvas is 2, so a 112 box is 112 CSS px on the street and 56
   in the fight: **on his phone the fighter still looks half the walker.** Rule 21's
   literal words are met (112 box, both surfaces); its intent is not, and closing it
   means changing what the fight canvas renders at, which touches the HUD and is worth
   its own round.
2. **THE GUTTER SHADOW IS ON THE WRONG SIDE, BOTH SIDES OF THE ROAD** (COOK). Not
   touched: whether it is the art or `streetKindAt`'s ordering is a pixel question for
   the bank's author.
3. **THE ROOF-CORNER TILES ARE HALF TRANSPARENT** and punch black triangles through
   the floor (COOK).
4. **THE LIGHT DOES NOT CARRY**: warm walk, cold fight (DIRECTION). The ground is much
   warmer than it was, and it is still not the street's light.
5. **THE ROOF READS AS A FLOOR** — carried from V222, unchanged.

---

## AND TWO MORE RULERS WERE WRITTEN IN A UNIT THE GAME HAD MOVED PAST

Both were found by this change making them fire, and both are repointed, not loosened:

- **`combat_scale_gate`'s "a man is the same number of TILES tall"** asserts, in its own
  words, that *"the floor and the people must divide by the same number"* — which is
  exactly what rule 21 overturns. **A gate must never outrank a ruling** (this lane's
  own 9/12 standing note). Turned over, not loosened: the giants bug was a body whose
  **pixels** moved with the camera, so that is what is checked now, and V138 still
  fails it. The body board keeps the old invariant, because it still holds there.
- **The same gate's "visible" number** read `0.85/FIELD_PITCH`, the pitch from **before
  V198's tile-wide multiplier** — a question about a board the game stopped drawing.
  It claimed 30 tiles visible when the truth was 10.2, which is why that leg has sat
  red on main against a contentR of 7.6. Read properly it is **3.7 against 3.9, green,
  and telling the truth for the first time since V198** — so V223 closes a red that has
  been misreported for weeks.
- **And its probe was reading the wrong canvas entirely**: `querySelector('canvas')`
  returns the 183x54 **logo**, not the board, so every canvas-dependent number this
  gate ever printed was measured off a logo. The tiles-tall ratio survived by accident,
  because both halves divided by the same wrong number.

---

**Tool:** `tools/bohemia_the_person_is_112_patch.py` · **Gates:**
`gates/the_person_is_112_gate.js`, `gates/lot_is_sixteen_tiles_gate.js` (both
surfaces) · **Stamp:** 9/21h · **Tab:** COMBAT, and any fight you walk into from CITY.
