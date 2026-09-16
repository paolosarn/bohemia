# THE SHAPE IS FROZEN (CHARACTER lane, 9/16/26)

VAMILY `[shape frozen]` / THE-SILHOUETTE-HASH-BECOMES-A-GATE.

> **THE ROW (coordinator 9/13):** *"r2 proved 'no silhouette moved' by hashing all 13
> faction silhouettes with colour discarded against a baseline, and that hasher is what
> caught a count=1 replace stripping the Anarchists' duster. It is the best instrument
> this lane has and **it runs only when somebody remembers.** Make it a registered gate:
> any colour or ramp change that moves a silhouette is red unless the baseline is re-baked
> in the same commit with a record saying why."*

## WHY THIS LAW NEEDED A MACHINE, IN THIS LANE'S OWN RECENT HISTORY

STRUCTURE-NOT-COLOR (7/19) says the ramp may move and the shape may not. It had no gate
over the wardrobe. Three things this lane did in the last week all leaned on it:

- **9/12**, a `count=1` python replace silently stripped `,outer:'SPLIT-TAIL DUSTER'` off
  the Anarchists. The hasher caught it. Nothing else would have.
- **9/12**, "no silhouette moved" was asserted across a colour rewire — true, and proven
  only because somebody chose to run the hasher that day.
- **9/15**, last round, I renamed four garments COPPER -> PATINA and wrote that *"a rename
  moves zero pixels, by construction"*. **That was true and I could not have proven it.**
  The next colour repair will not be a rename.

Three uses, three different people remembering. That is not a law, it is a habit.

## THE ROW SAYS THIRTEEN AND THE SURFACE IS THREE HUNDRED AND EIGHTEEN

Rule 12: a dependency is a premise, not a gate. A faction outfit is four or five garments
worn together. **The thing a colour or ramp change actually touches is a GARMENT**, and
there are 318 canon ones. Freezing only the thirteen combinations:

- leaves every garment no faction happens to wear completely unguarded, and
- cannot say WHICH garment moved when a combination changes.

So the baseline is per GARMENT. The thirteen outfits are kept as well, because they are
what the street actually wears and a combination can break in ways its parts do not.

    frozen   318 garment silhouettes
             13 faction outfits

## WHAT IS HASHED, AND WHY IT IS BLIND ON PURPOSE

**The opaque mask, and nothing else.** Every painted pixel becomes a 1 and colour is thrown
away entirely. So a ramp change is *invisible* to this instrument and a shape change cannot
hide behind one — which is exactly what the law needs, because the law permits one of those
two and forbids the other. An instrument that saw colour would go red on every legal repair
and get switched off inside a week.

**The pixel count is stored beside the hash**, because a hash alone says "different" and
nothing else. The count is the difference between a one-pixel nudge and a lost duster.

## THE STABILITY CHECK, ASKED RATHER THAN ASSUMED

A baseline built on a number that wobbles between renders is a gate that cries wolf, and
this lane published two instruments in the last week whose answer changed with the
arithmetic. So the baker re-shoots the first garment after the whole sweep, with every
cache cleared in between, and **refuses to write a baseline at all if the hash moved.**
Measured on this bake: stable.

## HOW THE BASELINE IS ALLOWED TO MOVE

The row's own words: red *"unless the baseline is re-baked in the same commit with a record
saying why"*. Both halves are enforced by the machine rather than by discipline:

- `tools/bohemia_freeze_the_silhouettes.js` **refuses to run** without a reason and a
  record path, and refuses if that record is not on disk.
- `gates/shape_frozen_gate.js` **refuses a baseline** whose reason is empty or whose record
  is missing, so a lane cannot bake a silent one by editing the JSON by hand either.

A shape may change. It may not change *quietly*.

## WHAT THIS DOES NOT DO

It does not judge whether a shape is good — that is DIRECTION against the style card. It
does not stop a shape changing. It stops a shape changing **without anybody noticing**,
which is the failure mode all three of the cases above share.
