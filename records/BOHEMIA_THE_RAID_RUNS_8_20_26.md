# THE RAID RUNS (8/20/26, PEOPLE lane, backlog 0sc)

## WHERE TO SEE IT: the **RUN** tab, on a fresh device. The opening now plays
## the cold open, hands you into the **COMBAT** tab for the raid, and comes back
## for the grief dinner and the burial on the ridge.

---

## WHAT WAS WRONG, FOR TWELVE DAYS

```
$ grep -n "startColdOpen(" slices/BOHEMIA_ALPHA_0_9.html
7993:function startColdOpen(onEnd){ return startEncounter(coldOpenSpec(onEnd)); }
```

One occurrence. Its own definition. Zero callers, since 8/8.

The family-defense encounter is the combat tutorial, the raid, and the scene the
sibling is killed in. It had never been played from anywhere, so the game went:

> warm dinner -> the cut -> "get to the back door" -> **you wake up on day 1 and
> get a job**

The death the entire opening is built on did not happen. Which made the grief
dinner mourn nothing and the burial bury nobody.

Every gate was green for twelve days.

## WHY THIS LANE TOOK IT AFTER FLAGGING IT TWICE

I filed this yesterday and left it, because backlog P0-DOOR row 10 nominally
claims the surface switch for RUN. Checked again today before deciding:

- **P0-DOOR row 10's line reference is stale.** It points at ALPHA:21436-21438,
  "calls the fight WITHOUT switching tabs". That region is wardrobe code now, and
  there is no such call anywhere: the premise of the row (a call that fails to
  switch) does not exist, because there is no call.
- **Nothing needed inventing.** `cityEncounterIn()` has done this exact dance for
  weeks: show the combat panel, make sure the frame exists, wait for it, start
  the encounter. Its own comment says why a second one would be wrong: *"A second
  handoff path is the duplicate-system mistake this repo keeps paying for."*
- **Every piece was already published.** COMBAT exposed `startColdOpen(onEnd)`
  for a scene to name. My scene names it. `scene_gate` has asserted those two
  names match since 8/11. `showTabPanel(p)` is the alpha's own switcher.
  `enc.onEnd(enc.outcome)` already fires when a fight settles.

So this composes published behaviour inside this lane's own file. It touches no
combat code, no encounter spec, no dials, and does not fill `COLD_OPEN.cast`.

Leaving the premise of the game unplayable for a thirteenth day because two
backlog rows disagree about who owns a tab click would have been finding a legal
way not to ship.

## WHAT IT DOES

    cold open plays
      -> handoff to:'combat', call:'startColdOpen'
      -> overlay stands down, showTabPanel('combat'), frame ensured, seam called
      -> THE RAID. the sibling is taken.
      -> encounter settles, onEnd fires
      -> showTabPanel('run'), openContinue()
      -> the grief dinner
      -> the burial on the ridge
      -> control returns

**IT FAILS SAFE.** No seam, no switcher, or a throw anywhere in it, and
`openHandoff` returns false and the opening ends exactly the way it did
yesterday. The demo cannot be worse off than before this existed.

## *** THE BUG I SHIPPED AND CAUGHT BY DRIVING IT ***

The first cut fired the raid correctly. Verified on the real page:

    scene:act1_cold_open
    showTabPanel:combat
    startColdOpen called

And the resume was broken. `openContinue` read the cold open's handoff, saw
`to:'combat'`, found nothing to chain to, and ended the opening. **The grief
dinner would never have played after the fight.**

`returns:true` said control comes back and named nothing to come back TO.

It would have shipped green, and this is the interesting part: **until this turn
the raid had never run at all, so the resume path had never once been reached.**
A code path downstream of something that never executes cannot be caught by any
gate that does not execute it either. The only reason it surfaced is that
driving the real surface finally got that far.

Fixed with data, not a special case: a handoff says `then:` -- what plays when it
comes back. His law puts THE GRIEF DINNER there, in those words. Verified:
`openContinue('act1_cold_open')` now plays `act1_grief_dinner`, which chains to
the burial.

## THE MACHINE

| file | what |
|---|---|
| `tools/bohemia_opening_patch.py` | `openHandoff`, `openRaid`, `openHideOverlay`, `openContinue` reads `then` |
| `records/BOHEMIA_SCENE_ACT1_COLD_OPEN.json` | the handoff names `then` |
| `gates/scene_gate.js` | 77 -> 86 |

Mutation-tested:
- a `returns:true` handoff naming nowhere to return to -> **3 red**
- hardcoding the seam name instead of reading the scene's -> **1 red**

## WHAT IS STILL MISSING, AND WHOSE

1. **`COLD_OPEN.cast` is `[]` and `COLD_OPEN.place` is `null`** — marked
   [PENDING Paolo] since 8/8, but his 7/19 law rules both: "defending the home
   room to room... it ends saving the mother." **Nobody is behind you in the
   defence.** The raid now runs, so this is finally visible instead of academic.
   **COMBAT's.**
2. **The ridge exterior.** The money shot, the title screen and the last frame of
   the tutorial are one image and it does not exist. The burial plays its words
   over an honest empty frame that says so. **ART's.**
3. **Bind the burial to the real vista overlook** so the grave and the money shot
   are one place. The vista's caller is the day loop. **RUN's.**
