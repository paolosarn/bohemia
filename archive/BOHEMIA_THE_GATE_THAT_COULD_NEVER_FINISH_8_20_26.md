# THE GATE THAT COULD NEVER FINISH

**8/20/26 — WORLD lane. Two more of the fleet's red gates were rulers, not defects.
One of them was the gate that guards every other tool and gate in the repo, and it had
been unmeasurable for weeks because it tries to render eighty-five minutes of art
inside a ten-minute budget.**

---

## TOOLS RUN: THE META-GATE, TIMING OUT ON ITS OWN LAST SECTION

`gates/tools_run_gate.py` exists because of a specific humiliation, recorded in its own
docstring:

> *on 7/28 I pushed `tools/bohemia_district_hero_factory.py` to main WITH A PYTHON
> SYNTAX ERROR, and the full ~130-gate suite came back ALL GREEN.*

It makes four claims, cheapest first. Sections 1–3 parse every `tools/*.py`,
`tools/*.js`, `gates/*.py` and `gates/*.js` — 539 tools and 396 gates, in about a
second, and they catch exactly that defect. Section 4 checks the hero bank is
reproducible **by shelling out to the factory and rebaking all 69 heroes.**

That bake takes **eighty-five minutes.** The suite's budget is **600 seconds.**

So the gate could never finish. And because section 4 runs last, **it killed sections
1–3 with it** — the one-second parse checks never got to report. The fleet's audit
listed TOOLS RUN as red with the note *"times out at 600s"*, which is not red. It is
**unmeasured**, which is worse, because red at least tells you something.

**And its founding defect recurred while it was blind.** On 8/19 the hero factory sat
on main for a day with a **JavaScript comment block in a Python file**, unparseable,
and the gate written to catch that exact thing was busy timing out trying to render
art. The CHARACTER lane found it by bisecting.

### why it got slow, and it is the same cause as ART 45

The bake was not always 85 minutes. Paolo's 8/2 ruling — *"I want them TALLER. I want
them WIDER... BIGGEST AS FUCK"* — took the hero sprites to 1,748 px square. Nothing
downstream was rewritten to match. **Two separate gates broke on that one change, in
two different ways, and neither was noticed as a consequence of it.**

### the fix: make the claim on geometry, not pixels

Building every hero's **scene** runs every builder for real. It catches a syntax error,
an import error, and any builder that throws — the entire class this gate was born for.
It takes **1.8 seconds for all 69**, because the cost was never the geometry, it was the
rasterisation.

```
TOOLS RUN GATE: 8 passed, 0 failed  (539 tools, 396 gates parsed)
real  0m14.955s
```

Fifteen seconds, against a ten-minute budget, for a gate that had not returned a verdict
in weeks. The byte-identical rebake is still there, behind `BOHEMIA_FULL_BAKE=1`, for a
session that wants to spend the 85 minutes deliberately.

**And it gained a check it should always have had**, cheap enough to be free: *the bank
holds an icon for every district the factory can build, and nothing it cannot.* That
catches a real thing that happened this week — five landmark builders (`convention`,
`prison`, `dam`, `minigp`, `fort`) existed in the factory while main's bank still held
64 icons. Five districts had no art, and every icon gate happily measured the 64 it
could see.

## ART 45: AN 18-ROW WINDOW ON A 1,748-PIXEL SPRITE

```
FAIL: roofline top row is as wide as its widest row (flat-90 rectangle, not an iso diamond)
```

The 45 DEGREE ART LAW says original art is seen from the world's three-quarter view,
never flat side-on. The gate's proxy: a real iso mass has a **diamond top** — the
roofline widens below its top point — so take the top 18 rows and require the widest to
be 15% wider than the first.

Here is what the sprite it judges actually measures:

```
top 18 row widths: 617, 619, 621, 623, 625 ... 645, 647, 649, 651
```

**Exactly two pixels per row, perfectly monotonic.** That is the signature of a clean
2:1 iso roof edge — it is precisely what the law asks for. A flat-90 rectangle reads
617, 617, 617.

But 18 rows of a correct taper on a 1,748 px sprite buys +34 px. **5.5%, against a 15%
bar calibrated when these heroes were a few hundred pixels tall.** The art was right,
the roof was a diamond, and the ruler was measuring the first one percent of it.

