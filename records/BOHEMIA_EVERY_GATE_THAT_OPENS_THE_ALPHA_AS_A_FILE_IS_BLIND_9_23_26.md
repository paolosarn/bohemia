# EVERY GATE THAT OPENS THE ALPHA AS A FILE IS NOW BLIND (9/23/26, SOUNDS lane)
## The game is fine. The instruments are not. One swallowed exception, fleet-wide.

**FOR RUN, AND FOR EVERY LANE WITH A GATE THAT TAPS THE DOOR.** Found while verifying
`[seeded gate]`, on plain `origin/main` at `2d9dd91`, with nothing of this lane's in the tree.

---

## 1. WHAT IT LOOKS LIKE, AND WHY IT IS NOT THAT

Five claims in the fight-music gate went red at once:

    FAIL  the opening handed the music over to the streets on its own (after None ms)
    FAIL  the streets are playing before the fight (city=False, BLUES)
    FAIL  but the streets DO come back within a phrase (they never came back)
    FAIL  and the returned song is a street song, not the fight song (None)
    FAIL  the lift is HELD when the transport is mid-bar

Read at face value that says **the music is gone**. Measured on the page, `MUS.playing` was
`false` for 65 seconds straight and `MENUMUS.open()` was called **zero** times, while the game
itself reported it had opened (`__OPENED_ON_THE_GAME` 1).

**THE MUSIC IS FINE. THE SAME ALPHA, THE SAME BOX, TWO WAYS OF OPENING IT:**

    over file://   the loading screen sticks on WINDING THE CLOCK at 20.5 s and is still
                   stuck 219 s later. Line states: [true, false, false, false]. Never BEGIN.
    over http      [true,false,false,false] at 0.5 s -> [true,true,true,false] at 24.5 s
                   -> BEGIN at 25.5 s. The game opens. The music plays.

**His link is https and same-origin, so the game he taps is fine.** What is broken is every
instrument that opens the alpha as a local file.

---

## 2. THE CAUSE IS ONE SWALLOWED EXCEPTION, AND THE LESSON IS WRITTEN TWO SCREENS ABOVE IT

Three of the four loading lines ask their question **inside the city iframe**, through one
helper:

```js
function __cityHas(fn){
  try{ var f = document.getElementById('cityFrame');
       return !!(f && f.contentWindow && fn(f.contentWindow)); }catch(_e){ return false; }
}
```

Over `file://` that iframe's origin is `"null"`, so reading into it throws every single time:

    Blocked a frame with origin "null" from accessing a cross-origin frame.

The catch turns that into `false`, and `false` means **"not loaded yet"**. So the screen waits
for ever on a stage that can never report, and the door's `if(!window.__LOAD_READY) return;`
means the tap is not a door. Only line 1 ("is there a cityFrame element") can be answered from
outside, which is exactly the `[true,false,false,false]` that was measured.

> **A CAUGHT EXCEPTION IN A DRAW PATH IS A FEATURE THAT SILENTLY DOES NOTHING, AND THAT IS
> WORSE THAN A CRASH, BECAUSE A CRASH GETS FIXED.** That sentence is not mine. It is already in
> the alpha, two screens above this helper, written by whoever fixed the first cut of this same
> loading screen for this same reason.

**AND "I AM NOT ALLOWED TO LOOK" IS NOT "NOT DONE".** That is the whole defect in one line. The
helper collapses three different answers -- done, not done yet, and cannot be determined -- into
two, and the one it throws away is the one that matters.

---

## 3. WHAT THIS LANE DID, AND WHAT IT DID NOT

**DID: fixed its own gate, because a file:// URL is not the real surface.** `VERIFY ON THE REAL
SURFACE` is a standing law and the real surface is served, not opened. The fight-music gate now
starts a one-line local http server on an ephemeral port, points the browser at that, and shuts
it down after. It also now **waits for the game's own readiness flag before tapping the door**,
bounded and recorded, with a claim of its own:

    ok  the loading screen said it was ready before the door was tapped (after N ms)
        -- waited for, not timed out on

That claim exists so this failure can never again be reported as a music regression. Result:
**51 passed / 0 failed**, from 43-45 passed with 5 to 9 failing depending on the run.

**DID NOT: touch the loading screen or `__cityHas`.** That is RUN's, shipped this round, and the
general fix is theirs to pick:

    either  __cityHas reports "cannot determine" separately from "not done", and a stage that
            cannot be read does not block the screen (a cross-origin frame is a known,
            catchable, nameable condition, not a slow load)
    or      every gate in the fleet serves the alpha over http instead of opening it as a file,
            which is what this lane just did for one gate out of many

**The first is one change in one helper. The second is a change in every gate that boots the
alpha.** This lane is not choosing on RUN's behalf.

---

## 4. HOW TO REPRODUCE, BOTH WAYS, IN ONE SENTENCE EACH

    broken    open slices/BOHEMIA_ALPHA_0_9.html as a file:// URL and poll LOAD_LINES:
              [true,false,false,false] for ever, fronttap stuck on WINDING THE CLOCK
    fine      python3 -m http.server, open the same file over http, poll the same array:
              all four true, fronttap reads BEGIN, at 25.5 s

**Do not report this as a broken game.** It is a broken ruler, and this round has been about
nothing else.
