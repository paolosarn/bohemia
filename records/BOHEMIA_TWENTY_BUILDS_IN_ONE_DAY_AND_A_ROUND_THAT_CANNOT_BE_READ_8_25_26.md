# THE BUILD STAMP SAYS "8/25t" — THAT IS THE TWENTIETH BUILD TODAY
# (8/25/26, coordinator sweep 21. Two of his LOCKED laws are both right
# and cannot both hold during the friends round. A DECISION that keeps
# BOTH, and a routed work order. Nobody has started this.)

## 1. THE MEASUREMENT, AND THE GAME ITSELF PRINTS IT
    slices/BOHEMIA_ALPHA_0_9.html:1118  ->  "BUILD 8/25t"
The ship law stamps each build with a date and a LETTER. Today's letter
is **t**. That is the twentieth build of a single day, on his splash
screen, where anyone can read it.
Measured independently against the branch:
    first-parent commits to main, 8/22: 18   8/23: 11   8/24: 23   8/25: 23
    median gap between today's pushes: **2.0 minutes.** Mean: 41.5.
The fleet is nine sessions shipping continuously, and that is the machine
working exactly as designed.

## 2. THE ONE LINK IS ALWAYS FRESH, BY LAW, ON PURPOSE
slices/sw.js, from its own header:
> "NETWORK-FIRST for every page navigation... re-fetches the document
> straight from the network, bypassing the HTTP cache (cache:'no-store'),
> so the link ALWAYS renders the latest deploy. No query strings, no
> version files, no per-ship step — the URL stays pristine."
That worker exists because of the ONE-LINK LAW (Paolo 7/18), which he was
FURIOUS about: "?v=arms" made the URL change and a changing URL reads as a
different game. The worker is the reason the plain link is always current
without a cache-buster. **IT IS CORRECT AND IT IS NOT UP FOR DEBATE.**

## 3. PUT THOSE TWO FACTS NEXT TO THE FRIENDS ROUND
Round 1 is 5-8 people, their own phones, the one link, over some window
of hours or days. During that window the link serves whatever main most
recently deployed.
**SO EVERY TESTER PLAYS A DIFFERENT GAME, AND SO DOES THE SAME TESTER ON
MONDAY VERSUS SATURDAY.** At today's rate a tester who plays for forty
minutes may be playing across a deploy boundary. One who quits and comes
back tomorrow is on a different build entirely.
The protocol's entire value is COMPARISON — quit points against each
other, round 1 against round 2. **A comparison across a moving build is
not a weak measurement. It is not a measurement.**

## 4. WHAT IS *NOT* BROKEN, SAID PLAINLY BECAUSE IT WOULD BE EASY TO
## SCARE PEOPLE HERE
**THE SAVE IS FINE AND IT IS GOOD WORK.** gates/save_compat_gate.js
asserts a single version constant, that the snapshot writes the constant
rather than a literal, that exact-equality checking is GONE, that there is
a walk-forward migrator, that a pre-purse pre-market save still loads, and
that **a save from a NEWER build is refused BY NAME and left alone rather
than turned into a new game.** A player crossing a deploy does not lose
their run. That whole class of disaster is already handled, and this
record is not about it.
**WHAT BREAKS IS NOT THE DATA. IT IS THE ABILITY TO READ THE RESULT.**

## 5. AND THE SECOND HALF: A REPORT WE CANNOT REPRODUCE
When a tester says "it froze when I went in the door", the first question
is WHICH BUILD. Right now the answer is unrecoverable — nothing the
tester sends carries a build id.
**AND THIS IS FIXABLE FOR FREE, BECAUSE THE INSTRUMENT IS NOT BUILT YET.**
RUN 0f, the in-demo feedback card, is still open (sweep 14). It has never
been specified. So it gets specified now, before anybody writes it:
**THE CARD STAMPS THE BUILD AND THE SEED INTO EVERY PASTE.** The build
stamp already exists and is already on screen ("8/25t"); the card just has
to carry it. A paste without a build id is an anecdote.

## 6. THE OTHER AISLE — AND IT NAMES YESTERDAY'S FINDING TOO
The experimentation literature is blunt about this exact failure:
> "You should not change the experiment settings, the test goals, the
> design of the variation or of the Control mid-experiment."
and, remarkably for us, it names the precise mechanism sweep 20 called
yesterday from a different direction:
> "Changing experiment settings mid-run, **such as modifying the
> experiment seed** or hashing ID after a test has started, breaks
> consistent user assignment and compromises the integrity of the entire
> dataset."
That is the seed sequencing call arriving from the A/B-testing side
without being asked. The same discipline covers the BUILD, which is a
much bigger change than a seed.
The related trap is PEEKING — checking a running test and acting on what
you see inflates false positives — which for us translates directly:
**patching the demo because tester #2 tripped over something, while
testers #3 through #8 are still to come, silently converts one round into
eight incomparable rounds.** That will feel like being responsive. It is
the thing that destroys the round.

