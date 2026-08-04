# A GATE THAT TESTS A LOCATION IS NOT A GATE
**8/4/26. WORLD lane. Machine: `gates/bohemia_city_app.js` — one resolver, nine gates.**

## WHAT HAPPENED

The big-icons pass shipped (`0f96839`). One minute later `hero_wire_gate.js` came back
**0 passed, 1 failed — "FAIL: CITY_B64 present"**, and the new icons were not reaching the
city view at all. Then the full suite came back with **nine gates red across four lanes**,
all saying some version of *"the alpha carries a readable CITY blob — FAIL."*

Nothing was broken. Commit `3ef222f` (the payload-wall pass, another lane) had moved the
CITY app **out of** `slices/BOHEMIA_ALPHA_0_9.html` into a standalone
`slices/BOHEMIA_CITY_WORLD.html`, loaded by `fr.src`, and stopped base64-encoding it on the
way. That move was **right**: the alpha went 38.7 MB → 2.92 MB and first load went 29× faster.

## THE ACTUAL BUG

Twenty-one gates and tools had each written out, by hand, the same two facts:

| the fact | what they hard-coded |
|---|---|
| **WHERE** the city lives | `slices/BOHEMIA_ALPHA_0_9.html` |
| **WHAT SHAPE** it is in | `const CITY_B64='<base64 of an entire page>'` |

Neither fact is any of theirs to know. Every one of them went stale in the same instant.

This is the **fifth sighting of one pattern this session**: the hand-passed door plane, the
hand-passed window fraction, the hand-passed prism cap, the hand-passed plot rectangle, and
now the hand-passed file path. **A VALUE PASSED BY HAND WHERE A VALUE COULD BE DERIVED.**

**A false red was not the worst of it.** `tools/bohemia_city_module_resync.py` did not fail
when it could not find the blob — it silently did **nothing**, so the engine and the app
would have drifted apart without a word. And `traffic_signal_gate` spent the outage
reporting that Paolo's 348-sprite signal bank was **missing from the shipped game** when it
had been there the whole time. A gate that lies in that direction is worse than no gate.

## THE FIX: ONE RESOLVER

`gates/bohemia_city_app.js` — `read()` returns `{src, file, inline}` or `null`. It looks for
the city by **its body** (`function renderCity(`), not by its path, and it accepts either
shape (base64 literal or inline page). Adding a new home is one line in `FILES`; adding a
new shape is one clause in `read()`. Nothing else in the repo changes again.

A second assumption of the same kind sat next to it: three browser gates found the city
frame with `/srcdoc/.test(fr.url())`. That frame is a sibling `src` now. Fixed to accept
both.

## THE SECOND SURFACE OF THE SAME BUG

A dozen browser gates found the world frame with `/srcdoc/.test(fr.url())` — a fact about
**how it was loaded**, not about **what it is**. It is a sibling `src` frame now, so every
one of them reported *"the world frame booted — FAIL"* about a frame that boots fine. The
resolver carries `isFrame(fr, page)` and there is now exactly one definition of which frame
is the city.

## WHAT IS GREEN THAT WAS RED

| gate | before | after | what its red was actually claiming |
|---|---|---|---|
| `hero_wire_gate` | 0 / 1 | **61 / 0** | the district icons are not wired into the city |
| `mapsize_gate` | 10 / 3 | **13 / 0** | the walked world is not in the game |
| `street_source_gate` | 3 / 1 | **18 / 0** | his harmonized street pixels are missing |
| `icon_gate` | 24 / 1 | **25 / 0** | the CITY builder has no icons |
| `footstep_gate` | 10 / 1 | **14 / 0** | his judged footsteps do not reach the surface |
| `city_tab_gate` | 14 / 2 | **64 / 0** | the CITY tab does not boot the iso view |
| `city_kit_binding_gate` | red | **12 / 0** | the city is not bound to the district kit |
| `full_res_gate` | 4 / 2 | **13 / 0** | the world frame never booted |
| `traffic_signal_gate` | 1 / 6 | **11 / 0** | **his 348-sprite signal bank is not in the game** |
| `run_spawn_gate` | 3 / 5 | **13 / 0** | the run has no working district |
| `shadow_gate` | crashed | **7 / 0** | no frame at all |
| `dooranim_gate` | 6 / 4 | **10 / 0** | **his 90 door-swing frames are not in the game** |
| `doorjamb_gate` | 7 / 8 | **15 / 0** | his 7px jamb strip is not applied |
| `wallclass_gate` | 19 / 3 | 22 / 2 | **his tan wall tiles are not in the game** |
| `interiors_gate` | 12 / 28 | 40 / 1 | 28 interior assertions unreachable |
| `full_pixel_gate` | 12 / 1 | **15 / 0** | the pixels are decimated |
| `navcluster_gate` | 11 / 1 | **12 / 0** | the CITY tab lost its nav ring |
| `zoombuild_gate` | 23 / 1 | **24 / 0** | the alpha has no iso city app |
| `zoomseam_gate` · `stepinside_gate` · `doorway_gate` · `everydoor_gate` · `ewdoor_gate` · `interior_wall_gate` | frame reds | **all green** | the world frame never booted |

