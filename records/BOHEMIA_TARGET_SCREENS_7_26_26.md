# BOHEMIA — THE TARGET SCREENS (ART lane, 7/26/26) — AWAITING PAOLO'S PICK

The ART lane's first and only deliverable, per the LOCKED art-first reset
(laws/BOHEMIA_ADDENDUM_ART_FIRST_RESET_7_26_26.md, law 1). Paolo picks ONE. The
winner becomes the visual constitution: no art ships after that unless it moves
the real game toward that image.

JUDGE IT: alpha -> LIFE tab -> **PICK THE TARGET SCREEN** (first card, gold).
Each candidate sits SIDE BY SIDE with a real screenshot of the build he plays
today. SUN MODE for daylight. One tap = the pick. Export lands as .txt.

---

## WHAT HE SAID, AND WHAT THIS ANSWERS

> "I'm obviously very unhappy with the graphics... I can't even begin to envision
> anything because you're just cooking up bullshit tiles... I can't approve any
> more shit without the world actually looking consistent every time I see it
> with approved graphics... I like the districts in city builder mode... the
> walkable districts [street level] are two different things."

The diagnosis on the record was that the project had NO TARGET RENDER — the
liked art (city-builder districts) had a real reference, the hated art (street
level) had none. These three screens are that missing image, drawn three ways,
so the choice is a look at a picture instead of an argument about a direction.

## THE THREE

| | what it is | what it costs |
|---|---|---|
| **A — THE FRONT FACE** | The grid the run already walks, but every building STANDS UP: pitched sky-lit roof, readable wall, windows with sills, a 2-tile door with the room visible through it. | Cheapest. The walk, the collision and the map all stay as they are. Structurally, only ONE side of a street can ever show its face. |
| **B — THE ISO BLOCK** | True 2:1 dimetric — the projection of the district view he already said he likes — at walking distance. Lit side, shaded side, dressed roofs, and BOTH sides of a street wear a face. | New renderer + diamond grid. The approved car wrecks were cooked near-top-down and read wrong against it (an honest, visible cost in the screen itself). |
| **C — THE CUTAWAY** | B's world, except the building you walk into loses its two near walls: the room, its floor and its contents are on screen while you are in it. No loading, no second mode. | Most renderer work: wall-hiding rules per building type. Sells INTERIOR-MATCHES-EXTERIOR harder than a door ever can. |

## WHAT THEY ARE MADE OF (APPROVED-ASSETS-FIRST, Paolo 7/26)

Every wall, roof, window, boarded panel, door leaf, yard, road, sidewalk, lane
line, curb, desert, rock, rubble, boulder, car wreck, fire barrel, lamp and
mounted sign in all three screens is a tile he already approved:

- `banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt` — the 30/30 UP house-skin cook
- `banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt` — the harmonized street pools
- `banks/BOHEMIA_STREET_PROP_POOLS_7_18_26.txt` — car wrecks, fire barrels
- `banks/BOHEMIA_DESERT_POOLS_7_18_26.txt` — ground, rock, rubble, boulder
- `banks/BOHEMIA_LAMP_DARK_VARIANTS_7_14_26.txt` — the BLESSED lamp bank (the 45-law reference)
- `banks/BOHEMIA_MOUNTED_SIGNS_7_13_26.txt`, `banks/BOHEMIA_PERIMETER_WALL_POOL_7_14_26.txt`

The person is not drawn here at all. `tools/bohemia_char_export.js` drives the
SHIPPED alpha in a real browser and bakes the character through the game's own
`buildFrame()` / `frameToRGBA()` — the same pair the run, the city and combat
bake through. The screens wear the real rig, the real wardrobe, the real face.

WHAT IS NEW, and why the corpus could not do it:
1. **2-TILE DOOR OPENINGS.** The corpus only has `wall_door_18..20`, a whole door
   squeezed into ONE 44px tile. Law 5 makes doors 2 tiles tall, so the opening is
   CUT from the approved leaf's own pixels and re-hung at 2 cells: approved
   material, new geometry.
