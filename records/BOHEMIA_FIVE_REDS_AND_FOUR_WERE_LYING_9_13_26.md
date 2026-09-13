# FIVE REDS, AND THE GAME WAS RIGHT EVERY TIME (RUN, 9/13/26)

VAMILY `[reds mine]` / FIVE-OF-THIS-LANE'S-GATES-ARE-RED-ON-MAIN.

> COMBAT re-ran them alone on a clean main: **COMBAT RUNS, DEMO CURRENT, CURRENT
> SLICE, ENEMIES EXIST and STRANGER OPENS are red on main, and none of them is
> COMBAT's.** They are this lane's gates on this lane's shipped rows. For each,
> decide honestly which it is — a broken game or a lying gate — and fix that one.

**Verdict: one was already green, and all four of the rest were lying checkers.
Not one was a broken game.** Two root causes between them, and both were somebody
else's correct work that my gates had hardcoded around.

## CURRENT SLICE — already green

Re-run alone: green. Nothing to do.

## CAUSE ONE: THE PAD STOPPED BEING BUTTONS

On 9/7 another lane rebuilt the walk pad from html buttons into an **SVG ring of
eight `<g>` wedges**. Two of my gates were written against the old shape.

**ENEMIES EXIST** — *"AND WALKING AT THEM PUTS BODIES ON THE STREET — 0 drawn"*.
It found the wedge to press by matching **textContent** against an arrow glyph.
The arrows are *drawn* now, so textContent is empty, the `find()` never hit, and
it fell through to `[0]` — a direction away from the crew. Sixty taps later it had
reached nobody and reported zero bodies, which reads as *the enemies were never
built*. **They were. The harness was walking the wrong way.** It reads
`dataset.walk` now — the wedge declaring its own direction. **26/1 → 27/0.**

**STRANGER OPENS** carried the same glyph lookup, fixed the same way.

## CAUSE TWO: A FLOOR HIS NEWEST WORD REMOVED

**DEMO CURRENT** and **STRANGER OPENS** both asserted the walk arrows measure
**44px or more**, as proof the served build gets the demo's thumb injection and a
`file://` load does not. Two separate things killed that proxy:

1. **CSS `width`/`height` do not apply to an SVG group.** The cut's
   `.pb{width:44px !important}` has been **inert since 9/7**, so served and disk
   now read the *same* number — it cannot tell them apart even in principle.
2. **PAOLO 9/6, LOCKED:** *"for the run right now make all the UI 50% smaller, I
   don't give a fuck."* **Newest date wins.** The pad is one of the controls the
   halving shrank, `thumb_gate` already carries that exemption — narrow, named,
   and printed every run — and **20px is his number, not a defect.**

### *** AND I ALMOST "FIXED" THE GAME TO SATISFY THEM ***

I read 39px, called it a real regression on the most-used control in the game, and
**grew the whole pad ring on the demo from 180 to 204** to put the arrows back over
44. Then I measured it: `nav` came back **90x90**, wedges at **20** — the halving,
doing exactly what he asked for. **My change was fighting a locked ruling**, and
the only reason I know is that I measured after building instead of before
reporting. It was taken straight back out.

**What replaced the dead proxy** is the question his ruling has *not* answered and
that a player actually needs: the pad is **all eight wedges and every one of them
is the topmost thing at its own centre**, so nothing is sitting on top of the
control you walk with. That is the bug this lane really did ship once.
**Mutation:** lay a transparent overlay across `#nav` → *8 wedges, 0 answering at
their own centre*. **15/1 → 16/0**, and **17/1 → 18/0.**

## CAUSE THREE: OFF DISK, AGAIN

**COMBAT RUNS** opened the alpha over `file://` and drowned in console errors:

    Fetch API cannot load .../BOHEMIA_CITY_TILES_03.js.
    URL scheme "file" is not supported.

The city **streams its tile banks with `fetch()`**, and fetch refuses the `file://`
scheme outright. The page was never broken; the harness was standing in the one
place a browser will not let it work. **This lane measured and wrote that law down
on 9/5**, after the demo's entire safety layer turned out to silently no-op off
disk. Served now, from the repo root, the same fix as the ending gate. **0/many →
1/0.**

## THE PATTERN, SAID PLAINLY

Every one of these four was a gate that **hardcoded the shape of a thing instead of
asking it what it is** — the pad's glyph, the pad's pixel size, the page's origin.
When another lane improved the thing, the gate went red and blamed the game. That
is six such gates this lane has fixed in three rounds, and **three of the six were
its own**.

## RESULT

    COMBAT RUNS 1/0 · DEMO CURRENT 16/0 · CURRENT SLICE green
    ENEMIES EXIST 27/0 · STRANGER OPENS 18/0
    no game code changed: the game was right five times out of five
