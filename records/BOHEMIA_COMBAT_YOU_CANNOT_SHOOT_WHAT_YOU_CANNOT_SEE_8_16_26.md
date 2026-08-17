# YOU CANNOT SHOOT WHAT YOU CANNOT SEE (COMBAT, 8/16/26, v160)

Paolo: *"I think the weapon range is still aren't good"* and then, plainly:
*"Look up rogue fable four weapon ranges please for the love of God."*

Fair. He said the ranges were wrong four times and I answered by asking him which
way instead of going and finding out.

## THE RESEARCH

From the dev's own Steam threads (*Weapon Range Geometry*, *Simplified range*,
*Basic ranged attack?*). Note: Fandom, Steam, itch.io and SteamDB are all blocked
by this environment's egress proxy, so these come from search results quoting
those threads rather than from fetching the pages.

- **A bow has 7 range.** It hits any tile whose true distance is 7.0 or less,
  measured `a² + b² = c²` against 49.
- **The player has 7.5 tiles of vision.** Sight is *"7 tiles in the best
  approximation of a circle"*.
- Staves (RF3, same designer) are **range 5**.
- **Minimum range on bows was shipped and then removed.**
- A few abilities use **square** range (lightning bolt, storm shot) for extra
  diagonal reach — the deliberate exception.
- The designer's combat devlog explicitly **punishes kiting** (Curse Floor
  over-heals monsters that path over it while you run).

**THE HEADLINE IS NOT THE NUMBER 7. IT IS THAT RANGE EQUALS SIGHT.** In that game
there is no state where you are looking at a man you cannot touch, and none where
you are touching a man you cannot see. And the whole spread from worst weapon to
best is **5 → 7, a factor of 1.4**.

## WHAT BOHEMIA WAS DOING

Measured by walking `fieldPos` outward on eight bearings until it left the real
canvas:

```
YOU CAN SEE      17.5 tiles to the sides, 27.5 on the diagonal
MEN SPAWNED AT   8.9 nearest, 16.6 average, 29.1 furthest
```

Against that:

```
shotgun  max 14   0.8x sight
pistol   max 16   0.9x sight
smg      max 26   1.5x sight
rifle    max 44   2.5x SIGHT
sniper   max 64   3.7x SIGHT
```

**The rifle could shoot two and a half times further than he could see.** That is
not a balance problem, it is an incoherent rule: half the number on the weapon did
nothing but exist. And the spread 14 → 64 is **4.6x** against RF4's 1.4, so which
gun he held swung the board by more than the board is.

## WHAT SHIPPED

```
              was    now    vs sight
shotgun        14      9      0.51x
pistol         16     12      0.69x
smg            26     15      0.86x
rifle          44     16      0.91x
sniper         64     16      0.91x
```

`SIGHT_TILES = 17` (the narrow axis — the distance guaranteed visible in *every*
direction, not just the diagonal). `REACH_CEIL = 16`, which is **0.94 of sight,
RF4's own 7/7.5 ratio**. That thin band is deliberate: it is where you watch a man
walk in before you can touch him, and it is exactly what he asked for on 8/11
(*"everyone starts out of range almost out of range of the weapon and then they
have to walk towards each other"*). Reach = sight would delete it. Reach > sight
is what we had.

**ONE DOOR.** Every reach — yours, theirs, the sniper's, and v151's floor that
hands him the edge over the field — goes through `maxRange`, so no number added
elsewhere can route around sight. His v151 ruling still stands underneath: he
outranges the field, he just cannot outrange his own eyes (measured worst case
over 30 arenas: 16.0, inside sight).

**And the guns do not stop being different**, which is the part RF4 gets right.
Once everything is capped at sight, range stops being the axis that separates
weapons. They already differ by shots per turn, by how far the muzzle swings
(v155), by lethality, and by **EFF** — where each gun actually wants to fight,
which is untouched and is now the real decision.

## TWO THINGS I GOT WRONG AND MEASURED

**1. "The spawns fix themselves."** I wrote that in the first draft because
`SPAWN_NEAR/FAR` are multiples of the player's range. **They did not.** 1.65 × 16
is 26 tiles against 17.5 of sight, so **20% of every fight began off screen** —
invisible *and* unreachable, which is not an approach, it is a rumour. Clamped to
sight.

**2. The sniper was parked at the edge of the world.** 90% of the arena radius,
measured **29 tiles**, on the stated grounds that *"he is the reason the board is
this big."* That reason retired with this research: his reach is the same 16 as
everyone else now, so out there he could not see, shoot, or be shot. He was a
rumour with a health bar. He is still always the farthest man and never the close
one — now the farthest man Paolo can actually see.

```
after:  men spawn at 5.7 nearest, 12.0 average, 18.0 furthest
        99.6% start ON SCREEN     (was 80%)
```

## NOT DONE

**Minimum range.** RF4 shipped it and cut it. Bohemia has never had it and this is
not the turn to add something that game's own designer threw away.

## GATE

`combat_lab_gate.js` **815 pass / 0 fail** · `fight_moves_you_gate.js` **10 pass /
0 fail**. **Mutation-tested**: deleting the sight ceiling takes two checks red.

Five checks were re-pointed, and one was **rewritten because it had gone blind**.
The movement gate's *"killing everyone is still not a win"* check counted fights
where a never-moving player emptied the board — and the sight cap took that to
zero, because he can no longer reach every man from one spot. It was never
measuring reach. It now kills every enemy outright, calls the game's **own**
`checkClear`, asserts that is not a win, then walks out and asserts that is.

TOOL: `tools/bohemia_combat_you_cannot_shoot_what_you_cannot_see_patch.py`
