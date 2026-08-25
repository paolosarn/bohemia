# THE FILE EVERY SESSION MUST READ FIRST IS 63,979 LINES LONG
# (8/25/26, coordinator sweep 18. A DECISION, a routed gate, and one
# thing I did to my own entries to prove the format instead of
# describing it. Nobody can see this from inside a lane.)

## 1. THE MEASUREMENT
    00_START_HERE_NEXT_SESSION.md
      63,979 lines   4,174,730 bytes   942 lane entries
      median entry 64 lines, mean 68, LARGEST SINGLE ENTRY 1,977 LINES
      oldest entry 7/29 -- twenty-eight days
      37% of entries are older than a week
      first 200 lines cover 2 entries of 942
      first 500 lines cover 6 entries of 942
      August growth: 46,864 -> 63,979 lines, about +815 lines PER DAY
    (COUNTING NOTE, because the method matters: my first pass used a loose
    "SOMETHING (slug):" regex and got 1,005 -- it was catching lines like
    "DELTA SINCE MY MARK (fdb5eaa):" inside entries. Recounted against the
    known lane names. 942 is the honest number and every figure above is
    the strict one. The finding does not depend on which count you use.)
CLAUDE.md orders every session to read this file IMMEDIATELY after
CLAUDE.md, every session, because "it is the live state."
NO SESSION READS IT. A session reads the top. Which means the handoff is
already functioning as "the last three entries" BY ACCIDENT, and the
other 940 entries are pure cost with no reader.

## 2. THE LAW ALREADY SAYS THE FIX, IN THE SAME PARAGRAPH
CLAUDE.md, THE HANDOFF FILE, verbatim:
> "There is only ever ONE, it always has this exact name so it sorts
> first and can never be missed, **and every working session REWRITES it
> before ending. Old handoffs are not archived as separate files; git
> history is the archive.**"
**THE LAW SAYS REWRITE. THE PRACTICE IS PREPEND.** Every lane. Including
me, four times today. Nobody decided to change it; it drifted, one
well-intentioned append at a time, because appending is obviously safe
and rewriting feels like deleting somebody's work.
A CONTRADICTION BETWEEN A LIVE LAW AND LIVE PRACTICE IS A BUG, NOT AN
INTERPRETATION CHOICE — CLAUDE.md's own words. This one is mechanical.

## 3. WHY THE MACHINE NEVER CAUGHT IT
gates/handoff_gate.js is green, 5 of 5, every single run. Here is
everything it asserts:
  1. the handoff exists at the root under its canonical name
  2. there is exactly ONE at the root
  3. it is not empty and leads with a lane head
  4. it carries no unresolved merge markers
  5. no tracked file carries an unresolved merge
**NOT ONE CLAIM IS ABOUT THE LAW.** It checks that the file EXISTS. It
has never checked that the file is REWRITTEN, that it is LIVE, or that a
human or a session could get through it. It would stay green at 600,000
lines.
This is the repo's own named failure mode, and its own words are the
indictment: "a checker that cannot tell a mention from a use is the
broken one," and "A GATE MUST NEVER OUTRANK A RULING." A green gate over
a broken law is worse than no gate, because it manufactures confidence.

## 4. THE DUPLICATION, MEASURED
**693 of the 942 entries (74%) cite a records/, gates/ or laws/ path.**
The detail already lives in a permanent file. The handoff entry is a
SECOND COPY of a document that is not going anywhere, sitting in the one
file everybody is ordered to read first. And the history of those entries
is in git, commit by commit, retrievable with `git log -p` — which is
exactly what the law meant by "git history is the archive."
SO NOTHING IS LOST BY BOUNDING THIS FILE. That is the claim that makes
the decision safe, and I checked it before making it.

## 5. THE OTHER AISLE, AND IT IS NOT A METAPHOR — IT IS THE SAME PROBLEM
Handoff between shifts is one of the most-studied failure points in
medicine, and the findings run directly against our instinct.
- **MORE INFORMATION MAKES THE HANDOFF WORSE, MEASURABLY.** In studies
  manipulating what goes into a shift report, information RECALLED ranged
  from **20% to 34%**. One analysis of handoff content found it was
  34.7% raw data, 51.7% information, and only **13.6% actionable
  knowledge**. Excess detail obscures the critical item rather than
  supporting it.
- **STRUCTURE BEATS VOLUME, AND THE GAP IS ENORMOUS.** The method with
  the greatest retention — a short PREPRINTED SHEET in a fixed format
  alongside the verbal report — retained **96% to 100%** of the
  information, against 20-34% for unstructured report.
- **AND THE BIG ONE: I-PASS.** The standardised handoff bundle studied
  across nine pediatric residency programs (Starmer et al., NEJM 2014)
  produced a **23% relative reduction in medical errors and about 30%
  fewer preventable adverse events** — and it did NOT slow the residents
  down. The mnemonic is Illness severity, Patient summary, Action items,
  Situation awareness and contingency plans, and **Synthesis by
  Receiver.**
**THAT LAST ELEMENT IS THE ONE WE HAVE ZERO OF.** Our handoff is
WRITE-ONLY. No session has ever confirmed what it took from it. In
medicine that read-back is not a courtesy, it is the step the evidence
credits. We built the writing half of a handoff and never built the
receiving half, and then made the writing half a mile long.

