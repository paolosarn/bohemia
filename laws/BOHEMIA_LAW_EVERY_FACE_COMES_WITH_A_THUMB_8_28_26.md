# BOHEMIA LAW — EVERY CHARACTER FACE COMES WITH A THUMB (Paolo, 8/28/26, LOCKED)

## HIS WORDS

> "Yeah bro from now on **all the character face shit is always gonna have to come with a
> ... thumbs up or a thumbs down** bro like you can't be doing shit without ... my thumb,
> thumbs up thumbs down, **if it's a visual**. And a lot of them **I'm gonna be thumbing
> down so you gotta do better.** You gotta impress me. We got a lot to do come on."

## THE RULE

**No visual in the character/face lane ships without a thumb waiting on it.** A haircut, a
portrait, a face — if he can see it, he can rule on it, in one tap, from a top-level tab.

**Tab: VOTE.**

---

## WHAT THIS AMENDS, AND WHAT IT DOES NOT

EVERYTHING IS A THUMB (8/9) flipped the default from approve-before to correct-after,
because *"Thumb thumb thumb everything is a thumb"* — we had turned him into an approvals
queue. **That law is still right and this does not undo it. NEWEST DATE WINS on the one
thing it changes, and no more.**

> **NOTHING BLOCKS ON HIM.** The work ships the turn it is done. No numbered queue of
> pending verdicts in a reply, no asking him how to do the work, no waiting.

What changed is narrower and it is a real gap he caught: on this lane a visual had been
shipping **with no way to say yes or no to it at all.**

**The VOTE tab has existed since 8/7 and had never held a single face.** It read one bank —
the district map icons — so every haircut, every portrait and the whole face maker went out
with nothing to tap. He did not ask for the thumb *back*. **The thumb was never there.**

That is the same failure as the seventeen invisible hats and the colours nobody wore: the
material existed and never reached him.

---

## WHAT IT LOOKS LIKE

**One surface, not two.** He never digs; a second judge page reached from somewhere else is
the scavenger hunt the VOTE tab was written to kill. Same grid, same thumbs, same note
field, same `@VERDICT` grammar, same `.txt` export as the district icons.

- **A HAIRCUT IS FOUR PICTURES, NOT ONE.** Every haircut cell is a strip — front,
  three-quarter, side, back — one per row, at a size bigger than the game draws it.
  A HAIRCUT READS FROM EVERY ANGLE OR IT IS NOT A HAIRCUT (8/28), so a cell showing only
  the front would be asking him to thumb a third of the thing. **Judging art below the
  size it ships at is judging a thumbnail.**
- **A FACE is the portrait at the size it pops up** when somebody talks to you.
- No cards, no frames, no name chips (8/11: *"only show me the square grid that it will be
  in that is it"*).
- Three states per tap: **up → could be better → down → clear.**

**The queue is DERIVED, never typed.** Anything the alpha calls canon that no `@VERDICT`
line names is waiting. A hand-written list of "the new ones" is the house bug this repo
keeps paying for, and it goes stale the first time he rules on anything.

---

## THE GATE

`gates/face_thumb_gate.js` — **21 checks, and it drives the real page.** A gate that
grepped the builder for the word "thumb" would pass on a surface where nothing is
clickable (VERIFY ON THE REAL SURFACE, 7/18).

1. the VOTE tab is top level and opens this surface
2. **every canon haircut has a candidate baked** — this is the ratchet: cook a haircut,
   forget to bake it, and this goes red the same turn. That is the whole mechanism by
   which *"you can't be doing shit without my thumb"* survives the next cook.
3. the portrait itself is judgeable
4. a haircut is shown from more than one side
5. the candidates are **not stale against the build they photograph** — a thumb on a
   picture of a build that no longer exists is worse than no thumb, because he thinks he
   has ruled on the thing in front of him
6. tapping a cell moves it through the verdict states, **and the verdict is written down**
7. a note per item, a comment box for the whole batch, SUN MODE, and `.txt` export
8. **the counter can see the face queue** — it read one list, so the day the haircuts
   arrived it said *"0 / 0 voted"* over forty things waiting. A counter that cannot see
   half the queue is telling him he is finished.

### And its own probe was wrong first

The persistence check tapped four times — up, could-be-better, down, and back to nothing —
and then asked whether the store held a verdict. It was reading an **erased** vote and
reporting the feature broken while the feature worked. **Ninth broken ruler this week**,
and the same shape as all the others: a measurement that is perfectly true about a state
nobody is asking about.

---

## WHAT HE SAID NEXT, WHICH IS THE POINT

> "**and a lot of them I'm gonna be thumbing down so you gotta do better.**"

He expects to reject. The surface is built for that: the note field asks *"what is wrong
with it"*, and a thumb-down with a sentence is worth more than a silent approval. **A kill
is a result, not a setback** — the last hair batch cooked 23 and shipped 9, and the
fourteen that went are why the nine are good.

---
Tab: **VOTE** — it opens on what has no verdict yet.
Record: `records/BOHEMIA_EVERY_FACE_COMES_WITH_A_THUMB_8_28_26.txt`.
Bake: `node tools/bohemia_face_candidates.js` then `python3 tools/bohemia_vote_tab.py`.
