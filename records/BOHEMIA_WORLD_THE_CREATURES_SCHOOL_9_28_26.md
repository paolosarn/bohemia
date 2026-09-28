# MAYBE THE ANIMALS CAME OUT OF A LAB

WORLD lane (chat 02), 9/28/26. Row `[creatures]`, rule 37(n). A school round with
a drawn cook. **Nothing here is canon.**

---

## 0. WHAT HE ASKED FOR, AND THE WORD THAT MATTERS

Paolo, 9/27, in the third votes: de-extinction labs, mammoths and dire wolves,
labs that lost their funding, an AI playing with genetics, or an airborne thing.
Rule 37(n) files it as **a direction, not a law**, and his own word was **"maybe"**.

So this round does not decide what lives in Las Vegas. It finds out what the real
record actually supports, draws three shapes off it, and hands him the fork.

## 1. THE ROSTER HE IS AIMING AT ARGUES BACK, IN ITS OWN WORDS

Rule 12 says measure the premise. The premise here is that we need creatures. We
already have them, and their founding law is the opposite of his direction.

`engine/bohemia_wildlife.js` (PEOPLE, 8/28) ships eight animals at 16x16 with
three frames each, sourced cell by cell to Nevada and Clark County material, and
it says in its own header:

> Nothing on this page is a creature somebody made up.

`engine/bohemia_packs.js` adds dog packs and coyote packs with dens, spacing and
real ethology. The bestiary research
(`records/BOHEMIA_RESEARCH_WHAT_LIVES_IN_A_CITY_OF_CORPSES_8_25_26.md`) built a
three-tier structure and its **section 4 finding is a direct argument against
lab creatures**:

> **WE HAVE BEEN TREATING "REALISTIC" AND "FUN" AS A TRADE. HERE THEY ARE THE
> SAME MOVE.** ... not monsters, but the animals that already live in Las Vegas,
> made numerous and unafraid by ten years of easy food. **A pack of somebody's
> golden retrievers is worse than a mutant, because it is true.**

REALISM FIRST says the realistic option leads and wins by default, and that the
trade is his to make. So the job is not "pick a monster". The job is to find
where a lab origin is **more** real than a mutant, not less.

**And there is a slot waiting for exactly this.** The same research names three
tiers and leaves the third empty on purpose:

> **TIER 3 — THE OWNERS.** Whatever holds the worst blocks. Reserved: the
> Amalgamation and the factions are HIS, and I am not filling that in.

Tier 1 is built. Tier 2 is built. **Tier 3 has been empty since 8/25 and his
direction lands precisely in it.**

## 2. THE REFERENCE TRAP, NAMED BEFORE I FELL IN IT

The obvious reference for lab-made creatures in a post-collapse American desert
is Fallout, and **our law forbids citing it here**. FALLOUT 1 belongs to the
INTERFACE department only (9/6, "2050 rustic"). A REFERENCE GAME BELONGS TO ONE
DEPARTMENT, and citing one outside its department is the same violation as
citing a game he never named.

So the creature question has to be answered from the real world and from
BATTLE BROTHERS, which is mine (the campaign layer and the overworld). That
constraint is not an obstacle here, it is the reason this round found the plant.

## 3. THE REAL RECORD, THREE FINDINGS

### (a) The de-extincted animal of 2060 is not a monster. It is our own animal, bigger and paler.

The dire wolf that made the news in 2025 was **three genetically modified grey
wolves** — Romulus, Remus and Khaleesi — carrying **twenty edits**, fifteen of
them in fourteen genes, aimed at obvious physical traits: **larger bodies,
thicker and paler coats**. Scientists disputed the de-extinction claim
immediately, calling them engineered hybrids with dire-wolf-like traits. By May
2025 the company's own chief scientist said the animals are "grey wolves with 20
edits", that "dire wolves" is a colloquialism rather than scientific
terminology, and that **it is impossible to bring back an extinct organism**.

That is not a science fiction premise. That is a shipped result, and its shape
is small: a familiar animal, a quarter bigger, a shade paler.

### (b) When the money stops, the record is euthanasia, not release.

"The lab lost funding and the animals got out" is the romantic version. The
documented behaviour is the opposite: labs euthanised thousands of mice when
work stopped in 2020; institutions facing federal cuts plan for euthanasia
because studies that cannot continue leave animals that cannot be housed; a
major lab-animal breeder filed for bankruptcy; and welfare campaigners have to
push sanctuaries and fostering as **the alternative to** the default.

So nothing is set free. What is loose is what the paperwork got wrong.

### (c) **THE FINDING THAT PROVES THE OBVIOUS READ WRONG: what escapes is plants.**

