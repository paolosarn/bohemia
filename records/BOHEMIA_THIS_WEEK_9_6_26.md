# WHAT YOU ARE WORKING ON (RUN, 9/6/26)

VAMILY `[weekly goal]` / BB-THIS-WEEK, day 18 of the study.

> *** **A GOAL YOU HAVE TO GO FIND IS NOT A GOAL.** *** Day 7 found the DAILY
> motor (why you get up tomorrow) and days 9 and 11 found the HUNDRED-HOUR arc.
> **Nobody ever asked what you are working on THIS WEEK.**

## THE EVIDENCE, AND IT IS UNUSUALLY BLUNT

Forty children, behind and uninterested in arithmetic, learning on their own
under three conditions: **proximal sub-goals** (finish one set this session), **a
distal goal** (finish it all by the last session), or "work productively". Under
proximal sub-goals they progressed rapidly, reached real mastery, and developed
**both self-efficacy and genuine interest** in a subject that had held none.

> *** **DISTAL GOALS HAD NO DEMONSTRABLE EFFECTS. Not weaker. NONE.** ***

A goal a hundred hours away does not motivate anybody.

## MEASURED FIRST, AND BOTH HALVES OF THE ROW'S CLAIM HELD

**1. The middle horizon was already built, and already hidden.** `rungRead()`
answers it exactly — your rung, how many factions are with you, and **TO BE
BACKED**, the number you still need. It lives on the STANDING card, behind
`#rungbtn`, a button you have to notice and press. Day 14's COLD HAND never
presses anything it does not need to, and neither does a person.

**2. The reckoning card said nothing about it.** Its sections were WHAT HAPPENED,
WHO YOU LET DOWN, WHO IS EXPECTING YOU TOMORROW, THE DAY. Not one word about what
you are working toward — on the last thing seen every single day.

**So nothing was designed here.** The answer the game already had was put on the
card he passes anyway.

## WHAT SHIPPED

    WHAT YOU ARE WORKING ON
      ONE MORE FACTION WITH YOU
      0 of 8 toward the city backing you

Read from `rungRead()`, **the STANDING card's own source. No second table** — two
things that both answer "where do I stand" is how they come to disagree, and this
lane already shipped one bug of exactly that shape on exactly this card
(`[drains shown]`, a side list living next to the ledger). Silent when
`rungRead()` cannot answer: a made-up target is worse than no target.

## *** AND MY FIRST CUT FAILED THE ROW'S OWN STUDY ***

Measured on the served demo, the first version read:

    8 MORE FACTIONS AND THE CITY BACKS YOU

**Eight from zero is the distal goal wearing a number** — the exact condition the
study found had *no demonstrable effect at all*. It would have shipped as a
feature that cites research it does not follow.

The ask is **ONE MORE**, every time. The climb sits underneath it as progress,
where it informs without being the thing asked of you.

**And the denominator matters as much as the ask.** The progress line counts
toward what the mandate *needs* (8), not the whole roster (16). "0 of 16" would
quietly make the goal twice as far away as it actually is.

## MUTATION PROOF

- Put the distal ask back → **1 red**, on that exact claim, naming the string.
- Hide it again → **4 red**.
- Count the whole roster instead of the mandate → **2 red**.

The gate also asserts the STANDING card still opens and still reads the **same
number**, because a middle horizon that disagrees with itself is worse than one
that is hidden.

## AND A HARNESS NOTE WORTH KEEPING

The first cut of the gate grepped `BOHEMIA_DEMO.html` for the mark and went red
on a build that was working: **the demo LOADS the city file rather than embedding
it**, so the mark is not in the demo's own bytes and never will be. The demo's
half of the claim is that it loads the city at all; everything else about the demo
is asked of the served run, which is the only honest way to ask it.

## RESULT

    THIS WEEK 15/0 (new)
