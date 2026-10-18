# A BLOCK IS TWO THINGS TOUCHING (SOUNDS, 10/10)

Row [not sand] (rule 32e). records/BOHEMIA_THE_KEEP_REDO_LIST_9_24_26.md 3b measured 21
of the shelf's 65 approved sounds as "hard contact with no top end" -- under 1% of their
energy above 4 kHz, against a bar set two orders of magnitude over the shelf's own
median (0.273%). Thirteen of the 21 already have real-material redos. This round takes
one of the remaining eight: `block`, measured at 0.289%.

## What a block is

The row's own criterion already defines the material question: "a boot on concrete,
brass on a floor, a magazine seating, a door against its frame: the contact is a step
change in air pressure, and a step change is broadband by definition." A block, in this
game's own melee combat, is a parry -- a blade's edge catching a shield's rim or a
weapon's haft. That is TWO HARD THINGS TOUCHING, same as every other entry on the
criterion's own list, and the two things are wood (the shield's core, a haft) and metal
(the rim binding, the blade) at once.

## The build

`canOnWood`'s own construction, a third time, and the only one of the three (after the
smith's hammer, the armourer's rivets and the bar's glass) that needed no new material
in `struckMetal`'s table at all:

- `objectSetDown(ctx, { surface: 'boards' })` -- the rim or haft's own wood contact.
  Zero new ground math.
- `struckMetal(ctx, { what: 'pipe', f0: 1700, secs: 0.15 })` -- the blade's own metal
  mode, the exact published free-free-bar series boardNail and endTurnClick already
  reuse. Zero new DSP, zero new table entry.

Held for 0.15 s, a fraction of boardNail's already-brief tack (0.05 s is the tack
itself; 0.15 s here because a parry's edge is moving across the rim rather than planted
square on it the way a tack is driven in, so slightly more of the strike's own natural
decay plays before the buffer ends) -- the real cause is the same one smithHammer
already argues for an anvil bolted to its stump, run in the other direction: a glancing
contact does not pin the blade in place the way a square hit does, so most of the energy
carries on into the follow-through instead of ringing where it struck.

## Measured against the row's own bar

`sounds-a-block-is-two-things-touching-10-10` reads 28.58% of its energy above 4 kHz --
28x over the redo list's own 1% bar, 98x over the frozen `block` id's measured 0.289%.
This is read off the exact same generic measurement every other cooked sound in this
module gets (the `for (const item of H.list())` loop's own `measure()` call), not a
bespoke ruler built to flatter this one sound.

## What stays frozen

`block` itself is untouched (GRAVEYARD IS FINAL / verdict_frozen_gate.py's own rule: a
red never re-blesses a file, it gets a new event id). This is a new id, built and
registered, not wired live -- unjudged = silent.

## What's left on the row's own list

Seven of the keep/redo list's 21 hard-contact ids remain: demolish, door_more, hit,
melee_hit, parts_pass, pickup, shot_more. `hit` and `melee_hit` are a weapon or
projectile landing on a BODY rather than on another hard object, which is a genuinely
different material question (flesh and cloth absorb almost all of a contact's energy
rather than ringing), and this round did not build that material -- said plainly rather
than reusing `struckMetal` or `footstepModelled` on a surface that was never meant to
stand in for skin.

## Gates

`gates/cooked_sounds_gate.js`: three new claims (the two materials summed; the
redo-list's own 4 kHz bar; nothing newly broken), 228/0 (was 224/0). All bite under
`--mutate`, the falsifier replacing `H.weaponBlock` directly (the same closure-trap fix
every reused wrapper in this file carries).

## VOTE

`sounds-a-block-is-two-things-touching-10-10`, draft:true, on
`slices/BOHEMIA_A_BLOCK_IS_TWO_THINGS_TOUCHING_10_10_26.html` (the block against the
bare wood contact alone, for comparison).