2. **BUILDING MASSING / SHADING / SHADOWS.** There is no approved bank of
   standing street-level volumes — the district heroes were KILLED
   (`records/BOHEMIA_DISTRICT_HERO_VERDICT_7_23_26.txt`). The masses here are
   geometry only; every surface they expose is filled with an approved tile, per
   `records/BOHEMIA_POCKET_CITY_STYLE_REFERENCE.md`.

DELIBERATELY NOT TOUCHED: the raw `TP_TILES` cut corpus embedded in the CITY app.
That is the PRE-VERDICT judging surface, and sampling it is what put purple and
neon in a dead house earlier the same day. The gate now fails if the factory
reaches for it.

## THE PROPORTION CANON (law 5, now machine-held)

Derived, not invented:

- `CELL_M = 0.75 m` per ground cell (engine constant)
- a human is `1.75 m` (`tools/bohemia_scale_study.py`, researched LV averages)
- a **door opening is 2 cells tall** (law 5) — call it ~2.05 m
- therefore a standing body must clear **~77%** of its own doorway

`gates/target_screen_gate.py` computes that from the factory's own constants, so
a future tweak to `CELL`, `ZH` or `BODY_K` cannot silently break proportion. Also
held: three flat tones ordered sky-lit > front > away, top/away contrast >= 1.6,
NO black keyline (< 6% near-pure black), no warm night glow (act-1 windows are
dead dark glass), iPhone-portrait frame, every declared bank really opened.
**63 checks, green.** Registered in `python3 gates/bohemia_gates.py`.

## LAW 4 ENFORCED THE SAME TURN: QUEST ASKS ARE FROZEN

> "there's two or three sessions asking me about quests and we're not even close to that"

The LIFE hub was leading with two live quest verdict cards. Both are now marked
PARKED — QUEST ASKS FROZEN, kept reachable as the record, and the gate fails if
either goes back to asking before the visual bar is set. The quest lanes may keep
building; nothing asks him about a quest until he picks a screen.

## HONEST LIMITS OF THESE SCREENS

- They are POSTERS, assembled by `tools/bohemia_target_screen_factory.py`. They
  are not the engine rendering. That is the point of a target render — it shows
  the bar before the systems chase it — but nobody should read them as "the game
  already looks like this."
- Candidate B/C expose a real corpus gap: the approved vehicle sprites were cooked
  near-top-down and do not sit correctly in true iso. If B or C wins, the vehicle
  family has to be re-cooked to the new projection. That cost is visible in the
  screen on purpose rather than hidden.
- Nothing here changes the run, the city, or any district. No pixels shipped into
  the game. The only live change outside `records/target/` is the LIFE hub card
  and the quest-ask freeze.

## FILES

- `records/target/BOHEMIA_TARGET_A_FRONTFACE.png` / `_B_ISOBLOCK.png` / `_C_CUTAWAY.png`
- `records/target/BEFORE_RUN.png` — the shipped walkable street level, same frame
- `records/target/BOHEMIA_TARGET_SPEC.json` — the measurable canon
- `records/target/char/` — 40 real bakes out of the alpha
- `slices/BOHEMIA_TARGET_SCREEN_JUDGE_7_26_26.html` — the judging surface
- `tools/bohemia_target_screen_factory.py`, `tools/bohemia_char_export.js`,
  `tools/bohemia_target_before_shot.js`
- `gates/target_screen_gate.py`

## THE MOMENT HE PICKS

1. The pick is written into `BOHEMIA_TARGET_SPEC.json` as `status: PICKED` and
   the losers move to the graveyard with a post-mortem.
2. The target-match half of the gate turns on: the picked screen becomes the
   reference, and every art change from then on is diffed against it.
3. The freeze on new visual cooking lifts (art-first reset law 1).
4. ART lane item 2 starts: the MASTER ACT-1 TILESET built to the target, produced
   and judged as ONE assembled scene, with act1/act2/act3 triptych variants in
   spec (law 2 and law 3).
