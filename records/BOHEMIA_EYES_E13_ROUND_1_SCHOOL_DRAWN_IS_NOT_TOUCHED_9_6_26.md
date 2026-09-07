# EYES AND EARS -- E13 [half size check] -- ROUND ONE OF TWO: SCHOOL
## DRAWN SIZE IS NOT TOUCH SIZE
### 9/6/26 -- session eyes-5vql33 -- NO MEASURING WAS DONE THIS ROUND, ON PURPOSE

The job, from the board:

> DID-THE-UI-ACTUALLY-HALVE -- school first, as always: learn how UI scale is measured
> honestly on a phone (density-independent pixels, safe areas, the difference between drawn
> size and touch size) before measuring anything. Then check Paolo's 9/6 order landed: every
> UI element on the walked surface at 50%, and every touch target still 44 px.

The order it is checking, from UI's own row:

> PAOLO 9/6, LOCKED: "for the run right now make all the UI 50% smaller, I don't give a
> fuck." ... THE ONE RULE THAT SURVIVES: tap targets ... a control is DRAWN at half size
> while its invisible touch target stays 44 px.

Round one is school. No element was measured. What follows is what the craft and the standards
already know, two findings that prove the job's own test wrong, and the design round two builds.

---

## 1. A CSS PIXEL IS NOT A PIXEL, AND MEASURING A SCREENSHOT WOULD BE WRONG BY 2 TO 3 TIMES

Since CSS 2.1 the `px` is an absolute unit: **96 px = 1 inch**, by definition, because too much
existing content assumed 96 dpi. The bridge to hardware is one multiplication:

> **physical pixels = CSS pixels x devicePixelRatio**

An iPhone 15 is about **393 CSS px wide at DPR 3**, which is 1179 device pixels. Flagship phones
run DPR 2.5 to 3.0 with CSS viewports around 360-430 px. Android says the same thing in another
alphabet: a dp is a px at 160 dpi. And there are two viewports, not one: the **layout** viewport
that blocks are laid out in, and the **visual** viewport that is actually on screen after pinch
zoom or an on-screen keyboard.

**WHAT THIS CHANGES FOR US.** This lane already captures at `{width:390, height:844,
deviceScaleFactor:2}`. A saved screenshot from that context is **780 x 1688 image pixels**. If
round two measured a button in that image it would read 2x too big and pass a control that is
half the legal size. Every number in round two must come from `getBoundingClientRect()` in the
page, which is CSS px, or be divided by the device pixel ratio before anyone looks at it. The
44 in "44 px" is 44 **CSS** px, and the rule is written that way in the standard on purpose.

---

## 2. "44" IS NOT ONE NUMBER, AND ENFORCING IT AS AN ABSOLUTE WILL FAIL CORRECT WORK

There are four bars in circulation and the job quotes the strictest one as if it were the law:

| bar | size | where it comes from | escape hatches |
|---|---|---|---|
| WCAG 2.2 **2.5.8** Target Size (Minimum), level **AA** | **24 x 24 CSS px** | the actual conformance floor | **five**, including a spacing offset: an undersized target passes if a 24 px circle centred on it hits nothing else |
| WCAG **2.5.5** Target Size (Enhanced), level **AAA** | **44 x 44 CSS px** | the aspirational bar | four, and **no spacing escape** |
| Apple HIG | 44 x 44 **pt** | platform guidance | guidance, not a checker |
| Material | 48 x 48 **dp** | platform guidance | guidance, not a checker |

WCAG 2.5.5 is essentially the platform ergonomics written down as something testable. But the
level that anybody is actually held to is **24 with a spacing rule**, and that spacing rule is
the interesting part: a small control surrounded by empty space is compliant, and a big control
crowded up against three others can still be a rage-tap.

**WHAT THIS CHANGES FOR US.** Round two reports **both bars, separately, with the spacing rule
applied to the AA one**, and never collapses them into a single pass/fail. A check that fails
everything under 44 with no exceptions will red the suite over controls that are correct, and a
checker that cries wolf gets muted in a week. That warning is not general: it is the same one
that killed the first version of this lane's own NO READER gate one round ago.

---

## 3. THE BIG ONE: DRAWN SIZE IS NOT TOUCH SIZE, AND SPLITTING THEM IS THE RECOMMENDED TECHNIQUE

