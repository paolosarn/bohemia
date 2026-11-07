# UI 9 -- SMALLER, NEVER PAGES (11/7/26)

Rule 402 amended (ask line 481). BUILD 11/7g - SMALLER, NEVER PAGES. Corrects UI 8's 11/6g (NOTHING SCROLLS).

Paolo 11/7: 'I didn't want to scroll during any of the UI of the games. I meant find a way to make things TINIER, you don't
have to make things half the screen, like displaying new hires or anything else; the purpose was to make the UI smaller,
not just do a next page bullshit, I can't believe I had to explain that.'

He is right. UI 8 read 'nothing scrolls' as 'cut it into pages and tabs'. Every page, tab and next-page control UI 8 added
is out, and so are the origins' arrows (UI 3's one-card carousel was a next-page control too).

## The two floors (measured in CSS px on the phone profile)

- TEXT: no word under 11 px. Apple's smallest text style (Caption 2) is 11 pt, and one CSS px is one point on an iPhone.
  The measure is the drawn size: font size x CSS zoom x any transform's scale; words kept only for a screen reader (clipped
  to one pixel) are not on his glass and are not counted.
- TAP: no press whose short side is under 44 px. Two named exceptions, each with its reason, in the gate: a stat's row is
  read, never pressed to act (its tap says what the number is); the line's nine places across a glass under 412 px may be
  narrower (never under 36 wide, always 44 tall): nine 44s and their gaps do not fit 390, the line is the fight's nine
  columns, and WCAG 2.2's AA target floor is 24 px (its AAA 44).

## Measured before (UI 8's build 11/6g) and now

Phone upright 390 x 844 / phone on its side 844 x 390 / laptop 1440 x 900. 'Glass' is the share of the screen the sheet covers.

