# HE WAS NEVER ON MY SURFACE — 8/2/26, PEOPLE lane

Paolo:

> "I couldn't find them can you make sure when I press the run tab it just
> starts me off where I should start off exactly where I should and not in city
> mode. I'd rather start off in human mode rather than city mode, please"

Two things here. One is what he asked for and is fixed. The other is why he
could not find anybody, and it is worse than the thing he noticed.

---

## 1. THE RUN TAB OPENED IN THE CITY BUILDER

Measured on the real surface before touching anything — tap the splash, tap RUN,
ask the frame what it is:

| | |
|---|---|
| visible panel | `p-city` |
| MODE | `"city"` — the HUD read **CITY MODE** |
| player | `hx=0, hy=0` — **never placed at all** |

He tapped RUN and got the zoomed-out overview, with the walked player sitting at
the origin of a 12288x12288 world.

### The fix, and the thing that undid the first attempt

Calling the app's own `swapMode()` at boot was not enough: the frame came up
human and flipped **straight back**. Logging every message the frame receives:

    ["BOHEMIA_CITY_PLAYER", "BOHEMIA_CITY_PLAYER", "BOHEMIA_GOTO_CELL"]

`BOHEMIA_GOTO_CELL`'s handler ended in an unconditional `MODE='city'`.

**That line was correct when it was written and wrong now.** It comes from Paolo
7/28 — *"I want that reflected when I'm in the city menu"* — back when RUN and
CITY were two separate tabs: you walked in the run, opened the city, and the
marker sat where you had walked to. The alpha fires `cityGoToRunCell()` on
city-tab open, and now that **the RUN tab IS the city frame**, it fired every
single time he tapped RUN and threw him out of his body to the overview.

His ruling was about the **marker**, never about the mode. So the camera still
moves and the mode is left alone.

Nothing here reimplements anything: `swapMode()` already derives the player from
`city.x/city.y` (which `WORKING_DISTRICT` already aims at the district we are
building) and already prefers to land you **on a road** rather than behind a
house in a walled subdivision (NO DISTRICT IS A PRISON, 8/1).

**Now:** `HUMAN MODE`, `SUBURB · ON FOOT`, standing at (6205, 6271). The city
view is still one tap away, and the zoom seam still reaches it.

Tool: `tools/bohemia_human_start.py`. Gate: `gates/human_start_gate.js`, 9
claims. Mutations: the original city boot fails 5 of 9; keeping the boot fix but
letting GOTO_CELL flip it back fails 3 of 9.

---

## 2. THE PART HE DID NOT ASK ABOUT, WHICH IS WHY HE FOUND NOBODY

**Everything this lane has built is on a surface the game never displays.**

The alpha routes the RUN tab to the CITY panel:

    PANEL = (t.dataset.p === 'run') ? 'city' : t.dataset.p

`#p-run` — `BOHEMIA_RUN_CURRENT.html` — is `display:none` the entire time. The
alpha's own source says so in a comment. And that file is where **all** of it
lives: the identity card, the one contextual button, asking a name, the name over
their head, and the neighbour I put outside his door yesterday.

Counted in the city frame, which is the surface he actually taps:

| | |
|---|---|
| references to the population module | 16 |
| `TALK TO` | **0** |
| identity card / ask a name | **0** |

So there are people walking around on his surface and **no way to speak to a
single one of them**.

### This is my own law catching me

VERIFY ON THE REAL SURFACE (7/18): *"art is verified ONLY on the surface Paolo
sees — a side-door probe is a lie."* Every gate this lane owns opens
`BOHEMIA_RUN_CURRENT.html` **directly, as a file**. All 152 of them are green
about a page the alpha never shows. The gates were not lying about the code; they
were answering a question about the wrong door.

That is exactly why the new gate drives the **alpha** and taps the **tab**.

### What it would take

Porting the identity layer onto the city frame: the one contextual verb, the
dialogue sheet, the card, the ask, the name over the head, and the porch
neighbour. The population module is already shared, so the people are the same
people — what is missing is the conversation surface.

**That is his call, not mine.** It is the CITY lane's file, it is a day of work,
and I am not moving it on my own initiative after he has told a session before to
stop building unasked.
