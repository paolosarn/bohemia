# WHAT WAS ALREADY RED ON MAIN — a measured baseline, not an excuse (8/3/26, RUN lane)

The 8/3 RUN ship ran the full suite and got **32 red**. One root cause (the suburb's
kit binding, see `BOHEMIA_THE_SUBURB_NEVER_HAD_THE_KIT_8_3_26.md`) accounted for most
of it. After that fix: **17 red**. Rather than guess which of the 17 were mine, I cut a
`git worktree` at `8e193ba` (main as of the start of this session) and ran every one of
them there. **Same gate, same repo, no changes — that is the baseline.**

## FIXED THIS SESSION (mine, red before the fix, green after)

| gate | cause | after |
|---|---|---|
| TRAFFIC SIGNAL, FULL RES, RUN SPAWN, SUN SHADOWS, DOORWAY, ZOOM SEAM, DOOR SWING, DOOR JAMB, RENDER PIXEL, CITY PEOPLE, NO PRISON, THREE-TILE WALL, FRONT DOOR, CANVAS SCALE, MASS EDIT | the suburb kit binding took the whole world down | all green |
| CURRENT SLICE | `slices/BOHEMIA_CURRENT_SLICE.html` inlines the engine modules I changed | 6/0 |
| THE RUN | same, for `slices/BOHEMIA_RUN_CURRENT.html` | 126/0 |
| MAP TAB | same, for the MAP tab embed (58 modules) | 9/0 |
| QUEST PLACEMENT | same, for the quest judge page | 20/0 |
| INTEGRATION | probed the stale run slice for the suburb generator | 112/0 |
| ONE WORLD TAB | **partly mine.** Four gates clicked the RUN tab with `if (t) t.click()`, which swallows a missing tab and then fails thirty seconds later nowhere near the cause. Three were mine (`dooranim`, `doorjamb`, `city_kit_binding`), one another lane's (`interior_wall`). All four now throw. | 108/0 (main: 103/3) |

**A derived artifact is not derived until you re-derive it.** Five separate files inline
the engine modules, and changing one engine file silently staled all five. That is the
same class as the stale `CITY_B64` this repo has eaten twice.

## ALREADY RED ON MAIN BEFORE THIS SESSION TOUCHED ANYTHING

Every one of these produced **the identical pass/fail count** at `8e193ba` and in my
tree. They are not mine, and under ONE SYSTEM / ONE SESSION they are not mine to fix.

| gate | main | mine | what it says |
|---|---|---|---|
| RIG CHECK | 141/2 | 141/2 | `bohemia_music_verdicts_8_2.py` and `_8_2b.py` carry no RIG CHECK block (MUSIC lane) |
| PARTS PAINTED | 21/1 | 21/1 | a part is empty on facings NE/2, NW/2 (CHARACTER lane) |
| BODY VARIATION | 40/1 | 40/1 | a dial extreme loses a part set (CHARACTER lane) |
| LIFE | 21/3 | 21/3 | 0 agents simmed across 3 world plots, 0 of 19 homes lived-in (LIFE lane) |
| DRESS | 42/1 | 42/1 | 0 distinct tops on the block — downstream of LIFE's 0 agents |
| POPULATION | 5/3 | 5/3 | census/bodies disagree, offline plane not cheap (LIFE lane) |
| MEMORY | 7/2 | 7/2 | 0 sightings held — downstream of LIFE's 0 agents |
| DEVIATION | crash | crash | `TypeError: Cannot set properties of undefined (setting 'dev')` (LIFE lane) |
| WALL CLASS | 22/2 | 22/2 | the RUN slice carries 0 tiles of the border-wall pool |
| INTERIORS | 39/1 | 39/1 | no painted surfaces, solid colours only as load fallbacks (5) |

**LIFE, DRESS, POPULATION and MEMORY are one bug, not four.** All four trace to
`0 agents simmed`; DRESS and MEMORY only fail because there is nobody to dress or to
witness anything. Whoever takes the LIFE lane next should fix the agent spawn first and
watch three gates go green behind it.

## FLAKY, NOT BROKEN

**THE CROWD.** `redrawing the same crowd gives byte-identical pixels (no dice in the
render path)`. Run three times on untouched main: **16/0, 16/0, 15/1.** It is
non-deterministic *about* determinism, which makes it useless as evidence in either
direction and makes any suite run containing it a coin flip. That belongs to the
CHARACTER lane and it needs either the real dice found or the assertion retired.

## THE METHOD, FOR THE NEXT SESSION THAT FINDS A RED SUITE

Do not guess and do not assume it is yours. It costs one command:

```
git worktree add -f /tmp/base<sha> <sha-you-branched-from>
cd /tmp/base<sha> && node gates/<the_red_one>.js
```

Same counts on both sides means it was already broken and you can say so with a number
instead of a feeling. Different counts means it is yours. `git worktree remove` when done.
