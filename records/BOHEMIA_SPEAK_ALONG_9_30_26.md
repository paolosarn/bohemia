# [speak along] -- HIS COMMENT ON A FACE IS THE BRIEF, PROVEN, NOT JUST PRACTICED
# PORTRAIT (chat 20), 9/30/26. Coordinator 9/14: every face candidate carries his
# comment back to this chat; each comment becomes the next candidate for that
# face, quoting his words on the card so he sees his note answered. Ship test:
# he comments on a face, the next round's VOTE tab shows that face redone with
# his words on it.

## WHAT WAS ALREADY TRUE, CHECKED BEFORE BUILDING ANYTHING
This lane has, in practice, answered every comment Paolo ever left on a
portrait card. Read all 19 verdicts tagged `lane` reachable from `portrait-`
ids in the VOTE registry; 11 carry a real comment longer than a few words.
Traced each one forward by hand first:

    portrait-room-nina/marco/ray/denise-9-21   "Dogshit... more analog horror"
    portrait-light-nina-9-21   "way more customizations... eyes not all white"
    portrait-face-nina-9-21    "not close to anything... so ugly"
      -> [customizations first] (portrait-eight-dials-9-22), claimed FIRST LINE
         the same round these landed, quoting the exact sentence as its reason.

    portrait-eight-dials-9-22  "it should all come with a slider"
      -> [customizations first] round 2 (portrait-every-dial-a-slider-9-24),
         all 32 dials, the row's own title answering this sentence directly.

    portrait-pick-your-man-out-9-27  "equipment on the head has to reflect"
    portrait-the-bust-9-24           "background portraits can change"
    portrait-every-dial-a-slider-9-24 "look how Battle Brothers does it"
    portrait-the-face-at-rest-9-24   "slightly looking off, not directly
                                       at the center"
      -> [head and gear] (portrait-the-head-and-the-gear-9-28), shipped the
         round after all four landed, each part answering one of them by name.

Every single comment already has a real answer. The row was never actually
blocked; nobody had written down the connection or built a way to check it
holds, which is what "measure your part" (rule 22b) exists to stop happening
by accident.

## THE ACTUAL GAP, FOUND BY CHECKING RATHER THAN ASSUMING
Rule 14 says "quoting his words on the card." Checked what the answering
cards actually contain, not what the board-row prose (mine) claims:

- `PORTRAIT_EVERY_DIAL_A_SLIDER.html` already does this correctly -- it has
  had a `.said` block with his literal sentence in quotation marks since the
  round it shipped. This lane had already built the right pattern once.
- `PORTRAIT_THE_HEAD_AND_THE_GEAR.html` did NOT. It cited rule 37i by number
  and paraphrased the substance well, but never put his own words on the
  card. Four comments fed that row and none of them were quoted on it.

Fixed by adding four `.said` blocks to that existing page, in the same style
the older card already established (REUSE-FIRST: the CSS class already
existed, unused on that file). Nothing about the underlying build changed;
this is the card actually saying what it always should have said.

## THE MECHANISM, SO THIS DOES NOT SILENTLY ROT AGAIN
`records/target/BOHEMIA_PORTRAIT_COMMENTS_ANSWERED.json`: one row per
comment, the id of the item that answers it, and (for anything that shipped
as a real page) the exact phrase from his own words that must be found on
that page. `gates/speak_along_gate.js` reads it and checks, against the real
files on disk, not the registry's own short why-text (which TALK TO HIM LIKE
A PERSON deliberately simplifies to eighth-grade words and will never carry
his sentence verbatim -- checking that field would prove nothing):

1. every non-trivial portrait comment has a ledger row (nothing left
   unaccounted);
2. no ledger row cites a comment that was never actually said (protects the
   ledger the other direction, against it rotting into fiction);
3. every citation names a real item in the registry, never an invented one;
4. every quoted phrase is found, verbatim, in the answering page's own HTML
   file, read off disk at gate time;
5. a row with no exact quote (the one item that only ever shipped as a flat
   image, with no text surface to check) says so honestly in its own note
   rather than faking a pass.

MUTATION-PROVEN: redirected a quote-bearing citation to a real but wrong
page (one that never said that sentence) and the gate caught it, 5 passed /
1 failed; restored, back to 6/0.

## WHAT THIS DOES NOT COVER, NAMED RATHER THAN HIDDEN
One comment's answer shipped only as a PNG with no HTML page behind it
(`portrait-eight-dials-9-22`). There is no text surface on that file for a
machine to search, so the gate reports it as "no text surface to check,"
never as a pass. Regenerating that art with a caption baked in would close
the gap completely; it is backlog, not done this round -- the honest
next line if the gate's own report is ever read as "fully verified" when it
is not.

## COOKED (rule 22)
`portrait-speak-along-9-30`, registered in the VOTE tab: the eleven
comment/answer pairs, plainly, with the one unverifiable row named as such.
Nothing to vote on -- this is proof of work, not a fresh candidate; the
card asks him to flag anything he feels was never actually answered.

## GATES
speak_along_gate (new) 6/0, mutation-proven. talking_portrait 34/0,
portrait_haircut 15/0, family 17/0, face_maker 16/0, hair 39/0, hairline
12/0, hair_graveyard 13/0, craft_law 39/0, alpha_loads 20/0,
character_in_the_vote_tab 9/0, handoff 9/0, vote_tab 30/1 (pre-existing,
two coordinator items, checked and not mine).
