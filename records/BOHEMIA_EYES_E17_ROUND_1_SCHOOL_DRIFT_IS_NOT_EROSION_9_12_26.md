# EYES AND EARS -- E17 [locked ignored] -- ROUND ONE OF TWO: SCHOOL
## DRIFT IS A DOCUMENT PROBLEM. EROSION IS A BUILD PROBLEM. THE JOB CONFLATES THEM
### 9/12/26 -- session eyes-5vql33 -- NOTHING ON THE SHIPPED SURFACE WAS MEASURED

The job, from the board:

> A-LOCKED-RULING-THE-BUILD-CONTRADICTS -- twice in one day a LOCKED ruling of his sat on the
> shelf while the build did the opposite: Animal is an era (story master 7/19; two lanes built a
> coyote) and THE RIDGE IS THE TITLE SCREEN (opening vision 7/19; RUN shipped a wordmark on a
> void). School first: how studios keep a design bible from drifting off the build (traceability,
> bible-to-feature checks). Then the sweep: every line marked LOCKED in laws/, against what the
> shipped surface actually shows, one verdict each, oldest first.

Round one is school. **No pixel and no sound on the shipped surface was measured.** What was
counted is how the laws are *written*, because that turns out to decide whether the sweep is
possible at all, and the MODE asks for the world measured against our repo.

---

## 1. THE FIELD ALREADY SPLITS THIS IN TWO, AND THE JOB'S TITLE PICKS THE WRONG HALF

The architecture literature names exactly our problem, and its first move is a distinction the job
does not make:

> **Architecture erosion differs from drift; while DRIFT IS A DOCUMENTATION ACCURACY PROBLEM,
> EROSION IS THE ACTUAL DEGRADATION** of code quality and violation of architectural principles.

So a law and a build that disagree is **two different defects wearing one face**:

- **EROSION** -- the ruling is current and the build broke it. That is a build defect. It is what
  the job assumes.
- **DRIFT** -- the build moved on and the document did not. That is a *document* defect, and the
  build may be the more current truth.

**WHAT THIS CHANGES FOR US, AND IT IS THE WHOLE SHAPE OF ROUND TWO.** Our repo already has the
tiebreaker written down: **NEWEST DATE WINS.** So every contradiction round two finds must report
**which side is newer**. A law from 7/19 contradicted by a build from 9/12 is a stale law until
somebody proves otherwise. Reporting all of them as "the build ignored him" would put a
documentation defect on a lane's record and, worse, would tell him his rulings are being ignored
when some of them were superseded by his own later words.

---

## 2. THE GAME-DOC LITERATURE IS BRUTAL AND IT IS ON THE DOCUMENT'S SIDE OF THE BLAME

Straight quotes, because the tone matters:

> **If it has drifted from the build, the document has already failed.**

> The monolithic GDD, the hundred-page bible in the Deus Ex or GTA tradition -- in current practice
> that model is **functionally dead**. Nobody on a shipping team reads a hundred pages, and **the
> moment the build moves, the document is wrong.**

> **A GDD goes stale when changing it is slower than changing the game.**

> When the design changes, **change the doc the same day.**

**WHAT THIS CHANGES FOR US.** `laws/` holds **435 files**. That is the hundred-page bible several
times over, and it grew by accretion, which is the exact failure mode named above. So the prior
going into round two is not "the lanes ignore him" -- it is that some fraction of the 747 LOCKED
lines are simply older than the game. Round two has to be able to tell those apart or it is
manufacturing accusations.

And our repo has the same advice in its own words: **GIT IS THE MEMORY. Commit every decision the
turn it is made.** The literature's "change the doc the same day" is already law here.

---

## 3. THE CURE IS AN EXECUTABLE RULE, AND OUR PILLAR LAW IS ALREADY THAT SENTENCE

The architecture-testing framing is the clearest statement of the cure I found:

> A diagram answers one question: what did we **intend** the structure to be? It never answers the
> question that actually matters in month six: **what is the structure right now?** An executable
> rule converts statements like "Domain should not depend on Infrastructure" into something the CI
> pipeline can evaluate. Now the architecture is no longer only documentation. **It becomes a
> testable constraint.**

The BDD side says the same thing from the requirements end: a Gherkin scenario is a spec, a test
and the documentation **at once**, which eliminates the inconsistency that appears when those are
kept separately, and the requirements *must* stay current **or the automated tests fail**.

