# EYES AND EARS -- E19 [slop count] ROUND ONE: SCHOOL
## "THE GATE AS BRIEFED WOULD RED THE ONE ELEMENT THAT IS ALREADY OBEYING THE LAW"
### 9/12/26 -- lane 17, round one of two. NOTHING ON THE SHIPPED SURFACE WAS COUNTED THIS ROUND.

MODE: SCHOOL THEN CHECK (Paolo 9/6, LOCKED). Round one is a whole VAMILY spent learning the
subject: how designers actually audit an interface for the generic AI look, what the standard
instrument is, and what it gets wrong. No counting. What I read instead is how OUR interface is
written, because that is what decides whether the counter the brief asks for is even possible.

THE JOB (board row E19): *a gate that counts, in every shipped surface, named default fonts,
one-pixel borders used as edges, rounded cards, gradients, letter-spaced uppercase labels and
emoji inside controls, prints the numbers, and fails on any. Today's baseline is in the law; the
target is zero.*

THE LAW IT SERVES: `laws/BOHEMIA_LAW_THE_UI_MUST_NOT_LOOK_VIBE_CODED_9_11_26.md` (Paolo 9/11,
LOCKED): *"I need the UI to run as far away as possible from the standard look of vibe-coding...
People can look at it and be like, yep, that was coded."*

---

## THE HEADLINE, AND IT IS ABOUT OUR OWN CODE

`slices/BOHEMIA_CITY_WORLD.html` line 602 onward is THE SKIN: the phone on the city screen, the
first element moved onto a named set of shapes, colours and type, built deliberately against this
exact law. Its own comment makes the argument better than any tell list does:

> *"THE CASING. A phone you can see is a thing with a THICKNESS: the bezel is padding, not a
> border, because a 1px line reads as a box and 5px of case reads as an object."*

That element is the law working. And it is built out of: `border-radius: var(--skin-round, 13px)`,
`background: var(--skin-case, linear-gradient(...))`, `border: 1px solid var(--skin-caseedge,...)`,
three `box-shadow` layers including a glow, and `font: 10px/1.42 var(--fmono, ui-monospace,
monospace)`.

**A counter that counts occurrences and fails on any would red it on five of the six tells at
once.** Rounded corner, gradient, one-pixel border, glow, monospace. The most law-abiding element
on the screen would be the gate's worst offender, because a grep cannot see that the radius is a
phone's corner, the gradient is a moulded plastic case, the 1px line is the seam where the case
meets, and the glow is a lit screen in a dark valley.

We already have a law about this class of mistake, and it is ours:
`laws/BOHEMIA_LAW_HOW_HAIR_AND_SHAPE_WORK_8_1_26.md` line 172 -- **"A CHECKER THAT CANNOT TELL A
MENTION FROM A USE IS THE BROKEN ONE."**

And the vibe-coded law itself is already written in use-language, not feature-language, which the
board row's one-line brief flattens: *"No one-pixel grey border AS THE WAY TO DRAW AN EDGE. No
rounded card AS THE WAY TO GROUP THINGS. No letter-spaced uppercase AS THE WAY TO LABEL."* The law
bans the reflex. The brief counts the feature. Those are different instruments and only one of
them is buildable.

---

## 1. WHAT THE TELL LISTS SAY, AND WHY THEY ARE RIGHT ABOUT THE CAUSE

The five sources the 9/11 law already cites agree on the mechanism, and the wider reading sharpens
it to something concrete and checkable:

**The tells are the DEFAULTS OF THE DOMINANT FRAMEWORK, not properties of badness.** A model
returns the median of its training data, and the median web design since 2019 was Tailwind's
default palette -- **Tailwind's own creator publicly apologised for making indigo-500 the default
that every AI tool now copies.** That is the whole disease in one sentence: the look is not ugly,
it is *inherited*.

**"AI design isn't ugly. It's FLUENT -- and that's the problem."** That is the title of the
clearest piece in the reading and it is the sentence that reshapes this job. Fluency is not a
feature you can count. It is the absence of a decision, wearing the costume of competence.

**And the sharpest formulation of the tell is not visual at all:** *"the tell isn't a watermark --
the tell is that nothing is at stake, the voice is hedged, the composition is symmetrical, and the
metaphor is one of the seven any model can produce on demand."*

**Symmetrical. Uniform.** That one word is the bridge from taste to measurement, and section 4
builds the instrument on it.

---

## 2. HOW THE TRADE ACTUALLY ENFORCES THIS, AND IT IS THE EXACT OPPOSITE OF A BAN LIST

