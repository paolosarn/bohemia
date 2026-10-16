# THE THUMB HAS NEVER BEEN CHECKED, AND THE DEMO HAD A DOOR IN IT
### 8/30/26, UI lane. Measured on the built demo, over a real http origin, at 390x844.

Paolo, 8/29: *"do big brain online research if you need to then execute ... WE HAVE
a demo to ship more forward motion work we need to complete."*

So this turn left the wall alone and went at the demo. Everything below is measured
on `slices/BOHEMIA_DEMO.html` — the file a stranger gets — not on the workshop.

---

## 1. WHAT I EXPECTED TO FIND, AND WHY I WAS WRONG TWICE BEFORE FINDING ANYTHING

**The 8/25 gap list says "THE DEMO BUILD DOES NOT EXIST."** It exists. The pages
workflow cuts it on every deploy. A five-day-old gap list is a second copy of a
fact, and the fact had moved.

**I then thought 70% of the demo was a dev tool.** The biggest script block in the
file is 3,076 KB and opens with `const RIG_B64=` — a whole dev-tool HTML page in
base64, whose only consumer is `if(t.dataset.p==='rig')`, a tab the demo deletes.
Unreachable weight, 70% of the download.

**That was wrong.** RIG_B64 is **125 KB**. The 3,076 KB is the whole script block,
which holds several blobs, and I had attributed it to the first declaration in it.
COMBAT_B64 is the 1.68 MB, and the demo genuinely needs the fight. **The cutter's
own header already said exactly this** ("Cutting tabs saves 125 KB of RIG_B64 at
most") and it was right and I was not. Measuring before cutting is the only reason
this is a paragraph and not a bug.

---

## 2. THE FIRST REAL FINDING, AND A RULER THAT NEARLY MADE ME REPORT A FALSE ONE

The city's toolbar carries a 🛠 that opens a builder drawer: **PEOPLE, REROLL,
UNDER, KEY, SLIDE.** The cutter's own words: a stranger tapping REROLL
*"regenerates the world under their own session ... not a cosmetic leak, it is a
destroyed playthrough."* It injects a stylesheet to hide it.

**Under `file://` the drawer is wide open.** I confirmed it, tapped it, and got the
full menu. That looked like a demo-breaking leak sitting under a green gate.

**It is not.** The injection is same-origin, and `file://` denies that access. The
catch swallows it exactly as the cutter's comment predicts. Served over real http,
`#devbtn` is `display:none` in the demo and visible in the workshop, precisely as
designed. **My test surface was the broken part** — the fifth broken ruler in two
days, and the first one that would have had me file a bug against another session's
correct work.

**But there IS a window, and it is real.** The hide runs on a 400ms `setInterval`.
Sampling from the moment the city frame becomes readable, over http, on the built
demo:

    the builder button was on screen AND returned by elementFromPoint
    149ms after the tap into the city.

A thumb landing in the top-right corner in the first half second opens REROLL. A
poll cannot close that; only watching for the frame the instant it is created can.
**Fixed:** a MutationObserver on the panel that receives the frame, dressed on
creation and on load, plus every animation frame for the first two seconds, with
the original interval kept underneath as the belt to that pair of braces. Measured
after: **0 of 6 samples tappable, from the first frame.**

---

## 3. THE HEADLINE: A STANDING LAW WITH NO GATE, FAILING 92%

THE THUMB — 44px minimum, iPhone portrait — is a standing law in CLAUDE.md. This
game ships on one device. **Nothing in ~453 gates had ever measured a control.**

Measured on the demo's first city screen:

| | |
|---|---|
| tappable controls | 13 |
| **under 44px** | **12 (92%)** |
| the top chips | 30px tall — 68% of target |
| the eight walk arrows | 42px — and they are the game's ONLY movement input |

**Three ways of finding those controls each confidently returned ZERO on a screen
with eight visible buttons on it.** `[onclick]` matches only the attribute. The
`onclick` property misses `addEventListener` too. CDP's `getEventListeners` can see
them, but its object handles do not cross cleanly into a child frame. What works is
**wrapping `addEventListener` before the page runs** and letting the page announce
every handler as it registers it: it cannot miss one and needs no debugger.

**Fixed, demo-side only.** `slices/BOHEMIA_CITY_WORLD.html` is another lane's file
and this lane does not reach into it — same rule the cutter already set for the
drawer. The workshop keeps exactly the sizes it has and those rows are **filed, not
silently patched.**

**The arrows grow without moving.** The pad is a 180px radial layout of eight 42px
boxes at fixed offsets around an 80px centre. Growing them to 44 with a `-1px`
margin expands each by one pixel in every direction and leaves every centre exactly
where it was: 44+80+44 = 168 inside 180, widest pair still clearing by 3px. **The
geometry he plays with is untouched.**

Result: **0 of 14 controls under 44px. No overlap, nothing off screen.**

---

## 4. AND I BROKE THE DRAWER FIX WITH THE THUMB FIX

The thumb rule sets `display:flex` on every child of `#topbar`. **`#devbtn` is a
child of `#topbar`.** Two `!important` declarations at equal specificity are settled
by ORDER, so the later thumb rule beat the earlier hide and the builder button came
back — 44x44 and tappable for the **whole session**, which is worse than the 149ms
window it was written to close.

A rule can be individually correct and wrong because of where it sits. That is the
8/16 border lesson and the 8/27 hairline lesson wearing a third hat. The hide now
goes **last** and carries a **compound selector**, so it wins on specificity as well
as on order and cannot be undone by anything added above it later.

**Only a check that reads both at once catches that**, which is why the gate does.

---

## 5. THE GATE

`gates/thumb_gate.js`, 9 claims, registered as **THE THUMB**. It:

- **serves the slices over a real http origin**, because a `file://` probe reports a
  leak production does not have and would miss one it did;
- **wraps `addEventListener` before the page runs**, because three document-side
  methods each found zero;
- **judges the drawer by `elementFromPoint`**, not by visibility, because a control
  can be on screen and under a modal, and because a poll leaves a window;
- **proves holding an arrow still WALKS him**, against a still control — a world
  that animated on its own would make any two frames differ and the check would
  pass no matter what.

**Mutation-proved four ways, all caught, all restored:** remove the chip minimum;
remove the drawer hide; shrink the arrows back to 42; and — the one that matters —
leave the arrows at a correct-looking 44px but set `pointer-events:none`, so the
demo measures perfectly and cannot move. That last mutation is the reason the walk
leg exists.

Other lanes' demo gates re-run clean: demo_build 25/25, demo, demo_blockers,
demo_day, the_whole_demo, touch_guard — all green.

---

## 6. WHAT IS STILL OPEN AND IS NOT MINE

- **The workshop's own chrome is still 30px.** Filed, not patched. Another lane's file.
- **Weight.** 4.38 MB in one request, 1.68 MB of it COMBAT_B64, which the demo needs.
  Blocker F (24s to first play) is RUN's, and the cutter says so explicitly.
- **The ending.** Gap G. The day still ends by going to bed.

---
---

# PART TWO, SAME DAY: EVERY WALK BUTTON WAS DRAWING TWO ARROWS
### and my own eye was wrong about these arrows for the third time in this project

Paolo: *"keep building ill vote next round."* So: the top unblocked row in this lane.

## 7. THE TOP ROW WAS ALREADY DONE BY SOMEBODY ELSE

**UI-2** is his own 8/25 dispatch, LOCKED: *"I HATE THAT THE ACTION BUTTON IS THE
CITY BUTTON ... I SCROLL OUT AND SCROLL INTO THE CITY NOT BY CLICKING THE ACTION
BUTTON."* It is filed as UI-owned and open.

**It shipped on 8/27.** The city's own source says so in a comment written by the
lane that did it: *"before THE ACTION BUTTON DOES ACTIONS you had to press DROP IN
on purpose to come through here. Making zoom the way in and out -- his ruling, and
correct."* My row was stale. Building it again would have been the fourth-version
failure that STOP PRODUCING names.

## 8. BUT THE PAD ITSELF HAD A REAL ONE, AND IT IS UI-12's

Reading `padMode()` to understand the swap turned up the actual defect.

The city already carries UI-12's fix: the direction is drawn, not typed — a CSS
border triangle on `.pb::before`. **Its eight rotations measure exactly
0 / 45 / 90 / 135 / 180 / 225 / 270 / 315**, correct for all eight.

**The original text glyph was never removed.** It is still the button's
`textContent` at 15px, so every control renders a correct triangle **with a stray
arrow stuck to it.** Proved by shooting each button, hiding only the text, and
shooting again: **8 of 8 changed**, and what is left is a clean triangle.

That is a half-finished fix that left the old thing standing beside the new one —
the same shape as the two hairline bugs on 8/27, where a correct comment sat over
incorrect code.

**Checked in both of the pad's modes rather than assumed.** `padMode()` swaps the
text between `dataset.walk` (↑) and `dataset.mapmove` (⇑). The drawn triangles are
present in **both** — one triangle for walking, two stacked for map-move — so the
glyph is redundant in both. In map mode it was rendering in a **different colour**
from the triangles it sat on.

Fixed demo-side, one line. Gated. Mutation-proved: put the glyph back, gate goes red.

## 9. AND THEN I NEARLY FILED A SECOND BUG THAT DOES NOT EXIST

Looking at the cleaned pad, the four diagonals read to me as pointing **inward**,
toward the centre of the ring. That would be a serious bug on the game's only
movement control.

**Two of my own rulers agreed with me, and both were wrong.**

- **Ruler A** measured ink as "anything brighter than the median." The buttons are
  **dark circles on a light background**, so it was measuring the tan background in
  the corners, not the arrow. Every number it produced was noise.
- **Ruler B** cropped inside the circle — correct — but modelled the tip as
  *opposite the centroid offset*, on the theory that a filled arrow piles its mass
  at the base. That holds for an axis-aligned triangle and **inverts for one sitting
  at 45 degrees**. It reported all four diagonals **exactly 178 degrees off**, all
  four identical. *A real bug is never that tidy.* The tell was in the number.

**Ruler C**, which works, uses no model of where mass sits: sweep every direction,
take the leading 18% of the ink along it, and find the direction where that leading
slice is **narrowest**. A triangle is narrow at its tip whatever angle it sits at.
Validated on the four cardinals first, where the answer is not in doubt: 0° error on
all four. It says **all eight point correctly, max error 7°.**

**And then a check with no model at all**, because after three disagreements I did
not want a cleverer instrument, I wanted arithmetic. If the pad is "one shape, eight
rotations", then the UP button's own shipped pixels rotated 45° clockwise must equal
the NE button's pixels:

    UP turned  -45°  vs  ↗   overlap 76%
    UP turned  -90°  vs  →   overlap 64%
    UP turned -135°  vs  ↘   overlap 63%
    UP turned  180°  vs  ↓   overlap 58%
    UP turned  135°  vs  ↙   overlap 63%
    UP turned   90°  vs  ←   overlap 64%
    UP turned   45°  vs  ↖   overlap 76%

Every button is the up arrow, correctly turned. **The rotations were right the whole
time and I was wrong three times about the same eight arrows** — twice in August with
a squat triangle, and again today.

**THE STANDING LESSON, now earned three times over: when a shape sits at 45 degrees,
neither a bounding box nor my own eye can be trusted about which way it points. Turn
the known-good one and compare pixels.**

There is one honest observation left in it, and it is taste, not a bug: **a wide
triangle is genuinely hard to read at a diagonal.** Not acted on — he is mid-way
through choosing the whole UI look, and a shape change now would be answering a
question he has not been asked.

## 10. WHERE THIS LEAVES THE ROWS

- **UI-2** — closed, done by another lane on 8/27, verified in their source.
- **UI-12 for CITY** — the drawn triangle was already there and correct; what was
  open was the leftover glyph, now fixed demo-side and gated. Filed for the city lane.
- `gates/thumb_gate.js` is 11 claims now, mutation-proved five ways.

---
---

# PART THREE: "FAMILY", AND THE DOOR TO IT WAS TOO SMALL TO HIT
### and the gate I wrote yesterday had the exact hole its own header warns about

Paolo, one word: **"VAMILY"** — voice-to-text for **FAMILY**. Never take a garbled
word literally; decipher the intent. Family is not a passing note in this project,
it is the LOCKED core theme (7/19): *"STRONG FAMILY CAN CONQUER ALL. NOBODY IS
ANYTHING WITHOUT FAMILY ... you do not play a hero, you play a FAMILY across three
generations."* The whole final choice is true family against the Amalgamation's
counterfeit one.

So: **where does family actually reach the player?**

## 11. THREE DEAD ENDS FIRST, AND SAYING SO

- **There is no family tab.** Nineteen `data-p` panels in the alpha, none of them family.
- **`familyOf()` in the city is not about kin at all.** It appears ten times and it is
  the *suburb family* from the LANDLOCKED DISTRICT LAW — which districts count as the
  same family for a road relay. A promising name for the wrong thing.
- **A runtime probe found no family globals and no people list.** That proves nothing:
  the city keeps them inside module closures. *Saying where I looked, because a
  confident negative is the most expensive kind of wrong.*

## 12. WHERE IT DOES REACH THE PLAYER, AND IT IS GOOD

The cold open. **DAY 1 BEGINS BEFORE THE DAY / The family, the table, ten years ago.**
Pressed WATCH and followed it for thirty seconds:

    DENISE   Sit down, both of you. It's getting cold.
    NINA     I'm not eating the green ones.
    DENISE   NINA. Green ones too. We do this every night.
    RAY      They're saying the water district's hiring again. I'll go down Monday.
    MARCO    Can I take the truck Saturday? I'll put gas in it, I swear.

Five people at a table, warm light through the shutters, food on it. The speaker's
portrait was **visible in 40 of 60 samples and had real pixels painted in 47 of 60** —
the 8/27 talking portrait is working here. **This is the best thing in the demo.**

*A thing I nearly reported and did not:* my probe read the caption as
`"DENISESit down, both of you"` and it looked like the speaker name was jammed into
the line. It is not. The markup is `<span>DENISE</span><br>Sit down…` — a proper
break. `textContent` concatenates children; **the probe was jamming it, not the game.**
Checked the markup and a screenshot before saying a word.

## 13. THE FINDING: THE DOOR TO IT IS 57% OF A THUMB

That scene has two buttons — **WATCH** and **NOT NOW**. Measured on the demo at
390x844:

    openWatch   79 x 25
    openNot     79 x 25

**25 pixels tall against a 44px minimum.** They are the **first two buttons anybody
ever touches in this game**, and WATCH is the only door to the one scene that carries
the game's core theme. A stranger who fumbles that tap gets the city and never meets
the family at all.

Fixed demo-side, height only — the width is left alone because these sit in a flex row
inside a 390px overlay and stretching them is a layout change in another lane's scene.
The workshop keeps its 25px and the row is filed.

## 14. AND MY OWN GATE HAD THE HOLE ITS HEADER WARNS ABOUT

`thumb_gate` was written yesterday. Its header says, in its own words, that scoping to
the demo is *"a scope, not an exemption — an exemption written for yourself and stated
as a principle is how a 23% sat under a green gate all morning."*

**It swept the city frame only.** The opening overlay lives in the OUTER document, so
the first two buttons of the entire game were never measured, and the gate was green
the whole time. That is an exemption written for myself and stated as a scope,
committed by the author of that header, **one turn after writing it.**

The gate sweeps every document now: the opening overlay and the city, 21 controls
instead of 14, plus a leg that fails if it ever stops looking at the overlay. **12
claims, mutation-proved six ways** — the newest one shrinks the cold open buttons back
to 25px and the gate goes red naming both of them.

**THE LESSON, and it is not about buttons:** a gate that picks which surface to measure
will pick the one it is comfortable with. *State the scope, then check that the scope
still contains the thing that matters.* Writing the warning down is not the same as
obeying it.
