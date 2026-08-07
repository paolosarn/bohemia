# HOW FAR THE GAME GETS IN ONE DAY — 8/6/26, PEOPLE lane

**THE BIG MISSING item 1** is the biggest thing on the eleven-month list:

> *"Every organ exists somewhere... What does NOT exist is one playable DAY: wake
> at base → pick up a quest → travel to it → resolve it → GET PAID → spend
> something → sleep, save. **The circulatory system between the organs is the
> game, and it has never once circulated.**"*

It names two blockers — quest placement `[PENDING]` and economy payout. **Those
were guessed on 7/29.** Nobody had ever attempted the day and found out where it
actually stops. A guessed blocker list is a plan built on a hunch, and this repo
has spent a week learning what that costs.

So: `tools/bohemia_game_day_probe.js` attempts the day on the surface the RUN tab
really opens, link by link, and reports where it stops.

---

## THE MEASURED DAY

| # | link | state | what was measured |
|---|---|---|---|
| 1 | **wake at base** | **OK** | `mode=human`, placed at 6205,6271, clock 08:00 |
| 2 | **pick up a quest** | **BLOCKED** | no quest symbol of any kind; the only button on screen is `TALK` |
| 3 | **travel** | **OK** | the d-pad really walks him — 6205,6271 → 6205,6263 |
| 4 | resolve — **talk** | PARTIAL | 4 people reachable, none adjacent where he wakes, 0 names earned |
| 4b | resolve — **fight** | **BLOCKED** | no combat entry point on the walked surface |
| 5 | **get paid** | **BLOCKED** | no currency of any kind exists here |
| 6 | **spend something** | **BLOCKED** | nothing to spend |
| 7 | **sleep, save** | PARTIAL | saving works (`ctSave`, `tpSave`, `applyRestore`); **sleep-to-end-the-day does not exist** |

    OK 2 | PARTIAL 2 | BLOCKED 4
    THE FIRST THING THAT STOPS THE DAY: picking up a quest.

**You can wake up and you can walk. That is the game today.** If you walk to
someone you can talk to them. Then it stops.

### The 7/29 guess was half right and missed two things

It named quests and economy. Both confirmed. It did **not** know that **combat has
no entry point** on the walked surface, or that **sleep does not end the day** —
saving works, but nothing advances you to tomorrow.

---

## THIS IS THE SAME FINDING AS THE CENSUS, FROM THE OTHER END

`BLOCKED` here means *not reachable on the surface RUN opens*. It does **not**
mean unbuilt. Today's reachability census found that `bohemia_resolve.js` (the
one-button verb system), the quest runtime and parser, and the whole combat
bridge are all **finished and shipping into `BOHEMIA_RUN_CURRENT.html`** — the
file the alpha loads and never displays.

> **The organs are built. They are in the other file.** The census counted 22
> such things this morning; this probe is what that costs when you try to play.

Two independent instruments, opposite directions, same conclusion. That is worth
more than either alone.

---

## THE INSTRUMENT LIED TO ME THREE TIMES FIRST

Recorded because the failure is more instructive than the result.

**v1** scanned `window` for words and reported six PARTIALs and the verdict
*"nothing — it circulates."* Every match was a browser built-in:

    /quest/i  matched  XMLHttpRequest, PaymentRequest
    /dial/i   matched  SVGRadialGradientElement, HTMLDialogElement
    /scrip/i  matched  TrustedScript, SVGScriptElement
    /cap/i    matched  escape, MediaCapabilities

**A checker that cannot tell a mention from a use is the broken one** (Paolo 8/1)
— and I wrote one *into a probe about this exact disease*, an hour after shipping
a gate against it.

**v2** subtracted a blank page's globals. Still wrong: the game runs in an
**iframe**, which exposes a different set, so `PaymentRequest` and
`showSaveFilePicker` survived.

**v3** used a blank *iframe* as the control. Still wrong.

**v4** stopped trying to discover systems by name at all and asked for the
**specific symbols a player's verbs would use**. That is the version above.

The lesson is the one this repo keeps paying for: **names are a dialect.** Three
rounds of tuning a word search could not fix a word search. The fix was a
different instrument, not a better regex.

---

## WHAT THIS DOES NOT DO

**It does not fix the loop.** That is the RUN lane's charter and it is genuinely
blocked on rulings Paolo has not made. What this replaces is a *guessed* blocker
list with a *measured, ordered* one, so whoever takes item 1 starts from evidence:

1. **A quest you can pick up** — nothing on the walked surface offers one
2. **Sleep that ends the day** — save exists, the day never advances
3. **A currency that can be paid out** — none exists on this surface
4. **A way into combat** — the dial is built, nothing reaches it

Re-run any time: `node tools/bohemia_game_day_probe.js`
