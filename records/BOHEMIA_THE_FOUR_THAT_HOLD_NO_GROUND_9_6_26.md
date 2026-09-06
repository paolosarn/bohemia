# THE FOUR FACTIONS THAT HOLD NO GROUND
FACTIONS lane · VAMILY row `[hidden factions]` THE-OTHER-FOUR · 9/6/26

## THE ONE LINE
Four factions in his own graph could never appear on a single person in the
valley, and each of them already had an authored line nobody could ever hear.
They exist now — as a hidden second affiliation carried by people who visibly
belong to something else, which is what his note says they are.

## WHAT THE ROW ASKED FOR FIRST, AND WHAT IT MEASURED
*"the four non-selectable factions: do they exist anywhere a player can meet
them? measure, then place a presence or write [PENDING Paolo]"*

Measured on the walked surface before anything was built:

    5,148 people
      566 affiliated
       14 outfits, and they are EXACTLY the fourteen selectable ones
        0 people carrying Pures, Panthers, La Familia or Triads
        4 authored lines for those four, sitting in bohemia_people.js, unhearable

Four factions written down and unreachable. The authored-but-unread disease this
lane keeps a gate for.

## WHY THEY WERE UNREACHABLE, AND IT WAS NOT A BUG
`factionOf()` derives allegiance from the fourteen **seats**. His graph types
these four `social_force`, not `selectable`, and gives them no seat — correctly,
because the note says what they are in one sentence:

> **"Members inside other factions.** Larger in act1 (crash drove identity
> clustering), fixed ceiling, stagnant across acts."

They are not a place. They are a second, hidden affiliation. A rule keyed to
seats can never produce one, so no larger base list would have fixed it.

## THE PART I REFUSED TO DERIVE
The obvious reading of four identity-supremacist groups is that membership
follows a person's heritage. **The game models no such thing** — `personOf()`
carries a look seed, an id seed, a language and a role, and nothing about
ancestry — and inventing one in order to assign somebody to a supremacist group
would be authoring the most sensitive content in his canon. MECHANISM-MINE /
CONTENTS-PAOLO'S, and that is contents.

**What is derived instead is which of the four ORGANIZES A BLOCK.** That is
geography, and it is exactly what his own note describes: *"crash drove identity
CLUSTERING"*, and clustering is a thing that happens to places. Real movements of
this kind are neighbourhood organizations. A block has one working it or it does
not; a member on that block belongs to whichever one is there.

Nothing anywhere says a word about any person's ancestry, because the game does
not know and this rule does not ask. The gate locks it structurally: **one person
walked across the map comes back as more than one of the four**, which a rule
reading heritage could not do.