## 6. THE GAMES AISLE
The industry ran this experiment already and wrote the obituary. "Death
of the game design document" is a standing trade-press theme; the
practitioner consensus is that the 100-page Word file lost to live,
sectioned, editable documents that people actually open. The spread is
instructive: The Witcher 3 reportedly carried 200+ pages of design
document, while Toby Fox started Undertale on TWO PAGES and expanded only
when a decision forced it. And the most useful line in the whole
postmortem literature is the cynical definition of a postmortem itself —
"a common artifact of the game development process whereby the game
industry documents the fact that everyone seems to continuously make the
same mistakes." **DOCUMENTING A MISTAKE IS NOT THE SAME ACT AS NOT
REPEATING IT**, and a file nobody finishes reading is how the two get
confused.
FOR US SPECIFICALLY: this repo's discipline is exactly right and is the
reason it is good — every finding gets a records/ file, every law gets a
gate. THE HANDOFF IS NOT THAT. It is the only artifact here with no size
discipline and no machine holding it to its own stated purpose.

## 7. WHAT IT ACTUALLY COSTS, PLAINLY
Every session in a fleet of nine begins by being told to read a 4 MB
file. Either it reads the top and misses the state, or it spends a large
slice of its context on 28 days of finished work. Both are paid for out
of the same budget as building the game, every session, every day, and
the bill grows 815 lines a day.

## 8. THE DECISION (mine, EVERYTHING IS A THUMB — and it is enforcing an
## existing law, not writing a new one)
**THE HANDOFF IS LIVE STATE, BOUNDED. THE NARRATIVE LIVES IN records/,
WHERE IT ALREADY IS.**
1. **ONE CURRENT ENTRY PER LANE.** A session REWRITES its own entry, as
   the law has said since day one. It never touches another lane's.
2. **A FIXED SHAPE, borrowed from the thing with the evidence behind it:**
     WHERE THIS LANE IS - one paragraph of state
     IN FLIGHT - what is half-built right now
     BLOCKED ON - what stops it, or "nothing"
     WHAT I WOULD DO NEXT - the next unblocked move
     PROOF - the gate, the record, the commit
   The long version goes to records/ and the entry links it. 74% of
   entries already do this; the format just stops the copy.
3. **NOTHING OLDER THAN SEVEN DAYS SITS IN THE FILE.** It is in git, and
   74% of the time it is also in a records/ file that is not moving.
4. **SYNTHESIS BY RECEIVER, the missing half.** A session's first reply
   states in ONE LINE what it took from the handoff. That is the element
   the medical evidence actually credits, and it costs one sentence.
5. **NOBODY DELETES ANOTHER LANE'S ENTRY.** The file shrinks as each lane
   rewrites its own, which is the law working, not a purge. I am not
   stomping nine lanes' files to make a point.

## 9. WHAT I DID, RATHER THAN DESCRIBING IT
I compacted MY OWN four coordinator entries into ONE current entry in the
new shape, in this same commit. Four entries of sweep narrative became
one live-state block plus four records/ links that already existed. That
is the format demonstrated on the only entries I am entitled to touch.

## 10. ROUTED
- **SHARED — HANDOFF-1: MAKE THE GATE MATCH THE LAW.** handoff_gate.js
  gains claims that are actually about the ruling: (a) at most ONE
  current entry per lane; (b) every entry dated within seven days;
  (c) the file under a hard line cap; (d) every entry carries the five
  fields. Mutation tests: add a second entry for one lane -> red; date an
  entry ten days back -> red; drop a PROOF line -> red. **AND THE
  HONEST PART THAT MUST BE IN THE GATE'S HEADER COMMENT:** this gate was
  green 5/5 while the law it is named after was broken for weeks, because
  every claim it held was about the file's EXISTENCE. Write that down in
  the gate so the next person understands what it is for.
- **EVERY LANE, ONE TIME, ON ITS NEXT WRITE:** rewrite your own entry in
  the shape above instead of prepending. One-time cost, one entry each.
- **NOT ROUTED, DELIBERATELY:** any bulk edit of the existing 942
  entries by anybody but their owners. A coordinator deleting nine lanes'
  history to hit a number is exactly the kind of confident, destructive
  tidy-up this repo has post-mortems about.

## 11. CONFIDENCE
- Every number in §1 and §4: measured directly off the file. **CERTAIN.**
- The gate's five claims: read from the source. **CERTAIN.**
- The law-versus-practice contradiction: CLAUDE.md verbatim against 942
  prepended entries. **CERTAIN.**
- The handoff research: peer-reviewed, NEJM and AHRQ-hosted, consistent.
  **HIGH.** The medicine-to-us mapping is an ANALOGY and I am flagging it
  as one; what transfers is the direction (structure beats volume,
  read-back matters), not the percentages.
- The games-aisle documentation consensus: trade press and survey
  literature. **MEDIUM-HIGH.**
- That this makes the fleet faster: a **PREDICTION**, testable the
  obvious way — the file's line count over the next week.

## SOURCES
Starmer et al., "Changes in Medical Errors after Implementation of a
Handoff Program," NEJM 2014 (I-PASS), and the AHRQ PSNet summary;
"Handoffs: Implications for Nurses" in Patient Safety and Quality (NCBI
Bookshelf) for the 20-34% recall and 96-100% structured-sheet findings;
"Handoffs and Patient Safety: Grasping the Story and Painting a Full
Picture" (PMC) and the data/information/knowledge breakdown of handoff
content; MCV/DEVELOP, "Death of the game design document"; Wikipedia and
practitioner guides on the GDD as a living document, and the Witcher 3 /
Undertale contrast; Game Developer's postmortem literature. In-repo:
00_START_HERE_NEXT_SESSION.md (measured), gates/handoff_gate.js,
CLAUDE.md THE HANDOFF FILE and TRUTH HIERARCHY.
