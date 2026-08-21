# THE WHOLE DEMO PLAYS, AND NOW SOMETHING PROVES IT
### 8/21/26, RUN lane. Measured on the alpha, by tapping. Nothing here is remembered.

## THE SHORT VERSION
The demo board's shortest-path list had three things left on it. **Two of them
were already done and the board did not know**, and the third — the one nobody
had noticed — was that **no test had ever played the demo through**.

There is one now: `gates/the_whole_demo_gate.js`, registered as **WHOLE DEMO**,
21 claims, 44 seconds, one unbroken session from the splash to the valley.

## THE BOARD WAS STALE ON TWO ROWS. RE-MEASURED, NOT REMEMBERED.

| board row (8/20) | what it said | what is true 8/21 |
|---|---|---|
| ROW 3 · SOUNDS P0-WALK | "WALKING IS STILL SILENT — the city has ZERO footstep code" | **DONE.** The city classifies the ground under his feet (`__surfaceOf`, six surfaces ported from `sfxGround`) and posts `BOHEMIA_STEP`; the alpha catches it at `:7779` and calls `stepSfx`. `footstep_gate` **14/0**. |
| ROW 1 · the FIGHT half | "no combat entry on the walked surface — the `startEncounter` hits in the city are comments" | **DONE.** Walking through a real door posts `BOHEMIA_CITY_ENCOUNTER` with a roster and the real room dimensions; the shell assembles a fight and puts him back on the block afterwards. `combat_entry_gate` **14/0**, including the whole round trip. |

That is the second time in two days this board has aimed the fleet's top
priority at something already finished (row 7 / P0-DOOR was corrected the same
way on 8/20). **A status board is a claim about the tree and it decays like
one.** Re-measure before steering anybody.

## WHAT WAS ACTUALLY MISSING: THE JOURNEY
Every beat of the demo was green. Here is what was being relied on:

```
front_door_gate     the splash lands on the game      alpha
first_night_gate    day one, in detail                alpha, stops at the finished job
combat_entry_gate   walking in starts a fight         alpha, its own boot
footstep_gate       the ground makes a sound          its own boot
vista_beat_gate     sleep, wake, the valley opens     THE CITY, STANDALONE
```

**Five gates, three surfaces, five separate boots, and the join between any two
of them proved by nobody.** That is SWEEP 13's finding word for word — *"gates
that test pieces and never the journey"* — and it is the same shape as every bug
this lane has spent the week on: a finished thing with a published seam and no
caller. A seam between two *gates* is invisible in exactly the same way, except
what falls through it is the demo.

**The vista was the sharpest case.** `vista_beat_gate` drives
`slices/BOHEMIA_CITY_WORLD.html` directly. The city is the right surface — it is
the walked world — but **nobody opens it that way.** Paolo opens the alpha and
taps the splash, and the city runs as an **iframe** inside a shell with its own
toolbar, its own day card and its own install banner. This lane already shipped a
fix for a bug of exactly that shape (the cold open covering the city's toolbar,
because the shell's chrome and the frame's chrome had never been measured
together). **The demo's money shot had never once been checked on the surface his
thumb touches.**

## AND IT WORKS. I EXPECTED A BUG AND THERE WASN'T ONE.
Measured, driving the alpha by taps:

```
tap the splash  ->  tab RUN, city iframe built, DAY 1, day loop running
day 1           ->  cold open offered; NOT NOW is a real answer
                    phone badge lit, job taken by tapping TAKE IT
                    objective arrives, the pad walks, SLEEP raises the reckoning
day 2           ->  the card comes up first, the valley waits behind it
                    GET UP -> THE VALLEY OPENS BY ITSELF
vista card         page 104-164      tab bar  page 0-40      no overlap
page errors        0
```

**The proof was the deliverable, not a fix.** The next item on the demo board is
putting friends in front of this. You do not do that with a path nobody has
walked once.

## THE ONE THING WORTH WATCHING, AND IT IS AN AFFORDANCE, NOT A BUG
Driving the alpha and tapping **only the obvious primary button**, a player goes:

```
GET UP -> SLEEP -> DAY 2 -> GET UP -> SLEEP -> DAY 3 -> ...
```

The work of day one is behind the **phone**. It is reachable and it is takeable —
that is proven — but the day card's primary path walks straight past it. The
thing standing between a friend and the game is one badge on one button.

So the badge is now a **claim**, not a detail: *"THE JOB ANNOUNCES ITSELF — the
phone carries an unread badge, so the day's work is not hidden behind a button he
had no reason to press."* Silence the badge and the gate goes red. It is lit
today.

I am **not** calling this broken and I have not changed it. A friend who taps the
lit phone plays the game. Written down because it is the one place in the demo
where the player has to make a leap, and if the round with friends turns up
"I didn't know what to do", this is where to look first.

## WHY IT DOES NOT REPLACE `first_night_gate` — DO NOT DEDUPE THEM
Different instruments.

- **FIRST NIGHT is the microscope.** 53 claims on the mechanics of day one: the
  door predicate, the interior mover, the minute arithmetic, the home exemption.
- **WHOLE DEMO is the spine.** 21 claims, every one on **one unbroken session**.

A microscope cannot see a seam between two boots. A spine cannot see an
off-by-one in a mover. Both earn their keep, and the gate says so in its own
header so nobody "tidies" one away.

## THE RULES IT WAS BUILT UNDER
- **EVERY BEAT IS A TAP A PLAYER COULD MAKE.** No `offerAccept()`, no
  `DAY.day = 2`, no forcing a panel visible. If a beat cannot be reached by
  tapping it cannot be reached by a friend, and the gate should say so.
- **ONE COORDINATE SYSTEM.** The vista card is measured inside the iframe and the
  tab bar in page space. Comparing those two directly is the units bug this lane
  has now found nine times, so the gate converts first — the iframe's own page box
  plus the card's frame offset — and says in its own message that it did.
- **MUTATION-TESTED BOTH WAYS.** Disarm the vista and the money-shot claim goes
  red. Silence the phone badge and the affordance claim goes red. A gate that
  passed first try and was never shown to bite is not evidence of anything.
- **A CRASH STILL FILES ITS REPORT** — how far it got, and which beat killed it.

## HOW TO RUN IT
```
node gates/the_whole_demo_gate.js
python3 gates/bohemia_gates.py --only "WHOLE DEMO"
```
