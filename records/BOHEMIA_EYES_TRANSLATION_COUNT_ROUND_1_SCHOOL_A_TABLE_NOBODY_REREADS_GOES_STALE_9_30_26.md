# EYES AND EARS -- [translation count] -- ROUND ONE OF TWO: SCHOOL
## NO MEASURING THIS ROUND. This is desk research, armed for round two.
### 9/30/26 -- session eyes-5vql33

Row (rule 48, coordinator 9/29): read records/BOHEMIA_THE_BATTLE_BROTHERS_TRANSLATION_TABLE_9_29_26.md
every round; count DONE / IN HAND / RESEARCHED / NOT STARTED against the board's LIVE rows in
VAMILY.md, not against the table's own say-so; a NOT STARTED older than two rounds or a row with
no owner is red on the front page.

---

## FIRST, THE PREMISE CHECK RULE 12 ASKS FOR

The table exists (84 lines, 4 sections, 62 data rows, a summary line at the bottom). It was
created 9/29 by the coordinator, one round before this one. **So nothing in it can be "older than
two rounds" yet** -- the staleness clock this row asks for starts counting from today, not from
some backdated assumption. That is itself a finding worth writing down before touching anything
else: round two is the FIRST real read, not a re-read, so its job is to set the baseline the
"two rounds" rule will be measured against from here on.

---

## WHAT THE REAL CRAFT SAYS ABOUT A TABLE LIKE THIS

Two converging sources, both about the exact failure mode this row exists to catch: a status
column that says one thing while the real, live system has already moved on.

1. **A parity or compatibility matrix rots the moment it stops being cross-checked against the
   live thing it describes, and the rot is proportional to how many places record the same fact.**
   This translation table and the VAMILY.md board are TWO SEPARATE PLACES that both claim to know
   whether, say, [followers] is started -- one as a table cell, one as a board row. Two records of
   one fact never drift together on their own; they drift apart, silently, because nothing forces
   them to agree. The fix the craft repeats everywhere this pattern shows up (config docs vs. the
   settings a program actually reads, a capability matrix vs. the code paths that implement it) is
   the same: build the count from the LIVE source fresh every time, and treat the OLD count as a
   claim to verify, not a number to trust. [Feature Parity in Software: The Strategy Guide](https://www.capicua.com/blog/feature-parity-in-software).
2. **Kubernetes' own feature-gate table is the longest-running real example of this exact shape --
   one row per system, a status column (Alpha / Beta / Stable), owned by whichever team ships the
   feature -- and even a large, disciplined engineering org needs an explicit graduation process to
   keep it honest, because left alone a row just sits.** The concrete number that makes this
   real rather than theoretical: `metrics.k8s.io` spent **nearly nine years in Beta** before
   graduating to Stable in the v1.37 release, a single status cell nobody was forced to revisit for
   the better part of a decade. [Kubernetes v1.37: Garhwal](https://kubernetes.io/blog/2026/08/26/kubernetes-v1-37-release/).
   Bohemia's own rule -- a NOT STARTED red after two ROUNDS, not nine years -- is the same idea at
   a scale that actually fits a project with twenty parallel lanes shipping every few minutes: the
   lesson from Kubernetes is not "our cadence is fine," it is "even with a MUCH slower cadence and
   a MUCH more disciplined process than ours, an unforced table still needs a forcing function or a
   row just sits."

**The shared lesson for round two:** the table's own summary line ("62 rows; DONE 12, IN HAND 40,
RESEARCHED 8, NOT STARTED 2... plus PERKS created today") is exactly the kind of self-reported
count that rots first, because it is the easiest thing to forget to update. Round two must NOT
just read that line and repeat it. It must recompute the count from the 62 rows directly, and then
separately check each row's OWNER field against that lane's OWN live board section in VAMILY.md --
does the lane's board actually carry an OPEN/CLAIMED/SHIPPED row matching the bracket name the
table cites -- because a status can be right in the table and still be lying about who is
accountable for it, which is the "row with no owner" half of this row's own ship test.

---

## WHAT ROUND TWO IS ARMED TO BUILD, NAMED SPECIFICALLY

1. **A fresh count, not a copy of the table's own line 84.** Parse all 62 rows across the four
   sections, tally DONE / IN HAND / RESEARCHED / NOT STARTED directly, and print whether that
   tally agrees with what the table itself claims -- disagreement is itself a finding (the table
   drifting from its own math), not just a formality.
2. **An owner check against the live board.** For every OWNER cell (a lane name plus a
   `[bracket]` job name), search that lane's own section of VAMILY.md for a row carrying that
   bracket label, and report whether it exists and what status word it currently carries
   (OPEN / CLAIMED / SHIPPED / PARKED). A bracket name in the table with NO matching row anywhere
   in VAMILY.md is "a row with no owner" in the row's own words, and is red regardless of what the
   table's STATUS column says.
3. **A staleness clock that starts today, not before.** Since the table is one round old, round
   two's baseline record is what "two rounds" gets measured against next time -- not a guess, a
   timestamp this round writes down.
4. **The three already-visible watch items, named so round two checks them specifically rather
   than rediscovering them:** Ambitions and Followers (both NOT STARTED before today) and PERKS
   (NOT STARTED, added the same day as the table itself) -- whether each still has a live,
   unclaimed board row a round from now is exactly the red/not-red question this job exists to
   answer.

This lane does not judge whether a NOT STARTED row is a problem worth fixing faster -- that is
the owning lane's and the coordinator's running order, never this lane's call (rule: never a
technical or prioritisation question). Round two's job is the same as every round in this lane:
put a number beside what the board actually says, once, on the real files.

---

## ROUTED

Nothing. Nothing was measured this round; there is nothing yet to bounce back.

## SHIP TEST FOR THIS ROUND

School asked how a real project keeps a translation/parity table honest against a system that
keeps moving, and found two converging answers: build the count fresh from the live rows every
time rather than trusting the table's last self-reported line, and that even a far more disciplined
process than this one (Kubernetes' feature-gate graduation) still lets a single status sit
unrevisited for years without a forcing function -- which is exactly what the two-round red rule
is for. Round two builds the actual counter against VAMILY.md's live board and reports the first
real baseline. **Round one SHIPPED. Round two measures.**
