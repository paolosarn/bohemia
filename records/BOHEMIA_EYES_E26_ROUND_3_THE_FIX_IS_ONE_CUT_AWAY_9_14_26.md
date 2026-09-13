# EYES AND EARS -- E26 [five minutes], STANDING: THE SECOND WALK
## "THE DEMO DID NOT CHANGE, BECAUSE THE FIXES ARE ONE CUT AWAY FROM HIM"
### 9/14/26 -- lane 17. Two walks this round: the demo he plays, and the alpha the fixes landed in.

THE LAW: `laws/BOHEMIA_ADDENDUM_THE_FIVE_MINUTES_9_13_26.md` (Paolo 9/13, LOCKED). E26 is
standing: walk it every round and rewrite THE STRANGER'S LIST, first thing.

Both walks: cold context, no stored save, 390x844 with touch, the page's own clock, the dial
**held** (last round's lesson). Three controls passed on both runs.

---

## THE HEADLINE: NOTHING HE CAN SEE CHANGED, AND THE REASON IS MEASURABLE

| | **DEMO** (BUILD 9/13z) | **ALPHA** (BUILD 9/14a) |
|---|---|---|
| failed network requests | **1** -- Google Fonts | **0** |
| page errors | 0 | 0 |
| console errors | 3 | 2 |
| fight surface seen in five minutes | **NONE** | **NONE** |
| dead affordances | 2 | 3 (all in the workshop, see below) |
| things on the first screen | 23 | 35 |

**The fight's own font, measured inside the base64 blob in each file:**

```
                    alpha        demo
Space Grotesk         0           42
fonts.googleapis      0            2
BohemiaMono           2            0
embedded woff         4            0
```

**The fix is real and it is not in the thing he plays.** COMBAT shipped it to the alpha
(V214, "the fight wears the game's own face"), off item 3 of last round's list. The demo is
stamped 9/13z, the alpha 9/14a, and only THE RUN re-cuts the demo (the law's section 3). So
the honest sentence is not "the font is fixed" and not "the font is broken": **it is fixed
where it landed and one cut away from him.**

That is the shape of the whole round. Six lanes shipped against his list; the demo he opens is
the same demo.

---

## THE STRANGER'S LIST, THIS ROUND (the demo, unchanged from last round)

```
00:03  the front screen, "TAP TO ENTER", stamp BUILD 9/13z
00:08  tapped it                                 -> the screen changed
00:19  23 things with words, big enough for a thumb
01:10  tapped "BUILD"          (a real button)   -> NOTHING CHANGED
01:12  tapped "BUILD BIG 2x2"  (a real button)   -> NOTHING CHANGED
01:12 to 05:00  the dial held 114 more times, everything new tapped
05:00  stopped                                   -> no fight surface, ever
```

Same two dead buttons as last round, same ten map and faction rows that change nothing and are
still not counted as dead buttons, same one failed font request, still no fight. **Time until
something is tappable: 2.9 s.**

---

## THE ONE DISAGREEMENT, AND IT IS MINE TO CLOSE

COMBAT corrected their own number this round, in public and precisely: the encounter arrives at
**55 cells actually walked, about three and a half minutes**, not the 29 seconds they first
claimed, and they were right to say my earlier "no fight" was measured six minutes before their
fix landed.

**My walk still reports no fight, on both surfaces, and that report is weaker than their number.
Two reasons, both mine:**

1. **DIFFERENT UNITS.** They count **cells walked** by driving the engine's own step function.
   I count **seconds of a held press on the real dial**. Neither converts to the other, and I
   probed for a readable player cell in both surfaces and in every frame: **nothing exposes one.**
   So I cannot say whether my walk covered 55 cells, which means I cannot say their number is
   wrong -- only that my instrument did not see a fight.
2. **MY TEST LOOKS FOR A FIGHT SURFACE, AND THE DEMO'S FIRST FIGHT IS A LESSON ATTACHED TO AN
   ENCOUNTER THE WORLD PRODUCES.** The demo's own comment says it: *"The lesson waits for a
   fight the world produced on its own, which is what a stranger meets anyway."* A test looking
   for `#combatFrame` being visible can miss the moment the world offers one.

**So this round's fight line is: my instrument saw no fight, and my instrument is not yet good
enough to contradict theirs.** Stating that is the job. The ask that closes it belongs to
whoever owns the engine: **expose the player's cell, read-only, so a walk from outside and a
gate from inside can be compared in the same unit.** Until then the two numbers sit side by
side and neither overrides the other.

---

## THE ALPHA WALK, AND WHY ITS DEAD BUTTONS ARE NOT ON HIS LIST

The alpha is the workshop with sixteen tabs. My fixed tap script went where the biggest thing on
screen led, and **it wandered into the bench**: seed, HOUSE, + LINE, + YOU, + RAY (father),
CAMERA, PERSON, FOLD A GENERATION, faction strengths. That is not a stranger's five minutes; it
is me tapping the tools.

So the three dead things it found -- the day card's row **"Half of it now, before I go"** (320x44),
**"HOUSE"** (68x28) and **"+ MARCO (brother)"** (134x28), the last two with pointer cursors --
are reported here and **kept off THE STRANGER'S LIST**, because two of the three are workshop
controls a stranger never meets. Putting them on his list would be the false alarm this lane
exists to avoid.

**What the alpha walk is worth:** it is the surface the fixes land on, and there it shows **zero
failed requests** and **zero page errors**. The font fix works.

**And one that does belong to him:** the day card's own row *"Half of it now, before I go"* was
dead on the alpha at 00:27 this round, and was dead on the demo on an earlier route last round.
That row is on the first card a stranger sees, in both surfaces, and it has now been measured
dead twice.

## RULE ZERO: THREE CONTROLS, PASSED ON BOTH RUNS
- **COLD START** -- 0 keys in storage at first paint, both runs.
- **ERROR CATCH** -- a planted page error was captured, both runs, so "0 page errors" means
  something.
- **CHANGE PROBE** -- a deliberate change registered, both runs, so "NOTHING CHANGED" is
  falsifiable.

## ROUTED
- **RUN** -- the demo is one cut behind the alpha and six lanes' fixes are sitting behind that
  cut, including the font. Only RUN may re-cut; this is the measurement that says what is
  waiting.
- **RUN [dead cards]** -- "Half of it now, before I go", now measured dead on both surfaces.
- **UI or whoever owns the build panel** -- "BUILD" and "BUILD BIG 2x2" are real buttons that
  do nothing on the demo.
- **COMBAT, and it is a request not a correction** -- expose the player's cell read-only so a
  held-press walk and a step-driven gate can be compared. Their 55 cells and my 300 seconds
  cannot currently be reconciled, and that is my instrument's gap as much as anything.

## FILES
- `tools/bohemia_eyes_five_minutes.js` -- now takes a surface argument (`demo` default, `alpha`)
- `records/BOHEMIA_EYES_E26_WALK_DEMO_9_14_26.json`, `..._WALK_ALPHA_9_14_26.json`
- `records/eyes_e26_walk_demo/`, `records/eyes_e26_walk_alpha/` -- seven shots each, unpublished
