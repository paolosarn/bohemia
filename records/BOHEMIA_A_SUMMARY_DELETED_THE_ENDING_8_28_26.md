# TWO WORDS NOBODY CHECKED ARE SITTING AT THE TOP OF THE TRUTH HIERARCHY,
# AND TAKEN LITERALLY THEY DELETE THE ENDING OF THE GAME
# (8/28/26, coordinator sweep 23. A mechanical fix I made, a canon
# question that is his, and a rule the truth hierarchy has never had.)

## 1. THE MEASUREMENT
On 8/26 he ruled, verbatim:
> "BRO THERE ARE NO RUNS. IT IS A FULL GAME THAT WILL TAKE YOU 100 HOURS
> TO COMPLETE BRO. LEVELING UP LEVELS AND GIVES YOU EXPERIENCE FOR
> EXPERIENCE TREE CYBER PUNK ELDERSCROLL PERK AND BONUS SHIT. WILL ALSO
> GO HAND IN HAND WITH ABILITIES AND THE 60 MINI BOSSES IN THE GAME THAT
> GIVE YOU A NEW WAY TO INTERACT WITH BOHEMIA BRO!"
That ruling is right, it was recorded well, and it correctly killed the
word "roguelite" that had been wrong at the top of CLAUDE.md since day
one. **THIS RECORD IS NOT A COMPLAINT ABOUT THAT WORK.**
The law's summary of it says:
> "4. There are no runs. **One character**, ~100 hours, a persistent perk
> tree, and 60 mini bosses..."
and CLAUDE.md's first paragraph — the first thing every session in this
fleet reads, every session — now says:
> "**One character**, ~100 hours, a PERSISTENT experience tree..."
**MEASURED: THE PHRASE "ONE CHARACTER" APPEARS ZERO TIMES IN WHAT HE
SAID.** Grep of his quoted words for "character": 0 hits. It appears once
in the summary and once in CLAUDE.md. It is an inference, and it is
sitting where the fleet reads it as a ruling.

## 2. WHY THAT PARTICULAR INFERENCE IS EXPENSIVE
    live law files mentioning the dynasty / generations:  52
    mentions of "dynasty" across laws/:                  162
laws/BOHEMIA_ADDENDUM_GENERATIONAL_PERSISTENCE_7_1_26.md, still live,
lists under the heading **"the hard constraints, not negotiable"**:
> "**Three generations, ~100 years.** Gen 1 Animal, Gen 2 Human, Gen 3
> Angel. **The player lives all three.**"
And laws/BOHEMIA_ADDENDUM_ACT3_MOONSHOT_STRUCTURE_7_19_26.md, also live:
> "THE MOONSHOT IS ONE-WAY (locked 'in the law'). **The gen-3 (Angel)
> heir** goes and..."
**SO "ONE CHARACTER", READ LITERALLY, DELETES GEN 2, GEN 3, AND THE
ENDING OF THE GAME.** Not a corner of the design. The last act.
And the two "100"s are not the same number and are one skim apart: his
ruling says **100 HOURS TO COMPLETE**; the 7/1 law is literally titled
**"the 100-year problem"**. A session reading fast merges them.

## 3. AND HERE IS THE PART I CANNOT ANSWER, SO I AM NOT GOING TO
**"THERE ARE NO RUNS" AND "THREE GENERATIONS" ARE NOT ACTUALLY IN
CONFLICT.** A run resets you to nothing. A generational handoff inherits
EVERYTHING — the 7/1 law's whole architecture is a fold that carries the
compound, the standings, the territory, the family tree and the unhealed
wounds forward. That is the opposite of a reset. His ruling is satisfied
by the dynasty without changing a word of it.
**BUT HE MIGHT HAVE MEANT IT.** "A full game that will take you 100 hours
to complete" is a perfectly natural way to describe one long life, and a
Cyberpunk/Elder-Scrolls perk tree is a single-character structure in both
of his own references. **I DO NOT KNOW WHICH HE MEANT AND THE DIFFERENCE
IS THE SHAPE OF THE ENTIRE GAME.** That is a canon question, it is his,
and it goes in the queue rather than being settled by whoever writes the
next summary.

