# SHOOTING IS A TAX (8/20/26, COMBAT lane, RF4-36)

**The best strategy in this game is to never fire your weapon.** Measured, six
policies, twenty-four arenas, same seeded dice, every one driven through the
player's own `doMove`.

---

## THE ROW

RF4-36 is the last ★★★ row and the document calls it *"the most important line in
any of this"*:

> *"The game is intended to be **highly tactical and reward clever decision
> making**, game knowledge, and careful planning, drawing heavily on traditional
> rogue-like design. **Of equal importance and opposing this**, the game should
> be fast, action packed and full of crunchy, satisfying explosions."*

Our diff column says the shooter half is already real and **the decision layer is
what is missing.** So the first move was the one that worked on RF4-14: measure
whether the fight rewards decisions at all, rather than add a mechanic and hope.

## THE MEASUREMENT

| policy | shots | won | HP lost |
|---|---|---|---|
| **PACIFIST** never fires | 47 | **15 / 24** | **47** |
| **JUDGED** fires inside 4 tiles or at a bead | 146 | 12 | 64 |
| **JUDGED** fires inside 7 or at a bead | 164 | 9 | 67 |
| **RUNNER** fires whenever it can | 239 | 6 | 70 |
| **WANDERER** moves at random, shoots well | 261 | **0** | 80 |
| **CAMPER** shoots, never walks | 237 | **0** | 95 |

*(The pacifist fires the 47 shots the harness forces on it when a step is
physically blocked; its policy never chooses to shoot.)*

**It is monotonic. The more you shoot, the worse you do.**

Two things are healthy and worth saying before the defect:

- **The fight does reward decisions, hugely.** Camping wins 0 of 24 and bleeds 95
  HP. This is not a flat game; the problem is *which* choice carries the weight.
- **And it is the door, not motion.** Moving at random while shooting well also
  wins 0 of 24. His 8/15 law is that the fight has to *move* you, and this is
  what stops that reading as "wiggle and you win."

## WHY

Three shipped rules, each correct on its own, multiply into a dominant strategy:

1. **Firing spends your turn** (RF4-49, and that rule is right — it is the whole
   free-movement budget)
2. **Reaching the way out is the win** (V159, from his own ruling: *"in rogue
   fable four you have to go down the dungeon... it is a movement goal"*)
3. **Nothing on the board makes leaving harder**

So every round you fire is a turn you did not spend on the only thing that wins,
and the men you leave behind cost you nothing. **Combat is a tax paid for
nothing.** RF4-40 is the anti-dominant-ability rule — anything *"too effective in
many situations"* gets a counter, deliberately — and this is the biggest
dominant strategy in the build.

## TWO COUNTERS WERE BUILT AND BOTH WERE CUT THE SAME DAY

The obvious fix is to make the walk cost something. **Fire and movement, both
ways**: V136 gave the *enemy* fire-and-movement in June (`PRESS_FRAC=0.5`, half
the line bounds while half covers, because *"a board that slides all at once is
noise, not pressure"*). The player never had to buy his ground the same way.

| version | what it did | measured |
|---|---|---|
| **anyone who can SEE you denies your step** | | **432 refusals out of 432 steps**, six policies, **zero wins**. Being seen is the normal state of a firefight, so it was not a rule, it was a freeze. |
| **only a HELD BEAD denies your step** | narrowed to `acquired`, the red line already drawn on screen | **self-reinforcing**: being pinned stops you repositioning, which keeps you pinned. Every policy dropped to 0 wins and ~95 HP lost. |

Both were reverted. Neither shipped, **and the patch tool was deleted rather than
left in `tools/`** — a runnable script that makes the game unwinnable is a trap
for whoever finds it next, and everything worth keeping about it is on this page.
This is not a graveyard entry: the graveyard is for things Paolo killed, and he
never saw either of these. They were cut before they reached him, which is the
point. **The mechanic fights an existing ruling** —
his own — that the fight has to move you, and a rule that stops you moving is the
inverse of the law it was meant to serve.

## THE ACTUAL SHAPE OF THE PROBLEM

**A fight with exactly one currency cannot reward a second verb.**

Reaching the door is the only thing that pays. Shooting cannot compete with it
because shooting pays nothing at all. You do not fix that by making the door
harder to reach — that just makes one currency more expensive. You fix it by
making the men in the room *worth something*, which is what RF4 does with
experience, drops and a dungeon that follows you down.

**And what a fight is worth is economy, not combat.** This lane's handoff has
flagged it three times as *"the compensator is attrition across a run, which does
not exist in a standalone arena"*, and this measurement is what that sentence
looks like when you put a number on it.

## GATE

`gates/skill_gap_gate.js` — **5 pass / 0 fail**, registered, stable across runs.
It blocks on the two things that are true and must stay true (camping loses,
wandering loses) and **pins the defect as a measured fact**, in the same shape as
`civ5_gate` D4 and `top_of_the_document` T6: **it is written to go red the day
somebody fixes it**, and be rewritten then, rather than quietly becoming false.

## THREE HARNESS BUGS, EACH OF WHICH FLATTERED A DIFFERENT CONCLUSION

Kept in the gate's own comments, because the numbers are only worth what the
harness is worth:

1. **Calling `worldShift` directly** walked straight past the player's own door —
   the spotter pin, the stamina check, the phase test. It reported a pacifist
   winning 20 of 24 in a game where nobody can move like that.
2. **Walking the straight line at the exit** put the walker's face against the
   first rock and left it there: 5 good steps, then 13 refusals. That reads as
   *"the way out is hard to reach"* and was really *"this harness cannot walk
   around a pillar."* A player steps around, so the policy now ranks all eight
   directions.
3. **"Shoot whenever anything is in the pool" is a strawman, not clever play.**
   Something is nearly always in the pool, so that arm never walks and then loses
   to walking. The JUDGED arms fire when a man is close or holding a bead, which
   is what a person does — and they still lose to the pacifist, which is what
   makes the finding stick.