## 7. THE GAMES / ENGINEERING AISLE HANDS US THE ANSWER THAT DOES NOT
## STOP THE FLEET
The old answer is a CODE FREEZE: "a static codebase is ensured for final
QA testing and validation," and the reason is stated plainly — "once you
introduce new code, your level of confidence drops and... you may need to
completely redo the entire QA and validation process."
But the modern practice is better and it is exactly our shape:
> "Creating a branch for release replaces the practice of the code
> freeze, in which checking in to version control is entirely switched
> off for days and sometimes weeks."
**A RELEASE REF, NOT A FREEZE.** Nine sessions keep pushing to main at
full speed. The published site is pinned to one ref for the duration of
the round. Nobody stops working and nobody's link changes.

## 8. THE FINDING THAT CHALLENGES WHAT WE BELIEVE
**WE BELIEVE SHIPPING TO MAIN EVERY TURN IS UNAMBIGUOUSLY GOOD.** It is —
FOR BUILDING. It is exactly wrong FOR MEASURING, and we have never done
the second thing, so the conflict has never surfaced.
Worse: **the ONE-LINK LAW's freshness — the fix for a real problem that
made him furious — is precisely what makes the round unreadable.** Two of
his locked laws, both correct, both load-bearing, that have simply never
been asked to hold at the same moment. That is not a bug in either one.
It is what a coordinator is for.
AND THE RESOLUTION HAS TO RESPECT THE HARDER LAW: **the URL never
changes, not once, not for a weekend, not with a query string.** Anything
that touches the link is dead on arrival, and correctly so.

## 9. THE DECISION (mine, EVERYTHING IS A THUMB)
**THE LINK IS SACRED. THE REF IT SERVES IS NOT.**
1. **A ROUND-1 REF.** When round 1 opens, the published site is pinned to
   one tagged commit. The URL is untouched, the service worker keeps
   doing exactly what it does, and testers keep getting "the newest
   deploy" — the newest deploy simply stops moving for the duration.
2. **THE FLEET DOES NOT STOP.** Nine sessions keep merging to main. This
   is a publish decision, not a development freeze. Nobody loses a turn.
3. **NO PATCHING MID-ROUND.** Findings queue and land after. The one
   exception written in advance so it is not a judgement call under
   pressure: **a hard blocker that stops testers from playing at all**
   — the round is worthless anyway at that point, so re-pin, note the
   change, and treat what came before as a separate round.
4. **EVERY PASTE CARRIES THE BUILD AND THE SEED.** Specified into RUN 0f
   now, before it is written.
5. **ROUND 2 GETS ITS OWN PINNED REF**, and the two refs are named in the
   digest. Comparing round 1 to round 2 is the whole point and it only
   means anything if each round is one thing.

## 10. ROUTED
- **SHARED — ROUND-REF: PUBLISH FROM A PINNED REF FOR THE ROUND.** The
  Pages workflow already has an explicit publish list (pages_publish_gate
  binds it), so this is a ref choice, not new machinery. It must be
  REVERSIBLE IN ONE COMMIT and it must not touch the URL, the service
  worker, or the query string. Write the un-pin step down at the same
  time as the pin step; a freeze nobody remembers how to lift is how a
  fleet loses a week.
- **RUN — 0f AMENDED: THE CARD STAMPS THE BUILD AND THE SEED.** Two
  fields. The build stamp is already rendered on the splash; the seed is
  arriving with WORLD SEED-1. A paste without them is an anecdote, and
  0f has not been written yet, so this costs nothing today and cannot be
  retrofitted onto pastes already collected.
- **INTO THE FRIENDS-ROUND RECORD:** the pinned ref, no mid-round
  patching, and the one named exception.
- **NOT ROUTED, DELIBERATELY:** any change to sw.js, the URL, or the ship
  flow. The ONE-LINK LAW is not what needs fixing here and touching it
  would be solving the wrong problem loudly.

## 11. CONFIDENCE
- "BUILD 8/25t", the commit counts and the 2.0-minute median: measured
  off the file and the branch. **CERTAIN.**
- The service worker being network-first: read from its source.
  **CERTAIN.**
- The save being safe across a deploy: read from save_compat_gate's
  claims. **HIGH** — I read the gate's assertions, not every migration
  path.
- The experimentation and release-engineering guidance: practitioner
  literature, consistent, and the seed line is a direct quote.
  **MEDIUM-HIGH** — these are software-industry sources, not
  peer-reviewed.
- That a moving build would actually have muddied round 1: a
  **PREDICTION**, but a cheap one to honour, and the cost of being wrong
  is one pinned tag.

## SOURCES
Practitioner writing on A/B test validity (Conversion.com's "top 3
mistakes that make your A/B test results invalid", GrowthBook on
experiment constants, Lucidchart and GoPractice on the peeking problem);
code-freeze and release-branch practice (testRigor, Qodex, AB Tasty's
"Are code freezes still relevant?"). In-repo: slices/BOHEMIA_ALPHA_0_9.html
:1118 (the build stamp), slices/sw.js (the always-fresh worker and the
ONE-LINK LAW it serves), gates/save_compat_gate.js,
gates/pages_publish_gate.js, CLAUDE.md SHIP FLOW and ONE-LINK LAW,
records/BOHEMIA_THE_FRIENDS_ROUND_IS_NOT_READY_8_24_26.md,
records/BOHEMIA_ONE_VALLEY_FOREVER_IS_A_CONST_NOT_A_DECISION_8_25_26.md.
