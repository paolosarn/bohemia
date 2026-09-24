# E26 ROUND 16: THE INVENTORY SAW ONE THING ON THE SCREEN AND THE PHOTOGRAPH SHOWED TWO

EYES AND EARS, lane 17, E26 [five minutes], round 16. 9/24/26.
Walked on the deployed cut made fresh this round, **BUILD 9/24n**.

---

## WHAT A STRANGER MEETS NOW

```
  things offered on the first screen      2     the gear, and NOTES
  things pressed in five minutes          6
  dead affordances                        0
  knocks to open the door                 1
  first tappable thing                    30.0 s
  a fight in five minutes                 never
  real page errors                        0
```

The walk pad is not in that count and it works: the log line reads *held the walk dial down for
two and a half seconds, the world moved, 8 arrows on the dial*. It is drawn, not written, so an
inventory of things with words cannot see it. Said out loud because "2 things offered" without
that sentence is a worse number than the screen deserves.

---

## THE HOLE: A BUTTON WHOSE LABEL CANNOT BE PRESSED WAS INVISIBLE TO ME

The first walk of the round reported **one** thing on the whole first screen, the gear. The
screenshot of the same moment shows the NOTES button too. Measured rather than guessed, by
dumping every visible element and printing which of my own filters dropped it:

```
  notebtn     44x44   dropped: it has a child, and this walk took LEAVES ONLY
  noteplate   29x15   dropped: pointer-events: none
```

**The leaf carries the word and cannot be pressed; the parent takes the press and is not a leaf.**
So a real control vanished from the count I publish, which is the same family as the round-11 hole
where the HUD chips were never pressed at all.

The rule is now **the innermost thing that can be pressed**: an element counts when nothing inside
it is also a candidate, and a label with pointer-events:none is not a candidate. NOTES appears,
and pressing it opened the notes panel, which no walk of mine had ever been inside.

---

## AND INSIDE IT, THREE BUTTONS READ DEAD THAT ARE ALL ALIVE

`CLOSE`, `COPY ALL` and `EXPORT` all came back "did nothing", twice each. All three answer, and
none of the answers is a pixel:

- **COPY ALL** ran its handler and the browser refused it: *clipboard-write is not allowed in this
  document*, logged once per press. That is this harness, not the game.
- **EXPORT** hands the browser a file. A download changes nothing on screen by design.
- **CLOSE** takes itself off the screen; my panel finder had resolved the surrounding panel to the
  whole stage, so "the panel survived" was true and useless.

Three new ways a press can answer are counted now, and each says which one it was: **the browser
answered it**, **it handed the browser a file**, **it took itself off the screen**. With them the
walk reads 6 pressed, 0 dead, and every verdict names where the answer landed.

**AND THE PLANTED CLOSE-BUTTON CAUGHT ME THE SAME ROUND.** The vanish rule swallowed rule 14(h):
a close button removes itself AND its panel, so the planted control went from "THE PANEL CLOSED,
so this press proves nothing" to "did something", which is the exact false life 14(h) exists to
stop. 14(h) outranks it now: a vanish counts only while the panel around it survives. The browser
and download answers stand alone, because a card quietly closing cannot produce either.

```
  planted close-button  before the fix: "did something"   after: "THE PANEL CLOSED, proves nothing"
  all eleven controls   green
```

## BLIND SPOTS, STATED

Two things offered is a count of things with WORDS; the dial and the phone are drawn. No fight was
reached, so the fight half of rule 21 and the fight rows of the bible stay untouched. And the
clipboard answer is specific to this harness: on a real phone COPY ALL either copies or it does
not, and I still cannot say which.

## PROOF

- `tools/bohemia_eyes_five_minutes.js`, eleven controls, every failed version written into it
- `records/BOHEMIA_EYES_E26_WALK_DEPLOY_9_14_26.json`, and the screenshots beside it
