# EYES AND EARS -- E16 [never opened] -- ROUND ONE OF TWO: SCHOOL
## "NEVER REVIEWED" IS A STATUS, NOT AN ABSENCE
### 9/11/26 -- session eyes-5vql33 -- NO MEASURING WAS DONE THIS ROUND, ON PURPOSE

The job, from the board:

> WHAT-HE-HAS-NEVER-TOUCHED -- from his own blind spots: he rules on what he saw last and never
> on what he has not seen. School first (how studios track what a director has actually
> reviewed), then the machine: every SHIPPED line on this board that reaches a tab, with whether
> any ruling of his has ever mentioned it. Hand the coordinator the list each round so one of
> them goes in front of him every time.

And the record it came from, `records/BOHEMIA_HIS_BLIND_SPOTS_THE_PERSON_NOT_THE_BOARD_9_6_26.md`,
blind spot 2, in the coordinator's own words:

> Every ruling this stretch was about the last thing on his screen: the UI at 50%, the zoom, the
> tutorial pop-up, the cloud. All correct. But the fold, the animal opening, the perk tree, the
> reckoning card, the room fight, the room's own song -- none of those has had a word from him,
> because he has not opened them. **Things he does not look at drift.**

Round one is school. Nothing was measured. That record was read as grounding, because the MODE
asks for the world measured against our repo, and it turns out to contain both the ground truth
round two needs and the finding that proves the job's own shape wrong.

---

## 1. REAL PIPELINES MAKE "NOT REVIEWED YET" A FIRST-CLASS STATE, AND THEY NAME THE DIRECTOR

This is the industry answer and it is more specific than I expected. In a production tracker,
**every version of every shot carries a review status**, and the statuses include:

- **Pending Review** -- the default for a newly created version
- **Pending Director Review** -- reviewed once, but it still needs the director
- **Final / Approved**

And the tool ships the views that follow from that: a **"Need to Review"** tab showing only
versions nobody has reviewed, a **"Director Needs to Review"** tab showing only what is waiting on
the director specifically, and a **Finals** tab. Notes attach to a *specific version*, so an
approval is traceable to what was actually on screen when it was given, and rework is detectable.

**WHAT THIS CHANGES FOR US, AND IT IS THE BIGGEST STRUCTURAL FINDING.** Our board has SHIPPED. It
has **no field at all** for whether he has ever looked. So "he has not seen this" is not a state
anything can hold in this repo -- it is an absence, and an absence is invisible. Every studio that
has solved this solved it by making the unreviewed thing a **status a machine can filter on**, not
a report somebody writes.

And the unit matters: their unit is *a version of a thing plus who has looked at it*, not "a task
that got done". Round two's rows should be things-on-screen, with a seen-by-him column.

---

## 2. THE SAME PATTERN, FROM QA: THE INTERESTING CELL IS THE EMPTY ONE

A requirements traceability matrix maps every requirement to the test that verifies it. Its whole
value is **forward traceability**: it catches requirements with no linked test case, which makes
coverage gaps *visible*, and the framing is blunt -- **a requirement with no linked test is a risk
that has not been mitigated.**

**WHAT THIS CHANGES FOR US.** E16 is a traceability matrix where his rulings play the part of the
tests. That fixes the deliverable's shape: a matrix, whose interesting cell is the empty one. It
also gives the number that matters -- **coverage**, the share of shipped things on screen that have
ever had a word from him -- which nobody in this project has ever computed.

---

## 3. NOBODY REVIEWS EVERYTHING, AND THE ORDERING IS THE REAL DESIGN DECISION

The same literature is honest that full coverage is not the goal: risk-based approaches exist so
teams **focus effort rather than reviewing everything equally**, and critical or high-risk items
are highlighted in the matrix.

**WHAT THIS CHANGES FOR US.** The job says "one of them goes in front of him every time", which is
right, and leaves open the question that actually decides whether this works: **which one.** The
obvious ordering is oldest-unseen, and oldest-unseen is wrong -- it will put the oldest trivial
thing in front of him while something load-bearing stays unseen forever. Round two carries a
**risk column**, and the one item it surfaces is chosen by risk, with the reason stated.

---

## 4. THE BIAS HAS A NAME AND IT IS SPECIFICALLY ABOUT HIDDEN INFORMATION

The mechanism the blind-spot record describes is the **availability heuristic**: judgement leans on
whatever is easiest to bring to mind, and what is easiest to bring to mind is what was recent and
what was vivid. The part that matters for E16 is sharper than "recency":