**Five of those reds were telling us Paolo's own art had never shipped** — the signals, the
door-swing frames, the jamb strip, the tan walls. All four were sitting in the sibling page
the whole time. That is the cost of a gate that tests a location: it does not just fail
uselessly, it **accuses the work of not existing**.

Also repaired, same cause: `tools/bohemia_city_hero_wire_patch.py` (28 heroes rewired into
the city), `tools/bohemia_city_module_resync.py` (41 embedded modules, 41 fresh),
`tools/bohemia_city_zoombuild_patch.py`, and `tools/bohemia_run_spawn.py` — the last one is
the command `run_spawn_gate` itself tells a session to run, and it would have died on
`FAIL: CITY_B64 not found`.

**STILL HARD-CODED, REPORTED NOT FIXED:** roughly fifty one-shot `tools/bohemia_city_*_patch.py`
files, each already applied and none of them run by the suite. They break the moment anyone
re-runs one. `gates/bohemia_city_app.py` is there for whoever next touches one.

## THE BOUNDARY, STATED PLAINLY

**ONE SYSTEM, ONE SESSION.** Five of those nine gates belong to other lanes. Every red was
first **proven inherited** — a detached worktree at `3ef222f`, before any of this session's
work, returned byte-identical failures. What was then changed in another lane's gate is
**only how it locates a file**; not one assertion about traffic signals, footsteps, pixel
resolution or the city tab was weakened, and every one of them asserts strictly more now
than it did while it was failing to find its subject.

**STILL RED AND NOT MINE**, each proven identical on a detached checkout of the base:

- `bohemia_graveyard_gate` — 1 live reference: a line of the CHARACTER lane's own handoff
  prose that name-drops a dead token while explaining its tokenizer.
- `wallclass_gate` — 2: `slices/BOHEMIA_RUN_CURRENT.html` carries 0 border-wall tiles.
  A different surface, nothing to do with where the city lives.
- `interiors_gate` — 1: five interior surfaces are still solid colours rather than paint.

The base-tree proof for the last two was run with **the locator fix applied and nothing
else**, so the residual is measured against the base *content* — otherwise a gate that
cannot find its subject proves nothing either way.

## AND WHAT THE JUDGE CARDS CAUGHT WHILE THIS WAS GOING ON

City hall's dossier still described *"a great entry canopy carried on a single column"* that
had been deleted the day before. **Every pixel answered for** means the write-up too. Stale
NOTES on all four civics rewritten — summary, layout, circulation, LAYERING, decisions, and
the `act1` lines that named the canopy — and the tilespec regenerated.

The `reference:` lines **keep** the real canopy on purpose. A reference is a record of the
building that actually exists in Las Vegas; the LAYOUT note is what describes what got drawn.
Conflating those is how a dossier starts lying in the other direction.

## THE DENSITY THE CANOPY WAS SECRETLY CARRYING

`district_fill_gate` caught city hall at **53.9% content vs its 59.8% pin**. Removing the
canopy took content out and left bare pavers behind — the courthouse's own note names this
failure exactly: *"an empty plaza is a void with a nice name."*

**Not fixed by renaming pavement.** Fixed by dressing it with what a civic forecourt has:
limestone **planters** with the dead trees still standing in them, a **seating step** where
the podium meets the plaza, a **bike rack** row by the doors, **service aisles** between the
solar rows and an **inverter cabinet** at each row head (a real array is not panels in a
field — the string DC has to become AC somewhere). **53.9% → 57.5%**, and the plaza reads
used instead of empty.

## AND A RATCHET ANSWERED THE RIGHT WAY

`d1_kerb_gate` counts every cell that goes from **walk** to **structure** — its proxy for
SIDEWALK SANCTITY — and holds each district under a named ceiling that may only shrink.
City hall read 14,004 against a 13,266 ceiling and the courthouse 14,697 against 14,382.

Part of that was inherited (the canopy→steps swap the day before already put both over) and
part was mine (the new bike racks). **Neither was answered by raising the ceiling.** A
ratchet you raise is a law you deleted.

The cause in both was the same and it was also just wrong architecturally: the **entrance
piers were standing up on the flight of steps**, and city hall's bike racks were up on the
podium. A civic colonnade stands at the **foot** of its steps, on the plaza, and bike
parking is plaza furniture. Moved both down onto the plaza:

```
D1 KERB GATE: 46 passed, 0 failed   (was 44/2)
    cityhall   14,004 -> under 13,266     courthouse  14,697 -> under 14,382
```

Both are now **below** the ceilings they were breaking, and the plots read more like real
civic entrances than they did before the gate complained.

**AND THE MOVE COST TWO THINGS THE DISTRICT GATES CAUGHT, BOTH ORDER BUGS.** The array's
new service aisles were drawn **after** the panels and wiped out every mast — `solarTrees`
still said 33 while the plot showed zero. The relocated piers landed on the courthouse flag
row and on city hall's bike racks. Nothing subtle: **one pass painting over another**, which
is the whole reason draw order is part of the design and not an implementation detail. Aisles
now go down first and the panels stand between them; the piers sit in a band nothing else
occupies. `CITY HALL GATE 19/0`, `COURTHOUSE GATE 17/0`, both were 17/2 and 16/1.

---

*Filed under the TRUTH HIERARCHY: on any conflict the newest date wins.*
