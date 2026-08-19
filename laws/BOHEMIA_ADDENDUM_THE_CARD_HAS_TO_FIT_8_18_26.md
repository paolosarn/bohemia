# BOHEMIA ADDENDUM — THE CARD HAS TO FIT ON THE PHONE (8/18/26, FACTIONS lane, LOCKED)

## 1. NOBODY OWNED THE TOTAL

Five systems write rows onto the person card now, each one shipped correctly and
each one gated: **the name** (introductions, 8/11), **the bargain** (belonging,
8/12), **the wall** (commitment, 8/15), **the claim** (8/16), **the favour**
(8/16, collected 8/18). Every one of them asked *"is my row right?"* and every one
of them was right.

**Nobody asked what the card weighed.** Measured at iPhone portrait, 844px tall:

| state | rows | pixels | screen |
|---|---|---|---|
| first meeting | 15 | 591px | 70% |
| after taking three | 17 | 640px | 76% |
| counted and owing | **22** | **808px** | **96%** |

At 96% the card **is** the phone, and the sixth system overflows it. This is a
structural consequence of the factory pattern working: independent systems, each
gated on its own correctness, sharing one finite surface nobody's gate measures.

## 2. THE RULE, AND IT IS NOT A TASTE CALL

**Nielsen 2006, progressive disclosure:** present what the immediate task needs and
defer the rest to something the reader can *choose* to open.
**Cowan 2001, the magical number 4:** the realistic working-memory limit is about
**four chunks**, not seven.

So the question for every row is: **IS THIS THE LIVE QUESTION, OR IS IT
REFERENCE?** And the answer falls out of the data, not out of my preference:

> **A FACT ABOUT THE OUTFIT BELONGS TO THE OUTFIT, NOT TO EVERY PERSON IN IT.**

`THEY WANT` / `THEY HOLD` / `PAID IN` / `WILL NOT TAKE` / `CAREFUL` are
**identical on every member of that outfit, forever**. They are the terms of the
bargain, and you read terms **once**. Re-printing them on the ninth Church member
you meet is not information, it is wallpaper with a high word count.

## 3. WHEN THEY FOLD, AND WHY IT NEEDED NO NEW DIAL

The moment you have **any standing at all** with that outfit (`gave > 0`).

That is exactly the moment you have **demonstrably already acted on their terms** —
you cannot have standing without having done the thing they wanted. So it reads off
state that already exists: **no new save field, no new dial, nothing PENDING.**

Before that, you have never seen them, and **they show in full** — you cannot have
read what you were never shown.

Result: **96% → 84%** at the busiest state the game can reach.

## 4. DEFER, NEVER DROP

The folded rows collapse to **one line that says what is behind it** and opens on
tap. Nothing is deleted, and that is the whole discipline:

> **UNREACHABLE INFORMATION IS WORSE THAN INFORMATION NOBODY NEEDS**, and it is
> this repo's own named disease — the 8/9 authored-but-unread gate was written by
> this lane, about exactly this.

So the gate proves the half a name-grep structurally cannot:

**ONE — IT MEASURES THE REAL CARD IN A REAL BROWSER** at 390×844, against a real
affiliated person, with **no stub**. A layout claim read off source code is not a
layout claim.

**TWO — IT PROVES EVERY FOLDED FACT COMES BACK ON TAP.** Turning DEFER into DROP is
the failure mode this system was one edit away from at all times, and it reds the
claim that exists for it.

**THREE — THE LIVE QUESTION IS NEVER FOLDED.** What they are asking you and where
you stand are on the card at all times. Folding a decision is not disclosure, it is
hiding the game.

**FOUR — IT RE-FOLDS ON THE NEXT CARD**, so one tap never changes the rule.

**FIVE — AND A THUMB CAN ACTUALLY HIT IT.** All nine claims above passed while the
tap target was **153×14px**. Every one of them opened the fold with `.click()` or
an element tap, which lands **dead centre, every time**. A thumb on a real phone
does not. Apple's HIG has said **44×44pt** since 2013 and Material says 48dp, for
the same physical reason: a fingertip contact patch is about 10mm.

So the whole ROW is the target now, not the underlined words — 332×46px — and the
gate measures the **box** on a real touch page and opens it with a **real tap**
rather than a synthetic click. It cost 2 percentage points of screen (84% → 86%),
which is the correct trade.

> **"THE HANDLER IS BOUND" AND "A PERSON CAN REACH IT" ARE DIFFERENT FACTS, AND
> ONLY ONE OF THEM IS THE GAME.** A synthetic click is the touch-target equivalent
> of a gate that mocks the thing it is testing. It was found by looking, so it is
> a machine claim now (A10/A11, mutation-proven).

## 5. AND ONE ROW WAS JUST A DUPLICATE

The card's **heading** is the person's trade word (`WATCH`), and a `TRADE` row
underneath repeated it **verbatim**. That is not disclosure, it is a duplicate, and
it is gone. A row that says what the row above it says costs the same pixels as a
real one.

## 6. THE STANDING JOB THIS CREATES

**EVERY LANE THAT ADDS A ROW TO A SHARED SURFACE OWNS THE TOTAL, NOT JUST THE ROW.**
The next system to write onto the person card starts by measuring it.

Tool: `tools/bohemia_city_cardfold_patch.py` · Gate: `gates/cardfold_gate.js`
Tab: **CITY** — walk up to anybody you have already helped; the outfit's terms are one line, tap it.
