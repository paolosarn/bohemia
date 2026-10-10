# THE LAST FIVE LINES ARE THE REPLY (PLUMBER 10/10/26, row [the reply leg]; rule 90, school round 10)

THE ROW: "Two legs on the reply contract gate for the coordinator's replies: the whole reply at or under 150
words (the proof line and the two links do not count), and the last five lines before the links are, in
order, the change, the one number, the one red, WHAT I NEED FROM YOU, and the two-sentence bottom line. Red
on a 400-word reply; green on the template in
records/BOHEMIA_COORDINATOR_SCHOOL_ROUND_10_TALKING_TO_THE_BOSS_10_10_26.md."

## THE ANSWER FIRST

**The checker exists, the gate proves it both ways, and the first real reply it read was refused: the one
PLUMBER sent Paolo last round, 381 words with no red line.** The same news in the template's shape is 74
words and passes.

    node tools/bohemia_reply_check.js draft.md      (or pipe the draft in with -)

prints the words, a reading grade and the five slots it found, and exits 1 with "DO NOT SEND" when a leg is
red. A gate cannot read a chat reply (replies are not files; name_the_tab_gate.py said so on 7/28, and a gate
that claimed to read them would be self-attestation). So the checker is the tool the coordinator runs on its
draft before it sends, and REPLY CONTRACT proves the checker on the school's own template and on planted
replies, every run.

## THE TWO LEGS

| leg | what it reads | red when |
|---|---|---|
| WORDS | every word on his screen, minus the proof line (a line that starts with "proof") and the links (a URL, and a trailing line that is only a link) | over 150 |
| LAST FIVE | from the bottom: the bottom line under the ask; WHAT I NEED FROM YOU with its numbered lines or "Nothing, I'm good"; the red ("RED: ..." or "No red", a CAUSE / FIX line under it belongs to it); the change, one or two lines that start with a tab and a colon ("VOTE: ...", "MAP: ...", "NOT IN A TAB YET: ..."), with a digit on them or on one line between them and the red | a slot missing or out of order; the bottom line is not two sentences |

The tabs are read from the alpha's own tab bar (17 today) plus DEMO and the 7/28 list, so a new tab is known
the round it ships. The reading grade (Flesch-Kincaid, round 10 asks 8 or under) is printed, not a leg: its
syllable count is a rule of thumb that reads about two grades low on long sentences (13.4 on Lincoln's first
Gettysburg sentence, 15.4 counted by hand; exact on "The cat sat on the mat.").

## HOW IT WAS PROVED (in REPLY CONTRACT, 22 passed, 0 failed; under a second, no browser)

- R1 the school's template, read live from its record: 88 words, the five slots in order. Its slots are
  written as placeholders ("TAB NAME:", "one number"), and only in this leg do those words stand in for a tab
  and a digit.
- R2 a reply filled from the template passes both legs (87 words).
- R3 the same reply padded to 399 words is red on WORDS and on nothing else.
- R4 five wrong shapes are each red on LAST FIVE: the ask above the change, a three-sentence bottom line, no
  red line, a change that names no tab, a change with no number.
- R5 a 200-word proof line does not count (87 words); the same 200 words in the body do (289). NOT IN A TAB
  YET and an inline "Nothing, I'm good" pass.

RED CASE: R3 and R4 above, planted in the gate itself; and PLUMBER's own reply of last round, refused on both
legs when measured by hand (381 words; the line above the ask was the paragraph about the tab, not a red).

## WHAT IT DOES NOT DO

- It does not read the coordinator's chat. It binds a reply only when the reply is run through it. [FOR THE
  COORDINATOR] in the handoff: run the draft through it before it sends; "DO NOT SEND" means cut to the five
  lines and move the detail into the round record.
- It does not judge whether the number is the right number or the red the worst one. That is the
  coordinator's school, rules 3 and 4 of round 10.