## 4. THE FINDING THAT CHALLENGES WHAT WE BELIEVE
**WE BELIEVE CLAUDE.md IS THE TOP OF THE TRUTH HIERARCHY.** It is
literally numbered 1, with the laws at 2 and addenda at 3.
**BUT CLAUDE.md IS A SUMMARY, AND THE HIERARCHY RANKS DOCUMENTS, NOT
FIDELITY.** There is no rule anywhere in it that a summary must contain
only what its source contains. So a single inferred phrase at position 1
outranks fifty-two correct laws at positions 2 and 3 **by construction**,
and it does it silently, and it does it to every session before any of
them have read anything else.
### THE REAL-WORLD AISLE NAMES THIS EXACTLY
Steven Greenberg's BMJ study (2009) traced a medical belief through a
complete citation network — 242 papers, 675 citations, 220,553 citation
paths — and found the belief's authority was manufactured by three
mechanisms. The third one is ours, word for word: **"forms of INVENTION
such as the CONVERSION OF HYPOTHESIS INTO FACT THROUGH CITATION ALONE."**
He also names **amplification**, "the marked expansion of the belief
system by papers presenting no data addressing it." Over ten years,
supportive citations grew sevenfold while critical ones barely grew.
**NOBODY LIED. THE CLAIM GOT PROMOTED BY BEING REPEATED IN A MORE
AUTHORITATIVE PLACE THAN IT STARTED.** That is precisely what happened
here, in two days instead of ten years, because our fleet re-reads its
top document nine times a day.
### AND THE GAMES AISLE SAYS WHAT IT COSTS
Practitioners on documentation drift describe the failure in operational
terms: **"designers tune values against one assumption while engineers
run another,"** and once artifacts fall out of sync **"people stop
trusting the system."** The GDD, they warn, turns from "an X-ray of
creative intent" into "a graveyard of ideas." Our version of the first
one is already live: WORLD is building a valley for a dynasty while
CLAUDE.md tells every new session there is one character.

## 5. WHAT I DID, AND WHAT I DID NOT
**DID (fidelity is mine, canon is not):** CLAUDE.md's top block now
carries HIS WORDS for that clause instead of the inference, and names the
open question in one line so no session silently resolves it. The 8/26
law is untouched except for a pointer — it is his ruling and it is good.
**DID NOT:** decide whether the dynasty lives. Fifty-two laws and the
game's ending hang on it. That is the definition of a canon call.

## 6. THE RULE THIS ADDS, AND ITS GATE
**A SUMMARY NEVER OUTRANKS THE THING IT SUMMARISES, AND A SUMMARY THAT
ADDS A FACT ITS SOURCE DOES NOT CONTAIN IS A BUG, NOT A PARAPHRASE.**
The truth hierarchy has always ranked documents by recency and type. It
has never had a fidelity rule, and this is the second time this month the
same shape has bitten: a gate that was green while its law was broken,
and now a summary that is authoritative while its source says something
else.
GATE (routed): every law bullet in CLAUDE.md names the law file it
summarises, and every distinctive claim in the bullet must appear in that
file. Mutation test: add a phrase to a CLAUDE.md bullet that is absent
from its law -> red. This is cheap because 100% of the bullets already
cite their file; only the claim-matching is new.

## 7. ROUTED
- **SHARED — FIDELITY-1: THE SUMMARY GATE** (§6). It would have caught
  this in one run.
- **COORDINATOR — the question queue** gains this as the next item, ahead
  of the two that were already parked, because it is bigger than both.
- **NOT ROUTED, DELIBERATELY:** any lane "resolving" the dynasty question
  in passing. If a session needs the answer before he gives one, it
  writes the assumption down in its commit rather than into a law.

## 8. CONFIDENCE
- "One character" absent from his quoted words, present once in the
  summary and once in CLAUDE.md: grepped, both directions. **CERTAIN**,
  and I ran the positive control this time — the same grep finds
  "character" elsewhere in the same file, so the instrument works.
- 52 live law files and 162 dynasty mentions: counted. **CERTAIN.**
- That the 7/1 and 7/19 laws are live rather than archived: checked
  laws/ and archive/. **CERTAIN.**
- That the two readings are genuinely both available: my judgement, and I
  have argued both sides above rather than picking. **MEDIUM**, which is
  exactly why it is his call and not mine.
- Greenberg's mechanisms and the drift literature: published. **HIGH**;
  the mapping to us is my argument.

## SOURCES
In-repo: laws/BOHEMIA_ADDENDUM_THERE_ARE_NO_RUNS_AND_COMBAT_IS_RF4_ON_THE_
BEAT_8_26_26.md (his verbatim ruling and the summary line),
laws/BOHEMIA_ADDENDUM_GENERATIONAL_PERSISTENCE_7_1_26.md,
laws/BOHEMIA_ADDENDUM_ACT3_MOONSHOT_STRUCTURE_7_19_26.md, CLAUDE.md's
TRUTH HIERARCHY. Outside: Greenberg SA, "How citation distortions create
unfounded authority: analysis of a citation network," BMJ 2009;339:b2680;
practitioner writing on documentation and version drift in game
production and on the GDD as single source of truth.
