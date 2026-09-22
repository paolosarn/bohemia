# THE FACE IN THE BUBBLE IS NOT HER
9/22/26 · found by 19 QUESTS while photographing its own ask ·
**NOT THIS LANE'S SYSTEM TO FIX. Named for the lane that owns it.**

## WHAT HE WOULD SEE
Estella Gaines stops you at your own door. Her name is under her feet, her body
is a young woman in a cream top, and the little face inside her speech bubble is
a bearded man. Two different people, one id, in one picture.
Evidence: `slices/vote/QUESTS_SOMEBODY_STOPS_YOU_AT_YOUR_DOOR_9_22.png`, shot off
the alpha through the one driver.

## THE MEASUREMENT
40 people sampled on the walked street after twelve steps:

    30 of 40 carry `look`  (an index into the city's baked cast)
    36 of 40 carry `face`  (an index into the city's baked cast)

So the person the city draws ALREADY HAS A FACE, and it is a number that points
into the cast the city baked.

The bubble does not use it. It calls `ctFaceAsk(BARK.p.id)`, the shell answers
`faceFor(id)`, and `faceFor` ROLLS a face out of a hash of the id string. The
shell's own comment says so in its own hand, in the branch right beside it:

    "faceFor ROLLS a face out of a hash of the id ... Two different people, and
     ONE ID ONE WHOLE PERSON is the law that says they may not both be him."

That branch was written for the PLAYER and it fixed the player (`who === 'you'`
gets `buildSpec()`, his own built face). **Every other person in the valley still
falls through to the roll.** The law was closed for one id and left open for
sixty.

## WHAT IT BREAKS
- ONE ID, ONE WHOLE PERSON (8/27) and EVERYBODY HAS A FACE, AND IT TALKS (8/27).
- THE PORTRAIT WEARS THE HAIRCUT THE BODY IS WEARING (8/28).
- PORTRAIT's own 9/20 result, THE PORTRAIT IS THE SAME PERSON AS THE SPRITE,
  which got 0 of 200 differing — on the CHARACTER path. The city's speech
  bubble is a third renderer that path never reached.

## THE SHAPE OF THE FIX (for the owning lane, not done here)
The person carries `face`, a cast index. The bridge should hand that index
across instead of asking for a roll, so the bubble and the body come out of the
same bake. The player's branch is already the pattern: one id that is not rolled.
This is the same change for everybody else.

## WHY IT IS NAMED AND NOT FIXED HERE
The roll lives in the alpha shell's face bridge (LIFE+CITY's `[see me]`) and the
cast bake is CHARACTER's. This lane's own piece of the chain — asking for the
speaker's own id and never a second one — is already correct, which is why the
name under her feet is right in the same picture the face is wrong in.
