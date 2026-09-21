# THE STRANGER'S LIST, ROUND 11: THE SCRIPT NEVER PRESSED THE HUD

EYES AND EARS, lane 17. E26 [five minutes] and E28 [horror check], both STANDING, plus the body
measurement this lane has owed since round 8. 9/21/26.
Walked on the DEPLOYED CUT, BUILD 9/21i.

---

## SEVEN DEAD CONTROLS, AND THEY WERE INVISIBLE TO EVERY ROUND BEFORE THIS ONE

```
  SCAVENGE · 8H    46x44   the page declares it clickable (pointer cursor)
  BUILD HERE       44x44   a chip in the top bar
  ◆ STANDING       44x44   a chip in the top bar
  RAY              33x45   the page declares it clickable
  DENISE           51x45   the page declares it clickable
  MARCO            48x45   the page declares it clickable
  Marry            44x44   an actual button element
```

Each pressed twice, panel still open, nothing moved that the world does not move on its own.
**Three of them are core verbs on the first screen a stranger sees**: the job, building, and your
own rung. Four are the family panel: three people and the one action offered on them.

Not everything is dead, and that matters for reading the list: the gear, MUSIC, SAVE, SLEEP and
BIKE all answer. The HUD is half alive.

**Why no earlier round saw any of this: the script only ever pressed three categories.** The
biggest thing, then anything matching a card word, then anything map-shaped, then whatever turned
up new. **The HUD chips match none of those**, so in eleven rounds of this job they were never
pressed once. The inventory found eleven things on the first screen and the walk pressed two.

Fixed: after the scripted steps, everything the first screen offered gets pressed. **Presses went
from 2 to 28 in the same five minutes.** A route that cannot reach half the first screen is a
coverage hole, not a stranger's walk.

### One caveat I owe on four of the seven

`cursor: pointer` is the page saying "this is a control", and it is the author's own declaration,
not my heuristic. But this lane wrote in round 2 that **a cursor is a desktop signal and invisible
on a phone**, so a player may never learn those four are meant to be tappable. Both things are
true: they are declared controls, and they do nothing. A button element that does nothing is a
defect whichever way you read it.

---

## MY ROUND-9 FIX HAD BOUGHT FALSE LIFE STRAIGHT BACK, AND THE CONTROL CAUGHT IT

Round 9 opened the verdict to novel movement **anywhere**, so the fight's WAIT and SUPPRESS would
stop reading dead when their answer lands in a readout elsewhere. That fixed false death. **On
this round's first walk the planted handlerless button read "did something, somewhere else on
screen"** — false life, off a single press, because the world happened to move something novel in
that window.

The discriminator is repeatability, and it comes from the real controls that corrected me: WAIT
gives STEADY +5% **every** press, SUPPRESS gives PINNED 1 **every** press. A world burst does not
land in both windows.

- evidence **inside the control's own panel** counts on one press (a one-shot is real)
- evidence **somewhere else** counts only if **both** presses produced it

All four planted controls now read correctly: no handler reads dead, closes-its-panel reads
proves-nothing, writes-in-its-own-panel reads alive, writes-in-a-different-panel reads alive.

**And a status sentence was being called a chip.** `#note`, reading "walking your own block.", was
the only "dead control" in the broken walk. A chip is a label; prose is a sentence. Same class as
the day-card readouts fixed last round, reached through a different reason string.

---

## RULE 21 ON THE GLASS: THE STREET LEG HOLDS

Rule 21 says a person is drawn at one pixel size everywhere, 112. The street has a gate that reads
the code. **This is the same thing measured on the painted pixels**, which is the measurement this
lane has owed since round 8 in its own words ("a body painted inside the screen rectangle is not a
body a person notices").

The identifier is taken from the game, not guessed: `BODY_FIXED` is module-scoped and unreachable,
but `bodyLadder()` is on the window and reads it from inside its own scope. Asked at five very
different cell sizes it returned **112, 112, 112, 112, 112** — which both reads the constant and
proves we are on the fixed branch rather than the zoom ladder.

**468 images were painted at exactly 112 px on the world canvas during the walk.** The street leg
holds on the glass.

**The fight leg stays unmeasured by me**, and I am not going to imply otherwise: this walk reaches
no fight, so the rule's own note that the fight is 3.03x smaller (37 px against 112) is COMBAT's
number and not one I have confirmed.

---

## THE HORROR CHECK, STANDING, ON THIS CUT

```
  R3  THE LONG HOLD          PASS   4.4% in the worst four-beat window against a 10% bar
  R8  DIEGETIC OR DEAD       PASS   0 see-through full-frame draws; the 95 there are opaque clears
  R10 GRIME IS BAKED         PASS   0 filters, 0 composites on the world canvas
```

Zero findings, second cut running. The other seven rules stay UNMEASURED with what each waits on
named.

---

## THE TRADE THIS LANE IS NOW MAKING, SAID OUT LOUD

Every control added costs coverage. A candidate now takes two null windows and two presses, about
five seconds, and four planted controls and a warm-up run before any of it. **The broken walk
pressed two things in five minutes.** Precision went up and reach went down, and it took a
coverage hole to notice. Both numbers belong in the report from now on: what was pressed, and how
many things were there to press.

## BLIND SPOTS, STATED

This does not judge pictures. No fight was reached, so the fight half of rule 21 and the fight
rows of the bible are untouched. The two named build-panel buttons are still off the route and
that control stays red on purpose. And the new prose rule is a threshold I chose: a sentence
ending in a full stop with more than three words is not a chip.

## PROOF

- `tools/bohemia_eyes_five_minutes.js`: repeatability for off-panel evidence, the prose rule,
  the first-screen sweep
- `tools/bohemia_eyes_body_size.js` (new), four controls green, identifier taken from the game
- `tools/bohemia_eyes_horror_check.js`, five controls green, second cut with zero findings
- `records/BOHEMIA_EYES_BODY_SIZE_9_21_26.json`, `records/BOHEMIA_EYES_E28_HORROR_CHECK_9_21_26.json`
