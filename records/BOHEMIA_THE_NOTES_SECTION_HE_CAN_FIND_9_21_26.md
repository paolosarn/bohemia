# BOHEMIA -- THE NOTES SECTION HE CAN FIND (UI lane 11, 9/21/26, row [copy notes])

Paolo 9/21, verbatim (records/BOHEMIA_PAOLO_CARDS_STILL_POP_AND_NO_NOTES_9_21_26.md):
"I still don't see a note section anywhere. A collapsible note section that I can copy and
paste when I am done playing the demo into you."

Rule 18(f): his direct ask, tiny, touches none of the three (loading, walking, the fight),
so it ships while the rest of this lane holds. Rule 22: the round also cooked a panel and
registered it in the VOTE tab.

## 1. HE WAS RIGHT, AND THE CAUSE WAS NOT THE SIZE

I shipped the notes control on 9/20 with a gate that was GREEN, and he could not find it.
So the gate was measuring the wrong thing. It checked the mark against a number THIS LANE
PICKED ("5 px of ink, the same as its neighbours") instead of against the only thing that
decides whether a control is findable, which is the controls beside it.

Measured on a fresh cut of the demo, every child of `#barright`:

    #musbtn    MUSIC    83.8 x 12.3   plate yes   ink rgb(216,196,154)
    #savebtn   SAVE     23.6 x 12.3   plate yes   ink rgb(216,196,154)
    #phonebtn  PHONE    27.0 x 12.3   plate yes   ink rgb(25,19,8) on gold
    #notebtn   (pencil) 44.0 x 44.0   plate NO    ink rgb(184,154,106)

It was the only child of that bar with no body, the only one that was not a word, and the
dimmest thing up there. **A control with no body does not read as a control.** That is this
lane's own object law -- a lit rim above, a dark base below, the side of the thing
underneath -- broken by this lane's own hand, in the same file where the law is written
down. The screenshot of the real bar shows three worded plates and then a grey smudge.

"Tiniest" was his word for the FOOTPRINT. The old gate's leg, "its ink is the smallest in
the bar", is satisfied perfectly by something invisible, which is exactly what shipped.

## 2. WHAT SHIPPED

**THE WORD, ON THE SAME PLATE SAVE WEARS.** `#noteplate` was added to the skin's one
control rule rather than given a private copy of the look, so it can never drift away from
SAVE again. It reads NOTES, and NOTES 3 once he has three, because a number beside it is
the only proof from outside the box that what he typed went anywhere.

**THE 44 REACH STAYS, AND THE FAR RIGHT IS THE ONE PLACE IN THAT BAR WHERE IT IS FREE.**
This file already measured that a 44 pad on a chip lies across its NEIGHBOUR and makes a
tap do the wrong thing -- that is why the reach pads are off everywhere else and the chips
are 12 px tall. The last chip at the right-hand end has the bar's own edge on one side and
nothing under it, so a full thumb costs nobody anything. And that is exactly where he asked
for it. The gate proves the no-theft both ways by asking the page who owns each neighbour's
centre pixel.

**IT TOGGLES.** His word was "collapsible". Tap opens the section and the game stops; tap
the same chip again and it folds away, keeping whatever he had typed. The chip goes gold
while it is open, and it is in the bar the whole play either way.

**COPY ALL.** He asked to copy and paste into the manager's chat, so the clipboard is the
road and the .txt is the second one. It is never a dead button: `navigator.clipboard` needs
a secure context and a gesture and either can be missing, so there is a selection fallback,
and the chip SAYS which happened ("COPIED 1 NOTE" or "COULD NOT COPY - USE EXPORT"). A
button that silently does nothing is the defect this lane wrote down on 9/15: a dead button
is indistinguishable from a close button.

**AND COPY ALL SAVES WHAT IS STILL IN THE BOX FIRST.** He types a thought, reaches for COPY
ALL, and without this the one thought he is looking at is the only one not on the
clipboard. Found by reading the order he would actually do it in, not by a test failing.

One function builds the text now, so copy and export cannot drift into two slightly
different records of what he wrote.

## 3. THE GATE

`gates/the_notes_section_gate.js`, 28 legs, 0 failed, in the suite as NOTES SECTION. It runs
on a FRESH CUT of the demo, never the committed copy, which lags (rule 14a). Every leg
compares the control to its neighbours or to his sentence, never to a number I chose:

  it says a WORD and the word is NOTES; every other chip in the bar has a plate and so does
  it; its ink is no dimmer than the dimmest chip beside it (luminance, not a colour name);
  a whole thumb reaches it AND that reach steals nobody else's centre AND it owns its own;
  it is the last thing at the right-hand end; it starts collapsed, one tap opens it, the
  chip stays in the bar and shows it is open, a second tap collapses it; COPY ALL saves what
  was in the box first; the chip says what happened; and THE CLIPBOARD IS READ BACK rather
  than assumed.

AND FOUR LEGS WERE ADDED BEFORE THIS SHIPPED, because half the row was about to go out
proved by reading. The row says the control is there "on every screen of the demo", and I
had only ever tested the walking screen. The bar has no mode-dependent hiding rule and
#barright is display:flex unconditionally, so READING the file says the chip survives the
seam -- and reading the file is the exact thing this round is about not doing. The gate
crosses the seam now the way a thumb does, one squeeze, and asks the page again: mode really
became city, the chip is still in the bar, it still says NOTES, and a thumb still reaches it.
It does, but I did not know that until I looked.

