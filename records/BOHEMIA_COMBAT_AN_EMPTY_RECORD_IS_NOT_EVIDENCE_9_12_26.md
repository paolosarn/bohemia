# V209 — AN EMPTY STORED HAND NEVER TAKES A KEY OFF YOU (COMBAT lane)

**A fix for a bug I shipped in V206 `[loot kept]` earlier the same round, found by
another of this lane's own gates after it was already on main.**

---

## WHAT BROKE

V206 gave the shell a keeper that mirrors the fight's published key list into
`localStorage`, so the walked city could finally see what you hold. That was the
whole point of the row and it works.

**And it quietly started erasing your boss keys.**

1. Every fight's setup calls `keysLoad()`, which **replaced** `KEYS.taken` with
   whatever storage held.
2. On a fresh profile that key had **never been written**, so the read returned
   null, the branch was skipped, and keys held in memory survived. That is why
   nobody had ever been bitten by step 1.
3. V206's keeper now mirrors the published list into that same key — and **the
   first thing the fight publishes on boot is an empty hand.**
4. So from then on the record said `[]`, and the next fight's setup handed back
   nothing. Three key-gated abilities — **PATCH IT, LIGHT IT, SEND HIM**, the ward,
   burn and dogs keys — dropped out of the kit.

## HOW IT WAS CAUGHT, AND WHY IT NEARLY WASN'T

`fight_moves_you_gate` went **170/0 → 168/2**, on two arms about abilities and
verbs. The headline of one of them is the defect it was written for: *"AND EVERY
VERB HAS A REAL CALLER IN A PLAYED FIGHT, WHICH THE FIRST WRITE DID NOT."*

**AND MY FIRST INSTINCT WAS WRONG: I CHECKED WHETHER IT WAS MINE AND CONCLUDED IT
WAS NOT.** The comparison ran the gate without `[guns close]` — the row I was
holding — and it read 168/2 there too, so I called it pre-existing. It took a
second baseline, all the way back to the slices from **before any of my three rows
this round**, to read 170/0 and prove one of mine had done it. Then the tree with
only `[loot kept]` read 168/2 and named it.

> **A baseline that only goes back one commit answers a different question than the
> one you asked.**

**AND THE MEASUREMENT AFTER THAT WAS ONE PROBE, NOT A THEORY.** I had three guesses
(a name collision, a second accuracy system, an unfinished wire) and all three were
wrong. The probe staged the three keys into `KEYS.taken`, ran the shipped
`setupCombat()`, and read them back: **an empty array.** That single line settled
it.

## HOW I SHIPPED IT, WRITTEN DOWN BECAUSE THE LESSON IS THE USEFUL PART

My lane pass for V206 ran the loot gate, the zoom gate, the entry gate, the lab
gate, the demo build and the blob integrity — **and not `fight_moves_you`, because I
had run it the round before and it was 170/0.**

> **A GATE YOU RAN LAST ROUND IS NOT A GATE YOU RAN.** The bug was in the one I
> skipped.

## THE GUARD IS THE RULE, NOT THE SYMPTOM, AT BOTH ENDS

| | |
|---|---|
| **the fight** | loading is for RESTORING a hand, never for emptying one. If the record says nothing and you are holding something, **the record is the thing that is behind.** |
| **the shell** | it never writes an empty hand over a real one, because **the cheapest place to not lose something is to not write the loss down.** |

Either guard alone fixes today's bug. Both are here because they are two different
mistakes: one trusts a stale record, the other creates one.

It gets its own tool, `tools/bohemia_keys_guard_patch.py`, because V206 is already
shipped and its own mark makes it idempotent — a repair has to be able to land on a
build that already carries the thing it repairs. Applied twice in a row on purpose:
the second run reports both halves already guarded and changes nothing.

## AFTER

```
  fight_moves_you_gate   168 / 2   ->   170 / 0
```

## `NO DAMAGE BEFORE THE DIAL`

Nothing here touches a number. It stops a key from being forgotten.
