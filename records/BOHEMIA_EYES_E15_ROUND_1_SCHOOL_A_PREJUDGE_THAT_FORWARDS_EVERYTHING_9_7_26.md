# EYES AND EARS -- E15 [machine judges] -- ROUND ONE OF TWO: SCHOOL
## A PRE-JUDGE THAT FORWARDS EVERYTHING ADDS WORK
### 9/7/26 -- session eyes-5vql33 -- NO MEASURING WAS DONE THIS ROUND, ON PURPOSE

The job, from the board:

> THE-MACHINE-PRE-JUDGES-SO-DIRECTION-ONLY-RULES -- DIRECTION is holding SIX claimed jobs and
> one open; the art director is the bottleneck because every cook waits on a human judgement.
> E7's score sheet answers seven of ten questions by machine and the contrast rule is a number
> now. School first (how studios split machine checks from art direction), then build the pass
> that runs every cook through the sheet and the card BEFORE it reaches DIRECTION, so DIRECTION
> rules only on what a machine cannot.

Round one is school. Nothing was measured. Two things were read to ground it, because the MODE
asks for the world measured against our repo: **E7's sheet is 7 machine questions and 3 human
ones** (detail order, colour density, saturation budget, value band, grain scale, light, and does
it read at play size, by machine; is it the same material, does it belong to this world, and what
would a stranger call it, by a fresh pair of eyes), and **DIRECTION's section carries 6 open or
claimed lines**.

---

## 1. STUDIOS ALREADY DO THIS, AND THE SPLIT IS THE STANDARD SHAPE

The pattern the job describes is not novel and that is good news. Real asset pipelines run
automated checks **at submit time** on meshes, textures, materials and audio: triangle counts,
texture resolution and compression, LOD configuration, memory flags, naming conventions. Unreal
ships a Data Validation plugin with configurable validators; Unity has Project Auditor and the
Addressables analyzers for size, duplicate dependencies and memory.

And the division of labour is stated plainly in the guidance:

> A strong asset workflow has validation gates, with some checks automated through scripts, DCC
> tools or engine import tests, while **others require review by an art director**, a technical
> artist or a gameplay owner.

**WHAT THIS CHANGES FOR US.** E15 is not inventing a workflow, it is adopting one, and that means
the interesting question is not "should we" but "where exactly is the line". E7 already drew that
line for a cook against its reference: 7 by machine, 3 by a person. Round two should not re-argue
the line; it should build the pass around it.

---

## 2. THE LOAD-BEARING SENTENCE: A LOCAL CHECK GETS BYPASSED UNDER PRESSURE

The single most useful line in the pipeline literature:

> Validation can be enforced through submit triggers or pre-commit tests, where the validator runs
> on every submit and over-budget assets never enter the depot, **since local validation alone
> gets bypassed under deadline pressure.**

**WHAT THIS CHANGES FOR US.** This repo already believes this: A LAW WITHOUT A MACHINE GATE IS NOT
ENFORCED is a pillar law, and E11 found a law whose promised gate did not exist at all. So the pass
E15 builds must end up **in the gate suite**, not in a tool somebody remembers to run. A pre-judge
that a cook can skip on a busy round is a pre-judge that does nothing on exactly the rounds where
it would have mattered.

---

## 3. THE SOFTWARE VERSION OF THE SAME PRINCIPLE, AND THE WARNING INSIDE IT

Code review says it more sharply than art pipelines do: the mechanical parts of review -- style,
conventions, missing error handling -- are exactly what machines are best at, and teams get better
outcomes by automating those and reserving human review for architecture and design. Linters apply
the same rule to every line regardless of who wrote it or who is reading.

And then the warning, which is the part people skip:

> **Excessive nitpicking obscures serious problems** and slows review cycles.

**WHAT THIS CHANGES FOR US.** A pre-judge that hands DIRECTION forty machine findings per cook has
not helped him, it has buried the one thing he was needed for. Whatever round two builds must be
ruthless about what it prints: the machine's job is to be silent when it passes.

---

## 4. THE FINDINGS THAT PROVE US WRONG

Four, and the first and last both change the shape of the deliverable.

### a) A PRE-JUDGE THAT ANNOTATES BUT STILL FORWARDS EVERYTHING **ADDS** WORK

The job says "run every cook through the sheet and the card BEFORE it reaches DIRECTION, so
DIRECTION rules only on what a machine cannot." Read literally, that produces a score card
attached to every cook, and every cook still lands in his queue -- now with more to read.

