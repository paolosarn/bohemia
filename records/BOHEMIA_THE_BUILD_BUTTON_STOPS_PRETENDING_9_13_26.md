# THE BUILD BUTTON STOPS PRETENDING (9/13/26, LIFE + CITY lane)
## Answering EYES E26's stranger walk, item 2, on this lane's own surface

> **EYES E26:** *"TWO REAL BUTTONS THAT DO NOTHING: 'BUILD' (cbbuild, 69x29) at 01:08 and
> 'BUILD BIG 2x2' (cbbig, 112x28) at 01:10. Driven tap, no change in words or pixels for
> 1.2 s."*

Taken under standing duty 8 — **his bugs beat your queue** — and Paolo 9/13, rule 14(d):
*"A card that promises something and does nothing is the worst bug in the game: deliver it
or remove it."*

---

## I DROVE IT BEFORE BELIEVING IT. THEY ARE NOT DEAD — AND THEY WERE RIGHT ANYWAY.

EYES retracted a walk last round for an instrument fault, so this verified rather than
repeated. A driven tap on a **desert** plot does change the words:

    cbAfford() -> {ok:false, have:0, price:1, currency:"electricity", CANNOT_AFFORD}
    #cbprice   -> "that costs one battery and you have none. Finish a job and come back."

So "no change in words" is not literally true.

**But the panel already said that before he pressed.** `#cbprice` opens reading *"costs one
battery · you have none, so not yet"*, and the press **replaces that sentence with a
reworded copy of itself**. The first press tells him what he had already read; every press
after it changes nothing at all.

**To a thumb that is a dead button. Their instrument was measuring the truth.** The word
"nothing" was wrong; the finding was right, and the finding is what matters.

## AND MY FIRST ATTEMPT NEARLY FILED A THIRD WRONG HEADLINE

I tapped the middle of the glass, got a cell that was already built, and read the result as
*"no BUILD button on screen — the panel never opened."* It had opened; a built cell shows
**DEMOLISH** and the BUILD buttons only exist on the `else` branch, `d === 'desert'`.

Same shape as every other trap this lane has paid for: **I asked something adjacent to the
real thing, got a clean negative, and nearly believed it.** The gate now finds a desert plot
itself rather than hoping one is under the middle of the screen.

## WHAT SHIPPED

The button **goes visibly off when the purse cannot meet it** and carries the reason on
itself — where the thumb is already going.

- **No new voice.** The refusal sentence is untouched. This round only stops the control
  lying about itself.
- **One source of money.** The price tag, the till and now the button all quote the same
  `cbAfford()`, so they cannot name different numbers.
- Both buttons, not only the one EYES named first.

## MEASURED BOTH WAYS, BECAUSE ALWAYS-OFF IS A DIFFERENT LIE

|  | disabled | opacity | title | cbAfford |
|---|---|---|---|---|
| empty purse | **true** | 0.45 | "you have none of it" | ok:false, have 0 |
| credited 5 | **false** | 1.0 | *(none)* | ok:true, have 5 |

Getting the second row honestly cost something worth writing down: **three invented
`add`-style calls missed silently** and left the button off, which would have shipped as
"always off" and read as fixed. The real API was two greps away — `cbAfford` asks
`BohemiaProduction.canAfford(purseGet(), …)` and `engine/bohemia_purse.js` exports
`credit()`. *Read it, don't guess it* — the same lesson as the zoom and the camera.

## THE GATE BITES IN BOTH DIRECTIONS

`gates/a_button_that_cannot_work_gate.js`, **9 pass / 0 fail**, registered.

| mutation | expected | result |
|---|---|---|
| always pressable (the old behaviour) | RED | **A1, B1, B2, B5** |
| always off (the over-fix) | RED | **A1, B3, B4, B5** |

B3 exists **only** to catch the second one. A control that never lights up would score
perfectly on "it does not promise what it cannot do" and be a worse game.

## THE STANDING NOTE

**A CONTROL CAN BE WORKING PERFECTLY AND STILL BE A DEAD BUTTON.** Everything behind this
one was correct — it checked the purse, it refused honestly, it explained itself in good
plain words. It was dead because **the panel had already answered the question before he
asked it**, so pressing it could only repeat. Correct behaviour and a dead control are not
opposites, and a checker that only asks "did the handler run" would have called this fine
forever.

---

    BUILD / BUILD BIG   always pressable  ->  off when he cannot pay, on when he can
    gate                a_button_that_cannot_work_gate.js 9/0, mutation-tested both ways
    stamp               9/14b
    demo                NOT re-cut (rule 14a)
