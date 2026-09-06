# EYES AND EARS -- E11 [pixels only] -- ROUND ONE OF TWO: SCHOOL
## A RULING THAT LIVES ONLY AS PIXELS
### 9/6/26 -- session eyes-5vql33 -- NO MEASURING WAS DONE THIS ROUND, ON PURPOSE

---

## WHY THIS RECORD HAS NO NUMBERS IN IT

Paolo changed this lane's MODE on 9/6 (VAMILY.md, EYES AND EARS):

> "eyes and ears gotta still be going to school bro, rounds of big brain research.
>  Maybe each request for eyes and ears becomes a round of online research for that
>  topic before it does it, so maybe eyes and ears takes 2 rounds."

The law that came out of it: **every job in this lane is two rounds and never one.**
Round one is school, and school does not measure. Round two builds the instrument
and runs it, and its record must name which finding from round one changed how it
measured.

So this record contains what the world already knows about E11's problem, the name
the world gives it, the instrument the world already built for it, the counter-finding
that proves our own job title wrong, and the design for round two. It contains no
census, no counts, no lane names and no defect lines. Those are round two's, and a
lane that produced them here would have skipped school.

E10 shipped 9/5 with one round because the two-round law did not exist yet. Its board
line says so rather than pretending otherwise.

---

## 0. THE JOB, IN THE COORDINATOR'S WORDS

> A-RULING-THAT-LIVES-ONLY-AS-PIXELS -- standing sweep from the new law: find every
> decision of Paolo's that exists ONLY as rendered pixels or browser storage and not
> as a file the game can read. His faction colours were one and they blocked three
> lanes for weeks. List them, name which lane owes the file, and re-run the sweep on
> every ship.

The precedent is real and it is written down. COLOUR IS TERRITORY (Paolo 8/26, LOCKED)
says a faction's colour is a required second channel of identity, "coordinated,
saturated, and nobody else's". WORLD's own STATE line on the board still ends:

> "Colour stays his (COLOUR IS TERRITORY): there is no faction colour table the walked
>  surface can reach, so the tell is the light and the name arrives in words."

A LOCKED law, a shipped territory system, and the mechanic it was written for cannot
run, because the ruling never became a thing a parser could open. That is the disease.

---

## 1. THE WORLD ALREADY HAS A NAME FOR THIS: THE ARTIFACT GAP

The design-handoff literature calls it exactly what it is:

> "The visible artifact exists, but the buildable artifact does not."

and it names a **second** gap beside it, the **context gap**: "missing intent -- the
team lacks the why behind the UI: the user problem, the business rule, the research
insight, the content constraint, the edge case that drove a decision." The classic
symptom is a developer receiving a meticulously annotated file and rebuilding from
screenshots anyway, because the artifact was visible but not buildable. Roughly nine
in ten designers and developers say the handoff is broken.

**WHAT THIS CHANGES FOR US:** E11 was written as one problem and it is two. A ruling
can be stranded because the VALUE never became a file (artifact gap: nobody can read
`#B01C1C`), and a ruling can be stranded because the REASON never became a file
(context gap: the file says `#B01C1C` and the next lane changes it because nothing
records that Paolo picked it and why). Our faction colours are the first kind. The
`draft:true` convention this repo already uses is a partial answer to the second kind,
because it marks a value nobody ruled on. The sweep in round two therefore has to
carry both columns, or it will "fix" a ruling into a bare number and lose it a second
way.

---

## 2. THE FIX HAS A STABLE FILE FORMAT NOW (AND THAT IS NEW)

The W3C Design Tokens Community Group shipped the **first stable version of the Design
Tokens Format Module (2025.10) on 28 October 2025**. Before that, "design tokens" were
a buzzword whose underlying format was, in one write-up's words, "tool-specific
fiction": three tools exporting the same value in three different JSON shapes.

The stable shape is small and it is the right shape for us: a token is `$value` plus
`$type`, and a token can **reference another token by path**, so `button-primary-bg`
points at `color-blue-600` rather than repeating a hex. That reference is the whole
trick. It is what turns a pile of values into a system where one edit moves everything
that meant it.

