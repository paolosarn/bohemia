# INTERIORS: THE KILL, THE TWO LAWS, AND THE GREAT SWEEP CROSSING (7/26/26, CITY)

Paolo on the first interiors: **"Dogshit."** Recorded as a KILL, post-mortem in
`gates/bohemia_graveyard.txt` under `INTERIOR_SHELL_v1_7_26_26`.

## WHY IT WAS DOGSHIT (the honest read)

The mechanism was never the problem: you walk into a wall whose dossier declares
an interior, the plate is exactly the footprint, you walk out the door. That
stays. The LOOK failed, and it failed three times in one day for three different
reasons, which is the useful part:

1. **v1 painted flat hex fills** while 1,927 assets he had personally judged UP
   sat unused. ("half of the file size of bohemia is the graphic assets and
   you're not using a single one of them")
2. **v1b grabbed the raw TP_TILES cut corpus** and put purple, cyan neon and
   live grass in a dead house. That corpus is the PRE-VERDICT judging surface.
3. **v1c used the approved facade kit** — lawful, and still dogshit, because it
   is FIVE TEXTURES: stucco wall, dead window, boarded window, weathered door,
   concrete slab. A room built from an exterior facade kit and nothing else is
   an empty box with a wall texture. No floor variety, no furniture, no clutter,
   no reason to walk in.

## WHAT LANDED THIS TURN

Two laws landed on main WHILE this was being built, and the shipped interior
violated both. Fixing them is not new art, it is compliance, and it is exactly
the work the freeze still allows (integration of already-approved assets).

**1. THE DOOR LAW** (Paolo 7/26, LOCKED): "doors are always two tiles tall, two
by one". The interior was drawing a flat 1x1 gold stamp — the precise failure
that law was written about. Interior doors now consume
`banks/BOHEMIA_DOOR_ANIM_BANK_7_13_26.txt`: the 10 approved residential swing
clips, verbatim, 88x176 = ONE WIDE, TWO TALL, standing on their own cell and
rising into the cell above. Same bank, same clip filter, same 88x176 assertion
the RUN lane's build already makes — one consumption contract, not a second one.
Drawn in its own pass AFTER the walls, or the next wall row overdraws the top
half of every door.

**2. THE MOBILE RENDER CONTRACT** (7/26, ART lane): non-integer scale is BANNED
— "a 3x phone blitting a 1.07x buffer destroys pixel art". The interior camera
fitted the plate with a fractional cell size, which is exactly that. The cell is
now always a whole number of pixels and the origin is rounded.

Both are locked in `gates/interiors_gate.js` (22 -> 40 checks).

## THE GREAT SWEEP CROSSING — BUILT, AND DELIBERATELY PARKED

The fix for "empty box" is furniture, and the furniture exists: Paolo's Great
Sweep (`banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt`, "THE act-1 art
authority") holds 2,604 individually judged assets, 1,927 UP. Nothing in the
game could use them, because his verdicts are keyed by `(pack, idx)` into the HD
masters and nobody had ever crossed that key back to the images.

`tools/bohemia_interior_pool_factory.py` is that crossing. **All 87 swept packs
resolve against `banks/BOHEMIA_HD_TILE_REPO_part1-4.txt` — zero unresolved.** It
emits `banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt`: UP-ONLY, 465 tiles bucketed by
what a room actually needs (floors 48, walls 48, doors 20, windows 16, furniture
31, tools 40, container 60, clutter 80, debris 50, light 24, plant 24,
dirtfloor 24), each carrying its own draw scale from the sweep's BIG/SMALL
flags. A DOWN tile cannot enter the file. Bodies and gore are excluded on
purpose: they are UP, but where a corpse lies is a story Paolo places, not
decoration a tool scatters.

**IT IS NOT WIRED INTO THE GAME, AND THAT IS THE POINT.** The ART-FIRST RESET
landed the same day: until Paolo approves a TARGET SCREEN, all new visual
cooking outside the ART lane is FROZEN, and the target's LOOK is still unjudged
("rev 2 is waiting on one tap"). Dressing every room in the valley out of 465
loose tiles, before there is an approved image of what a room should look like,
is precisely the "cooking up bullshit tiles" the reset exists to stop — and
TILESETS ARE SETS says a tileset is judged as one assembled scene, never loose.

So the pool ships as an ART-lane ingredient, not a CITY-lane look. It is the
thing ART item 2 (MASTER ACT-1 TILESET) needs on day one: his own approved
corpus, already filtered to UP, already bucketed by room function.

## WHAT IS STILL OWED

- Rooms are still empty. That is now blocked on the target-screen pick, by law,
  not by capability. The moment the look is approved, the pool is sitting there.
- Garage and crypt interiors still render as rooms in the alpha; the engine
  dispatches decks and vault halls correctly. Backlog CITY.
