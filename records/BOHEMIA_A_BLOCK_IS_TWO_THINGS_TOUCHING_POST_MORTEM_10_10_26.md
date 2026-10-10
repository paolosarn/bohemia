# POST-MORTEM: A BLOCK IS TWO THINGS TOUCHING (SOUNDS, 10/10)
## He was not tired of wood and metal. He was tired of hearing the SAME two things touching three times in a row.

> **PAOLO 10/10, HIS EIGHTH VOTES, THE SAME BATCH:**
> *"Bro, this wood glass bottle sound effect shit has got to stop bro"* -- DOWN on
> `sounds-a-block-is-two-things-touching-10-10`
>
> **IN THE SAME BATCH, NO NOTE, STRAIGHT UP:** `sounds-the-bars-glass-10-10` (the
> same wood-counter-plus-struck-material construction) and `sounds-something-here-
> still-works-10-10` (a different construction entirely, the first sidechain duck
> in this file).

## 1. THIS IS NOT A BAN ON THE CONSTRUCTION. IT IS FATIGUE, AND IT IS MEASURABLE.

Three sounds shipped this lane across three rounds used the exact same shape --
`objectSetDown` on boards (wood) summed flat with `struckMetal`'s ring (a second
material) at a fixed ratio:

    canOnWood      (10/5)   wood 0.70  +  struckMetal 'pipe'  740 Hz  0.55
    barGlassDown    (10/10)  wood 0.65  +  struckMetal 'glass' 650 Hz  0.60   UP
    weaponBlock     (10/10)  wood 0.60  +  struckMetal 'pipe'  1700 Hz 0.65   DOWN

The one he killed and the one he kept in the SAME sitting share the identical
sum shape, the identical helper calls, the identical ratio arithmetic. What
differs is the ring: glass's single clean partial (STRIKE's only one-partial
entry) is audibly its own thing against a tumbler; the pipe mode at 1700 Hz is
the SAME inharmonic metal stack `canOnWood` already used at 740 Hz, just moved
up. **Two of three "different" sounds were the same bell rung at a different
pitch, wearing a different name.** He heard that, not a recipe ban.

The comment already written into `weaponBlock` at build time said this round's
own risk out loud before he voted: *"canOnWood's own construction, a third
time."* Third time was one too many without a new partial signature to tell it
apart by ear.

## 2. THE REAL LESSON: REUSE-FIRST IS RIGHT ABOUT MATERIAL, NOT ABOUT IDENTITY

REUSE-FIRST says do not invent new ground math or a new table entry when an
existing one is physically correct for the job -- and every one of these three
sounds IS physically correct: a blade's edge really is wood-and-metal, a can
really does ring like thin pipe, a glass really does ring like a single mode.
Correctness was never the complaint.

What REUSE-FIRST does not excuse is shipping the SAME audible signature three
times and calling each one a new sound. Glass survived because its one-partial
ring is a genuinely distinct timbre from the inharmonic pipe stack. Block did
not, because a pipe mode at 1700 Hz reads as the same metal character as a pipe
mode at 740 Hz with the wood underneath doing the rest of the work either way.
**Going forward in this lane: a composite built from objectSetDown plus
struckMetal needs a ring with a different partial character than the last one
shipped, not just a different f0 on the same table entry, or it does not clear
the "is this actually new" bar before it reaches him.**

## 3. GRAVEYARD IS FINAL -- AND THIS IS THE SECOND DEATH FOR "BLOCK"

`sounds-a-block-is-two-things-touching-10-10` is dead. It is never rebuilt
under this id, never re-presented under a new id with the same construction
(wood plus a pipe-mode ring) unless the ring is a genuinely different material
signature, and never quietly re-surfaced as a default while judgment is
pending.

This is the SECOND kill for a parry sound. The ORIGINAL `block` id (the keep/
redo list's own frozen entry, `records/BOHEMIA_THE_KEEP_REDO_LIST_9_24_26.md`
3b) was already graveyarded in `[not sand]`'s 9/24 sweep at 0.289% energy above
4 kHz -- a dull filtered thud with no real top end. This round's replacement
fixed that physics (28.58% above 4 kHz, a real bright click) and still died,
for a different reason: it was correct and it was boring in context, the third
instance of a construction the room had just heard twice.

A THIRD attempt at a parry sound, whenever one is made, needs either: a
genuinely different metal signature (not another pipe-mode entry), or a
construction outside the wood-plus-ring family entirely (closer to the
sidechain-duck technique `sounds-something-here-still-works-10-10` just proved
out and he rewarded).

## 4. WHAT THIS DOES NOT TOUCH

    the bar's glass                 LIVE AS APPROVED, nothing about this kill
                                     touches it; his UP stands, unchanged
    canOnWood                       already shipped and approved earlier;
                                     not re-judged, not re-opened
    the construction technique      NOT banned. REUSE-FIRST on objectSetDown
    itself                          and struckMetal stays correct; the bar is
                                     now higher on AUDIBLE distinctness, not on
                                     physics
    hit / melee_hit                 still named, not built (weapon or bullet on
                                     a BODY, flesh and cloth, a different
                                     material from anything in this post-mortem)

## 5. ROUTED

No new table entry, no new gate claim needed: `weaponBlock` and its id stay in
the module and the registry exactly as they are, dead and frozen, for the
record. SOUNDS' own standing MODE (10/10, "the best sounds of all time... impress
me") already points away from this: the next construction this lane reaches
for is a new technique in the sidechain/time-varying family, not another flat
sum off the same two helpers.

```json
{"card":"POSTMORTEM_BLOCK_IS_TWO_THINGS_TOUCHING","date":"10/10/26",
 "kills":[{"id":"sounds-a-block-is-two-things-touching-10-10","cause":
   "third flat wood+metal-ring composite in three rounds (canOnWood, barGlassDown, weaponBlock); the pipe-mode ring at 1700 Hz read as the same metal character as canOnWood's own pipe mode at 740 Hz, not a new sound",
   "contrast":"barGlassDown (same round, same construction family) went UP because glass's single partial is an audibly distinct signature; legendaryFind (same round, different construction) went UP for being genuinely new",
   "ruling":"REUSE-FIRST stays correct on material/physics; a new composite from objectSetDown+struckMetal now also needs an audibly distinct ring signature from the last one shipped, not just a new f0 on the same table entry",
   "graveyard":"second death for a parry/block sound (first: the original frozen block id, 9/24, [not sand], 0.289% above 4kHz); never rebuilt under this id or this exact construction"}],
 "routed":{"SOUNDS":"next parry attempt, if any, uses a different metal signature or a non-wood-ring construction entirely"}}
```