**WHAT THIS CHANGES FOR US:** when round two names what a lane owes, it should not say
"write down the hex". It should say "write the token file, and make everything that
meant it point at the token". A faction colour table is not fourteen hexes; it is
fourteen names, each with a value, that outfits and lights and map ink all reference.
Otherwise the second copy drifts, which is section 4's disease.

---

## 3. GAMES SOLVED THIS AS DATA-DRIVEN DESIGN, AND THE LOAD-BEARING RULE IS "PICK ONE"

The game-industry version of the same idea:

- **Data-driven design** means the rules live in data assets, not in hardcoded values
  scattered through code. Programmers build behaviours and tools; designers and artists
  drive them with data.
- **Unity ScriptableObjects**: lightweight assets holding structured data, shared by many
  objects, so a designer changes enemy health without opening code.
- **Unreal DataTables**: authored in a spreadsheet, imported as a table. The guidance is
  blunt and it is the sentence that matters most in this whole section: **pick ONE source
  of truth, the spreadsheet or the editor, and stick with it**, with the spreadsheet
  recommended as canonical.
- Supercell ships Clash Royale and Brawl Stars with the content in CSV.

**WHAT THIS CHANGES FOR US:** the deliverable of E11 is not "more files". It is "one
file per ruling, and everything else points at it". A lane that answers a STRANDED
verdict by adding a second table has made the problem worse, not better, and round
two's verdict words have to be able to say so. Hence ORPHAN and DRIFTED in section 8,
not just a pass/fail.

---

## 4. THE INFRASTRUCTURE WORLD HAS THE SAME DISEASE, WITH A NAME AND A STANDING INSTRUMENT

This is the closest match to E11's "re-run the sweep on every ship" clause, and it is
worth stealing wholesale.

- **ClickOps**: any change made outside a codified, version-controlled workflow. Somebody
  clicked it in a console. It is live and it is real and it is in no file.
- **Configuration drift**: the environment gradually stops matching what the files say,
  because changes were made "ad hoc, without being recorded or tracked".
- **GitOps** answers it by declaring everything and treating the repo as the single source
  of truth: state what you want, not how to get it.
- **Drift detection** is the standing machine. Terraform compares state against the declared
  configuration and resolves the delta; CloudFormation has explicit drift detection for the
  journey "from ClickOps to governed IaC"; ArgoCD and Flux detect drift continuously and can
  auto-remediate.

**WHAT THIS CHANGES FOR US:** it splits round two's job cleanly into two machines of very
different cost. Machine one asks *does a readable file exist and does anything read it* --
cheap, static, runs on every ship. Machine two asks *does the value on the screen still
match the file* -- expensive, needs the live surface and a screenshot, and is the same
shape as this lane's existing pixel work. Round two builds machine one and specifies
machine two rather than half-building both. A drift checker that is only sometimes right
is worse than no drift checker, because a red light nobody trusts gets ignored, and this
lane has already written down that lesson once.

---

## 5. THE SWEEP ITSELF ALREADY EXISTS, TWICE, IN MATURE FORM

I do not need to invent the instrument. Two whole families of linter do exactly this
job in other domains, and both are "find the literal where a reference belongs":

**Colour / token enforcement**
- stylelint `color-no-hex` disallows hex colours outright.
- `scale-unlimited/declaration-strict-value` flags hardcoded values for named properties,
  e.g. `[["/color/", "font-size", "padding", "margin"], {"ignoreKeywords": ["inherit","transparent"]}]`.
- The pattern people hand-roll is a regex over `#[0-9a-fA-F]{3,6}` with a "use the custom
  property" message.

**Hardcoded text / i18n**
- `eslint-plugin-i18next`'s `no-literal-string` finds literal strings shown to users.
- `i18n-lint` walks HTML and templates for text nodes and attributes that look like
  hardcoded strings, as a CLI, a library or a Grunt plugin.
- `@spaced-out/eslint-plugin-i18n` goes further into template literals, binary, logical and
  conditional expressions, which is the honest admission that a naive scan misses values
  that are assembled rather than written.

**WHAT THIS CHANGES FOR US, AND IT IS THE BIGGEST PRACTICAL LESSON:** every one of these
tools ships an **exclude/include list of regular expressions**, and that is not a
convenience feature, it is the reason they survive contact with a real codebase. A sweep
with no allowlist produces hundreds of hits, gets muted, and dies. This lane already met
that failure with false finding #3 in round one and wrote the rule down. So round two's
sweep ships with an explicit ignore list from day one, and the ignore list is part of the
record, not hidden in the tool.

