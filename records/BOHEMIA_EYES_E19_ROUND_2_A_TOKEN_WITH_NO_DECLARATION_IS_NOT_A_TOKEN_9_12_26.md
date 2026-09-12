# EYES AND EARS -- E19 [slop count] ROUND TWO: THE CHECK
## "A TOKEN WITH NO DECLARATION IS NOT A TOKEN, AND THE FONT TELL IS ALREADY ANSWERED"
### 9/12/26 -- lane 17, round two of two. School was records/BOHEMIA_EYES_E19_ROUND_1_SCHOOL_THE_TELL_IS_FLUENCY_NOT_FEATURES_9_12_26.md

MODE: SCHOOL THEN CHECK (Paolo 9/6, LOCKED). School learned the subject and counted nothing.
This is the check: the instrument is built, proven to bite, and run on the three shipped
surfaces and on the real screen.

THE LAW: `laws/BOHEMIA_LAW_THE_UI_MUST_NOT_LOOK_VIBE_CODED_9_11_26.md` (Paolo 9/11, LOCKED):
*"People can look at it and be like, yep, that was coded."*

---

## THE HEADLINE: THREE BUCKETS, NOT TWO

| bucket | count | what it is |
|---|---|---|
| **TOKENISED** | **133** | the value comes from a custom property that is really declared |
| **PHANTOM** | **15** | `var(--skin-...)` whose variable is declared **nowhere**, so it always resolves to its own hardcoded fallback |
| **TYPED IN PLACE** | **693** | a bare literal written at the point of use. **The actionable list.** |

Round one expected two answers. The measurement found a third, and it is the finding of the
round: **the city file uses 21 `--skin-*` variables and declares none of them.** Zero
declarations anywhere in `slices/` or `engine/`. Every one falls through to the literal
written inside its own `var(..., fallback)`.

That is a literal wearing a token's name. Intent without mechanism, which is the precise
shape of this repo's oldest law: **A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED.** A token
with no declaration is not a token, and swapping the act-two skin today would change nothing,
because there is nothing to swap.

**There IS a real token set**, declared with values, and letter-spacing is almost entirely on
it already: `--face-casing`, `--face-screen`, `--face-body` (all `'BohemiaMono', ui-monospace,
monospace`), `--track-casing .4px`, `--track-screen 1px`, `--track-body 0`. The work is half
done under two different naming systems, one of which is real.

---

## THE SCALE -- WHAT THE TRADE ACTUALLY ENFORCES

Round one found that nobody in the industry forbids rounded corners; they enforce a permitted
set per property (`stylelint-scales`, `rhythmguard`, `no-arbitrary-border-radius`). The
question is never *"is there a radius"*, it is *"is this radius one of yours"*.

```
border-radius     18 distinct values
border-width       5 distinct values
box-shadow        14 distinct recipes
letter-spacing    11 distinct values
```

Five border widths is a scale. Eighteen radii and fourteen shadow recipes are not: they are
what you get when each one is typed where it was needed. This is the number that survives the
generic look moving on, per school's finding (a), and it is the one that can honestly be
ratcheted, because cleanup can only reduce it.

---

## AND THE GOOD NEWS, MEASURED, BECAUSE A SWEEP THAT ONLY FINDS FAULTS GETS MUTED

| the tell | ours |
|---|---|
| **trend fonts** (Inter, Poppins, Space Grotesk, Geist, Roboto, DM Sans...) | **0** across all three surfaces |
| the decided face `BohemiaMono` | embedded as woff2 at two weights in all three surfaces |
| ...loaded in the real browser | **yes** |
| ...first in the resolved stack on the chrome | **40 of 40 elements** |
| pictographic emoji in markup | **0** |
| dingbats and arrows in markup | 5 |
| CSS `text-transform: uppercase` on the chrome | **0 elements** |
| **controls that break when a reader widens letter spacing to WCAG 0.12em** | **0 of 42** |

The single biggest tell on every published list is the font, and it is answered: not one trend
font, a real face decided and embedded, and it renders. The accessibility test the tell lists
do not have comes back clean, with a planted chip proving the test can detect breakage.

**Two things that are still real:** 171 of 218 font declarations resolve to bare monospace with
no named face in front of them, so the decided face is reached on the chrome and not
everywhere; and **9 of 40 chrome elements have capitals typed into the text itself** rather
than applied with CSS. That is the accessibility half of the uppercase tell and the CSS count
cannot see it: a reader cannot turn typed capitals off, and a screen reader may spell them out
letter by letter.

---

## FIVE MISTAKES THIS ROUND MADE, EVERY ONE CAUGHT BEFORE A NUMBER SHIPPED

**1. IT REPORTED 16 NAMED DEFAULT FONTS AND EVERY ONE WAS `system-ui`.** One flat list of
"named default fonts" included `system-ui`, so the row read as sixteen trend fonts in a repo
that has none. **A false accusation aimed at the UI lane is the worst thing this lane can
produce.** Split three ways: TREND (the tell), PLATFORM (`system-ui`, not a trend and not a
decision either), and BARE MONO (the tell the law does name).

**2. IT REPORTED THAT NOTHING ASKS FOR THE DECIDED FACE.** A false zero: the chrome asks for
`BohemiaMono` *through* `var(--face-body)`, and the checker was grepping the declaration for
the face name. Fixed by resolving custom properties before testing the value. The real answer
is 20 declarations, and on the real screen 40 of 40 chrome elements.

