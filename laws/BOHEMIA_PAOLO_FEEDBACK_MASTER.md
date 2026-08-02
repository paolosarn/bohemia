# PAOLO'S FEEDBACK — THE MASTER (opened 8/1/26, LIVING DOCUMENT)

> "Please remember all my feedback and put it into your own training data"
> — Paolo, 8/1/26

**THE HONEST ANSWER FIRST, so nobody builds on a false idea of how this works:**
I cannot write to my own training data. My weights are fixed; nothing said in a
session changes them, and a new session starts knowing nothing about this one. What
actually persists is THIS REPOSITORY. GIT IS THE MEMORY (CLAUDE.md) is not a slogan,
it is the only mechanism there is.

So this file is the real version of what he asked for: **every piece of feedback he
has given, in one place, that every future session reads before it does anything.**
Where a piece of feedback has a machine behind it, the gate is named — because a law
without a machine gate is not enforced, proven 7/16 when six of nine gated laws
turned out to be already broken. `gates/feedback_master_gate.py` keeps this file
honest: every law carrying his verbatim words must be indexed here.

---

## 1. HOW HE WORKS — read this before reading anything else

- **He speaks, and the transcription garbles.** Decipher intent. NEVER take a
  garbled word literally or treat it as a new term.
- **He does not dig in files.** Present everything. A dossier he never opens is not
  an answer, it is an alibi. This is why the ANSWER SHEET exists.
- **He reads from the bottom of the screen up.** Anything he has to scroll for does
  not exist. The ask and the two-sentence bottom line are the last things on screen,
  every turn.
- **ONE question per reply, bolded.** More than one and he answers the wrong one.
- **He decides, I produce.** Contents are his; mechanism is mine.
- **Ship a lot per turn.** Small timid turns are a standing complaint.
- **He swears when he is frustrated and it is information, not noise.** The swearing
  marks the sentence that matters.

## 2. THE VERDICTS — what he has actually scored

| date | thing | score | verdict |
|---|---|---|---|
| 7/27 | 45 districts, bulk | 32 rejected | "it was mostly all bad" |
| 7/29 | high school | 79% | notes, 8 of them |
| 7/31 | high school | **89%** | **APPROVED** |
| 7/31 | commercial | 65% → 75% | open |
| 7/31 | mall | 40% → 60% | open |
| 8/1 | commercial + mall | **85%** | **APPROVED** ("approved for now") |
| 8/2 | downtown | **85%** | **APPROVED** ("we can approve it for now") |
| 8/2 | library | 22% | rejected — "six different buildings" |
| 8/2 | library, rebuilt | **85%** | **APPROVED** — "hella yeah", one note: more parking on the icon |
| 8/2 | city hall / courthouse | 50% / 50% | rejected — round roofs "look like tarps", doors off their walls |
| 8/2 | terminal / chapel | 40% / 30% | rejected — same two pipeline bugs |

**THE FIVE APPROVED DISTRICTS ARE THE STANDARD.** High school 89%, commercial 85%,
mall 85%, downtown 85%, library 85%. Anything that does not hold up beside those
five is not done.

## 3. WHAT HE HAS RULED — the standing law, newest first

Each line is a ruling he made, in his words, with the machine that holds it.

- **8/2 — A ROUND ROOF IS A CLOSED LID, AND A DOOR STANDS ON A WALL.** "Every time you
  make a circular shape the roof of all your circles looks like tarps and shit... doors
  aren't where they're supposed to." Two PIPELINE bugs in one sentence, both in shared
  machinery, which is why they survived four rebuilds: the prism cap skipped half its fan
  and repeated a vertex on every quad it did emit (holes + slivers = a tarp), and `_door`
  took a hand-passed plane nobody checked a wall was behind. THE SHAPE OF NEARLY EVERY BUG
  HERE: a value passed by hand where a value could be DERIVED. `gates/round_and_doors_gate.py`
- **8/2 — TWO NUMBERS, NEVER ONE: "For the walking and icon."** A district is two
  artefacts built by two different files — the plot from the engine module, the icon from
  the hero factory — and a bug in one is invisible in the other (the tarp roofs were
  icon-only; the greenwashed lawns were plot-only). One score makes him average two
  unrelated things, and an average never tells me which file to open. Every judge card
  asks for both. `gates/label_every_picture_gate.py`
- **8/2 — LABEL EVERY PICTURE.** "You are showing me pictures, but I don't know which is
  which." Every image put in front of him carries its own NAME **in the pixels** — not in
  the caption, not in the sentence above it, not implied by the order they were sent. One
  subject per image; a grid of four unlabelled renders is one picture of a grid and he
  cannot score any of it. A PICTURE HE CANNOT IDENTIFY IS A PICTURE HE CANNOT JUDGE, and
  asking for a verdict on one costs him a turn. Same root as "he never digs in files": HE
  DOES NOT HAVE MY CONTEXT. `gates/label_every_picture_gate.py` +
  `tools/bohemia_judge_cards.py`