The other lesson is the assembled-value one: a value the code builds at runtime out of
pieces is invisible to a text scan. Round two must say out loud which class of ruling its
scan cannot see, rather than reporting a clean zero over it. That is RULE ZERO from E9,
arriving from a completely different direction.

---

## 6. WHY IT COSTS SO MUCH: GROUNDHOG DAY, AND WHY ADRs EXIST

The architecture-decision-record literature names the two ways a decision dies:

- **The Groundhog Day anti-pattern**: decisions get re-litigated endlessly because nobody
  knows why the original was made.
- **Email-Driven Architecture**: the decision was communicated in a thread and is simply
  gone. Most decisions are reached verbally in a meeting and are "sooner or later lost or
  forgotten".

The cost list is our cost list, word for word: teams reinvent the same patterns and the
same mistakes, drift becomes invisible, onboarding slows, and the difference between a
healthy and a fragile system can be whether someone wrote it down or whether that person
still works here. Two competing implementations of the same thing is called out
explicitly as the classic symptom.

**WHAT THIS CHANGES FOR US:** the faction colours were a Groundhog Day. He ruled on 8/26.
The ruling did not become a file. Three lanes asked again. And this repo has the exact
structural risk the ADR literature warns about, in a sharper form than a normal studio: a
chat is a person who does not still work here the moment its context ends. **In this
project every decision is one context window from being tribal knowledge.** That is the
argument for E11 being a STANDING sweep and not a one-time cleanup, and it is the
strongest sentence in this record.

The ADR shape is also the answer to the context gap in section 1: context that forced the
decision, the decision with its justification, the consequences. Our `laws/` folder is
already an ADR set in everything but name -- each law file quotes Paolo, dates itself, and
says what it amends. What the laws lack is the machine-readable half: the value, in a file,
with a pointer from the law to it and back.

---

## 7. THE ART-PIPELINE WORD FOR IT IS "BAKED"

Art pipelines have known this failure for decades and their vocabulary is precise:

- A **non-destructive source asset** generates one or more **delivery assets**. Characters
  are kept as a design version with full parametric controls plus an export version with
  baked geometry and simplified materials.
- An **import-based pipeline** never modifies the source, so the same source can be
  reprocessed many times with different settings and no quality loss. An **export-based**
  pipeline bakes at conversion time and the engine references the baked result, so changing
  your mind means redoing the work.
- The rule of thumb: **every asset should be easy to track back to its source without
  relying on "just remembering"**.

**WHAT THIS CHANGES FOR US:** "baked" is the correct word for a stranded ruling and it is
better than "lost". The decision is still visible; it is just no longer parametric. And it
gives the sweep a real second question beyond "does a file exist": *can we get back to the
parameters?* A hex we can sample off a screenshot is recoverable. A ruling like "coordinated,
saturated, and nobody else's" sampled off fourteen outfits is not, because the sampling
cannot tell a ruled colour from an accident of the renderer.

---

## 8. THE COUNTER-FINDING: THE JOB'S OWN TITLE IS WRONG

Every research round in this lane owes one finding that proves us wrong. This is it, and it
is not a technicality -- it changes what round two counts.

**The job is called A-RULING-THAT-LIVES-ONLY-AS-PIXELS, and it treats "it lives as pixels"
as the defect. That is false.** Encoding data in an image is an established, legitimate,
widely used game practice:

- Colour-coded pixels standing for tiles or objects, with the image editor used as the level
  editor, is a normal workflow with libraries built for it.
- If players can share an image they can share game data, and image encodings can be a third
  to a half the size of the equivalent text file.
- Aseprite imports a palette directly **from an image**, and Lospec's own instructions treat
  a PNG as a first-class palette container alongside `.gpl` and `.pal`.

So a PNG can be a perfectly good source of truth. The `.gpl` palette format is a text file
and the PNG palette is an image, and both are *readable*; that is the only property that
matters.

**THE CORRECTED RULE, AND ROUND TWO WILL USE THIS ONE:**

