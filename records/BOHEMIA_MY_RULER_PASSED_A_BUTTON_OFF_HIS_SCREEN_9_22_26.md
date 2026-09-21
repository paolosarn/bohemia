# BOHEMIA -- MY RULER PASSED A BUTTON THAT WAS OFF HIS SCREEN (UI lane 11, 9/22/26)
# Rows [phone is the button] and [notes on screen], one push, as the board asked.

Paolo 9/22, verbatim (records/BOHEMIA_PAOLO_CITY_MODE_9_22_26.md, frame
records/target/PAOLO_CITY_MODE_9_22_26.png): "How do I access the notes to make notes as I'm
playing the demo?" and "There shouldn't be a phone button in the top right. I should click
the phone and then it opens the phone... the phone is the phone button."

His frame shows the top bar reading `CITY MODE  FREEWAY  DAY 2 · 20:15 NIGHT  T  SAVE  PHONE`
and then the edge of the glass. NOTES is past it. I shipped that NOTES chip one round
earlier with a gate that was green.

## 1. WHY MY GATE PASSED A BUTTON THAT WAS OFF HIS SCREEN

`the_notes_section_gate.js` had a leg called "it is on screen" and it asked:

    r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth

**`r.left < innerWidth` is true for a control hanging off the right.** A chip whose left edge
is at 380 and whose right edge is at 424 passes that check on a 390 px phone. The leg was
satisfied by exactly the thing he was complaining about.

That is the FOURTH time in this lane a ruler has agreed with itself and disagreed with his
phone. The question is rewritten once, here, in the only form that means anything: **is the
whole control inside the glass.** Both gates ask it that way now.

## 2. FIVE PROBES THAT MEASURED THE WRONG THING, AND WHAT EACH ONE TAUGHT

I could not reproduce his overflow, and the way I failed is worth more than the fix.

1. **Measured `#menubar` at 390 and it fit.** But my bar said `HUMAN MODE / SUBURB · ON FOOT`
   and his said `CITY MODE / FREEWAY / DAY 2 · 20:15 NIGHT`. I was measuring the walking
   screen; his photograph is city mode.
2. **Crossed the seam and it still fit** -- and my labels came back `REGION / ZOOM OUT`, with
   no clock at all, which is not his bar either.
3. **Cut the exact build he played** (2490fc8, BUILD 9/21f) in a throwaway worktree and
   measured that. Still fit. **That whole step was worthless and I did not know it until
   step 5.**
4. **Searched the live page for the words in his photograph.** Zero elements said CITY MODE.
   The string lives in `#hmode`, which a second writer overwrites; so I stopped naming ids
   and put his exact strings into the exact spans by hand. It still fit, because the flex
   squeezes the music chip -- and his shows that chip crushed to a single letter `T`, which
   is the same mechanism working, just not far enough.
5. **THE CONTROL THAT KILLED THE WHOLE APPROACH: the demo cut REFERENCES the city file, it
   does not inline it.** So serving an old cut still serves the CURRENT city. Every
   measurement I had made "on his build" was my own working tree wearing an old name.
   Confirmed by asking the served page for a string only my new code has: it was there in
   both. **There is no "before" I can fail against.**

So this round has no reproduction, and I am not going to claim one.

## 3. WHAT I FOUND INSTEAD, AND IT IS SPECIFIC

**Not one file in this game set `-webkit-text-size-adjust`.** Measured: zero hits across the
city, the demo and the alpha. iOS Safari inflates text in some layouts when this is unset,
and this bar is `white-space:nowrap`, so inflation pushes its right end straight off the
glass -- which is the picture he sent. Headless Chromium never inflates, which is exactly why
five probes of mine measured a bar that fit.

**I cannot prove that is his cause.** It costs nothing, it removes the whole class, and it is
now set. That is the honest shape of it: a named, plausible, cheap cause, stated as plausible.

## 4. THE FIX THAT DOES NOT DEPEND ON THE DIAGNOSIS

Because I cannot reproduce it, the fix had to be a PROPERTY rather than a patch to a measured
number.

- **The PHONE chip is gone** (his ask), which gives back about 32 px.
- **`#barright` is `flex:0 0 auto`.** The right-hand group carrying SAVE and NOTES cannot
  shrink and cannot wrap. Whatever the left side does, those controls keep their width and
  their place. The pressure goes into the music track name and the clock, which are now
  `overflow:hidden; text-overflow:ellipsis` and are *allowed* to lose letters -- his already
  was, which is why it read `T`.

**A readout losing a word is a nuisance. A control off the glass does not exist.** That is the
whole rule and it is one line of CSS.

Held under stress: his exact words in the bar, the glass narrowed to 320, the type forced 30%
bigger -- NOTES is still whole at 268..312 of 320.

## 5. THE PHONE IS THE PHONE BUTTON

The chip is removed from the DOM rather than hidden, because a `display:none` control is still
something the next person finds and wonders about, and this one is dead by his ruling. The
drawn phone on the city screen (`#cityfeed`, the panel in his frame reading @nightcount) is
the handle: tap to open, tap again to fold, Enter and Space too. The object itself is
untouched -- he said he is "very impressed with the phone", so only how it opens changed.

The comment that said the feed "carries no control, so it cannot become a tap target smaller
than a thumb" is amended rather than left contradicting the code: the WHOLE panel is the tap
target, measured at 132x349, so the reason that sentence existed is honoured by making it one
big handle rather than by having no handle at all. Nothing inside it became tappable.

## 6. THE GATE, AND TWO OF ITS OWN LEGS THAT COULD NOT SEE THEIR SUBJECT

`gates/the_bar_fits_his_glass_gate.js`, 17 legs, 0 failed, in the suite as BAR FITS GLASS.

- **A leg that passed on an invisible element.** The first cut measured the drawn phone on
  the walking screen, where it is 0x0, and the tap test PASSED ANYWAY, because a click
  dispatched at an invisible element still fires its handler. It crosses the seam first now
  and proves it got to city mode before it looks.
- **A stress that could not move a pixel.** The first inflation set `font-size` on `#menubar`
  and `.uihalf`'s `font-size:5px!important` beat it, so every "inflated" run came back
  byte-identical and looked like a pass. The gate now PROVES the type really changed
  (5px -> 6.5px) before it scores the result. A stress that cannot fail is not a test.

Four mutations proved, each restored: let the right-hand group shrink again, put the PHONE
chip back, take the handler off the drawn phone, and let iOS inflate the type again.

**AND THE FIRST OF THOSE TURNS ONLY ONE LEG RED, WHICH IS WORTH SAYING PLAINLY.** Making the
right-hand group shrinkable again fails the SOURCE leg and not the stress legs, because my
harness never overflows in the first place -- a group that is allowed to shrink does not
shrink when there is nothing pushing it. So the property is guarded mostly by reading the
CSS, and the stress is a floor rather than the catch. That is the same limitation as section
2: without a browser that inflates type, I cannot manufacture the pressure his phone applies.
I would rather write that down than let four green mutations imply a strength the gate does
not have.

## 7. THE COOK (rule 22)

`slices/BOHEMIA_FOUR_WAYS_THE_TOP_BAR_FITS_9_22_26.html`, registered as
`ui-four-ways-the-top-bar-fits-9-22`. His bar with his own words in it, four ways: what he
photographed with the red edge where his screen ends, the locked right-hand end that shipped,
the clock moved off the bar entirely, and one joined label instead of three. Plus the drawn
phone as its own button.
