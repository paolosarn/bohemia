# IS THE HEIGHT RANGE REAL?

CHARACTER, 10/16. [real height], HELD. Every other row on this lane's board is blocked fresh (checked reference/art_bank/character/README.md again: the runway twin is still OWED; DIRECTION's [the master rig] is still OPEN), so this round checks a claim this lane's own board has been carrying unverified for three weeks instead of inventing new work.

## THE CLAIM
The row's own text: the coordinator ruled 9/21 that the height dial should run 0.88 to 1.12 of the body (real adults vary about a third, end to end), and a 9/23 note says "HIS VOTE IS THE RULING, yes to heights... un-held for the making." Nothing on the row since then says it shipped.

## WHAT IS ACTUALLY LIVE
slices/BOHEMIA_ALPHA_0_9.html's own dial table, AMP.height, is 0.05 (+-5%), unchanged since the single commit that introduced it (checked with `git log -L` on the line: one commit, ever, no later edit). Measured live through the real rig (buildFrame, both dial extremes, the same method and the same 57 px/m scale as last round's [the body in meters]):

| dial | painted px | metres |
|---|---|---|
| height -1 (shortest) | 94 | 1.649 |
| height 0 (median) | 98 | 1.719 |
| height +1 (tallest) | 101 | 1.772 |

End to end, the dial moves the body 7.1% of its own height, about 0.123 m total spread. The approved range (0.88 to 1.12, a 24% spread) was never built; today's real spread is under half that.

## WHY IT STOPPED AT 5%, IN THE CODE'S OWN WORDS
The comment beside AMP.height says it plainly: the body already paints into the top row of its 56px frame on nine clips at the current size, and past 5% the head gets shaved off on several facings. "The honest ceiling on taller is the sprite frame itself, not taste." Someone measured that correctly once; the 9/21 ruling just never got built against it, and the row went HELD before anyone had to reconcile the two.

## WHY THIS IS NOT A JOB FOR THIS LANE RIGHT NOW
Widening AMP.height on the formula would mean editing a placeholder (rule 101c forbids it) to chase a ceiling the formula's OWN canvas size sets, for a renderer 69d28a0b already found is being replaced wholesale, not patched. A real, 24%-wide height range is a render-resolution problem, and DIRECTION's [the master rig] renders from a 3D model at whatever size the camera asks for -- it does not inherit a fixed 56px canvas, so it does not inherit this ceiling. The real fix is building the range into the new rig from the start, not squeezing more out of the old one.

## WHAT THIS HANDS OFF
When [the master rig] is built: real adult height varies about a third end to end (the original, still-correct 9/21 measurement); at this lane's own 57 px/m scale that is roughly 1.513 m to 1.926 m around a 1.719 m median. [real height] stays HELD on this lane's board: the claim it carries is false as written (never un-held in code), corrected here rather than left to mislead whoever picks it up next.

## TAB
No tab. A verification and a handoff, not a look; no pixel was drawn or changed.
