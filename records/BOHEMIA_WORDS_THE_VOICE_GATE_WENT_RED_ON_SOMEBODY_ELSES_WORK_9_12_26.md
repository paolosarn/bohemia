# WORDS: THE VOICE GATE WENT RED ON SOMEBODY ELSE'S WORK, AND BOTH FAILURES ARE
# THIS GATE LYING RATHER THAN THE BUILD BREAKING
# 9/12/26, lane WORDS (words-8dqrnq). Diagnosis and a patch that is NOT APPLIED.

## WHY THIS IS NOT SHIPPED
The fix is written and tested at the data level, but **I was blocked from running
gates/voice_gate.js to verify it** (the sandbox refused the run twice). Verification
is never self-attestation in this repo, and the standing duty is never ship red. So
the gate is left exactly as it is on main and the patch is recorded here instead of
applied. It needs one run of the voice gate to land.
The patch is small and is reproduced in full at the bottom.

## WHAT HAPPENED
voice_gate went from 110 passed / 1 failed to 109 / 2 this round. Proved not mine by
running the gate on a clean worktree at origin/main: **identical, 109 / 2, same two
failures**, with my tree differing only in four markdown and board files. The cause
is QUESTS [jobs pay] (242108f), which added a payout to S01_THE_METER_READER.bq.
That edit is entirely legitimate. WORDS owns how a quest sounds, QUESTS owns what
happens in it.

## FAILURE 1: "DEMO DAY 3: the OLD line is gone" -- A FALSE RED
The check searches the built demo for dead lines that must not have survived the
voice pass. It searches the RAW file. The demo inlines the .bq sources whole,
COMMENTS INCLUDED, and a .bq comment is where this lane writes its own post-mortem
naming the line it deleted. S01 carries, in a comment:

    # ---- past, never a live transaction. This scene had FOUR: "I pay better and I
    # ---- pay now", "quiet money spends the same as loud money", "(take the money,

**The gate found "quiet money spends" inside the note that says it is dead and
called the demo red.** Nobody says it in the demo.

Measured on slices/BOHEMIA_DEMO.html:
- the other four OLD strings are absent from the raw text as well, so exactly one
  check was lying
- all five NEW strings are still found once comment lines are dropped, so the fix
  does not weaken the positive half

**AND THE SAME BUG CAN MANUFACTURE A FALSE GREEN**, which is the worse half: a NEW
line quoted in a comment would count as delivered to the demo when nobody speaks it.
Reading the demo with comment lines dropped makes this check STRICTER in both
directions. The patch adds a mutation guard so the stripper cannot quietly stop
stripping.

## FAILURE 2: "WORDS ONLY: every structural line is byte-identical" -- A CLAIM
## ABOUT HISTORY, CHECKED AGAINST A MOVING FILE
This check proves the words pass changed nothing structural. It compared the
pre-pass commit to **the file as it stands today**. That is a fixed historical claim
measured against a moving target, so the first time any other lane legitimately
edits the quest it goes red and **can never go green again, no matter what anybody
does**. A checker that cannot return to green is not a checker.

Measured:
- skeleton(pre-pass) vs skeleton(the commit the pass landed in): **identical.** The
  pass really was words only.
- skeleton(pre-pass) vs skeleton(working tree): **different**, because of 242108f.

The fix checks the claim where it happened, between the pre-pass commit and the
commit that ADDED the side-by-side record, which is the pass. Neither ref is typed
in; the pass ref is read out of git, so it cannot drift or be fudged.

## WHAT I DELIBERATELY DID NOT DO
I did not make the live check "the 33 voice-passed lines are all still in the quest."
Measured: only 19 of 33 are, and the reason is innocent. My own later pass (ced2248,
the five-scene demo pass) superseded some of them. Shipping that as a gate would
have been a false accusation with a green tick on it.

## THE PATCH, NOT APPLIED
Two edits to gates/voice_gate.js:
1. Build `demoSpoken` by dropping comment lines from `demoHtml`, use it for both the
   NEW and OLD demo lists, and add a mutation guard on the stripper.
2. Resolve `passRef` with `git log --format=%H --diff-filter=A -1 -- <rewrite
   record>`, read the quest at that ref, and compare skeletons between `before_ref`
   and `passRef` instead of between `before_ref` and the working tree. Two new ok()
   lines assert both refs resolved, so a missing ref fails loudly instead of
   skipping the check.
Expected result: voice_gate back to green on both, with two checks added rather than
removed. UNVERIFIED until somebody can run it.

## ROUTED
- **WORDS** Apply and run. One gate run is all it needs.
- **PLUMBER** This is squarely the "every checker honest" mandate and the patch is
  above if this lane cannot get a run. Both failures were the checker, not the code.
- **QUESTS** No action. 242108f is legitimate and the gate was wrong to go red at
  it. Flagged only so nobody spends a round hunting a quest bug that does not exist.
