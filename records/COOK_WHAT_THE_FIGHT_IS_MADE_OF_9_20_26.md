# COOK — WHAT THE FIGHT IS ACTUALLY MADE OF
## Round I, 9/20/26. Rule 18(b) measurement round: NOTHING WAS COOKED AND NOTHING SHIPPED TO THE ALPHA.
## Lane 16 COOK (cook-mce6r5). Routed to COMBAT [fight looks] and DIRECTION [judge the fight].

---

## WHY THIS ROUND EXISTS

Rule 18 (Paolo 9/20) put every building lane but three on HOLD and told the rest to
spend the round measuring their part of loading, walking or the fight. Rule 17 (Paolo
9/18) says the fight is a PICTURE problem first, that DIRECTION posts THE FIGHT VERDICT
every round, and that **COOK draws only what that verdict lists**. No verdict has been
posted yet. So this round produced no pixels on purpose, and produced instead the thing
the verdict will need: what the fight's picture is made of, measured.

His words, 9/18: *"I played the demo and actually sent the link to someone on Instagram
and I was pretty embarrassed... when I zoomed out, it looked good, but when combat
started it was so fucking bad."* And the four things he named: **a black bar, a
checkerboard of roof tiles for a floor, two tiny figures on a brown line, plates and a
face in a circle.**

Every one of those four is real, every one is now located in code, and three of the four
are this lane's.

---

## THE HEADLINE

### THE FIGHT IS THE SAME STREET WITH THE DESERT TAKEN OUT OF IT.

The fight's road and sidewalk are the city's `street` and `side` tiles **as they were
before the 9/13 recook, byte for byte, SHA for SHA.** Same drawings. Same cracks in the
same places. Same weeds. Cold grey instead of warm sand.

    fight `road` : 8 of 8 images are the pre-recook city `street`
    fight `walk` : 8 of 8 images are the pre-recook city `side`
    -------------------------------------------------------------
    16 of the fight's 46 ground images are a frozen copy of a bank
    this lane replaced a week ago and the fight never heard about.

Picture: `records/target/COOK_THE_FIGHT_DRAWS_THE_GREY_STREET_9_20_26.png`
(the fight's row above the city's row, same tiles, same order).

Measured numbers, same tiles:

| | fight copy | city, after the recook |
|---|---|---|
| `road` / `street` colours per tile | 734 – 1,478 | 7 |
| `walk` / `side` colours per tile | 1,105 – 1,362 | 7 – 8 |

The craft ceiling is 64 colours in one tile. **21 of the fight's 33 ground tiles are over
it. The worst is 1,478.**

---

## WHY IT NEVER HEARD ABOUT IT: THE FIGHT IS A SEPARATE DOCUMENT WITH ITS OWN BANK

The alpha and the demo both carry `COMBAT_B64`, 1,864,372 characters of base64 that
decode to a complete, self-contained 1,397,873-character HTML document titled
**"Dead Eye Dial — Aim Build"**. `ensureCombatFrame()` builds an iframe from it. Both
cuts carry the identical payload (sha1 of the base64: `de8419996e32`).

Inside that document, searching for everything the city he walks on is made of:

    SA_TILES  0     TP_TILES  0     PROP_B64  0     PROP_FP  0
    saTex     0     texFor    0     __SKY_ART__ 0   gArtVariant 0
    BohemiaCombatFloor 0

**Not one of them.** The fight has its own bank instead, in four tables that overwrite
each other in load order (`STREET_B64` → `STREET_B64X` → `STREET_B64W` → `STREET_B64S`,
last one wins), resolving to 13 kinds and 46 images:

    road:8  walk:8  kerbL:1 kerbR:1  gutterL:1 gutterR:1
    median:3 lane:2  house:7 yard:4  wall:4  lot:4  slab:2

The city's bank has **fourteen keys and not one of them is on that list**: `street`,
`side`, `lane_h`, `lane_v`, `median_h`, `median_v`, `cross_ew`, `cross_ns`, `pocket_h`,
`pocket_v`, `roof`, `shoulder`, `wallface`, `wallwin`. Two banks, different names for
the same things, no shared key, and a sweep of every `.js` and `.html` the game loads
finds the fight's 46 images in no file the city renderer ever opens.