**WHAT THIS CHANGES FOR US.** This is not new advice to this repo, it is this repo's pillar law:
**A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED.** So E17's real target is not a list of
contradictions, it is the subset of LOCKED rulings that have no executable rule -- and E11 already
found the worst case of that class: a gate the law index *promised* and that did not exist. Round
two reuses E11's finding rather than rediscovering it.

**And the traceability direction is the other one from E16.** E16 used *forward* traceability (a
ruling with no work). E17 needs **backward** traceability: from the shipped thing back to the
ruling it was supposed to satisfy.

---

## 4. THE FINDINGS THAT PROVE US WRONG

Four, and the first one means the sweep as written **cannot see its own example.**

### a) THE JOB SAYS "EVERY LINE MARKED LOCKED". THE RULING IT CITES IS NOT MARKED LOCKED.

The brief's second example is THE RIDGE IS THE TITLE SCREEN. It is real and it is in a law file.
Here is how it is written:

```
laws/BOHEMIA_ADDENDUM_ACT1_OPENING_VISION_7_19_26.md:88
## THE RIDGE = THE MENU / TITLE SCREEN (locked, Paolo)
```

**Lowercase.** A sweep of "every line marked LOCKED" walks straight past it. Counted across
`laws/`:

| how it is written | count |
|---|---|
| `LOCKED` | **747** |
| `locked` | **306** |
| `Locked` | 13 |

**Thirty per cent of the corpus is invisible to the obvious grep, and the brief's own example is
in the invisible thirty per cent.** That is the single most useful thing this round found, and it
would have produced a confident, clean, wrong sweep.

### b) ONE OF THE TWO EXAMPLES IS ALREADY FIXED, AND IT WAS FIXED BY CHANGING THE DOCUMENT

`CLAUDE.md` now reads:

> three generations that INHERIT (Gen 1 Animal, Gen 2 Human, Gen 3 Angel: **ERAS, not creatures,
> Paolo 9/7**; the player lives all three)

So the Animal contradiction the brief offers as evidence **closed on 9/7**, and it closed by making
the document current. That is the drift reading, not the erosion reading, and it is direct evidence
for finding (a) of section 1. Round two must re-check both of the brief's examples before quoting
them, because a brief written on 9/6 is describing a 9/6 repo.

### c) MOST LOCKED RULINGS ARE NOT MACHINE-CHECKABLE AT ALL, AND CLAIMING 747 VERDICTS WOULD BE FICTION

A LOCKED line is usually intent: what the world is, what a thing means, how he wants it to feel.
There is no pixel to measure for "the ridge is the menu" beyond "is there a ridge on the title
screen", and none at all for most of the rest.

So round two's first output is not verdicts, it is a **classification**, reported as the headline:

1. **MACHINE-CHECKABLE** -- there is a measurable thing on the shipped surface.
2. **ONLY BY LOOKING** -- a person can tell in one glance; no machine will.
3. **NOT CHECKABLE** -- it constrains process or intent, not the surface.

A number in column 1 is worth more than 747 guesses, and this lane has already published the
lesson that a detector which cannot separate the true case from the false one should not ship.

### d) "A LINE MARKED LOCKED" IS NOT "A LOCKED RULING OF HIS", AND THE GAP IS FIVE TO ONE

Of the 747 uppercase LOCKED mentions, only **161** are in the form `Paolo <date>, LOCKED`. The rest
are lanes writing LOCKED about their own decisions -- legitimately, that is how this repo freezes
a mechanism -- but **a lane's own lock is not his ruling.**

Treating them alike would put a lane's words in his mouth, which is the worst possible error for
this particular lane to make. Round two separates **HIS** from **A LANE'S** and only the first kind
can ever be reported as "a ruling of his the build contradicts".

---

## 5. THE INSTRUMENT DESIGN FOR ROUND TWO (SPEC ONLY, NOTHING BUILT THIS ROUND)

**Harvest, case-insensitively, from finding (a).** All of `LOCKED`, `locked`, `Locked`, and the
`(locked, Paolo)` parenthetical form. A case-sensitive harvest is a 30% blind spot and it hides the
brief's own example.

**Split by attribution, from finding (d).** HIS (`Paolo <date>` near the lock, or a quoted ruling)
versus A LANE'S. Only HIS is eligible to be reported as a ruling the build contradicts.

**Classify before verdicting, from finding (c).** Machine-checkable / only by looking / not
checkable, and publish that split as the headline number.

**For each machine-checkable one, name which side is newer, from section 1.**

