# BOHEMIA ADDENDUM — DIALOGUE ALWAYS REFERS TO THE CATALOGUE (8/11/26, Paolo, LOCKED)

> **"BRO LISTEN I HAVE A WHOLE 170 QUEST FILE WITH DIALOGUE I DONT HAVE TIME TO
> APPROVE THE DIALOGUE THIS SLOW LIKE THIS I WILL EDIT IT LATER JUST DIALOGUE
> ALWAYS REGER TO THE BEST QUESTS EVER CATLOUGUE OKAY WRITE THAT DOWN AS A RULE
> BROTHER. READ THE QUEST SHIT AND GET INSPIRED"**

(REGER = REFER. CATLOUGUE = CATALOGUE. Voice-to-text; decipher intent, never take
a garbled word literally — CLAUDE.md, HOW PAOLO WORKS.)

## WHAT HAPPENED

8/11 morning he overturned the empty-contents reading for words
(`BOHEMIA_ADDENDUM_ALWAYS_MAKE_AN_ATTEMPT_8_11_26.md`): every line ships with a
real attempt, tagged `draft:true`, because a blank page is what stopped the
quests. This lane obeyed that within the hour — and then **ended the turn asking
him to approve four lines of family dialogue.**

That is the thing he is answering here. Making the attempt and then queueing the
attempt for his thumb reinstates the exact bottleneck the morning's rule was
written to kill, and it also broke a law that was already on the books:
`BOHEMIA_ADDENDUM_EVERYTHING_IS_A_THUMB_8_9_26.md` (APPROVE-BEFORE →
CORRECT-AFTER; a numbered queue of pending verdicts in a reply is BANNED).

He is not asking for a smaller queue. He is removing dialogue from the queue.

## THE RULING, IN THREE PARTS

### 1. DIALOGUE NEVER WAITS ON A THUMB

**No line of dialogue is ever put to him for approval.** Not in a JUDGE THIS
list, not as "which of these two", not as a verdict page, not as a bolded
question. It ships written, it ships playable, and **he edits it later.**

Dialogue is the one content class where the approve-before loop costs more than
it protects: there are thousands of lines coming, he reads at the speed of a man
running a game solo, and a line he never sees is worse than a line he rewrites.

**This is not a licence to write badly.** It is the opposite: the thumb was the
safety net, the net is gone, and what replaces it is part 2.

### 2. EVERY LINE IS SOURCED TO THE CATALOGUE

**"THE BEST QUESTS EVER CATALOGUE" is `questbook/`** — 152 quests from the best
written games ever shipped, studied to the bone into four masters, mined into
**3,672 citable findings** in `records/BOHEMIA_QUESTBOOK_LAW_INDEX.json`.

That corpus is now **the standard the words are held to, in his place.** He
cannot check every line; the catalogue can. So:

**Every authored line of dialogue in Bohemia cites the corpus laws it is built
on**, in the vocabulary the QUEST STUDY LAW (7/26) already established:

    # @STUDY Q013.W7  THE BLINDSIDE (mundane -> devastating)
    #   applied: <what this line actually does with that finding>

- the id must **resolve** in the index (no invented ids),
- the title must match the corpus **verbatim** (that is what makes it checkable),
- `applied:` must say what the line **does**, not name-drop the study,
- a scene's lines must span **>= 2 studies and >= 2 masters**, so no scene is
  written off one trick.

This is REUSE-FIRST for words. A citation is a claim the machine can check.
"READ THE QUEST SHIT AND GET INSPIRED" is now a **precondition of writing a
line**, not a suggestion, and the gate can tell whether it happened.

### 3. "I WILL EDIT IT LATER" NEEDS A PLACE FOR LATER

He does not dig in files (CLAUDE.md, first section). A line living in
`records/BOHEMIA_SCENE_*.json` is a line he cannot edit, so "I will edit it
later" would quietly become never, and this rule would rot into "Claude writes
the dialogue" — which is **not** what he said.

So every drafted line in the game appears in **the WORDS tab**, in the alpha:
every line in the build, its speaker, its scene, its catalogue citation
underneath, editable in place, export button. Tap, retype, export, done.

**A line he cannot reach is a line he cannot edit.** The tab is the other half of
the ruling, not a convenience.

## THE LINE BETWEEN THIS AND WHAT IS STILL HIS

Unchanged, and this addendum does not touch it:

- **who dies, who lives, who is related to whom**
- **which faction holds which ground**
- numbers, dials, rates, prices, map layouts
- anything he has explicitly reserved

Words get written. **Decisions still wait.** Writing the father's line is words.
Deciding the father dies is not. (`ALWAYS MAKE AN ATTEMPT`, 8/11, same test.)

## THE MACHINE

`gates/dialogue_catalogue_gate.js`:

1. every dialogue-bearing artifact in the repo is **discovered**, not listed by
   hand (`quests/bq/*.bq` + `records/BOHEMIA_SCENE_*.json`), so a lane inventing
   a new dialogue file cannot slip past a hardcoded list,
2. every one carries catalogue citations; **scene lines cite per line**,
3. every cited id resolves; every cited title is verbatim; every `applied:` is a
   real sentence,
4. each scene spans >= 2 studies and >= 2 masters,
5. **the WORDS tab exists, is wired into the alpha, and is CURRENT** — the baked
   page is regenerated from source and compared, so an edited line that never
   reached the tab fails here rather than silently becoming unreachable.

`tools/bohemia_words_book.py` harvests and bakes. Run it after any dialogue edit.

## THE COST OF GETTING THIS WRONG

Naming it so no future session re-derives the mistake: **the failure mode is not
bad dialogue, it is asking.** Every turn that ends with "approve these lines"
spends his attention on the one thing he explicitly took off his plate, while the
2,000 lines the demo needs sit unwritten. If a session is unsure whether a line
is good — it cites harder, ships it, and moves on.
