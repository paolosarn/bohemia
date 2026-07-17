# ADDENDUM — THE FULL-MACHINE TARGET: 150 (7/17/26)
(amended same day, three times: the hidden-backfill discovery, the
indentation ruling, the 01-16 exception, the zero-dialogue ruling, and
finally THE RAISE)

## THE RAISE (7/17 evening, the last ruling of the night)
The >90 line was CROSSED at 91 the same night it was redefined. Paolo then
calibrated against Fallout: New Vegas (~140-165 marked quests after DLC,
~250 authored pieces counting unmarked) and ruled: "at the very least we
need 150 individual quests with their whole enchilada, so let's keep
hunting. The best open-world [games] of all time."
THE TARGET IS 150 FULL-MACHINE FILES, floor not ceiling. The hunt lane
stays the backfill queue (62 files, #33-94, which alone reaches 153) plus
fresh mines from the best open-world games of all time as the queue's
teardowns point to them. The gate prints N of 150 every run.

PAOLO RULING, 7/17/26 evening, verbatim intent: "We need 90 of these bro" —
"these" being files that carry the FULL machine. The counter is redefined.
LANE PICKED same session: THE BACKFILL QUEUE (the standing mining fork is
resolved; fresh mines still count when they happen).

## THE RULING
The >90-before-master-compile target counts ONLY files with the whole
enchilada:
- 10 W-points (craft points) — EXCEPTION: files 01-16 run 11-13 BY DESIGN
  (early format, banked lesson 7/16: not damage, do not fix; they count)
- conversation trees with >0 option lines (the conversation machine)
- CAST + WHAT EACH ONE WANTS section
- THE BRANCH MAP section

A file with W-points but no conversation machine is RESEARCH, not a quest.
It does not count. It sits in the backfill queue until it grows the machine.

## THE HIDDEN-BACKFILL DISCOVERY (same evening, minutes after the ruling)
The first count under the ruling said 16. It was WRONG, and the error was in
the GATE, not the files: the format law's own node-tree template indents its
'> ' option lines, and the 7/16 backfill payloads (40 files marked "V2
PAYLOAD", plus the 7/16-era mines #95-124) followed the law. The gate greppped
'^> ' at column 0 and could not see them. A law-vs-gate contradiction is a
BUG with a mechanical fix: THE LAW WINS. The gate now matches '^\s*> '.

**Real count at ruling, law-correct: 65 of >90.** 26+ more needed.
True backfill queue: 84 files (the gate prints the numbers every run).

LESSON BANKED: this is the #102 incident's shape again — work that was done,
verified, and invisible because the audit tool measured the wrong thing.
AUDIT WHAT THE LAW SAYS, NOT WHAT THE GATE HAPPENS TO GREP. When a count
surprises you, diff the gate against the law's own template before trusting
either.

## ZERO-DIALOGUE-BY-DESIGN — RULED 7/17 (Paolo): THEY COUNT
"That's okay if they genuinely have no talking." Verified genuine before
counting: #99 Ocean House (zero dialogue nodes between entering and leaving
IS the architecture), #110 Cannibal Cage (no parley interface at all; speech
structurally impossible), #114 Substory Engine (same registry). GENUINE
SILENCE SATISFIES THE CONVERSATION-MACHINE REQUIREMENT; every other element
(craft points, CAST, BRANCH MAP) still required. The never-fix registry
stands: giving these files option lines would be damage, not compliance.
The gate counts them and prints the ruling every run.

## THE GATE (same turn, per A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED)
gates/questbook_gate.py computes and prints the official counter every run:
FULL-MACHINE COUNT: N of >90. Nobody carries this number in prose again;
the gate is the counter. Handoffs cite the gate.

## SUPERSEDES
The per-batch "N of >90" counter lines in BOHEMIA_QUESTBOOK_MASTER_INDEX_7_16_26
(57/60/63/66/68) remain as history but are superseded AS THE COUNT by this
ruling. Newest date wins.

*END*