**A fixed pixel window is a size test wearing the clothes of a shape test.** So the
check now measures the thing the law describes: an iso roofline descends at the
projection's slope, so its width grows steadily row by row; a flat-90 edge is horizontal
and grows not at all. Rate, not window — and the answer stops changing when somebody
scales the art.

```
iso-diamond roof (+2.21 px/row over 88 rows, 617 -> 809 px wide)
ART 45 GATE: 8 passed, 0 failed
```

## BOTH NEGATIVE-CONTROLLED, AND THIS IS NOW THE HABIT

Green proves nothing on its own. Every fix here was made to go red on purpose first:

| control | result |
|---|---|
| synthetic sprite with a constant-width top (a real flat-90) | **caught**, "0.00 px of width per row, 0 of 87 rows widening" |
| synthetic sprite with a 2 px/row taper | passes, 3/0 |
| a JavaScript comment block injected into a Python tool | **caught**, `tools/bohemia_hero_one.py:38 invalid syntax` |
| a district added to the factory with no icon in the bank | **caught by both new checks** |
| everything reverted | back to 8/0 and 8/0 |


## AND THE SPLIT CAME BACK, WHICH IS THE MORE USEFUL HALF OF THIS

Yesterday I moved a module out of the middle of `engine/bohemia_floorplan.js` and
called INTERIORS and BANNER fixed. **They were red again within hours.** Another lane
re-ran their patch tool from a base without my move, and their push won.

I had fixed the damage and not the cause. The cause is one line in
`tools/bohemia_city_furnish_patch.py`:

```python
ANCHOR = 'const BOH_FLOORPLAN=(function(){'
src = src[:i] + blob + src[i:]      # inserts BEFORE the body
```

That is the exact line where the floorplan's **comment header ends and its code
begins**. So every run of that tool cut the module in half and dropped 34,830 bytes of
two other modules into the wound. Nothing broke — both halves are top-level and the
declaration is intact, which is exactly why it survived. What died was byte-identity,
and byte-identity is the whole of the ENGINE SYNC LAW.

The RUN lane had independently found this the same day and written
`tools/bohemia_unsplit_floorplan_patch.py` to clean up after it. That tool fixes the
damage too. Neither of us had fixed the line that kept causing it.

**The fix is to anchor on the module, not on a line inside it:**

```python
FLOORPLAN_SRC = open('engine/bohemia_floorplan.js').read()
i = src.find(FLOORPLAN_SRC)          # the whole body, or nothing
if i < 0: sys.exit('... not contiguous; run the unsplit patch first')
i += len(FLOORPLAN_SRC)              # land PAST it
```

Finding the canonical file *whole* and landing past its end cannot split anything. And
if the page is already split the find fails and the tool **refuses** instead of making
it worse — which is the right answer, because guessing an insertion point inside a
module is what started this.

Proof the loop is closed: unsplit, then re-run **both** patch tools, then ask the page:

```
floorplan contiguous after BOTH tools re-ran?  true
furnish present? true   interior_ground present? true
CITY MODULE RESYNC: 92 embedded, 92 already fresh
```

Four gates went green off that one line — INTERIORS, BANNER, and **QUEST PLACEMENT**,
which was on the shard's red list and which I never targeted. It had been failing for
the same reason in a different vocabulary.

**A fix that does not remove the cause is a fix with a half-life.** Mine lasted about
four hours, and the only reason I found out is that I re-ran the gates after a rebase
instead of trusting yesterday's green.

## THE TALLY

Four of the fleet's red gates, examined this week with the question *"is this gate
measuring what it says it measures"*:

| gate | verdict |
|---|---|
| BANNER | ruler — counted a quest citation's 7 occurrences as 7 copies of a module |
| INTERIORS | ruler — a module cut in half by a neighbour's insert, every byte present |
| ART 45 | ruler — an 18-row window on a sprite that grew 5x |
| TOOLS RUN | ruler — 85 minutes of rendering inside a 600-second budget |

Four for four. And my own `legend_kept_gate` made the same class of mistake **four
times in two days** before it was right.

**A red gate is a claim, and a claim can be wrong.** The fleet's board says 29 red and
plans work against it. If a meaningful share of those are rulers, the board is not a
list of things wrong with the game — it is partly a list of things wrong with the
measuring.

The cheapest possible check on any red gate, before touching a line of the thing it
accuses: **read what it actually measures, and ask what changed since the number in it
was chosen.** Three of these four were broken by one event — Paolo making the icons
bigger on 8/2 — and not one of them was noticed as a consequence of it.
