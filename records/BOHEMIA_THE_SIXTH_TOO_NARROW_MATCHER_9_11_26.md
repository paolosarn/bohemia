# THE SIXTH TOO-NARROW MATCHER (9/11/26, SOUNDS lane)
## found while running the lane's gates for [music owned] round 2

### THE WHOLE CITY INTERFACE WENT SILENT AND MY OWN CENSUS GATE CAUGHT IT

Running this lane's gates before shipping THE STREET BREATHES found SOUND
REACHABLE at **21 passed, 2 FAILED**:

    Not reached and with no written reason: ['ui_tap']
    12 heard on the walked surface, 53 with their own written reason

Checked against plain `origin/main` in a clean worktree **before** blaming my own
diff: it failed there identically. Pre-existing, not mine — but it is this lane's
gate and it **contradicts a shipped claim of mine**. THE-OTHER-51 was closed on
"0 unexplained", and there was one.

### MEASURED, BY ASKING THE RUNNING CITY WHERE ITS OWN BUTTON LIVES

    #phonebtn  chain: DIV#barright -> DIV#menubar -> DIV.wrap -> BODY
    closest('#topbar>div')    false
    closest('#devtray>div')   false
    closest('button')         false
    ...every selector the classifier tries:  false

**The phone button moved from `#topbar` into `#menubar > #barright`** — another
lane's perfectly ordinary UI change — and the city's tap policy names its
containers by id. So it matched nothing, and `ui_tap`, `ui_back` and `ui_deny`
**all** went silent across the entire walked city.

### AND THIS IS THE SIXTH OF THE SAME BUG, IN A FUNCTION WHOSE OWN COMMENTS WARN ABOUT THE FOURTH AND FIFTH

They are still sitting there to read:

> "The first version of this matched only `button` and missed #phonebtn entirely
> — measured silent on the walk, **which is the fourth time this week a too-narrow
> matcher has told me something was missing** when it was my selector that was."

> "**A FIFTH TOO-NARROW MATCHER, IN THE FUNCTION WHOSE OWN COMMENT ABOVE WARNS
> ABOUT THE FOURTH.**"

Six of the same bug is not six mistakes. **It is one wrong shape, defended five
times.** An allowlist of containers has to be right about every place a control
will ever live, and it is wrong the moment anybody moves a bar. Adding
`#menubar>div` would have been the seventh, already waiting.

### SO THE ALLOWLIST BECAME A DENYLIST, WHICH IS WHAT THE FUNCTION ALWAYS SAID

Its own comment: *"a refusal is ui_deny, a way out is ui_back, **everything else
is ui_tap**"*. That sentence describes a denylist and the code was an allowlist.

A tap sounds unless the thing tapped already makes its own noise. That list is
short, it is about **sound** rather than about layout, and it cannot go stale when
somebody renames a div:

| excluded | because |
|---|---|
| the movement pad | already makes a footstep |
| **the world canvas** | walking already makes a footstep; a tick on every step is the 8/4 two-sounds complaint at its worst |
| sleep, the day-card GO | already carry `sleep_sink` and `come_up` |
| `[data-noui]` | the escape hatch for anything built later |

The allowlist did not disappear — it stopped being the gate. It still decides
*whose label to read* for the back/refusal test, because a badge SPAN inside PHONE
has to resolve up to the control it sits in. Failing to match now means "read the
label off what was clicked", not silence.

### TWO RULES I TRIED AND MEASURED AND THREW AWAY

So nobody spends the time again:

* **`cursor:pointer`** — the obvious "the author said this is clickable" signal.
  Measured: **three** elements in the entire city document have it, and
  `#phonebtn`, `#sleepbtn`, `#rungbtn` and `#pad` all report `auto`.
* **`role` / `tabindex`** — null on every one of them.

**A plausible rule the DOM does not actually carry is worse than a narrow one**,
because it looks general and is empty.

### AND A SECOND BUG FELL OUT: EVERY CLOSE BUTTON IN THE GAME ANSWERED WITH A TAP

`#phoneclose` renders exactly one character and it is **U+2715, the ballot X**.
The label test listed **U+00D7, the multiplication sign**. They look identical on
screen and are different characters, so the close control never matched and
answered `ui_tap` instead of `ui_back` — from the day the policy shipped, in the
city **and** in the shell, which carries the identical list.

> **A GLYPH THAT LOOKS LIKE THE ONE YOU TYPED IS NOT THE ONE YOU TYPED.**

Both lists now carry U+2715, U+2716 and U+2A2F alongside U+00D7.

### AND FIXING IT MADE A WRITTEN REASON GO STALE, WHICH A GATE CAUGHT THE SAME RUN

`ui_back` sat in the census gate's `CANNOT_DRIVE` with a reason that was true when
it was written: *"a BACK button on a panel this drive does not open"*. The drive
**does** open one — it clicks `#phoneclose` — it just never sounded. The moment
the glyph was fixed, `ui_back` became heard and the census went red on

    nothing is counted twice -- an event that was HEARD must not also be
    carrying an excuse (['ui_back'])

which is **exactly the job that claim was added for** last round. A WRITTEN REASON
GOES STALE THE MOMENT SOMEBODY FIXES THE WIRE. The excuse is gone, and the comment
in its place says why.

### THREE INSTRUMENT MISTAKES GETTING HERE, ALL MINE

1. **I reported "walking ticks twelve times".** Twelve taps at the centre of the
   frame, twelve `ui_tap`s, and I nearly called the fix an over-trigger.
   `elementFromPoint` showed every one of them landing on **`#daycard`** — the
   morning card, covering the whole screen. **A tap on a card should tick.** The
   probe never reached the world. Dismiss the card and the same taps hit
   `CANVAS#cv` and produce **zero** ui sounds.
2. **I wrote these claims into the sound census first and broke it.** The census
   is a carefully sequenced drive; dismissing the card and tapping the world moved
   the clock, so the hour chime went red and `time_pass` read as unreachable. **A
   CHECK THAT DISTURBS A SEQUENCED DRIVE REPORTS A BUG THAT IS NOT THERE** — the
   third time that shape bit this lane in one round. The claims live in their own
   gate now.
3. The first mutation test was too weak to mean anything: it left the
   `[id$="btn"]` matcher in, so the control still sounded. Re-run against
   **exactly** the pre-9/11 code.

### THE GATE

`gates/city_ui_voice_gate.py`, registered, **12 claims**. The census could only
ever say "ui_tap was heard somewhere", which is also true of a build where every
control answers with the same tick, or where walking ticks on every step. This
counts **per control**:

    the world    ->  nothing
    a control    ->  ui_tap, exactly once
    a way out    ->  ui_back, and never a tap
    sleep        ->  sleep_sink, and no tick

MUTATION PROVED, two ways:

| mutation | result |
|---|---|
| exactly the pre-9/11 code (id-named allowlist, nothing else) | 3 failed — the control silent, the way out silent |
| the glyph hole back | 2 failed — the way out answers `ui_tap` |

REUSE CHECK: cooks nothing. Three sounds he already approved — `ui_tap` 3 of 5,
`ui_back` 3 of 5, `ui_deny` 3 of 5 — get their callers back.

    python3 gates/bohemia_gates.py --only "CITY UI VOICE"

Build 9/11g - THE STREET BREATHES.