> Availability bias is a tendency to be influenced by information that is **visible**, and to
> **ignore hidden information**. The "out of sight, out of mind" effect depends on whether these
> elements are **present during decision-making**.

**WHAT THIS CHANGES FOR US.** The fix is not a list he has to remember to go and read -- a list he
does not open is hidden information, and hidden information loses to whatever is on screen. The fix
is to make the unseen thing **present at the moment he is deciding**, which means *in the reply he
is already reading*. The brief asks for exactly that, and now it has a reason underneath it rather
than being a nicety.

---

## 5. THE FINDINGS THAT PROVE US WRONG

Three, and the third one may invalidate the whole deliverable, which is why it is written down
rather than discovered in round two.

### a) "HE MENTIONED IT" IS NOT "HE REVIEWED IT", AND THE ERROR IS LOPSIDED

The job says to check "whether any ruling of his has ever mentioned it". A machine that greps his
rulings for a name will mark things SEEN that he only went past. A mention is not a judgement.

And the two mistakes do not cost the same:

- A false **"he has seen this"** removes the item from the rota **forever**. It hides the exact
  thing E16 exists to find.
- A false **"he has not seen this"** costs one look, and he says "yeah I ruled on that".

So round two is tuned the *opposite* way to this lane's usual instinct. Normally I tune against
false alarms, because a checker that cries wolf gets muted. Here **precision on the SEEN side is
what matters**: count something as seen only when it carries an explicit judgement, and treat
everything ambiguous as unseen. A slightly long rota is cheap; a permanently hidden item is not.

### b) A LIST OF UNSEEN THINGS IS A BACKLOG, AND A BACKLOG AIMED AT ONE PERSON IS BANNED

EVERYTHING IS A THUMB killed the numbered queue of pending verdicts. A file listing forty things he
has never looked at, handed over as work for him, is that queue with a new name.

The brief's "one of them goes in front of him every time" is therefore not a preference, it is the
only legal shape. And the corollary has to be said out loud: **the other thirty-nine do not wait.**
Under the same law the machine decides and he corrects what he hates. So what round two produces is
a **ROTA, not a queue** -- a rotation that guarantees everything eventually crosses his screen,
while nothing is blocked on him in the meantime.

### c) THE BINDING CONSTRAINT MAY NOT BE THAT HE DOES NOT KNOW. IT MAY BE THAT HE DOES NOT OPEN THINGS

This is the one that could make the whole job moot, and it is in the same record the job came from,
four blind spots further down:

> He built the whole verdict system (judge pages, thumbs, comment boxes, sun mode), then ruled that
> unjudged is dead. In this stretch the art director has judged **127 garments FOR him and he has
> thumbed zero.**

If he has thumbed zero of 127, then telling him *which* things he has not seen does not obviously
change anything, because the bottleneck is not knowledge of the gap -- it is that a thing he has to
go and open does not get opened. And the same record says the one time he did play, he found the
biggest hole in the game in five words.

**So round two has a prior question to answer before it builds a rota:** has any mechanism in this
repo's history ever successfully got him to look at a specific named thing? If the honest answer is
"only what appeared in the reply itself, or what he met while playing", then the deliverable is not
a page and not a list. It is **one paragraph in a reply, and a rota that decides which paragraph**,
and everything else this job might have built would be a file nobody opens -- which would be a
particularly stupid way to fail at a job about things nobody opens.

---

## 6. THE INSTRUMENT DESIGN FOR ROUND TWO (SPEC ONLY, NOTHING BUILT THIS ROUND)

**The matrix.** Rows: every SHIPPED line on the board that reaches a tab. Columns: the tab, whether
any ruling of his carries an explicit judgement on it, where that ruling is, and a risk mark.

**Where "his rulings" come from**, and it is a finite list: quoted lines in `laws/`, the verdict
`.txt` files in `records/`, the "Paolo <date>" quotes the board itself carries, and `CLAUDE.md`.
Round two reports its coverage of those sources as a number and does not pretend to have read
transcripts nobody kept.

**The SEEN bar, from finding (a):** an explicit judgement, not a mention. Everything ambiguous
counts as UNSEEN. The record says so out loud so nobody later reads the rota as an accusation.

**The ordering, from finding (3):** by risk, not by age. Highest risk is a thing on the player's
path in the first minute, or a thing the loop leans on. One item surfaced per round, with the reason
it is that one.

**The prior question, from finding (c):** before the rota, measure whether anything has ever got
him to look at a named thing. If the answer is only "the reply" and "playing", the rota's output is
one paragraph in a reply and nothing else gets built.

