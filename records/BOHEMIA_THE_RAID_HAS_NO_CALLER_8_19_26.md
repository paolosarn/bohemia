# THE RAID HAS NO CALLER (8/19/26, PEOPLE lane)

## WHERE TO SEE IT: the **CUTSCENE** tab plays all three beats. The **RUN** tab
## plays only the first one, and stops before the raid, on purpose.

---

## THE FINDING, MEASURED

```
$ grep -n "startColdOpen(" slices/BOHEMIA_ALPHA_0_9.html
7983:function startColdOpen(onEnd){ return startEncounter(coldOpenSpec(onEnd)); }
```

**One occurrence. Its own definition. Zero callers.**

The family-defense encounter is the combat tutorial, the raid, and the scene in
which the sibling is killed. It has never been played from anywhere.

Which means, in the game as it currently boots:

- the warm dinner plays
- the cut plays
- the father says get to the back door
- **and then you wake up on day 1 and get a job**

The sibling's death does not happen. The premise of the entire demo is absent
from the demo.

## IT EXPLAINS THREE THINGS AT ONCE

1. **`COLD_OPEN.cast` being `[]` never mattered.** Nobody is behind you in the
   defence, but the defence never runs, so nothing surfaced it.
2. **The grief dinner grieves a death that did not occur.**
3. **The burial I shipped an hour ago buries somebody the player never saw die.**

This is the eighth time this lane has found this exact shape: built, gated,
published seam, zero callers. The vista was this. The payday bridge was this. The
barks were this. Every piece is real and nothing is joined.

## AND THE OPENING RUNNER ONLY KNEW ONE SCENE

Separately, and mine: his 7/19 law says the three beats "fuse into one unbroken
sequence." The runner played scene 1 and called `openDone`, so beats 2 and 3 had
never happened in the played game at all. They existed as chips in a dev tab.

**Fixed.** The runner now reads what a scene says comes next, out of the scene's
own handoff beat:

    act1_cold_open     ->  combat:startColdOpen
    act1_grief_dinner  ->  scene:act1_ridge_burial
    act1_ridge_burial  ->  END

Verified on the real page: started at the grief dinner, the burial followed on
its own, no page errors.

## *** THE PART I DELIBERATELY DID NOT DO ***

**A handoff this runner cannot honour STOPS the sequence. It never skips it.**

Auto-advancing past the combat handoff would have made the opening play
cold open -> grief dinner, seating the family down to mourn somebody the player
watched walk to the back door ninety seconds earlier and never saw again. That is
worse than stopping, and it would have looked like a feature.

So the sequence pauses at the raid, and `openContinue()` is the published seam
for whoever wires the fight to resume it -- the same courtesy COMBAT did this
lane by exposing `startColdOpen(onEnd)` for my scene to name by contract.

## WHY I DID NOT WIRE THE FIGHT MYSELF

Two reasons, both boundaries rather than difficulty:

1. **`startEncounter` posts to the combat frame without switching the visible
   surface.** So calling it from the opening would run the raid behind the
   cutscene canvas. That exact bug is already written down and already claimed:
   backlog **P0-DOOR row 10**, "calls the fight WITHOUT switching tabs... switch
   the surface with the handoff." That row is the RUN lane's.
2. **COMBAT shipped encounter work today** (`THREE MEN, NOT EIGHT`). One system,
   one session.

Using their published entry point is fair. Choreographing the tab switch, the
overlay teardown and the return, in a demo path another lane is mid-flight on, is
not.

## A SECOND SMALL LIE, FIXED

The opening caption was hardcoded to two values,
`pre_collapse ? 'BEFORE' : 'TEN YEARS LATER'` -- the same bug the CUTSCENE tab
had. The morning after the raid was captioned "ten years later" on both
surfaces. A scene says `when` it is now, and both surfaces read it.

Also fixed while extracting `openPlay`: `openScene` applied his DIRECT edits to
the opener only. The day the runner played a second scene, a version that only
respected DIRECT for the first one would have quietly shipped canon over the top
of his rewrites. Every scene the sequence plays now goes through `openDirected`.

## THE MACHINE

| file | what |
|---|---|
| `tools/bohemia_opening_patch.py` | `openNext`, `openPlay`, `openContinue`, `openDirected`, `openSceneById` |
| `gates/scene_gate.js` | 69 -> 77 |

Mutation-tested:
- make the sequence skip a combat handoff -> **red**
- revert to playing one scene -> **red**

## WHAT COMES AFTER, IN ORDER OF WHAT IT COSTS THE DEMO

1. **WIRE THE RAID.** Without it there is no death, and without the death the
   grief dinner, the burial, the vista and the whole dynasty premise are
   decoration. It is one call to a function that already exists, plus the surface
   switch that backlog P0-DOOR row 10 already scopes. **RUN + COMBAT.**
2. **`COLD_OPEN.cast` and `COLD_OPEN.place`** are `[]` and `null`, marked
   [PENDING Paolo] since 8/8 -- but his 7/19 law rules both ("defending the home
   room to room... it ends saving the mother"). That marker is stale the way the
   demo-scope banner was until 8/14. **COMBAT.**
3. **The ridge exterior.** Money shot, title screen and last frame of the
   tutorial are one image and it does not exist. **ART.**
