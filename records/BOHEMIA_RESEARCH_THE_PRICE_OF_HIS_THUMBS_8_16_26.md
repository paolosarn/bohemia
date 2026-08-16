# RESEARCH — THE PRICE OF HIS THUMBS: WE ARE PAYING FOR A NARROW
# GENERATOR WITH HIS ATTENTION (8/16/26, coordinator sweep 14 catch;
# doctrine §4b — both aisles, anti-yes-man, measured in our own records)

## THE FALSIFIABLE QUESTION
The scarcest resource in this project is not compute, art or time — it is
PAOLO'S ATTENTION. Question: is the judgment pipeline spending it well,
and is anybody measuring?

## THE MEASUREMENT (every SFX verdict record he has ever filed)
| DATE | KEPT | KILLED | BALLOT | KEEP RATE |
|---|---|---|---|---|
| 7/30 | 39 | 23 | 62 | **62%** |
| 8/7 | 62 | 70 | 132 | 46% |
| 8/9 | 63 | 79 | 142 | 44% |
| 8/12 | 98 | 174 | 272 | 36% |
| 8/14 | 106 | 226 | 332 | 31% |
| 8/15 | 119 | 247 | 366 | **32%** |
THE BALLOT GREW ~6x AND THE KEEP RATE HALVED. In the last sitting he
pressed 366 buttons to keep 119 things. Across the whole series he has
made roughly **1,350 judgment calls on sound effects alone** — and the
yield per press has fallen every single sitting but one.
AND THE NEWEST BATCH IS WORSE THAN THE TREND: this week's SFX-06 came
back **34 of 35 dead** (his "400/400" sitting). A 3% keep rate.

## THE MECHANISM, AND THE LANE FOUND IT WITHOUT NAMING IT
Two commits this window explain the whole curve:
- "USE MORE INSTRUMENTS: he had a **602-voice rack in the same file** and
  the sound engine had never called one of them."
- "HIS 400/400: SFX-06 died 34 of 35, and **the instruction inside the
  rejection names a 602-instrument rack this lane has never touched**."
So every candidate in every one of those ballots was drawn from a tiny
corner of the available space, while 602 instruments sat unused IN THE
SAME FILE. The generator was mining an exhausted vein, and the response
to a falling hit rate was A BIGGER BALLOT. We compensated for narrow
search with his thumbs.
THE THIRD SYMPTOM, same window: "I had shipped SFX-07 on the same ids he
killed hours earlier, so **his own DOWN thumbs hid it**." A rejection is
attached to an ID, so re-using an id makes new work invisible to the man
who has to judge it. His past judgments are now suppressing his future
ones.

## AISLE 1 — THE REAL WORLD: THIS IS THE EXPERT-ANNOTATION BOTTLENECK
Machine learning has one canonical answer to "an expensive human must
label things," and it is ACTIVE LEARNING: do not label MORE, label the
MOST INFORMATIVE. The practice is explicitly a shift "from mass labeling
to targeted data curation," selecting items by uncertainty and density so
that a fraction of the labels reach the same result. The bottleneck is
never the labels; it is the human, and the whole discipline exists to
spend that human's attention where it changes an outcome.
Read against our table: a ballot of 366 items drawn from one corner is
mass labeling. Most of those 247 DOWN presses carried almost no
information, because they were near-duplicates of things already killed.

## AISLE 2 — GAMES: QUALITY-DIVERSITY, NOT QUALITY-VOLUME
Procedural content research settled the same point for generators.
QUALITY-DIVERSITY algorithms (MAP-Elites and kin) do not sample more —
they ILLUMINATE the space: partition a behaviour space, keep the best
candidate PER CELL, and enforce diversity while searching, which "uncovers
a variety of high-performing individuals" instead of a heap of neighbours.
The literature specifically frames this as the right tool for
MIXED-INITIATIVE DESIGN — a human designer steering a generator — which
is exactly our judge-page pipeline. The unit of a good batch is COVERAGE
OF THE SPACE, not count.

## THE CHALLENGE FINDING (against our own FACTORY LAW and his 8/9 law)
FACTORY LAW is the first law in this repo: "every system is a mass-
production factory: typed spec, generator, BATCH OUTPUT, kill/approve
pipeline." Volume is baked into our doctrine, and it has been read as
"bigger batch = better odds." THE DATA SAYS THE OPPOSITE: the batch grew
six-fold and the keep rate halved, because volume without diversity is
just resampling. FACTORY LAW needs a companion clause, not a repeal:
**A BATCH'S VALUE IS ITS COVERAGE, NOT ITS COUNT.**
And it collides with his own EVERYTHING IS A THUMB (8/9), which exists
precisely because "we turned him into an approvals queue." A 366-item
ballot IS an approvals queue — it obeys the letter of the judged-domain
exception (sound is genuinely his ear to rule) while breaking its spirit
harder than the practice the law was written to kill.
THE HONEST OTHER SIDE, stated because it is real: sound is a domain where
he WANTS to choose, and his ear is the only instrument. The finding is
NOT "stop asking him." It is that we are asking him the wrong questions —
hundreds of near-identical ones — and calling the result diligence.

## THE DECISION / WORK ORDER
1. THUMB YIELD IS NOW A TRACKED NUMBER (SOUNDS + any batch-cooking lane):
   every judge page records kept/total and the trend. A FALLING YIELD IS A
   STATEMENT ABOUT THE GENERATOR, NOT ABOUT HIS TASTE. Below ~40% the
   correct response is a better generator, never a longer ballot.
2. DIVERSITY GATE BEFORE THE BALLOT: candidates are placed in a parameter
   space (for SFX: the synth vector, and now the 602-instrument rack) and
   near-duplicates are collapsed — one per cell, MAP-Elites style. If the
   generator cannot fill N distinct cells, the batch is N, not 300.
3. HARVEST THE 843 DEAD SOUNDS: his kills are a labelled taste dataset,
   the most valuable one we own. Extend GRAVEYARD IS FINAL from IDENTITY
   to NEIGHBOURHOOD — no candidate ships to a ballot if it sits inside a
   killed candidate's cell. Dead things stay dead; so do their twins.
4. NEVER REUSE A KILLED ID: a new candidate always gets a new id, or his
   own DOWN thumb hides it (measured this week). One-line fix, real bug.
5. BALLOT CAP: no sitting exceeds a set size. If the generator cannot
   produce that many DISTINCT candidates, that is the finding, and the
   turn's work is the generator.
OWNERS: SOUNDS runs it first (it has the data and the pain); the rule is
fleet-wide for any lane that cooks batches — ART cooks the same way.

## CONFIDENCE
The verdict table: counted directly from records/*SFX_VERDICT*.txt, high.
The 602-instrument rack and the id-collision: the lanes' own commits this
window, high. Active learning and quality-diversity: standard published
practice, high. The causal claim — that narrow sampling CAUSED the
falling keep rate — is inference, flagged; it is strongly supported by
the 602 unused instruments but it has not been tested by running a
diverse batch. Test 1 is item 2 above.

Sources: arxiv.org/pdf/1907.04053 (Procedural Content Generation through
Quality Diversity) and arxiv.org/pdf/2304.01642 (Interactive Quality
Diversity for design-space exploration); emergentmind.com MAP-Elites
overview; medium.com/@juanc.olamendy active-learning deep dive and
hyper.ai active-learning summary (mass labelling -> targeted curation);
plus this repo's own records/*SFX_VERDICT*.txt series and commits
698f6f6, dadf6e9, ea669ba.