**3. IT REPORTED 64 DISTINCT BORDER VALUES.** It was keeping the whole shorthand -- `1px solid
#241c12` -- so colour variation was being counted as scale sprawl. The scale question is about
the width. Real answer: five.

**4. FIXING (3) THEN MOVED 31 TOKENISED BORDERS INTO THE TYPED-IN-PLACE COLUMN**, because
trimming to the width threw away the `var(--line)` the declaration carried. **Attribution reads
the whole declaration; the scale reads the width.** Two questions, two quantities. Left alone,
that would have invented work for the UI lane that was already done.

**5. IT COUNTED 637 "DINGBATS".** Nearly all were arrows inside code and comments, because only
`<style>` was being stripped and not `<script>`. The law's tell is an emoji *inside a control*.
Real answer: 5 in markup, 0 pictographic.

---

## AND THE REAL-SURFACE HALF HAD TO ABANDON ITS OWN TEST

The plan was to prove the decided face RENDERS by drawing the same string in the element's own
stack and in a forced generic monospace, and calling identical widths a fallback. It reported
**0 of 40 rendering in the face, while the face was loaded and all 40 asked for it** -- because
BohemiaMono is itself a monospace and its advance width matches the generic mono exactly. **The
discriminator could not separate two monospace faces, so it was answering a question it could
not answer.**

What is honestly measurable: the browser says the face is available (`document.fonts.check`),
and it is first in every element's resolved stack. Available plus first is the face being used.
That is an inference and this record says so, rather than dressing it up as a pixel
measurement. The width probe is kept for the one thing it can do: prove an element is not
falling back to a sans (33 of 40; the other 7 are elements with no text, where the widths
coincide for a different reason).

---

## RULE ZERO: EIGHT CONTROLS, ALL PASS OR NOTHING PRINTS

- **C1, the one that mattered:** the skin's phone must be attributed to a token NAME, never to
  a bare literal. **Round one wrote this control as "must come back ON THE SKIN"; the
  measurement refined it**, because the skin variables are undeclared, so the phone reads
  PHANTOM rather than TOKENISED. The half that mattered survived the refinement: the phone is
  not a bare literal and is not on the actionable list. Saying which half of the expectation
  was wrong is the point of writing controls down.
- **C2** a literal `border-radius: 7px` is attributed TYPED IN PLACE.
- **C3** a `var()` whose variable IS declared is attributed TOKENISED.
- **C4** a `var()` whose variable is never declared is attributed PHANTOM.
- **C5** the scale counter separates a small scale from a sprawl: 5 distinct in the planted
  sheet, 30 in the thirty-radius sheet.
- **a planted fixed-width tight-uppercase chip breaks at 0.12em.** Its first version was 80px
  of text in a 64px box, so it was **already** clipped before the widening and the detector
  correctly refused to count it. **The control was the broken thing, not the detector:** a
  control has to pass before the change and fail after it, or it is testing nothing.
- **a planted flexible chip does not break at 0.12em.**
- **the decided face is actually loaded in the browser.**

---

## THE GATE

`tools/bohemia_eyes_slop.py --gate`, in the suite as **SLOP COUNT**. It ratchets **TYPED IN
PLACE (693)**, **PHANTOM (15)** and **every scale**, all shrink-only, and **reports the raw tell
count without ever freezing it** -- because moving a value onto a token is a real fix that
leaves the raw count unchanged, and a gate that cannot see a fix teaches the fleet to ignore it.

Proven to bite before registering: it reds on typed-in-place growing, on phantom growing, and
on the radius scale growing, and passes on the real state.

**It does not fail on any occurrence**, which is what the board row asked for. A gate red
forever gets muted inside a week (E3 measured it), and a muted gate is worse than none because
the fleet believes it is running. **It does not count dark mode**, which the lists call the
biggest tell, because this is a night-capable post-apocalyptic valley and the law itself says
dark is a choice per act.

---

## ROUTED
- **UI** -- the actionable list is 693 typed-in-place values, and the first cheap win is the 15
  phantom `--skin-*` names: declare them once and they become real tokens and a real act swap.
  Then the scale: 18 radii and 14 shadow recipes down to a chosen few.
- **UI and DIRECTION** -- 171 of 218 font declarations resolve to bare monospace. The face is
  decided, embedded and rendering on the chrome; it is not asked for everywhere else.
- **UI** -- 9 chrome elements carry capitals typed into the text. A reader cannot turn those
  off. Whether they should be capitals at all is DIRECTION's; that they are typed rather than
  styled is a fact.
- **THE COORDINATOR** -- the board row's "fails on any, target zero" and the law's own
  use-language are different instruments. This round built the law's one and says so out loud
  rather than substituting quietly.

## BLIND SPOTS, DECLARED
- The static half is a text scan of the shipped files: a value written by JS at runtime is
  invisible to it, which is why the real-surface half exists.
- It counts what is DECLARED, not what is on screen: a rule that never matches an element still
  counts.
- The real-surface half measured the walked city's chrome (40 elements). The demo and the other
  tabs were not driven this round.
- Nothing here says whether any of it looks good. That is DIRECTION's, by charter.
- Dark mode is deliberately not counted.

## FILES
- `tools/bohemia_eyes_slop.py` -- the static half, the buckets, the scale, the controls, the gate
- `tools/bohemia_eyes_slop_surface.js` -- the real screen: the face, the typed capitals, the WCAG test
- `records/BOHEMIA_EYES_SLOP_9_12_26.json` + `..._BASELINE_9_12_26.json`
- `records/BOHEMIA_EYES_E19_SURFACE_9_12_26.json`
