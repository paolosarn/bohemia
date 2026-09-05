# BOHEMIA LAW -- COMPARE EVERY PIECE OF ART TO THE WORLD BEFORE CALLING IT DONE
# (Paolo 9/4/26, LOCKED)
# "anytime there's ever any art made I need you to think OK I need to compare
# this work of art to other similar works of art online and I am not going
# to say something is done until it looks and resembles what I saw online of
# other art and pixels... if I'm comparing a district to another district for
# another city builder game or whatever pixel game and it looks like there's
# windows floating where they shouldn't be, there's walls where they
# shouldn't be... I don't need you to be taking aesthetic liberties, shots in
# the dark. Every time you make a piece of art you have to compare it to
# something online... make that a law... having our own aesthetic is
# important but man, when it comes to buildings or anything else."

## THE LAW
1. **NO PIECE OF ART IS DONE UNTIL IT HAS BEEN COMPARED, SIDE BY SIDE, TO
   REAL WORK ONLINE OF THE SAME KIND.** A district against districts in
   the best pixel city-builders and pixel games; a building against real
   buildings of its type and the best pixel buildings; a garment against
   the runway houses he named and the best pixel wardrobes; a haircut, a
   face, a walk cycle, a prop, a tile: the same. "Something online" is
   the bar, and it is measured, not felt.
2. **STRUCTURE COMES FROM REFERENCE. STYLE COMES FROM US.** The runway law
   (9/4) and the 45-degree law still give the LOOK; this law gives the
   BONES: windows sit in a wall plane, a wall meets a roof, a door is on
   the ground, a street meets a curb, a shoulder joins a torso. A cook
   that has the look and the wrong bones is not done. No aesthetic
   liberties on structure. No shots in the dark.
3. **EVERY COOK CARRIES A REFERENCE CHECK.** The same shape as the
   REUSE-FIRST law's `REUSE CHECK:` (7/22): every tool that cooks pixels
   documents, in its module docstring, a `REFERENCE CHECK:` naming what it
   was compared against (the source, the kind of work), which structural
   rules were taken from it in plain words, and what was changed because
   of the comparison. A check that names nothing is a violation. A check
   that names something the tool never actually looked at is a lie.
4. **THE REFERENCE SITS BESIDE THE CANDIDATE WHEN HE JUDGES.** Every
   judge sheet (VOTE tab, the look sheets, the district renders) shows
   the reference it was compared against next to the cook. He sees the
   comparison, not a claim about it.
5. **DIRECTION JUDGES THE COMPARISON BEFORE HE DOES.** ART cooks and
   compares; DIRECTION checks the comparison was honest and the bones
   are right; only then does it reach VOTE.
6. **THE REFERENCE SET FOR DESIGN IS UNCHANGED (8/28).** Comparing a cook
   against another game's pixels for CORRECTNESS is ordered here.
   Bringing that game's name, vocabulary or design into Bohemia is still
   banned. A REFERENCE CHECK names its source as a measurement names its
   ruler; nothing from it enters the design, the prompt or the words.
7. **GATE:** reference_check_gate sweeps every tools/*_factory.py and
   *_cook*.py for a `REFERENCE CHECK:` block, the same way
   reusefirst_gate.py sweeps for REUSE CHECK. A law without a machine gate
   is not enforced.

## WHY
The seventeen invisible hats, the windows on the wrong plane, the coats
on everybody: every one was a cook judged against itself. A cook judged
against the best work of its kind cannot drift that far without somebody
seeing it. He should never again be the first person to notice a floating
window.

## ROUTING
- ART: REFERENCE CHECK on every cook, starting now; the standing duty.
- DIRECTION: REFERENCE-BESIDE-EVERY-CANDIDATE on every judge sheet, and
  the comparison judged before VOTE.
- SHARED: reference_check_gate.
- ANIMATION, CHARACTER: the same law applies to clips, faces, garments.
