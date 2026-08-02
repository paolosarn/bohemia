# BOHEMIA ADDENDUM — LABEL EVERY PICTURE
**8/2/26. LOCKED. Machine: `gates/label_every_picture_gate.py` + `tools/bohemia_judge_cards.py`.**

> "You are showing me pictures, but I don't know which is which"
> — Paolo, 8/2/26

---

## THE LAW

**EVERY IMAGE PUT IN FRONT OF PAOLO CARRIES ITS OWN NAME, IN THE PIXELS.**

Not in the caption. Not in the sentence above it. Not implied by the order they were
sent in. **In the image**, because that is the only place a label survives a scroll, a
re-send, a screenshot, or him opening it again tomorrow.

And **one subject per image**. A grid of four unlabelled renders is not four pictures,
it is one picture of a grid, and he cannot score any of it.

## WHAT WENT WRONG

I rebuilt four districts, rendered them into a 2×2 contact sheet with no labels, put
three hero icons in a row with no labels, and then asked him to score them. From my
side the answer was obvious — I had just written the code. From his side it was four
brown squares.

**A PICTURE HE CANNOT IDENTIFY IS A PICTURE HE CANNOT JUDGE.** Asking for a verdict on
one does not just fail, it *costs him a turn*, and turns are the scarce thing here.

This is the same failure as **"he never digs in files"** (CLAUDE.md), in a different
medium. The rule underneath both: **HE DOES NOT HAVE MY CONTEXT.** He has a phone and
whatever I burned into the pixels. Anything I know that is not in the artefact does not
exist.

It is also the same failure as **"a name that lies is a bug"** (7/31), one step earlier:
that one was about a tile whose name did not match what it was. This one is about a
picture with no name at all. An unlabelled picture is not a small lie; it is a total one.

## THE MACHINE

`tools/bohemia_judge_cards.py` produces a **JUDGE CARD** per district:

- the **DISTRICT NAME** across the top, large, in the pixels
- **THE PLOT** at 3× nearest-neighbour — the surface he actually walks
- **THE ICON** beside it — because the icon and the ground get judged together, and he
  has caught them disagreeing before ("the icon could have more parking", 8/2)
- one line of **what it is** and one line of **what it was built on** (the real
  reference), so he never has to ask what he is looking at
- **TWO SCORE lines** at the bottom — **THE WALKING** and **THE ICON** — never one

`gates/label_every_picture_gate.py` renders a card for every registered district and
asserts the name was really drawn — it reads the pixels in the title band and fails if
the band is blank, if the ink does not scale with the length of the name, or if a card
is missing for a district that exists. **A gate that trusted the source code would pass
on a tool that silently drew nothing.**

## TWO NUMBERS, NEVER ONE (Paolo, 8/2: "For the walking and icon")

A district is **two artefacts**, built by two different files:

| | drawn by | judged as |
|---|---|---|
| **THE WALKING** | `engine/bohemia_<district>.js` | the plot he walks |
| **THE ICON** | `tools/bohemia_district_hero_factory.py` | what he sees on the map |

**A bug in one is invisible in the other.** The tarp roofs were icon-only; the
greenwashed lawns were plot-only; the library's "six different buildings" was both, but
for two different reasons. Asking for a single score forces him to average two unrelated
things, and **an average never tells me which file to open.**

So every card asks for both, and the gate fails a card that only has one line.

## THE STANDING RULE FOR REPLIES

When a turn asks Paolo to judge N things, it sends **N labelled cards**, one per thing —
never a contact sheet, never a bare render, never "the one on the left".

---

*Filed under the TRUTH HIERARCHY: on any conflict the newest date wins. Indexed in
`BOHEMIA_CANON_INDEX`. Standing rule also indexed in
`laws/BOHEMIA_PAOLO_FEEDBACK_MASTER.md`.*
