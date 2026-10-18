# ECONOMY DAY 59: THE CONTRACT'S WORTH -- THE HAGGLE, THE RELATIONS COST, AND A GAP IN THE WIKI'S OWN MATH
# Rule 74 top row [the contract's worth]: contracts priced by skulls and distance, clout raising
# the pay, a failed one costing relation, the board showing the real number. SHIPPED this
# round: records/target/bb/contract_terms.json, engine/bohemia_contracts.js,
# gates/contracts_gate.js.

## 0. WHAT GOT BUILT
- records/target/bb/contract_terms.json -- pulled DIRECTLY off the wiki's own Contracts page
  (reference/library/grok/wiki/PAGES_ALL.tar.gz, bb_all/0441_Contracts.txt) rather than relying
  on Grok's secondhand summary, because the raw page carries a full worked example in all four
  haggle outcomes that no Grok sheet had reported. Also carries GROK_118's relations-cost table
  (betray a contract -100, attack -30, fail a civilian contract -20, cancel -10, a haggle
  attempt -0.5, killing one of their units -0.5, a finished noble contract +5) straight off
  https://battlebrothers.fandom.com/wiki/Relations.
- engine/bohemia_contracts.js -- the mechanism: haggleAttempt (the wiki's own annoyance/
  failure-chance formula), applyAsk (the three haggle outcomes' stated transfer rules),
  workedExample (the real four-row table in batteries), relationsCost, relationBand.
- gates/contracts_gate.js -- 24/0.

## 1. WHY THIS WENT TO THE PRIMARY SOURCE INSTEAD OF A GROK SHEET
No Grok sheet covers contract pricing or haggling (checked: no file in reference/library/grok/
matches contract, skull, clout, renown or distance). GROK_10 (9/30) and GROK_31 (10/1) both
touch the edge of it but say outright "I am not pricing a Bohemia job" and "I am not ruling the
10 to 1 line." Rather than wait for a Grok pull, the wiki tarball COMBAT already extracted
(rule 63d, reference/library/grok/wiki/PAGES_ALL.tar.gz) was opened directly: the Contracts
page's own Haggling section has a complete, exact worked table this lane had never seen.

## 2. THE FINDING: THE WIKI'S STATED RULE DOES NOT REPRODUCE THE WIKI'S OWN EXAMPLE
The page states the haggle mechanic as three clean rules: ask for more total pay moves
everything by a random 4-11%; ask for advance pay moves a flat 25% of completion and per-head
pay into advance; ask for per-head pay moves the same 25% the other way. MEASURED, not
assumed: solving for the exact percentage that reproduces the page's own "Total" row (640 after
completion against a base of 610) gives a clean match, afterCompletion lands on exactly 640.
But applying the stated 25%-transfer rule literally to the "Advance" row's own numbers gives
advance=190, afterCompletion=457.5 -- the page's own displayed row says advance=150,
afterCompletion=510. The RULE (direction and magnitude of the transfer) is sourced and matches
one row exactly; the SPECIFIC EXAMPLE for the other two ask types does not reproduce from the
rule as literally stated, and the page's own text admits why: "because of rounding issues, you
usually lose money overall." This gate does not paper over the gap (gate leg E asserts the
RULED direction, not a forced match to the lossy example) and this record names it rather than
quietly picking whichever number looked right.

## 3. BB AISLE AND REAL AISLE
This entire row is the BB aisle -- a direct mechanical translation, not a design question with
a real-world analogue to weigh against it. The one place a real-world angle matters is the
relations bands (hostile/threatening/neutral/allied), which read like informal reputation
systems in any small economy with no court system (round 9's own prior finding, re-used here
rather than re-researched): a 40-day climb from hostile back to neutral is the same shape as a
blacklisted trader slowly re-earning trust, nothing invented, just consistent.

## 4. WHAT THIS ROUND DID NOT DO
No wiring into RUN TWO's settlement screen or the board's contract cards -- those are a UI,
not a data file, and this row's own text says "the board shows the real number (RUN TWO)",
naming the owner. The skull-to-pay curve and the renown-to-pay curve are both explicitly
unsourced on the wiki page itself (gate leg H); TUNING owns picking an actual curve, and this
file refuses to fill that gap with three felt digits.

## 5. ROUTED
- RUN TWO: wire workedExample()/applyAsk() into the actual contract cards on the board; the
  distance half of "priced by skulls and distance" has no sourced formula either and needs its
  own pull (checked: the Contracts page names skulls and renown, never distance, as a pay
  factor -- flagged, not invented).
- FACTIONS [beef]: the relations-cost table (section 2 of the data file) is the real cost of a
  failed or betrayed contract; that lane's own row can read it directly.
- TUNING: the skull-to-pay and renown-to-pay curves, both named unsourced in the data.

## 6. ALSO FIXED THIS ROUND, NOT MINE
A second live unresolved git merge conflict, this time in
records/BOHEMIA_BETTER_THAN_BATTLE_BROTHERS_10_9_26.md (WORLD's own push), had the handoff gate
red for every lane again and was also the canon-rot gate's one live citation drift (a .md
pointed at a file that only exists as .txt). Resolved, not mine to own going forward.

## 7. COOK
In VOTE: three contracts' cards (id economy-the-contracts-worth-10-9), two sentences: the same
job pays 76 batteries taken straight, or up to 80 if you push for more, with the push costing
relations whether it works or not.
