# V217 — YOU CAN START IT (COMBAT lane, `[start a fight]`)

> **PAOLO 9/15: "I don't even know how to engage in combat and when that shit
> starts."**

The row has two halves and both are in: **ON PURPOSE** (a hostile body is on the
glass and tapping it starts the fight) and **IT SAYS SO** (when the fight starts the
screen says so, and says what to press).

---

## WHAT WAS MEASURED FIRST, ON THE ALPHA, BEFORE A LINE WAS WRITTEN

Four numbers say why he could not start a fight and why he never met one.

**A tap on the walked street did nothing.** A real pointer in the middle of the
glass produced **zero** encounters. In the walked view the canvas handler does pinch
zoom, a double-tap zoom reset and a drag test, and `tpTap` was removed at the
trigger on 8/24 (correctly — it rebuilt a dead judge panel). So the most obvious
gesture a person has was wired to nothing.

> **There was no input anywhere in the game that means "fight them."** Bumping a
> body works (V201) and bumping is not a decision. It is something that happens
> to you.

**Nothing is on the glass at the door, and nothing can be.** The draw pass asks for
crews inside `seeR = ceil(max(canvas)/C/2)+6`, and the real numbers at the
house-scale zoom are C 44 and a 418×861 canvas, so **the see radius is 16 fine
cells.** The nearest hostile crew to where he wakes is at **24**, then 31, then 32.

```
at the door        hostile bodies drawn   0
after a minute     hostile bodies drawn   0
nearest crews      24, 31, 32 fine cells    see radius 16
crew spacing       90 fine cells
```

The crews are real and RUN placed them. They are **eight cells outside the radius
that can draw one.** That half is not mine and it is routed: the spacing is 90 cells
and the spawn is RUN `[wake near]`.

**A directed walk at the nearest crew is walled in.** From the door, walking straight
at it, he covers 20 fine cells and then moves **0 more in 140 render frames** — the
suburb closes. The district he wakes in is `suburb`, which by design has no road row
either.

**The street is forbidden to fight him for the first two minutes.** `SF_GRACE` is 40
steps and the measured walk rate is 20 fine cells a minute, so V201's own dial rules
out a street fight for exactly the window the row is about.

## THE SPLIT THIS SHIPS: GRACE IS ABOUT BEING JUMPED

`SF_GRACE` exists for the `__NOT_YOUR_OWN_HOUSE__` lesson — nobody should be
ambushed on his own doorstep — and **it is untouched.** A fight he walks up to and
taps is not an ambush, so the tap does not wait the grace out. The cooldown still
holds (one bad block is not a corridor of fights) and one crew is still one fight,
both through the same `SF_DONE` and `SF_LAST` the bump path uses, so the two paths
cannot disagree about what has already happened.

**And it goes through the one door.** `cityHandOver` is the single seam all four
fight entries use, so the tap inherits the two-beat camera pull-back and the cloud
(V205), the save at the bell (V215), the day (V207) and the plate charge (V211) with
no new wire. That is what the door is for.

**And the street tells him.** Once per crew, reading the state the crew's own model
decided: *"2 OF THEM HAVE CLOCKED YOU. TAP ONE AND IT STARTS."* It speaks through
`streetSay`, the street's one shared line, which already clears itself.
`[draft:true]` — the wording is an attempt, WORDS owns it.

## WHAT THE SCREEN SAID AT THE BELL, AND THE HOLE UNDER IT

Driven through the shipped city door on the first fight of a fresh game:

```
"READY  ·  read the horizon, pop on green"
```

That is `fullResetCombat`'s bench line. It does not say a fight has started, and
"pop on green" names a mechanic a first-time player has never seen.

**And it is not even meant to be there.** V202 reserved this line for the teaching
fight, and *both* readers stand down for it — `worldRead` and `plateRead` each carry
the comment "the lesson owns the readout" —

> **and the lesson never wrote a line.** A reservation nobody filled, so the first
> fight of the game has been telling him to read a horizon.

Now the lesson writes the line it reserved:

```
A FIGHT HAS STARTED
press FIRE, then FIRE again on the beat
```

Named off the real button: in the cover phase `#fire` is labelled FIRE and pressing
it opens the dial, then the release is the shot. On the teaching board the dial does
not decide and the press does (V202), which is why the second half is the beat and
not the aim. `[draft:true]` — WORDS owns the words.

## PROOF

`you_can_start_it_gate` — **19 passed, 0 failed.** It dispatches a **real pointer**
on the real canvas at the rectangle the frame actually blitted:

```
tap on empty street          0 encounters
tap on a hostile body        out on the block · why 'tapped' · street true · room false · roster 2
the crew's own count         2, which is what RUN's crew holds
a second tap                 nothing
the bump path in its grace   still refuses
at the bell                  A FIGHT HAS STARTED / press FIRE, then FIRE again on the beat
```

**Mutation-proved four ways, each landing on its own arm:** unwire the tap → the tap
arms go red; make the hit test accept any point → the *empty street* arm goes red;
silence the bell line → the two bell arms go red; remove the street line → the
*street tells him* arm goes red.

### And three broken instruments were fixed before any of that was believed

1. **A synchronous walk loop never renders.** `HOST_DREW` is filled by the draw pass,
   so a walk driven in one `evaluate` reported zero hostile bodies at every distance.
   The walk now yields frames.
2. **The card was over the glass.** `elementFromPoint` at a body returned
   `DIV#daycard` — the day card, 418×853, z 40, pointer-events auto. Three runs of
   this gate sent every tap into a card. It now clears the card with the card's own
   way out, using the one driver's rule: *the question is not "did I press
   something", it is "is the canvas reachable".*
3. **Reachability is two questions, not one.** The frame said `CANVAS#cv` at a body
   while the **shell** said `DIV#openInvite` at the same screen point — a banner
   pinned to the top of the city panel — and the finger lands in the shell. The gate
   now requires the city to say "canvas, and a body" *and* the shell to say "the
   city's own iframe".

Also measured and kept honest: the door takes **two beats** before it hands over, so
a 600 ms wait reads a working tap as a dead one; and a body that is *watching* walks
toward you at a third of a cell per beat, so a rectangle read three seconds ago is a
rectangle the body has left.

## THE DIAL

Nothing here touches a number in a fight. The roster size is the crew's own count,
which RUN decided, exactly as the bump path reads it.

## ROUTED

- **RUN `[enemies exist]` / `[wake near]`:** a hostile body cannot be on the glass at
  the door. See radius 16 cells, nearest crew 24, crew spacing 90, hostiles near the
  spawn 0, and a directed walk out of the suburb stops dead after 20 cells. The tap
  works the moment a body is in frame; nothing puts one in frame at the door.
- **CORRECTION, and it is mine:** I wrote in the commit message that the line at the
  bell "waits for RUN's next cut". That is wrong about the surface he actually opens.
  `.github/workflows/pages.yml` runs `tools/bohemia_cut_the_demo.js` as a build step
  before it assembles the site, so **the demo at the one link is re-cut from the alpha
  on every push** and already carries this line (UI corrected the same mistake in
  `5bed08dd`). What is stale is the **committed** `slices/BOHEMIA_DEMO.html` on disk,
  which is the file EYES and RUN read when they measure the stranger's list. Two
  different files. Rule 14(a) is untouched: this lane did not run the cutter.
- **The shell banner:** `#openInvite` ("DAY 1 BEGINS BEFORE THE DAY … WATCH / NOT
  NOW") is pinned over the top of the walked city at z 39 with pointer-events auto,
  so any finger that lands on it never reaches the city at all. Not mine; worth a
  look by whoever owns the cold open.

---

**Tool:** `tools/bohemia_you_can_start_it_patch.py` (MARK `__YOU_CAN_START_IT__`,
city slice + the fight blob) · **Gate:** `gates/you_can_start_it_gate.js` ·
**Tab:** CITY to start it, COMBAT once it starts.