> The defect is not the container. The defect is **NO READER**. A ruling is stranded when
> nothing the shipped game loads can turn it into a value without a human looking at it.

Two consequences that flip results:

1. **Our PNG corpus is not automatically guilty.** `records/target` is full of PNGs. If a
   loader parses one, it is LIVE, and a sweep that flags it for being an image is lying.
2. **Our data files are not automatically innocent.** A JSON table nothing imports is worse
   than a PNG something parses, because it *looks* answered. That is why round two needs a
   separate verdict word for it -- ORPHAN -- and why the sweep must check reachability from
   what the page actually loads, not just existence on disk.

And a third consequence that saves a lane an argument: browser storage is genuinely
different from both, and the web literature is unanimous about why. Client state should
function as a **cache**, with the real source of truth elsewhere; `localStorage` is
synchronous and janks the main thread on mobile, is readable by any script on the page, and
is one cleared browser from gone. **A save key is a session, never a ruling.** Storage gets
no benefit of the doubt in round two even though pixels do.

---

## 9. THE INSTRUMENT DESIGN FOR ROUND TWO (SPEC ONLY, NOTHING BUILT THIS ROUND)

**The unit** is a RULING: a decision of Paolo's, dated, in his words, with a value or a
constraint attached.

**The census is the hard half, and saying so is the honest part.** The file check is easy;
knowing which rulings exist is not. Round two harvests candidates from the places rulings
actually land in this repo: LOCKED lines in `laws/`, verdict `.txt` files in `records/`,
SHIPPED lines and STATE lines on the VAMILY board, and the standing rules in `CLAUDE.md`.
Round two must report its census coverage as a number and must not present the sweep as
complete.

**Three questions per ruling, in this order, cheapest first:**

| # | Question | Machine? |
|---|---|---|
| Q1 | Is there a file in the repo that holds this ruling's value in a form a parser can open? | yes, static |
| Q2 | Does anything the shipped page actually loads read that file? | yes, static, reachability from the alpha's load graph |
| Q3 | Does the value on the real surface still match the file? | later round: live, expensive, drift detection |

**Four verdict words**, taken from sections 3, 4 and 8:

- **LIVE** -- file exists, something loads it. Nothing owed.
- **ORPHAN** -- file exists, nothing reads it. Looks answered, is not. Names the lane that
  owes the wiring.
- **STRANDED** -- no readable file at all. The faction-colour case. Names the lane that owes
  the file.
- **DRIFTED** -- file exists, is read, and the surface disagrees. Q3 only, deferred.

**Controls, because RULE ZERO says a zero needs a positive control.** Round two plants three
known cases before it trusts any result: one known LIVE, one known STRANDED, and one known
ORPHAN. The ORPHAN control is the important one, because it is the only thing that proves Q2
has teeth over Q1. Without it a sweep can pass every check by finding files.

**Anti-fatigue, from section 5.** The sweep ships with a written ignore list, in the record,
and it reports what class of ruling it cannot see rather than counting those as clean.

**The ratchet, this lane's existing pattern.** Freeze the STRANDED count on the first honest
run. It may only ever go down. That is what makes "re-run on every ship" survivable.

**What round two is NOT allowed to do:** write the missing files. This lane never writes game
code. It names the ruling, names the lane that owes the file, and writes one `[eyes: two words]`
line into that lane's section, which is its single standing exception.

---

## 10. THE ONE-LINE SUMMARY OF SCHOOL

The world calls it the **artifact gap** -- the visible thing exists and the buildable thing
does not -- it is fixed with **one** readable source everything else references, it is kept
fixed by **drift detection** running on every change, the sweep that finds it is the same
shape as a **hardcoded-colour or hardcoded-string linter** and lives or dies on its ignore
list, and the reason it hurts is **Groundhog Day**: a decision nobody can read gets asked
again, forever, which in a project made of chats is one context window away at all times.
And the container was never the crime. **The crime is no reader.**

---

## SOURCES

