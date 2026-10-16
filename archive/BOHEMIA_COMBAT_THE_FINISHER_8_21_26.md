# THE FINISHER (v176, RF4-12 — random procs become charge-up abilities)

COMBAT lane, 8/21/26. **TAB: COMBAT.**

> *"Charge up a more impactful ability after say 10 attacks, **which takes
> something uncontrollable and gives it to the player to use tactically.**"*

Our diff: *"**the most transferable idea in this file: it converts luck into
agency**, and it costs no new UI — a counter and a ready state."*

## WHICH UNCONTROLLABLE THING — THE BIGGEST ONE IN THE FIGHT

V32's weapon-gated lethality. You dial a **perfect killshot** — the most skilful
thing in the game — and then a coin decides whether he dies or lies there at 1hp.

| weapon | chance the killshot actually kills |
|---|---|
| pistol | **0.20** |
| smg | 0.35 |
| rifle | 0.55 |
| shotgun | 1.0 |

**With a pistol, 80% of your perfect killshots leave him alive on the floor.** And
since V173 there is a medic on the lot whose entire job is standing those bodies
back up. So the most skilful thing the player can do is also the thing luck most
often takes away from him.

## WHAT SHIPS

**Every shot that connects fills a counter. At 6, the next killshot you land
skips the lethality roll.** Nothing else changes — same damage, same dial, same
odds of landing. You just get to decide which body stays down.

| 60 pistol killshots | stay down |
|---|---|
| charge empty | **10 of 60 (17%)** |
| charge full | **60 of 60 (100%)** |

**Fed by attacks, not by kills**, which is Wang's own wording and the only thing
that works at our scale: measured first, a fight runs about **12.4 turns and
drops just 2.3 bodies**, so a kill-fed charge would fire roughly never. Landed
shots are the common event, which is exactly why they are the currency — and it
is the verb the ability is *for* (RF4-13: *"the item recharges by doing the thing
the item is for"*).

**It cannot be stockpiled.** The feed returns early once ready, so a long fight
banks exactly one finisher rather than five. **And it is earned in the fight you
spend it in** — a fresh encounter starts at zero, because carrying one in would
make the first perfect shot of every fight free.

## ON THE SHOTGUN IT DOES NOTHING, AND THAT IS THE POINT

The shotgun is already 1.0 lethal by his own ruling — *"this weapon finishes the
job, no downed state"* — so a finisher there is a bonus for a problem that weapon
does not have. The charge is **kept**, not silently eaten.

**This is the exact inverse of the wide-open bonus cut the day before.** That one
paid out on *one* weapon of four, so the rule was unlearnable. This one is worth
80% of your killshots on the pistol, 65% on the smg, 45% on the rifle, and is
**redundant precisely where it is redundant** — a rule you can learn in one fight.

**NO DAMAGE BEFORE THE DIAL is untouched.** Lethality was already a boolean the
game rolled; this replaces one roll of it with something the player earned.
RF4-17, *"determinism where it counts"*, is the same idea from the other end.

## GATES

`fight_moves_you` **74 pass / 0 fail** (5 new) · `combat_lab` **907 pass / 0
fail** (6 new — and the three long-standing fails are gone, fixed by other lanes).

**Seven mutations, all caught**: never feeding, feeding on misses, never spending,
always finishing, allowing a stockpile, carrying the charge between fights, and
letting it apply to the shotgun.

One claim proves the hook is **really inside `fireNow`** rather than merely
defined beside it — a gate that calls `finisherFeed()` itself proves the function
works and says nothing about whether shooting ever reaches it. That is the same
defect that let a mutated casing call sit green back in V166.

## AND THREE OF MY OWN GATES FLAKED TODAY, ALL FOR ONE REASON

The medic's role arm (12 arenas), the anti-pull arm (30 boards of a 50% coin) and
yesterday's skill-gap chain all went red on effects they show on average. Every
time the answer was the same and it is worth writing down: **more evidence, never
a looser threshold.** The medic arm went to 28 arenas; the anti-pull arm to 60
boards *and* was restated on the stable measures of the same phenomenon —
**isolation is the effect, and a count of clean pulls is its noisiest
estimator**, so the claim now rests on men-left-ignorant and rooms-alerted, with
the pull count still printed and required not to rise.

**RF4-12 moves SPECED → BUILT.** One star, 4 of 8.