The documented record of engineered life escaping containment is almost entirely
botanical. Herbicide-tolerant rapeseed escaped cultivation shortly after its 1995
commercial release and is now feral on roadsides in Canada, the United States,
the United Kingdom, France, Australia, Switzerland, Austria, Sweden and Japan. A
systematic roadside survey in North Dakota found two escaped transgenic
genotypes and called the feral populations **"large and widespread"**. Creeping
bentgrass got out of a field trial in central Oregon. Engineered glyphosate-
tolerant wheat has turned up in unplanted fields in Washington State, the fourth
such US discovery since 2013.

And the same literature says the opposite about animals: terrestrial engineered
livestock are **considered less prone to escape and establishment**, because they
are kept in animal houses, rarely allowed into an open environment, and **each
individual is tagged and monitored**.

**So the realistic lab leak in a valley is not a creature. It is grass.**

### (d) AND OUR VALLEY MAKES THAT HORROR FOR FREE

This repo has enforced since 8/26 that **ACT ONE HAS NOTHING GREEN IN IT**. The
line is in `engine/bohemia_arterial.js` in those words, it is repeated in
`engine/bohemia_cityhall.js` and across the tile forms, and there is an entire
record about hunting the last green out of the valley
(`records/BOHEMIA_THE_VALLEY_WAS_STILL_GREEN_8_27_26.md`).

A valley where green does not exist, with one green thing in it, on the kerb
joint, that the spray was built not to kill. That is AH-01's whole structure —
an ordinary frame with one thing wrong — and we get it from a rule we already
enforce rather than from anything invented.

## 4. THE THREE SHAPES, DRAWN

`tools/bohemia_three_shapes_cook_9_28_26.js` → `slices/vote/WORLD_THREE_SHAPES.png`.
VOTE tab, `world-three-shapes-9-28`.

Every pair is **the thing you already have beside the thing that is off by a
little**. Nothing in the picture is a monster; each panel only bites because its
left half is normal.

| | control (what we ship) | the shape |
|---|---|---|
| **A THE TWENTY EDITS** | our coyote | the same coyote, a quarter bigger, a shade paler |
| **B THE ONE NOBODY COUNTED** | our pale dog | the same dog wearing a numbered ear tag |
| **C NOT AN ANIMAL AT ALL** | a kerb, act one, dead | the same kerb with the thing that got out |

**REUSE-FIRST, proved on the pixels:** every animal pixel is decoded out of
`banks/BOHEMIA_WILDLIFE_SPRITES.js`. No second coyote was drawn. The edited coat
is that same coyote's own four tans, each mixed halfway with the tan above it, so
"it is our animal, changed" is true of the pixels and not just of the caption.

Measured: outline match 100% with size taken out, coat lightness lift 0.106, size
step exactly 1.25x, 1,792 green pixels and **zero of them outside the plant**, 128
tag pixels, and the wrong thing is **1.45% of the frame**.

**The tool refuses itself four ways**, and the first one is the finding: it
refuses if the outline of the edited animal ever moves, because the twenty edits
changed a body size and a coat colour and an animal whose outline moves is a
different animal that nobody made. It also refuses green anywhere outside the
plant, refuses if the wrong thing grows past 6% of the frame, and refuses if it
adds more tones than the five it is allowed.

## 5. THREE TIMES I WAS WRONG BEFORE HE WAS

Kept because the pattern is the point, and because two of these were green.

1. **The first outline check could never fail.** It compared the two 16x16
   sprites and got 100%, which it was always going to get: the edit is a
   recolour, so the silhouettes are identical by construction. It was proving
   that a recolour does not change a shape.
2. **The second one measured size and called it shape.** I rasterised both at
   their drawn scales and it refused at "57% a different silhouette" — which was
   just the 1.25x step, restated. Size already has its own exact check. The
   honest form is size-blind: normalise both outlines to one box, and they must
   match exactly.
3. **"The only bright thing on an ordinary dog" was counting eyes.** I reached
   for the bank's yellow for the ear tag, and that index **is the eye colour of
   every animal in the bank**, so the count came back 420 instead of 128. A real
   livestock ear tag is orange plastic, so the honest fix and the real-object fix
   were the same fix.

And three more the render caught that no check would have: the animals **floated**
(I stood them on their sprite boxes, and the coyote's lowest drawn pixel is three
rows above that, so a size comparison was being made between two things not
touching the same floor); the background **read as a barcode** (three near-black
steps laid as full-width stripes instead of dithered); and the edited coyote came
out **near-white**, which is a different animal on screen and the exact opposite
of the finding. VERIFY ON THE REAL SURFACE is not a formality — the picture had
to be looked at three times.

## 6. WHAT IS HIS, AND THE FORK

Nothing here is canon. Section 5 of the bestiary research reserves which animals
are actually in the game and whether anything is supernatural; rule 37(n) is a
direction with a "maybe" in it.