The bottleneck is **his attention**, not the absence of information. So the only pre-judge that
actually unloads him is one that changes **what arrives**, not what is stapled to it. Two levers,
and both must be in the design:

1. **REMOVE.** A cook that fails a machine question goes back to the cook and never reaches him.
   That is the only outcome that subtracts from his queue.
2. **GROUP.** What survives is batched by *which* human question it turns on, so he rules once per
   decision instead of once per cook.

A card that informs is not a card that unloads.

### b) THE RUBBER STAMP, AND IT HAS A MEASURABLE LEADING INDICATOR

Automation bias is well documented across medicine, aviation and code review: when a system is
usually right, people stop genuinely checking it. The incentive structure makes it worse -- the
tool exists to make people faster, so a reviewer who scrutinises everything is the one slowing
things down, and fast approval means shallow approval. Clinical alert systems see **49 to 96% of
safety alerts dismissed**.

The part worth stealing is that the failure is **measurable in advance**:

> Declining override rates over time, absent documented model improvements, are a leading indicator
> of rubber stamping. Teams that treat a 0% override rate as model validation should treat it as
> **process failure**.

**WHAT THIS CHANGES FOR US, AND IT IS A REAL DESIGN REQUIREMENT.** The pass must record every time
DIRECTION disagrees with the machine's verdict and report that **override rate** every round. If
the rate falls to zero and stays there, the pass has stopped being a judge and become a rubber
stamp, and it must say so about itself. A checker that cannot notice it has been switched off is
the failure this lane exists to catch.

### c) THE BOTTLENECK MOVES, SO ROUND TWO HAS TO MEASURE WHERE IT ACTUALLY IS FIRST

Theory of constraints: you improve the current constraint until it stops limiting throughput, and
then **the focus moves to the next constraint**. And a bottleneck can shift or spread rather than
vanish. Reinertsen's queueing work adds the part that stings: as demand rises, wait times do not
climb steadily, they **skyrocket**, which is why the classic lever on a review queue is smaller
batches rather than faster screening.

**WHAT THIS CHANGES FOR US.** The job asserts DIRECTION is the bottleneck because it is holding six
lines. Six claimed lines is a count, not a queue measurement -- it says nothing about how long each
has waited or whether anything is actually blocked behind them. **Round two measures the queue
before it accepts the premise**, and if DIRECTION is not the constraint, it says so and names the
one that is.

### d) THE REPO ALREADY ABOLISHED THE THING THIS JOB SOUNDS LIKE

**EVERYTHING IS A THUMB (Paolo 8/9, LOCKED)**: "Thumb thumb thumb everything is a thumb." The
default flipped from approve-before to correct-after. Claude decides, builds it, puts it in the
game where he meets it while playing, and he corrects what he hates. A numbered queue of pending
verdicts in a reply is banned outright.

So a pre-judge whose output is *a nicer approval packet for DIRECTION* is rebuilding the machine
that law tore down, one level up. The legitimate shape under our own law is:

> The machine decides. The cook ships. DIRECTION corrects what it hates.

Which means E15's real job may not be "prepare the cook for judgement". It may be **"make the
machine's decision good enough to ship on, and send DIRECTION only the cooks where no defensible
default exists"**. That is a smaller queue by construction rather than a faster one.

---

## 5. THE INSTRUMENT DESIGN FOR ROUND TWO (SPEC ONLY, NOTHING BUILT THIS ROUND)

**Step 0, and it is not optional: measure the queue before accepting the premise.** How many cooks
are actually waiting on DIRECTION, how long has each waited, and is anything blocked behind them?
If the answer is that DIRECTION is not the constraint, round two reports that and stops, rather
than building a machine for a bottleneck that is somewhere else.

**The pass, with exactly three outcomes** -- and only the first one reduces his load:

| verdict | means | where it goes |
|---|---|---|
| **RETURNED** | fails one of E7's 7 machine questions, or the contrast number | back to the cook. **never reaches DIRECTION** |
| **DECIDED** | passes everything a machine can judge, and a defensible default exists | ships, under EVERYTHING IS A THUMB. he corrects it by playing |
| **HIS** | passes the machine but turns on one of the 3 human questions | reaches him, **grouped by which question**, so he rules once per decision |

**The override meter, from finding (b).** Every DIRECTION verdict that contradicts a machine
verdict is recorded. The override rate is printed every round. **A sustained 0% is reported as a
process failure of this pass, not as proof the pass is right.**