This is the finding the job's own brief was written around, and it is stronger than the brief
suggests. Expanding a control's hit area **without changing its look** is a standard, documented
pattern:

```css
.control { position: relative; }
@media (pointer: coarse) {
  .control::after { content: ""; position: absolute; inset: -8px; }
}
```

A pseudo-element belongs to its parent, so it acts as the parent's touch area. Unlike padding or
a border it does not touch the box model, so it does not move anything in the layout. The
`@media (pointer: coarse)` wrapper means mouse users see no change at all. The CSS Working Group
has an open issue (csswg-drafts #4708) asking for a first-class property to do this, which tells
you both that the need is real and that the pseudo-element hack is still how it is done.

**WHAT THIS CHANGES FOR US, AND IT IS THE WHOLE DESIGN OF ROUND TWO.** Paolo's order and this
technique fit together exactly: draw at half, keep the thumb at 44. That means **the visible
rectangle and the tappable rectangle are deliberately different**, and

> `getBoundingClientRect()` measures paint. It cannot see a hit area at all.

So round two must **hit-test**: from a control's centre, walk outward with
`document.elementFromPoint()` until the point stops resolving to that control or one of its
descendants. That traces the real tappable rectangle, expansions included. Measuring the drawn
box would answer a question nobody asked.

---

## 4. AND OUR OWN SHIPPED CHECKER MEASURES THE WRONG ONE. THIS IS A PREDICTION, TO BE PROVED IN ROUND TWO

`gates/phone_readable_gate.js` is where "[phone readable] just shipped a 44 px minimum" comes
from. Reading it:

```js
kids.forEach((k, i) => { const r = k.getBoundingClientRect();
  out.push({ id: ..., w: Math.round(r.width), h: Math.round(r.height) }); });
...
const tooSmall = newCtrls.filter(x => x.missing || x.w < 44 || x.h < 44);
```

Two things follow, and both are round two's to verify rather than assert:

1. **It measures the drawn box.** So the moment a control is drawn at half size with an expanded
   invisible hit area -- exactly the thing the order asks for -- this gate is set up to go red on
   work that is correct. The order and the checker are pointed at each other.
2. **It is not a sweep.** It checks two named controls (`settext`, `setmotion`) on one screen of
   the demo. **There is no general touch-target check anywhere in this repo.** The job says
   "every touch target still 44 px" and nothing in the fleet can currently answer "every".

That second one is the bigger finding. It is also the gap E13 round two exists to fill.

---

## 5. THE REAL-WORLD HALF: FITTS'S LAW SAYS HALVING A CONTROL HAS A PRICE, AND THE PRICE DEPENDS ON DISTANCE

Fitts's law: the time to move a pointer to a target is a function of the **distance to the
target divided by the size of the target**. It holds for fingers on touchscreens, not just mice.
On a phone the distance term is not abstract pixels, it is the physical arc of a thumb.

**WHAT THIS CHANGES FOR US.** "Did it halve" and "is it still 44" are both size questions, and
size is only half of Fitts. Halving a control makes it slower to hit, and it gets worse the
further the control sits from where the thumb rests. Round two cannot rule on that (taste and
layout are DIRECTION's and UI's), but it can **report the distance from the screen centre**
alongside the size, so the cost is visible instead of invisible. That is a number, not an opinion.

---

## 6. THE THUMB ZONE, AND THE MAN WHO INVENTED IT WALKING IT BACK

Steven Hoober's field observations are the source everyone cites: about **49% of people hold a
phone one-handed** and about **75% of interactions are thumb-driven**, which produced the famous
heat map of easy and hard reach.

And then the counter, from the same researcher: **he later argued against treating the thumb zone
as fixed**, because people constantly change grip rather than locking into one, and because they
**prefer to touch the centre of the screen, where they tap fastest**.

**WHAT THIS CHANGES FOR US.** A check that scored controls by whether they sit inside a thumb arc
would be enforcing design lore that its own author revised. Round two does not score placement.
It reports distance from centre because Fitts needs it, and it stops there.

---

## 7. SAFE AREAS: A CONTROL CAN BE 44 PX AND STILL BE UNREACHABLE

`env(safe-area-inset-*)` with `viewport-fit=cover` exists because the notch, the rounded corners
and the home indicator eat parts of a screen that CSS otherwise thinks it owns. A 44 px button
sitting under the home indicator is 44 px and unusable.

**WHAT THIS CHANGES FOR US.** Round two adds one cheap extra column: is any control inside the
bottom or top inset. This lane already learned the harder version of this lesson the expensive
way, when round one of E0 announced that the demo's SLEEP button ran off the bottom of an iPhone
and it turned out to sit twelve pixels clear. The lesson stands: measure in the phone's
coordinates, and say which coordinates.

---

## 8. THE FINDINGS THAT PROVE US WRONG

Two, and the first one is bigger than the job.

### a) "DID IT HALVE" IS NOT ANSWERABLE BY MEASURING THE SURFACE, AND IT FAILS FOR EXACTLY THE REASON E11 FOUND

Half **of what**? A measurement of the shipped surface produces sizes, not a ratio. To answer the
question as asked you need the sizes from before the order, and if nothing in the repo recorded
them, then the ruling "make it 50% smaller" **exists only as pixels** and cannot be checked at
all. That is E11's disease, one week later, in a different lane:
`records/BOHEMIA_EYES_E11_ROUND_2_THE_NO_READER_SWEEP_9_6_26.md`.

So round two's **first** job is not to measure the after. It is to establish whether a before
exists, in this order:

1. Is there a **scale factor in a file** (a `--ui-scale` custom property, a constant, a
   multiplier)? If yes, the answer to "did it halve" is that number, read from the file, and it
   is exact.
2. Failing that, is there a **before** in git history for the same elements? A ratio against a
   commit is honest, if slower.
3. Failing both, the honest verdict is **"unmeasurable, and the fix is a file, not a number"** --
   and this lane says so rather than inventing a baseline and calling it half.

That reframes the job. The interesting deliverable may not be "yes it halved". It may be "nobody
can ever tell, and here is the one line that would fix that forever".

### b) THE JOB'S OWN TEST, "EVERY TOUCH TARGET STILL 44 PX", IS OVER-STRICT AND POINTED AT THE WRONG RECTANGLE

Section 2 says 44 is the AAA bar and the conformance floor is 24 with a spacing rule. Section 3
says the rectangle that matters is the hit area, not the paint. Section 4 says our one existing
checker measures the paint. Put together: a literal reading of the job would produce a red list
full of controls that are correct, on a repo whose only related gate is already set up to make
the same mistake.

Round two therefore reports **three columns, not one**: drawn size, hit-tested touch size, and
which bar each control clears (AAA 44, or AA 24-with-spacing, or neither). Only the third column
is a defect.

---

## 9. THE INSTRUMENT DESIGN FOR ROUND TWO (SPEC ONLY, NOTHING BUILT THIS ROUND)

**Order of operations, and it is deliberate.**

1. **Find the before.** Scale factor in a file, else git history, else declare it unmeasurable.
2. **Enumerate every control on the walked surface**, not two named ones. Everything with a
   click handler, `role=button`, a `.pb`-style class, or a cursor that says it is pressable,
   across every frame, at 390 x 844.
3. **Per control, three rectangles:**
   - DRAWN: `getBoundingClientRect()`, in CSS px, in the phone's coordinates with the frame
     offset added (this lane has been burned once already by frame-local coordinates).
   - TOUCH: hit-tested with `elementFromPoint()` walking outward from the centre until the point
     no longer resolves to the control or a descendant.
   - SPACING: distance to the nearest other control's touch rectangle, for the AA rule.
4. **Three verdicts, reported separately:** clears AAA 44; clears AA 24-with-spacing; clears
   neither. Plus distance from screen centre, for Fitts.
5. **Safe areas:** flag any control inside the top or bottom inset.

**RULE ZERO, and this job has a specific trap.** A hit-test that is subtly broken silently
degrades into the old wrong check: it just returns the drawn box every time and looks plausible.
So round two plants two controls before it trusts anything: one drawn small with an expanded hit
area (**the touch box must measure bigger than the drawn box**), and one drawn small with no
expansion (**the two must measure the same**). If the first control does not separate, the
instrument is measuring paint and its numbers are void.

**Ratchet.** Freeze the count of controls that clear neither bar. It may only go down.

**Blind spots to declare, not to count clean.** One viewport and one DPR is not every phone.
Controls only reachable down a path the walk never takes are not enumerated. A control that is
disabled or hidden at capture time is not the same as one that does not exist. And this measures
geometry, never whether the thing is legible, which is a different job with a different bar.

---

## ROUTED
Nothing this round. School routes nothing. The prediction about `phone_readable_gate.js` is a
prediction and is not going anywhere as a defect until round two has measured it; if it holds, it
is one `[eyes: two words]` line and nothing more.

Also noted, not routed: UI's `[half size]` row is **CLAIMED, not shipped**. If it is still
unshipped when round two runs, the honest thing is to measure what is there, say the order has
not landed yet, and re-run when it does. This lane does not grade work that has not shipped.

## SOURCES
- WCAG 2.2 SC 2.5.8 Target Size (Minimum), 24x24 and its five exceptions -- https://wcag22aa.org/new-criteria/target-size/
- SC 2.5.8 implementation guide -- https://www.allaccessible.org/blog/wcag-258-target-size-minimum-implementation-guide
- SC 2.5.5 Target Size (Enhanced), 44x44 CSS px -- https://accessibility.build/wcag/2-5-5
- 2.5.5 in plain english -- https://aaardvarkaccessibility.com/wcag-plain-english/2-5-5-target-size-enhanced/
- Target size, all touch targets 24px or sufficient space -- https://www.accessibilitychecker.org/wcag-guides/all-touch-targets-must-be-24px-large-or-leave-sufficient-space/
- Accessible target sizes cheatsheet (rage taps) -- https://www.smashingmagazine.com/2023/04/accessible-tap-target-sizes-rage-taps-clicks/
- Accessible tap targets -- https://web.dev/articles/accessible-tap-targets
- Larger touch targets without changing element size -- https://modern-css.com/larger-touch-targets-without-changing-element-size/
- Pseudo-elements to expand hit areas -- https://51bits.com/expanded-hit-areas/
- Enhancing the clickable area size -- https://ishadeed.com/article/clickable-area/
- CSSWG issue 4708, increase pointer target size independently of layout -- https://github.com/w3c/csswg-drafts/issues/4708
- Device pixel ratio explained -- https://tomroth.dev/dpr/
- CSS pixels vs physical pixels, retina, PPI vs DPI -- https://www.whatismyscreensize.com/blog/device-pixel-ratio-css-pixels-retina-scaling-explained
- Device pixel ratio and viewport guide (layout vs visual viewport) -- https://whatismytools.com/blog/device-pixel-ratio-viewport-guide
- Device pixel (MDN) -- https://developer.mozilla.org/en-US/docs/Glossary/Device_pixel
- Fitts's law and touch target sizing on mobile -- https://evelance.io/blog/fittss-law-touch-target-sizing-mobile/
- Fitts' law in the touch era -- https://www.smashingmagazine.com/2022/02/fitts-law-touch-era/
- Target size study for one-handed thumb use (Parhi, Karlson, Bederson, MobileHCI 2006) -- https://www.microsoft.com/en-us/research/wp-content/uploads/2006/01/parhi-mobileHCI06.pdf
- The thumb zone -- https://www.smashingmagazine.com/2016/09/the-thumb-zone-designing-for-mobile-users/
- Designing for the thumb zone, including Hoober walking the fixed zone back -- https://timgraf.com/ux-design/designing-for-the-thumb-zone-a-modern-guide-to-mobile-ux-that-respects-human-anatomy/

## OUR OWN FILES THIS LEANS ON
- VAMILY.md, UI section: Paolo 9/6 LOCKED, "make all the UI 50% smaller", and the tap-target rule that survives it
- gates/phone_readable_gate.js (the 44 px check, and what rectangle it measures)
- records/BOHEMIA_EYES_E11_ROUND_2_THE_NO_READER_SWEEP_9_6_26.md (a ruling that lives only as pixels cannot be checked)
- records/BOHEMIA_EYES_E3_HOW_TO_CATCH_A_VISUAL_REGRESSION_9_5_26.md (the ratchet, and false-alarm fatigue)
- records/BOHEMIA_EYES_ROUND_1_WHAT_THE_MACHINE_SAW_9_5_26.md (the withdrawn SLEEP-button finding: measure in the phone's coordinates and say which coordinates)
