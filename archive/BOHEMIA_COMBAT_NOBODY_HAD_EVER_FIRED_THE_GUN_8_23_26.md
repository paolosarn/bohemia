# NOBODY HAD EVER FIRED THE GUN (v178)

COMBAT lane, 8/23/26. **TAB: COMBAT.**

**Every combat test in this repo reaches the fight by calling `applyDamage`
directly — which skips `fireNow` entirely.** So the dial, V32's lethality coin,
the downed state and V176's own charge feed had **never once been exercised by a
test.** Not under-tested. Never touched.

That was fine until a feature depended on them.

## THE CHECK THAT STARTED IT

Twice in three days a shipped mechanic turned out to be unreachable — V152's
cover-chewing waited on a condition its own geometry forbade, and shooting a car
had no door at all. Both looked correct in the source. So before building
anything new: **play 40 fights and collect every line the game actually says.**

| shipped this week | times it spoke in 544 turns |
|---|---|
| V175 the first-sight yell | **27** |
| V177 cover knocked down / destroyed | **4 / 2** |
| V173 the medic | **0** |
| V176 the finisher | **0** |

The medic and the finisher were silent — and the reason was the harness, not the
game: **a test that calls `applyDamage` never produces a downed man and never
feeds the charge**, because both live behind `fireNow`.

## SO THE BUTTONS GOT PRESSED

Driving the real ENGAGE and FIRE controls through Playwright — the first time
anything here has pulled the trigger:

- the charge climbed **0 → 1 → 2**, so the feed is genuinely wired
- a killshot produced a genuinely **downed** man, so the coin is genuinely rolling
- **and a three-man fight took 11 shots to clear and earned 5 charge of the 6 required**

**`FINISH_AT` was 6. The finisher never became available, and never would have.**
`ENC_WEIGHTS` puts 65% of encounters at three or four men, so the ability shipped
the day before was **absent from most fights he plays.**

**A dead dial by a different route than `MEDIC_SHY`:** not a term that changes
nothing, but a threshold nobody can reach.

## WHAT CHANGES

**`FINISH_AT` 6 → 4.** One number. Four landed shots is still most of a small
fight, and a small fight earns five. Nothing else about V176 moves.

**And the gate changes with it, which matters more than the number.** There is
now an arm that **fires the actual weapon** and watches the charge climb, the
readouts fire and the body stay dead. Verified: *"FINISHER READY"* and *"THAT ONE
STAYS DOWN"* both announce, and the shot taken with the charge full turns a
standing man into a **dead** one rather than a downed one.

**A threshold can only be checked by a test that can reach it.**

## FOUR THINGS THE NEW ARM GOT WRONG FIRST

Kept because the arm is only worth what its own correctness is worth:

1. **It asserted the charge was *seen* at the threshold** — which can never
   happen, because the shot that reaches it spends it in the same breath. The
   feature was working and the claim was measuring a value that does not exist.
2. **It refreshed the board with `setupCombat`** to get more targets — and that
   calls `resetFightState`, which **zeroes the charge**. It wiped the very thing
   it was measuring, and read 0 after 26 shots. It now stands the same bodies
   back up instead.
3. **It left `numEnemies` pinned at 3 and the encounter curve off**, and every
   later arm reads both — which starved the breacher out of all 30 rosters and
   failed three V177 claims that had nothing to do with it. **An arm that mutates
   shared state has to put it back.**
4. **Fourteen shots was not enough.** A headless click lands at an arbitrary
   point in the dial's rotation, so a good share miss; the arm read peak 2 on one
   run and a clean spend on the next. Thirty shots, three green runs. **Fourth
   time this session the answer was the same: more evidence, never a looser
   threshold.**

## GATES

`fight_moves_you` **81 pass / 0 fail** (2 new, both on the real fire path) ·
`combat_lab` 913 / 0 · `skill_gap` 6 / 0.

## AND THE MEDIC IS FINE

With real downed men on the board, *"HE GETS HIM BACK UP"* fires **80-97 times
across 20 fights.** Its silence in the first sweep was the harness's, not his.
