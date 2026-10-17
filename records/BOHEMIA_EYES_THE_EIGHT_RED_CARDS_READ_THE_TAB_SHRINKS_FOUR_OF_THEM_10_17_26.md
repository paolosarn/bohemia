# EYES READS THE EIGHT RED CARDS' BEFORE-AND-AFTER: THE TAB SHRINKS FOUR OF THEM (10/17/26, rule 89, rule 110's big swing)

THE EIGHT: the triage file's red tags with no verdict in the registry (records/target/BOHEMIA_VOTE_TRIAGE.json against
BOHEMIA_VOTE_REGISTRY.json verdicts[]), the coordinator's sweep AL list: cook4-the-straight-roof-10-13,
cook2-stretch-the-pack-47-10-13, cook-the-whole-bank-10-13, run-the-map-people-come-baked-10-13, ui-the-flip-off-the-face-10-11,
animation-the-party-walks-as-one-10-11, combat-both-teams-the-map-not-black-10-11, sounds-the-night-has-insects-10-5.

THE QUESTION (rule 89): can a person see, or hear, the difference, as he meets it, on his phone, in the VOTE tab.

## THE INSTRUMENTS (this lane's own)
1. The real perceptual change share between each card's OWN before and after: YIQ distance (Kotsarenko and Ramos 2010) with the
   anti-aliasing exclusion, imported unchanged from `tools/bohemia_eyes_before_and_after_check_10_10_26.py`.
2. THE TAB'S OWN SCALE, measured not guessed: `slices/BOHEMIA_VOTE_TAB.html` draws an image card at `max-width:100%` inside a
   680 px wrap with 12 px padding, so on a 390 pt phone at 3x a card W px wide is shown at (390-24)*3 = 1,098 device px, i.e.
   1,098/W phone pixels per card pixel. Rule 89 asks for one art pixel to one phone pixel; a card wider than 1,098 px is shrunk
   before he sees it and its text shrinks with it.
3. The sound: the clip rendered from SOUNDS' one copy of the generator (`engine/bohemia_horror_sounds.js` nightInsects, the VOTE
   page's own call: 8 s, 90 a second) through a stub AudioContext (`tools/bohemia_eyes_the_insects_render_10_17_26.js`), measured
   beside a white noise put through the SAME 3 to 6 kHz band and normalisation. Kurtosis: a Gaussian hiss sits at 3.0; a click
   train is far above it.
4. The time-to-play claim: PLUMBER's `tools/bohemia_first_load.js` readOnce at 4x on the committed demo (the same build the card
   measures, 10/13b).

Tools: `tools/bohemia_eyes_the_eight_red_cards_read_10_17_26.py` (the numbers, records/eyes_eight_red_cards/report.json) and
`tools/bohemia_eyes_the_two_strips_10_17_26.py` (the picture, slices/vote/EYES_THE_EIGHT_RED_CARDS_READ.png, registered as
`eyes-the-eight-red-cards-read-10-17`).

## THE EIGHT LINES

| card | card px | shown at (of 1:1) | changed (real) | the line |
|---|---|---|---|---|
| the straight roofs | 1430 x 581 | 0.77 | 20.1% of the ranch | VISIBLE. The pointed ends are gone and the roof is one straight run on the whole ranch; it still reads at 0.77. (The before is the card it redoes, cook4-a-house-a-man-can-live-in-10-11, same layout, same crop.) |
| the 47 corners | 1660 x 1260 | 0.66 | 63.7% of the plan | VISIBLE. The raised curb and rounded corners read on every edge, the one-square island included. |
| the whole bank | 1020 x 760 | 1.08 | no pair exists | NOT A PICTURE. The before is "four unopened files"; the table's letters are about 11 px tall on the card, about 4 pt on his phone: the count he is being shown cannot be read without pinching. A text item (his 9/21: text items are boring). |
| the party baked | 1100 x 505 | 1.00 | a chart | VISIBLE, A CHART. The three bars are 2 to 1. Re-measured: first-load at 4x on the same build gives NEW GAME ready at **14.6 s** (fcp 2.9 s, title 2.1 s, buttons 3.2 s), which sits under the card's 16.1 s to the first block. The two instruments agree this time (rule 90's standing job: the 48 s vs 22 s gap of 10/10 is not there on this build). |
| the flip off the face | 1230 x 1874 | 0.89 | 27.2% of the phone | VISIBLE. The three family cards are gone from the bottom of the phone and the feed fills it. |
| the party walks as one | 5760 x 1320 (12 x 4 frames of 480 x 330) | the page plays it at 1:1 (160 pt frames) | 2.6% of each frame, mean of 48; 16% inside the party's own box (193 x 148 px) | VISIBLE, SMALL. The pole and the yellow flag are gone and the two walk closer, inside a party that is one small thing on the frame; a person sees it if they look at the party, which the page's label tells them to. |
| both teams, the map not black | 2910 x 6162 | 0.38 | 80.4% (upright 87.6, sideways 70.9, computer 82.8) | VISIBLE, TOO SMALL. Black-to-map reads at any size; but at 0.38 the men are about 11 px tall on his phone and nothing else on the card reads. |
| the night has insects | sound | | silence before; after: kurtosis 31.2 vs the hiss control's 2.8; crest 23 dB vs 11; 80.5% of every second quiet between clicks; 720 clicks in 8 s | AUDIBLE, and many clicks, not a hiss. The card's own claim holds under measurement. |

## THE ONE THING UNDER ALL EIGHT
Four of the seven pictures are wider than 1,098 px (the fight card by 2.6 times), so the tab shrinks them before he sees them and
they never reach him at one art pixel to one phone pixel. The makers' pictures were right; the glass between him and them is not.
Bounce-back to UI (rule 10's one line): [eyes: cards shrink].

## NAMED, NOT HIDDEN
- The tab-scale number assumes his phone is the 390 pt class (the driver's own profile); on a wider phone the scale is a little
  larger, never 1:1 for the four wide cards.
- The party card's 2.6% is the honest frame number; the 16% inside the party's box is the number a person's eye uses, because
  the page's label points them at the party. Both are printed.
- The bank card has no picture pair, so no change share was computed; that absence is the finding.

## PROOF
`node tools/bohemia_eyes_the_insects_render_10_17_26.js`, `python3 tools/bohemia_eyes_the_eight_red_cards_read_10_17_26.py`,
`python3 tools/bohemia_eyes_the_two_strips_10_17_26.py`; first-load: `readOnce(open, {throttle: 4})` on BOHEMIA_DEMO.html.