- Design Tokens Community Group, first stable spec (2025.10) -- https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/
- Design Tokens Format Module -- https://www.designtokens.org/tr/drafts/format/
- Design tokens with confidence (Lukas Oppermann) -- https://uxdesign.cc/design-tokens-with-confidence-862119eb819b
- Design tokens: a double-edged sword (over-tokenization) -- https://uxplanet.org/design-tokens-a-double-edged-sword-in-design-systems-bae2ed1769c3
- Design Tokens aren't enough: architecture decisions need a place -- https://samiamdesigns.substack.com/p/design-tokens-arent-enough-architecture
- Data Tables for Game Designers (UE5, "pick one source of truth") -- https://sarahhyperdense.substack.com/p/data-tables-for-game-designers-spreadsheet
- Data-driven design in Unreal -- https://unreal-garden.com/tutorials/data-driven-design/
- Separate game data and logic with ScriptableObjects (Unity) -- https://unity.com/how-to/separate-game-data-logic-scriptable-objects
- BakingSheet (Excel/Sheets/CSV to C#) -- https://github.com/cathei/BakingSheet
- What is ClickOps and how to prevent it -- https://controlmonkey.io/resource/what-is-clickops/
- From ClickOps to governed IaC: CloudFormation drift detection -- https://aws.amazon.com/blogs/devops/from-clickops-to-governed-iac-cloudformation-drift-detection-in-practice/
- Configuration drift, GitOps and ArgoCD -- https://openliberty.io/blog/2024/04/26/argocd-drift-pt1.html
- What is configuration drift -- https://spacelift.io/blog/what-is-configuration-drift
- stylelint color-no-hex -- https://stylelint.io/user-guide/rules/color-no-hex/
- Hardcoded values vs tokens -- https://designsystemproblems.com/token-management/hardcoded-values-vs-tokens/
- eslint-plugin-i18next no-literal-string -- https://github.com/edvardchen/eslint-plugin-i18next/blob/HEAD/docs/rules/no-literal-string.md
- i18n-lint -- https://jwarby.github.io/i18n-lint/
- Has your architectural decision record lost its purpose? (Groundhog Day, Email-Driven Architecture) -- https://www.infoq.com/articles/architectural-decision-record-purpose/
- ADRs vs tribal knowledge -- https://mandarpandit.medium.com/architecture-decision-records-vs-tribal-knowledge-writing-it-down-or-passing-it-around-62aa34bdf533
- Breaking free from the tribal knowledge trap with ADRs -- https://israataha.com/blog/architecture-decision-records/
- Asset pipeline design in VR (non-destructive source vs baked delivery) -- https://developers.meta.com/horizon/blog/asset-pipeline-design-in-vr/
- The all-important import pipeline -- https://www.gamedeveloper.com/programming/sponsored-feature-the-all-important-import-pipeline
- Tools are easy, pipelines are hard (15 years at Bossa) -- https://andytech.art/tools-are-easy-pipelines-are-hard-15-years-building-an-art-pipeline-at-bossa-games
- Saving game data as an image -- https://divillysausages.com/2014/04/13/saving-game-data-as-an-image/
- Arkanoid game levels from PNG pixels -- http://nick-aschenbach.github.io/blog/2015/04/27/arkanoid-game-levels/
- Lospec: how to import a palette (PNG as palette container) -- https://lospec.com/palette-list/importing-palettes
- Aseprite palettes docs -- https://www.aseprite.org/docs/extensions/palettes/
- Solve design-to-dev handoff problems (the artifact gap, the context gap) -- https://figr.design/blog/design-to-dev-handoff-problems
- Guide to developer handoff -- https://www.figma.com/best-practices/guide-to-developer-handoff/
- Local storage instead of context/redux? -- https://www.developerway.com/posts/local-storage-instead-of-context
- State management (client state is a cache, server is the truth) -- https://reacthandbook.dev/state-management

## OUR OWN FILES THIS LEANS ON
- laws/BOHEMIA_LAW_COLOUR_IS_TERRITORY_8_26_26.md (the ruling that got stranded)
- laws/BOHEMIA_ADDENDUM_EYES_AND_EARS_9_4_26.md (this lane's charter)
- VAMILY.md, EYES AND EARS section (the two-round school law, 9/6)
- records/BOHEMIA_EYES_ROUND_2_THE_STANDING_DUTY_9_5_26.md (RULE ZERO: a zero needs a positive control)
- records/BOHEMIA_EYES_E3_HOW_TO_CATCH_A_VISUAL_REGRESSION_9_5_26.md (the ratchet pattern, and false-positive fatigue)
