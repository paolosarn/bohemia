# BOHEMIA ADDENDUM — ALWAYS MAKE AN ATTEMPT (8/11/26, Paolo, LOCKED)

> **"BRO FOR ANY TEXT JUST HAVE PLACEHOLDING GOOD ESTIMATES OF SPEECH BRO I WILL
> EDIT IT LIVE THATS WHY I HAVENT DONE QUESTS YET JUST MAKE AN ATTEMPT MAKE THIS
> A RULE"**

## THE RULING

**Every piece of player-facing text ships with a real attempt at the words.**
Never a blank, never a `[PENDING]`, never a silent line. He edits live.

## WHAT THIS AMENDS, AND IT IS A BIG ONE

CLAUDE.md has said since the beginning:

> *MECHANISM-MINE / CONTENTS-PAOLO'S: build tables and whitelists EMPTY except
> what has a ruling. Never fill in canon he reserved.*

That law was read as **"ship no words at all"**, and every lane obeyed it
faithfully. `LINES` shipped empty. `NAMED_CAST` shipped empty. The cold open's
say beats shipped silent, and this lane wrote a *gate* on 8/9 that went RED if
anybody put a word in his family's mouth.

**We were protecting him from the wrong thing, and it cost him the quests.** His
own diagnosis, in his words: *"THATS WHY I HAVENT DONE QUESTS YET."* An empty
field is not a respectful blank canvas, it is a **blank page**, and a blank page
is the single most expensive object in a creative pipeline. He does not write from
nothing. **He edits.** Handing him nothing to edit stopped the work.

NEWEST DATE WINS. For **words**, this addendum supersedes the empty-contents
reading.

## THE LINE, DRAWN EXACTLY

**ATTEMPT IT — always, in full, with real craft:**
- dialogue, barks, monologue, anything a character says
- quest text, objectives, descriptions, item and place names
- UI copy, tooltips, notifications, failure messages
- character names where a name is needed to play

**STILL HIS, STILL EMPTY UNTIL RULED — this half does NOT change:**
- **who dies, who lives, who is related to whom**
- **which faction holds which ground; who owns what**
- numbers, dials, rates, thresholds, prices
- map layouts (MAP LAW)
- anything he has explicitly reserved or parked

The test: **is it WORDS, or is it a DECISION?** Words get an attempt. Decisions
wait for him. Writing "Up. Now. Don't turn the light on." for the father is an
attempt at words. Deciding the father dies is not.

## HOW AN ATTEMPT MUST BE MARKED

An attempt he cannot find is an attempt he cannot edit, so every one is tagged
at the source:

    "text": "Up. Now. Don't turn the light on.",
    "draft": true

`draft: true` means **Claude wrote this, it is a real attempt, edit freely.**
Absent or `false` means the words came from Paolo and no lane may touch them.
That one flag is the whole contract: he can list every word he has not yet
approved, and a lane can never mistake his line for a placeholder.

**A DRAFT IS NOT AN EXCUSE FOR BAD WRITING.** "Good estimates" is the ask. Write
it as though it ships: in the world's voice, specific, no lorem ipsum, no
`TODO: line here`, no placeholder that says the word placeholder. If the draft is
lazy he has to rewrite from scratch, which puts him back at the blank page this
rule exists to abolish.

## THE MACHINE

`gates/attempt_gate.js` — the 8/9 scene gate had a claim that **failed if any
text appeared**. That claim was correct under the old reading and is now exactly
backwards, so it is inverted, not deleted:

- every say beat must carry **an attempt** (empty text is now the failure)
- every attempt must carry **`draft: true`**
- no attempt may be filler (`TODO`, `TBD`, `lorem`, `placeholder`, `XXX`)
- **his** words (`draft` absent/false) may never be edited by a lane

**A GATE MUST NEVER OUTRANK A RULING** (Paolo 8/1). A gate written two days ago
to enforce the old reading does not get to outlive the ruling that replaced it.
