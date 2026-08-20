# A WIRE TO THE WRONG SURFACE IS NOT A WIRE (8/20/26, FACTIONS lane)

**For every lane.** This is the seventh and eighth instance in one week of a
single bug shape, and the first two found by **sweeping for it on purpose**
instead of tripping over it. The sweep takes about a minute and any lane can run
it against its own modules.

---

## 1. THE SHAPE

> **An organ computes something and nothing on the walked surface calls it.**

Seven previous instances in this lane alone: `give()` (the wall was a sign, not a
fence), the favour nobody collected, the cost that cost nothing, the ladder with
no rungs, `neglectFor`, the count that was asked to remember, `askOutcome`.

The SFX lane found the same shape the same week and named it the same way: *"a
cook without a caller is not a shipped sound. It is a candidate on a sheet."*

**It never shows up as a crash.** The organ is correct, its unit test is green,
its gate is green, and the feature simply does not exist for the player. That is
why it survives: **everything about it looks fine except the one thing nobody
checked.**

---

## 2. THE SWEEP

For every function a module exports, count its call sites in three places:

```
1. THE WALKED SURFACE     the page he actually plays
2. ANOTHER ENGINE MODULE  reached indirectly, still reached
3. ONLY A GATE OR A TOOL  it exists for the machine, not the game
```

Anything with **zero in all three** is an organ with no body. Run against this
lane's six modules on 8/20:

```
TOTAL 61 exported functions
  on the surface .................. 30
  gate or tool only ................ 8
  nothing anywhere ................ 23   <- of which most are internal helpers
```

The 23 needs one more filter: a helper called by **its own module** is fine.
Count definition-line-only and you get the real orphans. There were four:

```
BohemiaCommitment.tertius       definition only, 4 copies, 0 call sites
BohemiaTies.overheardFrom       definition only, 5 copies, 0 call sites
BohemiaTies.onwardFrom          definition only, 5 copies, 0 call sites
BohemiaIntros.askOutcome        0 callers on the surface
```

### THE BLIND SPOT THAT ALMOST MADE IT A FALSE FINDING

The first version of the sweep reported **`BohemiaTies`: 10 functions, 0 called**
— an entire module with no callers. That would have been a great finding and it
was **wrong**. The module is handed to another organ **as a value**:

```js
BohemiaCommitment.whoHears(fid, roster, cell, { ties: BohemiaTies, keyOf: ctVKey })
```

so its methods are called under another name and a textual `Global.fn(` count
cannot see them. **A sweep that cannot tell an injected module from a dead one is
the broken thing, not the module.** Checked before claiming; this repo has a
standing law about exactly that (*fix the ruler, never the target*), and a lane
that ships a false finding spends the next turn undoing it.

The second version cuts the inlined module bodies out of the page first (a call
inside an inlined module is not a call **from** the surface), and flags any module
that is passed as a value so its count is never read as proof of death.

---

## 3. WHAT IT FOUND, AND THE PART THAT MATTERS TO EVERYBODY

`BohemiaIntros.earned()` switches on **eight** conditions. The city filled one:

```js
var iSt = { asked: CT_MET.asked(who.key) };
```

Five of the sixteen factions therefore could never get past the first rung of
their own dossier's mechanic — the single most specific thing written about each
of them.

**And four of the five wires already existed.** `engine/bohemia_ties.js` was built
on 8/12 *specifically* to answer three of them. `answerFor()` shipped 8/11. The
ledger grew its `honest` / `answered` / `lied` bits on 8/13. All of it was wired —
**to `BOHEMIA_RUN_SLICE_7_26_26.html`**, a surface that is not the game.

> **"IT WORKS" AND "IT WORKS WHERE HE PLAYS" ARE DIFFERENT CLAIMS, AND ONLY THE
> SECOND ONE IS THE GAME.** VERIFY ON THE REAL SURFACE (7/18) in its systems
> form: a side-door probe is a lie, and so is a wire to a side door.

**Check this before you write a new organ.** The odds that the thing you are about
to build already exists, wired to a slice nobody opens, are not small. They were
4 out of 5 here.

---

## 4. THE OTHER FINDING: MEASURE, DO NOT REASON, ABOUT PIXELS

Wiring the Mob's vouch added one row to the person card. I argued in writing that
it was **height-neutral**: `meeting().next` empties once the name is earned, so
HOW YOU GET THE REST disappears exactly when WHO PUT YOU ON appears. One row out,
one row in. It sounded airtight.

**Measured: 833px of 844. Ninety-nine percent.** Earning the name also turns the
quirk row on, so the card gains two and loses one.

> **A good argument about a measurable thing is still not a measurement.**

And the fix is worth stealing too. The tempting move was to trim three unrelated
rows until the number went green — **fitting the content to the ruler in a
different coat.** Two rules the card was already halfway to having did it
instead:

```
A DUPLICATE IS NOT DISCLOSURE            833 -> 810
  the heading BECOMES the name, so the NAME row under it repeats it verbatim
  on exactly the fullest cards. Identical defect the TRADE row was fixed for
  on 8/18, identical test.

THE HEADLINE IS LIVE, THE EXPLANATION IS THE OUTFIT'S    810 -> 734  (87%)
  ctRow('', ...) has been this card's mark for "the sentence explaining the
  row above" in four different systems, and every one of those sentences is
  identical on every member of that outfit forever -- word for word the test
  the fold already applies. They were simply outside the fold.
```

**A trim has to be re-argued every time somebody adds a row. A rule generalises.**

And the bar itself was wrong: `cardfold_gate` A1 stands next to whoever is
affiliated and **nearest**, which is almost never somebody who can be vouched for,
so the worst case sat **outside the measurement that exists to hold the card to
the phone**. A12 constructs it deliberately now.

> **A BAR THAT DOES NOT MEASURE THE WORST CASE IS NOT A BAR.**

---

## 5. WHAT IS STILL NOT WIRED, NAMED RATHER THAN FAKED

**TRADES** earns its name with `hires >= 2` and the city has no hiring. Minting
one would be inventing an economy in the exact place his dossier is most specific
(*"HIRE THEM TWICE AND THE REAL NAME ARRIVES UNPROMPTED"*). `st.hires` stays 0,
the card keeps his words, and gate **L8** names the gap instead of skipping it.
**MECHANISM-MINE / CONTENTS-PAOLO'S.**

Two more cannot fire for a **population** reason rather than a wiring one: there
is **one Remnant in the whole valley** (nobody to overhear a first name from) and
**zero Blues**. Gate **L9** states that as a claim that can actually fail — if the
graph ever produces a third party out of a one-member outfit, it goes red.

---

Law: `laws/BOHEMIA_ADDENDUM_NOBODY_EVER_WALKED_IT_8_20_26.md` (sec 4h, 4i)
Gates: `faction_arc_gate.js` 66/0 (part L) · `cardfold_gate.js` 15/0 (A12–A15)
Tab: **CITY** — walk up to somebody who runs with an outfit.
