# THE CARD I NAME IS ON HIS SCREEN (PLUMBER 10/18, rule 118)

Row: PLUMBER [the card I name is on his screen]. Gate: gates/the_card_i_name_is_on_his_screen_gate.js, in the suite as
THE CARD I NAME IS ON HIS SCREEN, 26 passed 0 failed, 0.3 s, no browser, reads only.

## Why

Paolo 10/18: "A lot of the votes you saying were on a card visible we're not visible for me." Five of the fourteen
things the coordinator sent him to the VOTE tab for never had a card (records/BOHEMIA_PAOLO_THE_CARDS_YOU_NAMED_WERE_NOT_ON_MY_SCREEN_10_18_26.md).
The coordinator wrote what a lane PLANNED as if it were on his screen. Rule 118: a thing is called "in the VOTE tab"
only when its card id is in the registry, unvoted, and on his first screen.

## How it knows what is on his screen

It does not keep its own copy of the tab's sort. It runs the VOTE tab's OWN script (slices/BOHEMIA_VOTE_TAB.html, the
file the alpha frames behind the gear) in a Node sandbox with a small stand-in page, feeds it the committed registry
and triage file at the paths Pages serves them, and reads what the tab drew: the rows in #list are his first screen;
it then taps MORE and reads #more. The phone in the sandbox has voted nothing. So the day RUN TWO or UI change the
sort (red first, untagged next, the cap of twelve, a tag only demotes), this gate follows in the same commit.

If the tab ever calls a page feature the stand-in lacks, T0 goes red saying so in those words. That is PLUMBER's to
fix, never the tab's. (It happened once while building it: the tab's "THE LIST DID NOT LOAD" path calls
createTextNode; the stand-in learned it.)

## The legs

- T0: the tab's own script runs on the committed registry and triage and draws a first screen. Today: 7 on it, 0
  behind MORE.
- R1: the coordinator's newest round record (records/BOHEMIA_COORDINATOR_ROUND_<m>_<d>_<yy>[_<sweep>].md, ordered by
  date, then sweep letters by length then alphabet, so AX after AW, BA after AZ, and 10/19 after 10/18 AX) carries a
  section headed ON HIS SCREEN. Required from sweep AX on; empty is allowed, absent is red.
- R2: every line under ON HIS SCREEN is one card id. A line in brackets is a note. Prose ("the district fight
  boards") is red: it is exactly what he could not find; it belongs under COMING, NOT IN A TAB YET.
- R3: every id there is on his first screen. The red says which of five things it is: NOT IN THE REGISTRY, ALREADY
  VOTED (YES or NO and when), NEVER SHOWN (tagged green or gray), BEHIND MORE (tagged yellow), BEHIND MORE (past the
  first screen's twelve, with its place behind the fold).
- B1: every board row that says IN VOTE names a card id in the same row. The claim is the board's status phrase in
  upper case. NOT IN VOTE, NOTHING REGISTERED IN VOTE and a quote ("a row that says IN VOTE") are not claims. The
  lower-case "in VOTE" is left out on purpose: measured on the board, 331 uses, nearly all of them intent ("a sheet in
  VOTE", "two sentences in VOTE"), not claims; rule 118(b) says IN VOTE.
- B2: the id it names (the first id after the phrase, else the last before it) is in the registry's items.
- P1: a row that says PULLED, RETRACTED, WITHDRAWN or WITHDREW and names an id in the same clause names one that is
  out of the registry's items (rule 118(c)).

The board today: every IN VOTE row names a registered card (the 25 rows that carry the phrase read, the negations and quotes among them skipped), no pull names a card still in the
registry. Nothing had to be grandfathered; the BASELINE list in the gate is empty and can only stay that way or
shrink.

## Proven both ways

Planted, on copies (S1 to S14): a newest untagged card is on the screen; the same id unregistered, voted, tagged
yellow, tagged gray, and pushed past the cap by twelve newer red cards are each caught with the right reason; a red
card leads a newer untagged one (the tab's order, read from the tab); a registry that will not load shows nothing;
prose under the heading is caught and the next section ignored; a missing heading is caught and an empty one passes;
the record order; IN VOTE with no id (B1), with an unregistered id (B2), with a registered id (green); the three
not-a-claim forms; PULLED on a registered id (P1) and on a gone one (green).

On copies of the REAL files (M1 to M5), his 10/18 put back: the AX record with his five missing things written under
ON HIS SCREEN (R2 names all five); the same five as ids nobody registered (R3 says NOT IN THE REGISTRY for each); the
AX record once he has voted the card it names (R3 says ALREADY VOTED); the heading gone (R1); the real board with
COMBAT TWO's "sprites for all four of my cards IN VOTE" put back on its section (B1 names COMBAT TWO [the district
boards]).

From the command line on a broken record and board: EXIT 1, five reds (R2, R3 with four different reasons, B1, B2,
P1), each naming the line and whose it is. On the real files: EXIT 0.

A gate that dies quietly must never read as green: a throw outside the tab's own run prints FAIL and exits 1
(found while testing: a bad --board path once ended the run silently with exit 0; fixed before landing).

## Run it

    node gates/the_card_i_name_is_on_his_screen_gate.js
    node gates/the_card_i_name_is_on_his_screen_gate.js --record <a draft round record> --board <a board>

The coordinator can run it on a draft record before the sweep commits: `--record` takes any path.

## What it does not do

- It reads the committed registry, not the deployed tab. Whether Pages actually serves it is EYES [does his screen
  show it] (rule 118(d)), once a sweep, on his phone's size.
- It reads the coordinator's round record, not the coordinator's reply. The record's ON HIS SCREEN is the reply's
  promise in a form a machine can read (rule 118(a)).
- It cannot see a vote that is still only on his phone. The registry is the truth the tab reads first.