**So there is no mechanism by which a cook of the city can ever reach the fight.** Any
tile this lane fixes, fixes one of the two. That is the shape of the bug, and it is
exactly the bug `engine/bohemia_combatfloor.js` warns about in its own header:

> *"THE FLOOR UNDER IT IS THE CITY AT A ZOOMED-OUT SCALE... The combat floor is that
> render, centred on the block you are standing on, NOT A NEW BOARD. ONE SEED, same
> coordinates, so the fight happens on the actual streets you walked to... A second
> renderer would be byte-different from the streets he walked to get there, which is
> exactly what 'ONE SEED, same coordinates' forbids, and it is the two-systems bug this
> lane has now written four post-mortems about."*

That module is built, it is inlined into `BOHEMIA_CITY_WORLD.html`, and probing the
running city frame finds `BohemiaCombatFloor` present with its full API
(`TILE_W, TILE_H, setPainter, setGround, ready, plan, paint, at, coverOn`).
**The fight Paolo sees never calls it.** The one thing written to stop this is live in a
frame the fight cannot see.

---

## THE CHECKERBOARD OF ROOF TILES IS REAL, AND THIS LANE WROTE IT

His words: *"a checkerboard of roof tiles for a floor."* It is not a figure of speech.
The fight's ground beside the road is laid out by this, and the comment above it carries
this lane's own marker:

```js
/* __THE_LOT_IS_A_HOUSE__ (COOK, [combat ground], 9/6) ... THE ROOF IS THE HOUSE.
   TG-02: from above-at-an-angle a house is roof planes first, and at combat range
   the roof IS the house's ground read. */
function lotSubKind(wx,wy){
  if(((wx%4)+4)%4===0) return 'wall';                 /* every 4th column */
  return (((wy%2)+2)%2===0) ? 'house' : 'yard';       /* every other ROW */
}
```

**Every other row is a roof. Every fourth column is a wall.** Period 2 in y, period 4 in
x, no variation, at one-house-per-tile. That is a checkerboard by construction, and the
`house` tile is a saturated orange terracotta roof — one of the seven is a literal hip
ridge triangle. See `records/target/COOK_EVERY_GROUND_TILE_THE_FIGHT_OWNS_9_20_26.png`,
the `house` row.

**This lane shipped that on 9/6 under `[combat ground]`**, with a real reference behind
it (Vegas lot sizes, TG-01/02/03) and a real measurement (generic `lot` 26.1% → house
11.2% + yard 10.6% + wall 4.3%). It measured well and it reads wrong. The reference was
right about what a Vegas block IS and silent about what a strict two-row alternation
LOOKS like at house scale. That is the lesson and it belongs in the record, not in a
defence: **a measurement of coverage is not a measurement of the picture.**

---

## THE BLACK BAR IS 14.8% OF HIS PHONE

Photographed on the deployed cut at 390x844, the fight's HUD strip runs from the top of
the screen to y=125 of 844 — **a seventh of the phone, 85.6% pure black**, carrying
SETTINGS (clipped off the left edge), a health bar, WAIT, SUPPRESS,
`SHOVE hostile_0 (stun 1 • 30%)` and `STA...` running off the right edge, and
`WAY OUT 4T` under it. Text is clipped at both ends on a phone. That strip is UI's
([fight hud], rule 17) — named here only because he named it and it is the first thing
on the screen.

---

## TWO GRIDS ON ONE BOARD, NEITHER OF THEM THE TILE

There are two separate grid systems drawn every frame.

**1. The faction floor, UNDER the tiles.** `drawFloor` fills the whole screen with a flat
faction colour, strokes a full grid at `Math.max(26, Math.min(W,H)/12)` = **32.5 CSS px**
on a 390x844 phone (40 lines), then draws one of fourteen motifs over it.

**2. The cell outline, OVER the art.** In `fieldFloorPaint`, immediately after every tile
is blitted:

```js
x.strokeStyle='rgba(18,14,10,0.6)'; x.lineWidth=1;      /* the grid he can read */
```

drawn around every cell at the tile pitch (`ring` 65.33 CSS px, tiles rendered at 67).