This is the part the law's own research did not reach, and it is the answer to the brief's question.

Nobody in the industry ships a checker that forbids rounded corners. What they ship is **scale
enforcement**: every value must come from your own named set, and arbitrary values are the defect.

- **stylelint-plugin-rhythmguard** enforces *"scale and token discipline across spacing, radius,
  typography, size and motion"*, in CSS declarations and in Tailwind class strings.
- **stylelint-scales** lets you declare the permitted scale per property, **border-radius
  included**.
- The named rules are `no-arbitrary-colors`, `no-arbitrary-spacing`, `no-arbitrary-typography`,
  **`no-arbitrary-border-radius`** -- because *"arbitrary Tailwind values like `bg-[#1a5276]` and
  `p-[17px]` are an escape hatch"*.

The trade's question is never *"is there a radius?"* It is **"is this radius one of yours?"** A
project with three radii used on purpose does not look coded. A project with nineteen radii,
because each one was typed where it was needed, looks exactly as coded as one with none.

**And we already have the machinery for that**, which is why REUSE-FIRST matters here: the skin is
already a set of CSS custom properties (`--skin-round`, `--skin-bezel`, `--skin-case`,
`--skin-caseedge`, `--skin-screenround`, `--skin-glow`, `--skin-glowr`, `--fmono`). A scale
already exists. Nothing in the shipped surface has ever been checked against it.

---

## 3. FOUR THINGS THE TELL LISTS MISS, EACH ONE MEASURED OR CITED

### (a) THE LIST IS A MOVING TARGET, AND THAT IS DOCUMENTED RATHER THAN SPECULATED

*"When vibe coding first emerged, the purple gradient was a dead giveaway"*, and when the frontend
design skill shipped everyone expected purple gradients to disappear -- *"pretty quickly everyone
realised those websites all kind of looked the same, or at least had specific tells."* The look
moved; the genericness did not.

**A gate frozen on a 9/11 list will one day pass a surface that has moved to the next generic
look, and report zero while doing it.** A tell counter therefore cannot be the whole instrument,
and its own staleness has to be part of what it reports.

### (b) ROUNDED CORNERS ARE NOT A DEFECT. THERE IS A PERCEPTUAL PREFERENCE FOR CURVATURE.