**THE FORK, in plain words:** does the thing that came out of a lab have a face?

- **A. NO FACE.** It is grass, and a coyote that is slightly wrong. The valley
  never tells you which animals were edited, and the only green in Las Vegas is
  the thing that beat us. This is what the real record supports and it costs
  almost no new art.
- **B. ONE FACE.** Tier 3 gets one engineered thing that holds the worst blocks,
  and A is the world around it.
- **C. NO LAB AT ALL.** The 8/25 finding stands unamended: somebody's dogs are
  worse than a mutant because they are true.

Not asked as a question, because he already answered the shape of it: "maybe".
The default I would build is **A**, because it is the one the record supports and
the one this valley's own rules already make frightening.

## 7. ROUTED

- **PEOPLE** owns the wildlife roster and its packs. If any of this lands, the
  tier-3 slot in the bestiary research is where it goes, not a new module.
- **DIRECTION** owns whether a deliberate green survives the analog horror bible,
  and it is the one thing in shape C that could kill it.
- **COOK** owns a house tile and a street tile at full detail (rule 37a); the
  kerb strip here is a 16x16 study, not that.
- **DYNASTY** was named as the school partner on this row. The de-extinction
  timeline is act material: by act 3 the edited animals are the ordinary ones.
- **LIFE+CITY**: shape C is a terrain state, not a creature, and it spreads. It
  belongs beside the derive I signed last round, because a plant that spreads is
  a thing that gets worse on its own no matter what you did.

---

`[bb creatures]` **Battle Brothers refuses to explain its monsters, on purpose,
and that is the part to take.** Its beasts have folklore, not an origin: the
Schrat is a fabled living tree out of a story told to frighten children, the
Unhold is territorial rather than malicious, and the game offers **no unified
explanation** — some in the world believe the beasts want to end life, others
believe there is nothing supernatural about them at all and they are only wild
animals. The world holds both readings and never settles it.

That is exactly the discipline for shape A. If the game ever tells you which
coyotes were edited, it has answered a question that is scarier open. BB's beasts
are also, without exception, **met on the map as a party you can see and avoid**,
which is rule 33's overworld: a thing in the valley is a marker with a speed and
a territory, not a spawn. Ours should arrive the same way.

---

## SOURCES

- [Colossal Biosciences dire wolf project — Wikipedia](https://en.wikipedia.org/wiki/Colossal_Biosciences_dire_wolf_project)
- [This company claimed to 'de-extinct' dire wolves. Then the fighting started — Nature](https://www.nature.com/articles/d41586-025-02456-3)
- [Is the dire wolf back from the dead? Not exactly — Science (AAAS)](https://www.science.org/content/article/dire-wolf-back-dead-not-exactly)
- [Game of clones: Colossal's new wolves are cute but are they dire? — MIT Technology Review](https://www.technologyreview.com/2025/04/08/1114371/game-of-clones-colossals-new-wolves-are-cute-but-are-they-dire/)
- [Dire wolf debate raises concerns on scientific overhype — C&EN](https://cen.acs.org/biological-chemistry/gene-editing/Dire-wolf-debate-raises-concerns/103/web/2025/04)
- ['It's heartbreaking.' Labs are euthanizing thousands of mice in response to coronavirus pandemic — Science (AAAS)](https://www.science.org/content/article/it-s-heartbreaking-labs-are-euthanizing-thousands-mice-response-coronavirus-pandemic)
- [Amid federal cuts, here's why UW's lab animals could be euthanized — KUOW](https://m.kuow.org/stories/amid-federal-cuts-heres-why-uws-lab-animals-could-be-euthanized)
- [Inotiv, Breeder of Laboratory Animals, Files For Bankruptcy — Bloomberg Law](https://news.bloomberglaw.com/bankruptcy-law/inotiv-breeder-of-laboratory-animals-files-for-bankruptcy)
- [A Review of the Unintentional Release of Feral Genetically Modified Rapeseed into the Environment — PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC8698283/)
- [The Establishment of Genetically Engineered Canola Populations in the U.S. — PLOS One](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0025736)
- [The GM Contamination Register: recorded contamination incidents associated with GMOs, 1997–2013 — Springer](https://link.springer.com/article/10.1186/s40550-014-0005-8)
- [Use of GMOs Under Containment, Confined and Limited Field Trials — FAO](https://www.fao.org/4/i1252e/i1252e01.pdf)
- [Schrat — Battle Brothers Wiki](https://battlebrothers.fandom.com/wiki/Schrat)
- [Unhold — Battle Brothers Wiki](https://battlebrothers.fandom.com/wiki/Unhold)
- [Beasts — Battle Brothers Wiki](https://battlebrothers.fandom.com/wiki/Beasts)