| screen | before | now |
|---|---|---|
| the hall (the demo's town, 4 to 8 men) | 8 / 5 / 4 PAGES, ONE man on the glass, his card 386 px tall; 96% / 89% / 70% of the glass; smallest word 10 / 8.1 / 10 px | every man on the glass at once, a ROW a man (69 px upright, 64 on its side); 4 men 58% / 71% / 24% of the glass; smallest word 11 |
| the fullest hall (a fortress, the fair, the recruiter: 10 men) | 11 pages | all 10 on one glass: 88% upright (rows 54 px), 69% on its side (three columns, rows 51 px), 31% laptop |
| the smith, the armourer | 2 / 2-3 / 2 pages; words at 9 px | one sheet: 71% / 73% / 38%; the shelf and the bag in 44 px cells, side by side with the strip on its side |
| the stall | 1 / 2 / 1 pages; words at 9 px | one sheet 57% / 68%; words 11 |
| the board, the bar, the barber, the clinic | the board 62% / 62% | the board 33% / 45%, the bar 29%, the barber 26%: every small sheet under half the glass |
| the settings card | FOUR TABS on all three | ONE card, every row on the glass at once (two columns upright, five on its side, six on the laptop); smallest word 11 |
| the stash, a bag of 40 | 7 pages, 6 of 40 on the glass / 7 pages / fits | 40 of 40 on all three |
| a full company (20 men, 12 in a fight) and a full stash (36) | 18 of 20 men drawn ANYWHERE (the line holds 18; two men were nowhere on the screen) | 20 of 20 (the KEPT row, Battle Brothers' reserve row) and 36 of 36, on all three |
| the origins | 1 of 15 on the glass, arrows and '2 OF 15' | 15 of 15 as plates, the picked one lit and its facts under them; words on the picks at 11 (were 8 to 10) |

## What changed

- slices/bohemia_ui_no_scroll.js (UI's, rewritten): the pager and the tabs are gone. BohemiaNoScroll.fit(box) dresses a box
  dense (class ns-d1) and, if it still runs past its glass, takes the next step (ns-d2, ns-d3) that moves words off the
  rows into the held finger's tip; never a page. A box that cannot fit even then is left locked and SAID in state(box).over,
  so the gate fails it out loud. state() always says pages 1; reveal() says yes (nothing is ever off the glass); off(true)
  is the checker's switch (every dense look off, so the gate can watch the scroll come back).
  - THE HALL: a man is a row (grid: face / name and trade / his ceiling, trait, gun / his eight on one line with the stars
    as marks / HIRE with the price and the night as the bar's battery mark). His figure, his trait's words, why he costs
    more and his own line are on a held finger (data-tip on the row; the card's own words joined, draft:true). Step two: the
    reach and the trait's numbers go to the tip, his face spans the row (rows 50 px). Step three on a short glass: three
    columns, his eight in two lines of four. The camp staff and NOT NOW side by side. RUN TWO's settlement file untouched:
    the row's parts are moved into one line (ns-hl) inside the same card, every class and data attribute the gates read
    kept; the button's words kept letter for letter ('65 batteries  ·  3 batteries a night'), the word drawn as the mark.
  - THE SHOPS: the shelf and the bag are 44 px cells (icon and price; the name is the piece's card on a tap); KEEP and
    YOURS a green mark; on its side the shelf, the bag and the strip stand side by side (ns-shelf / ns-bag, cut again on
    every open); the strip's faces wrap, never a strip that slides.
  - EVERY SHEET: the keeper's face 40 px, his words three lines at most (the whole line on a held finger).
  - THE SETTINGS CARD: one grid, two columns upright, more on a wide card; a row of three or more choices takes two places
    so each keeps a thumb's width; the phone's rows are the card's rows; step two packs short rows into the holes.
  - THE CREW SCREEN: every word to 11 (the slots' names were 7 px); the bag in 44 px cells; step two puts his eight in two
    short columns; step three makes his slots a thumb tall, puts the comparison line over the stash's heading while it
    speaks, his name and level on one line; on its side the KEPT and LAID UP men stand right of the line and the stash's
    buttons beside the bag (nine across, four rows for 36).
- slices/BOHEMIA_ROSTER_SCREEN.html (UI's): __THE_WHOLE_COMPANY_ON_THE_GLASS__: the KEPT row. The line holds eighteen
  places, the company twenty, so a nineteenth man stood nowhere. Every living man not in the line and not laid up stands
  in KEPT (draft:true); a tap picks him, a drag onto a place puts him in the line and the man there comes down to KEPT.
- slices/bohemia_ui_crashbox.js (UI's): __SMALLER_NEVER_PAGES__: the fifteen origins as plates in a grid (five across
  upright, four on its side), the difficulty a stripe in its colour, the picked one lit gold; its name and difficulty in
  the heading's own small line (as every row says its pick), its words and numbers in a box under the plates. UI 8's
  swipe and wheel turning and UI 3's arrows are gone; the heading no longer says SWIPE or SCROLL. The frozen menu (rule
  358) is untouched: THE LOADING MENU IS FROZEN 10/0.

## The gate

gates/scrolling_is_illegal_gate.js, re-aimed (the name kept; in the suite as SCROLLING IS ILLEGAL). UI 8's version passed
with pages ('every press on SOME page'); that reading is dead: a list fits when every one of it is on the glass AT ONCE.
tools/bohemia_no_scroll.js gains SMALL_SRC / small() / faults(): the drawn size of every word, every pager or tab he did
not ask for (UI 8's strip and tabs, the old arrows, any tablist that is not a sort, a press named next page, a lone arrow,
the words 'PAGE n OF m' or 'n OF m'), every press under the thumb, the share of the glass.

RESULTS: (filled at the end of the round below)

## Re-aimed (one line each, marked RE-AIMED 11/7)

- settings_gate.js and settings_in_our_materials_gate.js: one card again, read in one pass (UI 8 read it tab by tab).
- the_best_recruit_at_the_top_gate.js: the hall is every man on the glass; it no longer switches the pager off to read them.
- the_shop_taps_gate.js: reveal() is kept and says yes; every piece is on the glass.

[bb Battle Brothers: the hiring screen is one list of every recruit with his portrait and price; the market and the stash
are fixed grids of small cells; the options are one panel; the company screen keeps a reserve row under the formation.]
[analog horror: the hall's list reads like a parole board's clipboard, a row a man, a photo stapled to each.]
