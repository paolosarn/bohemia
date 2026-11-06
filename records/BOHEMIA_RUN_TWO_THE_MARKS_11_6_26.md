# THE VOTE MARKS (RUN TWO, 11/6/26; rule 408(c), rule 417(b); ask line 463)

Paolo 11/4: "every time I see you make art a lot of times it's just placeholder shit... I just want the first time you make
art to be the final." Rule 408(c): A PLACEHOLDER IS NEVER SHOWN AS A CANDIDATE: it is marked as one in the VOTE tab or not
shown. DIRECTION wrote what the tab draws (records/BOHEMIA_DIRECTION_THE_FIRST_TIME_IS_THE_FINAL_TIME_11_6_26.md PART 4);
PLUMBER 5 built the gate leg FIRST TIME FINAL F1 to F8 (gates/vote_tab_gate.js); the tab is RUN TWO's.

## WHAT HE WALKS INTO, MEASURED (the committed registry and triage on main 55df870a, his phone 390 x 844, nothing voted)

| | before (main 55df870a) | now (BUILD 11/6q) |
|---|---|---|
| cards on his list | 39 (12 in front, 27 behind MORE) | 4 in front, nothing behind MORE (5 with this round's own card) |
| of them art cards | 38 | 3 (all stand-ins) |
| marked stand_in in the registry | 3, drawn with no mark at all | 3, each under the band STAND-IN, NOT THE LOOK |
| golden / made_from | 0 / 0 | 0 / 0 (none made yet) |
| unmarked art held back | 0 (all 35 drawn) | 35, counted in one line, never drawn |
| held back, by lane | | combat 19, arena 4, ui 7 3, world 3, hires 2, tuning 2, home 1, ui 1 |
| with the sort file missing | 181 drawn | 53 drawn, 128 unmarked art held (exactly the 128 waiting art cards PLUMBER froze in the baseline) |
| 'PLACEHOLDER' in a title in his YES list | stripped (DIRECTION counted 68 cards wearing it) | kept |

The picture (the VOTE card run2-the-marks-11-6): records/target/run2_the_marks_11_6/before_and_now.webp, the old tab on
the left, the new on the right, from the tab's own screen.

## WHAT THE TAB DOES NOW (slices/BOHEMIA_VOTE_TAB.html)

- THE MARK is the card's own "stage" in the registry: golden, made_from or stand_in. Nothing else counts: the word
  PLACEHOLDER (or STAND-IN, or CANDIDATE) in a title is not a mark.
- AN ART CARD is DIRECTION's (the gate's ftfArt): kind tile, animation, outfit, face or haircut; a ui card shown as an image
  or a page; a redo of one of those. A song, a sound, a line, a verdict, a ui card in words: not art, never held.
- GOLDEN: a gold chip after the kind, a gold frame, and under the title 'THE FIRST <ART KIND> MADE TO THE BAR. ONE
  QUESTION: IS THIS THE LOOK?' with DIRECTION's 'beside the bar' line below it.
- MADE FROM: a chip, and 'MADE THE WAY OF <the golden card's title>, THE PIECE YOU PASSED.'
- STAND-IN: a striped band FIRST on the card, 'STAND-IN, NOT THE LOOK / It is here to show how a thing works, where it goes
  or how big it is. Vote on that, not on how it looks.'; the card grey; its picture grey on the card and at full size (the
  full view's hint starts STAND-IN, NOT THE LOOK). The thumbs and the star stay (the gate holds four buttons on every card).
- NO MARK, NOT SHOWN, old or new. The card stays in the registry; the tab counts what it holds back after the votes and the
  sort ('35 ART PIECES ARE HELD BACK. Their makers have not said yet if each is the real look or a stand-in, so they wait
  off your list until they are marked.'), so he knows why the list is short. window.__voteHeld carries the number.
- WHY THE OLD ONES ARE HELD TOO (not only the cards made after the leg): DIRECTION's rule says 'A card with no mark is not
  shown', F8 says the waiting art is 'not grandfathered silently', and the coordinator's job said the same. They come back
  the moment a stage is on them.
- A found bug, fixed: the fold button's display rule beat its hidden flag, so with nothing behind it the tab read 'MORE 0'.
  It never showed before because something always waited behind the fold.

## FOR DIRECTION (the F8 list): HOW THE OLD CARDS COME BACK

The tab reads the stage ON THE CARD, in records/target/BOHEMIA_VOTE_REGISTRY.json. Your list file
(records/BOHEMIA_FIRST_TIME_FINAL_STAGES.json) is outside records/target/, so the site never publishes it (the publish list's
roots are slices/, engine/, records/target/) and the live tab could never read it. So when you write the list, put the same
stage on each card in the registry too (one "stage" field per card; F1 accepts a valid stage on an old card, and F8 reads
the card's stage first). Until then the 128 waiting art cards stay held, and his list is the stand-ins plus whatever a lane
marks.

## GATES (one at a time, the ones this touches)

- THE VOTE TAB 62/4 (was 57/6 on main): FIRST TIME FINAL F6 THE BAND and F7 NO MARK, NOT SHOWN green; F1 to F5 green; F8
  NOT ARMED (no list yet). New: the tab holds back exactly the unmarked art and says how many (35); THE MARKS (a planted
  golden and made_from drawn with chip, kind, DIRECTION's line, the golden named; the band is the stand-in's first line);
  THE WORD STAYS (a YES titled PLACEHOLDER keeps the word). Re-aimed: the queue legs count what the tab draws; RUN TWO's
  planted cards (NEW CARDS SHOW FIRST, the redo probe) carry stage stand_in, since a ui picture or a redo of art is an art
  card and F7 would rightly hide it. THE 4 REDS ARE MAIN'S, NOT THIS LANE'S: two DYNASTY cards whose why does not say where
  you see it (dynasty-flip-at-crisis-10-9, dynasty-animal-era-10-10); the alpha landing on VOTE after BEGIN, twice; the
  gear's VOTE door (a 90 s timeout). Same four as PLUMBER 5 measured.
- THE CARD I NAME IS ON HIS SCREEN 24/2, as on main: T0 runs the new tab's script and draws 4 on his first screen; R3 (the
  coordinator's newest ON HIS SCREEN list names 12 cards he already voted) and B1 (two SOUNDS rows) are main's.
- ALPHA LOADS 20/0 (the stamp).

## NOT DONE, ON PURPOSE

- No card was given a stage by this lane but its own: every making lane marks its own card; DIRECTION's list marks the old.
- The demo was not re-cut: the demo frames the tab by its file (data-src="BOHEMIA_VOTE_TAB.html"), so the tab reaches it with
  no cut, and rule 9/20 keeps the VOTE tab out of the demo anyway.
