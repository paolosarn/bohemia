# THREE NAMES: RESHUFFLE ONE, TYPE ONE, PICK A SEX — ALL THREE, ON THE GLASS
# DYNASTY lane, board row [three names] / NAMED-AND-SEXED-AT-THE-START
# 9/27/26 · MODE: BUILD (both school rounds shipped) · rule 32(d)

## THE ONE LINE
**"A generated name per slot, reshuffle, or type your own; sex the same way;
no flip to an unnamed descendant" (rule 32d). All four are real now, on the
phone's own strip, and a real finger reshuffling one slot leaves the other
two exactly where they were — proven on the glass, not assumed.**

## WHAT SHIPPED
`engine/bohemia_acts.js` gained the roster mechanism [the flip] flagged as this
row's job: `roster()`, `reshuffle(act)`, `setName(act, name)`, `setSex(act, sex)`,
`resetRoster()`. The phone strip gained a reshuffle glyph on each face, wired
with the same click-only, propagation-stopped pattern [the flip]'s own round
proved a real finger reaches — no new event pattern was invented, because that
round's whole lesson was that an untested one silently does nothing.

Shot before and after on the real map, through the one driver:

    BEFORE   Reyna (NOW) · Ezekiel (+35Y) · Perla (+70Y)
    AFTER    Guadalupe (NOW, typed) · Araceli (+35Y, reshuffled) · Jonah (+70Y, sex set to male)

`slices/vote/DYNASTY_THREE_NAMES_RESHUFFLE_9_27.png`

## SEX IS THE PICK; THE NAME FOLLOWS IT
Measured against the library (Battle Brothers generates a recruit's sex first
and hands you a name that fits it — the tavern never pairs them wrong): a
prepared slot derives its sex from its own hash first, then tries up to five
name sub-salts for one whose reading agrees, and only falls through to a plain
pick if none does. Checked on the real bank: 87 of 90 given names read
male/female cleanly; 3 (Juniper, Kai, Sunny) read `either` and are a legal
fallback, never a forced guess.

**A typed name is never overruled by a later sex choice.** `setSex` retires a
merely-prepared name that no longer agrees with the new sex (so the next read
derives a fresh one) but leaves a player-typed name completely alone — he can
name a son Guadalupe if he wants to, because MECHANISM-MINE/CONTENTS-PAOLO'S
means this file suggests, it never corrects him.

## RESHUFFLE IS PER SLOT, NOT PER TRIO
Battle Brothers rerolls the one recruit you point at, never the whole tavern.
The first design this lane shipped ([the flip], 9/24) used one shared salt for
all three, which was never actually tested against "reshuffle" meaning one at
a time — it just hadn't been asked to yet. Rebuilt as per-slot state living in
the module (`SLOT_SALT`, one per act), same pattern `CURRENT` already uses, so
a screen reads the truth without carrying salts of its own.

Measured on the real glass, with a real finger on the reshuffle glyph:

    slot 2 before -> after:  Ezekiel -> Araceli
    slot 1 (untouched):      Reyna -> Reyna       (held)
    slot 3 (untouched):      Perla -> Perla        (held)

## WHAT THIS ROUND FOUND AND DID NOT FIX, SAID PLAINLY
**The face does not change when the name does.** `ctFaceAsk('act' + slot)` keys
the face cache on the SLOT NUMBER, a fixed string, never on who is actually in
it — inherited from [the flip], which called this the honest placeholder for a
reason: "the faces on the phone stay dark" only guards against an UNNAMED
descendant, and rolling one face per slot forever was the simplest way to
guarantee that. Reshuffling or typing a new name over a slot today changes the
name and the sex and leaves the face exactly where it was, visible in the vote
picture itself rather than hidden by a lucky crop. Fixing it properly means the
face has to derive from the descendant's own identity (name + sex + heredity),
which is CHARACTER's and PORTRAIT's heredity work, not a second face-rolling
idea built here to paper over the gap.

## THE GATE — `gates/three_names_gate.js`, 31 passed / 0 failed
Registered as **THREE NAMES**. Nineteen legs without a browser (every slot
named and sexed from the first frame; a prepared name agrees with its sex
where the bank has one that does; reshuffling one slot changes only that slot,
proven against its neighbours twice; a bad act is refused; an empty or
oversized typed name is refused and the prior name survives; a typed name
survives another slot's reshuffle; a typed name survives a later sex choice;
a sex choice on a non-typed slot re-derives a name that agrees; `resetRoster`
returns to `prepare()`'s own answer) and twelve on the glass with a real
finger (three names shown; the glyph is thumb-sized; nothing in the shell
covers it; the tap reshuffles the tapped slot and only that slot, on the real
DOM; the tap does not also flip him).

## PRE-PUSH PASS
THREE NAMES 31/0. THE FLIP re-run whole, unchanged: 23/0 (the mechanism this
row extended did not regress the row before it). INLINED-FRESH 3/0 (140
modules, `bohemia_acts.js` re-synced). No other file touched.

## ROUTED
- **CHARACTER / PORTRAIT**: the face-per-slot gap above is theirs to close,
  through heredity, when that work lands — not a second placeholder here.
- **WORDS / UI**: `ctActSetName` / `ctActSetSex` are real, gated, wired
  functions with no control calling them yet. The pre-game screen ([naming
  screen], waiting on this row) can call them directly; no new API needed.