Five mutations proved, each restored: take the plate off (1 red), put the bare pencil back
(2 red), kill the toggle so it only opens (1 red), stop COPY ALL saving what is in the box
(3 red), make the clipboard write silently do nothing while still reporting success (1 red
-- the read-back, which is the leg that matters and the only one that can catch a lie).

ONE LEG OF THIS GATE WAS WRONG ON ITS FIRST RUN and is recorded rather than quietly fixed:
the no-theft check reported `devbtn -> DIV` as a stolen centre. `#devbtn` (TOOLS) is 0x0 in
the demo, and a zero-size element's "centre" is a point in the bar itself. A control nobody
can see is not a control anybody can mis-tap. The leg skips zero-size children now.

AND THE 9/20 GATE'S OWN LEG IS REPLACED, not deleted. `the_notes_button_gate.js` kept the
pause and the stamp (22/0) and its ink leg now reads the plate and asks a different
question: not "is it the smallest" but "is it exactly the size of the chips beside it".
No louder, and no quieter.

## 4. THE COOK (rule 22)

`slices/BOHEMIA_FIVE_WAYS_THE_NOTES_SECTION_SITS_9_21_26.html`, registered as
`ui-five-ways-the-notes-section-sits-9-21`. The real bar at 390 px, nothing scaled: what he
could not find, the word on a plate that shipped, a gold one, one with a lamp that counts,
one underlined with no plate. Plus three shapes for the section itself (a sheet up from the
bottom, a card over the middle, a rail down the right) with the shipped one named.

A defect in that sheet, found by rendering it and looking: the rail option's buttons fell
out of the bottom of the phone and landed on the paragraph underneath, which is the option
arguing against itself for a reason that was mine and not the design's. The phone box clips
now and the rail is laid out to fit rather than trusted to.

## 5. WHAT THIS ROUND IS REALLY ABOUT

Twice now this lane has shipped something with a green gate that did not do its job for
him. The pattern is the same both times: **the gate measured the thing against a number I
chose instead of against the world the thing lives in.** 5 px of ink was a true number and
a useless one. The honest question was never "how big is it" but "does it look like the
other controls", and that question can only be asked by measuring the other controls.

## 6. AND [flaky leg], SHIPPED THE SAME ROUND

The coordinator's row (9/21b) says the vote tab gate's `#setvote` leg fails about one run in
four on a clean tree, and that FACTIONS (df8dd14d) and WORDS (ee5ad2af) both nearly claimed
that red as their own. I hit it too in this round and wrote it off as load. It was not load,
and it was not the game.

**THE GATE MADE THE RACE.** `#gearbtn.on` is painted by a `setInterval`, and the cold open is
still unwinding when it lands: the NOT NOW tap starts the overlay closing but `#openWrap`
keeps the gear's PIXEL for a few more frames. Playwright clicks the CENTRE of the element it
is handed, so on the unlucky runs the click went into the overlay, settings never opened, and
the next line sat on a ten-second timer and called the game broken.

**A TIMER IS NOT A SIGNAL.** The leg now waits for the page's own answer to the only question
that matters -- is the gear the thing under its own centre pixel -- then clicks, then waits
for THE SETTINGS PANEL'S OWN STATE (`#setwrap.on`) before looking for a child of it to become
measurable. Same shape as the driver's own `clearAxis`, which exists for exactly this reason
(rule 14g, trap 6), reused rather than reinvented. The ten-second timeout that turned a slow
frame into a red is gone.

**AND THE FIRST RUN AFTER THAT FIX WAS STILL RED, WHICH IS THE PART WORTH WRITING DOWN.** The
`#setvote` leg passed; a DIFFERENT leg had gone red in the meantime, on main, from another
lane. DIRECTION registered its round-3 fight verdict (370820aa) with `kind: "verdict"`, which
was not in this gate's allowed-kind list. Two reds in the same gate, one after the other,
with different causes -- and for about a minute I read the second as evidence that my fix for
the first had not worked. **A red in the same place is not the same red.**

The kind was added rather than bounced. Every other kind in that list is a CANDIDATE he picks
between; a verdict is a CALL he agrees with or does not, which is a real difference and a real
thing to ask him. The tab already rendered it, so the only thing standing in DIRECTION's way
was a word in my list. The registry's own readme carries the same list and was updated with
it, so the next lane does not have to guess. SOUNDS' `sound` kind (6962fc74) is kept.

## 7. NAMED, NOT FIXED: THE PUBLISHED SURFACE IS OVER ITS CAP ON CLEAN MAIN

261 MB against a 260 MB cap. SOUNDS named it first (cb4214e7). Measured with AND without this
diff: 261 MB both ways, so it is not this lane's, and the one new sheet does not move the
number.

Where the megabytes are, measured: `slices` 152 MB, `engine` 5 MB, `records/target` 107 MB --
and 303 PNGs inside `records/target` make 105 MB of that 107. **Why that folder is published
at all is a vote-tab decision, which makes it this lane's to name:** the registry's own readme
says it lives in `records/target/` "because that is one of the three folders GitHub Pages
publishes". So 105 MB of reference screenshots are shipped to the live site so that a 40 KB
JSON and a handful of vote images can be fetched.

The fix is one line of architecture rather than a cleanup: publish `records/target/vote/` and
the registry, not the whole folder. That is `_config.yml` AND the workflow's copy list
together (pages_publish_gate binds them so neither can drift), which is a shared file other
lanes are in the middle of. Named and not touched in a round that already shipped two rows.
It buys back about 100 MB.
