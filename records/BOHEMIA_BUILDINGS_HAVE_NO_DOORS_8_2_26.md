# BUILDINGS HAVE NO DOORS (measured 8/2/26)

> "WY IS IT WHEN IM IN THE OUTSIDE OF A BUILDING I CAN ENTER IT FROM JUST WALKING
> TO ANY WALL OF THE BUILDING NOW IM MAGICALLY IN THE BUILDING. NOT EVEN CONCERNED
> WITH FRONT DOOR BACK DOOR."

## THE ONE LINE HE IS DESCRIBING

`stepOnce()` in the CITY renderer has two entry branches:

```js
/* STEP-INSIDE: a solid tile whose dossier declares an interior is a way IN */
if(c&&!c.walk&&c.enter&&...){ if(inEnter(nx,ny,hx,hy,false)){...} }   // ANY solid wall
if(c&&c.walk&&c.portal&&c.enter&&...){ if(inEnter(nx,ny,hx,hy,true)){...} }  // a real door
```

The first branch admits **any solid cell of the mass**, and `c.enter` is stamped on
every structure cell by the realize pass. So every wall is a door. That is exactly
what he walked into.

## WHY DELETING THAT BRANCH WOULD HAVE BEEN A DISASTER

I was one edit away from doing it. Measured first, on the real running world, one
plot of each district type:

| district | solid cells that admit you | `hdoor` facade cells | walkable portals |
|---|---:|---:|---:|
| medical | 5537 | 0 | 6 |
| estate | 4044 | 4 | 0 |
| industrial | 3952 | 0 | 19 |
| suburb | 3636 | 3 | 0 |
| apartment | 3611 | 0 | 0 |
| jail | 3460 | 0 | 0 |
| storage | 3387 | 0 | 0 |
| school | 3087 | 0 | 0 |
| trailer | 2828 | 0 | 0 |
| commercial | 2582 | 0 | 0 |
| courthouse | 2183 | 0 | 0 |
| farm | 629 | 0 | 0 |
| substation | 480 | 0 | 0 |
| park | 164 | 0 | 0 |
| **TOTAL** | **39,706** | **7** | **25** |

**Seven door cells exist in the entire sample. Ten of fourteen district types have
ZERO of either kind.** Delete the solid-entry branch and virtually every building
in the valley becomes permanently sealed. That is strictly worse than the bug.

## SO THIS IS NOT A MOVEMENT BUG

Walking through a wall is not a broken check. It is **the only way in that exists**,
because a building's door is currently a PICTURE ON A WALL TILE and not a CELL.
The `hdoor` art pool paints a door on a facade; nothing marks that cell as the way
through. The renderer has doors. The world model does not.

## WHAT THE REAL FIX IS, IN ORDER

1. **Every enterable building gets a door CELL.** `bohemia_world.js` already exposes
   `portals()` per plot and `entranceSide()` already picks which side a door faces
   from where the plot lets you walk up. The generators need to mark that cell as a
   portal in the grid, so `c.portal` is true where the door is painted.
2. **Then, and only then**, delete the solid-entry branch, so a wall is solid and a
   door is the way through. His S4: entry is GEOMETRY, not an event.
3. Gate it in this order, or the gate locks him out: assert EVERY enterable
   building has at least one reachable portal cell FIRST, and only once that is
   green assert that no solid non-portal cell admits entry.

Doing 2 before 1 seals the world. Doing 1 alone is safe and invisible, which is why
it goes first.

## RELATED, ALREADY FIXED

The outdoor door ART was fixed on 8/2 (it was 29.2% door and 71% blank stucco, a
16x16 wall tile with a small door printed on it, stretched). It now draws the
approved 88x176 plate. That fixed how the door LOOKS. This record is about the door
not being a THING you can walk through, which is a separate and deeper problem.
