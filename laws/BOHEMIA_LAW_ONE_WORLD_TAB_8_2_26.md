# BOHEMIA LAW — THERE IS ONE WORLD TAB, AND IT IS RUN
## Paolo, 8/2/26, LOCKED.

> "New rule: the city tab will now live in the run tab. There's no point in
>  having a city tab anymore. Make sure everything in the city tab is migrated
>  on the run."

---

## THE LAW
**There is ONE tab that shows the world, and it is RUN.** No CITY tab, now or
ever again. Anything the city view offers — the isometric valley, the builder
verbs, DROP IN, the district art, the people — is reached from RUN.

---

## WHAT THE MEASUREMENT FOUND, and it says he is more right than he knew

**The two tabs already opened the same panel.** The alpha's tab handler has read:

    var PANEL = (t.dataset.p==='run') ? 'city' : t.dataset.p;

since **7/28**, when he first asked *"Can you put the city in the run tab?"*.
So for five days the tab bar carried **two buttons that did exactly the same
thing**. Nothing had to be "migrated" today, because everything the CITY tab
showed was already what the RUN tab showed. The fix was to delete the duplicate
button, and that is all this change is: no world moved, no iframe reloaded, no
second instance created.

## THE BIGGER FINDING, WHICH EVERY FUTURE SESSION NEEDS

**`#p-run` is `display:none` for the entire life of the app.**
**The RUN tab has never once shown `slices/BOHEMIA_RUN_CURRENT.html`.**

The run slice's iframe is in the document — the alpha posts to it, it holds
state, gates drive it directly by file — but **the player has never looked at
it.** When Paolo taps RUN, what he sees is the **CITY FRAME's walk mode**.

> **THE SURFACE HE PLAYS IS THE CITY FRAME. NOT THE RUN SLICE.**

This is not a small bookkeeping note. This lane's single most repeated failure
is *fixing the surface he cannot see*, and it happened again on 8/1: the
NO DISTRICT IS A PRISON fix went into the run slice's `findHomeCell`, was proved
by walking the run slice in a browser, and **cannot have reached him**, because
he never sees that file. The wall fix, which went into the city frame, did.

**Before changing anything world-facing, ask which frame draws it.**
- `cityFrame` — what he sees. Built from `CITY_B64` inside the alpha.
- `BOHEMIA_RUN_CURRENT.html` — real, tested, and invisible to the player today.

## WHAT IS NOT DECIDED HERE
Whether the run slice should be **shown**, **merged into the city frame**, or
**retired** is a real fork with real cost either way, and it is not something to
decide inside a tab-deletion. It is [PENDING Paolo] and it is written at the top
of the handoff. What is decided is only what he ruled: **one world tab, and it
is RUN.**

## THE GATE
Four gates reached the world by clicking `.tab[data-p="city"]` — `wallclass`,
`wallheight`, `frontdoor`, `touch_guard`. All four now click RUN, in the same
commit. **A gate that navigates by a button the user no longer has is a gate
testing a surface nobody can reach.**

`gates/one_world_tab_gate.js` holds the law itself: the CITY tab is absent from
the bar, the RUN tab exists, tapping it reaches the world frame, and the routing
line that makes that work is still there.

## THE LIFE LESSON UNDERNEATH (never preached in game)
Two doors into one room is not twice the access. It is one room and a lie about
how big the building is.