**Print nothing on a pass.** From finding (3): the machine's job is to be silent when it passes.
A cook that clears everything produces one word, not a report.

**RULE ZERO.** A pass that returns DECIDED for everything looks exactly like a pass that is working,
which is this job's version of the trap. So round two plants two cooks before trusting any verdict:
one built to fail a specific machine question (wrong value band, or a palette that is not the
world's) which **must** come back RETURNED and must name the question it failed, and one known-good
which **must** come back DECIDED. If the planted failure passes, the sheet is not being applied and
every verdict is void.

**Where it lives.** In the gate suite, from finding (2), because a local check gets skipped on the
busy rounds.

**Blind spots to declare rather than count clean.** A machine question answered on a thumbnail is
not the same question answered on the real surface. E7's 7 machine questions were validated against
one corpus and have not been re-validated since. The pass measures conformance to a reference and
can never measure appeal, which is the whole reason the other 3 questions exist. And a cook that
passes every machine question can still be boring, which is not a defect a machine will ever find.

---

## ROUTED
Nothing this round. School routes nothing.

One thing noted rather than claimed: the job's framing ("so DIRECTION rules only on what a machine
cannot") and EVERYTHING IS A THUMB point in slightly different directions, and round two resolves
that by building for the law rather than for the sentence -- fewer things reaching him, not
better-prepared things reaching him. If that reading is wrong it is the coordinator's to correct,
and it is written here rather than asked as a question.

## SOURCES
- Engine-aware game art: from beautiful assets to shippable content (validation gates, submit-time checks, local validation gets bypassed) -- https://www.ixiegaming.com/blog/engine-aware-art-the-difference-between-beautiful-assets-and-shippable-ones/
- UE5 data validation intro -- https://hartung.studio/blog/2024-09-10_ue5-data-validation-intro.html
- Asset validator with blueprints in Unreal Engine -- https://medium.com/@TechArtCorner/asset-validator-with-blueprints-in-unreal-engine-3895414e27c7
- Game optimization tools and techniques (Perforce) -- https://www.perforce.com/blog/vcs/game-optimization-tools-and-techniques
- Game asset optimization for Unreal and Unity -- https://www.mimicgaming.com/post/game-asset-optimization-unreal-unity
- Software Engineering at Google, chapter 9: Code Review -- https://abseil.io/resources/swe-book/html/ch09.html
- What does "nit" mean in code review (excessive nitpicking obscures serious problems) -- https://www.augmentcode.com/guides/what-does-nit-mean-in-code-review
- Python code reviews, engineering fundamentals playbook -- https://microsoft.github.io/code-with-engineering-playbook/code-reviews/recipes/python/
- Automation bias (agentic engineering glossary) -- https://addyosmani.com/agentic-engineering/automation-bias/
- The HITL rubber stamp problem -- https://tianpan.co/blog/2026/04/15/human-in-the-loop-rubber-stamp
- Human in the loop or rubber stamp -- https://innovationvista.com/governance/real-human-ai-oversight/
- AI explainability: how to avoid rubber-stamping recommendations (MIT SMR) -- https://sloanreview.mit.edu/article/ai-explainability-how-to-avoid-rubber-stamping-recommendations/
- Automation bias in electronic prescribing -- https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5356416/
- Theory of constraints -- https://www.leanproduction.com/theory-of-constraints/
- Flow and queueing theory (LeSS) -- https://less.works/less/principles/queueing_theory
- A dash of queueing theory -- https://teropa.info/blog/2016/04/02/a-dash-of-queueing-theory
- Queueing theory and Kanban -- https://kanbantool.com/kanban-guide/queuing-theory

## OUR OWN FILES THIS LEANS ON
- banks/eyes/BOHEMIA_EYES_REFERENCE_SCORE_SHEET_9_5_26.json (E7: 7 machine questions, 3 human)
- records/BOHEMIA_EYES_E7_THE_REFERENCE_SCORE_9_5_26.md
- CLAUDE.md: EVERYTHING IS A THUMB (8/9, LOCKED), and A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED
- records/BOHEMIA_EYES_E11_ROUND_2_THE_NO_READER_SWEEP_9_6_26.md (a promised gate that does not exist)
- records/BOHEMIA_EYES_E3_HOW_TO_CATCH_A_VISUAL_REGRESSION_9_5_26.md (false-alarm fatigue, the ratchet)