**RULE ZERO, and this job has unusually good ground truth.** The blind-spot record already names
both sides: things he ruled on (**the UI at 50%, the zoom, the tutorial pop-up, the cloud**) and
things he has not (**the fold, the animal opening, the perk tree, the reckoning card, the room
fight, the room's own song**). So round two plants both:

- a known-SEEN item must come back SEEN. If it does not, the sweep is blind to his rulings and its
  rota is noise.
- a known-UNSEEN item must come back UNSEEN. If it does not, the sweep is overcounting SEEN, which
  by finding (a) is the failure that hides things forever.

Both must pass or no number is printed.

**The ratchet.** The count of shipped-and-on-screen-and-never-seen may only go down. E3's lesson
again: fail on growth, not on absolute badness.

**Blind spots to declare rather than count clean.** The board is not the game -- a SHIPPED line is a
claim, not a thing on screen, and E11 and E13 both found shipped claims that were not true on the
surface. "Reaches a tab" is a proxy for reachable and this lane has already caught itself measuring
a frame that was not the one the player sees. His rulings before the board existed live in chat
transcripts nobody has, so the matrix can only ever say "no ruling **on record**". And nothing here
measures whether he would LIKE any of it, which is the whole point of putting it in front of him.

---

## ROUTED
Nothing this round. School routes nothing.

One thing noted rather than claimed: finding (c) is a question about the person and not about the
board, and it came out of the coordinator's own record. It is written here for round two to test,
not asked as a question, and not sent to him.

## SOURCES
- Review process for client-side productions (ShotGrid: Pending Review, Pending Director Review, Finals) -- https://knowledge.autodesk.com/support/shotgrid/getting-started/caas/CloudHelp/cloudhelp/ENU/SG-Tutorials/files/SG-Tutorials-tu-review-process-html-html.html
- Tracking statuses for client-side productions (the Need to Review and Director Needs to Review tabs) -- https://knowledge.autodesk.com/support/shotgrid/getting-started/caas/CloudHelp/cloudhelp/ENU/SG-Tutorials/files/SG-Tutorials-tu-tracking-statuses-html-html.html
- Autodesk Flow Production Tracking -- https://www.shotgridsoftware.com/
- Production statuses (CAVE Academy) -- https://caveacademy.com/wiki/production/production-statuses/
- ShotGrid vs ftrack (version history and note traceability) -- https://slashdot.org/software/comparison/ShotGrid-vs-ftrack/
- Requirements traceability matrix: your QA strategy -- https://abstracta.us/blog/testing-strategy/requirements-traceability-matrix-your-qa-strategy
- The ultimate guide to the requirements traceability matrix -- https://www.ketryx.com/blog/the-ultimate-guide-to-requirements-traceability-matrix-rtm
- Test coverage vs traceability -- https://www.testrail.com/blog/test-coverage-traceability/
- What is a traceability matrix (Jama) -- https://www.jamasoftware.com/requirements-management-guide/requirements-traceability/traceability-matrix/
- Availability heuristic -- https://en.wikipedia.org/wiki/Availability_heuristic
- Three things everyone should know about the availability heuristic -- https://fs.blog/mental-model-availability-bias/
- Salience and vividness (recency bias, availability heuristic) -- https://askeladdencapital.com/salience-vividness-mental-model-incl-recency-bias-availability-heuristic/
- Behavioural and ERP characteristics induced by the availability heuristic -- https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12787657/
- Recency bias and staying rational -- https://www.edelmanfinancialengines.com/education/investment-management/availability-bias/

## OUR OWN FILES THIS LEANS ON
- records/BOHEMIA_HIS_BLIND_SPOTS_THE_PERSON_NOT_THE_BOARD_9_6_26.md (blind spot 2 is this job; blind spot 5 is the finding that may invalidate it; and it supplies round two's ground truth on both sides)
- CLAUDE.md: EVERYTHING IS A THUMB (8/9, LOCKED), and UNJUDGED IS DEAD
- records/BOHEMIA_EYES_E11_ROUND_2_THE_NO_READER_SWEEP_9_6_26.md (a claim on the board is not a thing the game can read)
- records/BOHEMIA_EYES_E13_ROUND_2_WHO_ACTUALLY_GETS_THE_TAP_9_7_26.md (measuring the wrong frame, and a sweep that changes its own subject)
- records/BOHEMIA_EYES_E3_HOW_TO_CATCH_A_VISUAL_REGRESSION_9_5_26.md (fail on growth, not on absolute badness)