## THE RESEARCH, BOTH AISLES
- **Organized membership is tiny.** The SPLC counts 800+ active US hate groups
  and **most have fewer than twenty members**. A share of a percent, not a fifth
  of a valley — which is his "fixed ceiling" already written down.
  [SPLC via SAGE, hate groups](https://sk.sagepub.com/ency/edvol/embed/socialproblems/chpt/hate-groups)
- **Scarcity really does cluster people** — the half that backs his canon. Across
  82 countries and 150,000+ individuals, **ingroup trust rises after a disaster**;
  scarcity raises benevolence toward your own and fear of everyone else
  (realistic group conflict theory).
  [Natural disasters and social capital, ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S2212420923003400) ·
  [Perceived resource scarcity moderates common-threat cooperation, SAGE](https://journals.sagepub.com/doi/10.1177/19485506231195501)
- **THE FINDING THAT ARGUES WITH US.** Allport: a preference for the ingroup is
  **not** always accompanied by hostility toward outgroups, and the measured
  outgroup-trust effect is the weak, unreliable half of that result. The disaster
  literature's headline is the *opposite* of the war-of-all-against-all — people
  cooperate. So the crash does not turn the valley supremacist. It produces a
  great many people who hold tight to their own, and a **small hard core** who
  turn that into supremacy. That is precisely "members inside other factions"
  with a fixed ceiling, and it is why this ships as a thin layer under the
  fourteen rather than as a fifteenth outfit.
  [Ingroups and outgroups, EBSCO](https://www.ebsco.com/research-starters/social-sciences-and-humanities/ingroups-and-outgroups)
- **Where, not just how many.** Realistic group conflict theory puts the driver
  on competition over resources, so this is denser on poor ground — and the worth
  of a block is already measured and shipped by `[who holds]` (9/6), so the
  valley varies by itself with no second table invented.

## THE NUMBERS
| | before | after |
|---|---|---|
| people who could carry one of the four | **0 of 5,148** | 94 |
| share of the valley | 0% | **1.83%** |
| of the four, reachable | 0 | **4 of 4** |
| authored lines a player could hear | **0 of 4** | **4 of 4** |
| carriers by force | — | Panthers 55 · La Familia 17 · Pures 16 · Triads 6 |
| blocks with one organizing them | — | 1,968 of 9,216 (21.4%) |
| block-level spread across the four | — | 515 / 491 / 482 / 480 (even) |
| rate on the rich half of the valley | — | **0.81%** |
| rate on the poor half | — | **2.19%** |
| act 1 vs act 3 | — | act 3 lower, per his "stagnant across acts" |

**Panthers 55 against Triads 6 is reported, not tuned.** The block draw is even
(515/491/482/480); the imbalance is that Panthers happened to land on populous
blocks and Triads on sparse ones. That is a real consequence of making this
geography, and flattening it would erase the thing that makes the layer mean
anything. Worth watching if a player can go a whole game without meeting a Triad.

## TWO THINGS THAT WOULD HAVE SHIPPED WRONG
1. **The poverty scaling was dead on arrival.** The first cut asked how rich a
   block is as a share of the richest, and the richest is the **Strip**:
   2,267,749 against a second place of 209,223 and a median in the low thousands.
   Every other block came out at essentially zero, so a scale built to separate
   rich ground from poor put **5,049 of 5,148 people in one bucket**. It is a
   RANK now — sort the blocks, hand each one its position — so half the valley is
   above the middle by construction whatever the top block is worth.
2. **A carrier could not say anything.** The line bucket went in below
   `bucket(person.role)`, which answers for everybody, so it could never speak.
   Measured: 40 carriers, six acts each, **240 askings and zero force lines**.
   This organ already carries a paragraph about the identical defect for
   reactions — *"this function returned at, faction and when and linesFor() looks
   for met and rung before any of those"* — and it was rebuilt one screenful
   lower. What somebody quietly belongs to is a fact about the person; their
   shift is a fact about the hour.

## AND IT STAYS HIDDEN
A carrier says the thing about a quarter of the time and otherwise sounds exactly
like everybody else on their block. A carrier who announces it every time is not
hidden, they are labelled — you would read the whole layer off the first sentence
and never have to find anything out. Measured on the demo: ordinary lines
outnumber force lines.

**The words are not mine.** All four lines were already authored and are
deliberately oblique (the Pures line is *"We keep to what we know. It's kept us
this long."*). This row built the machinery that lets them be heard; what any of
these four say is the WORDS lane's and his.

## HIS DOORS, BOTH EMPTY
- `BohemiaAgents.FORCE_BLOCK['12,40'] = 'Triads'` puts whoever he wants on
  whatever block he wants, and wins over the derived answer.
- The rates are on named constants and are mine (*a number is never his
  question*, the coordinator 9/5).

## GATES
`faction_membership_gate` 74/0 — extended, not duplicated; holds the rule,
including the structural proof that no ancestry is read, and F2 measures that the
OLD rule could never produce one of the four.
`faction_between_gate` — new pass V on the demo file a stranger opens: all four
exist, all four can be heard, and mostly they are not.
