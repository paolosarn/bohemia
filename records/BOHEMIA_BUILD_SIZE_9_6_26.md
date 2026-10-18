# BOHEMIA -- WHAT IS IN THE THING WE SERVE (2026-10-09)

PLUMBER lane, VAMILY row [slim build] SLIM-THE-BUILD. Written by the tool, never typed, so
the numbers and the budget at the bottom come out of one run and cannot disagree.

NOTHING WAS REMOVED TO WRITE THIS, and this lane cannot remove any of it: slices/ content is
not this chat's to touch. This is the record the row asks for BEFORE anybody removes anything.

## THE HEADLINE

  the site we publish          463.82 MB in 1571 files
  reachable from the game      158.52 MB in 228 files
  REACHABLE FROM NOTHING       305.31 MB in 1343 files

A third of what we serve to the open internet cannot be opened from the alpha or the demo by
any path: not a tab, not an iframe, not a link, not a fetch. It is old judge pages, old
galleries and old proofs, still sitting in the folder Pages publishes wholesale.

## AND THE ROW'S OWN NUMBER WAS STALE

The row says "what is in the 4.6 MB and the 11 MB". The alpha is not 11 MB any more:

  the alpha    5.99 MB raw, 2.37 MB gzipped
  the demo     3.46 MB raw, 1.14 MB gzipped

The 11 MB was true when the row was written and the payload-wall work has already been done
(the 8/2 lane moved 35.76 MB of inlined city out to a sibling page). Worth saying plainly so
nobody goes hunting for seven megabytes that are not there.

## WHAT IS ACTUALLY IN THE FILE

  COMBAT_B64                    2.55 MB   1.24 MB gzipped
  everything else (markup, s    1.58 MB
  script@5724051                0.47 MB   0.13 MB gzipped
  script@5107521                0.33 MB   0.11 MB gzipped
  script@5457976                0.25 MB   0.12 MB gzipped
  script@4850747                0.21 MB   0.06 MB gzipped

THE SINGLE BIGGEST THING IN BOTH FILES IS THE FIGHT. COMBAT_B64 is
2.55 MB of base64 sitting inline in the alpha AND in the demo, and it
is downloaded by every person who opens either link, before the first frame, whether or not
they ever get into a fight. Four other tabs in the same file already load their page from a
sibling with data-src and pay none of it -- the cheaper pattern is in the same file, four
times over. That is not this lane's change to make; it is the clearest one on the list.

## WHAT COULD LOAD LATER

The test: a whole other page carried inline as base64, on a tab the door does not open on.
The door opens on the walked city, so the fight and the rig workbench both qualify. The front
logo does not, because it is the first thing on screen.

  COMBAT_B64              2.55 MB   1.24 MB gzipped
  RIG_B64                 0.12 MB   0.03 MB gzipped

  TOTAL, per surface       2.67 MB raw, 1.28 MB gzipped

On the slow-4G link the speed round measured (1.6 Mbit down, about 200 KB a second), that
1.28 MB is roughly 6.5
SECONDS of staring at a blank screen before the logo, on every single cold load, for two
things most players will not touch in the first minute. The pattern to move them to already
exists in the same file four times over: the UI, VOTE, RUN and SLICE tabs each load their page
from a sibling with data-src and pay none of it.

THIS IS A HAND-OFF, NOT A PLAN. Which blocks actually move, and when, belongs to the lane that
owns the file. This lane measured it and wrote it down.

## WHAT IS DUPLICATED

1.87 MB of the published site is the same bytes twice, because
the alpha and the demo are near-identical files and both are served. THAT DUPLICATION IS
CORRECT: a demo that is a copy of the game is the point of having one. It is counted here so
it is never mistaken for waste, and so the day the two files stop matching, somebody notices.

## THE BIGGEST FILES NOTHING CAN REACH

    6.17 MB  slices/BOHEMIA_VOTE_CURRENT.html
    4.99 MB  slices/vote/COOK_THE_FAR_END_SHEET.png
    4.37 MB  slices/BOHEMIA_LIVE_SLICE_V9_7_14_26.html
    3.95 MB  records/target/PAOLO_THE_TAP_PICKS_THE_WRONG_TILE_9_8_26.png
    3.48 MB  records/target/PAOLO_CITY_MODE_9_22_26.png
    3.36 MB  slices/vote/RUN2_TRAITS_TWO_ROLLS_10_5.png
    3.29 MB  slices/vote/LIFECITY_A_DAY_ON_THE_MAP_10_9.gif
    3.00 MB  slices/BOHEMIA_LIVE_SLICE_V11_7_16_26.html
    2.52 MB  slices/vote/RUN_ONE_SONG_10_4.wav
    2.52 MB  slices/vote/COMBAT2_SETTLEMENT_PICTURES_10_4.png
    2.51 MB  slices/BOHEMIA_HOUSE_FACTORY_GALLERY_7_14_26.html
    2.30 MB  records/target/PAOLO_WHY_DOES_THE_CITY_LOOK_LIKE_THIS_9_8_26.png

Full list of all 1343 in the JSON beside this file.

## THE BUDGET THE GATE HOLDS

THE TOTAL IS NOT ONE OF THESE LINES, on purpose. gates/pages_publish_gate.js has held "the
published surface is under 260 MB" since 8/6, tied to the build timeout that killed three
deploys in a row. A second ceiling on the same number at a different value is drift: raise one
and the other still fires, and nobody knows which is the rule. One fact, one owner. This gate
reports the total, checks its own count AGREES with that neighbour's, and asserts only what
nothing else was looking at.

A ONE-WAY RATCHET, DOWN ONLY, and that is the opposite of the call made for speed on purpose.
A frame rate swings 40% between runs of an unchanged build, so a one-way ratchet there pins
the budget to the luckiest afternoon and goes red on a game nobody touched. A byte count has
no spread at all: same number on every machine, every time. So there is no headroom to leave
and no afternoon to excuse.

  reachable from nothing      <= 82675300 bytes
  the alpha                   <= 5194175 bytes (1870583 gzipped)
  the demo                    <= 3921680 bytes (1290787 gzipped)
  the biggest single block    <= 1963046 bytes

Refresh with: `node gates/bohemia_build_size.js --record`
Held by: gates/build_size_gate.js   Taken by: gates/bohemia_build_size.js
