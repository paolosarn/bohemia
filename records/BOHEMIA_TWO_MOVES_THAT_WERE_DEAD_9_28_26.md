# TWO MOVES THAT WERE DEAD, AND A FIX I STOPPED (ANIMATION, [small clips] round three, 9/28/26)

## 0. THE ROUND CHANGED UNDER ITSELF
It started as "the fight clips at one cell". Halfway through, Paolo's third votes landed
(rule 37) and KILLED THE ONE-CELL SPRITE: "I don't wanna treat a whole new character...
not some Atari bullshit." What shipped is measured at the full-detail 112 body; what only
made sense small is in the graveyard (records/BOHEMIA_GRAVEYARD_THE_ONE_CELL_SPRITE_9_28_26.md).

## 1. MY OWN CLAIM, TESTED FIRST, WAS WRONG
Last round's school page said a hit cannot carry readable pictures at one cell. Tested at
28 px: punch-heavy moved 47-86% of the body, bat-arc 56-93%, the walk 42-73%. Reasoned
from Battle Brothers' sprite, never checked against our pixels. The size is dead anyway;
the page carries a SUPERSEDED note saying both things.

## 2. WHAT SHIPPED: TWO MOVES THAT WERE DEAD, AT FULL SIZE
    brace      BEFORE 2 pictures on 7 of 8 facings, 1% of the body facing you
               AFTER  9-12 pictures, 62-83% of the body
    shadowbox  BEFORE 30% facing you, the arm doing all of it
               AFTER  63-78% on every facing, 68% facing you
brace was one arm flex of 0.3 on an arm already held at 1.2, on a frozen stance, with every
body term spF(d), zero on N and S. A brace is not a hold: plant, drop the weight, tighten,
reset, twice a bar, as a cycle so it loops with no snap. shadowbox: the body throws the jab,
and facing you the arm comes AT the camera (armCompress), the shape shiv-jab got on 9/24.

## 3. WHAT I FOUND AND DID NOT SHIP, AND WHY I STOPPED
THE KEY PICKER THROWS AWAY THE REMAINDER OF ITS ARC. poseHoldResolve picks each clip's twelve
key poses by equal arc length, and after placing a key it does `acc = 0`. A bucket carrying
five gaps of travel marks ONE key and drops four, so THE FASTER A CLIP MOVES THE FEWER KEYS
IT GETS: walk 8 of 12, run 8, dig 6, shadowbox facing you 3.
THREE REPAIRS, ALL MEASURED:
  v1 carry the remainder         95 of 103 clips richer, walk/run 8 -> 12
                                 COAT POPS 25.1% facing you (ceiling 22, main 19)
  (the head-on leg lift swept 0.09/0.07/0.05/0.03: the pop stayed 25.1% every time, so it
   was never the lift -- it was where the picker put its last key before the loop seam)
  v2 each key on the NEAREST bucket  coat 23.2%, and brace/shadowbox fell under their floors
THE THIRD ATTEMPT WAS THE STOP. STOP PRODUCING names the tell: a fourth version means you
already failed. The picker is byte-for-byte main's. The trenchcoat is tied to the thighs, so
it is the thing that tells you a key placement is uneven; the per-pair numbers facing you,
v1 against main, put the whole difference on ONE pair at the loop seam (22 -> 23: 25% vs
19%), which is where the next round starts.

## 4. THE COST CONTROL I GOT WRONG, KEPT BECAUSE IT IS RIGHT NOW
My first cost check watched only the holds, and a mutation that makes the picker GREEDY
(every bucket a key) passed it, because pistol barely changes whatever you do to key
placement. Measured, that mutation doubles 101 of 103 clips (walk 12 -> 24). The gate now
has a ceiling on EVERYBODY: 18 pictures a clip, 8,000 for the cast (5,840 today).
A CONTROL THAT ONLY WATCHES THE CHEAP THINGS IS NOT A COST CONTROL.

## 5. RE-AIMED, NOT LEFT LYING
- The round-one gate measured at CELL = 28; now 112. Its "the count at 28 equals the count
  at 112" became 112 against 112 and could not fail, so it was DELETED.
- The round-two VOTE page showed the one-cell sprite at 4x; re-cut at full size before he
  votes on it, and its registry row reworded, that row only.
- The round-one page is marked KILLED on its face; his verdict points at it.
- And my own regex, deleting the school-page claim while re-aiming this gate, ate the
  "the item plays" claim next to it. Caught because the pass count was one short of the
  lines printed. Restored.

## 6. STILL OPEN
punch-heavy moves 38% of the body facing you and throw 34%, against the walk's 43%: the
head-on family, for [facing you]. And the key picker, above.

## 7. PROOF
gates/the_brace_and_the_shadowbox_move_gate.js (BRACE AND SHADOWBOX), 9 claims; mutations:
the old brace (caught), the greedy picker (caught by the ceiling). It prints the key
picker's starved clips every run and claims nothing about them.
gates/the_walk_has_four_pictures_at_one_cell_gate.js re-aimed at 112, 13 claims, the
tired-walk mutation re-checked at full size and caught.
VOTE: animation-two-moves-that-were-dead-9-28, twelve poses a bar, before beside after.

## 8. ANALOG HORROR LINE (rule 30)
A man who does not move while he braces for a hit is a sprite that has stopped updating:
one wrong thing in an ordinary frame, and nobody would say why.
