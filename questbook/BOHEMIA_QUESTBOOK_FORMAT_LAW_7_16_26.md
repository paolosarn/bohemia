# BOHEMIA QUESTBOOK — FORMAT LAW (v2, EXPANDED)
Locked 7/16/26 by Paolo. Supersedes the v1 format for every file from #126 on.
Reason: v1 captured STAGES but summarized CONVERSATIONS. The conversation IS the quest.
A stage that says "the player can persuade the board" and does not show the node tree is a walkthrough,
not a teardown. Bohemia cannot port what was never written down.

## THE HARD RULE
Every file must contain enough of the CONVERSATION MACHINE that a writer could rebuild the quest's
dialogue architecture in Bohemia without ever playing the source game.

## THE SECTIONS (in order, all mandatory)

### HEADER
Game, studio, year, quest name, quest type, why this quest was pulled.

### 0 CORE IDEA
The one machine the quest is. Two to four paragraphs. Ends with the life lesson, unspoken.

### 1 CAST + WHAT EACH ONE WANTS  [NEW IN v2]
Every speaking character in the quest. For each:
- what they want (the real thing, not the stated thing)
- what they are willing to trade
- what they will never say out loud
- their function in the machine (obstacle / mirror / temptation / witness / cost)
A character with no want is a vending machine. Name it if the source did that.

### 2 FULL EVENT FLOW (STAGE BY STAGE)
Every stage. Entry condition, what the player physically does, what changes, exit condition.
Mark every stage OPTIONAL / MANDATORY / MISSABLE and whether skipping it silently changes the ending.

### 3 THE CONVERSATIONS (THE ACTUAL MACHINE)  [NEW IN v2 — THE BIG ONE]
For every conversation that carries weight, write it out as a NODE TREE:

  NODE ID — who speaks, where, entry condition
    what they open with (paraphrased tight, quoted only if the exact words are the craft)
    > OPTION 1 [gate: none / stat / flag / knowledge] -> what it says, what it WRITES, where it goes
    > OPTION 2 [gate: ...] -> ...
    > OPTION 3 [gate: ...] -> ...
    LOOPS BACK / TERMINATES / LOCKS OUT NODE X
    WHAT THIS NODE COSTS (info, trust, time, a verb removed)

Rules for this section:
- Show which options are GATED and BY WHAT: stat, karma, an earlier flag, or KNOWLEDGE the player has.
- Show which options are TRAPS (available, functional, and wrong).
- Show which options LOCK OUT other nodes forever.
- Show where the game REMOVES a verb (no dialogue exists for the obvious thing to say).
- Show the SILENCE options and what they buy.
- Mark the ONE LINE in the conversation that is doing the work.
- Note whether the same node has DIFFERENT TEXT depending on what the player learned. This is the
  highest-value reactivity in the genre (Q125 W7) and it must be recorded when it appears.
COPYRIGHT DISCIPLINE: paraphrase the source's lines. Quote only when the exact wording IS the craft
point, under 15 words, one quote per source. Bohemia's own lines, written fresh in section 6, are the
place to show voice.

### 4 THE BRANCH MAP
Every ending state. For each: the exact condition, what it writes, what it costs, what it locks,
and where it cashes out (same quest / later act / later game / later generation).
COUNT THE BRANCHES. Volume scoping depends on this number (Q117).

### 5 HONEST FLAWS (BANKED)
Sourced from real criticism, never invented. Each flaw ends in a LAW for Bohemia.

### 6 WHY IT WORKS (W1-W10, EXACTLY 10)
Craft points. The gate: grep -cE '^W[0-9]+\.' MUST equal 10.

### 7 BOHEMIA PORTS
Every port wired to a REAL Bohemia system (the Fold, [READ], the 13 factions, the Amalgamation,
conscience-no-karma-bar, PACIFIST LAW, survival accounting, generational persistence, FACTORY LAW)
and cross-referenced to other questbook numbers by number.
EVERY PORT THAT INVOLVES TALKING SHIPS A NODE TREE IN BOHEMIA'S OWN VOICE, with real written lines.
Anything needing a creative call: [PENDING, Paolo's call]. Never guessed.

### SOURCES
Heavy. Wiki, walkthroughs, outcome matrices, dev/cut content, and CRITICISM.
Each with a FUTURE DEEPER PULL note.

## LENGTH
v1 ran 320-440 lines. v2 runs LONGER because section 3 is real. Expect 500-700.
Length is not the target. The node trees are the target. Length follows.

## THE GATE (unchanged, plus)
md5 + wc -l + grep -cE '^W[0-9]+\.' == 10 + END marker present.
NEW: grep for '> ' option lines. A file with zero option lines in section 3 FAILS. The conversation
machine is not optional.

## BACKFILL
#125 and everything before it were built to v1. They are NOT damaged and do not get "fixed."
The conversation machine for the best of them gets backfilled at compile, or on demand, as a v2 pass.
Do not delete. Do not rewrite silently.
