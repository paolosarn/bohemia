# THE STRANGER'S LIST, ROUND 9: THE TRADE I NAMED CAME DUE

EYES AND EARS, lane 17, E26 [five minutes], STANDING. 9/18/26.
Law: laws/BOHEMIA_ADDENDUM_THE_FIVE_MINUTES_9_13_26.md, rules 14(a) and 14(h).
Charter: laws/BOHEMIA_ADDENDUM_EYES_AND_EARS_9_4_26.md. Mode: SCHOOL THEN CHECK.

---

## FIRST: COMBAT FIXED WHAT I FOUND, AND CORRECTED WHAT I GOT WRONG

**The developer's control strip is off the fight. Verified on the glass**: the walk of the
deploy cut no longer finds WAIT, SUPPRESS, HAND-PEEK or NEW ENCOUNTER anywhere. COMBAT moved
them behind the gear, into the panel whose heading already says DEMO SETTINGS, by moving the
live nodes rather than rewiring them.

**And they corrected my claim, which matters more than the fix.** I reported four of those five
controls dead. Driven in a real fight, every one of them ACTS: WAIT gives STEADY +5%, SUPPRESS
gives PINNED 1, HAND-PEEK flips its own label, NEW ENCOUNTER restarts the fight you are in.
**Not dead buttons: live developer controls over a stranger's fight, which is worse.** Their
framing is better than mine and the photograph was the only part of my report that held.

### Why my test said dead, and it is the trade I wrote down myself in round 5

Round 5's own blind-spot note, verbatim: *"the panel test takes the nearest card-shaped
ancestor, so a control whose effect lands in a DIFFERENT panel will read as dead here; that is a
deliberate trade for killing false life, and it is the next thing to measure."*

That is exactly what happened. The finger is in the strip; the answer appears in a readout
elsewhere on the screen; the panel holding the button never moved; I called it dead and put it
on his front page. **A blind spot you have written down is still a blind spot.**

### Closed, and there is a planted control that proves it

The two halves are separate questions and both are needed:

```
  the panel survived the press   kills FALSE LIFE  -- a card that closes on a tap it does not
                                 know looks exactly like one that did the thing (rule 14h)
  novel movement ANYWHERE        kills FALSE DEATH -- the effect does not have to land in the
                                 same box as the finger; the ledger is what makes "novel" mean
                                 something the world does not do by itself
```

A fourth button is planted now, in one panel, whose only effect is to write a word into a
**different** panel. That is the shape of WAIT and SUPPRESS. It must read alive, and it does.
The row now also records WHERE the screen answered, so "its own panel" and "somewhere else" are
different words rather than the same verdict.

---

## AND I CAUGHT MYSELF AGAIN, BEFORE IT REACHED HIS PAGE

The first walk this round reported **five** dead controls. Four of them were: "ON THE ROAD ·
SUBURB · DAY" at 277x14, the encounter's own title at 320x17, "THAT COST" at 55x14, "15 min" at
34x17.

**Those are text, not buttons.** They counted as claiming to be tappable only because my rule
said anything inside the day card is a row. The card's real rows are 320x44. So height decides
now, and the number is not invented: 44 px is the published minimum touch target and it is
exactly what the card's own rows use. Below 30 px inside a card it is text, and text goes to the
inert list with its reason, never to the dead list.

**Dead controls: 5 -> 1.** The one that is real is "Half of it now, before I go", 320x44, dead
for the sixth round running, still with LIFE + CITY as `[eyes: shape rows]`.

---

## THE YARDSTICK WAS TOO NOISY TO BE A CONTROL, AND IT SAID SO ITSELF

Round 8's phone numbers rested on a busy-loop yardstick proving the throttle applied. Three runs
asking for the same 4x measured **3.20x, 3.65x and 2.13x**, and the third was REFUSED by its own
control. Correct behaviour, and also a verdict on the yardstick: one 18 ms sample is short enough
that warm-up and a stray tick swing it by half.

Fixed: a longer loop, five samples a side, the first of each discarded as warm-up, medians.
**Now 4.36x with a 2% spread within a side.** A control that cannot repeat itself is not a
control; this lane has published that sentence about other people's instruments.

**So round 8's numbers should not be compared with the ones below.** They were measured on the
committed file (which round 7 proved nobody is served) with a yardstick I have since proved
untrustworthy. The pair below is comparable because both halves were measured the same way,
minutes apart, on the same kind of surface.

---

## WHAT RUN'S LOADING FIX ACTUALLY BOUGHT, MEASURED BOTH SIDES

The cut from before `[loading screen]` and the cut from after, both walked at a verified 4x with
my observer switched off:

```
                                   before (9/16e)   after (9/16f)      moved
  the city draws its first thing        17.9 s          17.1 s         -0.8
  the first human body is painted       47.9 s          43.8 s         -4.1
  THE FIRST HUMAN BEING ON SCREEN       59.2 s          54.4 s         -4.8
  worst single freeze                   34.8 s          33.0 s         -1.8
  frozen, out of the first 300 s       142.7 s         107.9 s        -34.8
  separate freezes                       188             106            -82
```

**Thirty-five seconds of frozen time gone, and eighty-two fewer stalls.** That is a real win and
it is RUN's. What has not moved is the shape of the problem: **a minute before a human being is
on screen, and more than a third of the five minutes still frozen.**

---

## THE REST OF THE LIST

An encounter card arrives at about 02:03 ("DESPERATE SCAVENGER SHAKEDOWN", "ON THE ROAD ·
SUBURB · DAY"), and on this route the fight surface itself was not reached, so I report the card
and not a fight. First tappable 3.3 s. 0 page errors, 2 console errors, 0 failed requests.
**56 fight words still exist in the demo and a player can read zero of them** -> COMBAT
[start a fight].

## BLIND SPOTS, STATED

This does not judge pictures. The two named build-panel buttons are still off my route and that
control stays red on purpose. "A body painted inside the screen rectangle" is still not "a body a
person notices" -- at the far zoom it is a few pixels, and that is the next thing to measure.
And the new height rule is a threshold I chose: 30 px, justified by the card's own 44 px rows,
but a real control shorter than that would now land in the inert list instead of the dead one.

## PROOF

- `tools/bohemia_eyes_five_minutes.js`: novel-anywhere with the panel-survival test kept, the
  sibling-panel planted control, the card height rule
- `tools/bohemia_eyes_a_human_being.js`: the yardstick rebuilt on medians, `--surface`
- four walks and three throttled probes this round, two of them a matched before/after pair
- COMBAT 27ef790, whose correction is what made this round necessary
