# V215 — A SAVE EXISTS AT THE BELL (COMBAT lane, `[prefight save]` BB-SAVE-BEFORE-THE-BELL)

**The row:** *"THE GAME HE NAMED AUTOSAVES BEFORE EVERY BATTLE. OURS IS COVERED BY
ACCIDENT."* In Battle Brothers the fight is the moment worth protecting, and it is
protected on purpose: an autosave before every battle.

**Its ship test, in its own words:** *"a save exists at the bell **whether or not the
frame blurs**."*

---

## MEASURED TWICE BEFORE WRITING A LINE, AND IT IS WORSE THAN THE ROW THOUGHT

**Statically, the row is exactly right.** `flushState` has **four callers in the whole
walked city and all four are lifecycle events** — `pagehide`, `freeze`, `blur`,
`visibilitychange`. Nothing calls it at the bell.

**On the real surface**, driving a fight through the shipped door and counting the
save traffic that actually reaches the shell:

```
before the bell             0 saves, 0 blurs
1.5 seconds after the bell  0 saves, 0 blurs
5.5 seconds after the bell  0 saves, 0 blurs
```

> **No save landed at the bell at all — and no blur either.** The accidental
> protection the row calls *"probably saved"* did not fire once, because the frame
> never blurred.

Stated honestly: a headless browser may not deliver `blur` the way a phone does, so
this is **not** proof that every player loses the moment. It is proof that **the
protection depends on an event nobody promised**, which is the row's whole argument,
and it is why the argument stops being an argument and becomes one line of code.

## THE BUILD IS ONE CALL AT THE ONE DOOR

`cityHandOver` — the door V205 routed all four entries through, where V207 already
stamps the world and V211 already stamps the plate. **A fourth thing reusing the same
seam, so an entry built after this one is protected without knowing this exists.**

**The order is the right way round.** `flushState` posts the snapshot to the shell
**before** the encounter message goes out, and postMessage from one window is ordered,
so what gets written is **the world as it stood before the fight**.

**It is the same snapshot the debounced path writes** (`citySnapshot()`), not a second
save format to keep in step. The file learned that one the hard way already: its own
note says the emergency path used to carry a hand-copied literal that was two fields
behind and *"silently dropped the purse and the market."*

**And it is idempotent by the file's own design** — `flushState` clears the debounce
timer and posts once, and its own comment says firing three times costs nothing. A
bell that also blurs simply saves twice, which is free and correct.

## PROOF

`gates/save_before_the_bell_gate.js` — **8 passed, 0 failed.**

The gate counts **real save traffic**, not a function call: the shell's own
`bohemiaCityState` messages, which is what `CITYSAVE.save` actually runs on. And it
counts **blurs alongside**, because *"whether or not the frame blurs"* is the claim,
and a save that only happens when something blurs is the bug rather than the fix.

Measured after: a save lands at the bell with **zero blurs**, on the wire in the order
`["SAVE","ENCOUNTER"]`, on the first bell and on a second one.

Mutation-proved two ways: the bell stops saving → **4 red**; the save lands after the
encounter instead of before → **1 red**, on exactly the ordering arm.

## NOTHING ELSE MOVED

No new save format, no new key, no new timer, no change to what a snapshot contains,
and nothing about the fight. **This is the protection being written down instead of
being hoped for.**

**The demo was not re-cut** — rule 14(a).

## THE DIAL

Nothing here touches a number.

---

**Tool:** `tools/bohemia_save_before_the_bell_patch.py` (MARK
`__SAVE_BEFORE_THE_BELL__`, city slice only, replayable onto fresh main) ·
**Gate:** registered as **SAVE BEFORE THE BELL** · **Tab:** CITY into COMBAT.
