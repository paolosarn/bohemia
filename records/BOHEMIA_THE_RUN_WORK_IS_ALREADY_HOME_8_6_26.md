# THE RUN WORK IS ALREADY HOME (8/6/26) — CANCELLING MY OWN INSTRUCTION

`BOHEMIA_THE_TREE_MOVES_UNDER_YOU_8_4_26.md` told the next session to "re-land the RUN
work onto the split main." **Do not do that. It is already there.** Verified against
`origin/main` @ `b037e2f`, build `8/6c`, in `slices/BOHEMIA_CITY_WORLD.html`:

```
sigPass                        2   his traffic signals
shadowPass                     2   building shadows on the in-game clock
__DOOR_JAMB2__                 3   the door frame that bleeds into the next tile
__STEP_INSIDE__                2   you walk THROUGH the doorway, not into it
__EVERY_BUILDING_HAS_A_DOOR__  1   a door where a building meets standable ground
__EW_FACING_DOORS__            3   east/west facing doors, his 7/10 art
__SUBURB_EW_DOORS__            1   ...in the district he actually spawns in
__XRAY_WHOLE_BUILDING__        2   the whole building goes transparent
```

Eight for eight. The branch was the stale artifact, never the work.

## WHAT THAT MEANS, AND IT IS THE POINT

I spent a turn diagnosing a re-land that did not need doing, because I trusted a BRANCH
as the record of what is shipped. **The branch is not the record. `origin/main` is.**
That is the same failure shape as the other three this week: correct reasoning over the
wrong input.

**THE CHECK, and it belongs at the top of every session:**
```
git fetch origin main
git rev-parse HEAD          # what am I actually looking at
git rev-parse origin/main   # what is actually shipped
grep -c '__YOUR_MARKER__' slices/BOHEMIA_CITY_WORLD.html   # is my work live
```
Ten seconds. It would have saved this turn and most of 8/4.

## THE NEXT JOB IS UNCHANGED AND UNBLOCKED

ONE-WORLD INTERIORS, step 2 of `BOHEMIA_ONE_WORLD_INTERIORS_SPEC_7_31_26.md`: stamp the
floorplan into the world grid `G` at the building's own coordinates, so a house's inside
is literally the same array as the street outside it. Step 1 (room + roof on the cell) is
done and gated.

It closes, at the root rather than one at a time:
- windows not matching what is outside (there is only one grid to read)
- "no loading screens, same world" (the mode swap IS the loading screen)
- interior walls being the exterior's stucco (materials come from the room)
- concrete floors in bedrooms (same)

**THE TRAP, already proven twice:** the surface he plays is the CITY renderer. Render-side
steps must land in `slices/BOHEMIA_CITY_WORLD.html` — PLAIN TEXT now, no base64 — or they
do not exist for him. Every `tools/bohemia_city_*_patch.py` still targets the dead
`CITY_B64` and must be repointed before it can be used again.