- **8/2 — ARTICULATION IS NOT FRAGMENTATION.** "There's like six different buildings
  of the library. What's up with that?" A library is ONE building. "No building is a
  flat rectangle" means ARTICULATE THE MASS (a drum, a tower, a long wing, all sharing
  walls), never SPLIT IT UP into a campus. THE BUILDING TYPE DECIDES, NEVER THE GATE —
  a strip of storefronts is many buildings because a street of lots IS many buildings.
  And the worse half of this one: I had encoded the mistake in `gates/library_gate.js`
  as `footprints >= 4`, so the machine was REQUIRING the bug. A wrong law outlives the
  turn that made it. `gates/library_gate.js` (now `footprints === 1`)
- **8/1 — "approved for now" is an APPROVAL.** Not a hold, not a snag list I keep
  picking at. Reopening approved work on my own initiative is the STOP PRODUCING
  failure. `records/BOHEMIA_VERDICT_COMMERCIAL_MALL_8_1_26.txt`
- **7/31 — RULE NUMBER ONE: THE STREETS CONNECT.** "how dare you continue to like
  make streets in in a district that like don't connect with each other like that's
  like the rule number one bro." Every drivable tile reachable from the street, and
  a lane wide enough to be a lane. `gates/drive_network_gate.js`
- **7/31 — EVERY PIXEL IS ANSWERED FOR.** "i need you to be able to write about
  everything u draw at all times not a single pixel on screen answered for bro."
  Named, WRITTEN, and EARNED — no code owns 30% of a plot.
  `gates/answered_for_gate.js` + the ANSWER SHEET he can actually look at.
- **7/31 — BUILD THE WORLD.** "NO QUESTS BULLSHIT RIGHT NOW. NO FACTION SHIT EITHER!
  WE GOTTA BUILD THIS FUCKING WORLD!!! AND MAKE IT LOOK GOOD DUMBASS." Quests,
  factions and the economy are OFF. `gates/build_the_world_gate.py`
- **7/30 — NO BUILDING IS A FLAT RECTANGLE.** A flat rectangle is not a building. He circled three buildings and asked
  what they were. Every mass carries a roof and a door. Held in the district gates.
- **7/30 — the tennis courts are dead.** "Remove the tennis courts make do what you
  want." Held at zero, like the playground before it.
- **7/28 — EVERY DISTRICT IS ITS OWN LANDMARK**, and the bar is Pocket City 2:
  "everything looks unique enough to know what it is at a glance."
  `gates/squint_gate.py`
- **7/28 — ACT ONE ONLY.** No act-2/3 design, materials or questions.
- **7/28 — "High school."** A high school is not a bigger middle school; it is a
  different building programme. `gates/school_gate.js`
- **7/26 — THREE CURRENCIES: RESOURCES, ELECTRICITY, CLOUT.** And the anti-reference
  is part of the law: "games like that are called spreadsheet simulators and I'm not
  a fan." `gates/purse_gate.js`
- **7/26 — STOP PRODUCING.** A frozen lane produces NOTHING; finding a legal way to
  ship anyway IS the violation. A second rejection ends the feature for the session.
- **7/22 — REUSE-FIRST.** "check out the approved assets first before cooking."
- **7/20 — WALKABLE-LAND.** A district is a full plot of walkable land, never a tiny
  building stranded in pavement. `gates/walkable_gate.js`
- **7/19 — NOTES ARE RULINGS.** If he said he likes it, that IS the verdict. Never
  ask him to re-thumb his own words.
- **7/19 — INTERIOR MATCHES EXTERIOR**, exactly, always.
- **7/18 — VERIFY ON THE REAL SURFACE.** Art is verified only on the surface he
  sees. A side-door probe is a lie.
- **7/18 — ONE LINK, and it never changes.** No cache-buster query strings, ever.

The full corpus is `BOHEMIA_CANON_INDEX.md`; on any conflict the NEWEST DATE WINS.

## 4. THE PATTERN IN HIS COMPLAINTS — what he is really telling me every time

Five turns of feedback on the districts, and the same three notes underneath all of
them. This is the section to read when tempted to do something clever.

1. **HE JUDGES BY LOOKING.** Every complaint he has ever made started with him
   looking at a picture. A turn in the world lane with "nothing to look at" is a
   turn that missed — that sentence is in my own reply the day he told me off for
   building invisible plumbing.
2. **DENSITY AND PURPOSE, NOT DECORATION.** "dogshit" was a parking lot drawn as
   full-width lines. 40% was a plot painted one colour. The fix is never more
   texture; it is more THINGS, each of which is a thing you can name.
3. **A NAME THAT LIES IS A BUG.** "landscape island" that was not one. "parking
   asphalt" kinded as ground. The machine cannot check what the legend misdescribes,
   so a mislabel is not sloppiness, it is a hole in every gate downstream.

And the meta-lesson, paid for twice: **a ranked to-do list somebody else wrote is not
a ruling.** His direction beats any document. When they disagree, he wins.

## 5. WHAT HE HAS NOT RULED — never decide these

- How long since the collapse. Sets the damage level for all 45 districts.
- What a quest pays, what a thing costs, what a building produces.
- Every name, sign, mascot and word of signage in the world.
- The Strip landmarks — strip/resort/casino/luxor/sphere/strat/highroller/sign are
  his hand by law and are never auto-generated.

---

*Living document. Every session that takes a ruling from him appends it here the
same turn, and `gates/feedback_master_gate.py` fails if a law carrying his verbatim
words is not indexed.*
