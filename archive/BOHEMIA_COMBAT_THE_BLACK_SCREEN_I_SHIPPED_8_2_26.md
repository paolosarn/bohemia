# THE BLACK SCREEN I SHIPPED (8/2/26)

Paolo, with a screenshot of a black screen and one red line:

```
ERR ReferenceError: Cannot access 'DIAL_GONE' before initialization.
```

> *"New bug cannot access dial gone before initialization. Shit got fucked."*

**Entirely mine, and it went out with 620 green checks behind it.**

---

## THE BUG, IN ONE SENTENCE

v114 declared

```js
const DIAL_GONE=(_df<=0.03);
```

immediately above the dial's band block — but the line that **uses** it,

```js
drawField(ctx,W,H,cx,cy,{dial:true,zb:zb,gone:DIAL_GONE});
```

sits about **1,500 characters earlier in the same function**. `const` has a
temporal dead zone, so reading it before its declaration is a hard
`ReferenceError`, **every frame**, and the whole demo goes black.

The fix is the one-line one: the declaration moves up to sit immediately after
`_df`, which is what it is derived from and which is already declared above the
`drawField` call. Nothing else changed. The patch tool now **refuses to write**
if the declaration still lands after any use.

---

## THE REAL FAILURE IS THAT MY GATE PASSED IT

620 combat checks green. The suite runs `node --check` on every script body in
the demo — which proves the file **parses**. A temporal dead zone error is
perfectly valid syntax. **It proves nothing about whether the thing runs.**

A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED, and *"the demo renders a frame
without throwing"* had **no gate at all**. Ten versions of drawing work in this
lane, and the one thing nobody was checking was whether `draw()` survives being
called.

### THE GATE THAT WOULD HAVE CAUGHT IT NOW EXISTS

`gates/combat_runs_smoke.js`, registered in the suite as **COMBAT RUNS**. It:

- boots the **real alpha** headless
- clicks through both splashes and opens the **real combat tab**
- drives **real frames** through every phase the dial has — cover, **AIM** (the
  path that threw), the killshot, the freeze, and after
- fails on **any** pageerror or console error

**Verified in both directions before shipping.** Against the fixed build: clean.
Against the broken build that is on main right now: **170 errors, 1 distinct**,
caught in seconds.

```
=== COMBAT RUNS SMOKE: FAILED ===
  FAIL  CONSOLE BOHEMIA frame error ReferenceError: Cannot access 'DIAL_GONE' before initialization
  (170 errors, 1 distinct) phase=aim ks=true
```

---

## WHY IT REACHED HIM AT ALL

I had a headless probe in hand all turn — I used it to prove the grenade kills,
the stairs work in roam, the high ground reads, the execution XP pays. **Every
one of those probes drove state directly and never entered the AIM phase with a
real render loop running.** The one path I did not exercise is the one that
threw. The smoke gate exercises it now, and it does so on every ship whether I
remember to or not.