| what the check finds | the verdict | whose defect |
|---|---|---|
| the surface satisfies the ruling | **SATISFIED** | nobody's |
| the surface contradicts it and **the ruling is newer** | **EROSION** | the build's |
| the surface contradicts it and **the build is newer** | **DRIFT** | the document's |
| no gate exists for it at all | **UNENFORCED** | reuse E11, do not rediscover |

**Reuse, not rebuild.** E11's reader set already knows what the shipped game loads; E13's sweep
already drives the real surface; E11 already found the promised-gate-that-does-not-exist class.
REUSE-FIRST is a law and E15 was a reminder of what ignoring it costs.

**RULE ZERO, and this job's controls are unusually clear.**

- a planted law the build demonstrably **satisfies** must come back SATISFIED;
- a planted law the build demonstrably **contradicts** must come back CONTRADICTED;
- and the one that matters most: **a planted lowercase `(locked, Paolo)` line must be FOUND**,
  because missing it is the failure that silently hides thirty per cent of the corpus.

All three pass or no number is printed.

**The ratchet.** Freeze the count of **EROSION** only -- contradictions where his ruling is the
newer side. DRIFT counts are a documentation backlog that grows honestly as the game moves, and
ratcheting them would red the suite for other lanes doing correct work. Same reasoning as the
citation gap in E16 and the two reported-not-ratcheted numbers in E11.

**Blind spots to declare rather than count clean.** A law file's date is when it was written, not
when the ruling was made, and he rules in voice before anything is a file. A contradiction found in
text is not a contradiction on the surface, which is the mistake E11 and E13 both caught this lane
making. And nothing here can tell a ruling he *withdrew* from one he simply has not repeated.

---

## ROUTED
Nothing this round. School routes nothing.

Two things noted rather than claimed: the brief's Animal example appears already closed, and the
brief's Ridge example is written in a case the brief's own instruction would miss. Both are round
two's to confirm on the surface, and neither is being reported as a defect on anyone's record yet.

## SOURCES
- Architecture drift vs erosion, and conformance checking -- https://earezki.com/ai-news/2026-06-08-architecture-drift-detection-keep-your-code-aligned-with-design/
- Preventing architecture drift with executable dependency rules -- https://www.c-sharpcorner.com/article/preventing-architecture-drift-with-executable-dependency-rules/
- Architecture testing with ArchUnit: stop trusting your diagram, start testing it -- https://loiane.com/2026/07/architecture-testing-java-archunit/
- Introduction to ArchUnit -- https://www.javathinking.com/blog/introduction-to-archunit/
- Architecture erosion, a study of conformance-checking approaches -- https://arxiv.org/pdf/2212.12168v1
- From GDD graveyard to living document -- https://www.wayline.io/blog/lean-gdd-game-design-documentation
- Writing modern game design documents -- https://www.codecks.io/blog/writing-modern-game-design-documents/
- Death of the game design document -- https://mcvuk.com/development-news/death-of-the-game-design-document/
- The living GDD real studios use -- https://allo.io/blog/en/game-design-document-template/
- Executable specifications -- https://www.educative.io/collection/page/10370001/4898915302768640/4527869001203712
- How living documentation and acceptance tests bring documentation benefits -- https://technology.lastminute.com/living-doc-bdd-cucumber-serenity/
- Mastering Gherkin BDD tools -- https://testquality.com/mastering-gherkin-bdd-tools-a-complete-guide-to-behavior-driven-development-testing/
- Gherkin user stories acceptance criteria as the single source of truth -- https://testquality.com/gherkin-user-stories-acceptance-criteria-guide/

## OUR OWN FILES THIS LEANS ON
- laws/BOHEMIA_ADDENDUM_ACT1_OPENING_VISION_7_19_26.md line 88 (the lowercase lock that the brief's own instruction would miss)
- CLAUDE.md: A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED; NEWEST DATE WINS; GIT IS THE MEMORY; and the 9/7 ERAS amendment that closed the brief's first example
- records/BOHEMIA_EYES_E11_ROUND_2_THE_NO_READER_SWEEP_9_6_26.md (the promised gate that did not exist; the reader set)
- records/BOHEMIA_EYES_E13_ROUND_2_WHO_ACTUALLY_GETS_THE_TAP_9_7_26.md (a text claim is not a surface fact)
- records/BOHEMIA_EYES_E16_ROUND_2_THE_CITATION_IS_DELETED_ON_SHIP_9_11_26.md (forward traceability, and why a gap is ratcheted and a count is not)
- records/BOHEMIA_EYES_E15_ROUND_2_THE_JUDGE_ALREADY_EXISTS_9_11_26.md (what ignoring REUSE-FIRST costs)