So a 32.5 px grid and a ~65 px grid share the screen, and the second one is a dark
1px line on top of every piece of art the floor has. NOT PINNED: the on-screen pitch of
the visible lines in the photograph came back ~128 device px against the 160.7 the game's
own numbers predict, and `userZoom` is animated (0.82 when sampled), so this record does
NOT claim an on-screen number. The two grids exist in code and both run; the pitch on
glass is COMBAT's to read off a still frame.

---

## THE TILES ARE DRAWN AT A SIZE THAT BREAKS THEIR OWN PIXEL GRID

The source tiles are 44 px. The fight draws them at **67 px** — scale **1.523**.
`imageSmoothingEnabled=false`, so it is nearest neighbour:

    source rows drawn once : 21
    source rows drawn twice: 23

**Twenty-three of the forty-four rows in every ground tile are doubled and twenty-one
are not**, in both axes, in every tile on the board, forever. That is a fixed stripe
pattern laid over the whole floor, and it is a second reason the ground reads as a
pattern instead of as ground. The allowed scales under the mobile render contract are
{0.25, 0.5, 1, 2, 4}; 44 → 88 would be clean and 44 → 44 cleaner.

(For the record the street he walks has the same class of problem going the other way:
it draws the same 44 px tile at **18 px**, scale 0.409, which throws away 26 of the 44
rows, 59%. That one is LIFE + CITY's, named here and not touched.)

---

## THE COVER IS NOT ART. IT IS THREE VECTOR SHAPES.

The biggest objects on the fight board by screen area, roughly eighteen of them in the
photographed frame, are the cover pieces. The fallback path draws each one as:

```js
x.fillStyle='#6e604a';  x.fillRect(pxs-s*0.55,_ty,s*1.1,_h);            // a flat tan box
x.fillStyle=(P.tall===false)?'#7a94a8':'#94836a';
x.beginPath(); x.ellipse(pxs,_ty,s*0.55,s*0.2,0,0,7); x.fill();         // a flat ellipse lid
x.strokeStyle='#241f18'; x.lineWidth=1; x.strokeRect(...);              // a 1px outline
```

There IS a sprite path (`coverSprite`, which tiles the `wall` tile onto the face and is
refused when the bank has not decoded), and in the photographed frame the FACES are
sprited. **Every LID is the flat vector ellipse.** No pixels, no material, no light, in
a game where every ground surface is a seven-colour ramp off a family palette.

Tested against the colours the city's ground actually draws:

| | colour | hue | distance to the nearest ground colour the city draws |
|---|---|---|---|
| tall cover lid | `#94836a` | 35 | **6** — this one belongs |
| cover body | `#6e604a` | 36 | **12** — this one belongs |
| cover outline | `#241f18` | 34 | **15** — close enough |
| **low cover lid** | **`#7a94a8`** | **206** | **99** — blue, and the city's ground has no blue in it at all |

One colour on that board is not from this world, and it is on every low piece of cover.

---

## THE FLOOR CHANGES COLOUR DEPENDING ON WHO YOU FIGHT — AND FIVE OF THOSE COLOURS ARE PURPLE

`FACTIONS` carries **fourteen factions, fourteen flat floor colours and fourteen motifs**
drawn over the whole board: `aisle, check, circuit, confetti, cracked, cross, dust, grid,
hazard, plain, plate, shard, stencil, stripe`. The faction is rolled per fight — four
boots of the same cold open gave MOB, CARTEL, REMNANTS and COLORFUL.

**MOB's motif is literally `check`.** CARTEL's is `hazard` (red triangles). COLORFUL's is
`confetti`, which paints pink, green, blue and gold dots on the floor.

Accent colours, measured against every ground colour the city draws (lower is closer):

    NETWORK    #1fbf9c  teal     207 away    ANARCHISTS #c026a0  magenta  160 away
    COLORFUL   #e85aa0  pink     148 away    BLUES      #2e6fae  blue     144 away
    CARTEL     #a01818  red       97 away    VOLUNTEERS #5aae6a  green     94 away
    REMNANTS   #9aa23a  olive     15 away    CARAVANS   #caa05a  tan       27 away

**And the PURPLE RESERVATION is broken five ways on this board**, in the place he
actually looked:

    ANARCHISTS  base   #120814  hue 289  sat 0.43
    ANARCHISTS  line   #2a0e2e  hue 292  sat 0.53
    ANARCHISTS  accent #c026a0  hue 312  sat 0.67
    COLORFUL    base   #100a14  hue 276  sat 0.33
    COLORFUL    line   #241a2e  hue 270  sat 0.28

That is five more instances for this lane's claimed `[purple leak]` row, and they are on
the floor of a fight rather than on a tile in a bank.

---

## WHAT THIS LANE IS READY TO DRAW, THE MOMENT THE FIGHT VERDICT LISTS IT

Nothing below was drawn. Rule 17 is explicit that COOK draws only what the verdict lists,
and rule 18 holds everything out of the alpha regardless. This is the queue, in the order
of screen area, so the verdict has something to rank:

1. **Point the fight at the city's bank instead of its own.** The 16 pre-recook images
   are the single biggest fix and cost zero new art: the recooked tiles exist and are
   shipped. Needs the name mapping (`road`→`street`, `walk`→`side`, `lane`→`lane_v`,
   `median`→`median_v`) and it is COMBAT's call whether that happens by mapping or by
   finally calling `BohemiaCombatFloor`, which was built for exactly this.
2. **Every ground tile at a whole-number scale.** 44 → 88, or the board at 44.
3. **The lot band stops alternating.** Houses of varying width with gaps, not `wy%2`.
4. **The cover lid becomes art** — a real material at the ruled size, and `#7a94a8` off
   the board.
5. **The fourteen faction floors and motifs, judged as pictures.** A confetti floor and a
   hazard-triangle floor are not the same game as the street above them.
6. **The four over-ceiling kinds recooked** (`road`, `walk`, `median`, `lane`), which is
   the same recook this lane already ran on the city and can run again in one pass.

---

## HOW TO RE-RUN ALL OF IT

    node tools/bohemia_what_the_fight_is_made_of_9_20_26.js <outdir>

A caller of THE ONE DRIVER (`tools/bohemia_drive_the_demo.js`, rule 14(g)) — no second
instrument. It boots the demo, photographs the street, calls the game's own
`startColdOpen` (the same call a quest step makes for the first fight) and
`showTabPanel('combat')`, photographs the fight, and prints the fight's own numbers.
Nothing is assigned; the driver's header explains why assignment is not input.

## PICTURES

    records/target/COOK_THE_STREET_BESIDE_THE_FIGHT_9_20_26.png       the two frames, side by side
    records/target/COOK_THE_FIGHT_DRAWS_THE_GREY_STREET_9_20_26.png   the same tiles, fight above city
    records/target/COOK_EVERY_GROUND_TILE_THE_FIGHT_OWNS_9_20_26.png  all 46, by kind

## THE TWO FRAMES, IN NUMBERS

| | the street he walks | the fight that starts there |
|---|---|---|
| warm pixels | **87.0%** | 59.7% |
| cold pixels | 0.0% | 3.2% |
| colours on screen | **11,824** | **73,210** |
| mean brightness | 94.0 | 72.9 |
| near-black pixels | 7.2% | 17.4% |

Six times the colours, on a screen whose floor is made of seven-colour tiles. Everything
above the tiles is vector: ellipses, rings, dashed circles, diamonds, alpha-blended
labels, anti-aliased text.

---

## THE REFERENCE CHECK (standing duty, 9/4 law)

Nothing was cooked this round, so there is nothing to compare to real work of its kind.
The comparison that WAS made is the one rule 17 names: **the street frame beside the
fight frame, on the deployed cut, at phone size**, and against the combat reference's
own department rule — ROGUE FABLE 4 is combat on the beat and nothing else, so it says
nothing about whether a floor should be a photograph. The only authority on the floor is
the street above it, which is why that is what this round measured against.

## THE TRAP THIS ROUND ALMOST FELL INTO, AGAIN

The first sweep for the fight's images searched for `data:image/png;base64,` and returned
**0 PNGs** — a clean, confident, completely wrong number, because the fight stores bare
base64 in tables and adds the prefix at load. `iVBOR` found 62. That is the eighth time
this lane has taken a clean measurement off the wrong oracle. It was caught the same way
as the other seven: by rendering the result and looking at it.

A second one was caught the same round and is now written into the tool: probing the
running frame for the four source tables returns empty, because they are `const` in the
document's own scope. The tool now prints `sourceTablesReachableFromHere: false` rather
than an empty list that would read like a finding.