People reliably prefer curved contours to sharp ones, at exposures as short as a glance, and
**the amygdala is significantly more active for everyday sharp-cornered objects than for their
curved counterparts** -- read as an implicit perception of threat (Bar and Neta, 2006 and 2007;
the effect is moderated by expertise, per Silvia's follow-up, so it is a tendency and not a law).

So "no rounded card" cannot be justified as "rounded is bad". **But it has a better justification
in THIS game than the tell list ever gave it:** if sharp contours read as threat and curved ones
read as safe and pleasant, then a post-economic-apocalypse valley has a reason to be built out of
hard edges that has nothing to do with fashion, and a soft rounded card is the wrong *signal*, not
the wrong *taste*. That argument is grounded in the real, which is this repo's standard, and it is
DIRECTION's to accept or reject.

### (c) LETTER-SPACED UPPERCASE IS ALREADY A MEASURABLE FAULT FOR A BETTER REASON

The tell list says small uppercase letter-spaced labels look coded. The accessibility literature
says something firmer and testable:

- all-caps text is harder for readers with dyslexia and related conditions, and is recommended
  against for continuous text;
- **screen readers may read capitalised text letter by letter**, depending on the user's verbosity
  settings;
- and WCAG's text-spacing requirement means **content must survive the reader increasing letter
  spacing to 0.12 times the font size** without losing content or function.

That last one is a real machine test and the tell lists do not have it: a row of tight
letter-spaced uppercase chips is exactly the layout that breaks when a reader widens spacing. So
this tell converts into a check with a pass condition that is not about taste at all -- and this
lane already owns the instrument for it, because E13 drove real controls on the real surface and
measured what happens to them.

### (d) THE DEFENCE AGAINST "THAT LOOKS AI-MADE" IS PROVENANCE, NOT ABSENCE

The clearest line in the reading: *"AI feedback only hurts when there's nothing underneath the
work to answer it with. When a design is built on research and understanding, an AI critique is
barely an event; when the work is built on taste alone, any confident opinion can knock it over."*

Which is the same diagnosis the 9/11 law gives -- *"the output is instantly recognisable as
nobody's decision"* -- and the same shape as the fleet's existing REFERENCE CHECK, where a cook
names the reference it was built against and the gate resolves it. **The anti-slop measurement
this repo is actually built for is: does every visual value trace to a decision.** Not: is the
value on a forbidden list.

---

## 4. THE INSTRUMENT DESIGN FOR ROUND TWO (SPEC ONLY -- NOTHING BUILT THIS ROUND)

Three measurements, in this order, and the first one is the real one.

**MEASUREMENT 1 -- THE SCALE, from section 2. How many DIFFERENT values does the shipped surface
use for each property the law names?** Radii, border widths, font stacks, gradient definitions,
letter-spacing values, shadow recipes. This needs no taste and no list: a surface drawing its
radius from four named values is a surface somebody decided; a surface with forty typed radii is
the statistical average of itself. This is the number that survives the look moving, per 3(a), and
it is the number the trade's own tooling holds. **It is also the one that can honestly be
ratcheted**, because a project cleaning itself up can only reduce it.

**MEASUREMENT 2 -- THE TELLS, COUNTED AND ATTRIBUTED, NEVER FAILED ON. From the headline.** Every
occurrence is reported with the element it is on, and split into:
- **ON THE SKIN** -- the value comes from a `--skin-*` variable or another named token. Reported,
  never a defect: this is the law being obeyed, and the phone proves the case.
- **TYPED IN PLACE** -- a literal radius, border, gradient or font stack written at the point of
  use. This is the actionable list, and it is what "the way to draw an edge" means in code.
The headline number is the second one. The first is context.

**MEASUREMENT 3 -- THE SPACING SURVIVAL TEST, from 3(c).** On the real surface, in the real
browser, force letter-spacing to 0.12em and word-spacing to 0.16em on the chrome and report which
controls overflow, overlap or lose text. That is a pass-or-fail with no taste in it, it is the
WCAG condition, and E13's driven-tap harness already knows how to find and measure every control.

**WHAT ROUND TWO WILL NOT DO, AND WHY:**
- **It will not fail on any occurrence.** A gate that reds on a rounded corner is red forever, and
  E3 measured what happens next: a checker that fails on absolute badness gets muted inside a
  week. The brief's "fails on any, target zero" is the exact shape that gets a gate switched off,
  and the switched-off gate is worse than no gate because the fleet believes it is running.
- **It will not count `dark mode` as a tell at all.** The lists call dark mode the single most
  common tell. This game is a night-capable post-apocalyptic valley and the law itself says dark
  is a choice per act. Counting it would manufacture a defect out of the setting.
- **It will not decide whether anything looks good.** That is DIRECTION's, by this lane's charter.
  Every row it prints is a count and a location.

**RULE ZERO (E9): a zero needs a positive control, and this job's controls are the headline.**
- **the phone control:** the skin's phone element MUST come back as ON THE SKIN and MUST NOT be
  reported as a defect. If it does, the instrument is the broken one and no number prints.
- **a planted typed-in-place value** (a literal `border-radius: 7px` on a test string) MUST be
  found and attributed to TYPED IN PLACE.
- **a planted tokenised value** (`border-radius: var(--skin-round)`) MUST NOT be.
- **the scale control:** a synthetic stylesheet with three radii must report three, and one with
  thirty must report thirty. A counter that cannot tell those apart is measuring nothing.
- **the survival control:** a planted fixed-width chip with tight uppercase MUST overflow under
  0.12em and a planted flexible one MUST NOT.

**THE RATCHET.** Freeze **TYPED IN PLACE** and **the distinct-value count**, both shrink-only.
Never freeze the raw tell count, because moving a value onto the skin is a fix that leaves the
count unchanged, and a gate that cannot see a fix teaches the fleet to ignore it.

---

## ROUTED
- **UI** -- the [no slop] standard has a buildable form: every value comes from the skin, and the
  actionable list is TYPED IN PLACE, not "there is a radius". The phone is already the worked
  example and its own comment is the best argument in the repo for why.
- **DIRECTION** -- [the font] and the object language. And the curvature research in 3(b) is a
  real reason for hard edges in this world that does not depend on fashion. Accept or reject it;
  it is taste and taste is yours.
- **THE COORDINATOR** -- the board row's brief ("fails on any, target zero") and the law's own
  wording ("as the way to draw an edge") are different instruments. Round two builds the law's
  one. Flagging rather than silently substituting.

## SOURCES
- 7 signs a UI has been vibe coded -- https://www.thefountaininstitute.com/blog/signs-vibe-coded-ui
- AI design slop: 16 patterns that out your app -- https://www.developersdigest.tech/blog/ai-design-slop-and-how-to-spot-it
- AI slop fonts and gradients: the tells -- https://www.925studios.co/blog/ai-slop-design-tells
- Why your vibe-coded app looks like every other AI app -- https://thecrit.co/resources/vibe-coding-design-guide
- Why your AI keeps building the same purple gradient website -- https://prg.sh/ramblings/Why-Your-AI-Keeps-Building-the-Same-Purple-Gradient-Website
- AI design isn't ugly, it's fluent, and that's the problem -- https://uxdesign.cc/ai-design-isnt-ugly-it-s-fluent-and-that-s-the-problem-131b2f4eb78c
- Anti-AI design isn't a backlash, it's a standards reset -- https://www.jacobtyler.com/blog/anti-ai-design-standards-reset/
- You are not in the race against slop cannons -- https://hils.substack.com/p/you-are-not-in-the-race-against-slop
- Inter: how designers are stripping away your brand's soul with a font -- https://medium.com/design-bootcamp/inter-how-designers-are-slowly-stripping-away-your-brands-soul-with-a-font-fcf58ee1deaf
- Making vibe-coded UIs beautiful and consistent -- https://medium.com/design-bootcamp/making-vibe-coded-uis-beautiful-and-consistent-a2a1ba08a140
- stylelint-plugin-rhythmguard, scale and token enforcement -- https://github.com/PetriLahdelma/stylelint-plugin-rhythmguard
- stylelint-scales, numeric scales including border-radius -- https://github.com/signal-noise/stylelint-scales
- The hidden cost of Tailwind arbitrary values -- https://deslint.com/blog/tailwind-arbitrary-values
- Enforcing design tokens, a practical guide -- https://medium.com/@barshaya97_76274/design-tokens-enforcement-977310b2788e
- Linting design tokens with stylelint -- https://www.michaelmang.dev/blog/linting-design-tokens-with-stylelint/
- Stylelint rules and customising -- https://stylelint.io/user-guide/rules/
- All-caps headings: are they bad for accessibility? -- https://www.boia.org/blog/all-caps-headings-are-they-bad-for-accessibility
- Best practices for text spacing to ensure accessibility -- https://www.a11y-collective.com/blog/text-spacing-wcag/
- A review of text accessibility standards, guidelines and font tool limitations (ASSETS 2025) -- https://dl.acm.org/doi/10.1145/3663547.3759692
- Section 508: accessible fonts and typography -- https://www.section508.gov/develop/fonts-typography/
- Preference for curvature: a historical and conceptual framework -- https://www.frontiersin.org/journals/human-neuroscience/articles/10.3389/fnhum.2015.00712/full
- Visual elements of subjective preference modulate amygdala activation -- https://pmc.ncbi.nlm.nih.gov/articles/PMC4024389/
- Do people prefer curved objects? Angularity, expertise and aesthetic preference -- https://libres.uncg.edu/ir/uncg/f/P_Silvia_Do_2009.pdf
- How to audit the code quality of an AI-generated app -- https://medium.com/@sketchflow.ai/how-to-audit-the-code-quality-of-your-ai-generated-app-before-you-deploy-a-technical-checklist-for-4991e9ca3159

**A NOTE ON THE SOURCES.** Several pages could not be opened from this session -- the egress proxy
blocks a number of domains -- so those findings are recorded as the search index reported them,
with their URLs, and they are consistent across independent pages. The curvature research and the
accessibility guidance are the two places this record leans hardest, and both are reported by more
than one source.

## OUR OWN FILES THIS LEANS ON
- `laws/BOHEMIA_LAW_THE_UI_MUST_NOT_LOOK_VIBE_CODED_9_11_26.md` (his words, the tells, the 9/11
  baseline table, and the use-language the board's brief flattens)
- `slices/BOHEMIA_CITY_WORLD.html` line 602 onward, THE SKIN and the phone (the worked example,
  and the element a naive counter would red)
- `laws/BOHEMIA_LAW_HOW_HAIR_AND_SHAPE_WORK_8_1_26.md` line 172 ("a checker that cannot tell a
  mention from a use is the broken one")
- `laws/BOHEMIA_LAW_THE_UI_HAS_THREE_ACTS_9_6_26.md` (why the skin exists at all)
- `records/BOHEMIA_EYES_E13_ROUND_2_WHO_ACTUALLY_GETS_THE_TAP_9_7_26.md` (the driven-control
  harness measurement 3 reuses)
- `records/BOHEMIA_EYES_E17_ROUND_2_THE_LOCK_IS_NOT_THE_RULING_9_12_26.md` (a text claim is not a
  surface fact; and what a ratchet is for)
